import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { initiateSocket, getSocket } from "../socket/Socket";
import { MDBTextArea, MDBBtn } from "mdb-react-ui-kit";

const Inputs = ({ loggedUser, currentRoom, onNewMessage, onTyping }) => {
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();

  useEffect(() => {
    initiateSocket();
    socket.current = getSocket();
  }, []);

  const submitMessageHandler = async (event) => {
    event.preventDefault();

    const messageId= uuidv4();

    const receiverId = currentRoom.members.find(
      (member) => member !== loggedUser._id
    );
    const message = {
      _id : messageId,
      roomId: currentRoom._id,
      senderId: loggedUser._id,
      receiverId :receiverId,
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
        message
      );
      onNewMessage(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      alert("Unable to send message...");
    }
  };

  return (
    <>
      <MDBTextArea
        label='Message'
        id='textAreaExample'
        rows={4}
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        onKeyDown={onTyping}
      />

      <MDBBtn
        onClick={submitMessageHandler}
        color='info'
        rounded
        className='float-end mt-2'
      >
        Send
      </MDBBtn>
    </>
  );
};
export default Inputs;
