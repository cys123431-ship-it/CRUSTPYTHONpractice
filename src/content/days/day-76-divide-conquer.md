---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-76-divide-conquer
courseId: crp-92
phaseId: phase-07
dayNumber: 76
date: "2026-12-15"
title: 분할 정복 — 나누고, 풀고, 합치는 설계 방법
summary: 병합 정렬과 퀵 정렬에 공통으로 들어 있는 분할 정복을 하나의 설계 방법으로 정리합니다. 거듭제곱을 O(log n)번의 곱셈으로 구하고, 최대 연속 부분 배열 합을 '왼쪽 안·오른쪽 안·가운데 걸침'의 세 경우로 나눠 푸는 프로그램을 C, Python, Rust로 만든 뒤, 점화식으로 복잡도를 가늠하는 법과 분할 정복이 항상 최선은 아니라는 점(카데인 알고리즘)까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-75-partition]
learningObjectives:
  - 분할 정복의 세 단계(나누기, 정복하기, 결합하기)와 멈춤 조건을 예로 설명한다.
  - 거듭제곱을 절반 크기의 문제 하나로 줄여 곱셈 O(log n)번에 계산한다.
  - 최대 연속 부분 배열 합을 세 경우로 나누고 가운데를 걸치는 경우를 O(n)에 계산한다.
  - T(n) = 2T(n/2) + O(n), T(n) = T(n/2) + O(1) 같은 점화식으로 복잡도를 가늠한다.
  - 같은 문제를 더 단순한 O(n) 방법으로 풀 수 있을 때를 알아보고 비교한다.
concepts:
  [
    divide and conquer,
    recursion,
    fast exponentiation,
    modular arithmetic,
    maximum subarray,
    recurrence,
    master theorem,
    kadane,
  ]
