---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-65-bst
courseId: crp-92
phaseId: phase-06
dayNumber: 65
date: "2026-12-04"
title: 이진 탐색 트리의 비교 경로
summary: 정렬 규칙이 있는 트리라면 한 번의 비교로 다음 탐색 방향을 정합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-64-tree
learningObjectives:
  - "'이진 탐색 트리의 비교 경로' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - bst
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
  - id: ex-day-65-bst-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? root=8에서 시작해 계산하세요.
    starter: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    answer: "True"
    hint: 현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. 설명을 떠올리고 `root=8` 단계부터 순서대로 적어 보세요.
    explanation:
      root=8  →  오른쪽=10  →  발견 순서로 실행됩니다. `key > node` 부분이 `발견` 단계를 확정해 최종 출력 'True'가 됩니다. 이 흐름을 떠올리면 `키
      비교로 가지 하나 선택` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-65-bst-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'이진 탐색 트리의 비교 경로' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: key > node"
    starter: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if _____: node = tree[node][1]

      print(node == key)"
    answer: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    hint: 힌트 문장을 완전하게 읽으면 `루트 8과 목표 10을 비교합니다` 단계에 필요한 표현이 `key > node`입니다.
    explanation:
      "빈칸에 들어갈 표현은 'key > node'입니다. `if key > node: node = tree[node][1]` 줄을 완성해야 `키 비교로 가지 하나 선택` 동작이
      이어져 실행 결과 'True'가 됩니다. 힌트의 첫 단계 `루트 8과 목표 10을 비교합니다`이 바로 이 줄입니다. 이어서 10>8이라 오른쪽 자식 10으로 이동합니다 목표와 같아 True입니다
      순서로 진행됩니다."
    commonMistakes:
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-65-bst-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 'key = 10' → 'key = 9'. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    answer: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 9

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 'key = 10' → 'key = 9'."
    explanation:
      바꾼 뒤 출력은 'False'입니다. 원본 출력 'True'에서 달라졌습니다. 바뀐 줄은 `key = 10`에서 `key = 9`로 바뀌었습니다. 바뀐 프로그램은 `root=8`
      단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 그 차이가 이후 단계로 이어져 최종 `False`가 됩니다. 원본 추적 `root=8  →  오른쪽=10  →  발견`와 바뀐 줄 이후를 순서대로
      비교하면 처음 달라지는 곳이 보입니다.
    commonMistakes:
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-65-bst-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함 상황을 확인하세요.
    starter: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key < node: node = tree[node][1]

      print(node == key)"
    answer: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    hint:
      현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. 설명과 어긋나는 줄을 찾으세요. `정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 상황이
      단서가 됩니다.
    explanation:
      "틀린 줄은 `if key < node: node = tree[node][1]`입니다. 여기서는 `key < node`을 써서 `key > node` 동작이 깨집니다. 이대로
      실행하면 `정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 문제가 생겨 원본 추적 `root=8  →  오른쪽=10  →  발견`대로 'True'가 나오지 않습니다. 고친 줄 `if key
      > node: node = tree[node][1]`에서는 `key > node`가 `키 비교로 가지 하나 선택` 동작을 지켜 'True'까지 도달합니다."
    commonMistakes:
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-65-bst-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '이진 탐색 트리의 비교 경로' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 이진 탐색 트리의 비교 경로: 직접 구현"
    answer: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

      key = 10

      node = 8

      if key > node: node = tree[node][1]

      print(node == key)"
    hint: 현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `key > node` 부분이 `키 비교로 가지 하나 선택` 동작을 지켜 실행 결과 'True'가 됩니다. 같은 개념을 다른 입력으로 바꿔도
      `key > node`부터 `발견`까지 추적할 수 있으면 정답입니다. `정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 상황과 빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-65-bst-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "True"
    answerIndex: 2
    explanation:
      root=8  →  오른쪽=10  →  발견 순서로 실행되어 출력은 'True'입니다. `key > node` 부분이 마지막 단계를 확정하므로 다른 선택지는 이 추적과 맞지
      않습니다.
  - id: quiz-day-65-bst-model
    question: "'이진 탐색 트리의 비교 경로' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다.
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. 이 설명이 맞는 이유는 `키 비교로 가지 하나 선택` 동작을 지키는 조건과 같기
      때문입니다. `정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-65-bst-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함. 이 실수가 나오면 원본 추적 `root=8 → 오른쪽=10 → 발견`대로 'True'가 나오지 않으므로 먼저 확인해야 합니다.
  - id: quiz-day-65-bst-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 키 비교로 가지 하나 선택라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 `키 비교로 가지 하나 선택` 목적과 입력·출력은 유지합니다. 실행 결과 'True'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource: "tree = {8: (3, 10), 3: (None, None), 10: (None, None)}

  key = 10

  node = 8

  if key > node: node = tree[node][1]

  print(node == key)"
---

## 오늘 배울 이유

정렬 규칙이 있는 트리라면 한 번의 비교로 다음 탐색 방향을 정합니다. Day 65 "`이진 탐색 트리의 비교 경로`"에서는 Python 코드의 실행 결과(`True`)를 따라가며, `키 비교로 가지 하나 선택` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 64](/learn/day-64-tree)에서 배운 "트리의 부모·자식 순회" 내용을 한 문장으로 말해 보세요. 이번 "`이진 탐색 트리의 비교 경로`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `key > node`입니다.

