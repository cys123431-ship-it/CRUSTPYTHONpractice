---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-90-rust-aggregate
courseId: crp-92
phaseId: phase-08
dayNumber: 90
date: "2026-12-29"
title: Rust iterator 집계와 정렬
summary: Rust에서도 동일한 fixture의 합계와 정렬 결과를 비교해 언어 간 기능 동등성을 지킵니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-89-rust-record-parse
learningObjectives:
  - "'Rust iterator 집계와 정렬' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust aggregate
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
  - id: ex-day-90-rust-aggregate-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 30에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    answer: "60"
    hint: iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.
    explanation: 30  →  50  →  60. 따라서 출력은 '60'입니다.
    commonMistakes:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-90-rust-aggregate-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust iterator 집계와 정렬의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: iter().sum()"
    starter:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes._____;\n    println!(\"\
      {total}\");\n}"
    answer:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    hint: 30,20,10을 배열에 둡니다
    explanation: 빈칸에는 'iter().sum()'이 들어갑니다. 30,20,10을 배열에 둡니다 iter가 세 값을 읽습니다 sum이 60을 계산합니다
    commonMistakes:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-90-rust-aggregate-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 20에서 21로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    answer:
      "fn main() {\n    let minutes = [30u32, 21, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    hint: 처음 등장하는 숫자를 20에서 21로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 20에서 21로 바꿨습니다. 원래 출력은 '60'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-90-rust-aggregate-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함 상황을 확인하세요.
    starter:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().count();\n    println!(\"\
      {total}\");\n}"
    answer:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    hint: iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 30,20,10을 배열에 둡니다 iter가 세 값을 읽습니다 sum이 60을 계산합니다
    commonMistakes:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-90-rust-aggregate-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust iterator 집계와 정렬' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust iterator 집계와 정렬: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let minutes = [30u32, 20, 10];\n    let total: u32 = minutes.iter().sum();\n    println!(\"\
      {total}\");\n}"
    hint: iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 30,20,10을 배열에 둡니다 iter가 세 값을 읽습니다 sum이 60을 계산합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-90-rust-aggregate-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "60"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: 30  →  50  →  60 순서로 실행되어 '60'을 출력합니다.
  - id: quiz-day-90-rust-aggregate-model
    question: Rust iterator 집계와 정렬을 이해하는 데 맞는 설명은?
    choices:
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함(이것이 정상적인 사용법이다)
      - iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.
  - id: quiz-day-90-rust-aggregate-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함
    answerIndex: 2
    explanation: 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-90-rust-aggregate-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - iterator로 합계 계산라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 iterator로 합계 계산라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

Rust에서도 동일한 fixture의 합계와 정렬 결과를 비교해 언어 간 기능 동등성을 지킵니다. Day 90 "`Rust iterator 집계와 정렬`"에서는 Rust 코드가 `60`을(를) 만드는 과정을 따라가며, iterator로 합계 계산 동작이 왜 필요한지 확인합니다. iterator로 합계 계산을(를) 빠뜨리면 `배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 89](/learn/day-89-rust-record-parse)에서는 "Rust 타입으로 레코드 검증"을(를) 배웠습니다. "Rust 타입으로 레코드 검증"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Rust iterator 집계와 정렬`"에서 새로 달라지는 조건을 찾아보세요. Day 90의 답은 `60`이며, 핵심 표현은 `iter().sum()`입니다.

## 머릿속 그림

iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다. Day 90에서는 아래 흐름 순서대로 상태가 바뀌며, `iter().sum()`이(가) 결과를 가릅니다.

```text
30  →  50  →  60
```

위 흐름에서 `iter().sum()`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

Rust의 `iter()`는 원소를 차례로 빌려 보고 `sum()`은 그 값들을 더합니다. `[10,20,30]`이면 중간 합계는 10,30,60입니다. 원래 모음을 이동하지 않고 읽기 때문에 뒤에 다시 사용할 수 있습니다.

언어별 Top N을 만들려면 합계 계산 뒤에도 합계 내림차순·이름 오름차순 같은 동점 규칙을 명시적으로 정렬해야 합니다. 큰 값의 덧셈이 정수 타입 범위를 넘는지도 입력 검증에 포함하세요. iterator는 반복문을 없앤 마법이 아니라 읽기·변환·누적 단계를 이어 표현하는 방식입니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 90 "`Rust iterator 집계와 정렬`"의 독립 예제입니다. 전체 5줄에서 `iter().sum()`이(가) 핵심이며, 실행 결과는 `60`입니다.

```rust
fn main() {
    let minutes = [30u32, 20, 10];
    let total: u32 = minutes.iter().sum();
    println!("{total}");
}
```

예상 출력:

```text
60
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 `60`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `iter().sum()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let minutes = [30u32, 20, 10];
 3 |     let total: u32 = minutes.iter().sum();
 4 |     println!("{total}");
 5 | }
```

1. 30,20,10을 배열에 둡니다
2. iter가 세 값을 읽습니다
3. sum이 60을 계산합니다

위 단계에서 `iter().sum()`이(가) 빠지면 `60`이(가) 나오지 않습니다. `처음 등장하는 숫자를 20에서 21로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 30             |
|    2 | 50             |
|    3 | 60             |

위 순서대로 실행하면 최종 출력 `60`이(가) 됩니다. `30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

20분과 30분 기록을 `iter().sum::<u32>()`으로 합하면 50분입니다. 사전의 항목이 C:50, Rust:50처럼 동점이면 원하는 순서를 이름 기준으로 정해 두어야 두 구현 결과가 같습니다. **합산**, **정렬**, **상위 N개 선택**은 별도 단계로 추적하세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 20에서 21로` 바꾸면 아래와 같이 됩니다.

```rust
fn main() {
    let minutes = [30u32, 21, 10];
    let total: u32 = minutes.iter().sum();
    println!("{total}");
}
```

원본 출력은 `60`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `iter().sum()`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 90의 `Rust iterator 집계와 정렬`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함.** 정상 코드에서는 `60`이(가) 출력됩니다.

- 정상 줄: `let total: u32 = minutes.iter().sum();`
- 잘못된 줄: `let total: u32 = minutes.iter().count();`

두 줄을 나란히 놓고 `iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `30`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **iterator로 합계 계산**은(는) 세 언어에서 같은 입력과 출력(`60`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙                 |
| ------ | ------------------------------------------ |
| C17    | for 합산과 정수 범위 검사                  |
| Python | sum(minutes)                               |
| Rust   | iter().sum(), 필요 시 try_fold+checked_add |

C17에서는 `for 합산과 정수 범위 검사` 규칙으로 "`Rust iterator 집계와 정렬`"의 `60`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `sum(minutes)` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `iter().sum(), 필요 시 try_fold+checked_add` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`iter().sum()` 채우기) → 변경(`처음 등장하는 숫자를 20에서 21로`) → 오류 수정(`배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함` 찾기) → 독립 구현(`Rust iterator 집계와 정렬을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `iter().sum()` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust iterator 집계와 정렬`"이(가) 필요한 상황을 `iterator로 합계 계산` 동작으로 설명해 보세요.
- 예제에서 `iter().sum()`이(가) 실행되기 직전의 상태와 직후의 출력 `60`을(를) 말해 보세요.
- "`배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `iterator로 합계 계산` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

iter는 값들을 차례로 빌려주고 sum은 누적합을 돌려줍니다. 큰 입력에선 overflow 정책도 따로 정합니다. Day 90 "`Rust iterator 집계와 정렬`"의 예제는 `iter().sum()`을(를) 실행해 `60`을(를) 출력합니다. "`배열 길이를 합계와 혼동하거나 release overflow 정책을 가정함`" 여부를 확인하고 Day 90을(를) 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 Rust iterator 집계와 정렬의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
