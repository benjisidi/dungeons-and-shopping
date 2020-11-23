import { Button, Colors, InputGroup, Intent } from "@blueprintjs/core";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import type { ShopValues } from "../../../types";

const FormWrapper = styled.div`
  margin: 30px auto 0;
  width: 300px;
`;

const Input = styled(InputGroup)`
  margin-top: 5px;
`;
const ErrorText = styled.p`
  color: ${Colors.RED1};
  height: 18px;
`;

export const ShopForm = ({
  submit,
  error,
  isError,
  isLoading,
  defaultValues = {},
}: {
  error: string;
  isError: boolean;
  isLoading: boolean;
  submit: (values: ShopValues) => void;
  defaultValues?: Partial<ShopValues>;
}) => {
  const { register, handleSubmit, errors } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormWrapper>
        <Input
          disabled={isLoading}
          intent={isError || errors.name ? Intent.DANGER : "none"}
          inputRef={register({ required: true })}
          name="name"
          placeholder="Enter your shop name..."
          type="text"
        />
        <ErrorText>{isError ? error : ""}</ErrorText>
        <Button loading={isLoading} disabled={isLoading} type="submit">
          Submit
        </Button>
      </FormWrapper>
    </form>
  );
};
