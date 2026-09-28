---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-28-vec-review
courseId: crp-92
phaseId: phase-03
dayNumber: 28
date: "2026-10-28"
title: 배열·리스트·Vec 복습 — 목록을 함수에 넘기고 안전하게 다루기
summary: Day 26~27의 C 배열, Python 리스트를 Rust의 Vec과 함께 정리합니다. Vec의 길이와 용량, 범위를 벗어나도 멈추지 않는 get과 first·last, 배열과 Vec을 모두 받는 슬라이스 매개변수(&[T], &mut [T]), iter·iter_mut로 읽고 제자리에서 바꾸기, 이웃한 값을 보는 windows와 묶음으로 나누는 chunks를 익히고, 같은 통계 함수를 C(배열 + 길이), Python(리스트)으로 만들어 목록을 함수에 넘길 때 무엇이 복사되고 무엇이 공유되는지 비교합니다. 좌석 예약표를 2차원 목록으로 만들어 복습합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 100
prerequisites: [day-27-python-list]
learningObjectives:
  - Vec의 길이와 용량을 구별하고, get·first·last로 범위를 벗어나도 멈추지 않게 읽는다.
  - 슬라이스 매개변수(&[T], &mut [T])로 배열과 Vec을 모두 받는 함수를 만든다.
  - iter, iter_mut, windows, chunks로 목록을 읽고, 바꾸고, 나눠 본다.
  - C(배열 + 길이), Python(리스트), Rust(슬라이스)에서 목록을 함수에 넘길 때의 공유와 복사를 설명한다.
  - 2차원 목록으로 좌석 예약처럼 줄과 칸으로 된 데이터를 다룬다.
concepts:
  [
    vec,
    capacity,
    slice,
    borrowing,
    iter,
    iter_mut,
    windows,
    chunks,
    get,
    two dimensional list,
    review,
  ]
