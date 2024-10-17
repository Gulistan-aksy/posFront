// components/TableCard.js
import React from 'react';

const TableCard = ({ table, onClick }) => {
  return (
    <div
      className={`w-24 h-24 flex justify-center items-center border-2 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 ${
        table.is_occupied ? 'bg-orange-500 border-orange-700' : 'bg-gray-300 border-gray-500'
      }`}
      onClick={onClick}
    >
      <p className="text-xl font-semibold text-white">{table.entity_number}</p>
    </div>
  );
};

export default TableCard;
