---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-62-doubly-linked
courseId: crp-92
phaseId: phase-06
dayNumber: 62
date: "2026-12-01"
title: 양방향 연결과 불변식
summary: 이전과 다음 방향 모두 이동하려면 두 링크를 같은 관계로 갱신해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-61-linked-list
learningObjectives:
  - "'양방향 연결과 불변식' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - doubly linked
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
  - id: ex-day-62-doubly-linked-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? B.prev=A에서 시작해 계산하세요.
    starter:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["prev"]]["next"])'
    answer: B
    hint: B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.
    explanation: B.prev=A  →  A.next=B  →  일치. 따라서 출력은 'B'입니다.
    commonMistakes:
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-62-doubly-linked-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 양방향 연결과 불변식의 핵심 표현을 스스로 적는다.
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: ["prev"]'
    starter:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]_____]["next"])'
    answer:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["prev"]]["next"])'
    hint: B의 prev를 읽으면 A입니다
    explanation: 빈칸에는 '["prev"]'이 들어갑니다. B의 prev를 읽으면 A입니다 A의 next를 읽으면 B입니다 왕복 관계가 맞는지 출력합니다
    commonMistakes:
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-62-doubly-linked-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 '["B"]["prev"]'을 '["A"]["next"]'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["prev"]]["next"])'
    answer:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["A"]["next"]]["next"])'
    hint: '''["B"]["prev"]''을 ''["A"]["next"]''로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.'
    explanation:
      예시 답안에서는 '["B"]["prev"]'을 '["A"]["next"]'로 바꿨습니다. 원래 출력은 'B'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요.
      출력이 같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-62-doubly-linked-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음 상황을 확인하세요.
    starter:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["next"]]["next"])'
    answer:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["prev"]]["next"])'
    hint: B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. B의 prev를 읽으면 A입니다 A의 next를 읽으면 B입니다 왕복 관계가 맞는지 출력합니다
    commonMistakes:
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-62-doubly-linked-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '양방향 연결과 불변식' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 양방향 연결과 불변식: 직접 구현"
    answer:
      'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

      print(nodes[nodes["B"]["prev"]]["next"])'
    hint: B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 B의 prev를 읽으면 A입니다 A의 next를 읽으면 B입니다 왕복 관계가 맞는지 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-62-doubly-linked-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - B
    answerIndex: 2
    explanation: B.prev=A  →  A.next=B  →  일치 순서로 실행되어 'B'을 출력합니다.
  - id: quiz-day-62-doubly-linked-model
    question: 양방향 연결과 불변식을 이해하는 데 맞는 설명은?
    choices:
      - B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.
  - id: quiz-day-62-doubly-linked-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-62-doubly-linked-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 앞뒤 링크 일치 유지라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 앞뒤 링크 일치 유지라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  'nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}

  print(nodes[nodes["B"]["prev"]]["next"])'
---

## 오늘 배울 이유

이전과 다음 방향 모두 이동하려면 두 링크를 같은 관계로 갱신해야 합니다. Day 62 "`양방향 연결과 불변식`"에서는 Python 코드의 실행 결과(`B`)를 따라가며, `앞뒤 링크 일치 유지` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 61](/learn/day-61-linked-list)에서 배운 "단일 연결 리스트의 다음 노드" 내용을 한 문장으로 말해 보세요. 이번 "`양방향 연결과 불변식`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `["prev"]`입니다.

## 머릿속 그림

B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다. Day 62에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `["prev"]`입니다.

```text
B.prev=A  →  A.next=B  →  일치
```

위 흐름에서 `["prev"]` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `B`입니다.

## 천천히 풀어보기

양방향 연결 리스트는 한 노드에서 다음 노드로도, 이전 노드로도 돌아갈 수 있습니다. A 다음이 B라면 `A.next == B`와 `B.prev == A`가 **함께** 맞아야 합니다. 한쪽만 갱신하면 앞으로 갈 때는 맞아 보여도 뒤로 돌아올 때 잘못된 노드를 만납니다.

새 노드 C를 A와 B 사이에 넣는다면 연결 네 개를 점검하세요: `A.next=C`, `C.prev=A`, `C.next=B`, `B.prev=C`. 앞이나 뒤가 없는 머리·꼬리에서는 `None` 처리도 필요합니다. 노드를 추가·삭제할 때마다 왕복해서 같은 위치로 돌아오는지 검사하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 62 "`양방향 연결과 불변식`"의 독립 예제입니다. 전체 2줄 가운데 핵심 부분은 `["prev"]`이며, 실행 결과는 `B`입니다.

```python
nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}
print(nodes[nodes["B"]["prev"]]["next"])
```

예상 출력:

```text
B
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`B`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `["prev"]`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}
 2 | print(nodes[nodes["B"]["prev"]]["next"])
```

1. B의 prev를 읽으면 A입니다
2. A의 next를 읽으면 B입니다
3. 왕복 관계가 맞는지 출력합니다

`["prev"]` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | B.prev=A       |
|    2 | A.next=B       |
|    3 | 일치           |

위 순서대로 실행한 최종 출력은 `B`입니다. `B.prev=A` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

A와 B 사이에 C를 넣는다고 해 봅시다. 기존 연결 `A.next=B, B.prev=A`를 `A.next=C, C.prev=A, C.next=B, B.prev=C`로 모두 바꿉니다. A→C→B로 앞으로 갔다가 B→C→A로 돌아올 수 있으면 일치합니다. 한쪽 포인터만 고치면 되돌아갈 때 연결이 어긋납니다.

## 시간과 공간 복잡도

이웃을 아는 상태에서 가운데 C를 끼우면 네 포인터만 바꿔 O(1)입니다. A→C→B로 갔다가 B→C→A로 돌아오면 일치합니다. 한쪽만 고치면 되돌아갈 때 어긋납니다. 처음 위치를 찾는 데는 O(n)이 들 수 있습니다. Day 62의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `B`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
nodes = {"A": {"next": "B", "prev": None}, "B": {"next": None, "prev": "A"}}
print(nodes[nodes["A"]["next"]]["next"])
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
None
```

원본(`B`)과 달라졌습니다. 다른 줄(`print(nodes[nodes["B"]["prev"]]["next"])` → `print(nodes[nodes["A"]["next"]]["next"])`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`B.prev=A` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음.** 정상 코드의 실행 결과는 `B`입니다.

- 정상 줄: `print(nodes[nodes["B"]["prev"]]["next"])`
- 잘못된 줄: `print(nodes[nodes["B"]["next"]]["next"])`

두 줄을 나란히 놓고 `B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `B.prev=A`부터 `B`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `앞뒤 링크 일치 유지`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙                       |
| ------ | ------------------------------------------------ |
| C17    | Node *prev,*next를 함께 수정                     |
| Python | 참조 속성 양쪽 갱신                              |
| Rust   | 소유권 때문에 인덱스 기반 Vec나 Rc<RefCell> 고려 |

C17에서는 `Node *prev,*next를 함께 수정` 규칙을 적용합니다. "`양방향 연결과 불변식`" 수업의 실행 결과(`B`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `참조 속성 양쪽 갱신` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `소유권 때문에 인덱스 기반 Vec나 Rc<RefCell> 고려` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`B` 맞히기) → 빈칸(`["prev"]` 채우기) → 변경(`'["B"]["prev"]'을 '["A"]["next"]'로`) → 오류 수정(`삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음` 찾기) → 독립 구현(`양방향 연결과 불변식을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `B` 및 `["prev"]` 설명과 대조하세요.

## 스스로 설명하기

- "`양방향 연결과 불변식`" 수업이 필요한 이유는 `앞뒤 링크 일치 유지` 동작으로 설명해 보세요.
- 예제에서 `["prev"]` 부분 실행 직전의 상태와 직후의 출력(`B`)을 말해 보세요.
- "`삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `앞뒤 링크 일치 유지` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

B.prev=A라면 A.next=B여야 합니다. 두 방향이 서로를 가리키는 것이 불변식입니다. Day 62 "`양방향 연결과 불변식`" 예제의 핵심 부분은 `["prev"]`이며, 실행 결과는 `B`입니다. "`삽입·삭제 때 next만 바꾸고 prev를 갱신하지 않음`" 여부를 확인하고 Day 62 수업을 완료하세요.
