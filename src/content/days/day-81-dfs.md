---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-81-dfs
courseId: crp-92
phaseId: phase-07
dayNumber: 81
date: "2026-12-20"
title: 깊이 우선 탐색(DFS) — 한 길을 끝까지 가 보고 돌아오기
summary: 한 이웃으로 끝까지 파고든 뒤 되돌아오는 DFS를 재귀와 명시적 스택 두 방식으로 C, Python, Rust에서 구현합니다. 들어간 시각과 나온 시각으로 탐색 구조를 읽고, 연결 요소 세기, 방향 그래프의 사이클 찾기(탐색 중·끝남 표시), 선수 과목 순서를 정하는 위상 정렬, 격자의 섬 세기까지 DFS로 풉니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 120
prerequisites: [day-80-backtracking]
learningObjectives:
  - DFS가 스택(또는 재귀 호출 스택)으로 가장 최근에 발견한 정점부터 더 깊이 들어간다는 것을 BFS와 비교해 설명한다.
  - 재귀 DFS와 명시적 스택 DFS를 구현하고 방문 순서를 같게 만든다.
  - 들어간 시각과 나온 시각을 기록해 탐색 트리의 구조를 설명한다.
  - 세 가지 상태(처음, 탐색 중, 끝남)로 방향 그래프의 사이클을 찾는다.
  - 나온 순서를 뒤집어 위상 정렬을 만들고, 격자에서 연결된 영역을 센다.
