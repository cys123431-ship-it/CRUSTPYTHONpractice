---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-14-branch-review
courseId: crp-92
phaseId: phase-02
dayNumber: 14
date: "2026-10-14"
title: 분기 복습과 switch·match — 값에 따라 갈래 나누기
summary: 하나의 값이 어떤 경우인지에 따라 갈래를 나누는 C의 switch, Python의 match, Rust의 match를 배우고, if 사다리와 언제 무엇을 쓸지 비교합니다. C switch의 case·break·default와 break를 빠뜨렸을 때 아래 case로 이어지는 fall-through, 여러 값을 한 갈래로 묶는 방법(case 나열, |)을 익힙니다. 달의 일수와 날짜 유효성 검사, 다음 날 계산으로 Day 8·12·13에서 배운 논리 연산·경계·조건 순서를 함께 복습합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-13-if-branch]
learningObjectives:
  - C의 switch에서 case, break, default의 역할을 설명하고 값에 따라 갈래를 나눈다.
  - break를 빠뜨렸을 때의 fall-through를 추적하고, 의도한 fall-through와 버그를 구별한다.
  - 여러 값을 한 갈래로 묶는 방법을 세 언어로 쓴다(case 나열, Python과 Rust의 |).
  - switch·match와 if 사다리 중 알맞은 것을 고른다.
  - 달의 일수와 날짜 검사를 경계값(0, 1, 28~31, 32, 13월)으로 시험한다.
concepts:
  [
    switch,
    case,
    break,
    default,
    fall through,
    match,
    pattern,
    wildcard,
    branch review,
    date validation,
  ]
