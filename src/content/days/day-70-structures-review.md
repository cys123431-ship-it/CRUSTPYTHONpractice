---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-70-structures-review
courseId: crp-92
phaseId: phase-06
dayNumber: 70
date: "2026-12-09"
title: 자료구조 선택 회상
summary: 문제의 입력·제거 순서를 보고 스택·큐·트리·해시 중 무엇을 고를지 말로 정리합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 50
prerequisites:
  - day-69-bfs
learningObjectives:
  - "'자료구조 선택 회상' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 최근 항목 pop을 써서 접수 순서를 뒤집음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - structures review
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
  - id: ex-day-70-structures-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? first 대기에서 시작해 계산하세요.
    starter: 'from collections import deque

      work = deque(["first", "second"])

      print(work.popleft())'
    answer: first
    hint: first 대기에서 시작해 first 처리까지 순서대로 적어 보세요. 접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다.
    explanation:
      1. first가 먼저 들어왔습니다. 2. second가 뒤에 있습니다. 3. popleft가 first를 처리합니다. `first 대기 → second 대기 → first
      처리` 흐름으로 실제 출력 `first`가 됩니다. 핵심 `popleft()`는 접수 순서를 지키는 자리에 쓰입니다.
    commonMistakes:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-70-structures-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 자료구조 선택 회상의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: popleft()"
    starter: 'from collections import deque

      work = deque(["first", "second"])

      print(work._____)'
    answer: 'from collections import deque

      work = deque(["first", "second"])

      print(work.popleft())'
    hint: 필요한 표현은 처리 순서에 맞는 구조 선택 동작을 잇는 popleft()입니다.
    explanation:
      빈칸에 들어갈 표현은 'popleft()'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. first가 먼저 들어왔습니다. 2. second가 뒤에 있습니다. 3. popleft가
      first를 처리합니다. `first 대기 → second 대기 → first 처리` 흐름으로 실제 출력 `first`가 됩니다. 핵심 `popleft()`는 접수 순서를 지키는 자리에 쓰입니다.
    commonMistakes:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-70-structures-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 'first'에서 'first!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'from collections import deque

      work = deque(["first", "second"])

      print(work.popleft())'
    answer: 'from collections import deque

      work = deque(["first!", "second"])

      print(work.popleft())'
    hint: 첫 문자열을 'first'에서 'first!'로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 'first'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 'first!'입니다. 원본은 `first`, 수정본은 `first!`이다. 첫 변경 줄 `work = deque(["first", "second"])`에서
      `work = deque(["first!", "second"])`로 첫 값을 바꾸면, 앞에서 꺼내는 값이 그대로 달라진다.
    commonMistakes:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-70-structures-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 최근 항목 pop을 써서 접수 순서를 뒤집음 상황을 확인하세요.
    starter: 'from collections import deque

      work = deque(["first", "second"])

      print(work.pop())'
    answer: 'from collections import deque

      work = deque(["first", "second"])

      print(work.popleft())'
    hint: 최근 항목 pop을 써서 접수 순서를 뒤집음 상황에서 어긋나는 줄을 접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `print(work.pop())`입니다. 맨 뒤의 second를 꺼내므로 실행은 되지만 결과는 `second`가 됩니다. 오류 분류는 잘못된 출력입니다. 접수 순서가
      뒤집히는 첫 순간은 꺼내는 쪽입니다. 고친 줄 `print(work.popleft())`에서는 `처리 순서에 맞는 구조 선택` 동작이 지켜집니다. 정상 코드는 접수 순서 저장→맨 앞 처리→출력의
      순서로 `first`를 출력합니다.
    commonMistakes:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-70-structures-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 자료구조 선택 회상 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 자료구조 선택 회상: 직접 구현"
    answer: 'from collections import deque

      work = deque(["first", "second"])

      print(work.popleft())'
    hint: A,B,C가 접수됐는데 C가 먼저 처리되면 규칙 위반입니다. 답 모양보다 유지할 규칙을 먼저 정하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. A,B,C가 접수됐는데 C가 먼저 처리되면 규칙 위반입니다. 답 모양보다 유지할 규칙을 먼저 정하세요. 같은 처리 순서에 맞는
      구조 선택 동작을 구현하고 실행 결과 'first'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-70-structures-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - first
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 first와 second가 순서대로 들어 있습니다. 이어서 popleft가 first를 꺼내 출력하므로 `first`가 됩니다. `실행 전에 반드시 오류가 난다`는 틀린
      선택지인데 덱 연산이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-70-structures-review-model
    question: "'자료구조 선택 회상' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다.
    answerIndex: 2
    explanation:
      접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞다는 뜻은, 규칙이 구조를 정한다는 뜻입니다. `최근 항목 pop을 써서 접수 순서를 뒤집음`은 반대 사례인데, 맨 뒤를
      꺼내면 규칙을 어기기 때문입니다.
  - id: quiz-day-70-structures-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 최근 항목 pop을 써서 접수 순서를 뒤집음
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `최근 항목 pop을 써서 접수 순서를 뒤집음`입니다. 잘못된 코드는 실행은 되지만 `second`라는 잘못된 출력을 냅니다. 무엇을 먼저 꺼내야 하는지
      먼저 물으세요.
  - id: quiz-day-70-structures-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 처리 순서에 맞는 구조 선택라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `처리 순서에 맞는 구조 선택`이라는 의미와 입력·출력 계약입니다. 스택·사전·집합 후보와 비교해 같은 동작을 구현하고, 실행 결과 `first`로
      대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource: 'from collections import deque

  work = deque(["first", "second"])

  print(work.popleft())'
