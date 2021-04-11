import { Item, Stock } from "../models";
import express from "express";
import { validateItemsArray, asyncForEach, validateIdArray } from ".";

export const createItems = async (
  items: Record<string, unknown>[],
  response: express.Response,
  global = true,
  userId?: string
) => {
  const { validItems, rejectedItems } = validateItemsArray(items);
  if (!validItems) {
    return response.status(400).json({
      message: `there's something up with these items ${
        global && "chief"
      } - have a look`,
    });
  }

  const itemPayload = validItems.map((item) =>
    global
      ? {
          ...item,
          global,
        }
      : {
          ...item,
          userId,
          global,
        }
  );
  try {
    const createdItems = await Item.create(itemPayload);
    response.json({ createdItems, rejectedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
};

export const updateItems = async (
  items: Record<string, unknown>[],
  response: express.Response,
  global = true,
  userId?: string
) => {
  const { validItems, rejectedItems } = validateItemsArray(items, false, true);
  if (!validItems) {
    return response.status(401).json({
      message: "there's something up with these items chief - have a look",
    });
  }
  const updatedItems = [];
  try {
    await asyncForEach(validItems, async ({ _id, ...payload }) => {
      // this is in a try catch so the array keeps being processed if a user tries to
      // update an item with a non-unique index or something else dumb (that violates the schema)
      try {
        const updatedItem = await Item.findOneAndUpdate(
          global ? { _id } : { _id, userId },
          payload,
          { new: true }
        );
        if (updatedItem) {
          updatedItems.push(updatedItem);
        } else {
          rejectedItems.push({ _id, ...payload });
        }
      } catch (e) {
        rejectedItems.push({ _id, ...payload });
      }
    });
    if (!updatedItems.length) {
      response.status(400).json({ message: "all items rejected" });
    }

    response.json({ updatedItems, rejectedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
};

export const deleteItems = async (
  items: string[],
  response: express.Response,
  global = true,
  userId?: string
) => {
  const idArray = validateIdArray(items);
  if (!idArray) {
    return response
      .status(400)
      .json({ message: "there's something up with these ids - have a look" });
  }
  try {
    const deletedItems = await Item.find(
      global
        ? {
            _id: {
              $in: idArray,
            },
            global: true,
          }
        : {
            _id: {
              $in: idArray,
            },
            userId,
            global: false,
          }
    );
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
        $in: idArray,
      },
    });
    response.json({ message: "ya killed tham", deletedCount, deletedItems });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
};
