---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-43-output-parameter
courseId: crp-92
phaseId: phase-04
dayNumber: 43
date: "2026-11-12"
title: C 포인터로 결과 돌려주기
summary: C 함수는 값을 하나만 돌려줄 수 있어서, 결과가 여럿이거나 성공 여부와 결과를 함께 알려야 할 때 포인터 매개변수(출력 매개변수)에 씁니다. swap, 최솟값·최댓값 두 결과, "반환값은 성공 여부, 결과는 *out" 관례와 strtol의 end 포인터, 필요 없는 결과를 NULL로 받는 선택적 출력, 힙에 만든 결과를 char **out으로 돌려주기를 다룹니다. 같은 일을 Rust는 튜플·Option·Result와 꼭 필요할 때의 &mut로, Python은 튜플 반환과 예외로 하는 방식을 비교하고, "HH:MM" 두 시각 사이의 공부 시간을 계산하는 프로그램을 세 언어로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [rust, python]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-42-memory-review]
learningObjectives:
  - 포인터 매개변수로 부른 쪽의 변수를 바꾸는 이유를 값 전달로 설명한다.
  - 결과가 여럿인 함수와 "성공 여부 + *out" 함수를 만들고, 실패할 때 *out을 건드리지 않는다.
  - NULL로 받을 수 있는 선택적 출력과, 힙 결과를 char **out으로 돌려주는 함수를 만든다.
  - 같은 함수를 Rust의 튜플·Option·Result, Python의 튜플·예외로 옮긴다.
  - 출력 매개변수에서 자주 하는 실수(& 빠뜨리기, 포인터 자체에 대입하기)를 찾아 고친다.
concepts:
  [
    output parameter,
    pass by value,
    pointer parameter,
    swap,
    multiple results,
    status code,
    strtol,
    optional output,
    null check,
    pointer to pointer,
    tuple return,
    result,
    option,
    exceptions,
  ]
