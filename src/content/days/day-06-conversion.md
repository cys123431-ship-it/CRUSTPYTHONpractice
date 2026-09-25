---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-06-conversion
courseId: crp-92
phaseId: phase-01
dayNumber: 6
date: "2026-10-06"
title: C 형변환과 나눗셈
summary: 정수 나눗셈으로 평균을 내면 소수 부분이 사라질 수 있어 계산 전에 타입을 골라야 합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-05-arithmetic
learningObjectives:
  - "'C 형변환과 나눗셈' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 정수끼리 먼저 나누고 결과만 double에 저장함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - conversion
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
  - id: ex-day-06-conversion-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? int 5에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = (double)total / 2;\n\
      \    printf(\"%.1f\\n\", average);\n    return 0;\n}"
    answer: "2.5"
    hint: 피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. 설명을 떠올리고 `int 5` 단계부터 순서대로 적어 보세요.
    explanation:
      int 5  →  double 5.0  →  5.0/2=2.5 순서로 실행됩니다. `(double)total` 부분이 `5.0/2=2.5` 단계를 확정해 최종 출력 '2.5'가
      됩니다. 이 흐름을 떠올리면 `나누기 전에 실수로 변환함` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 정수끼리 먼저 나누고 결과만 double에 저장함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-06-conversion-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'C 형변환과 나눗셈' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: (double)total"
    starter:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = _____ / 2;\n    printf(\"\
      %.1f\\n\", average);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = (double)total / 2;\n \
      \   printf(\"%.1f\\n\", average);\n    return 0;\n}"
    hint: 힌트 문장을 완전하게 읽으면 `total을 int 5로 시작합니다` 단계에 필요한 표현이 `(double)total`입니다.
    explanation:
      빈칸에 들어갈 표현은 '(double)total'입니다. `double average = (double)total / 2;` 줄을 완성해야 `나누기 전에 실수로 변환함` 동작이
      이어져 실행 결과 '2.5'가 됩니다. 힌트의 첫 단계 `total을 int 5로 시작합니다`이 바로 이 줄입니다. 이어서 캐스트 후 5.0/2.0을 계산합니다 %.1f로 소수 한 자리 2.5를
      출력합니다 순서로 진행됩니다.
    commonMistakes:
      - 정수끼리 먼저 나누고 결과만 double에 저장함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-06-conversion-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 5에서 6로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = (double)total / 2;\n\
      \    printf(\"%.1f\\n\", average);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int total = 6;\n    double average = (double)total / 2;\n \
      \   printf(\"%.1f\\n\", average);\n    return 0;\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 5에서 6로."
    explanation:
      바꾼 뒤 출력은 '3.0'입니다. 원본 출력 '2.5'에서 달라졌습니다. 바뀐 줄은 `int total = 5;`에서 `int total = 6;`로 바뀌었습니다. 바뀐 프로그램은
      `int 5` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 그 차이가 이후 단계로 이어져 최종 `3.0`가 됩니다. 원본 추적 `int 5  →  double 5.0  →  5.0/2=2.5`와
      바뀐 줄 이후를 순서대로 비교하면 처음 달라지는 곳이 보입니다.
    commonMistakes:
      - 정수끼리 먼저 나누고 결과만 double에 저장함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-06-conversion-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 정수끼리 먼저 나누고 결과만 double에 저장함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = total / 2;\n    printf(\"\
      %.1f\\n\", average);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = (double)total / 2;\n \
      \   printf(\"%.1f\\n\", average);\n    return 0;\n}"
    hint: 피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. 설명과 어긋나는 줄을 찾으세요. `정수끼리 먼저 나누고 결과만 double에 저장함` 상황이 단서가 됩니다.
    explanation:
      틀린 줄은 `double average = total / 2;`입니다. 여기서는 `total`을 써서 `(double)total` 동작이 깨집니다. 이대로 실행하면 `정수끼리
      먼저 나누고 결과만 double에 저장함` 문제가 생겨 원본 추적 `int 5  →  double 5.0  →  5.0/2=2.5`대로 '2.5'가 나오지 않습니다. 고친 줄 `double average
      = (double)total / 2;`에서는 `(double)total`가 `나누기 전에 실수로 변환함` 동작을 지켜 '2.5'까지 도달합니다.
    commonMistakes:
      - 정수끼리 먼저 나누고 결과만 double에 저장함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-06-conversion-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 형변환과 나눗셈' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 형변환과 나눗셈: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int total = 5;\n    double average = (double)total / 2;\n \
      \   printf(\"%.1f\\n\", average);\n    return 0;\n}"
    hint: 피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `(double)total` 부분이 `나누기 전에 실수로 변환함` 동작을 지켜 실행 결과 '2.5'가 됩니다. 같은 개념을 다른 입력으로
      바꿔도 `(double)total`부터 `5.0/2=2.5`까지 추적할 수 있으면 정답입니다. `정수끼리 먼저 나누고 결과만 double에 저장함` 상황과 빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 정수끼리 먼저 나누고 결과만 double에 저장함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-06-conversion-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "2.5"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation:
      int 5  →  double 5.0  →  5.0/2=2.5 순서로 실행되어 출력은 '2.5'입니다. `(double)total` 부분이 마지막 단계를 확정하므로 다른 선택지는
      이 추적과 맞지 않습니다.
  - id: quiz-day-06-conversion-model
    question: "'C 형변환과 나눗셈' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 정수끼리 먼저 나누고 결과만 double에 저장함(이것이 정상적인 사용법이다)
      - 피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. 이 설명이 맞는 이유는 `나누기 전에 실수로 변환함` 동작을 지키는 조건과 같기 때문입니다. `정수끼리
      먼저 나누고 결과만 double에 저장함` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-06-conversion-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 정수끼리 먼저 나누고 결과만 double에 저장함
    answerIndex: 2
    explanation:
      정수끼리 먼저 나누고 결과만 double에 저장함. 이 실수가 나오면 원본 추적 `int 5 → double 5.0 → 5.0/2=2.5`대로 '2.5'가 나오지 않으므로 먼저
      확인해야 합니다.
  - id: quiz-day-06-conversion-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 나누기 전에 실수로 변환함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 `나누기 전에 실수로 변환함` 목적과 입력·출력은 유지합니다. 실행 결과 '2.5'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

정수 나눗셈으로 평균을 내면 소수 부분이 사라질 수 있어 계산 전에 타입을 골라야 합니다. Day 06 "`C 형변환과 나눗셈`"에서는 C 코드의 실행 결과(`2.5`)를 따라가며, `나누기 전에 실수로 변환함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`정수끼리 먼저 나누고 결과만 double에 저장함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 05](/learn/day-05-arithmetic)에서 배운 "산술식과 연산 순서" 내용을 한 문장으로 말해 보세요. 이번 "`C 형변환과 나눗셈`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `(double)total`입니다.

## 머릿속 그림

피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. Day 06에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `(double)total`입니다.

```text
int 5  →  double 5.0  →  5.0/2=2.5
```

위 흐름에서 `(double)total` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `2.5`입니다.

## 천천히 풀어보기

C에서 `int total = 5`를 `2`로 나누면 정수끼리 계산하므로 `5 / 2`는 2입니다. 그 뒤에 `double average`에 저장해도 이미 잃어버린 0.5는 돌아오지 않습니다. `(double)total / 2`처럼 **나누기 전에** 한쪽을 실수로 바꾸면 `5.0 / 2.0`을 계산해 2.5를 얻습니다.

`(double)(total / 2)`는 괄호 속 정수 나눗셈이 먼저 일어나므로 2.0입니다. 이 두 식의 차이를 꼭 손으로 계산해 보세요. `%.1f`는 계산을 바꾸는 연산이 아니라 실수 출력 때 소수 첫째 자리까지 보여 주라는 형식입니다. 0으로 나누는 입력도 별도로 막아야 합니다.

## 문법을 예제로 보기

아래 C 코드는 Day 06 "`C 형변환과 나눗셈`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `(double)total`이며, 실행 결과는 `2.5`입니다.

```c
#include <stdio.h>
int main(void) {
    int total = 5;
    double average = (double)total / 2;
    printf("%.1f\n", average);
    return 0;
}
```

예상 출력:

```text
2.5
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `2.5`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `(double)total`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     int total = 5;
 4 |     double average = (double)total / 2;
 5 |     printf("%.1f\n", average);
 6 |     return 0;
 7 | }
```

1. total을 int 5로 시작합니다
2. 캐스트 후 5.0/2.0을 계산합니다
3. %.1f로 소수 한 자리 2.5를 출력합니다

`(double)total` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | int 5          |
|    2 | double 5.0     |
|    3 | 5.0/2=2.5      |

위 순서대로 실행한 최종 출력은 `2.5`입니다. `int 5` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`int a = 7, b = 2;`라면 `a / b`는 3, `(double)a / b`는 3.5, `(double)(a / b)`는 3.0입니다. 세 번째 식에서는 괄호 **안에서 이미 7/2를 정수로 계산**한 뒤 3을 실수로 바꿨습니다. 평균을 낼 때 어느 시점에 실수 타입이 되었는지 화살표로 표시하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `2.5`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
int main(void) {
    int total = 6;
    double average = (double)total / 2;
    printf("%.1f\n", average);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
3.0
```

원본 출력은 `2.5`이고, 바뀐 코드의 실행 결과는 `3.0`입니다. 바뀐 줄은 `int total = 5;`에서 `int total = 6;`로 바뀌었습니다. 바뀐 프로그램은 `int 5` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 `3.0`가 됩니다. 원본 추적 `int 5  →  double 5.0  →  5.0/2=2.5`에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다.

## 자주 틀리는 지점

**확인할 실수: 정수끼리 먼저 나누고 결과만 double에 저장함.** 정상 코드의 실행 결과는 `2.5`입니다.

- 정상 줄: `double average = (double)total / 2;`
- 잘못된 줄: `double average = total / 2;`

두 줄을 나란히 놓으면 정상 줄 `double average = (double)total / 2;`이 `피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다.` 설명과 맞고, 잘못된 줄은 `정수끼리 먼저 나누고 결과만 double에 저장함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `int 5`부터 `2.5`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `나누기 전에 실수로 변환함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | (double)total / count         |
| Python | total / count는 실수, //는 몫 |
| Rust   | total as f64 / count as f64   |

C17에서는 `(double)total / count` 규칙을 적용합니다. "`C 형변환과 나눗셈`" 수업의 실행 결과(`2.5`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `total / count는 실수, //는 몫` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `total as f64 / count as f64` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`2.5` 맞히기) → 빈칸(`(double)total` 채우기) → 변경(`처음 등장하는 숫자를 5에서 6로`) → 오류 수정(`정수끼리 먼저 나누고 결과만 double에 저장함` 찾기) → 독립 구현(`'C 형변환과 나눗셈' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `2.5` 및 `(double)total` 설명과 대조하세요.

## 스스로 설명하기

- "`C 형변환과 나눗셈`" 수업이 필요한 이유는 `나누기 전에 실수로 변환함` 동작으로 설명해 보세요.
- 예제에서 `(double)total` 부분 실행 직전의 상태와 직후의 출력(`2.5`)을 말해 보세요.
- "`정수끼리 먼저 나누고 결과만 double에 저장함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `나누기 전에 실수로 변환함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

피연산자 하나를 double로 바꾸면 나눗셈 전체가 실수 나눗셈이 됩니다. Day 06 "`C 형변환과 나눗셈`" 예제의 핵심 부분은 `(double)total`이며, 실행 결과는 `2.5`입니다. "`정수끼리 먼저 나누고 결과만 double에 저장함`" 여부를 확인하고 Day 06 수업을 완료하세요.
