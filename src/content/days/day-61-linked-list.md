---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-61-linked-list
courseId: crp-92
phaseId: phase-06
dayNumber: 61
date: "2026-11-30"
title: 단일 연결 리스트 — 노드를 주소로 잇기
summary: 값과 다음 노드의 주소를 가진 노드를 이어 리스트를 만듭니다. C에서는 malloc과 free로 노드를 직접 관리하고, Python에서는 객체 참조로, Rust에서는 Option<Box<Node>>로 같은 리스트를 구현합니다. 맨 앞·맨 뒤 삽입, 검색, 삭제, 전체 해제, 뒤집기까지 세 언어로 완성합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-60-circular-queue]
learningObjectives:
  - 배열과 연결 리스트의 저장 방식 차이와 각각의 장단점을 설명한다.
  - head에서 시작해 next를 따라가며 NULL(None)에서 멈추는 순회를 작성한다.
  - 맨 앞 삽입, 맨 뒤 삽입, 값으로 삭제할 때 바뀌는 연결을 그림으로 추적한다.
  - C에서 노드를 malloc으로 만들고 순회하며 하나씩 free한다.
  - Rust의 Option<Box<Node>>와 take()로 소유권을 옮기며 노드를 연결·삭제한다.
  - 포인터 세 개(prev, cur, next)로 연결 리스트를 제자리에서 뒤집는다.
concepts:
  [
    linked list,
    node,
    head,
    next pointer,
    traversal,
    malloc,
    free,
    Option<Box<T>>,
    reverse,
  ]
