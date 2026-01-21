# GitHub 레포지토리 통합 계획

## 목표
두 개의 개인 GitHub 레포지토리를 현재 블로그에 통합하여 "Library" 섹션으로 운영

## 통합할 레포지토리

### 1. moamoa (https://github.com/dev-wooyeon/moamoa)
- **목적**: 개발자에게 유용한 정보 링크 모음
- **구조**: 11개 카테고리 (AI, 데이터베이스, 백엔드, 프론트엔드, 아티클, 블로그, 세미나, 면접, 동아리, 도서, 깃허브꾸미기)
- **형식**: 마크다운 파일의 링크 목록
- **표시 방식**: 테이블/리스트 형태

### 2. reading-books-for-programmers
- **목적**: 읽은 기술 서적 기록 및 정리
- **구조**: README에 진행 상황 표 (읽고 있는 책, 앞으로 읽을 책, 다 읽은 책)
- **형식**: 책별 디렉토리 + 학습 노트
- **표시 방식**: 진행 상황 대시보드 + 필터링 가능한 목록

## 선택한 접근 방식

### UI/UX 구조
```
/library/resources     → moamoa 링크 모음
/library/books         → 독서 기록
```

**이유**:
- 콘텐츠 성격이 다름 (빠른 참조 vs 심화 학습)
- URL이 명확하고 SEO 친화적
- 확장 가능 (향후 /library/courses 등 추가 가능)
- 기존 패턴 일관성 (/feed, /resume)

### 데이터 관리 전략
- **소스**: GitHub REST API
- **인증**: Personal Access Token (환경변수)
- **갱신**: ISR (Incremental Static Regeneration) - 24시간마다
- **장점**: 빠른 로딩 + 합리적인 최신성 + API 효율성

## 기술 스택

### API 통합
- **GitHub REST API v3** (GraphQL보다 단순)
- **엔드포인트**:
  ```
  GET /repos/dev-wooyeon/moamoa/contents/{category}
  GET /repos/dev-wooyeon/reading-books-for-programmers/readme
  ```
- **Rate Limit**: 인증 시 5,000 requests/hour
- **캐싱**: Next.js ISR (24시간 revalidate)

### TypeScript 타입
```typescript
// Resources (moamoa)
interface ResourceLink {
  title: string;
  description: string;
  url: string;
  category: string;
  tags?: string[];
}

// Books
interface Book {
  title: string;
  status: 'reading' | 'to-read' | 'completed';
  emoji: string;
  githubUrl: string;
  hasNotes: boolean;
}

interface BookProgress {
  reading: Book[];
  toRead: Book[];
  completed: Book[];
  stats: { totalBooks, completedCount, readingCount, toReadCount };
}
```

## 구현 파일 구조

```
src/
├── app/
│   └── library/
│       ├── resources/
│       │   ├── page.tsx              # Server Component + ISR
│       │   └── page.module.css
│       └── books/
│           ├── page.tsx              # Server Component + ISR
│           └── page.module.css
│
├── lib/
│   ├── github-api.ts                 # GitHub API 클라이언트
│   ├── resources.ts                  # moamoa 데이터 파싱
│   └── books.ts                      # 독서 기록 파싱
│
├── components/
│   └── library/
│       ├── ResourceList.tsx          # 리소스 필터링 (Client)
│       ├── ResourceCard.tsx
│       ├── CategoryFilter.tsx        # 재사용 가능 필터
│       ├── BookProgress.tsx          # 통계 대시보드
│       ├── BookList.tsx              # 책 필터링 (Client)
│       └── BookCard.tsx
│
├── types/
│   └── index.ts                      # 타입 추가
│
└── .env.local                        # GITHUB_ACCESS_TOKEN
```

## 핵심 구현 로직

### 1. GitHub API 클라이언트 (`lib/github-api.ts`)

