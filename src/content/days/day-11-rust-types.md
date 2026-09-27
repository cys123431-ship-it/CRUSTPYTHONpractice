---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-11-rust-types
courseId: crp-92
phaseId: phase-01
dayNumber: 11
date: "2026-10-11"
title: 숫자 자료형과 타입 추론 — 정수와 실수를 고르는 기준
summary: Rust가 적지 않은 자료형을 어떻게 알아내는지(기본값 i32·f64, 뒤의 사용으로 결정, 접미사와 ::<T>)를 배우고, 숫자 리터럴(16진수, 8진수, 2진수, 밑줄 구분, 지수 표기, 바이트 리터럴)을 정리합니다. 실수 자료형 f32와 f64의 정밀도 차이, 무한대와 NaN, 실수 비교에 오차 범위를 쓰는 이유를 C의 float·double·float.h, Python의 float·math.isclose·Fraction·Decimal과 비교하고, 0.1을 열 번 더하는 실험으로 오차가 쌓이는 모습을 확인합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-10-integer-types]
learningObjectives:
  - Rust의 타입 추론 규칙(기본값, 뒤의 사용, 접미사, 자료형 표시, ::<T>)으로 바인딩의 자료형을 예측한다.
  - 16진수·8진수·2진수·밑줄·지수 표기 리터럴을 세 언어에서 읽고 쓴다.
  - f32와 f64(C의 float와 double)의 정밀도 차이를 유효숫자로 설명한다.
  - 무한대와 NaN이 생기는 경우와 NaN이 자기 자신과도 같지 않다는 성질을 확인한다.
  - 실수를 ==로 비교하지 않고 오차 범위로 비교하며, 정확한 계산이 필요할 때의 대안(정수, Fraction, Decimal)을 고른다.
concepts:
  [
    type inference,
    literal,
    suffix,
    turbofish,
    f32,
    f64,
    precision,
    significant digits,
    infinity,
    nan,
    epsilon,
    decimal,
    fraction,
  ]
