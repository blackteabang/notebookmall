import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { coordinators } from '../data/coordinators';

const OrderComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2>잘못된 접근입니다.</h2>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginTop: '2rem', padding: '1rem 2rem' }}>홈으로 돌아가기</button>
      </div>
    );
  }

  const coordinator = order.coordinatorCode 
    ? coordinators.find(c => c.code.toUpperCase() === order.coordinatorCode.toUpperCase()) 
    : null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem', background: '#f8f9fa', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', overflow: 'hidden' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem', borderBottom: '1px solid #f1f3f5' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#212529', marginBottom: '1rem' }}>주문완료</h1>
          {order.paymentMethod === 'bank' ? (
            <p style={{ color: '#495057', fontSize: '1.05rem', lineHeight: 1.5 }}>
              아래 계좌정보로 입금해 주시면<br />
              결제 완료처리가 됩니다.
            </p>
          ) : (
            <p style={{ color: '#495057', fontSize: '1.05rem', lineHeight: 1.5 }}>
              주문이 정상적으로 완료되었습니다.<br />
              상품이 준비되는 대로 빠르게 배송해 드리겠습니다.
            </p>
          )}
        </div>

        {/* Content Section */}
        <div style={{ padding: '0 2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              
              {/* Bank Info (If bank transfer) */}
              {order.paymentMethod === 'bank' && (
                <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={labelStyle}>입금계좌 안내</td>
                  <td style={valueStyle}>
                    <div style={{ color: '#495057', marginBottom: '0.3rem' }}>국민은행 123456-01-123456</div>
                    <div style={{ color: '#495057', marginBottom: '0.5rem' }}>예금주: (주)리맨</div>
                    <div style={{ color: '#228be6', fontWeight: 700, fontSize: '1.1rem' }}>
                      {order.totalAmount.toLocaleString()}원
                    </div>
                  </td>
                </tr>
              )}

              {/* Order Amount (If card) */}
              {order.paymentMethod !== 'bank' && (
                <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={labelStyle}>결제 금액</td>
                  <td style={valueStyle}>
                    <div style={{ color: '#228be6', fontWeight: 700, fontSize: '1.1rem' }}>
                      {order.totalAmount.toLocaleString()}원
                    </div>
                  </td>
                </tr>
              )}

              <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={labelStyle}>주문번호</td>
                <td style={valueStyle}>{order.id}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={labelStyle}>배송지</td>
                <td style={valueStyle}>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{order.buyerInfo?.name}</div>
                  <div style={{ color: '#495057', marginBottom: '0.2rem' }}>{order.buyerInfo?.contact}</div>
                  <div style={{ color: '#495057', lineHeight: 1.4 }}>{order.buyerInfo?.address}</div>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={labelStyle}>배송 방법</td>
                <td style={valueStyle}>
                  {order.paymentMethod === 'coordinator'
                    ? '코디네이터와 협의'
                    : '택배 (무료배송)'}
                </td>
              </tr>

              {/* Coordinator Info */}
              {coordinator && (
                <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={labelStyle}>담당 코디네이터</td>
                  <td style={valueStyle}>
                    <div style={{ fontWeight: 600, color: '#099268', marginBottom: '0.3rem' }}>
                      {coordinator.name} ({coordinator.code})
                    </div>
                    <div style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      📞 {coordinator.phone}
                    </div>
                    <div style={{ color: '#495057', fontSize: '0.9rem' }}>
                      ✉️ {coordinator.email}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#868e96', marginTop: '0.4rem' }}>
                      구매와 관련된 문의사항이 있으시면 언제든 담당 코디네이터에게 연락해 주세요.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Button Section */}
        <div style={{ padding: '2rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              width: '100%', 
              padding: '1.2rem', 
              background: '#4dabf7', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#3bc9db'}
            onMouseOut={(e) => e.target.style.background = '#4dabf7'}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  width: '140px',
  padding: '1.5rem 0',
  color: '#868e96',
  fontWeight: 600,
  fontSize: '0.95rem',
  verticalAlign: 'top'
};

const valueStyle = {
  padding: '1.5rem 0',
  color: '#212529',
  fontSize: '0.95rem',
  verticalAlign: 'top'
};

export default OrderComplete;