```typescript
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

// 기본 fetch 래퍼
async function fetchGitHub(endpoint: string) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
    next: { revalidate: 86400 }, // 24시간 ISR
  });

  if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
  return response.json();
}

// 레포 콘텐츠 가져오기
async function getRepoContents(owner, repo, path) {
  return fetchGitHub(`/repos/${owner}/${repo}/contents/${path}`);
}

// 파일 내용 가져오기 (base64 디코딩)
async function getFileContent(owner, repo, path) {
  const data = await fetchGitHub(`/repos/${owner}/${repo}/contents/${path}`);
  return Buffer.from(data.content, 'base64').toString('utf-8');
}
```

**에러 처리**:
- 3회 재시도 (exponential backoff)
- Rate limit 초과 시 캐시된 데이터 사용
- 네트워크 실패 시 fallback 데이터

### 2. Resources 데이터 처리 (`lib/resources.ts`)

```typescript
export async function fetchResourcesFromGitHub() {
  const links = [];

  // 11개 카테고리 순회
  for (const category of RESOURCE_CATEGORIES) {
    const categoryLinks = await fetchCategoryResources(
      'dev-wooyeon',
      'moamoa',
      category.slug
    );
    links.push(...categoryLinks);
  }

  return { categories: RESOURCE_CATEGORIES, links, lastUpdated: new Date() };
}

// 마크다운에서 링크 추출
function parseMarkdownLinks(markdown, category) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  // ... 정규식으로 링크 파싱
  // ... 내부 링크 제외
  // ... title, url, description 추출
}

// 카테고리 slug → 한글 디렉토리명 매핑
function getCategoryDirectoryName(slug) {
  return {
    'ai': 'AI',
    'database': '데이터베이스',
    'backend': '백엔드',
    // ...
  }[slug];
}
```

### 3. Books 데이터 처리 (`lib/books.ts`)

```typescript
export async function fetchBooksFromGitHub() {
  const readmeContent = await getRepoReadme('dev-wooyeon', 'reading-books-for-programmers');
  const readmeText = Buffer.from(readmeContent.content, 'base64').toString('utf-8');

  // README 테이블 파싱
  const books = parseReadingProgressTable(readmeText);

  // 상태별 분류
  return {
    reading: books.filter(b => b.status === 'reading'),
    toRead: books.filter(b => b.status === 'to-read'),
    completed: books.filter(b => b.status === 'completed'),
    stats: { /* ... */ }
  };
}

// 테이블에서 책 정보 추출
function parseReadingProgressTable(markdown) {
  // "| 읽고 있는 책 | 앞으로 읽을 책 | 다 읽은 책 |" 테이블 찾기
  // 각 셀에서 이모지(📕📘📗)와 제목 파싱
  // status 할당
  // GitHub URL 생성
}
```

### 4. Resources 페이지 (`app/library/resources/page.tsx`)

```typescript
// ISR 설정
export const revalidate = 86400; // 24시간

export default async function ResourcesPage() {
  const resources = await fetchResourcesFromGitHub();

  return (
    <div>
      <header>
        <Link href="/">← Home</Link>
        <h1>Developer Resources</h1>
      </header>

      <ResourceList initialResources={resources} />

      <footer>
        Data source: <a href="https://github.com/dev-wooyeon/moamoa">moamoa</a>
      </footer>
    </div>
  );
}
```

### 5. ResourceList 컴포넌트 (Client Component)

```typescript
'use client';

export default function ResourceList({ initialResources }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredLinks = activeCategory === 'all'
    ? initialResources.links
    : initialResources.links.filter(link => link.category === activeCategory);

  return (
    <>
      <CategoryFilter
        categories={RESOURCE_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 카테고리별로 그룹화하여 표시 */}
      {Object.entries(groupByCategory(filteredLinks)).map(([category, links]) => (
        <section key={category}>
          <h2>{getCategoryName(category)}</h2>
          <div>
            {links.map(link => (
              <ResourceCard key={link.url} resource={link} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
```

### 6. Books 페이지 (`app/library/books/page.tsx`)

```typescript
export const revalidate = 86400;

export default async function BooksPage() {
  const bookProgress = await fetchBooksFromGitHub();

  return (
    <div>
      <header>
        <Link href="/">← Home</Link>
        <h1>Reading Books</h1>
      </header>

      {/* 통계 대시보드 */}
      <BookProgress progress={bookProgress} />

      {/* 필터링 가능한 책 목록 */}
      <BookList initialProgress={bookProgress} />
    </div>
  );
}
```

