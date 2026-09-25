---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-86-python-aggregate
courseId: crp-92
phaseId: phase-08
dayNumber: 86
date: "2026-12-25"
title: Python 집계·정렬·Top N
summary: 필터 후 언어별 분을 합치고 동률일 때 정렬 기준까지 정해야 세 언어의 출력이 같습니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-85-python-csv-parse
learningObjectives:
  - "'Python 집계·정렬·Top N' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - python aggregate
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
  - id: ex-day-86-python-aggregate-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? C=30에서 시작해 계산하세요.
    starter: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    answer: ('C', 45)
    hint: 사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. 설명을 떠올리고 `C=30` 단계부터 순서대로 적어 보세요.
    explanation:
      C=30  →  Python=45  →  C=45  →  동률은 이름순 C 순서로 실행됩니다. `totals.get(name, 0)` 부분이 `동률은 이름순 C` 단계를 확정해
      최종 출력 "('C', 45)"가 됩니다. 이 흐름을 떠올리면 `그룹별 합계와 결정적 정렬` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-86-python-aggregate-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'Python 집계·정렬·Top N' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: totals.get(name, 0)"
    starter: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = _____ + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    answer: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    hint: 힌트 문장을 완전하게 읽으면 `C 30을 기록합니다` 단계에 필요한 표현이 `totals.get(name, 0)`입니다.
    explanation:
      '빈칸에 들어갈 표현은 ''totals.get(name, 0)''입니다. `for name, minutes in rows: totals[name] = totals.get(name,
      0) + minutes` 줄을 완성해야 `그룹별 합계와 결정적 정렬` 동작이 이어져 실행 결과 "(''C'', 45)"가 됩니다. 힌트의 첫 단계 `C 30을 기록합니다`이 바로 이 줄입니다.
      이어서 Python 45와 C의 추가 15로 둘 다 45입니다 동률에서 C가 앞서 첫 항목입니다 순서로 진행됩니다.'
    commonMistakes:
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-86-python-aggregate-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 30에서 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    answer: 'rows = [("C", 31), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 30에서 31로."
    explanation:
      바꾼 뒤 출력은 "('C', 46)"입니다. 원본 출력 "('C', 45)"에서 달라졌습니다. 바뀐 줄은 `rows = [("C", 30), ("Python", 45), ("C",
      15)]`에서 `rows = [("C", 31), ("Python", 45), ("C", 15)]`로 바뀌었습니다. 바뀐 프로그램은 `C=30` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고,
      그 차이가 이후 단계로 이어져 최종 `('C', 46)`가 됩니다. 원본 추적 `C=30  →  Python=45  →  C=45  →  동률은 이름순 C`와 바뀐 줄 이후를 순서대로 비교하면
      처음 달라지는 곳이 보입니다.
    commonMistakes:
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-86-python-aggregate-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐 상황을 확인하세요.
    starter: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 1) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    answer: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    hint:
      사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. 설명과 어긋나는 줄을 찾으세요. `동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 상황이
      단서가 됩니다.
    explanation:
      '틀린 줄은 `for name, minutes in rows: totals[name] = totals.get(name, 1) + minutes`입니다. 여기서는 `totals.get(name,
      1)`을 써서 `totals.get(name, 0)` 동작이 깨집니다. 이대로 실행하면 `동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 문제가 생겨 원본 추적 `C=30  →  Python=45  →  C=45  →  동률은
      이름순 C`대로 "(''C'', 45)"가 나오지 않습니다. 고친 줄 `for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes`에서는
      `totals.get(name, 0)`가 `그룹별 합계와 결정적 정렬` 동작을 지켜 "(''C'', 45)"까지 도달합니다.'
    commonMistakes:
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-86-python-aggregate-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python 집계·정렬·Top N' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 집계·정렬·Top N: 직접 구현"
    answer: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

      totals = {}

      for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

      print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
    hint: 사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `totals.get(name, 0)` 부분이 `그룹별 합계와 결정적 정렬` 동작을 지켜 실행 결과 "('C', 45)"가 됩니다. 같은
      개념을 다른 입력으로 바꿔도 `totals.get(name, 0)`부터 `동률은 이름순 C`까지 추적할 수 있으면 정답입니다. `동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 상황과
      빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-86-python-aggregate-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - ('C', 45)
    answerIndex: 2
    explanation:
      C=30  →  Python=45  →  C=45  →  동률은 이름순 C 순서로 실행되어 출력은 "('C', 45)"입니다. `totals.get(name, 0)` 부분이
      마지막 단계를 확정하므로 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-86-python-aggregate-model
    question: "'Python 집계·정렬·Top N' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다.
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. 이 설명이 맞는 이유는 `그룹별 합계와 결정적 정렬` 동작을 지키는 조건과 같기 때문입니다.
      `동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-86-python-aggregate-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐. 이 실수가 나오면 원본 추적 `C=30 → Python=45 → C=45 → 동률은 이름순 C`대로 "('C',
      45)"가 나오지 않으므로 먼저 확인해야 합니다.
  - id: quiz-day-86-python-aggregate-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 그룹별 합계와 결정적 정렬라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 `그룹별 합계와 결정적 정렬` 목적과 입력·출력은 유지합니다. 실행 결과 "('C', 45)"로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource: 'rows = [("C", 30), ("Python", 45), ("C", 15)]

  totals = {}

  for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes

  print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])'
---

## 오늘 배울 이유

