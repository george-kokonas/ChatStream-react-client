import "./rooms.css";

const Rooms = ({ myMessage }) => {
  return (
    <div className={myMessage ? "message isMine" : "message"}>
      <div className='container-message'>
        {/* messages goes here */}
        <p>icon</p>
        <p className='messageText'>Hello man</p>
      </div>
    </div>
  );
};

export default Rooms;
