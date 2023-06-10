import User from "./User/User"

const AllUsers = ({allUsers,currentUser,onlineUsers, rooms, setRooms, setCurrentRoom , onSelectRoom}) => {

    const handleSelectUserClick = (user) => {
        //prevent actions if user clicks on himself
        if (user._id === currentUser._id) return;
    
        //find the conversation with the selected user
        const room = rooms.find((room) => room.members.includes(user._id));
    
        //if no conversation yet, return
        if (!room) return;
    
        //set conversation with selected user
        setCurrentRoom(room);
    
        //pass conversation to ChatPage.js
        onSelectRoom(room);
      };

      const newRoomHandler = (newRoom) => {
        //update conversations(rooms) array
      
        setRooms(newRoom);
    
        //set new conversation as current
        setCurrentRoom(newRoom);
    
        //pass conversation to ChatPage.js
        onSelectRoom(newRoom);
      };

    return (<>
    {allUsers?.map((user) => (
        <div onClick={() => handleSelectUserClick(user)}  key={user._id}>
          <User
            currentUser={currentUser}
            user={user}
            rooms={rooms}
            onNewRoom={(newRoom) => {
              newRoomHandler(newRoom);
            }}
            isOnline={onlineUsers.some(
              (onlineUser) => onlineUser.userId === user._id
            )}
          />
        </div>
      ))}
    
    </>)

}

export default AllUsers