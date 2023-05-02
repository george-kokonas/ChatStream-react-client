import Topbar from "../Topbar/Topbar";
import "./chatWindow.css";
const ChatWindow = () => {
  return (
    <>
      <Topbar/>
      <div className="chatContainer">
        <div className="chatMenu">menu</div>
        <div className="chatBox">main window</div>
        <div className="chatOnline">online users</div>
      </div>
    </>
  );
};

export default ChatWindow;

