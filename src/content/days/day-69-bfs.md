---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-69-bfs
courseId: crp-92
phaseId: phase-06
dayNumber: 69
date: "2026-12-08"
title: 너비 우선 탐색과 방문 집합
summary: 연결된 정점을 가까운 순서로 찾으려면 큐와 방문 집합을 함께 사용합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-68-graph
learningObjectives:
  - "'너비 우선 탐색과 방문 집합' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - bfs
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
  - id: ex-day-69-bfs-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? q=[A]에서 시작해 계산하세요.
    starter:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"\
      A\"]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    answer: "['A', 'B', 'C']"
    hint: 큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.
    explanation: q=[A]  →  q=[B,C]  →  q=[]  →  seen={A,B,C}. 따라서 출력은 "['A', 'B', 'C']"입니다.
    commonMistakes:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-69-bfs-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 너비 우선 탐색과 방문 집합의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: q.popleft()"
    starter:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"\
      A\"]); seen = {\"A\"}\nwhile q:\n    node = _____\n    for next_node in graph[node]:\n        if next_node not\
      \ in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    answer:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"A\"\
      ]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    hint: A를 꺼냅니다
    explanation: 빈칸에는 'q.popleft()'이 들어갑니다. A를 꺼냅니다 새 이웃 B,C를 방문 표시 후 큐에 넣습니다 둘을 처리하고 seen을 정렬해 출력합니다
    commonMistakes:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-69-bfs-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 'print(sorted(seen))'을 'print(len(seen))'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"\
      A\"]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    answer:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"A\"\
      ]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(len(seen))"
    hint: "'print(sorted(seen))'을 'print(len(seen))'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요."
    explanation:
      예시 답안에서는 'print(sorted(seen))'을 'print(len(seen))'로 바꿨습니다. 원래 출력은 "['A', 'B', 'C']"입니다. 바꾼 줄에서 시작해
      중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-69-bfs-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감 상황을 확인하세요.
    starter:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"\
      A\"]); seen = {\"A\"}\nwhile q:\n    node = q.pop()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    answer:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"A\"\
      ]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    hint: 큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. A를 꺼냅니다 새 이웃 B,C를 방문 표시 후 큐에 넣습니다 둘을 처리하고 seen을 정렬해 출력합니다
    commonMistakes:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-69-bfs-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '너비 우선 탐색과 방문 집합' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 너비 우선 탐색과 방문 집합: 직접 구현"
    answer:
      "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"A\"\
      ]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
      \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
    hint: 큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 A를 꺼냅니다 새 이웃 B,C를 방문 표시 후 큐에 넣습니다 둘을 처리하고 seen을 정렬해 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-69-bfs-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "['A', 'B', 'C']"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: q=[A]  →  q=[B,C]  →  q=[]  →  seen={A,B,C} 순서로 실행되어 "['A', 'B', 'C']"을 출력합니다.
  - id: quiz-day-69-bfs-model
    question: 너비 우선 탐색과 방문 집합을 이해하는 데 맞는 설명은?
    choices:
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감(이것이 정상적인 사용법이다)
      - 큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.
  - id: quiz-day-69-bfs-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감
    answerIndex: 2
    explanation: 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-69-bfs-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 가까운 정점부터 탐색라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 가까운 정점부터 탐색라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "from collections import deque\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [], \"C\": []}\nq = deque([\"\
  A\"]); seen = {\"A\"}\nwhile q:\n    node = q.popleft()\n    for next_node in graph[node]:\n        if next_node\
  \ not in seen: seen.add(next_node); q.append(next_node)\nprint(sorted(seen))"
---

## 오늘 배울 이유

연결된 정점을 가까운 순서로 찾으려면 큐와 방문 집합을 함께 사용합니다. Day 69 "`너비 우선 탐색과 방문 집합`"에서는 Python 코드가 `['A', 'B', 'C']`을(를) 만드는 과정을 따라가며, 가까운 정점부터 탐색 동작이 왜 필요한지 확인합니다. 가까운 정점부터 탐색을(를) 빠뜨리면 `방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 68](/learn/day-68-graph)에서는 "그래프의 인접 목록"을(를) 배웠습니다. "그래프의 인접 목록"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`너비 우선 탐색과 방문 집합`"에서 새로 달라지는 조건을 찾아보세요. Day 69의 답은 `['A', 'B', 'C']`이며, 핵심 표현은 `q.popleft()`입니다.

## 머릿속 그림

큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다. Day 69에서는 아래 흐름 순서대로 상태가 바뀌며, `q.popleft()`이(가) 결과를 가릅니다.

```text
q=[A]  →  q=[B,C]  →  q=[]  →  seen={A,B,C}
```

위 흐름에서 `q.popleft()`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `['A', 'B', 'C']`입니다.

## 천천히 풀어보기

너비 우선 탐색(BFS)은 가까운 정점부터 층별로 확인합니다. A에 B와 C가 연결되어 있으면 먼저 A를 꺼내 B,C를 큐에 넣고, 그다음 B,C를 처리합니다. 큐가 '먼저 발견한 정점부터' 꺼내는 순서를 지켜 줍니다.

`seen`은 이미 넣은 정점을 기록합니다. A→B→A처럼 다시 돌아오는 간선이 있어도 A를 두 번 넣지 않게 합니다. 큐에 넣는 순간 방문 표시를 하면 같은 정점이 여러 경로로 발견되어도 한 번만 들어갑니다. BFS가 최단 간선 수를 구하는 것은 모든 간선의 비용이 같을 때입니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 69 "`너비 우선 탐색과 방문 집합`"의 독립 예제입니다. 전체 8줄에서 `q.popleft()`이(가) 핵심이며, 실행 결과는 `['A', 'B', 'C']`입니다.

```python
from collections import deque
graph = {"A": ["B", "C"], "B": [], "C": []}
q = deque(["A"]); seen = {"A"}
while q:
    node = q.popleft()
    for next_node in graph[node]:
        if next_node not in seen: seen.add(next_node); q.append(next_node)
