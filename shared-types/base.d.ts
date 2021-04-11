export interface Stock {
  number: number;
  max: number;
  itemId: string;
  shopId: string;
  userId: string;
}

export interface ShopMeta {
  name: string;
}

export interface Shop extends ShopMeta {
  userId: string;
}
export interface User {
  password: string;
  email: string;
  username: string;
  admin: boolean;
}

interface ResponseMeta {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type Response<T> = T & ResponseMeta;