runnerMode: python
playgroundSource: |
  # 파일: linked_list.py — 노드를 추가·삭제하며 연결을 확인해 보세요.
  class Node:
      def __init__(self, value, next=None):
          self.value = value
          self.next = next


  head = None
  for value in [30, 20, 10]:
      head = Node(value, head)        # 맨 앞에 삽입

  cur = head
  while cur is not None:
      print(cur.value, end=" -> ")
      cur = cur.next
  print("None")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day61-predict-c
    title: C 노드 연결 따라가기
    kind: predict
    objective: next 포인터를 따라가며 값을 읽는 순서를 추적한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      #include <stdio.h>

      typedef struct Node {
          int value;
          struct Node *next;
      } Node;

      int main(void) {
          Node c = {30, NULL};
          Node b = {20, &c};
          Node a = {10, &b};
          a.next = &c;
          b.next = &a;
          printf("%d %d %d\n", a.value, a.next->value, b.next->next->value);
          return 0;
      }
    answer: "10 30 30"
    hint: "a.next를 &c로 바꿨으므로 a 다음은 c입니다. b.next는 &a이므로 b → a → c 순서로 따라갑니다."
    explanation: "a.next->value는 c의 30입니다. b.next->next는 b에서 a로, a에서 c로 두 번 이동하므로 역시 30입니다. 연결은 선언 순서가 아니라 next에 저장된 주소가 결정합니다."
    commonMistakes:
      - "처음 초기화한 연결(a → b)이 그대로라고 생각해 20을 적음"
      - "->가 두 번 나오면 값을 두 번 더한다고 생각함"
    language: c
    verification: run
  - id: ex-day61-predict-py
    title: Python 맨 앞 삽입 순서 예측하기
    kind: predict
    objective: 맨 앞 삽입이 순서를 뒤집는다는 것을 확인한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      class Node:
          def __init__(self, value, next=None):
              self.value = value
              self.next = next


      head = None
      for ch in "ABC":
          head = Node(ch, head)
      head.next = head.next.next
      out = []
      cur = head
      while cur:
          out.append(cur.value)
          cur = cur.next
      print("".join(out))
    answer: CA
    hint: "맨 앞에 차례로 넣으면 리스트는 C → B → A입니다. head.next = head.next.next는 두 번째 노드를 건너뛰게 연결합니다."
    explanation: "C → B → A에서 C의 next를 B 대신 A로 바꾸면 B가 리스트에서 빠집니다. 출력은 CA입니다. 삭제는 결국 '앞 노드의 next를 한 칸 건너뛰게 바꾸는 일'입니다."
    commonMistakes:
      - "넣은 순서대로 A → B → C가 된다고 생각함"
      - "head.next.next가 노드를 복사한다고 생각함"
    language: python
    verification: run
  - id: ex-day61-fill
    title: Rust push_front 빈칸 채우기
    kind: fill
    objective: take()로 기존 head의 소유권을 새 노드의 next로 옮긴다.
    prompt: "새 노드의 next에 들어갈 표현을 채우세요. 기존 head를 꺼내고 head 자리는 비워 두는 메서드를 써야 합니다."
    starter: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      struct List {
          head: Option<Box<Node>>,
      }

      impl List {
          fn push_front(&mut self, value: i32) {
              let node = Box::new(Node { value, next: _____ });
              self.head = Some(node);
          }
      }

      fn main() {
          let mut list = List { head: None };
          for v in [3, 2, 1] {
              list.push_front(v);
          }
          let mut cur = list.head.as_deref();
          while let Some(node) = cur {
              print!("{} ", node.value);
              cur = node.next.as_deref();
          }
          println!();
      }
    answer: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      struct List {
          head: Option<Box<Node>>,
      }

      impl List {
          fn push_front(&mut self, value: i32) {
              let node = Box::new(Node { value, next: self.head.take() });
              self.head = Some(node);
          }
      }

      fn main() {
          let mut list = List { head: None };
          for v in [3, 2, 1] {
              list.push_front(v);
          }
          let mut cur = list.head.as_deref();
          while let Some(node) = cur {
              print!("{} ", node.value);
              cur = node.next.as_deref();
          }
          println!();
      }
    output: "1 2 3"
    hint: "Option의 take()는 안의 값을 꺼내 주고 그 자리에 None을 남깁니다. self.head를 그냥 쓰면 빌린 곳에서 값을 옮길 수 없다는 오류가 납니다."
    explanation: "self.head.take()가 기존 리스트 전체를 꺼내 새 노드의 next로 옮기고, head는 잠시 None이 됩니다. 곧바로 새 노드를 head에 넣으므로 3, 2, 1을 앞에 넣으면 1 2 3 순서가 됩니다."
    commonMistakes:
      - "next: self.head로 써서 E0507(빌린 값에서 이동할 수 없음) 오류를 냄"
      - "next: None으로 써서 기존 노드들을 모두 잃어버림"
    language: rust
    verification: run
  - id: ex-day61-modify
    title: Python 연결 리스트에 insert_at 추가하기
    kind: modify
    objective: 삽입할 위치의 바로 앞 노드를 찾아 연결을 바꾼다.
    prompt: "LinkedList에 insert_at(index, value)를 추가하세요. index 0은 맨 앞 삽입이고, index가 길이보다 크면 IndexError를 발생시킵니다."
    starter: |-
      class Node:
          def __init__(self, value, next=None):
              self.value = value
              self.next = next


      class LinkedList:
          def __init__(self):
              self.head = None

          def push_front(self, value):
              self.head = Node(value, self.head)

          def __str__(self):
              parts = []
              cur = self.head
              while cur:
                  parts.append(str(cur.value))
                  cur = cur.next
              return " -> ".join(parts) or "(비어 있음)"


      lst = LinkedList()
      for v in [40, 20, 10]:
          lst.push_front(v)
      print(lst)
    answer: |-
      class Node:
          def __init__(self, value, next=None):
              self.value = value
              self.next = next


      class LinkedList:
          def __init__(self):
              self.head = None

          def push_front(self, value):
              self.head = Node(value, self.head)

          def insert_at(self, index, value):
              if index == 0:
                  self.push_front(value)
                  return
              prev = self.head
              for _ in range(index - 1):
                  if prev is None:
                      break
                  prev = prev.next
              if prev is None:
                  raise IndexError("insert_at: 위치가 리스트 길이를 넘습니다")
              prev.next = Node(value, prev.next)

          def __str__(self):
              parts = []
              cur = self.head
              while cur:
                  parts.append(str(cur.value))
                  cur = cur.next
              return " -> ".join(parts) or "(비어 있음)"


      lst = LinkedList()
      for v in [40, 20, 10]:
          lst.push_front(v)
      lst.insert_at(2, 30)
      lst.insert_at(4, 50)
      lst.insert_at(0, 5)
      print(lst)
      try:
          lst.insert_at(9, 99)
      except IndexError as error:
          print("오류:", error)
    output: |-
      5 -> 10 -> 20 -> 30 -> 40 -> 50
      오류: insert_at: 위치가 리스트 길이를 넘습니다
    hint: "index 위치에 넣으려면 index - 1번째 노드(바로 앞 노드)를 찾아서 그 노드의 next를 바꿔야 합니다. 새 노드의 next를 먼저 정하세요."
    explanation: "10 -> 20 -> 40에서 인덱스 1의 노드 20을 찾아 20과 40 사이에 30을 넣습니다. 인덱스 4는 길이(4)와 같아 맨 뒤 삽입이 됩니다. 새 노드를 Node(value, prev.next)로 만든 뒤 prev.next에 연결하므로 뒤쪽 노드를 잃지 않습니다."
    commonMistakes:
      - "prev.next = Node(value)를 먼저 해서 뒤쪽 노드들을 잃어버림"
      - "index번째 노드를 찾아서 그 노드의 앞에 넣으려 함(단일 연결 리스트는 뒤로만 갈 수 있음)"
    language: python
    verification: run
  - id: ex-day61-debug
    title: C 전체 해제의 use-after-free 고치기
    kind: debug
    objective: 노드를 해제한 뒤 그 노드의 next를 읽는 오류를 고친다.
    prompt: "free_list는 cur를 해제한 뒤 cur->next를 읽습니다. 이미 반납한 메모리를 읽는 정의되지 않은 동작입니다. 해제하기 전에 다음 노드의 주소를 저장하도록 고치세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int value;
          struct Node *next;
      } Node;

      int free_list(Node *head) {
          int count = 0;
          for (Node *cur = head; cur != NULL; cur = cur->next) {
              free(cur);
              count++;
          }
          return count;
      }

      int main(void) {
          Node *head = NULL;
          for (int i = 0; i < 3; i++) {
              Node *n = malloc(sizeof *n);
              if (n == NULL) return 1;
              n->value = i;
              n->next = head;
              head = n;
          }
          printf("해제한 노드: %d\n", free_list(head));
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int value;
          struct Node *next;
      } Node;

      int free_list(Node *head) {
          int count = 0;
          Node *cur = head;
          while (cur != NULL) {
              Node *next = cur->next;
              free(cur);
              cur = next;
              count++;
          }
          return count;
      }

      int main(void) {
          Node *head = NULL;
          for (int i = 0; i < 3; i++) {
              Node *n = malloc(sizeof *n);
              if (n == NULL) return 1;
              n->value = i;
              n->next = head;
              head = n;
          }
          printf("해제한 노드: %d\n", free_list(head));
          return 0;
      }
    output: "해제한 노드: 3"
    hint: "for 문의 cur = cur->next는 free(cur) 다음에 실행됩니다. next를 임시 변수에 먼저 담아 두세요."
    explanation: "free 뒤의 cur->next는 이미 반납한 메모리를 읽습니다. 운 좋게 동작하는 것처럼 보일 수도 있지만 언제든 망가질 수 있습니다. 고친 코드는 next를 먼저 저장한 뒤 해제하고, 저장해 둔 주소로 이동합니다."
    commonMistakes:
      - "head만 free해서 나머지 노드를 누수시킴"
      - "free(cur) 뒤에 cur->value를 출력해 해제된 메모리를 읽음"
    language: c
    verification: run
  - id: ex-day61-independent
    title: Rust 연결 리스트에서 합계와 최댓값 구하기
    kind: independent
    objective: 소유권을 옮기지 않고 빌려서 리스트를 순회한다.
    prompt: "List에 fn sum(&self) -> i32와 fn max(&self) -> Option<i32>를 구현하세요. 빈 리스트의 max는 None입니다. 리스트 4 -> 9 -> 2에서 15 Some(9), 빈 리스트에서 0 None이 출력되어야 합니다."
    starter: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      struct List {
          head: Option<Box<Node>>,
      }

      impl List {
          fn push_front(&mut self, value: i32) {
              self.head = Some(Box::new(Node { value, next: self.head.take() }));
          }
          // sum과 max를 여기에 작성하세요.
      }

      fn main() {
          let mut list = List { head: None };
          for v in [2, 9, 4] {
              list.push_front(v);
          }
          println!("{}", list.head.is_some());
      }
    answer: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      struct List {
          head: Option<Box<Node>>,
      }

      impl List {
          fn push_front(&mut self, value: i32) {
              self.head = Some(Box::new(Node { value, next: self.head.take() }));
          }

          fn sum(&self) -> i32 {
              let mut total = 0;
              let mut cur = self.head.as_deref();
              while let Some(node) = cur {
                  total += node.value;
                  cur = node.next.as_deref();
              }
              total
          }

          fn max(&self) -> Option<i32> {
              let mut best: Option<i32> = None;
              let mut cur = self.head.as_deref();
              while let Some(node) = cur {
                  best = match best {
                      Some(b) if b >= node.value => Some(b),
                      _ => Some(node.value),
                  };
                  cur = node.next.as_deref();
              }
              best
          }
      }

      fn main() {
          let mut list = List { head: None };
          for v in [2, 9, 4] {
              list.push_front(v);
          }
          println!("{} {:?}", list.sum(), list.max());
          let empty = List { head: None };
          println!("{} {:?}", empty.sum(), empty.max());
      }
    output: |-
      15 Some(9)
      0 None
    hint: "as_deref()는 Option<Box<Node>>를 Option<&Node>로 바꿔 빌려줍니다. 빌린 참조로 순회하면 리스트는 그대로 남습니다."
    explanation: "cur는 Option<&Node>라서 노드를 빌리기만 합니다. 최댓값은 아직 본 값이 없을 수 있으므로 Option으로 시작해, 처음 본 값이거나 더 큰 값이면 바꿉니다. 빈 리스트는 반복을 한 번도 돌지 않아 0과 None이 됩니다."
    commonMistakes:
      - "let mut cur = self.head;로 써서 head의 소유권을 옮기려다 컴파일 오류를 냄"
      - "최댓값의 시작값을 0으로 둬서 음수만 있는 리스트에서 틀린 답을 냄"
    language: rust
    verification: run
