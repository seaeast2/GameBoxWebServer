# GameBoxWebServer

간단한 웹게임 서비스 포탈

## 빠른 시작 (로컬 개발)

요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm

루트에서 의존성 설치 (워크스페이스)

```powershell
cd d:/Works/WebWorks/GameBoxWebServer
pnpm install -w
```

백엔드 실행 (개발 모드)

```powershell
pnpm --filter ./packages/backend dev
```

프론트엔드 실행 (개발 모드)

```powershell
pnpm --filter ./packages/frontend dev
```

백엔드와 프론트 동시 실행 (루트)

```powershell
pnpm run dev
```

빌드 및 프로덕션 미리보기

```powershell
# 백엔드 빌드/시작
pnpm --filter ./packages/backend build
pnpm --filter ./packages/backend start

# 프론트엔드 빌드/미리뷰
pnpm --filter ./packages/frontend build
pnpm --filter ./packages/frontend preview
```

샘플 엔드포인트 확인

```powershell
curl http://localhost:3001/health
curl http://localhost:3001/hello
```

추가 정보

- 백엔드: `packages/backend` (NestJS)
- 프론트엔드: `packages/frontend` (React + Vite)
- 공통 타입: `packages/shared`

각 패키지의 `README.md`를 참고하세요.
