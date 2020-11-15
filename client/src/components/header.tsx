import {
  Alert,
  Button,
  Classes,
  Dialog,
  Intent,
  Menu,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  PopoverInteractionKind,
  Position,
} from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { logout } from "../api-service";
import { useGlobal } from "../common";
import { AppToaster } from "../common/toaster";
import { LoginForm, RegisterForm } from "./auth";

const LoginButton = styled(Button)`
  margin-top: 5px;
`;
const UserMenu = styled(Menu)`
  display: flex;
  flex-direction: column;
`;

const UserActions = ({
  loggedIn,
  openModal,
  username = "Sign In Here",
  openLogoutWarning,
}: {
  loggedIn: boolean;
  username: string;
  openModal: (type: "register" | "login") => void;
  openLogoutWarning: () => void;
}) => (
  <div style={{ marginLeft: "auto" }}>
    <Popover
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <UserMenu>
          {!loggedIn ? (
            <>
              <Button onClick={() => openModal("login")} icon="log-in">
                Log In
              </Button>
              <LoginButton
                onClick={() => openModal("register")}
                icon="new-person"
              >
                Register
              </LoginButton>
            </>
          ) : (
            <Button icon="log-out" onClick={openLogoutWarning}>
              Logout
            </Button>
          )}
        </UserMenu>
      }
      position={Position.BOTTOM}
    >
      <Button className={Classes.MINIMAL} icon="user" text={username} />
    </Popover>
  </div>
);

export const PageHeader = () => {
  const [showLogoutWarning, setLogoutWarning] = React.useState(false);
  const [modalState, setModalState] = React.useState<{
    open: boolean;
    type: "register" | "login";
  }>({
    open: false,
    type: "login",
  });
  const closeModal = () =>
    setModalState((state) => ({ ...state, open: false }));
  const openModal = (type: "register" | "login") =>
    setModalState((state) => ({
      ...state,
      type,
      open: true,
    }));
  const [user] = useGlobal("user");
  const [loggedIn] = useGlobal("loggedIn");
  const history = useHistory();

  return (
    <Navbar>
      <NavbarGroup style={{ width: "100%" }}>
        <NavbarHeading color="white">Dungeons and Shoppping</NavbarHeading>
        <NavbarDivider />
        <Button
          onClick={() => history.push("/")}
          className={Classes.MINIMAL}
          icon="home"
          text="Home"
        />
        <UserActions
          loggedIn={loggedIn}
          openLogoutWarning={() => setLogoutWarning(true)}
          openModal={openModal}
          username={user?.username}
        />
      </NavbarGroup>
      <Dialog
        onClose={closeModal}
        title={modalState.type}
        isOpen={modalState.open}
      >
        {modalState.type === "login" ? (
          <LoginForm onSubmit={closeModal} />
        ) : (
          <RegisterForm onSubmit={closeModal} />
        )}
      </Dialog>
      <Alert
        isOpen={showLogoutWarning}
        onConfirm={() => {
          logout();
          AppToaster.show({
            message: `see ya ${user.username}`,
            intent: Intent.DANGER,
            icon: "log-out",
          });
        }}
        onClose={() => setLogoutWarning(false)}
        confirmButtonText="Logout"
        cancelButtonText="Cancel"
        intent={Intent.DANGER}
        icon="log-out"
      >
        <h2 style={{ marginTop: 0 }}>Cowards Die In Shame</h2>
        <p>Are you sure you want log out?</p>
      </Alert>
    </Navbar>
  );
};
