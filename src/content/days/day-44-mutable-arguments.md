---
schemaVersion: 1
contentVersion: 2026.10-e
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
    hint: 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. 설명을 떠올리고 `values` 단계부터 순서대로 적어 보세요.
    explanation:
      values → [10]  →  items → 같은 객체  →  append  →  [10,30] 순서로 실행됩니다. `items.append(30)` 부분이 `[10,30]`
      단계를 확정해 최종 출력 '[10, 30]'가 됩니다. 이 흐름을 떠올리면 `가변 객체의 공유 부작용 구분` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-44-mutable-arguments-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Python 함수의 가변 인자' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: items.append(30)"
    starter: "def add_session(items):\n    _____\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: 힌트 문장을 완전하게 읽으면 `values가 [10]을 참조합니다` 단계에 필요한 표현이 `items.append(30)`입니다.
    explanation:
      빈칸에 들어갈 표현은 'items.append(30)'입니다. `items.append(30)` 줄을 완성해야 `가변 객체의 공유 부작용 구분` 동작이 이어져 실행 결과 '[10,
      30]'가 됩니다. 힌트의 첫 단계 `values가 [10]을 참조합니다`이 바로 이 줄입니다. 이어서 items가 같은 객체를 가리킵니다 append 뒤 [10,30]이 됩니다 순서로 진행됩니다.
    commonMistakes:
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-44-mutable-arguments-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 30에서 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
    answer: "def add_session(items):\n    items.append(31)\nvalues = [10]\nadd_session(values)\nprint(values)"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 30에서 31로."
    explanation:
      바꾼 뒤 출력은 '[10, 31]'입니다. 원본 출력 '[10, 30]'에서 달라졌습니다. 바뀐 줄은 `items.append(30)`에서 `items.append(31)`로
      바뀌었습니다. 바뀐 프로그램은 `values` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 그 차이가 이후 단계로 이어져 최종 `[10, 31]`가 됩니다. 원본 추적 `values →
      [10]  →  items → 같은 객체  →  append  →  [10,30]`와 바뀐 줄 이후를 순서대로 비교하면 처음 달라지는 곳이 보입니다.
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
    hint:
      함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. 설명과 어긋나는 줄을 찾으세요. `매개변수 대입과 객체 내부 수정을 같은
      동작으로 혼동함` 상황이 단서가 됩니다.
    explanation:
      틀린 줄은 `items = [30]`입니다. 여기서는 `items = [30]`을 써서 `items.append(30)` 동작이 깨집니다. 이대로 실행하면 `매개변수 대입과
      객체 내부 수정을 같은 동작으로 혼동함` 문제가 생겨 원본 추적 `values → [10]  →  items → 같은 객체  →  append  →  [10,30]`대로 '[10, 30]'가 나오지
      않습니다. 고친 줄 `items.append(30)`에서는 `items.append(30)`가 `가변 객체의 공유 부작용 구분` 동작을 지켜 '[10, 30]'까지 도달합니다.
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
    hint:
      함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를
      함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `items.append(30)` 부분이 `가변 객체의 공유 부작용 구분` 동작을 지켜 실행 결과 '[10, 30]'가 됩니다. 같은 개념을
      다른 입력으로 바꿔도 `items.append(30)`부터 `[10,30]`까지 추적할 수 있으면 정답입니다. `매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 상황과 빈 입력 같은 경계도
      함께 설명해 보세요.
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
    explanation:
      values → [10]  →  items → 같은 객체  →  append  →  [10,30] 순서로 실행되어 출력은 '[10, 30]'입니다. `items.append(30)`
      부분이 마지막 단계를 확정하므로 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-44-mutable-arguments-model
    question: "'Python 함수의 가변 인자' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. 이 설명이 맞는 이유는 `가변 객체의 공유 부작용 구분` 동작을
      지키는 조건과 같기 때문입니다. `매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-44-mutable-arguments-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함. 이 실수가 나오면 원본 추적 `values→[10] → items→같은 객체 → append → [10,30]`대로
      '[10, 30]'가 나오지 않으므로 먼저 확인해야 합니다.
  - id: quiz-day-44-mutable-arguments-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 가변 객체의 공유 부작용 구분라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 `가변 객체의 공유 부작용 구분` 목적과 입력·출력은 유지합니다. 실행 결과 '[10, 30]'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource: "def add_session(items):\n    items.append(30)\nvalues = [10]\nadd_session(values)\nprint(values)"
---

## 오늘 배울 이유