runnerMode: python
playgroundSource: |
  # 파일: floats.py — 실수의 정밀도를 실험해 보세요.
  import math
  total = 0.0
  for _ in range(10):
      total += 0.1
  print(total, total == 1.0, math.isclose(total, 1.0))
  print(float(2 ** 53), float(2 ** 53 + 1))
  print(math.inf > 10 ** 308, math.nan == math.nan)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day11-predict-rs
    title: 정수 나눗셈과 실수 나눗셈 예측하기
    kind: predict
    objective: 리터럴 모양에 따라 추론되는 자료형과 나눗셈 결과를 예측한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let x = 7 / 2;
          let y = 7.0 / 2.0;
          let z = 7 as f64 / 2.0;
          println!("{x} {y} {z}");
      }
    answer: "3 3.5 3.5"
    hint: "7과 2는 점이 없으니 i32입니다. 7.0처럼 점이 있으면 f64입니다."
    explanation: "x는 i32끼리의 나눗셈이라 3입니다. y와 z는 f64라 3.5입니다. Rust는 값에 점이 있느냐로 정수·실수를 추론하고, 섞어서 계산하지 않으므로 z처럼 as로 맞춥니다."
    commonMistakes:
      - "x도 3.5로 적음"
      - "7 as f64 / 2.0에서 as가 나중에 적용된다고 생각해 3으로 적음"
    language: rust
    verification: run
  - id: ex-day11-predict-py
    title: 실수 비교 결과 예측하기
    kind: predict
    objective: "==와 math.isclose의 차이, 무한대의 크기를 확인한다."
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      import math

      print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3), float("inf") > 10 ** 308)
    answer: "False True True"
    hint: "0.1 + 0.2는 0.30000000000000004입니다. isclose는 아주 작은 차이를 같다고 봅니다. 무한대는 어떤 수보다 큽니다."
    explanation: "실수는 2진수로 저장되어 0.1 + 0.2와 0.3이 마지막 비트에서 다릅니다. 그래서 ==는 False이고, 상대 오차 10⁻⁹ 이내면 같다고 보는 isclose는 True입니다. float('inf')는 무한대라 10³⁰⁸보다도 큽니다."
    commonMistakes:
      - "0.1 + 0.2 == 0.3을 True로 적음"
      - "float('inf')를 문자열로 생각함"
    language: python
    verification: run
  - id: ex-day11-fill
    title: 30억을 담는 Rust 자료형 채우기
    kind: fill
    objective: i32 범위를 넘는 리터럴에 알맞은 자료형을 적는다.
    prompt: "빈칸에 자료형을 채워 '6000000000'이 출력되게 하세요."
    starter: |-
      fn main() {
          let n: _____ = 3_000_000_000;
          println!("{}", n * 2);
      }
    answer: |-
      fn main() {
          let n: i64 = 3_000_000_000;
          println!("{}", n * 2);
      }
    output: "6000000000"
    hint: "자료형을 적지 않으면 i32가 되는데, i32는 약 21억까지만 담습니다. 곱한 값 60억도 담아야 합니다."
    explanation: "i64는 약 922경까지 담습니다. u32는 30억은 담지만 곱한 60억은 넘치고, i32는 30억부터 담지 못해 컴파일 오류(literal out of range)가 납니다. 3_000_000_000의 밑줄은 읽기 쉽게 넣은 구분자입니다."
    commonMistakes:
      - "u32를 써서 n * 2에서 넘침이 생김"
      - "밑줄 때문에 오류가 날 거라 생각해 지움"
    language: rust
    verification: run
  - id: ex-day11-modify
    title: C float를 double로 바꾸기
    kind: modify
    objective: float의 정밀도(유효숫자 약 7자리)로 담을 수 없는 값을 double로 계산한다.
    prompt: "16777216에 1을 더했는데 16777216.0이 출력됩니다. 자료형과 리터럴을 바꿔 '16777217.0'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          float x = 16777216.0f;
          x += 1.0f;
          printf("%.1f\n", x);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          double x = 16777216.0;
          x += 1.0;
          printf("%.1f\n", x);
          return 0;
      }
    output: "16777217.0"
    hint: "16777216은 2²⁴입니다. float는 가수(유효숫자) 부분이 24비트라 이보다 큰 정수는 모두 정확히 담지 못합니다."
    explanation: "float로는 16777217을 나타낼 수 없어 가장 가까운 16777216으로 반올림됩니다. double은 가수가 53비트라 2⁵³(약 9천조)까지의 정수를 정확히 담습니다. 특별한 이유가 없으면 C는 double, Rust는 f64를 씁니다."
    commonMistakes:
      - "자료형만 double로 바꾸고 1.0f를 그대로 둠(동작은 같지만 뜻이 섞임)"
      - "printf 서식을 %lf로 바꿔야 한다고 생각함(printf에서는 %f와 %lf가 같음)"
    language: c
    verification: run
  - id: ex-day11-debug
    title: Rust f32와 f64 섞기 오류 고치기
    kind: debug
    objective: 실수 자료형도 크기가 다르면 섞을 수 없다는 것을 확인하고 하나로 맞춘다.
    prompt: "이 코드는 E0308 오류(mismatched types)로 컴파일되지 않습니다. 두 값의 자료형을 맞춰 '0.999'가 출력되게 하세요."
    starter: |-
      fn main() {
          let price: f32 = 9.99;
          let tax: f64 = 0.1;
          let total = price * tax;
          println!("{total:.3}");
      }
    answer: |-
      fn main() {
          let price: f64 = 9.99;
          let tax: f64 = 0.1;
          let total = price * tax;
          println!("{total:.3}");
      }
    output: "0.999"
    hint: "f32와 f64는 서로 다른 자료형입니다. 하나로 통일하세요. 더 정밀한 f64가 좋습니다."
    explanation: "Rust는 정수끼리뿐 아니라 실수끼리도 자동 변환을 하지 않습니다. price as f64 * tax처럼 변환해도 되지만, 처음부터 같은 자료형을 쓰는 것이 깔끔합니다."
    commonMistakes:
      - "tax를 f32로 바꾸고 정밀도가 줄어드는 것을 모름"
      - "total의 자료형만 적어서 해결하려 함"
    language: rust
    verification: run
  - id: ex-day11-independent
    title: Python 평균 온도를 오차 범위로 확인하기
    kind: independent
    objective: 실수 결과를 반올림해 출력하고, 기대값과 오차 범위로 비교한다.
    prompt: "온도 21.5, 22.0, 22.1의 평균을 구해 소수 둘째 자리까지 출력하고, 평균이 21.8667과 0.001 이내로 같은지 math.isclose로 확인해 '21.87 True'를 출력하세요."
    starter: |-
      import math

      temps_sum = 21.5 + 22.0 + 22.1
      print(temps_sum)
    answer: |-
      import math

      temps_sum = 21.5 + 22.0 + 22.1
      avg = temps_sum / 3
      print(f"{avg:.2f} {math.isclose(avg, 21.8667, abs_tol=0.001)}")
    output: "21.87 True"
    hint: "isclose의 abs_tol은 '이 크기 이하의 차이는 같다고 본다'는 절대 오차입니다."
    explanation: "평균은 21.8666...입니다. 21.8667과의 차이는 약 0.00003이라 0.001 이내입니다. 측정값이나 계산값을 비교할 때는 이렇게 허용 오차를 정해 두고 비교합니다."
    commonMistakes:
      - "avg == 21.8667로 비교해 False가 나옴"
      - "round(avg, 2) == 21.87로 비교(이 경우는 되지만 일반적으로 반올림 경계에서 틀릴 수 있음)"
    language: python
    verification: run
quiz:
  - id: quiz-day11-01
    question: Rust에서 let x = 5;처럼 아무 표시 없이 쓴 정수와 let y = 2.5;의 자료형은?
    choices: ["i64, f32", "i32, f64", "u32, f64", "isize, f32"]
    answerIndex: 1
    explanation: 다른 단서가 없으면 정수는 i32, 실수는 f64가 기본입니다. 뒤에서 u64와 더하는 등 단서가 생기면 그 자료형으로 정해집니다.
  - id: quiz-day11-02
    question: f32(C의 float)가 정확하게 나타낼 수 있는 유효숫자는 대략 몇 자리인가요?
    choices: ["약 3자리", "약 7자리", "약 15자리", "제한 없음"]
    answerIndex: 1
    explanation: f32는 약 7자리(FLT_DIG = 6 보장), f64는 약 15~16자리(DBL_DIG = 15 보장)입니다. 그래서 16777217 같은 8자리 정수도 f32로는 정확히 담지 못합니다.
  - id: quiz-day11-03
    question: NaN에 대한 설명으로 옳은 것은?
    choices:
      - NaN == NaN은 참이다
      - 0.0 / 0.0처럼 결과를 정할 수 없는 계산에서 생기고, 자기 자신과도 같지 않다
      - 정수를 0으로 나누면 생긴다
      - 무한대의 다른 이름이다
    answerIndex: 1
    explanation: "NaN(Not a Number)은 '숫자가 아님'을 나타내는 특별한 실수 값입니다. 어떤 값과 비교해도 ==가 거짓이라, NaN인지 확인할 때는 is_nan(), isnan(), math.isnan()을 씁니다. 정수를 0으로 나누면 NaN이 아니라 오류입니다."
  - id: quiz-day11-04
    question: Rust에서 "7".parse::<u16>()의 ::<u16>이 하는 일은?
    choices:
      - 문자열을 16번 반복한다
      - parse가 어떤 자료형으로 바꿀지 알려 준다
      - 결과를 16진수로 바꾼다
      - 주석이다
    answerIndex: 1
    explanation: "parse는 여러 자료형으로 바꿀 수 있어서 목표 자료형을 알려 줘야 합니다. let n: u16 = ... 처럼 바인딩에 적거나, ::<u16>처럼 함수 이름 뒤에 적습니다. 이 모양을 '터보피시(turbofish)'라고 부릅니다."
  - id: quiz-day11-05
    question: 돈 계산처럼 소수 계산이 정확해야 할 때 알맞지 않은 방법은?
    choices:
      - 원·전 단위 정수로 계산한다
      - Python의 Decimal을 쓴다
      - f64로 계산하고 ==로 결과를 확인한다
      - Python의 Fraction으로 분수를 계산한다
    answerIndex: 2
    explanation: 2진 실수는 0.1 같은 10진 소수를 정확히 담지 못해 오차가 쌓입니다. 정확해야 하는 계산은 정수 단위, Decimal(10진수), Fraction(분수)을 쓰고, 실수의 비교는 오차 범위로 합니다.
