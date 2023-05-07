import { useState,useEffect } from "react";
import axios from "axios";
import Topbar from "../Topbar/Topbar";
import Rooms from "../Rooms/Rooms";
import "./chatWindow.css";
const ChatWindow = () => {  
  const [rooms,setRooms] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(()=>{
    const getRooms = async() =>{
      const {data}= await axios.get(`http://localhost:8000/chat/getChatRoom/${user._id}`);
      setRooms(data)
    }
    getRooms()
  },[user._id])
  return (
    <>
      <Topbar />
      <div className='chatContainer'>
        <div className='chatMenu'>
          <div className='wrapper-menu'>menu</div>
        </div>
        <div className='message-window'>
          <div className='wrapper-message-window'>
            <div className='message'>
            </div>
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
        <div className='onlineUsers'>
          <div className='wrapper-onlineUsers'>online users</div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
