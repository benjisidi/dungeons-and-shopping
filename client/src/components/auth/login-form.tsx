import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { login } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster } from "../../common";
import {
  ClearButton,
  ErrorText,
  FormWrapper,
  Input,
  LockButton,
} from "../shared";

declare interface CurrentUser {
  password: string;
  username: string;
}

export const LoginForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      username: localStorage.getItem("savedUser"),
      password: null,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: sendDetails, isLoading, isError, error } = useMutation<
    void,
    RequestError,
    CurrentUser
  >(login);

  const submit = (values: CurrentUser) =>
    sendDetails(values, {
      onSuccess: () => {
        onSubmit();
        AppToaster.show({
          message: `Welcome, ${values.username}!`,
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
          intent={isError || errors.username ? Intent.DANGER : "none"}
          inputRef={register({ required: true })}
          name="username"
          placeholder="Enter your username..."
          rightElement={
            <ClearButton clearValue={() => setValue("username", null)} />
          }
          type="text"
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

        <ErrorText style={{ color: "red", height: 18 }}>
          {isError ? error?.message : ""}
        </ErrorText>
        <Button loading={isLoading} disabled={isLoading} type="submit">
          Submit
        </Button>
      </FormWrapper>
    </form>
  );
};
