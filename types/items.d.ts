export interface BaseItem {
  _id: string;
  index: string;
  name: string;
  cost: {
    quantity: number;
    unit: "cp" | "sp" | "gp";
  };
  weight: number;
  desc: string[];
  url: string;
  equipment_category:
    | "Adventuring Gear"
    | "Tools"
    | "Mounts and Vehicles"
    | "Weapon"
    | "Armor";
  special?: string[];
}

export interface Gear extends BaseItem {
  gear_category:
    | "Standard Gear"
    | "Holy Symbol"
    | "Ammunition"
    | "Equipment Pack"
    | "Kit"
    | "Arcane focus"
    | "Druidic focus";
}

export interface EquipmentPack extends Gear {
  contents: { item_url: string; quantity: number }[];
}

export interface Tool extends BaseItem {
  tool_category:
    | "Artisan's Tools"
    | "Musical Instrument"
    | "Gaming Sets"
    | "Other Tools";
}

export interface Vehicle extends Gear {
  vehicle_category:
    | "Tack, Harness, and Drawn Vehicles"
    | "Mounts and Other Animals"
    | "Waterborne Vehicles";
  capacity?: string;
  speed?: { quantity: number; unit: string };
}

export interface Damage {
  damage_dice: string;
  damage_bous: number;
  damage_type: {
    url: string;
    name: string;
  };
}

export interface Weapon extends Gear {
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
  properties?: { url: string; name: string }[];
}

export interface Armor extends Gear {
  armor_category: "Medium" | "Heavy" | "Light" | "Shield";
  armor_class: { base: number; dex_bonus: boolean; max_bonus: null | number };
  str_minimum: 0 | 13 | 15;
  stealth_disadvantage: boolean;
}
