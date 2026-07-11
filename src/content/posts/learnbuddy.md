---
title: "LearnBuddy: What Would Education Look Like If It Adjusted to You Instead of the Other Way Around?"
preview: "Most educational software assumes a median learner and asks everyone to fit it. LearnBuddy is an open-source attempt at inverting that — a tutor that changes its pace and difficulty to match the person using it, built free and accessible by design."
date: "June 10, 2026"
sortDate: "2026-06-10"
readTime: "4 min read"
color: "#f2ff71"
---

Classroom education runs on an averaging problem it rarely admits to. A curriculum is paced for an imagined median student, and everyone above or below that line either coasts or drowns quietly. Commercial adaptive-learning platforms exist to fix this, but they tend to be paywalled, and accessibility — for kids with different physical, sensory, or cognitive needs — is frequently an afterthought bolted on late, if it's addressed at all. LearnBuddy, an open-source project led by Swarnim Tripathi that I contributed to on the frontend and accessibility side, starts from the opposite premise: personalized, adaptive tutoring shouldn't be a premium feature, and accessibility shouldn't be an afterthought.

## The Actual Mechanism

The interesting engineering problem underneath "adaptive learning" is deciding, moment to moment, whether a learner is being appropriately challenged — not just whether they got the last answer right, but whether the *next* question should be harder, easier, or a lateral check of the same concept from a different angle. LearnBuddy's engine handles this with reinforcement learning, treating each learner's trajectory through a topic as a sequence of decisions rather than a fixed, pre-authored path. Grading answers is a related but separate problem: multiple-choice questions are easy to score automatically, but free-text answers aren't, since "the mitochondria makes energy for the cell" and "it's the cell's powerhouse" are the same answer written two different ways. The platform handles this with sentence-transformer embeddings, comparing the *meaning* of a typed response against the meaning of a correct one rather than requiring exact string matches — which is the difference between a tutor that feels like it's actually listening and one that feels like a keyword-matching quiz engine wearing a friendly mascot.

## Why Accessibility Has to Be Structural, Not Cosmetic

The thing that separates an accessibility-first product from an accessibility-retrofitted one is whether the constraint shaped early decisions or got patched in after the fact. High-contrast theming, full keyboard navigability, and clear focus states aren't hard to add to any single screen — they're hard to maintain consistently across *every* screen as a product grows, which is really an architecture and process problem disguised as a design one. That consistency is what a genuinely accessible product actually depends on, more than any individual feature.

## Gamification as a Design Choice, Not a Gimmick

XP, streaks, and unlockable achievements are easy to dismiss as surface-level game mechanics layered onto "real" educational content, but the underlying bet is more specific than that: that motivation, for a lot of learners, is the actual bottleneck — not comprehension ability, but whether they come back tomorrow. A system that's technically excellent at diagnosing what a learner doesn't understand is only useful if the learner is still there to be diagnosed.

## Where This Naturally Goes

The most promising unbuilt direction is connecting the two halves of the system more tightly — right now, the adaptive engine mostly reasons about correctness and pacing within a single topic, but the more interesting version identifies *patterns of misunderstanding* across topics (a kid who struggles with fractions and also struggles with unit conversion might be hitting the same underlying gap in proportional reasoning, not two unrelated weaknesses) and routes instruction accordingly. That's a genuinely hard modeling problem, and it's also where a project like this stops being "quiz app with a difficulty slider" and starts being something closer to what personalized education actually promises.

*My contribution was on the interface layer — the admin panel, learner profile system, and parental-controls UI.*

Repo: [github.com/tripathiji1312/learn_buddy](https://github.com/tripathiji1312/learn_buddy)