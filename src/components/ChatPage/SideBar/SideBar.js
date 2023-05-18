import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RegisteredUsers from "./RegisteredUsers/RegisteredUsers";
import Rooms from "./Rooms/Rooms";
import { MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";

const SideBar = ({
  rooms,
  currentRoom,
  registeredUsers,
  onlineUsers,
  onSelectRoom,
  onNewRoom,
  loggedUser,
}) => {
  const [tab, setTab] = useState("conversations");

  useEffect(() => {
    if (!currentRoom && rooms.length > 0) {
      onSelectRoom(rooms[rooms.length - 1]);
    }
  }, [currentRoom, rooms, onSelectRoom]);

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
        <Tab eventKey='allUsers' title='Users'>
          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className='mb-0'>
                {registeredUsers.map((registeredUser) => (
                  <RegisteredUsers
                    registeredUser={registeredUser}
                    rooms={rooms}
                    onNewRoom={onNewRoom}
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
