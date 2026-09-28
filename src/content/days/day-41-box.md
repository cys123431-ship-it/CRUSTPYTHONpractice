---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-41-box
courseId: crp-92
phaseId: phase-04
dayNumber: 41
date: "2026-11-10"
title: Rust Box와 힙 소유
summary: Rust의 Box<T>는 값 하나를 힙에 두고 그 공간을 소유하는 가장 단순한 스마트 포인터입니다. Box::new와 *로 꺼내기, 옮겨도 주소만 복사된다는 점, 범위가 끝나면 자동으로 해제되는 것, 자기 자신을 담는 재귀 자료형(연결 리스트, 트리)에 Box가 꼭 필요한 이유(E0072), Option<Box<T>>와 take로 칸을 떼어 내고 붙이는 법을 다룹니다. C의 malloc한 구조체와 struct node *next, 자식부터 해제하는 재귀 free, Python의 모든 객체가 이미 참조라는 점과 비교하고, 수식 (2 + 3) * -(4 + 1)을 트리로 만들어 계산하고 출력하는 프로그램을 Rust와 C로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-40-malloc-free]
learningObjectives:
  - Box<T>가 힙 공간을 소유하고 범위 끝에서 해제된다는 것을 설명하고, Box::new와 *를 쓴다.
  - 재귀 자료형에 Box가 필요한 이유를 크기 계산으로 설명하고, E0072를 고친다.
  - Option<Box<Node>>와 take로 연결 리스트 스택의 push·pop을 만든다.
  - 같은 자료 구조를 C의 malloc·struct 포인터와 재귀 free로 만들고, 해제 순서를 설명한다.
  - Python 객체가 처음부터 참조로 연결된다는 점을 Rust Box와 비교한다.
concepts:
  [
    box,
    smart pointer,
    heap allocation,
    deref,
    recursive type,
    infinite size,
    linked list,
    option box,
    take,
    expression tree,
    recursive free,
    pointer to pointer,
  ]
