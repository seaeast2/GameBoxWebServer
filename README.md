GameBoxWebServer
=================

간단한 설명: 이 저장소는 백엔드(`packages/backend`)와 프론트엔드(`packages/frontend`)를 포함한 npm 워크스페이스 구조입니다. 이 문서는 `pnpm` 대신 `npm`으로 작업하는 방법을 설명합니다.

**Requirements**
- **Node**: v16 이상 권장
- **npm**: v7 이상 (워크스페이스 지원)

**설치 (루트)**
- 루트에서 의존성 설치:

```bash
npm install
```

루트에서 실행하면 워크스페이스의 모든 패키지 의존성이 설치됩니다.

**개발 서버 실행**
- 백엔드만:

```bash
npm run dev:backend
```

- 프론트엔드만:

```bash
npm run dev:frontend
```

- 둘 다 동시에 (루트):

```bash
npm run dev
```

위 명령들은 루트의 `package.json`에 정의된 스크립트를 사용합니다.

**주요 스크립트 설명**
- `install:all`: `npm install` (루트에서 모든 워크스페이스 설치)
- `dev:backend`: `npm -w packages/backend run dev`
- `dev:frontend`: `npm -w packages/frontend run dev`
- `dev`: `concurrently "npm -w packages/backend run dev" "npm -w packages/frontend run dev"`

**pnpm에서 npm으로 전환한 경우(필요 시 수행)**
- 프로젝트 루트에서 `pnpm` 관련 파일 제거:

```bash
rm -f pnpm-lock.yaml pnpm-workspace.yaml
# Windows PowerShell:
# Remove-Item pnpm-lock.yaml, pnpm-workspace.yaml -Force
```

- 전역 `pnpm` 제거(선택적):

```bash
npm uninstall -g pnpm
# 또는 macOS Homebrew: brew uninstall pnpm
# Windows Chocolatey: choco uninstall pnpm
```

- 잠재적 충돌 제거 후 잠금파일 재생성:

```bash
npm install
```

**CI/배포 관련**
- CI에서는 `pnpm` 대신 `npm ci` 사용을 권장합니다. (lockfile이 존재할 때)

**문제 해결**
- `workspaces` 관련 경고가 계속 나오는 경우 `npm` 버전을 확인하세요: `npm -v` (v7+ 필요)
- `pnpm` 관련 잔여 파일(`pnpm-lock.yaml`, `pnpm-workspace.yaml`)이 있으면 삭제 후 `npm install`을 실행하세요.

추가로 README에 더 넣을 내용이나, CI/배포 스크립트 변환을 원하시면 알려주세요.
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