quiz:
  - id: quiz-day61-01
    question: 배열과 비교한 연결 리스트의 장점으로 가장 알맞은 것은?
    choices:
      - k번째 원소를 O(1)에 바로 읽을 수 있다
      - 위치를 알고 있다면 원소를 옮기지 않고 O(1)에 끼워 넣거나 뺄 수 있다
      - 원소마다 메모리를 더 적게 쓴다
      - 원소가 메모리에 연속으로 있어 캐시에 유리하다
    answerIndex: 1
    explanation: 연결만 바꾸면 되므로 삽입·삭제 자체는 O(1)입니다. 대신 k번째 원소를 찾으려면 head부터 k번 따라가야 하고(O(n)), 노드마다 next 포인터 공간이 더 듭니다.
  - id: quiz-day61-02
    question: 연결 리스트 순회를 멈추는 조건으로 옳은 것은?
    choices:
      - cur->value == 0일 때
      - cur == NULL일 때 (Python은 None, Rust는 None)
      - cur->next == cur일 때
      - 반복을 10번 했을 때
    answerIndex: 1
    explanation: 마지막 노드의 next는 NULL(None)이므로, 그 NULL을 cur에 넣은 순간 더 따라갈 노드가 없습니다. 값이 0인지는 끝과 아무 관계가 없습니다.
  - id: quiz-day61-03
    question: "C에서 연결 리스트의 노드 3개를 malloc으로 만들었습니다. free(head)만 호출하면 어떻게 되나요?"
    choices:
      - 연결된 노드 3개가 모두 해제된다
      - 첫 노드만 해제되고 나머지 두 노드는 주소를 잃어 메모리 누수가 된다
      - 컴파일 오류가 난다
      - 프로그램이 바로 멈춘다
    answerIndex: 1
    explanation: free는 받은 주소 하나만 반납합니다. 첫 노드가 사라지면 두 번째 노드의 주소도 함께 잃어버려 다시는 해제할 수 없습니다. 순회하며 하나씩 해제해야 합니다.
  - id: quiz-day61-04
    question: "Rust에서 self.head.take()가 하는 일은?"
    choices:
      - head를 복사해서 돌려준다
      - head 안의 값을 꺼내 돌려주고, head 자리에 None을 남긴다
      - head가 가리키는 노드를 삭제한다
      - head를 빌려준다
    answerIndex: 1
    explanation: take()는 Option에서 값을 소유권째 꺼내고 빈자리(None)를 남깁니다. 빌린 &mut self 안에서 값을 옮겨야 할 때 쓰는 대표적인 방법입니다.
  - id: quiz-day61-05
    question: 1 → 2 → 3을 prev, cur, next 세 포인터로 뒤집을 때, 반복이 끝난 뒤 새 head가 되는 것은?
    choices:
      - cur (마지막에 NULL)
      - prev (마지막으로 처리한 노드 3)
      - 원래 head (노드 1)
      - next
    answerIndex: 1
    explanation: 반복은 cur가 NULL이 될 때 끝나고, 그때 prev는 마지막으로 방향을 바꾼 노드 3을 가리킵니다. 노드 1은 새 리스트의 끝이 되어 next가 NULL입니다.
---

## 1. 오늘 배울 내용

지금까지 만든 스택과 큐는 모두 **배열** 위에 지었습니다. 배열은 원소를 메모리에 **빈틈없이 이어서** 저장합니다. 오늘은 전혀 다른 방식인 **연결 리스트(linked list)** 를 배웁니다. 연결 리스트는 원소를 메모리 여기저기에 흩어 놓고, 각 원소가 **다음 원소의 주소**를 들고 있게 해서 순서를 만듭니다.

이번 수업은 분량이 많습니다. 차근차근 따라오세요.

1. 배열로 중간에 끼워 넣기가 왜 비싼지 확인하고, 연결 리스트의 아이디어를 봅니다.
2. **노드(node)**, **head**, **NULL로 끝나기**라는 세 가지 기본 개념을 익힙니다.
3. 순회, 맨 앞 삽입, 맨 뒤 삽입, 검색, 삭제, 전체 해제를 그림으로 이해합니다.
4. **C** 로 `malloc`과 `free`를 써서 연결 리스트를 완성합니다. 포인터를 가장 많이 쓰는 수업입니다.
5. **Python** 으로 같은 리스트를 클래스로 만듭니다.
6. **Rust** 로 `Option<Box<Node>>`를 써서 만듭니다. 소유권이 노드에서 노드로 넘어가는 모습을 봅니다.
7. 응용으로 연결 리스트를 **뒤집는** 유명한 알고리즘을 세 언어로 구현합니다.

> **준비물**: Day 29(포인터), Day 40(malloc과 free), Day 41(Box), Day 50~52(구조체와 클래스)를 떠올려 두면 좋습니다.

## 2. 왜 연결 리스트가 필요한가

정렬된 배열 `[10, 20, 40, 50]`의 20과 40 사이에 30을 넣어야 한다고 합시다.

```text
넣기 전: [10][20][40][50][  ]
40, 50을 한 칸씩 뒤로 민다 (뒤에서부터)
        [10][20][  ][40][50]
빈칸에 30을 쓴다
        [10][20][30][40][50]
```

넣을 자리 뒤의 원소를 **모두** 한 칸씩 옮겨야 합니다. 원소가 100만 개인 배열의 맨 앞에 넣으면 100만 개를 옮깁니다. 삭제도 마찬가지로 빈칸을 메우려고 뒤의 원소를 당겨야 합니다.

연결 리스트는 원소를 옮기지 않습니다. 각 원소가 "내 다음은 저 원소"라는 **화살표**를 들고 있으므로, 화살표 두 개만 바꾸면 끼워 넣기가 끝납니다.

```text
넣기 전:   [10]→[20]→[40]→[50]→NULL

30을 새로 만들고, 화살표 두 개만 바꾼다
           [10]→[20]   [40]→[50]→NULL
                   ↘   ↗
                   [30]
```

그 대신 잃는 것도 있습니다. 배열은 `a[3]`처럼 네 번째 원소로 **바로** 갈 수 있지만, 연결 리스트는 첫 원소부터 화살표를 세 번 따라가야 합니다. 어떤 자료구조도 모든 면에서 좋을 수는 없습니다. 10절에서 둘을 표로 비교합니다.

## 3. 그림으로 이해하기

연결 리스트의 구성 요소는 세 가지입니다.

```text
   head
    │
    ▼
 ┌──────┬──────┐    ┌──────┬──────┐    ┌──────┬──────┐
 │  10  │  ●───┼───►│  20  │  ●───┼───►│  30  │ NULL │
 └──────┴──────┘    └──────┴──────┘    └──────┴──────┘
  value   next       value   next       value   next
 주소 0x100          주소 0x2a0          주소 0x180
```

- **노드(node)**: 값(value)과 다음 노드의 주소(next)를 함께 가진 상자입니다.
- **head**: 첫 노드의 주소를 담은 변수입니다. 리스트 전체의 "입구"입니다. head를 잃어버리면 리스트 전체를 잃어버립니다.
- **NULL**: 마지막 노드의 next에는 "다음이 없음"을 뜻하는 NULL을 둡니다. Python과 Rust에서는 `None`입니다. 빈 리스트는 head 자체가 NULL입니다.

노드의 주소(0x100, 0x2a0, 0x180)를 보세요. 순서대로 늘어서 있지 않습니다. `malloc`이 비어 있는 아무 곳이나 내주기 때문입니다. 그래도 next를 따라가면 10 → 20 → 30 순서가 유지됩니다. **순서를 만드는 것은 메모리 위치가 아니라 next에 저장된 주소**입니다.

## 4. 천천히 풀어보기

### 4.1 순회: head에서 NULL까지 따라가기

모든 연결 리스트 연산의 기본은 **순회(traversal)** 입니다.

```text
cur = head
cur가 NULL이 아닌 동안:
    cur의 값을 사용한다
    cur = cur의 next      ← 다음 노드로 한 칸 이동
```

`cur`는 "지금 보고 있는 노드"를 가리키는 **손가락** 같은 변수입니다. head 자체를 움직이면 입구를 잃어버리므로, 반드시 별도의 변수로 따라갑니다.

### 4.2 맨 앞 삽입: 가장 쉬운 삽입

