import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./Sidebar/Sidebar";
import Conversation from "./Conversation/Conversation";
import Profile from "./Profile/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../UI/Loader/Loader.css";

import useSocket, {
  useOnlineUsers,
  useInstantMessages,
} from "../socket/useSocket";
import getAuthHeaders from "../helpers/authHeaders";
import API_URL from "../helpers/config";

import { faSliders } from "@fortawesome/free-solid-svg-icons";
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
  const [mainWindowContent, setMainWindowContent] = useState("conversation");
  const [isBarVisible, setIsBarVisible] = useState(true);

  /* Initialize socket */
  const socket = useSocket();

  /* Online Users functionality */
  useOnlineUsers(socket,currentUser, setOnlineUsers);
  // emitUserToOnlineUsers(socket, currentUser);

  /* Instant Messages functionality */
  useInstantMessages(
    socket,
    currentRoom,
    setMessages,
    setUnseenMessages,
    updateMessagesStatus
  );

  /*UPDATE SEEN MESSAGES STATUS*/
  async function updateMessagesStatus(roomId) {
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
    }
  }

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
      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getChatRoom/${currentUser?._id}`,
          getAuthHeaders()
        );
        setRooms(data);
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
        alert("Error fetching preview messages...");
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
      }
    };

    currentRoom && getMessages();
  }, [currentRoom]);

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

  /* TRIGGERED ON RECEIVER'S SIDE WHEN INSTANT MESSAGE ARRIVES AND INITIATES A CONVERSATION (FIRST MESSAGE)*/
  useEffect(() => {
    if (!instantMessage) return;

    //check if room already exists
    const roomExists = rooms.find((room) => room._id === instantMessage.roomId);

    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getNewChatRoom/${instantMessage?.roomId}`,
          getAuthHeaders()
        );
        // Add new room to existing rooms
        setRooms([...rooms, data]);
      } catch (error) {
        alert("Error fetching data");
      }
    };

    if (!roomExists) {
      getRooms();
    }
  }, [instantMessage, rooms]);

  /* DELETE SELECTED CHATROOM*/
  const deleteRoomHandler = async (roomId) => {
    const userId = currentUser._id;
    try {
      await axios.delete(`${API_URL}/chat/deleteChatRoom`, {
        data: { roomId, userId },
        ...getAuthHeaders(),
      });

      const filteredRooms = rooms.filter((room) => room._id !== roomId);
      setRooms(filteredRooms);
      setInstantMessage(null);
      setMainWindowContent("");
      setCurrentRoom(null);
    } catch (error) {
      alert("Unable to delete chat...");
    }
  };

  return (
    <>
      {currentUser && (
        <div className={styles.container}>
          <div
            className={
              isBarVisible ? `${styles.sidebar}` : `${styles.hiddenBar}`
            }
          >
            <Sidebar
              currentUser={currentUser}
              allUsers={allUsers}
              onlineUsers={onlineUsers}
              rooms={rooms}
              setRooms={(newRoom) => setRooms([...rooms, newRoom])}
              setCurrentRoom={(room) => setCurrentRoom(room)}
              currentRoom={currentRoom}
              deleteRoomHandler={(roomId) => deleteRoomHandler(roomId)}
              messagesPreview={messagesPreview}
              unseenMessages={unseenMessages}
              updateMessagesStatus={updateMessagesStatus}
              setMainWindowContent={setMainWindowContent}
              onUserChangeState={onUserChangeState}
              socket={socket.current}
              setIsBarVisible={setIsBarVisible}
            />
          </div>

          {!isBarVisible && (
            <div className={styles.mainWindowContainer}>
              {/* TOGGLE BUTTON */}
              <div className={styles.toggleButtonContainer}>
                <FontAwesomeIcon
                  icon={faSliders}
                  style={{ color: "#dfdddd" }}
                  size='2xl'
                  beat={unseenMessages.length > 0}
                  onClick={() => setIsBarVisible(true)}
                />
              </div>

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

              {/* PROFILE */}
              {mainWindowContent === "profile" && (
                <Profile
                  currentUser={currentUser}
                  setMainWindowContent={setMainWindowContent}
                  setIsLoading={setIsLoading}
                />
              )}
            </div>
          )}
        </div>
      )}
      {isLoading && <div className='loader-container' />}
    </>
  );
};

export default ChatPage;
