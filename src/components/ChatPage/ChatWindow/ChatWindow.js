import React, { useState, useEffect, useRef } from "react";
import { initiateSocket, getSocket } from "../socket/Socket";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import Messages from "../Messages/Messages";
import RegisteredUsers from "../RegisteredUsers/RegisteredUsers";
import "./chatWindow.css";

const ChatWindow = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [instantMessage, setInstantMessage] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useRef();

  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        sender: data.senderId,
        text: data.text,
      });
    });

    const fetchRegisteredUsers = async () => {
      const {data} = await axios.get("http://localhost:8000/user/getRegisteredUsers");
      setRegisteredUsers(data);
    }
    fetchRegisteredUsers()
  }, []);

  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members.includes(instantMessage.sender)
    ) {
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    // socket.current.on("getUsers" , users => {console.log(users);})
  }, [user]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${user._id}`
        );
        setRooms(data);
      } catch (error) {
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
          `http://localhost:8000/chat/getMessages/${currentRoom?._id}`
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

    const message = {
      roomId: currentRoom._id,
      senderId: user._id,
      text: newMessage,
    };

    const receiverId = currentRoom.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    });


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
  console.log(rooms);
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
            {currentRoom ? (
              <>
                <div className='message'>
                  {messages.map((msg, index) => (
                    <Messages
                      message={msg}
                      sentByme={msg.senderId === user._id}
                      key={index}
                    />
                  ))}
                </div>

                {/* CHAT INPUT */}
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
              </>
            ) : (
              <p>select room</p>
            )}
          </div>
        </div>

        {/* RIGHT PART */}
        <div className='onlineUsers'>
          <div className='wrapper-onlineUsers'>
            ----REGISTERED USERS---------
            {registeredUsers.map((user) => (
              <RegisteredUsers
                user = {user}
                rooms = {rooms}
                key= {user._id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
