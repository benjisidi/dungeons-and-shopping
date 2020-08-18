import dotenv from "dotenv";
dotenv.config();

export const keys = {
  mongoURI: process.env.MONGO_URI,
};
