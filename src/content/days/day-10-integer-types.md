---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-10-integer-types
courseId: crp-92
phaseId: phase-01
dayNumber: 10
date: "2026-10-10"
title: 정수 자료형과 범위 — 비트 수가 정하는 한계
summary: C의 정수 자료형(char, short, int, long, long long)과 부호 없는 자료형이 몇 바이트를 쓰고 어떤 범위의 값을 담는지 limits.h로 확인하고, 크기가 정해진 stdint.h 자료형(int32_t, uint8_t, int64_t)을 씁니다. 음수를 저장하는 2의 보수, 범위를 넘을 때 부호 없는 정수는 0부터 다시 도는 반면 부호 있는 정수는 정의되지 않은 동작이 된다는 차이를 배우고, Python의 크기 제한 없는 정수와 Rust의 i8~i128, checked·wrapping·saturating 연산을 비교합니다. 60일을 밀리초로 바꾸는 계산으로 넘침을 직접 확인합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-09-formatted-output]
learningObjectives:
  - n비트 정수가 담을 수 있는 범위를 부호 있는 경우와 없는 경우로 계산한다.
  - C의 정수 자료형 크기와 범위를 sizeof와 limits.h로 확인하고, 플랫폼마다 달라지는 자료형(long)을 구별한다.
  - 크기가 정해진 stdint.h 자료형과 알맞은 printf 서식을 쓴다.
  - 2의 보수로 음수가 저장되는 방식을 비트로 설명한다.
  - 정수 넘침이 언어마다 어떻게 다른지 설명하고, Rust의 checked·wrapping·saturating 연산을 골라 쓴다.
concepts:
  [
    integer type,
    bit,
    byte,
    range,
    signed,
    unsigned,
    two's complement,
    overflow,
    wraparound,
    undefined behavior,
    stdint,
    checked arithmetic,
  ]
