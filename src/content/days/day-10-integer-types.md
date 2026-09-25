---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-10-integer-types
courseId: crp-92
phaseId: phase-01
dayNumber: 10
date: "2026-10-10"
title: C 정수 타입과 범위
summary: C의 정수는 무한히 큰 수가 아니므로 범위를 확인하지 않으면 오버플로로 오류가 생깁니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-09-formatted-output
learningObjectives:
  - "'C 정수 타입과 범위' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: int 최대치에 1을 더해도 안전하게 감싼다고 단정함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - integer types
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
  - id: ex-day-10-integer-types-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? INT_MAX는 양수에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n   \
      \ return 0;\n}"
    answer: "1"
    hint: limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    explanation: INT_MAX는 양수  →  비교 결과 참  →  1 출력. 따라서 출력은 '1'입니다.
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-10-integer-types-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 정수 타입과 범위의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: INT_MAX"
    starter:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", _____ > 0);\n    return\
      \ 0;\n}"
    answer:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n    return\
      \ 0;\n}"
    hint: limits.h가 범위 매크로를 제공합니다
    explanation: 빈칸에는 'INT_MAX'이 들어갑니다. limits.h가 범위 매크로를 제공합니다 INT_MAX가 0보다 큰지 비교합니다 참을 1로 출력합니다
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-10-integer-types-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n   \
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 1);\n    return\
      \ 0;\n}"
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '1'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-10-integer-types-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 int 최대치에 1을 더해도 안전하게 감싼다고 단정함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MIN > 0);\n   \
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n    return\
      \ 0;\n}"
    hint: limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. limits.h가 범위 매크로를 제공합니다 INT_MAX가 0보다 큰지 비교합니다 참을 1로 출력합니다
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-10-integer-types-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 정수 타입과 범위' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 정수 타입과 범위: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n    return\
      \ 0;\n}"
    hint: limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 limits.h가 범위 매크로를 제공합니다 INT_MAX가 0보다 큰지 비교합니다 참을 1로 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-10-integer-types-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "1"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: INT_MAX는 양수  →  비교 결과 참  →  1 출력 순서로 실행되어 '1'을 출력합니다.
  - id: quiz-day-10-integer-types-model
    question: C 정수 타입과 범위을 이해하는 데 맞는 설명은?
    choices:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    answerIndex: 2
    explanation: limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
  - id: quiz-day-10-integer-types-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: int 최대치에 1을 더해도 안전하게 감싼다고 단정함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-10-integer-types-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 정수 범위를 확인함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 정수 범위를 확인함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

C의 정수는 무한히 큰 수가 아니므로 범위를 확인하지 않으면 오버플로로 오류가 생깁니다. Day 10 "`C 정수 타입과 범위`"에서는 C 코드가 `1`을(를) 만드는 과정을 따라가며, 정수 범위를 확인함 동작이 왜 필요한지 확인합니다. 정수 범위를 확인함을(를) 빠뜨리면 `int 최대치에 1을 더해도 안전하게 감싼다고 단정함` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 09](/learn/day-09-formatted-output)에서는 "소수점 형식과 출력"을(를) 배웠습니다. "소수점 형식과 출력"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`C 정수 타입과 범위`"에서 새로 달라지는 조건을 찾아보세요. Day 10의 답은 `1`이며, 핵심 표현은 `INT_MAX`입니다.

## 머릿속 그림

limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다. Day 10에서는 아래 흐름 순서대로 상태가 바뀌며, `INT_MAX`이(가) 결과를 가릅니다.

```text
INT_MAX는 양수  →  비교 결과 참  →  1 출력
```

위 흐름에서 `INT_MAX`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `1`입니다.

## 천천히 풀어보기

`INT_MAX`는 C가 현재 실행 환경의 `int`에 허용하는 가장 큰 정수입니다. `limits.h`에 정의된 이 값을 숫자로 외우기보다 '이 컴퓨터에서 `int`의 끝'이라고 이해하세요. 정수 타입은 저장할 수 있는 값의 범위가 있고, 그 범위 밖 연산은 특히 부호 있는 정수에서 문제가 됩니다.

