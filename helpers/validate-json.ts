import difference from "lodash/difference";
import { Item, Stock } from "../types";
import { isArray } from "lodash";

export const getMissingKeys = (
  requiredKeys: string[],
  object: object
): { missingKeys: string[]; wrongKeys: string[] } => {
  const missingKeys = difference(requiredKeys, Object.keys(object));
  const wrongKeys = difference(Object.keys(object), requiredKeys);

  return {
    missingKeys: missingKeys.length && missingKeys,
    wrongKeys: wrongKeys.length && wrongKeys,
  };
};

const itemKeys = ["name"];

declare interface PossibleItem extends Partial<Item> {
  [key: string]: unknown;
}

export const validateItemsArray = (
  items: PossibleItem[],
  exact = true,
  id = false
): { rejectedItems: unknown[]; validItems?: Partial<Item>[] } => {
  if (!isArray(items)) {
    return { rejectedItems: null };
  }
  const keysToCheck = id ? itemKeys.concat(["_id"]) : itemKeys;
  const rejectedItems = [];
  const validItems = [];
  items.forEach((item) => {
    const { missingKeys, wrongKeys } = getMissingKeys(keysToCheck, item);
    if (
      (missingKeys && exact) ||
      wrongKeys ||
      (id && missingKeys && missingKeys.includes("_id"))
    ) {
      rejectedItems.push(item);
    } else {
      validItems.push(item);
    }
  });

  return {
    validItems: validItems.length && validItems,
    rejectedItems: rejectedItems.length && rejectedItems,
  };
};

declare interface PossibleStock extends Partial<Stock> {
  [key: string]: unknown;
}
export const validateStockArray = (
  stock: PossibleStock[]
): {
  rejectedStock: unknown[];
  validStock?: { number: number; itemId: string }[];
} => {
  if (!isArray(stock)) {
    return { rejectedStock: null };
  }

  const rejectedStock = [];
  const validStock = [];
  stock.forEach(({ itemId, number, ...anythingElse }) => {
    if (itemId && number) {
      validStock.push({ itemId, number });
    } else {
      rejectedStock.push({ itemId, number, ...anythingElse });
    }
  });

  return {
    validStock: validStock.length && validStock,
    rejectedStock,
  };
};

export const validateIdArray = (ids): string[] => {
  if (!isArray(ids)) {
    return null;
  }
  const validIds = ids.filter((id) => typeof id === "string");
  return validIds.length ? validIds : null;
};
