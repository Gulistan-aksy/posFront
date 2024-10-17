import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableCard from './TableCard';

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

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {tables.map((table) => (
        <TableCard 
          key={table.id} 
          table={table} 
          onClick={() => table.is_occupied && navigate(`/orders/${table.id}`)} 
        />
      ))}
    </div>
  );
};

export default TableList;
