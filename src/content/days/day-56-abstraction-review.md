---
schemaVersion: 1
contentVersion: 2026.10-c
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
    hint: Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
    explanation: s.minutes=30  →  기대값=30  →  통과. 따라서 출력은 '검증 완료'입니다.
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-56-abstraction-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 구조체·enum·테스트 회상의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: assert_eq!"
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    _____(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    hint: Session을 초기화합니다
    explanation: 빈칸에는 'assert_eq!'이 들어갑니다. Session을 초기화합니다 필드 값과 기대값이 같아 단언이 통과합니다 검증 완료를 출력합니다
    commonMistakes:
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-56-abstraction-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로 바꿔 보세요. 출력도 먼저 예측하세요.
    starter:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:30};\n    assert_eq!(s.minutes,30);\n\
      \    println!(\"검증 완료\");\n}"
    answer:
      "struct Session { minutes: u32 }\nfn main() {\n    let s=Session{minutes:31};\n    assert_eq!(s.minutes,31);\n\
      \    println!(\"검증 완료\");\n}"
    hint: 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation: 예시 답안에서는 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로 바꿨습니다. 원본 출력은 '검증 완료'입니다. 바뀐 코드의 결과는 실행해 확인하세요.
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
    hint: Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. Session을 초기화합니다 필드 값과 기대값이 같아 단언이 통과합니다 검증 완료를 출력합니다
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
    hint: Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 Session을 초기화합니다 필드 값과 기대값이 같아 단언이 통과합니다 검증 완료를 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
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
    explanation: s.minutes=30  →  기대값=30  →  통과 순서로 실행되어 '검증 완료'을 출력합니다.
  - id: quiz-day-56-abstraction-review-model
    question: 구조체·enum·테스트 회상을 이해하는 데 맞는 설명은?
    choices:
      - Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다.
  - id: quiz-day-56-abstraction-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-56-abstraction-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 구조화된 데이터에 회귀 테스트 추가라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 구조화된 데이터에 회귀 테스트 추가라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

데이터 모델과 테스트를 함께 점검해 세 언어에서 같은 상태를 만들었는지 검증합니다. 이번 Day는 새 문법을 많이 추가하는 대신 앞선 개념을 떠올리고 작은 변경 실험으로 오개념을 확인합니다. 코드를 가린 채 먼저 답하고, 모른 부분만 선행 Day로 돌아가 보세요.

## 시작 전에 확인할 것

바로 앞선 [Day 55](/learn/day-55-module-test)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 다음 흐름을 눈으로 확인하세요.

```text
s.minutes=30  →  기대값=30  →  통과
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

`Session { minutes: 30 }`은 구조체 한 개를 만들고, `assert_eq!(s.minutes, 30)`은 실제 필드값과 기대값을 비교합니다. 구조체는 관련 데이터를 묶고 enum은 가능한 상태를 한정합니다. 둘을 함께 쓰면 '어떤 기록인지'와 '어떤 결과 상태인지'가 분명해집니다.

`assert_eq!`의 두 값이 다르면 테스트가 실패하고, 같으면 이어 진행합니다. `minutes`를 31로 바꾸고 기대값을 30으로 남겨 실패 메시지를 본 다음 둘 다 31로 맞춰 보세요. 테스트는 실행 전부터 정답을 정확히 적어 두는 약속입니다.

## 문법을 예제로 보기

아래는 Rust 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

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

이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `assert_eq!`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. Session을 초기화합니다
2. 필드 값과 기대값이 같아 단언이 통과합니다
3. 검증 완료를 출력합니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | s.minutes=30   |
|    2 | 기대값=30      |
|    3 | 통과           |

마지막 상태에서 화면에 표시되는 결과는 `검증 완료`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 초기 minutes 값과 assert_eq!의 기대값을 함께 30에서 31로 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄.** Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **구조화된 데이터에 회귀 테스트 추가**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | struct와 assert.h          |
| Python | dataclass와 assert         |
| Rust   | struct와 assert_eq!        |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 데이터 모델과 테스트를 함께 점검해 세 언어에서 같은 상태를 만들었는지 검증합니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

Session의 minutes는 u32이고 assert_eq!가 실제 값 30과 기대 30을 비교합니다. 예시의 출력은 `검증 완료`입니다. 오류를 찾을 때는 **검사하지 않은 예시 출력만 보고 구현이 맞다고 결론 냄** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
