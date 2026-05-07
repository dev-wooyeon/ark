import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const nextCommand = isWindows ? 'next.cmd' : 'next';
const agentationCommand = isWindows ? 'agentation-mcp.cmd' : 'agentation-mcp';
const shouldStartAgentation =
  process.env.AGENTATION_AUTOSTART !== 'false';

let isShuttingDown = false;
let nextExited = false;

function spawnProcess(command, args) {
  return spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  });
}

const nextProcess = spawnProcess(nextCommand, ['dev', '--webpack']);

const agentationProcess = shouldStartAgentation
  ? spawnProcess(agentationCommand, ['server'])
  : null;

function stopProcess(child) {
  if (!child || child.killed) {
    return;
  }

  try {
    child.kill('SIGTERM');
  } catch {}
}

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  stopProcess(agentationProcess);

  if (!nextExited) {
    stopProcess(nextProcess);
  }

  process.exit(exitCode);
}

if (agentationProcess) {
  agentationProcess.on('exit', (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    if (code === 0 || signal === 'SIGTERM') {
      return;
    }

    console.warn(
      `[dev] agentation-mcp server exited (code=${code ?? 'null'}, signal=${signal ?? 'null'}). Next dev server will keep running.`
    );
  });

  agentationProcess.on('error', (error) => {
    if (isShuttingDown) {
      return;
    }

    console.warn(
      `[dev] failed to start agentation-mcp server: ${error.message}`
    );
  });
}

nextProcess.on('exit', (code, signal) => {
  nextExited = true;

  if (isShuttingDown) {
    process.exit(code ?? 0);
  }

  stopProcess(agentationProcess);

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

nextProcess.on('error', (error) => {
  console.error(`[dev] failed to start next dev server: ${error.message}`);
  shutdown(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    shutdown(0);
  });
}
