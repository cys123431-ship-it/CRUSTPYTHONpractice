---
schemaVersion: 1
contentVersion: 2026.10-f
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
    hint: total=0에서 시작해 60까지 순서대로 적어 보세요. total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    explanation:
      1. total=0에서 시작합니다. 2. 10·20·30을 차례로 더합니다. 3. 루프가 끝나면 60을 출력합니다. `total=0 → 10 → 30 → 60` 흐름으로 실제
      출력 `60`이 됩니다. 핵심 `total += minutes`는 지금까지의 합에 새 값을 더해 저장하는 자리에 쓰입니다.
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
    hint: 필요한 표현은 반복 누적 합계 동작을 잇는 total += minutes입니다.
    explanation:
      빈칸에 들어갈 표현은 'total += minutes'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. total=0에서 시작합니다. 2. 10·20·30을 차례로 더합니다.
      3. 루프가 끝나면 60을 출력합니다. `total=0 → 10 → 30 → 60` 흐름으로 실제 출력 `60`이 됩니다. 핵심 `total += minutes`는 지금까지의 합에 새 값을 더해
      저장하는 자리에 쓰입니다.
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
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '60'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '61'입니다. 원본은 `60`, 수정본은 `61`이다. 첫 변경 줄 `total = 0`에서 `total = 1`로 시작 값을 바꾸면, 이후 세 번의 덧셈이
      그대로 이어져 최종 합이 1만큼 커진다.
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
    hint: 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김 상황에서 어긋나는 줄을 total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `total = minutes`입니다. 매 반복마다 지금까지의 합이 아니라 현재 항목으로 덮어쓰므로, 마지막 항목 30만 남고 `30`이 출력됩니다. 오류 분류는
      잘못된 출력입니다. 누적이 깨지는 첫 순간은 첫 반복의 대입입니다. 고친 줄 `total += minutes`에서는 `반복 누적 합계` 동작이 지켜집니다. 정상 코드는 0 시작→10→30→60의
      순서로 합을 쌓아 `60`을 출력합니다.
    commonMistakes:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-16-for-loop-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 범위 반복과 누적 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 범위 반복과 누적: 직접 구현"
    answer: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
    hint: 빈 리스트면 본문이 실행되지 않고 합계는 0입니다. print를 안쪽에 두면 10, 30, 60이 차례로 나옵니다. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 빈 리스트면 본문이 실행되지 않고 합계는 0입니다. print를 안쪽에 두면 10, 30, 60이 차례로 나옵니다. 같은 반복
      누적 합계 동작을 구현하고 실행 결과 '60'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
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
    explanation:
      먼저 total이 0에서 시작됩니다. 이어서 10·20·30을 차례로 더해 10, 30, 60으로 쌓이고, 루프가 끝난 뒤 print가 최종 합을 출력하므로 `60`이 됩니다.
      `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 반복문 실행이 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기 때문입니다. 다른 선택지는 이
      추적과 맞지 않습니다.
  - id: quiz-day-16-for-loop-model
    question: "'범위 반복과 누적' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.
    answerIndex: 2
    explanation:
      total은 지금까지 읽은 항목의 합이라는 뜻은, 매 반복 후에도 그 불변식이 유지된다는 뜻입니다. `반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`은 반대 사례인데,
      덮어쓰면 이전 합이 사라져 불변식이 깨지기 때문입니다.
  - id: quiz-day-16-for-loop-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`입니다. 잘못된 코드는 실행은 되지만 `30`이라는 잘못된 출력을 냅니다. 중간 합계 10,
      30, 60을 손으로 적어 보세요.
  - id: quiz-day-16-for-loop-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 반복 누적 합계라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `반복 누적 합계`라는 의미와 입력·출력 계약입니다. C의 for 누적과 Rust의 iterator 합으로 같은 동작을 구현하고, 실행
      결과 `60`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource: "total = 0\nfor minutes in [10, 20, 30]:\n    total += minutes\nprint(total)"
---

## 오늘 배울 이유

여러 학습 기록을 한 개씩 더하려면 동일한 코드를 반복문으로 표현합니다. Day 16 "`범위 반복과 누적`"에서는 Python 코드의 실행 결과(`60`)를 따라가며, `반복 누적 합계` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 15](/learn/day-15-match)에서 배운 "Rust match로 경우 나누기" 내용을 한 문장으로 말해 보세요. 이번 "`범위 반복과 누적`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `total += minutes`입니다.

## 머릿속 그림

total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다. Day 16에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `total += minutes`입니다.

```text
total=0  →  10  →  30  →  60
```

위 흐름에서 `total += minutes` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

