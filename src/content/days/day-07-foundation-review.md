---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-07-foundation-review
courseId: crp-92
phaseId: phase-01
dayNumber: 7
date: "2026-10-07"
title: 첫 주 복습과 오류 메시지 읽기
summary: Day 1~6에서 배운 변수, 자료형, 입출력, 프로그램 구조, let과 mut, 산술 연산, 형변환을 한 프로그램(주간 용돈 요약)으로 묶어 세 언어로 다시 만들고, 오류 메시지를 읽는 방법을 정리합니다. 오류를 '언제 발견되는가(컴파일·실행)'와 '무엇이 틀렸는가(문법·이름·자료형·값)'로 나누어 Python, C, Rust의 대표 오류를 비교하고, 버그가 세 개 숨은 BMI 계산기를 한 단계씩 고쳐 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-06-conversion]
learningObjectives:
  - 입력 → 변환 → 계산 → 형식화된 출력의 흐름을 세 언어로 한 프로그램에 모은다.
  - 오류를 발견 시점(컴파일·실행)과 원인(문법·이름·자료형·값)으로 분류한다.
  - Python의 Traceback, C의 컴파일러 메시지, Rust의 오류 코드에서 위치와 원인을 찾는다.
  - 오류 없이 틀린 답을 내는 논리 오류를 실행 추적으로 찾는다.
  - 버그가 있는 프로그램을 한 번에 하나씩 고치고 매번 다시 실행해 확인한다.
concepts:
  [
    review,
    error message,
    traceback,
    compile error,
    runtime error,
    logic error,
    debugging,
    input output,
    type conversion,
    arithmetic,
  ]
