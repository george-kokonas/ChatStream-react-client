import { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import "./chatWindow.css";
const ChatWindow = () => {
  const [rooms, setRooms] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/chat/getChatRoom/${user._id}`
        );
        setRooms(data);
      } catch (error) {
        //add decent error handling
        console.log(error);
        alert("Error fetching data");
      }
    };
    getRooms();
  }, [user._id]);

  return (
    <>
      <Topbar />
      <div className='chatContainer'>
        {/* LEFT BAR */}
        <div className='chatMenu'>
          <div className='wrapper-menu'>
            ---------ROOMS--------
            {rooms.map((room) => (
              <Rooms chatroom={room} loggedUser={user} key={room._id} />
            ))}
          </div>
        </div>

        {/* MAIN PAGE */}
        <div className='message-window'>
          <div className='wrapper-message-window'>
            <div className='message'>------MESSAGES-------</div>
            <div className='wrapper-input'>
              <input
                className='userMessage-Input'
                type='text'
                placeholder='enter your message'
              ></input>
              <button className='sendMessage-Btn'>send</button>
            </div>
          </div>
        </div>

        {/* RIGHT PART */}
        <div className='onlineUsers'>
          <div className='wrapper-onlineUsers'>----ONLINE USERS---------</div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
