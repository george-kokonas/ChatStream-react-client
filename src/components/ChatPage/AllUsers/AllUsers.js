import axios from "axios";

import User from "./User/User";

import API_URL from "../../helpers/config";
import getAuthHeaders from "../../helpers/authHeaders";

const AllUsers = ({
  allUsers,
  currentUser,
  onlineUsers,
  rooms,
  setRooms,
  setCurrentRoom,
  setLastVisitedRoom,
  setNavSelection,
  setLastNavSelection,
}) => {
  const newRoomHandler = async (selectedUser) => {
    //prevent user from starting a conversation with himself
    if (selectedUser._id === currentUser._id) {
      return;
    }

    //only allow chat with users that haven't started converstation yet
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].members.includes(selectedUser._id)) {
        setNavSelection();
        setCurrentRoom(rooms[i]);
        setLastVisitedRoom(rooms[i])
        setLastNavSelection()
        return;
      }
    }

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

      //set new Room as last visited
      setLastVisitedRoom(data)

      //open conversations list
      setNavSelection();

      //set last selection 
      setLastNavSelection()



    } catch (error) {
      console.log(error);
      alert("Unable to start new conversation...");
    }
  };

  return (
    <>
      {allUsers?.map((user) => (
        <div key={user._id}>
          <User
            currentUser={currentUser}
            user={user}
            rooms={rooms}
            newRoomHandler={newRoomHandler}
            isOnline={onlineUsers.some(
              (onlineUser) => onlineUser.userId === user._id
            )}
          />
        </div>
      ))}
    </>
  );
};

export default AllUsers;

//   const handleSelectUserClick = (user) => {
//   //prevent actions if user clicks on himself
//   if (user._id === currentUser._id) return;

//   //find the conversation with the selected user
//   const room = rooms.find((room) => room.members.includes(user._id));

//   //if no conversation yet, return
//   if (!room) return;

//   //set conversation with selected user
//   setCurrentRoom(room);

//   //pass conversation to ChatPage.js
//   onSelectRoom(room);
// };
