---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-83-capstone-contract
courseId: crp-92
phaseId: phase-08
dayNumber: 83
date: "2026-12-22"
title: "프로젝트 계약: 공통 CSV 입력"
summary: 세 언어로 같은 프로그램을 만들려면 먼저 필드 순서와 출력 규약을 한 가지로 고정해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-82-shortest-path
learningObjectives:
  - "'프로젝트 계약: 공통 CSV 입력' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - capstone contract
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
  - id: ex-day-83-capstone-contract-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 헤더에서 시작해 계산하세요.
    starter: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[3])'
    answer: 5 minutes
    hint: CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.
    explanation: 헤더  →  다섯 열  →  네 번째 minutes. 따라서 출력은 '5 minutes'입니다.
    commonMistakes:
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-83-capstone-contract-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "프로젝트 계약: 공통 CSV 입력의 핵심 표현을 스스로 적는다."
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: split(",")'
    starter: 'header = "date,language,topic,minutes,result"

      fields = header._____

      print(len(fields), fields[3])'
    answer: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[3])'
    hint: 헤더 문자열을 쉼표로 나눕니다
    explanation: 빈칸에는 'split(",")'이 들어갑니다. 헤더 문자열을 쉼표로 나눕니다 다섯 항목을 얻습니다 인덱스 3의 minutes를 출력합니다
    commonMistakes:
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-83-capstone-contract-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 'fields[3]'을 'fields[2]'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[3])'
    answer: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[2])'
    hint: "'fields[3]'을 'fields[2]'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요."
    explanation:
      예시 답안에서는 'fields[3]'을 'fields[2]'로 바꿨습니다. 원래 출력은 '5 minutes'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요.
      출력이 같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-83-capstone-contract-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함 상황을 확인하세요.
    starter: 'header = "date,language,topic,minutes,result"

      fields = header.split(";")

      print(len(fields), fields[3])'
    answer: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[3])'
    hint: CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 헤더 문자열을 쉼표로 나눕니다 다섯 항목을 얻습니다 인덱스 3의 minutes를 출력합니다
    commonMistakes:
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-83-capstone-contract-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: "예시를 가리고 '프로젝트 계약: 공통 CSV 입력' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요."
    starter: "# 프로젝트 계약: 공통 CSV 입력: 직접 구현"
    answer: 'header = "date,language,topic,minutes,result"

      fields = header.split(",")

      print(len(fields), fields[3])'
    hint: CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 헤더 문자열을 쉼표로 나눕니다 다섯 항목을 얻습니다 인덱스 3의 minutes를 출력합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-83-capstone-contract-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - 5 minutes
    answerIndex: 2
    explanation: 헤더  →  다섯 열  →  네 번째 minutes 순서로 실행되어 '5 minutes'을 출력합니다.
  - id: quiz-day-83-capstone-contract-model
    question: "프로젝트 계약: 공통 CSV 입력을 이해하는 데 맞는 설명은?"
    choices:
      - CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.
  - id: quiz-day-83-capstone-contract-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-83-capstone-contract-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 공통 입력 스키마 정의라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 공통 입력 스키마 정의라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'header = "date,language,topic,minutes,result"

  fields = header.split(",")

  print(len(fields), fields[3])'
---

## 오늘 배울 이유

세 언어로 같은 프로그램을 만들려면 먼저 필드 순서와 출력 규약을 한 가지로 고정해야 합니다. Day 83 "`프로젝트 계약: 공통 CSV 입력`"에서는 Python 코드가 `5 minutes`을(를) 만드는 과정을 따라가며, 공통 입력 스키마 정의 동작이 왜 필요한지 확인합니다. 공통 입력 스키마 정의을(를) 빠뜨리면 `쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 82](/learn/day-82-shortest-path)에서는 "최단 경로의 거리 갱신"을(를) 배웠습니다. "최단 경로의 거리 갱신"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`프로젝트 계약: 공통 CSV 입력`"에서 새로 달라지는 조건을 찾아보세요. Day 83의 답은 `5 minutes`이며, 핵심 표현은 `split(",")`입니다.

## 머릿속 그림

CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다. Day 83에서는 아래 흐름 순서대로 상태가 바뀌며, `split(",")`이(가) 결과를 가릅니다.

```text
헤더  →  다섯 열  →  네 번째 minutes
```

위 흐름에서 `split(",")`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `5 minutes`입니다.

## 천천히 풀어보기

프로젝트의 CSV 한 행은 `date,language,topic,minutes,result` 순서의 기록입니다. 단순 예제의 `split(",")`는 쉼표로 나눠 다섯 조각을 얻고 네 번째인 인덱스 3을 분으로 읽습니다. `"30"`은 아직 문자열이므로 합계에 넣기 전에 정수로 바꿔야 합니다.

실제 CSV에서는 따옴표 안 쉼표 같은 규칙이 있어서 단순 `split`으로 항상 안전하게 파싱할 수 없습니다. 완성 프로젝트의 각 언어 구현과 Python의 `csv` 모듈처럼 CSV 규칙을 다루는 코드를 확인하세요. 누락된 열·빈 분·음수 분을 어떻게 처리할지도 공통 계약에 적어야 합니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 83 "`프로젝트 계약: 공통 CSV 입력`"의 독립 예제입니다. 전체 3줄에서 `split(",")`이(가) 핵심이며, 실행 결과는 `5 minutes`입니다.

```python
header = "date,language,topic,minutes,result"
fields = header.split(",")
print(len(fields), fields[3])
```

예상 출력:

```text
5 minutes
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `5 minutes`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `split(",")`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | header = "date,language,topic,minutes,result"
 2 | fields = header.split(",")
 3 | print(len(fields), fields[3])
