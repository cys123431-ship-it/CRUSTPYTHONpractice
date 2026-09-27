---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-68-graph
courseId: crp-92
phaseId: phase-06
dayNumber: 68
date: "2026-12-07"
title: 그래프 — 정점과 간선으로 관계 표현하기
summary: 정점, 간선, 방향, 가중치, 차수 같은 그래프 용어를 익히고, 같은 그래프를 간선 목록·인접 행렬·인접 목록 세 가지로 저장하며 장단점을 비교합니다. C 배열, Python 리스트와 사전, Rust Vec<Vec>과 HashMap으로 친구 관계, 팔로우 관계, 도로망을 표현하고 공통 친구로 친구를 추천합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-67-hash-map]
learningObjectives:
  - 정점, 간선, 무방향·방향, 가중치, 차수, 경로, 사이클을 그림에서 찾아 설명한다.
  - 같은 그래프를 간선 목록, 인접 행렬, 인접 목록으로 바꿔 그린다.
  - 간선 확인, 이웃 나열, 공간 사용량을 기준으로 인접 행렬과 인접 목록을 비교한다.
  - 무방향 간선은 양쪽에 모두 기록해야 한다는 것을 알고, 차수 합이 간선 수의 두 배임을 확인한다.
  - 방향 그래프를 뒤집어 들어오는 간선(팔로워)을 구하고, 공통 이웃 수로 추천 목록을 만든다.
concepts:
  [
    graph,
    vertex,
    edge,
    directed,
    undirected,
    weighted,
    degree,
    adjacency matrix,
    adjacency list,
    edge list,
  ]