runnerMode: python
playgroundSource: |
  # 파일: review.py — 목록을 함수에 넘기면 원본이 바뀌는지 확인해 보세요.
  def add_bonus(xs, bonus):
      for i in range(len(xs)):
          xs[i] = min(xs[i] + bonus, 100)

  scores = [72, 95, 88]
  add_bonus(scores, 5)
  print(scores)
  print([b - a for a, b in zip(scores, scores[1:])])
  print([scores[i:i + 2] for i in range(0, len(scores), 2)])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day28-predict-rs
    title: get으로 안전하게 읽기 예측하기
    kind: predict
    objective: get이 범위를 벗어나면 None을 돌려준다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let v = vec![4, 8, 15];
          println!("{:?} {:?} {}", v.get(1), v.get(3), v.len());
      }
    answer: "Some(8) None 3"
    hint: "v[3]은 패닉이지만 v.get(3)은 Option을 돌려줍니다."
    explanation: "get은 칸이 있으면 Some(&값), 없으면 None입니다. 사용자가 고른 번호처럼 범위를 믿을 수 없는 인덱스에는 get을 쓰고 match로 처리합니다. Debug 형식으로 출력하면 Some(8)처럼 보입니다."
    commonMistakes:
      - "v.get(1)을 4로 적음(0부터 셈)"
      - "v.get(3)이 패닉이라고 생각함"
    language: rust
    verification: run
  - id: ex-day28-predict-py
    title: 대입과 자르기 복사 예측하기
    kind: predict
    objective: 대입은 같은 리스트를 가리키고, 자르기는 새 리스트를 만든다는 것을 확인한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      a = [1, 2, 3]
      b = a
      c = a[:]
      b.append(4)
      print(len(a), len(c))
    answer: "4 3"
    hint: "b는 a와 같은 리스트이고, c는 복사본입니다."
    explanation: "b.append(4)는 a와 b가 함께 가리키는 리스트를 바꾸므로 a의 길이도 4가 됩니다. c = a[:]는 그 순간의 새 리스트라 3개 그대로입니다. Rust에서 let b = a;는 소유권을 옮기고, let c = a.clone();이 복사입니다."
    commonMistakes:
      - "b = a가 복사라고 생각해 3 3으로 적음"
      - "c도 함께 바뀐다고 생각해 4 4로 적음"
    language: python
    verification: run
  - id: ex-day28-fill
    title: 슬라이스 매개변수 채우기
    kind: fill
    objective: 배열과 Vec을 모두 받는 함수의 매개변수 자료형을 쓴다.
    prompt: "빈칸에 자료형을 채워, Vec과 배열을 모두 받아 합을 구하는 total이 '6 15'를 출력하게 하세요."
    starter: |-
      fn total(xs: _____) -> i32 {
          xs.iter().sum()
      }

      fn main() {
          let v = vec![1, 2, 3];
          let a = [4, 5, 6];
          println!("{} {}", total(&v), total(&a));
      }
    answer: |-
      fn total(xs: &[i32]) -> i32 {
          xs.iter().sum()
      }

      fn main() {
          let v = vec![1, 2, 3];
          let a = [4, 5, 6];
          println!("{} {}", total(&v), total(&a));
      }
    output: "6 15"
    hint: "i32 값들이 나란히 있는 곳을 '빌려 보는' 자료형입니다."
    explanation: "&[i32]는 슬라이스로, 칸들의 시작 위치와 길이를 함께 가집니다. &Vec<i32>와 &[i32; 3]은 모두 &[i32]로 바뀌어 넘어갈 수 있습니다. 매개변수를 &Vec<i32>로 쓰면 배열을 넘길 수 없고, [i32; 3]으로 쓰면 크기가 3인 배열만 받습니다."
    commonMistakes:
      - "&Vec<i32>로 써서 배열을 넘길 때 오류가 남"
      - "&를 빼고 Vec<i32>로 받아 v의 소유권이 넘어감"
    language: rust
    verification: run
  - id: ex-day28-modify
    title: 목록 통계를 한 번에 돌려주기
    kind: modify
    objective: 목록을 받아 여러 결과를 튜플로 돌려주는 함수를 만든다.
    prompt: "최솟값만 돌려주는 함수를 stats(xs)로 바꿔 (최솟값, 최댓값, 평균)을 돌려주고, [3, 9, 4]에 대해 '3 9 5.33'을 출력하세요."
    starter: |-
      def smallest(xs):
          best = xs[0]
          for x in xs:
              if x < best:
                  best = x
          return best


      print(smallest([3, 9, 4]))
    answer: |-
      def stats(xs):
          low = high = xs[0]
          for x in xs:
              if x < low:
                  low = x
              if x > high:
                  high = x
          return low, high, sum(xs) / len(xs)


      low, high, avg = stats([3, 9, 4])
      print(low, high, f"{avg:.2f}")
    output: "3 9 5.33"
    hint: "한 번의 반복에서 최솟값과 최댓값을 함께 갱신하고, return a, b, c로 세 값을 돌려주세요."
    explanation: "여러 결과를 튜플로 돌려주면 부른 쪽에서 나눠 받을 수 있습니다(Day 20). 목록을 한 번만 돌면서 두 누적 변수를 함께 갱신했습니다. 빈 목록이면 xs[0]에서 IndexError가 나므로, 실제로는 빈 목록을 먼저 검사해야 합니다."
    commonMistakes:
      - "if 대신 elif를 써서, 첫 값이 최솟값과 최댓값이 동시에 되는 경우를 놓칠까 걱정함(여기서는 둘 다 xs[0]에서 시작하므로 elif도 됨)"
      - "평균을 정수 나눗셈 //로 구함"
    language: python
    verification: run
  - id: ex-day28-debug
    title: 옮겨 간 Vec을 다시 쓰는 오류 고치기
    kind: debug
    objective: Vec을 대입하면 소유권이 옮겨 가서 원래 이름을 쓸 수 없다는 것을 확인한다.
    prompt: "이 코드는 E0382(borrow of moved value: `v`) 오류로 컴파일되지 않습니다. 두 목록을 모두 출력할 수 있게 고쳐 '[1, 2, 3] [1, 2, 3]'이 나오게 하세요."
    starter: |-
      fn main() {
          let v = vec![1, 2, 3];
          let w = v;
          println!("{v:?} {w:?}");
      }
    answer: |-
      fn main() {
          let v = vec![1, 2, 3];
          let w = v.clone();
          println!("{v:?} {w:?}");
      }
    output: "[1, 2, 3] [1, 2, 3]"
    hint: "let w = v;는 복사가 아니라 v가 가진 목록을 w에게 넘겨주는 것입니다. 복사본이 필요하면 명시적으로 만드세요."
    explanation: "Vec은 힙 메모리에 있는 목록을 소유합니다. let w = v;로 소유권이 w로 옮겨 가면 v는 더 이상 쓸 수 없습니다. 같은 내용이 두 개 필요하면 clone()으로 복사하고, 같은 목록을 함께 보기만 하면 let w = &v;로 빌립니다. 소유권은 Day 32에서 자세히 배웁니다."
    commonMistakes:
      - "let w = &v;로 고친 뒤 w를 바꾸려다 또 오류가 남(빌린 것은 기본으로 읽기만 가능)"
      - "정수 배열 [i32; 3]은 복사되는데 Vec은 왜 안 되는지 헷갈림"
    language: rust
    verification: run
  - id: ex-day28-independent
    title: C로 기준보다 큰 값 세기
    kind: independent
    objective: 배열과 길이를 받는 함수를 만든다.
    prompt: "int count_above(const int a[], int n, int limit)를 만들어 {72, 95, 88, 61, 90}에서 80보다 큰 값의 개수 3을 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int scores[] = {72, 95, 88, 61, 90};
          printf("%d\n", scores[0]);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int count_above(const int a[], int n, int limit) {
          int count = 0;
          for (int i = 0; i < n; i++) {
              if (a[i] > limit) {
                  count++;
              }
          }
          return count;
      }

      int main(void) {
          int scores[] = {72, 95, 88, 61, 90};
          int n = sizeof scores / sizeof scores[0];
          printf("%d\n", count_above(scores, n, 80));
          return 0;
      }
    output: "3"
    hint: "함수 안에서는 sizeof로 배열의 칸 수를 알 수 없으니, main에서 구한 칸 수를 n으로 넘기세요."
    explanation: "C 함수에 배열을 넘기면 첫 칸의 위치만 넘어가서 칸 수 정보가 사라집니다(Day 34). 그래서 C의 배열 함수는 거의 항상 (배열, 길이) 짝으로 받습니다. const는 '이 함수는 배열을 바꾸지 않는다'는 약속이라, 실수로 a[i] = ...를 쓰면 컴파일 오류가 납니다. Rust의 &[i32]는 길이를 함께 가지고 다닙니다."
    commonMistakes:
      - "함수 안에서 sizeof a / sizeof a[0]으로 칸 수를 구해 틀린 값이 나옴(경고도 남)"
      - ">= limit로 써서 80점까지 셈"
    language: c
    verification: run
