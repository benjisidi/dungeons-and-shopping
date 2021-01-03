import type { Item, Stock } from "../../../types";
import type {
  ArmourDetails,
  EquipmentPackDetails,
  GearDetails,
  ToolDetails,
  VehicleDetails,
  WeaponDetails,
} from ".";

export interface ShoppingCartItem {
  itemId: string;
  number: number;
}
declare type Details =
  | ArmourDetails
  | WeaponDetails
  | VehicleDetails
  | ToolDetails
  | GearDetails
  | EquipmentPackDetails;

export interface PageState {
  isPurchaseFormOpen: boolean;
  isDetailsOpen: boolean;
  isCartOpen: boolean;
  purchaseItem: string | null;
  detailsItem: string | null;
  cart: { [itemId: string]: ShoppingCartItem };
  stock: { [itemId: string]: Stock & Item };
}

interface FluxStandardAction {
  type: string;
  payload?: unknown;
  meta?: unknown;
}

interface OpenDetails extends FluxStandardAction {
  type: "OPEN_DETAILS";
  payload: string;
}

interface SimpleAction extends FluxStandardAction {
  type: "CLOSE_DETAILS" | "CANCEL_PURCHASE" | "OPEN_CART" | "CLOSE_CART";
}

interface OpenPurchaseForm extends FluxStandardAction {
  type: "OPEN_PURCHASE";
  payload: string;
}

interface AddToCart extends FluxStandardAction {
  type: "ADD_TO_CART";
  payload: number;
}

export type StockAction =
  | OpenDetails
  | SimpleAction
  | OpenPurchaseForm
  | AddToCart;
