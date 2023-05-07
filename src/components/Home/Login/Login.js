import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(password);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    setEmailError(null);
    setPasswordError(null);

    isValidEmail(email) || setEmailError("Email is invalid");

    isValidPassword(password) ||
      setPasswordError(
        "Must contain at least one digit, one special character and be at least 6 characters."
      );

    if (email && password) {
      const userData = {
        email,
        password,
      };

      try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/login",
          userData
        );
        localStorage.setItem("token", data);
        alert("Logged in Successfully");
        navigate("/chat");
      } catch (error) {
        alert(error.response.data.message);
        console.log(error);
      }

      setEmail("");
      setPassword("");
    }
  };

  return (
    <MDBContainer className='p-3 my-5 d-flex flex-column w-52'>
      <MDBInput
        wrapperClass='mb-1'
        label='Email address'
        id='email'
        type='email'
        size='lg'
        value={email}
        onChange={emailHandler}
      />
      {emailError && <span className='error-msg-login'>{emailError}</span>}

      <MDBInput
        wrapperClass='mt-3 mb-1'
        label='Password'
        id='form2'
        type='password'
        size='lg'
        value={password}
        onChange={passwordHandler}
      />
      {passwordError && <span className='error-msg-login'>{passwordError}</span>}

      <MDBBtn className='mt-3 mb-3' type='submit' onClick={submitHandler}>
        LOG IN
      </MDBBtn>

      <div className='text-center'>
        <p>
          Not registered? <a href='#!'>Sign Up</a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Login;
