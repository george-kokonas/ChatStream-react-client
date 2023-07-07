import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/* Initialize socket*/
const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Determine the URL based on the environment
    const url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://chatapp-socket-avrl.onrender.com";

    // Initialize the socket connection
    socketRef.current = io(url);

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef;
};

/* Get Online Users */
export const useOnlineUsers = (socket, setOnlineUsers) => {
  useEffect(() => {

      const socketInstance = socket.current;

      // Get online users
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Unsubscribe from event
      return () => {
        socketInstance.off("getOnlineUsers");
      };
    
  }, [setOnlineUsers, socket]);
};

/* Add Current User to Online Users */
export const emitUserToOnlineUsers = (socket, currentUser) => {
  if (currentUser) {
    const socketInstance = socket.current;

    // Emit user._id and add to OnlineUsers array on socket server
    socketInstance.emit("addUser", currentUser._id);
  }
};

/* Instant Messages functionality */
export const useInstantMessages = (
  socket,
  currentRoom,
  setMessages,
  setUnseenMessages,
  updateMessagesStatus
) => {
  useEffect(() => {
    const socketInstance = socket.current;

    //Get instant message
    socketInstance.on("getMessage", (instantMessage) => {
      //Update messages array
      setMessages((prev) => [...prev, instantMessage]);

      //Update status to seen when if user already in same chat with message
      if (currentRoom?._id === instantMessage.roomId) {
        updateMessagesStatus(instantMessage.roomId);

        //Or set message as unseen to increase unseen count
      } else {
        setUnseenMessages((prev) => [...prev, instantMessage]);
      }
    });

    // Unsubscribe from event
    return () => {
      socketInstance.off("getMessage");
    };
  }, [
    socket,
    currentRoom,
    setMessages,
    setUnseenMessages,
    updateMessagesStatus,
  ]);
};

export default useSocket;