runnerMode: python
playgroundSource: |
  # 파일: graph.py — 간선을 추가하거나 지워 보세요.
  names = ["민수", "지아", "하준", "서연", "도윤"]
  edges = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]

  adj = [[] for _ in names]
  for u, v in edges:
      adj[u].append(v)
      adj[v].append(u)

  for u, nbrs in enumerate(adj):
      print(names[u], "→", [names[v] for v in nbrs])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day68-predict-py
    title: 간선 목록에서 차수 구하기
    kind: predict
    objective: 무방향 간선 하나가 양 끝 정점의 차수를 하나씩 늘린다는 것을 확인한다.
    prompt: 출력될 리스트를 예측하세요.
    starter: |-
      edges = [(0, 1), (1, 2), (2, 0), (2, 3)]
      degree = [0] * 4
      for u, v in edges:
          degree[u] += 1
          degree[v] += 1
      print(degree)
    answer: "[2, 2, 3, 1]"
    hint: "간선 (2, 0)은 정점 2와 0의 차수를 모두 올립니다. 정점 2는 간선 세 개에 나옵니다."
    explanation: "0은 (0,1), (2,0) → 2, 1은 (0,1), (1,2) → 2, 2는 (1,2), (2,0), (2,3) → 3, 3은 (2,3) → 1입니다. 합은 8 = 간선 4개 × 2입니다."
    commonMistakes:
      - "앞쪽 정점(u)의 차수만 올려 [1, 1, 2, 0]으로 적음"
      - "간선 수를 차수 합으로 착각함"
    language: python
    verification: run
  - id: ex-day68-predict-c
    title: 인접 행렬 읽기
    kind: predict
    objective: 행렬의 행 합이 차수이고, 방향 그래프에서는 행과 열의 합이 다르다는 것을 확인한다.
    prompt: 출력될 네 숫자를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int m[3][3] = {
              {0, 1, 1},
              {0, 0, 1},
              {1, 0, 0},
          };
          int out0 = 0, in0 = 0, out2 = 0, total = 0;
          for (int j = 0; j < 3; j++) out0 += m[0][j];
          for (int i = 0; i < 3; i++) in0 += m[i][0];
          for (int j = 0; j < 3; j++) out2 += m[2][j];
          for (int i = 0; i < 3; i++)
              for (int j = 0; j < 3; j++) total += m[i][j];
          printf("%d %d %d %d\n", out0, in0, out2, total);
          return 0;
      }
    answer: "2 1 1 4"
    hint: "m[i][j] == 1은 i에서 j로 가는 간선입니다. 0번 행의 합은 0에서 나가는 간선 수, 0번 열의 합은 0으로 들어오는 간선 수입니다."
    explanation: "0 → 1, 0 → 2이므로 나가는 간선 2개, 2 → 0만 0으로 들어오므로 들어오는 간선 1개입니다. 2에서 나가는 간선은 2 → 0 하나이고, 행렬의 1은 모두 4개라 간선도 4개입니다. 방향 그래프의 행렬은 대칭이 아닙니다."
    commonMistakes:
      - "행과 열을 바꿔 읽어 나가는 간선과 들어오는 간선을 뒤바꿈"
      - "무방향처럼 전체 합을 2로 나눠 간선 수를 2로 적음"
    language: c
    verification: run
  - id: ex-day68-fill
    title: Rust 무방향 간선 추가 채우기
    kind: fill
    objective: 무방향 간선을 양쪽 인접 목록에 모두 기록한다.
    prompt: "add_edge의 빈칸에 반대 방향 기록을 채우세요."
    starter: |-
      fn add_edge(adj: &mut Vec<Vec<usize>>, u: usize, v: usize) {
          adj[u].push(v);
          _____;
      }

      fn main() {
          let mut adj = vec![Vec::new(); 4];
          for (u, v) in [(0, 1), (0, 2), (2, 3)] {
              add_edge(&mut adj, u, v);
          }
          println!("{:?} {:?}", adj, adj.iter().map(|a| a.len()).collect::<Vec<_>>());
      }
    answer: |-
      fn add_edge(adj: &mut Vec<Vec<usize>>, u: usize, v: usize) {
          adj[u].push(v);
          adj[v].push(u);
      }

      fn main() {
          let mut adj = vec![Vec::new(); 4];
          for (u, v) in [(0, 1), (0, 2), (2, 3)] {
              add_edge(&mut adj, u, v);
          }
          println!("{:?} {:?}", adj, adj.iter().map(|a| a.len()).collect::<Vec<_>>());
      }
    output: "[[1, 2], [0], [0, 3], [2]] [2, 1, 2, 1]"
    hint: "u의 이웃 목록에 v를 넣었다면, v의 이웃 목록에도 u를 넣어야 무방향이 됩니다."
    explanation: "빈칸을 채우면 1의 목록에 0이, 3의 목록에 2가 생깁니다. 한쪽만 기록하면 방향 그래프가 되어 1에서 0으로 갈 수 없게 됩니다. vec![Vec::new(); 4]는 빈 Vec을 네 번 복제해 서로 다른 목록 네 개를 만듭니다."
    commonMistakes:
      - "adj[u].push(u)처럼 자기 자신을 넣음"
      - "한쪽만 기록해 차수가 [2, 0, 1, 0]이 됨"
    language: rust
    verification: run
  - id: ex-day68-modify
    title: Python 인접 목록을 인접 행렬로 바꾸기
    kind: modify
    objective: 두 표현 사이를 변환하고 대칭성으로 무방향 여부를 검사한다.
    prompt: "to_matrix(adj)를 완성하고, is_undirected(matrix)가 모든 i, j에서 matrix[i][j] == matrix[j][i]인지 검사하게 하세요. 두 그래프에 대해 True False가 출력되어야 합니다."
    starter: |-
      def to_matrix(adj):
          n = len(adj)
          return [[0] * n for _ in range(n)]


      def is_undirected(matrix):
          return True


      friends = [[1, 2], [0, 2], [0, 1]]
      follows = [[1], [2], []]
      print(is_undirected(to_matrix(friends)), is_undirected(to_matrix(follows)))
    answer: |-
      def to_matrix(adj):
          n = len(adj)
          matrix = [[0] * n for _ in range(n)]
          for u, nbrs in enumerate(adj):
              for v in nbrs:
                  matrix[u][v] = 1
          return matrix


      def is_undirected(matrix):
          n = len(matrix)
          return all(matrix[i][j] == matrix[j][i] for i in range(n) for j in range(n))


      friends = [[1, 2], [0, 2], [0, 1]]
      follows = [[1], [2], []]
      print(is_undirected(to_matrix(friends)), is_undirected(to_matrix(follows)))
      print(to_matrix(follows))
    output: |-
      True False
      [[0, 1, 0], [0, 0, 1], [0, 0, 0]]
    hint: "인접 목록의 u번 목록에 v가 있으면 행렬의 [u][v]를 1로 만듭니다. 무방향 그래프의 행렬은 대각선을 기준으로 대칭입니다."
    explanation: "친구 관계는 양쪽 목록에 모두 기록되어 있어 행렬이 대칭입니다. 팔로우 관계는 0 → 1은 있지만 1 → 0이 없어 matrix[0][1]과 matrix[1][0]이 달라 False입니다."
    commonMistakes:
      - "[[0] * n] * n으로 행렬을 만들어 모든 행이 같은 리스트가 됨"
      - "matrix[v][u]까지 1로 만들어 방향 그래프를 무방향으로 바꿔 버림"
    language: python
    verification: run
  - id: ex-day68-debug
    title: C 무방향 그래프의 한쪽 기록 버그 고치기
    kind: debug
    objective: 간선을 한 방향만 기록하면 차수와 이웃 목록이 틀린다는 것을 확인한다.
    prompt: "add_edge가 u의 목록에만 v를 넣습니다. 무방향 그래프가 되도록 고쳐서 차수가 2 2 2 0, 차수 합이 6이 되게 하세요."
    starter: |-
      #include <stdio.h>

      #define N 4

      int nbr[N][N];
      int deg[N];

      void add_edge(int u, int v) {
          nbr[u][deg[u]++] = v;
      }

      int main(void) {
          add_edge(0, 1);
          add_edge(1, 2);
          add_edge(2, 0);
          int sum = 0;
          for (int u = 0; u < N; u++) {
              printf("%d ", deg[u]);
              sum += deg[u];
          }
          printf("합=%d\n", sum);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      #define N 4

      int nbr[N][N];
      int deg[N];

      void add_edge(int u, int v) {
          nbr[u][deg[u]++] = v;
          nbr[v][deg[v]++] = u;
      }

      int main(void) {
          add_edge(0, 1);
          add_edge(1, 2);
          add_edge(2, 0);
          int sum = 0;
          for (int u = 0; u < N; u++) {
              printf("%d ", deg[u]);
              sum += deg[u];
          }
          printf("합=%d\n", sum);
          return 0;
      }
    output: "2 2 2 0 합=6"
    starterOutput: "1 1 1 0 합=3"
    hint: "무방향 간선 하나는 두 정점 모두의 이웃입니다. 차수 합은 간선 수의 두 배여야 합니다(간선 3개 → 6)."
    explanation: "원래 코드는 1 1 1 0 합=3을 출력합니다. 차수 합이 간선 수와 같다면 한쪽 방향만 기록했다는 신호입니다. 무방향이면 반드시 간선 수 × 2입니다. 이 성질(악수 보조정리)은 그래프 코드를 검사할 때 유용합니다."
    commonMistakes:
      - "nbr[v][deg[u]++] = u처럼 다른 정점의 차수 변수를 써서 칸이 어긋남"
      - "main에서 add_edge(1, 0)도 호출해 같은 간선을 두 번 넣음"
    language: c
    verification: run
  - id: ex-day68-independent
    title: Rust로 팔로워가 가장 많은 사람 찾기
    kind: independent
    objective: 방향 간선 목록에서 들어오는 간선 수(진입 차수)를 센다.
    prompt: "(팔로우하는 사람, 팔로우받는 사람) 목록에서 사람마다 팔로워 수를 세고, 팔로워가 가장 많은 사람과 그 수를 출력하세요. 동점이면 이름이 앞서는 사람입니다. 아래 입력이면 지아 3이 출력되어야 합니다."
    starter: |-
      fn main() {
          let follows = [("민수", "지아"), ("하준", "지아"), ("서연", "지아"), ("민수", "하준"), ("지아", "하준"), ("하준", "민수")];
          println!("{}", follows.len());
      }
    answer: |-
      use std::collections::HashMap;

      fn main() {
          let follows = [("민수", "지아"), ("하준", "지아"), ("서연", "지아"), ("민수", "하준"), ("지아", "하준"), ("하준", "민수")];
          let mut in_degree: HashMap<&str, usize> = HashMap::new();
          for (_, to) in follows {
              *in_degree.entry(to).or_insert(0) += 1;
          }
          let mut ranking: Vec<(&str, usize)> = in_degree.into_iter().collect();
          ranking.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));
          let (name, count) = ranking[0];
          println!("{name} {count}");
      }
    output: "지아 3"
    hint: "팔로워 수는 그 사람에게 '들어오는' 간선의 수입니다. 튜플의 두 번째 값만 세면 됩니다. 정렬은 수의 내림차순, 같으면 이름의 오름차순입니다."
    explanation: "지아에게 들어오는 간선은 3개, 하준은 2개, 민수는 1개입니다. sort_by에서 b.1.cmp(&a.1)은 내림차순, then(...)은 동점일 때의 두 번째 기준입니다. HashMap은 순서가 없으므로 결과를 정할 때는 정렬 기준을 분명히 해야 합니다."
    commonMistakes:
      - "튜플의 첫 번째 값(팔로우하는 사람)을 세어 팔로잉 수를 구함"
      - "정렬 없이 HashMap을 순회해 실행할 때마다 동점 결과가 달라짐"
    language: rust
    verification: run
