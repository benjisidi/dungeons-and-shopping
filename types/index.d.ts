import { Types } from "mongoose";
export * from "./items";
export * from "./type-guards";

export interface JWTinfo {
  id: string;
}

export interface Stock {
  _id: Types.ObjectId;
  number: number;
  global: boolean;
  itemId: string;
  shopId: string;
  userId: string;
}

export interface Shop {
  _id: Types.ObjectId;
  name: string;
  userId: string;
}

export interface User {
  _id: Types.ObjectId;
  password: string;
  email: string;
  username: string;
  admin: boolean;
}
