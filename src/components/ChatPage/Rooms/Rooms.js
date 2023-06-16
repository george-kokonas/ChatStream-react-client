import React from "react";
import Room from "./Room/Room";

const Rooms = ({
  currentUser,
  rooms,
  currentRoom,
  setCurrentRoom,
  messages,
  instantMessage,
  navUnreadMessages,
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
              navUnreadMessages={navUnreadMessages}
              instantMessage={
                instantMessage?.roomId === room._id && instantMessage
              }
              userMessages={messages.filter(
                (message) => message.roomId === currentRoom?._id
              )}
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
