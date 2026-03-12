import { spawn } from 'node:child_process';
import { closeSync, existsSync, openSync, statSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type AgentationWebhookPayload = {
  event?: string;
  annotation?: {
    id?: string;
    comment?: string;
    sessionId?: string;
    timestamp?: number;
    url?: string;
    element?: string;
    elementPath?: string;
    nearbyText?: string;
    selectedText?: string;
  };
  timestamp?: number;
  url?: string;
};

type AutorunLock = {
  pid: number;
  startedAt: string;
  event: string;
  annotationId?: string;
};

const AUTO_EVENTS = new Set(['annotation.add', 'submit']);
const AUTORUN_DIR = path.join(process.cwd(), '.agentation');
const LOCK_PATH = path.join(AUTORUN_DIR, 'autorun.lock.json');
const LOG_PATH = path.join(AUTORUN_DIR, 'autorun.log');
const AUTORUN_MAX_AGE_MS = Number(
  process.env.AGENTATION_AUTORUN_MAX_AGE_MS ?? '120000'
);
const AUTORUN_IDLE_TIMEOUT_MS = Number(
  process.env.AGENTATION_AUTORUN_IDLE_TIMEOUT_MS ?? '45000'
);
const DEFAULT_PROMPT =
  '방금 등록된 Agentation annotation 한 건을 처리해줘. webhook에 담긴 코멘트와 위치 정보를 기준으로 관련 코드만 최소 수정하고, 필요한 테스트만 검증한 뒤 resolve 처리하고 바로 종료해줘. 브라우저를 새로 열거나 추가 입력을 기다리거나 watch mode로 머물지 말아줘. pending 조회에서 바로 안 보여도 아래 정보를 기준으로 해당 요청을 찾아 처리해줘.';

function buildAutorunPrompt(payload: AgentationWebhookPayload): string {
  const annotation = payload.annotation;
  const details = [
    annotation?.id ? `- webhook annotation id: ${annotation.id}` : null,
    annotation?.comment ? `- comment: ${annotation.comment}` : null,
    annotation?.sessionId ? `- sessionId: ${annotation.sessionId}` : null,
    annotation?.url || payload.url
      ? `- url: ${annotation?.url ?? payload.url}`
      : null,
    annotation?.element ? `- element: ${annotation.element}` : null,
    annotation?.elementPath ? `- elementPath: ${annotation.elementPath}` : null,
    annotation?.nearbyText ? `- nearbyText: ${annotation.nearbyText}` : null,
    annotation?.selectedText
      ? `- selectedText: ${annotation.selectedText}`
      : null,
    annotation?.timestamp
      ? `- annotation timestamp: ${annotation.timestamp}`
      : null,
    payload.timestamp ? `- event timestamp: ${payload.timestamp}` : null,
  ].filter((value): value is string => Boolean(value));

  if (details.length === 0) {
    return DEFAULT_PROMPT;
  }

  return `${DEFAULT_PROMPT}\n\n다음 정보를 참고해줘:\n${details.join('\n')}`;
}

function isPidRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function getLockAgeMs(lock: AutorunLock): number {
  const startedAt = new Date(lock.startedAt).getTime();

  if (Number.isNaN(startedAt)) {
    return Number.POSITIVE_INFINITY;
  }

  return Date.now() - startedAt;
}

function getAutorunIdleMs(): number {
  try {
    return Date.now() - statSync(LOG_PATH).mtimeMs;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

async function readLockFile(): Promise<AutorunLock | null> {
  if (!existsSync(LOCK_PATH)) {
    return null;
  }

  try {
    const raw = await readFile(LOCK_PATH, 'utf8');
    const parsed = JSON.parse(raw) as AutorunLock;
    if (typeof parsed.pid !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function clearStaleLock(lock: AutorunLock | null): Promise<void> {
  if (!lock) {
    return;
  }

  const isRunning = isPidRunning(lock.pid);
  const isExpired = getLockAgeMs(lock) > AUTORUN_MAX_AGE_MS;
  const isIdle = getAutorunIdleMs() > AUTORUN_IDLE_TIMEOUT_MS;

  if (isRunning && !isExpired && !isIdle) {
    return;
  }

  if (isRunning && (isExpired || isIdle)) {
    try {
      process.kill(lock.pid, 'SIGTERM');
    } catch {}
  }

  if (existsSync(LOCK_PATH)) {
    await rm(LOCK_PATH, { force: true });
  }
}

async function writeLockFile(lock: AutorunLock): Promise<void> {
  await writeFile(LOCK_PATH, JSON.stringify(lock, null, 2), 'utf8');
}

function runAutorunCommand(payload: AgentationWebhookPayload) {
  const customCommand = process.env.AGENTATION_AUTORUN_COMMAND?.trim();
  const logFd = openSync(LOG_PATH, 'a');
  try {
    if (customCommand) {
      return spawn(customCommand, {
        cwd: process.cwd(),
        shell: true,
        detached: true,
        stdio: ['ignore', logFd, logFd],
        env: process.env,
      });
    }

    const autoPrompt = buildAutorunPrompt(payload);

    return spawn(
      'codex',
      ['exec', '--full-auto', '-C', process.cwd(), autoPrompt],
      {
        cwd: process.cwd(),
        detached: true,
        stdio: ['ignore', logFd, logFd],
        env: process.env,
      }
    );
  } finally {
    closeSync(logFd);
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, reason: 'development only' },
      { status: 403 }
    );
  }

  const enabled = process.env.AGENTATION_AUTORUN_ENABLED !== 'false';
  if (!enabled) {
    return NextResponse.json({
      ok: true,
      triggered: false,
      reason: 'autorun disabled',
    });
  }

  let payload: AgentationWebhookPayload;
  try {
    payload = (await request.json()) as AgentationWebhookPayload;
  } catch {
    return NextResponse.json(
      { ok: false, reason: 'invalid json payload' },
      { status: 400 }
    );
  }

  const event = payload.event ?? '';
  if (!AUTO_EVENTS.has(event)) {
    return NextResponse.json({
      ok: true,
      triggered: false,
      reason: 'event ignored',
      event,
    });
  }

  const dryRun = new URL(request.url).searchParams.get('dryRun') === '1';
  if (dryRun) {
    return NextResponse.json({
      ok: true,
      triggered: true,
      dryRun: true,
      event,
      annotationId: payload.annotation?.id ?? null,
    });
  }

  await mkdir(AUTORUN_DIR, { recursive: true });

  const lock = await readLockFile();
  await clearStaleLock(lock);

  const activeLock = await readLockFile();
  if (activeLock && isPidRunning(activeLock.pid)) {
    return NextResponse.json({
      ok: true,
      triggered: false,
      reason: 'autorun already running',
      pid: activeLock.pid,
      event,
    });
  }

  const child = runAutorunCommand(payload);
  if (!child.pid) {
    return NextResponse.json(
      { ok: false, reason: 'failed to spawn autorun process' },
      { status: 500 }
    );
  }

  await writeLockFile({
    pid: child.pid,
    startedAt: new Date().toISOString(),
    event,
    annotationId: payload.annotation?.id,
  });

  child.unref();

  return NextResponse.json({
    ok: true,
    triggered: true,
    pid: child.pid,
    event,
    annotationId: payload.annotation?.id ?? null,
  });
}
