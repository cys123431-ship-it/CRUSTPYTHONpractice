---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-60-circular-queue
courseId: crp-92
phaseId: phase-06
dayNumber: 60
date: "2026-11-29"
title: 원형 큐 — 배열의 끝과 처음을 이어 붙이기
summary: 나머지 연산으로 인덱스를 배열 처음으로 되돌려 선형 큐의 빈칸 낭비를 없앱니다. 비었을 때와 가득 찼을 때를 구별하는 두 가지 방법(개수 세기, 한 칸 비우기)을 C와 Python으로 구현하고, Rust로는 가득 차면 두 배로 늘어나는 원형 버퍼를 만듭니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-59-queue]
learningObjectives:
  - (i + 1) % CAPACITY가 인덱스를 배열 처음으로 되돌리는 원리를 설명한다.
  - 원형 큐에서 front == rear가 두 가지 뜻을 가질 수 있는 이유와 해결 방법을 설명한다.
  - C로 개수를 세는 원형 큐를, Python으로 한 칸을 비워 두는 원형 큐를 구현한다.
  - Rust로 가득 차면 용량을 두 배로 늘리는 원형 버퍼를 구현하고 원소를 순서대로 옮긴다.
  - 음수에 대한 나머지 연산 결과가 C·Rust와 Python에서 다르다는 것을 확인한다.
concepts:
  [circular queue, ring buffer, modulo, wrap around, full vs empty, resize]
