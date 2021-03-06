/* eslint-disable @typescript-eslint/camelcase */
import { model, Schema, Document } from "mongoose";
import {
  Armour as IArmour,
  EquipmentPack as IEquipmentPack,
  Gear as IGear,
  Item as IItem,
  Tool as ITool,
  Vehicle as IVehicle,
  Weapon as IWeapon,
} from "shared-types";
import { itemType } from "shared-types";

interface ItemModel extends Document, IItem {
  global: boolean;
}
interface GearModel extends Document, IGear {
  global: boolean;
}
interface PackModel extends Document, IEquipmentPack {
  global: boolean;
}
interface ToolModel extends Document, ITool {
  global: boolean;
}
interface VehicleModel extends Document, IVehicle {
  global: boolean;
}
interface WeaponModel extends Document, IWeapon {
  global: boolean;
}
interface ArmourModel extends Document, IArmour {
  global: boolean;
}

const itemTypes: itemType[] = [
  "gear",
  "pack",
  "tool",
  "vehicle",
  "weapon",
  "armour",
];
export const ItemSchema = new Schema(
  {
    cost: {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, enum: ["cp", "sp", "gp"] },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    global: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
    },
    index: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: itemTypes,
    },
    weight: Number,
  },
  { timestamps: true, discriminatorKey: "type" }
);
export const Item = model<ItemModel>("Item", ItemSchema);

export const Gear = Item.discriminator<GearModel>(
  "gear",
  new Schema({
    details: {
      gear_category: {
        type: String,
        required: true,
        enum: [
          "Standard Gear",
          "Holy Symbol",
          "Ammunition",
          "Kit",
          "Arcane focus",
          "Druidic focus",
        ],
      },
      desc: {
        type: [String],
      },
    },
  })
);

export const Pack = Item.discriminator<PackModel>(
  "pack",
  new Schema({
    details: {
      contents: [
        new Schema(
          {
            index: { type: String, required: true },
            quantity: { type: Number, required: true },
          },
          { _id: false }
        ),
      ],
    },
  })
);

export const Tool = Item.discriminator<ToolModel>(
  "tool",
  new Schema({
    details: {
      tool_category: {
        type: String,
        required: true,
        enum: [
          "Artisan's Tools",
          "Musical Instrument",
          "Gaming Sets",
          "Other Tools",
        ],
      },
      desc: {
        type: [String],
      },
    },
  })
);

export const Vehicle = Item.discriminator<VehicleModel>(
  "vehicle",
  new Schema({
    details: {
      vehicle_category: {
        type: String,
        required: true,
        enum: [
          "Tack, Harness, and Drawn Vehicles",
          "Mounts and Other Animals",
          "Waterborne Vehicles",
        ],
      },
      capacity: String,
      speed: { quantity: Number, unit: String },
      desc: {
        type: [String],
      },
    },
  })
);

const Damage = new Schema(
  {
    damage_dice: { type: String, required: true },
    damage_bonus: { type: Number, required: true },
    damage_type: { type: String, required: true },
  },
  { _id: false }
);

export const Weapon = Item.discriminator<WeaponModel>(
  "weapon",
  new Schema({
    details: {
      weapon_category: {
        type: String,
        required: true,
        enum: ["Martial", "Simple"],
      },
      weapon_range: { type: String, required: true, enum: ["Melee", "Ranged"] },
      category_range: {
        type: String,
        required: true,
        enum: [
          "Martial Melee",
          "Martial Ranged",
          "Simple Melee",
          "Simple Ranged",
        ],
      },
      damage: { type: Damage, required: true },
      range: { normal: Number, long: Number },
      "2h_damage": Damage,
      throw_range: { normal: Number, long: Number },
      properties: [String],
      special: [String],
    },
  })
);

const ArmourClass = new Schema(
  {
    base: { type: Number, required: true },
    dex_bonus: { type: Boolean, required: true },
    max_bonus: Number,
  },
  { _id: false }
);

export const Armour = Item.discriminator<ArmourModel>(
  "armour",
  new Schema({
    details: {
      armor_category: {
        type: String,
        required: true,
        enum: ["Medium", "Heavy", "Light", "Shield"],
      },
      armor_class: ArmourClass,
      str_minimum: { type: Number, required: true, enum: [0, 13, 15] },
      stealth_disadvantage: {
        type: Boolean,
        default: false,
      },
    },
  })
);
