---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-73-insertion-sort
courseId: crp-92
phaseId: phase-07
dayNumber: 73
date: "2026-12-12"
title: 삽입 정렬 — 정렬된 앞부분에 하나씩 끼워 넣기
summary: 카드를 손에 쥐고 정리하듯 정렬된 앞부분을 한 칸씩 늘려 가는 삽입 정렬을 C, Python, Rust로 구현합니다. 불변식, 비교·이동 횟수, 입력 모양에 따른 최선 O(n)과 최악 O(n²), 안정 정렬의 뜻을 확인하고, 키 함수로 원하는 기준 정렬을 만든 뒤 선택 정렬·버블 정렬과 비교합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-72-binary-search]
learningObjectives:
  - 삽입 정렬의 불변식(앞의 i칸은 항상 정렬되어 있다)을 설명하고 단계별 배열을 추적한다.
  - 큰 값을 오른쪽으로 밀고 빈자리에 값을 넣는 방식을 세 언어로 구현한다.
  - 이미 정렬된 입력은 O(n), 거꾸로 정렬된 입력은 O(n²)인 이유를 비교 횟수로 설명한다.
  - 안정 정렬의 뜻을 알고, 같은 키의 원래 순서가 유지되는지 확인한다.
  - 키 함수와 비교 기준으로 정렬을 바꾸고, 선택 정렬·버블 정렬과 비용을 비교한다.
concepts:
  [
    insertion sort,
    sorted prefix,
    invariant,
    shift,
    stable sort,
    in-place,
    key function,
    selection sort,
    bubble sort,
    inversion,
  ]