runnerMode: python
playgroundSource: |
  # 파일: debug_me.py — 일부러 오류를 만들고 메시지를 읽어 보세요.
  budget = 30000
  spent = 4500 + 12000 + 3000
  print("남은 돈:", budget - spent)
  print("비율:", spent / budget * 100)
  # 아래 줄의 주석(#)을 하나씩 지우고 실행해 보세요.
  # print(budjet)            # NameError
  # print("비율: " + 65.0)   # TypeError
  # print(int("65.0"))       # ValueError
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day07-predict-py
    title: 몫·나머지와 자료형 복습 예측하기
    kind: predict
    objective: 재할당, //, %, /의 결과 자료형을 한 번에 추적한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      x = 7
      x = x // 2 + x % 2
      print(x, type(x / 1).__name__)
    answer: "4 float"
    hint: "오른쪽의 x는 아직 7입니다. 7 // 2 = 3, 7 % 2 = 1입니다. /는 정수끼리여도 실수를 돌려줍니다."
    explanation: "x는 3 + 1 = 4로 재할당됩니다. x / 1은 4.0이라 자료형 이름은 float입니다. 이 식은 '7을 2로 나눈 몫을 올림'한 것과 같습니다."
    commonMistakes:
      - "x // 2를 3.5로 생각함"
      - "x / 1의 자료형을 int로 적음"
    language: python
    verification: run
  - id: ex-day07-predict-c
    title: C 대입·나눗셈·나머지 복습 예측하기
    kind: predict
    objective: 정수 나눗셈 결과를 double에 담을 때와 복합 대입을 함께 추적한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a = 5;
          double b = a / 2;
          a += 1;
          printf("%d %.1f %d\n", a, b, a % 4);
          return 0;
      }
    answer: "6 2.0 2"
    hint: "b는 a가 5일 때 계산됩니다. 5 / 2는 정수 나눗셈입니다. 그다음 a가 6이 되고, 6 % 4를 계산합니다."
    explanation: "double에 담아도 5 / 2는 이미 2라서 b = 2.0입니다(Day 6). b는 a가 바뀌어도 다시 계산되지 않습니다(Day 1). 6 % 4 = 2입니다."
    commonMistakes:
      - "b를 2.5로 적음"
      - "a가 바뀌면 b도 3.0으로 바뀐다고 생각함"
    language: c
    verification: run
  - id: ex-day07-fill
    title: Rust 누적과 변환 빈칸 채우기
    kind: fill
    objective: mut 바인딩과 문자열 → 정수 변환을 함께 쓴다.
    prompt: "빈칸 두 곳을 채워 '25'가 출력되게 하세요."
    starter: |-
      fn main() {
          let _____ total = 10;
          let text = " 15\n";
          total += text.trim()._____().unwrap();
          println!("{total}");
      }
    answer: |-
      fn main() {
          let mut total = 10;
          let text = " 15\n";
          total += text.trim().parse::<i32>().unwrap();
          println!("{total}");
      }
    output: "25"
    hint: "값을 바꾸려면 mut, 문자열을 숫자로 바꾸려면 parse입니다. 어떤 자료형으로 바꿀지 ::<i32>로 알려 줄 수 있습니다."
    explanation: "trim()으로 앞뒤 공백과 줄바꿈을 없앤 뒤 parse합니다. total이 i32이므로 parse만 써도 컴파일러가 자료형을 추론할 수 있지만, ::<i32>로 적으면 읽는 사람에게도 분명합니다."
    commonMistakes:
      - "trim을 빼서 실행 중 InvalidDigit 오류가 남"
      - "mut 없이 += 를 써서 E0384 오류가 남"
    language: rust
    verification: run
  - id: ex-day07-modify
    title: 부가세를 포함한 합계로 바꾸기
    kind: modify
    objective: 돈 계산을 실수 오차 없이 정수로 한다.
    prompt: "4500원짜리 음료 3잔에 부가세 10%를 더한 합계를 '합계 14850원'으로 출력하세요. 실수를 쓰지 말고 정수 연산만 쓰세요."
    starter: |-
      price = 4500
      qty = 3
      print(f"합계 {price * qty}원")
    answer: |-
      price = 4500
      qty = 3
      subtotal = price * qty
      tax = subtotal * 10 // 100
      print(f"합계 {subtotal + tax}원")
    output: "합계 14850원"
    hint: "10%는 '곱하기 10, 나누기 100'입니다. 곱셈을 먼저 해야 소수점이 버려지지 않습니다(Day 6)."
    explanation: "subtotal * 1.1로 계산하면 14850.000000000002처럼 실수 오차가 붙습니다. 돈은 원 단위 정수로 계산하는 것이 안전합니다."
    commonMistakes:
      - "subtotal * (10 // 100)으로 써서 세금이 0이 됨"
      - "subtotal * 1.1을 그대로 출력해 소수점이 붙음"
    language: python
    verification: run
  - id: ex-day07-debug
    title: C 시간 변환 논리 오류 고치기
    kind: debug
    objective: 오류 메시지 없이 틀린 답을 내는 논리 오류를 찾는다.
    prompt: "135분을 '2시간 15분'으로 출력하려 했는데 '15시간 2분'이 출력됩니다. 고치세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int minutes = 135;
          printf("%d시간 %d분\n", minutes % 60, minutes / 60);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int minutes = 135;
          printf("%d시간 %d분\n", minutes / 60, minutes % 60);
          return 0;
      }
    output: "2시간 15분"
    starterOutput: "15시간 2분"
    hint: "시간은 60분이 몇 번 들어가는지(몫), 남는 분은 나머지입니다. 서식 문자의 순서와 값의 순서를 비교하세요."
    explanation: "컴파일러는 두 값이 모두 int라서 아무 문제도 찾지 못합니다. 이런 논리 오류는 작은 입력(예: 135분)으로 손 계산한 답과 실행 결과를 비교해야 찾을 수 있습니다."
    commonMistakes:
      - "서식 문자열의 '시간'과 '분'만 바꿔 '15분 2시간'을 만듦"
      - "나눗셈 대신 minutes - 60을 씀"
    language: c
    verification: run
  - id: ex-day07-independent
    title: Rust 주문 한 줄 처리하기
    kind: independent
    objective: 한 줄 입력을 나누고 변환해 계산한 뒤 형식화해 출력한다.
    prompt: 'line = "3 4500"은 ''수량 가격''입니다. 합계와 10% 할인 후 금액을 정수로 계산해 ''합계 13500원, 할인 후 12150원''을 출력하세요.'
    starter: |-
      fn main() {
          let line = "3 4500";
          println!("{line}");
      }
    answer: |-
      fn main() {
          let line = "3 4500";
          let mut parts = line.split_whitespace();
          let qty: i32 = parts.next().unwrap().parse().unwrap();
          let price: i32 = parts.next().unwrap().parse().unwrap();
          let total = qty * price;
          let discounted = total - total * 10 / 100;
          println!("합계 {total}원, 할인 후 {discounted}원");
      }
    output: "합계 13500원, 할인 후 12150원"
    hint: "split_whitespace로 조각을 꺼내 parse하고, 할인액은 total * 10 / 100으로 곱셈을 먼저 합니다."
    explanation: "Day 2의 입력 나누기, Day 5의 연산 순서, Day 6의 정수 계산 요령을 모두 쓴 문제입니다. total * 90 / 100으로 한 번에 계산해도 같은 결과입니다."
    commonMistakes:
      - "total * (10 / 100)으로 써서 할인액이 0이 됨"
      - "parse의 자료형을 적지 않아 추론 오류가 남"
    language: rust
    verification: run
