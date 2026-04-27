import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Code, Shield, Lock } from 'lucide-react';

const Navbar = () => {
  const [salesCode, setSalesCode] = useState('');

  return (
    <nav style={{ 
      background: '#fff', 
      borderBottom: '2px solid var(--primary)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      padding: '0.75rem 0' 
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <div className="closed-mall-badge" style={{ fontSize: '0.65rem' }}>
            AUTHORIZED ACCESS ONLY
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <Link to="/qa" style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Technical Support</Link>
            
            <Link to="/admin" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} /> 관리자 메뉴
            </Link>
            
            <button className="btn-premium" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              MEMBER LOGIN
            </button>
            <ShoppingBag size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
