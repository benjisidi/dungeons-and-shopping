import { Card, Classes, Overlay } from "@blueprintjs/core";
import capitalize from "lodash/capitalize";
import isArray from "lodash/isArray";
import React from "react";
import styled from "styled-components";

import type { Details, StockAction } from "../../types";

const CardTitle = styled.h2`
  margin-top: 0;
  max-width: 500px;
  overflow-wrap: break-word;
`;

const CardHolder = styled.div`
  position: fixed;
  left: calc(50vw - 250px);
  margin: 10vh 0;
  top: 0;
  width: 500px;
  padding-bottom: 10vh;
`;

const getTitle = (name: string): string => {
  if (name === "desc") {
    return "Description";
  }
  if (name === "2h_damage") {
    return "Two Handed Damage";
  }

  return name
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
};
// temp solution - should probably be a switch on details type, with a separate component for each kind of detail
const Detail = ({
  name,
  detail,
}: {
  name: string;
  detail: string | Record<string, unknown> | Array<unknown>;
}) => {
  if (detail === null || detail === undefined) {
    return null;
  }
  if (typeof detail === "string" || typeof detail === "number") {
    return (
      <div>
        <p>
          <strong>{getTitle(name)}</strong>
        </p>
        <p>{detail}</p>
      </div>
    );
  }
  if (isArray(detail)) {
    if (!detail.length) {
      return null;
    }
    return (
      <div>
        <p>
          <strong>{getTitle(name)}</strong>
        </p>
        {(detail as Array<unknown>).map((thing, i) => {
          if (typeof thing === "string") {
            return <p key={i}>{thing}</p>;
          }
          return <p key={i}>{JSON.stringify(thing)}</p>;
        })}
      </div>
    );
  }
  return (
    <div>
      <p>
        <strong>{getTitle(name)}</strong>
      </p>
      <div style={{ paddingLeft: 10 }}>
        {Object.entries(
          (detail as Record<
            string,
            string | Record<string, unknown> | string[]
          >) || {}
        ).map(([name, detail]) => (
          <Detail key={name} name={name} detail={detail} />
        ))}
      </div>
    </div>
  );
};

export const DetailsOverlay = ({
  itemName,
  details,
  isOpen,
  dispatch,
}: {
  itemName: string;
  details: Details;
  isOpen: boolean;
  dispatch: React.Dispatch<StockAction>;
}) => (
  <Overlay
    className={Classes.OVERLAY_SCROLL_CONTAINER}
    transitionDuration={0}
    isOpen={isOpen}
    onClose={() => dispatch({ type: "CLOSE_DETAILS" })}
  >
    <CardHolder>
      <Card>
        <CardTitle>{itemName}</CardTitle>
        {Object.entries(details || {}).map(([name, detail]) => (
          <Detail key={name} name={name} detail={detail} />
        ))}
      </Card>
    </CardHolder>
  </Overlay>
);