runnerMode: python
playgroundSource: |
  # 파일: results.py — Python은 결과 여러 개를 튜플로 돌려줍니다.
  def min_max(xs):
      return min(xs), max(xs)

  lo, hi = min_max([72, 95, 61, 88])
  q, r = divmod(17, 5)
  print(lo, hi, q, r)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day43-predict-c
    title: 포인터 매개변수와 값 매개변수 예측하기
    kind: predict
    objective: 포인터로 받은 것은 부른 쪽이 바뀌고, 값으로 받은 것은 복사본만 바뀐다는 것을 추적한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      void step(int *a, int b) {
          *a += b;
          b += 1;
      }

      int main(void) {
          int x = 1, y = 10;
          step(&x, y);
          step(&x, y);
          printf("%d %d\n", x, y);
          return 0;
      }
    answer: "21 10"
    hint: "a는 x의 주소, b는 y의 값을 복사한 것입니다. b += 1은 함수 안의 복사본만 바꿉니다."
    explanation: "첫 호출에서 x는 1 + 10 = 11, 두 번째 호출에서 11 + 10 = 21입니다. b += 1은 복사본을 바꾼 뒤 함수가 끝나 사라지므로 y는 그대로 10이고, 두 번째 호출에도 10이 넘어갑니다. C의 인자는 항상 값으로 복사되며, 주소를 넘기면 '주소의 복사본'으로 원래 변수를 찾아가 바꿀 수 있습니다."
    commonMistakes:
      - "b += 1이 y를 바꿔 두 번째 호출에 11이 넘어간다고 생각해 22 11로 적음"
      - "x가 한 번만 바뀐다고 생각함"
    language: c
    verification: run
  - id: ex-day43-predict-py
    title: Python 함수로 두 값 바꾸기 예측하기
    kind: predict
    objective: 함수 안에서 이름을 다시 대입해도 부른 쪽 변수는 바뀌지 않는다는 것을 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      def swap(a, b):
          a, b = b, a

      x, y = 3, 8
      swap(x, y)
      print(x, y)
    answer: "3 8"
    hint: "a, b는 함수 안의 이름표입니다. 이름표를 바꿔 붙여도 x, y 이름표는 그대로입니다."
    explanation: "Python에는 C의 &x처럼 '변수 자체'를 넘기는 방법이 없습니다. 함수가 받는 것은 객체의 참조이고, 정수는 바꿀 수 없는 객체라 함수 안에서 x를 바꿀 수 없습니다. 그래서 Python은 결과를 돌려주고 부른 쪽이 x, y = y, x처럼 받습니다. 리스트라면 xs[0], xs[1] = xs[1], xs[0]처럼 내용을 바꿀 수 있습니다."
    commonMistakes:
      - "swap이 C처럼 동작해 8 3이 된다고 생각함"
      - "함수가 None을 돌려줘 x가 None이 된다고 생각함"
    language: python
    verification: run
  - id: ex-day43-fill
    title: 결과 두 개를 받을 주소 넘기기 채우기
    kind: fill
    objective: 출력 매개변수에 변수의 주소를 넘긴다.
    prompt: "빈칸을 채워 가장 작은 값과 가장 큰 값 '61 95'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      void min_max(const int a[], int n, int *min, int *max) {
          *min = *max = a[0];
          for (int i = 1; i < n; i++) {
              if (a[i] < *min) {
                  *min = a[i];
              }
              if (a[i] > *max) {
                  *max = a[i];
              }
          }
      }

      int main(void) {
          int scores[] = {72, 95, 61, 88};
          int lo, hi;
          min_max(scores, 4, _____, &hi);
          printf("%d %d\n", lo, hi);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      void min_max(const int a[], int n, int *min, int *max) {
          *min = *max = a[0];
          for (int i = 1; i < n; i++) {
              if (a[i] < *min) {
                  *min = a[i];
              }
              if (a[i] > *max) {
                  *max = a[i];
              }
          }
      }

      int main(void) {
          int scores[] = {72, 95, 61, 88};
          int lo, hi;
          min_max(scores, 4, &lo, &hi);
          printf("%d %d\n", lo, hi);
          return 0;
      }
    output: "61 95"
    hint: "함수가 lo에 값을 써 넣으려면 lo가 어디 있는지 알아야 합니다."
    explanation: '&lo는 lo의 주소이고, 함수 안의 *min = ...이 그 주소에 씁니다. lo를 그냥 넘기면 정수를 포인터 자리에 넣은 것이라 이 과정의 설정에서는 컴파일 오류입니다. scores는 배열이라 이름만 써도 주소로 바뀌지만, 보통 변수에는 &가 필요합니다. scanf("%d", &x)에 &가 필요한 것도 같은 이유입니다.'
    commonMistakes:
      - "lo를 그대로 넘겨 makes pointer from integer 오류가 남"
      - "*lo로 써서 정수에 *를 쓸 수 없다는 오류가 남"
    language: c
    verification: run
  - id: ex-day43-modify
    title: 애매한 0 대신 성공 여부 돌려주기
    kind: modify
    objective: 실패를 결과 값으로 표시하는 대신, 반환값은 성공 여부로 두고 결과는 출력 매개변수로 돌려준다.
    prompt: "average는 빈 배열이면 0.0을 돌려줘서 '진짜 평균 0'과 구별할 수 없습니다. int average(const int a[], int n, double *out)으로 바꿔 성공하면 1, 빈 배열이면 0을 돌려주게 하고, '평균 2.50 / 빈 배열: 실패'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      double average(const int a[], int n) {
          if (n == 0) {
              return 0.0;
          }
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          return (double)s / n;
      }

      int main(void) {
          int a[] = {1, 2, 3, 4};
          printf("평균 %.2f / 빈 배열: %.2f\n", average(a, 4), average(a, 0));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int average(const int a[], int n, double *out) {
          if (n == 0) {
              return 0;
          }
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          *out = (double)s / n;
          return 1;
      }

      int main(void) {
          int a[] = {1, 2, 3, 4};
          double avg;
          if (average(a, 4, &avg)) {
              printf("평균 %.2f / ", avg);
          }
          if (!average(a, 0, &avg)) {
              printf("빈 배열: 실패\n");
          }
          return 0;
      }
    output: "평균 2.50 / 빈 배열: 실패"
    starterOutput: "평균 2.50 / 빈 배열: 0.00"
    hint: "반환값과 결과를 분리하세요. 결과 칸은 성공했을 때만 채웁니다."
    explanation: "실패를 특별한 값(0, -1)으로 표시하는 방법은 그 값이 정상 결과일 수도 있을 때 헷갈립니다. '반환값은 성공 여부, 결과는 *out'으로 나누면 부르는 쪽이 if로 성공을 확인한 뒤에만 결과를 씁니다. Rust는 이것을 Option<f64>(값이 있거나 없음) 하나로 표현하고, Python은 빈 목록에서 예외를 내거나 None을 돌려줍니다."
    commonMistakes:
      - "실패할 때도 *out = 0.0을 써서 부른 쪽 변수를 덮어씀"
      - "반환값을 확인하지 않고 avg를 출력해 초기화되지 않은 값을 읽음"
    language: c
    verification: run
  - id: ex-day43-debug
    title: mut 없는 변수를 가변으로 빌리는 오류 고치기
    kind: debug
    objective: E0596(가변이 아닌 변수를 &mut로 빌림)를 고친다.
    prompt: "이 코드는 E0596(cannot borrow `score` as mutable, as it is not declared as mutable) 오류로 컴파일되지 않습니다. 고쳐서 '98'이 출력되게 하세요."
    starter: |-
      fn add_bonus(score: &mut u32, bonus: u32) {
          *score += bonus;
      }

      fn main() {
          let score = 95;
          add_bonus(&mut score, 3);
          println!("{score}");
      }
    answer: |-
      fn add_bonus(score: &mut u32, bonus: u32) {
          *score += bonus;
      }

      fn main() {
          let mut score = 95;
          add_bonus(&mut score, 3);
          println!("{score}");
      }
    output: "98"
    hint: "함수가 바꾸려는 변수는 처음부터 '바꿀 수 있다'고 선언되어 있어야 합니다."
    explanation: "Rust는 바꾸는 쪽이 세 군데 모두에 드러나야 합니다. 변수 선언(let mut), 넘기는 곳(&mut score), 받는 곳(score: &mut u32). C의 int *와 &x에 해당하지만, 변수가 바뀔 수 있다는 사실까지 선언에 적는다는 점이 다릅니다. 결과가 하나라면 fn add_bonus(score: u32, bonus: u32) -> u32로 돌려주는 편이 더 Rust다운 설계입니다."
    commonMistakes:
      - "&mut를 &로 바꿔 E0594(& 참조로 대입 불가) 오류가 남"
      - "함수 안의 *score를 score로 바꿔 자료형 오류가 남"
    language: rust
    verification: run
  - id: ex-day43-independent
    title: Python으로 이름을 성과 이름으로 나눠 돌려주기
    kind: independent
    objective: 결과 두 개를 튜플로 돌려주고, 부른 쪽이 풀어 받는다.
    prompt: 'split_name(full)이 (성, 이름) 튜플을 돌려주게 만드세요. 두 글자 성(남궁, 황보, 선우)은 두 글자를 성으로 봅니다. "김민지"와 "남궁민"을 나눠 ''김 민지 / 남궁 민''을 출력하세요.'
    starter: |-
      SURNAMES = {"남궁", "황보", "선우"}

      print("여기에 split_name을 만들어 보세요")
    answer: |-
      SURNAMES = {"남궁", "황보", "선우"}


      def split_name(full):
          n = 2 if full[:2] in SURNAMES else 1
          return full[:n], full[n:]


      a, b = split_name("김민지")
      c, d = split_name("남궁민")
      print(f"{a} {b} / {c} {d}")
    output: "김 민지 / 남궁 민"
    hint: "return x, y는 튜플 하나를 돌려줍니다. 받는 쪽에서 a, b = ...로 풀면 됩니다."
    explanation: "Python과 Rust는 결과가 여럿이면 튜플로 한 번에 돌려주고, 부른 쪽이 이름을 붙여 풉니다. C라면 void split_name(const char *full, char *surname, size_t s_size, char *given, size_t g_size)처럼 출력 매개변수 두 개와 각각의 버퍼 크기가 필요합니다. 한글은 UTF-8로 3바이트라 C에서는 글자 수 대신 바이트 수로 잘라야 하는 점도 더 어렵습니다(Day 38)."
    commonMistakes:
      - "return [full[:n], full[n:]]로 리스트를 돌려줘도 되지만, 결과 개수가 정해진 경우는 튜플이 관례임"
      - "full[0]만 성으로 봐서 두 글자 성을 처리하지 못함"
    language: python
    verification: run
quiz:
  - id: quiz-day43-01
    question: C에서 void f(int x) { x = 5; }를 f(a)로 부르면 a는?
    choices:
      - 5가 된다
      - 그대로다(x는 a의 복사본)
      - 컴파일 오류
      - 정의되지 않은 동작
    answerIndex: 1
    explanation: C의 인자는 모두 값으로 복사됩니다. 부른 쪽 변수를 바꾸려면 void f(int *x) { *x = 5; }로 만들고 f(&a)로 불러야 합니다. 이렇게 결과를 담으려고 받는 포인터 매개변수를 출력 매개변수라고 합니다.
  - id: quiz-day43-02
    question: "int parse(const char *s, int *out)이 실패할 때 지켜야 할 관례는?"
    choices:
      - "*out에 -1을 쓴다"
      - 0(실패)을 돌려주고 *out은 건드리지 않는다
      - 프로그램을 끝낸다
      - out을 NULL로 바꾼다
    answerIndex: 1
    explanation: 부르는 쪽이 성공 여부를 확인하고 결과를 쓰게 하려면, 실패할 때 결과 칸을 그대로 두는 것이 안전합니다. 부른 쪽이 미리 기본값을 넣어 두면 실패해도 그 값이 유지됩니다.
  - id: quiz-day43-03
    question: 힙에 만든 문자열을 출력 매개변수로 돌려주는 함수의 매개변수 자료형은?
    choices:
      - "char *out"
      - "char **out"
      - "char out[]"
      - "const char *out"
    answerIndex: 1
    explanation: 부른 쪽의 char * 변수 자체를 바꿔야 하므로 그 변수의 주소, 즉 char **를 받습니다. 함수 안에서 *out = malloc(...)으로 새 주소를 써 넣고, 부른 쪽은 다 쓴 뒤 free합니다. 연결 리스트의 push(struct node **head, ...)와 같은 원리입니다(Day 41).
  - id: quiz-day43-04
    question: Rust에서 C의 "반환값은 성공 여부, 결과는 *out"에 해당하는 것은?
    choices:
      - "&mut 매개변수 두 개"
      - Option<T>나 Result<T, E>를 돌려주기
      - 전역 변수
      - 패닉
    answerIndex: 1
    explanation: Result<T, E>는 성공한 값(Ok)과 실패 이유(Err) 중 하나를 담고, 부르는 쪽이 match나 ?로 처리하도록 강제합니다. 결과를 확인하지 않고 쓰는 실수가 컴파일할 때 막힙니다. 결과가 여럿이면 Result<(T1, T2), E>처럼 튜플을 담습니다.
  - id: quiz-day43-05
    question: div_mod(17, 5, NULL, &r)처럼 NULL을 받을 수 있는 출력 매개변수를 만들 때 함수가 해야 할 일은?
    choices:
      - 아무것도 하지 않아도 된다
      - 쓰기 전에 포인터가 NULL인지 검사한다
      - NULL에 결과를 쓴다
      - malloc으로 공간을 만든다
    answerIndex: 1
    explanation: NULL 주소에 쓰면 프로그램이 멈춥니다. if (q != NULL) *q = a / b;처럼 검사하면 부르는 쪽이 필요한 결과만 받을 수 있습니다. 표준 함수 strtol의 end 매개변수도 NULL을 받을 수 있습니다.
---

## 1. 오늘 배울 내용

C 함수는 `return`으로 값을 **하나만** 돌려줄 수 있습니다. 그런데 실제로는 결과가 여럿이거나, "성공했는지"와 "결과"를 함께 알려야 하는 경우가 많습니다. C는 이럴 때 **포인터 매개변수**로 부른 쪽의 변수에 결과를 써 넣습니다. 이런 매개변수를 **출력 매개변수**(output parameter)라고 합니다.

1. 왜 포인터가 필요한지: C의 인자는 항상 **값으로 복사**됩니다.
2. 기본 모양
   - 두 변수 바꾸기: `swap(&x, &y)`
   - 결과 두 개: `min_max(a, n, &lo, &hi)`
3. 관례 세 가지
   - **반환값은 성공 여부, 결과는 `*out`**: `parse_score(s, &v)`, 표준 함수 `strtol`의 `end`
   - **필요 없는 결과는 `NULL`**: 함수가 쓰기 전에 검사합니다.
   - **힙 결과는 `char **out`**: 부른 쪽이 `free`합니다.
4. 같은 일을 다른 언어로
   - Rust: 튜플, `Option`, `Result`, 정말 제자리에서 바꿀 때만 `&mut`
   - Python: 튜플 반환, 예외
5. "HH:MM" 두 시각 사이의 공부 시간을 계산하는 프로그램을 세 언어로 만듭니다.

## 2. 왜 필요한가

출력 매개변수는 C 표준 라이브러리 곳곳에 있습니다.

- `scanf("%d", &x)`: 읽은 값을 `x`에 써 넣고, 반환값은 성공한 개수입니다.
- `strtol(s, &end, 10)`: 변환한 값을 돌려주고, 어디까지 읽었는지를 `end`에 씁니다.
- 운영체제 함수들: 대부분 반환값으로 성공·실패를 알리고, 결과는 포인터로 받습니다.

또 "실패를 특별한 값으로 표시하기"(예: 빈 배열의 평균을 0으로)는 그 값이 정상 결과일 수도 있을 때 버그를 만듭니다. 성공 여부와 결과를 나누는 습관은 C뿐 아니라 Rust의 `Result`, Python의 예외 설계로도 이어집니다.

## 3. 그림으로 이해하기

`step(&x, y)`를 부르면 두 값이 **복사**되어 넘어갑니다. 하나는 `x`의 **주소**, 하나는 `y`의 **값**입니다.

```text
main                          step
x ┌────┐ ◀──────────────┐     a ┌──────────┐
  │ 1  │                └─────  │ x의 주소 │   *a += b  → x가 바뀐다
  └────┘                        └──────────┘
y ┌────┐     값 10을 복사       b ┌────┐
  │ 10 │ ───────────────────▶    │ 10 │         b += 1  → 복사본만 11, y는 그대로
  └────┘                         └────┘
```

"성공 여부 + `*out`" 관례입니다.

```text
int v = -1;                    parse_score("85", &v)
                               ┌─────────────────────────┐
v ┌────┐ ◀── *out = 85 ─────── │ 성공: 결과를 쓰고 1 반환  │
  │ 85 │                       └─────────────────────────┘
  └────┘
                               parse_score("abc", &v)
v ┌────┐                       ┌─────────────────────────┐
  │ -1 │   (건드리지 않음)       │ 실패: 0만 반환           │
  └────┘                       └─────────────────────────┘
```

힙 결과를 돌려줄 때는 **포인터 변수의 주소**를 넘깁니다.

```text
char *label = NULL;            make_label("momo", 95, &label)
label ┌──────┐                  out ┌──────────────┐
      │ NULL │ ◀──────────────────  │ label의 주소  │
      └──────┘                      └──────────────┘
         │ *out = p;                p ──▶ 힙 "momo:95점"
         ▼
label ┌──────┐
      │  p   │──▶ 힙 "momo:95점"    다 쓴 뒤 main이 free(label)
      └──────┘
```

## 4. 천천히 풀어보기

### 4.1 출력 매개변수의 세 가지 모양

| 모양                     | 예                                         | 부르는 법                     |
| ------------------------ | ------------------------------------------ | ----------------------------- |
| 값 바꾸기(입력이자 출력) | `void swap(int *a, int *b)`                | `swap(&x, &y)`                |
| 결과만 받기              | `void min_max(..., int *min, int *max)`    | `min_max(a, n, &lo, &hi)`     |
| 성공 여부 + 결과         | `int parse_score(const char *s, int *out)` | `if (parse_score(s, &v)) ...` |

이름을 `out`, `result`처럼 짓거나 문서에 "결과를 쓴다"고 적어서, 이 포인터가 **입력이 아니라 출력**이라는 것을 알려 주세요. 읽기만 하는 포인터에는 `const`를 붙여 구별합니다.

### 4.2 성공 여부 관례

- 성공이면 1(또는 0), 실패면 0(또는 음수)처럼 팀마다 약속이 다릅니다. 표준 라이브러리도 함수마다 다르니 문서를 확인하세요.
- 실패할 때 `*out`을 **건드리지 않으면**, 부른 쪽이 미리 넣어 둔 기본값이 유지됩니다.
- 부른 쪽은 반환값을 **반드시 확인**한 뒤에 결과를 씁니다. 확인하지 않으면 초기화되지 않은 변수를 읽을 수 있습니다.

`strtol`은 좋은 예입니다. `long v = strtol(s, &end, 10);`에서 `end`는 "변환이 멈춘 곳"을 가리킵니다. `end == s`면 숫자가 하나도 없었고, `*end != '\0'`이면 뒤에 숫자가 아닌 글자가 남아 있습니다.

### 4.3 선택적 출력과 힙 결과

- `NULL`을 받을 수 있는 출력 매개변수는 쓰기 전에 `if (q != NULL)`로 검사합니다.
- 함수가 새 공간을 만들어 돌려줄 때는 `char **out`처럼 **포인터의 포인터**를 받습니다. 반환값을 성공 여부로 쓰면서 힙 결과도 돌려줄 수 있습니다. 해제 책임은 부른 쪽에 있다고 문서에 적습니다(Day 40).

### 4.4 Rust와 Python에서는

| C의 모양              | Rust                              | Python                                |
| --------------------- | --------------------------------- | ------------------------------------- |
| `swap(&x, &y)`        | `std::mem::swap(&mut x, &mut y)`  | `x, y = y, x`                         |
| 결과 두 개            | `-> (i32, i32)`                   | `return a, b`                         |
| 성공 여부 + `*out`    | `-> Option<T>`, `-> Result<T, E>` | 값 반환 + 실패 시 예외(또는 `None`)   |
| 선택적 출력(`NULL`)   | 받지 않을 값은 `let (_, r) = ...` | `_, r = ...`                          |
| `char **out`(힙 결과) | `-> String`(소유권 이동)          | `return` 새 문자열                    |
| 제자리 수정           | `&mut T` 매개변수                 | 바꿀 수 있는 객체(리스트)의 내용 수정 |

Rust와 Python은 결과를 **돌려주는** 쪽을 기본으로 삼습니다. 출력 매개변수는 "큰 값을 제자리에서 고칠 때"처럼 이유가 있을 때만 씁니다.

## 5. C로 구현하기

```c
// 파일: out_params.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void swap(int *a, int *b) {                 // 두 변수의 값을 바꾼다
    int t = *a;
    *a = *b;
    *b = t;
}

void min_max(const int a[], int n, int *min, int *max) {   // 결과 두 개
    *min = *max = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *min) {
            *min = a[i];
        }
        if (a[i] > *max) {
            *max = a[i];
        }
    }
}

// 성공 여부는 반환값으로, 결과는 *out으로
int parse_score(const char *s, int *out) {
    char *end;
    long v = strtol(s, &end, 10);           // strtol도 end라는 출력 매개변수를 쓴다
    if (end == s || *end != '\0' || v < 0 || v > 100) {
        return 0;                           // 실패하면 *out은 건드리지 않는다
    }
    *out = (int)v;
    return 1;
}

// 필요 없는 결과는 NULL로 넘길 수 있게
void div_mod(int a, int b, int *q, int *r) {
    if (q != NULL) {
        *q = a / b;
    }
    if (r != NULL) {
        *r = a % b;
    }
}

// 새로 만든 문자열을 **out으로 돌려준다: 부른 쪽이 free
int make_label(const char *name, int score, char **out) {
    size_t size = strlen(name) + 16;
    char *p = malloc(size);
    if (p == NULL) {
        return 0;
    }
    snprintf(p, size, "%s:%d점", name, score);
    *out = p;
    return 1;
}

int main(void) {
    int x = 3, y = 8;
    swap(&x, &y);
    printf("swap: x %d, y %d\n", x, y);

    int scores[] = {72, 95, 61, 88};
    int lo, hi;
    min_max(scores, 4, &lo, &hi);
    printf("min %d, max %d\n", lo, hi);

    const char *inputs[] = {"85", "abc", "120", "7x"};
    for (int i = 0; i < 4; i++) {
        int v = -1;
        if (parse_score(inputs[i], &v)) {
            printf("\"%s\" → %d\n", inputs[i], v);
        } else {
            printf("\"%s\" → 실패 (v는 그대로 %d)\n", inputs[i], v);
        }
    }

    int q, r;
    div_mod(17, 5, &q, &r);
    int only_r;
    div_mod(17, 5, NULL, &only_r);
    printf("17 / 5 = %d 나머지 %d, 나머지만 %d\n", q, r, only_r);

    char *label = NULL;
    if (make_label("momo", 95, &label)) {
        printf("label: %s\n", label);
        free(label);
    }
    return 0;
}
```

실행 결과:

```text
swap: x 8, y 3
min 61, max 95
"85" → 85
"abc" → 실패 (v는 그대로 -1)
"120" → 실패 (v는 그대로 -1)
"7x" → 실패 (v는 그대로 -1)
17 / 5 = 3 나머지 2, 나머지만 2
label: momo:95점
```

### 코드 한 부분씩 읽기

| 코드                                                      | 설명                                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `int t = *a; *a = *b; *b = t;`                            | 두 주소가 가리키는 값을 바꿉니다. 포인터 자체(`a`, `b`)는 바꾸지 않습니다.                                               |
| `*min = *max = a[0];`                                     | 두 결과 칸을 첫 값으로 채운 뒤 비교를 시작합니다. `n`이 0이면 `a[0]`부터 잘못이라, 실전에서는 빈 배열 검사가 필요합니다. |
| `long v = strtol(s, &end, 10);`                           | 표준 함수도 출력 매개변수를 씁니다. `end`에 "읽기를 멈춘 곳"이 들어옵니다.                                               |
| `if (end == s \|\| *end != '\0' \|\| v < 0 \|\| v > 100)` | 숫자가 없거나, 뒤에 글자가 남았거나, 범위 밖이면 실패입니다. `"7x"`는 7까지 읽고 `end`가 `x`를 가리켜 실패입니다.        |
| `return 0;`(실패) / `*out = (int)v; return 1;`            | 실패할 때 `*out`을 건드리지 않아서, `main`이 미리 넣은 -1이 그대로 출력됐습니다.                                         |
| `if (q != NULL) { *q = a / b; }`                          | 몫이 필요 없으면 `NULL`을 넘길 수 있게 했습니다.                                                                         |
| `int make_label(const char *name, int score, char **out)` | 반환값은 성공 여부, 힙에 만든 문자열은 `*out`으로 돌려줍니다. `main`이 `free(label)`을 합니다.                           |

## 6. Rust로 구현하기

```rust
// 파일: many_results.rs
fn min_max(xs: &[i32]) -> Option<(i32, i32)> {   // 결과 두 개는 튜플로, 빈 목록은 None
    let first = *xs.first()?;
    let mut lo = first;
    let mut hi = first;
    for &x in &xs[1..] {
        lo = lo.min(x);
        hi = hi.max(x);
    }
    Some((lo, hi))
}

fn parse_score(s: &str) -> Result<u32, String> {  // 성공한 값과 실패 이유를 한 자료형에
    let v: u32 = s.parse().map_err(|_| format!("숫자가 아님: {s}"))?;
    if v > 100 {
        return Err(format!("범위 밖: {v}"));
    }
    Ok(v)
}

fn div_mod(a: i32, b: i32) -> (i32, i32) {
    (a / b, a % b)
}

fn add_bonus(score: &mut u32, bonus: u32) {     // 정말 제자리에서 바꿔야 할 때만 &mut
    *score = (*score + bonus).min(100);
}

fn main() {
    let (mut x, mut y) = (3, 8);
    std::mem::swap(&mut x, &mut y);
    println!("swap: x {x}, y {y}");

    if let Some((lo, hi)) = min_max(&[72, 95, 61, 88]) {
        println!("min {lo}, max {hi}");
    }
    println!("빈 목록: {:?}", min_max(&[]));

    for s in ["85", "abc", "120", "7x"] {
        match parse_score(s) {
            Ok(v) => println!("\"{s}\" → {v}"),
            Err(e) => println!("\"{s}\" → 실패 ({e})"),
        }
    }

    let (q, r) = div_mod(17, 5);
    let (_, only_r) = div_mod(17, 5);       // 필요 없는 결과는 _로 버린다
    println!("17 / 5 = {q} 나머지 {r}, 나머지만 {only_r}");

    let mut score = 95;
    add_bonus(&mut score, 10);
    println!("보너스 뒤 {score}");
    let label = format!("momo:{score}점");   // 새 문자열은 그냥 돌려받는다
    println!("label: {label}");
}
```

실행 결과:

```text
swap: x 8, y 3
min 61, max 95
빈 목록: None
"85" → 85
"abc" → 실패 (숫자가 아님: abc)
"120" → 실패 (범위 밖: 120)
"7x" → 실패 (숫자가 아님: 7x)
17 / 5 = 3 나머지 2, 나머지만 2
보너스 뒤 100
label: momo:100점
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `std::mem::swap(&mut x, &mut y)`               | 표준 라이브러리의 `swap`은 C처럼 두 가변 참조를 받습니다. 두 참조가 서로 다른 변수라는 것을 빌림 규칙이 보장합니다.          |
| `fn min_max(xs: &[i32]) -> Option<(i32, i32)>` | 결과 두 개를 튜플로, 빈 목록은 `None`으로 돌려줍니다. C의 `min_max`가 빈 배열에서 `a[0]`을 읽는 문제를 자료형이 막습니다.    |
| `let first = *xs.first()?;`                    | 빈 목록이면 `?`가 곧바로 `None`을 돌려줍니다.                                                                                |
| `s.parse().map_err(\|_\| format!(...))?`       | 변환 오류를 우리 오류 문장으로 바꾼 뒤 `?`로 돌려줍니다. C의 "실패하면 0 반환"에 **실패 이유**까지 담은 것입니다.            |
| `let (_, only_r) = div_mod(17, 5);`            | 필요 없는 결과는 `_`로 버립니다. C의 `NULL` 출력에 해당합니다.                                                               |
| `fn add_bonus(score: &mut u32, bonus: u32)`    | 제자리에서 바꾸는 함수입니다. 부를 때 `&mut score`를 써야 해서 "이 줄에서 `score`가 바뀐다"는 것이 호출하는 곳에 드러납니다. |
| `format!("momo:{score}점")`                    | 새 문자열은 `String`으로 그냥 돌려받습니다. `char **out`과 `free`가 필요 없습니다.                                           |

## 7. Python으로 구현하기

```python
# 파일: many_results.py
def min_max(xs):
    if not xs:
        return None
    return min(xs), max(xs)                 # 튜플 하나로 여러 값을 돌려준다


def parse_score(s):
    v = int(s)                              # 숫자가 아니면 ValueError
    if not 0 <= v <= 100:
        raise ValueError(f"범위 밖: {v}")
    return v


x, y = 3, 8
x, y = y, x                                 # 바꾸기는 튜플 대입 한 줄
print(f"swap: x {x}, y {y}")

lo, hi = min_max([72, 95, 61, 88])
print(f"min {lo}, max {hi}")
print("빈 목록:", min_max([]))

for s in ["85", "abc", "120", "7x"]:
    try:
        print(f'"{s}" → {parse_score(s)}')
    except ValueError as e:
        print(f'"{s}" → 실패 ({e})')

q, r = divmod(17, 5)
_, only_r = divmod(17, 5)
print(f"17 / 5 = {q} 나머지 {r}, 나머지만 {only_r}")


def add_bonus(scores, i, bonus):            # 정수는 못 바꾸니, 담고 있는 리스트를 바꾼다
    scores[i] = min(scores[i] + bonus, 100)


box = [95]
add_bonus(box, 0, 10)
print("보너스 뒤", box[0])
```

실행 결과:

```text
swap: x 8, y 3
min 61, max 95
빈 목록: None
"85" → 85
"abc" → 실패 (invalid literal for int() with base 10: 'abc')
"120" → 실패 (범위 밖: 120)
"7x" → 실패 (invalid literal for int() with base 10: '7x')
17 / 5 = 3 나머지 2, 나머지만 2
보너스 뒤 100
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `return min(xs), max(xs)`              | 쉼표로 나열하면 튜플 하나를 돌려줍니다. `lo, hi = ...`로 풀어 받습니다.                                                                                                        |
| `x, y = y, x`                          | 오른쪽 튜플을 먼저 만든 뒤 풀어 넣어서 임시 변수가 필요 없습니다. Python에서 `swap` 함수를 만들 수 없는 대신 이렇게 씁니다.                                                    |
| `v = int(s)` / `raise ValueError(...)` | 실패는 예외로 알립니다. 부른 쪽은 `try`/`except`로 처리합니다. 반환값으로 실패를 표시하지 않으므로 "0이 결과인지 실패인지" 헷갈리지 않습니다.                                  |
| `divmod(17, 5)`                        | 몫과 나머지를 튜플로 돌려주는 내장 함수입니다.                                                                                                                                 |
| `def add_bonus(scores, i, bonus)`      | 정수는 바꿀 수 없어서 "정수 하나를 제자리에서 바꾸는" 함수는 만들 수 없습니다. 리스트에 담아 넘기고 칸을 바꾸는 방식으로 흉내 냈습니다. 보통은 새 값을 돌려받는 편이 낫습니다. |

## 8. 실행 추적

C 예제에서 `parse_score("7x", &v)`가 도는 과정을 따라갑니다. `main`의 `v`는 -1로 시작합니다.

| 단계                  | `s`가 가리키는 곳 | `end`가 가리키는 곳 | `v`(strtol 결과) | `main`의 `v` |
| --------------------- | ----------------- | ------------------- | ---------------- | ------------ |
| 부르기 전             | `"7x"`의 `7`      | -                   | -                | -1           |
| `strtol(s, &end, 10)` | `7`               | `x`                 | 7                | -1           |
| `end == s`?           |                   |                     |                  | 아니요       |
| `*end != '\0'`?       |                   | `'x'`               |                  | 예 → 실패    |
| `return 0;`           |                   |                     |                  | -1(그대로)   |

`strtol`은 읽을 수 있는 만큼 읽고 멈춥니다. 7을 돌려줬지만 뒤에 `x`가 남아 있어서, 입력 전체가 숫자라는 조건을 우리가 `*end`로 한 번 더 확인했습니다.

## 9. 다른 예제로 다시 이해하기

**공부 시간 계산.** "09:30 ~ 11:05"처럼 시작과 끝 시각을 받아 공부한 시간을 "1시간 35분"으로 계산하고, 형식이 틀린 기록은 건너뛴 뒤 합계를 냅니다. 자정을 넘긴 기록(23:40 ~ 00:20)은 다음 날로 봅니다.

```c
// 파일: study_time.c
#include <ctype.h>
#include <stdio.h>

// "HH:MM"을 읽어 *minutes(자정부터의 분)에 넣는다. 실패하면 0을 돌려주고 *minutes는 그대로
int parse_time(const char *s, int *minutes) {
    for (int i = 0; i < 5; i++) {
        if (i == 2 ? s[i] != ':' : !isdigit((unsigned char)s[i])) {
            return 0;
        }
    }
    if (s[5] != '\0') {
        return 0;
    }
    int h = (s[0] - '0') * 10 + (s[1] - '0');
    int m = (s[3] - '0') * 10 + (s[4] - '0');
    if (h > 23 || m > 59) {
        return 0;
    }
    *minutes = h * 60 + m;
    return 1;
}

// 두 시각 사이의 시간을 *hours, *mins로 돌려준다. 자정을 넘기면 다음 날로 본다
int duration(const char *from, const char *to, int *hours, int *mins) {
    int a, b;
    if (!parse_time(from, &a) || !parse_time(to, &b)) {
        return 0;
    }
    int d = (b - a + 24 * 60) % (24 * 60);
    *hours = d / 60;
    *mins = d % 60;
    return 1;
}

int main(void) {
    const char *pairs[][2] = {
        {"09:30", "11:05"},
        {"23:40", "00:20"},
        {"7:30", "08:00"},
        {"10:00", "10:75"},
    };
    int total = 0;
    for (int i = 0; i < 4; i++) {
        int h, m;
        if (duration(pairs[i][0], pairs[i][1], &h, &m)) {
            printf("%s ~ %s: %d시간 %d분\n", pairs[i][0], pairs[i][1], h, m);
            total += h * 60 + m;
        } else {
            printf("%s ~ %s: 형식 오류\n", pairs[i][0], pairs[i][1]);
        }
    }
    printf("합계 %d분\n", total);
    return 0;
}
```

실행 결과:

```text
09:30 ~ 11:05: 1시간 35분
23:40 ~ 00:20: 0시간 40분
7:30 ~ 08:00: 형식 오류
10:00 ~ 10:75: 형식 오류
합계 135분
```

| 코드                                                                    | 설명                                                                                                                                                    |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int parse_time(const char *s, int *minutes)`                           | 성공하면 자정부터의 분을 `*minutes`에 쓰고 1을 돌려줍니다. 틀리면 0만 돌려줍니다.                                                                       |
| `if (i == 2 ? s[i] != ':' : !isdigit(...))`                             | 2번 칸은 `:`, 나머지 네 칸은 숫자여야 합니다. `"7:30"`은 1번 칸이 `:`이라 실패합니다. 문자열이 짧으면 `'\0'`에서 검사가 실패해 배열 밖을 읽지 않습니다. |
| `int duration(const char *from, const char *to, int *hours, int *mins)` | 결과 두 개(시간, 분)를 출력 매개변수로 돌려줍니다. 안에서 `parse_time`을 두 번 부르고, 하나라도 실패하면 곧바로 실패를 전합니다.                        |
| `(b - a + 24 * 60) % (24 * 60)`                                         | 끝이 시작보다 이르면 하루(1440분)를 더해 다음 날로 봅니다. C의 `%`는 음수에서 음수를 줄 수 있어서 먼저 1440을 더했습니다.                               |
| `const char *pairs[][2]`                                                | "문자열 두 개짜리 줄"의 배열입니다. `pairs[i][0]`이 시작, `pairs[i][1]`이 끝입니다.                                                                     |

같은 프로그램을 Rust로 쓰면, 결과 두 개와 실패 이유를 `Result<(u32, u32), String>` 하나에 담습니다.

```rust
// 파일: study_time.rs
fn parse_time(s: &str) -> Result<u32, String> {
    let (h, m) = s.split_once(':').ok_or(format!("':'가 없음: {s}"))?;
    if h.len() != 2 || m.len() != 2 {
        return Err(format!("두 자리가 아님: {s}"));
    }
    let h: u32 = h.parse().map_err(|_| format!("숫자가 아님: {s}"))?;
    let m: u32 = m.parse().map_err(|_| format!("숫자가 아님: {s}"))?;
    if h > 23 || m > 59 {
        return Err(format!("범위 밖: {s}"));
    }
    Ok(h * 60 + m)
}

fn duration(from: &str, to: &str) -> Result<(u32, u32), String> {
    let a = parse_time(from)?;
    let b = parse_time(to)?;
    let d = (b + 24 * 60 - a) % (24 * 60);
    Ok((d / 60, d % 60))
}

fn main() {
    let pairs = [("09:30", "11:05"), ("23:40", "00:20"), ("7:30", "08:00"), ("10:00", "10:75")];
    let mut total = 0;
    for (from, to) in pairs {
        match duration(from, to) {
            Ok((h, m)) => {
                println!("{from} ~ {to}: {h}시간 {m}분");
                total += h * 60 + m;
            }
            Err(e) => println!("{from} ~ {to}: 형식 오류 ({e})"),
        }
    }
    println!("합계 {total}분");
}
```

실행 결과:

```text
09:30 ~ 11:05: 1시간 35분
23:40 ~ 00:20: 0시간 40분
7:30 ~ 08:00: 형식 오류 (두 자리가 아님: 7:30)
10:00 ~ 10:75: 형식 오류 (범위 밖: 10:75)
합계 135분
```

- `let a = parse_time(from)?;`는 C의 `if (!parse_time(from, &a)) return 0;`을 한 글자로 줄인 것입니다. 실패 이유도 그대로 전달됩니다.
- `(b + 24 * 60 - a) % (24 * 60)`에서 `u32`는 음수가 될 수 없어서, 빼기 전에 더했습니다. 순서를 바꾸면 `b < a`일 때 패닉입니다(Day 36의 `saturating_sub`과 같은 주의).
- `Ok((d / 60, d % 60))`의 바깥 괄호는 `Ok(...)`, 안쪽은 튜플입니다.

Python에서는 튜플 반환과 예외로 씁니다.

```python
# 파일: study_time.py
def parse_time(s):
    h, sep, m = s.partition(":")
    if sep != ":" or len(h) != 2 or len(m) != 2 or not (h + m).isdigit():
        raise ValueError(f"형식이 틀림: {s}")
    h, m = int(h), int(m)
    if h > 23 or m > 59:
        raise ValueError(f"범위 밖: {s}")
    return h * 60 + m


def duration(start, end):
    d = (parse_time(end) - parse_time(start)) % (24 * 60)   # Python의 %는 음수도 0 이상으로
    return divmod(d, 60)


total = 0
for start, end in [("09:30", "11:05"), ("23:40", "00:20"), ("7:30", "08:00"), ("10:00", "10:75")]:
    try:
        h, m = duration(start, end)
    except ValueError as e:
        print(f"{start} ~ {end}: 형식 오류 ({e})")
        continue
    print(f"{start} ~ {end}: {h}시간 {m}분")
    total += h * 60 + m
print(f"합계 {total}분")
```

실행 결과:

```text
09:30 ~ 11:05: 1시간 35분
23:40 ~ 00:20: 0시간 40분
7:30 ~ 08:00: 형식 오류 (형식이 틀림: 7:30)
10:00 ~ 10:75: 형식 오류 (범위 밖: 10:75)
합계 135분
```

- Python의 `%`는 오른쪽이 양수면 결과가 항상 0 이상이라, `(end - start) % 1440`을 그대로 써도 됩니다. C와 Rust에서 먼저 1440을 더한 이유와 비교해 보세요.
- `divmod(d, 60)`이 `(시간, 분)` 튜플을 돌려주고, `h, m = ...`으로 풀어 받습니다.
- `continue`로 오류 난 기록을 건너뛰어 `total`에 더하지 않았습니다.

## 10. 결과를 돌려주는 방법 정리

| 상황                           | C                                 | Rust                        | Python                        |
| ------------------------------ | --------------------------------- | --------------------------- | ----------------------------- |
| 결과 하나                      | `return`                          | `-> T`                      | `return`                      |
| 결과 여럿                      | 출력 매개변수 여럿                | 튜플 `-> (A, B)`            | 튜플                          |
| 실패할 수 있음                 | 반환값 = 성공 여부, 결과 = `*out` | `Option<T>`, `Result<T, E>` | 예외, 또는 `None`             |
| 실패 이유까지                  | 오류 번호(`errno`) 등 따로        | `Result<T, E>`의 `E`        | 예외 객체와 메시지            |
| 필요 없는 결과                 | `NULL` 넘기기                     | `_`로 버리기                | `_`로 버리기                  |
| 새로 만든 큰 결과              | `char **out` + 부른 쪽 `free`     | `String`, `Vec` 반환        | 그냥 반환                     |
| 부른 쪽 값을 제자리에서 바꾸기 | `T *`                             | `&mut T`                    | 바꿀 수 있는 객체의 내용 수정 |

## 11. 세 언어 비교

| 관점                   | C                               | Rust                                              | Python                             |
| ---------------------- | ------------------------------- | ------------------------------------------------- | ---------------------------------- |
| 인자 전달              | 항상 값 복사(주소도 값)         | 이동, 또는 `&`/`&mut` 빌림                        | 객체 참조                          |
| 부른 쪽 변수 바꾸기    | `&x`로 주소를 넘김              | `let mut` + `&mut x`                              | 불가능(객체 내용만 바꿀 수 있음)   |
| 결과를 확인하지 않으면 | 초기화되지 않은 값을 쓸 수 있음 | `Result`를 무시하면 경고, 값을 꺼내려면 처리 필수 | 예외가 위로 올라가 프로그램이 멈춤 |
| 출력 매개변수의 쓰임   | 매우 흔함                       | 드묾(제자리 수정)                                 | 거의 없음                          |

## 12. 자주 하는 실수

### 실수 1: 출력 매개변수에 &를 빠뜨린다 (C)

```c
// 파일: missing_ampersand.c (컴파일 오류: makes pointer from integer without a cast)
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int x = 3, y = 8;
    swap(x, y);
    printf("%d %d\n", x, y);
    return 0;
}
```

정수를 포인터 자리에 넘겼습니다. `swap(&x, &y)`로 쓰세요. `scanf("%d", x)`도 같은 실수입니다.

### 실수 2: 포인터가 가리키는 값 대신 포인터 자체에 대입한다 (C)

```c
// 파일: assign_pointer.c (컴파일 오류: parameter 'p' set but not used)
#include <stdio.h>

