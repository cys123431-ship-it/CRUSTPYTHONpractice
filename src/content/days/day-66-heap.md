---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-66-heap
courseId: crp-92
phaseId: phase-06
dayNumber: 66
date: "2026-12-05"
title: 힙과 우선순위 큐 — 가장 급한 것을 먼저 꺼내기
summary: 부모가 자식보다 항상 작은 최소 힙을 배열 하나로 저장하는 방법(부모 (i-1)/2, 자식 2i+1·2i+2)을 익히고, 위로 올리기(sift up)와 아래로 내리기(sift down)로 push·pop을 C, Python, Rust로 직접 구현합니다. heapq, BinaryHeap 같은 표준 우선순위 큐와 힙 정렬, 힙으로 만드는 O(n) 방법까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-65-bst]
learningObjectives:
  - 우선순위 큐가 필요한 상황을 설명하고 일반 큐·정렬된 배열과 비용을 비교한다.
  - 힙의 두 규칙(완전 이진 트리 모양, 부모 ≤ 자식)을 설명한다.
  - 배열 인덱스로 부모와 자식을 계산하고 트리 그림과 배열을 서로 바꿔 그린다.
  - push의 sift up과 pop의 sift down을 손으로 추적하고 세 언어로 구현한다.
  - Python heapq와 Rust BinaryHeap(Reverse 포함)으로 우선순위 큐를 쓰고, 힙 정렬을 구현한다.
concepts:
  [
    heap,
    priority queue,
    complete binary tree,
    sift up,
    sift down,
    heapify,
    heap sort,
    heapq,
    BinaryHeap,
  ]
