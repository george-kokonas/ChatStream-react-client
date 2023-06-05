import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://chatapp-socket-avrl.onrender.com";

  socket = io(url);
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket connection not initialized.");
  }
  return socket;
};
