import { Schema, model } from "mongoose";
import { User as UserType } from "../types";

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model<UserType>("User", UserSchema);
