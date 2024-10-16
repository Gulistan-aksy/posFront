import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProductList.css'; // CSS dosyasını burada kullanacağız.

const ProductList = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/products?product_category_id=${categoryId}`);
          setProducts(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch products');
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryId]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product-box">
          <p>{product.name}</p>
          <p>{product.price} TL</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