```text
① 새 노드를 만든다             [5]
② 새 노드의 next = head        [5]→[10]→[20]→NULL
③ head = 새 노드               head→[5]
```

**②와 ③의 순서가 중요합니다.** ③을 먼저 하면 head가 새 노드를 가리켜 기존 리스트의 주소를 잃어버립니다. 연결을 바꿀 때는 항상 **새로 연결할 쪽을 먼저, 기존 연결을 끊는 쪽을 나중에** 합니다. 맨 앞 삽입은 리스트 길이와 상관없이 O(1)입니다.

### 4.3 맨 뒤 삽입: 끝까지 가야 한다

맨 뒤에 넣으려면 마지막 노드(next가 NULL인 노드)를 찾아야 합니다. head만 가지고 있다면 끝까지 순회해야 하므로 O(n)입니다.

```text
cur = head
cur의 next가 NULL이 아닌 동안: cur = cur의 next    ← 마지막 노드에서 멈춘다
cur의 next = 새 노드
```

빈 리스트라면 마지막 노드가 없으므로 head에 새 노드를 넣는 **특별한 경우**를 따로 처리해야 합니다. 이런 빈 리스트 처리를 빼먹는 것이 연결 리스트에서 가장 흔한 버그입니다.

> **참고**: 마지막 노드의 주소를 담는 `tail` 변수를 따로 두면 맨 뒤 삽입도 O(1)이 됩니다. 연결 리스트로 큐를 만들 때 이 방법을 씁니다(도전 문제 1).

### 4.4 삭제: 앞 노드의 next를 건너뛰게 바꾼다

값이 20인 노드를 지우려면 **20의 바로 앞 노드(10)** 의 next를 20의 다음(30)으로 바꿉니다.

```text
삭제 전:  [10]→[20]→[30]→NULL
               ↑ 지울 노드
10.next = 20.next
삭제 후:  [10]───────►[30]→NULL
              [20]  ← 이제 아무도 가리키지 않는다. C에서는 free해야 한다
```

단일 연결 리스트는 **뒤로만** 갈 수 있으므로, 지울 노드를 찾은 뒤에는 앞 노드로 돌아갈 수 없습니다. 그래서 순회할 때 **앞 노드(prev)를 함께 기억**합니다. 지울 노드가 head라면 앞 노드가 없으므로 head를 바꾸는 특별한 경우가 됩니다.

### 4.5 누가 노드를 치우는가

- **C**: `malloc`으로 만든 노드는 프로그래머가 `free`해야 합니다. 삭제한 노드, 그리고 프로그램이 끝나기 전 남은 모든 노드를 해제해야 합니다.
- **Python**: 아무도 가리키지 않는 객체는 인터프리터가 자동으로 회수합니다(가비지 컬렉션).
- **Rust**: 노드는 앞 노드의 `next`가 **소유**합니다. 소유자가 사라지면 노드도 자동으로 해제됩니다. `free`를 부르지 않아도 되고, 두 번 해제하거나 해제한 노드를 쓰는 실수도 컴파일러가 막습니다.

## 5. C로 구현하기

C 구현은 가장 길지만, 연결 리스트의 모든 동작이 눈에 보입니다. 함수마다 "연결을 어떤 순서로 바꾸는가"에 집중해서 읽으세요.

```c
// 파일: linked_list.c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node {
    int value;
    struct Node *next;          // 다음 노드의 주소 (없으면 NULL)
} Node;

Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    node->value = value;
    node->next = NULL;
    return node;
}

void push_front(Node **head, int value) {
    Node *node = create_node(value);
    node->next = *head;         // ① 새 노드가 기존 첫 노드를 가리키고
    *head = node;               // ② head가 새 노드를 가리킨다
}

void push_back(Node **head, int value) {
    Node *node = create_node(value);
    if (*head == NULL) {        // 빈 리스트: 새 노드가 곧 head
        *head = node;
        return;
    }
    Node *cur = *head;
    while (cur->next != NULL) { // 마지막 노드에서 멈춘다
        cur = cur->next;
    }
    cur->next = node;
}

Node *find(Node *head, int value) {
    for (Node *cur = head; cur != NULL; cur = cur->next) {
        if (cur->value == value) {
            return cur;
        }
    }
    return NULL;
}

void insert_after(Node *prev, int value) {
    Node *node = create_node(value);
    node->next = prev->next;    // ① 새 노드가 prev의 다음을 가리키고
    prev->next = node;          // ② prev가 새 노드를 가리킨다
}

bool remove_value(Node **head, int value) {
    Node *prev = NULL;
    Node *cur = *head;
    while (cur != NULL && cur->value != value) {
        prev = cur;
        cur = cur->next;
    }
    if (cur == NULL) {
        return false;           // 찾지 못함
    }
    if (prev == NULL) {
        *head = cur->next;      // 첫 노드를 지우는 경우
    } else {
        prev->next = cur->next; // 앞 노드가 cur를 건너뛴다
    }
    free(cur);
    return true;
}

int length(const Node *head) {
    int count = 0;
    for (const Node *cur = head; cur != NULL; cur = cur->next) {
        count++;
    }
    return count;
}

void print_list(const Node *head) {
    for (const Node *cur = head; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL (길이 %d)\n", length(head));
}

int free_list(Node **head) {
    int freed = 0;
    Node *cur = *head;
    while (cur != NULL) {
        Node *next = cur->next; // 해제하기 전에 다음 주소를 저장
        free(cur);
        cur = next;
        freed++;
    }
    *head = NULL;               // 해제된 주소를 남겨 두지 않는다
    return freed;
}

int main(void) {
    Node *head = NULL;          // 빈 리스트
    print_list(head);

    push_back(&head, 20);
    push_back(&head, 40);
    push_front(&head, 10);
    print_list(head);

    Node *twenty = find(head, 20);
    if (twenty != NULL) {
        insert_after(twenty, 30);
    }
    push_back(&head, 50);
    print_list(head);

    printf("find(99) -> %s\n", find(head, 99) ? "찾음" : "NULL");

    remove_value(&head, 10);    // 첫 노드
    remove_value(&head, 30);    // 가운데 노드
    remove_value(&head, 50);    // 마지막 노드
    print_list(head);
    printf("remove(77) -> %s\n", remove_value(&head, 77) ? "삭제" : "없음");

    printf("해제한 노드 수: %d\n", free_list(&head));
    print_list(head);
    return 0;
}
```

실행 결과:

