import { Button, InputGroup, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MutateFunction, useMutation } from "react-query";

import { login } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { ClearButton, LockButton } from "./form-elements";

const submitDetails = (
  sendDetails: MutateFunction<
    void,
    RequestError,
    {
      username: string;
      password: string;
    },
    unknown
  >
) => async ({ password, username }: { password: string; username: string }) => {
  await sendDetails({ password, username });
};

export const LoginForm = () => {
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      username: localStorage.getItem("savedUser"),
      password: null,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [sendDetails, { isLoading, isError, error }] = useMutation<
    void,
    RequestError,
    {
      username: string;
      password: string;
    }
  >(login);

  return (
    <form onSubmit={handleSubmit(submitDetails(sendDetails))}>
      <div
        style={{
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: 20,
          width: 300,
        }}
      >
        <div
          style={{
            marginTop: 5,
          }}
        >
          <InputGroup
            disabled={isLoading}
            intent={isError || errors.username ? Intent.DANGER : "none"}
            inputRef={register({ required: true })}
            name="username"
            placeholder="Enter your username..."
            rightElement={
              <ClearButton clearValue={() => setValue("username", null)} />
            }
            type={"text"}
          />
        </div>
        <div
          style={{
            marginTop: 5,
          }}
        >
          <InputGroup
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
        </div>
        <p style={{ color: "red", height: 18 }}>
          {isError ? error?.message : ""}
        </p>
        <Button loading={isLoading} disabled={isLoading} type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};
