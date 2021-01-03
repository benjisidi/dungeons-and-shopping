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
  number: string;
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
  purchaseItem: (Stock & Item) | null;
  detailsState: { details: Details; name: string } | null;
  cart: ShoppingCartItem[];
  stock: Array<Stock & Item>;
}

interface FluxStandardAction {
  type: string;
  payload?: unknown;
  meta?: unknown;
}

interface OpenDetails extends FluxStandardAction {
  type: "OPEN_DETAILS";
  payload: Details;
  meta: string;
}

interface CloseDetails extends FluxStandardAction {
  type: "CLOSE_DETAILS";
}

export type StockAction = OpenDetails | CloseDetails;
