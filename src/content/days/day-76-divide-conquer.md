---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-76-divide-conquer
courseId: crp-92
phaseId: phase-07
dayNumber: 76
date: "2026-12-15"
title: 분할 정복의 재귀 결합
summary: 하나의 큰 문제를 두 하위 문제로 나누고 각각의 답을 결합하는 사고가 여러 알고리즘의 공통 뼈대입니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-75-partition
learningObjectives:
  - "'분할 정복의 재귀 결합' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 빈 입력 처리 정책 없이 길이 0의 배열도 호출함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - divide conquer
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
  - id: ex-day-76-divide-conquer-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? [3,9,2,7]에서 시작해 계산하세요.
    starter:
      "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    answer: "9"
    hint: 원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.
    explanation: "[3,9,2,7]  →  max(3,9)=9 + max(2,7)=7  →  9. 따라서 출력은 '9'입니다."
    commonMistakes:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-76-divide-conquer-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'분할 정복의 재귀 결합' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: len(values) == 1"
    starter:
      "def maximum(values):\n    if _____: return values[0]\n    mid = len(values) // 2\n    return max(maximum(values[:mid]),\
      \ maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    answer:
      "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    hint: "[3,9]의 최대는 9입니다"
    explanation: 빈칸에 들어갈 표현은 'len(values) == 1'입니다. [3,9]의 최대는 9입니다 [2,7]의 최대는 7입니다 둘을 비교해 9를 반환합니다
    commonMistakes:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-76-divide-conquer-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 1에서 2로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    answer:
      "def maximum(values):\n    if len(values) == 2: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 1에서 2로."
    explanation:
      "바꾼 뒤 출력은 '3'입니다. 원본 출력 '9'에서 달라졌습니다. 다른 줄(if len(values) == 1: return values[0] → if len(values)
      == 2: return values[0])에서 시작한 차이가 최종 출력에 반영되었습니다."
    commonMistakes:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-76-divide-conquer-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 빈 입력 처리 정책 없이 길이 0의 배열도 호출함 상황을 확인하세요.
    starter:
      "def maximum(values):\n    if len(values) == 0: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    answer:
      "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    hint: 원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. [3,9]의 최대는 9입니다 [2,7]의 최대는 7입니다 둘을 비교해 9를 반환합니다
    commonMistakes:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-76-divide-conquer-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '분할 정복의 재귀 결합' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 분할 정복의 재귀 결합: 직접 구현"
    answer:
      "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n    return\
      \ max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
    hint: 원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 [3,9]의 최대는 9입니다 [2,7]의 최대는 7입니다 둘을 비교해 9를 반환합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-76-divide-conquer-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "9"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: "[3,9,2,7]  →  max(3,9)=9 + max(2,7)=7  →  9 순서로 실행되어 출력은 '9'입니다."
  - id: quiz-day-76-divide-conquer-model
    question: "'분할 정복의 재귀 결합' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.
    answerIndex: 2
    explanation: 원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.
  - id: quiz-day-76-divide-conquer-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 빈 입력 처리 정책 없이 길이 0의 배열도 호출함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 빈 입력 처리 정책 없이 길이 0의 배열도 호출함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-76-divide-conquer-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 부분 답을 결합해 전체 답 생성라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 부분 답을 결합해 전체 답 생성라는 목적과 입력·출력은 유지합니다.
playgroundSource:
  "def maximum(values):\n    if len(values) == 1: return values[0]\n    mid = len(values) // 2\n\
  \    return max(maximum(values[:mid]), maximum(values[mid:]))\nprint(maximum([3, 9, 2, 7]))"
---

## 오늘 배울 이유

하나의 큰 문제를 두 하위 문제로 나누고 각각의 답을 결합하는 사고가 여러 알고리즘의 공통 뼈대입니다. Day 76 "`분할 정복의 재귀 결합`"에서는 Python 코드의 실행 결과(`9`)를 따라가며, `부분 답을 결합해 전체 답 생성` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`빈 입력 처리 정책 없이 길이 0의 배열도 호출함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 75](/learn/day-75-partition)에서 배운 "퀵 정렬의 분할 기준" 내용을 한 문장으로 말해 보세요. 이번 "`분할 정복의 재귀 결합`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `len(values) == 1`입니다.

## 머릿속 그림

원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다. Day 76에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `len(values) == 1`입니다.

```text
[3,9,2,7]  →  max(3,9)=9 + max(2,7)=7  →  9
```

위 흐름에서 `len(values) == 1` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `9`입니다.

## 천천히 풀어보기

분할 정복의 순서는 **나눈다 → 작은 문제를 해결한다 → 답을 합친다**입니다. 최댓값 문제에서 `[4,9,2,7]`을 `[4,9]`, `[2,7]`로 나누고 각 답 9,7을 구한 다음 큰 값 9를 택합니다.

원소 하나면 그 값이 답이므로 재귀가 멈춥니다. 빈 입력에는 최댓값이 없으니 함수가 어떤 오류나 별도 결과를 돌릴지 정해야 합니다. 한 번 전체를 훑는 방식과 비교하면 이 분할 방식이 무조건 빠른 것은 아닙니다. 여기서는 재귀 문제를 나누고 합치는 방법을 배우는 것이 목적입니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 76 "`분할 정복의 재귀 결합`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `len(values) == 1`이며, 실행 결과는 `9`입니다.

```python
def maximum(values):
    if len(values) == 1: return values[0]
    mid = len(values) // 2
    return max(maximum(values[:mid]), maximum(values[mid:]))
