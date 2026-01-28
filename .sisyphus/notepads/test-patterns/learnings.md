# Testing Patterns - Learnings

## Testing Framework: Vitest Setup

### Configuration
- **Framework**: Vitest (v4.0.18) with React plugin
- **Environment**: jsdom for DOM testing
- **Setup File**: `vitest.setup.ts`
- **Config**: `vitest.config.ts`

### Key Dependencies
- `@testing-library/jest-dom`: DOM matchers and assertions
- `@testing-library/react`: React component testing utilities
- `jsdom`: DOM environment for Node.js testing

### Unique Conventions Found

1. **Global Setup with Mocks** (`vitest.setup.ts`):
   - Imports jest-dom matchers for enhanced assertions
   - Mocks IntersectionObserver API for components that use scroll tracking
   - Uses `vi.stubGlobal()` to provide mock implementations

2. **Test File Organization**:
   - Tests placed alongside implementation: `src/lib/feeds.test.ts` tests `src/lib/mdx-feeds.ts`
   - Uses `.test.ts` suffix convention
   - No `__tests__` directories or `*.spec.ts` files found

3. **Mocking Strategy**:
   - Uses `vi.mock()` for module-level mocking (fs module)
   - Uses `vi.spyOn()` for partial mocking of specific methods
   - Comprehensive mocking of file system operations for isolated testing

4. **Test Structure Patterns**:
   - Uses Vitest's `describe`, `it`, `expect`, `vi` imports
   - Tests focus on business logic (reading time calculation, validation)
   - Includes edge case testing (missing fields, validation failures)

### Testing Focus Areas

Based on existing tests, the project emphasizes:
- **File System Operations**: Mocking fs interactions for content processing
- **Data Validation**: Testing Zod schema validation for frontmatter
- **Business Logic**: Reading time calculation, metadata processing
- **Error Handling**: Graceful handling of missing files/invalid data

### Configuration Specifics

```typescript
// vitest.config.ts
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true, // Enable global test functions
        setupFiles: './vitest.setup.ts',
        alias: {
            '@': path.resolve(__dirname, './src'), // Path alias matching Next.js
        },
    },
});
```

### Script Integration
- Test command: `npm run test` maps to `vitest`
- No test build or coverage scripts currently configured
- Testing appears to be focused on utility functions and data processing

### Notable Patterns

1. **Safe File System Wrappers**: The implementation uses safe wrapper functions (`safeReadFile`, `safeReaddir`) that are tested through mocking
2. **Zod Integration**: Tests validate that schema validation works correctly for frontmatter parsing
3. **Reading Time Logic**: Tests include both automatic calculation and override scenarios
4. **Korean Content Handling**: Test content includes Korean characters to verify Unicode handling
