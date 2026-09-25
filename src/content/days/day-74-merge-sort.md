---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-74-merge-sort
courseId: crp-92
phaseId: phase-07
dayNumber: 74
date: "2026-12-13"
title: 병합 정렬의 분할·병합
summary: 큰 배열을 정렬하려면 반으로 나눈 뒤 이미 정렬된 두 부분을 합칠 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-73-insertion-sort
learningObjectives:
  - "'병합 정렬의 분할·병합' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - merge sort
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
  - id: ex-day-74-merge-sort-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [4,1,3,2]에서 시작해 계산하세요.
    starter:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    answer: "[1, 2, 3, 4]"
    hint: "[4,1,3,2]에서 시작해 [1,2,3,4]까지 순서대로 적어 보세요. 길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합합니다."
    explanation:
      1. 길이 2 미만을 기저로 둡니다. 2. [4,1]과 [3,2]를 각각 [1,4], [2,3]으로 정렬합니다. 3. 두 부분의 앞 원소를 비교해 작은 값을 옮깁니다. 4.
      남은 부분을 붙여 최종 결과를 만듭니다. `[4,1,3,2] → [1,4]+[2,3] → [1,2,3,4]` 흐름으로 실제 출력 `[1, 2, 3, 4]`가 됩니다. 핵심 `a[i] <= b[j]`는
      앞 원소 중 작은 쪽을 고르는 자리에 쓰입니다.
    commonMistakes:
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-74-merge-sort-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 병합 정렬의 분할·병합의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: a[i] <= b[j]"
    starter:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if _____: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n    return\
      \ out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    answer:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    hint: 필요한 표현은 분할한 부분을 정렬해 병합 동작을 잇는 a[i] <= b[j]입니다.
    explanation:
      빈칸에 들어갈 표현은 'a[i] <= b[j]'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. 길이 2 미만을 기저로 둡니다. 2. [4,1]과 [3,2]를 각각 [1,4],
      [2,3]으로 정렬합니다. 3. 두 부분의 앞 원소를 비교해 작은 값을 옮깁니다. 4. 남은 부분을 붙여 최종 결과를 만듭니다. `[4,1,3,2] → [1,4]+[2,3] → [1,2,3,4]`
      흐름으로 실제 출력 `[1, 2, 3, 4]`가 됩니다. 핵심 `a[i] <= b[j]`는 앞 원소 중 작은 쪽을 고르는 자리에 쓰입니다.
    commonMistakes:
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-74-merge-sort-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    answer:
      "def merge_sort(values):\n    if len(values) < 3: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '[1, 2, 3, 4]'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '[3, 2, 4, 1]'입니다. 원본은 `[1, 2, 3, 4]`, 수정본은 `[3, 2, 4, 1]`이다. 첫 변경 줄의 기저 조건 `< 2`에서 `< 3`으로
      바꾸면, 길이 2 부분도 정렬 없이 그대로 돌아 병합 순서가 어긋난다.
    commonMistakes:
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-74-merge-sort-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림 상황을 확인하세요.
    starter:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] >= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    answer:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    hint:
      부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림 상황에서 어긋나는 줄을 길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며
      병합합니다. 설명과 대조해 보세요.
    explanation:
      "틀린 줄은 `if a[i] >= b[j]: out.append(a[i]); i += 1`입니다. 크거나 같은 조건에서 왼쪽을 뽑으므로 작은 값부터 쌓이지 않고 순서가 어긋나
      실행은 되지만 `[4, 3, 2, 1]`이라는 정렬되지 않은 결과가 됩니다. 오류 분류는 잘못된 출력입니다. 병합 순서가 어긋나는 첫 순간은 앞 원소 비교입니다. 고친 줄 `if a[i] <=
      b[j]: out.append(a[i]); i += 1`에서는 `분할한 부분을 정렬해 병합` 동작이 지켜집니다. 정상 코드는 분할→부분 정렬→앞 비교 병합→꼬리 연결의 순서로 `[1, 2, 3,
      4]`를 출력합니다."
    commonMistakes:
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-74-merge-sort-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 병합 정렬의 분할·병합 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 병합 정렬의 분할·병합: 직접 구현"
    answer:
      "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n    a, b\
      \ = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a) and j\
      \ < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n   \
      \ return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
    hint: 원소가 하나 이하일 때 멈추는 것이 재귀의 바닥입니다. 같을 때 왼쪽 값을 먼저 뽑아야 순서가 유지됩니다. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 원소가 하나 이하일 때 멈추는 것이 재귀의 바닥입니다. 같을 때 왼쪽 값을 먼저 뽑아야 순서가 유지됩니다. 같은 분할한 부분을
      정렬해 병합 동작을 구현하고 실행 결과 '[1, 2, 3, 4]'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-74-merge-sort-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "[1, 2, 3, 4]"
    answerIndex: 2
    explanation:
      먼저 [4,1]과 [3,2]가 각각 [1,4], [2,3]으로 정렬됩니다. 이어서 앞 원소를 비교해 작은 값을 옮기고 남은 꼬리를 붙여 [1,2,3,4]가 되므로 출력 `[1,
      2, 3, 4]`가 됩니다. `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 분할과 병합이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기
      때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-74-merge-sort-model
    question: "'병합 정렬의 분할·병합' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합합니다.
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      길이가 1 이하인 부분은 이미 정렬됐다는 뜻이고, 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합한다는 뜻은 작은 쪽부터 쌓는다는 뜻입니다. `부분 배열의
      정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림`은 반대 사례인데, 순서가 어긋나거나 값이 빠지기 때문입니다.
  - id: quiz-day-74-merge-sort-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      먼저 확인할 실수는 `부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림`입니다. 잘못된 코드는 실행은 되지만 정렬되지 않은 잘못된 출력을 냅니다. 비교 방향과 꼬리
      연결을 확인하세요.
  - id: quiz-day-74-merge-sort-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 분할한 부분을 정렬해 병합라는 동작과 경계 조건
    answerIndex: 2
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `분할한 부분을 정렬해 병합`이라는 의미와 입력·출력 계약입니다. C의 배열 병합과 Rust의 벡터 병합으로 같은 동작을 구현하고, 실행
      결과 `[1, 2, 3, 4]`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource:
  "def merge_sort(values):\n    if len(values) < 2: return values\n    mid = len(values) // 2\n\
  \    a, b = merge_sort(values[:mid]), merge_sort(values[mid:])\n    out = []; i = j = 0\n    while i < len(a)\
  \ and j < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n\
  \    return out + a[i:] + b[j:]\nprint(merge_sort([4, 1, 3, 2]))"
---

## 오늘 배울 이유

큰 배열을 정렬하려면 반으로 나눈 뒤 이미 정렬된 두 부분을 합칠 수 있습니다. Day 74 "`병합 정렬의 분할·병합`"에서는 Python 코드의 실행 결과(`[1, 2, 3, 4]`)를 따라가며, `분할한 부분을 정렬해 병합` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 73](/learn/day-73-insertion-sort)에서 배운 "삽입 정렬의 정렬된 접두부" 내용을 한 문장으로 말해 보세요. 이번 "`병합 정렬의 분할·병합`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `a[i] <= b[j]`입니다.

## 머릿속 그림

길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합합니다. Day 74에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `a[i] <= b[j]`입니다.

```text
[4,1,3,2]  →  [1,4]+[2,3]  →  [1,2,3,4]
```

위 흐름에서 `a[i] <= b[j]` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[1, 2, 3, 4]`입니다.

