// components/Orders.js
import React, { useState, useEffect } from 'react';
import { fetchTables, fetchOrdersForEntity, fetchOrderDetails } from '../services/api';
import TableList from './TableList';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import BackButton from './BackButton';

const Orders = () => {
  const [tables, setTables] = useState([]); // Tüm masalar
  const [selectedTableId, setSelectedTableId] = useState(null); // Seçilen masa
  const [orders, setOrders] = useState([]); // Masadaki siparişler
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Seçilen sipariş ID'si
  const [orderDetails, setOrderDetails] = useState([]); // Seçilen sipariş detayları
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [error, setError] = useState(null); // Hata durumu

  // Masaları API'den getir
  useEffect(() => {
    fetchTables()
      .then((data) => {
        setTables(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Seçilen masadaki siparişleri API'den getir
  useEffect(() => {
    if (selectedTableId) {
      fetchOrdersForEntity(selectedTableId)
        .then((data) => {
          setOrders(data); // Masadaki siparişleri state'e ekle
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [selectedTableId]);

  // Seçilen siparişin detaylarını API'den getir
  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId)
        .then((data) => {
          setOrderDetails(data); // Sipariş detaylarını kaydet
        })
        .catch((error) => setError(error.message));
    }
  }, [selectedOrderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Eğer masa seçilmemişse masaları göster
  if (!selectedTableId) {
    return <TableList tables={tables} onSelectTable={setSelectedTableId} />;
  }

  // Eğer masa seçildiyse siparişleri göster
  if (!selectedOrderId && orders.length > 0) {
    return <OrderList orders={orders} onSelectOrder={setSelectedOrderId} />;
  }

  // Eğer sipariş seçildiyse detayları göster
  if (selectedOrderId && orderDetails.length > 0) {
    return (
      <div>
        <OrderDetails orderId={selectedOrderId} details={orderDetails} />
        <BackButton onClick={() => setSelectedOrderId(null)} />
      </div>
    );
  }

  return <div>No orders found for this table.</div>;
};

export default Orders;
