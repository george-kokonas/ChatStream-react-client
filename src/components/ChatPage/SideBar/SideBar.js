import React, { useState, useEffect } from "react";
import axios from "axios";

import AllUsers from "./AllUsers/AllUsers";
import Rooms from "./Rooms/Rooms";
import API_URL from "../../helpers/config";
import getAuthHeaders from "../../helpers/authHeaders";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { MDBCard, MDBTypography } from "mdb-react-ui-kit";
import styles from "./Sidebar.module.css";
import "./Tabs.css";

const SideBar = ({
  currentUser,
  allUsers,
  onlineUsers,
  messages,
  instantMessage,
  onSelectRoom,
  navUnreadMessages,
}) => {
  const [tab, setTab] = useState("users");
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  // Function to fetch chat rooms
  const fetchChatRooms = async (url) => {
    try {
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching data");
    }
  };

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
        setRooms((prevRooms) => [...prevRooms, roomData]);

        // Notify the user
        navUnreadMessages(true);
      } catch (error) {
        alert("Error fetching data");
      }
    };

    if (!roomExists) {
      getRooms();
    }
  }, [instantMessage, navUnreadMessages, rooms]);

  const handleSelectUserClick = (user) => {
    //prevent actions if user clicks on himself
    if (user._id === currentUser._id) return;

    setTab("conversations");

    //find the conversation with the selected user
    const room = rooms.find((room) => room.members.includes(user._id));

    //if no conversation yet, return
    if (!room) return;

    //set conversation with selected user
    setCurrentRoom(room);

    //pass conversation to ChatPage.js
    onSelectRoom(room);
  };

  const newRoomHandler = (newRoom) => {
    //update conversations(rooms) array
    setRooms([...rooms, newRoom]);

    //set new conversation as current
    setCurrentRoom(newRoom);

    //pass conversation to ChatPage.js
    onSelectRoom(newRoom);
  };

  return (
    <Tabs activeKey={tab} onSelect={(selectedTab) => setTab(selectedTab)}>
      {/* CONVERSATIONS TAB */}
      <Tab eventKey='conversations' title='Conversations' className='mt-2 mb-1'>
        <MDBCard className={styles.cards}>
          <MDBTypography listUnStyled className='mb-0'>
            {rooms.length &&
              rooms.map((room) => (
                <div
                  onClick={() => {
                    setCurrentRoom(room);
                    onSelectRoom(room);
                  }}
                  key={room._id}
                >
                  <Rooms
                    currentUser={currentUser}
                    room={room}
                    currentRoom={currentRoom}
                    navUnreadMessages={navUnreadMessages}
                    instantMessage={instantMessage}
                    userMessages={messages.filter(
                      (message) => message.roomId === currentRoom?._id
                    )}
                  />
                </div>
              ))}
          </MDBTypography>
        </MDBCard>
      </Tab>

      {/* USERS TAB */}
      <Tab eventKey='users' title='Users' className='mt-2 mb-1'>
        <MDBCard className={styles.cards}>
          <MDBTypography listUnStyled className='mb-0'>
            {allUsers?.map((user) => (
              <div onClick={() => handleSelectUserClick(user)} key={user._id}>
                <AllUsers
                  currentUser={currentUser}
                  user={user}
                  rooms={rooms}
                  onNewRoom={(newRoom) => {
                    newRoomHandler(newRoom);
                  }}
                  isOnline={onlineUsers.some(
                    (onlineUser) => onlineUser.userId === user._id
                  )}
                />
              </div>
            ))}
          </MDBTypography>
        </MDBCard>
      </Tab>
    </Tabs>
  );
};

export default SideBar;
// useEffect(() => {
// const initialTab = rooms.length === 0 ? "users" : "conversations";
// setTab(initialTab);
// }, [rooms.length]);
