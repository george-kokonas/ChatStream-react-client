import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

import Index from "./components/HomePage/Index/Index";
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
          <>
            <Index onUserChangeState={userChangeStateHandler} />
          </>
        ) : (
          <div>
            <ChatWindow onUserChangeState={userChangeStateHandler} />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
