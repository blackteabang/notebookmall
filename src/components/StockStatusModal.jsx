import React from 'react';
import { X, Package, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const StockStatusModal = ({ isOpen, onClose }) => {
  const { products } = useProducts();

  if (!isOpen) return null;

  // 필터링: 판매중인 상품만 표시할지 여부 결정 (보통 재고 확인은 가용 재고 위주)
  const activeProducts = products.filter(p => p.status === '판매중');
  
  const totalInitial = activeProducts.reduce((sum, p) => sum + (p.initialStock || p.stock || 0), 0);
  const totalCurrent = activeProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalSold = totalInitial - totalCurrent;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '24px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
              <Package size={28} /> 가용 재고 현황
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>리맨 비즈니스 파트너 전용 실시간 인벤토리 정보</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: '#e0f2fe', color: '#0369a1' }}><Package size={20} /></div>
            <div>
              <p style={statLabelStyle}>입고 수량</p>
              <h3 style={statValueStyle}>{totalInitial.toLocaleString()}대</h3>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: '#fef3c7', color: '#b45309' }}><ShoppingCart size={20} /></div>
            <div>
              <p style={statLabelStyle}>판매 완료</p>
              <h3 style={statValueStyle}>{totalSold.toLocaleString()}대</h3>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, background: '#dcfce7', color: '#15803d' }}><CheckCircle2 size={20} /></div>
            <div>
              <p style={statLabelStyle}>가용 재고</p>
              <h3 style={{ ...statValueStyle, color: 'var(--primary)' }}>{totalCurrent.toLocaleString()}대</h3>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={thStyle}>모델명 / 사양</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>입고수량</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>가용재고</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>판매율</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>공급 상태</th>
              </tr>
            </thead>
            <tbody>
              {activeProducts.map(p => {
                const initial = p.initialStock || p.stock || 0;
                const current = p.stock || 0;
                const sold = initial - current;
                const soldRate = initial > 0 ? Math.round((sold / initial) * 100) : 0;
                
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 0' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{p.specs}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{initial}대</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1.1rem', 
                        color: current < 3 ? '#ef4444' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}>
                        {current}대
                        {current < 3 && current > 0 && <AlertCircle size={14} />}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>{soldRate}%</div>
                      <div style={{ width: '60px', height: '4px', background: '#e2e8f0', margin: '0 auto', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${soldRate}%`, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '0.3rem 0.75rem', 
                        borderRadius: '99px',
                        background: current > 0 ? '#f0fdf4' : '#fef2f2',
                        color: current > 0 ? '#166534' : '#991b1b'
                      }}>
                        {current > 0 ? '공급가능' : '품절'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {activeProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              현재 등록된 상품 정보가 없습니다.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', background: '#fff' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            재고 데이터는 실시간으로 업데이트됩니다. 대량 구매 문의는 파트너십 채널을 이용해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

const statCardStyle = {
  background: '#fff',
  padding: '1.25rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid #f1f5f9'
};

const statIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  marginBottom: '0.1rem'
};

const statValueStyle = {
  fontSize: '1.25rem',
  fontWeight: 900,
  color: '#0f172a'
};

const thStyle = {
  padding: '1rem 0',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

export default StockStatusModal;
