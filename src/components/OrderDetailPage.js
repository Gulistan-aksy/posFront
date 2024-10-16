import React, { useState } from 'react';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import OrderDetails from './OrderDetails'; // Sipariş detaylarını sol tarafa yerleştireceğiz.
import '../styles/OrderDetailPage.css';

const OrderDetailPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="order-detail-page">
      <div className="left-panel">
        <OrderDetails /> {/* Sol panelde sipariş detayları */}
      </div>
      <div className="right-panel">
        <CategoryList onCategorySelect={handleCategorySelect} />
        {selectedCategory && <ProductList categoryId={selectedCategory} />}
      </div>
    </div>
  );
};

export default OrderDetailPage;
