import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { keys } from "./config";
import { admin, auth, global, items, shops, stock, users } from "./routes/api";

const app = express();
const port = process.env.PORT || 5000;

const main = async () => {
  app
    .use(
      cors({
        origin: "http://localhost:8080",
      })
    )
    .use(express.json())
    .use("/api/users", users)
    .use("/api/auth", auth)
    .use("/api/shops", shops)
    .use("/api/admin", admin)
    .use("/api/items", items)
    .use("/api/stock", stock)
    .use("/api/global/items", global);
  try {
    await mongoose.connect(keys.mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
  }
  app.listen(port, () => console.log(`Server started on ${port}`));
};

main();
