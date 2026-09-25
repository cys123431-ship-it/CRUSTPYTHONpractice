---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-66-heap
courseId: crp-92
phaseId: phase-06
dayNumber: 66
date: "2026-12-05"
title: 힙과 우선순위 큐
summary: 항상 가장 작은 작업을 먼저 처리해야 할 때 매번 전체를 정렬할 필요는 없습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-65-bst
learningObjectives:
  - "'힙과 우선순위 큐' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 힙 내부 배열 전체가 정렬돼 있다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - heap
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
  - id: ex-day-66-heap-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [30,10,20]에서 시작해 계산하세요.
    starter: "import heapq

      waiting = [30, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    answer: "10"
    hint: 최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.
    explanation: "[30,10,20]  →  heapify 최소 루트 10  →  pop 10. 따라서 출력은 '10'입니다."
    commonMistakes:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-66-heap-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 힙과 우선순위 큐의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: heapify(waiting)"
    starter: "import heapq

      waiting = [30, 10, 20]

      heapq._____

      print(heapq.heappop(waiting))"
    answer: "import heapq

      waiting = [30, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    hint: 세 우선순위를 힙으로 재배열합니다
    explanation: 빈칸에는 'heapify(waiting)'이 들어갑니다. 세 우선순위를 힙으로 재배열합니다 루트가 최소 10입니다 heappop이 10을 제거·반환합니다
    commonMistakes:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-66-heap-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "import heapq

      waiting = [30, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    answer: "import heapq

      waiting = [31, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 30에서 31로 바꿨습니다. 원래 출력은 '10'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-66-heap-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 힙 내부 배열 전체가 정렬돼 있다고 생각함 상황을 확인하세요.
    starter: "import heapq

      waiting = [30, 10, 20]

      heapq.waiting.sort()

      print(heapq.heappop(waiting))"
    answer: "import heapq

      waiting = [30, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    hint: 최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 세 우선순위를 힙으로 재배열합니다 루트가 최소 10입니다 heappop이 10을 제거·반환합니다
    commonMistakes:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-66-heap-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '힙과 우선순위 큐' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 힙과 우선순위 큐: 직접 구현"
    answer: "import heapq

      waiting = [30, 10, 20]

      heapq.heapify(waiting)

      print(heapq.heappop(waiting))"
    hint: 최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 세 우선순위를 힙으로 재배열합니다 루트가 최소 10입니다 heappop이 10을 제거·반환합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-66-heap-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "10"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: "[30,10,20]  →  heapify 최소 루트 10  →  pop 10 순서로 실행되어 '10'을 출력합니다."
  - id: quiz-day-66-heap-model
    question: 힙과 우선순위 큐을 이해하는 데 맞는 설명은?
    choices:
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함(이것이 정상적인 사용법이다)
      - 최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.
  - id: quiz-day-66-heap-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 힙 내부 배열 전체가 정렬돼 있다고 생각함
    answerIndex: 2
    explanation: 힙 내부 배열 전체가 정렬돼 있다고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-66-heap-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 최소 우선순위 추출라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 최소 우선순위 추출라는 목적과 입력·출력은 유지합니다.
playgroundSource: "import heapq

  waiting = [30, 10, 20]

  heapq.heapify(waiting)

  print(heapq.heappop(waiting))"
---

## 오늘 배울 이유

항상 가장 작은 작업을 먼저 처리해야 할 때 매번 전체를 정렬할 필요는 없습니다. Day 66 "`힙과 우선순위 큐`"에서는 Python 코드의 실행 결과(`10`)를 따라가며, `최소 우선순위 추출` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`힙 내부 배열 전체가 정렬돼 있다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 65](/learn/day-65-bst)에서 배운 "이진 탐색 트리의 비교 경로" 내용을 한 문장으로 말해 보세요. 이번 "`힙과 우선순위 큐`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `heapify(waiting)`입니다.

## 머릿속 그림

최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다. Day 66에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `heapify(waiting)`입니다.

```text
[30,10,20]  →  heapify 최소 루트 10  →  pop 10
```

위 흐름에서 `heapify(waiting)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `10`입니다.

## 천천히 풀어보기

최소 힙은 부모가 자식보다 크지 않다는 규칙을 지킵니다. 이것은 **전체 배열이 정렬됐다**는 뜻은 아닙니다. 가장 작은 값이 맨 앞에 있다는 것만 우선 보장합니다. `[5,1,3]`에 `heapify`를 한 뒤 하나씩 꺼내면 1, 3, 5 순서입니다.

우선순위 큐는 먼저 들어온 순서가 아니라 가장 높은 우선순위부터 꺼냅니다. Python `heapq`는 작은 수가 우선입니다. 빈 힙에서 `heappop`하면 오류가 나므로 항목이 남아 있는지 확인하세요. 동점인 작업의 순서가 중요하면 보조 순번을 함께 넣는 방법도 필요합니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 66 "`힙과 우선순위 큐`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `heapify(waiting)`이며, 실행 결과는 `10`입니다.

```python
import heapq
waiting = [30, 10, 20]
heapq.heapify(waiting)
print(heapq.heappop(waiting))
```

예상 출력:

```text
10
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`10`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `heapify(waiting)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | import heapq
 2 | waiting = [30, 10, 20]
 3 | heapq.heapify(waiting)
 4 | print(heapq.heappop(waiting))
```

1. 세 우선순위를 힙으로 재배열합니다
2. 루트가 최소 10입니다
3. heappop이 10을 제거·반환합니다

`heapify(waiting)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작       |
| ---: | -------------------- |
|    1 | [30,10,20]           |
|    2 | heapify 최소 루트 10 |
|    3 | pop 10               |

위 순서대로 실행한 최종 출력은 `10`입니다. `[30,10,20]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

우선순위를 수 `4,1,3`으로 나타내 최소 힙에 넣으면 첫 `heappop()`은 1입니다. 나머지 내부 배열이 언제나 `[3,4]`처럼 완전히 정렬된 것은 아닙니다. 힙 규칙은 **부모가 자식보다 크지 않다**는 약속이고, 정렬된 전체 목록이 필요하면 원소를 하나씩 꺼내야 합니다.

## 시간과 공간 복잡도

최소 힙의 삽입과 꺼내기는 트리 높이에 비례해 O(log n)입니다. peek는 맨 위를 바로 봐 O(1)입니다. 내부 배열이 완전히 정렬된 것은 아니므로 정렬된 목록이 필요하면 하나씩 꺼내야 합니다. n개 보관 시 공간은 O(n)입니다. Day 66의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `10`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
import heapq
waiting = [31, 10, 20]
heapq.heapify(waiting)
print(heapq.heappop(waiting))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
10
```

`10`로 같습니다. 바꾼 31이 최솟값이 아니라 꺼내는 값은 그대로 10입니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`waiting = [31, 10, 20]`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: 힙 내부 배열 전체가 정렬돼 있다고 생각함.** 정상 코드의 실행 결과는 `10`입니다.

- 정상 줄: `heapq.heapify(waiting)`
- 잘못된 줄: `heapq.waiting.sort()`

두 줄을 나란히 놓고 `최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `[30,10,20]`부터 `10`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `최소 우선순위 추출`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙              |
| ------ | --------------------------------------- |
| C17    | 배열 인덱스 2i+1,2i+2로 sift 구현       |
| Python | heapq의 최소 힙                         |
| Rust   | BinaryHeap은 기본 최대 힙, Reverse 사용 |

C17에서는 `배열 인덱스 2i+1,2i+2로 sift 구현` 규칙을 적용합니다. "`힙과 우선순위 큐`" 수업의 실행 결과(`10`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `heapq의 최소 힙` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `BinaryHeap은 기본 최대 힙, Reverse 사용` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`10` 맞히기) → 빈칸(`heapify(waiting)` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`힙 내부 배열 전체가 정렬돼 있다고 생각함` 찾기) → 독립 구현(`힙과 우선순위 큐을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `10` 및 `heapify(waiting)` 설명과 대조하세요.

## 스스로 설명하기

- "`힙과 우선순위 큐`" 수업이 필요한 이유는 `최소 우선순위 추출` 동작으로 설명해 보세요.
- 예제에서 `heapify(waiting)` 부분 실행 직전의 상태와 직후의 출력(`10`)을 말해 보세요.
- "`힙 내부 배열 전체가 정렬돼 있다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `최소 우선순위 추출` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

최소 힙은 부모가 자식 이하라는 규칙을 유지하고 루트에서 최소값을 꺼냅니다. Day 66 "`힙과 우선순위 큐`" 예제의 핵심 부분은 `heapify(waiting)`이며, 실행 결과는 `10`입니다. "`힙 내부 배열 전체가 정렬돼 있다고 생각함`" 여부를 확인하고 Day 66 수업을 완료하세요.
