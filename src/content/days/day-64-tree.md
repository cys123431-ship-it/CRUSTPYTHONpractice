---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-64-tree
courseId: crp-92
phaseId: phase-06
dayNumber: 64
date: "2026-12-03"
title: 트리와 이진 트리 순회 — 부모와 자식으로 이어진 계층
summary: 루트, 부모, 자식, 잎, 깊이, 높이 같은 트리 용어를 익히고, 이진 트리를 C 포인터, Python 객체, Rust Option<Box>로 만듭니다. 전위·중위·후위 순회를 재귀로, 레벨 순회를 큐로 구현하고, 수식 트리로 Day 63의 전위·중위·후위 표기식이 순회 순서와 같다는 것을 확인합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-63-linear-review]
learningObjectives:
  - 루트, 부모, 자식, 형제, 잎, 서브트리, 깊이, 높이를 그림에서 찾아 설명한다.
  - 전위·중위·후위 순회의 방문 순서를 손으로 적고 재귀 코드로 구현한다.
  - 큐를 써서 트리를 위에서 아래로, 왼쪽에서 오른쪽으로 방문하는 레벨 순회를 구현한다.
  - 노드 수, 잎 수, 높이를 "왼쪽 서브트리 + 오른쪽 서브트리"의 재귀로 계산한다.
  - C에서 트리를 후위 순서로 해제해야 하는 이유를 설명하고, 수식 트리를 세 언어로 계산한다.
concepts:
  [
    tree,
    binary tree,
    root,
    leaf,
    depth,
    height,
    preorder,
    inorder,
    postorder,
    level order,
    recursion,
    expression tree,
  ]
