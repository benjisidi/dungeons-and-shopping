import { Button, Card, Colors, InputGroup, Spinner } from "@blueprintjs/core";
import React, { Reducer } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { getStock } from "../api-service";
import { ErrorBanner } from "../components/shared";
import { Grid, Page, PageText, PageTitle } from "../components/shared";
import { DetailsOverlay, StockCard, stockReducer } from "../components/stock";
import type {
  DetailedStock,
  Details,
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
`;

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
      detailsState: null,
      cart: [],
      stock,
    }
  );
  return (
    <Page>
      <PageTitle>{shop.name}</PageTitle>
      <PageText>
        {`Welcome to ${shop.name}! Have a look around - buy something if it catches your eye. Don't worry about those other `}
        <Link to="/shops">shops</Link> - we have everything you need
      </PageText>
      <SearchPanel>
        <CartButton>Shopping Cart</CartButton>
        <InputGroup
          placeholder="Type Here to Search"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value)
          }
        />
      </SearchPanel>
      <Grid>
        {state.stock
          .filter((stockItem) => {
            if (!filter) {
              return true;
            } else {
              return (
                stockItem.name.includes(filter) ||
                stockItem.index.includes(filter)
              );
            }
          })
          .map((stockItem) => (
            <StockCard
              key={stockItem.index}
              stock={stockItem}
              dispatch={dispatch}
            />
          ))}
      </Grid>
      <DetailsOverlay
        dispatch={dispatch}
        itemName={state.detailsState?.name as string}
        details={state.detailsState?.details as Details}
        isOpen={state.isDetailsOpen}
      />
    </Page>
  );
};

export const Stock = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { data, isLoading, isError } = useQuery(
    ["stock", { shopId }],
    getStock
  );

  if (isLoading) {
    return (
      <Page>
        <PageTitle>Loading...</PageTitle>
        <PageText>Loading...</PageText>
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
      </Page>
    );
  }
  if (isError) {
    return <ErrorBanner text="Something went wrong - would you like to go " />;
  }
  const { stock, shop } = data as {
    stock: DetailedStock[];
    shop: ShopModel;
  };
  return <StockPage stock={stock} shop={shop} />;
};
