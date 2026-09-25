---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-03-c-program
courseId: crp-92
phaseId: phase-01
dayNumber: 3
date: "2026-10-03"
title: C 프로그램의 시작점과 printf
summary: C는 어느 함수에서 실행을 시작할지 명확히 정해야 합니다. 입출력 헤더와 main의 역할을 읽어야 오류를 찾을 수 있습니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-02-output-input
learningObjectives:
  - "'C 프로그램의 시작점과 printf' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 형식 지정자 %d에 정수 인수를 전달하지 않음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - c program
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
  - id: ex-day-03-c-program-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? main 시작에서 시작해 계산하세요.
    starter: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 30);\n    return 0;\n}"
    answer: "study: 30"
    hint: main 시작에서 시작해 종료까지 순서대로 적어 보세요. main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다.
    explanation:
      "1. stdio.h가 printf 선언을 제공합니다. 2. main 내부에서 %d에 정수 30을 채웁니다. 3. return 0은 정상 종료를 알립니다. `main 시작 →
      %d에 30 대입 → study: 30 출력 → 종료` 흐름으로 실제 출력 `study: 30`이 됩니다. 핵심 `printf`는 형식 빈자리에 값을 채워 출력하는 자리에 쓰입니다."
    commonMistakes:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-03-c-program-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 프로그램의 시작점과 printf의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: printf"
    starter: "#include <stdio.h>\nint main(void) {\n    _____(\"study: %d\\n\", 30);\n    return 0;\n}"
    answer: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 30);\n    return 0;\n}"
    hint: 필요한 표현은 정수를 지정한 형식으로 출력함 동작을 잇는 printf입니다.
    explanation:
      "빈칸에 들어갈 표현은 'printf'입니다. 이 표현이 없으면 컴파일 단계에서 막혀 실행 자체가 되지 않습니다. 1. stdio.h가 printf 선언을 제공합니다. 2.
      main 내부에서 %d에 정수 30을 채웁니다. 3. return 0은 정상 종료를 알립니다. `main 시작 → %d에 30 대입 → study: 30 출력 → 종료` 흐름으로 실제 출력 `study:
      30`이 됩니다. 핵심 `printf`는 형식 빈자리에 값을 채워 출력하는 자리에 쓰입니다."
    commonMistakes:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-03-c-program-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 30);\n    return 0;\n}"
    answer: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 31);\n    return 0;\n}"
    hint: "처음 등장하는 숫자를 30에서 31로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 'study: 30'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다."
    explanation:
      '바꾼 뒤 출력은 ''study: 31''입니다. 원본은 `study: 30`, 수정본은 `study: 31`이다. 첫 변경 줄 `printf("study: %d\n", 30);`에서
      `printf("study: %d\n", 31);`로 새 값을 만들면, %d 자리에 31이 들어가 출력 문자열이 `study: 31`이 된다.'
    commonMistakes:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-03-c-program-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 형식 지정자 %d에 정수 인수를 전달하지 않음 상황을 확인하세요.
    starter: "#include <stdio.h>\nint main(void) {\n    puts(\"study: %d\\n\", 30);\n    return 0;\n}"
    answer: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 30);\n    return 0;\n}"
    hint: 형식 지정자 %d에 정수 인수를 전달하지 않음 상황에서 어긋나는 줄을 main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다. 설명과 대조해 보세요.
    explanation:
      '틀린 줄은 `puts("study: %d\n", 30);`입니다. `puts`는 문자열 하나만 받는 출력 함수이므로 인수 두 개를 전달한 이 줄에서 컴파일 오류가 나고 실행
      파일 자체가 만들어지지 않아 아무것도 출력되지 않습니다. 오류 분류는 컴파일 오류입니다. 고친 줄 `printf("study: %d\n", 30);`에서는 `%d` 빈자리에 정수 30을 채우는
      `정수를 지정한 형식으로 출력함` 동작이 지켜집니다. 정상 코드는 선언 제공→빈자리 채우기→정상 종료의 3단계를 따라 `study: 30`을 출력합니다.'
    commonMistakes:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-03-c-program-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 C 프로그램의 시작점과 printf 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 프로그램의 시작점과 printf: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: "#include <stdio.h>\nint main(void) {\n    printf(\"study: %d\\n\", 30);\n    return 0;\n}"
    hint:
      '`printf("%d %d\n", 10, 20)`처럼 빈자리 수와 인수 개수가 다르면 약속한 출력이 나오지 않으므로, 개수와 타입을 먼저 맞추세요. 예상 출력과 경계 조건도 함께 적어
      보세요.'
    explanation:
      '입력·처리·출력·경계 조건을 스스로 설계하세요. `printf("%d %d\n", 10, 20)`처럼 빈자리 수와 인수 개수가 다르면 약속한 출력이 나오지 않으므로, 개수와
      타입을 먼저 맞추세요. 같은 정수를 지정한 형식으로 출력함 동작을 구현하고 실행 결과 ''study: 30''와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.'
    commonMistakes:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-03-c-program-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "study: 30"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation:
      "먼저 main이 시작되고 stdio.h의 printf 선언을 씁니다. 이어서 %d 자리에 정수 30이 들어가 `study: 30` 한 줄이 출력되고, return 0으로 정상
      종료하므로 최종 출력 `study: 30`이 됩니다. `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 컴파일과 실행이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데
      printf가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다."
  - id: quiz-day-03-c-program-model
    question: "'C 프로그램의 시작점과 printf' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 형식 지정자 %d에 정수 인수를 전달하지 않음(이것이 정상적인 사용법이다)
      - main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      "main은 프로그램 진입문이라는 뜻은, 운영체제가 이 함수부터 실행을 시작한다는 뜻입니다. printf는 형식 문자열의 빈자리에 값을 채워 출력하므로 `%d`와 30이 만나
      `study: 30`이 됩니다. `형식 지정자 %d에 정수 인수를 전달하지 않음`은 반대 사례인데, 빈자리에 맞는 값이 없으면 약속한 출력이 만들어지지 않기 때문입니다."
  - id: quiz-day-03-c-program-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 형식 지정자 %d에 정수 인수를 전달하지 않음
    answerIndex: 2
    explanation:
      '먼저 확인할 실수는 `형식 지정자 %d에 정수 인수를 전달하지 않음`입니다. 잘못된 코드 `puts("study: %d\n", 30);`은 컴파일 오류가 나므로 화면 출력
      비교 이전에 실행 파일 생성 자체가 막힙니다.'
  - id: quiz-day-03-c-program-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 정수를 지정한 형식으로 출력함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation:
      "세 언어로 옮길 때 보존해야 하는 것은 `정수를 지정한 형식으로 출력함`이라는 의미와 입력·출력 계약입니다. Python에서는 print의 인수로, Rust에서는 println!의
      자리 표시자로 같은 동작을 구현하고, 실행 결과 `study: 30`으로 대조하면 옮김이 맞는지 확인할 수 있습니다."
