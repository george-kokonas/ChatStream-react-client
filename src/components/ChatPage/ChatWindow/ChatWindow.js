import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import Messages from "../Messages/Messages";
import "./chatWindow.css";

const ChatWindow = () => {
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${userData._id}`
        );
        setRooms(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };

    getRooms();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getMessages/${currentRoom._id}`
        );
        setMessages(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };

    getMessages();
  }, [currentRoom]);

  const submitMessageHandler = async (event) => {
    event.preventDefault();

    let message = {};

    //remove the spaces from string edges and check for empty message
    const text = newMessage.trim();
    if (!text) return;

    message = {
      roomId: currentRoom._id,
      senderId: user._id,
      text,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createMessage/",
        message
      );
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      alert("Unable to send message...");
    }
  };

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
              {Object.keys(currentRoom).length ? (
                messages.map((msg) => (
                  <Messages
                    message={msg}
                    sentByme={user && user._id === msg.senderId}
                    key={msg._id}
                  />
                ))
              ) : (
                <p>Select a room</p>
              )}
            </div>

            <div className='wrapper-input'>
              <input
                className='userMessage-Input'
                type='text'
                placeholder='enter your message'
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
              ></input>
              <button
                className='sendMessage-Btn'
                onClick={submitMessageHandler}
              >
                send
              </button>
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
