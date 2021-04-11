import { Button, Dialog, Intent } from "@blueprintjs/core";
import React from "react";
import { useMutation } from "react-query";

import { updateShop as updateShopRequest } from "../../../api-service";
import type { RequestError } from "../../../api-service/api-helpers/request-error";
import { AppToaster } from "../../../common";
import type { Shop, Response, ShopMeta } from "shared-types";
import { ShopForm } from "./shop-form";

export const EditButton = ({
  refetch,
  shop,
  shopId,
}: {
  refetch: () => void;
  shop: ShopMeta;
  shopId: string;
}) => {
  const [isEditOpen, setEditOpen] = React.useState(false);
  const { mutate: updateShop, isError, isLoading, error } = useMutation<
    Response<Shop>[],
    RequestError,
    ShopMeta & { id: string }
  >(updateShopRequest);

  const submit = async (values: ShopMeta) => {
    updateShop(
      { ...values, id: shopId },
      {
        onSuccess: () => {
          refetch();
          setEditOpen(false);
          AppToaster.show({
            message: `Updated ${values.name}!`,
            intent: Intent.SUCCESS,
            icon: "tick-circle",
          });
        },
      }
    );
  };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        intent={Intent.PRIMARY}
        icon="edit"
        minimal={true}
        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          e.stopPropagation();
          setEditOpen(true);
        }}
      />
      <Dialog
        onClose={() => setEditOpen(false)}
        title={`Edit $`}
        isOpen={isEditOpen}
      >
        <ShopForm
          submit={submit}
          error={error?.message as string}
          isError={isError}
          isLoading={isLoading}
          defaultValues={shop}
        />
      </Dialog>
    </div>
  );
};
