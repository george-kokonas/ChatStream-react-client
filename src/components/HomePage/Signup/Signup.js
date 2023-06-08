import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import API_URL from "../../helpers/config";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import "../globalStyles/formStyles.css";

const SignUp = ({ onUserChangeState, onSetLoading }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigate = useNavigate();

  const testEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const testUsername = (username) => {
    return username.length < 3 ? false : true;
  };

  const testPassword = (password) => {
    return /^(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(password);
  };

  const nullishErrors = () => {
    setEmailError(null);
    setUsernameError(null);
    setPasswordError(null);
  };

  const resetInputs = () => {
    setEmail("");
    setUsername("");
    setPassword("");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    nullishErrors();

    const isValidEmail = testEmail(email) || setEmailError("Email is invalid");

    const isValidUsername =
      testUsername(username) ||
      setUsernameError("Username must be at least 3 characters");

    const isValidPassword =
      testPassword(password) ||
      setPasswordError(
        "Must contain at least one digit, one special character and be at least 6 characters."
      );

    if (isValidEmail && isValidUsername && isValidPassword) {
      const user = {
        email,
        username,
        password,
      };

      try {
        onSetLoading(true);

        const { data } = await axios.post(`${API_URL}/auth/register`, user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.userData));

        alert("WELCOME ONBOARD!");
        resetInputs();

        onUserChangeState(true);
      } catch (error) {
        const { message } = error.response.data;
        message.includes("Email")
          ? setEmailError(message)
          : message.includes("Username")
          ? setUsernameError(message)
          : alert(message);
      }

      onSetLoading(false);
    }
  };

  return (
    <MDBContainer className='p-3 my-0 d-flex flex-column w-50'>
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
      {emailError && <span className='error-msg'>{emailError}</span>}

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
      {usernameError && <span className='error-msg'>{usernameError}</span>}

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
      {passwordError && <span className='error-msg'>{passwordError}</span>}

      {/* SUBMIT BUTTON */}
      <MDBBtn
        className='submit-btn mt-3 mb-3'
        type='submit'
        onClick={submitHandler}
      >
        SIGN UP
      </MDBBtn>
      <p className='account-nav-text text-center'>
        Already a member?{" "}
        <span className='account-nav-link' onClick={() => navigate("/login")}>
          Log In
        </span>
      </p>
    </MDBContainer>
  );
};

export default SignUp;