runnerMode: python
playgroundSource: |
  # 파일: heap.py — push하는 값을 바꿔 가며 배열이 어떻게 변하는지 보세요.
  heap = []


  def push(value):
      heap.append(value)
      i = len(heap) - 1
      while i > 0:
          parent = (i - 1) // 2
          if heap[parent] <= heap[i]:
              break
          heap[parent], heap[i] = heap[i], heap[parent]
          i = parent
      print(f"push {value}: {heap}")


  for v in [5, 3, 8, 1, 9, 2]:
      push(v)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day66-predict-py
    title: heapq로 꺼내는 순서 예측하기
    kind: predict
    objective: 넣은 순서와 상관없이 가장 작은 값부터 나온다는 것을 확인한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      import heapq

      h = []
      for v in [7, 2, 9, 4]:
          heapq.heappush(h, v)
      first = heapq.heappop(h)
      heapq.heappush(h, 1)
      second = heapq.heappop(h)
      print(first, second, h[0])
    answer: "2 1 4"
    hint: "heappop은 항상 현재 가장 작은 값을 꺼냅니다. h[0]은 꺼내지 않고 가장 작은 값을 봅니다."
    explanation: "처음 가장 작은 값은 2입니다. 1을 넣으면 1이 가장 작으므로 두 번째로 1이 나옵니다. 남은 7, 9, 4 중 가장 작은 4가 h[0]입니다."
    commonMistakes:
      - "큐처럼 먼저 넣은 7이 먼저 나온다고 생각함"
      - "h[0]을 배열의 첫 번째로 넣은 값이라고 생각함"
    language: python
    verification: run
  - id: ex-day66-predict-c
    title: 배열 인덱스로 부모와 자식 찾기
    kind: predict
    objective: 완전 이진 트리의 배열 표현에서 인덱스 공식을 적용한다.
    prompt: 출력될 네 숫자를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int heap[] = {1, 3, 2, 5, 9, 8, 4};
          int i = 4;
          int parent = (i - 1) / 2;
          int left = 2 * 1 + 1, right = 2 * 1 + 2;
          printf("%d %d %d %d\n", heap[parent], heap[left], heap[right], heap[(6 - 1) / 2]);
          return 0;
      }
    answer: "3 5 9 2"
    hint: "인덱스 4의 부모는 (4-1)/2 = 1입니다. 인덱스 1의 자식은 3과 4입니다. C의 정수 나눗셈은 소수점을 버립니다."
    explanation: "heap[1] = 3이 9(인덱스 4)의 부모입니다. 인덱스 1의 두 자식은 heap[3] = 5, heap[4] = 9입니다. 인덱스 6의 부모는 (6-1)/2 = 2이므로 heap[2] = 2입니다. 포인터 없이 계산만으로 트리를 오갈 수 있습니다."
    commonMistakes:
      - "부모를 i / 2로 계산해 인덱스가 하나 어긋남(0부터 시작하는 배열에서는 (i-1)/2)"
      - "자식을 2i, 2i+1로 계산함(1부터 시작하는 배열의 공식)"
    language: c
    verification: run
  - id: ex-day66-fill
    title: Rust sift_up의 부모 인덱스 채우기
    kind: fill
    objective: 새 원소를 부모와 비교하며 올리는 반복을 완성한다.
    prompt: "sift_up의 빈칸에 인덱스 i의 부모 인덱스를 계산하는 식을 채우세요."
    starter: |-
      fn sift_up(heap: &mut Vec<i32>, mut i: usize) {
          while i > 0 {
              let parent = _____;
              if heap[parent] <= heap[i] {
                  break;
              }
              heap.swap(parent, i);
              i = parent;
          }
      }

      fn main() {
          let mut heap = Vec::new();
          for v in [6, 4, 7, 1] {
              heap.push(v);
              let last = heap.len() - 1;
              sift_up(&mut heap, last);
          }
          println!("{:?}", heap);
      }
    answer: |-
      fn sift_up(heap: &mut Vec<i32>, mut i: usize) {
          while i > 0 {
              let parent = (i - 1) / 2;
              if heap[parent] <= heap[i] {
                  break;
              }
              heap.swap(parent, i);
              i = parent;
          }
      }

      fn main() {
          let mut heap = Vec::new();
          for v in [6, 4, 7, 1] {
              heap.push(v);
              let last = heap.len() - 1;
              sift_up(&mut heap, last);
          }
          println!("{:?}", heap);
      }
    output: "[1, 4, 7, 6]"
    hint: "while 조건이 i > 0이므로 i - 1은 음수가 되지 않습니다. usize 나눗셈은 소수점을 버립니다."
    explanation: "6, 4를 넣으면 4가 올라가 [4, 6], 7은 그대로 [4, 6, 7], 1은 인덱스 3 → 부모 1(6)과 바꾸고 → 부모 0(4)과 바꿔 [1, 4, 7, 6]이 됩니다. Vec::swap은 두 인덱스의 값을 바꿉니다."
    commonMistakes:
      - "i / 2로 써서 인덱스 2의 부모를 1로 계산함"
      - "i를 parent로 갱신하지 않아 한 번만 올라감"
    language: rust
    verification: run
  - id: ex-day66-modify
    title: Python으로 가장 큰 k개 고르기
    kind: modify
    objective: 크기 k인 최소 힙으로 스트림에서 가장 큰 값 k개를 유지한다.
    prompt: "top_k(values, k)가 가장 큰 k개를 큰 순서로 돌려주도록 고치세요. 크기가 k인 최소 힙을 유지하면서, 힙의 최솟값보다 큰 값이 오면 교체하세요."
    starter: |-
      import heapq


      def top_k(values, k):
          return sorted(values, reverse=True)[:k]


      scores = [72, 95, 64, 88, 91, 55, 79, 99]
      print(top_k(scores, 3))
    answer: |-
      import heapq


      def top_k(values, k):
          heap = []
          for v in values:
              if len(heap) < k:
                  heapq.heappush(heap, v)
              elif v > heap[0]:
                  heapq.heapreplace(heap, v)
          return sorted(heap, reverse=True)


      scores = [72, 95, 64, 88, 91, 55, 79, 99]
      print(top_k(scores, 3), top_k(scores, 1))
    output: "[99, 95, 91] [99]"
    hint: "힙에는 '지금까지 본 값 중 가장 큰 k개'가 들어 있고, heap[0]은 그중 가장 작은 값(k번째로 큰 값)입니다. heapreplace는 pop과 push를 한 번에 합니다."
    explanation: "모두 정렬하면 O(n log n)이지만, 크기 k인 힙을 쓰면 O(n log k)이고 메모리도 k개만 씁니다. 수백만 개의 점수 중 상위 10개를 고를 때 특히 유리합니다. 표준 함수 heapq.nlargest(3, scores)도 같은 일을 합니다."
    commonMistakes:
      - "최대 힙을 써야 한다고 생각해 모든 값을 넣음"
      - "v >= heap[0]이 아니라 v < heap[0]일 때 교체해 가장 작은 k개를 모음"
    language: python
    verification: run
  - id: ex-day66-debug
    title: C sift_down의 자식 선택 버그 고치기
    kind: debug
    objective: 두 자식 중 더 작은 쪽과 바꿔야 힙 규칙이 유지된다는 것을 이해한다.
    prompt: "sift_down이 항상 왼쪽 자식하고만 비교합니다. pop 결과가 1 2 3 4 5가 되도록 두 자식 중 더 작은 쪽을 고르게 고치세요."
    starter: |-
      #include <stdio.h>

      int heap[16] = {1, 4, 2, 5, 6, 3};
      int size = 6;

      void sift_down(int i) {
          while (2 * i + 1 < size) {
              int child = 2 * i + 1;
              if (heap[i] <= heap[child]) break;
              int t = heap[i]; heap[i] = heap[child]; heap[child] = t;
              i = child;
          }
      }

      int pop(void) {
          int top = heap[0];
          heap[0] = heap[--size];
          sift_down(0);
          return top;
      }

      int main(void) {
          for (int k = 0; k < 5; k++) printf("%d ", pop());
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int heap[16] = {1, 4, 2, 5, 6, 3};
      int size = 6;

      void sift_down(int i) {
          while (2 * i + 1 < size) {
              int child = 2 * i + 1;
              if (child + 1 < size && heap[child + 1] < heap[child]) child++;
              if (heap[i] <= heap[child]) break;
              int t = heap[i]; heap[i] = heap[child]; heap[child] = t;
              i = child;
          }
      }

      int pop(void) {
          int top = heap[0];
          heap[0] = heap[--size];
          sift_down(0);
          return top;
      }

      int main(void) {
          for (int k = 0; k < 5; k++) printf("%d ", pop());
          printf("\n");
          return 0;
      }
    output: "1 2 3 4 5"
    starterOutput: "1 3 4 5 2"
    hint: "오른쪽 자식이 있고(child + 1 < size) 왼쪽보다 작다면 오른쪽 자식과 비교해야 합니다."
    explanation: "원래 코드는 첫 pop 뒤 루트의 3을 왼쪽 자식 4와만 비교해 그대로 두므로, 오른쪽의 2가 루트보다 작은데도 아래에 남습니다. 그래서 두 번째 pop이 2 대신 3을 꺼내고, 오른쪽 가지의 2는 왼쪽 가지만 오가는 비교에 한 번도 걸리지 않아 맨 마지막에야 나옵니다. 출력은 '1 3 4 5 2'입니다. 더 작은 자식과 바꿔야 새 부모가 두 자식보다 모두 작아집니다."
    commonMistakes:
      - "오른쪽 자식이 있는지(child + 1 < size) 확인하지 않고 heap[child + 1]을 읽음"
      - "더 큰 자식과 바꿔서 최대 힙과 최소 힙 규칙을 섞음"
    language: c
    verification: run
  - id: ex-day66-independent
    title: Rust BinaryHeap으로 작업 스케줄러 만들기
    kind: independent
    objective: 우선순위와 도착 순서를 튜플로 묶어 동점을 처리한다.
    prompt: '작업 (우선순위, 이름)을 BinaryHeap에 넣고 우선순위가 높은(숫자가 큰) 작업부터 처리하세요. 우선순위가 같으면 먼저 들어온 작업이 먼저입니다. 입력 [(2,"메일"), (5,"장애"), (2,"회의"), (5,"배포"), (1,"청소")]의 처리 순서 장애 배포 메일 회의 청소를 출력하세요.'
    starter: |-
      use std::collections::BinaryHeap;

      fn main() {
          let jobs = [(2, "메일"), (5, "장애"), (2, "회의"), (5, "배포"), (1, "청소")];
          let mut heap = BinaryHeap::new();
          // (우선순위, 도착 순서를 반대로 한 값, 이름)을 넣어 보세요.
          heap.push(jobs[0]);
          println!("{:?}", heap.pop());
      }
    answer: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn main() {
          let jobs = [(2, "메일"), (5, "장애"), (2, "회의"), (5, "배포"), (1, "청소")];
          let mut heap = BinaryHeap::new();
          for (order, &(priority, name)) in jobs.iter().enumerate() {
              heap.push((priority, Reverse(order), name));
          }
          let mut done = Vec::new();
          while let Some((_, _, name)) = heap.pop() {
              done.push(name);
          }
          println!("{}", done.join(" "));
      }
    output: "장애 배포 메일 회의 청소"
    hint: "BinaryHeap은 가장 큰 값을 먼저 꺼내는 최대 힙이고, 튜플은 앞 원소부터 비교합니다. 도착 순서는 작을수록 먼저여야 하므로 Reverse로 감쌉니다."
    explanation: "(5, Reverse(1), 장애)와 (5, Reverse(3), 배포)는 우선순위가 같아 두 번째 원소를 비교하는데, Reverse(1)이 Reverse(3)보다 '크므로' 장애가 먼저 나옵니다. 이름을 비교 기준으로 쓰면 가나다순이 되어 도착 순서가 깨집니다."
    commonMistakes:
      - "(priority, name)만 넣어 동점일 때 이름의 가나다 역순으로 처리됨"
      - "Reverse 없이 order를 넣어 나중에 온 작업이 먼저 처리됨"
    language: rust
    verification: run
quiz:
  - id: quiz-day66-01
    question: 최소 힙의 규칙으로 옳은 것은?
    choices:
      - 왼쪽 자식 < 부모 < 오른쪽 자식
      - 모든 부모는 자기 자식보다 작거나 같다
      - 배열이 오름차순으로 정렬되어 있다
      - 모든 잎은 같은 값을 가진다
    answerIndex: 1
    explanation: 힙은 부모와 자식 사이의 관계만 정합니다. 형제끼리는 순서가 없으므로 배열 전체가 정렬되어 있지는 않습니다. 왼쪽 < 부모 < 오른쪽은 BST의 규칙입니다.
  - id: quiz-day66-02
    question: 0부터 시작하는 배열 힙에서 인덱스 5의 부모 인덱스는?
    choices: ["1", "2", "3", "10"]
    answerIndex: 1
    explanation: (5 - 1) / 2 = 2입니다. 인덱스 2의 자식은 2×2+1 = 5와 2×2+2 = 6입니다.
  - id: quiz-day66-03
    question: 최소 힙에서 pop할 때 루트 자리에 먼저 옮겨 놓는 값은?
    choices:
      - 두 번째로 작은 값
      - 배열의 마지막 원소
      - 왼쪽 자식
      - "0"
    answerIndex: 1
    explanation: 마지막 원소를 루트로 옮기면 완전 이진 트리 모양이 유지됩니다. 그 대신 부모 ≤ 자식 규칙이 깨질 수 있으므로 sift down으로 제자리를 찾아 내려보냅니다.
  - id: quiz-day66-04
    question: 원소가 n개인 힙에서 push와 pop의 시간 복잡도는?
    choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"]
    answerIndex: 1
    explanation: 완전 이진 트리의 높이는 약 log₂ n입니다. sift up과 sift down은 한 경로를 따라 최대 높이만큼 움직입니다. 가장 작은 값을 보는 peek은 O(1)입니다.
  - id: quiz-day66-05
    question: Rust의 BinaryHeap으로 가장 작은 값부터 꺼내려면 어떻게 하나요?
    choices:
      - BinaryHeap::new_min()을 쓴다
      - 값을 std::cmp::Reverse로 감싸서 넣는다
      - pop 대신 pop_min을 쓴다
      - 불가능하다
    answerIndex: 1
    explanation: BinaryHeap은 최대 힙입니다. Reverse는 비교 결과를 뒤집으므로 Reverse(1)이 Reverse(5)보다 '크게' 취급되어 가장 작은 값이 먼저 나옵니다. Python은 반대로 heapq가 최소 힙이라 최대 힙이 필요하면 값에 -를 붙입니다.
---

## 1. 오늘 배울 내용

큐는 **먼저 온 것**을 먼저 꺼냈습니다. 하지만 현실의 대기열은 순서만으로 정해지지 않습니다. 응급실은 도착 순서보다 **위급한 환자**를 먼저 치료합니다. 이렇게 **우선순위가 가장 높은 것**을 먼저 꺼내는 자료구조를 **우선순위 큐(priority queue)** 라고 하며, 이것을 효율적으로 만드는 방법이 오늘 배우는 **힙(heap)** 입니다.

1. 우선순위 큐가 필요한 상황과, 배열이나 정렬로 만들 때의 문제를 봅니다.
2. 힙의 두 규칙과 **배열 하나로 트리를 저장하는** 방법을 익힙니다.
3. **sift up**(위로 올리기)으로 push를, **sift down**(아래로 내리기)으로 pop을 구현합니다.
4. **C, Python, Rust** 로 최소 힙을 직접 만들고, 표준 라이브러리(`heapq`, `BinaryHeap`)와 비교합니다.
5. 배열을 한 번에 힙으로 만드는 **heapify**와, 힙을 이용한 **힙 정렬**을 배웁니다.

## 2. 왜 힙이 필요한가

응급실 대기 명단을 관리한다고 합시다. 환자가 수시로 들어오고(넣기), 의사가 비면 가장 위급한 환자를 부릅니다(꺼내기). 몇 가지 방법을 비교해 봅시다.

| 방법               | 넣기                      | 가장 위급한 환자 꺼내기        |
| ------------------ | ------------------------- | ------------------------------ |
| 정렬하지 않은 배열 | O(1) 끝에 추가            | **O(n)** 모두 훑어서 찾기      |
| 항상 정렬된 배열   | **O(n)** 자리를 찾아 밀기 | O(1) 끝에서 꺼내기             |
| 균형 BST (Day 65)  | O(log n)                  | O(log n)                       |
| **힙**             | **O(log n)**              | **O(log n)**, 보기만 하면 O(1) |

정렬하지 않은 배열은 꺼낼 때 느리고, 정렬된 배열은 넣을 때 느립니다. 힙은 **"가장 작은(큰) 것 하나만 빨리 알면 된다"** 는 점에 집중해서, 전체를 정렬하지 않고도 둘 다 O(log n)에 해냅니다. BST도 가능하지만 힙은 **배열 하나**로 만들 수 있어 훨씬 단순하고 빠릅니다.

힙이 쓰이는 곳은 다양합니다.

- 운영체제가 우선순위가 높은 작업에 CPU를 먼저 주는 **스케줄러**
- 가장 가까운 곳부터 처리하는 **다익스트라 최단 경로** 알고리즘(Day 82)
- 수많은 값 중 **상위 k개** 고르기, 여러 정렬된 목록 **합치기**
- 정렬 알고리즘인 **힙 정렬**

## 3. 그림으로 이해하기

다음은 **최소 힙(min-heap)** 입니다. 가장 작은 값이 루트에 있습니다.

```text
                 1               인덱스:  0   1   2   3   4   5
              /     \            배열:  [ 1 | 3 | 2 | 5 | 9 | 8 ]
            3         2
          /   \      /
         5     9    8
```

힙의 규칙은 두 가지뿐입니다.

1. **모양 규칙**: **완전 이진 트리**입니다. 위층부터 빈틈없이 채우고, 마지막 층은 **왼쪽부터** 채웁니다.
2. **순서 규칙(힙 속성)**: 모든 부모는 자기 자식보다 **작거나 같습니다.** (최대 힙이면 크거나 같습니다.)

순서 규칙은 부모와 자식 사이에만 적용됩니다. 형제인 3과 2는 어느 쪽이 커도 상관없고, 다른 가지의 5와 2도 상관없습니다. 그래서 힙은 **정렬된 상태가 아닙니다.** 다만 루트가 가장 작다는 것만은 확실합니다. 이 "느슨한 정렬" 덕분에 넣고 빼는 비용이 적습니다.

### 배열로 트리를 저장하는 법

완전 이진 트리는 빈틈이 없으므로 **위층부터, 왼쪽부터** 번호를 붙여 배열에 담을 수 있습니다. 포인터가 필요 없습니다. 인덱스 i인 노드에 대해

```text
왼쪽 자식  = 2i + 1
오른쪽 자식 = 2i + 2
부모       = (i - 1) / 2   (정수 나눗셈)
```

그림에서 확인해 보세요. 3(인덱스 1)의 자식은 인덱스 3, 4인 5와 9입니다. 8(인덱스 5)의 부모는 (5-1)/2 = 2인 2입니다.

## 4. 천천히 풀어보기

### 4.1 push: 끝에 넣고 위로 올리기(sift up)

새 값은 모양 규칙을 지키기 위해 **배열의 끝**(마지막 층의 다음 빈자리)에 넣습니다. 그러면 부모보다 작아서 순서 규칙이 깨질 수 있습니다. 그럴 때는 **부모와 자리를 바꾸며 위로 올립니다.** 부모보다 작지 않거나 루트에 도착하면 멈춥니다.

위 힙에 0을 넣어 봅시다.

```text
① 끝(인덱스 6)에 0을 넣는다          ② 부모 2(인덱스 2)보다 작다 → 교환
         1                                    1
       /   \                                /   \
      3     2                              3     0
     / \   / \                            / \   / \
    5   9 8   0                          5   9 8   2

③ 부모 1(인덱스 0)보다 작다 → 교환     ④ 루트에 도착 → 멈춤
         0                               배열: [0, 3, 1, 5, 9, 8, 2]
       /   \
      3     1
     / \   / \
    5   9 8   2
```

새 값은 **한 경로를 따라 위로만** 움직이므로 비교 횟수는 트리 높이(약 log₂ n) 이하입니다.

### 4.2 pop: 루트를 꺼내고, 마지막 원소를 아래로 내리기(sift down)

가장 작은 값은 루트에 있습니다. 루트를 꺼내면 구멍이 생기는데, 모양 규칙을 지키려면 **배열의 마지막 원소**를 루트로 옮기는 것이 가장 간단합니다. 이제 루트가 자식보다 클 수 있으므로 **더 작은 자식과 자리를 바꾸며 아래로 내립니다.** 두 자식보다 작거나 같아지거나 잎에 도착하면 멈춥니다.

처음 힙 `[1, 3, 2, 5, 9, 8]`에서 pop해 봅시다.

```text
① 루트 1을 꺼내고, 마지막 8을 루트로   ② 자식 3과 2 중 더 작은 2와 교환   ③ 자식이 없다 → 멈춤
         8                                   2                           배열: [2, 3, 8, 5, 9]
       /   \                               /   \
      3     2                             3     8
     / \                                 / \
    5   9                               5   9
```

> **주의**: sift down에서는 반드시 **두 자식 중 더 작은 쪽**과 바꿔야 합니다. 더 큰 자식(3)과 바꾸면 새 부모 3이 형제 2보다 커져서 순서 규칙이 또 깨집니다. 실습의 디버그 문제가 이 실수입니다.

### 4.3 heapify: 배열을 한꺼번에 힙으로 만들기

값 n개를 하나씩 push하면 O(n log n)입니다. 더 빠른 방법이 있습니다. 배열을 그대로 두고, **자식이 있는 마지막 노드(인덱스 n/2 - 1)부터 거꾸로 0까지** 각 노드에 sift down을 합니다. 잎은 이미 크기 1짜리 힙이므로 건드릴 필요가 없습니다.

아래쪽 노드는 많지만 내려갈 거리가 짧고, 멀리 내려가는 위쪽 노드는 적기 때문에 전체 비용이 **O(n)** 이 됩니다. Python의 `heapq.heapify`가 이 방법입니다.

### 4.4 최소 힙과 최대 힙

| 종류    | 루트         | 규칙        | 표준 라이브러리                         |
| ------- | ------------ | ----------- | --------------------------------------- |
| 최소 힙 | 가장 작은 값 | 부모 ≤ 자식 | Python `heapq`                          |
| 최대 힙 | 가장 큰 값   | 부모 ≥ 자식 | Rust `BinaryHeap`, C++ `priority_queue` |

두 힙은 비교 방향만 다릅니다. 최소 힙으로 최대 힙을 흉내 내려면 값에 `-`를 붙이고(Python), 최대 힙으로 최소 힙을 흉내 내려면 `Reverse`로 감쌉니다(Rust).

## 5. C로 구현하기

고정 크기 배열로 정수 최소 힙을 만듭니다. push와 pop을 할 때마다 배열 상태를 출력해 4절의 그림과 비교할 수 있게 했습니다.

```c
// 파일: min_heap.c
#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 16

typedef struct {
    int items[CAPACITY];
    int size;
} MinHeap;

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

void sift_up(MinHeap *h, int i) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (h->items[parent] <= h->items[i]) {
            break;                              // 부모가 작거나 같으면 제자리
        }
        swap(&h->items[parent], &h->items[i]);
        i = parent;
    }
}

void sift_down(MinHeap *h, int i) {
    while (2 * i + 1 < h->size) {               // 왼쪽 자식이 있는 동안
        int child = 2 * i + 1;
        if (child + 1 < h->size && h->items[child + 1] < h->items[child]) {
            child++;                            // 오른쪽 자식이 더 작으면 그쪽
        }
        if (h->items[i] <= h->items[child]) {
            break;
        }
        swap(&h->items[i], &h->items[child]);
        i = child;
    }
}

bool push(MinHeap *h, int value) {
    if (h->size == CAPACITY) {
        return false;
    }
    h->items[h->size] = value;                  // ① 끝에 넣고
    sift_up(h, h->size);                        // ② 위로 올린다
    h->size++;
    return true;
}

bool pop(MinHeap *h, int *out) {
    if (h->size == 0) {
        return false;
    }
    *out = h->items[0];                         // ① 루트를 꺼내고
    h->size--;
    h->items[0] = h->items[h->size];            // ② 마지막 원소를 루트로
    sift_down(h, 0);                            // ③ 아래로 내린다
    return true;
}

void heapify(MinHeap *h) {
    for (int i = h->size / 2 - 1; i >= 0; i--) {
        sift_down(h, i);                        // 자식이 있는 마지막 노드부터 거꾸로
    }
}

void print_heap(const MinHeap *h, const char *label) {
    printf("%-9s [", label);
    for (int i = 0; i < h->size; i++) {
        printf(i ? ", %d" : "%d", h->items[i]);
    }
    printf("]\n");
}

int main(void) {
    MinHeap h = { .size = 0 };
    int values[] = {5, 3, 8, 1, 9, 2};
    for (int i = 0; i < 6; i++) {
        push(&h, values[i]);
        char label[16];
        snprintf(label, sizeof label, "push %d", values[i]);
        print_heap(&h, label);
    }

    int v;
    printf("peek -> %d\n", h.items[0]);
    while (pop(&h, &v)) {
        char label[16];
        snprintf(label, sizeof label, "pop %d", v);
        print_heap(&h, label);
    }

    MinHeap g = { .items = {9, 7, 5, 3, 8, 1, 6}, .size = 7 };
    print_heap(&g, "before");
    heapify(&g);
    print_heap(&g, "heapify");
    return 0;
}
```

실행 결과:

```text
push 5    [5]
push 3    [3, 5]
push 8    [3, 5, 8]
push 1    [1, 3, 8, 5]
push 9    [1, 3, 8, 5, 9]
push 2    [1, 3, 2, 5, 9, 8]
peek -> 1
pop 1     [2, 3, 8, 5, 9]
pop 2     [3, 5, 8, 9]
pop 3     [5, 9, 8]
pop 5     [8, 9]
pop 8     [9]
pop 9     []
before    [9, 7, 5, 3, 8, 1, 6]
heapify   [1, 3, 5, 7, 8, 9, 6]
```

### 코드 한 부분씩 읽기

| 코드                                                                | 설명                                                                                                                                          |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `void swap(int *a, int *b)`                                         | 두 변수의 값을 바꾸려면 주소를 받아야 합니다(Day 29의 swap). `swap(&h->items[parent], &h->items[i])`처럼 배열 원소의 주소를 넘깁니다.         |
| `int parent = (i - 1) / 2;`                                         | C의 정수 나눗셈은 소수점을 버리므로 인덱스 1과 2의 부모가 모두 0이 됩니다. while 조건이 `i > 0`이라 i = 0일 때 `(0-1)/2`를 계산하지 않습니다. |
| `while (2 * i + 1 < h->size)`                                       | 왼쪽 자식의 인덱스가 크기보다 작다는 것은 "자식이 적어도 하나 있다"는 뜻입니다. 없으면 잎이므로 멈춥니다.                                     |
| `if (child + 1 < h->size && h->items[child + 1] < h->items[child])` | 오른쪽 자식이 **있고** 더 작으면 그쪽을 고릅니다. `&&`의 단축 평가 덕분에 오른쪽 자식이 없으면 배열 밖을 읽지 않습니다.                       |
| `h->items[h->size] = value; sift_up(h, h->size); h->size++;`        | 새 값을 인덱스 size에 쓰고 그 위치에서 올립니다. sift_up은 부모만 보므로 size를 나중에 늘려도 됩니다.                                         |
| `h->size--; h->items[0] = h->items[h->size];`                       | 크기를 먼저 줄이면 `h->size`가 곧 마지막 원소의 인덱스입니다. 원소가 하나뿐이었다면 자기 자신을 자기 자리에 쓰는 셈이라 문제가 없습니다.      |
| `for (int i = h->size / 2 - 1; i >= 0; i--)`                        | 크기 7이면 인덱스 2, 1, 0 순서로 sift down합니다. 인덱스 3~6은 잎입니다.                                                                      |
| `printf(i ? ", %d" : "%d", ...)`                                    | 첫 원소 앞에는 쉼표를 찍지 않으려고 형식 문자열을 조건 연산자로 골랐습니다.                                                                   |

pop한 값을 차례로 보면 1, 2, 3, 5, 8, 9로 **오름차순**입니다. 힙에 모두 넣었다가 모두 꺼내면 정렬이 된다는 뜻이며, 이것이 9절의 힙 정렬입니다. 마지막 두 줄을 보면 heapify 결과 `[1, 3, 5, 7, 8, 9, 6]`도 정렬된 배열은 아니지만 힙 규칙은 지킵니다(부모 1의 자식 3과 5, 부모 3의 자식 7과 8, 부모 5의 자식 9와 6).

## 6. Python으로 구현하기

Python 버전은 `MinHeap` 클래스를 직접 만들고, 같은 작업을 표준 모듈 `heapq`로도 해서 결과를 비교합니다.

```python
# 파일: min_heap.py
import heapq


class MinHeap:
    def __init__(self, items=None):
        self._a = list(items) if items else []
        for i in range(len(self._a) // 2 - 1, -1, -1):   # heapify
            self._sift_down(i)

    def push(self, value):
        self._a.append(value)
        self._sift_up(len(self._a) - 1)

    def pop(self):
        if not self._a:
            raise IndexError("pop: 힙이 비어 있습니다")
        a = self._a
        a[0], a[-1] = a[-1], a[0]        # 루트와 마지막을 바꾸고
        smallest = a.pop()               # 마지막(원래 루트)을 꺼낸다
        if a:
            self._sift_down(0)
        return smallest

    def peek(self):
        if not self._a:
            raise IndexError("peek: 힙이 비어 있습니다")
        return self._a[0]

    def _sift_up(self, i):
        a = self._a
        while i > 0:
            parent = (i - 1) // 2
            if a[parent] <= a[i]:
                break
            a[parent], a[i] = a[i], a[parent]
            i = parent

    def _sift_down(self, i):
        a, n = self._a, len(self._a)
        while 2 * i + 1 < n:
            child = 2 * i + 1
            if child + 1 < n and a[child + 1] < a[child]:
                child += 1
            if a[i] <= a[child]:
                break
            a[i], a[child] = a[child], a[i]
            i = child

    def __len__(self):
        return len(self._a)

    def __repr__(self):
        return f"MinHeap({self._a})"


h = MinHeap()
for v in [5, 3, 8, 1, 9, 2]:
    h.push(v)
print("직접 구현:", h, "peek", h.peek())
print("꺼낸 순서:", [h.pop() for _ in range(len(h))])

std = []
for v in [5, 3, 8, 1, 9, 2]:
    heapq.heappush(std, v)
print("heapq:   ", list(std), "꺼낸 순서:", [heapq.heappop(std) for _ in range(6)])

print("heapify: ", MinHeap([9, 7, 5, 3, 8, 1, 6]))
data = [9, 7, 5, 3, 8, 1, 6]
heapq.heapify(data)
print("heapq.heapify:", data)

# 최대 힙이 필요하면 부호를 뒤집는다
scores = [72, 95, 64, 88]
max_heap = [-s for s in scores]
heapq.heapify(max_heap)
print("가장 높은 점수:", -heapq.heappop(max_heap))
print("상위 2개:", heapq.nlargest(2, scores), "하위 2개:", heapq.nsmallest(2, scores))
```

실행 결과:

```text
직접 구현: MinHeap([1, 3, 2, 5, 9, 8]) peek 1
꺼낸 순서: [1, 2, 3, 5, 8, 9]
heapq:    [1, 3, 2, 5, 9, 8] 꺼낸 순서: [1, 2, 3, 5, 8, 9]
heapify:  MinHeap([1, 3, 5, 7, 8, 9, 6])
heapq.heapify: [1, 3, 5, 7, 8, 9, 6]
가장 높은 점수: 95
상위 2개: [95, 88] 하위 2개: [64, 72]
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `for i in range(len(self._a) // 2 - 1, -1, -1):` | `range(시작, 끝, -1)`은 거꾸로 셉니다. 끝 값 -1은 포함되지 않으므로 0까지 돕니다. 생성자에 값을 주면 바로 heapify합니다.                                                                                                                          |
| `a[0], a[-1] = a[-1], a[0]; smallest = a.pop()`  | C처럼 "루트를 꺼내고 마지막을 루트로 옮기는" 대신, 둘을 **바꾼 뒤 끝을 pop**했습니다. list의 끝에서 빼는 것은 O(1)이고, 원소가 하나일 때도 따로 처리할 필요가 없습니다.                                                                           |
| `parent = (i - 1) // 2`                          | Python의 `//`는 정수 나눗셈입니다. i > 0이므로 음수 나눗셈 문제가 없습니다.                                                                                                                                                                       |
| `a, n = self._a, len(self._a)`                   | 자주 쓰는 속성을 지역 변수에 담았습니다. 같은 list를 가리키므로 `a`를 바꾸면 `self._a`도 바뀝니다(Day 31의 별칭).                                                                                                                                 |
| `heapq.heappush(std, v)`                         | `heapq`는 클래스가 아니라 **보통 list를 힙처럼 다루는 함수 모음**입니다. 결과 배열이 직접 구현과 똑같은 것을 확인하세요. 같은 알고리즘이기 때문입니다.                                                                                            |
| `print("heapq:   ", list(std), ...)`             | `list(std)`로 **복사**했습니다. `print`는 인자를 모두 계산한 뒤에 출력하므로, 복사하지 않고 `std`를 그대로 넘기면 뒤쪽 인자의 `heappop`이 먼저 실행되어 빈 리스트 `[]`가 출력됩니다. 인자를 계산하는 순서와 출력 시점이 다르다는 점을 기억하세요. |
| `max_heap = [-s for s in scores]`                | `heapq`는 최소 힙만 제공합니다. 부호를 뒤집으면 가장 큰 점수가 가장 작은 값이 되어 먼저 나옵니다. 꺼낸 뒤 다시 `-`를 붙여 되돌립니다.                                                                                                             |
| `heapq.nlargest(2, scores)`                      | 상위 k개를 힙으로 효율적으로 구해 주는 함수입니다. 실습의 수정 문제에서 원리를 직접 구현합니다.                                                                                                                                                   |

## 7. Rust로 구현하기

Rust 버전은 **제네릭** 최소 힙 `MinHeap<T: Ord>`로 만듭니다. `Ord`는 "크기 비교가 가능한 타입"이라는 트레이트 경계입니다. 정수든 문자열이든 튜플이든 비교할 수 있으면 힙에 넣을 수 있습니다.

```rust
// 파일: min_heap.rs
use std::cmp::Reverse;
use std::collections::BinaryHeap;

struct MinHeap<T: Ord> {
    items: Vec<T>,
}

impl<T: Ord> MinHeap<T> {
    fn new() -> Self {
        MinHeap { items: Vec::new() }
    }

    fn from_vec(items: Vec<T>) -> Self {
        let mut heap = MinHeap { items };
        for i in (0..heap.items.len() / 2).rev() {      // heapify
            heap.sift_down(i);
        }
        heap
    }

    fn push(&mut self, value: T) {
        self.items.push(value);
        self.sift_up(self.items.len() - 1);
    }

    fn pop(&mut self) -> Option<T> {
        if self.items.is_empty() {
            return None;
        }
        let last = self.items.len() - 1;
        self.items.swap(0, last);           // 루트와 마지막을 바꾸고
        let smallest = self.items.pop();    // 끝에서 꺼낸다
        if !self.items.is_empty() {
            self.sift_down(0);
        }
        smallest
    }

    fn peek(&self) -> Option<&T> {
        self.items.first()
    }

    fn sift_up(&mut self, mut i: usize) {
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.items[parent] <= self.items[i] {
                break;
            }
            self.items.swap(parent, i);
            i = parent;
        }
    }

    fn sift_down(&mut self, mut i: usize) {
        let n = self.items.len();
        while 2 * i + 1 < n {
            let mut child = 2 * i + 1;
            if child + 1 < n && self.items[child + 1] < self.items[child] {
                child += 1;
            }
            if self.items[i] <= self.items[child] {
                break;
            }
            self.items.swap(i, child);
            i = child;
        }
    }
}

fn main() {
    let mut h = MinHeap::new();
    for v in [5, 3, 8, 1, 9, 2] {
        h.push(v);
    }
    println!("직접 구현: {:?} peek {:?}", h.items, h.peek());
    let mut order = Vec::new();
    while let Some(v) = h.pop() {
        order.push(v);
    }
    println!("꺼낸 순서: {:?}", order);

    let g = MinHeap::from_vec(vec![9, 7, 5, 3, 8, 1, 6]);
    println!("heapify:  {:?}", g.items);

    let mut words = MinHeap::new();
    for w in ["pear", "apple", "fig", "kiwi"] {
        words.push(w);
    }
    println!("문자열 힙 peek: {:?}", words.peek());

    // 표준 BinaryHeap은 최대 힙
    let mut max_heap: BinaryHeap<i32> = [5, 3, 8, 1, 9, 2].into_iter().collect();
    println!("BinaryHeap peek(최댓값): {:?}", max_heap.peek());
    print!("BinaryHeap 꺼낸 순서:");
    while let Some(v) = max_heap.pop() {
        print!(" {v}");
    }
    println!();

    // Reverse로 감싸면 최소 힙처럼 동작
    let mut min_std: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    for v in [5, 3, 8, 1] {
        min_std.push(Reverse(v));
    }
    let Reverse(smallest) = min_std.pop().unwrap();
    println!("Reverse 힙에서 꺼낸 값: {smallest}, 남은 개수 {}", min_std.len());
}
```

실행 결과:

```text
직접 구현: [1, 3, 2, 5, 9, 8] peek Some(1)
꺼낸 순서: [1, 2, 3, 5, 8, 9]
heapify:  [1, 3, 5, 7, 8, 9, 6]
문자열 힙 peek: Some("apple")
BinaryHeap peek(최댓값): Some(9)
BinaryHeap 꺼낸 순서: 9 8 5 3 2 1
Reverse 힙에서 꺼낸 값: 1, 남은 개수 3
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `struct MinHeap<T: Ord>`                                     | `T`는 `<`, `<=`로 비교할 수 있어야 합니다. 비교할 수 없는 타입을 넣으려 하면 **컴파일 단계에서** 거절됩니다. 그래서 문자열 힙도 코드 한 줄 바꾸지 않고 만들 수 있었습니다. |
| `for i in (0..heap.items.len() / 2).rev()`                   | `0..n`은 0부터 n-1까지, `.rev()`는 거꾸로입니다. 크기 7이면 3/… 즉 `0..3`을 거꾸로 해서 2, 1, 0입니다.                                                                     |
| `self.items.swap(0, last); let smallest = self.items.pop();` | Python 버전과 같은 방법입니다. `Vec::pop`이 `Option<T>`를 돌려주므로 그대로 반환합니다. 원소를 **이동**하기 때문에 `T`가 복사 가능한 타입일 필요가 없습니다.               |
| `self.items.first()`                                         | 첫 원소를 빌려서 `Option<&T>`로 돌려줍니다. 비어 있으면 `None`이라 peek의 빈 힙 처리가 저절로 됩니다.                                                                      |
| `[5, 3, 8, 1, 9, 2].into_iter().collect()`                   | 반복자의 값을 모아 `BinaryHeap`을 만듭니다. `collect`는 받는 타입(`BinaryHeap<i32>`)에 맞게 만들어 주며, 내부적으로 heapify를 합니다.                                      |
| `BinaryHeap<Reverse<i32>>`                                   | `Reverse(3) < Reverse(1)`로 비교가 뒤집힙니다. 최대 힙에서 가장 "큰" `Reverse`가 먼저 나오므로 실제로는 가장 작은 값이 나옵니다.                                           |
| `let Reverse(smallest) = min_std.pop().unwrap();`            | 패턴으로 `Reverse` 껍질을 벗겨 안의 값을 꺼냅니다. 방금 넣었으므로 비어 있을 수 없어 `unwrap()`을 썼습니다.                                                                |

## 8. 실행 추적

C 프로그램의 `push 1`과 첫 번째 `pop`을 배열 단위로 따라갑니다.

**push 1** (배열 `[3, 5, 8]`에 1 추가)

| 단계 | i   | parent | 비교             | 배열           |
| ---: | --- | -----: | ---------------- | -------------- |
|    1 | 3   |      1 | 끝에 넣음        | `[3, 5, 8, 1]` |
|    2 | 3   |      1 | 5 > 1 → 교환     | `[3, 1, 8, 5]` |
|    3 | 1   |      0 | 3 > 1 → 교환     | `[1, 3, 8, 5]` |
|    4 | 0   |      - | 루트 도착 → 멈춤 | `[1, 3, 8, 5]` |

**pop** (배열 `[1, 3, 2, 5, 9, 8]`)

| 단계 | i   | 자식(인덱스:값)      | 비교                       | 배열              |
| ---: | --- | -------------------- | -------------------------- | ----------------- |
|    1 | -   | -                    | 루트 1을 꺼내고 8을 루트로 | `[8, 3, 2, 5, 9]` |
|    2 | 0   | 1:3, 2:2 → 작은 쪽 2 | 8 > 2 → 교환               | `[2, 3, 8, 5, 9]` |
|    3 | 2   | 5, 6 → 없음          | 잎 → 멈춤                  | `[2, 3, 8, 5, 9]` |

## 9. 다른 예제로 다시 이해하기

**힙 정렬(heap sort)** 은 힙을 이용한 정렬 알고리즘입니다. 배열을 **최대 힙**으로 만들면 가장 큰 값이 인덱스 0에 옵니다. 이것을 배열의 **마지막 칸과 바꾸고**, 힙의 크기를 하나 줄인 뒤 루트에서 sift down하면 남은 부분에서 가장 큰 값이 다시 루트로 올라옵니다. 이 과정을 반복하면 큰 값부터 배열의 뒤쪽에 차곡차곡 쌓여 오름차순 정렬이 됩니다. 새 배열 없이 **제자리에서** 정렬하고, 최악의 경우에도 O(n log n)이 보장된다는 장점이 있습니다.

```c
// 파일: heap_sort.c
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

// 최대 힙: 부모 >= 자식
void sift_down(int a[], int n, int i) {
    while (2 * i + 1 < n) {
        int child = 2 * i + 1;
        if (child + 1 < n && a[child + 1] > a[child]) {
            child++;                        // 더 큰 자식
        }
        if (a[i] >= a[child]) {
            break;
        }
        swap(&a[i], &a[child]);
        i = child;
    }
}

void print_array(const char *label, const int a[], int n) {
    printf("%-14s", label);
    for (int i = 0; i < n; i++) {
        printf(" %d", a[i]);
    }
    printf("\n");
}

void heap_sort(int a[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        sift_down(a, n, i);                 // ① 최대 힙 만들기
    }
    print_array("max-heap:", a, n);
    for (int end = n - 1; end > 0; end--) {
        swap(&a[0], &a[end]);               // ② 가장 큰 값을 뒤로 보내고
        sift_down(a, end, 0);               // ③ 남은 부분을 다시 힙으로
        if (end == n - 1 || end == 1) {
            char label[20];
            snprintf(label, sizeof label, "end=%d:", end);
            print_array(label, a, n);
        }
    }
}

int main(void) {
    int data[] = {4, 10, 3, 5, 1, 8, 7};
    int n = sizeof data / sizeof data[0];
    print_array("input:", data, n);
    heap_sort(data, n);
    print_array("sorted:", data, n);
    return 0;
}
```

실행 결과:

```text
input:         4 10 3 5 1 8 7
max-heap:      10 5 8 4 1 3 7
end=6:         8 5 7 4 1 3 10
end=1:         1 3 4 5 7 8 10
sorted:        1 3 4 5 7 8 10
```

`end=6` 줄을 보세요. 가장 큰 10이 마지막 칸으로 가서 **확정**되었고, 앞의 여섯 칸은 다시 최대 힙(루트 8)이 되었습니다.

우선순위 큐는 **동점 처리**도 중요합니다. 응급실에서 위급도가 같다면 먼저 온 환자를 먼저 봐야 합니다. Python의 `heapq`에 튜플 `(우선순위, 도착 번호, 이름)`을 넣으면 튜플은 **앞 원소부터** 비교되므로, 우선순위가 같을 때 도착 번호가 작은 쪽이 먼저 나옵니다. 여기서는 위급도가 **작을수록 급하다**고 정했습니다.

```python
# 파일: emergency.py
import heapq

arrivals = [("민수", 3), ("지아", 1), ("하준", 2), ("서연", 1), ("도윤", 3)]
waiting = []
for order, (name, level) in enumerate(arrivals):
    heapq.heappush(waiting, (level, order, name))
    print(f"도착: {name}(위급도 {level}) → 대기 {len(waiting)}명, 다음 환자 {waiting[0][2]}")

print("진료 순서:", " → ".join(heapq.heappop(waiting)[2] for _ in range(len(waiting))))
```

실행 결과:

```text
도착: 민수(위급도 3) → 대기 1명, 다음 환자 민수
도착: 지아(위급도 1) → 대기 2명, 다음 환자 지아
도착: 하준(위급도 2) → 대기 3명, 다음 환자 지아
도착: 서연(위급도 1) → 대기 4명, 다음 환자 지아
도착: 도윤(위급도 3) → 대기 5명, 다음 환자 지아
진료 순서: 지아 → 서연 → 하준 → 민수 → 도윤
```

지아와 서연은 위급도가 1로 같지만 지아가 먼저 도착해서(도착 번호 1 < 3) 먼저 진료받습니다. 도착 번호가 없다면 두 번째 비교 대상이 **이름**이 되어 가나다순으로 정해지므로 공정하지 않습니다.

## 10. 시간·공간 복잡도

| 연산                | 힙                         | 정렬되지 않은 배열 | 정렬된 배열 |
| ------------------- | -------------------------- | ------------------ | ----------- |
| push                | O(log n)                   | O(1)               | O(n)        |
| pop (최솟값 꺼내기) | O(log n)                   | O(n)               | O(1)        |
| peek (최솟값 보기)  | O(1)                       | O(n)               | O(1)        |
| n개로 만들기        | O(n) heapify               | O(1)               | O(n log n)  |
| 임의 값 찾기        | O(n)                       | O(n)               | O(log n)    |
| 힙 정렬             | O(n log n), 추가 공간 O(1) |                    |             |

힙은 **최솟값(최댓값) 하나**에만 강합니다. "값 42가 있나?" 같은 검색은 모든 원소를 봐야 하므로 O(n)입니다. 검색이 필요하면 BST나 해시 맵을 씁니다.

## 11. 세 언어 비교

| 관점            | C                           | Python                       | Rust                                 |
| --------------- | --------------------------- | ---------------------------- | ------------------------------------ |
| 저장            | 고정 배열 + size            | `list`                       | `Vec<T>`                             |
| 원소 타입       | `int` 하나                  | 비교 가능한 아무 값          | `T: Ord` (컴파일 시 검사)            |
| 교환            | `swap(&a[i], &a[j])` 포인터 | `a[i], a[j] = a[j], a[i]`    | `items.swap(i, j)`                   |
| 빈 힙 pop       | `bool` 반환                 | `IndexError`                 | `Option<T>`의 `None`                 |
| 표준 라이브러리 | 없음                        | `heapq` (최소 힙, 함수 모음) | `BinaryHeap` (최대 힙)               |
| 반대 순서 힙    | 비교 방향을 바꿔 직접 구현  | 값에 `-`를 붙임              | `std::cmp::Reverse`로 감쌈           |
| 동점 처리       | 구조체 비교 함수 직접 작성  | 튜플 `(우선순위, 순서, 값)`  | 튜플 `(우선순위, Reverse(순서), 값)` |

## 12. 자주 하는 실수

### 실수 1: sift down에서 한쪽 자식만 본다

실습의 디버그 문제입니다. 왼쪽 자식하고만 비교하면 오른쪽에 더 작은 값이 있을 때 놓칩니다. **두 자식 중 더 작은 쪽**을 골라 비교하세요.

### 실수 2: 인덱스 공식을 1부터 시작하는 배열의 것과 섞는다

많은 교재가 인덱스를 **1부터** 쓰는 힙을 설명합니다. 그 경우 공식은 부모 `i / 2`, 자식 `2i`, `2i + 1`입니다. 0부터 시작하는 C, Python, Rust 배열에 이 공식을 그대로 쓰면 인덱스가 하나씩 어긋납니다. 0부터 시작하면 부모 `(i - 1) / 2`, 자식 `2i + 1`, `2i + 2`입니다.

### 실수 3: 힙 배열이 정렬되어 있다고 생각한다

```python
# 파일: heap_not_sorted.py
import heapq

h = []
for v in [5, 3, 8, 1, 9, 2]:
    heapq.heappush(h, v)
print("힙 배열:", h)
print("두 번째로 작은 값은 h[1]?", h[1], "→ 실제로는", sorted(h)[1])
```

실행 결과:

```text
힙 배열: [1, 3, 2, 5, 9, 8]
두 번째로 작은 값은 h[1]? 3 → 실제로는 2
```

힙에서 확실한 것은 `h[0]`이 가장 작다는 것뿐입니다. 두 번째로 작은 값은 h[1]이나 h[2] 중 하나입니다. 정렬된 순서가 필요하면 pop을 반복하세요.

### 실수 4: Rust BinaryHeap을 최소 힙으로 착각한다

`BinaryHeap`은 **가장 큰 값**을 먼저 꺼냅니다. 다익스트라처럼 가장 작은 거리를 먼저 꺼내야 하는 알고리즘에서 `Reverse`를 빼먹으면 가장 먼 곳부터 처리하게 되어 결과가 틀립니다. 반대로 Python의 `heapq`는 가장 **작은** 값을 먼저 꺼냅니다. 언어를 오갈 때 특히 조심하세요.

### 실수 5: 비교할 수 없는 값을 튜플 뒤에 넣는다

```python
# 파일: uncomparable.py (실행 오류: TypeError)
import heapq

h = []
heapq.heappush(h, (1, {"name": "지아"}))
heapq.heappush(h, (1, {"name": "서연"}))     # 우선순위가 같아 dict끼리 비교
```

```text
TypeError: '<' not supported between instances of 'dict' and 'dict'
```

우선순위가 같으면 튜플의 다음 원소를 비교하는데, `dict`는 크기를 비교할 수 없습니다. 9절처럼 **도착 번호**를 가운데에 넣어 두면 두 번째 원소에서 항상 승부가 나므로 세 번째 원소는 비교되지 않습니다. Rust에서는 비교할 수 없는 타입을 `BinaryHeap`에 넣으려 하면 컴파일 오류가 납니다.

## 13. Q&A

**Q. 힙과 BST는 둘 다 트리인데 무엇이 다른가요?**

A. BST는 "왼쪽 < 부모 < 오른쪽"이라 **어떤 값이든** 빨리 찾을 수 있고, 중위 순회로 정렬 순서를 얻습니다. 힙은 "부모 ≤ 자식"이라 **최솟값(최댓값)만** 빨리 알 수 있지만, 완전 이진 트리라 항상 균형이 맞고 배열 하나로 저장할 수 있어 단순하고 빠릅니다. 필요한 연산이 "가장 작은 것 꺼내기"뿐이라면 힙이 알맞습니다.

**Q. 힙에 있는 원소의 우선순위를 바꾸려면 어떻게 하나요?**

A. 그 원소의 **인덱스**를 알면, 값을 바꾼 뒤 작아졌으면 sift up, 커졌으면 sift down 하면 됩니다. 문제는 인덱스를 찾는 데 O(n)이 걸린다는 점입니다. 그래서 다익스트라 알고리즘에서는 우선순위를 바꾸는 대신 **새 항목을 하나 더 넣고**, 꺼낼 때 이미 처리한 오래된 항목을 무시하는 방법을 흔히 씁니다(Day 82).

**Q. heapify가 O(n)이라는 것이 잘 믿기지 않습니다.**

A. 트리의 절반은 잎이라 아예 움직이지 않습니다. 그 위층(전체의 1/4)은 최대 1칸, 그 위층(1/8)은 최대 2칸만 내려갑니다. 모두 더하면 n × (1/4 × 1 + 1/8 × 2 + 1/16 × 3 + …) ≈ n이 됩니다. 멀리 내려가는 노드는 위쪽에 있는 **소수**뿐이기 때문입니다.

**Q. 힙 정렬은 왜 병합 정렬이나 퀵 정렬보다 덜 쓰이나요?**

A. 시간 복잡도는 모두 O(n log n)이지만, 힙 정렬은 배열을 멀리 건너뛰며 접근하므로 CPU 캐시를 잘 활용하지 못해 실제로는 조금 느린 편입니다. 대신 최악의 경우에도 O(n log n)이고 추가 메모리가 필요 없다는 장점이 있어서, 퀵 정렬이 나쁜 경우에 빠지면 힙 정렬로 바꾸는 방식(인트로 정렬)에 쓰입니다. 정렬 알고리즘은 Day 73~75에서 자세히 다룹니다.

## 14. 핵심 요약

- 우선순위 큐는 **가장 우선순위가 높은 것**을 먼저 꺼내는 자료구조이고, 힙으로 구현합니다.
- 힙의 규칙: **완전 이진 트리** 모양 + 최소 힙이면 **부모 ≤ 자식**. 형제 사이에는 순서가 없으므로 정렬된 상태는 아닙니다.
- 배열로 저장합니다. 인덱스 i의 자식은 **2i + 1, 2i + 2**, 부모는 **(i - 1) / 2** 입니다.
- **push**: 끝에 넣고 부모보다 작은 동안 위로 올립니다(sift up).
- **pop**: 루트를 꺼내고 마지막 원소를 루트로 옮긴 뒤, **더 작은 자식**과 바꾸며 내립니다(sift down).
- push·pop은 O(log n), peek는 O(1), heapify는 O(n), 힙 정렬은 O(n log n)입니다.
- Python `heapq`는 최소 힙, Rust `BinaryHeap`은 최대 힙입니다. 반대가 필요하면 `-`(Python)나 `Reverse`(Rust)를 씁니다. 동점은 **도착 순서**를 튜플에 넣어 처리합니다.

## 15. 도전 문제

1. **(C)** 최소 힙 코드를 고쳐 **최대 힙**을 만들어 보세요. 비교 연산자 몇 개만 바뀌는지 세어 보세요. 가능하면 비교 함수 포인터 `int (*cmp)(int, int)`를 받아 둘 다 지원해 보세요.
2. **(Python)** 정렬된 리스트 여러 개를 하나의 정렬된 리스트로 합치는 `merge_sorted(lists)`를 힙으로 구현하세요. 힙에는 `(값, 리스트 번호, 인덱스)`를 넣습니다. 결과를 `heapq.merge`와 비교해 보세요.
3. **(Rust)** 데이터가 하나씩 들어올 때마다 **지금까지의 중앙값**을 출력하세요. 작은 절반을 담는 최대 힙과 큰 절반을 담는 최소 힙(`Reverse`) 두 개를 쓰고, 두 힙의 크기 차이가 1 이하가 되도록 유지합니다.
4. **(세 언어)** 9절의 힙 정렬을 Python과 Rust로 옮기고, 무작위 숫자 10개로 정렬 결과를 표준 정렬 함수와 비교해 보세요.
