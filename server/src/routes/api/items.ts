import express from "express";

import {
  authMiddleware,
  createItems,
  deleteItems,
  getMissingKeys,
  updateItems,
  validateUser,
} from "../../helpers";
import { Item } from "../../models";

export const items = express.Router();

// GET All User Items

items.get("/", authMiddleware, validateUser, async (request, response) => {
  try {
    const userId = request.headers["user-id"];
    const items = await Item.find({
      $or: [{ userId }, { global: true }],
    }).lean();

    response.json({ items });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE User Items

items.put("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;
  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  await createItems(request.body.items, response, false, userId);
});

// DELETE User Items

items.delete("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;

  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  await deleteItems(request.body.items, response, false, userId);
});

// UPDATE User Items

items.post("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;
  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  await updateItems(request.body.items, response, false, userId);
});