quiz:
  - id: quiz-day68-01
    question: 무방향 그래프에 간선이 7개 있습니다. 모든 정점의 차수를 더하면?
    choices: ["7", "14", "49", "정점 수에 따라 다르다"]
    answerIndex: 1
    explanation: 간선 하나는 양 끝 정점의 차수를 하나씩 올리므로 차수 합은 항상 간선 수 × 2입니다(악수 보조정리).
  - id: quiz-day68-02
    question: 정점이 10,000개이고 각 정점의 이웃이 평균 5명인 친구 관계를 저장할 때 알맞은 표현은?
    choices:
      - 인접 행렬 (10,000 × 10,000 칸)
      - 인접 목록
      - 둘은 메모리가 같다
      - 정렬된 배열
    answerIndex: 1
    explanation: 인접 행렬은 간선이 적어도 1억 칸이 필요합니다. 인접 목록은 정점 수 + 간선 수 × 2 정도, 즉 약 11만 칸이면 됩니다. 간선이 적은 '희소 그래프'에는 인접 목록이 알맞습니다.
  - id: quiz-day68-03
    question: 인접 행렬이 인접 목록보다 빠른 연산은?
    choices:
      - 정점 u의 모든 이웃 나열하기
      - u와 v 사이에 간선이 있는지 확인하기
      - 모든 간선 순회하기
      - 메모리 적게 쓰기
    answerIndex: 1
    explanation: 행렬은 matrix[u][v] 한 칸만 보면 되므로 O(1)입니다. 인접 목록은 u의 이웃을 훑어야 하므로 O(차수)입니다. 반대로 이웃 나열은 행렬이 O(V), 목록이 O(차수)입니다.
  - id: quiz-day68-04
    question: 방향 그래프에서 A → B 간선이 있습니다. 옳은 설명은?
    choices:
      - B에서 A로도 이동할 수 있다
      - A의 진출 차수와 B의 진입 차수가 1씩 늘어난다
      - A와 B의 진입 차수가 1씩 늘어난다
      - 인접 행렬의 [B][A]가 1이다
    answerIndex: 1
    explanation: 방향 간선은 한쪽으로만 갑니다. A에서 나가는 간선(진출)이고 B로 들어오는 간선(진입)입니다. 행렬에서는 [A][B]가 1이고 [B][A]는 0입니다.
  - id: quiz-day68-05
    question: 도시 사이의 이동 시간처럼 간선마다 숫자가 붙은 그래프를 무엇이라고 하나요?
    choices: ["완전 그래프", "가중치 그래프", "트리", "이분 그래프"]
    answerIndex: 1
    explanation: 간선에 비용·거리·시간 같은 값이 붙으면 가중치 그래프입니다. 인접 목록에 (이웃, 가중치) 쌍을 저장하며, Day 82의 최단 경로 알고리즘이 이 그래프를 씁니다.
---

## 1. 오늘 배울 내용

트리는 부모-자식이라는 **한 방향의 계층**이었습니다. 하지만 세상의 관계는 계층만 있지 않습니다. 친구 관계에는 윗사람이 없고, 도로망에는 되돌아오는 길(사이클)도 있습니다. 이런 **임의의 관계**를 표현하는 가장 일반적인 자료구조가 **그래프(graph)** 입니다. 트리도 사실 그래프의 한 종류입니다.

1. 그래프 용어(정점, 간선, 방향, 가중치, 차수, 경로, 사이클)를 익힙니다.
2. 같은 그래프를 저장하는 세 가지 방법(**간선 목록, 인접 행렬, 인접 목록**)을 배우고 장단점을 비교합니다.
3. **C** 로 인접 행렬과 인접 목록을 함께 만들어 같은 질문을 두 방식으로 답합니다.
4. **Python** 으로 세 표현을 모두 만들고, 방향 그래프(팔로우)를 뒤집어 팔로워를 구합니다.
5. **Rust** 로 `Vec<Vec<usize>>` 무방향 그래프와 `HashMap`을 쓴 가중치 방향 그래프(도로망)를 만듭니다.
6. 응용으로 **공통 친구 수**로 친구를 추천합니다.

오늘은 그래프를 **저장하는 법**에 집중합니다. 그래프를 **돌아다니는 법**(탐색)은 Day 69의 BFS, Day 81의 DFS, Day 82의 최단 경로에서 이어집니다.

## 2. 왜 그래프가 필요한가

그래프는 "무엇과 무엇이 연결되어 있다"는 정보를 다루는 거의 모든 문제에 등장합니다.

| 분야            | 정점         | 간선            | 질문의 예                   |
| --------------- | ------------ | --------------- | --------------------------- |
| SNS             | 사람         | 친구, 팔로우    | 친구 추천, 영향력 있는 사람 |
| 지도·내비게이션 | 교차로, 도시 | 도로(거리·시간) | 가장 빠른 길                |
| 웹              | 웹 페이지    | 링크            | 검색 순위, 크롤링           |
| 수업 계획       | 과목         | 선수 과목       | 들을 순서 정하기            |
| 게임            | 방, 칸       | 통로            | 미로 탈출, 이동 가능 범위   |

이 수업의 커리큘럼도 그래프입니다. Day마다 "선행 Day"가 있고, 이 관계에 **사이클**이 없어야 순서대로 공부할 수 있습니다. 실제로 이 사이트의 콘텐츠 검사기가 선행 관계 그래프에 사이클이 있는지 확인합니다.

## 3. 그림으로 이해하기

이 수업의 기본 예제인 친구 관계 그래프입니다.

```text
      민수(0) ─────── 지아(1) ─────── 서연(3) ─────── 도윤(4)
          \           /
           \         /
            하준(2)                          예린(5)   (친구 없음)
```

| 용어            | 뜻                                             | 이 그림에서                                 |
| --------------- | ---------------------------------------------- | ------------------------------------------- |
| 정점(vertex)    | 그래프의 원소(노드)                            | 사람 6명, 0~5번                             |
| 간선(edge)      | 두 정점을 잇는 연결                            | 5개: 0-1, 0-2, 1-2, 1-3, 3-4                |
| 무방향 그래프   | 간선에 방향이 없음(A-B면 B-A도 성립)           | 친구 관계                                   |
| 방향 그래프     | 간선에 방향이 있음(A → B만 성립할 수 있음)     | 팔로우, 일방통행 도로                       |
| 가중치 그래프   | 간선마다 값(비용, 거리)이 붙음                 | 도로의 이동 시간                            |
| 이웃(인접)      | 간선으로 바로 이어진 정점                      | 지아의 이웃은 민수, 하준, 서연              |
| 차수(degree)    | 이웃의 수(방향 그래프는 진입·진출 차수로 나눔) | 지아 3, 예린 0                              |
| 경로(path)      | 간선을 따라 이어지는 정점의 나열               | 민수 → 지아 → 서연 → 도윤                   |
| 사이클(cycle)   | 출발한 정점으로 돌아오는 경로                  | 민수 → 지아 → 하준 → 민수                   |
| 연결(connected) | 두 정점 사이에 경로가 있음                     | 예린은 누구와도 연결되지 않은 **고립 정점** |