```text
NULL (길이 0)
10 -> 20 -> 40 -> NULL (길이 3)
10 -> 20 -> 30 -> 40 -> 50 -> NULL (길이 5)
find(99) -> NULL
20 -> 40 -> NULL (길이 2)
remove(77) -> 없음
해제한 노드 수: 2
NULL (길이 0)
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct Node { ... struct Node *next; } Node;` | 구조체 안에서 자기 자신의 타입을 가리키는 포인터를 둡니다(**자기 참조 구조체**). typedef가 끝나기 전이라 `Node *next`로는 쓸 수 없고 `struct Node *next`로 써야 합니다.                       |
| `malloc(sizeof *node)`                                 | `node`가 가리킬 대상의 크기만큼 힙 메모리를 요청합니다. `sizeof(Node)`와 같지만, 타입 이름을 바꿔도 이 줄은 고칠 필요가 없어 안전합니다. 실패하면 NULL이 돌아오므로 검사합니다.               |
| `void push_front(Node **head, int value)`              | **포인터의 포인터**입니다. head 변수 자체를 바꿔야 하므로 head의 **주소**를 받습니다. `Node *head`로 받으면 복사본만 바뀌고 main의 head는 그대로입니다. 호출은 `push_front(&head, 10)`입니다. |
| `*head = node;`                                        | `head`가 가리키는 곳, 즉 main의 head 변수에 새 노드 주소를 씁니다.                                                                                                                            |
| `while (cur->next != NULL)`                            | `cur != NULL`이 아니라 `cur->next != NULL`입니다. **마지막 노드에서 멈춰야** 그 노드의 next를 바꿀 수 있습니다. 순회 조건의 이 작은 차이를 꼭 구별하세요.                                     |
| `void insert_after(Node *prev, ...)`                   | prev 노드 자체는 그대로이고 **prev가 가리키는 노드의 멤버**만 바꾸므로 `Node *`로 충분합니다. head가 바뀔 일이 없기 때문입니다.                                                               |
| `while (cur != NULL && cur->value != value)`           | `&&`의 **단축 평가** 덕분에 cur가 NULL이면 `cur->value`를 읽지 않습니다. 순서를 바꾸면 NULL을 역참조합니다.                                                                                   |
| `if (prev == NULL) *head = cur->next;`                 | 지울 노드가 첫 노드면 앞 노드가 없으므로 head를 바꿉니다. 가운데·마지막 노드는 `prev->next`를 바꿉니다. 마지막 노드를 지우면 `cur->next`가 NULL이라 prev가 새 마지막 노드가 됩니다.           |
| `Node *next = cur->next; free(cur); cur = next;`       | `free` 뒤에는 cur가 가리키던 메모리를 읽으면 안 됩니다. 그래서 다음 주소를 **먼저** 저장합니다(실습의 디버그 문제).                                                                           |
| `*head = NULL;`                                        | 해제된 주소를 head에 남겨 두면(**매달린 포인터**, dangling pointer) 나중에 실수로 쓸 수 있습니다. NULL로 바꿔 빈 리스트로 만듭니다. 그래서 마지막 줄에서 빈 리스트가 출력됩니다.              |

> **오류 주의**: `main`이 끝나기 전에 `free_list`를 부르지 않으면 노드들이 해제되지 않습니다. 이 작은 프로그램은 곧 끝나서 운영체제가 메모리를 회수하지만, 오래 실행되는 프로그램에서 반복하면 메모리가 계속 쌓이는 **메모리 누수**가 됩니다. 리눅스에서는 `valgrind ./a.out` 같은 도구로 누수를 확인할 수 있습니다.

> **참고**: `const Node *head`는 "이 함수는 노드의 내용을 바꾸지 않는다"는 약속입니다. `length`와 `print_list`는 읽기만 하므로 const를 붙였습니다.

## 6. Python으로 구현하기

Python에는 포인터 문법이 없지만, **변수는 객체를 가리키는 참조**입니다(Day 31). `node.next = other`는 other 객체를 복사하는 것이 아니라 other를 가리키게 합니다. 그래서 C와 거의 같은 구조로 연결 리스트를 만들 수 있습니다.

```python
# 파일: linked_list.py
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next          # 다음 Node 객체 (없으면 None)


class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, value):
        self.head = Node(value, self.head)

    def push_back(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node
            return
        cur = self.head
        while cur.next is not None:
            cur = cur.next
        cur.next = node

    def find(self, value):
        cur = self.head
        while cur is not None:
            if cur.value == value:
                return cur
            cur = cur.next
        return None

    def insert_after(self, prev, value):
        prev.next = Node(value, prev.next)

    def remove(self, value):
        prev, cur = None, self.head
        while cur is not None and cur.value != value:
            prev, cur = cur, cur.next
        if cur is None:
            return False
        if prev is None:
            self.head = cur.next
        else:
            prev.next = cur.next
        return True

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def __len__(self):
        return sum(1 for _ in self)

    def __str__(self):
        return "".join(f"{v} -> " for v in self) + f"None (길이 {len(self)})"


lst = LinkedList()
print(lst)

lst.push_back(20)
lst.push_back(40)
lst.push_front(10)
print(lst)

twenty = lst.find(20)
if twenty is not None:
    lst.insert_after(twenty, 30)
lst.push_back(50)
print(lst)

print("find(99) ->", lst.find(99))

lst.remove(10)
lst.remove(30)
lst.remove(50)
print(lst)
print("remove(77) ->", "삭제" if lst.remove(77) else "없음")

print("list로 변환:", list(lst), "합계:", sum(lst))
```

실행 결과:

```text
None (길이 0)
10 -> 20 -> 40 -> None (길이 3)
10 -> 20 -> 30 -> 40 -> 50 -> None (길이 5)
find(99) -> None
20 -> 40 -> None (길이 2)
remove(77) -> 없음
list로 변환: [20, 40] 합계: 60
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `def __init__(self, value, next=None):`   | `next=None`은 **기본값 매개변수**입니다. `Node(10)`처럼 부르면 next는 None이 됩니다. (`next`는 Python 내장 함수 이름이기도 하지만, 매개변수 이름으로 쓰는 것은 흔하고 괜찮습니다.) |
| `self.head = Node(value, self.head)`      | 오른쪽이 **먼저** 계산됩니다. 기존 head를 next로 가진 새 노드를 만든 뒤 head에 넣으므로 C의 ①② 순서가 한 줄에 들어 있습니다.                                                       |
| `if self.head is None:`                   | None과 비교할 때는 `==` 대신 `is`를 씁니다. "같은 객체인가?"를 묻는 연산자이며, None은 프로그램에 하나뿐인 객체입니다.                                                             |
| `prev, cur = cur, cur.next`               | 오른쪽의 두 값을 먼저 모두 계산한 뒤 왼쪽에 동시에 넣습니다. prev와 cur를 한 칸씩 함께 전진시키는 관용구입니다.                                                                    |
| `def __iter__(self): ... yield cur.value` | `yield`가 있는 함수는 **제너레이터**가 되어 값을 하나씩 내줍니다. 이 메서드 덕분에 `for v in lst`, `list(lst)`, `sum(lst)`를 쓸 수 있습니다.                                       |
| `sum(1 for _ in self)`                    | 원소마다 1을 더해 개수를 셉니다. 연결 리스트는 길이를 저장하지 않으면 이렇게 O(n)으로 세야 합니다.                                                                                 |
| `lst.remove(10)` 뒤 노드 10               | 아무도 가리키지 않게 된 노드는 Python이 자동으로 회수합니다. C의 `free`에 해당하는 코드가 없습니다.                                                                                |

> **TIP**: Python의 내장 `list`는 이름과 달리 연결 리스트가 아니라 **동적 배열**입니다. 연결 리스트를 직접 만드는 것은 원리를 배우기 위해서이고, 실무에서 양쪽 끝 삽입·삭제가 필요하면 `collections.deque`를 씁니다.

## 7. Rust로 구현하기

Rust의 연결 리스트는 **소유권**으로 설명됩니다. 각 노드는 다음 노드를 `Box`로 **소유**합니다. `Box<Node>`는 힙에 있는 Node 하나를 가리키는 소유 포인터이고(Day 41), 다음 노드가 없을 수도 있으므로 `Option`으로 감쌉니다.

```text
head: Option<Box<Node>>
        └── Some(Box) ──► Node { value: 10, next: Some(Box) ──► Node { value: 20, next: None } }
```

```rust
// 파일: linked_list.rs
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

struct LinkedList {
    head: Option<Box<Node>>,
}

impl LinkedList {
    fn new() -> Self {
        LinkedList { head: None }
    }

    fn push_front(&mut self, value: i32) {
        let node = Box::new(Node { value, next: self.head.take() });
        self.head = Some(node);
    }

