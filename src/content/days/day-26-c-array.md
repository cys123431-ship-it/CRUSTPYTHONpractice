---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-26-c-array
courseId: crp-92
phaseId: phase-03
dayNumber: 26
date: "2026-10-26"
title: 배열과 인덱스 — 같은 종류의 값을 나란히 담기
summary: 같은 자료형의 값 여러 개를 메모리에 빈틈없이 나란히 담는 배열을 C를 중심으로 배웁니다. 선언과 초기화(일부만 쓰면 나머지는 0), 0부터 세는 인덱스와 마지막 칸 N−1, sizeof로 칸 수 구하기, 범위를 벗어난 인덱스가 C에서는 정의되지 않은 동작이고 Python과 Rust에서는 오류라는 차이를 확인합니다. 선형 탐색, 최댓값의 위치, 복사와 제자리 뒤집기, 값을 인덱스로 쓰는 빈도 세기를 세 언어로 구현하고, 일주일 기온 분석으로 연습합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 100
prerequisites: [day-25-result-error]
learningObjectives:
  - C 배열을 선언·초기화하고, 초기값이 모자라면 나머지 칸이 0이 된다는 것을 확인한다.
  - 0부터 N−1까지의 인덱스로 칸을 읽고 쓰며, sizeof로 칸 수를 구한다.
  - 범위를 벗어난 인덱스가 세 언어에서 각각 어떻게 되는지 설명한다.
  - 선형 탐색, 최댓값의 위치, 복사, 제자리 뒤집기, 빈도 세기를 구현한다.
  - C 배열은 =로 복사할 수 없고, Rust 배열은 대입하면 복사되며, Python 리스트는 대입하면 같은 리스트를 가리킨다는 차이를 구별한다.
concepts:
  [
    array,
    index,
    zero based,
    initialization,
    sizeof,
    out of bounds,
    linear search,
    argmax,
    reverse in place,
    frequency count,
  ]
