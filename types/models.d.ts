import { Armour, EquipmentPack, Gear, Item, Tool, Vehicle, Weapon } from ".";
import { Document } from "mongoose";

export interface StockModel extends Document {
  number: number;
  max: number;
  itemId: string;
  shopId: string;
  userId: string;
}

export interface ShopModel extends Document {
  name: string;
  userId: string;
}

export interface UserModel extends Document {
  password: string;
  email: string;
  username: string;
  admin: boolean;
}
export interface ItemModel extends Item, Document {
  global: boolean;
}
export interface GearModel extends Document, Gear {
  global: boolean;
}
export interface PackModel extends Document, EquipmentPack {
  global: boolean;
}
export interface ToolModel extends Document, Tool {
  global: boolean;
}
export interface VehicleModel extends Document, Vehicle {
  global: boolean;
}
export interface WeaponModel extends Document, Weapon {
  global: boolean;
}
export interface ArmourModel extends Document, Armour {
  global: boolean;
}