runnerMode: python
playgroundSource: |
  # 파일: tree_play.py — Python 객체는 처음부터 서로를 가리킬 수 있습니다.
  class Tree:
      def __init__(self, value, left=None, right=None):
          self.value, self.left, self.right = value, left, right

  def depth(t):
      return 0 if t is None else 1 + max(depth(t.left), depth(t.right))

  root = Tree(1, Tree(2, Tree(4)), Tree(3))
  print("깊이", depth(root))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day41-predict-rs
    title: Box 안의 값 꺼내기 예측하기
    kind: predict
    objective: Box가 옮겨지고, 메서드는 자동으로 안쪽을 따라가며, *로 안의 값을 꺼낼 수 있다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let a = Box::new(String::from("모모"));
          let b = a;
          let len = b.len();
          let inner: String = *b;
          println!("{len} {inner}");
      }
    answer: "6 모모"
    hint: "b.len()은 Box 안의 String의 len입니다. *b는 Box를 풀어 String을 꺼냅니다."
    explanation: "let b = a;로 Box(주소)가 옮겨졌고, 힙의 String은 그대로입니다. b.len()은 자동으로 안쪽 String을 따라가 바이트 수 6을 줍니다. *b는 Box를 해제하면서 안의 String을 밖으로 옮겨 꺼냅니다. 이후 a와 b는 모두 쓸 수 없습니다."
    commonMistakes:
      - "b.len()이 Box의 크기(8)라고 생각함"
      - "let b = a;에서 String이 복사된다고 생각함"
    language: rust
    verification: run
  - id: ex-day41-predict-c
    title: 앞에 붙이는 연결 리스트의 순서 예측하기
    kind: predict
    objective: 새 칸을 머리에 붙이면 넣은 순서의 반대로 읽힌다는 것을 추적한다.
    prompt: 출력되는 세 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      struct node {
          int value;
          struct node *next;
      };

      int main(void) {
          struct node *head = NULL;
          for (int i = 1; i <= 3; i++) {
              struct node *n = malloc(sizeof *n);
              if (n == NULL) {
                  return 1;
              }
              n->value = i;
              n->next = head;
              head = n;
          }
          for (struct node *p = head; p != NULL; p = p->next) {
              printf("%d ", p->value);
          }
          printf("\n");
          while (head != NULL) {
              struct node *next = head->next;
              free(head);
              head = next;
          }
          return 0;
      }
    answer: "3 2 1"
    hint: "매번 새 칸의 next가 지금까지의 머리를 가리키고, 새 칸이 머리가 됩니다."
    explanation: "1을 넣으면 [1], 2를 넣으면 [2 → 1], 3을 넣으면 [3 → 2 → 1]입니다. 머리부터 next를 따라가며 출력하므로 3 2 1입니다. 해제할 때는 free(head) 전에 head->next를 저장해야 합니다. free한 칸의 next를 읽으면 해제 후 사용입니다."
    commonMistakes:
      - "넣은 순서대로 1 2 3으로 적음"
      - "해제 반복에서 head->next를 free 뒤에 읽어도 된다고 생각함"
    language: c
    verification: run
  - id: ex-day41-fill
    title: Option에서 값을 떼어 내기 채우기
    kind: fill
    objective: take로 Option 안의 값을 꺼내고 그 자리를 None으로 만든다.
    prompt: "빈칸을 채워 slot의 Box를 꺼내고 slot을 비워, 'Some(7) None'이 출력되게 하세요."
    starter: |-
      fn main() {
          let mut slot: Option<Box<i32>> = Some(Box::new(7));
          let taken = slot._____();
          println!("{:?} {:?}", taken, slot);
      }
    answer: |-
      fn main() {
          let mut slot: Option<Box<i32>> = Some(Box::new(7));
          let taken = slot.take();
          println!("{:?} {:?}", taken, slot);
      }
    output: "Some(7) None"
    hint: "빌린 자리(&mut)에서 값을 옮겨 가려면, 그 자리에 무언가를 남겨 두어야 합니다."
    explanation: "Rust는 빌린 자리를 빈 채로 둘 수 없어서 let taken = slot;처럼 옮기면 slot을 더 쓸 수 없게 됩니다. take()는 안의 값을 꺼내고 그 자리에 None을 넣어 줍니다. 연결 리스트의 push·pop에서 self.head.take()로 머리를 떼어 내는 것이 바로 이 모양입니다. std::mem::replace(&mut slot, None)과 같습니다."
    commonMistakes:
      - "unwrap()을 써서 Box만 꺼내고 slot이 옮겨짐"
      - "clone()으로 복사해 slot이 비지 않음"
    language: rust
    verification: run
  - id: ex-day41-modify
    title: 재귀로 센 길이를 반복으로 바꾸기
    kind: modify
    objective: 연결 리스트를 참조를 옮겨 가며 도는 반복으로 센다.
    prompt: "len은 재귀로 길이를 셉니다. 아주 긴 리스트에서도 스택이 넘치지 않도록, 현재 칸을 가리키는 참조를 옮겨 가는 while let 반복으로 바꾸세요. 출력은 그대로 '3 Some(1)'입니다."
    starter: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      fn len(list: &Option<Box<Node>>) -> usize {
          match list {
              Some(node) => 1 + len(&node.next),
              None => 0,
          }
      }

      fn main() {
          let list = Some(Box::new(Node { value: 1, next: Some(Box::new(Node { value: 2, next: Some(Box::new(Node { value: 3, next: None })) })) }));
          let first = list.as_ref().map(|n| n.value);
          println!("{} {:?}", len(&list), first);
      }
    answer: |-
      struct Node {
          value: i32,
          next: Option<Box<Node>>,
      }

      fn len(list: &Option<Box<Node>>) -> usize {
          let mut n = 0;
          let mut cur = list;
          while let Some(node) = cur {
              n += 1;
              cur = &node.next;
          }
          n
      }

      fn main() {
          let list = Some(Box::new(Node { value: 1, next: Some(Box::new(Node { value: 2, next: Some(Box::new(Node { value: 3, next: None })) })) }));
          let first = list.as_ref().map(|n| n.value);
          println!("{} {:?}", len(&list), first);
      }
    output: "3 Some(1)"
    starterOutput: "3 Some(1)"
    hint: "cur는 &Option<Box<Node>>입니다. Some(node)면 한 칸 세고 cur를 &node.next로 옮기세요."
    explanation: "재귀는 칸마다 함수 호출이 스택에 쌓여서 수십만 칸이면 스택이 넘칩니다. 반복은 참조 하나(cur)만 옮겨 가므로 길이와 상관없이 메모리를 조금만 씁니다. C의 for (p = head; p != NULL; p = p->next)와 똑같은 모양입니다."
    commonMistakes:
      - "cur = node.next로 써서 빌린 값에서 옮기려는 오류가 남"
      - "let cur = list;로 mut를 빠뜨려 다시 대입할 수 없음"
    language: rust
    verification: run
  - id: ex-day41-debug
    title: 크기를 알 수 없는 재귀 enum 고치기
    kind: debug
    objective: E0072(재귀 자료형의 크기 무한)를 Box로 고친다.
    prompt: "이 코드는 E0072(recursive type `List` has infinite size) 오류로 컴파일되지 않습니다. 재귀하는 자리를 Box로 감싸 1 + 2의 합 '3'이 출력되게 하세요."
    starter: |-
      enum List {
          Cons(i32, List),
          Nil,
      }

      use List::{Cons, Nil};

      fn sum(list: &List) -> i32 {
          match list {
              Cons(v, rest) => v + sum(rest),
              Nil => 0,
          }
      }

      fn main() {
          let list = Cons(1, Cons(2, Nil));
          println!("{}", sum(&list));
      }
    answer: |-
      enum List {
          Cons(i32, Box<List>),
          Nil,
      }

      use List::{Cons, Nil};

      fn sum(list: &List) -> i32 {
          match list {
              Cons(v, rest) => v + sum(rest),
              Nil => 0,
          }
      }

      fn main() {
          let list = Cons(1, Box::new(Cons(2, Box::new(Nil))));
          println!("{}", sum(&list));
      }
    output: "3"
    hint: "List 안에 List가 통째로 들어 있으면 List의 크기 = i32 + List의 크기가 되어 끝나지 않습니다. 안쪽을 주소 하나(8바이트)로 바꾸세요."
    explanation: "컴파일러는 모든 값의 크기를 컴파일할 때 알아야 합니다. Box<List>는 안쪽이 무엇이든 주소 하나 크기라, List의 크기가 i32 + 8바이트 정도로 정해집니다. 자료형 선언뿐 아니라 값을 만드는 곳에서도 Box::new로 감싸야 합니다. sum(rest)는 &Box<List>가 &List로 자동 변환되어 그대로 동작합니다."
    commonMistakes:
      - "선언만 Box로 바꾸고 Cons(2, Nil)을 그대로 두어 자료형 오류가 남"
      - "&List로 바꿔 수명 표기가 필요하다는 다른 오류를 만남"
    language: rust
    verification: run
  - id: ex-day41-independent
    title: Python으로 이진 트리의 깊이와 칸 수 구하기
    kind: independent
    objective: 자식을 가리키는 객체로 트리를 만들고 재귀로 깊이와 크기를 센다.
    prompt: "value, left, right를 가진 Tree 클래스로 1(왼쪽 2(왼쪽 4), 오른쪽 3(오른쪽 5)) 트리를 만들고, 깊이와 칸 수를 '깊이 3, 칸 수 5'로 출력하세요."
    starter: |-
      class Tree:
          def __init__(self, value, left=None, right=None):
              self.value = value
              self.left = left
              self.right = right


      print("여기에 트리를 만들고 depth, size 함수를 만들어 보세요")
    answer: |-
      class Tree:
          def __init__(self, value, left=None, right=None):
              self.value = value
              self.left = left
              self.right = right


      def depth(t):
          if t is None:
              return 0
          return 1 + max(depth(t.left), depth(t.right))


      def size(t):
          if t is None:
              return 0
          return 1 + size(t.left) + size(t.right)


      root = Tree(1, Tree(2, Tree(4)), Tree(3, None, Tree(5)))
      print(f"깊이 {depth(root)}, 칸 수 {size(root)}")
    output: "깊이 3, 칸 수 5"
    hint: "빈 자리(None)의 깊이와 칸 수는 0입니다. 한 칸은 자기 자신(1)에 자식들의 결과를 더하거나 비교합니다."
    explanation: "Python의 속성은 처음부터 다른 객체를 가리키는 참조라, Rust처럼 Box를 쓰지 않아도 자기 자신과 같은 자료형을 담을 수 있습니다. 대신 모든 칸이 따로 힙에 있고, 정리는 실행기가 합니다. 같은 트리를 Rust로 만들면 left: Option<Box<Tree>>, C로 만들면 struct tree *left가 됩니다."
    commonMistakes:
      - "None 검사를 빼먹어 AttributeError가 남"
      - "깊이를 max 대신 +로 합쳐 칸 수와 같은 값이 나옴"
    language: python
    verification: run
