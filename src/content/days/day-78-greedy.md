---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-78-greedy
courseId: crp-92
phaseId: phase-07
dayNumber: 78
date: "2026-12-17"
title: 탐욕 알고리즘 — 지금 가장 좋아 보이는 것을 고르고, 반례로 검증하기
summary: 매 순간 가장 좋아 보이는 선택을 하는 탐욕 알고리즘을 회의실 배정(끝나는 시간이 빠른 순), 거스름돈, 쪼갤 수 있는 배낭 문제로 C, Python, Rust에서 구현합니다. 같은 문제에서도 선택 기준에 따라 답이 틀릴 수 있음을 반례와 모든 경우 시도(완전 탐색)로 확인하고, 탐욕이 맞는 이유를 '바꿔치기 논증'으로 설명합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-77-search-sort-review]
learningObjectives:
  - 탐욕 알고리즘의 구조(기준으로 정렬 → 하나씩 보며 가능하면 선택)를 설명한다.
  - 회의실 배정에서 끝나는 시간이 빠른 순으로 고르면 최적인 이유를 바꿔치기 논증으로 설명한다.
  - 다른 선택 기준(시작 시간, 길이)이 틀리는 반례를 만들고 완전 탐색으로 확인한다.
  - 거스름돈에서 탐욕이 통하는 동전 체계와 통하지 않는 동전 체계를 구별한다.
  - 쪼갤 수 있는 배낭 문제와 0/1 배낭 문제에서 탐욕의 결과를 비교한다.
concepts:
  [
    greedy,
    activity selection,
    exchange argument,
    counterexample,
    brute force,
    coin change,
    fractional knapsack,
    0/1 knapsack,
  ]
