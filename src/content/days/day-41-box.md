---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-41-box
courseId: crp-92
phaseId: phase-04
dayNumber: 41
date: "2026-11-10"
title: Rust Box와 힙 소유
summary: 크기가 큰 값이나 재귀적 구조를 힙에 저장할 때 누가 소유하는지 알아야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-40-malloc-free
learningObjectives:
  - "'Rust Box와 힙 소유' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - box
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
  - id: ex-day-41-box-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? Box(40)에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = *boxed + 2;\n    println!(\"{answer}\"\
      );\n}"
    answer: "42"
    hint: Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.
    explanation: Box(40)  →  역참조 40  →  42  →  Drop. 따라서 출력은 '42'입니다.
    commonMistakes:
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-41-box-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust Box와 힙 소유의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: *boxed"
    starter:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = _____ + 2;\n    println!(\"{answer}\");\n\
      }"
    answer:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = *boxed + 2;\n    println!(\"{answer}\");\n\
      }"
    hint: Box가 40을 힙에 저장합니다
    explanation: 빈칸에는 '*boxed'이 들어갑니다. Box가 40을 힙에 저장합니다 역참조로 40을 얻어 2를 더합니다 42를 출력하고 scope 끝에서 해제합니다
    commonMistakes:
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-41-box-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 40에서 41로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = *boxed + 2;\n    println!(\"{answer}\"\
      );\n}"
    answer:
      "fn main() {\n    let boxed = Box::new(41);\n    let answer = *boxed + 2;\n    println!(\"{answer}\");\n\
      }"
    hint: 처음 등장하는 숫자를 40에서 41로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 40에서 41로 바꿨습니다. 원래 출력은 '42'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-41-box-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함 상황을 확인하세요.
    starter:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = boxed + 2;\n    println!(\"{answer}\");\n\
      }"
    answer:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = *boxed + 2;\n    println!(\"{answer}\");\n\
      }"
    hint: Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. Box가 40을 힙에 저장합니다 역참조로 40을 얻어 2를 더합니다 42를 출력하고 scope 끝에서 해제합니다
    commonMistakes:
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-41-box-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust Box와 힙 소유' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust Box와 힙 소유: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let boxed = Box::new(40);\n    let answer = *boxed + 2;\n    println!(\"{answer}\");\n\
      }"
    hint: Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 Box가 40을 힙에 저장합니다 역참조로 40을 얻어 2를 더합니다 42를 출력하고 scope 끝에서 해제합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-41-box-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "42"
    answerIndex: 2
    explanation: Box(40)  →  역참조 40  →  42  →  Drop 순서로 실행되어 '42'을 출력합니다.
  - id: quiz-day-41-box-model
    question: Rust Box와 힙 소유을 이해하는 데 맞는 설명은?
    choices:
      - Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.
  - id: quiz-day-41-box-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-41-box-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 힙 값의 안전한 소유라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 힙 값의 안전한 소유라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

크기가 큰 값이나 재귀적 구조를 힙에 저장할 때 누가 소유하는지 알아야 합니다. Day 41 "`Rust Box와 힙 소유`"에서는 Rust 코드가 `42`을(를) 만드는 과정을 따라가며, 힙 값의 안전한 소유 동작이 왜 필요한지 확인합니다. 힙 값의 안전한 소유을(를) 빠뜨리면 `Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 40](/learn/day-40-malloc-free)에서는 "C 동적 할당과 해제"을(를) 배웠습니다. "C 동적 할당과 해제"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Rust Box와 힙 소유`"에서 새로 달라지는 조건을 찾아보세요. Day 41의 답은 `42`이며, 핵심 표현은 `*boxed`입니다.

## 머릿속 그림

Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다. Day 41에서는 아래 흐름 순서대로 상태가 바뀌며, `*boxed`이(가) 결과를 가릅니다.

```text
Box(40)  →  역참조 40  →  42  →  Drop
```

위 흐름에서 `*boxed`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `42`입니다.

## 천천히 풀어보기

`Box::new(30)`은 정수 30을 힙에 만들고 그 값을 소유하는 `Box<i32>`를 돌려줍니다. `*boxed`는 상자 안 값을 읽는 역참조입니다. 변수가 범위를 벗어나면 Box가 관리하는 힙 메모리가 해제됩니다.

앞 Day의 C `malloc`·`free`와 비교하면 '힙에 놓는다'는 점은 비슷하지만 해제 책임을 표현하는 방법이 다릅니다. Box를 다른 변수로 이동시키면 기존 이름은 더 이상 소유자가 아닙니다. `Box<T>`를 아무 데나 붙이는 것이 성능 향상 공식은 아니며, 값 크기나 재귀 타입 표현 같은 필요가 있을 때 씁니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 41 "`Rust Box와 힙 소유`"의 독립 예제입니다. 전체 5줄에서 `*boxed`이(가) 핵심이며, 실행 결과는 `42`입니다.

```rust
fn main() {
    let boxed = Box::new(40);
    let answer = *boxed + 2;
    println!("{answer}");
}
```

예상 출력:

```text
42
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 `42`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `*boxed`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let boxed = Box::new(40);
 3 |     let answer = *boxed + 2;
 4 |     println!("{answer}");
 5 | }
```

1. Box가 40을 힙에 저장합니다
2. 역참조로 40을 얻어 2를 더합니다
3. 42를 출력하고 scope 끝에서 해제합니다

위 단계에서 `*boxed`이(가) 빠지면 `42`이(가) 나오지 않습니다. `처음 등장하는 숫자를 40에서 41로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | Box(40)        |
|    2 | 역참조 40      |
|    3 | 42             |
|    4 | Drop           |

위 순서대로 실행하면 최종 출력 `42`이(가) 됩니다. `Box(40)` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`let boxed = Box::new(7); println!("{}", *boxed);`는 7을 출력합니다. Box가 변수의 범위를 벗어나면 관리하던 메모리를 함께 정리합니다. `let other = boxed;`로 이동시킨 뒤에는 `boxed`가 아닌 `other`가 소유하므로 옛 이름으로 다시 출력하면 컴파일 단계에서 막힙니다.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 40에서 41로` 바꾸면 아래와 같이 됩니다.

```rust
fn main() {
    let boxed = Box::new(41);
    let answer = *boxed + 2;
    println!("{answer}");
}
```

원본 출력은 `42`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `*boxed`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 41의 `Rust Box와 힙 소유`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함.** 정상 코드에서는 `42`이(가) 출력됩니다.

- 정상 줄: `let answer = *boxed + 2;`
- 잘못된 줄: `let answer = boxed + 2;`

두 줄을 나란히 놓고 `Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `Box(40)`부터 `42`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **힙 값의 안전한 소유**은(는) 세 언어에서 같은 입력과 출력(`42`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | malloc/free를 직접 짝지음  |
| Python | 참조된 객체는 런타임 관리  |
| Rust   | Box::new와 자동 Drop       |

C17에서는 `malloc/free를 직접 짝지음` 규칙으로 "`Rust Box와 힙 소유`"의 `42`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `참조된 객체는 런타임 관리` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `Box::new와 자동 Drop` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`42` 맞히기) → 빈칸(`*boxed` 채우기) → 변경(`처음 등장하는 숫자를 40에서 41로`) → 오류 수정(`Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함` 찾기) → 독립 구현(`Rust Box와 힙 소유을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `42` 및 `*boxed` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust Box와 힙 소유`"이(가) 필요한 상황을 `힙 값의 안전한 소유` 동작으로 설명해 보세요.
- 예제에서 `*boxed`이(가) 실행되기 직전의 상태와 직후의 출력 `42`을(를) 말해 보세요.
- "`Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `힙 값의 안전한 소유` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Box<T>는 힙 값의 유일한 소유자이고 *는 안쪽 값을 읽습니다. scope가 끝나면 자동으로 해제합니다. Day 41 "`Rust Box와 힙 소유`"의 예제는 `*boxed`을(를) 실행해 `42`을(를) 출력합니다. "`Box를 C의 raw pointer처럼 직접 free해야 한다고 생각함`" 여부를 확인하고 Day 41을(를) 완료하세요.
