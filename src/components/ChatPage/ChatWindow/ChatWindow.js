import { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import Messages from "../Messages/Messages";
import "./chatWindow.css";

const ChatWindow = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${user._id}`
        );
        setRooms(data);
      } catch (error) {
        //add decent error handling
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getMessages/${currentRoom._id}`
        );
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentRoom]);

  return (
    <>
      <Topbar />
      <div className='chatContainer'>
        {/* LEFT BAR SHOWING THE ROOMS*/}
        <div className='chatMenu'>
          <div className='wrapper-menu'>
            ---------ROOMS--------
            {rooms.map((room) => (
              <div onClick={() => setCurrentRoom(room)} key={room._id}>
                <Rooms chatroom={room} loggedUser={user} />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PAGE */}
        <div className='message-window'>
          <div className='wrapper-message-window'>
            <p>----MESSAGES------</p>
            <div className='message'>
              {messages.map((msg) => (
                <Messages message={msg} sentByme={user._id === msg.senderId} key={msg._id} />
              ))}
            </div>

            <div className='wrapper-input'>
              <input
                className='userMessage-Input'
                type='text'
                placeholder='enter your message'
              ></input>
              <button className='sendMessage-Btn'>send</button>
            </div>
          </div>
        </div>

        {/* RIGHT PART */}
        <div className='onlineUsers'>
          <div className='wrapper-onlineUsers'>----ONLINE USERS---------</div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