---

## 오늘 배울 이유

문제의 입력·제거 순서를 보고 스택·큐·트리·해시 중 무엇을 고를지 말로 정리합니다. Day 70 "`자료구조 선택 회상`"에서는 Python 코드의 실행 결과(`first`)를 따라가며, `처리 순서에 맞는 구조 선택` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`최근 항목 pop을 써서 접수 순서를 뒤집음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 69](/learn/day-69-bfs)에서 배운 "너비 우선 탐색과 방문 집합" 내용을 한 문장으로 말해 보세요. 이번 "`자료구조 선택 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `popleft()`입니다.

## 머릿속 그림

접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다. Day 70에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `popleft()`입니다.

```text
first 대기  →  second 대기  →  first 처리
```

위 흐름에서 `popleft()` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `first`입니다.

## 천천히 풀어보기

자료구조를 고를 때는 '무엇을 먼저 꺼내야 하는가'로 시작하세요. 접수 순서라면 큐, 마지막 편집 취소라면 스택, 이름으로 빠르게 합계를 찾는다면 사전, 중복 없는 방문 기록이라면 집합입니다.

예를 들어 A,B,C가 접수됐는데 C가 먼저 처리되면 접수 순서 규칙을 어긴 것입니다. A를 먼저 꺼내는 큐의 동작을 손으로 확인하세요. 답을 저장하는 모양보다 **유지해야 하는 규칙**이 자료구조 선택의 근거입니다.

자료구조를 고를 때는 무엇을 먼저 꺼내야 하는가로 시작하세요. 접수 순서라면 큐, 마지막 편집 취소라면 스택, 이름으로 빠르게 합계를 찾는다면 사전, 중복 없는 방문 기록이라면 집합입니다.

예를 들어 A,B,C가 접수됐는데 C가 먼저 처리되면 접수 순서 규칙을 어긴 것입니다. A를 먼저 꺼내는 큐의 동작을 손으로 확인하세요. 답을 저장하는 모양보다 유지해야 하는 규칙이 자료구조 선택의 근거입니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 70 "`자료구조 선택 회상`"의 독립 예제입니다. 전체 3줄 가운데 핵심 부분은 `popleft()`이며, 실행 결과는 `first`입니다.