runnerMode: python
playgroundSource: |
  # 파일: insertion.py — 배열을 바꿔 한 단계씩 확인해 보세요.
  a = [5, 2, 4, 6, 1, 3]
  for i in range(1, len(a)):
      key = a[i]
      j = i - 1
      while j >= 0 and a[j] > key:
          a[j + 1] = a[j]
          j -= 1
      a[j + 1] = key
      print(f"i={i}: {a[:i + 1]} | {a[i + 1:]}")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day73-predict-py
    title: 두 번째 단계까지 추적하기
    kind: predict
    objective: 정렬된 앞부분이 한 칸씩 늘어나는 모습을 추적한다.
    prompt: "i = 1, 2 두 단계를 마친 뒤의 배열을 예측하세요."
    starter: |-
      a = [7, 3, 9, 1, 5]
      for i in range(1, 3):
          key = a[i]
          j = i - 1
          while j >= 0 and a[j] > key:
              a[j + 1] = a[j]
              j -= 1
          a[j + 1] = key
      print(a)
    answer: "[3, 7, 9, 1, 5]"
    hint: "i = 1에서 3이 7 앞으로 들어가 [3, 7, ...]가 됩니다. i = 2의 9는 7보다 크므로 움직이지 않습니다. 반복은 i = 2까지만 돕니다."
    explanation: "두 단계가 끝나면 앞의 세 칸 [3, 7, 9]만 정렬되어 있고, 뒤의 1과 5는 아직 손대지 않았습니다. 삽입 정렬은 매 단계마다 정렬된 앞부분을 한 칸씩 늘립니다."
    commonMistakes:
      - "반복이 끝까지 돈다고 생각해 [1, 3, 5, 7, 9]로 적음"
      - "9를 앞으로 옮겨야 한다고 생각함(9는 이미 제자리)"
    language: python
    verification: run
  - id: ex-day73-predict-c
    title: 이동 횟수 예측하기
    kind: predict
    objective: 이동 횟수가 뒤바뀐 쌍의 개수와 같다는 것을 확인한다.
    prompt: 두 배열을 정렬할 때의 이동 횟수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int sort_shifts(int a[], int n) {
          int shifts = 0;
          for (int i = 1; i < n; i++) {
              int key = a[i], j = i - 1;
              while (j >= 0 && a[j] > key) {
                  a[j + 1] = a[j];
                  j--;
                  shifts++;
              }
              a[j + 1] = key;
          }
          return shifts;
      }

      int main(void) {
          int x[] = {1, 2, 3, 4};
          int y[] = {4, 3, 2, 1};
          printf("%d %d\n", sort_shifts(x, 4), sort_shifts(y, 4));
          return 0;
      }
    answer: "0 6"
    hint: "이미 정렬된 배열은 아무것도 밀 필요가 없습니다. 거꾸로 된 배열에서는 3이 1칸, 2가 2칸, 1이 3칸 이동합니다."
    explanation: "이동 횟수는 '앞에 있는데 더 큰' 쌍(뒤바뀐 쌍, inversion)의 개수와 같습니다. [4, 3, 2, 1]은 모든 쌍 6개가 뒤바뀌어 있어 4×3/2 = 6번입니다. n개가 거꾸로면 n(n-1)/2번이라 O(n²)입니다."
    commonMistakes:
      - "거꾸로 된 배열도 n번(4)만 이동한다고 생각함"
      - "정렬된 배열에서도 비교 횟수만큼 이동한다고 생각함"
    language: c
    verification: run
  - id: ex-day73-fill
    title: Rust 삽입 정렬의 반복 조건 채우기
    kind: fill
    objective: 왼쪽 값이 더 큰 동안만 교환하며 왼쪽으로 이동한다.
    prompt: "while 조건의 빈칸을 채우세요. j가 0보다 크고, 왼쪽 원소가 현재 원소보다 클 때만 교환해야 합니다."
    starter: |-
      fn insertion_sort(a: &mut [i32]) {
          for i in 1..a.len() {
              let mut j = i;
              while _____ {
                  a.swap(j - 1, j);
                  j -= 1;
              }
          }
      }

      fn main() {
          let mut v = vec![9, 4, 7, 1, 8, 2];
          insertion_sort(&mut v);
          println!("{:?}", v);
      }
    answer: |-
      fn insertion_sort(a: &mut [i32]) {
          for i in 1..a.len() {
              let mut j = i;
              while j > 0 && a[j - 1] > a[j] {
                  a.swap(j - 1, j);
                  j -= 1;
              }
          }
      }

      fn main() {
          let mut v = vec![9, 4, 7, 1, 8, 2];
          insertion_sort(&mut v);
          println!("{:?}", v);
      }
    output: "[1, 2, 4, 7, 8, 9]"
    hint: "j > 0을 먼저 검사해야 a[j - 1]에서 j - 1이 음수(usize에서는 넘침)가 되지 않습니다. &&는 앞이 거짓이면 뒤를 계산하지 않습니다."
    explanation: "조건의 순서가 중요합니다. j > 0을 뒤에 쓰면 j = 0일 때 a[j - 1]을 먼저 계산해 usize 넘침으로 panic합니다. 교환 방식은 C의 '밀고 한 번 쓰기'보다 대입이 많지만, 소유권을 옮기지 않고 제자리에서 정렬할 수 있어 Rust에서 간단합니다."
    commonMistakes:
      - "a[j - 1] > a[j] && j > 0 순서로 써서 j = 0에서 panic을 일으킴"
      - ">=로 비교해 같은 값끼리도 교환해 안정성을 잃음"
    language: rust
    verification: run
  - id: ex-day73-modify
    title: Python 삽입 정렬을 내림차순으로 바꾸기
    kind: modify
    objective: 비교 방향 하나로 정렬 순서가 바뀐다는 것을 확인하고 reverse 매개변수를 추가한다.
    prompt: "insertion_sort(items, reverse=False)가 reverse=True일 때 내림차순으로 정렬하도록 고치세요. 같은 값의 원래 순서(안정성)는 유지해야 합니다."
    starter: |-
      def insertion_sort(items):
          for i in range(1, len(items)):
              current = items[i]
              j = i - 1
              while j >= 0 and items[j] > current:
                  items[j + 1] = items[j]
                  j -= 1
              items[j + 1] = current
          return items


      print(insertion_sort([3, 1, 4, 1, 5]))
    answer: |-
      def insertion_sort(items, reverse=False):
          def out_of_order(left, right):
              return left < right if reverse else left > right

          for i in range(1, len(items)):
              current = items[i]
              j = i - 1
              while j >= 0 and out_of_order(items[j], current):
                  items[j + 1] = items[j]
                  j -= 1
              items[j + 1] = current
          return items


      print(insertion_sort([3, 1, 4, 1, 5]), insertion_sort([3, 1, 4, 1, 5], reverse=True))
      pairs = [(2, "a"), (1, "b"), (2, "c")]
      print(insertion_sort(pairs[:], reverse=True))
    output: |-
      [1, 1, 3, 4, 5] [5, 4, 3, 1, 1]
      [(2, 'c'), (2, 'a'), (1, 'b')]
    hint: "'왼쪽이 오른쪽보다 크면 민다'가 오름차순입니다. 내림차순은 '왼쪽이 오른쪽보다 작으면 민다'입니다. 같을 때는 밀지 않아야 안정 정렬입니다."
    explanation: "숫자는 [5, 4, 3, 1, 1]이 됩니다. 튜플은 첫 값이 같으면 두 번째 값까지 비교하므로 (2, 'c') > (2, 'a')라서 c가 앞으로 옵니다. 이것은 안정성이 깨진 것이 아니라 튜플 전체를 비교했기 때문입니다. 첫 값만 기준으로 하려면 key 함수를 써야 합니다."
    commonMistakes:
      - "<=로 바꿔 같은 값끼리도 자리를 바꿈(안정성이 깨짐)"
      - "정렬 후 결과를 뒤집어 내림차순을 만들어 같은 값의 순서가 거꾸로 됨"
    language: python
    verification: run
  - id: ex-day73-debug
    title: C 삽입 정렬의 덮어쓰기 버그 고치기
    kind: debug
    objective: 밀기 전에 끼워 넣을 값을 따로 저장해야 한다는 것을 확인한다.
    prompt: "이 코드는 key를 저장하지 않고 a[i]를 계속 읽어서, 값을 밀다가 원래 값을 덮어씁니다. 정렬 결과가 1 2 3 4 5가 되게 고치세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {4, 5, 1, 3, 2};
          int n = 5;
          for (int i = 1; i < n; i++) {
              int j = i - 1;
              while (j >= 0 && a[j] > a[i]) {
                  a[j + 1] = a[j];
                  j--;
              }
              a[j + 1] = a[i];
          }
          for (int i = 0; i < n; i++) printf("%d ", a[i]);
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {4, 5, 1, 3, 2};
          int n = 5;
          for (int i = 1; i < n; i++) {
              int key = a[i];
              int j = i - 1;
              while (j >= 0 && a[j] > key) {
                  a[j + 1] = a[j];
                  j--;
              }
              a[j + 1] = key;
          }
          for (int i = 0; i < n; i++) printf("%d ", a[i]);
          printf("\n");
          return 0;
      }
    output: "1 2 3 4 5"
    starterOutput: "4 5 5 5 5"
    hint: "첫 번째 밀기 a[j + 1] = a[j]에서 j + 1 == i이므로 a[i]가 덮어써집니다. 반복을 시작하기 전에 a[i]를 key에 복사해 두세요."
    explanation: "원래 코드는 1을 끼우려다 a[2]를 5로 덮어써서 1을 잃어버립니다. 그 뒤로도 값이 계속 덮어써져 결과가 4 5 5 5 5가 됩니다. 제자리 알고리즘에서는 '덮어쓰기 전에 필요한 값을 먼저 저장한다'가 기본 원칙입니다."
    commonMistakes:
      - "key를 저장했지만 while 조건에서 여전히 a[i]와 비교함"
      - "마지막 대입을 a[j] = key로 써서 한 칸 어긋나게 넣음"
    language: c
    verification: run
  - id: ex-day73-independent
    title: Rust로 뒤바뀐 쌍(inversion) 세기
    kind: independent
    objective: 삽입 정렬의 교환 횟수가 입력의 무질서한 정도와 같다는 것을 확인한다.
    prompt: "배열의 뒤바뀐 쌍(i < j인데 a[i] > a[j]) 개수를 두 겹 반복으로 직접 센 값과, 삽입 정렬의 교환 횟수가 같은지 확인하세요. [3, 1, 2], [5, 4, 3, 2, 1], [1, 3, 2, 4]에 대해 2 2 / 10 10 / 1 1이 출력되어야 합니다."
    starter: |-
      fn main() {
          let inputs = [vec![3, 1, 2], vec![5, 4, 3, 2, 1], vec![1, 3, 2, 4]];
          println!("{}", inputs.len());
      }
    answer: |-
      fn count_inversions(a: &[i32]) -> usize {
          let mut count = 0;
          for i in 0..a.len() {
              for j in i + 1..a.len() {
                  if a[i] > a[j] {
                      count += 1;
                  }
              }
          }
          count
      }

      fn insertion_swaps(a: &mut [i32]) -> usize {
          let mut swaps = 0;
          for i in 1..a.len() {
              let mut j = i;
              while j > 0 && a[j - 1] > a[j] {
                  a.swap(j - 1, j);
                  swaps += 1;
                  j -= 1;
              }
          }
          swaps
      }

      fn main() {
          let inputs = [vec![3, 1, 2], vec![5, 4, 3, 2, 1], vec![1, 3, 2, 4]];
          for input in inputs {
              let inversions = count_inversions(&input);
              let mut copy = input.clone();
              let swaps = insertion_swaps(&mut copy);
              println!("{inversions} {swaps}");
          }
      }
    output: |-
      2 2
      10 10
      1 1
    hint: "교환 한 번은 이웃한 뒤바뀐 쌍 하나를 바로잡습니다. 그래서 교환 횟수는 처음에 뒤바뀌어 있던 쌍의 수와 같습니다."
    explanation: "뒤바뀐 쌍은 '정렬에서 얼마나 멀리 떨어져 있는가'를 나타냅니다. 삽입 정렬은 이웃끼리 교환해 뒤바뀐 쌍을 정확히 하나씩 없애므로 교환 횟수가 그 개수와 같습니다. 거의 정렬된 데이터는 뒤바뀐 쌍이 적어 삽입 정렬이 아주 빠릅니다."
    commonMistakes:
      - "원본을 정렬해 버린 뒤 뒤바뀐 쌍을 세어 0이 나옴"
      - "j 반복을 0부터 시작해 같은 쌍을 두 번 셈"
    language: rust
    verification: run
