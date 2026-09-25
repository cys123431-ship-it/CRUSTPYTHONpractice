---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-16-for-loop
courseId: crp-92
phaseId: phase-02
dayNumber: 16
date: "2026-10-16"
title: 범위 반복과 누적
summary: 여러 학습 기록을 한 개씩 더하려면 동일한 코드를 반복문으로 표현합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-15-match
learningObjectives:
  - "'범위 반복과 누적' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - for loop
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
  - id: ex-day-16-for-loop-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? total=0에서 시작해 계산하세요.
    starter: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    answer: "60"
    hint: total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    explanation: total=0  →  10  →  30  →  60. 따라서 출력은 '60'입니다.
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-16-for-loop-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 범위 반복과 누적의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: total += minutes"
    starter: "total = 0\nfor minutes in [10, 20, 30]:\n    _____\nprint(total)"
    answer: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    hint: total=0에서 시작합니다
    explanation: 빈칸에는 'total += minutes'이 들어갑니다. total=0에서 시작합니다 10·20·30을 차례로 더합니다 루프가 끝나면 60을 출력합니다
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-16-for-loop-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    answer: "total = 1\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '60'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-16-for-loop-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김 상황을 확인하세요.
    starter: "total = 0\nfor minutes in [10, 20, 30]:\n    total = minutes\nprint(total)"
    answer: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    hint: total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. total=0에서 시작합니다 10·20·30을 차례로 더합니다 루프가 끝나면 60을 출력합니다
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-16-for-loop-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '범위 반복과 누적' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 범위 반복과 누적: 직접 구현"
    answer: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    hint: total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 total=0에서 시작합니다 10·20·30을 차례로 더합니다 루프가 끝나면 60을 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-16-for-loop-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "60"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: total=0  →  10  →  30  →  60 순서로 실행되어 '60'을 출력합니다.
  - id: quiz-day-16-for-loop-model
    question: 범위 반복과 누적을 이해하는 데 맞는 설명은?
    choices:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    answerIndex: 2
    explanation: total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
  - id: quiz-day-16-for-loop-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-16-for-loop-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 반복 누적 합계라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 반복 누적 합계라는 목적과 입력·출력은 유지합니다.
playgroundSource: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
---

## 오늘 배울 이유

여러 학습 기록을 한 개씩 더하려면 동일한 코드를 반복문으로 표현합니다. Day 16 "`범위 반복과 누적`"에서는 Python 코드가 `60`을(를) 만드는 과정을 따라가며, 반복 누적 합계 동작이 왜 필요한지 확인합니다. 반복 누적 합계을(를) 빠뜨리면 `반복마다 total을 새 값으로 덮어써 마지막 항목만 남김` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 15](/learn/day-15-match)에서는 "Rust match로 경우 나누기"을(를) 배웠습니다. "Rust match로 경우 나누기"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`범위 반복과 누적`"에서 새로 달라지는 조건을 찾아보세요. Day 16의 답은 `60`이며, 핵심 표현은 `total += minutes`입니다.

## 머릿속 그림

total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다. Day 16에서는 아래 흐름 순서대로 상태가 바뀌며, `total += minutes`이(가) 결과를 가릅니다.

```text
total=0  →  10  →  30  →  60
```

위 흐름에서 `total += minutes`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

누적 합계는 빈 통에 값을 하나씩 붓는 과정입니다. `total = 0`에서 시작하고 반복에서 `total += minutes`를 실행할 때마다 '지금까지 본 항목의 합'이 됩니다. 예를 들어 `[10, 20, 30]`이면 시작 0, 첫 반복 10, 둘째 30, 셋째 60입니다.

반복문 바깥에서만 `print(total)`을 하면 최종 합계가 한 번 출력됩니다. 안쪽에서 찍으면 중간 합계 10, 30, 60이 차례로 나옵니다. 빈 리스트면 반복문 본문이 실행되지 않고 합계는 0입니다. `total`을 매번 0으로 다시 만들면 누적이 깨진다는 점도 확인하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 16 "`범위 반복과 누적`"의 독립 예제입니다. 전체 4줄에서 `total += minutes`이(가) 핵심이며, 실행 결과는 `60`입니다.

```python
total = 0
for minutes in [10, 20, 30]:
    total += minutes
print(total)
```

예상 출력:

```text
60
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `60`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `total += minutes`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | total = 0
 2 | for minutes in [10, 20, 30]:
 3 |     total += minutes
 4 | print(total)
```

1. total=0에서 시작합니다
2. 10·20·30을 차례로 더합니다
3. 루프가 끝나면 60을 출력합니다

위 단계에서 `total += minutes`이(가) 빠지면 `60`이(가) 나오지 않습니다. `처음 등장하는 숫자를 0에서 1로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | total=0        |
|    2 | 10             |
|    3 | 30             |
|    4 | 60             |

위 순서대로 실행하면 최종 출력 `60`이(가) 됩니다. `total=0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`total = 0`에서 `[5, 10, 5]`를 차례로 더하면 표는 `0 → 5 → 15 → 20`입니다. 두 번째 항목에서 합계가 15가 되는 이유는 새 값 10만 남기지 않고 기존 5에 10을 더했기 때문입니다. 시작값을 1로 바꾸면 최종값은 21이니, 시작값이 결과에 어떻게 남는지도 확인하세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 0에서 1로` 바꾸면 아래와 같이 됩니다.

```python
total = 1
for minutes in [10, 20, 30]:
    total += minutes
print(total)
```

원본 출력은 `60`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `total += minutes`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 16의 `범위 반복과 누적`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김.** 정상 코드에서는 `60`이(가) 출력됩니다.

- 정상 줄: `total += minutes`
- 잘못된 줄: `total = minutes`

두 줄을 나란히 놓고 `total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `total=0`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **반복 누적 합계**은(는) 세 언어에서 같은 입력과 출력(`60`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙                  |
| ------ | ------------------------------------------- |
| C17    | for (i=0; i<3; i++) total += a[i]           |
| Python | for minutes in values                       |
| Rust   | for minutes in values { total += minutes; } |

C17에서는 `for (i=0; i<3; i++) total += a[i]` 규칙으로 "`범위 반복과 누적`"의 `60`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `for minutes in values` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `for minutes in values { total += minutes; }` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`total += minutes` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김` 찾기) → 독립 구현(`범위 반복과 누적을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `total += minutes` 설명과 대조하세요.

## 스스로 설명하기

- "`범위 반복과 누적`"이(가) 필요한 상황을 `반복 누적 합계` 동작으로 설명해 보세요.
- 예제에서 `total += minutes`이(가) 실행되기 직전의 상태와 직후의 출력 `60`을(를) 말해 보세요.
- "`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `반복 누적 합계` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다. Day 16 "`범위 반복과 누적`"의 예제는 `total += minutes`을(를) 실행해 `60`을(를) 출력합니다. "`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`" 여부를 확인하고 Day 16을(를) 완료하세요.
