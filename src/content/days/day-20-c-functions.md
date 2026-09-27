---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-20-c-functions
courseId: crp-92
phaseId: phase-02
dayNumber: 20
date: "2026-10-20"
title: 함수 — 이름 붙인 작업, 매개변수와 반환값
summary: 자주 쓰는 계산에 이름을 붙여 여러 번 부를 수 있게 하는 함수를 배웁니다. C 함수의 선언(원형)과 정의, 매개변수와 인자, 반환 자료형과 return, 돌려주는 값이 없는 void, 조건에 따라 일찍 끝내는 이른 반환을 익히고, 인자가 복사되어 넘어가므로 함수 안에서 매개변수를 바꿔도 부른 쪽 변수는 그대로라는 '값에 의한 전달'을 확인합니다. Python의 def·기본값·이름으로 넘기기·여러 값 반환·None, Rust의 fn·자료형 표시·마지막 식 반환·튜플 반환과 비교하고, 온도 변환표와 소수 찾기를 함수로 나눠 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 100
prerequisites: [day-19-nested-loop]
learningObjectives:
  - C 함수의 선언(원형)과 정의를 쓰고, 매개변수·인자·반환값의 관계를 설명한다.
  - return으로 값을 돌려주고, 조건에 따라 일찍 반환하며, void 함수를 쓴다.
  - 인자가 값으로 복사되어 전달된다는 것을 실행 결과로 확인한다.
  - Python의 기본값·이름으로 넘기기·여러 값 반환, Rust의 자료형 표시·마지막 식 반환·튜플 반환을 쓴다.
  - 긴 프로그램을 작은 함수로 나누고, 함수를 조합해 문제를 푼다.
concepts:
  [
    function,
    declaration,
    prototype,
    definition,
    parameter,
    argument,
    return value,
    void,
    pass by value,
    early return,
    default argument,
    keyword argument,
  ]
