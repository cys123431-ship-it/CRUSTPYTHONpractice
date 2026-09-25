---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-89-rust-record-parse
courseId: crp-92
phaseId: phase-08
dayNumber: 89
date: "2026-12-28"
title: Rust 타입으로 레코드 검증
summary: CSV 문자열을 타입이 있는 Session으로 만들 때 파싱 실패를 호출자에게 전달해야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-88-c-aggregation
learningObjectives:
  - "'Rust 타입으로 레코드 검증' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust record parse
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
  - id: ex-day-89-rust-record-parse-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? raw='30'에서 시작해 계산하세요.
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    answer: "30"
    hint: minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.
    explanation: raw='30'  →  parse Ok(30)  →  Session.minutes=30. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-89-rust-record-parse-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Rust 타입으로 레코드 검증' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: raw.parse()"
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ _____.expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    hint: raw는 문자열 30입니다
    explanation: 빈칸에 들어갈 표현은 'raw.parse()'입니다. raw는 문자열 30입니다 parse로 u32 30을 얻습니다 Session의 필드로 저장해 출력합니다
    commonMistakes:
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-89-rust-record-parse-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 입력 문자열 30을 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"31\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 입력 문자열 30을 31로."
    explanation: 바꾼 뒤 출력은 '31'입니다. 원본 출력 '30'에서 달라졌습니다. 다른 줄(let raw = "30"; → let raw = "31";)에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-89-rust-record-parse-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김 상황을 확인하세요.
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.len().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    hint: minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. raw는 문자열 30입니다 parse로 u32 30을 얻습니다 Session의 필드로 저장해 출력합니다
    commonMistakes:
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-89-rust-record-parse-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust 타입으로 레코드 검증' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust 타입으로 레코드 검증: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let raw = \"30\";\n    let session = Session { minutes:\
      \ raw.parse().expect(\"분 숫자 오류\") };\n    println!(\"{}\", session.minutes);\n}"
    hint: minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 raw는 문자열 30입니다 parse로 u32 30을 얻습니다 Session의 필드로 저장해 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-89-rust-record-parse-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "30"
    answerIndex: 2
    explanation: raw='30'  →  parse Ok(30)  →  Session.minutes=30 순서로 실행되어 출력은 '30'입니다.
  - id: quiz-day-89-rust-record-parse-model
    question: "'Rust 타입으로 레코드 검증' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.
  - id: quiz-day-89-rust-record-parse-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-89-rust-record-parse-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 텍스트 행을 타입 있는 레코드로 변환라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 텍스트 행을 타입 있는 레코드로 변환라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

CSV 문자열을 타입이 있는 Session으로 만들 때 파싱 실패를 호출자에게 전달해야 합니다. Day 89 "`Rust 타입으로 레코드 검증`"에서는 Rust 코드의 실행 결과(`30`)를 따라가며, `텍스트 행을 타입 있는 레코드로 변환` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 88](/learn/day-88-c-aggregation)에서 배운 "C 레코드 집계와 경계 검사" 내용을 한 문장으로 말해 보세요. 이번 "`Rust 타입으로 레코드 검증`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `raw.parse()`입니다.

## 머릿속 그림

minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다. Day 89에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `raw.parse()`입니다.

```text
raw='30'  →  parse Ok(30)  →  Session.minutes=30
```

위 흐름에서 `raw.parse()` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

`raw.parse::<u32>()`는 글자 `"30"`을 음수 없는 정수 30으로 바꾸려 시도합니다. 성공이면 `Ok(30)`, 실패면 `Err(...)`입니다. `minutes: u32`처럼 저장할 필드 타입을 정하면 잘못된 형태의 기록이 조기에 드러납니다.

`"-1"`, `"삼십"`, 범위를 넘은 큰 숫자는 유효한 `u32` 분 값이 아닙니다. 오류를 `unwrap`으로 갑자기 끝내기보다 행 번호와 함께 알려 주고 계속 읽을지 중단할지 정책을 정하세요. 타입을 정하는 것만으로 '하루 분이 현실적인 범위인가' 같은 업무 규칙까지 해결되지는 않습니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 89 "`Rust 타입으로 레코드 검증`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `raw.parse()`이며, 실행 결과는 `30`입니다.

```rust
struct Session { minutes: u32 }
fn main() {
    let raw = "30";
    let session = Session { minutes: raw.parse().expect("분 숫자 오류") };
    println!("{}", session.minutes);
}
```

예상 출력:

```text
30
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `raw.parse()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | struct Session { minutes: u32 }
 2 | fn main() {
 3 |     let raw = "30";
 4 |     let session = Session { minutes: raw.parse().expect("분 숫자 오류") };
 5 |     println!("{}", session.minutes);
 6 | }
```

1. raw는 문자열 30입니다
2. parse로 u32 30을 얻습니다
3. Session의 필드로 저장해 출력합니다

`raw.parse()` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작     |
| ---: | ------------------ |
|    1 | raw='30'           |
|    2 | parse Ok(30)       |
|    3 | Session.minutes=30 |

위 순서대로 실행한 최종 출력은 `30`입니다. `raw='30'` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`"31".parse::<u32>()`는 `Ok(31)`이고 `"-1".parse::<u32>()`는 음수를 담지 못해 오류입니다. 성공에서만 Session의 분 필드를 채우세요. 정수 변환에 성공해도 999999분이 실제 한 학습 세션으로 적절한지는 별도 범위 검사가 필요합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
struct Session { minutes: u32 }
fn main() {
    let raw = "31";
    let session = Session { minutes: raw.parse().expect("분 숫자 오류") };
    println!("{}", session.minutes);
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
31
```

원본과 달라졌습니다. 원본 출력은 `30`입니다. 다른 줄(`let raw = "30";` → `let raw = "31";`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`raw='30'` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `let session = Session { minutes: raw.parse().expect("분 숫자 오류") };`
- 잘못된 줄: `let session = Session { minutes: raw.len().expect("분 숫자 오류") };`

두 줄을 나란히 놓고 `minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `raw='30'`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `텍스트 행을 타입 있는 레코드로 변환`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙   |
| ------ | ---------------------------- |
| C17    | struct Session과 검증 함수   |
| Python | dataclass Session과 int 변환 |
| Rust   | struct Session과 Result 반환 |

C17에서는 `struct Session과 검증 함수` 규칙을 적용합니다. "`Rust 타입으로 레코드 검증`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `dataclass Session과 int 변환` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `struct Session과 Result 반환` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`raw.parse()` 채우기) → 변경(`입력 문자열 30을 31로`) → 오류 수정(`실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김` 찾기) → 독립 구현(`'Rust 타입으로 레코드 검증' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `raw.parse()` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust 타입으로 레코드 검증`" 수업이 필요한 이유는 `텍스트 행을 타입 있는 레코드로 변환` 동작으로 설명해 보세요.
- 예제에서 `raw.parse()` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `텍스트 행을 타입 있는 레코드로 변환` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

minutes:u32를 기대하는 필드에서 parse가 숫자 변환을 하고 실패하면 Err가 됩니다. Day 89 "`Rust 타입으로 레코드 검증`" 예제의 핵심 부분은 `raw.parse()`이며, 실행 결과는 `30`입니다. "`실제 파일 파서에서 expect로 전체 프로그램을 종료하고 어느 행인지 숨김`" 여부를 확인하고 Day 89 수업을 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 Rust 타입으로 레코드 검증의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