필터 후 언어별 분을 합치고 동률일 때 정렬 기준까지 정해야 세 언어의 출력이 같습니다. Day 86 "`Python 집계·정렬·Top N`"에서는 Python 코드의 실행 결과(`('C', 45)`)를 따라가며, `그룹별 합계와 결정적 정렬` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 85](/learn/day-85-python-csv-parse)에서 배운 "Python CSV 파싱과 검증" 내용을 한 문장으로 말해 보세요. 이번 "`Python 집계·정렬·Top N`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `totals.get(name, 0)`입니다.

## 머릿속 그림

사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. Day 86에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `totals.get(name, 0)`입니다.

```text
C=30  →  Python=45  →  C=45  →  동률은 이름순 C
```

위 흐름에서 `totals.get(name, 0)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `('C', 45)`입니다.

## 천천히 풀어보기

언어별 누적 분은 사전에 저장합니다. C의 기존 합계가 20이고 다음 C 기록이 30이면 `totals.get("C", 0) + 30`으로 50이 됩니다. 새 언어 Rust는 기존 키가 없으므로 0에서 시작합니다.

Top N 정렬은 합계가 큰 순서, 합계가 같으면 이름이 앞서는 순서처럼 **동점 규칙**까지 정해야 구현끼리 같은 결과가 납니다. N=0, N이 항목 수보다 클 때도 정해진 결과가 있어야 합니다. 사전의 순회 순서에 우연히 의존하지 마세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 86 "`Python 집계·정렬·Top N`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `totals.get(name, 0)`이며, 실행 결과는 `('C', 45)`입니다.

```python
rows = [("C", 30), ("Python", 45), ("C", 15)]
totals = {}
for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes
print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])
```

예상 출력:

```text
('C', 45)
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`('C', 45)`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `totals.get(name, 0)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | rows = [("C", 30), ("Python", 45), ("C", 15)]
 2 | totals = {}
 3 | for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes
 4 | print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])
```

1. C 30을 기록합니다
2. Python 45와 C의 추가 15로 둘 다 45입니다
3. 동률에서 C가 앞서 첫 항목입니다

`totals.get(name, 0)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작  |
| ---: | --------------- |
|    1 | C=30            |
|    2 | Python=45       |
|    3 | C=45            |
|    4 | 동률은 이름순 C |

위 순서대로 실행한 최종 출력은 `('C', 45)`입니다. `C=30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

언어별 기록이 `C:20`, `Rust:20`, `Python:30`이라면 합계 내림차순 뒤 동점 이름 오름차순에서 Python이 앞이고 C와 Rust는 이름순이 됩니다. 두 구현의 결과를 비교할 때 동점 규칙이 없다면 같은 합계라도 순서가 달라질 수 있습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `('C', 45)`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
rows = [("C", 31), ("Python", 45), ("C", 15)]
totals = {}
for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes
print(sorted(totals.items(), key=lambda row: (-row[1], row[0]))[0])
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
('C', 46)
```

원본 출력은 `('C', 45)`이고, 바뀐 코드의 실행 결과는 `('C', 46)`입니다. 바뀐 줄은 `rows = [("C", 30), ("Python", 45), ("C", 15)]`에서 `rows = [("C", 31), ("Python", 45), ("C", 15)]`로 바뀌었습니다. 바뀐 프로그램은 `C=30` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 `('C', 46)`가 됩니다. 원본 추적 `C=30  →  Python=45  →  C=45  →  동률은 이름순 C`에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다.

## 자주 틀리는 지점

**확인할 실수: 동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐.** 정상 코드의 실행 결과는 `('C', 45)`입니다.

- 정상 줄: `for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes`
- 잘못된 줄: `for name, minutes in rows: totals[name] = totals.get(name, 1) + minutes`

두 줄을 나란히 놓으면 정상 줄 `for name, minutes in rows: totals[name] = totals.get(name, 0) + minutes`이 `사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다.` 설명과 맞고, 잘못된 줄은 `동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 쪽으로 어긋납니다. 결과가 예상과 다르면 `C=30`부터 `('C', 45)`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `그룹별 합계와 결정적 정렬`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | 집계 배열과 비교 함수에 tie-breaker  |
| Python | dict 집계 후 sorted 키               |
| Rust   | BTreeMap 또는 정렬 Vec와 tie-breaker |

C17에서는 `집계 배열과 비교 함수에 tie-breaker` 규칙을 적용합니다. "`Python 집계·정렬·Top N`" 수업의 실행 결과(`('C', 45)`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `dict 집계 후 sorted 키` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `BTreeMap 또는 정렬 Vec와 tie-breaker` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`('C', 45)` 맞히기) → 빈칸(`totals.get(name, 0)` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐` 찾기) → 독립 구현(`'Python 집계·정렬·Top N' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `('C', 45)` 및 `totals.get(name, 0)` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 집계·정렬·Top N`" 수업이 필요한 이유는 `그룹별 합계와 결정적 정렬` 동작으로 설명해 보세요.
- 예제에서 `totals.get(name, 0)` 부분 실행 직전의 상태와 직후의 출력(`('C', 45)`)을 말해 보세요.
- "`동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `그룹별 합계와 결정적 정렬` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

사전은 언어별 누적값을 저장하고 정렬 키는 합계 내림차순, 언어 이름 오름차순입니다. Day 86 "`Python 집계·정렬·Top N`" 예제의 핵심 부분은 `totals.get(name, 0)`이며, 실행 결과는 `('C', 45)`입니다. "`동률 순서를 명시하지 않아 구현 언어마다 Top N이 달라짐`" 여부를 확인하고 Day 86 수업을 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 Python 집계·정렬·Top N의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
