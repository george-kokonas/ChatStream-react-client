import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Index from "./components/Index/Index";
import SignUp from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import ChatWindow from "./components/ChatPage/ChatWindow/ChatWindow";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userState) => {
    setIsLoggedIn(userState);
  };

  return (
    <>
      <div className='container'>
        {!isLoggedIn ? (
          <>
            <Navbar isLoggedIn={isLoggedIn} />
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<Login onLogin={handleLogin} />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path='/home' element={<ChatWindow />} />
            {/* <Route path='/logout' element={<Logout />} /> */}
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
