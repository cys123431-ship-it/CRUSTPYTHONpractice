---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-06-conversion
courseId: crp-92
phaseId: phase-01
dayNumber: 6
date: "2026-10-06"
title: 형변환과 나눗셈 — 자료형이 바뀌는 순간 알아채기
summary: C가 계산 중에 자료형을 자동으로 바꾸는 규칙(정수 → 실수, 작은 정수 → int)과 (double)처럼 직접 바꾸는 형변환을 배우고, 형변환을 '언제' 하느냐에 따라 나눗셈 결과가 달라지는 이유를 확인합니다. 실수를 정수로 바꿀 때의 버림·내림·올림·반올림, 담을 수 없는 큰 값을 작은 자료형에 넣을 때 생기는 일, 부호 있는 정수와 부호 없는 정수를 섞을 때의 함정을 Python의 int·float·round, Rust의 as·from·try_from과 비교합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-05-arithmetic]
learningObjectives:
  - C의 자동 형변환(산술 변환)과 명시적 형변환 (자료형)을 구별하고, 결과 자료형을 예측한다.
  - 형변환의 위치에 따라 (double)a / b와 (double)(a / b)가 다른 결과를 내는 이유를 설명한다.
  - 실수를 정수로 바꿀 때 버림, 내림(floor), 올림(ceil), 반올림(round)을 세 언어에서 구별해 쓴다.
  - 좁은 자료형으로 바꿀 때 값이 잘리는 현상과 Rust의 try_from으로 안전하게 바꾸는 방법을 설명한다.
  - 문자열과 숫자 사이의 변환(int, float, str, parse, to_string)을 쓴다.
concepts:
  [
    type conversion,
    cast,
    implicit conversion,
    usual arithmetic conversions,
    truncation,
    floor,
    ceil,
    round,
    narrowing,
    signed unsigned,
    try_from,
  ]
