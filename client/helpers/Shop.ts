import equipment from "../public/data/equipment.json";
import magicItems from "../public/data/magic-items.json";
import sampleSize from "lodash/sampleSize";

const randomSign = (n) => (Math.random() > 0.5 ? -n : n);

const itemsByCategory = Object.keys(equipment).reduce((lookup, itemKey) => {
  const item = equipment[itemKey];
  let itemCategory = item["equipment_category"];
  const subCategories = {
    "Adventuring Gear": "gear_category",
    Tools: "tool_category",
    Weapon: "weapon_category",
    "Mounts and Vehicles": "vehicle_category",
  };
  if (subCategories[itemCategory]) {
    itemCategory = item[subCategories[itemCategory]];
  }
  if (!lookup[itemCategory]) {
    lookup[itemCategory] = [itemKey];
  } else {
    lookup[itemCategory].push(itemKey);
  }
  return lookup;
}, {});
class Shop {
  category: string;
  inventory: string[];
  maxItems: number;
  constructor({ category, maxItems = 10 }) {
    this.maxItems = maxItems;
    this.category = category;
    this.randomizeInventory();
  }
  randomizeInventory = () => {
    const itemCount =
      this.maxItems + Math.ceil(randomSign(this.maxItems * 0.1));
    this.inventory = sampleSize(itemsByCategory[this.category], itemCount);
    return this.inventory;
  };
}

export default Shop;
