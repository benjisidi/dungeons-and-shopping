import { Button, InputGroup, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MutateFunction, useMutation } from "react-query";

import { register as registerUser } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster } from "../../common/toaster";
import { LockButton } from "./form-elements";

const submitDetails = (
  sendDetails: MutateFunction<
    void,
    unknown,
    {
      username: string;
      password: string;
      email: string;
    },
    unknown
  >,
  onSubmit: () => void
) => async ({
  password,
  username,
  email,
}: {
  password: string;
  username: string;
  email: string;
}) => {
  await sendDetails(
    { password, username, email },
    {
      onSuccess: () => {
        onSubmit();
        AppToaster.show({
          message: `Successfully created ${username} account!`,
          intent: Intent.SUCCESS,
          icon: "tick-circle",
        });
      },
    }
  );
};

export const RegisterForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { register, handleSubmit, errors } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [sendDetails, { isLoading, isError, error }] = useMutation<
    void,
    RequestError,
    {
      username: string;
      password: string;
      email: string;
    }
  >(registerUser);

  return (
    <form onSubmit={handleSubmit(submitDetails(sendDetails, onSubmit))}>
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
            name="email"
            placeholder="Enter your email..."
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
            intent={isError || errors.username ? Intent.DANGER : "none"}
            inputRef={register({ required: true })}
            name="username"
            placeholder="Enter your username..."
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
