import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const ProductQA = () => {
  const [questions] = useState([
    { id: 1, title: "배터리 수명이 궁금합니다.", author: "kim***", date: "2024-04-25", status: "답변완료", secret: true },
    { id: 2, title: "리셀러 대량 구매 할인이 되나요?", author: "jason***", date: "2024-04-24", status: "검토중", secret: false },
    { id: 3, title: "배송은 얼마나 걸리나요?", author: "park***", date: "2024-04-23", status: "답변완료", secret: false }
  ]);

  return (
    <div style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>상품 문의</h3>
        <button className="btn-premium" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>문의하기</button>
      </div>

      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>상태</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>제목</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>작성자</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: q.status === '답변완료' ? '#e6fcf5' : '#fff4e6',
                    color: q.status === '답변완료' ? '#099268' : '#d9480f'
                  }}>
                    {q.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.secret && <Lock size={12} color="var(--text-muted)" />}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{q.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductQA;