quiz:
  - id: quiz-day41-01
    question: let b = Box::new(5);에서 b가 스택에 가진 것은?
    choices:
      - 정수 5
      - 힙에 있는 5의 주소(8바이트)
      - 5와 주소 둘 다
      - 아무것도 없다
    answerIndex: 1
    explanation: Box는 힙에 값을 두고 그 주소만 가집니다. *b로 안의 값을 읽고, b가 범위를 벗어나면 힙 공간이 해제됩니다. C의 int *b = malloc(sizeof *b); *b = 5;와 free(b)를 합친 것입니다.
  - id: quiz-day41-02
    question: "struct Node { next: Option<Node> }가 컴파일되지 않는 이유는?"
    choices:
      - Option을 구조체에 쓸 수 없어서
      - Node의 크기가 Node의 크기를 포함해 무한히 커지기 때문
      - next라는 이름을 쓸 수 없어서
      - 구조체에 이름이 필요해서
    answerIndex: 1
    explanation: 값이 안에 통째로 들어가면 크기 = 자기 크기 + ... 로 끝나지 않습니다(E0072). Option<Box<Node>>로 바꾸면 안쪽이 주소 하나라 크기가 정해집니다. C에서도 struct node next;는 안 되고 struct node *next;로 써야 하는 것과 같은 이유입니다.
  - id: quiz-day41-03
    question: Box<[u8; 1000]>를 다른 변수로 옮길 때 복사되는 바이트 수는?
    choices:
      - "1000"
      - 8(주소만)
      - "1008"
      - "0"
    answerIndex: 1
    explanation: 옮기기는 스택에 있는 부분만 복사합니다. Box의 스택 부분은 주소 하나라 8바이트이고, 힙의 1000바이트는 그대로 있습니다. 큰 값을 여러 번 옮기는 코드에서 Box가 도움이 되는 이유입니다.
  - id: quiz-day41-04
    question: C에서 트리를 해제할 때 자식을 먼저 free하는 이유는?
    choices:
      - 속도 때문에
      - 부모를 먼저 free하면 그 안의 자식 주소(a, b)를 읽는 것이 해제 후 사용이 되기 때문
      - 표준이 그렇게 정해서
      - 순서는 상관없다
    answerIndex: 1
    explanation: 부모 칸 안에 자식 주소가 들어 있으므로, 부모를 먼저 돌려주면 자식에게 갈 방법이 사라지거나 해제된 곳을 읽게 됩니다. Rust는 Box가 Drop될 때 안쪽 값을 먼저 정리하도록 자동으로 처리합니다.
  - id: quiz-day41-05
    question: Python에서 트리 노드 클래스에 Box 같은 것이 필요 없는 이유는?
    choices:
      - Python에는 트리가 없어서
      - 모든 속성이 이미 다른 객체를 가리키는 참조이기 때문
      - Python 객체는 크기가 0이라서
      - 재귀가 금지되어서
    answerIndex: 1
    explanation: Python의 self.left에는 객체 자체가 아니라 객체를 가리키는 참조가 들어 있습니다. 그래서 크기 문제가 생기지 않습니다. 대신 모든 객체가 따로 힙에 있고, 참조를 따라가는 비용과 정리 비용을 실행기가 부담합니다.
---

## 1. 오늘 배울 내용

Day 40에서 C의 `malloc`과 `free`로 힙 공간을 직접 다뤘고, Rust에서는 `Vec`과 `String`이 같은 일을 자동으로 한다는 것을 봤습니다. 오늘은 Rust에서 **값 하나를 힙에 두는** 가장 단순한 도구, `Box<T>`를 배웁니다.

1. `Box::new(값)`으로 힙에 두고, `*`로 안의 값을 씁니다.
   - `Box`를 옮기면 **주소만** 복사됩니다.
   - 주인이 범위를 벗어나면 힙 공간이 **자동으로 해제**됩니다.
2. **재귀 자료형**(자기와 같은 자료형을 담는 자료형)에는 `Box`가 꼭 필요합니다.
   - 연결 리스트, 트리, 수식 트리
   - `Box` 없이 쓰면 E0072 "크기가 무한"
3. `Option<Box<Node>>`와 `take()`로 연결 리스트 스택의 `push`·`pop`을 만듭니다.
4. 같은 자료 구조를 비교합니다.
   - C: `malloc`한 구조체, `struct node *next`, 자식부터 해제하는 재귀 `free`
   - Python: 모든 속성이 처음부터 참조
5. 수식 `(2 + 3) * -(4 + 1)`을 트리로 만들어 계산·출력하는 프로그램을 Rust와 C로 만듭니다.

## 2. 왜 필요한가

Rust는 보통 값을 스택에 둡니다. 빠르고 해제도 공짜라 좋지만, 스택에 둘 수 없는 경우가 있습니다.

- **크기를 컴파일할 때 알 수 없는 자료형**: 연결 리스트의 한 칸은 "다음 칸"을 담아야 하는데, 다음 칸도 또 다음 칸을 담아야 해서 크기가 끝나지 않습니다.
- **아주 큰 값**을 여러 번 옮겨야 할 때: 옮길 때마다 전체를 복사하는 대신 주소만 옮기고 싶습니다.
- **여러 종류의 값**을 한 자료형으로 다루고 싶을 때: `Box<dyn Trait>`(Day 54)

