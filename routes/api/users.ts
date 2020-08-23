import express from "express";
import { User } from "../../models";
import {
  getMissingKeys,
  encryptUserPayload,
  createToken,
  authMiddleware,
} from "../../helpers";

export const users = express.Router();

// GET User

users.get("/", authMiddleware, async (request, response) => {
  try {
    const id = request.headers["user-id"];
    const user = await User.findById(id);
    const { _id, username, email, shops } = await user.toObject();
    response.json({ _id, username, email, shops });
  } catch (e) {
    response.status(404).json({ message: "user not found" });
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

users.post("/", authMiddleware, async (request, response) => {
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
      {
        new: true,
      }
    );
    response.json(user);
  } catch (e) {
    response.status(404).json({ message: "user not found" });
  }
});

// DELETE User

users.delete("/", authMiddleware, async (request, response) => {
  const id = request.headers["user-id"];
  try {
    const user = await User.findById(id);
    await user.remove();
    response.json({ message: "ya killed ham" });
  } catch (e) {
    response.status(404).json({ message: "user not found" });
  }
});
