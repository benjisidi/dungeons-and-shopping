import { Card as BPCard, ICardProps, Tooltip } from "@blueprintjs/core";
import React from "react";
import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from {
    height: 0px;    
    opacity: 0;
  }
  to {
    height: 150px;    
    opacity: 1;
  }
`;

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
export const Card = styled(BPCard)`
  padding-top: 2px;
  height: 150px;
  width: 300px;
`;
const Animator = styled.div<{ show: boolean; animateIn: boolean }>`
  height: ${({ show }) => (show ? "150px" : "0px")};
  opacity: ${({ show }) => (show ? 1 : 0)};
  max-width: ${({ show }) => (show ? "300px" : "0px")};
  animation: ${({ animateIn }) => animateIn && appear} 0.5s;
  transition: opacity 0.2s, height 0.5s, max-width 0.2s;
  margin: ${({ show }) => (show ? "10px" : "0px")};
`;
export const CardText = styled.p`
  margin-top: 10px;
  margin-bottom: 0px;
`;
interface CardProps extends ICardProps {
  showUser?: boolean;
  tooltipDisabled?: boolean;
  tooltipContent: string;
  animateIn?: boolean;
}
export const StandardCard = (props: CardProps) => {
  const {
    showUser = true,
    tooltipDisabled,
    tooltipContent,
    children,
    animateIn = true,
    ...cardProps
  } = props;
  return (
    <Animator show={showUser} animateIn={animateIn}>
      <Tooltip
        disabled={showUser === false || tooltipDisabled || false}
        content={tooltipContent}
      >
        <Card {...cardProps}>{children}</Card>
      </Tooltip>
    </Animator>
  );
};