runnerMode: python
playgroundSource: |
  # 파일: bits.py — 비트 수와 범위의 관계를 실험해 보세요.
  for bits in (8, 16, 32, 64):
      print(f"{bits:>2}비트  부호 없음 0 ~ {2**bits - 1:,}")
      print(f"      부호 있음 {-2**(bits-1):,} ~ {2**(bits-1) - 1:,}")
  print(f"{5:08b} / -5를 8비트로: {-5 & 0xFF:08b}")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day10-predict-c
    title: 부호 없는 정수의 넘침 예측하기
    kind: predict
    objective: 부호 없는 정수가 범위를 넘으면 0부터 다시 돈다는 것을 계산한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          unsigned char c = 200;
          c += 100;
          unsigned int u = 0;
          u--;
          printf("%u %u\n", c, u);
          return 0;
      }
    answer: "44 4294967295"
    hint: "unsigned char는 0~255입니다. 300에서 256을 빼면 됩니다. unsigned int(32비트)의 0에서 1을 빼면 가장 큰 값으로 돌아갑니다."
    explanation: "부호 없는 정수의 계산은 2ⁿ으로 나눈 나머지로 정해집니다. 300 mod 256 = 44, -1 mod 2³² = 4294967295입니다. 이 동작은 C 표준이 보장합니다. 부호 있는 정수의 넘침은 보장되지 않습니다."
    commonMistakes:
      - "c가 255에서 멈춘다고 생각함"
      - "u가 -1이 된다고 생각함"
    language: c
    verification: run
  - id: ex-day10-predict-rs
    title: Rust 넘침 처리 메서드 예측하기
    kind: predict
    objective: checked, wrapping, saturating의 차이를 결과로 확인한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let x: u8 = 200;
          println!("{:?} {} {}", x.checked_add(100), x.wrapping_add(100), x.saturating_add(100));
      }
    answer: "None 44 255"
    hint: "checked는 넘치면 None, wrapping은 0부터 다시 돌기, saturating은 끝값에서 멈추기입니다."
    explanation: "300은 u8에 담을 수 없습니다. checked_add는 '결과 없음(None)'을 돌려주고, wrapping_add는 C의 부호 없는 정수처럼 44, saturating_add는 u8의 최댓값 255에 멈춥니다. 어떤 동작이 맞는지는 프로그램의 목적에 따라 고릅니다."
    commonMistakes:
      - "checked_add가 오류로 프로그램을 멈춘다고 생각함"
      - "saturating을 0으로 돌아간다고 생각함"
    language: rust
    verification: run
  - id: ex-day10-fill
    title: 30억을 담는 자료형과 서식 채우기
    kind: fill
    objective: int 범위를 넘는 값에 long long과 %lld를 쓴다.
    prompt: "빈칸 두 곳을 채워 3000000000이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          _____ population = 3000000000LL;
          printf("%_____\n", population);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          long long population = 3000000000LL;
          printf("%lld\n", population);
          return 0;
      }
    output: "3000000000"
    hint: "int의 최댓값은 약 21억입니다. 64비트 정수 자료형과 그 서식을 쓰세요."
    explanation: "long long은 모든 플랫폼에서 최소 64비트라 약 922경까지 담습니다. long은 Windows에서 32비트, Linux·macOS에서 64비트라 믿을 수 없습니다. 크기를 정확히 원하면 int64_t와 PRId64를 씁니다."
    commonMistakes:
      - "long을 써서 Windows에서 값이 깨짐"
      - "자료형은 long long으로 바꾸고 서식은 %d로 둠"
    language: c
    verification: run
  - id: ex-day10-modify
    title: Python으로 8비트 덧셈 흉내 내기
    kind: modify
    objective: 비트 AND(&)로 아래 8비트만 남겨 고정 크기 정수를 흉내 낸다.
    prompt: "add_u8(a, b)가 C의 uint8_t 덧셈처럼 256 이상이면 다시 0부터 돌도록 고쳐서 '4 150'이 출력되게 하세요."
    starter: |-
      def add_u8(a, b):
          return a + b


      print(add_u8(250, 10), add_u8(100, 50))
    answer: |-
      def add_u8(a, b):
          return (a + b) & 0xFF


      print(add_u8(250, 10), add_u8(100, 50))
    output: "4 150"
    hint: "0xFF는 2진수 11111111입니다. & 0xFF는 아래 8비트만 남기는데, 이는 % 256과 같습니다."
    explanation: "Python 정수는 넘치지 않으므로, 파일 형식이나 통신처럼 정해진 크기의 값을 다룰 때는 & 0xFF, & 0xFFFF처럼 직접 잘라 냅니다. (a + b) % 256으로 써도 같은 결과입니다."
    commonMistakes:
      - "& 0xFF 대신 & 255를 써도 되는지 헷갈림(같은 값이라 됨)"
      - "괄호 없이 a + b & 0xFF로 써서 b에만 &가 먼저 적용될까 걱정함(Python에서는 +가 &보다 먼저라 같지만 괄호가 읽기 좋음)"
    language: python
    verification: run
  - id: ex-day10-debug
    title: Rust u8 넘침 패닉 고치기
    kind: debug
    objective: 값의 범위에 맞는 자료형을 골라 넘침을 없앤다.
    prompt: "방문자 수를 u8로 저장했더니 250 + 10에서 'attempt to add with overflow'로 멈춥니다. 자료형을 바꿔 '방문자 260명'이 출력되게 하세요."
    starter: |-
      fn main() {
          let visitors: u8 = "250".parse().unwrap();
          let total = visitors + 10;
          println!("방문자 {total}명");
      }
    answer: |-
      fn main() {
          let visitors: u32 = "250".parse().unwrap();
          let total = visitors + 10;
          println!("방문자 {total}명");
      }
    output: "방문자 260명"
    hint: "u8은 0~255입니다. 방문자 수처럼 커질 수 있는 값에는 더 넓은 자료형을 쓰세요."
    explanation: "Rust는 개발용 빌드에서 정수 넘침을 발견하면 프로그램을 멈춰 알려 줍니다. 최적화(release) 빌드에서는 검사를 생략하고 wrapping처럼 동작하므로, 넘칠 수 있는 곳은 checked_add 등으로 직접 처리하는 것이 안전합니다."
    commonMistakes:
      - "wrapping_add로 바꿔 260 대신 4가 출력됨"
      - "parse 결과의 자료형만 바꾸고 다른 곳에 u8이 남음"
    language: rust
    verification: run
  - id: ex-day10-independent
    title: C로 16비트 정수의 범위 출력하기
    kind: independent
    objective: stdint.h의 크기가 정해진 자료형과 한계값 매크로를 쓴다.
    prompt: "stdint.h의 매크로를 써서 int16_t의 최솟값, 최댓값, uint16_t의 최댓값을 '-32768 32767 65535'로 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("? ? ?\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdint.h>

      int main(void) {
          printf("%d %d %d\n", INT16_MIN, INT16_MAX, UINT16_MAX);
          return 0;
      }
    output: "-32768 32767 65535"
    hint: "stdint.h에는 INT8_MIN, INT16_MAX, UINT32_MAX처럼 자료형 이름을 대문자로 쓴 한계값이 있습니다."
    explanation: "16비트 부호 있는 정수는 -2¹⁵ ~ 2¹⁵ − 1, 부호 없는 정수는 0 ~ 2¹⁶ − 1입니다. 이 매크로들은 int로 계산되는 값이라 %d로 출력할 수 있습니다."
    commonMistakes:
      - "stdint.h를 포함하지 않아 이름을 찾지 못함"
      - "최솟값을 -32767로 적음(음수 쪽이 하나 더 많음)"
    language: c
    verification: run
quiz:
  - id: quiz-day10-01
    question: 8비트 부호 없는 정수(u8, uint8_t)가 담을 수 있는 범위는?
    choices: ["-128 ~ 127", "0 ~ 255", "0 ~ 256", "-255 ~ 255"]
    answerIndex: 1
    explanation: 8비트는 2⁸ = 256가지 값을 나타냅니다. 부호 없으면 0~255, 부호 있으면 -128~127입니다.
  - id: quiz-day10-02
    question: C에서 크기가 플랫폼마다 달라 주의해야 하는 자료형은?
    choices: [int8_t, long, int64_t, uint32_t]
    answerIndex: 1
    explanation: long은 Windows에서 32비트, 대부분의 Linux·macOS에서 64비트입니다. 크기가 중요하면 stdint.h의 int32_t, int64_t처럼 크기가 이름에 들어간 자료형을 씁니다.
  - id: quiz-day10-03
    question: 2의 보수에서 8비트 -1의 비트는?
    choices: ["10000001", "11111111", "00000001", "11111110"]
    answerIndex: 1
    explanation: "2의 보수에서 -x는 'x의 비트를 모두 뒤집고 1을 더한 것'입니다. 1 = 00000001 → 뒤집기 11111110 → +1 = 11111111. 그래서 (uint8_t)-1은 255입니다."
  - id: quiz-day10-04
    question: C에서 int 변수가 INT_MAX일 때 1을 더하면?
    choices:
      - 항상 INT_MIN이 된다
      - 정의되지 않은 동작이라 결과를 믿을 수 없다
      - 컴파일 오류가 난다
      - 자동으로 long long이 된다
    answerIndex: 1
    explanation: 부호 있는 정수의 넘침은 C 표준이 결과를 정하지 않은 '정의되지 않은 동작'입니다. 대부분의 PC에서 INT_MIN처럼 보이지만, 컴파일러가 '넘치지 않는다'고 가정하고 최적화해서 예상 못한 결과가 나올 수 있습니다. 부호 없는 정수만 0부터 다시 도는 것이 보장됩니다.
  - id: quiz-day10-05
    question: Python에서 2 ** 100을 계산하면?
    choices:
      - OverflowError가 난다
      - 정확한 값 1267650600228229401496703205376이 나온다
      - 0이 된다
      - 음수가 된다
    answerIndex: 1
    explanation: Python의 int는 필요한 만큼 자릿수를 늘려 가며 저장해서 넘치지 않습니다. 대신 아주 큰 수는 계산이 느려지고 메모리를 더 씁니다.
