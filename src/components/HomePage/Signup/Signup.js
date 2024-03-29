import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import API_URL from "../../helpers/config";
import TextInput from "../../UI/TextInput/TextInput";
import Button from "../../UI/Button/Button";

import styles from "../formStyles/formStyles.module.scss";

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
        "Must contain at least 1 digit, 1 special character and minimum 6 characters."
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
    <>
      {/* EMAIL INPUT FIELD */}
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
        <TextInput
          type='email'
          value={email}
          placeholder='E-mail...'
          width='40vw'
          height='5.5vh'
          mobileWidth='70vw'
          mobileHeight='5.5vh'
          backgroundColor='#f5ede9e8'
          borderRadius='7px'
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
          {emailError && (
            <span className={styles.errorMessage}>{emailError}</span>
          )}
        </div>
        {/* USERNAME INPUT FIELD */}

        <div className={styles.inputWrapper}>
        <TextInput
          type='text'
          value={username}
          placeholder='Username...'
          width='40vw'
          height='5.5vh'
          mobileWidth='70vw'
          mobileHeight='5.5vh'
          backgroundColor='#f5ede9e8'
          borderRadius='7px'
          onChange={(event) => setUsername(event.target.value)}
        />
          {usernameError && (
            <span className={styles.errorMessage}>{usernameError}</span>
          )}
        </div>

        {/* PASSWORD INPUT FIELD */}
        <div className={styles.inputWrapper}>
        <TextInput
          type='password'
          value={password}
          placeholder='Password...'
          width='40vw'
          height='5.5vh'
          mobileWidth='70vw'
          mobileHeight='5.5vh'
          backgroundColor='#f5ede9e8'
          borderRadius='7px'
          onChange={(event) => setPassword(event.target.value)}
        />
          {passwordError && (
            <span className={styles.errorMessage}>{passwordError}</span>
          )}
        </div>
        
        {/* SUBMIT BUTTON */}
        <div className={styles.buttonContainer}>
        <Button
          type='submit'
          text='sign up'
          width='40vw'
          height='4.5vh'
          mobileWidth='70vw'
          mobileHeight='4.5vh'
          borderRadius='7px'
          backgroundColor='#ea8959e8'
          onClick={submitHandler}
        />
    
          <p className={styles.accountText}>
            Already a member?{" "}
            <span
              className={styles.accountLink}
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
