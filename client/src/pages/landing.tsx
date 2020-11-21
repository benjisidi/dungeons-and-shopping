import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useGlobal } from "../common";
import { OpeningTitle } from "../components/landing/opening-title";

const OpeningBanner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const OpeningText = styled.h1`
  text-align: center;
`;

export const Landing = () => {
  const [loggedIn] = useGlobal("loggedIn");
  const [user] = useGlobal("user");
  if (!loggedIn) {
    return (
      <OpeningBanner>
        <OpeningText>Halt! Who goes there?</OpeningText>
      </OpeningBanner>
    );
  }
  return (
    <OpeningBanner>
      <OpeningTitle />
      <OpeningText>
        {`Hullo there ${user.username}! Fancy having a look at these here `}
        <Link to="/shops">shops</Link>?
      </OpeningText>
    </OpeningBanner>
  );
};
