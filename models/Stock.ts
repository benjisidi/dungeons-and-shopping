import { Schema, model } from "mongoose";
import { Stock as IStock } from "../types";

const StockSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    max: {
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
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Stock = model<IStock>("Stock", StockSchema);
