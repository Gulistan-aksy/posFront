// OrderCard.js
import React from 'react';

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 transition duration-300"
      onClick={onClick}
    >
      <p className="text-lg font-medium">Sipariş ID: {order.order_id}</p>
      <p className="text-md">Toplam Tutar: <span className="font-bold">{order.total_amount} TL</span></p>
      <p className="text-md">Ödenmiş mi: <span className="font-bold">{order.is_paid ? 'Evet' : 'Hayır'}</span></p> {/* is_paid bilgisi */}
    </div>
  );
};

export default OrderCard;