---

## 1. 오늘 배울 내용

Rust에서는 `let x = 5;`처럼 자료형을 적지 않아도 됐습니다. 오늘은 컴파일러가 **자료형을 어떻게 알아내는지**, 그리고 Day 10의 정수에 이어 **실수 자료형**이 어떤 한계를 가지는지 배웁니다.

1. Rust의 **타입 추론**: 기본값(`i32`, `f64`), 뒤에서의 사용, 접미사, 자료형 표시, `::<T>`.
2. 숫자 **리터럴**의 여러 모양을 정리합니다.
   - 진법: `0xff`, `0o17`, `0b1010`
   - 밑줄 구분: `1_000_000`
   - 지수 표기: `1.5e3`
   - 바이트 리터럴: `b'A'`
3. **실수 자료형** `f32`와 `f64`(C의 `float`, `double`)의 정밀도 차이를 봅니다.
4. **무한대**와 **NaN**이 생기는 경우와, NaN의 이상한 성질을 알아봅니다.
5. 실수를 **오차 범위로 비교**하는 방법과, 정확한 계산이 필요할 때의 대안을 비교합니다.
   - 정수 단위로 계산하기
   - `Fraction`
   - `Decimal`

## 2. 왜 필요한가

Rust가 자료형을 추론해 주는 덕분에 코드는 짧아지지만, 추론 규칙을 모르면 "왜 여기서 `i32`가 됐지?", "왜 `parse`에 자료형을 알려 달라고 하지?" 같은 오류 메시지를 이해하기 어렵습니다.

실수는 더 조심해야 합니다. 과학 계산, 그래픽, 게임 물리처럼 실수를 많이 쓰는 분야에서 **오차가 쌓이거나**, `==` 비교가 예상과 다르게 동작하는 문제가 자주 생깁니다. 은행 이자처럼 1원도 틀리면 안 되는 계산에 실수를 쓰면 곤란합니다. 실수의 특징을 알면 언제 실수를 쓰고 언제 피할지 판단할 수 있습니다.

## 3. 그림으로 이해하기

실수는 **부호, 지수, 가수** 세 부분으로 저장됩니다. 10진수의 과학 표기 `1.234 × 10³`에서 1.234가 가수, 3이 지수인 것과 같은 방식을 2진수로 한 것입니다.

```text
f32 (32비트)   [부호 1][지수  8][가수          23]   유효숫자 약 7자리
f64 (64비트)   [부호 1][지수 11][가수                          52]   유효숫자 약 15~16자리

값 = (-1)^부호 × 1.가수(2진) × 2^(지수 - 기준값)
```

가수의 비트 수가 **정밀도**(몇 자리까지 정확한가)를, 지수의 비트 수가 **범위**(얼마나 크고 작은 수까지)를 정합니다. 정수와 달리 실수 사이의 간격은 일정하지 않습니다. 0 근처에서는 촘촘하고, 큰 수로 갈수록 성깁니다.

```text
f32로 나타낼 수 있는 수(개념도)
0 ||||||||||||| 1 | | | | | 2 |   |   |   4 |       |       8 ...          16777216     16777218
  아주 촘촘                  점점 성겨짐                                   ↑ 여기서는 간격이 2
```

그래서 `16777216.0f + 1.0f`는 16777217을 나타낼 수 없어 16777216으로 돌아옵니다.

## 4. 천천히 풀어보기

### 4.1 Rust의 타입 추론 규칙

컴파일러는 다음 순서로 자료형을 정합니다.

| 단서                    | 예                               | 정해진 자료형 |
| ----------------------- | -------------------------------- | ------------- |
| 바인딩에 직접 적음      | `let d: i64 = 42;`               | `i64`         |
| 리터럴 접미사           | `let c = 42u8;`, `2.5_f32`       | `u8`, `f32`   |
| 뒤에서 어떻게 쓰이는지  | `let mut t = 0; t += limit_u64;` | `u64`         |
| 함수의 인자·반환 자료형 | `fn f(x: u16)`에 `f(n)`          | `u16`         |
| `::<T>`로 알려 줌       | `"7".parse::<u16>()`             | `u16`         |
| 단서가 없음             | `let a = 42;`, `let b = 3.0;`    | `i32`, `f64`  |

`parse`처럼 **여러 자료형 중 하나를 돌려줄 수 있는** 함수는 단서가 없으면 "type annotations needed" 오류가 납니다.

