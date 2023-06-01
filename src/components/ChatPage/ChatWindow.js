import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavigationBar from "./NavigationBar/NavigationBar";
import SideBar from "./SideBar/SideBar";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";
import ProfileWindow from "./ProfileWindow/ProfileWindow";

import getAuthHeaders from "../helpers/authHeaders";
import API_URL from "../helpers/config";
import { initiateSocket, getSocket } from "./socket/Socket";

import { MDBContainer, MDBRow, MDBCol, MDBTypography } from "mdb-react-ui-kit";
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ onUserChangeState }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [profileWindow, setProfileWindow] = useState(false);
  const [isTyping, setIsTyping] = useState({
    typingNow: false,
    username: "",
  });
  
  const socket = useRef();
  
  //GET CURRENT USER DATA
  useEffect(() => {
    const getUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const { data } = await axios.get(
            `${API_URL}/user/getUser/${user._id}`,
            getAuthHeaders()
          );
          setCurrentUser(data);
        } catch (error) {
          console.log(error);
          alert("Error fetching user data...");
        }
      } else {
        alert("Token not found. Please log in first...");
      }
    };

    getUserData();
  }, []);

  //GET REGISTERED USERS LIST
  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await axios.get(
        `${API_URL}/user/getRegisteredUsers`,
        getAuthHeaders()
      );
      setAllUsers(data);
    };
    getAllUsers();
  }, [onlineUsers]);

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
    socket.current.emit("addUser", currentUser?._id);

    //get online users
    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser?._id]);

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
          `${API_URL}/chat/getMessages/${currentRoom._id}`,
          getAuthHeaders()
        );
        setMessages(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };
    currentRoom && getMessages();
  }, [currentRoom]);

  //TRIGGERED WHEN USER IS TYPING
  useEffect(() => {
    const handleIsTyping = ({ currentRoomId, senderUsername }) => {
      //check that typing indicator appears in the correct room
      if (!currentRoom || currentRoomId !== currentRoom?._id) return;

      //set timer interval
      const typingTimeout = 1400;
      let typingTimer;

      clearTimeout(typingTimer);

      //update isTyping state
      setIsTyping((prevState) => ({
        ...prevState,
        typingNow: true,
      }));

      setIsTyping((prevState) => ({
        ...prevState,
        username: senderUsername,
      }));

      //set indicator state to false at chosen interval
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, typingTimeout);
    };

    socket.current.on("isTyping", handleIsTyping);

    //close socket when current room changes or component unmounts
    return () => {
      socket.current.off("isTyping", handleIsTyping);
    };
  }, [currentRoom]);

  // TRIGGERED WHEN USER LOGS OUT TO UPDATE ONLINE USERS ARRAY
  const disconnectSocketHandler = () => {
    socket.current.emit("logout", socket.current.id);
  };

  return (
    <>
      {currentUser && (
        <div className={styles.container}>
          <NavigationBar
            className={styles.navbar}
            onUserChangeState={onUserChangeState}
            onDisconnectSocket={disconnectSocketHandler}
            onSetProfileWindow={() => setProfileWindow(true)}
            currentUser={currentUser}
          />
          <MDBContainer fluid className='py-0'>
            <MDBRow>
              {/*LEFT-SIDE BAR */}
              <MDBCol md='6' lg='5' xl='4' xxl='3' className={styles.sidebar}>
                <SideBar
                  currentUser={currentUser}
                  allUsers={allUsers}
                  onlineUsers={onlineUsers}
                  currentRoom={currentRoom}
                  messages={messages}
                  instantMessage={instantMessage}
                  onSelectRoom={(room) => setCurrentRoom(room)}
                />
              </MDBCol>

              {/* CHAT WINDOW */}
              <MDBCol className={styles.chatWrapper}>
                {!profileWindow ? (
                  <>
                    {currentRoom ? (
                      <>
                        <MDBTypography listUnStyled>
                          <MDBRow className={styles.conversation}>
                            <Messages
                              currentUser={currentUser}
                              allUsers={allUsers}
                              currentRoom={currentRoom}
                              messages={messages}
                            />
                          </MDBRow>
                          <MDBRow className={styles.typingIndicator}>
                            {isTyping.typingNow ? (
                              <p>{isTyping.username} is typing...</p>
                            ) : (
                              " "
                            )}
                          </MDBRow>
                        </MDBTypography>

                        <MDBRow className={styles.inputs}>
                          <Inputs
                            currentUser={currentUser}
                            currentRoom={currentRoom}
                            onNewMessage={(data) =>
                              setMessages([...messages, data])
                            }
                          />
                        </MDBRow>
                      </>
                    ) : (
                      <p className={styles.noConversationsMessage}>
                        Welcome to ChatStream {currentUser.username}! <br />
                        Select a user from list and start chatting!
                      </p>
                    )}
                  </>
                ) : (
                  <ProfileWindow
                    currentUser={currentUser}
                    onSetProfileWindow={() => setProfileWindow(false)}
                    onUpdateUserProfile={(updatedProfile) =>
                      setCurrentUser(updatedProfile)
                    }
                  />
                )}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
