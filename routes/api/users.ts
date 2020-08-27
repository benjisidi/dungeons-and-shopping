import express from "express";
import { User, Shop } from "../../models";
import {
  getMissingKeys,
  encryptUserPayload,
  createToken,
  authMiddleware,
  validateUser,
} from "../../helpers";

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

  const newUser = new User(
    encryptUserPayload({ ...request.body, admin: false })
  );
  try {
    await newUser.save();
    const user = await newUser.toObject();
    delete user.password;
    response.json({
      token: createToken(user._id),
      user,
    });
  } catch (e) {
    if (e.code === 11000) {
      return response.status(409).json({
        message: `an account for ${request.body.username} or ${request.body.email} (or both) already exists`,
      });
    }
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
  const id = request.headers["user-id"];
  if (id === "5f42af0571720b6f54cf132d") {
    return response
      .status(401)
      .json({ message: "this user cannot be deleted" });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return response.status(401).json({ message: "user not found" });
    }
    // delete all shops for that user
    await Shop.deleteMany({ userId: id });
    response.json({ message: "ya killed ham, an hus shaps" });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
