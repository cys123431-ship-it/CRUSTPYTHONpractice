---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-15-match
courseId: crp-92
phaseId: phase-02
dayNumber: 15
date: "2026-10-15"
title: Rust match로 경우 나누기
summary: 조건 분기가 여러 개일 때 빠진 경우가 없도록 모든 패턴을 명시합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-14-branch-review
learningObjectives:
  - "'Rust match로 경우 나누기' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 모든 패턴을 덮지 않아 컴파일이 실패함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - match
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
  - id: ex-day-15-match-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? level=2에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    answer: 기본
    hint: match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.
    explanation: level=2  →  2 arm 선택  →  기본. 따라서 출력은 '기본'입니다.
    commonMistakes:
      - 모든 패턴을 덮지 않아 컴파일이 실패함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-15-match-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust match로 경우 나누기의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: 2 =>"
    starter:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", _____ \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    answer:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    hint: level은 2입니다
    explanation: 빈칸에는 '2 =>'이 들어갑니다. level은 2입니다 1 패턴을 건너뛰고 2 패턴을 선택합니다 label에 기본을 저장해 출력합니다
    commonMistakes:
      - 모든 패턴을 덮지 않아 컴파일이 실패함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-15-match-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    answer:
      "fn main() {\n    let level = 3;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 2에서 3로 바꿨습니다. 원래 출력은 '기본'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 모든 패턴을 덮지 않아 컴파일이 실패함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-15-match-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 모든 패턴을 덮지 않아 컴파일이 실패함 상황을 확인하세요.
    starter:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 3 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    answer:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    hint: match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. level은 2입니다 1 패턴을 건너뛰고 2 패턴을 선택합니다 label에 기본을 저장해 출력합니다
    commonMistakes:
      - 모든 패턴을 덮지 않아 컴파일이 실패함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-15-match-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust match로 경우 나누기' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust match로 경우 나누기: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let level = 2;\n    let label = match level { 1 => \"입문\", 2 => \"기본\", _ => \"심화\"\
      \ };\n    println!(\"{label}\");\n}"
    hint: match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 level은 2입니다 1 패턴을 건너뛰고 2 패턴을 선택합니다 label에 기본을 저장해 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 모든 패턴을 덮지 않아 컴파일이 실패함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-15-match-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 기본
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: level=2  →  2 arm 선택  →  기본 순서로 실행되어 '기본'을 출력합니다.
  - id: quiz-day-15-match-model
    question: Rust match로 경우 나누기을 이해하는 데 맞는 설명은?
    choices:
      - 모든 패턴을 덮지 않아 컴파일이 실패함(이것이 정상적인 사용법이다)
      - match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.
  - id: quiz-day-15-match-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 모든 패턴을 덮지 않아 컴파일이 실패함
    answerIndex: 2
    explanation: 모든 패턴을 덮지 않아 컴파일이 실패함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-15-match-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 완전한 패턴 분기라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 완전한 패턴 분기라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

