// components/BackButton.js
import React from 'react';

const BackButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>Back to Orders List</button>
  );
};

export default BackButton;