runnerMode: python
playgroundSource: |
  # 파일: month.py — 달과 해를 바꿔 가며 일수를 확인해 보세요.
  def days_in_month(year, month):
      match month:
          case 1 | 3 | 5 | 7 | 8 | 10 | 12:
              return 31
          case 4 | 6 | 9 | 11:
              return 30
          case 2:
              leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
              return 29 if leap else 28
          case _:
              return -1

  print(days_in_month(2024, 2), days_in_month(2026, 2), days_in_month(2026, 13))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day14-predict-c
    title: switch의 fall-through 예측하기
    kind: predict
    objective: break가 없으면 일치한 case부터 아래 case들이 이어서 실행된다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int x = 2;
          switch (x) {
          case 1:
              printf("one ");
              /* fallthrough */
          case 2:
              printf("two ");
              /* fallthrough */
          case 3:
              printf("three ");
              /* fallthrough */
          default:
              printf("other");
          }
          printf("\n");
          return 0;
      }
    answer: "two three other"
    hint: "case 2에서 시작합니다. break가 없으니 그 아래 case의 코드도 모두 실행됩니다."
    explanation: "switch는 일치한 case의 위치로 '점프'할 뿐, 각 case가 따로 끝나지 않습니다. break를 만나거나 switch가 끝날 때까지 아래로 계속 실행됩니다. /* fallthrough */ 주석은 '일부러 이어지게 했다'는 표시로, 이 주석이 없으면 경고가 납니다."
    commonMistakes:
      - "case 2만 실행된다고 생각해 two만 적음"
      - "case 1도 실행된다고 생각함(시작 위치는 case 2)"
    language: c
    verification: run
  - id: ex-day14-predict-py
    title: Python match의 묶인 패턴 예측하기
    kind: predict
    objective: "|로 묶은 패턴과 _ 기본 갈래를 읽는다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      code = 404
      match code:
          case 200:
              msg = "OK"
          case 400 | 404:
              msg = "요청 오류"
          case _:
              msg = "기타"
      print(msg)
    answer: "요청 오류"
    hint: "400 | 404는 '400 또는 404'입니다."
    explanation: "Python의 match는 위에서부터 패턴을 비교해 처음 맞는 갈래 하나만 실행합니다. C처럼 아래로 이어지지 않아 break가 필요 없습니다. case _는 모든 값과 맞는 기본 갈래입니다."
    commonMistakes:
      - "404가 case _로 간다고 생각해 기타로 적음"
      - "|를 비트 OR로 계산해 400 | 404 = 404로 읽음(결과는 같지만 뜻은 '또는')"
    language: python
    verification: run
  - id: ex-day14-fill
    title: Rust match의 기본 갈래 채우기
    kind: fill
    objective: 나머지 모든 경우를 받는 _ 갈래를 쓴다.
    prompt: "요일 번호(1=월 … 7=일)로 주말과 평일을 구분하도록 빈칸을 채우세요. day가 3이므로 '평일'이 출력되어야 합니다."
    starter: |-
      fn main() {
          let day = 3;
          let kind = match day {
              6 | 7 => "주말",
              _____ => "평일",
          };
          println!("{kind}");
      }
    answer: |-
      fn main() {
          let day = 3;
          let kind = match day {
              6 | 7 => "주말",
              _ => "평일",
          };
          println!("{kind}");
      }
    output: "평일"
    hint: "Rust의 match는 가능한 모든 값을 다뤄야 합니다. '그 밖의 모든 값'을 뜻하는 패턴은 밑줄 하나입니다."
    explanation: '_ 갈래가 없으면 1~5와 8 이상의 값을 처리하지 않아 E0004(non-exhaustive patterns) 오류가 납니다. 이 검사 덕분에 경우를 빠뜨리는 실수를 컴파일할 때 잡을 수 있습니다. 잘못된 요일 번호를 따로 처리하려면 1..=5 => "평일", _ => "잘못된 요일"처럼 나눕니다.'
    commonMistakes:
      - "default를 써서 오류가 남"
      - "_ 갈래를 맨 위에 둬서 모든 값이 평일이 됨(unreachable pattern 경고)"
    language: rust
    verification: run
  - id: ex-day14-modify
    title: 2월의 윤년 처리 추가하기
    kind: modify
    objective: match의 한 갈래 안에서 추가 조건을 검사한다.
    prompt: "days_in_month가 2월을 항상 28일로 돌려줍니다. 윤년이면 29일을 돌려주도록 고쳐서 '29 28'이 출력되게 하세요."
    starter: |-
      def days_in_month(year, month):
          match month:
              case 4 | 6 | 9 | 11:
                  return 30
              case 2:
                  return 28
              case _:
                  return 31


      print(days_in_month(2024, 2), days_in_month(2026, 2))
    answer: |-
      def days_in_month(year, month):
          match month:
              case 4 | 6 | 9 | 11:
                  return 30
              case 2:
                  leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
                  return 29 if leap else 28
              case _:
                  return 31


      print(days_in_month(2024, 2), days_in_month(2026, 2))
    output: "29 28"
    hint: "Day 8의 윤년 식을 case 2 안에서 계산하고, 조건식으로 29와 28 중 하나를 고르세요."
    explanation: "match로 달을 고른 뒤, 2월 갈래 안에서만 해(year)를 검사합니다. 이렇게 '값으로 먼저 나누고, 필요한 갈래에서만 추가 조건을 보는' 구조가 읽기 쉽습니다. (이 버전은 13월도 31일로 돌려주는 문제가 남아 있습니다. 본문의 버전과 비교해 보세요.)"
    commonMistakes:
      - "윤년 식에서 400 조건을 빠뜨려 2000년을 평년으로 판정함"
      - "case 2를 두 번 써서 두 번째가 실행되지 않음"
    language: python
    verification: run
  - id: ex-day14-debug
    title: C switch의 break 누락 고치기
    kind: debug
    objective: 의도하지 않은 fall-through를 break로 막는다.
    prompt: "이 코드는 'this statement may fall through' 오류로 컴파일되지 않습니다. 경고가 없었다면 'a'를 골랐을 때 라테까지 출력됐을 것입니다. 고쳐서 '아메리카노'만 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          char menu = 'a';
          switch (menu) {
          case 'a':
              printf("아메리카노\n");
          case 'b':
              printf("라테\n");
              break;
          default:
              printf("없는 메뉴\n");
          }
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          char menu = 'a';
          switch (menu) {
          case 'a':
              printf("아메리카노\n");
              break;
          case 'b':
              printf("라테\n");
              break;
          default:
              printf("없는 메뉴\n");
          }
          return 0;
      }
    output: "아메리카노"
    hint: "각 case의 코드가 끝나는 곳에 switch를 빠져나가는 문장이 필요합니다."
    explanation: "break를 빠뜨리는 것은 C switch의 가장 흔한 버그입니다. -Wextra(-Wimplicit-fallthrough)가 이 실수를 찾아 줍니다. Python과 Rust의 match는 한 갈래만 실행하므로 이런 문제가 없습니다."
    commonMistakes:
      - "/* fallthrough */ 주석을 붙여 경고만 없애고 버그는 남김"
      - "default에도 break가 필수라고 생각함(마지막 갈래라 없어도 되지만 써도 괜찮음)"
    language: c
    verification: run
  - id: ex-day14-independent
    title: Rust로 날짜 검사하기
    kind: independent
    objective: match로 달의 일수를 구하고, 경계를 포함한 범위로 날짜를 검사한다.
    prompt: "is_valid(year, month, day)를 만들어 (2024, 2, 29), (2026, 2, 29), (2026, 4, 31), (2026, 12, 31)을 검사하고 'true false false true'를 출력하세요."
    starter: |-
      fn main() {
          println!("? ? ? ?");
      }
    answer: |-
      fn is_leap(year: i32) -> bool {
          (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
      }

      fn is_valid(year: i32, month: u32, day: u32) -> bool {
          let last = match month {
              1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
              4 | 6 | 9 | 11 => 30,
              2 => {
                  if is_leap(year) {
                      29
                  } else {
                      28
                  }
              }
              _ => return false,
          };
          (1..=last).contains(&day)
      }

      fn main() {
          println!(
              "{} {} {} {}",
              is_valid(2024, 2, 29),
              is_valid(2026, 2, 29),
              is_valid(2026, 4, 31),
              is_valid(2026, 12, 31)
          );
      }
    output: "true false false true"
    hint: "먼저 match로 그 달의 마지막 날을 구하고, 날짜가 1..=마지막 날 안에 있는지 확인하세요. 잘못된 달은 match 갈래에서 바로 return false로 끝낼 수 있습니다."
    explanation: "match의 각 갈래는 값을 돌려주므로 let last = match ... 로 마지막 날을 한 번에 구합니다. _ 갈래의 return false는 함수 전체를 끝내므로 last에 넣을 값이 필요 없습니다. 닫힌 범위 1..=last로 1일과 마지막 날을 모두 포함했습니다."
    commonMistakes:
      - "1..last로 써서 말일을 잘못된 날짜로 판정함"
      - "day가 0인 경우를 검사하지 않음(u32라 음수는 없지만 0은 가능)"
    language: rust
    verification: run
quiz:
  - id: quiz-day14-01
    question: C switch에서 break의 역할은?
    choices:
      - 프로그램을 끝낸다
      - switch를 빠져나가 아래 case가 실행되지 않게 한다
      - 다음 case로 건너뛴다
      - default로 이동한다
    answerIndex: 1
    explanation: switch는 일치한 case부터 아래로 계속 실행합니다. break를 만나야 switch 밖으로 나갑니다. break가 없어 아래 case로 이어지는 것을 fall-through라고 합니다.
  - id: quiz-day14-02
    question: C switch의 case에 쓸 수 없는 것은?
    choices: ["정수 상수 3", "글자 상수 'a'", '문자열 "yes"', "상수 식 2 + 1"]
    answerIndex: 2
    explanation: C의 case에는 컴파일할 때 값이 정해지는 정수(글자 포함)만 쓸 수 있습니다. 문자열이나 실수, 범위는 쓸 수 없어서 그런 경우에는 if 사다리를 씁니다. Python과 Rust의 match는 문자열도 비교할 수 있습니다.
  - id: quiz-day14-03
    question: Rust match에서 _ 갈래를 빼면 i32 값을 다룰 때 어떻게 되나요?
    choices:
      - 처리하지 않은 값은 무시된다
      - 가능한 모든 값을 다루지 않아 컴파일 오류(E0004)가 난다
      - 실행 중에 오류가 난다
      - 0으로 처리된다
    answerIndex: 1
    explanation: Rust는 match가 모든 경우를 빠짐없이 다루는지(exhaustive) 컴파일할 때 검사합니다. 빠진 경우가 있으면 어떤 값이 빠졌는지 알려 줍니다.
  - id: quiz-day14-04
    question: switch나 match보다 if 사다리가 알맞은 경우는?
    choices:
      - 요일 번호 1~7에 따라 이름을 고를 때
      - 메뉴 글자 'a', 'b', 'c'에 따라 동작을 고를 때
      - 점수가 90 이상, 80 이상, 70 이상인지에 따라 등급을 고를 때(C 기준)
      - 달 번호에 따라 일수를 고를 때
    answerIndex: 2
    explanation: C의 switch는 '정확히 이 값'만 비교할 수 있어서 범위 조건은 if 사다리로 씁니다. Rust match는 90..=100 같은 범위 패턴도 쓸 수 있습니다(Day 15).
  - id: quiz-day14-05
    question: 날짜 검사 is_valid(y, m, d)를 시험할 때 가장 빠뜨리기 쉬운 경계값은?
    choices:
      - 5월 15일
      - 2월 29일(윤년과 평년), 4월 31일, 1월 0일, 13월
      - 7월 7일
      - 3월 3일
    answerIndex: 1
    explanation: 오류는 경계에서 생깁니다. 달마다 다른 말일(30, 31), 2월의 윤년 규칙, 0일과 13월 같은 범위 밖 값을 모두 넣어 봐야 합니다.
---

## 1. 오늘 배울 내용

Day 8(논리 연산), Day 12(비교와 경계), Day 13(조건문)을 복습하면서, **하나의 값이 무엇인지에 따라** 갈래를 나누는 새 도구를 배웁니다.

1. C의 **`switch`**: `case`, `break`, `default`를 씁니다.
2. `break`를 빠뜨리면 아래 `case`로 이어지는 **fall-through**를 봅니다.
3. **Python의 `match`**(3.10부터)와 **Rust의 `match`** 를 C와 비교합니다(Rust는 Day 15에서 더 깊이 다룹니다).
4. **여러 값을 한 갈래로 묶는** 방법을 익힙니다.
   - C: `case 1: case 3:`처럼 나열
   - Python, Rust: `1 | 3`
5. `switch`/`match`와 `if` 사다리 중 **무엇을 언제** 쓸지 정합니다.
6. 달의 일수, 날짜 유효성 검사, 다음 날 계산으로 **경계값**을 복습합니다.

## 2. 왜 필요한가

메뉴 번호, 요일, 달, 명령어처럼 **정해진 몇 가지 값 중 하나**에 따라 동작을 고를 때가 많습니다. `if` 사다리로도 할 수 있지만 같은 변수를 계속 반복해서 씁니다.

```text
if (month == 1 || month == 3 || month == 5 || month == 7 || ...) ...
else if (month == 4 || month == 6 || ...) ...
```

`switch`/`match`를 쓰면 "이 값에 대해 경우를 나눈다"는 의도가 드러나고, 값을 한 번만 적습니다. 특히 Rust의 `match`는 **빠진 경우가 없는지**를 컴파일러가 검사해 줘서, 새 경우를 추가하다 한 곳을 고치지 않는 실수를 막아 줍니다.

## 3. 그림으로 이해하기

C의 `switch`는 **점프 표**처럼 동작합니다. 값에 맞는 `case` **위치로 뛰어가서** 거기서부터 아래로 실행하고, `break`를 만나면 밖으로 나갑니다.

```text
switch (menu)          menu == 'b'
{
  case 'a':            ┐
     아메리카노 출력     │  (건너뜀)
     break;            ┘
  case 'b':  ◀──────── 여기로 점프
     라테 출력           실행
     break;  ─────────▶ switch 밖으로
  default:
     없는 메뉴 출력
}
```

`break`가 없으면 벽이 없는 계단처럼 **아래 case로 떨어집니다**(fall-through).

```text
switch (level)        level == 2

case 3: 금화          (건너뜀)
case 2: 은화  ◀─ 점프  실행 ↓ (break 없음)
case 1: 동화          실행 ↓
        break;        밖으로
```

Python과 Rust의 `match`는 **맞는 갈래 하나만** 실행하고 끝나서 이런 떨어짐이 없습니다.

## 4. 천천히 풀어보기

### 4.1 C switch의 규칙

```c
switch (정수 식) {
case 상수1:
    ...
    break;
case 상수2:
case 상수3:          // 여러 값을 한 갈래로
    ...
    break;
default:            // 어느 case와도 맞지 않을 때
    ...
}
```

| 규칙                   | 설명                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `switch`의 괄호 안     | **정수**(글자 포함) 값이어야 합니다. 문자열·실수는 안 됩니다.       |
| `case` 뒤              | 컴파일할 때 정해지는 **상수**만 됩니다. 변수나 범위는 안 됩니다.    |
| 같은 값의 `case` 두 개 | 컴파일 오류입니다.                                                  |
| `break`                | `switch`를 빠져나갑니다. 없으면 아래 `case`로 이어집니다.           |
| `default`              | 맞는 `case`가 없을 때 실행됩니다. 없어도 되지만 두는 것이 좋습니다. |
| 일부러 이어지게 할 때  | `/* fallthrough */` 주석으로 의도를 표시합니다(경고가 사라집니다).  |

### 4.2 세 언어 비교

```text
C                              Python                          Rust
switch (month) {               match month:                    match month {
case 4: case 6:                    case 4 | 6 | 9 | 11:            4 | 6 | 9 | 11 => 30,
case 9: case 11:                       return 30                   2 => 28,
    return 30;                     case 2:                         _ => 31,
case 2:                                return 28               }
    return 28;                     case _:
default:                               return 31
    return 31;
}
```

| 관점              | C `switch`                | Python `match`                | Rust `match`                   |
| ----------------- | ------------------------- | ----------------------------- | ------------------------------ |
| 비교할 수 있는 값 | 정수, 글자                | 거의 모든 값(문자열, 튜플 등) | 거의 모든 값, 범위 패턴도 가능 |
| 여러 값 묶기      | `case` 나열               | `\|`                          | `\|`                           |
| 기본 갈래         | `default:`                | `case _:`                     | `_ =>`                         |
| 실행되는 갈래     | 점프한 곳부터 `break`까지 | 맞는 갈래 하나                | 맞는 갈래 하나                 |
| 빠진 경우         | 조용히 아무것도 안 함     | 조용히 아무것도 안 함         | **컴파일 오류**                |
| 값을 돌려주나     | 아니요(문장)              | 아니요(문장)                  | 예(표현식)                     |

### 4.3 무엇을 쓸까

- **정해진 값 몇 개** 중 하나 → `switch`/`match`
- **범위나 복잡한 조건**(90 이상, 회원이면서 1만 원 이상) → `if` 사다리
- **값에서 다른 값을 고르기만** 한다면 → Python은 사전(`dict`)으로 찾는 것도 좋습니다. `prices.get(menu, 0)`처럼 없는 키의 기본값도 정할 수 있습니다.

### 4.4 복습: 분기에서 기억할 것

| Day | 핵심                                                                                              |
| --: | ------------------------------------------------------------------------------------------------- |
|   8 | `&&`가 `\|\|`보다 먼저. 단락 평가. 드모르간. Rust 조건은 `bool`만.                                |
|  12 | 이상·이하는 경계 포함. 반열린 구간 `[a, b)`. 경계값과 그 양옆으로 시험.                           |
|  13 | 사다리는 처음 참인 갈래 하나만. `>=`는 높은 기준부터. 보호 조건을 맨 앞에. Rust `if`는 값을 가짐. |
|  14 | `switch`는 `break`를 잊지 말 것. `match`는 한 갈래만, Rust는 모든 경우를 다뤄야 함.               |

## 5. C로 구현하기

```c
// 파일: switch.c
#include <stdio.h>
#include <stdbool.h>

bool is_leap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int days_in_month(int year, int month) {
    switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;                          // 여러 case가 같은 코드를 쓴다
    case 4: case 6: case 9: case 11:
        return 30;
    case 2:
        return is_leap(year) ? 29 : 28;
    default:
        return -1;                          // 1~12가 아닌 달
    }
}

int main(void) {
    printf("2024-02: %d일\n", days_in_month(2024, 2));
    printf("2026-02: %d일\n", days_in_month(2026, 2));
    printf("2026-04: %d일\n", days_in_month(2026, 4));
    printf("2026-12: %d일\n", days_in_month(2026, 12));
    printf("2026-13: %d\n", days_in_month(2026, 13));

    char menu = 'b';
    switch (menu) {
    case 'a':
        printf("아메리카노\n");
        break;                              // switch를 빠져나간다
    case 'b':
        printf("라테\n");
        break;
    default:
        printf("없는 메뉴\n");
    }

    int level = 2;
    printf("레벨 %d 보상:", level);
    switch (level) {                        // 일부러 break 없이 아래로 이어 실행
    case 3:
        printf(" 금화");
        /* fallthrough */
    case 2:
        printf(" 은화");
        /* fallthrough */
    case 1:
        printf(" 동화");
        break;
    default:
        break;
    }
    printf("\n");
    return 0;
}
```

실행 결과:

```text
2024-02: 29일
2026-02: 28일
2026-04: 30일
2026-12: 31일
2026-13: -1
라테
레벨 2 보상: 은화 동화
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bool is_leap(int year) { return ...; }`     | Day 8의 윤년 식을 함수로 묶었습니다. 함수는 Day 20에서 자세히 배웁니다.                                                                                   |
| `case 1: case 3: ... case 12:`               | `case`를 나열하면 아무 코드 없는 `case`는 다음 `case`로 이어지므로, 여러 값이 같은 코드를 씁니다. 코드가 없는 `case`는 fall-through 경고 대상이 아닙니다. |
| `return 31;`                                 | `return`은 함수를 끝내므로 `break`가 필요 없습니다.                                                                                                       |
| `return is_leap(year) ? 29 : 28;`            | 2월 갈래 안에서만 해(year)를 봅니다.                                                                                                                      |
| `default: return -1;`                        | 1~12가 아닌 달은 -1로 "잘못됨"을 알립니다. 13월도 경계값으로 시험했습니다.                                                                                |
| `case 'a':` ... `break;`                     | 글자도 정수라서 `case`에 쓸 수 있습니다. `break`로 한 메뉴만 출력합니다.                                                                                  |
| `case 3: printf(" 금화"); /* fallthrough */` | 일부러 `break`를 빼서 "레벨 이하의 보상을 모두 받는" 규칙을 만들었습니다. 주석이 없으면 `-Wextra`가 경고합니다.                                           |

## 6. Python으로 구현하기

Python 3.10부터 `match` 문을 쓸 수 있습니다. `case`에 값, `|`로 묶은 여러 값, 모든 값과 맞는 `_`를 씁니다.

```python
# 파일: switch.py
def days_in_month(year, month):
    match month:
        case 1 | 3 | 5 | 7 | 8 | 10 | 12:
            return 31
        case 4 | 6 | 9 | 11:
            return 30
        case 2:
            leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
            return 29 if leap else 28
        case _:                             # 나머지 모든 경우
            return -1


for year, month in ((2024, 2), (2026, 2), (2026, 4), (2026, 12), (2026, 13)):
    print(f"{year}-{month:02}: {days_in_month(year, month)}")

menu = "b"
match menu:
    case "a":
        print("아메리카노")
    case "b":
        print("라테")
    case _:
        print("없는 메뉴")

prices = {"a": 4500, "b": 5000}             # 값을 고르기만 한다면 사전도 좋다
print(prices.get("b", 0), prices.get("z", 0))

level = 2
rewards = []
if level >= 3:
    rewards.append("금화")
if level >= 2:
    rewards.append("은화")
if level >= 1:
    rewards.append("동화")
print(f"레벨 {level} 보상:", " ".join(rewards))
```

실행 결과:

```text
2024-02: 29
2026-02: 28
2026-04: 30
2026-12: 31
2026-13: -1
라테
5000 0
레벨 2 보상: 은화 동화
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `case 1 \| 3 \| 5 \| 7 \| 8 \| 10 \| 12:` | 여러 값 중 하나와 맞으면 이 갈래입니다.                                                                            |
| `case _:`                                 | 앞의 어떤 패턴과도 맞지 않은 값을 받습니다. C의 `default`입니다.                                                   |
| `for year, month in ((2024, 2), ...):`    | 해와 달의 짝을 차례로 꺼내 시험합니다. `{month:02}`로 달을 두 자리로 맞췄습니다.                                   |
| `match menu:` / `case "a":`               | C와 달리 **문자열**도 비교할 수 있습니다.                                                                          |
| `prices.get("z", 0)`                      | 사전에 없는 키면 기본값 0을 돌려줍니다. 값을 고르기만 하는 분기는 이렇게 **표로** 바꿀 수 있습니다(사전은 Day 67). |
| `if level >= 3:` … 독립된 `if` 세 개      | Python `match`에는 fall-through가 없어서, "레벨 이하 보상을 모두"는 독립된 `if`로 씁니다(Day 13의 독립된 if).      |
| `" ".join(rewards)`                       | 리스트의 문자열을 공백으로 이어 붙입니다.                                                                          |

## 7. Rust로 구현하기

Rust의 `match`는 모든 경우를 다뤄야 하고, 값을 돌려주는 **표현식**입니다. 잘못된 달처럼 "답이 없는" 경우는 `-1` 같은 특별한 값 대신 **`Option`**(`Some(값)` 또는 `None`)으로 나타냈습니다.

```rust
// 파일: switch.rs
fn is_leap(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

fn days_in_month(year: i32, month: u32) -> Option<u32> {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => Some(31),
        4 | 6 | 9 | 11 => Some(30),
        2 => Some(if is_leap(year) { 29 } else { 28 }),
        _ => None,                          // 잘못된 달은 '값 없음'
    }
}

fn main() {
    for (year, month) in [(2024, 2), (2026, 2), (2026, 4), (2026, 12), (2026, 13)] {
        println!("{year}-{month:02}: {:?}", days_in_month(year, month));
    }

    let menu = 'b';
    let name = match menu {
        'a' => "아메리카노",
        'b' => "라테",
        _ => "없는 메뉴",
    };
    println!("{name}");

    let level = 2;
    let mut rewards = String::new();
    if level >= 3 {
        rewards += " 금화";
    }
    if level >= 2 {
        rewards += " 은화";
    }
    if level >= 1 {
        rewards += " 동화";
    }
    println!("레벨 {level} 보상:{rewards}");
}
```

실행 결과:

```text
2024-02: Some(29)
2026-02: Some(28)
2026-04: Some(30)
2026-12: Some(31)
2026-13: None
라테
레벨 2 보상: 은화 동화
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-> Option<u32>`                                 | "`u32` 값이 있을 수도, 없을 수도 있다"는 자료형입니다. C처럼 -1을 "잘못됨"의 뜻으로 약속해 두는 대신, 자료형으로 드러냅니다. Day 25에서 자세히 다룹니다. |
| `1 \| 3 \| ... => Some(31),`                     | 패턴 `=>` 결과 형식입니다. 갈래 끝의 쉼표를 잊지 마세요.                                                                                                 |
| `2 => Some(if is_leap(year) { 29 } else { 28 })` | 갈래의 결과 자리에 `if` 표현식을 넣었습니다.                                                                                                             |
| `_ => None,`                                     | 나머지 모든 달입니다. 이 줄이 없으면 E0004 오류입니다.                                                                                                   |
| `{:?}`로 출력                                    | `Option`은 Debug 형식으로 `Some(29)`, `None`처럼 보입니다.                                                                                               |
| `let name = match menu { ... };`                 | `match` 전체가 값을 돌려줘서 바로 바인딩에 넣습니다.                                                                                                     |
| `rewards += " 금화";`                            | `String`에 문자열을 덧붙입니다(Day 39).                                                                                                                  |

## 8. 실행 추적

C의 보상 `switch`를 `level`이 3, 2, 1, 0일 때 따라가 봅니다.

| `level` | 점프한 곳 | 실행한 줄                    | 출력              |
| ------: | --------- | ---------------------------- | ----------------- |
|       3 | `case 3`  | 금화 → 은화 → 동화 → `break` | ` 금화 은화 동화` |
|       2 | `case 2`  | 은화 → 동화 → `break`        | ` 은화 동화`      |
|       1 | `case 1`  | 동화 → `break`               | ` 동화`           |
|       0 | `default` | `break`                      | (없음)            |

fall-through는 이렇게 "이 단계 이하를 모두"라는 규칙에 쓸모가 있지만, 대부분은 **실수**로 생깁니다. 일부러 쓸 때는 반드시 주석을 남기세요.

## 9. 다른 예제로 다시 이해하기

**날짜 유효성 검사.** 달의 일수를 이용해 `(년, 월, 일)`이 실제로 있는 날짜인지 검사합니다. 복습한 모든 것이 들어 있습니다. `switch`로 일수를 구하고(Day 14), 윤년 식을 쓰고(Day 8), 닫힌 구간으로 날짜를 검사합니다(Day 12).

```c
// 파일: valid_date.c
#include <stdio.h>
#include <stdbool.h>

bool is_leap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int days_in_month(int year, int month) {
    switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
    case 4: case 6: case 9: case 11:
        return 30;
    case 2:
        return is_leap(year) ? 29 : 28;
    default:
        return -1;
    }
}

