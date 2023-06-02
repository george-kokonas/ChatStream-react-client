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
  currentRoom,
  messages,
  instantMessage,
  onSelectRoom,
  navUnreadMessages,
}) => {
  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState("conversations");

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

  return (
    <Tabs activeKey={tab} onSelect={(selectedTab) => setTab(selectedTab)}>
      {/* CONVERSATIONS TAB */}
      <Tab eventKey='conversations' title='Conversations' className='mt-2 mb-1'>
        <MDBCard className={styles.cards}>
          <MDBTypography listUnStyled className='mb-0'>
            {rooms.length &&
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
                    navUnreadMessages={navUnreadMessages}
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
              <div onClick={() => setTab("conversations")} key={user._id}>
                <AllUsers
                  currentUser={currentUser}
                  user={user}
                  rooms={rooms}
                  onNewRoom={(room) => setRooms([...rooms, room])}
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
