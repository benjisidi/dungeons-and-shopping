/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

ReactDOM.render(
  // blueprintjs doesn't support strict mode (apaz will do in 4.*)
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("app")
);

if (import.meta.hot) {
  const hot = import.meta.hot as ImportMetaHot;
  hot.accept();
}
