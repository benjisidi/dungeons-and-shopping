// Boilerplate to test babel/TS
import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "development") {
    res.send("Hello Dev!");
  } else {
    res.send("Hello World!");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
