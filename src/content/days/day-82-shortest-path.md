---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-82-shortest-path
courseId: crp-92
phaseId: phase-07
dayNumber: 82
date: "2026-12-21"
title: 최단 경로의 거리 갱신
summary: 더 짧은 경로를 발견하면 기존 거리보다 작은 값으로 갱신해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-81-dfs
learningObjectives:
  - "'최단 경로의 거리 갱신' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - shortest path
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
  - id: ex-day-82-shortest-path-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? A=0에서 시작해 계산하세요.
    starter:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    answer: "3"
    hint: 음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.
    explanation: A=0  →  B=2,C=5  →  B 경유 C=3  →  C=3. 따라서 출력은 '3'입니다.
    commonMistakes:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-82-shortest-path-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'최단 경로의 거리 갱신' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: cost + weight < dist[next_node]"
    starter:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if _____:\n       \
      \     dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node], next_node))\nprint(dist[\"\
      C\"])"
    answer:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    hint: 모든 거리를 무한대로 시작하고 A만 0으로 둡니다
    explanation:
      빈칸에 들어갈 표현은 'cost + weight < dist[next_node]'입니다. 모든 거리를 무한대로 시작하고 A만 0으로 둡니다 큐에서 A를 꺼내 B=2,C=5로
      기록합니다 B에서 C의 새 후보 3을 발견해 갱신합니다 오래된 C=5 후보는 건너뛰고 3을 출력합니다
    commonMistakes:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-82-shortest-path-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 2에서 3로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    answer:
      "import heapq\ngraph = {\"A\": [(\"B\", 3), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 2에서 3로."
    explanation:
      '바꾼 뒤 출력은 ''4''입니다. 원본 출력 ''3''에서 달라졌습니다. 다른 줄(graph = {"A": [("B", 2), ("C", 5)], "B": [("C", 1)],
      "C": []} → graph = {"A": [("B", 3), ("C", 5)], "B": [("C", 1)], "C": []})에서 시작한 차이가 최종 출력에 반영되었습니다.'
    commonMistakes:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-82-shortest-path-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함 상황을 확인하세요.
    starter:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight >\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    answer:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    hint: 음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.
    explanation:
      원래 예시와 비교하여 잘못된 줄을 찾으세요. 모든 거리를 무한대로 시작하고 A만 0으로 둡니다 큐에서 A를 꺼내 B=2,C=5로 기록합니다 B에서 C의 새 후보 3을 발견해
      갱신합니다 오래된 C=5 후보는 건너뛰고 3을 출력합니다
    commonMistakes:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-82-shortest-path-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '최단 경로의 거리 갱신' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 최단 경로의 거리 갱신: 직접 구현"
    answer:
      "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist = {name:\
      \ float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node = heapq.heappop(heap)\n\
      \    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n        if cost + weight <\
      \ dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap, (dist[next_node],\
      \ next_node))\nprint(dist[\"C\"])"
    hint: 음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 모든 거리를 무한대로 시작하고 A만 0으로 둡니다 큐에서 A를 꺼내 B=2,C=5로 기록합니다 B에서 C의 새 후보 3을 발견해
      갱신합니다 오래된 C=5 후보는 건너뛰고 3을 출력합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-82-shortest-path-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "3"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: A=0  →  B=2,C=5  →  B 경유 C=3  →  C=3 순서로 실행되어 출력은 '3'입니다.
  - id: quiz-day-82-shortest-path-model
    question: "'최단 경로의 거리 갱신' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.
    answerIndex: 2
    explanation: 음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.
  - id: quiz-day-82-shortest-path-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-82-shortest-path-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 더 짧은 후보로 거리 완화라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 더 짧은 후보로 거리 완화라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "import heapq\ngraph = {\"A\": [(\"B\", 2), (\"C\", 5)], \"B\": [(\"C\", 1)], \"C\": []}\ndist\
  \ = {name: float(\"inf\") for name in graph}; dist[\"A\"] = 0\nheap = [(0, \"A\")]\nwhile heap:\n    cost, node\
  \ = heapq.heappop(heap)\n    if cost != dist[node]: continue\n    for next_node, weight in graph[node]:\n    \
  \    if cost + weight < dist[next_node]:\n            dist[next_node] = cost + weight\n            heapq.heappush(heap,\
  \ (dist[next_node], next_node))\nprint(dist[\"C\"])"
---

## 오늘 배울 이유

더 짧은 경로를 발견하면 기존 거리보다 작은 값으로 갱신해야 합니다. Day 82 "`최단 경로의 거리 갱신`"에서는 Python 코드의 실행 결과(`3`)를 따라가며, `더 짧은 후보로 거리 완화` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 81](/learn/day-81-dfs)에서 배운 "깊이 우선 탐색과 순환" 내용을 한 문장으로 말해 보세요. 이번 "`최단 경로의 거리 갱신`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `cost + weight < dist[next_node]`입니다.

## 머릿속 그림

음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다. Day 82에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `cost + weight < dist[next_node]`입니다.

```text
A=0  →  B=2,C=5  →  B 경유 C=3  →  C=3
```