### 4.2 숫자 리터럴

| 모양          | 뜻                      | Rust             | C                     | Python      |
| ------------- | ----------------------- | ---------------- | --------------------- | ----------- |
| 16진수        | 255                     | `0xff`           | `0xff`                | `0xff`      |
| 8진수         | 15                      | `0o17`           | `017` (0으로 시작!)   | `0o17`      |
| 2진수         | 10                      | `0b1010`         | (C23부터 `0b1010`)    | `0b1010`    |
| 자릿수 구분   | 1000000                 | `1_000_000`      | (C23부터 `1'000'000`) | `1_000_000` |
| 지수 표기     | 1500.0                  | `1.5e3`          | `1.5e3`               | `1.5e3`     |
| 자료형 접미사 | 32비트 실수 / 부호 없음 | `2.5f32`, `42u8` | `2.5f`, `42u`, `42LL` | (없음)      |
| 글자의 번호   | 65                      | `b'A'` (u8)      | `'A'` (int)           | `ord("A")`  |

C에서 **0으로 시작하는 정수는 8진수**라는 점을 조심하세요. `int code = 010;`은 10이 아니라 8입니다.

### 4.3 f32와 f64

| 자료형                            | 크기    | 유효숫자     | 최댓값         | 가장 작은 차이(1 근처) |
| --------------------------------- | ------- | ------------ | -------------- | ---------------------- |
| `f32` / `float`                   | 4바이트 | 약 7자리     | 약 3.4 × 10³⁸  | 약 1.2 × 10⁻⁷          |
| `f64` / `double` / Python `float` | 8바이트 | 약 15~16자리 | 약 1.8 × 10³⁰⁸ | 약 2.2 × 10⁻¹⁶         |

"1 근처에서 구별할 수 있는 가장 작은 차이"를 **엡실론(epsilon)** 이라고 합니다. `f64::EPSILON`, `DBL_EPSILON`, `sys.float_info.epsilon`입니다. 특별한 이유(메모리 절약, 그래픽 카드 계산)가 없으면 **f64를 기본으로** 씁니다.

### 4.4 무한대와 NaN

실수 계산은 정수와 달리 0으로 나눠도 멈추지 않고 **특별한 값**을 만듭니다.

| 계산                     | 결과   | 뜻                        |
| ------------------------ | ------ | ------------------------- |
| `1.0 / 0.0`              | `inf`  | 양의 무한대               |
| `-1.0 / 0.0`             | `-inf` | 음의 무한대               |
| `0.0 / 0.0`, `inf - inf` | `NaN`  | 숫자가 아님(Not a Number) |
| `1e308 * 10.0`           | `inf`  | 범위를 넘으면 무한대      |

NaN은 **어떤 값과 비교해도 같지 않고, 자기 자신과도 같지 않습니다**(`nan == nan`이 거짓). 그래서 NaN인지 확인할 때는 전용 함수를 씁니다. Python만 `1.0 / 0.0`을 무한대로 만들지 않고 `ZeroDivisionError`를 냅니다(`math.inf`로 무한대를 직접 만들 수는 있습니다).

### 4.5 실수 비교하기

실수는 `==` 대신 **차이가 충분히 작은지** 비교합니다.

```text
|a - b| < 허용 오차
```

허용 오차를 얼마로 할지는 문제에 따라 다릅니다. 측정값이 소수 셋째 자리까지만 의미 있다면 0.001, 계산 오차만 걸러 내려면 10⁻⁹ 정도를 씁니다. Python의 `math.isclose(a, b)`는 기본으로 **상대 오차** 10⁻⁹(두 값 크기의 10억분의 1)를 쓰고, `abs_tol=`로 절대 오차를 줄 수 있습니다.

## 5. Rust로 구현하기

```rust
// 파일: numbers.rs
fn main() {
    let a = 42;                         // 정수의 기본: i32
    let b = 3.0;                        // 실수의 기본: f64
    let c = 42u8;                       // 접미사로 자료형 지정
    let d: i64 = 42;                    // 표시로 자료형 지정
    println!("{a} {b} {c} {d}");
    println!("{} {} {} {} {} {}", 1_000_000, 0xff, 0o17, 0b1010, b'A', 1.5e3);

    // 뒤에서 어떻게 쓰이는지 보고 자료형이 정해진다
    let mut total = 0;                  // 여기서는 아직 모름
    let limit: u64 = 10;
    total += limit;                     // u64와 더하므로 total도 u64
    println!("total = {total}");
    let parsed = "7".parse::<u16>().unwrap();   // ::<u16>으로 직접 알려 주기
    println!("parsed * 2 = {}", parsed * 2);

    let x32: f32 = 0.1 + 0.2;
    let x64: f64 = 0.1 + 0.2;
    println!("f32: {x32}, f64: {x64}");
    println!("f32 1/3 = {:.10}", 1.0_f32 / 3.0);
    println!("f64 1/3 = {:.20}", 1.0_f64 / 3.0);
    println!("f64::EPSILON = {:e}", f64::EPSILON);
    println!("0.1 + 0.2 ≈ 0.3? {}", (x64 - 0.3).abs() < 1e-9);

    let zero: f64 = "0".parse().unwrap();
    let inf = 1.0 / zero;               // 실수는 0으로 나누면 무한대
    let nan = zero / zero;              // 0/0은 NaN(숫자가 아님)
    println!("{inf} {} {nan}", -inf);
    println!("nan == nan: {}, is_nan: {}, inf.is_finite: {}", nan == nan, nan.is_nan(), inf.is_finite());

    println!("max {} min {} clamp {}", 3.5_f64.max(7.2), 3.5_f64.min(7.2), 15_i32.clamp(0, 10));
    println!("signum {} {}", (-8_i32).signum(), 2.5_f64.signum());
    println!("char {}바이트, '가' = U+{:04X}", std::mem::size_of::<char>(), '가' as u32);
}
```

