import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import API_URL from "../../helpers/config";
import Textfield from "../../UI/TextField/TextField";
import Button from "../../UI/Button/Button";

import styles from "../formStyles/formStyles.module.scss";

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
        "Must contain at least 1 digit, 1 special character and minimum 6 characters."
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
    <div className={styles.container}>
      {/* EMAIL INPUT FIELD */}
      <div className={styles.inputWrapper}>
        <Textfield
          className={styles.textInp}
          type='email'
          value={email}
          height='5vh'
          width='40vw'
          responsiveWidth='80vw'
          placeholder='E-mail'
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(null);
          }}
        />
        {emailError && (
          <span className={styles.errorMessage}>{emailError}</span>
        )}
      </div>

      {/* PASSWORD INPUT FIELD */}
      <div className={styles.inputWrapper}>
        <Textfield
          value={password}
          type='password'
          height='5vh'
          width='40vw'
          responsiveWidth='80vw'
          placeholder='Password'
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError(null);
          }}
        />
        {passwordError && (
          <span className={styles.errorMessage}>{passwordError}</span>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <div className={styles.buttonContainer}>
        <Button
          type='submit'
          label='log in'
          width='40vw'
          height='4vh'
          responsiveWidth='80vw'
          onClick={submitHandler}
        />
        <p className={styles.accountText}>
          No account yet? <br />{" "}
          <span
            className={styles.accountLink}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