---

## 1. 오늘 배울 내용

Day 4의 걸음 수 예제에서 `u32`가 음수를 담지 못해 멈추는 것을 봤고, Day 6에서 `300 as u8`이 44가 되는 것을 봤습니다. 오늘은 그 이유인 **정수 자료형의 크기와 범위**를 제대로 배웁니다.

1. **비트와 바이트**, 그리고 n비트로 나타낼 수 있는 값의 개수를 알아봅니다.
2. C의 정수 자료형과 **범위**를 `sizeof`와 `limits.h`로 확인합니다.
   - `char`, `short`, `int`, `long`, `long long`
   - 부호 없는 `unsigned` 자료형
3. 크기가 정해진 **`stdint.h`** 자료형(`int32_t`, `uint8_t`, `int64_t`)과 출력 서식을 씁니다.
4. 음수를 저장하는 **2의 보수**를 비트로 봅니다.
5. **정수 넘침(overflow)** 이 일어나면 각 언어가 어떻게 하는지 비교합니다.
   - C: 부호 없는 정수는 0부터 다시 돌고, 부호 있는 정수는 정의되지 않은 동작
   - Python: 넘치지 않음
   - Rust: 개발용 빌드에서 멈춤, `checked`·`wrapping`·`saturating` 연산 제공

## 2. 왜 필요한가

넘침은 실제로 큰 사고를 일으켰습니다. 1996년 아리안 5 로켓은 64비트 실수를 16비트 정수로 바꾸다 넘쳐서 발사 37초 만에 폭발했습니다. 유튜브의 조회 수 카운터는 2014년 한 뮤직비디오가 약 21억 회(`int`의 최댓값)를 넘기면서 64비트로 바꿔야 했습니다.

일상적인 계산에서도 쉽게 넘칩니다.

- 60일을 밀리초로 바꾸면 5,184,000,000으로 `int`의 최댓값(약 21억)보다 큽니다.
- 금액을 원 단위로 모으면 30억 원도 `int`로는 담을 수 없습니다.

어떤 자료형이 어디까지 담을 수 있는지 알고, 넘칠 수 있는 곳에서 적절한 자료형을 고르는 것이 오늘의 목표입니다.

## 3. 그림으로 이해하기

**비트(bit)** 는 0 또는 1 하나이고, **바이트(byte)** 는 비트 8개입니다. n비트로는 2ⁿ가지 값을 나타낼 수 있습니다.

```text
3비트로 나타낼 수 있는 값: 2³ = 8가지

비트   부호 없음   부호 있음(2의 보수)
000       0            0
001       1            1
010       2            2
011       3            3
100       4           -4     ← 맨 앞 비트가 1이면 음수
101       5           -3
110       6           -2
111       7           -1
```

부호 있는 정수는 같은 8가지 비트 모양의 절반을 음수에 씁니다. 그래서 n비트 부호 있는 정수의 범위는 **−2ⁿ⁻¹ ~ 2ⁿ⁻¹ − 1**이고, 음수 쪽이 하나 더 많습니다(0이 양수 쪽 자리를 하나 쓰기 때문입니다).

정수 넘침은 **시계**처럼 생각하면 쉽습니다. 부호 없는 8비트 정수는 0~255가 둥글게 이어진 시계입니다.

```text
          0
     253 254 255 │ 0 1 2 ...
               ↑
   250 + 10 → 255를 지나 다시 0부터: 4
```

## 4. 천천히 풀어보기

### 4.1 범위 계산

| 비트 수 | 부호 없음 범위              | 부호 있음 범위                            |
| ------: | --------------------------- | ----------------------------------------- |
|       8 | 0 ~ 255                     | -128 ~ 127                                |
|      16 | 0 ~ 65,535                  | -32,768 ~ 32,767                          |
|      32 | 0 ~ 4,294,967,295 (약 43억) | -2,147,483,648 ~ 2,147,483,647 (약 ±21억) |
|      64 | 0 ~ 약 1.8 × 10¹⁹           | 약 ±9.2 × 10¹⁸ (약 ±922경)                |

"32비트 정수는 약 ±21억"만은 꼭 기억하세요. 넘침 문제의 대부분이 여기서 생깁니다.

### 4.2 C의 정수 자료형

C 표준은 자료형의 **정확한 크기가 아니라 최소 크기**만 정해 두었습니다. 그래서 컴퓨터와 운영체제마다 크기가 다를 수 있습니다.

