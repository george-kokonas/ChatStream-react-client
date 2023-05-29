import { useState } from "react";
import axios from "axios";
import API_URL from "../../helpers/config";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import "./login.css";

const Login = ({ onUserChangeState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

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

    //User credentials pass the validation
    if (email && password) {
      const userData = {
        email,
        password,
      };

      try {
        const { data } = await axios.post(`${API_URL}/auth/login`, userData);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Logged in Successfully");
        onUserChangeState(true);
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
      {emailError && <span className='error-msg-login'>{emailError}</span>}

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
        <span className='error-msg-login'>{passwordError}</span>
      )}

      {/* SUBMIT BUTTON */}
      <MDBBtn className='mt-3 mb-3' type='submit' onClick={submitHandler}>
        LOG IN
      </MDBBtn>

      {/* TODO : LINK THE SIGN UP LINK WITH THE SIGN UP COMPONENT */}
      <div className='text-center'>
        <p>
          Not registered? <a href='#!'>Sign Up</a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Login;
