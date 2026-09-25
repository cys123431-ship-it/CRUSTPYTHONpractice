---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-40-malloc-free
courseId: crp-92
phaseId: phase-04
dayNumber: 40
date: "2026-11-09"
title: C 동적 할당과 해제
summary: 필요한 메모리를 실행 중 할당하면 실패 검사와 정확히 한 번 해제할 책임이 생깁니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-39-string-slice
learningObjectives:
  - "'C 동적 할당과 해제' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - malloc free
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
  - id: ex-day-40-malloc-free-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? malloc에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    answer: "42"
    hint: malloc에서 시작해 free까지 순서대로 적어 보세요. malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다.
    explanation:
      1. int 크기만큼 할당합니다. 2. NULL 검사를 거쳐 42를 저장하고 출력합니다. 3. 사용을 마친 뒤 free합니다. `malloc → NULL 검사 → 저장·출력
      → free` 흐름으로 실제 출력 `42`가 됩니다. 핵심 `free(value)`는 사용을 마친 공간을 돌려주는 자리에 쓰입니다.
    commonMistakes:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-40-malloc-free-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 동적 할당과 해제의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: free(value)"
    starter:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    _____;\n    return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    hint: 필요한 표현은 동적 메모리 수명 관리 동작을 잇는 free(value)입니다.
    explanation:
      빈칸에 들어갈 표현은 'free(value)'입니다. 이 표현이 없어도 이번 화면 출력은 같을 수 있으나 숨은 계약을 어깁니다. 1. int 크기만큼 할당합니다. 2. NULL
      검사를 거쳐 42를 저장하고 출력합니다. 3. 사용을 마친 뒤 free합니다. `malloc → NULL 검사 → 저장·출력 → free` 흐름으로 실제 출력 `42`가 됩니다. 핵심 `free(value)`는
      사용을 마친 공간을 돌려주는 자리에 쓰입니다.
    commonMistakes:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-40-malloc-free-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 1에서 2로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    answer:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 2;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    hint: 처음 등장하는 숫자를 1에서 2로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '42'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '42'입니다. 원본과 수정본 모두 `42`를 출력한다. 바꾼 return 2는 malloc 실패 갈래에 있어 성공 흐름에서는 실행되지 않습니다. 성공 흐름의
      값은 그대로이므로 중간 상태가 달라졌다고 쓰지 않는다.
    commonMistakes:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-40-malloc-free-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음 상황을 확인하세요.
    starter:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(NULL);\n    return 0;\n\
      }"
    answer:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    hint:
      free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음 상황에서 어긋나는 줄을 malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다.
      설명과 대조해 보세요.
    explanation:
      틀린 줄은 `free(NULL);`입니다. `free(NULL)` 자체는 아무 일도 하지 않는 안전한 호출이지만, 실제 할당 포인터 `value`를 해제하지 않으므로 메모리
      누수가 생깁니다. `printf`가 free보다 앞에 있어 화면에는 여전히 `42`가 출력될 수 있습니다. 오류 분류는 같은 출력이지만 숨은 계약 위반입니다. `42가 나오지 않는다`고 쓰면 안
      됩니다. 고친 줄 `free(value);`에서는 `동적 메모리 수명 관리` 동작이 지켜집니다. 정상 코드는 할당→검사→저장·출력→해제의 순서로 `42`를 출력합니다.
    commonMistakes:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-40-malloc-free-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 C 동적 할당과 해제 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 동적 할당과 해제: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    int *value = malloc(sizeof *value);\n\
      \    if (!value) return 1;\n    *value = 42;\n    printf(\"%d\\n\", *value);\n    free(value);\n    return 0;\n\
      }"
    hint: 할당 한 번에 해제 한 번을 대응시키세요. 해제한 뒤 `*value`로 다시 읽으면 정의되지 않은 동작입니다. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 할당 한 번에 해제 한 번을 대응시키세요. 해제한 뒤 `*value`로 다시 읽으면 정의되지 않은 동작입니다. 같은 동적 메모리
      수명 관리 동작을 구현하고 실행 결과 '42'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-40-malloc-free-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "42"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 int 크기 공간이 할당됩니다. 이어서 NULL 검사를 통과해 42를 저장하고 출력한 뒤, 사용을 마치고 free하므로 `42`가 됩니다. `실행 전에 반드시 오류가 난다`는
      틀린 선택지인데 할당과 검사가 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 printf가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-40-malloc-free-model
    question: "'C 동적 할당과 해제' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다.
    answerIndex: 2
    explanation:
      malloc은 힙 공간의 주소 또는 NULL을 돌려준다는 뜻이고, free 후에는 해당 주소를 다시 역참조할 수 없다는 뜻은 해제 뒤 사용 경로를 닫아야 한다는 뜻입니다. `free
      뒤 포인터를 다시 역참조하거나 해제를 빼먹음`은 반대 사례인데, 해제 뒤 사용은 정의되지 않은 동작이고 해제를 빼먹으면 누수가 되기 때문입니다.
  - id: quiz-day-40-malloc-free-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음`입니다. 이번 잘못된 코드는 화면 출력이 같습니다. 같다고 해서 맞는 것이 아니라, 실제 할당을 해제하지
      않은 숨은 계약 위반입니다.
  - id: quiz-day-40-malloc-free-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 동적 메모리 수명 관리라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `동적 메모리 수명 관리`라는 의미와 입력·출력 계약입니다. Rust의 소유권 자동 해제와 Python의 가비지 컬렉션으로 같은 동작을
      구현하고, 실행 결과 `42`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

필요한 메모리를 실행 중 할당하면 실패 검사와 정확히 한 번 해제할 책임이 생깁니다. Day 40 "`C 동적 할당과 해제`"에서는 C 코드의 실행 결과(`42`)를 따라가며, `동적 메모리 수명 관리` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 39](/learn/day-39-string-slice)에서 배운 "Rust String과 &str" 내용을 한 문장으로 말해 보세요. 이번 "`C 동적 할당과 해제`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `free(value)`입니다.

## 머릿속 그림

malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다. Day 40에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `free(value)`입니다.

```text
malloc  →  NULL 검사  →  저장·출력  →  free
```

위 흐름에서 `free(value)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `42`입니다.

## 천천히 풀어보기

`malloc(sizeof *value)`는 값을 담을 공간을 요청하고 성공하면 그 공간의 주소, 실패하면 `NULL`을 돌려줍니다. `NULL`이면 역참조할 수 없으므로 먼저 검사해야 합니다. 성공한 뒤 `*value = 30`은 새 공간에 정수 30을 씁니다.

`free(value)`를 호출한 뒤 그 공간은 더 이상 내 것이 아닙니다. 포인터 변수에 예전 주소 비트가 남아 있더라도 `*value`로 다시 읽거나 두 번 `free`하면 잘못됩니다. 할당 한 번에 해제 한 번을 대응시키고, 해제한 뒤에는 사용 경로를 닫으세요. `sizeof *value`는 포인터가 가리키는 타입 크기를 구하므로 타입 이름을 중복해서 적지 않아도 됩니다.

`malloc(sizeof *value)`는 값을 담을 공간을 요청하고 성공하면 그 공간의 주소, 실패하면 `NULL`을 돌려줍니다. `NULL`이면 역참조할 수 없으므로 먼저 검사해야 합니다. 성공한 뒤 `*value = 30`은 새 공간에 정수 30을 씁니다.

`free(value)`를 호출한 뒤 그 공간은 더 이상 내 것이 아닙니다. 포인터 변수에 예전 주소 비트가 남아 있더라도 `*value`로 다시 읽거나 두 번 `free`하면 잘못됩니다. 할당 한 번에 해제 한 번을 대응시키고, 해제한 뒤에는 사용 경로를 닫으세요. `sizeof *value`는 포인터가 가리키는 타입 크기를 구하므로 타입 이름을 중복해서 적지 않아도 됩니다.

## 문법을 예제로 보기

아래 C 코드는 Day 40 "`C 동적 할당과 해제`"의 독립 예제입니다. 전체 10줄 가운데 핵심 부분은 `free(value)`이며, 실행 결과는 `42`입니다.

```c
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *value = malloc(sizeof *value);
    if (!value) return 1;
    *value = 42;
    printf("%d\n", *value);
    free(value);
    return 0;
}
```

예상 출력:

```text
42
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `42`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `free(value)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```c
 1 | #include <stdio.h>
 2 | #include <stdlib.h>
 3 | int main(void) {
 4 |     int *value = malloc(sizeof *value);
 5 |     if (!value) return 1;
 6 |     *value = 42;
 7 |     printf("%d\n", *value);
 8 |     free(value);
 9 |     return 0;
10 | }
```

1. int 크기만큼 할당합니다
2. NULL 검사를 거쳐 42를 저장하고 출력합니다
3. 사용을 마친 뒤 free합니다

`free(value)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | malloc         |
|    2 | NULL 검사      |
|    3 | 저장·출력      |
|    4 | free           |

위 순서대로 실행한 최종 출력은 `42`입니다. `malloc` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`int *p = malloc(sizeof *p);` 다음에는 `if (p == NULL)`로 실패를 확인합니다. 성공이라면 `*p=7`로 기록하고 읽은 뒤 `free(p)`로 사용을 마칩니다. `free(p); printf("%d", *p);`는 이전 주소가 변수에 남아 보여도 **해제한 공간을 다시 읽는 잘못된 코드**입니다. 두 번째 `free(p)`도 하면 안 됩니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `42`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```c
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *value = malloc(sizeof *value);
    if (!value) return 2;
    *value = 42;
    printf("%d\n", *value);
    free(value);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
42
```

원본과 수정본 모두 `42`를 출력한다. 바꾼 return 2는 malloc 실패 갈래에 있어 성공 흐름에서는 실행되지 않습니다. 성공 흐름의 값은 그대로이므로 중간 상태가 달라졌다고 쓰지 않는다.

## 자주 틀리는 지점

**확인할 실수: free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음.** 정상 코드의 실행 결과는 `42`입니다.

- 정상 줄: `free(value);`
- 잘못된 줄: `free(NULL);`

두 줄을 나란히 놓으면 정상 줄 `free(value);`이 `malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다.` 설명과 맞고, 잘못된 줄은 `free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음` 쪽으로 어긋납니다. 결과가 예상과 다르면 `malloc`부터 `42`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `동적 메모리 수명 관리`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙   |
| ------ | ---------------------------- |
| C17    | malloc 실패 검사와 free 대응 |
| Python | 객체 수명은 런타임이 관리    |
| Rust   | Box/Vec가 scope 종료 시 Drop |

C17에서는 `malloc 실패 검사와 free 대응` 규칙을 적용합니다. "`C 동적 할당과 해제`" 수업의 실행 결과(`42`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `객체 수명은 런타임이 관리` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Box/Vec가 scope 종료 시 Drop` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`42` 맞히기) → 빈칸(`free(value)` 채우기) → 변경(`처음 등장하는 숫자를 1에서 2로`) → 오류 수정(`free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음` 찾기) → 독립 구현(`'C 동적 할당과 해제' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `42` 및 `free(value)` 설명과 대조하세요.

## 스스로 설명하기

- "`C 동적 할당과 해제`" 수업이 필요한 이유는 `동적 메모리 수명 관리` 동작으로 설명해 보세요.
- 예제에서 `free(value)` 부분 실행 직전의 상태와 직후의 출력(`42`)을 말해 보세요.
- "`free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `동적 메모리 수명 관리` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

malloc은 힙 공간의 주소 또는 NULL을 돌려주고 free 후에는 해당 주소를 다시 역참조할 수 없습니다. Day 40 "`C 동적 할당과 해제`" 예제의 핵심 부분은 `free(value)`이며, 실행 결과는 `42`입니다. "`free 뒤 포인터를 다시 역참조하거나 해제를 빼먹음`" 여부를 확인하고 Day 40 수업을 완료하세요.
