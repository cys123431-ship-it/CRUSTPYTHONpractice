---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-60-circular-queue
courseId: crp-92
phaseId: phase-06
dayNumber: 60
date: "2026-11-29"
title: 원형 큐의 머리·꼬리
summary: 고정 배열을 대기열로 재사용하려면 끝에서 다시 처음으로 돌아가는 인덱스가 필요합니다. C 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: c
transferLanguages:
  - python
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-59-queue
learningObjectives:
  - "'원형 큐의 머리·꼬리' 개념이 필요한 상황을 예로 든다."
  - C 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 나머지 연산을 빼먹어 배열 경계를 넘음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - circular queue
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
  - id: ex-day-60-circular-queue-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? head=2에서 시작해 계산하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    answer: "10"
    hint: 인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.
    explanation: head=2  →  다음 인덱스=0  →  값 10. 따라서 출력은 '10'입니다.
    commonMistakes:
      - 나머지 연산을 빼먹어 배열 경계를 넘음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: none
  - id: ex-day-60-circular-queue-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: 원형 큐의 머리·꼬리의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: (head + 1) % 3"
    starter:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[_____]);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    hint: head는 마지막 인덱스 2입니다
    explanation: 빈칸에는 '(head + 1) % 3'이 들어갑니다. head는 마지막 인덱스 2입니다 3%3으로 위치 0을 얻습니다 buffer[0]=10을 출력합니다
    commonMistakes:
      - 나머지 연산을 빼먹어 배열 경계를 넘음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-60-circular-queue-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 3에서 4로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int buffer[4] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    hint: 처음 등장하는 숫자를 3에서 4로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 3에서 4로 바꿨습니다. 원래 출력은 '10'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 나머지 연산을 빼먹어 배열 경계를 넘음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-60-circular-queue-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 나머지 연산을 빼먹어 배열 경계를 넘음 상황을 확인하세요.
    starter:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[head + 1]);\n    return 0;\n}"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    hint: 인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. head는 마지막 인덱스 2입니다 3%3으로 위치 0을 얻습니다 buffer[0]=10을 출력합니다
    commonMistakes:
      - 나머지 연산을 빼먹어 배열 경계를 넘음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
  - id: ex-day-60-circular-queue-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '원형 큐의 머리·꼬리' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// 원형 큐의 머리·꼬리: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "#include <stdio.h>\nint main(void) {\n    int buffer[3] = {10,20,30};\n    int head = 2;\n    printf(\"\
      %d\\n\", buffer[(head + 1) % 3]);\n    return 0;\n}"
    hint: 인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 head는 마지막 인덱스 2입니다 3%3으로 위치 0을 얻습니다 buffer[0]=10을 출력합니다 다른 코드도 결과와 근거가 맞으면
      가능합니다.
    commonMistakes:
      - 나머지 연산을 빼먹어 배열 경계를 넘음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: c
    verification: run
quiz:
  - id: quiz-day-60-circular-queue-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "10"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation: head=2  →  다음 인덱스=0  →  값 10 순서로 실행되어 '10'을 출력합니다.
  - id: quiz-day-60-circular-queue-model
    question: 원형 큐의 머리·꼬리을 이해하는 데 맞는 설명은?
    choices:
      - 나머지 연산을 빼먹어 배열 경계를 넘음(이것이 정상적인 사용법이다)
      - 인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation: 인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.
  - id: quiz-day-60-circular-queue-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 나머지 연산을 빼먹어 배열 경계를 넘음
    answerIndex: 2
    explanation: 나머지 연산을 빼먹어 배열 경계를 넘음. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-60-circular-queue-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 인덱스를 용량 안에서 순환시킴라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation: 문법은 달라도 인덱스를 용량 안에서 순환시킴라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

