---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-79-dynamic-programming
courseId: crp-92
phaseId: phase-07
dayNumber: 79
date: "2026-12-18"
title: DP로 중복 계산 줄이기
summary: 계단을 한 칸·두 칸 오르는 경우 수처럼 동일한 작은 문제를 여러 번 쓰면 결과를 저장해 재사용합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-78-greedy
learningObjectives:
  - "'DP로 중복 계산 줄이기' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - dynamic programming
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
  - id: ex-day-79-dynamic-programming-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? ways[0]=1에서 시작해 계산하세요.
    starter:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    answer: "5"
    hint: ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.
    explanation: ways[0]=1  →  1  →  2  →  3  →  5. 따라서 출력은 '5'입니다.
    commonMistakes:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-79-dynamic-programming-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: DP로 중복 계산 줄이기의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: ways[step-1]"
    starter:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = _____ + (ways[step-2] if step\
      \ >= 2 else 0)\nprint(ways[4])"
    answer:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    hint: ways[0]=1입니다
    explanation: 빈칸에는 'ways[step-1]'이 들어갑니다. ways[0]=1입니다 ways[1..4]가 1,2,3,5가 됩니다 4칸 경우 수 5를 출력합니다
    commonMistakes:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-79-dynamic-programming-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    answer:
      "ways = [1] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '5'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-79-dynamic-programming-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨 상황을 확인하세요.
    starter:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-2] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    answer:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    hint: ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. ways[0]=1입니다 ways[1..4]가 1,2,3,5가 됩니다 4칸 경우 수 5를 출력합니다
    commonMistakes:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-79-dynamic-programming-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'DP로 중복 계산 줄이기' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# DP로 중복 계산 줄이기: 직접 구현"
    answer:
      "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
      \ if step >= 2 else 0)\nprint(ways[4])"
    hint: ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 ways[0]=1입니다 ways[1..4]가 1,2,3,5가 됩니다 4칸 경우 수 5를 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-79-dynamic-programming-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "5"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: ways[0]=1  →  1  →  2  →  3  →  5 순서로 실행되어 '5'을 출력합니다.
  - id: quiz-day-79-dynamic-programming-model
    question: DP로 중복 계산 줄이기을 이해하는 데 맞는 설명은?
    choices:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.
    answerIndex: 2
    explanation: ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.
  - id: quiz-day-79-dynamic-programming-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-79-dynamic-programming-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 작은 문제의 답을 저장해 결합라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 작은 문제의 답을 저장해 결합라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "ways = [0] * 5\nways[0] = 1\nfor step in range(1, 5):\n    ways[step] = ways[step-1] + (ways[step-2]\
  \ if step >= 2 else 0)\nprint(ways[4])"
---

## 오늘 배울 이유

계단을 한 칸·두 칸 오르는 경우 수처럼 동일한 작은 문제를 여러 번 쓰면 결과를 저장해 재사용합니다. Day 79 "`DP로 중복 계산 줄이기`"에서는 Python 코드의 실행 결과(`5`)를 따라가며, `작은 문제의 답을 저장해 결합` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`기저 경우 수 0을 0으로 두어 모든 값이 0이 됨`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 78](/learn/day-78-greedy)에서 배운 "그리디 선택과 반례" 내용을 한 문장으로 말해 보세요. 이번 "`DP로 중복 계산 줄이기`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `ways[step-1]`입니다.

## 머릿속 그림

ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다. Day 79에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `ways[step-1]`입니다.

```text
ways[0]=1  →  1  →  2  →  3  →  5
```

위 흐름에서 `ways[step-1]` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `5`입니다.

## 천천히 풀어보기

계단 한 번에 1칸 또는 2칸을 간다면 n칸에 도착하는 마지막 발걸음은 n−1에서 1칸 오거나 n−2에서 2칸 오는 두 경우뿐입니다. 그래서 `ways[n] = ways[n-1] + ways[n-2]`입니다. 예를 들어 3칸은 1+1+1, 1+2, 2+1의 세 방법입니다.

`ways[0]=1`은 '아무 걸음도 하지 않는 한 가지 방법'으로 두면 점화식이 자연스럽습니다. `ways[1]=1`입니다. 같은 작은 n의 답을 여러 번 재귀 계산하지 말고 배열에 한 번 저장하면 작업을 줄일 수 있습니다. n이 음수일 때 처리할 규칙도 정하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 79 "`DP로 중복 계산 줄이기`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `ways[step-1]`이며, 실행 결과는 `5`입니다.

