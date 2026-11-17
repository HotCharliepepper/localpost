# R15 FIRST ANSWER — 독립 정적 범위 리뷰

검토일: 2026-11-18 KST

검토 기준: `R15_FIRST_ANSWER_CODEX.md` 전체, 시작 커밋 `0a905828072884ac8cea488d37b0fe2d5c839a26` 대비 작업 트리

검토 브랜치: `feat/r15-first-answer-20261118`

판정: **정적 범위 검토 통과. 이 검토에서 P0/P1/P2 신규 결함은 발견하지 못했습니다.**

이 문서는 코드·diff·공개 출처·배포 설정 검토입니다. 실제 렌더링, 키보드 이동, 저모션 전환, 스크린샷 및 최종 Preview 검증을 대신하지 않습니다. 최종 실행 QA는 별도 기록을 확인해야 합니다. 제품 코드에는 수정하지 않았습니다.

## 요구사항과 구현 대조

| 항목 | 확인 근거 | 판정 |
| --- | --- | --- |
| 첫 화면 질문과 R14 지지 문장 | `index.html` 101–102행의 기존 문구 유지 | 통과 |
| 무료 진입과 공개 사례 CTA | `index.html` 104–107행. `/analyze`, `#first-answer`, `#pathways`를 직접 연결 | 통과 |
| 외부 서비스 구분 | 무료 진입에 새 탭 안내, 각 경로의 표시·접근성 이름, `target="_blank"`와 `noopener noreferrer` | 통과 |
| 공개 사례와 실제 내 결과 구분 | 149–177행. 공개 사례 라벨, 잠실6동·주점·주의, 지표 단위·출처·한계·현장 확인을 기본 공개 | 통과 |
| 핵심 주의·불확실성 공개 | 주점 비중만으로 저녁 수요를 확정하지 않는 문장과 자료 한계를 접기 영역 밖에 배치 | 통과 |
| 세 시작 경로 | 183·186·189행의 `/explore`, `/place`, `/analyze` 고정 URL | 통과 |
| 실제 결과 구현 경계 | 202–205행. 정적 구성 제안이라고 명시하고 불러오는 중·결과 없음·오류·판단할 수 없음을 향후 연동 상태로 설명 | 통과 |
| 선택형 이용권 배치 | 공개 사례와 실제 분석 진입 뒤 Free/Basic/Pro 안내. 무료 계속 탐색 링크 제공 | 통과 |
| 상품 정책·가격 실험 구분 | 기본 상품 30일·기본가, 최종 조건 공식 확인. 실험 CTA와 주간 시안 헤더에 `가격 실험 · 결제 불가` | 통과 |
| 프런트엔드 범위 | 신규 JavaScript 없음. 기존 두 HTML의 인라인 스크립트 내용 동일 | 통과 |
| 정적 앵커 | `index.html`의 내부 링크 대상 누락 0건, 중복 ID 0건 | 통과 |

행 번호는 이 리뷰 시점의 작업 트리 기준이며 후속 편집에 따라 달라질 수 있습니다.

## 공개 근거 재대조

