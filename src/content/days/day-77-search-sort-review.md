---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-77-search-sort-review
courseId: crp-92
phaseId: phase-07
dayNumber: 77
date: "2026-12-16"
title: 탐색·정렬 회상
summary: 탐색 알고리즘의 전제인 정렬 상태와 정렬 결과를 직접 점검합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 50
prerequisites:
  - day-76-divide-conquer
learningObjectives:
  - "'탐색·정렬 회상' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 원본도 sorted 호출만으로 바뀐다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - search sort review
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
  - id: ex-day-77-search-sort-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 원본에서 시작해 계산하세요.
    starter: "values = sorted([8, 2, 6, 4])

      print(values.index(6))"
    answer: "2"
    hint: sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.
    explanation: 원본  →  [2,4,6,8]  →  6은 2번. 따라서 출력은 '2'입니다.
    commonMistakes:
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-77-search-sort-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'탐색·정렬 회상' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: sorted("
    starter: "values = _____[8, 2, 6, 4])

      print(values.index(6))"
    answer: "values = sorted([8, 2, 6, 4])

      print(values.index(6))"
    hint: 입력 [8,2,6,4]가 정렬되어 [2,4,6,8]이 됩니다
    explanation: 빈칸에 들어갈 표현은 'sorted('입니다. 입력 [8,2,6,4]가 정렬되어 [2,4,6,8]이 됩니다 6을 찾으면 인덱스 2입니다
    commonMistakes:
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-77-search-sort-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 8에서 9로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "values = sorted([8, 2, 6, 4])

      print(values.index(6))"
    answer: "values = sorted([9, 2, 6, 4])

      print(values.index(6))"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 8에서 9로."
    explanation:
      바꾼 뒤 출력은 '2'입니다. 원본 출력과 같습니다('2'). 6의 위치는 그대로 2라 결과가 같습니다. 출력이 같아도 바뀐 줄(values = sorted([9, 2, 6,
      4])) 이후의 중간 상태가 같은지는 원본 추적과 대조해야 합니다.
    commonMistakes:
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-77-search-sort-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 원본도 sorted 호출만으로 바뀐다고 생각함 상황을 확인하세요.
    starter: "values = list([8, 2, 6, 4])

      print(values.index(6))"
    answer: "values = sorted([8, 2, 6, 4])

      print(values.index(6))"
    hint: sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 입력 [8,2,6,4]가 정렬되어 [2,4,6,8]이 됩니다 6을 찾으면 인덱스 2입니다
    commonMistakes:
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-77-search-sort-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '탐색·정렬 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 탐색·정렬 회상: 직접 구현"
    answer: "values = sorted([8, 2, 6, 4])

      print(values.index(6))"
    hint: sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 입력 [8,2,6,4]가 정렬되어 [2,4,6,8]이 됩니다 6을 찾으면 인덱스 2입니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-77-search-sort-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "2"
    answerIndex: 2
    explanation: 원본  →  [2,4,6,8]  →  6은 2번 순서로 실행되어 출력은 '2'입니다.
  - id: quiz-day-77-search-sort-review-model
    question: "'탐색·정렬 회상' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.
      - 원본도 sorted 호출만으로 바뀐다고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.
  - id: quiz-day-77-search-sort-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 원본도 sorted 호출만으로 바뀐다고 생각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 원본도 sorted 호출만으로 바뀐다고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-77-search-sort-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 정렬 전후 탐색 위치 구분라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 정렬 전후 탐색 위치 구분라는 목적과 입력·출력은 유지합니다.
playgroundSource: "values = sorted([8, 2, 6, 4])

  print(values.index(6))"
---

## 오늘 배울 이유

탐색 알고리즘의 전제인 정렬 상태와 정렬 결과를 직접 점검합니다. Day 77 "`탐색·정렬 회상`"에서는 Python 코드의 실행 결과(`2`)를 따라가며, `정렬 전후 탐색 위치 구분` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`원본도 sorted 호출만으로 바뀐다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 76](/learn/day-76-divide-conquer)에서 배운 "분할 정복의 재귀 결합" 내용을 한 문장으로 말해 보세요. 이번 "`탐색·정렬 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `sorted(`입니다.

## 머릿속 그림

sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다. Day 77에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `sorted(`입니다.

```text
원본  →  [2,4,6,8]  →  6은 2번
```

위 흐름에서 `sorted(` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `2`입니다.

## 천천히 풀어보기

찾으려는 값이 있는지 한 번만 확인한다면 원본을 순회하는 편이 간단할 수 있습니다. 여러 번 탐색한다면 먼저 정렬하고 이진 탐색을 쓰는 선택도 가능합니다. `sorted(values)`는 새 리스트를 만들고 `values.sort()`는 원래 리스트를 바꿉니다.

`sorted_values.index(target)`은 같은 값이 여러 개 있으면 첫 위치를 돌려주지만, 없으면 예외가 납니다. 값이 원래 배열의 몇 번째에 있었는지가 중요하면 정렬 뒤의 인덱스를 원본 인덱스와 혼동하면 안 됩니다. 데이터 크기와 탐색 횟수를 함께 생각하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 77 "`탐색·정렬 회상`"의 독립 예제입니다. 전체 2줄 가운데 핵심 부분은 `sorted(`이며, 실행 결과는 `2`입니다.

```python
values = sorted([8, 2, 6, 4])
print(values.index(6))
```

예상 출력:

```text
2
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`2`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `sorted(`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | values = sorted([8, 2, 6, 4])
 2 | print(values.index(6))
```

1. 입력 [8,2,6,4]가 정렬되어 [2,4,6,8]이 됩니다
2. 6을 찾으면 인덱스 2입니다

`sorted(` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 원본           |
|    2 | [2,4,6,8]      |
|    3 | 6은 2번        |

위 순서대로 실행한 최종 출력은 `2`입니다. `원본` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

원본 `[9,2,9]`를 `sorted(...)` 하면 `[2,9,9]`이고 `index(9)`는 정렬된 목록에서 첫 번째 9의 인덱스 1입니다. 원본의 첫 9는 인덱스 0이었습니다. **값을 찾는 문제인지 원본 위치를 찾는 문제인지** 먼저 구별해야 정렬로 위치 정보를 잃지 않습니다.

## 시간과 공간 복잡도

정렬 후 위치 찾기는 정렬 O(n log n)에 index 탐색 O(n)입니다. 원본 첫 9의 위치 0과 정렬 뒤 첫 9의 위치 1은 다릅니다. 값이 궁금한지 원본 위치가 궁금한지 먼저 구별해야 정렬로 위치 정보를 잃지 않습니다. Day 77의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `2`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
values = sorted([9, 2, 6, 4])
print(values.index(6))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
2
```

바꾼 뒤 출력도 `2`입니다. 6의 위치는 그대로 2라 결과가 같습니다. 출력이 같다고 해서 중간 상태까지 같은 것은 아닙니다. 다른 줄(`values = sorted([9, 2, 6, 4])`)부터 원본 추적과 비교해 보세요.

## 자주 틀리는 지점

**확인할 실수: 원본도 sorted 호출만으로 바뀐다고 생각함.** 정상 코드의 실행 결과는 `2`입니다.

- 정상 줄: `values = sorted([8, 2, 6, 4])`
- 잘못된 줄: `values = list([8, 2, 6, 4])`

두 줄을 나란히 놓고 `sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `원본`부터 `2`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `정렬 전후 탐색 위치 구분`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙      |
| ------ | ------------------------------- |
| C17    | qsort 후 bsearch 또는 직접 순회 |
| Python | sorted가 새 리스트 생성         |
| Rust   | sort는 슬라이스를 제자리 변경   |

C17에서는 `qsort 후 bsearch 또는 직접 순회` 규칙을 적용합니다. "`탐색·정렬 회상`" 수업의 실행 결과(`2`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `sorted가 새 리스트 생성` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `sort는 슬라이스를 제자리 변경` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`2` 맞히기) → 빈칸(`sorted(` 채우기) → 변경(`처음 등장하는 숫자를 8에서 9로`) → 오류 수정(`원본도 sorted 호출만으로 바뀐다고 생각함` 찾기) → 독립 구현(`'탐색·정렬 회상' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `2` 및 `sorted(` 설명과 대조하세요.

## 스스로 설명하기

- "`탐색·정렬 회상`" 수업이 필요한 이유는 `정렬 전후 탐색 위치 구분` 동작으로 설명해 보세요.
- 예제에서 `sorted(` 부분 실행 직전의 상태와 직후의 출력(`2`)을 말해 보세요.
- "`원본도 sorted 호출만으로 바뀐다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `정렬 전후 탐색 위치 구분` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

sorted는 새 정렬 리스트를 만들고 index는 그 리스트에서 목표의 위치를 찾습니다. Day 77 "`탐색·정렬 회상`" 예제의 핵심 부분은 `sorted(`이며, 실행 결과는 `2`입니다. "`원본도 sorted 호출만으로 바뀐다고 생각함`" 여부를 확인하고 Day 77 수업을 완료하세요.
