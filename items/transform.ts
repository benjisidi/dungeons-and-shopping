/* eslint-disable @typescript-eslint/camelcase */
import {
  isGear,
  isEquipmentPack,
  isTool,
  isArmour,
  isWeapon,
  isVehicle,
  RawItem,
  Item,
  TransformItem,
  rawItemType,
  itemType,
} from "../types";
import { pick, find } from "lodash";

const typeMap: { [equipment_category in rawItemType]: itemType } = {
  "Adventuring Gear": "gear",
  Tools: "tool",
  "Mounts and Vehicles": "vehicle",
  Weapon: "weapon",
  Armor: "armour",
};

const transformRawItem: TransformItem = (
  rawItem,
  detailsKeys: string[]
  // when you're using overloads this is suddenly the correct practice
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const { cost, weight, name, index, equipment_category } = rawItem;

  return {
    index,
    cost,
    weight,
    name,
    type: isEquipmentPack(rawItem) ? "pack" : typeMap[equipment_category],
    details: pick(rawItem, detailsKeys),
  };
};

// sorry
export const generateItems = (rawItems: {
  [index: string]: RawItem;
}): Item[] => {
  const items: Item[] = [];
  Object.values(rawItems).forEach((rawItem) => {
    if (isGear(rawItem)) {
      items.push(transformRawItem(rawItem, ["gear_category", "desc"]));
    } else if (isEquipmentPack(rawItem)) {
      const transformedPack = {
        ...rawItem,
        contents: rawItem.contents.map(({ quantity, item_url }) => ({
          quantity,
          index: find(rawItems, (x) => x.url === item_url).index,
        })),
      };
      items.push(transformRawItem(transformedPack, ["contents"]));
    } else if (isTool(rawItem)) {
      items.push(transformRawItem(rawItem, ["tool_category", "desc"]));
    } else if (isArmour(rawItem)) {
      items.push(
        transformRawItem(rawItem, [
          "armor_category",
          "armor_class",
          "str_minimum",
          "stealth_disadvantage",
        ])
      );
    } else if (isWeapon(rawItem)) {
      const transformedProperties = {
        damage: {
          ...rawItem.damage,
          damage_type: rawItem.damage.damage_type.name,
        },
        properties: rawItem.properties.map(({ name }) => name),
      };
      const transformedWeapon = rawItem["2h_damage"]
        ? {
            ...rawItem,
            "2h_damage": {
              ...rawItem["2h_damage"],
              damage_type: rawItem["2h_damage"]?.damage_type.name,
            },
            ...transformedProperties,
          }
        : // this is just me being lazy - I wanted to take all the urls out of the data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({ ...rawItem, ...transformedProperties } as any);
      items.push(
        transformRawItem(transformedWeapon, [
          "weapon_category",
          "weapon_range",
          "category_range",
          "damage",
          "range",
          "2h_damage",
          "throw_range",
          "properties",
          "special",
        ])
      );
    } else if (isVehicle(rawItem)) {
      items.push(
        transformRawItem(rawItem, [
          "vehicle_category",
          "desc",
          "capacity",
          "speed",
        ])
      );
    }
  });

  return items;
};
