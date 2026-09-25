---
schemaVersion: 1
contentVersion: 2026.10-d
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
    hint: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
    explanation: 열기  →  쓰기  →  rewind  →  읽기  →  닫기. 따라서 출력은 '30'입니다.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-46-c-file-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 파일 입출력과 실패 검사의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: rewind(f)"
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); _____;\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: tmpfile이 임시 파일을 엽니다
    explanation: 빈칸에는 'rewind(f)'이 들어갑니다. tmpfile이 임시 파일을 엽니다 30을 쓰고 위치를 처음으로 돌립니다 fscanf 성공 후 출력하고 닫습니다
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-46-c-file-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 1에서 2로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f);\
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 2;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: 처음 등장하는 숫자를 1에서 2로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 1에서 2로 바꿨습니다. 원래 출력은 '30'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
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
    hint: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. tmpfile이 임시 파일을 엽니다 30을 쓰고 위치를 처음으로 돌립니다 fscanf 성공 후 출력하고 닫습니다
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
    hint: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 tmpfile이 임시 파일을 엽니다 30을 쓰고 위치를 처음으로 돌립니다 fscanf 성공 후 출력하고 닫습니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
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
    explanation: 열기  →  쓰기  →  rewind  →  읽기  →  닫기 순서로 실행되어 '30'을 출력합니다.
  - id: quiz-day-46-c-file-model
    question: C 파일 입출력과 실패 검사을 이해하는 데 맞는 설명은?
    choices:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
    answerIndex: 2
    explanation: 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.
  - id: quiz-day-46-c-file-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-46-c-file-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 파일 포인터 위치와 실패를 관리함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 파일 포인터 위치와 실패를 관리함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

파일의 읽기·쓰기는 실패할 수 있고 현재 읽는 위치가 어디인지에 따라 결과가 달라집니다. Day 46 "`C 파일 입출력과 실패 검사`"에서는 C 코드가 `30`을(를) 만드는 과정을 따라가며, 파일 포인터 위치와 실패를 관리함 동작이 왜 필요한지 확인합니다. 파일 포인터 위치와 실패를 관리함을(를) 빠뜨리면 `쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 45](/learn/day-45-lifetime)에서는 "Rust 참조의 유효 수명"을(를) 배웠습니다. "Rust 참조의 유효 수명"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`C 파일 입출력과 실패 검사`"에서 새로 달라지는 조건을 찾아보세요. Day 46의 답은 `30`이며, 핵심 표현은 `rewind(f)`입니다.

## 머릿속 그림

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. Day 46에서는 아래 흐름 순서대로 상태가 바뀌며, `rewind(f)`이(가) 결과를 가릅니다.

```text
열기  →  쓰기  →  rewind  →  읽기  →  닫기
```

위 흐름에서 `rewind(f)`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

파일 스트림은 내용뿐 아니라 **현재 읽거나 쓸 위치**도 기억합니다. 파일에 값을 쓴 직후 위치는 끝입니다. 같은 스트림에서 다시 읽고 싶으면 `rewind(f)`로 처음으로 옮겨야 합니다. `fopen`이 실패하면 `NULL`을 돌려주므로 읽기·쓰기 전에 확인하세요.

`fclose`를 하면 스트림의 자원을 정리합니다. 열기는 성공했는데 중간 작업이 실패해도 닫는 경로를 놓치지 마세요. 실제 파일을 다룰 때는 파일 존재 여부, 접근 권한, 읽기 실패도 정상 흐름에 포함해서 처리해야 합니다.

## 문법을 예제로 보기

아래 C 코드는 Day 46 "`C 파일 입출력과 실패 검사`"의 독립 예제입니다. 전체 9줄에서 `rewind(f)`이(가) 핵심이며, 실행 결과는 `30`입니다.

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

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 `30`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

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

위 단계에서 `rewind(f)`이(가) 빠지면 `30`이(가) 나오지 않습니다. `처음 등장하는 숫자를 1에서 2로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 열기           |
|    2 | 쓰기           |
|    3 | rewind         |
|    4 | 읽기           |
|    5 | 닫기           |

위 순서대로 실행하면 최종 출력 `30`이(가) 됩니다. `열기` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`fputs("AB", f)` 뒤 파일 위치는 두 글자를 쓴 끝에 있습니다. `rewind(f); fgetc(f)`를 호출하면 첫 글자 A를 읽습니다. 되감기를 생략하면 끝에서 읽으려 해서 첫 글자가 나오지 않습니다. 파일을 열지 못했다면 `f`가 `NULL`이므로 읽기·쓰기보다 먼저 실패를 처리해야 합니다.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 1에서 2로` 바꾸면 아래와 같이 됩니다.

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

원본 출력은 `30`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `rewind(f)`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 46의 `C 파일 입출력과 실패 검사`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남.** 정상 코드에서는 `30`이(가) 출력됩니다.

- 정상 줄: `fputs("30\n", f); rewind(f);`
- 잘못된 줄: `fputs("30\n", f); fclose(f);`

두 줄을 나란히 놓고 `쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `열기`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **파일 포인터 위치와 실패를 관리함**은(는) 세 언어에서 같은 입력과 출력(`30`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | FILE*, 반환값 검사, fclose    |
| Python | with open은 종료 시 자동 닫기 |
| Rust   | File과 Result, drop으로 닫기  |

C17에서는 `FILE*, 반환값 검사, fclose` 규칙으로 "`C 파일 입출력과 실패 검사`"의 `30`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `with open은 종료 시 자동 닫기` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `File과 Result, drop으로 닫기` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`rewind(f)` 채우기) → 변경(`처음 등장하는 숫자를 1에서 2로`) → 오류 수정(`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남` 찾기) → 독립 구현(`C 파일 입출력과 실패 검사을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `rewind(f)` 설명과 대조하세요.

## 스스로 설명하기

- "`C 파일 입출력과 실패 검사`"이(가) 필요한 상황을 `파일 포인터 위치와 실패를 관리함` 동작으로 설명해 보세요.
- 예제에서 `rewind(f)`이(가) 실행되기 직전의 상태와 직후의 출력 `30`을(를) 말해 보세요.
- "`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `파일 포인터 위치와 실패를 관리함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. Day 46 "`C 파일 입출력과 실패 검사`"의 예제는 `rewind(f)`을(를) 실행해 `30`을(를) 출력합니다. "`쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남`" 여부를 확인하고 Day 46을(를) 완료하세요.
