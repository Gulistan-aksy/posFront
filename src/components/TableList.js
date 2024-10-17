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
    return <p className="text-center">Loading tables...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const handleTableClick = (tableId) => {
    navigate(`/orders/${tableId}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`w-24 h-24 flex justify-center items-center border-2 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 ${
            table.is_occupied ? 'bg-orange-500 border-orange-700' : 'bg-gray-300 border-gray-500'
          }`}
          onClick={() => table.is_occupied && handleTableClick(table.id)}
        >
          <p className="text-xl font-semibold text-white">{table.entity_number}</p>
        </div>
      ))}
    </div>
  );
};

export default TableList;
