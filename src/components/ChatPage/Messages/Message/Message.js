import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import CustomTimeAgo from "../../CustomTimeAgo/CustomTimeAgo";
import defaultUserIcon from "../../../../assets/defaultUserIcon.png";
import "./message.css";

const Messages = ({ message, sentByMe , currentUser, friend }) => {
  let messageOutput = sentByMe ? (
    <li className='d-flex flex-row-reverse mb-3'>
      <img
        src={currentUser.profileImage || defaultUserIcon}
        alt='avatar'
        className='rounded-circle d-flex align-self-start me-2 shadow-1-strong'
        width='60'
        height="60"
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
        src={friend?.profileImage || defaultUserIcon}
        alt='avatar'
        className='rounded-circle d-flex align-self-start ms-3 shadow-1-strong'
        width='60'
        height="60"
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
  return <>{messageOutput}</>;
};

export default Messages;

/* <MDBCardHeader className='d-flex justify-content-between p-3'>
<p className='fw-bold mb-0'>{}</p>
</MDBCardHeader> */
