import { useEffect, useState } from "react";
import CustomTimeAgo from "../../../../UI/CustomTimeAgo/CustomTimeAgo";

import styles from "./Room.module.scss";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";

const Room = ({
  room,
  friend,
  currentRoom,
  messagePreview,
  unseenMessages,
}) => {
  const [preview, setPreview] = useState([]);

  const listItemClassname =
    currentRoom?._id === room?._id ? `${styles.currentRoom}` : `${""}`;

  //proccess preview message
  useEffect(() => {
    messagePreview.length && proccessMessage(messagePreview[0]);
  }, [messagePreview]);

  //PROCESS LAST MESSAGE
  const proccessMessage = (message) => {
    let text = message.text;

    // get the first 12 characters of the last message in the array
    text.length > 10 && (text = text.slice(0, 10) + "...");

    //get timestamp
    const createdAt = message.createdAt;

    setPreview({
      text,
      createdAt,
    });
  };

  return (
    <li className={`${styles.roomItem} ${listItemClassname}`}>
      <div className={styles.leftSide}>
        <img
          src={friend?.profileImage || defaultAvatar}
          alt='avatar'
          className='rounded-circle d-flex align-self-center shadow-1-strong'
          width='55'
        />
      </div>

      <div className={styles.center}>
        <div className={styles.username}>{friend?.username}</div>
        <div className={styles.preview}>
          {preview.text ? preview.text : "no chat yet.."}
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={`${styles.unreadCount} badge`}>
          <CustomTimeAgo date={preview.createdAt} />
        </div>
        <span className={`${styles.unreadCount} badge bg-danger`}>
          {unseenMessages?.length > 0 && unseenMessages?.length}
        </span>
      </div>
    </li>
  );
};

export default Room;
