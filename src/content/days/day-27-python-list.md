---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-27-python-list
courseId: crp-92
phaseId: phase-03
dayNumber: 27
date: "2026-10-27"
title: Python list 추가와 순회
summary: 기록 개수가 늘어날 수 있으면 크기를 바꿀 수 있는 순서 자료구조가 편리합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-26-c-array
learningObjectives:
  - "'Python list 추가와 순회' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: append의 반환값을 새 리스트라고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - python list
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
  - id: ex-day-27-python-list-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [10,20]에서 시작해 계산하세요.
    starter: "minutes = [10, 20]

      minutes.append(30)

      print(sum(minutes))"
    answer: "60"
    hint: list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.
    explanation: "[10,20]  →  [10,20,30]  →  60. 따라서 출력은 '60'입니다."
    commonMistakes:
      - append의 반환값을 새 리스트라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-27-python-list-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Python list 추가와 순회' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: append(30)"
    starter: "minutes = [10, 20]

      minutes._____

      print(sum(minutes))"
    answer: "minutes = [10, 20]

      minutes.append(30)

      print(sum(minutes))"
    hint: "[10,20]으로 시작합니다"
    explanation: 빈칸에 들어갈 표현은 'append(30)'입니다. [10,20]으로 시작합니다 끝에 30을 추가해 길이 3이 됩니다 sum이 60을 반환합니다
    commonMistakes:
      - append의 반환값을 새 리스트라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-27-python-list-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 10에서 11로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "minutes = [10, 20]

      minutes.append(30)

      print(sum(minutes))"
    answer: "minutes = [11, 20]

      minutes.append(30)

      print(sum(minutes))"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 10에서 11로."
    explanation:
      바꾼 뒤 출력은 '61'입니다. 원본 출력 '60'에서 달라졌습니다. 다른 줄(minutes = [10, 20] → minutes = [11, 20])에서 시작한 차이가 최종
      출력에 반영되었습니다.
    commonMistakes:
      - append의 반환값을 새 리스트라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-27-python-list-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 append의 반환값을 새 리스트라고 생각함 상황을 확인하세요.
    starter: "minutes = [10, 20]

      minutes.pop(30)

      print(sum(minutes))"
    answer: "minutes = [10, 20]

      minutes.append(30)

      print(sum(minutes))"
    hint: list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. [10,20]으로 시작합니다 끝에 30을 추가해 길이 3이 됩니다 sum이 60을 반환합니다
    commonMistakes:
      - append의 반환값을 새 리스트라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-27-python-list-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python list 추가와 순회' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python list 추가와 순회: 직접 구현"
    answer: "minutes = [10, 20]

      minutes.append(30)

      print(sum(minutes))"
    hint: list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 [10,20]으로 시작합니다 끝에 30을 추가해 길이 3이 됩니다 sum이 60을 반환합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - append의 반환값을 새 리스트라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-27-python-list-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "60"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: "[10,20]  →  [10,20,30]  →  60 순서로 실행되어 출력은 '60'입니다."
  - id: quiz-day-27-python-list-model
    question: "'Python list 추가와 순회' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - append의 반환값을 새 리스트라고 생각함(이것이 정상적인 사용법이다)
      - list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.
  - id: quiz-day-27-python-list-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - append의 반환값을 새 리스트라고 생각함
    answerIndex: 2
    explanation: append의 반환값을 새 리스트라고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-27-python-list-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 가변 시퀀스의 끝에 추가함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 가변 시퀀스의 끝에 추가함라는 목적과 입력·출력은 유지합니다.
playgroundSource: "minutes = [10, 20]

  minutes.append(30)

  print(sum(minutes))"
---

## 오늘 배울 이유

기록 개수가 늘어날 수 있으면 크기를 바꿀 수 있는 순서 자료구조가 편리합니다. Day 27 "`Python list 추가와 순회`"에서는 Python 코드의 실행 결과(`60`)를 따라가며, `가변 시퀀스의 끝에 추가함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`append의 반환값을 새 리스트라고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 26](/learn/day-26-c-array)에서 배운 "C 배열과 인덱스" 내용을 한 문장으로 말해 보세요. 이번 "`Python list 추가와 순회`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `append(30)`입니다.

