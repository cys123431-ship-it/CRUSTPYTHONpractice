---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-71-complexity
courseId: crp-92
phaseId: phase-07
dayNumber: 71
date: "2026-12-10"
title: 시간 복잡도와 입력 크기
summary: 입력 크기가 커질 때 작업 수가 어떻게 늘어나는지 봐야 자료구조와 알고리즘을 비교할 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-70-structures-review
learningObjectives:
  - "'시간 복잡도와 입력 크기' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - complexity
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
  - id: ex-day-71-complexity-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 0에서 시작해 계산하세요.
    starter: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    answer: "4"
    hint: 원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.
    explanation: 0  →  1  →  2  →  3  →  4. 따라서 출력은 '4'입니다.
    commonMistakes:
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-71-complexity-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 시간 복잡도와 입력 크기의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: steps += 1"
    starter: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    _____\nprint(steps)"
    answer: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    hint: 배열 길이는 4입니다
    explanation: 빈칸에는 'steps += 1'이 들어갑니다. 배열 길이는 4입니다 각 원소를 방문할 때 steps를 1 올립니다 4번 방문 후 4를 출력합니다
    commonMistakes:
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-71-complexity-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    answer: "values = [3, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 2에서 3로 바꿨습니다. 원래 출력은 '4'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-71-complexity-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함 상황을 확인하세요.
    starter: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 2\nprint(steps)"
    answer: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    hint: 원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 배열 길이는 4입니다 각 원소를 방문할 때 steps를 1 올립니다 4번 방문 후 4를 출력합니다
    commonMistakes:
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-71-complexity-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '시간 복잡도와 입력 크기' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 시간 복잡도와 입력 크기: 직접 구현"
    answer: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
    hint: 원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 배열 길이는 4입니다 각 원소를 방문할 때 steps를 1 올립니다 4번 방문 후 4를 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-71-complexity-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "4"
    answerIndex: 2
    explanation: 0  →  1  →  2  →  3  →  4 순서로 실행되어 '4'을 출력합니다.
  - id: quiz-day-71-complexity-model
    question: 시간 복잡도와 입력 크기을 이해하는 데 맞는 설명은?
    choices:
      - 원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.
  - id: quiz-day-71-complexity-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-71-complexity-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 입력 크기와 작업 수의 증가율 파악라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 입력 크기와 작업 수의 증가율 파악라는 목적과 입력·출력은 유지합니다.
playgroundSource: "values = [2, 4, 6, 8]\nsteps = 0\nfor value in values:\n    steps += 1\nprint(steps)"
---

## 오늘 배울 이유

입력 크기가 커질 때 작업 수가 어떻게 늘어나는지 봐야 자료구조와 알고리즘을 비교할 수 있습니다. Day 71 "`시간 복잡도와 입력 크기`"에서는 Python 코드의 실행 결과(`4`)를 따라가며, `입력 크기와 작업 수의 증가율 파악` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 70](/learn/day-70-structures-review)에서 배운 "자료구조 선택 회상" 내용을 한 문장으로 말해 보세요. 이번 "`시간 복잡도와 입력 크기`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `steps += 1`입니다.

## 머릿속 그림

원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다. Day 71에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `steps += 1`입니다.

```text
0  →  1  →  2  →  3  →  4
```

위 흐름에서 `steps += 1` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `4`입니다.

## 천천히 풀어보기

시간 복잡도는 입력이 커질 때 작업 수가 어떻게 늘어나는지를 설명합니다. 원소 3개를 한 번씩 보면 3번, 6개를 보면 6번이므로 `O(n)`입니다. 중첩 반복으로 모든 두 원소를 비교하면 대략 n×n번이라 `O(n²)`이 됩니다.

`O(n)`은 정확히 n초 걸린다는 뜻이 아닙니다. 실행 환경과 각 작업의 비용을 생략하고 **증가하는 방식**을 보는 표기입니다. 예제에서 `steps += 1`이 어떤 반복 안에 있는지 보고 n이 0, 1, 5일 때 몇 번 실행되는지 표로 적어 보세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 71 "`시간 복잡도와 입력 크기`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `steps += 1`이며, 실행 결과는 `4`입니다.

```python
values = [2, 4, 6, 8]
steps = 0
for value in values:
    steps += 1
print(steps)
```

예상 출력:

```text
4
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`4`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `steps += 1`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | values = [2, 4, 6, 8]
 2 | steps = 0
 3 | for value in values:
 4 |     steps += 1
 5 | print(steps)
```

1. 배열 길이는 4입니다
2. 각 원소를 방문할 때 steps를 1 올립니다
3. 4번 방문 후 4를 출력합니다

`steps += 1` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 0              |
|    2 | 1              |
|    3 | 2              |
|    4 | 3              |
|    5 | 4              |

위 순서대로 실행한 최종 출력은 `4`입니다. `0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

원소가 4개인 목록을 한 번씩 검사하면 핵심 방문은 4번입니다. 8개면 8번이라 두 배가 됩니다. 모든 원소 쌍을 중첩 반복하면 4개에서 16번, 8개에서 64번으로 네 배입니다. `O(n)`과 `O(n²)`를 비교할 때는 컴퓨터 속도보다 **입력이 늘어난 비율**을 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `4`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
values = [3, 4, 6, 8]
steps = 0
for value in values:
    steps += 1
print(steps)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
4
```

`4`로 같습니다. 세는 것은 원소 개수라 들어 있는 값과 무관해 결과가 같습니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`values = [3, 4, 6, 8]`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함.** 정상 코드의 실행 결과는 `4`입니다.

- 정상 줄: `steps += 1`
- 잘못된 줄: `steps += 2`

두 줄을 나란히 놓고 `원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `0`부터 `4`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `입력 크기와 작업 수의 증가율 파악`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | 루프 반복 횟수 n을 세기    |
| Python | for 순회 횟수 n            |
| Rust   | iterator가 n개 원소를 방문 |

C17에서는 `루프 반복 횟수 n을 세기` 규칙을 적용합니다. "`시간 복잡도와 입력 크기`" 수업의 실행 결과(`4`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `for 순회 횟수 n` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `iterator가 n개 원소를 방문` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`4` 맞히기) → 빈칸(`steps += 1` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함` 찾기) → 독립 구현(`시간 복잡도와 입력 크기을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `4` 및 `steps += 1` 설명과 대조하세요.

## 스스로 설명하기

- "`시간 복잡도와 입력 크기`" 수업이 필요한 이유는 `입력 크기와 작업 수의 증가율 파악` 동작으로 설명해 보세요.
- 예제에서 `steps += 1` 부분 실행 직전의 상태와 직후의 출력(`4`)을 말해 보세요.
- "`O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `입력 크기와 작업 수의 증가율 파악` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

원소 n개를 한 번씩 방문하면 작업 수가 n에 비례하므로 O(n)입니다. 실제 시간과 상수는 따로 측정합니다. Day 71 "`시간 복잡도와 입력 크기`" 예제의 핵심 부분은 `steps += 1`이며, 실행 결과는 `4`입니다. "`O(n)을 실제 실행 시간이 정확히 n초라는 뜻으로 착각함`" 여부를 확인하고 Day 71 수업을 완료하세요.
