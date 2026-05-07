# REMAN 리퍼비시 B2B 폐쇄형 몰

리맨(REMAN)의 비즈니스 파트너 및 세일즈 코디네이터를 위한 폐쇄형 B2B 리퍼 노트북 쇼핑몰 플랫폼입니다.

## 🚀 주요 기능
- **관리자 콘솔**: 실시간 상품 등록, 재고 관리 및 대시보드 기능을 제공합니다.
- **폐쇄형 몰 시스템**: 승인된 인증 코드를 입력해야 상품 정보 및 가격 확인이 가능합니다.
- **코디네이터 실적 관리**: 코디네이터별 판매 실적 랭킹 및 주문 건수를 실시간으로 시각화합니다.
- **외부 서비스 지원**: Cloudflare Tunnel을 통해 로컬 개발 환경을 외부 도메인으로 즉시 서비스합니다.

## 🛠 설치 및 실행 방법

### 1. 의존성 설치
프로젝트 루트에서 아래 명령어를 실행하여 필요한 패키지를 설치합니다.
```bash
npm install
```

### 2. 통합 서비스 실행 (Front + Back)
`concurrently`를 사용하여 프론트엔드(Vite)와 백엔드(Express) 서버를 동시에 실행합니다.
```bash
npm run dev
```
- **프론트엔드**: `http://localhost:5000`
- **백엔드**: `http://localhost:5001` (API 서버)

---

## 🌐 가상 터널(Cloudflare) 연결 방법
외부 도메인(`renew.refurbish.co.kr`)을 통해 인터넷으로 서비스하려면 다음 단계를 따릅니다.

### 1. 터널 실행
로컬 서버가 실행 중인 상태에서 새 터미널을 열고 아래 명령어를 입력합니다.
```powershell
cloudflared tunnel run reman-prod-tunnel
```

### 2. 접속 확인
- **도메인**: `https://renew.refurbish.co.kr`
- **인증 코드**: 초기 진입 시 **`1234`** 를 입력하여 입장할 수 있습니다.

### 3. (관리자용) Windows 서비스 등록
서버를 껐다 켜도 자동으로 터널이 실행되게 하려면 **관리자 권한** 터미널에서 아래 명령어를 실행하세요.
```powershell
cloudflared service install
```

---

## 📂 프로젝트 구조
- `/src/pages`: Home(인증), AdminDashboard(관리자), Checkout(주문) 등 주요 페이지
- `/src/context`: Order, Product, Cart 등 전역 상태 관리
- `server.js`: Express 기반 API 서버 및 데이터베이스 처리
- `vite.config.js`: 호스트 허용 및 프록시 설정
