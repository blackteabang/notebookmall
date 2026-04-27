import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import QABoard from './pages/QABoard';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <ProductProvider>
      <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/qa" element={<QABoard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="glass" style={{ marginTop: '5rem', padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>REMAN</h3>
              <p style={{ color: 'var(--text-muted)' }}>가장 신뢰받는 리퍼노트북 마켓</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>고객 지원</h4>
              <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>무료 배송</li>
                <li>30일 이내 반품</li>
                <li>1년 보증 (배터리 제외)</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>영업 안내</h4>
              <p style={{ color: 'var(--text-muted)' }}>커뮤니티 및 리셀러 대량 구매 문의</p>
            </div>
          </div>
        </footer>
      </div>
      </Router>
    </ProductProvider>
  );
}

export default App;
