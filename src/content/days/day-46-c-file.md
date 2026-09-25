---
schemaVersion: 1
contentVersion: 2026.10-e
id: day-46-c-file
courseId: crp-92
phaseId: phase-04
dayNumber: 46
date: "2026-11-15"
title: C 파일 입출력과 실패 검사
summary: 파일의 읽기·쓰기는 실패할 수 있고 현재 읽는 위치가 어디인지에 따라 결과가 달라집니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-45-lifetime
learningObjectives:
  - "'C 파일 입출력과 실패 검사' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - c file
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
  - id: ex-day-46-c-file-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 열기에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f);\
      \ return 0;\n}"
    answer: "30"
    hint: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 설명을 떠올리고 `열기` 단계부터 순서대로 적어 보세요.
    explanation:
      열기  →  쓰기  →  rewind  →  읽기  →  닫기 순서로 실행됩니다. `rewind(f)` 부분이 `닫기` 단계를 확정해 최종 출력 '30'가 됩니다. 이 흐름을
      떠올리면 `파일 포인터 위치와 실패를 관리함` 동작이 왜 필요한지 알 수 있습니다.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-46-c-file-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'C 파일 입출력과 실패 검사' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: rewind(f)"
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); _____;\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: 힌트 문장을 완전하게 읽으면 `tmpfile이 임시 파일을 엽니다` 단계에 필요한 표현이 `rewind(f)`입니다.
    explanation:
      빈칸에 들어갈 표현은 'rewind(f)'입니다. `fputs("30\n", f); rewind(f);` 줄을 완성해야 `파일 포인터 위치와 실패를 관리함` 동작이 이어져 실행
      결과 '30'가 됩니다. 힌트의 첫 단계 `tmpfile이 임시 파일을 엽니다`이 바로 이 줄입니다. 이어서 30을 쓰고 위치를 처음으로 돌립니다 fscanf 성공 후 출력하고 닫습니다 순서로
      진행됩니다.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-46-c-file-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 1에서 2로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f);\
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 2;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 1에서 2로."
    explanation:
      바꾼 뒤 출력은 '30'입니다. 원본 출력 '30'와 같습니다. 바뀐 줄은 `if (!f) return 2;`입니다. 바뀐 프로그램도 `열기` 단계에서 시작해 바뀐 줄을 지나
      최종 `30`로 끝납니다. 바꾼 return 2는 파일 열기 실패 갈래에 있어 정상 흐름에서는 실행되지 않습니다. 출력은 같지만 바뀐 줄 부분의 중간 값은 달라졌다가 같은 최종 값으로 이어진다는
      점을 위 추적 순서와 대조해 확인할 수 있습니다.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-46-c-file-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); fclose(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f);\
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint:
      쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 설명과 어긋나는 줄을 찾으세요. `쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`
      상황이 단서가 됩니다.
    explanation:
      틀린 줄은 `fputs("30\n", f); fclose(f);`입니다. 여기서는 `fclose(f)`을 써서 `rewind(f)` 동작이 깨집니다. 이대로 실행하면 `쓰기
      직후 위치를 되돌리지 않고 읽어 EOF를 만남` 문제가 생겨 원본 추적 `열기  →  쓰기  →  rewind  →  읽기  →  닫기`대로 '30'가 나오지 않습니다. 고친 줄 `fputs("30\n",
      f); rewind(f);`에서는 `rewind(f)`가 `파일 포인터 위치와 실패를 관리함` 동작을 지켜 '30'까지 도달합니다.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-46-c-file-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 파일 입출력과 실패 검사' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 파일 입출력과 실패 검사: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.
    explanation:
      한 가지 예시 해법은 위 코드입니다. `rewind(f)` 부분이 `파일 포인터 위치와 실패를 관리함` 동작을 지켜 실행 결과 '30'가 됩니다. 같은 개념을 다른 입력으로
      바꿔도 `rewind(f)`부터 `닫기`까지 추적할 수 있으면 정답입니다. `쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 상황과 빈 입력 같은 경계도 함께 설명해 보세요.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-46-c-file-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "30"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      열기  →  쓰기  →  rewind  →  읽기  →  닫기 순서로 실행되어 출력은 '30'입니다. `rewind(f)` 부분이 마지막 단계를 확정하므로 다른 선택지는 이
      추적과 맞지 않습니다.
  - id: quiz-day-46-c-file-model
    question: "'C 파일 입출력과 실패 검사' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
    answerIndex: 2
    explanation:
      쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 이 설명이 맞는 이유는 `파일 포인터 위치와 실패를 관리함` 동작을 지키는
      조건과 같기 때문입니다. `쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다.
  - id: quiz-day-46-c-file-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남. 이 실수가 나오면 원본 추적 `열기 → 쓰기 → rewind → 읽기 → 닫기`대로 '30'가 나오지 않으므로 먼저 확인해야
      합니다.
  - id: quiz-day-46-c-file-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 파일 포인터 위치와 실패를 관리함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 `파일 포인터 위치와 실패를 관리함` 목적과 입력·출력은 유지합니다. 실행 결과 '30'로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

