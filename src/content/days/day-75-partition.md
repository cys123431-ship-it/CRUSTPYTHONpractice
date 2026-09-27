---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-75-partition
courseId: crp-92
phaseId: phase-07
dayNumber: 75
date: "2026-12-14"
title: 퀵 정렬 — 피벗을 기준으로 나누기
summary: 피벗보다 작은 값과 큰 값으로 배열을 제자리에서 나누는 분할(Lomuto)과, 나눈 두 부분을 재귀로 정렬하는 퀵 정렬을 C, Python, Rust로 구현합니다. 평균 O(n log n)인 이유, 정렬된 입력에서 마지막 원소를 피벗으로 고르면 O(n²)이 되는 이유를 비교 횟수로 확인하고, 피벗 고르기, 불안정성, 재귀 깊이, k번째 원소를 찾는 퀵 선택까지 다룹니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-74-merge-sort]
learningObjectives:
  - 분할(partition)의 불변식을 설명하고 Lomuto 분할의 단계를 손으로 추적한다.
  - 피벗의 최종 위치를 기준으로 두 부분을 재귀 정렬하는 퀵 정렬을 세 언어로 구현한다.
  - 피벗이 가운데 근처면 O(n log n), 한쪽 끝이면 O(n²)이 되는 이유를 비교 횟수로 확인한다.
  - 가운데 원소나 세 값의 중앙값으로 피벗을 골라 최악의 경우를 피하는 방법을 설명한다.
  - 퀵 정렬이 안정 정렬이 아닌 이유를 설명하고, 분할로 k번째 작은 값을 평균 O(n)에 찾는다.
concepts:
  [
    quick sort,
    partition,
    pivot,
    lomuto,
    in-place,
    worst case,
    median of three,
    unstable sort,
    recursion depth,
    quickselect,
  ]