quiz:
  - id: quiz-day28-01
    question: Rust Vec의 len()과 capacity()의 차이는?
    choices:
      - 같은 값이다
      - len은 실제로 든 값의 개수, capacity는 다시 늘리지 않고 담을 수 있는 칸 수
      - capacity는 항상 len의 두 배다
      - len은 바이트 수다
    answerIndex: 1
    explanation: Python 리스트처럼 Vec도 여유 칸을 미리 준비합니다. 가득 차면 더 큰 공간으로 옮깁니다. 넣을 개수를 알면 Vec::with_capacity(n)으로 미리 준비해 옮기는 횟수를 줄일 수 있습니다. capacity가 정확히 몇이 될지는 표준 라이브러리 구현에 따라 달라질 수 있습니다.
  - id: quiz-day28-02
    question: 배열 [i32; 3]과 Vec<i32>를 모두 받는 함수의 매개변수로 가장 알맞은 것은?
    choices: ["Vec<i32>", "&Vec<i32>", "&[i32]", "[i32; 3]"]
    answerIndex: 2
    explanation: 슬라이스 &[i32]는 '이어진 i32 칸들을 빌려 본다'는 뜻이라 배열, Vec, Vec의 일부(&v[1..3])를 모두 받습니다. 목록을 읽기만 하는 함수는 &[T], 바꾸는 함수는 &mut [T]로 받는 것이 관례입니다.
  - id: quiz-day28-03
    question: Rust에서 v.windows(2)가 [1, 4, 9]에 대해 만드는 것은?
    choices:
      - "[1, 4], [9]"
      - "[1, 4], [4, 9]"
      - "[1], [4], [9]"
      - "[1, 4, 9]"
    answerIndex: 1
    explanation: windows(k)는 길이 k의 창을 한 칸씩 밀며 보여 줍니다(겹침). chunks(k)는 겹치지 않게 k개씩 자르고, 마지막 조각은 짧을 수 있습니다([1, 4], [9]).
  - id: quiz-day28-04
    question: Python 함수에 리스트를 넘긴 뒤 함수 안에서 xs[0] = 99를 하면?
    choices:
      - 함수 안의 복사본만 바뀐다
      - 부른 쪽의 리스트도 바뀐다(같은 리스트를 가리키므로)
      - 오류가 난다
      - 아무 일도 일어나지 않는다
    answerIndex: 1
    explanation: 리스트를 넘기면 리스트가 복사되지 않고 같은 리스트를 가리키는 이름이 매개변수로 만들어집니다. 칸을 바꾸면 부른 쪽에도 보입니다. 반면 xs = [99]처럼 이름에 새 리스트를 대입하면 부른 쪽과 관계가 끊어집니다(Day 31, 44).
  - id: quiz-day28-05
    question: C 함수에서 배열 매개변수에 const를 붙이는 이유는?
    choices:
      - 배열을 빠르게 만들려고
      - 함수가 배열의 내용을 바꾸지 않는다는 것을 약속하고, 실수로 바꾸면 컴파일러가 막게 하려고
      - 배열을 복사하려고
      - 길이를 함께 넘기려고
    answerIndex: 1
    explanation: C 배열 매개변수는 원본을 가리키므로 함수가 바꾸면 부른 쪽도 바뀝니다. 읽기만 하는 함수에 const를 붙이면 의도가 드러나고 실수를 막을 수 있습니다. Rust의 &[T](읽기)와 &mut [T](쓰기)의 구별과 같은 생각입니다.
---

## 1. 오늘 배울 내용

Day 26(C 배열)과 Day 27(Python 리스트)을 복습하면서 Rust의 **`Vec`** 을 더 깊이 봅니다. 특히 "목록을 **함수에 넘길 때** 무엇이 복사되고 무엇이 공유되는가"를 세 언어로 비교합니다.

1. Vec의 **길이와 용량**, 범위를 벗어나도 멈추지 않는 `get`, `first`, `last`.
2. 배열과 Vec을 모두 받는 **슬라이스 매개변수**를 씁니다.
   - 읽기: `&[T]`
   - 쓰기: `&mut [T]`
3. 목록을 다루는 도구를 익힙니다.
   - `iter`: 읽기
   - `iter_mut`: 제자리에서 바꾸기
   - `windows`: 이웃한 값 보기
   - `chunks`: 묶음으로 나누기
4. 같은 통계 함수를 C(배열 + 길이), Python(리스트)으로 만들어 비교합니다.
5. 좌석 예약표를 **2차원 목록**으로 만듭니다.

## 2. 왜 필요한가

목록을 다루는 코드는 대부분 **함수**로 나뉩니다. 평균 구하기, 보너스 더하기, 조 나누기 같은 함수에 목록을 넘길 때 두 가지를 분명히 알아야 합니다.

- 함수가 목록을 **바꾸면** 부른 쪽 목록도 바뀌는가?
- 함수가 목록의 **길이**를 어떻게 아는가?

세 언어의 답이 다릅니다. C는 배열을 넘기면 원본을 가리키고 길이는 사라집니다. Python은 원본을 가리키고 `len`으로 길이를 압니다. Rust는 **빌림**의 종류(`&` 읽기, `&mut` 쓰기)로 바꿀 수 있는지를 자료형에 드러내고, 슬라이스가 길이를 가지고 다닙니다. 이 차이를 모르면 "함수를 불렀더니 원본이 망가졌다", "길이를 잘못 알아 배열 밖을 읽었다" 같은 버그가 생깁니다.

## 3. 그림으로 이해하기

세 언어에서 목록을 함수에 넘기는 모습입니다.

```text
C: average(scores, n)                 Python: average(scores)            Rust: average(&scores)

main의 scores ┌──┬──┬──┐             scores ──┐                         scores(Vec) ──▶ 힙 [72│95│88]
              │72│95│88│                      ▼                                              ▲
              └──┴──┴──┘               리스트 객체 [72, 95, 88]                               │
                 ▲                            ▲                         xs: &[i32]  = (시작 위치, 길이 3)
함수의 a ────────┘ (첫 칸 위치만)      함수의 xs ┘(같은 리스트)            빌려 보는 "창"
+ 길이 n을 따로 넘김                    길이는 len(xs)                     &mut [i32]면 바꿀 수도 있음
```

- **C**: 배열의 첫 칸 위치만 넘어갑니다. 길이는 따로 넘기고, 함수가 바꾸면 원본이 바뀝니다.
- **Python**: 같은 리스트를 가리키는 이름이 하나 더 생깁니다. 바꾸면 원본이 바뀝니다.
- **Rust**: 슬라이스(시작 위치 + 길이)를 **빌려** 줍니다. `&`는 읽기만, `&mut`는 쓰기도 가능하고, 컴파일러가 이 약속을 검사합니다.

