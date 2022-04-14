import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContactSupportExternal } from "../../api/ApiClient";
import { 
  validateName,
  validateEmail,
  validateMessage,
 } from "../../validators/validators";
import { Alert, Form } from "react-bootstrap";

const reducer = (state, action) => {
  // These cases are taken into consideration by the dispatches used in the useCallbacks down below,
  // This is where the values get set.
  switch (action.type) {
    // error states
    case "validation-error":
      return { ...state, submissionErrorMessage: action.message };
    case "first-name-error":
      return {
        ...state,
        firstNameError: action.message,
        submissionErrorMessage: action.message,
      };
    case "last-name-error":
      return {
        ...state,
        lastNameError: action.message,
        submissionErrorMessage: action.message,
      };
    case "email-error":
      return {
        ...state,
        emailError: action.message,
        submissionErrorMessage: action.message,
      };
    case "message-error":
      return {
        ...state,
        messageError: action.message,
        submissionErrorMessage: action.message,
      };
    case "set-first-name":
      return {
        ...state,
        firstName: action.value,
        submissionErrorMessage: null,
        firstNameError: null,
      };
    case "set-last-name":
      return {
        ...state,
        lastName: action.value,
        submissionErrorMessage: null,
        lastNameError: null,
      };
    case "set-email":
      return {
        ...state,
        email: action.value,
        submissionErrorMessage: null,
      };
    case "set-content":
      return {
        ...state,
        message: action.value,
        submissionErrorMessage: null,
      };
    case "support-message-start":
      return { ...state, waiting: true };
    case "support-message-success":
      return { ...state, waiting: false, finished: true };
    case "support-message-failure":
      return {
        ...state,
        waiting: false,
        submissionErrorMessage: action.message,
      };
    default:
      throw new Error("Unhandled action: " + action.type);
  }
};

const ContactUsExt = () => {
  const [state, dispatch] = useReducer(reducer, {
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    submissionErrorMessage: null,
    firstNameError: null,
    lastNameError: null,
    emailError: null,
    messageError: null,
    waiting: false,
    finished: false,
  });

  const {
    firstName,
    lastName,
    email,
    message,
    submissionErrorMessage,
    firstNameError,
    lastNameError,
    emailError,
    messageError,
    waiting,
    finished,
  } = state;

  const setFirstName = useCallback(
    (e) => dispatch({ type: "set-first-name", value: e.target.value }),
    []
  );
  const setLastName = useCallback(
    (e) => dispatch({ type: "set-last-name", value: e.target.value }),
    []
  );
  const setEmail = useCallback(
    (e) => dispatch({ type: "set-email", value: e.target.value }),
    []
  );
  const setMessage = useCallback(
    (e) => dispatch({ type: "set-content", value: e.target.value }),
    []
  );

  const sendSupportMessage = useCallback((event) => {
    event.preventDefault();
    if (waiting || finished) return;
    const firstNameValidation = validateName(firstName, "First name");
    if (!firstNameValidation.success) {
      dispatch({
        type: "first-name-error",
        firstNameError: firstNameValidation.message,
        message: firstNameValidation.message,
      });
      return;
    }
    const lastNameValidation = validateName(lastName, "Last name");
    if (!lastNameValidation.success) {
      dispatch({
        type: "last-name-error",
        lastNameError: lastNameValidation.message,
        message: lastNameValidation.message,
      });
      return;
    }
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      dispatch({
        type: "email-error",
        emailError: emailValidation.message,
        message: emailValidation.message,
      });
      return;
    }
    const messageValidation = validateMessage()

    dispatch({ type: "support-message-start" });
    console.log("🚀 ~ file: ContactUsExt.js ~ line 187 ~ sendSupportMessage ~ message", message)
    console.log("🚀 ~ file: ContactUsExt.js ~ line 187 ~ sendSupportMessage ~ email", email)
    console.log("🚀 ~ file: ContactUsExt.js ~ line 187 ~ sendSupportMessage ~ lastName", lastName)
    console.log("🚀 ~ file: ContactUsExt.js ~ line 187 ~ sendSupportMessage ~ firstName", firstName)
    // make axios post request
    ContactSupportExternal(
      firstName,
      lastName,
      email,
      message,
    )
      .then((response) => {
        if (response.data.success) {
          dispatch({ type: "support-message-success" });
          handleModal();
          console.log("Message Sent!");
        } else {
          dispatch({ type: "support-message-failure", message: response.data.message });
        }
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "support-message-failure",
            message: error.response.data.message,
          });
        }
        return;
      });
  }, [
    waiting,
    finished,
    firstName,
    lastName,
    email,
  ]);
  return (
    <>
      <Header>Contact Us!</Header>
      <Paragraph>We would love to hear your feedback</Paragraph>
  
      <FormContainer>
        <Form className="contact-form" onSubmit={(e) => sendSupportMessage(e)}>
          <Form.Group className="mb-3">
            <GridContainer>
              <Label>First Name</Label>
              <Label>Last Name</Label>
  
              <Form.Control
                className="textField"
                isInvalid={firstNameError}
                type="text"
                placeholder=""
                value={firstName}
                name="firstName"
                onChange={setFirstName}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
  
              <Form.Control
                className="textField"
                type="text"
                value={lastName}
                isInvalid={lastNameError}
                placeholder=""
                name="lastName"
                onChange={setLastName}
              />
            </GridContainer>
  
            <Label>Email</Label>
            <Form.Control
              className="textField"
              type="email"
              isInvalid={emailError}
              placeholder=""
              name="email"
              onChange={setEmail}
            />
  
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                isInvalid={messageError}
                placeholder=""
                name="username"
                value={message}
                onChange={setMessage}
              />
            </Form.Group>
            
  
            {submissionErrorMessage && (
              <div style={{ paddingTop: 20 }}>
                <Alert variant="danger">{submissionErrorMessage}</Alert>
              </div>
            )}
            <Button
              value="Submit Message"
              type="submit"
              disabled={submissionErrorMessage}
              style={{
                width: "100%",
                margin: "2rem 0 0",
                backgroundColor: "#edbec4",
                color: "#ffffff",
              }}
            >
              Send
            </Button>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};
  


export default ContactUsExt;

const FormContainer = styled.div``;

const Button = styled.button`
  cursor: pointer;
  height: 54px;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const Header = styled.h3`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  color: #b3b3b3;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 10px;
`;