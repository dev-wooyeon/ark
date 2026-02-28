# RELIABILITY

Last updated: 2026-02-26

## Reliability Goals

1. No broken render paths for published posts.
2. Graceful degradation when external systems (Supabase, GA) are unavailable.
3. Predictable feed and metadata behavior across deploys.

## Current Reliability Mechanisms

1. Safe file read helpers and metadata validation in `src/features/blog/services/post-repository.ts`.
2. Null-safe Supabase client creation and fallback behavior in server actions.
3. Static route param generation for blog paths.

## Known Gaps

1. Provider composition drift can reintroduce duplicated tracker mounts if `AppProviders` is bypassed.
2. Canonical/OG URL consistency is not centrally enforced.
3. No repository-native CI workflow for continuous reliability checks.
