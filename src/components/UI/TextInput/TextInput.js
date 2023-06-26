import React, { useEffect, useState, useCallback } from "react";
import styles from "./TextInput.module.scss";

const TextInput = ({
  type,
  value,
  placeholder,
  width,
  height,
  mobileWidth,
  mobileHeight,
  backgroundColor,
  borderRadius,
  onChange
}) => {
  const [inputWidth, setInputWidth] = useState(width);
  const [inputHeight, setInputHeight] = useState(height);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth < 768 ? mobileWidth : width;
    const newHeight = window.innerWidth < 768 ? mobileHeight : height;
    setInputWidth(newWidth);
    setInputHeight(newHeight);
  }, [width, mobileWidth, height, mobileHeight]);

  useEffect(() => {
    handleResize(); // Set initial width and height

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const inputStyles = {
    width: inputWidth,
    height: inputHeight,
    backgroundColor :backgroundColor,
    borderRadius: borderRadius
  };

  return (
    <input
      className={styles.textInput}
      type={type}
      value={value}
      placeholder={placeholder}
      style={inputStyles}
      onChange={onChange}
    />
  );
};

export default TextInput;
