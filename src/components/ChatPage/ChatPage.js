import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import SideNav from "./SideNav/SideNav";
import AllUsers from "./AllUsers/AllUsers";
import Rooms from "./Rooms/Rooms";
import Messages from "./Messages/Messages";
import Inputs from "./Inputs/Inputs";
import Profile from "./Profile/Profile";
import TypingIndicator from "./TypingIndicator/TypingIndicator";

import { initiateSocket, getSocket } from "../helpers/socket";
import getAuthHeaders from "../helpers/authHeaders";
import fetchChatRooms from "../helpers/fetchChatRooms";
import API_URL from "../helpers/config";

import styles from "./ChatPage.module.scss";

const ChatPage = ({ onUserChangeState }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [messagesPreview, setMessagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [navSelection, setNavSelection] = useState("");
  const [unseenMessages, setUnseenMessages] = useState([]);

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
      setMessages((prev) => [...prev, data]);
      setUnseenMessages((prev) => [...prev, data]);
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
      try {
        const { data } = await axios.get(
          `${API_URL}/user/getRegisteredUsers`,
          getAuthHeaders()
        );
        setAllUsers(data);
      } catch (error) {
        alert("Unable to retrieve users....");
      }
    };
    getAllUsers();
  }, [onlineUsers]);

  // TRIGGERED WHEN USER LOGS IN TO FETCH HIS ROOMS
  useEffect(() => {
    const getRooms = async () => {
      const url = `${API_URL}/chat/getChatRoom/${currentUser?._id}`;

      try {
        const roomsData = await fetchChatRooms(url);
        setRooms(roomsData);
      } catch (error) {
        alert("Error fetching Conversations...");
      }
    };

    getRooms();
  }, [currentUser?._id]);

  /*ON FIRST LOAD, GET LAST MESSAGES FOR ALL ROOMS (CONVERSATIONS LIST PREVIEW)*/
  useEffect(() => {
    const getLastMessages = async () => {
      const roomsIds = rooms.map((room) => room._id);

      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getLastMessages/${roomsIds}`,
          getAuthHeaders()
        );
        setMessagesPreview(data);
      } catch (error) {
        alert("Error fetching messages...");
      }
    };
    rooms.length && getLastMessages();
  }, [rooms]);

  /*SET INCOMING INSTANT MESSAGE AS LAST MESSAGE (CONVERSATIONS LIST PREVIEW) */
  useEffect(() => {
    if (!instantMessage) return;

    setMessagesPreview((prevMessages) => {
      const updatedMessages = prevMessages.filter(
        (message) => message.roomId !== instantMessage.roomId
      );
      return [...updatedMessages, instantMessage];
    });
  }, [instantMessage]);

  /*SET SENT MESSAGE AS LAST MESSAGE (CONVERSATIONS LIST PREVIEW) */
  useEffect(() => {
    if (messages.length === 0) return;
    const sentMessage = messages[messages.length - 1];

    setMessagesPreview((prevMessages) => {
      const updatedMessages = prevMessages.filter(
        (message) => message.roomId !== sentMessage.roomId
      );
      return [...updatedMessages, sentMessage];
    });
  }, [messages]);

  /*GET MESSAGES FROM SELECTED ROOM*/
  useEffect(() => {
    //get messages for specific room
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

  // TRIGGERED ON RECEIVER'S SIDE WHEN INSTANT MESSAGE ARRIVES AND INITIATES A CONVERSATION (FIRST MESSAGE)
  useEffect(() => {
    //bad - find another way
    if (!instantMessage) return;
    const roomExists = rooms.find((room) => room._id === instantMessage.roomId);

    const getRooms = async () => {
      const url = `${API_URL}/chat/getNewChatRoom/${instantMessage?.roomId}`;

      try {
        const roomData = await fetchChatRooms(url);
        // Add new room to existing rooms
        setRooms([...rooms, roomData]);
      } catch (error) {
        alert("Error fetching data");
      }
    };

    if (!roomExists) {
      getRooms();
    }
  }, [instantMessage, rooms]);

  /*TRIGGERED ON USER LOGS IN TO FETCH UNREAD MESSAGES */
  useEffect(() => {
    const getUnseenMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getUnseenMessages/${currentUser._id}`,
          getAuthHeaders()
        );
        setUnseenMessages(data);
      } catch (error) {
        alert("Unable to fetch unread messages status...");
      }
    };
    currentUser && getUnseenMessages();
  }, [currentUser]);

  /*UPDATE SEEN MESSAGES STATUS*/
  const updateMessagesStatus = async (roomId) => {
    try {
      //update messages status in current room
      await axios.put(
        `${API_URL}/chat/updateMessagesStatus/${roomId}`,
        null,
        getAuthHeaders()
      );

      //filter the seen messages from the unseenMessages array
      const updatedUnseenMessages = unseenMessages.filter(
        (message) => message.roomId !== roomId
      );
      // Update unseenMessages array
      setUnseenMessages(updatedUnseenMessages);
    } catch (error) {
      alert("Error updating message statuses");
      console.error(error);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      {currentUser && (
        <div className={styles.container}>
          <SideNav
            setNavSelection={(selection) => setNavSelection(selection)}
            navSelection={navSelection}
            setCurrentRoom={(selection) => setCurrentRoom(selection)}
            currentUser={currentUser}
            onUserChangeState={onUserChangeState}
            socket={socket.current}
          />

          <div className={styles.wrapper}>
            {/* USERS */}
            {navSelection === "users" && (
              <div className={styles.usersListContainer}>
                <AllUsers
                  currentUser={currentUser}
                  allUsers={allUsers}
                  onlineUsers={onlineUsers}
                  rooms={rooms}
                  setRooms={(newRoom) => setRooms([...rooms, newRoom])}
                  setCurrentRoom={(room) => setCurrentRoom(room)}
                  setNavSelection={() => setNavSelection("conversations")}
                />
              </div>
            )}

            {/* CHAT */}
            {navSelection === "conversations" && (
              <div className={styles.chatWrapper}>
                {/* ROOMS LIST*/}
                <div className={styles.roomsContainer}>
                  <Rooms
                    currentUser={currentUser}
                    rooms={rooms}
                    currentRoom={currentRoom}
                    setCurrentRoom={(room) => setCurrentRoom(room)}
                    setNavSelection={() => setNavSelection("conversations")}
                    messagesPreview={messagesPreview}
                    unseenMessages={unseenMessages}
                    updateMessagesStatus={updateMessagesStatus}
                  />
                </div>

                {/* CONVERSATION */}
                {currentRoom && (
                  <div className={styles.conversationWrapper}>
                    <div className={styles.messages}>
                      <Messages
                        currentUser={currentUser}
                        allUsers={allUsers}
                        currentRoom={currentRoom}
                        messages={messages.filter(
                          (message) => message.roomId === currentRoom?._id
                        )}
                      />
                    </div>

                    <div className={styles.typingIndicator}>
                      <TypingIndicator
                        currentRoom={currentRoom}
                        socket={socket.current}
                      />
                    </div>

                    <div className={styles.inputs}>
                      <Inputs
                        currentUser={currentUser}
                        currentRoom={currentRoom}
                        socket={socket.current}
                        onNewMessage={(data) =>
                          setMessages([...messages, data])
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {navSelection === "profile" && (
              <div className={styles.profile}>
                <Profile
                  currentUser={currentUser}
                  setNavSelection={() => setNavSelection("users")}
                  onLoading={(state) => setIsLoading(state)}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {isLoading && <div className='loader-container' />}
    </>
  );
};

export default ChatPage;
