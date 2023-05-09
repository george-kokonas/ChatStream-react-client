import "./messages.css"

const Messages = ({ message , sentByme}) => {
  console.log(sentByme);
  return (
    <div>
        <p className={sentByme ? "sentByMe-msg" : "sentByOther-msg"}>{message.text}</p>
    </div>
  );
}

export default Messages;