---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-43-output-parameter
courseId: crp-92
phaseId: phase-04
dayNumber: 43
date: "2026-11-12"
title: C 포인터로 결과 돌려주기
summary: C 함수에서 성공 여부와 계산 결과를 동시에 돌려주려면 주소를 통한 출력 인자를 사용할 수 있습니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-42-memory-review
learningObjectives:
  - "'C 포인터로 결과 돌려주기' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - output parameter
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
  - id: ex-day-43-output-parameter-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? n=0에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    answer: "12"
    hint: n=0에서 시작해 n 출력까지 순서대로 적어 보세요. out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다.
    explanation:
      1. main이 &n을 전달합니다. 2. 함수가 NULL을 확인합니다. 3. *out으로 n=12를 만들고 성공을 반환합니다. `n=0 → &n 전달 → *out=12 → n
      출력` 흐름으로 실제 출력 `12`가 됩니다. 핵심 `*out =`은 호출자의 변수 값을 바꾸는 자리에 쓰입니다.
    commonMistakes:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-43-output-parameter-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 포인터로 결과 돌려주기의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: *out ="
    starter:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    _____ input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    answer:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    hint: 필요한 표현은 출력 인자로 호출자 값을 수정함 동작을 잇는 *out =입니다.
    explanation:
      빈칸에 들어갈 표현은 '*out ='입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. main이 &n을 전달합니다. 2. 함수가 NULL을 확인합니다. 3. *out으로
      n=12를 만들고 성공을 반환합니다. `n=0 → &n 전달 → *out=12 → n 출력` 흐름으로 실제 출력 `12`가 됩니다. 핵심 `*out =`은 호출자의 변수 값을 바꾸는 자리에 쓰입니다.
    commonMistakes:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-43-output-parameter-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    answer:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 3; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '12'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '18'입니다. 원본은 `12`, 수정본은 `18`이다. 첫 변경 줄 `*out = input * 2; return 1;`에서 `*out = input * 3;
      return 1;`로 계산을 바꾸면, 호출자의 n에 18이 기록된 뒤 출력된다.
    commonMistakes:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-43-output-parameter-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    answer:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    hint: out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함 상황에서 어긋나는 줄을 out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `out = input * 2; return 1;`입니다. 포인터 변수에 정수를 직접 대입하려 하므로 컴파일 단계에서 타입 경고를 냅니다. 그대로 실행하면 호출자의
      `n`은 바뀌지 않아 `0`이 출력됩니다. 오류 분류는 잘못된 출력입니다. 흐름이 깨지는 첫 순간은 역참조 없는 대입입니다. 고친 줄 `*out = input * 2; return 1;`에서는
      `출력 인자로 호출자 값을 수정함` 동작이 지켜집니다. 정상 코드는 주소 전달→NULL 검사→역참조 기록→성공 반환의 순서로 `12`를 출력합니다.
    commonMistakes:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-43-output-parameter-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 C 포인터로 결과 돌려주기 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 포인터로 결과 돌려주기: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint double_into(int input, int *out) {\n    if (!out) return 0;\n    *out = input\
      \ * 2; return 1;\n}\nint main(void) { int n=0; if(double_into(6,&n)) printf(\"%d\\n\",n); return 0; }"
    hint: 주소 인수가 `NULL`일 수도 있는 함수라면 역참조 전에 검사해야 합니다. 반환값 전달과 주소 기록을 구별하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 주소 인수가 `NULL`일 수도 있는 함수라면 역참조 전에 검사해야 합니다. 반환값 전달과 주소 기록을 구별하세요. 같은 출력
      인자로 호출자 값을 수정함 동작을 구현하고 실행 결과 '12'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-43-output-parameter-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "12"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 main에서 n=0과 주소 &n이 준비됩니다. 이어서 함수가 NULL 검사를 통과해 *out에 12를 기록하고 성공을 반환하면, printf가 n을 표시하므로 출력 `12`가
      됩니다. `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 주소 전달과 검사가 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 printf가 실제로 호출되기 때문입니다.
      다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-43-output-parameter-model
    question: "'C 포인터로 결과 돌려주기' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다.
    answerIndex: 2
    explanation:
      out은 호출자 n의 주소라는 뜻이고, *out에 대입해야 호출자 변수의 값이 바뀐다는 뜻은 주소가 아니라 그 주소의 값을 바꿔야 한다는 뜻입니다. `out 자체에 대입하고
      호출자 변수도 바뀌었다고 생각함`은 반대 사례인데, 포인터 변수 자체를 바꾸는 것과 가리키는 값을 바꾸는 것은 다르기 때문입니다.
  - id: quiz-day-43-output-parameter-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함`입니다. 잘못된 코드는 타입 경고가 나고 `0`이라는 잘못된 출력을 냅니다. 역참조 없는 대입을
      먼저 확인하세요.
  - id: quiz-day-43-output-parameter-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 출력 인자로 호출자 값을 수정함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `출력 인자로 호출자 값을 수정함`이라는 의미와 입력·출력 계약입니다. Python의 가변 객체 전달과 Rust의 가변 빌림으로 같은
      동작을 구현하고, 실행 결과 `12`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

C 함수에서 성공 여부와 계산 결과를 동시에 돌려주려면 주소를 통한 출력 인자를 사용할 수 있습니다. Day 43 "`C 포인터로 결과 돌려주기`"에서는 C 코드의 실행 결과(`12`)를 따라가며, `출력 인자로 호출자 값을 수정함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 42](/learn/day-42-memory-review)에서 배운 "메모리 모델 종합 회상" 내용을 한 문장으로 말해 보세요. 이번 "`C 포인터로 결과 돌려주기`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `*out =`입니다.

## 머릿속 그림

out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다. Day 43에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `*out =`입니다.

```text
n=0  →  &n 전달  →  *out=12  →  n 출력
```

위 흐름에서 `*out =` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `12`입니다.

## 천천히 풀어보기

C 함수는 정수 매개변수에 값을 복사해서 받으므로 `void update(int n)` 안에서 `n = 30`을 해도 호출자의 정수는 바뀌지 않습니다. 바깥 변수를 바꾸려면 `update(&n)`처럼 **주소**를 넘기고, 함수에서 `void update(int *out) { *out = 30; }`처럼 그 주소의 값을 수정합니다. `out`은 주소이고 `*out`은 호출자의 실제 값입니다.

| 순간            | 호출자 `n` | 함수의 `out` |    `*out` |
| --------------- | ---------: | ------------ | --------: |
| 호출 전         |         10 | 아직 없음    | 아직 없음 |
| `update(&n)` 안 |         10 | `&n`         |        10 |
| `*out = 30` 뒤  |         30 | `&n`         |        30 |

함수에서 `out = ...`처럼 포인터 변수 자체를 다른 곳으로 바꾸면 호출자의 `n`이 바뀌는 것과 다릅니다. 주소 인수가 `NULL`일 수도 있는 함수라면 역참조 전에 검사해야 합니다. 반환값으로 결과를 돌려주는 방법과 주소로 결과를 기록하는 방법을 구별하세요.

C 함수는 정수 매개변수에 값을 복사해서 받으므로 함수 안에서 값을 바꿔도 호출자의 정수는 바뀌지 않습니다. 바깥 변수를 바꾸려면 `update(&n)`처럼 주소를 넘기고, 함수에서 `*out = 30`처럼 그 주소의 값을 수정합니다. `out`은 주소이고 `*out`은 호출자의 실제 값입니다.

함수에서 `out` 자체를 다른 곳으로 바꾸면 호출자의 값이 바뀌는 것과 다릅니다. 주소 인수가 `NULL`일 수도 있는 함수라면 역참조 전에 검사해야 합니다. 반환값으로 결과를 돌려주는 방법과 주소로 결과를 기록하는 방법을 구별하세요.

## 문법을 예제로 보기

아래 C 코드는 Day 43 "`C 포인터로 결과 돌려주기`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `*out =`이며, 실행 결과는 `12`입니다.

```c
#include <stdio.h>
int double_into(int input, int *out) {
    if (!out) return 0;
    *out = input * 2; return 1;
}
int main(void) { int n=0; if(double_into(6,&n)) printf("%d\n",n); return 0; }
```

예상 출력:

```text
12
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `12`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `*out =`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```c
 1 | #include <stdio.h>
 2 | int double_into(int input, int *out) {
 3 |     if (!out) return 0;
 4 |     *out = input * 2; return 1;
 5 | }
 6 | int main(void) { int n=0; if(double_into(6,&n)) printf("%d\n",n); return 0; }
```

1. main이 &n을 전달합니다
2. 함수가 NULL을 확인합니다
3. *out으로 n=12를 만들고 성공을 반환합니다

`*out =` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | n=0            |
|    2 | &n 전달        |
|    3 | *out=12        |
|    4 | n 출력         |

위 순서대로 실행한 최종 출력은 `12`입니다. `n=0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`void set(int *out) { *out = 9; }`와 호출 `int n=1; set(&n);` 뒤 n은 9입니다. 함수에 주소 `&n`을 줬으므로 `*out`이 실제 n의 저장 칸에 접근합니다. 만약 함수 안에서 `out = NULL;`만 하면 함수의 지역 포인터가 바뀔 뿐, 호출자 n에는 9가 적히지 않습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `12`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```c
#include <stdio.h>
int double_into(int input, int *out) {
    if (!out) return 0;
    *out = input * 3; return 1;
}
int main(void) { int n=0; if(double_into(6,&n)) printf("%d\n",n); return 0; }
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
18
```

원본은 `12`, 수정본은 `18`이다. 첫 변경 줄 `*out = input * 2; return 1;`에서 `*out = input * 3; return 1;`로 계산을 바꾸면, 호출자의 n에 18이 기록된 뒤 출력된다.

## 자주 틀리는 지점

**확인할 실수: out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함.** 정상 코드의 실행 결과는 `12`입니다.

- 정상 줄: `*out = input * 2; return 1;`
- 잘못된 줄: `out = input * 2; return 1;`

두 줄을 나란히 놓으면 정상 줄 `*out = input * 2; return 1;`이 `out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다.` 설명과 맞고, 잘못된 줄은 `out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `n=0`부터 `12`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `출력 인자로 호출자 값을 수정함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | int *out과 성공 bool/int 반환 |
| Python | 튜플로 성공·결과를 반환       |
| Rust   | Result<i32,E>로 결과 전달     |

C17에서는 `int *out과 성공 bool/int 반환` 규칙을 적용합니다. "`C 포인터로 결과 돌려주기`" 수업의 실행 결과(`12`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `튜플로 성공·결과를 반환` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Result<i32,E>로 결과 전달` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`12` 맞히기) → 빈칸(`*out =` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함` 찾기) → 독립 구현(`'C 포인터로 결과 돌려주기' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `12` 및 `*out =` 설명과 대조하세요.

## 스스로 설명하기

- "`C 포인터로 결과 돌려주기`" 수업이 필요한 이유는 `출력 인자로 호출자 값을 수정함` 동작으로 설명해 보세요.
- 예제에서 `*out =` 부분 실행 직전의 상태와 직후의 출력(`12`)을 말해 보세요.
- "`out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `출력 인자로 호출자 값을 수정함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

out은 호출자 n의 주소입니다. *out에 대입해야 호출자 변수의 값이 바뀝니다. Day 43 "`C 포인터로 결과 돌려주기`" 예제의 핵심 부분은 `*out =`이며, 실행 결과는 `12`입니다. "`out 자체에 대입하고 호출자 변수도 바뀌었다고 생각함`" 여부를 확인하고 Day 43 수업을 완료하세요.