### 7. Header 업데이트 (네비게이션 추가)

```typescript
export default function Header() {
  const [showLibraryMenu, setShowLibraryMenu] = useState(false);

  return (
    <header>
      <nav>
        <Link href="/">eunu.log</Link>
        <ul>
          <li><Link href="/feed">Feed</Link></li>
          <li
            onMouseEnter={() => setShowLibraryMenu(true)}
            onMouseLeave={() => setShowLibraryMenu(false)}
          >
            <span>Library ▾</span>
            {showLibraryMenu && (
              <ul>
                <li><Link href="/library/resources">📚 Resources</Link></li>
                <li><Link href="/library/books">📖 Books</Link></li>
              </ul>
            )}
          </li>
          <li><Link href="/resume">Resume</Link></li>
        </ul>
      </nav>
    </header>
  );
}
```

## UI 디자인 가이드

### Resources 페이지 레이아웃
```
┌────────────────────────────────────┐
│ ← Home | Developer Resources       │
│ Curated developer links            │
├────────────────────────────────────┤
│ Categories:                        │
│ [All] [AI] [Frontend] [Backend]... │
├────────────────────────────────────┤
│ AI                                 │
│ ┌──────────────────────────────┐   │
│ │ 🔗 OpenAI Guide              │   │
│ │    Complete GPT-4 reference  │   │
│ │    → example.com             │   │
│ └──────────────────────────────┘   │
└────────────────────────────────────┘
```

### Books 페이지 레이아웃
```
┌────────────────────────────────────┐
│ ← Home | Reading Books             │
├────────────────────────────────────┤
│ ┌──────┬──────┬──────┬──────────┐  │
│ │ 📕 1 │ 📘 1 │ 📗 11│ 📚 13   │  │
│ │ Now  │To-Rd │Done  │ Total   │  │
│ └──────┴──────┴──────┴──────────┘  │
├────────────────────────────────────┤
│ Status: [All] [Reading] [To-Read]  │
│                  [Completed]       │
├────────────────────────────────────┤
│ 📗 Clean Code        [View Notes→] │
│    Status: Completed               │
└────────────────────────────────────┘
```

### 스타일링 원칙
- 기존 디자인 시스템 준수 (`var(--text-primary)` 등)
- CSS Modules 사용
- 반응형 디자인 (mobile-first)
- 다크모드 지원

## 환경 설정

### 1. GitHub Token 생성
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Scope: `public_repo` 체크
4. Copy token

### 2. 환경 변수 설정
```bash
# .env.local (로컬)
GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

### 3. Vercel 배포 설정
- Project Settings → Environment Variables
- `GITHUB_ACCESS_TOKEN` 추가
- Production, Preview, Development 환경 모두 선택

### 4. .gitignore 확인
```
.env*.local
.env
```

## 구현 단계

### Phase 1: 환경 설정 (30분)
- [ ] GitHub Personal Access Token 생성
- [ ] `.env.local` 파일 생성
- [ ] TypeScript 타입 정의 추가 (`src/types/index.ts`)

### Phase 2: API 클라이언트 (1시간)
- [ ] `lib/github-api.ts` 구현
- [ ] 기본 fetch, 에러 처리, 재시도 로직
- [ ] Rate limit 체크 함수
- [ ] 콘솔로 API 연결 테스트

### Phase 3: 데이터 처리 로직 (2시간)
- [ ] `lib/resources.ts` 구현
  - moamoa 카테고리별 마크다운 파싱
  - 링크 추출 정규식
  - 카테고리 매핑
- [ ] `lib/books.ts` 구현
  - README 테이블 파싱
  - 책 상태별 분류
  - 통계 계산
- [ ] 콘솔로 데이터 구조 검증

### Phase 4: 페이지 및 컴포넌트 (3시간)
- [ ] `/library/resources` 페이지
- [ ] `/library/books` 페이지
- [ ] ResourceList, ResourceCard 컴포넌트
- [ ] BookProgress, BookList, BookCard 컴포넌트
- [ ] CategoryFilter 컴포넌트
- [ ] 스타일링 (CSS Modules)

### Phase 5: 네비게이션 통합 (30분)
- [ ] Header 컴포넌트에 Library 메뉴 추가
- [ ] 드롭다운 메뉴 구현
- [ ] 페이지 간 링크 연결

### Phase 6: 테스트 및 검증 (1시간)
- [ ] 로컬에서 빌드 테스트 (`npm run build`)
- [ ] 카테고리 필터링 동작 확인
- [ ] 상태별 책 필터링 동작 확인
- [ ] 외부 링크 새 탭 열기 확인
- [ ] 반응형 레이아웃 확인 (모바일/태블릿/데스크톱)
- [ ] 다크모드 확인
- [ ] Lighthouse 성능 테스트

### Phase 7: 배포 (30분)
- [ ] Vercel에 환경 변수 설정
- [ ] Preview 배포 테스트
- [ ] Production 배포
- [ ] ISR 동작 확인 (24시간 후 재검증)

## 검증 방법

### 자동 검증
```bash
# 빌드 성공 확인
npm run build

