import { useState, useEffect, useRef } from "react";
import { initiateSocket, getSocket } from "../socket/Socket";
import axios from "axios";
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

    const message = {
      roomId: currentRoom._id,
      senderId: loggedUser._id,
      text: newMessage,
    };

    const receiverId = currentRoom.members.find(
      (member) => member !== loggedUser._id
    );

    //executed when instant message is sent
    socket.current.emit("sendMessage", {
      senderId: loggedUser._id,
      receiverId: receiverId,
      text: newMessage,
    });

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