누적 합계는 빈 통에 값을 하나씩 붓는 과정입니다. `total = 0`에서 시작하고 반복에서 `total += minutes`를 실행할 때마다 '지금까지 본 항목의 합'이 됩니다. 예를 들어 `[10, 20, 30]`이면 시작 0, 첫 반복 10, 둘째 30, 셋째 60입니다.

반복문 바깥에서만 `print(total)`을 하면 최종 합계가 한 번 출력됩니다. 안쪽에서 찍으면 중간 합계 10, 30, 60이 차례로 나옵니다. 빈 리스트면 반복문 본문이 실행되지 않고 합계는 0입니다. `total`을 매번 0으로 다시 만들면 누적이 깨진다는 점도 확인하세요.

누적 합계는 빈 통에 값을 하나씩 붓는 과정입니다. `total = 0`에서 시작하고 반복에서 `total += minutes`를 실행할 때마다 지금까지 본 항목의 합이 됩니다. 예를 들어 `[10, 20, 30]`이면 시작 0, 첫 반복 10, 둘째 30, 셋째 60입니다.

반복문 바깥에서만 `print(total)`을 하면 최종 합계가 한 번 출력됩니다. 안쪽에서 찍으면 중간 합계 10, 30, 60이 차례로 나옵니다. 빈 리스트면 반복문 본문이 실행되지 않고 합계는 0입니다. `total`을 매번 0으로 다시 만들면 누적이 깨진다는 점도 확인하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 16 "`범위 반복과 누적`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `total += minutes`이며, 실행 결과는 `60`입니다.

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

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`60`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `total += minutes`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```python
 1 | total = 0
 2 | for minutes in [10, 20, 30]:
 3 |     total += minutes
 4 | print(total)
```

1. total=0에서 시작합니다
2. 10·20·30을 차례로 더합니다
3. 루프가 끝나면 60을 출력합니다

`total += minutes` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | total=0        |
|    2 | 10             |
|    3 | 30             |
|    4 | 60             |

위 순서대로 실행한 최종 출력은 `60`입니다. `total=0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`total = 0`에서 `[5, 10, 5]`를 차례로 더하면 표는 `0 → 5 → 15 → 20`입니다. 두 번째 항목에서 합계가 15가 되는 이유는 새 값 10만 남기지 않고 기존 5에 10을 더했기 때문입니다. 시작값을 1로 바꾸면 최종값은 21이니, 시작값이 결과에 어떻게 남는지도 확인하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `60`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
total = 1
for minutes in [10, 20, 30]:
    total += minutes
print(total)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
61
```

원본은 `60`, 수정본은 `61`이다. 첫 변경 줄 `total = 0`에서 `total = 1`로 시작 값을 바꾸면, 이후 세 번의 덧셈이 그대로 이어져 최종 합이 1만큼 커진다.

## 자주 틀리는 지점

**확인할 실수: 반복마다 total을 새 값으로 덮어써 마지막 항목만 남김.** 정상 코드의 실행 결과는 `60`입니다.

- 정상 줄: `total += minutes`
- 잘못된 줄: `total = minutes`

두 줄을 나란히 놓으면 정상 줄 `total += minutes`이 `total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다.` 설명과 맞고, 잘못된 줄은 `반복마다 total을 새 값으로 덮어써 마지막 항목만 남김` 쪽으로 어긋납니다. 결과가 예상과 다르면 `total=0`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `반복 누적 합계`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙                  |
| ------ | ------------------------------------------- |
| C17    | for (i=0; i<3; i++) total += a[i]           |
| Python | for minutes in values                       |
| Rust   | for minutes in values { total += minutes; } |

C17에서는 `for (i=0; i<3; i++) total += a[i]` 규칙을 적용합니다. "`범위 반복과 누적`" 수업의 실행 결과(`60`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `for minutes in values` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `for minutes in values { total += minutes; }` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`total += minutes` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김` 찾기) → 독립 구현(`'범위 반복과 누적' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `total += minutes` 설명과 대조하세요.

## 스스로 설명하기

- "`범위 반복과 누적`" 수업이 필요한 이유는 `반복 누적 합계` 동작으로 설명해 보세요.
- 예제에서 `total += minutes` 부분 실행 직전의 상태와 직후의 출력(`60`)을 말해 보세요.
- "`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `반복 누적 합계` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

total은 지금까지 읽은 항목의 합이고, 매 반복 후에도 그 불변식이 유지됩니다. Day 16 "`범위 반복과 누적`" 예제의 핵심 부분은 `total += minutes`이며, 실행 결과는 `60`입니다. "`반복마다 total을 새 값으로 덮어써 마지막 항목만 남김`" 여부를 확인하고 Day 16 수업을 완료하세요.
