---
schemaVersion: 1
contentVersion: 2026.10-c
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

한 주의 반복·함수를 직접 결합해 보면 상태 누적과 반환의 차이를 확인할 수 있습니다. 이번 Day는 새 문법을 많이 추가하는 대신 앞선 개념을 떠올리고 작은 변경 실험으로 오개념을 확인합니다. 코드를 가린 채 먼저 답하고, 모른 부분만 선행 Day로 돌아가 보세요.

## 시작 전에 확인할 것

바로 앞선 [Day 20](/learn/day-20-c-functions)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다. 다음 흐름을 눈으로 확인하세요.

```text
입력 [10,20]  →  result=10  →  result=30  →  출력
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

함수를 호출할 때마다 함수 안의 `result`는 새로 시작합니다. 입력 `[10,20]`을 더한 뒤 다시 `[5]`를 넘기면 새 호출의 결과는 5여야 합니다. 이전 호출의 합계 30이 새 호출로 새어 나오면 지역 상태를 잘못 공유한 것입니다.

`return result`는 합계를 호출자에게 넘깁니다. 반환한 값을 변수에 저장할 수도 있고 `print(total(...))`처럼 바로 출력할 수도 있습니다. 빈 입력에서는 시작값 0이 그대로 반환됩니다. 중간에 `result += value`가 몇 번 실행되는지 손으로 세어 보세요.

## 문법을 예제로 보기

아래는 Python 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

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

아래 Python 실행 영역에 같은 코드가 미리 들어 있습니다. 먼저 예측하고 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `result += value`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. 호출 시 값 [10,20]을 전달합니다
2. result가 0→10→30으로 바뀝니다
3. return 30을 print가 받습니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 입력 [10,20]   |
|    2 | result=10      |
|    3 | result=30      |
|    4 | 출력           |

마지막 상태에서 화면에 표시되는 결과는 `30`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 다른 예제로 다시 이해하기

`total([2,3])`이 5를 돌려준 뒤 `total([10])`을 다시 부르면 새 함수 호출의 `result`는 0에서 시작해 10을 돌려줍니다. 5+10=15가 되면 두 번의 호출이 상태를 잘못 공유한 셈입니다. 입력이 빈 리스트라면 반복이 한 번도 실행되지 않아 0을 반환합니다.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 결과가 바뀌는지 예측하고, 같다면 왜 같은지 설명하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 반복 안에서 result를 덮어써 마지막 값만 반환함.** 함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **반복 계산을 함수로 묶음**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | 배열과 길이를 인자로 받는 함수    |
| Python | iterable을 매개변수로 받아 return |
| Rust   | slice를 빌려 iterator.sum()       |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 한 주의 반복·함수를 직접 결합해 보면 상태 누적과 반환의 차이를 확인할 수 있습니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 반복 안에서 result를 덮어써 마지막 값만 반환함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

함수 내부 result는 호출마다 새로 시작하며 return이 최종 합계를 호출자에게 전달합니다. 예시의 출력은 `30`입니다. 오류를 찾을 때는 **반복 안에서 result를 덮어써 마지막 값만 반환함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
