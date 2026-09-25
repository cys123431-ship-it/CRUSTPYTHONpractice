---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-64-tree
courseId: crp-92
phaseId: phase-06
dayNumber: 64
date: "2026-12-03"
title: 트리의 부모·자식 순회
summary: 계층형 데이터는 부모가 자식을 가리키는 트리로 표현하고 재귀로 순회할 수 있습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-63-linear-review
learningObjectives:
  - "'트리의 부모·자식 순회' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - tree
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
  - id: ex-day-64-tree-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? B=1에서 시작해 계산하세요.
    starter:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node is\
      \ None else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    answer: "3"
    hint: B=1에서 시작해 A=1+1+1=3까지 순서대로 적어 보세요. 빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다.
    explanation:
      1. A가 자신 1을 셉니다. 2. B와 C가 각각 1을 셉니다. 3. 빈 자식들은 0이므로 합계 3입니다. `B=1 → C=1 → A=1+1+1=3` 흐름으로 실제 출력 `3`이
      됩니다. 핵심 `node is None`은 빈 자식에서 멈추는 바닥을 정하는 자리에 쓰입니다.
    commonMistakes:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-64-tree-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 트리의 부모·자식 순회의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: node is None"
    starter:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if _____ else\
      \ 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    answer:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node is None\
      \ else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    hint: 필요한 표현은 하위 트리 결과를 합산 동작을 잇는 node is None입니다.
    explanation:
      빈칸에 들어갈 표현은 'node is None'입니다. 이 표현이 없으면 실행 중 오류로 멈춥니다. 1. A가 자신 1을 셉니다. 2. B와 C가 각각 1을 셉니다. 3. 빈
      자식들은 0이므로 합계 3입니다. `B=1 → C=1 → A=1+1+1=3` 흐름으로 실제 출력 `3`이 됩니다. 핵심 `node is None`은 빈 자식에서 멈추는 바닥을 정하는 자리에 쓰입니다.
    commonMistakes:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-64-tree-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node is\
      \ None else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    answer:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 1 if node is None\
      \ else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '3'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '7'입니다. 원본은 `3`, 수정본은 `7`이다. 첫 변경 줄의 `return 0`에서 `return 1`로 빈 자식의 값을 바꾸면, 네 군데 빈 자식이 각각
      1씩 더해져 3에서 7이 된다.
    commonMistakes:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-64-tree-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함 상황을 확인하세요.
    starter:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node ==\
      \ 0 else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    answer:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node is None\
      \ else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    hint: 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함 상황에서 어긋나는 줄을 빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `return 0 if node == 0 else 1 + count(node[1]) + count(node[2])`입니다. 트리의 노드는 튜플이거나 `None`이라
      `== 0`이 참이 되는 경우가 없으므로, 빈 자식에서도 멈추지 않고 `None[1]`을 읽으려다 TypeError라는 런타임 오류가 나고 프로그램이 멈춥니다. 오류 분류는 런타임 오류입니다.
      흐름이 깨지는 첫 순간은 빈 자식의 종료 조건입니다. 고친 줄 `return 0 if node is None else 1 + count(node[1]) + count(node[2])`에서는 `하위
      트리 결과를 합산` 동작이 지켜집니다. 정상 코드는 바닥 판정→하위 합산→돌아오며 더하기의 순서로 `3`을 출력합니다.
    commonMistakes:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-64-tree-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 트리의 부모·자식 순회 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 트리의 부모·자식 순회: 직접 구현"
    answer:
      "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node is None\
      \ else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
    hint: 자식이 한쪽만 있어도 빈 쪽을 0으로 계산합니다. 방문 전과 합산 후를 다른 순서로 적어 보세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 자식이 한쪽만 있어도 빈 쪽을 0으로 계산합니다. 방문 전과 합산 후를 다른 순서로 적어 보세요. 같은 하위 트리 결과를 합산
      동작을 구현하고 실행 결과 '3'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-64-tree-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "3"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 A가 자신 1을 셉니다. 이어서 B와 C가 각각 1을 세고, 빈 자식들은 0이므로 합쳐 3이 되어 출력 `3`이 됩니다. `실행 전에 반드시 오류가 난다`는 틀린 선택지인데
      재귀와 종료가 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-64-tree-model
    question: "'트리의 부모·자식 순회' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다.
    answerIndex: 2
    explanation:
      빈 자식은 0개라는 뜻이고, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더한다는 뜻은 아래에서 올라오며 합산한다는 뜻입니다. `빈 자식의 종료 조건을 빠뜨려 None을
      인덱싱함`은 반대 사례인데, 멈추지 않으면 없는 노드를 읽기 때문입니다.
  - id: quiz-day-64-tree-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함`입니다. 잘못된 코드는 빈 자식에서 멈추지 못해 TypeError로 멈춥니다. `is None` 판정을
      먼저 확인하세요.
  - id: quiz-day-64-tree-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 하위 트리 결과를 합산라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `하위 트리 결과를 합산`이라는 의미와 입력·출력 계약입니다. C의 재귀 순회와 Rust의 재귀 매칭으로 같은 동작을 구현하고, 실행
      결과 `3`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource:
  "tree = (\"A\", (\"B\", None, None), (\"C\", None, None))\ndef count(node):\n    return 0 if node\
  \ is None else 1 + count(node[1]) + count(node[2])\nprint(count(tree))"
---

## 오늘 배울 이유

계층형 데이터는 부모가 자식을 가리키는 트리로 표현하고 재귀로 순회할 수 있습니다. Day 64 "`트리의 부모·자식 순회`"에서는 Python 코드의 실행 결과(`3`)를 따라가며, `하위 트리 결과를 합산` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 63](/learn/day-63-linear-review)에서 배운 "스택·큐·리스트 회상" 내용을 한 문장으로 말해 보세요. 이번 "`트리의 부모·자식 순회`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `node is None`입니다.

## 머릿속 그림

빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다. Day 64에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `node is None`입니다.

```text
B=1  →  C=1  →  A=1+1+1=3
```

위 흐름에서 `node is None` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3`입니다.

