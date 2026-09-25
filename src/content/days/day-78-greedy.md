---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-78-greedy
courseId: crp-92
phaseId: phase-07
dayNumber: 78
date: "2026-12-17"
title: 그리디 선택과 반례
summary: 매 순간 가장 큰 선택을 하는 전략이 언제 맞는지 반례와 함께 판단해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-77-search-sort-review
learningObjectives:
  - "'그리디 선택과 반례' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - greedy
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
  - id: ex-day-78-greedy-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 11에서 시작해 계산하세요.
    starter:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    answer: "[5, 5, 1]"
    hint: 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
    explanation: 11  →  6  →  1  →  0. 따라서 출력은 '[5, 5, 1]'입니다.
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-78-greedy-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 그리디 선택과 반례의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: remaining >= coin"
    starter:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while _____: remaining -= coin; used.append(coin)\n\
      print(used)"
    answer:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    hint: 11에서 5를 두 번 빼 1이 남습니다
    explanation: 빈칸에는 'remaining >= coin'이 들어갑니다. 11에서 5를 두 번 빼 1이 남습니다 1을 한 번 뺍니다 세 동전 [5,5,1]을 출력합니다
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-78-greedy-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 5에서 6로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    answer:
      "coins = [6, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    hint: 처음 등장하는 숫자를 5에서 6로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 5에서 6로 바꿨습니다. 원래 출력은 '[5, 5, 1]'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이
      같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-78-greedy-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함 상황을 확인하세요.
    starter:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining > coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    answer:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    hint: 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 11에서 5를 두 번 빼 1이 남습니다 1을 한 번 뺍니다 세 동전 [5,5,1]을 출력합니다
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-78-greedy-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '그리디 선택과 반례' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 그리디 선택과 반례: 직접 구현"
    answer:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    hint: 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 11에서 5를 두 번 빼 1이 남습니다 1을 한 번 뺍니다 세 동전 [5,5,1]을 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-78-greedy-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "[5, 5, 1]"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: 11  →  6  →  1  →  0 순서로 실행되어 '[5, 5, 1]'을 출력합니다.
  - id: quiz-day-78-greedy-model
    question: 그리디 선택과 반례을 이해하는 데 맞는 설명은?
    choices:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함(이것이 정상적인 사용법이다)
      - 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
  - id: quiz-day-78-greedy-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
    answerIndex: 2
    explanation: 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-78-greedy-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 국소 선택의 최적성 조건 확인라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 국소 선택의 최적성 조건 확인라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
  \ -= coin; used.append(coin)\nprint(used)"
---

## 오늘 배울 이유

매 순간 가장 큰 선택을 하는 전략이 언제 맞는지 반례와 함께 판단해야 합니다. Day 78 "`그리디 선택과 반례`"에서는 Python 코드가 `[5, 5, 1]`을(를) 만드는 과정을 따라가며, 국소 선택의 최적성 조건 확인 동작이 왜 필요한지 확인합니다. 국소 선택의 최적성 조건 확인을(를) 빠뜨리면 `모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 77](/learn/day-77-search-sort-review)에서는 "탐색·정렬 회상"을(를) 배웠습니다. "탐색·정렬 회상"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`그리디 선택과 반례`"에서 새로 달라지는 조건을 찾아보세요. Day 78의 답은 `[5, 5, 1]`이며, 핵심 표현은 `remaining >= coin`입니다.

## 머릿속 그림

큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다. Day 78에서는 아래 흐름 순서대로 상태가 바뀌며, `remaining >= coin`이(가) 결과를 가릅니다.

```text
11  →  6  →  1  →  0
```

위 흐름에서 `remaining >= coin`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[5, 5, 1]`입니다.

## 천천히 풀어보기

그리디는 매 순간 지금 가장 좋아 보이는 선택을 확정합니다. 동전 5와 1로 11을 만들면 5+5+1의 세 개가 좋은 선택입니다. 하지만 동전 4,3,1로 6을 만들 때 큰 것부터 고르면 4+1+1로 세 개이고, 3+3이면 두 개입니다.

따라서 그리디가 정답인지 동전 체계에 대한 근거나 반례 확인이 필요합니다. 예제의 선택 과정을 '남은 금액 → 선택한 동전'으로 적어 보고 6의 반례를 직접 계산하세요. 지역에서 좋아 보이는 선택이 전체에서도 최적인지는 별개의 질문입니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 78 "`그리디 선택과 반례`"의 독립 예제입니다. 전체 6줄에서 `remaining >= coin`이(가) 핵심이며, 실행 결과는 `[5, 5, 1]`입니다.

