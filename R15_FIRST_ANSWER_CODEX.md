# LocalScope R15 — FIRST ANSWER / Free-first UX design + Codex work order

Status: design and coding instructions, not an implemented R15 release.
Prepared: 2026-11-18 KST.
Objective: implement by the user's pre-03:00 stop boundary; target publication to the user's own Netlify site after 10:00 KST only if QA and approval are complete.

## 0. Reference and preservation

- GitHub: HotCharliepepper/localpost
- The production main last observed: 593d486ee5915e4846ebf6fb7e667159a1a5e3b2 (R13.3).
- R14 copy/typography draft: PR #6, SHA f2f0fc3fa07e6218deb5b9551af0470b1eed97af.
- The starting branch for this work order: draft/r15-first-answer-free-first-20261118, created from the above R14 PR #6 head. Recheck both refs before coding and record the exact active HEAD.
- The user's own marketing/preview site: https://localscopekorea.netlify.app/
- Official live product, managed by Manduk: https://localscope.co.kr/
- Do not modify or guess backend/API/database/scoring/permissions/auth/Toss Payments/product entitlement contracts, and do not merge main or publish this design automatically.
- Do not change R10/S07 motion originals or break the current R13.3 compass/transition; R15 is primarily ordering of content, copy, public-case illustration and access to the real free experience.

## 1. Independently verified public product facts (2026-11-18 lookup)

Official product homepage states:
- Immediate analysis entry is accessible without first registering; registered Free includes five analyses per month.
- Free shows one verdict completely; other verdicts have restricted preview according to the official live policy.
- User states: industry known -> /explore; location known -> /place; both known -> /analyze.
- Public case: Seoul Jamsil 6-dong, bar/pub category, 'caution' verdict. The public homepage displays a 1.4% pub share against an 11.6% national comparator and discusses the distinction between low competition and lack of evening demand. Verify figures/context in the official source again before displaying.
- Actual official paid products are still 30-day access: Basic 19,900 KRW, Pro 39,900 KRW. Automatic renewal is not applied.
- 7-day and 14-day access is only an unapproved experiment (proposed 7-day Basic 9,900 / Pro 19,900; 14-day Basic 16,900 / Pro 34,900). It is not currently available for payment.
- A verdict is not a store sales forecast or a guarantee of business success.

References:
https://localscope.co.kr/
https://localscope.co.kr/terms
https://localscope.co.kr/refund

Website marketing content is not proof of the actual logged-in flow or server entitlements; use observed behavior or Manduk-approved contract to validate these.

## 2. Core journey — FIRST ANSWER

Frame as: 'Question -> small, complete public proof -> first real analysis -> verdict, reasons, limits -> optional deeper comparison.'

**Do not** frame this as 'show a deliberately incomplete answer to trigger payment.' Give the user one genuinely useful and honest completed experience.

### Hero / Screen 01

Preserve the cinematic composition, red N and deliberate right-cropped compass. Maintain the prominent existing question:
'사람이 많은 자리면 잘될까?'

One supporting line:
'내 업종에 맞는 자리인지, 판정과 근거로 확인해 보세요.'

Primary CTA: '무료로 내 자리 확인하기' -> official https://localscope.co.kr/analyze (open official site explicitly, not mock analysis).
Secondary CTA: '실제 판정 사례 먼저 보기' -> local #first-answer.
Keep the three user starting-point paths discoverable without required animation or account sign-up.

The animation should not block either CTA. No new scroll lock or timers. Preserve keyboard/focus and prefers-reduced-motion behavior.

### Screen 02 / First Answer: verified, publicly available example

Use one real, already-published case, never a made-up user verdict.
- Headline: '좋다고 생각한 이유, 맞는지 확인해 볼까요?'
- Label: '공개된 실제 판정 사례 · 내 후보지 결과가 아닙니다.'
- Case: Seoul Jamsil 6-dong · pub/bar category, original source's verdict '주의' if verified.
- Progressively reveal: common assumption -> actual published verdict -> one or two verifiable supporting figures/reasons -> data limitations -> what to investigate on-site.
- If a figure/date is not verified, omit it; do not invent sample metrics. Cite/link the official original next to the excerpt.
- The tiny first result must be comprehensible without a purchase and without waiting for the animation.
- The 'more questions' affordance can be an expandable explanation, but critical caution, contradiction, or lack of evidence must never be hidden behind a purchase prompt.
- Explicitly distinguish public historical/example facts from a new user's actual analysis.
- If no direct detailed case URL is officially supported, link the official homepage and identify the public case there; do not invent query parameters.

### Screen 03 / Begin MY free answer

Heading: '이제 내 자리도 확인해 볼까요?'
- Industry only: '업종을 정했어요' -> /explore.
- Location only: '자리를 정했어요' -> /place.
- Both: '둘 다 정했어요' -> /analyze.
All targets at https://localscope.co.kr on the approved official domain, opening in a new tab if the separate product origin should remain visually clear. Make the fact that this is a separate official service clear in the UI.
No simulated analysis request in the marketing site and no copying user-entered locations into external URLs.

