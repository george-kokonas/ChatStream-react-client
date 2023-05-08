import { useEffect, useState } from "react";
import axios from "axios";
import "./rooms.css";

const Rooms = ({ chatroom, loggedUser }) => {
  const [receiver, setReceiver] = useState({});
  const { members } = chatroom;
  const { _id: loggedUserId } = loggedUser;

  // console.log(loggedUserId);

  useEffect(() => {
    const receiverId = members.filter((memberId) => memberId !== loggedUserId);

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
  }, [chatroom, loggedUser, loggedUserId, members]);

  return <div className='room-container'>{receiver.email}</div>;
};

export default Rooms;
