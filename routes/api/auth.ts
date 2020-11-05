import express from "express";
import { User } from "../../models";
import { getMissingKeys, createToken } from "../../helpers";
import bcrypt from "bcryptjs";

export const auth = express.Router();

// AUTH User Login

auth.post("/login", async (request, response) => {
  const { missingKeys, wrongKeys } = getMissingKeys(
    ["email", "password"],
    request.body
  );
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }

  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    return response.status(404).json({ message: "user not found" });
  }
  const loggedInUser = await user.toObject();
  const passwordIsValid = await bcrypt.compare(
    request.body.password,
    user.password
  );
  if (!passwordIsValid) {
    return response
      .status(401)
      .json({ message: `password not valid for ${user.username}` });
  }
  delete loggedInUser.password;
  try {
    response.json({
      token: createToken(user._id),
      user: loggedInUser,
    });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