runnerMode: python
playgroundSource: |
  # 파일: ring.py — CAPACITY와 넣는 개수를 바꿔 실행해 보세요.
  CAPACITY = 4
  items = [None] * CAPACITY
  front = 0
  count = 0

  for value in [10, 20, 30]:
      items[(front + count) % CAPACITY] = value
      count += 1
  for _ in range(2):
      print("dequeue", items[front])
      front = (front + 1) % CAPACITY
      count -= 1
  for value in [40, 50, 60]:
      items[(front + count) % CAPACITY] = value
      count += 1
  print("front", front, "count", count, "items", items)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day60-predict-c
    title: 나머지 연산으로 인덱스 돌리기
    kind: predict
    objective: 인덱스가 배열 끝에서 0으로 돌아가는 순서를 추적한다.
    prompt: 출력되는 숫자 여섯 개를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      #define CAPACITY 4

      int main(void) {
          int i = 2;
          for (int step = 0; step < 6; step++) {
              printf("%d ", i);
              i = (i + 1) % CAPACITY;
          }
          printf("\n");
          return 0;
      }
    answer: "2 3 0 1 2 3"
    hint: "3 다음 인덱스는 (3 + 1) % 4 = 0입니다."
    explanation: "인덱스는 0, 1, 2, 3을 반복해서 돕니다. 2에서 시작하면 2, 3 다음에 4 % 4 = 0으로 돌아갑니다."
    commonMistakes:
      - "3 다음에 4를 적음"
      - "0으로 돌아간 뒤 1이 아니라 다시 2부터 시작한다고 생각함"
    language: c
    verification: run
  - id: ex-day60-predict-py
    title: Python과 C의 음수 나머지 비교하기
    kind: predict
    objective: 음수의 나머지 연산 결과가 언어마다 다를 수 있음을 확인한다.
    prompt: Python에서 실행한 결과 두 개를 공백으로 구분해 적으세요.
    starter: |-
      front = 0
      capacity = 5
      print((front - 1) % capacity, (-7) % capacity)
    answer: "4 3"
    hint: Python의 % 결과는 항상 오른쪽 수(capacity)와 같은 부호입니다. 즉 0 이상 capacity 미만입니다.
    explanation: "Python에서 -1 % 5는 4, -7 % 5는 3입니다(-7 = 5 × (-2) + 3). C와 Rust의 %는 -1, -2를 줍니다. 그래서 C에서 인덱스를 뒤로 옮길 때는 (front - 1 + capacity) % capacity처럼 capacity를 더해 둡니다."
    commonMistakes:
      - "C처럼 -1과 -2가 나온다고 생각함"
      - "나머지는 항상 0 이상이라고 모든 언어에 일반화함"
    language: python
    verification: run
  - id: ex-day60-fill
    title: Rust 원형 버퍼의 쓰기 위치 채우기
    kind: fill
    objective: head와 len으로 다음 쓰기 위치를 계산한다.
    prompt: "push_back의 빈칸에 다음에 쓸 인덱스를 계산하는 식을 채우세요. 맨 앞은 head, 원소 수는 len, 용량은 self.buf.len()입니다."
    starter: |-
      struct Ring {
          buf: Vec<i32>,
          head: usize,
          len: usize,
      }

      impl Ring {
          fn push_back(&mut self, value: i32) -> bool {
              if self.len == self.buf.len() {
                  return false;
              }
              let tail = _____;
              self.buf[tail] = value;
              self.len += 1;
              true
          }
      }

      fn main() {
          let mut r = Ring { buf: vec![0; 3], head: 2, len: 0 };
          r.push_back(7);
          r.push_back(8);
          r.push_back(9);
          let ok = r.push_back(10);
          println!("{:?} {}", r.buf, ok);
      }
    answer: |-
      struct Ring {
          buf: Vec<i32>,
          head: usize,
          len: usize,
      }

      impl Ring {
          fn push_back(&mut self, value: i32) -> bool {
              if self.len == self.buf.len() {
                  return false;
              }
              let tail = (self.head + self.len) % self.buf.len();
              self.buf[tail] = value;
              self.len += 1;
              true
          }
      }

      fn main() {
          let mut r = Ring { buf: vec![0; 3], head: 2, len: 0 };
          r.push_back(7);
          r.push_back(8);
          r.push_back(9);
          let ok = r.push_back(10);
          println!("{:?} {}", r.buf, ok);
      }
    hint: 맨 앞에서 원소 수만큼 떨어진 곳이 다음 빈칸입니다. 배열 끝을 넘어가면 처음으로 돌아와야 합니다.
    explanation: "head가 2이므로 7은 인덱스 2, 8은 (2+1)%3 = 0, 9는 (2+2)%3 = 1에 들어갑니다. 출력은 [8, 9, 7] false입니다. 가득 찼으므로 네 번째 push는 실패합니다."
    commonMistakes:
      - "% 연산을 빼서 인덱스 3에 쓰다가 panic을 일으킴"
      - "head + len + 1로 계산해 한 칸 건너뜀"
    language: rust
    verification: run
    output: "[8, 9, 7] false"
  - id: ex-day60-modify
    title: Python 원형 큐에 peek와 __len__ 추가하기
    kind: modify
    objective: 한 칸 비우기 방식에서 원소 수를 front와 rear만으로 계산한다.
    prompt: "CircularQueue에 맨 앞 값을 돌려주는 peek()와 원소 수를 돌려주는 __len__()을 추가하세요. count 변수 없이 front와 rear만 써야 합니다."
    starter: |-
      class CircularQueue:
          def __init__(self, capacity):
              self._items = [None] * (capacity + 1)
              self._front = 0
              self._rear = 0

          def _next(self, i):
              return (i + 1) % len(self._items)

          def enqueue(self, value):
              if self._next(self._rear) == self._front:
                  raise OverflowError("가득 찼습니다")
              self._items[self._rear] = value
              self._rear = self._next(self._rear)

          def dequeue(self):
              if self._front == self._rear:
                  raise IndexError("비어 있습니다")
              value = self._items[self._front]
              self._front = self._next(self._front)
              return value


      q = CircularQueue(3)
      for v in [1, 2, 3]:
          q.enqueue(v)
      q.dequeue()
      q.enqueue(4)
      print(q.dequeue())
    answer: |-
      class CircularQueue:
          def __init__(self, capacity):
              self._items = [None] * (capacity + 1)
              self._front = 0
              self._rear = 0

          def _next(self, i):
              return (i + 1) % len(self._items)

          def enqueue(self, value):
              if self._next(self._rear) == self._front:
                  raise OverflowError("가득 찼습니다")
              self._items[self._rear] = value
              self._rear = self._next(self._rear)

          def dequeue(self):
              if self._front == self._rear:
                  raise IndexError("비어 있습니다")
              value = self._items[self._front]
              self._front = self._next(self._front)
              return value

          def peek(self):
              if self._front == self._rear:
                  raise IndexError("비어 있습니다")
              return self._items[self._front]

          def __len__(self):
              return (self._rear - self._front) % len(self._items)


      q = CircularQueue(3)
      for v in [1, 2, 3]:
          q.enqueue(v)
      q.dequeue()
      q.enqueue(4)
      print(len(q), q.peek(), q.dequeue(), len(q))
    hint: "rear가 front보다 작아질 수도 있습니다(한 바퀴 돌았을 때). Python의 %는 음수에도 0 이상의 결과를 주므로 (rear - front) % 배열길이로 계산할 수 있습니다."
    explanation: "배열 길이는 4입니다. 1, 2, 3을 넣고 1을 빼고 4를 넣으면 front=1, rear=0입니다. (0 - 1) % 4 = 3이므로 len은 3, 맨 앞은 2입니다. 출력은 3 2 2 2입니다."
    commonMistakes:
      - "rear - front를 그대로 돌려줘 한 바퀴 돈 뒤 음수가 나옴"
      - "capacity로 나눠서 배열 길이(capacity + 1)와 어긋남"
    language: python
    verification: run
    output: "3 2 2 2"
  - id: ex-day60-debug
    title: C 연산자 우선순위 버그 고치기
    kind: debug
    objective: "% 가 + 보다 먼저 계산된다는 것을 알고 괄호로 고친다."
    prompt: "이 enqueue는 rear + 1 % CAPACITY 때문에 인덱스가 0으로 돌아가지 않습니다. 네 번째 값이 배열 밖에 써지기 전에 버그를 고치세요. 프로그램은 넣은 인덱스를 출력합니다."
    starter: |-
      #include <stdio.h>

      #define CAPACITY 3

      int main(void) {
          int items[CAPACITY];
          int rear = 0;
          for (int v = 1; v <= 3; v++) {
              items[rear] = v;
              printf("%d ", rear);
              rear = rear + 1 % CAPACITY;
          }
          printf("next=%d\n", rear);
          (void)items;
          return 0;
      }
    answer: |-
      #include <stdio.h>

      #define CAPACITY 3

      int main(void) {
          int items[CAPACITY];
          int rear = 0;
          for (int v = 1; v <= 3; v++) {
              items[rear] = v;
              printf("%d ", rear);
              rear = (rear + 1) % CAPACITY;
          }
          printf("next=%d\n", rear);
          (void)items;
          return 0;
      }
    hint: "*, /, %는 +, -보다 먼저 계산됩니다. 1 % 3은 무엇일까요?"
    explanation: "rear + 1 % CAPACITY는 rear + (1 % 3) = rear + 1로 계산되어 나머지가 전혀 적용되지 않습니다. 고치면 0 1 2 next=0이 출력되어 다음 쓰기가 배열 처음으로 돌아갑니다. 고치지 않으면 다음 쓰기가 items[3], 즉 배열 밖이 되어 정의되지 않은 동작이 됩니다."
    commonMistakes:
      - "rear++ % CAPACITY처럼 써서 rear 값은 계속 커지게 둠"
      - "(rear % CAPACITY) + 1로 괄호 위치를 잘못 잡음"
    language: c
    verification: run
    output: "0 1 2 next=0"
  - id: ex-day60-independent
    title: Rust로 최근 3개 이동 평균 구하기
    kind: independent
    objective: 가득 차면 가장 오래된 값을 덮어쓰는 원형 버퍼를 구현한다.
    prompt: "크기 3인 배열을 원형 버퍼로 써서 온도를 하나씩 넣을 때마다 최근 최대 3개 값의 평균을 출력하세요. 입력 [20, 22, 24, 30, 18]이면 20.0 21.0 22.0 25.3 24.0이 한 줄에 나와야 합니다(소수 첫째 자리)."
    starter: |-
      fn main() {
          let temps = [20.0, 22.0, 24.0, 30.0, 18.0];
          let mut buf = [0.0_f64; 3];
          let mut next = 0;
          let mut count = 0;
          // 각 온도를 buf[next]에 덮어쓰고, next를 한 칸 돌리고, 평균을 출력하세요.
          println!("{:?} {} {} {}", temps, buf[0], next, count);
          buf[next] = 1.0;
          next += 1;
          count += 1;
          println!("{} {}", next, count);
      }
    answer: |-
      fn main() {
          let temps = [20.0, 22.0, 24.0, 30.0, 18.0];
          let mut buf = [0.0_f64; 3];
          let mut next = 0;
          let mut count = 0;
          let mut out = Vec::new();

          for t in temps {
              buf[next] = t;
              next = (next + 1) % buf.len();
              if count < buf.len() {
                  count += 1;
              }
              let sum: f64 = buf[..count].iter().sum();
              out.push(format!("{:.1}", sum / count as f64));
          }
          println!("{}", out.join(" "));
      }
    hint: "가득 차기 전에는 buf[..count]만 유효합니다. 가득 찬 뒤에는 count가 3에 머물고, next가 가장 오래된 칸을 가리키므로 그 자리를 덮어쓰면 됩니다."
    explanation: "30이 들어올 때 next는 0이므로 가장 오래된 20을 덮어써서 [30, 22, 24]의 평균 25.3이 됩니다. 18은 22를 덮어써 [30, 18, 24]의 평균 24.0입니다. 가득 차면 버리는 이런 원형 버퍼는 센서 데이터나 로그의 '최근 N개'를 보관할 때 흔히 씁니다."
    commonMistakes:
      - "가득 차기 전에도 3으로 나눠 평균이 작게 나옴"
      - "count를 계속 늘려 buf[..count]가 범위를 벗어나 panic을 일으킴"
    language: rust
    verification: run
    output: "20.0 21.0 22.0 25.3 24.0"