`windows`와 `chunks`는 목록을 보는 두 가지 창입니다.

```text
[77, 100, 93, 66, 95, 63]

windows(2):  [77,100] [100,93] [93,66] [66,95] [95,63]    한 칸씩 밀며 겹치게(5개)
chunks(4):   [77,100,93,66] [95,63]                        겹치지 않게 4개씩(마지막은 남은 만큼)
```

## 4. 천천히 풀어보기

### 4.1 Vec의 길이와 용량

| 메서드                  | 뜻                                          |
| ----------------------- | ------------------------------------------- |
| `v.len()`               | 실제로 든 값의 개수                         |
| `v.capacity()`          | 다시 늘리지 않고 담을 수 있는 칸 수(≥ 길이) |
| `Vec::with_capacity(n)` | n칸을 미리 준비한 빈 Vec                    |
| `v.is_empty()`          | 비었는지                                    |

Python 리스트처럼 Vec도 가득 차면 더 큰 공간으로 옮깁니다(Day 27). 정확히 몇 칸으로 늘지는 표준 라이브러리 구현이 정하므로, 코드가 그 숫자에 기대면 안 됩니다.

### 4.2 안전하게 읽기

| 코드             | 칸이 있으면     | 칸이 없으면    |
| ---------------- | --------------- | -------------- |
| `v[i]`           | 값              | **패닉**       |
| `v.get(i)`       | `Some(&값)`     | `None`         |
| `v.first()`      | `Some(&첫 값)`  | `None`(빈 Vec) |
| `v.last()`       | `Some(&끝 값)`  | `None`(빈 Vec) |
| `v.iter().min()` | `Some(&최솟값)` | `None`(빈 Vec) |

프로그램이 정한 인덱스(반복 변수 `i < len`)는 `v[i]`로, 사용자나 파일에서 온 인덱스는 `get`으로 읽는 것이 좋은 습관입니다.

### 4.3 목록을 함수에 넘기기

| 하고 싶은 일            | C                         | Python                   | Rust                               |
| ----------------------- | ------------------------- | ------------------------ | ---------------------------------- |
| 읽기만 하는 함수        | `f(const int a[], int n)` | `def f(xs):`             | `fn f(xs: &[i32])`                 |
| 칸을 바꾸는 함수        | `f(int a[], int n)`       | `def f(xs):` (그대로)    | `fn f(xs: &mut [i32])`             |
| 길이·항목을 늘리는 함수 | (Day 40의 동적 배열)      | `def f(xs): xs.append()` | `fn f(xs: &mut Vec<i32>)`          |
| 목록을 통째로 넘겨주기  | (없음)                    | (없음)                   | `fn f(xs: Vec<i32>)` (소유권 이동) |
| 부르는 모양             | `f(scores, n)`            | `f(scores)`              | `f(&scores)`, `f(&mut scores)`     |

Rust에서 `&mut [i32]`는 칸의 값을 바꿀 수는 있지만 **길이를 바꿀 수는 없습니다**. `push`처럼 길이를 바꾸려면 `&mut Vec<i32>`를 받아야 합니다.

### 4.4 읽기, 바꾸기, 가져가기

| 반복 모양                                   | 받는 것        | 원본                              |
| ------------------------------------------- | -------------- | --------------------------------- |
| `for x in v.iter()` / `for x in &v`         | `&T`(읽기)     | 그대로, 뒤에서도 사용 가능        |
| `for x in v.iter_mut()` / `for x in &mut v` | `&mut T`(쓰기) | 제자리에서 바뀜                   |
| `for x in v` / `v.into_iter()`              | `T`(값 자체)   | **가져가 버림**, 뒤에서 사용 불가 |

`iter_mut`에서 받은 `x`는 칸을 가리키는 참조라, 값을 바꾸려면 `*x = ...`처럼 `*`를 붙입니다(Day 33).

## 5. Rust로 구현하기

```rust
// 파일: vec_review.rs
fn average(xs: &[i32]) -> Option<f64> {        // 배열이든 Vec이든 슬라이스로 받는다
    if xs.is_empty() {
        None
    } else {
        Some(xs.iter().sum::<i32>() as f64 / xs.len() as f64)
    }
}

fn add_bonus(xs: &mut [i32], bonus: i32) {    // 빌려서 제자리에서 바꾼다
    for x in xs.iter_mut() {
        *x = (*x + bonus).min(100);
    }
}

fn main() {
    let mut scores = vec![72, 95, 88, 61, 90, 58];
    println!("길이 {}, 용량이 길이 이상? {}", scores.len(), scores.capacity() >= scores.len());
    println!("first {:?}, last {:?}, get(10) {:?}", scores.first(), scores.last(), scores.get(10));
    println!("min {:?}, max {:?}", scores.iter().min(), scores.iter().max());
    match average(&scores) {
        Some(avg) => println!("평균 {avg:.1}"),
        None => println!("평균 없음"),
    }
    println!("빈 목록의 평균: {:?}", average(&[]));

    add_bonus(&mut scores, 5);
    println!("보너스 뒤: {scores:?}");

    let diffs: Vec<i32> = scores.windows(2).map(|w| w[1] - w[0]).collect();
    println!("이웃한 차이: {diffs:?}");
    for (i, group) in scores.chunks(4).enumerate() {
        println!("{}조: {group:?}", i + 1);
    }
    let passed: Vec<i32> = scores.iter().copied().filter(|&s| s >= 70).collect();
    println!("70점 이상: {passed:?}");

    let names = vec![String::from("민지"), String::from("준호")];
    for name in &names {                        // 빌려서 돈다 → 뒤에서도 names를 쓸 수 있다
        print!("{name} ");
    }
    println!();
    let moved = names;                          // 소유권이 moved로 옮겨 간다(Day 32)
    println!("옮겨 간 목록: {moved:?}");
}
```

실행 결과:

