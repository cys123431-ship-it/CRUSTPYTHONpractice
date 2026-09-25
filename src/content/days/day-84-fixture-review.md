---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-84-fixture-review
courseId: crp-92
phaseId: phase-08
dayNumber: 84
date: "2026-12-23"
title: 공통 fixture와 오류 사례 설계
summary: 세 구현이 같은 결과를 내는지 확인하려면 입력 fixture와 기대 출력을 먼저 고정합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 50
prerequisites:
  - day-83-capstone-contract
learningObjectives:
  - "'공통 fixture와 오류 사례 설계' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - fixture review
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
  - id: ex-day-84-fixture-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? C 30에서 시작해 계산하세요.
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    answer: "40"
    hint: C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.
    explanation: C 30  →  Rust 제외  →  C 10  →  40. 따라서 출력은 '40'입니다.
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-84-fixture-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'공통 fixture와 오류 사례 설계' 개념의 핵심 표현을 스스로 적는다."
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: language == "C"'
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if _____))'
    answer: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: 첫 C에서 30을 얻습니다
    explanation: 빈칸에 들어갈 표현은 'language == "C"'입니다. 첫 C에서 30을 얻습니다 Rust는 건너뜁니다 두 번째 C의 10을 더해 40입니다
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-84-fixture-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 30에서 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    answer: 'rows = [("C", 31), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 30에서 31로."
    explanation:
      바꾼 뒤 출력은 '41'입니다. 원본 출력 '40'에서 달라졌습니다. 다른 줄(rows = [("C", 30), ("Rust", 20), ("C", 10)] → rows =
      [("C", 31), ("Rust", 20), ("C", 10)])에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-84-fixture-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함 상황을 확인하세요.
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language != "C"))'
    answer: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 첫 C에서 30을 얻습니다 Rust는 건너뜁니다 두 번째 C의 10을 더해 40입니다
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-84-fixture-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '공통 fixture와 오류 사례 설계' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 공통 fixture와 오류 사례 설계: 직접 구현"
    answer: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 첫 C에서 30을 얻습니다 Rust는 건너뜁니다 두 번째 C의 10을 더해 40입니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-84-fixture-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "40"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: C 30  →  Rust 제외  →  C 10  →  40 순서로 실행되어 출력은 '40'입니다.
  - id: quiz-day-84-fixture-review-model
    question: "'공통 fixture와 오류 사례 설계' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함(이것이 정상적인 사용법이다)
      - C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.
  - id: quiz-day-84-fixture-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
    answerIndex: 2
    explanation: 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-84-fixture-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 공통 fixture의 필터 기대값 계산라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 공통 fixture의 필터 기대값 계산라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

  print(sum(minutes for language, minutes in rows if language == "C"))'
---

## 오늘 배울 이유

세 구현이 같은 결과를 내는지 확인하려면 입력 fixture와 기대 출력을 먼저 고정합니다. Day 84 "`공통 fixture와 오류 사례 설계`"에서는 Python 코드의 실행 결과(`40`)를 따라가며, `공통 fixture의 필터 기대값 계산` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`필터를 적용한 결과와 전체 합계를 같은 값으로 비교함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 83](/learn/day-83-capstone-contract)에서 배운 "프로젝트 계약: 공통 CSV 입력" 내용을 한 문장으로 말해 보세요. 이번 "`공통 fixture와 오류 사례 설계`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `language == "C"`입니다.

## 머릿속 그림

C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다. Day 84에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `language == "C"`입니다.

```text
C 30  →  Rust 제외  →  C 10  →  40
```

위 흐름에서 `language == "C"` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `40`입니다.

## 천천히 풀어보기

fixture는 세 언어가 **똑같은 입력**을 받아 같은 결과를 내는지 비교하기 위한 작은 고정 데이터입니다. C 기록이 두 건이고 분이 10과 30이면 합계는 40입니다. Rust 기록은 C만 고르는 필터에서 제외돼야 합니다.

정상 입력 하나만으로는 검증이 약합니다. 빠진 열, 숫자가 아닌 분, 빈 파일, 중복된 주제도 각각 입력으로 만들어 어떤 결과나 오류가 나와야 하는지 미리 정하세요. 프로그램을 작성한 후에 정답을 맞추는 대신, 먼저 기대 출력을 적으면 오류를 찾기 쉽습니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 84 "`공통 fixture와 오류 사례 설계`"의 독립 예제입니다. 전체 2줄 가운데 핵심 부분은 `language == "C"`이며, 실행 결과는 `40`입니다.

```python
rows = [("C", 30), ("Rust", 20), ("C", 10)]
print(sum(minutes for language, minutes in rows if language == "C"))
```

예상 출력:

```text
40
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`40`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `language == "C"`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | rows = [("C", 30), ("Rust", 20), ("C", 10)]
 2 | print(sum(minutes for language, minutes in rows if language == "C"))
