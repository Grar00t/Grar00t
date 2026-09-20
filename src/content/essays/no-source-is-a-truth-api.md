---
title: "No Source Is a Truth API"
description: "A paper, a person, and a language model can all be useful sources without becoming automatic authorities on truth."
published: 2026-09-20
tags: ["epistemology", "verification", "AI"]
kind: "essay"
draft: false
featured: true
---

We have a bad habit in technical culture: we confuse **where a claim came from** with **whether the claim is true**.

A peer-reviewed paper can be wrong. A professor can be wrong. A witness can be mistaken. A language model can produce fluent nonsense. A repository can contain passing tests that prove less than its README implies.

None of that makes these sources useless. It means they should remain what they are: **sources of claims and evidence**, not truth APIs.

## Provenance matters, but it is not enough

Provenance answers useful questions:

- Who made the claim?
- When was it made?
- Under what conditions?
- What method produced it?
- Can I inspect the underlying data, code, logs, or artifacts?

Those questions establish context and accountability. They do not magically establish correctness.

The next question is harder and usually more valuable:

> What observation would make this claim fail?

If the answer is clear, the claim may be testable.

## Convert language into something executable

Suppose someone says:

> Algorithm A is faster than Algorithm B.

The sentence is too vague to verify. Faster on what hardware? For which workload? By mean latency, p99, throughput, or energy use? After warm-up? With which compiler flags?

A useful verification process rewrites the sentence into a scoped proposition:

```text
Under environment H and workload W,
median runtime(A) < median runtime(B)
over N repeated runs.
```

Now there is something to execute.

If the experiment produces the opposite result, the scoped claim is falsified. If it agrees, the claim is supported **under those conditions**. Neither result grants universal truth.

## Counterexamples are often cheaper than certainty

Universal claims are especially vulnerable.

> This parser accepts every valid input.

One valid input that it rejects is enough to break the claim.

That asymmetry is useful. In many engineering problems, the practical objective should not be "prove I am right" but:

> Search aggressively for the smallest counterexample that makes me wrong.

Property-based testing, fuzzing, differential testing, formal verification, benchmarks, packet captures, and deterministic regression tests are different tools for different kinds of claims. They share one useful property: they move the argument away from authority and toward observation.

## Some claims do not compile

Not every human statement can become a program.

"I am in pain" is not equivalent to a benchmark. "This decision is unethical" cannot be settled by `ctest`. Intent, private experience, values, and meaning often require self-report, corroboration, interpretation, and explicit uncertainty.

Trying to force those domains into binary verification would create a new kind of false certainty.

The method therefore needs more than `PASS` and `FAIL`:

```text
SUPPORTED UNDER CONDITIONS
FALSIFIED
NOT FALSIFIED
UNDER-SPECIFIED
NOT TESTABLE BY THIS METHOD
INSUFFICIENT EVIDENCE
```

That vocabulary is less dramatic than certainty. It is also more useful.

## Same standard, regardless of speaker

The rule I care about most is symmetry.

If I make a technical claim, I should not receive a lower evidence threshold because I own the repository. If a famous researcher makes the same claim, the threshold should not disappear because the name is impressive. If a model says it, fluency should not count as reproduction.

The source changes the context. It should not change the underlying test.

That leads to a simple working principle:

> **No source has inherent authority over a claim that can be independently checked.**

When the claim is executable, execute it.

When it is not, label the limitation instead of inventing a receipt.
