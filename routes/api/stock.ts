import express from "express";
import { Item, Stock, Shop } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  asyncForEach,
  validateStockArray,
} from "../../helpers";
import { Stock as StockType, Item as ItemType } from "../../types";

export const stock = express.Router();

// GET All Stock for a Shop

stock.get("/:id", authMiddleware, validateUser, async (request, response) => {
  try {
    const userId = request.headers["user-id"];
    const shopId = request.params.id;
    // validate the shop exists and belongs to the user
    const shop = await Shop.find({ userId, shopId });
    if (!shop.length) {
      return response.status(404).json({ message: "shop not found" });
    }
    // find all the stock for that shop
    const stock: StockType[] = await Stock.find({ userId, shopId }).lean();
    if (!stock.length) {
      return response.json({ message: "yer shaps empty laddy" });
    }
    // find the items that the stock references
    const itemIds = stock.map((stockItem) => stockItem.itemId);
    const items: ItemType[] = await Item.find({
      _id: {
        $in: itemIds,
      },
    }).lean();
    // combine the stock numbers with the items
    const stockResponse = items.map((item) => ({
      ...item,
      number: stock.find(
        (stockItem) => stockItem.itemId === item._id.toString()
      ).number,
    }));
    response.json({ stock: stockResponse });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE Stock for a shop

stock.post("/:id", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];
  const shopId = request.params.id;
  // validate the shop exists and belongs to the user
  const shop = await Shop.find({ userId, shopId });
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
  const { validStock, rejectedStock } = validateStockArray(request.body.items);
  if (!validStock) {
    return response
      .status(401)
      .json({ message: "there's something up with this stock - have a look" });
  }
  // split the payload into stock-items that need to be updated and stock-items that need to be created
  try {
    await asyncForEach(validStock, async ({ number, itemId }) => {
      // try and find existing stock for this shop and this item
      const stock = await Stock.findOne({ itemId, shopId });
      if (stock) {
        await stock.update({ number });
      } else {
        // check that the user has access to the requested item id
        const item = await Item.findOne({
          itemId,
          $or: [{ userId }, { global: true }],
        });
        if (!item) {
          rejectedStock.push({ itemId, number });
        } else {
          // create the stock item
          const newStockItem = new Stock({ itemId, shopId, userId, number });
          await newStockItem.save();
        }
      }
    });
    // generate the response object
    // find all the stock for that shop
    const stock: StockType[] = await Stock.find({ userId, shopId }).lean();
    // find the items that the stock references
    const itemIds = stock.map((stockItem) => stockItem.itemId);
    const items: StockType[] = await Item.find({
      _id: {
        $in: itemIds,
      },
    }).lean();
    // combine the stock numbers with the items
    const stockResponse = items.map((item) => ({
      ...item,
      number: stock.find(
        (stockItem) => stockItem.itemId === item._id.toString()
      ).number,
    }));
    response.json({ stock: stockResponse, rejectedStock });
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
    const userId = request.headers["user-id"];
    const shopId = request.params.id;
    const { missingKeys, wrongKeys } = getMissingKeys(["stock"], request.body);
    if (missingKeys || wrongKeys) {
      return response
        .status(401)
        .json({ message: "payload malformed", missingKeys, wrongKeys });
    }

    try {
      const deletedStock = await Stock.find({
        _id: {
          $in: request.body.stock,
        },
        userId,
        shopId,
      });
      if (!deletedStock.length) {
        return response.status(404).json({ message: "no items found" });
      }

      const { deletedCount } = await Stock.deleteMany({
        _id: {
          $in: request.body.items,
        },
        userId,
        shopId,
      });

      response.json({ message: "ya killed tham", deletedCount, deletedStock });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);

// PUT Stock

stock.put("/:id", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];
  const shopId = request.params.id;
  // validate the shop exists and belongs to the user
  const shop = await Shop.find({ userId, shopId });
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
  const { validStock, rejectedStock } = validateStockArray(request.body.items);
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
    await asyncForEach(validStock, async ({ number, itemId }) => {
      // check that the user has access to the requested item id
      const item = await Item.findOne({
        itemId,
        $or: [{ userId }, { global: true }],
      });
      if (!item) {
        rejectedStock.push({ itemId, number });
      } else {
        // create the stock item
        const newStockItem = new Stock({ itemId, shopId, userId, number });
        await newStockItem.save();
      }
    });
    // generate the response object
    // find all the stock for that shop
    const stock: StockType[] = await Stock.find({ userId, shopId }).lean();
    // find the items that the stock references
    const itemIds = stock.map((stockItem) => stockItem.itemId);
    const items: StockType[] = await Item.find({
      _id: {
        $in: itemIds,
      },
    }).lean();
    // combine the stock numbers with the items
    const stockResponse = items.map((item) => ({
      ...item,
      number: stock.find(
        (stockItem) => stockItem.itemId === item._id.toString()
      ).number,
    }));
    response.json({ stock: stockResponse, rejectedStock, deletedCount });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});