quiz:
  - id: quiz-day60-01
    question: 용량이 5인 원형 큐에서 rear가 4일 때, 다음 rear는?
    choices: ["5", "0", "4", "-1"]
    answerIndex: 1
    explanation: (4 + 1) % 5 = 0입니다. 배열의 마지막 칸 다음은 첫 칸입니다.
  - id: quiz-day60-02
    question: 개수(count)를 따로 세지 않는 원형 큐에서 front == rear이면 무슨 문제가 생기나요?
    choices:
      - 항상 비어 있다는 뜻이라 문제없다
      - 비어 있는 경우와 가득 찬 경우가 모두 front == rear라서 구별할 수 없다
      - 인덱스가 배열 밖을 가리킨다
      - rear가 front보다 작아질 수 없다
    answerIndex: 1
    explanation: 모두 꺼내도, 한 바퀴 돌아 가득 채워도 두 인덱스가 만납니다. 그래서 count를 따로 두거나, 한 칸을 항상 비워 둬서 가득 찬 상태를 (rear + 1) % 길이 == front로 정의합니다.
  - id: quiz-day60-03
    question: "'한 칸 비우기' 방식으로 원소를 최대 4개 저장하려면 배열 길이가 얼마여야 하나요?"
    choices: ["3", "4", "5", "8"]
    answerIndex: 2
    explanation: 한 칸은 가득 찬 상태를 구별하려고 항상 비워 두므로 배열 길이는 저장할 개수 + 1인 5입니다.
  - id: quiz-day60-04
    question: C에서 front를 한 칸 뒤로(왼쪽으로) 옮길 때 올바른 식은?
    choices:
      - "front = (front - 1) % CAPACITY;"
      - "front = (front - 1 + CAPACITY) % CAPACITY;"
      - "front = front - 1 % CAPACITY;"
      - "front = CAPACITY % (front - 1);"
    answerIndex: 1
    explanation: C에서 -1 % CAPACITY는 -1이라 음수 인덱스가 됩니다. CAPACITY를 먼저 더하면 항상 0 이상이 됩니다. Python은 (front - 1) % CAPACITY만으로도 0 이상이 나옵니다.
  - id: quiz-day60-05
    question: Rust 원형 버퍼가 가득 차서 용량을 두 배로 늘릴 때, 원소를 옮기는 올바른 방법은?
    choices:
      - 기존 배열을 그대로 복사해 새 배열의 앞에 붙인다
      - head부터 원소 수만큼 순서대로 꺼내 새 배열의 0번부터 채우고 head를 0으로 둔다
      - 원소를 정렬해서 새 배열에 넣는다
      - 새 배열의 끝부터 채운다
    answerIndex: 1
    explanation: 한 바퀴 돈 원형 버퍼는 배열에 [C, D, A, B]처럼 순서가 끊겨 저장되어 있을 수 있습니다. 그대로 복사하면 새 배열 가운데에 빈칸이 생겨 순서가 깨지므로 논리적 순서대로 옮겨야 합니다.
---

## 1. 오늘 배울 내용

Day 59의 C 선형 큐에는 치명적인 약점이 있었습니다. front와 rear가 오른쪽으로만 움직이기 때문에, 앞쪽에 빈칸이 있어도 rear가 배열 끝에 닿으면 더 넣을 수 없었습니다. 오늘은 **배열의 끝과 처음을 이어 붙여서** 이 문제를 해결하는 **원형 큐(circular queue)** 를 배웁니다. 원형 버퍼(ring buffer)라고도 부릅니다.

이번 수업의 흐름은 다음과 같습니다.

1. 나머지 연산 `%`로 인덱스를 "한 바퀴 돌리는" 방법을 익힙니다.
2. 원형 큐의 가장 까다로운 문제인 **"비었나, 가득 찼나?"** 를 구별하는 두 가지 방법을 배웁니다.
3. **C** 로 개수를 세는 원형 큐를 구현합니다.
4. **Python** 으로 한 칸을 비워 두는 원형 큐를 구현합니다.
5. **Rust** 로 가득 차면 **두 배로 늘어나는** 원형 버퍼를 만듭니다. Python의 deque와 Rust의 VecDeque가 내부에서 하는 일과 같습니다.
6. 응용으로 최근 값만 기억하는 **덮어쓰기 원형 버퍼**를 만들고 이동 평균을 구합니다.

## 2. 왜 원형이어야 하는가

길이 4인 선형 큐에 값을 넣고 빼다 보면 이런 상태가 됩니다.

```text
인덱스:   0     1     2     3
        [ . ] [ . ] [ 30] [ 40]
                     front       rear=4 (배열 끝)
```

인덱스 0과 1은 비었지만 rear가 4라서 더 넣을 수 없습니다. 그런데 rear가 4가 되는 대신 **0으로 돌아간다면** 어떨까요? 빈칸인 0번에 다음 값을 넣을 수 있습니다. 배열을 동그랗게 말아서 3번 칸 다음이 0번 칸이 되게 하는 것입니다.

```text
              ┌───┐
         ┌────┤ 0 ├────┐
         │    └───┘    │
       ┌─┴─┐         ┌─┴─┐
       │ 3 │         │ 1 │      3 다음은 다시 0
       └─┬─┘         └─┬─┘
         │    ┌───┐    │
         └────┤ 2 ├────┘
              └───┘
```

실제 메모리는 여전히 일자로 이어진 배열이지만, 인덱스를 계산하는 규칙을 바꿔서 원처럼 쓰는 것입니다.

## 3. 그림으로 이해하기

길이 4인 원형 큐에 10, 20, 30을 넣고, 두 개를 꺼낸 뒤, 40, 50, 60을 넣는 과정입니다. `F`는 front, `R`은 다음에 넣을 자리입니다.

```text
① 10, 20, 30 넣기     [10][20][30][ .]     F=0  R=3  count=3
                        F           R
② 두 개 꺼내기        [ .][ .][30][ .]     F=2  R=3  count=1
                                F   R
③ 40 넣기            [ .][ .][30][40]     F=2  R=0  count=2   ← R이 0으로 돌아옴
                        R       F
④ 50, 60 넣기        [50][60][30][40]     F=2  R=2  count=4   가득 참!
                                F
                                R
```

③에서 rear가 배열 끝을 넘어 0으로 돌아왔고, ④에서는 앞쪽 빈칸 두 개를 모두 다시 썼습니다. 선형 큐였다면 ③에서 이미 가득 찼다고 거절했을 것입니다.

④의 배열을 보면 저장 순서가 `[50][60][30][40]`입니다. 하지만 **큐의 순서**는 front부터 읽은 30 → 40 → 50 → 60입니다. 배열의 물리적 순서와 큐의 논리적 순서가 다를 수 있다는 점을 꼭 기억하세요. Rust 구현에서 용량을 늘릴 때 이 점이 중요해집니다.

## 4. 천천히 풀어보기

### 4.1 나머지 연산으로 한 바퀴 돌리기

`a % b`는 a를 b로 나눈 **나머지**입니다. 0 이상의 정수 i에 대해 `i % 4`는 항상 0, 1, 2, 3 중 하나입니다.

| i       | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `i % 4` | 0   | 1   | 2   | 3   | 0   | 1   | 2   | 3   | 0   |

그래서 "다음 인덱스"를 `i + 1` 대신 `(i + 1) % CAPACITY`로 계산하면, 마지막 인덱스 다음에 자동으로 0이 됩니다.

