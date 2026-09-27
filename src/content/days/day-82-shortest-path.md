---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-82-shortest-path
courseId: crp-92
phaseId: phase-07
dayNumber: 82
date: "2026-12-21"
title: 최단 경로 — 다익스트라 알고리즘과 거리 갱신
summary: 간선마다 거리(가중치)가 다른 그래프에서 가장 짧은 길을 찾는 다익스트라 알고리즘을 힙(우선순위 큐)으로 C, Python, Rust에서 구현합니다. '더 짧은 길을 찾으면 갱신한다'는 완화(relaxation)와 '가장 가까운 후보부터 확정한다'는 규칙을 추적하고, 경로 복원, 도달할 수 없는 정점, 음수 간선에서 다익스트라가 틀리는 이유와 벨먼-포드, 격자 지도의 최소 비용 경로까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 120
prerequisites: [day-81-dfs]
learningObjectives:
  - 가중치 그래프에서 BFS가 최단 경로를 보장하지 못하는 이유를 예로 설명한다.
  - 완화(dist[v] > dist[u] + w이면 갱신)와 가장 가까운 후보부터 확정하는 규칙으로 다익스트라를 손으로 추적한다.
  - 최소 힙으로 다익스트라를 구현하고, 낡은 힙 항목을 건너뛰는 이유를 설명한다.
  - prev 배열로 최단 경로를 복원하고, 도달할 수 없는 정점을 올바르게 표시한다.
  - 음수 간선에서 다익스트라가 틀리는 반례를 만들고 벨먼-포드와 비교한다.
