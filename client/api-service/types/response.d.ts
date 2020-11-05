import { ShopModel, ItemModel, UserModel, Shop, Stock } from "../../../types";

interface DetailedStock extends ItemModel, Stock {}

export interface ProcessRequest {
  // create user
  ({
    path,
    payload,
    method,
  }: {
    path: "/api/users";
    payload: {
      username: string;
      password: string;
      email: string;
    };
    method: "PUT";
  }): Promise<{ user: Omit<UserModel, "password">; token: string }>;
  // login
  ({
    path,
    payload,
    method,
  }: {
    path: "/api/auth/login";
    payload: {
      username: string;
      password: string;
    };
    method: "POST";
  }): Promise<{ user: Omit<UserModel, "password">; token: string }>;
  // reauth
  ({ path }: { path: "/api/users" }): Promise<{
    user: Omit<UserModel, "password">;
    token: string;
  }>;
  // create shop
  ({
    path,
    payload,
    method,
  }: {
    path: "/api/shops";
    payload: Omit<Shop, "userId">;
    method: "POST";
  }): Promise<{ shops: ShopModel[] }>;
  // get shops
  ({ path }: { path: "/api/shops" }): Promise<{ shops: ShopModel[] }>;
  // update shop
  ({
    path,
    payload,
    method,
    id,
  }: {
    path: "/api/shops";
    payload: Omit<Shop, "userId">;
    method: "POST";
    id: string;
  }): Promise<{ shops: ShopModel[] }>;
  // delete shop
  ({
    path,
    method,
    id,
  }: {
    path: "/api/shops";
    method: "DELETE";
    id: string;
  }): Promise<{ message: string }>;
  // get stock
  ({
    path,
    id,
    queryParams,
  }: {
    path: "/api/stock";
    id: string;
    queryParams?: { time: number };
  }): Promise<{
    stock: DetailedStock;
  }>;
  // update stock
  ({
    path,
    id,
    payload,
    method,
  }: {
    path: "/api/stock";
    id: string;
    payload: { stock: Omit<Stock, "userId" | "itemId" | "shopId">[] };
    method: "POST";
  }): Promise<{
    stock: DetailedStock;
  }>;
}
