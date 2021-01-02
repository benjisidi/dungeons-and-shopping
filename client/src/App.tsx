import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { Spinner } from "@blueprintjs/core";
import React from "react";
import { QueryCache, ReactQueryCacheProvider, useMutation } from "react-query";
import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Switch,
} from "react-router-dom";
import styled from "styled-components";

import { reauth } from "./api-service";
import { useGlobal } from "./common";
import { PageHeader } from "./components/shared";
import { Forbidden, Landing, NotFound, Shops, Stock } from "./pages";

interface GuardedRouteProps extends RouteProps {
  loggedIn: boolean;
}
const GuardedRoute = ({ loggedIn, component, ...props }: GuardedRouteProps) => (
  <Route {...props} component={loggedIn ? component : Forbidden} />
);
const CentredSpinner = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const App = () => {
  const [loggedIn] = useGlobal("loggedIn");
  const [loaded, setLoaded] = useGlobal("loaded");
  const [refreahToken] = useMutation(reauth);
  const queryCache = new QueryCache({
    defaultConfig: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: Infinity,
      },
    },
  });
  // on app boot try and reauth with any token left in local
  React.useEffect(() => {
    if (!loaded && !loggedIn) {
      refreahToken().then(() => setLoaded(true));
    }
  }, [loaded]);

  if (!loaded) {
    return <CentredSpinner />;
  }
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Router>
        <PageHeader />
        <Switch>
          <Route exact path="/" component={() => <Landing />} />
          <GuardedRoute
            exact
            loggedIn={loggedIn}
            path="/shops"
            component={() => <Shops />}
          />
          <GuardedRoute
            loggedIn={loggedIn}
            path="/shops/:shopId"
            component={() => <Stock />}
          />
          <Route path="*" component={() => <NotFound />} />
        </Switch>
      </Router>
    </ReactQueryCacheProvider>
  );
};
