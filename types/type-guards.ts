import {
  RawItem,
  RawGear,
  RawEquipmentPack,
  RawWeapon,
  RawArmour,
  RawTool,
  RawVehicle,
} from ".";

export const isGear = (item: RawItem): item is RawGear =>
  item["equipment_category"] === "Adventuring Gear" &&
  item["gear_category"] !== "Equipment Pack";

export const isEquipmentPack = (item: RawItem): item is RawEquipmentPack =>
  item["gear_category"] === "Equipment Pack";

export const isWeapon = (item: RawItem): item is RawWeapon =>
  item["equipment_category"] === "Weapon";

export const isArmour = (item: RawItem): item is RawArmour =>
  item["equipment_category"] === "Armor";

export const isTool = (item: RawItem): item is RawTool =>
  item["equipment_category"] === "Tools";

export const isVehicle = (item: RawItem): item is RawVehicle =>
  item["equipment_category"] === "Mounts and Vehicles";
