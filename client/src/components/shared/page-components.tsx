import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100%;
`;
export const PageTitle = styled.h1<{ loading?: boolean }>`
  margin: 30px auto 0;
  width: 500px;
  font-size: 52px;
  text-align: center;
  max-height: ${({ loading }) => (!loading ? "300px" : "30px")};
  transition: max-height, 2s;
`;
export const PageText = styled.p<{ loading?: boolean }>`
  margin: 30px auto 0;
  width: 500px;
  text-align: center;
  opacity: ${({ loading }) => (!loading ? 1 : 0)};
  max-height: ${({ loading }) => (!loading ? "100px" : "10px")};
  transition: max-height, 2s, opacity, 2s;
`;
export const Grid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  justify-content: center;
`;
