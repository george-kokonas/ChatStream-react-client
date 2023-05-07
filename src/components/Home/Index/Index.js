import { useState, useEffect } from "react";
import SignUp from "../Signup/Signup";
import Login from "../Login/Login";
import Tabs from "../Tabs/Tabs";
import "./index.css";
import React from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

function App() {
  const [selection, setSelection] = useState("login");

  const handleSelection = (choice) => {
    setSelection(choice);
  };

  useEffect(() => {
    setSelection("login");
  }, []);

  return (
    <MDBContainer fluid className='p-3 my-5 h-custom'>
      <MDBCard>
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
              className='img-fluid'
              alt='Sample'
            />
          </MDBCol>

          <MDBCol col='4' md='6'>
            <div className='d-flex flex-row align-items-center justify-content-center'>
              <Tabs onSelection={handleSelection} />
            </div>

            <div className='divider d-flex align-items-center my-4'>
              <p className='text-center fw-bold mx-3 mb-0'>
                {selection.toUpperCase()}
              </p>
            </div>

            {selection === "login" && <Login />}
            {selection === "signup" && <SignUp />}
            {selection === "about" && "about"}
          </MDBCol>
        </MDBRow>

        <div className='d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary'>
          <div className='text-white mb-3 mb-md-0'>
            Copyright © 2023. All rights reserved.
          </div>

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
}

export default App;