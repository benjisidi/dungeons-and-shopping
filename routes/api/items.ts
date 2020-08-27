import express from "express";
import { Item, Stock } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  validateItemsArray,
  asyncForEach,
  validateIdArray,
} from "../../helpers";
import { Item as ItemType } from "../../types";

export const items = express.Router();

// GET All User Items

items.get("/", authMiddleware, validateUser, async (request, response) => {
  try {
    const userId = request.headers["user-id"];
    const items: ItemType[] = await Item.find({
      $or: [{ userId }, { global: true }],
    }).lean();

    response.json({ items });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE User Items

items.put("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];
  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }

  const { validItems, rejectedItems } = validateItemsArray(request.body.items);
  if (!validItems) {
    return response
      .status(400)
      .json({ message: "there's something up with these items - have a look" });
  }
  const items = validItems.map((item) => ({
    ...item,
    userId,
    global: false,
  }));
  try {
    const createdItems = await Item.create(items);
    response.json({ createdItems, rejectedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// DELETE User Items

items.delete("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];

  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  const idArray = validateIdArray(request.body.items);
  if (!idArray) {
    return response
      .status(400)
      .json({ message: "there's something up with these ids - have a look" });
  }
  try {
    const deletedItems = await Item.find({
      _id: {
        $in: idArray,
      },
      userId,
      global: false,
    });
    if (!deletedItems.length) {
      return response.status(404).json({ message: "no items found" });
    }

    const { deletedCount } = await Item.deleteMany({
      _id: {
        $in: idArray,
      },
      userId,
      global: false,
    });
    // delete all stock associated with those items
    await Stock.deleteMany({
      userId,
      itemId: {
        $in: request.body.items,
      },
    });
    response.json({ message: "ya killed tham", deletedCount, deletedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// UPDATE User Items

items.post("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];
  const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  const { validItems, rejectedItems } = validateItemsArray(
    request.body.items,
    false,
    true
  );
  if (!validItems) {
    return response
      .status(400)
      .json({ message: "there's something up with these items - have a look" });
  }
  const updatePayload = validItems.map((item) => ({
    ...item,
    global: false,
  }));
  const updatedItems = [];
  try {
    await asyncForEach(updatePayload, async ({ _id, ...payload }) => {
      const updatedItem = await Item.findOneAndUpdate(
        { _id, userId, global: false },
        payload,
        {
          new: true,
        }
      );
      if (updatedItem) {
        updatedItems.push(updatedItem);
      }
    });

    response.json({ updatedItems, rejectedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
