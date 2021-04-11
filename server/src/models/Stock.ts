import { Schema, model, Document } from "mongoose";

import { Stock as IStock } from "shared-types";

export interface StockModel extends IStock, Document {}

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

export const Stock = model<StockModel>("Stock", StockSchema);
