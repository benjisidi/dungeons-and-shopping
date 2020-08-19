import express from "express";
import { User } from "../../models";

export const users = express.Router();

// GET Users

users.get("/", async (request, response) => {
  const users = await User.find();
  response.json(users);
});

// GET User

users.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    response.json(user);
  } catch (e) {
    response.status(404).json("User not found");
  }
});

// CREATE User

users.post("/", async (request, response) => {
  const newUser = new User({
    username: request.body.username,
    password: request.body.password,
  });
  try {
    const newRecord = await newUser.save();
    response.json(newRecord);
  } catch (e) {
    if (e.code === 11000) {
      response.status(409).json(`${request.body.username} already exists`);
    }
    response.status(400).json("something went wrong");
  }
});

// UPDATE User

users.post("/:id", async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    response.json(user);
  } catch (e) {
    response.status(404).json("User not found");
  }
});

// DELETE User

users.delete("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    await user.remove();
    response.json("ya killed ham");
  } catch (e) {
    response.status(404).json("User not found");
  }
});
