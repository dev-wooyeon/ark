---
name: ark-public-writing-review
description: Review Ark essay and retrospective blog posts for public publication readiness. Use when evaluating posts/**/index.mdx, a draft pasted by the user, or a request to decide whether an essay or retrospective can move directly from writing to public release. Classify the genre, review its reader promise and evidence, detect AI-like prose and privacy or disclosure risks, and return a publish, revise, or block verdict without editing files unless explicitly asked.
---

# Ark Public Writing Review

## Scope

Review essays and retrospectives. Do not replace the technical-writing pipeline
for technical documentation, tutorials, or troubleshooting guides. Do not infer
that polished sentences make a post publishable.

When reviewing a repository post, read these files first:

1. `docs/blog-quality-guide.md`
2. the target `posts/**/index.mdx`
3. its sibling `meta.json`

If the user provides prose instead of a path, use the supplied prose and state
which repository checks could not be performed.

## Workflow

### 1. Classify the post

Choose one primary type:

- `essay`: a point of view, interpretation, principle, or explanation.
- `retrospective`: a real event or project with context, decisions, failures,
  changed behavior, and next-time rules.

If the post is mainly a review of an external object, route to the existing
blog review workflow instead of forcing it into these two types. If it is a
technical document with reader instructions as its main goal, route to the
`technical-writing-pipeline` skill.

### 2. Run the release review

Review the whole draft before suggesting sentence edits. Check:

- reader promise: `Who`, `What`, `Why`, and `How`
- title and first three paragraphs: promise, tension, and payoff
- structure: each section advances one central thought
- specificity: scenes, constraints, examples, decisions, or evidence
- originality: the author's own observation rather than generic advice
- usefulness: a reusable idea, changed behavior, or decision rule remains
- prose: directness, rhythm, repetition, vague abstraction, and AI patterns
- public safety: secrets, personal data, NDA, workplace identifiers,
  unsupported allegations, and claims that need verification

For essays, additionally check that the argument is visible, personal material
supports the argument, and the ending leaves a durable thought rather than a
summary slogan.

For retrospectives, additionally check situation, turning point, decision,
failure or trade-off, result, changed behavior, and next-time rule. Do not
accept "I learned" without what changed afterward.

### 3. Assign the verdict

Use the strictest applicable result:

- `publish`: no blocking or must-fix finding; public risk is acceptable; the
  post is coherent and useful now.
- `revise`: the post is safe to publish but has one or more must-fix content,
  structure, evidence, or prose issues.
- `block`: disclosure, privacy, factual, attribution, or audience risk must be
  resolved before publication; also use this when the reader promise is absent.

Do not use a score average to hide a blocking issue. Mark uncertain factual or
safety claims as `verify`, not as passed.

If the target is an Ark Tech post, inspect the `qualityReview` core fields
(`philosophy`, `design`, `implementation`) even when `qualityReview` is absent.
Report existing scores without inventing them. If a required core score is
missing, mark the result `verify` and do not return `publish`; use `block` for
a public-release decision and `revise` while the post remains private. The
public policy threshold is a repository rule, not a substitute for editorial
judgment.

### 4. Run repository checks when applicable

When reviewing a file in Ark and the user asks for release readiness, run the
smallest relevant checks after the editorial verdict:

- `npm run content:audit`
- `npm run lint` when MDX or source changes affect linted files
- `npm run build` for the final public-release check

Report commands that were not run. Do not change `visibility` automatically.

## Output

Return this compact report:

```markdown
## Verdict
- type: essay | retrospective
- publication: publish | revise | block
- summary: ...

## Must Fix
1. [P0/P1] ...

## Keep
- ...

## Review
| Area | Result | Finding |
| --- | --- | --- |
| reader promise | pass | ... |
| structure | pass | ... |
| specificity | pass | ... |
| originality | pass | ... |
| usefulness | pass | ... |
| prose | pass | ... |
| public safety | pass | ... |

## Checks
- editorial: ...
- repository: ...
```

Use `Must Fix` only for actionable issues. If there are no must-fix items,
write `없음`. Keep the report shorter for a quick review request. Do not emit a
`meta.json` patch unless the user asks to update repository metadata.
