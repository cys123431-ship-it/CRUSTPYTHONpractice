---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-33-shared-borrow
courseId: crp-92
phaseId: phase-04
dayNumber: 33
date: "2026-11-02"
title: 공유 빌림과 참조
summary: 함수에 값을 넘긴 뒤에도 호출자가 계속 사용하려면 복제 없이 읽기만 빌려줄 수 있습니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-32-move-clone
learningObjectives:
  - "'공유 빌림과 참조' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - shared borrow
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
  - id: ex-day-33-shared-borrow-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? topic 소유에서 시작해 계산하세요.
    starter:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    answer: 4 Rust
    hint: "&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다."
    explanation: topic 소유  →  &topic 빌림  →  길이 4  →  topic 여전히 유효. 따라서 출력은 '4 Rust'입니다.
    commonMistakes:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-33-shared-borrow-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 공유 빌림과 참조의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: &topic"
    starter:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(_____));\n}"
    answer:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    hint: topic이 Rust를 소유합니다
    explanation: 빈칸에는 '&topic'이 들어갑니다. topic이 Rust를 소유합니다 length가 주소를 읽기 전용으로 빌립니다 길이 4와 원본 Rust를 출력합니다
    commonMistakes:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-33-shared-borrow-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 'Rust'에서 'Rust!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    answer:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust!\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    hint: 첫 문자열을 'Rust'에서 'Rust!'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 첫 문자열을 'Rust'에서 'Rust!'로 바꿨습니다. 원래 출력은 '4 Rust'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이
      같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-33-shared-borrow-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함 상황을 확인하세요.
    starter:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(topic.clone()));\n}"
    answer:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    hint: "&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다."
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. topic이 Rust를 소유합니다 length가 주소를 읽기 전용으로 빌립니다 길이 4와 원본 Rust를 출력합니다
    commonMistakes:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-33-shared-borrow-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '공유 빌림과 참조' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 공유 빌림과 참조: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn length(text: &String) -> usize { text.len() }\nfn main() {\n    let topic = String::from(\"Rust\"\
      );\n    println!(\"{} {topic}\", length(&topic));\n}"
    hint: "&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다."
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 topic이 Rust를 소유합니다 length가 주소를 읽기 전용으로 빌립니다 길이 4와 원본 Rust를 출력합니다 다른 코드도
      결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-33-shared-borrow-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 4 Rust
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: topic 소유  →  &topic 빌림  →  길이 4  →  topic 여전히 유효 순서로 실행되어 '4 Rust'을 출력합니다.
  - id: quiz-day-33-shared-borrow-model
    question: 공유 빌림과 참조을 이해하는 데 맞는 설명은?
    choices:
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함(이것이 정상적인 사용법이다)
      - "&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다."
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: "&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다."
  - id: quiz-day-33-shared-borrow-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함
    answerIndex: 2
    explanation: 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-33-shared-borrow-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 소유권 이동 없이 읽기 전달라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 소유권 이동 없이 읽기 전달라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

함수에 값을 넘긴 뒤에도 호출자가 계속 사용하려면 복제 없이 읽기만 빌려줄 수 있습니다. Day 33 "`공유 빌림과 참조`"에서는 Rust 코드가 `4 Rust`을(를) 만드는 과정을 따라가며, 소유권 이동 없이 읽기 전달 동작이 왜 필요한지 확인합니다. 소유권 이동 없이 읽기 전달을(를) 빠뜨리면 `참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 32](/learn/day-32-move-clone)에서는 "Rust 소유권 이동과 clone"을(를) 배웠습니다. "Rust 소유권 이동과 clone"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`공유 빌림과 참조`"에서 새로 달라지는 조건을 찾아보세요. Day 33의 답은 `4 Rust`이며, 핵심 표현은 `&topic`입니다.

## 머릿속 그림

&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다. Day 33에서는 아래 흐름 순서대로 상태가 바뀌며, `&topic`이(가) 결과를 가릅니다.

```text
topic 소유  →  &topic 빌림  →  길이 4  →  topic 여전히 유효
```

위 흐름에서 `&topic`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `4 Rust`입니다.

## 천천히 풀어보기

`&topic`은 문자열을 다른 함수에 **읽으라고 잠시 보여 주는 것**입니다. 빌린 함수는 원래 `String`의 소유자가 되지 않으므로 함수가 끝난 뒤에도 호출자에서 `topic`을 쓸 수 있습니다. `&String`을 받는 함수는 소유권 이동 없이 값을 읽습니다.

공유 참조 `&T`로 읽을 수는 있어도 원래 값을 마음대로 바꿀 수 없습니다. 바꾸려면 소유자가 변경 가능해야 하고 `&mut T`로 배타적으로 빌려야 합니다. '누가 소유하는가, 누가 잠시 읽는가'를 코드 옆에 적어 보세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 33 "`공유 빌림과 참조`"의 독립 예제입니다. 전체 5줄에서 `&topic`이(가) 핵심이며, 실행 결과는 `4 Rust`입니다.

```rust
fn length(text: &String) -> usize { text.len() }
fn main() {
    let topic = String::from("Rust");
    println!("{} {topic}", length(&topic));
}
```

예상 출력:

```text
4 Rust
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 `4 Rust`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `&topic`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn length(text: &String) -> usize { text.len() }
 2 | fn main() {
 3 |     let topic = String::from("Rust");
 4 |     println!("{} {topic}", length(&topic));
 5 | }
```

1. topic이 Rust를 소유합니다
2. length가 주소를 읽기 전용으로 빌립니다
3. 길이 4와 원본 Rust를 출력합니다

위 단계에서 `&topic`이(가) 빠지면 `4 Rust`이(가) 나오지 않습니다. `첫 문자열을 'Rust'에서 'Rust!'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작    |
| ---: | ----------------- |
|    1 | topic 소유        |
|    2 | &topic 빌림       |
|    3 | 길이 4            |
|    4 | topic 여전히 유효 |

위 순서대로 실행하면 최종 출력 `4 Rust`이(가) 됩니다. `topic 소유` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`let topic = String::from("Rust"); let view = &topic;`이면 `println!("{view}")` 뒤에도 `println!("{topic}")`을 쓸 수 있습니다. `view`는 글자의 주인이 아니라 잠시 읽는 길입니다. 그 참조를 쓰는 동안 원래 소유자의 데이터를 마음대로 변경할 수 없다는 제한이 함께 붙습니다.

## 결과 예측과 작은 변경

원본 코드에서 `첫 문자열을 'Rust'에서 'Rust!'로` 바꾸면 아래와 같이 됩니다.

```rust
fn length(text: &String) -> usize { text.len() }
fn main() {
    let topic = String::from("Rust!");
    println!("{} {topic}", length(&topic));
}
```

원본 출력은 `4 Rust`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `&topic`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 33의 `공유 빌림과 참조`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함.** 정상 코드에서는 `4 Rust`이(가) 출력됩니다.

- 정상 줄: `println!("{} {topic}", length(&topic));`
- 잘못된 줄: `println!("{} {topic}", length(topic.clone()));`

두 줄을 나란히 놓고 `&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `topic 소유`부터 `4 Rust`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **소유권 이동 없이 읽기 전달**은(는) 세 언어에서 같은 입력과 출력(`4 Rust`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | const char *를 넘기고 수명 책임 유지 |
| Python | 객체 참조가 전달되고 가변성에 주의   |
| Rust   | &String, 일반적으로 &str 빌림        |

C17에서는 `const char *를 넘기고 수명 책임 유지` 규칙으로 "`공유 빌림과 참조`"의 `4 Rust`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `객체 참조가 전달되고 가변성에 주의` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `&String, 일반적으로 &str 빌림` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`4 Rust` 맞히기) → 빈칸(`&topic` 채우기) → 변경(`첫 문자열을 'Rust'에서 'Rust!'로`) → 오류 수정(`참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함` 찾기) → 독립 구현(`공유 빌림과 참조을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `4 Rust` 및 `&topic` 설명과 대조하세요.

## 스스로 설명하기

- "`공유 빌림과 참조`"이(가) 필요한 상황을 `소유권 이동 없이 읽기 전달` 동작으로 설명해 보세요.
- 예제에서 `&topic`이(가) 실행되기 직전의 상태와 직후의 출력 `4 Rust`을(를) 말해 보세요.
- "`참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `소유권 이동 없이 읽기 전달` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

&String은 소유권을 가져가지 않는 공유 참조이고 호출이 끝나도 topic의 소유자는 main입니다. Day 33 "`공유 빌림과 참조`"의 예제는 `&topic`을(를) 실행해 `4 Rust`을(를) 출력합니다. "`참조를 값 이동과 똑같이 생각해 원본을 쓰지 못한다고 판단함`" 여부를 확인하고 Day 33을(를) 완료하세요.
