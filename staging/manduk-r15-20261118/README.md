# 상권나침반 R15 — 만덕 검증계 이관용 정적 스냅샷

> 검토용 · 운영 반영 금지 · 별도 정적 화면. 이 경로는 `HotCharliepepper/localpost`의 테스트용 브랜치에만 존재합니다. `manduk123/localscope`로의 전송이나 운영 반영을 뜻하지 않습니다.

## 원본과 범위
- 원본: `HotCharliepepper/localpost`
- 동결한 원본 커밋: `f072b4e8d4602405c433e650cddfdc72e0a3bcae` (R15 FIRST ANSWER)
- 별도 브랜치: `review/manduk-r15-isolated-staging-20261118`
- 검토 URL 경로: `/staging/manduk-r15-20261118/site/` (호스팅 Preview가 실제 생성되면 도메인과 조합)
- 기존 루트 `index.html`, 프런트·API·DB·서버·인증·결제·판정 로직, 운영 브랜치, 운영 도메인은 변경하지 않습니다.
- **정적 마케팅 화면**이며 실제 분석 기능을 내장하거나 서버와 연동하지 않습니다.

## 포함 파일 — 모두 원본 커밋에서 무수정 복사
```text
site/
  index.html
  r13-live.css
  r13-live.js
  r14-saas-type.css
  r15-first-answer.css
  r13-weekly/
    index.html
```

루트 HTML의 상대 CSS/JS 링크와 주간 시안 CSS 링크를 보존했습니다. 검증계의 서버가 이 폴더를 그대로 정적 서빙하면 화면을 볼 수 있습니다. 검증계 라우팅·호스팅 설정이 다르면 만덕 측에서 별도 설정 검토가 필요하며, 이 PR은 그 설정을 변경하지 않습니다.

## 리뷰 시 주의
1. R15의 무료 분석 시작 및 세 진입 경로는 **공식 운영 도메인** `https://localscope.co.kr`의 `/analyze`, `/explore`, `/place`로 새 탭 이동합니다. 이 검증계에 가짜 서버 응답·결제·권한을 만들지 않았습니다. 실제 운영 분석 호출이나 무료 횟수 차감 테스트는 만덕의 별도 승인 전에는 실행하지 마세요.
2. 공개 사례는 공식 홈페이지에서 인용한 예시이며 사용자 자신의 실제 판정이 아닙니다. 공개 원천 통계·기간·공간 범위의 추가 검증 사항은 원본의 [만덕 검토 문서](https://github.com/HotCharliepepper/localpost/blob/f072b4e8d4602405c433e650cddfdc72e0a3bcae/QA/R15_MANDUK_REVIEW.md)에 정리되어 있습니다.
3. `r13-weekly`는 실험 시안입니다. **가격 실험 · 결제 불가**로 표기되어 있으며 결제를 연결하지 않습니다.
4. 주간 시안의 브랜드 복귀 링크는 `../index.html#decision`이며, 이 하위 폴더에서도 동일 스냅샷의 메인 HTML로 돌아가도록 상대 경로가 해석됩니다. 원본 링크를 수정하지 않았습니다.

## 만덕 저장소에 이관할 때
현재 연결된 계정으로 `manduk123/localscope`는 GitHub API 404(미존재·비공개 또는 미인가 가능)를 반환했습니다. 실제 저장소 URL과 협업 권한을 먼저 확인해야 합니다.

그 뒤 만덕 저장소의 **최신 승인 main SHA**를 확인하고:
1. 새 브랜치 `review/r15-first-answer-20261118`를 해당 SHA에서 생성합니다.
2. 이 정적 `site/` 파일과 검토 메모만 `review/r15-first-answer/site/` 같은 **신규 하위 디렉터리**에 복사합니다. 원본 `index.html`과 보존 대상은 건드리지 않습니다.
3. 변경 파일 diff와 정적 파일의 동작을 검토합니다.
4. **Draft PR**을 만들고 만덕의 별도 검증계에서 서빙합니다. 운영 main 병합·배포는 명시 승인 전까지 하지 않습니다.

## 원본 QA 및 디자인 검토
- [R15 로컬·모바일 QA](https://github.com/HotCharliepepper/localpost/blob/f072b4e8d4602405c433e650cddfdc72e0a3bcae/QA/R15_FIRST_ANSWER_QA.md)
- [원본 Deploy Preview QA](https://github.com/HotCharliepepper/localpost/blob/f072b4e8d4602405c433e650cddfdc72e0a3bcae/QA/R15_PREVIEW_VERIFICATION.md)
- [보존 영역 및 정적 범위](https://github.com/HotCharliepepper/localpost/blob/f072b4e8d4602405c433e650cddfdc72e0a3bcae/QA/R15_SCOPE_REVIEW.md)
- [만덕 연동 검토 질문](https://github.com/HotCharliepepper/localpost/blob/f072b4e8d4602405c433e650cddfdc72e0a3bcae/QA/R15_MANDUK_REVIEW.md)

**검증 상태 구분:** 위 QA 기록은 원본 R15의 과거 Preview 테스트입니다. 이 신규 하위 경로에 대해 배포가 성공했는지, 해당 경로의 링크가 정상인지, 만덕의 별도 검증 환경에서 동작하는지는 실제 환경 확인 전까지 미검증으로 취급합니다.
