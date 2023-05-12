import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import Messages from "../Messages/Messages";
import "./chatWindow.css";

const ChatWindow = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const socket = useRef();
  
  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentRoom?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentRoom]);

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
          <div className='wrapper-onlineUsers'>----ONLINE USERS---------</div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;

/*  useEffect(() => {
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
*/
