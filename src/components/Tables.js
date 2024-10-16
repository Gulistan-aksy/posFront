import React from 'react';
import '../styles/Tables.css'; // CSS stil dosyasını burada doğru bir şekilde import ediyoruz

const Tables = ({ tables, onSelectTable }) => {
  return (
    <div>
      <h2>Select a Table</h2>
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-box ${table.is_occupied ? 'occupied' : ''}`} // Dolu masaları turuncu yapar
            onClick={() => onSelectTable(table.id)}
          >
            {table.entity_number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