runnerMode: python
playgroundSource: |
  # 파일: conversion.py — 여러 변환을 실험해 보세요.
  import math
  x = -3.7
  print(int(x), math.floor(x), math.ceil(x), round(x))
  print(round(0.5), round(1.5), round(2.5))    # 짝수 쪽으로
  print(int("42") + 1, str(42) + "1")
  print(7 / 2, 7 // 2, float(7 // 2))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day06-predict-c
    title: 형변환 위치에 따른 나눗셈 예측하기
    kind: predict
    objective: 형변환이 나눗셈 전인지 후인지에 따라 결과가 달라짐을 확인한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("%d %.1f %.1f\n", 7 / 2, 7 / 2.0, (double)(7 / 2));
          return 0;
      }
    answer: "3 3.5 3.0"
    hint: "7 / 2.0은 한쪽이 실수라 실수 나눗셈입니다. (double)(7 / 2)는 괄호 안의 정수 나눗셈이 먼저 끝나 3이 된 뒤에 3.0으로 바뀝니다."
    explanation: "형변환은 '그 순간의 값'을 바꿀 뿐 이미 버려진 소수점을 되살리지 못합니다. 실수 결과가 필요하면 나누기 전에 한쪽을 실수로 바꾸세요."
    commonMistakes:
      - "(double)(7 / 2)를 3.5로 생각함"
      - "7 / 2.0도 정수 나눗셈이라고 생각함"
    language: c
    verification: run
  - id: ex-day06-predict-py
    title: Python 변환 함수 예측하기
    kind: predict
    objective: int()의 버림과 round()의 짝수 반올림을 구별한다.
    prompt: 출력되는 네 값을 공백으로 구분해 적으세요.
    starter: 'print(int(-2.7), round(2.5), round(3.5), int("7") * 2)'
    answer: "-2 2 4 14"
    hint: "int()는 0 쪽으로 버립니다. round()는 딱 절반(.5)일 때 짝수 쪽으로 반올림합니다."
    explanation: "int(-2.7)은 -3이 아니라 -2입니다(내림은 math.floor). round(2.5)는 2, round(3.5)는 4로, 절반인 값을 가장 가까운 짝수로 보내는 '은행가 반올림'입니다. C의 round와 Rust의 round는 0에서 먼 쪽으로 보내 2.5가 3이 됩니다."
    commonMistakes:
      - "int(-2.7)을 -3으로 적음"
      - "round(2.5)를 3으로 적음"
    language: python
    verification: run
  - id: ex-day06-fill
    title: Rust 평균에 as f64 채우기
    kind: fill
    objective: Rust에서 정수를 실수로 명시적으로 바꿔 나눈다.
    prompt: "빈칸 두 곳을 채워 '평균 2.50'이 출력되게 하세요."
    starter: |-
      fn main() {
          let sum: i32 = 10;
          let count: i32 = 4;
          let avg = sum _____ / count _____;
          println!("평균 {avg:.2}");
      }
    answer: |-
      fn main() {
          let sum: i32 = 10;
          let count: i32 = 4;
          let avg = sum as f64 / count as f64;
          println!("평균 {avg:.2}");
      }
    output: "평균 2.50"
    hint: "Rust는 i32와 f64를 섞어 나눌 수 없어서 두 값 모두 f64로 바꿔야 합니다."
    explanation: "C라면 한쪽만 double로 바꿔도 나머지가 자동으로 바뀌지만, Rust는 자동 변환을 하지 않으므로 양쪽 모두 as f64가 필요합니다. as는 단항 연산자보다 늦고 곱셈·나눗셈보다 먼저 계산됩니다."
    commonMistakes:
      - "한쪽만 as f64로 바꿔 E0277 오류가 남"
      - "(sum / count) as f64로 써서 2.00이 됨"
    language: rust
    verification: run
  - id: ex-day06-modify
    title: C 정답률을 소수점까지 출력하기
    kind: modify
    objective: 정수 계산 순서 때문에 0이 되는 비율을 실수 계산으로 바꾼다.
    prompt: "23문제 중 17문제를 맞혔습니다. 지금 코드는 '정답률 0%'를 출력합니다. 실수로 계산해 '정답률 73.9%'가 출력되게 고치세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int correct = 17, total = 23;
          int rate = correct / total * 100;
          printf("정답률 %d%%\n", rate);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int correct = 17, total = 23;
          double rate = (double)correct / total * 100;
          printf("정답률 %.1f%%\n", rate);
          return 0;
      }
    output: "정답률 73.9%"
    hint: "17 / 23은 정수 나눗셈이라 0입니다. 나누기 전에 correct를 double로 바꾸고, 결과를 담는 변수와 서식도 실수용으로 바꾸세요."
    explanation: "(double)correct / total은 0.739...이고, 100을 곱하면 73.91...입니다. %.1f로 소수점 한 자리까지 출력합니다. 정수로만 계산해야 한다면 correct * 100 / total처럼 곱셈을 먼저 하면 73이 됩니다."
    commonMistakes:
      - "변수만 double로 바꾸고 계산식은 그대로 둬서 0.0%가 됨"
      - "서식을 %d로 두어 컴파일 경고(오류)가 남"
    language: c
    verification: run
  - id: ex-day06-debug
    title: Python 문자열 덧셈 버그 고치기
    kind: debug
    objective: 문자열로 들어온 숫자를 계산 전에 정수로 바꾼다.
    prompt: "입력으로 받은 두 수 '12'와 '30'을 더하려 했는데 1230이 출력됩니다. 42가 출력되게 고치세요."
    starter: |-
      a = "12"      # input()으로 받은 값
      b = "30"
      print(a + b)
    answer: |-
      a = "12"      # input()으로 받은 값
      b = "30"
      print(int(a) + int(b))
    output: "42"
    starterOutput: "1230"
    hint: "문자열끼리의 +는 이어 붙이기입니다."
    explanation: "Python은 문자열과 정수를 자동으로 바꾸지 않습니다. 오류 없이 '틀린 답'이 나오는 경우라 더 조심해야 합니다. 반대로 숫자를 문자열에 붙이려면 str(42) + '번'처럼 바꿉니다."
    commonMistakes:
      - "float()로 바꿔 42.0이 출력됨"
      - "int(a + b)로 써서 1230이 정수로 바뀌기만 함"
    language: python
    verification: run
  - id: ex-day06-independent
    title: Rust 점수를 반올림해 u8로 저장하기
    kind: independent
    objective: 반올림 후 좁은 자료형으로 바꾸고, 범위를 벗어나는 변환은 try_from으로 검사한다.
    prompt: "실수 점수 87.6을 반올림해 u8 변수에 저장하고, 정수 300을 u8로 바꿀 수 있는지 검사해 '88 false'를 출력하세요."
    starter: |-
      fn main() {
          let score = 87.6_f64;
          let big = 300_i32;
          println!("{score} {big}");
      }
    answer: |-
      fn main() {
          let score = 87.6_f64;
          let big = 300_i32;
          let stored: u8 = score.round() as u8;
          let fits = u8::try_from(big).is_ok();
          println!("{stored} {fits}");
      }
    output: "88 false"
    hint: "f64의 round()로 반올림한 뒤 as u8로 바꿉니다. u8::try_from(값)은 Ok 또는 Err을 돌려주고, is_ok()는 Ok인지 참·거짓으로 알려 줍니다."
    explanation: "300 as u8은 오류 없이 44가 되어 버리지만, try_from은 범위를 벗어나면 Err를 돌려줘 실수를 알아챌 수 있습니다. 값이 담길 수 있는지 확실하지 않을 때는 try_from을 쓰세요."
    commonMistakes:
      - "score as u8로 반올림 없이 바꿔 87이 됨"
      - "300 as u8의 결과 44를 그대로 사용함"
    language: rust
    verification: run
