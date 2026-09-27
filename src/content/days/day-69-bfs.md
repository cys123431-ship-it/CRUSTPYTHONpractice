---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-69-bfs
courseId: crp-92
phaseId: phase-06
dayNumber: 69
date: "2026-12-08"
title: 너비 우선 탐색(BFS) — 가까운 곳부터 한 층씩
summary: 큐와 방문 표시로 시작점에서 가까운 정점부터 차례로 방문하는 BFS를 C, Python, Rust로 구현합니다. 거리 배열과 직전 정점(parent) 배열로 가중치 없는 그래프의 최단 경로를 복원하고, 연결 요소 세기와 미로의 최단 거리 찾기에 응용합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-68-graph]
learningObjectives:
  - BFS가 시작점에서 가까운 정점부터 층별로 방문하는 이유를 큐의 FIFO로 설명한다.
  - 큐에 넣는 순간 방문 표시를 해야 하는 이유를 설명한다.
  - 거리(dist)와 직전 정점(parent)을 기록해 최단 경로를 거꾸로 복원한다.
  - 도달할 수 없는 정점을 C는 -1, Python은 None, Rust는 Option으로 표현한다.
  - 연결 요소 세기와 격자 미로의 최단 거리 문제를 BFS로 푼다.
concepts:
  [
    bfs,
    breadth-first search,
    queue,
    visited,
    distance,
    parent,
    shortest path,
    connected components,
    grid,
  ]
