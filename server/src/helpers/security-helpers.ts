import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";

import { keys } from "../config";
import { User } from "../models";

interface JWTinfo {
  id: string;
}

export const createToken = (id: string) => {
  const jwtDetails: JWTinfo = { id };
  return jwt.sign(jwtDetails, keys.jwtSecret, { expiresIn: 3600 });
};

export const encryptUserPayload = (payload: {
  password?: string;
  [key: string]: unknown;
}) => {
  if (!payload.password) {
    return payload;
  }
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(payload.password, salt);
  return { ...payload, password };
};

export const authMiddleware = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const token = request.header("x-auth-token");
  if (!token) {
    return response.status(401).json({ message: "token not found" });
  }
  try {
    const decoded = jwt.verify(token, keys.jwtSecret) as JWTinfo;
    request.headers["user-id"] = decoded.id;
    next();
  } catch (e) {
    if (e.expiredAt) {
      return response.status(401).json({ message: "dis jwt too old" });
    }
    response.status(401).json({ message: "wtf dis jwt" });
  }
};

export const validateUser = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  try {
    const id = request.headers["user-id"];
    const user = await User.findById(id);
    if (!user) {
      response.status(404).json({ message: "user not found" });
    }
    next();
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
};

export const adminOnly = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const id = request.headers["user-id"];
  try {
    const user = await User.findById(id);
    const { admin } = await user.toObject();
    if (!admin) {
      return response
        .status(403)
        .json({ message: "this user account is not admin" });
    }
    next();
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
};
