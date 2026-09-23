---
schemaVersion: 1
contentVersion: 2026.10-c
id: day-92-capstone-release
courseId: crp-92
phaseId: phase-08
dayNumber: 92
date: "2026-12-31"
title: 완성 프로젝트 검증과 확장
summary: 마지막 날은 세 언어 구현의 입력 검증·집계·필터·정렬·오류 메시지를 같은 fixture로 검증합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-91-cross-language-review
learningObjectives:
  - "'완성 프로젝트 검증과 확장' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 한 언어의 결과만 보고 나머지 구현도 같다고 가정함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - capstone release
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
  - id: ex-day-92-capstone-release-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? C30 + Python20 + Rust10에서 시작해 계산하세요.
    starter: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      print("Study Log Analyzer 완료:", total)'
    answer: "Study Log Analyzer 완료: 60"
    hint: 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다.
    explanation: "C30 + Python20 + Rust10  →  60  →  테스트 통과. 따라서 출력은 'Study Log Analyzer 완료: 60'입니다."
    commonMistakes:
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-92-capstone-release-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 완성 프로젝트 검증과 확장의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: assert total == 60"
    starter: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      _____

      print("Study Log Analyzer 완료:", total)'
    answer: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      print("Study Log Analyzer 완료:", total)'
    hint: 세 기록의 시간을 합해 60을 구합니다
    explanation: 빈칸에는 'assert total == 60'이 들어갑니다. 세 기록의 시간을 합해 60을 구합니다 assert로 공통 기대값을 확인합니다 완료 메시지를 출력합니다
    commonMistakes:
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-92-capstone-release-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 'assert total == 60'을 'assert total == 60\nassert len(sessions) == 3'로 바꿔 보세요. 출력도 먼저 예측하세요.
    starter: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      print("Study Log Analyzer 완료:", total)'
    answer: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      assert len(sessions) == 3

      print("Study Log Analyzer 완료:", total)'
    hint:
      '''assert total == 60''을 ''assert total == 60\nassert len(sessions) == 3''로 바꾼 뒤 C30 + Python20 + Rust10
      → 60 → 테스트 통과 순으로 따라가세요.'
    explanation:
      '예시 답안에서는 ''assert total == 60''을 ''assert total == 60\nassert len(sessions) == 3''로 바꿨습니다. 원본 출력은
      ''Study Log Analyzer 완료: 60''입니다. 바뀐 코드의 결과는 실행해 확인하세요.'
    commonMistakes:
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-92-capstone-release-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드의 핵심 표현 'assert total == 0'을 점검하고 올바른 작동을 복원하세요. 한 언어의 결과만 보고 나머지 구현도 같다고 가정함 오류도 함께 경계하세요.
    starter: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 0

      print("Study Log Analyzer 완료:", total)'
    answer: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      print("Study Log Analyzer 완료:", total)'
    hint: 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 세 기록의 시간을 합해 60을 구합니다 assert로 공통 기대값을 확인합니다 완료 메시지를 출력합니다
    commonMistakes:
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-92-capstone-release-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '완성 프로젝트 검증과 확장' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 완성 프로젝트 검증과 확장: 직접 구현"
    answer: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

      total = sum(minutes for _, minutes in sessions)

      assert total == 60

      print("Study Log Analyzer 완료:", total)'
    hint: 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 세 기록의 시간을 합해 60을 구합니다 assert로 공통 기대값을 확인합니다 완료 메시지를 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-92-capstone-release-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "Study Log Analyzer 완료: 60"
    answerIndex: 2
    explanation: "C30 + Python20 + Rust10  →  60  →  테스트 통과 순서로 실행되어 'Study Log Analyzer 완료: 60'을 출력합니다."
  - id: quiz-day-92-capstone-release-model
    question: 완성 프로젝트 검증과 확장을 이해하는 데 맞는 설명은?
    choices:
      - 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다.
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다.
  - id: quiz-day-92-capstone-release-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 코드의 들여쓰기를 취향대로 바꾸기
      - 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
      - 실행 결과를 확인하지 않고 외우기
    answerIndex: 1
    explanation: 한 언어의 결과만 보고 나머지 구현도 같다고 가정함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-92-capstone-release-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 동일 입력·출력 명세와 테스트 완료라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 동일 입력·출력 명세와 테스트 완료라는 목적과 입력·출력은 유지합니다.
playgroundSource: 'sessions = [("C", 30), ("Python", 20), ("Rust", 10)]

  total = sum(minutes for _, minutes in sessions)

  assert total == 60

  print("Study Log Analyzer 완료:", total)'
---

## 1. 오늘 배울 이유

마지막 날은 세 언어 구현의 입력 검증·집계·필터·정렬·오류 메시지를 같은 fixture로 검증합니다. 처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.

## 2. 시작 전에 확인할 것

바로 앞선 [Day 91](/learn/day-91-cross-language-review)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 3. 머릿속 그림

공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다. 다음 흐름을 눈으로 확인하세요.

```text
C30 + Python20 + Rust10  →  60  →  테스트 통과
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 4. 문법을 예제로 보기

아래는 Python 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```python
sessions = [("C", 30), ("Python", 20), ("Rust", 10)]
total = sum(minutes for _, minutes in sessions)
assert total == 60
print("Study Log Analyzer 완료:", total)
```

예상 출력:

```text
Study Log Analyzer 완료: 60
```

아래 Python 실행 영역에 같은 코드가 미리 들어 있습니다. 먼저 예측하고 실행해 비교하세요.

## 5. 핵심 줄 따라 읽기

예제의 핵심 표현은 `assert total == 60`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. 세 기록의 시간을 합해 60을 구합니다
2. assert로 공통 기대값을 확인합니다
3. 완료 메시지를 출력합니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 6. 실행 추적

| 순서 | 상태 또는 동작          |
| ---: | ----------------------- |
|    1 | C30 + Python20 + Rust10 |
|    2 | 60                      |
|    3 | 테스트 통과             |

마지막 상태에서 화면에 표시되는 결과는 `Study Log Analyzer 완료: 60`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 7. 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 'assert total == 60'을 'assert total == 60\nassert len(sessions) == 3'로 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 8. 자주 틀리는 지점

**확인할 실수: 한 언어의 결과만 보고 나머지 구현도 같다고 가정함.** 공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 9. 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **동일 입력·출력 명세와 테스트 완료**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | 독립 실행 파일의 기준 출력·오류 검증 |
| Python | pytest/unittest와 선택 확장          |
| Rust   | cargo test와 동일 fixture 비교       |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 10. 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 11. 스스로 설명하기

- 왜 이 개념이 필요한가? 마지막 날은 세 언어 구현의 입력 검증·집계·필터·정렬·오류 메시지를 같은 fixture로 검증합니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 한 언어의 결과만 보고 나머지 구현도 같다고 가정함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 12. 핵심 요약과 복습

공통 명세가 참인지 테스트로 고정한 후 선호 언어에서 ASCII 시각화 한 가지를 추가합니다. 예시의 출력은 `Study Log Analyzer 완료: 60`입니다. 오류를 찾을 때는 **한 언어의 결과만 보고 나머지 구현도 같다고 가정함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.

## 13. Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 완성 프로젝트 검증과 확장의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
