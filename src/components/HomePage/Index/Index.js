import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Tabs from "../Tabs/Tabs";
import Login from "../Login/Login";
import SignUp from "../Signup/Signup";
import About from "../About/About";
import {
  MDBContainer,
  MDBCard,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./index.css";

const Index = ({onUserChangeState}) => {
  const [selection, setSelection] = useState("log in");

  const handleSelection = (choice) => {
    setSelection(choice);
  };

  return (
    <MDBContainer fluid className='p-3 my-5 h-custom'>
      <MDBCard>
        <MDBRow>
          {/* LEFT-SIDE PHOTO */}
          <MDBCol col='10' md='6'>
            <img
              src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
              className='img-fluid'
              alt='Sample'
            />
          </MDBCol>

          {/* TABS NAVIGATION */}
          <MDBCol col='4' md='6'>
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
              <Route path='/' element={<Navigate to='/login' replace />} />
              <Route path='/login' element={<Login onUserChangeState={onUserChangeState}/>} />
              <Route exact path='/signup' element={<SignUp onUserChangeState={onUserChangeState} />} />
              <Route exact path='/about' element={<About />} />
            </Routes>
          </MDBCol>
        </MDBRow>

        {/* FOOTER */}
        <div className='d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary'>
          <div className='text-white mb-3 mb-md-0'>
            Copyright © 2023. All rights reserved.
          </div>

          {/*RIGHT SIDE ICONS */}
          <div>
            <MDBBtn
              tag='a'
              color='none'
              className='mx-3'
              style={{ color: "white" }}
            >
              <MDBIcon fab icon='github' size='lg' />
            </MDBBtn>

            <MDBBtn
              tag='a'
              color='none'
              className='mx-3'
              style={{ color: "white" }}
            >
              <MDBIcon fab icon='linkedin-in' size='lg' />
            </MDBBtn>

            <MDBBtn
              tag='a'
              color='none'
              className='mx-3'
              style={{ color: "white" }}
            >
              <MDBIcon fab icon='google' size='lg' />
            </MDBBtn>
          </div>
        </div>
      </MDBCard>
    </MDBContainer>
  );
};

export default Index;
