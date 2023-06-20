"use client";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./User.module.scss";
import { MDBBadge } from "mdb-react-ui-kit";

const User = ({ user, isOnline, newRoomHandler }) => {
  return (
    <>
      <li className={`${styles.userItem}`} onClick={() => newRoomHandler(user)}>

        {/* PROFILE AVATAR */}
        <div className={styles.avatar}>
          <div className={styles.image}>
            <img
              src={user.profileImage || defaultAvatar}
              alt='avatar'
              className='rounded-circle shadow-1-strong'
              width='55'
            />
            <div className={styles.status}>
              <MDBBadge
                className={`${
                  isOnline ? "bg-success" : "bg-danger"
                } p-2 border border-light rounded-circle`}
              >
                <span className='visually-hidden'>New alerts</span>
              </MDBBadge>
            </div>
          </div>
        </div>

        {/* PROFILE USERNAME AND INFO */}
        <div className={styles.center}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.profileInfo}>{user.profileInfo}</div>
        </div>
      </li>
    </>
  );
};

export default User;
