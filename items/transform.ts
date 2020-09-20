/* eslint-disable @typescript-eslint/camelcase */
import { isEquipmentPack, isWeapon, RawItem, Item } from "../types";
import { pick, find, cloneDeep } from "lodash";
import { typeMapping } from ".";

const transformRawItem = (rawItem: RawItem): Item => {
  const { cost, weight, name, index, equipment_category } = rawItem;
  if (isWeapon(rawItem)) {
    // the weapon is full of urls and I hate it - stripped them out here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newWeapon: any = cloneDeep(rawItem);
    newWeapon.damage.damage_type = rawItem.damage.damage_type.name;
    newWeapon.properties = rawItem.properties.map(({ name }) => name);
    if (rawItem["2h_damage"]) {
      newWeapon["2h_damage"].damage_type =
        rawItem["2h_damage"]?.damage_type.name;
    }
  }
  return {
    index,
    cost,
    weight,
    name,
    type: isEquipmentPack(rawItem)
      ? "pack"
      : typeMapping[equipment_category].type,
    details: pick(
      rawItem,
      typeMapping[equipment_category].details
    ) as Item["details"],
  };
};

export const generateItems = (rawItems: {
  [index: string]: RawItem;
}): Item[] => {
  const items: Item[] = [];
  Object.values(rawItems).forEach((rawItem) => {
    if (isEquipmentPack(rawItem)) {
      // mapping packs to indexes rather than urls
      const transformedPack = {
        ...rawItem,
        contents: rawItem.contents.map(({ quantity, item_url }) => ({
          quantity,
          index: find(rawItems, (x) => x.url === item_url).index,
        })),
      };
      items.push(transformRawItem(transformedPack));
    } else {
      items.push(transformRawItem(rawItem));
    }
  });

  return items;
};
