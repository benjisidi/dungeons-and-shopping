import { Button, Colors, Drawer, Intent } from "@blueprintjs/core";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import type { RequestError } from "src/api-service/api-helpers/request-error";
import type {
  Item,
  PageState,
  Stock,
  StockAction,
  StockModel,
} from "src/types";
import styled from "styled-components";

import { updateStock } from "../../api-service";
import { AppToaster } from "../../common";
import { CardTitle } from "../shared";

const CartWrapper = styled.div`
  padding: 20px;
`;
const ItemWrapper = styled.div`
  height: 30px;
  display: flex;
  margin: 10px 0px;
  align-items: center;
`;
const ItemText = styled.p`
  margin: 0px;
  width: 170px;
  height: 20px;
`;
const QuantityText = styled.p`
  margin: 0px;
  width: 20px;
  height: 20px;
`;
const CostText = styled.p`
  margin: 0px;
  padding-left: 10px;
  width: 50px;
  height: 20px;
`;
const UnitText = styled.p`
  margin: 0px;
  width: 50px;
  height: 20px;
`;
const ItemList = styled.div`
  height: 70vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
    background-color: ${Colors.GRAY5};
  }
  &::-webkit-scrollbar-thumb {
    background: ${Colors.GRAY3};
    border-radius: 100px;
  }
`;
const CartButton = styled(Button)`
  width: 120px;
  margin-right: 10px;
`;
const getTotalCost = (cart: PageState["cart"], stock: PageState["stock"]) =>
  Object.values(cart).reduce(
    (acc: Record<"cp" | "sp" | "gp", number>, { itemId, number }) => {
      const { unit, quantity } = stock[itemId].cost;
      acc[unit] += quantity * number;
      return acc;
    },
    { cp: 0, sp: 0, gp: 0 }
  );

const CartItem = ({
  item,
  quantity,
  dispatch,
}: {
  dispatch: React.Dispatch<StockAction>;
  item: Stock & Item;
  quantity: number;
}) => {
  return (
    <ItemWrapper>
      <strong>
        <QuantityText>{quantity}</QuantityText>
      </strong>
      <strong>
        <QuantityText> x </QuantityText>
      </strong>
      <ItemText>{item.name}</ItemText>
      <Button
        onClick={() =>
          dispatch({ type: "EDIT_CART_ITEM", payload: -1, meta: item.itemId })
        }
        disabled={quantity === 0}
        icon="minus"
        minimal={true}
      />
      <Button
        onClick={() =>
          dispatch({ type: "EDIT_CART_ITEM", payload: 1, meta: item.itemId })
        }
        disabled={item.number === 0}
        icon="add"
        minimal={true}
        intent={Intent.SUCCESS}
      />
      <Button
        onClick={() =>
          dispatch({ type: "DELETE_CART_ITEM", payload: item.itemId })
        }
        icon="trash"
        minimal={true}
        intent={Intent.DANGER}
      />
      <CostText>{item.cost.quantity * quantity} </CostText>
      <UnitText>{item.cost.unit}</UnitText>
    </ItemWrapper>
  );
};
export const ShoppingCart = ({
  state,
  dispatch,
  shopId,
}: {
  shopId: string;
  state: PageState;
  dispatch: React.Dispatch<StockAction>;
}) => {
  const { mutate: buyCart, isLoading } = useMutation<
    StockModel[],
    RequestError,
    {
      shopId: string;
      stock: Omit<Stock, "userId" | "itemId" | "shopId" | "max">[];
    }
  >(updateStock);
  const queryClient = useQueryClient();
  return (
    <Drawer
      style={{ width: "400px" }}
      isOpen={state.isCartOpen}
      onClose={() => dispatch({ type: "CLOSE_CART" })}
    >
      <CartWrapper>
        <CardTitle>Shopping Cart</CardTitle>
        <ItemList>
          {Object.values(state.cart).map(({ itemId, number }) => {
            const item = state.stock[itemId];
            return (
              <CartItem
                dispatch={dispatch}
                key={item.index}
                item={item}
                quantity={number}
              />
            );
          })}
        </ItemList>
        <ItemWrapper>
          <ItemText>{"Total Cost :"}</ItemText>
          {Object.entries(getTotalCost(state.cart, state.stock))
            .filter(([, cost]) => cost)
            .map(([unit, cost]) => (
              <CostText key={unit}>{`${cost} ${unit}`} </CostText>
            ))}
        </ItemWrapper>
        <ItemWrapper>
          <CartButton
            loading={isLoading}
            disabled={isEmpty(state.cart)}
            onClick={() =>
              buyCart(
                { shopId, stock: Object.values(state.cart) },
                {
                  onSuccess: () => {
                    dispatch({ type: "BUY_CART" });
                    AppToaster.show({
                      message: "Items Bought!",
                      intent: Intent.SUCCESS,
                      icon: "tick-circle",
                    });
                    queryClient.setQueryData(
                      ["stock", { shopId }],
                      ({ shop }) => ({
                        stock: Object.values(state.stock),
                        shop,
                      })
                    );
                  },
                  onError: () => {
                    AppToaster.show({
                      message: "Something's gone horribly wrong",
                      intent: Intent.DANGER,
                      icon: "error",
                    });
                  },
                }
              )
            }
            icon="shopping-cart"
          >
            Buy
          </CartButton>
          <CartButton
            loading={isLoading}
            disabled={isEmpty(state.cart)}
            onClick={() => {
              dispatch({ type: "CLEAR_CART" });
              return AppToaster.show({
                message: "Cart Emptied",
                intent: Intent.DANGER,
                icon: "delete",
              });
            }}
            icon="delete"
          >
            Clear Cart
          </CartButton>
        </ItemWrapper>
      </CartWrapper>
    </Drawer>
  );
};
