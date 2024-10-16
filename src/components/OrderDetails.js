import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sipariş detaylarını çek
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/orders-details/order/${orderId}`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Ürün kategorilerini çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/product-categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Seçili kategoriye göre ürünleri çek
  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/products?product_category_id=${categoryId}`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="order-details-container">
      <div className="left-panel">
        <h2>Order Details</h2>
        {orderDetails.map((detail) => (
          <div key={detail.id} className="order-detail-box">
            <p><strong>Product Name:</strong> {detail.product_name}</p>
            <p><strong>Quantity:</strong> {detail.quantity}</p>
            <p><strong>Total Price:</strong> {detail.total_price} TL</p>
            <p><strong>Status:</strong> {detail.status}</p>
            <p><strong>Is Gift:</strong> {detail.is_gift ? 'Yes' : 'No'}</p>
            <p><strong>Order Number:</strong> {detail.order_number}</p>
          </div>
        ))}
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>

      <div className="middle-panel">
        <h2>Categories</h2>
        <div className="category-list">
          {categories.map((category) => (
            <div key={category.id} className="category-box" onClick={() => fetchProductsByCategory(category.id)}>
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <h2>Products</h2>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-box">
              <p>{product.name}</p>
              <p><strong>Price:</strong> {product.price} TL</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
