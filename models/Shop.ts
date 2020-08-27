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
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  stock: {
    type: [Stock],
  },
});

export const Shop = model("Shop", ShopSchema);