quiz:
  - id: quiz-day06-01
    question: C에서 int a = 7, b = 2;일 때 (double)(a / b)의 값은?
    choices: ["3.5", "3.0", "4.0", "컴파일 오류"]
    answerIndex: 1
    explanation: 괄호 안의 a / b가 먼저 정수 나눗셈으로 3이 되고, 그다음 3.0으로 바뀝니다. 3.5를 원하면 (double)a / b로 씁니다.
  - id: quiz-day06-02
    question: C에서 3 + 2.5를 계산할 때 일어나는 일은?
    choices:
      - 2.5가 정수 2로 바뀌어 5가 된다
      - 3이 자동으로 3.0(double)으로 바뀌어 5.5가 된다
      - 컴파일 오류가 난다
      - 결과가 문자열이 된다
    answerIndex: 1
    explanation: 서로 다른 자료형이 섞이면 C는 '더 넓은' 자료형으로 맞춰 계산합니다(int → double). 이것을 산술 변환이라고 합니다. Rust는 이런 자동 변환을 하지 않아 컴파일 오류가 납니다.
  - id: quiz-day06-03
    question: -3.7을 정수로 바꿀 때 결과가 -4인 것은?
    choices:
      - C의 (int)-3.7
      - Python의 int(-3.7)
      - Python의 math.floor(-3.7)
      - Rust의 -3.7_f64 as i32
    answerIndex: 2
    explanation: (int), int(), as는 모두 0 쪽으로 버려 -3입니다. floor(내림)만 수직선에서 더 작은 쪽인 -4로 갑니다. 올림(ceil)은 -3입니다.
  - id: quiz-day06-04
    question: Rust에서 300_i32 as u8의 결과는?
    choices: ["255", "300", "44", "컴파일 오류"]
    answerIndex: 2
    explanation: "u8은 0~255만 담으므로 as는 아래쪽 8비트만 남깁니다. 300 = 256 + 44라서 44입니다. 오류가 나지 않으니 조심해야 하고, 검사가 필요하면 u8::try_from을 씁니다. C의 (unsigned char)300도 44입니다."
  - id: quiz-day06-05
    question: C에서 (unsigned int)-1의 값은?
    choices: ["-1", "0", "1", "4294967295"]
    answerIndex: 3
    explanation: 부호 없는 정수는 음수를 담을 수 없어서, -1의 비트(모두 1)를 그대로 부호 없는 수로 읽습니다. 32비트에서는 2³² − 1 = 4294967295입니다. 그래서 부호 있는 수와 없는 수를 섞어 비교하면 -1이 1보다 크다는 이상한 결과가 나올 수 있습니다.
---

## 1. 오늘 배울 내용

Day 1과 Day 5에서 `(double)`과 `as f64`를 "정수 나눗셈을 피하는 방법"으로 잠깐 썼습니다. 오늘은 **자료형이 바뀌는 모든 순간**을 정리합니다.

1. C가 계산 중에 **자동으로** 자료형을 바꾸는 규칙(산술 변환).
2. `(double)x`처럼 **직접** 바꾸는 **형변환(cast)**, 그리고 형변환의 **위치**가 결과를 바꾸는 이유.
3. 실수 → 정수 변환의 네 가지 방법을 구별합니다.
   - 버림
   - 내림(floor)
   - 올림(ceil)
   - 반올림(round)
4. 큰 값을 **좁은 자료형**에 넣을 때 값이 잘리는 현상과 **부호 없는 정수**의 함정을 봅니다.
5. 문자열 ↔ 숫자 변환을 세 언어로 정리합니다.

## 2. 왜 필요한가

형변환 실수는 **오류 메시지 없이 틀린 값**을 만듭니다.

- 정답률을 `correct / total * 100`으로 계산하면 늘 0%가 나옵니다.
- 가격 3.99원을 정수로 바꾸면 반올림이 아니라 3원이 됩니다.
- 300을 1바이트 자료형에 넣으면 44가 됩니다.
- `-1 < 1u`라는 C의 비교가 거짓이 됩니다.

이런 일은 컴퓨터가 값을 **정해진 크기의 비트**로 저장하고, 자료형마다 비트를 해석하는 방법이 다르기 때문에 일어납니다. 언제 어떤 변환이 일어나는지 알면 이런 버그를 미리 막을 수 있습니다.

## 3. 그림으로 이해하기

C는 서로 다른 자료형이 만나면 **더 넓은 쪽**으로 맞춘 뒤 계산합니다.

```text
좁음 ─────────────────────────────────────────▶ 넓음
char, short  →  int  →  unsigned int  →  long long  →  float  →  double

  3   +   2.5            7   /   2            'A'  +   1
 int    double          int     int           char    int
  ↓ 자동 변환             (변환 없음)            ↓ 자동으로 int
 3.0  +  2.5 = 5.5      7 / 2 = 3              65  +  1 = 66
```

직접 형변환은 **그 자리의 값 하나**만 바꿉니다. 괄호의 위치가 곧 "언제 바꾸는가"입니다.

```text
(double)total / count           (double)(total / count)
    ↓                                     ↓
 7.0  /  2  → 3.5                (7 / 2) = 3  →  3.0
 (나누기 전에 바꿈)                (나눈 뒤에 바꿈: 이미 늦음)
```

좁은 자료형으로 바꿀 때는 **비트가 잘려 나갑니다**. `unsigned char`는 8비트(0~255)입니다.

```text
300 = 1 0010 1100 (9비트)
          └──┬───┘
     아래 8비트만 남김 → 0010 1100 = 44
```

## 4. 천천히 풀어보기

### 4.1 자동 변환(산술 변환)

C는 연산자의 양쪽 자료형이 다르면 다음 규칙으로 맞춥니다.

