import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Seçilen ürünler (new olacak)
  const [selectedDetail, setSelectedDetail] = useState(null); // Seçilen detay için state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noProducts, setNoProducts] = useState(false);
  const navigate = useNavigate();

  // Sipariş detaylarını çek
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/orders-details/order/${orderId}`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order details');
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
        console.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Seçili kategoriye göre ürünleri çek
  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/products?product_category_id=${categoryId}`);
      if (response.data.length === 0) {
        setProducts([]);
        setNoProducts(true);
      } else {
        setProducts(response.data);
        setNoProducts(false);
      }
    } catch (err) {
      setProducts([]);
      setNoProducts(true);
    }
  };

  // Ürün seçimi yapıldığında order detail ekleme
  const handleProductSelect = (product) => {
    const newDetail = {
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: product.price,
      total_price: product.price,
      status: 'new',
      is_gift: false
    };
    setSelectedProducts([...selectedProducts, newDetail]); // Yeni ürünleri seçilenlere ekle
  };

  // Seçilen detay için delete, gift ve move butonlarını göster
  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
  };

  // Seçilen ürünleri kaydetme işlemi (API çağrısı ile kaydet)
  const handleSaveOrderDetails = async () => {
    const details = selectedProducts.map(product => ({
      product_id: product.product_id,
      quantity: product.quantity,
      is_gift: product.is_gift,
      description: '' // Ekstra bilgi ekleyebilirsiniz
    }));

    const payload = {
      order_id: parseInt(orderId),
      entity_id: 6, // Bu örnek için sabit değer
      waiter_id: 2, // Sabit değer (gerçekte kullanıcıdan alınabilir)
      details: details
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/dine-in', payload);
      setOrderDetails([...orderDetails, ...response.data]); // Yeni detayları ekle
      setSelectedProducts([]); // Seçilen ürünleri temizle
    } catch (err) {
      console.error('Failed to save order details');
    }
  };

  // Order detail silme işlemi
  const handleDeleteOrderDetail = async (orderDetailId) => {
    try {
      // Veritabanından sil
      await axios.delete(`http://127.0.0.1:8000/api/v1/order-details/${orderDetailId}`);

      // Statüsü 'canceled' olarak ekranda güncelle
      setOrderDetails(orderDetails.map(detail => {
        if (detail.id === orderDetailId) {
          return { ...detail, status: 'canceled' }; // Statüyü canceled olarak güncelle
        }
        return detail;
      }));
    } catch (err) {
      console.error('Failed to delete order detail');
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="order-details-container">
      <div className="left-panel">
        <h2>Order Details</h2>
        {orderDetails.map((detail) => (
          <div key={detail.id} className={`order-detail-box ${detail.status === 'canceled' ? 'canceled' : ''}`} onClick={() => handleDetailClick(detail)}>
            {selectedDetail && selectedDetail.id === detail.id && (
              <div className="detail-actions">
                <button className="delete-btn" onClick={() => handleDeleteOrderDetail(detail.id)}>Delete</button>
                <button className="gift-btn">Gift</button>
                <button className="move-btn">Move</button>
              </div>
            )}
            <p><strong>Product Name:</strong> {detail.product_name}</p>
            <p><strong>Quantity:</strong> {detail.quantity}</p>
            <p><strong>Total Price:</strong> {detail.total_price} TL</p>
            <p><strong>Status:</strong> {detail.status}</p>
            <p><strong>Is Gift:</strong> {detail.is_gift ? 'Yes' : 'No'}</p>
            <p><strong>Order Number:</strong> {detail.order_number}</p>
          </div>
        ))}

        {/* Seçilen yeni ürünleri göster */}
        {selectedProducts.length > 0 && (
          <div>
            <h3>Selected Products (New)</h3>
            {selectedProducts.map((product, index) => (
              <div key={index} className="order-detail-box">
                <p><strong>Product Name:</strong> {product.product_name}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Total Price:</strong> {product.total_price} TL</p>
                <p><strong>Status:</strong> {product.status}</p>
              </div>
            ))}
          </div>
        )}

        {/* Kaydet butonu */}
        {selectedProducts.length > 0 && (
          <button onClick={handleSaveOrderDetails}>Save Order Details</button>
        )}

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
          {noProducts ? (
            <p>No products available for this category.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-box" onClick={() => handleProductSelect(product)}>
                <p>{product.name}</p>
                <p><strong>Price:</strong> {product.price} TL</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
