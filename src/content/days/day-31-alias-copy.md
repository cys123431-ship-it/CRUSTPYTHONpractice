---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-31-alias-copy
courseId: crp-92
phaseId: phase-04
dayNumber: 31
date: "2026-10-31"
title: Python 별칭과 얕은 복사
summary: 두 변수가 같은 리스트를 공유하면 한쪽 수정이 다른 쪽에 보이므로 복사 여부를 판단해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-30-pointer-arithmetic
learningObjectives:
  - "'Python 별칭과 얕은 복사' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: copy = source를 독립된 리스트 복사라고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - alias copy
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
  - id: ex-day-31-alias-copy-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? source=[10,20]에서 시작해 계산하세요.
    starter: "source = [10, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    answer: "10"
    hint: copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.
    explanation: source=[10,20]  →  copy=[10,20]  →  copy=[99,20]  →  source[0]=10. 따라서 출력은 '10'입니다.
    commonMistakes:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-31-alias-copy-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python 별칭과 얕은 복사의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: source.copy()"
    starter: "source = [10, 20]

      copy = _____

      copy[0] = 99

      print(source[0])"
    answer: "source = [10, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    hint: source에 두 원소가 있습니다
    explanation: 빈칸에는 'source.copy()'이 들어갑니다. source에 두 원소가 있습니다 copy()가 다른 리스트를 만듭니다 copy[0]만 99가 되어 source[0]은 10입니다
    commonMistakes:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-31-alias-copy-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 10에서 11로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "source = [10, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    answer: "source = [11, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    hint: 처음 등장하는 숫자를 10에서 11로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 10에서 11로 바꿨습니다. 원래 출력은 '10'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-31-alias-copy-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 copy = source를 독립된 리스트 복사라고 생각함 상황을 확인하세요.
    starter: "source = [10, 20]

      copy = source

      copy[0] = 99

      print(source[0])"
    answer: "source = [10, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    hint: copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. source에 두 원소가 있습니다 copy()가 다른 리스트를 만듭니다 copy[0]만 99가 되어 source[0]은 10입니다
    commonMistakes:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-31-alias-copy-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python 별칭과 얕은 복사' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 별칭과 얕은 복사: 직접 구현"
    answer: "source = [10, 20]

      copy = source.copy()

      copy[0] = 99

      print(source[0])"
    hint: copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 source에 두 원소가 있습니다 copy()가 다른 리스트를 만듭니다 copy[0]만 99가 되어 source[0]은 10입니다
      다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-31-alias-copy-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "10"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: source=[10,20]  →  copy=[10,20]  →  copy=[99,20]  →  source[0]=10 순서로 실행되어 '10'을 출력합니다.
  - id: quiz-day-31-alias-copy-model
    question: Python 별칭과 얕은 복사을 이해하는 데 맞는 설명은?
    choices:
      - copy = source를 독립된 리스트 복사라고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.
    answerIndex: 2
    explanation: copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.
  - id: quiz-day-31-alias-copy-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - copy = source를 독립된 리스트 복사라고 생각함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: copy = source를 독립된 리스트 복사라고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-31-alias-copy-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 원본과 새 리스트를 구분함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 원본과 새 리스트를 구분함라는 목적과 입력·출력은 유지합니다.
playgroundSource: "source = [10, 20]

  copy = source.copy()

  copy[0] = 99

  print(source[0])"
---

## 오늘 배울 이유

두 변수가 같은 리스트를 공유하면 한쪽 수정이 다른 쪽에 보이므로 복사 여부를 판단해야 합니다. Day 31 "`Python 별칭과 얕은 복사`"에서는 Python 코드의 실행 결과(`10`)를 따라가며, `원본과 새 리스트를 구분함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`copy = source를 독립된 리스트 복사라고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 30](/learn/day-30-pointer-arithmetic)에서 배운 "C 포인터 이동과 배열" 내용을 한 문장으로 말해 보세요. 이번 "`Python 별칭과 얕은 복사`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `source.copy()`입니다.

## 머릿속 그림

copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다. Day 31에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `source.copy()`입니다.

```text
source=[10,20]  →  copy=[10,20]  →  copy=[99,20]  →  source[0]=10
```

위 흐름에서 `source.copy()` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `10`입니다.

