import { useEffect, useState } from "react";
import axios from "axios";

const Rooms = ({ chatroom, loggedUser }) => {
  const [friend, setFriend] = useState(null)

  useEffect(() => {
    const friendId = chatroom.members.find((memberId) => memberId !== loggedUser._id);

    //prevent the user from starting a conversation for second time with same friend
    if(!friendId) return;
    
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
  
  return(
    <li
    className="p-2 border-bottom"
    style={{ backgroundColor: "#eee" }}
  >
    <a href="#!" className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
          alt="avatar"
          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
          width="60"
        />
        <div className="pt-1">
          <p className="fw-bold mb-0">{friend && friend.username}</p>
          <p className="small text-muted">
            Hello, Are you there?
          </p>
        </div>
      </div>
      <div className="pt-1">
        <p className="small text-muted mb-1">Just now</p>
        <span className="badge bg-danger float-end">1</span>
      </div>
    </a>
  </li>
  )
};

export default Rooms;
