import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavigationBar from "./NavigationBar/NavigationBar";
import SideBar from "./SideBar/SideBar";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";
import ProfileWindow from "./ProfileWindow/ProfileWindow";
import { initiateSocket, getSocket } from "./socket/Socket";

import { MDBContainer, MDBRow, MDBCol, MDBTypography } from "mdb-react-ui-kit";
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ onUserChangeState }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [profileWindow, setProfileWindow] = useState(false);

  const socket = useRef();

  //GET CURRENT USER
  useEffect(() => {
    const getUserData = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user/getUser/${user._id}`
        );
        setCurrentUser(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching users...");
      }
    };
    getUserData();
  }, []);

  //GET REGISTERED USERS LIST
  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );
      setAllUsers(data);
    };
    getAllUsers();
  }, []);

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
          `http://localhost:8000/chat/getMessages/${currentRoom._id}`
        );
        setMessages(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };
    currentRoom && getMessages();
  }, [currentRoom]);

  //TRIGGERED WHEN USER IS TYPING A NEW MESSAGE
  useEffect(() => {
    const typingTimeout = 1500;
    let typingTimer;

      clearTimeout(typingTimer);
      
      socket.current.on("isTyping", () => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, typingTimeout);
      });
  },[])

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
                            {isTyping ? <p>user is typing...</p> : " "}
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
                      <p style={{ color: "white" }}>select a room</p>
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
