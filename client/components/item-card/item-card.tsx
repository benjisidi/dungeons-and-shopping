import { Card, Elevation, Divider } from "@blueprintjs/core";
import styled from "styled-components";

const ItemCardWrapper = styled(Card)`
  position: relative;
  margin: 4px;
  max-width: 600px;
`;

const ItemTitle = styled.h3`
  margin-bottom: 4px;
  line-height: 8px;
`;

const Cost = styled.b`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ItemCard = (props) => {
  return (
    <ItemCardWrapper elevation={Elevation.TWO}>
      <Cost>{props.cost}</Cost>
      <ItemTitle className="bp3-heading">{props.title}</ItemTitle>
      <i className="bp3-text-small">{props.classification}</i>
      <Divider />
      <i style={{ display: "block" }}>{props.description}</i>
    </ItemCardWrapper>
  );
};

export { ItemCard };
