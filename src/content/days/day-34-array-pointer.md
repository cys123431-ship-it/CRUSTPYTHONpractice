---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-34-array-pointer
courseId: crp-92
phaseId: phase-04
dayNumber: 34
date: "2026-11-03"
title: C 배열 매개변수와 길이
summary: 함수에 C 배열을 전달하면 배열 길이가 자동으로 따라가지 않아 별도의 길이 인자가 필요합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-33-shared-borrow
learningObjectives:
  - "'C 배열 매개변수와 길이' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - array pointer
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
  - id: ex-day-34-array-pointer-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? i=0 out=2에서 시작해 계산하세요.
    starter: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    answer: "12"
    hint: a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.
    explanation: i=0 out=2  →  i=1 out=6  →  i=2 out=12. 따라서 출력은 '12'입니다.
    commonMistakes:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-34-array-pointer-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: C 배열 매개변수와 길이의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: i<n"
    starter: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;_____;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    answer: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    hint: a의 첫 주소와 길이 3을 전달합니다
    explanation: 빈칸에는 'i<n'이 들어갑니다. a의 첫 주소와 길이 3을 전달합니다 i=0,1,2에서 2+4+6을 누적합니다 i=3에서 멈추고 12를 반환합니다
    commonMistakes:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-34-array-pointer-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 0에서 1로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    answer: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=1; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    hint: 처음 등장하는 숫자를 0에서 1로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 0에서 1로 바꿨습니다. 원래 출력은 '12'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-34-array-pointer-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음 상황을 확인하세요.
    starter: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<=n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    answer: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    hint: a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. a의 첫 주소와 길이 3을 전달합니다 i=0,1,2에서 2+4+6을 누적합니다 i=3에서 멈추고 12를 반환합니다
    commonMistakes:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-34-array-pointer-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'C 배열 매개변수와 길이' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// C 배열 매개변수와 길이: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: '#include <stdio.h>

      #include <stddef.h>

      int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }

      int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }'
    hint: a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 a의 첫 주소와 길이 3을 전달합니다 i=0,1,2에서 2+4+6을 누적합니다 i=3에서 멈추고 12를 반환합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-34-array-pointer-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "12"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: i=0 out=2  →  i=1 out=6  →  i=2 out=12 순서로 실행되어 '12'을 출력합니다.
  - id: quiz-day-34-array-pointer-model
    question: C 배열 매개변수와 길이을 이해하는 데 맞는 설명은?
    choices:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.
    answerIndex: 2
    explanation: a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.
  - id: quiz-day-34-array-pointer-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-34-array-pointer-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 배열과 길이를 함께 전달함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 배열과 길이를 함께 전달함라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

함수에 C 배열을 전달하면 배열 길이가 자동으로 따라가지 않아 별도의 길이 인자가 필요합니다. Day 34 "`C 배열 매개변수와 길이`"에서는 C 코드가 `12`을(를) 만드는 과정을 따라가며, 배열과 길이를 함께 전달함 동작이 왜 필요한지 확인합니다. 배열과 길이를 함께 전달함을(를) 빠뜨리면 `배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 33](/learn/day-33-shared-borrow)에서는 "공유 빌림과 참조"을(를) 배웠습니다. "공유 빌림과 참조"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`C 배열 매개변수와 길이`"에서 새로 달라지는 조건을 찾아보세요. Day 34의 답은 `12`이며, 핵심 표현은 `i<n`입니다.

## 머릿속 그림

a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다. Day 34에서는 아래 흐름 순서대로 상태가 바뀌며, `i<n`이(가) 결과를 가릅니다.

```text
i=0 out=2  →  i=1 out=6  →  i=2 out=12
```

위 흐름에서 `i<n`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `12`입니다.

## 천천히 풀어보기

`sum(const int *a, size_t n)` 같은 함수에 배열을 넘기면 첫 원소를 가리키는 포인터가 전달됩니다. 함수 안에서 포인터만 보고 전체 배열의 길이를 자동으로 알아낼 수 없으니 호출자가 `n`도 함께 줘야 합니다. `n=3`이면 접근 가능한 원소 번호는 0, 1, 2입니다.

`i < n`은 마지막 번호 2까지 방문한 뒤 멈추지만 `i <= n`은 범위 밖 `a[3]`까지 시도합니다. `const int *`라면 그 포인터를 통해 원소를 수정하지 않겠다는 뜻입니다. 길이 0인 배열도 다룰 수 있게 합계의 시작값과 반복 종료를 확인하세요.

## 문법을 예제로 보기

아래 C 코드는 Day 34 "`C 배열 매개변수와 길이`"의 독립 예제입니다. 전체 4줄에서 `i<n`이(가) 핵심이며, 실행 결과는 `12`입니다.

```c
#include <stdio.h>
#include <stddef.h>
int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }
int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }
```

예상 출력:

```text
12
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 `12`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `i<n`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | #include <stddef.h>
 3 | int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }
 4 | int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }
