---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-80-backtracking
courseId: crp-92
phaseId: phase-07
dayNumber: 80
date: "2026-12-19"
title: 백트래킹 — 선택하고, 들어가 보고, 되돌리기
summary: 가능한 선택을 하나씩 시도하다가 막히면 직전 선택을 되돌려 다른 길을 가는 백트래킹을 부분집합, 순열, N-퀸 문제로 익힙니다. '선택 → 재귀 → 되돌리기'의 뼈대를 C, Python, Rust로 구현하고, 조건을 어기는 길을 미리 잘라 내는 가지치기가 방문 수를 얼마나 줄이는지 부분집합의 합 문제로 측정합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 120
prerequisites: [day-79-dynamic-programming]
learningObjectives:
  - 백트래킹이 모든 선택의 조합을 트리로 탐색하는 방법이라는 것을 그림으로 설명한다.
  - 선택 → 재귀 → 되돌리기의 뼈대로 부분집합과 순열을 모두 만든다.
  - N-퀸 문제에서 열과 두 대각선의 사용 여부를 기록해 충돌을 O(1)에 검사한다.
  - 가지치기로 불가능한 길을 일찍 잘라 내고, 방문한 상태의 수로 효과를 측정한다.
  - 재귀가 공유하는 상태(path, used)를 되돌리지 않거나 복사하지 않을 때 생기는 버그를 찾아 고친다.
concepts:
  [
    backtracking,
    state space tree,
    choose explore unchoose,
    subsets,
    permutations,
    n-queens,
    pruning,
    subset sum,
  ]
