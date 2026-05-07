import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Star, ChevronRight, CheckCircle2, X } from 'lucide-react';
import ProductQA from '../components/ProductQA';
import ProductDescription from '../components/ProductDescription';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const { addToCart } = useCart();

  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>상품을 찾을 수 없습니다.</div>;
  }



  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ padding: '2rem' }}>
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <Link to="/">홈</Link> <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /> 노트북 <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /> {product.name}
        </nav>

        <div className="product-detail-grid">
          {/* Left: Images */}
          <div>
            <div className="product-detail-image-container" style={{ 
              background: `url(${product.images[0]}) center/cover`
            }}></div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {product.images.map((img, i) => (
                <div key={i} style={{ width: '100px', height: '100px', background: `url(${img}) center/cover`, borderRadius: '16px', border: '1px solid var(--border)' }}></div>
              ))}
            </div>

            {/* Q&A Board integrated here */}
            <ProductQA />
          </div>

          {/* Right: Info & Purchase */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', height: 'fit-content', background: '#fff', maxWidth: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{product.name}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{product.specs}</p>
            
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#099268', fontWeight: 800, background: '#e6fcf5', padding: '4px 10px', borderRadius: '6px', border: '1px solid #b2f2bb' }}>
                가용 재고: {product.stock || 0} / {product.initialStock || product.stock || 0}
              </div>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ marginBottom: '1.2rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--secondary)" /> 리퍼 검수 정보
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {product.inspectionPoints.map((point, index) => (
                  <div key={index} style={{ 
                    padding: '1rem 1.2rem', 
                    borderRadius: '16px', 
                    background: '#f8f9fa',
                    border: '1px solid var(--border)',
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                    color: '#333'
                  }}>
                    • {point}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '2rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>₩ {product.basePrice.toLocaleString()}</p>
              <p style={{ color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} /> 무료 배송
              </p>
            </div>

            <div className="product-actions">
              <button 
                onClick={() => addToCart(product)}
                className="btn-premium" 
                style={{ flex: 1, justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem' }}
              >
                장바구니 담기
              </button>
              <Link to="/checkout" state={{ product }} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
                바로 구매하기
              </Link>
            </div>

            <div 
              onClick={() => setShowPolicyModal(true)}
              style={{ 
                marginTop: '2rem', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1.2rem 1.5rem',
                borderRadius: '16px',
                background: '#f8f9fa',
                border: '1px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
                  <ShieldCheck color="var(--secondary)" size={18} /> <span>1년 무상 보증 (전문가 검수 완료)</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
                  <RotateCcw color="var(--secondary)" size={18} /> <span>30일 이내 언제든 반품 가능</span>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>

            {/* Policy Modal */}
            {showPolicyModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3000,
                padding: '1rem'
              }} onClick={() => setShowPolicyModal(false)}>
                <div className="glass animate-fade-in" style={{
                  width: '100%',
                  maxWidth: '500px',
                  background: '#fff',
                  borderRadius: '32px',
                  padding: '2.5rem',
                  position: 'relative'
                }} onClick={e => e.stopPropagation()}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>반품 및 보증</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>30일 무료 반품</h4>
                      <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>새 기기가 그다지 마음에 들지 않으세요?</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>상품 수령 후 30일 이내에는 어떤 이유로든 반품하실 수 있습니다.</p>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>1년 보증</h4>
                      <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>첫 해 동안 보장되는 결함</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>구매하신 제품에 1년 이내에 기술적 결함이 발생할 경우, 당사 비용으로 수리 또는 교체해 드립니다.</p>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>매입 보장</h4>
                      <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>더 이상 필요 없으면 저희에게 판매하세요.</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>당근마켓 가격으로 매입해드립니다.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowPolicyModal(false)}
                    style={{ 
                      marginTop: '2.5rem', 
                      width: '100%', 
                      padding: '1rem', 
                      background: '#000', 
                      color: '#fff', 
                      borderRadius: '16px',
                      fontWeight: 700
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Product Description Section at the bottom */}
        {product.detailImage && (
          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>리퍼 상세 설명</h3>
            <img src={product.detailImage} alt="리퍼 상세 설명" style={{ maxWidth: '100%', borderRadius: '16px' }} />
          </div>
        )}
        <ProductDescription product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
