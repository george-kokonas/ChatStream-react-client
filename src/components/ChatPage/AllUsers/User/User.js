import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import defaultUserIcon from "../../../../assets/defaultUserIcon.png";
import "./User.css";

const User = ({ user, isOnline, newRoomHandler }) => {
  return (
    <li
      onClick={() => newRoomHandler(user)}
      className='card p-2 mb-1 pt-1'
      style={{ backgroundColor: "#fbfbfbed" }}
    >
      <a href='#!' className='d-flex justify-content-between '>
        <div className='d-flex flex-row'>
          <img
            src={user.profileImage || defaultUserIcon}
            alt='avatar'
            className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
            width='50'
            height='50'
          />
          <div>
            <p className=''>{user.username}</p>
            <p className='small text-muted'>{user.profileInfo}</p>
          </div>
        </div>
        <div className='pt-1'>
          <p className='small text-muted mb-1'>
            <FontAwesomeIcon
              icon={faCircle}
              style={isOnline ? { color: "green" } : { color: "#AA0000" }}
            />{" "}
          </p>
        </div>
      </a>
    </li>
  );
};

export default User;
