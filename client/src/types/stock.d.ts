import type {
  ArmourDetails,
  EquipmentPackDetails,
  GearDetails,
  ToolDetails,
  VehicleDetails,
  WeaponDetails,
} from ".";
import type { DetailedStock } from "./response";

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
  purchaseItem: string;
  detailsItem: string;
  cart: { [itemId: string]: ShoppingCartItem };
  stock: { [itemId: string]: DetailedStock };
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
  type:
    | "CLOSE_DETAILS"
    | "CANCEL_PURCHASE"
    | "OPEN_CART"
    | "CLOSE_CART"
    | "CLEAR_CART"
    | "BUY_CART";
}

interface OpenPurchaseForm extends FluxStandardAction {
  type: "OPEN_PURCHASE";
  payload: string;
}

interface AddToCart extends FluxStandardAction {
  type: "ADD_TO_CART";
  payload: number;
}

interface EditCartItem extends FluxStandardAction {
  type: "EDIT_CART_ITEM";
  payload: number;
  meta: string;
}

interface DeleteCartItem extends FluxStandardAction {
  type: "DELETE_CART_ITEM";
  payload: string;
}

export type StockAction =
  | OpenDetails
  | SimpleAction
  | OpenPurchaseForm
  | AddToCart
  | DeleteCartItem
  | EditCartItem;