```

1. 헤더 문자열을 쉼표로 나눕니다
2. 다섯 항목을 얻습니다
3. 인덱스 3의 minutes를 출력합니다

위 단계에서 `split(",")`이(가) 빠지면 `5 minutes`이(가) 나오지 않습니다. `'fields[3]'을 'fields[2]'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작  |
| ---: | --------------- |
|    1 | 헤더            |
|    2 | 다섯 열         |
|    3 | 네 번째 minutes |

위 순서대로 실행하면 최종 출력 `5 minutes`이(가) 됩니다. `헤더` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

CSV 행 `2026-10-01,Python,변수,30,pass`를 다섯 칸으로 분리하면 번호 0=날짜, 1=언어, 2=주제, 3=분, 4=결과입니다. `fields[3]`은 글자 `"30"`이지 정수 30이 아닙니다. 연습용 `split(",")`로는 따옴표 속 쉼표를 안전하게 처리하지 못하니 실제 파일은 CSV 파서를 사용하세요.

## 결과 예측과 작은 변경

원본 코드에서 `'fields[3]'을 'fields[2]'로` 바꾸면 아래와 같이 됩니다.

```python
header = "date,language,topic,minutes,result"
fields = header.split(",")
print(len(fields), fields[2])
```

원본 출력은 `5 minutes`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `split(",")`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 83의 `프로젝트 계약: 공통 CSV 입력`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함.** 정상 코드에서는 `5 minutes`이(가) 출력됩니다.

- 정상 줄: `fields = header.split(",")`
- 잘못된 줄: `fields = header.split(";")`

두 줄을 나란히 놓고 `CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `헤더`부터 `5 minutes`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **공통 입력 스키마 정의**은(는) 세 언어에서 같은 입력과 출력(`5 minutes`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙               |
| ------ | ---------------------------------------- |
| C17    | CSV 파서에 열 개수·인용 규칙 전달        |
| Python | csv.DictReader가 표준 CSV 처리           |
| Rust   | csv crate 또는 제약된 형식의 명시적 파서 |

C17에서는 `CSV 파서에 열 개수·인용 규칙 전달` 규칙으로 "`프로젝트 계약: 공통 CSV 입력`"의 `5 minutes`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `csv.DictReader가 표준 CSV 처리` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `csv crate 또는 제약된 형식의 명시적 파서` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`5 minutes` 맞히기) → 빈칸(`split(",")` 채우기) → 변경(`'fields[3]'을 'fields[2]'로`) → 오류 수정(`쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함` 찾기) → 독립 구현(`프로젝트 계약: 공통 CSV 입력을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `5 minutes` 및 `split(",")` 설명과 대조하세요.

## 스스로 설명하기

- "`프로젝트 계약: 공통 CSV 입력`"이(가) 필요한 상황을 `공통 입력 스키마 정의` 동작으로 설명해 보세요.
- 예제에서 `split(",")`이(가) 실행되기 직전의 상태와 직후의 출력 `5 minutes`을(를) 말해 보세요.
- "`쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `공통 입력 스키마 정의` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

CSV 한 행은 날짜·언어·주제·분·결과의 다섯 열이고 minutes는 네 번째 열입니다. Day 83 "`프로젝트 계약: 공통 CSV 입력`"의 예제는 `split(",")`을(를) 실행해 `5 minutes`을(를) 출력합니다. "`쉼표가 포함된 인용 필드를 단순 split으로 실제 CSV처럼 처리함`" 여부를 확인하고 Day 83을(를) 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 프로젝트 계약: 공통 CSV 입력의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
