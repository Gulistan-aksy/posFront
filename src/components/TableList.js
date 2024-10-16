import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TableList.css'; 
import axios from 'axios';

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Yönlendirme için kullanıyoruz.

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/entities');
        setTables(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tables');
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return <p>Loading tables...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleTableClick = (tableId) => {
    navigate(`/orders/${tableId}`); // Masa ID'ye göre yönlendirme yapıyoruz.
  };

  return (
    <div className="table-container">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`table-box ${table.is_occupied ? 'occupied' : ''}`}
          onClick={() => table.is_occupied && handleTableClick(table.id)} // Doluysa tıklanabilir.
        >
          <p>{table.entity_number}</p>
        </div>
      ))}
    </div>
  );
};

export default TableList;
