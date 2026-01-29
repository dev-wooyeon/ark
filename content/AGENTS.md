# CONTENT DIRECTORY KNOWLEDGE BASE

**Generated:** 2026-01-29
**Commit:** unknown
**Branch:** main

## OVERVIEW
Blog content organized in folder-based structure with separated metadata and MDX content, supporting multi-language posts and Zod validation.

## STRUCTURE
```
content/
├── [slug]/              # Blog post folder
│   ├── index.mdx       # MDX content (no frontmatter)
│   ├── meta.json       # Post metadata
│   └── assets/         # Post-specific assets (optional)
└── AGENTS.md           # This file
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Blog Content | `content/[slug]/index.mdx` | Pure MDX without frontmatter |
| Post Metadata | `content/[slug]/meta.json` | Separate JSON file with validation |
| Post Assets | `content/[slug]/assets/` | Images, files specific to post |
| Content Processing | `src/lib/content.ts` | MDX processing and validation |

## CONVENTIONS
**Folder Naming:** Date-based prefix for chronological ordering: `2026-01-28-[slug]/`
**Content Structure:** MDX files contain only content, no metadata
**Metadata Separation:** All metadata in separate `meta.json` file
**Validation:** Zod schemas validate metadata before processing
**Multi-language:** Korean content supported with proper encoding

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** use frontmatter in MDX files - metadata belongs in `meta.json`
- **NEVER** mix metadata with content - keep separation strict
- **NEVER** use arbitrary folder names - follow date-prefix pattern
- **NEVER** skip metadata validation - always use Zod schemas
- **NEVER** place assets outside post-specific folders

## UNIQUE STYLES
- Folder-based content organization instead of file-based
- Separated metadata pattern for cleaner content editing
- Date-based folder naming for automatic chronological sorting
- Zod validation ensures metadata consistency across posts
- Korean language support with UTF-8 encoding in metadata

## VALIDATION PATTERNS
```typescript
// Metadata validation schema
const PostMetaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  lang: z.enum(['ko', 'en']).default('en'),
  draft: z.boolean().default(false)
})
```

## NOTES
- Content processing reads both `index.mdx` and `meta.json` from each folder
- Korean posts use `lang: "ko"` in metadata for proper routing
- Asset references use relative paths from post folder
- Draft posts are excluded from build output unless in development