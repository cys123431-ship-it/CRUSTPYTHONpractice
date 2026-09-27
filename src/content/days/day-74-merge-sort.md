---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-74-merge-sort
courseId: crp-92
phaseId: phase-07
dayNumber: 74
date: "2026-12-13"
title: 병합 정렬 — 반으로 나누고, 정렬된 둘을 합치기
summary: 배열을 절반으로 나눠 각각 정렬한 뒤 두 포인터로 합치는 병합 정렬을 C, Python, Rust로 구현합니다. 재귀 호출이 만드는 트리와 층마다 n번의 일이 log n층 쌓여 O(n log n)이 되는 이유를 확인하고, 안정성, 추가 공간 O(n), 재귀 없는 상향식 병합, 병합으로 뒤바뀐 쌍을 빠르게 세는 방법까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-73-insertion-sort]
learningObjectives:
  - 정렬된 두 배열을 두 포인터로 O(n)에 합치는 병합 과정을 추적하고 구현한다.
  - 나누기와 합치기의 재귀 구조를 트리로 그리고, 멈춤 조건을 설명한다.
  - 층마다 n번씩 log₂ n층이라서 O(n log n)이 되는 이유를 설명하고 비교 횟수로 확인한다.
  - 같은 값에서 왼쪽을 먼저 가져오면 안정 정렬이 된다는 것과 추가 공간 O(n)이 필요하다는 것을 설명한다.
  - 상향식 병합 정렬과, 병합 중 뒤바뀐 쌍을 세는 O(n log n) 알고리즘을 구현한다.
concepts:
  [
    merge sort,
    divide and conquer,
    merge,
    two pointers,
    recursion tree,
    n log n,
    stable sort,
    auxiliary space,
    bottom-up,
    inversion count,
  ]
