import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login/Login";
import SignUp from "./Signup/Signup";
import About from "./About/About";
import ChatPage from "../ChatPage/ChatPage";

import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import "./HomePage.scss";
import logo from "../../assets/logo.png";
import "../../components/Loader/Loader.css";

const HomePage = ({ onUserChangeState }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className='homepage-container'>
        {isLoading && <div className='loader-container' />}
        <div className='content-container'>

          {/* Top-Part */}
          <div className='top-part'>
            <div className='logo-container'>
              <img className='logo' alt='logo' src={logo} />
            </div>

            <div className='form-container'>
              <Routes>
                <Route
                  exact
                  path='/'
                  element={<Navigate to='/login' replace />}
                />
                <Route
                  exact
                  path='/login'
                  element={
                    <Login
                      onUserChangeState={onUserChangeState}
                      onSetLoading={(state) => setIsLoading(state)}
                    />
                  }
                />
                <Route
                  exact
                  path='/signup'
                  element={
                    <SignUp
                      onUserChangeState={onUserChangeState}
                      onSetLoading={(state) => setIsLoading(state)}
                    />
                  }
                />
                <Route exact path='/about' element={<About />} />
                <Route path='/chat' element={<ChatPage />} />
              </Routes>
            </div>
          </div>

          {/* FOOTER */}
          <div className='footer'>
            {/*profile icons */}
            <div className='footer-icons'>
              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
                href='https://github.com/george-kokonas'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MDBIcon fab icon='github' size='2x' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
                href='https://www.linkedin.com/in/george-k-swd/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MDBIcon fab icon='linkedin-in' size='2x' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
                href={`mailto:g.kokwnas@gmail.com`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <MDBIcon far icon='envelope' size='2x' />
              </MDBBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