void reset(int *p) {
    static int zero = 0;
    p = &zero;
}

int main(void) {
    int score = 95;
    reset(&score);
    printf("%d\n", score);
    return 0;
}
```

`p = &zero;`는 함수 안의 복사본 `p`가 다른 곳을 가리키게 할 뿐입니다. `*p = 0;`으로 **가리키는 값**을 바꿔야 합니다. 부른 쪽의 포인터 자체를 바꾸고 싶다면 `int **p`를 받아야 합니다.

### 실수 3: 반환값을 확인하지 않고 결과를 쓴다 (C)

`int v; parse_score(s, &v); printf("%d", v);`는 실패했을 때 초기화되지 않은 `v`를 읽습니다. `if (parse_score(s, &v))`로 확인하거나, 미리 기본값을 넣어 두세요.

### 실수 4: mut 없이 &mut로 빌린다 (Rust)

```rust
// 파일: not_mut.rs (컴파일 오류: E0596)
fn add_bonus(score: &mut u32, bonus: u32) {
    *score += bonus;
}

fn main() {
    let score = 95;
    add_bonus(&mut score, 3);
    println!("{score}");
}
```

실습의 디버그 문제입니다. `let mut score`로 선언하세요.

### 실수 5: Python에서 정수를 함수 안에서 바꾸려 한다

실습의 예측 문제입니다. 이름을 다시 대입해도 부른 쪽에는 보이지 않습니다. 결과를 돌려주고 부른 쪽이 받으세요.

## 13. Q&A

**Q. C에서 결과가 여럿일 때 구조체를 돌려주면 안 되나요?**

A. 됩니다. `struct range { int min, max; }`를 만들어 값으로 돌려주면 출력 매개변수 없이도 결과 두 개를 받을 수 있습니다(Day 50). 작은 구조체는 값으로 돌려주는 비용이 크지 않습니다. 다만 "성공 여부"까지 함께 알려야 할 때는 여전히 출력 매개변수 관례가 흔합니다.

**Q. 출력 매개변수와 반환값 중 무엇이 더 빠른가요?**

A. 작은 값은 차이가 거의 없습니다. 큰 구조체를 매번 새로 만들기보다 부른 쪽이 준비한 공간을 채우는 편이 복사를 줄일 수 있어서, 성능이 중요한 C 코드는 출력 매개변수를 선호하기도 합니다. Rust와 C++의 컴파일러는 반환값을 부른 쪽 공간에 바로 만드는 최적화를 해서 이 차이가 더 작습니다.

**Q. Rust에서 &mut 매개변수는 언제 쓰나요?**

A. 받은 것을 **제자리에서** 고치는 게 목적일 때입니다. `Vec`에 값을 추가하는 함수(`fn add_items(list: &mut Vec<String>)`), 큰 버퍼를 채우는 함수(`read(&mut buf)`)가 대표적입니다. 새 값을 계산하는 함수는 값을 돌려주는 편이 읽기 쉽고 테스트하기도 쉽습니다.

**Q. Python에서 결과가 많으면 튜플 말고 무엇을 쓰나요?**

A. 셋 이상이면 튜플의 순서를 외우기 어렵습니다. `collections.namedtuple`이나 `dataclass`(Day 51)로 이름 붙은 결과를 돌려주면 `result.min`, `result.max`처럼 읽을 수 있습니다. Rust에서는 구조체를 돌려줍니다.

## 14. 핵심 요약

- C의 인자는 **항상 값으로 복사**됩니다. 부른 쪽 변수를 바꾸려면 주소(`&x`)를 넘기고 함수가 `*p = ...`로 씁니다. 이런 매개변수를 출력 매개변수라고 합니다.
- 관례: **반환값은 성공 여부, 결과는 `*out`**. 실패할 때 `*out`을 건드리지 않고, 부른 쪽은 반환값을 확인한 뒤에만 결과를 씁니다.
- 필요 없는 결과는 `NULL`로 받을 수 있게 하고(쓰기 전 검사), 힙 결과는 `char **out`으로 돌려주며 부른 쪽이 `free`합니다.
- Rust는 튜플·`Option`·`Result`로 결과와 실패를 **돌려주고**, 제자리 수정이 필요할 때만 `let mut` + `&mut`를 씁니다.
- Python은 튜플 반환과 예외를 씁니다. 함수 안에서 정수 같은 바꿀 수 없는 값을 부른 쪽 대신 바꿀 수는 없습니다.

## 15. 도전 문제

1. **(C)** `int parse_date(const char *s, int *y, int *m, int *d)`로 `"2026-11-12"`를 세 값으로 나누세요. 달마다 날 수(윤년 포함)까지 검사해 `"2026-02-30"`은 실패하게 합니다.
2. **(C)** `int split_first_word(const char *s, char *word, size_t size, const char **rest)`로 첫 단어를 `word`에 복사하고, 나머지가 시작하는 곳을 `*rest`에 돌려주세요. 반복해서 부르면 문장의 모든 단어를 꺼낼 수 있습니다.
3. **(Rust)** 공부 시간 예제를 `fn total_minutes(pairs: &[(&str, &str)]) -> (u32, Vec<String>)`로 바꿔, 합계와 오류 목록을 함께 돌려주세요.
4. **(Python)** `min_max`를 `dataclass`(또는 `namedtuple`)로 이름 붙은 결과를 돌려주게 바꾸고, `r.min`, `r.max`로 읽어 보세요.
