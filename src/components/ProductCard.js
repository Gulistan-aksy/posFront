// components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg cursor-pointer bg-white hover:bg-green-50 transition duration-200"
      onClick={onClick}
    >
      <p>{product.name}</p>
      <p><strong>Fiyat:</strong> {product.price} TL</p>
    </div>
  );
};

export default ProductCard;
