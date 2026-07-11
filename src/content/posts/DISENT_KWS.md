---
title: "DISENT-KWS: Teaching a Model to Forget Who's Talking"
preview: "A wake-word model that only responds to your voice saying the right word has to solve a strange problem: how do you make a network care about *what* was said without letting it also learn *who* said it?"
date: "June 15, 2026"
sortDate: "2026-06-15"
readTime: "7 min read"
color: "#71f2ff"
---

Say "hey, unlock" to your phone, and two completely different questions get answered at once, whether the system is designed to separate them or not: was that phrase said, and was it said by the right person? Most keyword-spotting systems only really answer the first question — they're trained to recognize a phrase, full stop, which means a recording of your voice, or in principle anyone else's voice saying the same words with the right cadence, can trigger the same response. For a wake word, that's a minor annoyance. For anything resembling access control, it's a real vulnerability. The interesting technical problem underneath that gap is this: a neural network trained on audio doesn't naturally separate "the content of speech" from "the identity of the speaker" — those two signals are physically entangled in the same waveform, and a model with no reason to keep them apart will happily let one leak into the other.

## The Actual Puzzle

Built for a speech-disentanglement hackathon problem statement with my teammate Swarnim Tripathi under team name Noisy AF, DISENT-KWS treats that entanglement as the central problem to solve, not a side effect to tolerate. The naive fix — train two completely separate models, one for keyword detection and one for speaker verification — works, but wastes the fact that both tasks are extracting different information from the *same* underlying audio. The harder and more interesting version is one shared encoder feeding two heads that are explicitly, adversarially trained not to leak into each other: a phonetic head that's discouraged from being predictive of speaker identity, and a speaker head that's discouraged from encoding *what* was said rather than *how* it was said.

## How the Disentanglement Actually Happens

A shared BC-ResNet-2 encoder processes incoming audio and feeds a temporal block, which then splits into two paths: a causal Conformer producing an embedding tuned for keyword content, and an ECAPA-TDNN-style head producing an embedding tuned for speaker identity. Left alone, nothing stops these two embeddings from converging toward encoding similar information — a network optimizing purely for accuracy has no built-in incentive to keep them separate. So two mechanisms are layered on top to force the separation: a gradient reversal layer that adversarially penalizes the phonetic head whenever it becomes predictive of speaker identity, and a mutual-information estimator that directly measures and minimizes the statistical dependence between the two embedding spaces during training. Neither one alone is quite enough — the adversarial signal alone tends to destabilize early training before the encoder has learned anything worth disentangling, and the mutual-information penalty alone is comparatively weak — but combined, and ramped up gradually rather than applied at full strength from the first training step, the two together produced meaningfully more stable convergence.

The system layers a third defense on top of the architecture itself: at inference time, a match requires *both* the keyword embedding and the speaker embedding to independently clear their similarity thresholds against an enrolled voiceprint. A high score on one axis alone isn't enough — which mirrors, structurally, the same principle behind requiring two independent factors in authentication rather than trusting one strong signal.

## What Happens When You Actually Test the Pieces

The most revealing result wasn't the headline accuracy number — it was the ablation study, where each architectural component gets switched off one at a time to see what actually mattered. Removing the temporal block was catastrophic: keyword error rate more than doubled and speaker error rate rose by half again, by far the largest single effect of any component tested. Removing a conditioning layer designed to help the model attend to the right speaker/keyword pairing, on the other hand, changed almost nothing on the test set used — which is a genuinely useful negative result, because it suggests either that mechanism is redundant with what the temporal block already captures, or that the test set isn't hard enough to expose the gap it's meant to close. Negative results like that are easy to leave out of a project writeup and much more informative than they get credit for.

## Where the Idea Extends

The obvious next step is testing under conditions that actually resemble deployment — background noise, overlapping speech, far-field microphones — rather than clean benchmark recordings. But the more interesting direction is architectural: if a shared encoder can be trained to disentangle *content* from *identity*, the same trick generalizes well beyond keyword spotting. Emotion versus content, accent versus phoneme, even something like disentangling *what* a medical symptom description says from *who* is describing it, for downstream fairness reasons — the core mechanism (adversarial reversal plus a direct mutual-information penalty, applied to a shared representation) is a general tool for forcing a network to stop conflating two signals that happen to travel together in the raw data, and speech is just one of many domains where that conflation quietly causes problems.

Repo: [github.com/sosush/DISENT_KWS](https://github.com/sosush/DISENT_KWS)