---
schemaVersion: 1
contentVersion: 2026.10-f
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
    hint: INT_MAX는 양수에서 시작해 1 출력까지 순서대로 적어 보세요. limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    explanation:
      1. limits.h가 범위 매크로를 제공합니다. 2. INT_MAX가 0보다 큰지 비교합니다. 3. 참을 1로 출력합니다. `INT_MAX는 양수 → 비교 결과 참 → 1
      출력` 흐름으로 실제 출력 `1`이 됩니다. 핵심 `INT_MAX`는 비교의 왼쪽 값을 읽는 자리에 쓰입니다.
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
    hint: 필요한 표현은 정수 범위를 확인함 동작을 잇는 INT_MAX입니다.
    explanation:
      빈칸에 들어갈 표현은 'INT_MAX'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. limits.h가 범위 매크로를 제공합니다. 2. INT_MAX가 0보다 큰지
      비교합니다. 3. 참을 1로 출력합니다. `INT_MAX는 양수 → 비교 결과 참 → 1 출력` 흐름으로 실제 출력 `1`이 됩니다. 핵심 `INT_MAX`는 비교의 왼쪽 값을 읽는 자리에 쓰입니다.
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
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '1'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '1'입니다. 원본은 `1`, 수정본도 `1`이다. 첫 변경 줄 `printf("%d\n", INT_MAX > 0);`에서 `printf("%d\n", INT_MAX
      > 1);`로 비교 대상만 바꾸면, INT_MAX가 0보다도 1보다도 크므로 비교 결과는 그대로 참이다. 값이 실제로 달라진 것은 비교 대상뿐이고 최종 출력은 그대로이므로 중간 상태가 달라졌다고
      쓰지 않는다.
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
    hint:
      int 최대치에 1을 더해도 안전하게 감싼다고 단정함 상황에서 어긋나는 줄을 limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다. 설명과
      대조해 보세요.
    explanation:
      틀린 줄은 `printf("%d\n", INT_MIN > 0);`입니다. 왼쪽 피연산자가 음수 범위의 끝 INT_MIN이므로 `INT_MIN > 0` 비교는 거짓이 되어 `0`이
      출력됩니다. 오류 분류는 잘못된 출력입니다. 비교 결과가 뒤집히는 첫 순간은 왼쪽 값을 바꾼 비교식입니다. 고친 줄 `printf("%d\n", INT_MAX > 0);`에서는 양수 끝값과 0을
      비교하는 `정수 범위를 확인함` 동작이 지켜집니다. `INT_MAX + 1`을 실제로 계산해서 범위를 시험하지 마세요. 부호 있는 정수 오버플로는 정의되지 않은 동작이므로, 검사는 더하기 전에
      `value > INT_MAX - delta`처럼 수행합니다. 정상 코드는 매크로 제공→양수 비교→참 출력의 3단계를 따라 `1`을 출력합니다.
    commonMistakes:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-10-integer-types-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 C 정수 타입과 범위 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 정수 타입과 범위: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    printf(\"%d\\n\", INT_MAX > 0);\n    return\
      \ 0;\n}"
    hint:
      최대값 검사는 더하기 전에 `value > INT_MAX - delta`처럼 수행하세요. `INT_MAX + 1`을 직접 계산하는 시험은 금지입니다. 예상 출력과 경계 조건도 함께 적어
      보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 최대값 검사는 더하기 전에 `value > INT_MAX - delta`처럼 수행하세요. `INT_MAX + 1`을 직접 계산하는
      시험은 금지입니다. 같은 정수 범위를 확인함 동작을 구현하고 실행 결과 '1'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
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
    explanation:
      먼저 limits.h가 INT_MAX 매크로를 제공합니다. 이어서 INT_MAX가 0보다 큰지 비교하면 참이 되고, C는 참을 정수 1로 출력하므로 최종 출력 `1`이 됩니다.
      `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 컴파일과 실행이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 printf가 실제로 호출되기 때문입니다. 다른 선택지는
      이 추적과 맞지 않습니다.
  - id: quiz-day-10-integer-types-model
    question: "'C 정수 타입과 범위' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.
    answerIndex: 2
    explanation:
      limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현한다는 뜻이고, 양수 비교는 참이면 1이라는 뜻은 C가 참·거짓을 1·0으로 출력한다는 뜻입니다. `int
      최대치에 1을 더해도 안전하게 감싼다고 단정함`은 반대 사례인데, 부호 있는 오버플로는 정의되지 않은 동작이라 감쌈을 약속할 수 없기 때문입니다.
  - id: quiz-day-10-integer-types-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - int 최대치에 1을 더해도 안전하게 감싼다고 단정함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `int 최대치에 1을 더해도 안전하게 감싼다고 단정함`입니다. 잘못된 코드는 실행은 되지만 `0`이라는 잘못된 출력을 냅니다. 비교식의 두 피연산자가 무엇인지
      먼저 확인하세요.
  - id: quiz-day-10-integer-types-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 정수 범위를 확인함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `정수 범위를 확인함`이라는 의미와 입력·출력 계약입니다. Python과 Rust에서는 정수 범위를 타입과 검사로 다루므로, 실행 결과
      `1`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

C의 정수는 무한히 큰 수가 아니므로 범위를 확인하지 않으면 오버플로로 오류가 생깁니다. Day 10 "`C 정수 타입과 범위`"에서는 C 코드의 실행 결과(`1`)를 따라가며, `정수 범위를 확인함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`int 최대치에 1을 더해도 안전하게 감싼다고 단정함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 09](/learn/day-09-formatted-output)에서 배운 "소수점 형식과 출력" 내용을 한 문장으로 말해 보세요. 이번 "`C 정수 타입과 범위`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `INT_MAX`입니다.

## 머릿속 그림

limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다. Day 10에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `INT_MAX`입니다.

```text
INT_MAX는 양수  →  비교 결과 참  →  1 출력
```

위 흐름에서 `INT_MAX` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `1`입니다.

## 천천히 풀어보기

`INT_MAX`는 C가 현재 실행 환경의 `int`에 허용하는 가장 큰 정수입니다. `limits.h`에 정의된 이 값을 숫자로 외우기보다 '이 컴퓨터에서 `int`의 끝'이라고 이해하세요. 정수 타입은 저장할 수 있는 값의 범위가 있고, 그 범위 밖 연산은 특히 부호 있는 정수에서 문제가 됩니다.

`INT_MAX + 1`로 다음 숫자를 시험하지 마세요. C에서 부호 있는 정수 오버플로는 정의되지 않은 동작입니다. 범위를 검사해야 한다면 더하기 **전에** `value > INT_MAX - delta`인지 확인합니다. 화면에 `1`이 보이면 비교식이 참이어서 C가 참을 정수 1로 출력한 것입니다.

`INT_MAX`는 C가 현재 실행 환경의 `int`에 허용하는 가장 큰 정수입니다. `limits.h`에 정의된 이 값을 숫자로 외우기보다 이 컴퓨터에서 `int`의 끝이라고 이해하세요. 정수 타입은 저장할 수 있는 값의 범위가 있고, 그 범위 밖 연산은 특히 부호 있는 정수에서 문제가 됩니다.

`INT_MAX + 1`로 다음 숫자를 시험하지 마세요. C에서 부호 있는 정수 오버플로는 정의되지 않은 동작입니다. 범위를 검사해야 한다면 더하기 전에 `value > INT_MAX - delta`인지 확인합니다. 화면에 `1`이 보이면 비교식이 참이어서 C가 참을 정수 1로 출력한 것입니다.

## 문법을 예제로 보기

아래 C 코드는 Day 10 "`C 정수 타입과 범위`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `INT_MAX`이며, 실행 결과는 `1`입니다.

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

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `1`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `INT_MAX`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

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

`INT_MAX` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | INT_MAX는 양수 |
|    2 | 비교 결과 참   |
|    3 | 1 출력         |

위 순서대로 실행한 최종 출력은 `1`입니다. `INT_MAX는 양수` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`if (value > INT_MAX - extra)`는 `value + extra`를 실제로 수행하기 **전에** 범위를 확인합니다(두 수가 0 이상인 경우). 예를 들어 최대 허용값이 100이라고 가정하면 98에 3을 더하려 할 때 `98 > 100-3`이 참이라 거부합니다. 이 작은 수 모형을 이해한 다음 실제 `INT_MAX`에도 같은 판단을 적용하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `1`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```c
#include <stdio.h>
#include <limits.h>
int main(void) {
    printf("%d\n", INT_MAX > 1);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
1
```

원본은 `1`, 수정본도 `1`이다. 첫 변경 줄 `printf("%d\n", INT_MAX > 0);`에서 `printf("%d\n", INT_MAX > 1);`로 비교 대상만 바꾸면, INT_MAX가 0보다도 1보다도 크므로 비교 결과는 그대로 참이다. 값이 실제로 달라진 것은 비교 대상뿐이고 최종 출력은 그대로이므로 중간 상태가 달라졌다고 쓰지 않는다.

## 자주 틀리는 지점

**확인할 실수: int 최대치에 1을 더해도 안전하게 감싼다고 단정함.** 정상 코드의 실행 결과는 `1`입니다.

- 정상 줄: `printf("%d\n", INT_MAX > 0);`
- 잘못된 줄: `printf("%d\n", INT_MIN > 0);`

두 줄을 나란히 놓으면 정상 줄 `printf("%d\n", INT_MAX > 0);`이 `limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다.` 설명과 맞고, 잘못된 줄은 `int 최대치에 1을 더해도 안전하게 감싼다고 단정함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `INT_MAX는 양수`부터 `1`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `정수 범위를 확인함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | INT_MAX 확인 후 덧셈 전 경계 검사 |
| Python | int는 필요에 따라 자릿수가 커짐   |
| Rust   | i32::MAX와 checked_add 사용       |

C17에서는 `INT_MAX 확인 후 덧셈 전 경계 검사` 규칙을 적용합니다. "`C 정수 타입과 범위`" 수업의 실행 결과(`1`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `int는 필요에 따라 자릿수가 커짐` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `i32::MAX와 checked_add 사용` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`1` 맞히기) → 빈칸(`INT_MAX` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`int 최대치에 1을 더해도 안전하게 감싼다고 단정함` 찾기) → 독립 구현(`'C 정수 타입과 범위' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `1` 및 `INT_MAX` 설명과 대조하세요.

## 스스로 설명하기

- "`C 정수 타입과 범위`" 수업이 필요한 이유는 `정수 범위를 확인함` 동작으로 설명해 보세요.
- 예제에서 `INT_MAX` 부분 실행 직전의 상태와 직후의 출력(`1`)을 말해 보세요.
- "`int 최대치에 1을 더해도 안전하게 감싼다고 단정함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `정수 범위를 확인함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

limits.h의 INT_MAX는 현재 플랫폼의 int 최댓값을 표현합니다. 양수 비교는 참이면 1입니다. Day 10 "`C 정수 타입과 범위`" 예제의 핵심 부분은 `INT_MAX`이며, 실행 결과는 `1`입니다. "`int 최대치에 1을 더해도 안전하게 감싼다고 단정함`" 여부를 확인하고 Day 10 수업을 완료하세요.
