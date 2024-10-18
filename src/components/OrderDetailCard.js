// components/OrderDetailCard.js
import React from 'react';
import axios from 'axios';

const OrderDetailCard = ({ detail, isSelected, onClick, onDelete, onGiftToggle }) => {
  const handleGiftClick = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/order-detail/update-is-gift/${detail.id}`,
        {
          is_gift: !detail.is_gift, // Hediye durumunu tersine çevir
        }
      );
      // Hediye durumu ve yeni total_amount API'den başarıyla geldiğinde parent component'e bildiriyoruz
      onGiftToggle(response.data.order_detail.is_gift, response.data.new_total_amount);
    } catch (error) {
      console.error('Hediye durumu güncellenirken hata oluştu:', error);
    }
  };

  return (
    <div
      className={`border p-4 rounded-lg mb-4 ${
        detail.status === 'canceled' ? 'bg-red-200' : 'bg-white shadow-sm'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="flex gap-2 mb-2">
          <button className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition duration-200" onClick={onDelete}>
            Sil
          </button>
          <button className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition duration-200" onClick={handleGiftClick}>
            {detail.is_gift ? 'Hediye İşaretini Kaldır' : 'Hediye'}
          </button>
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
