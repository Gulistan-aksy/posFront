import React from 'react';
import axios from 'axios';

const OrderDetailCard = ({ detail, isSelected, onClick, onDelete, onGiftToggle, onQuantityChange }) => {

  // Hediye durumunu API ile güncelleme işlevi
  const handleGiftClick = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/order-detail/update-is-gift/${detail.id}`,
        { is_gift: !detail.is_gift }
      );
      // Parent component'e yeni hediye durumu ve yeni toplam tutar bilgisi aktarılır
      onGiftToggle(response.data.order_detail.is_gift, response.data.new_total_amount);
    } catch (error) {
      console.error('Hediye durumu güncellenirken hata oluştu:', error);
    }
  };

  // Quantity güncelleme işlevi, arttırmak veya azaltmak için kullanılır
  const updateQuantity = async (change) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/order-details/quantity/${detail.id}`,
        { quantity: change } // Arttırma ya da azaltma yapılacak miktar
      );
      // Parent component'e yeni quantity ve yeni total price bilgisi aktarılır
      onQuantityChange(detail.id, response.data.order_detail.quantity, response.data.order_detail.total_price, response.data.new_total_amount);
    } catch (error) {
      console.error('Miktar güncellenirken hata oluştu:', error);
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
          
          {/* Quantity güncelleme butonları */}
          <div className="flex items-center gap-2">
            <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => updateQuantity(-1)}>-</button>
            <span className="text-lg font-semibold">{detail.quantity}</span>
            <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => updateQuantity(1)}>+</button>
          </div>
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
