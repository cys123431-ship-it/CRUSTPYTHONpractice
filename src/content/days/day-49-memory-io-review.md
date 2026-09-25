---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-49-memory-io-review
courseId: crp-92
phaseId: phase-05
dayNumber: 49
date: "2026-11-18"
title: 메모리와 입출력 회상
summary: 값·주소·입출력 세 단계를 다시 추적해 포인터가 가리키는 값을 말로 설명합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 50
prerequisites:
  - day-48-rust-reader
learningObjectives:
  - "'메모리와 입출력 회상' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - memory io review
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
  - id: ex-day-49-memory-io-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? minutes=30에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    answer: "30"
    hint: view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.
    explanation: minutes=30  →  view=&minutes  →  *view=30. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-49-memory-io-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 메모리와 입출력 회상의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: *view"
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int _____ = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    hint: minutes에 30을 저장합니다
    explanation: 빈칸에는 '*view'이 들어갑니다. minutes에 30을 저장합니다 view에 &minutes를 담습니다 *view를 읽어 30을 출력합니다
    commonMistakes:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-49-memory-io-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 31;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 30에서 31로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도
      입력·조건·중간 상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-49-memory-io-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    hint: view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. minutes에 30을 저장합니다 view에 &minutes를 담습니다 *view를 읽어 30을 출력합니다
    commonMistakes:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-49-memory-io-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '메모리와 입출력 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 메모리와 입출력 회상: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int minutes = 30;\n    int *view = &minutes;\n    printf(\"\
      %d\\n\", *view);\n    return 0;\n}"
    hint: view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 minutes에 30을 저장합니다 view에 &minutes를 담습니다 *view를 읽어 30을 출력합니다 다른 코드도 결과와 근거가
      맞으면 가능합니다.
    commonMistakes:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-49-memory-io-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "30"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: minutes=30  →  view=&minutes  →  *view=30 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-49-memory-io-review-model
    question: 메모리와 입출력 회상을 이해하는 데 맞는 설명은?
    choices:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.
    answerIndex: 2
    explanation: view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.
  - id: quiz-day-49-memory-io-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-49-memory-io-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 주소를 통해 저장된 값 읽기라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 주소를 통해 저장된 값 읽기라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

값·주소·입출력 세 단계를 다시 추적해 포인터가 가리키는 값을 말로 설명합니다. Day 49 "`메모리와 입출력 회상`"에서는 C 코드의 실행 결과(`30`)를 따라가며, `주소를 통해 저장된 값 읽기` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 48](/learn/day-48-rust-reader)에서 배운 "Rust 읽기와 Result" 내용을 한 문장으로 말해 보세요. 이번 "`메모리와 입출력 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `*view`입니다.

## 머릿속 그림

view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다. Day 49에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `*view`입니다.

```text
minutes=30  →  view=&minutes  →  *view=30
```

위 흐름에서 `*view` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

`int minutes = 30; int *view = &minutes;`에서 `minutes`는 값 30, `&minutes`는 그 값의 주소, `view`는 저장된 주소, `*view`는 그 주소에 있는 값 30입니다. `view`와 `*view`를 같은 종류의 값으로 읽지 마세요.

`*view = 31`을 실행하면 `minutes`도 31이 됩니다. `free`한 공간의 주소나 범위 밖 원소를 가리킬 때는 같은 문법이라도 안전하게 읽을 수 없습니다. 출력만 외우지 말고 포인터가 가리키는 원본의 유효성을 먼저 확인하세요.

## 문법을 예제로 보기

아래 C 코드는 Day 49 "`메모리와 입출력 회상`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `*view`이며, 실행 결과는 `30`입니다.

```c
#include <stdio.h>
int main(void) {
    int minutes = 30;
    int *view = &minutes;
    printf("%d\n", *view);
    return 0;
}
```

예상 출력:

```text
30
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `*view`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     int minutes = 30;
 4 |     int *view = &minutes;
 5 |     printf("%d\n", *view);
 6 |     return 0;
 7 | }
```

1. minutes에 30을 저장합니다
2. view에 &minutes를 담습니다
3. *view를 읽어 30을 출력합니다

`*view` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | minutes=30     |
|    2 | view=&minutes  |
|    3 | *view=30       |

위 순서대로 실행한 최종 출력은 `30`입니다. `minutes=30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`int n=30; int *view=&n; *view=31;`의 마지막에서 `n`을 출력하면 31입니다. 주소 저장 `view=&n`이 n의 값을 복사한 것은 아닙니다. 같은 저장 칸을 다른 경로로 읽고 쓰는 것이므로 `view`와 `*view`의 역할을 각각 적으세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
int main(void) {
    int minutes = 31;
    int *view = &minutes;
    printf("%d\n", *view);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
31
```

원본(`30`)과 달라졌습니다. 다른 줄(`int minutes = 30;` → `int minutes = 31;`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`minutes=30` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `int *view = &minutes;`
- 잘못된 줄: `int view = &minutes;`

두 줄을 나란히 놓고 `view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `minutes=30`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `주소를 통해 저장된 값 읽기`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙            |
| ------ | ------------------------------------- |
| C17    | &로 주소, *로 역참조                  |
| Python | 이름이 객체를 참조하며 주소 문법 숨김 |
| Rust   | &로 빌림, *로 역참조 가능             |

C17에서는 `&로 주소, *로 역참조` 규칙을 적용합니다. "`메모리와 입출력 회상`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `이름이 객체를 참조하며 주소 문법 숨김` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `&로 빌림, *로 역참조 가능` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`*view` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함` 찾기) → 독립 구현(`메모리와 입출력 회상을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `*view` 설명과 대조하세요.

## 스스로 설명하기

- "`메모리와 입출력 회상`" 수업이 필요한 이유는 `주소를 통해 저장된 값 읽기` 동작으로 설명해 보세요.
- 예제에서 `*view` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `주소를 통해 저장된 값 읽기` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

view의 값은 minutes의 주소이고 *view의 값은 그 주소에 저장된 정수 30입니다. Day 49 "`메모리와 입출력 회상`" 예제의 핵심 부분은 `*view`이며, 실행 결과는 `30`입니다. "`포인터 값(주소)과 역참조 결과(정수)를 같은 타입으로 혼동함`" 여부를 확인하고 Day 49 수업을 완료하세요.
