import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, Alert, Intent } from "@blueprintjs/core";

export const App = () => {
  const [alert, setAlert] = useState(false);
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <h1>
            Hello, World!!! Click here for <Link to="/">Home</Link>
          </h1>
          <Button onClick={() => setAlert(true)}>Click me!</Button>
          <Alert
            cancelButtonText="Cancel"
            confirmButtonText="Cool brah"
            intent={Intent.SUCCESS}
            isOpen={alert}
            onClose={() => setAlert(false)}
          >
            You clicked da button
          </Alert>
        </Route>
        <Route path="/">
          <h1>
            Hello, World! Click here for <Link to="/about">About</Link>
          </h1>
        </Route>
      </Switch>
    </Router>
  );
};
