---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-18-loop-break
courseId: crp-92
phaseId: phase-02
dayNumber: 18
date: "2026-10-18"
title: Rust loop와 break 값
summary: 반복을 마칠 때 계산 결과를 바로 바깥 표현식에 전달할 수 있습니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-17-while-loop
learningObjectives:
  - "'Rust loop와 break 값' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - loop break
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
  - id: ex-day-18-loop-break-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? n=0에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n   \
      \ println!(\"{answer}\");\n}"
    answer: "6"
    hint: Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.
    explanation: n=0  →  1  →  2  →  3  →  answer=6. 따라서 출력은 '6'입니다.
    commonMistakes:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-18-loop-break-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Rust loop와 break 값' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: break n * 2"
    starter:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { _____; } };\n    println!(\"\
      {answer}\");\n}"
    answer:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n    println!(\"\
      {answer}\");\n}"
    hint: n은 0에서 출발합니다
    explanation: 빈칸에 들어갈 표현은 'break n * 2'입니다. n은 0에서 출발합니다 1·2는 계속 반복합니다 3에서 break 6으로 종료하여 answer=6입니다
    commonMistakes:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-18-loop-break-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 0에서 1로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n   \
      \ println!(\"{answer}\");\n}"
    answer:
      "fn main() {\n    let mut n = 1;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n    println!(\"\
      {answer}\");\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 0에서 1로."
    explanation:
      바꾼 뒤 출력은 '6'입니다. 원본 출력과 같습니다('6'). 멈추는 조건은 n이 3이 되는 순간이라 시작값과 무관하게 break 값 3 곱하기 2로 6이 됩니다. 출력이 같아도
      바뀐 줄(let mut n = 1;) 이후의 중간 상태가 같은지는 원본 추적과 대조해야 합니다.
    commonMistakes:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-18-loop-break-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함 상황을 확인하세요.
    starter:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n; } };\n    println!(\"\
      {answer}\");\n}"
    answer:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n    println!(\"\
      {answer}\");\n}"
    hint: Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. n은 0에서 출발합니다 1·2는 계속 반복합니다 3에서 break 6으로 종료하여 answer=6입니다
    commonMistakes:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-18-loop-break-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust loop와 break 값' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust loop와 break 값: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let mut n = 0;\n    let answer = loop { n += 1; if n == 3 { break n * 2; } };\n    println!(\"\
      {answer}\");\n}"
    hint: Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 n은 0에서 출발합니다 1·2는 계속 반복합니다 3에서 break 6으로 종료하여 answer=6입니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-18-loop-break-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "6"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: n=0  →  1  →  2  →  3  →  answer=6 순서로 실행되어 출력은 '6'입니다.
  - id: quiz-day-18-loop-break-model
    question: "'Rust loop와 break 값' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함(이것이 정상적인 사용법이다)
      - Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.
  - id: quiz-day-18-loop-break-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함
    answerIndex: 2
    explanation: break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-18-loop-break-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 반복 종료 값을 사용함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 반복 종료 값을 사용함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

반복을 마칠 때 계산 결과를 바로 바깥 표현식에 전달할 수 있습니다. Day 18 "`Rust loop와 break 값`"에서는 Rust 코드의 실행 결과(`6`)를 따라가며, `반복 종료 값을 사용함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 17](/learn/day-17-while-loop)에서 배운 "while과 종료 조건" 내용을 한 문장으로 말해 보세요. 이번 "`Rust loop와 break 값`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `break n * 2`입니다.

## 머릿속 그림

Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다. Day 18에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `break n * 2`입니다.

```text
n=0  →  1  →  2  →  3  →  answer=6
```

위 흐름에서 `break n * 2` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `6`입니다.

## 천천히 풀어보기

`loop`는 스스로 멈추지 않는 Rust 반복문입니다. `break`를 만날 때 끝나고, `break n * 2`처럼 값을 함께 적으면 그 값이 **loop 표현식 전체의 결과**가 됩니다. 조건을 확인하기 전까지 `n`이 어떻게 바뀌는지 적고, 어느 회차에서 `break`를 만나는지 확인하세요.

`while`은 조건이 거짓일 때 자연스럽게 끝나고 `loop`는 멈출 위치를 직접 지정합니다. 종료 조건이 잘못되어 영원히 `break`를 만나지 않으면 프로그램도 끝나지 않습니다. `break;`처럼 값 없이 빠져나오는 경우와 결과값을 돌려주는 경우를 구별하세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 18 "`Rust loop와 break 값`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `break n * 2`이며, 실행 결과는 `6`입니다.

```rust
fn main() {
    let mut n = 0;
    let answer = loop { n += 1; if n == 3 { break n * 2; } };
    println!("{answer}");
}
```

예상 출력:

```text
6
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `6`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `break n * 2`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let mut n = 0;
 3 |     let answer = loop { n += 1; if n == 3 { break n * 2; } };
 4 |     println!("{answer}");
 5 | }
```

1. n은 0에서 출발합니다
2. 1·2는 계속 반복합니다
3. 3에서 break 6으로 종료하여 answer=6입니다

`break n * 2` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | n=0            |
|    2 | 1              |
|    3 | 2              |
|    4 | 3              |
|    5 | answer=6       |

위 순서대로 실행한 최종 출력은 `6`입니다. `n=0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`let answer = loop { break 7; };`이라고 적으면 `answer`는 7입니다. `break`가 반복을 끝내는 동시에 값도 되돌립니다. `let answer = loop { break; };`에서는 7 같은 정수 대신 값이 없는 단위 타입 `()`이 결과이므로, 정수가 필요한 곳에 넣으면 타입이 맞지 않습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `6`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn main() {
    let mut n = 1;
    let answer = loop { n += 1; if n == 3 { break n * 2; } };
    println!("{answer}");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
6
```

바꾼 뒤 출력도 `6`입니다. 멈추는 조건은 n이 3이 되는 순간이라 시작값과 무관하게 break 값 3 곱하기 2로 6이 됩니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`let mut n = 1;`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함.** 정상 코드의 실행 결과는 `6`입니다.

- 정상 줄: `let answer = loop { n += 1; if n == 3 { break n * 2; } };`
- 잘못된 줄: `let answer = loop { n += 1; if n == 3 { break n; } };`

두 줄을 나란히 놓고 `Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `n=0`부터 `6`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `반복 종료 값을 사용함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | while(1)과 별도의 결과 변수     |
| Python | while True와 결과 변수, break   |
| Rust   | let answer = loop { break 값; } |

C17에서는 `while(1)과 별도의 결과 변수` 규칙을 적용합니다. "`Rust loop와 break 값`" 수업의 실행 결과(`6`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `while True와 결과 변수, break` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `let answer = loop { break 값; }` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`6` 맞히기) → 빈칸(`break n * 2` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함` 찾기) → 독립 구현(`'Rust loop와 break 값' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `6` 및 `break n * 2` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust loop와 break 값`" 수업이 필요한 이유는 `반복 종료 값을 사용함` 동작으로 설명해 보세요.
- 예제에서 `break n * 2` 부분 실행 직전의 상태와 직후의 출력(`6`)을 말해 보세요.
- "`break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `반복 종료 값을 사용함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Rust의 loop는 명시적 break가 실행될 때까지 돌며 break 뒤 값이 loop 표현식의 값입니다. Day 18 "`Rust loop와 break 값`" 예제의 핵심 부분은 `break n * 2`이며, 실행 결과는 `6`입니다. "`break 뒤의 값을 무시하고 loop는 언제나 빈 값을 준다고 생각함`" 여부를 확인하고 Day 18 수업을 완료하세요.