runnerMode: python
playgroundSource: |
  # 파일: power.py — x와 n을 바꿔 곱셈 횟수를 비교해 보세요.
  def power(x, n):
      if n == 0:
          return 1, 0
      half, count = power(x, n // 2)
      result = half * half
      count += 1
      if n % 2:
          result *= x
          count += 1
      return result, count


  for n in [8, 100, 1000]:
      value, count = power(2, n)
      print(f"2^{n}: 곱셈 {count}번 (반복하면 {n}번)")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day76-predict-py
    title: 분할 정복 거듭제곱의 호출 순서 예측하기
    kind: predict
    objective: n이 절반씩 줄어드는 재귀 호출의 인자를 추적한다.
    prompt: 출력될 n 값들을 공백으로 구분해 적으세요.
    starter: |-
      calls = []


      def power(x, n):
          calls.append(n)
          if n == 0:
              return 1
          half = power(x, n // 2)
          return half * half * (x if n % 2 else 1)


      power(5, 20)
      print(*calls)
    answer: "20 10 5 2 1 0"
    hint: "n은 매번 n // 2가 됩니다. 20 → 10 → 5 → 2 → 1 → 0입니다."
    explanation: "호출은 6번, 곱셈은 호출마다 한두 번이라 20번의 곱셈 대신 약 7번이면 됩니다. n의 이진수 자릿수(20 = 10100₂, 5자리)와 호출 횟수가 거의 같다는 점에 주목하세요."
    commonMistakes:
      - "n이 1씩 줄어든다고 생각함"
      - "0에서 멈추지 않고 음수까지 간다고 생각함"
    language: python
    verification: run
  - id: ex-day76-predict-c
    title: 가운데를 걸치는 최대 합 예측하기
    kind: predict
    objective: 가운데에서 양쪽으로 넓혀 가며 각 방향의 최대 합을 구한다.
    prompt: 출력될 세 숫자(왼쪽으로의 최대 합, 오른쪽으로의 최대 합, 두 값의 합)를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {2, -5, 3, 1, -2, 4, -1};
          int mid = 3;
          int sum = 0, best_left = a[mid];
          for (int i = mid; i >= 0; i--) {
              sum += a[i];
              if (sum > best_left) best_left = sum;
          }
          sum = 0;
          int best_right = a[mid + 1];
          for (int j = mid + 1; j < 7; j++) {
              sum += a[j];
              if (sum > best_right) best_right = sum;
          }
          printf("%d %d %d\n", best_left, best_right, best_left + best_right);
          return 0;
      }
    answer: "4 2 6"
    hint: "왼쪽으로: a[3]=1, 1+3=4, 4-5=-1, -1+2=1 → 가장 큰 값은 4. 오른쪽으로: -2, -2+4=2, 2-1=1 → 가장 큰 값은 2."
    explanation: "가운데를 걸치는 부분 배열은 반드시 a[mid]와 a[mid+1]을 포함합니다. 그래서 mid에서 왼쪽으로, mid+1에서 오른쪽으로 각각 가장 큰 합을 구해 더하면 됩니다. 결과 6은 [3, 1, -2, 4]의 합입니다."
    commonMistakes:
      - "음수가 나오면 바로 멈춰야 한다고 생각함(뒤에 더 큰 수가 있을 수 있음)"
      - "오른쪽 시작값을 0으로 둬서 a[mid+1]을 포함하지 않는 경우를 허용함"
    language: c
    verification: run
  - id: ex-day76-fill
    title: Rust 거듭제곱의 결합 단계 채우기
    kind: fill
    objective: 절반 결과를 제곱하고 n이 홀수면 x를 한 번 더 곱한다.
    prompt: "빈칸 두 곳에 결합 단계를 채우세요. 첫 칸은 half를 제곱한 값, 둘째 칸은 n이 홀수일 때의 처리입니다."
    starter: |-
      fn power(x: u64, n: u32) -> u64 {
          if n == 0 {
              return 1;
          }
          let half = power(x, n / 2);
          let mut result = _____;
          if n % 2 == 1 {
              _____;
          }
          result
      }

      fn main() {
          println!("{} {} {}", power(3, 5), power(2, 20), power(10, 0));
      }
    answer: |-
      fn power(x: u64, n: u32) -> u64 {
          if n == 0 {
              return 1;
          }
          let half = power(x, n / 2);
          let mut result = half * half;
          if n % 2 == 1 {
              result *= x;
          }
          result
      }

      fn main() {
          println!("{} {} {}", power(3, 5), power(2, 20), power(10, 0));
      }
    output: "243 1048576 1"
    hint: "x^5 = (x^2)^2 × x입니다. n / 2 = 2라서 half = x^2이고, 제곱하면 x^4, 홀수이므로 x를 한 번 더 곱합니다."
    explanation: "power(x, n)을 한 번만 재귀 호출하고 그 결과를 제곱합니다. half를 두 번 계산하는 power(x, n/2) * power(x, n/2)로 쓰면 호출이 두 갈래로 나뉘어 다시 O(n)번의 곱셈이 됩니다."
    commonMistakes:
      - "power(x, n / 2) * power(x, n / 2)로 써서 같은 계산을 두 번 함"
      - "홀수일 때 result += x로 더하기를 씀"
    language: rust
    verification: run
  - id: ex-day76-modify
    title: Python 최대 부분 배열에 위치 정보 넣기
    kind: modify
    objective: 분할 정복의 각 경우가 값과 함께 구간을 돌려주도록 확장한다.
    prompt: "max_sub가 가장 큰 합뿐 아니라 그 구간의 시작과 끝 인덱스도 (합, 시작, 끝)으로 돌려주도록 고치세요. [5, -9, 6, -2, 3]에서 (7, 2, 4)가 나와야 합니다."
    starter: |-
      def max_sub(a, lo, hi):
          if lo == hi:
              return a[lo]
          mid = (lo + hi) // 2
          left = max_sub(a, lo, mid)
          right = max_sub(a, mid + 1, hi)
          s, best_l = 0, a[mid]
          for i in range(mid, lo - 1, -1):
              s += a[i]
              best_l = max(best_l, s)
          s, best_r = 0, a[mid + 1]
          for j in range(mid + 1, hi + 1):
              s += a[j]
              best_r = max(best_r, s)
          return max(left, right, best_l + best_r)


      data = [5, -9, 6, -2, 3]
      print(max_sub(data, 0, len(data) - 1))
    answer: |-
      def max_sub(a, lo, hi):
          if lo == hi:
              return a[lo], lo, hi
          mid = (lo + hi) // 2
          left = max_sub(a, lo, mid)
          right = max_sub(a, mid + 1, hi)
          s, best_l, start = 0, a[mid], mid
          for i in range(mid, lo - 1, -1):
              s += a[i]
              if s > best_l:
                  best_l, start = s, i
          s, best_r, end = 0, a[mid + 1], mid + 1
          for j in range(mid + 1, hi + 1):
              s += a[j]
              if s > best_r:
                  best_r, end = s, j
          return max(left, right, (best_l + best_r, start, end), key=lambda t: t[0])


      data = [5, -9, 6, -2, 3]
      print(max_sub(data, 0, len(data) - 1))
    output: "(7, 2, 4)"
    hint: "가장 큰 합을 갱신할 때마다 그때의 인덱스도 함께 기록하세요. max에 key를 주면 튜플의 첫 값(합)으로만 비교합니다."
    explanation: "[6, -2, 3]의 합 7이 가장 큽니다. 튜플끼리 그냥 max를 쓰면 합이 같을 때 인덱스까지 비교하므로, key로 합만 비교하도록 했습니다. 이렇게 '답과 함께 근거를 돌려주기'는 분할 정복에서 자주 하는 확장입니다."
    commonMistakes:
      - "원소 하나일 때도 튜플을 돌려줘야 하는 것을 잊어 정수와 튜플을 비교하는 오류를 냄"
      - "가장 큰 합을 갱신하지 않을 때도 인덱스를 바꿈"
    language: python
    verification: run
  - id: ex-day76-debug
    title: C 거듭제곱의 중복 재귀 고치기
    kind: debug
    objective: 같은 부분 문제를 두 번 푸는 재귀가 O(n)이 된다는 것을 확인하고 고친다.
    prompt: "이 power는 절반 문제를 두 번 호출해서 결과는 맞지만 호출 횟수가 n에 비례합니다. 한 번만 호출하도록 고쳐 2^64 크기의 문제에서도 호출이 몇십 번이 되게 하세요. 출력은 결과(mod 1000)와 호출 횟수입니다."
    starter: |-
      #include <stdio.h>

      int calls = 0;

      long long power_mod(long long x, long long n, long long m) {
          calls++;
          if (n == 0) return 1 % m;
          long long r = power_mod(x, n / 2, m) * power_mod(x, n / 2, m) % m;
          if (n % 2 == 1) r = r * x % m;
          return r;
      }

      int main(void) {
          long long r = power_mod(7, 1000, 1000);
          printf("%lld %d\n", r, calls);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int calls = 0;

      long long power_mod(long long x, long long n, long long m) {
          calls++;
          if (n == 0) return 1 % m;
          long long half = power_mod(x, n / 2, m);
          long long r = half * half % m;
          if (n % 2 == 1) r = r * x % m;
          return r;
      }

      int main(void) {
          long long r = power_mod(7, 1000, 1000);
          printf("%lld %d\n", r, calls);
          return 0;
      }
    output: "1 11"
    starterOutput: "1 2047"
    hint: "power_mod(x, n / 2, m)의 값은 두 번 계산해도 같습니다. 한 번만 계산해 변수에 담아 두세요."
    explanation: "원래 코드는 호출마다 두 갈래로 나뉘어 1000 → 약 2000번(2047번)을 호출합니다. 고친 코드는 한 갈래라 log₂ 1000 + 2 ≈ 11번입니다. T(n) = 2T(n/2) + O(1)은 O(n), T(n) = T(n/2) + O(1)은 O(log n)이라는 차이입니다. 7^1000의 끝 세 자리는 001입니다."
    commonMistakes:
      - "호출 수를 줄이려고 n / 2 대신 n - 1로 바꿔 오히려 O(n)으로 만듦"
      - "나머지 연산을 빼서 7^1000을 long long에 담으려다 넘침"
    language: c
    verification: run
  - id: ex-day76-independent
    title: Rust로 분할 정복 최댓값·최솟값 찾기
    kind: independent
    objective: 두 값을 함께 돌려주는 분할 정복으로 비교 횟수를 줄인다.
    prompt: "fn min_max(a: &[i32]) -> (i32, i32, u32)가 최솟값, 최댓값, 비교 횟수를 돌려주게 하세요. 원소가 1개면 비교 0번, 2개면 1번으로 처리하고, 그보다 크면 반으로 나눠 결과를 합칩니다(최솟값끼리 1번, 최댓값끼리 1번). 원소 8개 [3, 9, -2, 7, 5, 0, 12, 4]에서 -2 12 10이 나와야 합니다."
    starter: |-
      fn main() {
          let a = [3, 9, -2, 7, 5, 0, 12, 4];
          println!("{}", a.len());
      }
    answer: |-
      fn min_max(a: &[i32]) -> (i32, i32, u32) {
          match a.len() {
              1 => (a[0], a[0], 0),
              2 => {
                  if a[0] < a[1] { (a[0], a[1], 1) } else { (a[1], a[0], 1) }
              }
              _ => {
                  let (left, right) = a.split_at(a.len() / 2);
                  let (lmin, lmax, lc) = min_max(left);
                  let (rmin, rmax, rc) = min_max(right);
                  (lmin.min(rmin), lmax.max(rmax), lc + rc + 2)
              }
          }
      }

      fn main() {
          let a = [3, 9, -2, 7, 5, 0, 12, 4];
          let (lo, hi, comps) = min_max(&a);
          println!("{lo} {hi} {comps}");
      }
    output: "-2 12 10"
    hint: "8개 → 4개 둘 → 2개 넷. 2개짜리 넷에서 1번씩 4번, 4개짜리 둘에서 2번씩 4번, 8개에서 2번. 합은 10입니다."
    explanation: "최솟값과 최댓값을 따로 구하면 (n-1) + (n-1) = 14번 비교합니다. 둘을 함께 구하는 분할 정복은 약 3n/2 - 2 = 10번이면 됩니다. 2개짜리 조각에서 한 번의 비교로 두 값의 역할을 동시에 정하기 때문입니다."
    commonMistakes:
      - "원소 2개일 때도 반으로 나눠 불필요한 비교를 함"
      - "합칠 때 최솟값과 최댓값을 섞어 비교함"
    language: rust
    verification: run
quiz:
  - id: quiz-day76-01
    question: 분할 정복의 세 단계를 순서대로 고르세요.
    choices:
      - 정렬하기 → 찾기 → 출력하기
      - 나누기 → 작은 문제 풀기(정복) → 결과 합치기(결합)
      - 합치기 → 나누기 → 풀기
      - 반복하기 → 저장하기 → 비교하기
    answerIndex: 1
    explanation: 문제를 같은 모양의 작은 문제로 나누고, 작은 문제를 재귀로 풀고, 그 답들로 원래 문제의 답을 만듭니다. 더 나눌 수 없을 만큼 작은 문제는 직접 풉니다(멈춤 조건).
  - id: quiz-day76-02
    question: 분할 정복 거듭제곱으로 x^1024를 구할 때 필요한 곱셈은 대략 몇 번인가요?
    choices: ["약 10번", "약 100번", "약 512번", "1024번"]
    answerIndex: 0
    explanation: n이 매번 절반이 되므로 약 log₂ 1024 = 10번 제곱하면 됩니다. 1024는 2의 거듭제곱이라 홀수 단계의 추가 곱셈도 거의 없습니다.
  - id: quiz-day76-03
    question: "점화식 T(n) = 2T(n/2) + O(n)을 따르는 알고리즘은?"
    choices: ["이진 탐색", "병합 정렬", "선형 탐색", "분할 정복 거듭제곱"]
    answerIndex: 1
    explanation: 병합 정렬은 크기 n/2인 문제 두 개를 풀고, 합치는 데 O(n)이 듭니다. 이 점화식의 해는 O(n log n)입니다. 이진 탐색과 거듭제곱은 T(n) = T(n/2) + O(1)로 O(log n)입니다.
  - id: quiz-day76-04
    question: 최대 연속 부분 배열 합을 분할 정복으로 풀 때 가운데를 걸치는 경우를 따로 계산해야 하는 이유는?
    choices:
      - 왼쪽과 오른쪽의 답을 더하면 항상 정답이기 때문에
      - 답이 되는 구간이 왼쪽과 오른쪽에 걸쳐 있으면 두 재귀 호출 어느 쪽도 그 구간을 보지 못하기 때문에
      - 가운데 원소가 항상 가장 크기 때문에
      - 재귀를 멈추기 위해
    answerIndex: 1
    explanation: 왼쪽 재귀는 왼쪽 안의 구간만, 오른쪽 재귀는 오른쪽 안의 구간만 봅니다. 가운데를 걸치는 구간은 결합 단계에서 O(n)으로 직접 구해야 모든 경우가 빠짐없이 검사됩니다.
  - id: quiz-day76-05
    question: 최대 연속 부분 배열 합의 분할 정복 풀이(O(n log n))와 카데인 알고리즘(O(n))에 대한 설명으로 옳은 것은?
    choices:
      - 분할 정복이 항상 더 빠르다
      - 같은 문제라도 더 단순하고 빠른 방법이 있을 수 있어서, 카데인 알고리즘이 더 빠르다
      - 두 방법의 결과가 다르다
      - 카데인 알고리즘은 음수가 있으면 쓸 수 없다
    answerIndex: 1
    explanation: 분할 정복은 강력한 설계 방법이지만 모든 문제의 최선은 아닙니다. 카데인 알고리즘은 한 번 훑으며 '여기서 끝나는 최대 합'만 기억해 O(n)에 같은 답을 구합니다. 이 아이디어는 Day 79의 동적 계획법과 이어집니다.
---

## 1. 오늘 배울 내용

Day 74의 병합 정렬과 Day 75의 퀵 정렬은 모양이 달라 보이지만 같은 생각에서 나왔습니다. **큰 문제를 같은 모양의 작은 문제로 나눠 풀고, 그 답을 합친다**는 생각입니다. 이 설계 방법을 **분할 정복(divide and conquer)** 이라고 부릅니다. 오늘은 정렬이 아닌 두 문제에 분할 정복을 적용하며 이 방법을 일반적인 도구로 만듭니다.

1. 분할 정복의 세 단계와 멈춤 조건을 정리합니다.
2. **거듭제곱** xⁿ을 n번이 아니라 **약 log₂ n번**의 곱셈으로 구합니다. 큰 수의 나머지를 구하는 **모듈러 거듭제곱**도 봅니다.
3. **최대 연속 부분 배열 합**을 세 경우로 나눠 O(n log n)에 풉니다.
4. **점화식**으로 분할 정복 알고리즘의 복잡도를 가늠합니다.
5. 응용으로 같은 문제를 O(n)에 푸는 **카데인 알고리즘**과 비교하고, 행렬 거듭제곱으로 피보나치 수를 빠르게 구합니다.

## 2. 왜 분할 정복인가

두꺼운 책에서 오타를 찾는 일을 친구들과 나눈다고 생각해 봅시다. 책을 반으로 나눠 두 사람에게 맡기고, 각자는 받은 부분을 또 반으로 나눠 다른 사람에게 맡깁니다. 한 사람이 몇 쪽씩만 맡게 되면 직접 찾고, 찾은 결과를 거꾸로 모아 올립니다.

분할 정복이 잘 통하는 문제에는 두 가지 특징이 있습니다.

- **같은 모양의 작은 문제로 나눌 수 있다.** 배열 정렬 → 절반 배열 정렬, xⁿ → x^(n/2).
- **작은 문제의 답으로 큰 문제의 답을 효율적으로 만들 수 있다.** 정렬된 두 절반 → 병합(O(n)), x^(n/2) → 제곱(곱셈 한 번).

두 번째 조건, 즉 **결합 비용**이 알고리즘 전체의 속도를 결정합니다.

## 3. 그림으로 이해하기

분할 정복의 일반적인 모양입니다.

```text
                     solve(문제)
                  ┌───────┴───────┐
             ① 나누기          (문제가 충분히 작으면 직접 푼다 = 멈춤 조건)
          ┌──────┴──────┐
   solve(작은 문제 1)  solve(작은 문제 2)    ② 정복: 재귀로 푼다
          └──────┬──────┘
             ③ 결합: 두 답으로 원래 문제의 답을 만든다
```

오늘의 두 문제를 이 틀에 넣으면 다음과 같습니다.

| 문제           | 나누기             | 작은 문제의 수 | 결합                                  | 멈춤 조건  |
| -------------- | ------------------ | -------------- | ------------------------------------- | ---------- |
| 병합 정렬      | 배열을 반으로      | 2개            | 병합 O(n)                             | 원소 1개   |
| 퀵 정렬        | 피벗으로 분할 O(n) | 2개            | 없음                                  | 원소 0~1개 |
| 이진 탐색      | 가운데와 비교      | **1개**        | 없음                                  | 구간이 빔  |
| 거듭제곱 xⁿ    | n을 반으로         | **1개**        | 제곱(+ 홀수면 x 곱하기) O(1)          | n = 0      |
| 최대 부분 배열 | 배열을 반으로      | 2개            | 가운데 걸침 계산 O(n) + 세 값 중 최대 | 원소 1개   |

## 4. 천천히 풀어보기

### 4.1 거듭제곱: 절반 문제 하나로 줄이기

2¹⁰을 구하려면 2를 10번 곱하면 됩니다. 하지만 2¹⁰ = (2⁵)²이므로 **2⁵만 알면 곱셈 한 번**으로 끝납니다. 2⁵ = (2²)² × 2, 2² = (2¹)², 2¹ = (2⁰)² × 2입니다.

```text
xⁿ = (x^(n/2))²          n이 짝수일 때
xⁿ = (x^(n/2))² × x      n이 홀수일 때 (n/2는 정수 나눗셈)
x⁰ = 1                   멈춤 조건
```

n이 매번 절반이 되므로 재귀는 약 log₂ n번이고, 호출마다 곱셈은 한두 번이라 전체 곱셈은 **O(log n)** 번입니다. 2⁶²를 곱셈 62번 대신 11번에 구합니다.

**핵심 주의점**: 절반 문제는 **한 번만** 풀어야 합니다. `power(x, n/2) * power(x, n/2)`처럼 두 번 부르면 같은 계산을 두 번 하게 되고, 그 안에서 또 두 번씩 불러 호출이 **두 갈래로** 퍼집니다. 결과는 맞지만 곱셈이 다시 약 n번이 됩니다(실습의 디버그 문제).

### 4.2 큰 거듭제곱의 나머지

2¹⁰⁰⁰은 302자리 수라 C와 Rust의 64비트 정수에 들어가지 않습니다. 하지만 "2¹⁰⁰⁰을 1,000,000,007로 나눈 나머지"처럼 **나머지만** 필요할 때가 많습니다(암호, 해시, 프로그래밍 대회). 곱셈의 나머지는 **곱하기 전에 나머지를 구해도** 같다는 성질을 씁니다.

```text
(a × b) mod m = ((a mod m) × (b mod m)) mod m
```

곱할 때마다 나머지를 구하면 수가 m보다 커지지 않습니다. m이 약 10⁹이면 두 수의 곱은 약 10¹⁸이라 64비트 정수에 들어갑니다. 이 방법으로 2의 1조 제곱의 나머지도 곱셈 53번에 구할 수 있습니다(7절).

### 4.3 최대 연속 부분 배열 합: 세 경우로 나누기

주식의 날마다 수익이 `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`일 때, **연속된 날들**의 수익 합이 가장 큰 구간은 어디일까요? 모든 구간을 시도하면 O(n²)입니다. 분할 정복으로 생각하면 가장 좋은 구간은 반드시 다음 셋 중 하나입니다.

```text
          왼쪽 절반        │        오른쪽 절반
  ① ━━━━━━━━━          │                          왼쪽 안에만 있다 → 재귀로 푼다
  ②                     │     ━━━━━━━━━          오른쪽 안에만 있다 → 재귀로 푼다
  ③            ━━━━━━━━━━━━━━━━                  가운데를 걸친다 → 직접 계산
                       mid mid+1
```

①과 ②는 같은 문제를 절반 크기로 푸는 것이라 재귀에 맡깁니다. ③이 결합 단계입니다. 가운데를 걸치는 구간은 **반드시 a[mid]와 a[mid+1]을 포함**하므로,

- a[mid]에서 **왼쪽으로** 한 칸씩 늘려 가며 합이 가장 큰 곳을 찾고,
- a[mid+1]에서 **오른쪽으로** 한 칸씩 늘려 가며 합이 가장 큰 곳을 찾아,
- 두 값을 더하면 됩니다.

양쪽을 한 번씩 훑으므로 O(n)입니다. 세 값 중 가장 큰 것이 답입니다.

### 4.4 점화식으로 복잡도 가늠하기

분할 정복 알고리즘의 시간은 **"자기 자신을 몇 번, 어떤 크기로 부르고, 나머지 일이 얼마인가"** 로 적을 수 있습니다. 이런 식을 **점화식**이라고 합니다.

| 점화식                | 뜻                           | 결과       | 예                                        |
| --------------------- | ---------------------------- | ---------- | ----------------------------------------- |
| T(n) = T(n/2) + O(1)  | 절반 문제 하나 + 상수 일     | O(log n)   | 이진 탐색, 거듭제곱                       |
| T(n) = T(n/2) + O(n)  | 절반 문제 하나 + 선형 일     | O(n)       | 퀵 선택(평균)                             |
| T(n) = 2T(n/2) + O(1) | 절반 문제 둘 + 상수 일       | O(n)       | 트리의 모든 노드 방문, 중복 재귀 거듭제곱 |
| T(n) = 2T(n/2) + O(n) | 절반 문제 둘 + 선형 일       | O(n log n) | 병합 정렬, 최대 부분 배열                 |
| T(n) = T(n-1) + O(n)  | 1만 줄인 문제 하나 + 선형 일 | O(n²)      | 최악의 퀵 정렬                            |

외울 필요는 없습니다. Day 74에서 한 것처럼 재귀 트리를 **층별로** 그려 "층마다 일이 얼마이고 층이 몇 개인가"를 세면 스스로 구할 수 있습니다. 이것을 일반화한 공식을 **마스터 정리**라고 합니다.

## 5. C로 구현하기

C 프로그램은 거듭제곱을 반복 곱셈과 분할 정복으로 각각 계산해 곱셈 횟수를 비교하고, 최대 연속 부분 배열 합을 분할 정복으로 구합니다.

```c
// 파일: divide_conquer.c
#include <stdio.h>

static int multiplications = 0;

// 단순 반복: x를 n번 곱한다 → O(n)
long long power_loop(long long x, int n) {
    long long result = 1;
    for (int i = 0; i < n; i++) {
        result *= x;
        multiplications++;
    }
    return result;
}

// 분할 정복: x^n = (x^(n/2))^2 (n이 홀수면 x를 한 번 더) → O(log n)
long long power_dc(long long x, int n) {
    if (n == 0) {
        return 1;                           // 가장 작은 문제
    }
    long long half = power_dc(x, n / 2);    // 절반 크기의 같은 문제 하나
    long long result = half * half;         // 결합
    multiplications++;
    if (n % 2 == 1) {
        result *= x;
        multiplications++;
    }
    return result;
}

static int max3(int a, int b, int c) {
    int m = a > b ? a : b;
    return m > c ? m : c;
}

// 가운데를 가로지르는 가장 큰 합: 왼쪽 끝을 mid에서, 오른쪽 끝을 mid+1에서 늘려 본다
int max_crossing(const int a[], int lo, int mid, int hi) {
    int sum = 0, best_left = a[mid];
    for (int i = mid; i >= lo; i--) {
        sum += a[i];
        if (sum > best_left) best_left = sum;
    }
    sum = 0;
    int best_right = a[mid + 1];
    for (int j = mid + 1; j <= hi; j++) {
        sum += a[j];
        if (sum > best_right) best_right = sum;
    }
    return best_left + best_right;
}

// 연속된 부분 배열의 합 중 가장 큰 값
int max_subarray(const int a[], int lo, int hi) {
    if (lo == hi) {
        return a[lo];                       // 원소 하나
    }
    int mid = lo + (hi - lo) / 2;
    int left = max_subarray(a, lo, mid);            // ① 왼쪽 안에 있는 경우
    int right = max_subarray(a, mid + 1, hi);       // ② 오른쪽 안에 있는 경우
    int cross = max_crossing(a, lo, mid, hi);       // ③ 가운데를 걸치는 경우
    return max3(left, right, cross);
}

int main(void) {
    int exponents[] = {10, 30, 62};
    for (int k = 0; k < 3; k++) {
        int n = exponents[k];
        multiplications = 0;
        long long a = power_loop(2, n);
        int loop_count = multiplications;
        multiplications = 0;
        long long b = power_dc(2, n);
        printf("2^%-2d = %lld  반복 곱셈 %2d번, 분할 정복 곱셈 %d번, 같음: %d\n",
               n, b, loop_count, multiplications, a == b);
    }

    int profit[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int n = sizeof profit / sizeof profit[0];
    printf("최대 연속 합: %d\n", max_subarray(profit, 0, n - 1));
    int all_negative[] = {-8, -3, -6, -2, -5};
    printf("모두 음수일 때: %d\n", max_subarray(all_negative, 0, 4));
    return 0;
}
```

실행 결과:

```text
2^10 = 1024  반복 곱셈 10번, 분할 정복 곱셈 6번, 같음: 1
2^30 = 1073741824  반복 곱셈 30번, 분할 정복 곱셈 9번, 같음: 1
2^62 = 4611686018427387904  반복 곱셈 62번, 분할 정복 곱셈 11번, 같음: 1
최대 연속 합: 6
모두 음수일 때: -2
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `long long half = power_dc(x, n / 2);`                 | 절반 문제를 **한 번만** 풀어 변수에 담습니다. 이 한 줄이 O(n)과 O(log n)을 가릅니다.                                                                                                       |
| `long long result = half * half;`                      | 결합 단계입니다. x^(n/2)를 제곱합니다.                                                                                                                                                     |
| `if (n % 2 == 1) { result *= x; }`                     | n이 홀수면 n/2가 내림되어 x 하나가 모자라므로 한 번 더 곱합니다. 2^62까지만 쓴 이유는 2^63부터 `long long` 범위(부호 있는 64비트)를 넘기 때문입니다.                                       |
| `int best_left = a[mid];`                              | 왼쪽으로 늘려 가는 합의 시작값을 0이 아니라 **a[mid]** 로 둡니다. 가운데를 걸치는 구간은 a[mid]를 반드시 포함해야 하기 때문입니다. 0으로 두면 "아무것도 안 고르는" 구간을 허용하게 됩니다. |
| `for (int i = mid; i >= lo; i--) { sum += a[i]; ... }` | 음수를 만나도 멈추지 않습니다. 그 뒤에 큰 양수가 있으면 합이 다시 커질 수 있기 때문입니다.                                                                                                 |
| `return max3(left, right, cross);`                     | 세 경우 중 가장 큰 값이 답입니다.                                                                                                                                                          |
| `모두 음수일 때: -2`                                   | 모든 원소가 음수면 가장 큰 원소 하나(-2)가 답입니다. 구간이 적어도 원소 하나는 포함해야 한다고 약속했기 때문입니다.                                                                        |

반복 곱셈은 n번, 분할 정복은 n의 이진수 자릿수에 비례합니다. 62 = 111110₂는 6자리이고, 곱셈은 제곱 6번 + 1인 자리의 추가 곱셈 5번 = 11번입니다.

## 6. Python으로 구현하기

Python 버전은 거듭제곱의 재귀 호출을 들여쓰기로 보여 주고, 최대 부분 배열의 **구간 위치**까지 돌려줍니다. Python 정수는 크기 제한이 없어서 2¹⁰⁰⁰도 정확히 계산됩니다.

```python
# 파일: divide_conquer.py
def power(x, n, depth=0, trace=False):
    """x^n을 분할 정복으로 계산한다. 곱셈 횟수도 돌려준다."""
    if trace:
        print("  " * depth + f"power({x}, {n})")
    if n == 0:
        return 1, 0
    half, count = power(x, n // 2, depth + 1, trace)
    result = half * half
    count += 1
    if n % 2 == 1:
        result *= x
        count += 1
    return result, count


def max_subarray(a, lo, hi):
    """(가장 큰 합, 시작, 끝)을 돌려준다."""
    if lo == hi:
        return a[lo], lo, hi
    mid = (lo + hi) // 2
    left = max_subarray(a, lo, mid)
    right = max_subarray(a, mid + 1, hi)

    total, best_l, start = 0, a[mid], mid
    for i in range(mid, lo - 1, -1):          # 가운데에서 왼쪽으로
        total += a[i]
        if total > best_l:
            best_l, start = total, i
    total, best_r, end = 0, a[mid + 1], mid + 1
    for j in range(mid + 1, hi + 1):          # 가운데에서 오른쪽으로
        total += a[j]
        if total > best_r:
            best_r, end = total, j
    cross = (best_l + best_r, start, end)
    return max(left, right, cross, key=lambda t: t[0])


value, count = power(3, 13, trace=True)
print(f"3^13 = {value}, 곱셈 {count}번 (그냥 곱하면 13번)")
value, count = power(2, 1000)
print(f"2^1000의 자릿수 {len(str(value))}, 곱셈 {count}번")

profit = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
best, s, e = max_subarray(profit, 0, len(profit) - 1)
print(f"최대 연속 합 {best}: 인덱스 {s}~{e} {profit[s:e + 1]}")
print("pow 내장 함수(모듈러):", pow(3, 13, 1000), "=", 3 ** 13 % 1000)
```

실행 결과:

```text
power(3, 13)
  power(3, 6)
    power(3, 3)
      power(3, 1)
        power(3, 0)
3^13 = 1594323, 곱셈 7번 (그냥 곱하면 13번)
2^1000의 자릿수 302, 곱셈 16번
최대 연속 합 6: 인덱스 3~6 [4, -1, 2, 1]
pow 내장 함수(모듈러): 323 = 323
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `half, count = power(x, n // 2, depth + 1, trace)` | 값과 곱셈 횟수를 튜플로 함께 돌려받습니다. 호출이 13 → 6 → 3 → 1 → 0으로 한 갈래로만 이어지는 것을 출력에서 확인하세요.                                                           |
| `2^1000의 자릿수 302, 곱셈 16번`                   | 1000 = 1111101000₂(10자리, 1이 6개)이라 제곱 10번 + 추가 곱셈 6번 = 16번입니다. Python은 큰 수 곱셈도 알아서 해 줍니다.                                                           |
| `for i in range(mid, lo - 1, -1):`                 | mid부터 lo까지 거꾸로 셉니다. range의 끝 값은 포함되지 않으므로 `lo - 1`로 씁니다.                                                                                                |
| `if total > best_l: best_l, start = total, i`      | 가장 큰 합을 **갱신할 때만** 시작 위치를 기록합니다.                                                                                                                              |
| `max(left, right, cross, key=lambda t: t[0])`      | 세 튜플을 합(첫 값)으로만 비교합니다.                                                                                                                                             |
| `pow(3, 13, 1000)`                                 | Python 내장 함수 `pow`에 세 번째 인자를 주면 **모듈러 거듭제곱**을 분할 정복과 같은 방법으로 빠르게 계산합니다. 큰 수를 끝까지 만들지 않으므로 `3 ** 13 % 1000`보다 효율적입니다. |

## 7. Rust로 구현하기

Rust 버전은 **모듈러 거듭제곱**으로 2의 1조 제곱의 나머지를 구하고, 슬라이스를 `split_at`으로 나누는 최대 부분 배열 합을 구현합니다.

```rust
// 파일: divide_conquer.rs
fn power_mod(x: u64, n: u64, m: u64, count: &mut u32) -> u64 {
    if n == 0 {
        return 1 % m;
    }
    let half = power_mod(x, n / 2, m, count);
    let mut result = half * half % m;       // 나머지를 계속 구해 수가 커지지 않게 한다
    *count += 1;
    if n % 2 == 1 {
        result = result * (x % m) % m;
        *count += 1;
    }
    result
}

fn max_subarray(a: &[i64]) -> i64 {
    if a.len() == 1 {
        return a[0];
    }
    let mid = a.len() / 2;
    let (left, right) = a.split_at(mid);            // left = a[..mid], right = a[mid..]
    let best_left = max_subarray(left);
    let best_right = max_subarray(right);

    let mut sum = 0;
    let mut cross_left = i64::MIN;
    for &v in left.iter().rev() {                    // 가운데에서 왼쪽으로
        sum += v;
        cross_left = cross_left.max(sum);
    }
    sum = 0;
    let mut cross_right = i64::MIN;
    for &v in right {                                // 가운데에서 오른쪽으로
        sum += v;
        cross_right = cross_right.max(sum);
    }
    best_left.max(best_right).max(cross_left + cross_right)
}

fn main() {
    let modulus = 1_000_000_007;
    for n in [10u64, 1_000, 1_000_000_000_000] {
        let mut count = 0;
        let r = power_mod(2, n, modulus, &mut count);
        println!("2^{n} mod 1e9+7 = {r}, 곱셈 {count}번");
    }
    let profit = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    println!("최대 연속 합: {}", max_subarray(&profit));
    println!("원소 하나: {}", max_subarray(&[-7]));
}
```

실행 결과:

```text
2^10 mod 1e9+7 = 1024, 곱셈 6번
2^1000 mod 1e9+7 = 688423210, 곱셈 16번
2^1000000000000 mod 1e9+7 = 959366170, 곱셈 53번
최대 연속 합: 6
원소 하나: -7
```

### 코드 한 부분씩 읽기

| 코드                                                    | 설명                                                                                                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn power_mod(x: u64, n: u64, m: u64, count: &mut u32)` | 곱셈 횟수를 `&mut` 매개변수로 셉니다(Day 71의 피보나치와 같은 방법).                                                                                       |
| `return 1 % m;`                                         | m이 1이면 모든 수의 나머지가 0이므로 `1`이 아니라 `1 % m`을 돌려줍니다. 경계 경우를 꼼꼼히 챙기는 습관입니다.                                              |
| `let mut result = half * half % m;`                     | half는 m보다 작으므로(약 10⁹) 곱은 약 10¹⁸로 u64 최댓값(약 1.8 × 10¹⁹) 안에 들어갑니다. m이 더 크면 `u128`로 계산해야 합니다.                              |
| `2^1000000000000 ... 곱셈 53번`                         | 1조는 약 2⁴⁰이라 제곱 40번 + 이진수의 1인 자리 13개 = 53번입니다. 반복 곱셈이었다면 1조 번이라 컴퓨터로 몇 시간이 걸립니다.                                |
| `let (left, right) = a.split_at(mid);`                  | 읽기 전용 슬라이스를 둘로 나눕니다. 인덱스 lo, hi를 넘기지 않아도 됩니다.                                                                                  |
| `for &v in left.iter().rev()`                           | 왼쪽 절반을 **끝(가운데)부터** 거꾸로 훑습니다. C의 `for (i = mid; i >= lo; i--)`와 같은 일입니다.                                                         |
| `let mut cross_left = i64::MIN;`                        | 가장 작은 값으로 시작하면 첫 원소를 더한 합이 항상 더 커서 반드시 갱신됩니다. 원소를 적어도 하나 포함하게 하는 C의 `best_left = a[mid]`와 같은 효과입니다. |

## 8. 실행 추적

최대 부분 배열 `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`의 가장 바깥 호출을 따라갑니다. lo = 0, hi = 8, mid = 4입니다.

| 단계                | 계산                                                  | 결과 |
| ------------------- | ----------------------------------------------------- | ---: |
| ① 왼쪽 재귀         | `[-2, 1, -3, 4, -1]` 안의 최대 → `[4]`                |    4 |
| ② 오른쪽 재귀       | `[2, 1, -5, 4]` 안의 최대 → `[2, 1]` 또는 `[4]`       |    4 |
| ③ 왼쪽으로 넓히기   | a[4]=-1: -1, +4: 3, -3: 0, +1: 1, -2: -1 → 가장 큰 값 |    3 |
| ③ 오른쪽으로 넓히기 | a[5]=2: 2, +1: 3, -5: -2, +4: 2 → 가장 큰 값          |    3 |
| ③ 가운데 걸침       | 3 + 3 (구간 `[4, -1, 2, 1]`)                          |    6 |
| 결합                | max(4, 4, 6)                                          |    6 |

양쪽 절반 안에서는 4가 최선이었지만, 두 절반을 **걸친** 구간 `[4, -1, 2, 1]`이 6으로 더 큽니다. 결합 단계에서 가운데를 따로 계산하지 않았다면 이 답을 놓쳤을 것입니다.

## 9. 다른 예제로 다시 이해하기

분할 정복은 강력하지만 **항상 최선은 아닙니다.** 최대 연속 부분 배열 합은 한 번만 훑어도 풀 수 있습니다. 왼쪽부터 보면서 "지금 위치에서 **끝나는** 구간 중 가장 큰 합"만 기억하면 됩니다. 새 원소 x를 볼 때, 앞에서 이어 온 합이 음수라면 이어 붙이는 것이 손해이므로 x에서 새로 시작하고, 아니면 이어 붙입니다. 이것을 **카데인 알고리즘**이라고 하며 O(n)입니다. "앞의 답을 이용해 다음 답을 만든다"는 이 생각은 Day 79의 **동적 계획법**으로 이어집니다. 문제를 풀 때는 먼저 떠오르는 방법으로 풀고, 더 단순하고 빠른 방법이 있는지 한 번 더 생각해 보는 습관이 중요합니다.

```python
# 파일: kadane.py
def kadane(a):
    best = current = a[0]
    steps = 0
    for x in a[1:]:
        steps += 1
        current = max(x, current + x)     # 이어 붙일까, 새로 시작할까
        best = max(best, current)
    return best, steps


def divide_conquer_steps(n):
    """분할 정복 풀이가 가운데 걸침 계산에서 보는 원소 수"""
    if n <= 1:
        return 0
    half = n // 2
    return divide_conquer_steps(half) + divide_conquer_steps(n - half) + n


profit = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print("카데인:", kadane(profit))
for n in [8, 1024, 1_000_000]:
    print(f"n={n:>9}: 카데인 {n - 1:>9}번, 분할 정복 약 {divide_conquer_steps(n):>9}번")
```

실행 결과:

```text
카데인: (6, 8)
n=        8: 카데인         7번, 분할 정복 약        24번
n=     1024: 카데인      1023번, 분할 정복 약     10240번
n=  1000000: 카데인    999999번, 분할 정복 약  19951424번
```

거듭제곱의 분할 정복 아이디어는 숫자뿐 아니라 **행렬**에도 쓸 수 있습니다. 피보나치 수는 2×2 행렬 `[[1, 1], [1, 0]]`을 n번 곱하면 얻을 수 있으므로, 행렬 거듭제곱으로 F(n)을 **곱셈 O(log n)번**에 구합니다. Day 71에서 재귀로 수십만 번 호출하던 문제입니다.

```rust
// 파일: matrix_fib.rs
type Mat = [[u64; 2]; 2];

fn mul(a: &Mat, b: &Mat, m: u64) -> Mat {
    let mut c = [[0u64; 2]; 2];
    for i in 0..2 {
        for j in 0..2 {
            for k in 0..2 {
                c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % m;
            }
        }
    }
    c
}

fn mat_pow(base: &Mat, n: u64, m: u64) -> Mat {
    if n == 0 {
        return [[1, 0], [0, 1]];                // 단위 행렬 = 곱셈의 1
    }
    let half = mat_pow(base, n / 2, m);
    let sq = mul(&half, &half, m);
    if n % 2 == 1 { mul(&sq, base, m) } else { sq }
}

fn fib(n: u64, m: u64) -> u64 {
    let q = [[1, 1], [1, 0]];
    mat_pow(&q, n, m)[0][1]                     // Q^n의 [0][1] 칸이 F(n)
}

fn main() {
    let m = 1_000_000_007;
    for n in [10, 50, 90] {
        println!("F({n}) = {}", fib(n, u64::MAX));
    }
    println!("F(10^18) mod 1e9+7 = {}", fib(1_000_000_000_000_000_000, m));
}
```

실행 결과:

```text
F(10) = 55
F(50) = 12586269025
F(90) = 2880067194370816120
F(10^18) mod 1e9+7 = 209783453
```

F(90)까지는 나머지를 구하지 않도록 m으로 `u64::MAX`를 넘겼습니다(F(90)은 u64 범위 안입니다). F(10¹⁸)은 약 60번의 행렬 제곱으로 계산됩니다.

## 10. 시간·공간 복잡도

| 알고리즘                  | 점화식                | 시간          | 추가 공간(재귀) |
| ------------------------- | --------------------- | ------------- | --------------- |
| 반복 곱셈 거듭제곱        | -                     | O(n) 곱셈     | O(1)            |
| 분할 정복 거듭제곱        | T(n) = T(n/2) + O(1)  | O(log n) 곱셈 | O(log n)        |
| 중복 재귀 거듭제곱(실수)  | T(n) = 2T(n/2) + O(1) | O(n) 곱셈     | O(log n)        |
| 최대 부분 배열(모든 구간) | -                     | O(n²)         | O(1)            |
| 최대 부분 배열(분할 정복) | T(n) = 2T(n/2) + O(n) | O(n log n)    | O(log n)        |
| 최대 부분 배열(카데인)    | -                     | O(n)          | O(1)            |
| 행렬 거듭제곱 피보나치    | T(n) = T(n/2) + O(1)  | O(log n)      | O(log n)        |

## 11. 세 언어 비교

| 관점             | C                                       | Python                     | Rust                              |
| ---------------- | --------------------------------------- | -------------------------- | --------------------------------- |
| 큰 거듭제곱      | `long long`은 2⁶²까지(부호 있는 64비트) | 크기 제한 없음             | `u64`, 필요하면 `u128`, 넘침 검사 |
| 모듈러 거듭제곱  | 직접 구현                               | 내장 `pow(x, n, m)`        | 직접 구현(표준 함수 없음)         |
| 구간 나누기      | 인덱스 `lo, mid, hi`                    | 인덱스 또는 슬라이싱(복사) | `split_at`(복사 없는 슬라이스)    |
| 여러 값 돌려주기 | 포인터 매개변수나 구조체                | 튜플                       | 튜플                              |
| 재귀 한도        | 호출 스택 크기                          | 기본 약 1,000              | 호출 스택 크기                    |

분할 정복은 재귀 깊이가 보통 log n이라 세 언어 모두 한도를 걱정할 일이 거의 없습니다. 깊이가 n이 되는 경우(나쁜 피벗의 퀵 정렬)가 예외입니다.

## 12. 자주 하는 실수

### 실수 1: 같은 부분 문제를 두 번 푼다

실습의 디버그 문제입니다. `power(x, n/2) * power(x, n/2)`는 결과가 맞아 실수를 알아채기 어렵지만, 호출이 두 갈래로 퍼져 곱셈이 O(n)번이 됩니다. **같은 인자로 두 번 부르고 있지 않은지** 확인하세요. 같은 부분 문제가 여러 번 나오는 문제는 Day 79의 동적 계획법으로 푸는 것이 알맞습니다.

### 실수 2: 결합 단계에서 경우를 빠뜨린다

최대 부분 배열에서 가운데를 걸치는 경우를 계산하지 않으면 `[4, -1, 2, 1]` 같은 답을 놓칩니다. 분할 정복을 설계할 때는 "답이 될 수 있는 경우가 **모두** 어느 한쪽에서 계산되는가"를 확인해야 합니다.

### 실수 3: 멈춤 조건이 줄어드는 방향과 맞지 않는다

```python
# 파일: wrong_base.py (실행 오류: RecursionError)
def power(x, n):
    if n == 1:                       # n = 0이 들어오면?
        return x
    half = power(x, n // 2)
    return half * half * (x if n % 2 else 1)


print(power(2, 8))
print(power(2, 0))
```

```text
RecursionError: maximum recursion depth exceeded
```

첫 줄의 `power(2, 8)`은 8 → 4 → 2 → 1에서 멈춰 256을 출력하지만, `power(2, 0)`은 0 // 2 = 0이라 **영원히 0을 부릅니다.** 멈춤 조건은 입력이 줄어들다 **반드시 도착하는 값**에 두세요. 여기서는 `n == 0`입니다.

### 실수 4: 나머지를 곱셈 뒤에 한 번만 구한다

C와 Rust에서 `power_dc(x, n) % m`처럼 마지막에만 나머지를 구하면 그 전에 이미 수가 넘칩니다. 모듈러 거듭제곱은 **곱할 때마다** 나머지를 구해야 합니다(4.2절).

### 실수 5: 분할 정복이 항상 가장 빠르다고 생각한다

9절처럼 같은 문제에 O(n) 방법이 있을 수 있습니다. 분할 정복은 **떠올리기 쉬운 설계 도구**이고, 정답을 먼저 만든 뒤 더 나은 방법을 찾는 출발점이 되기도 합니다.

## 13. Q&A

**Q. 분할 정복과 재귀는 같은 것인가요?**

A. 분할 정복은 **설계 방법**이고, 재귀는 그것을 코드로 옮기는 흔한 **수단**입니다. 분할 정복을 반복문으로 구현할 수도 있고(Day 74의 상향식 병합 정렬), 재귀를 쓰지만 분할 정복이 아닌 코드도 있습니다(한 칸씩 줄이는 재귀).

**Q. 행렬 곱셈이나 큰 수 곱셈도 분할 정복으로 빨라지나요?**

A. 네. n자리 수 두 개를 곱하는 학교 방식은 O(n²)이지만, **카라추바 알고리즘**은 곱셈을 세 번의 절반 크기 곱셈으로 바꿔 약 O(n^1.58)입니다. Python이 큰 정수를 곱할 때 실제로 이 방법을 씁니다. 행렬 곱셈의 **슈트라센 알고리즘**도 같은 아이디어입니다.

**Q. 모듈러 거듭제곱은 어디에 쓰이나요?**

A. 인터넷 보안에 쓰이는 RSA 암호는 수백 자리 수의 거듭제곱 나머지를 계산합니다. 분할 정복이 없다면 현실적인 시간 안에 계산할 수 없습니다. 해시 함수, 난수 생성, 프로그래밍 대회 문제에도 자주 나옵니다.

**Q. 점화식을 풀지 못하면 복잡도를 어떻게 알 수 있나요?**

A. 재귀 트리를 그리고 층마다 일의 양을 적어 보세요. 층마다 일이 같으면 (층 수 × 한 층의 일), 아래로 갈수록 줄어들면 맨 위 층이, 늘어나면 맨 아래 층(잎의 수)이 전체를 좌우합니다. 호출 횟수와 연산 횟수를 **직접 세는 프로그램**(오늘의 모든 예제)으로 확인하는 것도 좋은 방법입니다.

## 14. 핵심 요약

- 분할 정복은 **나누기 → 작은 문제를 재귀로 풀기 → 결과 결합**의 세 단계이며, 충분히 작은 문제는 직접 풉니다.
- 알고리즘의 속도는 **작은 문제의 개수, 크기, 결합 비용**으로 정해집니다. 점화식과 재귀 트리로 가늠합니다.
- **거듭제곱**은 x^(n/2)를 한 번만 구해 제곱하면 곱셈 O(log n)번입니다. 곱할 때마다 나머지를 구하면 거대한 거듭제곱의 나머지도 구할 수 있습니다.
- **최대 연속 부분 배열 합**은 왼쪽 안, 오른쪽 안, 가운데 걸침의 세 경우로 나눠 O(n log n)에 풉니다.
- 같은 부분 문제를 두 번 풀면 느려집니다. 결합 단계에서 경우를 빠뜨리면 틀립니다.
- 분할 정복이 항상 최선은 아닙니다. 카데인 알고리즘은 같은 문제를 O(n)에 풉니다.

## 15. 도전 문제

1. **(C)** 거듭제곱을 재귀 없이 반복문으로 구현해 보세요. n을 이진수로 보고, 오른쪽 자리부터 1인 자리마다 결과에 현재의 x를 곱하고 x는 매번 제곱합니다.
2. **(Python)** 정렬된 배열에서 **회전된 위치**(가장 작은 원소의 인덱스)를 분할 정복으로 O(log n)에 찾으세요. `[40, 50, 60, 10, 20, 30]`이면 3입니다.
3. **(Rust)** 평면 위의 점 n개 중 **가장 가까운 두 점**의 거리를 구하는 분할 정복 알고리즘을 찾아 공부하고, 모든 쌍을 비교하는 O(n²) 방법과 결과를 비교해 보세요.
4. **(세 언어)** 카데인 알고리즘을 세 언어로 구현하고, 최대 합을 만드는 구간의 시작과 끝 인덱스도 함께 구하세요.