runnerMode: python
playgroundSource: |
  # 파일: permutations.py — 원소를 바꾸고 출력 순서를 확인해 보세요.
  items = ["A", "B", "C"]
  path, used = [], [False] * len(items)


  def visit(depth):
      if depth == len(items):
          print("".join(path))
          return
      for i, x in enumerate(items):
          if not used[i]:
              used[i] = True
              path.append(x)
              visit(depth + 1)
              path.pop()          # 되돌리기
              used[i] = False


  visit(0)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day80-predict-py
    title: 부분집합이 만들어지는 순서 예측하기
    kind: predict
    objective: "'넣는다 → 넣지 않는다' 순서로 탐색할 때 결과가 나오는 순서를 추적한다."
    prompt: 출력될 부분집합들을 예측하세요.
    starter: |-
      out, path = [], []


      def visit(i, items):
          if i == len(items):
              out.append("".join(path) or "-")
              return
          visit(i + 1, items)          # 넣지 않는 경우 먼저
          path.append(items[i])
          visit(i + 1, items)          # 넣는 경우
          path.pop()


      visit(0, "xy")
      print(*out)
    answer: "- y x xy"
    hint: "첫 선택은 x를 넣지 않는 쪽입니다. 그 안에서 다시 y를 넣지 않는 쪽(빈 집합), 넣는 쪽(y)이 먼저 나옵니다."
    explanation: "선택 트리를 왼쪽(넣지 않음)부터 깊이 우선으로 돕니다. x 없음 → [y 없음: 빈 집합, y 있음: y], x 있음 → [y 없음: x, y 있음: xy]. 원소가 n개면 결과는 2ⁿ개입니다."
    commonMistakes:
      - "넣는 경우가 먼저라고 생각해 xy x y -로 적음"
      - "path.pop()을 무시해 x 다음에 xy가 아니라 yx가 된다고 생각함"
    language: python
    verification: run
  - id: ex-day80-predict-c
    title: 4-퀸의 해 개수 예측하기
    kind: predict
    objective: 가지치기가 있는 N-퀸 탐색의 결과를 확인한다.
    prompt: 출력될 두 숫자(4-퀸의 해 개수, 첫 해의 1번째 줄 퀸의 열)를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int n = 4, col[4], count = 0, first = -1;
      bool used[4], d1[8], d2[8];

      void place(int r) {
          if (r == n) {
              if (count == 0) first = col[0];
              count++;
              return;
          }
          for (int c = 0; c < n; c++) {
              if (used[c] || d1[r + c] || d2[r - c + n - 1]) continue;
              col[r] = c;
              used[c] = d1[r + c] = d2[r - c + n - 1] = true;
              place(r + 1);
              used[c] = d1[r + c] = d2[r - c + n - 1] = false;
          }
      }

      int main(void) {
          place(0);
          printf("%d %d\n", count, first);
          return 0;
      }
    answer: "2 1"
    hint: "첫 줄에 0열로 놓으면 해가 없습니다. 첫 해는 첫 줄의 퀸을 1열에 놓는 . Q . . 모양입니다."
    explanation: "4×4 판의 해는 [1, 3, 0, 2]와 [2, 0, 3, 1] 두 개로 서로 좌우 대칭입니다. 첫 줄 0열에서 시작하는 모든 시도는 중간에 막혀 되돌아옵니다. 이것이 백트래킹의 '들어가 보고 막히면 되돌리기'입니다."
    commonMistakes:
      - "퀸이 가로·세로만 공격한다고 생각해 해를 24개(4!)로 적음"
      - "대칭인 두 해를 하나로 셈"
    language: c
    verification: run
  - id: ex-day80-fill
    title: Rust 순열의 되돌리기 채우기
    kind: fill
    objective: 재귀에서 돌아온 뒤 선택을 원래대로 되돌린다.
    prompt: "빈칸 두 곳에 재귀 호출에서 돌아온 뒤 path와 used를 되돌리는 코드를 채우세요."
    starter: |-
      fn permute(items: &[u32], path: &mut Vec<u32>, used: &mut [bool], out: &mut Vec<Vec<u32>>) {
          if path.len() == items.len() {
              out.push(path.clone());
              return;
          }
          for i in 0..items.len() {
              if used[i] {
                  continue;
              }
              used[i] = true;
              path.push(items[i]);
              permute(items, path, used, out);
              _____;
              _____;
          }
      }

      fn main() {
          let mut out = Vec::new();
          permute(&[1, 2, 3], &mut Vec::new(), &mut [false; 3], &mut out);
          println!("{} {:?}", out.len(), out[3]);
      }
    answer: |-
      fn permute(items: &[u32], path: &mut Vec<u32>, used: &mut [bool], out: &mut Vec<Vec<u32>>) {
          if path.len() == items.len() {
              out.push(path.clone());
              return;
          }
          for i in 0..items.len() {
              if used[i] {
                  continue;
              }
              used[i] = true;
              path.push(items[i]);
              permute(items, path, used, out);
              path.pop();
              used[i] = false;
          }
      }

      fn main() {
          let mut out = Vec::new();
          permute(&[1, 2, 3], &mut Vec::new(), &mut [false; 3], &mut out);
          println!("{} {:?}", out.len(), out[3]);
      }
    output: "6 [2, 3, 1]"
    hint: "선택할 때 한 일(push, used = true)을 거꾸로 되돌립니다. 되돌리는 순서도 선택의 반대 순서가 자연스럽습니다."
    explanation: "되돌리지 않으면 path가 계속 길어지고 used가 true로 남아 첫 순열 하나만 만들어집니다. out.push(path.clone())에서 clone이 필요한 이유는 path가 이후에도 계속 바뀌기 때문입니다. 네 번째 순열은 [2, 3, 1]입니다."
    commonMistakes:
      - "used[i] = false만 하고 path.pop()을 빠뜨려 길이가 맞지 않는 결과를 만듦"
      - "out.push(path)로 소유권을 옮기려다 컴파일 오류를 냄"
    language: rust
    verification: run
  - id: ex-day80-modify
    title: Python 조합 만들기에 가지치기 넣기
    kind: modify
    objective: 남은 원소가 부족해 k개를 채울 수 없는 길을 미리 잘라 낸다.
    prompt: "combinations(n, k)는 1~n에서 k개를 고르는 조합을 만듭니다. 남은 숫자로 k개를 채울 수 없으면 더 들어가지 않도록 가지치기를 넣고, 결과 개수와 방문 횟수를 출력하세요. n=10, k=8에서 결과 45개, 방문 수가 가지치기 전보다 훨씬 적어야 합니다."
    starter: |-
      visits = 0


      def combinations(n, k):
          out, path = [], []

          def visit(start):
              global visits
              visits += 1
              if len(path) == k:
                  out.append(path[:])
                  return
              for x in range(start, n + 1):
                  path.append(x)
                  visit(x + 1)
                  path.pop()

          visit(1)
          return out


      print(len(combinations(10, 8)), visits)
    answer: |-
      visits = 0


      def combinations(n, k):
          out, path = [], []

          def visit(start):
              global visits
              visits += 1
              if len(path) == k:
                  out.append(path[:])
                  return
              need = k - len(path)
              for x in range(start, n - need + 2):    # 남은 수가 need개 이상일 때만
                  path.append(x)
                  visit(x + 1)
                  path.pop()

          visit(1)
          return out


      print(len(combinations(10, 8)), visits)
    output: "45 165"
    hint: "아직 need개를 더 골라야 한다면, 이번에 고르는 x 뒤로 need - 1개의 숫자가 남아 있어야 합니다. 그래서 x는 n - need + 1까지만 볼 수 있습니다."
    explanation: "가지치기 전에는 어차피 8개를 채울 수 없는 길(예: 9부터 시작)까지 끝까지 들어갔다 나옵니다. 가지치기 후에는 답이 될 가능성이 있는 길만 방문합니다. 결과는 같고 일만 줄어듭니다. 가지치기는 '이 길에서는 답이 나올 수 없다'는 것이 확실할 때만 해야 합니다."
    commonMistakes:
      - "range 끝을 n - need + 1로 써서 마지막 가능한 선택까지 잘라 결과가 줄어듦"
      - "len(path) > k일 때 멈추는 검사만 넣어 방문 수가 줄지 않음"
    language: python
    verification: run
  - id: ex-day80-debug
    title: C 순열의 되돌리기 누락 고치기
    kind: debug
    objective: 사용 표시를 되돌리지 않으면 첫 경로만 탐색된다는 것을 확인한다.
    prompt: "이 순열 프로그램은 used[i]를 되돌리지 않아 순열이 하나만 나옵니다. 6개가 모두 출력되게 고치세요."
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int path[3];
      bool used[3];
      int count = 0;

      void permute(int depth) {
          if (depth == 3) {
              printf("%d%d%d ", path[0], path[1], path[2]);
              count++;
              return;
          }
          for (int i = 0; i < 3; i++) {
              if (used[i]) continue;
              used[i] = true;
              path[depth] = i + 1;
              permute(depth + 1);
          }
      }

      int main(void) {
          permute(0);
          printf("(%d개)\n", count);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      int path[3];
      bool used[3];
      int count = 0;

      void permute(int depth) {
          if (depth == 3) {
              printf("%d%d%d ", path[0], path[1], path[2]);
              count++;
              return;
          }
          for (int i = 0; i < 3; i++) {
              if (used[i]) continue;
              used[i] = true;
              path[depth] = i + 1;
              permute(depth + 1);
              used[i] = false;
          }
      }

      int main(void) {
          permute(0);
          printf("(%d개)\n", count);
          return 0;
      }
    output: "123 132 213 231 312 321 (6개)"
    starterOutput: "123 (1개)"
    hint: "첫 순열 123을 만든 뒤 돌아오면 used가 모두 true로 남아 있어, 다른 숫자를 고를 수 없습니다."
    explanation: "백트래킹의 핵심은 '선택한 것을 되돌려야 다른 선택을 시도할 수 있다'는 것입니다. path는 다음 선택이 같은 칸을 덮어쓰므로 되돌리지 않아도 되지만, used처럼 '선택 가능 여부'를 기록한 상태는 반드시 되돌려야 합니다."
    commonMistakes:
      - "used[i] = false를 재귀 호출 전에 넣어 같은 숫자를 두 번 쓰게 함"
      - "permute 밖(main)에서만 used를 초기화함"
    language: c
    verification: run
  - id: ex-day80-independent
    title: Rust로 괄호 쌍 모두 만들기
    kind: independent
    objective: 조건을 지키는 선택만 해서 올바른 괄호 문자열을 모두 만든다.
    prompt: "n쌍의 괄호로 만들 수 있는 올바른 괄호 문자열을 모두 만드세요. 여는 괄호는 n개까지, 닫는 괄호는 지금까지 연 괄호보다 적을 때만 붙일 수 있습니다. n = 3이면 5개가 사전순으로 출력되어야 합니다."
    starter: |-
      fn main() {
          let n = 3;
          println!("{n}");
      }
    answer: |-
      fn generate(open: usize, close: usize, n: usize, path: &mut String, out: &mut Vec<String>) {
          if path.len() == 2 * n {
              out.push(path.clone());
              return;
          }
          if open < n {
              path.push('(');
              generate(open + 1, close, n, path, out);
              path.pop();
          }
          if close < open {
              path.push(')');
              generate(open, close + 1, n, path, out);
              path.pop();
          }
      }

      fn main() {
          let mut out = Vec::new();
          generate(0, 0, 3, &mut String::new(), &mut out);
          println!("{} {:?}", out.len(), out);
      }
    output: '5 ["((()))", "(()())", "(())()", "()(())", "()()()"]'
    hint: "조건을 어기는 괄호는 아예 붙이지 않는 것이 가지치기입니다. 모든 2ⁿ 문자열을 만든 뒤 걸러 내는 것보다 훨씬 적게 일합니다."
    explanation: "'('를 먼저 시도하므로 결과가 자동으로 사전순('(' < ')')입니다. close < open 조건 덕분에 ')'가 너무 많아지는 문자열은 만들어지지 않습니다. 결과 개수는 카탈란 수(1, 2, 5, 14, 42, …)입니다."
    commonMistakes:
      - "close < n 조건을 써서 '())(()' 같은 틀린 문자열을 만듦"
      - "path.pop()을 빠뜨려 문자열이 계속 길어짐"
    language: rust
    verification: run
quiz:
  - id: quiz-day80-01
    question: 백트래킹의 기본 뼈대로 알맞은 것은?
    choices:
      - 정렬 → 이진 탐색
      - 선택 → 재귀로 다음 단계 탐색 → 선택 되돌리기
      - 표 채우기 → 거꾸로 복원
      - 분할 → 병합
    answerIndex: 1
    explanation: 하나를 선택해 더 깊이 들어가 보고, 돌아오면 그 선택을 취소한 뒤 다음 선택을 시도합니다. 되돌리기 덕분에 하나의 상태(path, used)를 모든 경로가 함께 쓸 수 있습니다.
  - id: quiz-day80-02
    question: 원소 n개의 부분집합과 순열의 개수는?
    choices:
      ["둘 다 2ⁿ", "부분집합 2ⁿ, 순열 n!", "부분집합 n!, 순열 2ⁿ", "둘 다 n²"]
    answerIndex: 1
    explanation: 부분집합은 원소마다 '넣는다/넣지 않는다' 두 선택이라 2ⁿ, 순열은 첫 자리 n가지, 둘째 자리 n-1가지 … 라서 n!입니다. 둘 다 n이 조금만 커져도 폭발적으로 늘어납니다.
  - id: quiz-day80-03
    question: N-퀸에서 두 퀸 (r1, c1), (r2, c2)가 같은 대각선에 있는지 확인하는 조건은?
    choices:
      - "r1 == r2"
      - "r1 + c1 == r2 + c2 또는 r1 - c1 == r2 - c2"
      - "c1 == c2 + 1"
      - "r1 * c1 == r2 * c2"
    answerIndex: 1
    explanation: 한 방향 대각선에서는 행 + 열이, 다른 방향에서는 행 - 열이 일정합니다. 그래서 두 값을 배열 인덱스로 써서 대각선마다 '이미 퀸이 있는가'를 O(1)에 기록할 수 있습니다.
  - id: quiz-day80-04
    question: 가지치기(pruning)에 대한 설명으로 옳은 것은?
    choices:
      - 답의 일부를 일부러 버려 속도를 높인다
      - 이 길로 가면 답이 나올 수 없다는 것이 확실할 때, 그 아래를 탐색하지 않고 되돌아온다
      - 트리의 잎만 방문한다
      - 재귀 대신 반복문을 쓴다
    answerIndex: 1
    explanation: 가지치기는 결과를 바꾸지 않고 불필요한 탐색만 줄여야 합니다. 확실하지 않은 조건으로 잘라 내면 답을 놓칩니다. 최악의 경우 복잡도는 그대로일 수 있지만 실제 방문 수가 크게 줄어듭니다.
  - id: quiz-day80-05
    question: "Python 백트래킹에서 result.append(path) 대신 result.append(path[:])를 쓰는 이유는?"
    choices:
      - 속도가 더 빠르기 때문에
      - path는 탐색이 계속되면서 바뀌므로, 지금의 모습을 복사해 두지 않으면 결과가 모두 같은(마지막 상태의) 리스트를 가리키기 때문에
      - 문법 오류를 피하려고
      - 메모리를 줄이려고
    answerIndex: 1
    explanation: append(path)는 같은 리스트 객체를 여러 번 넣는 것이라, 탐색이 끝나 path가 비면 결과가 모두 빈 리스트가 됩니다(Day 31의 별칭). Rust에서 path.clone(), C에서 배열 내용을 출력하거나 복사하는 것도 같은 이유입니다.
---

## 1. 오늘 배울 내용

미로에서 길을 찾는 방법을 떠올려 봅시다. 갈림길에서 한쪽을 골라 가 보고, 막다른 길이면 **갈림길로 되돌아와** 다른 쪽을 갑니다. 이것이 **백트래킹(backtracking)** 입니다. 모든 가능성을 체계적으로 시도하는 방법이지만, **안 될 것이 뻔한 길은 일찍 포기**해서 완전 탐색보다 훨씬 빠르게 만들 수 있습니다.

1. 가능한 선택들을 **상태 공간 트리**로 그리고, 백트래킹이 그 트리를 도는 방법임을 이해합니다.
2. **선택 → 재귀 → 되돌리기**라는 뼈대 하나로 **부분집합**과 **순열**을 모두 만듭니다.
3. **N-퀸** 문제를 C, Python, Rust로 풀고, 열과 대각선을 기록해 충돌을 한 번에 검사합니다.
4. **가지치기**가 방문하는 상태의 수를 얼마나 줄이는지 측정합니다.
5. 응용으로 **부분집합의 합** 문제를 가지치기 전후로 비교합니다.

## 2. 왜 백트래킹인가

"8×8 체스판에 퀸 8개를 서로 공격하지 않게 놓는 방법은 몇 가지일까?" 퀸 8개를 놓을 칸을 64칸 중에서 고르는 모든 경우는 약 44억 가지입니다. 하나씩 확인하는 것은 너무 많습니다.

조금만 생각하면 줄일 수 있습니다. 퀸은 같은 줄을 공격하므로 **줄마다 하나씩** 놓으면 됩니다. 그러면 8⁸ ≈ 1,677만 가지입니다. 여기서 더 나아가, **첫 줄과 둘째 줄의 퀸이 이미 서로 공격한다면 나머지 여섯 줄은 볼 필요도 없습니다.** 이렇게 "지금까지의 선택이 이미 틀렸다면 그 아래는 탐색하지 않는" 방법으로 8-퀸은 약 2,000개의 상태만 방문하고 92개의 해를 모두 찾습니다(5절).

백트래킹이 쓰이는 곳은 다양합니다.

- 스도쿠, 퍼즐, 미로 풀기
- 모든 조합·순열·부분집합 만들기(시험 문제 배치, 팀 나누기)
- 조건을 만족하는 배치 찾기(시간표 짜기, 좌석 배치)
- 게임의 모든 수 읽기(틱택토)

## 3. 그림으로 이해하기

`[a, b, c]`의 부분집합을 만드는 **상태 공간 트리**입니다. 층마다 원소 하나를 "넣는다(○)" 또는 "넣지 않는다(×)"를 결정합니다.

```text
                           []
               a○ ┌────────┴────────┐ a×
                 [a]                []
           b○ ┌───┴───┐ b×     b○ ┌──┴──┐ b×
           [a,b]     [a]        [b]     []
         c○┌┴┐c×   c○┌┴┐c×   c○┌┴┐c×  c○┌┴┐c×
     [a,b,c][a,b] [a,c][a]  [b,c][b]  [c] []      ← 잎 8개 = 부분집합 2³개
```

백트래킹은 이 트리를 **깊이 우선**으로 돕니다. 왼쪽 끝 잎 `[a,b,c]`까지 내려간 뒤 한 칸 올라가(**되돌리기**: c를 뺌) 오른쪽 잎 `[a,b]`로, 다시 올라가 … 하는 식입니다. 트리 전체를 메모리에 만들지 않고 **지금 경로(path) 하나만** 들고 다닌다는 점이 중요합니다.

## 4. 천천히 풀어보기

### 4.1 선택 → 재귀 → 되돌리기

모든 백트래킹은 같은 모양입니다.

```text
visit(지금까지의 선택):
    다 골랐다면 → 결과로 기록하고 돌아간다          ← 멈춤 조건
    가능한 선택 x마다:
        (가지치기: x가 조건을 어기면 건너뛴다)
        ① x를 선택한다    (path에 넣기, 사용 표시)
        ② visit(...)      (한 단계 더 들어가기)
        ③ x를 되돌린다    (path에서 빼기, 사용 표시 지우기)
```

③의 **되돌리기**가 백트래킹이라는 이름의 뜻입니다. ①에서 바꾼 것을 ③에서 정확히 원래대로 돌려놓아야 다음 선택 x가 **깨끗한 상태**에서 시작할 수 있습니다. 되돌리기를 빠뜨리면 첫 경로만 탐색하고 끝납니다(실습의 디버그 문제).

### 4.2 부분집합과 순열

| 문제      | 층의 의미         | 한 층의 선택                          | 결과 수 |
| --------- | ----------------- | ------------------------------------- | ------- |
| 부분집합  | i번째 원소        | 넣는다 / 넣지 않는다 (2가지)          | 2ⁿ      |
| 순열      | i번째 자리        | 아직 쓰지 않은 원소 중 하나 (n-i가지) | n!      |
| 조합(k개) | i번째로 고를 원소 | 앞에서 고른 것보다 뒤의 원소          | C(n, k) |

순열은 "이미 쓴 원소"를 `used` 배열로 기록합니다. 조합은 **앞에서 고른 것보다 뒤의 원소만** 고르게 해서(`start` 매개변수) 같은 조합이 순서만 바뀌어 여러 번 나오는 것을 막습니다.

### 4.3 N-퀸: 충돌을 O(1)에 검사하기

줄(행)마다 퀸 하나를 놓으므로 같은 행 충돌은 없습니다. 검사할 것은 **같은 열**과 **두 대각선**입니다.

```text
      c=0 1 2 3
  r=0   .  .  .  .       ↙ 방향 대각선: r + c 가 같다  (0 ~ 2n-2)
  r=1   .  .  .  .       ↘ 방향 대각선: r - c 가 같다  (-(n-1) ~ n-1 → n-1을 더해 0 ~ 2n-2)
  r=2   .  .  .  .
  r=3   .  .  .  .
```

그래서 세 개의 bool 배열 `col_used[c]`, `diag1[r + c]`, `diag2[r - c + n - 1]`에 "이미 퀸이 있다"를 기록하면, 칸 (r, c)가 공격받는지 **세 칸만 보고** 알 수 있습니다. 퀸을 놓을 때 세 곳을 true로, 되돌릴 때 false로 바꿉니다.

### 4.4 가지치기: 안 될 길은 들어가지 않는다

N-퀸에서 "공격받는 칸에는 놓지 않는다"가 가지치기입니다. 가지치기가 없다면 줄마다 n가지를 모두 시도해 nⁿ개의 배치를 만든 뒤 마지막에 검사해야 합니다. 8-퀸이면 약 1,677만 개입니다. 가지치기가 있으면 둘째 줄에서 이미 충돌하는 배치는 그 아래 여섯 줄을 모두 건너뜁니다.

좋은 가지치기 조건의 조건은 하나입니다. **"이 길에서는 답이 절대 나올 수 없다"는 것이 확실해야 합니다.** 확실하지 않은 조건으로 자르면 답을 놓칩니다.

## 5. C로 구현하기

C 프로그램은 순열을 출력하고, 6-퀸의 첫 해를 판으로 그린 뒤, n = 4~8에서 해의 개수와 방문한 상태의 수를 셉니다.

```c
// 파일: backtracking.c
#include <stdio.h>
#include <stdbool.h>

#define MAX_N 10

int n;
int queen_col[MAX_N];           // queen_col[r] = r번째 줄에 놓은 퀸의 열
bool col_used[MAX_N];
bool diag1[2 * MAX_N];          // r + c 가 같은 대각선 (↙ 방향)
bool diag2[2 * MAX_N];          // r - c + n - 1 이 같은 대각선 (↘ 방향)
long long solutions = 0, visits = 0;
bool printed = false;

void print_board(void) {
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            printf(c == queen_col[r] ? "Q " : ". ");
        }
        printf("\n");
    }
}

void place(int r) {
    visits++;
    if (r == n) {                           // 모든 줄에 놓았다 = 해 하나
        solutions++;
        if (!printed) {
            print_board();
            printed = true;
        }
        return;
    }
    for (int c = 0; c < n; c++) {
        if (col_used[c] || diag1[r + c] || diag2[r - c + n - 1]) {
            continue;                       // 가지치기: 공격받는 칸은 시도하지 않는다
        }
        queen_col[r] = c;                   // ① 선택
        col_used[c] = diag1[r + c] = diag2[r - c + n - 1] = true;
        place(r + 1);                       // ② 다음 줄로
        col_used[c] = diag1[r + c] = diag2[r - c + n - 1] = false;   // ③ 되돌리기
    }
}

// 1..k 의 순열을 사전순으로 출력
int perm[MAX_N];
bool used[MAX_N + 1];

void permute(int depth, int k) {
    if (depth == k) {
        for (int i = 0; i < k; i++) printf("%d", perm[i]);
        printf(" ");
        return;
    }
    for (int x = 1; x <= k; x++) {
        if (used[x]) continue;
        used[x] = true;
        perm[depth] = x;
        permute(depth + 1, k);
        used[x] = false;
    }
}

int main(void) {
    printf("1~3의 순열: ");
    permute(0, 3);
    printf("\n");

    n = 6;
    printf("6-퀸의 첫 해:\n");
    place(0);
    printf("6-퀸: 해 %lld개, 방문한 상태 %lld개\n", solutions, visits);

    for (n = 4; n <= 8; n++) {
        solutions = visits = 0;
        printed = true;
        place(0);
        printf("n=%d: 해 %3lld개, 방문 %6lld\n", n, solutions, visits);
    }
    return 0;
}
```

실행 결과:

```text
1~3의 순열: 123 132 213 231 312 321
6-퀸의 첫 해:
. Q . . . .
. . . Q . .
. . . . . Q
Q . . . . .
. . Q . . .
. . . . Q .
6-퀸: 해 4개, 방문한 상태 153개
n=4: 해   2개, 방문     17
n=5: 해  10개, 방문     54
n=6: 해   4개, 방문    153
n=7: 해  40개, 방문    552
n=8: 해  92개, 방문   2057
```

### 코드 한 부분씩 읽기

| 코드                                                                     | 설명                                                                                                                                                                   |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bool col_used[MAX_N]; bool diag1[2 * MAX_N]; bool diag2[2 * MAX_N];`    | 4.3절의 세 기록입니다. 대각선은 2n - 1개씩 있어서 크기를 2n으로 잡았습니다.                                                                                            |
| `if (r == n)`                                                            | 모든 줄에 퀸을 놓았으면 해 하나입니다. 멈춤 조건이 **성공**을 뜻합니다.                                                                                                |
| `if (col_used[c] \|\| diag1[r + c] \|\| diag2[r - c + n - 1]) continue;` | 가지치기입니다. 공격받는 칸은 재귀에 들어가지도 않습니다.                                                                                                              |
| `col_used[c] = diag1[r + c] = diag2[r - c + n - 1] = true;`              | ① 선택. 대입이 오른쪽부터 계산되어 세 곳 모두 true가 됩니다.                                                                                                           |
| `place(r + 1);`                                                          | ② 다음 줄로 들어갑니다.                                                                                                                                                |
| `... = false;`                                                           | ③ 되돌리기. `queen_col[r]`은 되돌리지 않아도 됩니다. 다음 선택이 같은 칸을 덮어쓰기 때문입니다. **다른 선택의 가능 여부에 영향을 주는 상태**만 반드시 되돌려야 합니다. |
| `visits++`                                                               | `place`가 불린 횟수, 즉 트리에서 방문한 노드 수입니다. 8-퀸은 2,057개만 방문했습니다. 가지치기 없이 8⁸개를 만들었다면 약 1,677만 개입니다.                             |
| `printf(c == queen_col[r] ? "Q " : ". ");`                               | 형식 문자열에 `%`가 없으면 그대로 출력됩니다. 조건 연산자로 둘 중 하나를 골랐습니다.                                                                                   |

n = 6의 해가 4개로 n = 5의 10개보다 **적다**는 점이 흥미롭습니다. 해의 개수는 n에 따라 규칙 없이 변하며, 방문 수는 n이 하나 늘 때마다 약 3~4배씩 늘어납니다.

## 6. Python으로 구현하기

Python 버전은 같은 뼈대로 부분집합, 순열, N-퀸을 만듭니다. 중첩 함수가 바깥 변수(`path`, `result`)를 함께 쓰는 **클로저** 방식입니다.

```python
# 파일: backtracking.py
def subsets(items):
    result, path = [], []

    def visit(i):
        if i == len(items):
            result.append(path[:])          # 복사해서 저장 (path는 계속 바뀐다)
            return
        path.append(items[i])               # ① items[i]를 넣는 경우
        visit(i + 1)
        path.pop()                          # ② 되돌리고
        visit(i + 1)                        # ③ 넣지 않는 경우

    visit(0)
    return result


def permutations(items):
    result, path, used = [], [], [False] * len(items)

    def visit():
        if len(path) == len(items):
            result.append("".join(path))
            return
        for i, x in enumerate(items):
            if not used[i]:
                used[i] = True
                path.append(x)
                visit()
                path.pop()
                used[i] = False

    visit()
    return result


def n_queens(n):
    count, visits = 0, 0
    cols, d1, d2 = set(), set(), set()

    def place(r):
        nonlocal count, visits
        visits += 1
        if r == n:
            count += 1
            return
        for c in range(n):
            if c in cols or (r + c) in d1 or (r - c) in d2:
                continue
            cols.add(c); d1.add(r + c); d2.add(r - c)
            place(r + 1)
            cols.remove(c); d1.remove(r + c); d2.remove(r - c)

    place(0)
    return count, visits


print("부분집합:", subsets(["a", "b", "c"]))
print("순열:", permutations("ABC"))
for n in [4, 6, 8]:
    print(f"{n}-퀸: (해, 방문) = {n_queens(n)}")
```

실행 결과:

```text
부분집합: [['a', 'b', 'c'], ['a', 'b'], ['a', 'c'], ['a'], ['b', 'c'], ['b'], ['c'], []]
순열: ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA']
4-퀸: (해, 방문) = (2, 17)
6-퀸: (해, 방문) = (4, 153)
8-퀸: (해, 방문) = (92, 2057)
```

### 코드 한 부분씩 읽기

| 코드                                                            | 설명                                                                                                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `result.append(path[:])`                                        | **복사본**을 저장합니다. `path` 자체를 넣으면 모든 결과가 같은 리스트를 가리켜서, 탐색이 끝나 path가 빈 리스트가 되면 결과도 모두 빈 리스트가 됩니다(12절 실수 3). |
| `path.append(items[i]); visit(i + 1); path.pop(); visit(i + 1)` | 3절 트리의 왼쪽(넣음)과 오른쪽(넣지 않음) 가지입니다. 넣는 쪽을 먼저 탐색해서 결과가 `[a, b, c]`부터 나옵니다.                                                     |
| `def visit(): ...` (함수 안의 함수)                             | 바깥 함수의 `result`, `path`, `used`를 매개변수 없이 쓸 수 있습니다. 리스트는 **바꾸기만** 하므로(`append`, 인덱스 대입) 따로 선언할 필요가 없습니다.              |
| `nonlocal count, visits`                                        | 정수는 **새 값을 대입**해야 바뀌므로, 바깥 함수의 변수라고 `nonlocal`로 알려야 합니다. 없으면 안쪽에 같은 이름의 새 지역 변수가 생겨 오류가 납니다.                |
| `cols, d1, d2 = set(), set(), set()`                            | C의 bool 배열 대신 집합에 "사용한 열·대각선"을 넣었습니다. Python에서는 `r - c`가 음수여도 집합의 원소로 쓸 수 있어 `n - 1`을 더할 필요가 없습니다.                |
| `cols.add(c); d1.add(r + c); d2.add(r - c)`                     | 한 줄에 여러 문장을 `;`로 이었습니다. 선택과 되돌리기가 짝을 이루도록 나란히 썼습니다.                                                                             |

## 7. Rust로 구현하기

Rust 버전은 공유 상태를 `&mut`로 넘기는 함수(순열)와, 상태를 구조체에 모은 메서드(N-퀸) 두 방식을 보여 줍니다.

```rust
// 파일: backtracking.rs
fn permutations(items: &[char], path: &mut Vec<char>, used: &mut Vec<bool>, out: &mut Vec<String>) {
    if path.len() == items.len() {
        out.push(path.iter().collect());
        return;
    }
    for i in 0..items.len() {
        if used[i] {
            continue;
        }
        used[i] = true;
        path.push(items[i]);
        permutations(items, path, used, out);
        path.pop();                                 // 되돌리기
        used[i] = false;
    }
}

struct Queens {
    n: usize,
    cols: Vec<bool>,
    d1: Vec<bool>,
    d2: Vec<bool>,
    board: Vec<usize>,
    solutions: u64,
    first: Option<Vec<usize>>,
}

impl Queens {
    fn new(n: usize) -> Self {
        Queens {
            n,
            cols: vec![false; n],
            d1: vec![false; 2 * n],
            d2: vec![false; 2 * n],
            board: Vec::new(),
            solutions: 0,
            first: None,
        }
    }

    fn place(&mut self, r: usize) {
        if r == self.n {
            self.solutions += 1;
            if self.first.is_none() {
                self.first = Some(self.board.clone());
            }
            return;
        }
        for c in 0..self.n {
            let (a, b) = (r + c, r + self.n - 1 - c);
            if self.cols[c] || self.d1[a] || self.d2[b] {
                continue;
            }
            self.cols[c] = true;
            self.d1[a] = true;
            self.d2[b] = true;
            self.board.push(c);
            self.place(r + 1);
            self.board.pop();
            self.cols[c] = false;
            self.d1[a] = false;
            self.d2[b] = false;
        }
    }
}

fn main() {
    let items = ['X', 'Y', 'Z'];
    let mut out = Vec::new();
    permutations(&items, &mut Vec::new(), &mut vec![false; 3], &mut out);
    println!("순열: {:?}", out);

    for n in [4, 5, 8] {
        let mut q = Queens::new(n);
        q.place(0);
        println!("{n}-퀸: 해 {}개, 첫 해의 열 {:?}", q.solutions, q.first.unwrap_or_default());
    }
}
```

실행 결과:

```text
순열: ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"]
4-퀸: 해 2개, 첫 해의 열 [1, 3, 0, 2]
5-퀸: 해 10개, 첫 해의 열 [0, 2, 4, 1, 3]
8-퀸: 해 92개, 첫 해의 열 [0, 4, 7, 5, 2, 6, 1, 3]
```

### 코드 한 부분씩 읽기

| 코드                                                                                                 | 설명                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn permutations(items: &[char], path: &mut Vec<char>, used: &mut Vec<bool>, out: &mut Vec<String>)` | 읽기만 하는 입력은 `&`, 탐색 중에 바뀌는 상태와 결과는 `&mut`로 빌립니다. 모든 재귀 호출이 **같은** path와 used를 씁니다.                                |
| `out.push(path.iter().collect());`                                                                   | 지금 path의 글자들로 **새 String**을 만들어 저장합니다. Python의 `path[:]`와 같은 역할입니다.                                                            |
| `struct Queens { n, cols, d1, d2, board, solutions, first }`                                         | 재귀가 공유하는 상태가 많으면 구조체에 모으고 `&mut self` 메서드로 재귀하는 것이 깔끔합니다. 매개변수를 여러 개 넘기지 않아도 됩니다.                    |
| `let (a, b) = (r + c, r + self.n - 1 - c);`                                                          | 두 대각선의 인덱스입니다. `usize`라서 `r - c`가 음수가 될 수 없으므로 `r + n - 1 - c`로 순서를 바꿔 계산했습니다(Day 60의 음수 나머지 문제와 같은 주의). |
| `self.board.push(c); self.place(r + 1); self.board.pop();`                                           | C와 달리 퀸의 위치를 Vec에 쌓았다 빼므로 board도 되돌려야 합니다. 대신 board의 길이가 곧 현재 줄 번호입니다.                                             |
| `self.first = Some(self.board.clone());`                                                             | 첫 해만 복사해 둡니다. `is_none()`으로 이미 저장했는지 확인합니다.                                                                                       |
| `q.first.unwrap_or_default()`                                                                        | 해가 없으면(예: n = 2, 3) 빈 Vec을 출력합니다.                                                                                                           |

## 8. 실행 추적

C 프로그램의 4-퀸 탐색 앞부분을 따라갑니다. `(r, c)`는 r번째 줄의 c열입니다.

| 단계 | 시도한 칸     | 결과                                       | 되돌리기            |
| ---: | ------------- | ------------------------------------------ | ------------------- |
|    1 | (0, 0)        | 놓음                                       |                     |
|    2 | (1, 0) (1, 1) | 열·대각선 충돌 → 건너뜀                    |                     |
|    3 | (1, 2)        | 놓음                                       |                     |
|    4 | (2, 0)~(2, 3) | 모두 충돌 → 막힘                           | (1, 2) 취소         |
|    5 | (1, 3)        | 놓음                                       |                     |
|    6 | (2, 1)        | 놓음                                       |                     |
|    7 | (3, 0)~(3, 3) | 모두 충돌 → 막힘                           | (2, 1), (1, 3) 취소 |
|    8 |               | 둘째 줄 선택지 끝 → 첫 줄로                | (0, 0) 취소         |
|    9 | (0, 1)        | 놓음 → (1, 3) → (2, 0) → (3, 2) → **해 1** |                     |

첫 줄 0열로는 해가 없다는 것을 알아내는 데 몇 단계가 걸렸지만, 막힌 순간마다 **바로 윗단계로 되돌아와** 다른 칸을 시도했습니다. 4단계에서 셋째 줄이 모두 막혔을 때 넷째 줄은 아예 보지 않은 것이 가지치기입니다.

## 9. 다른 예제로 다시 이해하기

숫자들 중에서 몇 개를 골라 합이 정확히 목표값이 되게 하는 **부분집합의 합** 문제를 봅시다. 모든 부분집합을 만들면 2ⁿ개입니다. 여기에 가지치기 두 가지를 더합니다. 숫자를 **작은 것부터 정렬**해 두면, ① 지금까지의 합에 다음 숫자를 더해 목표를 넘으면 그 뒤의 숫자는 더 크므로 **이 층의 나머지를 모두 건너뛸** 수 있고, ② 지금까지의 합에 **남은 숫자를 전부 더해도** 목표에 못 미치면 이 길은 포기해도 됩니다. 두 조건 모두 "이 길에서는 답이 나올 수 없다"가 확실한 경우입니다. 결과는 같고 방문 수만 줄어듭니다.

```python
# 파일: subset_sum.py
def solve(nums, target, prune):
    nums = sorted(nums)
    suffix = [0] * (len(nums) + 1)                  # suffix[i] = nums[i:]의 합
    for i in range(len(nums) - 1, -1, -1):
        suffix[i] = suffix[i + 1] + nums[i]
    found, path, visits = [], [], 0

    def visit(i, total):
        nonlocal visits
        visits += 1
        if total == target:
            found.append(path[:])
            return
        if i == len(nums):
            return
        if prune and total + suffix[i] < target:    # 남은 것을 다 더해도 모자람
            return
        for j in range(i, len(nums)):
            if prune and total + nums[j] > target:  # 정렬되어 있으니 뒤는 더 크다
                break
            path.append(nums[j])
            visit(j + 1, total + nums[j])
            path.pop()

    visit(0, 0)
    return found, visits


nums = [8, 6, 7, 5, 3, 10, 9, 2, 4, 1]
for prune in [False, True]:
    found, visits = solve(nums, 15, prune)
    print(f"가지치기 {'있음' if prune else '없음'}: 답 {len(found)}개, 방문 {visits}번")
print("답 몇 개:", solve(nums, 15, True)[0][:4])
```

실행 결과:

```text
가지치기 없음: 답 20개, 방문 901번
가지치기 있음: 답 20개, 방문 119번
답 몇 개: [[1, 2, 3, 4, 5], [1, 2, 3, 9], [1, 2, 4, 8], [1, 2, 5, 7]]
```

같은 20개의 답을 찾으면서 방문은 901번에서 119번으로 줄었습니다. 가지치기가 없어도 1,024번(2¹⁰)보다 적은 이유는 합이 목표에 닿는 순간 더 들어가지 않고 돌아오기 때문입니다. 숫자가 많아질수록 차이는 더 커집니다.

Rust로 같은 문제의 **답 개수만** 세어 봅시다. 결과를 모으지 않으므로 path도 필요 없습니다.

```rust
// 파일: subset_sum.rs
fn count(nums: &[u32], i: usize, remaining: u32) -> u64 {
    if remaining == 0 {
        return 1;
    }
    let mut total = 0;
    for j in i..nums.len() {
        if nums[j] > remaining {
            break;                                  // 정렬되어 있으므로 뒤는 모두 크다
        }
        total += count(nums, j + 1, remaining - nums[j]);
    }
    total
}

fn main() {
    let mut nums = vec![8, 6, 7, 5, 3, 10, 9, 2, 4, 1];
    nums.sort();
    for target in [15, 1, 55, 56] {
        println!("합이 {target}인 부분집합: {}개", count(&nums, 0, target));
    }
}
```

실행 결과:

```text
합이 15인 부분집합: 20개
합이 1인 부분집합: 1개
합이 55인 부분집합: 1개
합이 56인 부분집합: 0개
```

"남은 합"을 매개변수로 넘기면 `remaining - nums[j]`가 음수가 될 일이 없도록 `nums[j] > remaining`에서 먼저 멈춥니다. u32의 뺄셈이 넘치지 않는 것도 이 가지치기 덕분입니다.

## 10. 시간·공간 복잡도

| 문제            | 가지치기 없는 상태 수 | 실제 방문(예)  | 공간(재귀 깊이 + 상태) |
| --------------- | --------------------- | -------------- | ---------------------- |
| 부분집합        | 2ⁿ                    | 2ⁿ (모두 답)   | O(n)                   |
| 순열            | n!                    | n! (모두 답)   | O(n)                   |
| N-퀸            | nⁿ                    | 8-퀸 2,057     | O(n)                   |
| 부분집합의 합   | 2ⁿ                    | 10개 901 → 119 | O(n)                   |
| 올바른 괄호 n쌍 | 2²ⁿ                   | 카탈란 수 정도 | O(n)                   |

백트래킹의 **최악의 경우**는 여전히 지수 시간입니다. 가지치기는 실제 방문 수를 크게 줄이지만 복잡도의 등급을 바꾸지 못할 때가 많습니다. 결과 자체가 지수 개라면(부분집합, 순열) 더 빨라질 수 없습니다. 반면 공간은 **지금 경로 하나**만 들고 다니므로 O(n)으로 매우 작습니다.

## 11. 세 언어 비교

| 관점                | C                           | Python                                              | Rust                                      |
| ------------------- | --------------------------- | --------------------------------------------------- | ----------------------------------------- |
| 공유 상태           | 전역 배열                   | 바깥 함수의 변수(클로저), `nonlocal`                | `&mut` 매개변수 또는 구조체 + `&mut self` |
| 결과 저장           | 바로 출력하거나 배열에 복사 | `path[:]`로 복사                                    | `path.clone()`, `iter().collect()`        |
| 사용 표시           | `bool used[]`               | 리스트나 `set`                                      | `Vec<bool>`                               |
| 음수 인덱스(대각선) | `r - c + n - 1`             | 집합이면 음수도 가능                                | `usize`라 `r + n - 1 - c`로 순서 조정     |
| 표준 도구           | 없음                        | `itertools.permutations`, `combinations`, `product` | 표준에는 없음(외부 라이브러리 itertools)  |
| 깊은 재귀           | 스택 크기                   | 기본 약 1,000                                       | 스택 크기                                 |

Python의 `itertools`는 순열과 조합을 효율적으로 만들어 주지만 **가지치기를 넣을 수 없습니다.** 조건에 따라 탐색을 멈춰야 하는 문제는 직접 백트래킹을 짜야 합니다.

## 12. 자주 하는 실수

### 실수 1: 되돌리기를 빠뜨린다

실습의 디버그 문제입니다. `used[i] = false`를 빠뜨리면 첫 경로를 탐색한 뒤 모든 원소가 "사용됨"으로 남아 다른 경로를 만들 수 없습니다. 선택할 때 바꾼 상태를 **짝을 맞춰** 되돌리세요.

### 실수 2: 되돌리기의 위치가 틀린다

되돌리기는 재귀 호출이 **돌아온 다음**이어야 합니다. 호출 전에 되돌리면 재귀 안에서 같은 원소를 다시 고를 수 있게 됩니다.

### 실수 3: 결과를 복사하지 않고 저장한다

```python
# 파일: shared_path.py
out, path = [], []


def visit(i):
    if i == 2:
        out.append(path)           # 복사하지 않았다
        return
    for x in "ab":
        path.append(x)
        visit(i + 1)
        path.pop()


visit(0)
print(out)
```

실행 결과:

```text
[[], [], [], []]
```

네 번 저장했지만 모두 **같은 리스트 객체**를 가리키고, 탐색이 끝난 뒤 그 리스트는 비어 있습니다. `out.append(path[:])`나 `out.append(list(path))`로 복사하세요.

### 실수 4: 틀린 가지치기로 답을 놓친다

부분집합의 합에서 숫자를 **정렬하지 않고** "다음 숫자를 더해 넘으면 break"를 쓰면, 뒤에 더 작은 숫자가 있을 수 있어 답을 놓칩니다. 가지치기 조건이 **정렬 같은 전제**에 기대고 있다면 그 전제가 지켜지는지 확인하세요.

### 실수 5: 같은 답을 여러 번 만든다

조합을 만들 때 `start` 없이 매번 처음부터 고르면 `[1, 2]`와 `[2, 1]`을 다른 답으로 만듭니다. 순서가 상관없는 문제라면 **앞에서 고른 것보다 뒤의 원소만** 고르게 하세요.

## 13. Q&A

**Q. 백트래킹과 깊이 우선 탐색(DFS)은 같은 것인가요?**

A. 백트래킹은 **선택의 트리**를 깊이 우선으로 도는 것이라 DFS의 한 형태입니다. 차이는 DFS(Day 81)가 이미 있는 **그래프**를 도는 반면, 백트래킹은 트리를 미리 만들지 않고 **선택을 하면서** 만들어 간다는 것입니다. 또 백트래킹은 되돌리기와 가지치기를 강조합니다.

**Q. 스도쿠도 백트래킹으로 푸나요?**

A. 네. 빈칸 하나를 골라 1~9 중 행·열·3×3 칸에 없는 숫자를 넣어 보고, 다음 빈칸으로 들어갑니다. 넣을 숫자가 없으면 되돌아옵니다. 후보가 **가장 적은 빈칸부터** 채우는 가지치기를 더하면 대부분의 스도쿠를 순식간에 풉니다.

**Q. 백트래킹과 동적 계획법을 함께 쓸 수 있나요?**

A. 백트래킹 중에 **같은 상태**(예: 같은 i와 같은 남은 합)를 여러 번 만난다면 그 결과를 메모해 두면 됩니다. 그러면 Day 79의 메모이제이션이 됩니다. 부분집합의 합의 **개수**는 이렇게 동적 계획법으로 바꿀 수 있습니다. 반면 모든 답을 **나열**해야 한다면 답 자체가 많아서 백트래킹이 필요합니다.

**Q. 결과가 너무 많으면 어떻게 하나요?**

A. 모든 답이 필요한지 다시 생각해 보세요. 개수만 필요하면 세기만 하고(9절 Rust), 하나만 필요하면 찾는 순간 멈추고, 가장 좋은 하나가 필요하면 지금까지의 최선보다 나빠질 길을 자르는 **분기 한정(branch and bound)** 을 씁니다.

## 14. 핵심 요약

- 백트래킹은 **선택 → 재귀로 들어가기 → 선택 되돌리기**를 반복하며 가능한 모든 선택을 깊이 우선으로 탐색합니다.
- 부분집합(2ⁿ), 순열(n!), 조합, N-퀸이 모두 같은 뼈대로 풀립니다.
- **되돌리기**를 정확히 해야 하나의 상태를 모든 경로가 함께 쓸 수 있습니다. 결과를 저장할 때는 **복사**합니다.
- N-퀸은 열, r + c, r - c를 기록해 충돌을 O(1)에 검사합니다.
- **가지치기**는 답이 나올 수 없는 길을 미리 잘라 방문 수를 크게 줄입니다. 조건이 확실해야 답을 놓치지 않습니다.
- 최악의 경우는 여전히 지수 시간이지만, 공간은 경로 하나만큼인 O(n)입니다.

## 15. 도전 문제

1. **(C)** N-퀸의 해를 모두 판 모양으로 출력하되, 좌우 대칭인 해는 한 번만 출력해 보세요. 첫 줄의 퀸을 왼쪽 절반에만 놓고, n이 홀수일 때 가운데 열을 따로 처리하면 됩니다.
2. **(Python)** 4×4 스도쿠(숫자 1~4, 2×2 칸)를 백트래킹으로 푸는 함수를 만들고, 빈칸 몇 개를 채워 보세요.
3. **(Rust)** 중복된 숫자가 있는 목록 `[1, 1, 2]`의 **서로 다른** 순열만 만들어 보세요(`[1, 1, 2]`, `[1, 2, 1]`, `[2, 1, 1]`). 정렬한 뒤 "같은 층에서 앞의 같은 숫자를 아직 쓰지 않았다면 건너뛴다"는 조건을 씁니다.
4. **(세 언어)** 전화기 숫자 자판(2 = abc, 3 = def, …)에서 숫자 문자열 "23"으로 만들 수 있는 모든 글자 조합(ad, ae, af, bd, …)을 만드세요.
