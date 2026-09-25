---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-22-rust-return
courseId: crp-92
phaseId: phase-02
dayNumber: 22
date: "2026-10-22"
title: Rust 표현식과 함수 반환
summary: Rust에서는 마지막 표현식이 함수 반환값이 될 수 있어 문장과 표현식의 차이를 알아야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-21-functions-review
learningObjectives:
  - "'Rust 표현식과 함수 반환' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust return
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
  - id: ex-day-22-rust-return-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? n=7에서 시작해 계산하세요.
    starter: "fn doubled(n: i32) -> i32 {\n    n * 2\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    answer: "14"
    hint: 본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.
    explanation: n=7  →  7*2=14  →  반환 14. 따라서 출력은 '14'입니다.
    commonMistakes:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-22-rust-return-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Rust 표현식과 함수 반환' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: n * 2"
    starter: "fn doubled(n: i32) -> i32 {\n    _____\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    answer: "fn doubled(n: i32) -> i32 {\n    n * 2\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    hint: doubled(7)에 n=7을 묶습니다
    explanation: 빈칸에 들어갈 표현은 'n * 2'입니다. doubled(7)에 n=7을 묶습니다 마지막 표현식이 14입니다 main의 println!이 14를 출력합니다
    commonMistakes:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-22-rust-return-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 2에서 3로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "fn doubled(n: i32) -> i32 {\n    n * 2\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    answer: "fn doubled(n: i32) -> i32 {\n    n * 3\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 2에서 3로."
    explanation: 바꾼 뒤 출력은 '21'입니다. 원본 출력 '14'에서 달라졌습니다. 다른 줄(n * 2 → n * 3)에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-22-rust-return-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨 상황을 확인하세요.
    starter: "fn doubled(n: i32) -> i32 {\n    n * 3\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    answer: "fn doubled(n: i32) -> i32 {\n    n * 2\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    hint: 본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. doubled(7)에 n=7을 묶습니다 마지막 표현식이 14입니다 main의 println!이 14를 출력합니다
    commonMistakes:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-22-rust-return-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust 표현식과 함수 반환' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust 표현식과 함수 반환: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: "fn doubled(n: i32) -> i32 {\n    n * 2\n}\nfn main() { println!(\"{}\", doubled(7)); }"
    hint: 본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 doubled(7)에 n=7을 묶습니다 마지막 표현식이 14입니다 main의 println!이 14를 출력합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-22-rust-return-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "14"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: n=7  →  7*2=14  →  반환 14 순서로 실행되어 출력은 '14'입니다.
  - id: quiz-day-22-rust-return-model
    question: "'Rust 표현식과 함수 반환' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.
    answerIndex: 2
    explanation: 본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.
  - id: quiz-day-22-rust-return-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-22-rust-return-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 표현식 결과를 반환함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 표현식 결과를 반환함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

Rust에서는 마지막 표현식이 함수 반환값이 될 수 있어 문장과 표현식의 차이를 알아야 합니다. Day 22 "`Rust 표현식과 함수 반환`"에서는 Rust 코드의 실행 결과(`14`)를 따라가며, `표현식 결과를 반환함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 21](/learn/day-21-functions-review)에서 배운 "반복과 함수 회상" 내용을 한 문장으로 말해 보세요. 이번 "`Rust 표현식과 함수 반환`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `n * 2`입니다.

## 머릿속 그림

본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다. Day 22에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `n * 2`입니다.

```text
n=7  →  7*2=14  →  반환 14
```

위 흐름에서 `n * 2` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `14`입니다.

## 천천히 풀어보기

Rust 함수 `fn twice(n: i32) -> i32`에서 화살표 뒤는 반환 타입입니다. 본문 마지막 `n * 2`는 세미콜론이 없으므로 값으로 평가되어 호출자에게 돌아갑니다. `n * 2;`로 바꾸면 그 줄은 값을 버리는 문장이 되어 기대한 `i32`를 돌려주지 못합니다.

`let answer = twice(15);`라면 함수 내부 `n=15`, 곱한 값 30, 호출자 `answer=30` 순서로 따라가세요. 명시적으로 `return n * 2;`라고 쓸 수도 있지만 마지막 표현식 방식에 익숙해지면 Rust의 `if`와 `match`도 값을 만든다는 점이 이해됩니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 22 "`Rust 표현식과 함수 반환`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `n * 2`이며, 실행 결과는 `14`입니다.

```rust
fn doubled(n: i32) -> i32 {
    n * 2
}
fn main() { println!("{}", doubled(7)); }
```

예상 출력:

```text
14
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `14`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `n * 2`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | fn doubled(n: i32) -> i32 {
 2 |     n * 2
 3 | }
 4 | fn main() { println!("{}", doubled(7)); }
```

1. doubled(7)에 n=7을 묶습니다
2. 마지막 표현식이 14입니다
3. main의 println!이 14를 출력합니다

`n * 2` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | n=7            |
|    2 | 7*2=14         |
|    3 | 반환 14        |

위 순서대로 실행한 최종 출력은 `14`입니다. `n=7` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`fn triple(n: i32) -> i32 { n * 3 }`에서 `triple(4)`는 12입니다. 마지막 줄을 `{ n * 3; }`으로 바꾸면 계산을 하고 버리므로 `i32`를 반환하겠다는 선언과 맞지 않습니다. `return n * 3;`을 쓰면 다시 정수 12를 돌려줄 수 있습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `14`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
fn doubled(n: i32) -> i32 {
    n * 3
}
fn main() { println!("{}", doubled(7)); }
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
21
```

원본과 달라졌습니다. 원본 출력은 `14`입니다. 다른 줄(`n * 2` → `n * 3`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`n=7` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨.** 정상 코드의 실행 결과는 `14`입니다.

- 정상 줄: `n * 2`
- 잘못된 줄: `n * 3`

두 줄을 나란히 놓고 `본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `n=7`부터 `14`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `표현식 결과를 반환함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | return n * 2; 필수         |
| Python | return n * 2 명시          |
| Rust   | 마지막 표현식 n * 2        |

C17에서는 `return n * 2; 필수` 규칙을 적용합니다. "`Rust 표현식과 함수 반환`" 수업의 실행 결과(`14`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `return n * 2 명시` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `마지막 표현식 n * 2` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`14` 맞히기) → 빈칸(`n * 2` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨` 찾기) → 독립 구현(`'Rust 표현식과 함수 반환' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `14` 및 `n * 2` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust 표현식과 함수 반환`" 수업이 필요한 이유는 `표현식 결과를 반환함` 동작으로 설명해 보세요.
- 예제에서 `n * 2` 부분 실행 직전의 상태와 직후의 출력(`14`)을 말해 보세요.
- "`마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `표현식 결과를 반환함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

본문 마지막 n*2는 세미콜론이 없어서 i32 값을 돌려줍니다. Day 22 "`Rust 표현식과 함수 반환`" 예제의 핵심 부분은 `n * 2`이며, 실행 결과는 `14`입니다. "`마지막 표현식에 세미콜론을 붙여 반환형이 ()가 됨`" 여부를 확인하고 Day 22 수업을 완료하세요.
