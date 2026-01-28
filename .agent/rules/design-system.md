---
trigger: always_on
---

# TDS Design Tokens & UI Rules

## 1. Typography (Pretendard)
- **Scale:** Use a minor third scale.
- **Weights:** Bold(700) for headlines, Medium(500) for UI labels, Regular(400) for body.
- **Hierarchy:** - Headline: 24px/32px/40px (Bold)
  - Body: 15px or 16px (Regular, Line-height: 1.6)

## 2. Color System (Tailwind Tokens)
- **Primary:** `toss-blue` (#3182f6)
- **Grey Scale:**
  - `grey-900`: #191f28 (Main Text)
  - `grey-700`: #4e5968 (Sub Text)
  - `grey-600`: #6b7684 (Description)
  - `grey-100`: #f2f4f6 (Divider/Border)
  - `grey-50`: #f9fafb (Sub Background)
- **Surface:** `white` (#ffffff)

## 3. Spacing (The 8pt Grid)
- **Base Unit:** 8px. All spacing must be: 2, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96.
- **Border Radius:** - Small: 8px (Buttons, Small cards)
  - Medium: 16px (Main cards, Containers)
  - Large: 24px+ (Large sections)

## 4. Interaction (Micro-interactions)
- **Feedback:** All clickable elements must have `opacity: 0.8` on hover and `scale: 0.98` on active.
- **Transitions:** Use `cubic-bezier(0.4, 0, 0.2, 1)` for all animations.