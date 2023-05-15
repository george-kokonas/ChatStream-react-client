import React from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBCardHeader } from "mdb-react-ui-kit";

const Messages = ({ message, sentByMe }) => {
  
  let messageOutput = sentByMe ? (
    <li className='d-flex justify-content-between mb-4'>
      <img
        src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp'
        alt='avatar'
        className='rounded-circle d-flex align-self-start me-3 shadow-1-strong'
        width='60'
      />
      <MDBCard className='w-50'>
        <MDBCardBody>
          <p className='mb-0'>{message.text}</p>
          <p className='text-muted small mb-0'>
            <MDBIcon far icon='clock' /> 12 mins ago
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  ) : (
    <li className='d-flex justify-content- mb-4'>
      <MDBCard className='w-50'>
        <MDBCardBody>
          <p className='mb-0'>{message.text}</p>
          <p className='text-muted small mb-0'>
            <MDBIcon far icon='clock' /> 13 mins ago
          </p>
        </MDBCardBody>
      </MDBCard>
      <img
        src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp'
        alt='avatar'
        className='rounded-circle d-flex align-self-start ms-3 shadow-1-strong'
        width='60'
      />
    </li>
  );
  return <>{messageOutput}</>;
};

export default Messages;

{
  /* <MDBCardHeader className='d-flex justify-content-between p-3'>
<p className='fw-bold mb-0'>{}</p>
</MDBCardHeader> */
}
