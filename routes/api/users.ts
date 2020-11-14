import express from "express";
import { isEmail } from "validator";

import {
  authMiddleware,
  createToken,
  encryptUserPayload,
  getMissingKeys,
  validateUser,
} from "../../helpers";
import { Item, Shop, Stock, User } from "../../models";

export const users = express.Router();

// GET User

users.get("/", authMiddleware, validateUser, async (request, response) => {
  try {
    const id = request.headers["user-id"];
    const user = await User.findById(id);
    const userResponse = await user.toObject();
    delete userResponse.password;
    response.json({ token: createToken(userResponse._id), user: userResponse });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE User

users.put("/", async (request, response) => {
  const { missingKeys, wrongKeys } = getMissingKeys(
    ["email", "password", "username"],
    request.body
  );
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  const { username, email } = request.body;
  if (!isEmail(email)) {
    return response
      .status(401)
      .json({ message: `${email} is not a valid email address` });
  }
  try {
    const usernameExists = !!(await User.findOne({ username }));
    const emailExists = !!(await User.findOne({ email }));
    switch (true) {
      case usernameExists && emailExists:
        return response.status(409).json({
          message: `listen pal, both ${username} and ${email} are taken`,
        });
      case emailExists:
        return response.status(409).json({
          message: `listen pal, ${email} is taken`,
        });
      case usernameExists:
        return response.status(409).json({
          message: `listen pal, ${username} is taken`,
        });
    }

    const newUser = new User(
      encryptUserPayload({ ...request.body, admin: false })
    );
    await newUser.save();
    const user = await newUser.toObject();
    delete user.password;
    response.json({
      token: createToken(user._id),
      user,
    });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// UPDATE User

users.post("/", authMiddleware, validateUser, async (request, response) => {
  const id = request.headers["user-id"];
  const { wrongKeys } = getMissingKeys(
    ["email", "password", "username"],
    request.body
  );
  if (wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", wrongKeys });
  }
  try {
    const user = await User.findByIdAndUpdate(
      id,
      encryptUserPayload(request.body),
      { new: true }
    );
    response.json(user);
  } catch (e) {
    if (e.code === 11000) {
      return response.status(409).json({
        message: `an account for ${request.body.username} or ${request.body.email} (or both) already exists`,
      });
    }
    response.status(400).json({ message: "something went wrong" });
  }
});

// DELETE User

users.delete("/", authMiddleware, validateUser, async (request, response) => {
  const id = request.headers["user-id"] as string;
  // you cannot delete the original admin user (so someone can always do admin things)
  if (id === "5f47e9524f9cf34360540fc5") {
    return response
      .status(401)
      .json({ message: "this user cannot be deleted" });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return response.status(401).json({ message: "user not found" });
    }
    // delete all shops, user items and stock for that user
    await Shop.deleteMany({ userId: id });
    await Stock.deleteMany({ userId: id });
    await Item.deleteMany({ userId: id, global: false });
    response.json({ message: "ya killed ham, an hus shaps" });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
