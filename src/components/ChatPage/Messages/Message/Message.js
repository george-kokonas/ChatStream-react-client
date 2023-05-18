import React from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import CustomTimeAgo from "./CustomTimeAgo";
import "./message.css";

const Messages = ({ message, sentByMe }) => {
  
  let messageOutput = sentByMe ? (
    <li className='d-flex flex-row-reverse mb-3'>
      <img
        src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp'
        alt='avatar'
        className='rounded-circle d-flex align-self-start me-3 shadow-1-strong'
        width='60'
      />
      <MDBCard className='my-message-card'>
        <MDBCardBody className='message-card'>
          <p className='message-text'>{message.text}</p>
          <p className='time-container text-muted'>
            <MDBIcon className='clock-icon' far icon='clock' />
            <CustomTimeAgo date={message.createdAt} />
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  ) : (
    <li className='d-flex justify-content mb-3'>
      <img
        src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp'
        alt='avatar'
        className='rounded-circle d-flex align-self-start ms-3 shadow-1-strong'
        width='60'
      />
      <MDBCard className='friend-message-card'>
        <MDBCardBody className='message-card'>
          <p className='message-text'>{message.text}</p>
          <p className='time-container text-muted'>
            <MDBIcon className='clock-icon' far icon='clock' />
            <CustomTimeAgo date={message.createdAt} />
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  );
{/* <MDBCardHeader className='d-flex justify-content-between p-3'>
<p className='fw-bold mb-0'>{}</p>
</MDBCardHeader> */}
  return <>{messageOutput}</>;
};

export default Messages;