---

## 오늘 배울 이유

C는 어느 함수에서 실행을 시작할지 명확히 정해야 합니다. 입출력 헤더와 main의 역할을 읽어야 오류를 찾을 수 있습니다. Day 03 "`C 프로그램의 시작점과 printf`"에서는 C 코드의 실행 결과(`study: 30`)를 따라가며, `정수를 지정한 형식으로 출력함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`형식 지정자 %d에 정수 인수를 전달하지 않음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 02](/learn/day-02-output-input)에서 배운 "출력과 입력값의 흐름" 내용을 한 문장으로 말해 보세요. 이번 "`C 프로그램의 시작점과 printf`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `printf`입니다.

## 머릿속 그림

main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다. Day 03에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `printf`입니다.

```text
main 시작  →  %d에 30 대입  →  study: 30 출력  →  종료
```

위 흐름에서 `printf` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `study: 30`입니다.

## 천천히 풀어보기

C 프로그램은 `main` 함수의 첫 줄부터 실행됩니다. `#include <stdio.h>`는 `printf`를 사용한다는 선언을 컴파일러가 알 수 있게 합니다. `printf("study: %d\n", 30)`에서 `%d` 자리에 정수 `30`이 들어가고 `\n`은 다음 줄로 내려갑니다. `return 0`은 프로그램이 정상적으로 끝났다는 뜻입니다. 중괄호 `{}`는 `main`의 시작과 끝을 표시합니다.

`printf("%d %d\n", 10, 20)`이면 빈자리 두 곳에 10과 20이 순서대로 들어갑니다. 형식 지정자는 `printf`가 받는 실제 인수의 개수와 타입에 맞춰야 합니다. `puts`는 문자열을 한 줄 출력할 때 쓸 수 있지만 `%d` 같은 숫자 빈자리를 처리하지는 않습니다.

C 프로그램은 `main` 함수의 첫 줄부터 실행됩니다. `#include <stdio.h>`는 `printf`를 사용한다는 선언을 컴파일러가 알 수 있게 합니다. `printf("study: %d\n", 30)`에서 `%d` 자리에 정수 `30`이 들어가고 `\n`은 다음 줄로 내려갑니다. `return 0`은 프로그램이 정상적으로 끝났다는 뜻입니다. 중괄호는 `main`의 시작과 끝을 표시합니다.

