---
schemaVersion: 1
contentVersion: 2026.10-c
id: day-28-vec-review
courseId: crp-92
phaseId: phase-03
dayNumber: 28
date: "2026-10-28"
title: 배열·리스트·Vec 회상
summary: 크기가 바뀌는 컬렉션을 비교하면 저장 용량, 길이, 인덱스 안전성의 차이를 드러낼 수 있습니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 50
prerequisites:
  - day-27-python-list
learningObjectives:
  - "'배열·리스트·Vec 회상' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: Vec의 원소 추가에 불변 바인딩을 사용함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - vec review
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
  - id: ex-day-28-vec-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [10,20]에서 시작해 계산하세요.
    starter:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    answer: "60"
    hint: Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
    explanation: "[10,20]  →  [10,20,30]  →  60. 따라서 출력은 '60'입니다."
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-28-vec-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 배열·리스트·Vec 회상의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: push(30)"
    starter:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes._____;\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    answer:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    hint: Vec [10,20]을 만듭니다
    explanation: 빈칸에는 'push(30)'이 들어갑니다. Vec [10,20]을 만듭니다 push(30)으로 [10,20,30]이 됩니다 순회해 합 60을 출력합니다
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-28-vec-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 10에서 11로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    answer:
      "fn main() {\n    let mut minutes = vec![11, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    hint: 처음 등장하는 숫자를 10에서 11로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 10에서 11로 바꿨습니다. 원래 출력은 '60'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-28-vec-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 Vec의 원소 추가에 불변 바인딩을 사용함 상황을 확인하세요.
    starter:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.pop();\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    answer:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    hint: Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. Vec [10,20]을 만듭니다 push(30)으로 [10,20,30]이 됩니다 순회해 합 60을 출력합니다
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-28-vec-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '배열·리스트·Vec 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 배열·리스트·Vec 회상: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    hint: Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 Vec [10,20]을 만듭니다 push(30)으로 [10,20,30]이 됩니다 순회해 합 60을 출력합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-28-vec-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "60"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: "[10,20]  →  [10,20,30]  →  60 순서로 실행되어 '60'을 출력합니다."
  - id: quiz-day-28-vec-review-model
    question: 배열·리스트·Vec 회상을 이해하는 데 맞는 설명은?
    choices:
      - Vec의 원소 추가에 불변 바인딩을 사용함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
    answerIndex: 2
    explanation: Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
  - id: quiz-day-28-vec-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: Vec의 원소 추가에 불변 바인딩을 사용함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-28-vec-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 가변 벡터를 순회해 합산함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 가변 벡터를 순회해 합산함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

크기가 바뀌는 컬렉션을 비교하면 저장 용량, 길이, 인덱스 안전성의 차이를 드러낼 수 있습니다. 이번 Day는 새 문법을 많이 추가하는 대신 앞선 개념을 떠올리고 작은 변경 실험으로 오개념을 확인합니다. 코드를 가린 채 먼저 답하고, 모른 부분만 선행 Day로 돌아가 보세요.

## 시작 전에 확인할 것

바로 앞선 [Day 27](/learn/day-27-python-list)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. 다음 흐름을 눈으로 확인하세요.

```text
[10,20]  →  [10,20,30]  →  60
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

앞에서 배운 세 표현을 같은 그림에 놓으세요. C 배열은 크기가 정해져 있고, Python 리스트는 항목을 추가할 수 있으며, Rust `Vec`도 `push`로 늘릴 수 있습니다. `vec![10,20]`에 `push(30)`을 하면 `[10,20,30]`입니다. `iter().sum()`은 원소를 순서대로 읽어 60을 만듭니다.

Rust에서 `push`를 하려면 `let mut values`처럼 바꿀 수 있어야 합니다. `iter()`는 각 값을 빌려 읽으므로 합계를 구한 뒤에도 원래 Vec를 계속 쓸 수 있습니다. 세 언어 모두 '항목을 방문해 더한다'는 동작은 같지만 크기와 수정 규칙은 다릅니다.

## 문법을 예제로 보기

아래는 Rust 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```rust
fn main() {
    let mut minutes = vec![10, 20];
    minutes.push(30);
    println!("{}", minutes.iter().sum::<i32>());
}
```

예상 출력:

```text
60
```

이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `push(30)`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. Vec [10,20]을 만듭니다
2. push(30)으로 [10,20,30]이 됩니다
3. 순회해 합 60을 출력합니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [10,20]        |
|    2 | [10,20,30]     |
|    3 | 60             |

마지막 상태에서 화면에 표시되는 결과는 `60`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 다른 예제로 다시 이해하기

Python에서 `[10,20]`에 30을 붙이면 `[10,20,30]`, Rust에서 `let mut v = vec![10,20]; v.push(30);`을 해도 같은 세 값을 얻습니다. Rust의 `push`는 Vec를 직접 바꾸므로 `mut`가 빠지면 컴파일되지 않습니다. C 고정 배열은 길이 2로 선언한 후 세 번째 칸에 바로 쓰면 안 됩니다.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 10에서 11로 바꾼 뒤 결과가 바뀌는지 예측하고, 같다면 왜 같은지 설명하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: Vec의 원소 추가에 불변 바인딩을 사용함.** Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **가변 벡터를 순회해 합산함**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙          |
| ------ | ----------------------------------- |
| C17    | int 배열·용량·현재 길이를 따로 유지 |
| Python | list.append와 sum                   |
| Rust   | let mut Vec와 push, iter().sum()    |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 크기가 바뀌는 컬렉션을 비교하면 저장 용량, 길이, 인덱스 안전성의 차이를 드러낼 수 있습니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? Vec의 원소 추가에 불변 바인딩을 사용함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. 예시의 출력은 `60`입니다. 오류를 찾을 때는 **Vec의 원소 추가에 불변 바인딩을 사용함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
