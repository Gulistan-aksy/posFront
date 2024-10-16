import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CategoryList.css'; // CSS dosyasını oluşturacağız.

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/product-categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="category-container">
      {categories.map((category) => (
        <div
          key={category.id}
          className="category-box"
          onClick={() => onCategorySelect(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