```

1. a의 첫 주소와 길이 3을 전달합니다
2. i=0,1,2에서 2+4+6을 누적합니다
3. i=3에서 멈추고 12를 반환합니다

위 단계에서 `i<n`이(가) 빠지면 `12`이(가) 나오지 않습니다. `처음 등장하는 숫자를 0에서 1로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | i=0 out=2      |
|    2 | i=1 out=6      |
|    3 | i=2 out=12     |

위 순서대로 실행하면 최종 출력 `12`이(가) 됩니다. `i=0 out=2` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

함수 `sum(const int *a, size_t n)`에 `{4,5,6}`과 길이 3을 넘기면 `a[0]+a[1]+a[2] = 15`입니다. 같은 포인터에 길이 4를 잘못 넘기면 함수가 없는 네 번째 원소까지 읽습니다. 포인터 값만큼이나 **호출자가 알려 주는 길이**가 정확해야 하므로 두 값을 한 세트로 기록하세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 0에서 1로` 바꾸면 아래와 같이 됩니다.

```c
#include <stdio.h>
#include <stddef.h>
int sum(const int *a, size_t n) { int out=1; for (size_t i=0;i<n;i++) out+=a[i]; return out; }
int main(void) { int a[]={2,4,6}; printf("%d\n",sum(a,3)); return 0; }
```

원본 출력은 `12`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `i<n`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 34의 `C 배열 매개변수와 길이`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음.** 정상 코드에서는 `12`이(가) 출력됩니다.

- 정상 줄: `int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<n;i++) out+=a[i]; return out; }`
- 잘못된 줄: `int sum(const int *a, size_t n) { int out=0; for (size_t i=0;i<=n;i++) out+=a[i]; return out; }`

두 줄을 나란히 놓고 `a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `i=0 out=2`부터 `12`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **배열과 길이를 함께 전달함**은(는) 세 언어에서 같은 입력과 출력(`12`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙          |
| ------ | ----------------------------------- |
| C17    | const int *a, size_t n              |
| Python | list 객체가 길이를 알고 len(a) 가능 |
| Rust   | &[i32] slice가 길이를 보유          |

C17에서는 `const int *a, size_t n` 규칙으로 "`C 배열 매개변수와 길이`"의 `12`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `list 객체가 길이를 알고 len(a) 가능` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `&[i32] slice가 길이를 보유` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`12` 맞히기) → 빈칸(`i<n` 채우기) → 변경(`처음 등장하는 숫자를 0에서 1로`) → 오류 수정(`배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음` 찾기) → 독립 구현(`C 배열 매개변수와 길이을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `12` 및 `i<n` 설명과 대조하세요.

## 스스로 설명하기

- "`C 배열 매개변수와 길이`"이(가) 필요한 상황을 `배열과 길이를 함께 전달함` 동작으로 설명해 보세요.
- 예제에서 `i<n`이(가) 실행되기 직전의 상태와 직후의 출력 `12`을(를) 말해 보세요.
- "`배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `배열과 길이를 함께 전달함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

a는 첫 원소를 가리키고 n은 읽을 수 있는 원소 개수입니다. 인덱스는 0부터 n-1까지입니다. Day 34 "`C 배열 매개변수와 길이`"의 예제는 `i<n`을(를) 실행해 `12`을(를) 출력합니다. "`배열 끝 인덱스를 n으로 착각해 한 칸 넘겨 읽음`" 여부를 확인하고 Day 34을(를) 완료하세요.
