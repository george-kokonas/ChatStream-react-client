import Room from "./Room/Room";

const Rooms = ({
  currentUser,
  rooms,
  currentRoom,
  onSelectRoom,
  setCurrentRoom,
  navUnreadMessages,
  messages,
  instantMessage,
}) => {
  return (
    <div>
      {rooms.length &&
        rooms.map((room) => (
          <div
            onClick={() => {
              setCurrentRoom(room);
              onSelectRoom(room);
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
