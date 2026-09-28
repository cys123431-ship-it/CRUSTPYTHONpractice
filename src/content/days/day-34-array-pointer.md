---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-34-array-pointer
courseId: crp-92
phaseId: phase-04
dayNumber: 34
date: "2026-11-03"
title: C 배열 매개변수와 길이
summary: C에서 배열을 함수에 넘기면 첫 칸의 주소만 전달되고 길이는 따라가지 않습니다. 길이를 함께 넘기는 관례, 읽기 전용 const 배열, 배열의 일부만 넘기기(a + 1), 끝 표시(sentinel)로 길이 알리기, 열 수를 적어야 하는 2차원 배열 매개변수, 함수 안에서 sizeof가 포인터 크기를 돌려주는 함정을 다룹니다. Python의 리스트와 *args, Rust의 슬라이스 &[T]·&mut [T]·[[T; N]]와 비교하고, 배열을 제자리에서 k칸 돌리는 프로그램을 세 번 뒤집기로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-33-shared-borrow]
learningObjectives:
  - C 함수가 배열 대신 첫 칸의 주소를 받는다는 것을 설명하고, 길이를 함께 넘기는 함수를 만든다.
  - 함수 안의 sizeof가 포인터 크기를 돌려주는 이유를 설명하고, 길이를 선언한 곳에서 구한다.
  - const 배열 매개변수, 배열의 일부 넘기기, 끝 표시로 길이 알리기를 사용한다.
  - 2차원 배열 매개변수에 열 수를 적어야 하는 이유를 설명한다.
  - 같은 함수를 Python 리스트와 Rust 슬라이스로 옮기고, 길이가 어떻게 따라가는지 비교한다.
concepts:
  [
    array parameter,
    array decay,
    pointer,
    length parameter,
    sizeof pitfall,
    const array,
    sub array,
    sentinel,
    2d array parameter,
    slice,
    varargs,
    in place rotation,
  ]
