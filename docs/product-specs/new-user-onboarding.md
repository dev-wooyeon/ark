# Spec: New User Onboarding

Status: draft
Last updated: 2026-02-26

## Problem

First-time visitors may not quickly discover the core value of the site (technical depth + practical retrospectives) and may bounce before reading a full post.

## Goals

1. Help first-time users understand site focus in under 10 seconds.
2. Increase first-session post click-through from home page.
3. Preserve fast load and readability.

## Scope

In scope:

- Home hero messaging clarity.
- Featured/recent post entry points.
- Lightweight first-session guidance.

Out of scope:

- Account creation or user auth flows.
- Personalization by logged-in identity.

## Functional Requirements

1. Home page must communicate site focus and audience in visible hero copy.
2. At least one high-signal call-to-action should lead to blog list or featured post.
3. Recent posts should expose category and reading-time hints.
4. Mobile interaction must remain safe-area-aware and non-blocking.

## Non-Functional Requirements

1. No regression to Core Web Vitals baseline.
2. Must support Korean content and metadata.
3. Must be testable with existing unit/e2e stack.

## Success Metrics

1. Home -> blog click-through rate.
2. Average first-session engaged time.
3. Post detail entry rate from first session.

## Suggested Implementation Notes

1. Keep copy changes in posts/internal config-driven locations where possible.
2. Reuse existing home section components before adding new primitives.
3. Track CTA clicks through existing analytics utility.
