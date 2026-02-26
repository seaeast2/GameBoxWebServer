# GameBoxWebServer

간단한 설명: 이 저장소는 백엔드(`packages/backend`)와 프론트엔드(`packages/frontend`)를 포함한 npm 워크스페이스 구조입니다.

**Requirements**

- **Node**: v16 이상 권장
- **npm**: v7 이상 (워크스페이스 지원)

**설치 (루트)**

- 루트에서 의존성 설치:

```bash
npm install
```

- 데이터 베이스 접속 설정
- Oracle Autonomous Database 지갑을 다운로드하여 `packages/backend` 디렉토리에 `wallet` 폴더로 압축 해제
- `packages/backend/.env` 파일을 생성하고 ID, PW, DB_CONNECTION_STRING을 설정

```env
# Oracle Autonomous Database Configuration
DB_USER=ADMIN
DB_PASSWORD=
DB_CONNECT_STRING=

# Wallet Configuration (extracted wallet directory path)
WALLET_DIR=
WALLET_PASSWORD=

# JWT Configuration
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
```

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