1. `char`, `short` 같은 작은 정수는 계산 전에 `int`로 바뀝니다. 그래서 `'A' + 1`은 `int` 66입니다.
2. 한쪽이 `double`이면 다른 쪽도 `double`로 바뀝니다.
3. 둘 다 정수면 더 넓은 정수 쪽으로 맞춥니다. 크기가 같은데 부호가 다르면 **부호 없는 쪽**으로 맞춥니다. 이 규칙이 `-1 < 1u` 문제를 만듭니다.

대입할 때도 변환이 일어납니다. `int n = 3.99;`는 `n`에 3이 들어가고, `double d = 7 / 2;`는 3.0이 들어갑니다. **오른쪽을 다 계산한 뒤** 왼쪽 자료형으로 바뀐다는 것이 핵심입니다.

Python은 `int`와 `float`가 섞이면 `float`로 계산합니다. Rust는 **자동 변환을 전혀 하지 않습니다**. 모든 변환을 `as`나 `from`으로 직접 적어야 합니다.

### 4.2 실수를 정수로 바꾸는 네 가지 방법

| 방법           | 3.7 | -3.7 |   2.5 |   -2.5 | C                       | Python                 | Rust        |
| -------------- | --: | ---: | ----: | -----: | ----------------------- | ---------------------- | ----------- |
| 버림(0 쪽으로) |   3 |   -3 |     2 |     -2 | `(int)x`                | `int(x)`               | `x as i32`  |
| 내림           |   3 |   -4 |     2 |     -3 | `floor(x)`              | `math.floor(x)`        | `x.floor()` |
| 올림           |   4 |   -3 |     3 |     -2 | `ceil(x)`               | `math.ceil(x)`         | `x.ceil()`  |
| 반올림         |   4 |   -4 | **3** | **-3** | `round(x)`, `lround(x)` | `round(x)` → **2, -2** | `x.round()` |

반올림에서 딱 절반(.5)일 때 C와 Rust는 **0에서 먼 쪽**으로(2.5 → 3), Python은 **가장 가까운 짝수 쪽**으로(2.5 → 2, 3.5 → 4) 보냅니다. Python 방식은 많은 수를 반올림해 더할 때 한쪽으로 치우치지 않게 해 줍니다.

### 4.3 좁은 자료형으로 바꾸기

| 변환                  | C                    | Rust                | 결과                               |
| --------------------- | -------------------- | ------------------- | ---------------------------------- |
| 300 → 8비트 부호 없음 | `(unsigned char)300` | `300_i32 as u8`     | 44 (오류 없음)                     |
| -1 → 32비트 부호 없음 | `(unsigned int)-1`   | `(-1_i32) as u32`   | 4294967295                         |
| 1e10 → 32비트 정수    | 정의되지 않은 동작   | `1e10 as i32`       | Rust는 2147483647(최댓값에서 멈춤) |
| 검사하며 바꾸기       | 직접 범위 확인       | `u8::try_from(300)` | `Err(...)`                         |
| 넓히기(항상 안전)     | 자동                 | `u32::from(200_u8)` | 200                                |

C에서 실수가 정수 범위를 벗어나는 변환은 **정의되지 않은 동작**입니다. 컴파일러마다, 실행할 때마다 결과가 다를 수 있습니다. Rust의 `as`는 결과가 정해져 있지만 **조용히 값을 바꿉니다**. 값이 맞는지 확신이 없으면 `try_from`을 씁니다.

### 4.4 문자열과 숫자

| 변환                 | Python          | C                              | Rust                            |
| -------------------- | --------------- | ------------------------------ | ------------------------------- |
| 문자열 → 정수        | `int("42")`     | `strtol("42", NULL, 10)`       | `"42".parse::<i32>()`           |
| 문자열 → 실수        | `float("3.5")`  | `strtod("3.5", NULL)`          | `"3.5".parse::<f64>()`          |
| 16진수 문자열 → 정수 | `int("ff", 16)` | `strtol("ff", NULL, 16)`       | `i32::from_str_radix("ff", 16)` |
| 숫자 → 문자열        | `str(42)`       | `snprintf(buf, ..., "%d", 42)` | `42.to_string()`                |

C의 문자열 변환 함수는 배열과 포인터를 배운 뒤(Day 37) 제대로 다룹니다.

## 5. C로 구현하기

```c
// 파일: conversion.c
#include <stdio.h>
#include <math.h>

int main(void) {
    int total = 7, count = 2;
    double avg1 = total / count;              // 정수 나눗셈을 먼저 하고 나서 double로
    double avg2 = (double)total / count;      // total을 먼저 double로 → 실수 나눗셈
    double avg3 = total / (double)count;      // 한쪽만 double이면 충분
    double avg4 = (double)(total / count);    // 괄호 안에서 이미 3이 됨
    printf("avg1=%.2f avg2=%.2f avg3=%.2f avg4=%.2f\n", avg1, avg2, avg3, avg4);

    printf("3 + 2.5 = %.1f\n", 3 + 2.5);      // int 3이 double 3.0으로 자동 변환
    printf("'A' + 1 = %d, 글자로 %c\n", 'A' + 1, 'A' + 1);

    double price = 3.99;
    printf("(int)3.99 = %d, lround(3.99) = %ld\n", (int)price, lround(price));
    printf("(int)-3.99 = %d, floor(-3.99) = %.0f, ceil(-3.99) = %.0f\n",
           (int)-3.99, floor(-3.99), ceil(-3.99));
    printf("round(2.5) = %.0f, round(-2.5) = %.0f\n", round(2.5), round(-2.5));

    int big = 300;
    unsigned char small = (unsigned char)big; // 0~255만 담는다: 300 - 256
    printf("(unsigned char)300 = %d\n", small);

    int negative = -1;
    printf("(unsigned int)-1 = %u\n", (unsigned int)negative);
    printf("(unsigned int)-1 < 1u ? %s\n", (unsigned int)negative < 1u ? "참" : "거짓");
    return 0;
}
```