## 머릿속 그림

현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. Day 65에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `key > node`입니다.

```text
root=8  →  오른쪽=10  →  발견
```

위 흐름에서 `key > node` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `True`입니다.

## 천천히 풀어보기

이진 탐색 트리는 현재 값보다 작은 값을 왼쪽, 큰 값을 오른쪽에 둔다는 규칙을 지킵니다. 뿌리가 10이고 왼쪽 5, 오른쪽 15라면 15를 찾을 때 10과 비교해 오른쪽 한 번만 따라가면 됩니다.

하지만 모양이 한쪽으로 길게 치우치면 거의 모든 노드를 살펴야 할 수도 있습니다. '항상 빠르다'는 뜻이 아닙니다. 찾는 값이 같을 때 멈추고, 자식이 `None`이면 없다고 답합니다. 중복 키를 왼쪽·오른쪽·별도 카운트 중 어떻게 처리할지도 트리의 규칙에 넣어야 합니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 65 "`이진 탐색 트리의 비교 경로`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `key > node`이며, 실행 결과는 `True`입니다.

```python
tree = {8: (3, 10), 3: (None, None), 10: (None, None)}
key = 10
node = 8
if key > node: node = tree[node][1]
print(node == key)
```

예상 출력:

```text
True
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`True`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `key > node`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | tree = {8: (3, 10), 3: (None, None), 10: (None, None)}
 2 | key = 10
 3 | node = 8
 4 | if key > node: node = tree[node][1]
 5 | print(node == key)
```

1. 루트 8과 목표 10을 비교합니다
2. 10>8이라 오른쪽 자식 10으로 이동합니다
3. 목표와 같아 True입니다

`key > node` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | root=8         |
|    2 | 오른쪽=10      |
|    3 | 발견           |

위 순서대로 실행한 최종 출력은 `True`입니다. `root=8` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

뿌리 10에 왼쪽 5·오른쪽 15가 있다면 키 5는 `5<10`이라 왼쪽에서 발견합니다. 키 12는 오른쪽 15를 만나 `12<15`라 그 왼쪽이 비었으면 없다고 답합니다. 정렬 규칙이 깨져 12가 엉뚱한 곳에 놓여 있다면 이 경로 탐색은 답을 보장하지 못합니다.

## 시간과 공간 복잡도

이진 탐색 트리에서 키를 찾으면 한 번 비교할 때마다 한쪽 자식을 버려 평균 O(높이)입니다. 한쪽으로만 길어지면 O(n)까지 느려집니다. 정렬 규칙이 깨진 위치에 값이 있으면 경로 탐색이 답을 보장하지 못합니다. Day 65의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `True`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
tree = {8: (3, 10), 3: (None, None), 10: (None, None)}
key = 9
node = 8
if key > node: node = tree[node][1]
print(node == key)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
False
```

원본 출력은 `True`이고, 바뀐 코드의 실행 결과는 `False`입니다. 바뀐 줄은 `key = 10`에서 `key = 9`로 바뀌었습니다. 바뀐 프로그램은 `root=8` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 `False`가 됩니다. 원본 추적 `root=8  →  오른쪽=10  →  발견`에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다.

## 자주 틀리는 지점

**확인할 실수: 정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함.** 정상 코드의 실행 결과는 `True`입니다.

- 정상 줄: `if key > node: node = tree[node][1]`
- 잘못된 줄: `if key < node: node = tree[node][1]`

두 줄을 나란히 놓으면 정상 줄 `if key > node: node = tree[node][1]`이 `현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다.` 설명과 맞고, 잘못된 줄은 `정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `root=8`부터 `True`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `키 비교로 가지 하나 선택`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙   |
| ------ | ---------------------------- |
| C17    | struct Node*와 값 비교       |
| Python | 노드 객체와 왼쪽/오른쪽 참조 |
| Rust   | Option<Box<Node>>와 Ord      |

C17에서는 `struct Node*와 값 비교` 규칙을 적용합니다. "`이진 탐색 트리의 비교 경로`" 수업의 실행 결과(`True`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `노드 객체와 왼쪽/오른쪽 참조` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Option<Box<Node>>와 Ord` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`True` 맞히기) → 빈칸(`key > node` 채우기) → 변경(`'key = 10' → 'key = 9'`) → 오류 수정(`정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함` 찾기) → 독립 구현(`'이진 탐색 트리의 비교 경로' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `True` 및 `key > node` 설명과 대조하세요.

## 스스로 설명하기

- "`이진 탐색 트리의 비교 경로`" 수업이 필요한 이유는 `키 비교로 가지 하나 선택` 동작으로 설명해 보세요.
- 예제에서 `key > node` 부분 실행 직전의 상태와 직후의 출력(`True`)을 말해 보세요.
- "`정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `키 비교로 가지 하나 선택` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

현재 노드보다 작은 키는 왼쪽, 큰 키는 오른쪽입니다. 중복 키 정책은 따로 정해야 합니다. Day 65 "`이진 탐색 트리의 비교 경로`" 예제의 핵심 부분은 `key > node`이며, 실행 결과는 `True`입니다. "`정렬 불변식 없이 아무 트리에도 이분 탐색을 적용함`" 여부를 확인하고 Day 65 수업을 완료하세요.