```python
coins = [5, 1]
remaining = 11
used = []
for coin in coins:
    while remaining >= coin: remaining -= coin; used.append(coin)
print(used)
```

예상 출력:

```text
[5, 5, 1]
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `[5, 5, 1]`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `remaining >= coin`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | coins = [5, 1]
 2 | remaining = 11
 3 | used = []
 4 | for coin in coins:
 5 |     while remaining >= coin: remaining -= coin; used.append(coin)
 6 | print(used)
```

1. 11에서 5를 두 번 빼 1이 남습니다
2. 1을 한 번 뺍니다
3. 세 동전 [5,5,1]을 출력합니다

위 단계에서 `remaining >= coin`이(가) 빠지면 `[5, 5, 1]`이(가) 나오지 않습니다. `처음 등장하는 숫자를 5에서 6로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 11             |
|    2 | 6              |
|    3 | 1              |
|    4 | 0              |

위 순서대로 실행하면 최종 출력 `[5, 5, 1]`이(가) 됩니다. `11` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

동전 `[4,3,1]`로 6을 만들 때 큰 것부터 고르면 4+1+1로 세 개입니다. 그러나 3+3이면 두 개입니다. 단순히 '큰 동전을 우선'이라는 규칙이 모든 동전 체계에 맞지 않는다는 반례입니다. 어떤 문제에서 그리디가 맞는지 증명하거나 작은 입력을 완전히 탐색해 검증하세요.

## 시간과 공간 복잡도

동전 [4,3,1]로 6원을 만들 때 큰 것부터 고르면 4+1+1 세 개지만 3+3 두 개가 정답입니다. 탐욕 규칙이 모든 동전 체계에 맞지는 않습니다. 탐욕이 맞는지 증명하거나 작은 입력을 완전히 탐색해 검증하세요. Day 78의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 5에서 6로` 바꾸면 아래와 같이 됩니다.

```python
coins = [6, 1]
remaining = 11
used = []
for coin in coins:
    while remaining >= coin: remaining -= coin; used.append(coin)
print(used)
```

원본 출력은 `[5, 5, 1]`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `remaining >= coin`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 78의 `그리디 선택과 반례`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함.** 정상 코드에서는 `[5, 5, 1]`이(가) 출력됩니다.

- 정상 줄: `while remaining >= coin: remaining -= coin; used.append(coin)`
- 잘못된 줄: `while remaining > coin: remaining -= coin; used.append(coin)`

두 줄을 나란히 놓고 `큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `11`부터 `[5, 5, 1]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **국소 선택의 최적성 조건 확인**은(는) 세 언어에서 같은 입력과 출력(`[5, 5, 1]`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙  |
| ------ | --------------------------- |
| C17    | 동전 배열을 큰 순서로 순회  |
| Python | while로 선택 반복           |
| Rust   | 조건 검사 후 남은 금액 갱신 |

C17에서는 `동전 배열을 큰 순서로 순회` 규칙으로 "`그리디 선택과 반례`"의 `[5, 5, 1]`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `while로 선택 반복` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `조건 검사 후 남은 금액 갱신` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`[5, 5, 1]` 맞히기) → 빈칸(`remaining >= coin` 채우기) → 변경(`처음 등장하는 숫자를 5에서 6로`) → 오류 수정(`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함` 찾기) → 독립 구현(`그리디 선택과 반례을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[5, 5, 1]` 및 `remaining >= coin` 설명과 대조하세요.

## 스스로 설명하기

- "`그리디 선택과 반례`"이(가) 필요한 상황을 `국소 선택의 최적성 조건 확인` 동작으로 설명해 보세요.
- 예제에서 `remaining >= coin`이(가) 실행되기 직전의 상태와 직후의 출력 `[5, 5, 1]`을(를) 말해 보세요.
- "`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `국소 선택의 최적성 조건 확인` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다. Day 78 "`그리디 선택과 반례`"의 예제는 `remaining >= coin`을(를) 실행해 `[5, 5, 1]`을(를) 출력합니다. "`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`" 여부를 확인하고 Day 78을(를) 완료하세요.
