import React from "react";

import { ErrorBanner } from "../components/shared";

export const Forbidden = () => (
  <ErrorBanner text="You must be signed in to view this page, go " />
);