quiz:
  - id: quiz-day73-01
    question: 삽입 정렬의 i번째 단계가 시작될 때 항상 참인 것은?
    choices:
      - 배열 전체가 정렬되어 있다
      - 앞의 i칸(인덱스 0 ~ i-1)이 정렬되어 있다
      - 가장 작은 i개가 앞에 모여 있다
      - 뒤의 i칸이 정렬되어 있다
    answerIndex: 1
    explanation: 삽입 정렬은 앞의 i칸이 '서로 사이에서' 정렬되어 있다는 불변식을 지킵니다. 그 i칸이 전체에서 가장 작은 i개라는 보장은 없습니다. 그것은 선택 정렬의 불변식입니다.
  - id: quiz-day73-02
    question: 이미 정렬된 배열 n개를 삽입 정렬하면 비교 횟수는?
    choices: ["0번", "n - 1번", "n log n번", "n(n-1)/2번"]
    answerIndex: 1
    explanation: 각 단계에서 바로 왼쪽 원소와 한 번 비교하고 멈추므로 n - 1번입니다. 그래서 최선의 경우 O(n)입니다. 거꾸로 정렬되어 있으면 n(n-1)/2번이라 O(n²)입니다.
  - id: quiz-day73-03
    question: 안정 정렬(stable sort)의 뜻으로 옳은 것은?
    choices:
      - 항상 O(n log n)이 보장되는 정렬
      - 정렬 기준이 같은 원소들의 원래 순서가 유지되는 정렬
      - 추가 메모리를 쓰지 않는 정렬
      - 실행할 때마다 결과가 같은 정렬
    answerIndex: 1
    explanation: 점수로 정렬할 때 같은 점수인 학생들이 입력 순서를 그대로 유지하면 안정 정렬입니다. 삽입 정렬은 같은 값에서 멈추기(> 비교) 때문에 안정적입니다. 추가 메모리를 쓰지 않는 것은 '제자리(in-place) 정렬'이라고 합니다.
  - id: quiz-day73-04
    question: 삽입 정렬이 다른 O(n²) 정렬보다 실제로 자주 쓰이는 상황은?
    choices:
      - 원소가 수백만 개일 때
      - 원소가 적거나 거의 정렬되어 있을 때
      - 원소가 모두 같을 때만
      - 거꾸로 정렬되어 있을 때
    answerIndex: 1
    explanation: 원소가 적으면 단순한 코드의 상수 비용이 작아 빠르고, 거의 정렬되어 있으면 O(n)에 가깝습니다. 그래서 Python과 Rust의 표준 정렬(Timsort 계열)도 작은 구간은 삽입 정렬로 처리합니다.
  - id: quiz-day73-05
    question: "[4, 3, 2, 1]을 삽입 정렬할 때 원소를 오른쪽으로 미는 총 횟수는?"
    choices: ["3번", "4번", "6번", "16번"]
    answerIndex: 2
    explanation: 3은 1칸, 2는 2칸, 1은 3칸 밀어야 해서 1 + 2 + 3 = 6번입니다. 뒤바뀐 쌍(inversion)의 개수와 같습니다.
---

## 1. 오늘 배울 내용

오늘부터 사흘 동안 **정렬(sorting)** 을 배웁니다. 정렬은 가장 많이 쓰이는 알고리즘입니다. 정렬되어 있으면 이진 탐색(Day 72)을 쓸 수 있고, 중복을 찾기 쉽고, 사람이 읽기도 좋습니다. 첫날은 가장 직관적인 **삽입 정렬(insertion sort)** 입니다.

1. 카드 정리에서 삽입 정렬의 아이디어를 얻고 **불변식**을 세웁니다.
2. **C, Python, Rust** 로 구현하고 단계별 배열을 추적합니다.
3. 비교·이동 횟수를 세어 **최선 O(n), 최악 O(n²)** 을 확인합니다.
4. **안정 정렬**의 뜻과, **키 함수**로 원하는 기준으로 정렬하는 방법을 배웁니다.
5. 응용으로 **선택 정렬, 버블 정렬**과 비용을 비교합니다.

Day 74의 병합 정렬과 Day 75의 퀵 정렬은 O(n log n)으로 더 빠르지만, 삽입 정렬은 **작거나 거의 정렬된 데이터**에서 지금도 실제로 쓰이는 알고리즘입니다.

## 2. 왜 삽입 정렬인가

카드 게임에서 카드를 한 장씩 받아 손에 정리하는 모습을 떠올려 보세요.

1. 손에 든 카드는 **이미 정렬되어** 있습니다.
2. 새 카드를 받으면, 손의 카드를 **오른쪽부터** 보면서 새 카드보다 큰 카드를 한 칸씩 옆으로 밉니다.
3. 새 카드보다 작거나 같은 카드를 만나면 그 **바로 오른쪽**에 새 카드를 끼웁니다.

