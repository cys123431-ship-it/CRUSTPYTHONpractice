---
schemaVersion: 1
contentVersion: 2026.10-c
id: day-24-recursion
courseId: crp-92
phaseId: phase-02
dayNumber: 24
date: "2026-10-24"
title: 재귀와 종료 조건
summary: 큰 문제를 같은 모양의 작은 문제로 줄일 수 있으면 재귀로 관계를 표현할 수 있습니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-23-scope
learningObjectives:
  - "'재귀와 종료 조건' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - recursion
  - execution trace
  - language transfer
runnerMode: none
reviewOffsets:
  - 1
  - 3
  - 7
  - 14
  - 30
sample: false
exercises:
  - id: ex-day-24-recursion-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? sum_to(3)에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 0) return 0;\n    return n + sum_to(n - 1);\n\
      }\nint main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    answer: "6"
    hint: 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다.
    explanation: sum_to(3)  →  sum_to(2)  →  sum_to(1)  →  sum_to(0)  →  6. 따라서 출력은 '6'입니다.
    commonMistakes:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-24-recursion-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 재귀와 종료 조건의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: n == 0"
    starter:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (_____) return 0;\n    return n + sum_to(n - 1);\n}\n\
      int main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    answer:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 0) return 0;\n    return n + sum_to(n - 1);\n}\n\
      int main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    hint: sum_to(3)이 3+sum_to(2)를 기다립니다
    explanation: 빈칸에는 'n == 0'이 들어갑니다. sum_to(3)이 3+sum_to(2)를 기다립니다 2+sum_to(1), 1+sum_to(0)를 거칩니다 0에서 돌아와 1+2+3=6입니다
    commonMistakes:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-24-recursion-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 0) return 0;\n    return n + sum_to(n - 1);\n\
      }\nint main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    answer:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 1) return 0;\n    return n + sum_to(n - 1);\n}\n\
      int main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '6'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-24-recursion-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == -1) return 0;\n    return n + sum_to(n - 1);\n\
      }\nint main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    answer:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 0) return 0;\n    return n + sum_to(n - 1);\n}\n\
      int main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    hint: 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. sum_to(3)이 3+sum_to(2)를 기다립니다 2+sum_to(1), 1+sum_to(0)를 거칩니다 0에서 돌아와 1+2+3=6입니다
    commonMistakes:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-24-recursion-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '재귀와 종료 조건' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 재귀와 종료 조건: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint sum_to(int n) {\n    if (n == 0) return 0;\n    return n + sum_to(n - 1);\n}\n\
      int main(void) { printf(\"%d\\n\", sum_to(3)); return 0; }"
    hint: 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 sum_to(3)이 3+sum_to(2)를 기다립니다 2+sum_to(1), 1+sum_to(0)를 거칩니다 0에서 돌아와 1+2+3=6입니다
      다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-24-recursion-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "6"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: sum_to(3)  →  sum_to(2)  →  sum_to(1)  →  sum_to(0)  →  6 순서로 실행되어 '6'을 출력합니다.
  - id: quiz-day-24-recursion-model
    question: 재귀와 종료 조건을 이해하는 데 맞는 설명은?
    choices:
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함(이것이 정상적인 사용법이다)
      - 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다.
  - id: quiz-day-24-recursion-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
    answerIndex: 2
    explanation: 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-24-recursion-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 문제를 줄여 재귀적으로 합산함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 문제를 줄여 재귀적으로 합산함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

큰 문제를 같은 모양의 작은 문제로 줄일 수 있으면 재귀로 관계를 표현할 수 있습니다. 처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.

## 시작 전에 확인할 것

바로 앞선 [Day 23](/learn/day-23-scope)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다. 다음 흐름을 눈으로 확인하세요.

```text
sum_to(3)  →  sum_to(2)  →  sum_to(1)  →  sum_to(0)  →  6
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

재귀 함수는 작업을 더 작은 **같은 종류의 작업**으로 바꿔 자기 자신을 호출합니다. 예를 들어 `sum_to(3)`이 `3 + sum_to(2)`를 부르고, `sum_to(2)`가 `2 + sum_to(1)`을 부릅니다. `n == 0`이면 더 이상 호출하지 않고 0을 돌려주는 바닥이 됩니다. 돌아오면서 1, 3, 6이 순서대로 만들어집니다.

종료 조건을 빼거나 n을 줄이지 않으면 호출이 끝나지 않습니다. 음수가 들어오면 n을 1씩 빼는 방식으로는 0에 닿지 않으므로 입력 조건을 정해야 합니다. 호출할 때와 반환할 때의 순서를 따로 적어 보세요.

## 문법을 예제로 보기

아래는 C 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```c
#include <stdio.h>
int sum_to(int n) {
    if (n == 0) return 0;
    return n + sum_to(n - 1);
}
int main(void) { printf("%d\n", sum_to(3)); return 0; }
```

예상 출력:

```text
6
```

이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `n == 0`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. sum_to(3)이 3+sum_to(2)를 기다립니다
2. 2+sum_to(1), 1+sum_to(0)를 거칩니다
3. 0에서 돌아와 1+2+3=6입니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | sum_to(3)      |
|    2 | sum_to(2)      |
|    3 | sum_to(1)      |
|    4 | sum_to(0)      |
|    5 | 6              |

마지막 상태에서 화면에 표시되는 결과는 `6`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 다른 예제로 다시 이해하기

`sum_to(2)`의 호출을 펼치면 `2 + sum_to(1)`, 다시 `2 + 1 + sum_to(0)`이 됩니다. 맨 아래에서 `sum_to(0)=0`을 반환한 다음 1, 3 순으로 위로 올라옵니다. 아래로 내려가는 호출과 위로 올라오는 계산을 한 줄로 뭉개지 말고 두 번에 나눠 따라가세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 결과가 바뀌는지 예측하고, 같다면 왜 같은지 설명하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함.** 기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **문제를 줄여 재귀적으로 합산함**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙       |
| ------ | -------------------------------- |
| C17    | if (n==0) return 0;              |
| Python | if n==0: return 0                |
| Rust   | if n==0 {0} else {n+sum_to(n-1)} |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 큰 문제를 같은 모양의 작은 문제로 줄일 수 있으면 재귀로 관계를 표현할 수 있습니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

기저 조건 n=0이 멈추는 바닥이고 각 호출은 n을 1 줄여 그 바닥으로 접근합니다. 예시의 출력은 `6`입니다. 오류를 찾을 때는 **기저 조건이 없거나 입력을 줄이지 않아 끝없이 호출함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
