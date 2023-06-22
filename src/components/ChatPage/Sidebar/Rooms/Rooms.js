import React from "react";
import Room from "./Room/Room";

import styles from "./Rooms.module.scss";

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
}) => {
  return (
    <>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div
            className={styles.container}
            onClick={() => {
              setCurrentRoom(room);
              updateMessagesStatus(room._id);
              setMainWindowContent("conversation");
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