트리와 그래프(Day 72~82)는 모두 "칸이 다른 칸을 가리키는" 구조라, 오늘 배우는 모양이 그 바탕이 됩니다.

## 3. 그림으로 이해하기

```text
let b = Box::new(41);

스택          힙
b ┌──────┐   ┌────┐
  │ 주소 │──▶│ 41 │     b가 범위를 벗어나면 힙의 41이 해제된다
  └──────┘   └────┘
  8바이트

let moved = b;           주소 8바이트만 복사, b는 더 이상 쓸 수 없다
moved ┌──────┐   ┌────┐
      │ 주소 │──▶│ 41 │
      └──────┘   └────┘
```

재귀 자료형의 크기를 계산해 보면 `Box`가 필요한 이유가 보입니다.

```text
struct Node { value: i32, next: Option<Node> }
크기(Node) = 4 + 크기(Option<Node>) = 4 + (1 + 크기(Node)) = 4 + 1 + 4 + 1 + ...   끝나지 않음 ✗

struct Node { value: i32, next: Option<Box<Node>> }
크기(Node) = 4 + 크기(Option<Box<Node>>) = 4 + 8 (+ 맞춤 여백)                    정해짐 ✓
```

`Option<Box<Node>>`로 만든 스택에 10, 20, 30을 넣은 모습입니다.

```text
Stack.head
┌──────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Some │──▶ │ 30 │ Some ───┼──▶ │ 20 │ Some ───┼──▶ │ 10 │ None    │
└──────┘    └──────────────┘    └──────────────┘    └──────────────┘
                 힙                  힙                  힙
pop: head를 take()로 떼어 내고, head = 떼어 낸 칸의 next
```

## 4. 천천히 풀어보기

### 4.1 Box의 기본

| 하고 싶은 일             | Rust                       | C로 치면                               |
| ------------------------ | -------------------------- | -------------------------------------- |
| 힙에 값 하나 두기        | `let b = Box::new(41);`    | `int *b = malloc(sizeof *b); *b = 41;` |
| 안의 값 읽기             | `*b`                       | `*b`                                   |
| 안의 값의 메서드         | `b.len()`(자동으로 따라감) | `(*b).len` / `b->len`                  |
| 안의 값 꺼내기(Box 해제) | `let v = *b;`              | `int v = *b; free(b);`                 |
| 해제                     | 범위 끝(자동), `drop(b)`   | `free(b);`                             |

`Box<T>`는 `T`처럼 쓸 수 있게 만들어져 있어서, 메서드를 부르거나 `&Box<T>`를 `&T` 자리에 넘기면 컴파일러가 알아서 안쪽을 따라갑니다(Day 39의 역참조 강제 변환). 하지만 `b + 1`처럼 연산자를 쓸 때는 `*b + 1`로 직접 꺼내야 합니다.

### 4.2 Option<Box<T>>: 있을 수도 없을 수도 있는 다음 칸

C의 `struct node *next`는 `NULL`이면 "다음 칸 없음"입니다. Rust에는 널 포인터가 없어서 `Option<Box<Node>>`로 씁니다.

- `None`: 다음 칸 없음(C의 `NULL`)
- `Some(box)`: 다음 칸이 힙에 있음

컴파일러는 `Box`가 절대 널이 아니라는 것을 알아서, `None`을 널 주소로 표현합니다. 그래서 `Option<Box<Node>>`도 8바이트이고 C의 포인터와 비용이 같습니다.

### 4.3 take: 빌린 자리에서 값 떼어 내기

`push`와 `pop`은 `&mut self`로 스택을 빌려서 머리 칸을 바꿉니다. 빌린 자리의 값을 그냥 옮겨 가면 그 자리가 비어 버리므로 Rust가 허락하지 않습니다. `Option::take()`는 값을 꺼내고 그 자리에 `None`을 채워 줍니다.

```rust
let old = self.head.take();                        // 머리를 떼어 냄, head는 None
self.head = Some(Box::new(Node { value, next: old })); // 새 칸이 옛 머리를 가리킴
```

### 4.4 C에서의 같은 구조

- `struct node { int value; struct node *next; };`에서 `next`가 포인터라 크기가 정해집니다.
- 머리 포인터 자체를 바꾸는 함수는 **포인터의 주소**(`struct node **head`)를 받습니다. 함수 안에서 `*head = n;`으로 부른 쪽의 `head`를 바꿉니다.
- 해제할 때는 `next`를 먼저 저장하고 `free`합니다. 트리는 **자식부터** 해제합니다.

## 5. Rust로 구현하기

```rust
// 파일: box_basics.rs
use std::mem::size_of;

struct Node {                               // 연결 리스트의 한 칸
    value: i32,
    next: Option<Box<Node>>,                // 다음 칸을 힙에 소유한다(없으면 None)
}

struct Stack {
    head: Option<Box<Node>>,
    len: usize,
}

impl Stack {
    fn new() -> Stack {
        Stack { head: None, len: 0 }
    }

    fn push(&mut self, value: i32) {
        let old = self.head.take();         // 머리를 꺼내고 그 자리는 None
        self.head = Some(Box::new(Node { value, next: old }));
        self.len += 1;
    }

    fn pop(&mut self) -> Option<i32> {
        let node = self.head.take()?;       // 비었으면 None
        self.head = node.next;              // 다음 칸이 새 머리
        self.len -= 1;
        Some(node.value)                    // node(Box)는 여기서 해제된다
    }

    fn peek(&self) -> Option<&i32> {
        self.head.as_ref().map(|node| &node.value)
    }
}

fn main() {
    let b = Box::new(41);                   // 정수 하나를 힙에 둔다
    let sum = *b + 1;                       // *로 안의 값을 꺼낸다
    println!("*b + 1 = {sum}");
    println!("Box<i32> 크기 {}바이트(주소 하나)", size_of::<Box<i32>>());
    println!("Option<Box<Node>> 크기 {}바이트(None은 널 주소로 표현)", size_of::<Option<Box<Node>>>());

    let moved = b;                          // Box도 옮겨진다(힙 복사 없음, 주소만)
    println!("옮긴 뒤 {moved}");

    let mut s = Stack::new();
    for x in [10, 20, 30] {
        s.push(x);
    }
    println!("길이 {}, 맨 위 {:?}", s.len, s.peek());
    while let Some(x) = s.pop() {
        print!("{x} ");
    }
    println!("/ 빈 뒤 pop {:?}", s.pop());

    let big = Box::new([0u8; 1000]);        // 큰 배열을 힙에: 옮겨도 8바이트만 복사
    println!("큰 배열 길이 {}, 상자 크기 {}", big.len(), size_of::<Box<[u8; 1000]>>());
}
```

