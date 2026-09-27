---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-79-dynamic-programming
courseId: crp-92
phaseId: phase-07
dayNumber: 79
date: "2026-12-18"
title: 동적 계획법 — 작은 문제의 답을 표에 적어 두고 다시 쓰기
summary: 같은 부분 문제를 여러 번 푸는 재귀를 메모이제이션(위에서 아래로)과 표 채우기(아래에서 위로)로 바꿔 지수 시간을 다항 시간으로 줄입니다. 탐욕이 실패했던 최소 동전 수와 0/1 배낭 문제를 점화식으로 세우고 표를 채워 C, Python, Rust로 풀며, 표를 거꾸로 따라가 답을 복원하는 법과 두 문자열의 최장 공통 부분 수열(LCS)까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 120
prerequisites: [day-78-greedy]
learningObjectives:
  - 중복되는 부분 문제와 최적 부분 구조가 있는 문제를 알아본다.
  - 재귀에 메모를 더한 메모이제이션과 반복문으로 표를 채우는 방법을 비교해 구현한다.
  - 상태 정의, 점화식, 초기값, 계산 순서의 네 단계로 동적 계획법을 설계한다.
  - 최소 동전 수와 0/1 배낭 문제를 풀고, 표를 거꾸로 따라가 선택한 동전과 물건을 복원한다.
  - 2차원 표로 두 문자열의 최장 공통 부분 수열을 구한다.
concepts:
  [
    dynamic programming,
    overlapping subproblems,
    optimal substructure,
    memoization,
    tabulation,
    recurrence,
    coin change,
    0/1 knapsack,
    reconstruction,
    LCS,
  ]
