---
title: "QuantLedger: The Portfolio Tracker That Takes PPF as Seriously as Nvidia"
preview: "Most finance apps quietly assume your wealth lives in stocks and maybe crypto. QuantLedger starts from a different, more honest picture of what a real portfolio looks like — and builds real risk analytics on top of it."
date: "July 1, 2026"
sortDate: "2026-07-01"
readTime: "8 min read"
color: "#01cdfe"
---

Open almost any portfolio-tracking app and you'll notice something about its design philosophy before you notice anything about its features: it was built by someone whose mental model of "investing" starts and ends with equities. Stocks get real-time prices, clean charts, sometimes options analytics. Everything else — fixed deposits, provident funds, government savings schemes, gold bonds, real estate — gets treated as an afterthought, if it's supported at all. But that's not how most people's actual wealth is distributed. A diversified retail portfolio, especially in India, is a patchwork: some equities, some mutual funds, a fixed deposit or two, a PPF account quietly compounding in the background, maybe a sovereign gold bond bought during a festival sale. None of these behave the same way, and none of them show up in the same dashboard.

QuantLedger starts from the opposite assumption: that the *unglamorous* asset classes deserve the same analytical rigor as the exciting ones, under one roof, with real quantitative metrics computed for all of them rather than just the ones with a stock ticker.

## The Actual Idea

The system aggregates fourteen distinct asset types — equities, mutual funds, ETFs, REITs, crypto, fixed deposits, government bonds, PPF, SCSS, corporate bonds, ULIPs, NPS, real estate, and private equity — into a single authenticated ledger. Live market prices for the tradeable instruments are pulled from Yahoo Finance and cached on a background refresh cycle, so the dashboard reads from warm cache instead of round-tripping to an external API every time someone checks their portfolio. Everything sits behind a typed FastAPI backend, consumed by a React SPA that renders the numbers as an allocation donut, a multi-asset comparison chart, and a rule-based wealth advisory scoreboard.

## How the Risk Layer Actually Works

The quant engine treats every tradeable ticker the way an actual analyst would: pulling a year of price history and computing annualized volatility, a Sharpe ratio benchmarked against a risk-free proxy, and both 12-month and 3-month momentum. These aren't decorative numbers — they get persisted once computed and served from cache afterward, a read-through pattern that keeps the "load my portfolio" path fast even as the underlying calculation (a year of daily returns, standard deviation, annualization by the square root of trading days) is not cheap to redo on every page load.

The more interesting piece is the cross-asset sensitivity matrix. Pick up to five tickers, and the system computes a pairwise beta relationship between each pair from rolling covariance: for every 1% move in asset A, how much does asset B tend to move? This is the kind of question a retail investor almost never gets an easy answer to — "if my tech stock drops, does my gold position actually offset it, or are they more correlated than I think?" — and it requires quietly solving a less obvious problem first: aligning trading calendars across NSE, BSE, NYSE, and NASDAQ, each of which trades on different days and in different timezones, before any covariance number means anything at all.

The wealth advisor layer takes a different approach entirely — not analysis of what you hold, but a recommendation engine for what you might hold. Give it an investment amount, a time horizon, and whether you're thinking SIP or lump sum, and it classifies every known instrument into three risk-return buckets, each scored for suitability against your specific horizon and penalized if you're asking a two-year question about an asset class that really wants a ten-year answer.

## What Happens in Real Use

In practice, the system's most useful moment isn't the dashboard — it's the comparison view. Someone deciding between a mutual fund and a fixed deposit rarely has an easy way to see both plotted on the same axis, at the same scale, over the same period; a fixed-income instrument's near-flat line and an equity fund's volatile one become genuinely comparable once both are rebased to a common index of 100 rather than shown in absolute rupees. That reframing — from "which number is bigger" to "which shape do I actually want exposure to" — is closer to how a professional analyst thinks about risk than how a retail investing app usually presents it.

## Where This Could Go

Two pieces are deliberately stubbed rather than fully built: PAN-based holdings import and MF Central's mutual fund sync, both of which require production partnership access to real depository APIs that a personal project doesn't have. The more interesting future direction, though, isn't finishing those integrations — it's the wealth advisor becoming genuinely adaptive rather than rule-based. Right now the suitability scoring is a fixed set of thresholds; a version that incorporates a user's actual historical behavior (do they panic-sell during drawdowns? do they consistently under-invest relative to their stated horizon?) would turn this from a calculator into something closer to an actual advisor. There's also an open question about whether an LLM-narrated explanation layer — "here's *why* this bucket scored higher for your horizon" — would make the recommendations more trustworthy or just more convincing, which are not the same thing.

Repo: [github.com/sosush/QuantLedger](https://github.com/sosush/QuantLedger)