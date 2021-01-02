import dotenv from "dotenv";

import { setGlobal } from "../../common";
dotenv.config();
import type { ProcessRequest } from "../../types";
import { RequestError } from "./request-error";

export const processRequest: ProcessRequest = async ({
  path,
  payload,
  method = "GET",
  id = "",
  queryParams = {},
}: {
  path: string;
  payload?: Record<string, unknown>;
  method?: "GET" | "PUT" | "POST" | "DELETE";
  id?: string;
  queryParams?: Record<string, string | number>;
}) => {
  const queryStrings = Object.entries(queryParams).reduce(
    (acc: string, [key, value]) => `${acc}?${key}=${value}`,
    ""
  );
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.SNOWPACK_PUBLIC_BASE_URL}${path}/${id}${queryStrings}`,
      {
        body: payload && JSON.stringify(payload),
        method,
        headers: {
          "x-auth-token": token || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        setGlobal({ loggedIn: false });
      }
      const { message, ...details } = await response.json();
      throw new RequestError(message, response.status, details);
    }
    return response.json();
  } catch (e) {
    throw e;
  }
};
