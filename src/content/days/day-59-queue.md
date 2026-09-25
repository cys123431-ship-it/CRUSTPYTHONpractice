---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-59-queue
courseId: crp-92
phaseId: phase-06
dayNumber: 59
date: "2026-11-28"
title: 큐와 선입선출
summary: 먼저 접수한 요청을 먼저 처리해야 공정한 대기열이 됩니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-58-undo-stack
learningObjectives:
  - "'큐와 선입선출' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: pop()으로 마지막 접수 C를 먼저 처리함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - queue
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
  - id: ex-day-59-queue-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [A,B]에서 시작해 계산하세요.
    starter: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    answer: A
    hint: 큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.
    explanation: "[A,B]  →  [A,B,C]  →  A 처리. 따라서 출력은 'A'입니다."
    commonMistakes:
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-59-queue-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 큐와 선입선출의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: popleft()"
    starter: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting._____)'
    answer: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    hint: A,B가 기다립니다
    explanation: 빈칸에는 'popleft()'이 들어갑니다. A,B가 기다립니다 C가 뒤에 합류합니다 앞에 있는 A를 제거해 출력합니다
    commonMistakes:
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-59-queue-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 'A'에서 'A!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    answer: 'from collections import deque

      waiting = deque(["A!", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    hint: 첫 문자열을 'A'에서 'A!'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 첫 문자열을 'A'에서 'A!'로 바꿨습니다. 원래 출력은 'A'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-59-queue-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 pop()으로 마지막 접수 C를 먼저 처리함 상황을 확인하세요.
    starter: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.pop())'
    answer: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    hint: 큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. A,B가 기다립니다 C가 뒤에 합류합니다 앞에 있는 A를 제거해 출력합니다
    commonMistakes:
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-59-queue-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '큐와 선입선출' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 큐와 선입선출: 직접 구현"
    answer: 'from collections import deque

      waiting = deque(["A", "B"])

      waiting.append("C")

      print(waiting.popleft())'
    hint: 큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 A,B가 기다립니다 C가 뒤에 합류합니다 앞에 있는 A를 제거해 출력합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-59-queue-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - A
    answerIndex: 2
    explanation: "[A,B]  →  [A,B,C]  →  A 처리 순서로 실행되어 'A'을 출력합니다."
  - id: quiz-day-59-queue-model
    question: 큐와 선입선출을 이해하는 데 맞는 설명은?
    choices:
      - 큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.
      - pop()으로 마지막 접수 C를 먼저 처리함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.
  - id: quiz-day-59-queue-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - pop()으로 마지막 접수 C를 먼저 처리함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: pop()으로 마지막 접수 C를 먼저 처리함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-59-queue-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 먼저 도착한 요청부터 처리라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 먼저 도착한 요청부터 처리라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'from collections import deque

  waiting = deque(["A", "B"])

  waiting.append("C")

  print(waiting.popleft())'
---

## 오늘 배울 이유

먼저 접수한 요청을 먼저 처리해야 공정한 대기열이 됩니다. Day 59 "`큐와 선입선출`"에서는 Python 코드가 `A`을(를) 만드는 과정을 따라가며, 먼저 도착한 요청부터 처리 동작이 왜 필요한지 확인합니다. 먼저 도착한 요청부터 처리을(를) 빠뜨리면 `pop()으로 마지막 접수 C를 먼저 처리함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 58](/learn/day-58-undo-stack)에서는 "실행 취소에 스택 적용"을(를) 배웠습니다. "실행 취소에 스택 적용"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`큐와 선입선출`"에서 새로 달라지는 조건을 찾아보세요. Day 59의 답은 `A`이며, 핵심 표현은 `popleft()`입니다.

## 머릿속 그림

큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다. Day 59에서는 아래 흐름 순서대로 상태가 바뀌며, `popleft()`이(가) 결과를 가릅니다.

```text
[A,B]  →  [A,B,C]  →  A 처리
```

위 흐름에서 `popleft()`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `A`입니다.

## 천천히 풀어보기

은행 대기표처럼 먼저 온 사람이 먼저 처리되는 순서를 **큐**라고 합니다. A, B, C를 뒤에 넣으면 앞에서 A, 다음 B를 꺼냅니다. `collections.deque`에서 `append`는 뒤에 넣고 `popleft`는 앞에서 꺼냅니다.

일반 리스트의 맨 앞 `pop(0)`은 남은 원소를 당겨야 하므로 항목이 많으면 비쌉니다. `deque.popleft()`는 앞에서 꺼내기 용도에 맞습니다. 빈 큐에서 꺼내지 않도록 `if queue:` 같은 검사를 먼저 하세요. 스택의 최신 우선 순서와 큐의 접수 순서를 비교해 보세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 59 "`큐와 선입선출`"의 독립 예제입니다. 전체 4줄에서 `popleft()`이(가) 핵심이며, 실행 결과는 `A`입니다.

```python
from collections import deque
waiting = deque(["A", "B"])
waiting.append("C")
print(waiting.popleft())
```

예상 출력:

```text
A
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `A`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `popleft()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | from collections import deque
 2 | waiting = deque(["A", "B"])
 3 | waiting.append("C")
 4 | print(waiting.popleft())
```

1. A,B가 기다립니다
2. C가 뒤에 합류합니다
3. 앞에 있는 A를 제거해 출력합니다

위 단계에서 `popleft()`이(가) 빠지면 `A`이(가) 나오지 않습니다. `첫 문자열을 'A'에서 'A!'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [A,B]          |
|    2 | [A,B,C]        |
|    3 | A 처리         |

위 순서대로 실행하면 최종 출력 `A`이(가) 됩니다. `[A,B]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

접수 순서가 A→B→C라면 `append(A)`, `append(B)`, `append(C)`를 수행한 큐에서 첫 `popleft()`는 A, 두 번째는 B를 돌려줍니다. `pop()`을 사용하면 마지막 C가 나와 규칙이 바뀝니다. 접수 순서를 실제로 줄로 적고 어느 끝에서 꺼내는지 표시해 보세요.

## 시간과 공간 복잡도

양쪽 끝에서 넣고 빼는 덱은 append와 popleft가 각각 O(1)입니다. 접수 순서 A→B→C에서 첫 popleft는 A를 돌려줍니다. 리스트의 pop(0)은 앞 원소를 모두 옮겨 O(n)이므로 큐에는 덱을 씁니다. n건을 보관하면 공간은 O(n)입니다. Day 59의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 코드에서 `첫 문자열을 'A'에서 'A!'로` 바꾸면 아래와 같이 됩니다.

```python
from collections import deque
waiting = deque(["A!", "B"])
waiting.append("C")
print(waiting.popleft())
```

원본 출력은 `A`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `popleft()`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 59의 `큐와 선입선출`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: pop()으로 마지막 접수 C를 먼저 처리함.** 정상 코드에서는 `A`이(가) 출력됩니다.

- 정상 줄: `print(waiting.popleft())`
- 잘못된 줄: `print(waiting.pop())`

두 줄을 나란히 놓고 `큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `[A,B]`부터 `A`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **먼저 도착한 요청부터 처리**은(는) 세 언어에서 같은 입력과 출력(`A`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | 원형 배열 head/tail 관리   |
| Python | collections.deque popleft  |
| Rust   | VecDeque::pop_front        |

C17에서는 `원형 배열 head/tail 관리` 규칙으로 "`큐와 선입선출`"의 `A`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `collections.deque popleft` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `VecDeque::pop_front` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`A` 맞히기) → 빈칸(`popleft()` 채우기) → 변경(`첫 문자열을 'A'에서 'A!'로`) → 오류 수정(`pop()으로 마지막 접수 C를 먼저 처리함` 찾기) → 독립 구현(`큐와 선입선출을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `A` 및 `popleft()` 설명과 대조하세요.

## 스스로 설명하기

- "`큐와 선입선출`"이(가) 필요한 상황을 `먼저 도착한 요청부터 처리` 동작으로 설명해 보세요.
- 예제에서 `popleft()`이(가) 실행되기 직전의 상태와 직후의 출력 `A`을(를) 말해 보세요.
- "`pop()으로 마지막 접수 C를 먼저 처리함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `먼저 도착한 요청부터 처리` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

큐는 뒤에 넣고 앞에서 꺼냅니다. deque의 popleft는 오래된 항목을 O(1)에 꺼냅니다. Day 59 "`큐와 선입선출`"의 예제는 `popleft()`을(를) 실행해 `A`을(를) 출력합니다. "`pop()으로 마지막 접수 C를 먼저 처리함`" 여부를 확인하고 Day 59을(를) 완료하세요.
