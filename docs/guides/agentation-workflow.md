# Agentation 좌표 기반 작업 가이드

이 가이드는 Agentation 오버레이와 Agentation MCP를 함께 써서
화면 좌표 기반으로 UI 변경점을 빠르게 전달하는 흐름을 정리해요.

## 1. 프로젝트에서 오버레이 켜기

개발 서버를 실행하면 Next dev 서버와 Agentation 서버를 같이 띄워요.
Agentation 서버가 정상 응답할 때만 화면 오른쪽 아래에 툴바가 보여요.

```bash
npm run dev
```

기본 엔드포인트는 same-origin 프록시인 `/api/agentation-sync`예요.
Next 개발 서버가 내부에서 `http://127.0.0.1:4747`로 전달해서 CORS 없이 써요.
필요하면 환경변수로 바꿔서 쓸 수 있어요.

```bash
NEXT_PUBLIC_AGENTATION_ENDPOINT=/api/agentation-sync
```

Agentation 서버를 별도로만 띄우고 싶으면 아래 스크립트를 써요.

```bash
npm run dev:agentation
```

같이 자동 실행하지 않으려면 아래처럼 끌 수 있어요.

```bash
AGENTATION_AUTOSTART=false npm run dev
```

## 2. Codex MCP 서버 등록

아래 명령으로 Codex에 Agentation MCP를 등록해요.

```bash
npx -y add-mcp@latest agentation-mcp -a codex -g -y
```

등록 후 `~/.codex/config.toml`에 `mcp_servers.agentation` 항목이 생겼는지 확인해요.

```toml
[mcp_servers.agentation]
command = "npx"
args = ["-y", "agentation-mcp", "server"]
```

## 3. Agentation MCP 서버 실행

아래 명령으로 HTTP + MCP 서버를 같이 실행해요.

```bash
npx agentation-mcp server
```

기본 포트는 `4747`이에요.

## 4. 실제 작업 흐름

1. 웹 화면에서 Agentation 툴바를 켜요.
2. 수정하고 싶은 UI 요소를 클릭하거나 영역을 드래그해요.
3. 코멘트를 남기고 전송해요.
4. Codex에서 Agentation MCP 도구로 새 annotation을 받아요.
5. 코드 수정 후 annotation을 resolve 처리해요.

## 4-1. Webhook 자동 실행 흐름

개발 환경에서는 코멘트를 등록하면 webhook으로 자동 실행을 바로 트리거해요.

- 기본 webhook URL: `/api/agentation/webhook`
- 기본 동작: `annotation.add` 또는 `submit` 이벤트가 들어오면 `codex exec`를 한 번 실행하고 종료해요. webhook에 담긴 코멘트, 세션, URL 같은 정보도 함께 프롬프트에 넣어서 바로 처리해요.
- 중복 실행 방지: `.agentation/autorun.lock.json` 락 파일로 한 번에 한 프로세스만 실행해요.
- stale 실행 정리: 기본 120초를 넘기거나 45초 동안 로그가 멈춘 autorun은 다음 webhook 요청이 들어오면 정리하고 새로 실행해요.
- 로그 경로: `.agentation/autorun.log`

환경변수로 동작을 조정할 수 있어요.

```bash
NEXT_PUBLIC_AGENTATION_WEBHOOK_URL=/api/agentation/webhook
AGENTATION_AUTORUN_ENABLED=true
AGENTATION_AUTORUN_COMMAND="codex exec --full-auto -C /Users/noah/workspace/personal/eunu.log '방금 등록된 annotation을 처리해줘'"
AGENTATION_AUTORUN_MAX_AGE_MS=120000
AGENTATION_AUTORUN_IDLE_TIMEOUT_MS=45000
```

`AGENTATION_AUTORUN_COMMAND`를 지정하지 않으면 기본 `codex exec --full-auto` 명령을 사용해요.

실행 전 연결만 확인하고 싶으면 `dryRun=1`로 호출해요.

```bash
curl -X POST 'http://localhost:3000/api/agentation/webhook?dryRun=1' \
  -H 'Content-Type: application/json' \
  -d '{"event":"annotation.add","annotation":{"id":"demo"}}'
```

## 5. 자주 쓰는 점검

- 오버레이가 안 보이면 개발 환경인지 확인해요.
- annotation이 전송되지 않으면 `agentation-mcp server` 실행 상태를 확인해요.
- MCP가 안 잡히면 Codex를 재시작해요.

## 6. 권장 운영 방식

- 한 annotation에는 한 작업만 담아요.
- "무엇을 어떻게"를 짧게 적어요.
- 수정 완료 후 resolve 메시지에 변경 파일 경로를 남겨요.
