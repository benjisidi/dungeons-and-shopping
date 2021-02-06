import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { register as registerUser } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster } from "../../common";
import { ErrorText, FormWrapper, Input, LockButton } from "../shared";

declare interface NewUser {
  username: string;
  password: string;
  email: string;
}
export const RegisterForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { register, handleSubmit, errors } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: sendDetails, isLoading, isError, error } = useMutation<
    void,
    RequestError,
    NewUser
  >(registerUser);

  const submit = (values: NewUser) =>
    sendDetails(values, {
      onSuccess: () => {
        onSubmit();
        AppToaster.show({
          message: `Successfully created ${values.username} account!`,
          intent: Intent.SUCCESS,
          icon: "tick-circle",
        });
      },
    });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormWrapper>
        <Input
          disabled={isLoading}
          intent={isError || errors.email ? Intent.DANGER : "none"}
          inputRef={register({ required: true })}
          name="email"
          placeholder="Enter your email..."
          type={"text"}
        />
        <Input
          disabled={isLoading}
          intent={isError || errors.username ? Intent.DANGER : "none"}
          inputRef={register({ required: true })}
          name="username"
          placeholder="Enter your username..."
          type={"text"}
        />
        <Input
          disabled={isLoading}
          intent={isError || errors.password ? Intent.DANGER : "none"}
          inputRef={register({ required: true })}
          name="password"
          placeholder="Enter your password..."
          rightElement={
            <LockButton
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          }
          type={showPassword ? "text" : "password"}
        />
        <ErrorText>{isError ? error?.message : ""}</ErrorText>
        <Button loading={isLoading} disabled={isLoading} type="submit">
          Submit
        </Button>
      </FormWrapper>
    </form>
  );
};