    fn push_back(&mut self, value: i32) {
        let mut cur = &mut self.head;       // "다음 노드를 담는 칸"을 가리킨다
        while let Some(node) = cur {
            cur = &mut node.next;
        }
        *cur = Some(Box::new(Node { value, next: None }));
    }

    fn contains(&self, value: i32) -> bool {
        let mut cur = self.head.as_deref();
        while let Some(node) = cur {
            if node.value == value {
                return true;
            }
            cur = node.next.as_deref();
        }
        false
    }

    fn insert_after(&mut self, target: i32, value: i32) -> bool {
        let mut cur = self.head.as_deref_mut();
        while let Some(node) = cur {
            if node.value == target {
                let new_node = Box::new(Node { value, next: node.next.take() });
                node.next = Some(new_node);
                return true;
            }
            cur = node.next.as_deref_mut();
        }
        false
    }

    fn remove(&mut self, value: i32) -> bool {
        let mut cur = &mut self.head;
        loop {
            match cur {
                None => return false,
                Some(node) if node.value == value => {
                    *cur = node.next.take();    // 이 칸이 다음 노드를 직접 담는다
                    return true;
                }
                Some(node) => cur = &mut node.next,
            }
        }
    }

    fn len(&self) -> usize {
        let mut count = 0;
        let mut cur = self.head.as_deref();
        while let Some(node) = cur {
            count += 1;
            cur = node.next.as_deref();
        }
        count
    }

    fn print(&self) {
        let mut cur = self.head.as_deref();
        while let Some(node) = cur {
            print!("{} -> ", node.value);
            cur = node.next.as_deref();
        }
        println!("None (길이 {})", self.len());
    }
}

impl Drop for LinkedList {
    fn drop(&mut self) {
        let mut cur = self.head.take();
        let mut freed = 0;
        while let Some(mut node) = cur {
            cur = node.next.take();         // 다음 노드를 먼저 떼어 내고
            freed += 1;                     // node는 여기서 해제된다
        }
        println!("drop: 노드 {}개 해제", freed);
    }
}

fn main() {
    let mut list = LinkedList::new();
    list.print();

    list.push_back(20);
    list.push_back(40);
    list.push_front(10);
    list.print();

    list.insert_after(20, 30);
    list.push_back(50);
    list.print();

    println!("contains(99) -> {}", list.contains(99));

    list.remove(10);
    list.remove(30);
    list.remove(50);
    list.print();
    println!("remove(77) -> {}", if list.remove(77) { "삭제" } else { "없음" });
    println!("main 끝");
}
```

실행 결과:

```text
None (길이 0)
10 -> 20 -> 40 -> None (길이 3)
10 -> 20 -> 30 -> 40 -> 50 -> None (길이 5)
contains(99) -> false
20 -> 40 -> None (길이 2)
remove(77) -> 없음
main 끝
drop: 노드 2개 해제
```

### 코드 한 부분씩 읽기

| 코드                                                                | 설명                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next: Option<Box<Node>>`                                           | `Node` 안에 `Node`를 바로 넣으면 크기가 무한해져 컴파일되지 않습니다. `Box`는 크기가 고정된 포인터이므로 자기 참조 구조를 만들 수 있습니다. C의 `struct Node *next`에 해당합니다.                                                                        |
| `next: self.head.take()`                                            | 기존 리스트의 소유권을 **꺼내서** 새 노드에게 줍니다. head 자리에는 잠시 None이 남고, 다음 줄에서 새 노드가 들어갑니다.                                                                                                                                  |
| `let mut cur = &mut self.head;`                                     | cur는 노드가 아니라 **"노드를 담는 칸"(`&mut Option<Box<Node>>`)** 을 가리킵니다. 처음에는 head 칸, 그다음은 각 노드의 next 칸입니다. 칸을 가리키면 빈 칸(None)을 만났을 때 거기에 바로 새 노드를 넣을 수 있습니다.                                      |
| `*cur = Some(Box::new(...));`                                       | 마지막으로 가리킨 빈 칸에 새 노드를 넣습니다. **빈 리스트면 cur가 head 칸이므로** C처럼 빈 리스트를 따로 처리할 필요가 없습니다.                                                                                                                         |
| `self.head.as_deref()`                                              | `Option<Box<Node>>`를 빌려서 `Option<&Node>`로 바꿉니다. 읽기만 하는 순회에 씁니다. `as_deref_mut()`는 수정 가능한 `Option<&mut Node>`를 줍니다.                                                                                                         |
| `Some(node) if node.value == value => { *cur = node.next.take(); }` | 지울 노드를 담은 칸에 **그 노드의 다음 노드**를 넣습니다. 칸에 있던 노드는 덮어써지면서 자동으로 해제됩니다. C의 prev 없이도 삭제할 수 있는 이유는 cur가 "앞 노드의 next 칸"을 가리키기 때문입니다.                                                      |
| `impl Drop for LinkedList`                                          | 리스트가 사라질 때 자동으로 호출되는 코드입니다. 이 코드가 없어도 노드들은 해제되지만, 기본 방식은 노드가 다음 노드를 **재귀적으로** 해제하므로 수십만 개짜리 리스트에서는 호출 스택이 넘칠 수 있습니다. 반복문으로 하나씩 해제하도록 직접 구현했습니다. |
| `println!("main 끝");` 다음의 `drop: ...`                           | `list` 변수는 main이 끝날 때 범위를 벗어나고, 그 순간 `drop`이 불립니다. 출력 순서로 해제 시점을 확인할 수 있습니다. C의 `free_list`를 컴파일러가 알아서 불러 준 셈입니다.                                                                               |

> **참고**: Rust로 연결 리스트를 만드는 일은 초보자에게 어렵기로 유명합니다. 소유권 규칙은 "한 노드를 두 곳에서 동시에 소유하는 것"을 막기 때문에, 이중 연결 리스트(Day 62)처럼 앞뒤로 서로 가리키는 구조는 더 복잡한 도구가 필요합니다. 실무에서는 표준 `std::collections::LinkedList`나 `VecDeque`를 씁니다. 오늘 코드는 소유권이 **노드에서 노드로 사슬처럼 이어지는 모습**을 이해하는 데 목적이 있습니다.

## 8. 실행 추적

세 프로그램이 공통으로 하는 작업 중 **삭제 세 번**을 C 기준으로 따라갑니다. 시작은 `10 → 20 → 30 → 40 → 50`입니다.

| 연산       | prev | cur  | 바꾸는 연결                            | 결과                |
| ---------- | ---- | ---- | -------------------------------------- | ------------------- |
| remove(10) | NULL | 10   | `head = 10.next` (head가 20으로)       | `20 → 30 → 40 → 50` |
| remove(30) | 20   | 30   | `20.next = 30.next` (20이 40을 가리킴) | `20 → 40 → 50`      |
| remove(50) | 40   | 50   | `40.next = 50.next` (NULL)             | `20 → 40`           |
| remove(77) | 40   | NULL | 없음 → false                           | `20 → 40`           |

세 경우(첫 노드, 가운데 노드, 마지막 노드)가 모두 다른 모양처럼 보이지만, C 코드는 `prev == NULL`인 경우만 따로 처리합니다. 마지막 노드도 "prev의 next를 cur의 next로 바꾼다"는 같은 규칙에 들어갑니다. cur의 next가 NULL일 뿐입니다.

## 9. 다른 예제로 다시 이해하기

