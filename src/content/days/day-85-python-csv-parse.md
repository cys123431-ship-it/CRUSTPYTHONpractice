---
schemaVersion: 1
contentVersion: 2026.10-c
id: day-85-python-csv-parse
courseId: crp-92
phaseId: phase-08
dayNumber: 85
date: "2026-12-24"
title: Python CSV 파싱과 검증
summary: CSV의 모든 필드는 글자이므로 숫자·날짜·언어·결과를 명시적으로 검증해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-84-fixture-review
learningObjectives:
  - "'Python CSV 파싱과 검증' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - python csv parse
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
  - id: ex-day-85-python-csv-parse-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? CSV 문자열에서 시작해 계산하세요.
    starter: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    answer: "30"
    hint: DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다.
    explanation: CSV 문자열  →  row['minutes']='30'  →  int=30. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-85-python-csv-parse-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python CSV 파싱과 검증의 핵심 표현을 스스로 적는다.
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: int(row["minutes"])'
    starter: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = _____

      print(minutes)'
    answer: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    hint: 헤더로 열 이름을 인식합니다
    explanation: 빈칸에는 'int(row["minutes"])'이 들어갑니다. 헤더로 열 이름을 인식합니다 첫 데이터 행을 사전으로 읽습니다 minutes 문자열 30을 정수 30으로 바꿉니다
    commonMistakes:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-85-python-csv-parse-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 '변수,30,pass'을 '변수,31,pass'로 바꿔 보세요. 출력도 먼저 예측하세요.
    starter: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    answer: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,31,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    hint: "'변수,30,pass'을 '변수,31,pass'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요."
    explanation: 예시 답안에서는 '변수,30,pass'을 '변수,31,pass'로 바꿨습니다. 원본 출력은 '30'입니다. 바뀐 코드의 결과는 실행해 확인하세요.
    commonMistakes:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-85-python-csv-parse-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함 상황을 확인하세요.
    starter: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = row["minutes"]

      print(minutes)'
    answer: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    hint: DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 헤더로 열 이름을 인식합니다 첫 데이터 행을 사전으로 읽습니다 minutes 문자열 30을 정수 30으로 바꿉니다
    commonMistakes:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-85-python-csv-parse-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python CSV 파싱과 검증' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python CSV 파싱과 검증: 직접 구현"
    answer: 'import csv, io

      source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

      row = next(csv.DictReader(source))

      minutes = int(row["minutes"])

      print(minutes)'
    hint: DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 헤더로 열 이름을 인식합니다 첫 데이터 행을 사전으로 읽습니다 minutes 문자열 30을 정수 30으로 바꿉니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-85-python-csv-parse-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "30"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: CSV 문자열  →  row['minutes']='30'  →  int=30 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-85-python-csv-parse-model
    question: Python CSV 파싱과 검증을 이해하는 데 맞는 설명은?
    choices:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다.
    answerIndex: 2
    explanation: DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다.
  - id: quiz-day-85-python-csv-parse-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-85-python-csv-parse-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - CSV 레코드 필드별 검증라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 CSV 레코드 필드별 검증라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'import csv, io

  source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")

  row = next(csv.DictReader(source))

  minutes = int(row["minutes"])

  print(minutes)'
---

## 오늘 배울 이유

CSV의 모든 필드는 글자이므로 숫자·날짜·언어·결과를 명시적으로 검증해야 합니다. 처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.

## 시작 전에 확인할 것

바로 앞선 [Day 84](/learn/day-84-fixture-review)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다. 다음 흐름을 눈으로 확인하세요.

```text
CSV 문자열  →  row['minutes']='30'  →  int=30
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

`csv.DictReader`는 헤더 이름을 키로 각 행을 읽습니다. `row["minutes"]`가 `"30"`이면 `int(...)`를 거쳐 정수 30이 되고 합계에 쓸 수 있습니다. `"thirty"`는 숫자가 아니므로 `ValueError`가 납니다.

키 `"minutes"` 자체가 빠졌다면 `KeyError`이고, 빈 값이나 음수 값은 따로 검증해야 합니다. CSV를 읽는 동작과 '유효한 학습 기록인가'를 판단하는 동작을 나눠 보세요. 오류 메시지에는 어떤 행의 어느 필드인지 알려 주면 사용자가 파일을 고칠 수 있습니다.

## 문법을 예제로 보기

아래는 Python 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```python
import csv, io
source = io.StringIO("date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n")
row = next(csv.DictReader(source))
minutes = int(row["minutes"])
print(minutes)
```

예상 출력:

```text
30
```

아래 Python 실행 영역에 같은 코드가 미리 들어 있습니다. 먼저 예측하고 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `int(row["minutes"])`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. 헤더로 열 이름을 인식합니다
2. 첫 데이터 행을 사전으로 읽습니다
3. minutes 문자열 30을 정수 30으로 바꿉니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작      |
| ---: | ------------------- |
|    1 | CSV 문자열          |
|    2 | row['minutes']='30' |
|    3 | int=30              |

마지막 상태에서 화면에 표시되는 결과는 `30`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. '변수,30,pass'을 '변수,31,pass'로 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함.** DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **CSV 레코드 필드별 검증**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | 토큰화 후 strtol·날짜 범위 검사      |
| Python | csv.DictReader와 ValueError          |
| Rust   | 필드 분리 후 parse::<u32>()의 Result |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? CSV의 모든 필드는 글자이므로 숫자·날짜·언어·결과를 명시적으로 검증해야 합니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

DictReader는 헤더 이름으로 필드를 읽고 int는 minutes를 정수로 변환하며 잘못된 값이면 실패합니다. 예시의 출력은 `30`입니다. 오류를 찾을 때는 **검증 없이 음수·누락·알 수 없는 언어를 정상 행으로 취급함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 Python CSV 파싱과 검증의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
