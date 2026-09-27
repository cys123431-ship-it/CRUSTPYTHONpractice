---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-72-binary-search
courseId: crp-92
phaseId: phase-07
dayNumber: 72
date: "2026-12-11"
title: 이진 탐색 — 정렬된 배열에서 절반씩 버리기
summary: 정렬된 배열에서 가운데 값과 비교해 후보를 절반씩 버리는 이진 탐색을 닫힌 구간과 반열린 구간 두 방식으로 구현하고, 반복문 불변식으로 경계 실수를 막는 법을 익힙니다. 같은 값이 여러 개일 때 첫 위치를 찾는 lower bound, C bsearch·Python bisect·Rust binary_search와 partition_point, 그리고 답의 범위를 이진 탐색하는 정수 제곱근까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-71-complexity]
learningObjectives:
  - 이진 탐색이 정렬된 배열에서만 올바른 이유와 O(log n)인 이유를 설명한다.
  - 닫힌 구간 [lo, hi]와 반열린 구간 [lo, hi)의 반복 조건과 경계 갱신을 구별해 구현한다.
  - lower bound와 upper bound로 같은 값의 첫 위치, 끝 위치, 개수를 구한다.
  - mid 계산의 넘침과 무한 반복 같은 대표적인 경계 실수를 찾아 고친다.
  - 세 언어의 표준 이진 탐색 도구를 쓰고, 정수 제곱근처럼 답의 범위를 이진 탐색한다.
concepts:
  [
    binary search,
    sorted array,
    invariant,
    closed interval,
    half-open interval,
    lower bound,
    upper bound,
    bisect,
    partition_point,
    search on answer,
  ]