runnerMode: python
playgroundSource: |
  # 파일: meetings.py — 회의를 추가하거나 기준을 바꿔 보세요.
  meetings = [("A", 1, 4), ("B", 3, 5), ("C", 0, 6), ("D", 5, 7), ("E", 8, 11)]
  chosen, last_end = [], -1
  for name, start, end in sorted(meetings, key=lambda m: m[2]):
      if start >= last_end:
          chosen.append(name)
          last_end = end
          print(f"{name}({start}-{end}) 선택")
      else:
          print(f"{name}({start}-{end}) 겹쳐서 건너뜀")
  print("결과:", chosen)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day78-predict-py
    title: 끝나는 시간 순 선택 예측하기
    kind: predict
    objective: 정렬 뒤 겹치지 않는 회의를 차례로 고르는 과정을 추적한다.
    prompt: 선택되는 회의 이름을 순서대로 공백으로 구분해 적으세요.
    starter: |-
      meetings = [("가", 0, 3), ("나", 2, 4), ("다", 3, 5), ("라", 4, 8), ("마", 5, 6), ("바", 7, 9)]
      chosen, last_end = [], -1
      for name, start, end in sorted(meetings, key=lambda m: m[2]):
          if start >= last_end:
              chosen.append(name)
              last_end = end
      print(*chosen)
    answer: "가 다 마 바"
    hint: "끝나는 시간 순서는 가(3), 나(4), 다(5), 마(6), 라(8), 바(9)입니다. 가를 고르면 3 이후에 시작하는 회의만 가능합니다."
    explanation: "가(0-3) → 나는 2에 시작해 겹침 → 다(3-5) → 마(5-6) → 라는 4에 시작해 겹침 → 바(7-9). 끝나는 시간이 같은 순간에 다음 회의가 시작하는 것은 겹치지 않는다고 봤습니다(start >= last_end)."
    commonMistakes:
      - "입력 순서대로 보며 고름"
      - "끝나는 시간과 시작 시간이 같으면 겹친다고 생각함"
    language: python
    verification: run
  - id: ex-day78-predict-c
    title: 거스름돈 탐욕 결과 예측하기
    kind: predict
    objective: 큰 동전부터 쓰는 탐욕의 결과를 계산한다.
    prompt: "두 경우의 동전 개수를 공백으로 구분해 적으세요. 첫째는 {500, 100, 50, 10}으로 780원, 둘째는 {6, 4, 1}로 8원입니다."
    starter: |-
      #include <stdio.h>

      int greedy(const int coins[], int k, int amount) {
          int count = 0;
          for (int i = 0; i < k; i++) {
              count += amount / coins[i];
              amount %= coins[i];
          }
          return count;
      }

      int main(void) {
          int won[] = {500, 100, 50, 10};
          int odd[] = {6, 4, 1};
          printf("%d %d\n", greedy(won, 4, 780), greedy(odd, 3, 8));
          return 0;
      }
    answer: "7 3"
    hint: "780 = 500 + 100 + 100 + 50 + 10 + 10 + 10입니다. 8원은 6을 먼저 쓰고 남은 2를 1원 두 개로 채웁니다."
    explanation: "한국 동전은 큰 동전이 작은 동전의 배수라 탐욕이 항상 최소입니다. {6, 4, 1}로 8원은 탐욕이 6 + 1 + 1로 3개지만, 4 + 4면 2개입니다. 탐욕이 '가능한 답'을 찾더라도 '가장 좋은 답'이라는 보장은 동전 체계에 따라 다릅니다."
    commonMistakes:
      - "8원도 최소 개수(2)를 적음(탐욕의 결과를 물었음)"
      - "780원에서 10원 개수를 하나 적게 셈"
    language: c
    verification: run
  - id: ex-day78-fill
    title: Rust 회의 선택 조건 채우기
    kind: fill
    objective: 마지막으로 고른 회의가 끝난 뒤에 시작하는 회의만 고르는 조건을 쓴다.
    prompt: "빈칸에 회의 (start, end)를 고를 수 있는 조건을 채우세요. 아직 하나도 고르지 않았거나, 시작 시간이 마지막으로 고른 회의의 끝 이상이어야 합니다."
    starter: |-
      fn main() {
          let mut meetings = vec![(1, 3), (2, 5), (4, 6), (6, 8), (5, 9), (8, 10)];
          meetings.sort_by_key(|&(_, end)| end);
          let mut chosen: Vec<(u32, u32)> = Vec::new();
          for (start, end) in meetings {
              if _____ {
                  chosen.push((start, end));
              }
          }
          println!("{:?}", chosen);
      }
    answer: |-
      fn main() {
          let mut meetings = vec![(1, 3), (2, 5), (4, 6), (6, 8), (5, 9), (8, 10)];
          meetings.sort_by_key(|&(_, end)| end);
          let mut chosen: Vec<(u32, u32)> = Vec::new();
          for (start, end) in meetings {
              if chosen.last().is_none_or(|&(_, last_end)| start >= last_end) {
                  chosen.push((start, end));
              }
          }
          println!("{:?}", chosen);
      }
    output: "[(1, 3), (4, 6), (6, 8), (8, 10)]"
    hint: "chosen.last()는 Option<&(u32, u32)>입니다. is_none_or(조건)은 None이면 true, Some이면 조건의 결과를 돌려줍니다."
    explanation: "빈 목록일 때는 무엇이든 고를 수 있고, 아니면 마지막 회의의 끝 이후에 시작해야 합니다. match chosen.last() { None => true, Some(&(_, e)) => start >= e }와 같은 뜻을 한 줄로 썼습니다."
    commonMistakes:
      - "chosen.last().unwrap()을 써서 처음 회의에서 panic을 일으킴"
      - "start > last_end로 써서 바로 이어지는 회의(6-8 뒤 8-10)를 고르지 못함"
    language: rust
    verification: run
  - id: ex-day78-modify
    title: Python 탐욕 결과를 완전 탐색으로 검증하기
    kind: modify
    objective: 작은 입력에서 모든 경우를 시도해 탐욕의 답이 최적인지 확인한다.
    prompt: "check(coins, limit)가 1원부터 limit원까지 탐욕의 동전 수와 최소 동전 수(모든 조합 시도)를 비교해 처음으로 다른 금액을 돌려주게 고치세요. 모두 같으면 None입니다. {1, 5, 10, 25}는 None, {1, 3, 4}는 6이 나와야 합니다."
    starter: |-
      from itertools import product


      def greedy(coins, amount):
          count = 0
          for c in sorted(coins, reverse=True):
              count += amount // c
              amount %= c
          return count


      def check(coins, limit):
          return None


      print(check([1, 5, 10, 25], 30), check([1, 3, 4], 10))
    answer: |-
      from itertools import product


      def greedy(coins, amount):
          count = 0
          for c in sorted(coins, reverse=True):
              count += amount // c
              amount %= c
          return count


      def best(coins, amount):
          ranges = [range(amount // c + 1) for c in coins]
          return min(sum(ks) for ks in product(*ranges)
                     if sum(k * c for k, c in zip(ks, coins)) == amount)


      def check(coins, limit):
          for amount in range(1, limit + 1):
              if greedy(coins, amount) != best(coins, amount):
                  return amount
          return None


      print(check([1, 5, 10, 25], 30), check([1, 3, 4], 10))
    output: "None 6"
    hint: "itertools.product로 동전마다 0개부터 최대 개수까지의 모든 조합을 만들고, 합이 금액과 같은 것 중 개수가 가장 적은 것을 고르세요."
    explanation: "미국 동전 {1, 5, 10, 25}는 30원까지 탐욕이 항상 최소입니다. {1, 3, 4}는 6원에서 탐욕 4 + 1 + 1(3개)과 최소 3 + 3(2개)이 다릅니다. 완전 탐색은 느리지만 작은 입력에서 빠른 알고리즘을 '검증'하는 데 아주 유용합니다."
    commonMistakes:
      - "완전 탐색에서 동전을 하나씩만 쓸 수 있다고 가정함"
      - "금액 0부터 검사해 min()이 빈 목록에서 오류를 냄"
    language: python
    verification: run
  - id: ex-day78-debug
    title: C 회의 선택의 정렬 기준 고치기
    kind: debug
    objective: 시작 시간 순으로 고르면 최적이 아니라는 것을 확인하고 끝나는 시간 순으로 고친다.
    prompt: "이 프로그램은 시작 시간이 빠른 순으로 정렬해 긴 회의 하나를 먼저 골라 버립니다. 끝나는 시간 순으로 정렬하도록 비교 함수를 고쳐 3개를 고르게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct { int start, end; } Meeting;

      int cmp(const void *x, const void *y) {
          const Meeting *a = x, *b = y;
          return (a->start > b->start) - (a->start < b->start);
      }

      int main(void) {
          Meeting m[] = {{0, 10}, {1, 3}, {4, 6}, {7, 9}};
          qsort(m, 4, sizeof m[0], cmp);
          int last_end = -1, count = 0;
          for (int i = 0; i < 4; i++) {
              if (m[i].start >= last_end) {
                  last_end = m[i].end;
                  count++;
              }
          }
          printf("%d개\n", count);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct { int start, end; } Meeting;

      int cmp(const void *x, const void *y) {
          const Meeting *a = x, *b = y;
          return (a->end > b->end) - (a->end < b->end);
      }

      int main(void) {
          Meeting m[] = {{0, 10}, {1, 3}, {4, 6}, {7, 9}};
          qsort(m, 4, sizeof m[0], cmp);
          int last_end = -1, count = 0;
          for (int i = 0; i < 4; i++) {
              if (m[i].start >= last_end) {
                  last_end = m[i].end;
                  count++;
              }
          }
          printf("%d개\n", count);
          return 0;
      }
    output: "3개"
    starterOutput: "1개"
    hint: "0시부터 10시까지의 긴 회의가 가장 먼저 시작합니다. 이것을 고르면 나머지 셋과 모두 겹칩니다."
    explanation: "빨리 시작하는 회의가 늦게 끝날 수 있어서 남은 시간을 모두 차지합니다. 빨리 끝나는 회의를 고르면 남는 시간이 가장 많아 이후에 더 많은 회의를 넣을 수 있습니다. 탐욕 알고리즘은 '무엇을 기준으로 가장 좋은가'를 올바르게 정하는 것이 전부입니다."
    commonMistakes:
      - "시작 시간 내림차순으로 바꿔 우연히 맞는 입력만 통과함"
      - "비교 함수는 고치고 선택 조건을 start > last_end로 바꿔 이어지는 회의를 놓침"
    language: c
    verification: run
  - id: ex-day78-independent
    title: Rust로 최소 강의실 개수 구하기
    kind: independent
    objective: 시작 시간 순으로 보며 가장 빨리 비는 강의실을 재사용하는 탐욕을 힙으로 구현한다.
    prompt: "강의 (시작, 끝) 목록을 모두 진행하는 데 필요한 최소 강의실 수를 구하세요. 시작 시간 순으로 보면서, 가장 빨리 끝나는 강의실(최소 힙)이 비어 있으면 재사용하고 아니면 새로 엽니다. [(1,4), (2,5), (4,7), (5,8), (7,9)]이면 2가 나와야 합니다."
    starter: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn main() {
          let lectures = vec![(1, 4), (2, 5), (4, 7), (5, 8), (7, 9)];
          let rooms: BinaryHeap<Reverse<u32>> = BinaryHeap::new();
          println!("{} {}", lectures.len(), rooms.len());
      }
    answer: |-
      use std::cmp::Reverse;
      use std::collections::BinaryHeap;

      fn min_rooms(mut lectures: Vec<(u32, u32)>) -> usize {
          lectures.sort();
          let mut rooms: BinaryHeap<Reverse<u32>> = BinaryHeap::new();   // 강의실별 끝나는 시간
          for (start, end) in lectures {
              if let Some(&Reverse(earliest)) = rooms.peek() {
                  if earliest <= start {
                      rooms.pop();                     // 빈 강의실을 재사용
                  }
              }
              rooms.push(Reverse(end));
          }
          rooms.len()
      }

      fn main() {
          let lectures = vec![(1, 4), (2, 5), (4, 7), (5, 8), (7, 9)];
          println!("{}", min_rooms(lectures));
          println!("{}", min_rooms(vec![(0, 10), (1, 3), (2, 4), (3, 5)]));
      }
    output: |-
      2
      3
    hint: "BinaryHeap은 최대 힙이므로 Reverse로 감싸 가장 빨리 끝나는 시간이 peek에 오게 합니다. 강의실 수는 마지막 힙의 크기입니다."
    explanation: "시작 순으로 보며 '지금 가장 빨리 비는 강의실'을 재사용하는 것이 탐욕 선택입니다. 두 번째 입력은 0-10 강의가 끝까지 방을 차지하고 1-3, 2-4가 겹쳐 3개가 필요하며, 3-5는 1-3이 끝난 방을 씁니다. 정렬 O(n log n)과 힙 연산 O(log n) n번이라 전체 O(n log n)입니다."
    commonMistakes:
      - "Reverse 없이 최대 힙을 써서 가장 늦게 끝나는 방을 비교함"
      - "끝나는 시간 순으로 정렬해 시작 순서를 놓침"
    language: rust
    verification: run
quiz:
  - id: quiz-day78-01
    question: 탐욕 알고리즘의 특징으로 옳은 것은?
    choices:
      - 모든 경우를 시도해서 가장 좋은 답을 고른다
      - 매 단계에서 지금 가장 좋아 보이는 선택을 하고, 한 번 한 선택을 되돌리지 않는다
      - 항상 최적의 답을 보장한다
      - 반드시 재귀로 구현한다
    answerIndex: 1
    explanation: 탐욕은 되돌리지 않기 때문에 빠르지만, 그 선택이 전체적으로 최선인지는 문제마다 증명하거나 반례로 확인해야 합니다. 모든 경우를 시도하는 것은 완전 탐색이고, 선택을 되돌리는 것은 백트래킹(Day 80)입니다.
  - id: quiz-day78-02
    question: 회의실 하나에 가장 많은 회의를 넣으려면 어떤 순서로 골라야 하나요?
    choices:
      - 빨리 시작하는 회의부터
      - 짧은 회의부터
      - 빨리 끝나는 회의부터
      - 참석자가 많은 회의부터
    answerIndex: 2
    explanation: 빨리 끝나는 회의를 고르면 남은 시간이 가장 많아집니다. 빨리 시작하는 회의는 매우 길 수 있고, 짧은 회의는 두 회의 사이에 걸쳐 양쪽을 모두 막을 수 있습니다.
  - id: quiz-day78-03
    question: 동전이 {1, 3, 4}원일 때 6원을 탐욕(큰 동전부터)으로 거슬러 주면?
    choices: ["3+3, 2개", "4+1+1, 3개", "1원 6개", "4+2, 2개"]
    answerIndex: 1
    explanation: 탐욕은 4를 먼저 쓰고 남은 2를 1원 두 개로 채워 3개입니다. 최소는 3 + 3의 2개라 탐욕이 최적이 아닙니다. 이런 경우에는 Day 79의 동적 계획법을 씁니다.
  - id: quiz-day78-04
    question: 쪼갤 수 있는 배낭 문제(가루처럼 원하는 만큼 담을 수 있음)에서 올바른 탐욕 기준은?
    choices:
      - 가치가 큰 물건부터
      - 무게가 가벼운 물건부터
      - 무게당 가치(가치 ÷ 무게)가 큰 물건부터
      - 입력 순서대로
    answerIndex: 2
    explanation: 쪼갤 수 있다면 1kg당 가장 비싼 것부터 채우는 것이 최적입니다. 하지만 물건을 통째로만 담을 수 있는 0/1 배낭 문제에서는 같은 기준이 틀릴 수 있습니다(9절).
  - id: quiz-day78-05
    question: 탐욕 알고리즘이 옳은지 확인하는 방법으로 가장 알맞은 것은?
    choices:
      - 예제 하나로 실행해 본다
      - 바꿔치기 논증 같은 증명을 하거나, 작은 입력에서 완전 탐색과 결과를 비교해 반례를 찾아본다
      - 실행 시간이 빠르면 옳다
      - 코드가 짧으면 옳다
    answerIndex: 1
    explanation: 탐욕은 그럴듯해 보여도 틀리는 경우가 많습니다. 증명이 어렵다면, 작은 입력을 많이 만들어 느리지만 확실한 완전 탐색과 비교하는 것이 실용적인 검증 방법입니다.
---

## 1. 오늘 배울 내용

지금까지의 알고리즘은 문제의 구조를 이용해 **정확한 답**을 효율적으로 찾았습니다. 오늘 배우는 **탐욕 알고리즘(greedy algorithm)** 은 훨씬 단순한 전략입니다. **매 순간 가장 좋아 보이는 것을 고르고, 뒤돌아보지 않습니다.** 코드가 짧고 빠르지만 **항상 옳지는 않습니다.** 그래서 오늘의 절반은 "언제 탐욕이 통하는가"를 따지는 데 씁니다.

1. 탐욕 알고리즘의 모양: **기준으로 정렬 → 하나씩 보며 가능하면 선택**.
2. **회의실 배정**: 가장 많은 회의를 넣으려면 무엇을 기준으로 골라야 할까? 세 가지 기준을 비교하고 **반례**를 찾습니다.
3. **바꿔치기 논증**으로 "끝나는 시간이 빠른 순"이 최적인 이유를 설명합니다.
4. **거스름돈**: 한국 동전에서는 탐욕이 최소 개수를 주지만, 동전 체계에 따라 틀릴 수 있습니다.
5. **C, Python, Rust** 로 구현하고, **완전 탐색**으로 탐욕의 답을 검증합니다.
6. 응용으로 **쪼갤 수 있는 배낭**(탐욕 성공)과 **0/1 배낭**(탐욕 실패)을 비교합니다.

## 2. 왜 탐욕인가

편의점에서 1,260원을 거슬러 줄 때 점원은 계산하지 않고도 가장 적은 동전으로 줍니다. 500원을 줄 수 있는 만큼(2개), 그다음 100원(2개), 50원(1개), 10원(1개). **지금 줄 수 있는 가장 큰 동전**부터 주는 것, 이것이 탐욕입니다.

탐욕 알고리즘은 다음 두 성질이 있는 문제에서 올바릅니다.

- **탐욕 선택 속성**: 지금 가장 좋아 보이는 선택을 해도, 그 선택을 포함하는 최적해가 존재한다.
- **최적 부분 구조**: 한 번 선택하고 나면 남은 문제도 같은 모양의 더 작은 문제이고, 그 최적해를 합치면 전체의 최적해가 된다.

두 번째 성질은 Day 79의 동적 계획법과 같습니다. 차이는 첫 번째 성질입니다. 탐욕은 여러 선택지를 **비교하지 않고** 하나만 골라 나아갑니다. 그래서 빠르지만, 그 하나가 틀리면 되돌릴 수 없습니다.

## 3. 그림으로 이해하기

회의실 하나에 회의 8개가 신청되었습니다. 겹치지 않게 **가장 많은** 회의를 넣어 봅시다(끝나는 시각과 다음 회의의 시작 시각이 같아도 됩니다).

```text
시간  0   1   2   3   4   5   6   7   8   9  10  11
 A        ├───────────┤                                  1-4
 B                ├───────┤                              3-5
 C    ├───────────────────────┤                          0-6
 D                        ├───────┤                      5-7
 E                ├───────────────────────┤              3-9
 F                        ├───────────────┤              5-9
 G                            ├───────────────┤          6-10
 H                                    ├───────────┤      8-11

끝나는 시간 순으로 고르기:  A(1-4) → D(5-7) → H(8-11)   = 3개
```

A는 4시에 가장 먼저 끝납니다. A를 고르면 4시 이후에 시작하는 회의만 남고, 그중 가장 먼저 끝나는 D, 그다음 H를 고릅니다. 모든 부분집합을 시도해도 4개를 넣는 방법은 없습니다.

## 4. 천천히 풀어보기

### 4.1 탐욕 알고리즘의 모양

```text
① 후보들을 "가장 좋아 보이는 순서"로 정렬한다   ← 이 기준을 고르는 것이 핵심
② 앞에서부터 하나씩 본다
③ 지금까지의 선택과 충돌하지 않으면 고른다, 아니면 버린다 (다시 보지 않는다)
```

대부분의 시간은 ①의 정렬(O(n log n))이 차지하고, ②③은 한 번 훑기(O(n))입니다.

### 4.2 어떤 기준이 맞을까: 반례 찾기

회의실 배정에서 떠올릴 수 있는 기준은 여러 가지입니다.

| 기준               | 그럴듯한 이유               | 반례                                                 |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| 빨리 시작하는 순   | 일찍 시작해서 시간을 아낀다 | `[0-10], [1-3], [4-6], [7-9]`: 0-10 하나만 고르게 됨 |
| 짧은 회의 순       | 짧으면 자리를 덜 차지한다   | `[1-5], [4-7], [6-10]`: 짧은 4-7이 양쪽을 막아 1개만 |
| **빨리 끝나는 순** | 남는 시간이 가장 많다       | 없음(4.3절에서 증명)                                 |

반례는 **탐욕이 틀렸다는 가장 확실한 증거**입니다. 기준을 떠올렸다면 "이 기준이 틀리는 작은 입력"을 먼저 찾아보세요. 찾지 못했다면 증명을 시도하거나, 작은 입력을 많이 만들어 **완전 탐색**(모든 경우를 시도하는 느리지만 확실한 방법)과 비교합니다.

### 4.3 바꿔치기 논증: 왜 빨리 끝나는 순이 최적인가

어떤 최적해 OPT가 있다고 합시다. OPT의 회의들을 끝나는 시간 순으로 적었을 때 첫 회의를 X라고 하고, 탐욕이 고른 첫 회의(전체에서 가장 빨리 끝나는 회의)를 G라고 합시다.

```text
OPT:    [ X ]   [ Y ]   [ Z ] ...
탐욕:   [ G ]                       G는 전체에서 가장 빨리 끝난다 → G의 끝 ≤ X의 끝
```

- G는 가장 빨리 끝나므로 **G의 끝 ≤ X의 끝**입니다.
- 그러면 OPT에서 X를 G로 **바꿔치기**해도, G는 X보다 늦게 끝나지 않으므로 Y, Z와 겹치지 않습니다.
- 바꾼 해도 회의 수가 같으니 **최적해**입니다. 즉 "G를 포함하는 최적해"가 존재합니다(탐욕 선택 속성).
- G를 고른 뒤 남은 문제("G 이후에 시작하는 회의들")에 같은 논리를 반복하면, 탐욕이 고른 모든 회의가 어떤 최적해와 같은 개수가 됩니다.

이렇게 "최적해의 한 선택을 탐욕의 선택으로 바꿔도 손해가 없다"를 보이는 방법을 **바꿔치기 논증(exchange argument)** 이라고 하며, 탐욕 알고리즘을 증명하는 가장 흔한 방법입니다.

### 4.4 거스름돈: 동전 체계에 달려 있다

큰 동전부터 쓰는 탐욕은 **한국 동전 {500, 100, 50, 10}** 에서 항상 최소 개수를 줍니다. 각 동전이 더 작은 동전들로 "손해 없이" 대신할 수 없는 구조이기 때문입니다(예: 100원 두 개 = 200원을 50원으로 바꾸면 4개가 되어 손해).

하지만 **{4, 3, 1}** 원으로 6원을 만들 때는 다릅니다.

```text
탐욕:  4 선택 → 남은 2 → 1, 1  = 4 + 1 + 1   (3개)
최적:  3 + 3                                  (2개)
```

첫 선택(4)이 "지금은 가장 좋아 보였지만" 나머지를 비효율적으로 만들었습니다. 이런 경우에는 모든 선택지를 비교하는 **동적 계획법**(Day 79)이 필요합니다.

## 5. C로 구현하기

C 프로그램은 회의를 `qsort`로 끝나는 시간 순으로 정렬해 고르고, 두 동전 체계에서 탐욕의 결과와 최소 개수를 비교합니다. 최소 개수는 Day 79에서 배울 동적 계획법으로 미리 계산해 두었습니다.

```c
// 파일: greedy.c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name;
    int start;
    int end;
} Meeting;

int by_end(const void *x, const void *y) {
    const Meeting *a = x, *b = y;
    if (a->end != b->end) return (a->end > b->end) - (a->end < b->end);
    return (a->start > b->start) - (a->start < b->start);
}

// 동전 탐욕: 큰 동전부터 가능한 만큼 쓴다 (coins는 큰 순서)
int greedy_coins(const int coins[], int k, int amount, int used[]) {
    int total = 0;
    for (int i = 0; i < k; i++) {
        used[i] = amount / coins[i];
        amount -= used[i] * coins[i];
        total += used[i];
    }
    return amount == 0 ? total : -1;
}

// 비교용: 모든 금액에 대해 최소 동전 수를 구한다(동적 계획법, Day 79)
int min_coins(const int coins[], int k, int amount) {
    int best[64];
    best[0] = 0;
    for (int m = 1; m <= amount; m++) {
        best[m] = 1000;
        for (int i = 0; i < k; i++) {
            if (coins[i] <= m && best[m - coins[i]] + 1 < best[m]) {
                best[m] = best[m - coins[i]] + 1;
            }
        }
    }
    return best[amount];
}

int main(void) {
    Meeting m[] = {
        {'A', 1, 4}, {'B', 3, 5}, {'C', 0, 6}, {'D', 5, 7},
        {'E', 3, 9}, {'F', 5, 9}, {'G', 6, 10}, {'H', 8, 11},
    };
    int n = sizeof m / sizeof m[0];
    qsort(m, (size_t)n, sizeof m[0], by_end);        // 끝나는 시간 순

    int last_end = -1, count = 0;
    printf("선택한 회의:");
    for (int i = 0; i < n; i++) {
        if (m[i].start >= last_end) {                  // 앞 회의가 끝난 뒤 시작하면
            printf(" %c(%d-%d)", m[i].name, m[i].start, m[i].end);
            last_end = m[i].end;
            count++;
        }
    }
    printf("  → %d개\n", count);

    int won[] = {500, 100, 50, 10};
    int used[4];
    int total = greedy_coins(won, 4, 1260, used);
    printf("1260원: 동전 %d개 (500x%d 100x%d 50x%d 10x%d)\n",
           total, used[0], used[1], used[2], used[3]);

    int odd[] = {4, 3, 1};
    total = greedy_coins(odd, 3, 6, used);
    printf("동전 {4,3,1}로 6: 탐욕 %d개 (4x%d 3x%d 1x%d), 최소 %d개\n",
           total, used[0], used[1], used[2], min_coins(odd, 3, 6));
    return 0;
}
```

실행 결과:

```text
선택한 회의: A(1-4) D(5-7) H(8-11)  → 3개
1260원: 동전 6개 (500x2 100x2 50x1 10x1)
동전 {4,3,1}로 6: 탐욕 3개 (4x1 3x0 1x2), 최소 2개
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int by_end(const void *x, const void *y)`                   | 끝나는 시간 오름차순, 같으면 시작 시간 오름차순입니다(Day 77의 비교 함수). 이 정렬이 탐욕의 "기준"입니다.                                           |
| `int last_end = -1;`                                         | 마지막으로 고른 회의가 끝나는 시각입니다. 처음에는 어떤 회의든 고를 수 있도록 모든 시작 시각보다 작은 값으로 둡니다.                                |
| `if (m[i].start >= last_end)`                                | 앞 회의가 끝난 뒤에 시작하면 고릅니다. `>=`이므로 4시에 끝나고 4시에 시작하는 것은 겹치지 않습니다. 문제의 약속에 따라 `>`로 써야 할 수도 있습니다. |
| `used[i] = amount / coins[i]; amount -= used[i] * coins[i];` | 지금 동전을 쓸 수 있는 **최대 개수**를 쓰고 남은 금액을 줄입니다. 한 번 쓴 동전은 되돌리지 않습니다.                                                |
| `return amount == 0 ? total : -1;`                           | 탐욕이 금액을 정확히 맞추지 못할 수도 있습니다. 예를 들어 {5, 2}로 3원은 탐욕이 실패합니다(7절).                                                    |
| `min_coins`의 `best[m]`                                      | 1원부터 금액까지 차례로 "그 금액의 최소 동전 수"를 표에 채웁니다. 이것이 동적 계획법입니다(Day 79). 탐욕이 틀렸는지 확인하려고 썼습니다.            |

## 6. Python으로 구현하기

Python 버전은 세 가지 선택 기준을 같은 코드에 넣어 비교하고, **모든 부분집합을 시도하는 완전 탐색**으로 최댓값을 확인합니다. 짧은 회의 기준이 틀리는 반례도 함께 돌려 봅니다.

```python
# 파일: greedy.py
from itertools import combinations

meetings = [("A", 1, 4), ("B", 3, 5), ("C", 0, 6), ("D", 5, 7),
            ("E", 3, 9), ("F", 5, 9), ("G", 6, 10), ("H", 8, 11)]


def select(items, key):
    """key 순서로 보면서 겹치지 않으면 고른다."""
    chosen, last_end = [], float("-inf")
    for name, start, end in sorted(items, key=key):
        if start >= last_end:
            chosen.append(name)
            last_end = end
    return chosen


def best_by_brute_force(items):
    """모든 부분집합을 시도해 겹치지 않는 가장 큰 집합을 찾는다 (작은 입력 전용)."""
    for size in range(len(items), 0, -1):
        for group in combinations(items, size):
            ordered = sorted(group, key=lambda m: m[1])
            if all(ordered[i][2] <= ordered[i + 1][1] for i in range(size - 1)):
                return size
    return 0


rules = {
    "빨리 끝나는 순": lambda m: m[2],
    "빨리 시작하는 순": lambda m: m[1],
    "짧은 회의 순": lambda m: m[2] - m[1],
}
for label, rule in rules.items():
    chosen = select(meetings, rule)
    print(f"{label:<10} → {chosen} ({len(chosen)}개)")
print("모든 경우를 시도한 최댓값:", best_by_brute_force(meetings))

tricky = [("P", 1, 5), ("Q", 4, 7), ("R", 6, 10)]       # 짧은 회의 Q가 양쪽을 막는다
for label, rule in rules.items():
    print(f"반례 {label:<10} → {select(tricky, rule)}")


def greedy_change(coins, amount):
    used = {}
    for c in sorted(coins, reverse=True):
        used[c], amount = divmod(amount, c)
    return used if amount == 0 else None


print("1260원:", greedy_change([500, 100, 50, 10], 1260))
print("{4,3,1}로 6:", greedy_change([4, 3, 1], 6), "→ 3+3이면 2개면 된다")
```

실행 결과:

```text
빨리 끝나는 순   → ['A', 'D', 'H'] (3개)
빨리 시작하는 순  → ['C', 'G'] (2개)
짧은 회의 순    → ['B', 'D', 'H'] (3개)
모든 경우를 시도한 최댓값: 3
반례 빨리 끝나는 순   → ['P', 'R']
반례 빨리 시작하는 순  → ['P', 'R']
반례 짧은 회의 순    → ['Q']
1260원: {500: 2, 100: 2, 50: 1, 10: 1}
{4,3,1}로 6: {4: 1, 3: 0, 1: 2} → 3+3이면 2개면 된다
```

### 코드 한 부분씩 읽기

| 코드                                          | 설명                                                                                                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `def select(items, key):`                     | 탐욕의 뼈대는 그대로 두고 **기준(key)만** 바꿔 끼울 수 있게 했습니다.                                                                                                                         |
| `last_end = float("-inf")`                    | 음의 무한대로 시작하면 첫 회의는 무조건 고를 수 있습니다.                                                                                                                                     |
| `combinations(items, size)`                   | 크기가 size인 모든 부분집합을 만듭니다. 큰 크기부터 시도해 처음 겹치지 않는 집합을 찾으면 그것이 최댓값입니다. 부분집합은 2⁸ = 256개라 금방 끝나지만, n이 30이면 10억 개가 넘습니다.          |
| `all(ordered[i][2] <= ordered[i + 1][1] ...)` | 시작 순으로 정렬한 뒤 이웃끼리 겹치지 않는지 확인합니다.                                                                                                                                      |
| `"빨리 시작하는 순" → ['C', 'G']`             | 0시에 시작하는 긴 회의 C(0-6)를 먼저 고르는 바람에 2개밖에 넣지 못했습니다.                                                                                                                   |
| `"짧은 회의 순" → ['B', 'D', 'H']`            | 이 입력에서는 **우연히** 최적입니다. 그래서 반례 `tricky`를 따로 만들었습니다. 짧은 Q(4-7)가 P와 R 사이에 걸쳐 둘 다 막아 1개만 고릅니다. **예제 하나로 맞았다고 기준이 옳은 것은 아닙니다.** |
| `used[c], amount = divmod(amount, c)`         | `divmod`는 몫과 나머지를 한 번에 돌려줍니다.                                                                                                                                                  |

## 7. Rust로 구현하기

Rust 버전은 회의를 구조체로 만들어 `sort_by_key`로 정렬하고, 거스름돈 탐욕이 금액을 맞추지 못하면 `None`을 돌려줍니다.

```rust
// 파일: greedy.rs
#[derive(Debug, Clone, Copy)]
struct Meeting {
    name: char,
    start: u32,
    end: u32,
}

fn select(meetings: &[Meeting]) -> Vec<Meeting> {
    let mut sorted = meetings.to_vec();
    sorted.sort_by_key(|m| (m.end, m.start));        // 끝나는 시간 순
    let mut chosen: Vec<Meeting> = Vec::new();
    for m in sorted {
        let free = chosen.last().is_none_or(|last| m.start >= last.end);
        if free {
            chosen.push(m);
        }
    }
    chosen
}

fn greedy_change(coins: &[u32], mut amount: u32) -> Option<Vec<(u32, u32)>> {
    let mut coins = coins.to_vec();
    coins.sort_unstable_by(|a, b| b.cmp(a));         // 큰 동전부터
    let mut used = Vec::new();
    for c in coins {
        let k = amount / c;
        if k > 0 {
            used.push((c, k));
        }
        amount %= c;
    }
    if amount == 0 { Some(used) } else { None }
}

fn main() {
    let meetings = [
        Meeting { name: 'A', start: 1, end: 4 }, Meeting { name: 'B', start: 3, end: 5 },
        Meeting { name: 'C', start: 0, end: 6 }, Meeting { name: 'D', start: 5, end: 7 },
        Meeting { name: 'E', start: 3, end: 9 }, Meeting { name: 'F', start: 5, end: 9 },
        Meeting { name: 'G', start: 6, end: 10 }, Meeting { name: 'H', start: 8, end: 11 },
    ];
    let chosen = select(&meetings);
    let names: String = chosen.iter().map(|m| m.name).collect();
    println!("선택한 회의: {} ({}개)", names, chosen.len());

    println!("1260원: {:?}", greedy_change(&[10, 50, 100, 500], 1260));
    println!("{{4,3,1}}로 6: {:?}", greedy_change(&[4, 3, 1], 6));
    println!("{{5,2}}로 3: {:?}", greedy_change(&[5, 2], 3));
}
```

실행 결과:

```text
선택한 회의: ADH (3개)
1260원: Some([(500, 2), (100, 2), (50, 1), (10, 1)])
{4,3,1}로 6: Some([(4, 1), (1, 2)])
{5,2}로 3: None
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#[derive(Debug, Clone, Copy)] struct Meeting`           | 작은 구조체라 `Copy`로 만들어 정렬과 선택에서 값을 자유롭게 복사할 수 있게 했습니다.                                                                                                           |
| `sort_by_key(\|m\| (m.end, m.start))`                    | 끝나는 시간, 같으면 시작 시간으로 정렬합니다(키 튜플).                                                                                                                                         |
| `chosen.last().is_none_or(\|last\| m.start >= last.end)` | "아직 고른 것이 없거나, 마지막 회의가 끝난 뒤 시작한다"를 한 줄로 표현했습니다. C의 `last_end = -1` 같은 가짜 초기값이 필요 없습니다.                                                          |
| `coins.sort_unstable_by(\|a, b\| b.cmp(a))`              | 입력 순서와 상관없이 큰 동전부터 쓰도록 내림차순 정렬했습니다. 1260원 입력은 일부러 작은 동전부터 넘겼습니다.                                                                                  |
| `if amount == 0 { Some(used) } else { None }`            | {5, 2}로 3원을 만들 때 탐욕은 5를 쓸 수 없고 2 하나를 쓰면 1원이 남아 **실패**합니다. 실제로는 만들 방법이 없어서 None이 맞지만, {5, 3}으로 6원처럼 탐욕만 실패하고 답은 있는 경우도 있습니다. |
| `println!("{{4,3,1}}로 6: ...")`                         | 형식 문자열에서 중괄호 자체를 출력하려면 `{{`, `}}`처럼 두 번 씁니다.                                                                                                                          |

## 8. 실행 추적

C 프로그램의 회의 선택을 끝나는 시간 순서로 따라갑니다.

| 순서 | 회의 | 시작-끝 | 마지막 끝(last_end) | 판단          | 선택 수 |
| ---: | ---- | ------- | ------------------: | ------------- | ------: |
|    1 | A    | 1-4     |                  -1 | 1 ≥ -1 → 선택 |       1 |
|    2 | B    | 3-5     |                   4 | 3 < 4 → 겹침  |       1 |
|    3 | C    | 0-6     |                   4 | 0 < 4 → 겹침  |       1 |
|    4 | D    | 5-7     |                   4 | 5 ≥ 4 → 선택  |       2 |
|    5 | E    | 3-9     |                   7 | 3 < 7 → 겹침  |       2 |
|    6 | F    | 5-9     |                   7 | 5 < 7 → 겹침  |       2 |
|    7 | G    | 6-10    |                   7 | 6 < 7 → 겹침  |       2 |
|    8 | H    | 8-11    |                   7 | 8 ≥ 7 → 선택  |       3 |

각 회의를 **한 번씩만** 보고 결정하며, 한 번 버린 회의(B, C, …)는 다시 보지 않습니다. 이것이 탐욕이 빠른 이유이자 틀릴 수 있는 이유입니다.

## 9. 다른 예제로 다시 이해하기

도둑이 무게 10kg까지 담을 수 있는 가방을 들고 창고에 들어갔습니다. 물건마다 무게와 가치가 있을 때 가치의 합을 최대로 하려면 무엇을 담아야 할까요? 물건을 **원하는 만큼 쪼갤 수 있다면**(금가루, 쌀처럼) 1kg당 가치가 가장 큰 것부터 담는 탐욕이 최적입니다. 남은 공간을 언제나 "가장 비싼 1kg"으로 채우는 것이기 때문입니다. 하지만 물건을 **통째로만** 담을 수 있다면(노트북, 카메라처럼) 같은 탐욕이 틀릴 수 있습니다. 1kg당 가치가 큰 작은 물건으로 가방을 어중간하게 채우면 남은 공간을 쓸 수 없게 되기 때문입니다. 이 문제를 **0/1 배낭 문제**라고 하며, Day 79의 동적 계획법으로 풉니다.

```python
# 파일: knapsack_greedy.py
from itertools import combinations

items = [("금가루", 6, 30), ("은가루", 5, 20), ("구리선", 5, 20)]   # (이름, 무게kg, 가치)
capacity = 10


def fractional(items, capacity):
    total, plan = 0.0, []
    for name, w, v in sorted(items, key=lambda it: it[2] / it[1], reverse=True):
        take = min(w, capacity)
        total += v * take / w
        capacity -= take
        plan.append(f"{name} {take}kg")
        if capacity == 0:
            break
    return total, plan


def greedy_whole(items, capacity):
    total, plan = 0, []
    for name, w, v in sorted(items, key=lambda it: it[2] / it[1], reverse=True):
        if w <= capacity:
            total += v
            capacity -= w
            plan.append(name)
    return total, plan


def best_whole(items, capacity):
    best = (0, [])
    for r in range(len(items) + 1):
        for group in combinations(items, r):
            if sum(w for _, w, _ in group) <= capacity:
                value = sum(v for _, _, v in group)
                if value > best[0]:
                    best = (value, [name for name, _, _ in group])
    return best


print("쪼갤 수 있을 때(탐욕):", fractional(items, capacity))
print("통째로, 탐욕:          ", greedy_whole(items, capacity))
print("통째로, 모든 경우 시도:", best_whole(items, capacity))
```

실행 결과:

```text
쪼갤 수 있을 때(탐욕): (46.0, ['금가루 6kg', '은가루 4kg'])
통째로, 탐욕:           (30, ['금가루'])
통째로, 모든 경우 시도: (40, ['은가루', '구리선'])
```

1kg당 가치는 금가루 5, 은가루 4, 구리선 4입니다. 쪼갤 수 있으면 금가루 6kg + 은가루 4kg으로 46입니다. 통째로만 담을 때 탐욕은 금가루(6kg)를 먼저 담고 남은 4kg에 아무것도 넣지 못해 30에 그치지만, 은가루와 구리선을 함께 담으면 40입니다. **같은 기준이 문제의 작은 차이 하나로 맞고 틀립니다.**

Rust로도 쪼갤 수 있는 배낭을 풀어 봅시다. 실수(`f64`)는 `Ord`가 아니라서 정렬에 `total_cmp`를 씁니다.

```rust
// 파일: fractional_knapsack.rs
fn main() {
    let mut items = vec![("금가루", 6.0_f64, 30.0_f64), ("은가루", 5.0, 20.0), ("구리선", 5.0, 20.0)];
    items.sort_by(|a, b| (b.2 / b.1).total_cmp(&(a.2 / a.1)));   // 1kg당 가치 내림차순
    let mut capacity = 10.0;
    let mut total = 0.0;
    for (name, weight, value) in items {
        if capacity <= 0.0 {
            break;
        }
        let take = weight.min(capacity);
        total += value * take / weight;
        capacity -= take;
        println!("{name} {take}kg 담음");
    }
    println!("가치 합: {total}");
}
```

실행 결과:

```text
금가루 6kg 담음
은가루 4kg 담음
가치 합: 46
```

## 10. 시간·공간 복잡도

| 문제                   | 탐욕 풀이         | 시간         | 최적?                    |
| ---------------------- | ----------------- | ------------ | ------------------------ |
| 회의실 배정(최대 개수) | 끝나는 시간 순    | O(n log n)   | 예 (바꿔치기 논증)       |
| 최소 강의실 수         | 시작 순 + 최소 힙 | O(n log n)   | 예                       |
| 거스름돈(한국 동전)    | 큰 동전부터       | O(동전 종류) | 예 (특별한 동전 체계)    |
| 거스름돈(임의 동전)    | 큰 동전부터       | O(동전 종류) | **아니요** → 동적 계획법 |
| 쪼갤 수 있는 배낭      | 무게당 가치 순    | O(n log n)   | 예                       |
| 0/1 배낭               | 무게당 가치 순    | O(n log n)   | **아니요** → 동적 계획법 |
| 완전 탐색(검증용)      | 모든 부분집합     | O(2ⁿ · n)    | 예 (하지만 매우 느림)    |

## 11. 세 언어 비교

| 관점           | C                           | Python                              | Rust                                             |
| -------------- | --------------------------- | ----------------------------------- | ------------------------------------------------ |
| 기준으로 정렬  | `qsort` + 비교 함수         | `sorted(key=...)`                   | `sort_by_key`, `sort_by`                         |
| 초기 상태      | 가짜 값 `last_end = -1`     | `float("-inf")`                     | `Option`/`last()`로 "아직 없음"을 표현           |
| 실패 표현      | `-1` 반환                   | `None` 반환                         | `Option<T>`                                      |
| 완전 탐색 도구 | 비트마스크 반복을 직접 작성 | `itertools.combinations`, `product` | 비트마스크 반복 또는 재귀                        |
| 실수 정렬      | 비교 함수로 직접            | 그냥 비교 가능                      | `f64`는 `Ord`가 아니라 `total_cmp`/`partial_cmp` |

## 12. 자주 하는 실수

### 실수 1: 예제 하나로 탐욕 기준이 옳다고 결론 내린다

6절의 "짧은 회의 순"은 주어진 예제에서 우연히 최적이었지만 반례에서 틀렸습니다. 탐욕 기준을 정했다면 **반례를 적극적으로 찾으세요.** 작은 입력을 무작위로 많이 만들어 완전 탐색과 비교하는 프로그램을 짜 두면 좋습니다(실습의 수정 문제).

### 실수 2: 탐욕이 실패하는 문제에 탐욕을 쓴다

임의의 동전 체계의 거스름돈, 0/1 배낭 문제는 탐욕으로 풀 수 없습니다. 결과가 "그럴듯한" 답이라 틀린 줄 모르고 넘어가기 쉽습니다.

### 실수 3: 경계 조건(같은 시각)의 약속을 확인하지 않는다

"4시에 끝나는 회의 다음에 4시에 시작하는 회의"가 가능한지는 문제마다 다릅니다. `>=`와 `>` 한 글자 차이로 답이 달라지므로 문제의 약속을 먼저 확인하세요.

### 실수 4: 정렬 기준에 동점 처리가 없다

끝나는 시간이 같은 회의가 여럿이면 어느 것을 먼저 볼지에 따라 **고르는 회의의 이름**은 달라질 수 있습니다(개수는 같더라도). 결과를 비교하거나 출력해야 한다면 두 번째 기준(예: 시작 시간, 이름)까지 정해 두세요.

### 실수 5: 부동소수점 비교에서 같은 값을 믿는다

```python
# 파일: float_ratio.py
print(0.1 + 0.2 == 0.3, abs((0.1 + 0.2) - 0.3) < 1e-9)
print(sorted([("a", 3 / 9), ("b", 1 / 3)], key=lambda t: t[1]))
```

실행 결과:

```text
False True
[('a', 0.3333333333333333), ('b', 0.3333333333333333)]
```

무게당 가치처럼 나눗셈으로 만든 기준은 실수 오차가 생길 수 있습니다. 값이 "같아야" 하는 경우 `==` 대신 오차 범위로 비교하거나, 분수를 **곱셈으로 비교**(a/b < c/d ⇔ a·d < c·b, 모두 양수일 때)하면 정확합니다.

## 13. Q&A

**Q. 탐욕이 틀린다면 왜 배우나요?**

A. 통하는 문제에서는 가장 빠르고 간단하기 때문입니다. 최소 신장 트리(크루스칼, 프림), 다익스트라 최단 경로(Day 82), 허프만 압축 부호처럼 중요한 알고리즘 상당수가 탐욕입니다. 또한 최적이 아니어도 "충분히 좋은 답"을 빠르게 얻는 **근사 알고리즘**으로도 널리 씁니다.

**Q. 탐욕과 동적 계획법은 어떻게 구별하나요?**

A. 둘 다 "작은 문제의 최적해로 큰 문제의 최적해를 만든다"는 성질이 필요합니다. 탐욕은 매 단계 **선택지 하나만** 따라가고, 동적 계획법은 **모든 선택지의 결과를 저장해 비교**합니다. 탐욕으로 풀리면 탐욕이 더 빠르고, 반례가 있으면 동적 계획법을 씁니다.

**Q. 거스름돈 탐욕이 통하는 동전 체계인지 쉽게 알 수 있나요?**

A. 각 동전이 바로 아래 동전의 배수라면(10, 50, 100, 500처럼) 통합니다. 일반적인 경우에는 판별하는 알고리즘이 있지만, 실용적으로는 어느 정도 큰 금액까지 탐욕과 동적 계획법의 결과를 비교해 보는 것이 쉽습니다(실습의 수정 문제).

**Q. 바꿔치기 논증이 어렵습니다. 꼭 알아야 하나요?**

A. 처음에는 "왜 빨리 끝나는 순이 좋은가"를 직관으로 이해하는 것으로 충분합니다. 다만 새로운 탐욕 문제를 만났을 때 "최적해의 첫 선택을 내 선택으로 바꾸면 손해인가?"라고 스스로 물어보는 습관은 틀린 탐욕을 피하는 데 큰 도움이 됩니다.

## 14. 핵심 요약

- 탐욕 알고리즘은 **기준으로 정렬하고, 하나씩 보며 가능하면 고르고, 되돌리지 않습니다.** 보통 O(n log n)입니다.
- 핵심은 **올바른 기준**을 고르는 것입니다. 회의실 배정은 **빨리 끝나는 순**이 최적이고, 빨리 시작하는 순이나 짧은 순은 반례가 있습니다.
- 탐욕의 정당성은 **바꿔치기 논증**으로 증명하거나, 작은 입력에서 **완전 탐색**과 비교해 반례를 찾아 확인합니다.
- 한국 동전의 거스름돈, 쪼갤 수 있는 배낭은 탐욕이 통하고, 임의의 동전 체계와 0/1 배낭은 통하지 않습니다(→ 동적 계획법).
- 같은 시각의 경계, 동점 처리, 실수 비교처럼 작은 약속이 결과를 바꿀 수 있습니다.

## 15. 도전 문제

1. **(C)** 회의 목록에서 **고른 회의들의 이름**까지 출력하고, 같은 입력을 시작 시간 순으로 골랐을 때와 나란히 비교해 보세요.
2. **(Python)** 무작위 회의 목록(회의 8개, 시간 0~20)을 1,000번 만들어 "짧은 회의 순" 탐욕과 완전 탐색의 결과가 다른 경우가 몇 번인지 세어 보세요.
3. **(Rust)** 파일을 한 번에 하나씩 처리할 때 **평균 대기 시간**을 최소로 하려면 어떤 순서로 처리해야 할까요? 처리 시간이 짧은 것부터 처리하는 탐욕을 구현하고, 모든 순서(순열)를 시도한 결과와 비교하세요.
4. **(세 언어)** 동전 {1, 5, 10, 20, 25}로 1~100원을 탐욕으로 거슬러 줄 때 최소 개수가 아닌 금액을 모두 찾아보세요.
