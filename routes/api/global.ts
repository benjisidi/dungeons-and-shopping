// routes for controlling global items (and maybe shop templates)
import express from "express";
import { items as rawItems, generateItems } from "../../items";
import { Item } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  adminOnly,
  asyncForEach,
  createItems,
  updateItems,
  deleteItems,
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
    await createItems(request.body.items, response);
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

    await deleteItems(request.body.items, response);
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
    await updateItems(request.body.items, response);
  }
);

global.patch(
  "/",
  authMiddleware,
  validateUser,
  adminOnly,
  async (request, response) => {
    let itemsCreated = 0;
    let itemsUpdated = 0;
    const items = generateItems(rawItems);

    try {
      await asyncForEach(items, async (item) => {
        const existingItem = await Item.findOneAndUpdate(
          { index: item.index, global: true },
          item
        );

        if (existingItem) {
          itemsUpdated++;
        } else {
          const newItem = new Item({ ...item, global: true });
          await newItem.save();
          itemsCreated++;
        }
      });
      response.json({ itemsUpdated, itemsCreated });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);