quiz:
  - id: quiz-day07-01
    question: 다음 중 실행하기 전(컴파일·번역 단계)에 발견되는 오류는?
    choices:
      - Python의 ZeroDivisionError
      - Python의 IndentationError
      - Rust의 parse().unwrap() 실패
      - Python의 ValueError
    answerIndex: 1
    explanation: 들여쓰기와 괄호 짝 같은 문법 오류는 Python이 코드를 읽어 들일 때 발견해서 어떤 줄도 실행되지 않습니다. 나머지는 해당 줄이 실행될 때 값 때문에 생기는 실행 오류입니다.
  - id: quiz-day07-02
    question: Python Traceback에서 가장 먼저 읽어야 할 곳은?
    choices:
      - 첫 줄의 'Traceback (most recent call last)'
      - 마지막 줄의 오류 이름과 설명
      - 가운데의 파일 경로
      - 읽을 필요 없이 코드를 처음부터 다시 쓴다
    answerIndex: 1
    explanation: 마지막 줄에 오류의 종류(NameError 등)와 설명이 있고, 바로 위 줄들이 오류가 난 줄과 위치를 보여 줍니다. 'most recent call last'는 '가장 최근 호출이 마지막에 나온다'는 뜻입니다.
  - id: quiz-day07-03
    question: 오류 메시지가 없는데 결과가 틀린 오류를 무엇이라고 하나요?
    choices: [문법 오류, 컴파일 오류, 논리 오류, 링크 오류]
    answerIndex: 2
    explanation: 프로그램이 규칙에는 맞지만 의도와 다르게 동작하는 오류입니다. 손으로 계산한 기대값과 실제 출력을 비교하거나, 중간값을 출력해 찾습니다.
  - id: quiz-day07-04
    question: Rust의 E0308 오류는 무엇을 뜻하나요?
    choices:
      - 변수 이름을 찾을 수 없음
      - 자료형이 맞지 않음(mismatched types)
      - 불변 변수에 두 번 대입함
      - 0으로 나눔
    answerIndex: 1
    explanation: "E0308은 기대한 자료형과 실제 자료형이 다를 때 납니다. 이름을 찾을 수 없음은 E0425, 불변 변수 재대입은 E0384입니다. rustc --explain E0308로 자세한 설명을 볼 수 있습니다."
  - id: quiz-day07-05
    question: 버그가 여러 개인 프로그램을 고치는 가장 좋은 방법은?
    choices:
      - 모든 줄을 한 번에 고친 뒤 실행한다
      - 오류 메시지 하나를 읽고 한 곳을 고친 뒤 다시 실행하기를 반복한다
      - 오류가 난 줄을 지운다
      - 경고 옵션을 끈다
    answerIndex: 1
    explanation: 한 번에 여러 곳을 고치면 무엇이 문제를 해결했는지(또는 새 문제를 만들었는지) 알 수 없습니다. 첫 번째 오류가 뒤의 오류들을 일으키는 경우도 많아서, 위에서부터 하나씩 고치는 것이 빠릅니다.
---

## 1. 오늘 배울 내용

첫 주에 배운 것을 **하나의 프로그램**으로 묶어 보고, 앞으로 매일 만날 **오류 메시지**를 읽는 방법을 정리합니다.

1. Day 1~6 핵심을 표 한 장으로 다시 봅니다.
2. **주간 용돈 요약** 프로그램을 세 언어로 만듭니다.
   - 입력을 받아 정수로 바꿉니다.
   - 합계, 비율, 평균을 계산합니다.
   - 자리를 맞춰 출력합니다.
3. 오류를 두 기준으로 분류합니다.
   - **언제** 발견되는가: 컴파일할 때, 실행할 때, 발견되지 않음
   - **무엇이** 틀렸는가: 문법, 이름, 자료형, 값, 논리
4. 세 언어의 오류 메시지에서 **위치와 원인**을 찾는 법을 익힙니다.
5. 버그가 세 개 숨은 **BMI 계산기**를 한 단계씩 고쳐 봅니다.

## 2. 왜 필요한가

프로그래밍을 배우는 시간의 절반 이상은 오류를 고치는 데 씁니다. 처음에는 빨간 메시지가 "무섭고 긴 글"로 보이지만, 메시지에는 **어디서, 무엇이** 잘못되었는지가 정해진 형식으로 들어 있습니다. 형식을 알면 대부분의 오류를 몇 초 안에 고칠 수 있습니다.

또 첫 주에 배운 문법들은 따로 떨어진 지식이 아니라 **입력 → 변환 → 계산 → 출력**이라는 하나의 흐름 안에서 함께 쓰입니다. 한 프로그램으로 묶어 보면 각 문법이 어디에 쓰이는지가 분명해집니다.

## 3. 그림으로 이해하기

첫 주에 배운 것들이 프로그램의 흐름 어디에 쓰이는지 그려 봅시다.

```text
 표준 입력          변환                 계산                    출력
"30000\n"  ──▶  int(), scanf %d   ──▶  + - * / // %     ──▶  f-string, printf,
"4500 ..."      trim().parse()          (Day 5)                println!
 (Day 2)        split() (Day 2, 6)      형변환 (Day 6)          서식·자리 맞춤 (Day 3)
                     │                       │
                     ▼                       ▼
                 변수에 저장 (Day 1)     상수 DAYS, mut (Day 4)
```

오류는 이 흐름의 어느 단계에서든 생길 수 있고, 언어마다 **발견되는 시점**이 다릅니다.

