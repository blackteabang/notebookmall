import React, { useState } from 'react';
import { CreditCard, Landmark, ShieldCheck, Ticket, Users, HandCoins } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { coordinators } from '../data/coordinators';

// --- [결제 페이지 컴포넌트] ---
// 사용자가 장바구니에서 넘어와 배송지 및 결제 정보를 입력하고 실제 주문을 생성하는 페이지입니다.
const Checkout = () => {
  // 결제 수단 및 코디네이터 할인 코드 관련 상태
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coordinatorCode, setCoordinatorCode] = useState('');
  const [isCodeApplied, setIsCodeApplied] = useState(false);
  
  // Buyer Info State
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerAddressDetail, setBuyerAddressDetail] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const { clearCart } = useCart();

  const product = location.state?.product;

  if (!product) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>상품 정보가 없습니다.</h2>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '1rem 2rem' }}>홈으로 돌아가기</button>
      </div>
    );
  }

  const quantity = product.quantity || 1;
  const unitBasePrice = product.basePrice || parseInt(String(product.price || '0').replace(/,/g, ''));
  const unitDiscountedPriceStr = product.price ? String(product.price).replace(/,/g, '') : unitBasePrice;
  const unitDiscountAmount = unitBasePrice - Number(unitDiscountedPriceStr);
  const unitActualDiscount = unitDiscountAmount > 0 ? unitDiscountAmount : 50000; // Provide default 50k discount for demo
  const basePrice = unitBasePrice * quantity;
  const actualDiscount = unitActualDiscount * quantity;

  const matchedCoordinator = coordinators.find(c => c.code.toUpperCase() === coordinatorCode.trim().toUpperCase());

  const handleApplyCode = () => {
    if (matchedCoordinator) {
      setIsCodeApplied(true);
    } else {
      setIsCodeApplied(false);
      alert('유효하지 않은 코드입니다.');
    }
  };

  const finalPrice = isCodeApplied ? (basePrice - actualDiscount) : basePrice;

  // Bulletproof image src extraction
  const extractImageSrc = (images) => {
    if (!images) return '';
    try {
      let current = images;
      for (let i = 0; i < 3; i++) {
        if (typeof current === 'string') {
          try { current = JSON.parse(current); } catch (e) { break; }
        } else {
          break;
        }
      }
      if (Array.isArray(current)) current = current[0];
      if (typeof current === 'string' && current.startsWith('http')) return current;
      
      const match = String(images).match(/(https?:\/\/[^"'\\]+)/);
      return match ? match[1] : '';
    } catch (e) {
      return '';
    }
  };
  const imgSrc = extractImageSrc(product.images);

  // 결제하기 버튼을 눌렀을 때 실행되는 최종 주문 처리 함수
  const handleCheckout = async () => {
    // 1. 필수 배송지 정보가 모두 입력되었는지 검증합니다.
    if (!buyerName || !buyerContact || !buyerAddress) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    // 2. 백엔드 서버로 전송할 최종 주문 데이터 규격을 생성합니다.
    const orderData = {
      buyerInfo: {
        name: buyerName,
        contact: buyerContact,
        address: `${buyerAddress} ${buyerAddressDetail}`.trim()
      },
      items: [{ id: product.id, name: product.name, quantity, price: unitDiscountedPriceStr }],
      paymentMethod,
      totalAmount: finalPrice,
      coordinatorCode: isCodeApplied ? coordinatorCode : null, // 할인이 적용된 경우에만 코드 저장
      status: '결제완료' // 임시 MVP 단계에서는 즉시 결제완료 처리
    };

    // 3. OrderContext의 addOrder API를 호출하여 데이터베이스에 저장합니다.
    const newOrder = await addOrder(orderData);
    if (newOrder) {
      // 4. 주문 성공 시 장바구니를 비우고 완료 페이지로 이동합니다.
      clearCart();
      navigate('/order-complete', { state: { order: newOrder } });
    } else {
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

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
              <input type="text" placeholder="이름" value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="연락처" value={buyerContact} onChange={e => setBuyerContact(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="주소" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
              <input type="text" placeholder="상세주소" value={buyerAddressDetail} onChange={e => setBuyerAddressDetail(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#fff' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>결제 방법</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setPaymentMethod('card')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'card' ? 'var(--secondary)' : 'var(--border)', background: paymentMethod === 'card' ? '#f0f9ff' : '#fff' }}
              >
                <CreditCard size={22} />
                <span>신용카드</span>
              </div>
              <div
                onClick={() => setPaymentMethod('bank')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'bank' ? 'var(--secondary)' : 'var(--border)', background: paymentMethod === 'bank' ? '#f0f9ff' : '#fff' }}
              >
                <Landmark size={22} />
                <span>현금계좌이체</span>
              </div>
              <div
                onClick={() => setPaymentMethod('group_buy')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'group_buy' ? 'var(--secondary)' : 'var(--border)', background: paymentMethod === 'group_buy' ? '#f0f9ff' : '#fff' }}
              >
                <Users size={22} />
                <span>공동구매</span>
              </div>
              <div
                onClick={() => setPaymentMethod('coordinator')}
                style={{ ...methodStyle, borderColor: paymentMethod === 'coordinator' ? 'var(--secondary)' : 'var(--border)', background: paymentMethod === 'coordinator' ? '#f0f9ff' : '#fff' }}
              >
                <HandCoins size={22} />
                <span>코디네이터 전달</span>
              </div>
            </div>

            {/* 결제 방법별 안내 */}
            {paymentMethod === 'bank' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.2rem', background: '#f8f9fa', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <p>계좌번호: <strong>국민은행 123456-01-123456</strong></p>
                <p>예금주: <strong>(주)리만</strong></p>
              </div>
            )}
            {paymentMethod === 'group_buy' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.2rem', background: '#e7f5ff', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 700, marginBottom: '0.3rem' }}>👥 공동구매 안내</p>
                <p style={{ color: '#495057' }}>공동구매 주문은 담당 코디네이터를 통해 접수됩니다.<br />주문 완료 후 코디네이터가 확인 후 출하 예정입니다.</p>
              </div>
            )}
            {paymentMethod === 'coordinator' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.2rem', background: '#fff9e6', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 700, marginBottom: '0.3rem' }}>🤝 코디네이터 전달 안내</p>
                <p style={{ color: '#495057' }}>- 담당 코디네이터를 통해 현금 또는 계좌이체로 직접 결제합니다.<br />- 코디네이터와 협의하여 물건 전달 방법을 결정합니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Summary */}
        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#fff' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>주문 요약</h3>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={imgSrc || '/fallback.png'} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#f1f3f5' }} />
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{product.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{quantity}개</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>상품 금액</span>
                <span>₩ {basePrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>배송비</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>무료</span>
              </div>
              
              {!isCodeApplied && actualDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#099268', fontSize: '0.9rem' }}>
                  <span>코디네이터 할인가능 금액</span>
                  <span>- ₩ {actualDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {isCodeApplied && actualDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fa5252', fontWeight: 600 }}>
                  <span>코디네이터 할인 적용</span>
                  <span>- ₩ {actualDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {/* Coordinator Code */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>세일즈 코디네이터 코드</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="코드를 입력하세요" 
                    value={coordinatorCode}
                    onChange={(e) => {
                      setCoordinatorCode(e.target.value);
                      setIsCodeApplied(false);
                    }}
                    disabled={isCodeApplied}
                    style={{ ...inputStyle, padding: '0.5rem 1rem', background: isCodeApplied ? '#f1f3f5' : '#fff' }} 
                  />
                  <button 
                    onClick={handleApplyCode}
                    disabled={isCodeApplied || !coordinatorCode.trim()}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: isCodeApplied || !coordinatorCode.trim() ? '#adb5bd' : '#000', 
                      color: '#fff', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem',
                      cursor: isCodeApplied || !coordinatorCode.trim() ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isCodeApplied ? '할인적용 완료' : '적용'}
                  </button>
                </div>
                
                {!isCodeApplied && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    코디네이터 코드가 있으면 특별 혜택이 적용될 수 있습니다. (예: JANE2024)
                  </p>
                )}
                {isCodeApplied && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ background: '#e6fcf5', color: '#099268', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      ✓ 할인 적용 완료
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '2px solid #000', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800 }}>
                <span>총 결제 금액</span>
                <span>₩ {finalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
              주문하기
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