bool is_valid_date(int year, int month, int day) {
    int last = days_in_month(year, month);
    return last != -1 && 1 <= day && day <= last;
}

int main(void) {
    printf("2024-02-29 %d\n", is_valid_date(2024, 2, 29));
    printf("2026-02-29 %d\n", is_valid_date(2026, 2, 29));
    printf("2026-04-30 %d\n", is_valid_date(2026, 4, 30));
    printf("2026-04-31 %d\n", is_valid_date(2026, 4, 31));
    printf("2026-13-01 %d\n", is_valid_date(2026, 13, 1));
    printf("2026-01-00 %d\n", is_valid_date(2026, 1, 0));
    return 0;
}
```

실행 결과:

```text
2024-02-29 1
2026-02-29 0
2026-04-30 1
2026-04-31 0
2026-13-01 0
2026-01-00 0
```

`last != -1`을 **먼저** 검사한 것에 주목하세요. 13월이면 `last`가 -1이라 뒤의 `day <= last`가 의미 없는데, 단락 평가(Day 8) 덕분에 뒤는 계산되지 않습니다. 시험한 값은 모두 경계입니다. 윤년·평년의 2월 29일, 30일짜리 달의 30일과 31일, 13월, 0일입니다.

**다음 날 계산.** 날짜에 하루를 더하면 달이나 해가 바뀔 수 있습니다. 경계에서 어떻게 넘어가는지 Python으로 확인해 봅시다.

```python
# 파일: next_day.py
def days_in_month(year, month):
    match month:
        case 1 | 3 | 5 | 7 | 8 | 10 | 12:
            return 31
        case 4 | 6 | 9 | 11:
            return 30
        case 2:
            leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
            return 29 if leap else 28


