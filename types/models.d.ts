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
export interface ItemModel extends Item, Document {}
export interface GearModel extends Document, Gear {}
export interface PackModel extends Document, EquipmentPack {}
export interface ToolModel extends Document, Tool {}
export interface VehicleModel extends Document, Vehicle {}
export interface WeaponModel extends Document, Weapon {}
export interface ArmourModel extends Document, Armour {}
