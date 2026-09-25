---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-44-mutable-arguments
courseId: crp-92
phaseId: phase-04
dayNumber: 44
date: "2026-11-13"
title: Python 함수의 가변 인자
summary: 함수 호출 뒤 원본 리스트가 바뀌는 이유를 알아야 예상치 못한 부작용을 막습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-43-output-parameter
learningObjectives:
  - "'Python 함수의 가변 인자' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - mutable arguments
  - execution trace
  - language transfer
runnerMode: python
reviewOffsets:
  - 1
  - 3
  - 7
  - 14
  - 30
sample: false
exercises:
  - id: ex-day-44-mutable-arguments-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? values에서 시작해 계산하세요.
    starter: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "[10, 30]"
    hint: 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
    explanation: values → [10]  →  items → 같은 객체  →  append  →  [10,30]. 따라서 출력은 '[10, 30]'입니다.
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-44-mutable-arguments-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python 함수의 가변 인자의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: items.append(30)"
    starter: "def add_session(items):\n    _____\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: values가 [10]을 참조합니다
    explanation: 빈칸에는 'items.append(30)'이 들어갑니다. values가 [10]을 참조합니다 items가 같은 객체를 가리킵니다 append 뒤 [10,30]이 됩니다
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-44-mutable-arguments-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "def add_session(items):\n    items.append(31)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 30에서 31로 바꿨습니다. 원래 출력은 '[10, 30]'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이
      같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-44-mutable-arguments-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함 상황을 확인하세요.
    starter: "def add_session(items):\n    items = [30]\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. values가 [10]을 참조합니다 items가 같은 객체를 가리킵니다 append 뒤 [10,30]이 됩니다
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-44-mutable-arguments-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python 함수의 가변 인자' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 함수의 가변 인자: 직접 구현"
    answer: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 values가 [10]을 참조합니다 items가 같은 객체를 가리킵니다 append 뒤 [10,30]이 됩니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-44-mutable-arguments-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "[10, 30]"
    answerIndex: 2
    explanation: values → [10]  →  items → 같은 객체  →  append  →  [10,30] 순서로 실행되어 '[10, 30]'을 출력합니다.
  - id: quiz-day-44-mutable-arguments-model
    question: Python 함수의 가변 인자을 이해하는 데 맞는 설명은?
    choices:
      - 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
  - id: quiz-day-44-mutable-arguments-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-44-mutable-arguments-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 가변 객체의 공유 부작용 구분라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 가변 객체의 공유 부작용 구분라는 목적과 입력·출력은 유지합니다.
playgroundSource: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
---

## 오늘 배울 이유

함수 호출 뒤 원본 리스트가 바뀌는 이유를 알아야 예상치 못한 부작용을 막습니다. Day 44 "`Python 함수의 가변 인자`"에서는 Python 코드가 `[10, 30]`을(를) 만드는 과정을 따라가며, 가변 객체의 공유 부작용 구분 동작이 왜 필요한지 확인합니다. 가변 객체의 공유 부작용 구분을(를) 빠뜨리면 `매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 43](/learn/day-43-output-parameter)에서는 "C 포인터로 결과 돌려주기"을(를) 배웠습니다. "C 포인터로 결과 돌려주기"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Python 함수의 가변 인자`"에서 새로 달라지는 조건을 찾아보세요. Day 44의 답은 `[10, 30]`이며, 핵심 표현은 `items.append(30)`입니다.

## 머릿속 그림

함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. Day 44에서는 아래 흐름 순서대로 상태가 바뀌며, `items.append(30)`이(가) 결과를 가릅니다.

```text
values → [10]  →  items → 같은 객체  →  append  →  [10,30]
```