print(sorted(seen))
```

예상 출력:

```text
['A', 'B', 'C']
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `['A', 'B', 'C']`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `q.popleft()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | from collections import deque
 2 | graph = {"A": ["B", "C"], "B": [], "C": []}
 3 | q = deque(["A"]); seen = {"A"}
 4 | while q:
 5 |     node = q.popleft()
 6 |     for next_node in graph[node]:
 7 |         if next_node not in seen: seen.add(next_node); q.append(next_node)
 8 | print(sorted(seen))
```

1. A를 꺼냅니다
2. 새 이웃 B,C를 방문 표시 후 큐에 넣습니다
3. 둘을 처리하고 seen을 정렬해 출력합니다

위 단계에서 `q.popleft()`이(가) 빠지면 `['A', 'B', 'C']`이(가) 나오지 않습니다. `'print(sorted(seen))'을 'print(len(seen))'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | q=[A]          |
|    2 | q=[B,C]        |
|    3 | q=[]           |
|    4 | seen={A,B,C}   |

위 순서대로 실행하면 최종 출력 `['A', 'B', 'C']`이(가) 됩니다. `q=[A]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

A가 B,C를 이웃으로 갖고 B가 D를 이웃으로 갖는다면 큐는 `[A] → [B,C] → [C,D] → [D]`로 변합니다(방문 표시를 넣을 때 한다고 가정). 그래서 A에서 한 단계 거리인 B,C를 먼저, 두 단계인 D를 다음에 처리합니다. 큐를 스택으로 바꾸면 이 층별 순서가 사라집니다.

## 시간과 공간 복잡도

너비 우선 탐색은 각 정점과 간선을 한 번씩 처리해 O(정점+간선)입니다. 큐가 한 단계 이웃을 먼저 꺼내 층별 순서를 만듭니다. 방문 표시를 빠뜨리면 같은 곳을 반복합니다. 큐를 스택으로 바꾸면 층별 순서가 사라집니다. Day 69의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 코드에서 `'print(sorted(seen))'을 'print(len(seen))'로` 바꾸면 아래와 같이 됩니다.

```python
from collections import deque
graph = {"A": ["B", "C"], "B": [], "C": []}
q = deque(["A"]); seen = {"A"}
while q:
    node = q.popleft()
    for next_node in graph[node]:
        if next_node not in seen: seen.add(next_node); q.append(next_node)
print(len(seen))
```

원본 출력은 `['A', 'B', 'C']`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `q.popleft()`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 69의 `너비 우선 탐색과 방문 집합`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감.** 정상 코드에서는 `['A', 'B', 'C']`이(가) 출력됩니다.

- 정상 줄: `node = q.popleft()`
- 잘못된 줄: `node = q.pop()`

두 줄을 나란히 놓고 `큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `q=[A]`부터 `['A', 'B', 'C']`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **가까운 정점부터 탐색**은(는) 세 언어에서 같은 입력과 출력(`['A', 'B', 'C']`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | 배열 큐와 bool visited     |
| Python | deque와 set                |
| Rust   | VecDeque와 HashSet         |

C17에서는 `배열 큐와 bool visited` 규칙으로 "`너비 우선 탐색과 방문 집합`"의 `['A', 'B', 'C']`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `deque와 set` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `VecDeque와 HashSet` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`['A', 'B', 'C']` 맞히기) → 빈칸(`q.popleft()` 채우기) → 변경(`'print(sorted(seen))'을 'print(len(seen))'로`) → 오류 수정(`방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감` 찾기) → 독립 구현(`너비 우선 탐색과 방문 집합을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `['A', 'B', 'C']` 및 `q.popleft()` 설명과 대조하세요.

## 스스로 설명하기

- "`너비 우선 탐색과 방문 집합`"이(가) 필요한 상황을 `가까운 정점부터 탐색` 동작으로 설명해 보세요.
- 예제에서 `q.popleft()`이(가) 실행되기 직전의 상태와 직후의 출력 `['A', 'B', 'C']`을(를) 말해 보세요.
- "`방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `가까운 정점부터 탐색` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

큐는 현재 거리의 정점을 먼저 처리하고 seen은 순환 간선에서 같은 정점을 다시 넣지 않게 합니다. Day 69 "`너비 우선 탐색과 방문 집합`"의 예제는 `q.popleft()`을(를) 실행해 `['A', 'B', 'C']`을(를) 출력합니다. "`방문 표시를 늦춰 같은 노드가 큐에 여러 번 들어감`" 여부를 확인하고 Day 69을(를) 완료하세요.
