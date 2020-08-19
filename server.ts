// Boilerplate to test babel/TS
import express from "express";
import { keys } from "./config";
import mongoose from "mongoose";
import { users } from "./routes/api";
const app = express();
const port = process.env.PORT || 5000;

const main = async () => {
  app.use("/api/users", users);
  try {
    await mongoose.connect(keys.mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
  }
  app.listen(port, () => console.log(`Server started on ${port}`));
};

main();