## 천천히 풀어보기

트리는 하나의 부모에서 자식으로 뻗는 구조입니다. 노드 수를 세는 재귀 함수는 `None`이면 0, 실제 노드이면 `1 + 왼쪽 수 + 오른쪽 수`를 돌려줍니다. 뿌리 A에 자식 B와 C가 있으면 B=1, C=1, A=1+1+1=3으로 돌아옵니다.

자식이 한쪽만 있어도 빈 쪽을 0으로 계산합니다. `None`에서 멈추지 않으면 없는 노드의 자식을 계속 읽으려 합니다. 실제 노드를 방문하기 전과 하위 노드의 수가 돌아온 후를 다른 순서로 적어 보세요.

트리는 하나의 부모에서 자식으로 뻗는 구조입니다. 노드 수를 세는 재귀 함수는 `None`이면 0, 실제 노드이면 `1 + 왼쪽 수 + 오른쪽 수`를 돌려줍니다. 뿌리 A에 자식 B와 C가 있으면 B=1, C=1, A=1+1+1=3으로 돌아옵니다.

자식이 한쪽만 있어도 빈 쪽을 0으로 계산합니다. `None`에서 멈추지 않으면 없는 노드의 자식을 계속 읽으려 합니다. 실제 노드를 방문하기 전과 하위 노드의 수가 돌아온 후를 다른 순서로 적어 보세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 64 "`트리의 부모·자식 순회`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `node is None`이며, 실행 결과는 `3`입니다.

```python
tree = ("A", ("B", None, None), ("C", None, None))
def count(node):
    return 0 if node is None else 1 + count(node[1]) + count(node[2])
print(count(tree))
```

예상 출력:

```text
3
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`3`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `node is None`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```python
 1 | tree = ("A", ("B", None, None), ("C", None, None))
 2 | def count(node):
 3 |     return 0 if node is None else 1 + count(node[1]) + count(node[2])
 4 | print(count(tree))
```

1. A가 자신 1을 셉니다
2. B와 C가 각각 1을 셉니다
3. 빈 자식들은 0이므로 합계 3입니다

`node is None` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | B=1            |
|    2 | C=1            |
|    3 | A=1+1+1=3      |

위 순서대로 실행한 최종 출력은 `3`입니다. `B=1` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

나무 모양 `A(B, C(D, None))`의 노드를 세면 B는 1, D는 1, C는 자기 자신을 포함해 2, A는 `1+1+2=4`입니다. `None`의 개수를 노드에 더하면 답이 부풀어 오릅니다. 자식의 계산이 끝나 **부모로 돌아오는 순서**를 적어 보세요.

## 시간과 공간 복잡도

노드 수를 셀 때는 각 노드를 한 번씩 방문해 O(n)입니다. 자식 결과를 부모로 돌려 합치므로 None 자식은 0으로 셉니다. 재귀 깊이는 트리 높이만큼 쌓여 공간 O(높이)입니다. None을 노드로 더하면 답이 부풀어 오릅니다. Day 64의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `3`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
tree = ("A", ("B", None, None), ("C", None, None))
def count(node):
    return 1 if node is None else 1 + count(node[1]) + count(node[2])
print(count(tree))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
7
```

원본은 `3`, 수정본은 `7`이다. 첫 변경 줄의 `return 0`에서 `return 1`로 빈 자식의 값을 바꾸면, 네 군데 빈 자식이 각각 1씩 더해져 3에서 7이 된다.

## 자주 틀리는 지점

**확인할 실수: 빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함.** 정상 코드의 실행 결과는 `3`입니다.

- 정상 줄: `return 0 if node is None else 1 + count(node[1]) + count(node[2])`
- 잘못된 줄: `return 0 if node == 0 else 1 + count(node[1]) + count(node[2])`

두 줄을 나란히 놓으면 정상 줄 `return 0 if node is None else 1 + count(node[1]) + count(node[2])`이 `빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다.` 설명과 맞고, 잘못된 줄은 `빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `B=1`부터 `3`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `하위 트리 결과를 합산`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | Node* NULL 기저와 재귀     |
| Python | None 기저와 튜플 재귀      |
| Rust   | Option<Box<Node>>와 match  |

C17에서는 `Node* NULL 기저와 재귀` 규칙을 적용합니다. "`트리의 부모·자식 순회`" 수업의 실행 결과(`3`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `None 기저와 튜플 재귀` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Option<Box<Node>>와 match` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`3` 맞히기) → 빈칸(`node is None` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함` 찾기) → 독립 구현(`'트리의 부모·자식 순회' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3` 및 `node is None` 설명과 대조하세요.

## 스스로 설명하기

- "`트리의 부모·자식 순회`" 수업이 필요한 이유는 `하위 트리 결과를 합산` 동작으로 설명해 보세요.
- 예제에서 `node is None` 부분 실행 직전의 상태와 직후의 출력(`3`)을 말해 보세요.
- "`빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `하위 트리 결과를 합산` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

빈 자식은 0개, 실제 노드는 자신 1개와 왼쪽·오른쪽 하위 트리 개수를 더합니다. Day 64 "`트리의 부모·자식 순회`" 예제의 핵심 부분은 `node is None`이며, 실행 결과는 `3`입니다. "`빈 자식의 종료 조건을 빠뜨려 None을 인덱싱함`" 여부를 확인하고 Day 64 수업을 완료하세요.
