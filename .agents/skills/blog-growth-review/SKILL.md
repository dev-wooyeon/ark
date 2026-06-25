---
name: blog-growth-review
description: Review and score Ark blog posts in this repository. Use when evaluating a post draft or published post for contentType classification, writing quality scores, publication readiness, improvement priorities, or when proposing meta.json qualityReview updates for posts/**/index.mdx and posts/**/meta.json.
---

# Blog Growth Review

## Workflow

1. Read `docs/blog-quality-guide.md`, the target `index.mdx`, and its sibling
   `meta.json` before judging the post.
2. Preserve `category: Tech | Life`; classify the writing form with
   `contentType: essay | retrospective | review`.
3. Score only for authoring/review operations. Do not expose scores in public UI
   unless the user explicitly asks for a UI change.
4. Return a scorecard, publication verdict, and focused improvement checklist.
   Do not edit files unless the user asks for implementation.

## contentType Rules

- `essay`: opinion, argument, personal interpretation, principle, or explanatory
  guide.
- `retrospective`: event or project review with context, turning points, lessons,
  and next actions.
- `review`: evaluation of an external object or experience such as a book, trip,
  product, article, or venue.

If multiple types fit, choose the reader expectation that dominates the title and
opening section. Keep technical project writeups as `retrospective` when the
article is organized around a concrete build, incident, migration, or work
outcome.

## Scorecard

Use 1-5 scores in 0.5 increments. Use `null` only when the source is not
available enough to judge.

- `philosophy`: reusable judgment, principle, or decision quality.
- `design`: structure, flow, framing, and section architecture.
- `implementation`: concrete execution detail, examples, evidence, or mechanism.
- `brandFit`: fit with Ark's public identity and author positioning.
- `clarity`: clear thesis, terms, conclusion, and reader promise.
- `structure`: narrative progression and section-level cohesion.
- `evidence`: concrete scenes, data, examples, constraints, or references.
- `usefulness`: reader takeaway, applicability, and decision support.
- `originality`: author's perspective beyond generic summary.
- `polish`: sentence quality, duplication removal, tone consistency, and typos.

## Type-Specific Checks

- `essay`: strong point of view, controlled abstraction, enough concrete anchors,
  and a final reusable thought.
- `retrospective`: timeline or situation, decision point, failure or tradeoff,
  changed behavior, and next-time rule.
- `review`: evaluation criteria, who should care, what worked or did not, and a
  recommendation boundary.

## Output Format

Return:

````markdown
## Verdict
- contentType: ...
- publication: 공개 유지 | 보강 필요 | private 전환 검토
- summary: ...

## Scorecard
| Axis | Score | Reason |
| --- | ---: | --- |

## Improvements
1. ...
2. ...
3. ...

## Suggested meta.json patch
```json
{
  "contentType": "...",
  "qualityReview": {
    "...": "..."
  }
}
```
````

Omit the suggested patch when the user asked only for conceptual feedback.