실행 결과:

```text
*b + 1 = 42
Box<i32> 크기 8바이트(주소 하나)
Option<Box<Node>> 크기 8바이트(None은 널 주소로 표현)
옮긴 뒤 41
길이 3, 맨 위 Some(30)
30 20 10 / 빈 뒤 pop None
큰 배열 길이 1000, 상자 크기 8
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `next: Option<Box<Node>>`                      | 다음 칸을 힙에 **소유**합니다. 한 칸이 해제되면 그 칸이 가진 다음 칸도 차례로 해제됩니다.                                           |
| `impl Stack { fn push(&mut self, ...) }`       | 구조체에 딸린 함수(메서드)입니다. 자세한 문법은 Day 52에서 배웁니다. 지금은 `self`가 스택 자신이라고 생각하세요.                    |
| `let old = self.head.take();`                  | 옛 머리를 떼어 내고 `head`를 `None`으로 둡니다. 다음 줄에서 새 칸의 `next`로 옛 머리를 넣습니다.                                    |
| `let node = self.head.take()?;`                | 비어 있으면 `?`가 곧바로 `None`을 돌려줍니다(Day 25). `node`는 `Box<Node>`입니다.                                                   |
| `self.head = node.next;`                       | 떼어 낸 칸의 `next`(소유권)를 새 머리로 옮깁니다. `node.value`만 남은 `node`는 함수 끝에서 해제됩니다.                              |
| `self.head.as_ref().map(\|node\| &node.value)` | `&Option<Box<Node>>`를 `Option<&Box<Node>>`로 바꿔 안을 빌린 뒤 값의 참조를 돌려줍니다. 스택은 그대로입니다.                        |
| `size_of::<Option<Box<Node>>>()`               | `None`을 널 주소로 표현하기 때문에 `Box` 하나와 같은 8바이트입니다.                                                                 |
| `Box::new([0u8; 1000])`                        | 1000바이트 배열을 힙에 뒀습니다. 이제 `big`을 옮겨도 8바이트만 복사됩니다(배열은 처음에 스택에서 만들어져 힙으로 한 번 옮겨집니다). |

## 6. C로 구현하기

```c
// 파일: linked_stack.c
#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;                      // 다음 칸의 주소(없으면 NULL)
};

// 새 칸을 힙에 만들어 맨 앞에 붙인다. 실패하면 0
int push(struct node **head, int value) {
    struct node *n = malloc(sizeof *n);
    if (n == NULL) {
        return 0;
    }
    n->value = value;
    n->next = *head;
    *head = n;                              // 머리 포인터 자체를 바꾸려고 **head로 받았다
    return 1;
}

// 맨 앞 칸을 떼어 값을 *out에 넣고 칸은 free한다. 비었으면 0
int pop(struct node **head, int *out) {
    struct node *n = *head;
    if (n == NULL) {
        return 0;
    }
    *out = n->value;
    *head = n->next;
    free(n);
    return 1;
}

void free_all(struct node **head) {
    int ignored;
    while (pop(head, &ignored)) {
    }
}

int main(void) {
    int *b = malloc(sizeof *b);             // 정수 하나를 힙에
    if (b == NULL) {
        return 1;
    }
    *b = 41;
    printf("*b + 1 = %d\n", *b + 1);
    free(b);

    struct node *head = NULL;
    for (int x = 10; x <= 30; x += 10) {
        if (!push(&head, x)) {
            free_all(&head);
            return 1;
        }
    }
    printf("맨 위 %d\n", head->value);
    int x;
    while (pop(&head, &x)) {
        printf("%d ", x);
    }
    printf("/ 빈 뒤 pop 성공? %d\n", pop(&head, &x));
    free_all(&head);                        // 이미 비었지만, 중간에 멈춘 경우를 위한 정리
    return 0;
}
```

실행 결과:

```text
*b + 1 = 42
맨 위 30
30 20 10 / 빈 뒤 pop 성공? 0
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `struct node *next;`                      | 다음 칸의 주소입니다. `NULL`이면 마지막 칸입니다. Rust의 `Option<Box<Node>>`에 해당하지만, 누가 해제할지는 코드가 약속해야 합니다. |
| `int push(struct node **head, int value)` | 머리 포인터를 **바꿔야** 하므로 포인터의 주소를 받습니다. `push(&head, x)`로 부릅니다. Rust에서는 `&mut self`가 이 역할입니다.     |
| `n->next = *head; *head = n;`             | 새 칸이 옛 머리를 가리키고, 새 칸이 머리가 됩니다. Rust의 `take()` 두 줄과 같은 일입니다.                                          |
| `*head = n->next; free(n);`               | 머리를 다음 칸으로 옮긴 **뒤에** 떼어 낸 칸을 해제합니다. 순서를 바꾸면 해제된 칸의 `next`를 읽게 됩니다.                          |
| `void free_all(struct node **head)`       | 남은 칸을 모두 해제합니다. Rust는 `Stack`이 범위를 벗어날 때 이 일을 자동으로 합니다.                                              |
| `head->value`                             | `(*head).value`의 줄임입니다. `head`가 `NULL`이면 멈추므로, 비어 있을 수 있는 곳에서는 먼저 검사해야 합니다.                       |

## 7. Python으로 구현하기

