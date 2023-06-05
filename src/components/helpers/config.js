const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://chatapp-server-yms0.onrender.com";

export default API_URL;
