import cloneDeep from "lodash/cloneDeep";

import type { Details, PageState, StockAction } from "../../types";

const openDetailsOverlay = (
  state: PageState,
  details: Details,
  name: string
): PageState => {
  const newState = cloneDeep(state);
  newState.detailsState = { details, name };
  newState.isDetailsOpen = true;
  return newState;
};
const closeDetailsOverlay = (state: PageState): PageState => {
  const newState = cloneDeep(state);
  newState.detailsState = null;
  newState.isDetailsOpen = false;
  return newState;
};

export const stockReducer = (
  state: PageState,
  action: StockAction
): PageState => {
  switch (action.type) {
    case "OPEN_DETAILS":
      return openDetailsOverlay(state, action.payload, action.meta);
    case "CLOSE_DETAILS":
      return closeDetailsOverlay(state);
    default:
      throw new Error("stock action type not recognised");
  }
};