runnerMode: python
playgroundSource: |
  # 파일: merge.py — 두 정렬된 리스트를 바꿔 합치는 과정을 보세요.
  left = [3, 27, 38, 43]
  right = [5, 9, 10, 82]
  out, i, j = [], 0, 0
  while i < len(left) and j < len(right):
      if left[i] <= right[j]:
          out.append(left[i]); i += 1
      else:
          out.append(right[j]); j += 1
      print(out)
  out += left[i:] + right[j:]
  print("결과:", out)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day74-predict-py
    title: 두 정렬된 리스트 합치기 예측하기
    kind: predict
    objective: 두 포인터가 작은 쪽을 차례로 가져가는 과정을 추적한다.
    prompt: 출력될 두 값(합친 리스트와 비교 횟수)을 예측하세요.
    starter: |-
      left, right = [2, 5, 8], [1, 3, 9, 10]
      out, i, j, comps = [], 0, 0, 0
      while i < len(left) and j < len(right):
          comps += 1
          if left[i] <= right[j]:
              out.append(left[i]); i += 1
          else:
              out.append(right[j]); j += 1
      out += left[i:] + right[j:]
      print(out, comps)
    answer: "[1, 2, 3, 5, 8, 9, 10] 5"
    hint: "1 < 2 → 1, 2 < 3 → 2, 3 < 5 → 3, 5 < 9 → 5, 8 < 9 → 8. 이제 왼쪽이 비었으므로 비교 없이 9, 10을 붙입니다."
    explanation: "비교는 한쪽이 바닥날 때까지만 합니다. 왼쪽 세 개가 모두 나간 시점에 오른쪽의 남은 9, 10은 이미 정렬되어 있으니 그대로 붙입니다. 두 리스트의 길이 합이 m이면 비교는 최대 m - 1번입니다."
    commonMistakes:
      - "남은 원소를 붙일 때도 비교한다고 생각해 7번으로 적음"
      - "두 리스트를 번갈아 하나씩 가져간다고 생각함"
    language: python
    verification: run
  - id: ex-day74-predict-c
    title: 재귀 호출 횟수 예측하기
    kind: predict
    objective: 병합 정렬의 재귀 트리에서 호출과 병합의 수를 센다.
    prompt: "원소 8개를 정렬할 때 merge_sort 호출 횟수와 merge(실제 합치기) 횟수를 공백으로 구분해 적으세요."
    starter: |-
      #include <stdio.h>

      int calls = 0, merges = 0;

      void merge_sort(int lo, int hi) {
          calls++;
          if (hi - lo <= 1) return;
          int mid = lo + (hi - lo) / 2;
          merge_sort(lo, mid);
          merge_sort(mid, hi);
          merges++;
      }

      int main(void) {
          merge_sort(0, 8);
          printf("%d %d\n", calls, merges);
          return 0;
      }
    answer: "15 7"
    hint: "8 → 4, 4 → 2, 2, 2, 2 → 1짜리 8개. 크기별 호출은 1 + 2 + 4 + 8개입니다. 합치기는 원소가 1개보다 많은 호출에서만 일어납니다."
    explanation: "재귀 트리의 노드 수가 호출 수 15이고, 그중 잎(원소 1개) 8개를 뺀 7개에서 합치기를 합니다. n이 2의 거듭제곱이면 호출은 2n - 1번, 합치기는 n - 1번입니다. 트리의 깊이는 log₂ 8 = 3입니다."
    commonMistakes:
      - "호출을 log₂ 8 = 3번이라고 생각함(층 수와 호출 수를 혼동)"
      - "잎에서도 합치기를 한다고 생각해 15 15로 적음"
    language: c
    verification: run
  - id: ex-day74-fill
    title: Rust 병합 정렬의 재귀 부분 채우기
    kind: fill
    objective: 슬라이스를 반으로 나눠 각각 재귀 호출한다.
    prompt: "빈칸 두 곳에 앞 절반과 뒤 절반을 정렬하는 재귀 호출을 채우세요."
    starter: |-
      fn merge_sort(a: &mut [i32]) {
          if a.len() <= 1 {
              return;
          }
          let mid = a.len() / 2;
          _____;
          _____;
          let mut merged = Vec::with_capacity(a.len());
          let (mut i, mut j) = (0, mid);
          while i < mid && j < a.len() {
              if a[i] <= a[j] { merged.push(a[i]); i += 1; } else { merged.push(a[j]); j += 1; }
          }
          merged.extend_from_slice(&a[i..mid]);
          merged.extend_from_slice(&a[j..]);
          a.copy_from_slice(&merged);
      }

      fn main() {
          let mut v = vec![6, 1, 8, 3, 7, 2, 5];
          merge_sort(&mut v);
          println!("{:?}", v);
      }
    answer: |-
      fn merge_sort(a: &mut [i32]) {
          if a.len() <= 1 {
              return;
          }
          let mid = a.len() / 2;
          merge_sort(&mut a[..mid]);
          merge_sort(&mut a[mid..]);
          let mut merged = Vec::with_capacity(a.len());
          let (mut i, mut j) = (0, mid);
          while i < mid && j < a.len() {
              if a[i] <= a[j] { merged.push(a[i]); i += 1; } else { merged.push(a[j]); j += 1; }
          }
          merged.extend_from_slice(&a[i..mid]);
          merged.extend_from_slice(&a[j..]);
          a.copy_from_slice(&merged);
      }

      fn main() {
          let mut v = vec![6, 1, 8, 3, 7, 2, 5];
          merge_sort(&mut v);
          println!("{:?}", v);
      }
    output: "[1, 2, 3, 5, 6, 7, 8]"
    hint: "&mut a[..mid]는 a의 앞부분을 가변으로 빌린 슬라이스입니다. 재귀 호출이 끝나면 빌림도 끝나므로 다음 줄에서 뒷부분을 빌릴 수 있습니다."
    explanation: "두 재귀 호출이 끝나면 a[..mid]와 a[mid..]가 각각 정렬되어 있으므로 두 포인터로 합칩니다. 원소 7개는 3개와 4개로 나뉩니다. 슬라이스를 넘기므로 매번 새 배열을 만들지 않고 원래 배열의 일부를 정렬합니다."
    commonMistakes:
      - "merge_sort(a[..mid])처럼 &mut를 빼서 크기를 모르는 [i32]를 값으로 넘기려는 오류를 냄"
      - "merge_sort(&mut a[..=mid])로 가운데 원소를 두 번 포함시킴"
    language: rust
    verification: run
  - id: ex-day74-modify
    title: Python 병합 정렬을 내림차순으로 바꾸기
    kind: modify
    objective: 병합의 비교 방향 하나로 정렬 순서가 바뀌고, 안정성은 등호의 위치로 결정된다는 것을 확인한다.
    prompt: "merge_sort(items, reverse=False)가 reverse=True일 때 큰 값부터 정렬하도록 고치세요. 같은 점수는 입력 순서를 유지해야 합니다."
    starter: |-
      def merge_sort(items, key=lambda x: x):
          if len(items) <= 1:
              return items
          mid = len(items) // 2
          left, right = merge_sort(items[:mid], key), merge_sort(items[mid:], key)
          out, i, j = [], 0, 0
          while i < len(left) and j < len(right):
              if key(left[i]) <= key(right[j]):
                  out.append(left[i]); i += 1
              else:
                  out.append(right[j]); j += 1
          return out + left[i:] + right[j:]


      scores = [("민수", 80), ("지아", 95), ("하준", 80), ("서연", 70)]
      print(merge_sort(scores, key=lambda s: s[1]))
    answer: |-
      def merge_sort(items, key=lambda x: x, reverse=False):
          if len(items) <= 1:
              return items
          mid = len(items) // 2
          left = merge_sort(items[:mid], key, reverse)
          right = merge_sort(items[mid:], key, reverse)
          out, i, j = [], 0, 0
          while i < len(left) and j < len(right):
              a, b = key(left[i]), key(right[j])
              take_left = a >= b if reverse else a <= b
              if take_left:
                  out.append(left[i]); i += 1
              else:
                  out.append(right[j]); j += 1
          return out + left[i:] + right[j:]


      scores = [("민수", 80), ("지아", 95), ("하준", 80), ("서연", 70)]
      print([n for n, _ in merge_sort(scores, key=lambda s: s[1], reverse=True)])
    output: "['지아', '민수', '하준', '서연']"
    hint: "내림차순에서는 왼쪽 값이 오른쪽보다 크거나 같을 때 왼쪽을 먼저 가져갑니다. '같을 때 왼쪽'을 지켜야 안정성이 유지됩니다."
    explanation: "95점 지아가 먼저이고, 80점인 민수와 하준은 입력 순서대로 나옵니다. >= 대신 >를 쓰면 같은 점수에서 오른쪽(하준)이 먼저 나가 안정성이 깨집니다. 오름차순으로 정렬한 결과를 뒤집는 방법도 같은 점수의 순서를 거꾸로 만듭니다."
    commonMistakes:
      - "take_left를 a > b로 써서 같은 점수의 순서를 뒤집음"
      - "reverse를 재귀 호출에 넘기지 않아 아래 단계는 오름차순으로 정렬됨"
    language: python
    verification: run
  - id: ex-day74-debug
    title: C 병합의 남은 원소 버그 고치기
    kind: debug
    objective: 한쪽이 먼저 끝났을 때 다른 쪽의 남은 원소를 모두 붙여야 한다는 것을 확인한다.
    prompt: "이 merge는 두 쪽을 비교하는 반복이 끝난 뒤 왼쪽의 남은 원소만 붙입니다. 오른쪽에 남은 원소가 사라져 결과 뒤쪽이 이상한 값이 됩니다. 1 2 3 4 5 6이 출력되게 고치세요."
    starter: |-
      #include <stdio.h>

      void merge(const int left[], int nl, const int right[], int nr, int out[]) {
          int i = 0, j = 0, k = 0;
          while (i < nl && j < nr) {
              if (left[i] <= right[j]) out[k++] = left[i++];
              else out[k++] = right[j++];
          }
          while (i < nl) out[k++] = left[i++];
      }

      int main(void) {
          int left[] = {1, 4, 5};
          int right[] = {2, 3, 6};
          int out[6] = {0};
          merge(left, 3, right, 3, out);
          for (int k = 0; k < 6; k++) printf("%d ", out[k]);
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      void merge(const int left[], int nl, const int right[], int nr, int out[]) {
          int i = 0, j = 0, k = 0;
          while (i < nl && j < nr) {
              if (left[i] <= right[j]) out[k++] = left[i++];
              else out[k++] = right[j++];
          }
          while (i < nl) out[k++] = left[i++];
          while (j < nr) out[k++] = right[j++];
      }

      int main(void) {
          int left[] = {1, 4, 5};
          int right[] = {2, 3, 6};
          int out[6] = {0};
          merge(left, 3, right, 3, out);
          for (int k = 0; k < 6; k++) printf("%d ", out[k]);
          printf("\n");
          return 0;
      }
    output: "1 2 3 4 5 6"
    starterOutput: "1 2 3 4 5 0"
    hint: "비교 반복은 어느 한쪽이 바닥나면 끝납니다. 이번에는 왼쪽이 먼저 바닥나서 오른쪽의 6이 남았습니다."
    explanation: "원래 코드는 6을 붙이지 않아 마지막 칸이 초기값 0으로 남습니다. 어느 쪽이 먼저 끝날지 모르므로 두 쪽 모두에 대해 '남은 것 붙이기'를 써야 합니다. 둘 중 하나는 항상 빈 반복이라 비용이 없습니다."
    commonMistakes:
      - "남은 원소 붙이기를 비교 반복 안에 넣어 순서가 섞임"
      - "while (j < nr) 대신 if (j < nr)를 써서 하나만 붙임"
    language: c
    verification: run
  - id: ex-day74-independent
    title: Rust로 정렬된 k개의 목록 합치기
    kind: independent
    objective: 두 개씩 합치기를 반복해 여러 정렬된 목록을 하나로 만든다.
    prompt: "정렬된 Vec 여러 개를 받아 하나의 정렬된 Vec으로 합치는 fn merge_all(lists: Vec<Vec<i32>>) -> Vec<i32>를 만드세요. 두 개씩 짝지어 합치는 일을 목록이 하나가 될 때까지 반복합니다. [[1,5,9],[2,6],[3,4,10],[7,8]]이면 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]이 출력되어야 합니다."
    starter: |-
      fn main() {
          let lists = vec![vec![1, 5, 9], vec![2, 6], vec![3, 4, 10], vec![7, 8]];
          println!("{}", lists.len());
      }
    answer: |-
      fn merge_two(a: &[i32], b: &[i32]) -> Vec<i32> {
          let mut out = Vec::with_capacity(a.len() + b.len());
          let (mut i, mut j) = (0, 0);
          while i < a.len() && j < b.len() {
              if a[i] <= b[j] {
                  out.push(a[i]);
                  i += 1;
              } else {
                  out.push(b[j]);
                  j += 1;
              }
          }
          out.extend_from_slice(&a[i..]);
          out.extend_from_slice(&b[j..]);
          out
      }

      fn merge_all(mut lists: Vec<Vec<i32>>) -> Vec<i32> {
          if lists.is_empty() {
              return Vec::new();
          }
          while lists.len() > 1 {
              let mut next = Vec::new();
              for pair in lists.chunks(2) {
                  match pair {
                      [a, b] => next.push(merge_two(a, b)),
                      [a] => next.push(a.clone()),
                      _ => unreachable!(),
                  }
              }
              lists = next;
          }
          lists.pop().unwrap()
      }

      fn main() {
          let lists = vec![vec![1, 5, 9], vec![2, 6], vec![3, 4, 10], vec![7, 8]];
          println!("{:?}", merge_all(lists));
      }
    output: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    hint: "chunks(2)는 슬라이스를 두 개씩 묶어 줍니다. 마지막에 하나만 남는 묶음도 처리해야 합니다. 이것은 상향식 병합 정렬과 같은 모양입니다."
    explanation: "4개 → 2개 → 1개로 줄어듭니다. 목록이 k개이고 원소가 모두 n개면, 한 바퀴에 원소마다 한 번씩 움직이고 바퀴 수가 log₂ k라서 O(n log k)입니다. 목록을 하나씩 차례로 합치면 앞쪽 원소가 여러 번 복사되어 O(nk)가 됩니다."
    commonMistakes:
      - "lists를 차례로 하나씩 합쳐 앞쪽 원소가 k번 가까이 복사되게 함"
      - "홀수 개일 때 마지막 목록을 빠뜨림"
    language: rust
    verification: run
quiz:
  - id: quiz-day74-01
    question: 병합 정렬에서 '합치기(merge)'의 전제 조건은?
    choices:
      - 두 부분의 길이가 같아야 한다
      - 두 부분이 각각 이미 정렬되어 있어야 한다
      - 두 부분의 원소가 겹치지 않아야 한다
      - 배열이 거의 정렬되어 있어야 한다
    answerIndex: 1
    explanation: 각 부분이 정렬되어 있으니 두 앞쪽 원소 중 작은 것이 전체에서 가장 작은 원소입니다. 이 성질 덕분에 한 번 훑는 것(O(n))만으로 합칠 수 있습니다. 길이는 달라도 됩니다.
  - id: quiz-day74-02
    question: 원소가 n개일 때 병합 정렬의 재귀 트리는 몇 층인가요?
    choices: ["약 log₂ n층", "n층", "n/2층", "2n층"]
    answerIndex: 0
    explanation: 매번 절반으로 나누므로 크기가 1이 될 때까지 log₂ n번 나눕니다. 각 층에서 합치는 원소는 모두 합쳐 n개이므로 전체 O(n log n)입니다.
  - id: quiz-day74-03
    question: 병합 정렬이 안정 정렬이 되려면 합칠 때 두 값이 같으면 어떻게 해야 하나요?
    choices:
      - 오른쪽 값을 먼저 가져간다
      - 왼쪽 값을 먼저 가져간다
      - 둘 다 버린다
      - 아무 쪽이나 상관없다
    answerIndex: 1
    explanation: 왼쪽 부분의 원소는 원래 배열에서 오른쪽 부분의 원소보다 앞에 있었습니다. 같은 값일 때 왼쪽을 먼저 가져가면 원래 순서가 유지됩니다. 그래서 비교를 <=로 씁니다.
  - id: quiz-day74-04
    question: 배열 병합 정렬의 단점으로 가장 알맞은 것은?
    choices:
      - 최악의 경우 O(n²)이다
      - 합칠 때 원소를 담을 추가 공간 O(n)이 필요하다
      - 안정 정렬이 아니다
      - 거의 정렬된 입력에서 느려진다
    answerIndex: 1
    explanation: 병합 정렬은 입력과 상관없이 항상 O(n log n)이고 안정적이지만, 합친 결과를 담을 임시 배열이 필요합니다. 퀵 정렬(Day 75)은 제자리에서 정렬하지만 최악의 경우 O(n²)입니다.
  - id: quiz-day74-05
    question: 원소가 100만 개일 때 병합 정렬의 비교 횟수는 대략 얼마인가요?
    choices: ["약 2,000만 번", "약 100만 번", "약 5,000억 번", "약 20번"]
    answerIndex: 0
    explanation: n log₂ n = 100만 × 20 = 2,000만입니다. 삽입 정렬의 최악(약 5,000억 번)보다 2만 배 이상 적습니다.
---

## 1. 오늘 배울 내용

삽입 정렬은 거꾸로 된 입력에서 O(n²)이었습니다. 원소가 100만 개면 5,000억 번의 비교가 필요합니다. 오늘 배우는 **병합 정렬(merge sort)** 은 어떤 입력이든 **O(n log n)**, 100만 개면 약 2,000만 번으로 정렬합니다. 비결은 **분할 정복(divide and conquer)**, 즉 큰 문제를 반으로 나눠 해결한 뒤 합치는 전략입니다.

1. 먼저 **정렬된 두 배열을 하나로 합치는** 방법을 익힙니다. 병합 정렬의 핵심 부품입니다.
2. 배열을 **반으로 나누고**, 각각을 **재귀로 정렬**한 뒤, **합칩니다.**
3. 재귀 호출이 만드는 **트리**를 그려 왜 O(n log n)인지 이해합니다.
4. **C, Python, Rust** 로 구현하고 비교 횟수를 n log n과 비교합니다.
5. **안정성**, 추가 공간, 재귀 없는 **상향식 병합 정렬**을 배웁니다.
6. 응용으로 Day 73의 **뒤바뀐 쌍**을 O(n²)이 아니라 O(n log n)에 셉니다.

## 2. 왜 병합 정렬인가

선생님이 학생 100명의 시험지를 점수순으로 정렬해야 한다고 합시다. 혼자 100장을 삽입 정렬하는 대신,

1. 시험지를 50장씩 두 조교에게 나눠 주고 각자 정렬해 오라고 합니다.
2. 조교들도 받은 50장을 25장씩 나눠 다른 사람에게 맡깁니다. … 이렇게 계속 나누면 결국 한 사람이 1장씩 받게 되는데, 1장은 이미 정렬되어 있습니다.
3. 정렬된 두 묶음을 받으면 **맨 위 두 장만 비교해서 더 작은 쪽을 내려놓는** 일을 반복해 하나로 합칩니다.

3번의 "합치기"가 아주 쉽다는 것이 핵심입니다. 두 묶음이 각각 정렬되어 있으니, 전체에서 가장 작은 시험지는 **두 묶음의 맨 위 중 하나**입니다. 그래서 한 번 훑기만 하면 됩니다.

## 3. 그림으로 이해하기

`[38, 27, 43, 3, 9, 82, 10, 5]`를 병합 정렬합니다. 위쪽 절반은 **나누기**, 아래쪽 절반은 **합치기**입니다.

```text
나누기                      [38 27 43 3 9 82 10 5]
                           /                     \
                 [38 27 43 3]                   [9 82 10 5]
                 /          \                   /          \
            [38 27]       [43 3]           [9 82]        [10 5]
            /    \        /    \           /    \        /    \
         [38]   [27]   [43]   [3]       [9]   [82]    [10]   [5]      ← 원소 1개 = 정렬됨
            \    /        \    /           \    /        \    /
합치기     [27 38]       [3 43]           [9 82]        [5 10]
                 \          /                   \          /
                 [3 27 38 43]                   [5 9 10 82]
                           \                     /
                        [3 5 9 10 27 38 43 82]
```

### 합치기 한 번을 자세히

`[3 27 38 43]`과 `[5 9 10 82]`를 합칩니다. `i`와 `j`는 각 묶음에서 **아직 내려놓지 않은 맨 위**를 가리킵니다.

| 비교      | 가져간 값  | 결과                   |
| --------- | ---------- | ---------------------- |
| 3 vs 5    | 3 (왼쪽)   | `3`                    |
| 27 vs 5   | 5 (오른쪽) | `3 5`                  |
| 27 vs 9   | 9          | `3 5 9`                |
| 27 vs 10  | 10         | `3 5 9 10`             |
| 27 vs 82  | 27         | `3 5 9 10 27`          |
| 38 vs 82  | 38         | `3 5 9 10 27 38`       |
| 43 vs 82  | 43         | `3 5 9 10 27 38 43`    |
| (왼쪽 끝) | 82 붙이기  | `3 5 9 10 27 38 43 82` |

비교는 7번이고, 왼쪽이 먼저 바닥나자 오른쪽의 82는 **비교 없이** 그대로 붙였습니다.

## 4. 천천히 풀어보기

### 4.1 합치기(merge): 두 포인터

```text
i = 왼쪽의 시작, j = 오른쪽의 시작
둘 다 남아 있는 동안:
    왼쪽[i] <= 오른쪽[j] 이면 왼쪽[i]를 결과에 넣고 i를 한 칸
    아니면 오른쪽[j]를 결과에 넣고 j를 한 칸
남은 쪽을 결과 뒤에 그대로 붙인다
```

원소가 합쳐서 m개면 매 단계 하나씩 결과로 나가므로 **O(m)** 입니다. 마지막 "남은 쪽 붙이기"를 빼먹으면 원소가 사라집니다(실습의 디버그 문제). 어느 쪽이 먼저 바닥날지 모르므로 **양쪽 모두** 붙이는 코드를 써 둡니다.

### 4.2 나누기와 재귀

```text
merge_sort(배열):
    원소가 0개나 1개면 그대로 돌려준다      ← 멈춤 조건
    가운데를 기준으로 왼쪽과 오른쪽으로 나눈다
    왼쪽 = merge_sort(왼쪽)                 ← 같은 문제, 절반 크기
    오른쪽 = merge_sort(오른쪽)
    합치기(왼쪽, 오른쪽)를 돌려준다
```

Day 24의 재귀와 Day 64의 **후위 순회**를 떠올려 보세요. 두 자식(왼쪽과 오른쪽 절반)을 먼저 처리한 뒤 자신(합치기)을 처리하는 모양입니다. 재귀 호출이 만드는 트리가 3절의 그림이고, 합치기는 그 트리의 **아래에서 위로** 일어납니다.

### 4.3 왜 O(n log n)인가

3절의 그림을 **층별로** 보면 답이 보입니다.

```text
층 0: [8개]              합치기 1번,  원소 8개 처리
층 1: [4개] [4개]        합치기 2번,  원소 4 + 4 = 8개 처리
층 2: [2] [2] [2] [2]    합치기 4번,  원소 2×4 = 8개 처리
층 3: [1] × 8            (멈춤)
```

- **층마다** 합치는 원소의 수는 모두 합쳐 **n개**입니다. 조각이 작아지는 대신 조각의 수가 늘기 때문입니다.
- 층의 수는 n을 절반씩 나눠 1이 될 때까지이므로 **log₂ n층**입니다.
- 그래서 전체 일은 **n × log₂ n**, 즉 **O(n log n)** 입니다.

이 계산에는 입력의 모양이 전혀 들어가지 않습니다. 병합 정렬은 이미 정렬된 입력이든 거꾸로 된 입력이든 **항상 O(n log n)** 입니다(삽입 정렬과 대조적입니다).

### 4.4 안정성과 추가 공간

- **안정성**: 합칠 때 같은 값이면 **왼쪽을 먼저** 가져갑니다(`<=`). 왼쪽 조각의 원소는 원래 배열에서 오른쪽 조각보다 앞에 있었으므로 원래 순서가 유지됩니다. `<`로 쓰면 안정성이 깨집니다.
- **추가 공간**: 합친 결과를 담을 곳이 필요합니다. 배열 병합 정렬은 크기 n의 임시 배열을 쓰므로 **추가 공간 O(n)** 입니다. 제자리에서 정렬하는 삽입 정렬(O(1))이나 퀵 정렬(Day 75)과 비교되는 단점입니다.

### 4.5 상향식: 재귀 없이

재귀는 위에서 아래로 나눈 뒤 아래에서 위로 합칩니다. 처음부터 **아래에서 시작**할 수도 있습니다. 원소 하나짜리 조각들을 두 개씩 합쳐 길이 2짜리를 만들고, 그것을 두 개씩 합쳐 4짜리를 만들고, … 반복하면 됩니다. 이것이 **상향식(bottom-up) 병합 정렬**입니다. 재귀 호출이 없어서 호출 스택을 쓰지 않습니다.

## 5. C로 구현하기

C 구현은 임시 배열 `tmp`를 **한 번만** 만들어 모든 합치기에서 재사용합니다. 합칠 때마다 `malloc`하면 느리기 때문입니다. 작은 배열로 합치기 과정을 출력한 뒤, 크기를 바꿔 가며 비교 횟수를 n log₂ n과 비교합니다.

```c
// 파일: merge_sort.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static long long comparisons = 0;

void print_range(const int a[], int lo, int hi) {
    printf("[");
    for (int i = lo; i < hi; i++) {
        printf(i > lo ? " %d" : "%d", a[i]);
    }
    printf("]");
}

// 정렬된 두 구간 a[lo..mid)와 a[mid..hi)를 합친다
void merge(int a[], int lo, int mid, int hi, int tmp[]) {
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        comparisons++;
        if (a[i] <= a[j]) {             // 같으면 왼쪽 먼저 → 안정 정렬
            tmp[k++] = a[i++];
        } else {
            tmp[k++] = a[j++];
        }
    }
    while (i < mid) tmp[k++] = a[i++];  // 남은 쪽을 그대로 붙인다
    while (j < hi) tmp[k++] = a[j++];
    memcpy(a + lo, tmp + lo, (size_t)(hi - lo) * sizeof a[0]);
}

void merge_sort(int a[], int lo, int hi, int tmp[], int depth, int trace) {
    if (hi - lo <= 1) {
        return;                         // 원소가 0개나 1개면 이미 정렬됨
    }
    int mid = lo + (hi - lo) / 2;
    merge_sort(a, lo, mid, tmp, depth + 1, trace);
    merge_sort(a, mid, hi, tmp, depth + 1, trace);
    merge(a, lo, mid, hi, tmp);
    if (trace) {
        printf("%*s합침 ", depth * 2, "");
        print_range(a, lo, hi);
        printf("\n");
    }
}

int main(void) {
    int a[] = {38, 27, 43, 3, 9, 82, 10, 5};
    int n = sizeof a / sizeof a[0];
    int tmp[8];
    printf("시작 ");
    print_range(a, 0, n);
    printf("\n");
    merge_sort(a, 0, n, tmp, 0, 1);
    printf("비교 %lld번\n\n", comparisons);

    printf("%6s %10s %10s\n", "n", "compares", "n*log2(n)");
    for (int n2 = 16; n2 <= 16384; n2 *= 4) {
        int *data = malloc((size_t)n2 * sizeof *data);
        int *buf = malloc((size_t)n2 * sizeof *buf);
        if (data == NULL || buf == NULL) {
            return 1;
        }
        unsigned x = 12345;
        for (int i = 0; i < n2; i++) {
            x = x * 1103515245u + 12345u;               // 간단한 의사 난수
            data[i] = (int)(x >> 16) % 1000;
        }
        comparisons = 0;
        merge_sort(data, 0, n2, buf, 0, 0);
        int log2n = 0;
        for (int m = n2; m > 1; m /= 2) log2n++;
        printf("%6d %10lld %10d\n", n2, comparisons, n2 * log2n);
        free(data);
        free(buf);
    }
    return 0;
}
```

실행 결과:

```text
시작 [38 27 43 3 9 82 10 5]
    합침 [27 38]
    합침 [3 43]
  합침 [3 27 38 43]
    합침 [9 82]
    합침 [5 10]
  합침 [5 9 10 82]
합침 [3 5 9 10 27 38 43 82]
비교 17번

     n   compares  n*log2(n)
    16         47         64
    64        305        384
   256       1727       2048
  1024       8957      10240
  4096      43956      49152
 16384     208652     229376
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `void merge(int a[], int lo, int mid, int hi, int tmp[])`    | 반열린 구간 `a[lo..mid)`와 `a[mid..hi)`를 합칩니다(Day 72의 반열린 구간). 두 조각은 배열 안에서 **붙어 있습니다.**                                                 |
| `if (a[i] <= a[j])`                                          | 같으면 왼쪽을 먼저 가져가 **안정 정렬**이 됩니다.                                                                                                                  |
| `while (i < mid) ...; while (j < hi) ...;`                   | 4.1절의 "남은 쪽 붙이기"를 양쪽 모두 씁니다. 둘 중 하나는 항상 한 번도 돌지 않습니다.                                                                              |
| `memcpy(a + lo, tmp + lo, (size_t)(hi - lo) * sizeof a[0]);` | 합친 결과를 원래 배열의 같은 위치로 복사합니다. `a + lo`는 `&a[lo]`와 같은 주소입니다(Day 30). `memcpy`의 크기는 **바이트 단위**라 원소 수에 원소 크기를 곱합니다. |
| `if (hi - lo <= 1) return;`                                  | 원소가 0개나 1개면 이미 정렬되어 있으므로 멈춥니다.                                                                                                                |
| `printf("%*s합침 ", depth * 2, "");`                         | 재귀 깊이만큼 들여써서 트리 모양을 보여 줍니다. 깊은 조각(작은 조각)이 먼저 합쳐지는 것을 확인하세요.                                                              |
| `x = x * 1103515245u + 12345u;`                              | 간단한 **의사 난수**입니다. `unsigned` 연산은 넘치면 돌아가는 것이 정의되어 있어 어느 컴퓨터에서나 같은 수열이 나옵니다. 그래서 비교 횟수도 항상 같습니다.         |
| `int *buf = malloc(...)` / `free(buf)`                       | 큰 배열은 `malloc`으로 잡고 다 쓰면 해제합니다.                                                                                                                    |

비교 횟수는 항상 n log₂ n보다 조금 적습니다. 합칠 때 한쪽이 먼저 바닥나면 나머지는 비교 없이 붙이기 때문입니다. n이 4배가 될 때마다 비교는 약 4.5~5배로 늘어나는데, n²이었다면 16배였을 것입니다.

## 6. Python으로 구현하기

Python 버전은 나누기와 합치기를 모두 출력해 재귀 과정을 보여 줍니다. 슬라이싱으로 **새 리스트**를 만들어 돌려주는 방식이라 원본은 바뀌지 않습니다. 상향식 병합 정렬과 `key`를 쓴 안정 정렬도 확인합니다.

```python
# 파일: merge_sort.py
def merge(left, right, key=lambda x: x):
    """정렬된 두 리스트를 하나의 정렬된 리스트로 합친다."""
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if key(left[i]) <= key(right[j]):       # 같으면 왼쪽 먼저 → 안정
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1
    out.extend(left[i:])            # 한쪽이 끝나면 나머지를 그대로 붙인다
    out.extend(right[j:])
    return out


def merge_sort(items, key=lambda x: x, depth=0, trace=False):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    if trace:
        print("  " * depth + f"나눔 {items[:mid]} | {items[mid:]}")
    left = merge_sort(items[:mid], key, depth + 1, trace)
    right = merge_sort(items[mid:], key, depth + 1, trace)
    merged = merge(left, right, key)
    if trace:
        print("  " * depth + f"합침 {merged}")
    return merged


def merge_sort_bottom_up(items):
    """재귀 없이: 길이 1, 2, 4, 8 … 짜리 조각을 차례로 합친다."""
    items = list(items)
    width = 1
    while width < len(items):
        merged = []
        for lo in range(0, len(items), 2 * width):
            merged += merge(items[lo:lo + width], items[lo + width:lo + 2 * width])
        items = merged
        print(f"  폭 {width} → {items}")
        width *= 2
    return items


data = [38, 27, 43, 3, 9, 82, 10]
result = merge_sort(data, trace=True)
print("결과:", result, "/ 원본은 그대로:", data)
print("상향식:")
merge_sort_bottom_up(data)

records = [("민수", 2), ("지아", 1), ("하준", 2), ("서연", 1)]
by_group = merge_sort(records, key=lambda r: r[1])
print("그룹순(안정):", by_group)
```

실행 결과:

```text
나눔 [38, 27, 43] | [3, 9, 82, 10]
  나눔 [38] | [27, 43]
    나눔 [27] | [43]
    합침 [27, 43]
  합침 [27, 38, 43]
  나눔 [3, 9] | [82, 10]
    나눔 [3] | [9]
    합침 [3, 9]
    나눔 [82] | [10]
    합침 [10, 82]
  합침 [3, 9, 10, 82]
합침 [3, 9, 10, 27, 38, 43, 82]
결과: [3, 9, 10, 27, 38, 43, 82] / 원본은 그대로: [38, 27, 43, 3, 9, 82, 10]
상향식:
  폭 1 → [27, 38, 3, 43, 9, 82, 10]
  폭 2 → [3, 27, 38, 43, 9, 10, 82]
  폭 4 → [3, 9, 10, 27, 38, 43, 82]
그룹순(안정): [('지아', 1), ('서연', 1), ('민수', 2), ('하준', 2)]
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `out.extend(left[i:])`                           | 남은 부분을 한 번에 붙입니다. 한쪽은 항상 빈 슬라이스라 아무 일도 하지 않습니다.                                                                                  |
| `merge_sort(items[:mid], key, depth + 1, trace)` | 슬라이싱은 **복사본**을 만듭니다. 그래서 원본 `data`가 그대로 남습니다. 대신 층마다 복사가 일어나 메모리를 더 씁니다(여전히 O(n log n) 시간).                     |
| `"  " * depth + f"나눔 ..."`                     | 깊이만큼 들여써서 호출 트리를 보여 줍니다. 원소 7개는 3개와 4개로 나뉘는 것을 보세요. 절반이 딱 떨어지지 않아도 괜찮습니다.                                       |
| `merge_sort_bottom_up`의 `width *= 2`            | 폭 1짜리 조각을 둘씩 합쳐 폭 2, 그다음 4, 8로 키웁니다. 원소 7개라 마지막 조각은 짝이 없을 수 있는데, `items[lo + width:...]`가 빈 리스트가 되어 그대로 붙습니다. |
| `merge_sort(records, key=lambda r: r[1])`        | 그룹 번호로만 정렬했습니다. 같은 그룹 1인 지아와 서연, 그룹 2인 민수와 하준이 **입력 순서 그대로** 나오므로 안정 정렬임을 확인할 수 있습니다.                     |

## 7. Rust로 구현하기

Rust 버전은 슬라이스를 `&mut a[..mid]`, `&mut a[mid..]`로 **빌려서** 제자리에서 정렬한 뒤, 두 반을 `Vec`에 합쳐 원래 슬라이스로 다시 복사합니다. `T: Ord + Clone`이면 무엇이든 정렬할 수 있습니다.

```rust
// 파일: merge_sort.rs
fn merge<T: Ord + Clone>(left: &[T], right: &[T], out: &mut Vec<T>) {
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            out.push(left[i].clone());
            i += 1;
        } else {
            out.push(right[j].clone());
            j += 1;
        }
    }
    out.extend_from_slice(&left[i..]);
    out.extend_from_slice(&right[j..]);
}

fn merge_sort<T: Ord + Clone>(a: &mut [T]) {
    if a.len() <= 1 {
        return;
    }
    let mid = a.len() / 2;
    merge_sort(&mut a[..mid]);          // 앞 절반을 제자리에서 정렬
    merge_sort(&mut a[mid..]);          // 뒤 절반을 제자리에서 정렬
    let mut merged = Vec::with_capacity(a.len());
    merge(&a[..mid], &a[mid..], &mut merged);
    a.clone_from_slice(&merged);        // 합친 결과를 다시 a에 복사
}

fn main() {
    let mut numbers = vec![38, 27, 43, 3, 9, 82, 10, 5];
    merge_sort(&mut numbers);
    println!("숫자: {:?}", numbers);

    let mut words: Vec<String> = ["delta", "alpha", "echo", "bravo", "charlie"]
        .iter()
        .map(|w| w.to_string())
        .collect();
    merge_sort(&mut words);
    println!("단어: {:?}", words);

    let mut merged = Vec::new();
    merge(&[1, 4, 9], &[2, 3, 10, 11], &mut merged);
    println!("정렬된 두 배열 합치기: {:?}", merged);

    let mut big: Vec<u32> = (0..10_000u32).map(|i| (i * 7919) % 10_000).collect();
    merge_sort(&mut big);
    println!("1만 개 정렬 확인: {}", big.windows(2).all(|w| w[0] <= w[1]));
}
```

실행 결과:

```text
숫자: [3, 5, 9, 10, 27, 38, 43, 82]
단어: ["alpha", "bravo", "charlie", "delta", "echo"]
정렬된 두 배열 합치기: [1, 2, 3, 4, 9, 10, 11]
1만 개 정렬 확인: true
```

### 코드 한 부분씩 읽기

| 코드                                                                  | 설명                                                                                                                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn merge<T: Ord + Clone>(left: &[T], right: &[T], out: &mut Vec<T>)` | 두 슬라이스를 **빌려서** 읽고, 결과는 호출한 쪽이 준 Vec에 씁니다. `Clone`이 필요한 이유는 빌린 원소를 결과 Vec에 **복사해** 넣기 때문입니다. |
| `merge_sort(&mut a[..mid]); merge_sort(&mut a[mid..]);`               | 같은 배열의 **겹치지 않는 두 부분**을 차례로 가변으로 빌립니다. 첫 호출이 끝나면 빌림도 끝나므로 두 번째 빌림이 허용됩니다.                   |
| `Vec::with_capacity(a.len())`                                         | 필요한 크기를 미리 알려 줘서, 합치는 동안 Vec이 공간을 여러 번 다시 잡지 않게 합니다.                                                         |
| `merge(&a[..mid], &a[mid..], &mut merged)`                            | 이번에는 두 부분을 **읽기 전용으로** 동시에 빌립니다. 공유 빌림은 여러 개가 동시에 있어도 됩니다.                                             |
| `a.clone_from_slice(&merged);`                                        | 합친 결과를 원래 슬라이스에 복사합니다. 길이가 같아야 하며, 다르면 panic합니다.                                                               |
| `big.windows(2).all(\|w\| w[0] <= w[1])`                              | 이웃한 두 원소씩 보면서 모두 정렬 순서인지 확인합니다. 정렬 결과를 **검증**하는 짧은 관용구입니다.                                            |
| `(i * 7919) % 10_000`                                                 | 7919는 소수라서 0~9999를 한 번씩, 뒤섞인 순서로 만듭니다. 난수 없이 섞인 입력을 만드는 방법입니다.                                            |

> **참고**: 이 구현은 합칠 때마다 `Vec`을 새로 만듭니다. C처럼 임시 버퍼를 한 번만 만들어 넘기면 더 빠르지만, 코드를 단순하게 두었습니다. 표준 `sort()`는 병합 정렬을 발전시킨 알고리즘으로 훨씬 빠르게 구현되어 있습니다.

## 8. 실행 추적

C 프로그램의 비교 17번이 어디서 나왔는지 합치기마다 셉니다.

| 합치기 | 왼쪽         | 오른쪽      |   비교 | 설명                                 |
| ------ | ------------ | ----------- | -----: | ------------------------------------ |
| 1      | [38]         | [27]        |      1 | 27을 가져가자 오른쪽이 바닥남        |
| 2      | [43]         | [3]         |      1 |                                      |
| 3      | [27 38]      | [3 43]      |      3 | 3, 27, 38을 가져간 뒤 왼쪽이 바닥남  |
| 4      | [9]          | [82]        |      1 |                                      |
| 5      | [10]         | [5]         |      1 |                                      |
| 6      | [9 82]       | [5 10]      |      3 | 5, 9, 10을 가져간 뒤 오른쪽이 바닥남 |
| 7      | [3 27 38 43] | [5 9 10 82] |      7 | 3절의 표                             |
|        |              | **합계**    | **17** |                                      |

층별로 보면 층 2(원소 1개끼리)는 1 × 4 = 4번, 층 1은 3 + 3 = 6번, 층 0은 7번입니다. 각 층의 비교는 **n = 8을 넘지 않고**, 층이 3개라 전체는 **n log₂ n = 24를 넘지 않습니다.**

## 9. 다른 예제로 다시 이해하기

Day 73에서 **뒤바뀐 쌍(inversion)**, 즉 "앞에 있는데 더 큰" 두 원소의 쌍을 셌습니다. 두 겹 반복으로 세면 O(n²)이지만, 병합 정렬을 조금 고치면 **O(n log n)** 에 셀 수 있습니다. 합칠 때 **오른쪽 원소를 가져가는 순간**을 보세요. 그 오른쪽 원소는 왼쪽에 **아직 남아 있는 원소 모두**보다 작습니다. 왼쪽 원소들은 원래 배열에서 오른쪽 원소보다 앞에 있었으므로, 남은 왼쪽 원소 수만큼 뒤바뀐 쌍이 있는 것입니다. 왼쪽 조각 안의 쌍과 오른쪽 조각 안의 쌍은 재귀 호출이 이미 세었으므로, 합칠 때는 **조각을 가로지르는 쌍**만 세면 됩니다.

```python
# 파일: inversions.py
def sort_and_count(a):
    if len(a) <= 1:
        return a, 0
    mid = len(a) // 2
    left, inv_left = sort_and_count(a[:mid])
    right, inv_right = sort_and_count(a[mid:])
    merged, i, j, cross = [], 0, 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            cross += len(left) - i          # 남은 왼쪽 원소가 모두 right[j]보다 크다
            j += 1
    merged += left[i:] + right[j:]
    return merged, inv_left + inv_right + cross


def brute_force(a):
    return sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] > a[j])


