import { Routes, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar/Navbar";
import Index from "./components/Index/Index";
import SignUp from "./components/Signup/Signup";
import Login from "./components/Login/Login"

function App() {
  return (
    <>
      <Navbar/>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
