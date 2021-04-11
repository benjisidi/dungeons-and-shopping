import { Schema, model, Document } from "mongoose";

import { Shop as IShop } from "shared-types";

interface ShopModel extends IShop, Document {}

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

export const Shop = model<ShopModel>("Shop", ShopSchema);
