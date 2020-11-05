import { Stock } from "../../types";
import { processRequest } from "./api-helpers/process-request";

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  // get a token
  // put it in local storage
  const { token } = await processRequest({
    path: "/api/users",
    method: "PUT",
    payload: {
      username,
      password,
      email,
    },
  });
  localStorage.setItem("token", token);
};

export const login = async (username: string, password: string) => {
  // get a token
  // put it in local storage
  const { token } = await processRequest({
    path: "/api/auth/login",
    method: "POST",
    payload: {
      username,
      password,
    },
  });
  localStorage.setItem("token", token);
};
export const logout = () => {
  localStorage.removeItem("token");
  // clear local storage
};
export const reauth = async () => {
  // get new jwt using the existing one
  // clear local storage
  // put new token in local storage
  const { token } = await processRequest({
    path: "/api/users",
  });
  localStorage.setItem("token", token);
};

export const createShop = async (name: string) => {
  // returns all user shops
  const { shops } = await processRequest({
    path: "/api/shops",
    method: "POST",
    payload: { name },
  });
  return shops;
};
export const getShops = async () => {
  // returns all user shops
  const { shops } = await processRequest({
    path: "/api/shops",
  });
  return shops;
};
export const updateShop = async (id: string, name: string) => {
  // returns all user shops
  const { shops } = await processRequest({
    path: "/api/shops",
    method: "POST",
    payload: { name },
    id,
  });
  return shops;
};
export const deleteShop = async (id: string) => {
  const { message } = await processRequest({
    path: "/api/shops",
    method: "DELETE",
    id,
  });
  return message;
};
export const getStock = async (shopId: string, elapsedTime?: number) => {
  // returns all stock for the shop
  const { stock } = await processRequest({
    path: "/api/stock",
    queryParams: elapsedTime && { time: elapsedTime },
    id: shopId,
  });
  return stock;
};
export const updateStock = async (shopId: string, stock: Stock[]) => {
  // returns all stock for the shop
  const { stock: updatedStock } = await processRequest({
    path: "/api/stock",
    payload: { stock },
    id: shopId,
    method: "POST",
  });
  return updatedStock;
};