파일의 읽기·쓰기는 실패할 수 있고 현재 읽는 위치가 어디인지에 따라 결과가 달라집니다. Day 46 "`C 파일 입출력과 실패 검사`"에서는 C 코드의 실행 결과(`30`)를 따라가며, `파일 포인터 위치와 실패를 관리함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 45](/learn/day-45-lifetime)에서 배운 "Rust 참조의 유효 수명" 내용을 한 문장으로 말해 보세요. 이번 "`C 파일 입출력과 실패 검사`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `rewind(f)`입니다.

## 머릿속 그림

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. Day 46에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `rewind(f)`입니다.

```text
열기  →  쓰기  →  rewind  →  읽기  →  닫기
```

위 흐름에서 `rewind(f)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

파일 스트림은 내용뿐 아니라 **현재 읽거나 쓸 위치**도 기억합니다. 파일에 값을 쓴 직후 위치는 끝입니다. 같은 스트림에서 다시 읽고 싶으면 `rewind(f)`로 처음으로 옮겨야 합니다. `fopen`이 실패하면 `NULL`을 돌려주므로 읽기·쓰기 전에 확인하세요.

`fclose`를 하면 스트림의 자원을 정리합니다. 열기는 성공했는데 중간 작업이 실패해도 닫는 경로를 놓치지 마세요. 실제 파일을 다룰 때는 파일 존재 여부, 접근 권한, 읽기 실패도 정상 흐름에 포함해서 처리해야 합니다.

## 문법을 예제로 보기

아래 C 코드는 Day 46 "`C 파일 입출력과 실패 검사`"의 독립 예제입니다. 전체 9줄 가운데 핵심 부분은 `rewind(f)`이며, 실행 결과는 `30`입니다.

```c
#include <stdio.h>
int main(void) {
    FILE *f = tmpfile();
    if (!f) return 1;
    fputs("30\n", f); rewind(f);
    int n=0;
    if (fscanf(f,"%d",&n)==1) printf("%d\n",n);
    fclose(f); return 0;
}
```

예상 출력:

```text
30
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `rewind(f)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     FILE *f = tmpfile();
 4 |     if (!f) return 1;
 5 |     fputs("30\n", f); rewind(f);
 6 |     int n=0;
 7 |     if (fscanf(f,"%d",&n)==1) printf("%d\n",n);
 8 |     fclose(f); return 0;
 9 | }
```

1. tmpfile이 임시 파일을 엽니다
2. 30을 쓰고 위치를 처음으로 돌립니다
3. fscanf 성공 후 출력하고 닫습니다

`rewind(f)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 열기           |
|    2 | 쓰기           |
|    3 | rewind         |
|    4 | 읽기           |
|    5 | 닫기           |

위 순서대로 실행한 최종 출력은 `30`입니다. `열기` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`fputs("AB", f)` 뒤 파일 위치는 두 글자를 쓴 끝에 있습니다. `rewind(f); fgetc(f)`를 호출하면 첫 글자 A를 읽습니다. 되감기를 생략하면 끝에서 읽으려 해서 첫 글자가 나오지 않습니다. 파일을 열지 못했다면 `f`가 `NULL`이므로 읽기·쓰기보다 먼저 실패를 처리해야 합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
int main(void) {
    FILE *f = tmpfile();
    if (!f) return 2;
    fputs("30\n", f); rewind(f);
    int n=0;
    if (fscanf(f,"%d",&n)==1) printf("%d\n",n);
    fclose(f); return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
30
```

바꾼 뒤 출력도 `30`입니다. 바꾼 return 2는 파일 열기 실패 갈래에 있어 정상 흐름에서는 실행되지 않습니다. 바뀐 프로그램도 `열기` 단계에서 시작해 `if (!f) return 2;` 줄을 지나 최종 `30`로 끝납니다. 원본 추적 `열기  →  쓰기  →  rewind  →  읽기  →  닫기`와 바뀐 줄 이후를 순서대로 놓으면 출력은 같아도 중간 값이 어디서 달라졌다가 합쳐지는지 확인할 수 있습니다.

## 자주 틀리는 지점

**확인할 실수: 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `fputs("30\n", f); rewind(f);`
- 잘못된 줄: `fputs("30\n", f); fclose(f);`

두 줄을 나란히 놓으면 정상 줄 `fputs("30\n", f); rewind(f);`이 `쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.` 설명과 맞고, 잘못된 줄은 `쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 쪽으로 어긋납니다. 결과가 예상과 다르면 `열기`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `파일 포인터 위치와 실패를 관리함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | FILE*, 반환값 검사, fclose    |
| Python | with open은 종료 시 자동 닫기 |
| Rust   | File과 Result, drop으로 닫기  |

C17에서는 `FILE*, 반환값 검사, fclose` 규칙을 적용합니다. "`C 파일 입출력과 실패 검사`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `with open은 종료 시 자동 닫기` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `File과 Result, drop으로 닫기` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`rewind(f)` 채우기) → 변경(`처음 등장하는 숫자를 1에서 2로`) → 오류 수정(`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 찾기) → 독립 구현(`'C 파일 입출력과 실패 검사' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `rewind(f)` 설명과 대조하세요.

## 스스로 설명하기

- "`C 파일 입출력과 실패 검사`" 수업이 필요한 이유는 `파일 포인터 위치와 실패를 관리함` 동작으로 설명해 보세요.
- 예제에서 `rewind(f)` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `파일 포인터 위치와 실패를 관리함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. Day 46 "`C 파일 입출력과 실패 검사`" 예제의 핵심 부분은 `rewind(f)`이며, 실행 결과는 `30`입니다. "`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`" 여부를 확인하고 Day 46 수업을 완료하세요.
