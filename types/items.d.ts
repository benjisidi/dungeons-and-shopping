export type rawItemType =
  | "Adventuring Gear"
  | "Tools"
  | "Mounts and Vehicles"
  | "Weapon"
  | "Armor";

interface RawBaseItem {
  _id: string;
  index: string;
  name: string;
  cost: {
    quantity: number;
    unit: "cp" | "sp" | "gp";
  };
  weight?: number;
  url: string;
  equipment_category: rawItemType;
}

interface GearDetails {
  gear_category:
    | "Standard Gear"
    | "Holy Symbol"
    | "Ammunition"
    | "Equipment Pack"
    | "Kit"
    | "Arcane focus"
    | "Druidic focus";
  desc?: string[];
}

interface RawEquipmentPackDetails {
  gear_category: "Equipment Pack";
  contents: { item_url: string; quantity: number }[];
}
interface EquipmentPackDetails {
  contents: { index: string; quantity: number }[];
}

interface ToolDetails {
  tool_category:
    | "Artisan's Tools"
    | "Musical Instrument"
    | "Gaming Sets"
    | "Other Tools";
  desc: string[];
}

interface VehicleDetails {
  vehicle_category:
    | "Tack, Harness, and Drawn Vehicles"
    | "Mounts and Other Animals"
    | "Waterborne Vehicles";
  capacity?: string;
  speed?: { quantity: number; unit: string };
  desc?: string[];
}

interface RawDamage {
  damage_dice: string;
  damage_bonus: number;
  damage_type: {
    url: string;
    name: string;
  };
}
interface Damage {
  damage_dice: string;
  damage_bonus: number;
  damage_type: string;
}

interface RawWeaponDetails {
  weapon_category: "Martial" | "Simple";
  weapon_range: "Melee" | "Ranged";
  category_range:
    | "Martial Melee"
    | "Martial Ranged"
    | "Simple Melee"
    | "Simple Ranged";
  damage: RawDamage;
  range: { normal: number; long: number | null };
  "2h_damage"?: RawDamage;
  throw_range?: { normal: number; long: number };
  properties: { url: string; name: string }[];
  special?: string[];
}
interface WeaponDetails {
  weapon_category: "Martial" | "Simple";
  weapon_range: "Melee" | "Ranged";
  category_range:
    | "Martial Melee"
    | "Martial Ranged"
    | "Simple Melee"
    | "Simple Ranged";
  damage: Damage;
  range: { normal: number; long: number | null };
  "2h_damage"?: Damage;
  throw_range?: { normal: number; long: number };
  properties: string[];
  special?: string[];
}

interface ArmourDetails {
  armor_category: "Medium" | "Heavy" | "Light" | "Shield";
  armor_class: { base: number; dex_bonus: boolean; max_bonus: null | number };
  str_minimum: 0 | 13 | 15;
  stealth_disadvantage: boolean;
}

export interface RawGear extends RawBaseItem, GearDetails {
  equipment_category: "Adventuring Gear";
}

export interface RawEquipmentPack extends RawBaseItem, RawEquipmentPackDetails {
  equipment_category: "Adventuring Gear";
}

export interface RawTool extends RawBaseItem, ToolDetails {
  equipment_category: "Tools";
}

export interface RawVehicle extends RawBaseItem, VehicleDetails {
  equipment_category: "Mounts and Vehicles";
}

export interface RawWeapon extends RawBaseItem, RawWeaponDetails {
  equipment_category: "Weapon";
}

export interface RawArmour extends RawBaseItem, ArmourDetails {
  equipment_category: "Armor";
}

type itemType = "gear" | "pack" | "tool" | "vehicle" | "weapon" | "armour";

interface BaseItem {
  name: string;
  cost: {
    quantity: number;
    unit: "cp" | "sp" | "gp";
  };
  weight: number;
  type: itemType;
  index: string;
}

export interface Gear extends BaseItem {
  type: "gear";
  details: GearDetails;
}

export interface EquipmentPack extends BaseItem {
  type: "pack";
  details: EquipmentPackDetails;
}

export interface Tool extends BaseItem {
  type: "tool";
  details: ToolDetails;
}

export interface Vehicle extends BaseItem {
  type: "vehicle";
  details: VehicleDetails;
}

export interface Weapon extends BaseItem {
  type: "weapon";
  details: WeaponDetails;
}

export interface Armour extends BaseItem {
  type: "armour";
  details: ArmourDetails;
}
export interface Item extends BaseItem {
  type: itemType;
  details:
    | ArmourDetails
    | WeaponDetails
    | VehicleDetails
    | ToolDetails
    | GearDetails
    | EquipmentPackDetails;
}

export type RawItem =
  | RawGear
  | RawEquipmentPack
  | RawTool
  | RawVehicle
  | RawWeapon
  | RawArmour;

export type itemDetailKeys =
  | Array<keyof GearDetails>
  | Array<keyof EquipmentPackDetails>
  | Array<keyof ToolDetails>
  | Array<keyof VehicleDetails>
  | Array<keyof WeaponDetails>
  | Array<keyof ArmourDetails>;