실행 결과:

```text
avg1=3.00 avg2=3.50 avg3=3.50 avg4=3.00
3 + 2.5 = 5.5
'A' + 1 = 66, 글자로 B
(int)3.99 = 3, lround(3.99) = 4
(int)-3.99 = -3, floor(-3.99) = -4, ceil(-3.99) = -3
round(2.5) = 3, round(-2.5) = -3
(unsigned char)300 = 44
(unsigned int)-1 = 4294967295
(unsigned int)-1 < 1u ? 거짓
```

### 코드 한 부분씩 읽기

| 코드                           | 설명                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `double avg1 = total / count;` | 오른쪽 `7 / 2`가 먼저 정수 3이 되고, 대입할 때 3.0으로 바뀝니다. **결과를 담는 변수의 자료형은 계산 방식에 영향을 주지 않습니다.**                                   |
| `(double)total / count`        | 형변환 `(double)`은 바로 뒤의 값 하나에만 붙습니다. `total`이 7.0이 되고, `count`는 자동 변환으로 2.0이 되어 3.5입니다.                                              |
| `(double)(total / count)`      | 괄호 안이 먼저 끝나 3이 된 뒤 바뀝니다.                                                                                                                              |
| `'A' + 1`                      | `char`는 계산 전에 `int`로 바뀌어 66입니다. `%c`로 출력하면 66번 글자 `B`입니다.                                                                                     |
| `lround(price)`                | 반올림해서 `long`(긴 정수)으로 돌려줍니다. 그래서 서식이 `%ld`입니다. `round`는 반올림한 값을 `double`로 돌려줍니다.                                                 |
| `(int)-3.99`                   | 0 쪽으로 버려 -3입니다. 내림이 필요하면 `floor`를 씁니다.                                                                                                            |
| `(unsigned char)big`           | 아래 8비트만 남아 44입니다. 오류도 경고도 없습니다.                                                                                                                  |
| `(unsigned int)negative`       | -1의 비트(32개 모두 1)를 부호 없는 수로 읽어 4294967295입니다.                                                                                                       |
| `(unsigned int)negative < 1u`  | 부호 없는 수끼리 비교라 4294967295 < 1은 거짓입니다. 형변환 없이 `negative < 1u`라고 쓰면 C는 **자동으로** 같은 변환을 하는데, `-Wextra`가 이를 경고해 줍니다(12절). |

## 6. Python으로 구현하기

Python은 정수의 크기 제한이 없고 부호 없는 자료형도 없어서, 잘림이나 부호 문제는 생기지 않습니다. 대신 **문자열과 숫자의 변환**, **버림과 반올림의 차이**를 확실히 알아 두어야 합니다.

```python
# 파일: conversion.py
import math

total, count = 7, 2
print(total / count, total // count, float(total // count))
print(3 + 2.5, type(3 + 2.5).__name__)          # int와 float를 섞으면 float

print(int(3.99), int(-3.99))                    # 0 쪽으로 버림
print(math.floor(-3.99), math.ceil(-3.99))      # 내림, 올림
print(round(3.99), round(2.5), round(3.5), round(-2.5))   # 짝수 쪽 반올림
print(round(2.675, 2))                          # 2.675는 사실 2.67499...로 저장됨

print(int("42") + 1, float("3.5") * 2, str(42) + "번")
print(int("ff", 16), int("101", 2))             # 진법을 지정해 문자열 → 정수
print(bool(0), bool(3), bool(""), bool("0"))    # 0과 빈 문자열만 False
print(True + True, int(False))                  # bool은 정수처럼 1과 0
```

실행 결과:

```text
3.5 3 3.0
5.5 float
3 -3
-4 -3
4 2 4 -2
2.67
43 7.0 42번
255 5
False True False True
2 0
```

### 코드 한 부분씩 읽기

| 코드                               | 설명                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `float(total // count)`            | 몫 3을 실수 3.0으로 바꿉니다. C의 `(double)(total / count)`와 같습니다.                                                                  |
| `int(3.99)`, `int(-3.99)`          | 0 쪽으로 버립니다. `int()`는 반올림을 하지 않습니다.                                                                                     |
| `round(2.5)` → 2, `round(3.5)` → 4 | 절반은 짝수 쪽으로 갑니다.                                                                                                               |
| `round(2.675, 2)` → 2.67           | 2.675는 2진수로 정확히 저장되지 않아 실제로는 2.67499999...입니다. 그래서 2.68이 아니라 2.67입니다. Day 5의 실수 오차와 같은 이유입니다. |
| `int("ff", 16)`, `int("101", 2)`   | 두 번째 인자로 **진법**을 알려 줍니다.                                                                                                   |
| `bool(0)`, `bool("0")`             | 숫자 0과 빈 문자열 `""`만 거짓입니다. 글자 `"0"`은 비어 있지 않으므로 참입니다. 조건문에서 중요합니다(Day 13).                           |
| `True + True`                      | `bool`은 `int`의 한 종류라 `True`는 1, `False`는 0처럼 계산됩니다.                                                                       |