위 흐름에서 `cost + weight < dist[next_node]` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3`입니다.

## 천천히 풀어보기

가중치가 있는 그래프의 최단 경로에서는 방문 횟수보다 **비용의 합**을 봅니다. 현재까지 A→B 비용이 5인데 A→C→B가 2+1=3이면 B의 거리 후보를 5에서 3으로 바꿉니다. 이 동작을 '완화'라고 부릅니다.

우선순위 큐에서 가장 작은 후보를 먼저 꺼내는 다익스트라 방식은 간선 비용이 음수가 없을 때 적용합니다. 큐에는 이전의 더 큰 후보가 남아 있을 수 있으므로 꺼낸 비용이 현재 `dist`보다 크면 건너뜁니다. 도달할 수 없는 정점은 거리가 무한대로 남습니다. 음수 간선이 있으면 다른 알고리즘을 골라야 합니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 82 "`최단 경로의 거리 갱신`"의 독립 예제입니다. 전체 12줄 가운데 핵심 부분은 `cost + weight < dist[next_node]`이며, 실행 결과는 `3`입니다.

```python
import heapq
graph = {"A": [("B", 2), ("C", 5)], "B": [("C", 1)], "C": []}
dist = {name: float("inf") for name in graph}; dist["A"] = 0
heap = [(0, "A")]
while heap:
    cost, node = heapq.heappop(heap)
    if cost != dist[node]: continue
    for next_node, weight in graph[node]:
        if cost + weight < dist[next_node]:
            dist[next_node] = cost + weight
            heapq.heappush(heap, (dist[next_node], next_node))
print(dist["C"])
```

예상 출력:

```text
3
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`3`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `cost + weight < dist[next_node]`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | import heapq
 2 | graph = {"A": [("B", 2), ("C", 5)], "B": [("C", 1)], "C": []}
 3 | dist = {name: float("inf") for name in graph}; dist["A"] = 0
 4 | heap = [(0, "A")]
 5 | while heap:
 6 |     cost, node = heapq.heappop(heap)
 7 |     if cost != dist[node]: continue
 8 |     for next_node, weight in graph[node]:
 9 |         if cost + weight < dist[next_node]:
10 |             dist[next_node] = cost + weight
11 |             heapq.heappush(heap, (dist[next_node], next_node))
12 | print(dist["C"])
```

1. 모든 거리를 무한대로 시작하고 A만 0으로 둡니다
2. 큐에서 A를 꺼내 B=2,C=5로 기록합니다
3. B에서 C의 새 후보 3을 발견해 갱신합니다
4. 오래된 C=5 후보는 건너뛰고 3을 출력합니다

`cost + weight < dist[next_node]` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | A=0            |
|    2 | B=2,C=5        |
|    3 | B 경유 C=3     |
|    4 | C=3            |

위 순서대로 실행한 최종 출력은 `3`입니다. `A=0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

A→B 직접 비용이 8이고 A→C 비용이 2, C→B 비용이 3이면 B의 거리 후보는 처음 8에서 `2+3=5`로 줄어듭니다. 큐에 예전 8이 남아 있더라도 나중에 꺼냈을 때 현재 거리 5보다 크면 건너뜁니다. **음수 비용이 없다**는 전제가 없으면 이 알고리즘을 그대로 쓰지 마세요.

## 시간과 공간 복잡도

다익스트라로 B의 거리는 직접 8에서 C 경유 2+3=5로 줄어듭니다. 큐에 남은 예전 8은 꺼냈을 때 현재 거리보다 크면 건너뜁니다. 음수 비용이 있으면 이 방법을 그대로 쓰지 마세요. 힙을 쓰면 전체 O((간선+정점) log 정점)입니다. Day 82의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `3`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
import heapq
graph = {"A": [("B", 3), ("C", 5)], "B": [("C", 1)], "C": []}
dist = {name: float("inf") for name in graph}; dist["A"] = 0
heap = [(0, "A")]
while heap:
    cost, node = heapq.heappop(heap)
    if cost != dist[node]: continue
    for next_node, weight in graph[node]:
        if cost + weight < dist[next_node]:
            dist[next_node] = cost + weight
            heapq.heappush(heap, (dist[next_node], next_node))
print(dist["C"])
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
4
```

원본과 달라졌습니다. 원본 출력은 `3`입니다. 다른 줄(`graph = {"A": [("B", 2), ("C", 5)], "B": [("C", 1)], "C": []}` → `graph = {"A": [("B", 3), ("C", 5)], "B": [("C", 1)], "C": []}`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`A=0` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함.** 정상 코드의 실행 결과는 `3`입니다.

- 정상 줄: `if cost + weight < dist[next_node]:`
- 잘못된 줄: `if cost + weight > dist[next_node]:`

두 줄을 나란히 놓고 `음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `A=0`부터 `3`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `더 짧은 후보로 거리 완화`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | 거리 배열과 INF 처리            |
| Python | dict 거리와 min 갱신            |
| Rust   | 우선순위 큐에 Reverse 비용 사용 |

C17에서는 `거리 배열과 INF 처리` 규칙을 적용합니다. "`최단 경로의 거리 갱신`" 수업의 실행 결과(`3`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `dict 거리와 min 갱신` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `우선순위 큐에 Reverse 비용 사용` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`3` 맞히기) → 빈칸(`cost + weight < dist[next_node]` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함` 찾기) → 독립 구현(`'최단 경로의 거리 갱신' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3` 및 `cost + weight < dist[next_node]` 설명과 대조하세요.

## 스스로 설명하기

- "`최단 경로의 거리 갱신`" 수업이 필요한 이유는 `더 짧은 후보로 거리 완화` 동작으로 설명해 보세요.
- 예제에서 `cost + weight < dist[next_node]` 부분 실행 직전의 상태와 직후의 출력(`3`)을 말해 보세요.
- "`음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `더 짧은 후보로 거리 완화` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

음수가 없는 간선에서는 현재까지 가장 짧은 후보부터 꺼냅니다. 이웃 경로가 기존 거리보다 짧으면 거리와 우선순위 큐를 갱신합니다. Day 82 "`최단 경로의 거리 갱신`" 예제의 핵심 부분은 `cost + weight < dist[next_node]`이며, 실행 결과는 `3`입니다. "`음수 간선에도 다익스트라의 확정 규칙을 그대로 적용함`" 여부를 확인하고 Day 82 수업을 완료하세요.
