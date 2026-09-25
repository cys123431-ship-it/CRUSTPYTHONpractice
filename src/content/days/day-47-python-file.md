---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-47-python-file
courseId: crp-92
phaseId: phase-04
dayNumber: 47
date: "2026-11-16"
title: Python 파일형 객체와 예외
summary: CSV/텍스트 파일을 읽을 때 줄은 문자열이므로 숫자 변환 실패까지 생각해야 합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-46-c-file
learningObjectives:
  - "'Python 파일형 객체와 예외' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 문자열을 숫자로 바꾸지 않고 합하려고 함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - python file
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
  - id: ex-day-47-python-file-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 문자열 줄에서 시작해 계산하세요.
    starter: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    answer: "30"
    hint: StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.
    explanation: 문자열 줄  →  int 변환  →  [10,20]  →  합 30. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-47-python-file-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python 파일형 객체와 예외의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: int(line)"
    starter: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [_____ for line in stream]

      print(sum(values))'
    answer: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    hint: 첫 줄 10을 문자열로 읽습니다
    explanation: 빈칸에는 'int(line)'이 들어갑니다. 첫 줄 10을 문자열로 읽습니다 각 줄을 int로 바꾸어 [10,20]을 만듭니다 sum이 30입니다
    commonMistakes:
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-47-python-file-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 '10\\n20\\n'을 '10\\n20\\n30\\n'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    answer: 'from io import StringIO

      stream = StringIO("10\n20\n30\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    hint: '''10\\n20\\n''을 ''10\\n20\\n30\\n''로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.'
    explanation:
      예시 답안에서는 '10\\n20\\n'을 '10\\n20\\n30\\n'로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요.
      출력이 같더라도 입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-47-python-file-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 문자열을 숫자로 바꾸지 않고 합하려고 함 상황을 확인하세요.
    starter: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [line for line in stream]

      print(sum(values))'
    answer: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    hint: StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 첫 줄 10을 문자열로 읽습니다 각 줄을 int로 바꾸어 [10,20]을 만듭니다 sum이 30입니다
    commonMistakes:
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-47-python-file-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Python 파일형 객체와 예외' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 파일형 객체와 예외: 직접 구현"
    answer: 'from io import StringIO

      stream = StringIO("10\n20\n")

      values = [int(line) for line in stream]

      print(sum(values))'
    hint: StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 첫 줄 10을 문자열로 읽습니다 각 줄을 int로 바꾸어 [10,20]을 만듭니다 sum이 30입니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-47-python-file-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "30"
    answerIndex: 2
    explanation: 문자열 줄  →  int 변환  →  [10,20]  →  합 30 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-47-python-file-model
    question: Python 파일형 객체와 예외을 이해하는 데 맞는 설명은?
    choices:
      - StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.
      - 문자열을 숫자로 바꾸지 않고 합하려고 함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.
  - id: quiz-day-47-python-file-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 문자열을 숫자로 바꾸지 않고 합하려고 함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 문자열을 숫자로 바꾸지 않고 합하려고 함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-47-python-file-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 텍스트 스트림을 순회하고 변환함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 텍스트 스트림을 순회하고 변환함라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'from io import StringIO

  stream = StringIO("10\n20\n")

  values = [int(line) for line in stream]

  print(sum(values))'
---

## 오늘 배울 이유

CSV/텍스트 파일을 읽을 때 줄은 문자열이므로 숫자 변환 실패까지 생각해야 합니다. Day 47 "`Python 파일형 객체와 예외`"에서는 Python 코드가 `30`을(를) 만드는 과정을 따라가며, 텍스트 스트림을 순회하고 변환함 동작이 왜 필요한지 확인합니다. 텍스트 스트림을 순회하고 변환함을(를) 빠뜨리면 `문자열을 숫자로 바꾸지 않고 합하려고 함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 46](/learn/day-46-c-file)에서는 "C 파일 입출력과 실패 검사"을(를) 배웠습니다. "C 파일 입출력과 실패 검사"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`Python 파일형 객체와 예외`"에서 새로 달라지는 조건을 찾아보세요. Day 47의 답은 `30`이며, 핵심 표현은 `int(line)`입니다.

## 머릿속 그림

StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다. Day 47에서는 아래 흐름 순서대로 상태가 바뀌며, `int(line)`이(가) 결과를 가릅니다.

```text
문자열 줄  →  int 변환  →  [10,20]  →  합 30
```

위 흐름에서 `int(line)`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

`StringIO`는 문자열을 파일처럼 한 줄씩 읽게 해 주는 연습 도구입니다. `for line in file:`은 줄 단위로 움직이고 `int(line)`은 그 줄이 숫자 글자일 때 정수로 바꿉니다. `"10
"`은 10이 되지만 `"열
"`은 `ValueError`가 납니다.

실제 파일에서는 `with open(..., encoding="utf-8") as f:`로 열면 블록을 나갈 때 정리됩니다. 변환 실패를 `try/except ValueError`로 다루되, 어떤 줄이 실패했는지 사용자에게 알려 줄 수도 있습니다. 입력 줄이 비어 있으면 건너뛸지 오류로 볼지도 먼저 정하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 47 "`Python 파일형 객체와 예외`"의 독립 예제입니다. 전체 4줄에서 `int(line)`이(가) 핵심이며, 실행 결과는 `30`입니다.

```python
from io import StringIO
stream = StringIO("10\n20\n")
values = [int(line) for line in stream]
print(sum(values))
```

예상 출력:

```text
30
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 `30`을(를) 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `int(line)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | from io import StringIO
 2 | stream = StringIO("10\n20\n")
 3 | values = [int(line) for line in stream]
 4 | print(sum(values))
```

1. 첫 줄 10을 문자열로 읽습니다
2. 각 줄을 int로 바꾸어 [10,20]을 만듭니다
3. sum이 30입니다

위 단계에서 `int(line)`이(가) 빠지면 `30`이(가) 나오지 않습니다. `'10\\n20\\n'을 '10\\n20\\n30\\n'로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 문자열 줄      |
|    2 | int 변환       |
|    3 | [10,20]        |
|    4 | 합 30          |

위 순서대로 실행하면 최종 출력 `30`이(가) 됩니다. `문자열 줄` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`StringIO("10\n20\n")`에서 각 줄에 `int(line)`을 적용하면 10과 20이 되어 합계는 30입니다. 입력을 `"10\nxyz\n"`로 바꾸면 두 번째 변환에서 `ValueError`가 납니다. 오류를 조용히 0으로 세지 말고 어떤 줄을 고쳐야 하는지 사용자에게 알려 주세요.

## 결과 예측과 작은 변경

원본 코드에서 `'10\\n20\\n'을 '10\\n20\\n30\\n'로` 바꾸면 아래와 같이 됩니다.

```python
from io import StringIO
stream = StringIO("10\n20\n30\n")
values = [int(line) for line in stream]
print(sum(values))
```

원본 출력은 `30`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `int(line)`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 47의 `Python 파일형 객체와 예외`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 문자열을 숫자로 바꾸지 않고 합하려고 함.** 정상 코드에서는 `30`이(가) 출력됩니다.

- 정상 줄: `values = [int(line) for line in stream]`
- 잘못된 줄: `values = [line for line in stream]`

두 줄을 나란히 놓고 `StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `문자열 줄`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **텍스트 스트림을 순회하고 변환함**은(는) 세 언어에서 같은 입력과 출력(`30`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙                |
| ------ | ----------------------------------------- |
| C17    | fgets 후 strtol과 변환 오류 검사          |
| Python | with open 또는 StringIO, int의 ValueError |
| Rust   | BufRead::lines와 parse의 Result           |

C17에서는 `fgets 후 strtol과 변환 오류 검사` 규칙으로 "`Python 파일형 객체와 예외`"의 `30`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `with open 또는 StringIO, int의 ValueError` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `BufRead::lines와 parse의 Result` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`int(line)` 채우기) → 변경(`'10\\n20\\n'을 '10\\n20\\n30\\n'로`) → 오류 수정(`문자열을 숫자로 바꾸지 않고 합하려고 함` 찾기) → 독립 구현(`Python 파일형 객체와 예외을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `int(line)` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 파일형 객체와 예외`"이(가) 필요한 상황을 `텍스트 스트림을 순회하고 변환함` 동작으로 설명해 보세요.
- 예제에서 `int(line)`이(가) 실행되기 직전의 상태와 직후의 출력 `30`을(를) 말해 보세요.
- "`문자열을 숫자로 바꾸지 않고 합하려고 함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `텍스트 스트림을 순회하고 변환함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

StringIO는 메모리 속 파일형 객체입니다. 실제 파일로 바꿔도 한 줄씩 읽는 규칙은 같습니다. Day 47 "`Python 파일형 객체와 예외`"의 예제는 `int(line)`을(를) 실행해 `30`을(를) 출력합니다. "`문자열을 숫자로 바꾸지 않고 합하려고 함`" 여부를 확인하고 Day 47을(를) 완료하세요.
