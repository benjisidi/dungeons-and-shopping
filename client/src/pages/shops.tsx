import { Colors, Spinner } from "@blueprintjs/core";
import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { getShops } from "../api-service";
import { getShopLookup, setGlobal } from "../common";
import { ErrorBanner } from "../components";
import { CreateShop, Shop } from "../components/shops";

const Page = styled.div`
  width: 100%;
  height: 100%;
`;
const PageTitle = styled.h1`
  margin: 30px auto 0;
  width: 500px;
  font-size: 52px;
  text-align: center;
`;
const PageText = styled.p`
  margin: 30px auto 0;
  width: 500px;
  text-align: center;
`;
const ShopGrid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  justify-content: center;
`;
const ShopSkeleton = styled.div`
  height: 150px;
  width: 300px;
  margin: 10px;
  background-color: ${Colors.LIGHT_GRAY5};
  border-radius: 3px;
  border-style: dotted;
  border-color: ${Colors.GRAY5};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const Shops = () => {
  const { data, isLoading, isError, refetch } = useQuery("shops", getShops, {
    onSuccess: (data) => setGlobal({ shopLookup: getShopLookup(data) }),
  });
  if (isLoading) {
    return (
      <Page>
        <PageTitle>Your Shops!</PageTitle>
        <PageText>
          Create and update shops! Select a shop to see what it stocks
        </PageText>
        <ShopGrid>
          <ShopSkeleton>
            <Spinner />
          </ShopSkeleton>
        </ShopGrid>
      </Page>
    );
  }
  if (isError) {
    return <ErrorBanner text="Something went wrong - would you like to go " />;
  }

  return (
    <Page>
      <PageTitle>Your Shops!</PageTitle>
      <PageText>
        Create and update shops! Select a shop to see what it stocks
      </PageText>
      <ShopGrid>
        <CreateShop refetch={refetch} />
        {(data || []).map(({ name, _id }, i) => (
          <Shop
            refetch={refetch}
            key={`${name}-${i}`}
            name={name}
            shopId={_id}
          />
        ))}
      </ShopGrid>
    </Page>
  );
};