## 천천히 풀어보기

`alias = source`는 두 이름을 같은 리스트 객체에 붙입니다. `alias.append(30)`을 하면 `source`로 보아도 30이 추가되어 있습니다. `copy = source.copy()`는 새 바깥 리스트를 만들므로 `copy.append(40)`은 원래 리스트의 바깥 목록을 바꾸지 않습니다.

하지만 `[ [10] ]`처럼 **안에 또 리스트가 있다면** 얕은 복사는 안쪽 리스트를 공유합니다. `copy[0].append(20)`을 하면 원본의 안쪽 리스트에도 20이 보입니다. 복사하고 싶은 것이 바깥 목록인지 그 안의 값까지인지 먼저 묻고, 필요하면 `copy.deepcopy` 같은 깊은 복사를 고려하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 31 "`Python 별칭과 얕은 복사`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `source.copy()`이며, 실행 결과는 `10`입니다.

```python
source = [10, 20]
copy = source.copy()
copy[0] = 99
print(source[0])
```

예상 출력:

```text
10
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`10`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `source.copy()`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | source = [10, 20]
 2 | copy = source.copy()
 3 | copy[0] = 99
 4 | print(source[0])
```

1. source에 두 원소가 있습니다
2. copy()가 다른 리스트를 만듭니다
3. copy[0]만 99가 되어 source[0]은 10입니다

`source.copy()` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | source=[10,20] |
|    2 | copy=[10,20]   |
|    3 | copy=[99,20]   |
|    4 | source[0]=10   |

위 순서대로 실행한 최종 출력은 `10`입니다. `source=[10,20]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`a = [[10]]; b = a.copy(); b[0].append(20)`을 따라가면 바깥 리스트는 두 개지만 **안쪽 리스트는 하나**입니다. 따라서 `print(a)`는 `[[10, 20]]`입니다. 반대로 `b.append([30])`은 새 바깥 리스트에만 원소를 붙이므로 `a`에는 안 보입니다. 무엇이 새로 복사됐는지 두 겹으로 그리세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `10`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
source = [11, 20]
copy = source.copy()
copy[0] = 99
print(source[0])
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
11
```

원본(`10`)과 달라졌습니다. 다른 줄(`source = [10, 20]` → `source = [11, 20]`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`source=[10,20]` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: copy = source를 독립된 리스트 복사라고 생각함.** 정상 코드의 실행 결과는 `10`입니다.

- 정상 줄: `copy = source.copy()`
- 잘못된 줄: `copy = source`

두 줄을 나란히 놓고 `copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `source=[10,20]`부터 `10`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `원본과 새 리스트를 구분함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙                |
| ------ | ----------------------------------------- |
| C17    | 배열을 원소별 복사하거나 memcpy 길이 확인 |
| Python | list.copy는 얕은 복사                     |
| Rust   | Vec::clone은 새 소유 데이터               |

C17에서는 `배열을 원소별 복사하거나 memcpy 길이 확인` 규칙을 적용합니다. "`Python 별칭과 얕은 복사`" 수업의 실행 결과(`10`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `list.copy는 얕은 복사` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Vec::clone은 새 소유 데이터` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`10` 맞히기) → 빈칸(`source.copy()` 채우기) → 변경(`처음 등장하는 숫자를 10에서 11로`) → 오류 수정(`copy = source를 독립된 리스트 복사라고 생각함` 찾기) → 독립 구현(`Python 별칭과 얕은 복사을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `10` 및 `source.copy()` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 별칭과 얕은 복사`" 수업이 필요한 이유는 `원본과 새 리스트를 구분함` 동작으로 설명해 보세요.
- 예제에서 `source.copy()` 부분 실행 직전의 상태와 직후의 출력(`10`)을 말해 보세요.
- "`copy = source를 독립된 리스트 복사라고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `원본과 새 리스트를 구분함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

copy()는 새 바깥 리스트를 만들고, 단순 대입은 같은 리스트에 새 이름만 붙입니다. Day 31 "`Python 별칭과 얕은 복사`" 예제의 핵심 부분은 `source.copy()`이며, 실행 결과는 `10`입니다. "`copy = source를 독립된 리스트 복사라고 생각함`" 여부를 확인하고 Day 31 수업을 완료하세요.
