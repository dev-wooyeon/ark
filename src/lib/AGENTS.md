# LIBRARY & PROCESSING KNOWLEDGE BASE

**Generated:** 2026-01-29
**Commit:** unknown
**Branch:** main

## OVERVIEW
Core utilities and data processing layer for MDX content handling, validation, and safe file operations.

## STRUCTURE
```
src/lib/
├── constants.ts          # UI constants, breakpoints, animations
├── mdx-feeds.ts          # Core MDX processing with Zod validation
├── markdown.ts           # Heading parsing for TOC generation
├── safe-file-ops.ts      # Safe file operations wrapper
└── index.ts              # Public API exports
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| MDX Processing | `mdx-feeds.ts` | Zod validation, error handling |
| Content Parsing | `markdown.ts` | Heading extraction, TOC logic |
| File Operations | `safe-file-ops.ts` | Safe wrappers for fs operations |
| Configuration | `constants.ts` | Breakpoints, durations, limits |
| Public API | `index.ts` | Clean exports, types only |

## CONVENTIONS
**Safe Operations:** All file I/O uses safe wrappers with proper error boundaries and fallbacks.
**Validation First:** MDX content validates against Zod schemas before processing.
**Type Exports:** Only types and interfaces exported from index.ts.
**Constants Management:** All magic numbers centralized in constants.ts.

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** use direct fs operations - **ALWAYS** use safe-file-ops wrappers
- **NEVER** process MDX without Zod validation - security risk
- **NEVER** bypass safeReadFile/safeReaddir for content files
- **NEVER** use regex for HTML parsing - use proper markdown parsers
- **NEVER** expose internal utilities from index.ts - types only

## PATTERNS
```typescript
// ✅ Safe file operation with fallback
const content = await safeReadFile(path, "ENOENT" ? "" : null)

// ✅ MDX processing with validation
const parsed = mdxSchema.parse(content)

// ✅ Constants usage
if (width > BREAKPOINTS.md) return "desktop"

// ✅ Error handling in processing
try {
  const headings = extractHeadings(markdown)
} catch (error) {
  return [] // Graceful fallback
}
```

## NOTES
- MDX processing includes Korean content support
- All file operations handle EACCES, ENOENT, EPERM gracefully
- Zod schemas catch malformed content early
- Heading extraction uses proper markdown parsing, not regex