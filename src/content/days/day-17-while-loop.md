---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-17-while-loop
courseId: crp-92
phaseId: phase-02
dayNumber: 17
date: "2026-10-17"
title: while과 종료 조건
summary: 횟수를 미리 정하기 어려운 상황에서도 종료 조건을 유지하며 반복해야 합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-16-for-loop
learningObjectives:
  - "'while과 종료 조건' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: n을 줄이지 않아 무한 루프가 됨."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - while loop
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
  - id: ex-day-17-while-loop-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? n=3에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    answer: "3 2 1 "
    hint: 매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.
    explanation: n=3  →  2  →  1  →  0 종료. 따라서 출력은 '3 2 1 '입니다.
    commonMistakes:
      - n을 줄이지 않아 무한 루프가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-17-while-loop-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: while과 종료 조건의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: n--"
    starter:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); _____;\
      \ }\n    puts(\"\");\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    hint: n=3이고 조건이 참입니다
    explanation: 빈칸에는 'n--'이 들어갑니다. n=3이고 조건이 참입니다 3·2·1을 출력할 때마다 n을 줄입니다 n=0에서 종료합니다
    commonMistakes:
      - n을 줄이지 않아 무한 루프가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-17-while-loop-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 3에서 4로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int n = 4;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    hint: 처음 등장하는 숫자를 3에서 4로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 3에서 4로 바꿨습니다. 원래 출력은 '3 2 1 '입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - n을 줄이지 않아 무한 루프가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-17-while-loop-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 n을 줄이지 않아 무한 루프가 됨 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n++; }\n\
      \    puts(\"\");\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    hint: 매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. n=3이고 조건이 참입니다 3·2·1을 출력할 때마다 n을 줄입니다 n=0에서 종료합니다
    commonMistakes:
      - n을 줄이지 않아 무한 루프가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-17-while-loop-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'while과 종료 조건' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// while과 종료 조건: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int n = 3;\n    while (n > 0) { printf(\"%d \", n); n--; }\n\
      \    puts(\"\");\n    return 0;\n}"
    hint: 매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 n=3이고 조건이 참입니다 3·2·1을 출력할 때마다 n을 줄입니다 n=0에서 종료합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - n을 줄이지 않아 무한 루프가 됨
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-17-while-loop-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "3 2 1 "
    answerIndex: 2
    explanation: n=3  →  2  →  1  →  0 종료 순서로 실행되어 '3 2 1 '을 출력합니다.
  - id: quiz-day-17-while-loop-model
    question: while과 종료 조건을 이해하는 데 맞는 설명은?
    choices:
      - 매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.
      - n을 줄이지 않아 무한 루프가 됨(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.
  - id: quiz-day-17-while-loop-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - n을 줄이지 않아 무한 루프가 됨
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: n을 줄이지 않아 무한 루프가 됨. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-17-while-loop-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 상태를 종료 조건 쪽으로 갱신함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 상태를 종료 조건 쪽으로 갱신함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

횟수를 미리 정하기 어려운 상황에서도 종료 조건을 유지하며 반복해야 합니다. Day 17 "`while과 종료 조건`"에서는 C 코드가 `3 2 1 `을(를) 만드는 과정을 따라가며, 상태를 종료 조건 쪽으로 갱신함 동작이 왜 필요한지 확인합니다. 상태를 종료 조건 쪽으로 갱신함을(를) 빠뜨리면 `n을 줄이지 않아 무한 루프가 됨` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 16](/learn/day-16-for-loop)에서는 "범위 반복과 누적"을(를) 배웠습니다. "범위 반복과 누적"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`while과 종료 조건`"에서 새로 달라지는 조건을 찾아보세요. Day 17의 답은 `3 2 1 `이며, 핵심 표현은 `n--`입니다.

## 머릿속 그림

매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다. Day 17에서는 아래 흐름 순서대로 상태가 바뀌며, `n--`이(가) 결과를 가릅니다.

```text
n=3  →  2  →  1  →  0 종료
```

위 흐름에서 `n--`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3 2 1 `입니다.

## 천천히 풀어보기

`while (n > 0)`은 조건이 참인 동안 반복합니다. `n--`는 현재 `n`을 1 줄여 언젠가 0으로 만드는 역할입니다. 3부터 시작하면 본문 실행 때 n이 3, 2, 1로 바뀌고 0이 되면 다음 검사에서 멈춥니다.

`n--`를 빼면 조건이 계속 참이어서 끝나지 않을 수 있습니다. 반대로 `n`이 처음부터 0이면 본문은 한 번도 실행되지 않습니다. 반복을 읽을 때 '무엇을 반복하는가', '어떤 값이 바뀌는가', '왜 반드시 끝나는가'를 각각 답하세요.

## 문법을 예제로 보기

아래 C 코드는 Day 17 "`while과 종료 조건`"의 독립 예제입니다. 전체 7줄에서 `n--`이(가) 핵심이며, 실행 결과는 `3 2 1 `입니다.

```c
#include <stdio.h>
int main(void) {
    int n = 3;
    while (n > 0) { printf("%d ", n); n--; }
    puts("");
    return 0;
}
```

예상 출력:

```text
3 2 1
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 `3 2 1 `이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `n--`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     int n = 3;
 4 |     while (n > 0) { printf("%d ", n); n--; }
 5 |     puts("");
 6 |     return 0;
 7 | }
```

1. n=3이고 조건이 참입니다
2. 3·2·1을 출력할 때마다 n을 줄입니다
3. n=0에서 종료합니다

위 단계에서 `n--`이(가) 빠지면 `3 2 1 `이(가) 나오지 않습니다. `처음 등장하는 숫자를 3에서 4로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | n=3            |
|    2 | 2              |
|    3 | 1              |
|    4 | 0 종료         |

위 순서대로 실행하면 최종 출력 `3 2 1 `이(가) 됩니다. `n=3` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`n=1`에서 `while(n>0)` 본문은 한 번 실행되고 `n--` 후 0이 됩니다. 다음 조건 검사에서 거짓이라 끝납니다. 처음부터 `n=0`이면 본문은 0번 실행됩니다. n을 1 줄이는 줄을 지우면 1이 영원히 그대로여서 멈추지 않는다는 점이 종료 조건의 핵심입니다.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 3에서 4로` 바꾸면 아래와 같이 됩니다.

```c
#include <stdio.h>
int main(void) {
    int n = 4;
    while (n > 0) { printf("%d ", n); n--; }
    puts("");
    return 0;
}
```

원본 출력은 `3 2 1 `입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `n--`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 17의 `while과 종료 조건`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: n을 줄이지 않아 무한 루프가 됨.** 정상 코드에서는 `3 2 1 `이(가) 출력됩니다.

- 정상 줄: `while (n > 0) { printf("%d ", n); n--; }`
- 잘못된 줄: `while (n > 0) { printf("%d ", n); n++; }`

두 줄을 나란히 놓고 `매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `n=3`부터 `3 2 1 `까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **상태를 종료 조건 쪽으로 갱신함**은(는) 세 언어에서 같은 입력과 출력(`3 2 1 `)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙 |
| ------ | -------------------------- |
| C17    | while (n > 0) { n--; }     |
| Python | while n > 0: n -= 1        |
| Rust   | while n > 0 { n -= 1; }    |

C17에서는 `while (n > 0) { n--; }` 규칙으로 "`while과 종료 조건`"의 `3 2 1 `을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `while n > 0: n -= 1` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `while n > 0 { n -= 1; }` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`3 2 1 ` 맞히기) → 빈칸(`n--` 채우기) → 변경(`처음 등장하는 숫자를 3에서 4로`) → 오류 수정(`n을 줄이지 않아 무한 루프가 됨` 찾기) → 독립 구현(`while과 종료 조건을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3 2 1 ` 및 `n--` 설명과 대조하세요.

## 스스로 설명하기

- "`while과 종료 조건`"이(가) 필요한 상황을 `상태를 종료 조건 쪽으로 갱신함` 동작으로 설명해 보세요.
- 예제에서 `n--`이(가) 실행되기 직전의 상태와 직후의 출력 `3 2 1 `을(를) 말해 보세요.
- "`n을 줄이지 않아 무한 루프가 됨`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `상태를 종료 조건 쪽으로 갱신함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

매 반복마다 n이 1씩 줄어 0에 가까워집니다. 0이 되면 조건이 거짓이라 멈춥니다. Day 17 "`while과 종료 조건`"의 예제는 `n--`을(를) 실행해 `3 2 1 `을(를) 출력합니다. "`n을 줄이지 않아 무한 루프가 됨`" 여부를 확인하고 Day 17을(를) 완료하세요.
