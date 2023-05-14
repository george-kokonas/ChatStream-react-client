import React, { useState, useEffect, useRef } from "react";
import { initiateSocket, getSocket } from "../socket/Socket";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import Messages from "../Messages/Messages";
import RegisteredUsers from "../RegisteredUsers/RegisteredUsers";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "./chatWindow.css";

const ChatWindow = ({ onUserChangeState }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [instantMessage, setInstantMessage] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [tab, setTab] = useState("conversations");

  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useRef();

  //TRIGGERED WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    //initialize socket
    initiateSocket();
    socket.current = getSocket();

    //executed when new instant message arrives
    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        sender: data.senderId,
        text: data.text,
      });
    });
  }, []);

  //TRIGGERED ON USER LOGIN
  useEffect(() => {
    //add user to onlineUsers array on socket server
    socket.current.emit("addUser", user._id);

    //get online users from onlineUsers array on socket server
    socket.current.on("getUsers", (users) => {});

    //get all registered users from onlineUsers array on socket server
    const getRegisteredUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );
      //exclude logged in user from registeredUsers array
      const filteredUsers = data.filter(
        (registeredUser) => registeredUser._id !== user._id
      );
      setRegisteredUsers(filteredUsers);
    };
    getRegisteredUsers();
  }, [user._id]);

  //TRIGGERED WHEN INSTANT MESSAGE ARRIVES OR USER SELECTS A ROOM
  useEffect(() => {
    if (
      instantMessage &&
      currentRoom?.members.includes(instantMessage.sender)
    ) {
      setMessages((prev) => [...prev, instantMessage]);
    }
  }, [instantMessage, currentRoom]);

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES TO OPEN A  NEW ROOM
  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${user._id}`
        );
        setRooms(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [user._id, instantMessage]);

  //TRIGGERED WHEN USER SELECTS A ROOM
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getMessages/${currentRoom?._id}`
        );
        setMessages(data);
      } catch (error) {
        alert("Error fetching data");
        console.log(error);
      }
    };

    getMessages();
  }, [currentRoom]);

  //CREATE NEW CHATROOM TO INITIATE CONVERSATION WITH SELECTED USER
  const newRoomHandler = async (selectedUserId) => {
    const room = {
      senderId: user._id,
      receiverId: selectedUserId,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createChatRoom/",
        room
      );
      setRooms([...rooms, data]);
    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  //SUBMIT THE MESSAGE
  const submitMessageHandler = async (event) => {
    event.preventDefault();

    const message = {
      roomId: currentRoom._id,
      senderId: user._id,
      text: newMessage,
    };

    const receiverId = currentRoom.members.find(
      (member) => member !== user._id
    );

    //executed when instant message is sent
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    });

    //send message to server
    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createMessage/",
        message
      );
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      alert("Unable to send message...");
    }
  };

  return (
    <div className='chat-container'>
      <Topbar onUserChangeState={onUserChangeState}/>
      <MDBContainer fluid className='py-5' >
        <MDBRow>
          {/* TABS ON LEFT BAR  */}
          <MDBCol md='6' lg='5' xl='4' className='mb-4 mb-md-0'>
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
                      {rooms.map((room) => (
                        <div
                          onClick={() => setCurrentRoom(room)}
                          key={room._id}
                        >
                          <Rooms chatroom={room} loggedUser={user} />
                        </div>
                      ))}
                    </MDBTypography>
                  </MDBCardBody>
                </MDBCard>
              </Tab>

              {/* REGISTERED USERS TAB */}
              <Tab eventKey='allUsers' title='All Users'>
                <MDBCard>
                  <MDBCardBody>
                    <MDBTypography listUnStyled className='mb-0'>
                      {registeredUsers.map((registeredUser) => (
                        <RegisteredUsers
                          loggedUser={user}
                          registeredUser={registeredUser}
                          rooms={rooms}
                          onNewConversation={newRoomHandler}
                          key={registeredUser._id}
                        />
                      ))}
                    </MDBTypography>
                  </MDBCardBody>
                </MDBCard>
              </Tab>
            </Tabs>

            {/* <h5 className='font-weight-bold mb-3 text-center text-lg-start'>
              CONVERSATIONS
            </h5> */}
          </MDBCol>

          {/* CHAT WINDOW */}
          <MDBCol id="chat-window-container" md='6' lg='7' xl='8'>
            <MDBTypography listUnStyled>
              {currentRoom ? (
                <>
                  <div id='message'>
                    {messages.map((msg, index) => (
                      <Messages
                        message={msg}
                        sentByMe={msg.senderId === user._id}
                        key={index}
                      />
                    ))}
                  </div>

                  {/* TEXT FIELD */}
                  <li id="chat-window-inputs" className='bg-white mb-3' >
                    <MDBTextArea
                      label='Message'
                      id='textAreaExample'
                      rows={4}
                      value={newMessage}
                      onChange={(event) => setNewMessage(event.target.value)}
                    />
                       {/* SEND BUTTON */}
                  <MDBBtn
                    onClick={submitMessageHandler}
                    color='info'
                    rounded
                    className='float-end'
                  >
                    Send
                  </MDBBtn>
                  </li>

               
                </>
              ) : (
                <p>select room</p>
              )}
            </MDBTypography>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ChatWindow;