```text
          코드를 쓴다 ──▶ 컴파일/번역 ──▶ 실행 ──▶ 결과를 사람이 확인
오류 종류:                문법 오류        값 오류      논리 오류
                          C·Rust: 자료형   (0 나누기,   (틀린 답)
                          이름 오류         변환 실패)
                          Python: 문법만
```

Python은 문법 오류만 실행 전에 알려 주고, 이름이나 자료형 오류는 **그 줄이 실행될 때** 알려 줍니다. C와 Rust는 이름과 자료형 오류도 컴파일할 때 잡습니다. 논리 오류는 어느 언어도 대신 찾아 주지 않습니다.

## 4. 천천히 풀어보기

### 4.1 첫 주 핵심 정리

| Day | 주제          | 꼭 기억할 것                                                                            |
| --: | ------------- | --------------------------------------------------------------------------------------- |
|   1 | 변수와 자료형 | `=`는 오른쪽을 계산해 왼쪽에 대입. `"30"`과 `30`은 다르다.                              |
|   2 | 입력과 출력   | 입력은 항상 문자열. `int()`, `scanf("%d", &x)`, `trim().parse()`로 바꾼다.              |
|   3 | 프로그램 구조 | C: `#include`, `main`, `;`, `return 0`. 서식 `%d %f %s %%`.                             |
|   4 | let과 mut     | Rust는 기본 불변, 바꾸려면 `mut`. 상수는 `const`. 교환은 임시 변수 또는 여러 값 대입.   |
|   5 | 산술 연산     | 곱셈·나눗셈이 먼저, 같은 순위는 왼쪽부터. 음수 몫은 Python만 내림.                      |
|   6 | 형변환        | 형변환은 **나누기 전에**. `(double)a / b` ≠ `(double)(a / b)`. `as u8`은 조용히 잘린다. |

### 4.2 오류 메시지 읽는 법

**Python**의 Traceback은 **아래에서 위로** 읽습니다.

```text
Traceback (most recent call last):          ← "가장 최근 호출이 마지막"이라는 안내
  File "bmi.py", line 3, in <module>        ← ② 파일 이름과 줄 번호
    height_m = height_cm / 100              ← ② 문제가 된 코드
               ~~~~~~~~~~^~~~~              ← ② 문제가 된 연산 위치
TypeError: unsupported operand type(s) for /: 'str' and 'int'   ← ① 오류 종류와 설명
```

**C** 컴파일러(gcc)는 `파일:줄:칸: 종류: 설명` 형식입니다.

```text
bmi.c:5:17: error: 'weight' undeclared (first use in this function)
│     │ │   │      └ 설명: weight라는 이름이 선언되지 않았다
│     │ │   └ 종류: error(컴파일 실패) 또는 warning(경고)
│     │ └ 칸 번호
│     └ 줄 번호
└ 파일 이름
```

**Rust** 컴파일러는 오류 코드와 함께 코드 조각에 밑줄을 긋고, 고치는 방법(`help:`)까지 알려 줍니다.

```text
error[E0384]: cannot assign twice to immutable variable `total`
 --> bmi.rs:3:5                                  ← 파일:줄:칸
  |
2 |     let total = 0;
  |         ----- first assignment to `total`
3 |     total += 10;
  |     ^^^^^^^^^^^ cannot assign twice to immutable variable
help: consider making this binding mutable
  |
2 |     let mut total = 0;                        ← 고치는 방법 제안
```

`rustc --explain E0384`를 실행하면 그 오류 코드의 설명과 예제를 볼 수 있습니다.

### 4.3 대표 오류 한눈에 보기

| 원인                 | Python (실행할 때)           | C (컴파일할 때)                        | Rust (컴파일할 때)                    |
| -------------------- | ---------------------------- | -------------------------------------- | ------------------------------------- |
| 괄호·기호 빠짐       | `SyntaxError` (실행 전)      | `expected ';'`                         | `expected ';'`                        |
| 들여쓰기             | `IndentationError` (실행 전) | (영향 없음)                            | (영향 없음)                           |
| 없는 이름(오타)      | `NameError`                  | `'x' undeclared`                       | `E0425 cannot find value`             |
| 자료형이 안 맞음     | `TypeError`                  | 경고 `format '%d' expects...` 등       | `E0308 mismatched types`, `E0277`     |
| 바꿀 수 없는 값 변경 | (해당 없음)                  | `assignment of read-only variable`     | `E0384`                               |
| 변환 실패            | `ValueError`                 | `scanf` 반환값으로 확인                | `parse()`가 `Err` → `unwrap`에서 멈춤 |
| 0으로 나누기         | `ZeroDivisionError`          | 정의되지 않은 동작(발견 안 될 수 있음) | 실행 중 `attempt to divide by zero`   |
| 틀린 계산(논리)      | 발견 안 됨                   | 발견 안 됨                             | 발견 안 됨                            |

### 4.4 디버깅 순서