print(maximum([3, 9, 2, 7]))
```

예상 출력:

```text
9
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`9`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `len(values) == 1`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | def maximum(values):
 2 |     if len(values) == 1: return values[0]
 3 |     mid = len(values) // 2
 4 |     return max(maximum(values[:mid]), maximum(values[mid:]))
 5 | print(maximum([3, 9, 2, 7]))
```

1. [3,9]의 최대는 9입니다
2. [2,7]의 최대는 7입니다
3. 둘을 비교해 9를 반환합니다

`len(values) == 1` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작          |
| ---: | ----------------------- |
|    1 | [3,9,2,7]               |
|    2 | max(3,9)=9 + max(2,7)=7 |
|    3 | 9                       |

위 순서대로 실행한 최종 출력은 `9`입니다. `[3,9,2,7]` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`[9,4,7,2]`를 `[9,4]`와 `[7,2]`로 나누면 각각의 최댓값은 9와 7, 전체의 최댓값은 9입니다. 원소 하나인 부분에서 더 나누지 않기 때문에 재귀가 끝납니다. 빈 목록의 최댓값은 정해지지 않으니 호출 전에 막거나 별도 실패 값을 정의하세요.

## 시간과 공간 복잡도

배열을 둘로 나누어 각각의 최댓값을 구한 뒤 합치면 각 원소를 한 번씩 봐 O(n)입니다. 원소 하나에서 멈추므로 재귀가 끝납니다. 빈 목록의 최댓값은 정해지지 않아 호출 전에 막아야 합니다. Day 76의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `9`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
def maximum(values):
    if len(values) == 2: return values[0]
    mid = len(values) // 2
    return max(maximum(values[:mid]), maximum(values[mid:]))
print(maximum([3, 9, 2, 7]))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
3
```

원본과 달라졌습니다. 원본 출력은 `9`입니다. 다른 줄(`if len(values) == 1: return values[0]` → `if len(values) == 2: return values[0]`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`[3,9,2,7]` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 빈 입력 처리 정책 없이 길이 0의 배열도 호출함.** 정상 코드의 실행 결과는 `9`입니다.

- 정상 줄: `if len(values) == 1: return values[0]`
- 잘못된 줄: `if len(values) == 0: return values[0]`

두 줄을 나란히 놓고 `원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `[3,9,2,7]`부터 `9`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `부분 답을 결합해 전체 답 생성`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | 시작·끝 인덱스를 재귀에 전달   |
| Python | 슬라이스 복사는 추가 비용      |
| Rust   | &slice[..mid]로 복사 없이 분할 |

C17에서는 `시작·끝 인덱스를 재귀에 전달` 규칙을 적용합니다. "`분할 정복의 재귀 결합`" 수업의 실행 결과(`9`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `슬라이스 복사는 추가 비용` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `&slice[..mid]로 복사 없이 분할` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`9` 맞히기) → 빈칸(`len(values) == 1` 채우기) → 변경(`처음 등장하는 숫자를 1에서 2로`) → 오류 수정(`빈 입력 처리 정책 없이 길이 0의 배열도 호출함` 찾기) → 독립 구현(`'분할 정복의 재귀 결합' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `9` 및 `len(values) == 1` 설명과 대조하세요.

## 스스로 설명하기

- "`분할 정복의 재귀 결합`" 수업이 필요한 이유는 `부분 답을 결합해 전체 답 생성` 동작으로 설명해 보세요.
- 예제에서 `len(values) == 1` 부분 실행 직전의 상태와 직후의 출력(`9`)을 말해 보세요.
- "`빈 입력 처리 정책 없이 길이 0의 배열도 호출함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `부분 답을 결합해 전체 답 생성` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

원소 하나인 부분은 답이 바로 그 값이고 두 절반의 최대 중 큰 것이 전체 최대입니다. Day 76 "`분할 정복의 재귀 결합`" 예제의 핵심 부분은 `len(values) == 1`이며, 실행 결과는 `9`입니다. "`빈 입력 처리 정책 없이 길이 0의 배열도 호출함`" 여부를 확인하고 Day 76 수업을 완료하세요.
