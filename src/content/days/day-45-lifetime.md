---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-45-lifetime
courseId: crp-92
phaseId: phase-04
dayNumber: 45
date: "2026-11-14"
title: Rust 참조의 유효 수명
summary: 둘 중 하나의 참조를 반환하는 함수는 결과가 얼마나 오래 유효한지 호출자에게 알려야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-44-mutable-arguments
learningObjectives:
  - "'Rust 참조의 유효 수명' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 지역에서 만든 String의 참조를 함수 밖으로 반환함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - lifetime
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
  - id: ex-day-45-lifetime-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? x 길이 5에서 시작해 계산하세요.
    starter:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\n\
      fn main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    answer: study
    hint: "'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다."
    explanation: x 길이 5  →  y 길이 3  →  x 반환  →  study. 따라서 출력은 'study'입니다.
    commonMistakes:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-45-lifetime-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust 참조의 유효 수명의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: 'a"
    starter:
      "fn longer<_____>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n\
      }\nfn main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    answer:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\nfn\
      \ main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    hint: study 길이는 5, log 길이는 3입니다
    explanation: 빈칸에는 "'a"이 들어갑니다. study 길이는 5, log 길이는 3입니다 첫 참조를 선택합니다 유효한 문자열 study를 출력합니다
    commonMistakes:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-45-lifetime-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 '{}'에서 '{}!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\n\
      fn main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    answer:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\nfn\
      \ main() { println!(\"{}!\", longer(\"study\", \"log\")); }"
    hint: 첫 문자열을 '{}'에서 '{}!'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 첫 문자열을 '{}'에서 '{}!'로 바꿨습니다. 원래 출력은 'study'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-45-lifetime-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 지역에서 만든 String의 참조를 함수 밖으로 반환함 상황을 확인하세요.
    starter:
      "fn longer<'static>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n\
      }\nfn main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    answer:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\nfn\
      \ main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    hint: "'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다."
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. study 길이는 5, log 길이는 3입니다 첫 참조를 선택합니다 유효한 문자열 study를 출력합니다
    commonMistakes:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-45-lifetime-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust 참조의 유효 수명' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust 참조의 유효 수명: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() >= y.len() { x } else { y }\n}\nfn\
      \ main() { println!(\"{}\", longer(\"study\", \"log\")); }"
    hint: "'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다."
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 study 길이는 5, log 길이는 3입니다 첫 참조를 선택합니다 유효한 문자열 study를 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-45-lifetime-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - study
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: x 길이 5  →  y 길이 3  →  x 반환  →  study 순서로 실행되어 'study'을 출력합니다.
  - id: quiz-day-45-lifetime-model
    question: Rust 참조의 유효 수명을 이해하는 데 맞는 설명은?
    choices:
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함(이것이 정상적인 사용법이다)
      - "'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다."
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: "'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다."
  - id: quiz-day-45-lifetime-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 지역에서 만든 String의 참조를 함수 밖으로 반환함
    answerIndex: 2
    explanation: 지역에서 만든 String의 참조를 함수 밖으로 반환함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-45-lifetime-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 입력 참조와 반환 참조 수명 관계 명시라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 입력 참조와 반환 참조 수명 관계 명시라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

둘 중 하나의 참조를 반환하는 함수는 결과가 얼마나 오래 유효한지 호출자에게 알려야 합니다. Day 45 "`Rust 참조의 유효 수명`"에서는 Rust 코드의 실행 결과(`study`)를 따라가며, `입력 참조와 반환 참조 수명 관계 명시` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`지역에서 만든 String의 참조를 함수 밖으로 반환함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 44](/learn/day-44-mutable-arguments)에서 배운 "Python 함수의 가변 인자" 내용을 한 문장으로 말해 보세요. 이번 "`Rust 참조의 유효 수명`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `'a`입니다.

## 머릿속 그림

'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다. Day 45에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `'a`입니다.

```text
x 길이 5  →  y 길이 3  →  x 반환  →  study
```

위 흐름에서 `'a` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `study`입니다.

## 천천히 풀어보기