runnerMode: python
playgroundSource: |
  # 파일: bfs.py — 간선을 바꾸고 시작점을 바꿔 보세요.
  from collections import deque

  adj = {0: [1, 2], 1: [0, 3], 2: [0, 3, 4], 3: [1, 2, 5], 4: [2, 5], 5: [3, 4, 6], 6: [5]}
  dist = {0: 0}
  queue = deque([0])
  while queue:
      u = queue.popleft()
      for v in adj[u]:
          if v not in dist:
              dist[v] = dist[u] + 1
              queue.append(v)
      print(f"{u} 방문 → 큐 {list(queue)}")
  print("거리:", dist)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day69-predict-py
    title: BFS 방문 순서 예측하기
    kind: predict
    objective: 이웃 목록 순서와 큐의 FIFO가 방문 순서를 정한다는 것을 확인한다.
    prompt: 출력될 방문 순서를 공백으로 구분해 적으세요.
    starter: |-
      from collections import deque

      adj = {"A": ["C", "B"], "B": ["A", "D"], "C": ["A", "D", "E"], "D": ["B", "C"], "E": ["C"]}
      seen = {"A"}
      queue = deque(["A"])
      order = []
      while queue:
          u = queue.popleft()
          order.append(u)
          for v in adj[u]:
              if v not in seen:
                  seen.add(v)
                  queue.append(v)
      print(*order)
    answer: "A C B D E"
    hint: "A의 이웃은 C, B 순서로 큐에 들어갑니다. 그다음 C를 꺼내면 D, E가 뒤에 줄을 섭니다. B의 이웃 D는 이미 발견되어 다시 넣지 않습니다."
    explanation: "큐는 [C, B] → C를 꺼내며 [B, D, E] → B를 꺼내도 D는 이미 봤으므로 [D, E] → D, E 순서입니다. 이웃 목록의 순서가 바뀌면 같은 층 안의 순서도 바뀝니다."
    commonMistakes:
      - "알파벳 순서로 A B C D E라고 적음"
      - "B의 이웃 D를 한 번 더 넣어 D를 두 번 적음"
    language: python
    verification: run
  - id: ex-day69-predict-c
    title: 거리 배열 채우기 예측하기
    kind: predict
    objective: dist[v] = dist[u] + 1 규칙으로 층 번호가 매겨지는 과정을 추적한다.
    prompt: 출력될 여섯 숫자(정점 0~5의 거리)를 공백으로 구분해 적으세요. 도달할 수 없으면 -1입니다.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int adj[6][6] = {
              {0, 1, 0, 0, 1, 0},
              {1, 0, 1, 0, 0, 0},
              {0, 1, 0, 1, 0, 0},
              {0, 0, 1, 0, 1, 0},
              {1, 0, 0, 1, 0, 0},
              {0, 0, 0, 0, 0, 0},
          };
          int dist[6] = {-1, -1, -1, -1, -1, -1};
          int queue[6], front = 0, rear = 0;
          dist[0] = 0;
          queue[rear++] = 0;
          while (front < rear) {
              int u = queue[front++];
              for (int v = 0; v < 6; v++) {
                  if (adj[u][v] && dist[v] == -1) {
                      dist[v] = dist[u] + 1;
                      queue[rear++] = v;
                  }
              }
          }
          for (int v = 0; v < 6; v++) printf("%d ", dist[v]);
          printf("\n");
          return 0;
      }
    answer: "0 1 2 2 1 -1"
    hint: "0의 이웃은 1과 4입니다(거리 1). 1의 이웃 2, 4의 이웃 3은 거리 2입니다. 5는 어떤 정점과도 연결되지 않았습니다."
    explanation: "0-1-2-3-4-0은 고리 모양이라 3은 0 → 4 → 3으로 2만에 도착합니다. 0 → 1 → 2 → 3으로 가면 3이지만 BFS는 더 짧은 쪽을 먼저 찾습니다. 5는 방문하지 못해 -1이 남습니다. dist가 -1인지로 방문 여부를 함께 판단해 visited 배열을 따로 두지 않았습니다."
    commonMistakes:
      - "3의 거리를 1 → 2 → 3 경로로 계산해 3으로 적음"
      - "5를 0으로 적음(초기값 -1을 무시함)"
    language: c
    verification: run
  - id: ex-day69-fill
    title: Rust로 경로 복원 빈칸 채우기
    kind: fill
    objective: parent를 따라 도착점에서 시작점으로 거슬러 올라간다.
    prompt: "path_to의 빈칸을 채우세요. cur의 직전 정점으로 이동하고, 직전 정점이 없으면(None) 함수가 None을 돌려주게 합니다."
    starter: |-
      fn path_to(parent: &[Option<usize>], start: usize, target: usize) -> Option<Vec<usize>> {
          let mut path = vec![target];
          let mut cur = target;
          while cur != start {
              cur = _____;
              path.push(cur);
          }
          path.reverse();
          Some(path)
      }

      fn main() {
          let parent = [None, Some(0), Some(0), Some(1), Some(2), None];
          println!("{:?} {:?}", path_to(&parent, 0, 3), path_to(&parent, 0, 5));
      }
    answer: |-
      fn path_to(parent: &[Option<usize>], start: usize, target: usize) -> Option<Vec<usize>> {
          let mut path = vec![target];
          let mut cur = target;
          while cur != start {
              cur = parent[cur]?;
              path.push(cur);
          }
          path.reverse();
          Some(path)
      }

      fn main() {
          let parent = [None, Some(0), Some(0), Some(1), Some(2), None];
          println!("{:?} {:?}", path_to(&parent, 0, 3), path_to(&parent, 0, 5));
      }
    output: "Some([0, 1, 3]) None"
    hint: "?는 Option이 None이면 그 자리에서 함수를 끝내며 None을 돌려줍니다. 반환형이 Option이라 쓸 수 있습니다."
    explanation: "3의 직전은 1, 1의 직전은 0이므로 [3, 1, 0]을 모은 뒤 뒤집어 [0, 1, 3]입니다. 5의 직전은 None이라 ?가 None을 돌려줍니다. 도달할 수 없는 정점을 따로 검사하지 않아도 됩니다."
    commonMistakes:
      - "parent[cur].unwrap()을 써서 도달 불가 정점에서 panic을 일으킴"
      - "path.reverse()를 빼서 도착점부터 거꾸로 된 경로를 돌려줌"
    language: rust
    verification: run
  - id: ex-day69-modify
    title: Python BFS를 여러 시작점으로 바꾸기
    kind: modify
    objective: 시작점 여러 개를 큐에 함께 넣어 가장 가까운 시작점까지의 거리를 구한다.
    prompt: "multi_source_bfs(adj, sources)가 모든 정점에 대해 '가장 가까운 소방서까지의 거리'를 돌려주도록 고치세요. 소방서가 0과 6에 있을 때 [0, 1, 1, 2, 2, 1, 0]이 출력되어야 합니다."
    starter: |-
      from collections import deque


      def multi_source_bfs(adj, sources):
          start = sources[0]
          dist = {start: 0}
          queue = deque([start])
          while queue:
              u = queue.popleft()
              for v in adj[u]:
                  if v not in dist:
                      dist[v] = dist[u] + 1
                      queue.append(v)
          return [dist.get(v) for v in sorted(adj)]


      adj = {0: [1, 2], 1: [0, 3], 2: [0, 3, 4], 3: [1, 2, 5], 4: [2, 5], 5: [3, 4, 6], 6: [5]}
      print(multi_source_bfs(adj, [0, 6]))
    answer: |-
      from collections import deque


      def multi_source_bfs(adj, sources):
          dist = {s: 0 for s in sources}
          queue = deque(sources)
          while queue:
              u = queue.popleft()
              for v in adj[u]:
                  if v not in dist:
                      dist[v] = dist[u] + 1
                      queue.append(v)
          return [dist.get(v) for v in sorted(adj)]


      adj = {0: [1, 2], 1: [0, 3], 2: [0, 3, 4], 3: [1, 2, 5], 4: [2, 5], 5: [3, 4, 6], 6: [5]}
      print(multi_source_bfs(adj, [0, 6]))
    output: "[0, 1, 1, 2, 2, 1, 0]"
    hint: "시작점들을 모두 거리 0으로 기록하고 처음부터 큐에 함께 넣으세요. 나머지 코드는 그대로 둬도 됩니다."
    explanation: "여러 시작점에서 동시에 한 층씩 퍼지므로, 각 정점은 가장 가까운 시작점에서 온 물결에 처음 닿습니다. 3은 0에서 2, 6에서 2로 같고, 5는 6에서 1입니다. 원래 코드는 0에서만 출발해 [0, 1, 1, 2, 2, 3, 4]가 나왔습니다."
    commonMistakes:
      - "시작점마다 BFS를 따로 돌려 최솟값을 구함(결과는 맞지만 시작점 수만큼 느림)"
      - "시작점을 큐에만 넣고 dist에 기록하지 않아 시작점을 다시 방문함"
    language: python
    verification: run
  - id: ex-day69-debug
    title: C BFS의 방문 표시 시점 고치기
    kind: debug
    objective: 꺼낼 때가 아니라 넣을 때 방문 표시를 해야 중복이 없다는 것을 확인한다.
    prompt: "이 BFS는 정점을 꺼낼 때 방문 표시를 해서, 같은 정점이 큐에 여러 번 들어갑니다. 큐에 넣은 횟수가 정점 수(4)와 같아지도록 고치세요."
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int adj[4][4] = {{0, 1, 1, 0}, {1, 0, 1, 1}, {1, 1, 0, 1}, {0, 1, 1, 0}};
          bool visited[4] = {false};
          int queue[32], front = 0, rear = 0;
          queue[rear++] = 0;
          while (front < rear) {
              int u = queue[front++];
              if (visited[u]) continue;
              visited[u] = true;
              for (int v = 0; v < 4; v++) {
                  if (adj[u][v] && !visited[v]) {
                      queue[rear++] = v;
                  }
              }
          }
          printf("큐에 넣은 횟수: %d\n", rear);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int adj[4][4] = {{0, 1, 1, 0}, {1, 0, 1, 1}, {1, 1, 0, 1}, {0, 1, 1, 0}};
          bool visited[4] = {false};
          int queue[32], front = 0, rear = 0;
          visited[0] = true;
          queue[rear++] = 0;
          while (front < rear) {
              int u = queue[front++];
              for (int v = 0; v < 4; v++) {
                  if (adj[u][v] && !visited[v]) {
                      visited[v] = true;
                      queue[rear++] = v;
                  }
              }
          }
          printf("큐에 넣은 횟수: %d\n", rear);
          return 0;
      }
    output: "큐에 넣은 횟수: 4"
    starterOutput: "큐에 넣은 횟수: 6"
    hint: "정점을 큐에 넣는 순간 '이미 발견됨'으로 표시하면, 다른 이웃이 같은 정점을 또 넣지 못합니다. 시작점도 넣을 때 표시하세요."
    explanation: "원래 코드는 2가 0과 1에게서, 3이 1과 2에게서 각각 한 번씩 더 발견되어 큐에 6번(정점 4개 + 중복 2번) 들어갑니다. 결과는 맞게 나와도 큐가 커지고, 간선이 많은 그래프에서는 크게 느려집니다. 고친 코드는 각 정점을 정확히 한 번씩 넣습니다."
    commonMistakes:
      - "시작점에 visited 표시를 하지 않아 이웃이 시작점을 다시 넣음"
      - "visited 검사와 표시를 모두 빼서 무한 반복에 빠짐"
    language: c
    verification: run
  - id: ex-day69-independent
    title: Rust로 연결 요소 개수 세기
    kind: independent
    objective: 아직 방문하지 않은 정점에서 BFS를 다시 시작해 그래프를 조각으로 나눈다.
    prompt: "정점 0~7과 간선 [(0,1), (1,2), (3,4), (5,6), (6,7), (7,5)]가 있습니다. 연결 요소마다 정점 목록을 출력하고 마지막에 개수를 출력하세요. [0, 1, 2] / [3, 4] / [5, 6, 7] / 요소 3개가 나와야 합니다."
    starter: |-
      use std::collections::VecDeque;

      fn main() {
          let edges = [(0, 1), (1, 2), (3, 4), (5, 6), (6, 7), (7, 5)];
          let mut adj = vec![Vec::new(); 8];
          for (u, v) in edges {
              adj[u].push(v);
              adj[v].push(u);
          }
          let queue: VecDeque<usize> = VecDeque::new();
          println!("{} {}", adj.len(), queue.len());
      }
    answer: |-
      use std::collections::VecDeque;

      fn main() {
          let edges = [(0, 1), (1, 2), (3, 4), (5, 6), (6, 7), (7, 5)];
          let mut adj = vec![Vec::new(); 8];
          for (u, v) in edges {
              adj[u].push(v);
              adj[v].push(u);
          }

          let mut visited = vec![false; adj.len()];
          let mut count = 0;
          for s in 0..adj.len() {
              if visited[s] {
                  continue;
              }
              count += 1;
              let mut part = Vec::new();
              let mut queue = VecDeque::from([s]);
              visited[s] = true;
              while let Some(u) = queue.pop_front() {
                  part.push(u);
                  for &v in &adj[u] {
                      if !visited[v] {
                          visited[v] = true;
                          queue.push_back(v);
                      }
                  }
              }
              part.sort();
              println!("{:?}", part);
          }
          println!("요소 {count}개");
      }
    output: |-
      [0, 1, 2]
      [3, 4]
      [5, 6, 7]
      요소 3개
    hint: "바깥 for 반복은 모든 정점을 차례로 보면서, 아직 방문하지 않은 정점을 만날 때마다 새 요소를 시작합니다. visited 배열은 모든 BFS가 함께 씁니다."
    explanation: "한 번의 BFS는 시작점과 연결된 정점만 방문합니다. 그래서 방문하지 않은 정점이 남아 있다면 다른 조각이 있다는 뜻입니다. 5-6-7은 사이클이지만 방문 표시 덕분에 무한히 돌지 않습니다. 전체 비용은 모든 정점과 간선을 한 번씩 보는 O(V + E)입니다."
    commonMistakes:
      - "BFS마다 visited를 새로 만들어 같은 요소를 여러 번 셈"
      - "간선이 없는 정점을 요소로 세지 않음(고립 정점도 한 요소)"
    language: rust
    verification: run
