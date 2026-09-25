---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-56-abstraction-review
courseId: crp-92
phaseId: phase-05
dayNumber: 56
date: "2026-11-25"
title: 구조체·enum·테스트 회상
summary: 데이터 모델과 테스트를 함께 점검해 세 언어에서 같은 상태를 만들었는지 검증합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 50
prerequisites:
  - day-55-module-test
learningObjectives:
  - "'구조체·enum·테스트 회상' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - abstraction review
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
  - id: ex-day-56-abstraction-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? s.minutes=30에서 시작해 계산하세요.
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer: 검증 완료
    hint: Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 설명을 떠올리고 `s.minutes=30` 단계부터 순서대로 적어 보세요.
    explanation:
      s.minutes=30  →  기대값=30  →  통과 순서로 실행됩니다. `assert_eq!` 부분이 `통과` 단계를 확정해 최종 출력 '검증 완료'가 됩니다. 이 흐름을
      떠올리면 `구조화된 데이터에 회귀 테스트 추가` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-56-abstraction-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'구조체·enum·테스트 회상' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: assert_eq!"
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    _____(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    hint: 힌트 문장을 완전하게 읽으면 `Session을 초기화합니다` 단계에 필요한 표현이 `assert_eq!`입니다.
    explanation:
      빈칸에 들어갈 표현은 'assert_eq!'입니다. `assert_eq!(s.minutes,30);` 줄을 완성해야 `구조화된 데이터에 회귀 테스트 추가` 동작이 이어져 실행
      결과 '검증 완료'가 됩니다. 힌트의 첫 단계 `Session을 초기화합니다`이 바로 이 줄입니다. 이어서 필드 값과 기대값이 같아 단언이 통과합니다 검증 완료를 출력합니다 순서로 진행됩니다.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-56-abstraction-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:31};\n    assert_eq!(s.minutes,31);\n\
      \    println!(\"검증 완료\");\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로."
    explanation:
      바꾼 뒤 출력은 '검증 완료'입니다. 원본 출력 '검증 완료'와 같습니다. 바뀐 줄은 `let s=Session{minutes:31};`입니다. 바뀐 프로그램도 `s.minutes=30`
      단계에서 시작해 바뀐 줄을 지나 최종 `검증 완료`로 끝납니다. minutes와 기대값을 함께 바꿔 assert가 그대로 통과하므로 출력이 같습니다. 출력은 같지만 바뀐 줄 부분의 중간 값은 달라졌다가
      같은 최종 값으로 이어진다는 점을 위 추적 순서와 대조해 확인할 수 있습니다.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-56-abstraction-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄 상황을 확인하세요.
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    println!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    hint:
      Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 설명과 어긋나는 줄을 찾으세요. `검사하지 않은 예시 출력만 보고 구현이 맞다고
      결론 냄` 상황이 단서가 됩니다.
    explanation:
      틀린 줄은 `println!(s.minutes,30);`입니다. 여기서는 `println!`을 써서 `assert_eq!` 동작이 깨집니다. 이대로 실행하면 `검사하지 않은
      예시 출력만 보고 구현이 맞다고 결론 냄` 문제가 생겨 원본 추적 `s.minutes=30  →  기대값=30  →  통과`대로 '검증 완료'가 나오지 않습니다. 고친 줄 `assert_eq!(s.minutes,30);`에서는
      `assert_eq!`가 `구조화된 데이터에 회귀 테스트 추가` 동작을 지켜 '검증 완료'까지 도달합니다.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-56-abstraction-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '구조체·enum·테스트 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 구조체·enum·테스트 회상: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    hint:
      Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께
      적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `assert_eq!` 부분이 `구조화된 데이터에 회귀 테스트 추가` 동작을 지켜 실행 결과 '검증 완료'가 됩니다. 같은 개념을 다른
      입력으로 바꿔도 `assert_eq!`부터 `통과`까지 추적할 수 있으면 정답입니다. `검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄` 상황과 빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-56-abstraction-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - 검증 완료
    answerIndex: 2
    explanation:
      s.minutes=30  →  기대값=30  →  통과 순서로 실행되어 출력은 '검증 완료'입니다. `assert_eq!` 부분이 마지막 단계를 확정하므로 다른 선택지는 이
      추적과 맞지 않습니다.
  - id: quiz-day-56-abstraction-review-model
    question: "'구조체·enum·테스트 회상' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 이 설명이 맞는 이유는 `구조화된 데이터에 회귀 테스트 추가` 동작을
      지키는 조건과 같기 때문입니다. `검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-56-abstraction-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄. 이 실수가 나오면 원본 추적 `s.minutes=30 → 기대값=30 → 통과`대로 '검증 완료'가 나오지 않으므로
      먼저 확인해야 합니다.
  - id: quiz-day-56-abstraction-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 구조화된 데이터에 회귀 테스트 추가라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 `구조화된 데이터에 회귀 테스트 추가` 목적과 입력·출력은 유지합니다. 실행 결과 '검증 완료'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

데이터 모델과 테스트를 함께 점검해 세 언어에서 같은 상태를 만들었는지 검증합니다. Day 56 "`구조체·enum·테스트 회상`"에서는 Rust 코드의 실행 결과(`검증 완료`)를 따라가며, `구조화된 데이터에 회귀 테스트 추가` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 55](/learn/day-55-module-test)에서 배운 "Python 모듈화와 assert" 내용을 한 문장으로 말해 보세요. 이번 "`구조체·enum·테스트 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `assert_eq!`입니다.

## 머릿속 그림

Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. Day 56에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `assert_eq!`입니다.

```text
s.minutes=30  →  기대값=30  →  통과
```

위 흐름에서 `assert_eq!` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `검증 완료`입니다.

## 천천히 풀어보기

`Session { minutes: 30 }`은 구조체 한 개를 만들고, `assert_eq!(s.minutes, 30)`은 실제 필드값과 기대값을 비교합니다. 구조체는 관련 데이터를 묶고 enum은 가능한 상태를 한정합니다. 둘을 함께 쓰면 '어떤 기록인지'와 '어떤 결과 상태인지'가 분명해집니다.

`assert_eq!`의 두 값이 다르면 테스트가 실패하고, 같으면 이어 진행합니다. `minutes`를 31로 바꾸고 기대값을 30으로 남겨 실패 메시지를 본 다음 둘 다 31로 맞춰 보세요. 테스트는 실행 전부터 정답을 정확히 적어 두는 약속입니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 56 "`구조체·enum·테스트 회상`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `assert_eq!`이며, 실행 결과는 `검증 완료`입니다.

```rust
struct Session { minutes: u32 }
fn main() {
    let s=Session{minutes:30};
    assert_eq!(s.minutes,30);
    println!("검증 완료");
}
```

예상 출력:

```text
검증 완료
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `검증 완료`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `assert_eq!`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | struct Session { minutes: u32 }
 2 | fn main() {
 3 |     let s=Session{minutes:30};
 4 |     assert_eq!(s.minutes,30);
 5 |     println!("검증 완료");
 6 | }
```

1. Session을 초기화합니다
2. 필드 값과 기대값이 같아 단언이 통과합니다
3. 검증 완료를 출력합니다

`assert_eq!` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | s.minutes=30   |
|    2 | 기대값=30      |
|    3 | 통과           |

위 순서대로 실행한 최종 출력은 `검증 완료`입니다. `s.minutes=30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`let s=Session {minutes: 31}; assert_eq!(s.minutes,31);`은 통과합니다. 오른쪽 기대값만 30으로 되돌리면 실패하므로 어떤 값이 실제이고 어떤 값이 기대인지 메시지에서 확인하세요. 테스트를 통과시키려고 실제값과 기대값을 모두 아무 숫자로 바꾸는 것은 문제의 계약을 검증하지 못합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `검증 완료`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
struct Session { minutes: u32 }
fn main() {
    let s=Session{minutes:31};
    assert_eq!(s.minutes,31);
    println!("검증 완료");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
검증 완료
```

바꾼 뒤 출력도 `검증 완료`입니다. minutes와 기대값을 함께 바꿔 assert가 그대로 통과하므로 출력이 같습니다. 바뀐 프로그램도 `s.minutes=30` 단계에서 시작해 `let s=Session{minutes:31};` 줄을 지나 최종 `검증 완료`로 끝납니다. 원본 추적 `s.minutes=30  →  기대값=30  →  통과`와 바뀐 줄 이후를 순서대로 놓으면 출력은 같아도 중간 값이 어디서 달라졌다가 합쳐지는지 확인할 수 있습니다.

## 자주 틀리는 지점

**확인할 실수: 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄.** 정상 코드의 실행 결과는 `검증 완료`입니다.

- 정상 줄: `assert_eq!(s.minutes,30);`
- 잘못된 줄: `println!(s.minutes,30);`

두 줄을 나란히 놓으면 정상 줄 `assert_eq!(s.minutes,30);`이 `Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.` 설명과 맞고, 잘못된 줄은 `검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄` 쪽으로 어긋납니다. 결과가 예상과 다르면 `s.minutes=30`부터 `검증 완료`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `구조화된 데이터에 회귀 테스트 추가`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | struct와 assert.h          |
| Python | dataclass와 assert         |
| Rust   | struct와 assert_eq!        |

C17에서는 `struct와 assert.h` 규칙을 적용합니다. "`구조체·enum·테스트 회상`" 수업의 실행 결과(`검증 완료`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `dataclass와 assert` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `struct와 assert_eq!` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`검증 완료` 맞히기) → 빈칸(`assert_eq!` 채우기) → 변경(`초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로`) → 오류 수정(`검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄` 찾기) → 독립 구현(`'구조체·enum·테스트 회상' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `검증 완료` 및 `assert_eq!` 설명과 대조하세요.

## 스스로 설명하기

- "`구조체·enum·테스트 회상`" 수업이 필요한 이유는 `구조화된 데이터에 회귀 테스트 추가` 동작으로 설명해 보세요.
- 예제에서 `assert_eq!` 부분 실행 직전의 상태와 직후의 출력(`검증 완료`)을 말해 보세요.
- "`검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `구조화된 데이터에 회귀 테스트 추가` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. Day 56 "`구조체·enum·테스트 회상`" 예제의 핵심 부분은 `assert_eq!`이며, 실행 결과는 `검증 완료`입니다. "`검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄`" 여부를 확인하고 Day 56 수업을 완료하세요.
