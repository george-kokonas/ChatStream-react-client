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
              className='rounded-circle d-flex align-self-center  me-3 shadow-1-strong'
              width='55'
            />
            <div className='pt-1'>
              <p className={styles.username}>{user.username}</p>
              <p className={styles.profileInfo}>{user.profileInfo}</p>
            </div>
          </div>
          <p className='small text-muted d-flex align-self-center'>
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
