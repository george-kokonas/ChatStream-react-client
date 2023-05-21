import { useEffect, useState } from "react";
import axios from "axios";
import CustomTimeAgo from "../../CustomTimeAgo/CustomTimeAgo";

import "./rooms.css";

const Rooms = ({
  loggedUser,
  room,
  currentRoom,
  userMessages,
  instantMessage,
}) => {
  const [friend, setFriend] = useState(null);
  const [lastMessage, setLastMessage] = useState([]);
  const [unreadCounter, setUnreadCounter] = useState(0);

  const listItemClassname =
    currentRoom?._id === room?._id
      ? "currentRoom p-2 border-bottom"
      : "room p-2 border-bottom";

  //HELPER FUNCTION TO PROCESS LAST MESSAGE
  const proccessMessage = (array) => {
    // get the first 25 characters of the last message in the array
    let message = array[array.length - 1]?.text;
    message.length > 20 && (message = message.slice(0, 20) + "...");

    const createdAt = array[array.length - 1].createdAt;

    setLastMessage({
      message,
      createdAt,
    });
  };

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

  // ON FIRST LOAD, UPDATE THE MESSAGE IN CONVERSATIONS CARD
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getMessages/${room?._id}`
        );
        data.length && proccessMessage(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };
    getMessages();
  }, [room]);

  // WHEN USER SENDS MESSAGE ,UPDATE THE MESSAGE IN CONVERSATIONS CARD
  useEffect(() => {
    if (userMessages.length && currentRoom._id === room._id) {
      proccessMessage(userMessages);
    }
  }, [userMessages, currentRoom?._id, room?._id]);

  // WHEN USER RECEIVES INSTANT MESSAGE, UPDATE THE MESSAGE IN CONVERSATIONS CARD
  useEffect(() => {
    if (!instantMessage) return;
    instantMessage.roomId === room._id && proccessMessage([instantMessage]);
  }, [instantMessage, room]);

  //FIND DATA OF THE OTHER PARTICIPANT TO RENDER USERNAME IN CONVERSATIONS CARD
  useEffect(() => {
    if (room.length === 0) return;
    const friendId = room.members.find(
      (memberId) => memberId !== loggedUser._id
    );

    const getFriend = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user/getUser/${friendId}`
        );
        setFriend(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching users...");
      }
    };
    getFriend();
  }, [loggedUser, room]);

  return (
    <div className={listItemClassname}>
      <li>
        <a href='#!' className='d-flex justify-content-between'>
          <div className='d-flex flex-row'>
            <img
              src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp'
              alt='avatar'
              className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
              width='60'
            />
            <div className='pt-1'>
              <p className='fw-bold mb-0'>{friend?.username}</p>
              <p className='small text-muted'>
                {lastMessage.message
                  ? lastMessage.message
                  : "no messages yet.."}
              </p>
            </div>
          </div>
          <div className='pt-1'>
            <p className='small text-muted mb-1'>
              <CustomTimeAgo date={lastMessage?.createdAt} />
            </p>
            <span className='badge bg-danger float-end'>
              {unreadCounter === 0 ? "" : unreadCounter}
            </span>
          </div>
        </a>
      </li>
    </div>
  );
};

export default Rooms;
