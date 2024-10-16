import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderList = () => {
  const { tableId } = useParams(); // Parametreyi alıyoruz.
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Yönlendirme işlemi için kullanıyoruz.

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
    navigate(`/order-details/${orderId}`); // Sipariş detaylarına yönlendirme.
  };

  return (
    <div>
      <h2>Siparişler</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.order_id} className="order-box" onClick={() => handleOrderClick(order.order_id)}>
            <p>Order ID: {order.order_id}</p>
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
