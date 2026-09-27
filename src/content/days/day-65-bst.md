---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-65-bst
courseId: crp-92
phaseId: phase-06
dayNumber: 65
date: "2026-12-04"
title: 이진 탐색 트리 — 비교 한 번에 절반씩 버리기
summary: 왼쪽 서브트리는 작고 오른쪽 서브트리는 큰 이진 탐색 트리(BST)의 규칙을 이해하고, 검색·삽입·삭제(잎, 자식 하나, 자식 둘)를 C, Python, Rust로 구현합니다. 중위 순회가 정렬 결과를 주는 이유와, 정렬된 순서로 넣으면 트리가 한쪽으로 기울어 느려지는 이유를 실험으로 확인합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-64-tree]
learningObjectives:
  - BST의 규칙(왼쪽 < 노드 < 오른쪽)을 설명하고 주어진 트리가 BST인지 판단한다.
  - 루트부터 비교하며 내려가는 검색과 삽입을 반복문과 재귀로 구현한다.
  - 삭제의 세 경우(잎, 자식 하나, 자식 둘)를 구별하고, 자식이 둘일 때 후계자로 대체한다.
  - 중위 순회가 오름차순을 만드는 이유를 설명한다.
  - 삽입 순서에 따라 높이가 log n에서 n까지 달라지고, 그에 따라 검색 비용이 달라지는 것을 측정한다.
concepts:
  [
    binary search tree,
    bst property,
    search,
    insert,
    delete,
    successor,
    inorder sorted,
    skewed tree,
    BTreeMap,
  ]
