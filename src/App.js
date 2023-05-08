import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import Index from "./components/Home/Index/Index";
import ChatWindow from "./components/ChatPage/ChatWindow/ChatWindow";

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className='container'>
        {!isLoggedIn ? (
          <>
            <Routes>
              <Route path='/' element={<Index />} />
            </Routes>
          </>
        ) : (
          <>
            <ChatWindow />
          </>
        )}
      </div>
    </>
  );
};

export default App;
