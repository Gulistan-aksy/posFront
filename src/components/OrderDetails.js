import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import OrderDetailCard from './OrderDetailCard';
import ProductCard from './ProductCard';
import CategoryCard from './CategoryCard';
import Button from './Button';

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
  const [totalAmount, setTotalAmount] = useState(0); // Toplam tutar
  const [isPaid, setIsPaid] = useState(false); // Ödeme durumu
  const [tableName, setTableName] = useState(''); // Masa adı
  const [entityId, setEntityId] = useState(null); // Masa ID (entity_id)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/orders-details/order/${orderId}`);
        setOrderDetails(response.data.order_details);
        setTotalAmount(response.data.total_amount); // Toplam tutarı güncelle
        setIsPaid(response.data.is_paid); // Ödeme durumunu al
        setEntityId(response.data.entity_id); // entity_id'yi al
        setTableName(response.data.table_name); // Masa adını al
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

  const handleSaveOrderDetails = async () => {
    const details = selectedProducts.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      is_gift: product.is_gift,
      description: '',
    }));

    const payload = {
      order_id: parseInt(orderId),
      entity_id: entityId, // Dinamik entity_id kullanılıyor
      waiter_id: 2, // Sabit değer (düzenlenebilir)
      details: details,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/dine-in', payload);
      setOrderDetails([...orderDetails, ...response.data.details]); // Yeni detayları ekle
      setSelectedProducts([]); // Ürün listesini temizle
      setTotalAmount(response.data.total_amount); // Toplam tutarı güncelle
    } catch (err) {
      console.error('Failed to save order details');
    }
  };

  const handleDeleteOrderDetail = async (orderDetailId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/v1/order-details/${orderDetailId}`);
      setOrderDetails(orderDetails.map((detail) => {
        if (detail.id === orderDetailId) {
          return { ...detail, status: 'canceled' };
        }
        return detail;
      }));
      setTotalAmount(parseFloat(response.data.message.split(': ')[1])); // Yeni total_amount'u güncelle
    } catch (err) {
      console.error('Failed to delete order detail');
    }
  };

  // New kısımlarını toplam tutara dahil eden fonksiyon
  const calculateTotalWithNew = () => {
    const newDetailsTotal = selectedProducts
      .filter((product) => !product.is_gift) // Gift değilse toplam tutara dahil et
      .reduce((sum, product) => sum + product.total_price, 0);
    return totalAmount + newDetailsTotal; // Hem var olan hem de new detayları toplar
  };

  // OrderDetailCard'daki buton işlevleri (delete, gift, move) korunuyor
  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
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

  if (loading) {
    return <p className="text-center">Loading order details...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 p-6 bg-gray-200 min-h-screen">
      <div className="left-panel flex-1 bg-white rounded-lg shadow-md p-4">
        {/* Sipariş ID ve Masa Adı */}
        <h2 className="text-2xl font-semibold mb-4">Sipariş ID: {orderId} - Masa: {tableName}</h2>
        <p className="text-lg">Ödenmiş mi: {isPaid ? 'Evet' : 'Hayır'}</p> {/* Ödeme durumu */}

        <h3 className="text-2xl font-semibold mb-4">Sipariş Detayları</h3>
        {orderDetails.map((detail) => (
          <OrderDetailCard
            key={detail.id}
            detail={detail}
            isSelected={selectedDetail && selectedDetail.id === detail.id}
            onClick={() => handleDetailClick(detail)}
            onDelete={() => handleDeleteOrderDetail(detail.id)} // Delete işlevi çalışıyor
          />
        ))}

        {selectedProducts.length > 0 && (
          <div>
            <h3 className="font-semibold">Seçilen Ürünler (Yeni)</h3>
            {selectedProducts.map((product, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50" onClick={() => setSelectedNewDetail(index)}>
                {selectedNewDetail === index && (
                  <div className="flex gap-2 mb-2">
                    <Button className="bg-red-500 text-white" onClick={() => handleDeleteNewDetail(index)}>Sil</Button> {/* Delete işlevi */}
                    <Button className="bg-yellow-500 text-white" onClick={() => handleGiftToggle(index)}>
                      {product.is_gift ? 'Hediye İşaretini Kaldır' : 'Hediye'} {/* Gift işlevi */}
                    </Button>
                  </div>
                )}
                <p><strong>Ürün Adı:</strong> {product.product_name}</p>
                <p><strong>Miktar:</strong> {product.quantity}</p>
                <p><strong>Toplam Tutar:</strong> {product.total_price} TL</p>
              </div>
            ))}
          </div>
        )}

        {selectedProducts.length > 0 && (
          <Button className="bg-green-500 text-white mt-4" onClick={handleSaveOrderDetails}>Sipariş Detaylarını Kaydet</Button>
        )}

        <Button className="bg-blue-500 text-white mt-4" onClick={() => navigate(-1)}>Geri Dön</Button>

        {/* Toplam Tutar */}
        <h3 className="text-xl font-semibold mt-6">Toplam Tutar: {calculateTotalWithNew()} TL</h3> {/* New kısımlar dahil edilerek */}
      </div>

      <div className="middle-panel flex-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Kategoriler</h2>
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onClick={() => fetchProductsByCategory(category.id)} 
            />
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
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductSelect(product)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
