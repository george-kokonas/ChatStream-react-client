import { useEffect, useState, useRef } from "react";
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
  instantMessage,
  navUnreadMessages,
  messagePreview,
}) => {
  const [friend, setFriend] = useState(null);
  const [lastMessage, setLastMessage] = useState([]);
  const [unreadCounter, setUnreadCounter] = useState(0);

  const onNavUnreadMessagesRef = useRef(navUnreadMessages);

  const listItemClassname =
    currentRoom?._id === room?._id ? `${styles.currentRoom}` : `${""}`;

  //PROCESS LAST MESSAGE
  const proccessMessage = (message) => {
    let messageText = message.text;

    // get the first 12 characters of the last message in the array
    messageText.length > 10 && (messageText = messageText.slice(0, 10) + "...");

    //get timestamp
    const createdAt = message.createdAt;

    setLastMessage({
      messageText,
      createdAt,
    });
  };

  useEffect(() => {
    proccessMessage(messagePreview[0]);
  }, [messagePreview]);

  useEffect(() => {
    onNavUnreadMessagesRef.current = navUnreadMessages;
  }, [navUnreadMessages]);

  useEffect(() => {
    if (unreadCounter) {
      navUnreadMessages(true);
    }
  }, [navUnreadMessages, unreadCounter]);

  useEffect(() => {
    if (!unreadCounter) {
      onNavUnreadMessagesRef.current(false);
    }
  }, [unreadCounter]);

  //UNREAD MESSAGES INCREMENT
  useEffect(() => {
    if (room._id === instantMessage?.roomId) {
      setUnreadCounter((prevCounter) => prevCounter + 1);
    }
  }, [instantMessage, room._id]);

  //UNREAD MESSAGES RESET
  useEffect(() => {
    //reset counter when user enters a room or he is already in the room that received instant message
    if (
      room?._id === currentRoom?._id ||
      currentRoom?._id === instantMessage?.roomId
    ) {
      setUnreadCounter(0);
    }
  }, [room?._id, currentRoom?._id, instantMessage]);

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
              {messagePreview[0]?.text
                ? messagePreview[0]?.text
                : "no messages yet.."}
            </p>
          </div>
        </div>
        <div className={styles.rigthSideContainer}>
          <span className={`${styles.unreadCount} badge bg-danger float-end`}>
            {unreadCounter === 0 ? "" : unreadCounter}
          </span>
          <p className='small text-muted mb-1'>
            <CustomTimeAgo date={lastMessage?.createdAt} />
          </p>
        </div>
      </a>
    </li>
  );
};

export default Room;
