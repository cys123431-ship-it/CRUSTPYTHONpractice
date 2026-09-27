---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-62-doubly-linked
courseId: crp-92
phaseId: phase-06
dayNumber: 62
date: "2026-12-01"
title: 이중 연결 리스트 — 앞뒤로 이어진 노드와 불변식
summary: 노드가 next와 prev를 함께 가지면 양쪽으로 이동하고, 위치를 아는 노드를 O(1)에 삭제할 수 있습니다. C에서는 head·tail과 불변식 검사 함수로, Python에서는 더미(sentinel) 노드로, Rust에서는 인덱스로 연결하는 방식과 Rc·Weak 방식으로 구현합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-61-linked-list]
learningObjectives:
  - 이중 연결 리스트의 불변식(a.next가 b이면 b.prev는 a)을 설명하고 코드로 검사한다.
  - 노드 사이에 삽입할 때 바꿔야 하는 연결 네 개와 그 순서를 추적한다.
  - 더미 노드가 빈 리스트와 양 끝의 특별한 경우를 없애는 원리를 설명한다.
  - C로 head·tail을 가진 이중 연결 리스트를 구현하고 모든 노드를 해제한다.
  - Rust에서 인덱스 기반 연결과 Rc·Weak 연결의 차이, 그리고 Rc 순환이 누수를 만드는 이유를 설명한다.
