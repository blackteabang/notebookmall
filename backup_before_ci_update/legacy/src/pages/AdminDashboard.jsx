import React, { useState } from 'react';
import { LayoutDashboard, Laptop, Users, Award, Plus, Search, Filter, MoreVertical, Edit, Trash2, Shield, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { Editor, EditorProvider, Toolbar } from 'react-simple-wysiwyg';
import { coordinators } from '../data/coordinators';

// --- [관리자 대시보드 메인 컴포넌트] ---
// 사이드바 메뉴를 통해 여러 관리 화면(상품, 주문, 회원 등)으로 탭을 전환하는 역할을 합니다.
const AdminDashboard = () => {
  // 현재 선택된 탭을 관리하는 상태 (기본값: 상품 등록 및 관리)
  const [activeTab, setActiveTab] = useState('products');
  const { loading } = useProducts();

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: '상품 등록 및 관리', icon: <Laptop size={20} /> },
    { id: 'orders', label: '상품 판매 내역', icon: <ShoppingCart size={20} /> },
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
            {/* 선택된 탭(activeTab)에 따라 화면 우측 영역에 렌더링할 컴포넌트를 결정합니다. */}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'coordinators' && <CoordinatorManagement />}
          </>
        )}
        {activeTab === 'dashboard' && <DashboardOverview />}
      </main>
    </div>
  );
};

