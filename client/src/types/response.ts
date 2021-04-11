import type { Item, Shop, Response, Stock, User } from "shared-types";

export type DetailedStock = Response<Item & Stock>;

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
  }): Promise<{ user: Omit<Response<User>, "password">; token: string }>;
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
  }): Promise<{ user: Omit<Response<User>, "password">; token: string }>;
  // reauth
  ({ path }: { path: "/api/users" }): Promise<{
    user: Omit<Response<User>, "password">;
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
  }): Promise<{ shops: Response<Shop>[] }>;
  // get shops
  ({ path }: { path: "/api/shops" }): Promise<{ shops: Response<Shop>[] }>;
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
  }): Promise<{ shops: Response<Shop>[] }>;
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
    queryParams: { time: number };
  }): Promise<{
    shop: Response<Shop>;
    stock: DetailedStock[];
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
    payload: { stock: Omit<Stock, "userId" | "itemId" | "shopId" | "max">[] };
    method: "POST";
  }): Promise<{
    stock: DetailedStock[];
  }>;
}