runnerMode: python
playgroundSource: |
  # 파일: tree.py — 노드를 추가하거나 순회 함수를 바꿔 실행해 보세요.
  class Node:
      def __init__(self, value, left=None, right=None):
          self.value = value
          self.left = left
          self.right = right


  def preorder(node, out):
      if node is None:
          return
      out.append(node.value)
      preorder(node.left, out)
      preorder(node.right, out)


  root = Node("A", Node("B", Node("D"), Node("E", Node("G"))), Node("C", None, Node("F")))
  result = []
  preorder(root, result)
  print("전위:", " ".join(result))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day64-predict-py
    title: 중위 순회 순서 예측하기
    kind: predict
    objective: 왼쪽 서브트리 → 자신 → 오른쪽 서브트리 순서를 적용한다.
    prompt: 출력될 문자열을 예측하세요.
    starter: |-
      class Node:
          def __init__(self, value, left=None, right=None):
              self.value = value
              self.left = left
              self.right = right


      def inorder(node):
          if node is None:
              return ""
          return inorder(node.left) + node.value + inorder(node.right)


      root = Node("M", Node("F", Node("B"), Node("H")), Node("T", Node("P")))
      print(inorder(root))
    answer: BFHMPT
    hint: "M의 왼쪽 서브트리(F, B, H)를 먼저 모두 방문합니다. 그 안에서도 F의 왼쪽 B가 먼저입니다."
    explanation: "왼쪽 서브트리의 중위 순회는 B F H, 그다음 루트 M, 오른쪽 서브트리는 P T입니다. 이 트리는 이진 탐색 트리라서 중위 순회 결과가 알파벳 순서가 됩니다(Day 65)."
    commonMistakes:
      - "루트 M을 먼저 적어 전위 순회와 혼동함"
      - "T의 왼쪽 자식 P를 T 뒤에 적음"
    language: python
    verification: run
  - id: ex-day64-predict-c
    title: C 트리의 높이 계산하기
    kind: predict
    objective: 재귀로 계산한 높이와 노드 수를 추적한다.
    prompt: 출력될 두 숫자(높이, 노드 수)를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stddef.h>

      typedef struct Node {
          int value;
          struct Node *left, *right;
      } Node;

      int height(const Node *n) {
          if (n == NULL) return 0;
          int l = height(n->left), r = height(n->right);
          return 1 + (l > r ? l : r);
      }

      int count(const Node *n) {
          return n == NULL ? 0 : 1 + count(n->left) + count(n->right);
      }

      int main(void) {
          Node d = {4, NULL, NULL}, c = {3, &d, NULL};
          Node b = {2, NULL, &c}, e = {5, NULL, NULL};
          Node a = {1, &b, &e};
          printf("%d %d\n", height(&a), count(&a));
          return 0;
      }
    answer: "4 5"
    hint: "a → b → c → d로 네 층이 이어집니다. 빈 트리의 높이를 0으로 정의했습니다."
    explanation: "가장 긴 경로는 1 → 2 → 3 → 4로 노드 4개이므로 높이는 4입니다. 노드는 1~5 모두 5개입니다. 높이는 '왼쪽과 오른쪽 중 더 높은 쪽 + 1'로 재귀적으로 계산됩니다."
    commonMistakes:
      - "간선 수로 세어 3이라고 적음(이 코드는 노드 수 기준 높이)"
      - "왼쪽과 오른쪽 높이를 더해 5라고 적음"
    language: c
    verification: run
  - id: ex-day64-fill
    title: Rust 잎 개수 세기 빈칸 채우기
    kind: fill
    objective: 자식이 모두 없는 노드를 match로 구별한다.
    prompt: "count_leaves의 빈칸 두 곳을 채우세요. 노드가 없으면 0, 두 자식이 모두 None이면 1, 그 밖에는 양쪽 결과를 더합니다."
    starter: |-
      struct Node {
          value: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn leaf(value: i32) -> Option<Box<Node>> {
          Some(Box::new(Node { value, left: None, right: None }))
      }

      fn count_leaves(node: &Option<Box<Node>>) -> usize {
          match node {
              None => _____,
              Some(n) if n.left.is_none() && n.right.is_none() => _____,
              Some(n) => count_leaves(&n.left) + count_leaves(&n.right),
          }
      }

      fn main() {
          let root = Some(Box::new(Node {
              value: 1,
              left: Some(Box::new(Node { value: 2, left: leaf(4), right: None })),
              right: Some(Box::new(Node { value: 3, left: leaf(5), right: leaf(6) })),
          }));
          let value = root.as_ref().map(|n| n.value).unwrap_or(0);
          println!("root={} leaves={}", value, count_leaves(&root));
      }
    answer: |-
      struct Node {
          value: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn leaf(value: i32) -> Option<Box<Node>> {
          Some(Box::new(Node { value, left: None, right: None }))
      }

      fn count_leaves(node: &Option<Box<Node>>) -> usize {
          match node {
              None => 0,
              Some(n) if n.left.is_none() && n.right.is_none() => 1,
              Some(n) => count_leaves(&n.left) + count_leaves(&n.right),
          }
      }

      fn main() {
          let root = Some(Box::new(Node {
              value: 1,
              left: Some(Box::new(Node { value: 2, left: leaf(4), right: None })),
              right: Some(Box::new(Node { value: 3, left: leaf(5), right: leaf(6) })),
          }));
          let value = root.as_ref().map(|n| n.value).unwrap_or(0);
          println!("root={} leaves={}", value, count_leaves(&root));
      }
    output: "root=1 leaves=3"
    hint: "빈 트리에는 잎이 없습니다. 자식이 하나도 없는 노드는 그 자체가 잎 하나입니다."
    explanation: "잎은 4, 5, 6 세 개입니다. 노드 2는 오른쪽 자식이 없지만 왼쪽 자식 4가 있으므로 잎이 아닙니다. match 갈래는 위에서부터 검사되므로 가드(if)가 있는 갈래를 일반 Some(n) 갈래보다 먼저 써야 합니다."
    commonMistakes:
      - "None일 때 1을 돌려줘 빈 자리까지 잎으로 셈"
      - "가드 갈래를 Some(n) 갈래 뒤에 둬서 절대 실행되지 않게 함"
    language: rust
    verification: run
  - id: ex-day64-modify
    title: Python 트리를 좌우 반전하기
    kind: modify
    objective: 모든 노드의 왼쪽과 오른쪽 자식을 재귀적으로 바꾼다.
    prompt: "mirror(node)를 구현해 트리를 거울에 비친 모양으로 바꾸세요. 반전 후 레벨 순회 결과가 A C B F E D가 되어야 합니다."
    starter: |-
      from collections import deque


      class Node:
          def __init__(self, value, left=None, right=None):
              self.value = value
              self.left = left
              self.right = right


      def level_order(root):
          out, q = [], deque([root])
          while q:
              node = q.popleft()
              out.append(node.value)
              if node.left:
                  q.append(node.left)
              if node.right:
                  q.append(node.right)
          return " ".join(out)


      def mirror(node):
          pass


      root = Node("A", Node("B", Node("D"), Node("E")), Node("C", None, Node("F")))
      mirror(root)
      print(level_order(root))
    answer: |-
      from collections import deque


      class Node:
          def __init__(self, value, left=None, right=None):
              self.value = value
              self.left = left
              self.right = right


      def level_order(root):
          out, q = [], deque([root])
          while q:
              node = q.popleft()
              out.append(node.value)
              if node.left:
                  q.append(node.left)
              if node.right:
                  q.append(node.right)
          return " ".join(out)


      def mirror(node):
          if node is None:
              return
          node.left, node.right = node.right, node.left
          mirror(node.left)
          mirror(node.right)


      root = Node("A", Node("B", Node("D"), Node("E")), Node("C", None, Node("F")))
      mirror(root)
      print(level_order(root))
    output: "A C B F E D"
    hint: "현재 노드의 두 자식을 바꾼 다음, 두 서브트리에도 같은 일을 시키면 됩니다. 빈 노드에서 멈추세요."
    explanation: "A의 자식이 C, B 순서가 되고, C의 자식(없음, F)은 (F, 없음)으로, B의 자식(D, E)는 (E, D)로 바뀝니다. 레벨 순회는 A / C B / F E D입니다. Python의 동시 대입 덕분에 임시 변수 없이 두 값을 바꿀 수 있습니다."
    commonMistakes:
      - "node.left = node.right 한 줄로 바꿔서 원래 왼쪽 자식을 잃어버림"
      - "루트의 자식만 바꾸고 재귀를 하지 않아 아래 단계는 그대로 남음"
    language: python
    verification: run
  - id: ex-day64-debug
    title: C 트리 해제 순서 고치기
    kind: debug
    objective: 부모를 먼저 해제하면 자식의 주소를 읽을 수 없다는 것을 이해한다.
    prompt: "free_tree가 노드를 먼저 해제한 뒤 n->left, n->right를 읽습니다(use-after-free). 후위 순서로 고쳐서 자식부터 해제하세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int value;
          struct Node *left, *right;
      } Node;

      static int freed = 0;

      Node *make(int value, Node *left, Node *right) {
          Node *n = malloc(sizeof *n);
          if (n == NULL) exit(1);
          n->value = value;
          n->left = left;
          n->right = right;
          return n;
      }

      void free_tree(Node *n) {
          if (n == NULL) return;
          free(n);
          freed++;
          free_tree(n->left);
          free_tree(n->right);
      }

      int main(void) {
          Node *root = make(1, make(2, NULL, NULL), make(3, make(4, NULL, NULL), NULL));
          free_tree(root);
          printf("해제: %d\n", freed);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int value;
          struct Node *left, *right;
      } Node;

      static int freed = 0;

      Node *make(int value, Node *left, Node *right) {
          Node *n = malloc(sizeof *n);
          if (n == NULL) exit(1);
          n->value = value;
          n->left = left;
          n->right = right;
          return n;
      }

      void free_tree(Node *n) {
          if (n == NULL) return;
          free_tree(n->left);
          free_tree(n->right);
          free(n);
          freed++;
      }

      int main(void) {
          Node *root = make(1, make(2, NULL, NULL), make(3, make(4, NULL, NULL), NULL));
          free_tree(root);
          printf("해제: %d\n", freed);
          return 0;
      }
    output: "해제: 4"
    hint: "자식의 주소는 부모 노드 안에 들어 있습니다. 부모를 먼저 반납하면 그 주소를 안전하게 읽을 수 없습니다."
    explanation: "두 서브트리를 먼저 해제하고 마지막에 자신을 해제하는 후위 순서입니다. 원래 코드는 이미 반납한 메모리에서 left와 right를 읽으므로 정의되지 않은 동작입니다. 우연히 '해제: 4'가 출력되더라도 틀린 코드입니다."
    commonMistakes:
      - "free 전에 left, right를 지역 변수에 저장하지도, 순서를 바꾸지도 않음"
      - "루트만 free해서 나머지 노드를 누수시킴"
    language: c
    verification: run
  - id: ex-day64-independent
    title: Rust로 루트에서 잎까지의 경로 합 구하기
    kind: independent
    objective: 재귀 호출에 누적값을 넘겨 모든 루트-잎 경로를 처리한다.
    prompt: "루트에서 각 잎까지 가는 경로의 값 합을 모두 구해 Vec에 모으세요. 아래 트리에서는 [10, 13, 9]가 출력되어야 합니다(왼쪽 잎부터)."
    starter: |-
      struct Node {
          value: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn node(value: i32, left: Option<Box<Node>>, right: Option<Box<Node>>) -> Option<Box<Node>> {
          Some(Box::new(Node { value, left, right }))
      }

      fn main() {
          //        5
          //      /   \
          //     3     4
          //    / \
          //   2   5
          let root = node(5, node(3, node(2, None, None), node(5, None, None)), node(4, None, None));
          println!("{}", root.is_some());
      }
    answer: |-
      struct Node {
          value: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn node(value: i32, left: Option<Box<Node>>, right: Option<Box<Node>>) -> Option<Box<Node>> {
          Some(Box::new(Node { value, left, right }))
      }

      fn path_sums(tree: &Option<Box<Node>>, sum_so_far: i32, out: &mut Vec<i32>) {
          if let Some(n) = tree {
              let sum = sum_so_far + n.value;
              if n.left.is_none() && n.right.is_none() {
                  out.push(sum);
              } else {
                  path_sums(&n.left, sum, out);
                  path_sums(&n.right, sum, out);
              }
          }
      }

      fn main() {
          let root = node(5, node(3, node(2, None, None), node(5, None, None)), node(4, None, None));
          let mut sums = Vec::new();
          path_sums(&root, 0, &mut sums);
          println!("{:?}", sums);
      }
    output: "[10, 13, 9]"
    hint: "지금까지의 합을 매개변수로 넘기고, 잎에 도착했을 때만 결과에 넣습니다. 결과 Vec은 &mut로 빌려서 모든 호출이 함께 씁니다."
    explanation: "경로는 5→3→2(10), 5→3→5(13), 5→4(9)입니다. 각 호출은 자기까지의 합을 자식에게 넘기므로 되돌아올 때 값을 빼는 작업이 필요 없습니다. 전위 순회와 같은 순서로 방문하므로 왼쪽 잎부터 결과가 쌓입니다."
    commonMistakes:
      - "None을 만났을 때 합을 push해서 잎이 아닌 빈 자리까지 결과에 넣음"
      - "out을 값으로 넘겨 호출마다 서로 다른 Vec에 쌓음"
    language: rust
    verification: run
quiz:
  - id: quiz-day64-01
    question: 자식이 하나도 없는 노드를 무엇이라고 부르나요?
    choices: ["루트(root)", "잎(leaf)", "부모(parent)", "형제(sibling)"]
    answerIndex: 1
    explanation: 잎은 트리의 끝에 있는 노드입니다. 루트는 부모가 없는 맨 위 노드입니다. 노드가 하나뿐인 트리에서는 그 노드가 루트이면서 잎입니다.
  - id: quiz-day64-02
    question: 이진 트리에서 '자신 → 왼쪽 서브트리 → 오른쪽 서브트리' 순서로 방문하는 순회는?
    choices: ["전위 순회", "중위 순회", "후위 순회", "레벨 순회"]
    answerIndex: 0
    explanation: 전(前)은 '앞'이라는 뜻으로, 자신을 가장 앞에 방문합니다. 중위는 가운데, 후위는 마지막에 자신을 방문합니다.
  - id: quiz-day64-03
    question: 레벨 순회(위에서 아래로, 왼쪽에서 오른쪽으로)를 구현할 때 쓰는 자료구조는?
    choices: ["스택", "큐", "해시 맵", "정렬된 배열"]
    answerIndex: 1
    explanation: 먼저 발견한 노드(위층)를 먼저 처리하고, 그 자식들은 뒤에 줄을 세워야 하므로 큐입니다. 큐 대신 스택을 쓰면 깊이 우선으로 방문하게 됩니다.
  - id: quiz-day64-04
    question: C에서 이진 트리의 모든 노드를 해제할 때 알맞은 순서는?
    choices:
      - 전위(자신 먼저)
      - 중위
      - 후위(자식들 먼저, 자신은 마지막)
      - 순서는 상관없다
    answerIndex: 2
    explanation: 자식의 주소는 부모 노드 안에 있으므로 부모를 먼저 해제하면 자식에게 갈 수 없습니다. 자식들을 모두 해제한 뒤 자신을 해제하는 후위 순서가 안전합니다.
  - id: quiz-day64-05
    question: "수식 트리 (3 + 4) * 2를 후위 순회하면 어떤 결과가 나오나요?"
    choices: ["* + 3 4 2", "3 + 4 * 2", "3 4 + 2 *", "2 * 3 4 +"]
    answerIndex: 2
    explanation: 후위 순회는 왼쪽 서브트리(3 4 +), 오른쪽 서브트리(2), 자신(*) 순서입니다. Day 63의 후위 표기식과 같습니다. 전위 순회는 전위 표기식(* + 3 4 2)이 됩니다.
---

## 1. 오늘 배울 내용

지금까지의 자료구조는 모두 원소가 **한 줄로** 늘어선 **선형** 구조였습니다. 오늘부터는 원소가 **가지를 치며** 퍼지는 **비선형** 구조를 배웁니다. 그 첫 번째가 **트리(tree)** 입니다.

1. 트리가 필요한 상황과 트리 용어(루트, 부모, 자식, 잎, 깊이, 높이)를 익힙니다.
2. 자식이 최대 둘인 **이진 트리**를 C, Python, Rust로 만듭니다.
3. 트리의 모든 노드를 방문하는 네 가지 방법을 배웁니다.
   - 재귀로 구현하는 **전위·중위·후위 순회**
   - 큐로 구현하는 **레벨 순회**
4. 노드 수, 잎 수, 높이를 재귀로 계산합니다.
5. 응용으로 **수식 트리**를 만들어, 세 순회가 Day 63의 전위·중위·후위 표기식과 같다는 것을 확인합니다.

> **준비물**: Day 24의 **재귀**가 오늘의 핵심 도구입니다. "함수가 자기 자신을 더 작은 문제에 대해 부르고, 가장 작은 문제(빈 트리)에서 멈춘다"는 생각을 떠올려 두세요.

## 2. 왜 트리가 필요한가

다음 자료들은 한 줄로 늘어놓기 어렵습니다.

- 컴퓨터의 **폴더 구조**: `문서` 폴더 안에 `학교`와 `취미` 폴더가 있고, `학교` 안에 다시 `수학`, `영어`가 있습니다.
- 회사의 **조직도**: 대표 아래 부서장들, 그 아래 팀원들.
- 웹 페이지의 **HTML**: `<html>` 안에 `<head>`와 `<body>`, `<body>` 안에 `<div>`들.
- 수식 `(3 + 4) * 2`: `*`의 왼쪽은 `3 + 4`라는 **또 하나의 수식**이고, 오른쪽은 `2`입니다.

모두 "하나가 여러 개를 품고, 그 각각이 다시 여러 개를 품는" **계층** 구조입니다. 트리는 이런 계층을 표현하는 자료구조입니다. 또한 Day 65의 **이진 탐색 트리**와 Day 66의 **힙**처럼, 트리 모양을 이용해 검색과 정렬을 빠르게 하는 자료구조의 바탕이 됩니다.

## 3. 그림으로 이해하기

이 수업 내내 쓸 이진 트리입니다.

```text
                A            ← 루트(root), 깊이 0
              /   \
             B     C         ← 깊이 1
            / \     \
           D   E     F       ← 깊이 2
              /
             G               ← 깊이 3
```

| 용어              | 뜻                                                | 이 그림에서                |
| ----------------- | ------------------------------------------------- | -------------------------- |
| 노드(node)        | 트리의 원소 하나                                  | A~G, 7개                   |
| 루트(root)        | 부모가 없는 맨 위 노드                            | A                          |
| 부모 / 자식       | 바로 위 / 바로 아래로 연결된 노드                 | B의 부모는 A, 자식은 D와 E |
| 형제(sibling)     | 부모가 같은 노드                                  | D와 E, B와 C               |
| 잎(leaf)          | 자식이 없는 노드                                  | D, G, F                    |
| 간선(edge)        | 부모와 자식을 잇는 선                             | 6개 (노드 수 - 1)          |
| 서브트리(subtree) | 어떤 노드와 그 모든 자손으로 이루어진 트리        | B를 루트로 하는 B, D, E, G |
| 깊이(depth)       | 루트에서 그 노드까지의 간선 수                    | G의 깊이는 3               |
| 높이(height)      | 트리의 층 수(루트부터 가장 깊은 잎까지의 노드 수) | 4                          |

> **참고**: 높이를 "노드 수"로 세는 책도 있고 "간선 수"로 세는 책도 있습니다. 간선 기준이면 이 트리의 높이는 3입니다. 이 수업은 **빈 트리의 높이를 0**으로 두고 노드 수로 셉니다. 어떤 정의를 쓰는지 항상 먼저 확인하세요.

**이진 트리(binary tree)** 는 모든 노드의 자식이 **최대 둘**인 트리입니다. 두 자식을 **왼쪽 자식**과 **오른쪽 자식**으로 구별합니다. C의 오른쪽 자식 F처럼 한쪽만 있을 수도 있습니다.

트리의 가장 중요한 성질은 **재귀적 구조**입니다. 트리는 "루트 하나 + 왼쪽 서브트리 + 오른쪽 서브트리"이고, 두 서브트리도 다시 트리입니다. 그래서 트리 문제는 거의 항상 이렇게 풀립니다.

```text
트리에 대한 답 = (루트에서 할 일) + (왼쪽 서브트리에 대한 답) + (오른쪽 서브트리에 대한 답)
빈 트리에 대한 답 = 가장 간단한 값 (0, 빈 목록 등)
```

## 4. 천천히 풀어보기

### 4.1 노드를 어떻게 저장하는가

연결 리스트의 노드가 next 하나를 가졌다면, 이진 트리의 노드는 **left와 right** 두 개를 가집니다. 자식이 없으면 NULL(None)입니다.

```text
       ┌──────┬───────┬───────┐
       │ left │ value │ right │
       └──┬───┴───────┴───┬───┘
          ▼               ▼
      왼쪽 자식       오른쪽 자식
```

### 4.2 깊이 우선 순회 세 가지

트리의 모든 노드를 한 번씩 방문하는 것을 **순회(traversal)** 라고 합니다. 한 서브트리를 끝까지 파고든 다음 옆으로 가는 방법을 **깊이 우선 순회**라고 하며, **자신을 언제 방문하는가**에 따라 세 가지로 나뉩니다.

| 순회            | 순서                     | 이 트리의 결과 | 기억법            |
| --------------- | ------------------------ | -------------- | ----------------- |
| 전위(preorder)  | **자신** → 왼쪽 → 오른쪽 | A B D E G C F  | 자신이 **앞**     |
| 중위(inorder)   | 왼쪽 → **자신** → 오른쪽 | D B G E A C F  | 자신이 **가운데** |
| 후위(postorder) | 왼쪽 → 오른쪽 → **자신** | D G E B F C A  | 자신이 **뒤**     |

전위 순회를 손으로 해 봅시다. "자신, 왼쪽 전부, 오른쪽 전부"입니다.

```text
A 방문 → A의 왼쪽(B 서브트리)을 전위로
          B 방문 → B의 왼쪽(D) → D 방문 (자식 없음)
                  → B의 오른쪽(E 서브트리) → E 방문 → E의 왼쪽 G 방문
       → A의 오른쪽(C 서브트리)을 전위로
          C 방문 → C의 왼쪽 없음 → C의 오른쪽 F 방문
결과: A B D E G C F
```

코드로 옮기면 놀랄 만큼 짧습니다.

```text
전위(node):
    node가 없으면 돌아간다
    node를 방문한다
    전위(node의 왼쪽)
    전위(node의 오른쪽)
```

중위와 후위는 "방문한다" 줄의 **위치만** 바뀝니다. 세 순회는 쓰임새가 다릅니다.

- **전위**: 부모를 자식보다 먼저 처리해야 할 때. 트리를 복사하거나, 폴더 구조를 위에서부터 출력할 때.
- **중위**: 이진 탐색 트리에서 값을 **정렬된 순서**로 얻을 때(Day 65).
- **후위**: 자식을 부모보다 먼저 처리해야 할 때. 폴더 크기 계산(하위 폴더 크기를 먼저 알아야 함), 트리 **해제**(자식을 먼저 해제해야 함), 수식 계산.

### 4.3 레벨 순회: 큐로 한 층씩

위층부터 아래층으로, 같은 층에서는 왼쪽부터 방문하는 방법을 **레벨 순회(level-order)** 또는 **너비 우선 순회**라고 합니다. 이 트리의 결과는 `A B C D E F G`입니다. 재귀로는 자연스럽게 되지 않고 **큐**가 필요합니다.

```text
큐에 루트를 넣는다
큐가 빌 때까지:
    노드 하나를 꺼내 방문한다
    그 노드의 왼쪽 자식, 오른쪽 자식을 (있으면) 큐에 넣는다
```

| 꺼낸 노드 | 큐에 넣은 자식 | 큐 상태(앞 → 뒤) |
| --------- | -------------- | ---------------- |
| (시작)    | A              | `A`              |
| A         | B, C           | `B C`            |
| B         | D, E           | `C D E`          |
| C         | F              | `D E F`          |
| D         | 없음           | `E F`            |
| E         | G              | `F G`            |
| F         | 없음           | `G`              |
| G         | 없음           | (비어 있음)      |

먼저 발견한 위층 노드가 먼저 나오므로 FIFO인 큐가 딱 맞습니다. 이 방법은 Day 69의 **너비 우선 탐색(BFS)** 과 같은 알고리즘입니다.

### 4.4 재귀로 계산하는 트리의 성질

노드 수, 잎 수, 높이는 모두 2절의 공식으로 계산합니다.

| 함수        | 빈 트리 | 노드가 있을 때                                        |
| ----------- | ------- | ----------------------------------------------------- |
| `count(t)`  | 0       | 1 + count(왼쪽) + count(오른쪽)                       |
| `leaves(t)` | 0       | 자식이 없으면 1, 아니면 leaves(왼쪽) + leaves(오른쪽) |
| `height(t)` | 0       | 1 + max(height(왼쪽), height(오른쪽))                 |

`height`를 G에서부터 거꾸로 계산해 보면, G는 두 자식이 빈 트리(0)이므로 1, E는 1 + max(1, 0) = 2, B는 1 + max(1, 2) = 3, A는 1 + max(3, 2) = 4입니다. 자식들의 답을 먼저 알아야 자신의 답을 알 수 있으므로 **후위 순회의 모양**입니다.

## 5. C로 구현하기

C에서는 노드를 `malloc`으로 만들고 left, right 포인터로 연결합니다. 순회 결과를 버퍼에 모아 출력하고, 마지막에 후위 순서로 모든 노드를 해제합니다.

```c
// 파일: binary_tree.c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    char value;
    struct Node *left;
    struct Node *right;
} Node;

Node *make(char value, Node *left, Node *right) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    n->value = value;
    n->left = left;
    n->right = right;
    return n;
}

void preorder(const Node *n) {
    if (n == NULL) return;
    printf("%c ", n->value);        // 자신
    preorder(n->left);              // 왼쪽
    preorder(n->right);             // 오른쪽
}

void inorder(const Node *n) {
    if (n == NULL) return;
    inorder(n->left);
    printf("%c ", n->value);
    inorder(n->right);
}

void postorder(const Node *n) {
    if (n == NULL) return;
    postorder(n->left);
    postorder(n->right);
    printf("%c ", n->value);
}

void level_order(const Node *root) {
    const Node *queue[64];          // 노드 주소를 담는 큐
    int front = 0, rear = 0;
    if (root != NULL) {
        queue[rear++] = root;
    }
    while (front < rear) {
        const Node *n = queue[front++];
        printf("%c ", n->value);
        if (n->left != NULL) queue[rear++] = n->left;
        if (n->right != NULL) queue[rear++] = n->right;
    }
}

int count(const Node *n) {
    if (n == NULL) return 0;
    return 1 + count(n->left) + count(n->right);
}

int leaves(const Node *n) {
    if (n == NULL) return 0;
    if (n->left == NULL && n->right == NULL) return 1;
    return leaves(n->left) + leaves(n->right);
}

int height(const Node *n) {
    if (n == NULL) return 0;
    int l = height(n->left);
    int r = height(n->right);
    return 1 + (l > r ? l : r);
}

void print_sideways(const Node *n, int depth) {
    if (n == NULL) return;
    print_sideways(n->right, depth + 1);        // 오른쪽을 위에
    printf("%*s%c\n", depth * 4, "", n->value);   // 깊이만큼 들여쓰기
    print_sideways(n->left, depth + 1);
}

int free_tree(Node *n) {
    if (n == NULL) return 0;
    int freed = free_tree(n->left) + free_tree(n->right);   // 자식 먼저
    free(n);                                                 // 자신은 마지막
    return freed + 1;
}

int main(void) {
    Node *root = make('A',
                      make('B', make('D', NULL, NULL),
                                make('E', make('G', NULL, NULL), NULL)),
                      make('C', NULL, make('F', NULL, NULL)));

    printf("전위: "); preorder(root);    printf("\n");
    printf("중위: "); inorder(root);     printf("\n");
    printf("후위: "); postorder(root);   printf("\n");
    printf("레벨: "); level_order(root); printf("\n");
    printf("노드 %d개, 잎 %d개, 높이 %d\n", count(root), leaves(root), height(root));

    printf("옆으로 누운 트리(오른쪽이 위):\n");
    print_sideways(root, 0);

    printf("해제한 노드: %d\n", free_tree(root));
    root = NULL;
    printf("빈 트리 높이: %d\n", height(root));
    return 0;
}
```

실행 결과:

```text
전위: A B D E G C F
중위: D B G E A C F
후위: D G E B F C A
레벨: A B C D E F G
노드 7개, 잎 3개, 높이 4
옆으로 누운 트리(오른쪽이 위):
        F
    C
A
        E
            G
    B
        D
해제한 노드: 7
빈 트리 높이: 0
```

### 코드 한 부분씩 읽기

| 코드                                                 | 설명                                                                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `struct Node *left; struct Node *right;`             | Day 61의 next 자리에 포인터 두 개가 있습니다. 둘 다 NULL이면 잎입니다.                                                                 |
| `make('A', make('B', ...), make('C', ...))`          | 함수 인자는 호출 전에 먼저 계산되므로 **안쪽 노드(자식)부터** 만들어집니다. 트리 모양을 코드에서 그대로 읽을 수 있게 들여쓰기했습니다. |
| `if (n == NULL) return;`                             | 재귀의 **멈춤 조건**입니다. 빈 트리에서는 할 일이 없습니다. 이 줄이 없으면 NULL을 역참조합니다.                                        |
| `preorder`, `inorder`, `postorder`                   | 세 함수는 `printf` 줄의 **위치만** 다릅니다. 순서를 직접 바꿔 가며 출력을 비교해 보세요.                                               |
| `const Node *queue[64]; front, rear`                 | Day 59의 선형 큐를 **노드 주소**의 큐로 썼습니다. 각 노드는 한 번만 들어가므로 크기 64면 이 트리에 충분합니다.                         |
| `return 1 + (l > r ? l : r);`                        | 조건 연산자 `? :`로 두 값 중 큰 값을 고릅니다. 두 서브트리 중 **더 높은 쪽**이 트리의 높이를 결정합니다.                               |
| `printf("%*s%c\n", depth * 4, "", n->value);`        | `%*s`는 너비를 인자로 받는 형식입니다. 빈 문자열 `""`을 `depth * 4`칸 너비로 출력하므로 깊이만큼 공백이 들어갑니다.                    |
| `print_sideways`: 오른쪽 → 자신 → 왼쪽               | 중위 순회를 **거꾸로** 한 것입니다. 종이를 시계 방향으로 90도 돌리면 3절의 그림과 같은 모양이 됩니다.                                  |
| `free_tree(n->left) + free_tree(n->right); free(n);` | **후위 순서**로 해제합니다. 부모를 먼저 해제하면 자식의 주소(`n->left`)를 읽을 수 없게 됩니다(실습의 디버그 문제).                     |

> **오류 주의**: 재귀 함수는 호출할 때마다 **호출 스택**에 공간을 씁니다. 균형 잡힌 트리는 깊이가 얕아 문제가 없지만, 노드가 한쪽으로만 수십만 개 이어진 트리(사실상 연결 리스트)를 재귀로 순회하면 호출 스택이 넘칠 수 있습니다(stack overflow). 그런 경우에는 명시적인 스택을 쓰는 반복문으로 바꿉니다(도전 문제 2).

## 6. Python으로 구현하기

Python 버전은 순회 결과를 **리스트로 돌려주는** 함수로 만들었습니다. 재귀 함수가 값을 돌려주면 결과를 다른 곳에 쓰기 쉽습니다.

```python
# 파일: binary_tree.py
from collections import deque


class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def preorder(node):
    if node is None:
        return []
    return [node.value] + preorder(node.left) + preorder(node.right)


def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)


def postorder(node):
    if node is None:
        return []
    return postorder(node.left) + postorder(node.right) + [node.value]


def level_order(root):
    result = []
    queue = deque([root] if root else [])
    while queue:
        node = queue.popleft()
        result.append(node.value)
        for child in (node.left, node.right):
            if child is not None:
                queue.append(child)
    return result


def levels(root):
    """층별로 묶어서 돌려준다: [[A], [B, C], ...]"""
    result, layer = [], [root] if root else []
    while layer:
        result.append([n.value for n in layer])
        layer = [c for n in layer for c in (n.left, n.right) if c is not None]
    return result


def count(node):
    return 0 if node is None else 1 + count(node.left) + count(node.right)


def leaves(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return leaves(node.left) + leaves(node.right)


def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


def depth_of(node, target, depth=0):
    """target 값을 가진 노드의 깊이. 없으면 None"""
    if node is None:
        return None
    if node.value == target:
        return depth
    found = depth_of(node.left, target, depth + 1)
    if found is not None:
        return found
    return depth_of(node.right, target, depth + 1)


root = Node("A",
            Node("B", Node("D"), Node("E", Node("G"))),
            Node("C", None, Node("F")))

print("전위:", " ".join(preorder(root)))
print("중위:", " ".join(inorder(root)))
print("후위:", " ".join(postorder(root)))
print("레벨:", " ".join(level_order(root)))
print("층별:", levels(root))
print(f"노드 {count(root)}개, 잎 {leaves(root)}개, 높이 {height(root)}")
print("G의 깊이:", depth_of(root, "G"), "/ Z의 깊이:", depth_of(root, "Z"))
print("빈 트리:", preorder(None), height(None))
```

실행 결과:

```text
전위: A B D E G C F
중위: D B G E A C F
후위: D G E B F C A
레벨: A B C D E F G
층별: [['A'], ['B', 'C'], ['D', 'E', 'F'], ['G']]
노드 7개, 잎 3개, 높이 4
G의 깊이: 3 / Z의 깊이: None
빈 트리: [] 0
```

### 코드 한 부분씩 읽기

| 코드                                                                     | 설명                                                                                                                                |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `return [node.value] + preorder(node.left) + preorder(node.right)`       | 세 리스트를 이어 붙입니다. 순서가 곧 순회의 정의입니다. 이해하기 쉽지만 리스트를 계속 새로 만들어 느린 편입니다(Q&A 참고).          |
| `Node("B", Node("D"), Node("E", Node("G")))`                             | 기본값 매개변수 덕분에 잎은 `Node("D")`처럼 짧게 만들 수 있습니다.                                                                  |
| `deque([root] if root else [])`                                          | 빈 트리면 빈 큐로 시작해 반복을 한 번도 돌지 않습니다.                                                                              |
| `for child in (node.left, node.right):`                                  | 두 자식을 튜플로 묶어 같은 코드로 처리했습니다. 왼쪽을 먼저 넣으므로 같은 층에서 왼쪽이 먼저 나옵니다.                              |
| `layer = [c for n in layer for c in (n.left, n.right) if c is not None]` | 이번 층 노드들의 자식을 모아 **다음 층**을 만듭니다. 큐 없이 층 단위로 처리하는 방법입니다. 이중 `for`는 앞의 것이 바깥 반복입니다. |
| `max(height(node.left), height(node.right))`                             | C 버전의 `l > r ? l : r`을 내장 함수 `max`로 썼습니다.                                                                              |
| `def depth_of(node, target, depth=0)`                                    | 재귀 호출마다 `depth + 1`을 넘겨 "지금 몇 층인지"를 들고 내려갑니다. 왼쪽에서 찾으면 오른쪽은 찾아보지 않습니다.                    |

## 7. Rust로 구현하기

Rust에서는 자식을 `Option<Box<Node>>`로 표현합니다. 순회 함수는 트리를 **빌려서**(`&Option<Box<Node>>`) 읽기만 하고, 결과를 `&mut Vec`에 모읍니다.

```rust
// 파일: binary_tree.rs
use std::collections::VecDeque;

struct Node {
    value: char,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

type Tree = Option<Box<Node>>;

fn node(value: char, left: Tree, right: Tree) -> Tree {
    Some(Box::new(Node { value, left, right }))
}

fn preorder(tree: &Tree, out: &mut Vec<char>) {
    if let Some(n) = tree {
        out.push(n.value);
        preorder(&n.left, out);
        preorder(&n.right, out);
    }
}

fn inorder(tree: &Tree, out: &mut Vec<char>) {
    if let Some(n) = tree {
        inorder(&n.left, out);
        out.push(n.value);
        inorder(&n.right, out);
    }
}

fn postorder(tree: &Tree, out: &mut Vec<char>) {
    if let Some(n) = tree {
        postorder(&n.left, out);
        postorder(&n.right, out);
        out.push(n.value);
    }
}

fn level_order(tree: &Tree) -> Vec<char> {
    let mut out = Vec::new();
    let mut queue: VecDeque<&Node> = VecDeque::new();
    if let Some(root) = tree.as_deref() {
        queue.push_back(root);
    }
    while let Some(n) = queue.pop_front() {
        out.push(n.value);
        if let Some(l) = n.left.as_deref() {
            queue.push_back(l);
        }
        if let Some(r) = n.right.as_deref() {
            queue.push_back(r);
        }
    }
    out
}

fn count(tree: &Tree) -> usize {
    match tree {
        None => 0,
        Some(n) => 1 + count(&n.left) + count(&n.right),
    }
}

fn leaves(tree: &Tree) -> usize {
    match tree {
        None => 0,
        Some(n) if n.left.is_none() && n.right.is_none() => 1,
        Some(n) => leaves(&n.left) + leaves(&n.right),
    }
}

fn height(tree: &Tree) -> usize {
    match tree {
        None => 0,
        Some(n) => 1 + height(&n.left).max(height(&n.right)),
    }
}

fn joined(values: &[char]) -> String {
    values.iter().map(|c| c.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let root = node(
        'A',
        node('B', node('D', None, None), node('E', node('G', None, None), None)),
        node('C', None, node('F', None, None)),
    );

    let mut out = Vec::new();
    preorder(&root, &mut out);
    println!("전위: {}", joined(&out));
    out.clear();
    inorder(&root, &mut out);
    println!("중위: {}", joined(&out));
    out.clear();
    postorder(&root, &mut out);
    println!("후위: {}", joined(&out));
    println!("레벨: {}", joined(&level_order(&root)));
    println!("노드 {}개, 잎 {}개, 높이 {}", count(&root), leaves(&root), height(&root));

    let empty: Tree = None;
    println!("빈 트리: 노드 {}개, 높이 {}", count(&empty), height(&empty));
}
```

실행 결과:

```text
전위: A B D E G C F
중위: D B G E A C F
후위: D G E B F C A
레벨: A B C D E F G
노드 7개, 잎 3개, 높이 4
빈 트리: 노드 0개, 높이 0
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type Tree = Option<Box<Node>>;`                | **타입 별칭**입니다. 긴 타입에 짧은 이름을 붙였습니다. "트리 = 비어 있거나(None), 루트 노드 하나를 가리킨다(Some)"는 정의가 그대로 드러납니다.                                |
| `fn preorder(tree: &Tree, out: &mut Vec<char>)` | 트리는 빌리기만 하고(`&`), 결과는 가변으로 빌린 Vec 하나에 모든 호출이 함께 씁니다. Python처럼 리스트를 매번 이어 붙이지 않아 효율적입니다.                                   |
| `if let Some(n) = tree { ... }`                 | 빈 트리면 아무것도 하지 않는 것이 곧 **멈춤 조건**입니다. C의 `if (n == NULL) return;`에 해당합니다.                                                                          |
| `preorder(&n.left, out);`                       | `n.left`는 `Option<Box<Node>>`, 즉 `Tree`이므로 그대로 빌려 넘기면 됩니다. `out`은 이미 `&mut Vec`이라 다시 `&mut`를 붙이지 않습니다.                                         |
| `VecDeque<&Node>`                               | 큐에는 노드를 **빌린 참조**를 넣습니다. 노드를 옮기지 않으므로 트리는 그대로 남습니다.                                                                                        |
| `n.left.as_deref()`                             | `Option<Box<Node>>`를 `Option<&Node>`로 바꿉니다. Day 61에서 연결 리스트를 빌려 순회할 때 쓴 도구입니다.                                                                      |
| `height(&n.left).max(height(&n.right))`         | 정수 타입의 `max` 메서드로 큰 값을 고릅니다.                                                                                                                                  |
| `Some(n) if ... => 1,`                          | **매치 가드**입니다. 패턴이 맞고 조건도 참일 때만 이 갈래를 씁니다. 위에서부터 검사하므로 일반 `Some(n)` 갈래보다 먼저 써야 합니다.                                           |
| 해제 코드가 없음                                | `root`가 main의 끝에서 사라지면 Box들이 자동으로 해제됩니다. 부모 Box가 해제될 때 안의 자식 Box들이 먼저 해제되므로, C에서 직접 쓴 **후위 해제**를 컴파일러가 대신 해 줍니다. |

## 8. 실행 추적

재귀 호출이 어떻게 쌓이고 풀리는지, `height(A)`를 따라가 봅시다. 들여쓰기는 호출 깊이입니다.

```text
height(A)
├─ height(B)
│  ├─ height(D)
│  │  ├─ height(없음) = 0
│  │  └─ height(없음) = 0
│  │  → 1 + max(0, 0) = 1
│  ├─ height(E)
│  │  ├─ height(G)
│  │  │  ├─ height(없음) = 0
│  │  │  └─ height(없음) = 0
│  │  │  → 1
│  │  └─ height(없음) = 0
│  │  → 1 + max(1, 0) = 2
│  → 1 + max(1, 2) = 3
├─ height(C)
│  ├─ height(없음) = 0
│  └─ height(F) → 1
│  → 1 + max(0, 1) = 2
→ 1 + max(3, 2) = 4
```

값이 **아래(잎)에서 위(루트)로** 올라오며 계산되는 것을 보세요. 이것이 트리 재귀의 전형적인 흐름입니다. 빈 트리에서 0을 돌려주는 멈춤 조건이 없으면 이 흐름은 시작조차 할 수 없습니다.

## 9. 다른 예제로 다시 이해하기

수식 `(3 + 4) * 2 - 10 / 5`를 트리로 그려 봅시다. **연산자는 부모, 피연산자는 자식**입니다. 우선순위가 낮아서 **가장 나중에 계산하는 연산자가 루트**가 됩니다. 이렇게 만든 트리를 **수식 트리(expression tree)** 라고 합니다.

```text
                 -
              /     \
            *         /
           / \       / \
          +   2    10   5
         / \
        3   4
```

이 트리를 순회하면 Day 63에서 배운 세 표기법이 그대로 나옵니다. 전위 순회는 전위 표기식 `- * + 3 4 2 / 10 5`, 중위 순회는 괄호가 빠진 중위 표기식 `3 + 4 * 2 - 10 / 5`, 후위 순회는 후위 표기식 `3 4 + 2 * 10 5 / -`입니다. 계산은 **후위 순회**로 합니다. 두 자식의 값을 먼저 구해야 부모 연산자를 적용할 수 있기 때문입니다. 중위 순회에서 괄호를 되살리려면 서브트리마다 괄호를 씌우면 됩니다.

Rust에서는 수식 트리를 **enum** 으로 아주 자연스럽게 표현할 수 있습니다. "수식은 숫자이거나, 연산자와 두 개의 수식이다"라는 정의를 그대로 코드로 옮깁니다.

```rust
// 파일: expr_tree.rs
enum Expr {
    Num(i64),
    Op(char, Box<Expr>, Box<Expr>),
}

use Expr::{Num, Op};

fn op(symbol: char, left: Expr, right: Expr) -> Expr {
    Op(symbol, Box::new(left), Box::new(right))
}

fn eval(e: &Expr) -> i64 {
    match e {
        Num(v) => *v,
        Op(symbol, l, r) => {
            let (a, b) = (eval(l), eval(r));    // 자식 먼저 = 후위
            match symbol {
                '+' => a + b,
                '-' => a - b,
                '*' => a * b,
                _ => a / b,
            }
        }
    }
}

fn prefix(e: &Expr) -> String {
    match e {
        Num(v) => v.to_string(),
        Op(s, l, r) => format!("{s} {} {}", prefix(l), prefix(r)),
    }
}

fn infix(e: &Expr) -> String {
    match e {
        Num(v) => v.to_string(),
        Op(s, l, r) => format!("({} {s} {})", infix(l), infix(r)),
    }
}

fn postfix(e: &Expr) -> String {
    match e {
        Num(v) => v.to_string(),
        Op(s, l, r) => format!("{} {} {s}", postfix(l), postfix(r)),
    }
}

fn main() {
    let tree = op('-', op('*', op('+', Num(3), Num(4)), Num(2)), op('/', Num(10), Num(5)));
    println!("전위: {}", prefix(&tree));
    println!("중위: {}", infix(&tree));
    println!("후위: {}", postfix(&tree));
    println!("값:   {}", eval(&tree));
}
```

실행 결과:

```text
전위: - * + 3 4 2 / 10 5
중위: (((3 + 4) * 2) - (10 / 5))
후위: 3 4 + 2 * 10 5 / -
값:   12
```

Python으로는 튜플만으로도 수식 트리를 만들 수 있습니다. `("+", 3, 4)`처럼 연산자와 두 자식을 묶고, 숫자는 그대로 잎이 됩니다.

```python
# 파일: expr_tree.py
def evaluate(e):
    if isinstance(e, int):
        return e
    op, left, right = e
    a, b = evaluate(left), evaluate(right)       # 자식 먼저 = 후위
    return {"+": a + b, "-": a - b, "*": a * b, "/": int(a / b)}[op]


def show(e):
    if isinstance(e, int):
        return str(e)
    op, left, right = e
    return f"({show(left)} {op} {show(right)})"


tree = ("-", ("*", ("+", 3, 4), 2), ("/", 10, 5))
print(show(tree), "=", evaluate(tree))
```

실행 결과:

```text
(((3 + 4) * 2) - (10 / 5)) = 12
```

## 10. 시간·공간 복잡도

노드 수를 n, 높이를 h라고 합니다.

| 연산                 | 시간 | 추가 공간                                    |
| -------------------- | ---- | -------------------------------------------- |
| 전위·중위·후위 순회  | O(n) | O(h) — 재귀 호출 스택                        |
| 레벨 순회            | O(n) | O(가장 넓은 층의 노드 수) — 큐               |
| 노드 수, 잎 수, 높이 | O(n) | O(h)                                         |
| 값으로 노드 찾기     | O(n) | O(h) — 일반 이진 트리는 전부 봐야 할 수 있음 |

높이 h는 트리 모양에 따라 크게 달라집니다. 노드가 고르게 퍼진 **균형 트리**는 h가 약 log₂ n이고, 한쪽으로만 이어진 **편향 트리**는 h = n입니다. Day 65에서 이 차이가 검색 속도를 결정한다는 것을 봅니다.

## 11. 세 언어 비교

| 관점             | C                             | Python                        | Rust                                    |
| ---------------- | ----------------------------- | ----------------------------- | --------------------------------------- |
| 자식 표현        | `struct Node *left, *right`   | `self.left`, `self.right`     | `Option<Box<Node>>`                     |
| 빈 트리          | `NULL`                        | `None`                        | `None`                                  |
| 멈춤 조건        | `if (n == NULL) return;`      | `if node is None: return ...` | `if let Some(n)` / `match None =>`      |
| 순회 결과 모으기 | 바로 출력(또는 배열에 쓰기)   | 리스트를 반환하고 이어 붙이기 | `&mut Vec`에 push                       |
| 레벨 순회 큐     | 주소 배열 + front·rear        | `collections.deque`           | `VecDeque<&Node>`                       |
| 해제             | `free_tree`를 **후위**로 직접 | 자동                          | 자동(Box가 자식부터 해제)               |
| 수식 트리        | 구조체 + 종류 필드            | 튜플 `("+", 3, 4)`            | `enum Expr { Num, Op(char, Box, Box) }` |

## 12. 자주 하는 실수

### 실수 1: 멈춤 조건을 빼먹는다

```c
void preorder(const Node *n) {
    printf("%c ", n->value);    // n이 NULL이면?
    preorder(n->left);
    preorder(n->right);
}
```

잎의 자식은 NULL이므로 곧 `NULL->value`를 읽습니다. 재귀 함수를 쓸 때는 **가장 먼저 멈춤 조건**을 씁니다. Python에서는 `AttributeError: 'NoneType' object has no attribute 'value'`, Rust에서는 `Option`을 풀지 않으면 컴파일되지 않으므로 이 실수를 할 수 없습니다.

### 실수 2: 레벨 순회에 스택을 쓴다

큐 대신 스택을 쓰면 가장 최근에 넣은 노드(방금 넣은 오른쪽 자식)가 먼저 나와서 **층 순서가 깨집니다.**

```python
# 파일: stack_instead_of_queue.py
class Node:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right


root = Node("A", Node("B", Node("D"), Node("E")), Node("C", None, Node("F")))
stack, out = [root], []
while stack:
    node = stack.pop()              # 큐가 아니라 스택!
    out.append(node.value)
    for child in (node.left, node.right):
        if child:
            stack.append(child)
print(" ".join(out))
```

실행 결과:

```text
A C F B E D
```

레벨 순서(`A B C D E F`)가 아니라 오른쪽부터 깊이 파고드는 순서가 되었습니다. 이것은 Day 81의 **깊이 우선 탐색**이 됩니다. 어떤 자료구조를 쓰느냐가 방문 순서를 결정합니다.

### 실수 3: 부모를 먼저 해제한다

실습의 디버그 문제처럼 `free(n)` 뒤에 `n->left`를 읽으면 use-after-free입니다. 트리 해제는 반드시 **후위 순서**입니다.

### 실수 4: 높이의 정의를 섞어 쓴다

어떤 함수는 빈 트리를 0으로, 다른 함수는 -1로 계산하면 결과가 1씩 어긋납니다. 프로젝트 안에서는 **한 가지 정의**를 정하고 주석으로 남기세요.

### 실수 5: Rust에서 트리를 빌리지 않고 넘긴다

```rust
// 파일: moved_tree.rs (컴파일 오류: E0382)
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn count(tree: Option<Box<Node>>) -> usize {     // & 없이 소유권을 받는다
    match tree {
        None => 0,
        Some(n) => 1 + count(n.left) + count(n.right),
    }
}

fn main() {
    let root = Some(Box::new(Node { value: 1, left: None, right: None }));
    println!("{}", count(root));
    println!("{}", root.map(|n| n.value).unwrap_or(0));   // root는 이미 이동했다
}
```

```text
error[E0382]: use of moved value: `root`
```

`count`가 트리의 **소유권을 가져가서** 다 세고 나면 트리가 해제됩니다. 그 뒤에는 `root`를 쓸 수 없습니다. 읽기만 하는 함수는 `&Tree`로 **빌려야** 합니다. 본문 코드의 모든 순회 함수가 `&Tree`를 받는 이유입니다.

## 13. Q&A

**Q. 자식이 셋 이상인 트리는 어떻게 만드나요?**

A. 자식을 **리스트**로 가지면 됩니다. Python은 `self.children = []`, Rust는 `children: Vec<Node>`, C는 자식 포인터 배열이나 "첫째 자식 + 다음 형제" 포인터 두 개로 표현합니다. 폴더 구조가 대표적인 예입니다. 순회는 자식 목록을 차례로 도는 것만 다르고 원리는 같습니다(도전 문제 3).

**Q. 재귀 없이 전위·중위·후위 순회를 할 수 있나요?**

A. 네. 재귀 호출이 쓰는 호출 스택을 **직접 스택으로** 흉내 내면 됩니다. 전위 순회는 12절의 실수 2 코드에서 자식을 넣는 순서만 (오른쪽, 왼쪽)으로 바꾸면 됩니다. 중위와 후위는 조금 더 까다롭습니다. 도전 문제 2에서 해 보세요.

**Q. Python의 `preorder`가 리스트를 이어 붙여서 느리다는 것은 무슨 뜻인가요?**

A. `[a] + list1 + list2`는 매번 새 리스트를 만들고 원소를 복사합니다. 깊이 d에 있는 값은 d번 복사되므로 최악의 경우(편향 트리) O(n²)이 됩니다. Rust 버전처럼 결과 리스트 하나를 함께 넘겨 `append`하면 O(n)입니다. 작은 트리에서는 차이가 거의 없으므로, 처음 배울 때는 읽기 쉬운 쪽을 택해도 됩니다.

**Q. 트리를 배열에 저장할 수도 있나요?**

A. **완전 이진 트리**(마지막 층을 빼면 꽉 차 있고, 마지막 층은 왼쪽부터 채워진 트리)라면 가능합니다. 인덱스 i의 자식을 2i+1, 2i+2에 두면 포인터가 필요 없습니다. Day 66의 **힙**이 이 방법을 씁니다.

## 14. 핵심 요약

- 트리는 **계층**을 표현하는 비선형 자료구조입니다. 루트, 부모, 자식, 잎, 깊이, 높이를 구별하세요.
- 이진 트리의 노드는 **left와 right** 두 자식을 가집니다.
- 트리는 **재귀적**입니다. "루트 + 왼쪽 서브트리 + 오른쪽 서브트리"로 생각하고, 빈 트리를 멈춤 조건으로 둡니다.
- **전위**(자신 먼저), **중위**(자신 가운데), **후위**(자신 마지막)는 재귀 코드에서 방문 줄의 위치만 다릅니다.
- **레벨 순회**는 큐로 한 층씩 방문합니다. 큐 대신 스택을 쓰면 깊이 우선 순서가 됩니다.
- C에서는 트리를 **후위 순서로 해제**해야 합니다. Rust는 Box가 자동으로 같은 순서로 해제합니다.
- 수식 트리의 전위·중위·후위 순회는 전위·중위·후위 **표기식**이 되고, 계산은 후위 순회입니다.

## 15. 도전 문제

1. **(C)** 두 트리가 모양과 값이 모두 같은지 검사하는 `bool same_tree(const Node *a, const Node *b)`를 재귀로 작성하세요.
2. **(Python)** 재귀 없이 **명시적 스택**으로 전위 순회와 중위 순회를 구현하고, 본문의 결과와 같은지 확인하세요.
3. **(Rust)** 자식이 여러 개인 폴더 트리 `struct Folder { name: String, size: u64, children: Vec<Folder> }`를 만들고, 하위 폴더를 포함한 전체 크기를 **후위 순회**로 계산해 들여쓰기와 함께 출력하세요.
4. **(세 언어)** 전위 순회 결과와 중위 순회 결과가 주어지면 원래 트리를 복원할 수 있습니다. `전위 A B D E G C F`, `중위 D B G E A C F`로부터 트리를 복원하는 함수를 작성해 보세요. 힌트: 전위의 첫 값이 루트이고, 중위에서 루트의 왼쪽이 왼쪽 서브트리입니다.
