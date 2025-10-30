import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';

function Nav() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">SlotSwapper</Link>
        <div>
          <Link className="nav-link d-inline" to="/dashboard">Dashboard</Link>
          <Link className="nav-link d-inline" to="/marketplace">Marketplace</Link>
          <Link className="nav-link d-inline" to="/requests">Requests</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
