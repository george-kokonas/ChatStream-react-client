import { useEffect, useState } from "react";
import axios from "axios";
import "./rooms.css";
const Rooms = ({
  loggedUser,
  chatroom,
  currentRoom,
  messages,
  instantMessage,
}) => {
  const [friend, setFriend] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  const listItemClassname =
    currentRoom?._id === chatroom?._id
      ? "currentRoom p-2 border-bottom"
      : "room p-2 border-bottom";

  const proccessMessage = (data) => {
    if (data.length === 0) {
      setLastMessage("No conversation yet...");
      return;
    }

    let message = data[data.length - 1].text;
    message = message.slice(0, 25);
    setLastMessage(message);
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getMessages/${chatroom?._id}`
        );

        proccessMessage(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };

    getMessages();
  }, [chatroom?._id, messages, instantMessage]);

  useEffect(() => {
    const friendId = chatroom.members.find(
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
  }, [loggedUser, chatroom]);

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
              <p className='fw-bold mb-0'>{friend && friend.username}</p>
              <p className='small text-muted'>{lastMessage}</p>
            </div>
          </div>
          <div className='pt-1'>
            <p className='small text-muted mb-1'>Just now</p>
            <span className='badge bg-danger float-end'>1</span>
          </div>
        </a>
      </li>
    </div>
  );
};

export default Rooms;