이것이 삽입 정렬입니다. 배열의 **앞부분을 "손"**, 나머지를 **"아직 받지 않은 카드"** 로 생각하면 됩니다. 추가 배열 없이 배열 안에서 정렬하므로(**제자리 정렬**) 메모리를 거의 쓰지 않습니다.

## 3. 그림으로 이해하기

`[5, 2, 4, 6, 1, 3]`을 정렬합니다. `|` 왼쪽이 정렬된 앞부분입니다.

```text
시작   5 | 2 4 6 1 3          ← 원소 하나짜리 앞부분은 그 자체로 정렬되어 있다
i=1    2 5 | 4 6 1 3          2를 꺼내 5를 밀고 맨 앞에
i=2    2 4 5 | 6 1 3          4를 꺼내 5를 밀고 2 뒤에
i=3    2 4 5 6 | 1 3          6은 5보다 크므로 그대로
i=4    1 2 4 5 6 | 3          1을 꺼내 네 개를 모두 밀고 맨 앞에
i=5    1 2 3 4 5 6            3을 꺼내 4, 5, 6을 밀고 2 뒤에
```

i = 4 단계를 자세히 보면 이렇습니다.

```text
key = 1 (꺼내 둔다)
  [2 4 5 6 _]   6 > 1 → 6을 오른쪽으로 밀기
  [2 4 5 _ 6]   5 > 1 → 밀기
  [2 4 _ 5 6]   4 > 1 → 밀기
  [2 _ 4 5 6]   2 > 1 → 밀기
  [_ 2 4 5 6]   왼쪽 끝 → 빈자리에 1을 넣는다
  [1 2 4 5 6]
```

## 4. 천천히 풀어보기

### 4.1 불변식

> i번째 단계를 시작할 때, 앞의 i칸 `a[0..i]`는 **서로 사이에서** 정렬되어 있다.

처음(i = 1)에는 앞의 1칸이라 저절로 참입니다. 각 단계는 `a[i]`를 앞부분의 알맞은 자리에 끼워 정렬된 앞부분을 i + 1칸으로 늘립니다. 마지막 단계가 끝나면 앞부분이 배열 전체가 되어 정렬이 끝납니다.

"서로 사이에서"라는 말에 주의하세요. 3절의 i = 3 시점에 앞부분은 `2 4 5 6`인데, 뒤에 있는 1이 이들보다 작습니다. 앞부분이 **전체에서 가장 작은 원소들**이라는 보장은 없습니다. 그 보장을 하는 것은 7절의 **선택 정렬**입니다.

### 4.2 밀기와 넣기

한 단계에서 하는 일은 세 가지입니다.

```text
① key = a[i]                     끼워 넣을 값을 따로 저장한다 (곧 덮어써지므로!)
② j = i - 1부터 왼쪽으로,
   a[j] > key인 동안 a[j]를 a[j+1]로 민다
③ 멈춘 곳 바로 오른쪽 a[j+1]에 key를 넣는다
```

①을 빼먹으면 ②의 첫 밀기 `a[i] = a[i-1]`이 끼워 넣을 값을 **덮어씁니다**(실습의 디버그 문제). 교환(swap)을 반복하는 방법도 있지만(Rust 구현), 밀고 마지막에 한 번 쓰는 방법이 대입 횟수가 적습니다.

### 4.3 비교 횟수: 입력 모양에 따라 크게 다르다

| 입력        | 각 단계에서 비교 | 전체 비교  | 복잡도        |
| ----------- | ---------------- | ---------- | ------------- |
| 이미 정렬   | 1번(바로 멈춤)   | n - 1      | O(n)          |
| 거의 정렬   | 대부분 1~2번     | n에 가까움 | O(n)에 가까움 |
| 무작위      | 평균 i/2번       | 약 n²/4    | O(n²)         |
| 거꾸로 정렬 | i번(끝까지 밀기) | n(n-1)/2   | O(n²)         |

이동 횟수는 더 정확히 말할 수 있습니다. **이동 횟수 = 뒤바뀐 쌍(inversion)의 개수**입니다. 뒤바뀐 쌍은 "앞에 있는데 더 큰" 두 원소의 쌍으로, 배열이 정렬에서 얼마나 멀리 있는지를 나타냅니다. 이웃한 두 원소를 바로잡을 때마다 뒤바뀐 쌍이 정확히 하나 줄기 때문입니다.

### 4.4 안정 정렬

학생을 점수로 정렬한다고 합시다. 민수와 하준이 둘 다 80점이고, 입력에서 민수가 먼저 나왔습니다. 정렬 뒤에도 민수가 하준보다 앞에 있으면 그 정렬은 **안정(stable)** 하다고 합니다.

삽입 정렬은 `a[j] > key`일 때만 밀고, **같으면 멈춥니다.** 그래서 같은 값은 절대 서로를 넘어가지 않아 안정적입니다. `>=`로 바꾸면 같은 값끼리도 자리를 바꿔 안정성이 깨집니다.

안정성은 **여러 기준으로 정렬할 때** 중요합니다. "이름순으로 정렬한 뒤 점수순으로 안정 정렬"하면 같은 점수 안에서는 이름순이 유지됩니다.

### 4.5 키 함수: 무엇을 기준으로 정렬할까

같은 알고리즘으로 여러 기준을 쓰려면 "두 원소 중 누가 앞인가"를 판단하는 부분만 바꾸면 됩니다.

- Python: `key` 함수(원소 → 비교할 값). `key=len`이면 길이순, `key=lambda s: -s[1]`이면 두 번째 값의 내림차순.
- Rust: `key` 클로저나 비교 함수. `Reverse(값)`으로 내림차순.
- C: 비교 함수 포인터(`qsort`처럼). Day 77에서 다룹니다.

## 5. C로 구현하기

C 프로그램은 단계별 배열을 출력하고, 비교·이동 횟수를 셉니다. 원소 1,000개를 이미 정렬된 경우, 거의 정렬된 경우, 거꾸로 정렬된 경우로 나눠 비용을 비교합니다.

