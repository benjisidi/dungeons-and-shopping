import {
  Button,
  Card,
  Colors,
  Dialog,
  InputGroup,
  Spinner,
} from "@blueprintjs/core";
import isEmpty from "lodash/isEmpty";
import React, { Reducer } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { getStock } from "../api-service";
import { ClearButton, ErrorBanner } from "../components/shared";
import { Grid, Page, PageText, PageTitle } from "../components/shared";
import {
  DetailsOverlay,
  PurchaseForm,
  ShoppingCart,
  StockCard,
  stockReducer,
} from "../components/stock";
import type {
  DetailedStock,
  PageState,
  ShopModel,
  StockAction,
} from "../types";

const SearchPanel = styled.div`
  margin: 30px auto 0;
  width: 300px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const StockSkeleton = styled(Card)`
  height: 150px;
  width: 300px;
  margin: 10px;
  background-color: ${Colors.LIGHT_GRAY5};
  justify-content: center;
  align-items: center;
  display: flex;
`;

const CartButton = styled(Button)`
  margin-right: 10px;
  width: 120px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const getStockObject = (stock: DetailedStock[]): PageState["stock"] =>
  stock.reduce((acc: PageState["stock"], curr) => {
    acc[curr.itemId] = curr;
    return acc;
  }, {});

const isCardShown = (stockItem: DetailedStock, filter: string) =>
  !filter ||
  stockItem.name.includes(filter) ||
  stockItem.index.includes(filter);

const sortStock = (filter: string) => (
  a: DetailedStock,
  b: DetailedStock
): number => {
  const showA = isCardShown(a, filter);
  const showB = isCardShown(b, filter);
  if (showA === showB) {
    return 0;
  }
  if (showA && !showB) {
    return -1;
  }
  if (!showA && showB) {
    return 1;
  }
};

const StockPage = ({
  stock,
  shop,
}: {
  stock: DetailedStock[];
  shop: ShopModel;
}) => {
  const [filter, setFilter] = React.useState("");
  const [state, dispatch] = React.useReducer<Reducer<PageState, StockAction>>(
    stockReducer,
    {
      isPurchaseFormOpen: false,
      isDetailsOpen: false,
      isCartOpen: false,
      purchaseItem: null,
      detailsItem: null,
      cart: {},
      stock: getStockObject(stock),
    }
  );

  return (
    <>
      <SearchPanel>
        <CartButton
          disabled={isEmpty(state.cart)}
          onClick={() => dispatch({ type: "OPEN_CART" })}
        >
          {isEmpty(state.cart) ? "Cart Empty!" : "Shopping Cart"}
        </CartButton>

        <InputGroup
          placeholder="Type Here to Search"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value)
          }
          value={filter}
          rightElement={<ClearButton clearValue={() => setFilter("")} />}
        />
      </SearchPanel>
      <Grid>
        {Object.values(state.stock)
          .sort(sortStock(filter))
          .map((stockItem) => {
            const showCard = isCardShown(stockItem, filter);

            return (
              <StockCard
                show={showCard}
                key={stockItem.index}
                stock={stockItem}
                dispatch={dispatch}
              />
            );
          })}
      </Grid>
      <DetailsOverlay
        dispatch={dispatch}
        detailsItem={state.stock[state.detailsItem as string]}
        isOpen={state.isDetailsOpen}
      />
      <Dialog
        onClose={() => dispatch({ type: "CANCEL_PURCHASE" })}
        title={state.stock[state.purchaseItem as string]?.name}
        isOpen={state.isPurchaseFormOpen}
      >
        {state.isPurchaseFormOpen && (
          <PurchaseForm state={state} dispatch={dispatch} />
        )}
      </Dialog>
      <ShoppingCart shopId={shop._id} state={state} dispatch={dispatch} />
    </>
  );
};

export const Stock = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const elapsedTime = 0;
  const { data, isLoading, isError } = useQuery(["stock", { shopId }], () =>
    getStock({ shopId, elapsedTime })
  );
  if (isError) {
    return <ErrorBanner text="Something went wrong - would you like to go " />;
  }

  return (
    <Page>
      <PageTitle loading={isLoading}>
        {isLoading ? "Loading..." : data.shop.name}
      </PageTitle>
      <PageText loading={isLoading}>
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            {`Welcome to ${data.shop.name}! Have a look around - buy something if it catches your eye. Don't worry about those other `}
            <Link to="/shops">shops</Link> - we have everything you need
          </>
        )}
      </PageText>
      {isLoading ? (
        <>
          <SearchPanel>
            <CartButton loading={true}>Shopping Cart</CartButton>
            <InputGroup disabled={true} />
          </SearchPanel>
          <Grid>
            {new Array(10).fill(null).map((_, i) => (
              <StockSkeleton key={i}>
                <Spinner />
              </StockSkeleton>
            ))}
          </Grid>
        </>
      ) : (
        <StockPage stock={data.stock} shop={data.shop} />
      )}
    </Page>
  );
};