quiz:
  - id: quiz-day69-01
    question: BFS에서 다음에 방문할 정점을 관리하는 자료구조는?
    choices: ["스택", "큐", "힙", "해시 맵"]
    answerIndex: 1
    explanation: 먼저 발견한 정점(더 가까운 층)을 먼저 처리해야 하므로 FIFO인 큐입니다. 스택을 쓰면 깊이 우선 탐색(Day 81)이 됩니다.
  - id: quiz-day69-02
    question: BFS에서 방문 표시를 하기에 가장 알맞은 시점은?
    choices:
      - 정점을 큐에서 꺼낼 때
      - 정점을 큐에 넣을 때
      - BFS가 끝난 뒤 한꺼번에
      - 방문 표시는 필요 없다
    answerIndex: 1
    explanation: 넣을 때 표시하면 같은 정점이 큐에 두 번 들어가지 않습니다. 꺼낼 때 표시하면 결과는 맞을 수 있지만 같은 정점이 여러 번 줄을 서서 낭비가 생깁니다.
  - id: quiz-day69-03
    question: 가중치가 없는 그래프에서 BFS로 구한 dist[v]는 무엇을 뜻하나요?
    choices:
      - 시작점에서 v까지 가능한 경로의 수
      - 시작점에서 v까지 가는 최소 간선 수
      - v의 차수
      - v를 방문한 순서
    answerIndex: 1
    explanation: BFS는 거리 0, 1, 2… 순서로 층을 넓혀 가므로, 어떤 정점에 처음 도착한 순간의 층 번호가 최단 거리입니다. 간선마다 비용이 다르면 BFS로는 부족하고 Day 82의 다익스트라가 필요합니다.
  - id: quiz-day69-04
    question: parent 배열로 최단 경로를 복원하는 방법은?
    choices:
      - 시작점에서 parent를 따라 앞으로 간다
      - 도착점에서 parent를 따라 시작점까지 거슬러 올라간 뒤 순서를 뒤집는다
      - dist가 작은 정점부터 정렬한다
      - 방문 순서를 그대로 쓴다
    answerIndex: 1
    explanation: parent[v]는 'v에 처음 도착하기 직전에 있던 정점'이라서 뒤쪽으로만 가리킵니다. 도착점에서 거꾸로 따라가면 경로가 나오고, 뒤집으면 시작점부터의 순서가 됩니다.
  - id: quiz-day69-05
    question: 정점 V개, 간선 E개인 그래프를 인접 목록으로 저장했을 때 BFS의 시간 복잡도는?
    choices: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"]
    answerIndex: 2
    explanation: 모든 정점을 한 번씩 큐에 넣고 빼며(O(V)), 각 정점의 이웃 목록을 한 번씩 훑습니다(무방향이면 총 2E). 인접 행렬로 저장하면 이웃을 찾을 때마다 V칸을 봐야 해서 O(V²)입니다.
---

## 1. 오늘 배울 내용

Day 68에서 그래프를 **저장하는** 방법을 배웠습니다. 오늘은 그래프를 **돌아다니는** 첫 번째 방법인 **너비 우선 탐색(Breadth-First Search, BFS)** 을 배웁니다. BFS는 시작점에서 **가까운 곳부터** 한 층씩 넓혀 가며 방문합니다. 연못에 돌을 던졌을 때 물결이 동그랗게 퍼져 나가는 모습과 같습니다.

1. BFS의 원리: **큐**와 **방문 표시**.
2. BFS로 **최단 거리**를 구하고, **직전 정점(parent)** 을 기록해 최단 경로를 복원합니다.
3. **C, Python, Rust** 로 같은 그래프에 BFS를 구현하고, 도달할 수 없는 정점을 언어마다 다르게 표현합니다.
4. 그래프를 조각으로 나누는 **연결 요소 세기**를 해 봅니다.
5. 응용으로 **격자 미로**의 최단 거리를 BFS로 구합니다.

