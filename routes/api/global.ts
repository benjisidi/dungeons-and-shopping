// routes for controlling global items (and maybe shop templates)
import express from "express";
import { Item, Stock } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  validateItemsArray,
  adminOnly,
  asyncForEach,
} from "../../helpers";

export const global = express.Router();

// GET All Global Items

global.get(
  "/",
  authMiddleware,
  validateUser,
  adminOnly,
  async (request, response) => {
    try {
      const items = await Item.find({ global: true });
      response.json({ items });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);

// CREATE Global Items

global.put(
  "/",
  authMiddleware,
  validateUser,
  adminOnly,
  async (request, response) => {
    const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
    if (missingKeys || wrongKeys) {
      return response
        .status(401)
        .json({ message: "payload malformed", missingKeys, wrongKeys });
    }
    // check the item array is valid
    const { validItems, rejectedItems } = validateItemsArray(
      request.body.items
    );
    if (!validItems) {
      return response.status(401).json({
        message: "there's something up with these items - have a look",
      });
    }
    const items = validItems.map((item) => ({
      ...item,
      global: true,
    }));
    try {
      const createdItems = await Item.create(items);
      response.json({ createdItems, rejectedItems });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);

// DELETE Global Items

global.delete(
  "/",
  authMiddleware,
  validateUser,
  adminOnly,
  async (request, response) => {
    const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
    if (missingKeys || wrongKeys) {
      return response
        .status(401)
        .json({ message: "payload malformed", missingKeys, wrongKeys });
    }

    try {
      const deletedItems = await Item.find({
        _id: {
          $in: request.body.items,
        },
      });
      if (!deletedItems.length) {
        return response.status(404).json({ message: "no items found" });
      }
      // delete all stock associated with those items
      await Stock.deleteMany({
        itemId: {
          $in: request.body.items,
        },
      });
      const { deletedCount } = await Item.deleteMany({
        _id: {
          $in: request.body.items,
        },
      });

      response.json({ message: "ya killed tham", deletedCount, deletedItems });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);

// Update Global Items

global.post(
  "/",
  authMiddleware,
  validateUser,
  adminOnly,
  async (request, response) => {
    const { missingKeys, wrongKeys } = getMissingKeys(["items"], request.body);
    if (missingKeys || wrongKeys) {
      return response
        .status(401)
        .json({ message: "payload malformed", missingKeys, wrongKeys });
    }
    const { validItems, rejectedItems } = validateItemsArray(
      request.body.items,
      false,
      true
    );
    if (!validItems) {
      return response.status(401).json({
        message: "there's something up with these items chief - have a look",
      });
    }
    const updatedItems = [];
    try {
      await asyncForEach(validItems, async ({ _id, ...payload }) => {
        const updatedItem = await Item.findOneAndUpdate({ _id }, payload, {
          new: true,
        });
        if (updatedItem) {
          updatedItems.push(updatedItem);
        }
      });

      response.json({ updatedItems, rejectedItems });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);
