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
  const [lastVistitedRoom, setLastVisitedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [instantMessage, setInstantMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [navUnreadMessages, setNavUnreadMessages] = useState(false);
  const [navSelection, setNavSelection] = useState("");
  const [lastNavSelection, setLastNavSelection] = useState("");

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

  /*TRIGGERED WHEN INSTANT MESSAGE ARRIVES OR USER SELECTS A ROOM*/
  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members?.includes(instantMessage.senderId)
    ) {
      setLastVisitedRoom(currentRoom);
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  // TRIGGERED ON RECEIVER'S SIDE WHEN INSTANT MESSAGE ARRIVES AND INITIATES A CONVERSATION (FIRST MESSAGE)
  useEffect(() => {
    if (!instantMessage) return;

    // Search if conversation already exists
    const roomExists = rooms.find((room) => room._id === instantMessage.roomId);

    const getRooms = async () => {
      const url = `${API_URL}/chat/getNewChatRoom/${instantMessage?.roomId}`;

      try {
        const roomData = await fetchChatRooms(url);

        // Add new room to existing rooms
        setRooms([...rooms, roomData]);

        // Notify the user
        setNavUnreadMessages(true);
      } catch (error) {
        alert("Error fetching data");
      }
    };

    if (!roomExists) {
      getRooms();
    }
  }, [instantMessage, navUnreadMessages, rooms]);

  return (
    <>
      {/* SIDEBAR */}
      {currentUser && (
        <div className={styles.container}>
          <SideNav
            setNavSelection={(selection) => setNavSelection(selection)}
            setLastNavSelection={(lastSelection) =>
              setLastNavSelection(lastSelection)
            }
            navSelection={navSelection}
            lastNavSelection={lastNavSelection}
            setCurrentRoom={(selection) => setCurrentRoom(selection)}
            onUserChangeState={onUserChangeState}
            currentUser={currentUser}
            socket={socket.current}
          />

          <div className={styles.wrapper}>
            {/* USERS */}
            {navSelection === "users" && (
              <div className={styles.usersListContainer}>
                <AllUsers
                  allUsers={allUsers}
                  currentUser={currentUser}
                  onlineUsers={onlineUsers}
                  setRooms={(newRoom) => setRooms([...rooms, newRoom])}
                  setCurrentRoom={(room) => setCurrentRoom(room)}
                  rooms={rooms}
                  setNavSelection={() => setNavSelection("conversations")}
                  setLastNavSelection={() =>
                    setLastNavSelection("conversations")
                  }
                  setLastVisitedRoom={(room) => setLastVisitedRoom(room)}
                />
              </div>
            )}

            {/* CHAT */}
            {navSelection === "conversations" && (
              <div className={styles.chatWrapper}>
                {/* ROOMS LIST*/}
                <div className={styles.roomsContainer}>
                  <Rooms
                    rooms={rooms}
                    messages={messages}
                    setCurrentRoom={(room) => setCurrentRoom(room)}
                    setLastVisitedRoom={(room) => setLastVisitedRoom(room)}
                    instantMessage={instantMessage}
                    currentUser={currentUser}
                    currentRoom={currentRoom}
                    navUnreadMessages={(state) => setNavUnreadMessages(state)}
                    setNavSelection={() => setNavSelection("conversations")}
                    setLastNavSelection={() =>
                      setLastNavSelection("conversations")
                    }
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
                        messages={messages}
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
                  onLoading={(state) => setIsLoading(state)}
                  onUpdateUserProfile={(updatedProfile) =>
                    setCurrentUser(updatedProfile)
                  }
                  setNavSelection={() => setNavSelection(lastNavSelection)}
                  setCurrentRoom={() =>
                    lastNavSelection === "users" ||
                    setCurrentRoom(lastVistitedRoom)
                  }
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
