import { useState, useEffect, useRef } from "react";
import Message from "./Message/Message";

import "./Messages.css";

const Messages = ({ currentUser, allUsers, currentRoom, messages }) => {
  const [friend, setFriend] = useState(null);
  const scrollToEnd = useRef();

  useEffect(() => {
    const membersIds = currentRoom.members;
    const friendId = membersIds?.find(
      (memberId) => memberId !== currentUser._id
    );
    const friend = allUsers.find((user) => user._id === friendId);
    setFriend(friend);
  }, [currentRoom.members, currentUser._id, allUsers]);

  //SCROLL TO THE END OF PAGE WHEN A NEW MESSAGE ARRIVES
  useEffect(() => {
    scrollToEnd.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div>
      {!messages.length ? (
        <p className='no-messages-message'>
          Nothing to show... <br /> Initiate a chat <br /> with your new friend,{" "}
          {friend?.username}!
        </p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} ref={scrollToEnd}>
            <Message
              currentUser={currentUser}
              friend={friend}
              allUsers={allUsers}
              message={msg}
              sentByMe={msg.senderId === currentUser._id}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
