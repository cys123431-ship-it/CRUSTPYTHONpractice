---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-36-rust-slices
courseId: crp-92
phaseId: phase-04
dayNumber: 36
date: "2026-11-05"
title: Rust 슬라이스와 범위
summary: Rust의 범위 문법(a..b, a..=b, ..b, a.., ..)으로 배열·Vec의 일부를 빌리는 슬라이스를 만들고, first·last·get으로 안전하게 꺼내기, split_at·chunks·windows로 나누기, contains·position·binary_search로 찾기, reverse·fill·swap으로 일부만 바꾸기를 익힙니다. C의 [start, end) 구간과 포인터·길이 쌍, Python의 자르기(음수 인덱스, 건너뛰기, 범위를 넘어도 오류가 없는 자르기, 길이가 바뀌는 자르기 대입)와 비교하고, 온도 기록에서 이동 평균과 가장 따뜻한 구간을 찾는 프로그램을 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-35-ownership-review]
learningObjectives:
  - 다섯 가지 범위 문법으로 슬라이스를 만들고, 끝을 포함하는지 구별한다.
  - 인덱싱이 패닉을 내는 경우와 get·first·last가 Option을 돌려주는 경우를 구별해 쓴다.
  - split_at, chunks, windows로 슬라이스를 나누고 이동 평균 같은 계산을 한다.
  - 가변 슬라이스의 일부만 reverse·fill·swap으로 바꾼다.
  - 같은 구간 계산을 C의 [start, end) 반복과 Python 자르기로 옮기고 차이를 설명한다.
concepts:
  [
    slice,
    range,
    half open interval,
    inclusive range,
    get,
    option,
    split_at,
    chunks,
    windows,
    binary_search,
    mutable slice,
    python slicing,
    step,
  ]