```text
길이 6, 용량이 길이 이상? true
first Some(72), last Some(58), get(10) None
min Some(58), max Some(95)
평균 77.3
빈 목록의 평균: None
보너스 뒤: [77, 100, 93, 66, 95, 63]
이웃한 차이: [23, -7, -27, 29, -32]
1조: [77, 100, 93, 66]
2조: [95, 63]
70점 이상: [77, 100, 93, 95]
민지 준호
옮겨 간 목록: ["민지", "준호"]
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                                                |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn average(xs: &[i32]) -> Option<f64>`                  | 읽기만 하므로 `&[i32]`로 받습니다. 빈 목록이면 평균이 없어서 `Option`으로 돌려줍니다(Day 25).                                                       |
| `xs.iter().sum::<i32>()`                                 | `sum`은 결과 자료형을 알려 줘야 해서 `::<i32>`를 붙였습니다.                                                                                        |
| `fn add_bonus(xs: &mut [i32], bonus: i32)`               | 칸의 값을 바꾸므로 `&mut [i32]`입니다. 부를 때도 `&mut scores`로 "바꿔도 된다"를 명시합니다.                                                        |
| `for x in xs.iter_mut() { *x = (*x + bonus).min(100); }` | `x`는 칸을 가리키는 참조입니다. `*x`로 칸의 값을 읽고 씁니다. `.min(100)`으로 100을 넘지 않게 합니다.                                               |
| `scores.first()`, `scores.get(10)`                       | 칸이 없을 수 있는 읽기라 `Option`입니다. `get(10)`은 패닉 없이 `None`입니다.                                                                        |
| `average(&[])`                                           | 빈 슬라이스를 넘겼습니다. 배열 리터럴을 빌려서 바로 넘길 수 있습니다.                                                                               |
| `scores.windows(2).map(\|w\| w[1] - w[0])`               | 길이 2의 창마다 뒤 값 − 앞 값입니다. Day 26에서 인덱스로 하던 "이웃한 두 칸"을 범위 걱정 없이 합니다.                                               |
| `scores.chunks(4).enumerate()`                           | 4개씩 나눈 조각에 번호를 붙입니다. 마지막 조각은 2개입니다.                                                                                         |
| `for name in &names` / `let moved = names;`              | `&names`로 빌려서 돌았기 때문에 반복 뒤에도 `names`를 쓸 수 있고, 마지막에 소유권을 `moved`로 옮겼습니다. 그 뒤로 `names`는 쓸 수 없습니다(Day 32). |

## 6. C로 구현하기

C에는 슬라이스가 없어서, 목록을 받는 함수는 항상 **배열과 길이**를 함께 받습니다. 결과가 없을 수 있는 `average`는 성공 여부를 `bool`로 돌려주고, 결과 값은 **포인터**(`double *out`)가 가리키는 곳에 적습니다. 포인터는 Day 29부터 배우니, 지금은 "결과를 적어 줄 상자의 위치를 넘긴다"로 읽으세요.

```c
// 파일: array_review.c
#include <stdio.h>
#include <stdbool.h>

bool average(const int a[], int n, double *out) {     // 결과는 out이 가리키는 곳에(Day 43)
    if (n == 0) {
        return false;
    }
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
    }
    *out = (double)sum / n;
    return true;
}

void add_bonus(int a[], int n, int bonus) {           // 배열 매개변수는 원본을 바꾼다
    for (int i = 0; i < n; i++) {
        a[i] = a[i] + bonus > 100 ? 100 : a[i] + bonus;
    }
}

void print_array(const char *label, const int a[], int n) {
    printf("%s [", label);
    for (int i = 0; i < n; i++) {
        printf(i == 0 ? "%d" : ", %d", a[i]);
    }
    printf("]\n");
}

int main(void) {
    int scores[] = {72, 95, 88, 61, 90, 58};
    int n = sizeof scores / sizeof scores[0];
    printf("길이 %d\n", n);
    printf("first %d, last %d\n", scores[0], scores[n - 1]);

    double avg;
    if (average(scores, n, &avg)) {
        printf("평균 %.1f\n", avg);
    }
    printf("빈 목록의 평균 있음? %d\n", average(scores, 0, &avg));

    add_bonus(scores, n, 5);
    print_array("보너스 뒤:", scores, n);

    int diffs[5];
    for (int i = 0; i < n - 1; i++) {
        diffs[i] = scores[i + 1] - scores[i];
    }
    print_array("이웃한 차이:", diffs, n - 1);
    for (int start = 0; start < n; start += 4) {
        int size = n - start < 4 ? n - start : 4;     // 마지막 조는 남은 만큼
        printf("%d조:", start / 4 + 1);
        print_array("", scores + start, size);        // start번 칸부터의 배열(Day 30)
    }
    return 0;
}
```

실행 결과:

```text
길이 6
first 72, last 58
평균 77.3
빈 목록의 평균 있음? 0
보너스 뒤: [77, 100, 93, 66, 95, 63]
이웃한 차이: [23, -7, -27, 29, -32]
1조: [77, 100, 93, 66]
2조: [95, 63]
```

### 코드 한 부분씩 읽기

| 코드                                              | 설명                                                                                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `bool average(const int a[], int n, double *out)` | 읽기만 하는 배열에는 `const`를 붙였습니다. 성공하면 `*out`에 평균을 적고 `true`를 돌려줍니다. Rust의 `Option<f64>`를 C로 흉내 낸 모양입니다. |
| `average(scores, n, &avg)`                        | `&avg`는 "`avg`라는 상자의 위치"입니다. 함수가 그 위치에 값을 적어 줍니다(Day 43).                                                           |
| `void add_bonus(int a[], int n, int bonus)`       | `const`가 없으니 배열을 바꿀 수 있고, 바꾸면 **원본이** 바뀝니다. 배열은 복사되어 넘어가지 않기 때문입니다.                                  |
| `int diffs[5];` ... `n - 1`                       | 이웃한 차이는 칸 수보다 하나 적습니다(Day 26).                                                                                               |
| `scores + start`                                  | "`start`번 칸부터 시작하는 배열"이라는 뜻입니다. 이렇게 배열의 뒷부분을 함수에 넘길 수 있습니다. 포인터 산술은 Day 30에서 배웁니다.          |
| `int size = n - start < 4 ? n - start : 4;`       | 마지막 조는 남은 개수만큼입니다. Rust의 `chunks`가 알아서 해 주는 계산입니다.                                                                |

