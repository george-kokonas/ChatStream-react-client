import React from "react";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import styles from "./Avatar.module.scss";

const Avatar = ({ src, size, status }) => {
  const imageSize =
    size === "small" ? 47 : size === "medium" ? 54 : size === "large" ? 61 : size === "x-large" ? 68 : 47;

  const userStatus =
    status === "online" ? `${styles.online}` : `${styles.offline}`;

  return (
    <div className={styles.container}>
      <img
        className={styles.avatar}
        src={src || defaultAvatar}
        style={{ width: imageSize, height: imageSize }}
        loading='lazy'
        alt='avatar'
      />
      {status && <div className={`${styles.statusDot} ${userStatus}`} />}
    </div>
  );
};

export default Avatar;
