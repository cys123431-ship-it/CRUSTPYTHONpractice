---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-39-string-slice
courseId: crp-92
phaseId: phase-04
dayNumber: 39
date: "2026-11-08"
title: Rust String과 &str
summary: 수정 가능한 소유 문자열과 읽기만 하는 문자열 뷰의 역할을 구분해야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-38-unicode
learningObjectives:
  - "'Rust String과 &str' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: &str 참조로 원본의 크기를 바꿀 수 있다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - string slice
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
  - id: ex-day-39-string-slice-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? topic=C에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    answer: C Rust
    hint: String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.
    explanation: topic=C  →  topic=C Rust  →  view=C Rust. 따라서 출력은 'C Rust'입니다.
    commonMistakes:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-39-string-slice-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Rust String과 &str' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: push_str"
    starter:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic._____(\" Rust\");\n    let view: &str\
      \ = &topic;\n    println!(\"{view}\");\n}"
    answer:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    hint: topic이 C를 소유합니다
    explanation: 빈칸에 들어갈 표현은 'push_str'입니다. topic이 C를 소유합니다 push_str이 공백과 Rust를 덧붙입니다 view로 전체를 빌려 출력합니다
    commonMistakes:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-39-string-slice-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 첫 문자열을 'C'에서 'C!'로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    answer:
      "fn main() {\n    let mut topic = String::from(\"C!\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 첫 문자열을 'C'에서 'C!'로."
    explanation:
      바꾼 뒤 출력은 'C! Rust'입니다. 원본 출력 'C Rust'에서 달라졌습니다. 다른 줄(let mut topic = String::from("C"); → let mut
      topic = String::from("C!");)에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-39-string-slice-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 &str 참조로 원본의 크기를 바꿀 수 있다고 생각함 상황을 확인하세요.
    starter:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push(\" Rust\");\n    let view: &str\
      \ = &topic;\n    println!(\"{view}\");\n}"
    answer:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    hint: String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. topic이 C를 소유합니다 push_str이 공백과 Rust를 덧붙입니다 view로 전체를 빌려 출력합니다
    commonMistakes:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-39-string-slice-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust String과 &str' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust String과 &str: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let mut topic = String::from(\"C\");\n    topic.push_str(\" Rust\");\n    let view:\
      \ &str = &topic;\n    println!(\"{view}\");\n}"
    hint: String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 topic이 C를 소유합니다 push_str이 공백과 Rust를 덧붙입니다 view로 전체를 빌려 출력합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-39-string-slice-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - C Rust
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: topic=C  →  topic=C Rust  →  view=C Rust 순서로 실행되어 출력은 'C Rust'입니다.
  - id: quiz-day-39-string-slice-model
    question: "'Rust String과 &str' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함(이것이 정상적인 사용법이다)"
      - String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.
  - id: quiz-day-39-string-slice-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함"
    answerIndex: 2
    explanation: "&str 참조로 원본의 크기를 바꿀 수 있다고 생각함. 입력과 중간 상태를 차례로 확인하세요."
  - id: quiz-day-39-string-slice-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 소유 문자열을 수정하고 읽기 전용 뷰 사용라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 소유 문자열을 수정하고 읽기 전용 뷰 사용라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

수정 가능한 소유 문자열과 읽기만 하는 문자열 뷰의 역할을 구분해야 합니다. Day 39 "`Rust String과 &str`"에서는 Rust 코드의 실행 결과(`C Rust`)를 따라가며, `소유 문자열을 수정하고 읽기 전용 뷰 사용` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`&str 참조로 원본의 크기를 바꿀 수 있다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 38](/learn/day-38-unicode)에서 배운 "Python 문자열과 유니코드" 내용을 한 문장으로 말해 보세요. 이번 "`Rust String과 &str`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `push_str`입니다.

## 머릿속 그림

String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다. Day 39에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `push_str`입니다.

```text
topic=C  →  topic=C Rust  →  view=C Rust
```

위 흐름에서 `push_str` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `C Rust`입니다.

## 천천히 풀어보기

`String`은 문자열 데이터를 소유하며 필요하면 `push_str`로 뒤에 글자를 붙일 수 있습니다. `&str`은 문자열 내용을 잠시 **빌려 보는 구간**입니다. 글자 리터럴 `"hi"`도 `&str`이고, 소유 중인 `String`에서 `as_str()`로 빌릴 수도 있습니다.

`let mut s = String::from("안"); s.push_str("녕");`이면 소유 중인 데이터가 '안녕'으로 바뀝니다. UTF-8 문자 하나가 한 바이트라는 보장은 없으므로 바이트 인덱스 하나로 문자열의 n번째 글자를 읽으려 하면 안 됩니다. 바이트 길이와 글자 순회를 구분하세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 39 "`Rust String과 &str`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `push_str`이며, 실행 결과는 `C Rust`입니다.

```rust
fn main() {
    let mut topic = String::from("C");
    topic.push_str(" Rust");
    let view: &str = &topic;
    println!("{view}");
}
```

예상 출력:

```text
C Rust
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `C Rust`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `push_str`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn main() {
 2 |     let mut topic = String::from("C");
 3 |     topic.push_str(" Rust");
 4 |     let view: &str = &topic;
 5 |     println!("{view}");
 6 | }
```

1. topic이 C를 소유합니다
2. push_str이 공백과 Rust를 덧붙입니다
3. view로 전체를 빌려 출력합니다

`push_str` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | topic=C        |
|    2 | topic=C Rust   |
|    3 | view=C Rust    |

위 순서대로 실행한 최종 출력은 `C Rust`입니다. `topic=C` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`let mut s = String::from("C"); s.push_str("와 Rust");`이면 s가 소유한 문자열이 `C와 Rust`가 됩니다. `let view: &str = &s;`로 빌려 읽을 수 있습니다. `String`을 함수에 넘겨 소유권을 옮기는 방식과 `&str`로 읽기만 빌려 주는 방식 중 어느 것이 필요한지 먼저 정하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `C Rust`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn main() {
    let mut topic = String::from("C!");
    topic.push_str(" Rust");
    let view: &str = &topic;
    println!("{view}");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
C! Rust
```

원본과 달라졌습니다. 원본 출력은 `C Rust`입니다. 다른 줄(`let mut topic = String::from("C");` → `let mut topic = String::from("C!");`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`topic=C` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: &str 참조로 원본의 크기를 바꿀 수 있다고 생각함.** 정상 코드의 실행 결과는 `C Rust`입니다.

- 정상 줄: `topic.push_str(" Rust");`
- 잘못된 줄: `topic.push(" Rust");`

두 줄을 나란히 놓고 `String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `topic=C`부터 `C Rust`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `소유 문자열을 수정하고 읽기 전용 뷰 사용`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | 가변 char 버퍼는 용량 검사 필요 |
| Python | 불변 str 연결은 새 문자열       |
| Rust   | String.push_str 후 &str 빌림    |

C17에서는 `가변 char 버퍼는 용량 검사 필요` 규칙을 적용합니다. "`Rust String과 &str`" 수업의 실행 결과(`C Rust`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `불변 str 연결은 새 문자열` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `String.push_str 후 &str 빌림` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`C Rust` 맞히기) → 빈칸(`push_str` 채우기) → 변경(`첫 문자열을 'C'에서 'C!'로`) → 오류 수정(`&str 참조로 원본의 크기를 바꿀 수 있다고 생각함` 찾기) → 독립 구현(`'Rust String과 &str' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `C Rust` 및 `push_str` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust String과 &str`" 수업이 필요한 이유는 `소유 문자열을 수정하고 읽기 전용 뷰 사용` 동작으로 설명해 보세요.
- 예제에서 `push_str` 부분 실행 직전의 상태와 직후의 출력(`C Rust`)을 말해 보세요.
- "`&str 참조로 원본의 크기를 바꿀 수 있다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `소유 문자열을 수정하고 읽기 전용 뷰 사용` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

String은 가변 힙 데이터를 소유하고 &str은 그 문자열의 유효 구간을 빌립니다. Day 39 "`Rust String과 &str`" 예제의 핵심 부분은 `push_str`이며, 실행 결과는 `C Rust`입니다. "`&str 참조로 원본의 크기를 바꿀 수 있다고 생각함`" 여부를 확인하고 Day 39 수업을 완료하세요.