runnerMode: python
playgroundSource: |
  # 파일: coins.py — 동전과 금액을 바꿔 표가 어떻게 채워지는지 보세요.
  coins = [1, 3, 4]
  amount = 10
  best = [0] + [float("inf")] * amount
  for m in range(1, amount + 1):
      for c in coins:
          if c <= m:
              best[m] = min(best[m], best[m - c] + 1)
      print(f"{m:>2}원: 최소 {best[m]}개")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day79-predict-py
    title: 최소 동전 수 표 예측하기
    kind: predict
    objective: 점화식으로 표를 앞에서부터 채우는 과정을 추적한다.
    prompt: "동전 {1, 5, 6}으로 금액 0~10원을 만드는 최소 개수 표를 예측하세요."
    starter: |-
      coins = [1, 5, 6]
      best = [0] + [99] * 10
      for m in range(1, 11):
          for c in coins:
              if c <= m:
                  best[m] = min(best[m], best[m - c] + 1)
      print(best)
    answer: "[0, 1, 2, 3, 4, 1, 1, 2, 3, 4, 2]"
    hint: "5원과 6원은 동전 하나입니다. 10원은 6 + 1 + 1 + 1 + 1(탐욕, 5개)이 아니라 5 + 5(2개)입니다. best[10] = best[5] + 1입니다."
    explanation: "각 칸은 '마지막에 어떤 동전을 썼는가'의 모든 경우 중 최소입니다. 10원은 마지막 동전이 5면 best[5] + 1 = 2, 6이면 best[4] + 1 = 5, 1이면 best[9] + 1 = 5이므로 2입니다. 탐욕(6부터)은 10원에서 5개를 씁니다."
    commonMistakes:
      - "10원을 탐욕처럼 6부터 써서 5로 적음"
      - "best[0]을 1로 생각함(0원은 동전 0개)"
    language: python
    verification: run
  - id: ex-day79-predict-c
    title: 메모 없는 재귀의 호출 횟수 예측하기
    kind: predict
    objective: 중복되는 부분 문제 때문에 호출이 폭발하는 것을 확인한다.
    prompt: "계단을 한 번에 1칸 또는 2칸 오를 때 n칸을 오르는 방법의 수를 재귀로 셉니다. n = 10일 때 방법의 수와 함수 호출 횟수를 공백으로 구분해 적으세요."
    starter: |-
      #include <stdio.h>

      int calls = 0;

      int ways(int n) {
          calls++;
          if (n <= 1) return 1;
          return ways(n - 1) + ways(n - 2);
      }

      int main(void) {
          int w = ways(10);
          printf("%d %d\n", w, calls);
          return 0;
      }
    answer: "89 177"
    hint: "방법의 수는 피보나치 수열(1, 1, 2, 3, 5, …)과 같습니다. 호출 횟수는 2 × 방법의 수 - 1입니다."
    explanation: "ways(10)은 ways(9)와 ways(8)을 부르고, ways(9)가 또 ways(8)을 부르는 식으로 같은 값을 수없이 다시 계산합니다. 답은 89인데 호출이 177번입니다. n = 40이면 호출이 약 3억 번으로 늘어납니다. 계산한 값을 적어 두면 n + 1번이면 됩니다."
    commonMistakes:
      - "호출 횟수를 n = 10번으로 적음"
      - "ways(0)을 0으로 생각함(0칸을 오르는 방법은 '아무것도 안 하기' 하나)"
    language: c
    verification: run
  - id: ex-day79-fill
    title: Rust 0/1 배낭의 거꾸로 도는 반복 채우기
    kind: fill
    objective: 1차원 표로 0/1 배낭을 풀 때 무게를 큰 쪽부터 돌아야 하는 이유를 이해한다.
    prompt: "빈칸에 cap을 capacity부터 w까지 거꾸로 도는 범위를 채우세요."
    starter: |-
      fn knapsack(items: &[(usize, u32)], capacity: usize) -> u32 {
          let mut best = vec![0u32; capacity + 1];
          for &(w, v) in items {
              for cap in _____ {
                  best[cap] = best[cap].max(best[cap - w] + v);
              }
          }
          best[capacity]
      }

      fn main() {
          let items = [(2, 3), (3, 4), (4, 5), (5, 6)];
          println!("{} {}", knapsack(&items, 5), knapsack(&items, 8));
      }
    answer: |-
      fn knapsack(items: &[(usize, u32)], capacity: usize) -> u32 {
          let mut best = vec![0u32; capacity + 1];
          for &(w, v) in items {
              for cap in (w..=capacity).rev() {
                  best[cap] = best[cap].max(best[cap - w] + v);
              }
          }
          best[capacity]
      }

      fn main() {
          let items = [(2, 3), (3, 4), (4, 5), (5, 6)];
          println!("{} {}", knapsack(&items, 5), knapsack(&items, 8));
      }
    output: "7 10"
    hint: "(w..=capacity).rev()는 capacity, capacity-1, …, w 순서입니다. 큰 쪽부터 갱신하면 best[cap - w]가 아직 이번 물건을 반영하지 않은 값입니다."
    explanation: "용량 5는 (2, 3) + (3, 4) = 7, 용량 8은 (3, 4) + (5, 6) = 10입니다. 작은 쪽부터 돌면 best[cap - w]가 이미 이번 물건을 담은 값이라 같은 물건을 여러 번 담게 됩니다(그것은 '개수 무제한 배낭' 문제입니다)."
    commonMistakes:
      - "w..=capacity로 앞에서부터 돌아 같은 물건을 여러 번 담음"
      - "0..=capacity로 돌아 cap - w가 음수(usize 넘침)가 됨"
    language: rust
    verification: run
  - id: ex-day79-modify
    title: Python 계단 오르기에 메모 추가하기
    kind: modify
    objective: 딕셔너리 메모로 중복 호출을 없애 지수 시간을 선형 시간으로 바꾼다.
    prompt: "ways(n)은 한 번에 1, 2, 3칸 오르는 방법의 수를 셉니다. memo 딕셔너리를 써서 같은 n을 다시 계산하지 않게 고치고, n = 30의 답과 실제 계산 횟수를 출력하세요."
    starter: |-
      calls = 0


      def ways(n):
          global calls
          calls += 1
          if n < 0:
              return 0
          if n == 0:
              return 1
          return ways(n - 1) + ways(n - 2) + ways(n - 3)


      print(ways(20), calls)
    answer: |-
      calls = 0
      memo = {}


      def ways(n):
          global calls
          if n < 0:
              return 0
          if n == 0:
              return 1
          if n in memo:
              return memo[n]
          calls += 1
          memo[n] = ways(n - 1) + ways(n - 2) + ways(n - 3)
          return memo[n]


      print(ways(30), calls)
    output: "53798080 30"
    hint: "계산하기 전에 memo에 있는지 먼저 확인하고, 계산이 끝나면 memo[n]에 저장한 뒤 돌려주세요."
    explanation: "메모 없이는 ways(20)만 해도 수십만 번 호출합니다. 메모를 쓰면 1부터 30까지 각각 한 번씩, 30번만 실제로 계산합니다. 이것이 위에서 아래로 가는 동적 계획법(메모이제이션)입니다. Python에서는 @functools.lru_cache를 붙여도 같은 효과를 얻습니다."
    commonMistakes:
      - "memo에 저장만 하고 조회하지 않아 여전히 모든 호출을 함"
      - "계산 전에 calls를 세서 메모에서 꺼낸 경우까지 셈"
    language: python
    verification: run
  - id: ex-day79-debug
    title: C 최소 동전 수의 초기값 버그 고치기
    kind: debug
    objective: 만들 수 없는 금액을 0으로 두면 틀린 최솟값이 퍼진다는 것을 확인한다.
    prompt: "이 코드는 best를 모두 0으로 시작해서 min을 구할 때 0이 계속 이깁니다. 만들 수 없는 금액을 뜻하는 큰 값으로 시작하도록 고쳐, 동전 {3, 5}로 7원은 만들 수 없음(-1), 11원은 3개가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int min_coins(int amount) {
          int coins[] = {3, 5};
          int best[32] = {0};
          for (int m = 1; m <= amount; m++) {
              for (int i = 0; i < 2; i++) {
                  int c = coins[i];
                  if (c <= m && best[m - c] + 1 < best[m]) best[m] = best[m - c] + 1;
              }
          }
          return best[amount];
      }

      int main(void) {
          printf("%d %d\n", min_coins(7), min_coins(11));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      #define INF 1000

      int min_coins(int amount) {
          int coins[] = {3, 5};
          int best[32];
          best[0] = 0;
          for (int m = 1; m <= amount; m++) {
              best[m] = INF;
              for (int i = 0; i < 2; i++) {
                  int c = coins[i];
                  if (c <= m && best[m - c] + 1 < best[m]) best[m] = best[m - c] + 1;
              }
          }
          return best[amount] >= INF ? -1 : best[amount];
      }

      int main(void) {
          printf("%d %d\n", min_coins(7), min_coins(11));
          return 0;
      }
    output: "-1 3"
    starterOutput: "0 0"
    hint: "최솟값을 구하는 칸은 '아직 방법을 모른다(무한대)'로 시작해야 합니다. 0원만 동전 0개로 시작합니다."
    explanation: "0으로 시작하면 모든 칸이 '동전 0개로 만들 수 있다'는 거짓 정보로 채워져 최솟값 비교가 아무 효과가 없습니다. 초기값은 점화식만큼 중요합니다. INF + 1이 넘치지 않도록 INF를 적당히 큰 값(여기서는 1000)으로 둡니다. 11원은 5 + 3 + 3입니다."
    commonMistakes:
      - "INT_MAX를 INF로 써서 best[m - c] + 1이 넘침"
      - "best[0]까지 INF로 둬서 어떤 금액도 만들 수 없게 됨"
    language: c
    verification: run
  - id: ex-day79-independent
    title: Rust로 최장 증가 부분 수열 길이 구하기
    kind: independent
    objective: "'여기서 끝나는 가장 긴 길이'라는 상태를 정의하고 O(n²) 동적 계획법으로 푼다."
    prompt: "수열에서 순서를 유지한 채 골라 만든 증가하는 부분 수열 중 가장 긴 것의 길이를 구하세요. lis[i] = a[i]로 끝나는 가장 긴 증가 부분 수열의 길이로 정의합니다. [10, 9, 2, 5, 3, 7, 101, 18]이면 4가 나와야 합니다."
    starter: |-
      fn main() {
          let a = [10, 9, 2, 5, 3, 7, 101, 18];
          println!("{}", a.len());
      }
    answer: |-
      fn longest_increasing(a: &[i32]) -> usize {
          let mut lis = vec![1; a.len()];
          for i in 0..a.len() {
              for j in 0..i {
                  if a[j] < a[i] {
                      lis[i] = lis[i].max(lis[j] + 1);
                  }
              }
          }
          lis.into_iter().max().unwrap_or(0)
      }

      fn main() {
          let a = [10, 9, 2, 5, 3, 7, 101, 18];
          println!("{}", longest_increasing(&a));
          println!("{}", longest_increasing(&[5, 4, 3]));
      }
    output: |-
      4
      1
    hint: "lis[i]는 a[i]만 고르면 1입니다. a[j] < a[i]인 앞의 j마다 lis[j] + 1을 후보로 삼아 가장 큰 값을 고르세요. 답은 모든 lis[i] 중 최댓값입니다."
    explanation: "2, 3, 7, 18(또는 2, 5, 7, 101)이 길이 4입니다. 답이 마지막 원소로 끝나지 않을 수 있으므로 lis의 최댓값을 봅니다. 상태를 '여기서 끝나는'으로 정하면 점화식이 간단해지는 경우가 많습니다(카데인 알고리즘과 같은 생각)."
    commonMistakes:
      - "lis[n-1]만 답으로 돌려줌"
      - "a[j] <= a[i]로 써서 같은 값도 증가로 셈"
    language: rust
    verification: run
quiz:
  - id: quiz-day79-01
    question: 동적 계획법을 쓸 수 있는 문제의 특징 두 가지는?
    choices:
      - 입력이 정렬되어 있고 원소가 모두 다르다
      - 같은 부분 문제가 여러 번 나오고, 부분 문제의 최적해로 전체 최적해를 만들 수 있다
      - 재귀가 없고 반복문만 있다
      - 답이 항상 하나뿐이다
    answerIndex: 1
    explanation: 중복되는 부분 문제가 있어야 답을 저장해 두는 이득이 있고, 최적 부분 구조가 있어야 저장한 답으로 큰 문제를 풀 수 있습니다. 부분 문제가 겹치지 않는다면 분할 정복으로 충분합니다.
  - id: quiz-day79-02
    question: 메모이제이션과 표 채우기의 차이로 옳은 것은?
    choices:
      - 메모이제이션은 틀린 답을 줄 수 있다
      - 메모이제이션은 재귀로 위에서 아래로 필요한 것만 계산하고, 표 채우기는 반복문으로 작은 것부터 모두 채운다
      - 표 채우기는 항상 더 느리다
      - 둘은 시간 복잡도가 다르다
    answerIndex: 1
    explanation: 두 방법 모두 각 부분 문제를 한 번씩만 풀어 보통 같은 시간 복잡도입니다. 메모이제이션은 원래 재귀를 조금만 고치면 되고, 표 채우기는 재귀 깊이 걱정이 없고 공간을 줄이기 쉽습니다.
  - id: quiz-day79-03
    question: 동전 {1, 3, 4}로 6원을 만드는 최소 개수를 동적 계획법으로 구하면?
    choices: ["1개", "2개 (3 + 3)", "3개 (4 + 1 + 1)", "6개"]
    answerIndex: 1
    explanation: best[6] = min(best[5] + 1, best[3] + 1, best[2] + 1) = min(3, 2, 3) = 2입니다. 탐욕은 3개였습니다(Day 78).
  - id: quiz-day79-04
    question: 0/1 배낭 표 table[i][w]의 뜻으로 알맞은 것은?
    choices:
      - i번째 물건의 무게
      - 앞의 i개 물건만 써서, 무게 합 w 이하로 얻을 수 있는 최대 가치
      - i개의 물건을 모두 담았을 때의 가치
      - 무게 w인 물건의 개수
    answerIndex: 1
    explanation: 상태를 이렇게 정의하면 i번째 물건을 담지 않는 경우 table[i-1][w]와 담는 경우 table[i-1][w - 무게] + 가치 중 큰 값이 table[i][w]입니다.
  - id: quiz-day79-05
    question: 물건 n개, 용량 W인 0/1 배낭 동적 계획법의 시간 복잡도는?
    choices: ["O(n)", "O(W)", "O(n × W)", "O(2ⁿ)"]
    answerIndex: 2
    explanation: "표의 칸이 (n + 1) × (W + 1)개이고 칸마다 O(1)에 계산합니다. 모든 부분집합을 시도하는 완전 탐색은 O(2ⁿ)입니다. W가 아주 크면(예: 10억) 이 방법도 느려진다는 점은 알아 두세요."
---

## 1. 오늘 배울 내용

Day 71에서 피보나치 수를 재귀로 구하면 F(30)에 호출이 약 270만 번이라고 했습니다. Day 78에서는 동전 {1, 3, 4}의 거스름돈과 0/1 배낭 문제에서 탐욕이 틀렸습니다. 오늘 배우는 **동적 계획법(Dynamic Programming, DP)** 은 두 문제를 모두 해결합니다. 아이디어는 한 줄입니다. **한 번 푼 작은 문제의 답을 적어 두고, 다시 필요하면 계산하지 말고 꺼내 쓴다.**

1. 재귀가 느린 이유인 **중복되는 부분 문제**를 확인합니다.
2. 해결 방법 두 가지: 재귀에 메모를 더하는 **메모이제이션**, 작은 문제부터 반복문으로 채우는 **표 채우기**.
3. 동적 계획법을 설계하는 **네 단계**(상태, 점화식, 초기값, 계산 순서).
4. **최소 동전 수**와 **0/1 배낭** 문제를 C, Python, Rust로 풀고, 표를 거꾸로 따라가 **어떤 동전과 물건을 골랐는지** 복원합니다.
5. 응용으로 두 문자열의 **최장 공통 부분 수열(LCS)** 을 2차원 표로 구합니다.

## 2. 왜 동적 계획법인가

F(5)를 정의 그대로 재귀로 구하면 이런 호출 트리가 됩니다.

```text
                         F(5)
                 ┌────────┴────────┐
               F(4)               F(3)          ← F(3)은 두 번 계산된다
            ┌────┴────┐         ┌──┴──┐
          F(3)      F(2)      F(2)   F(1)       ← F(2)는 세 번
         ┌──┴──┐   ┌──┴──┐   ┌──┴──┐
       F(2) F(1) F(1) F(0) F(1) F(0)
      ┌──┴──┐
    F(1) F(0)
```

F(3)을 두 번, F(2)를 세 번 계산합니다. n이 커지면 같은 계산이 기하급수적으로 늘어납니다. 그런데 **서로 다른 부분 문제는 F(0)부터 F(5)까지 6개뿐**입니다. 각각의 답을 한 번만 계산해 적어 두면 호출은 6번이면 됩니다. 문제 크기가 n일 때 O(2ⁿ)에 가까웠던 일이 O(n)이 됩니다.

동적 계획법이 통하는 문제의 조건은 두 가지입니다.

- **중복되는 부분 문제**: 같은 작은 문제가 여러 번 나온다. (없으면 저장해 둘 이유가 없다 → 분할 정복)
- **최적 부분 구조**: 작은 문제의 최적해로 큰 문제의 최적해를 만들 수 있다.

## 3. 그림으로 이해하기

동전 {1, 3, 4}로 각 금액을 만드는 최소 동전 수를 **0원부터** 표에 채워 나갑니다. 금액 m을 만드는 마지막 동전이 c라면, 그 앞은 금액 m - c를 만든 것입니다. 그러니 **best[m] = (모든 동전 c에 대해) best[m - c] + 1 중 최솟값**입니다.

```text
금액 m     0   1   2   3   4   5   6
best[m]    0   1   2   1   1   2   2
                                    ↑
best[6] = min( best[5]+1,  best[3]+1,  best[2]+1 )
               (마지막 1원)  (마지막 3원)  (마지막 4원)
        = min(     3,          2,          3     ) = 2   → 3 + 3
```

표의 각 칸은 **앞쪽 칸들만** 보고 계산되므로, 왼쪽부터 차례로 채우면 필요한 값이 항상 이미 준비되어 있습니다. 탐욕은 6원에서 "가장 큰 4원"만 봤지만, 동적 계획법은 **세 가지 마지막 동전을 모두 비교**합니다.

## 4. 천천히 풀어보기

### 4.1 두 가지 방법: 위에서 아래로, 아래에서 위로

| 방법                            | 모양                                                         | 장점                                           | 단점                       |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- | -------------------------- |
| **메모이제이션**(위에서 아래로) | 원래 재귀 + "계산하기 전에 메모 확인, 계산한 뒤 메모에 저장" | 원래 재귀를 조금만 고치면 됨, 필요한 칸만 계산 | 재귀 깊이가 깊어질 수 있음 |
| **표 채우기**(아래에서 위로)    | 가장 작은 문제부터 반복문으로 표를 채움                      | 재귀 없음, 공간을 줄이기 쉬움                  | 계산 순서를 직접 정해야 함 |

두 방법 모두 서로 다른 부분 문제를 **한 번씩만** 풀어서 보통 시간 복잡도가 같습니다.

### 4.2 설계의 네 단계

동적 계획법 문제는 다음 네 가지를 차례로 정하면 풀립니다.

| 단계        | 질문                                      | 최소 동전 수                                | 0/1 배낭                                                          |
| ----------- | ----------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| ① 상태      | 표의 한 칸은 무엇을 뜻하는가?             | `best[m]` = m원을 만드는 최소 동전 수       | `table[i][w]` = 앞의 i개 물건으로, 무게 w 이하에서 얻는 최대 가치 |
| ② 점화식    | 한 칸을 더 작은 칸들로 어떻게 계산하는가? | `min(best[m - c] + 1)` (모든 동전 c)        | `max(table[i-1][w], table[i-1][w - 무게ᵢ] + 가치ᵢ)`               |
| ③ 초기값    | 가장 작은 문제의 답은?                    | `best[0] = 0`, 나머지는 "무한대"(아직 모름) | `table[0][w] = 0` (물건이 없으면 0)                               |
| ④ 계산 순서 | 어떤 순서로 채워야 필요한 칸이 준비되나?  | m = 1, 2, 3, … (작은 금액부터)              | i = 1, 2, …(물건 순서대로), 각 i에서 w = 0 … W                    |

가장 어려운 것은 ① **상태 정의**입니다. "무엇을 기억해 두면 다음 단계를 계산할 수 있을까?"를 묻는 것입니다. 한 번 정하면 ②는 "마지막 선택은 무엇이었나?"를 경우로 나누면 대부분 자연스럽게 나옵니다.

### 4.3 0/1 배낭: 담거나, 담지 않거나

Day 78의 물건(금가루 6kg 30, 은가루 5kg 20, 구리선 5kg 20)과 용량 10kg으로 표를 채웁니다. i번째 물건에 대해 선택은 두 가지뿐입니다.

- **담지 않는다**: 앞의 i-1개로 무게 w 이하의 최대 가치 = `table[i-1][w]`
- **담는다**(들어간다면): 남은 무게 w - 무게ᵢ를 앞의 i-1개로 채운 최대 가치 + 가치ᵢ

```text
w →     0  1  2  3  4  5  6  7  8  9 10
i=0:    0  0  0  0  0  0  0  0  0  0  0      물건 없음
i=1:    0  0  0  0  0  0 30 30 30 30 30      금가루(6kg, 30)
i=2:    0  0  0  0  0 20 30 30 30 30 30      + 은가루(5kg, 20)
i=3:    0  0  0  0  0 20 30 30 30 30 40      + 구리선(5kg, 20): 40 = table[2][5] + 20
```

오른쪽 아래 칸 40이 답입니다. 은가루와 구리선을 담으면 됩니다(탐욕은 30이었습니다).

### 4.4 답 복원: 표를 거꾸로 따라가기

표에는 최적의 **값**만 있습니다. **무엇을 골랐는지**는 표를 거꾸로 따라가며 알아냅니다.

- 최소 동전 수: 칸마다 "마지막에 쓴 동전"을 함께 기록해 두고, 금액에서 그 동전을 빼며 되돌아갑니다.
- 0/1 배낭: `table[i][w] != table[i-1][w]`이면 i번째 물건을 **담은 것**입니다. 그 물건의 무게를 w에서 빼고 i-1로 올라갑니다. 같으면 담지 않은 것입니다.

## 5. C로 구현하기

C 프로그램은 최소 동전 수를 구하며 마지막 동전을 기록해 답을 복원하고, 0/1 배낭의 2차원 표를 출력한 뒤 담은 물건을 복원합니다.

```c
// 파일: dp.c
#include <stdio.h>

#define INF 1000000

// 최소 동전 수: best[m] = min(best[m - c] + 1)
int min_coins(const int coins[], int k, int amount, int last_coin[]) {
    int best[101];
    best[0] = 0;
    for (int m = 1; m <= amount; m++) {
        best[m] = INF;
        last_coin[m] = 0;
        for (int i = 0; i < k; i++) {
            int c = coins[i];
            if (c <= m && best[m - c] + 1 < best[m]) {
                best[m] = best[m - c] + 1;
                last_coin[m] = c;           // 마지막에 쓴 동전을 기록 → 답을 복원
            }
        }
    }
    return best[amount];
}

// 0/1 배낭: table[i][w] = 앞의 i개 물건으로 무게 w 이하에서 얻는 최대 가치
int knapsack(const int weight[], const int value[], int n, int cap, int table[][11]) {
    for (int w = 0; w <= cap; w++) {
        table[0][w] = 0;                    // 물건이 없으면 가치 0
    }
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= cap; w++) {
            int skip = table[i - 1][w];                         // i번째 물건을 안 담음
            int take = -1;
            if (weight[i - 1] <= w) {
                take = table[i - 1][w - weight[i - 1]] + value[i - 1];   // 담음
            }
            table[i][w] = take > skip ? take : skip;
        }
    }
    return table[n][cap];
}

int main(void) {
    int coins[] = {1, 3, 4};
    int last_coin[101];
    int amount = 6;
    printf("동전 {1,3,4}로 %d원: 최소 %d개 →", amount, min_coins(coins, 3, amount, last_coin));
    for (int m = amount; m > 0; m -= last_coin[m]) {
        printf(" %d", last_coin[m]);
    }
    printf("\n");
    printf("같은 동전으로 1~10원:");
    for (int m = 1; m <= 10; m++) {
        int tmp[101];
        printf(" %d", min_coins(coins, 3, m, tmp));
    }
    printf("\n");

    int weight[] = {6, 5, 5};
    int value[] = {30, 20, 20};
    int table[4][11];
    int best = knapsack(weight, value, 3, 10, table);
    printf("배낭(용량 10): 최대 가치 %d\n", best);
    for (int i = 0; i <= 3; i++) {
        printf("  i=%d:", i);
        for (int w = 0; w <= 10; w++) {
            printf("%3d", table[i][w]);
        }
        printf("\n");
    }
    int w = 10;
    printf("담은 물건:");
    for (int i = 3; i >= 1; i--) {
        if (table[i][w] != table[i - 1][w]) {   // 값이 달라졌다 = i번째를 담았다
            printf(" %d번", i);
            w -= weight[i - 1];
        }
    }
    printf("\n");
    return 0;
}
```

실행 결과:

```text
동전 {1,3,4}로 6원: 최소 2개 → 3 3
같은 동전으로 1~10원: 1 2 1 1 2 2 2 2 3 3
배낭(용량 10): 최대 가치 40
  i=0:  0  0  0  0  0  0  0  0  0  0  0
  i=1:  0  0  0  0  0  0 30 30 30 30 30
  i=2:  0  0  0  0  0 20 30 30 30 30 30
  i=3:  0  0  0  0  0 20 30 30 30 30 40
담은 물건: 3번 2번
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                             |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#define INF 1000000`                                        | "아직 만들 방법을 모른다"를 뜻하는 큰 값입니다. `INT_MAX`를 쓰면 `best[m - c] + 1`에서 넘치므로 충분히 크지만 여유가 있는 값을 씁니다(실습의 디버그 문제).       |
| `best[0] = 0;`                                               | 초기값입니다. 0원은 동전 0개로 만듭니다. 나머지 칸은 반복 안에서 INF로 시작합니다.                                                                               |
| `if (c <= m && best[m - c] + 1 < best[m])`                   | 점화식입니다. 마지막 동전이 c인 경우를 하나씩 비교합니다. `c <= m`을 먼저 검사해 음수 인덱스를 막습니다.                                                         |
| `last_coin[m] = c;`                                          | 최솟값을 만든 선택을 기록해 둡니다. 답을 복원할 때 씁니다.                                                                                                       |
| `for (int m = amount; m > 0; m -= last_coin[m])`             | 6원의 마지막 동전은 3, 남은 3원의 마지막 동전도 3입니다. 표를 **거꾸로** 따라가며 동전을 모읍니다.                                                               |
| `int table[][11]`                                            | 2차원 배열을 함수에 넘길 때는 **첫 차원을 빼고 나머지 크기**를 적어야 합니다. 컴파일러가 한 줄의 길이를 알아야 `table[i][w]`의 위치를 계산할 수 있기 때문입니다. |
| `int skip = table[i - 1][w];` / `take = ... + value[i - 1];` | 4.3절의 두 경우입니다. 물건 번호 i는 1부터, 배열 인덱스는 0부터라 `weight[i - 1]`을 씁니다. 표에 "물건이 0개"인 줄을 두기 위한 흔한 약속입니다.                  |
| `if (table[i][w] != table[i - 1][w])`                        | 4.4절의 복원입니다. 3번(구리선)을 담았고, 남은 5kg에서 2번(은가루)을 담았습니다.                                                                                 |

## 6. Python으로 구현하기

Python 버전은 피보나치를 **메모이제이션**(`lru_cache`)과 **표 채우기**로 각각 구하고, 여러 동전 체계의 최소 동전 수와 0/1 배낭을 풉니다.

```python
# 파일: dp.py
from functools import lru_cache

calls = 0


@lru_cache(maxsize=None)
def fib_memo(n):
    global calls
    calls += 1
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)


def fib_table(n):
    table = [0, 1] + [0] * max(0, n - 1)
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]      # 앞의 두 칸으로 다음 칸
    return table[n]


print(f"F(80) 메모이제이션 = {fib_memo(80)}, 함수 본문 실행 {calls}번")
print(f"F(80) 표 채우기    = {fib_table(80)}")


def min_coins(coins, amount):
    best = [0] + [float("inf")] * amount
    choice = [0] * (amount + 1)
    for m in range(1, amount + 1):
        for c in coins:
            if c <= m and best[m - c] + 1 < best[m]:
                best[m], choice[m] = best[m - c] + 1, c
    if best[amount] == float("inf"):
        return None
    used, m = [], amount
    while m > 0:
        used.append(choice[m])
        m -= choice[m]
    return used


for coins, amount in [([1, 3, 4], 6), ([500, 100, 50, 10], 1260), ([5, 2], 3), ([5, 3], 11)]:
    print(f"{coins}로 {amount}원 →", min_coins(coins, amount))


def knapsack(items, capacity):
    n = len(items)
    table = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i, (name, w, v) in enumerate(items, start=1):
        for cap in range(capacity + 1):
            table[i][cap] = table[i - 1][cap]                           # 안 담기
            if w <= cap:
                table[i][cap] = max(table[i][cap], table[i - 1][cap - w] + v)   # 담기
    chosen, cap = [], capacity
    for i in range(n, 0, -1):
        if table[i][cap] != table[i - 1][cap]:
            name, w, _ = items[i - 1]
            chosen.append(name)
            cap -= w
    return table[n][capacity], chosen[::-1]


items = [("금가루", 6, 30), ("은가루", 5, 20), ("구리선", 5, 20)]
print("0/1 배낭(용량 10):", knapsack(items, 10))
print("0/1 배낭(용량 11):", knapsack(items, 11))
```

실행 결과:

```text
F(80) 메모이제이션 = 23416728348467685, 함수 본문 실행 81번
F(80) 표 채우기    = 23416728348467685
[1, 3, 4]로 6원 → [3, 3]
[500, 100, 50, 10]로 1260원 → [500, 500, 100, 100, 50, 10]
[5, 2]로 3원 → None
[5, 3]로 11원 → [5, 3, 3]
0/1 배낭(용량 10): (40, ['은가루', '구리선'])
0/1 배낭(용량 11): (50, ['금가루', '은가루'])
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lru_cache(maxsize=None)`                     | 함수의 **인자 → 결과**를 자동으로 저장하는 데코레이터입니다. 같은 인자로 다시 부르면 본문을 실행하지 않고 저장된 값을 돌려줍니다. 본문이 81번(F(0)~F(80) 각각 한 번)만 실행되었습니다. |
| `table = [0, 1] + [0] * max(0, n - 1)`         | 표 채우기용 목록입니다. n이 0이나 1이어도 인덱스 오류가 나지 않도록 `max`를 썼습니다.                                                                                                  |
| `best = [0] + [float("inf")] * amount`         | 초기값입니다. Python에서는 무한대 `float("inf")`를 그대로 쓸 수 있고, `inf + 1`도 `inf`라 넘침 걱정이 없습니다.                                                                        |
| `best[m], choice[m] = best[m - c] + 1, c`      | 값과 선택을 동시에 갱신합니다.                                                                                                                                                         |
| `[5, 2]로 3원 → None`                          | 5와 2로는 3을 만들 수 없어 `best[3]`이 무한대로 남았습니다. 만들 수 없는 경우도 표가 정확히 알려 줍니다.                                                                               |
| `[5, 3]로 11원 → [5, 3, 3]`                    | 탐욕이라면 5, 5를 쓰고 1원이 남아 실패합니다. 동적 계획법은 5 + 3 + 3을 찾습니다.                                                                                                      |
| `[[0] * (capacity + 1) for _ in range(n + 1)]` | 2차원 표입니다. 행마다 새 리스트를 만들어야 합니다(Day 68의 별칭 함정).                                                                                                                |
| `chosen[::-1]`                                 | 복원은 마지막 물건부터 거꾸로 하므로 뒤집어서 원래 순서로 돌려줍니다.                                                                                                                  |

## 7. Rust로 구현하기

Rust 버전은 피보나치를 `HashMap` 메모로 구하고, 최소 동전 수를 `Option<usize>` 표로 풀어 "만들 수 없음"을 타입으로 표현합니다. 0/1 배낭은 표를 **1차원으로 줄여** 공간을 아낍니다.

```rust
// 파일: dp.rs
use std::collections::HashMap;

fn fib_memo(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
    if n < 2 {
        return n;
    }
    if let Some(&v) = memo.get(&n) {
        return v;                                       // 이미 계산한 값
    }
    let v = fib_memo(n - 1, memo) + fib_memo(n - 2, memo);
    memo.insert(n, v);
    v
}

fn min_coins(coins: &[usize], amount: usize) -> Option<Vec<usize>> {
    let mut best: Vec<Option<usize>> = vec![None; amount + 1];
    let mut choice = vec![0; amount + 1];
    best[0] = Some(0);
    for m in 1..=amount {
        for &c in coins {
            if c <= m {
                if let Some(prev) = best[m - c] {
                    if best[m].is_none_or(|cur| prev + 1 < cur) {
                        best[m] = Some(prev + 1);
                        choice[m] = c;
                    }
                }
            }
        }
    }
    best[amount]?;                                      // 만들 수 없으면 None
    let mut used = Vec::new();
    let mut m = amount;
    while m > 0 {
        used.push(choice[m]);
        m -= choice[m];
    }
    Some(used)
}

fn knapsack(items: &[(&str, usize, u32)], capacity: usize) -> u32 {
    // 1차원 표: 무게를 거꾸로 돌면 각 물건을 한 번만 쓴다
    let mut best = vec![0u32; capacity + 1];
    for &(_, w, v) in items {
        for cap in (w..=capacity).rev() {
            best[cap] = best[cap].max(best[cap - w] + v);
        }
    }
    best[capacity]
}

fn main() {
    let mut memo = HashMap::new();
    println!("F(90) = {}, 저장한 값 {}개", fib_memo(90, &mut memo), memo.len());

    for (coins, amount) in [(vec![1, 3, 4], 6), (vec![5, 2], 3), (vec![5, 3], 11)] {
        println!("{:?}로 {amount}원 → {:?}", coins, min_coins(&coins, amount));
    }

    let items = [("금가루", 6, 30), ("은가루", 5, 20), ("구리선", 5, 20)];
    println!("0/1 배낭(용량 10): {}", knapsack(&items, 10));
    println!("0/1 배낭(용량 16): {}", knapsack(&items, 16));
}
```

실행 결과:

```text
F(90) = 2880067194370816120, 저장한 값 89개
[1, 3, 4]로 6원 → Some([3, 3])
[5, 2]로 3원 → None
[5, 3]로 11원 → Some([5, 3, 3])
0/1 배낭(용량 10): 40
0/1 배낭(용량 16): 70
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                                    |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn fib_memo(n: u64, memo: &mut HashMap<u64, u64>)`          | 메모를 `&mut`로 빌려 모든 재귀 호출이 **같은 메모**를 씁니다. 저장한 값은 F(2)~F(90)의 89개입니다(F(0), F(1)은 멈춤 조건이라 저장하지 않음).                            |
| `if let Some(&v) = memo.get(&n) { return v; }`               | 계산하기 **전에** 메모를 확인합니다. 이 줄이 없으면 저장만 하고 다시 쓰지 않아 여전히 지수 시간입니다.                                                                  |
| `let mut best: Vec<Option<usize>> = vec![None; amount + 1];` | "만들 수 없음"을 C의 INF나 Python의 inf 대신 `None`으로 표현했습니다. 넘침 걱정이 없고, `None`인 칸을 실수로 계산에 쓰면 타입이 맞지 않아 컴파일 단계에서 드러납니다.   |
| `best[m].is_none_or(\|cur\| prev + 1 < cur)`                 | 아직 방법이 없거나(None), 새 방법이 더 적으면 갱신합니다.                                                                                                               |
| `best[amount]?;`                                             | 금액을 만들 수 없으면 여기서 `None`을 돌려주고 끝냅니다. 값 자체는 쓰지 않고 `?`의 조기 반환만 이용했습니다.                                                            |
| `for cap in (w..=capacity).rev()`                            | 2차원 표의 **한 줄만** 두고 제자리에서 갱신합니다. 무게를 **큰 쪽부터** 돌아야 `best[cap - w]`가 아직 이번 물건을 반영하지 않은 "이전 줄"의 값입니다(실습의 빈칸 문제). |
| `0/1 배낭(용량 16): 70`                                      | 세 물건을 모두 담을 수 있어(6 + 5 + 5 = 16) 30 + 20 + 20 = 70입니다.                                                                                                    |

## 8. 실행 추적

동전 {1, 3, 4}의 표를 한 칸씩 채워 봅니다. 각 칸에서 마지막 동전 세 가지를 비교합니다(`-`는 동전이 금액보다 커서 쓸 수 없음).

| m   | 마지막 1원: best[m-1]+1 | 마지막 3원: best[m-3]+1 | 마지막 4원: best[m-4]+1 | best[m] | 마지막 동전 |
| --- | ----------------------- | ----------------------- | ----------------------- | ------: | ----------- |
| 1   | best[0]+1 = 1           | -                       | -                       |       1 | 1           |
| 2   | best[1]+1 = 2           | -                       | -                       |       2 | 1           |
| 3   | best[2]+1 = 3           | best[0]+1 = **1**       | -                       |       1 | 3           |
| 4   | best[3]+1 = 2           | best[1]+1 = 2           | best[0]+1 = **1**       |       1 | 4           |
| 5   | best[4]+1 = **2**       | best[2]+1 = 3           | best[1]+1 = 2           |       2 | 1           |
| 6   | best[5]+1 = 3           | best[3]+1 = **2**       | best[2]+1 = 3           |       2 | 3           |

m = 5에서 마지막 1원과 마지막 4원이 모두 2인데, C 코드는 `<`로 비교해 먼저 찾은 1원을 기록했습니다. 최솟값은 같으니 어느 쪽이든 정답입니다. 복원은 6 → (3) → 3 → (3) → 0으로 **3 + 3**입니다.

## 9. 다른 예제로 다시 이해하기

두 문자열에서 **순서를 유지하며** 공통으로 뽑을 수 있는 가장 긴 문자열을 **최장 공통 부분 수열(LCS)** 이라고 합니다. "ABCBDAB"와 "BDCABA"의 LCS는 "BCBA"(길이 4)입니다. 글자가 연속일 필요는 없습니다. 두 버전의 문서나 코드에서 **바뀌지 않은 부분**을 찾는 비교 도구(`diff`)와 유전자 서열 비교의 기초입니다. 상태를 `L[i][j]` = 첫 문자열의 앞 i글자와 둘째 문자열의 앞 j글자의 LCS 길이로 정하면, 마지막 글자가 같을 때는 둘 다 한 글자씩 줄인 칸 + 1, 다를 때는 한쪽을 한 글자 줄인 두 칸 중 큰 값입니다.

```python
# 파일: lcs.py
def lcs(a, b):
    n, m = len(a), len(b)
    L = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                L[i][j] = L[i - 1][j - 1] + 1                 # 같은 글자: 대각선 + 1
            else:
                L[i][j] = max(L[i - 1][j], L[i][j - 1])       # 다르면 한쪽을 버림
    out, i, j = [], n, m                                      # 거꾸로 따라가며 복원
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            out.append(a[i - 1])
            i, j = i - 1, j - 1
        elif L[i - 1][j] >= L[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return L[n][m], "".join(reversed(out)), L


length, text, table = lcs("ABCBDAB", "BDCABA")
print("길이", length, "예:", text)
print("    " + "  ".join("BDCABA"))
for i, row in enumerate(table[1:], start=1):
    print("ABCBDAB"[i - 1], row[1:])
print(lcs("dynamic", "programming")[:2], lcs("동적계획법", "계획표작성법")[:2])
```

실행 결과:

```text
길이 4 예: BCBA
    B  D  C  A  B  A
A [0, 0, 0, 1, 1, 1]
B [1, 1, 1, 1, 2, 2]
C [1, 1, 2, 2, 2, 2]
B [1, 1, 2, 2, 3, 3]
D [1, 2, 2, 2, 3, 3]
A [1, 2, 2, 3, 3, 4]
B [1, 2, 2, 3, 4, 4]
(3, 'ami') (3, '계획법')
```

같은 표를 Rust로 채우면 다음과 같습니다. 한글을 글자 단위로 비교하려고 먼저 `Vec<char>`로 바꿉니다.

```rust
// 파일: lcs.rs
fn lcs_len(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let mut table = vec![vec![0usize; b.len() + 1]; a.len() + 1];
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            table[i][j] = if a[i - 1] == b[j - 1] {
                table[i - 1][j - 1] + 1
            } else {
                table[i - 1][j].max(table[i][j - 1])
            };
        }
    }
    table[a.len()][b.len()]
}

fn main() {
    for (a, b) in [("ABCBDAB", "BDCABA"), ("dynamic", "programming"), ("동적계획법", "계획표작성법"), ("", "abc")] {
        println!("{a:?} / {b:?} → {}", lcs_len(a, b));
    }
}
```

실행 결과:

```text
"ABCBDAB" / "BDCABA" → 4
"dynamic" / "programming" → 3
"동적계획법" / "계획표작성법" → 3
"" / "abc" → 0
```

## 10. 시간·공간 복잡도

| 문제                  | 상태 수 | 칸당 계산   | 시간     | 공간(기본 → 줄이기)      |
| --------------------- | ------- | ----------- | -------- | ------------------------ |
| 피보나치(메모 없음)   | -       | -           | O(1.6ⁿ)  | O(n) 재귀                |
| 피보나치(동적 계획법) | n       | O(1)        | O(n)     | O(n) → O(1) (두 칸만)    |
| 최소 동전 수          | 금액 A  | 동전 종류 k | O(A × k) | O(A)                     |
| 0/1 배낭              | n × W   | O(1)        | O(n × W) | O(n × W) → O(W) (1차원)  |
| LCS                   | n × m   | O(1)        | O(n × m) | O(n × m) → O(m) (길이만) |
| 최장 증가 부분 수열   | n       | O(n)        | O(n²)    | O(n)                     |

**시간 = 상태 수 × 칸당 계산**이라는 공식이 거의 모든 동적 계획법에 통합니다. 표를 줄여 공간을 아끼면 답을 **복원**하기 어려워진다는 점은 기억하세요(복원에는 전체 표가 필요합니다).

## 11. 세 언어 비교

| 관점           | C                                          | Python                         | Rust                      |
| -------------- | ------------------------------------------ | ------------------------------ | ------------------------- |
| 메모이제이션   | 전역 배열 + "계산 안 함" 표시값            | `@functools.lru_cache`, `dict` | `HashMap`을 `&mut`로 넘김 |
| "아직 모름" 값 | 큰 상수 INF (넘침 주의)                    | `float("inf")`                 | `Option`의 `None`         |
| 2차원 표       | `int table[N][M]`, 함수에는 `[][M]`로 넘김 | 리스트의 리스트(행마다 새로)   | `vec![vec![0; m]; n]`     |
| 공간 줄이기    | 1차원 배열 거꾸로 갱신                     | 같음                           | 같음(`(w..=cap).rev()`)   |
| 큰 수          | `long long` 범위 주의                      | 크기 제한 없음                 | `u64`, `u128`, 넘침 검사  |
| 재귀 깊이      | 스택 크기                                  | 기본 약 1,000 → 표 채우기 권장 | 스택 크기                 |

## 12. 자주 하는 실수

### 실수 1: 초기값을 잘못 둔다

실습의 디버그 문제입니다. 최솟값을 구하는 표를 0으로 시작하면 모든 칸이 "0개로 만들 수 있다"가 되어 버립니다. 최솟값 표는 **무한대**, 최댓값 표는 **0이나 음의 무한대**, 개수를 세는 표는 **0**으로 시작하되 가장 작은 문제(`best[0] = 0`, `ways[0] = 1`)만 따로 정합니다.

### 실수 2: 메모에 저장만 하고 조회하지 않는다

`memo[n] = ...`만 쓰고 계산 **전에** `if n in memo`를 확인하지 않으면 여전히 지수 시간입니다. "확인 → 계산 → 저장"의 세 줄을 항상 함께 쓰세요.

### 실수 3: 계산 순서가 틀린다

표 채우기에서는 한 칸이 의존하는 칸이 **먼저** 채워져 있어야 합니다. 1차원 배낭 표를 작은 무게부터 갱신하면 방금 갱신한(이번 물건을 이미 담은) 칸을 다시 써서 같은 물건을 여러 번 담습니다(실습의 빈칸 문제).

### 실수 4: 재귀 메모이제이션의 깊이 한도를 넘는다

```python
# 파일: memo_depth.py (실행 오류: RecursionError)
from functools import lru_cache


@lru_cache(maxsize=None)
def count(n):
    return 1 if n == 0 else count(n - 1) + 1


print(count(5000))
```

```text
RecursionError: maximum recursion depth exceeded
```

메모이제이션도 재귀라서 처음 호출할 때는 깊이 n까지 내려갑니다. n이 크면 **표 채우기**로 바꾸세요. 표 채우기는 반복문이라 깊이 제한이 없습니다.

### 실수 5: 상태가 부족하다

0/1 배낭을 `best[w]`만으로 앞에서부터 채우면 "어떤 물건을 이미 썼는지"를 알 수 없어 같은 물건을 여러 번 담습니다. 필요한 정보를 모두 담지 못하는 상태는 틀린 답을 줍니다. 그래서 `table[i][w]`처럼 **"몇 번째 물건까지 고려했는가"** 를 상태에 넣은 것입니다. 상태가 부족하면 차원을 하나 늘려 보세요.

## 13. Q&A

**Q. "동적 계획법"이라는 이름은 무슨 뜻인가요?**

A. 1950년대에 리처드 벨먼이 붙인 이름으로, 여기서 "계획(programming)"은 컴퓨터 프로그래밍이 아니라 "표를 채워 결정하는 방법"이라는 뜻입니다. "동적"은 시간에 따라 단계적으로 결정한다는 느낌을 주려고 골랐다고 합니다. 이름보다 **"작은 답을 저장해 다시 쓴다"** 는 뜻을 기억하세요.

**Q. 탐욕, 분할 정복, 동적 계획법을 어떻게 고르나요?**

A. 부분 문제가 **겹치지 않으면** 분할 정복(병합 정렬), **겹치면** 동적 계획법, 겹치더라도 **한 가지 선택만 따라가도 최적이라는 것이 증명되면** 탐욕입니다. 확신이 없다면 동적 계획법이 가장 안전합니다(대신 느리고 메모리를 더 씁니다).

**Q. 상태 정의가 떠오르지 않을 때는 어떻게 하나요?**

A. 먼저 **완전 탐색 재귀**를 짜 보세요. "앞에서부터 하나씩 결정한다면, 지금 남은 문제를 설명하는 데 어떤 값이 필요한가?"를 재귀 함수의 **매개변수**로 두면, 그 매개변수가 곧 상태입니다. 그다음 메모를 붙이면 메모이제이션이 되고, 매개변수가 작은 것부터 반복문으로 채우면 표 채우기가 됩니다.

**Q. 실제 프로그램에서도 동적 계획법을 쓰나요?**

A. 네. 문서 비교(diff, LCS), 맞춤법 교정과 검색어 추천(편집 거리), 음성 인식, 유전자 서열 정렬, 지도 앱의 경로 계산 일부, 텍스트 줄바꿈(워드 프로세서가 문단을 가장 보기 좋게 나누는 것) 등에 널리 쓰입니다.

## 14. 핵심 요약

- 동적 계획법은 **중복되는 부분 문제**의 답을 **저장해 다시 쓰는** 방법입니다. 지수 시간을 다항 시간으로 줄입니다.
- **메모이제이션**(재귀 + 메모, 위에서 아래로)과 **표 채우기**(반복문, 아래에서 위로) 두 방법이 있습니다.
- 설계는 **상태 → 점화식 → 초기값 → 계산 순서**의 네 단계입니다. 가장 중요한 것은 상태 정의입니다.
- 최소 동전 수: `best[m] = min(best[m - c] + 1)`. 0/1 배낭: `max(안 담기, 담기)`. LCS: 같으면 대각선 + 1, 다르면 위·왼쪽 중 큰 값.
- 표를 **거꾸로** 따라가면 최적해의 선택을 복원할 수 있습니다.
- 시간은 대체로 **상태 수 × 칸당 계산**입니다. 공간은 필요한 줄만 남겨 줄일 수 있지만 복원이 어려워집니다.

## 15. 도전 문제

1. **(C)** 동전 {1, 5, 10, 25}로 n원을 만드는 **방법의 수**(순서는 무시)를 구하세요. 최소 개수와 달리 `ways[m] += ways[m - c]`이며, 순서를 무시하려면 동전을 바깥 반복에 두어야 합니다.
2. **(Python)** 두 단어의 **편집 거리**(한 글자 넣기·빼기·바꾸기의 최소 횟수)를 구하세요. "kitten" → "sitting"은 3입니다.
3. **(Rust)** 0/1 배낭 문제의 1차원 표 버전에서도 담은 물건을 복원할 수 있도록, 물건마다 "이 무게에서 이 물건을 담았는가"를 `Vec<Vec<bool>>`에 기록해 보세요.
4. **(세 언어)** 격자의 왼쪽 위에서 오른쪽 아래까지 오른쪽이나 아래로만 움직일 때, 칸에 적힌 숫자의 합이 최소가 되는 경로의 합을 구하세요.
