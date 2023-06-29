import axios from "axios";

import User from "./User/User";

import API_URL from "../../../helpers/config";
import getAuthHeaders from "../../../helpers/authHeaders";

const AllUsers = ({
  currentUser,
  users,
  onlineUsers,
  rooms,
  setRooms,
  setCurrentRoom,
  setMainWindowContent,
  setIsBarVisible,
  setTab,
}) => {
  const newRoomHandler = async (selectedUser) => {
    
    //prevent user from starting a conversation with himself
    if (selectedUser._id === currentUser._id) {
      return;
    }
    
    //if no chat create room else navigate to chat with clicked user
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].members.includes(selectedUser._id)) {
        setCurrentRoom(rooms[i]);
        setMainWindowContent("conversation");
        setTab("rooms");
        setIsBarVisible(false);
        return;
      }
    }
    // create room
    const room = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/chat/createChatRoom/`,
        room,
        getAuthHeaders()
      );

      //update rooms array (conversations)
      setRooms(data);

      //set new Room as current in ChatPage.js
      setCurrentRoom(data);

      //switch to chats tab
      setTab("rooms");

      //a
      setIsBarVisible(false);

      //open conversations list
    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  return (
    <div>
      {users?.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            newRoomHandler(user);
          }}
        >
          <User
            user={user}
            rooms={rooms}
            isOnline={onlineUsers.some(
              (onlineUser) => onlineUser.userId === user._id
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