runnerMode: python
playgroundSource: |
  # 파일: slices.py — Rust의 범위와 Python 자르기를 비교해 보세요.
  v = [10, 20, 30, 40, 50, 60]
  print(v[1:4], v[1:5], v[-2:], v[::2], v[::-1])
  print(v[4:99])           # 자르기는 범위를 넘어도 오류가 없습니다
  print([sum(v[i:i + 3]) for i in range(len(v) - 2)])   # windows(3)의 합
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day36-predict-rs
    title: 가운데 슬라이스 예측하기
    kind: predict
    objective: 범위의 끝이 포함되지 않는다는 것과 슬라이스 메서드의 결과를 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let v = [5, 1, 4, 2, 3];
          let mid = &v[1..4];
          println!("{:?} {} {:?}", mid, mid.len(), mid.first());
      }
    answer: "[1, 4, 2] 3 Some(1)"
    hint: "1..4는 1, 2, 3번 칸입니다. first는 슬라이스의 첫 칸을 Option으로 돌려줍니다."
    explanation: "1..4는 반쯤 열린 구간 [1, 4)라 4번 칸(3)은 빠집니다. mid는 원래 배열의 1번 칸에서 시작하므로 mid.first()는 원래의 v[1]인 1을 Some으로 감싸 돌려줍니다. 끝까지 포함하려면 1..=4를 씁니다."
    commonMistakes:
      - "4번 칸까지 포함해 [1, 4, 2, 3]으로 적음"
      - "first가 원래 배열의 첫 값 5를 돌려준다고 생각함"
    language: rust
    verification: run
  - id: ex-day36-predict-py
    title: Python 자르기 예측하기
    kind: predict
    objective: 음수 인덱스, 건너뛰기, 범위를 넘는 자르기를 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      v = [1, 2, 3, 4, 5, 6]
      print(v[-3:], v[1::2], v[10:])
    answer: "[4, 5, 6] [2, 4, 6] []"
    hint: "-3은 뒤에서 세 번째 칸입니다. 1::2는 1번 칸부터 두 칸씩입니다. 자르기는 범위를 넘어도 오류가 없습니다."
    explanation: "v[-3:]는 뒤에서 세 칸, v[1::2]는 1, 3, 5번 칸(2, 4, 6)입니다. v[10:]은 시작이 길이를 넘었지만 오류 대신 빈 리스트입니다. Rust의 &v[10..]은 패닉이고, v.get(10..)은 None입니다. Python의 너그러운 자르기는 편하지만 실수를 숨길 수도 있습니다."
    commonMistakes:
      - "v[10:]이 IndexError라고 생각함(인덱스 하나 v[10]만 오류)"
      - "v[1::2]를 1, 2번 칸으로 읽음"
    language: python
    verification: run
  - id: ex-day36-fill
    title: 이웃한 두 칸 비교하기 채우기
    kind: fill
    objective: windows(2)로 이웃한 칸의 쌍을 차례로 본다.
    prompt: "빈칸을 채워 바로 앞 칸보다 커진 횟수 '2'가 출력되게 하세요."
    starter: |-
      fn main() {
          let v = [1, 3, 2, 5];
          let rising = v._____(2).filter(|w| w[1] > w[0]).count();
          println!("{rising}");
      }
    answer: |-
      fn main() {
          let v = [1, 3, 2, 5];
          let rising = v.windows(2).filter(|w| w[1] > w[0]).count();
          println!("{rising}");
      }
    output: "2"
    hint: "[1, 3], [3, 2], [2, 5]처럼 한 칸씩 밀리며 겹치는 조각이 필요합니다."
    explanation: "windows(2)는 길이 2인 슬라이스를 한 칸씩 밀며 줍니다. 1→3, 2→5 두 번 커졌습니다. chunks(2)는 겹치지 않게 [1, 3], [2, 5]만 줘서 3→2 비교가 빠지므로 결과는 같아도 의미가 다릅니다. 창 안의 칸은 복사 없이 원래 배열을 빌린 것입니다."
    commonMistakes:
      - "chunks(2)를 써서 경계에 걸친 쌍을 놓침"
      - "windows(2)가 길이 - 1개가 아니라 길이만큼 나온다고 생각함"
    language: rust
    verification: run
  - id: ex-day36-modify
    title: 인덱스 계산을 chunks로 바꾸기
    kind: modify
    objective: 손으로 한 구간 계산을 chunks로 바꿔 마지막 묶음 처리를 맡긴다.
    prompt: "인덱스를 직접 계산해 세 칸씩 더하는 코드를 chunks(3)로 바꿔, 같은 결과 '[6, 15, 7]'이 출력되게 하세요."
    starter: |-
      fn main() {
          let v = [1, 2, 3, 4, 5, 6, 7];
          let mut sums = Vec::new();
          let mut start = 0;
          while start < v.len() {
              let end = if start + 3 < v.len() { start + 3 } else { v.len() };
              sums.push(v[start..end].iter().sum::<i32>());
              start += 3;
          }
          println!("{sums:?}");
      }
    answer: |-
      fn main() {
          let v = [1, 2, 3, 4, 5, 6, 7];
          let sums: Vec<i32> = v.chunks(3).map(|c| c.iter().sum()).collect();
          println!("{sums:?}");
      }
    output: "[6, 15, 7]"
    hint: "chunks(3)는 [1, 2, 3], [4, 5, 6], [7]을 줍니다. 각 묶음의 합을 map으로 구하세요."
    explanation: "원래 코드는 마지막 묶음이 짧을 때 범위를 넘지 않도록 end를 직접 계산했습니다. chunks는 이 경계 처리를 알아서 해 줍니다. 마지막 묶음을 버리고 꽉 찬 묶음만 원하면 chunks_exact(3)를 씁니다."
    commonMistakes:
      - "chunks의 마지막 묶음 [7]이 빠진다고 생각함"
      - "collect의 자료형을 적지 않아 추론 오류가 남"
    language: rust
    verification: run
  - id: ex-day36-debug
    title: 짧은 목록에서 패닉 나는 끝부분 고치기
    kind: debug
    objective: 길이보다 큰 수를 빼서 생기는 패닉을 saturating_sub로 막는다.
    prompt: "last_three(&[1, 2])를 부르면 xs.len() - 3에서 패닉(attempt to subtract with overflow)이 납니다. 목록이 세 칸보다 짧으면 전체를 돌려주도록 고쳐 '[3, 4, 5] [1, 2]'가 출력되게 하세요."
    starter: |-
      fn last_three(xs: &[i32]) -> &[i32] {
          &xs[xs.len() - 3..]
      }

      fn main() {
          println!("{:?} {:?}", last_three(&[1, 2, 3, 4, 5]), last_three(&[1, 2]));
      }
    answer: |-
      fn last_three(xs: &[i32]) -> &[i32] {
          &xs[xs.len().saturating_sub(3)..]
      }

      fn main() {
          println!("{:?} {:?}", last_three(&[1, 2, 3, 4, 5]), last_three(&[1, 2]));
      }
    output: "[3, 4, 5] [1, 2]"
    hint: "usize는 음수가 될 수 없습니다. 2 - 3을 계산하는 순간 문제가 생깁니다. 0 아래로 내려가지 않는 뺄셈이 있습니다."
    explanation: "xs.len()은 usize라 2 - 3은 표현할 수 없어 디버그 빌드에서 패닉입니다. saturating_sub(3)은 결과가 0보다 작아지면 0에서 멈춰서, 짧은 목록은 0..(전체)가 됩니다. if xs.len() < 3 { xs } else { &xs[xs.len() - 3..] }로 써도 됩니다. Python의 xs[-3:]는 짧은 리스트에서도 전체를 돌려줍니다."
    commonMistakes:
      - "xs.len() as i32 - 3으로 바꿔 음수 인덱스를 만듦(usize가 아니라 컴파일 오류)"
      - "&xs[..3]으로 바꿔 앞의 세 칸을 돌려줌"
    language: rust
    verification: run
  - id: ex-day36-independent
    title: C로 길이 k 구간의 최대 합 구하기
    kind: independent
    objective: "[i, i + k) 구간을 한 칸씩 밀며 합을 비교한다."
    prompt: "int max_window(const int a[], int n, int k)를 만들어 연속한 k칸의 합 중 가장 큰 값을 돌려주세요. a = {2, 7, 1, 8, 2, 8}, k = 2일 때 '10'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {2, 7, 1, 8, 2, 8};
          printf("여기에 max_window를 만들어 호출하세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int max_window(const int a[], int n, int k) {
          int best = 0;
          for (int i = 0; i + k <= n; i++) {
              int s = 0;
              for (int j = i; j < i + k; j++) {
                  s += a[j];
              }
              if (i == 0 || s > best) {
                  best = s;
              }
          }
          return best;
      }

      int main(void) {
          int a[] = {2, 7, 1, 8, 2, 8};
          int n = sizeof a / sizeof a[0];
          printf("%d\n", max_window(a, n, 2));
          return 0;
      }
    output: "10"
    hint: "구간의 시작 i는 i + k <= n인 동안만 가능합니다. 합은 9, 8, 9, 10, 10입니다."
    explanation: "Rust의 windows(k)에 해당하는 반복을 직접 썼습니다. 조건 i + k <= n이 창이 배열 밖으로 나가지 않게 막습니다. 매번 k칸을 새로 더하는 대신, 앞에서 빠지는 칸을 빼고 새로 들어오는 칸을 더하면(미끄러지는 창) k와 상관없이 한 번의 반복으로 됩니다. best를 0에서 시작하면 모든 값이 음수일 때 틀리므로 첫 창으로 초기화했습니다."
    commonMistakes:
      - "i < n으로 반복해 마지막 창이 배열 밖을 읽음"
      - "best = 0으로 시작해 음수만 있을 때 0을 돌려줌"
    language: c
    verification: run
