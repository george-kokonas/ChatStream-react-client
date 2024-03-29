import React, { useEffect, useState, useCallback } from "react";
import styles from "./Button.module.scss";

const Button = ({
  text,
  width,
  mobileWidth,
  height,
  mobileHeight,
  backgroundColor,
  borderRadius,
  onClick,
}) => {
  const [buttonWidth, setButtonWidth] = useState(width);
  const [buttonHeight, setButtonHeight] = useState(height);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth < 768 ? mobileWidth : width;
    const newHeight = window.innerWidth < 768 ? mobileHeight : height;
    setButtonWidth(newWidth);
    setButtonHeight(newHeight);
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

  const buttonStyles = {
    width: buttonWidth,
    height: buttonHeight,
    "--background-color": backgroundColor, // Set the CSS variable value
    borderRadius,
  };

  return (
    <button className={styles.button} style={buttonStyles} onClick={onClick}>
      {text}
    </button>
  );
};


export default Button;
