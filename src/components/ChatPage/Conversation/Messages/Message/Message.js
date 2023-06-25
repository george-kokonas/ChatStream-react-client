import { MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import CustomTimeAgo from "../../../../UI/CustomTimeAgo/CustomTimeAgo";
import Avatar from "../../../../UI/Avatar/Avatar";

import styles from "./Message.module.scss";

const Message = ({ message, sentByMe, currentUser, friend }) => {
  let messageOutput = sentByMe ? (
    <li className={styles.myMessageContainer}>
      <Avatar
        src={currentUser.profileImage}
        size='x-large'
      />
       <MDBCard className={`${styles.card} ${styles.myCard}`}>
        <MDBCardBody className={styles.messageContainer}>
          <p className={styles.text}>{message.text}</p>
          <p className={`${styles.timeContainer} text-muted`}>
            <MDBIcon className={styles.clockIcon} far icon='clock' />
            <CustomTimeAgo date={message.createdAt} />
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  ) : (
    <li className={styles.friendsMessageContainer}>
      <Avatar
        src={friend?.profileImage}
        size='x-large'
      />

      <MDBCard className={styles.card}>
        <MDBCardBody className={styles.messageContainer}>
          <p className={styles.text}>{message.text}</p>
          <p className={`${styles.timeContainer} text-muted`}>
            <MDBIcon className={styles.clockIcon} far icon='clock' />
            <CustomTimeAgo date={message.createdAt} />
          </p>
        </MDBCardBody>
      </MDBCard>
    </li>
  );
  return <div className={styles.container}>{messageOutput}</div>;
};

export default Message;