runnerMode: python
playgroundSource: |
  # 파일: partition.py — 배열과 피벗을 바꿔 분할 과정을 보세요.
  a = [7, 2, 1, 6, 8, 5, 3, 4]
  pivot = a[-1]
  i = 0
  for j in range(len(a) - 1):
      if a[j] < pivot:
          a[i], a[j] = a[j], a[i]
          i += 1
      print(f"j={j} a[j]={a[j]:>2}  작은 구역 {a[:i]}  나머지 {a[i:-1]}")
  a[i], a[-1] = a[-1], a[i]
  print("분할 결과:", a[:i], [a[i]], a[i + 1:])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day75-predict-py
    title: Lomuto 분할 결과 예측하기
    kind: predict
    objective: 피벗보다 작은 값이 앞으로 모이고 피벗이 그 뒤에 놓이는 과정을 추적한다.
    prompt: 분할이 끝난 뒤의 배열과 피벗 위치를 예측하세요.
    starter: |-
      a = [9, 3, 7, 1, 6]
      pivot = a[-1]
      i = 0
      for j in range(len(a) - 1):
          if a[j] < pivot:
              a[i], a[j] = a[j], a[i]
              i += 1
      a[i], a[-1] = a[-1], a[i]
      print(a, i)
    answer: "[3, 1, 6, 9, 7] 2"
    hint: "피벗은 6입니다. 6보다 작은 3과 1이 차례로 앞쪽 칸(0, 1)으로 옮겨집니다. 마지막에 피벗을 인덱스 2에 넣습니다."
    explanation: "j = 1에서 3을 a[0]과 바꾸고, j = 3에서 1을 a[1]과 바꿔 [3, 1, 7, 9, 6]이 됩니다. 마지막에 a[2]와 피벗을 바꾸면 [3, 1, 6, 9, 7]입니다. 피벗 6은 최종 위치 2에 놓였고, 왼쪽은 모두 작고 오른쪽은 모두 큽니다. 양쪽 안의 순서는 아직 정렬되지 않았습니다."
    commonMistakes:
      - "분할이 양쪽까지 정렬해 준다고 생각해 [1, 3, 6, 7, 9]로 적음"
      - "마지막 교환을 빠뜨려 피벗이 끝에 남는다고 생각함"
    language: python
    verification: run
  - id: ex-day75-predict-c
    title: 최악의 경우 비교 횟수 예측하기
    kind: predict
    objective: 정렬된 입력에서 마지막 원소 피벗이 매번 한쪽 끝에 놓인다는 것을 확인한다.
    prompt: "이미 정렬된 원소 5개와 10개를 '마지막 원소 피벗' 퀵 정렬로 정렬할 때의 비교 횟수를 공백으로 구분해 적으세요."
    starter: |-
      #include <stdio.h>

      int comps = 0;

      void quick_sort(int a[], int lo, int hi) {
          if (lo >= hi) return;
          int pivot = a[hi], i = lo;
          for (int j = lo; j < hi; j++) {
              comps++;
              if (a[j] < pivot) {
                  int t = a[i]; a[i] = a[j]; a[j] = t;
                  i++;
              }
          }
          int t = a[i]; a[i] = a[hi]; a[hi] = t;
          quick_sort(a, lo, i - 1);
          quick_sort(a, i + 1, hi);
      }

      int main(void) {
          int x[5] = {1, 2, 3, 4, 5};
          int y[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
          quick_sort(x, 0, 4);
          int first = comps;
          comps = 0;
          quick_sort(y, 0, 9);
          printf("%d %d\n", first, comps);
          return 0;
      }
    answer: "10 45"
    hint: "정렬된 배열에서 마지막 원소는 가장 큰 값이라, 분할하면 오른쪽 부분이 비고 왼쪽에 n-1개가 남습니다. 비교는 4 + 3 + 2 + 1번입니다."
    explanation: "매번 피벗이 가장 커서 문제 크기가 1씩만 줄어듭니다. 비교는 (n-1) + (n-2) + … + 1 = n(n-1)/2로 5개는 10번, 10개는 45번이라 O(n²)입니다. 크기가 절반씩 줄어드는 병합 정렬과 달리, 퀵 정렬은 피벗이 나쁘면 이렇게 느려집니다."
    commonMistakes:
      - "퀵 정렬은 항상 n log n이라고 생각해 약 12, 33으로 적음"
      - "재귀 호출 수와 비교 횟수를 혼동함"
    language: c
    verification: run
  - id: ex-day75-fill
    title: Rust에서 피벗 기준으로 슬라이스 나누기
    kind: fill
    objective: split_at_mut으로 겹치지 않는 두 부분을 동시에 가변으로 빌린다.
    prompt: "빈칸에 슬라이스를 피벗 위치 p에서 두 부분으로 나누는 코드를 채우세요. left는 a[..p], right는 a[p..]가 되어야 합니다."
    starter: |-
      fn partition(a: &mut [i32]) -> usize {
          let last = a.len() - 1;
          let mut i = 0;
          for j in 0..last {
              if a[j] < a[last] {
                  a.swap(i, j);
                  i += 1;
              }
          }
          a.swap(i, last);
          i
      }

      fn quick_sort(a: &mut [i32]) {
          if a.len() <= 1 {
              return;
          }
          let p = partition(a);
          let (left, right) = _____;
          quick_sort(left);
          quick_sort(&mut right[1..]);
      }

      fn main() {
          let mut v = vec![5, 9, 1, 7, 3, 8];
          quick_sort(&mut v);
          println!("{:?}", v);
      }
    answer: |-
      fn partition(a: &mut [i32]) -> usize {
          let last = a.len() - 1;
          let mut i = 0;
          for j in 0..last {
              if a[j] < a[last] {
                  a.swap(i, j);
                  i += 1;
              }
          }
          a.swap(i, last);
          i
      }

      fn quick_sort(a: &mut [i32]) {
          if a.len() <= 1 {
              return;
          }
          let p = partition(a);
          let (left, right) = a.split_at_mut(p);
          quick_sort(left);
          quick_sort(&mut right[1..]);
      }

      fn main() {
          let mut v = vec![5, 9, 1, 7, 3, 8];
          quick_sort(&mut v);
          println!("{:?}", v);
      }
    output: "[1, 3, 5, 7, 8, 9]"
    hint: "split_at_mut(p)는 슬라이스를 [..p]와 [p..] 두 개의 가변 슬라이스로 나눠 줍니다. 두 부분이 겹치지 않는다는 것을 Rust가 알기 때문에 동시에 빌릴 수 있습니다."
    explanation: "right[0]이 피벗이라 이미 제자리이므로 right[1..]만 정렬합니다. &mut a[..p]와 &mut a[p+1..]를 따로 만들려고 하면 같은 a를 두 번 가변으로 빌리는 것이 되어 컴파일되지 않습니다. split_at_mut이 이 문제를 안전하게 해결합니다."
    commonMistakes:
      - "(&mut a[..p], &mut a[p..])로 써서 E0499(가변 빌림 두 번) 오류를 냄"
      - "quick_sort(right)로 피벗까지 다시 정렬 대상에 넣어 불필요한 일을 함"
    language: rust
    verification: run
  - id: ex-day75-modify
    title: Python 퀵 정렬에 세 값의 중앙값 피벗 넣기
    kind: modify
    objective: 첫 원소, 가운데 원소, 마지막 원소의 중앙값을 피벗으로 골라 최악의 경우를 피한다.
    prompt: "quick_sort가 a[lo], a[mid], a[hi] 중 가운데 값을 피벗으로 쓰도록 고치세요. 정렬된 원소 200개를 정렬할 때 비교 횟수가 19900보다 훨씬 적어야 합니다."
    starter: |-
      comps = 0


      def quick_sort(a, lo, hi):
          global comps
          if lo >= hi:
              return
          pivot, i = a[hi], lo
          for j in range(lo, hi):
              comps += 1
              if a[j] < pivot:
                  a[i], a[j] = a[j], a[i]
                  i += 1
          a[i], a[hi] = a[hi], a[i]
          quick_sort(a, lo, i - 1)
          quick_sort(a, i + 1, hi)


      data = list(range(200))
      quick_sort(data, 0, len(data) - 1)
      print(comps, data == sorted(data))
    answer: |-
      comps = 0


      def median_of_three(a, lo, hi):
          mid = (lo + hi) // 2
          trio = sorted([(a[lo], lo), (a[mid], mid), (a[hi], hi)])
          return trio[1][1]                     # 가운데 값의 인덱스


      def quick_sort(a, lo, hi):
          global comps
          if lo >= hi:
              return
          m = median_of_three(a, lo, hi)
          a[m], a[hi] = a[hi], a[m]             # 중앙값을 피벗 자리로
          pivot, i = a[hi], lo
          for j in range(lo, hi):
              comps += 1
              if a[j] < pivot:
                  a[i], a[j] = a[j], a[i]
                  i += 1
          a[i], a[hi] = a[hi], a[i]
          quick_sort(a, lo, i - 1)
          quick_sort(a, i + 1, hi)


      data = list(range(200))
      quick_sort(data, 0, len(data) - 1)
      print(comps, data == sorted(data))
    output: "1153 True"
    hint: "세 값을 (값, 인덱스)로 묶어 정렬하면 가운데 항목의 인덱스가 중앙값의 위치입니다. 그 원소를 a[hi]와 바꾼 뒤 기존 분할 코드를 그대로 쓰면 됩니다."
    explanation: "원래 코드는 정렬된 입력에서 199 + 198 + … = 19900번 비교합니다. 중앙값 피벗은 정렬된 입력에서 가운데 값을 고르므로 매번 거의 절반으로 나뉘어 1153번이면 됩니다. 세 값만 보는 적은 비용으로 흔한 최악의 경우를 피하는 실용적인 방법입니다."
    commonMistakes:
      - "중앙값의 '값'만 구하고 그 원소를 피벗 자리로 옮기지 않음"
      - "a[lo], a[mid], a[hi]를 정렬한 결과를 배열에 다시 쓰지 않고 계산만 함"
    language: python
    verification: run
  - id: ex-day75-debug
    title: C 분할에서 피벗을 제자리에 놓지 않은 버그 고치기
    kind: debug
    objective: 분할 뒤 피벗을 두 구역 사이에 놓고 그 위치를 돌려줘야 한다는 것을 확인한다.
    prompt: "이 partition은 작은 값을 앞으로 모은 뒤 피벗을 a[i]로 옮기지 않고 i를 돌려줍니다. 그래서 재귀가 잘못된 구간을 정렬해 결과가 틀립니다. 1 2 3 4 5 6이 출력되게 고치세요."
    starter: |-
      #include <stdio.h>

      int partition(int a[], int lo, int hi) {
          int pivot = a[hi], i = lo;
          for (int j = lo; j < hi; j++) {
              if (a[j] < pivot) {
                  int t = a[i]; a[i] = a[j]; a[j] = t;
                  i++;
              }
          }
          return i;
      }

      void quick_sort(int a[], int lo, int hi) {
          if (lo >= hi) return;
          int p = partition(a, lo, hi);
          quick_sort(a, lo, p - 1);
          quick_sort(a, p + 1, hi);
      }

      int main(void) {
          int a[] = {4, 6, 2, 5, 1, 3};
          quick_sort(a, 0, 5);
          for (int k = 0; k < 6; k++) printf("%d ", a[k]);
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int partition(int a[], int lo, int hi) {
          int pivot = a[hi], i = lo;
          for (int j = lo; j < hi; j++) {
              if (a[j] < pivot) {
                  int t = a[i]; a[i] = a[j]; a[j] = t;
                  i++;
              }
          }
          int t = a[i]; a[i] = a[hi]; a[hi] = t;
          return i;
      }

      void quick_sort(int a[], int lo, int hi) {
          if (lo >= hi) return;
          int p = partition(a, lo, hi);
          quick_sort(a, lo, p - 1);
          quick_sort(a, p + 1, hi);
      }

      int main(void) {
          int a[] = {4, 6, 2, 5, 1, 3};
          quick_sort(a, 0, 5);
          for (int k = 0; k < 6; k++) printf("%d ", a[k]);
          printf("\n");
          return 0;
      }
    output: "1 2 3 4 5 6"
    starterOutput: "2 1 4 5 6 3"
    hint: "분할 반복이 끝나면 a[lo..i)는 피벗보다 작고, 피벗은 아직 맨 끝 a[hi]에 있습니다. 피벗을 a[i]와 바꿔야 a[i]가 '최종 위치의 피벗'이 됩니다."
    explanation: "피벗을 옮기지 않으면 a[p]는 피벗이 아니라 임의의 큰 값이고, 진짜 피벗은 오른쪽 구간의 끝에 남습니다. 그래서 '왼쪽은 작고 오른쪽은 크다'는 약속이 깨져 결과가 2 1 4 5 6 3처럼 틀립니다. 분할 함수의 약속은 '돌려준 위치에 피벗이 있고, 그 왼쪽은 모두 작고 오른쪽은 모두 크거나 같다'입니다."
    commonMistakes:
      - "a[hi]와 a[i]를 바꾸고 i + 1을 돌려줘서 피벗을 한 번 더 정렬 대상에 넣음"
      - "재귀를 quick_sort(a, lo, p)로 바꿔 무한 재귀를 만듦"
    language: c
    verification: run
  - id: ex-day75-independent
    title: Rust로 세 구역 분할하기(네덜란드 국기 문제)
    kind: independent
    objective: 피벗보다 작은 값, 같은 값, 큰 값의 세 구역으로 한 번에 나눈다.
    prompt: "fn three_way(a: &mut [i32], pivot: i32) -> (usize, usize)를 만드세요. 결과 (lt, gt)는 a[..lt] < pivot, a[lt..gt] == pivot, a[gt..] > pivot을 만족해야 합니다. [3, 5, 3, 1, 5, 2, 3, 6]을 3으로 나누면 세 구역의 내용이 [1, 2] [3, 3, 3] [5, 5, 6](정렬해서 출력)이어야 합니다."
    starter: |-
      fn main() {
          let mut a = vec![3, 5, 3, 1, 5, 2, 3, 6];
          println!("{:?}", a);
          a.sort();
      }
    answer: |-
      fn three_way(a: &mut [i32], pivot: i32) -> (usize, usize) {
          let (mut lt, mut i, mut gt) = (0, 0, a.len());
          while i < gt {
              if a[i] < pivot {
                  a.swap(lt, i);
                  lt += 1;
                  i += 1;
              } else if a[i] > pivot {
                  gt -= 1;
                  a.swap(i, gt);
              } else {
                  i += 1;
              }
          }
          (lt, gt)
      }

      fn main() {
          let mut a = vec![3, 5, 3, 1, 5, 2, 3, 6];
          let (lt, gt) = three_way(&mut a, 3);
          let mut parts: Vec<Vec<i32>> = vec![a[..lt].to_vec(), a[lt..gt].to_vec(), a[gt..].to_vec()];
          for p in parts.iter_mut() {
              p.sort();
          }
          println!("{:?} {:?} {:?}", parts[0], parts[1], parts[2]);
      }
    output: "[1, 2] [3, 3, 3] [5, 5, 6]"
    hint: "포인터 셋을 씁니다. lt 앞은 작은 구역, gt부터는 큰 구역, lt..i는 같은 구역, i..gt는 아직 안 본 구역입니다. 큰 값과 바꿀 때는 i를 늘리지 마세요. 뒤에서 온 값을 아직 보지 않았기 때문입니다."
    explanation: "한 번 훑으며 세 구역을 만듭니다. 퀵 정렬에서 이 분할을 쓰면 피벗과 같은 값들은 가운데 구역에서 끝나 다시 정렬하지 않으므로, 같은 값이 많은 입력에서 O(n²)으로 느려지는 것을 막습니다."
    commonMistakes:
      - "큰 값을 뒤로 보낸 뒤에도 i를 늘려 뒤에서 온 값을 검사하지 않음"
      - "gt를 len - 1로 시작해 마지막 원소를 확인하지 않음"
    language: rust
    verification: run
quiz:
  - id: quiz-day75-01
    question: 분할(partition)이 끝난 직후 항상 참인 것은?
    choices:
      - 배열 전체가 정렬되어 있다
      - 피벗이 최종 위치에 있고, 왼쪽은 모두 피벗보다 작고 오른쪽은 모두 크거나 같다
      - 피벗이 배열의 가운데 인덱스에 있다
      - 왼쪽과 오른쪽 부분이 각각 정렬되어 있다
    answerIndex: 1
    explanation: 분할은 피벗 하나의 자리만 확정합니다. 양쪽 안의 순서는 정해지지 않아서 재귀로 각각 정렬해야 합니다. 피벗이 가운데 인덱스에 올지는 피벗 값에 달려 있습니다.
  - id: quiz-day75-02
    question: 이미 정렬된 배열을 '마지막 원소 피벗' 퀵 정렬로 정렬하면 시간 복잡도는?
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"]
    answerIndex: 2
    explanation: 마지막 원소가 매번 가장 큰 값이라 한쪽 부분이 비고 다른 쪽에 n-1개가 남습니다. 문제 크기가 1씩만 줄어서 n(n-1)/2번 비교합니다.
  - id: quiz-day75-03
    question: 병합 정렬과 비교한 퀵 정렬의 장점은?
    choices:
      - 최악의 경우에도 O(n log n)이 보장된다
      - 안정 정렬이다
      - 추가 배열 없이 제자리에서 정렬하고, 평균적으로 실제 속도가 빠르다
      - 연결 리스트에 더 잘 맞는다
    answerIndex: 2
    explanation: 퀵 정렬은 교환만으로 제자리에서 정렬해 추가 공간이 재귀 깊이(평균 O(log n))뿐이고, 연속된 메모리를 차례로 훑어 캐시에 유리합니다. 대신 최악의 경우 O(n²)이고 안정 정렬이 아닙니다.
  - id: quiz-day75-04
    question: 퀵 정렬이 안정 정렬이 아닌 이유는?
    choices:
      - 재귀를 쓰기 때문에
      - 분할할 때 멀리 떨어진 원소끼리 교환해 같은 값의 상대 순서가 바뀔 수 있기 때문에
      - 피벗을 두 번 비교하기 때문에
      - 추가 공간을 쓰지 않기 때문에
    answerIndex: 1
    explanation: Lomuto 분할은 작은 값을 앞쪽의 아무 원소와 교환합니다. 이때 앞에 있던 같은 값이 뒤로 밀려날 수 있습니다. 병합 정렬은 인접한 조각을 순서대로 합치므로 안정적입니다.
  - id: quiz-day75-05
    question: 퀵 선택(quickselect)으로 배열에서 k번째로 작은 값을 찾을 때의 평균 시간 복잡도는?
    choices: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"]
    answerIndex: 1
    explanation: 분할 후 k가 있는 쪽 한 부분만 계속 탐색하므로 평균 n + n/2 + n/4 + … ≈ 2n번입니다. 전체를 정렬(O(n log n))하지 않고 중앙값을 구할 수 있습니다. 최악의 경우는 O(n²)입니다.
---

## 1. 오늘 배울 내용

병합 정렬은 항상 O(n log n)이지만 **추가 배열**이 필요했습니다. 오늘 배우는 **퀵 정렬(quick sort)** 은 배열 안에서 교환만으로 정렬하면서도 **평균 O(n log n)** 이고, 실제로는 가장 빠른 정렬 중 하나입니다. 대신 **피벗을 잘못 고르면 O(n²)** 이 된다는 약점이 있습니다. 오늘은 그 약점이 왜 생기고 어떻게 피하는지까지 배웁니다.

1. 퀵 정렬의 핵심인 **분할(partition)** 을 익힙니다. 피벗보다 작은 값은 앞으로, 큰 값은 뒤로 보냅니다.
2. 분할한 두 부분을 **재귀로 정렬**하면 퀵 정렬이 완성됩니다.
3. **C, Python, Rust** 로 구현하고, 입력과 피벗 선택에 따라 비교 횟수가 어떻게 달라지는지 측정합니다.
4. **피벗 고르기**(가운데 원소, 세 값의 중앙값), **불안정성**, **재귀 깊이**를 다룹니다.
5. 응용으로 정렬하지 않고 **k번째로 작은 값**을 찾는 **퀵 선택**을 구현합니다.

## 2. 왜 퀵 정렬인가

병합 정렬은 "일단 반으로 나누고, 어려운 일은 **합칠 때**" 했습니다. 퀵 정렬은 반대입니다. "어려운 일은 **나눌 때** 하고, 합칠 때는 아무것도 안 합니다."

학생들을 키 순서로 세운다고 합시다. 한 학생(피벗)을 기준으로 정해 "이 친구보다 작은 사람은 왼쪽, 큰 사람은 오른쪽"으로 모이게 합니다. 그러면 기준 학생의 자리는 **확정**됩니다. 왼쪽 무리와 오른쪽 무리는 각각 같은 방법으로 다시 세우면 됩니다. 두 무리를 다 세운 뒤에는 **그냥 이어 붙이면** 끝입니다. 왼쪽 무리는 모두 피벗보다 작고 오른쪽은 모두 크기 때문입니다.

| 정렬      | 나누기                 | 합치기                 | 추가 공간     | 최악       |
| --------- | ---------------------- | ---------------------- | ------------- | ---------- |
| 병합 정렬 | 쉬움(가운데서 자르기)  | 어려움(두 포인터 병합) | O(n)          | O(n log n) |
| 퀵 정렬   | 어려움(피벗 기준 분할) | 없음                   | O(log n) 재귀 | O(n²)      |

## 3. 그림으로 이해하기

`[7, 2, 1, 6, 8, 5, 3, 4]`를 마지막 원소 4를 피벗으로 분할합니다. `i`는 "피벗보다 작은 구역"의 끝(다음 칸)입니다.

```text
피벗 = 4                                          작은 구역 = a[0..i)
j=0  7  2  1  6  8  5  3 [4]   7 ≥ 4 → 그대로          i=0
j=1  2  7  1  6  8  5  3 [4]   2 < 4 → a[0]과 교환     i=1
j=2  2  1  7  6  8  5  3 [4]   1 < 4 → a[1]과 교환     i=2
j=3  2  1  7  6  8  5  3 [4]   6 ≥ 4                   i=2
j=4  2  1  7  6  8  5  3 [4]   8 ≥ 4                   i=2
j=5  2  1  7  6  8  5  3 [4]   5 ≥ 4                   i=2
j=6  2  1  3  6  8  5  7 [4]   3 < 4 → a[2]와 교환     i=3
끝   2  1  3 [4] 8  5  7  6    피벗을 a[3]과 교환
     └작은┘ 피벗 └─ 크거나 같음 ─┘
```

피벗 4는 인덱스 3에 놓였고, 이 자리는 **정렬이 끝나도 바뀌지 않습니다.** 이제 `[2, 1, 3]`과 `[8, 5, 7, 6]`을 각각 같은 방법으로 정렬합니다.

## 4. 천천히 풀어보기

### 4.1 분할의 불변식

Lomuto 분할은 배열을 네 구역으로 나눠 생각합니다.

```text
 lo           i            j           hi
  ┌───────────┬────────────┬───────────┬───┐
  │ < 피벗    │ ≥ 피벗     │ 아직 안 봄 │ P │
  └───────────┴────────────┴───────────┴───┘
```

> **불변식**: `a[lo..i)`는 모두 피벗보다 작고, `a[i..j)`는 모두 피벗보다 크거나 같다.

j가 새 원소를 볼 때 그 원소가 피벗보다 작으면, "≥ 구역"의 첫 칸(a[i])과 교환하고 i를 늘립니다. 그러면 작은 구역이 한 칸 늘고 불변식이 유지됩니다. 크거나 같으면 j만 늘리면 됩니다. j가 끝(hi)에 닿으면 "아직 안 봄" 구역이 사라지고, 마지막으로 피벗을 a[i]와 바꿔 두 구역 **사이**에 놓습니다.

### 4.2 퀵 정렬 = 분할 + 두 번의 재귀

```text
quick_sort(a, lo, hi):
    lo >= hi 이면 (원소 0~1개) 끝
    p = partition(a, lo, hi)          ← 피벗이 a[p]에 확정
    quick_sort(a, lo, p - 1)          ← 피벗 왼쪽
    quick_sort(a, p + 1, hi)          ← 피벗 오른쪽 (피벗은 제외!)
```

재귀 호출에서 **피벗(p)을 빼는** 것이 중요합니다. 피벗을 포함하면 크기가 줄지 않는 호출이 생겨 끝나지 않을 수 있습니다. 퀵 정렬에는 병합 정렬의 "합치기" 단계가 없습니다. 두 재귀가 끝나면 배열은 이미 정렬되어 있습니다.

### 4.3 좋은 피벗, 나쁜 피벗

분할이 **절반 가까이** 나뉘면 병합 정렬처럼 log₂ n층이 되어 **O(n log n)** 입니다. 문제는 피벗이 **가장 작거나 가장 큰 값**일 때입니다.

```text
정렬된 입력 [1 2 3 4 5], 마지막 원소 피벗
  분할: [1 2 3 4] [5] []         ← 한쪽이 비었다
  분할: [1 2 3] [4] []
  분할: [1 2] [3] []
  분할: [1] [2] []
비교: 4 + 3 + 2 + 1 = 10 = n(n-1)/2   → O(n²)
```

매번 문제가 **1씩만** 줄어들어 n층이 됩니다. 정렬된 입력이나 거의 정렬된 입력은 실제로 아주 흔하므로 이 문제는 심각합니다. 해결 방법은 **피벗을 잘 고르는 것**입니다.

| 피벗 선택            | 정렬된 입력에서 | 설명                                        |
| -------------------- | --------------- | ------------------------------------------- |
| 마지막(또는 첫) 원소 | O(n²)           | 가장 단순하지만 흔한 입력에서 최악          |
| 가운데 원소          | O(n log n)      | 정렬된 입력에서 정확히 중앙값               |
| 세 값의 중앙값       | O(n log n)      | 첫·가운데·끝 중 가운데 값. 실무에서 흔히 씀 |
| 무작위 원소          | 평균 O(n log n) | 어떤 입력이든 최악이 나올 확률이 매우 낮음  |

어떤 방법도 최악의 경우를 **완전히** 없애지는 못합니다. 그래서 표준 라이브러리는 재귀가 너무 깊어지면 힙 정렬로 바꾸는 **인트로 정렬** 같은 방법으로 O(n log n)을 보장합니다.

### 4.4 불안정성과 재귀 깊이

- **불안정**: 분할은 작은 값을 멀리 떨어진 원소와 교환하므로, 같은 값의 상대 순서가 바뀔 수 있습니다(6절 카드 예제).
- **재귀 깊이**: 좋은 피벗이면 약 log₂ n, 최악이면 n입니다. 원소 10만 개가 최악이면 재귀가 10만 번 쌓여 호출 스택이 넘칠 수 있습니다. 더 작은 쪽을 먼저 재귀하고 큰 쪽은 반복문으로 처리하면 깊이를 O(log n)으로 제한할 수 있습니다.

## 5. C로 구현하기

C 프로그램은 작은 배열로 분할 과정을 출력하고, 원소 2,000개로 입력과 피벗 선택에 따른 비교 횟수를 비교합니다.

```c
// 파일: quick_sort.c
#include <stdio.h>

static long long comparisons = 0;
static int trace = 0;

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

void print_range(const int a[], int lo, int hi) {
    for (int i = lo; i <= hi; i++) {
        printf(" %d", a[i]);
    }
}

// Lomuto 분할: 마지막 원소를 피벗으로, 작은 값을 앞으로 모은다
int partition(int a[], int lo, int hi) {
    int pivot = a[hi];
    int i = lo;                         // a[lo..i) 는 피벗보다 작은 구역
    for (int j = lo; j < hi; j++) {
        comparisons++;
        if (a[j] < pivot) {
            swap(&a[i], &a[j]);
            i++;
        }
    }
    swap(&a[i], &a[hi]);                // 피벗을 두 구역 사이에 놓는다
    return i;                           // 피벗의 최종 위치
}

void quick_sort(int a[], int lo, int hi, int use_middle) {
    if (lo >= hi) {
        return;                         // 원소가 0개나 1개
    }
    if (use_middle) {
        swap(&a[lo + (hi - lo) / 2], &a[hi]);    // 가운데 원소를 피벗으로
    }
    int p = partition(a, lo, hi);
    if (trace) {
        printf("피벗 %2d →", a[p]);
        print_range(a, lo, p - 1);
        printf(" [%d]", a[p]);
        print_range(a, p + 1, hi);
        printf("\n");
    }
    quick_sort(a, lo, p - 1, use_middle);
    quick_sort(a, p + 1, hi, use_middle);
}

int main(void) {
    int a[] = {7, 2, 1, 6, 8, 5, 3, 4};
    int n = sizeof a / sizeof a[0];
    trace = 1;
    quick_sort(a, 0, n - 1, 0);
    printf("결과:");
    print_range(a, 0, n - 1);
    printf("\n비교 %lld번\n\n", comparisons);
    trace = 0;

    enum { N = 2000 };
    static int sorted_last[N], sorted_mid[N], mixed[N];
    unsigned x = 2024;
    for (int i = 0; i < N; i++) {
        sorted_last[i] = sorted_mid[i] = i;
        x = x * 1103515245u + 12345u;
        mixed[i] = (int)(x >> 16) % 10000;
    }
    comparisons = 0;
    quick_sort(mixed, 0, N - 1, 0);
    printf("n=%d 무작위, 마지막 피벗: 비교 %7lld\n", N, comparisons);
    comparisons = 0;
    quick_sort(sorted_mid, 0, N - 1, 1);
    printf("n=%d 정렬됨, 가운데 피벗: 비교 %7lld\n", N, comparisons);
    comparisons = 0;
    quick_sort(sorted_last, 0, N - 1, 0);
    printf("n=%d 정렬됨, 마지막 피벗: 비교 %7lld  (최악의 경우)\n", N, comparisons);
    return 0;
}
```

실행 결과:

```text
피벗  4 → 2 1 3 [4] 8 5 7 6
피벗  3 → 2 1 [3]
피벗  1 → [1] 2
피벗  6 → 5 [6] 7 8
피벗  8 → 7 [8]
결과: 1 2 3 4 5 6 7 8
비교 14번

n=2000 무작위, 마지막 피벗: 비교   24845
n=2000 정렬됨, 가운데 피벗: 비교   17964
n=2000 정렬됨, 마지막 피벗: 비교 1999000  (최악의 경우)
```

### 코드 한 부분씩 읽기

| 코드                                                            | 설명                                                                                                     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `int pivot = a[hi]; int i = lo;`                                | 마지막 원소를 피벗으로 삼고, 작은 구역은 비어 있는 상태(`a[lo..lo)`)로 시작합니다.                       |
| `if (a[j] < pivot) { swap(&a[i], &a[j]); i++; }`                | 4.1절의 불변식을 지키는 핵심 두 줄입니다. `<`로 비교하므로 피벗과 같은 값은 오른쪽 구역에 남습니다.      |
| `swap(&a[i], &a[hi]); return i;`                                | 피벗을 두 구역 사이에 놓고 그 위치를 돌려줍니다. 이 교환을 빠뜨리면 결과가 틀립니다(실습의 디버그 문제). |
| `quick_sort(a, lo, p - 1, ...); quick_sort(a, p + 1, hi, ...);` | 피벗을 **빼고** 양쪽을 정렬합니다. `p - 1 < lo`인 빈 구간은 `lo >= hi` 검사에서 바로 끝납니다.           |
| `swap(&a[lo + (hi - lo) / 2], &a[hi]);`                         | 가운데 원소를 끝으로 옮긴 뒤 같은 분할 코드를 씁니다. 피벗 선택만 바꾸면 되고 분할 코드는 그대로입니다.  |
| `static long long comparisons`                                  | 모든 재귀 호출이 함께 세는 전역 카운터입니다. 파일 밖에서 보이지 않도록 `static`을 붙였습니다.           |
| `x = x * 1103515245u + 12345u;`                                 | Day 74와 같은 의사 난수입니다. 실행할 때마다 같은 "무작위" 배열이 만들어져 결과를 검증할 수 있습니다.    |

마지막 세 줄이 오늘의 핵심입니다. 정렬된 2,000개에서 마지막 원소를 피벗으로 쓰면 199만 9천 번 비교하지만(2000 × 1999 / 2), 가운데 원소를 피벗으로 쓰면 1만 8천 번이면 됩니다. **같은 알고리즘인데 피벗 선택 하나로 100배 넘게 차이** 납니다. 무작위 입력에서는 마지막 피벗도 잘 동작합니다(약 2.5만 번).

## 6. Python으로 구현하기

Python 버전은 가운데 원소를 피벗으로 쓰는 제자리 퀵 정렬로 분할 과정을 들여쓰기로 보여 줍니다. 이해하기 쉬운 "새 리스트를 만드는" 버전과 비교하고, 퀵 정렬이 **불안정**하다는 것을 카드로 확인합니다.

```python
# 파일: quick_sort.py
def partition(a, lo, hi):
    """Lomuto 분할. 피벗 a[hi]보다 작은 값을 앞으로 모으고 피벗 위치를 돌려준다."""
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i


def quick_sort(a, lo=0, hi=None, depth=0):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    mid = (lo + hi) // 2
    a[mid], a[hi] = a[hi], a[mid]           # 가운데를 피벗으로 (정렬된 입력 대비)
    p = partition(a, lo, hi)
    print("  " * depth + f"{a[lo:p]} [{a[p]}] {a[p + 1:hi + 1]}")
    quick_sort(a, lo, p - 1, depth + 1)
    quick_sort(a, p + 1, hi, depth + 1)
    return a


def quick_sort_simple(items):
    """이해하기 쉬운 버전: 새 리스트를 만든다 (제자리가 아님)"""
    if len(items) <= 1:
        return items
    pivot = items[len(items) // 2]
    smaller = [x for x in items if x < pivot]
    equal = [x for x in items if x == pivot]
    larger = [x for x in items if x > pivot]
    return quick_sort_simple(smaller) + equal + quick_sort_simple(larger)


def quick_sort_by(a, key, lo=0, hi=None):
    """key로 비교하는 제자리 퀵 정렬(가운데 피벗, Lomuto 분할)"""
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    mid = (lo + hi) // 2
    a[mid], a[hi] = a[hi], a[mid]
    pivot, i = key(a[hi]), lo
    for j in range(lo, hi):
        if key(a[j]) < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort_by(a, key, lo, i - 1)
    quick_sort_by(a, key, i + 1, hi)
    return a


data = [7, 2, 1, 6, 8, 5, 3, 4]
print("결과:", quick_sort(data[:]))
print("간단한 버전:", quick_sort_simple([3, 6, 3, 1, 8, 3, 2]))
cards = [(5, "♠"), (3, "♥"), (5, "♦"), (1, "♣"), (3, "♠")]
print("퀵 정렬(숫자만 비교):", quick_sort_by(cards[:], key=lambda c: c[0]))
print("안정 정렬 sorted:   ", sorted(cards, key=lambda c: c[0]))
```

실행 결과:

```text
[2, 1, 4, 5, 3] [6] [8, 7]
  [2, 1, 3] [4] [5]
    [] [1] [3, 2]
      [2] [3] []
  [7] [8] []
결과: [1, 2, 3, 4, 5, 6, 7, 8]
간단한 버전: [1, 2, 3, 3, 3, 6, 8]
퀵 정렬(숫자만 비교): [(1, '♣'), (3, '♠'), (3, '♥'), (5, '♦'), (5, '♠')]
안정 정렬 sorted:    [(1, '♣'), (3, '♥'), (3, '♠'), (5, '♠'), (5, '♦')]
```

### 코드 한 부분씩 읽기

| 코드                                                            | 설명                                                                                                                                                           |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a[mid], a[hi] = a[hi], a[mid]`                                 | 가운데 원소를 피벗 자리로 옮깁니다. 첫 분할의 피벗이 6(가운데 인덱스 3의 값)인 이유입니다.                                                                     |
| `print("  " * depth + f"{a[lo:p]} [{a[p]}] {a[p + 1:hi + 1]}")` | 분할 결과를 "작은 구역 [피벗] 큰 구역"으로 보여 줍니다. 첫 줄의 `[2, 1, 4, 5, 3]`은 6보다 작은 값들이지만 **아직 정렬되지 않았습니다.**                        |
| `if hi is None: hi = len(a) - 1`                                | 기본값을 `hi=len(a)-1`로 쓸 수는 없습니다(기본값은 함수를 정의할 때 한 번 계산되고, 그때는 a가 없습니다). None을 기본값으로 두고 안에서 계산하는 관용구입니다. |
| `quick_sort_simple`의 세 리스트                                 | 피벗보다 작은 것, 같은 것, 큰 것을 **새 리스트**로 모읍니다. 읽기 쉽고 같은 값이 많아도 강하지만, 추가 공간이 O(n)이고 리스트를 계속 만들어 느립니다.          |
| `equal = [x for x in items if x == pivot]`                      | 피벗과 같은 값을 따로 모아 다시 정렬하지 않습니다. 3이 세 번 나오는 입력도 문제없습니다. 실습의 세 구역 분할과 같은 아이디어입니다.                            |
| `quick_sort_by(cards[:], key=lambda c: c[0])`                   | 숫자로만 비교합니다. 결과에서 **3♠이 3♥보다 앞**, **5♦가 5♠보다 앞**으로 원래 순서와 바뀌었습니다. 안정 정렬(`sorted`)은 원래 순서를 지킵니다.                 |

## 7. Rust로 구현하기

Rust 버전은 슬라이스를 받아 분할한 뒤 `split_at_mut`으로 **겹치지 않는 두 부분**으로 나눠 재귀합니다. 가운데 원소를 피벗으로 써서 정렬된 10만 개도 빠르게 정렬합니다.

```rust
// 파일: quick_sort.rs
fn partition<T: Ord>(a: &mut [T]) -> usize {
    let last = a.len() - 1;
    let mid = a.len() / 2;
    a.swap(mid, last);                  // 가운데 원소를 피벗 자리(끝)로
    let mut i = 0;
    for j in 0..last {
        if a[j] < a[last] {
            a.swap(i, j);
            i += 1;
        }
    }
    a.swap(i, last);
    i
}

fn quick_sort<T: Ord>(a: &mut [T]) {
    if a.len() <= 1 {
        return;
    }
    let p = partition(a);
    let (left, right) = a.split_at_mut(p);   // left = a[..p], right = a[p..]
    quick_sort(left);
    quick_sort(&mut right[1..]);             // right[0]은 피벗, 이미 제자리
}

fn main() {
    let mut numbers = vec![7, 2, 1, 6, 8, 5, 3, 4];
    quick_sort(&mut numbers);
    println!("숫자: {:?}", numbers);

    let mut words = vec!["kiwi", "apple", "mango", "fig", "banana", "cherry"];
    quick_sort(&mut words);
    println!("단어: {:?}", words);

    let mut sorted_input: Vec<u32> = (0..100_000).collect();
    quick_sort(&mut sorted_input);          // 가운데 피벗이라 정렬된 입력도 빠르다
    println!("정렬된 10만 개: {}", sorted_input.windows(2).all(|w| w[0] <= w[1]));

    let mut dup = vec![3, 1, 3, 3, 2, 3, 1];
    quick_sort(&mut dup);
    println!("중복 많은 입력: {:?}", dup);

    let mut std_version = vec![7, 2, 1, 6, 8, 5, 3, 4];
    std_version.sort_unstable();             // 표준 불안정 정렬(퀵 정렬 계열)
    println!("sort_unstable: {:?}", std_version);
}
```

실행 결과:

```text
숫자: [1, 2, 3, 4, 5, 6, 7, 8]
단어: ["apple", "banana", "cherry", "fig", "kiwi", "mango"]
정렬된 10만 개: true
중복 많은 입력: [1, 1, 2, 3, 3, 3, 3]
sort_unstable: [1, 2, 3, 4, 5, 6, 7, 8]
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fn partition<T: Ord>(a: &mut [T]) -> usize` | 슬라이스 전체를 분할하고 피벗의 위치를 돌려줍니다. 인덱스가 슬라이스 기준이라 lo, hi를 따로 넘길 필요가 없습니다.                                                                    |
| `a.swap(mid, last);`                         | 가운데 원소를 끝으로 옮겨 피벗으로 씁니다. 원소를 **옮기지 않고 교환만** 하므로 `T`가 복사 가능한 타입일 필요가 없습니다(`String`도 정렬 가능).                                      |
| `if a[j] < a[last]`                          | 피벗 값을 변수에 꺼내면(`let pivot = a[last]`) `T`의 소유권을 옮겨야 합니다. 대신 비교할 때마다 `a[last]`를 **빌려서** 읽습니다. 피벗은 반복이 끝날 때까지 끝자리에 그대로 있습니다. |
| `let (left, right) = a.split_at_mut(p);`     | 하나의 가변 슬라이스를 `a[..p]`와 `a[p..]` 두 개의 가변 슬라이스로 나눕니다. 겹치지 않는다는 것을 보장하는 표준 함수라, 두 부분을 동시에 가변으로 빌릴 수 있습니다.                  |
| `quick_sort(&mut right[1..]);`               | `right[0]`이 피벗이라 제외하고 나머지만 정렬합니다.                                                                                                                                  |
| `(0..100_000).collect()` 정렬                | 정렬된 10만 개도 가운데 피벗 덕분에 재귀 깊이가 약 17로 얕습니다. 마지막 원소 피벗이었다면 깊이 10만의 재귀로 **스택이 넘쳤을** 것입니다.                                            |
| `std_version.sort_unstable();`               | 표준 라이브러리의 불안정 정렬입니다. 퀵 정렬을 개선한 알고리즘(pattern-defeating quicksort 계열)으로, 최악의 경우를 피하는 장치가 들어 있어 안정 정렬 `sort()`보다 보통 빠릅니다.    |

> **참고**: 같은 값이 많은 입력 `[3, 1, 3, 3, 2, 3, 1]`도 올바르게 정렬되었습니다. 다만 Lomuto 분할은 피벗과 같은 값을 모두 한쪽으로 보내므로, 모든 값이 같은 배열에서는 다시 O(n²)이 됩니다. 이 문제는 실습의 **세 구역 분할**로 해결합니다.

## 8. 실행 추적

C 프로그램의 재귀 호출을 트리로 따라가며 비교 횟수 14번이 어디서 나왔는지 봅니다. 분할 한 번의 비교 횟수는 **구간 길이 - 1**입니다.

| 호출 구간(값)     | 길이 | 피벗 |   비교 | 분할 결과             |
| ----------------- | ---: | ---: | -----: | --------------------- |
| [7 2 1 6 8 5 3 4] |    8 |    4 |      7 | [2 1 3] [4] [8 5 7 6] |
| [2 1 3]           |    3 |    3 |      2 | [2 1] [3] []          |
| [2 1]             |    2 |    1 |      1 | [] [1] [2]            |
| [8 5 7 6]         |    4 |    6 |      3 | [5] [6] [7 8]         |
| [7 8]             |    2 |    8 |      1 | [7] [8] []            |
|                   |      |      | **14** |                       |

첫 분할이 3개와 4개로 **거의 절반**에 나뉘었기 때문에 빨랐습니다. 입력이 `[1 2 3 4 5 6 7 8]`이었다면 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28번이었을 것입니다.

## 9. 다른 예제로 다시 이해하기

분할의 성질을 이용하면 배열 전체를 정렬하지 않고도 **k번째로 작은 값**을 찾을 수 있습니다. 분할이 끝나면 피벗이 **최종 위치 p**에 놓이므로, k가 p와 같으면 피벗이 답이고, k가 p보다 작으면 **왼쪽 부분만**, 크면 **오른쪽 부분만** 더 보면 됩니다. 퀵 정렬은 양쪽을 모두 재귀하지만 퀵 선택은 **한쪽만** 따라가므로, 평균적으로 n + n/2 + n/4 + … ≈ 2n번의 일로 끝나 **O(n)** 입니다. 중앙값, 상위 10% 경계값, 이상치 찾기처럼 "정렬은 필요 없고 특정 순위의 값만 알고 싶을 때" 씁니다.

```python
# 파일: quickselect.py
def quickselect(a, k):
    """a에서 k번째(0부터)로 작은 값. a의 순서를 바꾼다."""
    lo, hi = 0, len(a) - 1
    rounds = 0
    while True:
        rounds += 1
        mid = (lo + hi) // 2
        a[mid], a[hi] = a[hi], a[mid]
        pivot, i = a[hi], lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        if i == k:
            return a[i], rounds
        if k < i:
            hi = i - 1             # 답은 왼쪽에만 있다
        else:
            lo = i + 1             # 답은 오른쪽에만 있다


scores = [72, 95, 64, 88, 91, 55, 79, 83, 67]
median, rounds = quickselect(scores[:], len(scores) // 2)
print(f"중앙값 {median} (분할 {rounds}번), 정렬로 확인: {sorted(scores)[len(scores) // 2]}")
for k in [0, 2, 8]:
    value, _ = quickselect(scores[:], k)
    print(f"{k}번째로 작은 값: {value}")
```

실행 결과:

```text
중앙값 79 (분할 4번), 정렬로 확인: 79
0번째로 작은 값: 55
2번째로 작은 값: 67
8번째로 작은 값: 95
```

Rust 표준 라이브러리에는 이 알고리즘이 `select_nth_unstable`로 들어 있습니다. k번째 자리에 올 값을 그 자리에 놓고, 그 왼쪽에는 작거나 같은 값, 오른쪽에는 크거나 같은 값을 모아 줍니다.

```rust
// 파일: select_nth.rs
fn main() {
    let mut scores = vec![72, 95, 64, 88, 91, 55, 79, 83, 67];
    let k = scores.len() / 2;
    let (smaller, median, larger) = scores.select_nth_unstable(k);
    let median = *median;
    let mut smaller = smaller.to_vec();
    let mut larger = larger.to_vec();
    smaller.sort();
    larger.sort();
    println!("중앙값 {median}");
    println!("더 작은 값들 {:?}, 더 큰 값들 {:?}", smaller, larger);
}
```

실행 결과:

```text
중앙값 79
더 작은 값들 [55, 64, 67, 72], 더 큰 값들 [83, 88, 91, 95]
```

`select_nth_unstable`이 돌려주는 양쪽 부분은 **정렬되어 있지 않습니다.** 출력을 보기 좋게 하려고 따로 정렬했을 뿐입니다. Python에서는 `heapq.nsmallest`나 `statistics.median`을 쓸 수 있지만, 퀵 선택처럼 평균 O(n)인 표준 함수는 없습니다.

## 10. 시간·공간 복잡도

| 항목                   | 퀵 정렬                             | 병합 정렬  | 삽입 정렬 |
| ---------------------- | ----------------------------------- | ---------- | --------- |
| 최선                   | O(n log n)                          | O(n log n) | O(n)      |
| 평균                   | O(n log n)                          | O(n log n) | O(n²)     |
| 최악                   | **O(n²)** (나쁜 피벗)               | O(n log n) | O(n²)     |
| 추가 공간              | 재귀 깊이: 평균 O(log n), 최악 O(n) | O(n)       | O(1)      |
| 안정?                  | 아니요                              | 예         | 예        |
| 실제 속도(무작위 입력) | 대체로 가장 빠름                    | 빠름       | 느림      |
| 퀵 선택(k번째 값)      | 평균 O(n), 최악 O(n²)               |            |           |

## 11. 세 언어 비교

| 관점         | C                                         | Python                          | Rust                                        |
| ------------ | ----------------------------------------- | ------------------------------- | ------------------------------------------- |
| 구간 표현    | 배열 + 인덱스 `lo, hi`(닫힌 구간)         | 리스트 + 인덱스                 | 슬라이스 자체, `split_at_mut`으로 나눔      |
| 교환         | `swap(&a[i], &a[j])` 포인터               | `a[i], a[j] = a[j], a[i]`       | `a.swap(i, j)`                              |
| 피벗 값 읽기 | `int pivot = a[hi];` 복사                 | `pivot = a[hi]`(참조)           | 복사하지 않고 `a[last]`를 빌려 비교         |
| 표준 정렬    | `qsort`(보통 퀵 정렬 계열, 불안정)        | `sorted`(Timsort, 안정)         | `sort_unstable`(퀵 정렬 계열), `sort`(안정) |
| k번째 값     | 직접 구현                                 | 직접 구현 / `heapq.nsmallest`   | `select_nth_unstable`                       |
| 깊은 재귀    | 스택 넘침(정의되지 않은 동작 수준의 충돌) | `RecursionError` (기본 약 1000) | 스택 넘침으로 프로그램 종료                 |

## 12. 자주 하는 실수

### 실수 1: 분할 뒤 피벗을 제자리에 놓지 않는다

실습의 디버그 문제입니다. 작은 값을 앞으로 모으기만 하고 피벗을 `a[i]`로 옮기지 않으면, 돌려준 위치에 피벗이 없어서 "왼쪽은 작고 오른쪽은 크다"는 약속이 깨집니다.

### 실수 2: 재귀에 피벗을 포함한다

`quick_sort(a, lo, p)`처럼 피벗까지 포함하면, 피벗이 구간의 마지막이자 가장 큰 값일 때 같은 구간이 끝없이 다시 호출될 수 있습니다. 피벗은 **이미 제자리**이므로 반드시 빼세요.

### 실수 3: 정렬된 입력에 마지막 원소 피벗을 쓴다

```python
# 파일: deep_recursion.py (실행 오류: RecursionError)
def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)


data = list(range(3000))           # 이미 정렬됨
quick_sort(data, 0, len(data) - 1)
```

```text
RecursionError: maximum recursion depth exceeded
```

정렬된 3,000개는 재귀가 3,000번 쌓여 Python의 재귀 한도를 넘습니다. 느린 것(O(n²))을 넘어 **프로그램이 멈춥니다.** 가운데 원소나 세 값의 중앙값으로 피벗을 고르세요.

### 실수 4: 같은 값이 많은 입력을 고려하지 않는다

모든 값이 같은 배열에서 Lomuto 분할은 모든 원소를 한쪽으로 보냅니다(`<` 비교에서 모두 거짓). 가운데 피벗을 써도 O(n²)입니다. 같은 값이 많을 수 있다면 **세 구역 분할**(실습의 직접 구현 문제)을 쓰세요.

### 실수 5: 안정성이 필요한 곳에 퀵 정렬을 쓴다

이름순으로 정렬한 명단을 점수로 다시 정렬할 때, 같은 점수 안에서 이름순이 유지되기를 기대했다면 퀵 정렬은 부적합합니다. Python의 `sorted`, Rust의 `sort`처럼 **안정 정렬**을 쓰세요.

## 13. Q&A

**Q. Lomuto 분할 말고 Hoare 분할도 있다던데요?**

A. Hoare 분할은 포인터 두 개를 **양 끝에서** 가운데로 움직이며, 왼쪽에서 피벗보다 크거나 같은 값과 오른쪽에서 작거나 같은 값을 찾아 서로 교환합니다. 교환 횟수가 Lomuto보다 약 3배 적고 같은 값이 많을 때도 더 잘 나뉘어 실무에서 더 많이 씁니다. 대신 피벗이 최종 위치에 놓인다는 보장이 없어서 재귀 범위를 정하는 규칙이 조금 다르고, 처음 배울 때는 Lomuto가 이해하기 쉽습니다.

**Q. 그러면 퀵 정렬과 병합 정렬 중 무엇을 써야 하나요?**

A. 직접 구현할 일은 거의 없습니다. 언어의 표준 정렬을 쓰세요. 표준 라이브러리들이 고른 방법을 보면 답이 보입니다. 안정성이 필요한 기본 정렬은 병합 정렬 계열(Timsort, Rust `sort`), 안정성이 필요 없고 메모리를 아끼고 싶을 때는 퀵 정렬 계열(C++ `std::sort`, Rust `sort_unstable`)입니다.

**Q. 무작위 피벗이면 정말 안전한가요?**

A. 어떤 입력이든 **평균** O(n log n)이 보장되고, O(n²)이 나올 확률은 원소가 많을수록 극히 작아집니다. 악의적인 사용자가 "마지막 원소 피벗"을 알고 최악의 입력을 보내는 공격도 막을 수 있습니다. 단, 난수를 만드는 비용과 결과가 매번 달라진다는 점(디버깅이 어려움)이 있습니다.

**Q. 퀵 정렬의 이름은 왜 '퀵'인가요?**

A. 1960년 토니 호어가 만들 때 당시 알려진 정렬들보다 실제로 **빨랐기** 때문입니다. 지금도 무작위 입력에서는 비교 정렬 중 가장 빠른 편에 속합니다. 분할이 배열을 차례로 훑어 CPU 캐시를 잘 활용하고, 교환 외의 부가 작업이 거의 없기 때문입니다.

## 14. 핵심 요약

- 퀵 정렬은 **피벗을 기준으로 분할**한 뒤 양쪽을 재귀로 정렬합니다. 합치는 단계는 없습니다.
- **Lomuto 분할**: `a[lo..i)`는 피벗보다 작다는 불변식을 지키며 한 번 훑고, 마지막에 피벗을 `a[i]`에 놓습니다.
- 재귀할 때는 **피벗을 빼고** 양쪽만 정렬합니다.
- 피벗이 절반 근처에서 나누면 **O(n log n)**, 한쪽 끝이면 **O(n²)** 입니다. 정렬된 입력에서 마지막 원소 피벗은 최악입니다.
- **가운데 원소, 세 값의 중앙값, 무작위** 피벗으로 최악의 경우를 피합니다. 같은 값이 많으면 **세 구역 분할**을 씁니다.
- 제자리 정렬이고 실제로 빠르지만 **불안정**합니다.
- 분할 후 한쪽만 따라가는 **퀵 선택**은 k번째 작은 값을 평균 **O(n)** 에 찾습니다.

## 15. 도전 문제

1. **(C)** 피벗을 `rand() % (hi - lo + 1) + lo`로 무작위로 고르는 퀵 정렬을 만들고, 정렬된 입력 2,000개에서 비교 횟수를 여러 번 재어 보세요. `srand`의 씨앗을 바꾸면 결과가 어떻게 달라지나요?
2. **(Python)** 13절의 Hoare 분할을 구현하고, 같은 입력에서 Lomuto 분할과 **교환 횟수**를 비교해 보세요.
3. **(Rust)** 재귀를 한쪽만 쓰고 다른 쪽은 반복문으로 바꿔, 항상 **더 작은 쪽을 재귀**하도록 퀵 정렬을 고치세요. 재귀 깊이의 최댓값을 세어 log₂ n 정도인지 확인하세요.
4. **(세 언어)** 퀵 선택으로 원소 10만 개의 중앙값을 구하는 것과, 정렬한 뒤 가운데 값을 읽는 것의 비교 횟수를 비교해 보세요.
