# SECURITY

Last updated: 2026-02-26

## Scope

Application-level security posture for `eunu.log`.

## Current Controls

1. Supabase credentials loaded from environment variables.
2. Server-side Supabase client for view count mutations.
3. No direct client write path for view-count table without RPC/policies.

## Hardening Checklist

1. Ensure service-role keys are never exposed in client bundles.
2. Review RLS policies periodically for least privilege.
3. Add dependency vulnerability scanning in CI (if CI is introduced).
4. Validate user-controlled inputs for all route handlers and actions.
5. Standardize security headers and CSP strategy as deployment matures.

## Immediate Follow-Ups

1. Confirm production env separation and secret rotation policy.
2. Add a simple threat model section for analytics + content ingestion paths.