> **참고**: 트리는 **사이클이 없고 모든 정점이 연결된** 무방향 그래프입니다. 정점이 n개인 트리의 간선은 항상 n - 1개입니다. 위 그래프는 민수-지아-하준 사이클이 있으므로 트리가 아닙니다.

## 4. 천천히 풀어보기

### 4.1 표현 1: 간선 목록(edge list)

간선을 **쌍의 목록**으로 그대로 적습니다.

```text
[(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
```

만들기 쉽고, 파일로 저장하거나 입력받을 때 흔히 쓰는 형식입니다. 하지만 "지아의 친구는 누구?"에 답하려면 목록 **전체**를 훑어야 합니다(O(E), E는 간선 수). 그래서 보통 입력으로 받은 뒤 아래 두 표현 중 하나로 바꿉니다.

### 4.2 표현 2: 인접 행렬(adjacency matrix)

정점 수 V × V 크기의 2차원 배열을 만들고, u와 v 사이에 간선이 있으면 `matrix[u][v] = 1`로 둡니다.

```text
       0  1  2  3  4  5
  0  [ 0  1  1  0  0  0 ]    ← 0번 행: 민수의 이웃은 1, 2
  1  [ 1  0  1  1  0  0 ]
  2  [ 1  1  0  0  0  0 ]
  3  [ 0  1  0  0  1  0 ]
  4  [ 0  0  0  1  0  0 ]
  5  [ 0  0  0  0  0  0 ]    ← 예린은 모두 0
```

- **간선 확인이 O(1)**: `matrix[1][3]` 한 칸만 봅니다.
- 무방향 그래프의 행렬은 **대각선을 기준으로 대칭**입니다(`matrix[u][v] == matrix[v][u]`).
- 가중치 그래프라면 1 대신 가중치를 적고, 간선이 없는 칸은 0이나 무한대로 둡니다.
- **단점**: 간선이 몇 개든 V² 칸이 필요합니다. 이웃을 나열하려면 행 전체(V칸)를 봐야 합니다.

### 4.3 표현 3: 인접 목록(adjacency list)

정점마다 **이웃의 목록**을 가집니다.

```text
0: [1, 2]
1: [0, 2, 3]
2: [0, 1]
3: [1, 4]
4: [3]
5: []
```

- **이웃 나열이 O(차수)**: 필요한 것만 봅니다. BFS·DFS처럼 "이웃을 차례로 방문하는" 알고리즘에 딱 맞습니다.
- 공간은 V + 2E(무방향). 간선이 적은 그래프에서 행렬보다 훨씬 작습니다.
- **단점**: u-v 간선 확인은 u의 목록을 훑어야 하므로 O(차수)입니다. (목록 대신 해시 집합을 쓰면 평균 O(1)이 됩니다.)
- 가중치 그래프라면 목록에 `(이웃, 가중치)` 쌍을 넣습니다.

### 4.4 무방향 간선은 양쪽에 적는다

무방향 간선 `0-1`은 "0의 이웃에 1이 있다"와 "1의 이웃에 0이 있다"를 **둘 다** 뜻합니다. 인접 목록에는 양쪽 목록에 모두 넣고, 행렬에는 `[0][1]`과 `[1][0]`을 모두 1로 둡니다. 한쪽만 적으면 방향 그래프가 되어 버립니다(실습의 디버그 문제).

이 규칙 덕분에 다음 성질이 항상 성립합니다.

> **악수 보조정리**: 무방향 그래프에서 모든 정점의 차수의 합 = 간선 수 × 2

간선 하나가 양 끝 두 정점의 차수를 하나씩 올리기 때문입니다. 코드가 간선을 올바르게 기록했는지 검사하는 좋은 방법입니다.

### 4.5 어떤 표현을 고를까

| 기준               | 인접 행렬                        | 인접 목록                                  |
| ------------------ | -------------------------------- | ------------------------------------------ |
| 공간               | O(V²)                            | O(V + E)                                   |
| u-v 간선 확인      | **O(1)**                         | O(deg(u))                                  |
| u의 이웃 모두 나열 | O(V)                             | **O(deg(u))**                              |
| 모든 간선 순회     | O(V²)                            | **O(V + E)**                               |
| 간선 추가          | O(1)                             | O(1)                                       |
| 알맞은 그래프      | 정점이 적고 간선이 많을 때(조밀) | 간선이 적을 때(희소, 대부분의 실제 그래프) |

실제 그래프 대부분은 **희소**합니다. SNS 사용자가 10억 명이어도 한 사람의 친구는 수백 명입니다. 그래서 특별한 이유가 없으면 **인접 목록**을 씁니다.

## 5. C로 구현하기

C 구현은 같은 그래프를 **인접 행렬과 인접 목록으로 동시에** 저장합니다. 같은 질문에 두 방법으로 답해 결과가 같은지 확인합니다. 한글 이름은 `printf`의 폭 지정자가 바이트 단위로 계산되어 정렬이 어긋나므로, C 버전에서는 이름을 로마자로 적었습니다.