runnerMode: python
playgroundSource: |
  # 파일: list_params.py — 리스트는 길이를 스스로 압니다. C와 비교해 보세요.
  def total(xs):
      return sum(xs)

  def fill_into(out, value):
      for i in range(len(out)):
          out[i] = value

  scores = [72, 95, 88, 61, 90]
  print(len(scores), total(scores), total(scores[1:4]))
  buffer = [0, 0, 0]
  fill_into(buffer, 9)
  print(buffer)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day34-predict-c
    title: 배열의 일부를 넘긴 합 예측하기
    kind: predict
    objective: a + k가 k번 칸부터 시작하는 배열처럼 전달된다는 것을 추적한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int sum(const int a[], int n) {
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          return s;
      }

      int main(void) {
          int a[6] = {1, 2, 3, 4, 5, 6};
          printf("%d %d\n", sum(a, 6), sum(a + 2, 3));
          return 0;
      }
    answer: "21 12"
    hint: "a + 2는 a[2]의 주소입니다. 함수 안의 a[0]은 원래의 a[2], a[1]은 a[3]입니다."
    explanation: "sum(a, 6)은 1부터 6까지 더해 21입니다. sum(a + 2, 3)은 a[2]부터 세 칸(3, 4, 5)을 더해 12입니다. 함수는 주소와 길이만 받기 때문에 '배열 전체'인지 '일부'인지 구별하지 않습니다. 넘기는 쪽이 길이를 정확히 알려 줄 책임이 있습니다."
    commonMistakes:
      - "a + 2를 값 a[0] + 2로 생각함"
      - "a[2]부터 끝까지(3 + 4 + 5 + 6 = 18)를 더한다고 생각함"
    language: c
    verification: run
  - id: ex-day34-predict-rs
    title: 슬라이스의 길이 예측하기
    kind: predict
    objective: Rust 슬라이스가 길이를 함께 가지고 다닌다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn describe(xs: &[i32]) -> String {
          format!("{}칸 첫 값 {}", xs.len(), xs[0])
      }

      fn main() {
          let a = [10, 20, 30, 40, 50];
          println!("{} / {}", describe(&a), describe(&a[3..]));
      }
    answer: "5칸 첫 값 10 / 2칸 첫 값 40"
    hint: "&a[3..]은 3번 칸부터 끝까지입니다. 슬라이스는 시작 주소와 길이를 함께 가집니다."
    explanation: "&a는 배열 전체를 가리키는 슬라이스(길이 5)가 되고, &a[3..]은 a[3]부터 끝까지(40, 50)인 길이 2의 슬라이스입니다. C에서라면 sum(a + 3, 2)처럼 길이를 따로 넘겨야 하는 것을, Rust는 슬라이스 하나에 담아 넘깁니다. 범위를 넘는 인덱스는 실행 중에 검사되어 패닉이 납니다."
    commonMistakes:
      - "&a[3..]이 3칸이라고 생각함"
      - "슬라이스의 첫 값이 원래 배열의 첫 값(10)이라고 생각함"
    language: rust
    verification: run
  - id: ex-day34-fill
    title: 선언한 곳에서 길이 구하기 채우기
    kind: fill
    objective: sizeof 배열 / sizeof 첫 칸으로 원소 개수를 구해 함수에 넘긴다.
    prompt: "빈칸을 채워 배열의 원소 개수를 구하고 '4 100'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int sum(const int a[], int n) {
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          return s;
      }

      int main(void) {
          int a[] = {10, 20, 30, 40};
          int n = sizeof a / _____;
          printf("%d %d\n", n, sum(a, n));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int sum(const int a[], int n) {
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          return s;
      }

      int main(void) {
          int a[] = {10, 20, 30, 40};
          int n = sizeof a / sizeof a[0];
          printf("%d %d\n", n, sum(a, n));
          return 0;
      }
    output: "4 100"
    hint: "sizeof a는 배열 전체의 바이트 수(16), 나누는 값은 한 칸의 바이트 수입니다."
    explanation: "main 안에서 a는 진짜 배열이라 sizeof a가 16바이트입니다. 한 칸 sizeof a[0](4바이트)로 나누면 4칸입니다. sizeof(int)로 나눠도 되지만, a[0]로 쓰면 나중에 자료형을 double로 바꿔도 식을 고칠 필요가 없습니다. 이 식은 함수 안의 매개변수에는 쓸 수 없습니다(포인터이기 때문)."
    commonMistakes:
      - "sizeof a를 그대로 길이로 써서 16이 됨"
      - "이 식을 sum 함수 안에서 계산함"
    language: c
    verification: run
  - id: ex-day34-modify
    title: 새 리스트를 돌려주는 함수를 제자리 버전으로 바꾸기
    kind: modify
    objective: 부른 쪽의 리스트를 바꾸는 함수와 새 리스트를 돌려주는 함수를 구별한다.
    prompt: "doubled는 새 리스트를 돌려줍니다. 이것을 받은 리스트를 제자리에서 두 배로 바꾸는 double_in_place(xs)로 고쳐, 반환값 없이 '[2, 4, 6]'이 출력되게 하세요."
    starter: |-
      def doubled(xs):
          return [x * 2 for x in xs]


      nums = [1, 2, 3]
      nums = doubled(nums)
      print(nums)
    answer: |-
      def double_in_place(xs):
          for i in range(len(xs)):
              xs[i] *= 2


      nums = [1, 2, 3]
      double_in_place(nums)
      print(nums)
    output: "[2, 4, 6]"
    hint: "for x in xs: x *= 2는 이름 x만 바꿉니다. 인덱스로 칸에 대입해야 리스트가 바뀝니다."
    explanation: "Python 함수는 리스트 객체 자체를 받으므로 xs[i]에 대입하면 부른 쪽의 nums가 바뀝니다. C의 void fill(int out[], int n)과 같은 모양입니다. xs[:] = [x * 2 for x in xs]로 써도 제자리 대입이 됩니다. xs = [...]로 쓰면 함수 안의 이름만 새 리스트를 가리키고 nums는 그대로입니다."
    commonMistakes:
      - "for x in xs: x *= 2로 써서 리스트가 그대로임"
      - "xs = [x * 2 for x in xs]로 이름만 바꿈"
    language: python
    verification: run
  - id: ex-day34-debug
    title: 한 칸 넘겨 읽는 반복 고치기
    kind: debug
    objective: 길이 n인 배열의 마지막 인덱스가 n - 1이라는 것을 반복 조건에 반영한다.
    prompt: "이 코드는 i <= n 때문에 배열 밖의 a[4]를 읽습니다(정의되지 않은 동작이라 결과가 매번 다를 수 있습니다). 조건을 고쳐 가장 큰 값 '95'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int max_of(const int a[], int n) {
          int best = a[0];
          for (int i = 1; i <= n; i++) {
              if (a[i] > best) {
                  best = a[i];
              }
          }
          return best;
      }

      int main(void) {
          int a[4] = {72, 95, 88, 61};
          printf("%d\n", max_of(a, 4));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int max_of(const int a[], int n) {
          int best = a[0];
          for (int i = 1; i < n; i++) {
              if (a[i] > best) {
                  best = a[i];
              }
          }
          return best;
      }

      int main(void) {
          int a[4] = {72, 95, 88, 61};
          printf("%d\n", max_of(a, 4));
          return 0;
      }
    output: "95"
    hint: "칸이 4개면 인덱스는 0, 1, 2, 3입니다. i가 4일 때 반복이 멈춰야 합니다."
    explanation: "C는 범위를 검사하지 않아서 a[4]를 읽으면 배열 바로 뒤의 메모리에 있던 아무 값이나 읽습니다. 그 값이 95보다 크면 틀린 답이 나오고, 운이 나쁘면 프로그램이 멈춥니다. Python은 IndexError, Rust는 패닉으로 바로 알려 주는 오류입니다. 또 n이 0이면 a[0]부터 잘못이므로, 실무에서는 빈 배열을 먼저 검사합니다."
    commonMistakes:
      - "i를 0부터 시작하게만 바꾸고 <=는 그대로 둠"
      - "n - 1을 넘겨 호출 쪽에서 맞추려다 마지막 칸을 빠뜨림"
    language: c
    verification: run
  - id: ex-day34-independent
    title: Rust로 두 슬라이스의 내적 구하기
    kind: independent
    objective: 슬라이스 두 개를 받아 길이를 확인하고 같은 번호끼리 곱해 더한다.
    prompt: "fn dot(a: &[i32], b: &[i32]) -> Option<i32>를 만들어, 길이가 다르면 None, 같으면 같은 번호끼리 곱한 합을 돌려주세요. dot(&[1, 2, 3], &[4, 5, 6])과 dot(&[1], &[1, 2])를 출력해 'Some(32) None'이 나오게 하세요."
    starter: |-
      fn main() {
          println!("여기에 dot 함수를 만들어 호출하세요");
      }
    answer: |-
      fn dot(a: &[i32], b: &[i32]) -> Option<i32> {
          if a.len() != b.len() {
              return None;
          }
          Some(a.iter().zip(b).map(|(x, y)| x * y).sum())
      }

      fn main() {
          println!("{:?} {:?}", dot(&[1, 2, 3], &[4, 5, 6]), dot(&[1], &[1, 2]));
      }
    output: "Some(32) None"
    hint: "a.len()으로 길이를 바로 알 수 있습니다. 같은 번호끼리 짝지을 때는 zip이 편합니다."
    explanation: "1 * 4 + 2 * 5 + 3 * 6 = 32입니다. C라면 int dot(const int a[], const int b[], int n)처럼 길이 하나만 받게 되어, 두 배열의 길이가 정말 같은지는 부르는 쪽을 믿을 수밖에 없습니다. 슬라이스는 각자 길이를 가지므로 함수가 직접 확인할 수 있습니다."
    commonMistakes:
      - "길이를 확인하지 않고 zip만 써서 짧은 쪽에서 조용히 멈춤"
      - "for i in 0..a.len()으로 돌며 b[i]를 읽어 길이가 다르면 패닉이 남"
    language: rust
    verification: run
quiz:
  - id: quiz-day34-01
    question: C에서 void f(int a[])의 매개변수 a의 실제 자료형은?
    choices:
      - int 배열 전체의 복사본
      - int *(첫 칸의 주소)
      - int
      - 길이를 담은 구조체
    answerIndex: 1
    explanation: 매개변수 자리의 int a[]와 int a[10]은 모두 int *a로 바뀝니다. 배열 전체가 복사되지 않고 주소만 전달되므로, 함수 안에서 a[i]를 바꾸면 부른 쪽 배열이 바뀝니다.
  - id: quiz-day34-02
    question: 함수 안에서 매개변수 int a[]에 sizeof a / sizeof a[0]을 계산하면?
    choices:
      - 배열의 원소 개수
      - 포인터 크기 / int 크기(64비트에서 보통 2)이며, gcc는 경고를 낸다
      - 항상 0
      - 컴파일러가 배열 길이를 알아서 넣어 준다
    answerIndex: 1
    explanation: a는 포인터라 sizeof a가 포인터 크기(8바이트)입니다. 원소 개수는 배열을 선언한 곳에서 구해 길이 매개변수로 넘겨야 합니다. gcc는 -Wsizeof-array-argument 경고로 알려 줍니다.
  - id: quiz-day34-03
    question: 2차원 배열 int m[2][3]을 받는 매개변수로 올바른 것은?
    choices:
      - "int m[][]"
      - "int m[][3](또는 int (*m)[3])"
      - "int **m"
      - "int m"
    answerIndex: 1
    explanation: "m[r][c]의 위치를 계산하려면 한 줄이 몇 칸인지 알아야 합니다(r * 3 + c). 그래서 첫 번째 크기는 생략해도 되지만 열 수는 적어야 합니다. int **m은 '포인터들의 배열'이라 메모리 모양이 달라 쓸 수 없습니다."
  - id: quiz-day34-04
    question: Rust의 &[i32](슬라이스)가 C의 const int *보다 나은 점은?
    choices:
      - 더 빠르다
      - 시작 주소와 길이를 함께 가지고 있어 길이를 따로 넘기지 않아도 되고, 범위 검사가 된다
      - 값을 복사해 준다
      - 차이가 없다
    answerIndex: 1
    explanation: 슬라이스 참조는 주소와 길이 두 값(64비트에서 16바이트)으로 된 '두꺼운 포인터'입니다. xs.len()으로 길이를 알 수 있고 xs[i]는 범위를 검사합니다. &mut [i32]는 C의 int *처럼 칸을 바꿀 수 있습니다.
  - id: quiz-day34-05
    question: Python에서 total(scores[1:4])를 부르면 total이 받는 것은?
    choices:
      - scores의 1~3번 칸을 가리키는 창(원본과 공유)
      - 1~3번 칸을 복사한 새 리스트
      - scores 전체
      - 오류
    answerIndex: 1
    explanation: 리스트 자르기는 복사본을 만듭니다. 그래서 함수가 그 리스트를 바꿔도 원본은 그대로입니다. C의 a + 1이나 Rust의 &a[1..4]는 복사 없이 원본의 일부를 가리킨다는 점이 다릅니다.
---

## 1. 오늘 배울 내용

Day 30에서 포인터와 배열의 관계(`a[i]`는 `*(a + i)`)를 배웠습니다. 오늘은 그 지식을 **함수**에 적용합니다. C에서 배열을 함수에 넘기는 일은 매일 하는 일인데, 다른 언어에서 온 사람이 가장 자주 넘어지는 곳이기도 합니다.

1. 배열을 넘기면 **첫 칸의 주소만** 전달되고, 길이는 따라가지 않습니다.
2. 그래서 C 함수는 **길이를 함께 받는** 관례를 따릅니다: `sum(const int a[], int n)`.
3. 함수 안의 `sizeof`가 배열 크기가 아니라 **포인터 크기**를 돌려주는 함정을 봅니다.
4. 배열을 다루는 여러 모양을 연습합니다.
   - 읽기만 하는 함수에 `const` 붙이기
   - 배열의 일부만 넘기기: `sum(a + 1, 3)`
   - 끝 표시(sentinel)로 길이 알리기: 문자열의 `'\0'`과 같은 생각
   - 2차원 배열 매개변수: `int m[][COLS]`
5. 다른 두 언어를 비교합니다.
   - Python: 리스트는 길이를 스스로 알고, `*args`로 인자 개수도 자유롭습니다.
   - Rust: 슬라이스 `&[T]`가 주소와 길이를 함께 가집니다.
6. 배열을 **제자리에서 k칸 돌리는** 프로그램을 세 번 뒤집기로 만듭니다.

## 2. 왜 필요한가

점수 목록의 평균, 센서 값의 최댓값, 이미지 한 줄의 밝기 합처럼 "여러 값을 받아 처리하는 함수"는 어디에나 있습니다. C에서는 이런 함수가 **몇 칸을 처리해야 하는지 스스로 알 방법이 없습니다.** 길이를 잘못 알려 주면 C는 경고 없이 배열 밖을 읽거나 써 버립니다. 이것이 버퍼 오버플로라는 보안 사고의 가장 흔한 뿌리입니다.

- 길이를 넘기는 관례를 지키면 함수가 안전한 범위를 압니다.
- `const`를 붙이면 "이 함수는 배열을 바꾸지 않는다"는 것이 선언에서 바로 보입니다.
- Python과 Rust가 이 문제를 어떻게 없앴는지 보면, 왜 C 코드에서 길이를 그렇게 조심스럽게 다루는지 이해하게 됩니다.

## 3. 그림으로 이해하기

`int scores[5]`를 `sum(scores, 5)`로 넘길 때 실제로 복사되는 것은 두 값뿐입니다.

```text
main의 메모리                               sum의 매개변수
scores ┌────┬────┬────┬────┬────┐
       │ 72 │ 95 │ 88 │ 61 │ 90 │         a = (scores[0]의 주소)  ← 8바이트
       └────┴────┴────┴────┴────┘         n = 5                   ← 4바이트
         ▲
         └──────────────── a가 가리키는 곳
sizeof scores = 20바이트(5칸 × 4)          sizeof a = 8바이트(포인터)
```

배열의 **일부**를 넘길 때도 모양은 같습니다. 시작 주소만 옮기면 됩니다.

```text
sum(scores + 1, 3)
       ┌────┬────┬────┬────┬────┐
       │ 72 │ 95 │ 88 │ 61 │ 90 │
       └────┴────┴────┴────┴────┘
              ▲──────────────┘
              a        a[0]=95, a[1]=88, a[2]=61 → 244
```

2차원 배열 `int m[2][3]`은 메모리에 **한 줄로** 놓입니다. `m[r][c]`를 찾으려면 "한 줄이 몇 칸인지"를 알아야 합니다.

```text
m[0][0] m[0][1] m[0][2] m[1][0] m[1][1] m[1][2]
┌──────┬──────┬──────┬──────┬──────┬──────┐
│  1   │  2   │  3   │  4   │  5   │  6   │
└──────┴──────┴──────┴──────┴──────┴──────┘
m[1][2]의 위치 = 1 × (열 수 3) + 2 = 5번째 칸 → 열 수가 없으면 계산할 수 없다
```

## 4. 천천히 풀어보기

### 4.1 배열 매개변수는 포인터다

C에서 함수 매개변수 자리에 배열 모양을 쓰면, 컴파일러가 이를 포인터로 바꿉니다. 이것을 흔히 "배열이 포인터로 **붕괴(decay)** 한다"고 말합니다.

| 매개변수에 쓴 모양 | 실제 의미              |
| ------------------ | ---------------------- |
| `int a[]`          | `int *a`               |
| `int a[10]`        | `int *a` (10은 무시됨) |
| `const int a[]`    | `const int *a`         |
| `int m[][3]`       | `int (*m)[3]`          |

`int a[10]`의 10은 읽는 사람을 위한 설명일 뿐 검사되지 않습니다. 그래서 대부분의 C 코드는 `int a[]` 또는 `int *a`로 쓰고, 길이를 별도 매개변수로 받습니다.

### 4.2 길이는 선언한 곳에서 구한다

`sizeof 배열 / sizeof 배열[0]`은 **배열을 선언한 그 함수 안에서만** 원소 개수를 줍니다. 그 값을 길이 매개변수로 넘기세요. 표준 라이브러리의 `qsort(base, count, size, cmp)`, `memcpy(dst, src, bytes)`도 모두 길이를 따로 받습니다.

### 4.3 길이를 알리는 세 가지 방법

| 방법              | 예                               | 장점                    | 단점                                          |
| ----------------- | -------------------------------- | ----------------------- | --------------------------------------------- |
| 길이 매개변수     | `sum(a, n)`                      | 가장 분명하고 안전함    | 매번 두 값을 넘겨야 함                        |
| 끝 표시(sentinel) | 문자열 끝 `'\0'`, 목록 끝 `-1`   | 길이를 넘기지 않아도 됨 | 끝 표시가 데이터에 나오면 안 됨, 매번 세야 함 |
| 구조체로 묶기     | `struct { int *data; int len; }` | 한 값으로 넘김          | 구조체를 배운 뒤에(Day 50)                    |

Rust의 슬라이스와 Python의 리스트는 사실상 세 번째 방법을 언어가 대신 해 주는 것입니다.

### 4.4 바꾸는 함수와 읽는 함수

- 배열을 **읽기만** 하면 `const int a[]`로 받습니다. 실수로 `a[i] = ...`를 쓰면 컴파일 오류가 납니다.
- 배열을 **채우거나 바꾸면** `int out[]`로 받습니다. C 함수는 배열을 돌려줄 수 없으므로(Day 40 전까지), 부른 쪽이 공간을 준비하고 함수가 채우는 방식을 씁니다.

2차원 배열에서는 주의할 점이 하나 있습니다. C17 이전 표준에서는 `int m[2][3]`을 `const int m[][3]` 매개변수에 넘기면 gcc의 `-pedantic`이 오류를 냅니다(C23에서 허용됨). 그래서 오늘 코드의 2차원 함수는 `const` 없이 받습니다.

## 5. C로 구현하기

```c
// 파일: array_params.c
#include <stdio.h>

#define COLS 3

int sum(const int a[], int n) {             // int a[]는 사실 const int *a
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}

void fill(int out[], int n, int value) {    // 결과를 부른 쪽이 준비한 배열에 채운다
    for (int i = 0; i < n; i++) {
        out[i] = value;
    }
}

int count_until_sentinel(const int a[]) {   // 끝 표시(-1)까지 센다
    int n = 0;
    while (a[n] != -1) {
        n++;
    }
    return n;
}

int total2d(int m[][COLS], int rows) {          // 2차원은 열 수를 적어야 한다
    int s = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < COLS; c++) {
            s += m[r][c];
        }
    }
    return s;
}

int main(void) {
    int scores[5] = {72, 95, 88, 61, 90};
    int n = sizeof scores / sizeof scores[0];   // 길이는 배열을 선언한 곳에서 구한다
    printf("main의 sizeof scores = %zu, 칸 수 %d\n", sizeof scores, n);
    printf("함수가 받는 것은 포인터: %zu바이트\n", sizeof(const int *));
    printf("sum = %d\n", sum(scores, n));
    printf("가운데 세 칸의 합 = %d\n", sum(scores + 1, 3));   // 배열의 일부만 넘기기

    int buffer[4];
    fill(buffer, 4, 7);
    printf("fill 뒤 buffer = %d %d %d %d\n", buffer[0], buffer[1], buffer[2], buffer[3]);

    int with_end[] = {5, 8, 2, -1};             // 마지막 -1이 '끝' 약속
    printf("끝 표시 전까지 %d개\n", count_until_sentinel(with_end));

    int matrix[2][COLS] = {{1, 2, 3}, {4, 5, 6}};
    printf("2차원 합 = %d\n", total2d(matrix, 2));
    return 0;
}
```

실행 결과:

```text
main의 sizeof scores = 20, 칸 수 5
함수가 받는 것은 포인터: 8바이트
sum = 406
가운데 세 칸의 합 = 244
fill 뒤 buffer = 7 7 7 7
끝 표시 전까지 3개
2차원 합 = 21
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `int sum(const int a[], int n)`             | 첫 칸의 주소와 칸 수를 받습니다. `const`라서 함수 안에서 배열을 바꾸면 컴파일 오류입니다.                      |
| `int n = sizeof scores / sizeof scores[0];` | 배열을 선언한 `main`에서 20 / 4 = 5칸을 구합니다.                                                              |
| `sizeof(const int *)`                       | 함수가 실제로 받는 것의 크기입니다. 64비트 컴퓨터에서 8바이트입니다. 배열이 1000칸이어도 8바이트만 전달됩니다. |
| `sum(scores + 1, 3)`                        | `scores[1]`의 주소부터 세 칸(95, 88, 61)을 넘깁니다. 복사 없이 배열의 일부를 처리합니다.                       |
| `void fill(int out[], int n, int value)`    | 부른 쪽이 준비한 `buffer`를 채웁니다. 주소를 받았으므로 `out[i] = value`가 `buffer`를 바꿉니다.                |
| `while (a[n] != -1)`                        | 끝 표시 `-1`을 만날 때까지 셉니다. 끝 표시가 없는 배열을 넘기면 배열 밖을 계속 읽는 위험한 함수입니다.         |
| `int total2d(int m[][COLS], int rows)`      | 열 수 `COLS`는 적고, 줄 수는 매개변수로 받습니다. `m[r][c]`는 `r * COLS + c`번째 칸입니다.                     |

## 6. Python으로 구현하기

```python
# 파일: list_params.py
def total(xs):
    return sum(xs)                          # 리스트는 길이를 스스로 안다


def fill(n, value):
    return [value] * n                      # 새 리스트를 만들어 돌려준다


def fill_into(out, value):
    for i in range(len(out)):               # 부른 쪽 리스트를 제자리에서 채운다
        out[i] = value


def average(*values):                       # 인자를 몇 개든 튜플로 받는다
    return sum(values) / len(values)


def total2d(matrix):
    return sum(sum(row) for row in matrix)


scores = [72, 95, 88, 61, 90]
print("길이", len(scores), "합", total(scores))
print("가운데 세 칸의 합", total(scores[1:4]))  # 자르기는 복사본을 넘긴다
print("fill:", fill(4, 7))
buffer = [0, 0, 0]
fill_into(buffer, 9)
print("fill_into 뒤:", buffer)
print("average:", average(80, 90), average(1, 2, 3, 4))
print("펼쳐 넘기기:", average(*scores))       # 리스트를 인자 여러 개로 펼친다
print("2차원 합", total2d([[1, 2, 3], [4, 5, 6]]))
```

실행 결과:

```text
길이 5 합 406
가운데 세 칸의 합 244
fill: [7, 7, 7, 7]
fill_into 뒤: [9, 9, 9]
average: 85.0 2.5
펼쳐 넘기기: 81.2
2차원 합 21
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `def total(xs): return sum(xs)`   | 리스트는 길이를 스스로 알아서 길이 매개변수가 필요 없습니다. `len(xs)`로 언제든 구합니다.                  |
| `total(scores[1:4])`              | 자르기는 **복사본**을 만들어 넘깁니다. C의 `scores + 1`과 달리 원본과 공유하지 않습니다.                   |
| `return [value] * n`              | Python 함수는 새 리스트를 만들어 돌려줄 수 있습니다. C에서는 부른 쪽이 공간을 준비해야 했던 것과 다릅니다. |
| `out[i] = value`                  | 받은 리스트의 칸에 대입하면 부른 쪽 리스트가 바뀝니다. C의 `fill(int out[], ...)`과 같은 동작입니다.       |
| `def average(*values)`            | 인자를 몇 개든 받아 튜플 `values`로 모읍니다. `average(80, 90)`, `average(1, 2, 3, 4)` 모두 됩니다.        |
| `average(*scores)`                | 리스트를 인자 여러 개로 **펼쳐서** 넘깁니다. `average(72, 95, 88, 61, 90)`과 같습니다.                     |
| `sum(sum(row) for row in matrix)` | 2차원 리스트는 "리스트의 리스트"라 줄마다 길이가 달라도 됩니다. 열 수를 알려 줄 필요가 없습니다.           |

## 7. Rust로 구현하기

```rust
// 파일: slice_params.rs
fn sum(xs: &[i32]) -> i32 {                 // 슬라이스는 길이를 함께 가지고 온다
    xs.iter().sum()
}

fn fill(n: usize, value: i32) -> Vec<i32> { // 새 Vec을 만들어 돌려준다
    vec![value; n]
}

fn fill_into(out: &mut [i32], value: i32) { // 부른 쪽이 준비한 곳을 채운다
    for x in out.iter_mut() {
        *x = value;
    }
}

fn sum_three(a: [i32; 3]) -> i32 {          // 크기가 정해진 배열은 값으로(복사해) 받을 수 있다
    a[0] + a[1] + a[2]
}

fn total2d(m: &[[i32; 3]]) -> i32 {         // 줄마다 3칸인 배열들의 슬라이스
    m.iter().map(|row| row.iter().sum::<i32>()).sum()
}

fn main() {
    let scores = vec![72, 95, 88, 61, 90];
    println!("길이 {}, 합 {}", scores.len(), sum(&scores));
    println!("가운데 세 칸의 합 {}", sum(&scores[1..4]));   // 복사 없이 일부만 빌려준다
    println!("fill: {:?}", fill(4, 7));
    let mut buffer = [0; 3];
    fill_into(&mut buffer, 9);
    println!("fill_into 뒤: {buffer:?}");
    println!("sum_three: {}", sum_three([1, 2, 3]));
    let matrix = [[1, 2, 3], [4, 5, 6]];
    println!("2차원 합 {}", total2d(&matrix));
    println!("&[i32]의 크기 {}바이트(주소 + 길이)", std::mem::size_of::<&[i32]>());
}
```

실행 결과:

```text
길이 5, 합 406
가운데 세 칸의 합 244
fill: [7, 7, 7, 7]
fill_into 뒤: [9, 9, 9]
sum_three: 6
2차원 합 21
&[i32]의 크기 16바이트(주소 + 길이)
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn sum(xs: &[i32]) -> i32`                 | 슬라이스를 빌려 받습니다. `Vec`, 배열, 그 일부를 모두 받을 수 있습니다(Day 36에서 자세히).                                                      |
| `sum(&scores[1..4])`                        | 1, 2, 3번 칸을 **복사 없이** 빌려 줍니다. C의 `sum(scores + 1, 3)`을 한 값으로 표현한 것입니다.                                                 |
| `fn fill_into(out: &mut [i32], value: i32)` | 가변 슬라이스로 받아 부른 쪽의 배열을 채웁니다. `iter_mut`이 칸마다 `&mut i32`를 줍니다.                                                        |
| `fn sum_three(a: [i32; 3])`                 | 크기가 자료형에 들어 있는 배열은 **값으로** 넘길 수 있습니다. `i32`가 Copy라 배열 전체가 복사됩니다. 크기가 다른 `[i32; 4]`는 넘길 수 없습니다. |
| `fn total2d(m: &[[i32; 3]])`                | "3칸짜리 배열"들의 슬라이스입니다. C의 `int m[][3]`, `rows`를 하나로 합친 모양입니다.                                                           |
| `size_of::<&[i32]>()`                       | 슬라이스 참조는 주소(8바이트)와 길이(8바이트)를 함께 가진 **두꺼운 포인터**라 16바이트입니다.                                                   |

## 8. 실행 추적

C의 `sum(scores + 1, 3)`이 도는 동안 함수 안의 `a[i]`가 원래 배열의 어느 칸인지 따라갑니다.

| i   | 함수 안의 `a[i]` | 원래 배열의 칸 | 값  | `s` |
| --- | ---------------- | -------------- | --- | --- |
| -   | -                | -              | -   | 0   |
| 0   | `a[0]`           | `scores[1]`    | 95  | 95  |
| 1   | `a[1]`           | `scores[2]`    | 88  | 183 |
| 2   | `a[2]`           | `scores[3]`    | 61  | 244 |
| 3   | (`i < 3` 거짓)   | -              | -   | 244 |

함수는 자기가 받은 `a`가 `scores`의 1번 칸에서 시작한다는 사실을 모릅니다. `a[3]`을 읽으면 `scores[4]`(90)이고, `a[4]`는 배열 밖입니다. 막는 것은 `i < n` 조건 하나뿐입니다.

## 9. 다른 예제로 다시 이해하기

**요일 배열을 k칸 돌리기.** 배열 `[1, 2, 3, 4, 5, 6, 7]`을 왼쪽으로 2칸 돌리면 `[3, 4, 5, 6, 7, 1, 2]`가 됩니다. 임시 배열 없이 **제자리에서** 하려면 세 번 뒤집으면 됩니다.

```text
k = 2
처음          [1 2 | 3 4 5 6 7]
앞 k칸 뒤집기  [2 1 | 3 4 5 6 7]
나머지 뒤집기  [2 1 | 7 6 5 4 3]
전체 뒤집기    [3 4 5 6 7 | 1 2]   ← 완성
```

```c
// 파일: rotate.c
#include <stdio.h>

void reverse(int a[], int lo, int hi) {     // a[lo..hi] 구간을 뒤집는다(hi 포함)
    while (lo < hi) {
        int t = a[lo];
        a[lo] = a[hi];
        a[hi] = t;
        lo++;
        hi--;
    }
}

void rotate_left(int a[], int n, int k) {   // 왼쪽으로 k칸 돌리기
    if (n == 0) {
        return;
    }
    k %= n;
    reverse(a, 0, k - 1);
    reverse(a, k, n - 1);
    reverse(a, 0, n - 1);
}

void print_array(const char *label, const int a[], int n) {
    printf("%s:", label);
    for (int i = 0; i < n; i++) {
        printf(" %d", a[i]);
    }
    printf("\n");
}

int main(void) {
    int days[7] = {1, 2, 3, 4, 5, 6, 7};
    int n = sizeof days / sizeof days[0];
    print_array("처음", days, n);
    rotate_left(days, n, 2);
    print_array("2칸", days, n);
    rotate_left(days, n, 12);               // 12 % 7 = 5칸
    print_array("12칸 더", days, n);
    rotate_left(days + 1, 3, 1);            // 가운데 일부만 돌리기
    print_array("일부", days, n);
    return 0;
}
```

실행 결과:

```text
처음: 1 2 3 4 5 6 7
2칸: 3 4 5 6 7 1 2
12칸 더: 1 2 3 4 5 6 7
일부: 1 3 4 2 5 6 7
```

| 코드                                    | 설명                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `void reverse(int a[], int lo, int hi)` | 구간의 양 끝을 바꾸며 가운데로 모입니다. 배열 전체가 아니라 `lo..hi` 구간만 다룹니다.                              |
| `k %= n;`                               | 7칸 배열을 12칸 돌리는 것은 5칸 돌리는 것과 같습니다. `n == 0`이면 0으로 나누게 되므로 먼저 막았습니다.            |
| `rotate_left(days, n, 12);`             | 이미 2칸 돌린 배열을 5칸 더 돌려 총 7칸, 즉 처음으로 돌아왔습니다.                                                 |
| `rotate_left(days + 1, 3, 1);`          | `days[1]`부터 세 칸(2, 3, 4)만 돌려 3, 4, 2가 됩니다. 함수는 이것이 일부라는 것을 모르고 받은 길이만큼만 다룹니다. |

같은 일을 Python으로 하면, 자르기가 복사본이라는 점 때문에 "일부만 돌리기"가 달라집니다.

```python
# 파일: rotate.py
def rotate_left(a, k):
    if not a:
        return
    k %= len(a)
    a[:] = a[k:] + a[:k]                    # 제자리 대입: 부른 쪽 리스트가 바뀐다


days = [1, 2, 3, 4, 5, 6, 7]
print("처음:", days)
rotate_left(days, 2)
print("2칸:", days)
rotate_left(days, 12)
print("12칸 더:", days)
part = days[1:4]                            # 자르기는 복사본
rotate_left(part, 1)
print("복사본만 바뀜:", days, part)
days[1:4] = part                            # 되돌려 넣어야 원본이 바뀐다
print("일부:", days)
```

실행 결과:

```text
처음: [1, 2, 3, 4, 5, 6, 7]
2칸: [3, 4, 5, 6, 7, 1, 2]
12칸 더: [1, 2, 3, 4, 5, 6, 7]
복사본만 바뀜: [1, 2, 3, 4, 5, 6, 7] [3, 4, 2]
일부: [1, 3, 4, 2, 5, 6, 7]
```

- `a[:] = ...`는 리스트의 **내용 전체**를 바꾸는 제자리 대입이라 부른 쪽의 `days`가 바뀝니다. `a = ...`였다면 함수 안의 이름만 바뀝니다.
- `days[1:4]`는 복사본이라 돌려도 원본은 그대로입니다. 결과를 `days[1:4] = part`로 되돌려 넣어야 합니다.

Rust에는 슬라이스 메서드 `rotate_left`가 이미 있고, 슬라이스가 원본을 빌린 것이라 일부도 바로 돌릴 수 있습니다.

```rust
// 파일: rotate.rs
fn main() {
    let mut days = [1, 2, 3, 4, 5, 6, 7];
    println!("처음: {days:?}");
    days.rotate_left(2);
    println!("2칸: {days:?}");
    let k = 12 % days.len();
    days.rotate_left(k);
    println!("12칸 더: {days:?}");
    days[1..4].rotate_left(1);              // 슬라이스의 일부를 제자리에서
    println!("일부: {days:?}");
}
```

실행 결과:

```text
처음: [1, 2, 3, 4, 5, 6, 7]
2칸: [3, 4, 5, 6, 7, 1, 2]
12칸 더: [1, 2, 3, 4, 5, 6, 7]
일부: [1, 3, 4, 2, 5, 6, 7]
```

`days[1..4].rotate_left(1)`은 C의 `rotate_left(days + 1, 3, 1)`과 같은 일을 합니다. 시작 위치와 길이가 범위 `1..4` 하나에 들어 있고, 범위가 배열 밖이면 패닉으로 멈춥니다.

## 10. 배열을 넘기는 모양 정리

| 하고 싶은 일       | C                             | Python                       | Rust                     |
| ------------------ | ----------------------------- | ---------------------------- | ------------------------ |
| 전체를 읽기만      | `f(const int a[], int n)`     | `f(xs)`                      | `f(xs: &[i32])`          |
| 칸을 바꾸기        | `f(int a[], int n)`           | `f(xs)` 안에서 `xs[i] = ...` | `f(xs: &mut [i32])`      |
| 일부만 넘기기      | `f(a + 1, 3)` (공유)          | `f(xs[1:4])` (복사)          | `f(&xs[1..4])` (공유)    |
| 새 목록 돌려주기   | 부른 쪽이 공간 준비 후 채우기 | `return [...]`               | `-> Vec<i32>`            |
| 인자 개수 자유롭게 | `stdarg.h`(자료형 검사 없음)  | `*args`                      | 슬라이스로 받기 `&[i32]` |
| 2차원              | `f(int m[][COLS], int rows)`  | 리스트의 리스트              | `f(m: &[[i32; COLS]])`   |

## 11. 세 언어 비교

| 관점               | C                             | Python              | Rust                       |
| ------------------ | ----------------------------- | ------------------- | -------------------------- |
| 함수가 받는 것     | 첫 칸의 주소                  | 리스트 객체(참조)   | 슬라이스 참조(주소 + 길이) |
| 길이 알기          | 매개변수로 따로 받음          | `len(xs)`           | `xs.len()`                 |
| 범위를 넘으면      | 정의되지 않은 동작(검사 없음) | `IndexError`        | 패닉(실행 중 검사)         |
| 읽기 전용 약속     | `const`                       | 관례(튜플로 넘기기) | `&`(컴파일러가 강제)       |
| 일부 넘기기의 비용 | 없음(주소 계산)               | 복사                | 없음(주소와 길이 계산)     |

## 12. 자주 하는 실수

### 실수 1: 함수 안에서 sizeof로 길이를 구한다 (C)

```c
// 파일: sizeof_param.c (컴파일 오류: will return size of 'int *')
#include <stdio.h>

int count(int a[]) {
    return sizeof a / sizeof a[0];
}

int main(void) {
    int scores[5] = {72, 95, 88, 61, 90};
    printf("%d\n", count(scores));
    return 0;
}
```

`a`는 포인터라 `sizeof a`는 8입니다. 경고를 무시하고 실행하면 64비트 컴퓨터에서 5가 아니라 2가 나옵니다. 길이는 `main`에서 구해 넘기세요.

### 실수 2: 반복 조건을 i <= n으로 쓴다 (C)

실습의 디버그 문제입니다. 칸이 `n`개면 마지막 인덱스는 `n - 1`입니다. C는 한 칸 넘겨 읽어도 멈추지 않고, 이상한 값을 읽은 채 계속 실행됩니다.

### 실수 3: 2차원 배열 매개변수에 열 수를 빼먹는다 (C)

```c
// 파일: no_cols.c (컴파일 오류: array type has incomplete element type)
#include <stdio.h>

int total(int m[][], int rows) {
    return m[0][0] + rows;
}

int main(void) {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", total(m, 2));
    return 0;
}
```

`m[r][c]`의 위치를 계산하려면 한 줄의 칸 수가 필요합니다. `int m[][3]`처럼 열 수를 적으세요.

### 실수 4: Rust에서 크기가 없는 [i32]를 값으로 받는다

```rust
// 파일: unsized_param.rs (컴파일 오류: E0277)
fn sum(xs: [i32]) -> i32 {
    xs.iter().sum()
}

fn main() {
    let v = [1, 2, 3];
    println!("{}", sum(v));
}
```

`[i32]`는 길이를 모르는 "칸들 자체"라 값으로 주고받을 수 없습니다. 빌려서 `&[i32]`로 받거나, 크기가 정해진 `[i32; 3]`으로 받으세요.

### 실수 5: 자르기가 원본을 가리킨다고 생각한다 (Python)

`f(xs[1:4])`에서 함수가 받은 리스트를 바꿔도 `xs`는 그대로입니다. 원본의 일부를 바꾸려면 인덱스 범위(`start`, `stop`)를 함께 넘기거나, 결과를 `xs[1:4] = ...`로 되돌려 넣으세요.

## 13. Q&A

**Q. 왜 C는 배열을 통째로 복사해서 넘기지 않나요?**

A. C가 만들어질 때는 메모리와 속도가 매우 귀했습니다. 큰 배열을 함수마다 복사하는 대신 주소만 넘기는 것이 훨씬 빠릅니다. 대신 길이 정보를 잃는 대가를 치렀고, 그 책임은 프로그래머에게 넘어왔습니다. 배열을 구조체 안에 넣으면 구조체는 값으로 복사되니, 복사가 정말 필요하면 그렇게 할 수 있습니다(Day 50).

**Q. int a[10]처럼 크기를 적으면 검사해 주지 않나요?**

A. 매개변수 자리의 크기는 무시됩니다. C99의 `int a[static 10]`은 "최소 10칸을 넘긴다"는 약속이라 일부 컴파일러가 명백히 짧은 배열에 경고를 주지만, 길이를 알려 주지는 않습니다.

**Q. Rust의 Vec을 넘길 때는 &Vec<i32>와 &[i32] 중 무엇을 쓰나요?**

A. `&[i32]`를 쓰세요. `&Vec<i32>`는 `Vec`만 받지만, `&[i32]`는 `Vec`, 배열, 그 일부를 모두 받습니다. `&scores`를 넘기면 자동으로 슬라이스로 바뀝니다. Clippy도 `&Vec<T>` 매개변수를 고치라고 알려 줍니다.

**Q. Python에서 복사 없이 리스트 일부를 넘기고 싶으면요?**

A. 가장 흔한 방법은 리스트와 함께 `start`, `stop` 인덱스를 넘기는 것입니다(이진 탐색 등에서 씁니다). 숫자 배열이라면 `memoryview`나 NumPy 배열의 자르기가 복사 없이 원본을 공유합니다.

## 14. 핵심 요약

- C에서 배열을 함수에 넘기면 **첫 칸의 주소만** 전달됩니다. 매개변수 `int a[]`는 `int *a`입니다.
- 길이는 따라가지 않으므로 **길이 매개변수**를 함께 받습니다. `sizeof a / sizeof a[0]`은 배열을 선언한 곳에서만 원소 개수입니다.
- 읽기만 하면 `const int a[]`, 배열의 일부는 `a + k`와 길이로 넘깁니다. 끝 표시로 길이를 알리는 방법도 있지만, 끝 표시가 없으면 위험합니다.
- 2차원 배열 매개변수에는 **열 수**를 적어야 합니다: `int m[][COLS]`.
- Python 리스트는 길이를 스스로 알고, 자르기는 복사본을 만듭니다. `*args`로 인자 개수를 자유롭게 받습니다.
- Rust 슬라이스 `&[T]`는 주소와 길이를 함께 가진 두꺼운 포인터라, 일부를 복사 없이 넘기고 범위도 검사합니다.

## 15. 도전 문제

1. **(C)** `int count_if_above(const int a[], int n, int limit)`를 만들어 `limit`보다 큰 값의 개수를 세고, 배열 전체와 뒤쪽 절반(`a + n / 2`)에 각각 적용해 보세요.
2. **(C)** 3×4 성적표 `int scores[3][4]`를 받아 학생(줄)마다 평균을 `double avg[]`에 채우는 `void row_average(int m[][4], int rows, double avg[])`를 만드세요.
3. **(Python)** `def rotate_right(a, k)`를 만들고, `rotate_left(a, len(a) - k)`와 결과가 같은지 여러 `k`(0, 1, 7, 15)로 확인하세요.
4. **(Rust)** `fn split_sum(xs: &[i32]) -> (i32, i32)`로 앞 절반과 뒤 절반의 합을 돌려주세요. `xs.split_at(xs.len() / 2)`를 써 보고, 길이가 홀수일 때 가운데 값이 어느 쪽에 들어가는지 확인하세요.
