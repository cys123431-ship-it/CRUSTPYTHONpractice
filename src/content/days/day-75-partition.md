---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-75-partition
courseId: crp-92
phaseId: phase-07
dayNumber: 75
date: "2026-12-14"
title: 퀵 정렬의 분할 기준
summary: 퀵 정렬은 기준보다 작은 구역과 나머지를 나누는 분할 연산이 핵심입니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-74-merge-sort
learningObjectives:
  - "'퀵 정렬의 분할 기준' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - partition
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
  - id: ex-day-75-partition-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [4,1,3,2,3]에서 시작해 계산하세요.
    starter:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    answer: "[1, 2, 3, 3, 4]"
    hint: 첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.
    explanation: "[4,1,3,2,3]  →  피벗4  →  피벗3  →  [1,2,3,3,4]. 따라서 출력은 '[1, 2, 3, 3, 4]'입니다."
    commonMistakes:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-75-partition-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 퀵 정렬의 분할 기준의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: v >= pivot"
    starter:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if _____]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    answer:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    hint: 원소가 하나면 그대로 반환합니다
    explanation:
      빈칸에는 'v >= pivot'이 들어갑니다. 원소가 하나면 그대로 반환합니다 피벗 4 아래에 1,3,2,3이 모입니다 다음 피벗 1·3이 각각 부분을 나눕니다 재귀 결과를
      합쳐 중복 3을 모두 유지합니다
    commonMistakes:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-75-partition-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    answer:
      "def quick_sort(values):\n    if len(values) < 3: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 2에서 3로 바꿨습니다. 원래 출력은 '[1, 2, 3, 3, 4]'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요.
      출력이 같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-75-partition-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음 상황을 확인하세요.
    starter:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v > pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    answer:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    hint: 첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.
    explanation:
      원래 예시와 비교하여 잘못된 줄을 찾으세요. 원소가 하나면 그대로 반환합니다 피벗 4 아래에 1,3,2,3이 모입니다 다음 피벗 1·3이 각각 부분을 나눕니다 재귀 결과를 합쳐
      중복 3을 모두 유지합니다
    commonMistakes:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-75-partition-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '퀵 정렬의 분할 기준' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 퀵 정렬의 분할 기준: 직접 구현"
    answer:
      "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less = [v\
      \ for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
      \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
    hint: 첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 원소가 하나면 그대로 반환합니다 피벗 4 아래에 1,3,2,3이 모입니다 다음 피벗 1·3이 각각 부분을 나눕니다 재귀 결과를 합쳐
      중복 3을 모두 유지합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-75-partition-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "[1, 2, 3, 3, 4]"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: "[4,1,3,2,3]  →  피벗4  →  피벗3  →  [1,2,3,3,4] 순서로 실행되어 '[1, 2, 3, 3, 4]'을 출력합니다."
  - id: quiz-day-75-partition-model
    question: 퀵 정렬의 분할 기준을 이해하는 데 맞는 설명은?
    choices:
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음(이것이 정상적인 사용법이다)
      - 첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.
  - id: quiz-day-75-partition-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음
    answerIndex: 2
    explanation: 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-75-partition-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 피벗 기준 분할 후 재귀적으로 정렬라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 피벗 기준 분할 후 재귀적으로 정렬라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "def quick_sort(values):\n    if len(values) < 2: return values\n    pivot = values[0]\n    less\
  \ = [v for v in values[1:] if v < pivot]\n    more = [v for v in values[1:] if v >= pivot]\n    return quick_sort(less)\
  \ + [pivot] + quick_sort(more)\nprint(quick_sort([4, 1, 3, 2, 3]))"
---

## 오늘 배울 이유

퀵 정렬은 기준보다 작은 구역과 나머지를 나누는 분할 연산이 핵심입니다. Day 75 "`퀵 정렬의 분할 기준`"에서는 Python 코드의 실행 결과(`[1, 2, 3, 3, 4]`)를 따라가며, `피벗 기준 분할 후 재귀적으로 정렬` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 74](/learn/day-74-merge-sort)에서 배운 "병합 정렬의 분할·병합" 내용을 한 문장으로 말해 보세요. 이번 "`퀵 정렬의 분할 기준`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `v >= pivot`입니다.

## 머릿속 그림

첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다. Day 75에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `v >= pivot`입니다.

```text
[4,1,3,2,3]  →  피벗4  →  피벗3  →  [1,2,3,3,4]
```

위 흐름에서 `v >= pivot` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[1, 2, 3, 3, 4]`입니다.

## 천천히 풀어보기

퀵 정렬은 피벗 하나를 정하고 나머지를 피벗보다 작은 쪽과 크거나 같은 쪽으로 분리합니다. `[3,1,4,2]`에서 피벗 3이면 작은 쪽 `[1,2]`, 큰 쪽 `[4]`입니다. 양쪽을 다시 정렬한 뒤 작은 쪽 + 피벗 + 큰 쪽으로 합칩니다.

이해용 예제처럼 새 리스트를 만들면 제자리 정렬 구현과 공간 사용이 다릅니다. 피벗이 매번 최솟값이 되는 입력에서는 분할이 한쪽으로 치우쳐 최악 `O(n²)`이 될 수 있습니다. 빈 부분과 한 원소 부분에서 재귀가 끝나는지도 확인하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 75 "`퀵 정렬의 분할 기준`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `v >= pivot`이며, 실행 결과는 `[1, 2, 3, 3, 4]`입니다.

```python
def quick_sort(values):
    if len(values) < 2: return values
    pivot = values[0]
    less = [v for v in values[1:] if v < pivot]
    more = [v for v in values[1:] if v >= pivot]
    return quick_sort(less) + [pivot] + quick_sort(more)
