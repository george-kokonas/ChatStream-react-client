import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import CustomTimeAgo from "../../CustomTimeAgo/CustomTimeAgo";
import defaultUserIcon from "../../../../assets/defaultUserIcon.png";

import styles from "./Message.module.css"

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
      <MDBCard className={styles.myMessage}>
        <MDBCardBody className={styles.message}>
          <p className={styles.messageText}>{message.text}</p>
          <p className={`${styles.timeContainer} text-muted`}>
            <MDBIcon className={styles.clockIcon} far icon='clock' />
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
      <MDBCard className={styles.othersMessage}>
        <MDBCardBody className={styles.message}>
          <p className={styles.messageText}>{message.text}</p>
          <p className={`${styles.timeContainer} text-muted`}>
            <MDBIcon className={styles.clockIcon} far icon='clock' />
            <CustomTimeAgo date={message.createdAt} />
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  );
  return <>{messageOutput}</>;
};

export default Messages;