```c
// 파일: graph.c
#include <stdio.h>
#include <stdbool.h>

#define N 6                     // 정점 수
#define MAX_DEGREE 5            // 한 정점의 최대 이웃 수

const char *names[N] = {"minsu", "jia", "hajun", "seoyeon", "doyun", "yerin"};

// 표현 1: 인접 행렬
int matrix[N][N];

// 표현 2: 인접 목록 (정점마다 이웃 배열과 개수)
int neighbors[N][MAX_DEGREE];
int degree[N];

bool add_edge(int u, int v) {
    if (u == v || matrix[u][v]) {
        return false;                           // 자기 자신 또는 이미 있는 간선
    }
    if (degree[u] == MAX_DEGREE || degree[v] == MAX_DEGREE) {
        return false;
    }
    matrix[u][v] = matrix[v][u] = 1;            // 무방향: 양쪽 모두
    neighbors[u][degree[u]++] = v;
    neighbors[v][degree[v]++] = u;
    return true;
}

bool has_edge_matrix(int u, int v) {
    return matrix[u][v] == 1;                   // O(1)
}

bool has_edge_list(int u, int v) {
    for (int i = 0; i < degree[u]; i++) {       // O(차수)
        if (neighbors[u][i] == v) {
            return true;
        }
    }
    return false;
}

int main(void) {
    int edges[][2] = {{0, 1}, {0, 2}, {1, 2}, {1, 3}, {3, 4}, {1, 0}};
    int m = sizeof edges / sizeof edges[0];
    for (int i = 0; i < m; i++) {
        if (!add_edge(edges[i][0], edges[i][1])) {
            printf("skip %d-%d (이미 있음)\n", edges[i][0], edges[i][1]);
        }
    }

    printf("인접 행렬:\n    ");
    for (int v = 0; v < N; v++) {
        printf("%d ", v);
    }
    printf("\n");
    for (int u = 0; u < N; u++) {
        printf("  %d ", u);
        for (int v = 0; v < N; v++) {
            printf("%d ", matrix[u][v]);
        }
        printf("\n");
    }

    printf("인접 목록:\n");
    int degree_sum = 0;
    for (int u = 0; u < N; u++) {
        printf("  %d %-8s (차수 %d):", u, names[u], degree[u]);
        for (int i = 0; i < degree[u]; i++) {
            printf(" %s", names[neighbors[u][i]]);
        }
        printf("\n");
        degree_sum += degree[u];
    }
    printf("차수 합 %d = 간선 수 %d x 2\n", degree_sum, degree_sum / 2);

    printf("1-3 간선? 행렬 %d, 목록 %d\n", has_edge_matrix(1, 3), has_edge_list(1, 3));
    printf("2-4 간선? 행렬 %d, 목록 %d\n", has_edge_matrix(2, 4), has_edge_list(2, 4));
    for (int u = 0; u < N; u++) {
        if (degree[u] == 0) {
            printf("고립된 정점: %s\n", names[u]);
        }
    }
    return 0;
}
```

실행 결과:

```text
skip 1-0 (이미 있음)
인접 행렬:
    0 1 2 3 4 5
  0 0 1 1 0 0 0
  1 1 0 1 1 0 0
  2 1 1 0 0 0 0
  3 0 1 0 0 1 0
  4 0 0 0 1 0 0
  5 0 0 0 0 0 0
인접 목록:
  0 minsu    (차수 2): jia hajun
  1 jia      (차수 3): minsu hajun seoyeon
  2 hajun    (차수 2): minsu jia
  3 seoyeon  (차수 2): jia doyun
  4 doyun    (차수 1): seoyeon
  5 yerin    (차수 0):
차수 합 10 = 간선 수 5 x 2
1-3 간선? 행렬 1, 목록 1
2-4 간선? 행렬 0, 목록 0
고립된 정점: yerin
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                                                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int matrix[N][N];`                            | 전역 배열은 자동으로 0으로 초기화되므로 처음에는 간선이 하나도 없는 그래프입니다.                                                                                                                                      |
| `int neighbors[N][MAX_DEGREE]; int degree[N];` | 인접 목록을 고정 크기 2차원 배열로 흉내 냈습니다. `degree[u]`는 u의 이웃 수이자, 다음 이웃을 넣을 칸의 번호입니다(Day 57 스택의 top과 같은 역할). 실제 프로그램에서는 `malloc`과 `realloc`으로 늘어나는 배열을 씁니다. |
| `if (u == v \|\| matrix[u][v]) return false;`  | 자기 자신과 잇는 간선(자기 루프)과 **중복 간선**을 막습니다. 행렬 덕분에 중복 검사가 O(1)입니다. 입력의 마지막 `{1, 0}`은 이미 있는 `0-1`과 같은 간선이라 건너뛰었습니다.                                              |
| `matrix[u][v] = matrix[v][u] = 1;`             | 무방향이므로 양쪽을 모두 1로 둡니다. 대입은 오른쪽부터 계산됩니다.                                                                                                                                                     |
| `neighbors[u][degree[u]++] = v;`               | u의 목록 끝에 v를 넣고 차수를 1 늘립니다. 바로 다음 줄에서 반대 방향도 넣습니다.                                                                                                                                       |
| `has_edge_list`의 반복                         | 목록에서 간선을 확인하려면 이웃을 하나씩 비교해야 합니다. 행렬 버전은 한 칸만 봅니다. 두 함수의 결과가 같은지 출력으로 확인하세요.                                                                                     |
| `degree_sum / 2`                               | 악수 보조정리로 간선 수를 계산했습니다. 차수 합이 홀수라면 어딘가 한쪽만 기록된 버그가 있다는 뜻입니다.                                                                                                                |

## 6. Python으로 구현하기

Python 버전은 세 표현을 모두 만들고, **방향 그래프**도 다룹니다. 팔로우 관계에서 "누가 나를 팔로우하는가?"는 간선의 방향을 **뒤집은 그래프**에서 "나의 이웃"을 묻는 것과 같습니다.

```python
# 파일: graph.py
names = ["민수", "지아", "하준", "서연", "도윤", "예린"]
edges = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
n = len(names)

# 표현 1: 간선 목록 → 그대로 edges

# 표현 2: 인접 행렬
matrix = [[0] * n for _ in range(n)]
for u, v in edges:
    matrix[u][v] = matrix[v][u] = 1

# 표현 3: 인접 목록
adj = [[] for _ in range(n)]
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)

print("간선 목록:", edges)
print("인접 행렬:")
for u, row in enumerate(matrix):
    print(f"  {u} {row}")
print("인접 목록:")
for u, nbrs in enumerate(adj):
    print(f"  {u} {names[u]} (차수 {len(nbrs)}): {[names[v] for v in nbrs]}")

print("간선 수:", sum(len(nbrs) for nbrs in adj) // 2)
print("차수가 가장 큰 사람:", names[max(range(n), key=lambda u: len(adj[u]))])
print("지아와 서연은 친구?", 3 in adj[1], "/ 하준과 도윤은 친구?", matrix[2][4] == 1)

# 방향 그래프: 팔로우 관계 (u가 v를 팔로우)
follows = {"민수": ["지아", "하준"], "지아": ["하준"], "하준": ["지아"], "서연": ["지아"]}
followers = {}
for u, targets in follows.items():
    for v in targets:
        followers.setdefault(v, []).append(u)      # 방향을 뒤집은 그래프
for person in ["민수", "지아", "하준", "서연"]:
    out_deg = len(follows.get(person, []))
    in_deg = len(followers.get(person, []))
    print(f"{person}: 팔로잉 {out_deg}, 팔로워 {in_deg} {followers.get(person, [])}")
```

실행 결과:

```text
간선 목록: [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
인접 행렬:
  0 [0, 1, 1, 0, 0, 0]
  1 [1, 0, 1, 1, 0, 0]
  2 [1, 1, 0, 0, 0, 0]
  3 [0, 1, 0, 0, 1, 0]
  4 [0, 0, 0, 1, 0, 0]
  5 [0, 0, 0, 0, 0, 0]
인접 목록:
  0 민수 (차수 2): ['지아', '하준']
  1 지아 (차수 3): ['민수', '하준', '서연']
  2 하준 (차수 2): ['민수', '지아']
  3 서연 (차수 2): ['지아', '도윤']
  4 도윤 (차수 1): ['서연']
  5 예린 (차수 0): []
간선 수: 5
차수가 가장 큰 사람: 지아
지아와 서연은 친구? True / 하준과 도윤은 친구? False
민수: 팔로잉 2, 팔로워 0 []
지아: 팔로잉 1, 팔로워 3 ['민수', '하준', '서연']
하준: 팔로잉 1, 팔로워 2 ['민수', '지아']
서연: 팔로잉 1, 팔로워 0 []
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[[0] * n for _ in range(n)]`               | 행마다 **새 리스트**를 만듭니다. `[[0] * n] * n`은 같은 행 하나를 n번 가리키므로, `matrix[0][1] = 1`이 모든 행의 1번 칸을 바꿔 버립니다(Day 31의 별칭 문제).    |
| `adj = [[] for _ in range(n)]`              | 정점 번호가 0부터 연속이면 **리스트의 리스트**가 가장 간단한 인접 목록입니다.                                                                                   |
| `3 in adj[1]`                               | 목록에서 간선 확인은 `in`으로 훑습니다(O(차수)). 행렬 버전 `matrix[2][4] == 1`은 한 칸만 봅니다.                                                                |
| `max(range(n), key=lambda u: len(adj[u]))`  | 정점 번호 중에서 **차수가 가장 큰 것**을 고릅니다. `key`는 비교 기준을 정하는 함수입니다.                                                                       |
| `follows = {"민수": ["지아", "하준"], ...}` | 정점이 이름이면 **사전의 리스트**로 인접 목록을 만듭니다. 방향 그래프라 "민수 → 지아"만 적고 반대 방향은 적지 않습니다.                                         |
| `followers.setdefault(v, []).append(u)`     | `setdefault`는 키가 없으면 빈 리스트를 넣고, 있든 없든 그 리스트를 돌려줍니다. u → v 간선을 뒤집어 v의 목록에 u를 넣으므로 **진입 간선(팔로워)** 목록이 됩니다. |
| `follows.get(person, [])`                   | 아무도 팔로우하지 않는 사람은 사전에 키가 없을 수 있어 기본값을 줍니다.                                                                                         |

지아는 1명을 팔로우하지만 팔로워는 3명입니다. 방향 그래프에서는 **나가는 간선 수(진출 차수)** 와 **들어오는 간선 수(진입 차수)** 가 다릅니다.

## 7. Rust로 구현하기

Rust 버전은 두 그래프를 만듭니다. 친구 관계는 정점 번호를 인덱스로 쓰는 `Vec<Vec<usize>>`로, 도로망은 도시 이름을 키로 쓰는 `HashMap<&str, Vec<(&str, u32)>>`로 표현합니다. 도로망은 **가중치 있는 방향 그래프**입니다.

```rust
// 파일: graph.rs
use std::collections::HashMap;

struct Graph {
    adj: Vec<Vec<usize>>,       // 무방향 인접 목록
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }

    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }

    fn degree(&self, u: usize) -> usize {
        self.adj[u].len()
    }

    fn has_edge(&self, u: usize, v: usize) -> bool {
        self.adj[u].contains(&v)
    }

    fn edge_count(&self) -> usize {
        self.adj.iter().map(|nbrs| nbrs.len()).sum::<usize>() / 2
    }
}

fn main() {
    let names = ["민수", "지아", "하준", "서연", "도윤", "예린"];
    let mut g = Graph::new(names.len());
    for (u, v) in [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)] {
        g.add_edge(u, v);
    }
    for (u, nbrs) in g.adj.iter().enumerate() {
        let friends: Vec<&str> = nbrs.iter().map(|&v| names[v]).collect();
        println!("{u} {} (차수 {}): {:?}", names[u], g.degree(u), friends);
    }
    println!("간선 수 {}, 1-3? {}, 2-4? {}", g.edge_count(), g.has_edge(1, 3), g.has_edge(2, 4));

    // 가중치가 있는 방향 그래프: 도시 사이의 편도 이동 시간(분)
    let mut roads: HashMap<&str, Vec<(&str, u32)>> = HashMap::new();
    for (from, to, minutes) in [("서울", "대전", 90), ("대전", "대구", 80), ("서울", "강릉", 150), ("대구", "부산", 60), ("대전", "광주", 100)] {
        roads.entry(from).or_default().push((to, minutes));
    }
    let mut cities: Vec<&&str> = roads.keys().collect();
    cities.sort();
    for city in cities {
        println!("{city} -> {:?}", roads[*city]);
    }
    let from_seoul: u32 = roads["서울"].iter().map(|&(_, m)| m).sum();
    println!("서울에서 나가는 간선 {}개, 시간 합 {}분", roads["서울"].len(), from_seoul);
    println!("부산에서 나가는 간선: {:?}", roads.get("부산"));
}
```

실행 결과:

```text
0 민수 (차수 2): ["지아", "하준"]
1 지아 (차수 3): ["민수", "하준", "서연"]
2 하준 (차수 2): ["민수", "지아"]
3 서연 (차수 2): ["지아", "도윤"]
4 도윤 (차수 1): ["서연"]
5 예린 (차수 0): []
간선 수 5, 1-3? true, 2-4? false
대구 -> [("부산", 60)]
대전 -> [("대구", 80), ("광주", 100)]
서울 -> [("대전", 90), ("강릉", 150)]
서울에서 나가는 간선 2개, 시간 합 240분
부산에서 나가는 간선: None
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                                          |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vec![Vec::new(); n]`                                 | 빈 `Vec`을 n번 **복제**해서 서로 다른 목록 n개를 만듭니다. Python의 `[[]] * n`과 달리 Rust의 `vec![x; n]`은 `clone()`으로 복제하므로 별칭 문제가 없습니다.                    |
| `self.adj[u].contains(&v)`                            | 목록을 훑어 간선을 확인합니다(O(차수)).                                                                                                                                       |
| `.map(\|nbrs\| nbrs.len()).sum::<usize>() / 2`        | 차수 합을 구해 2로 나눕니다. `sum`은 결과 타입을 알려 줘야 해서 `::<usize>`(터보피시)를 붙였습니다.                                                                           |
| `roads.entry(from).or_default().push((to, minutes));` | 도시가 처음 나오면 빈 `Vec`을 만들고(`or_default`), 그 목록에 (도착 도시, 시간)을 넣습니다. Day 67의 entry API를 인접 목록 만들기에 쓴 것입니다.                              |
| `cities.sort();`                                      | `HashMap`은 순서가 없으므로 출력 전에 키를 정렬했습니다. 문자열은 유니코드 순서로 정렬되어 대구 < 대전 < 서울입니다.                                                          |
| `roads["서울"]`                                       | 서울이 **반드시 있다**는 것을 알기 때문에 인덱스로 접근했습니다. 없을 수 있는 부산은 `roads.get("부산")`으로 `Option`을 받았고, 부산에서 나가는 도로가 없으므로 `None`입니다. |