```text
다음 인덱스 = (현재 인덱스 + 1) % CAPACITY
```

> **오류 주의**: `rear + 1 % CAPACITY`처럼 괄호를 빼면 안 됩니다. `%`는 `+`보다 먼저 계산되므로 `rear + (1 % CAPACITY)`, 즉 `rear + 1`이 되어 나머지 연산이 아무 일도 하지 않습니다. 반드시 `(rear + 1) % CAPACITY`로 쓰세요.

### 4.2 front == rear의 두 가지 뜻

선형 큐에서는 `front == rear`가 "비었다"는 뜻이었습니다. 원형 큐에서는 문제가 생깁니다. 위 그림 ④를 보면 **가득 찼을 때도 front와 rear가 둘 다 2**입니다. rear가 한 바퀴 돌아 front를 따라잡았기 때문입니다. 같은 모양이 두 가지 뜻을 가지면 프로그램이 구별할 수 없습니다. 해결 방법은 두 가지입니다.

**방법 1: 개수(count)를 따로 센다**

- 비었다: `count == 0`
- 가득 찼다: `count == CAPACITY`
- rear를 따로 저장하지 않고 `(front + count) % CAPACITY`로 계산할 수도 있습니다.

배열의 모든 칸을 쓸 수 있고 조건이 직관적입니다. **C 구현**이 이 방법을 씁니다.

**방법 2: 한 칸을 항상 비워 둔다**

- 비었다: `front == rear`
- 가득 찼다: `(rear + 1) % 길이 == front`, 즉 rear 바로 다음이 front이면 가득 찬 것으로 **약속**합니다.

한 칸을 희생하는 대신 변수 하나(count)가 줄어듭니다. 원소를 최대 N개 넣으려면 배열 길이는 N + 1이어야 합니다. 여러 스레드가 한 큐를 함께 쓸 때 유리해서 운영체제나 네트워크 코드에서 자주 봅니다. **Python 구현**이 이 방법을 씁니다.

```text
방법 2, 배열 길이 4 (최대 3개 저장)
빈 상태    [ .][ .][ .][ .]   F=0 R=0            front == rear → 비었다
3개 넣음   [ A][ B][ C][ .]   F=0 R=3            (3+1)%4 == 0 == F → 가득 찼다
```

### 4.3 음수의 나머지는 언어마다 다르다

deque처럼 **앞쪽에도** 넣으려면 front를 한 칸 뒤로(왼쪽으로) 옮겨야 합니다. `(front - 1) % CAPACITY`를 쓰면 될 것 같지만, front가 0일 때 결과가 언어마다 다릅니다.

| 식       | C    | Rust | Python |
| -------- | ---- | ---- | ------ |
| `-1 % 5` | `-1` | `-1` | `4`    |
| `-7 % 5` | `-2` | `-2` | `3`    |

C와 Rust의 `%`는 결과가 **왼쪽 수의 부호**를 따르고, Python의 `%`는 **오른쪽 수의 부호**를 따릅니다. C에서 음수 인덱스는 배열 밖을 가리키므로 위험합니다. 안전한 방법은 **CAPACITY를 먼저 더하는 것**입니다.

```text
C:      front = (front - 1 + CAPACITY) % CAPACITY;
Rust:   front = (front + cap - 1) % cap;      // usize는 음수가 될 수 없어 먼저 더한다
Python: front = (front - 1) % capacity        // 이미 0 이상
```

이 차이는 이번 수업의 "다른 예제" 절에서 세 언어로 직접 확인합니다.

### 4.4 가득 찼을 때 늘리기

고정 크기 원형 큐는 가득 차면 거절합니다. 크기 제한이 없어야 한다면 **더 큰 배열을 새로 만들어 옮기면** 됩니다. 주의할 점은 **논리적 순서대로** 옮겨야 한다는 것입니다.

```text
가득 찬 길이 4 버퍼:  [50][60][30][40]   head=2
                               ↑
그대로 복사하면:      [50][60][30][40][ .][ .][ .][ .]   ← head=2부터 읽으면 30, 40, ., . 이 되어 순서가 깨짐
head부터 차례로:      [30][40][50][60][ .][ .][ .][ .]   head=0 ✔
```

Rust 구현은 두 번째 방법으로 옮기고 head를 0으로 되돌립니다. 크기를 두 배씩 늘리면 Day 57의 동적 배열처럼 push가 상각 O(1)이 됩니다.

## 5. C로 구현하기

개수를 세는 방법(방법 1)으로 원형 큐를 만듭니다. rear는 저장하지 않고 필요할 때 `(front + count) % CAPACITY`로 계산합니다. Day 59 선형 큐와 같은 시나리오를 실행해 결과를 비교해 보세요.

```c
// 파일: circular_queue.c
#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 4

typedef struct {
    int items[CAPACITY];
    int front;                  // 맨 앞 원소의 인덱스
    int count;                  // 들어 있는 원소 수
} Queue;

void init(Queue *q) {
    q->front = 0;
    q->count = 0;
}

bool is_empty(const Queue *q) {
    return q->count == 0;
}

bool is_full(const Queue *q) {
    return q->count == CAPACITY;
}

bool enqueue(Queue *q, int value) {
    if (is_full(q)) {
        return false;
    }
    int rear = (q->front + q->count) % CAPACITY;   // 다음 빈칸
    q->items[rear] = value;
    q->count++;
    return true;
}

bool dequeue(Queue *q, int *out) {
    if (is_empty(q)) {
        return false;
    }
    *out = q->items[q->front];
    q->front = (q->front + 1) % CAPACITY;          // 끝이면 0으로
    q->count--;
    return true;
}

void print_queue(const Queue *q) {
    printf("front=%d count=%d  배열[", q->front, q->count);
    for (int i = 0; i < CAPACITY; i++) {
        // i가 front로부터 몇 칸 떨어졌는지 계산해 큐에 속하는지 판단
        int distance = (i - q->front + CAPACITY) % CAPACITY;
        if (distance < q->count) {
            printf(" %2d", q->items[i]);
        } else {
            printf("  .");
        }
    }
    printf(" ]  큐 순서:");
    for (int k = 0; k < q->count; k++) {
        printf(" %d", q->items[(q->front + k) % CAPACITY]);
    }
    printf("\n");
}

int main(void) {
    Queue q;
    int value;

    init(&q);
    for (int i = 1; i <= 3; i++) {
        enqueue(&q, i * 10);
    }
    print_queue(&q);

    dequeue(&q, &value);
    dequeue(&q, &value);
    print_queue(&q);

    enqueue(&q, 40);
    print_queue(&q);
    enqueue(&q, 50);
    enqueue(&q, 60);
    print_queue(&q);

    if (!enqueue(&q, 70)) {
        printf("enqueue(70) 실패: 진짜로 가득 찼습니다\n");
    }

    while (dequeue(&q, &value)) {
        printf("%d ", value);
    }
    printf("\n");

    enqueue(&q, 80);                // 비운 뒤에도 계속 쓸 수 있다
    print_queue(&q);
    return 0;
}
```

실행 결과:

```text
front=0 count=3  배열[ 10 20 30  . ]  큐 순서: 10 20 30
front=2 count=1  배열[  .  . 30  . ]  큐 순서: 30
front=2 count=2  배열[  .  . 30 40 ]  큐 순서: 30 40
front=2 count=4  배열[ 50 60 30 40 ]  큐 순서: 30 40 50 60
enqueue(70) 실패: 진짜로 가득 찼습니다
30 40 50 60
front=2 count=1  배열[  .  . 80  . ]  큐 순서: 80
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int count;`                                           | 선형 큐의 rear 대신 원소 수를 저장합니다. 비었는지(`count == 0`)와 가득 찼는지(`count == CAPACITY`)를 헷갈림 없이 판단할 수 있습니다.                            |
| `int rear = (q->front + q->count) % CAPACITY;`         | 맨 앞에서 원소 수만큼 떨어진 곳이 다음 빈칸입니다. front=2, count=2면 (2+2)%4 = 0번 칸입니다.                                                                    |
| `q->front = (q->front + 1) % CAPACITY;`                | 꺼낸 뒤 front를 한 칸 옮기는데, 3번 칸 다음은 0번 칸입니다.                                                                                                      |
| `int distance = (i - q->front + CAPACITY) % CAPACITY;` | 배열 칸 i가 front에서 몇 칸 뒤인지 계산합니다. i가 front보다 작으면 `i - front`가 음수가 되므로 **CAPACITY를 더해** 0 이상으로 만든 뒤 나머지를 구합니다(4.3절). |
| `if (distance < q->count)`                             | 그 거리가 원소 수보다 작으면 큐에 속한 칸입니다. 그래서 넷째 줄에서 0, 1번 칸(50, 60)도 큐의 원소로 표시됩니다.                                                  |
| `q->items[(q->front + k) % CAPACITY]`                  | front에서 k번째 원소입니다. k를 0부터 count-1까지 늘리면 **큐의 논리적 순서**대로 읽습니다.                                                                      |

Day 59의 선형 큐는 원소 2개에서 `enqueue(50)`이 실패했지만, 원형 큐는 4개가 모두 찰 때까지 받아들였습니다. 마지막 줄처럼 다 비운 뒤에도 계속 쓸 수 있습니다.

> **참고**: C의 `%`는 두 피연산자가 모두 0 이상이면 우리가 기대하는 나머지를 줍니다. front, count, CAPACITY가 모두 0 이상이므로 `(front + count) % CAPACITY`는 안전합니다. 위험한 것은 **뺄셈이 섞일 때**입니다.

## 6. Python으로 구현하기

이번에는 한 칸을 비워 두는 방법(방법 2)으로 구현합니다. count 변수가 없으므로 원소 수도 front와 rear로 계산합니다.

```python
# 파일: circular_queue.py
class CircularQueue:
    """한 칸을 비워 두는 원형 큐 (최대 capacity개 저장)"""

    def __init__(self, capacity):
        self._items = [None] * (capacity + 1)   # 한 칸 더 크게
        self._front = 0                          # 맨 앞 원소
        self._rear = 0                           # 다음에 넣을 칸

    def _next(self, i):
        return (i + 1) % len(self._items)

    def is_empty(self):
        return self._front == self._rear

    def is_full(self):
        return self._next(self._rear) == self._front

    def enqueue(self, value):
        if self.is_full():
            raise OverflowError("enqueue: 큐가 가득 찼습니다")
        self._items[self._rear] = value
        self._rear = self._next(self._rear)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue: 큐가 비어 있습니다")
        value = self._items[self._front]
        self._items[self._front] = None          # 확인하기 쉽게 비움
        self._front = self._next(self._front)
        return value

    def __len__(self):
        return (self._rear - self._front) % len(self._items)

    def show(self):
        print(f"front={self._front} rear={self._rear} len={len(self)} "
              f"배열={self._items}")


q = CircularQueue(3)
for value in [10, 20, 30]:
    q.enqueue(value)
q.show()

try:
    q.enqueue(40)
except OverflowError as error:
    print("오류:", error)

print("dequeue ->", q.dequeue(), q.dequeue())
q.show()

q.enqueue(40)
q.enqueue(50)
q.show()
print("is_full?", q.is_full())

while not q.is_empty():
    print(q.dequeue(), end=" ")
print()
q.show()
```

실행 결과:

```text
front=0 rear=3 len=3 배열=[10, 20, 30, None]
오류: enqueue: 큐가 가득 찼습니다
dequeue -> 10 20
front=2 rear=3 len=1 배열=[None, None, 30, None]
front=2 rear=1 len=3 배열=[50, None, 30, 40]
is_full? True
30 40 50
front=1 rear=1 len=0 배열=[None, None, None, None]
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[None] * (capacity + 1)`                       | 가득 찬 상태를 구별하려고 한 칸을 더 만듭니다. capacity가 3이면 배열 길이는 4입니다.                                                                                  |
| `return self._next(self._rear) == self._front`  | rear 바로 다음이 front이면 "가득 찼다"고 약속합니다. 첫 줄에서 rear=3의 다음은 (3+1)%4 = 0 = front이므로 4번째 값을 거절했습니다. 배열에는 빈칸이 하나 남아 있습니다. |
| `raise OverflowError(...)`                      | 가득 찼을 때는 `OverflowError`, 비었을 때는 `IndexError`를 발생시켜 두 실패를 구별합니다.                                                                             |
| `self._items[self._front] = None`               | 필수는 아니지만, 꺼낸 칸을 비워 두면 출력으로 상태를 확인하기 쉽고 큰 객체를 담았을 때 메모리가 빨리 회수됩니다.                                                      |
| `(self._rear - self._front) % len(self._items)` | 다섯째 줄에서 rear=1, front=2라 뺄셈 결과는 -1이지만 Python의 `%`는 `-1 % 4 = 3`을 줍니다. C였다면 이 식에 길이를 먼저 더해야 합니다.                                 |

다섯째 줄 `front=2 rear=1`을 보세요. rear가 front보다 **작은데도** 원소가 3개 있습니다. rear가 한 바퀴 돌아왔기 때문입니다. 원형 큐에서는 front와 rear의 크기 비교로 상태를 판단하면 안 됩니다.

## 7. Rust로 구현하기

Rust에서는 크기 제한이 없는 원형 버퍼 `RingQueue<T>`를 만듭니다. 비어 있는 칸을 표현하려고 `Vec<Option<T>>`를 쓰고, 가득 차면 용량을 두 배로 늘립니다. 앞쪽에 넣는 `push_front`도 만들어 4.3절의 "front를 뒤로 옮기기"를 직접 써 봅니다.

