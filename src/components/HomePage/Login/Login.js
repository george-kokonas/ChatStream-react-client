import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../helpers/config";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import "../globalStyles/formStyles.css";

const Login = ({ onUserChangeState, onSetLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  const testEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const testPassword = (password) => {
    return /^(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(password);
  };

  const nullishErrors = () => {
    setEmailError(null);
    setPasswordError(null);
  };

  const resetInputs = () => {
    setEmail("");
    setPassword("");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    nullishErrors();

    const isValidEmail = testEmail(email) || setEmailError("Email is invalid");

    const isValidPassword =
      testPassword(password) ||
      setPasswordError(
        "Must contain at least one digit, one special character and be at least 6 characters."
      );

    //User credentials pass the validation
    if (isValidEmail && isValidPassword) {
      const userData = {
        email,
        password,
      };

      try {
        onSetLoading(true);
        const { data } = await axios.post(`${API_URL}/auth/login`, userData);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.userData));

        alert("Logged in Successfully");
        onUserChangeState(true);
      } catch (error) {
        alert(error.response.data.message);
        console.log(error);
      }

      resetInputs();
      onSetLoading(false);
    }
  };

  return (
    <MDBContainer className='p-3 d-flex flex-column w-50'>
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

      {/* PASSWORD INPUT FIELD */}
      <MDBInput
        wrapperClass='mt-3 mb-1 pl-4'
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
        className='submit-btn mt-5 mb-3'
        type='submit'
        onClick={submitHandler}
      >
        LOG IN
      </MDBBtn>

      <p class='account-nav-text text-center'>
        No account yet? <br />{" "}
        <span className='account-nav-link' onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </MDBContainer>
  );
};

export default Login;