연결 리스트를 **뒤집는** 문제는 포인터 조작 연습의 대표 문제입니다. `1 → 2 → 3 → NULL`을 `3 → 2 → 1 → NULL`로 바꾸되, 새 노드를 만들지 않고 **화살표 방향만** 바꿉니다. 핵심은 포인터 세 개입니다. prev는 이미 뒤집은 부분의 첫 노드, cur는 지금 방향을 바꿀 노드, next는 방향을 바꾸기 전에 저장해 둔 다음 노드입니다. cur의 화살표를 prev 쪽으로 돌리면 cur의 원래 다음 노드와 연결이 끊기므로, 그 전에 next에 저장해야 합니다.

```text
시작      prev=NULL   cur=1→2→3→NULL
1회 후    NULL←1      cur=2→3→NULL      (prev=1)
2회 후    NULL←1←2    cur=3→NULL        (prev=2)
3회 후    NULL←1←2←3  cur=NULL          (prev=3)  → 새 head는 prev
```

### C 버전

```c
// 파일: reverse.c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *reverse(Node *head) {
    Node *prev = NULL;
    Node *cur = head;
    while (cur != NULL) {
        Node *next = cur->next;     // ① 다음 노드를 저장하고
        cur->next = prev;           // ② 화살표를 뒤로 돌리고
        prev = cur;                 // ③ prev와 cur를 한 칸씩 전진
        cur = next;
    }
    return prev;                    // 마지막으로 처리한 노드가 새 head
}

void print_list(const Node *head) {
    for (const Node *cur = head; cur != NULL; cur = cur->next) {
        printf("%d -> ", cur->value);
    }
    printf("NULL\n");
}

int main(void) {
    Node *head = NULL;
    for (int v = 5; v >= 1; v--) {          // 1 -> 2 -> 3 -> 4 -> 5
        Node *node = malloc(sizeof *node);
        if (node == NULL) {
            return 1;
        }
        node->value = v;
        node->next = head;
        head = node;
    }
    print_list(head);
    head = reverse(head);
    print_list(head);

    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
```

실행 결과:

```text
1 -> 2 -> 3 -> 4 -> 5 -> NULL
5 -> 4 -> 3 -> 2 -> 1 -> NULL
```

### Python 버전

```python
# 파일: reverse.py
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next


def reverse(head):
    prev, cur = None, head
    while cur is not None:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev


def to_str(head):
    parts = []
    while head is not None:
        parts.append(str(head.value))
        head = head.next
    return " -> ".join(parts) + " -> None"


head = None
for v in range(5, 0, -1):
    head = Node(v, head)
print(to_str(head))
print(to_str(reverse(head)))
```

실행 결과:

```text
1 -> 2 -> 3 -> 4 -> 5 -> None
5 -> 4 -> 3 -> 2 -> 1 -> None
```

Python 버전은 다음 노드를 `nxt`에 저장했습니다. `next`는 매개변수 이름으로는 괜찮지만, 함수 안에서 지역 변수로 쓰면 내장 함수 `next()`를 가리게 되므로 피하는 편이 좋습니다.

### Rust 버전

```rust
// 파일: reverse.rs
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

fn reverse(head: Option<Box<Node>>) -> Option<Box<Node>> {
    let mut prev: Option<Box<Node>> = None;
    let mut cur = head;
    while let Some(mut node) = cur {
        cur = node.next.take();     // ① 다음 노드를 떼어 내고
        node.next = prev;           // ② 화살표를 뒤로 돌리고
        prev = Some(node);          // ③ 이 노드가 뒤집힌 부분의 첫 노드
    }
    prev
}

fn to_string(head: &Option<Box<Node>>) -> String {
    let mut parts = Vec::new();
    let mut cur = head.as_deref();
    while let Some(node) = cur {
        parts.push(node.value.to_string());
        cur = node.next.as_deref();
    }
    parts.join(" -> ") + " -> None"
}

fn main() {
    let mut head: Option<Box<Node>> = None;
    for v in (1..=5).rev() {
        head = Some(Box::new(Node { value: v, next: head }));
    }
    println!("{}", to_string(&head));
    let head = reverse(head);
    println!("{}", to_string(&head));
}
```

실행 결과:

```text
1 -> 2 -> 3 -> 4 -> 5 -> None
5 -> 4 -> 3 -> 2 -> 1 -> None
```

Rust 버전의 `reverse`는 리스트의 **소유권을 통째로 받아서** 뒤집은 리스트의 소유권을 돌려줍니다. `while let Some(mut node) = cur`에서 cur의 노드를 꺼내 `node`가 소유하고, `node.next.take()`로 다음 노드를 떼어 낸 뒤 방향을 바꿉니다. C 버전과 단계가 정확히 같지만, 어느 순간에도 노드를 두 곳에서 소유하지 않는다는 점이 다릅니다. 그래서 컴파일러가 "노드를 잃어버리거나 두 번 해제하는 실수"가 없다고 보증합니다. `main`의 `head = Some(Box::new(Node { value: v, next: head }))`는 오른쪽의 `head`를 새 노드 안으로 옮긴 뒤 새 노드를 다시 `head`에 넣는 맨 앞 삽입입니다.

## 10. 시간·공간 복잡도

| 연산                       | 배열(동적 배열) | 단일 연결 리스트         |
| -------------------------- | --------------- | ------------------------ |
| k번째 원소 읽기            | **O(1)**        | O(k)                     |
| 맨 앞 삽입·삭제            | O(n)            | **O(1)**                 |
| 맨 뒤 삽입                 | 상각 O(1)       | O(n) (tail을 두면 O(1))  |
| 위치를 아는 노드 뒤에 삽입 | O(n)            | **O(1)**                 |
| 값 검색                    | O(n)            | O(n)                     |
| 원소당 추가 공간           | 없음            | 포인터 1개(보통 8바이트) |
| 메모리 배치                | 연속            | 흩어짐                   |

> **참고**: 표에서는 연결 리스트가 삽입·삭제에 강해 보이지만, 실제 컴퓨터에서는 배열이 더 빠른 경우가 많습니다. CPU는 연속된 메모리를 한꺼번에 읽어 오는 **캐시**를 쓰기 때문에, 흩어진 노드를 따라가는 연결 리스트는 캐시의 도움을 받기 어렵습니다. "위치를 이미 알고 있는 곳에 자주 끼워 넣는다"는 조건이 있을 때 연결 리스트를 고려하세요.

## 11. 세 언어 비교

| 관점              | C                               | Python                  | Rust                                |
| ----------------- | ------------------------------- | ----------------------- | ----------------------------------- |
| 다음 노드         | `struct Node *next`             | `self.next` (객체 참조) | `next: Option<Box<Node>>`           |
| 끝 표시           | `NULL`                          | `None`                  | `None`                              |
| 노드 만들기       | `malloc` + NULL 검사            | `Node(value)`           | `Box::new(Node { .. })`             |
| head 바꾸는 함수  | `Node **head`를 받음            | `self.head`에 대입      | `&mut self`로 받음                  |
| 노드 해제         | `free`를 직접, 순서 주의        | 자동(가비지 컬렉션)     | 자동(소유자가 사라질 때), `Drop`    |
| 흔한 실수         | 해제 후 사용, 누수, NULL 역참조 | None에서 `.value` 접근  | 빌린 값에서 이동하려다 컴파일 오류  |
| 삭제에 prev 필요? | 필요 (또는 `Node **` 기법)      | 필요                    | 칸(`&mut Option`)을 가리키면 불필요 |

## 12. 자주 하는 실수

### 실수 1: 연결을 바꾸는 순서를 거꾸로 한다

```c
*head = node;           // head가 먼저 새 노드를 가리킨다
node->next = *head;     // 새 노드가 자기 자신을 가리킨다!
```

첫 줄에서 기존 리스트의 주소를 잃어버리고, 둘째 줄에서 새 노드가 자기 자신을 가리키는 **순환**이 생깁니다. 이 리스트를 순회하면 끝나지 않습니다. 연결을 바꿀 때는 "새로 연결할 쪽을 먼저"입니다.

