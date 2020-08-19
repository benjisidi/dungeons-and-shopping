import { Schema, model } from "mongoose";
import { ShopSchema } from ".";

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  shops: {
    type: [ShopSchema],
  },
});

export const User = model("User", UserSchema);
