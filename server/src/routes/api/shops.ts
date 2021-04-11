import express from "express";
import { Shop, Stock } from "../../models";
import {
  getMissingKeys,
  authMiddleware,
  validateUser,
  populateShop,
} from "../../helpers";

export const shops = express.Router();

// GET Shops

shops.get("/", authMiddleware, validateUser, async (request, response) => {
  try {
    const userId = request.headers["user-id"] as string;
    const shops = await Shop.find({ userId }).lean();
    response.json({ shops });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE Shop

shops.post("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"] as string;
  const { missingKeys, wrongKeys } = getMissingKeys(["name"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  try {
    const newShop = new Shop({ ...request.body, userId });
    await newShop.save();
    // allocate some stock to the shop
    await populateShop(newShop._id, userId);
    const shops = await Shop.find({ userId }).lean();
    response.json({ shops });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// UPDATE Shop

shops.post("/:id", authMiddleware, validateUser, async (request, response) => {
  const shopId = request.params.id;
  const userId = request.headers["user-id"] as string;
  const { wrongKeys } = getMissingKeys(["name"], request.body);
  if (wrongKeys) {
    return response
      .status(401)
      .json({ message: "payload malformed", wrongKeys });
  }
  try {
    const shop = await Shop.findOneAndUpdate(
      { userId, _id: shopId },
      { ...request.body },
      { new: true }
    );
    if (!shop) {
      return response.status(404).json({ message: "shop not found" });
    }
    const shops = await Shop.find({ userId }).lean();
    response.json({ shops });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// DELETE Shop

shops.delete(
  "/:id",
  authMiddleware,
  validateUser,
  async (request, response) => {
    const shopId = request.params.id;
    const userId = request.headers["user-id"] as string;

    try {
      const shop = await Shop.findOneAndDelete({ _id: shopId, userId });
      if (!shop) {
        return response.status(404).json({ message: "shop not found" });
      }
      // delete all stock for that shop
      await Stock.deleteMany({ userId, shopId });
      response.json({ message: "ya killed ham, an hus stacks" });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);
