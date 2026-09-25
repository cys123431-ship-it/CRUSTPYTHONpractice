---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-72-binary-search
courseId: crp-92
phaseId: phase-07
dayNumber: 72
date: "2026-12-11"
title: 정렬 배열의 이진 탐색
summary: 정렬된 데이터에서 중간 값을 비교하면 탐색 범위를 절반씩 줄일 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-71-complexity
learningObjectives:
  - "'정렬 배열의 이진 탐색' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 정렬되지 않은 배열에 이진 탐색을 적용함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - binary search
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
  - id: ex-day-72-binary-search-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [0,5)에서 시작해 계산하세요.
    starter:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi)\
      \ // 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    answer: "3"
    hint: 반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. 설명을 떠올리고 `[0,5)` 단계부터 순서대로 적어 보세요.
    explanation:
      "[0,5)  →  [3,5)  →  [3,4)  →  위치 3 순서로 실행됩니다. `lo = mid + 1` 부분이 `위치 3` 단계를 확정해 최종 출력 '3'가 됩니다.
      이 흐름을 떠올리면 `정렬된 범위를 반으로 축소` 동작이 왜 필요한지 알 수 있습니다."
    commonMistakes:
      - 정렬되지 않은 배열에 이진 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-72-binary-search-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'정렬 배열의 이진 탐색' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: lo = mid + 1"
    starter:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi)\
      \ // 2\n    if values[mid] < target: _____\n    else: hi = mid\nprint(lo)"
    answer:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi) //\
      \ 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    hint: 힌트 문장을 완전하게 읽으면 `중간 인덱스 2의 값 6이 작아 lo=3입니다` 단계에 필요한 표현이 `lo = mid + 1`입니다.
    explanation:
      "빈칸에 들어갈 표현은 'lo = mid + 1'입니다. `if values[mid] < target: lo = mid + 1` 줄을 완성해야 `정렬된 범위를 반으로 축소`
      동작이 이어져 실행 결과 '3'가 됩니다. 힌트의 첫 단계 `중간 인덱스 2의 값 6이 작아 lo=3입니다`이 바로 이 줄입니다. 이어서 새 중간 4의 값 10은 크므로 hi=4입니다 인덱스
      3의 8에서 수렴합니다 순서로 진행됩니다."
    commonMistakes:
      - 정렬되지 않은 배열에 이진 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-72-binary-search-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 2에서 3로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi)\
      \ // 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    answer:
      "values = [3, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi) //\
      \ 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 2에서 3로."
    explanation:
      바꾼 뒤 출력은 '3'입니다. 원본 출력 '3'와 같습니다. 바뀐 줄은 `values = [3, 4, 6, 8, 10]`입니다. 바뀐 프로그램도 `[0,5)` 단계에서 시작해
      바뀐 줄을 지나 최종 `3`로 끝납니다. 목표 8의 위치는 그대로 3이라 결과가 같습니다. 출력은 같지만 바뀐 줄 부분의 중간 값은 달라졌다가 같은 최종 값으로 이어진다는 점을 위 추적 순서와
      대조해 확인할 수 있습니다.
    commonMistakes:
      - 정렬되지 않은 배열에 이진 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-72-binary-search-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 정렬되지 않은 배열에 이진 탐색을 적용함 상황을 확인하세요.
    starter:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi)\
      \ // 2\n    if values[mid] < target: lo = mid\n    else: hi = mid\nprint(lo)"
    answer:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi) //\
      \ 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    hint: 반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. 설명과 어긋나는 줄을 찾으세요. `정렬되지 않은 배열에 이진 탐색을 적용함` 상황이 단서가 됩니다.
    explanation:
      "틀린 줄은 `if values[mid] < target: lo = mid`입니다. 여기서는 `lo = mid`을 써서 `lo = mid + 1` 동작이 깨집니다. 이대로 실행하면
      `정렬되지 않은 배열에 이진 탐색을 적용함` 문제가 생겨 원본 추적 `[0,5)  →  [3,5)  →  [3,4)  →  위치 3`대로 '3'가 나오지 않습니다. 고친 줄 `if values[mid]
      < target: lo = mid + 1`에서는 `lo = mid + 1`가 `정렬된 범위를 반으로 축소` 동작을 지켜 '3'까지 도달합니다."
    commonMistakes:
      - 정렬되지 않은 배열에 이진 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-72-binary-search-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '정렬 배열의 이진 탐색' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 정렬 배열의 이진 탐색: 직접 구현"
    answer:
      "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo + hi) //\
      \ 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
    hint: 반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `lo = mid + 1` 부분이 `정렬된 범위를 반으로 축소` 동작을 지켜 실행 결과 '3'가 됩니다. 같은 개념을 다른 입력으로 바꿔도
      `lo = mid + 1`부터 `위치 3`까지 추적할 수 있으면 정답입니다. `정렬되지 않은 배열에 이진 탐색을 적용함` 상황과 빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 정렬되지 않은 배열에 이진 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-72-binary-search-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "3"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation:
      "[0,5)  →  [3,5)  →  [3,4)  →  위치 3 순서로 실행되어 출력은 '3'입니다. `lo = mid + 1` 부분이 마지막 단계를 확정하므로 다른 선택지는
      이 추적과 맞지 않습니다."
  - id: quiz-day-72-binary-search-model
    question: "'정렬 배열의 이진 탐색' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 정렬되지 않은 배열에 이진 탐색을 적용함(이것이 정상적인 사용법이다)
      - 반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. 이 설명이 맞는 이유는 `정렬된 범위를 반으로 축소` 동작을 지키는 조건과 같기 때문입니다.
      `정렬되지 않은 배열에 이진 탐색을 적용함` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-72-binary-search-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 정렬되지 않은 배열에 이진 탐색을 적용함
    answerIndex: 2
    explanation: 정렬되지 않은 배열에 이진 탐색을 적용함. 이 실수가 나오면 원본 추적 `[0,5) → [3,5) → [3,4) → 위치 3`대로 '3'가 나오지 않으므로 먼저 확인해야 합니다.
  - id: quiz-day-72-binary-search-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 정렬된 범위를 반으로 축소라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 `정렬된 범위를 반으로 축소` 목적과 입력·출력은 유지합니다. 실행 결과 '3'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource:
  "values = [2, 4, 6, 8, 10]\ntarget = 8\nlo, hi = 0, len(values)\nwhile lo < hi:\n    mid = (lo\
  \ + hi) // 2\n    if values[mid] < target: lo = mid + 1\n    else: hi = mid\nprint(lo)"
