import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Index from "./components/Index/Index";
import SignUp from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/ChatPage/ChatWrapper/ChatWrapper";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
      setIsLoggedIn(true)
    }
  },[])

  const handleLogin = (userState) => {
    setIsLoggedIn(userState);
  };

  return (
    <>
      <Navbar isLoggedIn = {isLoggedIn}/>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login onLogin = {handleLogin}/>} />
          {isLoggedIn && (
            <>
              <Route path='/home' element={<Home />} />
              <Route path='/logout' element={<Home />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
