import Room from "./Room/Room";

const Rooms = ({
  currentUser,
  rooms,
  currentRoom,
  setCurrentRoom,
  navUnreadMessages,
  messages,
  instantMessage,
  setNavSelection,
  setLastNavSelection,
  setLastVisitedRoom
}) => {
  return (
    <div>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div
            onClick={() => {
              setCurrentRoom(room);
              setNavSelection();
              setLastNavSelection();
              setLastVisitedRoom(room)
            }}
            key={room._id}
          >
            <Room
              currentUser={currentUser}
              room={room}
              currentRoom={currentRoom}
              navUnreadMessages={navUnreadMessages}
              instantMessage={instantMessage}
              userMessages={messages.filter(
                (message) => message.roomId === currentRoom?._id
              )}
            />
          </div>
        ))}
    </div>
  );
};

export default Rooms;
