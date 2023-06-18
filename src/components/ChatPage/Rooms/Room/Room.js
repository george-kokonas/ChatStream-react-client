import { useEffect, useState } from "react";
import axios from "axios";
import CustomTimeAgo from "../../CustomTimeAgo/CustomTimeAgo";
import API_URL from "../../../helpers/config";
import getAuthHeaders from "../../../helpers/authHeaders";

import styles from "./Rooms.module.scss";
import defaultUserIcon from "../../../../assets/defaultUserIcon.png";

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
      <a href='#!' className='d-flex justify-content-between'>
        <div className='d-flex flex-row'>
          <img
            src={friend?.profileImage || defaultUserIcon}
            alt='avatar'
            className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
            width='50'
            height='50'
          />
          <div className='pt-1'>
            <p className={`${styles.card} ${styles.card}`}>
              {friend?.username}
            </p>
            <p className='small text-muted'>
              {preview.text ? preview.text : "no messages yet.."}
            </p>
          </div>
        </div>
        <div className={styles.rigthSideContainer}>
          <span className={`${styles.unreadCount} badge bg-danger float-end`}>
            {unseenMessages?.length > 0 && unseenMessages?.length}
          </span>
          <p className='small text-muted mb-1'>
            <CustomTimeAgo date={preview.createdAt} />
          </p>
        </div>
      </a>
    </li>
  );
};

export default Room;
