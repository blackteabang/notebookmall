# Cloudflare Tunnel 설정 가이드 (renew.refurbish.co.kr)

본 문서는 로컬 개발 환경을 Cloudflare 가상 터널을 통해 `https://renew.refurbish.co.kr`로 서비스하기 위한 설정 과정을 담고 있습니다.

## 1. Cloudflare 인증 (Login)
터미널에서 아래 명령어를 실행하여 Cloudflare 계정에 로그인하고 도메인 권한을 인증합니다.
```powershell
cloudflared tunnel login
```
*   브라우저가 열리면 Cloudflare 로그인 후 `refurbish.co.kr` 도메인을 선택하여 승인합니다.

## 2. 터널 생성 (Create)
서비스에 사용할 고유한 터널을 생성합니다.
```powershell
cloudflared tunnel create reman-prod-tunnel
```
*   생성 후 출력되는 **Tunnel ID**를 기록해 두세요.
*   자격 증명 파일(`.json`)은 자동으로 `~/.cloudflared/` 폴더에 생성됩니다.

## 3. DNS 레코드 설정 (Route DNS)
도메인(`renew.refurbish.co.kr`)이 생성한 터널을 바라보도록 DNS를 설정합니다.
```powershell
cloudflared tunnel route dns reman-prod-tunnel renew.refurbish.co.kr
```

## 4. 설정 파일 작성 (Config)
터널 동작 방식을 정의하는 `config.yml` 파일을 작성합니다.
*   파일 경로: `C:\Users\hyban.DESKTOP-T81OV0G\.cloudflared\config.yml`

```yaml
tunnel: <TUNNEL_ID>
credentials-file: C:\Users\hyban.DESKTOP-T81OV0G\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: renew.refurbish.co.kr
    service: http://localhost:5173  # 현재 서비스 중인 로컬 포트로 수정 (5000 또는 5173)
  - service: http_status:404
```

## 5. 터널 실행 (Run)
모든 설정이 완료되면 터널을 실행하여 서비스를 개시합니다.
```powershell
cloudflared tunnel run reman-prod-tunnel
```

## 6. 서비스 자동화 (선택 사항)
터미널을 닫아도 서비스가 유지되도록 Windows 서비스로 등록할 수 있습니다.
```powershell
cloudflared service install
```

---
**주의:** `ingress` 설정의 `service` 포트 번호가 실제 `npm run dev`로 실행 중인 포트와 일치해야 정상적으로 접속됩니다.
