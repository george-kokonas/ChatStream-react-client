import axios from "axios";
import API_URL from "../../../helpers/config";
import getAuthHeaders from "../../../helpers/authHeaders";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./AllUsers.css";
import userCard from "../Sidebar.module.css";
import defaultUserIcon from "../../../../assets/defaultUserIcon.png";

const RegisteredUsers = ({ currentUser, user, isOnline, rooms, onNewRoom }) => {
  //CREATE NEW ROOM WITH SELECTED USER FROM USERS LIST
  const newRoomHandler = async () => {
    //only allow chat with users that haven't started converstation yet
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].members.includes(user._id)) return;
    }

    //prevent user from starting a conversation with himself
    if (user._id === currentUser._id) {
      return;
    }

    const room = {
      senderId: currentUser._id,
      receiverId: user._id,
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/chat/createChatRoom/`,
        room,
        getAuthHeaders()
      );
      onNewRoom(data);
    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  return (
    <li className='card p-2 mb-1'  style={{backgroundColor:"#fbfbfbed"}}>
      <a href='#!' className='d-flex justify-content-between '>
        <div className='d-flex flex-row'>
          <img
            src={user.profileImage || defaultUserIcon}
            alt='avatar'
            className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
            width='50'
            height='50'
          />
          <div onClick={newRoomHandler} className='pt-1'>
            <p className={userCard.card}>{user.username}</p>
            <p className='small text-muted'>{user.profileInfo}</p>
          </div>
        </div>
        <div className='pt-1'>
          <p className='small text-muted mb-1'>
            <FontAwesomeIcon
              icon={faCircle}
              style={isOnline ? { color: "green" } : { color: "#AA0000" }}
            />{" "}
          </p>
        </div>
      </a>
    </li>
  );
};

export default RegisteredUsers;