for data in [[3, 1, 2], [5, 4, 3, 2, 1], [1, 3, 2, 4], [8, 4, 2, 1, 7, 5, 6, 3]]:
    _, fast = sort_and_count(data)
    print(f"{data}: 병합으로 {fast}개, 두 겹 반복으로 {brute_force(data)}개")
```

실행 결과:

```text
[3, 1, 2]: 병합으로 2개, 두 겹 반복으로 2개
[5, 4, 3, 2, 1]: 병합으로 10개, 두 겹 반복으로 10개
[1, 3, 2, 4]: 병합으로 1개, 두 겹 반복으로 1개
[8, 4, 2, 1, 7, 5, 6, 3]: 병합으로 16개, 두 겹 반복으로 16개
```

두 방법의 결과가 같습니다. 뒤바뀐 쌍의 수는 "두 사람의 순위표가 얼마나 다른가"를 재는 데 쓰입니다(추천 시스템, 여론 조사 비교 등). 원소가 100만 개라면 두 겹 반복은 약 5,000억 번, 병합 방식은 약 2,000만 번입니다.

## 10. 시간·공간 복잡도

| 항목        | 병합 정렬                                | 삽입 정렬(비교) |
| ----------- | ---------------------------------------- | --------------- |
| 최선        | O(n log n)                               | O(n)            |
| 평균        | O(n log n)                               | O(n²)           |
| 최악        | **O(n log n)**                           | O(n²)           |
| 추가 공간   | O(n) 임시 배열 + O(log n) 재귀           | O(1)            |
| 안정?       | 예 (`<=`로 합칠 때)                      | 예              |
| 연결 리스트 | 추가 공간 없이 가능, 흔히 씀             | 가능            |
| 작은 입력   | 재귀 부담으로 삽입 정렬보다 느릴 수 있음 | 빠름            |

## 11. 세 언어 비교

| 관점           | C                                        | Python                          | Rust                                      |
| -------------- | ---------------------------------------- | ------------------------------- | ----------------------------------------- |
| 조각 표현      | 같은 배열의 인덱스 구간 `[lo, hi)`       | 슬라이싱으로 만든 새 리스트     | 빌린 슬라이스 `&mut a[..mid]`             |
| 임시 공간      | `tmp` 배열 하나를 모든 합치기에서 재사용 | 합칠 때마다 새 리스트           | 합칠 때마다 `Vec::with_capacity`          |
| 결과 반영      | `memcpy`로 원래 위치에 복사              | 새 리스트를 돌려줌(원본 유지)   | `clone_from_slice`로 원래 슬라이스에 복사 |
| 여러 타입      | `void *` + 원소 크기 + 비교 함수         | 비교 가능한 아무 값, `key=`     | 제네릭 `T: Ord + Clone`                   |
| 표준 안정 정렬 | 없음(`qsort`는 안정성 보장 없음)         | `sorted`, `list.sort` (Timsort) | `sort`, `sort_by`, `sort_by_key`          |

## 12. 자주 하는 실수

### 실수 1: 남은 원소를 붙이지 않는다

실습의 디버그 문제입니다. 비교 반복은 한쪽이 바닥나면 끝나므로, 다른 쪽에 남은 원소를 **반드시** 붙여야 합니다. 어느 쪽이 먼저 끝날지 모르니 양쪽 모두 붙이는 코드를 쓰세요.

### 실수 2: 멈춤 조건을 잘못 쓴다

```python
# 파일: bad_base_case.py (실행 오류: RecursionError)
def merge_sort(a):
    if len(a) == 0:          # 원소 1개일 때 멈추지 않는다
        return a
    mid = len(a) // 2
    return sorted(merge_sort(a[:mid]) + merge_sort(a[mid:]))


