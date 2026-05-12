import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Battery } from 'lucide-react';

const RefurbishedPolicy = () => {
  const policies = [
    {
      icon: <Truck size={32} />,
      title: "무료 배송",
      desc: "모든 주문건에 대해 전국 무료 배송 서비스를 제공합니다."
    },
    {
      icon: <RotateCcw size={32} />,
      title: "30일 반품 보장",
      desc: "제품 수령 후 30일 이내라면 이유 불문 반품이 가능합니다."
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "1년 무상 보증",
      desc: "전문 엔지니어의 100가지 항목 검수를 통과한 제품으로 1년간 보증합니다."
    },
    {
      icon: <Battery size={32} />,
      title: "배터리 정책",
      desc: "모든 제품은 신품 대비 80% 이상의 배터리 효율을 보장합니다. (보증 제외)"
    }
  ];

  return (
    <section className="policy-section" style={{ padding: '5rem 0', background: 'var(--card-bg)' }}>
      <div className="container">
        <h2 className="policy-title" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>리맨의 약속</h2>
        <div className="policy-grid">
          {policies.map((p, i) => (
            <div key={i} className="policy-card glass">
              <div className="policy-icon">
                {p.icon}
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .policy-section {
            padding: 3rem 0 !important;
          }
          .policy-title {
            font-size: 1.75rem !important;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RefurbishedPolicy;
