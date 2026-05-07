import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Code, Shield, Lock, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  
  // 구글 번역기 버튼이 렌더링 시점에 사라지는 현상 방지
  useEffect(() => {
    const checkGoogleTranslate = setInterval(() => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        // 이미 렌더링된 요소가 없을 때만 새로 생성
        if (document.getElementById('google_translate_element') && !document.querySelector('.goog-te-combo')) {
          try {
            new window.google.translate.TranslateElement({
              pageLanguage: 'ko',
              includedLanguages: 'en,vi,th,ru,uz,mn,zh-CN,ja'
            }, 'google_translate_element');
          } catch (e) {
            console.error('Google Translate Init Error:', e);
          }
        }
        // 버튼이 나타나면 인터벌 종료
        if (document.querySelector('.goog-te-combo')) {
          clearInterval(checkGoogleTranslate);
        }
      }
    }, 1000);
    return () => clearInterval(checkGoogleTranslate);
  }, []);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav style={{ 
      background: '#fff', 
      borderBottom: '2px solid var(--primary)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      padding: '0.75rem 0' 
    }}>
      <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textDecoration: 'none' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.03em' }}>REMAN</div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: '0.6rem', 
              color: 'var(--primary)', 
              border: '1px solid var(--primary)', 
              padding: '1px 3px', 
              alignSelf: 'flex-start',
              marginTop: '1px',
              letterSpacing: '0.05em'
            }}>B2B SUPPLY</div>
          </Link>
          <div className="closed-mall-badge hide-mobile" style={{ fontSize: '0.65rem' }}>
            AUTHORIZED ACCESS ONLY
          </div>
        </div>
        
        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="hide-mobile" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="PART NO. / MODEL SEARCH" 
              style={{ 
                padding: '0.5rem 1rem 0.5rem 2.5rem', 
                borderRadius: '0', 
                border: '1px solid var(--border)', 
                width: '300px',
                fontSize: '0.8rem',
                fontWeight: 500
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          </div>

          {/* Google Translate Widget */}
          <div id="google_translate_element" style={{ 
            minWidth: '140px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center' 
          }}></div>
          
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <Link to="/qa" className="hide-mobile" style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Technical Support</Link>
            
            <Link to="/admin" className="btn-secondary hide-mobile" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} /> 관리자 메뉴
            </Link>
            
            <button className="btn-premium" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              LOGIN
            </button>
            
            {/* Shopping Cart (Desktop) */}
            <div 
              onClick={() => setIsCartOpen(true)} 
              className="hide-mobile"
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#fa5252',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Hamburger Icon (Mobile) */}
            <div 
              className="mobile-only" 
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{
            width: '280px',
            background: '#fff',
            height: '100%',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>MENU</h3>
              <X size={24} onClick={() => setIsMobileMenuOpen(false)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Mobile Search */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="SEARCH MODEL..." 
                  style={{ 
                    padding: '0.7rem 1rem 0.7rem 2.5rem', 
                    borderRadius: '0', 
                    border: '1px solid var(--border)', 
                    width: '100%',
                    fontSize: '0.85rem'
                  }}
                />
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              <Link to="/qa" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Code size={18} /> Technical Support
              </Link>
              
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Shield size={18} /> 관리자 메뉴
              </Link>

              <div 
                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} 
                style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer' }}
              >
                <ShoppingBag size={18} /> 장바구니 ({cartItemCount})
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
              <div className="closed-mall-badge" style={{ fontSize: '0.7rem', textAlign: 'center' }}>
                AUTHORIZED ACCESS ONLY
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