concepts:
  [
    shortest path,
    dijkstra,
    relaxation,
    priority queue,
    min heap,
    path reconstruction,
    bellman-ford,
    negative edge,
    grid path,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dijkstra.py — 간선 가중치를 바꿔 최단 거리가 어떻게 달라지는지 보세요.
  import heapq

  graph = {
      "집": [("학교", 7), ("공원", 2)],
      "공원": [("학교", 3), ("도서관", 6)],
      "학교": [("도서관", 1)],
      "도서관": [],
  }

  dist = {v: float("inf") for v in graph}
  dist["집"] = 0
  heap = [(0, "집")]
  while heap:
      d, u = heapq.heappop(heap)
      if d > dist[u]:
          continue
      for v, w in graph[u]:
          if d + w < dist[v]:
              dist[v] = d + w
              heapq.heappush(heap, (dist[v], v))
  print(dist)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day82-predict-py
    title: 다익스트라 거리 예측하기
    kind: predict
    objective: 간선 수가 많아도 가중치 합이 작은 길이 최단이라는 것을 추적한다.
    prompt: 출력될 두 숫자(A와 C까지의 최단 거리)를 공백으로 구분해 적으세요.
    starter: |-
      import heapq

      graph = {"S": [("A", 5), ("B", 1)], "B": [("A", 2)], "A": [("C", 1)], "C": []}
      dist = {v: float("inf") for v in graph}
      dist["S"] = 0
      heap = [(0, "S")]
      while heap:
          d, u = heapq.heappop(heap)
          if d > dist[u]:
              continue
          for v, w in graph[u]:
              if d + w < dist[v]:
                  dist[v] = d + w
                  heapq.heappush(heap, (dist[v], v))
      print(dist["A"], dist["C"])
    answer: "3 4"
    hint: "S → A로 바로 가면 5지만, S → B → A는 1 + 2 = 3입니다. C는 A를 거쳐 1을 더합니다."
    explanation: "S를 꺼내면 A = 5, B = 1이 됩니다. 더 가까운 B를 먼저 꺼내 A를 3으로 갱신합니다. 그다음 A(3)를 꺼내 C = 4가 되고, 힙에 남은 (5, A)는 낡은 항목이라 건너뜁니다. BFS라면 간선 하나짜리 S → A(5)를 먼저 찾았을 것입니다."
    commonMistakes:
      - "간선 수가 적은 S → A를 최단이라고 생각해 5 6으로 적음"
      - "낡은 항목 (5, A)를 다시 처리해 값이 바뀐다고 생각함"
    language: python
    verification: run
  - id: ex-day82-predict-c
    title: 배열로 하는 다익스트라 결과 예측하기
    kind: predict
    objective: 힙 없이 매번 가장 가까운 미확정 정점을 고르는 O(V²) 다익스트라를 추적한다.
    prompt: 출력될 네 거리를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define N 4
      #define INF 1000000

      int main(void) {
          int w[N][N] = {
              {0, 7, 3, 0},
              {0, 0, 0, 1},
              {0, 2, 0, 8},
              {0, 0, 0, 0},
          };                                  // w[u][v] = 0이면 간선 없음
          int dist[N] = {0, INF, INF, INF};
          bool done[N] = {false};
          for (int k = 0; k < N; k++) {
              int u = -1;
              for (int i = 0; i < N; i++)
                  if (!done[i] && (u == -1 || dist[i] < dist[u])) u = i;
              done[u] = true;
              for (int v = 0; v < N; v++)
                  if (w[u][v] && dist[u] + w[u][v] < dist[v]) dist[v] = dist[u] + w[u][v];
          }
          for (int i = 0; i < N; i++) printf("%d ", dist[i]);
          printf("\n");
          return 0;
      }
    answer: "0 5 3 6"
    hint: "0을 확정하면 1 = 7, 2 = 3입니다. 가장 가까운 2를 확정하면 1이 3 + 2 = 5로 줄고 3 = 11이 됩니다. 이어서 1을 확정하면 3이 5 + 1 = 6이 됩니다."
    explanation: "정점이 적고 간선이 많은(조밀한) 그래프에서는 힙 없이 배열을 훑는 이 O(V²) 방법도 충분히 빠르고 코드가 단순합니다. 인접 행렬(Day 68)과 잘 어울립니다."
    commonMistakes:
      - "0 → 1의 직접 간선 7을 그대로 적음"
      - "3을 0 → 2 → 3 = 11로 적음"
    language: c
    verification: run
  - id: ex-day82-fill
    title: Rust BinaryHeap 다익스트라 빈칸 채우기
    kind: fill
    objective: Rust의 최대 힙을 Reverse로 최소 힙처럼 쓰고, 완화 조건을 적는다.
    prompt: "빈칸 두 곳에 시작점을 힙에 넣는 코드와, 더 짧은 길을 찾았는지 검사하는 조건을 채우세요."
    starter: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn main() {
          let adj: Vec<Vec<(usize, u32)>> = vec![vec![(1, 4), (2, 1)], vec![(3, 1)], vec![(1, 2), (3, 5)], vec![]];
          let mut dist = vec![u32::MAX; 4];
          let mut heap = BinaryHeap::new();
          dist[0] = 0;
          heap.push(_____);
          while let Some(Reverse((d, u))) = heap.pop() {
              if d > dist[u] {
                  continue;
              }
              for &(v, w) in &adj[u] {
                  if _____ {
                      dist[v] = d + w;
                      heap.push(Reverse((dist[v], v)));
                  }
              }
          }
          println!("{:?}", dist);
      }
    answer: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn main() {
          let adj: Vec<Vec<(usize, u32)>> = vec![vec![(1, 4), (2, 1)], vec![(3, 1)], vec![(1, 2), (3, 5)], vec![]];
          let mut dist = vec![u32::MAX; 4];
          let mut heap = BinaryHeap::new();
          dist[0] = 0;
          heap.push(Reverse((0, 0)));
          while let Some(Reverse((d, u))) = heap.pop() {
              if d > dist[u] {
                  continue;
              }
              for &(v, w) in &adj[u] {
                  if d + w < dist[v] {
                      dist[v] = d + w;
                      heap.push(Reverse((dist[v], v)));
                  }
              }
          }
          println!("{:?}", dist);
      }
    output: "[0, 3, 1, 4]"
    hint: "BinaryHeap은 가장 큰 값을 먼저 꺼냅니다. (거리, 정점) 튜플을 Reverse로 감싸면 크기 비교가 뒤집혀 가장 작은 거리가 먼저 나옵니다."
    explanation: "d는 힙에서 꺼낸 정점의 실제 거리라 u32::MAX가 아니므로 d + w가 넘치지 않습니다. dist[v] + w처럼 아직 모르는 쪽(u32::MAX)에 더하면 넘침 panic이 납니다. 0 → 2(1) → 1(3) → 3(4)가 최단입니다."
    commonMistakes:
      - "Reverse 없이 넣어 가장 먼 후보부터 꺼냄"
      - "조건을 dist[u] + w < dist[v]로 쓰고 낡은 항목 검사를 빼서 이중 처리함"
    language: rust
    verification: run
  - id: ex-day82-modify
    title: 목적지에 닿으면 바로 멈추기
    kind: modify
    objective: 다익스트라가 정점을 꺼내는 순간 그 거리가 확정된다는 성질로 탐색을 일찍 끝낸다.
    prompt: "shortest(graph, start, goal)가 goal을 힙에서 꺼내는 순간 그 거리를 돌려주고, 끝까지 찾지 못하면 None을 돌려주게 바꾸세요. 아래 그래프에서 13 None이 출력되어야 합니다."
    starter: |-
      import heapq

      roads = {
          "A": [("B", 4), ("C", 2)], "B": [("A", 4), ("C", 1), ("D", 5)],
          "C": [("A", 2), ("B", 1), ("D", 8), ("E", 10)], "D": [("B", 5), ("C", 8), ("E", 2), ("F", 6)],
          "E": [("C", 10), ("D", 2), ("F", 3)], "F": [("D", 6), ("E", 3)], "G": [],
      }


      def shortest(graph, start, goal):
          dist = {start: 0}
          heap = [(0, start)]
          while heap:
              d, u = heapq.heappop(heap)
              if d > dist[u]:
                  continue
              for v, w in graph[u]:
                  if d + w < dist.get(v, float("inf")):
                      dist[v] = d + w
                      heapq.heappush(heap, (d + w, v))
          return dist


      print(shortest(roads, "A", "F"), shortest(roads, "A", "G"))
    answer: |-
      import heapq

      roads = {
          "A": [("B", 4), ("C", 2)], "B": [("A", 4), ("C", 1), ("D", 5)],
          "C": [("A", 2), ("B", 1), ("D", 8), ("E", 10)], "D": [("B", 5), ("C", 8), ("E", 2), ("F", 6)],
          "E": [("C", 10), ("D", 2), ("F", 3)], "F": [("D", 6), ("E", 3)], "G": [],
      }


      def shortest(graph, start, goal):
          dist = {start: 0}
          heap = [(0, start)]
          while heap:
              d, u = heapq.heappop(heap)
              if d > dist[u]:
                  continue
              if u == goal:
                  return d                    # 꺼내는 순간 확정된다
              for v, w in graph[u]:
                  if d + w < dist.get(v, float("inf")):
                      dist[v] = d + w
                      heapq.heappush(heap, (d + w, v))
          return None


      print(shortest(roads, "A", "F"), shortest(roads, "A", "G"))
    output: "13 None"
    hint: "goal의 거리가 처음 갱신될 때가 아니라, 힙에서 꺼낼 때 확인해야 합니다. 갱신될 때의 값은 나중에 더 줄어들 수 있습니다."
    explanation: "F는 처음 D를 확정할 때 8 + 6 = 14로 갱신되지만, 나중에 E(10)에서 13으로 다시 줄어듭니다. 그래서 갱신 순간에 멈추면 14라는 틀린 답이 나옵니다. 힙에서 꺼낼 때는 남은 모든 후보가 그보다 멀므로 더 줄어들 수 없습니다."
    commonMistakes:
      - "dist[v]를 갱신하는 순간 v == goal이면 반환해 14를 돌려줌"
      - "while이 끝난 뒤 dist[goal]을 읽어 KeyError를 냄"
    language: python
    verification: run
  - id: ex-day82-debug
    title: C 다익스트라의 확정 표시 버그 고치기
    kind: debug
    objective: 확정한 정점을 표시하지 않으면 같은 정점만 반복해서 고른다는 것을 확인한다.
    prompt: "이 O(V²) 다익스트라는 0 2 10 -1을 출력합니다(-1은 갈 수 없음). 0 → 1 → 2 → 3으로 가면 되는데 왜 이런 결과가 나오는지 찾아 고쳐서 0 2 5 6이 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define N 4
      #define INF 1000000

      int main(void) {
          int w[N][N] = {{0, 2, 10, 0}, {0, 0, 3, 0}, {0, 0, 0, 1}, {0, 0, 0, 0}};
          int dist[N] = {0, INF, INF, INF};
          bool done[N] = {false};
          for (int k = 0; k < N; k++) {
              int u = -1;
              for (int i = 0; i < N; i++)
                  if (!done[i] && (u == -1 || dist[i] < dist[u])) u = i;
              for (int v = 0; v < N; v++)
                  if (w[u][v] && dist[u] + w[u][v] < dist[v]) dist[v] = dist[u] + w[u][v];
          }
          for (int i = 0; i < N; i++) printf("%d ", dist[i] == INF ? -1 : dist[i]);
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define N 4
      #define INF 1000000

      int main(void) {
          int w[N][N] = {{0, 2, 10, 0}, {0, 0, 3, 0}, {0, 0, 0, 1}, {0, 0, 0, 0}};
          int dist[N] = {0, INF, INF, INF};
          bool done[N] = {false};
          for (int k = 0; k < N; k++) {
              int u = -1;
              for (int i = 0; i < N; i++)
                  if (!done[i] && (u == -1 || dist[i] < dist[u])) u = i;
              done[u] = true;                 // 확정 표시
              for (int v = 0; v < N; v++)
                  if (w[u][v] && dist[u] + w[u][v] < dist[v]) dist[v] = dist[u] + w[u][v];
          }
          for (int i = 0; i < N; i++) printf("%d ", dist[i] == INF ? -1 : dist[i]);
          printf("\n");
          return 0;
      }
    output: "0 2 5 6 "
    starterOutput: "0 2 10 -1 "
    hint: "반복할 때마다 어떤 u가 골라지는지 출력해 보세요. done이 한 번도 true가 되지 않습니다."
    explanation: "done을 바꾸지 않으면 거리가 가장 작은 0이 매번 다시 골라져 0의 이웃만 네 번 완화됩니다. 1과 2에서 나가는 간선은 한 번도 보지 않아 2는 10, 3은 갈 수 없음으로 남습니다. INF를 INT_MAX가 아닌 1000000으로 둔 것은 dist[u] + w가 넘치지 않게 하려는 것입니다."
    commonMistakes:
      - "done[u] = true를 완화 반복 안에 넣어 v를 표시함"
      - "INF를 INT_MAX로 바꿔 INF + w에서 넘침이 생김"
    language: c
    verification: run
  - id: ex-day82-independent
    title: Rust로 신호가 모두 퍼지는 시간 구하기
    kind: independent
    objective: 다익스트라의 결과로 '가장 먼 정점까지의 최단 거리'를 구하고 도달 불가능을 처리한다.
    prompt: "방향 간선 (보내는 곳, 받는 곳, 걸리는 시간) 목록과 출발 정점이 주어질 때, 신호가 모든 정점(1번부터 n번)에 도착하는 데 걸리는 시간을 구하세요. 도착하지 못하는 정점이 있으면 -1입니다. 예시 두 개에서 4 -1이 출력되어야 합니다."
    starter: |-
      fn main() {
          let edges = [(1, 2, 1), (1, 3, 4), (2, 3, 2), (3, 4, 1), (2, 4, 5)];
          println!("{}", edges.len());
      }
    answer: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn delay(edges: &[(usize, usize, u32)], n: usize, start: usize) -> i64 {
          let mut adj = vec![Vec::new(); n + 1];
          for &(u, v, w) in edges {
              adj[u].push((v, w));
          }
          let mut dist: Vec<Option<u32>> = vec![None; n + 1];
          let mut heap = BinaryHeap::from([Reverse((0u32, start))]);
          while let Some(Reverse((d, u))) = heap.pop() {
              if dist[u].is_some() {
                  continue;                   // 이미 확정됨
              }
              dist[u] = Some(d);
              for &(v, w) in &adj[u] {
                  if dist[v].is_none() {
                      heap.push(Reverse((d + w, v)));
                  }
              }
          }
          let mut worst = 0;
          for d in &dist[1..] {
              match d {
                  Some(d) => worst = worst.max(*d),
                  None => return -1,
              }
          }
          i64::from(worst)
      }

      fn main() {
          let edges = [(1, 2, 1), (1, 3, 4), (2, 3, 2), (3, 4, 1), (2, 4, 5)];
          println!("{} {}", delay(&edges, 4, 1), delay(&edges, 5, 1));
      }
    output: "4 -1"
    hint: "모든 정점의 최단 거리를 구한 뒤 그중 가장 큰 값이 답입니다. 신호는 모든 방향으로 동시에 퍼지므로, 가장 늦게 도착하는 정점이 끝나는 시각을 정합니다."
    explanation: "1 → 2(1) → 3(3) → 4(4)이므로 가장 늦은 정점 4가 4에 도착합니다. n = 5이면 5번 정점으로 가는 간선이 없어 -1입니다. 이 답안은 꺼낼 때 처음 한 번만 거리를 기록하는 방식이라, 힙에 같은 정점이 여러 번 들어가도 첫 번째(가장 작은) 값만 쓰입니다."
    commonMistakes:
      - "dist 합계를 답으로 적음"
      - "0번 인덱스(쓰지 않는 칸)까지 검사해 항상 -1을 돌려줌"
    language: rust
    verification: run
quiz:
  - id: quiz-day82-01
    question: 간선마다 가중치가 다른 그래프에서 BFS로 최단 경로를 찾으면 안 되는 이유는?
    choices:
      - BFS는 가중치 그래프를 읽지 못한다
      - BFS는 간선 수가 가장 적은 경로를 찾을 뿐, 가중치 합이 가장 작은 경로를 찾지 않는다
      - BFS는 사이클이 있으면 끝나지 않는다
      - BFS는 O(V²)라서 느리다
    answerIndex: 1
    explanation: S → A(5)는 간선 하나, S → B → A(1 + 2)는 간선 둘입니다. BFS는 앞의 것을 먼저 찾지만 실제로는 뒤의 것이 짧습니다. 모든 가중치가 같을 때만 BFS가 최단 거리를 줍니다.
  - id: quiz-day82-02
    question: 다익스트라에서 '완화(relaxation)'란?
    choices:
      - 힙에서 가장 작은 값을 꺼내는 것
      - dist[u] + w가 dist[v]보다 작으면 dist[v]를 그 값으로 줄이는 것
      - 모든 간선의 가중치를 1씩 줄이는 것
      - 방문 표시를 지우는 것
    answerIndex: 1
    explanation: 지금까지 알던 v까지의 거리보다 u를 거쳐 가는 길이 더 짧으면 기록을 고칩니다. 다익스트라와 벨먼-포드 모두 이 연산을 반복하는데, 어떤 순서로 완화하느냐가 다릅니다.
  - id: quiz-day82-03
    question: 힙에서 꺼낸 (d, u)가 d > dist[u]일 때 건너뛰는 이유는?
    choices:
      - 그 항목은 u의 거리가 나중에 더 줄어들기 전에 넣은 낡은 항목이라, 이미 더 짧은 거리로 처리했기 때문에
      - 음수 간선을 막으려고
      - 힙이 가득 찼기 때문에
      - 시작 정점이라서
    answerIndex: 0
    explanation: 이진 힙은 안에 든 값을 줄이는 연산을 제공하지 않으므로, 거리가 줄 때마다 새 항목을 넣고 옛 항목은 꺼낼 때 버립니다(지연 삭제). 그래서 힙의 크기는 V가 아니라 최대 E입니다.
  - id: quiz-day82-04
    question: 음수 가중치 간선이 있을 때 다익스트라가 틀릴 수 있는 이유는?
    choices:
      - 음수를 힙에 넣을 수 없어서
      - 가장 가까운 후보를 꺼내면 확정한다는 규칙이 '앞으로 거리가 더 줄지 않는다'는 가정에 기대는데, 음수 간선은 나중에 거리를 줄일 수 있어서
      - 음수 간선은 항상 사이클을 만들어서
      - 거리 배열을 음수로 초기화해야 해서
    answerIndex: 1
    explanation: S → A(1)을 확정한 뒤 S → B(5) → A(-10)로 -5인 길이 나타납니다. 음수 간선이 있으면 벨먼-포드(모든 간선을 V-1번 완화, O(VE))를 씁니다. 음수 사이클이 있으면 최단 거리가 정의되지 않습니다.
  - id: quiz-day82-05
    question: 힙을 쓰는 다익스트라의 시간 복잡도로 알맞은 것은?
    choices:
      - O(V + E)
      - O((V + E) log V)
      - O(V × E)
      - O(2^V)
    answerIndex: 1
    explanation: 간선마다 힙에 최대 한 번 넣고(log), 정점을 꺼내는 데도 log가 듭니다. 힙 없이 매번 최소를 찾는 배열 방식은 O(V²)이라 정점이 적고 간선이 매우 많을 때 오히려 유리합니다.
---

## 1. 오늘 배울 내용

Day 69의 BFS는 **간선 수**가 가장 적은 길을 찾았습니다. 그런데 실제 지도에서는 도로마다 길이가 다릅니다. 간선마다 **가중치**(거리, 시간, 비용)가 있는 그래프에서 **가중치 합이 가장 작은 길**을 찾는 대표 알고리즘이 **다익스트라(Dijkstra) 알고리즘**입니다. Phase 7에서 배운 것이 모두 모입니다. Day 66의 **힙**, Day 68의 **그래프 표현**, Day 69의 **BFS 뼈대**, Day 78의 **탐욕 선택**이 여기서 함께 쓰입니다.

1. 가중치 그래프에서 BFS가 틀리는 예를 봅니다.
2. **완화(relaxation)** 와 **가장 가까운 후보부터 확정하는 규칙**을 손으로 따라갑니다.
3. 최소 힙으로 다익스트라를 C, Python, Rust로 구현하고 **경로를 복원**합니다.
4. **음수 간선**의 반례와 **벨먼-포드**를 비교합니다.
5. 응용으로 칸마다 비용이 다른 **격자 지도의 최소 비용 경로**를 찾습니다.

## 2. 왜 다익스트라인가

지도 앱에서 "가장 빠른 길"을 찾거나, 인터넷 공유기들이 데이터를 보낼 경로를 고르는 일(OSPF 라우팅 규약), 게임 캐릭터가 늪을 피해 길을 찾는 일이 모두 가중치 그래프의 최단 경로 문제입니다.

BFS를 그대로 쓰면 어떻게 될까요?

```text
        5
   S ─────── A          BFS: S에서 간선 하나로 A에 닿는다 → 거리 "5"?
    \       /
   1 \     / 2          실제로는 S → B → A = 1 + 2 = 3이 더 짧다
      \   /
        B
```

BFS는 "간선 하나짜리 길"을 먼저 찾았다고 끝내 버립니다. 가중치가 있으면 **간선 수가 많아도 합이 작은 길**이 있을 수 있습니다. 다익스트라는 BFS의 큐를 **"지금까지 알려진 거리가 가장 작은 정점부터 꺼내는" 최소 힙**으로 바꿔 이 문제를 풉니다.

## 3. 그림으로 이해하기

이 수업의 도로 지도입니다(무방향, 숫자는 거리). G는 어떤 도로와도 이어져 있지 않습니다.

```text
    A ───4─── B ───5─── D ───6─── F
     \       /        / |        /
      2     1       8   2       3
       \   /      /     |      /
         C ──────┘      E ────┘
         │              │
         └──────10──────┘

도로: A-B 4, A-C 2, C-B 1, B-D 5, C-D 8, C-E 10, D-E 2, D-F 6, E-F 3
```

그림이 복잡하니 표로 정리하면 이렇습니다.

| 정점 | 이웃(거리)              |
| ---- | ----------------------- |
| A    | B(4), C(2)              |
| B    | A(4), C(1), D(5)        |
| C    | A(2), B(1), D(8), E(10) |
| D    | B(5), C(8), E(2), F(6)  |
| E    | C(10), D(2), F(3)       |
| F    | D(6), E(3)              |

A에서 F까지 가장 짧은 길은 **A → C → B → D → E → F = 2 + 1 + 5 + 2 + 3 = 13** 입니다. 간선이 다섯 개나 되지만, 간선 세 개짜리 A → C → E → F(2 + 10 + 3 = 15)나 A → B → D → F(4 + 5 + 6 = 15)보다 짧습니다.

## 4. 천천히 풀어보기

### 4.1 완화: 더 짧은 길을 찾으면 기록을 고친다

각 정점마다 "지금까지 알아낸 가장 짧은 거리" `dist`를 적어 둡니다. 처음에는 시작점만 0이고 나머지는 ∞(아직 모름)입니다. 정점 u까지의 거리를 알고 u → v 간선(가중치 w)을 볼 때,

```text
만약 dist[u] + w < dist[v] 라면:
    dist[v] = dist[u] + w      ← u를 거쳐 가는 쪽이 더 짧다
    prev[v] = u                ← v로 오는 직전 정점을 기억(경로 복원용)
```

이 연산을 **완화(relaxation)** 라고 합니다. 팽팽하게 잡아당긴 줄(∞)을 조금씩 느슨하게 풀어 주는 모습에서 나온 이름입니다.

### 4.2 확정: 가장 가까운 후보는 더 줄어들지 않는다

다익스트라의 핵심 규칙은 이것입니다.

> 아직 확정하지 않은 정점 중 dist가 **가장 작은** 정점을 골라 **확정**하고, 그 정점에서 나가는 간선을 완화한다.

왜 가장 작은 정점을 확정해도 될까요? 그 정점 u까지 더 짧은 길이 있다면, 그 길은 확정되지 않은 다른 정점 x를 지나야 합니다. 그런데 x까지의 거리가 이미 u 이상이고, 모든 가중치가 **0 이상**이면 x를 거쳐 u로 오는 길은 u의 현재 거리보다 짧아질 수 없습니다. 그래서 **매번 가장 가까운 후보를 탐욕적으로 골라도** 틀리지 않습니다(Day 78의 탐욕 선택). "모든 가중치가 0 이상"이라는 조건이 깨지면 이 논리도 무너집니다(12절 실수 3).

### 4.3 손으로 따라가기

A에서 시작합니다. 확정한 정점은 **굵게** 표시합니다.

| 단계 | 확정  | 완화한 결과                             |     A |     B |     C |     D |      E |      F |
| ---: | ----- | --------------------------------------- | ----: | ----: | ----: | ----: | -----: | -----: |
|    0 |       | 시작                                    |     0 |     ∞ |     ∞ |     ∞ |      ∞ |      ∞ |
|    1 | A(0)  | B = 4, C = 2                            | **0** |     4 |     2 |     ∞ |      ∞ |      ∞ |
|    2 | C(2)  | B: 2+1 = 3 < 4 **갱신**, D = 10, E = 12 | **0** |     3 | **2** |    10 |     12 |      ∞ |
|    3 | B(3)  | D: 3+5 = 8 < 10 **갱신**                | **0** | **3** | **2** |     8 |     12 |      ∞ |
|    4 | D(8)  | E: 8+2 = 10 < 12 **갱신**, F = 14       | **0** | **3** | **2** | **8** |     10 |     14 |
|    5 | E(10) | F: 10+3 = 13 < 14 **갱신**              | **0** | **3** | **2** | **8** | **10** |     13 |
|    6 | F(13) | 더 줄일 곳 없음                         | **0** | **3** | **2** | **8** | **10** | **13** |

B, D, E, F가 모두 **한 번 이상 갱신**된 것을 보세요. 처음 발견한 거리가 최종 거리가 아닐 수 있습니다. 반면 한 번 **확정**된 값은 다시 바뀌지 않습니다.

### 4.4 힙으로 "가장 가까운 후보" 빨리 찾기

매번 모든 정점을 훑어 가장 작은 dist를 찾으면 O(V²)입니다. Day 66의 **최소 힙**에 `(거리, 정점)`을 넣으면 가장 가까운 후보를 O(log V)에 꺼낼 수 있습니다. 문제는 dist가 줄어들 때입니다. 이진 힙 안의 값을 찾아서 줄이는 연산은 번거롭기 때문에, **새 항목을 하나 더 넣고** 옛 항목은 그대로 둡니다. 나중에 옛 항목 `(12, E)`가 꺼내지면 이미 `dist[E] = 10`이므로 **낡은 항목**으로 보고 버립니다. 이 요령을 **지연 삭제(lazy deletion)** 라고 합니다.

## 5. C로 구현하기

C 프로그램은 Day 66의 힙을 `(거리, 정점)` 구조체용으로 다시 만들고, 인접 목록에 `(도착, 가중치)` 간선을 저장합니다. 확정되는 순서를 출력하고, `prev` 배열을 재귀로 따라가 경로를 출력합니다.

```c
// 파일: dijkstra.c
#include <stdio.h>
#include <limits.h>

#define N 6
#define MAX_EDGES 32
#define INF INT_MAX

typedef struct {
    int to, w;
} Edge;

Edge adj[N][N];
int deg[N];
const char *name = "ABCDEF";

void add_road(int u, int v, int w) {
    adj[u][deg[u]++] = (Edge){v, w};
    adj[v][deg[v]++] = (Edge){u, w};
}

// ---- (거리, 정점) 최소 힙 ----
typedef struct {
    int dist, node;
} Item;

Item heap[MAX_EDGES];
int heap_size = 0;

void swap(Item *a, Item *b) {
    Item t = *a;
    *a = *b;
    *b = t;
}

void push(int dist, int node) {
    int i = heap_size++;
    heap[i] = (Item){dist, node};
    while (i > 0 && heap[(i - 1) / 2].dist > heap[i].dist) {   // 부모보다 작으면 위로
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

Item pop(void) {
    Item top = heap[0];
    heap[0] = heap[--heap_size];
    int i = 0;
    for (;;) {                                                 // 자식보다 크면 아래로
        int l = 2 * i + 1, r = l + 1, m = i;
        if (l < heap_size && heap[l].dist < heap[m].dist) m = l;
        if (r < heap_size && heap[r].dist < heap[m].dist) m = r;
        if (m == i) break;
        swap(&heap[i], &heap[m]);
        i = m;
    }
    return top;
}

int dist[N], prev[N];

void dijkstra(int start) {
    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        prev[i] = -1;
    }
    dist[start] = 0;
    push(0, start);
    while (heap_size > 0) {
        Item it = pop();
        int u = it.node;
        if (it.dist > dist[u]) continue;       // 이미 더 짧은 거리로 확정된 낡은 항목
        printf("확정 %c (거리 %d)\n", name[u], dist[u]);
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i].to;
            int nd = dist[u] + adj[u][i].w;
            if (nd < dist[v]) {                // 더 짧은 길 발견 → 갱신(완화)
                dist[v] = nd;
                prev[v] = u;
                push(nd, v);
            }
        }
    }
}

void print_path(int v) {
    if (prev[v] != -1) {
        print_path(prev[v]);
        printf(" -> ");
    }
    printf("%c", name[v]);
}

int main(void) {
    add_road(0, 1, 4);   // A-B
    add_road(0, 2, 2);   // A-C
    add_road(2, 1, 1);   // C-B
    add_road(1, 3, 5);   // B-D
    add_road(2, 3, 8);   // C-D
    add_road(2, 4, 10);  // C-E
    add_road(3, 4, 2);   // D-E
    add_road(3, 5, 6);   // D-F
    add_road(4, 5, 3);   // E-F

    dijkstra(0);
    for (int v = 0; v < N; v++) {
        printf("A -> %c: %2d  (", name[v], dist[v]);
        print_path(v);
        printf(")\n");
    }
    return 0;
}
```

실행 결과:

```text
확정 A (거리 0)
확정 C (거리 2)
확정 B (거리 3)
확정 D (거리 8)
확정 E (거리 10)
확정 F (거리 13)
A -> A:  0  (A)
A -> B:  3  (A -> C -> B)
A -> C:  2  (A -> C)
A -> D:  8  (A -> C -> B -> D)
A -> E: 10  (A -> C -> B -> D -> E)
A -> F: 13  (A -> C -> B -> D -> E -> F)
```

확정 순서가 4.3절의 표와 똑같습니다.

### 코드 한 부분씩 읽기

| 코드                                                            | 설명                                                                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { int to, w; } Edge;`                           | 가중치 그래프의 간선입니다. Day 68의 인접 목록에 가중치 `w`가 더해졌습니다.                                                  |
| `adj[u][deg[u]++] = (Edge){v, w};`                              | **복합 리터럴**(compound literal)로 구조체 값을 바로 만들어 넣습니다. 무방향이므로 `add_road`가 양쪽에 넣습니다.             |
| `push` / `pop`                                                  | Day 66의 최소 힙과 같습니다. 비교 기준이 `dist`라서 거리가 가장 작은 항목이 루트에 옵니다.                                   |
| `#define MAX_EDGES 32`                                          | 지연 삭제 때문에 힙에는 정점 수(6)보다 많은 항목이 들어갈 수 있습니다. 최대 개수는 간선 방향 수(2 × 9 = 18) + 1입니다.       |
| `if (it.dist > dist[u]) continue;`                              | 4.4절의 **낡은 항목** 버리기입니다. 이 줄이 없어도 답은 맞지만 같은 정점을 여러 번 처리해 느려집니다.                        |
| `int nd = dist[u] + adj[u][i].w;`                               | u는 방금 꺼낸 확정 정점이라 `dist[u]`는 INF가 아닙니다. 그래서 `INT_MAX + w` 같은 넘침이 생기지 않습니다.                    |
| `if (nd < dist[v]) { dist[v] = nd; prev[v] = u; push(nd, v); }` | 4.1절의 **완화**입니다. 거리를 줄이고, 어디서 왔는지 기억하고, 새 후보를 힙에 넣습니다.                                      |
| `print_path(prev[v]); printf(" -> ");`                          | `prev`를 따라가면 도착점 → 시작점 순서가 됩니다. 재귀로 먼저 앞쪽을 출력하면 시작점 → 도착점 순서로 나옵니다(Day 76의 재귀). |

## 6. Python으로 구현하기

Python에는 `heapq` 모듈이 있어 리스트를 최소 힙으로 쓸 수 있습니다. 튜플은 첫 원소부터 비교하므로 `(거리, 정점)`을 넣으면 거리 순서로 나옵니다. 이번에는 낡은 항목을 거리 비교 대신 **확정 집합 `done`** 으로 거릅니다. 같은 일을 하는 두 가지 방법입니다. 음수 간선에서 다익스트라가 틀리는 것과 **벨먼-포드**의 답도 함께 비교합니다.

```python
# 파일: dijkstra.py
import heapq

INF = float("inf")


def dijkstra(graph, start):
    dist = {v: INF for v in graph}
    prev = {v: None for v in graph}
    dist[start] = 0
    done = set()                              # 거리가 확정된 정점
    heap = [(0, start)]                       # (지금까지의 거리, 정점)
    while heap:
        d, u = heapq.heappop(heap)            # 가장 가까운 후보를 꺼낸다
        if u in done:
            continue                          # 낡은 항목은 버린다
        done.add(u)
        for v, w in graph[u]:
            if v not in done and d + w < dist[v]:
                dist[v] = d + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))
    return dist, prev


def path_to(prev, v):
    path = []
    while v is not None:
        path.append(v)
        v = prev[v]
    return path[::-1]


def bellman_ford(graph, start):
    """음수 간선도 되는 방법: 모든 간선을 V-1번 완화한다."""
    dist = {v: INF for v in graph}
    dist[start] = 0
    for _ in range(len(graph) - 1):
        for u in graph:
            for v, w in graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
    for u in graph:                           # 한 번 더 줄어들면 음수 사이클
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                return None
    return dist


roads = {
    "A": [("B", 4), ("C", 2)],
    "B": [("A", 4), ("C", 1), ("D", 5)],
    "C": [("A", 2), ("B", 1), ("D", 8), ("E", 10)],
    "D": [("B", 5), ("C", 8), ("E", 2), ("F", 6)],
    "E": [("C", 10), ("D", 2), ("F", 3)],
    "F": [("D", 6), ("E", 3)],
}
dist, prev = dijkstra(roads, "A")
print("거리:", dist)
print("A -> F 경로:", " -> ".join(path_to(prev, "F")))

# 음수 간선: S → A(1), S → B(5), B → A(-10)
neg = {"S": [("A", 1), ("B", 5)], "A": [], "B": [("A", -10)]}
print("다익스트라:", dijkstra(neg, "S")[0])
print("벨먼-포드:", bellman_ford(neg, "S"))
```

실행 결과:

```text
거리: {'A': 0, 'B': 3, 'C': 2, 'D': 8, 'E': 10, 'F': 13}
A -> F 경로: A -> C -> B -> D -> E -> F
다익스트라: {'S': 0, 'A': 1, 'B': 5}
벨먼-포드: {'S': 0, 'A': -5, 'B': 5}
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INF = float("inf")`                           | Python의 무한대입니다. 어떤 수보다 크고, `INF + 3`도 `INF`라서 넘침 걱정이 없습니다.                                                                                      |
| `heapq.heappop(heap)` / `heapq.heappush(...)`  | 리스트를 최소 힙으로 다루는 함수입니다. Day 66에서 직접 만든 올리기·내리기를 대신 해 줍니다.                                                                              |
| `if u in done: continue` / `done.add(u)`       | 처음 꺼낸 순간이 그 정점의 확정 순간입니다. 두 번째 이후로 꺼내지는 항목은 모두 낡은 항목입니다.                                                                          |
| `if v not in done and d + w < dist[v]:`        | 이미 확정한 정점은 완화하지 않습니다. 가중치가 0 이상이면 이 검사가 없어도 결과는 같지만, 음수 간선이 있을 때 차이가 드러납니다.                                          |
| `path.append(v); v = prev[v]` ... `path[::-1]` | C의 재귀 대신 반복으로 `prev`를 따라가고 뒤집습니다.                                                                                                                      |
| `for _ in range(len(graph) - 1):`              | 벨먼-포드입니다. 최단 경로는 간선을 최대 V-1개 쓰므로, 모든 간선을 V-1번 완화하면 모든 최단 거리가 확정됩니다. O(V × E)로 다익스트라보다 느리지만 음수 간선에도 맞습니다. |
| 마지막 검사 `return None`                      | V-1번 뒤에도 더 줄어드는 거리가 있으면, 돌수록 계속 짧아지는 **음수 사이클**이 있다는 뜻입니다. 이때는 최단 거리가 없습니다.                                              |

음수 간선 예제에서 다익스트라는 A를 거리 1로 **먼저 확정**했기 때문에, 나중에 발견한 S → B → A(5 − 10 = −5)를 반영하지 못했습니다. 4.2절의 "가장 가까운 후보는 더 줄어들지 않는다"는 전제가 깨진 것입니다.

## 7. Rust로 구현하기

Rust의 `BinaryHeap`은 **최대 힙**입니다. `std::cmp::Reverse`로 값을 감싸면 비교가 뒤집혀 최소 힙처럼 동작합니다. 거리는 `Option<u32>`로 표현해 `None`이 "갈 수 없음"을 뜻하게 했습니다. 도로와 이어지지 않은 G를 추가해 확인합니다.

```rust
// 파일: dijkstra.rs
use std::cmp::Reverse;
use std::collections::BinaryHeap;

struct Graph {
    names: Vec<&'static str>,
    adj: Vec<Vec<(usize, u32)>>,
}

impl Graph {
    fn new(names: &[&'static str]) -> Self {
        Graph { names: names.to_vec(), adj: vec![Vec::new(); names.len()] }
    }

    fn road(&mut self, a: usize, b: usize, w: u32) {
        self.adj[a].push((b, w));
        self.adj[b].push((a, w));
    }

    // 도달할 수 없는 정점은 None
    fn dijkstra(&self, start: usize) -> (Vec<Option<u32>>, Vec<Option<usize>>) {
        let n = self.adj.len();
        let mut dist: Vec<Option<u32>> = vec![None; n];
        let mut prev = vec![None; n];
        let mut heap = BinaryHeap::new();
        dist[start] = Some(0);
        heap.push(Reverse((0u32, start)));
        while let Some(Reverse((d, u))) = heap.pop() {
            if dist[u].is_some_and(|best| d > best) {
                continue;                               // 낡은 항목
            }
            for &(v, w) in &self.adj[u] {
                let nd = d + w;
                if dist[v].is_none_or(|old| nd < old) {
                    dist[v] = Some(nd);
                    prev[v] = Some(u);
                    heap.push(Reverse((nd, v)));
                }
            }
        }
        (dist, prev)
    }
}

fn main() {
    let mut g = Graph::new(&["A", "B", "C", "D", "E", "F", "G"]);
    for (a, b, w) in [(0, 1, 4), (0, 2, 2), (2, 1, 1), (1, 3, 5), (2, 3, 8), (2, 4, 10), (3, 4, 2), (3, 5, 6), (4, 5, 3)] {
        g.road(a, b, w);
    }
    let (dist, prev) = g.dijkstra(0);
    for (v, d) in dist.iter().enumerate() {
        match d {
            Some(d) => {
                let mut path = vec![g.names[v]];
                let mut cur = v;
                while let Some(p) = prev[cur] {
                    path.push(g.names[p]);
                    cur = p;
                }
                path.reverse();
                println!("{}: {:2}  {}", g.names[v], d, path.join(" -> "));
            }
            None => println!("{}: 갈 수 없음", g.names[v]),
        }
    }
}
```

실행 결과:

```text
A:  0  A
B:  3  A -> C -> B
C:  2  A -> C
D:  8  A -> C -> B -> D
E: 10  A -> C -> B -> D -> E
F: 13  A -> C -> B -> D -> E -> F
G: 갈 수 없음
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `adj: Vec<Vec<(usize, u32)>>`                  | 정점마다 `(도착, 가중치)` 목록입니다. 가중치를 부호 없는 `u32`로 두면 음수 간선이 **타입에서부터** 막힙니다.              |
| `heap.push(Reverse((0u32, start)));`           | `Reverse`로 감싼 튜플은 작은 값이 "더 큰" 것으로 취급되어 먼저 나옵니다.                                                  |
| `while let Some(Reverse((d, u))) = heap.pop()` | 힙이 빌 때까지 꺼내며, 패턴으로 `Reverse` 껍질을 바로 벗깁니다.                                                           |
| `dist[u].is_some_and(\|best\| d > best)`       | `Option`에 값이 있고 그 값보다 d가 크면 낡은 항목입니다. 시작점의 dist는 항상 `Some`이라 여기서 `None`인 경우는 없습니다. |
| `dist[v].is_none_or(\|old\| nd < old)`         | 아직 모르는 거리(`None`)이거나 더 짧아졌으면 완화합니다. C의 INF와 달리 넘침이 생길 수 있는 "큰 수"를 쓰지 않습니다.      |
| `while let Some(p) = prev[cur]`                | `prev`가 `None`인 시작점에 이를 때까지 거슬러 올라갑니다.                                                                 |
| `None => println!("{}: 갈 수 없음", ...)`      | `match`가 도달 불가능한 경우를 빠뜨리지 못하게 합니다.                                                                    |

## 8. 실행 추적

Python 버전의 힙 내용을 따라가 봅니다. 힙은 항상 거리가 가장 작은 항목이 맨 앞에 옵니다(나머지 순서는 내부 배치라 여기서는 거리순으로 적었습니다).

| 꺼낸 항목 | 처리            | 힙에 새로 넣은 항목      | 꺼낸 뒤 힙에 남은 항목             |
| --------- | --------------- | ------------------------ | ---------------------------------- |
| (0, A)    | 확정 A          | (4, B), (2, C)           | (2, C), (4, B)                     |
| (2, C)    | 확정 C          | (3, B), (10, D), (12, E) | (3, B), (4, B), (10, D), (12, E)   |
| (3, B)    | 확정 B          | (8, D)                   | (4, B), (8, D), (10, D), (12, E)   |
| (4, B)    | **낡음 → 버림** |                          | (8, D), (10, D), (12, E)           |
| (8, D)    | 확정 D          | (10, E), (14, F)         | (10, D), (10, E), (12, E), (14, F) |
| (10, D)   | **낡음 → 버림** |                          | (10, E), (12, E), (14, F)          |
| (10, E)   | 확정 E          | (13, F)                  | (12, E), (13, F), (14, F)          |
| (12, E)   | **낡음 → 버림** |                          | (13, F), (14, F)                   |
| (13, F)   | 확정 F          |                          | (14, F)                            |
| (14, F)   | **낡음 → 버림** |                          | (비었음)                           |

힙에는 모두 10개의 항목이 들어갔고 그중 4개가 낡은 항목이었습니다. 거리가 갱신될 때마다 한 개씩 생긴 것입니다. `(10, D)`와 `(10, E)`처럼 거리가 같으면 튜플의 두 번째 값(문자열)을 비교하므로 'D'가 먼저 나옵니다.

## 9. 다른 예제로 다시 이해하기

그래프가 꼭 정점과 간선 목록으로 주어지는 것은 아닙니다. 칸마다 **지나가는 비용**이 적힌 격자 지도를 생각해 봅시다. 1은 평지, 9는 늪입니다. 왼쪽 위에서 오른쪽 아래까지, 상하좌우로 움직이며 **밟는 칸 비용의 합이 가장 작은** 길을 찾습니다. 각 칸이 정점이고, 이웃 칸으로 가는 간선의 가중치는 "들어가는 칸의 비용"입니다. 격자 칸 수가 R × C이면 정점도 R × C개입니다. BFS로는 칸 수가 가장 적은 길을 찾겠지만, 그 길이 늪을 지난다면 비용이 커집니다.

```rust
// 파일: grid_path.rs
use std::cmp::Reverse;
use std::collections::BinaryHeap;

// 칸마다 들어가는 비용이 다른 지도: 숫자가 클수록 지나가기 힘든 땅
const MAP: [&str; 5] = ["11911", "19191", "11191", "99111", "11191"];

fn shortest(grid: &[Vec<u32>]) -> (u32, Vec<(usize, usize)>) {
    let (h, w) = (grid.len(), grid[0].len());
    let mut dist = vec![vec![u32::MAX; w]; h];
    let mut prev = vec![vec![None; w]; h];
    let mut heap = BinaryHeap::new();          // 최대 힙이므로 Reverse로 뒤집는다
    dist[0][0] = 0;
    heap.push(Reverse((0, 0usize, 0usize)));
    while let Some(Reverse((d, r, c))) = heap.pop() {
        if d > dist[r][c] {
            continue;
        }
        let steps = [(r.wrapping_sub(1), c), (r + 1, c), (r, c.wrapping_sub(1)), (r, c + 1)];
        for (nr, nc) in steps {
            if nr >= h || nc >= w {
                continue;
            }
            let nd = d + grid[nr][nc];
            if nd < dist[nr][nc] {
                dist[nr][nc] = nd;
                prev[nr][nc] = Some((r, c));
                heap.push(Reverse((nd, nr, nc)));
            }
        }
    }
    let mut path = vec![(h - 1, w - 1)];
    while let Some(p) = prev[path[path.len() - 1].0][path[path.len() - 1].1] {
        path.push(p);
    }
    path.reverse();
    (dist[h - 1][w - 1], path)
}

fn main() {
    let grid: Vec<Vec<u32>> = MAP
        .iter()
        .map(|row| row.bytes().map(|b| u32::from(b - b'0')).collect())
        .collect();
    let (cost, path) = shortest(&grid);
    println!("최소 비용: {cost}, 지나간 칸 {}개", path.len());
    for (r, row) in MAP.iter().enumerate() {
        let line: String = row
            .chars()
            .enumerate()
            .map(|(c, ch)| if path.contains(&(r, c)) { '*' } else { ch })
            .collect();
        println!("{line}");
    }
}
```

실행 결과:

```text
최소 비용: 8, 지나간 칸 9개
*1911
*9191
***91
99***
1119*
```

`*`가 찾은 길입니다. 출발 칸은 이미 서 있는 곳이라 비용에 넣지 않았고, 이후 8칸의 평지를 밟아 비용이 8입니다. 오른쪽 위로 가로질러 가는 길은 칸 수가 같더라도 9를 밟게 되어 더 비쌉니다. 힙에는 `(비용, 행, 열)` 튜플을 넣었습니다. 튜플도 앞에서부터 비교하므로 비용이 가장 작은 칸이 먼저 나옵니다. 경계는 Day 81처럼 `wrapping_sub`와 `< h` 검사로 걸렀습니다.

## 10. 시간·공간 복잡도

| 방법                        | 시간             | 추가 공간   | 잘 맞는 경우                        |
| --------------------------- | ---------------- | ----------- | ----------------------------------- |
| BFS (가중치가 모두 같을 때) | O(V + E)         | O(V)        | 가중치 없음                         |
| 다익스트라 + 이진 힙        | O((V + E) log V) | O(V + E) 힙 | 가중치 ≥ 0, 간선이 적은 그래프      |
| 다익스트라 + 배열(힙 없음)  | O(V²)            | O(V)        | 가중치 ≥ 0, 간선이 아주 많은 그래프 |
| 벨먼-포드                   | O(V × E)         | O(V)        | 음수 간선, 음수 사이클 판별         |

힙 버전에서 힙 크기가 O(E)인데도 log E가 아니라 log V라고 쓰는 이유는, E ≤ V²이므로 log E ≤ 2 log V라서 차수가 같기 때문입니다.

## 11. 세 언어 비교

| 관점           | C                            | Python                 | Rust                                   |
| -------------- | ---------------------------- | ---------------------- | -------------------------------------- |
| 우선순위 큐    | 직접 만든 배열 힙            | `heapq` (최소 힙)      | `BinaryHeap` (최대 힙) + `Reverse`     |
| 힙 항목        | `struct { int dist, node; }` | 튜플 `(거리, 정점)`    | 튜플 `(u32, usize)`                    |
| 무한대         | `INT_MAX` 또는 충분히 큰 수  | `float("inf")`         | `Option<u32>`의 `None` 또는 `u32::MAX` |
| 넘침 위험      | `INF + w`에서 생길 수 있음   | 없음(정수 크기 무제한) | 디버그 빌드에서 panic, `None`으로 피함 |
| 음수 간선 방지 | 약속으로만                   | 약속으로만             | `u32` 타입으로 막을 수 있음            |
| 경로 복원      | `prev[]` + 재귀 출력         | `prev` 사전 + 뒤집기   | `Vec<Option<usize>>` + `reverse()`     |

## 12. 자주 하는 실수

### 실수 1: 목적지가 갱신되는 순간 멈춘다

목적지의 거리는 처음 갱신된 뒤에도 더 줄어들 수 있습니다(4.3절에서 F가 14 → 13). 멈추려면 목적지를 **힙에서 꺼내는 순간**에 멈춰야 합니다(실습의 수정 문제).

### 실수 2: 무한대에 가중치를 더해 넘친다

```c
// 파일: overflow.c
#include <stdio.h>
#include <limits.h>

int main(void) {
    int dist_u = INT_MAX;                   // 아직 갈 수 없는 정점
    long long safe = (long long)dist_u + 5;
    printf("INT_MAX + 5를 long long으로: %lld\n", safe);
    printf("int로 계산하면 음수가 되어 '더 짧다'로 잘못 판단할 수 있습니다\n");
    return 0;
}
```

실행 결과:

```text
INT_MAX + 5를 long long으로: 2147483652
int로 계산하면 음수가 되어 '더 짧다'로 잘못 판단할 수 있습니다
```

`int`끼리 `INT_MAX + 5`를 계산하는 것은 C에서 **정의되지 않은 동작**이고, 흔히 음수로 넘쳐서 "더 짧은 길을 찾았다"고 착각하게 만듭니다. 확정된 정점에서만 완화하거나(5절 C 코드), INF를 넘치지 않을 만큼 작은 큰 수(예: 10억)로 두세요.

### 실수 3: 음수 간선에 다익스트라를 쓴다

6절의 예에서 봤듯이 확정한 정점의 거리가 나중에 줄어들 수 있어 틀립니다. 음수 간선이 있으면 벨먼-포드를 쓰세요.

### 실수 4: 낡은 항목을 거르지 않는다

가중치가 0 이상이면 답은 맞지만, 같은 정점의 이웃을 여러 번 다시 완화해 느려집니다. 간선이 많은 그래프에서는 크게 느려질 수 있습니다.

### 실수 5: Rust에서 Reverse를 빠뜨린다

```rust
// 파일: max_heap.rs
use std::collections::BinaryHeap;

fn main() {
    let mut heap = BinaryHeap::from([(4, 'B'), (2, 'C'), (10, 'D')]);
    println!("Reverse 없이 먼저 나오는 것: {:?}", heap.pop());
}
```

실행 결과:

```text
Reverse 없이 먼저 나오는 것: Some((10, 'D'))
```

가장 **먼** 후보가 먼저 나옵니다. 컴파일도 되고 실행도 되지만 답이 틀리는, 찾기 어려운 버그입니다.

## 13. Q&A

**Q. 모든 가중치가 1이면 다익스트라와 BFS의 결과가 같나요?**

A. 같습니다. 그때는 큐에 들어가는 순서가 이미 거리 순서라서 힙이 필요 없고, BFS가 O(V + E)로 더 빠릅니다. 가중치가 0과 1뿐이라면 덱(Day 59)의 앞에 0-간선, 뒤에 1-간선을 넣는 **0-1 BFS**라는 방법도 있습니다.

**Q. 다익스트라는 왜 탐욕 알고리즘인가요?**

A. 매 단계 "지금 가장 가까운 정점"이라는 눈앞의 최선을 고르고 다시는 되돌리지 않기 때문입니다. Day 78에서 탐욕이 맞으려면 증명이 필요하다고 했는데, 4.2절의 논리(가중치 ≥ 0이면 더 짧은 우회로가 없다)가 그 증명입니다.

**Q. 지도 앱은 정말 다익스트라를 쓰나요?**

A. 기본 원리는 같지만, 목적지 방향으로 먼저 탐색하도록 "남은 거리의 추정값"을 더하는 **A\*(에이스타)** 알고리즘이나, 미리 계산해 둔 지름길을 쓰는 방법으로 훨씬 빠르게 만듭니다. A\*는 추정값이 0이면 다익스트라와 같습니다.

**Q. 모든 정점 쌍 사이의 최단 거리가 필요하면요?**

A. 정점마다 다익스트라를 돌리거나(가중치 ≥ 0), 세 겹 반복문 하나로 끝나는 **플로이드-워셜** 알고리즘(O(V³), Day 79의 동적 계획법)을 씁니다. 정점이 수백 개 이하이면 플로이드-워셜이 간단합니다.

## 14. 핵심 요약

- 가중치 그래프의 최단 경로는 **간선 수가 아니라 가중치 합**으로 정합니다. BFS는 가중치가 모두 같을 때만 맞습니다.
- **완화**: `dist[u] + w < dist[v]`이면 `dist[v]`를 줄이고 `prev[v] = u`로 기억합니다.
- **다익스트라**: 확정하지 않은 정점 중 가장 가까운 것을 확정하고 그 간선을 완화합니다. 최소 힙으로 O((V + E) log V)입니다.
- 거리가 줄 때마다 힙에 새 항목을 넣고, **낡은 항목은 꺼낼 때 버립니다**.
- 목적지는 **꺼낼 때** 확정됩니다. `prev`를 거슬러 올라가 경로를 복원합니다.
- **음수 간선**이 있으면 다익스트라가 틀립니다. 벨먼-포드(O(VE))를 쓰고, 음수 사이클도 판별할 수 있습니다.

## 15. 도전 문제

1. **(C)** 5절의 C 프로그램에 "환승 횟수"를 함께 기록해, 거리가 같은 경로가 여러 개면 간선 수가 적은 쪽을 고르도록 바꿔 보세요. 힙의 비교 기준을 `(거리, 간선 수)`로 바꾸면 됩니다.
2. **(Python)** 6절의 도로 지도에서 A → F 최단 경로가 **몇 개**인지 세는 함수를 만드세요. 완화할 때 거리가 같으면 경로 수를 더하고, 더 짧으면 새로 씁니다.
3. **(Rust)** 9절의 격자에서 **대각선 이동**도 허용하면 비용과 경로가 어떻게 바뀌는지 확인하세요.
4. **(세 언어)** 벨먼-포드를 C와 Rust로도 구현하고, 음수 사이클(A → B 1, B → C −3, C → A 1)이 있는 그래프에서 "음수 사이클 있음"을 출력하게 만드세요.
