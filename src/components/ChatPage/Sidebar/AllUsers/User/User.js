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
      
          <div className={styles.leftSide}>
            <img
              src={user.profileImage || defaultAvatar}
              alt='avatar'
              className='rounded-circle d-flex align-self-center  me-3 shadow-1-strong'
              width='55'
            />
            </div>
            <div className={styles.center}>
              <div className={styles.username}>{user.username}</div>
              <div className={styles.profileInfo}>{user.profileInfo}</div>
            </div>

          <div className={styles.rightSide}>
            <FontAwesomeIcon
              icon={faCircle}
              style={isOnline ? { color: "green" } : { color: "#AA0000" }}
            />{" "}
          </div>
      </li>
  );
};

export default User;
