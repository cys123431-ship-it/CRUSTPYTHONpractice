---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-08-boolean
courseId: crp-92
phaseId: phase-01
dayNumber: 8
date: "2026-10-08"
title: 불리언과 논리 연산
summary: 여러 조건을 합쳐 행동을 결정할 때 참·거짓을 명확하게 계산해야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-07-foundation-review
learningObjectives:
  - "'불리언과 논리 연산' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: &&와 ||를 혼동해 하나만 참이어도 통과시킴."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - boolean
  - execution trace
  - language transfer
runnerMode: none
reviewOffsets:
  - 1
  - 3
  - 7
  - 14
  - 30
sample: false
exercises:
  - id: ex-day-08-boolean-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? ready=true에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready && !focused);\n\
      }"
    answer: "true"
    hint: "&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다."
    explanation: ready=true  →  !focused=true  →  true 출력. 따라서 출력은 'true'입니다.
    commonMistakes:
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-08-boolean-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'불리언과 논리 연산' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: && !focused"
    starter: "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready _____);\n}"
    answer:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready && !focused);\n\
      }"
    hint: ready는 true입니다
    explanation: 빈칸에 들어갈 표현은 '&& !focused'입니다. ready는 true입니다 !focused는 !false이므로 true입니다 true && true가 true입니다
    commonMistakes:
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-08-boolean-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 첫 문자열을 '{}'에서 '{}!'로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready && !focused);\n\
      }"
    answer:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}!\", ready && !focused);\n\
      }"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 첫 문자열을 '{}'에서 '{}!'로."
    explanation:
      바꾼 뒤 출력은 'true!'입니다. 원본 출력 'true'에서 달라졌습니다. 다른 줄(println!("{}", ready && !focused); → println!("{}!",
      ready && !focused);)에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-08-boolean-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 &&와 ||를 혼동해 하나만 참이어도 통과시킴 상황을 확인하세요.
    starter:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready || focused);\n\
      }"
    answer:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready && !focused);\n\
      }"
    hint: "&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다."
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. ready는 true입니다 !focused는 !false이므로 true입니다 true && true가 true입니다
    commonMistakes:
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-08-boolean-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '불리언과 논리 연산' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 불리언과 논리 연산: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let ready = true;\n    let focused = false;\n    println!(\"{}\", ready && !focused);\n\
      }"
    hint: "&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다."
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 ready는 true입니다 !focused는 !false이므로 true입니다 true && true가 true입니다 다른 코드도
      결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-08-boolean-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "true"
    answerIndex: 2
    explanation: ready=true  →  !focused=true  →  true 출력 순서로 실행되어 출력은 'true'입니다.
  - id: quiz-day-08-boolean-model
    question: "'불리언과 논리 연산' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - "&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다."
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴(이것이 정상적인 사용법이다)"
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: "&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다."
  - id: quiz-day-08-boolean-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - "&&와 ||를 혼동해 하나만 참이어도 통과시킴"
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: "&&와 ||를 혼동해 하나만 참이어도 통과시킴. 입력과 중간 상태를 차례로 확인하세요."
  - id: quiz-day-08-boolean-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 두 조건의 논리곱을 구함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 두 조건의 논리곱을 구함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

여러 조건을 합쳐 행동을 결정할 때 참·거짓을 명확하게 계산해야 합니다. Day 08 "`불리언과 논리 연산`"에서는 Rust 코드의 실행 결과(`true`)를 따라가며, `두 조건의 논리곱을 구함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`&&와 ||를 혼동해 하나만 참이어도 통과시킴`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 07](/learn/day-07-foundation-review)에서 배운 "기초 1주차 회상과 오류 찾기" 내용을 한 문장으로 말해 보세요. 이번 "`불리언과 논리 연산`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `&& !focused`입니다.

## 머릿속 그림

&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다. Day 08에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `&& !focused`입니다.

```text
ready=true  →  !focused=true  →  true 출력
```

위 흐름에서 `&& !focused` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `true`입니다.

## 천천히 풀어보기

`&&`는 두 물음에 모두 '예'라고 답해야 참입니다. 예를 들어 학습 시간이 충분한지 `minutes >= 30`을 확인하고, 방해 없이 집중했는지 `focused`를 확인한다면 둘 중 하나라도 거짓일 때 전체는 거짓입니다. `!focused`는 집중 여부를 뒤집습니다. 참은 거짓으로, 거짓은 참으로 바뀝니다.

`true && false`는 `false`, `true || false`는 `true`입니다. `&&`의 왼쪽이 이미 거짓이면 오른쪽을 평가할 필요가 없어서 건너뛸 수 있습니다. 조건을 읽을 때는 두 변수의 현재 값부터 적고, 각각의 참·거짓을 구한 뒤 전체 식을 판단하세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 08 "`불리언과 논리 연산`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `&& !focused`이며, 실행 결과는 `true`입니다.

```rust
fn main() {
    let ready = true;
    let focused = false;
    println!("{}", ready && !focused);
}
```

예상 출력:

```text
true
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `true`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `&& !focused`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let ready = true;
 3 |     let focused = false;
 4 |     println!("{}", ready && !focused);
 5 | }