print(merge_sort([3, 1, 2]))
```

```text
RecursionError: maximum recursion depth exceeded
```

원소가 1개인 리스트를 나누면 mid = 0이라 `a[:0]`(빈 리스트)과 `a[0:]`(원소 1개 그대로)가 됩니다. 원소 1개짜리가 **다시 자기 자신과 같은 크기로** 호출되어 끝나지 않습니다. 멈춤 조건은 `len(a) <= 1`이어야 합니다.

### 실수 3: 합칠 때 `<`로 비교한다

`left[i] < right[j]`로 쓰면 같은 값에서 **오른쪽을 먼저** 가져가 안정성이 깨집니다. 정렬 결과의 숫자 순서는 맞지만, 여러 기준으로 정렬할 때 이전 기준의 순서가 망가집니다.

### 실수 4: 합칠 때마다 큰 임시 배열을 새로 만든다

C에서 합치기마다 `malloc(n)`을 하면 호출이 약 n번이라 할당도 n번입니다. 임시 배열은 **한 번** 만들어 넘기세요. 합치는 **구간의 크기만큼만** 쓰면 됩니다.

### 실수 5: mid를 기준으로 구간을 겹치게 나눈다

`[lo, mid]`와 `[mid, hi]`처럼 양쪽에 mid를 모두 포함시키면 가운데 원소가 두 번 들어가고, 원소 2개짜리 구간이 끝없이 같은 크기로 나뉠 수 있습니다. 반열린 구간 `[lo, mid)`와 `[mid, hi)`로 **겹치지 않게** 나누세요.

## 13. Q&A

**Q. 병합 정렬과 삽입 정렬을 섞으면 더 빠른가요?**

A. 네. 조각이 작아지면(예: 16개 이하) 재귀를 멈추고 삽입 정렬로 정렬하면 재귀 호출의 부담이 줄어 실제로 빨라집니다. Python의 Timsort와 Rust의 `sort`가 이런 식으로 작은 구간은 삽입 정렬, 큰 구간은 병합을 씁니다. 게다가 입력에서 **이미 정렬된 구간**을 찾아 그대로 활용하므로, 거의 정렬된 입력에서는 O(n)에 가깝게 끝납니다.

**Q. 메모리에 다 들어가지 않는 거대한 데이터는 어떻게 정렬하나요?**

A. 병합 정렬이 답입니다. 데이터를 메모리에 들어갈 만큼씩 잘라 각각 정렬해 파일로 저장한 뒤, 정렬된 파일들을 **앞에서부터 조금씩 읽으며 합칩니다.** 합치기는 앞쪽 원소만 보면 되므로 파일 전체를 메모리에 올릴 필요가 없습니다. 이것을 **외부 정렬**이라고 하며 데이터베이스가 씁니다. 여러 파일을 합칠 때는 Day 66의 힙을 씁니다.

**Q. 연결 리스트를 병합 정렬하면 추가 공간이 필요 없다는 것은 무슨 뜻인가요?**

A. 연결 리스트는 노드를 새로 만들지 않고 **next 포인터만 다시 연결**해서 합칠 수 있습니다(Day 61 도전 문제). 그래서 임시 배열이 필요 없습니다. 또 가운데로 가는 비용이 크더라도 한 번 훑으면 되므로 병합 정렬이 연결 리스트에 잘 맞습니다.

**Q. O(n log n)보다 빠른 비교 정렬이 있나요?**

A. "두 원소를 비교해서" 정렬하는 알고리즘은 최악의 경우 **O(n log n)보다 빠를 수 없다**는 것이 증명되어 있습니다. n개를 정렬하는 순서는 n!가지이고, 비교 한 번은 가능성을 기껏해야 절반으로 줄이므로 log₂(n!) ≈ n log₂ n번은 비교해야 하기 때문입니다. 다만 값이 작은 정수처럼 특별한 경우에는 비교하지 않는 **계수 정렬**로 O(n)이 가능합니다.

## 14. 핵심 요약

- 병합 정렬은 **나누고(divide), 각각 정렬하고(conquer), 합치는(combine)** 분할 정복 알고리즘입니다.
- **합치기**는 정렬된 두 배열의 앞쪽 원소 중 작은 것을 차례로 가져가는 두 포인터 방식이며 O(n)입니다. **남은 쪽을 붙이는 것**을 잊지 마세요.
- 재귀 트리는 **log₂ n층**이고 층마다 **n번**의 일을 하므로, 입력과 상관없이 항상 **O(n log n)** 입니다.
- 같은 값에서 **왼쪽을 먼저** 가져가면(`<=`) **안정 정렬**입니다.
- 배열 병합 정렬은 **추가 공간 O(n)** 이 필요합니다. 연결 리스트에서는 추가 공간 없이 정렬할 수 있습니다.
- 합치기에 한 줄을 더하면 **뒤바뀐 쌍을 O(n log n)** 에 셀 수 있습니다.

## 15. 도전 문제

1. **(C)** 조각의 크기가 16 이하이면 재귀를 멈추고 Day 73의 삽입 정렬로 정렬하도록 `merge_sort`를 고친 뒤, n = 16384에서 비교 횟수가 어떻게 달라지는지 확인하세요.
2. **(Python)** Day 61의 연결 리스트 `Node`를 병합 정렬하는 함수를 만드세요. 가운데 노드는 한 칸씩 가는 포인터와 두 칸씩 가는 포인터로 찾습니다.
3. **(Rust)** 임시 버퍼를 한 번만 만들어 넘기는 `fn merge_sort_with_buffer<T: Ord + Copy>(a: &mut [T], buf: &mut [T])`를 만드세요.
4. **(세 언어)** 원소 10만 개의 무작위 배열을 직접 만든 병합 정렬과 Day 73의 삽입 정렬로 정렬해 비교 횟수를 비교해 보세요(Python의 삽입 정렬은 1만 개로 줄여도 됩니다).
