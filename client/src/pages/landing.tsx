import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@blueprintjs/core";

export const Landing = ({
  loggedIn,
  setLoggedIn,
}: {
  loggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
}) => (
  <>
    <h1>
      {`Welcome Traveller - Can I interest you in one of our many `}
      <Link to="/shops">shops</Link>?
    </h1>
    {!loggedIn ? (
      <Button onClick={() => setLoggedIn(true)}>Login?</Button>
    ) : (
      <Button onClick={() => setLoggedIn(false)}>Logout?</Button>
    )}
  </>
);
