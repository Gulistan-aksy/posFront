import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noProducts, setNoProducts] = useState(false);
  const [selectedNewDetail, setSelectedNewDetail] = useState(null);

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

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/products?product_category_id=${categoryId}`);
      setProducts(response.data);
      setNoProducts(response.data.length === 0);
    } catch (err) {
      setProducts([]);
      setNoProducts(true);
    }
  };

  const handleProductSelect = (product) => {
    const newDetail = {
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: product.price,
      total_price: product.price,
      status: 'new',
      is_gift: false,
    };
    setSelectedProducts([...selectedProducts, newDetail]);
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
  };

  const handleNewDetailClick = (index) => {
    setSelectedNewDetail(index);
  };

  const handleGiftToggle = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].is_gift = !updatedProducts[index].is_gift;
    setSelectedProducts(updatedProducts);
  };

  const handleDeleteNewDetail = (index) => {
    const updatedProducts = selectedProducts.filter((_, idx) => idx !== index);
    setSelectedProducts(updatedProducts);
    setSelectedNewDetail(null);
  };

  const handleDeleteOrderDetail = async (orderDetailId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/order-details/${orderDetailId}`);
      setOrderDetails(orderDetails.map((detail) => {
        if (detail.id === orderDetailId) {
          return { ...detail, status: 'canceled' };
        }
        return detail;
      }));
    } catch (err) {
      console.error('Failed to delete order detail');
    }
  };

  const handleSaveOrderDetails = async () => {
    const details = selectedProducts.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      is_gift: product.is_gift,
      description: '',
    }));

    const payload = {
      order_id: parseInt(orderId),
      entity_id: 6, // Sabit değer (düzenlenebilir)
      waiter_id: 2, // Sabit değer (düzenlenebilir)
      details: details,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/dine-in', payload);
      setOrderDetails([...orderDetails, ...response.data]); // Yeni detayları orderDetails'e ekle
      setSelectedProducts([]); // Yeni ürün listesini temizle
    } catch (err) {
      console.error('Failed to save order details');
    }
  };

  if (loading) {
    return <p className="text-center">Loading order details...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 p-6 bg-gray-200 min-h-screen">
      <div className="left-panel flex-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Sipariş Detayları</h2>
        {orderDetails.map((detail) => (
          <div
            key={detail.id}
            className={`border p-4 rounded-lg mb-4 ${detail.status === 'canceled' ? 'bg-red-200' : 'bg-white shadow-sm'}`}
            onClick={() => handleDetailClick(detail)}
          >
            {selectedDetail && selectedDetail.id === detail.id && (
              <div className="flex gap-2 mb-2">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteOrderDetail(detail.id)}>Sil</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded">Hediye</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Taşı</button>
              </div>
            )}
            <p><strong>Ürün Adı:</strong> {detail.product_name}</p>
            <p><strong>Miktar:</strong> {detail.quantity}</p>
            <p><strong>Toplam Tutar:</strong> {detail.total_price} TL</p>
            <p><strong>Durum:</strong> {detail.status}</p>
            <p><strong>Hediye mi:</strong> {detail.is_gift ? 'Evet' : 'Hayır'}</p>
            <p><strong>Sipariş Numarası:</strong> {detail.order_number}</p>
          </div>
        ))}

        {selectedProducts.length > 0 && (
          <div>
            <h3 className="font-semibold">Seçilen Ürünler (Yeni)</h3>
            {selectedProducts.map((product, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50" onClick={() => handleNewDetailClick(index)}>
                {selectedNewDetail === index && (
                  <div className="flex gap-2 mb-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteNewDetail(index)}>Sil</button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleGiftToggle(index)}>
                      {product.is_gift ? 'Hediye İşaretini Kaldır' : 'Hediye'}
                    </button>
                  </div>
                )}
                <p><strong>Ürün Adı:</strong> {product.product_name}</p>
                <p><strong>Miktar:</strong> {product.quantity}</p>
                <p><strong>Toplam Tutar:</strong> {product.total_price} TL</p>
                <p><strong>Durum:</strong> {product.status}</p>
              </div>
            ))}
          </div>
        )}

        {selectedProducts.length > 0 && (
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleSaveOrderDetails}>Sipariş Detaylarını Kaydet</button>
        )}

        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => navigate(-1)}>Geri Dön</button>
      </div>

      <div className="middle-panel flex-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Kategoriler</h2>
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border p-4 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition duration-200"
              onClick={() => fetchProductsByCategory(category.id)}
            >
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel flex-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Ürünler</h2>
        <div className="flex flex-col gap-4">
          {noProducts ? (
            <p>Bu kategori için ürün yok.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg cursor-pointer bg-white hover:bg-green-50 transition duration-200"
                onClick={() => handleProductSelect(product)}
              >
                <p>{product.name}</p>
                <p><strong>Fiyat:</strong> {product.price} TL</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