## 7. Rust로 구현하기

Rust는 **자동 변환이 없습니다**. `as`는 빠르지만 값을 조용히 바꿀 수 있고, `from`은 항상 안전한 변환(넓히기)에만 쓸 수 있으며, `try_from`은 실패할 수 있는 변환을 검사합니다.

```rust
// 파일: conversion.rs
fn main() {
    let (total, count) = (7, 2);
    println!("{} {}", total / count, total as f64 / count as f64);

    println!("{} {}", 3.99_f64 as i32, -3.99_f64 as i32);         // 0 쪽으로 버림
    println!("{} {}", 3.99_f64.round() as i32, 2.5_f64.round());   // 0에서 먼 쪽으로 반올림
    println!("{} {}", (-3.99_f64).floor(), (-3.99_f64).ceil());

    println!("300 as u8 = {}", 300_i32 as u8);                     // 비트를 잘라 냄: 300 - 256
    println!("-1 as u32 = {}", (-1_i32) as u32);                   // 비트를 그대로 다시 읽음
    println!("1e10 as i32 = {}", 1e10_f64 as i32);                 // 실수 → 정수는 범위 끝에서 멈춤

    let small: u8 = 200;
    let wide = u32::from(small);                                   // 항상 안전한 변환
    println!("u32::from(200u8) = {wide}");
    println!("{:?}", u8::try_from(300_i32));                       // 범위를 넘으면 Err
    println!("{:?}", u8::try_from(200_i32));

    println!("'A' as u8 + 1 = {}", 'A' as u8 + 1);
    println!("(b'A' + 1) as char = {}", (b'A' + 1) as char);
    println!("{}", "42".parse::<i32>().unwrap() + 1);
    println!("{}", 42.to_string() + "번");
}
```

실행 결과:

```text
3 3.5
3 -3
4 3
-4 -3
300 as u8 = 44
-1 as u32 = 4294967295
1e10 as i32 = 2147483647
u32::from(200u8) = 200
Err(TryFromIntError(PosOverflow))
Ok(200)
'A' as u8 + 1 = 66
(b'A' + 1) as char = B
43
42번
```

### 코드 한 부분씩 읽기

| 코드                      | 설명                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `3.99_f64 as i32`         | 0 쪽으로 버려 3입니다. `-3.99_f64 as i32`는 `-`가 `as`보다 먼저 붙어 `(-3.99) as i32` = -3입니다.                                                              |
| `3.99_f64.round() as i32` | 먼저 반올림(4.0)한 뒤 바꿉니다. `2.5_f64.round()`는 C처럼 3입니다.                                                                                             |
| `300_i32 as u8`           | C와 같이 아래 8비트만 남아 44입니다.                                                                                                                           |
| `1e10_f64 as i32`         | 실수 → 정수의 `as`는 범위를 넘으면 **가장 가까운 끝값**(i32 최댓값 2147483647)에서 멈춥니다. C처럼 정의되지 않은 동작이 되지 않도록 Rust가 정해 둔 규칙입니다. |
| `u32::from(small)`        | `u8` → `u32`는 절대 값이 잘리지 않으므로 `from`이 있습니다. 반대 방향(`u32` → `u8`)에는 `from`이 없어서 컴파일 오류입니다.                                     |
| `u8::try_from(300_i32)`   | 담을 수 없으면 `Err(TryFromIntError(PosOverflow))`, 담을 수 있으면 `Ok(200)`입니다. `Result`는 Day 25에서 자세히 다룹니다.                                     |
| `b'A'`                    | `b`를 붙인 글자는 `u8`(바이트) 값 65입니다. `(b'A' + 1) as char`는 66번 글자 `B`입니다.                                                                        |
| `42.to_string() + "번"`   | 숫자를 `String`으로 바꾼 뒤 문자열을 이어 붙입니다.                                                                                                            |

## 8. 실행 추적

C에서 `double avg2 = (double)total / count;`를 계산하는 동안 각 값의 **자료형**이 어떻게 바뀌는지 따라갑니다.

| 단계 | 식              | 왼쪽 값의 자료형 | 오른쪽 값의 자료형 | 일어난 일                         | 결과         |
| ---: | --------------- | ---------------- | ------------------ | --------------------------------- | ------------ |
|    1 | `(double)total` | `int 7`          |                    | 명시적 형변환                     | `double 7.0` |
|    2 | `7.0 / count`   | `double`         | `int 2`            | 자동 변환: `count` → `double 2.0` |              |
|    3 | `7.0 / 2.0`     | `double`         | `double`           | 실수 나눗셈                       | `double 3.5` |
|    4 | `avg2 = 3.5`    | `double`         |                    | 같은 자료형이라 변환 없음         | `avg2 = 3.5` |