> **준비물**: Day 59의 큐(`deque`, `VecDeque`), Day 64의 레벨 순회, Day 68의 인접 목록이 모두 쓰입니다. 사실 Day 64의 레벨 순회가 트리에서 한 BFS였습니다.

## 2. 왜 BFS가 필요한가

다음 질문들을 생각해 봅시다.

- SNS에서 나와 "몇 다리 건너면" 아는 사이인가?
- 지하철에서 **환승 횟수가 가장 적은** 경로는?
- 미로에서 출구까지 **가장 적게 걸어서** 가는 길은?
- 이 네트워크에서 서로 연결된 컴퓨터끼리 **몇 개의 무리**로 나뉘는가?

모두 "**간선을 가장 적게 지나는** 경로"나 "**어디까지 닿을 수 있는가**"를 묻습니다. BFS는 시작점에서 거리 1인 정점을 모두 방문한 뒤에야 거리 2인 정점으로 넘어가기 때문에, 어떤 정점에 **처음 도착한 순간의 거리가 곧 최단 거리**입니다. 이것이 BFS의 가장 중요한 성질입니다.

## 3. 그림으로 이해하기

이 수업에서 쓸 그래프입니다. 정점 7은 어디와도 연결되지 않았습니다.

```text
        1 ─────── 3 ─────── 5 ─────── 6
       /         /         /
      0         /         /
       \       /         /
        2 ────┘         /
         \             /
          4 ──────────┘                7 (고립)
```

간선: 0-1, 0-2, 1-3, 2-3, 2-4, 3-5, 4-5, 5-6

0에서 BFS를 시작하면 정점들이 **층**으로 나뉩니다.

```text
층 0:  0
층 1:  1  2              ← 0에서 간선 1개
층 2:  3  4              ← 1이나 2에서 한 칸 더
층 3:  5
층 4:  6
도달 불가: 7
```

## 4. 천천히 풀어보기

### 4.1 BFS의 알고리즘

```text
시작점을 "발견함"으로 표시하고 큐에 넣는다
큐가 빌 때까지:
    u = 큐에서 꺼낸다 (u를 방문한다)
    u의 이웃 v마다:
        v를 아직 발견하지 못했다면
            v를 "발견함"으로 표시하고
            v를 큐에 넣는다
```

Day 64의 레벨 순회와 거의 같습니다. 달라진 점은 **발견 표시(visited)** 가 추가되었다는 것 하나입니다. 트리에는 사이클이 없어서 같은 노드를 두 번 만날 일이 없었지만, 그래프에는 **사이클**과 **되돌아가는 간선**이 있습니다. 0 → 1로 갔다면 1의 이웃 목록에 0이 다시 나오고, 0-1-3-2-0처럼 돌아오는 길도 있습니다. 표시가 없으면 같은 정점을 끝없이 다시 넣습니다.

### 4.2 방문 표시는 "넣을 때" 한다

표시하는 시점이 중요합니다. **큐에 넣는 순간** 표시해야 합니다.

- 넣을 때 표시: 정점마다 큐에 **정확히 한 번** 들어갑니다.
- 꺼낼 때 표시: 아직 꺼내지 않은 정점은 표시가 없으므로 **다른 이웃이 또 넣습니다.** 3절의 그래프에서 3은 1에게서도, 2에게서도 발견되어 두 번 줄을 섭니다. 결과는 맞더라도 큐가 불필요하게 커집니다(실습의 디버그 문제).

### 4.3 거리와 직전 정점 기록하기

BFS를 조금만 고치면 **최단 거리**와 **최단 경로**를 얻습니다.

- `dist[v] = dist[u] + 1`: v는 u의 다음 층입니다.
- `parent[v] = u`: v에는 u를 거쳐서 **처음** 도착했습니다.

parent는 "나는 누구에게서 왔나"를 적은 **이정표**입니다. 도착점에서 이정표를 거꾸로 따라가면 시작점에 닿고, 그 길을 뒤집으면 최단 경로입니다.

```text
parent: 1←0, 2←0, 3←1, 4←2, 5←3, 6←5
6에서 거꾸로:  6 → 5 → 3 → 1 → 0
뒤집으면:      0 → 1 → 3 → 5 → 6   (간선 4개 = dist[6])
```

3에는 1을 거쳐서도(0-1-3), 2를 거쳐서도(0-2-3) 거리 2에 갈 수 있습니다. BFS는 1이 큐에서 먼저 나와 3을 **먼저 발견**했으므로 parent[3] = 1로 적습니다. 최단 경로가 여러 개일 때 BFS는 그중 **하나**를 찾아 줍니다.

### 4.4 도달할 수 없는 정점

BFS가 끝났는데도 발견되지 않은 정점(7)은 시작점에서 **갈 수 없는** 정점입니다. 거리를 어떻게 표현할지 언어마다 다릅니다.

| 언어   | 도달 불가 표현                          |
| ------ | --------------------------------------- |
| C      | `dist[v] = -1` (거리가 될 수 없는 값)   |
| Python | 사전에 키가 없음 → `dist.get(v)`는 None |
| Rust   | `Option<usize>`의 `None`                |

Rust처럼 `Option`을 쓰면 "거리가 없는 경우"를 잊고 계산하는 실수를 컴파일러가 막아 줍니다. C의 -1은 편리하지만 실수로 `dist[7] + 1`을 계산하면 0이 되어 버립니다.

## 5. C로 구현하기

C 구현은 고정 크기 배열로 인접 목록과 큐를 만들고, BFS가 방문 순서, 거리, 직전 정점을 배열에 채워 줍니다.