1. **첫 번째 오류부터** 읽습니다. 뒤의 오류들은 첫 오류 때문에 생긴 것일 때가 많습니다.
2. 줄 번호의 코드와 **바로 앞줄**을 봅니다(세미콜론, 괄호).
3. **한 곳만** 고치고 다시 실행합니다.
4. 오류가 없는데 답이 틀리면, 작은 입력으로 **손 계산**한 값과 비교하고, 중간값을 출력해 봅니다.

## 5. C로 구현하기

주간 용돈과 지출 세 건을 입력받아 요약합니다. `%7d`의 `7`은 "7칸에 오른쪽 정렬"이라는 뜻입니다(Day 9에서 자세히 배웁니다).

```c
// 파일: allowance.c
#include <stdio.h>

#define DAYS 7

int main(void) {
    int budget, a, b, c;
    printf("이번 주 용돈: ");
    if (scanf("%d", &budget) != 1) return 1;
    printf("지출 세 건: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3) return 1;
    printf("\n");

    int spent = a + b + c;
    int remaining = budget - spent;
    double ratio = (double)spent / budget * 100;   // 나누기 전에 double로
    double daily = (double)spent / DAYS;

    printf("총지출    %7d원\n", spent);
    printf("남은 돈   %7d원\n", remaining);
    printf("지출 비율 %7.1f%%\n", ratio);
    printf("하루 평균 %7.2f원\n", daily);
    printf("하루 평균(정수) %d원, 나머지 %d원\n", spent / DAYS, spent % DAYS);
    return 0;
}
```

입력:

```text
30000
4500 12000 3000
```

실행 결과:

```text
이번 주 용돈: 지출 세 건:
총지출      19500원
남은 돈     10500원
지출 비율    65.0%
하루 평균 2785.71원
하루 평균(정수) 2785원, 나머지 5원
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명(복습한 Day)                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `#define DAYS 7`                           | 전처리기 상수입니다(Day 4).                                                    |
| `if (scanf("%d", &budget) != 1) return 1;` | 입력 실패를 확인하고 종료 코드 1로 끝냅니다(Day 2, Day 3).                     |
| `scanf("%d %d %d", &a, &b, &c) != 3`       | 세 값을 모두 읽었는지 확인합니다.                                              |
| `(double)spent / budget * 100`             | 나누기 **전에** 실수로 바꿉니다. `spent / budget * 100`이면 0이 됩니다(Day 6). |
| `%7.1f%%`                                  | 7칸에 소수점 한 자리, 그리고 퍼센트 기호입니다(Day 3).                         |
| `spent / DAYS`, `spent % DAYS`             | 정수 몫과 나머지입니다. 2785 × 7 + 5 = 19500으로 확인할 수 있습니다(Day 5).    |

## 6. Python으로 구현하기

```python
# 파일: allowance.py
DAYS = 7                                    # 한 주는 7일(상수)

budget = int(input("이번 주 용돈: "))
spent_text = input("지출 세 건: ")
a_text, b_text, c_text = spent_text.split()
spent = int(a_text) + int(b_text) + int(c_text)
print()

remaining = budget - spent
ratio = spent / budget * 100                # /는 항상 실수
daily = spent / DAYS

print(f"총지출    {spent:>7}원")
print(f"남은 돈   {remaining:>7}원")
print(f"지출 비율 {ratio:>7.1f}%")
print(f"하루 평균 {daily:>7.2f}원")
print(f"하루 평균(정수) {spent // DAYS}원, 나머지 {spent % DAYS}원")
```

입력:

```text
30000
4500 12000 3000
```

실행 결과:

```text
이번 주 용돈: 지출 세 건:
총지출      19500원
남은 돈     10500원
지출 비율    65.0%
하루 평균 2785.71원
하루 평균(정수) 2785원, 나머지 5원
```

### 코드 한 부분씩 읽기

| 코드                                          | 설명(복습한 Day)                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `DAYS = 7`                                    | 대문자 상수 관례입니다(Day 4).                                                                  |
| `int(input(...))`                             | 입력 문자열을 바로 정수로 바꿉니다(Day 2).                                                      |
| `a_text, b_text, c_text = spent_text.split()` | 세 조각으로 나눕니다. 조각 수가 다르면 ValueError입니다.                                        |
| `spent / budget * 100`                        | Python의 `/`는 실수라 C와 달리 형변환이 필요 없습니다(Day 5).                                   |
| `{spent:>7}`                                  | `>`는 오른쪽 정렬, `7`은 칸 수입니다. `{ratio:>7.1f}`는 오른쪽 정렬 7칸에 소수점 한 자리입니다. |
| `spent // DAYS`, `spent % DAYS`               | 정수 몫과 나머지입니다.                                                                         |

## 7. Rust로 구현하기

입력을 두 번 받으므로, 안내 문구 출력부터 한 줄 읽기까지를 `read_line`이라는 작은 **함수**로 묶었습니다. 함수는 Day 20과 Day 22에서 배우니, 지금은 "같은 일을 이름 하나로 부른다"고 이해하면 충분합니다.

