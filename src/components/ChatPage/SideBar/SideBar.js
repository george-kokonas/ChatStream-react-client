import React, { useState, useEffect } from "react";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RegisteredUsers from "./RegisteredUsers/RegisteredUsers";
import Rooms from "./Rooms/Rooms";
import { MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";

const SideBar = ({
  loggedUser,
  onlineUsers,
  currentRoom,
  messages,
  instantMessage,
  onSelectRoom,
  onNewRoom,
}) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState(rooms.length ? "conversations" : "users");

  //SET LAST CONVERSATION AS CURRENT TO DISPLAY IT ON LOAD
  // useEffect(() => {
  //   if (!currentRoom && rooms.length > 0) {
  //     onSelectRoom(rooms[rooms.length - 1]);
  //   }
  // }, [currentRoom, rooms, onSelectRoom]);

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES TO OPEN A NEW ROOM
  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${loggedUser._id}`
        );
        setRooms(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [loggedUser._id, instantMessage]);
  console.log(rooms);
  //GET REGISTERED USERS LIST
  useEffect(() => {
    const getRegisteredUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );
      setRegisteredUsers(data);
    };
    getRegisteredUsers();
  }, [loggedUser._id]);

  return (
    <>
      <Tabs
        id='controlled-tab-example'
        activeKey={tab}
        onSelect={(selectedTab) => setTab(selectedTab)}
        className='mb-3'
      >
        {/* CONVERSATIONS TAB */}
        <Tab eventKey='conversations' title='Conversations'>
          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className='mb-0'>
                {rooms.length ? (
                  rooms.map((room) => (
                    <div onClick={() => onSelectRoom(room)} key={room._id}>
                      <Rooms
                        chatroom={room}
                        loggedUser={loggedUser}
                        currentRoom={currentRoom}
                        messages={messages}
                        instantMessage={instantMessage}
                      />
                    </div>
                  ))
                ) : (
                  <p>no conversations yet...</p>
                )}
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </Tab>

        {/* REGISTERED USERS TAB */}
        <Tab eventKey='users' title='Users'>
          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className='mb-0'>
                {registeredUsers.map((registeredUser) => (
                  <RegisteredUsers
                    loggedUser={loggedUser}
                    registeredUser={registeredUser}
                    rooms={rooms}
                    onNewRoom={(room) => setRooms([...rooms, room])}
                    isOnline={onlineUsers.some(
                      (onlineUser) => onlineUser.userId === registeredUser._id
                    )}
                    key={registeredUser._id}
                  />
                ))}
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </Tab>
      </Tabs>
    </>
  );
};

export default SideBar;
