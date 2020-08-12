import { Button, Navbar, Alignment, Toaster } from "@blueprintjs/core";
import { useState, useEffect, useRef } from "react";


const HomePage = () => {
  const LoginToaster: Toaster = useRef(null)
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.RIGHT}>
          <Navbar.Heading>Dungeons & Shopping</Navbar.Heading>
          <Navbar.Divider />
          <Button icon="person" onClick={() => LoginToaster.current.show({ message: "You dun logged in m8" })} />
        </Navbar.Group>
      </Navbar>
      <div className="main-content">
        <div className="fill-space">
          <div className="heading-text">
            <h1 className="bp3-heading">Realistic Make-Believe Fantasy Shops.</h1>
            <div className="bp3-text-large" style={{ maxWidth: "480px" }}>
              Dungeons & Shopping (working title, don't judge) is an application for managing the
              inventories of your various dungeons and dragons campaign's shops. It can simulate
              several different styles of shop, from rare magical item stores whose stocks are
              slow-moving, to a general store whose stock doesn't change, to a bookshop
              with a high item turnover
          </div>
          </div>
          <Button intent="primary" large text="Log In" style={{ padding: "16px 32px" }} onClick={() => LoginToaster.current.show({ message: "You dun logged in m8" })} />
        </div>
      </div>
      <Toaster ref={LoginToaster} />
    </>
  );
};

export default HomePage;