```

1. ready는 true입니다
2. !focused는 !false이므로 true입니다
3. true && true가 true입니다

`&& !focused` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | ready=true     |
|    2 | !focused=true  |
|    3 | true 출력      |

위 순서대로 실행한 최종 출력은 `true`입니다. `ready=true` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`focused = False; minutes = 40`인 경우 `minutes >= 30 && focused`는 앞이 참이어도 뒤가 거짓이므로 전체가 거짓입니다. `minutes >= 30 || focused`로 바꾸면 둘 중 앞이 참이므로 참입니다. `&&`와 `||`는 상황에 따라 요구 조건 자체가 달라지므로, 참/거짓을 두 칸씩 적은 표로 결정하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `true`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn main() {
    let ready = true;
    let focused = false;
    println!("{}!", ready && !focused);
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
true!
```

원본과 달라졌습니다. 원본 출력은 `true`입니다. 다른 줄(`println!("{}", ready && !focused);` → `println!("{}!", ready && !focused);`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`ready=true` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: &&와 ||를 혼동해 하나만 참이어도 통과시킴.** 정상 코드의 실행 결과는 `true`입니다.

- 정상 줄: `println!("{}", ready && !focused);`
- 잘못된 줄: `println!("{}", ready || focused);`

두 줄을 나란히 놓고 `&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `ready=true`부터 `true`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `두 조건의 논리곱을 구함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | stdbool.h의 bool과 &&, !   |
| Python | True and not focused       |
| Rust   | true && !focused           |

C17에서는 `stdbool.h의 bool과 &&, !` 규칙을 적용합니다. "`불리언과 논리 연산`" 수업의 실행 결과(`true`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `True and not focused` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `true && !focused` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`true` 맞히기) → 빈칸(`&& !focused` 채우기) → 변경(`첫 문자열을 '{}'에서 '{}!'로`) → 오류 수정(`&&와 ||를 혼동해 하나만 참이어도 통과시킴` 찾기) → 독립 구현(`'불리언과 논리 연산' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `true` 및 `&& !focused` 설명과 대조하세요.

## 스스로 설명하기

- "`불리언과 논리 연산`" 수업이 필요한 이유는 `두 조건의 논리곱을 구함` 동작으로 설명해 보세요.
- 예제에서 `&& !focused` 부분 실행 직전의 상태와 직후의 출력(`true`)을 말해 보세요.
- "`&&와 ||를 혼동해 하나만 참이어도 통과시킴`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `두 조건의 논리곱을 구함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

&&는 두 조건이 모두 참이어야 하고 !는 조건의 참·거짓을 뒤집습니다. Day 08 "`불리언과 논리 연산`" 예제의 핵심 부분은 `&& !focused`이며, 실행 결과는 `true`입니다. "`&&와 ||를 혼동해 하나만 참이어도 통과시킴`" 여부를 확인하고 Day 08 수업을 완료하세요.
