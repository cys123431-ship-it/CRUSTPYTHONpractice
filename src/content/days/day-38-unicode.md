---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-38-unicode
courseId: crp-92
phaseId: phase-04
dayNumber: 38
date: "2026-11-07"
title: Python 문자열과 유니코드
summary: 글자 수와 저장 바이트 수를 혼동하면 파일 길이나 자르기 계산이 틀립니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-37-c-strings
learningObjectives:
  - "'Python 문자열과 유니코드' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 한글 한 글자를 항상 한 바이트라고 가정함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - unicode
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
  - id: ex-day-38-unicode-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 두 글자에서 시작해 계산하세요.
    starter: 'text = "한글"

      print(len(text), len(text.encode("utf-8")))'
    answer: 2 6
    hint: Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.
    explanation: 두 글자  →  UTF-8 6바이트  →  2 6. 따라서 출력은 '2 6'입니다.
    commonMistakes:
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-38-unicode-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python 문자열과 유니코드의 핵심 표현을 스스로 적는다.
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: encode("utf-8")'
    starter: 'text = "한글"

      print(len(text), len(text._____))'
    answer: 'text = "한글"

      print(len(text), len(text.encode("utf-8")))'
    hint: text에는 한·글 두 글자가 있습니다
    explanation: 빈칸에는 'encode("utf-8")'이 들어갑니다. text에는 한·글 두 글자가 있습니다 UTF-8로 각 글자를 3바이트로 인코딩합니다 2와 6을 출력합니다
    commonMistakes:
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-38-unicode-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 '한글'에서 '한글!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'text = "한글"

      print(len(text), len(text.encode("utf-8")))'
    answer: 'text = "한글!"

      print(len(text), len(text.encode("utf-8")))'
    hint: 첫 문자열을 '한글'에서 '한글!'로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 첫 문자열을 '한글'에서 '한글!'로 바꿨습니다. 원래 출력은 '2 6'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-38-unicode-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 한글 한 글자를 항상 한 바이트라고 가정함 상황을 확인하세요.
    starter: 'text = "한글"

      print(len(text), len(text.upper()))'
    answer: 'text = "한글"

      print(len(text), len(text.encode("utf-8")))'
    hint: Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. text에는 한·글 두 글자가 있습니다 UTF-8로 각 글자를 3바이트로 인코딩합니다 2와 6을 출력합니다
    commonMistakes:
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-38-unicode-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python 문자열과 유니코드' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 문자열과 유니코드: 직접 구현"
    answer: 'text = "한글"

      print(len(text), len(text.encode("utf-8")))'
    hint: Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 text에는 한·글 두 글자가 있습니다 UTF-8로 각 글자를 3바이트로 인코딩합니다 2와 6을 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-38-unicode-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - 2 6
    answerIndex: 2
    explanation: 두 글자  →  UTF-8 6바이트  →  2 6 순서로 실행되어 '2 6'을 출력합니다.
  - id: quiz-day-38-unicode-model
    question: Python 문자열과 유니코드을 이해하는 데 맞는 설명은?
    choices:
      - Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.
      - 한글 한 글자를 항상 한 바이트라고 가정함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.
  - id: quiz-day-38-unicode-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 한글 한 글자를 항상 한 바이트라고 가정함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 한글 한 글자를 항상 한 바이트라고 가정함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-38-unicode-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 문자 수와 인코딩 바이트 수 구분라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 문자 수와 인코딩 바이트 수 구분라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'text = "한글"

  print(len(text), len(text.encode("utf-8")))'
---

## 오늘 배울 이유

글자 수와 저장 바이트 수를 혼동하면 파일 길이나 자르기 계산이 틀립니다. Day 38 "`Python 문자열과 유니코드`"에서는 Python 코드가 `2 6`을(를) 만드는 과정을 따라가며, 문자 수와 인코딩 바이트 수 구분 동작이 왜 필요한지 확인합니다. 문자 수와 인코딩 바이트 수 구분을(를) 빠뜨리면 `한글 한 글자를 항상 한 바이트라고 가정함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 37](/learn/day-37-c-strings)에서는 "C 문자열과 널 종료"을(를) 배웠습니다. "C 문자열과 널 종료"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Python 문자열과 유니코드`"에서 새로 달라지는 조건을 찾아보세요. Day 38의 답은 `2 6`이며, 핵심 표현은 `encode("utf-8")`입니다.

## 머릿속 그림

Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다. Day 38에서는 아래 흐름 순서대로 상태가 바뀌며, `encode("utf-8")`이(가) 결과를 가릅니다.

```text
두 글자  →  UTF-8 6바이트  →  2 6
```

위 흐름에서 `encode("utf-8")`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `2 6`입니다.

