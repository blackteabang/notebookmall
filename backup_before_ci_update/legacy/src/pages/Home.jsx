import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RefurbishedPolicy from '../components/RefurbishedPolicy';
import { ArrowRight, ShieldCheck, Lock, Info } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

// --- [메인 홈페이지 컴포넌트] ---
// 사용자가 처음 방문하는 쇼핑몰 메인 화면입니다. 
// B2B 폐쇄몰 형태이므로, 올바른 코드를 입력해야만 상품 목록을 볼 수 있습니다.
const Home = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  
  // discountCode: 사용자가 입력한 인가 코드 (세일즈 코디네이터 코드 등)
  // isUnlocked: 올바른 코드를 입력하여 폐쇄몰 화면이 해제되었는지 여부
  const [discountCode, setDiscountCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 사용자가 '입장하기' 버튼을 눌렀을 때 실행되는 함수
  const handleUnlock = () => {
    // 임시 로직: 4자리 이상 입력 시 통과 (실제 서비스 시 서버 검증 필요)
    if (discountCode.trim().length >= 4) {
      setIsUnlocked(true);
    } else {
      alert('유효하지 않은 인증 코드입니다. 담당 세일즈 코디네이터에게 문의하세요.');
    }
  };

  return (
    <>
      {/* Verification Modal Overlay */}
      {!isUnlocked && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.9)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 2000 
        }}>
          <div className="animate-fade-in" style={{ 
            width: '90%', 
            maxWidth: '500px', 
            background: '#fff', 
            padding: '3rem', 
            border: '4px solid var(--primary)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '1rem', borderRadius: '0' }}>
                <Lock size={32} />
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Membership Required
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              본 플랫폼은 승인된 비즈니스 파트너 및 세일즈 코디네이터를 위한 <strong>폐쇄형 몰(Closed Mall)</strong>입니다. <br />
              액세스를 위해 부여받은 인증 코드를 입력하십시오.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="AUTHENTICATION CODE" 
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '0', 
                  border: '1px solid var(--border)',
                  fontSize: '1rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
              <button 
                onClick={handleUnlock}
                className="btn-premium"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              >
                VERIFY & ENTER
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
                (임시 코드로 "1234" 입력)
              </p>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <p>코드가 없으신가요? <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>파트너십 신청하기</span></p>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in">
        {/* Product Grid with Rigid Style - MOVED TO TOP */}
        <section style={{ padding: '3rem 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>Current Inventory</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>실시간 가용 재고 현황 (B2B 전용 단가)</p>
              </div>
              {!isUnlocked && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Lock size={12} /> AUTHENTICATION REQUIRED FOR PRICES
                </div>
              )}
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '1rem'
            }}>
              {products.filter(laptop => !laptop.status || laptop.status === '판매중').map(laptop => (
                <div 
                  key={laptop.id} 
                  className="formal-card" 
                  onClick={() => isUnlocked && navigate(`/product/${laptop.id}`)}
                  style={{ 
                    padding: '1rem',
                    transition: 'border-color 0.2s ease',
                    cursor: isUnlocked ? 'pointer' : 'default',
                    opacity: isUnlocked ? 1 : 0.7,
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '160px', 
                    background: `#fff url(${laptop.images[0]}) center/contain no-repeat`, 
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '1rem' 
                  }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 800 }}>ID: {laptop.id.toString().padStart(4, '0')}</div>
                    <div style={{ fontSize: '0.6rem', color: '#099268', fontWeight: 800, background: '#e6fcf5', padding: '2px 6px', borderRadius: '4px' }}>
                      STOCK: {laptop.stock || 0} / {laptop.initialStock || laptop.stock || 0}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.25rem', textTransform: 'uppercase' }}>{laptop.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', height: '2rem', overflow: 'hidden', marginBottom: '1rem' }}>{laptop.specs}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>B2B PRICE</p>
                      <p style={{ fontWeight: '900', fontSize: '1.2rem' }}>{isUnlocked ? `₩ ${laptop.price}` : '----'}</p>
                    </div>
                    <button className="btn-premium" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem' }}>
                      DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formal Header Section - Optimized for Mobile */}
        <section style={{ 
          padding: '4rem 0', 
          background: '#fff',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="closed-mall-badge" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
              REMAN B2B CHANNEL
            </div>
            <h1 style={{ fontSize: 'min(3rem, 10vw)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              PROFESSIONAL <br />
              REFURBISHED <br />
              SUPPLY
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', marginInline: 'auto', maxWidth: '600px' }}>
              리맨은 기업 및 리셀러를 위한 최적화된 리퍼비시 노트북 공급망을 제공합니다. 
              모든 제품은 전문 엔지니어의 엄격한 검수를 거쳐 파트너사에 공급됩니다.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-premium" style={{ padding: '0.8rem 1.5rem' }}>Check Stock</button>
              <button className="btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>Partner Application</button>
            </div>
          </div>
        </section>

        {/* Quality Standard Section */}
        <section style={{ background: 'var(--primary)', color: '#fff', padding: '4rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>REMAN QUALITY STANDARD</h2>
            <p style={{ opacity: 0.8, maxWidth: '700px', margin: '0 auto 3rem', fontSize: '0.9rem' }}>
              모든 리맨 리퍼비시 노트북은 미국 및 유럽 기준의 품질 인증 프로세스를 준수합니다. 
              비즈니스 파트너십을 통해 합리적인 가격으로 프리미엄 제품을 공급받으세요.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' }}>GRADE A+</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>신품급 외관 및 성능 보장</p>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' }}>1 YEAR WARRANTY</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>안심 보증 및 사후 서비스</p>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' }}>BULK SUPPLY</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>파트너 전용 대량 단가 적용</p>
              </div>
            </div>
          </div>
        </section>

        <RefurbishedPolicy />
      </div>
    </>
  );
};

export default Home;
