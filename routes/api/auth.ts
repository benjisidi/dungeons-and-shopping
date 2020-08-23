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
  const { _id, username, password, email } = await user.toObject();
  const passwordIsValid = await bcrypt.compare(request.body.password, password);
  if (!passwordIsValid) {
    return response
      .status(401)
      .json({ message: `password not valid for ${email}` });
  }
  try {
    response.json({
      token: createToken(_id),
      user: { _id, username, email },
    });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
