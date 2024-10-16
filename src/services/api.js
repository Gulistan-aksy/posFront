// services/api.js
export const fetchTables = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/entities');
    if (!response.ok) {
      throw new Error('API hatası: ' + response.statusText);
    }
    return response.json();
  };
  
  export const fetchOrdersForEntity = async (entityId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/entities/orders/${entityId}`);
    if (!response.ok) {
      throw new Error('API hatası: ' + response.statusText);
    }
    return response.json();
  };
  
  export const fetchOrderDetails = async (orderId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/orders-details/order/${orderId}`);
    if (!response.ok) {
      throw new Error('API hatası: ' + response.statusText);
    }
    return response.json();
  };
  