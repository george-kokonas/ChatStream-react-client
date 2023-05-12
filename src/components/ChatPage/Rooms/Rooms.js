import { useEffect, useState } from "react";
import axios from "axios";
import "./rooms.css";

const Rooms = ({ chatroom, loggedUser }) => {
  const [receiver, setReceiver] = useState(null)

  useEffect(() => {
    const receiverId = chatroom.members.find((memberId) => memberId !== loggedUser._Id);
    
    const getReceiver = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user/getUser/${receiverId}`
        );
        setReceiver(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching users...");
      }
    };
    getReceiver();
  }, [ loggedUser,chatroom]);

  return (<div className='room-container'>{receiver && receiver.username + " - " +loggedUser.username}</div>);
};

export default Rooms;
