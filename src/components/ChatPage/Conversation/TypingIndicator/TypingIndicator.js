import React, { useState, useEffect } from "react";
import styles from "./TypingIndicator.module.scss";

const TypingIndicator = ({ currentRoom, socket }) => {
  const [isTyping, setIsTyping] = useState({
    typingNow: false,
    username: "",
  });

  useEffect(() => {
    const handleIsTyping = ({ currentRoomId, senderUsername }) => {
      //allow typing indicator to appears in the correct conversation
      if (!currentRoom || currentRoomId !== currentRoom._id) return;

      //set timer interval
      const typingTimeout = 1400;
      let typingTimer;

      clearTimeout(typingTimer);

      //update typing state
      setIsTyping((prevState) => ({
        ...prevState,
        typingNow: true,
        username: senderUsername,
      }));

      //set indicator state to false at chosen interval
      typingTimer = setTimeout(() => {
        setIsTyping((prevState) => ({
          ...prevState,
          typingNow: false,
        }));
      }, typingTimeout);
    };

    socket.on("isTyping", handleIsTyping);

    //unsubscribe from event
    return () => {
      socket.off("isTyping", handleIsTyping);
    };
  }, [currentRoom, socket]);

  return (
    <div className={styles.typingIndicator}>
      {isTyping.typingNow && <p className={styles.indicatorText}>{isTyping.username} is typing...</p>}
    </div>
  );
};

export default TypingIndicator;
