import { useEffect, useRef } from "react";

import Message from "./Message/Message";

const Messages = ({ loggedUser, messages }) => {
  const scrollToEnd = useRef();

  //SCROLL TO THE END OF PAGE WHEN A NEW MESSAGE ARRIVES
  useEffect(() => {
    scrollToEnd.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div id='message'>
      {!messages.length ? (
        <p>Nothing to show... Initiate a chat!</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} ref={scrollToEnd}>
            <Message message={msg} sentByMe={msg.senderId === loggedUser._id} />
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