```c
// 파일: insertion.c
#include <stdio.h>

typedef struct {
    long long comparisons;
    long long shifts;
} Stats;

void print_array(const char *label, const int a[], int n, int sorted_end) {
    printf("%-10s", label);
    for (int i = 0; i < n; i++) {
        printf(i == sorted_end ? " | %d" : " %d", a[i]);     // |: 정렬된 앞부분의 끝
    }
    printf("\n");
}

Stats insertion_sort(int a[], int n, int trace) {
    Stats s = {0, 0};
    for (int i = 1; i < n; i++) {
        int key = a[i];                 // 이번에 끼워 넣을 값
        int j = i - 1;
        while (j >= 0) {
            s.comparisons++;
            if (a[j] <= key) {
                break;                  // 제자리를 찾았다 (같으면 멈춰서 안정 정렬)
            }
            a[j + 1] = a[j];            // 큰 값을 한 칸 오른쪽으로
            s.shifts++;
            j--;
        }
        a[j + 1] = key;
        if (trace) {
            char label[16];
            snprintf(label, sizeof label, "i=%d", i);
            print_array(label, a, n, i + 1);
        }
    }
    return s;
}

int main(void) {
    int a[] = {5, 2, 4, 6, 1, 3};
    int n = sizeof a / sizeof a[0];
    print_array("start", a, n, 1);
    Stats s = insertion_sort(a, n, 1);
    printf("비교 %lld번, 이동 %lld번\n\n", s.comparisons, s.shifts);

    enum { N = 1000 };
    static int sorted_in[N], reversed_in[N], almost[N];
    for (int i = 0; i < N; i++) {
        sorted_in[i] = i;
        reversed_in[i] = N - i;
        almost[i] = i;
    }
    for (int i = 0; i + 1 < N; i += 100) {       // 100칸마다 이웃 둘을 바꿔 둔다
        int t = almost[i];
        almost[i] = almost[i + 1];
        almost[i + 1] = t;
    }
    Stats best = insertion_sort(sorted_in, N, 0);
    Stats worst = insertion_sort(reversed_in, N, 0);
    Stats near = insertion_sort(almost, N, 0);
    printf("n=%d 이미 정렬:   비교 %7lld, 이동 %7lld\n", N, best.comparisons, best.shifts);
    printf("n=%d 거의 정렬:   비교 %7lld, 이동 %7lld\n", N, near.comparisons, near.shifts);
    printf("n=%d 거꾸로 정렬: 비교 %7lld, 이동 %7lld\n", N, worst.comparisons, worst.shifts);
    return 0;
}
```

실행 결과:

```text
start      5 | 2 4 6 1 3
i=1        2 5 | 4 6 1 3
i=2        2 4 5 | 6 1 3
i=3        2 4 5 6 | 1 3
i=4        1 2 4 5 6 | 3
i=5        1 2 3 4 5 6
비교 12번, 이동 9번

n=1000 이미 정렬:   비교     999, 이동       0
n=1000 거의 정렬:   비교    1008, 이동      10
n=1000 거꾸로 정렬: 비교  499500, 이동  499500
```

### 코드 한 부분씩 읽기

| 코드                                                                 | 설명                                                                                                                                    |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { long long comparisons; long long shifts; } Stats;` | 두 횟수를 묶어 한 번에 돌려줍니다. C 함수는 값을 하나만 돌려줄 수 있어서 구조체를 씁니다(Day 50).                                       |
| `int key = a[i];`                                                    | 4.2절 ①. 밀기가 시작되면 `a[i]`는 곧 덮어써집니다.                                                                                      |
| `if (a[j] <= key) break;`                                            | 제자리를 찾으면 멈춥니다. **같을 때도 멈추므로** 안정 정렬입니다. 이 한 줄 때문에 정렬된 입력에서 단계마다 비교가 1번으로 끝납니다.     |
| `a[j + 1] = a[j];`                                                   | 큰 값을 오른쪽으로 한 칸 밉니다. 교환보다 대입이 적습니다.                                                                              |
| `a[j + 1] = key;`                                                    | 반복이 멈춘 곳(j)의 **바로 오른쪽**이 빈자리입니다. j가 -1까지 갔다면 a[0]에 넣습니다.                                                  |
| `printf(i == sorted_end ? " \| %d" : " %d", a[i])`                   | 정렬된 앞부분의 경계에 `                                                                                                                | `를 찍습니다. 형식 문자열도 조건 연산자로 고를 수 있습니다. |
| `enum { N = 1000 };`                                                 | C에서 이름 붙은 정수 상수를 만드는 방법입니다. 배열 크기로 쓸 수 있습니다.                                                              |
| `static int sorted_in[N], ...;`                                      | 함수 안의 `static` 배열은 호출 스택이 아니라 프로그램 전체 기간 동안 유지되는 영역에 놓입니다. 큰 배열을 스택에 두지 않으려는 것입니다. |
| `for (int i = 0; i + 1 < N; i += 100)`                               | 100칸마다 이웃 두 원소를 바꿔 "거의 정렬된" 입력을 만들었습니다. 뒤바뀐 쌍이 10개라 이동도 정확히 10번입니다(4.3절).                    |

거꾸로 정렬된 1,000개는 약 50만 번, 이미 정렬된 1,000개는 999번 비교합니다. **같은 알고리즘, 같은 크기**인데 입력 모양에 따라 500배 차이가 납니다.

## 6. Python으로 구현하기

Python 버전은 `key` 매개변수를 받아 여러 기준으로 정렬할 수 있게 만들고, **안정성**을 직접 확인합니다.

```python
# 파일: insertion.py
def insertion_sort(items, key=lambda x: x):
    """items를 제자리에서 정렬한다. 같은 key는 원래 순서를 지킨다(안정 정렬)."""
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and key(items[j]) > key(current):
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
    return items


numbers = [5, 2, 4, 6, 1, 3]
print("숫자:", insertion_sort(numbers))

words = ["pear", "fig", "apple", "kiwi", "banana"]
print("길이순:", insertion_sort(words[:], key=len))
print("사전순:", insertion_sort(words[:]))

students = [("민수", 80), ("지아", 95), ("하준", 80), ("서연", 70), ("도윤", 95)]
by_score = insertion_sort(students[:], key=lambda s: -s[1])      # 점수 내림차순
print("점수순:", by_score)
print("같은 점수는 입력 순서 유지(안정):", [name for name, score in by_score if score == 80])

