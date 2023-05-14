import { useState, useEffect } from "react";
import "./App.css";

import Index from "./components/Home/Index/Index";
import ChatWindow from "./components/ChatPage/ChatWindow/ChatWindow";

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

  const handleLogin = (state) => {
    setIsLoggedIn(state);
  };

  const handleLogout = (state) => {
    setIsLoggedIn(state)
  }

  return (
    <>
      <div className='container'>
        {!isLoggedIn ? (
          <>
            <Index onLogin={handleLogin} />
          </>
        ) : (
          <>
            <ChatWindow onLogout={handleLogout} />
          </>
        )}
      </div>
    </>
  );
};

export default App;