quiz:
  - id: quiz-day36-01
    question: v = [10, 20, 30, 40]일 때 &v[1..=2]는?
    choices:
      - "[20]"
      - "[20, 30]"
      - "[10, 20, 30]"
      - "[20, 30, 40]"
    answerIndex: 1
    explanation: ..=는 끝을 포함합니다. 1번과 2번 칸이라 [20, 30]입니다. 1..2였다면 [20]입니다. 슬라이스 길이는 끝 - 시작(포함이면 + 1)입니다.
  - id: quiz-day36-02
    question: 길이 6인 v에서 v.get(4..8)의 결과는?
    choices:
      - "Some([50, 60])"
      - None
      - 패닉
      - 빈 슬라이스
    answerIndex: 1
    explanation: get은 범위가 유효하지 않으면 패닉 대신 None을 돌려줍니다. &v[4..8]로 쓰면 'range end index 8 out of range' 패닉입니다. Python의 v[4:8]은 너그럽게 [50, 60]을 돌려줍니다.
  - id: quiz-day36-03
    question: "[1, 2, 3, 4, 5].windows(2)가 주는 조각의 개수는?"
    choices:
      - "2"
      - "4"
      - "5"
      - "3"
    answerIndex: 1
    explanation: 길이 n에서 크기 k 창은 n - k + 1개입니다. 5 - 2 + 1 = 4개([1,2], [2,3], [3,4], [4,5])입니다. chunks(2)는 겹치지 않아 3개([1,2], [3,4], [5])입니다.
  - id: quiz-day36-04
    question: 정렬된 [10, 20, 30, 40]에서 binary_search(&25)의 결과는?
    choices:
      - "Ok(2)"
      - "Err(2)"
      - None
      - 패닉
    answerIndex: 1
    explanation: 찾으면 Ok(위치), 없으면 Err(값을 넣으면 정렬이 유지되는 위치)입니다. 25는 20과 30 사이, 즉 2번 자리에 들어가야 합니다. 정렬되지 않은 슬라이스에서는 결과가 의미 없습니다.
  - id: quiz-day36-05
    question: Python에서 w = [1, 2, 3]; w[0:2] = [9, 9, 9] 뒤의 w는?
    choices:
      - "[9, 9, 3]"
      - "[9, 9, 9, 3]"
      - ValueError
      - "[9, 9, 9]"
    answerIndex: 1
    explanation: 자르기 대입은 그 구간을 새 목록으로 통째로 바꾸기 때문에 길이가 달라도 됩니다. 두 칸이 세 칸으로 바뀌어 길이가 4가 됩니다. Rust 슬라이스는 길이를 바꿀 수 없어서, Vec의 splice 같은 메서드를 따로 써야 합니다.
---

## 1. 오늘 배울 내용

Day 29와 Day 34에서 슬라이스 `&[T]`를 "주소와 길이를 함께 가진 빌림"으로 짧게 만났습니다. 오늘은 슬라이스를 제대로 다룹니다.

1. **범위(range)** 문법 다섯 가지로 슬라이스를 만듭니다: `a..b`, `a..=b`, `..b`, `a..`, `..`
2. 꺼내기를 두 가지로 나눠 씁니다.
   - 인덱싱 `v[i]`, `&v[a..b]`: 범위를 넘으면 **패닉**
   - `get`, `first`, `last`: 범위를 넘으면 **`None`**
3. 슬라이스를 나눕니다: `split_at`, `chunks`, `windows`
4. 슬라이스에서 찾습니다: `contains`, `position`, `binary_search`
5. 가변 슬라이스로 **일부만** 바꿉니다: `reverse`, `fill`, `swap`
6. 다른 두 언어를 비교합니다.
   - C: `[start, end)` 구간 반복과 포인터·길이 쌍
   - Python: 음수 인덱스, 건너뛰기, 너그러운 자르기, 길이가 바뀌는 자르기 대입
7. 온도 기록에서 **이동 평균**과 **가장 따뜻한 구간**을 찾습니다.

## 2. 왜 필요한가

데이터를 다루다 보면 "전체 중 일부"를 처리하는 일이 대부분입니다.

- 목록의 앞 절반과 뒤 절반을 따로 정렬합니다(병합 정렬, Day 67).
- 최근 7일의 평균을 매일 구합니다(이동 평균).
- 센서 값을 10개씩 묶어 한 줄로 저장합니다.
- 정렬된 목록에서 값이 들어갈 자리를 찾습니다(이진 탐색, Day 64).

C에서는 이런 일마다 시작 인덱스, 끝 인덱스, 길이를 손으로 계산하다가 한 칸씩 틀리는 실수(off-by-one)가 자주 납니다. Rust의 슬라이스와 메서드는 이 계산을 **한 값**에 담고, 범위를 넘으면 조용히 틀리는 대신 멈추거나 `None`을 돌려줍니다.

## 3. 그림으로 이해하기

범위는 **칸 사이의 경계**에 번호를 붙였다고 생각하면 쉽습니다.

```text
경계 번호:  0    1    2    3    4    5    6
            │ 10 │ 20 │ 30 │ 40 │ 50 │ 60 │
            └────┴────┴────┴────┴────┴────┘
1..4        경계 1에서 경계 4까지 → 20 30 40    (칸 3개 = 4 - 1)
1..=4       칸 1부터 칸 4까지    → 20 30 40 50
..2         처음부터 경계 2까지  → 10 20
4..         경계 4부터 끝까지    → 50 60
3..3        같은 경계            → (빈 슬라이스)
```

슬라이스는 원래 목록을 **빌린 창**입니다. 복사가 없습니다.

```text
v    ┌────┬────┬────┬────┬────┬────┐
     │ 10 │ 20 │ 30 │ 40 │ 50 │ 60 │
     └────┴────┴────┴────┴────┴────┘
          ▲
&v[1..4]  (주소 = v의 1번 칸, 길이 = 3)
```

`chunks`와 `windows`의 차이는 **겹치는가**입니다.

```text
chunks(4):   [10 20 30 40] [50 60]              겹치지 않게 4칸씩(마지막은 남는 만큼)
windows(3):  [10 20 30]                          3칸 창을 한 칸씩 민다
                [20 30 40]
                   [30 40 50]
                      [40 50 60]                 6 - 3 + 1 = 4개
```