## 천천히 풀어보기

병합 정렬은 큰 목록을 반으로 나눠 작은 목록을 먼저 정렬하고, 정렬된 두 목록을 합칩니다. `[4,1,3,2]`는 `[4,1]`과 `[3,2]`로 나뉘고 `[1,4]`, `[2,3]`으로 정렬된 뒤 `[1,2,3,4]`로 합쳐집니다.

합칠 때는 각 부분의 맨 앞 값만 비교하면 됩니다. 한쪽이 먼저 비면 남은 쪽을 그대로 붙입니다. 원소가 하나 이하일 때 멈추는 것이 재귀의 바닥입니다. 시간은 보통 `O(n log n)`이고 병합을 위한 추가 공간이 필요합니다. 같은 값의 순서를 유지하려면 같을 때 왼쪽 값을 먼저 뽑으세요.

병합 정렬은 큰 목록을 반으로 나눠 작은 목록을 먼저 정렬하고, 정렬된 두 목록을 합칩니다. `[4,1,3,2]`는 `[4,1]`과 `[3,2]`로 나뉘고 `[1,4]`, `[2,3]`으로 정렬된 뒤 `[1,2,3,4]`로 합쳐집니다.

합칠 때는 각 부분의 맨 앞 값만 비교하면 됩니다. 한쪽이 먼저 비면 남은 쪽을 그대로 붙입니다. 원소가 하나 이하일 때 멈추는 것이 재귀의 바닥입니다. 시간은 보통 `O(n log n)`이고 병합을 위한 추가 공간이 필요합니다. 같은 값의 순서를 유지하려면 같을 때 왼쪽 값을 먼저 뽑으세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 74 "`병합 정렬의 분할·병합`"의 독립 예제입니다. 전체 10줄 가운데 핵심 부분은 `a[i] <= b[j]`이며, 실행 결과는 `[1, 2, 3, 4]`입니다.

```python
def merge_sort(values):
    if len(values) < 2: return values
    mid = len(values) // 2
    a, b = merge_sort(values[:mid]), merge_sort(values[mid:])
    out = []; i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]: out.append(a[i]); i += 1
        else: out.append(b[j]); j += 1
    return out + a[i:] + b[j:]
print(merge_sort([4, 1, 3, 2]))
```

