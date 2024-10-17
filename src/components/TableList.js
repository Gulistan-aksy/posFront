import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    navigate(`/orders/${tableId}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`w-24 h-24 flex justify-center items-center border rounded-lg cursor-pointer transition ${
            table.is_occupied ? 'bg-orange-500' : 'bg-gray-300'
          }`}
          onClick={() => table.is_occupied && handleTableClick(table.id)}
        >
          <p className="text-xl">{table.entity_number}</p>
        </div>
      ))}
    </div>
  );
};

export default TableList;