```

1. 첫 C에서 30을 얻습니다
2. Rust는 건너뜁니다
3. 두 번째 C의 10을 더해 40입니다

`language == "C"` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | C 30           |
|    2 | Rust 제외      |
|    3 | C 10           |
|    4 | 40             |

위 순서대로 실행한 최종 출력은 `40`입니다. `C 30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

두 C 행이 10분과 30분, Rust 행이 20분이라면 C 필터 결과는 건수 2·합계 40분입니다. 세 언어 중 하나에서 60분이 나오면 필터가 Rust까지 포함했는지 살펴보세요. 같은 fixture로 같은 결과를 기대한다는 약속이 있어야 구현끼리 비교할 수 있습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `40`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
rows = [("C", 31), ("Rust", 20), ("C", 10)]
print(sum(minutes for language, minutes in rows if language == "C"))
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
41
```

원본과 달라졌습니다. 원본 출력은 `40`입니다. 다른 줄(`rows = [("C", 30), ("Rust", 20), ("C", 10)]` → `rows = [("C", 31), ("Rust", 20), ("C", 10)]`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`C 30` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함.** 정상 코드의 실행 결과는 `40`입니다.

- 정상 줄: `print(sum(minutes for language, minutes in rows if language == "C"))`
- 잘못된 줄: `print(sum(minutes for language, minutes in rows if language != "C"))`

두 줄을 나란히 놓고 `C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `C 30`부터 `40`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `공통 fixture의 필터 기대값 계산`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙         |
| ------ | ---------------------------------- |
| C17    | 같은 csv 파일로 C 결과 비교        |
| Python | 필터와 sum 기대값 고정             |
| Rust   | 같은 fixture를 cargo test에서 읽기 |

C17에서는 `같은 csv 파일로 C 결과 비교` 규칙을 적용합니다. "`공통 fixture와 오류 사례 설계`" 수업의 실행 결과(`40`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `필터와 sum 기대값 고정` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `같은 fixture를 cargo test에서 읽기` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`40` 맞히기) → 빈칸(`language == "C"` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`필터를 적용한 결과와 전체 합계를 같은 값으로 비교함` 찾기) → 독립 구현(`'공통 fixture와 오류 사례 설계' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `40` 및 `language == "C"` 설명과 대조하세요.

## 스스로 설명하기

- "`공통 fixture와 오류 사례 설계`" 수업이 필요한 이유는 `공통 fixture의 필터 기대값 계산` 동작으로 설명해 보세요.
- 예제에서 `language == "C"` 부분 실행 직전의 상태와 직후의 출력(`40`)을 말해 보세요.
- "`필터를 적용한 결과와 전체 합계를 같은 값으로 비교함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `공통 fixture의 필터 기대값 계산` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다. Day 84 "`공통 fixture와 오류 사례 설계`" 예제의 핵심 부분은 `language == "C"`이며, 실행 결과는 `40`입니다. "`필터를 적용한 결과와 전체 합계를 같은 값으로 비교함`" 여부를 확인하고 Day 84 수업을 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 공통 fixture와 오류 사례 설계의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
