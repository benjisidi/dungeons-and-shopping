import cloneDeep from "lodash/cloneDeep";

import type { PageState, StockAction } from "../../types";
import type { Item, Stock } from "shared-types";

const openDetailsOverlay = (state: PageState, itemId: string): PageState => {
  const newState = cloneDeep(state);
  newState.detailsItem = itemId;
  newState.isDetailsOpen = true;
  return newState;
};
const closeDetailsOverlay = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.detailsItem = null;
  newState.isDetailsOpen = false;
  return newState;
};
const openPurchaseForm = (
  state: PageState,
  purchaseItem: PageState["purchaseItem"]
): PageState => {
  const newState = cloneDeep(state);
  newState.purchaseItem = purchaseItem;
  newState.isPurchaseFormOpen = true;
  return newState;
};
const addToCart = (state: PageState, number: number): PageState => {
  const newState = cloneDeep(state);
  const purchaseId = newState.purchaseItem as string;
  const existingCartEntry = newState.cart[purchaseId];
  const stockEntry = newState.stock[purchaseId] as Stock & Item;
  stockEntry.number -= number;
  if (!existingCartEntry) {
    newState.cart[purchaseId] = { itemId: purchaseId, number };
  } else {
    existingCartEntry.number += number;
  }
  newState.purchaseItem = null;
  newState.isPurchaseFormOpen = false;
  return newState;
};

const cancelPurchase = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.purchaseItem = null;
  newState.isPurchaseFormOpen = false;
  return newState;
};
const openCart = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.isCartOpen = true;
  return newState;
};
const closeCart = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.isCartOpen = false;
  return newState;
};

const clearCart = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  Object.values(newState.cart).forEach(({ itemId, number }) => {
    newState.stock[itemId].number += number;
  });
  newState.isCartOpen = false;
  newState.cart = {};
  return newState;
};

const buyCart = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.isCartOpen = false;
  newState.cart = {};
  return newState;
};

const editCartItem = (
  state: PageState,
  quantity: number,
  itemId: string
): PageState => {
  const newState = cloneDeep(state);
  newState.stock[itemId].number -= quantity;
  newState.cart[itemId].number += quantity;
  return newState;
};
const deleteCartItem = (state: PageState, itemId: string): PageState => {
  const newState = cloneDeep(state);
  newState.stock[itemId].number += newState.cart[itemId].number;
  delete newState.cart[itemId];
  return newState;
};

export const stockReducer = (
  state: PageState,
  action: StockAction
): PageState => {
  switch (action.type) {
    case "OPEN_DETAILS":
      return openDetailsOverlay(state, action.payload);
    case "CLOSE_DETAILS":
      return closeDetailsOverlay(state);
    case "OPEN_PURCHASE":
      return openPurchaseForm(state, action.payload);
    case "ADD_TO_CART":
      return addToCart(state, action.payload);
    case "CANCEL_PURCHASE":
      return cancelPurchase(state);
    case "CLOSE_CART":
      return closeCart(state);
    case "OPEN_CART":
      return openCart(state);
    case "EDIT_CART_ITEM":
      return editCartItem(state, action.payload, action.meta);
    case "DELETE_CART_ITEM":
      return deleteCartItem(state, action.payload);
    case "CLEAR_CART":
      return clearCart(state);
    case "BUY_CART":
      return buyCart(state);
    default:
      throw new Error(
        `${(action as StockAction)?.type} is not a recognised stock action type`
      );
  }
};