## 7. Python으로 구현하기

Python은 리스트를 넘기면 같은 리스트를 가리키므로, 함수 안에서 칸을 바꾸면 부른 쪽에 보입니다. 길이는 `len`으로 언제든 알 수 있습니다.

```python
# 파일: list_review.py
def average(xs):
    if not xs:
        return None
    return sum(xs) / len(xs)


def add_bonus(xs, bonus):                   # 리스트의 칸을 바꾸면 부른 쪽에도 보인다
    for i in range(len(xs)):
        xs[i] = min(xs[i] + bonus, 100)


scores = [72, 95, 88, 61, 90, 58]
print(f"길이 {len(scores)}")
print(f"first {scores[0]}, last {scores[-1]}")
print(f"min {min(scores)}, max {max(scores)}")
print(f"평균 {average(scores):.1f}")
print("빈 목록의 평균:", average([]))

add_bonus(scores, 5)
print("보너스 뒤:", scores)

diffs = [b - a for a, b in zip(scores, scores[1:])]
print("이웃한 차이:", diffs)
for i in range(0, len(scores), 4):
    print(f"{i // 4 + 1}조: {scores[i:i + 4]}")
print("70점 이상:", [s for s in scores if s >= 70])
```

실행 결과:

```text
길이 6
first 72, last 58
min 58, max 95
평균 77.3
빈 목록의 평균: None
보너스 뒤: [77, 100, 93, 66, 95, 63]
이웃한 차이: [23, -7, -27, 29, -32]
1조: [77, 100, 93, 66]
2조: [95, 63]
70점 이상: [77, 100, 93, 95]
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `def add_bonus(xs, bonus): ... xs[i] = ...`    | 칸에 대입하므로 부른 쪽의 `scores`가 바뀝니다. `for x in xs: x = ...`처럼 반복 변수에 대입하면 원본은 바뀌지 않으니, 인덱스로 칸에 대입했습니다. |
| `[b - a for a, b in zip(scores, scores[1:])]`  | Rust의 `windows(2)`에 해당합니다(Day 26).                                                                                                        |
| `range(0, len(scores), 4)` / `scores[i:i + 4]` | 4칸씩 건너뛰며 자릅니다. 자르기는 범위를 벗어나도 있는 만큼만 돌려줘서 마지막 조가 자연스럽게 짧아집니다. Rust의 `chunks(4)`와 같습니다.         |

세 언어의 통계 결과가 모두 같습니다.

## 8. 실행 추적

Rust의 `add_bonus(&mut scores, 5)`가 칸을 하나씩 바꾸는 과정입니다. 원래 `scores = [72, 95, 88, 61, 90, 58]`입니다.

|  칸 | `*x`(전) | `*x + 5` | `.min(100)` | `*x`(후) |
| --: | -------: | -------: | ----------: | -------: |
|   0 |       72 |       77 |          77 |       77 |
|   1 |       95 |      100 |         100 |      100 |
|   2 |       88 |       93 |          93 |       93 |
|   3 |       61 |       66 |          66 |       66 |
|   4 |       90 |       95 |          95 |       95 |
|   5 |       58 |       63 |          63 |       63 |

함수가 끝난 뒤 `main`의 `scores`가 바뀌어 있습니다. 새 목록을 만든 것이 아니라 **빌린 칸들을 제자리에서** 바꿨기 때문입니다. `&mut`를 빼고 `&scores`로 넘기면 바꿀 수 없다는 컴파일 오류가 납니다.

## 9. 다른 예제로 다시 이해하기

**좌석 예약표.** 3줄 5칸의 좌석을 2차원 목록으로 만들고, 예약 요청을 차례로 처리합니다. 없는 좌석이나 이미 예약된 좌석은 실패로 알립니다(Day 25). Rust는 `Vec<Vec<char>>`, Python은 리스트의 리스트입니다.

```rust
// 파일: seats.rs
fn seat_name(row: usize, col: usize) -> String {
    format!("{}{}", (b'A' + row as u8) as char, col + 1)
}

fn reserve(seats: &mut [Vec<char>], row: usize, col: usize) -> Result<(), String> {
    if row >= seats.len() || col >= seats[row].len() {
        return Err(String::from("없는 좌석"));
    }
    if seats[row][col] == 'X' {
        return Err(String::from("이미 예약됨"));
    }
    seats[row][col] = 'X';
    Ok(())
}

fn main() {
    let mut seats = vec![vec!['.'; 5]; 3];          // 3줄 5칸, 모두 빈 좌석
    for (row, col) in [(0, 1), (1, 3), (0, 1), (3, 0), (2, 4)] {
        match reserve(&mut seats, row, col) {
            Ok(()) => println!("{} 예약 완료", seat_name(row, col)),
            Err(why) => println!("{} 실패: {why}", seat_name(row, col)),
        }
    }
    println!("  1 2 3 4 5");
    for (r, line) in seats.iter().enumerate() {
        let cells: Vec<String> = line.iter().map(|c| c.to_string()).collect();
        println!("{} {}", (b'A' + r as u8) as char, cells.join(" "));
    }
    let empty = seats.iter().flatten().filter(|&&c| c == '.').count();
    println!("빈 좌석 {empty}개");
}
```

실행 결과:

```text
A2 예약 완료
B4 예약 완료
A2 실패: 이미 예약됨
D1 실패: 없는 좌석
C5 예약 완료
  1 2 3 4 5
