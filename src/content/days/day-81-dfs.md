---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-81-dfs
courseId: crp-92
phaseId: phase-07
dayNumber: 81
date: "2026-12-20"
title: 깊이 우선 탐색과 순환
summary: 그래프에는 사이클이 있으므로 깊게 따라가더라도 방문 표시 없이는 끝나지 않을 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-80-backtracking
learningObjectives:
  - "'깊이 우선 탐색과 순환' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - dfs
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
  - id: ex-day-81-dfs-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? A 방문에서 시작해 계산하세요.
    starter:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node\
      \ in seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    answer: "3"
    hint: DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.
    explanation: A 방문  →  B 방문  →  C 방문  →  A 재방문 차단. 따라서 출력은 '3'입니다.
    commonMistakes:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-81-dfs-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 깊이 우선 탐색과 순환의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: seen.add(node)"
    starter:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node\
      \ in seen: return\n    _____\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    answer:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node in\
      \ seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    hint: A를 표시하고 B로 갑니다
    explanation: 빈칸에는 'seen.add(node)'이 들어갑니다. A를 표시하고 B로 갑니다 B를 표시하고 C로 갑니다 C의 다음 A는 이미 방문해 돌아옵니다
    commonMistakes:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-81-dfs-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 'dfs("A")'을 'dfs("B")'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node\
      \ in seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    answer:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node in\
      \ seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"B\")\nprint(len(seen))"
    hint: '''dfs("A")''을 ''dfs("B")''로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.'
    explanation:
      예시 답안에서는 'dfs("A")'을 'dfs("B")'로 바꿨습니다. 원래 출력은 '3'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-81-dfs-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함 상황을 확인하세요.
    starter:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node\
      \ in seen: return\n    seen.remove(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    answer:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node in\
      \ seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    hint: DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. A를 표시하고 B로 갑니다 B를 표시하고 C로 갑니다 C의 다음 A는 이미 방문해 돌아옵니다
    commonMistakes:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-81-dfs-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '깊이 우선 탐색과 순환' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 깊이 우선 탐색과 순환: 직접 구현"
    answer:
      "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if node in\
      \ seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
    hint: DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 A를 표시하고 B로 갑니다 B를 표시하고 C로 갑니다 C의 다음 A는 이미 방문해 돌아옵니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-81-dfs-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "3"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: A 방문  →  B 방문  →  C 방문  →  A 재방문 차단 순서로 실행되어 '3'을 출력합니다.
  - id: quiz-day-81-dfs-model
    question: 깊이 우선 탐색과 순환을 이해하는 데 맞는 설명은?
    choices:
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함(이것이 정상적인 사용법이다)
      - DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.
  - id: quiz-day-81-dfs-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함
    answerIndex: 2
    explanation: 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-81-dfs-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 사이클을 차단하며 깊이 탐색라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 사이클을 차단하며 깊이 탐색라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "graph = {\"A\": [\"B\"], \"B\": [\"C\"], \"C\": [\"A\"]}\nseen = set()\ndef dfs(node):\n    if\
  \ node in seen: return\n    seen.add(node)\n    for nxt in graph[node]: dfs(nxt)\ndfs(\"A\")\nprint(len(seen))"
---

## 오늘 배울 이유

그래프에는 사이클이 있으므로 깊게 따라가더라도 방문 표시 없이는 끝나지 않을 수 있습니다. Day 81 "`깊이 우선 탐색과 순환`"에서는 Python 코드의 실행 결과(`3`)를 따라가며, `사이클을 차단하며 깊이 탐색` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 80](/learn/day-80-backtracking)에서 배운 "백트래킹과 되돌리기" 내용을 한 문장으로 말해 보세요. 이번 "`깊이 우선 탐색과 순환`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `seen.add(node)`입니다.

## 머릿속 그림

DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다. Day 81에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `seen.add(node)`입니다.

```text
A 방문  →  B 방문  →  C 방문  →  A 재방문 차단
```

위 흐름에서 `seen.add(node)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3`입니다.

## 천천히 풀어보기

깊이 우선 탐색(DFS)은 한 길을 가능한 끝까지 따라간 뒤 돌아와 다른 길을 살핍니다. A→B→C를 먼저 따라갔다면 C의 이웃을 다 처리하고 B로 돌아옵니다. 방문한 정점은 `seen`에 넣어 A→B→A 같은 순환에서 같은 작업을 반복하지 않게 합니다.

`seen.add(node)`를 호출 초기에 하면 다른 길에서 동일 노드를 만났을 때 바로 돌아올 수 있습니다. 재귀가 매우 깊은 그래프에서는 Python의 재귀 깊이 제한을 고려해 명시적 스택을 쓸 수 있습니다. 방문 순서는 이웃 목록의 순서에 따라서도 달라집니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 81 "`깊이 우선 탐색과 순환`"의 독립 예제입니다. 전체 8줄 가운데 핵심 부분은 `seen.add(node)`이며, 실행 결과는 `3`입니다.

```python
graph = {"A": ["B"], "B": ["C"], "C": ["A"]}
seen = set()
def dfs(node):
    if node in seen: return
    seen.add(node)
    for nxt in graph[node]: dfs(nxt)
dfs("A")
print(len(seen))
```

예상 출력:

```text
3
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`3`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `seen.add(node)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | graph = {"A": ["B"], "B": ["C"], "C": ["A"]}
 2 | seen = set()
 3 | def dfs(node):
 4 |     if node in seen: return
 5 |     seen.add(node)
 6 |     for nxt in graph[node]: dfs(nxt)
 7 | dfs("A")
 8 | print(len(seen))
```

1. A를 표시하고 B로 갑니다
2. B를 표시하고 C로 갑니다
3. C의 다음 A는 이미 방문해 돌아옵니다

`seen.add(node)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | A 방문         |
|    2 | B 방문         |
|    3 | C 방문         |
|    4 | A 재방문 차단  |

위 순서대로 실행한 최종 출력은 `3`입니다. `A 방문` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

A→B, B→C, C→A인 그래프에서 방문 기록이 없다면 `dfs(A)`가 결국 다시 `dfs(A)`를 불러 끝나지 않습니다. `seen.add(A)`를 한 뒤 B,C를 따라가면 C의 이웃 A는 이미 방문했으므로 돌아옵니다. 순환 간선을 허용하는 그래프일수록 방문 표시 시점을 확인하세요.

## 시간과 공간 복잡도

깊이 우선 탐색은 방문 집합으로 정점과 간선을 한 번씩 처리해 O(정점+간선)입니다. 순환 A→B→C→A에서 방문 표시가 없으면 다시 dfs(A)를 불러 끝나지 않습니다. 재귀 깊이는 경로 길이만큼 쌓입니다. Day 81의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `3`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
graph = {"A": ["B"], "B": ["C"], "C": ["A"]}
seen = set()
def dfs(node):
    if node in seen: return
    seen.add(node)
    for nxt in graph[node]: dfs(nxt)
dfs("B")
print(len(seen))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
3
```

`3`로 같습니다. 순환 구조라 시작점이 달라도 방문 집합은 같은 3개라 결과가 같습니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`dfs("B")`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: 방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함.** 정상 코드의 실행 결과는 `3`입니다.

- 정상 줄: `seen.add(node)`
- 잘못된 줄: `seen.remove(node)`

두 줄을 나란히 놓고 `DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `A 방문`부터 `3`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `사이클을 차단하며 깊이 탐색`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | visited 배열과 재귀 또는 명시적 스택 |
| Python | seen 집합과 재귀                     |
| Rust   | HashSet과 &graph 빌림                |

C17에서는 `visited 배열과 재귀 또는 명시적 스택` 규칙을 적용합니다. "`깊이 우선 탐색과 순환`" 수업의 실행 결과(`3`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `seen 집합과 재귀` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `HashSet과 &graph 빌림` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`3` 맞히기) → 빈칸(`seen.add(node)` 채우기) → 변경(`'dfs("A")'을 'dfs("B")'로`) → 오류 수정(`방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함` 찾기) → 독립 구현(`깊이 우선 탐색과 순환을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3` 및 `seen.add(node)` 설명과 대조하세요.

## 스스로 설명하기

- "`깊이 우선 탐색과 순환`" 수업이 필요한 이유는 `사이클을 차단하며 깊이 탐색` 동작으로 설명해 보세요.
- 예제에서 `seen.add(node)` 부분 실행 직전의 상태와 직후의 출력(`3`)을 말해 보세요.
- "`방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `사이클을 차단하며 깊이 탐색` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

DFS는 이웃을 재귀적으로 끝까지 따라가고 이미 방문한 정점은 즉시 반환합니다. Day 81 "`깊이 우선 탐색과 순환`" 예제의 핵심 부분은 `seen.add(node)`이며, 실행 결과는 `3`입니다. "`방문 표시를 빼고 A→B→C→A 사이클에서 무한 재귀함`" 여부를 확인하고 Day 81 수업을 완료하세요.
