---
schemaVersion: 1
contentVersion: 2026.10-e
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
    hint: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 설명을 떠올리고 `인수 2,3 전달` 단계부터 순서대로 적어 보세요.
    explanation:
      인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환 순서로 실행됩니다. `return a + b` 부분이 `호출 지점에 5 반환` 단계를 확정해 최종 출력 '5'가
      됩니다. 이 흐름을 떠올리면 `입력값을 받아 반환값을 계산함` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-20-c-functions-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'C 함수 매개변수와 반환값' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: return a + b"
    starter:
      "#include <stdio.h>\nint add(int a, int b) { _____; }\nint main(void) {\n    printf(\"%d\\n\", add(2,\
      \ 3));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(2, 3));\n    return 0;\n}"
    hint: 힌트 문장을 완전하게 읽으면 `main에서 add(2,3)을 호출합니다` 단계에 필요한 표현이 `return a + b`입니다.
    explanation:
      빈칸에 들어갈 표현은 'return a + b'입니다. `int add(int a, int b) { return a + b; }` 줄을 완성해야 `입력값을 받아 반환값을 계산함`
      동작이 이어져 실행 결과 '5'가 됩니다. 힌트의 첫 단계 `main에서 add(2,3)을 호출합니다`이 바로 이 줄입니다. 이어서 함수의 a=2,b=3으로 계산합니다 반환 5를 printf가
      출력합니다 순서로 진행됩니다.
    commonMistakes:
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-20-c-functions-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 2에서 3로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\"\
      , add(2, 3));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    printf(\"%d\\n\",\
      \ add(3, 3));\n    return 0;\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 2에서 3로."
    explanation:
      바꾼 뒤 출력은 '6'입니다. 원본 출력 '5'에서 달라졌습니다. 바뀐 줄은 `printf("%d\n", add(2, 3));`에서 `printf("%d\n", add(3,
      3));`로 바뀌었습니다. 바뀐 프로그램은 `인수 2,3 전달` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 그 차이가 이후 단계로 이어져 최종 `6`가 됩니다. 원본 추적 `인수 2,3
      전달  →  a+b=5  →  호출 지점에 5 반환`와 바뀐 줄 이후를 순서대로 비교하면 처음 달라지는 곳이 보입니다.
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
    hint:
      매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 설명과 어긋나는 줄을 찾으세요. `함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함`
      상황이 단서가 됩니다.
    explanation:
      틀린 줄은 `int add(int a, int b) { return a - b; }`입니다. 여기서는 `return a - b`을 써서 `return a + b` 동작이 깨집니다.
      이대로 실행하면 `함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함` 문제가 생겨 원본 추적 `인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환`대로 '5'가 나오지 않습니다.
      고친 줄 `int add(int a, int b) { return a + b; }`에서는 `return a + b`가 `입력값을 받아 반환값을 계산함` 동작을 지켜 '5'까지 도달합니다.
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
    hint: 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `return a + b` 부분이 `입력값을 받아 반환값을 계산함` 동작을 지켜 실행 결과 '5'가 됩니다. 같은 개념을 다른 입력으로
      바꿔도 `return a + b`부터 `호출 지점에 5 반환`까지 추적할 수 있으면 정답입니다. `함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함` 상황과 빈 입력 같은 경계도 함께
      설명해 보세요.
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
    explanation:
      인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환 순서로 실행되어 출력은 '5'입니다. `return a + b` 부분이 마지막 단계를 확정하므로 다른 선택지는
      이 추적과 맞지 않습니다.
  - id: quiz-day-20-c-functions-model
    question: "'C 함수 매개변수와 반환값' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. 이 설명이 맞는 이유는 `입력값을 받아 반환값을 계산함` 동작을 지키는 조건과
      같기 때문입니다. `함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-20-c-functions-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함. 이 실수가 나오면 원본 추적 `인수 2,3 전달 → a+b=5 → 호출 지점에 5 반환`대로 '5'가 나오지 않으므로
      먼저 확인해야 합니다.
  - id: quiz-day-20-c-functions-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 입력값을 받아 반환값을 계산함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 `입력값을 받아 반환값을 계산함` 목적과 입력·출력은 유지합니다. 실행 결과 '5'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

같은 계산을 여러 곳에서 쓰려면 입력과 출력을 가진 함수로 분리해야 합니다. Day 20 "`C 함수 매개변수와 반환값`"에서는 C 코드의 실행 결과(`5`)를 따라가며, `입력값을 받아 반환값을 계산함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 19](/learn/day-19-nested-loop)에서 배운 "중첩 반복의 순서" 내용을 한 문장으로 말해 보세요. 이번 "`C 함수 매개변수와 반환값`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `return a + b`입니다.

