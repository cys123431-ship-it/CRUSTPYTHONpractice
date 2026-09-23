---
schemaVersion: 1
contentVersion: 2026.10-c
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
    objective: 공통 fixture와 오류 사례 설계의 핵심 표현을 스스로 적는다.
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: language == "C"'
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if _____))'
    answer: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: 첫 C에서 30을 얻습니다
    explanation: 빈칸에는 'language == "C"'이 들어갑니다. 첫 C에서 30을 얻습니다 Rust는 건너뜁니다 두 번째 C의 10을 더해 40입니다
    commonMistakes:
      - 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-84-fixture-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력도 먼저 예측하세요.
    starter: 'rows = [("C", 30), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    answer: 'rows = [("C", 31), ("Rust", 20), ("C", 10)]

      print(sum(minutes for language, minutes in rows if language == "C"))'
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation: 예시 답안에서는 처음 등장하는 숫자를 30에서 31로 바꿨습니다. 원본 출력은 '40'입니다. 바뀐 코드의 결과는 실행해 확인하세요.
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
    explanation: C 30  →  Rust 제외  →  C 10  →  40 순서로 실행되어 '40'을 출력합니다.
  - id: quiz-day-84-fixture-review-model
    question: 공통 fixture와 오류 사례 설계을 이해하는 데 맞는 설명은?
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

세 구현이 같은 결과를 내는지 확인하려면 입력 fixture와 기대 출력을 먼저 고정합니다. 이번 Day는 새 문법을 많이 추가하는 대신 앞선 개념을 떠올리고 작은 변경 실험으로 오개념을 확인합니다. 코드를 가린 채 먼저 답하고, 모른 부분만 선행 Day로 돌아가 보세요.

## 시작 전에 확인할 것

바로 앞선 [Day 83](/learn/day-83-capstone-contract)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다. 다음 흐름을 눈으로 확인하세요.

```text
C 30  →  Rust 제외  →  C 10  →  40
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

fixture는 세 언어가 **똑같은 입력**을 받아 같은 결과를 내는지 비교하기 위한 작은 고정 데이터입니다. C 기록이 두 건이고 분이 10과 30이면 합계는 40입니다. Rust 기록은 C만 고르는 필터에서 제외돼야 합니다.

정상 입력 하나만으로는 검증이 약합니다. 빠진 열, 숫자가 아닌 분, 빈 파일, 중복된 주제도 각각 입력으로 만들어 어떤 결과나 오류가 나와야 하는지 미리 정하세요. 프로그램을 작성한 후에 정답을 맞추는 대신, 먼저 기대 출력을 적으면 오류를 찾기 쉽습니다.

## 문법을 예제로 보기

아래는 Python 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```python
rows = [("C", 30), ("Rust", 20), ("C", 10)]
print(sum(minutes for language, minutes in rows if language == "C"))
```

예상 출력:

```text
40
```

아래 Python 실행 영역에 같은 코드가 미리 들어 있습니다. 먼저 예측하고 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `language == "C"`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. 첫 C에서 30을 얻습니다
2. Rust는 건너뜁니다
3. 두 번째 C의 10을 더해 40입니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | C 30           |
|    2 | Rust 제외      |
|    3 | C 10           |
|    4 | 40             |

마지막 상태에서 화면에 표시되는 결과는 `40`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함.** C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **공통 fixture의 필터 기대값 계산**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙         |
| ------ | ---------------------------------- |
| C17    | 같은 csv 파일로 C 결과 비교        |
| Python | 필터와 sum 기대값 고정             |
| Rust   | 같은 fixture를 cargo test에서 읽기 |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 세 구현이 같은 결과를 내는지 확인하려면 입력 fixture와 기대 출력을 먼저 고정합니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 필터를 적용한 결과와 전체 합계를 같은 값으로 비교함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

C 행 두 개의 분을 더하면 40이고 Rust 행은 필터에서 제외됩니다. 예시의 출력은 `40`입니다. 오류를 찾을 때는 **필터를 적용한 결과와 전체 합계를 같은 값으로 비교함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 공통 fixture와 오류 사례 설계의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