고정 배열을 대기열로 재사용하려면 끝에서 다시 처음으로 돌아가는 인덱스가 필요합니다. Day 60 "`원형 큐의 머리·꼬리`"에서는 C 코드가 `10`을(를) 만드는 과정을 따라가며, 인덱스를 용량 안에서 순환시킴 동작이 왜 필요한지 확인합니다. 인덱스를 용량 안에서 순환시킴을(를) 빠뜨리면 `나머지 연산을 빼먹어 배열 경계를 넘음` 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 59](/learn/day-59-queue)에서는 "큐와 선입선출"을(를) 배웠습니다. "큐와 선입선출"의 핵심 결과를 한 문장으로 말해 보고, 이번 "`원형 큐의 머리·꼬리`"에서 새로 달라지는 조건을 찾아보세요. Day 60의 답은 `10`이며, 핵심 표현은 `(head + 1) % 3`입니다.

## 머릿속 그림

인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다. Day 60에서는 아래 흐름 순서대로 상태가 바뀌며, `(head + 1) % 3`이(가) 결과를 가릅니다.

```text
head=2  →  다음 인덱스=0  →  값 10
```

위 흐름에서 `(head + 1) % 3`이(가) 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `10`입니다.

## 천천히 풀어보기

크기 3짜리 원형 큐를 바닥에 0, 1, 2번 칸이 있는 회전판으로 생각하세요. `head`가 2일 때 다음 칸은 `(2 + 1) % 3 = 0`입니다. 배열 끝에서 다시 처음으로 돌아가지만 **기존 항목을 덮어써도 된다는 뜻은 아닙니다**.

| 현재 칸 | 다음 칸 계산 | 다음 칸 |
| ------: | ------------ | ------: |
|       0 | `(0+1)%3`    |       1 |
|       1 | `(1+1)%3`    |       2 |
|       2 | `(2+1)%3`    |       0 |

`head == tail`만으로 비어 있는지 가득 찼는지 구별하려면 추가 규칙이 필요합니다. 항목 수 `count`를 따로 두거나 한 칸을 항상 비워 두는 방식 중 하나를 정하세요. 예제의 인덱스 이동이 데이터의 순서 보존과 어떻게 연결되는지도 그려 보세요.

## 문법을 예제로 보기

아래 C 코드는 Day 60 "`원형 큐의 머리·꼬리`"의 독립 예제입니다. 전체 7줄에서 `(head + 1) % 3`이(가) 핵심이며, 실행 결과는 `10`입니다.

```c
#include <stdio.h>
int main(void) {
    int buffer[3] = {10,20,30};
    int head = 2;
    printf("%d\n", buffer[(head + 1) % 3]);
    return 0;
}
```

예상 출력:

```text
10
```

C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 `10`이(가) 나옵니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `(head + 1) % 3`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```c
 1 | #include <stdio.h>
 2 | int main(void) {
 3 |     int buffer[3] = {10,20,30};
 4 |     int head = 2;
 5 |     printf("%d\n", buffer[(head + 1) % 3]);
 6 |     return 0;
 7 | }
```

1. head는 마지막 인덱스 2입니다
2. 3%3으로 위치 0을 얻습니다
3. buffer[0]=10을 출력합니다

위 단계에서 `(head + 1) % 3`이(가) 빠지면 `10`이(가) 나오지 않습니다. `처음 등장하는 숫자를 3에서 4로` 실험에서 어느 줄부터 달라지는지 직접 확인하세요.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | head=2         |
|    2 | 다음 인덱스=0  |
|    3 | 값 10          |

위 순서대로 실행하면 최종 출력 `10`이(가) 됩니다. `head=2` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

원형 큐 용량이 3이고 머리 위치가 2라면 다음 위치는 `(2+1)%3=0`입니다. 숫자 0으로 돌아왔더라도 아직 0번 칸에 **처리되지 않은 값이 있다면 덮어쓰면 안 됩니다.** 빈 상태·가득 찬 상태를 항목 수 `count`로 구별한다고 정하면 `count=3`에서 새 삽입을 거부합니다.

## 시간과 공간 복잡도