```python
# 파일: linked_stack.py
class Node:
    def __init__(self, value, next_node):
        self.value = value
        self.next = next_node               # 다른 Node 객체를 가리키거나 None


class Stack:
    def __init__(self):
        self.head = None
        self.len = 0

    def push(self, value):
        self.head = Node(value, self.head)
        self.len += 1

    def pop(self):
        if self.head is None:
            return None
        node = self.head
        self.head = node.next               # 떼어 낸 node는 가리키는 곳이 없어지면 정리된다
        self.len -= 1
        return node.value

    def peek(self):
        return None if self.head is None else self.head.value


s = Stack()
for x in [10, 20, 30]:
    s.push(x)
print("길이", s.len, "맨 위", s.peek())
out = []
while (x := s.pop()) is not None:
    out.append(str(x))
print(" ".join(out), "/ 빈 뒤 pop", s.pop())
print("실전에서는 리스트:", [10, 20, 30].pop())
```

실행 결과:

```text
길이 3 맨 위 30
30 20 10 / 빈 뒤 pop None
실전에서는 리스트: 30
```

### 코드 한 부분씩 읽기

| 코드                                 | 설명                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `self.next = next_node`              | 다른 `Node` 객체의 **참조**가 들어갑니다. Python에서는 모든 속성이 참조라 Box 같은 도구가 필요 없습니다.                                    |
| `self.head = Node(value, self.head)` | 새 칸이 옛 머리를 가리키게 만들고 머리로 둡니다. Rust처럼 `take`할 필요가 없는 이유는, 같은 객체를 두 곳이 동시에 가리켜도 되기 때문입니다. |
| `self.head = node.next`              | 떼어 낸 `node`는 함수가 끝나 지역 이름이 사라지면 가리키는 곳이 없어져 정리됩니다(Day 35).                                                  |
| `while (x := s.pop()) is not None:`  | 꺼낸 값이 `None`이 될 때까지 반복합니다. 값 0도 제대로 처리하려고 `is not None`으로 검사했습니다.                                           |
| `[10, 20, 30].pop()`                 | 실제로 Python에서 스택이 필요하면 리스트의 `append`·`pop`을 씁니다. 연결 리스트는 구조를 이해하기 위해 만든 것입니다.                       |

## 8. 실행 추적

Rust 스택의 `pop`이 한 번 도는 동안 소유권이 어떻게 옮겨지는지 따라갑니다. 시작은 `head → [30] → [20] → [10]`입니다.

| 줄                              | `self.head`         | `node`                | 해제되는 것 |
| ------------------------------- | ------------------- | --------------------- | ----------- |
| 시작                            | `Some([30] → ...)`  | -                     | -           |
| `let node = self.head.take()?;` | `None`              | `[30] → [20] → [10]`  | -           |
| `self.head = node.next;`        | `Some([20] → [10])` | `[30]`(next는 옮겨짐) | -           |
| `self.len -= 1;`                | `Some([20] → [10])` | `[30]`                | -           |
| `Some(node.value)` 후 함수 끝   | `Some([20] → [10])` | (사라짐)              | `[30]` 칸   |

`node.next`를 옮긴 뒤라 `[30]` 칸을 해제해도 `[20]`은 해제되지 않습니다. C에서는 이 순서를 코드로 직접 지켜야 하고, Rust에서는 소유권이 따라가므로 순서가 틀릴 수 없습니다.

## 9. 다른 예제로 다시 이해하기

**수식 트리.** `(2 + 3) * -(4 + 1)`을 트리로 만들면 연산자가 가지, 숫자가 잎이 됩니다.

```text
            Mul
          /     \
       Add       Neg
      /   \        |
     2     3      Add
                 /   \
                4     1
```

`enum`의 각 모양이 자식 수식을 `Box<Expr>`로 소유합니다.

```rust
// 파일: expr_tree.rs
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),              // 자기 자신을 담으려면 Box가 필요하다
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

use Expr::{Add, Mul, Neg, Num};

fn eval(e: &Expr) -> i64 {
    match e {
        Num(n) => *n,
        Add(a, b) => eval(a) + eval(b),     // &Box<Expr>도 &Expr처럼 쓸 수 있다
        Mul(a, b) => eval(a) * eval(b),
        Neg(a) => -eval(a),
    }
}

fn show(e: &Expr) -> String {
    match e {
        Num(n) => n.to_string(),
        Add(a, b) => format!("({} + {})", show(a), show(b)),
        Mul(a, b) => format!("{} * {}", show(a), show(b)),
        Neg(a) => format!("-{}", show(a)),
    }
}

fn count(e: &Expr) -> usize {
    match e {
        Num(_) => 1,
        Add(a, b) | Mul(a, b) => 1 + count(a) + count(b),
        Neg(a) => 1 + count(a),
    }
}

fn num(n: i64) -> Box<Expr> {
    Box::new(Num(n))
}

fn main() {
    // (2 + 3) * -(4 + 1)
    let e = Mul(
        Box::new(Add(num(2), num(3))),
        Box::new(Neg(Box::new(Add(num(4), num(1))))),
    );
    println!("{} = {}", show(&e), eval(&e));
    println!("칸 수 {}", count(&e));

    let bigger = Add(Box::new(e), num(100)); // e를 통째로 옮겨 새 트리의 가지로
    println!("{} = {}", show(&bigger), eval(&bigger));
}                                            // bigger가 사라지며 모든 칸이 차례로 해제된다
```

실행 결과:

```text
(2 + 3) * -(4 + 1) = -25
칸 수 8
((2 + 3) * -(4 + 1) + 100) = 75
```