```rust
// 파일: allowance.rs
use std::io::{self, Write};

const DAYS: i32 = 7;

fn read_line(prompt: &str) -> String {
    print!("{prompt}");
    io::stdout().flush().unwrap();
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    line
}

fn main() {
    let budget: i32 = read_line("이번 주 용돈: ").trim().parse().unwrap();
    let line = read_line("지출 세 건: ");
    let mut parts = line.split_whitespace();
    let a: i32 = parts.next().unwrap().parse().unwrap();
    let b: i32 = parts.next().unwrap().parse().unwrap();
    let c: i32 = parts.next().unwrap().parse().unwrap();
    println!();

    let spent = a + b + c;
    let remaining = budget - spent;
    let ratio = spent as f64 / budget as f64 * 100.0;
    let daily = spent as f64 / DAYS as f64;

    println!("총지출    {spent:>7}원");
    println!("남은 돈   {remaining:>7}원");
    println!("지출 비율 {ratio:>7.1}%");
    println!("하루 평균 {daily:>7.2}원");
    println!("하루 평균(정수) {}원, 나머지 {}원", spent / DAYS, spent % DAYS);
}
```

입력:

```text
30000
4500 12000 3000
```

실행 결과:

```text
이번 주 용돈: 지출 세 건:
총지출      19500원
남은 돈     10500원
지출 비율    65.0%
하루 평균 2785.71원
하루 평균(정수) 2785원, 나머지 5원
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명(복습한 Day)                                                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `const DAYS: i32 = 7;`                         | 자료형을 적은 상수입니다(Day 4).                                                                                                         |
| `fn read_line(prompt: &str) -> String { ... }` | 안내 문구를 받아 출력하고, 읽은 한 줄을 `String`으로 돌려주는 함수입니다. 마지막 줄 `line`에 세미콜론이 없어 그 값이 돌려집니다(Day 22). |
| `read_line(...).trim().parse().unwrap()`       | 읽기 → 줄바꿈 제거 → 정수 변환을 한 줄로 이었습니다(Day 2).                                                                              |
| `spent as f64 / budget as f64 * 100.0`         | Rust는 양쪽 모두 `f64`로 바꿔야 합니다(Day 6).                                                                                           |
| `{spent:>7}`, `{ratio:>7.1}`                   | Python과 같은 정렬 문법입니다. 실수 자릿수는 `.1f`가 아니라 `.1`입니다.                                                                  |

세 언어의 출력이 **글자 하나까지 똑같습니다**. 같은 입력과 같은 계산 규칙이면 언어가 달라도 같은 결과가 나와야 합니다. 이 과정의 마지막 프로젝트(Day 83~92)도 이렇게 세 구현의 결과를 비교합니다.

## 8. 실행 추적

입력 `30000`과 `4500 12000 3000`으로 값이 어떻게 바뀌는지 따라갑니다(세 언어 공통).

| 단계 | 계산                          | 값             | 자료형 |
| ---: | ----------------------------- | -------------- | ------ |
|    1 | `budget`                      | 30000          | 정수   |
|    2 | `spent = 4500 + 12000 + 3000` | 19500          | 정수   |
|    3 | `remaining = 30000 - 19500`   | 10500          | 정수   |
|    4 | `ratio = 19500 / 30000 × 100` | 65.0           | 실수   |
|    5 | `daily = 19500 / 7`           | 2785.714285... | 실수   |
|    6 | `19500 // 7`, `19500 % 7`     | 2785, 5        | 정수   |

5단계의 실수는 출력할 때 `.2`로 2785.71까지만 보입니다. 값 자체는 그대로입니다.

## 9. 다른 예제로 다시 이해하기

키(cm)와 몸무게(kg)로 BMI(몸무게 ÷ 키(m)²)를 계산하는 프로그램에 **버그 세 개**가 숨어 있습니다. 한 번에 하나씩 고쳐 봅시다. 입력 대신 문자열 변수로 값을 넣었습니다.

**1단계: 실행하자마자 멈춘다.**

```python
# 파일: bmi_step1.py (실행 오류: TypeError)
height_cm = "172"         # input()으로 받은 값
weight_kg = "65.5"
height_m = height_cm / 100
bmi = weight_kg / height_m * height_m
print(f"BMI = {bmi:.1f}")
```

```text
TypeError: unsupported operand type(s) for /: 'str' and 'int'
```

마지막 줄을 읽으면 "문자열과 정수를 `/`할 수 없다"는 뜻입니다. `height_cm`이 문자열이기 때문입니다. `int(height_cm)`으로 바꿉니다.

**2단계: 다시 실행하니 또 멈춘다.**

```python
# 파일: bmi_step2.py (실행 오류: TypeError)
height_cm = "172"
weight_kg = "65.5"
height_m = int(height_cm) / 100
bmi = weight_kg / height_m * height_m
print(f"BMI = {bmi:.1f}")
```

