import { Intent, Tooltip } from "@blueprintjs/core";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import { deleteShop as deleteShopRequest } from "../../api-service";
import type { RequestError } from "../../api-service/api-helpers/request-error";
import { AppToaster, useGlobal } from "../../common";
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
  const [lookup, setLookup] = useGlobal("shopLookup");
  const [isTooltipDisabled, setDisabled] = React.useState(false);
  const [deleteShop] = useMutation<string, RequestError, { id: string }>(
    deleteShopRequest
  );
  const handleDelete = () =>
    deleteShop(
      { id: shopId },
      {
        onSuccess: () => {
          const newLookup = { ...lookup };
          delete newLookup[shopId];
          setLookup(newLookup);
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
    <Tooltip disabled={isTooltipDisabled} content="Click to view stock">
      <StandardCard
        elevation={2}
        interactive={true}
        onClick={() => history.push(`/shops/${shopId}`)}
      >
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <ButtonHolder
            onMouseEnter={() => setDisabled(true)}
            onMouseLeave={() => setDisabled(false)}
          >
            <EditButton shop={{ name }} refetch={refetch} shopId={shopId} />
            <DeleteButton handleDelete={handleDelete} name={name} />
          </ButtonHolder>
        </CardHeader>
      </StandardCard>
    </Tooltip>
  );
};
