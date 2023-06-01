import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Tabs from "../Tabs/Tabs";
import Login from "../Login/Login";
import SignUp from "../Signup/Signup";
import About from "../About/About";

import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./index.css";

const Index = ({ onUserChangeState }) => {
  const [selection, setSelection] = useState("log in");

  const handleSelection = (choice) => {
    setSelection(choice);
  };

  return (
    <div className='index-container'>
      <MDBContainer fluid>
        <MDBRow className='top-container'>
          {/* NAVIGATION TABS */}
          <MDBCol className='form-container'>
            <div className='d-flex flex-row align-items-center justify-content-center'>
              <Tabs onSelection={handleSelection} />
            </div>

            {/* TABS TITLE AND DIVIDER */}
            <div className='divider d-flex align-items-center my-4'>
              <p className='text-center fw-bold mx-3 mb-0'>
                {selection.toUpperCase()}
              </p>
            </div>

            <Routes>
              <Route exact path='/' element={<Navigate to='/login' replace />} />
              <Route
                exact path='/login'
                element={<Login onUserChangeState={onUserChangeState} />}
              />
              <Route
                exact
                path='/signup'
                element={<SignUp onUserChangeState={onUserChangeState} />}
              />
              <Route exact path='/about' element={<About />} />
            </Routes>
          </MDBCol>
        </MDBRow>

        {/* FOOTER */}
        <MDBRow className='footer'>
          <div className='d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 footer'>
            <div className='footer-text pb-3'>ChatStream © 2023.</div>

            {/*RIGHT SIDE ICONS */}
            <div className='pb-3'>
              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
              >
                <MDBIcon fab icon='github' size='2x' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
              >
                <MDBIcon fab icon='linkedin-in' size='2x' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: "white" }}
              >
                <MDBIcon fab icon='google' size='2x' />
              </MDBBtn>
            </div>
          </div>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Index;
