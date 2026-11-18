# R15 Draft PR / Netlify Preview 확인

확인일: 2026-11-18 KST.

- [Draft PR #8](https://github.com/HotCharliepepper/localpost/pull/8): open, draft=true, merged=false.
- 브랜치: `feat/r15-first-answer-20261118` → base `main`.
- [Deploy Preview](https://deploy-preview-8--localscopekorea.netlify.app/).
- 검증한 구현 커밋: `20c1ab4309f0775200d232f6fb82aa6753cf770c`.
- 구현 Deploy: `6afc8215dec26ea1d81ad5b3`, ready, context=deploy-preview, review_id=8, commit_ref=위 구현 SHA, published_at=null, error_message=null.
- [해당 구현의 고정 Preview](https://6afc8215dec26ea1d81ad5b3--localscopekorea.netlify.app/).

이 기록과 Preview 캡처는 구현 커밋을 검증한 뒤 추가했습니다. 후속 커밋은 문서·검증 JSON·캡처만 추가하며 제품 HTML/CSS/JS는 동일합니다. 최종 PR HEAD의 배포 성공과 SHA는 PR 설명 및 완료 보고에서 다시 확인합니다.

## 호스팅된 화면 검증

실제 Preview에서 1440×900, 390×844, 360×780 저모션을 실행했습니다. **13개 smoke 검사 통과, JavaScript 오류 0건**입니다.

- 각 화면 HTTP 200, 실제 CSS 폭, 가로 넘침 없음, 주 CTA 문구·공식 `/analyze` 목적지, 제목 가시성.
- 각 화면 키보드 첫 Tab의 skip link, 새 진입 `#first-answer` 위치, 결과 구성 details 열기.
- 주간 시안의 `가격 실험 · 결제 불가` 표시.
- 추가 왕복 확인: 랜딩의 실험 링크 → `/r13-weekly/` → 브랜드 링크 → `/#decision` 정상 복귀.
- 공식 분석 도메인의 요청은 차단했습니다. 실제 분석·로그인·결제는 실행하지 않았습니다.

[원시 결과와 해시](r15-preview-results.json), [데스크톱](../previews/r15/preview-desktop.png), [모바일](../previews/r15/preview-mobile.png), [360px 저모션](../previews/r15/preview-small-reduced.png).

## 배포 자산 대조

줄바꿈을 LF로 정규화한 SHA-256으로 로컬 구현과 호스팅 파일을 비교했습니다.

- `r15-first-answer.css`, `r13-live.css`, `r13-live.js`, `r14-saas-type.css` **4개 파일 일치**.
- 두 HTML의 기존 인라인 스크립트 해시 **일치**.
- HTML 전체 해시는 Netlify 후처리 때문에 다릅니다. 확인된 차이는 내부 `index.html` 링크를 디렉터리 URL로 바꾸는 Pretty URLs와 Deploy Preview 도구의 `/.netlify/scripts/cdp` 자동 삽입입니다. 이 작업에서 설정하거나 구현한 API·분석 스크립트가 아닙니다. 실제 왕복 링크를 별도로 확인했습니다.

## 운영 불변

읽기 전용 GitHub/Netlify 플러그인 및 `git ls-remote` 재확인:

- 운영 published Deploy: `6afc68edbd17e0a436a003ae` 그대로.
- 운영 context=production, branch=main, SHA=`593d486ee5915e4846ebf6fb7e667159a1a5e3b2` 그대로.
- 운영 게시 시각: `2026-11-17T14:47:34.342Z` 그대로.
- 원격 main SHA 동일. main에 push·병합하지 않았습니다.
- Preview 생성은 별도 브랜치의 Draft PR에 대한 기존 Netlify 설정으로 이루어졌습니다. 운영 게시·배포 설정·공식 서비스 변경은 하지 않았습니다.

로컬 상세 QA 및 미확인 범위는 [R15 QA 기록](R15_FIRST_ANSWER_QA.md)에 있습니다. 이 Preview 성공은 실제 분석·상품 정책·결제·운영 출시 승인을 뜻하지 않습니다.
