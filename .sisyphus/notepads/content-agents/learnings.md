# CONTENT DIRECTORY LEARNINGS

## Content Organization Patterns
- Folder-based structure with separated metadata is cleaner than frontmatter
- Date-based folder naming enables automatic chronological sorting
- Separate `meta.json` files allow for programmatic metadata validation

## Metadata Validation Benefits
- Zod schemas catch metadata errors before build
- Consistent metadata structure across all posts
- Type safety for content processing functions

## Multi-language Support
- Korean content requires proper UTF-8 encoding in metadata
- Language field in metadata enables proper routing
- Content processing should handle language-specific display

## Asset Management
- Post-specific assets should be co-located with content
- Relative asset paths from post folder work reliably
- Separating assets prevents namespace conflicts

## Content Processing Architecture
- MDX files remain clean without frontmatter clutter
- Metadata processing is centralized and reusable
- Validation happens early in the build process