// components/CategoryCard.js
import React from 'react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition duration-200"
      onClick={onClick}
    >
      <p>{category.name}</p>
    </div>
  );
};

export default CategoryCard;
