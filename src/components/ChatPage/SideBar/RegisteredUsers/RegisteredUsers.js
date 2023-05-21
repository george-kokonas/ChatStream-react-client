import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const RegisteredUsers = ({
  loggedUser,
  registeredUser,
  isOnline,
  rooms,
  onNewRoom,
}) => {
  
  //CREATE NEW ROOM WITH SELECTED USER FROM REGISTERED USERS LIST
  const newRoomHandler = async () => {
    //only allow chat with users that haven't started converstation yet
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].members.includes(registeredUser._id)) return;
    }

    //prevent the user from starting a conversation with himself
    if (registeredUser._id === loggedUser._id) {
      return;
    }

    const room = {
      senderId: loggedUser._id,
      receiverId: registeredUser._id,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createChatRoom/",
        room
      );
      onNewRoom(data);
    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  return (
    <li className='p-2 border-bottom' style={{ backgroundColor: "#eee" }}>
      <a href='#!' className='d-flex justify-content-between'>
        <div className='d-flex flex-row'>
          <img
            src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp'
            alt='avatar'
            className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
            width='60'
          />
          <div onClick={newRoomHandler} className='pt-1'>
            <p className='fw-bold mb-0'>{registeredUser.username}</p>
            <p className='small text-muted'>some user info maybe...</p>
          </div>
        </div>
        <div className='pt-1'>
          <p className='small text-muted mb-1'>
            <FontAwesomeIcon
              icon={faCircle}
              style={isOnline ? { color: "green" } : { color: "#AA0000" }}
            />{" "}
          </p>
          {/* <span className="badge bg-danger float-end">1</span> */}
        </div>
      </a>
    </li>
  );
};

export default RegisteredUsers;
