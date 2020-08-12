import {
  Button,
  Toaster,
  Dialog,
  Classes,
  ControlGroup,
} from "@blueprintjs/core";
import Link from "next/link";
import { useRef, useState } from "react";
import styled from "styled-components";
import { PageWrapper } from "../components";
import { useForm } from "react-hook-form";

const HeadingTextWrapper = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  margin: 48px 0 24px 0;
  flex-direction: column;
`;

type LoginDetails = {
  user: string;
  pass: string;
};
const FormError = styled.span`
  color: firebrick;
`;

const HomePage = () => {
  const [createAccVisiblity, setCreateAccVisibility] = useState(false);
  const showCreateAcc = () => setCreateAccVisibility(true);
  const hideCreateAcc = () => setCreateAccVisibility(false);
  const LoginToaster: Toaster = useRef(null);
  const { register, handleSubmit, watch, errors } = useForm<LoginDetails>();
  const onFormSubmit = (data) => {
    console.log(data);
    hideCreateAcc();
  };

  return (
    <>
      <PageWrapper>
        <div className="fill-space">
          <HeadingTextWrapper>
            <h1 className="bp3-heading">
              Realistic Make-Believe Fantasy Shops.
            </h1>
            <div className="bp3-text-large" style={{ maxWidth: "480px" }}>
              Dungeons & Shopping (working title, don't judge) is an application
              for managing the inventories of your various dungeons and dragons
              campaign's shops. It can simulate several different styles of
              shop, from rare magical item stores whose stocks are slow-moving,
              to a general store whose stock doesn't change, to a bookshop with
              a high item turnover
            </div>
          </HeadingTextWrapper>
          <Button
            intent="primary"
            large
            text="Log In"
            style={{ padding: "16px 88px" }}
            onClick={() =>
              LoginToaster.current.show({ message: "You dun logged in m8" })
            }
          />
          <span>
            <a onClick={showCreateAcc}>Create an account</a> |{" "}
            <Link href="/shop">
              <a>Continue as guest</a>
            </Link>
          </span>
          <Dialog isOpen={createAccVisiblity} onClose={hideCreateAcc}>
            <div className={Classes.DIALOG_BODY}>
              <h2 className="bp3-heading">Create an account</h2>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <ControlGroup vertical>
                  {errors.user && <FormError>This field is required</FormError>}
                  <input
                    className={`${Classes.INPUT} ${Classes.LARGE}  ${
                      errors.user && Classes.INTENT_DANGER
                    }`}
                    name="user"
                    placeholder="Enter your username"
                    ref={register({ required: true })}
                  />
                  {errors.pass && <FormError>This field is required</FormError>}
                  <input
                    className={`${Classes.INPUT} ${Classes.LARGE} ${
                      errors.pass && Classes.INTENT_DANGER
                    }`}
                    placeholder="Enter your password"
                    name="pass"
                    type="password"
                    ref={register({ required: true })}
                  />
                </ControlGroup>
                <Button onClick={hideCreateAcc}>Close</Button>
                <Button intent="primary" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </Dialog>
        </div>
        <Toaster ref={LoginToaster} />
      </PageWrapper>
    </>
  );
};

export default HomePage;