```c
// 파일: bfs.c
#include <stdio.h>
#include <stdbool.h>

#define N 8
#define MAX_DEGREE 4

int nbr[N][MAX_DEGREE];
int deg[N];

void add_edge(int u, int v) {
    nbr[u][deg[u]++] = v;
    nbr[v][deg[v]++] = u;
}

// start에서 BFS: 방문 순서를 order에, 거리를 dist에, 직전 정점을 parent에 기록
int bfs(int start, int order[], int dist[], int parent[]) {
    bool visited[N] = {false};
    int queue[N];
    int front = 0, rear = 0, count = 0;

    for (int v = 0; v < N; v++) {
        dist[v] = -1;                       // -1: 아직 도달하지 못함
        parent[v] = -1;
    }
    visited[start] = true;                  // 넣을 때 방문 표시
    dist[start] = 0;
    queue[rear++] = start;

    while (front < rear) {
        int u = queue[front++];
        order[count++] = u;
        for (int i = 0; i < deg[u]; i++) {
            int v = nbr[u][i];
            if (!visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;      // 한 층 더 멀다
                parent[v] = u;              // v에는 u를 거쳐 처음 도착했다
                queue[rear++] = v;
            }
        }
    }
    return count;
}

void print_path(const int parent[], int target) {
    int path[N];
    int len = 0;
    for (int v = target; v != -1; v = parent[v]) {
        path[len++] = v;                    // 도착점에서 거꾸로 따라간다
    }
    for (int i = len - 1; i >= 0; i--) {
        printf("%d%s", path[i], i > 0 ? " -> " : "\n");
    }
}

int main(void) {
    int edges[][2] = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {2, 4}, {3, 5}, {4, 5}, {5, 6}};
    for (int i = 0; i < 8; i++) {
        add_edge(edges[i][0], edges[i][1]);
    }

    int order[N], dist[N], parent[N];
    int visited_count = bfs(0, order, dist, parent);

    printf("방문 순서:");
    for (int i = 0; i < visited_count; i++) {
        printf(" %d", order[i]);
    }
    printf("\n");
    for (int v = 0; v < N; v++) {
        printf("  정점 %d: 거리 %2d, 직전 %2d\n", v, dist[v], parent[v]);
    }
    printf("0에서 6까지 최단 경로: ");
    print_path(parent, 6);
    printf("0에서 7까지: %s\n", dist[7] == -1 ? "갈 수 없음" : "갈 수 있음");
    return 0;
}
```

실행 결과:

```text
방문 순서: 0 1 2 3 4 5 6
  정점 0: 거리  0, 직전 -1
  정점 1: 거리  1, 직전  0
  정점 2: 거리  1, 직전  0
  정점 3: 거리  2, 직전  1
  정점 4: 거리  2, 직전  2
  정점 5: 거리  3, 직전  3
  정점 6: 거리  4, 직전  5
  정점 7: 거리 -1, 직전 -1
0에서 6까지 최단 경로: 0 -> 1 -> 3 -> 5 -> 6
0에서 7까지: 갈 수 없음
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `bool visited[N] = {false};`                        | 초기값을 하나만 적으면 나머지 원소도 모두 0(false)으로 채워집니다. BFS를 부를 때마다 새로 만들어지는 지역 배열입니다.      |
| `int queue[N];`                                     | 각 정점은 한 번만 들어가므로 크기 N이면 충분합니다. 방문 표시를 **넣을 때** 하기 때문에 가능한 일입니다.                   |
| `dist[v] = -1; parent[v] = -1;`                     | 모든 정점을 "아직 모름"으로 시작합니다. 시작점만 거리 0으로 바꿉니다.                                                      |
| `visited[start] = true; ... queue[rear++] = start;` | 시작점도 **넣으면서 표시**합니다. 이것을 빼면 시작점의 이웃이 시작점을 다시 큐에 넣습니다.                                 |
| `dist[v] = dist[u] + 1; parent[v] = u;`             | v를 **처음** 발견한 순간에만 기록합니다. 이미 발견한 정점은 `!visited[v]`에서 걸러지므로 더 긴 경로로 덮어써지지 않습니다. |
| `for (int v = target; v != -1; v = parent[v])`      | 도착점에서 parent를 따라가며 경로를 모읍니다. 시작점의 parent는 -1이라 거기서 멈춥니다.                                    |
| `printf("%d%s", path[i], i > 0 ? " -> " : "\n");`   | 모은 경로를 **거꾸로** 출력해 시작점부터 보여 줍니다. 마지막 원소 뒤에는 화살표 대신 줄바꿈을 씁니다.                      |

> **참고**: 이 코드는 도달할 수 없는 정점(7)에 `print_path`를 부르면 "7" 하나만 출력합니다. 경로를 출력하기 전에 `dist[target] != -1`인지 먼저 확인하는 것이 안전합니다. Rust 구현은 이 확인을 `Option`으로 강제합니다.

## 6. Python으로 구현하기

Python 버전은 `dist` 사전 하나가 **방문 집합과 거리 기록**을 함께 맡습니다. 사전에 키가 있으면 발견한 정점입니다. 경로 복원과 층별 묶기, 연결 요소 세기도 함께 해 봅니다.

```python
# 파일: bfs.py
from collections import deque


def bfs(adj, start):
    dist = {start: 0}               # 방문한 정점 → 거리 (방문 집합 역할도 한다)
    parent = {start: None}
    order = []
    queue = deque([start])
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            if v not in dist:        # 처음 발견한 정점만
                dist[v] = dist[u] + 1
                parent[v] = u
                queue.append(v)
    return order, dist, parent


def path_to(parent, target):
    if target not in parent:
        return None
    path = []
    while target is not None:
        path.append(target)
        target = parent[target]
    return path[::-1]                # 거꾸로 모았으니 뒤집는다


def levels(dist):
    by_level = {}
    for v, d in sorted(dist.items()):
        by_level.setdefault(d, []).append(v)
    return by_level


edges = [(0, 1), (0, 2), (1, 3), (2, 3), (2, 4), (3, 5), (4, 5), (5, 6)]
adj = {v: [] for v in range(8)}
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)

order, dist, parent = bfs(adj, 0)
print("방문 순서:", order)
print("층별:", levels(dist))
print("0 → 6 최단 경로:", path_to(parent, 6), f"(간선 {dist[6]}개)")
print("0 → 7:", path_to(parent, 7))

# 연결 요소 세기: 아직 방문하지 않은 정점에서 BFS를 다시 시작한다
seen = set()
components = []
for v in adj:
    if v not in seen:
        part, _, _ = bfs(adj, v)
        seen.update(part)
        components.append(part)
print("연결 요소:", components)
```

실행 결과:

```text
방문 순서: [0, 1, 2, 3, 4, 5, 6]
층별: {0: [0], 1: [1, 2], 2: [3, 4], 3: [5], 4: [6]}
0 → 6 최단 경로: [0, 1, 3, 5, 6] (간선 4개)
0 → 7: None
연결 요소: [[0, 1, 2, 3, 4, 5, 6], [7]]
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dist = {start: 0}`                    | 거리를 저장하는 사전이 곧 방문 집합입니다. `v not in dist`가 "아직 발견하지 않았다"는 뜻입니다. 별도의 `visited` 집합을 둬도 됩니다. |
| `parent = {start: None}`               | 시작점의 직전 정점은 없음(None)입니다. 경로 복원에서 None을 만나면 멈춥니다.                                                         |
| `queue = deque([start])`               | `list.pop(0)`은 O(n)이라 큰 그래프에서 느립니다. BFS에는 반드시 `deque`의 `popleft()`를 쓰세요(Day 59).                              |
| `return path[::-1]`                    | 슬라이스의 간격 -1은 **뒤집은 복사본**을 만듭니다. `path.reverse()`는 제자리에서 뒤집고 None을 돌려줍니다.                           |
| `by_level.setdefault(d, []).append(v)` | 거리를 키로 정점을 묶어 **층**을 보여 줍니다. 3절의 층 그림과 같은 결과입니다.                                                       |
| `for v in adj: if v not in seen: ...`  | **연결 요소 세기**입니다. 아직 방문하지 않은 정점을 만날 때마다 새 BFS를 시작합니다. 한 BFS가 방문하는 정점들이 한 조각입니다.       |
| `seen.update(part)`                    | 이번 BFS에서 방문한 정점을 모두 전체 방문 집합에 넣습니다.                                                                           |

## 7. Rust로 구현하기

Rust 버전은 거리와 직전 정점을 `Vec<Option<usize>>`로 저장합니다. 도달할 수 없음이 `None`으로 **타입에 드러나므로**, 거리를 쓰기 전에 반드시 `Some`인지 확인하게 됩니다.

```rust
// 파일: bfs.rs
use std::collections::VecDeque;

