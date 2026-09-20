# Editorial policy

This repository is both a GitHub profile and the source for Sulaiman Alshammari's public writing site.

## Publishing rule

Writing may be sharp, skeptical, humorous, or personal. It should not convert uncertainty into accusation.

For factual claims about people, companies, incidents, products, research, or security behavior:

1. Separate observation from inference.
2. Prefer primary evidence or directly reproducible evidence.
3. Do not state motive as fact without evidence establishing motive.
4. Use scoped language: what happened, where, when, and under what conditions.
5. Preserve uncertainty when the evidence does not close the claim.
6. Correct material errors transparently.

Useful labels include:

- OBSERVATION
- REPRODUCED
- INFERENCE
- HYPOTHESIS
- NOT ESTABLISHED
- INSUFFICIENT EVIDENCE

## Article workflow

Each public article is one Markdown or MDX file under `src/content/essays/`.

Set `draft: true` while an article is not ready for publication. Changing it to `false` makes it eligible for the public archive at the next build.

The site's code should not need editing for ordinary article publication.