## 4. 천천히 풀어보기

### 4.1 범위는 값이다

`1..4`는 `Range` 자료형의 **값**입니다. 그래서 변수에 담거나 함수에 넘길 수 있고, `for` 반복에도 씁니다.

| 범위    | 뜻              | `for`에서           | 슬라이스에서 |
| ------- | --------------- | ------------------- | ------------ |
| `a..b`  | a 이상 b 미만   | a, a+1, ..., b-1    | `[a, b)`     |
| `a..=b` | a 이상 b 이하   | a, ..., b           | `[a, b]`     |
| `..b`   | 처음부터 b 미만 | (시작이 없어 못 씀) | `[0, b)`     |
| `a..`   | a부터 끝까지    | 끝없이(주의)        | `[a, len)`   |
| `..`    | 전체            | (못 씀)             | `[0, len)`   |

`(1..=10).sum()`, `(0..10).step_by(2)`, `(1..4).rev()`처럼 범위는 반복자처럼 메서드를 부를 수 있습니다.

### 4.2 패닉인가, None인가

| 쓰는 법                 | 범위 안          | 범위 밖                                | 언제 쓰나                             |
| ----------------------- | ---------------- | -------------------------------------- | ------------------------------------- |
| `v[i]`                  | 값               | 패닉(index out of bounds)              | 범위 안이 **확실**할 때               |
| `&v[a..b]`              | 슬라이스         | 패닉(range end index ... out of range) | 범위 안이 확실할 때                   |
| `v.get(i)`              | `Some(&값)`      | `None`                                 | 사용자가 준 번호처럼 확실하지 않을 때 |
| `v.get(a..b)`           | `Some(슬라이스)` | `None`                                 | 같음                                  |
| `v.first()`, `v.last()` | `Some(&값)`      | 빈 슬라이스면 `None`                   | 빈 목록일 수 있을 때                  |

### 4.3 나누기와 찾기

- `split_at(k)`: `[0, k)`와 `[k, len)` 두 슬라이스를 튜플로 돌려줍니다. `k > len`이면 패닉입니다.
- `chunks(k)`: 겹치지 않는 `k`칸씩. 마지막 묶음은 짧을 수 있습니다.
- `windows(k)`: 한 칸씩 밀리는 `k`칸 창. 길이가 `k`보다 짧으면 창이 하나도 없습니다.
- `contains(&x)`: 있는지 `bool`로.
- `iter().position(조건)`: 조건에 맞는 첫 위치를 `Option<usize>`로.
- `binary_search(&x)`: **정렬된** 슬라이스에서 `Ok(위치)` 또는 `Err(넣을 자리)`.

### 4.4 가변 슬라이스

`&mut v[a..b]`는 그 구간만 바꿀 수 있는 창입니다. `w[..3].reverse()`처럼 메서드를 바로 부르면 컴파일러가 알아서 가변으로 빌립니다. 슬라이스는 **길이를 바꿀 수 없습니다.** 칸을 늘리거나 줄이려면 `Vec`의 메서드(`push`, `insert`, `truncate`, `splice`)를 씁니다.

## 5. Rust로 구현하기

```rust
// 파일: slices.rs
fn main() {
    let v = vec![10, 20, 30, 40, 50, 60];

    // 범위의 여러 모양
    println!("[1..4]  = {:?}", &v[1..4]);   // 1, 2, 3번 칸(4는 빼고)
    println!("[1..=4] = {:?}", &v[1..=4]);  // 4번 칸까지 포함
    println!("[..2]   = {:?}", &v[..2]);    // 처음부터
    println!("[4..]   = {:?}", &v[4..]);    // 끝까지
    println!("[..]    = {:?}", &v[..]);     // 전체
    println!("[3..3]  = {:?}", &v[3..3]);   // 빈 슬라이스도 된다

    // 안전하게 꺼내기: 범위를 넘으면 None
    println!("first {:?}, last {:?}", v.first(), v.last());
    println!("get(2) {:?}, get(9) {:?}", v.get(2), v.get(9));
    println!("get(4..8) {:?}", v.get(4..8));

    // 자르기와 나누기
    let (front, back) = v.split_at(2);
    println!("split_at(2): {front:?} | {back:?}");
    for chunk in v.chunks(4) {              // 4칸씩, 마지막은 남는 만큼
        print!("{chunk:?} ");
    }
    println!();
    for w in v.windows(3) {                 // 3칸짜리 창을 한 칸씩 밀며
        print!("{} ", w.iter().sum::<i32>());
    }
    println!();

    // 찾기
    println!("contains(&30) {}", v.contains(&30));
    println!("position(>35) {:?}", v.iter().position(|&x| x > 35));
    println!("binary_search(&40) {:?}", v.binary_search(&40));   // 정렬된 슬라이스에서
    println!("binary_search(&45) {:?}", v.binary_search(&45));   // 없으면 넣을 자리

    // 가변 슬라이스로 일부만 바꾸기
    let mut w = v.clone();
    w[..3].reverse();
    w[3..].fill(0);
    w.swap(0, 5);
    println!("바꾼 뒤 {w:?}");

    // for와 범위
    let total: i32 = (1..=10).sum();
    let evens: Vec<i32> = (0..10).step_by(2).collect();
    println!("1..=10 합 {total}, 짝수 {evens:?}, 거꾸로 {:?}", (1..4).rev().collect::<Vec<_>>());
}
```

실행 결과:

```text
[1..4]  = [20, 30, 40]
[1..=4] = [20, 30, 40, 50]
[..2]   = [10, 20]
[4..]   = [50, 60]
[..]    = [10, 20, 30, 40, 50, 60]
[3..3]  = []
first Some(10), last Some(60)
get(2) Some(30), get(9) None
get(4..8) None
split_at(2): [10, 20] | [30, 40, 50, 60]
[10, 20, 30, 40] [50, 60]
60 90 120 150
contains(&30) true
position(>35) Some(3)
binary_search(&40) Ok(3)
binary_search(&45) Err(4)
바꾼 뒤 [0, 20, 10, 0, 0, 30]
1..=10 합 55, 짝수 [0, 2, 4, 6, 8], 거꾸로 [3, 2, 1]
```

