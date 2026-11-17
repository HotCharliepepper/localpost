# LocalScope R13 — Pricing & Payment Experience Lab

Status: **Independent frontend demonstration**, 2026-11-17. Not an approved price, real checkout, permission system, or integrated operating frontend.

## Entry
Open `r13-lab/index.html` in a browser or Netlify Deploy Preview at `/r13-lab/`. This is a single-file static HTML/CSS/JS experience with no build tool and no external libraries.

## Source and isolation
- Source GitHub repository: `HotCharliepepper/localpost`
- Baseline production branch when created: `main` at `b56f0b0600fb9f281ac3652b08c6ac7b2698d66b` (R10).
- R12 was reportedly finished locally but is **not present on the remote main verified at creation**. Do not pretend this lab includes R12.
- Lab branch: `preview/r13-pricing-experience-lab-20261117`
- All work is isolated under `r13-lab/`. The repo root and existing frontend are unchanged.
- Do not merge to main or deploy to the user's existing production URL as part of this experiment.
- No app integrations, payments, forms, backend/API, authentication, storage, pricing policy or authorization changes.

## Three interactive stages
1. Price comparison: A current 19,900/39,900; B experimental 24,900/49,900; C experimental 29,900/59,900; Free 0. Change between 30-day and 7-day experimental pricing and select plans.
2. Experience story: illustrative free verdict → evidence comparison → mock order confirmation → mock continuation of original analysis. Never a real charge.
3. Choice study: user situation, preferred access period, decision driver and outstanding question. Responses are held in JavaScript memory only; users can copy a summary manually.

## Price configuration
Inside `index.html` near the beginning of the inline JS:
- `SCENARIOS`: A, B, C 30-day prices.
- `WEEK_PRICES`: 7-day hypotheses (9,900 Basic; 19,900 Pro).
- `price(plan)`, `renderPricing()`: read the same values. No duplicate canonical pricing data file.

**7-day model is entirely hypothetical.** Allowances, AI model, early expiry, upgrades, refunds, renewals and server enforcement require Manduk's product and backend review before any official offer. Do not imply that 7-day plans carry 30-day limits.

## Public source cross-check (2026-11-17)
- LocalScope current publicly shown 30-day prices: `https://localscope.co.kr/`
- Donspot/상권스캔 current dedicated price page: `https://www.donspot.com/pricing` (50,000 KRW per complete report; 450,000 KRW 10-pack; public homepage may show conflicting earlier 45,000 KRW — do not silently reconcile).
- 여기 돼?: `https://www.xn--ok0bz3ittr.kr/pricing` (19,900 / 49,000 / 99,000 KRW monthly).
- Do not treat competitors' different terms, report depth, or market coverage as equivalent units.

## Explicitly unimplemented
- Real payment / Toss Payments / test charge
- Entitlement checks or premium results
- Persisted responses / conversion analytics / A/B assignment
- API requests and genuine results
- Real discount pricing or discount timers
- Sharing of private customer location or analysis

## QA checklist
- [x] GitHub branch isolated from main.
- [x] Inline JS syntax parsed successfully with V8 Function constructor.
- [x] Expected interactive HTML nodes and scenario elements present.
- [x] Index marked `noindex,nofollow`.
- [ ] Browser interactive clicks and copy behavior — test after hosted preview.
- [ ] Desktop 1440, tablet 768, mobile 390/360 screenshots — not yet verified.
- [ ] Netlify deploy preview status and HTTP response — check after PR.
- [ ] Keyboard and reduced-motion manual audit — not yet verified.

Success condition for this phase: live accessible **test-only** Netlify Deploy Preview URL, followed by a real browser walkthrough. This is *not* a production rollout.

## Decision before later stage
Compare comprehension, purchase intention, trust and preference for 7-day vs 30-day use. Record actual users' reasons. Before pricing policy changes, Manduk must confirm price, entitlement, refunds, tax and server billing contracts.
