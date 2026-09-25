---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-88-c-aggregation
courseId: crp-92
phaseId: phase-08
dayNumber: 88
date: "2026-12-27"
title: C 레코드 집계와 경계 검사
summary: C 구현에서도 공통 fixture의 전체 공부 시간과 필터별 시간을 정확히 맞춰야 합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: advanced
estimatedMinutes: 90
prerequisites:
  - day-87-c-csv-parse
learningObjectives:
  - "'C 레코드 집계와 경계 검사' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - c aggregation
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
  - id: ex-day-88-c-aggregation-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 0에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    answer: "60"
    hint: 현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.
    explanation: 0  →  30  →  50  →  60. 따라서 출력은 '60'입니다.
    commonMistakes:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-88-c-aggregation-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'C 레코드 집계와 경계 검사' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: i < 3"
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; _____; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    hint: total=0입니다
    explanation: 빈칸에 들어갈 표현은 'i < 3'입니다. total=0입니다 30,20,10을 순서대로 누적합니다 합계 60을 출력합니다
    commonMistakes:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-88-c-aggregation-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 30에서 31로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {31, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 30에서 31로."
    explanation:
      바꾼 뒤 출력은 '61'입니다. 원본 출력 '60'에서 달라졌습니다. 다른 줄(int minutes[] = {30, 20, 10}; → int minutes[] = {31,
      20, 10};)에서 시작한 차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-88-c-aggregation-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i <= 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    hint: 현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. total=0입니다 30,20,10을 순서대로 누적합니다 합계 60을 출력합니다
    commonMistakes:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-88-c-aggregation-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 레코드 집계와 경계 검사' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 레코드 집계와 경계 검사: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes[] = {30, 20, 10};\n    int total = 0;\n    for\
      \ (int i = 0; i < 3; i++) total += minutes[i];\n    printf(\"%d\\n\", total);\n    return 0;\n}"
    hint: 현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 total=0입니다 30,20,10을 순서대로 누적합니다 합계 60을 출력합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-88-c-aggregation-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "60"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: 0  →  30  →  50  →  60 순서로 실행되어 출력은 '60'입니다.
  - id: quiz-day-88-c-aggregation-model
    question: "'C 레코드 집계와 경계 검사' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.
    answerIndex: 2
    explanation: 현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.
  - id: quiz-day-88-c-aggregation-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-88-c-aggregation-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 레코드 시간 합계 누적라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 레코드 시간 합계 누적라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

C 구현에서도 공통 fixture의 전체 공부 시간과 필터별 시간을 정확히 맞춰야 합니다. Day 88 "`C 레코드 집계와 경계 검사`"에서는 C 코드의 실행 결과(`60`)를 따라가며, `레코드 시간 합계 누적` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 87](/learn/day-87-c-csv-parse)에서 배운 "C 입력 검증과 정수 변환" 내용을 한 문장으로 말해 보세요. 이번 "`C 레코드 집계와 경계 검사`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `i < 3`입니다.

## 머릿속 그림

현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다. Day 88에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `i < 3`입니다.

```text
0  →  30  →  50  →  60
```

위 흐름에서 `i < 3` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

C에서 길이 3의 레코드 배열을 더한다면 유효한 인덱스는 0,1,2입니다. `total=0`에서 시작해 각 항목의 minutes를 한 번씩 더하면 10→30→60처럼 중간 상태를 적을 수 있습니다. `i < 3`을 `i <= 3`으로 바꾸면 범위 밖 네 번째 원소를 읽는 잘못된 접근입니다.

입력 레코드 수를 실제 길이와 함께 함수에 전달하고 유효한 값인지 확인하세요. 잘못된 분을 건너뛸지 오류로 종료할지는 프로젝트의 공통 계약에 맞춰야 합니다. 포인터와 길이 두 정보를 항상 함께 보세요.

## 문법을 예제로 보기

아래 C 코드는 Day 88 "`C 레코드 집계와 경계 검사`"의 독립 예제입니다. 전체 8줄 가운데 핵심 부분은 `i < 3`이며, 실행 결과는 `60`입니다.

```c
#include <stdio.h>
int main(void) {
    int minutes[] = {30, 20, 10};
    int total = 0;
    for (int i = 0; i < 3; i++) total += minutes[i];
    printf("%d\n", total);
    return 0;
}
```

예상 출력:

```text
60
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `60`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `i < 3`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     int minutes[] = {30, 20, 10};
 4 |     int total = 0;
 5 |     for (int i = 0; i < 3; i++) total += minutes[i];
 6 |     printf("%d\n", total);
 7 |     return 0;
 8 | }
```

1. total=0입니다
2. 30,20,10을 순서대로 누적합니다
3. 합계 60을 출력합니다

`i < 3` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 0              |
|    2 | 30             |
|    3 | 50             |
|    4 | 60             |

위 순서대로 실행한 최종 출력은 `60`입니다. `0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

길이 3 배열 `[10,20,30]`을 더할 때 `i=0` 뒤 합계 10, `i=1` 뒤 30, `i=2` 뒤 60입니다. `i=3`에서는 `i<3`이 거짓이므로 끝납니다. `i<=3`으로 바꾼 코드는 합계 60 뒤에 없는 원소를 더하려 하므로 검사할 값을 예측하기보다 **범위 밖 접근을 바로 고쳐야** 합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `60`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
int main(void) {
    int minutes[] = {31, 20, 10};
    int total = 0;
    for (int i = 0; i < 3; i++) total += minutes[i];
    printf("%d\n", total);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
61
```

원본과 달라졌습니다. 원본 출력은 `60`입니다. 다른 줄(`int minutes[] = {30, 20, 10};` → `int minutes[] = {31, 20, 10};`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`0` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음.** 정상 코드의 실행 결과는 `60`입니다.

- 정상 줄: `for (int i = 0; i < 3; i++) total += minutes[i];`
- 잘못된 줄: `for (int i = 0; i <= 3; i++) total += minutes[i];`

두 줄을 나란히 놓고 `현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `0`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `레코드 시간 합계 누적`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙          |
| ------ | ----------------------------------- |
| C17    | 정수 overflow 검사와 입력 배열 길이 |
| Python | sum(row.minutes for row in rows)    |
| Rust   | checked_add로 합계 overflow 처리    |

C17에서는 `정수 overflow 검사와 입력 배열 길이` 규칙을 적용합니다. "`C 레코드 집계와 경계 검사`" 수업의 실행 결과(`60`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `sum(row.minutes for row in rows)` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `checked_add로 합계 overflow 처리` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`i < 3` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음` 찾기) → 독립 구현(`'C 레코드 집계와 경계 검사' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `i < 3` 설명과 대조하세요.

## 스스로 설명하기

- "`C 레코드 집계와 경계 검사`" 수업이 필요한 이유는 `레코드 시간 합계 누적` 동작으로 설명해 보세요.
- 예제에서 `i < 3` 부분 실행 직전의 상태와 직후의 출력(`60`)을 말해 보세요.
- "`배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `레코드 시간 합계 누적` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

현재 합계 total에 각 유효 인덱스의 값을 한 번씩 더합니다. 마지막 유효 인덱스는 2입니다. Day 88 "`C 레코드 집계와 경계 검사`" 예제의 핵심 부분은 `i < 3`이며, 실행 결과는 `60`입니다. "`배열 길이와 인덱스의 경계를 혼동해 원소를 하나 더 읽음`" 여부를 확인하고 Day 88 수업을 완료하세요.

## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 C 레코드 집계와 경계 검사의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
