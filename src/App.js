import { Routes, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar/Navbar";
import SignUp from "./components/Signup/Signup";
import Login from "./components/Login/Login"

function App() {
  return (
    <>
      <Navbar/>
      <div className='container'>
        <Routes>
          <Route path='/' element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
