---
title: "Genesis: What If Code Evolved Instead of Being Written?"
preview: "A neuro-symbolic program synthesis engine that breeds Python functions with genetic programming and prunes the search with a neural pre-filter — and an honest look at where evolution actually beats prediction."
date: "July 8, 2026"
sortDate: "2026-07-08"
readTime: "6 min read"
color: "#05ffa1"
---

Every large language model writing code today is doing the same fundamental thing: predicting the next token based on statistical patterns in billions of examples of code that already exists. It's remarkably good at this. It is also, structurally, guessing. A model can be extremely confident about the next character and still be wrong, because code isn't prose — a single misplaced operator doesn't make a sentence a little awkward, it makes the whole program not compile, or worse, compile and silently do the wrong thing. There's no partial credit in program correctness the way there is in language.

That mismatch is the starting point for Genesis. Instead of asking "what token is statistically likely to come next," it asks a completely different question: what if a program didn't have to be *predicted* at all — what if it could be *evolved*, the way biological organisms are, through mutation, competition, and survival, with no model ever having seen a single line of training code?

## Where the Idea Comes From

Genetic programming isn't new — it's a decades-old branch of evolutionary computation. But it has a well-known Achilles' heel: to know whether a randomly mutated program is any good, you have to actually run it, and running thousands of candidate programs every generation is slow. Most genetic programming systems either accept that cost or restrict themselves to trivially small search spaces. The interesting question is whether you can borrow a genuinely different kind of intelligence — a neural network — not to write the code, but to guess *which candidates are even worth running* before you pay the execution cost.

That's the "neuro-symbolic" part. The symbolic side does what genetic programming has always done: treat every candidate function as an abstract syntax tree, and evolve populations of trees through tournament selection, subtree crossover, and a fitness function that actively penalizes bloat (a program that solves the problem in 40 nodes is fitter than one that does it in 400, even if both are technically correct — this is essentially Occam's razor built into the selection pressure). The neural side sits in front of that process as a filter, not a writer: a small multi-layer perceptron looks at a candidate's tree topology — depth, size, variable count, operator counts — and predicts whether it's likely to be fit *before* anyone runs it. The bottom half of each generation gets discarded on that prediction alone.

## How It Actually Runs

A target problem is defined as a set of input/output examples — `1->1, 2->4, 3->9` for "learn me the squaring function," for instance. The population of candidate ASTs mutates and crosses over each generation. Before symbolic execution, the neural scorer ranks the population and prunes the weaker half. Only survivors get compiled and run through a sandboxed, restricted `eval()` to compute their true fitness against the target examples. The loop repeats until something in the population perfectly satisfies every example, or a generation limit is hit. The whole process is watchable live through a small Gradio interface, where you can hand it a target mapping and watch the fitness trajectory climb generation by generation.

## Where Evolution Actually Wins — and Where It Doesn't

I want to resist the temptation to present this as a clean success story, because the results aren't uniformly one. On simple, low-dimensional problems — identity, squaring, addition — every search strategy converges in one or two generations, evolutionary or not, so there's no real signal there. The genuinely interesting result shows up on a harder string-manipulation problem, where the neural pre-filter actually made things *slower* than plain evolutionary search with no neural guidance at all — the guided search took over 30 generations to find what unguided evolution found in one.

The likely reason is that topology-only features — depth, operator counts — don't capture enough about a program's actual semantics to meaningfully rank candidates on problems where correctness depends on subtle structural choices like argument order. The pre-filter ends up discarding good candidates that happen to *look* structurally similar to bad ones. That's a real limitation of the current feature representation, not a footnote, and it says something bigger about neuro-symbolic systems generally: a neural heuristic is only as good as what it's actually allowed to see, and topology is a thin signal for something as semantically loaded as source code.

## Where This Goes Next

The honest next step isn't a fancier evolutionary operator, it's a harder benchmark and a richer feature space — encoding something closer to program *semantics* (execution traces on a handful of probe inputs, for instance, rather than just tree shape) so the neural scorer has a fighting chance of actually correlating with true fitness on non-trivial problems. There's a live research question underneath all of this that's bigger than this one project: as language models get better at code, does evolutionary synthesis become obsolete, or does it become the right tool specifically for the regime LLMs are worst at — problems with rigid, verifiable correctness constraints and no statistical precedent to pattern-match against? Genesis doesn't answer that. It's a working testbed for asking it.

*Built solo, drawing on Parisotto et al.'s neuro-symbolic program synthesis work (ICLR 2017), Mundhenk et al.'s neural-guided genetic programming (NeurIPS 2021), and Petersen et al.'s deep symbolic optimization.*

Repo: [github.com/sosush/Genesis](https://github.com/sosush/Genesis)