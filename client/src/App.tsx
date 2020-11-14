import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Switch,
} from "react-router-dom";

import { Forbidden, Landing, NotFound, Shops } from "./pages";

interface GuardedRouteProps extends RouteProps {
  loggedIn: boolean;
}
const GuardedRoute = ({ loggedIn, component, ...props }: GuardedRouteProps) => (
  <Route {...props} component={loggedIn ? component : Forbidden} />
);

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={() => (
            <Landing loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          )}
        />
        <GuardedRoute
          loggedIn={loggedIn}
          path="/shops"
          component={() => <Shops />}
        />
        <Route path="*" component={() => <NotFound />} />
      </Switch>
    </Router>
  );
};