조건 분기가 여러 개일 때 빠진 경우가 없도록 모든 패턴을 명시합니다. Day 15 "`Rust match로 경우 나누기`"에서는 Rust 코드의 실행 결과(`기본`)를 따라가며, `완전한 패턴 분기` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`모든 패턴을 덮지 않아 컴파일이 실패함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 14](/learn/day-14-branch-review)에서 배운 "분기와 경계조건 회상" 내용을 한 문장으로 말해 보세요. 이번 "`Rust match로 경우 나누기`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `2 =>`입니다.

## 머릿속 그림

match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다. Day 15에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `2 =>`입니다.

```text
level=2  →  2 arm 선택  →  기본
```

위 흐름에서 `2 =>` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `기본`입니다.

## 천천히 풀어보기

`match`는 한 값을 여러 경우와 맞춰 보고 해당 갈래를 실행합니다. 예제의 `2 =>`는 값이 2일 때 들어가는 갈래입니다. `_ =>`는 앞선 경우에 맞지 않은 나머지 값입니다. `match`가 값을 돌려주도록 작성했다면 각 갈래의 결과가 호환되는 타입이어야 합니다.

`match 3`이면 `2` 갈래는 건너뛰고 나머지 갈래로 갑니다. 정확히 한 가지 경우만 처리합니다. Rust는 가능한 경우를 다루도록 요구하므로 `_`가 없고 일부 숫자만 다뤘다면 빠진 경우에 대해 컴파일 오류가 납니다. 갈래마다 어떤 입력이 들어오는지 적어 보세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 15 "`Rust match로 경우 나누기`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `2 =>`이며, 실행 결과는 `기본`입니다.

```rust
fn main() {
    let level = 2;
    let label = match level { 1 => "입문", 2 => "기본", _ => "심화" };
    println!("{label}");
}
```

예상 출력:

```text
기본
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `기본`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `2 =>`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let level = 2;
 3 |     let label = match level { 1 => "입문", 2 => "기본", _ => "심화" };
 4 |     println!("{label}");
 5 | }
```

1. level은 2입니다
2. 1 패턴을 건너뛰고 2 패턴을 선택합니다
3. label에 기본을 저장해 출력합니다

`2 =>` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | level=2        |
|    2 | 2 arm 선택     |
|    3 | 기본           |

위 순서대로 실행한 최종 출력은 `기본`입니다. `level=2` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`match 3 { 2 => "둘", 3 => "셋", _ => "기타" }`의 결과는 `"셋"`입니다. `3 =>`를 지우면 3은 `_` 갈래에서 `"기타"`가 됩니다. 갈래를 확인할 때는 입력 값과 패턴을 하나씩 비교하고, `_`가 앞 갈래보다 먼저 놓였다면 뒤의 경우가 도달할 수 없다는 점도 기억하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `기본`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn main() {
    let level = 3;
    let label = match level { 1 => "입문", 2 => "기본", _ => "심화" };
    println!("{label}");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
심화
```

원본(`기본`)과 달라졌습니다. 다른 줄(`let level = 2;` → `let level = 3;`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`level=2` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 모든 패턴을 덮지 않아 컴파일이 실패함.** 정상 코드의 실행 결과는 `기본`입니다.

- 정상 줄: `let label = match level { 1 => "입문", 2 => "기본", _ => "심화" };`
- 잘못된 줄: `let label = match level { 1 => "입문", 3 => "기본", _ => "심화" };`

두 줄을 나란히 놓고 `match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `level=2`부터 `기본`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `완전한 패턴 분기`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | switch와 default, 또는 if/else |
| Python | match/case와 case _            |
| Rust   | match와 모든 arm을 덮는 _      |

C17에서는 `switch와 default, 또는 if/else` 규칙을 적용합니다. "`Rust match로 경우 나누기`" 수업의 실행 결과(`기본`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `match/case와 case _` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `match와 모든 arm을 덮는 _` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`기본` 맞히기) → 빈칸(`2 =>` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`모든 패턴을 덮지 않아 컴파일이 실패함` 찾기) → 독립 구현(`Rust match로 경우 나누기을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `기본` 및 `2 =>` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust match로 경우 나누기`" 수업이 필요한 이유는 `완전한 패턴 분기` 동작으로 설명해 보세요.
- 예제에서 `2 =>` 부분 실행 직전의 상태와 직후의 출력(`기본`)을 말해 보세요.
- "`모든 패턴을 덮지 않아 컴파일이 실패함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `완전한 패턴 분기` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

match는 위에서 아래로 비교해 처음 맞는 arm을 선택하며 _는 나머지 모든 값을 받습니다. Day 15 "`Rust match로 경우 나누기`" 예제의 핵심 부분은 `2 =>`이며, 실행 결과는 `기본`입니다. "`모든 패턴을 덮지 않아 컴파일이 실패함`" 여부를 확인하고 Day 15 수업을 완료하세요.
