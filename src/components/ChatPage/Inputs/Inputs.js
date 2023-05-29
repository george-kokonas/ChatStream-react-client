import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import getAuthHeaders from "../../helpers/authHeaders";
import { initiateSocket, getSocket } from "../socket/Socket";

const Inputs = ({ currentUser, currentRoom, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const socket = useRef();

  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();

    const receiverId = currentRoom.members.find(
      (member) => member !== currentUser._id
    );

    setReceiverId(receiverId);
  }, [currentRoom.members, currentUser._id]);

  const inputChangeHandler = (event) => {
    setNewMessage(event.target.value);

    //emmit user is typing signal
    socket.current.emit("userTyping", {
      senderUsername: currentUser.username,
      receiverId: receiverId,
      currentRoomId: currentRoom._id,
    });
  };

  const submitMessageHandler = async (event) => {
    event.preventDefault();

    const enteredMessage = newMessage.trim();
    if (!enteredMessage) return;

    const messageId = uuidv4();

    const message = {
      _id: messageId,
      roomId: currentRoom._id,
      senderId: currentUser._id,
      receiverId: receiverId,
      text: newMessage,
      isSeen: false,
      createdAt: Date.now(),
    };

    //executed when instant message is sent
    socket.current.emit("sendMessage", message);

    //send message to server
    try {
      const { data } = await axios.post(
        "http://localhost:8000/chat/createMessage/",
        message,
        getAuthHeaders()
      );
      onNewMessage(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      alert("Unable to send message...");
    }
  };

  return (
    <form onSubmit={submitMessageHandler}>
      <div className='text-muted d-flex justify-content-start align-items-center'>
        <input
          onChange={(event) => inputChangeHandler(event)}
          type='text'
          value={newMessage}
          className='form-control form-control-lg'
          placeholder='Type message'
        />
        <button
          type='submit'
          className='btn btn-link ms=0'
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <i className='fas fa-paper-plane'></i>
        </button>
      </div>
    </form>
  );
};
export default Inputs;