```python
ways = [0] * 5
ways[0] = 1
for step in range(1, 5):
    ways[step] = ways[step-1] + (ways[step-2] if step >= 2 else 0)
print(ways[4])
```

예상 출력:

```text
5
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`5`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `ways[step-1]`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | ways = [0] * 5
 2 | ways[0] = 1
 3 | for step in range(1, 5):
 4 |     ways[step] = ways[step-1] + (ways[step-2] if step >= 2 else 0)
 5 | print(ways[4])
```

1. ways[0]=1입니다
2. ways[1..4]가 1,2,3,5가 됩니다
3. 4칸 경우 수 5를 출력합니다

`ways[step-1]` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | ways[0]=1      |
|    2 | 1              |
|    3 | 2              |
|    4 | 3              |
|    5 | 5              |

위 순서대로 실행한 최종 출력은 `5`입니다. `ways[0]=1` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

두 칸씩 또는 한 칸씩 오를 수 있다면 4칸의 경우 수는 `ways[3] + ways[2]`입니다. 3칸은 3가지, 2칸은 2가지라 5가지입니다. `ways[0]=1`이라는 시작값을 2로 잘못 바꾸면 뒤의 경우 수들도 틀어집니다. **작은 답을 맞게 저장한 뒤** 큰 답을 쌓아 보세요.

## 시간과 공간 복잡도

계단 오르기는 작은 답을 먼저 저장해 큰 답을 쌓으므로 O(n) 시간입니다. ways[0]=1 시작값을 틀리면 뒤가 전부 틀어집니다. 직전 두 값만 남기면 공간 O(1)입니다. 점화식의 입력 범위를 벗어난 칸은 읽으면 안 됩니다. Day 79의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `5`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
ways = [1] * 5
ways[0] = 1
for step in range(1, 5):
    ways[step] = ways[step-1] + (ways[step-2] if step >= 2 else 0)
print(ways[4])
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
5
```

`5`로 같습니다. ways의 0번을 1로 고정한 뒤에는 같은 점화식으로 쌓으므로 결과가 같습니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`ways = [1] * 5`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: 기저 경우 수 0을 0으로 두어 모든 값이 0이 됨.** 정상 코드의 실행 결과는 `5`입니다.

- 정상 줄: `ways[step] = ways[step-1] + (ways[step-2] if step >= 2 else 0)`
- 잘못된 줄: `ways[step] = ways[step-2] + (ways[step-2] if step >= 2 else 0)`

두 줄을 나란히 놓고 `ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `ways[0]=1`부터 `5`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `작은 문제의 답을 저장해 결합`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙  |
| ------ | --------------------------- |
| C17    | 크기 n+1 배열과 경계 검사   |
| Python | 리스트를 위에서 아래로 채움 |
| Rust   | Vec<usize>와 인덱스 검사    |

C17에서는 `크기 n+1 배열과 경계 검사` 규칙을 적용합니다. "`DP로 중복 계산 줄이기`" 수업의 실행 결과(`5`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `리스트를 위에서 아래로 채움` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Vec<usize>와 인덱스 검사` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`5` 맞히기) → 빈칸(`ways[step-1]` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`기저 경우 수 0을 0으로 두어 모든 값이 0이 됨` 찾기) → 독립 구현(`DP로 중복 계산 줄이기을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `5` 및 `ways[step-1]` 설명과 대조하세요.

## 스스로 설명하기

- "`DP로 중복 계산 줄이기`" 수업이 필요한 이유는 `작은 문제의 답을 저장해 결합` 동작으로 설명해 보세요.
- 예제에서 `ways[step-1]` 부분 실행 직전의 상태와 직후의 출력(`5`)을 말해 보세요.
- "`기저 경우 수 0을 0으로 두어 모든 값이 0이 됨`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `작은 문제의 답을 저장해 결합` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

ways[n]은 n칸까지 오는 경우 수이며 마지막 이동은 n-1 또는 n-2에서 옵니다. Day 79 "`DP로 중복 계산 줄이기`" 예제의 핵심 부분은 `ways[step-1]`이며, 실행 결과는 `5`입니다. "`기저 경우 수 0을 0으로 두어 모든 값이 0이 됨`" 여부를 확인하고 Day 79 수업을 완료하세요.
