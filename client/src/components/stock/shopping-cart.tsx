import { Drawer } from "@blueprintjs/core";
import React from "react";
import type { PageState, StockAction } from "src/types";

export const ShoppingCart = ({
  state,
  dispatch,
}: {
  state: PageState;
  dispatch: React.Dispatch<StockAction>;
}) => (
  <Drawer
    isOpen={state.isCartOpen}
    onClose={() => dispatch({ type: "CLOSE_CART" })}
  >
    <div>
      {Object.values(state.cart).map(({ itemId, number }) => (
        <div key={itemId}>
          <div>{itemId}</div>
          <div>{number}</div>
        </div>
      ))}
    </div>
  </Drawer>
);
