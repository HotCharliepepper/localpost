# R15 FIRST ANSWER 검증 기록

검증일: 2026-11-18 KST. 사용자 요청 범위: 프런트엔드 후보와 Draft PR / Netlify Deploy Preview. 운영 배포·main 병합은 포함하지 않습니다.

## 기준과 변경

- 시작 HEAD: `0a905828072884ac8cea488d37b0fe2d5c839a26`.
- 재확인한 R14 PR #6 HEAD: `f2f0fc3fa07e6218deb5b9551af0470b1eed97af`.
- 재확인한 원격 main: `593d486ee5915e4846ebf6fb7e667159a1a5e3b2`.
- 새 작업 브랜치: `feat/r15-first-answer-20261118`.
- 빌드 프레임워크·package.json·netlify.toml·빌드 스크립트가 없는 정적 사이트입니다. 기존 구조를 유지했습니다.

| 변경 파일 | 목적 |
| --- | --- |
| `index.html` | 무료 첫 CTA, 출처가 있는 공개 사례와 근거·한계, 공식 세 경로, 정적 결과 구성 제안, 선택형 30일 기본가 비교, 마지막 가격 실험 진입 |
| `r15-first-answer.css` | R14 토큰을 재사용하는 보고서·비교 레이아웃, 모바일 여백, 실행 중 저모션 전환 보완, 기존 주간 시안 대비 보정 |
| `r13-weekly/index.html` | `가격 실험 · 결제 불가` 명시, 랜딩 복귀 링크와 R15 스타일 연결. 가상 가격·스크립트는 동일 |
| `.gitignore` | 로컬 브라우저 도구 로그 제외 |
| `.impeccable/config.json` | 실제 렌더링 측정으로 확인한 정적 검사 오탐과 보존된 R13/R14 표현의 파일별 예외·사유 |
| `QA/R15_*.md`, `QA/r15-*` | 실행 결과, 재현 가능한 QA 함수·대비/비교 스크립트, 근거·범위·보존 리뷰 |
| `previews/r15/` | R14/R15 원본 캡처와 나란히 비교한 이미지, 모션·저모션·주간 시안 증거 |

보존한 제품 원본: `r13-live.js`, `r13-live.css`, `r14-saas-type.css`, `motion.js`, `style.css`, `r10-editorial.css`, 기존 frontend_patch 및 보관된 시안. `R15_FIRST_ANSWER_CODEX.md`도 수정하지 않았습니다. 정확한 blob 대조는 [범위 리뷰](R15_SCOPE_REVIEW.md)에 있습니다.

## 실행 QA

브라우저: Windows Chromium / Playwright 격리 컨텍스트, deviceScaleFactor 1. 사용자 브라우저의 기존 110% 확대 설정을 상속하지 않고 실제 CSS 폭을 확인했습니다. R14 캡처는 위 R14 Git blob을 임시 라우트로 제공했고 동일 CSS·모션 파일을 사용했습니다.

**최종 118개 검사 통과, 실패 0건, JavaScript 오류 0건.** [실행 결과](r15-browser-results.json), [QA 함수](r15-browser-qa.js).

| 항목 | 결과 |
| --- | --- |
| 1440×900 / 768×1024 / 390×844 / 360×780 / 360×640 | 첫 CTA·두 번째 CTA·바로 시작 링크·N 표시, 의도한 오른쪽 crop, 가로 넘침 없음 |
| 공개 사례 | 판정·근거·한계 기본 공개. 상세 설명 접기 여부와 무관. JavaScript 비활성화 상태도 읽기 가능 |
| 앵커 | `#first-answer` 이동·브라우저 뒤로 가기, `#pathways` skip link 및 실제 포커스 이동 통과 |
| 키보드 | 첫 Tab의 skip link, Enter로 이동, 다음 Tab의 탐색 링크, details Enter/Space 열기·닫기 및 포커스 테두리 확인 |
| 공식 경로 | 주 CTA `/analyze`, 세 카드 `/explore`, `/place`, `/analyze` 목적지·새 탭·opener 차단 확인 |
| R13 모션 | 0.25/0.6/0.98/0 스크롤 진행, question/clarity 전환, inert 접근성 상태와 역방향 복귀 확인 |
| 저모션 | 처음부터 reduce 설정 및 clarity 중 설정 변경. 정적 제목/CTA, animation:none, 자동 스크롤, overlay 비표시 확인 |
| 주간 실험 | 무응답 진행 방지, Free/7일/14일 선택, 기존 가격, 모의 완료·요약·복귀, 모바일 넘침 없음 |
| 네트워크 | 마케팅 문서·정적 자산 GET만 발생, POST·API 호출 없음 |

공식 분석 경로는 **브라우저 컨텍스트에서 먼저 가로채어** 목적지 이동만 검증했습니다. 공식 분석 서버에는 요청을 보내지 않았습니다. 실제 분석 성공·회원 권한·무료 횟수 차감을 검증했다는 의미가 아닙니다.

