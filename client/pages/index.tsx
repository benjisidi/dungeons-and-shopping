import { Button, Toaster } from "@blueprintjs/core";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CreateUserDialog, PageWrapper } from "../components";

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

const HomePage = () => {
  const [createAccVisiblity, setCreateAccVisibility] = useState(false);
  const showCreateAcc = () => setCreateAccVisibility(true);
  const hideCreateAcc = () => setCreateAccVisibility(false);
  const [createAccData, setCreateAccData] = useState({});
  const closeCreateAcc = () => {
    setCreateAccData(getValues());
    hideCreateAcc();
  };
  const LoginToaster = useRef(null);
  const { register, handleSubmit, watch, errors, getValues } = useForm<
    LoginDetails
  >();
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
            <a onClick={showCreateAcc}>Create an account</a>
            {" | "}
            <Link href="/shop">
              <a>Continue as guest</a>
            </Link>
          </span>
          <CreateUserDialog
            isOpen={createAccVisiblity}
            onClose={closeCreateAcc}
            onSubmit={handleSubmit(onFormSubmit)}
            errors={errors}
            register={register}
            defaults={createAccData}
          />
        </div>
        <Toaster ref={LoginToaster} />
      </PageWrapper>
    </>
  );
};

export default HomePage;