print("표준 sorted:", sorted(students, key=lambda s: -s[1]) == by_score)
```

실행 결과:

```text
숫자: [1, 2, 3, 4, 5, 6]
길이순: ['fig', 'pear', 'kiwi', 'apple', 'banana']
사전순: ['apple', 'banana', 'fig', 'kiwi', 'pear']
점수순: [('지아', 95), ('도윤', 95), ('민수', 80), ('하준', 80), ('서연', 70)]
같은 점수는 입력 순서 유지(안정): ['민수', '하준']
표준 sorted: True
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                                                                             |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `def insertion_sort(items, key=lambda x: x):`       | 기본 key는 "값 자신"입니다. 호출할 때 다른 함수를 넘기면 그 결과로 비교합니다.                                                                                                   |
| `while j >= 0 and key(items[j]) > key(current):`    | `and`의 단축 평가로 j가 음수가 되면 `items[j]`를 읽지 않습니다. Python에서 `items[-1]`은 오류가 아니라 **마지막 원소**라서, 이 순서를 지키지 않으면 조용히 틀린 결과가 나옵니다. |
| `words[:]`                                          | 리스트의 **복사본**을 넘겼습니다. 제자리 정렬이라 원본을 바꾸기 때문에, 같은 words로 두 번 정렬하려면 복사해야 합니다.                                                           |
| `key=len`                                           | 길이순입니다. `pear`와 `kiwi`는 길이가 4로 같은데, 입력에서 `pear`가 먼저였으므로 결과에서도 먼저입니다(안정성).                                                                 |
| `key=lambda s: -s[1]`                               | 점수에 `-`를 붙여 내림차순을 만들었습니다. 값을 뒤집는 대신 **키를 뒤집으면** 같은 점수의 순서는 그대로 유지됩니다.                                                              |
| `sorted(students, key=lambda s: -s[1]) == by_score` | Python의 표준 정렬(`sorted`, `list.sort`)도 **안정 정렬**이라 결과가 똑같습니다.                                                                                                 |

## 7. Rust로 구현하기

Rust 버전은 `T: Ord`인 모든 타입을 정렬하는 제네릭 함수와, 키 클로저를 받는 버전을 만듭니다. 소유권을 옮기지 않도록 **교환(swap)** 으로 한 칸씩 이동합니다.

```rust
// 파일: insertion.rs
fn insertion_sort<T: Ord>(a: &mut [T]) -> usize {
    let mut shifts = 0;
    for i in 1..a.len() {
        let mut j = i;
        while j > 0 && a[j - 1] > a[j] {
            a.swap(j - 1, j);           // 한 칸씩 왼쪽으로 옮긴다
            shifts += 1;
            j -= 1;
        }
    }
    shifts
}

fn insertion_sort_by<T, K: Ord>(a: &mut [T], key: impl Fn(&T) -> K) {
    for i in 1..a.len() {
        let mut j = i;
        while j > 0 && key(&a[j - 1]) > key(&a[j]) {
            a.swap(j - 1, j);
            j -= 1;
        }
    }
}

fn main() {
    let mut numbers = [5, 2, 4, 6, 1, 3];
    let shifts = insertion_sort(&mut numbers);
    println!("숫자: {:?}, 교환 {}번", numbers, shifts);

    let mut words = vec!["pear", "fig", "apple", "kiwi", "banana"];
    insertion_sort(&mut words);
    println!("사전순: {:?}", words);

    let mut students = vec![("민수", 80), ("지아", 95), ("하준", 80), ("서연", 70), ("도윤", 95)];
    insertion_sort_by(&mut students, |s| std::cmp::Reverse(s.1));
    println!("점수순: {:?}", students);

    let mut std_sorted = vec![("민수", 80), ("지아", 95), ("하준", 80), ("서연", 70), ("도윤", 95)];
    std_sorted.sort_by_key(|s| std::cmp::Reverse(s.1));       // 표준 안정 정렬
    println!("표준 sort_by_key와 같음: {}", std_sorted == students);

    let mut reversed: Vec<u32> = (1..=100).rev().collect();
    println!("거꾸로 100개 정렬의 교환 횟수: {}", insertion_sort(&mut reversed));
}
```

실행 결과:

```text
숫자: [1, 2, 3, 4, 5, 6], 교환 9번
사전순: ["apple", "banana", "fig", "kiwi", "pear"]
점수순: [("지아", 95), ("도윤", 95), ("민수", 80), ("하준", 80), ("서연", 70)]
표준 sort_by_key와 같음: true
거꾸로 100개 정렬의 교환 횟수: 4950
```

### 코드 한 부분씩 읽기