```rust
// 파일: ring_queue.rs
struct RingQueue<T> {
    buf: Vec<Option<T>>,
    head: usize,               // 맨 앞 원소의 인덱스
    len: usize,                // 원소 수
}

impl<T: std::fmt::Debug> RingQueue<T> {
    fn with_capacity(cap: usize) -> Self {
        let mut buf = Vec::with_capacity(cap);
        for _ in 0..cap {
            buf.push(None);
        }
        RingQueue { buf, head: 0, len: 0 }
    }

    fn capacity(&self) -> usize {
        self.buf.len()
    }

    fn grow(&mut self) {
        let old_cap = self.capacity();
        let new_cap = old_cap * 2;
        let mut new_buf: Vec<Option<T>> = Vec::with_capacity(new_cap);
        for k in 0..self.len {
            let i = (self.head + k) % old_cap;
            new_buf.push(self.buf[i].take());    // 논리적 순서대로 옮긴다
        }
        while new_buf.len() < new_cap {
            new_buf.push(None);
        }
        self.buf = new_buf;
        self.head = 0;
        println!("  (용량 {} → {}로 늘림)", old_cap, new_cap);
    }

    fn push_back(&mut self, value: T) {
        if self.len == self.capacity() {
            self.grow();
        }
        let tail = (self.head + self.len) % self.capacity();
        self.buf[tail] = Some(value);
        self.len += 1;
    }

    fn push_front(&mut self, value: T) {
        if self.len == self.capacity() {
            self.grow();
        }
        let cap = self.capacity();
        self.head = (self.head + cap - 1) % cap;  // usize라서 먼저 더한다
        self.buf[self.head] = Some(value);
        self.len += 1;
    }

    fn pop_front(&mut self) -> Option<T> {
        if self.len == 0 {
            return None;
        }
        let value = self.buf[self.head].take();
        self.head = (self.head + 1) % self.capacity();
        self.len -= 1;
        value
    }

    fn show(&self, label: &str) {
        println!("{:<14} head={} len={} buf={:?}", label, self.head, self.len, self.buf);
    }
}

fn main() {
    let mut q: RingQueue<i32> = RingQueue::with_capacity(4);
    for value in [10, 20, 30] {
        q.push_back(value);
    }
    q.show("push 10~30");

    println!("pop_front -> {:?} {:?}", q.pop_front(), q.pop_front());
    q.push_back(40);
    q.push_back(50);
    q.push_back(60);
    q.show("push 40~60");

    q.push_back(70);
    q.show("push 70");

    q.push_front(5);
    q.show("push_front 5");

    let mut order = Vec::new();
    while let Some(value) = q.pop_front() {
        order.push(value);
    }
    println!("꺼낸 순서: {:?}", order);
    println!("빈 큐 pop: {:?}", q.pop_front());
}
```

실행 결과:

```text
push 10~30     head=0 len=3 buf=[Some(10), Some(20), Some(30), None]
pop_front -> Some(10) Some(20)
push 40~60     head=2 len=4 buf=[Some(50), Some(60), Some(30), Some(40)]
  (용량 4 → 8로 늘림)
push 70        head=0 len=5 buf=[Some(30), Some(40), Some(50), Some(60), Some(70), None, None, None]
push_front 5   head=7 len=6 buf=[Some(30), Some(40), Some(50), Some(60), Some(70), None, None, Some(5)]
꺼낸 순서: [5, 30, 40, 50, 60, 70]
빈 큐 pop: None
```

### 코드 한 부분씩 읽기

| 코드                                                              | 설명                                                                                                                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `buf: Vec<Option<T>>`                                             | 각 칸은 값이 있으면 `Some(값)`, 비었으면 `None`입니다. C는 빈칸에도 쓰레기 값이 남지만, Rust는 "비어 있음"을 타입으로 표현합니다.                                                                       |
| `self.buf[i].take()`                                              | `take()`는 칸의 값을 꺼내고 그 자리에 `None`을 남깁니다. `Vec` 안의 값을 소유권째로 꺼내는 대표적인 방법입니다. 그냥 `self.buf[i]`로 가져오려 하면 "빌린 곳에서 이동할 수 없다"는 컴파일 오류가 납니다. |
| `for k in 0..self.len { let i = (self.head + k) % old_cap; ... }` | 물리적 순서(0, 1, 2, 3)가 아니라 **논리적 순서**(head부터)로 옮깁니다. 셋째 줄의 `[50, 60, 30, 40]`이 다섯째 줄에서 `[30, 40, 50, 60, ...]`으로 정리된 것을 확인하세요.                                 |
| `self.head = 0;`                                                  | 옮긴 뒤에는 맨 앞 원소가 0번 칸에 있습니다.                                                                                                                                                             |
| `(self.head + cap - 1) % cap`                                     | `usize`는 음수가 될 수 없어서 `self.head - 1`은 head가 0일 때 **panic**합니다(디버그 빌드의 뺄셈 오버플로). 그래서 cap을 먼저 더합니다. 여섯째 줄에서 head가 0에서 7로 이동했습니다.                    |
| `fn pop_front(&mut self) -> Option<T>`                            | 비었으면 `None`, 아니면 `take()`로 꺼낸 `Some(값)`을 그대로 돌려줍니다.                                                                                                                                 |

용량은 `push 70`에서 **한 번만** 늘어났습니다. 원소가 4개로 가득 찬 상태에서 70을 넣으려 했기 때문입니다. `push_front 5` 때는 원소가 5개, 용량이 8이라 늘릴 필요가 없었고, head만 0에서 7로 옮겨 **배열의 맨 끝 칸**에 5를 넣었습니다. 5는 물리적으로는 맨 끝에 있지만 head가 7이므로 큐의 맨 앞이고, 그래서 가장 먼저 꺼내집니다. 이렇게 양쪽 끝에서 넣고 뺄 수 있는 원형 버퍼가 표준 라이브러리 `VecDeque`의 기본 구조입니다.

> **참고**: 용량을 두 배로 늘리는 순간은 원소를 모두 옮기므로 O(n)입니다. 하지만 용량이 4 → 8 → 16 → 32로 늘어나는 동안 옮기는 총 횟수는 넣은 원소 수의 두 배를 넘지 않습니다. 그래서 push는 상각 O(1)입니다.

## 8. 실행 추적

C 프로그램에서 넷째 줄까지의 과정을 표로 따라갑니다. rear는 저장하지 않고 `(front + count) % 4`로 계산합니다.

| 단계 | 연산         | 쓰거나 읽은 칸 | front | count | 계산된 rear | 배열 (0~3)    |
| ---: | ------------ | -------------- | ----: | ----: | ----------: | ------------- |
|    1 | enqueue 10   | 0              |     0 |     1 |           1 | `10 .  .  .`  |
|    2 | enqueue 20   | 1              |     0 |     2 |           2 | `10 20 .  .`  |
|    3 | enqueue 30   | 2              |     0 |     3 |           3 | `10 20 30 .`  |
|    4 | dequeue → 10 | 0              |     1 |     2 |           3 | `.  20 30 .`  |
|    5 | dequeue → 20 | 1              |     2 |     1 |           3 | `.  .  30 .`  |
|    6 | enqueue 40   | 3              |     2 |     2 |       **0** | `.  .  30 40` |
|    7 | enqueue 50   | **0**          |     2 |     3 |           1 | `50 .  30 40` |
|    8 | enqueue 60   | 1              |     2 |     4 |           2 | `50 60 30 40` |
|    9 | enqueue 70   | 거절           |     2 |     4 |           2 | 가득 참       |