| 코드                                                | 설명                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Add(Box<Expr>, Box<Expr>)`                         | 자기 자신(`Expr`)을 두 개 담으므로 `Box`로 감쌌습니다. `enum`의 크기는 가장 큰 모양(주소 두 개) 정도로 정해집니다. |
| `use Expr::{Add, Mul, Neg, Num};`                   | `Expr::Add` 대신 `Add`로 짧게 쓰려고 가져왔습니다.                                                                 |
| `Add(a, b) => eval(a) + eval(b)`                    | `a`는 `&Box<Expr>`이지만 `&Expr` 자리에 그대로 넘길 수 있습니다. 재귀로 자식부터 계산합니다.                       |
| `Add(a, b) \| Mul(a, b) => 1 + count(a) + count(b)` | 모양이 같은 두 경우를 `\|`로 묶었습니다.                                                                           |
| `fn num(n: i64) -> Box<Expr>`                       | `Box::new(Num(n))`를 매번 쓰기 번거로워 만든 도우미 함수입니다.                                                    |
| `let bigger = Add(Box::new(e), num(100));`          | `e`를 통째로 새 트리의 가지로 **옮겼습니다.** 이후 `e`는 쓸 수 없고, `bigger`가 모든 칸의 주인입니다.              |
| `}` (main 끝)                                       | `bigger`가 해제되며 각 `Box`가 자기 안쪽을 먼저 정리합니다. 해제 코드를 한 줄도 쓰지 않았습니다.                   |

C로 같은 트리를 만들면, 모양을 나타내는 `enum`과 자식 포인터를 가진 구조체를 쓰고 **해제 함수를 직접** 씁니다.

```c
// 파일: expr_tree.c
#include <stdio.h>
#include <stdlib.h>

enum kind { NUM, ADD, MUL, NEG };

struct expr {
    enum kind kind;
    long long n;                            // NUM일 때만 쓴다
    struct expr *a;                         // 왼쪽(또는 NEG의 안쪽)
    struct expr *b;                         // 오른쪽(ADD, MUL만)
};

struct expr *make(enum kind kind, long long n, struct expr *a, struct expr *b) {
    struct expr *e = malloc(sizeof *e);
    if (e == NULL) {
        exit(1);                            // 짧은 예제라 실패하면 바로 끝낸다
    }
    e->kind = kind;
    e->n = n;
    e->a = a;
    e->b = b;
    return e;
}

long long eval(const struct expr *e) {
    switch (e->kind) {
    case NUM: return e->n;
    case ADD: return eval(e->a) + eval(e->b);
    case MUL: return eval(e->a) * eval(e->b);
    case NEG: return -eval(e->a);
    }
    return 0;
}

int count(const struct expr *e) {
    if (e == NULL) {
        return 0;
    }
    return 1 + count(e->a) + count(e->b);
}

void free_expr(struct expr *e) {            // 자식을 먼저, 자기 자신은 마지막에
    if (e == NULL) {
        return;
    }
    free_expr(e->a);
    free_expr(e->b);
    free(e);
}

int main(void) {
    // (2 + 3) * -(4 + 1)
    struct expr *e = make(MUL, 0,
                          make(ADD, 0, make(NUM, 2, NULL, NULL), make(NUM, 3, NULL, NULL)),
                          make(NEG, 0, make(ADD, 0, make(NUM, 4, NULL, NULL), make(NUM, 1, NULL, NULL)), NULL));
    printf("값 %lld, 칸 수 %d\n", eval(e), count(e));
    struct expr *bigger = make(ADD, 0, e, make(NUM, 100, NULL, NULL));
    printf("100을 더한 값 %lld, 칸 수 %d\n", eval(bigger), count(bigger));
    free_expr(bigger);                      // e도 bigger의 가지라 함께 해제된다. e를 또 free하면 안 된다
    return 0;
}
```

실행 결과:

```text
값 -25, 칸 수 8
100을 더한 값 75, 칸 수 10
```

- `struct expr`는 모든 모양의 칸을 한 구조체로 담습니다. `NUM`이면 `n`만, `NEG`면 `a`만 쓰고 나머지는 비워 둡니다. 어느 칸이 유효한지는 `kind`를 보고 **프로그래머가** 판단합니다. Rust `enum`은 모양마다 필요한 값만 가지고, `match`가 모든 모양을 다뤘는지 검사합니다.
- `free_expr`는 자식을 먼저, 자기 자신을 마지막에 해제합니다(후위 순회, Day 73).
- `bigger`가 `e`를 가지로 가지게 된 뒤에는 `free_expr(bigger)` **한 번**으로 모두 해제합니다. `free_expr(e)`를 또 부르면 두 번 해제입니다. Rust에서는 `e`를 옮긴 뒤 쓰면 컴파일 오류라 이 실수가 불가능합니다.
- `switch`가 끝난 뒤의 `return 0;`은 컴파일러를 달래기 위한 줄입니다. `kind`에 엉뚱한 값이 들어와도 C는 막지 못합니다.

## 10. 힙 포인터 대응표

| 하고 싶은 일             | Rust                   | C                             | Python                  |
| ------------------------ | ---------------------- | ----------------------------- | ----------------------- |
| 값 하나를 힙에           | `Box::new(v)`          | `malloc(sizeof *p)` 후 대입   | (모든 객체가 힙)        |
| 없을 수도 있는 다음 칸   | `Option<Box<Node>>`    | `struct node *next` (`NULL`)  | `self.next = None`      |
| 칸 떼어 내기             | `self.head.take()`     | `n = *head; *head = n->next;` | `self.head = node.next` |
| 한 칸 해제               | 자동(주인이 사라질 때) | `free(n)`                     | 자동                    |
| 트리 전체 해제           | 자동(자식부터)         | 재귀 `free`(자식부터 직접)    | 자동                    |
| 여러 곳에서 같은 칸 공유 | `Rc<T>`(Day 31, 81)    | 포인터 복사(해제 책임은 약속) | 그냥 대입               |

## 11. 세 언어 비교

| 관점        | Rust `Box`              | C 포인터                   | Python 참조                            |
| ----------- | ----------------------- | -------------------------- | -------------------------------------- |
| 주인        | `Box` 하나(옮기면 바뀜) | 약속으로 정함              | 없음(여럿이 가리킴)                    |
| 해제        | 자동, 정확히 한 번      | 직접, 순서도 직접          | 자동(개수 세기)                        |
| 널          | 없음(`Option`으로 표현) | `NULL`(검사를 잊으면 멈춤) | `None`(속성을 읽으면 `AttributeError`) |
| 재귀 자료형 | `Box`로 감싸야 함       | 포인터로 써야 함           | 그냥 됨                                |
| 크기        | 주소 하나(8바이트)      | 주소 하나                  | 객체마다 추가 정보                     |

## 12. 자주 하는 실수

### 실수 1: 재귀 자료형을 Box 없이 선언한다

```rust
// 파일: infinite_node.rs (컴파일 오류: E0072)
struct Node {
    value: i32,
    next: Option<Node>,
}

