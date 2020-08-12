import { Classes, Dialog, ControlGroup, Button } from "@blueprintjs/core";
import styled from "styled-components";

const FormError = styled.span`
  color: firebrick;
`;

const CreateUserDialog = (props) => (
  <Dialog
    isOpen={props.isOpen}
    onClose={props.onClose}
    title="Create an account"
    canOutsideClickClose={false}
  >
    <form onSubmit={props.onSubmit}>
      <div className={Classes.DIALOG_BODY}>
        <ControlGroup vertical>
          {props.errors.user && <FormError>This field is required</FormError>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              props.errors.user && Classes.INTENT_DANGER
            }`}
            name="user"
            placeholder="Enter your username"
            ref={props.register({ required: true })}
            defaultValue={props.defaults.user}
          />
          {props.errors.pass && <FormError>This field is required</FormError>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE} ${
              props.errors.pass && Classes.INTENT_DANGER
            }`}
            placeholder="Enter your password"
            name="pass"
            type="password"
            ref={props.register({ required: true })}
            defaultValue={props.defaults.pass}
          />
        </ControlGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => props.onClose()}>Close</Button>
          <Button intent="primary" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  </Dialog>
);
export { CreateUserDialog };