def next_day(year, month, day):
    if day < days_in_month(year, month):     # 같은 달 안
        return year, month, day + 1
    if month < 12:                           # 말일이면 다음 달 1일
        return year, month + 1, 1
    return year + 1, 1, 1                    # 12월 31일이면 다음 해


for date in ((2026, 1, 15), (2026, 1, 31), (2024, 2, 28), (2026, 2, 28), (2026, 12, 31)):
    print(date, "→", next_day(*date))
```

실행 결과:

```text
(2026, 1, 15) → (2026, 1, 16)
(2026, 1, 31) → (2026, 2, 1)
(2024, 2, 28) → (2024, 2, 29)
(2026, 2, 28) → (2026, 3, 1)
(2026, 12, 31) → (2027, 1, 1)
```

`next_day`는 "같은 달 안 → 달이 바뀜 → 해가 바뀜"을 **보호 조건 두 개**로 차례로 처리합니다. 앞의 `return`이 실행되면 함수가 끝나므로 `elif`가 필요 없습니다. `next_day(*date)`의 `*`는 튜플을 풀어서 세 인자로 넘긴다는 뜻입니다. 이 `days_in_month`에는 `case _`가 없어서 13월을 넣으면 `None`이 돌아와 비교에서 오류가 납니다. 입력을 믿을 수 없다면 C 버전처럼 먼저 검사해야 합니다.

## 10. 갈래 나누기 도구 한눈에 보기

| 상황                   | C                       | Python            | Rust                              |
| ---------------------- | ----------------------- | ----------------- | --------------------------------- |
| 조건 하나로 둘 중 하나 | `if/else`, `?:`         | `if/else`, 조건식 | `if/else` 표현식                  |
| 범위·복합 조건 여러 개 | `if/else if`            | `if/elif`         | `if/else if`, `match`의 범위 패턴 |
| 정해진 값 여러 개      | `switch`                | `match`           | `match`                           |
| 값 → 값 대응표         | 배열(번호가 0부터일 때) | 사전 `dict.get`   | `match`, `HashMap`                |
| 빠진 경우 검사         | (없음)                  | (없음)            | 컴파일러가 검사                   |

## 11. 세 언어 비교

| 관점             | C                            | Python                    | Rust                            |
| ---------------- | ---------------------------- | ------------------------- | ------------------------------- |
| 값 기반 분기     | `switch`                     | `match` (3.10+)           | `match`                         |
| 한 갈래 실행 후  | `break` 없으면 아래로 이어짐 | 끝남                      | 끝남                            |
| 비교 대상        | 정수 상수만                  | 값, 문자열, 튜플, 구조 등 | 값, 문자열, 범위, 튜플, enum 등 |
| 모든 경우 다루기 | 선택(`default`)              | 선택(`case _`)            | **필수**                        |
| "답 없음" 표현   | -1 같은 약속된 값            | `None`                    | `Option`의 `None`               |

## 12. 자주 하는 실수

### 실수 1: break를 빠뜨린다 (C)

```c
// 파일: missing_break.c (컴파일 오류: this statement may fall through)
#include <stdio.h>