fn main() {
    let n = Node { value: 1, next: None };
    println!("{}", n.value);
}
```

실습의 디버그 문제와 같은 오류입니다. `Option<Box<Node>>`로 바꾸세요. 컴파일러의 도움말(`help: insert some indirection`)도 같은 방법을 알려 줍니다.

### 실수 2: Box에 연산자를 바로 쓴다

```rust
// 파일: box_add.rs (컴파일 오류: E0369)
fn main() {
    let b = Box::new(5);
    let c = b + 1;
    println!("{c}");
}
```

메서드 호출과 달리 연산자는 자동으로 안쪽을 따라가지 않습니다. `*b + 1`로 쓰세요.

### 실수 3: C에서 칸을 해제한 뒤 next를 읽는다

```c
for (struct node *p = head; p != NULL; p = p->next) {
    free(p);   // 다음 반복의 p->next가 해제된 칸을 읽는다
}
```

`struct node *next = p->next; free(p); p = next;`처럼 먼저 저장하세요. 실습의 예측 문제가 올바른 모양입니다.

### 실수 4: 가지로 넘긴 트리를 따로 또 해제한다 (C)

`bigger`의 가지가 된 `e`를 `free_expr(e)`로 한 번 더 해제하면 두 번 해제입니다. 어떤 포인터가 다른 구조의 **일부가 되었는지** 주석으로 남기세요. Rust에서는 옮긴 값을 쓰면 컴파일 오류입니다.

### 실수 5: 아주 긴 리스트를 재귀로 처리한다

재귀 함수는 칸마다 스택을 씁니다. 수십만 칸의 리스트를 재귀로 돌면 스택이 넘칩니다. 실습의 변형 문제처럼 반복으로 바꾸세요. Rust의 `Box` 리스트는 자동 해제도 재귀로 일어나서, 아주 긴 리스트는 `Drop`을 직접 만들어 반복으로 해제하기도 합니다.

## 13. Q&A

**Q. Box와 C의 malloc은 성능이 같나요?**

A. 거의 같습니다. `Box::new`는 할당자에서 공간을 받고, 해제는 `free`와 같은 일을 합니다. 차이는 해제 코드를 컴파일러가 알맞은 곳에 넣어 준다는 점뿐입니다. 스택 값보다는 느리므로, 필요할 때만 쓰세요.

**Q. 연결 리스트는 실제로 자주 쓰나요?**

A. Rust와 Python에서는 거의 쓰지 않습니다. `Vec`이나 리스트가 대부분 더 빠릅니다. 값들이 메모리에 붙어 있어 CPU 캐시를 잘 쓰기 때문입니다. 하지만 "칸이 다른 칸을 가리키는" 구조는 트리, 그래프, 해시 테이블의 충돌 처리 등 곳곳에 쓰여서, 연결 리스트로 원리를 익히는 것이 중요합니다(Day 60).

**Q. 두 칸이 서로를 가리키는(양방향) 리스트도 Box로 만들 수 있나요?**

A. `Box`는 주인이 하나라 "앞 칸도 뒤 칸을 소유하고, 뒤 칸도 앞 칸을 소유"하는 모양은 만들 수 없습니다. `Rc<RefCell<T>>`와 `Weak`를 쓰거나, 모든 칸을 `Vec`에 두고 번호로 가리키는 방법을 씁니다(Day 81).

**Q. Python에서 트리가 아주 깊으면 어떻게 되나요?**

A. Python은 재귀 깊이를 기본 1000 정도로 제한해서, 그보다 깊으면 `RecursionError`가 납니다. 깊은 트리는 스택(리스트)을 써서 반복으로 처리합니다(Day 73).

## 14. 핵심 요약

- `Box<T>`는 값 하나를 힙에 두고 그 공간을 **소유**합니다. 주인이 범위를 벗어나면 자동으로 해제되고, 옮기면 주소(8바이트)만 복사됩니다.
- 메서드와 `&Box<T>` → `&T`는 자동으로 안쪽을 따라가지만, 연산자에는 `*b`로 꺼내야 합니다.
- **재귀 자료형**은 안쪽을 `Box`로 감싸야 크기가 정해집니다(E0072). 없을 수도 있는 다음 칸은 `Option<Box<Node>>`이고, `None`은 널 주소로 표현되어 비용이 C 포인터와 같습니다.
- 빌린 자리에서 값을 떼어 낼 때는 `take()`를 씁니다.
- C는 `struct node *next`와 `malloc`으로 같은 구조를 만들고, **해제 순서**(다음 칸 저장 후 해제, 자식 먼저)와 **해제 책임**을 직접 지킵니다.
- Python은 모든 속성이 참조라 재귀 구조를 그냥 만들 수 있고, 정리도 자동입니다.

## 15. 도전 문제

1. **(Rust)** 스택에 `fn reverse(&mut self)`를 추가하세요. 칸을 새로 만들지 않고, `take()`로 칸을 하나씩 떼어 다른 리스트의 앞에 붙이면 됩니다.
2. **(Rust)** 수식 트리에 `Sub`와 `Div`를 추가하고, 0으로 나누면 `Err`를 돌려주는 `fn eval(e: &Expr) -> Result<i64, String>`로 바꾸세요.
3. **(C)** 수식 트리를 출력하는 `void show(const struct expr *e)`를 만들어 Rust의 `show`와 같은 결과가 나오게 하세요.
4. **(Python)** 연결 리스트 스택에 `__iter__`를 추가해 `for x in s:`로 머리부터 값을 돌 수 있게 하세요(`yield`를 쓰면 됩니다).