print(quick_sort([4, 1, 3, 2, 3]))
```

예상 출력:

```text
[1, 2, 3, 3, 4]
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`[1, 2, 3, 3, 4]`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `v >= pivot`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | def quick_sort(values):
 2 |     if len(values) < 2: return values
 3 |     pivot = values[0]
 4 |     less = [v for v in values[1:] if v < pivot]
 5 |     more = [v for v in values[1:] if v >= pivot]
 6 |     return quick_sort(less) + [pivot] + quick_sort(more)
 7 | print(quick_sort([4, 1, 3, 2, 3]))
```

1. 원소가 하나면 그대로 반환합니다
2. 피벗 4 아래에 1,3,2,3이 모입니다
3. 다음 피벗 1·3이 각각 부분을 나눕니다
4. 재귀 결과를 합쳐 중복 3을 모두 유지합니다

`v >= pivot` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [4,1,3,2,3]    |
|    2 | 피벗4          |
|    3 | 피벗3          |
|    4 | [1,2,3,3,4]    |

위 순서대로 실행한 최종 출력은 `[1, 2, 3, 3, 4]`입니다. `[4,1,3,2,3]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`[3,1,3,2]`에서 피벗을 첫 3으로 고르면 작은 쪽 `[1,2]`, 크거나 같은 쪽 `[3]`입니다. 합치면 `[1,2,3,3]`입니다. 오른쪽을 `v > pivot`으로만 만들어 같음 3을 누락하면 원소가 하나 사라집니다. **정렬 전후 항목 개수가 같은지** 먼저 확인하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `[1, 2, 3, 3, 4]`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
def quick_sort(values):
    if len(values) < 3: return values
    pivot = values[0]
    less = [v for v in values[1:] if v < pivot]
    more = [v for v in values[1:] if v >= pivot]
    return quick_sort(less) + [pivot] + quick_sort(more)
print(quick_sort([4, 1, 3, 2, 3]))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
[1, 2, 3, 3, 4]
```

`[1, 2, 3, 3, 4]`로 같습니다. 길이 3인 부분도 그대로 분할되므로 정렬 결과가 같습니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`if len(values) < 3: return values`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: 피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음.** 정상 코드의 실행 결과는 `[1, 2, 3, 3, 4]`입니다.

- 정상 줄: `more = [v for v in values[1:] if v >= pivot]`
- 잘못된 줄: `more = [v for v in values[1:] if v > pivot]`

두 줄을 나란히 놓고 `첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `[4,1,3,2,3]`부터 `[1, 2, 3, 3, 4]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `피벗 기준 분할 후 재귀적으로 정렬`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙                        |
| ------ | ------------------------------------------------- |
| C17    | 인덱스 교환으로 제자리 분할                       |
| Python | 학습용 새 리스트 분할, 평균 O(n log n)·최악 O(n²) |
| Rust   | partition 또는 두 Vec로 분할                      |

C17에서는 `인덱스 교환으로 제자리 분할` 규칙을 적용합니다. "`퀵 정렬의 분할 기준`" 수업의 실행 결과(`[1, 2, 3, 3, 4]`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `학습용 새 리스트 분할, 평균 O(n log n)·최악 O(n²)` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `partition 또는 두 Vec로 분할` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`[1, 2, 3, 3, 4]` 맞히기) → 빈칸(`v >= pivot` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음` 찾기) → 독립 구현(`퀵 정렬의 분할 기준을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[1, 2, 3, 3, 4]` 및 `v >= pivot` 설명과 대조하세요.

## 스스로 설명하기

- "`퀵 정렬의 분할 기준`" 수업이 필요한 이유는 `피벗 기준 분할 후 재귀적으로 정렬` 동작으로 설명해 보세요.
- 예제에서 `v >= pivot` 부분 실행 직전의 상태와 직후의 출력(`[1, 2, 3, 3, 4]`)을 말해 보세요.
- "`피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `피벗 기준 분할 후 재귀적으로 정렬` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

첫 값을 피벗으로 뽑고 나머지를 작은 값과 이상인 값으로 나눕니다. 각 부분을 다시 정렬해 피벗 양쪽에 붙입니다. Day 75 "`퀵 정렬의 분할 기준`" 예제의 핵심 부분은 `v >= pivot`이며, 실행 결과는 `[1, 2, 3, 3, 4]`입니다. "`피벗과 같은 값을 두 그룹 모두에서 제외해 중복 원소를 잃음`" 여부를 확인하고 Day 75 수업을 완료하세요.
