---
schemaVersion: 1
contentVersion: 2026.10-f
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
    hint: "[10,20]에서 시작해 60까지 순서대로 적어 보세요. Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다."
    explanation:
      1. Vec [10,20]을 만듭니다. 2. push(30)으로 [10,20,30]이 됩니다. 3. 순회해 합 60을 출력합니다. `[10,20] → [10,20,30] →
      60` 흐름으로 실제 출력 `60`이 됩니다. 핵심 `push(30)`은 가변 Vec의 맨 뒤를 바꾸는 자리에 쓰입니다.
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
    hint: 필요한 표현은 가변 벡터를 순회해 합산함 동작을 잇는 push(30)입니다.
    explanation:
      빈칸에 들어갈 표현은 'push(30)'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. Vec [10,20]을 만듭니다. 2. push(30)으로 [10,20,30]이
      됩니다. 3. 순회해 합 60을 출력합니다. `[10,20] → [10,20,30] → 60` 흐름으로 실제 출력 `60`이 됩니다. 핵심 `push(30)`은 가변 Vec의 맨 뒤를 바꾸는 자리에
      쓰입니다.
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
    hint: 처음 등장하는 숫자를 10에서 11로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '60'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '61'입니다. 원본은 `60`, 수정본은 `61`이다. 첫 변경 줄 `let mut minutes = vec![10, 20];`에서 `let mut minutes
      = vec![11, 20];`으로 첫 값을 바꾸면, 뒤에 30이 붙고 합이 61이 된다.
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
    hint:
      Vec의 원소 추가에 불변 바인딩을 사용함 상황에서 어긋나는 줄을 Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. 설명과 대조해
      보세요.
    explanation:
      틀린 줄은 `minutes.pop();`입니다. 맨 끝 20을 꺼내므로 합은 10+20이 아니라 10만 남아 `10`이 출력됩니다. 오류 분류는 잘못된 출력입니다. 합이 어긋나는
      첫 순간은 끝 원소를 제거한 호출입니다. 고친 줄 `minutes.push(30);`에서는 `가변 벡터를 순회해 합산함` 동작이 지켜집니다. `push`에는 `mut` 바인딩이 필요하므로 불변
      바인딩에서는 컴파일이 막힙니다. 정상 코드는 생성→추가→순회 합산의 순서로 `60`을 출력합니다.
    commonMistakes:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-28-vec-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 배열·리스트·Vec 회상 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 배열·리스트·Vec 회상: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn main() {\n    let mut minutes = vec![10, 20];\n    minutes.push(30);\n    println!(\"{}\", minutes.iter().sum::<i32>());\n\
      }"
    hint: "`iter()`로 합계를 구한 뒤에도 원래 Vec를 계속 쓸 수 있습니다. 빌려 읽기와 소유 이동을 구별하세요. 예상 출력과 경계 조건도 함께 적어 보세요."
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. `iter()`로 합계를 구한 뒤에도 원래 Vec를 계속 쓸 수 있습니다. 빌려 읽기와 소유 이동을 구별하세요. 같은 가변 벡터를
      순회해 합산함 동작을 구현하고 실행 결과 '60'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
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
    explanation:
      먼저 가변 Vec [10,20]이 만들어집니다. 이어서 push로 30이 붙어 [10,20,30]이 되고, iter().sum()이 합 60을 만들어 출력하므로 `60`이 됩니다.
      `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 타입과 실행이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 println!이 실제로 호출되기 때문입니다. 다른 선택지는
      이 추적과 맞지 않습니다.
  - id: quiz-day-28-vec-review-model
    question: "'배열·리스트·Vec 회상' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - Vec의 원소 추가에 불변 바인딩을 사용함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.
    answerIndex: 2
    explanation:
      Vec는 가변 길이의 연속 원소를 담는다는 뜻이고, push는 끝에 넣는다는 뜻은 길이가 하나 늘어난다는 뜻입니다. `Vec의 원소 추가에 불변 바인딩을 사용함`은 반대 사례인데,
      바꿀 수 없는 바인딩에서는 push가 컴파일 단계에서 막히기 때문입니다.
  - id: quiz-day-28-vec-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - Vec의 원소 추가에 불변 바인딩을 사용함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 먼저 확인할 실수는 `Vec의 원소 추가에 불변 바인딩을 사용함`입니다. 잘못된 코드는 실행은 되지만 `10`이라는 잘못된 출력을 냅니다. mut 선언부터 확인하세요.
  - id: quiz-day-28-vec-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 가변 벡터를 순회해 합산함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `가변 벡터를 순회해 합산함`이라는 의미와 입력·출력 계약입니다. C의 크기 고정 배열 순회와 Python의 리스트 합으로 같은 동작을
      구현하고, 실행 결과 `60`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

크기가 바뀌는 컬렉션을 비교하면 저장 용량, 길이, 인덱스 안전성의 차이를 드러낼 수 있습니다. Day 28 "`배열·리스트·Vec 회상`"에서는 Rust 코드의 실행 결과(`60`)를 따라가며, `가변 벡터를 순회해 합산함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`Vec의 원소 추가에 불변 바인딩을 사용함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 27](/learn/day-27-python-list)에서 배운 "Python list 추가와 순회" 내용을 한 문장으로 말해 보세요. 이번 "`배열·리스트·Vec 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `push(30)`입니다.

## 머릿속 그림

Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. Day 28에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `push(30)`입니다.

```text
[10,20]  →  [10,20,30]  →  60
```

위 흐름에서 `push(30)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

앞에서 배운 세 표현을 같은 그림에 놓으세요. C 배열은 크기가 정해져 있고, Python 리스트는 항목을 추가할 수 있으며, Rust `Vec`도 `push`로 늘릴 수 있습니다. `vec![10,20]`에 `push(30)`을 하면 `[10,20,30]`입니다. `iter().sum()`은 원소를 순서대로 읽어 60을 만듭니다.

Rust에서 `push`를 하려면 `let mut values`처럼 바꿀 수 있어야 합니다. `iter()`는 각 값을 빌려 읽으므로 합계를 구한 뒤에도 원래 Vec를 계속 쓸 수 있습니다. 세 언어 모두 '항목을 방문해 더한다'는 동작은 같지만 크기와 수정 규칙은 다릅니다.

앞에서 배운 세 표현을 같은 그림에 놓으세요. C 배열은 크기가 정해져 있고, Python 리스트는 항목을 추가할 수 있으며, Rust `Vec`도 `push`로 늘릴 수 있습니다. `vec![10,20]`에 `push(30)`을 하면 `[10,20,30]`입니다. `iter().sum()`은 원소를 순서대로 읽어 60을 만듭니다.

Rust에서 `push`를 하려면 `let mut values`처럼 바꿀 수 있어야 합니다. `iter()`는 각 값을 빌려 읽으므로 합계를 구한 뒤에도 원래 Vec를 계속 쓸 수 있습니다. 세 언어 모두 항목을 방문해 더한다는 동작은 같지만 크기와 수정 규칙은 다릅니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 28 "`배열·리스트·Vec 회상`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `push(30)`이며, 실행 결과는 `60`입니다.

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

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `60`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `push(30)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```rust
 1 | fn main() {
 2 |     let mut minutes = vec![10, 20];
 3 |     minutes.push(30);
 4 |     println!("{}", minutes.iter().sum::<i32>());
 5 | }
```

1. Vec [10,20]을 만듭니다
2. push(30)으로 [10,20,30]이 됩니다
3. 순회해 합 60을 출력합니다

`push(30)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [10,20]        |
|    2 | [10,20,30]     |
|    3 | 60             |

위 순서대로 실행한 최종 출력은 `60`입니다. `[10,20]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

Python에서 `[10,20]`에 30을 붙이면 `[10,20,30]`, Rust에서 `let mut v = vec![10,20]; v.push(30);`을 해도 같은 세 값을 얻습니다. Rust의 `push`는 Vec를 직접 바꾸므로 `mut`가 빠지면 컴파일되지 않습니다. C 고정 배열은 길이 2로 선언한 후 세 번째 칸에 바로 쓰면 안 됩니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `60`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```rust
fn main() {
    let mut minutes = vec![11, 20];
    minutes.push(30);
    println!("{}", minutes.iter().sum::<i32>());
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
61
```

원본은 `60`, 수정본은 `61`이다. 첫 변경 줄 `let mut minutes = vec![10, 20];`에서 `let mut minutes = vec![11, 20];`으로 첫 값을 바꾸면, 뒤에 30이 붙고 합이 61이 된다.

## 자주 틀리는 지점

**확인할 실수: Vec의 원소 추가에 불변 바인딩을 사용함.** 정상 코드의 실행 결과는 `60`입니다.

- 정상 줄: `minutes.push(30);`
- 잘못된 줄: `minutes.pop();`

두 줄을 나란히 놓으면 정상 줄 `minutes.push(30);`이 `Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다.` 설명과 맞고, 잘못된 줄은 `Vec의 원소 추가에 불변 바인딩을 사용함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `[10,20]`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `가변 벡터를 순회해 합산함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙          |
| ------ | ----------------------------------- |
| C17    | int 배열·용량·현재 길이를 따로 유지 |
| Python | list.append와 sum                   |
| Rust   | let mut Vec와 push, iter().sum()    |

C17에서는 `int 배열·용량·현재 길이를 따로 유지` 규칙을 적용합니다. "`배열·리스트·Vec 회상`" 수업의 실행 결과(`60`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `list.append와 sum` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `let mut Vec와 push, iter().sum()` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`push(30)` 채우기) → 변경(`처음 등장하는 숫자를 10에서 11로`) → 오류 수정(`Vec의 원소 추가에 불변 바인딩을 사용함` 찾기) → 독립 구현(`'배열·리스트·Vec 회상' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `push(30)` 설명과 대조하세요.

## 스스로 설명하기

- "`배열·리스트·Vec 회상`" 수업이 필요한 이유는 `가변 벡터를 순회해 합산함` 동작으로 설명해 보세요.
- 예제에서 `push(30)` 부분 실행 직전의 상태와 직후의 출력(`60`)을 말해 보세요.
- "`Vec의 원소 추가에 불변 바인딩을 사용함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `가변 벡터를 순회해 합산함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Vec는 가변 길이의 연속 원소를 담고 push는 끝에 넣습니다. sum은 iterator의 값을 더합니다. Day 28 "`배열·리스트·Vec 회상`" 예제의 핵심 부분은 `push(30)`이며, 실행 결과는 `60`입니다. "`Vec의 원소 추가에 불변 바인딩을 사용함`" 여부를 확인하고 Day 28 수업을 완료하세요.
