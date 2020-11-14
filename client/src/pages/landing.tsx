import { Button, Dialog } from "@blueprintjs/core";
import React, { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { LoginForm, RegisterForm } from "../components/landing";

const LoginDiv = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
`;
const LoginButton = styled(Button)`
  margin-top: 5px;
`;

export const Landing = ({
  loggedIn,
  setLoggedIn,
}: {
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const [modalState, setModalState] = React.useState<{
    open: boolean;
    type: "register" | "login";
  }>({
    open: false,
    type: "login",
  });
  return (
    <>
      <h1>
        {`Welcome Traveller - Can I interest you in one of our many `}
        <Link to="/shops">shops</Link>?
      </h1>
      <LoginDiv>
        <LoginButton
          onClick={() =>
            setModalState((state) => ({ ...state, type: "login", open: true }))
          }
        >
          {!loggedIn ? "Hey you should probably login" : "Logout?"}
        </LoginButton>
        {loggedIn || (
          <LoginButton
            onClick={() =>
              setModalState((state) => ({
                ...state,
                type: "register",
                open: true,
              }))
            }
          >
            Or maybe, register?
          </LoginButton>
        )}
      </LoginDiv>
      <Dialog
        onClose={() => setModalState((state) => ({ ...state, open: false }))}
        title={modalState.type}
        isOpen={modalState.open}
      >
        {modalState.type === "login" ? <LoginForm /> : <RegisterForm />}
      </Dialog>
    </>
  );
};
