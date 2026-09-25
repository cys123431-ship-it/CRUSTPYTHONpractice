---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-48-rust-reader
courseId: crp-92
phaseId: phase-04
dayNumber: 48
date: "2026-11-17"
title: Rust 읽기와 Result
summary: 파일을 읽는 API는 실패할 수 있어 반환된 Result의 성공/실패를 확인해야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-47-python-file
learningObjectives:
  - "'Rust 읽기와 Result' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust reader
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
  - id: ex-day-48-rust-reader-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? source=30에서 시작해 계산하세요.
    starter:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    answer: "30"
    hint: Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.
    explanation: source=30  →  text 비어 있음  →  read 성공 text=30. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-48-rust-reader-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust 읽기와 Result의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: read_to_string"
    starter:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source._____(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    answer:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    hint: Cursor에 30을 넣습니다
    explanation: 빈칸에는 'read_to_string'이 들어갑니다. Cursor에 30을 넣습니다 가변 문자열 text에 내용을 읽습니다 성공을 확인하고 30을 출력합니다
    commonMistakes:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-48-rust-reader-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 '30'에서 '30!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    answer:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30!\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    hint: 첫 문자열을 '30'에서 '30!'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 첫 문자열을 '30'에서 '30!'로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-48-rust-reader-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함 상황을 확인하세요.
    starter:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_exact(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    answer:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    hint: Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. Cursor에 30을 넣습니다 가변 문자열 text에 내용을 읽습니다 성공을 확인하고 30을 출력합니다
    commonMistakes:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-48-rust-reader-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust 읽기와 Result' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust 읽기와 Result: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "use std::io::{Cursor, Read};\nfn main() {\n    let mut source = Cursor::new(\"30\");\n    let mut text\
      \ = String::new();\n    source.read_to_string(&mut text).expect(\"읽기 실패\");\n    println!(\"{text}\");\n}"
    hint: Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 Cursor에 30을 넣습니다 가변 문자열 text에 내용을 읽습니다 성공을 확인하고 30을 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-48-rust-reader-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "30"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: source=30  →  text 비어 있음  →  read 성공 text=30 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-48-rust-reader-model
    question: Rust 읽기와 Result을 이해하는 데 맞는 설명은?
    choices:
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함(이것이 정상적인 사용법이다)
      - Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.
  - id: quiz-day-48-rust-reader-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함
    answerIndex: 2
    explanation: 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-48-rust-reader-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 읽기 결과와 목적 버퍼를 처리함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 읽기 결과와 목적 버퍼를 처리함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

파일을 읽는 API는 실패할 수 있어 반환된 Result의 성공/실패를 확인해야 합니다. Day 48 "`Rust 읽기와 Result`"에서는 Rust 코드의 실행 결과(`30`)를 따라가며, `읽기 결과와 목적 버퍼를 처리함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 47](/learn/day-47-python-file)에서 배운 "Python 파일형 객체와 예외" 내용을 한 문장으로 말해 보세요. 이번 "`Rust 읽기와 Result`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `read_to_string`입니다.

## 머릿속 그림

Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다. Day 48에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `read_to_string`입니다.

```text
source=30  →  text 비어 있음  →  read 성공 text=30
```

위 흐름에서 `read_to_string` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

`Cursor`는 메모리 속 바이트를 파일처럼 읽을 수 있게 합니다. `read_to_string(&mut text)`는 읽은 글자를 `text`에 덧붙이려 시도하고 **성공 또는 오류**를 `Result`로 돌려줍니다. 성공했다면 몇 바이트를 읽었는지도 알 수 있습니다.

UTF-8이 아닌 바이트를 문자열로 읽으려 할 때는 실패할 수 있습니다. `.unwrap()`은 연습용 예제에서는 간단하지만 실제 입력에서는 오류를 사용자에게 알려 주거나 `?`로 호출자에게 전달하는 편이 낫습니다. 읽기 전 빈 `text`와 읽기 뒤 `text`를 나눠 적어 보세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 48 "`Rust 읽기와 Result`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `read_to_string`이며, 실행 결과는 `30`입니다.

```rust
use std::io::{Cursor, Read};
fn main() {
    let mut source = Cursor::new("30");
    let mut text = String::new();
    source.read_to_string(&mut text).expect("읽기 실패");
    println!("{text}");
}
```

예상 출력:

```text
30
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `read_to_string`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | use std::io::{Cursor, Read};
 2 | fn main() {
 3 |     let mut source = Cursor::new("30");
 4 |     let mut text = String::new();
 5 |     source.read_to_string(&mut text).expect("읽기 실패");
 6 |     println!("{text}");
 7 | }
```

1. Cursor에 30을 넣습니다
2. 가변 문자열 text에 내용을 읽습니다
3. 성공을 확인하고 30을 출력합니다

`read_to_string` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작    |
| ---: | ----------------- |
|    1 | source=30         |
|    2 | text 비어 있음    |
|    3 | read 성공 text=30 |

위 순서대로 실행한 최종 출력은 `30`입니다. `source=30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`Cursor::new(b"abc")`를 `read_to_string(&mut text)`로 읽어 성공했다면 text에는 `abc`가 들어갑니다. 성공 결과의 숫자는 **읽은 바이트 수 3**이고 텍스트 자체가 아닙니다. UTF-8로 해석할 수 없는 바이트가 들어오면 `Result::Err`가 될 수 있으니 읽기 실패도 따로 처리하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
use std::io::{Cursor, Read};
fn main() {
    let mut source = Cursor::new("30!");
    let mut text = String::new();
    source.read_to_string(&mut text).expect("읽기 실패");
    println!("{text}");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
30!
```

원본(`30`)과 달라졌습니다. 다른 줄(`let mut source = Cursor::new("30");` → `let mut source = Cursor::new("30!");`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`source=30` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `source.read_to_string(&mut text).expect("읽기 실패");`
- 잘못된 줄: `source.read_exact(&mut text).expect("읽기 실패");`

두 줄을 나란히 놓고 `Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `source=30`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `읽기 결과와 목적 버퍼를 처리함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | fread 반환된 길이와 ferror 확인 |
| Python | read와 OSError 처리             |
| Rust   | Read::read_to_string의 Result   |

C17에서는 `fread 반환된 길이와 ferror 확인` 규칙을 적용합니다. "`Rust 읽기와 Result`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `read와 OSError 처리` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Read::read_to_string의 Result` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`read_to_string` 채우기) → 변경(`첫 문자열을 '30'에서 '30!'로`) → 오류 수정(`읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함` 찾기) → 독립 구현(`Rust 읽기와 Result을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `read_to_string` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust 읽기와 Result`" 수업이 필요한 이유는 `읽기 결과와 목적 버퍼를 처리함` 동작으로 설명해 보세요.
- 예제에서 `read_to_string` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `읽기 결과와 목적 버퍼를 처리함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Cursor는 메모리 버퍼를 파일처럼 읽게 합니다. read_to_string은 text를 변경하고 Result를 돌려줍니다. Day 48 "`Rust 읽기와 Result`" 예제의 핵심 부분은 `read_to_string`이며, 실행 결과는 `30`입니다. "`읽기 결과의 오류를 무시해 빈 데이터를 정상으로 취급함`" 여부를 확인하고 Day 48 수업을 완료하세요.
