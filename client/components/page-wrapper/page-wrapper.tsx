import { Navbar, Button, Alignment, Toaster } from "@blueprintjs/core";
import { useRef } from "react";
import Link from "next/link";

export const PageWrapper = (props) => {
  const LoginToaster = useRef(null);

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.RIGHT}>
          <Navbar.Heading>
            <Link href="/">
              <a>Dungeons & Shopping</a>
            </Link>
          </Navbar.Heading>
          <Navbar.Divider />
          <Button
            icon="person"
            onClick={() =>
              LoginToaster.current.show({ message: "You dun logged in m8" })
            }
          />
        </Navbar.Group>
      </Navbar>
      {props.children}
      <Toaster ref={LoginToaster} />
    </>
  );
};
