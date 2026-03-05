import { spawn } from 'node:child_process';
import { closeSync, existsSync, openSync } from 'node:fs';
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
const DEFAULT_PROMPT =
  'watch mode로 계속 처리해줘. Agentation pending annotation을 확인해서 코드 반영, 테스트 검증, resolve 처리까지 완료해줘.';

function isPidRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
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
  if (isPidRunning(lock.pid)) {
    return;
  }

  if (existsSync(LOCK_PATH)) {
    await rm(LOCK_PATH, { force: true });
  }
}

async function writeLockFile(lock: AutorunLock): Promise<void> {
  await writeFile(LOCK_PATH, JSON.stringify(lock, null, 2), 'utf8');
}

function runAutorunCommand(annotationId?: string) {
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

    const autoPrompt = annotationId
      ? `${DEFAULT_PROMPT} 방금 등록된 annotation id는 ${annotationId}예요.`
      : DEFAULT_PROMPT;

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

  const child = runAutorunCommand(payload.annotation?.id);
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
