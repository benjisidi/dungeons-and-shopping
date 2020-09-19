import { Item, Stock } from "../models";
import { StockModel } from "../types";
import { asyncForEach } from "./helpers";

// find 10 random items and create stock entries for them
export const populateShop = async (shopId: string, userId: string) => {
  const randomItems = await Item.aggregate([{ $sample: { size: 10 } }]);
  const newStock = randomItems.map(({ _id }) => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return {
      itemId: _id,
      shopId,
      userId,
      number: randomNumber,
      max: randomNumber,
    };
  });

  await Stock.create(newStock);
  // Again query all users but only fetch one offset by our random #
};

// given an elapsed time, calculate what happens to the stock of a shop
export const repopulateShop = async (
  shopId: string,
  elapsedTime: number
): Promise<StockModel[]> => {
  // get all stock for a shop and up the number
  const stock = await Stock.find({ shopId });
  await asyncForEach(stock, async ({ number, max, save }) => {
    const newStockLevel = Math.max(
      max,
      number + Math.floor(Math.random() * (max - number) * elapsedTime)
    );
    number = newStockLevel;
    await save();
  });
  return stock;
};
