import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavigationBar from "./NavigationBar/NavigationBar";
import SideBar from "./SideBar/SideBar";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";
import { initiateSocket, getSocket } from "./socket/Socket";

import { MDBContainer, MDBRow, MDBCol, MDBTypography } from "mdb-react-ui-kit";
import "./chatWindow.css";

const ChatWindow = ({ onUserChangeState }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pageContent, setPageContent] = useState("users");

  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useRef();

  //TRIGGERED WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    //executed when new instant message arrives
    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        _id: data._id,
        roomId: data.roomId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        isSeen: data.isSeen,
        createdAt: data.createdAt,
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
  }, [user._id]);

  //TRIGGERED WHEN INSTANT MESSAGE ARRIVES OR USER SELECTS A ROOM
  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members.includes(instantMessage.senderId)
    ) {
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  //GET MESSAGES FROM SELECTED ROOM
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

  //TRIGGERED WHEN USER IS TYPING A NEW MESSAGE
  const typingHandler = () => {
    const typingTimeout = 4000;
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

  // TRIGGERED WHEN USER LOGS OUT TO UPDATE ONLINE USERS ARRAY
  const disconnectSocketHandler = () => {
    socket.current.emit("logout", socket.current.id);
  };

  return (
    <>
      <div className='chat-container'>
        <MDBContainer fluid className='py-4'>
          <MDBRow>
            {/*LEFT-SIDE BAR  */}
            <MDBCol md='6' lg='5' xl='4' className='mb-4 mb-md-0'>
              <SideBar
                loggedUser={user}
                onlineUsers={onlineUsers}
                currentRoom={currentRoom}
                messages={messages}
                instantMessage={instantMessage}
                onSelectRoom={(room) => setCurrentRoom(room)}
                onSelectTab={(tab) => setPageContent(tab)}
              />
            </MDBCol>

            {/* CHAT WINDOW */}
            <MDBCol className='chat-window-container'>
              <MDBTypography listUnStyled>
                {pageContent === "conversations" ? (
                  <>
                    {currentRoom ? (
                      <>
                        <Messages loggedUser={user} messages={messages} />
                        {isTyping ? <p className="typing-indicator">user is typing...</p> : " "}
                        <li id='chat-window-inputs' className='bg-white mb-3'>
                          <Inputs
                            loggedUser={user}
                            currentRoom={currentRoom}
                            onNewMessage={(data) =>
                              setMessages([...messages, data])
                            }
                            onTyping={typingHandler}
                          />
                        </li>
                      </>
                    ) : (
                      <p>select room</p>
                    )}
                  </>
                ) : (
                  <div>
                    {" "}
                    <NavigationBar
                      onUserChangeState={onUserChangeState}
                      onDisconnectSocket={disconnectSocketHandler}
                      user={user}
                    />


                  </div>
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