### 코드 한 부분씩 읽기

| 코드                                              | 설명                                                                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `&v[1..4]`                                        | 1, 2, 3번 칸을 빌린 슬라이스입니다. `&`를 빼면 크기를 모르는 `[i32]`가 되어 변수에 담을 수 없습니다(Day 34의 E0277). |
| `&v[3..3]`                                        | 시작과 끝이 같으면 빈 슬라이스입니다. 오류가 아닙니다. `&v[6..]`(길이와 같은 시작)도 빈 슬라이스입니다.              |
| `v.get(9)`, `v.get(4..8)`                         | 범위를 넘어 `None`입니다. `Option`이라서 `match`나 `if let`으로 처리하도록 강제됩니다.                               |
| `let (front, back) = v.split_at(2);`              | 두 슬라이스를 한 번에 받습니다. 가변 버전 `split_at_mut`은 Day 33에서 썼습니다.                                      |
| `for w in v.windows(3)`                           | `w`는 `&[i32]` 창입니다. `w.iter().sum::<i32>()`에서 `::<i32>`는 합의 자료형을 알려 줍니다.                          |
| `v.iter().position(\|&x\| x > 35)`                | 조건을 처음 만족하는 위치입니다. `\|&x\|`는 받은 `&i32`를 풀어 `x`를 정수로 씁니다.                                  |
| `v.binary_search(&45)`                            | 45는 없고, 넣는다면 4번 자리(40과 50 사이)라서 `Err(4)`입니다.                                                       |
| `w[..3].reverse(); w[3..].fill(0); w.swap(0, 5);` | 앞 세 칸만 뒤집고, 뒤 세 칸만 0으로 채우고, 0번과 5번 칸을 바꿨습니다. `w`의 길이는 그대로 6입니다.                  |

## 6. C로 구현하기

C에는 범위 문법이 없어서, 같은 구간을 **시작과 끝 인덱스**(또는 포인터와 길이)로 표현합니다. `[start, end)`, 즉 끝을 포함하지 않는 약속을 지키면 Rust의 `start..end`와 똑같이 생각할 수 있습니다.

```c
// 파일: ranges.c
#include <stdio.h>

void print_range(const char *label, const int a[], int start, int end) {
    printf("%s [", label);                  // [start, end) 구간을 출력한다
    for (int i = start; i < end; i++) {
        if (i > start) {
            printf(", ");
        }
        printf("%d", a[i]);
    }
    printf("]\n");
}

int sum_range(const int a[], int start, int end) {
    int s = 0;
    for (int i = start; i < end; i++) {
        s += a[i];
    }
    return s;
}

int main(void) {
    int v[6] = {10, 20, 30, 40, 50, 60};
    int n = sizeof v / sizeof v[0];

    print_range("1..4", v, 1, 4);
    print_range("4..", v, 4, n);
    print_range("3..3", v, 3, 3);           // 빈 구간

    printf("창 합:");
    for (int i = 0; i + 3 <= n; i++) {      // i + 3이 n을 넘지 않을 때까지
        printf(" %d", sum_range(v, i, i + 3));
    }
    printf("\n");

    int start = 4, end = 8;                 // Rust의 get(4..8)처럼 직접 검사한다
    if (end > n) {
        printf("%d..%d: 범위를 넘음 (n = %d)\n", start, end, n);
    }

    const int *back = v + 2;                // split_at(2)의 뒤쪽: 주소와 길이
    int back_len = n - 2;
    printf("뒤쪽 첫 값 %d, 길이 %d\n", back[0], back_len);
    return 0;
}
```

실행 결과:

```text
1..4 [20, 30, 40]
4.. [50, 60]
3..3 []
창 합: 60 90 120 150
4..8: 범위를 넘음 (n = 6)
뒤쪽 첫 값 30, 길이 4
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `for (int i = start; i < end; i++)`              | `[start, end)` 구간입니다. 칸 수는 `end - start`이고, `start == end`면 한 번도 돌지 않습니다.                              |
| `if (i > start) { printf(", "); }`               | 첫 칸 앞에만 쉼표를 빼서 Rust의 `{:?}` 모양을 흉내 냈습니다.                                                               |
| `for (int i = 0; i + 3 <= n; i++)`               | `windows(3)`와 같은 반복입니다. 조건을 `i < n`으로 쓰면 마지막 두 창이 배열 밖을 읽습니다.                                 |
| `if (end > n)`                                   | Rust의 `get(4..8)`이 해 주는 검사를 직접 합니다. 이 검사를 빼먹어도 C는 아무 말 없이 배열 밖을 읽습니다.                   |
| `const int *back = v + 2; int back_len = n - 2;` | `split_at(2)`의 뒤쪽 슬라이스를 주소와 길이 두 변수로 나타냈습니다. 둘이 따로 놀지 않게 관리하는 것은 프로그래머 몫입니다. |

## 7. Python으로 구현하기

```python
# 파일: slices.py
v = [10, 20, 30, 40, 50, 60]

print("[1:4]  =", v[1:4])                   # Rust의 1..4
print("[1:5]  =", v[1:5])                   # 끝을 포함하는 문법은 없다: +1
print("[:2]   =", v[:2], " [4:] =", v[4:])
print("[-2:]  =", v[-2:])                   # 음수는 뒤에서부터
print("[::2]  =", v[::2])                   # 두 칸씩 건너뛰기
print("[::-1] =", v[::-1])                  # 거꾸로
print("[4:99] =", v[4:99])                  # 자르기는 범위를 넘어도 오류가 없다

try:
    v[9]                                    # 인덱스 하나는 범위를 넘으면 오류
