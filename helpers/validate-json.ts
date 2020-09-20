import difference from "lodash/difference";
import { Item } from "../types";
import { isArray } from "lodash";

export const getMissingKeys = (
  requiredKeys: string[],
  object: Record<string, unknown>
): { missingKeys: string[]; wrongKeys: string[] } => {
  const missingKeys = difference(requiredKeys, Object.keys(object));
  const wrongKeys = difference(Object.keys(object), requiredKeys);

  return {
    missingKeys: missingKeys.length && missingKeys,
    wrongKeys: wrongKeys.length && wrongKeys,
  };
};

const itemKeys: Array<keyof (Item & { _id: string })> = [
  "name",
  "cost",
  "weight",
  "type",
  "index",
  "details",
];

export const validateItemsArray = (
  items: Record<string, unknown>[],
  exact = true,
  id = false
): {
  rejectedItems: unknown[];
  validItems?: Array<Item & { _id: string }>;
} => {
  if (!isArray(items)) {
    return { rejectedItems: null };
  }
  const keysToCheck = id ? itemKeys.concat(["_id"]) : itemKeys;
  const rejectedItems = [];
  const validItems = [];
  items.forEach((item) => {
    const { missingKeys, wrongKeys } = getMissingKeys(keysToCheck, item);

    if (
      (missingKeys &&
        exact &&
        // honestly this seems like the best way to make weight optional but everything else required
        !(missingKeys.length === 1 && missingKeys[0] === "weight")) ||
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

export const validateStockArray = (
  stock: Record<string, unknown>[]
): {
  rejectedStock: unknown[];
  validStock?: { number: number; itemId: string; max: number }[];
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