```python
from collections import deque
work = deque(["first", "second"])
print(work.popleft())
```

예상 출력:

```text
first
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`first`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `popleft()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```python
 1 | from collections import deque
 2 | work = deque(["first", "second"])
 3 | print(work.popleft())
```

1. first가 먼저 들어왔습니다
2. second가 뒤에 있습니다
3. popleft가 first를 처리합니다

`popleft()` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | first 대기     |
|    2 | second 대기    |
|    3 | first 처리     |

위 순서대로 실행한 최종 출력은 `first`입니다. `first 대기` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

방문할 고객이 `[A,B,C]`라면 큐에서 첫 고객 A를 처리해야 순서를 지킵니다. 같은 데이터를 작업 취소 기록이라고 가정하면 스택에서는 최근 C가 먼저 나와야 합니다. 사전은 고객 이름으로 기록을 찾을 때, 집합은 이미 처리한 고객의 중복을 확인할 때 사용합니다.

## 시간과 공간 복잡도

대기 고객은 큐로 먼저 온 A부터 처리해 순서를 지키고, 작업 취소는 스택으로 최근 것부터 되돌립니다. 이름으로 찾을 때는 사전, 중복 확인은 집합이 맞습니다. 꺼내는 쪽의 연산은 O(1), 이름 탐색은 평균 O(1)입니다. Day 70의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `first`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
from collections import deque
work = deque(["first!", "second"])
print(work.popleft())
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
first!
```

원본은 `first`, 수정본은 `first!`이다. 첫 변경 줄 `work = deque(["first", "second"])`에서 `work = deque(["first!", "second"])`로 첫 값을 바꾸면, 앞에서 꺼내는 값이 그대로 달라진다.

## 자주 틀리는 지점

**확인할 실수: 최근 항목 pop을 써서 접수 순서를 뒤집음.** 정상 코드의 실행 결과는 `first`입니다.

- 정상 줄: `print(work.popleft())`
- 잘못된 줄: `print(work.pop())`

두 줄을 나란히 놓으면 정상 줄 `print(work.popleft())`이 `접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다.` 설명과 맞고, 잘못된 줄은 `최근 항목 pop을 써서 접수 순서를 뒤집음` 쪽으로 어긋납니다. 결과가 예상과 다르면 `first 대기`부터 `first`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `처리 순서에 맞는 구조 선택`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | 원형 큐로 FIFO 구현        |
| Python | deque.popleft              |
| Rust   | VecDeque::pop_front        |

C17에서는 `원형 큐로 FIFO 구현` 규칙을 적용합니다. "`자료구조 선택 회상`" 수업의 실행 결과(`first`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `deque.popleft` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `VecDeque::pop_front` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`first` 맞히기) → 빈칸(`popleft()` 채우기) → 변경(`첫 문자열을 'first'에서 'first!'로`) → 오류 수정(`최근 항목 pop을 써서 접수 순서를 뒤집음` 찾기) → 독립 구현(`'자료구조 선택 회상' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `first` 및 `popleft()` 설명과 대조하세요.

## 스스로 설명하기

- "`자료구조 선택 회상`" 수업이 필요한 이유는 `처리 순서에 맞는 구조 선택` 동작으로 설명해 보세요.
- 예제에서 `popleft()` 부분 실행 직전의 상태와 직후의 출력(`first`)을 말해 보세요.
- "`최근 항목 pop을 써서 접수 순서를 뒤집음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `처리 순서에 맞는 구조 선택` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

접수 순서 보존이 불변식이라면 앞에서 꺼내는 큐가 맞습니다. Day 70 "`자료구조 선택 회상`" 예제의 핵심 부분은 `popleft()`이며, 실행 결과는 `first`입니다. "`최근 항목 pop을 써서 접수 순서를 뒤집음`" 여부를 확인하고 Day 70 수업을 완료하세요.