방향 그래프라서 서울 → 대전은 있지만 대전 → 서울은 없습니다. 돌아오는 도로가 필요하면 그 간선도 따로 넣어야 합니다. 부산처럼 **나가는 간선이 없는** 정점은 키 자체가 없을 수 있다는 점에 주의하세요.

## 8. 실행 추적

C 프로그램이 간선 목록을 읽으며 두 표현을 채우는 과정입니다.

| 읽은 간선 | 행렬 변경          | 인접 목록 변경        | 차수(0~5)   |
| --------- | ------------------ | --------------------- | ----------- |
| 0-1       | [0][1], [1][0] = 1 | 0: [1] / 1: [0]       | 1 1 0 0 0 0 |
| 0-2       | [0][2], [2][0] = 1 | 0: [1, 2] / 2: [0]    | 2 1 1 0 0 0 |
| 1-2       | [1][2], [2][1] = 1 | 1: [0, 2] / 2: [0, 1] | 2 2 2 0 0 0 |
| 1-3       | [1][3], [3][1] = 1 | 1: [0, 2, 3] / 3: [1] | 2 3 2 1 0 0 |
| 3-4       | [3][4], [4][3] = 1 | 3: [1, 4] / 4: [3]    | 2 3 2 2 1 0 |
| 1-0       | 이미 1 → 건너뜀    | 변화 없음             | 2 3 2 2 1 0 |

간선을 하나 읽을 때마다 **차수 두 개**가 1씩 늘어납니다. 최종 차수 합은 10 = 간선 5개 × 2입니다.

## 9. 다른 예제로 다시 이해하기

그래프로 **친구 추천**을 만들어 봅시다. "나와 아직 친구가 아니지만 **공통 친구가 많은** 사람"을 추천하는 것이 SNS가 쓰는 가장 기본적인 방법입니다. 친구의 친구를 모두 모으고, 그 사람과 내가 공통으로 아는 친구가 몇 명인지 셉니다. 이웃을 **집합(set)** 으로 저장하면 "나의 친구 집합 ∩ 그 사람의 친구 집합"으로 공통 친구를 바로 구할 수 있습니다. 집합은 Day 67의 해시 맵에서 값이 없는 것이라서, 포함 여부를 평균 O(1)에 확인할 수 있습니다. 나 자신과 이미 친구인 사람은 추천에서 빼야 합니다.

```python
# 파일: recommend.py
friends = {
    "민수": {"지아", "하준"},
    "지아": {"민수", "하준", "서연"},
    "하준": {"민수", "지아", "도윤"},
    "서연": {"지아", "도윤"},
    "도윤": {"하준", "서연"},
    "예린": set(),
}


def recommend(me):
    scores = {}
    for friend in friends[me]:
        for candidate in friends[friend]:
            if candidate != me and candidate not in friends[me]:
                scores[candidate] = scores.get(candidate, 0) + 1
    return sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))


for person in ["민수", "서연", "예린"]:
    result = recommend(person)
    print(f"{person}에게 추천:", result if result else "없음")

common = friends["민수"] & friends["서연"]
print("민수와 서연의 공통 친구:", sorted(common))
```

실행 결과:

```text
민수에게 추천: [('도윤', 1), ('서연', 1)]
서연에게 추천: [('하준', 2), ('민수', 1)]
예린에게 추천: 없음
민수와 서연의 공통 친구: ['지아']
```

서연에게는 공통 친구가 둘(지아, 도윤)인 하준이 가장 먼저 추천됩니다. 같은 알고리즘을 Rust의 `HashSet`과 `HashMap`으로 옮기면 다음과 같습니다.

```rust
// 파일: recommend.rs
use std::collections::{HashMap, HashSet};

fn main() {
    let pairs = [("민수", "지아"), ("민수", "하준"), ("지아", "하준"), ("지아", "서연"), ("하준", "도윤"), ("서연", "도윤")];
    let mut friends: HashMap<&str, HashSet<&str>> = HashMap::new();
    for (a, b) in pairs {
        friends.entry(a).or_default().insert(b);
        friends.entry(b).or_default().insert(a);   // 무방향: 양쪽 모두
    }

    for me in ["민수", "서연"] {
        let mine = &friends[me];
        let mut scores: HashMap<&str, usize> = HashMap::new();
        for friend in mine {
            for &candidate in &friends[friend] {
                if candidate != me && !mine.contains(candidate) {
                    *scores.entry(candidate).or_insert(0) += 1;
                }
            }
        }
        let mut ranked: Vec<(&str, usize)> = scores.into_iter().collect();
        ranked.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));
        println!("{me}에게 추천: {:?}", ranked);
    }
}
```

실행 결과:

```text
민수에게 추천: [("도윤", 1), ("서연", 1)]
서연에게 추천: [("하준", 2), ("민수", 1)]
```

## 10. 시간·공간 복잡도

V는 정점 수, E는 간선 수, deg(u)는 u의 차수입니다.

| 연산           | 간선 목록 | 인접 행렬    | 인접 목록 |
| -------------- | --------- | ------------ | --------- |
| 공간           | O(E)      | O(V²)        | O(V + E)  |
| u-v 간선 확인  | O(E)      | O(1)         | O(deg(u)) |
| u의 이웃 나열  | O(E)      | O(V)         | O(deg(u)) |
| 모든 간선 순회 | O(E)      | O(V²)        | O(V + E)  |
| 간선 추가      | O(1)      | O(1)         | O(1)      |
| 정점 추가      | O(1)      | O(V²) 재할당 | O(1)      |

9절의 친구 추천은 내 친구 수 × 친구의 평균 친구 수만큼 일합니다. 전체 사용자 수와 상관이 없다는 점이 인접 목록의 힘입니다.

## 11. 세 언어 비교

