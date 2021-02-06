import { Intent, Tooltip } from "@blueprintjs/core";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import { deleteShop as deleteShopRequest } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster } from "../../common";
import { ButtonHolder, CardHeader, CardTitle, StandardCard } from "../shared";
import { DeleteButton, EditButton } from "./sub-components";

export const Shop = ({
  name,
  shopId,
  refetch,
}: {
  name: string;
  shopId: string;
  refetch: () => void;
}) => {
  const history = useHistory();

  const [isTooltipDisabled, setDisabled] = React.useState(false);
  const { mutate: deleteShop } = useMutation<
    string,
    RequestError,
    { id: string }
  >(deleteShopRequest);
  const handleDelete = () =>
    deleteShop(
      { id: shopId },
      {
        onSuccess: () => {
          refetch();
          AppToaster.show({
            message: `${name} has been deleted`,
            intent: Intent.DANGER,
            icon: "delete",
          });
        },
      }
    );

  return (
    <StandardCard
      tooltipDisabled={isTooltipDisabled}
      tooltipContent="Click to view stock"
      elevation={2}
      interactive={true}
      onClick={() => history.push(`/shops/${shopId}`)}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <ButtonHolder>
          <Tooltip
            content="Click to edit shop"
            onOpened={() => setDisabled(true)}
            onClose={() => setDisabled(false)}
          >
            <EditButton shop={{ name }} refetch={refetch} shopId={shopId} />
          </Tooltip>
          <Tooltip
            content="Click to delete shop"
            onOpened={() => setDisabled(true)}
            onClose={() => setDisabled(false)}
          >
            <DeleteButton handleDelete={handleDelete} name={name} />
          </Tooltip>
        </ButtonHolder>
      </CardHeader>
    </StandardCard>
  );
};
