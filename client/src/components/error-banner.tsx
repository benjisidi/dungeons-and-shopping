import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import SkullAsset from "../assets/Skull.svg";

const Error = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
`;

const HelpMessage = styled.h4`
  text-align: center;
  margin: auto;
  width: 200px;
`;

const Skull = styled.img`
  height: 250px;
`;

export const ErrorBanner = ({ text = "Would you like to go " }) => (
  <Error>
    <Skull src={SkullAsset} alt="dangerous skull" />
    <HelpMessage>
      {text}
      <Link to="/">home</Link>?
    </HelpMessage>
  </Error>
);
