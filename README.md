# REMAN B2B Closed User Mall

폐쇄형 B2B 리퍼 노트북 쇼핑몰 플랫폼입니다. 관리자 페이지를 통해 상품 상세 사양 및 마케팅 내용을 동적으로 관리할 수 있습니다.

## 주요 기능
- **관리자 콘솔 (Admin Dashboard)**: 상품 등록, 수정, 재고 관리 및 사양표/상세 설명 에디터 기능 제공
- **동적 사양표**: 각 상품별로 다른 기술 사양(CPU, RAM 등)을 테이블 형태로 동적 구성 가능
- **리치 텍스트 에디터**: 상품 상세 설명을 시각적으로 편집 가능 (`react-simple-wysiwyg` 적용)
- **로컬 데이터 유지**: `products.json` 파일을 통한 로컬 데이터베이스 연동 및 영속성 유지

## 설치 및 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 백엔드 서버 실행 (API Server)
```bash
node server.js
```
*백엔드 서버는 `http://localhost:5001`에서 실행됩니다.*

### 3. 프런트엔드 실행 (Vite Dev Server)
```bash
npm run dev
```
*프런트엔드는 `http://localhost:5000`에서 실행되며, API 요청은 5001번 포트로 프록시 처리됩니다.*

## 기술 스택
- **Frontend**: React 19, Vite, Lucide React, Framer Motion
- **Backend**: Node.js, Express
- **Editor**: React Simple WYSIWYG
- **Styling**: Vanilla CSS (Custom Design System)

## 라이선스
AUTHORIZED ACCESS ONLY - B2B Closed User Mall Template
