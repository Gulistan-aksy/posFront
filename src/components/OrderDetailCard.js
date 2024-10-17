// components/OrderDetailCard.js
import React from 'react';

const OrderDetailCard = ({ detail, isSelected, onClick, onDelete }) => {
  return (
    <div
      className={`border p-4 rounded-lg mb-4 ${detail.status === 'canceled' ? 'bg-red-200' : 'bg-white shadow-sm'}`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="flex gap-2 mb-2">
          <button className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition duration-200" onClick={onDelete}>Sil</button>
          <button className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition duration-200">Hediye</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition duration-200">Taşı</button>
        </div>
      )}
      <p><strong>Ürün Adı:</strong> {detail.product_name}</p>
      <p><strong>Miktar:</strong> {detail.quantity}</p>
      <p><strong>Toplam Tutar:</strong> {detail.total_price} TL</p>
      <p><strong>Durum:</strong> {detail.status}</p>
      <p><strong>Hediye mi:</strong> {detail.is_gift ? 'Evet' : 'Hayır'}</p>
      <p><strong>Sipariş Numarası:</strong> {detail.order_number}</p>
    </div>
  );
};

export default OrderDetailCard;