이번에는 `weight_kg`가 문자열입니다. 첫 오류를 고치자 **숨어 있던 다음 오류**가 드러났습니다. `65.5`는 소수점이 있으니 `int`가 아니라 `float`로 바꿔야 합니다.

**3단계: 오류는 없는데 답이 이상하다.**

```python
# 파일: bmi_step3.py
height_cm = "172"
weight_kg = "65.5"
height_m = int(height_cm) / 100
bmi = float(weight_kg) / height_m * height_m
print(f"BMI = {bmi:.1f}")
```

실행 결과:

```text
BMI = 65.5
```

BMI가 몸무게와 같습니다. **논리 오류**입니다. `/`와 `*`는 같은 순위라 왼쪽부터 계산되므로 `(65.5 / 1.72) * 1.72 = 65.5`가 되었습니다. 키의 제곱으로 나누려면 괄호나 `**`가 필요합니다.

**4단계: 완성.**

```python
# 파일: bmi.py
height_cm = "172"
weight_kg = "65.5"
height_m = int(height_cm) / 100
bmi = float(weight_kg) / height_m ** 2
print(f"키 {height_m}m, 몸무게 {weight_kg}kg")
print(f"BMI = {bmi:.1f}")
```

실행 결과:

```text
키 1.72m, 몸무게 65.5kg
BMI = 22.1
```

손 계산으로 확인해 봅시다. 1.72² = 2.9584, 65.5 ÷ 2.9584 ≈ 22.14이니 맞습니다. 같은 프로그램을 Rust로 쓰면 1·2단계의 오류는 **컴파일할 때** 잡히고(문자열을 나눌 수 없음), 3단계의 논리 오류만 남습니다.

```rust
// 파일: bmi.rs
fn main() {
    let height_cm: f64 = "172".parse().unwrap();
    let weight_kg: f64 = "65.5".parse().unwrap();
    let height_m = height_cm / 100.0;
    let bmi = weight_kg / height_m.powi(2);
    println!("BMI = {bmi:.1}");
}
```

실행 결과:

```text
BMI = 22.1
```

`powi(2)`는 실수를 정수 지수로 거듭제곱하는 메서드입니다.

## 10. 오류 메시지 모음

자주 만나는 오류 몇 가지를 직접 확인해 봅시다. 각 블록은 **일부러 틀린 코드**입니다.

```python
# 파일: name_error.py (실행 오류: NameError)
budget = 30000
print(budjet)
```

```text
NameError: name 'budjet' is not defined. Did you mean: 'budget'?
```

Python 3.10부터는 비슷한 이름을 추천해 줍니다.

```python
# 파일: syntax_error.py (컴파일 오류: SyntaxError)
print("남은 돈:", 10500
```

```text
SyntaxError: '(' was never closed
```

```c
// 파일: undeclared.c (컴파일 오류: undeclared)
#include <stdio.h>

int main(void) {
    int budget = 30000;
    printf("%d\n", budjet);
    return 0;
}
```

gcc도 `did you mean 'budget'?`이라고 알려 줍니다.

```rust
// 파일: not_found.rs (컴파일 오류: E0425)
fn main() {
    let budget = 30000;
    println!("{}", budjet);
}
```

## 11. 세 언어 비교

| 관점                    | Python                     | C                                   | Rust                                 |
| ----------------------- | -------------------------- | ----------------------------------- | ------------------------------------ |
| 실행 전에 잡는 오류     | 문법, 들여쓰기             | 문법, 이름, 많은 자료형 오류(+경고) | 문법, 이름, 자료형, 불변성, 초기화   |
| 실행 중에 드러나는 오류 | 이름, 자료형, 값, 0 나누기 | (많은 경우 정의되지 않은 동작)      | 변환 실패의 `unwrap`, 0 나누기, 넘침 |
| 메시지 형식             | Traceback(아래부터 읽기)   | `파일:줄:칸: error:`                | `error[코드]` + 밑줄 + `help:`       |
| 이름 오타 추천          | 있음(3.10+)                | 있음                                | 있음                                 |
| 추가 설명 보기          | 오류 이름으로 검색         | 메시지로 검색                       | `rustc --explain E0000`              |

## 12. 자주 하는 실수

### 실수 1: 첫 오류가 아니라 마지막 오류부터 고친다 (C, Rust)

C와 Rust는 오류를 여러 개 한꺼번에 보여 줍니다. 세미콜론 하나가 빠지면 뒤의 줄들까지 이상하게 해석되어 오류가 줄줄이 나옵니다. **맨 위의 오류 하나**만 고치고 다시 컴파일하세요.

### 실수 2: 경고를 무시한다 (C)

```c
// 파일: ignore_warning.c (컴파일 오류: format '%d' expects argument of type 'int')
#include <stdio.h>

int main(void) {
    double ratio = 65.0;
    printf("비율: %d%%\n", ratio);
    return 0;
}
```

경고를 끄고 실행하면 쓰레기 값이 출력됩니다. 이 과정은 모든 경고를 오류로 다룹니다(`-Werror`).

