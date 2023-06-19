import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./User.module.scss";

const User = ({ user, isOnline, newRoomHandler }) => {
  return (
      <li
        className={`${styles.userItem}`}
        onClick={() => newRoomHandler(user)}
      >
        <a href='#!' className='d-flex justify-content-between'>
          <div className='d-flex flex-row'>
            <img
              src={user.profileImage || defaultAvatar}
              alt='avatar'
              className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
              width='60'
            />
            <div className='pt-1'>
              <p className='fw-bold mb-0'>{user.username}</p>
              <p className='small text-muted'>{user.profileInfo}</p>
            </div>
          </div>
          <p className='small text-muted mb-1'>
            <FontAwesomeIcon
              icon={faCircle}
              style={isOnline ? { color: "green" } : { color: "#AA0000" }}
            />{" "}
          </p>
        </a>
      </li>
  );
};

export default User;
