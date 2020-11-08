import React from "react";
import { Link } from "react-router-dom";

export const Forbidden = () => (
  <h1>
    Wait - who are you? Should you be here? Wanna go <Link to="/">Home</Link>?
  </h1>
);