// --- [대시보드 개요 컴포넌트] ---
// 전체 매출 KPI, 코디네이터별 실적 랭킹, 최근 주문 현황을 한눈에 보여줍니다.
const DashboardOverview = () => {
  const { orders } = useOrders();

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.date && o.date.startsWith(today));
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;

  // 코디네이터별 실적 집계: 실주문 데이터 기준
  const coordStats = coordinators.map(c => {
    const coordOrders = orders.filter(o => o.coordinatorCode === c.code);
    const revenue = coordOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const count = coordOrders.length;
    return { ...c, revenue, count };
  }).sort((a, b) => b.revenue - a.revenue);

  // 최근 주문 5건
  const recentOrders = [...orders].reverse().slice(0, 5);

  const rankColors = {
    Gold: { bg: '#fff9e6', text: '#e67700', bar: '#f59f00' },
    Silver: { bg: '#f1f3f5', text: '#495057', bar: '#868e96' },
    Bronze: { bg: '#fff4f2', text: '#c0392b', bar: '#d9480f' },
  };

  // 실적 바 너비 계산 (최고 실적 기준 100%)
  const maxRevenue = Math.max(...coordStats.map(c => c.revenue), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 헤더 */}
      <div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.3rem' }}>대시보드</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      {/* KPI 카드 3개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { label: '총 주문 건수', value: `${totalOrders}건`, sub: `오늘 ${todayOrders.length}건`, icon: '🛒', color: '#e7f5ff', accent: '#1971c2' },
          { label: '누적 총 매출', value: `₩ ${(totalRevenue / 10000).toFixed(0)}만`, sub: `${totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0}원 / 건 평균`, icon: '💰', color: '#ebfbee', accent: '#2f9e44' },
          { label: '코디네이터 수', value: `${coordinators.length}명`, sub: `활성 ${coordStats.filter(c => c.count > 0).length}명 실적 보유`, icon: '🏆', color: '#fff9e6', accent: '#e67700' },
        ].map((card, i) => (
          <div key={i} className="glass" style={{ background: '#fff', borderRadius: '20px', padding: '1.8rem 2rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{card.label}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: card.accent }}>{card.value}</h3>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {card.icon}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 아래: 코디네이터 실적 + 최근 주문 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* 코디네이터 실적 랭킹 */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🏅</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>코디네이터 실적 랭킹</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>실제 주문 기준</span>
          </div>
          <div style={{ padding: '1.2rem 1.8rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {coordStats.map((c, idx) => {
              const colors = rankColors[c.rank] || rankColors.Bronze;
              const barWidth = maxRevenue > 0 ? (c.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: idx === 0 ? '#f59f00' : idx === 1 ? '#868e96' : '#aaa', minWidth: '1.2rem' }}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>코드: {c.code}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: colors.text, fontSize: '1rem' }}>₩ {c.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                  {/* 실적 바 */}
                  <div style={{ height: '6px', background: '#f1f3f5', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barWidth}%`, background: colors.bar, borderRadius: '99px', transition: 'width 0.6s ease' }} />
                  </div>
                  {/* 등급 뱃지 + 주문 건수 뱃지 */}
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px', background: colors.bg, color: colors.text }}>
                      {c.rank}
                    </span>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.7rem',
                      borderRadius: '99px',
                      background: c.count > 0 ? '#e7f5ff' : '#f1f3f5',
                      color: c.count > 0 ? '#1971c2' : '#adb5bd',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      {c.count}건
                    </span>
                  </div>
                </div>
              );
            })}
            {coordStats.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>코디네이터 데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 최근 주문 현황 */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📋</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>최근 주문 현황</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>최신 5건</span>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>주문 내역이 없습니다.</p>
            ) : recentOrders.map(order => {
              const normStatus = ['처리전', '입금확인', '배송완료'].includes(order.status) ? order.status : (order.status === '결제완료' ? '입금확인' : '처리전');
              const statusStyle = {
                '처리전': { bg: '#f1f3f5', text: '#495057' },
                '입금확인': { bg: '#fff9e6', text: '#e67700' },
                '배송완료': { bg: '#ebfbee', text: '#2f9e44' },
              }[normStatus] || { bg: '#f1f3f5', text: '#555' };
              const itemSummary = order.items?.map(i => i.name).join(', ') || '상품 정보 없음';
              return (
                <div key={order.id} style={{ padding: '1rem 1.8rem', borderBottom: '1px solid #f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.buyerInfo?.name || '미상'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {itemSummary}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>₩ {(order.totalAmount || 0).toLocaleString()}</div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', background: statusStyle.bg, color: statusStyle.text }}>
                      {normStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

// --- [상품 등록 및 관리 탭 컴포넌트] ---
// 상품 목록 조회, 새로운 상품 등록, 기존 상품 수정 및 삭제 로직을 포함합니다.
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
  const [status, setStatus] = useState('판매중');

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
      status: status,
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
    setStatus(p.status || '판매중');
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
    setName(''); setSpecs(''); setBasePrice(0); setDiscount(0); setStock(0); setInitialStock(0); setStatus('판매중');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editingId ? '상품 정보 수정' : '신규 상품 등록'}</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-premium" style={{ padding: '0.8rem 2rem' }} onClick={handleSaveProduct}>
                {editingId ? '수정완료' : '등록하기'}
              </button>
              <button className="btn-secondary" style={{ padding: '0.8rem 2rem' }} onClick={resetForm}>취소</button>
            </div>
          </div>
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
                <label style={formLabelStyle}>판매 상태</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ ...inputStyle, flex: 1, cursor: 'pointer', maxWidth: '200px' }}
                >
                  <option value="판매중">판매중</option>
                  <option value="판매종료">판매종료</option>
                  <option value="판매중지">판매중지</option>
                </select>
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
                <label style={formLabelStyle}>코디네이터 할인</label>
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
                <label style={formLabelStyle}>최종 할인가</label>
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
              {[...products].sort((a, b) => {
                const order = { '판매중': 1, '판매중지': 2, '판매종료': 3 };
                const aVal = order[a.status || '판매중'] || 4;
                const bVal = order[b.status || '판매중'] || 4;
                return aVal - bVal;
              }).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '1.5rem', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '1.5rem' }}>₩ {p.price}</td>
                  <td style={{ padding: '1.5rem' }}>{p.stock || 0}대</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      background: p.status === '판매중' ? '#e6fcf5' : p.status === '판매종료' ? '#f1f3f5' : '#fff5f5',
                      color: p.status === '판매중' ? '#099268' : p.status === '판매종료' ? '#868e96' : '#fa5252',
                      fontWeight: 600
                    }}>
                      {p.status || '판매중'}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleEditClick(p)}
                        style={{ border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: '#495057', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center' }}
                      >
                        <Edit size={14} style={{ marginRight: '0.3rem' }} /> 수정
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('정말로 이 상품을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) {
                            deleteProduct(p.id);
                          }
                        }}
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
  color: isActive ? '#fff' : '#888',
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
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [orders] = useState([
    { id: 'ORD-20260425-01', date: '2026-04-25', productName: '삼성 갤럭시북 Pro', quantity: 1, amount: 1550000, coordinatorCode: 'JANE2024', status: '결제완료' },
    { id: 'ORD-20260426-02', date: '2026-04-26', productName: 'LG 그램 16', quantity: 2, amount: 2800000, coordinatorCode: 'JANE2024', status: '배송중' },
    { id: 'ORD-20260427-01', date: '2026-04-27', productName: '삼성 갤럭시북 Pro', quantity: 1, amount: 1550000, coordinatorCode: 'JOHN777', status: '배송완료' },
    { id: 'ORD-20260428-03', date: '2026-04-28', productName: 'Dell XPS 15', quantity: 1, amount: 2100000, coordinatorCode: 'JANE2024', status: '결제완료' }
  ]);

  if (selectedCoordinator) {
    const coordinatorOrders = orders.filter(o => o.coordinatorCode === selectedCoordinator.code);
    const totalAmount = coordinatorOrders.reduce((sum, order) => sum + order.amount, 0);

    return (
      <div className="animate-fade-in">
        <button onClick={() => setSelectedCoordinator(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> 코디네이터 목록으로 돌아가기
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {selectedCoordinator.name} 코디네이터
            </h2>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>할인 코드: {selectedCoordinator.code}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>현재 등급</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedCoordinator.rank === 'Gold' ? '#f59f00' : selectedCoordinator.rank === 'Silver' ? '#868e96' : '#d9480f' }}>
              {selectedCoordinator.rank}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', background: '#fff', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>누적 판매 건수</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{coordinatorOrders.length}건</h3>
          </div>
          <div className="glass" style={{ padding: '2rem', background: '#fff', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>누적 발생 실적 (매출액)</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>₩ {totalAmount.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass" style={{ background: '#fff', borderRadius: '24px', padding: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', padding: '0.5rem 1rem' }}>주문 기록 상세</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', background: '#f8f9fa' }}>
                <th style={{ padding: '1.2rem 1.5rem' }}>주문일자</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>주문번호</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>상품명</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>수량</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>결제금액</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {coordinatorOrders.length > 0 ? (
                coordinatorOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 600 }}>{order.id}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>{order.productName}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>{order.quantity}개</td>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>₩ {order.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        background: order.status === '결제완료' ? '#e6fcf5' : order.status === '배송중' ? '#e7f5ff' : '#f1f3f5',
                        color: order.status === '결제완료' ? '#099268' : order.status === '배송중' ? '#1971c2' : '#495057',
                        fontWeight: 600
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    해당 코드로 진행된 주문 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const filteredCoordinators = coordinators.filter(c =>
    c.name.includes(searchTerm) || c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>세일즈 코디네이터 관리</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={18} />
          <input
            type="text"
            placeholder="이름 또는 할인코드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '50px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>
      </div>
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
            {filteredCoordinators.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '1.5rem', color: 'var(--secondary)', fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '1.5rem' }}>₩ {c.performance.toLocaleString()}</td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ fontWeight: 800, color: c.rank === 'Gold' ? '#f59f00' : c.rank === 'Silver' ? '#868e96' : '#d9480f' }}>
                    {c.rank}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <button
                    onClick={() => setSelectedCoordinator(c)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                  >
                    <Edit size={18} /> 상세 보기
                  </button>
                </td>
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

const OrderManagement = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderBuyer, setSelectedOrderBuyer] = useState(null);

  // New state for date and coordinator filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  if (loading) return <div>주문 내역을 불러오는 중...</div>;


  const uniqueCodes = Array.from(new Set(orders.map(o => o.coordinatorCode).filter(Boolean)));

  // 상단 필터 조건에 따라 화면에 표시될 주문 목록을 걸러냅니다.
  const filteredOrders = orders.filter(o => {
    // 1. 검색어 필터 (주문번호, 구매자명, 코디네이터 코드)
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.buyerInfo?.name && o.buyerInfo.name.includes(searchTerm)) ||
      (o.coordinatorCode && o.coordinatorCode.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. 코디네이터 코드 필터
    const matchesCode = selectedCode ? o.coordinatorCode === selectedCode : true;

    // 3. 처리 상태 필터 (구버전 데이터인 '결제완료'를 '입금확인'으로 보정)
    const normStatus = ['처리전', '입금확인', '배송완료'].includes(o.status) ? o.status : (o.status === '결제완료' ? '입금확인' : '처리전');
    const matchesStatus = selectedStatusFilter ? normStatus === selectedStatusFilter : true;

    // 4. 주문 기간(날짜) 필터
    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = new Date(o.date);
      if (startDate) {
        matchesDate = matchesDate && orderDate >= new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && orderDate <= end;
      }
    }

    return matchesSearch && matchesCode && matchesStatus && matchesDate;
  });

  // --- [CSV 다운로드 함수] ---
  // 현재 필터링된 주문 목록을 CSV 파일로 변환하여 브라우저에서 바로 다운로드합니다.
  const handleDownloadCSV = () => {
    if (filteredOrders.length === 0) {
      alert('다운로드할 내역이 없습니다.');
      return;
    }

    // CSV 셀 값을 안전하게 감싸는 헬퍼 함수 (쉼표/따옴표 포함 시 처리)
    const escape = (val) => {
      const str = String(val ?? '');
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const headers = ['처리상태', '주문일시', '주문번호', '주문자명', '연락처', '배송주소', '주문상품', '결제방법', '수량', '결제금액', '코디네이터코드'];

    const rows = [...filteredOrders].reverse().map(order => {
      const normStatus = ['처리전', '입금확인', '배송완료'].includes(order.status)
        ? order.status
        : (order.status === '결제완료' ? '입금확인' : '처리전');
      const itemNames = order.items?.map(i => `${i.name} x${i.quantity}`).join(' / ') || '';
      const totalQty = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 1;
      const payMethod = { card: '신용카드', bank: '무통장입금', group_buy: '공동구매', coordinator: '코디네이터 전달' }[order.paymentMethod] || order.paymentMethod || '-';

      return [
        escape(normStatus),
        escape(order.date),
        escape(order.id),
        escape(order.buyerInfo?.name || '미상'),
        escape(order.buyerInfo?.contact || ''),
        escape(order.buyerInfo?.address || ''),
        escape(itemNames),
        escape(payMethod),
        escape(totalQty),
        escape(order.totalAmount || 0),
        escape(order.coordinatorCode || ''),
      ].join(',');
    });

    // BOM(\uFEFF) 추가: 한글이 깨지지 않도록 Excel용 UTF-8 BOM 적용
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `판매내역_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {selectedOrderBuyer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedOrderBuyer(null)}>
          <div className="glass" style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', width: '400px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedOrderBuyer(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>주문자 상세 정보</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>주문번호</div>
                <div style={{ fontWeight: 600 }}>{selectedOrderBuyer.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>주문자 이름</div>
                <div style={{ fontWeight: 600 }}>{selectedOrderBuyer.buyerInfo?.name || '미상'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>연락처</div>
                <div style={{ fontWeight: 600 }}>{selectedOrderBuyer.buyerInfo?.contact || '연락처 없음'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>배송 주소</div>
                <div style={{ fontWeight: 600, lineHeight: 1.5 }}>{selectedOrderBuyer.buyerInfo?.address || '주소 없음'}</div>
              </div>
            </div>
            <button onClick={() => setSelectedOrderBuyer(null)} className="btn-premium" style={{ width: '100%', marginTop: '2rem', padding: '1rem', justifyContent: 'center' }}>
              닫기
            </button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>상품 판매 내역</h2>
          <button
            className="btn-premium"
            onClick={handleDownloadCSV}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            내역 다운로드 (CSV)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>기간</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none' }}
            />
            <span style={{ color: 'var(--text-muted)' }}>~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>



          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }}></div>



          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={18} />
            <input
              type="text"
              placeholder="주문번호, 구매자명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.8rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className="glass" style={{ background: '#fff', borderRadius: '24px', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', background: '#f8f9fa' }}>
              <th style={{ padding: '1.5rem', width: '150px' }}>
                <select
                  value={selectedStatusFilter}
                  onChange={e => setSelectedStatusFilter(e.target.value)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    background: '#fff',
                    fontWeight: 600,
                    color: '#495057',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">처리 상태 (전체)</option>
                  <option value="처리전">처리전</option>
                  <option value="입금확인">입금확인</option>
                  <option value="배송완료">배송완료</option>
                </select>
              </th>
              <th style={{ padding: '1.5rem' }}>주문일시/번호</th>
              <th style={{ padding: '1.5rem' }}>주문자 정보</th>
              <th style={{ padding: '1.5rem' }}>주문 상품</th>
              <th style={{ padding: '1.5rem' }}>결제/수량</th>
              <th style={{ padding: '1.5rem' }}>결제 금액</th>
              <th style={{ padding: '1.5rem', width: '150px' }}>
                <select
                  value={selectedCode}
                  onChange={e => setSelectedCode(e.target.value)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    background: '#fff',
                    fontWeight: 600,
                    color: '#495057',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">코디네이터 (전체)</option>
                  {uniqueCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  판매 내역이 없습니다.
                </td>
              </tr>
            ) : (
              [...filteredOrders].reverse().map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '1.5rem' }}>
                    <select
                      value={['처리전', '입금확인', '배송완료'].includes(order.status) ? order.status : (order.status === '결제완료' ? '입금확인' : '처리전')}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        border: '1px solid var(--border)',
                        background: order.status === '배송완료' ? '#e6fcf5' : (order.status === '입금확인' || order.status === '결제완료') ? '#fff3bf' : '#f1f3f5',
                        color: order.status === '배송완료' ? '#099268' : (order.status === '입금확인' || order.status === '결제완료') ? '#e67700' : '#495057',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="처리전">처리전</option>
                      <option value="입금확인">입금확인</option>
                      <option value="배송완료">배송완료</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{order.date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.id}</div>
                  </td>
                  <td
                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                    onClick={() => setSelectedOrderBuyer(order)}
                  >
                    <div style={{ fontWeight: 600, color: '#1971c2', textDecoration: 'underline' }}>{order.buyerInfo?.name || '미상'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{order.buyerInfo?.contact || '연락처 없음'}</div>
                  </td>
                  <td style={{ padding: '1.5rem', maxWidth: '250px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          • <span
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1971c2' }}
                            onClick={() => window.open(`/product/${item.id}`, '_blank')}
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div>{{
                      card: '신용카드',
                      bank: '무통장입금',
                      group_buy: '공동구매',
                      coordinator: '코디네이터 전달'
                    }[order.paymentMethod] || order.paymentMethod || '-'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      총 {order.items?.reduce((sum, i) => sum + i.quantity, 0) || 1}개
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', fontWeight: 700 }}>
                    ₩ {(order.totalAmount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    {order.coordinatorCode ? (
                      <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{order.coordinatorCode}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