### 실수 2: 빈 리스트를 처리하지 않는다

```c
Node *cur = *head;
while (cur->next != NULL) {     // head가 NULL이면 NULL->next!
    cur = cur->next;
}
```

빈 리스트에서 `push_back`을 하면 NULL을 역참조합니다. 본문 코드처럼 `*head == NULL`인 경우를 먼저 처리하세요. 연결 리스트 함수를 만들 때는 **빈 리스트, 노드 하나, 노드 여러 개** 세 경우를 모두 시험해 보는 습관을 들이세요.

### 실수 3: 해제한 노드를 읽는다

```c
for (Node *cur = head; cur != NULL; cur = cur->next) {
    free(cur);          // 반복의 끝에서 cur->next를 읽는다
}
```

`for`의 증가식 `cur = cur->next`는 `free(cur)` **다음에** 실행되므로 이미 반납한 메모리를 읽습니다. 이를 **use-after-free**라고 하며 정의되지 않은 동작입니다. 실습의 디버그 문제에서 고쳐 보세요.

### 실수 4: Python에서 None의 속성을 읽는다

```python
# 파일: none_next.py (실행 오류: AttributeError)
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next


head = Node(1, Node(2))
cur = head
while cur.next is not None:
    cur = cur.next
print(cur.next.value)       # 마지막 노드의 next는 None이다
```

```text
AttributeError: 'NoneType' object has no attribute 'value'
```

C에서 NULL을 역참조하는 실수와 같습니다. Python은 프로그램을 멈추고 어느 줄인지 알려 줍니다. `NoneType`이라는 말이 보이면 "None인 변수에서 무언가를 꺼내려 했다"는 뜻입니다.

### 실수 5: Rust에서 빌린 칸의 값을 그냥 옮기려 한다

```rust
// 파일: move_out.rs (컴파일 오류: E0507)
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

struct List {
    head: Option<Box<Node>>,
}

impl List {
    fn push_front(&mut self, value: i32) {
        let node = Box::new(Node { value, next: self.head });   // take() 없이
        self.head = Some(node);
    }
}

fn main() {
    let mut list = List { head: None };
    list.push_front(1);
    println!("{}", list.head.map(|n| n.value).unwrap_or(0));
}
```

```text
error[E0507]: cannot move out of `self.head` which is behind a mutable reference
```

`&mut self`는 리스트를 **빌린** 것이므로, 그 안의 head를 통째로 가져가면 빌려준 쪽에 빈 구멍이 생깁니다. Rust는 이것을 허용하지 않습니다. `self.head.take()`는 값을 꺼내면서 그 자리에 None을 **채워 넣으므로** 구멍이 생기지 않습니다. Rust 연결 리스트 코드에서 `take()`가 계속 나오는 이유입니다.

## 13. Q&A

**Q. C의 `Node **head`가 너무 어렵습니다. 꼭 써야 하나요?**

A. 다른 방법도 있습니다. 함수가 새 head를 **반환**하게 하고 호출할 때 `head = push_front(head, 10);`처럼 받는 방법입니다. 뒤집기 예제의 `reverse`가 이 방식입니다. 둘 다 흔히 쓰이지만, 반환값을 받는 것을 잊으면 버그가 되므로 `Node **` 방식도 익혀 두는 것이 좋습니다. "함수 안에서 호출한 쪽의 변수를 바꾸려면 그 변수의 주소를 받아야 한다"는 Day 43의 규칙과 같습니다.

**Q. C에서 prev 없이 삭제하는 방법이 있나요?**

A. 있습니다. Rust 코드처럼 "노드"가 아니라 "노드를 가리키는 포인터 변수"를 가리키는 `Node **link`로 순회하면 됩니다. `link`가 head를 가리키든 어떤 노드의 next를 가리키든 `*link = cur->next;` 한 줄로 삭제할 수 있어 첫 노드를 따로 처리하지 않아도 됩니다. 리누스 토르발스가 "좋은 취향의 코드"의 예로 들어 유명해진 기법입니다. 도전 문제 2에서 시도해 보세요.

**Q. 연결 리스트에 길이를 저장해 두면 안 되나요?**

A. 좋은 생각입니다. 리스트 구조체에 `size` 변수를 두고 삽입·삭제 때마다 갱신하면 길이를 O(1)에 알 수 있습니다. 다만 모든 삽입·삭제 함수에서 빠짐없이 갱신해야 하므로, 한 곳이라도 빼먹으면 실제 길이와 어긋납니다. 오늘은 원리를 보이려고 매번 셌습니다.

**Q. 끝에서 두 번째 노드를 찾으려면 어떻게 하나요?**

A. `cur->next->next != NULL`인 동안 전진하면 됩니다. 단, 노드가 하나 이하이면 `cur->next`가 NULL일 수 있으므로 먼저 확인해야 합니다. 또 다른 유명한 방법은 포인터 두 개를 한 칸 간격으로 함께 움직이는 것입니다. 이런 "두 포인터" 기법은 알고리즘 문제에서 자주 나옵니다.

## 14. 핵심 요약

- 연결 리스트는 **값 + 다음 노드의 주소**를 가진 노드를 이어서 순서를 만듭니다. 순서를 결정하는 것은 메모리 위치가 아니라 next입니다.
- **head**는 리스트의 입구이고, 마지막 노드의 next는 **NULL(None)** 입니다. 빈 리스트는 head가 NULL입니다.
- 순회는 별도의 변수 cur로 head부터 NULL까지 따라갑니다. head 자체를 움직이지 않습니다.
- 연결을 바꿀 때는 **새로 연결할 쪽을 먼저, 기존 연결을 끊는 쪽을 나중에** 합니다.
- 삭제는 **앞 노드의 next가 지울 노드를 건너뛰게** 하는 것입니다. 첫 노드를 지울 때는 head를 바꿉니다.
- C는 `malloc`과 `free`로 노드를 직접 관리하며, 해제하기 전에 다음 주소를 저장해야 합니다. Python은 자동으로 회수하고, Rust는 소유자가 사라질 때 해제합니다.
- Rust에서는 `Option<Box<Node>>`, `take()`, `as_deref()`가 연결 리스트의 기본 도구입니다.
- 뒤집기는 prev, cur, next 세 포인터로 화살표 방향을 하나씩 바꾸는 알고리즘입니다.

## 15. 도전 문제

1. **(C)** head와 함께 tail(마지막 노드) 포인터를 가진 `typedef struct { Node *head; Node *tail; int size; } List;`를 만들고, 맨 뒤 삽입을 O(1)로 바꿔 보세요. 이것으로 **연결 리스트 큐**(enqueue는 tail, dequeue는 head)를 완성하세요.
2. **(C)** `remove_value`를 prev 없이 `Node **link`만으로 다시 작성해 보세요. 첫 노드를 따로 처리하는 if 문이 사라지는지 확인하세요.
3. **(Python)** 두 개의 **정렬된** 연결 리스트를 받아 하나의 정렬된 리스트로 합치는 `merge(a, b)`를 작성하세요. 새 노드를 만들지 말고 next만 다시 연결하세요. Day 74의 병합 정렬에서 다시 만납니다.
4. **(Rust)** `LinkedList`에 `pop_front(&mut self) -> Option<i32>`와, 값을 순서대로 빌려주는 `iter(&self)`를 만들어 `for v in list.iter()`가 동작하게 해 보세요. 힌트: `struct Iter<'a> { cur: Option<&'a Node> }`와 `impl<'a> Iterator for Iter<'a>`.
