---
title: "Spark: What Does a Body of Work Actually Look Like?"
preview: "A GitHub profile is a list. It tells you nothing about how your projects relate to each other, where the gaps are, or what you're actually building toward. Spark renders a portfolio as a navigable 3D graph instead — with an LLM acting as an on-call architecture critic."
date: "June 27, 2026"
sortDate: "2026-06-27"
readTime: "5 min read"
color: "#ff71ce"
---

Scroll through your own GitHub profile sometime and pay attention to what it actually communicates. It's a list — repository names, star counts, a language badge, sorted by recency or popularity. What it doesn't tell you is anything about the *shape* of the work: which projects share ideas, where your skills cluster, whether the last six months moved you toward something coherent or just sideways into six unrelated directions. A list is a terrible format for understanding a body of work, because bodies of work aren't linear — they're relational. Spark started from that specific irritation: staring at a flat repo list and wanting to see it the way you'd see a mind map, not a spreadsheet.

## From List to Graph

The core move is treating every synced repository as a node in a 3D force-directed graph rather than a row in a table. Projects that share technology stacks or heuristic domain classification pull toward each other spatially, so clusters emerge on their own — you can *see*, physically, that four of your projects share a FastAPI backbone, or that your ML work and your web work barely touch, in a way no sorted list would surface. It's rendered with WebGL through a Three.js-based physics engine, so the graph isn't just a static diagram — it's something you rotate, zoom into, and navigate the way you'd explore any spatial structure, which turns "reviewing your portfolio" from a scanning task into something closer to exploration.

## Giving the Portfolio an Opinion

The more experimental piece is what happens once a project is synced: an on-demand critique and roadmapping layer, powered by Llama 3.3 70B running through Groq's inference stack, chosen specifically because the interaction needs to feel closer to instant than to "wait for a spinner." Ask for a critique and the model reads the project's own README and returns architectural feedback — bottlenecks, production-readiness gaps, what a principal engineer would actually flag. Ask for a roadmap and it restructures a vague concept into a staged plan: foundation, then logic and security, then deployment.

This is where the project gets genuinely interesting as an idea, and also where it's most worth being skeptical of itself. The critique is only as good as the documentation it's reading — it has no access to the actual codebase, no visibility into test coverage or commit history, nothing beyond whatever a README happens to say. A confidently-worded critique of a thinly documented project is still a critique of the documentation, not the code. That's not a flaw to hide; it's the central open question the whole feature raises: can an LLM meaningfully assess engineering quality from documentation alone, or does it just produce plausible-sounding commentary that *feels* like assessment? Right now, Spark is honest about being the former dressed as the latter, and figuring out how to close that gap — maybe by actually feeding the model repository structure, dependency graphs, or test output rather than just prose — is the natural next step.

## An Identity Layer That Isn't an Afterthought

Underneath the graph and the critique engine sits a profile system that hosts a resume, manages professional links, and acts as the anchor node the whole constellation builds outward from — all backed by Postgres with row-level security through Supabase, so the "who are you" layer and the "what have you built" layer share the same real-time data store rather than being stitched together as two separate concerns.

## Where This Could Actually Go

The clustering logic today is heuristic — two projects sharing a tech-stack tag cluster together whether or not they're conceptually related. A genuinely better version would embed each project's documentation semantically and cluster on meaning instead of tags, so two projects that solve *similar problems* with *different stacks* would still pull toward each other. Taken further, that's the more interesting long-term direction for something like this: not a portfolio visualizer, but a tool that can look at the shape of everything you've built and tell you, honestly, what you're actually good at versus what you just happen to have shipped the most of — which is a different and harder question than "what repos do you have."

Repo: [github.com/sosush/Spark](https://github.com/sosush/Spark)