실행 결과:

```text
42 3 42 42
1000000 255 15 10 65 1500
total = 10
parsed * 2 = 14
f32: 0.3, f64: 0.30000000000000004
f32 1/3 = 0.3333333433
f64 1/3 = 0.33333333333333331483
f64::EPSILON = 2.220446049250313e-16
0.1 + 0.2 ≈ 0.3? true
inf -inf NaN
nan == nan: false, is_nan: true, inf.is_finite: false
max 7.2 min 3.5 clamp 10
signum -1 1
char 4바이트, '가' = U+AC00
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `println!("{a} {b} ...")` → `3`            | `b`는 `f64` 3.0이지만 `{}`로 출력하면 소수점 아래가 0일 때 `3`으로 보입니다. `{b:.1}`로 쓰면 `3.0`입니다.                                                                            |
| `b'A'` → `65`                              | 바이트 리터럴은 `u8` 값입니다. `'A'`(char)와 자료형이 다릅니다.                                                                                                                      |
| `1.5e3` → `1500`                           | 1.5 × 10³입니다. 실수지만 소수점 아래가 0이라 `1500`으로 출력됩니다.                                                                                                                 |
| `let mut total = 0;` ... `total += limit;` | 첫 줄만 보면 `i32`지만, 뒤에서 `u64`와 더하므로 컴파일러가 `u64`로 정합니다. 추론은 **함수 전체**를 보고 이루어집니다.                                                               |
| `"7".parse::<u16>()`                       | 터보피시 `::<u16>`으로 목표 자료형을 알려 줍니다.                                                                                                                                    |
| `f32: 0.3`                                 | `f32`의 0.1 + 0.2는 `f32`로 나타낼 수 있는 "0.3에 가장 가까운 수"와 같아서 `0.3`으로 출력됩니다. `f64`에서는 그렇지 않습니다. 정밀도가 높다고 모든 결과가 더 "깔끔"한 것은 아닙니다. |
| `{:.10}`, `{:.20}`                         | 저장된 값을 많은 자릿수로 보면 `f32`는 8번째 자리부터, `f64`는 17번째 자리부터 어긋납니다.                                                                                           |
| `(x64 - 0.3).abs() < 1e-9`                 | 오차 범위 비교입니다.                                                                                                                                                                |
| `let zero: f64 = "0".parse().unwrap();`    | 코드에 `0.0`을 직접 쓰는 대신 실행 중에 만든 값입니다. 결과는 같습니다.                                                                                                              |
| `nan == nan` → `false`                     | NaN은 자기 자신과도 같지 않습니다. `is_nan()`으로 확인합니다.                                                                                                                        |
| `15_i32.clamp(0, 10)`                      | 값을 범위 안으로 잘라 냅니다. 0보다 작으면 0, 10보다 크면 10입니다.                                                                                                                  |
| `std::mem::size_of::<char>()` → 4          | Rust의 `char`는 유니코드 글자 하나를 담는 **4바이트** 자료형입니다. C의 `char`(1바이트)와 다릅니다.                                                                                  |

## 6. C로 구현하기

C의 `float.h`에는 실수 자료형의 정보가, `math.h`에는 `INFINITY`, `isnan` 같은 도구가 있습니다.

```c
// 파일: numbers.c
#include <stdio.h>
#include <float.h>                      // FLT_DIG, DBL_EPSILON 같은 실수 정보
#include <math.h>                       // INFINITY, isnan

int main(void) {
    float f = 0.1f + 0.2f;              // f 접미사: float 리터럴
    double d = 0.1 + 0.2;
    printf("float: %.9g, double: %.17g\n", f, d);
    printf("float 1/3 = %.10f\n", 1.0f / 3.0f);
    printf("double 1/3 = %.20f\n", 1.0 / 3.0);
    printf("FLT_DIG = %d, DBL_DIG = %d\n", FLT_DIG, DBL_DIG);
    printf("DBL_EPSILON = %e, DBL_MAX = %e\n", DBL_EPSILON, DBL_MAX);
    printf("float 16777216 + 1 = %.1f\n", 16777216.0f + 1.0f);
    printf("double 16777216 + 1 = %.1f\n", 16777216.0 + 1.0);

    double inf = INFINITY;
    double nan = inf - inf;             // 무한대 - 무한대 = NaN
    printf("%f %f\n", inf, -inf);
    printf("isnan: %d, nan == nan: %d\n", isnan(nan) != 0, nan == nan);

    printf("0x1F = %d, 017 = %d, 1e3 = %.0f\n", 0x1F, 017, 1e3);
    printf("3.5f는 %zu바이트, 3.5는 %zu바이트\n", sizeof(3.5f), sizeof(3.5));
    printf("fabs(-2.5) = %.1f, fmax(3.5, 7.2) = %.1f\n", fabs(-2.5), fmax(3.5, 7.2));
    return 0;
}
```

실행 결과:

```text
float: 0.300000012, double: 0.30000000000000004
float 1/3 = 0.3333333433
double 1/3 = 0.33333333333333331483
FLT_DIG = 6, DBL_DIG = 15
DBL_EPSILON = 2.220446e-16, DBL_MAX = 1.797693e+308
float 16777216 + 1 = 16777216.0
double 16777216 + 1 = 16777217.0
inf -inf
isnan: 1, nan == nan: 0
0x1F = 31, 017 = 15, 1e3 = 1000
3.5f는 4바이트, 3.5는 8바이트
fabs(-2.5) = 2.5, fmax(3.5, 7.2) = 7.2
```

### 코드 한 부분씩 읽기

| 코드                          | 설명                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0.1f + 0.2f`                 | 접미사 `f`가 없으면 `0.1`은 `double`입니다. `float` 변수에 넣을 값은 `f`를 붙여 `float`로 계산합니다.                                                                             |
| `%.9g`, `%.17g`               | `float`는 9자리, `double`은 17자리까지 출력하면 저장된 값을 **정확히** 다시 만들 수 있습니다. 그래서 오차가 드러납니다.                                                           |
| `FLT_DIG = 6`, `DBL_DIG = 15` | "10진수 이 자릿수까지는 저장했다 꺼내도 그대로"라는 보장입니다.                                                                                                                   |
| `16777216.0f + 1.0f`          | 2²⁴ 위에서는 `float`의 간격이 2라서 1을 더해도 제자리입니다. `double`은 2⁵³까지 정수를 정확히 담습니다.                                                                           |
| `double nan = inf - inf;`     | 무한대끼리 빼면 NaN입니다. C에서 NaN과 무한대를 `printf`로 출력하면 `nan`, `inf`로 보입니다.                                                                                      |
| `isnan(nan) != 0`             | `isnan`은 참일 때 0이 아닌 **어떤 정수**든 돌려줄 수 있어서, `!= 0`으로 0/1을 만들었습니다.                                                                                       |
| `017` → 15                    | 0으로 시작하는 정수는 8진수입니다.                                                                                                                                                |
| `sizeof(3.5f)`, `sizeof(3.5)` | `float` 리터럴은 4바이트, `double` 리터럴은 8바이트입니다.                                                                                                                        |
| `printf`의 `%f`에 `float`     | `printf`에 `float`를 넘기면 자동으로 `double`로 바뀌어 전달됩니다. 그래서 `printf`에서는 `%f`와 `%lf`가 같습니다(`scanf`에서는 `float`는 `%f`, `double`은 `%lf`로 달라야 합니다). |

