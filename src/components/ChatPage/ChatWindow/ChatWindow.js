import Topbar from "../Topbar/Topbar";
import Message from "../Message/Message";
import "./chatWindow.css";
const ChatWindow = () => {
  return (
    <>
      <Topbar />
      <div className='chatContainer'>
        <div className='chatMenu'>
          <div className='wrapper-menu'>menu</div>
        </div>
        <div className='message-window'>
          <div className='wrapper-message-window'>
            <div className='message'>
              <Message myMessage={true}></Message>
              <Message></Message>
              <Message myMessage={true}></Message>
              <Message></Message>
              <Message myMessage={true}></Message>
            </div>
            <div className='wrapper-input'>
              <input
                className='userMessage-Input'
                type='text'
                placeholder='enter your message'
              ></input>
              <button className='sendMessage-Btn'>send</button>
            </div>
          </div>
        </div>
        <div className='onlineUsers'>
          <div className='wrapper-onlineUsers'>online users</div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