### Screen 04 / After REAL free verdict — design only, NOT backend implementation

The actual service result area belongs to Manduk's repository and access policy. Provide a static, clearly labeled experience specification, not a fake live verdict:
1. One-line verdict (including a 'cannot judge' state).
2. Evidence units, source and effective date adjacent to the verdict.
3. Explanation of limitations (regional coverage, lagging data, estimation vs observation).
4. Next field action to check.
5. Only if the customer needs more depth: compare other candidates, see restricted detailed evidence, or examine narrower map areas.

Do NOT implement a hidden result or a fake paid entitlement on localpost. If future return-to-result or upsell requires an integration contract, write a Manduk review request identifying exact needs and alternatives. Do not manufacture state or query parameters.

### Screen 05 / Optional paid depth

Place the purchase concept after the proof/first-real-verdict opportunity, not above it as a mandatory step.
Main marketing wording: '더 비교해 보고 싶다면, 필요한 범위를 선택하세요.'
- Free: first analysis and one public verdict, under the actual official Free policy.
- Current official Basic/Pro: represent actual price and period only when sourced and checked; clicking a live purchase must remain under the official server/PG flow.
- The 7-day/14-day concept links only to /r13-weekly/index.html and must be labeled '가격 실험 · 결제 불가' on the CTA AND on the prototype itself.
- Do not display fake "discount", list price, false scarcity countdown, fictitious testimonials, invented success probability or inflated purchase benefit.
- If a user is not ready, provide '무료로 계속 탐색하기' without pressure.

## 3. Screen hierarchy / layout

- First viewport: real question, one sentence, primary free-start CTA, secondary real-case CTA, visible skip/fast path.
- Second block: real public-case mini report, structured as 'Common belief / Verdict / Why / So what'.
- Third block: user-state choice cards /explore, /place, /analyze.
- Fourth: product philosophy ('the verdict is not a sales guarantee') and optional purchase-depth explainer.
- Last block: the existing weekly experiment link, clearly marked preview-only.
- Use R14 SaaS palette and typography: deep navy + red needle for question, teal/soft sage for relief, crisp cards and accessible body text for proof. Preserve the photo-1 right-edge crop of the compass and the current compact motion.
- Korean copy should use short clauses, natural spacing, one judgment per sentence. Favor user actions over internal process jargon.

## 4. Exact files Codex should inspect first

index.html
r13-live.css
r13-live.js
r14-saas-type.css
r13-weekly/index.html
R14_NATURAL_KOREAN_SAAS_QA.md
package.json, netlify.toml, build scripts IF present (do not assume they exist)

Inspect actual repository structure and Git diffs before editing. Prefer touching only index.html and a focused R15 stylesheet, not rebuilding the site or duplicating a second full index.

## 5. QA and completion criteria before 03:00

### Must pass
- At 1440, 768, 390 and 360 px: legible first viewport, no broken words/cropped CTA/compass overlapping key text.
- The right-cropped compass is deliberate; north marker and needle's meaningful portion remain visible.
- Primary CTA reaches official /analyze; three choice paths reach their own correct endpoints.
- Secondary CTA navigates to real published case; direct anchor and back navigation work.
- No invented data, date or unsupported quantitative claim.
- No server billing/entitlement/API code changed; no actual purchase on weekly prototype.
- Loading/empty/error/cannot-judge states are identified as future integration states where actual live product is unavailable.
- Keyboard tab order and focus visible; reasonable contrast; reduced-motion provides static understanding.
- No marketing screen that implies a successful live analysis result without real data.
- Screenshot + diff review before declaring success.
- Check that any automatic GitHub PR preview does not modify production.
- Avoid automated calls to the live analytical endpoints that may consume Free allowances.

### Outputs
- Safe working branch and Draft PR + Netlify Deploy Preview.
- R14 vs R15 side-by-side desktop/mobile screenshots.
- Files changed and why.
- QA log: passed, failed, not run.
- Exact final commit SHA, separate from PR number.
- If something is blocked before 03:00, freeze the branch with a clearly stated blocker. Do not publish an unverified release merely to meet the time.

## 6. Launch gate — 10:00 KST or later, NOT automatic

Target date 2026-11-18 after 10:00 KST for the user's own localscopekorea.netlify.app site only.
The launch is conditional on approved design, passed critical UI/CTA QA, correct Netlify deploy preview and explicit user's go-ahead.
Before merge, re-fetch the latest main SHA and rebase/merge safely if needed. No force push or overwriting someone else's changes.
Manduk's actual localscope.co.kr website, checkout, database, entitlement and production deployment are a distinct workstream and must not be touched.

Definition of done tonight: R15 frontend candidate + verified Preview + QA report.
Definition of done after 10:00: an explicitly approved merge and verified Netlify production deploy, not just a file upload.