## 7. Python으로 구현하기

Python의 `float`는 C의 `double`, Rust의 `f64`와 같은 64비트 실수입니다. 32비트 실수는 기본으로 없습니다. 대신 **정확한 계산**을 위한 `Fraction`(분수)과 `Decimal`(10진수) 모듈이 표준 라이브러리에 있습니다.

```python
# 파일: numbers.py
import math
import sys
from decimal import Decimal
from fractions import Fraction

print(type(42).__name__, type(3.0).__name__, type(42 / 1).__name__)
print(0xff, 0o17, 0b1010, 1_000_000, 1.5e3)
print(sys.float_info.max, sys.float_info.epsilon, sys.float_info.dig)

print(0.1 + 0.2, f"{0.1 + 0.2:.20f}")
print("isclose:", math.isclose(0.1 + 0.2, 0.3))
print(float(2 ** 53), float(2 ** 53 + 1))          # 여기부터 정수를 정확히 못 담는다

print(math.inf, -math.inf, math.nan)
print("nan == nan:", math.nan == math.nan, " isnan:", math.isnan(math.nan))
print(1e308 * 10)                                   # 너무 크면 inf

print(Fraction(1, 3) + Fraction(1, 6))              # 분수로 정확하게
print(Decimal("0.1") + Decimal("0.2"))              # 10진수로 정확하게
print(max(3.5, 7.2), min(3.5, 7.2), abs(-8), divmod(7.5, 2))
```

실행 결과:

```text
int float float
255 15 10 1000000 1500.0
1.7976931348623157e+308 2.220446049250313e-16 15
0.30000000000000004 0.30000000000000004441
isclose: True
9007199254740992.0 9007199254740992.0
inf -inf nan
nan == nan: False  isnan: True
inf
1/2
0.3
7.2 3.5 8 (3.0, 1.5)
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `type(42 / 1).__name__`           | `/`의 결과는 항상 `float`입니다.                                                                                             |
| `1.5e3` → `1500.0`                | Python은 실수를 출력할 때 소수점을 남겨 `float`임을 보여 줍니다. Rust와 다른 점입니다.                                       |
| `sys.float_info`                  | C의 `float.h`에 해당합니다. `max`, `epsilon`, `dig` 등이 있습니다.                                                           |
| `float(2 ** 53 + 1)`              | 2⁵³ + 1은 64비트 실수로 나타낼 수 없어 2⁵³으로 반올림됩니다. 정수를 실수로 바꿀 때 큰 수는 값이 바뀔 수 있습니다.            |
| `math.inf`, `math.nan`            | 무한대와 NaN을 직접 만듭니다. `float("inf")`, `float("nan")`으로도 만들 수 있습니다.                                         |
| `1e308 * 10`                      | 범위를 넘으면 `inf`입니다. 반면 `1.0 / 0.0`은 무한대가 아니라 `ZeroDivisionError`입니다.                                     |
| `Fraction(1, 3) + Fraction(1, 6)` | 분수로 계산하므로 오차 없이 1/2입니다.                                                                                       |
| `Decimal("0.1") + Decimal("0.2")` | 10진수로 계산해 정확히 0.3입니다. `Decimal(0.1)`처럼 실수를 넣으면 이미 오차가 섞인 값으로 만들어지니 **문자열**로 만드세요. |
| `divmod(7.5, 2)`                  | 실수에도 몫과 나머지를 쓸 수 있습니다. 결과는 실수 `(3.0, 1.5)`입니다.                                                       |

## 8. 실행 추적

Rust 컴파일러가 아래 코드의 자료형을 정하는 과정을 따라가 봅시다.

```rust
let mut total = 0;
let limit: u64 = 10;
total += limit;
```

| 단계 | 본 줄                  | 컴파일러가 알게 된 것                        | `total`의 자료형 |
| ---: | ---------------------- | -------------------------------------------- | ---------------- |
|    1 | `let mut total = 0;`   | 정수 리터럴이다. 어떤 정수인지는 아직 모른다 | `{정수}` (미정)  |
|    2 | `let limit: u64 = 10;` | `limit`은 `u64`                              | `{정수}` (미정)  |
|    3 | `total += limit;`      | `+=`의 양쪽은 같은 자료형이어야 한다         | `u64`로 확정     |
|    4 | (함수 끝)              | 미정인 것이 없다                             | `u64`            |

3단계가 없었다면 4단계에서 기본값 `i32`로 정해졌을 것입니다.

## 9. 다른 예제로 다시 이해하기

0.1을 열 번 더하면 1.0이 될까요? `f32`, `f64`, 그리고 정확한 계산 방법을 비교해 봅시다. `for` 반복문은 Day 16에서 배우지만, 여기서는 "같은 줄을 열 번 실행한다"로 읽으면 됩니다.

```rust
// 파일: sum_tenth.rs
fn main() {
    let mut s32: f32 = 0.0;
    let mut s64: f64 = 0.0;
    for _ in 0..10 {
        s32 += 0.1;
        s64 += 0.1;
    }
    println!("f32: {s32} (1.0과 같나? {})", s32 == 1.0);
    println!("f64: {s64} (1.0과 같나? {})", s64 == 1.0);
    println!("오차 범위로 비교: {}", (s64 - 1.0).abs() < 1e-9);

    let mut cents: i64 = 0;             // 0.1을 '10전'처럼 1/100 단위 정수로
    for _ in 0..10 {
        cents += 10;
    }
    println!("정수 단위: {}.{:02}", cents / 100, cents % 100);
}
```

실행 결과:

```text
f32: 1.0000001 (1.0과 같나? false)
f64: 0.9999999999999999 (1.0과 같나? false)
오차 범위로 비교: true
정수 단위: 1.00
```

`f32`는 조금 크게, `f64`는 조금 작게 어긋났습니다. 0.1이 저장될 때의 오차가 방향과 크기를 달리하며 열 번 쌓인 결과입니다. 정수 단위로 계산한 마지막 줄만 정확합니다.

Python으로는 `Decimal`로 정확하게 더하는 방법과, 오차를 줄여 더해 주는 `math.fsum`을 함께 봅니다.

```python
# 파일: sum_tenth.py
import math
from decimal import Decimal

total = 0.0
exact = Decimal("0")
for _ in range(10):
    total += 0.1
    exact += Decimal("0.1")

print(total, total == 1.0)
print(exact, exact == 1)
print(math.fsum([0.1] * 10))
```

실행 결과:

```text
0.9999999999999999 False
1.0 True
1.0
```

`Decimal`은 10진수로 계산해 정확히 `1.0`이 됩니다. `math.fsum`은 더하는 동안 잃어버린 작은 오차를 따로 모아 두었다가 보정해서 `1.0`을 돌려줍니다. `[0.1] * 10`은 0.1이 10개 들어 있는 리스트입니다(Day 27).

## 10. 실수 자료형 한눈에 보기

| 알고 싶은 것     | Rust                  | C                       | Python                   |
| ---------------- | --------------------- | ----------------------- | ------------------------ |
| 64비트 실수      | `f64` (기본)          | `double`                | `float`                  |
| 32비트 실수      | `f32`                 | `float` (리터럴에 `f`)  | (기본 없음)              |
| 최댓값           | `f64::MAX`            | `DBL_MAX`               | `sys.float_info.max`     |
| 엡실론           | `f64::EPSILON`        | `DBL_EPSILON`           | `sys.float_info.epsilon` |
| 무한대 만들기    | `f64::INFINITY`       | `INFINITY`              | `math.inf`               |
| NaN 확인         | `x.is_nan()`          | `isnan(x)`              | `math.isnan(x)`          |
| 절댓값, 최대     | `x.abs()`, `x.max(y)` | `fabs(x)`, `fmax(x, y)` | `abs(x)`, `max(x, y)`    |
| 정확한 10진 계산 | (외부 라이브러리)     | (외부 라이브러리)       | `decimal.Decimal`        |

## 11. 세 언어 비교

| 관점                  | Rust                      | C                       | Python                             |
| --------------------- | ------------------------- | ----------------------- | ---------------------------------- |
| 자료형을 적지 않으면  | 추론(기본 `i32`, `f64`)   | 반드시 적어야 함        | 값이 자료형을 가짐                 |
| 정수 리터럴의 자료형  | 문맥으로 결정             | `int`(접미사로 변경)    | `int`                              |
| 실수 리터럴의 자료형  | 문맥으로 결정(기본 `f64`) | `double`(`f`로 `float`) | `float`                            |
| 실수 출력의 기본 모양 | 짧게(`3`, `1500`)         | `%f`는 소수 6자리       | 짧게, 소수점 유지(`3.0`, `1500.0`) |
| 실수 0 나누기         | `inf`/`NaN`               | `inf`/`NaN`             | `ZeroDivisionError`                |
| `char`의 크기         | 4바이트(유니코드)         | 1바이트                 | (글자 하나도 `str`)                |

## 12. 자주 하는 실수

### 실수 1: parse에 자료형을 알려 주지 않는다 (Rust)

```rust
// 파일: parse_no_type.rs (컴파일 오류: E0284)
fn main() {
    let n = "42".parse().unwrap();
    println!("{n}");
}
```

`type annotations needed`라는 오류가 납니다. `let n: i32 = ...` 또는 `"42".parse::<i32>()`로 씁니다.

### 실수 2: 리터럴이 기본 자료형 범위를 넘는다 (Rust)

```rust
// 파일: literal_i32.rs (컴파일 오류: literal out of range for `i32`)
fn main() {
    let population = 3_000_000_000;
    println!("{population}");
}
```

자료형을 적지 않으면 `i32`라서 30억을 담지 못합니다. `let population: i64 = ...` 또는 `3_000_000_000_i64`로 씁니다.

### 실수 3: 실수를 ==로 비교한다

```c
// 파일: float_eq.c
#include <stdio.h>
#include <math.h>

