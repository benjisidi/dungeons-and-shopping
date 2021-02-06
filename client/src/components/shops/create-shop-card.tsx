import { Colors, Dialog, Icon, Intent, Tooltip } from "@blueprintjs/core";
import React from "react";
import { useMutation } from "react-query";
import styled from "styled-components";

import type { ShopModel } from "../../../../types";
import { createShop as createShopRequest } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster } from "../../common";
import type { ShopValues } from "../../types";
import { ShopForm } from "./sub-components/shop-form";

const CreateShopCard = styled.div`
  height: 150px;
  width: 300px;
  margin: 10px;
  background-color: ${Colors.LIGHT_GRAY5};
  border-radius: 3px;
  border-style: dotted;
  border-color: ${Colors.GRAY5};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  &:hover {
    border-color: ${Colors.TURQUOISE4};
    & span {
      & svg {
        fill: ${Colors.TURQUOISE4};
      }
    }
  }
`;

export const CreateShop = ({ refetch }: { refetch: () => void }) => {
  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const { mutate: saveShop, isError, isLoading, error } = useMutation<
    ShopModel[],
    RequestError,
    { name: string }
  >(createShopRequest);

  const submit = (values: ShopValues) =>
    saveShop(values, {
      onSuccess: () => {
        refetch();
        setCreateOpen(false);
        AppToaster.show({
          message: `Created ${values.name}!`,
          intent: Intent.SUCCESS,
          icon: "tick-circle",
        });
      },
    });

  return (
    <>
      <Tooltip content="Click here to create a shop">
        <CreateShopCard
          role="button"
          key="add-shop"
          onClick={() => setCreateOpen(true)}
        >
          <Icon icon="insert" color={Colors.GRAY5} iconSize={40} />
        </CreateShopCard>
      </Tooltip>
      <Dialog
        onClose={() => setCreateOpen(false)}
        title="Create a new shop"
        isOpen={isCreateOpen}
      >
        <ShopForm
          submit={submit}
          error={error?.message as string}
          isError={isError}
          isLoading={isLoading}
        />
      </Dialog>
    </>
  );
};