concepts:
  [
    dfs,
    depth-first search,
    recursion,
    stack,
    discovery time,
    finish time,
    connected components,
    cycle detection,
    topological sort,
    flood fill,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dfs.py — 그래프를 바꿔 DFS와 BFS의 순서를 비교해 보세요.
  from collections import deque

  adj = {0: [1, 2], 1: [3], 2: [4], 3: [], 4: []}

  def dfs(u, seen):
      seen.append(u)
      for v in adj[u]:
          if v not in seen:
              dfs(v, seen)
      return seen

  def bfs(s):
      seen, q = [s], deque([s])
      while q:
          for v in adj[q.popleft()]:
              if v not in seen:
                  seen.append(v)
                  q.append(v)
      return seen

  print("DFS:", dfs(0, []))
  print("BFS:", bfs(0))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day81-predict-py
    title: DFS 방문 순서 예측하기
    kind: predict
    objective: 재귀 DFS가 이웃 목록의 순서대로 끝까지 파고드는 과정을 추적한다.
    prompt: 출력될 방문 순서를 공백으로 구분해 적으세요.
    starter: |-
      adj = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": ["F"], "E": [], "F": []}
      order = []


      def dfs(u):
          order.append(u)
          for v in adj[u]:
              if v not in order:
                  dfs(v)


      dfs("A")
      print(*order)
    answer: "A B D F C E"
    hint: "A → B → D → F로 끝까지 간 뒤, F와 D, B에서 더 갈 곳이 없어 A로 돌아와 C를 봅니다. C의 이웃 D는 이미 방문했습니다."
    explanation: "DFS는 B 쪽 가지를 끝까지 다 본 뒤에야 C로 넘어갑니다. 같은 그래프의 BFS 순서는 A B C D E F로, 가까운 정점부터 봅니다."
    commonMistakes:
      - "BFS처럼 A B C D E F로 적음"
      - "D를 C에서 다시 방문한다고 생각함"
    language: python
    verification: run
  - id: ex-day81-predict-c
    title: 들어간 시각과 나온 시각 예측하기
    kind: predict
    objective: DFS에서 한 정점의 구간 [들어간 시각, 나온 시각]이 자손의 구간을 품는다는 것을 확인한다.
    prompt: 출력될 여섯 숫자(정점 0, 1, 2의 들어간 시각과 나온 시각)를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int adj[3][2] = {{1, 2}, {-1, -1}, {-1, -1}};
      bool seen[3];
      int t = 0, in_t[3], out_t[3];

      void dfs(int u) {
          seen[u] = true;
          in_t[u] = ++t;
          for (int i = 0; i < 2; i++) {
              int v = adj[u][i];
              if (v >= 0 && !seen[v]) dfs(v);
          }
          out_t[u] = ++t;
      }

      int main(void) {
          dfs(0);
          for (int u = 0; u < 3; u++) printf("%d %d ", in_t[u], out_t[u]);
          printf("\n");
          return 0;
      }
    answer: "1 6 2 3 4 5"
    hint: "0에 들어가고(1), 1에 들어갔다 나오고(2, 3), 2에 들어갔다 나온 뒤(4, 5), 마지막에 0에서 나옵니다(6)."
    explanation: "부모 0의 구간 [1, 6]이 자식 1의 [2, 3]과 자식 2의 [4, 5]를 모두 품습니다. 두 정점의 구간이 겹치지 않으면 서로 조상-자손 관계가 아닙니다. 이 성질은 트리 질의와 사이클 판별에 쓰입니다."
    commonMistakes:
      - "나온 시각을 따로 세서 1 2 3 4 5 6처럼 적음"
      - "0의 나온 시각을 자식보다 먼저라고 생각함"
    language: c
    verification: run
  - id: ex-day81-fill
    title: Rust 스택 DFS 빈칸 채우기
    kind: fill
    objective: 스택에서 꺼낸 정점을 방문하고 이웃을 거꾸로 넣는다.
    prompt: "빈칸 두 곳에 스택에서 정점을 꺼내는 코드와, 이웃들을 거꾸로 스택에 넣는 코드를 채우세요."
    starter: |-
      fn main() {
          let adj = vec![vec![1, 2], vec![3], vec![3], vec![]];
          let mut seen = vec![false; 4];
          let mut stack = vec![0];
          let mut order = Vec::new();
          while let Some(u) = _____ {
              if seen[u] {
                  continue;
              }
              seen[u] = true;
              order.push(u);
              for &v in _____ {
                  if !seen[v] {
                      stack.push(v);
                  }
              }
          }
          println!("{:?}", order);
      }
    answer: |-
      fn main() {
          let adj = vec![vec![1, 2], vec![3], vec![3], vec![]];
          let mut seen = vec![false; 4];
          let mut stack = vec![0];
          let mut order = Vec::new();
          while let Some(u) = stack.pop() {
              if seen[u] {
                  continue;
              }
              seen[u] = true;
              order.push(u);
              for &v in adj[u].iter().rev() {
                  if !seen[v] {
                      stack.push(v);
                  }
              }
          }
          println!("{:?}", order);
      }
    output: "[0, 1, 3, 2]"
    hint: "Vec의 pop()은 가장 최근에 넣은 값을 꺼냅니다. 이웃을 거꾸로 넣으면 첫 이웃이 스택의 top에 와서 먼저 나옵니다."
    explanation: "0을 꺼내 2, 1 순서로 넣으면 1이 먼저 나와 1 → 3으로 파고듭니다. 그다음 2가 나오고, 2의 이웃 3은 이미 봤습니다. 이 스택 DFS는 꺼낼 때 방문 표시를 하므로 같은 정점이 스택에 두 번 들어갈 수 있지만, seen 검사로 한 번만 방문합니다."
    commonMistakes:
      - "adj[u].iter()를 그대로 써서 마지막 이웃부터 방문함"
      - "stack.remove(0)으로 앞에서 꺼내 BFS처럼 동작하게 만듦"
    language: rust
    verification: run
  - id: ex-day81-modify
    title: Python DFS로 경로 찾기
    kind: modify
    objective: DFS가 목적지를 찾으면 지금까지의 경로를 돌려주도록 바꾼다.
    prompt: "find_path(adj, start, goal)가 start에서 goal까지 가는 경로(정점 목록)를 DFS로 찾아 돌려주게 하세요. 없으면 None입니다. 아래 그래프에서 A→F는 ['A', 'B', 'D', 'F'], A→G는 None이어야 합니다."
    starter: |-
      adj = {"A": ["B", "C"], "B": ["D"], "C": ["E"], "D": ["F"], "E": [], "F": [], "G": []}


      def find_path(adj, start, goal):
          seen = set()

          def dfs(u):
              seen.add(u)
              for v in adj[u]:
                  if v not in seen:
                      dfs(v)

          dfs(start)
          return None


      print(find_path(adj, "A", "F"), find_path(adj, "A", "G"))
    answer: |-
      adj = {"A": ["B", "C"], "B": ["D"], "C": ["E"], "D": ["F"], "E": [], "F": [], "G": []}


      def find_path(adj, start, goal):
          seen, path = set(), []

          def dfs(u):
              seen.add(u)
              path.append(u)
              if u == goal:
                  return True
              for v in adj[u]:
                  if v not in seen and dfs(v):
                      return True
              path.pop()                  # 이 길로는 goal에 못 간다 → 되돌리기
              return False

          return path if dfs(start) else None


      print(find_path(adj, "A", "F"), find_path(adj, "A", "G"))
    output: "['A', 'B', 'D', 'F'] None"
    hint: "Day 80의 백트래킹처럼 들어갈 때 path에 넣고, 이 정점에서 목적지를 찾지 못하면 빼세요. 찾았다면 True를 돌려 모든 호출이 바로 끝나게 합니다."
    explanation: "DFS로 찾은 경로는 존재하는 경로 하나일 뿐 가장 짧다는 보장은 없습니다. 최단 경로가 필요하면 BFS(Day 69)를 씁니다. G는 A에서 갈 수 없어 None입니다."
    commonMistakes:
      - "찾은 뒤에도 탐색을 계속해 path에 다른 정점이 섞임"
      - "막힌 길에서 path.pop()을 하지 않아 경로에 막다른 정점이 남음"
    language: python
    verification: run
  - id: ex-day81-debug
    title: C 사이클 판별의 상태 버그 고치기
    kind: debug
    objective: 방문 여부만으로는 방향 그래프의 사이클을 판별할 수 없다는 것을 확인한다.
    prompt: "이 코드는 '이미 방문한 정점을 다시 만나면 사이클'로 판단해서, 사이클이 없는 그래프(0→1, 0→2, 1→3, 2→3)도 사이클이 있다고 합니다. 탐색 중(1)과 끝남(2)을 구별하도록 고쳐 '없음'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int adj[4][2] = {{1, 2}, {3, -1}, {3, -1}, {-1, -1}};
      bool visited[4];

      bool has_cycle(int u) {
          visited[u] = true;
          for (int i = 0; i < 2; i++) {
              int v = adj[u][i];
              if (v < 0) continue;
              if (visited[v]) return true;
              if (has_cycle(v)) return true;
          }
          return false;
      }

      int main(void) {
          printf("%s\n", has_cycle(0) ? "있음" : "없음");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      int adj[4][2] = {{1, 2}, {3, -1}, {3, -1}, {-1, -1}};
      int state[4];                       // 0 = 처음, 1 = 탐색 중, 2 = 끝남

      bool has_cycle(int u) {
          state[u] = 1;
          for (int i = 0; i < 2; i++) {
              int v = adj[u][i];
              if (v < 0) continue;
              if (state[v] == 1) return true;
              if (state[v] == 0 && has_cycle(v)) return true;
          }
          state[u] = 2;
          return false;
      }

      int main(void) {
          printf("%s\n", has_cycle(0) ? "있음" : "없음");
          return 0;
      }
    output: "없음"
    starterOutput: "있음"
    hint: "0 → 1 → 3을 끝낸 뒤 0 → 2 → 3으로 다시 3을 만납니다. 3은 이미 탐색이 끝난 정점이지 지금 탐색 중인 경로 위에 있는 정점이 아닙니다."
    explanation: "사이클은 '지금 들어와 있는 경로(재귀 스택) 위의 정점'으로 되돌아가는 간선이 있을 때만 생깁니다. 이미 탐색이 끝난 정점(상태 2)을 다시 만나는 것은 두 경로가 합쳐지는 것일 뿐입니다. 무방향 그래프라면 부모 정점을 제외하고 방문한 정점을 만나면 사이클입니다."
    commonMistakes:
      - "탐색이 끝난 뒤 state[u] = 2로 바꾸는 것을 빠뜨려 모든 정점이 계속 '탐색 중'으로 남음"
      - "모든 시작점에서 검사하지 않아 0에서 닿지 않는 사이클을 놓침"
    language: c
    verification: run
  - id: ex-day81-independent
    title: Rust로 섬 개수와 가장 큰 섬 넓이 구하기
    kind: independent
    objective: 격자에서 DFS로 연결된 칸을 한 번에 칠하며 영역을 센다.
    prompt: "'#'은 땅, '.'은 바다인 격자에서 상하좌우로 이어진 땅을 섬 하나로 봅니다. 섬의 개수와 가장 큰 섬의 칸 수를 출력하세요. 아래 격자에서 3 4가 나와야 합니다."
    starter: |-
      fn main() {
          let map = ["##..#", "#...#", "..#..", ".###.", "....."];
          println!("{}", map.len());
      }
    answer: |-
      fn fill(grid: &mut Vec<Vec<u8>>, r: usize, c: usize) -> usize {
          if grid[r][c] != b'#' {
              return 0;
          }
          grid[r][c] = b'.';                          // 칠해서 다시 세지 않게 한다
          let mut area = 1;
          if r > 0 { area += fill(grid, r - 1, c); }
          if r + 1 < grid.len() { area += fill(grid, r + 1, c); }
          if c > 0 { area += fill(grid, r, c - 1); }
          if c + 1 < grid[0].len() { area += fill(grid, r, c + 1); }
          area
      }

      fn main() {
          let map = ["##..#", "#...#", "..#..", ".###.", "....."];
          let mut grid: Vec<Vec<u8>> = map.iter().map(|row| row.bytes().collect()).collect();
          let (mut islands, mut largest) = (0, 0);
          for r in 0..grid.len() {
              for c in 0..grid[0].len() {
                  if grid[r][c] == b'#' {
                      islands += 1;
                      largest = largest.max(fill(&mut grid, r, c));
                  }
              }
          }
          println!("{islands} {largest}");
      }
    output: "3 4"
    hint: "땅을 만나면 섬 하나를 발견한 것입니다. 그 칸에서 DFS로 이어진 땅을 모두 바다로 바꾸면서 칸 수를 세면, 같은 섬을 다시 세지 않습니다."
    explanation: "왼쪽 위 섬(3칸), 오른쪽 섬(2칸), 가운데 아래 섬(4칸)으로 3개이고 가장 큰 섬은 4칸입니다. 방문 표시 대신 격자 자체를 바꾸는 방법을 '칠하기(flood fill)'라고 하며, 그림판의 페인트 통 도구가 이 알고리즘입니다."
    commonMistakes:
      - "칠하지 않고 세어 같은 섬을 여러 번 셈"
      - "usize 좌표에서 r - 1을 먼저 계산해 r = 0일 때 넘침 panic을 일으킴"
    language: rust
    verification: run
quiz:
  - id: quiz-day81-01
    question: DFS와 BFS의 가장 큰 차이는?
    choices:
      - DFS는 스택(재귀)으로 가장 최근에 발견한 정점부터 더 깊이 들어가고, BFS는 큐로 가까운 정점부터 넓게 본다
      - DFS만 모든 정점을 방문한다
      - BFS는 재귀로만 구현할 수 있다
      - DFS는 가중치 그래프에서만 쓴다
    answerIndex: 0
    explanation: 두 탐색은 '다음에 볼 정점을 무엇에 담는가'만 다릅니다. 연결된 모든 정점을 O(V + E)에 방문하는 것은 같지만, 최단 거리는 BFS만 알려 줍니다.
  - id: quiz-day81-02
    question: 방향 그래프에서 사이클을 찾을 때 '탐색 중' 상태가 필요한 이유는?
    choices:
      - 속도를 높이려고
      - 이미 끝난 정점으로 가는 간선은 사이클이 아니고, 지금 경로 위의 정점으로 되돌아가는 간선만 사이클이기 때문에
      - 무방향 그래프와 같은 코드를 쓰려고
      - 방문 순서를 기록하려고
    answerIndex: 1
    explanation: 0→1→3, 0→2→3처럼 두 경로가 3에서 만나면 3을 두 번 만나지만 사이클은 없습니다. 재귀 스택 위에 있는 정점(탐색 중)을 다시 만날 때만 되돌아가는 길이 있는 것입니다.
  - id: quiz-day81-03
    question: "위상 정렬(topological sort)의 결과로 옳은 것은?"
    choices:
      - 정점을 번호순으로 정렬한 것
      - 모든 간선 u → v에 대해 u가 v보다 앞에 오는 정점의 나열
      - BFS 방문 순서
      - 사이클이 있는 그래프의 모든 사이클
    answerIndex: 1
    explanation: 선수 과목을 먼저 듣는 순서, 작업의 의존 관계를 지키는 순서입니다. 사이클이 있으면 위상 정렬이 존재하지 않습니다. DFS로 나온 시각이 늦은 정점부터 나열하면 위상 순서가 됩니다.
  - id: quiz-day81-04
    question: 재귀 DFS를 격자 1000×1000에 쓸 때 조심해야 할 것은?
    choices:
      - 결과가 틀린다
      - 재귀 깊이가 최대 100만까지 깊어질 수 있어 호출 스택이 넘칠 수 있다
      - BFS보다 항상 느리다
      - 방문 표시가 필요 없다
    answerIndex: 1
    explanation: 땅이 한 줄로 길게 이어지면 재귀가 칸 수만큼 깊어집니다. Python은 기본 재귀 한도(약 1,000)에 걸리고, C와 Rust도 호출 스택이 넘칠 수 있습니다. 이럴 때는 명시적 스택을 쓰는 DFS나 BFS로 바꿉니다.
  - id: quiz-day81-05
    question: DFS에서 정점 u의 [들어간 시각, 나온 시각] 구간 안에 정점 v의 구간이 들어 있다면?
    choices:
      - v는 u의 조상이다
      - v는 u의 자손이다(u를 탐색하는 동안 v를 방문했다)
      - u와 v는 연결되어 있지 않다
      - 아무 관계가 없다
    answerIndex: 1
    explanation: u에 들어간 뒤 u에서 나오기 전에 v에 들어갔다 나왔으므로, v는 u를 통해 발견된 자손입니다. 구간이 겹치지 않으면 조상-자손 관계가 아닙니다.
---

## 1. 오늘 배울 내용

Day 69의 BFS는 가까운 곳부터 **넓게** 퍼졌습니다. 오늘 배우는 **깊이 우선 탐색(Depth-First Search, DFS)** 은 한 방향으로 **끝까지 파고든 뒤** 되돌아와 다른 길을 갑니다. Day 80의 백트래킹이 선택의 트리를 깊이 우선으로 돌았던 것과 같은 방식을 이번에는 **그래프**에 적용합니다.

1. DFS의 원리와 BFS와의 차이.
2. **재귀 DFS**와 **명시적 스택 DFS**를 구현하고 방문 순서를 맞춥니다.
3. **들어간 시각·나온 시각**으로 탐색 구조를 읽습니다.
4. DFS로 푸는 대표 문제들을 C, Python, Rust로 풉니다.
   - **연결 요소 세기**
   - 방향 그래프의 **사이클 찾기**
   - 선수 과목 순서를 정하는 **위상 정렬**
5. 응용으로 격자의 **섬 세기(flood fill)** 를 합니다.

## 2. 왜 DFS인가

미로에서 출구를 찾을 때 "오른손을 벽에 대고 계속 걷는" 방법이 있습니다. 막다른 길에 이르면 되돌아 나오고, 갈림길에서는 가 보지 않은 길로 들어갑니다. 한 길을 **끝까지** 가 보는 이 방식이 DFS입니다.

BFS와 DFS는 둘 다 연결된 모든 정점을 O(V + E)에 방문하지만, 어울리는 문제가 다릅니다.

| 질문                                  | 알맞은 탐색        | 이유                                       |
| ------------------------------------- | ------------------ | ------------------------------------------ |
| 가장 적은 간선으로 가는 길은?         | BFS                | 가까운 층부터 보므로 처음 도착한 길이 최단 |
| 도달할 수 있는 곳을 모두 찾아라       | 둘 다              | DFS가 코드가 짧은 경우가 많음              |
| 순환(사이클)이 있는가?                | DFS                | "지금 경로 위"를 추적하기 쉬움             |
| 의존 관계를 지키는 순서는?(위상 정렬) | DFS(또는 BFS 변형) | 끝나는 순서가 의존 순서의 반대             |
| 가능한 모든 경로·배치를 시도하라      | DFS(백트래킹)      | 경로 하나만 들고 다니면 됨                 |

## 3. 그림으로 이해하기

이 수업의 그래프입니다(이웃은 번호가 작은 것부터 봅니다). 정점 5와 6은 따로 떨어져 있습니다.

```text
        1 ──── 3 ──── 4
       /      /
      0      /               5 ──── 6
       \    /
         2
간선: 0-1, 0-2, 1-3, 2-3, 3-4, 5-6
```

0에서 DFS를 하면 이렇게 파고듭니다.

```text
0 들어감
└─ 1 들어감              (0의 첫 이웃)
   └─ 3 들어감           (1의 이웃 중 처음 보는 것)
      ├─ 2 들어감        (3의 이웃 1은 봤고, 2는 처음)
      │  (2의 이웃 0, 3은 모두 봤음 → 나옴)
      └─ 4 들어감
         (4의 이웃 3은 봤음 → 나옴)
      (3 나옴)
   (1 나옴)
(0의 두 번째 이웃 2는 이미 봤음 → 0 나옴)

방문 순서: 0 1 3 2 4        BFS였다면: 0 1 2 3 4
```

BFS라면 0의 두 이웃 1과 2를 먼저 봤을 것입니다. DFS는 1을 발견하자마자 1의 이웃으로 **더 깊이** 들어갑니다.

## 4. 천천히 풀어보기

### 4.1 재귀 DFS

```text
dfs(u):
    u를 방문 표시한다
    u의 이웃 v마다:
        v를 아직 방문하지 않았다면 dfs(v)
```

BFS와 달리 큐가 보이지 않습니다. **함수 호출 스택**이 "돌아갈 곳"을 기억해 주기 때문입니다. `dfs(v)`가 끝나면 호출 스택에서 u의 차례로 돌아와 다음 이웃을 봅니다.

### 4.2 명시적 스택 DFS

재귀는 깊이가 너무 깊어지면 호출 스택이 넘칩니다. 그래서 **스택을 직접** 쓰기도 합니다. Day 64에서 레벨 순회의 큐를 스택으로 바꾸면 깊이 우선이 된다고 했던 것이 바로 이것입니다.

```text
스택에 시작점을 넣는다
스택이 빌 때까지:
    u = 스택에서 꺼낸다(가장 최근에 넣은 것)
    이미 방문했으면 건너뛴다
    u를 방문 표시한다
    u의 이웃들을 (거꾸로) 스택에 넣는다   ← 거꾸로 넣어야 첫 이웃이 먼저 나온다
```

이 방식은 같은 정점이 스택에 **여러 번** 들어갈 수 있어서, 꺼낼 때 방문 여부를 확인합니다. 재귀 DFS와 방문 순서를 똑같이 맞추려면 이웃을 거꾸로 넣어야 합니다.

### 4.3 들어간 시각, 나온 시각

DFS 중에 정점에 **들어갈 때**와 **나올 때**(모든 이웃을 다 보고 돌아갈 때) 시계를 1씩 올려 기록해 봅시다.

```text
정점   들어감  나옴     구간
 0        1     10     [1 ─────────────────── 10]
 1        2      9       [2 ──────────────── 9]
 3        3      8         [3 ──────────── 8]
 2        4      5           [4 ─ 5]
 4        6      7                 [6 ─ 7]
```

u의 구간 안에 v의 구간이 **통째로** 들어 있으면 v는 DFS 트리에서 u의 **자손**입니다. 구간끼리 걸치는 일(일부만 겹침)은 절대 생기지 않는데, 재귀는 들어간 순서의 반대로 나오기 때문입니다(스택의 LIFO). 이 "나온 시각"이 위상 정렬의 핵심입니다.

### 4.4 방향 그래프의 사이클: 세 가지 상태

방향 그래프에서 간선을 따라가다 **출발한 곳으로 돌아올 수 있으면** 사이클이 있습니다. DFS 중에 정점을 세 상태로 나눕니다.

| 상태          | 뜻                                             |
| ------------- | ---------------------------------------------- |
| 처음(흰색)    | 아직 들어가지 않음                             |
| 탐색 중(회색) | 들어갔지만 아직 나오지 않음 = **지금 경로 위** |
| 끝남(검은색)  | 모든 자손을 보고 나옴                          |

간선 u → v를 볼 때 v가 **탐색 중**이면, v에서 출발해 u까지 왔고 다시 v로 돌아가는 길이 있다는 뜻이므로 **사이클**입니다. v가 **끝남**이면 이미 다른 길로 탐색을 마친 정점이라 사이클이 아닙니다. "방문했는가"만 보면 이 둘을 구별하지 못해 틀립니다(실습의 디버그 문제).

### 4.5 위상 정렬: 나온 순서의 반대

"변수를 배워야 조건문과 반복문을 배울 수 있다"처럼 **u를 먼저 해야 v를 할 수 있는** 관계를 간선 u → v로 그린 그래프를 생각해 봅시다. 모든 간선의 방향을 지키는 순서로 정점을 늘어놓는 것이 **위상 정렬**입니다. DFS에서 정점 u가 **나오는** 순간에는 u에서 갈 수 있는 모든 정점(u 다음에 해야 할 것들)이 이미 끝나 있습니다. 그래서 **나온 순서를 뒤집으면** 위상 순서가 됩니다. 사이클이 있으면 순서를 정할 수 없으므로, 사이클 검사를 함께 합니다. 이 사이트의 콘텐츠 검사기도 수업의 선행 관계에 사이클이 없는지 검사합니다.

## 5. C로 구현하기

C 프로그램은 재귀 DFS로 방문 과정을 들여쓰기로 보여 주고, 들어간·나온 시각을 기록합니다. 스택 DFS, 연결 요소 세기, 방향 그래프의 사이클 찾기도 함께 합니다.

```c
// 파일: dfs.c
#include <stdio.h>
#include <stdbool.h>

#define N 7
#define MAX_DEG 4

int adj[N][MAX_DEG];
int deg[N];
bool visited[N];
int timer = 0;
int enter_time[N], leave_time[N];

void add_undirected(int u, int v) {
    adj[u][deg[u]++] = v;
    adj[v][deg[v]++] = u;
}

void dfs(int u, int depth) {
    visited[u] = true;
    enter_time[u] = ++timer;
    printf("%*s%d 들어감\n", depth * 2, "", u);
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (!visited[v]) {
            dfs(v, depth + 1);              // 이웃으로 끝까지 파고든다
        }
    }
    leave_time[u] = ++timer;                // 모든 이웃을 다 본 뒤 나온다
}

// 명시적 스택으로 하는 DFS (재귀 없음)
void dfs_stack(int start) {
    bool seen[N] = {false};
    int stack[32], top = -1;
    stack[++top] = start;
    printf("스택 DFS:");
    while (top >= 0) {
        int u = stack[top--];
        if (seen[u]) continue;
        seen[u] = true;
        printf(" %d", u);
        for (int i = deg[u] - 1; i >= 0; i--) {     // 거꾸로 넣어야 작은 이웃이 먼저 나온다
            if (!seen[adj[u][i]]) stack[++top] = adj[u][i];
        }
    }
    printf("\n");
}

// 방향 그래프 사이클 찾기: 0=처음, 1=탐색 중, 2=끝남
int color[N];
int dadj[N][MAX_DEG], ddeg[N];

bool has_cycle(int u) {
    color[u] = 1;
    for (int i = 0; i < ddeg[u]; i++) {
        int v = dadj[u][i];
        if (color[v] == 1) return true;              // 탐색 중인 정점으로 돌아왔다 = 사이클
        if (color[v] == 0 && has_cycle(v)) return true;
    }
    color[u] = 2;
    return false;
}

int main(void) {
    int edges[][2] = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}, {5, 6}};
    for (int i = 0; i < 6; i++) add_undirected(edges[i][0], edges[i][1]);

    dfs(0, 0);
    for (int u = 0; u < 5; u++) {
        printf("정점 %d: 들어간 시각 %2d, 나온 시각 %2d\n", u, enter_time[u], leave_time[u]);
    }
    dfs_stack(0);

    int components = 0;
    for (int u = 0; u < N; u++) visited[u] = false;
    timer = 0;
    for (int u = 0; u < N; u++) {
        if (!visited[u]) {
            components++;
            printf("-- 연결 요소 %d --\n", components);
            dfs(u, 1);
        }
    }

    int dedges[][2] = {{0, 1}, {1, 2}, {2, 3}, {3, 1}};      // 1 → 2 → 3 → 1 사이클
    for (int i = 0; i < 4; i++) dadj[dedges[i][0]][ddeg[dedges[i][0]]++] = dedges[i][1];
    printf("방향 그래프에 사이클? %s\n", has_cycle(0) ? "있음" : "없음");
    return 0;
}
```

실행 결과:

```text
0 들어감
  1 들어감
    3 들어감
      2 들어감
      4 들어감
정점 0: 들어간 시각  1, 나온 시각 10
정점 1: 들어간 시각  2, 나온 시각  9
정점 2: 들어간 시각  4, 나온 시각  5
정점 3: 들어간 시각  3, 나온 시각  8
정점 4: 들어간 시각  6, 나온 시각  7
스택 DFS: 0 1 3 2 4
-- 연결 요소 1 --
  0 들어감
    1 들어감
      3 들어감
        2 들어감
        4 들어감
-- 연결 요소 2 --
  5 들어감
    6 들어감
방향 그래프에 사이클? 있음
```

### 코드 한 부분씩 읽기

| 코드                                                              | 설명                                                                                                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `enter_time[u] = ++timer;` / `leave_time[u] = ++timer;`           | 4.3절의 시계입니다. 들어갈 때와 모든 이웃을 본 뒤 나올 때 각각 기록합니다.                                                          |
| `printf("%*s%d 들어감\n", depth * 2, "", u);`                     | 재귀 깊이만큼 들여써서 DFS 트리를 보여 줍니다. 2가 3의 자식으로 나온 것은 3에서 2로 들어갔기 때문입니다(0에서 2로 간 것이 아님).    |
| `for (int i = deg[u] - 1; i >= 0; i--)`                           | 스택 DFS에서 이웃을 **거꾸로** 넣습니다. 스택은 마지막에 넣은 것이 먼저 나오므로, 첫 이웃이 먼저 나와 재귀 DFS와 순서가 같아집니다. |
| `if (seen[u]) continue;`                                          | 같은 정점이 여러 경로로 스택에 들어갈 수 있어, 꺼낼 때 다시 확인합니다.                                                             |
| `for (int u = 0; u < N; u++) if (!visited[u]) { ... dfs(u, 1); }` | 방문하지 않은 정점에서 DFS를 다시 시작해 연결 요소를 셉니다. Day 69의 BFS 버전과 같은 방법입니다.                                   |
| `int color[N];` `color[u] = 1;` ... `color[u] = 2;`               | 4.4절의 세 상태입니다. 들어갈 때 1(탐색 중), 나올 때 2(끝남)로 바꿉니다.                                                            |
| `if (color[v] == 1) return true;`                                 | 지금 경로 위의 정점으로 돌아가는 간선 = 사이클입니다. 1 → 2 → 3 → 1에서 3의 이웃 1이 탐색 중이라 사이클을 찾았습니다.               |

## 6. Python으로 구현하기

Python 버전은 재귀 DFS와 스택 DFS의 순서가 같은지 확인하고, 수업의 선수 관계 그래프를 **위상 정렬**합니다. 사이클을 일부러 넣으면 `None`을 돌려줍니다.

```python
# 파일: dfs.py
def dfs_recursive(adj, start):
    order, seen = [], set()

    def visit(u):
        seen.add(u)
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                visit(v)

    visit(start)
    return order


def dfs_iterative(adj, start):
    order, seen, stack = [], set(), [start]
    while stack:
        u = stack.pop()                     # 큐의 popleft 대신 스택의 pop
        if u in seen:
            continue
        seen.add(u)
        order.append(u)
        stack.extend(reversed(adj[u]))      # 작은 이웃이 먼저 나오도록 거꾸로
    return order


def topological_order(graph):
    """선수 과목 → 과목 방향 그래프를 들을 순서로 나열한다. 사이클이면 None."""
    state, order = {}, []                   # state: 1 = 탐색 중, 2 = 끝남

    def visit(u):
        state[u] = 1
        for v in graph.get(u, []):
            if state.get(v) == 1:
                return False                # 사이클
            if v not in state and not visit(v):
                return False
        state[u] = 2
        order.append(u)                     # 모든 후속 과목을 끝낸 뒤 기록
        return True

    for u in graph:
        if u not in state and not visit(u):
            return None
    return order[::-1]                      # 끝난 순서를 뒤집으면 위상 순서


adj = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print("재귀 DFS:", dfs_recursive(adj, 0))
print("스택 DFS:", dfs_iterative(adj, 0))

courses = {
    "변수": ["조건문", "반복문"],
    "조건문": ["함수"],
    "반복문": ["함수", "배열"],
    "함수": ["재귀"],
    "배열": ["정렬"],
    "재귀": ["정렬"],
    "정렬": [],
}
print("수강 순서:", topological_order(courses))
courses["정렬"] = ["변수"]                  # 정렬을 들어야 변수를 들을 수 있다? 사이클!
print("사이클이 있으면:", topological_order(courses))
```

실행 결과:

```text
재귀 DFS: [0, 1, 3, 2, 4]
스택 DFS: [0, 1, 3, 2, 4]
수강 순서: ['변수', '반복문', '배열', '조건문', '함수', '재귀', '정렬']
사이클이 있으면: None
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                                                                        |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stack.extend(reversed(adj[u]))`                   | 이웃을 거꾸로 스택에 넣습니다. `reversed`는 리스트를 뒤집은 반복자를 돌려줍니다.                                                                            |
| `state, order = {}, []`                            | 사전에 없음 = 처음, 1 = 탐색 중, 2 = 끝남입니다.                                                                                                            |
| `if state.get(v) == 1: return False`               | 탐색 중인 과목으로 되돌아가는 간선이 있으면 사이클이라 순서를 정할 수 없습니다.                                                                             |
| `if v not in state and not visit(v): return False` | 처음 보는 과목이면 들어가고, 그 안에서 사이클이 발견되면 즉시 전달합니다.                                                                                   |
| `order.append(u)`                                  | u의 모든 후속 과목을 **끝낸 뒤** 기록합니다. 가장 먼저 기록되는 것은 '정렬'처럼 아무것도 뒤따르지 않는 과목입니다.                                          |
| `return order[::-1]`                               | 나온 순서를 뒤집어 위상 순서를 만듭니다. '변수'가 맨 앞, '정렬'이 맨 뒤입니다. 모든 간선(예: 반복문 → 배열, 재귀 → 정렬)의 방향이 지켜지는지 확인해 보세요. |
| `for u in graph: if u not in state ...`            | 시작점이 하나가 아닐 수 있으므로 모든 정점에서 시도합니다. 사전은 넣은 순서를 유지하므로 결과도 항상 같습니다.                                              |

위상 순서는 **하나로 정해지지 않을** 수 있습니다. '조건문'과 '반복문'은 서로 의존하지 않으므로 어느 쪽을 먼저 들어도 됩니다. DFS는 그중 하나를 돌려줍니다.

## 7. Rust로 구현하기

Rust 버전은 세 상태를 **enum**으로 만들고, 사이클을 발견하면 `Err(정점)`을 돌려줍니다. `?` 연산자 덕분에 깊은 재귀 어디에서 사이클을 찾든 바로 바깥까지 전달됩니다.

```rust
// 파일: dfs.rs
#[derive(Clone, Copy, PartialEq)]
enum State {
    New,
    Active,             // 지금 탐색 중(재귀 스택 위에 있음)
    Done,
}

fn visit(u: usize, g: &[Vec<usize>], state: &mut [State], order: &mut Vec<usize>) -> Result<(), usize> {
    state[u] = State::Active;
    for &v in &g[u] {
        match state[v] {
            State::Active => return Err(v),             // 사이클을 만드는 정점
            State::New => visit(v, g, state, order)?,
            State::Done => {}
        }
    }
    state[u] = State::Done;
    order.push(u);
    Ok(())
}

fn topo_sort(g: &[Vec<usize>]) -> Result<Vec<usize>, usize> {
    let mut state = vec![State::New; g.len()];
    let mut order = Vec::new();
    for u in 0..g.len() {
        if state[u] == State::New {
            visit(u, g, &mut state, &mut order)?;
        }
    }
    order.reverse();
    Ok(order)
}

fn main() {
    let names = ["변수", "조건문", "반복문", "함수", "배열", "재귀", "정렬"];
    let mut g = vec![vec![1, 2], vec![3], vec![3, 4], vec![5], vec![6], vec![6], vec![]];
    match topo_sort(&g) {
        Ok(order) => {
            let named: Vec<&str> = order.iter().map(|&i| names[i]).collect();
            println!("수강 순서: {:?}", named);
        }
        Err(v) => println!("사이클: {}", names[v]),
    }

    g[6].push(0);                                       // 정렬 → 변수: 사이클
    match topo_sort(&g) {
        Ok(order) => println!("수강 순서: {:?}", order),
        Err(v) => println!("사이클 발견: '{}'(으)로 되돌아옴", names[v]),
    }
}
```

실행 결과:

```text
수강 순서: ["변수", "반복문", "배열", "조건문", "함수", "재귀", "정렬"]
사이클 발견: '변수'(으)로 되돌아옴
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `enum State { New, Active, Done }`          | C의 0, 1, 2 대신 이름이 있는 상태입니다. 잘못된 값(3 같은)을 넣을 수 없습니다.                                                          |
| `fn visit(...) -> Result<(), usize>`        | 성공하면 `Ok(())`, 사이클이면 `Err(되돌아간 정점)`입니다. 결과를 Result로 표현하면 "실패할 수 있는 탐색"이 타입에 드러납니다.           |
| `State::Active => return Err(v),`           | 4.4절의 사이클 조건입니다. `match`가 세 상태를 모두 처리하도록 강제합니다.                                                              |
| `State::New => visit(v, g, state, order)?,` | 재귀 호출의 결과가 `Err`면 `?`가 그 자리에서 함수를 끝내고 그대로 돌려줍니다. C의 `if (has_cycle(v)) return true;`와 같은 일입니다.     |
| `g[6].push(0);`                             | '정렬 → 변수' 간선을 더해 사이클을 만들었습니다. 변수 → … → 정렬 → 변수로 돌아오므로, 정렬을 탐색하다 탐색 중인 '변수'를 다시 만납니다. |
| `order.reverse();`                          | 나온 순서를 제자리에서 뒤집습니다.                                                                                                      |

## 8. 실행 추적

Python의 위상 정렬을 상태 변화로 따라갑니다(탐색 중 = ◐, 끝남 = ●).

| 단계 | 일어난 일                               | 상태 변화 | order(나온 순서)                             |
| ---: | --------------------------------------- | --------- | -------------------------------------------- |
|    1 | 변수 들어감                             | 변수 ◐    |                                              |
|    2 | 조건문 → 함수 → 재귀 → 정렬 들어감      | 모두 ◐    |                                              |
|    3 | 정렬 나옴(이웃 없음)                    | 정렬 ●    | 정렬                                         |
|    4 | 재귀, 함수, 조건문 차례로 나옴          | ●         | 정렬, 재귀, 함수, 조건문                     |
|    5 | 변수의 둘째 이웃 반복문 들어감          | 반복문 ◐  |                                              |
|    6 | 반복문의 이웃 함수는 ● → 건너뜀         |           |                                              |
|    7 | 배열 들어감 → 이웃 정렬은 ● → 배열 나옴 | 배열 ●    | …, 배열                                      |
|    8 | 반복문 나옴, 변수 나옴                  | ●         | …, 배열, 반복문, 변수                        |
| 결과 | order를 뒤집음                          |           | 변수, 반복문, 배열, 조건문, 함수, 재귀, 정렬 |

6단계에서 '함수'를 다시 만났지만 이미 끝난(●) 정점이라 사이클이 아닙니다. 만약 탐색 중(◐)인 정점을 만났다면 사이클이었을 것입니다.

## 9. 다른 예제로 다시 이해하기

격자 지도에서 **섬의 개수**를 세 봅시다. `#`은 땅, `.`은 바다이고, 상하좌우로 붙은 땅은 한 섬입니다. 격자의 칸을 정점으로, 붙어 있는 땅끼리를 간선으로 보면 섬 세기는 **연결 요소 세기**입니다. 땅을 만날 때마다 섬 하나를 발견한 것이고, 그 칸에서 DFS로 이어진 땅을 모두 **바다로 칠해 버리면** 같은 섬을 다시 세지 않습니다. 방문 표시용 배열을 따로 두지 않고 지도 자체에 표시하는 이 방법을 **칠하기(flood fill)** 라고 하며, 그림판의 "페인트 통" 도구가 같은 알고리즘입니다.

```python
# 파일: islands.py
import sys

sys.setrecursionlimit(10_000)

MAP = [
    "##...#",
    "#..###",
    "...#..",
    "##....",
    "##..##",
]


def count_islands(rows):
    grid = [list(r) for r in rows]
    h, w = len(grid), len(grid[0])

    def fill(r, c):
        if not (0 <= r < h and 0 <= c < w) or grid[r][c] != "#":
            return 0
        grid[r][c] = "."                    # 칠해서 다시 세지 않는다
        return 1 + fill(r - 1, c) + fill(r + 1, c) + fill(r, c - 1) + fill(r, c + 1)

    sizes = []
    for r in range(h):
        for c in range(w):
            if grid[r][c] == "#":
                sizes.append(fill(r, c))
    return sizes


sizes = count_islands(MAP)
print(f"섬 {len(sizes)}개, 크기 {sizes}, 가장 큰 섬 {max(sizes)}칸")
print("모두 바다:", count_islands(["....", "...."]))
```

실행 결과:

```text
섬 4개, 크기 [3, 5, 4, 2], 가장 큰 섬 5칸
모두 바다: []
```

`sys.setrecursionlimit`으로 재귀 한도를 늘렸지만, 격자가 아주 크면 이 방법도 위험합니다. 그럴 때는 스택 DFS나 BFS로 칠합니다. Rust로 스택을 쓰는 칠하기를 만들면 재귀 깊이 걱정이 없습니다.

```rust
// 파일: islands.rs
fn islands(map: &[&str]) -> Vec<usize> {
    let mut grid: Vec<Vec<u8>> = map.iter().map(|r| r.bytes().collect()).collect();
    let (h, w) = (grid.len(), grid[0].len());
    let mut sizes = Vec::new();
    for sr in 0..h {
        for sc in 0..w {
            if grid[sr][sc] != b'#' {
                continue;
            }
            let mut stack = vec![(sr, sc)];
            grid[sr][sc] = b'.';
            let mut size = 0;
            while let Some((r, c)) = stack.pop() {
                size += 1;
                let neighbors = [(r.wrapping_sub(1), c), (r + 1, c), (r, c.wrapping_sub(1)), (r, c + 1)];
                for (nr, nc) in neighbors {
                    if nr < h && nc < w && grid[nr][nc] == b'#' {
                        grid[nr][nc] = b'.';            // 넣을 때 칠한다
                        stack.push((nr, nc));
                    }
                }
            }
            sizes.push(size);
        }
    }
    sizes
}

fn main() {
    let map = ["##...#", "#..###", "...#..", "##....", "##..##"];
    let sizes = islands(&map);
    println!("섬 {}개, 크기 {:?}", sizes.len(), sizes);
}
```

실행 결과:

```text
섬 4개, 크기 [3, 5, 4, 2]
```

`r.wrapping_sub(1)`은 r이 0이면 usize의 최댓값이 되어 `nr < h` 검사에서 자연스럽게 걸러집니다. 음수 좌표를 따로 처리하지 않아도 되는 Rust식 요령입니다.

## 10. 시간·공간 복잡도

| 작업                    | 시간     | 추가 공간                            |
| ----------------------- | -------- | ------------------------------------ |
| DFS (인접 목록)         | O(V + E) | O(V) 방문 표시 + 재귀/스택 깊이 O(V) |
| 연결 요소 세기          | O(V + E) | O(V)                                 |
| 방향 그래프 사이클 찾기 | O(V + E) | O(V)                                 |
| 위상 정렬(DFS)          | O(V + E) | O(V)                                 |
| 격자 칠하기(R × C)      | O(R × C) | O(R × C) 최악의 재귀/스택 깊이       |

BFS와 시간 복잡도는 같습니다. 차이는 **추가 공간의 모양**입니다. BFS의 큐는 "가장 넓은 층"만큼, DFS의 스택은 "가장 깊은 경로"만큼 커집니다. 길고 좁은 그래프는 BFS가, 넓고 얕은 그래프는 DFS가 메모리를 덜 씁니다.

## 11. 세 언어 비교

| 관점        | C                       | Python                                    | Rust                                   |
| ----------- | ----------------------- | ----------------------------------------- | -------------------------------------- |
| 재귀 DFS    | 전역 배열 + 재귀 함수   | 중첩 함수(클로저)                         | `&`/`&mut` 매개변수를 넘기는 재귀 함수 |
| 스택 DFS    | 배열 + top              | `list`의 `append`/`pop`                   | `Vec`의 `push`/`pop`, `while let`      |
| 상태 표현   | `int color[]` (0, 1, 2) | 사전 값 1, 2 또는 없음                    | `enum State { New, Active, Done }`     |
| 사이클 전달 | `bool` 반환을 한 단계씩 | `False`를 한 단계씩                       | `Result`와 `?`로 한 번에               |
| 재귀 한도   | 스택 크기(보통 수 MB)   | 기본 약 1,000, `setrecursionlimit`로 조정 | 스택 크기, 넘치면 프로그램 종료        |
| 격자 경계   | `0 <= r && r < h`       | `0 <= r < h` 연쇄 비교                    | `wrapping_sub` + `< h` 검사            |

## 12. 자주 하는 실수

### 실수 1: 방문 표시 없이 DFS를 한다

무방향 그래프에서 u → v로 간 뒤 v의 이웃에 u가 있으므로, 방문 표시가 없으면 u와 v 사이를 끝없이 오갑니다. 재귀가 끝나지 않아 호출 스택이 넘칩니다.

### 실수 2: 방향 그래프에서 방문 여부만으로 사이클을 판단한다

실습의 디버그 문제입니다. 두 경로가 한 정점에서 만나는 것(다이아몬드 모양)을 사이클로 착각합니다. **탐색 중**과 **끝남**을 구별하세요.

### 실수 3: 재귀 깊이 한도를 넘는다

```python
# 파일: deep_dfs.py (실행 오류: RecursionError)
n = 5000
adj = {i: [i + 1] for i in range(n - 1)}      # 0 → 1 → 2 → … 긴 사슬
adj[n - 1] = []
seen = set()


def dfs(u):
    seen.add(u)
    for v in adj[u]:
        if v not in seen:
            dfs(v)


dfs(0)
```

```text
RecursionError: maximum recursion depth exceeded
```

정점이 한 줄로 5,000개 이어지면 재귀가 5,000번 쌓입니다. 큰 그래프에서는 **명시적 스택**을 쓰세요(9절 Rust 코드).

### 실수 4: 스택 DFS에서 이웃을 넣는 순서를 생각하지 않는다

스택은 마지막에 넣은 것이 먼저 나오므로, 이웃을 순서대로 넣으면 **마지막 이웃부터** 방문합니다. 결과가 틀린 것은 아니지만 재귀 DFS와 순서가 달라서 디버깅할 때 헷갈립니다. 순서를 맞추려면 거꾸로 넣으세요.

### 실수 5: 위상 정렬에서 뒤집기를 잊는다

나온 순서를 그대로 쓰면 "정렬 → … → 변수"처럼 **거꾸로 된** 순서가 됩니다. DFS의 나온 순서는 "의존하는 것이 먼저 끝나는" 순서라서 뒤집어야 합니다.

## 13. Q&A

**Q. 위상 정렬을 BFS로도 할 수 있나요?**

A. 네, **칸 알고리즘(Kahn's algorithm)** 이라고 합니다. 들어오는 간선이 없는(진입 차수 0) 정점을 큐에 넣고, 하나 꺼낼 때마다 그 정점에서 나가는 간선을 지워 진입 차수가 0이 된 정점을 새로 넣습니다. 모든 정점을 꺼내지 못하면 사이클이 있는 것입니다. Day 68의 도전 문제("선수 과목이 없는 과목")가 이 알고리즘의 첫 단계였습니다.

**Q. DFS로 최단 경로를 찾을 수 있나요?**

A. 가중치가 없는 그래프에서도 DFS가 먼저 찾은 경로는 최단이 아닐 수 있습니다. 모든 경로를 백트래킹으로 시도하며 최솟값을 고를 수는 있지만 지수 시간이 됩니다. 최단 경로는 BFS(가중치 없음)나 다익스트라(Day 82, 가중치 있음)를 쓰세요.

**Q. 무방향 그래프의 사이클은 어떻게 찾나요?**

A. DFS 중에 방문한 이웃을 다시 만났는데 그것이 **직전에 온 부모**가 아니라면 사이클입니다. 무방향 간선 u - v는 양쪽 목록에 모두 있으므로, 부모를 빼지 않으면 모든 간선을 사이클로 오해합니다.

**Q. 들어간 시각·나온 시각은 어디에 쓰나요?**

A. 트리에서 "u가 v의 조상인가?"를 O(1)에 답하거나(구간 포함 관계), 강하게 연결된 요소(서로 오갈 수 있는 정점 무리)를 찾는 알고리즘, 그래프에서 끊으면 연결이 끊어지는 다리와 단절점을 찾는 알고리즘에 쓰입니다.

## 14. 핵심 요약

- DFS는 **한 이웃으로 끝까지 파고든 뒤 되돌아와** 다음 이웃을 봅니다. 재귀(호출 스택) 또는 명시적 스택으로 구현합니다.
- 스택 DFS는 이웃을 **거꾸로** 넣어야 재귀 DFS와 순서가 같고, 꺼낼 때 방문 여부를 확인합니다.
- **들어간 시각·나온 시각** 구간은 서로 포함되거나 떨어져 있을 뿐 걸치지 않습니다. 포함되면 조상-자손 관계입니다.
- 방향 그래프의 사이클은 **탐색 중**인 정점으로 돌아가는 간선이 있을 때입니다. 방문 여부만으로는 판단할 수 없습니다.
- **위상 정렬**은 DFS로 **나온 순서를 뒤집은** 것입니다. 사이클이 있으면 존재하지 않습니다.
- 격자의 섬 세기처럼 연결된 영역을 칠하는 문제도 DFS로 풉니다. 큰 입력에서는 재귀 깊이에 주의하세요.

## 15. 도전 문제

1. **(C)** 칸 알고리즘(BFS 위상 정렬)을 구현하고, 6절의 수강 순서 그래프로 결과를 DFS 버전과 비교해 보세요. 두 결과가 다를 수 있는 이유를 설명하세요.
2. **(Python)** 무방향 그래프에서 부모를 제외하는 방법으로 사이클이 있는지 검사하는 함수를 만드세요.
3. **(Rust)** 미로 격자에서 출발점과 도착점이 **연결되어 있는지**를 스택 DFS로 확인하고, 연결되어 있다면 DFS가 찾은 경로의 길이와 Day 69 BFS의 최단 경로 길이를 비교해 보세요.
4. **(세 언어)** 이 사이트의 수업 선행 관계(Day 1 → Day 2 → …)처럼 의존 관계가 있는 작업 목록을 만들어, 위상 정렬로 작업 순서를 출력하는 프로그램을 작성하세요. 사이클이 있으면 사이클에 포함된 작업을 알려 주세요.
