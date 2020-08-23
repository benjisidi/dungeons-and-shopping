import { Schema, model } from "mongoose";

export const ItemSchema = new Schema();
export const Item = model("Item", ItemSchema);
