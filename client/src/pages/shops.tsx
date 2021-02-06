import { Colors, Spinner } from "@blueprintjs/core";
import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { getShops } from "../api-service";
import { ErrorBanner } from "../components/shared";
import { Grid, Page, PageText, PageTitle } from "../components/shared";
import { CreateShop, Shop } from "../components/shops";

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
  const { data, isLoading, isError, refetch } = useQuery("shops", getShops);
  if (isError) {
    return <ErrorBanner text="Something went wrong - would you like to go " />;
  }

  return (
    <Page>
      <PageTitle>Your Shops!</PageTitle>
      <PageText>
        Create and update shops! Select a shop to see what it stocks
      </PageText>
      <Grid>
        {isLoading ? (
          <ShopSkeleton>
            <Spinner />
          </ShopSkeleton>
        ) : (
          <>
            <CreateShop refetch={refetch} />
            {(data || []).map(({ name, _id }, i) => (
              <Shop
                refetch={refetch}
                key={`${name}-${i}`}
                name={name}
                shopId={_id}
              />
            ))}
          </>
        )}
      </Grid>
    </Page>
  );
};
