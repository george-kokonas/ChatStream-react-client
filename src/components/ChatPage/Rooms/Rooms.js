import React from "react";
import Room from "./Room/Room";

const Rooms = ({
  currentUser,
  rooms,
  currentRoom,
  setCurrentRoom,
  setNavSelection,
  messagesPreview,
  unseenMessages,
  updateMessagesStatus,
}) => {


  return (
    <div>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div
            onClick={() => {
              setNavSelection();
              setCurrentRoom(room);
              updateMessagesStatus(room._id);
            }}
            key={room._id}
          >
            <Room
              currentUser={currentUser}
              room={room}
              currentRoom={currentRoom}
              messagePreview={messagesPreview.filter(
                (message) => message?.roomId === room?._id
              )}
              unseenMessages={unseenMessages.filter(
                (message) => message.roomId === room._id
              )}
            
            />
          </div>
        ))}
    </div>
  );
};

export default Rooms;
