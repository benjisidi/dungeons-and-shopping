import { Button, Colors } from "@blueprintjs/core";
import React from "react";

import type { Item, Stock } from "../../../../types";
import type { StockAction } from "../../types";
import {
  ButtonHolder,
  CardHeader,
  CardText,
  CardTitle,
  StandardCard,
} from "../shared";

export const StockCard = ({
  stock,
  dispatch,
}: {
  stock: Stock & Item;
  dispatch: React.Dispatch<StockAction>;
}) => {
  const { name, number, cost, itemId } = stock;
  const isDisabled = number === 0;
  return (
    <StandardCard
      style={{
        backgroundColor: isDisabled ? Colors.LIGHT_GRAY5 : Colors.WHITE,
      }}
      onClick={() =>
        !isDisabled && dispatch({ type: "OPEN_PURCHASE", payload: itemId })
      }
      interactive={!isDisabled}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <ButtonHolder onClick={(e) => e.stopPropagation()}>
          <Button
            minimal={true}
            onClick={() => dispatch({ type: "OPEN_DETAILS", payload: itemId })}
          >
            Details
          </Button>
        </ButtonHolder>
      </CardHeader>
      <CardText>{`available: ${number}`}</CardText>
      <CardText> {`price: ${cost?.quantity} ${cost?.unit}`}</CardText>
    </StandardCard>
  );
};
