import equipment from "./equipment.json";
import mapping from "./mapping.json";
import { itemDetailKeys, itemType, RawItem, rawItemType } from "shared-types";
export * from "./transform";
export const items = equipment as { [index: string]: RawItem };
export const typeMapping = mapping as {
  [index in rawItemType]: { type: itemType; details: itemDetailKeys };
};
