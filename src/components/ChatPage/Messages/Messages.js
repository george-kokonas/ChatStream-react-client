import "./messages.css"

const Messages = ({ message , sentByme}) => {
  return (
    <div>
        <p className={sentByme ? "sentByMe-msg" : "sentByOther-msg"}>{message.text}</p>
    </div>
  );
}

export default Messages;