| 관점            | C                                | Python                        | Rust                             |
| --------------- | -------------------------------- | ----------------------------- | -------------------------------- |
| 인접 행렬       | `int matrix[N][N]`               | `[[0] * n for _ in range(n)]` | `vec![vec![0; n]; n]`            |
| 인접 목록(번호) | `int nbr[N][MAX]` + `int deg[N]` | `[[] for _ in range(n)]`      | `vec![Vec::new(); n]`            |
| 인접 목록(이름) | 이름 → 번호 변환표 필요          | `dict[str, list]`             | `HashMap<&str, Vec<&str>>`       |
| 가중치 간선     | 구조체 `{int to; int w;}` 배열   | `(이웃, 가중치)` 튜플         | `(usize, u32)` 튜플              |
| 이웃을 집합으로 | 직접 구현                        | `set`, `&`(교집합)            | `HashSet`, `.intersection()`     |
| 없는 정점       | 번호 범위 검사 직접              | `KeyError` 또는 `get`         | `map[k]`는 panic, `get`은 `None` |

## 12. 자주 하는 실수

### 실수 1: 무방향 간선을 한쪽에만 기록한다

실습의 디버그 문제입니다. 한쪽만 기록하면 "1의 친구 목록에 0이 없는" 이상한 친구 관계가 됩니다. **차수 합이 간선 수 × 2인지** 확인하면 바로 발견할 수 있습니다.

### 실수 2: Python에서 행렬을 `[[0] * n] * n`으로 만든다

```python
# 파일: shared_rows.py
n = 3
bad = [[0] * n] * n
bad[0][1] = 1
good = [[0] * n for _ in range(n)]
good[0][1] = 1
print("bad: ", bad)
print("good:", good)
```

실행 결과:

```text
bad:  [[0, 1, 0], [0, 1, 0], [0, 1, 0]]
good: [[0, 1, 0], [0, 0, 0], [0, 0, 0]]
```

`*`는 리스트를 복사하지 않고 **같은 리스트를 여러 번 가리키게** 합니다. 간선 하나를 넣었는데 모든 정점에서 1번과 연결된 것처럼 됩니다.

### 실수 3: 정점 번호가 0부터인지 1부터인지 섞는다

문제의 입력은 보통 정점을 1번부터 매기는데, 배열은 0번부터 시작합니다. 크기를 n으로 잡고 정점 n을 넣으면 배열 밖에 씁니다. 크기를 n + 1로 잡거나, 입력을 받을 때 1을 빼서 0부터로 바꾸는 규칙을 **한 가지로 정하세요.**

### 실수 4: 중복 간선을 막지 않는다

같은 친구 관계가 입력에 두 번 있으면 인접 목록에 이웃이 두 번 들어가 차수가 부풀려집니다. C 구현은 행렬로 중복을 검사했고, 9절의 집합 표현은 중복을 자동으로 막습니다.

### 실수 5: 방향 그래프에서 나가는 간선이 없는 정점을 빠뜨린다

도로망 예제에서 부산은 도착만 하고 출발하는 도로가 없어서 `roads`에 키가 없습니다. 모든 정점을 순회하려면 **간선의 양쪽 끝을 모두** 정점 목록에 모아야 합니다. `roads["부산"]`처럼 인덱스로 읽으면 Rust는 panic, Python은 `KeyError`가 납니다.

## 13. Q&A

**Q. 정점 번호가 이름(문자열)일 때 인접 행렬을 쓸 수 있나요?**

A. 이름 → 번호 변환표(해시 맵)를 먼저 만들면 됩니다. `{"민수": 0, "지아": 1, ...}`로 번호를 매긴 뒤 행렬이나 번호 기반 인접 목록을 씁니다. C처럼 해시 맵이 없는 언어에서는 이름 배열을 두고 이름을 찾아 번호로 바꾸는 방법을 씁니다.

**Q. 그래프가 너무 커서 메모리에 다 올릴 수 없다면요?**

A. 웹 전체나 SNS 전체 같은 그래프는 한 컴퓨터에 담을 수 없어 여러 컴퓨터에 나눠 저장하고 처리합니다. 또는 인접 목록을 파일에 저장해 필요한 부분만 읽습니다. 원리는 오늘 배운 인접 목록과 같습니다.

**Q. 트리를 그래프로 저장하면 무엇이 달라지나요?**

A. Day 64의 트리는 "부모 → 자식" 방향만 저장했습니다. 그래프로 저장하면 이웃 목록에 부모와 자식이 모두 들어가므로, 순회할 때 **왔던 쪽(부모)으로 되돌아가지 않도록** 방문 여부를 기록해야 합니다. 이것이 Day 69 BFS에서 방문 집합이 필요한 이유입니다.

**Q. 인접 목록의 이웃 순서는 중요한가요?**

A. 그래프 자체의 의미에는 영향이 없지만, BFS·DFS의 **방문 순서**가 이웃 순서에 따라 달라집니다. 결과를 항상 같게 하고 싶다면 이웃을 정렬해 두세요.

## 14. 핵심 요약

- 그래프는 **정점**과 **간선**으로 임의의 관계를 표현합니다. 간선에는 방향과 가중치가 있을 수 있습니다.
- 표현 방법: **간선 목록**(입력·저장에 편함), **인접 행렬**(간선 확인 O(1), 공간 V²), **인접 목록**(이웃 나열 O(차수), 공간 V + E).
- 실제 그래프는 대부분 희소하므로 보통 **인접 목록**을 씁니다.
- 무방향 간선은 **양쪽에 모두** 기록합니다. 차수 합은 항상 간선 수 × 2입니다.
- 방향 그래프는 진입 차수와 진출 차수가 다르고, 간선을 **뒤집은 그래프**로 "나에게 들어오는 간선"을 구할 수 있습니다.
- C는 배열로, Python은 리스트·사전·집합으로, Rust는 `Vec<Vec<usize>>`와 `HashMap`, `HashSet`으로 그래프를 만듭니다.

## 15. 도전 문제

1. **(C)** 인접 목록을 고정 크기 배열 대신 `malloc`과 `realloc`으로 늘어나는 배열로 바꿔, 한 정점의 이웃 수에 제한이 없게 만드세요.
2. **(Python)** 정점마다 이웃을 `set`으로 저장하는 `Graph` 클래스를 만들고 `add_edge`, `remove_edge`, `has_edge`, `neighbors`를 구현하세요. `remove_edge`도 양쪽에서 지워야 합니다.
3. **(Rust)** 이 사이트의 커리큘럼처럼 "과목 → 선수 과목" 방향 그래프를 만들고, 선수 과목이 하나도 없는 과목(진입 차수 0)을 모두 출력해 보세요. Day 81 이후에 이것을 이용한 **위상 정렬**에 도전할 수 있습니다.
4. **(세 언어)** 도로망 예제를 무방향(양방향 도로)으로 바꾸고, 각 도시에서 바로 갈 수 있는 도시 중 **가장 가까운 도시**를 출력하세요.