struct BfsResult {
    order: Vec<usize>,
    dist: Vec<Option<usize>>,       // None: 도달할 수 없음
    parent: Vec<Option<usize>>,
}

fn bfs(adj: &[Vec<usize>], start: usize) -> BfsResult {
    let n = adj.len();
    let mut dist = vec![None; n];
    let mut parent = vec![None; n];
    let mut order = Vec::new();
    let mut queue = VecDeque::new();

    dist[start] = Some(0);
    queue.push_back(start);
    while let Some(u) = queue.pop_front() {
        order.push(u);
        let du = dist[u].expect("큐에 들어간 정점은 거리가 있다");
        for &v in &adj[u] {
            if dist[v].is_none() {
                dist[v] = Some(du + 1);
                parent[v] = Some(u);
                queue.push_back(v);
            }
        }
    }
    BfsResult { order, dist, parent }
}

fn path_to(parent: &[Option<usize>], start: usize, target: usize) -> Option<Vec<usize>> {
    let mut path = vec![target];
    let mut cur = target;
    while cur != start {
        cur = parent[cur]?;             // 직전 정점이 없으면 도달 불가 → None
        path.push(cur);
    }
    path.reverse();
    Some(path)
}

fn main() {
    let edges = [(0, 1), (0, 2), (1, 3), (2, 3), (2, 4), (3, 5), (4, 5), (5, 6)];
    let mut adj = vec![Vec::new(); 8];
    for (u, v) in edges {
        adj[u].push(v);
        adj[v].push(u);
    }

    let r = bfs(&adj, 0);
    println!("방문 순서: {:?}", r.order);
    for (v, d) in r.dist.iter().enumerate() {
        match d {
            Some(d) => println!("  정점 {v}: 거리 {d}, 직전 {:?}", r.parent[v]),
            None => println!("  정점 {v}: 도달 불가"),
        }
    }
    println!("0 → 6: {:?}", path_to(&r.parent, 0, 6));
    println!("0 → 7: {:?}", path_to(&r.parent, 0, 7));

    let farthest = r
        .dist
        .iter()
        .enumerate()
        .filter_map(|(v, d)| d.map(|d| (d, v)))
        .max();
    println!("가장 먼 정점 (거리, 정점): {:?}", farthest);
}
```

실행 결과:

```text
방문 순서: [0, 1, 2, 3, 4, 5, 6]
  정점 0: 거리 0, 직전 None
  정점 1: 거리 1, 직전 Some(0)
  정점 2: 거리 1, 직전 Some(0)
  정점 3: 거리 2, 직전 Some(1)
  정점 4: 거리 2, 직전 Some(2)
  정점 5: 거리 3, 직전 Some(3)
  정점 6: 거리 4, 직전 Some(5)
  정점 7: 도달 불가
0 → 6: Some([0, 1, 3, 5, 6])
0 → 7: None
가장 먼 정점 (거리, 정점): Some((4, 6))
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                                                                    |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `struct BfsResult { order, dist, parent }`          | 결과 세 가지를 구조체로 묶어 한 번에 돌려줍니다. C는 배열 세 개를 포인터로 받았고, Python은 튜플로 돌려줬습니다.                                                        |
| `vec![None; n]`                                     | 모든 정점을 "아직 모름"으로 시작합니다. `dist[v].is_none()`이 방문 여부 검사를 겸합니다.                                                                                |
| `let du = dist[u].expect(...)`                      | 큐에 들어간 정점은 반드시 거리가 있습니다. 만약 없다면 버그이므로 메시지와 함께 멈추게 했습니다.                                                                        |
| `for &v in &adj[u]`                                 | 이웃 목록을 빌려서 순회하고, `&v` 패턴으로 `usize` 값을 복사해 꺼냅니다.                                                                                                |
| `cur = parent[cur]?;`                               | 직전 정점이 `None`이면 `?`가 그 자리에서 `None`을 돌려줍니다. 도달할 수 없는 정점의 경로는 자동으로 `None`이 됩니다. C의 "7만 출력되는" 문제가 생기지 않습니다.         |
| `.filter_map(\|(v, d)\| d.map(\|d\| (d, v))).max()` | 도달할 수 있는 정점만 (거리, 정점) 쌍으로 바꾼 뒤 가장 큰 것을 고릅니다. 튜플은 앞 원소부터 비교되므로 가장 먼 정점이 나옵니다. 모두 도달 불가라면 결과도 `None`입니다. |

## 8. 실행 추적

0에서 시작하는 BFS를 큐 단위로 따라갑니다. 이웃은 간선을 넣은 순서대로 저장되어 있습니다(0: 1, 2 / 1: 0, 3 / 2: 0, 3, 4 / 3: 1, 2, 5 / 4: 2, 5 / 5: 3, 4, 6 / 6: 5).

| 꺼낸 정점 | 이웃 검사                  | 새로 발견(거리, 직전) | 큐(앞 → 뒤) |
| --------- | -------------------------- | --------------------- | ----------- |
| (시작)    |                            | 0(0, -)               | `0`         |
| 0         | 1 새로, 2 새로             | 1(1, 0), 2(1, 0)      | `1 2`       |
| 1         | 0 이미, 3 새로             | 3(2, 1)               | `2 3`       |
| 2         | 0 이미, 3 **이미**, 4 새로 | 4(2, 2)               | `3 4`       |
| 3         | 1 이미, 2 이미, 5 새로     | 5(3, 3)               | `4 5`       |
| 4         | 2 이미, 5 **이미**         |                       | `5`         |
| 5         | 3 이미, 4 이미, 6 새로     | 6(4, 5)               | `6`         |
| 6         | 5 이미                     |                       | (비어 있음) |

