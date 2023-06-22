import Avatar from "../../../../UI/Avatar/Avatar";
import styles from "./User.module.scss";


const User = ({ user, isOnline, newRoomHandler }) => {
  return (
    <>
      <li className={`${styles.userItem}`} onClick={() => newRoomHandler(user)}>

        {/* PROFILE AVATAR */}
        <div className={styles.leftSide}>
        <Avatar
          src={user.profileImage}
          size='large'
          status={isOnline ? "online" : "offline"}
        />
      </div>

        {/* USERNAME AND INFO */}
        <div className={styles.center}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.profileInfo}>{user.profileInfo}</div>
        </div>
      </li>
    </>
  );
};

export default User;