runnerMode: python
playgroundSource: |
  # 파일: binary_search.py — target을 바꿔 가며 lo, hi가 움직이는 모습을 보세요.
  a = [3, 8, 15, 23, 42, 57, 61, 88]
  target = 57
  lo, hi = 0, len(a) - 1
  while lo <= hi:
      mid = (lo + hi) // 2
      print(f"lo={lo} hi={hi} mid={mid} a[mid]={a[mid]}")
      if a[mid] == target:
          print("찾음:", mid)
          break
      if a[mid] < target:
          lo = mid + 1
      else:
          hi = mid - 1
  else:
      print("없음")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day72-predict-py
    title: mid가 가리키는 값 추적하기
    kind: predict
    objective: lo, hi가 좁혀지는 순서대로 mid를 계산한다.
    prompt: 출력될 값들(mid 위치의 값)을 공백으로 구분해 적으세요.
    starter: |-
      a = [2, 4, 7, 10, 13, 16, 20, 25]
      target = 16
      lo, hi = 0, len(a) - 1
      seen = []
      while lo <= hi:
          mid = (lo + hi) // 2
          seen.append(a[mid])
          if a[mid] == target:
              break
          if a[mid] < target:
              lo = mid + 1
          else:
              hi = mid - 1
      print(*seen)
    answer: "10 16"
    hint: "처음 mid = (0 + 7) // 2 = 3이라 a[3] = 10입니다. 10 < 16이므로 lo = 4가 되고, 다음 mid = (4 + 7) // 2 = 5입니다."
    explanation: "10을 보고 왼쪽 절반(인덱스 0~3)을 버린 뒤, 인덱스 5에서 16을 찾았습니다. 원소 8개에서 비교 2번이면 충분했습니다."
    commonMistakes:
      - "mid를 (0 + 7) / 2 = 3.5로 계산함(정수 나눗셈 //)"
      - "10 < 16일 때 hi를 줄여 반대쪽으로 감"
    language: python
    verification: run
  - id: ex-day72-predict-c
    title: lower bound의 결과 예측하기
    kind: predict
    objective: 같은 값이 여러 개일 때 lower bound가 첫 위치를 준다는 것을 확인한다.
    prompt: 출력될 세 숫자를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int lower_bound(const int a[], int n, int target) {
          int lo = 0, hi = n;
          while (lo < hi) {
              int mid = lo + (hi - lo) / 2;
              if (a[mid] < target) lo = mid + 1;
              else hi = mid;
          }
          return lo;
      }

      int main(void) {
          int a[] = {1, 3, 3, 3, 5, 8};
          printf("%d %d %d\n", lower_bound(a, 6, 3), lower_bound(a, 6, 4), lower_bound(a, 6, 0));
          return 0;
      }
    answer: "1 4 0"
    hint: "lower_bound(x)는 'x 이상인 첫 원소의 위치'입니다. 4 이상인 첫 원소는 5입니다."
    explanation: "3 이상인 첫 위치는 첫 3이 있는 1입니다. 4는 배열에 없지만 4 이상인 첫 원소 5가 인덱스 4에 있으므로 4이고, 이것은 '4를 넣어도 정렬이 유지되는 자리'이기도 합니다. 0은 모든 원소보다 작아서 0입니다."
    commonMistakes:
      - "lower_bound(3)으로 마지막 3의 위치 3을 적음"
      - "없는 값이면 -1이 나온다고 생각함"
    language: c
    verification: run
  - id: ex-day72-fill
    title: Rust에서 넘치지 않는 mid 채우기
    kind: fill
    objective: lo + (hi - lo) / 2로 mid를 계산하는 이유를 이해하고 쓴다.
    prompt: "빈칸에 lo와 hi의 가운데를 넘침 없이 계산하는 식을 채우세요. 두 값은 모두 u32이고 u32 최댓값 근처입니다."
    starter: |-
      fn middle(lo: u32, hi: u32) -> u32 {
          _____
      }

      fn main() {
          let lo = 4_000_000_000u32;
          let hi = 4_000_000_010u32;
          println!("{} {}", middle(lo, hi), middle(0, 9));
      }
    answer: |-
      fn middle(lo: u32, hi: u32) -> u32 {
          lo + (hi - lo) / 2
      }

      fn main() {
          let lo = 4_000_000_000u32;
          let hi = 4_000_000_010u32;
          println!("{} {}", middle(lo, hi), middle(0, 9));
      }
    output: "4000000005 4"
    hint: "(lo + hi) / 2는 lo + hi를 먼저 계산하는데, 40억 + 40억은 u32의 최댓값(약 43억)을 넘습니다. 차이의 절반을 lo에 더하세요."
    explanation: "hi - lo = 10이라 넘칠 일이 없고, lo + 5 = 4000000005입니다. (lo + hi) / 2로 쓰면 디버그 빌드에서 덧셈 넘침으로 panic합니다. C와 Java에서는 이 버그가 오랫동안 표준 라이브러리에 숨어 있었던 것으로 유명합니다."
    commonMistakes:
      - "(lo + hi) / 2로 써서 큰 값에서 넘침 panic을 일으킴"
      - "(hi - lo) / 2만 쓰고 lo를 더하지 않아 절대 위치가 아닌 거리를 돌려줌"
    language: rust
    verification: run
  - id: ex-day72-modify
    title: Python 이진 탐색을 첫 위치 찾기로 바꾸기
    kind: modify
    objective: 같은 값을 찾아도 멈추지 않고 왼쪽을 계속 탐색해 첫 위치를 찾는다.
    prompt: "find_first(a, target)는 지금 아무 42나 찾습니다. 같은 값이 여러 개일 때 가장 왼쪽 위치를, 없으면 -1을 돌려주도록 고치세요."
    starter: |-
      def find_first(a, target):
          lo, hi = 0, len(a) - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              if a[mid] == target:
                  return mid
              if a[mid] < target:
                  lo = mid + 1
              else:
                  hi = mid - 1
          return -1


      a = [5, 42, 42, 42, 42, 42, 90]
      print(find_first(a, 42), find_first(a, 7))
    answer: |-
      def find_first(a, target):
          lo, hi = 0, len(a) - 1
          answer = -1
          while lo <= hi:
              mid = (lo + hi) // 2
              if a[mid] == target:
                  answer = mid
                  hi = mid - 1
              elif a[mid] < target:
                  lo = mid + 1
              else:
                  hi = mid - 1
          return answer


      a = [5, 42, 42, 42, 42, 42, 90]
      print(find_first(a, 42), find_first(a, 7))
    output: "1 -1"
    hint: "찾았을 때 바로 돌려주지 말고 후보로 기록한 뒤, 더 왼쪽에 같은 값이 있는지 hi = mid - 1로 계속 찾아보세요."
    explanation: "원래 코드는 가운데의 42(인덱스 3)를 찾자마자 돌려줍니다. 고친 코드는 3을 기록하고 왼쪽 절반을 계속 탐색해 인덱스 1을 찾습니다. 전체 비교는 여전히 O(log n)입니다. 같은 일을 lower bound로 한 뒤 그 위치의 값이 target인지 확인해도 됩니다."
    commonMistakes:
      - "찾은 뒤 mid에서 왼쪽으로 한 칸씩 이동해 같은 값이 많을 때 O(n)이 됨"
      - "hi = mid로 써서 lo <= hi 조건에서 무한 반복에 빠짐"
    language: python
    verification: run
  - id: ex-day72-debug
    title: C 반열린 구간 이진 탐색의 무한 반복 고치기
    kind: debug
    objective: 반열린 구간에서 lo = mid로 갱신하면 구간이 줄지 않을 수 있다는 것을 확인한다.
    prompt: "이 lower_bound는 lo = mid 때문에 구간이 줄지 않는 경우가 있어 무한 반복에 빠집니다(안전장치 guard가 100번에서 멈춥니다). 올바르게 고쳐 3을 출력하세요."
    starter: |-
      #include <stdio.h>

      int lower_bound(const int a[], int n, int target) {
          int lo = 0, hi = n, guard = 0;
          while (lo < hi) {
              if (++guard > 100) {
                  printf("무한 반복! lo=%d hi=%d\n", lo, hi);
                  return -1;
              }
              int mid = lo + (hi - lo) / 2;
              if (a[mid] < target) lo = mid;
              else hi = mid;
          }
          return lo;
      }

      int main(void) {
          int a[] = {1, 2, 4, 6, 9};
          printf("%d\n", lower_bound(a, 5, 5));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int lower_bound(const int a[], int n, int target) {
          int lo = 0, hi = n, guard = 0;
          while (lo < hi) {
              if (++guard > 100) {
                  printf("무한 반복! lo=%d hi=%d\n", lo, hi);
                  return -1;
              }
              int mid = lo + (hi - lo) / 2;
              if (a[mid] < target) lo = mid + 1;
              else hi = mid;
          }
          return lo;
      }

      int main(void) {
          int a[] = {1, 2, 4, 6, 9};
          printf("%d\n", lower_bound(a, 5, 5));
          return 0;
      }
    output: "3"
    starterOutput: |-
      무한 반복! lo=2 hi=3
      -1
    hint: "lo = 2, hi = 3이면 mid = 2입니다. a[2] = 4 < 5라서 lo = mid = 2가 되어 아무것도 바뀌지 않습니다. a[mid]가 target보다 작으면 mid는 답이 될 수 없습니다."
    explanation: "a[mid] < target이면 mid는 확실히 답이 아니므로 lo = mid + 1로 버려야 합니다. 그래야 매 반복마다 구간 [lo, hi)가 적어도 1씩 줄어 반복이 끝납니다. 이진 탐색을 짤 때는 '매 반복마다 구간이 반드시 줄어드는가?'를 확인하세요."
    commonMistakes:
      - "mid를 (lo + hi + 1) / 2로 바꿔 다른 경우에 또 무한 반복이 생김"
      - "반복 조건을 lo <= hi로 바꿔 hi = n일 때 a[n]을 읽음"
    language: c
    verification: run
  - id: ex-day72-independent
    title: Rust partition_point로 범위 안의 개수 세기
    kind: independent
    objective: 조건을 만족하는 앞부분의 길이를 이진 탐색으로 구한다.
    prompt: "정렬된 점수에서 lo 이상 hi 미만인 점수의 개수를 fn count_in_range(scores: &[i32], lo: i32, hi: i32) -> usize로 구하세요. partition_point를 두 번 쓰면 됩니다. 60 이상 80 미만은 4개, 90 이상 101 미만은 2개, 0 이상 50 미만은 0개입니다."
    starter: |-
      fn main() {
          let scores = [52, 60, 64, 71, 79, 80, 88, 93, 100];
          println!("{}", scores.len());
      }
    answer: |-
      fn count_in_range(scores: &[i32], lo: i32, hi: i32) -> usize {
          let start = scores.partition_point(|&s| s < lo);
          let end = scores.partition_point(|&s| s < hi);
          end - start
      }

      fn main() {
          let scores = [52, 60, 64, 71, 79, 80, 88, 93, 100];
          println!(
              "{} {} {}",
              count_in_range(&scores, 60, 80),
              count_in_range(&scores, 90, 101),
              count_in_range(&scores, 0, 50)
          );
      }
    output: "4 2 0"
    hint: "partition_point(조건)은 정렬된 슬라이스에서 조건이 참인 앞부분이 끝나는 위치를 돌려줍니다. 's < lo'가 참인 부분의 끝이 lo 이상인 첫 위치입니다."
    explanation: "60 이상인 첫 위치는 1, 80 이상인 첫 위치는 5이므로 5 - 1 = 4개(60, 64, 71, 79)입니다. 두 번의 이진 탐색이라 O(log n)이며, 범위 안의 원소를 하나씩 세지 않습니다. 조건은 앞부분에서 참, 뒷부분에서 거짓이어야 올바르게 동작합니다."
    commonMistakes:
      - "partition_point(|&s| s <= hi)로 써서 hi 점수까지 포함함"
      - "정렬하지 않은 배열에 써서 의미 없는 위치를 얻음"
    language: rust
    verification: run
quiz:
  - id: quiz-day72-01
    question: 이진 탐색을 쓰기 위한 필수 조건은?
    choices:
      - 배열의 원소가 모두 달라야 한다
      - 배열이 정렬되어 있어야 한다
      - 배열의 길이가 2의 거듭제곱이어야 한다
      - 배열이 연결 리스트여야 한다
    answerIndex: 1
    explanation: 가운데 값과 비교해 한쪽을 버리려면 '왼쪽은 모두 작고 오른쪽은 모두 크다'는 보장이 필요합니다. 정렬되지 않았다면 버린 쪽에 답이 있을 수 있습니다. 연결 리스트는 가운데로 바로 갈 수 없어 이진 탐색의 이점이 사라집니다.
  - id: quiz-day72-02
    question: 원소가 1,000개인 정렬된 배열에서 이진 탐색의 최대 비교 횟수는 대략?
    choices: ["10번", "100번", "500번", "1,000번"]
    answerIndex: 0
    explanation: 2^10 = 1,024이므로 절반씩 10번 줄이면 후보가 하나 남습니다. log₂ 1000 ≈ 10입니다.
  - id: quiz-day72-03
    question: 반열린 구간 [lo, hi)로 이진 탐색할 때 반복 조건과 초기 hi로 알맞은 것은?
    choices:
      - "while lo <= hi, hi = n - 1"
      - "while lo < hi, hi = n"
      - "while lo < hi, hi = n - 1"
      - "while lo <= hi, hi = n"
    answerIndex: 1
    explanation: hi는 '후보 범위의 끝 다음'이라 처음에 n이고, lo == hi면 후보가 없으므로 lo < hi 동안 반복합니다. 닫힌 구간 [lo, hi]라면 hi = n - 1, lo <= hi입니다. 두 방식을 섞으면 경계 버그가 생깁니다.
  - id: quiz-day72-04
    question: "Rust에서 [10, 20, 30].binary_search(&25)의 결과는?"
    choices: ["Some(2)", "Err(2)", "Ok(2)", "None"]
    answerIndex: 1
    explanation: 찾지 못하면 Err(넣을 위치)를 돌려줍니다. 25를 인덱스 2에 넣으면 [10, 20, 25, 30]으로 정렬이 유지됩니다. 찾으면 Ok(위치)입니다.
  - id: quiz-day72-05
    question: "Python에서 bisect.bisect_right(a, x) - bisect.bisect_left(a, x)가 뜻하는 것은?"
    choices:
      - x의 인덱스
      - 정렬된 a에 들어 있는 x의 개수
      - a의 길이
      - x보다 작은 원소의 개수
    answerIndex: 1
    explanation: bisect_left는 x의 첫 위치(x 이상인 첫 위치), bisect_right는 x보다 큰 첫 위치입니다. 둘의 차이가 x가 차지하는 칸 수, 즉 개수입니다. x가 없으면 두 값이 같아 0입니다.
---

## 1. 오늘 배울 내용

Day 71에서 O(log n)이 얼마나 강력한지 보았습니다. 오늘은 그 대표 알고리즘인 **이진 탐색(binary search)** 을 제대로 구현합니다. 원리는 간단하지만 **경계를 한 칸 틀리는 버그**가 아주 흔해서, 프로그래머들이 가장 많이 실수하는 알고리즘 중 하나로 꼽힙니다. 그래서 오늘은 "왜 이 조건인가"를 **불변식**으로 따져 가며 짭니다.

1. 이진 탐색의 원리와 정렬이 꼭 필요한 이유.
2. **닫힌 구간** `[lo, hi]`와 **반열린 구간** `[lo, hi)` 두 가지 구현과 각각의 불변식.
3. 같은 값이 여러 개일 때 **첫 위치**를 찾는 **lower bound**와 **upper bound**.
4. 대표적인 실수: mid의 **넘침**, **무한 반복**, 한 칸 어긋남.
5. **C** `bsearch`, **Python** `bisect`, **Rust** `binary_search`·`partition_point`.
6. 응용: 배열이 아니라 **답의 범위**를 이진 탐색하는 정수 제곱근.

## 2. 왜 이진 탐색인가

사전에서 "이진"이라는 단어를 찾을 때 첫 쪽부터 넘기지 않습니다. 대충 가운데를 펼쳐 "ㅇ"보다 앞인지 뒤인지 보고, 반대쪽은 **보지도 않고 버립니다.** 사전이 **가나다순으로 정렬**되어 있기 때문에 가능한 일입니다.

| 방법      | 원소 1,000개 | 원소 100만 개 | 조건            |
| --------- | -----------: | ------------: | --------------- |
| 선형 탐색 | 최대 1,000번 | 최대 100만 번 | 없음            |
| 이진 탐색 |    최대 10번 |     최대 20번 | **정렬된 배열** |

단, 이진 탐색은 **정렬**이라는 조건이 필요합니다. 한 번만 찾는다면 정렬(O(n log n))하는 비용이 선형 탐색(O(n))보다 크므로 손해입니다. 한 번 정렬해 두고 **여러 번 찾을 때** 이진 탐색이 빛납니다. 또 가운데 원소로 **바로 가야** 하므로 배열처럼 인덱스로 접근할 수 있는 자료구조에서만 씁니다. 연결 리스트에서는 가운데로 가는 데만 O(n)이 걸립니다.

## 3. 그림으로 이해하기

정렬된 배열에서 57을 찾아봅시다.

```text
인덱스:    0    1    2    3    4    5    6    7    8    9
값:      [ 3 |  8 | 15 | 23 | 42 | 42 | 42 | 57 | 61 | 88 ]

① lo=0, hi=9, mid=4: a[4]=42 < 57 → 왼쪽 절반(0~4)을 버린다
         ░░░░░░░░░░░░░░░░░░░░░░░░ [42 | 42 | 57 | 61 | 88 ]
② lo=5, hi=9, mid=7: a[7]=57 = 57 → 찾았다!
```

비교 두 번으로 찾았습니다. 한 번 비교할 때마다 **남은 후보가 절반**이 되므로, 후보가 n개면 최대 log₂ n번 정도면 하나로 줄어듭니다.

## 4. 천천히 풀어보기

### 4.1 닫힌 구간 [lo, hi]: 불변식으로 짜기

"후보"를 lo부터 hi까지(양 끝 포함)라고 약속합니다. 이 약속이 **불변식**입니다.

> **불변식**: target이 배열에 있다면, 그 위치는 반드시 [lo, hi] 안에 있다.

이 약속을 지키도록 모든 줄을 결정합니다.

| 코드                                 | 이유                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `lo = 0, hi = n - 1`                 | 처음에는 배열 전체가 후보. hi는 **마지막 원소의 인덱스**                         |
| `while lo <= hi`                     | lo == hi면 후보가 **하나 남은 것**이라 확인해야 한다. lo > hi가 되면 후보가 없다 |
| `a[mid] < target`이면 `lo = mid + 1` | mid와 그 왼쪽은 모두 target보다 작으므로 답이 아니다. mid도 **확인했으니** 제외  |
| `a[mid] > target`이면 `hi = mid - 1` | mid와 그 오른쪽은 모두 크므로 제외                                               |
| 반복이 끝나면 없음                   | 후보가 하나도 남지 않았다                                                        |

### 4.2 반열린 구간 [lo, hi): 끝을 "다음 칸"으로

이번에는 후보가 lo부터 hi **직전까지**라고 약속합니다. 파이썬의 `range(lo, hi)`, 러스트의 `lo..hi`와 같은 방식입니다.

| 코드                                 | 이유                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `lo = 0, hi = n`                     | hi는 **마지막 원소의 다음 칸**                               |
| `while lo < hi`                      | lo == hi면 후보가 없다(빈 구간)                              |
| `a[mid] < target`이면 `lo = mid + 1` | mid는 답이 아니니 제외                                       |
| `a[mid] > target`이면 `hi = mid`     | hi는 원래 "제외되는 칸"이므로 mid를 hi로 두면 mid가 제외된다 |

두 방식 모두 맞습니다. 중요한 것은 **한 방식을 골라 끝까지 일관되게** 쓰는 것입니다. `hi = n`으로 시작해 놓고 `while lo <= hi`를 쓰면 `a[n]`을 읽어 배열 밖에 접근하고, `hi = n - 1`로 시작해 놓고 `while lo < hi`를 쓰면 마지막 원소를 확인하지 못합니다.

> **TIP**: 반열린 구간은 "길이 = hi - lo"로 계산이 깔끔하고, 빈 구간을 lo == hi로 자연스럽게 표현합니다. 러스트 표준 라이브러리와 C++의 `lower_bound`가 이 방식입니다.

### 4.3 lower bound: 같은 값의 첫 위치

배열에 42가 세 개 있다면 보통의 이진 탐색은 **아무 42**나 찾습니다(3절에서는 인덱스 4를 먼저 봤지만 경우에 따라 5나 6일 수도 있습니다). 첫 42의 위치가 필요할 때는 **lower bound**를 씁니다.

> **lower bound(x)** = x **이상**인 첫 원소의 위치. x가 없으면 "x를 넣어도 정렬이 유지되는 자리".
> **upper bound(x)** = x **보다 큰** 첫 원소의 위치.

```text
인덱스:    0    1    2    3    4    5    6    7    8    9
값:      [ 3 |  8 | 15 | 23 | 42 | 42 | 42 | 57 | 61 | 88 ]
                               ↑              ↑
                     lower_bound(42)=4   upper_bound(42)=7
                     42의 개수 = 7 - 4 = 3
```

lower bound는 **찾아도 멈추지 않습니다.** `a[mid] >= target`이면 mid가 답일 **수도** 있으니 버리지 않고 `hi = mid`로 남긴 채 왼쪽을 계속 봅니다. 반복이 끝나 lo == hi가 되는 곳이 경계입니다. 이 방법은 "조건이 거짓 … 거짓, 참 … 참"으로 바뀌는 **경계**를 찾는 일반적인 방법이며, 7절의 `partition_point`가 바로 이것입니다.

### 4.4 mid 계산: `(lo + hi) / 2`의 함정

`(lo + hi) / 2`는 lo와 hi가 아주 크면 **덧셈이 먼저 넘칩니다.** 인덱스가 수십억이 되는 큰 배열이나 부호 없는 정수에서 실제로 일어나는 버그이며, 자바 표준 라이브러리에 수년간 숨어 있던 것으로 유명합니다. `lo + (hi - lo) / 2`는 차이의 절반을 더하므로 넘치지 않습니다. Python 정수는 넘치지 않으므로 `(lo + hi) // 2`로 써도 됩니다.

### 4.5 반복이 반드시 끝나는가

이진 탐색을 짤 때 마지막으로 확인할 것은 **매 반복마다 후보 구간이 반드시 줄어드는가**입니다. 반열린 구간에서 `lo = mid`로 갱신하면, lo = 2, hi = 3일 때 mid = 2라서 lo가 그대로 2가 됩니다. 구간이 줄지 않으니 **무한 반복**입니다(실습의 디버그 문제). `lo = mid + 1`처럼 **확인한 mid를 버리는** 쪽으로 갱신해야 합니다.

## 5. C로 구현하기

C 프로그램은 닫힌 구간 이진 탐색(비교 횟수 포함), 반열린 구간 lower bound, 그리고 표준 라이브러리의 `bsearch`를 차례로 씁니다.

```c
// 파일: binary_search.c
#include <stdio.h>
#include <stdlib.h>

// 닫힌 구간 [lo, hi]에서 target의 위치를 찾는다. 없으면 -1
int binary_search(const int a[], int n, int target, int *steps) {
    int lo = 0, hi = n - 1;
    *steps = 0;
    while (lo <= hi) {                  // 후보가 하나라도 남아 있는 동안
        (*steps)++;
        int mid = lo + (hi - lo) / 2;   // (lo + hi) / 2 와 같지만 넘치지 않는다
        if (a[mid] == target) {
            return mid;
        } else if (a[mid] < target) {
            lo = mid + 1;               // 왼쪽 절반(mid 포함)을 버린다
        } else {
            hi = mid - 1;               // 오른쪽 절반(mid 포함)을 버린다
        }
    }
    return -1;
}

// 반열린 구간 [lo, hi)에서 target 이상인 첫 위치 (lower bound)
int lower_bound(const int a[], int n, int target) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid;                   // mid도 답일 수 있으니 남긴다
        }
    }
    return lo;                          // lo == hi
}

int compare_int(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    return (a > b) - (a < b);           // 음수, 0, 양수
}

int main(void) {
    int a[] = {3, 8, 15, 23, 42, 42, 42, 57, 61, 88};
    int n = sizeof a / sizeof a[0];

    int targets[] = {23, 88, 3, 50};
    for (int i = 0; i < 4; i++) {
        int steps;
        int pos = binary_search(a, n, targets[i], &steps);
        printf("search(%2d) -> 인덱스 %2d, 비교 %d번\n", targets[i], pos, steps);
    }

    printf("lower_bound(42) = %d (첫 42의 위치)\n", lower_bound(a, n, 42));
    printf("lower_bound(43) = %d (42보다 큰 첫 값 57의 위치)\n", lower_bound(a, n, 43));
    printf("lower_bound(99) = %d (모두 작으면 n)\n", lower_bound(a, n, 99));
    printf("42의 개수 = %d\n", lower_bound(a, n, 43) - lower_bound(a, n, 42));

    int key = 57;
    int *found = bsearch(&key, a, n, sizeof a[0], compare_int);
    printf("표준 bsearch(57) -> %s, 인덱스 %d\n",
           found ? "찾음" : "없음", found ? (int)(found - a) : -1);
    return 0;
}
```

실행 결과:

```text
search(23) -> 인덱스  3, 비교 4번
search(88) -> 인덱스  9, 비교 4번
search( 3) -> 인덱스  0, 비교 3번
search(50) -> 인덱스 -1, 비교 4번
lower_bound(42) = 4 (첫 42의 위치)
lower_bound(43) = 7 (42보다 큰 첫 값 57의 위치)
lower_bound(99) = 10 (모두 작으면 n)
42의 개수 = 3
표준 bsearch(57) -> 찾음, 인덱스 7
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int lo = 0, hi = n - 1; while (lo <= hi)`      | 4.1절의 닫힌 구간입니다. 원소 10개 배열에서 없는 값 50을 찾아도 비교 4번이면 끝납니다(log₂ 10 ≈ 3.3을 올림).                                                                           |
| `int mid = lo + (hi - lo) / 2;`                 | 4.4절의 넘치지 않는 가운데 계산입니다.                                                                                                                                                 |
| `lo = mid + 1;` / `hi = mid - 1;`               | 확인한 mid를 후보에서 **제외**합니다. 이 ±1이 빠지면 무한 반복이 생길 수 있습니다.                                                                                                     |
| `int lo = 0, hi = n; while (lo < hi)`           | lower bound는 4.2절의 반열린 구간으로 짰습니다. 결과가 n(= 10)일 수 있다는 점에 주의하세요. "모든 원소가 target보다 작다"는 뜻이며, 이 값을 인덱스로 쓰면 배열 밖입니다.               |
| `else { hi = mid; }`                            | a[mid] ≥ target이면 mid가 답일 수 있으므로 **남깁니다.** 반열린 구간에서 hi = mid는 "mid 앞까지"라는 뜻이라 mid는 다음 반복의 후보에서 빠지지만, 반복이 끝난 뒤 lo가 그 자리에 옵니다. |
| `return (a > b) - (a < b);`                     | `bsearch`와 `qsort`의 비교 함수는 음수, 0, 양수를 돌려줘야 합니다. `a - b`로 쓰면 큰 수끼리 뺄 때 넘칠 수 있어서 비교 결과 두 개를 빼는 관용구를 씁니다.                               |
| `bsearch(&key, a, n, sizeof a[0], compare_int)` | `<stdlib.h>`의 표준 이진 탐색입니다. 어떤 타입이든 다룰 수 있도록 `void *`로 주고받고, 찾으면 원소의 **주소**, 없으면 NULL을 돌려줍니다.                                               |
| `(int)(found - a)`                              | 같은 배열 안의 두 포인터를 빼면 **원소 몇 개만큼 떨어져 있는지**가 나옵니다(Day 30). 주소를 인덱스로 바꾸는 방법입니다.                                                                |

> **참고**: C 표준은 `bsearch`가 같은 값이 여러 개일 때 **어느 것을** 돌려줄지 정하지 않았습니다. 첫 위치가 필요하면 직접 lower bound를 짜야 합니다.

## 6. Python으로 구현하기

Python 버전은 거쳐 간 mid의 값을 모아 탐색 경로를 보여 주고, lower/upper bound를 직접 구현한 뒤 표준 모듈 `bisect`와 결과를 비교합니다. `bisect`로 점수를 등급으로 바꾸는 예도 봅니다.

```python
# 파일: binary_search.py
import bisect


def binary_search(a, target):
    """닫힌 구간 [lo, hi]. 찾은 위치와 거쳐 간 mid 목록을 돌려준다."""
    lo, hi = 0, len(a) - 1
    trace = []
    while lo <= hi:
        mid = (lo + hi) // 2            # Python 정수는 넘치지 않는다
        trace.append(a[mid])
        if a[mid] == target:
            return mid, trace
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, trace


def lower_bound(a, target):
    """target 이상인 첫 위치 (반열린 구간 [lo, hi))"""
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo


def upper_bound(a, target):
    """target보다 큰 첫 위치"""
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo


a = [3, 8, 15, 23, 42, 42, 42, 57, 61, 88]
for t in [23, 88, 3, 50]:
    pos, trace = binary_search(a, t)
    print(f"search({t:>2}) -> {pos:>2}, 본 값 {trace}")

print("lower/upper(42):", lower_bound(a, 42), upper_bound(a, 42),
      "→ 42는", upper_bound(a, 42) - lower_bound(a, 42), "개")
print("bisect_left/right(42):", bisect.bisect_left(a, 42), bisect.bisect_right(a, 42))

scores = [55, 62, 70, 78, 85, 91]
cutoffs = [60, 70, 80, 90]              # 등급 경계
grades = "FDCBA"
for s in [59, 60, 77, 90, 100]:
    print(f"{s}점 → {grades[bisect.bisect_right(cutoffs, s)]}", end="  ")
print()

bisect.insort(scores, 80)               # 정렬 순서를 지키며 넣기
print("insort(80):", scores)
```

실행 결과:

```text
search(23) ->  3, 본 값 [42, 8, 15, 23]
search(88) ->  9, 본 값 [42, 57, 61, 88]
search( 3) ->  0, 본 값 [42, 8, 3]
search(50) -> -1, 본 값 [42, 57, 42, 42]
lower/upper(42): 4 7 → 42는 3 개
bisect_left/right(42): 4 7
59점 → F  60점 → D  77점 → C  90점 → A  100점 → A
insort(80): [55, 62, 70, 78, 80, 85, 91]
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trace.append(a[mid])`                      | 비교한 값을 기록해 탐색 경로를 보여 줍니다. 50을 찾을 때 42 → 57 → 42 → 42로 범위가 좁혀진 뒤 후보가 사라졌습니다.                                                                          |
| `mid = (lo + hi) // 2`                      | Python 정수는 넘치지 않으므로 이렇게 써도 안전합니다.                                                                                                                                       |
| `if a[mid] <= target: lo = mid + 1` (upper) | lower bound와 **등호 하나**만 다릅니다. target과 같은 값도 "왼쪽"으로 보내므로 target보다 큰 첫 위치를 찾습니다.                                                                            |
| `bisect.bisect_left(a, 42)`                 | 표준 lower bound입니다. `bisect_right`(= `bisect`)가 upper bound입니다. 직접 짠 결과와 같습니다.                                                                                            |
| `grades[bisect.bisect_right(cutoffs, s)]`   | 경계 목록 `[60, 70, 80, 90]`에서 점수가 몇 개의 경계를 넘었는지 세면 등급 번호가 됩니다. 60점은 경계 60을 **넘은 것으로** 쳐야 하므로 `bisect_right`입니다. if 문 다섯 개 대신 한 줄입니다. |
| `bisect.insort(scores, 80)`                 | 정렬을 유지하며 넣을 자리를 이진 탐색으로 찾습니다. 다만 넣을 때 뒤의 원소를 밀기 때문에 전체는 O(n)입니다.                                                                                 |

## 7. Rust로 구현하기

Rust 버전은 `Ordering`으로 세 경우를 나누는 반열린 구간 이진 탐색을 직접 짜고, 표준 `binary_search`와 `partition_point`를 씁니다. 표준 `binary_search`는 없을 때 **넣을 위치**까지 알려 줍니다.

```rust
// 파일: binary_search.rs
use std::cmp::Ordering;

fn binary_search(a: &[i32], target: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0usize, a.len());   // 반열린 구간 [lo, hi)
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        match a[mid].cmp(&target) {
            Ordering::Equal => return Some(mid),
            Ordering::Less => lo = mid + 1,
            Ordering::Greater => hi = mid,
        }
    }
    None
}

fn main() {
    let a = [3, 8, 15, 23, 42, 42, 42, 57, 61, 88];
    for t in [23, 88, 3, 50] {
        println!("search({t:>2}) -> {:?}", binary_search(&a, t));
    }

    // 표준 binary_search: 찾으면 Ok(위치), 없으면 Err(넣을 위치)
    println!("std binary_search(57) = {:?}", a.binary_search(&57));
    println!("std binary_search(50) = {:?}", a.binary_search(&50));

    // partition_point: 조건이 참인 앞부분이 끝나는 위치
    let first = a.partition_point(|&x| x < 42);
    let after = a.partition_point(|&x| x <= 42);
    println!("42의 범위 = {first}..{after}, 개수 {}", after - first);

    let mut sorted = vec![10, 20, 30, 40];
    for x in [25, 5, 45, 30] {
        let pos = sorted.binary_search(&x).unwrap_or_else(|p| p);
        sorted.insert(pos, x);
    }
    println!("정렬을 지키며 넣기: {:?}", sorted);
}
```

실행 결과:

```text
search(23) -> Some(3)
search(88) -> Some(9)
search( 3) -> Some(0)
search(50) -> None
std binary_search(57) = Ok(7)
std binary_search(50) = Err(7)
42의 범위 = 4..7, 개수 3
정렬을 지키며 넣기: [5, 10, 20, 25, 30, 30, 40, 45]
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `let (mut lo, mut hi) = (0usize, a.len());`        | 반열린 구간 `[lo, hi)`입니다. `usize`라서 `hi = mid - 1` 같은 식은 mid가 0일 때 넘칩니다. 반열린 구간은 `hi = mid`만 쓰므로 이 문제가 없어 Rust에서 특히 편합니다. |
| `match a[mid].cmp(&target)`                        | 세 경우(작다, 같다, 크다)를 `Ordering`으로 빠짐없이 처리합니다.                                                                                                    |
| `a.binary_search(&57)` → `Ok(7)`                   | 찾으면 `Ok(위치)`, 없으면 `Err(넣을 위치)`를 돌려줍니다. `Result`를 "찾음/못 찾음"의 두 결과에 썼습니다. 50은 인덱스 7(57 앞)에 넣으면 되므로 `Err(7)`입니다.      |
| `a.partition_point(\|&x\| x < 42)`                 | 조건이 **앞부분에서 참, 뒷부분에서 거짓**일 때 그 경계를 이진 탐색으로 찾습니다. `x < 42`의 경계는 lower bound, `x <= 42`의 경계는 upper bound입니다.              |
| `sorted.binary_search(&x).unwrap_or_else(\|p\| p)` | 찾았든(`Ok(p)`) 못 찾았든(`Err(p)`) 위치 p를 꺼냅니다. 그 자리에 `insert`하면 정렬이 유지됩니다. 30은 이미 있어서 기존 30 옆에 들어갔습니다.                       |

> **참고**: Rust의 `binary_search`도 같은 값이 여러 개일 때 **어느 위치를** 돌려줄지 보장하지 않습니다. 첫 위치가 필요하면 `partition_point`를 쓰세요.

## 8. 실행 추적

C의 `lower_bound(a, 10, 42)`를 반열린 구간으로 따라갑니다. 배열은 `[3, 8, 15, 23, 42, 42, 42, 57, 61, 88]`입니다.

| 반복 |  lo |  hi | mid | a[mid] | 비교         | 갱신      | 남은 후보 [lo, hi) |
| ---: | --: | --: | --: | -----: | ------------ | --------- | ------------------ |
|    1 |   0 |  10 |   5 |     42 | 42 < 42 거짓 | hi = 5    | [0, 5)             |
|    2 |   0 |   5 |   2 |     15 | 15 < 42 참   | lo = 3    | [3, 5)             |
|    3 |   3 |   5 |   4 |     42 | 42 < 42 거짓 | hi = 4    | [3, 4)             |
|    4 |   3 |   4 |   3 |     23 | 23 < 42 참   | lo = 4    | [4, 4) 빈 구간     |
|   끝 |   4 |   4 |     |        |              | lo를 반환 | 답: 4              |

첫 반복에서 42(인덱스 5)를 만났지만 멈추지 않았습니다. 왼쪽에 더 앞선 42가 있을 수 있기 때문입니다. 매 반복마다 구간의 길이가 10 → 5 → 2 → 1 → 0으로 **반드시 줄어들었는지**도 확인하세요.

## 9. 다른 예제로 다시 이해하기

이진 탐색은 배열에서만 쓰는 것이 아닙니다. **"답이 될 수 있는 값의 범위"** 에서도 쓸 수 있습니다. 예를 들어 n의 정수 제곱근(x² ≤ n인 가장 큰 정수 x)을 구해 봅시다. 0부터 n까지의 x를 하나씩 시도하면 O(n)이지만, "x² ≤ n인가?"라는 조건은 x가 작을 때 참이다가 어느 순간부터 계속 거짓이 됩니다. 참과 거짓이 한 번만 바뀌므로, 이 **경계**를 이진 탐색으로 찾을 수 있습니다. 이런 방법을 **답에 대한 이진 탐색(매개변수 탐색)** 이라고 부르며, "최소 몇 개면 되는가", "최대 얼마까지 가능한가" 같은 문제에 널리 쓰입니다.

```python
# 파일: isqrt.py
import math


def isqrt(n):
    lo, hi = 0, n + 1                  # 답은 [lo, hi) 안에 있다. hi*hi > n
    steps = 0
    while hi - lo > 1:                 # 후보가 둘 이상이면 계속
        steps += 1
        mid = (lo + hi) // 2
        if mid * mid <= n:
            lo = mid                   # mid는 조건을 만족 → 답은 mid 이상
        else:
            hi = mid                   # mid는 너무 크다 → 답은 mid 미만
    return lo, steps


for n in [0, 1, 15, 16, 1_000_000, 10 ** 18 + 12345]:
    root, steps = isqrt(n)
    print(f"isqrt({n}) = {root} (반복 {steps}번), math.isqrt와 같음: {root == math.isqrt(n)}")
```

실행 결과:

```text
isqrt(0) = 0 (반복 0번), math.isqrt와 같음: True
isqrt(1) = 1 (반복 1번), math.isqrt와 같음: True
isqrt(15) = 3 (반복 4번), math.isqrt와 같음: True
isqrt(16) = 4 (반복 4번), math.isqrt와 같음: True
isqrt(1000000) = 1000 (반복 20번), math.isqrt와 같음: True
isqrt(1000000000000012345) = 1000000000 (반복 60번), math.isqrt와 같음: True
```

10¹⁸ 정도의 수도 60번이면 답을 찾습니다. 이 코드는 `lo = mid`를 쓰는데도 무한 반복하지 않습니다. 반복 조건이 `hi - lo > 1`이라서 mid가 항상 lo와 hi **사이**의 새 값이 되기 때문입니다. 경계 갱신 방식에 따라 반복 조건도 함께 맞춰야 한다는 좋은 예입니다.

Rust로 옮기면 `mid * mid`가 u64 범위를 넘을 수 있다는 점을 처리해야 합니다. Day 71의 `checked_mul`을 씁니다. 곱이 넘치면 당연히 n보다 크므로 "너무 크다"로 취급합니다.

```rust
// 파일: isqrt.rs
fn isqrt(n: u64) -> u64 {
    let (mut lo, mut hi) = (0u64, n.saturating_add(1).min(1 << 32));   // 답 < 2^32
    while hi - lo > 1 {
        let mid = lo + (hi - lo) / 2;
        match mid.checked_mul(mid) {
            Some(square) if square <= n => lo = mid,
            _ => hi = mid,                                              // 넘치거나 너무 큼
        }
    }
    lo
}

fn main() {
    for n in [0u64, 1, 15, 16, 1_000_000, u64::MAX] {
        println!("isqrt({n}) = {}", isqrt(n));
    }
}
```

실행 결과:

```text
isqrt(0) = 0
isqrt(1) = 1
isqrt(15) = 3
isqrt(16) = 4
isqrt(1000000) = 1000
isqrt(18446744073709551615) = 4294967295
```

`u64::MAX`의 제곱근은 2³² - 1 = 4,294,967,295입니다. `saturating_add(1)`은 넘칠 때 최댓값에서 멈추는 덧셈이고, 답이 2³²보다 작다는 것을 알기 때문에 hi를 그 이하로 제한해 반복 횟수도 줄였습니다.

## 10. 시간·공간 복잡도

| 연산                              | 시간                      | 공간               |
| --------------------------------- | ------------------------- | ------------------ |
| 이진 탐색(반복문)                 | O(log n)                  | O(1)               |
| 이진 탐색(재귀)                   | O(log n)                  | O(log n) 호출 스택 |
| lower bound / upper bound         | O(log n)                  | O(1)               |
| 같은 값의 개수                    | O(log n) (bound 두 번)    | O(1)               |
| 정렬 후 k번 검색                  | O(n log n + k log n)      | 정렬 방법에 따라   |
| `insort` / 정렬을 지키며 `insert` | O(log n) 찾기 + O(n) 밀기 | O(1)               |
| 답에 대한 이진 탐색(범위 크기 R)  | O(log R × 조건 확인 비용) | O(1)               |

## 11. 세 언어 비교

| 관점            | C                          | Python                            | Rust                                       |
| --------------- | -------------------------- | --------------------------------- | ------------------------------------------ |
| 표준 검색       | `bsearch` (주소 또는 NULL) | 없음(`bisect`로 위치를 구해 확인) | `binary_search` → `Ok(i)` / `Err(넣을 곳)` |
| lower bound     | 직접 구현                  | `bisect.bisect_left`              | `partition_point(\|x\| x < t)`             |
| upper bound     | 직접 구현                  | `bisect.bisect_right`             | `partition_point(\|x\| x <= t)`            |
| 정렬 유지 삽입  | 직접(찾고 `memmove`)       | `bisect.insort`                   | `binary_search` + `Vec::insert`            |
| mid 넘침        | `lo + (hi - lo) / 2` 필요  | 넘치지 않음                       | 디버그 빌드 panic, 같은 식으로 방지        |
| 인덱스 타입     | `int` (음수 -1로 "없음")   | `int`                             | `usize` → `hi = mid - 1`이 0에서 넘침 주의 |
| 같은 값 여러 개 | `bsearch`는 아무거나       | `bisect`는 경계를 정확히          | `binary_search`는 아무거나                 |

## 12. 자주 하는 실수

### 실수 1: 정렬되지 않은 배열에 이진 탐색을 쓴다

```python
# 파일: unsorted_search.py
import bisect

a = [30, 10, 50, 20, 40]            # 정렬되지 않음
i = bisect.bisect_left(a, 20)
print(i, a[i] == 20 if i < len(a) else False, 20 in a)
```

실행 결과:

```text
2 False True
```

20이 분명히 있는데 이진 탐색은 찾지 못했습니다. 오류 메시지도 없이 **조용히 틀린 답**을 냅니다. 이진 탐색을 쓰기 전에 배열이 정렬되어 있는지 반드시 확인하세요.

### 실수 2: 구간 방식을 섞는다

`hi = n`(반열린)으로 시작하고 `while lo <= hi`(닫힌)로 반복하면, lo == hi == n인 순간 `a[n]`을 읽어 배열 밖에 접근합니다. 반대로 `hi = n - 1`로 시작하고 `while lo < hi`로 반복하면 마지막 후보 하나를 확인하지 않고 끝납니다. 4.1절과 4.2절의 표 중 **하나를 골라 그대로** 쓰세요.

### 실수 3: 확인한 mid를 버리지 않는다

실습의 디버그 문제처럼 `lo = mid`나 (닫힌 구간에서) `hi = mid`로 갱신하면 구간이 줄지 않아 무한 반복에 빠질 수 있습니다. 매 반복마다 구간이 **적어도 한 칸** 줄어드는지 확인하세요. 9절의 정수 제곱근처럼 `lo = mid`를 쓰려면 반복 조건도 `hi - lo > 1`로 함께 바꿔야 합니다.

### 실수 4: `(lo + hi) / 2`로 넘친다

C와 Rust에서 lo와 hi가 크면 덧셈이 넘칩니다. 실습의 빈칸 문제에서 본 것처럼 `lo + (hi - lo) / 2`로 쓰세요. Rust의 `usize`에서 `hi = mid - 1`은 mid가 0일 때 넘친다는 점도 주의하세요. 반열린 구간을 쓰면 이 문제가 사라집니다.

### 실수 5: lower bound의 결과를 확인 없이 인덱스로 쓴다

lower bound는 **n을 돌려줄 수 있고**, 결과 위치의 값이 target이라는 보장도 없습니다. "찾았는가"를 알려면 `i < n && a[i] == target`을 확인해야 합니다. 5절 C 출력의 `lower_bound(99) = 10`을 그대로 `a[10]`에 쓰면 배열 밖입니다.

## 13. Q&A

**Q. 재귀로 짜는 것과 반복문으로 짜는 것 중 무엇이 좋은가요?**

A. 둘 다 O(log n)입니다. 반복문은 호출 스택을 쓰지 않고 조금 더 빠르며, 재귀는 "절반으로 나눠 같은 문제를 푼다"는 생각이 더 잘 드러납니다. 깊이가 log n뿐이라 재귀도 스택 걱정은 없습니다. 실무에서는 반복문을 더 많이 씁니다.

**Q. 실수(float)가 답인 문제도 이진 탐색할 수 있나요?**

A. 네. 정수가 아니므로 "lo와 hi가 만날 때까지"가 아니라 "원하는 정밀도가 될 때까지" 또는 정해진 횟수(예: 100번)만큼 반복합니다. 방정식의 근을 찾는 **이분법**이 이것입니다.

**Q. 이진 탐색보다 빠른 검색이 있나요?**

A. 값이 고르게 분포한다면 가운데 대신 "값이 있을 법한 위치"를 추정하는 **보간 탐색**이 평균 O(log log n)입니다. 전화번호부에서 "김"씨를 찾을 때 가운데보다 앞쪽을 펼치는 것과 같습니다. 하지만 분포가 고르지 않으면 O(n)까지 느려질 수 있어 잘 쓰지 않습니다. 해시 맵은 평균 O(1)이지만 정렬 순서와 범위 검색을 포기합니다.

**Q. 정렬된 배열 대신 BST에서 찾는 것과 무엇이 다른가요?**

A. 둘 다 "비교해서 한쪽을 버린다"는 같은 원리입니다. 정렬된 배열은 검색이 빠르고 메모리가 적지만 **넣기·빼기가 O(n)** 이고, 균형 BST는 넣기·빼기도 O(log n)입니다. 데이터가 거의 바뀌지 않으면 정렬된 배열 + 이진 탐색이 더 단순하고 빠릅니다.

## 14. 핵심 요약

- 이진 탐색은 **정렬된** 배열에서 가운데와 비교해 **절반을 버리는** 알고리즘이고 O(log n)입니다.
- **불변식**으로 짭니다. 닫힌 구간 `[lo, hi]`는 `hi = n - 1`, `lo <= hi`, `lo = mid + 1`, `hi = mid - 1`. 반열린 구간 `[lo, hi)`는 `hi = n`, `lo < hi`, `lo = mid + 1`, `hi = mid`.
- 같은 값이 여러 개면 **lower bound**(target 이상인 첫 위치)와 **upper bound**(target보다 큰 첫 위치)를 쓰고, 둘의 차이가 개수입니다.
- mid는 `lo + (hi - lo) / 2`로 계산하고, 매 반복마다 구간이 **반드시 줄어드는지** 확인하세요.
- C는 `bsearch`, Python은 `bisect`, Rust는 `binary_search`와 `partition_point`를 씁니다.
- 참/거짓이 한 번만 바뀌는 조건이 있다면 **답의 범위**도 이진 탐색할 수 있습니다.

## 15. 도전 문제

1. **(C)** 닫힌 구간 이진 탐색을 **재귀 함수**로 다시 작성하고, 호출 깊이를 출력해 log₂ n 정도인지 확인하세요.
2. **(Python)** 정렬된 뒤 몇 칸 **회전된** 배열(예: `[40, 50, 60, 10, 20, 30]`)에서 값을 O(log n)에 찾는 함수를 작성하세요. 힌트: mid를 기준으로 어느 한쪽 절반은 반드시 정렬되어 있습니다.
3. **(Rust)** 책 n쪽을 d일 안에 다 읽으려면 하루에 **최소 몇 쪽**씩 읽어야 하는지(쪽 수가 서로 다른 장들을 나누지 않고 순서대로 읽는다고 할 때) 답에 대한 이진 탐색으로 구하세요.
4. **(세 언어)** 정렬된 두 배열에서 **공통 원소**를 모두 찾는 두 방법, ① 한 배열의 각 원소를 다른 배열에서 이진 탐색, ② 두 포인터로 동시에 훑기를 구현하고 비교 횟수를 세어 보세요.
