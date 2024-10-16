import React, { useState, useEffect } from 'react';
import '../styles/Tables.css';

const Tables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/entities');
        const data = await response.json();
        console.log("Fetched data:", data); // Yanıtı kontrol edin
        setTables(data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="tables-container">
      {tables.map((table) => (
        <div key={table.id} className={`table-box ${table.is_occupied ? 'occupied' : ''}`}>
          Masa Numarası: {table.entity_number}
        </div>
      ))}
    </div>
  );
};

export default Tables;
