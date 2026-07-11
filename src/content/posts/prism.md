---
title: "Prism: If You Can't Out-Detect a Deepfake, Stop Trying To"
preview: "Deepfake detectors are fighting a war they lose by design — every detector trains the next generator. Prism is a hackathon exploration of a stranger idea: verify a human by measuring physics a generator has no reason to simulate at all."
date: "June 3, 2026"
sortDate: "2026-06-03"
readTime: "6 min read"
color: "#ff9b71"
---

There's a specific trap that deepfake-detection research keeps falling into, and it's worth naming plainly: any detector trained to spot the flaws in today's generated video becomes, the moment it's published, training signal for tomorrow's generator to fix exactly those flaws. It's an adversarial arms race with a structural asymmetry built in — the detector has to be right about every new generation technique, while the generator only has to find one gap. Pixel-level detection, as an approach, is chasing a target that's actively trying to stop being caught.

Prism, a team hackathon project, starts from a genuinely different premise: what if you stopped analyzing pixels entirely, and instead measured things that are physically true about a living human face — properties a video generator has no reason to even attempt simulating, because nobody told it those properties existed?

## The Physics Nobody Renders

A real cornea is a curved, wet optical surface, and light hitting it produces a specific, well-understood pattern of reflections — the Purkinje images ophthalmologists have studied for over a century. A generative model rendering a face has no incentive to get this right, because nothing in its training objective ever asked it to; it renders eyes as convincing-looking textures, not as physically accurate optical surfaces, so the reflection geometry tends to be subtly, measurably wrong. The same logic applies to skin: real skin is a translucent, layered medium where red light penetrates deeper than blue light before scattering back out, producing characteristic differences in shadow softness across color channels. Most rendering treats skin as an opaque, matte surface, because photorealism at a glance doesn't require getting subsurface light transport right — it only starts to matter once you're specifically looking for it. And a real face has a pulse: a faint, rhythmic color shift as oxygenated blood moves through facial capillaries, invisible to the eye but recoverable computationally. A synthetic face has no circulatory system, so there's no physiologically coherent version of that signal to find, no matter how convincing the video looks.

Individually, each of these is a research-grade physics measurement, not a heuristic. Combined, and layered with an active challenge — flashing a random color sequence at the screen and checking whether it correctly reflects off the user's face within a strict latency window, which pre-recorded video simply cannot react to — the idea is a verification system that doesn't need to know anything about how deepfakes are generated today, because it's not looking for generation artifacts at all. It's looking for physics that only a living human produces as an unavoidable side effect of being alive.

## The Harder Problem Underneath: Privacy

A system that verifies "this is a real human" by analyzing someone's face, pulse, and biometric signal is, on its face, a privacy nightmare if built naively — nobody should have to trust a company to store their heart rate. The project's answer is to push the verification computation itself into a zero-knowledge circuit: the physics-detection model runs locally, and what gets produced isn't the video or the biometric data at all, but a cryptographic proof that a specific model produced a specific output ("this is a live human, with high confidence") on some private input — verifiable on-chain without the underlying data ever leaving the device that captured it. That's a genuinely well-scoped answer to a problem that a lot of biometric verification systems don't even try to solve, since it decouples "prove you're human" from "trust us with your face."

## What Actually Needs to Be True for This to Work

Worth being honest about the gap between concept and validated system: a claim like ">99% detection accuracy" is only meaningful once it's been measured against a labeled dataset of real deepfakes attempting to specifically spoof each of these physical signals — corneal reflection, subsurface scattering, and rPPG all have known research literature behind the *idea*, but a hackathon-scale system stitching four signals together into one pipeline is a different animal from a validated production detector, and that validation work is the honest bottleneck between "interesting concept" and "thing you'd actually deploy."

## Where an Idea Like This Actually Goes

The more it's poked at, the more the physics-based framing looks like a genuinely underexplored direction relative to how much research attention pixel-based detection gets — and the natural extension isn't more physics signals, it's asking whether the same "verify physical properties a generator has no reason to simulate" logic generalizes to other modalities. Audio deepfakes have an equivalent gap: real speech production involves vocal-tract resonances and breath dynamics that voice synthesis doesn't need to model correctly to sound convincing to a human ear, the same way rendered skin doesn't need correct subsurface scattering to look convincing at a glance. The unifying idea — find the physically-true side effect of being a biological system that the fake doesn't need to fake in order to fool a human observer — is bigger than any one project, and this was a first attempt at building around it in one modality.

*Built with a team; my contribution was the integration layer connecting the frontend, backend, and auth service into one working pipeline.*

Repo: [github.com/sosush/Prism](https://github.com/sosush/Prism)