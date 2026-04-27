import React, { useState } from 'react';
import { CreditCard, Landmark, ShieldCheck, Ticket } from 'lucide-react';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coordinatorCode, setCoordinatorCode] = useState('');

  return (
    <div className="container animate-fade-in" style={{ padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>주문 및 결제</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>
        {/* Left Side: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping Info */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#fff' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              배송 정보
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="이름" style={inputStyle} />
              <input type="text" placeholder="연락처" style={inputStyle} />
              <input type="text" placeholder="주소" style={{ ...inputStyle, gridColumn: 'span 2' }} />
              <input type="text" placeholder="상세주소" style={{ ...inputStyle, gridColumn: 'span 2' }} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#fff' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>결제 수단</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div 
                onClick={() => setPaymentMethod('card')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'card' ? 'var(--secondary)' : 'var(--border)' }}
              >
                <CreditCard />
                <span>신용카드</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('bank')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'bank' ? 'var(--secondary)' : 'var(--border)' }}
              >
                <Landmark />
                <span>현금계좌이체</span>
              </div>
            </div>
            
            {paymentMethod === 'bank' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px', fontSize: '0.9rem' }}>
                <p>계좌번호: <strong>국민은행 123456-01-123456</strong></p>
                <p>예금주: (주)리맨</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Summary */}
        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#fff' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>주문 요약</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>상품 금액</span>
                <span>₩ 850,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>배송비</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>무료</span>
              </div>
              
              {/* Coordinator Code */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>세일즈 코디네이터 코드</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="코드를 입력하세요" 
                    value={coordinatorCode}
                    onChange={(e) => setCoordinatorCode(e.target.value)}
                    style={{ ...inputStyle, padding: '0.5rem 1rem' }} 
                  />
                  <button style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', borderRadius: '8px', fontSize: '0.8rem' }}>적용</button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  코디네이터 코드가 있으면 특별 혜택이 적용될 수 있습니다.
                </p>
              </div>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '2px solid #000', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800 }}>
                <span>총 결제 금액</span>
                <span>₩ 850,000</span>
              </div>
            </div>

            <button className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
              결제하기
            </button>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} /> 안전한 보안 결제 시스템 적용 중
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.8rem 1.2rem',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  outline: 'none',
  width: '100%'
};

const methodStyle = {
  flex: 1,
  padding: '1.5rem',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontWeight: 600
};

export default Checkout;
