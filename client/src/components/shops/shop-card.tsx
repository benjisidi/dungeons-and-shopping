import { Card, Intent, Tooltip } from "@blueprintjs/core";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import type { RequestError } from "src/api-service/api-helpers/request-error";
import styled from "styled-components";

import { deleteShop as deleteShopRequest } from "../../api-service";
import { AppToaster, useGlobal } from "../../common";
import { DeleteButton, EditButton } from "./sub-components";

const CardHeader = styled.div`
  width: 100%;
  display: flex;
`;
const CardTitle = styled.h2`
  max-width: 200px;
  margin: 8px 0 0;
  overflow-wrap: break-word;
`;
const ShopCard = styled(Card)`
  padding-top: 2px;
  height: 150px;
  width: 300px;
  margin: 10px;
`;
const ButtonHolder = styled.div`
  height: 30px;
  display: flex;
  margin-left: auto;
  transform: translate(18px);
`;

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
      <ShopCard
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
      </ShopCard>
    </Tooltip>
  );
};
