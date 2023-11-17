import React from "react";
import Room from "./Room/Room";

const Rooms = ({
  rooms,
  currentRoom,
  deleteRoomHandler,
  friends,
  onlineUsers,
  messagesPreview,
  unseenMessages,
  setCurrentRoom,
  setMainWindowContent,
  updateMessagesStatus,
  setIsBarVisible,
}) => {
  const clickRoomHandler = (room) => {
    setCurrentRoom(room);
    updateMessagesStatus(room._id);
    setMainWindowContent("conversation");
    setIsBarVisible(false);
  };

  return (
    <>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div key={room._id}>
            <Room
              clickRoomHandler={(room) => clickRoomHandler(room)}
              room={room}
              currentRoom={currentRoom}
              deleteRoomHandler= {deleteRoomHandler}
              friend={friends?.find((friend) =>
                room.members?.includes(friend._id)
              )}
              onlineUsers={onlineUsers}
              messagePreview={messagesPreview.filter(
                (message) => message?.roomId === room?._id
              )}
              unseenMessages={unseenMessages.filter(
                (message) => message.roomId === room._id
              )}
            />
          </div>
        ))}
    </>
  );
};

export default Rooms;
