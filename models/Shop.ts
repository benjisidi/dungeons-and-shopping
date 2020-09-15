import { Schema, model } from "mongoose";

export const ShopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Shop = model("Shop", ShopSchema);
