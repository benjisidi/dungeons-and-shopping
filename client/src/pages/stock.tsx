import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { useGlobal } from "../common";

const OpeningBanner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const OpeningText = styled.h1`
  text-align: center;
`;

export const Stock = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [lookup] = useGlobal("shopLookup");
  return (
    <OpeningBanner>
      <OpeningText>
        {`Stock For ${lookup[shopId]}! Go back to `}
        <Link to="/shops">shops</Link>?
      </OpeningText>
    </OpeningBanner>
  );
};
