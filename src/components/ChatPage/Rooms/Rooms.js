import React from "react";
import Room from "./Room/Room";

const Rooms = ({
  currentUser,
  rooms,
  currentRoom,
  setCurrentRoom,
  setNavSelection,
  setHiddentElement,
  messagesPreview,
}) => {
  return (
    <div>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div
            onClick={() => {
              setCurrentRoom(room);
              setNavSelection();
              setHiddentElement();
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
            />
          </div>
        ))}
    </div>
  );
};

export default Rooms;
