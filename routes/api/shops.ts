import express from "express";
import { Shop } from "../../models";
import { getMissingKeys, authMiddleware, validateUser } from "../../helpers";
import { Shop as ShopType } from "../../types";

export const shops = express.Router();

// GET Shops

shops.get("/", authMiddleware, validateUser, async (request, response) => {
  try {
    const userId = request.headers["user-id"];
    const shops: ShopType[] = await Shop.find({ userId }).lean();
    response.json({ shops });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// CREATE Shop

shops.post("/", authMiddleware, validateUser, async (request, response) => {
  const userId = request.headers["user-id"];
  const { missingKeys, wrongKeys } = getMissingKeys(["name"], request.body);
  if (missingKeys || wrongKeys) {
    return response
      .status(400)
      .json({ message: "payload malformed", missingKeys, wrongKeys });
  }
  try {
    const newShop = new Shop({ ...request.body, userId });
    await newShop.save();
    const shops: ShopType[] = await Shop.find({ userId }).lean();
    response.json({ shops });
  } catch (e) {
    response.status(400).json({ message: "something went wrong" });
  }
});

// UPDATE Shop

shops.post("/:id", authMiddleware, validateUser, async (request, response) => {
  const shopId = request.params.id;
  const userId = request.headers["user-id"];
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

    response.json(shop);
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
    const userId = request.headers["user-id"];

    try {
      const shop = await Shop.findOneAndDelete({ _id: shopId, userId });
      if (!shop) {
        return response.status(404).json({ message: "shop not found" });
      }
      response.json({ message: "ya killed ham" });
    } catch (e) {
      response.status(400).json({ message: "something went wrong" });
    }
  }
);