runnerMode: python
playgroundSource: |
  # 파일: functions.py — 함수를 고치고 여러 값으로 불러 보세요.
  def clamp(value, lo=0, hi=100):
      if value < lo:
          return lo
      if value > hi:
          return hi
      return value

  print(clamp(150), clamp(-5), clamp(42), clamp(7, hi=5))

  def div_mod(a, b):
      return a // b, a % b

  q, r = div_mod(17, 5)
  print(q, r)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day20-predict-c
    title: 값에 의한 전달 예측하기
    kind: predict
    objective: 함수 안에서 매개변수를 바꿔도 부른 쪽의 변수는 바뀌지 않는다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>

      void add_ten(int x) {
          x += 10;
          printf("안: %d ", x);
      }

      int main(void) {
          int a = 5;
          add_ten(a);
          printf("밖: %d\n", a);
          return 0;
      }
    answer: "안: 15 밖: 5"
    hint: "add_ten은 a의 값 5를 복사해 받은 x를 바꿉니다."
    explanation: "C는 인자의 '값'을 매개변수에 복사해 넘깁니다. x는 a와 다른 상자라 x가 15가 되어도 a는 5 그대로입니다. 부른 쪽의 변수를 바꾸려면 값을 돌려받아 대입하거나, 변수의 주소를 넘깁니다(Day 43)."
    commonMistakes:
      - "a도 15로 바뀐다고 생각함"
      - "함수 안의 printf가 main보다 나중에 출력된다고 생각함"
    language: c
    verification: run
  - id: ex-day20-predict-py
    title: 기본값 매개변수 예측하기
    kind: predict
    objective: 기본값이 있는 매개변수를 생략하거나 새 값으로 바꿔 부른다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def greet(name, greeting="안녕"):
          return f"{greeting}, {name}"


      print(greet("민지"), "/", greet("준호", "반가워"))
    answer: "안녕, 민지 / 반가워, 준호"
    hint: '두 번째 인자를 생략하면 기본값 "안녕"을 씁니다.'
    explanation: "기본값은 인자를 넘기지 않았을 때만 쓰입니다. 기본값이 있는 매개변수는 기본값이 없는 매개변수보다 뒤에 와야 합니다. C에는 기본값 기능이 없고, Rust에도 없어서 함수를 따로 만들거나 Option을 받습니다."
    commonMistakes:
      - "두 번째 호출도 '안녕'을 쓴다고 생각함"
      - "인자 순서를 바꿔 이름과 인사말이 뒤바뀐다고 생각함"
    language: python
    verification: run
  - id: ex-day20-fill
    title: Rust 반환 자료형 채우기
    kind: fill
    objective: Rust 함수의 반환 자료형을 화살표로 적는다.
    prompt: "빈칸을 채워 cube(3)의 결과 27이 출력되게 하세요."
    starter: |-
      fn cube(x: i32) _____ {
          x * x * x
      }

      fn main() {
          println!("{}", cube(3));
      }
    answer: |-
      fn cube(x: i32) -> i32 {
          x * x * x
      }

      fn main() {
          println!("{}", cube(3));
      }
    output: "27"
    hint: "매개변수 괄호 뒤에 -> 자료형을 씁니다."
    explanation: "Rust는 매개변수와 반환값의 자료형을 반드시 적습니다(함수 안의 let은 추론 가능). 몸통의 마지막 식 x * x * x에 세미콜론이 없어서 그 값이 반환됩니다. -> i32를 빠뜨리면 '()를 돌려준다'로 읽혀 E0308 오류가 납니다."
    commonMistakes:
      - ": i32로 써서 문법 오류가 남"
      - "마지막 줄에 세미콜론을 붙여 E0308(expected i32, found ())이 남"
    language: rust
    verification: run
  - id: ex-day20-modify
    title: 최댓값 계산을 함수로 나누기
    kind: modify
    objective: 반복되는 계산을 함수로 옮기고 여러 번 부른다.
    prompt: "세 수 중 가장 큰 수를 구하는 max_of_three(a, b, c) 함수를 만들어, (3, 9, 5)와 (-1, -7, -3)에 대해 '9 -1'을 출력하세요. 내장 max는 쓰지 마세요."
    starter: |-
      a, b, c = 3, 9, 5
      best = a
      if b > best:
          best = b
      if c > best:
          best = c
      print(best)
    answer: |-
      def max_of_three(a, b, c):
          best = a
          if b > best:
              best = b
          if c > best:
              best = c
          return best


      print(max_of_three(3, 9, 5), max_of_three(-1, -7, -3))
    output: "9 -1"
    hint: "계산 부분을 def 안으로 옮기고 결과를 return으로 돌려주세요. 입력값은 매개변수가 됩니다."
    explanation: "함수로 만들면 같은 계산을 다른 값으로 여러 번 부를 수 있고, 이름(max_of_three)이 무엇을 하는지 알려 줍니다. best를 0이 아니라 a로 시작해서 음수만 있어도 맞습니다(Day 16)."
    commonMistakes:
      - "함수 안에서 print만 하고 return하지 않아 None이 출력됨"
      - "best를 0에서 시작해 음수 세 개일 때 0을 돌려줌"
    language: python
    verification: run
  - id: ex-day20-debug
    title: 반환이 빠진 C 함수 고치기
    kind: debug
    objective: 값을 돌려주는 함수의 모든 경로에서 return이 있는지 확인한다.
    prompt: "이 코드는 'control reaches end of non-void function' 오류로 컴파일되지 않습니다. 고쳐서 '5 3'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int abs_value(int n) {
          if (n < 0) {
              return -n;
          }
      }

      int main(void) {
          printf("%d %d\n", abs_value(-5), abs_value(3));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int abs_value(int n) {
          if (n < 0) {
              return -n;
          }
          return n;
      }

      int main(void) {
          printf("%d %d\n", abs_value(-5), abs_value(3));
          return 0;
      }
    output: "5 3"
    hint: "n이 0 이상이면 어느 return도 만나지 않고 함수가 끝납니다."
    explanation: "int를 돌려주겠다고 선언한 함수가 값 없이 끝나면, 부른 쪽이 받는 값은 정해지지 않은 쓰레기 값입니다(정의되지 않은 동작). -Wall이 이것을 경고합니다. Rust는 모든 경로에서 값을 돌려주지 않으면 컴파일 오류(E0317, E0308)입니다."
    commonMistakes:
      - "else { return n; }만 쓰고 if 밖에 아무것도 두지 않아도 되는지 헷갈림(둘 다 올바름)"
      - "return 0;을 넣어 양수의 절댓값이 0이 됨"
    language: c
    verification: run
  - id: ex-day20-independent
    title: Rust로 소수 판별 함수 만들기
    kind: independent
    objective: bool을 돌려주는 함수를 만들고 반복 안에서 불러 개수를 센다.
    prompt: "is_prime(n: u32) -> bool을 만들어 1부터 100까지의 소수 개수 25를 출력하세요."
    starter: |-
      fn main() {
          println!("?");
      }
    answer: |-
      fn is_prime(n: u32) -> bool {
          if n < 2 {
              return false;
          }
          let mut d = 2;
          while d * d <= n {
              if n % d == 0 {
                  return false;
              }
              d += 1;
          }
          true
      }

      fn main() {
          let mut count = 0;
          for n in 1..=100 {
              if is_prime(n) {
                  count += 1;
              }
          }
          println!("{count}");
      }
    output: "25"
    hint: "2보다 작으면 소수가 아닙니다. √n까지 나눠 보고 나누어떨어지면 false를 바로 돌려주고, 끝까지 없으면 true입니다."
    explanation: "약수를 찾자마자 return false로 함수를 끝내는 이른 반환 덕분에 break나 깃발 변수가 필요 없습니다(Day 18). 함수로 나눠 두면 main은 '1~100 중 소수를 센다'는 큰 흐름만 보여 줍니다."
    commonMistakes:
      - "1을 소수로 셈(n < 2 검사를 빠뜨림)"
      - "d * d < n으로 써서 25 같은 제곱수를 소수로 판정함"
    language: rust
    verification: run
quiz:
  - id: quiz-day20-01
    question: C에서 함수 원형(선언) int square(int x);를 main 위에 두는 이유는?
    choices:
      - 함수를 두 번 실행하려고
      - main에서 square를 부를 때 컴파일러가 인자와 반환 자료형을 알 수 있게 하려고
      - 함수를 빠르게 만들려고
      - 주석이라 아무 의미 없다
    answerIndex: 1
    explanation: C 컴파일러는 파일을 위에서 아래로 읽으므로, 함수를 부르는 곳보다 정의가 아래에 있으면 미리 선언해야 합니다. 헤더 파일(stdio.h)이 printf의 원형을 담고 있는 것과 같은 원리입니다.
  - id: quiz-day20-02
    question: 매개변수(parameter)와 인자(argument)의 차이는?
    choices:
      - 같은 말이다
      - 매개변수는 함수 정의에 적는 이름, 인자는 부를 때 실제로 넘기는 값
      - 매개변수는 값, 인자는 이름
      - 인자는 반환값이다
    answerIndex: 1
    explanation: "int square(int x)의 x가 매개변수, square(7)의 7이 인자입니다. 함수를 부르면 인자의 값이 매개변수에 들어갑니다."
  - id: quiz-day20-03
    question: Python 함수가 return 없이 끝나면 부른 쪽이 받는 값은?
    choices: ["0", "None", "빈 문자열", "오류"]
    answerIndex: 1
    explanation: 모든 Python 함수는 값을 돌려주며, return이 없거나 return만 쓰면 None을 돌려줍니다. 결과를 출력해 None이 보인다면 함수 안에서 print만 하고 return을 빠뜨린 경우가 많습니다.
  - id: quiz-day20-04
    question: Rust 함수 fn f() -> i32 { 5; }가 컴파일되지 않는 이유는?
    choices:
      - 5는 i32가 아니라서
      - 5 뒤의 세미콜론 때문에 식이 문장이 되어, 함수가 i32 대신 ()를 돌려주게 되어서
      - 괄호가 비어 있어서
      - return을 써야만 값을 돌려줄 수 있어서
    answerIndex: 1
    explanation: "Rust에서 세미콜론은 식을 '값을 버리는 문장'으로 만듭니다. 마지막에 값이 없으면 ()(unit)를 돌려주므로 E0308 오류가 납니다. 컴파일러가 'remove this semicolon'이라고 알려 줍니다(Day 22)."
  - id: quiz-day20-05
    question: 함수를 작게 나눌 때 얻는 장점이 아닌 것은?
    choices:
      - 같은 코드를 여러 번 쓰지 않아도 된다
      - 이름이 무엇을 하는지 설명해 읽기 쉬워진다
      - 부분별로 따로 시험할 수 있다
      - 프로그램이 항상 더 빨라진다
    answerIndex: 3
    explanation: 함수 호출에는 아주 작은 비용이 있어서 오히려 조금 느려질 수도 있습니다(컴파일러가 대부분 없애 줍니다). 함수로 나누는 이유는 속도가 아니라 재사용, 읽기 쉬움, 시험하기 쉬움입니다.
---

## 1. 오늘 배울 내용

`printf`, `sqrt`, `len`, `println!`처럼 지금까지 **남이 만든 함수**를 불러 썼습니다. 오늘은 **직접 함수를 만듭니다**.

1. 함수가 무엇인지, 왜 필요한지 알아봅니다.
2. C 함수의 네 가지 요소를 배웁니다.
   - 선언(원형)
   - 정의
   - 매개변수와 인자
   - 반환 자료형과 `return`
3. 돌려주는 값이 없는 `void` 함수와, 조건에 따라 일찍 끝내는 **이른 반환**을 씁니다.
4. **값에 의한 전달**: 인자가 복사되어 넘어가므로 함수 안에서 바꿔도 밖은 그대로입니다.
5. 같은 함수를 Python과 Rust로 씁니다.
   - Python: 기본값, 이름으로 넘기기, 여러 값 반환, `None`
   - Rust: 자료형 표시, 마지막 식 반환, 튜플 반환
6. 온도 변환표와 소수 찾기를 **작은 함수들로 나눠** 만듭니다.

## 2. 왜 필요한가

Day 13~19에서 같은 계산을 여러 곳에서 되풀이했습니다. 윤년 식은 날짜 검사에도, 달력에도, 다음 날 계산에도 나왔습니다. 같은 코드를 복사해 쓰면 두 가지 문제가 생깁니다.

- 식에 버그가 있으면 **복사한 모든 곳**을 찾아 고쳐야 합니다.
- 코드가 길어져 "이 부분이 무엇을 하는지" 알기 어렵습니다.

함수는 작업 하나에 **이름**을 붙여 한 곳에 두고, 필요할 때 이름으로 부르는 방법입니다. `is_leap(year)`라고 쓰면 식을 몰라도 "윤년인가?"를 묻는다는 것을 알 수 있습니다. 큰 프로그램은 거의 예외 없이 작은 함수들의 조합으로 만들어집니다.

## 3. 그림으로 이해하기

함수는 **입력을 받아 출력을 돌려주는 상자**입니다.

```text
            인자 7
              │
              ▼
      ┌───────────────┐
      │ square(int x) │   x = 7 (인자의 값이 매개변수에 복사됨)
      │  return x * x │
      └───────┬───────┘
              │
              ▼
           반환값 49  →  printf("%d", 49)
```

함수를 부르면 실행이 함수 안으로 **점프**했다가, `return`을 만나면 부른 곳으로 **돌아옵니다**.

```text
main                              square
───────────────────────           ─────────────
int r = square(7);  ──── 호출 ──▶  x = 7
                                  return 49;
     r = 49  ◀──────── 반환 ─────  (끝)
printf(...r...);
```

인자는 **값이 복사**되어 넘어갑니다. 함수 안의 매개변수는 부른 쪽 변수와 **다른 상자**입니다.

```text
main의 n  [ 10 ]                try_change의 x  [ 10 ] → x = 999 → [ 999 ]
             │  값만 복사              ↑
             └────────────────────────┘
함수가 끝나도 n은 [ 10 ] 그대로
```

## 4. 천천히 풀어보기

### 4.1 C 함수의 모양

```c
반환자료형 함수이름(매개변수자료형 매개변수이름, ...) {
    몸통
    return 값;
}
```

| 요소         | 예                      | 설명                                          |
| ------------ | ----------------------- | --------------------------------------------- |
| 반환 자료형  | `int`, `double`, `void` | 돌려줄 값의 자료형. 돌려줄 값이 없으면 `void` |
| 함수 이름    | `square`                | 무엇을 하는지 드러나게 짓기                   |
| 매개변수     | `(int x)`, `(void)`     | 받을 값의 자료형과 이름. 없으면 `(void)`      |
| `return 값;` | `return x * x;`         | 값을 돌려주고 **즉시** 함수를 끝냄            |

**선언(원형)** 은 몸통 없이 세미콜론으로 끝납니다: `int square(int x);`. C 컴파일러는 위에서 아래로 읽으므로, `main` 아래에 정의한 함수를 `main`에서 부르려면 위에 원형을 둬야 합니다.

### 4.2 매개변수와 인자

- **매개변수(parameter)**: 정의에 적는 이름(`x`). 함수 안에서만 쓰는 변수입니다.
- **인자(argument)**: 부를 때 넘기는 실제 값(`7`, `n`, `square(2) + 1`).

인자는 **식**이어도 됩니다. `square(square(2) + 1)`은 안쪽 `square(2)`를 먼저 계산해 4, 더해서 5, 바깥 `square(5)`로 25입니다.

### 4.3 return과 이른 반환

`return`은 값을 돌려주면서 **함수를 즉시 끝냅니다**. 이 성질을 이용해 특별한 경우를 먼저 처리하고 빠져나가는 것을 **이른 반환(early return)** 이라고 합니다. 조건문의 보호 조건(Day 13)과 같은 생각입니다.

```c
double average(int total, int count) {
    if (count == 0) {
        return 0.0;         // 0으로 나누기를 피해 먼저 빠져나감
    }
    return (double)total / count;
}
```

값을 돌려주는 함수는 **모든 실행 경로**에서 `return`을 만나야 합니다. 빠진 경로가 있으면 쓰레기 값이 돌아갑니다(실습의 디버그 문제).

### 4.4 값에 의한 전달

C, Python, Rust 모두 정수 같은 인자는 **값이 복사**되어 넘어갑니다. 함수 안에서 매개변수에 새 값을 넣어도 부른 쪽 변수는 바뀌지 않습니다. 부른 쪽의 값을 바꾸고 싶다면 두 가지 방법이 있습니다.

1. **새 값을 돌려받아** 대입합니다: `n = add_ten(n);` (가장 권장)
2. 변수의 **위치(주소)** 를 넘깁니다: C의 포인터(Day 43), Rust의 `&mut`(Day 33)

Python의 리스트처럼 **안을 바꿀 수 있는 값**은 조금 다르게 동작하는데, Day 31과 Day 44에서 다룹니다.

### 4.5 세 언어의 함수 모양

```text
C                                 Python                        Rust
int clamp(int v, int lo, int hi)  def clamp(v, lo, hi):         fn clamp(v: i32, lo: i32, hi: i32) -> i32 {
{                                     if v < lo:                    if v < lo { lo }
    if (v < lo) return lo;                return lo                 else if v > hi { hi }
    if (v > hi) return hi;            if v > hi:                    else { v }
    return v;                             return hi             }
}                                     return v
```

| 관점             | C                       | Python                    | Rust                                       |
| ---------------- | ----------------------- | ------------------------- | ------------------------------------------ |
| 정의 키워드      | (반환 자료형으로 시작)  | `def`                     | `fn`                                       |
| 매개변수 자료형  | 필수                    | 적지 않음                 | 필수                                       |
| 반환 자료형      | 앞에 적음(`int f(...)`) | 적지 않음                 | 뒤에 적음(`-> i32`), 없으면 `()`           |
| 값 돌려주기      | `return 값;`            | `return 값`               | 마지막 식(세미콜론 없이) 또는 `return 값;` |
| 돌려줄 값 없음   | `void`                  | `None`(자동)              | `()`(자동)                                 |
| 여러 값 돌려주기 | (구조체나 포인터 필요)  | `return a, b` (튜플)      | `(a, b)` 튜플                              |
| 기본값           | 없음                    | `def f(x, y=0)`           | 없음                                       |
| 정의 위치        | 부르기 전에 선언 필요   | 부르기 전에 실행되어야 함 | 파일 어디든                                |

## 5. C로 구현하기

```c
// 파일: functions.c
#include <stdio.h>
#include <stdbool.h>

// 함수 선언(원형): 이름, 받는 값, 돌려주는 값의 자료형을 미리 알린다
int square(int x);
double average(int total, int count);
void print_line(int width, char ch);
bool is_even(int n);
int clamp(int value, int lo, int hi);
void try_change(int x);

int main(void) {
    printf("square(7) = %d\n", square(7));
    printf("average(17, 4) = %.2f\n", average(17, 4));
    printf("average(10, 0) = %.2f\n", average(10, 0));
    print_line(10, '=');
    printf("is_even(6) = %d, is_even(7) = %d\n", is_even(6), is_even(7));
    printf("clamp: %d %d %d\n", clamp(150, 0, 100), clamp(-5, 0, 100), clamp(42, 0, 100));

    int n = 10;
    try_change(n);                          // n의 값 10이 복사되어 넘어간다
    printf("try_change 뒤 main의 n = %d\n", n);

    int result = square(square(2) + 1);     // 함수의 결과를 다른 함수의 인자로
    printf("square(square(2) + 1) = %d\n", result);
    return 0;
}

// 함수 정의: 실제로 할 일
int square(int x) {
    return x * x;
}

double average(int total, int count) {
    if (count == 0) {
        return 0.0;                         // 이른 반환: 나머지는 실행하지 않는다
    }
    return (double)total / count;
}

void print_line(int width, char ch) {       // void: 돌려주는 값이 없다
    for (int i = 0; i < width; i++) {
        putchar(ch);
    }
    putchar('\n');
}

bool is_even(int n) {
    return n % 2 == 0;
}

int clamp(int value, int lo, int hi) {
    if (value < lo) {
        return lo;
    }
    if (value > hi) {
        return hi;
    }
    return value;
}

void try_change(int x) {
    x = 999;                                // 복사본만 바뀐다
    printf("try_change 안의 x = %d\n", x);
}
```

실행 결과:

```text
square(7) = 49
average(17, 4) = 4.25
average(10, 0) = 0.00
==========
is_even(6) = 1, is_even(7) = 0
clamp: 100 0 42
try_change 안의 x = 999
try_change 뒤 main의 n = 10
square(square(2) + 1) = 25
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `int square(int x);` (맨 위)                 | 원형입니다. 이 줄이 있어서 `main`이 아래에 정의된 `square`를 부를 수 있습니다. 원형과 정의의 자료형이 다르면 컴파일 오류입니다. |
| `double average(int total, int count)`       | 매개변수가 두 개입니다. 부를 때 순서대로 `total = 17`, `count = 4`가 됩니다.                                                    |
| `if (count == 0) { return 0.0; }`            | 이른 반환입니다. 0으로 나누기 전에 빠져나갑니다.                                                                                |
| `void print_line(int width, char ch)`        | 출력만 하고 돌려줄 값이 없는 함수입니다. `return;`을 쓰지 않아도 몸통이 끝나면 돌아갑니다.                                      |
| `putchar(ch)`                                | 글자 하나를 출력하는 표준 함수입니다.                                                                                           |
| `bool is_even(int n) { return n % 2 == 0; }` | 비교식의 결과를 그대로 돌려줍니다. `if (...) return true; else return false;`로 쓸 필요가 없습니다.                             |
| `clamp`의 `return` 세 개                     | 모든 경로가 `return`으로 끝납니다.                                                                                              |
| `try_change(n);`                             | `n`의 값 10이 `x`에 복사됩니다. `x = 999`는 복사본만 바꿉니다.                                                                  |

## 6. Python으로 구현하기

Python 함수는 `def`로 만들고, 매개변수와 반환값의 자료형을 적지 않습니다. 대신 **기본값**, **이름으로 넘기기**, **여러 값 반환**처럼 편리한 기능이 있습니다.

```python
# 파일: functions.py
def square(x):
    return x * x


def average(total, count):
    if count == 0:
        return 0.0
    return total / count


def print_line(width=10, ch="="):          # 기본값이 있는 매개변수
    print(ch * width)


def is_even(n):
    return n % 2 == 0


def clamp(value, lo, hi):
    if value < lo:
        return lo
    if value > hi:
        return hi
    return value


def div_mod(a, b):
    return a // b, a % b                    # 값 두 개를 튜플로 돌려준다


def try_change(x):
    x = 999
    print("try_change 안의 x =", x)


def say_hi():
    print("안녕!")                           # return이 없으면 None을 돌려준다


print("square(7) =", square(7))
print(f"average(17, 4) = {average(17, 4):.2f}")
print(f"average(10, 0) = {average(10, 0):.2f}")
print_line()                                # 기본값 사용
print_line(5, "-")
print_line(ch="*", width=3)                 # 이름으로 넘기면 순서를 바꿔도 된다
print("is_even(6) =", is_even(6), " is_even(7) =", is_even(7))
print("clamp:", clamp(150, 0, 100), clamp(-5, 0, 100), clamp(42, 0, 100))
q, r = div_mod(17, 5)
print("div_mod(17, 5) =", q, r)

n = 10
try_change(n)
print("try_change 뒤 n =", n)
result = say_hi()
print("say_hi()의 결과:", result)
print("square(square(2) + 1) =", square(square(2) + 1))
```

실행 결과:

```text
square(7) = 49
average(17, 4) = 4.25
average(10, 0) = 0.00
==========
-----
***
is_even(6) = True  is_even(7) = False
clamp: 100 0 42
div_mod(17, 5) = 3 2
try_change 안의 x = 999
try_change 뒤 n = 10
안녕!
say_hi()의 결과: None
square(square(2) + 1) = 25
```

### 코드 한 부분씩 읽기

| 코드                                | 설명                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `def square(x):`                    | 함수 정의입니다. 몸통은 들여씁니다. 함수는 정의가 **실행된 뒤에야** 부를 수 있어서, 부르는 코드보다 위에 둡니다.                            |
| `def print_line(width=10, ch="="):` | 인자를 생략하면 기본값을 씁니다.                                                                                                            |
| `print_line(ch="*", width=3)`       | **이름으로 넘기기(keyword argument)** 입니다. 순서와 상관없이 매개변수 이름으로 짝을 짓습니다. 인자가 많을 때 무엇을 넘기는지 분명해집니다. |
| `return a // b, a % b`              | 쉼표로 여러 값을 돌려주면 튜플 하나가 됩니다. `q, r = div_mod(17, 5)`로 나눠 받습니다.                                                      |
| `def say_hi(): print("안녕!")`      | `return`이 없으면 `None`을 돌려줍니다. `result = say_hi()`에서 `result`가 `None`입니다.                                                     |

## 7. Rust로 구현하기

Rust는 매개변수와 반환값의 자료형을 **반드시** 적습니다. 대신 함수 안의 `let`은 추론할 수 있습니다. 몸통의 **마지막 식**(세미콜론 없음)이 돌려줄 값이 됩니다.

```rust
// 파일: functions.rs
fn square(x: i32) -> i32 {
    x * x                                   // 세미콜론 없는 마지막 식이 돌려줄 값
}

fn average(total: i32, count: i32) -> f64 {
    if count == 0 {
        return 0.0;                         // 이른 반환
    }
    total as f64 / count as f64
}

fn print_line(width: usize, ch: char) {     // 돌려주는 값이 없으면 -> 생략(())
    println!("{}", ch.to_string().repeat(width));
}

fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn clamp(value: i32, lo: i32, hi: i32) -> i32 {
    if value < lo {
        lo
    } else if value > hi {
        hi
    } else {
        value
    }
}

fn div_mod(a: i32, b: i32) -> (i32, i32) {
    (a / b, a % b)
}

fn try_change(mut x: i32) {
    x += 989;                               // 받은 값(10)을 읽고 바꾼다
    println!("try_change 안의 x = {x}");
}

fn main() {
    println!("square(7) = {}", square(7));
    println!("average(17, 4) = {:.2}", average(17, 4));
    println!("average(10, 0) = {:.2}", average(10, 0));
    print_line(10, '=');
    println!("is_even(6) = {}, is_even(7) = {}", is_even(6), is_even(7));
    println!("clamp: {} {} {}", clamp(150, 0, 100), clamp(-5, 0, 100), clamp(42, 0, 100));
    let (q, r) = div_mod(17, 5);
    println!("div_mod(17, 5) = {q} {r}");

    let n = 10;
    try_change(n);
    println!("try_change 뒤 n = {n}");
    println!("square(square(2) + 1) = {}", square(square(2) + 1));
}
```

실행 결과:

```text
square(7) = 49
average(17, 4) = 4.25
average(10, 0) = 0.00
==========
is_even(6) = true, is_even(7) = false
clamp: 100 0 42
div_mod(17, 5) = 3 2
try_change 안의 x = 999
try_change 뒤 n = 10
square(square(2) + 1) = 25
```

### 코드 한 부분씩 읽기

| 코드                                                                       | 설명                                                                                                                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `fn square(x: i32) -> i32 { x * x }`                                       | 매개변수 `x: i32`, 반환 `-> i32`. 마지막 식 `x * x`가 반환값입니다.                                                                      |
| `return 0.0;`                                                              | 이른 반환에는 `return`을 씁니다. 마지막 식이 아닌 곳에서 빠져나갈 때 필요합니다.                                                         |
| `total as f64 / count as f64` (마지막 줄)                                  | 세미콜론이 없으니 이 값이 반환됩니다.                                                                                                    |
| `fn print_line(width: usize, ch: char)`                                    | `->`가 없으면 돌려주는 값이 `()`(unit, "아무것도 아님")입니다. C의 `void`에 해당합니다.                                                  |
| `ch.to_string().repeat(width)`                                             | 글자를 문자열로 바꾼 뒤 반복합니다.                                                                                                      |
| `fn clamp(...) -> i32 { if ... { lo } else if ... { hi } else { value } }` | `if` 표현식 전체가 마지막 식이라 그 값이 반환됩니다. `return`이 하나도 없습니다.                                                         |
| `-> (i32, i32)` / `(a / b, a % b)`                                         | 튜플로 두 값을 돌려줍니다. `let (q, r) = div_mod(17, 5);`로 나눠 받습니다.                                                               |
| `fn try_change(mut x: i32)`                                                | 매개변수를 함수 안에서 바꾸려면 매개변수에 `mut`를 붙입니다. 부른 쪽의 `n`은 `mut`가 아니어도 됩니다. 복사본을 바꾸는 것이기 때문입니다. |
| `x += 989;`                                                                | 받은 값 10을 **읽어서** 바꿉니다. `x = 999;`처럼 받은 값을 읽지 않고 덮어쓰면 "넘겨받은 값을 한 번도 읽지 않는다"는 경고가 납니다.       |
| 함수 정의 위치                                                             | Rust는 `main`보다 아래에 정의해도, 원형 없이 부를 수 있습니다.                                                                           |

## 8. 실행 추적

`square(square(2) + 1)`이 계산되는 순서를 **호출 스택**으로 따라갑니다. 함수를 부를 때마다 새 칸이 쌓이고, 돌아올 때 사라집니다.

| 단계 | 하는 일                          | 쌓여 있는 호출(아래가 먼저) | 결과 |
| ---: | -------------------------------- | --------------------------- | ---- |
|    1 | 바깥 `square`의 인자를 계산 시작 | `main`                      |      |
|    2 | 안쪽 `square(2)` 호출            | `main` → `square(x=2)`      |      |
|    3 | `return 2 * 2`                   | `main`                      | 4    |
|    4 | `4 + 1` 계산                     | `main`                      | 5    |
|    5 | 바깥 `square(5)` 호출            | `main` → `square(x=5)`      |      |
|    6 | `return 5 * 5`                   | `main`                      | 25   |
|    7 | `result = 25`                    | `main`                      |      |

두 번의 `square` 호출은 각자 **자기만의 `x`** 를 가집니다(2와 5). 매개변수와 함수 안의 변수는 호출할 때마다 새로 만들어지고, 돌아올 때 사라집니다. 이 "호출마다 새 칸"이라는 성질이 Day 24의 재귀를 가능하게 합니다.

## 9. 다른 예제로 다시 이해하기

**C로 온도 변환표 만들기.** 변환 공식 두 개와 한 줄 출력을 각각 함수로 나누면, `main`은 "−10도부터 40도까지 한 줄씩 출력"이라는 큰 흐름만 보여 줍니다.

```c
// 파일: temperature.c
#include <stdio.h>

double c_to_f(double c) {
    return c * 9.0 / 5.0 + 32.0;
}

double f_to_c(double f) {
    return (f - 32.0) * 5.0 / 9.0;
}

void print_row(double c) {
    printf("%6.1f C = %6.1f F\n", c, c_to_f(c));
}

int main(void) {
    for (int c = -10; c <= 40; c += 10) {
        print_row(c);
    }
    printf("98.6 F = %.1f C\n", f_to_c(98.6));
    printf("왕복 변환 확인: %.1f\n", f_to_c(c_to_f(25.0)));
    return 0;
}
```

실행 결과:

```text
 -10.0 C =   14.0 F
   0.0 C =   32.0 F
  10.0 C =   50.0 F
  20.0 C =   68.0 F
  30.0 C =   86.0 F
  40.0 C =  104.0 F
98.6 F = 37.0 C
왕복 변환 확인: 25.0
```

`print_row(c)`에 정수 `c`를 넘겼지만 매개변수가 `double`이라 자동으로 바뀝니다(Day 6). `f_to_c(c_to_f(25.0))`는 두 함수가 서로 **반대 계산**인지 시험하는 방법입니다. 이렇게 함수로 나눠 두면 부분마다 따로 시험할 수 있습니다.

**Python으로 소수 찾기.** 작은 함수(`is_prime`)를 만들고, 그것을 쓰는 더 큰 함수(`primes_up_to`, `twin_primes`)를 쌓아 올립니다.

```python
# 파일: primes_func.py
def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


def primes_up_to(limit):
    result = []
    for n in range(2, limit + 1):
        if is_prime(n):
            result.append(n)
    return result


def twin_primes(limit):
    pairs = []
    for p in primes_up_to(limit):
        if p + 2 <= limit and is_prime(p + 2):
            pairs.append((p, p + 2))
    return pairs


primes = primes_up_to(50)
print(len(primes), "개:", primes)
print("쌍둥이 소수:", twin_primes(50))
print(is_prime(1), is_prime(2), is_prime(97), is_prime(91))
```

실행 결과:

```text
15 개: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
쌍둥이 소수: [(3, 5), (5, 7), (11, 13), (17, 19), (29, 31), (41, 43)]
False True True False
```

`twin_primes`는 소수 판별이 **어떻게** 이루어지는지 몰라도 `is_prime`을 믿고 씁니다. 나중에 `is_prime`을 더 빠른 방법으로 바꿔도 `twin_primes`는 고칠 필요가 없습니다. 이것이 함수로 나누는 가장 큰 힘입니다. 마지막 줄처럼 경계값(1, 2)과 까다로운 값(91 = 7 × 13)으로 작은 함수를 시험해 두면 큰 함수도 믿을 수 있습니다.

## 10. 함수를 잘 만드는 요령

| 요령                                 | 예                                                |
| ------------------------------------ | ------------------------------------------------- |
| 함수 하나는 한 가지 일만             | `c_to_f`는 변환만, `print_row`는 출력만           |
| 이름은 동사나 질문으로               | `print_line`, `is_even`, `average`                |
| 입력은 매개변수로, 결과는 반환값으로 | 함수 안에서 `input()`이나 전역 변수를 읽지 않기   |
| 계산 함수는 출력하지 않기            | `average`가 `print`하면 다른 곳에 쓰기 어려움     |
| 특별한 경우는 이른 반환으로 먼저     | `if count == 0: return 0.0`                       |
| 경계값으로 따로 시험                 | `is_prime(1)`, `is_prime(2)`, `clamp(-5, 0, 100)` |

## 11. 세 언어 비교

| 관점                              | C                        | Python                       | Rust             |
| --------------------------------- | ------------------------ | ---------------------------- | ---------------- |
| 자료형 검사                       | 컴파일할 때(원형 기준)   | 실행할 때                    | 컴파일할 때      |
| 인자 개수가 틀리면                | 컴파일 오류              | 실행할 때 `TypeError`        | 컴파일 오류      |
| 반환이 빠진 경로                  | 경고(정의되지 않은 동작) | `None`이 돌아감              | 컴파일 오류      |
| 매개변수 바꾸기                   | 그냥 가능(복사본)        | 그냥 가능(이름 재연결)       | `mut` 매개변수로 |
| 함수 안에 함수 정의               | 불가능                   | 가능                         | 가능             |
| 같은 이름 다른 매개변수(오버로딩) | 불가능                   | 불가능(마지막 정의가 덮어씀) | 불가능           |

## 12. 자주 하는 실수

### 실수 1: 값을 돌려주는 함수의 한 경로에 return이 없다 (C)

실습의 디버그 문제입니다. `-Wall`이 `control reaches end of non-void function`으로 알려 줍니다.

### 실수 2: 원형 없이 아래에 정의한 함수를 부른다 (C)

```c
// 파일: no_prototype.c (컴파일 오류: implicit declaration of function 'twice')
#include <stdio.h>

int main(void) {
    printf("%d\n", twice(4));
    return 0;
}

int twice(int x) {
    return x * 2;
}
```

`main` 위에 `int twice(int x);`를 추가하거나, `twice`의 정의를 `main` 위로 옮기세요.

### 실수 3: print와 return을 헷갈린다 (Python)

```python
# 파일: print_not_return.py
def add(a, b):
    print(a + b)        # 화면에 보여 주기만 한다


result = add(2, 3)
print("result =", result)
```

실행 결과:

```text
5
result = None
```

함수 안에서 출력만 하면 부른 쪽은 결과를 받을 수 없습니다. 값을 쓰려면 `return a + b`로 돌려주세요.

### 실수 4: 마지막 식에 세미콜론을 붙인다 (Rust)

```rust
// 파일: trailing_semicolon.rs (컴파일 오류: E0308)
fn double(x: i32) -> i32 {
    x * 2;
}

fn main() {
    println!("{}", double(4));
}
```

`x * 2;`는 값을 버리는 문장이 되어 함수가 `()`를 돌려주게 됩니다. 컴파일러가 `remove this semicolon to return this value`라고 알려 줍니다.

### 실수 5: 인자 개수나 자료형이 맞지 않는다

```rust
// 파일: wrong_args.rs (컴파일 오류: E0061)
fn area(w: u32, h: u32) -> u32 {
    w * h
}

fn main() {
    println!("{}", area(3));
}
```

`this function takes 2 arguments but 1 argument was supplied`. C도 원형이 있으면 컴파일할 때 잡고, Python은 실행할 때 `TypeError`로 알려 줍니다.

## 13. Q&A

**Q. 함수는 얼마나 짧게 나눠야 하나요?**

A. 정해진 규칙은 없지만, "한 문장으로 무엇을 하는지 설명할 수 있는가"가 좋은 기준입니다. "평균을 구하고 등급을 매기고 출력한다"처럼 "그리고"가 여러 번 들어가면 나눌 때입니다. 화면 한 페이지(30~40줄)를 넘으면 나눌 곳을 찾아보세요.

**Q. C에서 `main`도 함수인가요?**

A. 네. 운영체제가 부르는 특별한 함수로, `int`를 돌려줘서 그 값이 종료 코드가 됩니다(Day 3). 그래서 `return 0;`이 있습니다.

**Q. Python 함수에 자료형을 적을 수는 없나요?**

A. `def square(x: int) -> int:`처럼 **타입 힌트**를 적을 수 있습니다. 실행에는 영향을 주지 않지만, 편집기와 `mypy` 같은 도구가 자료형 실수를 미리 찾아 줍니다. 큰 프로그램에서는 많이 씁니다.

**Q. 함수 안에서 바깥 변수를 바꿀 수는 없나요?**

A. C의 전역 변수, Python의 `global`, Rust의 `static mut`처럼 방법은 있지만, 어디서 값이 바뀌는지 추적하기 어려워 버그가 많아집니다. 먼저 "값을 돌려받아 대입"하는 방법을 쓰고, 정말 필요할 때만 다른 방법을 씁니다. 범위(scope)는 Day 23에서 자세히 배웁니다.

## 14. 핵심 요약

- 함수는 작업에 이름을 붙인 것입니다. **매개변수**로 입력을 받고 **반환값**으로 결과를 돌려줍니다.
- C: `반환자료형 이름(자료형 매개변수, ...)`. 돌려줄 값이 없으면 `void`. 부르기 전에 원형으로 선언해야 합니다.
- `return`은 값을 돌려주며 함수를 즉시 끝냅니다. 특별한 경우는 **이른 반환**으로 먼저 처리하고, 값을 돌려주는 함수는 모든 경로에서 `return`해야 합니다.
- 인자는 **값이 복사**되어 넘어갑니다. 함수 안에서 매개변수를 바꿔도 부른 쪽 변수는 그대로입니다. 결과는 돌려받아 대입하세요.
- Python: `def`, 기본값, 이름으로 넘기기, `return a, b`, 없으면 `None`. Rust: `fn 이름(x: T) -> R`, 마지막 식이 반환값, 튜플로 여러 값, 없으면 `()`.
- 함수는 한 가지 일만 하게 작게 나누고, 경계값으로 따로 시험합니다.

## 15. 도전 문제

1. **(C)** `int max2(int a, int b)`를 만들고, 그것을 두 번 불러 세 수의 최댓값을 구하는 `max3`를 만드세요.
2. **(Python)** `format_price(amount, unit="원", comma=True)` 함수를 만들어 `format_price(1234567)` → `"1,234,567원"`, `format_price(5, unit="달러", comma=False)` → `"5달러"`가 되게 하세요.
3. **(Rust)** 초를 받아 `(시, 분, 초)` 튜플을 돌려주는 `fn split_seconds(total: u32) -> (u32, u32, u32)`를 만들고, 3725초로 시험하세요.
4. **(세 언어)** Day 14의 `is_leap`와 `days_in_month`를 함수로 만들고, 그것을 이용해 "그해의 몇 번째 날인지"를 돌려주는 `day_of_year(year, month, day)`를 만드세요.
