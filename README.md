# C · Python · Rust 통합 학습

2026년 10월 1일부터 12월 31일까지 사용하는 local-first 프로그래밍 학습 웹앱입니다. 하나의 개념을 Anchor 언어로 깊게 배운 뒤 C, Python, Rust로 전이합니다.

## 현재 구현 범위

- Astro 정적 사이트와 Content Collections 기반 커리큘럼
- 2026-10-01~2026-12-31의 Day 92개: 개념 설명, 실행 추적, 5단계 연습, 회상 퀴즈, 언어 전이
- IndexedDB 진도·초안·복습 저장과 JSON 백업/복원
- Python Pyodide Worker 지연 실행, C/Rust prepared demo 구분
- 반응형 내비게이션, Light/Dark/System 테마, PWA
- 콘텐츠 DAG 검증, 단위·E2E·접근성·성능 예산 테스트
- `scripts/curriculum_blueprints.py`의 예제와 설명을 기준으로 89개 수업을 생성하며, 원래 대표 수업 3개는 별도 유지

## 명령

```bash
npm install
npm run dev
npm run validate
npm run build
npm run course:verify
npm run test:e2e
```

## 원칙

교재는 범위 참고용이며 설명·예제·문제는 독창적으로 작성합니다. 사용자 코드는 브라우저에서만 다루며 계정, 서버, 분석 도구를 사용하지 않습니다.

## 최종 프로젝트

`examples/study-log-analyzer`에는 동일 CSV 명세를 처리하는 C17, Python, Rust 2024 CLI와 공통 fixture가 있습니다. `pnpm course:verify`는 각 Day의 원본·변경 예제를 실행하고 세 구현의 출력·오류 사례를 비교합니다. 로컬에 Rust 컴파일러가 없으면 해당 부분은 건너뛰며 CI에서는 반드시 전체를 검증합니다. C/Rust 코드는 웹앱에서 임의 컴파일되지 않으므로 프로젝트 실행은 README의 로컬 명령을 사용하세요.