| 자료형      | 최소 크기 | 64비트 Windows | 64비트 Linux·macOS | 서식         |
| ----------- | --------- | -------------- | ------------------ | ------------ |
| `char`      | 8비트     | 8비트          | 8비트              | `%c`, `%hhd` |
| `short`     | 16비트    | 16비트         | 16비트             | `%hd`        |
| `int`       | 16비트    | 32비트         | 32비트             | `%d`         |
| `long`      | 32비트    | **32비트**     | **64비트**         | `%ld`        |
| `long long` | 64비트    | 64비트         | 64비트             | `%lld`       |
| `size_t`    |           | 64비트         | 64비트             | `%zu`        |

`long`이 운영체제마다 다르다는 점이 특히 함정입니다. Linux에서 잘 돌던 프로그램이 Windows에서 값이 깨지는 흔한 원인입니다. 각 자료형 앞에 `unsigned`를 붙이면 부호 없는 자료형이 되고 서식은 `%u`, `%lu`, `%llu`입니다.

크기가 정확히 필요하면 **`stdint.h`** 의 자료형을 씁니다.

| 자료형                | 크기   | 한계값 매크로             | `printf` 서식(`inttypes.h`)    |
| --------------------- | ------ | ------------------------- | ------------------------------ |
| `int8_t`, `uint8_t`   | 8비트  | `INT8_MIN`, `UINT8_MAX`   | `%d`, `%u` (자동으로 int가 됨) |
| `int16_t`, `uint16_t` | 16비트 | `INT16_MAX`, `UINT16_MAX` | `%d`, `%u`                     |
| `int32_t`, `uint32_t` | 32비트 | `INT32_MAX`, `UINT32_MAX` | `"%" PRId32`, `"%" PRIu32`     |
| `int64_t`, `uint64_t` | 64비트 | `INT64_MAX`, `UINT64_MAX` | `"%" PRId64`, `"%" PRIu64`     |

`PRId64`는 플랫폼에 맞는 서식 글자(`"lld"`나 `"ld"`)로 바뀌는 매크로입니다. `"%" PRId64`처럼 문자열을 **나란히 적으면** C가 하나로 이어 붙입니다.

### 4.3 2의 보수