6단계 이후 rear가 0으로 돌아가 7단계에서 0번 칸을 다시 썼습니다. 9단계에서는 rear와 front가 모두 2이지만 count가 4이므로 "가득 찼다"고 정확히 판단합니다.

## 9. 다른 예제로 다시 이해하기

원형 버퍼는 큐가 아닌 곳에서도 많이 쓰입니다. 대표적인 예가 **"최근 N개만 기억하기"** 입니다. 센서가 1초마다 온도를 보내는데 최근 3개의 평균만 필요하다면, 크기 3인 배열에 값을 차례로 덮어쓰면 됩니다. 가득 찬 뒤에는 쓰기 위치가 항상 **가장 오래된 값**을 가리키므로, 거절하는 대신 덮어쓰기만 하면 됩니다. 이 방식은 거절도 늘리기도 하지 않아서 메모리 사용량이 항상 일정합니다. 로그 보관, 오디오 처리, 네트워크 패킷 버퍼처럼 **최신 데이터만 중요한** 곳에서 흔히 씁니다.

```c
// 파일: moving_average.c
#include <stdio.h>

#define WINDOW 3

int main(void) {
    double temps[] = {20.0, 22.0, 24.0, 30.0, 18.0, 18.0};
    int n = sizeof temps / sizeof temps[0];
    double window[WINDOW];
    int next = 0;               // 다음에 덮어쓸 칸
    int count = 0;              // 채워진 칸 수 (최대 WINDOW)

    for (int i = 0; i < n; i++) {
        window[next] = temps[i];            // 가장 오래된 칸을 덮어쓴다
        next = (next + 1) % WINDOW;
        if (count < WINDOW) {
            count++;
        }

        double sum = 0.0;
        for (int k = 0; k < count; k++) {
            sum += window[k];
        }
        printf("입력 %4.1f -> 최근 %d개 평균 %5.2f\n",
               temps[i], count, sum / count);
    }
    return 0;
}
```

실행 결과:

```text
입력 20.0 -> 최근 1개 평균 20.00
입력 22.0 -> 최근 2개 평균 21.00
입력 24.0 -> 최근 3개 평균 22.00
입력 30.0 -> 최근 3개 평균 25.33
입력 18.0 -> 최근 3개 평균 24.00
입력 18.0 -> 최근 3개 평균 22.00
```

평균을 낼 때 `window[0]`부터 `window[count-1]`까지 더하는 것에 주목하세요. 평균은 **순서와 상관없으므로** 논리적 순서대로 읽을 필요가 없습니다. 가득 차기 전에는 앞의 count칸만 채워져 있고, 가득 찬 뒤에는 모든 칸이 유효하므로 이 반복이 항상 맞습니다.

Python에서는 `collections.deque(maxlen=3)`이 이 동작을 대신 해 줍니다. 가득 찬 deque에 `append`하면 반대쪽 끝의 가장 오래된 값이 자동으로 버려집니다.

```python
# 파일: moving_average.py
from collections import deque

window = deque(maxlen=3)
for t in [20.0, 22.0, 24.0, 30.0, 18.0, 18.0]:
    window.append(t)
    print(f"입력 {t:4.1f} -> 최근 {len(window)}개 평균 "
          f"{sum(window) / len(window):5.2f}  {list(window)}")
```

실행 결과:

```text
입력 20.0 -> 최근 1개 평균 20.00  [20.0]
입력 22.0 -> 최근 2개 평균 21.00  [20.0, 22.0]
입력 24.0 -> 최근 3개 평균 22.00  [20.0, 22.0, 24.0]
입력 30.0 -> 최근 3개 평균 25.33  [22.0, 24.0, 30.0]
입력 18.0 -> 최근 3개 평균 24.00  [24.0, 30.0, 18.0]
입력 18.0 -> 최근 3개 평균 22.00  [30.0, 18.0, 18.0]
```

마지막으로 4.3절의 **음수 나머지 차이**를 세 언어로 직접 확인해 봅시다.

```c
// 파일: modulo.c
#include <stdio.h>

int main(void) {
    int cap = 5;
    int front = 0;
    printf("C:      -1 %% 5 = %d, -7 %% 5 = %d\n", -1 % cap, -7 % cap);
    printf("C 안전: (front - 1 + cap) %% cap = %d\n", (front - 1 + cap) % cap);
    return 0;
}
```

실행 결과:

```text
C:      -1 % 5 = -1, -7 % 5 = -2
C 안전: (front - 1 + cap) % cap = 4
```

```python
# 파일: modulo.py
cap = 5
front = 0
print(f"Python: -1 % 5 = {-1 % cap}, -7 % 5 = {-7 % cap}")
print(f"Python: (front - 1) % cap = {(front - 1) % cap}")
```

실행 결과:

```text
Python: -1 % 5 = 4, -7 % 5 = 3
Python: (front - 1) % cap = 4
```

```rust
// 파일: modulo.rs
fn main() {
    let cap: i32 = 5;
    println!("Rust:   -1 % 5 = {}, -7 % 5 = {}", -1 % cap, -7 % cap);
    println!("Rust:   (-1).rem_euclid(5) = {}", (-1_i32).rem_euclid(cap));
    let front: usize = 0;
    let ucap: usize = 5;
    println!("Rust:   (front + cap - 1) % cap = {}", (front + ucap - 1) % ucap);
}
```

실행 결과:

```text
Rust:   -1 % 5 = -1, -7 % 5 = -2
Rust:   (-1).rem_euclid(5) = 4
Rust:   (front + cap - 1) % cap = 4
```

C의 `printf`에서 `%` 기호 자체를 출력하려면 `%%`로 두 번 써야 합니다. Rust는 `rem_euclid`로 Python과 같은 "항상 0 이상인 나머지"를 구할 수 있습니다.

## 10. 시간·공간 복잡도

| 연산             | C 고정 원형 큐 | Python 한 칸 비우기 | Rust 늘어나는 원형 버퍼 |
| ---------------- | -------------- | ------------------- | ----------------------- |
| enqueue/push     | O(1)           | O(1)                | 상각 O(1)               |
| dequeue/pop      | O(1)           | O(1)                | O(1)                    |
| 가득 찼는지 확인 | O(1)           | O(1)                | 가득 차면 늘림          |
| 공간             | CAPACITY칸     | capacity + 1칸      | 원소 수의 최대 2배      |

선형 큐와 달리 **빈칸을 계속 재사용**하므로, 고정 크기 원형 큐는 동시에 들어 있는 원소 수만 용량 이하면 계속 사용할 수 있습니다.

## 11. 세 언어 비교

| 관점            | C (개수 세기)                     | Python (한 칸 비우기)        | Rust (늘어나는 버퍼)             |
| --------------- | --------------------------------- | ---------------------------- | -------------------------------- |
| 상태 변수       | `front`, `count`                  | `front`, `rear`              | `head`, `len`                    |
| 비었다          | `count == 0`                      | `front == rear`              | `len == 0`                       |
| 가득 찼다       | `count == CAPACITY`               | `(rear + 1) % 길이 == front` | `len == capacity()` → 늘림       |
| 빈칸 표현       | 쓰레기 값이 남음                  | `None`으로 비움              | `Option<T>`의 `None`             |
| 음수 나머지     | `-1 % 5 == -1` (길이를 더해야 함) | `-1 % 5 == 4`                | `-1 % 5 == -1`, `rem_euclid`는 4 |
| 표준 라이브러리 | 없음                              | `collections.deque`          | `std::collections::VecDeque`     |

