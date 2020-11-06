import dotenv from "dotenv";
dotenv.config();
import { ProcessRequest } from "../types";
import { RequestError } from "./request-error";

export const processRequest: ProcessRequest = async ({
  path,
  payload,
  method = "GET",
  id = "",
  queryParams = {},
}: {
  path: string;
  payload?;
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
      `${process.env.baseUrl}${path}/${id}${queryStrings}`,
      {
        body: payload && JSON.stringify(payload),
        method,
        headers: { "x-auth-token": token },
      }
    );
    if (!response.ok) {
      const { message, ...details } = await response.json();
      throw new RequestError(message, response.status, details);
    }
    return response.json();
  } catch (e) {
    throw e;
  }
};
