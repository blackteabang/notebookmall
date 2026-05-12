import React, { useState } from 'react';
import { MessageSquare, User, Clock, Lock } from 'lucide-react';

const QABoard = () => {
  const [questions, setQuestions] = useState([
    { id: 1, title: "배터리 수명이 궁금합니다.", author: "kim***", date: "2024-04-25", status: "답변완료", secret: true },
    { id: 2, title: "리셀러 대량 구매 할인이 되나요?", author: "jason***", date: "2024-04-24", status: "검토중", secret: false },
    { id: 3, title: "배송은 얼마나 걸리나요?", author: "park***", date: "2024-04-23", status: "답변완료", secret: false }
  ]);

  return (
    <div className="container animate-fade-in" style={{ padding: '5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>상담 게시판</h1>
          <p style={{ color: 'var(--text-muted)' }}>세일즈 코디네이터가 친절하게 상담해 드립니다.</p>
        </div>
        <button className="btn-premium">문의하기</button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.5rem', textAlign: 'left' }}>상태</th>
              <th style={{ padding: '1.5rem', textAlign: 'left' }}>제목</th>
              <th style={{ padding: '1.5rem', textAlign: 'left' }}>작성자</th>
              <th style={{ padding: '1.5rem', textAlign: 'left' }}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '50px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    background: q.status === '답변완료' ? '#e6fcf5' : '#fff4e6',
                    color: q.status === '답변완료' ? '#099268' : '#d9480f'
                  }}>
                    {q.status}
                  </span>
                </td>
                <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.secret && <Lock size={14} color="var(--text-muted)" />}
                  {q.title}
                </td>
                <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{q.author}</td>
                <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>{q.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {[1, 2, 3].map(p => (
            <button key={p} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', background: p === 1 ? 'var(--primary)' : 'transparent', color: p === 1 ? '#fff' : 'inherit' }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QABoard;
