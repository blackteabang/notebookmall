import React, { useState } from 'react';
import { LayoutDashboard, Laptop, Users, Award, Plus, Search, Filter, MoreVertical, Edit, Trash2, Shield } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Editor, EditorProvider, Toolbar } from 'react-simple-wysiwyg';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { loading } = useProducts();

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: '상품 등록 및 관리', icon: <Laptop size={20} /> },
    { id: 'users', label: '회원 정보 관리', icon: <Users size={20} /> },
    { id: 'coordinators', label: '코디네이터 관리', icon: <Award size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: '#fff', 
        borderRight: '1px solid var(--border)',
        padding: '2rem 1rem'
      }}>
        <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>Admin Console</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>리맨 마켓 관리자 센터</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                color: activeTab === item.id ? '#fff' : 'var(--text-muted)',
                fontWeight: activeTab === item.id ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.1s'
              }}
            >
              <span style={{ color: activeTab === item.id ? '#fff' : 'var(--text-muted)' }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>Loading...</div>
        ) : (
          <>
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'coordinators' && <CoordinatorManagement />}
          </>
        )}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>환영합니다, 관리자님</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div className="glass" style={{ padding: '2rem', background: '#fff' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>오늘의 주문</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>12건</h3>
              </div>
              <div className="glass" style={{ padding: '2rem', background: '#fff' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>신규 회원</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>5명</h3>
              </div>
              <div className="glass" style={{ padding: '2rem', background: '#fff' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>총 매출</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>₩ 12.4M</h3>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Sub-components ---

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [specs, setSpecs] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [point3, setPoint3] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [detailImage, setDetailImage] = useState('');
  const [manufacturerLink, setManufacturerLink] = useState('');
  const [marketingDesc, setMarketingDesc] = useState('');
  const [detailedSpecs, setDetailedSpecs] = useState([
    { label: '프로세서', value: '' },
    { label: '메모리', value: '' },
    { label: '저장공간', value: '' },
    { label: '디스플레이', value: '' },
    { label: '그래픽', value: '' },
    { label: '배터리', value: '' },
    { label: '무게', value: '' },
    { label: '운영체제', value: '' }
  ]);

  const [initialStock, setInitialStock] = useState(0);

  const discountedPrice = basePrice - discount;

  const handleSaveProduct = async () => {
    if (!name || !basePrice) {
      alert('상품명과 판매가는 필수 입력 사항입니다.');
      return;
    }

    const productData = {
      name,
      price: (Number(basePrice) - Number(discount)).toLocaleString(),
      basePrice: Number(basePrice),
      specs,
      images: [mainImage || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400"],
      detailImage,
      manufacturerLink,
      rating: 5.0,
      stock: Number(stock),
      initialStock: Number(initialStock || stock),
      status: Number(stock) > 0 ? "판매중" : "품절",
      inspectionPoints: [point1, point2, point3].filter(p => p !== ''),
      marketingDesc,
      detailedSpecs: detailedSpecs.filter(s => s.label.trim() || s.value.trim())
    };

    console.log('Saving Product Data:', productData);

    if (editingId) {
      await updateProduct({ ...productData, id: editingId });
    } else {
      await addProduct(productData);
    }

    resetForm();
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setSpecs(p.specs || '');
    const numericPrice = p.basePrice || parseInt(String(p.price || '0').replace(/,/g, '')) || 0;
    setBasePrice(numericPrice);
    setDiscount(p.discount || 0);
    setStock(p.stock || 0);
    setInitialStock(p.initialStock || p.stock || 0);
    setPoint1(p.inspectionPoints?.[0] || '');
    setPoint2(p.inspectionPoints?.[1] || '');
    setPoint3(p.inspectionPoints?.[2] || '');
    setMainImage(p.images?.[0] || '');
    setDetailImage(p.detailImage || '');
    setManufacturerLink(p.manufacturerLink || '');
    setMarketingDesc(p.marketingDesc || '');
    setDetailedSpecs(p.detailedSpecs?.length ? p.detailedSpecs : [
      { label: '프로세서', value: '' },
      { label: '메모리', value: '' },
      { label: '저장공간', value: '' },
      { label: '디스플레이', value: '' },
      { label: '그래픽', value: '' },
      { label: '배터리', value: '' },
      { label: '무게', value: '' },
      { label: '운영체제', value: '' }
    ]);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setName(''); setSpecs(''); setBasePrice(0); setDiscount(0); setStock(0); setInitialStock(0);
    setPoint1(''); setPoint2(''); setPoint3('');
    setMainImage(''); setDetailImage(''); setManufacturerLink('');
    setMarketingDesc('');
    setDetailedSpecs([
      { label: '프로세서', value: '' },
      { label: '메모리', value: '' },
      { label: '저장공간', value: '' },
      { label: '디스플레이', value: '' },
      { label: '그래픽', value: '' },
      { label: '배터리', value: '' },
      { label: '무게', value: '' },
      { label: '운영체제', value: '' }
    ]);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>상품 등록 및 관리</h2>
        <button 
          className="btn-premium" 
          onClick={() => { resetForm(); setShowAddForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> 신규 상품 등록
        </button>
      </div>

      {showAddForm ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editingId ? '상품 정보 수정' : '신규 상품 등록'}</h3>
          {/* 0. 기본정보 Section */}
          <div style={formSectionStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>기본정보</h3>
            </div>
            <div style={formContentStyle}>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>상품명 <span style={{ color: '#fa5252' }}>•</span></label>
                <input 
                  type="text" 
                  placeholder="예: 삼성 갤럭시북 Pro" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>상세 사양</label>
                <input 
                  type="text" 
                  placeholder="예: i7 / 16GB / 512GB" 
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>제조사 제품설명 링크</label>
                <input 
                  type="text" 
                  placeholder="예: https://www.samsung.com/..." 
                  value={manufacturerLink}
                  onChange={(e) => setManufacturerLink(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
            </div>
          </div>

          {/* 이미지 첨부 Section */}
          <div style={formSectionStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>이미지 첨부</h3>
            </div>
            <div style={formContentStyle}>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>대표 이미지 URL <span style={{ color: '#fa5252' }}>•</span></label>
                <input 
                  type="text" 
                  placeholder="메인 화면에 표시될 이미지 URL" 
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>리퍼 상세 이미지 URL</label>
                <input 
                  type="text" 
                  placeholder="제품 상세 페이지에서 보여줄 리퍼 상세 설명 이미지 URL" 
                  value={detailImage}
                  onChange={(e) => setDetailImage(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} 
                />
              </div>
            </div>
          </div>
          {/* ... [Rest of the form sections kept the same, just calling handleSaveProduct and resetForm] ... */}


          {/* 1. 판매가격 설정 Section */}
          <div style={formSectionStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>판매가 <span style={{ color: '#fa5252' }}>•</span></h3>
            </div>
            <div style={formContentStyle}>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>판매가 <span style={{ color: '#fa5252' }}>•</span></label>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    value={basePrice} 
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    style={{ ...inputStyle, width: '300px' }} 
                  /> 
                  <span>원</span>
                </div>
              </div>

              <div style={formRowStyle}>
                <label style={formLabelStyle}>할인</label>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button onClick={() => setDiscount(0)} style={toggleButtonStyle(discount === 0)}>설정안함</button>
                    <button onClick={() => setDiscount(1)} style={toggleButtonStyle(discount > 0)}>설정함</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      placeholder="할인금액" 
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      style={{ ...inputStyle, width: '200px' }} 
                    /> 
                    <span>원 할인</span>
                  </div>
                </div>
              </div>

              <div style={formRowStyle}>
                <label style={formLabelStyle}>할인가</label>
                <div style={{ flex: 1, fontWeight: 700, color: 'var(--secondary)', fontSize: '1.1rem' }}>
                  {discountedPrice.toLocaleString()} 원
                </div>
              </div>
            </div>
          </div>

          {/* 리퍼 검수 특징 Section */}
          <div style={formSectionStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>리퍼 검수 특징 (간단 요약)</h3>
            </div>
            <div style={formContentStyle}>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>특징 1</label>
                <input type="text" value={point1} onChange={(e) => setPoint1(e.target.value)} style={inputStyle} />
              </div>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>특징 2</label>
                <input type="text" value={point2} onChange={(e) => setPoint2(e.target.value)} style={inputStyle} />
              </div>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>특징 3</label>
                <input type="text" value={point3} onChange={(e) => setPoint3(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 마케팅 설명 및 상세 사양 Section */}
          <div style={formSectionStyle}>
            <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>상품 상세 설명 및 사양</h3>
            </div>
            <div style={formContentStyle}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ ...formLabelStyle, display: 'block', marginBottom: '0.5rem', width: '100%' }}>리퍼 상세 설명 (에디터)</label>
                <div style={{ background: '#fff', minHeight: '300px' }}>
                  <EditorProvider>
                    <Editor value={marketingDesc} onChange={(e) => setMarketingDesc(e.target.value)} style={{ minHeight: '250px' }}>
                      <Toolbar />
                    </Editor>
                  </EditorProvider>
                </div>
              </div>

              <div>
                <label style={{ ...formLabelStyle, display: 'block', marginBottom: '0.5rem', width: '100%' }}>상세 사양 (Specifications)</label>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border)' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '0.8rem', borderBottom: '1px solid var(--border)', textAlign: 'left', width: '25%' }}>항목 (예: 프로세서)</th>
                      <th style={{ padding: '0.8rem', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>상세 내용</th>
                      <th style={{ padding: '0.8rem', borderBottom: '1px solid var(--border)', textAlign: 'center', width: '10%' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedSpecs.map((spec, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                          <input 
                            type="text" 
                            value={spec.label} 
                            onChange={e => {
                              const newSpecs = [...detailedSpecs];
                              newSpecs[index].label = e.target.value;
                              setDetailedSpecs(newSpecs);
                            }}
                            style={{ ...inputStyle, padding: '0.6rem' }} 
                          />
                        </td>
                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                          <input 
                            type="text" 
                            value={spec.value} 
                            onChange={e => {
                              const newSpecs = [...detailedSpecs];
                              newSpecs[index].value = e.target.value;
                              setDetailedSpecs(newSpecs);
                            }}
                            style={{ ...inputStyle, padding: '0.6rem' }} 
                          />
                        </td>
                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <button 
                            onClick={() => setDetailedSpecs(detailedSpecs.filter((_, i) => i !== index))}
                            style={{ background: 'none', border: 'none', color: '#fa5252', cursor: 'pointer' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={() => setDetailedSpecs([...detailedSpecs, { label: '', value: '' }])}
                  style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#f1f5f9', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  <Plus size={16} /> 행 추가하기
                </button>
              </div>
            </div>
          </div>

          <div style={formSectionStyle}>
             <div style={formHeaderStyle}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>재고수량 <span style={{ color: '#fa5252' }}>•</span></h3>
            </div>
            <div style={formContentStyle}>
              <div style={formRowStyle}>
                <label style={formLabelStyle}>재고수량 <span style={{ color: '#fa5252' }}>•</span></label>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} style={{ ...inputStyle, width: '150px' }} /> 
                  <span>개</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-premium" style={{ padding: '1.2rem 4rem' }} onClick={handleSaveProduct}>
              {editingId ? '수정완료' : '등록하기'}
            </button>
            <button className="btn-secondary" style={{ padding: '1.2rem 4rem' }} onClick={resetForm}>취소</button>
          </div>
        </div>
      ) : (
        <div className="glass" style={{ background: '#fff', borderRadius: '24px', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '1.5rem' }}>상품명</th>
                <th style={{ padding: '1.5rem' }}>판매가</th>
                <th style={{ padding: '1.5rem' }}>재고</th>
                <th style={{ padding: '1.5rem' }}>상태</th>
                <th style={{ padding: '1.5rem' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '1.5rem', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '1.5rem' }}>₩ {p.price}</td>
                  <td style={{ padding: '1.5rem' }}>{p.stock || 0}대</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '50px', 
                      fontSize: '0.8rem',
                      background: (p.stock > 0 || p.status === '판매중') ? '#e6fcf5' : '#fff5f5',
                      color: (p.stock > 0 || p.status === '판매중') ? '#099268' : '#fa5252',
                      fontWeight: 600
                    }}>
                      {p.stock > 0 ? "판매중" : "품절"}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEditClick(p)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#777' }}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#fa5252' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const formSectionStyle = {
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  overflow: 'hidden'
};

const formHeaderStyle = {
  padding: '1.2rem 1.5rem',
  background: '#fcfcfc',
  borderBottom: '1px solid #eee'
};

const formContentStyle = {
  padding: '1.5rem'
};

const formRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '1rem 0',
  borderBottom: '1px solid #f5f5f5'
};

const formLabelStyle = {
  width: '180px',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#555',
  paddingTop: '0.5rem'
};

const toggleButtonStyle = (isActive) => ({
  padding: '0.6rem 1.5rem',
  borderRadius: '4px',
  border: '1px solid ' + (isActive ? 'var(--secondary)' : '#ddd'),
  background: isActive ? 'var(--secondary)' : '#fff',
  color: isActive ? '#000' : '#888',
  fontWeight: isActive ? 700 : 400,
  cursor: 'pointer'
});

const imageUploadBoxStyle = {
  width: '150px',
  height: '150px',
  border: '2px dashed #eee',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  background: '#fbfbfb'
};

const imageUploadBoxSmallStyle = {
  width: '80px',
  height: '80px',
  border: '1px solid #eee',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  background: '#fbfbfb'
};

const UserManagement = () => {
  const users = [
    { id: 1, name: "김철수", email: "kim@example.com", date: "2024-04-01", orders: 3 },
    { id: 2, name: "이영희", email: "lee@example.com", date: "2024-04-12", orders: 1 },
    { id: 3, name: "박지성", email: "park@example.com", date: "2024-04-20", orders: 0 },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>회원 정보 관리</h2>
      <div className="glass" style={{ background: '#fff', borderRadius: '24px', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1.5rem' }}>이름</th>
              <th style={{ padding: '1.5rem' }}>이메일</th>
              <th style={{ padding: '1.5rem' }}>가입일</th>
              <th style={{ padding: '1.5rem' }}>주문수</th>
              <th style={{ padding: '1.5rem' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '1.5rem' }}>{u.email}</td>
                <td style={{ padding: '1.5rem' }}>{u.date}</td>
                <td style={{ padding: '1.5rem' }}>{u.orders}회</td>
                <td style={{ padding: '1.5rem' }}><MoreVertical size={18} cursor="pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CoordinatorManagement = () => {
  const [coordinators] = useState([
    { id: 1, name: "Jane Doe", code: "JANE2024", performance: "₩ 4.5M", rank: "Gold" },
    { id: 2, name: "John Smith", code: "JOHN777", performance: "₩ 2.1M", rank: "Silver" },
    { id: 3, name: "Alice Won", code: "ALICE_SC", performance: "₩ 0.8M", rank: "Bronze" },
  ]);

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>세일즈 코디네이터 관리</h2>
      <div className="glass" style={{ background: '#fff', borderRadius: '24px', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1.5rem' }}>이름</th>
              <th style={{ padding: '1.5rem' }}>할인코드</th>
              <th style={{ padding: '1.5rem' }}>실적 (총 매출)</th>
              <th style={{ padding: '1.5rem' }}>등급</th>
              <th style={{ padding: '1.5rem' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {coordinators.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '1.5rem', color: 'var(--secondary)', fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '1.5rem' }}>{c.performance}</td>
                <td style={{ padding: '1.5rem' }}>{c.rank}</td>
                <td style={{ padding: '1.5rem' }}><Edit size={18} cursor="pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  fontSize: '1rem',
  outline: 'none'
};

export default AdminDashboard;