A . X . . .
B . . . X .
C . . . . X
빈 좌석 12개
```

| 코드                                                 | 설명                                                                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `vec![vec!['.'; 5]; 3]`                              | 줄마다 복사된 5칸짜리 `Vec` 세 개입니다(Day 27의 공유 함정 없음).                                                              |
| `fn reserve(seats: &mut [Vec<char>], ...)`           | 줄들의 슬라이스를 **바꿀 수 있게** 빌립니다. 좌석 칸을 바꾸지만 줄의 개수는 바꾸지 않으므로 `&mut Vec<...>`가 아니어도 됩니다. |
| `if row >= seats.len() \|\| col >= seats[row].len()` | 인덱스를 쓰기 전에 범위를 검사합니다. 단락 평가 덕분에 없는 줄의 `seats[row]`를 읽지 않습니다(Day 8).                          |
| `(b'A' + row as u8) as char`                         | 줄 번호 0, 1, 2를 글자 A, B, C로 바꿉니다(Day 3의 글자 번호).                                                                  |
| `seats.iter().flatten().filter(...).count()`         | `flatten`은 2차원 목록을 한 줄로 이어 보이게 합니다. 모든 칸 중 빈 좌석을 셉니다.                                              |

```python
# 파일: seats.py
def seat_name(row, col):
    return f"{chr(ord('A') + row)}{col + 1}"


def reserve(seats, row, col):
    if not (0 <= row < len(seats) and 0 <= col < len(seats[row])):
        return "없는 좌석"
    if seats[row][col] == "X":
        return "이미 예약됨"
    seats[row][col] = "X"
    return None                                 # None = 성공


seats = [["."] * 5 for _ in range(3)]            # 줄마다 새 리스트
for row, col in [(0, 1), (1, 3), (0, 1), (3, 0), (2, 4)]:
    error = reserve(seats, row, col)
    if error is None:
        print(seat_name(row, col), "예약 완료")
    else:
        print(seat_name(row, col), "실패:", error)
print("  1 2 3 4 5")
for r, line in enumerate(seats):
    print(chr(ord("A") + r), " ".join(line))
empty = sum(line.count(".") for line in seats)
print(f"빈 좌석 {empty}개")
```

실행 결과:

```text
A2 예약 완료
B4 예약 완료
A2 실패: 이미 예약됨
D1 실패: 없는 좌석
C5 예약 완료
  1 2 3 4 5
A . X . . .
B . . . X .
C . . . . X
빈 좌석 12개
```

Python의 `reserve`는 오류 메시지 문자열이나 `None`(성공)을 돌려줍니다. Rust의 `Result<(), String>`을 흉내 낸 모양인데, 부른 쪽이 `None` 검사를 잊어도 알려 주지 않는다는 점이 다릅니다. `[["."] * 5 for _ in range(3)]`로 줄마다 새 리스트를 만들었기 때문에 한 좌석을 예약해도 다른 줄이 바뀌지 않습니다.

## 10. 세 가지 목록 한눈에 보기

| 관점          | C 배열                       | Python 리스트          | Rust 배열 `[T; N]`    | Rust `Vec<T>`                       |
| ------------- | ---------------------------- | ---------------------- | --------------------- | ----------------------------------- |
| 크기          | 고정                         | 가변                   | 고정(자료형의 일부)   | 가변                                |
| 메모리        | 스택(지역 변수)              | 힙                     | 스택                  | 힙                                  |
| 길이 알기     | `sizeof`(선언한 곳에서만)    | `len(xs)`              | `a.len()`             | `v.len()`                           |
| 범위 밖 읽기  | 정의되지 않은 동작           | `IndexError`           | 패닉 / `get` → `None` | 패닉 / `get` → `None`               |
| 함수에 넘기기 | 첫 칸 위치 + 길이(원본 공유) | 같은 리스트(원본 공유) | `&[T]` / `&mut [T]`   | `&[T]` / `&mut [T]` / `&mut Vec<T>` |
| 대입 `b = a`  | 불가                         | 같은 리스트를 가리킴   | 통째로 복사           | 소유권 이동(`clone`으로 복사)       |

## 11. 세 언어 비교

| 관점                       | C                      | Python                              | Rust                                |
| -------------------------- | ---------------------- | ----------------------------------- | ----------------------------------- |
| 함수가 원본을 바꿀 수 있나 | 예(막으려면 `const`)   | 예(막을 방법이 없음, 복사해서 넘김) | `&mut`로 넘길 때만                  |
| 바꿀 수 있는지가 보이나    | `const` 유무           | 보이지 않음                         | `&`와 `&mut`로 부르는 쪽까지 드러남 |
| 겹치는 창·묶음 나누기      | 인덱스로 직접          | `zip`, 자르기                       | `windows`, `chunks`                 |
| 결과가 없을 수 있는 계산   | `bool` + 포인터로 결과 | `None`                              | `Option`                            |

## 12. 자주 하는 실수

### 실수 1: 옮겨 간 Vec을 다시 쓴다 (Rust)

실습의 디버그 문제입니다. `let w = v;`는 소유권 이동입니다. 복사가 필요하면 `clone()`, 함께 보기만 하면 `&v`를 쓰세요.

### 실수 2: &로 빌린 목록을 바꾸려 한다 (Rust)

```rust
// 파일: borrow_mut.rs (컴파일 오류: E0594)
fn add_one(xs: &[i32]) {
    xs[0] += 1;
}

fn main() {
    let mut v = vec![1, 2, 3];
    add_one(&v);
    println!("{v:?}");
}
```

`&[i32]`는 읽기 전용 빌림이라 `cannot assign to xs[_], which is behind a & reference` 오류가 납니다. 바꾸려면 매개변수를 `&mut [i32]`로, 부르는 곳을 `add_one(&mut v)`로 바꿉니다.

### 실수 3: 함수 안에서 sizeof로 배열 길이를 구한다 (C)

```c
// 파일: sizeof_param.c (컴파일 오류: will return size of 'const int *')
#include <stdio.h>