예상 출력:

```text
[1, 2, 3, 4]
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`[1, 2, 3, 4]`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `a[i] <= b[j]`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```python
 1 | def merge_sort(values):
 2 |     if len(values) < 2: return values
 3 |     mid = len(values) // 2
 4 |     a, b = merge_sort(values[:mid]), merge_sort(values[mid:])
 5 |     out = []; i = j = 0
 6 |     while i < len(a) and j < len(b):
 7 |         if a[i] <= b[j]: out.append(a[i]); i += 1
 8 |         else: out.append(b[j]); j += 1
 9 |     return out + a[i:] + b[j:]
10 | print(merge_sort([4, 1, 3, 2]))
```

1. 길이 2 미만을 기저로 둡니다
2. [4,1]과 [3,2]를 각각 [1,4], [2,3]으로 정렬합니다
3. 두 부분의 i,j 인덱스를 비교해 작은 값을 옮깁니다
4. 남은 부분을 붙여 최종 결과를 만듭니다

`a[i] <= b[j]` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [4,1,3,2]      |
|    2 | [1,4]+[2,3]    |
|    3 | [1,2,3,4]      |

위 순서대로 실행한 최종 출력은 `[1, 2, 3, 4]`입니다. `[4,1,3,2]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

정렬된 두 목록 `[1,4]`와 `[2,3]`을 합칠 때 맨 앞끼리 비교해 1, 다음 2, 다음 3을 고르고 왼쪽에 남은 4를 붙입니다. `[1,2,3,4]`입니다. 두 목록이 원래 정렬되어 있지 않다면 앞 원소만 비교하는 병합 규칙으로는 정렬 결과를 보장하지 못합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `[1, 2, 3, 4]`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
def merge_sort(values):
    if len(values) < 3: return values
    mid = len(values) // 2
    a, b = merge_sort(values[:mid]), merge_sort(values[mid:])
    out = []; i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]: out.append(a[i]); i += 1
        else: out.append(b[j]); j += 1
    return out + a[i:] + b[j:]
print(merge_sort([4, 1, 3, 2]))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
[3, 2, 4, 1]
```

원본은 `[1, 2, 3, 4]`, 수정본은 `[3, 2, 4, 1]`이다. 첫 변경 줄의 기저 조건 `< 2`에서 `< 3`으로 바꾸면, 길이 2 부분도 정렬 없이 그대로 돌아 병합 순서가 어긋난다.

## 자주 틀리는 지점

**확인할 실수: 부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림.** 정상 코드의 실행 결과는 `[1, 2, 3, 4]`입니다.

- 정상 줄: `if a[i] <= b[j]: out.append(a[i]); i += 1`
- 잘못된 줄: `if a[i] >= b[j]: out.append(a[i]); i += 1`

두 줄을 나란히 놓으면 정상 줄 `if a[i] <= b[j]: out.append(a[i]); i += 1`이 `길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합합니다.` 설명과 맞고, 잘못된 줄은 `부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림` 쪽으로 어긋납니다. 결과가 예상과 다르면 `[4,1,3,2]`부터 `[1, 2, 3, 4]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `분할한 부분을 정렬해 병합`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | 보조 배열에 O(n) 병합             |
| Python | 인덱스로 두 부분 병합, O(n log n) |
| Rust   | slice 분할 후 임시 Vec에 병합     |

C17에서는 `보조 배열에 O(n) 병합` 규칙을 적용합니다. "`병합 정렬의 분할·병합`" 수업의 실행 결과(`[1, 2, 3, 4]`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `인덱스로 두 부분 병합, O(n log n)` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `slice 분할 후 임시 Vec에 병합` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`[1, 2, 3, 4]` 맞히기) → 빈칸(`a[i] <= b[j]` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림` 찾기) → 독립 구현(`'병합 정렬의 분할·병합' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[1, 2, 3, 4]` 및 `a[i] <= b[j]` 설명과 대조하세요.

## 스스로 설명하기

- "`병합 정렬의 분할·병합`" 수업이 필요한 이유는 `분할한 부분을 정렬해 병합` 동작으로 설명해 보세요.
- 예제에서 `a[i] <= b[j]` 부분 실행 직전의 상태와 직후의 출력(`[1, 2, 3, 4]`)을 말해 보세요.
- "`부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `분할한 부분을 정렬해 병합` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

길이가 1 이하인 부분은 이미 정렬됐습니다. 나머지는 반으로 나눈 뒤 두 정렬된 부분의 앞 원소를 비교하며 병합합니다. Day 74 "`병합 정렬의 분할·병합`" 예제의 핵심 부분은 `a[i] <= b[j]`이며, 실행 결과는 `[1, 2, 3, 4]`입니다. "`부분 배열의 정렬이 끝나기 전에 병합하거나 남은 꼬리를 빠뜨림`" 여부를 확인하고 Day 74 수업을 완료하세요.
