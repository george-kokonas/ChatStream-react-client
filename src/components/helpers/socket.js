import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
  // "undefined" means the URL will be computed from the `window.location` object
  socket = io(
    process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080"
  );
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket connection not initialized.");
  }
  return socket;
};
