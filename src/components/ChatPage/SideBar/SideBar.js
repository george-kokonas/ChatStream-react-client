import React, { useState, useEffect } from "react";
import axios from "axios";

import RegisteredUsers from "./RegisteredUsers/RegisteredUsers";
import Rooms from "./Rooms/Rooms";
import API_URL from "../../helpers/config"
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
  currentRoom,
  messages,
  instantMessage,
  onSelectRoom,
}) => {
  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState("conversations");

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES TO OPEN A NEW ROOM

  // SET LAST CONVERSATION AS CURRENT TO DISPLAY IT ON LOAD
  // useEffect(() => {
  //   if (!currentRoom && rooms.length > 0) {
  //     onSelectRoom(rooms[rooms.length - 1]);
  //   }
  // }, [currentRoom, rooms, onSelectRoom]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/chat/getChatRoom/${currentUser._id}`,getAuthHeaders()
        );
        setRooms(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [currentUser._id, instantMessage]);

  return (
    <Tabs
      activeKey={tab}
      onSelect={(selectedTab) => setTab(selectedTab)}
      className='mt-3'
    >
      {/* CONVERSATIONS TAB */}
      <Tab eventKey='conversations' title='Conversations' className='mt-2 mb-1'>
        <MDBCard className={styles.cards}>
          <MDBTypography listUnStyled className='mb-0'>
            {rooms.length ? (
              rooms.map((room) => (
                <div onClick={() => onSelectRoom(room)} key={room._id}>
                  <Rooms
                    currentUser={currentUser}
                    room={room}
                    currentRoom={currentRoom}
                    userMessages={messages.filter(
                      (message) => message.roomId === currentRoom?._id
                    )}
                    instantMessage={instantMessage}
                  />
                </div>
              ))
            ) : (
              <p>no conversations yet...</p>
            )}
          </MDBTypography>
        </MDBCard>
      </Tab>

      {/* REGISTERED USERS TAB */}
      <Tab eventKey='users' title='Users' className='mt-2 mb-1'>
        <MDBCard className={styles.cards}>
          <MDBTypography listUnStyled className='mb-0'>
            {allUsers?.map((user) => (
              <RegisteredUsers
                currentUser={currentUser}
                user={user}
                rooms={rooms}
                onNewRoom={(room) => setRooms([...rooms, room])}
                isOnline={onlineUsers.some(
                  (onlineUser) => onlineUser.userId === user._id
                )}
                key={user._id}
              />
            ))}
          </MDBTypography>
        </MDBCard>
      </Tab>
    </Tabs>
  );
};

export default SideBar;