int main(void) {
    int n = 1;
    switch (n) {
    case 1:
        printf("하나\n");
    case 2:
        printf("둘\n");
        break;
    }
    return 0;
}
```

### 실수 2: case에 범위나 변수를 쓴다 (C)

```c
// 파일: case_variable.c (컴파일 오류: case label does not reduce to an integer constant)
#include <stdio.h>

int main(void) {
    int limit = 90;
    int score = 95;
    switch (score) {
    case limit:
        printf("A\n");
        break;
    }
    return 0;
}
```

`case`에는 상수만 쓸 수 있습니다. 범위 조건은 `if` 사다리로 씁니다.

### 실수 3: 모든 경우를 다루지 않는다 (Rust)

```rust
// 파일: non_exhaustive.rs (컴파일 오류: E0004)
fn main() {
    let month = 5;
    let days = match month {
        4 | 6 | 9 | 11 => 30,
        2 => 28,
    };
    println!("{days}");
}
```

오류 메시지가 빠진 값(`i32::MIN..=1_i32`, `3_i32` 등)을 알려 줍니다. `_ =>` 갈래를 추가하세요.

### 실수 4: 기본 갈래를 맨 위에 둔다 (Rust, Python)

`_`가 모든 값과 맞으므로 맨 위에 두면 아래 갈래는 실행되지 않습니다. Rust는 `unreachable pattern` 경고를, Python은 "wildcard makes remaining patterns unreachable" 문법 오류를 냅니다. 기본 갈래는 **항상 마지막**에 둡니다.

### 실수 5: Python match에서 변수 이름을 패턴으로 쓴다

```python
# 파일: capture_pattern.py
LIMIT = 90
score = 95
match score:
    case 100:
        print("만점")
    case other:
        print("변수 패턴은 모든 값과 맞고, 그 값을 이름에 담는다:", other)