concepts:
  [
    doubly linked list,
    prev pointer,
    invariant,
    sentinel node,
    arena,
    Rc,
    Weak,
    reference cycle,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dlist.py — 더미 노드를 쓰는 이중 연결 리스트를 실행해 보세요.
  class Node:
      def __init__(self, value=None):
          self.value = value
          self.prev = self
          self.next = self


  sentinel = Node()


  def insert_between(value, left, right):
      node = Node(value)
      node.prev, node.next = left, right
      left.next = node
      right.prev = node
      return node


  for v in [10, 20, 30]:
      insert_between(v, sentinel.prev, sentinel)   # 맨 뒤에 넣기

  cur = sentinel.next
  while cur is not sentinel:
      print(cur.value, end=" <-> ")
      cur = cur.next
  print("(끝)")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day62-predict-c
    title: prev와 next 섞어 따라가기
    kind: predict
    objective: 두 방향 포인터를 번갈아 따라가며 도착하는 노드를 추적한다.
    prompt: 출력될 세 숫자를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      typedef struct Node {
          int value;
          struct Node *prev;
          struct Node *next;
      } Node;

      int main(void) {
          Node a = {1, NULL, NULL}, b = {2, NULL, NULL}, c = {3, NULL, NULL};
          a.next = &b; b.prev = &a;
          b.next = &c; c.prev = &b;

          Node *p = &a;
          p = p->next->next;
          int first = p->value;
          p = p->prev;
          int second = p->value;
          printf("%d %d %d\n", first, second, p->prev->next->next->value);
          return 0;
      }
    answer: "3 2 3"
    hint: "a에서 next를 두 번 따라가면 c입니다. c의 prev는 b입니다. 마지막 식은 b에서 prev(a), next(b), next(c)입니다."
    explanation: "p는 a → b → c로 가서 3, c.prev로 돌아와 b에서 2입니다. p->prev->next->next는 b → a → b → c이므로 3입니다. 이중 연결 리스트에서는 앞뒤로 자유롭게 움직일 수 있습니다."
    commonMistakes:
      - "prev를 따라가면 처음(a)으로 바로 간다고 생각함"
      - "마지막 식에서 화살표 개수를 세지 않고 b의 값을 적음"
    language: c
    verification: run
  - id: ex-day62-predict-py
    title: 더미 노드로 끝 알아내기
    kind: predict
    objective: 원형으로 이어진 더미 노드 구조에서 순회가 멈추는 조건을 이해한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      class Node:
          def __init__(self, value=None):
              self.value = value
              self.prev = self
              self.next = self


      s = Node()
      for v in "ABC":
          node = Node(v)
          node.prev, node.next = s.prev, s
          s.prev.next = node
          s.prev = node

      back = []
      cur = s.prev
      while cur is not s:
          back.append(cur.value)
          cur = cur.prev
      print("".join(back), s.next.value, s.next.prev is s)
    answer: CBA A True
    hint: "s.prev는 항상 마지막 노드입니다. prev를 따라가면 뒤에서 앞으로 읽다가 더미 노드 s를 만나면 멈춥니다."
    explanation: "A, B, C를 차례로 맨 뒤에 넣었으므로 뒤에서부터 읽으면 CBA입니다. 더미의 next는 첫 노드 A이고, A의 prev는 더미입니다. 그래서 첫 노드도 '앞에 누군가 있는' 보통 노드처럼 다룰 수 있습니다."
    commonMistakes:
      - "while cur is not None으로 생각해 끝나지 않는다고 판단함"
      - "s.next가 마지막 노드라고 생각함"
    language: python
    verification: run
  - id: ex-day62-fill
    title: Rust 인덱스 리스트의 삭제 연결 채우기
    kind: fill
    objective: 삭제할 노드의 양옆 노드를 서로 잇는다.
    prompt: "remove의 빈칸 두 곳을 채우세요. 앞 노드의 next는 삭제할 노드의 next로, 뒤 노드의 prev는 삭제할 노드의 prev로 바뀌어야 합니다."
    starter: |-
      struct Node {
          value: char,
          prev: Option<usize>,
          next: Option<usize>,
      }

      fn remove(nodes: &mut Vec<Node>, head: &mut Option<usize>, i: usize) {
          let (p, n) = (nodes[i].prev, nodes[i].next);
          match p {
              Some(p) => nodes[p].next = _____,
              None => *head = n,
          }
          if let Some(n) = n {
              nodes[n].prev = _____;
          }
      }

      fn main() {
          let mut nodes = vec![
              Node { value: 'A', prev: None, next: Some(1) },
              Node { value: 'B', prev: Some(0), next: Some(2) },
              Node { value: 'C', prev: Some(1), next: None },
          ];
          let mut head = Some(0);
          remove(&mut nodes, &mut head, 1);
          let mut cur = head;
          while let Some(i) = cur {
              print!("{}", nodes[i].value);
              cur = nodes[i].next;
          }
          println!(" {:?}", nodes[2].prev);
      }
    answer: |-
      struct Node {
          value: char,
          prev: Option<usize>,
          next: Option<usize>,
      }

      fn remove(nodes: &mut Vec<Node>, head: &mut Option<usize>, i: usize) {
          let (p, n) = (nodes[i].prev, nodes[i].next);
          match p {
              Some(p) => nodes[p].next = n,
              None => *head = n,
          }
          if let Some(n) = n {
              nodes[n].prev = p;
          }
      }

      fn main() {
          let mut nodes = vec![
              Node { value: 'A', prev: None, next: Some(1) },
              Node { value: 'B', prev: Some(0), next: Some(2) },
              Node { value: 'C', prev: Some(1), next: None },
          ];
          let mut head = Some(0);
          remove(&mut nodes, &mut head, 1);
          let mut cur = head;
          while let Some(i) = cur {
              print!("{}", nodes[i].value);
              cur = nodes[i].next;
          }
          println!(" {:?}", nodes[2].prev);
      }
    output: "AC Some(0)"
    hint: "p와 n은 이미 Option<usize>로 꺼내 두었습니다. 그대로 넣으면 됩니다."
    explanation: "B를 지우면 A.next는 C(Some(2)), C.prev는 A(Some(0))가 됩니다. 순회 결과는 AC이고 C의 prev는 Some(0)입니다. 인덱스는 Copy 타입이라 소유권 걱정 없이 복사해 넣을 수 있습니다."
    commonMistakes:
      - "nodes[p].next = Some(i)처럼 지울 노드를 다시 가리키게 함"
      - "뒤 노드의 prev를 고치지 않아 거꾸로 순회할 때 B가 다시 나타남"
    language: rust
    verification: run
  - id: ex-day62-modify
    title: Python 더미 리스트에 insert_before 추가하기
    kind: modify
    objective: 삽입 도우미 하나로 여러 삽입 연산을 만든다.
    prompt: "DList에 node 바로 앞에 value를 넣는 insert_before(node, value)를 추가하고, 그것을 써서 20 앞에 15를 넣으세요. 앞으로 읽기와 뒤로 읽기 결과가 서로 뒤집힌 관계여야 합니다."
    starter: |-
      class Node:
          def __init__(self, value=None):
              self.value = value
              self.prev = self
              self.next = self


      class DList:
          def __init__(self):
              self.s = Node()

          def _insert_between(self, value, left, right):
              node = Node(value)
              node.prev, node.next = left, right
              left.next = node
              right.prev = node
              return node

          def push_back(self, value):
              return self._insert_between(value, self.s.prev, self.s)

          def forward(self):
              out, cur = [], self.s.next
              while cur is not self.s:
                  out.append(cur.value)
                  cur = cur.next
              return out

          def backward(self):
              out, cur = [], self.s.prev
              while cur is not self.s:
                  out.append(cur.value)
                  cur = cur.prev
              return out


      d = DList()
      d.push_back(10)
      twenty = d.push_back(20)
      d.push_back(30)
      print(d.forward(), d.backward())
    answer: |-
      class Node:
          def __init__(self, value=None):
              self.value = value
              self.prev = self
              self.next = self


      class DList:
          def __init__(self):
              self.s = Node()

          def _insert_between(self, value, left, right):
              node = Node(value)
              node.prev, node.next = left, right
              left.next = node
              right.prev = node
              return node

          def push_back(self, value):
              return self._insert_between(value, self.s.prev, self.s)

          def insert_before(self, node, value):
              return self._insert_between(value, node.prev, node)

          def forward(self):
              out, cur = [], self.s.next
              while cur is not self.s:
                  out.append(cur.value)
                  cur = cur.next
              return out

          def backward(self):
              out, cur = [], self.s.prev
              while cur is not self.s:
                  out.append(cur.value)
                  cur = cur.prev
              return out


      d = DList()
      d.push_back(10)
      twenty = d.push_back(20)
      d.push_back(30)
      d.insert_before(twenty, 15)
      print(d.forward(), d.backward())
    output: "[10, 15, 20, 30] [30, 20, 15, 10]"
    hint: "node 앞에 넣는다는 것은 node.prev와 node 사이에 넣는다는 뜻입니다."
    explanation: "더미 노드 덕분에 모든 노드에 prev가 있으므로 insert_before는 한 줄입니다. 맨 앞에 넣고 싶으면 insert_before(첫 노드, v), 맨 뒤는 insert_before(더미, v)와 같습니다."
    commonMistakes:
      - "_insert_between(value, node, node.next)로 써서 뒤에 넣음"
      - "prev 연결을 고치지 않아 backward 결과에 15가 빠짐"
    language: python
    verification: run
  - id: ex-day62-debug
    title: C insert_after의 빠진 연결 고치기
    kind: debug
    objective: 불변식 검사로 한쪽 방향만 연결된 버그를 찾는다.
    prompt: "insert_after가 연결 네 개 중 하나를 빠뜨렸습니다. 앞으로 읽으면 멀쩡하지만 뒤로 읽으면 새 노드가 보이지 않습니다. check 함수가 OK를 출력하도록 고치세요."
    starter: |-
      #include <stdio.h>

      typedef struct Node {
          int value;
          struct Node *prev;
          struct Node *next;
      } Node;

      void insert_after(Node *pos, Node *node) {
          node->prev = pos;
          node->next = pos->next;
          pos->next = node;
      }

      const char *check(const Node *head) {
          for (const Node *cur = head; cur != NULL && cur->next != NULL; cur = cur->next) {
              if (cur->next->prev != cur) {
                  return "BROKEN";
              }
          }
          return "OK";
      }

      int main(void) {
          Node a = {1, NULL, NULL}, c = {3, NULL, NULL}, b = {2, NULL, NULL};
          a.next = &c; c.prev = &a;
          insert_after(&a, &b);
          printf("%d %d %s\n", a.next->value, c.prev->value, check(&a));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      typedef struct Node {
          int value;
          struct Node *prev;
          struct Node *next;
      } Node;

      void insert_after(Node *pos, Node *node) {
          node->prev = pos;
          node->next = pos->next;
          if (pos->next != NULL) {
              pos->next->prev = node;
          }
          pos->next = node;
      }

      const char *check(const Node *head) {
          for (const Node *cur = head; cur != NULL && cur->next != NULL; cur = cur->next) {
              if (cur->next->prev != cur) {
                  return "BROKEN";
              }
          }
          return "OK";
      }

      int main(void) {
          Node a = {1, NULL, NULL}, c = {3, NULL, NULL}, b = {2, NULL, NULL};
          a.next = &c; c.prev = &a;
          insert_after(&a, &b);
          printf("%d %d %s\n", a.next->value, c.prev->value, check(&a));
          return 0;
      }
    output: "2 2 OK"
    starterOutput: "2 1 BROKEN"
    hint: "새 노드 뒤에 오는 노드(원래 pos->next)의 prev도 새 노드를 가리켜야 합니다. pos->next를 바꾸기 전에 해야 합니다."
    explanation: "원래 코드는 c.prev가 계속 a를 가리켜 '2 1 BROKEN'을 출력합니다. pos->next->prev = node를 pos->next = node보다 먼저 실행해야 합니다. 순서가 바뀌면 pos->next가 이미 새 노드라서 새 노드의 prev를 자기 자신으로 만들게 됩니다."
    commonMistakes:
      - "pos->next->prev = node를 pos->next = node 다음에 써서 node->prev가 node 자신이 됨"
      - "pos가 마지막 노드일 때 pos->next가 NULL인 경우를 검사하지 않음"
    language: c
    verification: run
  - id: ex-day62-independent
    title: Rust 인덱스 리스트를 뒤에서부터 출력하기
    kind: independent
    objective: tail에서 prev를 따라가는 역방향 순회를 구현한다.
    prompt: "push_back으로 'x', 'y', 'z'를 넣은 인덱스 기반 이중 연결 리스트를 만들고, tail에서 prev를 따라가며 zyx를 출력하세요. push_back은 새 노드의 prev를 이전 tail로, 이전 tail의 next를 새 노드로 연결해야 합니다."
    starter: |-
      struct Node {
          value: char,
          prev: Option<usize>,
          next: Option<usize>,
      }

      struct DList {
          nodes: Vec<Node>,
          head: Option<usize>,
          tail: Option<usize>,
      }

      fn main() {
          let list = DList { nodes: Vec::new(), head: None, tail: None };
          println!("{} {:?} {:?}", list.nodes.len(), list.head, list.tail);
      }
    answer: |-
      struct Node {
          value: char,
          prev: Option<usize>,
          next: Option<usize>,
      }

      struct DList {
          nodes: Vec<Node>,
          head: Option<usize>,
          tail: Option<usize>,
      }

      impl DList {
          fn push_back(&mut self, value: char) {
              let i = self.nodes.len();
              self.nodes.push(Node { value, prev: self.tail, next: None });
              match self.tail {
                  Some(t) => self.nodes[t].next = Some(i),
                  None => self.head = Some(i),
              }
              self.tail = Some(i);
          }

          fn backward(&self) -> String {
              let mut out = String::new();
              let mut cur = self.tail;
              while let Some(i) = cur {
                  out.push(self.nodes[i].value);
                  cur = self.nodes[i].prev;
              }
              out
          }
      }

      fn main() {
          let mut list = DList { nodes: Vec::new(), head: None, tail: None };
          for ch in ['x', 'y', 'z'] {
              list.push_back(ch);
          }
          println!("{} head={:?}", list.backward(), list.head);
      }
    output: "zyx head=Some(0)"
    hint: "새 노드의 인덱스는 push하기 전의 nodes.len()입니다. 빈 리스트였다면 head도 새 노드가 됩니다."
    explanation: "노드는 Vec의 0, 1, 2번에 저장되고 연결은 인덱스로 표현됩니다. tail(2)에서 prev를 따라 2 → 1 → 0으로 가므로 zyx가 됩니다. 인덱스는 소유권이 없는 단순한 숫자라서 앞뒤로 서로 가리켜도 빌림 문제가 생기지 않습니다."
    commonMistakes:
      - "이전 tail의 next를 갱신하지 않아 앞으로 순회하면 첫 노드만 보임"
      - "빈 리스트에서 head를 설정하지 않음"
    language: rust
    verification: run
quiz:
  - id: quiz-day62-01
    question: 이중 연결 리스트에서 항상 참이어야 하는 불변식은?
    choices:
      - 모든 노드의 value가 서로 다르다
      - a.next가 b이면 b.prev는 a이다
      - head.next는 항상 NULL이다
      - 노드 수는 항상 짝수이다
    answerIndex: 1
    explanation: 두 방향의 연결이 서로 맞아야 앞으로 읽든 뒤로 읽든 같은 리스트가 됩니다. 삽입·삭제 코드를 쓴 뒤 이 조건을 검사하는 함수를 돌려 보면 빠뜨린 연결을 바로 찾을 수 있습니다.
  - id: quiz-day62-02
    question: 노드 L과 R 사이에 새 노드 N을 넣을 때 바꿔야 하는 연결의 수는?
    choices: ["1개", "2개", "4개", "노드 수만큼"]
    answerIndex: 2
    explanation: N.prev = L, N.next = R, L.next = N, R.prev = N 네 개입니다. 단일 연결 리스트는 두 개(N.next, L.next)였습니다.
  - id: quiz-day62-03
    question: 가리키는 노드(포인터)를 이미 알고 있을 때, 그 노드를 삭제하는 시간 복잡도는?
    choices:
      - 단일·이중 연결 리스트 모두 O(1)
      - 단일은 O(n), 이중은 O(1)
      - 단일은 O(1), 이중은 O(n)
      - 둘 다 O(n)
    answerIndex: 1
    explanation: 단일 연결 리스트는 앞 노드를 찾으려고 head부터 다시 훑어야 합니다. 이중 연결 리스트는 node.prev로 앞 노드를 바로 알 수 있습니다.
  - id: quiz-day62-04
    question: 더미(sentinel) 노드를 쓰면 좋은 점은?
    choices:
      - 메모리를 덜 쓴다
      - 모든 실제 노드에 prev와 next가 항상 있어서 빈 리스트와 양 끝의 특별한 경우가 사라진다
      - 정렬이 자동으로 된다
      - 노드를 해제할 필요가 없어진다
    answerIndex: 1
    explanation: 더미 노드는 값을 담지 않지만 첫 노드의 앞, 마지막 노드의 뒤 역할을 합니다. 그래서 삽입과 삭제가 NULL 검사 없이 한 가지 코드로 처리됩니다. 대신 노드 하나만큼 메모리를 더 씁니다.
  - id: quiz-day62-05
    question: Rust에서 이중 연결 리스트의 next와 prev를 모두 Rc로 만들면 어떤 문제가 생기나요?
    choices:
      - 컴파일 오류가 난다
      - 서로를 강하게 가리키는 순환이 생겨 참조 개수가 0이 되지 않아 메모리가 해제되지 않는다
      - 실행이 느려진다
      - 값을 읽을 수 없게 된다
    answerIndex: 1
    explanation: Rc는 강한 참조가 0이 될 때 해제됩니다. 앞뒤 노드가 서로를 Rc로 붙잡고 있으면 영원히 0이 되지 않습니다. 그래서 한쪽(보통 prev)은 개수에 포함되지 않는 Weak를 씁니다.
---

## 1. 오늘 배울 내용

Day 61의 단일 연결 리스트는 **앞으로만** 갈 수 있었습니다. 노드를 삭제하려면 앞 노드를 알아야 해서, 순회하는 동안 prev를 따로 기억해야 했습니다. 오늘은 노드마다 **이전 노드의 주소(prev)** 까지 저장하는 **이중 연결 리스트(doubly linked list)** 를 배웁니다.

이번 수업의 흐름은 다음과 같습니다.

1. prev가 있으면 무엇이 쉬워지는지 확인합니다.
2. 이중 연결 리스트의 **불변식**을 정하고, 삽입할 때 바꾸는 **연결 네 개**의 순서를 익힙니다.
3. **C** 로 head와 tail을 가진 리스트를 만들고, 불변식을 자동으로 검사하는 함수도 함께 만듭니다.
4. **Python** 으로 **더미(sentinel) 노드**를 써서 특별한 경우가 없는 깔끔한 구현을 만듭니다.
5. **Rust** 에서는 앞뒤로 서로 가리키는 구조가 소유권과 어떻게 부딪치는지 보고, 두 가지 해결 방법(인덱스 연결, Rc와 Weak)을 비교합니다.
6. 응용으로 앞뒤로 이동하는 **음악 재생 목록**을 만듭니다.

## 2. 왜 prev가 필요한가

단일 연결 리스트로 다음 일을 해야 한다고 생각해 봅시다.

- **뒤에서부터 읽기**: next만 있으므로 불가능합니다. 끝까지 간 다음 돌아올 방법이 없습니다.
- **마지막 노드 삭제**: tail 포인터가 있어도 마지막 노드의 **앞 노드**를 찾으려면 head부터 다시 훑어야 합니다. O(n)입니다.
- **가리키고 있는 노드 삭제**: "이 노드를 지워 줘"라고 노드를 받아도, 앞 노드를 모르면 연결을 바꿀 수 없습니다.

prev가 있으면 세 가지가 모두 쉬워집니다. 노드에서 앞 노드로 **바로** 갈 수 있기 때문입니다. 그 대신 노드마다 포인터가 하나 더 필요하고, 삽입·삭제 때 **고쳐야 할 연결이 두 배**가 됩니다. 연결을 하나라도 빠뜨리면 앞으로 읽을 때와 뒤로 읽을 때 다른 리스트가 되는 까다로운 버그가 생깁니다. 그래서 오늘은 **불변식**을 특히 강조합니다.

이중 연결 리스트는 실제로 많이 쓰입니다. 브라우저의 방문 기록, 편집기의 커서 이동, 운영체제의 프로세스 목록, 그리고 가장 오래 쓰지 않은 항목을 버리는 **LRU 캐시**(Day 67 이후 도전 과제)가 대표적입니다.

## 3. 그림으로 이해하기

```text
          head                                           tail
           │                                              │
           ▼                                              ▼
        ┌──────┬────┬──────┐   ┌──────┬────┬──────┐   ┌──────┬────┬──────┐
 NULL ◄─┼ prev │ 10 │ next ┼──►│ prev │ 20 │ next ┼──►│ prev │ 30 │ next ┼─► NULL
        └──────┴────┴──────┘◄──┼──    └────┴──────┘◄──┼──    └────┴──────┘
```

- **head**: 첫 노드. `head->prev`는 NULL입니다.
- **tail**: 마지막 노드. `tail->next`는 NULL입니다.
- 이웃한 두 노드는 **서로를** 가리킵니다. 10의 next는 20이고, 20의 prev는 10입니다.

## 4. 천천히 풀어보기

### 4.1 불변식: 두 방향이 서로 맞아야 한다

이중 연결 리스트의 핵심 규칙은 다음과 같습니다.

> 노드 a의 next가 b라면, b의 prev는 반드시 a이다. (그 반대도 마찬가지)

여기에 양 끝의 규칙이 더해집니다.

- head의 prev는 NULL, tail의 next는 NULL
- 비어 있으면 head와 tail이 모두 NULL
- 노드가 하나면 head와 tail이 같은 노드

이 규칙들을 코드로 검사하는 함수를 만들어 두면, 삽입·삭제를 구현할 때마다 돌려 보고 실수를 바로 찾을 수 있습니다. C 구현의 `check` 함수가 바로 그것입니다. **불변식 검사 함수는 복잡한 자료구조를 만들 때 가장 믿을 만한 친구**입니다.

### 4.2 삽입: 연결 네 개, 순서 주의

노드 L과 R 사이에 새 노드 N을 넣는다고 합시다.

```text
삽입 전:     L ⇄ R

① N.prev = L          N은 아직 리스트 밖에 있으므로
② N.next = R          ①②를 먼저 해도 안전하다
③ L.next = N
④ R.prev = N

삽입 후:     L ⇄ N ⇄ R
```

①과 ②는 새 노드의 연결이라 기존 리스트에 영향이 없습니다. 문제는 ③과 ④입니다. 코드에서 R을 `L.next`로 찾는다면, ③에서 `L.next`를 N으로 바꾼 뒤에는 **R을 찾을 길이 사라집니다.** 그래서 R을 변수에 미리 저장하거나, ④(`L.next.prev = N`)를 ③보다 먼저 실행해야 합니다. 실습의 디버그 문제가 이 순서 문제를 다룹니다.

### 4.3 삭제: 양옆을 서로 잇는다

노드 N을 지울 때는 N의 **양옆 노드를 서로 잇기만** 하면 됩니다.

```text
삭제 전:     P ⇄ N ⇄ R

① P.next = R          (N.prev.next = N.next)
② R.prev = P          (N.next.prev = N.prev)

삭제 후:     P ⇄ R         N은 리스트에서 빠졌다
```

앞 노드를 찾으려고 순회할 필요가 없으므로 **O(1)** 입니다. 다만 N이 head라면 P가 없고, tail이라면 R이 없으므로 NULL 검사가 필요합니다. 이런 특별한 경우를 없애는 방법이 다음의 더미 노드입니다.

### 4.4 더미(sentinel) 노드: 특별한 경우 없애기

**값을 담지 않는 가짜 노드** 하나를 두고, 리스트를 **원형**으로 잇습니다.

```text
          ┌──────────────────────────────────────────────┐
          ▼                                              │
     ┌─────────┐    ┌────┐    ┌────┐    ┌────┐           │
     │ 더미(S) │ ⇄  │ 10 │ ⇄  │ 20 │ ⇄  │ 30 │ ──────────┘
     └─────────┘    └────┘    └────┘    └────┘
     S.next = 첫 노드,  S.prev = 마지막 노드

빈 리스트:  S.next = S,  S.prev = S   (자기 자신을 가리킨다)
```

이렇게 하면 **모든 실제 노드에 prev와 next가 항상 존재**합니다. 첫 노드의 prev는 더미이고, 마지막 노드의 next도 더미입니다. 그래서

- 맨 앞 삽입 = 더미와 첫 노드 사이에 삽입
- 맨 뒤 삽입 = 마지막 노드와 더미 사이에 삽입
- 어떤 노드 삭제 = 그 노드의 양옆을 잇기

모두 **한 가지 코드**로 처리됩니다. NULL 검사가 하나도 없습니다. 순회는 더미에서 출발해 **다시 더미를 만나면** 멈춥니다. Python 구현이 이 방법을 씁니다.

### 4.5 Rust에서는 왜 어려운가

Rust의 소유권 규칙은 "값의 소유자는 하나"입니다. 그런데 이중 연결 리스트에서 20번 노드는 10의 next와 30의 prev, **두 곳에서** 가리킵니다. 둘 중 누가 소유자일까요? `Box`는 소유자가 하나뿐이라 이 구조를 표현할 수 없습니다. 해결 방법은 두 가지입니다.

1. **인덱스 연결(arena)**: 모든 노드를 `Vec` 하나에 넣고, prev와 next에는 주소 대신 **Vec의 인덱스(숫자)** 를 저장합니다. 노드의 소유자는 Vec 하나이고, 인덱스는 그냥 숫자라서 몇 군데서 가리켜도 문제가 없습니다. 이 수업의 주 구현입니다.
2. **공유 소유(Rc)와 약한 참조(Weak)**: `Rc`는 여러 곳이 함께 소유하는 포인터이고, `Weak`는 소유하지 않고 가리키기만 하는 포인터입니다. next는 Rc, prev는 Weak로 만듭니다. 7.2절에서 짧게 봅니다.

## 5. C로 구현하기

head와 tail을 가진 이중 연결 리스트입니다. 모든 연산 뒤에 `check`로 불변식을 검사해 결과를 함께 출력합니다.

```c
// 파일: dlist.c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node {
    int value;
    struct Node *prev;
    struct Node *next;
} Node;

typedef struct {
    Node *head;
    Node *tail;
    int size;
} DList;

Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    node->value = value;
    node->prev = NULL;
    node->next = NULL;
    return node;
}

void push_front(DList *list, int value) {
    Node *node = create_node(value);
    node->next = list->head;
    if (list->head != NULL) {
        list->head->prev = node;
    } else {
        list->tail = node;          // 빈 리스트였다면 tail도 새 노드
    }
    list->head = node;
    list->size++;
}

void push_back(DList *list, int value) {
    Node *node = create_node(value);
    node->prev = list->tail;
    if (list->tail != NULL) {
        list->tail->next = node;
    } else {
        list->head = node;
    }
    list->tail = node;
    list->size++;
}

Node *insert_after(DList *list, Node *pos, int value) {
    Node *node = create_node(value);
    node->prev = pos;               // ① 새 노드의 두 연결을 먼저 정하고
    node->next = pos->next;         // ②
    if (pos->next != NULL) {
        pos->next->prev = node;     // ④ 뒤 노드가 새 노드를 가리키게 (먼저!)
    } else {
        list->tail = node;          // pos가 tail이었다면 새 노드가 tail
    }
    pos->next = node;               // ③ 마지막에 pos가 새 노드를 가리킨다
    list->size++;
    return node;
}

void remove_node(DList *list, Node *node) {
    if (node->prev != NULL) {
        node->prev->next = node->next;
    } else {
        list->head = node->next;    // node가 head였다
    }
    if (node->next != NULL) {
        node->next->prev = node->prev;
    } else {
        list->tail = node->prev;    // node가 tail이었다
    }
    free(node);
    list->size--;
}

Node *find(const DList *list, int value) {
    for (Node *cur = list->head; cur != NULL; cur = cur->next) {
        if (cur->value == value) {
            return cur;
        }
    }
    return NULL;
}

// 불변식 검사: 모든 연결이 서로 맞고, 앞뒤 개수가 size와 같은가
bool check(const DList *list) {
    int forward = 0;
    const Node *prev = NULL;
    for (const Node *cur = list->head; cur != NULL; cur = cur->next) {
        if (cur->prev != prev) {
            return false;           // a.next == b 인데 b.prev != a
        }
        prev = cur;
        forward++;
    }
    if (prev != list->tail) {
        return false;               // 끝까지 간 노드가 tail이 아니다
    }
    int backward = 0;
    for (const Node *cur = list->tail; cur != NULL; cur = cur->prev) {
        backward++;
    }
    return forward == list->size && backward == list->size;
}

void print_both(const DList *list, const char *label) {
    printf("%-18s 앞→뒤:", label);
    for (const Node *cur = list->head; cur != NULL; cur = cur->next) {
        printf(" %d", cur->value);
    }
    printf("  | 뒤→앞:");
    for (const Node *cur = list->tail; cur != NULL; cur = cur->prev) {
        printf(" %d", cur->value);
    }
    printf("  | size=%d %s\n", list->size, check(list) ? "OK" : "BROKEN");
}

void free_all(DList *list) {
    Node *cur = list->head;
    while (cur != NULL) {
        Node *next = cur->next;
        free(cur);
        cur = next;
    }
    list->head = list->tail = NULL;
    list->size = 0;
}

int main(void) {
    DList list = { NULL, NULL, 0 };

    push_back(&list, 20);
    push_back(&list, 40);
    push_front(&list, 10);
    print_both(&list, "push 20,40 / 10");

    insert_after(&list, find(&list, 20), 30);
    insert_after(&list, list.tail, 50);
    print_both(&list, "insert 30, 50");

    remove_node(&list, list.head);          // 첫 노드
    remove_node(&list, find(&list, 30));    // 가운데 노드
    remove_node(&list, list.tail);          // 마지막 노드 - O(1)!
    print_both(&list, "remove 10,30,50");

    remove_node(&list, list.head);
    remove_node(&list, list.head);
    print_both(&list, "remove all");

    push_back(&list, 7);
    print_both(&list, "push 7");
    free_all(&list);
    return 0;
}
```

실행 결과:

```text
push 20,40 / 10    앞→뒤: 10 20 40  | 뒤→앞: 40 20 10  | size=3 OK
insert 30, 50      앞→뒤: 10 20 30 40 50  | 뒤→앞: 50 40 30 20 10  | size=5 OK
remove 10,30,50    앞→뒤: 20 40  | 뒤→앞: 40 20  | size=2 OK
remove all         앞→뒤:  | 뒤→앞:  | size=0 OK
push 7             앞→뒤: 7  | 뒤→앞: 7  | size=1 OK
```

### 코드 한 부분씩 읽기

| 코드                                                          | 설명                                                                                                                                                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { Node *head; Node *tail; int size; } DList;` | 리스트의 상태를 구조체 하나로 묶었습니다. 함수들은 `DList *`를 받으므로 Day 61의 `Node **head` 같은 이중 포인터가 필요 없습니다.                                                        |
| `if (list->head != NULL) ... else list->tail = node;`         | 빈 리스트에 첫 노드를 넣으면 그 노드는 head이면서 tail입니다. 이 else를 빠뜨리면 tail이 NULL로 남아 뒤→앞 순회가 아무것도 출력하지 않습니다.                                            |
| `pos->next->prev = node;` 다음에 `pos->next = node;`          | 4.2절의 순서입니다. `pos->next`를 먼저 바꾸면 `pos->next->prev`가 **새 노드의 prev**가 되어, 원래 뒤 노드(40)는 여전히 20을 가리킵니다.                                                 |
| `remove_node(&list, list.tail);`                              | tail의 prev로 새 tail을 바로 알 수 있어 O(1)입니다. 단일 연결 리스트에서는 O(n)이었습니다.                                                                                              |
| `bool check(const DList *list)`                               | 앞으로 가면서 "내 prev가 방금 지나온 노드인가?"를 확인하고, 앞·뒤 개수가 size와 같은지 봅니다. 연결 하나만 빠져도 false가 됩니다. 실습의 디버그 문제에서 같은 방법으로 버그를 찾습니다. |
| `list->head = list->tail = NULL;`                             | 대입은 오른쪽부터 계산되므로 tail에 NULL을 넣고, 그 결과(NULL)를 head에 넣습니다.                                                                                                       |

> **오류 주의**: `remove_node`는 node가 **정말 이 리스트의 노드**라고 믿습니다. 이미 해제한 노드나 다른 리스트의 노드를 넘기면 정의되지 않은 동작이 됩니다. `find`가 NULL을 돌려줄 수 있는 상황이라면 호출하기 전에 NULL인지 확인하세요.

## 6. Python으로 구현하기

Python 구현은 더미 노드를 씁니다. 모든 삽입이 `_insert_between` 하나로, 모든 삭제가 `remove` 하나로 처리되는 것을 확인하세요. if 문이 거의 없습니다.

```python
# 파일: dlist.py
class Node:
    def __init__(self, value=None):
        self.value = value
        self.prev = self          # 처음에는 자기 자신을 가리킨다
        self.next = self


class DList:
    def __init__(self):
        self._s = Node()          # 더미(sentinel) 노드
        self._size = 0

    def _insert_between(self, value, left, right):
        node = Node(value)
        node.prev, node.next = left, right    # ① ②
        left.next = node                      # ③
        right.prev = node                     # ④
        self._size += 1
        return node

    def push_front(self, value):
        return self._insert_between(value, self._s, self._s.next)

    def push_back(self, value):
        return self._insert_between(value, self._s.prev, self._s)

    def insert_after(self, node, value):
        return self._insert_between(value, node, node.next)

    def remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
        node.prev = node.next = None          # 다시 쓰지 못하게 끊어 둔다
        self._size -= 1
        return node.value

    def pop_back(self):
        if self._size == 0:
            raise IndexError("pop_back: 리스트가 비어 있습니다")
        return self.remove(self._s.prev)

    def find(self, value):
        for node in self._nodes():
            if node.value == value:
                return node
        return None

    def _nodes(self):
        cur = self._s.next
        while cur is not self._s:             # 더미로 돌아오면 끝
            yield cur
            cur = cur.next

    def __iter__(self):
        return (node.value for node in self._nodes())

    def __reversed__(self):
        cur = self._s.prev
        while cur is not self._s:
            yield cur.value
            cur = cur.prev

    def __len__(self):
        return self._size

    def check(self):
        count, cur = 0, self._s
        while True:
            if cur.next.prev is not cur:
                return False
            cur = cur.next
            if cur is self._s:
                return count == self._size
            count += 1

    def show(self, label):
        print(f"{label:<17} 앞→뒤: {list(self)}  뒤→앞: {list(reversed(self))}"
              f"  size={len(self)} {'OK' if self.check() else 'BROKEN'}")


d = DList()
d.push_back(20)
d.push_back(40)
d.push_front(10)
d.show("push 20,40 / 10")

d.insert_after(d.find(20), 30)
d.push_back(50)
d.show("insert 30, 50")

d.remove(d.find(10))
d.remove(d.find(30))
print("pop_back ->", d.pop_back())
d.show("remove 10,30,50")

d.pop_back()
d.pop_back()
d.show("remove all")
try:
    d.pop_back()
except IndexError as error:
    print("오류:", error)
```

실행 결과:

```text
push 20,40 / 10   앞→뒤: [10, 20, 40]  뒤→앞: [40, 20, 10]  size=3 OK
insert 30, 50     앞→뒤: [10, 20, 30, 40, 50]  뒤→앞: [50, 40, 30, 20, 10]  size=5 OK
pop_back -> 50
remove 10,30,50   앞→뒤: [20, 40]  뒤→앞: [40, 20]  size=2 OK
remove all        앞→뒤: []  뒤→앞: []  size=0 OK
오류: pop_back: 리스트가 비어 있습니다
```

### 코드 한 부분씩 읽기

| 코드                                                        | 설명                                                                                                                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self.prev = self; self.next = self`                        | 새 노드는 처음에 자기 자신을 가리킵니다. 더미 노드가 이 상태면 "빈 리스트"입니다.                                                                                      |
| `push_front` = `_insert_between(value, 더미, 더미.next)`    | 맨 앞은 "더미와 첫 노드 사이"입니다. 빈 리스트면 `더미.next`가 더미 자신이므로 "더미와 더미 사이"가 되어 역시 올바르게 동작합니다. **빈 리스트 처리가 따로 없습니다.** |
| `push_back` = `_insert_between(value, 더미.prev, 더미)`     | 더미의 prev는 항상 마지막 노드입니다. tail 변수를 따로 둘 필요가 없습니다.                                                                                             |
| `node.prev.next = node.next` / `node.next.prev = node.prev` | 삭제는 이 두 줄이 전부입니다. 첫 노드여도 prev가 더미이고, 마지막 노드여도 next가 더미라서 NULL 검사가 필요 없습니다.                                                  |
| `node.prev = node.next = None`                              | 삭제한 노드를 누군가 계속 쓰면 오류가 나도록 연결을 끊어 둡니다. 실수로 다시 remove하면 `AttributeError`가 발생해 문제를 빨리 알 수 있습니다.                          |
| `while cur is not self._s:`                                 | 원형 구조라 None을 만나지 않습니다. **더미로 돌아왔는지**로 끝을 판단합니다.                                                                                           |
| `def __reversed__(self):`                                   | 이 메서드가 있으면 내장 함수 `reversed(d)`를 쓸 수 있습니다. prev를 따라가는 역방향 순회입니다.                                                                        |
| `def check(self):`                                          | 더미에서 출발해 한 바퀴 돌며 `cur.next.prev is cur`를 확인합니다. C 버전의 불변식 검사와 같은 일을 합니다.                                                             |

> **TIP**: Python의 `collections.deque`와 Linux 커널의 연결 리스트(`list_head`)도 이런 원형 이중 연결 구조를 씁니다. 더미 노드 기법은 "특별한 경우를 없애서 버그를 줄이는" 대표적인 설계 기법입니다.

## 7. Rust로 구현하기

### 7.1 인덱스로 연결하기(arena)

모든 노드를 `Vec<Option<Node>>`에 저장하고, prev와 next에는 **인덱스**를 둡니다. 삭제한 칸은 `None`으로 비우고 그 인덱스를 `free` 목록에 넣어 다음 삽입 때 재사용합니다.

```rust
// 파일: arena_dlist.rs
struct Node {
    value: i32,
    prev: Option<usize>,
    next: Option<usize>,
}

struct DList {
    slots: Vec<Option<Node>>,   // 노드 저장소. 삭제된 칸은 None
    free: Vec<usize>,           // 재사용할 수 있는 빈칸 번호
    head: Option<usize>,
    tail: Option<usize>,
    size: usize,
}

impl DList {
    fn new() -> Self {
        DList { slots: Vec::new(), free: Vec::new(), head: None, tail: None, size: 0 }
    }

    fn node(&self, i: usize) -> &Node {
        self.slots[i].as_ref().expect("삭제된 노드")
    }

    fn node_mut(&mut self, i: usize) -> &mut Node {
        self.slots[i].as_mut().expect("삭제된 노드")
    }

    fn alloc(&mut self, node: Node) -> usize {
        match self.free.pop() {
            Some(i) => {
                self.slots[i] = Some(node);     // 빈칸 재사용
                i
            }
            None => {
                self.slots.push(Some(node));
                self.slots.len() - 1
            }
        }
    }

    fn push_back(&mut self, value: i32) -> usize {
        let i = self.alloc(Node { value, prev: self.tail, next: None });
        match self.tail {
            Some(t) => self.node_mut(t).next = Some(i),
            None => self.head = Some(i),
        }
        self.tail = Some(i);
        self.size += 1;
        i
    }

    fn push_front(&mut self, value: i32) -> usize {
        let i = self.alloc(Node { value, prev: None, next: self.head });
        match self.head {
            Some(h) => self.node_mut(h).prev = Some(i),
            None => self.tail = Some(i),
        }
        self.head = Some(i);
        self.size += 1;
        i
    }

    fn insert_after(&mut self, pos: usize, value: i32) -> usize {
        let after = self.node(pos).next;
        let i = self.alloc(Node { value, prev: Some(pos), next: after });
        match after {
            Some(a) => self.node_mut(a).prev = Some(i),
            None => self.tail = Some(i),
        }
        self.node_mut(pos).next = Some(i);
        self.size += 1;
        i
    }

    fn remove(&mut self, i: usize) -> i32 {
        let node = self.slots[i].take().expect("삭제된 노드");
        match node.prev {
            Some(p) => self.node_mut(p).next = node.next,
            None => self.head = node.next,
        }
        match node.next {
            Some(n) => self.node_mut(n).prev = node.prev,
            None => self.tail = node.prev,
        }
        self.free.push(i);
        self.size -= 1;
        node.value
    }

    fn forward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.head;
        while let Some(i) = cur {
            out.push(self.node(i).value);
            cur = self.node(i).next;
        }
        out
    }

    fn backward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.tail;
        while let Some(i) = cur {
            out.push(self.node(i).value);
            cur = self.node(i).prev;
        }
        out
    }

    fn show(&self, label: &str) {
        println!(
            "{:<17} 앞→뒤: {:?}  뒤→앞: {:?}  size={} 칸={} 빈칸={:?}",
            label, self.forward(), self.backward(), self.size, self.slots.len(), self.free
        );
    }
}

fn main() {
    let mut d = DList::new();
    let twenty = d.push_back(20);
    d.push_back(40);
    let ten = d.push_front(10);
    d.show("push 20,40 / 10");

    let thirty = d.insert_after(twenty, 30);
    let fifty = d.push_back(50);
    d.show("insert 30, 50");

    d.remove(ten);
    d.remove(thirty);
    println!("remove(tail) -> {}", d.remove(fifty));
    d.show("remove 10,30,50");

    d.push_front(5);
    d.show("push_front 5");
}
```

실행 결과:

```text
push 20,40 / 10   앞→뒤: [10, 20, 40]  뒤→앞: [40, 20, 10]  size=3 칸=3 빈칸=[]
insert 30, 50     앞→뒤: [10, 20, 30, 40, 50]  뒤→앞: [50, 40, 30, 20, 10]  size=5 칸=5 빈칸=[]
remove(tail) -> 50
remove 10,30,50   앞→뒤: [20, 40]  뒤→앞: [40, 20]  size=2 칸=5 빈칸=[2, 3, 4]
push_front 5      앞→뒤: [5, 20, 40]  뒤→앞: [40, 20, 5]  size=3 칸=5 빈칸=[2, 3]
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prev: Option<usize>, next: Option<usize>`     | 주소 대신 **Vec의 인덱스**입니다. `usize`는 `Copy` 타입이라 몇 군데에 복사해 두어도 소유권 문제가 없습니다. C의 포인터 자리에 번호를 쓴 것입니다.                        |
| `slots: Vec<Option<Node>>`                     | 모든 노드의 **유일한 소유자**는 이 Vec입니다. 리스트가 사라지면 Vec이 사라지면서 노드도 모두 해제됩니다. `Drop`을 따로 만들 필요가 없습니다.                             |
| `self.slots[i].as_ref().expect("삭제된 노드")` | 칸이 비어 있으면(이미 삭제된 인덱스면) 메시지와 함께 panic합니다. C의 use-after-free가 **정의되지 않은 동작**이었다면, 여기서는 분명한 오류로 바뀝니다.                  |
| `fn alloc(&mut self, node: Node) -> usize`     | 빈칸이 있으면 재사용하고 없으면 Vec 끝에 붙입니다. 마지막 줄에서 5가 빈칸 3번에 들어가 빈칸 목록이 `[2, 3]`이 된 것을 확인하세요(`free.pop()`은 목록의 끝에서 꺼냅니다). |
| `let after = self.node(pos).next;`             | pos의 원래 next를 **먼저 복사**해 둡니다. C의 "뒤 노드의 prev를 먼저 고친다"와 같은 역할입니다. 인덱스는 복사되므로 이후에 pos의 next를 바꿔도 `after`는 그대로입니다.   |
| `let node = self.slots[i].take().expect(...)`  | 지울 노드를 칸에서 **꺼내면서** 칸을 비웁니다. 꺼낸 node의 prev와 next를 보며 양옆을 잇습니다.                                                                           |
| `Some(t) => self.node_mut(t).next = Some(i),`  | `match`의 각 갈래는 식이어야 하는데, 대입도 `()`를 돌려주는 식이라 이렇게 쓸 수 있습니다.                                                                                |

> **참고**: 인덱스 연결은 Rust 커뮤니티에서 그래프, 트리, 게임 객체처럼 **서로 가리키는 구조**를 만들 때 널리 쓰는 방법입니다. 단점은 삭제된 인덱스를 실수로 다시 쓸 수 있다는 것인데, 이 코드는 `expect`로 그 순간을 잡아냅니다.

### 7.2 Rc와 Weak로 연결하기

두 번째 방법은 **공유 소유권**입니다. `Rc<T>`(reference counted)는 여러 곳이 함께 소유하는 포인터로, 마지막 소유자가 사라질 때 해제됩니다. `RefCell<T>`은 공유된 값을 실행 중에 검사하며 수정할 수 있게 해 줍니다. `Weak<T>`는 **소유하지 않는** 포인터로, 가리키는 값이 아직 살아 있는지 `upgrade()`로 확인한 뒤 씁니다.

```rust
// 파일: rc_dlist.rs
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    next: Option<Rc<RefCell<Node>>>,    // 다음 노드를 함께 소유
    prev: Option<Weak<RefCell<Node>>>,  // 이전 노드는 가리키기만
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("  노드 {} 해제", self.value);
    }
}

fn new_node(value: i32) -> Rc<RefCell<Node>> {
    Rc::new(RefCell::new(Node { value, next: None, prev: None }))
}

fn link(left: &Rc<RefCell<Node>>, right: &Rc<RefCell<Node>>) {
    left.borrow_mut().next = Some(Rc::clone(right));
    right.borrow_mut().prev = Some(Rc::downgrade(left));
}

fn main() {
    let a = new_node(1);
    let b = new_node(2);
    let c = new_node(3);
    link(&a, &b);
    link(&b, &c);

    let mut cur = Some(Rc::clone(&a));
    print!("앞→뒤:");
    while let Some(node) = cur {
        print!(" {}", node.borrow().value);
        cur = node.borrow().next.clone();
    }
    println!();

    let mut cur = Some(Rc::clone(&c));
    print!("뒤→앞:");
    while let Some(node) = cur {
        print!(" {}", node.borrow().value);
        cur = node.borrow().prev.as_ref().and_then(|w| w.upgrade());
    }
    println!();

    println!("b의 강한 참조 {}개, 약한 참조 {}개", Rc::strong_count(&b), Rc::weak_count(&b));
    drop(b);
    drop(c);
    println!("b, c 변수를 버린 뒤에도 a가 사슬을 소유한다");
    drop(a);
    println!("main 끝");
}
```

실행 결과:

```text
앞→뒤: 1 2 3
뒤→앞: 3 2 1
b의 강한 참조 2개, 약한 참조 1개
b, c 변수를 버린 뒤에도 a가 사슬을 소유한다
  노드 1 해제
  노드 2 해제
  노드 3 해제
main 끝
```

| 코드                                     | 설명                                                                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Rc::clone(right)`                       | 값을 복사하는 것이 아니라 **소유자 수(강한 참조 개수)를 1 늘립니다.** b는 변수 b와 a의 next가 함께 소유하므로 강한 참조가 2개입니다.               |
| `Rc::downgrade(left)`                    | 소유하지 않는 Weak 포인터를 만듭니다. 약한 참조 개수는 해제 시점에 영향을 주지 않습니다. b의 약한 참조 1개는 c의 prev입니다.                       |
| `left.borrow_mut().next = ...`           | `RefCell`의 `borrow_mut()`는 실행 중에 "지금 다른 곳에서 빌리고 있지 않은지" 검사한 뒤 수정을 허락합니다. 규칙을 어기면 panic합니다.               |
| `w.upgrade()`                            | Weak를 Rc로 바꿔 봅니다. 노드가 아직 살아 있으면 `Some`, 이미 해제됐으면 `None`입니다. 그래서 prev를 따라갈 때는 항상 살아 있는지 확인하게 됩니다. |
| `drop(b); drop(c);` 뒤에도 해제되지 않음 | b와 c는 여전히 a → b → c의 next 사슬이 소유하고 있습니다. `drop(a)`로 첫 노드의 마지막 소유자가 사라지는 순간 1, 2, 3이 차례로 해제됩니다.         |

인덱스 방식보다 코드가 복잡하고, `borrow()`와 `clone()`이 곳곳에 필요하며, 실행 중 검사 비용도 있습니다. 그래서 Rust에서는 이 방식보다 인덱스 방식이나 표준 라이브러리를 더 많이 씁니다. 그래도 **여러 곳이 함께 소유해야 하는 데이터**(예: 여러 창이 공유하는 설정)가 필요할 때 Rc를 알아 두면 유용합니다. 12절의 실수 5에서 prev까지 Rc로 만들면 무슨 일이 생기는지 확인합니다.

## 8. 실행 추적

C의 `insert_after(&list, find(&list, 20), 30)`를 연결 단위로 따라갑니다. 시작 상태는 `10 ⇄ 20 ⇄ 40`이고, pos는 20, 새 노드 N의 값은 30입니다.

| 순서 | 실행한 코드              | 바뀐 연결   | 이 시점의 앞→뒤 | 이 시점의 뒤→앞 |
| ---: | ------------------------ | ----------- | --------------- | --------------- |
|    0 | 시작                     |             | 10 20 40        | 40 20 10        |
|    1 | `node->prev = pos`       | N.prev = 20 | 10 20 40        | 40 20 10        |
|    2 | `node->next = pos->next` | N.next = 40 | 10 20 40        | 40 20 10        |
|    3 | `pos->next->prev = node` | 40.prev = N | 10 20 40        | 40 **30** 20 10 |
|    4 | `pos->next = node`       | 20.next = N | 10 20 **30** 40 | 40 30 20 10     |

3단계 직후에는 **뒤→앞으로만** 30이 보이고, 4단계가 끝나야 두 방향이 일치합니다. 연결을 바꾸는 도중에는 불변식이 잠시 깨지는 것이 정상입니다. 중요한 것은 **함수가 끝났을 때** 불변식이 다시 성립하는 것입니다. 1·2단계는 N이 아직 리스트 밖에 있어서 두 방향 어디에도 영향이 없습니다.

## 9. 다른 예제로 다시 이해하기

**음악 재생 목록**을 만들어 봅시다. 현재 곡을 가리키는 커서가 있고, "다음 곡"은 next로, "이전 곡"은 prev로 이동합니다. 현재 곡을 목록에서 지우면 커서는 다음 곡으로 넘어가야 하고, 마지막 곡을 지웠다면 이전 곡으로 가야 합니다. 곡을 반복 재생하려면 끝에서 다음 곡을 눌렀을 때 첫 곡으로 돌아가야 하는데, 더미 노드를 쓰는 원형 구조라면 "더미를 건너뛰는 것"만으로 구현할 수 있습니다. 앞뒤 이동과 현재 위치 삭제가 모두 O(1)인 것이 이중 연결 리스트가 재생 목록에 잘 맞는 이유입니다.

```python
# 파일: playlist.py
class Node:
    def __init__(self, title=None):
        self.title = title
        self.prev = self
        self.next = self


class Playlist:
    def __init__(self, titles):
        self._s = Node()
        for title in titles:
            node = Node(title)
            node.prev, node.next = self._s.prev, self._s
            self._s.prev.next = node
            self._s.prev = node
        self.current = self._s.next if titles else None

    def _step(self, node, forward):
        node = node.next if forward else node.prev
        if node is self._s:                      # 더미는 건너뛴다 (반복 재생)
            node = node.next if forward else node.prev
        return node

    def next(self):
        self.current = self._step(self.current, True)
        return self.current.title

    def prev(self):
        self.current = self._step(self.current, False)
        return self.current.title

    def remove_current(self):
        node = self.current
        node.prev.next = node.next
        node.next.prev = node.prev
        if self._s.next is self._s:              # 마지막 곡을 지웠다
            self.current = None
        else:
            self.current = self._step(node.prev, True)
        return node.title

    def titles(self):
        out, cur = [], self._s.next
        while cur is not self._s:
            mark = "▶" if cur is self.current else " "
            out.append(f"{mark}{cur.title}")
            cur = cur.next
        return " ".join(out)


p = Playlist(["봄", "여름", "가을", "겨울"])
print(p.titles())
print("다음:", p.next(), "/ 다음:", p.next())
print("이전:", p.prev())
print(p.titles())
print("삭제:", p.remove_current(), "→", p.titles())
print("다음:", p.next(), "/ 다음:", p.next(), "(한 바퀴 돌아옴)")
print("이전:", p.prev(), "/ 이전:", p.prev())
```

실행 결과:

```text
▶봄  여름  가을  겨울
다음: 여름 / 다음: 가을
이전: 여름
 봄 ▶여름  가을  겨울
삭제: 여름 →  봄 ▶가을  겨울
다음: 겨울 / 다음: 봄 (한 바퀴 돌아옴)
이전: 겨울 / 이전: 가을
```

`remove_current`에서 다음 곡을 `self._step(node.prev, True)`로 구한 점을 보세요. 지운 노드의 **앞 노드에서 한 칸 전진**하면, 지운 노드가 끝에 있었더라도 더미를 건너뛰어 첫 곡으로 갑니다. 이미 지운 노드의 next를 따라가는 대신 리스트 안에 남아 있는 노드에서 출발하는 것이 안전합니다.

## 10. 시간·공간 복잡도

| 연산                      | 동적 배열 | 단일 연결 리스트    | 이중 연결 리스트 |
| ------------------------- | --------- | ------------------- | ---------------- |
| 맨 앞 삽입·삭제           | O(n)      | O(1)                | O(1)             |
| 맨 뒤 삽입                | 상각 O(1) | O(1) (tail 있을 때) | O(1)             |
| 맨 뒤 삭제                | O(1)      | **O(n)**            | **O(1)**         |
| 노드를 알 때 그 노드 삭제 | O(n)      | O(n) (앞 노드 찾기) | **O(1)**         |
| 역방향 순회               | O(n)      | 불가능              | O(n)             |
| k번째 원소                | O(1)      | O(k)                | O(min(k, n-k))   |
| 원소당 추가 공간          | 없음      | 포인터 1개          | 포인터 2개       |

이중 연결 리스트는 k번째 원소를 찾을 때 앞과 뒤 중 가까운 쪽에서 출발할 수 있어 조금 유리하지만, 여전히 O(n)입니다.

## 11. 세 언어 비교

| 관점             | C (head·tail)                   | Python (더미 노드)  | Rust 인덱스 (arena)            | Rust Rc·Weak               |
| ---------------- | ------------------------------- | ------------------- | ------------------------------ | -------------------------- |
| 연결 표현        | `Node *prev, *next`             | 객체 참조           | `Option<usize>`                | `Rc` (next), `Weak` (prev) |
| 끝 표시          | NULL                            | 더미 노드           | `None`                         | `None`                     |
| 특별한 경우      | 빈 리스트, head, tail 따로 처리 | 없음                | head, tail 따로 처리           | head, tail 따로 처리       |
| 노드 소유자      | 프로그래머(`free`)              | 가비지 컬렉터       | `Vec` 하나                     | Rc 개수가 0이 될 때        |
| 잘못된 노드 사용 | 정의되지 않은 동작              | `AttributeError`    | `expect`로 panic               | `upgrade()`가 `None`       |
| 표준 라이브러리  | 없음                            | `collections.deque` | `std::collections::LinkedList` | 같음                       |

## 12. 자주 하는 실수

### 실수 1: 네 연결 중 하나를 빠뜨린다

실습의 디버그 문제처럼 `pos->next->prev = node`를 빠뜨리면 앞으로 읽을 때는 멀쩡하고 **뒤로 읽을 때만** 새 노드가 사라집니다. 한 방향으로만 테스트하면 절대 발견되지 않는 버그입니다. 삽입·삭제 뒤에는 **항상 두 방향으로 출력하거나 불변식 검사 함수를 돌리세요.**

### 실수 2: 연결을 바꾸는 순서가 틀려 노드를 잃는다

```c
pos->next = node;           // ③을 먼저 하면
pos->next->prev = node;     // 이제 pos->next는 node 자신! node->prev = node
```

뒤 노드를 가리키던 `pos->next`가 먼저 바뀌어서 원래 뒤 노드를 찾을 수 없게 됩니다. 새 노드의 prev는 자기 자신을 가리키게 됩니다. 원래 뒤 노드를 **변수에 저장해 두거나** 순서를 지키세요. Rust 인덱스 구현은 `let after = self.node(pos).next;`로 저장해 두었습니다.

### 실수 3: head나 tail을 갱신하지 않는다

더미 노드가 없는 C 구현에서 첫 노드를 지우면서 `list->head`를 바꾸지 않으면, head가 해제된 노드를 가리키는 매달린 포인터가 됩니다. tail도 마찬가지입니다. 삭제 함수를 만들 때는 **첫 노드, 가운데 노드, 마지막 노드, 유일한 노드**를 모두 시험하세요. 본문 C 프로그램이 이 네 경우를 차례로 지웁니다.

### 실수 4: 삭제한 노드를 계속 쓴다

Python 구현은 삭제한 노드의 prev와 next를 None으로 끊어 둡니다. 그래서 실수로 같은 노드를 다시 지우려 하면 바로 오류가 납니다.

```python
# 파일: double_remove.py (실행 오류: AttributeError)
class Node:
    def __init__(self, value=None):
        self.value = value
        self.prev = self
        self.next = self


def remove(node):
    node.prev.next = node.next
    node.next.prev = node.prev
    node.prev = node.next = None


s = Node()
a = Node("a")
a.prev, a.next = s, s
s.next = s.prev = a
remove(a)
remove(a)           # 이미 지운 노드를 또 지운다
```

```text
AttributeError: 'NoneType' object has no attribute 'next'
```

연결을 끊어 두지 않았다면 두 번째 remove가 **조용히** 리스트를 망가뜨렸을 것입니다. 오류를 빨리, 크게 드러내는 것이 조용히 잘못 동작하는 것보다 훨씬 낫습니다.

### 실수 5: Rust에서 prev까지 Rc로 만든다

next와 prev가 모두 `Rc`라면, 이웃한 두 노드가 **서로를 소유**합니다. 바깥 변수를 모두 버려도 강한 참조 개수가 1씩 남아서 영원히 해제되지 않습니다. 이것을 **참조 순환(reference cycle)** 이라고 하며, Rust에서도 메모리 누수를 만들 수 있는 몇 안 되는 방법입니다.

```rust
// 파일: rc_cycle.rs
use std::cell::RefCell;
use std::rc::Rc;

struct Node {
    value: i32,
    next: Option<Rc<RefCell<Node>>>,
    prev: Option<Rc<RefCell<Node>>>,     // prev도 강한 참조 (잘못된 설계)
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("  노드 {} 해제", self.value);
    }
}

fn main() {
    let a = Rc::new(RefCell::new(Node { value: 1, next: None, prev: None }));
    let b = Rc::new(RefCell::new(Node { value: 2, next: None, prev: None }));
    a.borrow_mut().next = Some(Rc::clone(&b));
    b.borrow_mut().prev = Some(Rc::clone(&a));
    println!("a 강한 참조 {}, b 강한 참조 {}", Rc::strong_count(&a), Rc::strong_count(&b));
    drop(a);
    drop(b);
    println!("main 끝 (해제 메시지가 없다 = 누수)");
}
```

실행 결과:

```text
a 강한 참조 2, b 강한 참조 2
main 끝 (해제 메시지가 없다 = 누수)
```

7.2절의 올바른 구현은 `drop(a)` 뒤에 "노드 해제" 메시지가 나왔지만, 이 코드는 아무것도 해제되지 않았습니다. 한쪽 방향(prev)을 `Weak`로 바꾸면 순환이 끊어집니다. 부모-자식 트리의 "부모 포인터"도 같은 이유로 Weak를 씁니다(Day 64).

## 13. Q&A

**Q. 더미 노드를 C에서도 쓸 수 있나요?**

A. 물론입니다. `Node sentinel;`을 리스트 구조체 안에 두고 `sentinel.next = sentinel.prev = &sentinel`로 초기화하면 됩니다. 그러면 C 구현의 모든 NULL 검사와 head·tail 갱신 코드가 사라집니다. 도전 문제 1에서 해 보세요.

**Q. XOR 연결 리스트라는 것을 들었습니다. 무엇인가요?**

A. prev와 next를 따로 저장하지 않고 `prev XOR next` 값 하나만 저장해서 포인터 공간을 아끼는 기법입니다. 한쪽 이웃의 주소를 알면 XOR로 다른 쪽을 계산할 수 있습니다. 메모리가 매우 귀한 곳에서 쓰였지만, 코드를 읽기 어렵고 디버깅 도구와 가비지 컬렉터가 이해하지 못해 요즘은 거의 쓰지 않습니다. "이런 것도 있구나" 정도로 알아 두세요.

**Q. Rust의 `std::collections::LinkedList`는 어떻게 만들어져 있나요?**

A. 내부에서 `unsafe` 코드와 원시 포인터(raw pointer)를 써서 C와 비슷하게 구현되어 있습니다. 라이브러리 작성자가 안전성을 직접 증명하고, 사용자에게는 안전한 인터페이스만 보여 줍니다. 하지만 공식 문서도 "대부분의 경우 Vec이나 VecDeque가 더 빠르다"고 권합니다.

**Q. 이중 연결 리스트는 언제 배열 대신 써야 하나요?**

A. "원소의 위치(노드)를 이미 쥐고 있고, 그 자리에서 자주 넣고 빼야 할 때"입니다. 대표적인 예가 LRU 캐시입니다. 해시 맵으로 노드를 O(1)에 찾고, 이중 연결 리스트로 그 노드를 O(1)에 맨 앞으로 옮깁니다. 해시 맵을 배우는 Day 67 이후 도전해 보세요.

## 14. 핵심 요약

- 이중 연결 리스트의 노드는 **prev와 next**를 모두 가집니다. 앞뒤 이동, 마지막 노드 삭제, 알고 있는 노드 삭제가 O(1)이 됩니다.
- 불변식: **a.next가 b이면 b.prev는 a**. 삽입·삭제 뒤에는 두 방향 순회나 검사 함수로 확인합니다.
- 삽입은 연결 **네 개**를 바꾸고, 원래 뒤 노드를 잃지 않도록 순서를 지킵니다. 삭제는 양옆을 **서로 잇는** 연결 두 개입니다.
- **더미 노드**로 리스트를 원형으로 이으면 빈 리스트와 양 끝의 특별한 경우가 사라집니다.
- C는 head·tail과 `free`를 직접 관리하고, Python은 더미 노드로 간결하게 만듭니다.
- Rust는 한 노드를 두 곳에서 가리키는 구조를 `Box`로 만들 수 없습니다. **인덱스 연결**이나 **Rc + Weak**를 씁니다. prev까지 Rc로 만들면 참조 순환으로 누수가 생깁니다.

## 15. 도전 문제

1. **(C)** 리스트 구조체 안에 더미 노드를 두는 원형 이중 연결 리스트로 C 구현을 다시 작성해 보세요. `push_front`, `push_back`, `remove_node`에서 if 문이 몇 개나 사라지는지 세어 보세요.
2. **(Python)** 재생 목록에 곡 순서를 뒤집는 `reverse()`를 추가해 보세요. 모든 노드(더미 포함)의 prev와 next를 서로 바꾸기만 하면 됩니다. 왜 그런지 그림으로 설명해 보세요.
3. **(Rust)** 인덱스 기반 `DList`에 `check(&self) -> bool` 불변식 검사 메서드를 만들고, 모든 연산 뒤에 `assert!(d.check())`를 넣어 보세요.
4. **(세 언어)** 편집기의 커서를 이중 연결 리스트로 흉내 내 보세요. 글자 하나가 노드 하나이고, 왼쪽·오른쪽 이동, 커서 앞에 글자 넣기, 커서 앞 글자 지우기(백스페이스)를 구현합니다.
