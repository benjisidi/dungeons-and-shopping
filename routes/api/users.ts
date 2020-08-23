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
    const { _id, username, email } = await user.toObject();
    response.json({ token: createToken(_id), user: { _id, username, email } });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE User

users.post("/", async (request, response) => {
  const { missingKeys, wrongKeys } = getMissingKeys(
    ["email", "password", "username"],
    request.body
  );
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }

  const newUser = new User(encryptUserPayload(request.body));
  try {
    await newUser.save();
    const { _id, username, email } = await newUser.toObject();
    response.json({
      token: createToken(_id),
      user: { _id, username, email },
    });
  } catch (e) {
    if (e.code === 11000) {
      console.log(e);
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
    response.status(400).json({ message: "something went wrong" });
  }
});

// DELETE User

users.delete("/", authMiddleware, validateUser, async (request, response) => {
  const id = request.headers["user-id"];
  try {
    await User.findByIdAndDelete(id);
    // delete all shops for that user
    await Shop.deleteMany({ userId: id });
    response.json({ message: "ya killed ham, an hus shaps" });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
