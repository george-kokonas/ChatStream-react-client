import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavigationBar from "./NavigationBar/NavigationBar";
import SideBar from "./SideBar/SideBar";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";
import ProfileWindow from "./ProfileWindow/ProfileWindow";
import TypingIndicator from "./TypingIndicator/TypingIndicator";

import getAuthHeaders from "../helpers/authHeaders";
import API_URL from "../helpers/config";
import { initiateSocket, getSocket } from "../helpers/socket";

import { MDBContainer, MDBRow, MDBCol, MDBTypography } from "mdb-react-ui-kit";
import styles from "./ChatPage.module.css";

const ChatPage = ({ onUserChangeState }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [lastVistitedRoom, setLastVisitedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [profileWindow, setProfileWindow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navUnreadMessages, setNavUnreadMessages] = useState(false);

  const socket = useRef();

  /* INITIATE SOCKET */
  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    // clean up the socket when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  /*TRIGGERED ON USER LOGIN*/
  useEffect(() => {
    //add user to onlineUsers array on socket server
    socket.current.emit("addUser", currentUser?._id);

    //get online users
    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // unsubscribe from event
    return () => {
      socket.current.off("getOnlineUsers");
    };
  }, [currentUser?._id]);

  /*TRIGGERED WHEN INSTANT MESSAGE ARRIVES*/
  useEffect(() => {
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

    // unsubscribe from event
    return () => {
      socket.current.off("getMessage");
    };
  }, []);

  /*GET CURRENT USER DATA*/
  useEffect(() => {
    const getUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (token) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `${API_URL}/user/getUser/${user._id}`,
            getAuthHeaders()
          );
          setCurrentUser(data);
          setIsLoading(false);
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

  /*GET ALL USERS LIST*/
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

  /*TRIGGERED WHEN INSTANT MESSAGE ARRIVES OR USER SELECTS A ROOM*/
  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members.includes(instantMessage.senderId)
    ) {
      setLastVisitedRoom(currentRoom);
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  /*GET MESSAGES FROM SELECTED ROOM*/
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

  return (
    <>
      {currentUser && (
        <div className={styles.container}>
          {isLoading && <div className='loader-container' />}
          <NavigationBar
            className={styles.navbar}
            onUserChangeState={onUserChangeState}
            onSetProfileWindow={() => setProfileWindow(true)}
            currentUser={currentUser}
            navUnreadMessages={navUnreadMessages}
            socket={socket.current}
            onExitRoom={() => setCurrentRoom(null)}
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
                  onSelectRoom={(room) => {
                    setCurrentRoom(room);
                    setLastVisitedRoom(room);
                  }}
                  navUnreadMessages={(state) => setNavUnreadMessages(state)}
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
                            <TypingIndicator
                              currentRoom={currentRoom}
                              socket={socket.current}
                            />
                          </MDBRow>
                        </MDBTypography>

                        <MDBRow className={styles.inputs}>
                          <Inputs
                            currentUser={currentUser}
                            currentRoom={currentRoom}
                            socket={socket.current}
                            onNewMessage={(data) =>
                              setMessages([...messages, data])
                            }
                          />
                        </MDBRow>
                      </>
                    ) : (
                      <p className={styles.noConversationsMessage}>
                        Welcome to ChatStream {currentUser.username}! <br />
                        Select a user from the list and start chatting!
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
                    onLoading={(state) => setIsLoading(state)}
                    onExitRoom={() => setCurrentRoom(lastVistitedRoom)}
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

export default ChatPage;
