import { useState, useEffect } from "react";
import "./App.css";

import Index from "./components/HomePage/Index/Index";
import ChatWindow from "./components/ChatPage/ChatWindow";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const userChangeStateHandler = (state) => {
    setIsLoggedIn(state);
  };

  return (
    <>
      <div >
        {!isLoggedIn ? (
          <>
            <Index onUserChangeState={userChangeStateHandler} />
          </>
        ) : (
          <div  className="main">
            <ChatWindow onUserChangeState={userChangeStateHandler} />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
