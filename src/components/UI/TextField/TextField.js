import React from "react";
import styles from "./TextField.module.scss";

const TextField = ({
  type,
  value,
  placeholder,
  width,
  height,
  responsiveWidth,
  onChange,
}) => {
  // Width for large screens
  const inputStyle = {
    width: width,
    height: height,
  };

  // Width for small screens
  const responsiveInputStyle = {
    width: responsiveWidth,
    height: height,
  };

  return (
    <input
      className={styles.input}
      type={type}
      value={value}
      placeholder={placeholder}
      style={window.innerWidth < 768 ? responsiveInputStyle : inputStyle}
      onChange={onChange}
    />
  );
};

export default TextField;