원형 큐는 머리 위치를 (head+1)%용량으로 옮겨 빈칸 없이 돌아오므로 삽입과 제거가 O(1)입니다. 숫자 0으로 돌아왔다고 비었다는 뜻이 아닙니다. 항목 수 count로 가득 참과 빔을 구별합니다. 용량이 k이면 공간은 O(k)입니다. Day 60의 핵심 연산을 위 기준으로 직접 세어 보세요.

## 결과 예측과 작은 변경

원본 코드에서 `처음 등장하는 숫자를 3에서 4로` 바꾸면 아래와 같이 됩니다.

```c
#include <stdio.h>
int main(void) {
    int buffer[4] = {10,20,30};
    int head = 2;
    printf("%d\n", buffer[(head + 1) % 3]);
    return 0;
}
```

원본 출력은 `10`입니다. 바꾼 코드를 실행하기 전에 출력이 어떻게 달라질지 먼저 적어 보세요. 출력이 같았다면 `(head + 1) % 3`이(가) 결과에 영향을 주지 않은 이유를, 달라졌다면 처음 달라진 중간 값을 설명하세요. Day 60의 `원형 큐의 머리·꼬리`에서 바뀐 줄부터 다시 추적하세요.

## 자주 틀리는 지점

**확인할 실수: 나머지 연산을 빼먹어 배열 경계를 넘음.** 정상 코드에서는 `10`이(가) 출력됩니다.

- 정상 줄: `printf("%d\n", buffer[(head + 1) % 3]);`
- 잘못된 줄: `printf("%d\n", buffer[head + 1]);`

두 줄을 나란히 놓고 `인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `head=2`부터 `10`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

핵심 동작 **인덱스를 용량 안에서 순환시킴**은(는) 세 언어에서 같은 입력과 출력(`10`)으로 유지됩니다. 선언과 오류 처리는 언어마다 다릅니다.

| 언어   | 옮길 때 확인할 표현과 규칙           |
| ------ | ------------------------------------ |
| C17    | (index+1)%capacity와 full/empty 구별 |
| Python | deque가 내부 순환을 관리             |
| Rust   | VecDeque가 head/tail 관리            |

C17에서는 `(index+1)%capacity와 full/empty 구별` 규칙으로 "`원형 큐의 머리·꼬리`"의 `10`을(를) 확인하고, 범위를 벗어난 접근은 직접 막아야 합니다. Python에서는 `deque가 내부 순환을 관리` 규칙을 따르고, 실패나 빈 입력은 예외로 드러내 조용히 넘기지 마세요. Rust에서는 `VecDeque가 head/tail 관리` 규칙을 따르고, 빌림과 범위 검사를 컴파일 때 확인하세요.

## 실습 순서

예측(`10` 맞히기) → 빈칸(`(head + 1) % 3` 채우기) → 변경(`처음 등장하는 숫자를 3에서 4로`) → 오류 수정(`나머지 연산을 빼먹어 배열 경계를 넘음` 찾기) → 독립 구현(`원형 큐의 머리·꼬리을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `10` 및 `(head + 1) % 3` 설명과 대조하세요.

## 스스로 설명하기

- "`원형 큐의 머리·꼬리`"이(가) 필요한 상황을 `인덱스를 용량 안에서 순환시킴` 동작으로 설명해 보세요.
- 예제에서 `(head + 1) % 3`이(가) 실행되기 직전의 상태와 직후의 출력 `10`을(를) 말해 보세요.
- "`나머지 연산을 빼먹어 배열 경계를 넘음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `인덱스를 용량 안에서 순환시킴` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

인덱스는 용량으로 나눈 나머지로 순환합니다. head=2의 다음 위치는 (2+1)%3=0입니다. Day 60 "`원형 큐의 머리·꼬리`"의 예제는 `(head + 1) % 3`을(를) 실행해 `10`을(를) 출력합니다. "`나머지 연산을 빼먹어 배열 경계를 넘음`" 여부를 확인하고 Day 60을(를) 완료하세요.