`avg4 = (double)(total / count)`는 1단계가 `7 / 2`(둘 다 `int`)여서 `int 3`이 먼저 나오고, 그다음 `double 3.0`이 됩니다.

## 9. 다른 예제로 다시 이해하기

시험 23문제 중 17문제를 맞혔습니다. 정답률을 구하는 네 가지 방법을 비교해 봅시다. 같은 두 정수로 계산하는데도 **계산 순서와 자료형**에 따라 답이 달라집니다.

```c
// 파일: score_rate.c
#include <stdio.h>
#include <math.h>

int main(void) {
    int correct = 17, total = 23;
    printf("1) 정수만, 나눗셈 먼저: %d%%\n", correct / total * 100);
    printf("2) 정수만, 곱셈 먼저:   %d%%\n", correct * 100 / total);
    double rate = (double)correct / total * 100;
    printf("3) 실수로 계산:         %.2f%%\n", rate);
    printf("4) 실수로 계산 후 반올림: %ld%%\n", lround(rate));
    return 0;
}
```

실행 결과:

```text
1) 정수만, 나눗셈 먼저: 0%
2) 정수만, 곱셈 먼저:   73%
3) 실수로 계산:         73.91%
4) 실수로 계산 후 반올림: 74%
```

1번은 `17 / 23 = 0`에 100을 곱해 0입니다. 2번은 `1700 / 23 = 73`으로 소수점만 버렸습니다. 정수만으로 계산해야 할 때는 **곱셈을 먼저** 하면 정밀도를 잃지 않습니다. 단, 곱한 값이 너무 커지면 넘칠 수 있다는 점은 Day 10에서 다룹니다.

같은 계산을 Rust로 하면, 3번과 4번에서 **모든 변환을 직접 적어야** 한다는 점이 드러납니다.

```rust
// 파일: score_rate.rs
fn main() {
    let (correct, total) = (17, 23);
    println!("1) 정수만, 나눗셈 먼저: {}%", correct / total * 100);
    println!("2) 정수만, 곱셈 먼저:   {}%", correct * 100 / total);
    let rate = correct as f64 / total as f64 * 100.0;
    println!("3) 실수로 계산:         {rate:.2}%");
    println!("4) 실수로 계산 후 반올림: {}%", rate.round() as i32);
}
```

실행 결과:

```text
1) 정수만, 나눗셈 먼저: 0%
2) 정수만, 곱셈 먼저:   73%
3) 실수로 계산:         73.91%
4) 실수로 계산 후 반올림: 74%
```

Python은 `/`가 항상 실수라서 1번 같은 실수는 생기지 않습니다. 다만 `round()`는 절반을 짝수 쪽으로 보내서 `round(73.5)`는 74이지만 `round(72.5)`는 73이 아니라 **72**가 된다는 차이를 알아 두세요.

## 10. 변환 방법 한눈에 보기

| 하고 싶은 일              | C                       | Python                 | Rust                         |
| ------------------------- | ----------------------- | ---------------------- | ---------------------------- |
| 정수 → 실수               | `(double)n` (또는 자동) | `float(n)` (또는 자동) | `n as f64`, `f64::from(n)`   |
| 실수 → 정수(버림)         | `(int)x`                | `int(x)`               | `x as i32`                   |
| 반올림                    | `lround(x)`             | `round(x)` (짝수 쪽)   | `x.round() as i32`           |
| 좁히기(값이 잘릴 수 있음) | `(unsigned char)n`      | (해당 없음)            | `n as u8`                    |
| 검사하며 좁히기           | 직접 범위 비교          | (해당 없음)            | `u8::try_from(n)`            |
| 글자 ↔ 번호               | `'A' + 1`, `(char)66`   | `ord`, `chr`           | `'A' as u32`, `b'A' as char` |

## 11. 세 언어 비교

| 관점             | C                                      | Python                    | Rust                                  |
| ---------------- | -------------------------------------- | ------------------------- | ------------------------------------- |
| 자동 변환        | 많음(작은 정수 → int, 정수 → 실수 등)  | int + float → float       | 없음                                  |
| 명시적 변환 문법 | `(자료형)값`                           | `int(값)`, `float(값)`    | `값 as 자료형`, `자료형::from(값)`    |
| 좁히기 결과      | 잘림(실수 → 정수는 정의되지 않은 동작) | 필요 없음(크기 제한 없음) | `as`는 잘림/끝값, `try_from`은 검사   |
| 절반 반올림      | 0에서 먼 쪽                            | 짝수 쪽                   | 0에서 먼 쪽                           |
| 부호 없는 정수   | 있음(`unsigned`), 섞으면 함정          | 없음                      | 있음(`u8`~`u128`), 섞으면 컴파일 오류 |

## 12. 자주 하는 실수

### 실수 1: 부호 있는 수와 없는 수를 비교한다 (C)

```c
// 파일: sign_compare.c (컴파일 오류: comparison of integer expressions of different signedness)
#include <stdio.h>

int main(void) {
    int a = -1;
    unsigned int b = 1;
    if (a < b) {
        printf("작다\n");
    } else {
        printf("크거나 같다\n");
    }
    return 0;
}
```

