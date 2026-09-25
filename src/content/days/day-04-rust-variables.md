---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-04-rust-variables
courseId: crp-92
phaseId: phase-01
dayNumber: 4
date: "2026-10-04"
title: Rust의 let과 mut
summary: Rust는 값이 바뀔 수 있는 이름을 명시해서 의도하지 않은 수정을 일찍 잡습니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-03-c-program
learningObjectives:
  - "'Rust의 let과 mut' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: mut 없이 같은 바인딩을 다시 대입하려고 함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust variables
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
  - id: ex-day-04-rust-variables-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? minutes=20에서 시작해 계산하세요.
    starter: "fn main() {\n    let mut minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    answer: "30"
    hint: let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.
    explanation: minutes=20  →  minutes=30  →  30 출력. 따라서 출력은 '30'입니다.
    commonMistakes:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-04-rust-variables-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust의 let과 mut의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: mut"
    starter: "fn main() {\n    let _____ minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    answer: "fn main() {\n    let mut minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    hint: let mut로 변경 가능한 정수 바인딩을 만듭니다
    explanation: 빈칸에는 'mut'이 들어갑니다. let mut로 변경 가능한 정수 바인딩을 만듭니다 +=가 기존 20에 10을 더합니다 println!이 현재 30을 표시합니다
    commonMistakes:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-04-rust-variables-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 20에서 21로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "fn main() {\n    let mut minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    answer: "fn main() {\n    let mut minutes = 21;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    hint: 처음 등장하는 숫자를 20에서 21로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 20에서 21로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-04-rust-variables-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 mut 없이 같은 바인딩을 다시 대입하려고 함 상황을 확인하세요.
    starter: "fn main() {\n    let  minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    answer: "fn main() {\n    let mut minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    hint: let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. let mut로 변경 가능한 정수 바인딩을 만듭니다 +=가 기존 20에 10을 더합니다 println!이 현재 30을 표시합니다
    commonMistakes:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-04-rust-variables-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust의 let과 mut' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust의 let과 mut: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: "fn main() {\n    let mut minutes = 20;\n    minutes += 10;\n    println!(\"{minutes}\");\n}"
    hint: let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 let mut로 변경 가능한 정수 바인딩을 만듭니다 +=가 기존 20에 10을 더합니다 println!이 현재 30을 표시합니다
      다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-04-rust-variables-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "30"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: minutes=20  →  minutes=30  →  30 출력 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-04-rust-variables-model
    question: Rust의 let과 mut을 이해하는 데 맞는 설명은?
    choices:
      - mut 없이 같은 바인딩을 다시 대입하려고 함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.
    answerIndex: 2
    explanation: let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.
  - id: quiz-day-04-rust-variables-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - mut 없이 같은 바인딩을 다시 대입하려고 함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: mut 없이 같은 바인딩을 다시 대입하려고 함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-04-rust-variables-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 변경 가능한 바인딩에 값을 갱신함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 변경 가능한 바인딩에 값을 갱신함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

Rust는 값이 바뀔 수 있는 이름을 명시해서 의도하지 않은 수정을 일찍 잡습니다. Day 04 "`Rust의 let과 mut`"에서는 Rust 코드가 `30`을(를) 만드는 과정을 따라가며, 변경 가능한 바인딩에 값을 갱신함 동작이 왜 필요한지 확인합니다. 변경 가능한 바인딩에 값을 갱신함을(를) 빠뜨리면 `mut 없이 같은 바인딩을 다시 대입하려고 함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 03](/learn/day-03-c-program)에서는 "C 프로그램의 시작점과 printf"을(를) 배웠습니다. "C 프로그램의 시작점과 printf"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Rust의 let과 mut`"에서 새로 달라지는 조건을 찾아보세요. Day 04의 답은 `30`이며, 핵심 표현은 `mut`입니다.

## 머릿속 그림

let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다. Day 04에서는 아래 흐름 순서대로 상태가 바뀌며, `mut`이(가) 결과를 가릅니다.

```text
minutes=20  →  minutes=30  →  30 출력
```

위 흐름에서 `mut`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

**바인딩**은 `minutes`라는 이름과 값 `20`을 연결했다는 뜻입니다. `let minutes = 20`은 기본적으로 변경할 수 없는 바인딩입니다. 그 뒤에 `minutes += 10`을 적으면 컴파일 단계에서 오류가 납니다. `let mut minutes = 20`처럼 `mut`를 붙였을 때만 같은 이름에 새 값 30을 넣을 수 있습니다.

`let minutes = 20; let minutes = minutes + 10;`도 30이 되지만 이 경우에는 같은 바인딩을 고친 것이 아니라 새 바인딩이 이전 이름을 가리는 **섀도잉**입니다. 두 방법의 결과가 같더라도 뜻은 다릅니다. 코드에서 같은 이름의 값을 계속 바꿀 의도라면 `mut`를, 새 계산 결과를 다시 붙일 의도라면 새 `let`을 고려하세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 04 "`Rust의 let과 mut`"의 독립 예제입니다. 전체 5줄에서 `mut`이(가) 핵심이며, 실행 결과는 `30`입니다.

```rust
fn main() {
    let mut minutes = 20;
    minutes += 10;
    println!("{minutes}");
}
```

예상 출력:

```text
30
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 `30`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `mut`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let mut minutes = 20;
 3 |     minutes += 10;
 4 |     println!("{minutes}");
 5 | }
```

1. let mut로 변경 가능한 정수 바인딩을 만듭니다
2. +=가 기존 20에 10을 더합니다
3. println!이 현재 30을 표시합니다

위 단계에서 `mut`이(가) 빠지면 `30`이(가) 나오지 않습니다. `처음 등장하는 숫자를 20에서 21로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | minutes=20     |
|    2 | minutes=30     |
|    3 | 30 출력        |

위 순서대로 실행하면 최종 출력 `30`이(가) 됩니다. `minutes=20` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

두 코드를 비교하세요: `let mut n = 1; n += 1;`은 같은 바인딩의 값을 2로 고치지만 `let n = 1; let n = n + 1;`은 새 바인딩을 만듭니다. 두 코드에서 `println!("{n}")`은 모두 2입니다. 앞의 `let`을 다시 쓴 것인지 `mut`로 기존 값을 갱신한 것인지 설명할 수 있어야 결과가 같아도 다른 동작임을 압니다.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 20에서 21로` 바꾸면 아래와 같이 됩니다.

```rust
fn main() {
    let mut minutes = 21;
    minutes += 10;
    println!("{minutes}");
}
```

원본 출력은 `30`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `mut`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 04의 `Rust의 let과 mut`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: mut 없이 같은 바인딩을 다시 대입하려고 함.** 정상 코드에서는 `30`이(가) 출력됩니다.

- 정상 줄: `let mut minutes = 20;`
- 잘못된 줄: `let  minutes = 20;`

두 줄을 나란히 놓고 `let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `minutes=20`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **변경 가능한 바인딩에 값을 갱신함**은(는) 세 언어에서 같은 입력과 출력(`30`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | int minutes = 20; minutes += 10;     |
| Python | minutes = 20; minutes += 10          |
| Rust   | let mut minutes = 20; minutes += 10; |

C17에서는 `int minutes = 20; minutes += 10;` 규칙으로 "`Rust의 let과 mut`"의 `30`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `minutes = 20; minutes += 10` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `let mut minutes = 20; minutes += 10;` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`mut` 채우기) → 변경(`처음 등장하는 숫자를 20에서 21로`) → 오류 수정(`mut 없이 같은 바인딩을 다시 대입하려고 함` 찾기) → 독립 구현(`Rust의 let과 mut을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `mut` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust의 let과 mut`"이(가) 필요한 상황을 `변경 가능한 바인딩에 값을 갱신함` 동작으로 설명해 보세요.
- 예제에서 `mut`이(가) 실행되기 직전의 상태와 직후의 출력 `30`을(를) 말해 보세요.
- "`mut 없이 같은 바인딩을 다시 대입하려고 함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `변경 가능한 바인딩에 값을 갱신함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

let은 이름을 새 값에 묶고 mut는 같은 바인딩의 값을 바꿀 권한을 줍니다. Day 04 "`Rust의 let과 mut`"의 예제는 `mut`을(를) 실행해 `30`을(를) 출력합니다. "`mut 없이 같은 바인딩을 다시 대입하려고 함`" 여부를 확인하고 Day 04을(를) 완료하세요.
