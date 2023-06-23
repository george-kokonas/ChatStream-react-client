import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import CustomTimeAgo from "../../../../UI/CustomTimeAgo/CustomTimeAgo";
import Avatar from "../../../../UI/Avatar/Avatar";

import styles from "./Message.module.css"

const Messages = ({ message, sentByMe , currentUser, friend }) => {
  
  let messageOutput = sentByMe ? (
    <li className='d-flex flex-row-reverse mb-3'>
      <Avatar src={currentUser.profileImage} size="large"/>  
    
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
      <Avatar  src={friend?.profileImage} size="large"/>
  
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
