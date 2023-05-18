import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Topbar from "./Topbar/Topbar";
import SideBar from "./SideBar/SideBar";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";

import { initiateSocket, getSocket } from "./socket/Socket";
import { MDBContainer, MDBRow, MDBCol, MDBTypography } from "mdb-react-ui-kit";
import "./chatWindow.css";

const ChatWindow = ({ onUserChangeState }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [instantMessage, setInstantMessage] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useRef();

  //TRIGGERED WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    //executed when new instant message arrives
    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //TRIGGERED ON USER LOGIN
  useEffect(() => {
    //add user to onlineUsers array on socket server
    socket.current.emit("addUser", user._id);

    //get online users
    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    //get all registered users from database
    const getRegisteredUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );

      setRegisteredUsers(data);
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

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES AND OPEN A NEW ROOM
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
    //prevent the user from starting a conversation with himself
    if (selectedUserId === user._id) {
      return;
    }

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

  // TRIGGERED WHEN USER LOGS OUT TO UPDATE ONLINE USERS ARRAY
  const disconnectSocketHandler = () => {
    socket.current.emit("logout", socket.current.id);
  };

  //TRIGGERED WHEN USER IS TYPING A NEW MESSAGE
  const typingHandler = () => {
    const typingTimeout = 1000;
    let typingTimer;

    const receiverId = currentRoom.members.find(
      (member) => member !== user._id
    );

    clearTimeout(typingTimer);

    socket.current.on("isTyping", () => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, typingTimeout);
    });

    socket.current.emit("userTyping", {
      senderId: user._id,
      receiverId: receiverId,
    });
  };

  return (
    <>
      <Topbar
        onUserChangeState={onUserChangeState}
        onDisconnectSocket={disconnectSocketHandler}
      />
      <div className='chat-container'>
        <MDBContainer fluid className='py-4'>
          <MDBRow>
            {/*LEFT-SIDE BAR  */}
            <MDBCol
              id='left-bar-container'
              md='6'
              lg='5'
              xl='4'
              className='mb-4 mb-md-0'
            >
              <SideBar
                loggedUser={user}
                registeredUsers={registeredUsers}
                onlineUsers={onlineUsers}
                rooms={rooms}
                currentRoom={currentRoom}
                onSelectRoom={(room) => setCurrentRoom(room)}
                onNewRoom={newRoomHandler}
              />
            </MDBCol>

            {/* CHAT WINDOW */}
            <MDBCol className='chat-window-container'>
              <MDBTypography listUnStyled>
                {currentRoom ? (
                  <>
                    <Messages
                      loggedUser={user}
                      messages={messages}
                      currentRoom={currentRoom}
                      />
                      {isTyping && <p>user is typing...</p>}

                    <li id='chat-window-inputs' className='bg-white mb-3'>
                      <Inputs
                        loggedUser={user}
                        currentRoom={currentRoom}
                        onNewMessage={(data) =>
                          setMessages([...messages, data])
                        }
                        newMessage={newMessage}
                        onTyping={typingHandler}
                      />
                    </li>
                  </>
                ) : (
                  <p>select room</p>
                )}
              </MDBTypography>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
};

export default ChatWindow;