---

## 오늘 배울 이유

정렬된 데이터에서 중간 값을 비교하면 탐색 범위를 절반씩 줄일 수 있습니다. Day 72 "`정렬 배열의 이진 탐색`"에서는 Python 코드의 실행 결과(`3`)를 따라가며, `정렬된 범위를 반으로 축소` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`정렬되지 않은 배열에 이진 탐색을 적용함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 71](/learn/day-71-complexity)에서 배운 "시간 복잡도와 입력 크기" 내용을 한 문장으로 말해 보세요. 이번 "`정렬 배열의 이진 탐색`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `lo = mid + 1`입니다.

## 머릿속 그림

반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. Day 72에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `lo = mid + 1`입니다.

```text
[0,5)  →  [3,5)  →  [3,4)  →  위치 3
```

위 흐름에서 `lo = mid + 1` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3`입니다.

## 천천히 풀어보기

이진 탐색은 **미리 정렬된 데이터**에서만 좌우 절반을 버릴 수 있습니다. `[10,20,20,30]`에서 20의 첫 위치를 찾는다면 결과는 1입니다. 범위 `[lo,hi)`는 lo를 포함하고 hi는 제외합니다. 가운데 `mid`가 목표보다 작으면 `lo=mid+1`, 그렇지 않으면 `hi=mid`로 왼쪽 가능성을 남깁니다.

같은 값이 여러 개 있을 때 첫 위치와 아무 위치는 다른 문제입니다. 반복이 끝나 `lo==hi`라도 그 칸이 실제로 목표인지 따로 확인해야 합니다. 비어 있는 배열에서는 처음부터 `lo==hi==0`입니다. 정렬이 깨진 입력에는 이 방식의 정답을 약속할 수 없습니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 72 "`정렬 배열의 이진 탐색`"의 독립 예제입니다. 전체 8줄 가운데 핵심 부분은 `lo = mid + 1`이며, 실행 결과는 `3`입니다.

```python
values = [2, 4, 6, 8, 10]
target = 8
lo, hi = 0, len(values)
while lo < hi:
    mid = (lo + hi) // 2
    if values[mid] < target: lo = mid + 1
    else: hi = mid
print(lo)
```

예상 출력:

```text
3
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`3`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `lo = mid + 1`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | values = [2, 4, 6, 8, 10]
 2 | target = 8
 3 | lo, hi = 0, len(values)
 4 | while lo < hi:
 5 |     mid = (lo + hi) // 2
 6 |     if values[mid] < target: lo = mid + 1
 7 |     else: hi = mid
 8 | print(lo)
```

