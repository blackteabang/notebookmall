import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          transition: 'opacity 0.3s'
        }}
      />
      
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '400px',
        backgroundColor: '#fff',
        zIndex: 1001,
        boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s forwards'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} /> 장바구니
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>장바구니가 비어 있습니다.</p>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = item.price ? Number(String(item.price).replace(/,/g, '')) : (item.basePrice || 0);
              
              // Bulletproof extraction
              let imgSrc = '';
              try {
                let current = item.images;
                for(let i=0; i<3; i++) {
                  if(typeof current === 'string') { try { current = JSON.parse(current); } catch(e) { break; } }
                  else break;
                }
                if (Array.isArray(current)) current = current[0];
                if (typeof current === 'string' && current.startsWith('http')) {
                  imgSrc = current;
                } else {
                  const match = String(item.images).match(/(https?:\/\/[^"'\\]+)/);
                  imgSrc = match ? match[1] : '';
                }
              } catch(e) {}
              
              return (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                  <img 
                    src={imgSrc || '/fallback.png'} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#f1f3f5' }} 
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.name}</h4>
                      <p style={{ fontWeight: 800, color: 'var(--primary)' }}>₩ {itemPrice.toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        ><Minus size={14} /></button>
                        <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        ><Plus size={14} /></button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fa5252' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: '#f8f9fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>총 금액</span>
              <span>₩ {cartTotal.toLocaleString()}</span>
            </div>
            <button 
              className="btn-premium" 
              style={{ width: '100%', padding: '1.2rem', justifyContent: 'center', fontSize: '1.1rem' }}
              onClick={() => {
                setIsCartOpen(false);
                // Navigate to checkout with the first item (since checkout currently expects a single item in state)
                // If we want multiple items, we should update Checkout.jsx to read from useCart().
                // But for now, we can pass the whole cart to checkout, or just go to checkout.
                navigate('/checkout', { state: { product: cart[0] } });
              }}
            >
              주문 및 결제하기
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CartSidebar;
