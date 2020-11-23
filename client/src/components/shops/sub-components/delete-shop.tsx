import { Alert, Button, Intent } from "@blueprintjs/core";
import React from "react";

export const DeleteButton = ({
  handleDelete,
  name,
}: {
  handleDelete: () => void;
  name: string;
}) => {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        icon="delete"
        intent={Intent.DANGER}
        minimal={true}
        onClick={() => setDeleteOpen(true)}
      />
      <Alert
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        intent={Intent.DANGER}
        icon="delete"
      >
        <h3 style={{ marginTop: 0 }}>{`Delete ${name}?`}</h3>
        <p>
          {"This will permanently delete the shop and all it's stock records"}
        </p>
      </Alert>
    </div>
  );
};
