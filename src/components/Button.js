// components/Button.js
import React from 'react';

const Button = ({ onClick, children, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded transition duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
