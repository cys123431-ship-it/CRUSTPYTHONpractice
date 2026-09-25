---
schemaVersion: 1
contentVersion: 2026.10-f
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
    hint: 11에서 시작해 0까지 순서대로 적어 보세요. 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
    explanation:
      1. 11에서 5를 두 번 빼 1이 남습니다. 2. 1을 한 번 뺍니다. 3. 세 동전 [5,5,1]을 출력합니다. `11 → 6 → 1 → 0` 흐름으로 실제 출력 `[5,
      5, 1]`이 됩니다. 핵심 `remaining >= coin`은 남은 금액이 동전 이상일 때 고르는 자리에 쓰입니다.
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
    hint: 필요한 표현은 국소 선택의 최적성 조건 확인 동작을 잇는 remaining >= coin입니다.
    explanation:
      빈칸에 들어갈 표현은 'remaining >= coin'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. 11에서 5를 두 번 빼 1이 남습니다. 2. 1을 한 번 뺍니다.
      3. 세 동전 [5,5,1]을 출력합니다. `11 → 6 → 1 → 0` 흐름으로 실제 출력 `[5, 5, 1]`이 됩니다. 핵심 `remaining >= coin`은 남은 금액이 동전 이상일
      때 고르는 자리에 쓰입니다.
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
    hint: 처음 등장하는 숫자를 5에서 6로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '[5, 5, 1]'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '[6, 1, 1, 1, 1, 1]'입니다. 원본은 `[5, 5, 1]`, 수정본은 `[6, 1, 1, 1, 1, 1]`이다. 첫 변경 줄 `coins = [5,
      1]`에서 `coins = [6, 1]`로 큰 동전을 바꾸면, 6 하나와 1 다섯 개로 채워진다.
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
    hint:
      모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함 상황에서 어긋나는 줄을 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
      설명과 대조해 보세요.
    explanation:
      "틀린 줄은 `while remaining > coin: remaining -= coin; used.append(coin)`입니다. 남은 금액이 동전과 정확히 같을 때 고르지
      못하므로, 마지막 1이 남고 `used`는 `[5, 5]`가 됩니다. 오류 분류는 잘못된 출력입니다. 같은 값 선택이 빠지는 첫 순간이 원인입니다. 고친 줄 `while remaining >=
      coin: remaining -= coin; used.append(coin)`에서는 `국소 선택의 최적성 조건 확인` 동작이 지켜집니다. 4,3,1 체계에서 6을 만들 때 큰 것부터 고르면 3개이지만
      3+3 두 개가 정답이므로, 탐욕이 맞는지 작은 입력으로 검증하세요. 정상 코드는 고르기→빼기→기록의 순서로 `[5, 5, 1]`을 출력합니다."
    commonMistakes:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-78-greedy-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 그리디 선택과 반례 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 그리디 선택과 반례: 직접 구현"
    answer:
      "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
      \ -= coin; used.append(coin)\nprint(used)"
    hint: 동전 4,3,1로 6을 만들 때 3+3 두 개가 정답입니다. 탐욕이 맞는지 작은 입력으로 검증하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 동전 4,3,1로 6을 만들 때 3+3 두 개가 정답입니다. 탐욕이 맞는지 작은 입력으로 검증하세요. 같은 국소 선택의 최적성
      조건 확인 동작을 구현하고 실행 결과 '[5, 5, 1]'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
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
    explanation:
      먼저 11에서 5를 두 번 빼 1이 남습니다. 이어서 1을 한 번 빼 used에 [5,5,1]이 모이므로 출력 `[5, 5, 1]`이 됩니다. `실행 전에 반드시 오류가 난다`는
      틀린 선택지인데 반복과 기록이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-78-greedy-model
    question: "'그리디 선택과 반례' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함(이것이 정상적인 사용법이다)
      - 큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개라는 뜻이지만, 임의 동전 체계에서 최적을 보장하지 않는다는 뜻은 체계마다 검증해야 한다는 뜻입니다. `모든 동전 체계에서
      큰 동전부터 고르면 최적이라고 일반화함`은 반대 사례인데, 4,3,1 체계의 6에서는 3+3이 더 적기 때문입니다.
  - id: quiz-day-78-greedy-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함
    answerIndex: 2
    explanation:
      먼저 확인할 실수는 `모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`입니다. 잘못된 코드는 실행은 되지만 `[5, 5]`라는 잘못된 출력을 냅니다. 같은 값일 때도
      고르는지 확인하세요.
  - id: quiz-day-78-greedy-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 국소 선택의 최적성 조건 확인라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `국소 선택의 최적성 조건 확인`이라는 의미와 입력·출력 계약입니다. 탐욕 선택과 완전 탐색으로 같은 동작을 구현하고, 실행 결과 `[5,
      5, 1]`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource:
  "coins = [5, 1]\nremaining = 11\nused = []\nfor coin in coins:\n    while remaining >= coin: remaining\
  \ -= coin; used.append(coin)\nprint(used)"
---

## 오늘 배울 이유

매 순간 가장 큰 선택을 하는 전략이 언제 맞는지 반례와 함께 판단해야 합니다. Day 78 "`그리디 선택과 반례`"에서는 Python 코드의 실행 결과(`[5, 5, 1]`)를 따라가며, `국소 선택의 최적성 조건 확인` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 77](/learn/day-77-search-sort-review)에서 배운 "탐색·정렬 회상" 내용을 한 문장으로 말해 보세요. 이번 "`그리디 선택과 반례`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `remaining >= coin`입니다.

## 머릿속 그림

큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다. Day 78에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `remaining >= coin`입니다.

```text
11  →  6  →  1  →  0
```

위 흐름에서 `remaining >= coin` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[5, 5, 1]`입니다.

## 천천히 풀어보기

그리디는 매 순간 지금 가장 좋아 보이는 선택을 확정합니다. 동전 5와 1로 11을 만들면 5+5+1의 세 개가 좋은 선택입니다. 하지만 동전 4,3,1로 6을 만들 때 큰 것부터 고르면 4+1+1로 세 개이고, 3+3이면 두 개입니다.

따라서 그리디가 정답인지 동전 체계에 대한 근거나 반례 확인이 필요합니다. 예제의 선택 과정을 '남은 금액 → 선택한 동전'으로 적어 보고 6의 반례를 직접 계산하세요. 지역에서 좋아 보이는 선택이 전체에서도 최적인지는 별개의 질문입니다.

그리디는 매 순간 지금 가장 좋아 보이는 선택을 확정합니다. 동전 5와 1로 11을 만들면 5+5+1의 세 개가 좋은 선택입니다. 하지만 동전 4,3,1로 6을 만들 때 큰 것부터 고르면 4+1+1로 세 개이고, 3+3이면 두 개입니다.

따라서 그리디가 정답인지 동전 체계에 대한 근거나 반례 확인이 필요합니다. 예제의 선택 과정을 남은 금액에서 선택한 동전으로 적어 보고 6의 반례를 직접 계산하세요. 지역에서 좋아 보이는 선택이 전체에서도 최적인지는 별개의 질문입니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 78 "`그리디 선택과 반례`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `remaining >= coin`이며, 실행 결과는 `[5, 5, 1]`입니다.

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

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`[5, 5, 1]`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `remaining >= coin`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

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

`remaining >= coin` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 11             |
|    2 | 6              |
|    3 | 1              |
|    4 | 0              |

위 순서대로 실행한 최종 출력은 `[5, 5, 1]`입니다. `11` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

동전 `[4,3,1]`로 6을 만들 때 큰 것부터 고르면 4+1+1로 세 개입니다. 그러나 3+3이면 두 개입니다. 단순히 '큰 동전을 우선'이라는 규칙이 모든 동전 체계에 맞지 않는다는 반례입니다. 어떤 문제에서 그리디가 맞는지 증명하거나 작은 입력을 완전히 탐색해 검증하세요.

## 시간과 공간 복잡도

동전 [4,3,1]로 6원을 만들 때 큰 것부터 고르면 4+1+1 세 개지만 3+3 두 개가 정답입니다. 탐욕 규칙이 모든 동전 체계에 맞지는 않습니다. 탐욕이 맞는지 증명하거나 작은 입력을 완전히 탐색해 검증하세요. Day 78의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `[5, 5, 1]`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
coins = [6, 1]
remaining = 11
used = []
for coin in coins:
    while remaining >= coin: remaining -= coin; used.append(coin)
print(used)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
[6, 1, 1, 1, 1, 1]
```

원본은 `[5, 5, 1]`, 수정본은 `[6, 1, 1, 1, 1, 1]`이다. 첫 변경 줄 `coins = [5, 1]`에서 `coins = [6, 1]`로 큰 동전을 바꾸면, 6 하나와 1 다섯 개로 채워진다.

## 자주 틀리는 지점

**확인할 실수: 모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함.** 정상 코드의 실행 결과는 `[5, 5, 1]`입니다.

- 정상 줄: `while remaining >= coin: remaining -= coin; used.append(coin)`
- 잘못된 줄: `while remaining > coin: remaining -= coin; used.append(coin)`

두 줄을 나란히 놓으면 정상 줄 `while remaining >= coin: remaining -= coin; used.append(coin)`이 `큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다.` 설명과 맞고, 잘못된 줄은 `모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `11`부터 `[5, 5, 1]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `국소 선택의 최적성 조건 확인`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙  |
| ------ | --------------------------- |
| C17    | 동전 배열을 큰 순서로 순회  |
| Python | while로 선택 반복           |
| Rust   | 조건 검사 후 남은 금액 갱신 |

C17에서는 `동전 배열을 큰 순서로 순회` 규칙을 적용합니다. "`그리디 선택과 반례`" 수업의 실행 결과(`[5, 5, 1]`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `while로 선택 반복` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `조건 검사 후 남은 금액 갱신` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`[5, 5, 1]` 맞히기) → 빈칸(`remaining >= coin` 채우기) → 변경(`처음 등장하는 숫자를 5에서 6로`) → 오류 수정(`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함` 찾기) → 독립 구현(`'그리디 선택과 반례' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[5, 5, 1]` 및 `remaining >= coin` 설명과 대조하세요.

## 스스로 설명하기

- "`그리디 선택과 반례`" 수업이 필요한 이유는 `국소 선택의 최적성 조건 확인` 동작으로 설명해 보세요.
- 예제에서 `remaining >= coin` 부분 실행 직전의 상태와 직후의 출력(`[5, 5, 1]`)을 말해 보세요.
- "`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `국소 선택의 최적성 조건 확인` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

큰 동전을 먼저 고르는 규칙은 5·1 체계에서 11에 3개지만 임의 동전 체계에서 최적을 보장하지 않습니다. Day 78 "`그리디 선택과 반례`" 예제의 핵심 부분은 `remaining >= coin`이며, 실행 결과는 `[5, 5, 1]`입니다. "`모든 동전 체계에서 큰 동전부터 고르면 최적이라고 일반화함`" 여부를 확인하고 Day 78 수업을 완료하세요.
