import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const ADR_DIR = path.join(ROOT, 'docs', 'adr');
const DOCS_INDEX = path.join(ROOT, 'docs', 'README.md');
const ADR_INDEX = path.join(ADR_DIR, 'README.md');
const AGENTS = path.join(ROOT, 'AGENTS.md');

const adrTriggerRules = [
  '선택지가 2개 이상이고 트레이드오프가 존재한 경우.',
  '반복적으로 따라야 할 규칙이나 경계를 정의한 경우.',
  '테스트 전략이나 검증 방식이 결정의 핵심이었던 경우.',
];

const markdownlintTargets = [
  'AGENTS.md',
  'docs/README.md',
  ...fs
    .readdirSync(ADR_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort()
    .map((fileName) => path.join('docs', 'adr', fileName)),
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFileExists(relativePath) {
  assertCondition(
    fs.existsSync(path.join(ROOT, relativePath)),
    `Missing docs index target: ${relativePath}`
  );
}

function verifyDocsIndexTargets() {
  const docsIndex = readText(DOCS_INDEX);
  const linkedPaths = [...docsIndex.matchAll(/`([^`]+)`/g)]
    .map((match) => match[1])
    .filter((entry) => !entry.includes('*'))
    .filter((entry) => entry.endsWith('.md') || entry.endsWith('.sql'));

  linkedPaths.forEach(assertFileExists);
}

function verifyAdrTriggerRules() {
  const agents = readText(AGENTS);
  const adrIndex = readText(ADR_INDEX);

  adrTriggerRules.forEach((rule) => {
    assertCondition(
      agents.includes(rule),
      `AGENTS.md is missing ADR trigger rule: ${rule}`
    );
    assertCondition(
      adrIndex.includes(rule),
      `docs/adr/README.md is missing ADR trigger rule: ${rule}`
    );
  });
}

function verifyAdrIndexEntries() {
  const adrIndex = readText(ADR_INDEX);
  const adrFiles = fs
    .readdirSync(ADR_DIR)
    .filter((fileName) => /^\d{4}-.+\.md$/.test(fileName))
    .sort();

  adrFiles.forEach((fileName) => {
    assertCondition(
      adrIndex.includes(`](${fileName})`),
      `docs/adr/README.md does not list ${fileName}`
    );
  });
}

function runMarkdownlint() {
  const result = spawnSync(
    path.join(ROOT, 'node_modules', '.bin', 'markdownlint-cli2'),
    [
      '--config',
      path.join('tooling', 'config', '.markdownlint-cli2.jsonc'),
      ...markdownlintTargets,
    ],
    {
      cwd: ROOT,
      stdio: 'inherit',
    }
  );

  assertCondition(
    result.status === 0,
    `markdownlint failed with exit code ${result.status ?? 'unknown'}`
  );
}

function main() {
  verifyDocsIndexTargets();
  verifyAdrTriggerRules();
  verifyAdrIndexEntries();
  runMarkdownlint();
  console.log('Documentation verification passed.');
}

try {
  main();
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Documentation verification failed.'
  );
  process.exit(1);
}