1. 중간 인덱스 2의 값 6이 작아 lo=3입니다
2. 새 중간 4의 값 10은 크므로 hi=4입니다
3. 인덱스 3의 8에서 수렴합니다

`lo = mid + 1` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [0,5)          |
|    2 | [3,5)          |
|    3 | [3,4)          |
|    4 | 위치 3         |

위 순서대로 실행한 최종 출력은 `3`입니다. `[0,5)` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

정렬된 `[2,4,4,8]`에서 4가 **처음 나오는 위치**는 1입니다. 가운데가 4여도 거기서 바로 끝내면 2를 반환할 수 있습니다. 조건이 맞을 때도 `hi=mid`로 왼쪽 절반을 남겨 탐색이 끝나면 1을 얻습니다. 목표가 5라면 끝난 위치의 값이 5인지 확인하고 없다고 답해야 합니다.

## 시간과 공간 복잡도

정렬된 배열의 이진 탐색은 절반씩 버려 O(log n)입니다. 중복된 4가 여러 개면 왼쪽 절반을 남겨 첫 위치를 찾습니다. 끝난 위치의 값이 목표와 같은지 확인해야 합니다. 정렬되지 않은 배열에는 그대로 쓸 수 없습니다. Day 72의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `3`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
values = [3, 4, 6, 8, 10]
target = 8
lo, hi = 0, len(values)
while lo < hi:
    mid = (lo + hi) // 2
    if values[mid] < target: lo = mid + 1
    else: hi = mid
print(lo)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
3
```

바꾼 뒤 출력도 `3`입니다. 목표 8의 위치는 그대로 3이라 결과가 같습니다. 바뀐 프로그램도 `[0,5)` 단계에서 시작해 `values = [3, 4, 6, 8, 10]` 줄을 지나 최종 `3`로 끝납니다. 원본 추적 `[0,5)  →  [3,5)  →  [3,4)  →  위치 3`와 바뀐 줄 이후를 순서대로 놓으면 출력은 같아도 중간 값이 어디서 달라졌다가 합쳐지는지 확인할 수 있습니다.

## 자주 틀리는 지점

**확인할 실수: 정렬되지 않은 배열에 이진 탐색을 적용함.** 정상 코드의 실행 결과는 `3`입니다.

- 정상 줄: `if values[mid] < target: lo = mid + 1`
- 잘못된 줄: `if values[mid] < target: lo = mid`

두 줄을 나란히 놓으면 정상 줄 `if values[mid] < target: lo = mid + 1`이 `반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다.` 설명과 맞고, 잘못된 줄은 `정렬되지 않은 배열에 이진 탐색을 적용함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `[0,5)`부터 `3`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `정렬된 범위를 반으로 축소`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙               |
| ------ | ---------------------------------------- |
| C17    | size_t lo,hi와 overflow 없는 mid         |
| Python | lo/hi 반열린 구간                        |
| Rust   | slice.binary_search 또는 partition_point |

C17에서는 `size_t lo,hi와 overflow 없는 mid` 규칙을 적용합니다. "`정렬 배열의 이진 탐색`" 수업의 실행 결과(`3`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `lo/hi 반열린 구간` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `slice.binary_search 또는 partition_point` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`3` 맞히기) → 빈칸(`lo = mid + 1` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`정렬되지 않은 배열에 이진 탐색을 적용함` 찾기) → 독립 구현(`'정렬 배열의 이진 탐색' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3` 및 `lo = mid + 1` 설명과 대조하세요.

## 스스로 설명하기

- "`정렬 배열의 이진 탐색`" 수업이 필요한 이유는 `정렬된 범위를 반으로 축소` 동작으로 설명해 보세요.
- 예제에서 `lo = mid + 1` 부분 실행 직전의 상태와 직후의 출력(`3`)을 말해 보세요.
- "`정렬되지 않은 배열에 이진 탐색을 적용함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `정렬된 범위를 반으로 축소` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

반열린 범위 [lo,hi)에서 target 이상이 처음 나타나는 위치를 유지합니다. Day 72 "`정렬 배열의 이진 탐색`" 예제의 핵심 부분은 `lo = mid + 1`이며, 실행 결과는 `3`입니다. "`정렬되지 않은 배열에 이진 탐색을 적용함`" 여부를 확인하고 Day 72 수업을 완료하세요.