# 타입 체크
npm run type-check  # 있다면

# Lighthouse 성능 측정
npm run build && npm run start
# Chrome DevTools → Lighthouse
```

### 수동 체크리스트
- [ ] Resources 페이지에 모든 카테고리 표시
- [ ] 카테고리 필터링 동작
- [ ] 링크 클릭 시 새 탭으로 올바른 URL 열림
- [ ] Books 페이지에 통계 정확히 표시
- [ ] 상태별 필터링 동작
- [ ] "View Notes" 링크가 GitHub로 연결
- [ ] Header 드롭다운 메뉴 동작
- [ ] 모바일 화면에서 레이아웃 적절
- [ ] 다크모드에서 가독성 유지
- [ ] 에러 상태 표시 (API 실패 시)

### 성능 목표
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- Lighthouse 점수 > 90

## 에러 처리

### API 실패 시나리오
- **Rate limit 초과**: 캐시된 데이터 사용, 경고 배너 표시
- **네트워크 타임아웃**: 3회 재시도 후 에러 메시지
- **레포지토리 없음**: 빈 상태 표시 + 설명
- **파싱 오류**: 문제 항목 스킵, 나머지 데이터 표시

### 사용자 경험
- 로딩 스피너 표시
- 에러 발생 시 "Retry" 버튼 제공
- 데이터 출처 명시 (GitHub 링크)
- 마지막 업데이트 시간 표시

## 주요 파일 경로

### 새로 생성
- `/src/app/library/resources/page.tsx`
- `/src/app/library/resources/page.module.css`
- `/src/app/library/books/page.tsx`
- `/src/app/library/books/page.module.css`
- `/src/lib/github-api.ts`
- `/src/lib/resources.ts`
- `/src/lib/books.ts`
- `/src/components/library/ResourceList.tsx` (+ .module.css)
- `/src/components/library/ResourceCard.tsx` (+ .module.css)
- `/src/components/library/CategoryFilter.tsx` (+ .module.css)
- `/src/components/library/BookProgress.tsx` (+ .module.css)
- `/src/components/library/BookList.tsx` (+ .module.css)
- `/src/components/library/BookCard.tsx` (+ .module.css)
- `/.env.local`

### 수정
- `/src/types/index.ts` (타입 추가)
- `/src/components/Header.tsx` (네비게이션 추가)
- `/.gitignore` (.env.local 확인)

## 예상 소요 시간
- **개발**: 8-10시간
- **테스트**: 1-2시간
- **배포 및 검증**: 1시간
- **총계**: 약 10-13시간 (1.5-2일)

## 성공 기준
✅ moamoa의 모든 링크가 카테고리별로 정리되어 표시됨
✅ 독서 기록이 상태별로 분류되어 통계와 함께 표시됨
✅ 카테고리/상태 필터링이 즉각 반응함
✅ GitHub 데이터가 24시간마다 자동 갱신됨
✅ 모든 페이지가 기존 디자인과 일관성 유지
✅ 모바일 환경에서 정상 작동
✅ Lighthouse 성능 점수 90 이상