except IndexError as e:
    print("IndexError:", e)

print("묶음:", [v[i:i + 4] for i in range(0, len(v), 4)])
print("창 합:", [sum(v[i:i + 3]) for i in range(len(v) - 2)])

w = v.copy()
w[:3] = w[:3][::-1]                          # 일부를 뒤집어 다시 넣기
w[3:] = [0] * 3
w[0], w[5] = w[5], w[0]
print("바꾼 뒤", w)
w[1:3] = [7, 7, 7, 7]                        # 자르기 대입은 길이가 달라도 된다
print("길이가 바뀜", w, len(w))

print("range:", list(range(0, 10, 2)), sum(range(1, 11)), list(range(3, 0, -1)))
```

실행 결과:

```text
[1:4]  = [20, 30, 40]
[1:5]  = [20, 30, 40, 50]
[:2]   = [10, 20]  [4:] = [50, 60]
[-2:]  = [50, 60]
[::2]  = [10, 30, 50]
[::-1] = [60, 50, 40, 30, 20, 10]
[4:99] = [50, 60]
IndexError: list index out of range
묶음: [[10, 20, 30, 40], [50, 60]]
창 합: [60, 90, 120, 150]
바꾼 뒤 [0, 20, 10, 0, 0, 30]
길이가 바뀜 [0, 7, 7, 7, 7, 0, 0, 30] 8
range: [0, 2, 4, 6, 8] 55 [3, 2, 1]
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `v[1:4]`                                    | Rust의 `&v[1..4]`와 같은 구간이지만, 결과는 **복사본** 리스트입니다(Day 34).                                                            |
| `v[-2:]`, `v[::2]`, `v[::-1]`               | 음수 인덱스(뒤에서부터)와 건너뛰기는 Python에만 있습니다. Rust에서는 `&v[v.len() - 2..]`, `iter().step_by(2)`, `iter().rev()`로 씁니다. |
| `v[4:99]`                                   | 끝이 길이를 넘어도 오류 없이 있는 만큼만 줍니다. 편하지만, 범위 계산이 틀려도 알아채기 어렵습니다.                                      |
| `v[9]` → `IndexError`                       | 인덱스 **하나**는 범위를 넘으면 오류입니다. 자르기와 인덱싱의 규칙이 다릅니다.                                                          |
| `[v[i:i + 4] for i in range(0, len(v), 4)]` | `chunks(4)`를 자르기로 만든 것입니다. 마지막 조각은 자르기가 알아서 짧게 줍니다.                                                        |
| `w[1:3] = [7, 7, 7, 7]`                     | 두 칸을 네 칸으로 바꿔 리스트 길이가 8이 됐습니다. Rust 슬라이스로는 할 수 없는 일입니다.                                               |

## 8. 실행 추적

Rust 예제의 `w`를 바꾸는 세 줄을 따라갑니다. 시작은 `v.clone()`인 `[10, 20, 30, 40, 50, 60]`입니다.

| 줄                  | 바뀌는 구간  | `w`                        |
| ------------------- | ------------ | -------------------------- |
| 시작                | -            | `[10, 20, 30, 40, 50, 60]` |
| `w[..3].reverse();` | 0~2번 칸     | `[30, 20, 10, 40, 50, 60]` |
| `w[3..].fill(0);`   | 3~5번 칸     | `[30, 20, 10, 0, 0, 0]`    |
| `w.swap(0, 5);`     | 0번과 5번 칸 | `[0, 20, 10, 0, 0, 30]`    |

`w[..3]`과 `w[3..]`은 겹치지 않는 구간이지만, 한 줄씩 차례로 빌렸다가 돌려주므로 `split_at_mut` 없이도 됩니다. 두 구간을 **동시에** 바꿔야 할 때만 `split_at_mut`이 필요합니다(Day 33).

## 9. 다른 예제로 다시 이해하기

**온도 기록 분석.** 두 시간마다 잰 온도 8개가 있습니다. 세 칸 이동 평균, 합이 가장 큰 세 칸 구간, 세 개씩 묶은 평균, 앞뒤 절반의 평균, 오른 횟수를 구합니다.

```rust
// 파일: sensor.rs
fn average(xs: &[f64]) -> f64 {
    xs.iter().sum::<f64>() / xs.len() as f64
}

fn main() {
    // 두 시간마다 잰 온도(하루 12번 중 8번만 사용)
    let temps = [3.0, 2.5, 4.0, 8.5, 12.0, 13.5, 9.0, 5.5];

    let smooth: Vec<String> = temps
        .windows(3)
        .map(|w| format!("{:.1}", average(w)))
        .collect();
    println!("3칸 이동 평균: {}", smooth.join(" "));

    let mut best_start = 0;
    let mut best = f64::MIN;
    for (i, w) in temps.windows(3).enumerate() {   // i는 창이 시작하는 칸
        let s: f64 = w.iter().sum();
        if s > best {
            best = s;
            best_start = i;
        }
    }
    let best_range = best_start..best_start + 3;
    println!("가장 따뜻한 세 칸: {best_range:?} {:?} 합 {best:.1}", &temps[best_range.clone()]);

    for (i, part) in temps.chunks(3).enumerate() {
        println!("묶음 {i}: {part:?} 평균 {:.2}", average(part));
    }

    let (morning, afternoon) = temps.split_at(temps.len() / 2);
    println!("앞 절반 평균 {:.2}, 뒤 절반 평균 {:.2}", average(morning), average(afternoon));

    let rising = temps.windows(2).filter(|w| w[1] > w[0]).count();
    println!("오른 횟수 {rising} / {}", temps.len() - 1);
}
```

실행 결과:

```text
3칸 이동 평균: 3.2 5.0 8.2 11.3 11.5 9.3
가장 따뜻한 세 칸: 4..7 [12.0, 13.5, 9.0] 합 34.5
묶음 0: [3.0, 2.5, 4.0] 평균 3.17
묶음 1: [8.5, 12.0, 13.5] 평균 11.33
묶음 2: [9.0, 5.5] 평균 7.25
앞 절반 평균 4.50, 뒤 절반 평균 10.00
오른 횟수 4 / 7
```

