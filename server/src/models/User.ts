import { Schema, model, Document } from "mongoose";

import { User as IUser } from "shared-types";

interface UserModel extends IUser, Document {}

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

export const User = model<UserModel>("User", UserSchema);
