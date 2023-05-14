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

  //TRIGGERED WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    //initialize socket
    initiateSocket();
    socket.current = getSocket();

    //executed when new instant message arrives
    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        sender: data.senderId,
        text: data.text,
      });
    });
  }, []);

  //TRIGGERED ON USER LOGIN
  useEffect(() => {
    //add user to onlineUsers array on socket server
    socket.current.emit("addUser", user._id);

    //get online users from onlineUsers array on socket server
    socket.current.on("getUsers", (users) => {});

    //get all registered users from onlineUsers array on socket server
    const getRegisteredUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );
      //exclude logged in user from registeredUsers array
      const filteredUsers = data.filter(
        (registeredUser) => registeredUser._id !== user._id
      );
      setRegisteredUsers(filteredUsers);
    };
    getRegisteredUsers();
  }, [user._id]);

  //TRIGGERED WHEN INSTANT MESSAGE ARRIVES OR USER SELECTS A ROOM
  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members.includes(instantMessage.sender)
    ) {
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES TO OPEN A  NEW ROOM
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
  }, [user._id, instantMessage]);

  //TRIGGERED WHEN USER SELECTS A ROOM
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

  //CREATE NEW CHATROOM TO INITIATE CONVERSATION WITH SELECTED USER
  const newRoomHandler = async (selectedUserId) => {
    const room = {
      senderId: user._id,
      receiverId: selectedUserId,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createChatRoom/",
        room
      );
      setRooms([...rooms, data]);
    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  //SUBMIT THE MESSAGE
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

    //executed when instant message is sent
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    });

    //send message to server
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
          <div className='wrapper-onlineUsers'>
            ----REGISTERED USERS---------
            {registeredUsers.map((registeredUser) => (
              <RegisteredUsers
                loggedUser={user}
                registeredUser={registeredUser}
                rooms={rooms}
                onNewConversation={newRoomHandler}
                key={registeredUser._id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
