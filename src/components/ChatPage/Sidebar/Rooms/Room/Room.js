import { useEffect, useState } from "react";
import CustomTimeAgo from "../../../../UI/CustomTimeAgo/CustomTimeAgo";

import Avatar from "../../../../UI/Avatar/Avatar";
import styles from "./Room.module.scss";

const Room = ({
  room,
  currentRoom,
  friend,
  onlineUsers,
  messagePreview,
  unseenMessages,
}) => {
  const [preview, setPreview] = useState([]);
  const [isOnlineFriend, setIsOnlineFriend] = useState(false);

  const listItemClassname =
    currentRoom?._id === room?._id ? `${styles.currentRoom}` : `${""}`;

  useEffect(() => {
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].userId === friend._id) {
        setIsOnlineFriend(true);
      }
    }
  }, [onlineUsers, friend, friend.username]);

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
        <Avatar
          src={friend.profileImage}
          size='large'
          status={isOnlineFriend ? "online" : "offline"}
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

        <div>{isOnlineFriend}</div>
      </div>
    </li>
  );
};

export default Room;

// {/* <img
//   src={friend?.profileImage || defaultAvatar}
//   alt='avatar'
//   className='rounded-circle d-flex align-self-center shadow-1-strong'
//   width='55'
// /> */}