runnerMode: python
playgroundSource: |
  # 파일: arrays.py — 인덱스를 바꿔 가며 어느 칸이 읽히는지 보세요.
  scores = [72, 95, 88, 61, 90]
  print(scores[0], scores[4], scores[-1], len(scores))
  best = 0
  for i in range(1, len(scores)):
      if scores[i] > scores[best]:
          best = i
  print("최댓값의 위치:", best, "값:", scores[best])
  counts = [0] * 7
  for r in [3, 6, 1, 3, 3, 5]:
      counts[r] += 1
  print(counts)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day26-predict-c
    title: 일부만 초기화한 배열 예측하기
    kind: predict
    objective: 초기값이 모자라면 나머지가 0이 되고, sizeof로 칸 수를 구할 수 있음을 확인한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[5] = {4, 2};
          printf("%d %d %d\n", a[1], a[4], (int)(sizeof a / sizeof a[0]));
          return 0;
      }
    answer: "2 0 5"
    hint: "a[0] = 4, a[1] = 2이고 적지 않은 a[2]~a[4]는 0입니다. 배열 전체 크기를 한 칸의 크기로 나누면 칸 수입니다."
    explanation: "초기값을 하나라도 쓰면 나머지 칸은 0으로 채워집니다. 반면 초기값 없이 int a[5];라고만 쓴 지역 배열은 쓰레기 값이 들어 있습니다. sizeof a는 20바이트, sizeof a[0]은 4바이트라 칸 수는 5입니다."
    commonMistakes:
      - "a[4]에 쓰레기 값이 있다고 생각함"
      - "마지막 칸이 a[5]라고 생각함"
    language: c
    verification: run
  - id: ex-day26-predict-py
    title: 음수 인덱스 예측하기
    kind: predict
    objective: Python의 음수 인덱스가 뒤에서부터 센다는 것을 확인한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      nums = [10, 20, 30, 40]
      print(nums[-1], nums[len(nums) - 2], len(nums))
    answer: "40 30 4"
    hint: "nums[-1]은 마지막 칸입니다. len(nums) - 2 = 2입니다."
    explanation: "Python의 nums[-1]은 nums[len(nums) - 1]과 같습니다. C와 Rust에는 음수 인덱스가 없어서, 마지막 칸은 a[n - 1]로 씁니다. C에서 a[-1]은 배열 앞의 엉뚱한 메모리를 읽는 정의되지 않은 동작입니다."
    commonMistakes:
      - "nums[-1]을 오류라고 생각함"
      - "nums[len(nums) - 2]를 20으로 적음(0부터 센다는 것을 잊음)"
    language: python
    verification: run
  - id: ex-day26-fill
    title: Rust 배열 길이로 반복하기
    kind: fill
    objective: 배열의 길이를 반복 범위에 쓴다.
    prompt: "빈칸을 채워 배열의 합 14가 출력되게 하세요."
    starter: |-
      fn main() {
          let arr = [3, 1, 4, 1, 5];
          let mut s = 0;
          for i in 0..arr._____() {
              s += arr[i];
          }
          println!("{s}");
      }
    answer: |-
      fn main() {
          let arr = [3, 1, 4, 1, 5];
          let mut s = 0;
          for i in 0..arr.len() {
              s += arr[i];
          }
          println!("{s}");
      }
    output: "14"
    hint: "배열의 칸 수를 돌려주는 메서드입니다. Python의 len(arr)에 해당합니다."
    explanation: "0..arr.len()은 0, 1, 2, 3, 4이므로 모든 칸을 한 번씩 봅니다. 인덱스가 필요 없다면 for x in arr { s += x; }가 더 간단하고, 범위를 벗어날 걱정도 없습니다."
    commonMistakes:
      - "0..=arr.len()으로 써서 arr[5]에서 패닉이 남"
      - "size()나 length()로 써서 메서드를 찾지 못함"
    language: rust
    verification: run
  - id: ex-day26-modify
    title: 최댓값과 그 위치 함께 출력하기
    kind: modify
    objective: 값이 아니라 위치(인덱스)를 기억해 최댓값과 위치를 모두 얻는다.
    prompt: "최댓값만 출력하는 코드를, 최댓값과 그 위치를 '95 1'처럼 함께 출력하도록 고치세요."
    starter: |-
      scores = [72, 95, 88, 61, 90]
      best = scores[0]
      for s in scores:
          if s > best:
              best = s
      print(best)
    answer: |-
      scores = [72, 95, 88, 61, 90]
      best_i = 0
      for i in range(1, len(scores)):
          if scores[i] > scores[best_i]:
              best_i = i
      print(scores[best_i], best_i)
    output: "95 1"
    hint: "값 대신 위치 best_i를 기억하면, 값은 언제든 scores[best_i]로 꺼낼 수 있습니다."
    explanation: "위치를 기억하는 쪽이 정보가 더 많습니다. 최댓값이 여러 개면 >를 썼으므로 가장 앞의 것이 남습니다. 뒤의 것을 원하면 >=를 씁니다. Python에서는 scores.index(max(scores))로도 구할 수 있지만 목록을 두 번 훑습니다."
    commonMistakes:
      - "best_i를 1부터 시작해 첫 칸이 최댓값일 때 틀림"
      - "for s in scores로 돌면서 위치를 따로 세지 않아 위치를 모름"
    language: python
    verification: run
  - id: ex-day26-debug
    title: 배열 끝을 넘는 반복 고치기
    kind: debug
    objective: 칸이 N개인 배열의 마지막 인덱스가 N−1이라는 것을 반복 조건에 반영한다.
    prompt: "배열 {1, 2, 3, 4, 5}의 합 15를 구하려 했는데, 반복이 배열 밖의 칸까지 읽습니다(정의되지 않은 동작). 고치세요."
    starter: |-
      #include <stdio.h>

      #define N 5

      int main(void) {
          int a[N] = {1, 2, 3, 4, 5};
          int sum = 0;
          for (int i = 0; i <= N; i++) {
              sum += a[i];
          }
          printf("%d\n", sum);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      #define N 5

      int main(void) {
          int a[N] = {1, 2, 3, 4, 5};
          int sum = 0;
          for (int i = 0; i < N; i++) {
              sum += a[i];
          }
          printf("%d\n", sum);
          return 0;
      }
    output: "15"
    hint: "칸이 5개면 인덱스는 0, 1, 2, 3, 4입니다. i <= N이면 i = 5일 때도 반복합니다."
    explanation: "a[5]는 배열 바로 뒤의 메모리입니다. C는 검사하지 않고 그곳의 아무 값이나 읽으므로 결과가 실행할 때마다 달라질 수 있고, 쓰기라면 다른 변수를 망가뜨립니다. 칸이 N개인 배열은 for (i = 0; i < N; i++)가 표준 모양입니다."
    commonMistakes:
      - "i = 1부터 시작하게 바꿔 첫 칸을 빠뜨림"
      - "결과가 우연히 맞게 나와서 버그가 없다고 생각함"
    language: c
    verification: run
  - id: ex-day26-independent
    title: Rust로 투표 세기
    kind: independent
    objective: 값을 인덱스로 써서 빈도를 세고, 가장 많이 나온 값을 찾는다.
    prompt: "후보 0, 1, 2에 대한 투표 [2, 0, 1, 2, 2, 1, 0, 2]를 세어 득표 배열과 당선자 번호를 '[2, 2, 4] 2'로 출력하세요."
    starter: |-
      fn main() {
          let votes = [2, 0, 1, 2, 2, 1, 0, 2];
          println!("{votes:?}");
      }
    answer: |-
      fn main() {
          let votes = [2, 0, 1, 2, 2, 1, 0, 2];
          let mut counts = [0; 3];
          for v in votes {
              counts[v] += 1;
          }
          let mut winner = 0;
          for i in 1..counts.len() {
              if counts[i] > counts[winner] {
                  winner = i;
              }
          }
          println!("{counts:?} {winner}");
      }
    output: "[2, 2, 4] 2"
    hint: "counts[후보 번호] += 1로 셉니다. 그다음 counts에서 최댓값의 위치를 찾으세요."
    explanation: "값의 범위가 작고 정해져 있으면(후보 0~2, 주사위 1~6) 값을 곧바로 인덱스로 써서 한 번에 셀 수 있습니다. 범위를 벗어난 투표(예 3)가 있으면 Rust는 패닉으로 알려 주지만, C는 배열 밖을 망가뜨리므로 먼저 범위를 검사해야 합니다."
    commonMistakes:
      - "counts를 mut로 만들지 않음"
      - "votes의 자료형이 usize가 아니면 인덱스로 쓸 수 없다는 것을 모름(여기서는 추론으로 usize가 됨)"
    language: rust
    verification: run
quiz:
  - id: quiz-day26-01
    question: C에서 int a[10];의 마지막 칸은?
    choices: ["a[10]", "a[9]", "a[11]", "a[-1]"]
    answerIndex: 1
    explanation: 인덱스는 0부터 시작하므로 칸이 10개면 0~9입니다. a[10]은 배열 바로 뒤의 메모리로, 읽거나 쓰면 정의되지 않은 동작입니다.
  - id: quiz-day26-02
    question: C 배열의 칸 수를 구하는 방법으로 옳은 것은?
    choices:
      - "len(a)"
      - "a.length"
      - "sizeof a / sizeof a[0]"
      - "sizeof a"
    answerIndex: 2
    explanation: sizeof a는 바이트 수(int 5칸이면 20)라서 한 칸의 바이트 수로 나눠야 칸 수가 됩니다. 이 방법은 배열을 선언한 함수 안에서만 통합니다. 함수에 넘긴 배열은 포인터가 되어 크기 정보를 잃습니다(Day 34).
  - id: quiz-day26-03
    question: 배열 범위를 벗어난 인덱스로 읽으면 세 언어에서 각각?
    choices:
      - 세 언어 모두 0을 읽는다
      - C는 정의되지 않은 동작, Python은 IndexError, Rust는 패닉(컴파일 때 알 수 있으면 컴파일 오류)
      - 세 언어 모두 컴파일 오류
      - C는 오류, Python과 Rust는 아무 값
    answerIndex: 1
    explanation: C는 속도를 위해 범위를 검사하지 않습니다. 그래서 가장 흔하고 위험한 보안 버그(버퍼 넘침)의 원인이 됩니다. Python과 Rust는 모든 인덱스를 검사해서 잘못된 접근을 바로 알려 줍니다.
  - id: quiz-day26-04
    question: C에서 int b[5]; b = a;처럼 배열을 대입하면?
    choices:
      - a의 내용이 b로 복사된다
      - 컴파일 오류가 난다(배열은 통째로 대입할 수 없다)
      - b가 a를 가리킨다
      - 첫 칸만 복사된다
    answerIndex: 1
    explanation: C에서 배열 이름은 대입할 수 없는 대상입니다. 복사하려면 반복문으로 한 칸씩 옮기거나 memcpy를 씁니다. Rust 배열은 대입하면 통째로 복사되고, Python 리스트는 대입하면 같은 리스트를 가리키는 이름이 하나 더 생깁니다.
  - id: quiz-day26-05
    question: 주사위 눈(1~6)의 빈도를 셀 때 count[r]++처럼 값을 인덱스로 쓰려면 배열 크기는 최소 얼마여야 하나요?
    choices: ["6", "7", "5", "36"]
    answerIndex: 1
    explanation: 눈 6을 인덱스로 쓰려면 count[6]이 있어야 하므로 칸이 7개(0~6) 필요합니다. 0번 칸은 쓰지 않습니다. count[r - 1]처럼 한 칸 당겨 쓰면 6칸으로도 됩니다.
---

## 1. 오늘 배울 내용

지금까지는 값 하나에 변수 하나를 썼습니다. 학생 30명의 점수를 담으려면 변수 30개가 필요할까요? **배열(array)** 을 쓰면 같은 자료형의 값 여러 개를 이름 하나로 묶고, **번호(인덱스)** 로 꺼낼 수 있습니다.

1. C 배열을 **선언**하고 **초기화**합니다.
   - 초기값이 모자라면 나머지 칸은 0입니다.
   - 크기를 생략하면 초기값 개수가 크기가 됩니다.
2. **인덱스는 0부터** 시작하고, 마지막 칸은 N−1입니다.
3. `sizeof`로 배열의 칸 수를 구합니다.
4. **범위를 벗어난 인덱스**가 세 언어에서 어떻게 되는지 비교합니다.
5. 배열로 푸는 기본 문제를 익힙니다.
   - 선형 탐색(값 찾기)
   - 최댓값의 **위치** 찾기
   - 복사, 제자리 뒤집기
   - 값을 인덱스로 쓰는 빈도 세기
6. 대입했을 때의 동작 차이를 봅니다. C는 대입 불가, Rust는 복사, Python은 같은 리스트를 가리킵니다.

## 2. 왜 필요한가

점수 다섯 개의 평균을 구한다면 `s1 + s2 + s3 + s4 + s5`로도 됩니다. 하지만 학생이 30명, 1000명이 되면 불가능합니다. 배열은 "i번째 값"이라는 개념을 주어서, **반복문 하나로** 모든 값을 처리할 수 있게 합니다.

배열은 거의 모든 자료구조의 바탕입니다. 문자열(Day 37)은 글자의 배열이고, 스택·큐(Day 57~60), 힙(Day 66), 해시 표(Day 67)도 속은 배열입니다. 또 배열은 값이 메모리에 **빈틈없이 나란히** 놓여 있어서, i번째 칸을 **바로** 찾을 수 있습니다. 이 성질이 배열이 빠른 이유이자, C에서 범위를 벗어나면 다른 값을 망가뜨리는 이유입니다.

## 3. 그림으로 이해하기

`int scores[5] = {72, 95, 88, 61, 90};`은 메모리에 이렇게 놓입니다. `int` 한 칸이 4바이트라서 칸의 위치가 4씩 늘어납니다.

```text
인덱스      [0]    [1]    [2]    [3]    [4]
          ┌──────┬──────┬──────┬──────┬──────┐
scores    │  72  │  95  │  88  │  61  │  90  │   다섯 칸이 빈틈없이 이어져 있다
          └──────┴──────┴──────┴──────┴──────┘
시작 위치   +0     +4     +8     +12    +16   (바이트)
                                                  ↑
                                         scores[5]는 여기, 배열 밖!
```

i번째 칸의 위치는 **시작 위치 + i × 한 칸의 크기**로 바로 계산됩니다. 그래서 `scores[1000]`을 읽는 데도 `scores[0]`과 같은 시간이 걸립니다. 인덱스가 0부터 시작하는 이유도 이 식 때문입니다. 첫 칸은 "시작에서 0칸 떨어진 곳"입니다.

## 4. 천천히 풀어보기

### 4.1 선언과 초기화

| 코드                          | 결과        | 설명                                                |
| ----------------------------- | ----------- | --------------------------------------------------- |
| `int a[5] = {1, 2, 3, 4, 5};` | `1 2 3 4 5` | 칸 수와 초기값 수가 같음                            |
| `int a[5] = {1, 2};`          | `1 2 0 0 0` | 모자란 칸은 0                                       |
| `int a[5] = {0};`             | `0 0 0 0 0` | 모두 0으로 만드는 관용구                            |
| `int a[] = {31, 28, 31};`     | 칸 3개      | 크기를 초기값 개수로 정함                           |
| `int a[5];` (함수 안)         | 쓰레기 값   | 초기화하지 않은 지역 배열은 무엇이 들어 있을지 모름 |
| `#define N 5` / `int a[N];`   | 칸 5개      | 크기에는 상수를 쓰는 것이 관례                      |

### 4.2 인덱스와 길이

| 하고 싶은 일    | C                         | Python                   | Rust                        |
| --------------- | ------------------------- | ------------------------ | --------------------------- |
| 첫 칸           | `a[0]`                    | `a[0]`                   | `a[0]`                      |
| 마지막 칸       | `a[n - 1]`                | `a[-1]`, `a[len(a) - 1]` | `a[a.len() - 1]`            |
| 칸 수           | `sizeof a / sizeof a[0]`  | `len(a)`                 | `a.len()`                   |
| 모든 칸 돌기    | `for (i = 0; i < n; i++)` | `for x in a:`            | `for x in a` / `a.iter()`   |
| 범위를 벗어나면 | **정의되지 않은 동작**    | `IndexError`             | 패닉(`index out of bounds`) |

C의 `sizeof` 방법은 **배열을 선언한 곳에서만** 통합니다. 배열을 함수에 넘기면 크기 정보가 사라져서(Day 34), 5절의 `print_array`처럼 칸 수를 따로 매개변수로 넘겨야 합니다.

### 4.3 배열로 푸는 기본 문제

| 문제          | 방법                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| 값 찾기       | 앞에서부터 비교하다 같으면 위치를 기억하고 `break`. 없으면 −1(또는 `None`) |
| 최댓값의 위치 | `best = 0`에서 시작, 더 큰 칸을 만나면 `best = i`                          |
| 복사          | 새 배열에 한 칸씩 옮기기                                                   |
| 제자리 뒤집기 | 양 끝 `i`, `j`를 바꾸고 가운데로 좁혀 오기(`i < j`인 동안)                 |
| 빈도 세기     | 값의 범위가 작으면 `count[값]++`                                           |

### 4.4 대입하면 무슨 일이?

```text
C:       int b[5]; b = a;        → 컴파일 오류. 한 칸씩 복사해야 함
Rust:    let b = a;              → 5칸이 통째로 복사됨. b를 바꿔도 a는 그대로
Python:  b = a                   → 같은 리스트에 이름표가 하나 더 붙음. b를 바꾸면 a도 바뀜
         b = a.copy()            → 새 리스트로 복사
```

Python의 이 동작은 Day 31(별칭과 복사)에서 자세히 다룹니다.

## 5. C로 구현하기

```c
// 파일: arrays.c
#include <stdio.h>

#define N 5

void print_array(const char *label, int a[], int n) {
    printf("%s:", label);
    for (int i = 0; i < n; i++) {
        printf(" %d", a[i]);
    }
    printf("\n");
}

int main(void) {
    int scores[N] = {72, 95, 88, 61, 90};  // 같은 자료형 값 N개가 나란히
    int zeros[5] = {0};                     // 모두 0
    int partial[5] = {1, 2};                // 나머지 칸은 0
    int days[] = {31, 28, 31};              // 크기를 초기값 개수로 정한다

    printf("scores[0] = %d, scores[%d] = %d\n", scores[0], N - 1, scores[N - 1]);
    print_array("zeros", zeros, 5);
    print_array("partial", partial, 5);
    printf("days의 칸 수: %zu\n", sizeof days / sizeof days[0]);
    printf("int 한 칸 %zu바이트, scores 전체 %zu바이트\n", sizeof scores[0], sizeof scores);

    scores[3] = 65;                         // 칸의 값을 바꾼다
    print_array("scores", scores, N);

    int target = 88, found = -1;            // 선형 탐색
    for (int i = 0; i < N; i++) {
        if (scores[i] == target) {
            found = i;
            break;
        }
    }
    printf("%d의 위치: %d\n", target, found);

    int best = 0;                           // 최댓값의 '위치'를 기억한다
    for (int i = 1; i < N; i++) {
        if (scores[i] > scores[best]) {
            best = i;
        }
    }
    printf("최댓값 scores[%d] = %d\n", best, scores[best]);

    int copy[N];                            // 배열은 = 로 복사할 수 없다
    for (int i = 0; i < N; i++) {
        copy[i] = scores[i];
    }
    for (int i = 0, j = N - 1; i < j; i++, j--) {   // 제자리 뒤집기
        int t = copy[i];
        copy[i] = copy[j];
        copy[j] = t;
    }
    print_array("뒤집은 복사본", copy, N);
    print_array("원본", scores, N);

    int rolls[] = {3, 6, 1, 3, 3, 5, 6, 2};
    int count[7] = {0};                     // count[눈] = 나온 횟수(0번 칸은 안 씀)
    int n_rolls = sizeof rolls / sizeof rolls[0];
    for (int i = 0; i < n_rolls; i++) {
        count[rolls[i]]++;
    }
    for (int face = 1; face <= 6; face++) {
        printf("눈 %d: %d번\n", face, count[face]);
    }
    return 0;
}
```

실행 결과:

```text
scores[0] = 72, scores[4] = 90
zeros: 0 0 0 0 0
partial: 1 2 0 0 0
days의 칸 수: 3
int 한 칸 4바이트, scores 전체 20바이트
scores: 72 95 88 65 90
88의 위치: 2
최댓값 scores[1] = 95
뒤집은 복사본: 90 65 88 95 72
원본: 72 95 88 65 90
눈 1: 1번
눈 2: 1번
눈 3: 3번
눈 4: 0번
눈 5: 1번
눈 6: 2번
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `void print_array(const char *label, int a[], int n)` | 배열을 받는 매개변수는 `int a[]`로 쓰고, **칸 수를 따로** 받습니다. 함수 안에서는 `sizeof a`로 칸 수를 알 수 없기 때문입니다(Day 34).               |
| `int partial[5] = {1, 2};`                            | 나머지 세 칸은 0입니다.                                                                                                                             |
| `sizeof days / sizeof days[0]`                        | 12바이트 ÷ 4바이트 = 3칸입니다. 결과 자료형이 `size_t`라 `%zu`로 출력합니다.                                                                        |
| `scores[3] = 65;`                                     | 네 번째 칸의 값을 바꿉니다. 인덱스 3이 네 번째라는 것에 주의하세요.                                                                                 |
| `found = -1` / `found = i; break;`                    | 못 찾으면 −1이 남습니다. 인덱스는 0 이상이라 −1을 "없음"의 약속으로 쓸 수 있습니다(Day 25의 오류 코드).                                             |
| `if (scores[i] > scores[best]) best = i;`             | 값이 아니라 **위치**를 기억합니다. 값은 언제든 `scores[best]`로 꺼낼 수 있습니다.                                                                   |
| `for (int i = 0, j = N - 1; i < j; i++, j--)`         | 쉼표로 변수 두 개를 함께 다룹니다. 양 끝을 바꾸며 가운데로 모입니다. `i < j` 대신 `i <= j`여도 가운데 칸을 자기 자신과 바꿀 뿐이라 결과는 같습니다. |
| `count[rolls[i]]++;`                                  | 주사위 눈을 **인덱스로 써서** 그 칸을 1 늘립니다. `count[7]`이라 눈 6까지 담을 수 있습니다.                                                         |

## 6. Python으로 구현하기

Python에는 C 같은 고정 크기 배열 대신 **리스트**가 있습니다. 크기가 늘고 줄 수 있고(Day 27), 인덱스를 검사해 주며, 편리한 메서드가 많습니다.

```python
# 파일: arrays.py
scores = [72, 95, 88, 61, 90]
zeros = [0] * 5                         # 0이 5개
print(f"scores[0] = {scores[0]}, scores[-1] = {scores[-1]}, 길이 {len(scores)}")
print("zeros:", zeros)

scores[3] = 65
print("scores:", scores)

print("88의 위치:", scores.index(88))   # 없으면 ValueError
print("100이 있나?", 100 in scores)

best = 0
for i in range(1, len(scores)):
    if scores[i] > scores[best]:
        best = i
print(f"최댓값 scores[{best}] = {scores[best]}")

copy = scores.copy()                    # 새 리스트로 복사
copy.reverse()                          # 제자리 뒤집기
print("뒤집은 복사본:", copy)
print("원본:", scores)
same = scores                           # 복사가 아니라 같은 리스트를 가리킨다
same[0] = 0
print("same을 바꾼 뒤 원본:", scores)

rolls = [3, 6, 1, 3, 3, 5, 6, 2]
count = [0] * 7
for r in rolls:
    count[r] += 1
for face in range(1, 7):
    print(f"눈 {face}: {count[face]}번")
```

실행 결과:

```text
scores[0] = 72, scores[-1] = 90, 길이 5
zeros: [0, 0, 0, 0, 0]
scores: [72, 95, 88, 65, 90]
88의 위치: 2
100이 있나? False
최댓값 scores[1] = 95
뒤집은 복사본: [90, 65, 88, 95, 72]
원본: [72, 95, 88, 65, 90]
same을 바꾼 뒤 원본: [0, 95, 88, 65, 90]
눈 1: 1번
눈 2: 1번
눈 3: 3번
눈 4: 0번
눈 5: 1번
눈 6: 2번
```

### 코드 한 부분씩 읽기

| 코드                   | 설명                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `[0] * 5`              | 0이 다섯 개인 리스트입니다. C의 `{0}`에 해당합니다.                                                                            |
| `scores[-1]`           | 음수 인덱스는 뒤에서부터 셉니다. `-1`이 마지막, `-2`가 그 앞입니다.                                                            |
| `scores.index(88)`     | 선형 탐색을 해 주는 메서드입니다. 값이 없으면 `ValueError`를 던집니다(Day 25).                                                 |
| `100 in scores`        | 있는지만 참·거짓으로 알려 줍니다. 속으로는 역시 앞에서부터 비교합니다.                                                         |
| `copy = scores.copy()` | 새 리스트를 만듭니다. `copy.reverse()`는 새 리스트만 뒤집습니다.                                                               |
| `same = scores`        | **복사가 아닙니다.** 같은 리스트에 이름이 하나 더 생긴 것이라, `same[0] = 0`이 원본을 바꿨습니다. C·Rust와 가장 다른 점입니다. |
| `count[r] += 1`        | C와 같은 빈도 세기입니다.                                                                                                      |

## 7. Rust로 구현하기

Rust 배열은 `[자료형; 칸수]` 자료형을 가지며 크기가 **컴파일할 때 정해집니다**. 인덱스는 `usize`이고, 모든 인덱스를 검사합니다.

```rust
// 파일: arrays.rs
fn main() {
    let mut scores: [i32; 5] = [72, 95, 88, 61, 90];   // 자료형 i32, 칸 5개
    let zeros = [0; 5];                             // 0을 5칸
    println!("scores[0] = {}, 마지막 = {}, 길이 {}", scores[0], scores[scores.len() - 1], scores.len());
    println!("zeros: {zeros:?}");
    println!("i32 배열 5칸의 크기: {}바이트", std::mem::size_of::<[i32; 5]>());

    scores[3] = 65;
    println!("scores: {scores:?}");

    let found = scores.iter().position(|&x| x == 88);   // Option<usize>
    println!("88의 위치: {found:?}, 100의 위치: {:?}", scores.iter().position(|&x| x == 100));

    let mut best = 0;
    for i in 1..scores.len() {
        if scores[i] > scores[best] {
            best = i;
        }
    }
    println!("최댓값 scores[{best}] = {}", scores[best]);

    let mut copy = scores;                  // 배열은 대입하면 통째로 복사된다
    copy.reverse();
    println!("뒤집은 복사본: {copy:?}");
    println!("원본: {scores:?}");

    let rolls = [3, 6, 1, 3, 3, 5, 6, 2];
    let mut count = [0; 7];
    for r in rolls {
        count[r] += 1;                      // r은 usize로 추론된다(인덱스로 쓰였으므로)
    }
    for face in 1..=6 {
        println!("눈 {face}: {}번", count[face]);
    }
}
```

실행 결과:

```text
scores[0] = 72, 마지막 = 90, 길이 5
zeros: [0, 0, 0, 0, 0]
i32 배열 5칸의 크기: 20바이트
scores: [72, 95, 88, 65, 90]
88의 위치: Some(2), 100의 위치: None
최댓값 scores[1] = 95
뒤집은 복사본: [90, 65, 88, 95, 72]
원본: [72, 95, 88, 65, 90]
눈 1: 1번
눈 2: 1번
눈 3: 3번
눈 4: 0번
눈 5: 1번
눈 6: 2번
```

### 코드 한 부분씩 읽기

| 코드                                     | 설명                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `let mut scores: [i32; 5] = [...]`       | 자료형에 칸 수가 들어 있습니다. `[i32; 5]`와 `[i32; 6]`은 **다른 자료형**입니다. 값을 바꾸려면 배열 전체가 `mut`여야 합니다.                                 |
| `[0; 5]`                                 | 같은 값 0을 5칸 채운 배열입니다. 세미콜론 앞이 값, 뒤가 칸 수입니다.                                                                                         |
| `scores[scores.len() - 1]`               | 음수 인덱스가 없어서 마지막 칸은 이렇게 씁니다. `scores.last()`는 `Option`으로 마지막 값을 줍니다.                                                           |
| `scores.iter().position(\|&x\| x == 88)` | 조건을 만족하는 첫 위치를 `Option<usize>`로 돌려줍니다. 못 찾으면 `None`이라 C의 −1 약속보다 안전합니다. `\|&x\|`는 클로저가 빌린 값을 풀어 받는 모양입니다. |
| `let mut copy = scores;`                 | 배열은 통째로 **복사**됩니다. `copy.reverse()`는 원본에 영향이 없습니다.                                                                                     |
| `for r in rolls { count[r] += 1; }`      | `r`이 인덱스로 쓰였으므로 컴파일러가 `rolls`의 자료형을 `[usize; 8]`로 추론했습니다. 인덱스는 반드시 `usize`입니다.                                          |

## 8. 실행 추적

C의 제자리 뒤집기를 `copy = {72, 95, 88, 65, 90}`으로 따라갑니다.

| 단계 | `i` | `j` | 바꾼 두 칸            | 배열             |
| ---: | --: | --: | --------------------- | ---------------- |
| 시작 |     |     |                       | `72 95 88 65 90` |
|    1 |   0 |   4 | `copy[0]` ↔ `copy[4]` | `90 95 88 65 72` |
|    2 |   1 |   3 | `copy[1]` ↔ `copy[3]` | `90 65 88 95 72` |
|    3 |   2 |   2 | (`i < j` 거짓 → 끝)   | `90 65 88 95 72` |

칸이 5개일 때 교환은 2번(⌊5/2⌋)입니다. 가운데 칸(인덱스 2)은 제자리에 있습니다. 새 배열을 만들지 않고 **원래 배열 안에서** 바꿔서 "제자리(in-place)" 뒤집기라고 합니다.

## 9. 다른 예제로 다시 이해하기

일주일의 최고 기온으로 평균, 평균보다 더운 날의 수, 전날보다 가장 크게 오른 날을 구해 봅시다. 마지막 문제는 **이웃한 두 칸**(`temps[i]`와 `temps[i + 1]`)을 비교하는데, 이때 반복 범위가 하나 줄어든다는 것이 핵심입니다.

```c
// 파일: weekly_temps.c
#include <stdio.h>

#define DAYS 7

int main(void) {
    int temps[DAYS] = {18, 21, 19, 24, 26, 23, 20};

    int sum = 0;
    for (int i = 0; i < DAYS; i++) {
        sum += temps[i];
    }
    double avg = (double)sum / DAYS;

    int hot_days = 0;
    for (int i = 0; i < DAYS; i++) {
        if (temps[i] > avg) {
            hot_days++;
        }
    }

    int best = 0;                               // 가장 크게 오른 '전날'의 위치
    for (int i = 0; i < DAYS - 1; i++) {        // i + 1이 배열 안에 있도록 DAYS - 1까지
        if (temps[i + 1] - temps[i] > temps[best + 1] - temps[best]) {
            best = i;
        }
    }

    printf("평균 %.2f도\n", avg);
    printf("평균보다 더운 날: %d일\n", hot_days);
    printf("가장 크게 오른 날: %d일째 → %d일째 (+%d도)\n",
           best + 1, best + 2, temps[best + 1] - temps[best]);
    return 0;
}
```

실행 결과:

```text
평균 21.57도
평균보다 더운 날: 3일
가장 크게 오른 날: 3일째 → 4일째 (+5도)
```

이웃한 차이는 `+3, −2, +5, +2, −3, −3`으로 **6개**, 칸 수보다 하나 적습니다. 반복을 `i < DAYS`까지 돌리면 마지막에 `temps[7]`을 읽어 배열을 벗어납니다. 사람에게 보여 줄 날짜는 인덱스에 1을 더했습니다(`best + 1`일째).

같은 분석을 Python으로 하면 이웃한 두 값을 `zip`으로 짝지을 수 있습니다.

```python
# 파일: weekly_temps.py
temps = [18, 21, 19, 24, 26, 23, 20]
avg = sum(temps) / len(temps)
hot_days = 0
for t in temps:
    if t > avg:
        hot_days += 1

diffs = []
for today, tomorrow in zip(temps, temps[1:]):    # (18,21), (21,19), ...
    diffs.append(tomorrow - today)
best = diffs.index(max(diffs))

print(f"평균 {avg:.2f}도")
print(f"평균보다 더운 날: {hot_days}일")
print("이웃한 날의 차이:", diffs)
print(f"가장 크게 오른 날: {best + 1}일째 → {best + 2}일째 (+{diffs[best]}도)")
```

실행 결과:

```text
평균 21.57도
평균보다 더운 날: 3일
이웃한 날의 차이: [3, -2, 5, 2, -3, -3]
가장 크게 오른 날: 3일째 → 4일째 (+5도)
```

`zip(temps, temps[1:])`은 원래 목록과 "한 칸 뒤로 밀린 목록"을 나란히 짝지어, 짧은 쪽(6개)에 맞춰 멈춥니다. 그래서 범위를 벗어날 걱정이 없습니다. `temps[1:]`처럼 목록의 일부를 잘라 내는 방법은 Day 27에서 배웁니다.

## 10. 배열 문제 모양 한눈에 보기

| 문제               | 반복 범위                   | 핵심 식                            |
| ------------------ | --------------------------- | ---------------------------------- |
| 모든 칸 처리       | `0 ≤ i < n`                 | `a[i]`                             |
| 이웃한 두 칸 비교  | `0 ≤ i < n − 1`             | `a[i]`, `a[i + 1]`                 |
| 양 끝에서 가운데로 | `i = 0, j = n − 1`, `i < j` | `a[i]`, `a[j]`                     |
| 거꾸로 돌기        | `n − 1 ≥ i ≥ 0`             | C는 `for (i = n - 1; i >= 0; i--)` |
| 값 → 칸(빈도)      | 값의 범위 + 1칸             | `count[a[i]]++`                    |

C에서 거꾸로 돌 때 `i`를 `size_t`(부호 없음)로 만들면 `i >= 0`이 항상 참이라 무한 반복이 됩니다(Day 10). 거꾸로 도는 반복 변수는 `int`로 쓰세요.

## 11. 세 언어 비교

| 관점              | C 배열                           | Python 리스트        | Rust 배열 `[T; N]`          |
| ----------------- | -------------------------------- | -------------------- | --------------------------- |
| 크기              | 고정(선언할 때)                  | 늘고 줄어듦          | 고정(자료형의 일부)         |
| 담는 값의 자료형  | 한 가지                          | 섞어도 됨            | 한 가지                     |
| 범위 검사         | 없음(정의되지 않은 동작)         | 있음(`IndexError`)   | 있음(패닉)                  |
| 길이              | `sizeof`로 계산(선언한 곳에서만) | `len(a)`             | `a.len()`                   |
| 대입 `b = a`      | 불가(컴파일 오류)                | 같은 리스트를 가리킴 | 통째로 복사                 |
| 음수 인덱스       | 없음(잘못된 접근)                | 뒤에서부터           | 없음(`usize`라 음수 불가)   |
| 초기화하지 않으면 | 쓰레기 값(지역 배열)             | (항상 값이 있음)     | 컴파일 오류(값을 넣어야 함) |

크기가 바뀌는 목록은 Rust에서는 `Vec`(Day 28), C에서는 동적 할당(Day 40)으로 만듭니다.

## 12. 자주 하는 실수

### 실수 1: 마지막 칸을 N으로 쓴다 (off-by-one)

실습의 디버그 문제입니다. 칸이 N개면 인덱스는 0~N−1입니다. `for (i = 0; i < N; i++)`를 몸에 익히세요.

### 실수 2: 범위를 벗어난 인덱스 (Python, Rust)

```python
# 파일: index_error.py (실행 오류: IndexError)
scores = [72, 95, 88]
print(scores[3])
```

```rust
// 파일: index_panic.rs (실행 오류: index out of bounds)
fn main() {
    let scores = [72, 95, 88];
    let i: usize = "3".parse().unwrap();
    println!("{}", scores[i]);
}
```

Rust는 코드에 `scores[3]`처럼 상수 인덱스를 쓰면 컴파일할 때 오류로 알려 주고, 실행 중에 정해지는 인덱스는 실행할 때 패닉으로 알려 줍니다. C는 아무것도 알려 주지 않습니다.

### 실수 3: C에서 배열을 대입한다

```c
// 파일: array_assign.c (컴파일 오류: assignment to expression with array type)
#include <stdio.h>

int main(void) {
    int a[3] = {1, 2, 3};
    int b[3];
    b = a;
    printf("%d\n", b[0]);
    return 0;
}
```

반복문으로 한 칸씩 복사하거나, `string.h`의 `memcpy(b, a, sizeof a)`를 씁니다.

### 실수 4: 초기화하지 않은 C 배열을 읽는다

`int count[7];`처럼 초기값 없이 선언한 지역 배열에는 무엇이 들어 있을지 모릅니다. 빈도를 세려면 반드시 `int count[7] = {0};`으로 시작하세요. Rust는 값을 넣지 않은 배열을 아예 만들 수 없게 막습니다.

### 실수 5: 빈도 배열의 크기를 값의 개수로 정한다

눈이 6가지라고 `int count[6]`을 만들고 `count[6]++`을 하면 범위를 벗어납니다. 값을 인덱스로 쓸 때는 **가장 큰 값 + 1**칸이 필요합니다.

## 13. Q&A

**Q. 인덱스는 왜 1이 아니라 0부터 시작하나요?**

A. i번째 칸의 위치를 "시작 위치 + i × 한 칸의 크기"로 계산하기 때문입니다. 첫 칸은 시작에서 0칸 떨어져 있습니다. 반열린 구간 `[0, n)`과 잘 맞아서 칸 수가 `n − 0 = n`으로 깔끔한 것도 장점입니다(Day 12).

**Q. C는 왜 범위를 검사하지 않나요?**

A. 검사하는 데 드는 시간을 아끼고, 하드웨어에 가까운 코드를 쓰기 위해서입니다. 대신 프로그래머가 책임져야 하고, 이것이 수많은 보안 사고(버퍼 넘침)의 원인이 되었습니다. 요즘은 `-fsanitize=address` 같은 도구로 개발 중에 범위 오류를 찾습니다.

**Q. 배열 크기를 변수로 정할 수는 없나요? (C)**

A. C99부터 `int a[n];`처럼 쓸 수 있는 가변 길이 배열(VLA)이 있지만, 선택 기능이라 지원하지 않는 컴파일러가 있고, 너무 크면 스택이 넘칩니다. 실행 중에 크기가 정해지는 배열은 `malloc`으로 만드는 것이 일반적입니다(Day 40).

**Q. Rust 배열과 Vec은 언제 구별해 쓰나요?**

A. 칸 수가 코드를 쓸 때 정해져 있고 바뀌지 않으면(요일 7개, RGB 3개, 주사위 눈 6개) 배열, 실행 중에 늘어나거나 입력에 따라 달라지면 `Vec`입니다. 대부분의 데이터는 `Vec`을 씁니다(Day 28).

## 14. 핵심 요약

- 배열은 같은 자료형의 값을 메모리에 **빈틈없이 나란히** 담고, 인덱스로 칸을 바로 찾습니다.
- 인덱스는 **0부터 N−1**까지입니다. 모든 칸을 도는 표준 모양은 `for (i = 0; i < N; i++)`입니다.
- C: `int a[5] = {1, 2};`는 나머지가 0, 초기화하지 않은 지역 배열은 쓰레기 값. 칸 수는 `sizeof a / sizeof a[0]`(선언한 곳에서만).
- 범위를 벗어나면 C는 **정의되지 않은 동작**, Python은 `IndexError`, Rust는 패닉입니다.
- 기본 문제: 선형 탐색(못 찾으면 −1/`None`), 최댓값의 **위치** 기억, 양 끝에서 좁혀 오는 제자리 뒤집기, 값을 인덱스로 쓰는 빈도 세기, 이웃한 두 칸 비교(범위 `n − 1`).
- 대입: C는 불가, Rust 배열은 복사, Python 리스트는 같은 리스트를 가리킵니다(`copy()`로 복사).

## 15. 도전 문제

1. **(C)** 정수 10개를 입력받아 배열에 담고, 짝수 번째 칸(인덱스 0, 2, 4, …)의 합과 홀수 번째 칸의 합을 출력하세요.
2. **(Python)** 리스트에서 두 번째로 큰 값을 한 번의 반복으로 찾으세요(`sort` 없이). 같은 최댓값이 여러 개일 때도 확인하세요.
3. **(Rust)** 배열 `[5, 3, 8, 1, 9, 2]`를 오른쪽으로 한 칸 회전해 `[2, 5, 3, 8, 1, 9]`를 만드세요. `rotate_right` 메서드를 쓰지 말고 반복문으로 하고, 그다음 메서드 결과와 비교하세요.
4. **(세 언어)** 시험 점수 20개(0~100)를 10점 단위 구간(0~9, 10~19, …, 90~100)으로 나눠 빈도를 세고, `#`로 막대그래프를 출력하세요. 100점은 어느 칸에 넣을지 정해야 합니다.