2를 꺼냈을 때 3은 이미 1에게서 발견되었으므로 다시 넣지 않았습니다. 넣을 때 표시했기 때문입니다. 큐에 들어간 횟수는 정점 수와 같은 7번입니다.

## 9. 다른 예제로 다시 이해하기

**격자 미로**도 그래프입니다. 각 칸이 정점이고, 상하좌우로 붙은 빈칸끼리 간선이 있다고 보면 됩니다. 간선을 미리 만들 필요 없이, BFS에서 "이웃을 구하는" 부분만 "상하좌우 네 칸 중 벽이 아니고 격자 안에 있는 칸"으로 바꾸면 됩니다. 칸마다 한 걸음의 비용이 같으므로 BFS가 **가장 적은 걸음 수**를 찾아 줍니다. 아래 미로에서 `S`는 출발, `E`는 도착, `#`은 벽입니다. 찾은 최단 경로를 `*`로 표시했습니다.

```python
# 파일: maze.py
from collections import deque

MAZE = [
    "S.#.....",
    ".##.###.",
    "....#...",
    "#.#.#.#.",
    "..#...#E",
]


def solve(maze):
    rows, cols = len(maze), len(maze[0])
    start = next((r, c) for r in range(rows) for c in range(cols) if maze[r][c] == "S")
    goal = next((r, c) for r in range(rows) for c in range(cols) if maze[r][c] == "E")

    parent = {start: None}
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        if (r, c) == goal:
            break
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:     # 위, 아래, 왼쪽, 오른쪽
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" \
                    and (nr, nc) not in parent:
                parent[(nr, nc)] = (r, c)
                queue.append((nr, nc))

    if goal not in parent:
        return None, len(parent)
    path = []
    cell = goal
    while cell is not None:
        path.append(cell)
        cell = parent[cell]
    return path[::-1], len(parent)


path, explored = solve(MAZE)
grid = [list(row) for row in MAZE]
for r, c in path[1:-1]:
    grid[r][c] = "*"
for row in grid:
    print("".join(row))
print(f"최단 거리: {len(path) - 1}칸, 살펴본 칸: {explored}개")

BLOCKED = [
    "S.#.....",
    "###.###.",
    "....#...",
    ".#.##.#.",
    "..#...#E",
]
print("막힌 미로:", solve(BLOCKED)[0])
```

실행 결과:

```text
S.#*****
*##*###*
****#..*
#.#.#.#*
..#...#E
최단 거리: 15칸, 살펴본 칸: 27개
막힌 미로: None
```

위쪽으로 돌아가는 경로와 아래쪽으로 돌아가는 경로가 모두 15칸이라서 최단 경로가 두 개입니다. BFS는 이웃을 **위, 아래, 왼쪽, 오른쪽** 순서로 보았기 때문에 먼저 발견한 위쪽 경로를 골랐습니다. 도착점을 꺼내는 순간 `break`로 멈췄기 때문에, 미로의 모든 칸이 아니라 27개만 살펴보았습니다.

같은 미로를 Rust로 풀면 다음과 같습니다. 좌표에서 1을 빼면 `usize`가 음수가 될 수 있으므로 `checked_add_signed`로 **범위를 벗어나는 이동을 안전하게** 걸러 냅니다.

```rust
// 파일: maze.rs
use std::collections::VecDeque;

fn find(grid: &[Vec<u8>], target: u8) -> (usize, usize) {
    for (r, row) in grid.iter().enumerate() {
        if let Some(c) = row.iter().position(|&b| b == target) {
            return (r, c);
        }
    }
    panic!("{} 칸이 없다", target as char);
}

fn shortest(grid: &[Vec<u8>]) -> Option<usize> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let start = find(grid, b'S');
    let goal = find(grid, b'E');
    let mut dist = vec![vec![None; cols]; rows];
    dist[start.0][start.1] = Some(0);
    let mut queue = VecDeque::from([start]);

    while let Some((r, c)) = queue.pop_front() {
        let d = dist[r][c]?;
        if (r, c) == goal {
            return Some(d);
        }
        let moves: [(isize, isize); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];
        for (dr, dc) in moves {
            let (Some(nr), Some(nc)) = (r.checked_add_signed(dr), c.checked_add_signed(dc)) else {
                continue;                           // 0보다 작아지는 좌표
            };
            if nr < rows && nc < cols && grid[nr][nc] != b'#' && dist[nr][nc].is_none() {
                dist[nr][nc] = Some(d + 1);
                queue.push_back((nr, nc));
            }
        }
    }
    None
}

fn main() {
    let maze = ["S.#.....", ".##.###.", "....#...", "#.#.#.#.", "..#...#E"];
    let grid: Vec<Vec<u8>> = maze.iter().map(|row| row.bytes().collect()).collect();
    println!("최단 거리: {:?}", shortest(&grid));

    let blocked = ["S.#.....", "###.###.", "....#...", ".#.##.#.", "..#...#E"];
    let grid: Vec<Vec<u8>> = blocked.iter().map(|row| row.bytes().collect()).collect();
    println!("막힌 미로: {:?}", shortest(&grid));
}
```

실행 결과:

```text
최단 거리: Some(15)
막힌 미로: None
```

## 10. 시간·공간 복잡도

| 항목                 | 인접 목록 | 인접 행렬 | 격자(R×C) |
| -------------------- | --------- | --------- | --------- |
| 시간                 | O(V + E)  | O(V²)     | O(R × C)  |
| 공간(큐, 방문, 거리) | O(V)      | O(V)      | O(R × C)  |

각 정점은 큐에 **한 번** 들어가고 **한 번** 나옵니다. 각 정점에서 이웃 목록을 한 번씩 훑으므로 모든 간선을 (무방향이면 양쪽에서) 한 번씩 봅니다. 그래서 O(V + E)입니다. 격자에서는 칸마다 이웃이 최대 4개라 칸 수에 비례합니다.

## 11. 세 언어 비교

| 관점           | C                              | Python                      | Rust                                 |
| -------------- | ------------------------------ | --------------------------- | ------------------------------------ |
| 큐             | 배열 + front·rear              | `collections.deque`         | `VecDeque`                           |
| 방문 표시      | `bool visited[N]`              | `dist` 사전의 키 또는 `set` | `dist[v].is_none()` 또는 `Vec<bool>` |
| 도달 불가 거리 | `-1`                           | 키 없음 → `None`            | `Option<usize>`의 `None`             |
| 경로 복원      | parent 배열을 거꾸로 따라 출력 | 리스트에 모아 `[::-1]`      | `?`로 도달 불가를 처리, `reverse()`  |
| 격자 이웃 범위 | `0 <= r && r < rows` 직접      | `0 <= nr < rows` 연쇄 비교  | `checked_add_signed`로 음수 방지     |