## 머릿속 그림

list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다. Day 27에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `append(30)`입니다.

```text
[10,20]  →  [10,20,30]  →  60
```

위 흐름에서 `append(30)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

Python 리스트는 여러 값을 순서대로 묶어 둡니다. `[10,20]`에서 `append(30)`을 부르면 맨 뒤에 30이 생겨 `[10,20,30]`이 됩니다. 새 리스트를 받는 것이 아니라 **같은 리스트**를 변경하는 메서드이므로 `items = items.append(30)`처럼 쓰면 `items`에 `None`이 들어갑니다.

`for value in items:`는 원소 10, 20, 30을 차례로 읽습니다. 인덱스로 접근할 때는 0부터 세고 `len(items)`는 항목 수 3을 돌려줍니다. 빈 리스트에 append한 뒤 길이와 첫 원소가 어떻게 달라지는지도 시험해 보세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 27 "`Python list 추가와 순회`"의 독립 예제입니다. 전체 3줄 가운데 핵심 부분은 `append(30)`이며, 실행 결과는 `60`입니다.

```python
minutes = [10, 20]
minutes.append(30)
print(sum(minutes))
```

예상 출력:

```text
60
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`60`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `append(30)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | minutes = [10, 20]
 2 | minutes.append(30)
 3 | print(sum(minutes))
```

1. [10,20]으로 시작합니다
2. 끝에 30을 추가해 길이 3이 됩니다
3. sum이 60을 반환합니다

`append(30)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | [10,20]        |
|    2 | [10,20,30]     |
|    3 | 60             |

위 순서대로 실행한 최종 출력은 `60`입니다. `[10,20]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`items = [1,2]; items.append(3); print(len(items))`의 결과는 3입니다. 추가 전에는 두 항목, 추가 뒤에는 세 항목입니다. `print(items.append(4))`를 실행하면 리스트에 4가 추가되지만 화면에는 `None`이 표시됩니다. `append`의 반환값을 새 리스트로 오해하지 마세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `60`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
minutes = [11, 20]
minutes.append(30)
print(sum(minutes))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
61
```

원본과 달라졌습니다. 원본 출력은 `60`입니다. 다른 줄(`minutes = [10, 20]` → `minutes = [11, 20]`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`[10,20]` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: append의 반환값을 새 리스트라고 생각함.** 정상 코드의 실행 결과는 `60`입니다.

- 정상 줄: `minutes.append(30)`
- 잘못된 줄: `minutes.pop(30)`

두 줄을 나란히 놓고 `list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `[10,20]`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `가변 시퀀스의 끝에 추가함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙       |
| ------ | -------------------------------- |
| C17    | 용량과 길이를 직접 관리하는 배열 |
| Python | list.append와 sum                |
| Rust   | Vec::push와 iter().sum()         |

C17에서는 `용량과 길이를 직접 관리하는 배열` 규칙을 적용합니다. "`Python list 추가와 순회`" 수업의 실행 결과(`60`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `list.append와 sum` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Vec::push와 iter().sum()` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`append(30)` 채우기) → 변경(`처음 등장하는 숫자를 10에서 11로`) → 오류 수정(`append의 반환값을 새 리스트라고 생각함` 찾기) → 독립 구현(`'Python list 추가와 순회' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `append(30)` 설명과 대조하세요.

## 스스로 설명하기

- "`Python list 추가와 순회`" 수업이 필요한 이유는 `가변 시퀀스의 끝에 추가함` 동작으로 설명해 보세요.
- 예제에서 `append(30)` 부분 실행 직전의 상태와 직후의 출력(`60`)을 말해 보세요.
- "`append의 반환값을 새 리스트라고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `가변 시퀀스의 끝에 추가함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

list는 원소를 순서대로 담고 append는 맨 끝에 새 원소를 넣습니다. Day 27 "`Python list 추가와 순회`" 예제의 핵심 부분은 `append(30)`이며, 실행 결과는 `60`입니다. "`append의 반환값을 새 리스트라고 생각함`" 여부를 확인하고 Day 27 수업을 완료하세요.
