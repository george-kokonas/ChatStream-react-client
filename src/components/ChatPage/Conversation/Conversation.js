import Messages from "./Messages/Messages";
import TypingIndicator from "./TypingIndicator/TypingIndicator";
import Inputs from "./Inputs/Inputs";

import styles from "./Conversation.module.scss";

const Conversation = ({
  currentUser,
  allUsers,
  currentRoom,
  messages,
  onNewMessage,
  socket,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div>
          <Messages
            currentUser={currentUser}
            allUsers={allUsers}
            currentRoom={currentRoom}
            messages={messages.filter(
              (message) => message.roomId === currentRoom?._id
            )}
          />
        </div>

        <div className={styles.typingIndicator}>
          <TypingIndicator currentRoom={currentRoom} socket={socket} />
        </div>
      </div>

      <div>
        <Inputs
          currentUser={currentUser}
          onNewMessage={onNewMessage}
          currentRoom={currentRoom}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Conversation;
