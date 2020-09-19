import { Schema, model } from "mongoose";
import { Shop as ShopType } from "../types";

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

export const Shop = model<ShopType>("Shop", ShopSchema);