int length(const int a[]) {
    return sizeof a / sizeof a[0];
}

int main(void) {
    int scores[] = {72, 95, 88, 61, 90};
    printf("%d\n", length(scores));
    return 0;
}
```

함수 매개변수 `a[]`는 사실 포인터라 `sizeof a`는 포인터의 크기(8)입니다. gcc가 이 실수를 경고해 줍니다. 길이는 부르는 쪽에서 구해 넘기세요.

### 실수 4: 반복 변수에 대입해 원본을 바꾸려 한다 (Python)

```python
# 파일: loop_assign.py
scores = [72, 95, 88]
for s in scores:
    s = s + 5
print(scores)
```

실행 결과:

```text
[72, 95, 88]
```

`s`는 칸의 값을 가리키는 이름일 뿐이라, 새 값을 대입해도 리스트의 칸은 그대로입니다. 인덱스로 `scores[i] = ...`에 대입하거나 새 리스트 `[s + 5 for s in scores]`를 만드세요. Rust의 `iter_mut`와 `*x = ...`는 칸 자체를 바꿉니다.

### 실수 5: 반복 중인 Vec을 바꾼다 (Rust)

```rust
// 파일: push_while_iter.rs (컴파일 오류: E0502)
fn main() {
    let mut v = vec![1, 2, 3];
    for x in &v {
        if *x == 2 {
            v.push(4);
        }
    }
    println!("{v:?}");
}
```

`&v`로 빌려서 도는 동안 `v.push`로 바꾸려 하면 빌림 규칙 위반입니다. `push`가 Vec을 더 큰 공간으로 옮기면 빌린 참조가 사라진 곳을 가리키게 되기 때문입니다. Day 27에서 본 Python의 "반복 중 변경" 버그를 Rust는 컴파일할 때 막아 줍니다. 추가할 값을 따로 모았다가 반복이 끝난 뒤 넣으세요.

## 13. Q&A

**Q. Rust에서 &Vec<i32> 대신 &[i32]를 받으라고 하는 이유는?**

A. `&[i32]`가 더 많은 것을 받기 때문입니다. `&Vec<i32>`는 Vec만 받지만, `&[i32]`는 Vec, 배열, Vec의 일부(`&v[2..5]`)를 모두 받습니다. 함수가 목록을 읽기만 한다면 가장 넓게 받는 쪽이 쓰기 편합니다.

**Q. Python에서 함수가 리스트를 바꾸지 못하게 하려면?**

A. 부르는 쪽에서 복사본을 넘기거나(`f(scores[:])`), 바꿀 수 없는 튜플로 바꿔 넘기는(`f(tuple(scores))`) 방법이 있습니다. 함수를 만드는 쪽에서는 "원본을 바꾸지 않고 새 리스트를 돌려준다"는 규칙을 지키는 것이 가장 좋습니다(`sorted`처럼).

**Q. C에서 배열을 통째로 복사해서 함수에 넘길 수는 없나요?**

A. 배열 자체로는 안 되지만, 배열을 구조체 안에 넣으면 구조체는 복사되어 넘어갑니다(Day 50). 다만 큰 배열을 복사하면 느리므로, 보통은 `const`를 붙여 가리키게 하고 필요할 때만 직접 복사합니다.

**Q. Vec에 넣을 개수를 알면 with_capacity를 꼭 써야 하나요?**

A. 꼭은 아닙니다. 늘어나는 비용은 평균적으로 작습니다(Day 27의 분할 상환). 수백만 개를 넣는 성능이 중요한 코드에서 옮기는 횟수를 줄이려고 씁니다.

## 14. 핵심 요약

- Vec은 크기가 변하는 힙 목록입니다. `len`은 든 개수, `capacity`는 준비된 칸 수입니다. `get`, `first`, `last`는 범위를 벗어나면 `None`을 돌려줍니다.
- 목록을 받는 Rust 함수는 슬라이스로 받습니다. 읽기는 `&[T]`, 칸 바꾸기는 `&mut [T]`, 길이까지 바꾸기는 `&mut Vec<T>`입니다. 부르는 쪽도 `&`, `&mut`로 의도를 드러냅니다.
- `iter`(읽기), `iter_mut`(제자리 바꾸기, `*x = ...`), `windows(k)`(겹치는 창), `chunks(k)`(겹치지 않는 묶음).
- C는 배열의 첫 칸 위치만 넘어가서 원본을 공유하고 길이를 잃습니다. 길이를 함께 넘기고, 읽기 전용이면 `const`를 붙입니다.
- Python은 같은 리스트를 넘겨 원본을 공유합니다. 칸에 대입하면 원본이 바뀌고, 반복 변수에 대입해도 원본은 바뀌지 않습니다.
- Rust는 반복 중인 Vec을 바꾸는 코드를 컴파일할 때 막습니다.

## 15. 도전 문제

1. **(Rust)** `fn normalize(xs: &mut [f64])`를 만들어 모든 값을 최댓값으로 나눠 0~1 사이로 바꾸세요. 빈 슬라이스와 최댓값이 0인 경우를 처리하세요.
2. **(C)** 배열의 일부를 뒤집는 `void reverse_range(int a[], int from, int to)`를 만들어 `{1, 2, 3, 4, 5, 6}`에서 1~4번 칸만 뒤집어 `{1, 5, 4, 3, 2, 6}`을 만드세요.
3. **(Python)** 9절의 좌석표에 "연속한 빈 좌석 k개를 찾아 한 번에 예약"하는 기능을 추가하세요. 같은 줄에서만 찾습니다.
4. **(세 언어)** 목록에서 합이 가장 큰 연속 3칸(창)을 찾아 그 위치와 합을 출력하세요. Rust는 `windows(3)`, Python은 자르기, C는 인덱스로 쓰세요.
