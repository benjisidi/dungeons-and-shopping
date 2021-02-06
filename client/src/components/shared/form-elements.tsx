import { Button, Colors, InputGroup, Intent, Tooltip } from "@blueprintjs/core";
import React, { Dispatch } from "react";
import styled from "styled-components";

export const LockButton = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
    <Button
      icon={showPassword ? "unlock" : "lock"}
      intent={Intent.WARNING}
      minimal={true}
      onClick={() => setShowPassword((val) => !val)}
    />
  </Tooltip>
);
export const ClearButton = ({ clearValue }: { clearValue: () => void }) => (
  <Tooltip content="Clear value">
    <Button
      icon="delete"
      intent={Intent.WARNING}
      minimal={true}
      onClick={clearValue}
    />
  </Tooltip>
);

export const FormWrapper = styled.div`
  margin: 30px auto 0;
  width: 300px;
`;

export const Input = styled(InputGroup)`
  margin-top: 5px;
`;
export const ErrorText = styled.p`
  color: ${Colors.RED1};
  height: 18px;
`;
