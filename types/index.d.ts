import { Types } from "mongoose";

export interface JWTinfo {
  id: string;
}

export interface Stock {
  _id: Types.ObjectId;
  number: number;
  itemId: string;
}

export interface Shop {
  name: string;
  _id: Types.ObjectId;
  stock: Stock[];
}

export interface User {
  _id: Types.ObjectId;
  password: string;
  email: string;
  username: string;
  admin: boolean;
}
