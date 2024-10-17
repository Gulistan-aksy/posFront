import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Siparişler</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.order_id}
            className="border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleOrderClick(order.order_id)}
          >
            <p className="text-lg">Order ID: {order.order_id}</p>
            <p>Total Amount: {order.total_amount} TL</p>
          </div>
        ))
      ) : (
        <p>No orders found for this table.</p>
      )}
    </div>
  );
};

export default OrderList;
