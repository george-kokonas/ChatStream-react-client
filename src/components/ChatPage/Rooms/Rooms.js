import { useEffect, useState } from "react";
import axios from "axios";
import "./rooms.css";

const Rooms = ({ chatroom, loggedUser }) => {
  const [friend, setFriend] = useState(null)

  useEffect(() => {
    const friendId = chatroom.members.find((memberId) => memberId !== loggedUser._id);

    const getFriend = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user/getUser/${friendId}`
        );
        setFriend(data);
      } catch (error) {
        console.log(error);
        alert("Error fetching users...");
      }
    };
    getFriend();
  }, [ loggedUser,chatroom]);

  return (<div className='room-container'>{friend && friend.username}</div>);
};

export default Rooms;