| 코드                                           | 설명                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `fn average(xs: &[f64]) -> f64`                | 창, 묶음, 절반 모두 `&[f64]`라 한 함수로 평균을 구합니다. 슬라이스를 받는 함수가 쓰임새가 넓은 이유입니다.                             |
| `for (i, w) in temps.windows(3).enumerate()`   | `i`는 창이 시작하는 칸 번호입니다. 합이 더 크면 `best`와 `best_start`를 바꿉니다.                                                      |
| `let best_range = best_start..best_start + 3;` | 범위를 값으로 저장했습니다. `{best_range:?}`는 `4..7`로 출력됩니다. 슬라이스에 쓸 때 `clone()`한 이유는 범위 값이 옮겨지기 때문입니다. |
| `temps.chunks(3)`                              | 8칸을 3, 3, 2칸으로 나눴습니다. 마지막 묶음의 평균도 자기 길이(2)로 나눠야 맞습니다.                                                   |
| `temps.windows(2).filter(\|w\| w[1] > w[0])`   | 이웃한 두 칸을 비교해 오른 횟수를 셉니다. 비교할 쌍은 7개입니다.                                                                       |

같은 분석을 Python 자르기로 옮기면 다음과 같습니다.

```python
# 파일: sensor.py
def average(xs):
    return sum(xs) / len(xs)


temps = [3.0, 2.5, 4.0, 8.5, 12.0, 13.5, 9.0, 5.5]

windows = [temps[i:i + 3] for i in range(len(temps) - 2)]
print("3칸 이동 평균:", " ".join(f"{average(w):.1f}" for w in windows))

best_start = max(range(len(windows)), key=lambda i: sum(windows[i]))
print(f"가장 따뜻한 세 칸: {best_start}..{best_start + 3}", windows[best_start], f"합 {sum(windows[best_start]):.1f}")

for i, start in enumerate(range(0, len(temps), 3)):
    part = temps[start:start + 3]           # 마지막 묶음은 자르기가 알아서 짧아진다
    print(f"묶음 {i}: {part} 평균 {average(part):.2f}")

half = len(temps) // 2
print(f"앞 절반 평균 {average(temps[:half]):.2f}, 뒤 절반 평균 {average(temps[half:]):.2f}")

rising = sum(1 for a, b in zip(temps, temps[1:]) if b > a)
print(f"오른 횟수 {rising} / {len(temps) - 1}")
```

실행 결과:

```text
3칸 이동 평균: 3.2 5.0 8.2 11.3 11.5 9.3
가장 따뜻한 세 칸: 4..7 [12.0, 13.5, 9.0] 합 34.5
묶음 0: [3.0, 2.5, 4.0] 평균 3.17
묶음 1: [8.5, 12.0, 13.5] 평균 11.33
묶음 2: [9.0, 5.5] 평균 7.25
앞 절반 평균 4.50, 뒤 절반 평균 10.00
오른 횟수 4 / 7
```

- `range(len(temps) - 2)`가 창의 시작 번호입니다. 길이 8에서 크기 3인 창은 8 - 3 + 1 = 6개입니다.
- `max(range(...), key=...)`는 "합이 가장 큰 창의 번호"를 한 줄로 찾습니다. 합이 같은 창이 여러 개면 **처음 것**을 돌려주는데, Rust 코드의 `s > best`(같으면 바꾸지 않음)와 같은 규칙입니다.
- `zip(temps, temps[1:])`는 이웃한 쌍을 만듭니다. `temps[1:]`이 복사본을 만든다는 점만 빼면 `windows(2)`와 같습니다.

## 10. 슬라이스 메서드 모음

| 하고 싶은 일       | Rust                | Python                         | C                           |
| ------------------ | ------------------- | ------------------------------ | --------------------------- |
| 구간               | `&v[a..b]`          | `v[a:b]` (복사)                | `v + a`, 길이 `b - a`       |
| 끝 포함 구간       | `&v[a..=b]`         | `v[a:b + 1]`                   | `v + a`, 길이 `b - a + 1`   |
| 안전하게 한 칸     | `v.get(i)`          | `v[i] if i < len(v) else None` | `i < n`을 직접 검사         |
| 뒤에서 k칸         | `&v[v.len() - k..]` | `v[-k:]`                       | `v + n - k`, 길이 `k`       |
| 나누기             | `split_at(k)`       | `v[:k]`, `v[k:]`               | 포인터 두 개와 길이 두 개   |
| k칸씩 묶기         | `chunks(k)`         | `v[i:i + k]` 반복              | `i += k` 반복               |
| 밀리는 창          | `windows(k)`        | `v[i:i + k]` (`i`를 1씩)       | `i + k <= n` 반복           |
| 정렬된 곳에서 찾기 | `binary_search(&x)` | `bisect.bisect_left(v, x)`     | `bsearch` 또는 직접(Day 64) |

## 11. 세 언어 비교

| 관점                 | Rust                         | C                    | Python                                      |
| -------------------- | ---------------------------- | -------------------- | ------------------------------------------- |
| 구간을 나타내는 것   | 슬라이스(주소 + 길이, 한 값) | 포인터와 길이(두 값) | 새 리스트(복사)                             |
| 범위를 넘으면        | 패닉, 또는 `get`으로 `None`  | 정의되지 않은 동작   | 인덱스는 `IndexError`, 자르기는 조용히 잘림 |
| 구간을 바꾸면 원본은 | 바뀜(`&mut` 슬라이스)        | 바뀜                 | 안 바뀜(복사본), 자르기 대입은 바뀜         |
| 구간의 길이 바꾸기   | 못 함(`Vec` 메서드 사용)     | 못 함                | 자르기 대입으로 가능                        |
| 끝 포함 문법         | `a..=b`                      | 없음(`<=`로 반복)    | 없음(`b + 1`)                               |

