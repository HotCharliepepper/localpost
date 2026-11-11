# LOCALSCOPE / 상권나침반 — S05 Spiral to Compass

**상태:** 독립 프런트엔드 시네마틱 프로토타입 제작·브라우저 검수 완료. 최초 `localscope-main.zip` 백엔드와 API는 변경하지 않았습니다. 실제 Next.js 메인 히어로 통합·서버 배포·실제 분석 API 테스트는 아직 수행하지 않았습니다.

## Windows / VS Code에서 가장 간단하게 실행하기

1. `LocalScope_S05_Spiral_Compass_VSCode.zip`을 다운로드합니다.
2. Windows 탐색기에서 ZIP을 **우클릭 → 압축 풀기** 합니다. ZIP 자체를 VS Code로 여는 것이 아닙니다.
3. VS Code를 열고 **File → Open Folder…**를 누릅니다.
4. 압축 해제한 폴더에서 `index.html`, `style.css`, `motion.js`가 바로 보이는 폴더를 선택합니다.
5. **`index.html` 우클릭 → Reveal in File Explorer → 더블클릭**해서 Chrome 또는 Edge에서 엽니다. VS Code Live Server 확장을 사용하는 경우 `Go Live`로 열어도 됩니다.
6. 마우스 휠로 **6장면을 스크롤**합니다. 스크롤 대신 다음 장면 자동 재생 기능은 일부러 넣지 않았습니다.

**Docker, PowerShell, WSL, Node 패키지 설치가 필요하지 않습니다.** 폴더만 열어놓으면 수정 결과를 브라우저 새로고침으로 확인할 수 있습니다.

### 폴더 구조

```text
[압축 해제한 폴더]
├── index.html                 # ㅅㄴ·스파이럴·나침반 SVG, 실제 문구
├── style.css                  # 타이포, 색, 공간, 모바일·가독성
├── motion.js                  # 스크롤 위치에 따라 6장면 진행
├── README_START_HERE.md
├── CODEX_NEXTJS_HANDOFF.md
├── QA/
│   ├── COPY_REVIEW.md
│   ├── SOURCE_AND_SCOPE.json
│   ├── BROWSER_QA.json
│   └── qa_s05.py             # 제작 환경용 브라우저 테스트
├── previews/                 # 실제 검수 캡처
└── frontend_patch/frontend/public/ux-s05/
    ├── index.html            # 기존 Next.js의 새 정적 미리보기 경로
    ├── style.css
    └── motion.js
```

## 장면별 설계 의도

| 장면 | 사용자 문장/메시지 | 시각 연출 | 핵심 목적 |
|---|---|---|---|
| 01 | ㅅ과 ㄴ. 여기서 시작합니다. | ㅅㄴ 대형 획 | 기존 브랜드 자산 보존 |
| 02 | 생각이 많아질수록, 시작은 멀어집니다. | 나선으로 수렴하는 SVG·입자 | 창업자의 복잡한 상황 |
| 03 | 어디서부터 사업을 시작해야 하지? | 나선 속으로 화면 확대 | 사용자의 질문 전달 |
| 04 | 작은 점 하나. | 나선 소멸, 하나의 점만 남음 | 정보량을 극적으로 낮춤 |
| 05 | 그 점에서, 방향이 열립니다. | 점에서 나침반이 커짐 | 해결 방향 등장 |
| 06 | Com(e)pass your concerns. / 상권나침반 | 나침반 고정·CTA | 브랜드 기억과 분석 시작 |

## 지금 손볼 수 있는 코드 위치

- **첫 심볼의 ㅅㄴ 획:** `index.html`의 `<g id="sn-glyph">` 안 `path` 두 개
- **나침반 바늘/다이얼:** `index.html`의 `<g class="compass">`
- **문장:** `index.html`의 `<article class="chapter" data-chapter="0..5">` 구간
- **6장면 구간:** `motion.js`의 `bounds` 배열 `[0, .16, .32, .49, .64, .80, 1.01]`
- **나선 확대의 세기:** `motion.js`의 `--spiral-scale`, `--spiral-rotation` 값
- **색감/레이아웃:** `style.css`의 `:root`, `.world`, `.chapter`, 모바일 `@media`

## 기존 LocalScope Next.js에서 **미리보기만** 붙이기

기존 원본을 변경하지 않는 별도 Git 브랜치 또는 복사본에서 진행합니다.

1. 이 패키지의 `frontend_patch/frontend/public/ux-s05` 폴더를 통째로 복사합니다.
2. 기존 LocalScope 프로젝트의 `frontend/public/` 내부에 붙여넣습니다.
3. 기존 로컬 서비스가 실행 중일 때 **`http://localhost:3011/ux-s05/index.html`**에 접속합니다. 실제 포트는 현재 프로젝트 설정에 따릅니다.
4. 이 과정은 **정적 별도 경로**만 생성합니다. 기존 홈페이지 메인 히어로는 자동 교체되지 않습니다.
5. 메인 히어로 교체는 화면 확인 후 **별도 작업**으로 진행합니다. `CODEX_NEXTJS_HANDOFF.md` 참조.

## 이번 산출물의 경계

- 백엔드 파일 포함 **0개**. 원본 FastAPI·PostGIS·DB·인증·결제·API 계약의 변경 없음.
- 스파이럴·좌표·나침반은 **가상 콘셉트 그래픽**이지, 실제 상권 판정의 시각화가 아닙니다.
- `localpost`는 사용자 제안 네이밍으로 작은 연구 라벨에만 표시. 공식 사이트명 `LOCALSCOPE / 상권나침반`은 유지합니다.
- “Com(e)pass your concerns.”는 사용자가 제안한 창의적 영문 말장난이며, 자연스러운 영어 표현으로 검증·확정된 것은 아닙니다.
- 상단 CTA로 기존 분석 화면에 항상 접근할 수 있게 유지했습니다. 모션 줄이기·prefers-reduced-motion 대응을 포함합니다.

## 검수 기준

- HTML/CSS/JavaScript: `motion.js`의 `node --check` 통과, 4개 뷰포트에서 6장면과 스크롤 상태 검수.
- 확인 폭: 1440x900, 820x920, 390x844, 360x780.
- 수동 방문·API/기능/배포 검수는 **미실시**. 프런트엔드 QA 기록: `QA/BROWSER_QA.json`.

## 다음 판단

`A. ㅅㄴ가 사라지는 속도`, `B. 질문이 유지되는 시간`, `C. 작은 점에서 나침반이 생기는 순간` 세 가지를 실제로 보고 결정합니다. 이 세 항목을 확정한 뒤 GSAP·Next.js 전환과 정밀 타이밍 검수를 진행하면 재작업이 적습니다.
