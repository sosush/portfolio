---
title: "NetSentinel: A Model That's 75% Accurate and Almost Useless"
preview: "An intrusion detection pipeline built around a deliberately unfair benchmark — and a classification report that's a small case study in how the wrong metric can make a broken model look fine."
date: "June 20, 2026"
sortDate: "2026-06-20"
readTime: "7 min read"
color: "#b967ff"
---

Here's a fact that should bother anyone building security tooling: a model that predicts "everything is fine" for every single input can score extremely well on the metric most people reach for first. If 97% of your network traffic is legitimate, a model that never once flags an attack is 97% accurate. It is also completely worthless as an intrusion detector, because the entire point of the system was to catch the 3%. NetSentinel exists to sit inside that gap — between a number that looks good and a system that actually works — using a benchmark dataset that's specifically designed to punish models for taking the easy way out.

## Why NSL-KDD Is the Right Kind of Unfair

The NSL-KDD dataset is built so that the test set contains attack subtypes that never appear during training. That's not an accident of data collection — it's the whole point. A model that memorizes training-set attack signatures will look great on training accuracy and then fail exactly where it matters: against traffic it hasn't seen before, which is the only kind of attack that's actually a threat in the real world. Combine that with a class distribution stacked heavily toward "Normal" traffic and a handful of genuinely rare attack types, and you get a dataset that actively resists the shortcut of optimizing for overall accuracy.

NetSentinel is built around refusing that shortcut. The trained XGBoost classifier's headline accuracy is 75% — a number that, taken alone, sounds mediocre-but-fine. Break it down by class and the real story is starker: recall on R2L (remote-to-login attacks) and U2R (user-to-root privilege escalation) sits at around 1%. The model is functionally blind to two of the five attack categories it's supposed to detect, while doing reasonably well on the common, easy-to-spot classes like DoS. Macro F1 — which weights all five classes equally rather than letting the common classes drown out the rare ones — comes out to roughly 0.48, less than half the misleadingly comfortable weighted-average number. That gap between accuracy and macro F1 *is* the finding: it's a live demonstration of exactly the failure mode the whole field of imbalanced-classification research exists to solve, running against a live model rather than a synthetic textbook example.

## The Shape of the Pipeline

The system is built as five layers rather than a single training script, because a model that works once in a notebook and a model that works reliably in production are different engineering problems. Data is version-controlled with DVC so the exact training set is reproducible across machines. Every training run logs its hyperparameters, metrics, and resulting model artifact to MLflow, rather than living only in whoever's terminal happened to run it last. The FastAPI serving layer loads whichever model artifact is most recent by dynamically globbing the MLflow artifact store at request time, rather than hardcoding a path — a small decision that turns out to matter a great deal once the same pipeline needs to run identically on a laptop and inside a container with a different filesystem. And an Evidently AI monitoring layer sits on top of the whole thing, comparing the distribution of live traffic against the training distribution and surfacing drift, because the deeper assumption baked into NSL-KDD — that tomorrow's traffic won't look like yesterday's — is exactly the assumption a production system has to keep checking, not just handle once at training time.

## What Breaks in Practice

The gap between "trains fine locally" and "runs fine in Docker" produced some genuinely instructive failures. NumPy 2.0's binary-compatibility break silently corrupted behavior in compiled extensions like XGBoost rather than throwing an obvious error — the fix was pinning `numpy<2.0.0` rather than chasing a stack trace that didn't clearly point at the real cause. MLflow's artifact URIs, if left as hardcoded host paths, simply don't resolve once the same code runs inside a container with a different filesystem layout — solved by resolving the latest model path dynamically at runtime instead of trusting whatever path got baked in at training time. None of these are exotic bugs; they're the ordinary friction of taking a model from "works on my machine" to "works as a service," which is a large part of what MLOps as a discipline actually is.

## Where the Real Work Still Is

The honest next step for this project isn't more infrastructure — the pipeline scaffolding is solid — it's the model itself. Getting R2L and U2R recall up from effectively zero will need either aggressive class reweighting, synthetic minority oversampling, or restructuring the problem as a two-stage classifier (a coarse normal-vs-attack gate, followed by a specialist model for the rare attack types) rather than one flat five-way classifier trying to learn a distribution where two classes barely have enough examples to learn from. That's also the more interesting research question buried in this project: intrusion detection is a genuinely hard imbalanced-learning problem, not just an MLOps plumbing exercise, and no amount of pipeline polish substitutes for actually solving it.

Repo: [github.com/sosush/NetSentinel](https://github.com/sosush/NetSentinel)