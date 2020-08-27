import { Schema, model } from "mongoose";

export const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    global: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Item = model("Item", ItemSchema);
