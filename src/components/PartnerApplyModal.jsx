import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';

const PartnerApplyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    message: '',
    agreement: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: '', email: '', phone: '', title: '', message: '', agreement: false });
        }, 2000);
      } else {
        alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('서버 연결에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', // Changed to white
        color: 'var(--text)', // Changed to dark text
        width: '100%',
        maxWidth: '500px',
        borderRadius: '24px', // More rounded for modern look
        padding: '2.5rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={64} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>신청이 완료되었습니다!</h2>
            <p style={{ color: 'var(--text-muted)' }}>담당자가 확인 후 연락드리겠습니다.</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
              <Send size={24} /> 파트너십 문의하기
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>이름 (필수)</label>
                <div style={inputContainerStyle}>
                  <User size={18} style={iconStyle} />
                  <input 
                    type="text" name="name" required 
                    value={formData.name} onChange={handleChange}
                    placeholder="이름을 입력하세요" style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>이메일 (필수)</label>
                <div style={inputContainerStyle}>
                  <Mail size={18} style={iconStyle} />
                  <input 
                    type="email" name="email" required 
                    value={formData.email} onChange={handleChange}
                    placeholder="example@email.com" style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>연락 가능한 전화번호 (필수)</label>
                <div style={inputContainerStyle}>
                  <Phone size={18} style={iconStyle} />
                  <input 
                    type="tel" name="phone" required 
                    value={formData.phone} onChange={handleChange}
                    placeholder="010-0000-0000" style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>제목 (선택)</label>
                <div style={inputContainerStyle}>
                  <FileText size={18} style={iconStyle} />
                  <input 
                    type="text" name="title" 
                    value={formData.title} onChange={handleChange}
                    placeholder="제목을 입력하세요" style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>문의사항 (필수)</label>
                <div style={{ ...inputContainerStyle, alignItems: 'flex-start', padding: '0.75rem 1rem' }}>
                  <MessageSquare size={18} style={{ ...iconStyle, marginTop: '0.2rem' }} />
                  <textarea 
                    name="message" required 
                    value={formData.message} onChange={handleChange}
                    placeholder="내용을 입력하세요" 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" name="agreement" id="agreement" 
                  checked={formData.agreement} onChange={handleChange}
                  style={{ marginTop: '0.25rem', cursor: 'pointer' }} 
                />
                <label htmlFor="agreement" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.4 }}>
                  문의사항 해결을 위해 개인정보수집하는 것에 동의합니다.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-premium" 
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  padding: '1.2rem', 
                  marginTop: '1rem',
                  background: 'var(--primary)',
                  fontSize: '1.1rem',
                  borderRadius: '12px'
                }}
              >
                {isSubmitting ? '전송 중...' : '담당자에게 전송'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: 'var(--text)'
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8fafc',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '0 1rem',
  transition: 'all 0.2s'
};

const iconStyle = {
  color: '#94a3b8',
  marginRight: '0.75rem'
};

const inputStyle = {
  background: 'none',
  border: 'none',
  outline: 'none',
  color: 'var(--text)',
  width: '100%',
  padding: '0.85rem 0',
  fontSize: '0.95rem'
};

export default PartnerApplyModal;