## 천천히 풀어보기

Python 문자열은 유니코드 텍스트이고, `encode("utf-8")`의 결과는 파일이나 네트워크로 보낼 수 있는 바이트입니다. `len("가")`는 보통 코드 포인트 하나를 세지만 `len("가".encode("utf-8"))`은 UTF-8 바이트 세 개를 셉니다.

보이는 글자 하나가 언제나 코드 포인트 하나인 것도 아닙니다. 결합 문자나 이모지 묶음은 사람이 보는 글자 수와 `len` 결과가 다를 수 있습니다. 문자열 길이를 구할 때 '텍스트의 코드 포인트 수'인지 '저장할 바이트 수'인지 목적을 먼저 정하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 38 "`Python 문자열과 유니코드`"의 독립 예제입니다. 전체 2줄에서 `encode("utf-8")`이(가) 핵심이며, 실행 결과는 `2 6`입니다.

```python
text = "한글"
print(len(text), len(text.encode("utf-8")))
```

예상 출력:

```text
2 6
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `2 6`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `encode("utf-8")`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | text = "한글"
 2 | print(len(text), len(text.encode("utf-8")))
```

1. text에는 한·글 두 글자가 있습니다
2. UTF-8로 각 글자를 3바이트로 인코딩합니다
3. 2와 6을 출력합니다

위 단계에서 `encode("utf-8")`이(가) 빠지면 `2 6`이(가) 나오지 않습니다. `첫 문자열을 '한글'에서 '한글!'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 두 글자        |
|    2 | UTF-8 6바이트  |
|    3 | 2 6            |

위 순서대로 실행하면 최종 출력 `2 6`이(가) 됩니다. `두 글자` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`text = "가a"`라면 `len(text)`는 두 코드 포인트를 세어 2입니다. 그러나 UTF-8 바이트는 '가'에 3바이트, a에 1바이트라 4바이트입니다. 따라서 파일의 바이트 길이를 제한할 때 단순 `len(text) <= 3`만 검사하면 요구를 어길 수 있습니다. 표시 글자와 저장 바이트의 기준을 분리하세요.

## 결과 예측과 작은 변경

원본 코드에서 `첫 문자열을 '한글'에서 '한글!'로` 바꾸면 아래와 같이 됩니다.

```python
text = "한글!"
print(len(text), len(text.encode("utf-8")))
```

원본 출력은 `2 6`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `encode("utf-8")`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 38의 `Python 문자열과 유니코드`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 한글 한 글자를 항상 한 바이트라고 가정함.** 정상 코드에서는 `2 6`이(가) 출력됩니다.

- 정상 줄: `print(len(text), len(text.encode("utf-8")))`
- 잘못된 줄: `print(len(text), len(text.upper()))`

두 줄을 나란히 놓고 `Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `두 글자`부터 `2 6`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **문자 수와 인코딩 바이트 수 구분**은(는) 세 언어에서 같은 입력과 출력(`2 6`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙                |
| ------ | ----------------------------------------- |
| C17    | UTF-8 char[]의 strlen은 바이트 수         |
| Python | len(str)과 len(encode()) 구별             |
| Rust   | len은 바이트, chars().count()는 scalar 수 |

C17에서는 `UTF-8 char[]의 strlen은 바이트 수` 규칙으로 "`Python 문자열과 유니코드`"의 `2 6`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `len(str)과 len(encode()) 구별` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `len은 바이트, chars().count()는 scalar 수` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`2 6` 맞히기) → 빈칸(`encode("utf-8")` 채우기) → 변경(`첫 문자열을 '한글'에서 '한글!'로`) → 오류 수정(`한글 한 글자를 항상 한 바이트라고 가정함` 찾기) → 독립 구현(`Python 문자열과 유니코드을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `2 6` 및 `encode("utf-8")` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 문자열과 유니코드`"이(가) 필요한 상황을 `문자 수와 인코딩 바이트 수 구분` 동작으로 설명해 보세요.
- 예제에서 `encode("utf-8")`이(가) 실행되기 직전의 상태와 직후의 출력 `2 6`을(를) 말해 보세요.
- "`한글 한 글자를 항상 한 바이트라고 가정함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `문자 수와 인코딩 바이트 수 구분` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Python str의 len은 코드 포인트 수이고 UTF-8로 인코딩한 bytes 길이는 별개입니다. Day 38 "`Python 문자열과 유니코드`"의 예제는 `encode("utf-8")`을(를) 실행해 `2 6`을(를) 출력합니다. "`한글 한 글자를 항상 한 바이트라고 가정함`" 여부를 확인하고 Day 38을(를) 완료하세요.