경고를 끄고 실행하면 "크거나 같다"가 출력됩니다. `a`가 부호 없는 수로 바뀌어 4294967295가 되기 때문입니다. 이 과정의 `-Wall -Wextra -Werror` 옵션이 이런 코드를 막아 줍니다.

### 실수 2: 소수점이 있는 문자열을 int로 바꾼다 (Python)

```python
# 파일: int_float_str.py (실행 오류: ValueError)
text = "3.7"
print(int(text))
```

`int()`는 정수 모양의 문자열만 받습니다. `int(float(text))`처럼 두 단계로 바꿉니다.

### 실수 3: 자료형이 다른 정수를 섞는다 (Rust)

```rust
// 파일: mixed_ints.rs (컴파일 오류: E0308)
fn main() {
    let big: i64 = 5;
    let small: i32 = 3;
    println!("{}", big + small);
}
```

같은 정수라도 크기가 다르면 섞을 수 없습니다. `big + small as i64` 또는 `big + i64::from(small)`로 씁니다.

### 실수 4: 계산이 끝난 뒤에 형변환한다 (C, Rust)

`(double)(a / b)`, `(a / b) as f64`는 이미 소수점이 버려진 뒤입니다. **나누기 전에** 바꾸세요.

### 실수 5: as의 조용한 잘림을 믿는다 (Rust)

`as u8`은 256을 0으로, 257을 1로 바꿉니다. 사용자 입력처럼 범위를 알 수 없는 값은 `try_from`으로 검사하세요.

## 13. Q&A

**Q. C에서 왜 자동 변환을 그렇게 많이 하나요?**

A. C가 만들어질 때는 코드를 짧게 쓰는 편의가 중요했고, 하드웨어도 작은 정수를 `int` 크기로 계산하는 것이 자연스러웠습니다. 그 결과 편리하지만 실수하기 쉬운 규칙이 남았습니다. 요즘은 경고 옵션으로 위험한 자동 변환을 찾아냅니다. `-Wconversion` 옵션을 켜면 `int n = 3.99;` 같은 대입도 경고합니다.

**Q. Python에는 왜 부호 없는 정수가 없나요?**

A. Python 정수는 크기가 정해져 있지 않아서, 비트 수에 맞춰 범위를 나눌 필요가 없습니다. 대신 파일이나 네트워크처럼 **정해진 크기의 바이트**를 다룰 때는 `bytes`, `struct` 모듈로 바이트 단위 변환을 합니다.

**Q. Rust의 as와 from 중 무엇을 써야 하나요?**

A. 값이 절대 잘리지 않는 변환(넓히기)은 `from`/`into`가 의도를 분명히 보여 줘서 더 좋습니다. 잘릴 수 있는 변환은 `try_from`으로 검사하세요. `as`는 "잘려도 괜찮다"는 것을 확실히 알 때(예: 해시값 계산, 비트 조작) 씁니다.

**Q. 반올림을 원하는 자리에서 하려면요?**

A. Python은 `round(x, 2)`, C와 Rust는 `round(x * 100) / 100`처럼 곱했다 나눕니다. 다만 **출력용**이면 값을 바꾸지 말고 서식(`%.2f`, `:.2f`, `{:.2}`)만 쓰는 것이 가장 안전합니다.

## 14. 핵심 요약

- C는 서로 다른 자료형이 만나면 넓은 쪽으로 **자동 변환**합니다(작은 정수 → int, 정수 → double). Python은 int + float → float, Rust는 자동 변환이 없습니다.
- 형변환은 **그 순간의 값**만 바꿉니다. `(double)a / b`는 3.5, `(double)(a / b)`는 3.0입니다.
- 실수 → 정수: 버림 `(int)`/`int()`/`as`, 내림 `floor`, 올림 `ceil`, 반올림 `round`. Python의 `round`는 절반을 짝수 쪽으로 보냅니다.
- 좁은 자료형으로 바꾸면 아래 비트만 남습니다(`300 → 44`). Rust는 `try_from`으로 검사할 수 있습니다.
- 부호 있는 수와 없는 수를 섞으면 -1이 아주 큰 수가 됩니다. 경고를 켜고 섞지 마세요.
- 문자열 ↔ 숫자: `int()/float()/str()`, `parse()/to_string()`, C는 `strtol`/`snprintf`(Day 37).

## 15. 도전 문제

1. **(C)** 섭씨 온도를 입력받아 화씨로 바꾼 뒤, 버림·내림·올림·반올림한 네 정수를 모두 출력하세요. 음수 온도로도 확인하세요.
2. **(Python)** `round(0.5)`, `round(1.5)`, …, `round(5.5)`의 결과를 출력하고 규칙을 설명해 보세요.
3. **(Rust)** `i32` 값 `-5`, `0`, `200`, `300`을 각각 `u8::try_from`으로 바꿔 결과(`Ok`/`Err`)를 출력해 보세요.
4. **(세 언어)** 물건 가격 19,900원에 할인율 15%를 적용한 가격을 계산하세요. 정수만으로 계산하는 방법(곱셈 먼저)과 실수로 계산해 반올림하는 방법의 결과를 비교하세요.
