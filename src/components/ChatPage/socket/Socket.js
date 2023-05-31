import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
  // socket = io("http://localhost:8080");
  socket = io("https://chatapp-socket-avrl.onrender.com");
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket connection not initialized.");
  }
  return socket;
};