첫 실행의 [기록](r15-browser-round1.json)에는 저모션 전환 시 R13의 더 강한 선택자가 제목을 숨기는 문제가 남아 있었습니다. R15 선택자의 우선순위로 해결했습니다. 나머지 최초 실패는 부드러운 앵커 이동이 끝나기 전 측정하거나 글자 대신 전체 블록 영역을 겹침으로 계산한 검사 문제였으며, 대기와 실제 텍스트 Range 측정으로 정정했습니다. 작은 모바일에서는 빠른 시작 링크와 나침반 사이 여백도 보완했습니다.

## 대비와 디자인 검사

- 실제 렌더링의 글자색·글자 Range를 수집하고, 글자만 투명하게 만든 동일 화면의 배경 PNG에서 각 Range의 15개 지점을 측정했습니다.
- home/case/paths/depth/weekly의 **136개 텍스트 구간 통과**, 최저 **4.68:1**. 전 픽셀·모든 스크롤 상태의 접근성 인증은 아닙니다.
- [샘플 입력](r15-contrast-samples.json), [결과](r15-contrast-results.json), [계산 스크립트](r15-contrast.ps1). `contrast-*.png`는 측정용으로 글자를 숨긴 이미지입니다.
- 주간 시안의 브랜드 보조 글자, 단계 숫자, 선택 설명, 가격 단위의 색을 R14 muted 계열로 보완했고 브랜드 보조 글자는 12px로 올렸습니다.
- [최초 정적 검사](r15-design-findings.json)의 그라데이션 합성 배경 오탐은 렌더링 측정 근거로 `low-contrast`를 해당 HTML 두 파일에 한정하여 예외 처리했습니다. 추후 수정 시 렌더링 대비를 다시 확인해야 합니다.
- 기존의 부드러운 오프셋 그림자·나침반 aura·방사형 가이드·순서가 있는 주간 3단계 표시는 사용자 보존 범위이므로 해당 파일별 규칙 예외를 기록했습니다. 전체 규칙/전체 파일 차단은 사용하지 않았습니다.

## 시각 증거

- [데스크톱 R14 / R15 첫 화면](../previews/r15/r14-vs-r15-desktop.png)
- [모바일 R14 / R15 첫 화면](../previews/r15/r14-vs-r15-mobile.png)
- [데스크톱 R14 / R15 본문](../previews/r15/r14-vs-r15-desktop-content.png)
- [모바일 R14 / R15 본문](../previews/r15/r14-vs-r15-mobile-content.png)
- [R13 clarity 보존](../previews/r15/r15-desktop-clarity.png)
- [모바일 저모션](../previews/r15/r15-mobile-reduced.png)
- [주간 시안 첫 화면의 결제 불가 표시](../previews/r15/r15-weekly-mobile-top.png)

sticky 모션의 예약 스크롤 높이를 빈 페이지처럼 표현하는 fullPage 캡처는 제출 증거에서 제외했습니다. 첫 화면과 본문을 각각 실제 렌더링해 비교합니다. 이미지 합성은 좌우 배치와 제목 추가만 수행합니다.

독립 시각 리뷰는 필수 R15 캡처 12개와 R14 비교, 코드·diff·QA를 검토해 **SHIP — Draft PR / Preview 제출 범위**로 판정했습니다. 필수 수정 없음. 실제 분석·권한·결제 및 최종 호스팅 검증을 대신하는 승인도, 운영 출시 승인도 아닙니다. 기존 clarity 장면의 작은 제목 위 라벨 등 R13/R14 보존 항목이 있어 모든 일반 디자인 규칙을 만족한다고 주장하지 않습니다.

## 미실시·미확인

- 실기기 Safari/iOS/Android 및 스크린리더, 고객 대상 이해도 검증은 미실시입니다. 모바일은 Chromium viewport 검증입니다.
- 공식 서비스 로그인 이후 분석·판정·사용 한도·인증·권한·결제·환불은 미실시입니다.
- 공개 사례의 개별 원자료 버전·정확한 산출 경계 및 실제 API/결과 복귀 계약은 미확인입니다. [Manduk 검토 요청](R15_MANDUK_REVIEW.md)에 정리했으며 외부 전송하지 않았습니다.
- 기본가와 조건부 프로모션을 구분했습니다. 7일/14일 상품은 승인·판매하지 않습니다.
- main 병합·운영 배포는 실행하지 않습니다. Draft PR의 main 대비 diff는 미병합 R14 변경을 포함합니다. R15만의 변경 기준은 시작 HEAD입니다.

최종 Draft PR / Preview 확인 결과와 commit SHA는 PR 설명 및 별도 Preview 검증 기록으로 제공합니다.