## 12. 자주 하는 실수

### 실수 1: 방문 표시를 하지 않는다

사이클이 있는 그래프에서 방문 표시 없이 BFS를 하면 같은 정점을 영원히 다시 넣습니다. 큐가 끝없이 커지다가 메모리가 바닥납니다. 트리의 레벨 순회 코드를 그래프에 그대로 쓰면 이 문제가 생깁니다.

### 실수 2: 꺼낼 때 방문 표시를 한다

실습의 디버그 문제입니다. 결과는 맞을 수 있지만 같은 정점이 큐에 여러 번 들어갑니다. 간선이 많은 그래프에서는 큐가 간선 수만큼 커질 수 있습니다. **넣을 때 표시**하세요.

### 실수 3: BFS에 `list.pop(0)`을 쓴다

```python
# 파일: slow_queue.py
import time
from collections import deque

n = 20_000
start = time.perf_counter()
q = list(range(n))
while q:
    q.pop(0)
list_time = time.perf_counter() - start

start = time.perf_counter()
d = deque(range(n))
while d:
    d.popleft()
deque_time = time.perf_counter() - start

print("deque가 더 빠르다:", deque_time < list_time)
```

실행 결과:

```text
deque가 더 빠르다: True
```

`list.pop(0)`은 매번 나머지 원소를 앞으로 당기므로 전체가 O(n²)입니다. 정점이 수십만 개인 그래프에서는 BFS가 몇 분씩 걸릴 수 있습니다.

### 실수 4: 격자 범위 검사를 빠뜨린다

```python
# 파일: grid_index.py (실행 오류: IndexError)
maze = ["S.", ".E"]
r, c = 1, 1
for dr, dc in [(1, 0), (0, 1)]:
    print(maze[r + dr][c + dc])     # 아래·오른쪽이 격자 밖
```

```text
IndexError: string index out of range
```

더 교묘한 문제는 **음수 인덱스**입니다. Python에서 `maze[-1]`은 오류 없이 **마지막 줄**을 돌려주므로, 위쪽 경계를 넘은 이동이 조용히 아래쪽 끝으로 순간 이동해 버립니다. 반드시 `0 <= nr < rows and 0 <= nc < cols`를 먼저 확인하세요. C에서는 배열 밖 접근이 정의되지 않은 동작이고, Rust에서는 `usize` 뺄셈이 panic합니다.

### 실수 5: 가중치 그래프에 BFS를 쓴다

도로마다 걸리는 시간이 다르다면 "간선 수가 적은 경로"가 "시간이 짧은 경로"가 아닐 수 있습니다. BFS는 모든 간선의 비용이 **같을 때만** 최단 경로를 보장합니다. 비용이 다르면 Day 82의 다익스트라 알고리즘을 씁니다.

## 13. Q&A

**Q. BFS와 DFS(깊이 우선 탐색)는 무엇이 다른가요?**

A. BFS는 큐로 **가까운 곳부터** 넓게 퍼지고, DFS는 스택(또는 재귀)으로 **한 길을 끝까지** 파고든 뒤 되돌아옵니다. 둘 다 연결된 모든 정점을 O(V + E)에 방문하지만, 최단 거리는 BFS만 알려 줍니다. DFS는 사이클 찾기, 경로가 있는지 확인하기, 위상 정렬 등에 씁니다(Day 81).

**Q. 미로에서 대각선 이동도 된다면요?**

A. 이웃 방향을 8개(`(-1,-1)`, `(-1,1)` 등)로 늘리면 됩니다. 대각선 이동의 비용이 1이라면 BFS가 그대로 통합니다. 대각선의 비용을 √2처럼 다르게 쳐야 한다면 다익스트라가 필요합니다.

**Q. 시작점과 도착점 양쪽에서 동시에 BFS를 하면 더 빠른가요?**

A. 네, **양방향 BFS**라고 합니다. 한쪽에서 거리 d까지 넓히면 정점이 아주 많아지지만, 양쪽에서 d/2씩 넓히면 훨씬 적습니다. 두 물결이 만나는 순간 최단 경로가 결정됩니다. SNS의 "몇 다리 건너 아는 사이" 계산에 쓰입니다.

**Q. 연결 요소를 BFS 말고 다르게 구할 수도 있나요?**

A. DFS로도 되고, **유니온 파인드(Union-Find)** 라는 자료구조로도 구할 수 있습니다. 유니온 파인드는 간선이 하나씩 추가될 때마다 "두 정점이 같은 조각인가?"를 빠르게 답해야 할 때 유리합니다.

## 14. 핵심 요약

- BFS는 **큐**로 시작점에서 가까운 정점부터 한 층씩 방문합니다.
- 그래프에는 사이클이 있으므로 **방문 표시**가 필요하고, 표시는 **큐에 넣을 때** 합니다.
- 가중치가 없는 그래프에서 BFS가 처음 도착한 거리 `dist[v]`는 **최단 거리**입니다.
- `parent[v]`를 기록하면 도착점에서 거꾸로 따라가 **최단 경로**를 복원할 수 있습니다.
- 끝까지 발견되지 않은 정점은 **도달할 수 없습니다.** C는 -1, Python은 None, Rust는 `Option`으로 표현합니다.
- 방문하지 않은 정점에서 BFS를 반복하면 **연결 요소**를 셀 수 있고, 격자 미로도 칸을 정점으로 보면 BFS로 풀립니다.
- 시간 복잡도는 인접 목록에서 **O(V + E)** 입니다.

## 15. 도전 문제

1. **(C)** 9절의 미로 BFS를 C로 옮겨 보세요. 좌표는 `r * cols + c` 하나의 정수로 바꾸면 1차원 배열 큐와 방문 배열을 쓸 수 있습니다.
2. **(Python)** 미로에서 벽을 **한 번까지 부수고** 지나갈 수 있다면 최단 거리가 얼마인지 구하세요. 상태를 `(행, 열, 부순 횟수)`로 늘려 BFS를 하면 됩니다.
3. **(Rust)** 그래프가 **이분 그래프**인지(정점을 두 색으로 칠해 모든 간선의 양 끝 색이 다르게 할 수 있는지) BFS로 검사해 보세요. BFS 층의 홀짝으로 색을 정하고, 같은 색끼리 이어진 간선이 있는지 봅니다.
4. **(세 언어)** 단어 사다리 문제: `"cold"`에서 `"warm"`까지 한 번에 한 글자씩 바꾸되 중간 단어가 모두 주어진 단어 목록에 있어야 할 때, 가장 적게 바꾸는 방법을 BFS로 찾아보세요.