위 흐름에서 `items.append(30)`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[10, 30]`입니다.

## 천천히 풀어보기

Python 함수에 리스트를 넘기면 함수 매개변수가 호출자와 같은 리스트를 참조할 수 있습니다. `items.append(30)`은 그 리스트 자체를 변경해서 호출자 `values`에도 30이 보입니다. 반면 함수 안에서 `items = [30]`은 지역 이름을 새 리스트에 붙이므로 원래 `values` 자체를 바꾸지 않습니다.

이 차이를 `append` 실행 직후와 재할당 직후로 나눠 손으로 그려 보세요. 원래 입력을 보존해야 한다면 함수 안에서 `items.copy()`를 사용해 별도의 바깥 리스트를 만들고 반환할 수 있습니다. 안에 다른 리스트가 들어 있다면 얕은 복사의 한계도 기억하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 44 "`Python 함수의 가변 인자`"의 독립 예제입니다. 전체 5줄에서 `items.append(30)`이(가) 핵심이며, 실행 결과는 `[10, 30]`입니다.

```python
def add_session(items):
    items.append(30)
values = [10]
add_session(values)
print(values)
```

예상 출력:

```text
[10, 30]
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `[10, 30]`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `items.append(30)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | def add_session(items):
 2 |     items.append(30)
 3 | values = [10]
 4 | add_session(values)
 5 | print(values)
```

1. values가 [10]을 참조합니다
2. items가 같은 객체를 가리킵니다
3. append 뒤 [10,30]이 됩니다

위 단계에서 `items.append(30)`이(가) 빠지면 `[10, 30]`이(가) 나오지 않습니다. `처음 등장하는 숫자를 30에서 31로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | values         |
|    2 | [10]           |
|    3 | items          |
|    4 | 같은 객체      |
|    5 | append         |
|    6 | [10,30]        |

위 순서대로 실행하면 최종 출력 `[10, 30]`이(가) 됩니다. `values` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`values=[1]; add(values)`에서 함수 `add(items)`가 `items.append(2)`를 호출하면 values는 `[1,2]`입니다. 하지만 함수에서 `items = [2]`만 하면 호출자 values는 `[1]`입니다. **같은 리스트를 바꾸는가, 지역 이름을 다시 연결하는가**를 구분해서 호출 전후의 그림을 그리세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 30에서 31로` 바꾸면 아래와 같이 됩니다.

```python
def add_session(items):
    items.append(31)
values = [10]
add_session(values)
print(values)
```

원본 출력은 `[10, 30]`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `items.append(30)`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 44의 `Python 함수의 가변 인자`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함.** 정상 코드에서는 `[10, 30]`이(가) 출력됩니다.

- 정상 줄: `items.append(30)`
- 잘못된 줄: `items = [30]`

두 줄을 나란히 놓고 `함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `values`부터 `[10, 30]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **가변 객체의 공유 부작용 구분**은(는) 세 언어에서 같은 입력과 출력(`[10, 30]`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | int *와 명시적 포인터 전달      |
| Python | 가변 객체 참조를 전달           |
| Rust   | &mut Vec<i32>를 명시적으로 빌림 |

C17에서는 `int *와 명시적 포인터 전달` 규칙으로 "`Python 함수의 가변 인자`"의 `[10, 30]`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `가변 객체 참조를 전달` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `&mut Vec<i32>를 명시적으로 빌림` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`[10, 30]` 맞히기) → 빈칸(`items.append(30)` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 찾기) → 독립 구현(`Python 함수의 가변 인자을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[10, 30]` 및 `items.append(30)` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 함수의 가변 인자`"이(가) 필요한 상황을 `가변 객체의 공유 부작용 구분` 동작으로 설명해 보세요.
- 예제에서 `items.append(30)`이(가) 실행되기 직전의 상태와 직후의 출력 `[10, 30]`을(를) 말해 보세요.
- "`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `가변 객체의 공유 부작용 구분` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. Day 44 "`Python 함수의 가변 인자`"의 예제는 `items.append(30)`을(를) 실행해 `[10, 30]`을(를) 출력합니다. "`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함`" 여부를 확인하고 Day 44을(를) 완료하세요.