함수 호출 뒤 원본 리스트가 바뀌는 이유를 알아야 예상치 못한 부작용을 막습니다. Day 44 "`Python 함수의 가변 인자`"에서는 Python 코드의 실행 결과(`[10, 30]`)를 따라가며, `가변 객체의 공유 부작용 구분` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 43](/learn/day-43-output-parameter)에서 배운 "C 포인터로 결과 돌려주기" 내용을 한 문장으로 말해 보세요. 이번 "`Python 함수의 가변 인자`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `items.append(30)`입니다.

## 머릿속 그림

함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. Day 44에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `items.append(30)`입니다.

```text
values → [10]  →  items → 같은 객체  →  append  →  [10,30]
```

위 흐름에서 `items.append(30)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[10, 30]`입니다.

## 천천히 풀어보기

Python 함수에 리스트를 넘기면 함수 매개변수가 호출자와 같은 리스트를 참조할 수 있습니다. `items.append(30)`은 그 리스트 자체를 변경해서 호출자 `values`에도 30이 보입니다. 반면 함수 안에서 `items = [30]`은 지역 이름을 새 리스트에 붙이므로 원래 `values` 자체를 바꾸지 않습니다.

이 차이를 `append` 실행 직후와 재할당 직후로 나눠 손으로 그려 보세요. 원래 입력을 보존해야 한다면 함수 안에서 `items.copy()`를 사용해 별도의 바깥 리스트를 만들고 반환할 수 있습니다. 안에 다른 리스트가 들어 있다면 얕은 복사의 한계도 기억하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 44 "`Python 함수의 가변 인자`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `items.append(30)`이며, 실행 결과는 `[10, 30]`입니다.

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

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`[10, 30]`)를 가리고 예측한 뒤 실행해 비교하세요.

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

`items.append(30)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | values         |
|    2 | [10]           |
|    3 | items          |
|    4 | 같은 객체      |
|    5 | append         |
|    6 | [10,30]        |

위 순서대로 실행한 최종 출력은 `[10, 30]`입니다. `values` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`values=[1]; add(values)`에서 함수 `add(items)`가 `items.append(2)`를 호출하면 values는 `[1,2]`입니다. 하지만 함수에서 `items = [2]`만 하면 호출자 values는 `[1]`입니다. **같은 리스트를 바꾸는가, 지역 이름을 다시 연결하는가**를 구분해서 호출 전후의 그림을 그리세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `[10, 30]`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
def add_session(items):
    items.append(31)
values = [10]
add_session(values)
print(values)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
[10, 31]
```

원본 출력은 `[10, 30]`이고, 바뀐 코드의 실행 결과는 `[10, 31]`입니다. 바뀐 줄은 `items.append(30)`에서 `items.append(31)`로 바뀌었습니다. 바뀐 프로그램은 `values` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 `[10, 31]`가 됩니다. 원본 추적 `values → [10]  →  items → 같은 객체  →  append  →  [10,30]`에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다.

## 자주 틀리는 지점

**확인할 실수: 매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함.** 정상 코드의 실행 결과는 `[10, 30]`입니다.

- 정상 줄: `items.append(30)`
- 잘못된 줄: `items = [30]`

두 줄을 나란히 놓으면 정상 줄 `items.append(30)`이 `함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다.` 설명과 맞고, 잘못된 줄은 `매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `values`부터 `[10, 30]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `가변 객체의 공유 부작용 구분`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | int *와 명시적 포인터 전달      |
| Python | 가변 객체 참조를 전달           |
| Rust   | &mut Vec<i32>를 명시적으로 빌림 |

C17에서는 `int *와 명시적 포인터 전달` 규칙을 적용합니다. "`Python 함수의 가변 인자`" 수업의 실행 결과(`[10, 30]`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `가변 객체 참조를 전달` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `&mut Vec<i32>를 명시적으로 빌림` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`[10, 30]` 맞히기) → 빈칸(`items.append(30)` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함` 찾기) → 독립 구현(`'Python 함수의 가변 인자' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[10, 30]` 및 `items.append(30)` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 함수의 가변 인자`" 수업이 필요한 이유는 `가변 객체의 공유 부작용 구분` 동작으로 설명해 보세요.
- 예제에서 `items.append(30)` 부분 실행 직전의 상태와 직후의 출력(`[10, 30]`)을 말해 보세요.
- "`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `가변 객체의 공유 부작용 구분` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

함수 매개변수 items와 호출자 values가 같은 가변 리스트를 참조합니다. append는 객체를 바꿉니다. Day 44 "`Python 함수의 가변 인자`" 예제의 핵심 부분은 `items.append(30)`이며, 실행 결과는 `[10, 30]`입니다. "`매개변수 대입과 객체 내부 수정을 같은 동작으로 혼동함`" 여부를 확인하고 Day 44 수업을 완료하세요.
