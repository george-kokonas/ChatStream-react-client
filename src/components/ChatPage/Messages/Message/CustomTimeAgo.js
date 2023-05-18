import React from 'react';
import TimeAgo from 'react-timeago';

const CustomTimeAgo = ({ date }) => {
  const formatter = (value, unit, suffix) => {
    if (unit === 'second' && value < 60) {
      return 'just now';
    }
    return `${value} ${unit} ${suffix}`;
  };

  return <TimeAgo date={date} formatter={formatter} />;
};

export default CustomTimeAgo;