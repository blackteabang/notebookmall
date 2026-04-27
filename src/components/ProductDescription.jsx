import React from 'react';

const ProductDescription = ({ product }) => {
  if (!product) return null;

  return (
    <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border)', paddingTop: '5rem' }}>
      {/* Marketing Section */}
      {product.marketingDesc ? (
        <div style={{ textAlign: 'center', marginBottom: '5rem', fontSize: '1.2rem', color: '#444', lineHeight: '1.8' }} className="ql-editor">
          <div dangerouslySetInnerHTML={{ __html: product.marketingDesc }} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
            ✨ 2026년형 그램 프로 17, 압도적인 퍼포먼스
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.2rem', color: '#444' }}>
            <p>✔️ "Intel Core Ultra 7 프로세서로 AI 작업부터 고성능 업무까지 완벽하게."</p>
            <p>⚡ "17인치 대화면을 담고도 믿기지 않는 가벼움, 프로의 생산성을 경험하세요."</p>
            <p>🎨 "WQXGA+ 고해상도 디스플레이로 생생한 화질과 몰입감을 선사합니다."</p>
            <p>🔋 "32GB 대용량 메모리와 2TB SSD로 어떤 작업도 멈춤 없이 쾌적하게."</p>
          </div>
        </div>
      )}
      {/* Spec Table */}
      {product.detailedSpecs && product.detailedSpecs.length > 0 && (
        <div style={{ marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>상세 사양 (Specifications)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <tbody>
              {product.detailedSpecs.map((spec, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.2rem 2rem', fontWeight: 700, width: '200px', background: '#f1f3f5', color: '#555' }}>{spec.label}</td>
                  <td style={{ padding: '1.2rem 2rem', color: '#333' }}>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Condition Description Section (inspired by Rethink Mall) */}
      <div className="glass" style={{ padding: '4rem', borderRadius: '40px', background: '#fff', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>리맨의 안심 리퍼비시 보증</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🥇</div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>철저한 전문가 검수</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              전문 엔지니어가 외관 상태부터 배터리 효율, 내부 성능까지 100가지 이상의 항목을 정밀하게 검수합니다.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛠️</div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>정품 부품 사용</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              수리가 필요한 경우 오직 정품 부품만을 사용하여 신품과 동일한 성능과 안정성을 보장합니다.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📦</div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>전용 패키징 발송</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              배송 중 파손 걱정 없도록 리맨 전용 완충 패키징에 담아 안전하게 배송해 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
