import React from "react";
import { useState } from "react";
import axios from "axios";
import "./signup.css";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

const SignUp = ({onUserChangeState}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidUsername = (username) => {
    return username.length < 3 ? false : true;
  };

  const isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(password);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    setEmailError(null);
    setUsernameError(null);
    setPasswordError(null);

    isValidEmail(email) || setEmailError("Email is invalid");

    isValidUsername(username) ||
      setUsernameError("Username must be at least 3 characters");

    isValidPassword(password) ||
      setPasswordError(
        "Must contain at least one digit, one special character and be at least 6 characters."
      );

    if (email && username && password) {
      const userData = {
        email,
        username,
        password,
      };
      try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/register",
          userData
        );
        localStorage.setItem("token", data);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("WELCOME ONBOARD!");
        setEmail("");
        setUsername("");
        setPassword("");
        onUserChangeState(true)
      } catch (error) {
        const { message } = error.response.data;
        message.includes("Email")
          ? setEmailError(message)
          : message.includes("Username")
          ? setUsernameError(message)
          : alert(message);
      }
    }
  };

  return (
    <MDBContainer className='p-3 my-5 d-flex flex-column w-52'>
      {/* EMAIL INPUT FIELD */}
      <MDBInput
        wrapperClass='mb-1'
        label='Email address'
        id='email'
        type='email'
        size='lg'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {emailError && <span className='error-msg-signup'>{emailError}</span>}

      {/* USERNAME INPUT FIELD */}
      <MDBInput
        wrapperClass='mt-3 mb-1'
        label='User name'
        id='form1'
        type='text'
        size='lg'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      {usernameError && (
        <span className='error-msg-signup'>{usernameError}</span>
      )}

      {/* PASSWORD INPUT FIELD */}
      <MDBInput
        wrapperClass='mt-3 mb-1'
        label='Password'
        id='form2'
        type='password'
        size='lg'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {passwordError && (
        <span className='error-msg-signup'>{passwordError}</span>
      )}

      {/* SUBMIT BUTTON */}
      <MDBBtn className='mt-3 mb-3' type='submit' onClick={submitHandler}>
        SIGN UP
      </MDBBtn>

      {/* TODO : LINK THE SIGN UP LINK WITH THE SIGN UP COMPONENT */}
      <div className='text-center'>
        <p>
          Already a member? <a href='#!'>Log In</a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default SignUp;
