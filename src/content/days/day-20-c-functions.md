---
schemaVersion: 1
contentVersion: 2026.10-c
id: day-20-c-functions
courseId: crp-92
phaseId: phase-02
dayNumber: 20
date: "2026-10-20"
title: C 함수 매개변수와 반환값
summary: 같은 계산을 여러 곳에서 쓰려면 입력과 출력을 가진 함수로 분리해야 합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-19-nested-loop
learningObjectives:
  - "'C 함수 매개변수와 반환값' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - c functions
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
  - id: ex-day-20-c-functions-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 인수 2,3 전달에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\"\
      , add(2, 3));\n    return 0;\n}"
    answer: "5"
    hint: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
    explanation: 인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환. 따라서 출력은 '5'입니다.
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-20-c-functions-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 함수 매개변수와 반환값의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: return a + b"
    starter:
      "#include <stdio.h>\nint add(int a, int b) { _____; }\nint main(void) {\n    printf(\"%d\\n\", add(2,\
      \ 3));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(2, 3));\n    return 0;\n}"
    hint: main에서 add(2,3)을 호출합니다
    explanation: 빈칸에는 'return a + b'이 들어갑니다. main에서 add(2,3)을 호출합니다 함수의 a=2,b=3으로 계산합니다 반환 5를 printf가 출력합니다
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-20-c-functions-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\"\
      , add(2, 3));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(3, 3));\n    return 0;\n}"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 2에서 3로 바꿨습니다. 원래 출력은 '5'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-20-c-functions-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint add(int a, int b) { return a - b; }\nint main(void) {\n    printf(\"%d\\n\"\
      , add(2, 3));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(2, 3));\n    return 0;\n}"
    hint: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. main에서 add(2,3)을 호출합니다 함수의 a=2,b=3으로 계산합니다 반환 5를 printf가 출력합니다
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-20-c-functions-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 함수 매개변수와 반환값' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 함수 매개변수와 반환값: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(2, 3));\n    return 0;\n}"
    hint: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 main에서 add(2,3)을 호출합니다 함수의 a=2,b=3으로 계산합니다 반환 5를 printf가 출력합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-20-c-functions-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "5"
    answerIndex: 2
    explanation: 인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환 순서로 실행되어 '5'을 출력합니다.
  - id: quiz-day-20-c-functions-model
    question: C 함수 매개변수와 반환값을 이해하는 데 맞는 설명은?
    choices:
      - 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
  - id: quiz-day-20-c-functions-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-20-c-functions-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 입력값을 받아 반환값을 계산함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 입력값을 받아 반환값을 계산함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

같은 계산을 여러 곳에서 쓰려면 입력과 출력을 가진 함수로 분리해야 합니다. 처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.

## 시작 전에 확인할 것

바로 앞선 [Day 19](/learn/day-19-nested-loop)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 다음 흐름을 눈으로 확인하세요.

```text
인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

함수는 입력을 받아 결과를 돌려주는 작은 계산 도구입니다. `add(10, 20)`을 부르면 `a=10`, `b=20`이 되고 `return a + b`는 30을 **호출한 자리**로 보냅니다. `return`은 화면 출력이 아닙니다. 호출한 쪽에서 `printf`로 결과를 보여 줘야 합니다.

매개변수 `a`, `b`는 함수 안에서 쓰는 이름입니다. C에서 정수 인수를 넘기면 그 값이 복사되어 함수에 전달되므로 함수 안의 `a`를 바꿔도 호출자 변수 자체는 바뀌지 않습니다. 값을 받는 순서가 바뀌면 뺄셈 같은 함수에서는 결과도 바뀝니다.

## 문법을 예제로 보기

아래는 C 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```c
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}
```

예상 출력:

```text
5
```

이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `return a + b`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. main에서 add(2,3)을 호출합니다
2. 함수의 a=2,b=3으로 계산합니다
3. 반환 5를 printf가 출력합니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작     |
| ---: | ------------------ |
|    1 | 인수 2,3 전달      |
|    2 | a+b=5              |
|    3 | 호출 지점에 5 반환 |

마지막 상태에서 화면에 표시되는 결과는 `5`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 다른 예제로 다시 이해하기

`int twice(int x) { return x * 2; }`를 `printf("%d", twice(4));`에서 호출하면 `x=4`가 된 뒤 8이 호출한 자리로 돌아와 출력됩니다. 함수 안에 `printf`가 없는 데도 화면에 값이 나타난 이유는 **호출자가 출력했기 때문**입니다. `return`과 `printf`를 한 동작으로 착각하지 마세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 결과가 바뀌는지 예측하고, 같다면 왜 같은지 설명하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함.** 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **입력값을 받아 반환값을 계산함**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | int add(int a,int b)           |
| Python | def add(a,b): return a+b       |
| Rust   | fn add(a:i32,b:i32)->i32 {a+b} |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? 같은 계산을 여러 곳에서 쓰려면 입력과 출력을 가진 함수로 분리해야 합니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 예시의 출력은 `5`입니다. 오류를 찾을 때는 **함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