세 구현 모두 **"다음 인덱스 = (현재 + 1) % 길이"** 라는 핵심은 같습니다. 다른 점은 비었는지·가득 찼는지를 판단하는 약속과, 음수 나머지를 다루는 방법입니다.

## 12. 자주 하는 실수

### 실수 1: 괄호를 빼서 나머지가 적용되지 않는다

```c
rear = rear + 1 % CAPACITY;     // rear + (1 % CAPACITY) = rear + 1
```

`%`는 `+`보다 먼저 계산됩니다. rear가 계속 커져서 결국 `items[CAPACITY]`, 즉 배열 밖에 쓰게 되고 이는 **정의되지 않은 동작**입니다. 실습의 디버그 문제에서 직접 고쳐 보세요.

### 실수 2: front == rear만으로 빈 상태를 판단한다

count도 두지 않고 한 칸도 비우지 않으면, 가득 찬 큐를 비었다고 잘못 판단합니다. 그러면 가득 찬 큐에 계속 넣어 가장 오래된 값을 덮어쓰거나, 원소가 있는데 "비었다"고 거절합니다. 두 방법 중 **하나를 골라 끝까지** 지키세요.

### 실수 3: C에서 음수 나머지로 인덱스를 만든다

```c
front = (front - 1) % CAPACITY;   // front가 0이면 -1!
```

C에서 `-1 % 4`는 `-1`이므로 `items[-1]`에 접근하게 됩니다. `(front - 1 + CAPACITY) % CAPACITY`로 쓰세요. Python 코드를 C로 옮길 때 특히 자주 생기는 실수입니다.

### 실수 4: Rust usize에서 1을 먼저 뺀다

```rust
// 파일: usize_underflow.rs (실행 오류: attempt to subtract with overflow)
fn main() {
    let cap: usize = 4;
    let head: usize = std::hint::black_box(0);
    let new_head = (head - 1) % cap;      // 0 - 1 → usize로 표현할 수 없음
    println!("{new_head}");
}
```

디버그 빌드에서 실행하면 다음과 같이 멈춥니다.

```text
thread 'main' panicked at ...: attempt to subtract with overflow
```

`usize`는 0 이상의 정수만 담을 수 있으므로 0에서 1을 빼면 오버플로입니다. C라면 조용히 엉뚱한 큰 수가 되었을 상황을 Rust는 멈춰서 알려 줍니다. `(head + cap - 1) % cap`처럼 **더한 뒤 빼세요.** `black_box`는 컴파일러가 이 계산을 미리 해 버리지 않도록 막는 도구이며, 이 예제를 위해서만 썼습니다.

### 실수 5: 용량을 늘릴 때 배열을 그대로 복사한다

한 바퀴 돈 버퍼 `[50, 60, 30, 40]`(head=2)을 그대로 새 배열 앞에 복사하면, head=2부터 읽을 때 30, 40 다음에 빈칸이 나와 50과 60을 잃어버립니다. 본문 Rust 코드처럼 **head부터 len개를 순서대로** 옮기고 head를 0으로 두세요.

## 13. Q&A

**Q. 개수 세기와 한 칸 비우기 중 무엇을 써야 하나요?**

A. 혼자 쓰는 큐라면 개수 세기가 이해하기 쉽고 칸 낭비도 없습니다. 한 칸 비우기는 "넣는 쪽은 rear만, 빼는 쪽은 front만 바꾼다"는 장점이 있어서, 두 스레드가 한 큐를 나눠 쓰는 경우(생산자·소비자) 잠금 없이 구현하기 쉽습니다. 이 수업에서는 둘 다 알아 두면 충분합니다.

**Q. 용량을 2의 거듭제곱(4, 8, 16…)으로 잡는 이유가 있나요?**

A. 용량이 2의 거듭제곱이면 `i % cap`을 비트 연산 `i & (cap - 1)`로 바꿀 수 있어 조금 더 빠릅니다. 많은 원형 버퍼 구현이 이 때문에 용량을 2의 거듭제곱으로 맞춥니다. 학습용 코드에서는 `%`가 뜻이 분명해서 더 좋습니다.

**Q. Python의 `deque`도 원형 버퍼인가요?**

A. CPython의 deque는 고정 크기 **블록을 이중 연결 리스트로 이은** 구조입니다. 원형 버퍼와는 다르지만 양 끝에서 O(1)로 넣고 뺀다는 성질은 같습니다. Rust의 `VecDeque`는 오늘 만든 것과 같은 원형 버퍼입니다.

**Q. 가득 찬 고정 원형 큐에 넣으면 거절해야 하나요, 덮어써야 하나요?**

A. 목적에 따라 다릅니다. 작업 대기열처럼 **하나라도 잃으면 안 되는** 데이터는 거절하고 호출자에게 알려야 합니다. 센서 값처럼 **최신 값만 중요한** 데이터는 가장 오래된 값을 덮어쓰는 편이 낫습니다(9절의 이동 평균).

## 14. 핵심 요약

- 원형 큐는 `(i + 1) % 길이`로 인덱스를 배열 처음으로 되돌려 **빈칸을 재사용**합니다.
- `%`는 `+`보다 먼저 계산되므로 반드시 `(rear + 1) % CAPACITY`처럼 괄호를 씁니다.
- 원형 큐에서는 `front == rear`가 "비었다"와 "가득 찼다"를 모두 뜻할 수 있습니다. **개수를 세거나**(C, Rust) **한 칸을 비워** 둬서(Python) 구별합니다.
- 배열의 물리적 순서와 큐의 논리적 순서는 다를 수 있습니다. 용량을 늘릴 때는 head부터 순서대로 옮깁니다.
- 음수 나머지는 C·Rust에서 음수, Python에서 0 이상입니다. C와 Rust에서는 길이를 먼저 더한 뒤 나머지를 구합니다.
- 가득 찼을 때 거절할지 덮어쓸지는 데이터의 성격에 따라 정합니다.

## 15. 도전 문제

1. **(C)** 원형 큐에 앞쪽에 넣는 `push_front`와 뒤쪽에서 빼는 `pop_back`을 추가해 **덱(deque)** 을 만들어 보세요. 음수 나머지에 주의하세요.
2. **(Python)** `CircularQueue`에 배열 순서가 아니라 **큐 순서**(front부터)로 원소를 돌려주는 `to_list()`를 만드세요.
3. **(Rust)** `RingQueue`에 원소 수가 용량의 1/4 이하로 줄면 용량을 절반으로 줄이는 `shrink`를 추가해 보세요. 용량이 4 밑으로 내려가지 않게 하세요.
4. **(세 언어)** 크기 5인 덮어쓰기 원형 버퍼로 "최근 5개 명령어 기록"을 만들어, 명령어 8개를 넣은 뒤 **오래된 것부터** 출력해 보세요.