int main(void) {
    double a = 0.1 + 0.2;
    printf("a == 0.3: %d\n", a == 0.3);
    printf("fabs(a - 0.3) < 1e-9: %d\n", fabs(a - 0.3) < 1e-9);
    return 0;
}
```

실행 결과:

```text
a == 0.3: 0
fabs(a - 0.3) < 1e-9: 1
```

### 실수 4: C에서 0으로 시작하는 숫자를 쓴다

```c
// 파일: octal_trap.c
#include <stdio.h>

int main(void) {
    int room = 010;
    printf("방 번호: %d\n", room);
    return 0;
}
```

실행 결과:

```text
방 번호: 8
```

앞의 0 때문에 8진수로 읽혔습니다. 자릿수를 맞추려고 앞에 0을 붙이지 마세요. 출력 모양은 `%03d`로 맞춥니다(Day 9).

### 실수 5: Python에서 Decimal을 실수로 만든다

```python
# 파일: decimal_float.py
from decimal import Decimal

print(Decimal(0.1))
print(Decimal("0.1"))
```

실행 결과:

```text
0.1000000000000000055511151231257827021181583404541015625
0.1
```

실수 `0.1`에는 이미 오차가 들어 있어서, 그 오차까지 정확하게 담은 `Decimal`이 만들어집니다. **문자열로** 만드세요.

## 13. Q&A

**Q. 타입 추론이 있으면 Python처럼 자료형이 바뀌는 건가요?**

A. 아닙니다. Rust의 추론은 **컴파일할 때** 한 번 자료형을 정하는 것이고, 정해진 뒤에는 바뀌지 않습니다. 적지 않았을 뿐 모든 바인딩에는 정확한 자료형이 있습니다. 편집기에서 변수 위에 마우스를 올리면 추론된 자료형을 볼 수 있습니다.

**Q. f32는 언제 쓰나요?**

A. 수백만 개의 값을 다루는 그래픽, 게임, 머신러닝처럼 메모리와 속도가 중요하고 7자리 정밀도로 충분할 때 씁니다. 일반적인 계산에는 `f64`가 안전합니다.

**Q. NaN은 왜 필요한가요? 그냥 오류를 내면 안 되나요?**

A. 수백만 개를 한꺼번에 계산하는 과학 계산에서 값 하나가 잘못됐다고 전체를 멈추면 곤란하기 때문입니다. NaN은 "이 칸은 계산할 수 없었다"는 표시로 남아 나중에 확인할 수 있습니다. 대신 NaN은 어떤 비교도 거짓이라 정렬이나 최댓값 계산을 망칠 수 있어서, Rust는 `f64`에 `==`와 `<`는 허용하지만 "항상 크기를 비교할 수 있다"는 성질(`Ord`)은 주지 않습니다(Day 54).

**Q. 허용 오차는 얼마로 정해야 하나요?**

A. 정답은 없습니다. 값의 크기가 비슷하면 상대 오차(예: 10⁻⁹)를, 0 근처 값을 비교하면 절대 오차를 씁니다. 측정 장비의 정밀도나 문제에서 요구하는 자릿수가 기준이 됩니다. 채점 사이트는 흔히 "10⁻⁶ 이내면 정답"처럼 기준을 알려 줍니다.

## 14. 핵심 요약

- Rust는 단서가 없으면 정수를 `i32`, 실수를 `f64`로 추론하고, 뒤의 사용이나 접미사(`42u8`), 자료형 표시, `::<T>`로 다른 자료형을 정합니다. 추론은 컴파일할 때 한 번 정해지고 바뀌지 않습니다.
- 리터럴: `0x` 16진수, `0o`(C는 앞의 `0`) 8진수, `0b` 2진수, `_` 자릿수 구분, `e` 지수 표기, `b'A'` 바이트.
- `f32`/`float`는 유효숫자 약 7자리, `f64`/`double`/Python `float`는 약 15~16자리입니다. 기본은 64비트 실수를 씁니다.
- 실수를 0으로 나누면 `inf`나 `NaN`이 됩니다(Python은 오류). NaN은 자기 자신과도 같지 않아 `is_nan`으로 확인합니다.
- 실수는 `==` 대신 오차 범위로 비교합니다. 정확해야 하는 계산은 정수 단위, `Decimal`, `Fraction`을 씁니다.

## 15. 도전 문제

1. **(Rust)** `let x = 1;`, `let y: u8 = x;` 두 줄을 쓰면 `x`의 자료형이 무엇으로 추론되는지 설명하고, 그 뒤에 `let z: i64 = x;`를 추가하면 어떤 오류가 나는지 확인하세요.
2. **(C)** `float`로 0.1을 100번 더한 값과 `double`로 더한 값을 `%.10f`로 출력해 비교하세요.
3. **(Python)** `Fraction(1, 3) * 3 == 1`과 `(1 / 3) * 3 == 1`의 결과를 비교하고, 1/3 대신 1/10으로도 해 보세요.
4. **(세 언어)** 원금 1,000,000원에 월 이자 0.3%를 12개월 복리로 붙인 금액을 `f64`로 계산하고, 원 단위 정수로 매달 버림하며 계산한 값과 비교하세요.