`printf("%d %d\n", 10, 20)`이면 빈자리 두 곳에 10과 20이 순서대로 들어갑니다. 형식 지정자는 `printf`가 받는 실제 인수의 개수와 타입에 맞춰야 합니다. `puts`는 문자열을 한 줄 출력할 때 쓸 수 있지만 `%d` 같은 숫자 빈자리를 처리하지는 않습니다.

## 문법을 예제로 보기

아래 C 코드는 Day 03 "`C 프로그램의 시작점과 printf`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `printf`이며, 실행 결과는 `study: 30`입니다.

```c
#include <stdio.h>
int main(void) {
    printf("study: %d\n", 30);
    return 0;
}
```

예상 출력:

```text
study: 30
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `study: 30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `printf`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     printf("study: %d\n", 30);
 4 |     return 0;
 5 | }
```

1. stdio.h가 printf 선언을 제공합니다
2. main 내부에서 %d에 정수 30을 채웁니다
3. return 0은 정상 종료를 알립니다

`printf` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | main 시작      |
|    2 | %d에 30 대입   |
|    3 | study: 30 출력 |
|    4 | 종료           |

위 순서대로 실행한 최종 출력은 `study: 30`입니다. `main 시작` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`printf("%d + %d = %d\n", 10, 20, 10 + 20);`을 읽어 봅시다. `%d`가 셋이라 뒤의 정수도 셋이며, 자리를 왼쪽부터 순서대로 채워 `10 + 20 = 30`이 출력됩니다. `%d` 셋에 숫자 둘만 준다면 세 번째 칸이 어떻게 채워질지 C가 안전하게 보장하지 않습니다. 형식과 인수의 **개수·타입**을 같이 확인하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `study: 30`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```c
#include <stdio.h>
int main(void) {
    printf("study: %d\n", 31);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
study: 31
```

원본은 `study: 30`, 수정본은 `study: 31`이다. 첫 변경 줄 `printf("study: %d\n", 30);`에서 `printf("study: %d\n", 31);`로 새 값을 만들면, %d 자리에 31이 들어가 출력 문자열이 `study: 31`이 된다.

## 자주 틀리는 지점

**확인할 실수: 형식 지정자 %d에 정수 인수를 전달하지 않음.** 정상 코드의 실행 결과는 `study: 30`입니다.

- 정상 줄: `printf("study: %d\n", 30);`
- 잘못된 줄: `puts("study: %d\n", 30);`

두 줄을 나란히 놓으면 정상 줄 `printf("study: %d\n", 30);`이 `main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다.` 설명과 맞고, 잘못된 줄은 `형식 지정자 %d에 정수 인수를 전달하지 않음` 쪽으로 어긋납니다. 결과가 예상과 다르면 `main 시작`부터 `study: 30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `정수를 지정한 형식으로 출력함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙       |
| ------ | -------------------------------- |
| C17    | stdio.h·main·printf(%d)·return 0 |
| Python | print(30)은 main 선언 없이 실행  |
| Rust   | fn main과 println!("{}", 30)     |

C17에서는 `stdio.h·main·printf(%d)·return 0` 규칙을 적용합니다. "`C 프로그램의 시작점과 printf`" 수업의 실행 결과(`study: 30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `print(30)은 main 선언 없이 실행` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `fn main과 println!("{}", 30)` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`study: 30` 맞히기) → 빈칸(`printf` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`형식 지정자 %d에 정수 인수를 전달하지 않음` 찾기) → 독립 구현(`'C 프로그램의 시작점과 printf' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `study: 30` 및 `printf` 설명과 대조하세요.

## 스스로 설명하기

- "`C 프로그램의 시작점과 printf`" 수업이 필요한 이유는 `정수를 지정한 형식으로 출력함` 동작으로 설명해 보세요.
- 예제에서 `printf` 부분 실행 직전의 상태와 직후의 출력(`study: 30`)을 말해 보세요.
- "`형식 지정자 %d에 정수 인수를 전달하지 않음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `정수를 지정한 형식으로 출력함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

main은 프로그램 진입문이고 printf는 형식 문자열의 빈자리에 값을 채워 출력합니다. Day 03 "`C 프로그램의 시작점과 printf`" 예제의 핵심 부분은 `printf`이며, 실행 결과는 `study: 30`입니다. "`형식 지정자 %d에 정수 인수를 전달하지 않음`" 여부를 확인하고 Day 03 수업을 완료하세요.
