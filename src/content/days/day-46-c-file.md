---
schemaVersion: 1
contentVersion: 2026.10-c
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
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 1에서 2로 바꿔 보세요. 출력도 먼저 예측하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 1;\n    fputs(\"\
      30\\n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f);\
      \ return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    FILE *f = tmpfile();\n    if (!f) return 2;\n    fputs(\"30\\\
      n\", f); rewind(f);\n    int n=0;\n    if (fscanf(f,\"%d\",&n)==1) printf(\"%d\\n\",n);\n    fclose(f); return\
      \ 0;\n}"
    hint: 처음 등장하는 숫자를 1에서 2로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation: 예시 답안에서는 처음 등장하는 숫자를 1에서 2로 바꿨습니다. 원본 출력은 '30'입니다. 바뀐 코드의 결과는 실행해 확인하세요.
    commonMistakes:
      - 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-46-c-file-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드의 핵심 표현 'fclose(f)'을 점검하고 올바른 작동을 복원하세요. 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남 오류도 함께 경계하세요.
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
      - 코드의 들여쓰기를 취향대로 바꾸기
      - 실행 결과를 확인하지 않고 외우기
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

## 1. 오늘 배울 이유

파일의 읽기·쓰기는 실패할 수 있고 현재 읽는 위치가 어디인지에 따라 결과가 달라집니다. 처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.

## 2. 시작 전에 확인할 것

바로 앞선 [Day 45](/learn/day-45-lifetime)의 핵심을 한 문장으로 설명해 보세요. 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 3. 머릿속 그림

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 다음 흐름을 눈으로 확인하세요.

```text
열기  →  쓰기  →  rewind  →  읽기  →  닫기
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 4. 문법을 예제로 보기

아래는 C 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

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

이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.

## 5. 핵심 줄 따라 읽기

예제의 핵심 표현은 `rewind(f)`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

1. tmpfile이 임시 파일을 엽니다
2. 30을 쓰고 위치를 처음으로 돌립니다
3. fscanf 성공 후 출력하고 닫습니다

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 6. 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 열기           |
|    2 | 쓰기           |
|    3 | rewind         |
|    4 | 읽기           |
|    5 | 닫기           |

마지막 상태에서 화면에 표시되는 결과는 `30`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 7. 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. 처음 등장하는 숫자를 1에서 2로 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 8. 자주 틀리는 지점

**확인할 실수: 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남.** 쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 9. 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **파일 포인터 위치와 실패를 관리함**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | FILE*, 반환값 검사, fclose    |
| Python | with open은 종료 시 자동 닫기 |
| Rust   | File과 Result, drop으로 닫기  |

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 10. 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 11. 스스로 설명하기

- 왜 이 개념이 필요한가? 파일의 읽기·쓰기는 실패할 수 있고 현재 읽는 위치가 어디인지에 따라 결과가 달라집니다.
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? 쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 12. 핵심 요약과 복습

쓰고 난 뒤 스트림 위치는 끝입니다. rewind로 처음으로 옮겨야 새 내용을 읽을 수 있습니다. 예시의 출력은 `30`입니다. 오류를 찾을 때는 **쓰기 직후 위치를 되돌리지 않고 읽어 EOF를 만남** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