참조는 가리키는 원본이 살아 있는 동안에만 사용할 수 있습니다. `'a`는 특정 시간을 초 단위로 세는 값이 아니라 '이 입력 참조와 반환 참조가 함께 유효해야 하는 범위'를 **관계로 표시**한 이름입니다. 두 입력 중 하나를 골라 참조로 반환한다면 결과는 두 입력이 모두 유효한 범위 안에서만 쓸 수 있습니다.

함수 안에서 새로 만든 지역 문자열의 참조를 돌려주려고 하면 함수가 끝나는 순간 원본이 사라져 위험합니다. Rust는 이런 코드를 컴파일 때 막습니다. 소유한 `String`을 반환하거나 호출자가 소유한 데이터에 대한 참조를 반환하는 방식으로 고칩니다. 수명 표기는 원본을 오래 살게 만드는 마법이 아닙니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 45 "`Rust 참조의 유효 수명`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `'a`이며, 실행 결과는 `study`입니다.

```rust
fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}
fn main() { println!("{}", longer("study", "log")); }
```

예상 출력:

```text
study
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `study`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `'a`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {
 2 |     if x.len() >= y.len() { x } else { y }
 3 | }
 4 | fn main() { println!("{}", longer("study", "log")); }
```

1. study 길이는 5, log 길이는 3입니다
2. 첫 참조를 선택합니다
3. 유효한 문자열 study를 출력합니다

`'a` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | x 길이 5       |
|    2 | y 길이 3       |
|    3 | x 반환         |
|    4 | study          |

위 순서대로 실행한 최종 출력은 `study`입니다. `x 길이 5` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`fn first<'a>(x: &'a str, y: &'a str) -> &'a str`가 x 또는 y를 돌려준다면 결과 참조는 두 입력이 모두 살아 있는 범위에서만 사용할 수 있습니다. 호출자가 결과를 저장해도 함수 안에서 만든 임시 문자열의 수명이 늘어나지는 않습니다. 원본을 누가 소유하고 언제 사라지는지 함께 적어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `study`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}
fn main() { println!("{}!", longer("study", "log")); }
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
study!
```

원본(`study`)과 달라졌습니다. 다른 줄(`fn main() { println!("{}", longer("study", "log")); }` → `fn main() { println!("{}!", longer("study", "log")); }`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`x 길이 5` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 지역에서 만든 String의 참조를 함수 밖으로 반환함.** 정상 코드의 실행 결과는 `study`입니다.

- 정상 줄: `fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {`
- 잘못된 줄: `fn longer<'static>(x: &'a str, y: &'a str) -> &'a str {`

두 줄을 나란히 놓고 `'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `x 길이 5`부터 `study`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `입력 참조와 반환 참조 수명 관계 명시`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙              |
| ------ | --------------------------------------- |
| C17    | 호출자가 반환 포인터의 수명을 직접 확인 |
| Python | 참조 수명을 런타임이 관리               |
| Rust   | 반환 참조와 입력 참조의 lifetime 연결   |

C17에서는 `호출자가 반환 포인터의 수명을 직접 확인` 규칙을 적용합니다. "`Rust 참조의 유효 수명`" 수업의 실행 결과(`study`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `참조 수명을 런타임이 관리` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `반환 참조와 입력 참조의 lifetime 연결` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`study` 맞히기) → 빈칸(`'a` 채우기) → 변경(`첫 문자열을 '{}'에서 '{}!'로`) → 오류 수정(`지역에서 만든 String의 참조를 함수 밖으로 반환함` 찾기) → 독립 구현(`Rust 참조의 유효 수명을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `study` 및 `'a` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust 참조의 유효 수명`" 수업이 필요한 이유는 `입력 참조와 반환 참조 수명 관계 명시` 동작으로 설명해 보세요.
- 예제에서 `'a` 부분 실행 직전의 상태와 직후의 출력(`study`)을 말해 보세요.
- "`지역에서 만든 String의 참조를 함수 밖으로 반환함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `입력 참조와 반환 참조 수명 관계 명시` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

'a는 반환 참조가 입력 참조들이 함께 유효한 범위를 넘지 않겠다는 관계를 표시합니다. Day 45 "`Rust 참조의 유효 수명`" 예제의 핵심 부분은 `'a`이며, 실행 결과는 `study`입니다. "`지역에서 만든 String의 참조를 함수 밖으로 반환함`" 여부를 확인하고 Day 45 수업을 완료하세요.
