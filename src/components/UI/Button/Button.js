import React from "react";
import styles from "./Button.module.scss";

const Button = ({ type, label, width, height, responsiveWidth, onClick }) => {
  // Width for large screens
  const buttonStyle = {
    width: width,
    height: height,
  };

  // Width for small screens
  const responsiveButtonStyle = {
    width: responsiveWidth,
    height: height,
  };
  return (
    <button
      className={styles.button}
      type={type}
      style={window.innerWidth < 768 ? responsiveButtonStyle : buttonStyle}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