- [공식 홈페이지](https://localscope.co.kr/)의 잠실6동·주점 사례에 `주의`, 음식점 중 주점 1.4%, 전국 11.6%가 있습니다. R15는 이를 같은 단위로 표시하고 공식 해석과 자체 현장 확인 안내를 구분합니다.
- 홈페이지 사례 묶음의 2026년 10월·각 동 대표 지점 반경 500m 표기를 개별 원자료 기준일로 바꾸지 않았습니다. R15는 공개 페이지 재확인일과 원자료 미확인을 따로 적었습니다.
- 홈페이지의 비가입 분석 진입, 등록 Free 월 5회·판정 1개 전체 공개 안내와 일치합니다. `/explore` 등의 실제 인증·횟수 차감 동작은 이번 정적 검토로 확인한 것이 아닙니다.
- Basic 19,900원/30일과 Pro 39,900원/30일은 공개 기본가와 일치합니다. [결제·환불 정책](https://localscope.co.kr/refund)에 존재하는 조건부 첫 Basic 30일 9,900원 프로모션과 혼동하지 않도록 `기본가`와 최종 조건 안내를 붙였습니다.
- 자동 갱신 없음과 매출·성공 보장 없음은 [이용약관](https://localscope.co.kr/terms), [결제·환불 정책](https://localscope.co.kr/refund)의 공개 안내와 일치합니다.

`QA/R15_MANDUK_REVIEW.md`는 미확정 API·상태·권한·결과 복귀 계약과 현재의 고정 경로 대안을 구분합니다. 질문 목록을 승인된 계약으로 표현하지 않으며 외부 전송을 하지 않았음을 명시합니다.

## 원본·스크립트·데이터 경계

`git hash-object` 결과를 시작 커밋의 해당 blob과 비교했습니다. 다음 파일은 동일합니다.

| 파일 | 보존된 Git blob SHA |
| --- | --- |
| `r13-live.css` | `af993439730358705c0def8354c5174988f8857f` |
| `r13-live.js` | `e4d13cc15d4d8356d83d84805921c79c68ebbf14` |
| `r14-saas-type.css` | `f1c7b5f45aa8f823e95e0deac497e820093432cc` |
| `motion.js` | `cfeafc5ba95419740a3b8ad015587e7be334d954` |
| `style.css` | `ecf456ad04519c7dc8a13217faf2485ec3306698` |
| `r10-editorial.css` | `3e632138d416a7e806431ada26576f82613cc000` |

- 기존 추적 파일 diff는 `index.html`, `r13-weekly/index.html`만 있습니다. 신규 제품 파일은 `r15-first-answer.css`입니다. 원본 프런트엔드 패치·기존 모션 파일 변경은 없습니다.
- 두 HTML의 인라인 스크립트를 시작 커밋과 비교해 동일함을 확인했습니다. 주간 시안의 가상 가격 상수와 모의 선택 처리도 변경되지 않았습니다.
- 신규 API, 인증, 결제, 권한 부여, 네트워크 요청 함수, 사용자 입력 폼, URL 매개변수, 저장소 기록은 없습니다. 랜딩의 외부 링크는 공식 도메인의 `/`, `/analyze`, `/explore`, `/place`, `/refund`뿐입니다.
- `r15-first-answer.css`는 표시·배치·접근성 보완이며 원본 R13의 스크롤 길이·나침반 SVG·타이밍 상수를 수정하지 않습니다. CSS 추가에 따른 실제 가림·포커스·모션 영향은 실행 QA 대상입니다.
- 공개 정보 확인을 위해 홈페이지·약관·환불 페이지만 읽었습니다. 분석 실행 엔드포인트는 방문하지 않았습니다.

## 원격 기준과 Netlify Preview 안전성

읽기 전용 `git ls-remote` 확인:

| 원격 ref | SHA |
| --- | --- |
| `main` | `593d486ee5915e4846ebf6fb7e667159a1a5e3b2` |
| `preview/r14-natural-korean-saas-polish-20261118` | `f2f0fc3fa07e6218deb5b9551af0470b1eed97af` |
| `draft/r15-first-answer-free-first-20261118` | `0a905828072884ac8cea488d37b0fe2d5c839a26` |

Netlify `getSite` 읽기 결과: 사이트 `localscopekorea` / `3f0bd68d-f15c-4f73-b2fd-a3222a2d6835`, provider `github`, 저장소 `HotCharliepepper/localpost`, `repo_branch=main`, `allowed_branches=[main]`, `skip_prs=null`, `stop_builds=false`. 빌드 명령·출력 경로·base는 별도 설정이 없습니다.

- 검토 시점 운영 Deploy: `6afc68edbd17e0a436a003ae`, `ready`, `context=production`, `branch=main`, commit `593d486ee5915e4846ebf6fb7e667159a1a5e3b2`, 게시 시각 `2026-11-17T14:47:34.342Z`.
- 기존 R14 Deploy: `6afc7128a4ce69d61baa89d4`, `ready`, `context=deploy-preview`, `review_id=6`, commit `f2f0fc3fa07e6218deb5b9551af0470b1eed97af`, `published_at=null`. [R14 Preview](https://deploy-preview-6--localscopekorea.netlify.app).
- 안전한 경로는 새 R15 브랜치를 push하고 `main` 대상 Draft PR을 만드는 것입니다. 이 PR은 미병합 R14를 포함한 누적 diff가 됩니다. R15만의 변경은 위 시작 커밋 대비 diff로 구분해야 합니다.
- R14 브랜치를 PR base로 삼으면 `allowed_branches` 범위 밖이므로 Preview 생성 여부를 보장할 수 없습니다.
- 이 검토는 설정 변경, 배포 생성, main push·병합, 운영 게시를 하지 않았습니다. 새 R15 Preview가 생성되면 최종 commit SHA·`context=deploy-preview`·운영 Deploy ID 보존을 다시 확인해야 합니다.

## 남은 검증

1. 실행 QA: 1440/768/390/360px, 짧은 모바일 높이, 나침반·CTA 가림, 실제 포커스 표시와 순서, 직접 앵커·뒤로 가기, 저모션 및 환경 설정 변경.
2. 최종 스크린샷과 R14/R15 비교, 최종 diff·추적 파일 목록 검토.
3. 새 Draft PR과 해당 HEAD의 Netlify Preview 성공 및 운영 Deploy 불변 확인.
4. 실제 로그인·분석·무료 횟수·결제·권한·원자료 검증은 의도적으로 미실시이며 Manduk 확인 범위입니다.