| 코드                                                                  | 설명                                                                                                                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn insertion_sort<T: Ord>(a: &mut [T]) -> usize`                     | 비교 가능한(`Ord`) 모든 타입의 **슬라이스**를 받습니다. 배열 `[i32; 6]`도 `Vec<&str>`도 `&mut`으로 넘기면 슬라이스가 됩니다.                                                 |
| `while j > 0 && a[j - 1] > a[j]`                                      | `j > 0`을 **먼저** 검사해야 `j - 1`이 usize에서 넘치지 않습니다(실습의 빈칸 문제).                                                                                           |
| `a.swap(j - 1, j);`                                                   | C처럼 `key = a[i]`로 값을 꺼내면, `T`가 `String`처럼 복사할 수 없는 타입일 때 소유권이 옮겨져 배열에 구멍이 생깁니다. 이웃끼리 교환하면 그런 문제 없이 제자리 정렬이 됩니다. |
| `fn insertion_sort_by<T, K: Ord>(a: &mut [T], key: impl Fn(&T) -> K)` | 키를 뽑는 클로저를 받습니다. `impl Fn(&T) -> K`는 "원소를 빌려 K를 돌려주는 함수라면 무엇이든"이라는 뜻입니다.                                                               |
| `\|s\| std::cmp::Reverse(s.1)`                                        | 튜플의 두 번째 값(점수)을 `Reverse`로 감싸 내림차순을 만듭니다(Day 66).                                                                                                      |
| `std_sorted.sort_by_key(...)`                                         | 표준 `sort`, `sort_by`, `sort_by_key`는 **안정 정렬**입니다. 안정성이 필요 없으면 조금 더 빠른 `sort_unstable`을 쓸 수 있습니다.                                             |
| `(1..=100).rev().collect()`                                           | 100부터 1까지의 거꾸로 된 Vec입니다. 교환 횟수 4950 = 100 × 99 / 2로, 뒤바뀐 쌍의 개수와 같습니다.                                                                           |

## 8. 실행 추적

C 프로그램의 `[5, 2, 4, 6, 1, 3]` 정렬에서 단계마다의 비교와 이동을 셉니다.

| i   | key | 비교한 값(왼쪽으로)        |   비교 |  이동 | 결과          |
| --- | --- | -------------------------- | -----: | ----: | ------------- |
| 1   | 2   | 5 (밀기), 끝               |      1 |     1 | `2 5 4 6 1 3` |
| 2   | 4   | 5 (밀기), 2 (멈춤)         |      2 |     1 | `2 4 5 6 1 3` |
| 3   | 6   | 5 (멈춤)                   |      1 |     0 | `2 4 5 6 1 3` |
| 4   | 1   | 6, 5, 4, 2 (모두 밀기), 끝 |      4 |     4 | `1 2 4 5 6 3` |
| 5   | 3   | 6, 5, 4 (밀기), 2 (멈춤)   |      4 |     3 | `1 2 3 4 5 6` |
|     |     | **합계**                   | **12** | **9** |               |

이동 9번은 처음 배열의 뒤바뀐 쌍 (5,2), (5,4), (5,1), (5,3), (2,1), (4,1), (4,3), (6,1), (6,3) 9개와 정확히 같습니다. 왼쪽 끝까지 밀어서 "끝"으로 멈춘 경우(i = 1, 4)는 비교에서 멈춘 것이 아니라 j가 -1이 되어 멈췄으므로 비교가 이동 횟수와 같습니다.

## 9. 다른 예제로 다시 이해하기

O(n²) 정렬 세 가지를 같은 입력으로 비교해 봅시다. **선택 정렬**은 매 단계 남은 부분에서 **가장 작은 값을 찾아** 앞으로 보내고(교환은 적지만 비교는 항상 n²/2), **버블 정렬**은 이웃끼리 비교해 큰 값을 **뒤로 밀어 올립니다**(한 바퀴 동안 교환이 없으면 일찍 멈출 수 있음). 삽입 정렬은 입력이 정렬에 가까울수록 빨라지는 성질이 가장 강합니다. 세 알고리즘 모두 O(n²)이지만, **어떤 입력에서 무엇을 몇 번 하는지**는 꽤 다릅니다.

```python
# 파일: sort_compare.py
def insertion(a):
    a, comps, moves = a[:], 0, 0
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0:
            comps += 1
            if a[j] <= key:
                break
            a[j + 1] = a[j]
            moves += 1
            j -= 1
        a[j + 1] = key
    return comps, moves


def selection(a):
    a, comps, moves = a[:], 0, 0
    for i in range(len(a)):
        m = i
        for j in range(i + 1, len(a)):
            comps += 1
            if a[j] < a[m]:
                m = j
        if m != i:
            a[i], a[m] = a[m], a[i]
            moves += 1
    return comps, moves


def bubble(a):
    a, comps, moves = a[:], 0, 0
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for j in range(end):
            comps += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                moves += 1
                swapped = True
        if not swapped:
            break                    # 한 바퀴 동안 교환이 없으면 이미 정렬됨
    return comps, moves


n = 100
inputs = {
    "정렬됨": list(range(n)),
    "거의 정렬": [i + 1 if i % 20 == 0 else i - 1 if i % 20 == 1 else i for i in range(n)],
    "거꾸로": list(range(n, 0, -1)),
}
print(f"{'입력':<6} {'삽입(비교/이동)':>16} {'선택(비교/교환)':>16} {'버블(비교/교환)':>16}")
for name, data in inputs.items():
    row = [f"{c}/{m}" for c, m in (insertion(data), selection(data), bubble(data))]
    print(f"{name:<6} {row[0]:>16} {row[1]:>16} {row[2]:>16}")
```

실행 결과:

```text
입력            삽입(비교/이동)        선택(비교/교환)        버블(비교/교환)
정렬됨                99/0           4950/0             99/0
거의 정렬             103/5           4950/5            197/5
거꾸로           4950/4950          4950/50        4950/4950
```

- **선택 정렬**은 입력이 무엇이든 비교가 4,950번입니다. 대신 교환은 최대 n번이라, 원소를 옮기는 비용이 아주 큰 경우(큰 레코드를 디스크에 쓰는 경우 등)에 유리합니다. 선택 정렬은 멀리 있는 원소와 교환하므로 **안정 정렬이 아닙니다.**
- **버블 정렬**은 정렬된 입력에서는 한 바퀴(99번)로 끝나지만, 거의 정렬된 입력에서는 삽입 정렬보다 비교가 많습니다.
- **삽입 정렬**은 정렬됨·거의 정렬 모두에서 가장 적게 일합니다. 세 알고리즘의 이동·교환 횟수가 거의 정렬 입력에서 모두 5번인 것은 뒤바뀐 쌍이 5개이기 때문입니다.

## 10. 시간·공간 복잡도

| 정렬      | 최선  | 평균  | 최악  | 추가 공간 | 안정?  | 특징                            |
| --------- | ----- | ----- | ----- | --------- | ------ | ------------------------------- |
| 삽입 정렬 | O(n)  | O(n²) | O(n²) | O(1)      | 예     | 거의 정렬된 입력에 강함, 온라인 |
| 선택 정렬 | O(n²) | O(n²) | O(n²) | O(1)      | 아니요 | 교환이 최대 n번                 |
| 버블 정렬 | O(n)  | O(n²) | O(n²) | O(1)      | 예     | 교육용, 실무에서는 거의 안 씀   |

"온라인(online)"은 원소가 **하나씩 도착해도** 그때그때 정렬 상태를 유지할 수 있다는 뜻입니다. 삽입 정렬은 새 원소를 정렬된 앞부분에 끼우기만 하면 되므로, 실시간으로 들어오는 점수를 순위표에 넣는 일에 딱 맞습니다.

## 11. 세 언어 비교

| 관점             | C                            | Python                                | Rust                                        |
| ---------------- | ---------------------------- | ------------------------------------- | ------------------------------------------- |
| 이동 방식        | key 저장 → 밀기 → 한 번 쓰기 | 같음                                  | 이웃 교환(`swap`) — 소유권 문제 없음        |
| 음수 인덱스 보호 | `j >= 0` 먼저 검사           | `j >= 0` 먼저 (`a[-1]`은 마지막 원소) | `j > 0` 먼저 (usize 넘침 방지)              |
| 기준 바꾸기      | 비교 함수 포인터             | `key=` 함수                           | 클로저, `Reverse`                           |
| 표준 정렬        | `qsort` (안정 보장 없음)     | `sorted`, `list.sort` (안정)          | `sort`(안정), `sort_unstable`(불안정, 빠름) |
| 여러 타입        | `void *` + 비교 함수         | 비교 가능한 아무 값                   | 제네릭 `T: Ord`                             |

## 12. 자주 하는 실수

### 실수 1: 끼워 넣을 값을 저장하지 않는다

실습의 디버그 문제입니다. `a[i]`를 key에 저장하지 않으면 첫 밀기에서 덮어써져 값을 잃습니다. 제자리 알고리즘에서는 **덮어쓰기 전에 필요한 값을 먼저 저장**하세요.

### 실수 2: 반복 조건의 순서를 바꾼다

`a[j] > key && j >= 0`처럼 순서를 바꾸면 j = -1일 때 `a[-1]`을 먼저 읽습니다. C에서는 배열 밖 접근(정의되지 않은 동작), Rust에서는 usize 넘침으로 panic, Python에서는 **마지막 원소와 비교하는** 조용한 버그가 됩니다. 범위 검사를 항상 **앞에** 쓰세요.

### 실수 3: `>=`로 비교해 안정성을 깨뜨린다

```python
# 파일: unstable_ge.py
def sort_by_score(items, strict=True):
    items = items[:]
    for i in range(1, len(items)):
        cur, j = items[i], i - 1
        while j >= 0 and (items[j][1] > cur[1] if strict else items[j][1] >= cur[1]):
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = cur
    return [name for name, _ in items]


