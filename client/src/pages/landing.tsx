import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useGlobal } from "../common";

const OpeningText = styled.h1`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const Landing = () => {
  const [loggedIn] = useGlobal("loggedIn");
  const [user] = useGlobal("user");
  if (!loggedIn) {
    return <OpeningText>Halt! Who goes there?</OpeningText>;
  }
  return (
    <OpeningText>
      {`Hullo there ${user.username}! Fancy having a look at these here `}
      <Link to="/shops">shops</Link>?
    </OpeningText>
  );
};
