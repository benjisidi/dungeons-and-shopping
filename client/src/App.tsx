import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
} from "react-router-dom";

import { Forbidden, NotFound, Shops, Landing } from "./pages";

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