data = [("민수", 80), ("하준", 80), ("서연", 70)]
print("> :", sort_by_score(data))
print(">=:", sort_by_score(data, strict=False))
```

실행 결과:

```text
> : ['서연', '민수', '하준']
>=: ['서연', '하준', '민수']
```

같은 80점인 민수와 하준의 순서가 `>=`에서 뒤집혔습니다. 결과가 "정렬된" 것은 맞지만, 안정성이 필요한 곳(여러 기준 정렬)에서는 버그입니다.

### 실수 4: 원본이 바뀐다는 것을 잊는다

제자리 정렬은 **넘겨준 배열 자체를 바꿉니다.** 원본이 나중에 필요하다면 Python은 `a[:]`나 `sorted(a)`, Rust는 `clone()`, C는 `memcpy`로 복사한 뒤 정렬하세요. Python의 `list.sort()`는 None을 돌려준다는 점도 헷갈리기 쉽습니다(`b = a.sort()`는 b에 None이 들어갑니다).

### 실수 5: 큰 데이터에 O(n²) 정렬을 쓴다

원소가 10만 개면 삽입 정렬은 최악의 경우 약 50억 번 비교합니다. 직접 구현한 정렬은 학습용으로만 쓰고, 실제 프로그램에서는 **표준 라이브러리 정렬**(O(n log n))을 쓰세요.

## 13. Q&A

**Q. 삽입 정렬에서 넣을 자리를 이진 탐색으로 찾으면 빨라지나요?**

A. 비교 횟수는 O(log i)로 줄어듭니다(**이진 삽입 정렬**). 하지만 자리를 찾아도 그 뒤의 원소를 **밀어야 하는** 이동 횟수는 그대로라 전체는 여전히 O(n²)입니다. 비교가 이동보다 훨씬 비쌀 때(예: 긴 문자열 비교) 효과가 있습니다.

**Q. 표준 정렬도 삽입 정렬을 쓴다는 것이 사실인가요?**

A. 네. Python의 `sorted`(Timsort)와 Rust의 `sort`는 배열을 작은 조각으로 나눠 **삽입 정렬로 정렬한 뒤 병합**합니다. 작은 조각(수십 개 이하)에서는 삽입 정렬이 O(n log n) 알고리즘보다 빠르기 때문입니다. C++의 `std::sort`도 작은 구간은 삽입 정렬을 씁니다.

**Q. 버블 정렬은 왜 배우나요?**

A. 가장 단순해서 "이웃 비교로 정렬할 수 있다"는 아이디어를 보여 주기 좋습니다. 하지만 실무에서 버블 정렬을 쓸 이유는 거의 없습니다. 같은 O(n²)이라면 삽입 정렬이 거의 항상 더 빠릅니다.

**Q. 연결 리스트도 삽입 정렬할 수 있나요?**

A. 네. 연결 리스트에서는 밀기 대신 **노드를 떼어 제자리에 다시 연결**하면 되므로 원소 이동 비용이 없습니다. 다만 자리를 찾으려면 앞에서부터 훑어야 합니다. 연결 리스트 정렬에는 보통 Day 74의 병합 정렬을 씁니다.

## 14. 핵심 요약

- 삽입 정렬은 **정렬된 앞부분**에 다음 원소를 **알맞은 자리에 끼워 넣는** 것을 반복합니다.
- 한 단계: ① 값을 key로 **저장**, ② key보다 큰 값을 **오른쪽으로 밀기**, ③ 빈자리에 **넣기**.
- 이미 정렬된 입력은 **O(n)**, 거꾸로 된 입력은 **O(n²)** 입니다. 이동 횟수는 **뒤바뀐 쌍의 개수**와 같습니다.
- 같은 값에서 멈추므로 **안정 정렬**이고, 추가 공간이 필요 없는 **제자리 정렬**입니다.
- **키 함수**(Python `key`, Rust 클로저, C 비교 함수)로 정렬 기준을 바꿉니다.
- 작거나 거의 정렬된 데이터에서는 실제로 빠르며, 표준 정렬 알고리즘의 부품으로도 쓰입니다.

## 15. 도전 문제

1. **(C)** 문자열 배열 `const char *names[]`를 `strcmp`로 비교하는 삽입 정렬을 만드세요. 포인터만 옮기면 되므로 문자열을 복사할 필요가 없습니다.
2. **(Python)** 넣을 자리를 `bisect.bisect_right`로 찾는 **이진 삽입 정렬**을 만들고, 원소 1,000개에서 비교 횟수와 이동 횟수를 일반 삽입 정렬과 비교하세요.
3. **(Rust)** 점수가 하나씩 도착할 때마다 정렬된 순위표에 끼워 넣는 `Leaderboard` 구조체를 만들고, 상위 3명을 출력하세요. 삽입 정렬의 한 단계만 반복하면 됩니다.
4. **(세 언어)** 원소가 10만 개인 무작위 배열을 직접 만든 삽입 정렬과 표준 정렬로 각각 정렬해 걸리는 시간을 비교해 보세요(Python은 1만 개로 줄여도 됩니다).
