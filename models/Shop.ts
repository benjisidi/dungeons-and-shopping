import { Schema, model } from "mongoose";

const Stock = new Schema({
  number: {
    type: Number,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
});

export const ShopSchema = new Schema({
  stock: {
    type: [Stock],
  },
});

export const Shop = model("Shop", ShopSchema);
