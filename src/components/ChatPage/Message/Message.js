import "./message.css";

const Message = ({myMessage }) => {
  return (
    <div className={myMessage ? "message isMine" : "message"}>
      <div className="container-message">
      <p>icon</p>
        <p className="messageText">Hello man</p>
      </div>
    </div>
  );
}

export default Message;