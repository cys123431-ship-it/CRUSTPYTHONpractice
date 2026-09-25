---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-21-functions-review
courseId: crp-92
phaseId: phase-02
dayNumber: 21
date: "2026-10-21"
title: 반복과 함수 회상
summary: 한 주의 반복·함수를 직접 결합해 보면 상태 누적과 반환의 차이를 확인할 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: beginner
estimatedMinutes: 50
prerequisites:
  - day-20-c-functions
learningObjectives:
  - "'반복과 함수 회상' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 반복 안에서 result를 덮어써 마지막 값만 반환함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - functions review
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
  - id: ex-day-21-functions-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 입력 [10,20]에서 시작해 계산하세요.
    starter:
      "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    answer: "30"
    hint: 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.
    explanation: 입력 [10,20]  →  result=10  →  result=30  →  출력. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-21-functions-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 반복과 함수 회상의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: result += value"
    starter:
      "def total(values):\n    result = 0\n    for value in values:\n        _____\n    return result\nprint(total([10,\
      \ 20]))"
    answer:
      "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    hint: 호출 시 값 [10,20]을 전달합니다
    explanation: 빈칸에는 'result += value'이 들어갑니다. 호출 시 값 [10,20]을 전달합니다 result가 0→10→30으로 바뀝니다 return 30을 print가 받습니다
    commonMistakes:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-21-functions-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    answer:
      "def total(values):\n    result = 1\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-21-functions-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 반복 안에서 result를 덮어써 마지막 값만 반환함 상황을 확인하세요.
    starter:
      "def total(values):\n    result = 0\n    for value in values:\n        result = value\n    return result\n\
      print(total([10, 20]))"
    answer:
      "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    hint: 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 호출 시 값 [10,20]을 전달합니다 result가 0→10→30으로 바뀝니다 return 30을 print가 받습니다
    commonMistakes:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-21-functions-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '반복과 함수 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 반복과 함수 회상: 직접 구현"
    answer:
      "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\
      print(total([10, 20]))"
    hint: 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 호출 시 값 [10,20]을 전달합니다 result가 0→10→30으로 바뀝니다 return 30을 print가 받습니다 다른 코드도
      결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-21-functions-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "30"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: 입력 [10,20]  →  result=10  →  result=30  →  출력 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-21-functions-review-model
    question: 반복과 함수 회상을 이해하는 데 맞는 설명은?
    choices:
      - 반복 안에서 result를 덮어써 마지막 값만 반환함(이것이 정상적인 사용법이다)
      - 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.
  - id: quiz-day-21-functions-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 반복 안에서 result를 덮어써 마지막 값만 반환함
    answerIndex: 2
    explanation: 반복 안에서 result를 덮어써 마지막 값만 반환함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-21-functions-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 반복 계산을 함수로 묶음라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 반복 계산을 함수로 묶음라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return\
  \ result\nprint(total([10, 20]))"
---

## 오늘 배울 이유

한 주의 반복·함수를 직접 결합해 보면 상태 누적과 반환의 차이를 확인할 수 있습니다. Day 21 "`반복과 함수 회상`"에서는 Python 코드의 실행 결과(`30`)를 따라가며, `반복 계산을 함수로 묶음` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`반복 안에서 result를 덮어써 마지막 값만 반환함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 20](/learn/day-20-c-functions)에서 배운 "C 함수 매개변수와 반환값" 내용을 한 문장으로 말해 보세요. 이번 "`반복과 함수 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `result += value`입니다.

## 머릿속 그림

함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다. Day 21에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `result += value`입니다.

```text
입력 [10,20]  →  result=10  →  result=30  →  출력
```

위 흐름에서 `result += value` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

함수를 호출할 때마다 함수 안의 `result`는 새로 시작합니다. 입력 `[10,20]`을 더한 뒤 다시 `[5]`를 넘기면 새 호출의 결과는 5여야 합니다. 이전 호출의 합계 30이 새 호출로 새어 나오면 지역 상태를 잘못 공유한 것입니다.

`return result`는 합계를 호출자에게 넘깁니다. 반환한 값을 변수에 저장할 수도 있고 `print(total(...))`처럼 바로 출력할 수도 있습니다. 빈 입력에서는 시작값 0이 그대로 반환됩니다. 중간에 `result += value`가 몇 번 실행되는지 손으로 세어 보세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 21 "`반복과 함수 회상`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `result += value`이며, 실행 결과는 `30`입니다.

```python
def total(values):
    result = 0
    for value in values:
        result += value
    return result
print(total([10, 20]))
```

예상 출력:

```text
30
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`30`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `result += value`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | def total(values):
 2 |     result = 0
 3 |     for value in values:
 4 |         result += value
 5 |     return result
 6 | print(total([10, 20]))
```

1. 호출 시 값 [10,20]을 전달합니다
2. result가 0→10→30으로 바뀝니다
3. return 30을 print가 받습니다

`result += value` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 입력 [10,20]   |
|    2 | result=10      |
|    3 | result=30      |
|    4 | 출력           |

위 순서대로 실행한 최종 출력은 `30`입니다. `입력 [10,20]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`total([2,3])`이 5를 돌려준 뒤 `total([10])`을 다시 부르면 새 함수 호출의 `result`는 0에서 시작해 10을 돌려줍니다. 5+10=15가 되면 두 번의 호출이 상태를 잘못 공유한 셈입니다. 입력이 빈 리스트라면 반복이 한 번도 실행되지 않아 0을 반환합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
def total(values):
    result = 1
    for value in values:
        result += value
    return result
print(total([10, 20]))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
31
```

원본(`30`)과 달라졌습니다. 다른 줄(`result = 0` → `result = 1`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`입력 [10,20]` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 반복 안에서 result를 덮어써 마지막 값만 반환함.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `result += value`
- 잘못된 줄: `result = value`

두 줄을 나란히 놓고 `함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `입력 [10,20]`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `반복 계산을 함수로 묶음`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | 배열과 길이를 인자로 받는 함수    |
| Python | iterable을 매개변수로 받아 return |
| Rust   | slice를 빌려 iterator.sum()       |

C17에서는 `배열과 길이를 인자로 받는 함수` 규칙을 적용합니다. "`반복과 함수 회상`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `iterable을 매개변수로 받아 return` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `slice를 빌려 iterator.sum()` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`result += value` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`반복 안에서 result를 덮어써 마지막 값만 반환함` 찾기) → 독립 구현(`반복과 함수 회상을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `result += value` 설명과 대조하세요.

## 스스로 설명하기

- "`반복과 함수 회상`" 수업이 필요한 이유는 `반복 계산을 함수로 묶음` 동작으로 설명해 보세요.
- 예제에서 `result += value` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`반복 안에서 result를 덮어써 마지막 값만 반환함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `반복 계산을 함수로 묶음` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다. Day 21 "`반복과 함수 회상`" 예제의 핵심 부분은 `result += value`이며, 실행 결과는 `30`입니다. "`반복 안에서 result를 덮어써 마지막 값만 반환함`" 여부를 확인하고 Day 21 수업을 완료하세요.
