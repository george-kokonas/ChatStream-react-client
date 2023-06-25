import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import Sidebar from "./Sidebar/Sidebar";
import Conversation from "./Conversation/Conversation";
import Profile from "./Profile/Profile";
import Overview from "./Overview/Overview";
import "../UI/Loader/Loader.css";

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
  const [unseenMessages, setUnseenMessages] = useState([]);
  const [mainWindowContent, setMainWindowContent] = useState("overview");

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

  /*ON USER LOGIN, UPDATE ONLINE USERS ARRAY AND GET ONLINE USERS*/
  useEffect(() => {
    if (currentUser) {
      //add user to onlineUsers array on socket server
      socket.current.emit("addUser", currentUser?._id);

      //get online users
      socket.current.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }

    // unsubscribe from event
    return () => {
      socket.current.off("getOnlineUsers");
    };
  }, [currentUser]);

  /*ON USER LOGIN, GET CURRENT USER DATA*/
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

  /*ON USER LOGIN, GET ALL USERS LIST*/
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
  }, []);

  /* ON USER LOGIN, FETCH HIS ROOMS*/
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

  /*ON USER LOGIN, GET LAST MESSAGES FOR ALL ROOMS (CONVERSATIONS LIST PREVIEW)*/
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

  /*ON USER LOG IN, FETCH UNREAD MESSAGES */
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

  /*ON SELECT ROOM, GET MESSAGES FOR SPECIFIC ROOM*/
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

  /*UPDATE SEEN MESSAGES STATUS*/
  const updateMessagesStatus = useCallback(
    async (roomId) => {
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
    },
    [unseenMessages]
  );

  /*ON INSTANT MESSAGE ARRIVAL, SET MESSAGE AND HANDLE UNREAD LOGIC (CONVERSATIONS LIST UNREAD)*/
  useEffect(() => {
    socket.current.on("getMessage", (instantMessage) => {
      setInstantMessage({
        _id: instantMessage._id,
        roomId: instantMessage.roomId,
        senderId: instantMessage.senderId,
        receiverId: instantMessage.receiverId,
        text: instantMessage.text,
        isSeen: instantMessage.isSeen,
        createdAt: instantMessage.createdAt,
      });
      setMessages((prev) => [...prev, instantMessage]);

      //if user is already in conversation that receives instant message, mark message as seen
      if (currentRoom?._id === instantMessage.roomId) {
        updateMessagesStatus(instantMessage.roomId);

        //add messages to unseenMessages array to increase the count
      } else {
        setUnseenMessages((prev) => [...prev, instantMessage]);
      }
    });

    // unsubscribe from event
    return () => {
      socket.current.off("getMessage");
    };
  }, [currentRoom, updateMessagesStatus]);

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

  return (
    <>
      {/* SIDEBAR */}
      {currentUser && (
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Sidebar
              currentUser={currentUser}
              allUsers={allUsers}
              onlineUsers={onlineUsers}
              rooms={rooms}
              setRooms={(newRoom) => setRooms([...rooms, newRoom])}
              setCurrentRoom={(room) => setCurrentRoom(room)}
              currentRoom={currentRoom}
              messagesPreview={messagesPreview}
              unseenMessages={unseenMessages}
              updateMessagesStatus={updateMessagesStatus}
              setMainWindowContent={setMainWindowContent}
              onUserChangeState={onUserChangeState}
              socket={socket.current}
            />
          </div>

          <div className={styles.mainWindowContainer}>
            {/* CONVERSATION */}
            {mainWindowContent === "conversation" && (
              <>
                {currentRoom && (
                  <Conversation
                    currentUser={currentUser}
                    allUsers={allUsers}
                    currentRoom={currentRoom}
                    messages={messages.filter(
                      (message) => message.roomId === currentRoom?._id
                    )}
                    onNewMessage={(data) => setMessages([...messages, data])}
                    socket={socket.current}
                  />
                )}
              </>
            )}

            {mainWindowContent === "profile" && (
              <Profile
                currentUser={currentUser}
                setMainWindowContent={setMainWindowContent}
                setIsLoading={setIsLoading}
              />
            )}

            {mainWindowContent === "overview" && (
              <Overview
                currentUser={currentUser}
                allUsers={allUsers}
                onlineUsers={onlineUsers}
              />
            )}

          </div>
        </div>
      )}
      {isLoading && <div className='loader-container' />}
    </>
  );
};

export default ChatPage;
