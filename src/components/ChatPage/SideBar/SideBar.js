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
  const [tab, setTab] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(()=>{
    const initialTab = rooms.length === 0 ? "users" : "conversations"
    setTab(initialTab)
  },[rooms.length])

  //TOO BAD - FIND ANOTHER WAY
  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES TO OPEN A NEW ROOM
  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getChatRoom/${currentUser._id}`,
          getAuthHeaders()
        );
        setRooms(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [currentUser._id, instantMessage]);

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