컴퓨터는 음수를 **2의 보수(two's complement)** 로 저장합니다. 규칙은 "양수의 비트를 모두 뒤집고 1을 더하면 그 음수"입니다.

```text
 5 = 0000 0101
뒤집기 1111 1010
  +1  1111 1011  = -5
```

이 방식의 장점은 **덧셈 회로 하나로 뺄셈도 할 수 있다**는 것입니다. `5 + (-5)`를 비트로 더하면 `1 0000 0000`이 되고, 8비트를 넘친 맨 앞의 1은 버려져 `0000 0000`, 즉 0이 됩니다. 같은 비트 `1111 1011`을 부호 없는 수로 읽으면 251이라서 `(uint8_t)-5`가 251입니다.

### 4.4 넘침이 일어나면

| 언어   | 부호 없는 정수                                       | 부호 있는 정수                                   |
| ------ | ---------------------------------------------------- | ------------------------------------------------ |
| C      | 0부터 다시 돎(2ⁿ으로 나눈 나머지). **표준이 보장**   | **정의되지 않은 동작**. 무슨 일이든 생길 수 있음 |
| Python | (고정 크기 정수가 없음) 넘치지 않음                  | 넘치지 않음                                      |
| Rust   | 개발용 빌드: 멈춤(panic), 최적화 빌드: 0부터 다시 돎 | 같음                                             |

Rust는 넘침을 어떻게 다룰지 **직접 고르는** 메서드를 줍니다.

| 메서드                | 250u8 + 10  | 뜻                                       |
| --------------------- | ----------- | ---------------------------------------- |
| `checked_add(10)`     | `None`      | 넘치면 "결과 없음"을 알려 줌             |
| `wrapping_add(10)`    | `4`         | C의 부호 없는 정수처럼 다시 돎           |
| `saturating_add(10)`  | `255`       | 끝값에서 멈춤(음량, 밝기 같은 값에 적합) |
| `overflowing_add(10)` | `(4, true)` | 다시 돈 결과 + 넘쳤는지 여부             |

`sub`, `mul`, `pow`에도 같은 네 가지가 있습니다.

## 5. C로 구현하기

```c
// 파일: int_types.c
#include <stdio.h>
#include <limits.h>                     // INT_MAX 같은 한계값
#include <stdint.h>                     // int32_t 같은 크기가 정해진 자료형
#include <inttypes.h>                   // PRId64 같은 출력 서식

int main(void) {
    printf("%-18s %5s %21s %21s\n", "type", "bytes", "min", "max");
    printf("%-18s %5zu %21d %21d\n", "signed char", sizeof(signed char), SCHAR_MIN, SCHAR_MAX);
    printf("%-18s %5zu %21d %21d\n", "short", sizeof(short), SHRT_MIN, SHRT_MAX);
    printf("%-18s %5zu %21d %21d\n", "int", sizeof(int), INT_MIN, INT_MAX);
    printf("%-18s %5zu %21lld %21lld\n", "long long", sizeof(long long), LLONG_MIN, LLONG_MAX);
    printf("%-18s %5zu %21d %21d\n", "unsigned char", sizeof(unsigned char), 0, UCHAR_MAX);
    printf("%-18s %5zu %21d %21u\n", "unsigned int", sizeof(unsigned int), 0, UINT_MAX);
    printf("%-18s %5zu %21d %21llu\n", "unsigned long long", sizeof(unsigned long long), 0, ULLONG_MAX);

    uint8_t small = 250;
    small += 10;                        // 부호 없는 정수는 넘치면 0부터 다시 센다
    printf("uint8_t 250 + 10 = %u\n", small);
    unsigned int u = 0;
    u -= 1;
    printf("unsigned int 0 - 1 = %u\n", u);

    int32_t a = 2000000000;
    int64_t wide = (int64_t)a * 2;      // 넓은 자료형으로 바꾼 뒤 곱한다
    printf("int64_t 2000000000 * 2 = %" PRId64 "\n", wide);
    long long money = 3000000000LL;     // LL: long long 리터럴
    printf("long long 30억 = %lld\n", money);
    printf("(uint8_t)-5 = %u\n", (uint8_t)-5);
    return 0;
}
```

실행 결과:

```text
type               bytes                   min                   max
signed char            1                  -128                   127
short                  2                -32768                 32767
int                    4           -2147483648            2147483647
long long              8  -9223372036854775808   9223372036854775807
unsigned char          1                     0                   255
unsigned int           4                     0            4294967295
unsigned long long     8                     0  18446744073709551615
uint8_t 250 + 10 = 4
unsigned int 0 - 1 = 4294967295
int64_t 2000000000 * 2 = 4000000000
long long 30억 = 3000000000
(uint8_t)-5 = 251
```

`long`은 운영체제마다 결과가 달라서 표에서 뺐습니다. 직접 확인하려면 `printf("%zu\n", sizeof(long));`을 실행해 보세요. Windows에서는 4, Linux와 macOS에서는 8이 나옵니다.

### 코드 한 부분씩 읽기

| 코드                           | 설명                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#include <limits.h>`          | `INT_MAX`, `LLONG_MIN`, `UCHAR_MAX` 같은 한계값 매크로가 들어 있습니다.                                                                                              |
| `sizeof(signed char)` 와 `%zu` | `sizeof`는 자료형의 크기(바이트)를 `size_t`로 돌려줍니다. `char`는 항상 1바이트입니다. 그냥 `char`가 부호가 있는지는 플랫폼마다 달라서 `signed char`라고 적었습니다. |
| `%21lld`, `%21llu`             | `long long`은 `ll`, 부호 없는 것은 `u`를 씁니다. 서식이 자료형과 맞지 않으면 경고(오류)입니다.                                                                       |
| `small += 10;`                 | `uint8_t` 250에 10을 더하면 260인데, 8비트에 담으면서 256을 빼고 4가 됩니다. 이것은 **정의된 동작**입니다.                                                           |
| `u -= 1;`                      | 부호 없는 0에서 1을 빼면 가장 큰 값 4294967295입니다.                                                                                                                |
| `(int64_t)a * 2`               | `a * 2`를 `int32_t`로 계산하면 40억이 되어 넘칩니다(정의되지 않은 동작). 먼저 64비트로 넓힌 뒤 곱합니다. Day 6의 "나누기 전에 형변환"과 같은 원리입니다.             |
| `"%" PRId64`                   | `int64_t`를 출력하는 이식성 있는 서식입니다.                                                                                                                         |
| `3000000000LL`                 | 리터럴 뒤의 `LL`은 "이 숫자는 `long long`"이라는 표시입니다. `U`를 붙이면 부호 없음(`42u`)입니다.                                                                    |
| `(uint8_t)-5`                  | -5의 2의 보수 비트 `1111 1011`을 부호 없는 수로 읽으면 251입니다.                                                                                                    |

## 6. Python으로 구현하기

Python의 `int`는 크기가 정해져 있지 않습니다. 대신 파일 형식, 네트워크, 하드웨어처럼 **정해진 크기의 정수**를 다룰 때는 비트 연산으로 직접 흉내 냅니다.

```python
# 파일: int_range.py
import sys

print(2 ** 63 - 1, 2 ** 63, 2 ** 100)          # 크기 제한이 없다
print(sys.maxsize)                              # 목록 길이 등에 쓰는 최대 크기(64비트)
print((255).bit_length(), (256).bit_length())   # 이 값을 담는 데 필요한 비트 수


def to_uint8(n):
    return n & 0xFF                             # 아래 8비트만 남긴다(= n % 256)


def to_int8(n):
    n &= 0xFF
    return n - 256 if n >= 128 else n           # 맨 위 비트가 1이면 음수로 읽는다


print(to_uint8(250 + 10), to_uint8(-1))
print(to_int8(127 + 1), to_int8(200), to_int8(-5))
print(f"{5:08b} {-5 & 0xFF:08b}")               # 2의 보수로 본 -5
print((-1) & 0xFFFFFFFF)                         # 32비트 부호 없는 수로 본 -1
print((1000).to_bytes(2, "big"), int.from_bytes(b"\x03\xe8", "big"))
```

실행 결과:

```text
9223372036854775807 9223372036854775808 1267650600228229401496703205376
9223372036854775807
8 9
4 255
-128 -56 -5
00000101 11111011
4294967295
b'\x03\xe8' 1000
```

### 코드 한 부분씩 읽기

| 코드                         | 설명                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `2 ** 63`                    | 64비트 부호 있는 정수의 최댓값보다 1 큰 수도 그대로 계산됩니다.                                                                               |
| `sys.maxsize`                | 목록의 길이처럼 "크기"로 쓰는 값의 최댓값입니다. 64비트 시스템에서 2⁶³ − 1입니다. `int`의 최댓값이 아닙니다.                                  |
| `(255).bit_length()`         | 255를 2진수로 쓰는 데 필요한 비트 수 8입니다. 숫자에 바로 메서드를 붙이려면 괄호가 필요합니다(`255.bit_length()`는 소수점으로 읽힘).          |
| `n & 0xFF`                   | `&`는 **비트 AND**입니다. `0xFF`(= 1111 1111)와 AND하면 아래 8비트만 남습니다. `n % 256`과 같은 결과입니다.                                   |
| `n - 256 if n >= 128 else n` | 8비트의 맨 앞 비트(128)가 1이면 음수로 읽습니다. `A if 조건 else B`는 조건식입니다(Day 13).                                                   |
| `f"{-5 & 0xFF:08b}"`         | -5를 8비트 2의 보수로 본 비트입니다.                                                                                                          |
| `(1000).to_bytes(2, "big")`  | 1000을 2바이트로 바꿉니다. `"big"`은 큰 자리 바이트를 먼저 쓰는 순서입니다. `b'\x03\xe8'`은 0x03, 0xE8 두 바이트입니다(3 × 256 + 232 = 1000). |

## 7. Rust로 구현하기

Rust는 크기가 **이름에 들어 있는** 정수 자료형만 있습니다. `i`는 부호 있음, `u`는 부호 없음, 숫자는 비트 수입니다. 플랫폼에 따라 달라지는 것은 `isize`와 `usize`(포인터 크기)뿐입니다.

```rust
// 파일: int_range.rs
fn main() {
    println!("i8   {} ~ {}", i8::MIN, i8::MAX);
    println!("u8   {} ~ {}", u8::MIN, u8::MAX);
    println!("i16  {} ~ {}", i16::MIN, i16::MAX);
    println!("i32  {} ~ {}", i32::MIN, i32::MAX);
    println!("i64  {} ~ {}", i64::MIN, i64::MAX);
    println!("u64  {} ~ {}", u64::MIN, u64::MAX);
    println!("i128 최댓값 {}", i128::MAX);
    println!("usize {}바이트", std::mem::size_of::<usize>());

    let x: u8 = 250;
    println!("checked_add(10)     = {:?}", x.checked_add(10));
    println!("checked_add(5)      = {:?}", x.checked_add(5));
    println!("wrapping_add(10)    = {}", x.wrapping_add(10));
    println!("saturating_add(10)  = {}", x.saturating_add(10));
    println!("overflowing_add(10) = {:?}", x.overflowing_add(10));

    let a: i32 = 2_000_000_000;
    let wide = a as i64 * 2;
    println!("i64로 넓혀 곱하기 = {wide}");
    println!("-5i8의 비트 = {:08b}", -5i8);
    println!("0xFF를 i8로 = {}", 0xFF_u8 as i8);
}
```

실행 결과:

```text
i8   -128 ~ 127
u8   0 ~ 255
i16  -32768 ~ 32767
i32  -2147483648 ~ 2147483647
i64  -9223372036854775808 ~ 9223372036854775807
u64  0 ~ 18446744073709551615
i128 최댓값 170141183460469231731687303715884105727
usize 8바이트
checked_add(10)     = None
checked_add(5)      = Some(255)
wrapping_add(10)    = 4
saturating_add(10)  = 255
overflowing_add(10) = (4, true)
i64로 넓혀 곱하기 = 4000000000
-5i8의 비트 = 11111011
0xFF를 i8로 = -1
```

### 코드 한 부분씩 읽기

| 코드                           | 설명                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `i8::MIN`, `u64::MAX`          | 자료형마다 붙어 있는 한계값 상수입니다. C의 `limits.h`에 해당합니다.                                                       |
| `i128::MAX`                    | Rust에는 128비트 정수도 있습니다. 약 1.7 × 10³⁸까지 담습니다.                                                              |
| `std::mem::size_of::<usize>()` | 자료형의 크기(바이트)입니다. C의 `sizeof`와 같습니다. `usize`는 64비트 컴퓨터에서 8바이트입니다.                           |
| `x.checked_add(10)` → `None`   | `Option`이라는 자료형으로, 값이 있으면 `Some(값)`, 없으면 `None`입니다. 넘칠 수 있는 계산을 안전하게 할 때 씁니다(Day 25). |
| `x.overflowing_add(10)`        | `(결과, 넘쳤는지)` 튜플을 돌려줍니다.                                                                                      |
| `a as i64 * 2`                 | `as`가 `*`보다 먼저라 `(a as i64) * 2`입니다. C의 `(int64_t)a * 2`와 같습니다.                                             |
| `{:08b}`에 `-5i8`              | 음수의 2진수 형식은 2의 보수 비트를 그대로 보여 줍니다.                                                                    |
| `0xFF_u8 as i8`                | 비트 `1111 1111`을 부호 있는 8비트로 다시 읽으면 -1입니다.                                                                 |

## 8. 실행 추적

`uint8_t` 250에 10을 한 번에 더하지 않고 1씩 더한다고 생각하며 비트와 값을 따라갑니다.

| 더한 횟수 | 비트        | 부호 없는 값 | 같은 비트를 부호 있게 읽으면 |
| --------: | ----------- | -----------: | ---------------------------: |
|         0 | `1111 1010` |          250 |                           -6 |
|         5 | `1111 1111` |          255 |                           -1 |
|         6 | `0000 0000` |            0 |                            0 |
|         7 | `0000 0001` |            1 |                            1 |
|        10 | `0000 0100` |            4 |                            4 |

255에서 1을 더하면 `1 0000 0000`(9비트)이 되고, 8비트에 담을 수 없는 맨 앞의 1이 버려져 0이 됩니다. 이것이 "0부터 다시 도는" 이유입니다.

## 9. 다른 예제로 다시 이해하기

60일을 밀리초로 바꿔 봅시다. `60 × 24 × 60 × 60 × 1000 = 5,184,000,000`입니다. 32비트 정수로는 담을 수 없는 값입니다.

C에서 부호 없는 32비트로 계산하면 **정의된 방식으로** 0부터 다시 돌아 엉뚱한 값이 나오고, 64비트로 계산하면 맞는 값이 나옵니다. 부호 있는 `int`로 계산하는 것은 정의되지 않은 동작이라 여기서는 보여 주지 않습니다.

```c
// 파일: milliseconds.c
#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void) {
    uint32_t days = 60;
    uint32_t ms32 = days * 24 * 60 * 60 * 1000;          // 32비트에서 넘침
    uint64_t ms64 = (uint64_t)days * 24 * 60 * 60 * 1000; // 64비트로 넓혀서 계산
    printf("32비트: %" PRIu32 "\n", ms32);
    printf("64비트: %" PRIu64 "\n", ms64);
    printf("차이: %" PRIu64 " = 2^32\n", ms64 - ms32);
    return 0;
}
```

실행 결과:

```text
32비트: 889032704
64비트: 5184000000
차이: 4294967296 = 2^32
```

차이가 정확히 2³²(4,294,967,296)인 것은 32비트 정수가 한 바퀴 돌았다는 뜻입니다. 오류 메시지가 없어서 결과만 보면 "8억 9천만"이라는 **그럴듯한 틀린 값**입니다. 이런 넘침은 결과가 크게 이상하지 않으면 찾기가 매우 어렵습니다.

Rust로 같은 계산을 하면서 넘침을 **검사**해 봅시다.

```rust
// 파일: milliseconds.rs
fn main() {
    let days: i32 = "60".parse().unwrap();
    let seconds = days * 24 * 60 * 60;                     // 5,184,000: i32에 들어감
    println!("i32 checked_mul: {:?}", seconds.checked_mul(1000));
    println!("i32 wrapping_mul: {}", seconds.wrapping_mul(1000));
    let ms = seconds as i64 * 1000;
    println!("i64: {ms}");
}
```

실행 결과:

```text
i32 checked_mul: None
i32 wrapping_mul: 889032704
i64: 5184000000
```

`checked_mul`은 넘침을 `None`으로 알려 주고, `wrapping_mul`은 C의 부호 없는 32비트와 같은 값을 줍니다. `i32`인데도 889032704가 양수로 나온 것은, 한 바퀴 돈 결과가 우연히 양수 범위에 들어왔기 때문입니다. Python은 넘치지 않으므로 32비트 결과를 흉내 내려면 직접 잘라야 합니다.

```python
# 파일: milliseconds.py
ms = 60 * 24 * 60 * 60 * 1000
print(ms, ms & 0xFFFFFFFF, ms > 2 ** 31 - 1)
```

실행 결과:

```text
5184000000 889032704 True
```

## 10. 자료형 고르기

| 담을 값                          | C                      | Rust                          | 이유                       |
| -------------------------------- | ---------------------- | ----------------------------- | -------------------------- |
| 나이, 점수, 반복 횟수(보통)      | `int`                  | `i32`                         | 기본 정수, ±21억이면 충분  |
| 절대 음수가 아닌 개수·인덱스     | `size_t`               | `usize`                       | 배열 길이와 같은 자료형    |
| 금액(원), 밀리초 시각, 파일 크기 | `int64_t`, `long long` | `i64`                         | 21억을 쉽게 넘음           |
| 바이트, 색상(0~255)              | `uint8_t`              | `u8`                          | 1바이트 데이터             |
| 아주 큰 수(암호, 조합 수)        | 라이브러리 필요        | `i128`/`u128` 또는 라이브러리 | Python은 기본 `int`로 가능 |

"음수가 될 리 없으니 부호 없는 자료형"을 고르는 것은 주의하세요. `a - b`처럼 빼는 계산이 있으면 부호 없는 자료형이 큰 수로 돌아가는 버그를 만듭니다(Day 4, Day 6). 뺄셈이 섞이면 부호 있는 자료형이 안전합니다.

## 11. 세 언어 비교

| 관점           | C                                          | Python      | Rust                                                   |
| -------------- | ------------------------------------------ | ----------- | ------------------------------------------------------ |
| 정수 자료형    | `char`~`long long`, `unsigned`, `stdint.h` | `int` 하나  | `i8`~`i128`, `u8`~`u128`, `isize`, `usize`             |
| 크기           | 플랫폼마다 다를 수 있음(`long`)            | 제한 없음   | 이름에 적힌 대로(`isize`/`usize`만 플랫폼 크기)        |
| 한계값         | `INT_MAX` 등(`limits.h`, `stdint.h`)       | (없음)      | `i32::MAX` 등                                          |
| 부호 없는 넘침 | 0부터 다시 돎(보장)                        | (해당 없음) | 개발용 빌드에서 멈춤                                   |
| 부호 있는 넘침 | 정의되지 않은 동작                         | 넘치지 않음 | 개발용 빌드에서 멈춤                                   |
| 넘침 처리 선택 | 직접 검사                                  | 필요 없음   | `checked_`, `wrapping_`, `saturating_`, `overflowing_` |

## 12. 자주 하는 실수

### 실수 1: 상수 계산이 넘친다 (C)

```c
// 파일: const_overflow.c (컴파일 오류: integer overflow in expression)
#include <stdio.h>

int main(void) {
    long long ms = 60 * 24 * 60 * 60 * 1000;
    printf("%lld\n", ms);
    return 0;
}
```

결과를 `long long`에 담아도 **오른쪽 계산은 `int`끼리** 하므로 넘칩니다. 컴파일러가 값을 미리 계산하다 넘침을 발견해 알려 줍니다. `60LL * 24 * ...`처럼 첫 값을 넓은 자료형으로 만드세요.

### 실수 2: 서식과 자료형이 다르다 (C)

```c
// 파일: wrong_format.c (컴파일 오류: format '%d' expects argument of type 'int')
#include <stdio.h>

int main(void) {
    long long big = 3000000000LL;
    printf("%d\n", big);
    return 0;
}
```

### 실수 3: 부호 없는 수의 뺄셈 (Rust)

```rust
// 파일: unsigned_sub.rs (실행 오류: attempt to subtract with overflow)
fn main() {
    let stock: u32 = "3".parse().unwrap();
    let ordered: u32 = "5".parse().unwrap();
    println!("남은 재고 {}", stock - ordered);
}
```

재고가 모자라는 경우처럼 결과가 음수일 수 있으면 `i32`를 쓰거나, `stock.checked_sub(ordered)`로 검사합니다.

### 실수 4: 리터럴이 자료형 범위를 넘는다 (Rust)

```rust
// 파일: literal_range.rs (컴파일 오류: literal out of range for `u8`)
fn main() {
    let level: u8 = 300;
    println!("{level}");
}
```

Rust는 코드에 적은 숫자가 자료형에 들어가는지 컴파일할 때 검사합니다.

### 실수 5: long이 어디서나 64비트라고 생각한다 (C)

Linux에서 `long`으로 파일 크기를 다루던 코드가 Windows에서 2GB가 넘는 파일을 만나면 값이 깨집니다. 크기가 중요하면 `int64_t`를 쓰세요.

## 13. Q&A

**Q. 그럼 항상 가장 큰 자료형(int64_t, i64)을 쓰면 되지 않나요?**

A. 대부분의 경우 64비트를 써도 괜찮습니다. 하지만 수백만 개의 값을 배열에 담을 때는 메모리가 두 배가 되고, 파일 형식이나 통신 규약처럼 크기가 정해진 경우에는 정확한 자료형을 써야 합니다. "보통은 `int`/`i32`, 커질 수 있으면 64비트"가 좋은 기준입니다.

**Q. 왜 C는 부호 있는 정수의 넘침을 정의하지 않았나요?**

A. C가 만들어질 때는 2의 보수가 아닌 방식으로 음수를 저장하는 컴퓨터도 있었습니다. 표준이 결과를 정하지 않은 덕분에 컴파일러는 "넘치지 않는다"고 가정하고 코드를 더 빠르게 만들 수 있습니다. 대신 넘치는 코드는 예상할 수 없게 동작합니다. C23부터는 2의 보수가 표준이 되었지만, 넘침은 여전히 정의되지 않은 동작입니다.

**Q. Rust는 왜 최적화 빌드에서는 넘침을 검사하지 않나요?**

A. 모든 덧셈마다 검사를 넣으면 조금 느려지기 때문입니다. 개발하면서 테스트할 때 넘침을 찾아내고, 실제 배포할 때는 속도를 택한 것입니다. 넘침이 정말 중요한 계산에는 `checked_` 메서드를 쓰면 빌드 종류와 상관없이 검사합니다.

**Q. 실수(float, double)에도 범위가 있나요?**

A. 있습니다. `double`은 약 ±1.8 × 10³⁰⁸까지 담지만, 정밀도는 유효숫자 15~16자리입니다. 그래서 `2⁵³`보다 큰 정수는 `double`로 정확히 나타낼 수 없습니다. 넘치면 무한대(`inf`)가 됩니다. Day 11에서 Rust의 `f32`, `f64`와 함께 다룹니다.

## 14. 핵심 요약

- n비트 정수는 2ⁿ가지 값을 담습니다. 부호 없음 0 ~ 2ⁿ − 1, 부호 있음 −2ⁿ⁻¹ ~ 2ⁿ⁻¹ − 1. 32비트는 약 ±21억입니다.
- C의 정수 크기는 플랫폼마다 다를 수 있습니다. 특히 `long`은 Windows 32비트, Linux·macOS 64비트입니다. 정확한 크기는 `stdint.h`(`int32_t`, `int64_t`, `uint8_t`)를 씁니다.
- 음수는 2의 보수로 저장됩니다(비트를 뒤집고 1을 더함). 같은 비트도 자료형에 따라 다른 값으로 읽힙니다.
- 넘침: C의 부호 없는 정수는 0부터 다시 돌고, 부호 있는 정수는 정의되지 않은 동작입니다. Python은 넘치지 않습니다. Rust는 개발용 빌드에서 멈추고, `checked`·`wrapping`·`saturating`으로 동작을 고를 수 있습니다.
- 큰 계산은 **계산 전에** 넓은 자료형으로 바꿉니다(`(int64_t)a * b`, `a as i64 * b`, `60LL * ...`).

## 15. 도전 문제

1. **(C)** `int`로 1부터 n까지 곱한 팩토리얼이 몇 번째에서 넘치는지 `INT_MAX / i`와 비교하는 방법으로 찾아보세요(반복문 미리보기).
2. **(Python)** `to_int16(n)` 함수를 만들어 `to_int16(40000)`이 C의 `(int16_t)40000`과 같은 값(-25536)이 되는지 확인하세요.
3. **(Rust)** `u8` 음량 값을 `saturating_add`, `saturating_sub`로 올리고 내리는 코드를 써서, 0 아래나 255 위로 가지 않는지 확인하세요.
4. **(세 언어)** 1년을 초로 나타낸 값(365 × 24 × 60 × 60)과 1000년을 초로 나타낸 값이 각각 32비트, 64비트 정수에 들어가는지 계산해 보세요.
