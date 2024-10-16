import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TableList from './components/TableList';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Masa Listesi</h1>
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
