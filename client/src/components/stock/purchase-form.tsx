import { Button, Intent, NumericInput } from "@blueprintjs/core";
import React from "react";
import { useForm } from "react-hook-form";
import type { PageState, StockAction } from "../../types";
import styled from "styled-components";

import { AppToaster } from "../../common";
import { ErrorText, FormWrapper } from "../shared";

const Input = styled(NumericInput)`
  margin-bottom: 5px;
`;

export const PurchaseForm = ({
  state,
  dispatch,
}: {
  state: PageState;
  dispatch: React.Dispatch<StockAction>;
}) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    trigger,
  } = useForm();
  const { number } = state.stock[state.purchaseItem as string];
  const submit = (values: { quantity: number }) => {
    dispatch({ type: "ADD_TO_CART", payload: values.quantity });
    return AppToaster.show({
      message: `Successfully added ${values.quantity} ${
        values.quantity === 1 ? "item" : "items"
      } to cart!`,
      intent: Intent.SUCCESS,
      icon: "tick-circle",
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormWrapper>
        <Input
          defaultValue={0}
          intent={errors.quantity ? Intent.DANGER : "none"}
          inputRef={register({
            required: "you must choose a quantity",
            valueAsNumber: true,
            min: { value: 0, message: "you must choose at least 1!" },
            max: {
              value: number,
              message: "there aren't that many available!",
            },
          })}
          onValueChange={(val) => {
            setValue("quantity", val);
            return trigger("quantity");
          }}
          name="quantity"
          placeholder="How many?"
          min={0}
          max={number}
        />
        <ErrorText>{errors.quantity?.message}</ErrorText>
        <Button disabled={watch("quantity") === 0} type="submit">
          Add To Cart
        </Button>
      </FormWrapper>
    </form>
  );
};