`INT_MAX + 1`로 다음 숫자를 시험하지 마세요. C에서 부호 있는 정수 오버플로는 정의되지 않은 동작입니다. 범위를 검사해야 한다면 더하기 **전에** `value > INT_MAX - delta`인지 확인합니다. 화면에 `1`이 보이면 비교식이 참이어서 C가 참을 정수 1로 출력한 것입니다.

## 문법을 예제로 보기

아래 C 코드는 Day 10 "`C 정수 타입과 범위`"의 독립 예제입니다. 전체 6줄에서 `INT_MAX`이(가) 핵심이며, 실행 결과는 `1`입니다.

```c
#include <stdio.h>
#include <limits.h>
int main(void) {
    printf("%d\n", INT_MAX > 0);
    return 0;
}
```

예상 출력:

```text
1
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 `1`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `INT_MAX`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | #include <limits.h>
 3 | int main(void) {
 4 |     printf("%d\n", INT_MAX > 0);
 5 |     return 0;
 6 | }
```

1. limits.h가 범위 매크로를 제공합니다
2. INT_MAX가 0보다 큰지 비교합니다
3. 참을 1로 출력합니다

위 단계에서 `INT_MAX`이(가) 빠지면 `1`이(가) 나오지 않습니다. `처음 등장하는 숫자를 0에서 1로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | INT_MAX는 양수 |
|    2 | 비교 결과 참   |
|    3 | 1 출력         |

위 순서대로 실행하면 최종 출력 `1`이(가) 됩니다. `INT_MAX는 양수` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`if (value > INT_MAX - extra)`는 `value + extra`를 실제로 수행하기 **전에** 범위를 확인합니다(두 수가 0 이상인 경우). 예를 들어 최대 허용값이 100이라고 가정하면 98에 3을 더하려 할 때 `98 > 100-3`이 참이라 거부합니다. 이 작은 수 모형을 이해한 다음 실제 `INT_MAX`에도 같은 판단을 적용하세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 0에서 1로` 바꾸면 아래와 같이 됩니다.

```c
#include <stdio.h>
#include <limits.h>
int main(void) {
    printf("%d\n", INT_MAX > 1);
    return 0;
}
```

원본 출력은 `1`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `INT_MAX`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 10의 `C 정수 타입과 범위`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: int 최대치에 1을 더해도 안전하게 감싼다고 단정함.** 정상 코드에서는 `1`이(가) 출력됩니다.

- 정상 줄: `printf("%d\n", INT_MAX > 0);`
- 잘못된 줄: `printf("%d\n", INT_MIN > 0);`

두 줄을 나란히 놓고 `limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `INT_MAX는 양수`부터 `1`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **정수 범위를 확인함**은(는) 세 언어에서 같은 입력과 출력(`1`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | INT_MAX 확인 후 덧셈 전 경계 검사 |
| Python | int는 필요에 따라 자릿수가 커짐   |
| Rust   | i32::MAX와 checked_add 사용       |

C17에서는 `INT_MAX 확인 후 덧셈 전 경계 검사` 규칙으로 "`C 정수 타입과 범위`"의 `1`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `int는 필요에 따라 자릿수가 커짐` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `i32::MAX와 checked_add 사용` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`1` 맞히기) → 빈칸(`INT_MAX` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`int 최대치에 1을 더해도 안전하게 감싼다고 단정함` 찾기) → 독립 구현(`C 정수 타입과 범위을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `1` 및 `INT_MAX` 설명과 대조하세요.

## 스스로 설명하기

- "`C 정수 타입과 범위`"이(가) 필요한 상황을 `정수 범위를 확인함` 동작으로 설명해 보세요.
- 예제에서 `INT_MAX`이(가) 실행되기 직전의 상태와 직후의 출력 `1`을(를) 말해 보세요.
- "`int 최대치에 1을 더해도 안전하게 감싼다고 단정함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `정수 범위를 확인함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다. Day 10 "`C 정수 타입과 범위`"의 예제는 `INT_MAX`을(를) 실행해 `1`을(를) 출력합니다. "`int 최대치에 1을 더해도 안전하게 감싼다고 단정함`" 여부를 확인하고 Day 10을(를) 완료하세요.
