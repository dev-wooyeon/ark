---
name: blog-title-review
description: Review, generate, and choose Ark blog post titles. Use when evaluating title candidates for posts/**/index.mdx and sibling meta.json, when the user is stuck choosing a title, or when a draft needs a click-worthy but accurate title that fits the first three paragraphs.
---

# Blog Title Review

## Workflow

1. Read `docs/blog-quality-guide.md`, the target `index.mdx`, and the sibling
   `meta.json` before judging a repository post. If the post is not in the
   workspace, use the text the user provided.
2. Preserve `category`, `contentType`, `slug`, and publication state unless the
   user explicitly asks for edits.
3. Extract a title brief before proposing titles:
   - target reader and reading situation
   - the post's concrete object, event, or tension
   - the emotional stake or practical promise
   - the strongest first-three-paragraph hook
   - the current title and why it works or fails
4. Score existing user candidates first when they exist, then add better
   alternatives only when useful.
5. Evaluate the title and opening as one unit. If a candidate depends on a hook
   that the first three paragraphs do not pay off, flag the required opening
   change instead of pretending the title is ready.
6. Do not edit files unless the user explicitly asks for implementation.

## Title Principles

- Prefer a specific unanswered question over a complete summary.
- Use concrete nouns from the post before abstract virtues.
- Create tension through contrast, self-recognition, reversal, or specificity.
- Let the title be click-worthy, but keep the promise payable by the intro.
- Check word texture. Reject words whose military, corporate, clinical, or
  overly visible metaphorical register clashes with the essay's emotional tone.
- Avoid titles that sound like generic self-help, corporate slogans, product
  reviews, or manipulative bait.
- Avoid over-weighting SEO when the post is an essay; the title still needs a
  human reason to click.

## Candidate Patterns

Generate candidates across multiple patterns when the user needs options:

- Collision: combine two unlike elements that the post genuinely connects.
- Confession: expose the private pressure, mistake, or need behind the post.
- Reversal: turn an expected belief into the post's real conclusion.
- Object-led: let a concrete object carry the emotional promise.
- Direct problem: name the reader's problem in plain language.
- Quiet essay: use a restrained line when click pressure would cheapen the tone.

## Scorecard

Use 1-5 scores in 0.5 increments.

- `click`: likelihood that the title earns a click from the intended reader.
- `fit`: accuracy to the full post, not only one vivid sentence.
- `introFit`: whether the first three paragraphs pay off the title.
- `specificity`: concrete nouns, situations, or stakes.
- `emotion`: felt tension without melodrama.
- `novelty`: freshness compared with generic essay titles.
- `texture`: whether the key words feel natural in the post's emotional register.
- `arkTone`: fit with Ark's direct, reflective, engineering-adjacent voice.
- `baitRisk`: risk of overpromising or misframing the post; lower is better.

When ranking titles, prioritize high `click`, `fit`, and `introFit`, then use
`baitRisk` as a veto. A high-click title with high bait risk should be marked as
usable only after an intro rewrite.

## Output Format

Return:

```markdown
## Title Brief
- reader:
- promise:
- tension:
- current title:

## Recommendation
1. `...` - ...
2. `...` - ...
3. `...` - ...

## Scorecard
| Title | Click | Fit | Intro Fit | Specificity | Emotion | Novelty | Texture | Ark Tone | Bait Risk | Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |

## Opening Adjustment
...
```

Keep the output shorter when the user asks for a quick choice. Omit
`Opening Adjustment` when every recommended title already matches the opening.