## 머릿속 그림

매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. Day 20에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `return a + b`입니다.

```text
인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환
```

위 흐름에서 `return a + b` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `5`입니다.

## 천천히 풀어보기

함수는 입력을 받아 결과를 돌려주는 작은 계산 도구입니다. `add(10, 20)`을 부르면 `a=10`, `b=20`이 되고 `return a + b`는 30을 **호출한 자리**로 보냅니다. `return`은 화면 출력이 아닙니다. 호출한 쪽에서 `printf`로 결과를 보여 줘야 합니다.

매개변수 `a`, `b`는 함수 안에서 쓰는 이름입니다. C에서 정수 인수를 넘기면 그 값이 복사되어 함수에 전달되므로 함수 안의 `a`를 바꿔도 호출자 변수 자체는 바뀌지 않습니다. 값을 받는 순서가 바뀌면 뺄셈 같은 함수에서는 결과도 바뀝니다.

## 문법을 예제로 보기

아래 C 코드는 Day 20 "`C 함수 매개변수와 반환값`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `return a + b`이며, 실행 결과는 `5`입니다.

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

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `5`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `return a + b`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int add(int a, int b) { return a + b; }
 3 | int main(void) {
 4 |     printf("%d\n", add(2, 3));
 5 |     return 0;
 6 | }
```

1. main에서 add(2,3)을 호출합니다
2. 함수의 a=2,b=3으로 계산합니다
3. 반환 5를 printf가 출력합니다

`return a + b` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작     |
| ---: | ------------------ |
|    1 | 인수 2,3 전달      |
|    2 | a+b=5              |
|    3 | 호출 지점에 5 반환 |

위 순서대로 실행한 최종 출력은 `5`입니다. `인수 2,3 전달` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`int twice(int x) { return x * 2; }`를 `printf("%d", twice(4));`에서 호출하면 `x=4`가 된 뒤 8이 호출한 자리로 돌아와 출력됩니다. 함수 안에 `printf`가 없는 데도 화면에 값이 나타난 이유는 **호출자가 출력했기 때문**입니다. `return`과 `printf`를 한 동작으로 착각하지 마세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `5`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
    printf("%d\n", add(3, 3));
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
6
```

원본 출력은 `5`이고, 바뀐 코드의 실행 결과는 `6`입니다. 바뀐 줄은 `printf("%d\n", add(2, 3));`에서 `printf("%d\n", add(3, 3));`로 바뀌었습니다. 바뀐 프로그램은 `인수 2,3 전달` 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 `6`가 됩니다. 원본 추적 `인수 2,3 전달  →  a+b=5  →  호출 지점에 5 반환`에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다.

## 자주 틀리는 지점

**확인할 실수: 함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함.** 정상 코드의 실행 결과는 `5`입니다.

- 정상 줄: `int add(int a, int b) { return a + b; }`
- 잘못된 줄: `int add(int a, int b) { return a - b; }`

두 줄을 나란히 놓으면 정상 줄 `int add(int a, int b) { return a + b; }`이 `매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다.` 설명과 맞고, 잘못된 줄은 `함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `인수 2,3 전달`부터 `5`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `입력값을 받아 반환값을 계산함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | int add(int a,int b)           |
| Python | def add(a,b): return a+b       |
| Rust   | fn add(a:i32,b:i32)->i32 {a+b} |

C17에서는 `int add(int a,int b)` 규칙을 적용합니다. "`C 함수 매개변수와 반환값`" 수업의 실행 결과(`5`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `def add(a,b): return a+b` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `fn add(a:i32,b:i32)->i32 {a+b}` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`5` 맞히기) → 빈칸(`return a + b` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함` 찾기) → 독립 구현(`'C 함수 매개변수와 반환값' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `5` 및 `return a + b` 설명과 대조하세요.

## 스스로 설명하기

- "`C 함수 매개변수와 반환값`" 수업이 필요한 이유는 `입력값을 받아 반환값을 계산함` 동작으로 설명해 보세요.
- 예제에서 `return a + b` 부분 실행 직전의 상태와 직후의 출력(`5`)을 말해 보세요.
- "`함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `입력값을 받아 반환값을 계산함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

매개변수 a,b는 호출 시 전달된 값이고 return은 계산 결과를 호출한 위치에 돌려줍니다. Day 20 "`C 함수 매개변수와 반환값`" 예제의 핵심 부분은 `return a + b`이며, 실행 결과는 `5`입니다. "`함수 안의 a를 main의 변수와 같은 저장공간이라고 생각함`" 여부를 확인하고 Day 20 수업을 완료하세요.
