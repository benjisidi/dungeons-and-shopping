import { Card } from "@blueprintjs/core";
import styled from "styled-components";

export const CardHeader = styled.div`
  width: 100%;
  display: flex;
`;
export const CardTitle = styled.h2`
  max-width: 200px;
  margin: 8px 0 0;
  overflow-wrap: break-word;
`;
export const ButtonHolder = styled.div`
  height: 30px;
  display: flex;
  margin-left: auto;
  transform: translate(18px);
`;
export const StandardCard = styled(Card)`
  padding-top: 2px;
  height: 150px;
  width: 300px;
  margin: 10px;
`;

export const CardText = styled.p`
  margin-top: 10px;
  margin-bottom: 0px;
`;
