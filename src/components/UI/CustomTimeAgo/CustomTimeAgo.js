import React from "react";
import TimeAgo from "react-timeago";

const CustomTimeAgo = ({ date }) => {
  if (!date) return;

  const formatter = (value, unit, suffix) => {
    if (unit === "second" && value < 60) {
      return "just now";
    } else if (unit === "minute" && value === 1) {
      return "1 minute ago";
    }

    return `${value} ${unit}${value !== 1 ? "s" : ""} ${suffix}`;
  };

  return <TimeAgo date={date} formatter={formatter} style={{fontSize:"14px"}} />;
};

export default CustomTimeAgo;
