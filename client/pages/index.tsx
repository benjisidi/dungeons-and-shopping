import { Button } from "@blueprintjs/core";
import { useState } from "react"


const HomePage = () => {
  const [counter, setCounter] = useState(1)
  const incrementCounter = () => setCounter(counter + 1)
  return (
    <div>
      <span>Welcome to Next.js! </span>
      <a href="/about">Click here for the about page.</a>
      Counter: {counter}
      <Button intent="success" text="button content" onClick={incrementCounter} />
    </div>
  );
};

export default HomePage;
