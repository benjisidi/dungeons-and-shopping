import type { Stock } from "../../../types";
import { setGlobal } from "../common";
import { processRequest } from "./api-helpers/process-request";

export const register = async ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) => {
  // get a token
  // put it in local storage
  const { token, user } = await processRequest({
    path: "/api/users",
    method: "PUT",
    payload: {
      username,
      password,
      email,
    },
  });
  localStorage.setItem("savedUser", user.username);
  localStorage.setItem("token", token);
  setGlobal({ loggedIn: true, user });
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // get a token
  // put it in local storage
  const { token, user } = await processRequest({
    path: "/api/auth/login",
    method: "POST",
    payload: {
      username,
      password,
    },
  });
  localStorage.setItem("savedUser", user.username);
  localStorage.setItem("token", token);
  setGlobal({ loggedIn: true, user });
};
export const logout = () => {
  localStorage.removeItem("token");
  setGlobal({ loggedIn: false, user: null });
};
export const reauth = async () => {
  // get new jwt using the existing one
  // put new token in local storage
  if (localStorage.getItem("token")) {
    const { token, user } = await processRequest({
      path: "/api/users",
    });
    localStorage.setItem("token", token);
    setGlobal({ loggedIn: true, user });
  }
};

export const createShop = async ({ name }: { name: string }) => {
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
export const updateShop = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  // returns all user shops
  const { shops } = await processRequest({
    path: "/api/shops",
    method: "POST",
    payload: { name },
    id,
  });
  return shops;
};
export const deleteShop = async ({ id }: { id: string }) => {
  const { message } = await processRequest({
    path: "/api/shops",
    method: "DELETE",
    id,
  });
  return message;
};
export const getStock = async (shopId: string, elapsedTime = 0) => {
  // returns all stock for the shop
  const { stock } = await processRequest({
    path: "/api/stock",
    id: shopId,
    queryParams: { time: elapsedTime },
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