runnerMode: python
playgroundSource: |
  # 파일: bst.py — 넣는 순서를 바꿔 높이가 어떻게 변하는지 보세요.
  class Node:
      def __init__(self, key):
          self.key = key
          self.left = None
          self.right = None


  def insert(root, key):
      if root is None:
          return Node(key)
      if key < root.key:
          root.left = insert(root.left, key)
      elif key > root.key:
          root.right = insert(root.right, key)
      return root


  def height(node):
      return 0 if node is None else 1 + max(height(node.left), height(node.right))


  for order in [[4, 2, 6, 1, 3, 5, 7], [1, 2, 3, 4, 5, 6, 7]]:
      root = None
      for k in order:
          root = insert(root, k)
      print(order, "→ 높이", height(root))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day65-predict-py
    title: 검색 경로 따라가기
    kind: predict
    objective: 루트에서 비교하며 내려가는 경로를 추적한다.
    prompt: 출력될 경로(방문한 키)를 예측하세요. 공백으로 구분해 적습니다.
    starter: |-
      class Node:
          def __init__(self, key, left=None, right=None):
              self.key, self.left, self.right = key, left, right


      root = Node(50,
                  Node(30, Node(20), Node(40, Node(35))),
                  Node(70, Node(60), Node(80)))
      path, cur, target = [], root, 35
      while cur is not None:
          path.append(cur.key)
          if target == cur.key:
              break
          cur = cur.left if target < cur.key else cur.right
      print(*path)
    answer: "50 30 40 35"
    hint: "35 < 50이면 왼쪽, 35 > 30이면 오른쪽, 35 < 40이면 왼쪽으로 갑니다."
    explanation: "50에서 왼쪽(30), 30에서 오른쪽(40), 40에서 왼쪽(35)으로 내려가 찾았습니다. 전체 7개 노드 중 4개만 봤고, 오른쪽 서브트리(70, 60, 80)는 전혀 보지 않았습니다."
    commonMistakes:
      - "35 > 30일 때 왼쪽으로 가서 20을 방문함"
      - "BST가 아닌 일반 트리처럼 모든 노드를 방문한다고 생각함"
    language: python
    verification: run
  - id: ex-day65-predict-c
    title: 삽입 뒤 중위 순회 예측하기
    kind: predict
    objective: 어떤 순서로 넣어도 중위 순회는 정렬된다는 것을 확인한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int key;
          struct Node *left, *right;
      } Node;

      Node *insert(Node *root, int key) {
          if (root == NULL) {
              Node *n = malloc(sizeof *n);
              if (n == NULL) exit(1);
              n->key = key;
              n->left = n->right = NULL;
              return n;
          }
          if (key < root->key) root->left = insert(root->left, key);
          else if (key > root->key) root->right = insert(root->right, key);
          return root;
      }

      void inorder(const Node *n) {
          if (n == NULL) return;
          inorder(n->left);
          printf("%d ", n->key);
          inorder(n->right);
      }

      int main(void) {
          Node *root = NULL;
          int keys[] = {8, 3, 10, 1, 6, 3, 14, 4};
          for (int i = 0; i < 8; i++) root = insert(root, keys[i]);
          inorder(root);
          printf("\n");
          return 0;
      }
    answer: "1 3 4 6 8 10 14"
    hint: "중위 순회는 왼쪽(작은 값들) → 자신 → 오른쪽(큰 값들)이므로 항상 오름차순입니다. 같은 키 3은 두 번째에 무시됩니다."
    explanation: "BST 규칙 덕분에 모든 노드에서 왼쪽은 작고 오른쪽은 큽니다. 그래서 중위 순회는 넣은 순서와 상관없이 정렬된 결과를 줍니다. 두 번째 3은 이미 있으므로 넣지 않았습니다(프로그램이 끝나며 운영체제가 메모리를 회수합니다)."
    commonMistakes:
      - "넣은 순서대로 8 3 10 1 6 14 4를 적음"
      - "중복된 3을 두 번 적음"
    language: c
    verification: run
  - id: ex-day65-fill
    title: Rust 반복문 검색 채우기
    kind: fill
    objective: 비교 결과에 따라 왼쪽이나 오른쪽 서브트리를 빌려 내려간다.
    prompt: "contains의 빈칸을 채우세요. key가 작으면 왼쪽, 크면 오른쪽 서브트리로 cur를 옮깁니다."
    starter: |-
      struct Node {
          key: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn leaf(key: i32) -> Option<Box<Node>> {
          Some(Box::new(Node { key, left: None, right: None }))
      }

      fn contains(tree: &Option<Box<Node>>, key: i32) -> bool {
          let mut cur = tree;
          while let Some(n) = cur {
              if key == n.key {
                  return true;
              }
              cur = _____;
          }
          false
      }

      fn main() {
          let root = Some(Box::new(Node { key: 20, left: leaf(10), right: leaf(30) }));
          println!("{} {} {}", contains(&root, 30), contains(&root, 25), contains(&root, 10));
      }
    answer: |-
      struct Node {
          key: i32,
          left: Option<Box<Node>>,
          right: Option<Box<Node>>,
      }

      fn leaf(key: i32) -> Option<Box<Node>> {
          Some(Box::new(Node { key, left: None, right: None }))
      }

      fn contains(tree: &Option<Box<Node>>, key: i32) -> bool {
          let mut cur = tree;
          while let Some(n) = cur {
              if key == n.key {
                  return true;
              }
              cur = if key < n.key { &n.left } else { &n.right };
          }
          false
      }

      fn main() {
          let root = Some(Box::new(Node { key: 20, left: leaf(10), right: leaf(30) }));
          println!("{} {} {}", contains(&root, 30), contains(&root, 25), contains(&root, 10));
      }
    output: "true false true"
    hint: "if는 값을 만드는 표현식이라 cur = if 조건 { A } else { B };처럼 쓸 수 있습니다. 두 갈래 모두 &Option<Box<Node>>여야 합니다."
    explanation: "cur는 트리를 빌린 참조라서 내려가는 동안 아무것도 옮기지 않습니다. 25는 20의 오른쪽(30)으로 갔다가 30의 왼쪽이 None이라 반복이 끝나 false입니다."
    commonMistakes:
      - "n.left처럼 &를 빼서 빌린 값에서 이동하려는 오류를 냄"
      - "key <= n.key로 비교해 같은 키에서 왼쪽으로 내려감(이미 앞에서 확인했으므로 결과는 같지만 의도가 흐려짐)"
    language: rust
    verification: run
  - id: ex-day65-modify
    title: Python BST에 범위 개수 세기 추가하기
    kind: modify
    objective: BST 규칙을 이용해 볼 필요가 없는 서브트리를 건너뛴다.
    prompt: "count_range(node, lo, hi)를 구현해 lo 이상 hi 이하인 키의 개수를 세세요. 노드 키가 lo보다 작으면 왼쪽 서브트리는 볼 필요가 없습니다. 방문한 노드 수도 함께 출력합니다."
    starter: |-
      class Node:
          def __init__(self, key):
              self.key, self.left, self.right = key, None, None


      def insert(root, key):
          if root is None:
              return Node(key)
          if key < root.key:
              root.left = insert(root.left, key)
          elif key > root.key:
              root.right = insert(root.right, key)
          return root


      visited = 0


      def count_range(node, lo, hi):
          global visited
          return 0


      root = None
      for k in [50, 30, 70, 20, 40, 60, 80, 10, 25, 65, 90]:
          root = insert(root, k)
      print(count_range(root, 55, 85), "방문", visited)
    answer: |-
      class Node:
          def __init__(self, key):
              self.key, self.left, self.right = key, None, None


      def insert(root, key):
          if root is None:
              return Node(key)
          if key < root.key:
              root.left = insert(root.left, key)
          elif key > root.key:
              root.right = insert(root.right, key)
          return root


      visited = 0


      def count_range(node, lo, hi):
          global visited
          if node is None:
              return 0
          visited += 1
          if node.key < lo:
              return count_range(node.right, lo, hi)
          if node.key > hi:
              return count_range(node.left, lo, hi)
          return 1 + count_range(node.left, lo, hi) + count_range(node.right, lo, hi)


      root = None
      for k in [50, 30, 70, 20, 40, 60, 80, 10, 25, 65, 90]:
          root = insert(root, k)
      print(count_range(root, 55, 85), "방문", visited)
    output: "4 방문 6"
    hint: "키가 범위보다 작으면 그 노드와 왼쪽 서브트리는 모두 범위 밖입니다. 크면 오른쪽 서브트리가 모두 범위 밖입니다."
    explanation: "범위 55~85에 드는 키는 60, 65, 70, 80 네 개입니다. 50에서 오른쪽만 보고, 30 쪽 서브트리(20, 40, 10, 25)는 통째로 건너뛰므로 11개 중 6개만 방문합니다. 90에서는 왼쪽(None)만 확인합니다."
    commonMistakes:
      - "모든 노드를 방문해서 개수는 맞지만 BST의 장점을 쓰지 못함"
      - "node.key < lo일 때 왼쪽으로 내려가 범위 안의 값을 놓침"
    language: python
    verification: run
  - id: ex-day65-debug
    title: C 삽입이 노드를 잃어버리는 버그 고치기
    kind: debug
    objective: 재귀 삽입이 돌려준 새 서브트리 루트를 부모에 연결한다.
    prompt: "insert가 새 노드를 만들어 돌려주지만 부모가 그 값을 받지 않아 루트 외의 노드가 모두 사라집니다. 노드 수가 5가 되도록 고치세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int key;
          struct Node *left, *right;
      } Node;

      Node *insert(Node *root, int key) {
          if (root == NULL) {
              Node *n = malloc(sizeof *n);
              if (n == NULL) exit(1);
              n->key = key;
              n->left = n->right = NULL;
              return n;
          }
          if (key < root->key) insert(root->left, key);
          else if (key > root->key) insert(root->right, key);
          return root;
      }

      int count(const Node *n) {
          return n == NULL ? 0 : 1 + count(n->left) + count(n->right);
      }

      int main(void) {
          Node *root = NULL;
          int keys[] = {5, 2, 8, 1, 9};
          for (int i = 0; i < 5; i++) root = insert(root, keys[i]);
          printf("노드 수: %d\n", count(root));
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Node {
          int key;
          struct Node *left, *right;
      } Node;

      Node *insert(Node *root, int key) {
          if (root == NULL) {
              Node *n = malloc(sizeof *n);
              if (n == NULL) exit(1);
              n->key = key;
              n->left = n->right = NULL;
              return n;
          }
          if (key < root->key) root->left = insert(root->left, key);
          else if (key > root->key) root->right = insert(root->right, key);
          return root;
      }

      int count(const Node *n) {
          return n == NULL ? 0 : 1 + count(n->left) + count(n->right);
      }

      int main(void) {
          Node *root = NULL;
          int keys[] = {5, 2, 8, 1, 9};
          for (int i = 0; i < 5; i++) root = insert(root, keys[i]);
          printf("노드 수: %d\n", count(root));
          return 0;
      }
    output: "노드 수: 5"
    starterOutput: "노드 수: 1"
    hint: "insert(root->left, key)는 root->left의 **복사본**을 받습니다. 그 안에서 만든 새 노드의 주소는 반환값으로만 밖에 전달됩니다."
    explanation: "원래 코드는 '노드 수: 1'을 출력하고, 만든 노드 네 개는 아무도 가리키지 않아 누수됩니다. root->left = insert(root->left, key);처럼 반환값을 다시 연결해야 합니다. 이 패턴은 삭제에서도 똑같이 쓰입니다."
    commonMistakes:
      - "main에서만 root = insert(...)를 하고 재귀 호출에서는 대입하지 않음"
      - "insert(&root->left, key)처럼 이중 포인터로 바꾸다 함수 선언과 맞지 않게 됨"
    language: c
    verification: run
  - id: ex-day65-independent
    title: Rust로 BST인지 검사하기
    kind: independent
    objective: 각 노드가 허용되는 키의 범위(하한, 상한)를 넘겨 가며 검사한다.
    prompt: "fn is_bst(tree: &Tree, lo: Option<i32>, hi: Option<i32>) -> bool을 구현하세요. 두 트리를 검사해 true false가 출력되어야 합니다. 두 번째 트리는 25가 20의 오른쪽 서브트리에 있어 규칙을 어깁니다."
    starter: |-
      struct Node {
          key: i32,
          left: Tree,
          right: Tree,
      }
      type Tree = Option<Box<Node>>;

      fn node(key: i32, left: Tree, right: Tree) -> Tree {
          Some(Box::new(Node { key, left, right }))
      }

      fn main() {
          let good = node(20, node(10, None, node(15, None, None)), node(30, None, None));
          //            20
          //          /    \
          //        10      30
          //          \
          //           25   ← 10보다 크지만 20보다도 크다!
          let bad = node(20, node(10, None, node(25, None, None)), node(30, None, None));
          println!("{} {}", good.is_some(), bad.is_some());
      }
    answer: |-
      struct Node {
          key: i32,
          left: Tree,
          right: Tree,
      }
      type Tree = Option<Box<Node>>;

      fn node(key: i32, left: Tree, right: Tree) -> Tree {
          Some(Box::new(Node { key, left, right }))
      }

      fn is_bst(tree: &Tree, lo: Option<i32>, hi: Option<i32>) -> bool {
          match tree {
              None => true,
              Some(n) => {
                  if lo.is_some_and(|lo| n.key <= lo) || hi.is_some_and(|hi| n.key >= hi) {
                      return false;
                  }
                  is_bst(&n.left, lo, Some(n.key)) && is_bst(&n.right, Some(n.key), hi)
              }
          }
      }

      fn main() {
          let good = node(20, node(10, None, node(15, None, None)), node(30, None, None));
          let bad = node(20, node(10, None, node(25, None, None)), node(30, None, None));
          println!("{} {}", is_bst(&good, None, None), is_bst(&bad, None, None));
      }
    output: "true false"
    hint: "부모와만 비교하면 25 > 10이라 통과해 버립니다. 왼쪽으로 내려갈 때는 상한이 부모 키로, 오른쪽으로 내려갈 때는 하한이 부모 키로 좁아집니다."
    explanation: "25는 20의 왼쪽 서브트리에 있으므로 20보다 작아야 합니다. 20에서 왼쪽으로 내려갈 때 상한이 20이 되고, 10에서 오른쪽으로 내려갈 때 하한이 10이 되어 25는 (10, 20) 범위를 벗어납니다."
    commonMistakes:
      - "각 노드를 직계 자식과만 비교해 bad 트리도 true로 판정함"
      - "Option을 쓰지 않고 i32::MIN, i32::MAX를 경계로 써서 그 값이 실제 키일 때 틀림"
    language: rust
    verification: run
quiz:
  - id: quiz-day65-01
    question: 이진 탐색 트리(BST)의 규칙으로 옳은 것은?
    choices:
      - 부모는 두 자식보다 항상 크다
      - 모든 노드에서 왼쪽 서브트리의 키는 더 작고, 오른쪽 서브트리의 키는 더 크다
      - 왼쪽 자식과 오른쪽 자식만 비교하면 된다
      - 잎은 모두 같은 깊이에 있다
    answerIndex: 1
    explanation: 직계 자식이 아니라 서브트리 전체에 대한 규칙입니다. '부모가 자식보다 크다'는 Day 66의 힙 규칙입니다.
  - id: quiz-day65-02
    question: BST에서 모든 키를 오름차순으로 얻으려면 어떤 순회를 쓰나요?
    choices: ["전위 순회", "중위 순회", "후위 순회", "레벨 순회"]
    answerIndex: 1
    explanation: 왼쪽(작은 값들) → 자신 → 오른쪽(큰 값들) 순서이므로 오름차순이 됩니다.
  - id: quiz-day65-03
    question: 자식이 둘인 노드 50을 삭제할 때, 50 자리에 올 수 있는 값으로 알맞은 것은?
    choices:
      - 왼쪽 자식
      - 오른쪽 서브트리의 가장 작은 키(후계자)
      - 루트
      - 아무 잎이나
    answerIndex: 1
    explanation: 오른쪽 서브트리의 최솟값은 왼쪽 서브트리의 모든 값보다 크고 오른쪽의 나머지 값보다 작으므로 BST 규칙을 지킵니다. 왼쪽 서브트리의 최댓값(선행자)을 써도 됩니다.
  - id: quiz-day65-04
    question: 빈 BST에 1, 2, 3, 4, 5를 차례로 넣으면 트리의 높이는?
    choices: ["3", "5", "2", "1"]
    answerIndex: 1
    explanation: 매번 더 큰 값을 넣으므로 계속 오른쪽으로만 이어져 연결 리스트 모양이 됩니다. 높이가 n이 되어 검색이 O(n)으로 느려집니다.
  - id: quiz-day65-05
    question: 균형 잡힌 BST에 키가 약 100만 개 있을 때, 검색에 필요한 비교 횟수는 대략 얼마인가요?
    choices: ["약 20번", "약 1,000번", "약 50만 번", "약 100만 번"]
    answerIndex: 0
    explanation: 비교 한 번에 남은 후보가 절반으로 줄어듭니다. 2^20 ≈ 100만이므로 약 20번이면 됩니다. 한쪽으로 기운 트리라면 최악의 경우 100만 번이 필요합니다.
---

## 1. 오늘 배울 내용

Day 64에서 만든 이진 트리에서 값을 찾으려면 모든 노드를 봐야 할 수도 있었습니다. 오늘은 노드를 **규칙에 따라 배치해서** 값을 훨씬 빠르게 찾는 **이진 탐색 트리(Binary Search Tree, BST)** 를 배웁니다.

1. BST의 규칙 하나가 왜 검색을 빠르게 하는지 봅니다.
2. **검색**과 **삽입**을 구현합니다. 둘 다 "비교하고 한쪽으로 내려간다"의 반복입니다.
3. 가장 까다로운 **삭제**의 세 경우를 그림으로 이해하고 구현합니다.
4. **중위 순회**가 정렬된 결과를 주는 이유를 확인합니다.
5. 넣는 **순서**에 따라 트리가 기울어 느려지는 현상을 실험으로 측정합니다.
6. 응용으로 BST를 **단어장(키-값 사전)** 으로 쓰고, Rust의 표준 `BTreeMap`과 비교합니다.

C, Python, Rust로 같은 BST를 완성합니다.

## 2. 왜 이진 탐색 트리인가

1부터 100 사이의 숫자 맞히기 게임을 생각해 봅시다. 상대가 "더 커요/더 작아요"라고 알려 준다면, 50부터 물어보고 답에 따라 절반을 버리는 것이 가장 빠릅니다. 매번 후보가 절반으로 줄어서 7번 안에 맞힐 수 있습니다.

BST는 이 전략을 **자료구조로 만든 것**입니다. 루트가 "50"의 역할을 합니다. 찾는 값이 루트보다 작으면 왼쪽 서브트리만, 크면 오른쪽 서브트리만 보면 됩니다. 반대쪽은 **통째로 버립니다.**

| 저장 방식          | 검색     | 삽입                      | 정렬된 순서로 꺼내기 |
| ------------------ | -------- | ------------------------- | -------------------- |
| 정렬되지 않은 배열 | O(n)     | O(1)                      | 정렬 필요 O(n log n) |
| 정렬된 배열        | O(log n) | **O(n)** (뒤를 밀어야 함) | O(n)                 |
| 균형 잡힌 BST      | O(log n) | **O(log n)**              | O(n) (중위 순회)     |

정렬된 배열은 이진 탐색(Day 72)으로 빨리 찾을 수 있지만 넣고 빼기가 느립니다. BST는 **찾기와 넣기·빼기를 모두** 빠르게 할 수 있다는 것이 장점입니다. 단, 트리가 **균형**을 유지할 때에 한해서입니다.

## 3. 그림으로 이해하기

이 수업에서 쓸 BST입니다.

```text
                50
             /      \
           30        70
          /  \      /  \
        20    40  60    80
                    \
                     65
```

모든 노드에서 규칙이 지켜지는지 확인해 보세요.

- 50의 **왼쪽 서브트리**(30, 20, 40)는 모두 50보다 작고, **오른쪽 서브트리**(70, 60, 65, 80)는 모두 50보다 큽니다.
- 70의 왼쪽 서브트리(60, 65)는 모두 70보다 작습니다. 65는 60보다 크므로 60의 오른쪽에 있습니다.

> **BST 규칙**: 모든 노드 N에 대해, N의 왼쪽 서브트리의 모든 키 < N의 키 < N의 오른쪽 서브트리의 모든 키

**직계 자식**만이 아니라 **서브트리 전체**에 대한 규칙이라는 점이 중요합니다. 65는 부모 60보다 크고, 할아버지 70보다 작고, 루트 50보다 큽니다. 모든 조상과의 관계가 맞아야 합니다. 이 수업은 **같은 키를 두 번 넣지 않는다**(중복 무시)고 약속합니다.

## 4. 천천히 풀어보기

### 4.1 검색: 비교하고 한쪽으로 내려가기

65를 찾아봅시다.

```text
50과 비교: 65 > 50 → 오른쪽으로
70과 비교: 65 < 70 → 왼쪽으로
60과 비교: 65 > 60 → 오른쪽으로
65와 비교: 같다 → 찾았다! (비교 4번)
```

없는 값 55를 찾으면 50 → 70 → 60 → (60의 왼쪽이 없음) → **실패**입니다. 내려갈 곳이 없으면 그 값은 트리에 없습니다. 검색에 드는 비교 횟수는 **트리의 높이**를 넘지 않습니다.

### 4.2 삽입: 검색이 실패한 자리에 넣기

삽입은 검색과 같은 길을 따라 내려가다가, **검색이 실패한 빈자리**에 새 노드를 매답니다. 55를 넣으면 60의 왼쪽이 비어 있으므로 거기에 붙입니다. 새 노드는 항상 **잎**으로 들어갑니다. 기존 노드를 옮길 필요가 없습니다.

```text
                50
             /      \
           30        70
          /  \      /  \
        20    40  60    80
                 /  \
               55    65      ← 55가 60의 왼쪽 잎으로 들어감
```

### 4.3 삭제: 세 가지 경우

삭제는 BST에서 가장 어려운 연산입니다. 지울 노드의 자식 수에 따라 세 경우로 나뉩니다.

**경우 1: 잎 삭제** — 그냥 떼어 냅니다. 20을 지우면 30의 왼쪽이 비게 됩니다.

**경우 2: 자식이 하나인 노드 삭제** — 그 자식이 **자리를 이어받습니다.** 60(오른쪽 자식 65만 있음)을 지우면 65가 70의 왼쪽 자식이 됩니다. 연결 리스트에서 노드를 건너뛰게 연결한 것과 같습니다. 65는 원래 70의 왼쪽 서브트리에 있었으므로 규칙이 유지됩니다.

**경우 3: 자식이 둘인 노드 삭제** — 가장 까다롭습니다. 50을 지운다면 30과 70 중 누구를 루트로 올려도 한쪽 서브트리를 붙일 곳이 애매해집니다. 해결책은 **50의 자리에 들어갈 수 있는 다른 값**을 찾아 **값만 바꾸는 것**입니다.

```text
50 자리에 올 값의 조건: 왼쪽 서브트리의 모든 값보다 크고, 오른쪽 서브트리의 모든 값보다 작을 것
→ 오른쪽 서브트리의 최솟값(후계자, successor)이 딱 맞다
   오른쪽 서브트리(70, 60, 65, 80)의 최솟값 = 60 (오른쪽 서브트리에서 왼쪽으로 끝까지)
```

```text
① 후계자 60을 찾는다       ② 50 자리에 60을 쓴다     ③ 원래 60 노드를 지운다(경우 2)
        50                        60                         60
      /    \                    /    \                     /    \
    30      70                30      70                 30      70
           /  \                      /  \                       /  \
         60    80                  60    80                   65    80
           \                         \
            65                        65
```

후계자는 오른쪽 서브트리에서 **왼쪽으로 끝까지** 간 노드이므로 **왼쪽 자식이 없습니다.** 그래서 ③에서 후계자를 지우는 일은 항상 경우 1이나 경우 2가 되어 간단합니다.

### 4.4 중위 순회가 정렬 결과를 주는 이유

중위 순회는 "왼쪽 서브트리 → 자신 → 오른쪽 서브트리"입니다. BST에서 왼쪽 서브트리는 **자신보다 작은 값 전부**, 오른쪽은 **큰 값 전부**입니다. 그러니 "작은 값들을 (정렬해서) 모두 → 자신 → 큰 값들을 (정렬해서) 모두" 방문하게 되고, 이것이 재귀적으로 모든 서브트리에서 성립하므로 결과 전체가 오름차순입니다. 이 성질을 이용한 정렬을 **트리 정렬**이라고 합니다.

### 4.5 높이가 속도를 결정한다

검색, 삽입, 삭제는 모두 **루트에서 한 경로를 따라 내려가는** 연산이므로 비용은 **높이 h**에 비례합니다.

- 노드가 고르게 퍼진 **균형 트리**: h ≈ log₂ n. 노드 100만 개에 높이 약 20.
- 한쪽으로만 이어진 **편향 트리**: h = n. 노드 100만 개에 높이 100만.

편향 트리는 **정렬된 순서로 넣을 때** 생깁니다. 1, 2, 3, 4, 5를 차례로 넣으면 매번 오른쪽 끝에 붙어서 연결 리스트가 됩니다. 실제 서비스에서는 키가 정렬된 순서로 들어오는 일이 흔합니다(회원 번호, 시간 순 기록 등). 그래서 실무에서는 넣고 뺄 때 **스스로 균형을 맞추는** AVL 트리, 레드-블랙 트리, B-트리 같은 **균형 탐색 트리**를 씁니다. 원리는 오늘 배우는 BST와 같고, 균형을 맞추는 "회전" 연산이 더해진 것입니다.

## 5. C로 구현하기

C 구현은 재귀 함수가 **새 서브트리의 루트를 돌려주는** 방식을 씁니다. 부모는 `root->left = insert(root->left, key);`처럼 그 값을 받아 다시 연결합니다. 삽입과 삭제가 같은 모양으로 짜입니다.

```c
// 파일: bst.c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node {
    int key;
    struct Node *left;
    struct Node *right;
} Node;

Node *new_node(int key) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    n->key = key;
    n->left = n->right = NULL;
    return n;
}

Node *insert(Node *root, int key) {
    if (root == NULL) {
        return new_node(key);           // 검색이 실패한 빈자리
    }
    if (key < root->key) {
        root->left = insert(root->left, key);
    } else if (key > root->key) {
        root->right = insert(root->right, key);
    }                                   // 같으면 넣지 않는다
    return root;
}

const Node *search(const Node *root, int key, int *steps) {
    const Node *cur = root;
    *steps = 0;
    while (cur != NULL) {
        (*steps)++;
        if (key == cur->key) {
            return cur;
        }
        cur = (key < cur->key) ? cur->left : cur->right;
    }
    return NULL;
}

Node *delete_key(Node *root, int key, bool *removed) {
    if (root == NULL) {
        return NULL;                    // 없는 키
    }
    if (key < root->key) {
        root->left = delete_key(root->left, key, removed);
    } else if (key > root->key) {
        root->right = delete_key(root->right, key, removed);
    } else {
        *removed = true;
        if (root->left == NULL) {       // 경우 1, 2: 오른쪽이 자리를 잇는다
            Node *right = root->right;
            free(root);
            return right;
        }
        if (root->right == NULL) {      // 경우 2: 왼쪽이 자리를 잇는다
            Node *left = root->left;
            free(root);
            return left;
        }
        Node *succ = root->right;       // 경우 3: 오른쪽 서브트리의 최솟값
        while (succ->left != NULL) {
            succ = succ->left;
        }
        root->key = succ->key;          // 값만 옮기고
        bool ignored = false;
        root->right = delete_key(root->right, succ->key, &ignored);   // 후계자 삭제
    }
    return root;
}

void inorder(const Node *n) {
    if (n == NULL) return;
    inorder(n->left);
    printf("%d ", n->key);
    inorder(n->right);
}

int height(const Node *n) {
    if (n == NULL) return 0;
    int l = height(n->left), r = height(n->right);
    return 1 + (l > r ? l : r);
}

void free_tree(Node *n) {
    if (n == NULL) return;
    free_tree(n->left);
    free_tree(n->right);
    free(n);
}

void show(const Node *root, const char *label) {
    printf("%-12s 중위: ", label);
    inorder(root);
    printf("| 루트 %d, 높이 %d\n", root ? root->key : -1, height(root));
}

int main(void) {
    Node *root = NULL;
    int keys[] = {50, 30, 70, 20, 40, 60, 80, 65, 40};
    for (int i = 0; i < 9; i++) {
        root = insert(root, keys[i]);
    }
    show(root, "insert");

    int targets[] = {65, 55};
    for (int i = 0; i < 2; i++) {
        int steps;
        const Node *found = search(root, targets[i], &steps);
        printf("search(%d): %s, 비교 %d번\n", targets[i], found ? "찾음" : "없음", steps);
    }

    bool removed;
    int to_delete[] = {20, 60, 50, 99};
    for (int i = 0; i < 4; i++) {
        removed = false;
        root = delete_key(root, to_delete[i], &removed);
        char label[16];
        snprintf(label, sizeof label, "delete %d", to_delete[i]);
        if (removed) {
            show(root, label);
        } else {
            printf("%-12s 없는 키\n", label);
        }
    }

    free_tree(root);

    Node *skewed = NULL;
    for (int k = 1; k <= 7; k++) {
        skewed = insert(skewed, k);     // 정렬된 순서로 넣기
    }
    Node *balanced = NULL;
    int order[] = {4, 2, 6, 1, 3, 5, 7};
    for (int i = 0; i < 7; i++) {
        balanced = insert(balanced, order[i]);
    }
    int s1, s2;
    search(skewed, 7, &s1);
    search(balanced, 7, &s2);
    printf("1~7 정렬 순서로 삽입: 높이 %d, search(7) 비교 %d번\n", height(skewed), s1);
    printf("4,2,6,1,3,5,7 순서:   높이 %d, search(7) 비교 %d번\n", height(balanced), s2);
    free_tree(skewed);
    free_tree(balanced);
    return 0;
}
```

실행 결과:

```text
insert       중위: 20 30 40 50 60 65 70 80 | 루트 50, 높이 4
search(65): 찾음, 비교 4번
search(55): 없음, 비교 3번
delete 20    중위: 30 40 50 60 65 70 80 | 루트 50, 높이 4
delete 60    중위: 30 40 50 65 70 80 | 루트 50, 높이 3
delete 50    중위: 30 40 65 70 80 | 루트 65, 높이 3
delete 99    없는 키
1~7 정렬 순서로 삽입: 높이 7, search(7) 비교 7번
4,2,6,1,3,5,7 순서:   높이 3, search(7) 비교 3번
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                                                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root->left = insert(root->left, key);`            | 재귀 호출이 돌려준 **새 서브트리의 루트**를 다시 연결합니다. 대부분은 원래 주소가 그대로 돌아오지만, 빈자리였다면 새 노드의 주소가 돌아옵니다. 대입을 빼먹으면 새 노드가 사라집니다(실습의 디버그 문제). |
| `cur = (key < cur->key) ? cur->left : cur->right;` | 검색은 반복문으로 썼습니다. 한 경로만 따라 내려가므로 재귀가 꼭 필요하지 않고, 반복문은 호출 스택을 쓰지 않습니다.                                                                                       |
| `(*steps)++;`                                      | 포인터가 가리키는 값을 1 늘립니다. 괄호가 없으면 `*(steps++)`가 되어 포인터 자체가 움직입니다.                                                                                                           |
| `if (root->left == NULL) { ... return right; }`    | 왼쪽 자식이 없으면 오른쪽 자식이 자리를 잇습니다. 오른쪽도 없다면(잎) NULL을 돌려주므로 **경우 1과 경우 2가 한 코드로** 처리됩니다.                                                                      |
| `while (succ->left != NULL) succ = succ->left;`    | 오른쪽 서브트리에서 왼쪽으로 끝까지 가면 최솟값(후계자)입니다.                                                                                                                                           |
| `root->key = succ->key;` + 후계자 삭제             | 노드를 옮기지 않고 **키만** 덮어쓴 뒤, 오른쪽 서브트리에서 원래 후계자를 지웁니다. 후계자는 왼쪽 자식이 없으므로 이 재귀 삭제는 경우 1 또는 2로 끝납니다.                                                |
| `bool *removed`                                    | 없는 키를 지우려 했는지 호출한 쪽에 알려 줍니다. 반환값은 새 루트를 돌려주는 데 쓰고 있으므로 성공 여부는 포인터로 전달합니다.                                                                           |

출력을 3절의 그림과 비교해 보세요. `delete 60`은 경우 2(65가 자리를 이음), `delete 50`은 경우 3입니다. 50의 후계자는 오른쪽 서브트리 `70, 65, 80`의 최솟값인 **65**라서 루트가 65가 되었습니다. 마지막 두 줄은 같은 값 7개를 넣어도 **넣는 순서에 따라** 높이가 7과 3으로 달라지고, 검색 비용도 그만큼 차이가 난다는 것을 보여 줍니다.

> **오류 주의**: `delete_key`에서 후계자를 지울 때 `root->right`를 다시 연결하지 않으면, 후계자 노드가 트리에 남아 **같은 키가 두 번** 나타납니다. 재귀 삭제도 삽입과 마찬가지로 반환값을 반드시 연결해야 합니다.

## 6. Python으로 구현하기

Python 버전은 BST를 클래스로 감싸고, `in` 연산자와 `for` 반복을 쓸 수 있게 특별 메서드를 만듭니다. 삽입은 반복문, 삭제는 재귀로 구현했습니다.

```python
# 파일: bst.py
class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None
        self.size = 0

    def insert(self, key):
        if self.root is None:
            self.root = Node(key)
            self.size += 1
            return True
        cur = self.root
        while True:
            if key == cur.key:
                return False                    # 중복은 넣지 않는다
            side = "left" if key < cur.key else "right"
            child = getattr(cur, side)
            if child is None:
                setattr(cur, side, Node(key))   # 빈자리에 매달기
                self.size += 1
                return True
            cur = child

    def search_path(self, key):
        path, cur = [], self.root
        while cur is not None:
            path.append(cur.key)
            if key == cur.key:
                return True, path
            cur = cur.left if key < cur.key else cur.right
        return False, path

    def __contains__(self, key):
        return self.search_path(key)[0]

    def delete(self, key):
        self.root, removed = self._delete(self.root, key)
        if removed:
            self.size -= 1
        return removed

    def _delete(self, node, key):
        if node is None:
            return None, False
        if key < node.key:
            node.left, removed = self._delete(node.left, key)
            return node, removed
        if key > node.key:
            node.right, removed = self._delete(node.right, key)
            return node, removed
        if node.left is None:                   # 경우 1, 2
            return node.right, True
        if node.right is None:                  # 경우 2
            return node.left, True
        succ = node.right                       # 경우 3
        while succ.left is not None:
            succ = succ.left
        node.key = succ.key
        node.right, _ = self._delete(node.right, succ.key)
        return node, True

    def __iter__(self):                         # 중위 순회 = 오름차순
        def walk(node):
            if node is not None:
                yield from walk(node.left)
                yield node.key
                yield from walk(node.right)
        return walk(self.root)

    def height(self):
        def h(node):
            return 0 if node is None else 1 + max(h(node.left), h(node.right))
        return h(self.root)

    def min(self):
        cur = self.root
        while cur.left is not None:
            cur = cur.left
        return cur.key

    def max(self):
        cur = self.root
        while cur.right is not None:
            cur = cur.right
        return cur.key


tree = BST()
for k in [50, 30, 70, 20, 40, 60, 80, 65, 40]:
    tree.insert(k)
print("중위:", list(tree), f"크기 {tree.size}, 높이 {tree.height()}")
print("최솟값", tree.min(), "최댓값", tree.max())
print("65 경로:", tree.search_path(65))
print("55 경로:", tree.search_path(55))
print("40 in tree?", 40 in tree, "/ 45 in tree?", 45 in tree)

for k in [20, 60, 50, 99]:
    ok = tree.delete(k)
    print(f"delete {k}: {'삭제' if ok else '없음'} → {list(tree)}, 루트 {tree.root.key}")

for order in [list(range(1, 8)), [4, 2, 6, 1, 3, 5, 7]]:
    t = BST()
    for k in order:
        t.insert(k)
    print(f"{str(order):<22} 높이 {t.height()}, 7까지 비교 {len(t.search_path(7)[1])}번")
```

실행 결과:

```text
중위: [20, 30, 40, 50, 60, 65, 70, 80] 크기 8, 높이 4
최솟값 20 최댓값 80
65 경로: (True, [50, 70, 60, 65])
55 경로: (False, [50, 70, 60])
40 in tree? True / 45 in tree? False
delete 20: 삭제 → [30, 40, 50, 60, 65, 70, 80], 루트 50
delete 60: 삭제 → [30, 40, 50, 65, 70, 80], 루트 50
delete 50: 삭제 → [30, 40, 65, 70, 80], 루트 65
delete 99: 없음 → [30, 40, 65, 70, 80], 루트 65
[1, 2, 3, 4, 5, 6, 7]  높이 7, 7까지 비교 7번
[4, 2, 6, 1, 3, 5, 7]  높이 3, 7까지 비교 3번
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `side = "left" if key < cur.key else "right"`          | 내려갈 방향을 **속성 이름**으로 정합니다.                                                                                                                                     |
| `getattr(cur, side)` / `setattr(cur, side, Node(key))` | 이름(문자열)으로 속성을 읽고 씁니다. `cur.left`와 `cur.right`에 같은 코드를 두 번 쓰지 않으려는 기법입니다. if/else로 두 번 써도 괜찮습니다.                                  |
| `return node.right, True`                              | 파이썬 함수는 **튜플로 여러 값**을 돌려줄 수 있습니다. C의 `bool *removed` 대신 (새 서브트리 루트, 삭제 여부)를 함께 돌려줍니다.                                              |
| `node.left, removed = self._delete(node.left, key)`    | 돌려받은 튜플을 풀어서 왼쪽 자식을 **다시 연결**하고 삭제 여부를 받습니다. C의 `root->left = delete_key(...)`와 같은 역할입니다.                                              |
| `def __contains__(self, key):`                         | 이 메서드 덕분에 `40 in tree`를 쓸 수 있습니다.                                                                                                                               |
| `yield from walk(node.left)`                           | 다른 제너레이터가 내주는 값을 **그대로 이어서** 내줍니다. 재귀 중위 순회를 제너레이터로 만든 것입니다. `list(tree)`는 이 제너레이터를 끝까지 돌려 오름차순 리스트를 만듭니다. |
| `f"{str(order):<22}"`                                  | 리스트를 문자열로 바꾼 뒤 22칸 왼쪽 정렬해 표처럼 맞췄습니다.                                                                                                                 |

## 7. Rust로 구현하기

Rust 버전은 `&mut Tree`(= `&mut Option<Box<Node>>`)를 받아 **제자리에서** 트리를 고칩니다. C처럼 새 루트를 돌려받아 연결할 필요 없이, "빈 칸을 가리키는 가변 참조"에 직접 새 노드를 넣습니다(Day 61의 연결 리스트와 같은 기법).

```rust
// 파일: bst.rs
use std::cmp::Ordering;

struct Node {
    key: i32,
    left: Tree,
    right: Tree,
}

type Tree = Option<Box<Node>>;

fn insert(tree: &mut Tree, key: i32) -> bool {
    match tree {
        None => {
            *tree = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => match key.cmp(&n.key) {
            Ordering::Less => insert(&mut n.left, key),
            Ordering::Greater => insert(&mut n.right, key),
            Ordering::Equal => false,
        },
    }
}

fn search_path(tree: &Tree, key: i32) -> (bool, Vec<i32>) {
    let mut path = Vec::new();
    let mut cur = tree;
    while let Some(n) = cur {
        path.push(n.key);
        match key.cmp(&n.key) {
            Ordering::Equal => return (true, path),
            Ordering::Less => cur = &n.left,
            Ordering::Greater => cur = &n.right,
        }
    }
    (false, path)
}

fn take_min(tree: &mut Tree) -> i32 {
    let node = tree.as_mut().expect("빈 서브트리에는 최솟값이 없다");
    if node.left.is_some() {
        return take_min(&mut node.left);
    }
    let node = tree.take().unwrap();    // 최솟값 노드를 떼어 내고
    *tree = node.right;                 // 그 오른쪽 자식이 자리를 잇는다
    node.key
}

fn remove(tree: &mut Tree, key: i32) -> bool {
    match tree {
        None => false,
        Some(n) if key < n.key => remove(&mut n.left, key),
        Some(n) if key > n.key => remove(&mut n.right, key),
        Some(n) => {
            match (n.left.take(), n.right.take()) {
                (None, None) => *tree = None,           // 경우 1
                (Some(l), None) => *tree = Some(l),     // 경우 2
                (None, Some(r)) => *tree = Some(r),     // 경우 2
                (Some(l), Some(r)) => {                 // 경우 3
                    n.left = Some(l);
                    n.right = Some(r);
                    n.key = take_min(&mut n.right);
                }
            }
            true
        }
    }
}

fn inorder(tree: &Tree, out: &mut Vec<i32>) {
    if let Some(n) = tree {
        inorder(&n.left, out);
        out.push(n.key);
        inorder(&n.right, out);
    }
}

fn height(tree: &Tree) -> usize {
    tree.as_ref().map_or(0, |n| 1 + height(&n.left).max(height(&n.right)))
}

fn keys(tree: &Tree) -> Vec<i32> {
    let mut out = Vec::new();
    inorder(tree, &mut out);
    out
}

fn main() {
    let mut tree: Tree = None;
    for k in [50, 30, 70, 20, 40, 60, 80, 65, 40] {
        insert(&mut tree, k);
    }
    println!("중위: {:?}, 높이 {}", keys(&tree), height(&tree));
    println!("65 경로: {:?}", search_path(&tree, 65));
    println!("55 경로: {:?}", search_path(&tree, 55));

    for k in [20, 60, 50, 99] {
        let ok = remove(&mut tree, k);
        let root = tree.as_ref().map(|n| n.key);
        println!("remove {k}: {} → {:?}, 루트 {:?}", if ok { "삭제" } else { "없음" }, keys(&tree), root);
    }

    let mut skewed: Tree = None;
    for k in 1..=7 {
        insert(&mut skewed, k);
    }
    let mut balanced: Tree = None;
    for k in [4, 2, 6, 1, 3, 5, 7] {
        insert(&mut balanced, k);
    }
    println!("정렬 순서: 높이 {}, 7까지 비교 {}번", height(&skewed), search_path(&skewed, 7).1.len());
    println!("섞은 순서: 높이 {}, 7까지 비교 {}번", height(&balanced), search_path(&balanced, 7).1.len());
}
```

실행 결과:

```text
중위: [20, 30, 40, 50, 60, 65, 70, 80], 높이 4
65 경로: (true, [50, 70, 60, 65])
55 경로: (false, [50, 70, 60])
remove 20: 삭제 → [30, 40, 50, 60, 65, 70, 80], 루트 Some(50)
remove 60: 삭제 → [30, 40, 50, 65, 70, 80], 루트 Some(50)
remove 50: 삭제 → [30, 40, 65, 70, 80], 루트 Some(65)
remove 99: 없음 → [30, 40, 65, 70, 80], 루트 Some(65)
정렬 순서: 높이 7, 7까지 비교 7번
섞은 순서: 높이 3, 7까지 비교 3번
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key.cmp(&n.key)`                                      | 두 값을 비교해 `Ordering::Less`, `Equal`, `Greater` 중 하나를 돌려줍니다. `match`로 세 경우를 빠짐없이 처리할 수 있어 `<`, `>`, `==`를 따로 쓰는 것보다 실수가 적습니다. |
| `None => { *tree = Some(Box::new(...)); true }`        | tree가 가리키는 **빈 칸**에 새 노드를 넣습니다. 부모의 left 또는 right 칸 자체를 가리키고 있으므로 연결이 자동으로 됩니다.                                               |
| `cur = &n.left`                                        | 검색은 트리를 빌려서(`&Tree`) 내려갑니다. 트리가 바뀌지 않습니다.                                                                                                        |
| `match (n.left.take(), n.right.take())`                | 두 자식을 **꺼내서** 튜플로 묶고 네 가지 모양을 한꺼번에 나눕니다. `take()`로 꺼냈기 때문에 경우 3에서는 다시 제자리에 넣어 줍니다.                                      |
| `(Some(l), None) => *tree = Some(l)`                   | 지울 노드가 있던 칸에 왼쪽 자식을 넣습니다. 원래 노드(Box)는 덮어써지면서 자동으로 해제됩니다. C의 `free(root); return left;`에 해당합니다.                              |
| `n.key = take_min(&mut n.right);`                      | 오른쪽 서브트리에서 최솟값 노드를 **떼어 내면서** 그 키를 받아 옵니다. C는 "찾기"와 "지우기"를 따로 했지만, 여기서는 한 번에 합니다.                                     |
| `let node = tree.take().unwrap(); *tree = node.right;` | 최솟값 노드를 칸에서 꺼내고, 그 칸에 노드의 오른쪽 자식을 넣습니다(최솟값 노드는 왼쪽 자식이 없음). 꺼낸 노드는 함수가 끝날 때 해제됩니다.                               |
| `tree.as_ref().map_or(0, \|n\| ...)`                   | 비어 있으면 0, 있으면 클로저의 값을 돌려줍니다. `match`를 한 줄로 줄인 모양입니다.                                                                                       |

> **참고**: `remove`의 `Some(n) if key < n.key =>` 갈래는 **매치 가드**입니다. `key.cmp`를 쓰지 않은 이유는 마지막 갈래에서 `n`을 쓰면서 동시에 `*tree`에 대입해야 하기 때문입니다. 두 방법 모두 가능하며, 최신 Rust 컴파일러는 이 코드가 안전하다는 것을 알아냅니다.

## 8. 실행 추적

자식이 둘인 노드 50을 지우는 과정을 Rust 코드 기준으로 따라갑니다. 20과 60을 지운 뒤라 트리는 다음과 같습니다.

```text
        50
      /    \
    30      70
      \    /  \
      40  65   80
```

| 순서 | 실행                                   | 상태 변화                                                      |
| ---: | -------------------------------------- | -------------------------------------------------------------- |
|    1 | `remove(루트 칸, 50)`                  | key == 50이므로 마지막 갈래                                    |
|    2 | `(n.left.take(), n.right.take())`      | 30 서브트리와 70 서브트리를 꺼냄 → `(Some, Some)` = 경우 3     |
|    3 | `n.left = Some(l); n.right = Some(r);` | 꺼낸 두 서브트리를 제자리에 돌려놓음                           |
|    4 | `take_min(&mut n.right)` (70 칸)       | 70의 왼쪽(65)이 있으므로 65 칸으로 재귀                        |
|    5 | `take_min(65 칸)`                      | 65의 왼쪽이 없음 → 65 노드를 떼어 내고, 칸에 65의 오른쪽(None) |
|    6 | 65를 돌려줌                            | 70의 왼쪽이 비게 됨                                            |
|    7 | `n.key = 65`                           | 루트의 키가 50에서 65로 바뀜                                   |

```text
결과:   65
      /    \
    30      70
      \       \
      40       80
```

중위 순회 `30 40 65 70 80`이 여전히 정렬되어 있으므로 BST 규칙이 유지되었습니다.

## 9. 다른 예제로 다시 이해하기

BST의 키에 **값**을 짝지어 저장하면 **사전(맵)** 이 됩니다. 영어 단어를 키로, 뜻을 값으로 저장하는 단어장을 만들어 봅시다. 단어는 문자열이지만 크기 비교(사전 순서)가 가능하므로 숫자와 똑같이 BST에 넣을 수 있습니다. 중위 순회를 하면 단어가 **알파벳 순서**로 나오고, 같은 단어를 다시 넣으면 뜻을 **갱신**합니다. 또 BST의 규칙을 이용하면 "b로 시작해서 m 이전까지의 단어"처럼 **범위**에 드는 단어만 골라낼 수 있습니다. 범위를 벗어나는 서브트리는 통째로 건너뜁니다.

```python
# 파일: word_map.py
class Entry:
    def __init__(self, word, meaning):
        self.word, self.meaning = word, meaning
        self.left = self.right = None


class WordMap:
    def __init__(self):
        self.root = None

    def put(self, word, meaning):
        if self.root is None:
            self.root = Entry(word, meaning)
            return
        cur = self.root
        while True:
            if word == cur.word:
                cur.meaning = meaning            # 이미 있으면 뜻을 갱신
                return
            if word < cur.word:
                if cur.left is None:
                    cur.left = Entry(word, meaning)
                    return
                cur = cur.left
            else:
                if cur.right is None:
                    cur.right = Entry(word, meaning)
                    return
                cur = cur.right

    def get(self, word):
        cur = self.root
        while cur is not None and cur.word != word:
            cur = cur.left if word < cur.word else cur.right
        return None if cur is None else cur.meaning

    def between(self, lo, hi):
        found = []

        def walk(e):
            if e is None:
                return
            if lo < e.word:                     # 왼쪽에 범위 안의 단어가 있을 수 있다
                walk(e.left)
            if lo <= e.word < hi:
                found.append(e.word)
            if e.word < hi:                     # 오른쪽에 범위 안의 단어가 있을 수 있다
                walk(e.right)

        walk(self.root)
        return found


words = WordMap()
for w, m in [("mango", "망고"), ("apple", "사과"), ("tree", "나무"), ("banana", "바나나"),
             ("kiwi", "키위"), ("cherry", "체리"), ("zebra", "얼룩말"), ("apple", "사과(과일)")]:
    words.put(w, m)

print("apple →", words.get("apple"))
print("grape →", words.get("grape"))
print("b 이상 m 미만:", words.between("b", "m"))
print("전체(알파벳 순):", words.between("", "~"))
```

실행 결과:

```text
apple → 사과(과일)
grape → None
b 이상 m 미만: ['banana', 'cherry', 'kiwi']
전체(알파벳 순): ['apple', 'banana', 'cherry', 'kiwi', 'mango', 'tree', 'zebra']
```

Rust 표준 라이브러리에는 이런 **정렬된 맵**이 이미 있습니다. `BTreeMap`은 BST를 발전시킨 **B-트리**로 구현되어 있어 항상 균형이 맞고, 키 순서대로 순회하거나 범위를 꺼낼 수 있습니다.

```rust
// 파일: btreemap_demo.rs
use std::collections::BTreeMap;

fn main() {
    let mut words: BTreeMap<&str, &str> = BTreeMap::new();
    for (w, m) in [("mango", "망고"), ("apple", "사과"), ("tree", "나무"), ("banana", "바나나"),
                   ("kiwi", "키위"), ("cherry", "체리"), ("zebra", "얼룩말")] {
        words.insert(w, m);
    }
    words.insert("apple", "사과(과일)");                 // 같은 키는 값을 덮어쓴다

    println!("apple → {:?}", words.get("apple"));
    println!("grape → {:?}", words.get("grape"));
    let range: Vec<&str> = words.range("b".."m").map(|(w, _)| *w).collect();
    println!("b 이상 m 미만: {:?}", range);
    println!("첫 단어 {:?}, 마지막 단어 {:?}", words.first_key_value(), words.last_key_value());
    println!("전체: {:?}", words.keys().collect::<Vec<_>>());
}
```

실행 결과:

```text
apple → Some("사과(과일)")
grape → None
b 이상 m 미만: ["banana", "cherry", "kiwi"]
첫 단어 Some(("apple", "사과(과일)")), 마지막 단어 Some(("zebra", "얼룩말"))
전체: ["apple", "banana", "cherry", "kiwi", "mango", "tree", "zebra"]
```

Python에는 정렬된 맵이 표준 라이브러리에 없습니다. 대신 순서가 필요 없는 사전 `dict`(해시 맵, Day 67)를 쓰거나, 정렬된 리스트에 `bisect` 모듈로 이진 탐색을 합니다. C++에는 `std::map`, Java에는 `TreeMap`이라는 이름으로 같은 자료구조가 있습니다.

## 10. 시간·공간 복잡도

높이를 h, 노드 수를 n이라고 하면

| 연산                    | 비용 | 균형 트리(h ≈ log n) | 편향 트리(h = n) |
| ----------------------- | ---- | -------------------- | ---------------- |
| 검색                    | O(h) | O(log n)             | O(n)             |
| 삽입                    | O(h) | O(log n)             | O(n)             |
| 삭제                    | O(h) | O(log n)             | O(n)             |
| 최솟값·최댓값           | O(h) | O(log n)             | O(n)             |
| 전체 정렬 순서로 꺼내기 | O(n) | O(n)                 | O(n)             |
| 공간                    | O(n) | 노드당 포인터 2개    |                  |

무작위 순서로 넣으면 평균 높이는 약 2 log n 정도로 괜찮은 편입니다. 문제는 정렬되었거나 거의 정렬된 순서로 넣을 때입니다. 실무의 정렬된 맵(`BTreeMap`, `std::map` 등)이 스스로 균형을 맞추는 트리를 쓰는 이유입니다.

## 11. 세 언어 비교

| 관점             | C                                      | Python                             | Rust                                            |
| ---------------- | -------------------------------------- | ---------------------------------- | ----------------------------------------------- |
| 재귀 삽입의 연결 | `root->left = insert(root->left, key)` | `node.left, r = self._delete(...)` | `&mut Tree`로 빈 칸에 직접 대입                 |
| 세 방향 비교     | `<`, `>`, `==`                         | `<`, `>`, `==`                     | `key.cmp(&n.key)` → `Ordering`                  |
| 삭제 결과 전달   | 반환값(새 루트) + `bool *removed`      | 튜플 `(새 루트, 삭제 여부)`        | 반환값 `bool` (트리는 제자리 수정)              |
| 노드 해제        | `free` 직접                            | 자동                               | 칸을 덮어쓰거나 `take()`한 Box가 사라질 때 자동 |
| 중위 순회        | 재귀 출력                              | `yield from` 제너레이터            | `&mut Vec`에 push                               |
| 표준 정렬 맵     | 없음                                   | 없음(`dict`는 해시, `bisect` 사용) | `std::collections::BTreeMap`                    |

## 12. 자주 하는 실수

### 실수 1: 직계 자식과만 비교해서 BST라고 판단한다

```text
        20
       /
     10
       \
        25     ← 10보다 크니 10의 오른쪽은 맞지만, 20의 왼쪽 서브트리에 있으므로 20보다 작아야 한다!
```

모든 노드가 직계 자식과의 관계는 맞지만 BST가 아닙니다. 검사하려면 조상들이 정한 **허용 범위**를 넘겨 가며 확인해야 합니다(실습의 직접 구현 문제).

### 실수 2: 재귀 삽입·삭제의 반환값을 연결하지 않는다

```c
if (key < root->key) insert(root->left, key);      // 반환값을 버린다
```

C 함수는 포인터의 **복사본**을 받으므로, 안에서 만든 새 노드의 주소는 반환값으로만 전달됩니다. 반드시 `root->left = insert(...)`로 받으세요. 실습의 디버그 문제에서 이 버그를 고칩니다.

### 실수 3: 자식이 둘인 노드를 지울 때 한쪽 서브트리를 버린다

자식이 둘인 노드를 "왼쪽 자식으로 대체"하면 오른쪽 서브트리를 붙일 곳이 없어 통째로 잃어버립니다. 후계자(또는 선행자)의 **값을 옮기고** 후계자 노드를 지우는 방법을 쓰세요.

### 실수 4: 정렬된 데이터를 그대로 넣는다

```python
# 파일: skewed_recursion.py (실행 오류: RecursionError)
class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None


def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root


root = None
for k in range(5000):          # 0, 1, 2, ... 정렬된 순서
    root = insert(root, k)
print("완료")
```

```text
RecursionError: maximum recursion depth exceeded
```

정렬된 5,000개를 넣으면 트리가 한 줄로 늘어서 높이가 5,000이 되고, 재귀 삽입이 Python의 기본 재귀 한도(약 1,000)를 넘습니다. 속도뿐 아니라 **프로그램이 멈추는** 문제로 이어질 수 있습니다. 반복문으로 삽입하거나(Python BST 클래스의 `insert`), 균형 트리를 쓰세요.

### 실수 5: 같은 키 처리 규칙을 정하지 않는다

같은 키를 왼쪽에 넣을지, 오른쪽에 넣을지, 무시할지, 값을 갱신할지 정하지 않으면 검색과 삭제가 서로 다른 규칙을 따르게 됩니다. 이 수업은 "집합이면 무시, 맵이면 값 갱신"으로 정했습니다.

## 13. Q&A

**Q. 후계자 대신 선행자(왼쪽 서브트리의 최댓값)를 써도 되나요?**

A. 됩니다. 선행자도 왼쪽 서브트리의 나머지보다 크고 오른쪽 서브트리보다 작습니다. 항상 한쪽만 쓰면 삭제를 반복할 때 트리가 한쪽으로 기우는 경향이 있어, 번갈아 쓰는 구현도 있습니다.

**Q. 균형 트리는 어떻게 균형을 맞추나요?**

A. 노드를 넣거나 뺀 뒤 한쪽이 너무 높아지면 **회전(rotation)** 이라는 연산으로 부모와 자식의 위치를 바꿉니다. 회전은 중위 순서를 바꾸지 않으므로 BST 규칙이 유지됩니다. AVL 트리는 두 서브트리의 높이 차이를 1 이하로, 레드-블랙 트리는 노드에 색을 칠해 느슨하게 균형을 유지합니다. 자료구조 과목의 다음 단계에서 배우는 주제입니다.

**Q. 왜 Rust는 이진 탐색 트리 대신 B-트리를 쓰나요?**

A. B-트리는 노드 하나에 키를 **여러 개**(보통 수십 개) 담아 높이를 더 낮춥니다. 한 노드의 키들이 메모리에 붙어 있어 CPU 캐시를 잘 활용하므로, 노드마다 포인터를 따라가야 하는 이진 트리보다 실제로 빠릅니다. 데이터베이스와 파일 시스템도 같은 이유로 B-트리를 씁니다.

**Q. BST와 해시 맵(Day 67) 중 무엇을 써야 하나요?**

A. 값으로 찾기만 하면 된다면 보통 해시 맵이 더 빠릅니다(평균 O(1)). 하지만 **정렬된 순서**로 꺼내거나, **범위**를 찾거나, 가장 작은/큰 키를 알아야 한다면 BST 계열(정렬된 맵)이 필요합니다.

## 14. 핵심 요약

- BST의 규칙: 모든 노드에서 **왼쪽 서브트리 < 노드 < 오른쪽 서브트리**. 직계 자식이 아니라 서브트리 전체에 대한 규칙입니다.
- 검색과 삽입은 루트부터 **비교하고 한쪽으로 내려가는** 과정입니다. 삽입은 검색이 실패한 빈자리에 잎으로 들어갑니다.
- 삭제는 세 경우입니다. 잎은 떼어 내고, 자식이 하나면 자식이 자리를 잇고, 자식이 둘이면 **후계자의 값을 옮긴 뒤 후계자를 지웁니다.**
- **중위 순회는 오름차순**입니다.
- 모든 연산의 비용은 **높이 h**에 비례합니다. 균형 트리는 O(log n), 정렬된 순서로 넣어 만든 편향 트리는 O(n)입니다.
- C는 재귀 함수가 새 서브트리 루트를 돌려주고 부모가 다시 연결합니다. Rust는 `&mut Option<Box<Node>>`로 빈 칸에 직접 넣습니다.
- 실무에서는 스스로 균형을 맞추는 정렬된 맵(Rust `BTreeMap`, C++ `std::map`)을 씁니다.

## 15. 도전 문제

1. **(C)** 어떤 키보다 작거나 같은 키 중 가장 큰 것을 찾는 `floor(root, key)`와, 크거나 같은 키 중 가장 작은 것을 찾는 `ceil(root, key)`를 반복문으로 구현하세요.
2. **(Python)** BST에서 k번째로 작은 키를 구하는 `kth_smallest(k)`를 만드세요. 먼저 중위 순회로 구현한 뒤, 각 노드에 서브트리 크기를 저장해 O(h)로 구하는 방법도 생각해 보세요.
3. **(Rust)** 정렬된 배열 `[1, 2, ..., 15]`로부터 **높이가 가장 낮은** BST를 만드는 함수를 작성하세요. 힌트: 가운데 원소를 루트로 하고 양쪽을 재귀적으로 처리합니다. 높이가 4인지 확인하세요.
4. **(세 언어)** 무작위 순서로 1,000개를 넣은 BST와 정렬된 순서로 1,000개를 넣은 BST의 높이를 비교해 보세요(재귀 한도에 주의하고, 필요하면 반복문 삽입을 쓰세요).
