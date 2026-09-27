---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-59-queue
courseId: crp-92
phaseId: phase-06
dayNumber: 59
date: "2026-11-28"
title: 큐 — 먼저 온 것을 먼저 처리하는 자료구조
summary: FIFO 규칙과 enqueue·dequeue·front 연산을 이해합니다. C에서는 배열과 front·rear 인덱스로 선형 큐를 만들고 그 한계를 확인합니다. Python과 Rust에서는 스택 두 개로 큐를 직접 구현한 뒤 표준 라이브러리 deque·VecDeque 사용법을 익힙니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-58-undo-stack]
learningObjectives:
  - 큐가 필요한 상황을 FIFO 규칙으로 설명하고 스택과 구별한다.
  - enqueue, dequeue 뒤의 front·rear와 큐 상태를 손으로 추적한다.
  - C 배열 선형 큐를 구현하고 앞쪽 빈칸을 재사용하지 못하는 한계를 설명한다.
  - 스택 두 개로 큐를 만들고 상각 O(1)인 이유를 설명한다.
  - Python deque와 Rust VecDeque로 큐를 쓰고, list.pop(0)이 느린 이유를 설명한다.
concepts: [queue, fifo, enqueue, dequeue, front, rear, two-stack queue, deque]
runnerMode: python
playgroundSource: |
  # 파일: two_stack_queue.py — enqueue와 dequeue 순서를 바꿔 실행해 보세요.
  class Queue:
      def __init__(self):
          self._inbox = []
          self._outbox = []

      def enqueue(self, value):
          self._inbox.append(value)

      def dequeue(self):
          if not self._outbox:
              while self._inbox:
                  self._outbox.append(self._inbox.pop())
          if not self._outbox:
              raise IndexError("dequeue: 큐가 비어 있습니다")
          return self._outbox.pop()


  q = Queue()
  for name in ["민수", "지아", "하준"]:
      q.enqueue(name)
  print(q.dequeue(), q.dequeue())
  q.enqueue("서연")
  print(q.dequeue(), q.dequeue())
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day59-predict-py
    title: deque로 줄 서기 추적하기
    kind: predict
    objective: append와 popleft가 양 끝에서 일어난다는 것을 확인한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      from collections import deque

      line = deque()
      line.append("A")
      line.append("B")
      line.append("C")
      first = line.popleft()
      line.append(first)
      line.popleft()
      print(first, list(line))
    answer: "A ['C', 'A']"
    hint: popleft()는 맨 앞(가장 먼저 들어온 쪽)에서 꺼냅니다. 꺼낸 A를 다시 뒤에 넣은 뒤 또 앞에서 하나를 꺼냅니다.
    explanation: "A, B, C가 줄을 섭니다. A가 나가서 다시 맨 뒤에 서면 [B, C, A]이고, 앞의 B가 나가면 [C, A]가 남습니다."
    commonMistakes:
      - "popleft 대신 pop처럼 뒤에서 꺼낸다고 생각함"
      - "다시 넣은 A가 맨 앞으로 간다고 생각함"
    language: python
    verification: run
  - id: ex-day59-predict-c
    title: C 선형 큐의 인덱스 추적하기
    kind: predict
    objective: front와 rear가 한 방향으로만 움직이는 모습을 추적한다.
    prompt: 출력될 세 숫자(front, rear, 원소 수)를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int items[6];
          int front = 0, rear = 0;

          items[rear++] = 10;
          items[rear++] = 20;
          items[rear++] = 30;
          front++;
          items[rear++] = 40;
          front++;
          printf("%d %d %d\n", front, rear, rear - front);
          (void)items;
          return 0;
      }
    answer: "2 4 2"
    hint: 넣을 때마다 rear가 1 늘고, 꺼낼 때마다 front가 1 늡니다. 원소 수는 rear - front입니다.
    explanation: "네 번 넣었으므로 rear는 4, 두 번 꺼냈으므로 front는 2입니다. 남은 원소는 30, 40 두 개입니다. 인덱스 0과 1은 비었지만 이 방식으로는 다시 쓸 수 없습니다."
    commonMistakes:
      - "꺼내면 rear가 줄어든다고 생각함"
      - "원소 수를 rear로 착각함"
    language: c
    verification: run
  - id: ex-day59-fill
    title: Rust 두 스택 큐의 옮겨 담기
    kind: fill
    objective: outbox가 비었을 때만 inbox의 원소를 뒤집어 옮긴다.
    prompt: "dequeue의 빈칸을 채우세요. outbox가 비어 있으면 inbox에서 pop한 값을 outbox에 push하는 일을 inbox가 빌 때까지 반복해야 합니다."
    starter: |-
      struct Queue<T> {
          inbox: Vec<T>,
          outbox: Vec<T>,
      }

      impl<T> Queue<T> {
          fn enqueue(&mut self, value: T) {
              self.inbox.push(value);
          }

          fn dequeue(&mut self) -> Option<T> {
              if self.outbox.is_empty() {
                  while let Some(value) = _____ {
                      _____;
                  }
              }
              self.outbox.pop()
          }
      }

      fn main() {
          let mut q = Queue { inbox: Vec::new(), outbox: Vec::new() };
          q.enqueue(1);
          q.enqueue(2);
          q.enqueue(3);
          println!("{:?} {:?}", q.dequeue(), q.dequeue());
      }
    answer: |-
      struct Queue<T> {
          inbox: Vec<T>,
          outbox: Vec<T>,
      }

      impl<T> Queue<T> {
          fn enqueue(&mut self, value: T) {
              self.inbox.push(value);
          }

          fn dequeue(&mut self) -> Option<T> {
              if self.outbox.is_empty() {
                  while let Some(value) = self.inbox.pop() {
                      self.outbox.push(value);
                  }
              }
              self.outbox.pop()
          }
      }

      fn main() {
          let mut q = Queue { inbox: Vec::new(), outbox: Vec::new() };
          q.enqueue(1);
          q.enqueue(2);
          q.enqueue(3);
          println!("{:?} {:?}", q.dequeue(), q.dequeue());
      }
    hint: Day 57의 while let Some(value) = s.pop() 관용구를 떠올리세요. 꺼낸 값은 반대쪽 스택으로 옮깁니다.
    explanation: "inbox [1, 2, 3]을 pop해서 outbox에 넣으면 outbox는 [3, 2, 1]이 되어 top이 1입니다. 순서가 한 번 뒤집히면서 가장 먼저 들어온 값이 top에 오므로 출력은 Some(1) Some(2)입니다."
    commonMistakes:
      - "outbox가 비지 않았는데도 옮겨 담아 순서를 섞음"
      - "inbox를 pop하지 않고 인덱스로 복사해 원소가 두 번 들어감"
    language: rust
    verification: run
  - id: ex-day59-modify
    title: Python 두 스택 큐에 peek 추가하기
    kind: modify
    objective: 원소를 꺼내지 않고 맨 앞을 보는 연산을 두 스택 구조에 맞게 만든다.
    prompt: "Queue에 peek()를 추가하세요. 맨 앞 원소를 돌려주되 큐에서 빼지 않아야 합니다. 옮겨 담는 코드는 _shift()로 분리해 dequeue와 함께 쓰세요."
    starter: |-
      class Queue:
          def __init__(self):
              self._inbox = []
              self._outbox = []

          def enqueue(self, value):
              self._inbox.append(value)

          def dequeue(self):
              if not self._outbox:
                  while self._inbox:
                      self._outbox.append(self._inbox.pop())
              return self._outbox.pop()


      q = Queue()
      q.enqueue("x")
      q.enqueue("y")
      print(q.dequeue())
    answer: |-
      class Queue:
          def __init__(self):
              self._inbox = []
              self._outbox = []

          def enqueue(self, value):
              self._inbox.append(value)

          def _shift(self):
              if not self._outbox:
                  while self._inbox:
                      self._outbox.append(self._inbox.pop())

          def dequeue(self):
              self._shift()
              return self._outbox.pop()

          def peek(self):
              self._shift()
              return self._outbox[-1]


      q = Queue()
      q.enqueue("x")
      q.enqueue("y")
      print(q.peek(), q.peek(), q.dequeue(), q.peek())
    hint: 맨 앞 원소는 옮겨 담은 뒤 outbox의 top, 즉 _outbox[-1]입니다.
    explanation: "peek도 dequeue처럼 먼저 옮겨 담아야 맨 앞 원소가 outbox의 top에 옵니다. 출력은 x x x y입니다. peek를 여러 번 불러도 큐는 변하지 않습니다."
    commonMistakes:
      - "_inbox[0]을 돌려줘서 outbox에 이미 값이 있을 때 틀린 원소를 보여 줌"
      - "peek에서 pop을 호출해 원소를 제거함"
    language: python
    verification: run
  - id: ex-day59-debug
    title: C 큐의 dequeue 오류 고치기
    kind: debug
    objective: 빈 큐 검사와 꺼내는 위치를 바로잡는다.
    prompt: 이 dequeue는 rear 쪽에서 꺼내고 빈 큐도 검사하지 않습니다. FIFO가 되도록 고치고, 비었으면 false를 돌려주게 하세요.
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define CAPACITY 4

      typedef struct {
          int items[CAPACITY];
          int front;
          int rear;
      } Queue;

      bool dequeue(Queue *q, int *out) {
          *out = q->items[--q->rear];
          return true;
      }

      int main(void) {
          Queue q = { .front = 0, .rear = 0 };
          q.items[q.rear++] = 1;
          q.items[q.rear++] = 2;
          int value;
          while (dequeue(&q, &value)) {
              printf("%d ", value);
              if (value == 0) break;
          }
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define CAPACITY 4

      typedef struct {
          int items[CAPACITY];
          int front;
          int rear;
      } Queue;

      bool dequeue(Queue *q, int *out) {
          if (q->front == q->rear) {
              return false;
          }
          *out = q->items[q->front++];
          return true;
      }

      int main(void) {
          Queue q = { .front = 0, .rear = 0 };
          q.items[q.rear++] = 1;
          q.items[q.rear++] = 2;
          int value;
          while (dequeue(&q, &value)) {
              printf("%d ", value);
          }
          printf("\n");
          return 0;
      }
    hint: 큐는 앞(front)에서 꺼냅니다. front와 rear가 같으면 넣은 만큼 모두 꺼낸 것이므로 비어 있습니다.
    explanation: "원래 코드는 스택처럼 뒤에서 꺼내고(2, 1 순서), 비어도 계속 rear를 줄여 배열 밖을 읽습니다. 고친 코드는 front에서 꺼내 1 2를 출력하고, front == rear가 되면 false로 반복을 끝냅니다."
    commonMistakes:
      - "빈 조건을 front == 0으로 검사함"
      - "꺼낸 뒤 front가 아니라 rear를 움직임"
    language: c
    verification: run
  - id: ex-day59-independent
    title: Rust로 라운드 로빈 작업 처리기 만들기
    kind: independent
    objective: 끝나지 않은 작업을 큐 뒤로 보내는 순환 처리를 구현한다.
    prompt: "작업 (이름, 남은 시간)을 VecDeque에 넣고, 한 번에 최대 2만큼 처리하세요. 남은 시간이 있으면 큐 뒤로 다시 보내고, 끝난 작업은 이름을 출력합니다. A=3, B=1, C=4일 때 끝나는 순서 B A C를 한 줄에 출력하세요."
    starter: |-
      use std::collections::VecDeque;

      fn main() {
          let mut queue: VecDeque<(&str, u32)> = VecDeque::new();
          queue.push_back(("A", 3));
          queue.push_back(("B", 1));
          queue.push_back(("C", 4));
          // pop_front로 꺼내 2만큼 처리하고, 남으면 push_back 하세요.
          println!("{}", queue.len());
      }
    answer: |-
      use std::collections::VecDeque;

      fn main() {
          let mut queue: VecDeque<(&str, u32)> = VecDeque::new();
          queue.push_back(("A", 3));
          queue.push_back(("B", 1));
          queue.push_back(("C", 4));

          let slice = 2;
          let mut finished = Vec::new();
          while let Some((name, left)) = queue.pop_front() {
              if left > slice {
                  queue.push_back((name, left - slice));
              } else {
                  finished.push(name);
              }
          }
          println!("{}", finished.join(" "));
      }
    hint: 운영체제가 CPU 시간을 나눠 주는 방식과 같습니다. while let Some((name, left)) = queue.pop_front()로 튜플을 바로 풀 수 있습니다.
    explanation: "A(3)는 2를 처리하고 1이 남아 뒤로, B(1)는 끝, C(4)는 2가 남아 뒤로 갑니다. 다음 바퀴에 A가 끝나고, 그다음 C(2)가 끝나므로 B A C입니다."
    commonMistakes:
      - "left - slice를 먼저 계산해 u32가 음수가 되는 오버플로 panic을 일으킴"
      - "끝나지 않은 작업을 push_front로 다시 넣어 같은 작업만 계속 처리함"
    language: rust
    verification: run
quiz:
  - id: quiz-day59-01
    question: 빈 큐에 1, 2, 3을 차례로 enqueue한 뒤 dequeue를 한 번 하면 무엇이 나오나요?
    choices: ["1", "2", "3", "큐가 비어 있어 실패한다"]
    answerIndex: 0
    explanation: 큐는 가장 먼저 들어온 값을 먼저 내보냅니다(FIFO). 같은 순서로 스택에 넣었다면 3이 나왔을 것입니다.
  - id: quiz-day59-02
    question: "Python list로 큐를 만들 때 queue.pop(0)이 느린 이유는?"
    choices:
      - pop(0)은 원소를 복사해서 돌려주기 때문에
      - 맨 앞을 뺀 뒤 나머지 원소를 모두 한 칸씩 앞으로 옮기기 때문에
      - list는 앞에서 꺼내는 것이 금지되어 있기 때문에
      - 인덱스 0을 찾으려면 처음부터 훑어야 하기 때문에
    answerIndex: 1
    explanation: list는 원소를 빈틈없이 연속으로 저장하므로 맨 앞이 빠지면 뒤의 n-1개를 당겨야 합니다. 그래서 O(n)입니다. deque의 popleft()는 O(1)입니다.
  - id: quiz-day59-03
    question: C 배열 선형 큐에서 front = 3, rear = 5, 용량 5입니다. 이 큐의 상태로 옳은 것은?
    choices:
      - 원소가 5개이고 가득 찼다
      - 원소가 2개인데도 rear가 끝에 닿아 더 넣을 수 없다
      - 원소가 3개이다
      - 큐가 비어 있다
    answerIndex: 1
    explanation: 원소 수는 rear - front = 2입니다. 하지만 rear가 용량 5에 닿아서, 앞쪽 인덱스 0~2가 비어 있어도 쓸 수 없습니다. 이 문제를 해결하는 것이 Day 60의 원형 큐입니다.
  - id: quiz-day59-04
    question: 스택 두 개(inbox, outbox)로 만든 큐에서 dequeue할 때 inbox의 원소를 outbox로 옮기는 시점은?
    choices:
      - enqueue할 때마다
      - dequeue할 때마다 항상
      - outbox가 비어 있을 때만
      - inbox가 가득 찼을 때만
    answerIndex: 2
    explanation: outbox에 값이 남아 있으면 그 값들이 inbox의 값보다 먼저 들어온 것입니다. 이때 옮기면 순서가 섞입니다. outbox가 비었을 때만 한꺼번에 옮겨야 FIFO가 유지됩니다.
  - id: quiz-day59-05
    question: 두 스택 큐의 dequeue가 "상각 O(1)"이라고 말하는 이유로 가장 알맞은 것은?
    choices:
      - 옮겨 담기가 한 번도 일어나지 않기 때문에
      - 각 원소는 inbox에 한 번 들어가고, outbox로 한 번 옮겨지고, 한 번 나가므로 원소 하나당 일이 일정하기 때문에
      - Vec의 pop이 O(1)이기 때문에
      - 원소 수가 항상 작기 때문에
    answerIndex: 1
    explanation: 어떤 dequeue는 n개를 옮기느라 O(n)이 걸리지만, 한 원소가 옮겨지는 일은 평생 한 번뿐입니다. 전체 작업을 원소 수로 나누면 한 번에 상수 시간입니다.
---

## 1. 오늘 배울 내용

오늘은 스택과 짝을 이루는 자료구조 **큐(queue)** 를 배웁니다. 큐는 우리가 매일 서는 "줄"과 같습니다. 먼저 온 사람이 먼저 서비스를 받습니다.

이번 수업의 흐름은 다음과 같습니다.

1. 큐가 필요한 상황을 보고 **FIFO** 규칙을 익힙니다.
2. enqueue(넣기)와 dequeue(꺼내기)를 그림과 표로 추적합니다.
3. **C** 로 배열과 front·rear 인덱스를 써서 큐를 만들고, 이 방식의 **한계**를 직접 확인합니다.
4. **Python** 과 **Rust** 로 Day 57의 스택 두 개를 이용해 큐를 만듭니다. 스택만으로 큐를 만들 수 있다는 점이 오늘의 핵심 아이디어입니다.
5. 표준 라이브러리의 `collections.deque`(Python)와 `VecDeque`(Rust)를 사용하는 법을 익힙니다.
6. 응용 문제로 **요세푸스 문제**를 풉니다.

## 2. 왜 큐가 필요한가

다음 상황을 생각해 봅시다.

- 프린터에 문서 세 개를 보내면 **보낸 순서대로** 인쇄됩니다.
- 은행 번호표는 **먼저 뽑은 사람**부터 부릅니다.
- 게임 서버는 접속 요청을 **도착한 순서대로** 처리합니다.
- 키보드로 빠르게 입력한 글자들은 **입력한 순서대로** 화면에 나타납니다.

모두 "먼저 들어온 것을 먼저 처리한다"는 규칙입니다. 이 규칙을 **FIFO(First In, First Out, 선입선출)** 라고 합니다. Day 57의 스택은 LIFO였습니다. 두 규칙을 비교해 보세요.

| 구분    | 스택(stack)               | 큐(queue)                   |
| ------- | ------------------------- | --------------------------- |
| 규칙    | LIFO, 나중에 온 것이 먼저 | FIFO, 먼저 온 것이 먼저     |
| 넣는 곳 | top                       | rear(뒤)                    |
| 빼는 곳 | top (넣는 곳과 같음)      | front(앞, 넣는 곳의 반대편) |
| 대표 예 | 실행 취소, 괄호 검사      | 대기열, 프린터, BFS(Day 69) |

스택은 한쪽 끝만 쓰지만, 큐는 **양쪽 끝을 모두** 씁니다. 뒤에서 넣고 앞에서 뺍니다. 이 차이 때문에 큐를 효율적으로 구현하는 것이 스택보다 조금 까다롭습니다.

## 3. 그림으로 이해하기

```text
            dequeue ◄──                          ◄── enqueue
                      ┌─────┬─────┬─────┬─────┐
      꺼내는 쪽        │  A  │  B  │  C  │     │       넣는 쪽
                      └─────┴─────┴─────┴─────┘
                        ↑ front          ↑ rear
                     (맨 앞 원소)     (다음에 넣을 자리)
```

큐의 기본 연산은 다음과 같습니다.

| 연산               | 하는 일                    | 큐가 바뀌나? |
| ------------------ | -------------------------- | ------------ |
| `enqueue(x)`       | 맨 뒤에 x를 넣는다         | 예           |
| `dequeue()`        | 맨 앞 값을 꺼내서 돌려준다 | 예           |
| `front()`/`peek()` | 맨 앞 값을 보기만 한다     | 아니요       |
| `is_empty()`       | 비어 있는지 알려 준다      | 아니요       |
| `size()`           | 원소 개수를 알려 준다      | 아니요       |

## 4. 천천히 풀어보기

### 4.1 가장 단순한 방법: list의 앞에서 빼기

Python에서 가장 먼저 떠오르는 방법은 `append(x)`로 넣고 `pop(0)`으로 빼는 것입니다. 결과는 맞습니다. 그런데 list는 원소를 **빈틈없이 이어서** 저장합니다. 맨 앞 원소를 빼면 뒤의 원소들이 모두 한 칸씩 앞으로 이동해야 합니다.

```text
pop(0) 전:  [A][B][C][D][E]
A를 뺀다:   [ ][B][C][D][E]
당긴다:     [B][C][D][E]      ← B, C, D, E 네 개를 모두 옮겼다
```

원소가 n개면 dequeue 한 번에 n-1번 옮깁니다. 즉 **O(n)** 입니다. 10만 명이 줄을 선 상태에서 한 명씩 내보낼 때마다 10만 번 가까이 옮기는 셈입니다.

### 4.2 원소를 옮기지 않는 방법: front와 rear 인덱스

원소를 옮기는 대신 **"맨 앞이 어디인지"를 가리키는 인덱스를 움직이면** 됩니다. C 구현이 이 방법을 씁니다.

- `front`: 맨 앞 원소의 인덱스. dequeue하면 1 증가합니다.
- `rear`: 다음 원소를 넣을 인덱스. enqueue하면 1 증가합니다.
- 원소 개수는 `rear - front`, 비어 있는 조건은 `front == rear`입니다.

```text
시작          front=0 rear=0   [ ][ ][ ][ ]
enqueue(A)    front=0 rear=1   [A][ ][ ][ ]
enqueue(B)    front=0 rear=2   [A][B][ ][ ]
dequeue()→A   front=1 rear=2   [ ][B][ ][ ]   ← B를 옮기지 않았다!
enqueue(C)    front=1 rear=3   [ ][B][C][ ]
```

dequeue가 O(1)이 되었습니다. 하지만 새로운 문제가 생깁니다. front와 rear가 **오른쪽으로만** 움직이기 때문에 rear가 배열 끝에 닿으면, 앞쪽에 빈칸이 있어도 더 넣을 수 없습니다. 이것을 선형 큐의 **"가짜 가득 참"** 문제라고 부르겠습니다. C 프로그램에서 직접 확인하고, Day 60의 **원형 큐**로 해결합니다.

### 4.3 스택 두 개로 큐 만들기

이번에는 전혀 다른 아이디어입니다. 스택에 넣었다가 모두 꺼내면 **순서가 뒤집힙니다.** 한 번 더 뒤집으면 원래 순서가 됩니다. 이 성질로 큐를 만들 수 있습니다.

- **inbox** 스택: enqueue한 값을 여기에 push합니다.
- **outbox** 스택: dequeue는 여기서 pop합니다.
- dequeue할 때 outbox가 비어 있으면, inbox의 값을 **모두** pop해서 outbox에 push합니다. 이때 순서가 뒤집혀서 가장 먼저 들어온 값이 outbox의 top에 옵니다.

```text
enqueue 1, 2, 3        inbox  [1, 2, 3]   outbox []
dequeue (outbox 빔)    → inbox를 뒤집어 옮김
                       inbox  []          outbox [3, 2, 1]   ← top은 1
                       → pop → 1
enqueue 4              inbox  [4]         outbox [3, 2]
dequeue                outbox가 비지 않음 → 그냥 pop → 2
```

마지막 dequeue에서 **outbox가 비어 있지 않으면 옮기지 않는다**는 점이 중요합니다. outbox의 값(2, 3)은 inbox의 4보다 먼저 들어왔기 때문에 먼저 나가야 합니다.

"가끔 n개를 옮기면 느리지 않나?"라는 의문이 들 수 있습니다. 한 원소의 일생을 따라가 보세요. inbox에 **한 번** push되고, outbox로 **한 번** 옮겨지고, **한 번** pop됩니다. 원소 하나에 드는 일은 항상 일정합니다. 그래서 dequeue는 평균적으로 O(1)이며, 이를 **상각(amortized) O(1)** 이라고 합니다.

### 4.4 표준 라이브러리의 큐

직접 만들어 보는 것은 원리를 이해하기 위해서입니다. 실제 프로그램에서는 언어가 제공하는 큐를 씁니다.

| 언어   | 큐 타입                      | 넣기           | 꺼내기        | 맨 앞 보기 |
| ------ | ---------------------------- | -------------- | ------------- | ---------- |
| Python | `collections.deque`          | `append(x)`    | `popleft()`   | `q[0]`     |
| Rust   | `std::collections::VecDeque` | `push_back(x)` | `pop_front()` | `front()`  |
| C      | 표준 라이브러리에 없음       | 직접 구현      | 직접 구현     | 직접 구현  |

`deque`는 "double-ended queue"의 줄임말로 **양쪽 끝에서 모두 O(1)로** 넣고 뺄 수 있는 자료구조입니다. 내부적으로 원형 버퍼(Rust)나 블록 연결 구조(Python)를 씁니다.

## 5. C로 구현하기

C에는 큐가 없으므로 배열과 front·rear 인덱스로 선형 큐를 만듭니다. 프로그램 후반부에서 "가짜 가득 참" 문제를 일부러 일으켜 봅니다.

```c
// 파일: linear_queue.c
#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 4

typedef struct {
    int items[CAPACITY];
    int front;                  // 맨 앞 원소의 인덱스
    int rear;                   // 다음에 넣을 인덱스
} Queue;

void init(Queue *q) {
    q->front = 0;
    q->rear = 0;
}

bool is_empty(const Queue *q) {
    return q->front == q->rear;
}

bool is_full(const Queue *q) {
    return q->rear == CAPACITY;     // rear가 배열 끝에 닿았다
}

int size(const Queue *q) {
    return q->rear - q->front;
}

bool enqueue(Queue *q, int value) {
    if (is_full(q)) {
        return false;
    }
    q->items[q->rear] = value;      // ① rear 자리에 쓰고
    q->rear++;                      // ② rear를 한 칸 뒤로
    return true;
}

bool dequeue(Queue *q, int *out) {
    if (is_empty(q)) {
        return false;
    }
    *out = q->items[q->front];      // ① front의 값을 꺼내고
    q->front++;                     // ② front를 한 칸 뒤로
    return true;
}

void print_queue(const Queue *q) {
    printf("front=%d rear=%d size=%d  [", q->front, q->rear, size(q));
    for (int i = 0; i < CAPACITY; i++) {
        if (i >= q->front && i < q->rear) {
            printf(" %3d", q->items[i]);
        } else {
            printf("   .");         // 큐에 속하지 않는 칸
        }
    }
    printf(" ]\n");
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
    printf("dequeue -> %d\n", value);
    dequeue(&q, &value);
    printf("dequeue -> %d\n", value);
    print_queue(&q);

    enqueue(&q, 40);
    print_queue(&q);

    if (!enqueue(&q, 50)) {
        printf("enqueue(50) 실패: 원소는 %d개뿐인데 rear가 끝에 닿았습니다\n",
               size(&q));
    }

    while (dequeue(&q, &value)) {
        printf("%d ", value);
    }
    printf("\n");
    print_queue(&q);
    return 0;
}
```

실행 결과:

```text
front=0 rear=3 size=3  [  10  20  30   . ]
dequeue -> 10
dequeue -> 20
front=2 rear=3 size=1  [   .   .  30   . ]
front=2 rear=4 size=2  [   .   .  30  40 ]
enqueue(50) 실패: 원소는 2개뿐인데 rear가 끝에 닿았습니다
30 40
front=4 rear=4 size=0  [   .   .   .   . ]
```

### 코드 한 부분씩 읽기

| 코드                                     | 설명                                                                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `int front; int rear;`                   | 스택은 top 하나로 충분했지만, 큐는 **양 끝**을 따로 기억해야 합니다.                                                                                                                 |
| `return q->front == q->rear;`            | 넣은 만큼 모두 꺼냈으면 두 인덱스가 같아집니다. front가 0인지로 판단하면 틀립니다(마지막 줄처럼 front=4여도 비어 있습니다).                                                          |
| `return q->rear == CAPACITY;`            | rear는 "다음에 넣을 자리"이므로 CAPACITY와 같아지면 더 쓸 칸이 없습니다. Day 57 스택의 `top == CAPACITY - 1`과 비교해 보세요. **인덱스가 무엇을 뜻하는지**에 따라 조건이 달라집니다. |
| `q->items[q->rear] = value; q->rear++;`  | 스택 push와 반대로 **쓰고 나서** 올립니다. rear가 "다음 빈칸"을 가리키기 때문입니다.                                                                                                 |
| `*out = q->items[q->front]; q->front++;` | 꺼낸 칸의 값은 지우지 않고 front만 움직입니다. `print_queue`는 front~rear 범위 밖의 칸을 `.`으로 보여 줍니다.                                                                        |
| `printf(" %3d", ...)`                    | `%3d`는 정수를 3칸 너비에 오른쪽 정렬합니다. 칸이 가지런해져 배열 모양을 보기 쉽습니다.                                                                                              |

출력의 여섯째 줄을 보세요. 원소가 2개뿐이고 앞쪽 두 칸이 비어 있는데도 enqueue가 실패했습니다. 마지막 줄에서는 큐가 완전히 비었는데 front와 rear가 모두 4라서, 이 큐는 **다시는 아무것도 넣을 수 없습니다.** 이 문제는 다음 시간에 인덱스를 배열 끝에서 처음으로 **돌려 보내는** 원형 큐로 해결합니다.

> **참고**: 비었을 때 `front = rear = 0`으로 되돌리는 간단한 보완책도 있습니다. 하지만 큐가 한 번도 완전히 비지 않으면 여전히 앞칸을 쓸 수 없으므로 근본적인 해결책은 아닙니다.

## 6. Python으로 구현하기

Python에서는 Day 57의 스택(list) 두 개로 큐를 직접 만듭니다. 그다음 표준 라이브러리 `deque`와 비교합니다.

```python
# 파일: two_stack_queue.py
from collections import deque


class Queue:
    """스택 두 개로 만든 큐"""

    def __init__(self):
        self._inbox = []          # enqueue한 값이 쌓이는 스택
        self._outbox = []         # dequeue할 값이 기다리는 스택

    def enqueue(self, value):
        self._inbox.append(value)

    def _shift(self):
        # outbox가 비었을 때만 inbox를 뒤집어 옮긴다
        if not self._outbox:
            while self._inbox:
                self._outbox.append(self._inbox.pop())

    def dequeue(self):
        self._shift()
        if not self._outbox:
            raise IndexError("dequeue: 큐가 비어 있습니다")
        return self._outbox.pop()

    def peek(self):
        self._shift()
        if not self._outbox:
            raise IndexError("peek: 큐가 비어 있습니다")
        return self._outbox[-1]

    def __len__(self):
        return len(self._inbox) + len(self._outbox)

    def debug(self, label):
        print(f"{label:<12} inbox={self._inbox} outbox={self._outbox}")


q = Queue()
for value in [1, 2, 3]:
    q.enqueue(value)
q.debug("enqueue 1~3")

print("dequeue ->", q.dequeue())
q.debug("after")

q.enqueue(4)
q.debug("enqueue 4")
print("peek    ->", q.peek())
print("dequeue ->", q.dequeue(), q.dequeue(), q.dequeue())
print("len     ->", len(q))

try:
    q.dequeue()
except IndexError as error:
    print("오류:", error)

# 표준 라이브러리 deque
line = deque(["민수", "지아"])
line.append("하준")               # enqueue
print("deque   ->", line.popleft(), list(line))
```

실행 결과:

```text
enqueue 1~3  inbox=[1, 2, 3] outbox=[]
dequeue -> 1
after        inbox=[] outbox=[3, 2]
enqueue 4    inbox=[4] outbox=[3, 2]
peek    -> 2
dequeue -> 2 3 4
len     -> 0
오류: dequeue: 큐가 비어 있습니다
deque   -> 민수 ['지아', '하준']
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `self._inbox`, `self._outbox`                                | 두 list 모두 **스택으로만** 씁니다(`append`와 `pop()`만 사용). 앞에서 빼는 연산은 한 번도 쓰지 않았는데 큐가 됩니다.  |
| `if not self._outbox:`                                       | outbox에 값이 남아 있으면 옮기지 않습니다. 넷째 줄에서 4를 넣었을 때 outbox의 `[3, 2]`는 그대로입니다.                |
| `while self._inbox: ...pop()...append(...)`                  | inbox의 top(가장 최근 값)부터 옮기므로 outbox에는 역순으로 쌓입니다. 그 결과 가장 오래된 값이 outbox의 top에 옵니다.  |
| `def _shift(self):`                                          | dequeue와 peek가 같은 준비 작업을 하므로 한 메서드로 뺐습니다. 앞에 밑줄을 붙여 "밖에서 부르지 말 것"을 표시했습니다. |
| `len(self._inbox) + len(self._outbox)`                       | 원소는 두 스택 중 한 곳에만 있으므로 길이를 더하면 전체 개수입니다.                                                   |
| `print("dequeue ->", q.dequeue(), q.dequeue(), q.dequeue())` | 인자는 **왼쪽부터 차례로** 계산되므로 2, 3, 4 순서로 꺼내집니다. 4는 inbox에 있었지만 outbox가 빈 순간 옮겨집니다.    |
| `deque(["민수", "지아"])`, `popleft()`                       | 표준 deque는 양쪽 끝을 모두 O(1)로 다룹니다. 실무에서 큐가 필요하면 이것을 쓰세요.                                    |

> **TIP**: `deque`는 `appendleft()`, `pop()`도 지원하므로 스택으로도, 큐로도 쓸 수 있습니다. `maxlen=3`을 주면 가득 찼을 때 반대쪽 원소가 자동으로 버려져 "최근 3개만 기억하기"에 편리합니다.

## 7. Rust로 구현하기

Rust에서도 `Vec` 두 개로 제네릭 큐를 만들고, 비어 있으면 `None`을 돌려줍니다. 마지막에 표준 `VecDeque`를 써 봅니다.

```rust
// 파일: two_stack_queue.rs
use std::collections::VecDeque;

struct Queue<T> {
    inbox: Vec<T>,
    outbox: Vec<T>,
}

impl<T: std::fmt::Debug> Queue<T> {
    fn new() -> Self {
        Queue { inbox: Vec::new(), outbox: Vec::new() }
    }

    fn enqueue(&mut self, value: T) {
        self.inbox.push(value);
    }

    fn shift(&mut self) {
        if self.outbox.is_empty() {
            while let Some(value) = self.inbox.pop() {
                self.outbox.push(value);
            }
        }
    }

    fn dequeue(&mut self) -> Option<T> {
        self.shift();
        self.outbox.pop()
    }

    fn peek(&mut self) -> Option<&T> {
        self.shift();
        self.outbox.last()
    }

    fn len(&self) -> usize {
        self.inbox.len() + self.outbox.len()
    }

    fn debug(&self, label: &str) {
        println!("{:<12} inbox={:?} outbox={:?}", label, self.inbox, self.outbox);
    }
}

fn main() {
    let mut q: Queue<i32> = Queue::new();
    for value in [1, 2, 3] {
        q.enqueue(value);
    }
    q.debug("enqueue 1~3");

    println!("dequeue -> {:?}", q.dequeue());
    q.debug("after");

    q.enqueue(4);
    q.debug("enqueue 4");
    println!("peek    -> {:?}", q.peek());

    let mut drained = Vec::new();
    while let Some(value) = q.dequeue() {
        drained.push(value);
    }
    println!("dequeue -> {:?}", drained);
    println!("len     -> {}", q.len());
    println!("빈 큐   -> {:?}", q.dequeue());

    // 표준 라이브러리 VecDeque
    let mut line: VecDeque<&str> = VecDeque::from(["민수", "지아"]);
    line.push_back("하준");
    let first = line.pop_front();
    println!("VecDeque -> {:?} {:?} front={:?}", first, line, line.front());
}
```

실행 결과:

```text
enqueue 1~3  inbox=[1, 2, 3] outbox=[]
dequeue -> Some(1)
after        inbox=[] outbox=[3, 2]
enqueue 4    inbox=[4] outbox=[3, 2]
peek    -> Some(2)
dequeue -> [2, 3, 4]
len     -> 0
빈 큐   -> None
VecDeque -> Some("민수") ["지아", "하준"] front=Some("지아")
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `impl<T: std::fmt::Debug> Queue<T>`        | `T: Debug`는 **트레이트 경계(trait bound)** 입니다. `debug` 메서드가 `{:?}`로 원소를 출력하므로 "T는 출력할 수 있는 타입이어야 한다"고 약속합니다. 트레이트는 Day 54에서 자세히 배웁니다. |
| `while let Some(value) = self.inbox.pop()` | inbox가 빌 때까지 꺼내서 outbox로 옮깁니다. `pop()`이 소유권을 넘겨주므로 값이 복사되지 않고 **이동**합니다.                                                                              |
| `fn peek(&mut self) -> Option<&T>`         | 보기만 하는데도 `&mut self`인 이유는 **옮겨 담기(shift)가 큐 내부를 바꾸기** 때문입니다. 겉으로 보이는 원소 순서는 그대로지만 저장 위치가 달라집니다.                                     |
| `self.outbox.last()`                       | outbox의 top이 큐의 맨 앞입니다. 빌려주기만 하므로 원소는 남아 있습니다.                                                                                                                  |
| `VecDeque::from(["민수", "지아"])`         | 배열로부터 VecDeque를 만듭니다. `push_back`으로 넣고 `pop_front`로 꺼냅니다. `front()`는 맨 앞을 빌려줍니다.                                                                              |

> **참고**: `peek`가 `&mut self`를 요구하는 것은 조금 어색합니다. 표준 `VecDeque`는 원형 버퍼로 구현되어 있어 `front(&self)`처럼 공유 빌림만으로 맨 앞을 볼 수 있습니다. 이런 차이가 직접 구현과 표준 라이브러리의 설계 차이입니다.

## 8. 실행 추적

Python과 Rust 두 스택 큐의 내부를 따라가 봅니다. 스택은 오른쪽이 top입니다.

| 단계 | 연산          | inbox       | outbox   | 반환 | 옮겨 담기? |
| ---: | ------------- | ----------- | -------- | ---- | ---------- |
|    1 | enqueue 1,2,3 | `[1, 2, 3]` | `[]`     |      |            |
|    2 | dequeue       | `[]`        | `[3, 2]` | 1    | 예 (3개)   |
|    3 | enqueue 4     | `[4]`       | `[3, 2]` |      |            |
|    4 | peek          | `[4]`       | `[3, 2]` | 2    | 아니요     |
|    5 | dequeue       | `[4]`       | `[3]`    | 2    | 아니요     |
|    6 | dequeue       | `[4]`       | `[]`     | 3    | 아니요     |
|    7 | dequeue       | `[]`        | `[]`     | 4    | 예 (1개)   |

옮겨 담기가 일어난 원소를 세어 보면 1, 2, 3(2단계)과 4(7단계)로 **각 원소가 딱 한 번씩** 옮겨졌습니다. 이것이 상각 O(1)의 근거입니다.

## 9. 다른 예제로 다시 이해하기

**요세푸스 문제**는 큐 연습의 고전입니다. n명이 원을 이루어 앉아 있고, k번째 사람마다 원에서 빠집니다. 마지막까지 남는 사람은 누구일까요? 원을 큐로 표현하면 쉽습니다. 맨 앞 사람을 꺼내 **맨 뒤에 다시 넣는 일**을 k-1번 반복하면 원을 한 칸씩 도는 것과 같습니다. 그다음 맨 앞 사람을 꺼내면 k번째 사람이 빠집니다. 7명, k=3이면 빠지는 순서는 3, 6, 2, 7, 5, 1이고 4번이 마지막에 남습니다.

```python
# 파일: josephus.py
from collections import deque


def josephus(n, k):
    circle = deque(range(1, n + 1))
    removed = []
    while len(circle) > 1:
        for _ in range(k - 1):
            circle.append(circle.popleft())   # 앞사람을 뒤로 보낸다
        removed.append(circle.popleft())      # k번째 사람이 빠진다
    return removed, circle[0]


order, survivor = josephus(7, 3)
print("빠지는 순서:", order)
print("살아남는 사람:", survivor)
```

실행 결과:

```text
빠지는 순서: [3, 6, 2, 7, 5, 1]
살아남는 사람: 4
```

같은 알고리즘을 Rust의 `VecDeque`로 옮기면 다음과 같습니다. 구조가 거의 같다는 점을 확인하세요.

```rust
// 파일: josephus.rs
use std::collections::VecDeque;

fn josephus(n: u32, k: u32) -> (Vec<u32>, u32) {
    let mut circle: VecDeque<u32> = (1..=n).collect();
    let mut removed = Vec::new();
    while circle.len() > 1 {
        for _ in 0..k - 1 {
            let person = circle.pop_front().unwrap();
            circle.push_back(person);
        }
        removed.push(circle.pop_front().unwrap());
    }
    (removed, circle[0])
}

fn main() {
    let (order, survivor) = josephus(7, 3);
    println!("빠지는 순서: {:?}", order);
    println!("살아남는 사람: {}", survivor);
}
```

실행 결과:

```text
빠지는 순서: [3, 6, 2, 7, 5, 1]
살아남는 사람: 4
```

여기서 `unwrap()`을 쓴 것은 `circle.len() > 1`인 동안만 반복하므로 큐가 비어 있을 수 없기 때문입니다. **비어 있을 수 없다는 근거가 있을 때만** `unwrap()`을 쓰세요. `(1..=n).collect()`는 1부터 n까지의 수로 VecDeque를 채웁니다.

## 10. 시간·공간 복잡도

| 구현                   | enqueue   | dequeue   | 문제점                          |
| ---------------------- | --------- | --------- | ------------------------------- |
| Python list + `pop(0)` | 평균 O(1) | **O(n)**  | 매번 나머지 원소를 옮긴다       |
| C 선형 큐(front·rear)  | O(1)      | O(1)      | 앞쪽 빈칸을 재사용하지 못한다   |
| 스택 두 개             | O(1)      | 상각 O(1) | 가끔 한 번에 많이 옮긴다        |
| 원형 큐 (Day 60)       | O(1)      | O(1)      | 고정 용량(늘리려면 재할당 필요) |
| `deque` / `VecDeque`   | O(1)      | O(1)      | 실무 표준                       |

공간은 모든 구현이 O(n)입니다. C 선형 큐는 한 번 지나간 앞칸을 버리므로 실제로는 **넣은 총 횟수**만큼의 공간이 필요합니다.

## 11. 세 언어 비교

| 관점       | C (선형 배열 큐)       | Python (두 스택 큐)   | Rust (두 스택 큐)            |
| ---------- | ---------------------- | --------------------- | ---------------------------- |
| 내부 저장  | 배열 하나 + front·rear | list 두 개            | `Vec<T>` 두 개               |
| 빈 큐 판단 | `front == rear`        | 두 list 모두 비었는지 | `outbox.pop()`이 `None`      |
| 빈 큐 처리 | `bool` 반환            | `IndexError` 예외     | `Option<T>`                  |
| 가득 참    | `rear == CAPACITY`     | 없음                  | 없음                         |
| 표준 큐    | 없음                   | `collections.deque`   | `std::collections::VecDeque` |
| 원소 타입  | `int` 하나             | 아무거나              | 제네릭 `T`                   |

## 12. 자주 하는 실수

### 실수 1: 빈 큐 조건을 `front == 0`으로 쓴다

front는 dequeue할 때마다 커지므로 0이 아니어도 비어 있을 수 있습니다. C 프로그램의 마지막 줄은 front=4, rear=4로 비어 있습니다. 빈 큐는 **front와 rear가 같을 때**입니다.

### 실수 2: 큐인데 뒤에서 꺼낸다

```c
*out = q->items[--q->rear];   // 가장 최근 값을 꺼낸다 → 스택!
```

넣는 쪽과 빼는 쪽이 같으면 스택입니다. 큐는 반드시 **넣는 쪽의 반대편**에서 꺼냅니다. 실습의 디버그 문제가 이 실수를 다룹니다.

### 실수 3: 두 스택 큐에서 매번 옮겨 담는다

outbox에 값이 남아 있는데 inbox를 또 옮기면, 나중에 들어온 값이 outbox의 top에 올라가 **먼저 들어온 값보다 먼저** 나갑니다. 다음 프로그램은 조건 없이 매번 옮기는 잘못된 큐입니다.

```python
# 파일: wrong_shift.py
inbox, outbox = [], []
for v in [1, 2]:
    inbox.append(v)
while inbox:                      # 첫 dequeue: 옮겨 담기
    outbox.append(inbox.pop())
print(outbox.pop())               # 1 (정상)
inbox.append(3)
while inbox:                      # outbox에 2가 있는데 또 옮김!
    outbox.append(inbox.pop())
print(outbox.pop())               # 2가 나와야 하는데...
```

실행 결과:

```text
1
3
```

2보다 늦게 들어온 3이 먼저 나왔습니다. 옮겨 담기는 **outbox가 비었을 때만** 해야 합니다.

### 실수 4: Python에서 `list.pop(0)`으로 큰 큐를 다룬다

결과는 맞지만 원소가 많아지면 급격히 느려집니다. 원소 10만 개를 모두 꺼내면 약 50억 번의 이동이 일어납니다. 큐가 필요하면 `collections.deque`를 쓰세요.

### 실수 5: Rust에서 빈 큐 가능성을 무시하고 `unwrap()`한다

```rust
// 파일: empty_unwrap.rs (실행 오류: panicked)
use std::collections::VecDeque;

fn main() {
    let mut line: VecDeque<i32> = VecDeque::new();
    line.push_back(1);
    line.pop_front();
    let next = line.pop_front().unwrap();   // 이미 비어 있다
    println!("{next}");
}
```

이 프로그램은 컴파일은 되지만 실행하면 다음 메시지와 함께 멈춥니다.

```text
thread 'main' panicked at ...: called `Option::unwrap()` on a `None` value
```

요세푸스 예제처럼 비어 있을 수 없다는 근거가 없다면 `while let`이나 `match`로 `None`을 처리하세요.

## 13. Q&A

**Q. 스택 두 개로 큐를 만드는 방법은 실제로도 쓰이나요?**

A. 네. 원소를 한쪽 끝에서만 다룰 수 있는 저장소(예: 함수형 언어의 불변 리스트)에서 큐가 필요할 때 자주 씁니다. 코딩 테스트와 면접에서도 단골 문제입니다. 무엇보다 "순서를 두 번 뒤집으면 원래 순서가 된다"는 아이디어를 익히기에 좋습니다.

**Q. C에서 크기 제한 없는 큐를 만들려면 어떻게 하나요?**

A. 두 가지 방법이 있습니다. 원형 큐의 배열을 `malloc`으로 잡고 가득 차면 `realloc`으로 키우는 방법(Day 60, Day 40), 그리고 노드를 하나씩 `malloc`해서 **연결 리스트**로 잇는 방법(Day 61)입니다. 연결 리스트 큐는 front 노드와 rear 노드의 주소를 기억합니다.

**Q. 우선순위가 있는 대기열(예: 응급실)은 큐로 만들 수 있나요?**

A. 도착 순서가 아니라 **중요도 순서**로 꺼내야 하므로 보통의 큐로는 안 됩니다. 이런 자료구조를 **우선순위 큐**라고 하며 Day 66에서 힙으로 구현합니다.

**Q. deque를 스택으로 써도 되나요?**

A. 됩니다. 한쪽 끝만 쓰면 스택, 양쪽 끝을 쓰면 큐입니다. 다만 스택만 필요하면 list(Python)나 Vec(Rust)이 더 단순하고 약간 더 빠릅니다.

## 14. 핵심 요약

- 큐는 **FIFO**, 먼저 들어온 값을 먼저 꺼냅니다. 뒤(rear)에서 넣고 앞(front)에서 뺍니다.
- list의 맨 앞에서 빼면 나머지를 모두 옮기므로 O(n)입니다.
- front·rear 인덱스를 움직이면 옮기지 않아도 되지만, 선형 큐는 **앞쪽 빈칸을 재사용하지 못합니다.** → Day 60 원형 큐
- **스택 두 개**로 큐를 만들 수 있습니다. outbox가 비었을 때만 inbox를 뒤집어 옮기며, dequeue는 상각 O(1)입니다.
- 실무에서는 Python `collections.deque`, Rust `VecDeque`를 씁니다. C는 직접 구현합니다.
- 빈 큐는 C에서 `bool`, Python에서 예외, Rust에서 `None`으로 처리합니다.

## 15. 도전 문제

1. **(C)** 선형 큐의 dequeue에서 큐가 비게 되면 `front = rear = 0`으로 되돌리도록 고치고, 본문 프로그램의 마지막에 다시 enqueue가 되는지 확인해 보세요. 이 방법으로도 해결되지 않는 경우를 찾아보세요.
2. **(Python)** `collections.deque`로 요세푸스 문제를 풀되, `for` 반복 대신 `circle.rotate(-(k - 1))`를 써 보세요. rotate의 방향을 직접 실험해 확인하세요.
3. **(Rust)** 두 스택 큐의 `peek`가 `&self`만으로 동작하도록 바꿔 보세요. 힌트: outbox가 비어 있으면 inbox의 **첫 원소**(`self.inbox.first()`)가 맨 앞입니다.
4. **(세 언어)** 프린터 대기열을 흉내 내 보세요. 문서 이름과 쪽수를 큐에 넣고, 1초에 1쪽씩 인쇄한다고 할 때 각 문서가 끝나는 시각을 출력합니다.
