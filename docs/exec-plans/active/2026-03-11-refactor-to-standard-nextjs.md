# Refactor to Standard Next.js Structure

## 1. Goal
Simplify the current somewhat over-engineered (FSD/DDD-like) directory structure (`src/domains`, `src/features`, `src/core`, `src/shared`) into a flatter, more standard Next.js application structure. This will reduce cognitive load, make it easier to locate files, and improve maintainability for a personal blog project.

## 2. Scope
- Reorganize directories inside `src/` to follow a standard Next.js pattern (`app`, `components`, `lib`, `hooks`, `types`).
- Migrate existing UI components from `src/features/*/ui`, `src/shared/ui`, `src/shared/layout` to `src/components/*`.
- Migrate business logic, API clients, and utilities from `src/features/*/services`, `src/shared/analytics`, `src/shared/integrations` to `src/lib/*`.
- Migrate types and models from `src/domains/*/model`, `src/features/*/model` to a top-level `src/types` or colocated with features in `lib`.
- Migrate configurations and providers from `src/core`, `src/shared/providers` to `src/components/providers` or `src/lib/config`.
- Update all internal import paths to reflect the new structure.
- Update `ARCHITECTURE.md` to document the new, simplified structure.
- Run tests and linters to ensure nothing is broken.

## 3. Constraints
- The Next.js `app` router structure (`src/app/**`) itself remains mostly unchanged, except for import updates.
- The `posts/` directory and its content pipeline remain unchanged.
- The styling approach (Tailwind + CSS variables in `src/styles`) remains unchanged.
- No new features or bug fixes should be introduced during this refactoring. It is a pure structural change.

## 4. Milestones
- **Phase 1: Preparation:**
  - Create the new base directories (`src/components`, `src/lib`, `src/types`, `src/hooks`).
- **Phase 2: Types & Models Migration:**
  - Move files from `src/domains/*/model/*` and `src/features/*/model/*` to `src/types/*` or `src/lib/*`.
  - Fix import paths for these types.
- **Phase 3: Lib & Utilities Migration:**
  - Move files from `src/features/*/services/*` to `src/lib/content/` (or similar).
  - Move files from `src/shared/integrations/*`, `src/shared/analytics/*`, `src/shared/seo/*` to `src/lib/*`.
  - Move utility functions to `src/lib/utils.ts`.
- **Phase 4: Component Migration:**
  - Move common UI components from `src/shared/ui/*` to `src/components/ui/`.
  - Move layout components from `src/shared/layout/*` to `src/components/layout/`.
  - Move feature-specific UI from `src/features/*/ui/*` to `src/components/[feature]/`.
  - Move `src/core/providers`, `src/shared/providers` to `src/components/providers/`.
- **Phase 5: Cleanup & Update Documentation:**
  - Delete empty old directories (`src/domains`, `src/features`, `src/shared`, `src/core`).
  - Update `ARCHITECTURE.md` to reflect the new structure.
- **Phase 6: Verification:**
  - Run all tests (`npm run test:ci`).
  - Verify local build (`npm run build`).

## 5. Verification
- All TypeScript compiler checks must pass (`npm run lint`).
- All unit and E2E tests must pass (`npm run test:ci`).
- The development server must start without errors (`npm run dev`).
- A production build must succeed (`npm run build`).
- The application (both UI and functionality like view counts) must work identically to before.

## 6. Rollback
- Since the project is managed by Git, if any issues arise or the refactoring becomes too complex, the rollback strategy is to hard reset to the commit prior to starting this execution plan (`git reset --hard HEAD`).
