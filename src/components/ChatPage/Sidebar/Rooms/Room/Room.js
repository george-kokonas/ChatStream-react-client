import { useEffect, useState } from "react";
import axios from "axios";
import CustomTimeAgo from "../../../../UI/CustomTimeAgo/CustomTimeAgo";
import API_URL from "../../../../helpers/config";
import getAuthHeaders from "../../../../helpers/authHeaders";

import styles from "./Room.module.scss";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";

const Room = ({
  currentUser,
  room,
  currentRoom,
  messagePreview,
  unseenMessages,
}) => {
  const [friend, setFriend] = useState(null);
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

  //FIND DATA OF THE OTHER PARTICIPANT TO RENDER USERNAME IN CONVERSATIONS CARD
  useEffect(() => {
    if (room.length === 0) return;
    const friendId = room.members.find(
      (memberId) => memberId !== currentUser._id
    );

    const getFriend = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/user/getUser/${friendId}`,
          getAuthHeaders()
        );
        setFriend(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching users...");
      }
    };
    getFriend();
  }, [currentUser, room]);

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
        <div className={styles.preview}>{preview.text ? preview.text : "no chat yet.."}</div>
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
