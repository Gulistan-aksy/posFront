import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderCard from './OrderCard';

const OrderList = () => {
  const { tableId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/entities/orders/${tableId}`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tableId]);

  if (loading) {
    return <p className="text-center">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Siparişler</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard 
            key={order.order_id} 
            order={order} 
            onClick={() => navigate(`/order-details/${order.order_id}`)} 
          />
        ))
      ) : (
        <p>No orders found for this table.</p>
      )}
    </div>
  );
};

export default OrderList;
