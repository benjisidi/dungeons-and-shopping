import { Button, Intent, Tooltip } from "@blueprintjs/core";
import React, { Dispatch } from "react";

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