```

실행 결과:

```text
변수 패턴은 모든 값과 맞고, 그 값을 이름에 담는다: 95
```

Python `match`에서 `case other:`처럼 **이름만** 쓰면 "비교"가 아니라 "어떤 값이든 받아서 `other`에 담기"가 됩니다. `case LIMIT:`이라고 쓰면 90과 비교하는 것이 아니라 `LIMIT`에 95를 **덮어쓰는** 패턴이 되어 버립니다. 상수와 비교하려면 `case x if x == LIMIT:`처럼 조건(가드)을 쓰거나 `if` 사다리를 쓰세요.

## 13. Q&A

**Q. C switch는 왜 fall-through가 기본인가요?**

A. C가 만들어질 때는 여러 `case`가 코드를 공유하는 경우(`case 1: case 3:`)를 쉽게 쓰고, 기계어의 "점프 표"와 똑같이 동작하게 하려는 이유가 컸습니다. 결과적으로 `break` 누락이 흔한 버그가 되어, 이후 언어들(Rust, Python, Swift, Go)은 대부분 기본으로 한 갈래만 실행하도록 바꿨습니다.

**Q. switch가 if 사다리보다 빠른가요?**

A. `case`가 많고 값이 촘촘하면 컴파일러가 점프 표를 만들어 비교 없이 바로 이동할 수 있어서 빠를 수 있습니다. 하지만 요즘 컴파일러는 `if` 사다리도 잘 최적화하므로, 속도보다는 **읽기 쉬운 쪽**을 고르세요.

**Q. Python에서 match 대신 사전을 쓰는 것이 더 좋은가요?**

A. "값 → 값"을 고르기만 한다면 사전이 짧고, 표를 파일에서 읽어 오는 것처럼 데이터로 다루기도 쉽습니다. 갈래마다 **하는 일**이 다르거나, 튜플 모양처럼 구조를 따져야 하면 `match`가 알맞습니다.

**Q. Rust match의 결과 자료형이 갈래마다 다르면요?**

A. `if` 표현식처럼 모든 갈래가 같은 자료형을 돌려줘야 합니다. 다만 `return`, `panic!`처럼 **함수를 빠져나가는** 갈래는 값이 없어도 됩니다(실습의 `_ => return false`).

## 14. 핵심 요약

- C `switch`는 정수 값에 맞는 `case`로 점프해 `break`까지 실행합니다. `break`가 없으면 아래 `case`로 이어집니다(fall-through). 일부러 쓸 때는 `/* fallthrough */`로 표시합니다.
- `case`에는 정수 상수만 쓸 수 있습니다. 범위와 복합 조건은 `if` 사다리로 씁니다.
- Python `match`와 Rust `match`는 맞는 갈래 **하나**만 실행합니다. 여러 값은 `|`로 묶고, 기본 갈래는 `_`로 **마지막**에 둡니다.
- Rust `match`는 모든 경우를 다뤄야 하고(없으면 E0004), 값을 돌려주는 표현식입니다. "답 없음"은 `Option`으로 나타낼 수 있습니다.
- 분기는 경계값으로 시험합니다: 윤년·평년 2월 29일, 30·31일, 0일, 13월, 연말.

## 15. 도전 문제

1. **(C)** 계산기: 두 정수와 연산자 글자(`+ - * /`)를 입력받아 `switch`로 계산하세요. 0으로 나누기와 모르는 연산자는 오류 메시지를 출력합니다.
2. **(Python)** 요일 번호(0=월 … 6=일)를 받아 `match`로 "평일", "토요일", "일요일"을 출력하고, 0~6이 아니면 "잘못된 요일"을 출력하세요.
3. **(Rust)** 9절의 `next_day`를 Rust로 옮기세요. `days_in_month`가 `Option<u32>`를 돌려주도록 하고, 잘못된 날짜가 들어오면 `None`을 돌려주게 만들어 보세요.
4. **(세 언어)** 날짜 `(년, 월, 일)`이 그해의 몇 번째 날인지 계산하세요(1월 1일 = 1, 12월 31일 = 365 또는 366). 1~(월 − 1)월의 일수를 더하는 반복문이 필요합니다.
