import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TableList from './components/TableList';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="text-4xl font-bold text-center my-6 text-indigo-600">Masa Listesi</h1>
        <Routes>
          <Route path="/" element={<TableList />} />
          <Route path="/orders/:tableId" element={<OrderList />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
