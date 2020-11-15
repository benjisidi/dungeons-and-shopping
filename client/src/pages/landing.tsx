import { Alert, Button, Dialog, Intent } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { logout } from "../api-service";
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

export const Landing = ({ loggedIn }: { loggedIn: boolean }) => {
  const [showLogoutWarning, setLogoutWarning] = React.useState(false);
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
        {!loggedIn ? (
          <>
            <LoginButton
              onClick={() =>
                setModalState((state) => ({
                  ...state,
                  type: "login",
                  open: true,
                }))
              }
            >
              Hey you should probably login
            </LoginButton>
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
          </>
        ) : (
          <Button onClick={() => setLogoutWarning(true)}>Logout</Button>
        )}
      </LoginDiv>
      <Dialog
        canOutsideClickClose={false}
        onClose={() => setModalState((state) => ({ ...state, open: false }))}
        title={modalState.type}
        isOpen={modalState.open}
      >
        {modalState.type === "login" ? <LoginForm /> : <RegisterForm />}
      </Dialog>
      <Alert
        isOpen={showLogoutWarning}
        onConfirm={() => logout()}
        onClose={() => setLogoutWarning(false)}
        confirmButtonText="Logout"
        cancelButtonText="Cancel"
        intent={Intent.DANGER}
        icon="log-out"
      >
        <p>Are you sure you want log out?</p>
      </Alert>
    </>
  );
};
