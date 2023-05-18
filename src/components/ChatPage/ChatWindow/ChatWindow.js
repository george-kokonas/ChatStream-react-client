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
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tab, setTab] = useState("conversations");

  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useRef();
  const scrollToEnd = useRef();

  let typingTimer;
  const typingTimeout = 1000;

  //TRIGGERED WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    //executed when new instant message arrives
    socket.current.on("getMessage", (data) => {
      setInstantMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //TRIGGERED ON USER LOGIN
  useEffect(() => {
    //add user to onlineUsers array on socket server
    socket.current.emit("addUser", user._id);

    //get online users
    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    //get all registered users from database
    const getRegisteredUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:8000/user/getRegisteredUsers"
      );

      setRegisteredUsers(data);
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

  //TRIGGERED WHEN USER LOGS IN OR A NEW MESSAGE ARRIVES AND OPEN A NEW ROOM
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

  //SCROLL TO THE END OF PAGE WHEN A NEW MESSAGE ARRIVES
  useEffect(() => {
    scrollToEnd.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  //CREATE NEW CHATROOM TO INITIATE CONVERSATION WITH SELECTED USER
  const newRoomHandler = async (selectedUserId) => {
    //prevent the user from starting a conversation with himself
    if (selectedUserId === user._id) {
      return;
    }

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

  // TRIGGERED WHEN USER LOGS OUT TO UPDATE ONLINE USERS ARRAY
  const disconnectSocketHandler = () => {
    socket.current.emit("logout", socket.current.id);
  };

  //TRIGGERED WHEN USER IS TYPING A NEW MESSAGE
  const isTypingHandler = () => {
    const receiverId = currentRoom.members.find(
      (member) => member !== user._id
    );

    clearTimeout(typingTimer);

    socket.current.on("isTyping", (data) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, typingTimeout);
    });

    socket.current.emit("userTyping", {
      senderId: user._id,
      receiverId: receiverId,
    });
  };

  //SUBMIT MESSAGE
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
    <>
      <Topbar
        onUserChangeState={onUserChangeState}
        onDisconnectSocket={disconnectSocketHandler}
      />
      <div className='chat-container'>
        <MDBContainer fluid className='py-4'>
          <MDBRow>
            {/*LEFT-SIDE BAR  */}
            <MDBCol
              id='left-bar-container'
              md='6'
              lg='5'
              xl='4'
              className='mb-4 mb-md-0'
            >
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
                          !currentRoom ? (
                            setCurrentRoom(rooms[rooms.length - 1])
                          ) : (
                            rooms.map((room) => (
                              <div
                                onClick={() => setCurrentRoom(room)}
                                key={room._id}
                              >
                                <Rooms
                                  chatroom={room}
                                  loggedUser={user}
                                  currentRoom={currentRoom}
                                />
                              </div>
                            ))
                          )
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
                            onNewConversation={newRoomHandler}
                            isOnline={onlineUsers.some(
                              (onlineUser) =>
                                onlineUser.userId === registeredUser._id
                            )}
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
            <MDBCol className='chat-window-container'>
              <MDBTypography listUnStyled>
                {currentRoom ? (
                  <>
                    <div id='message'>
                      {/* !messages.length ? setMessages(messages[messages.length-1]) : */}
                      {!messages.length ? (
                        <p>Nothing to show... Initiate a chat!</p>
                      ) : (
                        messages.map((msg, index) => (
                          <div key={index} ref={scrollToEnd}>
                            <Messages
                              message={msg}
                              sentByMe={msg.senderId === user._id}
                            />
                          </div>
                        ))
                      )}
                    </div>

                    {/* INPUTS */}
                    <li id='chat-window-inputs' className='bg-white mb-3'>
                      {isTyping && <p>user is typing...</p>}
                      {/* TEXT FIELD */}
                      <MDBTextArea
                        label='Message'
                        id='textAreaExample'
                        rows={4}
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        onKeyDown={isTypingHandler}
                      />
                      {/* SEND BUTTON */}
                      <MDBBtn
                        onClick={submitMessageHandler}
                        color='info'
                        rounded
                        className='float-end mt-2'
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
    </>
  );
};

export default ChatWindow;
