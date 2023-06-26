import React from "react";
import Room from "./Room/Room";

const Rooms = ({
  rooms,
  currentRoom,
  friends,
  onlineUsers,
  messagesPreview,
  unseenMessages,
  setCurrentRoom,
  setMainWindowContent,
  updateMessagesStatus,
  setIsBarVisible,
}) => {
  return (
    <>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div
            onClick={() => {
              setCurrentRoom(room);
              updateMessagesStatus(room._id);
              setMainWindowContent("conversation");
              setIsBarVisible(false);
            }}
            key={room._id}
          >
            <Room
              room={room}
              currentRoom={currentRoom}
              friend={friends.find((friend) =>
                room.members.includes(friend._id)
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
