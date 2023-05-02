import { useState, useEffect } from "react";
import { Routes, Route} from "react-router-dom";
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
      <Navbar isLoggedIn={isLoggedIn} />
      <div className='container'>
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path='/' element={<Index />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<Login onLogin={handleLogin} />} />
            </>
          ) : (
            <>
              <Route path='/home' element={<ChatWindow />} />
              {/* <Route path='/logout' element={<Logout />} /> */}
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
