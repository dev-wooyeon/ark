import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

let tempRoot: string;
let postsDir: string;

function writePostFixture(
  folderName: string,
  meta: Record<string, unknown>,
  content = `# 제목

도입에서 문제와 기준을 정리합니다.

## 본문

- 하나
- 둘

## 결론

읽고 나서 가져갈 기준을 남깁니다.
`
) {
  const folderPath = path.join(postsDir, folderName);
  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(
    path.join(folderPath, 'meta.json'),
    `${JSON.stringify(meta, null, 2)}\n`
  );
  fs.writeFileSync(path.join(folderPath, 'index.mdx'), content);
}

function runAudit() {
  return execFileSync(
    process.execPath,
    ['tooling/scripts/posts/audit-post-quality.mjs'],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        BLOG_AUDIT_POSTS_DIR: postsDir,
      },
      encoding: 'utf8',
    }
  );
}

describe('post quality audit script', () => {
  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eunulog-audit-'));
    postsDir = path.join(tempRoot, 'posts');
    fs.mkdirSync(postsDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('reports content type distribution and missing writing scores', () => {
    writePostFixture('missing-content-type', {
      title: '분류 없는 글',
      slug: 'missing-content',
      description: '설명',
      date: '2026-06-17',
      category: 'Life',
      visibility: 'public',
      tags: ['Life'],
      qualityReview: {
        philosophy: 4,
        design: 4,
        implementation: 4,
        brandFit: 4,
      },
    });
    writePostFixture('scored-essay', {
      title: '점수 있는 에세이',
      slug: 'scored-essay',
      description: '설명',
      date: '2026-06-17',
      category: 'Life',
      contentType: 'essay',
      visibility: 'public',
      tags: ['Essay'],
      qualityReview: {
        philosophy: 4,
        design: 4,
        implementation: 4,
        brandFit: 4,
        clarity: 4,
        structure: 4,
        evidence: 3.5,
        usefulness: 4,
        originality: 4.5,
        polish: 4,
      },
    });

    const output = runAudit();

    expect(output).toContain('## Content Type Distribution');
    expect(output).toContain(
      'all posts: essay: 1, retrospective: 0, review: 0'
    );
    expect(output).toContain('missing-content (contentType 누락)');
    expect(output).toContain('## Writing Score Checks');
    expect(output).toContain('writing score coverage: 1/2');
    expect(output).toContain('missing-content (6)');
    expect(output).toContain('## Improvement Priorities');
  });

  it('does not mark public Life posts private for low writing scores', () => {
    writePostFixture('low-scored-life', {
      title: 'Life 기준을 다시 세운 기록',
      slug: 'low-scored-life',
      description: '설명',
      date: '2026-06-17',
      category: 'Life',
      contentType: 'essay',
      visibility: 'public',
      tags: ['Life'],
      qualityReview: {
        philosophy: 4,
        design: 4,
        implementation: 4,
        brandFit: 4,
        clarity: 2.5,
        structure: 2.5,
        evidence: 2.5,
        usefulness: 2.5,
        originality: 2.5,
        polish: 2.5,
      },
    });

    const output = runAudit();

    expect(output).toContain('[보강 필요] low-scored-life (public, Life)');
    expect(output).not.toContain(
      '[private 전환 검토] low-scored-life (public, Life)'
    );
  });

  it('treats posts without visibility as private', () => {
    writePostFixture('missing-visibility', {
      title: '검토 전 초안',
      slug: 'missing-visibility',
      description: '설명',
      date: '2026-07-13',
      category: 'Life',
      contentType: 'essay',
      tags: ['Draft'],
    });

    const output = runAudit();

    expect(output).toContain(
      '[private 유지] missing-visibility (private, Life)'
    );
  });
});
