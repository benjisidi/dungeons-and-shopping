import { Schema, model } from "mongoose";

const StockSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Stock = model("Stock", StockSchema);
