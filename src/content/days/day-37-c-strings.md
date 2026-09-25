---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-37-c-strings
courseId: crp-92
phaseId: phase-04
dayNumber: 37
date: "2026-11-06"
title: C 문자열과 널 종료
summary: C 문자열은 단순 char 배열과 달리 끝을 알리는 널 문자까지 공간이 필요합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-36-rust-slices
learningObjectives:
  - "'C 문자열과 널 종료' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - c strings
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
  - id: ex-day-37-c-strings-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? c a t \0에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    answer: "3"
    hint: word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.
    explanation: c a t \0  →  strlen=3  →  출력. 따라서 출력은 '3'입니다.
    commonMistakes:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-37-c-strings-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'C 문자열과 널 종료' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: strlen(word)"
    starter:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", _____);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    hint: 배열 크기는 널 포함 4입니다
    explanation: 빈칸에 들어갈 표현은 'strlen(word)'입니다. 배열 크기는 널 포함 4입니다 strlen이 널까지 전진합니다 널 이전 길이 3을 출력합니다
    commonMistakes:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-37-c-strings-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 첫 문자열을 'cat'에서 'cat!'로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat!\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 첫 문자열을 'cat'에서 'cat!'로."
    explanation:
      바꾼 뒤 출력은 '4'입니다. 원본 출력 '3'에서 달라졌습니다. 다른 줄(char word[] = "cat"; → char word[] = "cat!";)에서 시작한 차이가
      최종 출력에 반영되었습니다.
    commonMistakes:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-37-c-strings-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음 상황을 확인하세요.
    starter:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", sizeof(word));\n    return 0;\n}"
    answer:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    hint: word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. 배열 크기는 널 포함 4입니다 strlen이 널까지 전진합니다 널 이전 길이 3을 출력합니다
    commonMistakes:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-37-c-strings-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 문자열과 널 종료' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 문자열과 널 종료: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char word[] = \"cat\";\n    printf(\"\
      %zu\\n\", strlen(word));\n    return 0;\n}"
    hint: word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.
    explanation: 한 가지 예시 해법은 위 코드입니다. 핵심은 배열 크기는 널 포함 4입니다 strlen이 널까지 전진합니다 널 이전 길이 3을 출력합니다 다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-37-c-strings-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "3"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: c a t \0  →  strlen=3  →  출력 순서로 실행되어 출력은 '3'입니다.
  - id: quiz-day-37-c-strings-model
    question: "'C 문자열과 널 종료' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.
    answerIndex: 2
    explanation: word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.
  - id: quiz-day-37-c-strings-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-37-c-strings-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 널 종료된 문자열 길이 계산라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 널 종료된 문자열 길이 계산라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

C 문자열은 단순 char 배열과 달리 끝을 알리는 널 문자까지 공간이 필요합니다. Day 37 "`C 문자열과 널 종료`"에서는 C 코드의 실행 결과(`3`)를 따라가며, `널 종료된 문자열 길이 계산` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 36](/learn/day-36-rust-slices)에서 배운 "Rust 슬라이스와 범위" 내용을 한 문장으로 말해 보세요. 이번 "`C 문자열과 널 종료`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `strlen(word)`입니다.

## 머릿속 그림

word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다. Day 37에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `strlen(word)`입니다.

```text
c a t \0  →  strlen=3  →  출력
```

위 흐름에서 `strlen(word)` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `3`입니다.

## 천천히 풀어보기

C 문자열 `char word[] = "cat"`은 네 바이트입니다: `'c'`, `'a'`, `'t'`, 마지막 `\0`입니다. `strlen(word)`은 처음 `\0`을 만날 때까지 세므로 결과는 3입니다. 문자 세 개와 저장 공간 네 칸을 구분해야 합니다.

직접 문자를 채울 때 종료 문자 `\0`을 잊으면 문자열 함수가 배열 밖까지 읽을 수 있습니다. 길이 3의 배열에 `"cat"`을 담으려 하면 종료 칸이 부족합니다. 화면에 보이는 글자 수만 보고 메모리 크기를 정하지 마세요. 한글의 UTF-8 바이트 수는 영문 글자 수와 다를 수도 있습니다.

## 문법을 예제로 보기

아래 C 코드는 Day 37 "`C 문자열과 널 종료`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `strlen(word)`이며, 실행 결과는 `3`입니다.

```c
#include <stdio.h>
#include <string.h>
int main(void) {
    char word[] = "cat";
    printf("%zu\n", strlen(word));
    return 0;
}
```

예상 출력:

```text
3
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `3`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `strlen(word)`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | #include <string.h>
 3 | int main(void) {
 4 |     char word[] = "cat";
 5 |     printf("%zu\n", strlen(word));
 6 |     return 0;
 7 | }
```

1. 배열 크기는 널 포함 4입니다
2. strlen이 널까지 전진합니다
3. 널 이전 길이 3을 출력합니다

`strlen(word)` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | c a t \0       |
|    2 | strlen=3       |
|    3 | 출력           |

위 순서대로 실행한 최종 출력은 `3`입니다. `c a t \0` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`char word[] = "hi";`는 보이는 h·i 두 글자에 마지막 `\0`까지 세 칸을 사용합니다. `strlen(word)`는 2이고 `sizeof word`는 3입니다. `char word[2] = {'h','i'};`는 종료 문자가 없으니 그대로 문자열 함수에 넘기지 마세요. **배열 크기와 문자열 길이**를 숫자 하나로 뭉뚱그리면 위험합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `3`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```c
#include <stdio.h>
#include <string.h>
int main(void) {
    char word[] = "cat!";
    printf("%zu\n", strlen(word));
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
4
```

원본과 달라졌습니다. 원본 출력은 `3`입니다. 다른 줄(`char word[] = "cat";` → `char word[] = "cat!";`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`c a t \0` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음.** 정상 코드의 실행 결과는 `3`입니다.

- 정상 줄: `printf("%zu\n", strlen(word));`
- 잘못된 줄: `printf("%zu\n", sizeof(word));`

두 줄을 나란히 놓고 `word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `c a t \0`부터 `3`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `널 종료된 문자열 길이 계산`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | char[]와 '\0', strlen          |
| Python | str은 길이를 직접 관리         |
| Rust   | String.len은 UTF-8 바이트 길이 |

C17에서는 `char[]와 '\0', strlen` 규칙을 적용합니다. "`C 문자열과 널 종료`" 수업의 실행 결과(`3`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `str은 길이를 직접 관리` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `String.len은 UTF-8 바이트 길이` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`3` 맞히기) → 빈칸(`strlen(word)` 채우기) → 변경(`첫 문자열을 'cat'에서 'cat!'로`) → 오류 수정(`널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음` 찾기) → 독립 구현(`'C 문자열과 널 종료' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `3` 및 `strlen(word)` 설명과 대조하세요.

## 스스로 설명하기

- "`C 문자열과 널 종료`" 수업이 필요한 이유는 `널 종료된 문자열 길이 계산` 동작으로 설명해 보세요.
- 예제에서 `strlen(word)` 부분 실행 직전의 상태와 직후의 출력(`3`)을 말해 보세요.
- "`널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `널 종료된 문자열 길이 계산` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

word에는 c,a,t,\0 네 바이트가 들어 있고 strlen은 널 이전의 글자 세 개만 셉니다. Day 37 "`C 문자열과 널 종료`" 예제의 핵심 부분은 `strlen(word)`이며, 실행 결과는 `3`입니다. "`널 종료가 없는 버퍼를 strlen에 넘겨 범위 밖을 읽음`" 여부를 확인하고 Day 37 수업을 완료하세요.
