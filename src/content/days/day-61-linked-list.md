---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-61-linked-list
courseId: crp-92
phaseId: phase-06
dayNumber: 61
date: "2026-11-30"
title: 단일 연결 리스트의 다음 노드
summary: 노드가 다음 노드의 주소를 보유하면 메모리에서 연속되지 않아도 순서를 만들 수 있습니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-60-circular-queue
learningObjectives:
  - "'단일 연결 리스트의 다음 노드' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: NULL인 next를 검사하지 않고 역참조함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - linked list
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
  - id: ex-day-61-linked-list-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? first(10)에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n\
      \    Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n\
      }"
    answer: "20"
    hint: first(10)에서 시작해 출력까지 순서대로 적어 보세요. first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다.
    explanation:
      1. last는 값 20과 비어 있음 표시를 가집니다. 2. first의 next를 마지막 노드 주소로 초기화합니다. 3. 다음 노드의 20을 출력합니다. `first(10)
      → next=마지막 주소 → last(20) → 출력` 흐름으로 실제 출력 `20`이 됩니다. 핵심 `first.next->value`는 주소를 따라가 값을 읽는 두 단계 자리에 쓰입니다.
    commonMistakes:
      - NULL인 next를 검사하지 않고 역참조함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-61-linked-list-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 단일 연결 리스트의 다음 노드의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: first.next->value"
    starter:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n\
      \    Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", _____);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n \
      \   Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n}"
    hint: 필요한 표현은 주소 링크를 따라 다음 노드 방문 동작을 잇는 first.next->value입니다.
    explanation:
      빈칸에 들어갈 표현은 'first.next->value'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. last는 값 20과 비어 있음 표시를 가집니다. 2. first의
      next를 마지막 노드 주소로 초기화합니다. 3. 다음 노드의 20을 출력합니다. `first(10) → next=마지막 주소 → last(20) → 출력` 흐름으로 실제 출력 `20`이 됩니다.
      핵심 `first.next->value`는 주소를 따라가 값을 읽는 두 단계 자리에 쓰입니다.
    commonMistakes:
      - NULL인 next를 검사하지 않고 역참조함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-61-linked-list-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 20에서 21로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n\
      \    Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n\
      }"
    answer:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n \
      \   Node last={21,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n}"
    hint: 처음 등장하는 숫자를 20에서 21로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '20'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '21'입니다. 원본은 `20`, 수정본은 `21`이다. 첫 변경 줄의 `Node last={20,NULL};`에서 `Node last={21,NULL};`로
      마지막 값을 바꾸면, 따라간 주소의 값이 달라져 출력이 달라진다.
    commonMistakes:
      - NULL인 next를 검사하지 않고 역참조함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-61-linked-list-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 NULL인 next를 검사하지 않고 역참조함 상황을 확인하세요.
    starter:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n\
      \    Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.value);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n \
      \   Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n}"
    hint: NULL인 next를 검사하지 않고 역참조함 상황에서 어긋나는 줄을 first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `printf("%d\n", first.value);`입니다. 다음 노드를 따라가지 않고 첫 노드 값을 읽으므로 실행은 되지만 결과는 `10`이 됩니다. 오류 분류는
      잘못된 출력입니다. 링크를 따라가지 않은 첫 순간은 점 연산자 뒤 이름입니다. 고친 줄 `printf("%d\n", first.next->value);`에서는 `주소 링크를 따라 다음 노드 방문`
      동작이 지켜집니다. 정상 코드는 노드 연결→주소 이동→값 읽기의 순서로 `20`을 출력합니다.
    commonMistakes:
      - NULL인 next를 검사하지 않고 역참조함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-61-linked-list-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 단일 연결 리스트의 다음 노드 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 단일 연결 리스트의 다음 노드: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\ntypedef struct Node { int value; struct Node *next; } Node;\nint main(void) {\n \
      \   Node last={20,NULL}; Node first={10,&last};\n    printf(\"%d\\n\", first.next->value);\n    return 0;\n}"
    hint: 함수가 끝난 뒤 지역 노드 주소를 쓰면 안 됩니다. 동적 할당 노드는 순회하며 각각 해제하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 함수가 끝난 뒤 지역 노드 주소를 쓰면 안 됩니다. 동적 할당 노드는 순회하며 각각 해제하세요. 같은 주소 링크를 따라 다음
      노드 방문 동작을 구현하고 실행 결과 '20'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - NULL인 next를 검사하지 않고 역참조함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-61-linked-list-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "20"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 last에 20과 비어 있음 표시가 저장됩니다. 이어서 first의 next가 last를 가리키고, 따라가 읽은 20을 출력하므로 `20`이 됩니다. `실행 전에 반드시
      오류가 난다`는 틀린 선택지인데 연결과 역참조가 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 printf가 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지
      않습니다.
  - id: quiz-day-61-linked-list-model
    question: "'단일 연결 리스트의 다음 노드' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - NULL인 next를 검사하지 않고 역참조함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다.
    answerIndex: 2
    explanation:
      first.next는 last의 주소라는 뜻이고, 화살표는 포인터를 통해 last.value를 읽는다는 뜻은 두 단계로 값을 찾는다는 뜻입니다. `NULL인 next를 검사하지
      않고 역참조함`은 반대 사례인데, `NULL`을 따라가면 잘못되기 때문입니다.
  - id: quiz-day-61-linked-list-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - NULL인 next를 검사하지 않고 역참조함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 먼저 확인할 실수는 `NULL인 next를 검사하지 않고 역참조함`입니다. 잘못된 코드는 실행은 되지만 `10`이라는 잘못된 출력을 냅니다. 따라간 주소가 유효한지 먼저 확인하세요.
  - id: quiz-day-61-linked-list-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 주소 링크를 따라 다음 노드 방문라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `주소 링크를 따라 다음 노드 방문`이라는 의미와 입력·출력 계약입니다. Python의 next 참조와 Rust의 Box 링크로 같은
      동작을 구현하고, 실행 결과 `20`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

노드가 다음 노드의 주소를 보유하면 메모리에서 연속되지 않아도 순서를 만들 수 있습니다. Day 61 "`단일 연결 리스트의 다음 노드`"에서는 C 코드의 실행 결과(`20`)를 따라가며, `주소 링크를 따라 다음 노드 방문` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`NULL인 next를 검사하지 않고 역참조함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 60](/learn/day-60-circular-queue)에서 배운 "원형 큐의 머리·꼬리" 내용을 한 문장으로 말해 보세요. 이번 "`단일 연결 리스트의 다음 노드`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `first.next->value`입니다.

## 머릿속 그림

first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다. Day 61에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `first.next->value`입니다.

```text
first(10)  →  next=&last  →  last(20)  →  출력
```

위 흐름에서 `first.next->value` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `20`입니다.

## 천천히 풀어보기

연결 리스트의 노드는 값과 **다음 노드의 주소**를 함께 가집니다. `first.next = &last`라면 첫 노드의 `next`가 마지막 노드를 가리킵니다. `first.next->value`는 'next 주소를 따라간 다음 그 노드의 value를 읽는다'는 두 단계입니다. `(*first.next).value`로 써도 같은 뜻입니다.

| 노드  | value | next    |
| ----- | ----: | ------- |
| first |    10 | `&last` |
| last  |    20 | `NULL`  |

따라서 first에서 출발하면 10, 이어서 20, 다음 주소가 `NULL`이므로 끝납니다. `NULL->value`를 읽으려 하면 잘못됩니다. 여기 예제는 지역 변수로 만든 두 노드를 연결하므로 함수가 끝난 뒤에는 그 주소를 사용할 수 없습니다. 동적 할당한 노드라면 잃어버리기 전에 모든 노드를 순회해 각각 해제하는 책임도 생깁니다.

연결 리스트의 노드는 값과 다음 노드의 주소를 함께 가집니다. `first.next = &last`라면 첫 노드의 `next`가 마지막 노드를 가리킵니다. `first.next->value`는 next 주소를 따라간 다음 그 노드의 value를 읽는다는 두 단계입니다.

따라서 first에서 출발하면 10, 이어서 20, 다음 주소가 `NULL`이므로 끝납니다. `NULL`을 읽으려 하면 잘못됩니다. 여기 예제는 지역 변수로 만든 두 노드를 연결하므로 함수가 끝난 뒤에는 그 주소를 사용할 수 없습니다. 동적 할당한 노드라면 잃어버리기 전에 모든 노드를 순회해 각각 해제하는 책임도 생깁니다.

## 문법을 예제로 보기

아래 C 코드는 Day 61 "`단일 연결 리스트의 다음 노드`"의 독립 예제입니다. 전체 7줄 가운데 핵심 부분은 `first.next->value`이며, 실행 결과는 `20`입니다.

```c
#include <stdio.h>
typedef struct Node { int value; struct Node *next; } Node;
int main(void) {
    Node last={20,NULL}; Node first={10,&last};
    printf("%d\n", first.next->value);
    return 0;
}
```

예상 출력:

```text
20
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `20`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `first.next->value`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```c
 1 | #include <stdio.h>
 2 | typedef struct Node { int value; struct Node *next; } Node;
 3 | int main(void) {
 4 |     Node last={20,NULL}; Node first={10,&last};
 5 |     printf("%d\n", first.next->value);
 6 |     return 0;
 7 | }
```

1. last는 값 20과 NULL을 가집니다
2. first의 next를 &last로 초기화합니다
3. 다음 노드의 20을 출력합니다

`first.next->value` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | first(10)      |
|    2 | next=&last     |
|    3 | last(20)       |
|    4 | 출력           |

위 순서대로 실행한 최종 출력은 `20`입니다. `first(10)` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

A(값 7)의 `next`가 B(값 9)의 주소라면 `A.next->value`는 9입니다. 먼저 `A.next`로 B를 찾고 그다음 `->value`로 9를 읽습니다. B.next가 `NULL`이면 다음 방문은 여기서 멈춰야 하며 `B.next->value`를 읽으려 하면 유효한 노드가 없습니다.

## 시간과 공간 복잡도

연결 리스트에서 A의 next로 B를 찾아 값을 읽는 이동은 한 칸씩 따라가므로 위치 찾기까지 O(n)입니다. 맨 앞에 끼우는 삽입 자체는 O(1)입니다. B의 next가 NULL이면 거기서 멈추고 더 읽으면 안 됩니다. n개 노드의 공간은 O(n)입니다. Day 61의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `20`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```c
#include <stdio.h>
typedef struct Node { int value; struct Node *next; } Node;
int main(void) {
    Node last={21,NULL}; Node first={10,&last};
    printf("%d\n", first.next->value);
    return 0;
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
21
```

원본은 `20`, 수정본은 `21`이다. 첫 변경 줄의 `Node last={20,NULL};`에서 `Node last={21,NULL};`로 마지막 값을 바꾸면, 따라간 주소의 값이 달라져 출력이 달라진다.

## 자주 틀리는 지점

**확인할 실수: NULL인 next를 검사하지 않고 역참조함.** 정상 코드의 실행 결과는 `20`입니다.

- 정상 줄: `printf("%d\n", first.next->value);`
- 잘못된 줄: `printf("%d\n", first.value);`

두 줄을 나란히 놓으면 정상 줄 `printf("%d\n", first.next->value);`이 `first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다.` 설명과 맞고, 잘못된 줄은 `NULL인 next를 검사하지 않고 역참조함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `first(10)`부터 `20`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `주소 링크를 따라 다음 노드 방문`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙         |
| ------ | ---------------------------------- |
| C17    | Node *next와 NULL 경계 검사        |
| Python | 객체의 next 속성으로 참조 연결     |
| Rust   | Option<Box<Node>>로 단일 소유 연결 |

C17에서는 `Node *next와 NULL 경계 검사` 규칙을 적용합니다. "`단일 연결 리스트의 다음 노드`" 수업의 실행 결과(`20`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `객체의 next 속성으로 참조 연결` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `Option<Box<Node>>로 단일 소유 연결` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`20` 맞히기) → 빈칸(`first.next->value` 채우기) → 변경(`처음 등장하는 숫자를 20에서 21로`) → 오류 수정(`NULL인 next를 검사하지 않고 역참조함` 찾기) → 독립 구현(`'단일 연결 리스트의 다음 노드' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `20` 및 `first.next->value` 설명과 대조하세요.

## 스스로 설명하기

- "`단일 연결 리스트의 다음 노드`" 수업이 필요한 이유는 `주소 링크를 따라 다음 노드 방문` 동작으로 설명해 보세요.
- 예제에서 `first.next->value` 부분 실행 직전의 상태와 직후의 출력(`20`)을 말해 보세요.
- "`NULL인 next를 검사하지 않고 역참조함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `주소 링크를 따라 다음 노드 방문` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

first.next는 last의 주소이고 ->는 포인터를 통해 last.value를 읽습니다. Day 61 "`단일 연결 리스트의 다음 노드`" 예제의 핵심 부분은 `first.next->value`이며, 실행 결과는 `20`입니다. "`NULL인 next를 검사하지 않고 역참조함`" 여부를 확인하고 Day 61 수업을 완료하세요.
