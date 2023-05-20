import { useEffect, useState } from "react";
import axios from "axios";
import CustomTimeAgo from "../../../CustomTimeAgo/CustomTimeAgo";
import "./rooms.css";

const Rooms = ({
  loggedUser,
  chatroom,
  currentRoom,
  messages,
  instantMessage,
}) => {
  const [friend, setFriend] = useState(null);
  const [lastMessage, setLastMessage] = useState([]);

  const listItemClassname =
    currentRoom?._id === chatroom?._id
      ? "currentRoom p-2 border-bottom"
      : "room p-2 border-bottom";

  // console.log(lastMessage);
  // console.log(messages);

  //HELPER FUNCTION TO PROCESS LAST MESSAGE
  const proccessMessage = (array) => {
    if (array.length === 0) {
      setLastMessage({message: "No conversation yet...", createdAt: "" });
      return;
    }

    // render first 25 characters of the last message in the array
    const message = array[array.length - 1].text.slice(0, 25);
    const createdAt = array[array.length - 1].createdAt;
  
    setLastMessage({
      message: message,
      createdAt: createdAt,
    });
  };
  
  //WHEN USER SENDS MESSAGE ,UPDATE THE MESSAGE IN CONVERSATIONS CARD
  useEffect(() => {
    if (messages.length && currentRoom.members?.includes(friend?._id)) {
      proccessMessage(messages);
    }
  }, [messages, currentRoom?.members, friend?._id]);
  console.log(chatroom);
  //WHEN USER RECEIVES MESSAGE, UPDATE THE MESSAGE IN CONVERSATIONS CARD
  useEffect(() => {
    if (instantMessage?.sender === friend?._id) {
      instantMessage && proccessMessage([instantMessage]);
    }
  }, [instantMessage, friend?._id]);

  //ON FIRST LOAD, UPDATE THE MESSAGE IN CONVERSATIONS CARD
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
  }, [chatroom?._id]);

  //FIND DATA OF THE OTHER PARTICIPANT TO RENDER USERNAME IN CONVERSATIONS CARD
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
              <p className='fw-bold mb-0'>{friend?.username}</p>
              <p className='small text-muted'>{lastMessage?.message}</p>
            </div>
          </div>
          <div className='pt-1'>
            <p className='small text-muted mb-1'>
              <CustomTimeAgo date={lastMessage?.createdAt} />
            </p>
            <span className='badge bg-danger float-end'>1</span>
          </div>
        </a>
      </li>
    </div>
  );
};

export default Rooms;
