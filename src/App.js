import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

import HomePage from "./components/HomePage/HomePage";
import ChatWindow from "./components/ChatPage/ChatWindow";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      navigate("/chat", { replace: true });
    } else {
      setIsLoggedIn(false);
    }
  }, [token, navigate]);

  const userChangeStateHandler = (state) => {
    setIsLoggedIn(state);
  };

  return (
    <>
      <div className='main'>
        {!isLoggedIn ? (
          <HomePage onUserChangeState={userChangeStateHandler} />
        ) : (
          <ChatWindow onUserChangeState={userChangeStateHandler} />
        )}
      </div>
    </>
  );
};

export default App;
