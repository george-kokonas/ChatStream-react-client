import Messages from "./Messages/Messages";
import TypingIndicator from "./TypingIndicator/TypingIndicator";
import Inputs from "./Inputs/Inputs";

const Conversation = ({
  currentUser,
  allUsers,
  currentRoom,
  messages,
  onNewMessage,
  socket,
}) => {
  return (
    <>
      <Messages
        currentUser={currentUser}
        allUsers={allUsers}
        currentRoom={currentRoom}
        messages={messages.filter(
          (message) => message.roomId === currentRoom?._id
        )}
      />

      <TypingIndicator currentRoom={currentRoom} socket={socket} />

      <Inputs
        currentUser={currentUser}
        onNewMessage={onNewMessage}
        currentRoom={currentRoom}
        socket={socket}
      />
    </>
  );
};

export default Conversation;