## 12. 자주 하는 실수

### 실수 1: 범위의 끝을 길이보다 크게 준다 (Rust)

```rust
// 파일: range_end.rs (실행 오류: range end index 8 out of range for slice of length 6)
fn main() {
    let v = vec![10, 20, 30, 40, 50, 60];
    let last_four = &v[4..8];
    println!("{last_four:?}");
}
```

Python의 `v[4:8]`처럼 잘라 줄 거라 기대하면 안 됩니다. 확실하지 않은 범위에는 `v.get(4..8)`을 쓰고 `None`을 처리하세요.

### 실수 2: 슬라이스를 든 채로 Vec을 늘린다 (Rust)

```rust
// 파일: slice_push.rs (컴파일 오류: E0502)
fn main() {
    let mut v = vec![3, 1, 2];
    let s = &v[..];
    v.push(4);
    println!("{s:?}");
}
```

슬라이스는 `v`를 빌린 것이라, 살아 있는 동안 `push`(더 큰 공간으로 옮길 수 있음)를 할 수 없습니다. 슬라이스를 다 쓴 뒤에 `push`하세요(Day 33).

### 실수 3: usize에서 빼다가 0 아래로 내려간다 (Rust)

실습의 디버그 문제입니다. `v.len() - 3`은 목록이 짧으면 패닉입니다. `saturating_sub`나 길이 검사를 먼저 하세요.

### 실수 4: 끝 포함과 미포함을 섞는다 (세 언어)

"1번부터 4번 칸까지"를 Rust에서 `1..4`, Python에서 `v[1:4]`, C에서 `i < 4`로 쓰면 모두 4번 칸이 빠집니다. 끝을 포함하려면 `1..=4`, `v[1:5]`, `i <= 4`입니다. 헷갈리면 "칸 수 = 끝 - 시작"을 떠올리세요.

### 실수 5: 너그러운 자르기에 기대어 오류를 숨긴다 (Python)

`v[start:start + k]`는 `start`가 틀려도 빈 리스트나 짧은 리스트를 조용히 돌려줍니다. 길이가 꼭 `k`여야 하는 곳이라면 결과의 `len()`을 검사하세요.

## 13. Q&A

**Q. &v[1..4]와 v[1..4].to_vec()은 어떻게 다른가요?**

A. 앞의 것은 원래 `v`를 빌린 창이라 복사가 없고, `v`가 살아 있는 동안만 쓸 수 있습니다. `to_vec()`은 새 `Vec`으로 **복사**해서 따로 소유합니다. Python의 `v[1:4]`는 뒤의 것과 같습니다.

**Q. 왜 범위의 끝을 포함하지 않는 것이 기본인가요?**

A. 반쯤 열린 구간 `[a, b)`는 계산이 깔끔합니다. 길이가 `b - a`이고, `[0, k)`와 `[k, n)`처럼 이어 붙이면 겹치거나 빠지는 칸이 없으며, 빈 구간을 `a..a`로 쓸 수 있습니다. C의 `i < n`, Python의 `range`, Rust의 `..`가 모두 같은 약속을 따릅니다.

**Q. 문자열 &str도 슬라이스인가요?**

A. 네, `&str`은 UTF-8 바이트의 슬라이스입니다. 그래서 `&s[0..3]`처럼 자를 수 있지만, 경계가 한글 글자 중간에 걸리면 패닉입니다(한글 한 글자는 3바이트). Day 39에서 자세히 다룹니다.

**Q. chunks의 마지막 짧은 묶음이 싫으면요?**

A. `chunks_exact(k)`는 꽉 찬 묶음만 주고, 남은 칸은 `.remainder()`로 따로 꺼낼 수 있습니다. 뒤에서부터 묶는 `rchunks(k)`도 있습니다.

## 14. 핵심 요약

- 범위 `a..b`는 끝을 포함하지 않고, `a..=b`는 포함합니다. `..b`, `a..`, `..`는 처음·끝·전체입니다.
- `&v[a..b]`는 원래 목록을 **복사 없이 빌린** 슬라이스입니다. 빌린 동안 원래 `Vec`을 늘리거나 줄일 수 없습니다.
- 인덱싱은 범위를 넘으면 패닉, `get`·`first`·`last`는 `None`입니다. 확실하지 않은 번호에는 `get`을 쓰세요.
- `split_at`은 둘로, `chunks`는 겹치지 않게, `windows`는 한 칸씩 밀며 나눕니다. 크기 k 창은 n - k + 1개입니다.
- 가변 슬라이스로 구간만 `reverse`·`fill`·`swap`할 수 있지만, 길이는 바꿀 수 없습니다.
- C는 같은 구간을 `[start, end)` 반복과 포인터·길이로, Python은 복사본을 만드는 자르기로 나타냅니다. Python 자르기는 범위를 넘어도 오류가 없습니다.

## 15. 도전 문제

1. **(Rust)** `fn trimmed_mean(xs: &mut [f64]) -> Option<f64>`를 만들어, 정렬(`sort_by(|a, b| a.total_cmp(b))`)한 뒤 가장 작은 값과 가장 큰 값을 뺀 가운데 슬라이스의 평균을 돌려주세요. 칸이 3개보다 적으면 `None`입니다.
2. **(Rust)** 온도 예제에서 "연속으로 오른 가장 긴 구간"의 범위(`a..b`)를 찾아 슬라이스와 함께 출력하세요.
3. **(C)** 미끄러지는 창 방식으로 `max_window`를 다시 쓰세요. 첫 창의 합을 구한 뒤, 한 칸 밀 때마다 빠지는 칸을 빼고 들어오는 칸을 더합니다.
4. **(Python)** `def chunks(v, k)`와 `def windows(v, k)`를 제너레이터(`yield`)로 만들고, 길이가 `k`보다 짧은 리스트에서 `windows`가 아무것도 내지 않는지 확인하세요.
