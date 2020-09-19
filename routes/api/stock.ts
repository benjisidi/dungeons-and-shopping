import express from "express";
import { Item, Stock, Shop } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  asyncForEach,
  validateStockArray,
  validateIdArray,
  repopulateShop,
} from "../../helpers";

import { pick } from "lodash";

export const stock = express.Router();

// GET All Stock for a Shop

stock.get("/:id", authMiddleware, validateUser, async (request, response) => {
  try {
    const elapsedTime = parseInt((request.query.time as string) || "0");
    const userId = request.headers["user-id"] as string;
    const shopId = request.params.id;
    // validate the shop exists and belongs to the user
    const shop = await Shop.find({ userId, _id: shopId });
    if (!shop.length) {
      return response.status(404).json({ message: "shop not found" });
    }
    // find all the stock for that shop

    const stock = elapsedTime
      ? await repopulateShop(shopId, elapsedTime)
      : await Stock.find({ userId, shopId }).lean();
    if (!stock.length) {
      return response.json({ message: "yer shaps empty laddy" });
    }
    // find the items that the stock references
    const itemIds = stock.map((stockItem) => stockItem.itemId);
    const items = await Item.find({
      _id: {
        $in: itemIds,
      },
    }).lean();
    // combine the stock with the items
    const stockResponse = items.map(({ _id, ...itemDetails }) => {
      const stockDetails = pick(
        stock.find((stockItem) => stockItem.itemId === _id.toString()),
        ["_id", "number", "createdAt", "updatedAt", "itemId"]
      );
      return {
        ...stockDetails,
        ...itemDetails,
      };
    });
    response.json({ stock: stockResponse });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE or UPDATE Stock for a shop

stock.post("/:id", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;
  const shopId = request.params.id;
  // validate the shop exists and belongs to the user
  const shop = await Shop.find({ userId, _id: shopId });
  if (!shop.length) {
    return response.status(404).json({ message: "shop not found" });
  }
  const { missingKeys, wrongKeys } = getMissingKeys(["stock"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  // validate the payload is of the correct form
  const { validStock, rejectedStock } = validateStockArray(request.body.stock);
  if (!validStock) {
    return response
      .status(400)
      .json({ message: "there's something up with this stock - have a look" });
  }
  // split the payload into stock-items that need to be updated and stock-items that need to be created
  try {
    let createdCount = 0;
    let updatedCount = 0;
    await asyncForEach(validStock, async ({ number, itemId }) => {
      // try and find existing stock for this shop and this item
      const stock = await Stock.findOne({ itemId, shopId });
      if (stock) {
        await stock.updateOne({ number });
        updatedCount++;
      } else {
        // check that the user has access to the requested item id
        const item = await Item.findOne({
          _id: itemId,
          $or: [{ userId }, { global: true }],
        });
        if (!item) {
          rejectedStock.push({ itemId, number });
        } else {
          // create the stock item
          const newStockItem = new Stock({ itemId, shopId, userId, number });
          await newStockItem.save();
          createdCount++;
        }
      }
    });

    response.json({
      stockCreated: createdCount,
      stockUpdated: updatedCount,
      rejectedStock,
    });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// DELETE Stock

stock.delete(
  "/:id",
  authMiddleware,
  validateUser,
  async (request, response) => {
    const userId = request.headers["user-id"] as string;
    const shopId = request.params.id;
    const { missingKeys, wrongKeys } = getMissingKeys(["stock"], request.body);
    if (missingKeys || wrongKeys) {
      return response
        .status(400)
        .json({ message: "payload malformed", missingKeys, wrongKeys });
    }
    const idArray = validateIdArray(request.body.stock);
    if (!idArray) {
      return response
        .status(400)
        .json({ message: "there's something up with these ids - have a look" });
    }
    try {
      const deletedStock = await Stock.find({
        _id: {
          $in: idArray,
        },
        userId,
        shopId,
      });
      if (!deletedStock.length) {
        return response.status(404).json({ message: "no stock found" });
      }

      const { deletedCount } = await Stock.deleteMany({
        _id: {
          $in: idArray,
        },
        userId,
        shopId,
      });

      response.json({ message: "ya killed tham", deletedCount });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);

// PUT Stock

stock.put("/:id", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;
  const shopId = request.params.id;
  // validate the shop exists and belongs to the user
  const shop = await Shop.find({ userId, _id: shopId });
  if (!shop.length) {
    return response.status(404).json({ message: "shop not found" });
  }
  const { missingKeys, wrongKeys } = getMissingKeys(["stock"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  // validate the payload is of the correct form
  const { validStock, rejectedStock } = validateStockArray(request.body.stock);
  if (!validStock) {
    return response
      .status(401)
      .json({ message: "there's something up with this stock - have a look" });
  }
  // split the payload into stock-items that need to be updated and stock-items that need to be created
  try {
    const { deletedCount } = await Stock.deleteMany({
      userId,
      shopId,
    });
    let createdCount = 0;
    await asyncForEach(validStock, async ({ number, itemId }) => {
      // check that the user has access to the requested item id
      const item = await Item.findOne({
        _id: itemId,
        $or: [{ userId }, { global: true }],
      });
      if (!item) {
        rejectedStock.push({ itemId, number });
      } else {
        // create the stock item
        const newStockItem = new Stock({ itemId, shopId, userId, number });
        await newStockItem.save();
        createdCount++;
      }
    });

    response.json({
      createdStockItems: createdCount,
      rejectedStock,
      deletedCount,
    });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