### 실수 3: 오류 메시지를 읽지 않고 코드를 이리저리 바꾼다

오류가 날 때마다 따옴표를 지웠다 붙였다 하면 새 오류가 생깁니다. 메시지의 **오류 이름**과 **설명**을 먼저 읽고, 무엇을 바꿀지 정한 뒤 한 곳만 고치세요.

### 실수 4: 오류가 사라지면 끝났다고 생각한다

9절의 3단계처럼 오류가 없어도 답이 틀릴 수 있습니다. **작은 입력으로 손 계산한 답**과 실행 결과를 비교하는 습관을 들이세요.

### 실수 5: 실행 오류를 일으키는 입력을 시험하지 않는다

용돈이 0이면 지출 비율 계산에서 0으로 나누게 됩니다. 정상 입력뿐 아니라 0, 음수, 숫자가 아닌 글자를 넣어 보고 프로그램이 어떻게 반응하는지 확인하세요. 조건문(Day 13)을 배우면 이런 입력을 미리 걸러 낼 수 있습니다.

## 13. Q&A

**Q. Python은 왜 이름 오타를 실행 전에 알려 주지 않나요?**

A. Python은 실행하면서 이름을 찾기 때문에, 그 줄에 도달하기 전에는 이름이 있는지 확인하지 않습니다. 그래서 거의 실행되지 않는 줄(드문 조건의 분기)에 있는 오타는 한참 뒤에야 발견될 수 있습니다. `pyflakes`, `mypy` 같은 **정적 분석 도구**를 쓰면 실행 전에 찾을 수 있습니다.

**Q. 오류 메시지가 영어라 어렵습니다.**

A. 자주 나오는 단어는 몇 개 되지 않습니다. expected(~가 있어야 함), undeclared/not defined(선언되지 않음), mismatched(맞지 않음), immutable(바꿀 수 없음), unsupported operand(지원하지 않는 피연산자), invalid literal(잘못된 값의 표현), overflow(넘침). 이 단어들만 알아도 대부분의 메시지를 이해할 수 있습니다.

**Q. 경고(warning)는 무시해도 되나요?**

A. 경고는 "문법은 맞지만 아마 실수일 것"이라는 뜻입니다. 이 과정에서 본 경고들(서식 불일치, 부호 섞인 비교, 쓰지 않는 변수)은 대부분 실제 버그로 이어집니다. 경고가 0개가 되도록 고치는 습관을 들이세요.

**Q. print로 중간값을 찍는 것 말고 다른 디버깅 방법이 있나요?**

A. **디버거**를 쓰면 프로그램을 한 줄씩 실행하며 변수 값을 볼 수 있습니다. Python은 `breakpoint()`를 넣으면 그 줄에서 멈추고, C는 `gdb`, Rust는 `rust-gdb`나 편집기의 디버거를 씁니다. 입문 단계에서는 print로 충분하고, 프로그램이 커지면 디버거가 훨씬 편해집니다.

## 14. 핵심 요약

- 첫 주의 문법은 **입력 → 변환 → 계산 → 출력**이라는 한 흐름에서 함께 쓰입니다. 같은 입력과 규칙이면 세 언어의 출력이 같아야 합니다.
- 오류는 **언제**(컴파일·실행·발견 안 됨)와 **무엇**(문법·이름·자료형·값·논리)으로 나눕니다. C와 Rust는 이름과 자료형 오류를 실행 전에 잡고, Python은 문법 오류만 실행 전에 잡습니다.
- Python Traceback은 **마지막 줄부터**, C는 `파일:줄:칸: error:`, Rust는 `error[코드]`와 `help:`를 읽습니다.
- 첫 번째 오류부터, 한 번에 한 곳만 고치고, 매번 다시 실행합니다.
- 논리 오류는 손 계산한 기대값과 비교해 찾습니다. 경고는 무시하지 않습니다.

## 15. 도전 문제

1. **(Python)** 9절의 BMI 프로그램에 `input()`을 붙여 실제로 키와 몸무게를 입력받게 바꾸세요. 숫자가 아닌 글자를 넣으면 어떤 오류가 나는지 확인하세요.
2. **(C)** 5절의 용돈 프로그램에 지출 건수를 네 건으로 늘리고, 가장 큰 지출이 전체의 몇 %인지도 출력하세요(가장 큰 값은 일단 직접 골라서 넣으세요. 비교는 Day 12에서 배웁니다).
3. **(Rust)** 7절의 프로그램에서 `parse().unwrap()`에 숫자가 아닌 입력이 들어가면 어떤 메시지가 나오는지 확인하고, 메시지에서 `ParseIntError`의 종류를 찾아보세요.
4. **(세 언어)** 일부러 오류 다섯 가지(이름 오타, 세미콜론 누락, 자료형 불일치, 0으로 나누기, 논리 오류)를 만들어 보고, 각 언어가 언제·어떻게 알려 주는지 표로 정리해 보세요.
