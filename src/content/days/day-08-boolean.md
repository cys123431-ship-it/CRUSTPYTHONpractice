---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-08-boolean
courseId: crp-92
phaseId: phase-01
dayNumber: 8
date: "2026-10-08"
title: 불리언과 논리 연산 — 참과 거짓을 조합하기
summary: 참·거짓 두 값만 가지는 불리언 자료형과, 조건을 조합하는 논리 연산(그리고 &&/and, 또는 ||/or, 아님 !/not)을 진리표로 익힙니다. 왼쪽만 보고 결과가 정해지면 오른쪽을 계산하지 않는 단락 평가, 드모르간의 법칙, &&가 ||보다 먼저 계산되는 우선순위를 배우고, Rust의 엄격한 bool, C의 '0이면 거짓, 나머지는 참', Python의 truthiness와 and/or가 값을 돌려주는 방식을 비교합니다. 윤년 판별과 놀이기구 탑승 조건으로 연습합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-07-foundation-review]
learningObjectives:
  - 비교 연산의 결과가 불리언이라는 것을 알고, 세 언어에서 불리언 값을 만들고 출력한다.
  - 논리 연산 &&, ||, !(and, or, not)의 진리표를 쓰고 복합 조건을 계산한다.
  - 단락 평가를 설명하고, 0으로 나누기 같은 오류를 막는 데 활용한다.
  - "&&가 ||보다 먼저 계산된다는 우선순위와 드모르간의 법칙으로 조건식을 바르게 고친다."
  - Rust의 bool, C의 정수 참·거짓, Python의 truthiness 차이를 설명한다.
concepts:
  [
    boolean,
    logical and,
    logical or,
    logical not,
    truth table,
    short circuit,
    de morgan,
    precedence,
    truthiness,
    xor,
  ]
runnerMode: python
playgroundSource: |
  # 파일: logic.py — 값을 바꿔 가며 조건의 결과를 확인해 보세요.
  height, age, with_parent = 125, 6, True
  can_ride = height >= 120 and (age >= 8 or with_parent)
  print("탑승 가능:", can_ride)

  year = 2024
  leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
  print(year, "윤년?", leap)
  print(0 or "기본값", "" or "이름 없음")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day08-predict-rs
    title: Rust 논리 연산 예측하기
    kind: predict
    objective: "&&, ||, !의 결과를 비교식과 함께 계산한다."
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let a = 5;
          let b = 0;
          println!("{} {} {}", a > 3 && b > 3, a > 3 || b > 3, !(a == 5));
      }
    answer: "false true false"
    hint: "a > 3은 true, b > 3은 false입니다. &&는 둘 다 참이어야, ||는 하나만 참이어도 참입니다."
    explanation: "true && false = false, true || false = true이고, a == 5가 true라서 !를 붙이면 false입니다. 비교 연산자는 논리 연산자보다 먼저 계산되므로 괄호 없이 써도 됩니다."
    commonMistakes:
      - "||를 '둘 다 참'으로 생각해 false로 적음"
      - "!(a == 5)를 a가 5가 아니라서 true라고 착각함"
    language: rust
    verification: run
  - id: ex-day08-predict-py
    title: Python and/or가 돌려주는 값 예측하기
    kind: predict
    objective: Python의 and/or가 True/False가 아니라 피연산자 값을 돌려준다는 것을 확인한다.
    prompt: 출력되는 네 값을 공백으로 구분해 적으세요.
    starter: 'print(0 or 7, 3 and 0, not "", "a" and "b")'
    answer: "7 0 True b"
    hint: "or는 처음으로 참인 값을, and는 처음으로 거짓인 값을 돌려줍니다. 끝까지 가면 마지막 값을 돌려줍니다. 빈 문자열은 거짓입니다."
    explanation: '0 or 7: 0이 거짓이라 7. 3 and 0: 3이 참이라 다음을 보고 0. not "": 빈 문자열은 거짓이라 True. "a" and "b": "a"가 참이라 "b". not만 항상 True/False를 돌려줍니다.'
    commonMistakes:
      - "and/or의 결과를 True/False로만 적음"
      - 'not ""를 False로 적음(빈 문자열은 거짓)'
    language: python
    verification: run
  - id: ex-day08-fill
    title: C 범위 검사 조건 채우기
    kind: fill
    objective: 두 비교를 && 로 이어 범위 안에 있는지 검사한다.
    prompt: "score가 0 이상 100 이하인지 검사하도록 빈칸을 채우세요. score가 105이므로 '범위 안? 0'이 출력되어야 합니다."
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int score = 105;
          bool ok = score >= 0 _____ score <= 100;
          printf("범위 안? %d\n", ok);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      int main(void) {
          int score = 105;
          bool ok = score >= 0 && score <= 100;
          printf("범위 안? %d\n", ok);
          return 0;
      }
    output: "범위 안? 0"
    hint: "'0 이상'이면서 동시에 '100 이하'여야 합니다."
    explanation: "C에서 0 <= score <= 100이라고 쓰면 (0 <= score)의 결과 1과 100을 비교해 항상 참이 됩니다. 반드시 두 비교를 &&로 잇습니다. Python만 0 <= score <= 100을 수학처럼 해석합니다."
    commonMistakes:
      - "||를 써서 모든 점수가 범위 안이 됨"
      - "0 <= score <= 100으로 써서 컴파일 경고(오류)가 남"
    language: c
    verification: run
  - id: ex-day08-modify
    title: 놀이기구 탑승 조건 바꾸기
    kind: modify
    objective: 괄호를 써서 and와 or를 섞은 조건을 만든다.
    prompt: "탑승 조건을 '키 120 이상이면서, 8세 이상이거나 보호자와 함께'로 바꾸세요. 두 사람의 결과가 'True False'로 출력되어야 합니다."
    starter: |-
      def can_ride(height, age, with_parent):
          return height >= 120


      print(can_ride(125, 6, True), can_ride(110, 10, True))
    answer: |-
      def can_ride(height, age, with_parent):
          return height >= 120 and (age >= 8 or with_parent)


      print(can_ride(125, 6, True), can_ride(110, 10, True))
    output: "True False"
    hint: "and가 or보다 먼저 계산되므로, 'or로 묶인 부분'에 괄호를 쳐야 합니다."
    explanation: "괄호가 없으면 (height >= 120 and age >= 8) or with_parent가 되어, 키가 110이어도 보호자만 있으면 탈 수 있게 됩니다. 첫 번째 사람은 키 125, 보호자 동반이라 True, 두 번째 사람은 키가 모자라 False입니다."
    commonMistakes:
      - "괄호 없이 height >= 120 and age >= 8 or with_parent로 써서 True True가 됨"
      - "with_parent == True처럼 불필요한 비교를 씀(동작은 하지만 군더더기)"
    language: python
    verification: run
  - id: ex-day08-debug
    title: Rust 할인 조건의 우선순위 버그 고치기
    kind: debug
    objective: "&&가 ||보다 먼저 계산되어 생기는 논리 오류를 괄호로 고친다."
    prompt: "할인 조건은 '(회원이거나 쿠폰이 있음) 그리고 구매액 10000원 이상'입니다. 구매액이 5000원인데 '할인: true'가 출력됩니다. 고쳐서 '할인: false'가 나오게 하세요."
    starter: |-
      fn main() {
          let is_member = true;
          let has_coupon = false;
          let amount = 5000;
          let discount = is_member || has_coupon && amount >= 10000;
          println!("할인: {discount}");
      }
    answer: |-
      fn main() {
          let is_member = true;
          let has_coupon = false;
          let amount = 5000;
          let discount = (is_member || has_coupon) && amount >= 10000;
          println!("할인: {discount}");
      }
    output: "할인: false"
    starterOutput: "할인: true"
    hint: "&&가 먼저 묶이므로 원래 식은 is_member || (has_coupon && amount >= 10000)입니다."
    explanation: "회원이기만 하면 구매액과 상관없이 참이 되어 버렸습니다. 곱셈이 덧셈보다 먼저인 것처럼 &&가 ||보다 먼저입니다. 섞어 쓸 때는 항상 괄호로 의도를 적으세요."
    commonMistakes:
      - "괄호를 has_coupon && amount >= 10000 쪽에 쳐서 결과가 바뀌지 않음"
      - "||를 &&로 바꿔 회원이면서 쿠폰도 있어야 하는 다른 조건을 만듦"
    language: rust
    verification: run
  - id: ex-day08-independent
    title: C로 윤년 판별하기
    kind: independent
    objective: 나머지 연산과 논리 연산을 조합한 규칙을 식 하나로 쓴다.
    prompt: "윤년은 '4로 나누어떨어지고 100으로 나누어떨어지지 않는 해, 또는 400으로 나누어떨어지는 해'입니다. 1900, 2000, 2024, 2026이 윤년인지 0/1로 '0 1 1 0'처럼 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("%d %d %d %d\n", 1900, 2000, 2024, 2026);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      bool is_leap(int year) {
          return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
      }

      int main(void) {
          printf("%d %d %d %d\n", is_leap(1900), is_leap(2000), is_leap(2024), is_leap(2026));
          return 0;
      }
    output: "0 1 1 0"
    hint: "'나누어떨어진다'는 나머지가 0이라는 뜻(year % 4 == 0)입니다. 같은 식을 네 번 쓰기 싫다면 함수로 묶으세요(Day 20 미리보기)."
    explanation: "1900은 4와 100으로 나누어떨어지지만 400으로는 안 되어 평년, 2000은 400으로 나누어떨어져 윤년입니다. &&가 ||보다 먼저라 괄호가 없어도 같은 결과지만, 괄호가 규칙의 구조를 보여 줍니다."
    commonMistakes:
      - "year % 4 == 0만 검사해 1900을 윤년으로 판정함"
      - "year % 100 == 0을 써서 조건을 반대로 만듦"
    language: c
    verification: run
quiz:
  - id: quiz-day08-01
    question: A가 참, B가 거짓일 때 거짓인 것은?
    choices: ["A || B", "!B", "A && B", "!(A && B)"]
    answerIndex: 2
    explanation: "&&는 둘 다 참일 때만 참입니다. A || B는 하나가 참이라 참, !B는 참, !(A && B)는 !(거짓)이라 참입니다."
  - id: quiz-day08-02
    question: count != 0 && 10 / count > 1에서 count가 0일 때 일어나는 일은?
    choices:
      - 0으로 나누기 오류가 난다
      - 왼쪽이 거짓이라 오른쪽을 계산하지 않고 결과는 거짓이다
      - 결과는 참이다
      - 컴파일 오류가 난다
    answerIndex: 1
    explanation: 단락 평가입니다. &&는 왼쪽이 거짓이면 전체가 거짓으로 정해지므로 오른쪽을 계산하지 않습니다. ||는 왼쪽이 참이면 오른쪽을 계산하지 않습니다. 세 언어가 모두 같습니다.
  - id: quiz-day08-03
    question: "!(A && B)와 항상 같은 식은?"
    choices: ["!A && !B", "!A || !B", "A || B", "!A && B"]
    answerIndex: 1
    explanation: "드모르간의 법칙입니다. '둘 다 참인 것은 아니다'는 '적어도 하나는 거짓이다'와 같습니다. 반대로 !(A || B)는 !A && !B입니다."
  - id: quiz-day08-04
    question: C에서 if (5)는 어떻게 해석되나요?
    choices:
      - 컴파일 오류
      - 참(0이 아닌 값은 모두 참)
      - 거짓
      - 5번 반복한다
    answerIndex: 1
    explanation: C는 0을 거짓, 0이 아닌 모든 값을 참으로 봅니다. 비교나 논리 연산의 결과는 int 1 또는 0입니다. Rust의 if는 bool만 받아서 if 5는 컴파일 오류(E0308)입니다.
  - id: quiz-day08-05
    question: Python에서 bool("0")의 값은?
    choices: ["False", "True", "0", "오류"]
    answerIndex: 1
    explanation: 빈 문자열 ""만 거짓이고, 글자가 하나라도 있으면 참입니다. "0"은 글자 0이 하나 있는 문자열이라 참입니다. 숫자 0은 거짓입니다.
---

## 1. 오늘 배울 내용

지금까지의 프로그램은 위에서 아래로 한 길로만 실행됐습니다. 다음 주에 배울 **조건문**은 "조건이 참이면 이쪽, 거짓이면 저쪽"으로 길을 나눕니다. 오늘은 그 조건을 만드는 재료인 **참과 거짓**을 배웁니다.

1. **불리언(boolean)** 자료형: `true`/`false`, `True`/`False`, C의 `bool`과 정수 1/0.
2. **비교 연산**의 결과는 불리언입니다(자세한 비교는 Day 12).
3. **논리 연산**으로 조건을 조합합니다.
   - 그리고: `&&`, `and`
   - 또는: `||`, `or`
   - 아님: `!`, `not`
   - 이 세 연산을 **진리표**로 정리합니다.
4. **단락 평가**: 왼쪽만 보고 답이 정해지면 오른쪽을 계산하지 않는 규칙.
5. **우선순위**(`&&`가 `||`보다 먼저)와 **드모르간의 법칙**으로 조건식을 바르게 씁니다.
6. 언어마다 다른 "참"의 기준을 비교합니다.
   - Rust: 오직 `bool`
   - C: 0이 아니면 참
   - Python: truthiness

## 2. 왜 필요한가

실생활의 규칙은 대부분 조건의 조합입니다.

- "회원**이거나** 쿠폰이 있고, **그리고** 구매액이 1만 원 이상이면 할인"
- "키가 120cm 이상**이면서**, 8세 이상**이거나** 보호자와 함께면 탑승 가능"
- "4로 나누어떨어지고 100으로 나누어떨어지지 **않거나**, 400으로 나누어떨어지면 윤년"

이런 규칙을 코드로 옮길 때 "그리고"와 "또는"의 묶음을 잘못 쓰면, 오류 없이 **엉뚱한 사람에게 할인을 해 주는** 프로그램이 됩니다. 논리 연산의 규칙을 정확히 알아야 하는 이유입니다.

## 3. 그림으로 이해하기

논리 연산은 전기 회로의 스위치로 생각하면 쉽습니다. 불이 켜지면 참입니다.

```text
A && B (그리고): 직렬 연결              A || B (또는): 병렬 연결

 전원 ──[A]──[B]── 💡                   전원 ──┬──[A]──┬── 💡
                                               └──[B]──┘
 둘 다 닫혀야 불이 켜짐                  하나만 닫혀도 불이 켜짐
```

**진리표**는 모든 경우를 표로 정리한 것입니다.

| A     | B     | A && B | A \|\| B | !A    | A ^ B (둘 중 하나만) |
| ----- | ----- | ------ | -------- | ----- | -------------------- |
| false | false | false  | false    | true  | false                |
| false | true  | false  | true     | true  | true                 |
| true  | false | false  | true     | false | true                 |
| true  | true  | true   | true     | false | false                |

## 4. 천천히 풀어보기

### 4.1 불리언 값 만들기

불리언은 직접 쓰거나(`true`), 비교해서 만듭니다(`age >= 19`).

| 언어   | 참        | 거짓       | 자료형                               | 출력하면         |
| ------ | --------- | ---------- | ------------------------------------ | ---------------- |
| Rust   | `true`    | `false`    | `bool`                               | `true` / `false` |
| C      | `true`(1) | `false`(0) | `bool`(stdbool.h), 비교 결과는 `int` | `%d`로 `1` / `0` |
| Python | `True`    | `False`    | `bool`                               | `True` / `False` |

비교 연산자는 `==`(같다), `!=`(다르다), `<`, `>`, `<=`, `>=`입니다. `=`는 대입, `==`는 비교라는 점을 꼭 구별하세요.

### 4.2 단락 평가

`&&`는 왼쪽이 거짓이면 오른쪽이 무엇이든 거짓이고, `||`는 왼쪽이 참이면 오른쪽이 무엇이든 참입니다. 그래서 세 언어 모두 **결과가 정해지면 오른쪽을 계산하지 않습니다**. 이것을 **단락 평가(short-circuit evaluation)** 라고 합니다.

```text
count != 0  &&  10 / count > 1
  false     →  (계산 안 함)     →  결과 false, 0으로 나누지 않음!
```

이 성질을 이용해 "위험한 계산 앞에 안전 검사를 두는" 코드를 자주 씁니다. 순서를 바꿔 `10 / count > 1 && count != 0`이라고 쓰면 먼저 0으로 나누게 되니, **검사를 왼쪽에** 두세요.

### 4.3 우선순위

높은 것부터 계산합니다.

| 순위 | 연산자                 |
| ---: | ---------------------- |
|    1 | `!`, `not` (부정)      |
|    2 | 산술 연산 `* / % + -`  |
|    3 | 비교 `< <= > >= == !=` |
|    4 | `&&`, `and`            |
|    5 | `\|\|`, `or`           |

그래서 `a > 3 && b > 3`은 괄호 없이도 `(a > 3) && (b > 3)`입니다. 그리고 `A || B && C`는 `A || (B && C)`입니다. 곱셈이 덧셈보다 먼저인 것과 같은 모양이라, `&&`를 곱셈, `||`를 덧셈으로 기억하면 쉽습니다. **섞어 쓸 때는 항상 괄호**를 치세요.

Python의 `not`은 비교보다 **나중**에 계산되어 `not a == b`는 `not (a == b)`입니다.

### 4.4 드모르간의 법칙

부정(`!`)을 괄호 안으로 넣을 때는 `&&`와 `||`가 서로 바뀝니다.

```text
!(A && B)  ==  !A || !B       "둘 다 참은 아니다" = "적어도 하나는 거짓"
!(A || B)  ==  !A && !B       "둘 중 하나도 참이 아니다" = "둘 다 거짓"
```

예: "성인이면서 회원인 사람이 **아닌** 사람" = "성인이 아니거나, 회원이 아닌 사람".

### 4.5 언어마다 다른 "참"

- **Rust**: 조건 자리에는 오직 `bool`만 쓸 수 있습니다. `if 5`, `if count`는 컴파일 오류입니다. 명확하지만 조금 더 적어야 합니다(`if count != 0`).
- **C**: 0은 거짓, **0이 아닌 모든 값**은 참입니다. 비교와 논리 연산의 결과는 `int` 1 또는 0입니다. `!!x`는 "0이면 0, 아니면 1"로 바꾸는 요령입니다.
- **Python**: 모든 값이 참·거짓으로 쓰일 수 있습니다(**truthiness**). `0`, `0.0`, `""`, `[]`, `None` 같은 "비어 있는 값"은 거짓이고 나머지는 참입니다. 게다가 `and`/`or`는 `True`/`False`가 아니라 **마지막으로 확인한 값**을 돌려줍니다. 그래서 `name or "(익명)"`은 "이름이 비었으면 기본값"이라는 뜻의 관용구입니다.

## 5. Rust로 구현하기

```rust
// 파일: logic.rs
fn main() {
    let is_member = true;
    let has_coupon = false;
    let age = 17;

    let adult = age >= 19;                         // 비교의 결과는 bool
    println!("성인? {adult}");
    println!("회원 && 쿠폰 = {}", is_member && has_coupon);
    println!("회원 || 쿠폰 = {}", is_member || has_coupon);
    println!("!회원 = {}", !is_member);
    println!("회원 ^ 쿠폰 = {}", is_member ^ has_coupon);   // 둘 중 하나만 참

    println!("a     b     a&&b  a||b");
    println!("{:<5} {:<5} {:<5} {:<5}", false, false, false && false, false || false);
    println!("{:<5} {:<5} {:<5} {:<5}", false, true, false && true, false || true);
    println!("{:<5} {:<5} {:<5} {:<5}", true, false, true && false, true || false);
    println!("{:<5} {:<5} {:<5} {:<5}", true, true, true && true, true || true);

    // 단락 평가: 왼쪽이 false면 && 오른쪽은 계산하지 않는다
    let count: i32 = "0".parse().unwrap();
    let safe = count != 0 && 10 / count > 1;
    println!("단락 평가 덕분에 안전: {safe}");

    let x = 5;
    let in_range = 1 <= x && x <= 10;               // 범위 검사는 두 비교를 &&로
    println!("1 <= {x} <= 10 → {in_range}");

    // 드모르간의 법칙: !(A && B) == !A || !B
    println!("드모르간: {}", !(is_member && has_coupon) == (!is_member || !has_coupon));

    println!("true as i32 = {}, false as i32 = {}", true as i32, false as i32);
}
```

실행 결과:

```text
성인? false
회원 && 쿠폰 = false
회원 || 쿠폰 = true
!회원 = false
회원 ^ 쿠폰 = true
a     b     a&&b  a||b
false false false false
false true  false true
true  false false true
true  true  true  true
단락 평가 덕분에 안전: false
1 <= 5 <= 10 → true
드모르간: true
true as i32 = 1, false as i32 = 0
```

### 코드 한 부분씩 읽기

| 코드                                                          | 설명                                                                                                                                                  |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let adult = age >= 19;`                                      | 비교의 결과 `false`가 `bool` 바인딩에 들어갑니다.                                                                                                     |
| `is_member ^ has_coupon`                                      | `^`는 **배타적 또는(XOR)** 입니다. 둘이 다를 때만 참입니다. 단락 평가를 하지 않습니다.                                                                |
| `{:<5}`                                                       | 5칸에 왼쪽 정렬입니다. 진리표 칸을 맞추려고 썼습니다(Day 9).                                                                                          |
| `let count: i32 = "0".parse().unwrap();`                      | 값을 코드에 `0`으로 직접 쓰면 컴파일러가 `10 / count`가 반드시 0 나누기라는 것을 알아채고 막아 버리기 때문에, 실행 중에 정해지는 값처럼 만들었습니다. |
| `count != 0 && 10 / count > 1`                                | 왼쪽이 `false`라서 나눗셈은 **실행되지 않습니다**. 순서를 바꾸면 실행 중에 멈춥니다.                                                                  |
| `1 <= x && x <= 10`                                           | 범위 검사는 두 비교를 `&&`로 잇습니다. Rust는 `1 <= x <= 10`을 컴파일 오류로 막습니다.                                                                |
| `!(is_member && has_coupon) == (!is_member \|\| !has_coupon)` | 드모르간의 법칙을 확인합니다. `==`가 `\|\|`보다 먼저 계산되므로 오른쪽에 괄호가 필요합니다.                                                           |
| `true as i32`                                                 | `bool`을 정수로 바꾸면 1과 0입니다. 반대(정수 → `bool`)는 `as`로 할 수 없고 `n != 0`처럼 비교합니다.                                                  |

## 6. C로 구현하기

C에는 원래 불리언 자료형이 없어서 정수 0과 1로 참·거짓을 나타냈습니다. `stdbool.h`를 포함하면 `bool`, `true`, `false`를 쓸 수 있지만, 속으로는 여전히 0과 1입니다.

```c
// 파일: logic.c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool is_member = true, has_coupon = false;
    int age = 17;

    bool adult = age >= 19;
    printf("성인? %d\n", adult);                      // bool은 0 또는 1로 출력
    printf("회원 && 쿠폰 = %d\n", is_member && has_coupon);
    printf("회원 || 쿠폰 = %d\n", is_member || has_coupon);
    printf("!회원 = %d\n", !is_member);
    printf("비교 결과는 int: 3 > 2 → %d, 3 < 2 → %d\n", 3 > 2, 3 < 2);
    printf("0이 아니면 참: !42 = %d, !!42 = %d, !0 = %d\n", !42, !!42, !0);

    int count = 0;
    bool safe = count != 0 && 10 / count > 1;         // 왼쪽이 거짓이라 나눗셈을 하지 않음
    printf("단락 평가 덕분에 안전: %d\n", safe);

    int x = 5;
    bool in_range = 1 <= x && x <= 10;
    printf("1 <= %d <= 10 → %d\n", x, in_range);

    printf("참/거짓을 글자로: %s\n", in_range ? "true" : "false");
    return 0;
}
```

실행 결과:

```text
성인? 0
회원 && 쿠폰 = 0
회원 || 쿠폰 = 1
!회원 = 0
비교 결과는 int: 3 > 2 → 1, 3 < 2 → 0
0이 아니면 참: !42 = 0, !!42 = 1, !0 = 1
단락 평가 덕분에 안전: 0
1 <= 5 <= 10 → 1
참/거짓을 글자로: true
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `bool is_member = true, has_coupon = false;` | `stdbool.h`의 `bool`입니다. `true`는 1, `false`는 0입니다.                                                             |
| `printf("성인? %d\n", adult);`               | `printf`에는 `bool` 전용 서식이 없어 `%d`로 0/1을 출력합니다.                                                          |
| `3 > 2`                                      | C에서 비교의 결과는 `int` 1입니다.                                                                                     |
| `!42`, `!!42`                                | 42는 0이 아니라 참이므로 `!42`는 0, 다시 부정하면 1입니다.                                                             |
| `count != 0 && 10 / count > 1`               | 단락 평가 덕분에 0으로 나누지 않습니다. C에서 정수를 0으로 나누면 프로그램이 죽을 수 있어서 이 순서가 특히 중요합니다. |
| `in_range ? "true" : "false"`                | 조건 연산자로 참·거짓을 글자로 바꿉니다. `조건 ? 참일 때 값 : 거짓일 때 값`입니다(Day 13).                             |

## 7. Python으로 구현하기

Python의 논리 연산자는 기호가 아니라 **영어 단어** `and`, `or`, `not`입니다. `&&`, `||`, `!`를 쓰면 문법 오류입니다.

```python
# 파일: logic.py
is_member, has_coupon, age = True, False, 17

adult = age >= 19
print("성인?", adult)
print("회원 and 쿠폰 =", is_member and has_coupon)
print("회원 or 쿠폰 =", is_member or has_coupon)
print("not 회원 =", not is_member)

x = 5
print("1 <= x <= 10 →", 1 <= x <= 10)          # Python만 되는 연쇄 비교

count = 0
print("단락 평가 덕분에 안전:", count != 0 and 10 / count > 1)

# and / or 는 True/False가 아니라 '마지막으로 확인한 값'을 돌려준다
print(0 or "기본값", "" or "이름 없음", 3 and 5, 0 and 5)
name = ""
print("이름:", name or "(익명)")

# 참·거짓으로 쓰일 때의 값(truthiness)
print(bool(0), bool(0.0), bool(""), bool([]), bool(None))
print(bool(-1), bool("0"), bool([0]), bool(" "))
print(True == 1, True + True, isinstance(True, int))
```

실행 결과:

```text
성인? False
회원 and 쿠폰 = False
회원 or 쿠폰 = True
not 회원 = False
1 <= x <= 10 → True
단락 평가 덕분에 안전: False
기본값 이름 없음 5 0
이름: (익명)
False False False False False
True True True True
True 2 True
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `1 <= x <= 10`                                  | Python만 되는 **연쇄 비교**입니다. `1 <= x and x <= 10`과 같습니다.                                                               |
| `0 or "기본값"`                                 | `or`는 **처음으로 참인 값**을 돌려줍니다. 0은 거짓이라 `"기본값"`입니다.                                                          |
| `3 and 5`, `0 and 5`                            | `and`는 **처음으로 거짓인 값**을 돌려주고, 모두 참이면 마지막 값을 돌려줍니다. 그래서 5와 0입니다.                                |
| `name or "(익명)"`                              | "`name`이 비었으면 기본값을 쓴다"는 관용구입니다. 다만 0이나 빈 목록도 거짓이라, 0이 올바른 값일 수 있는 경우에는 쓰면 안 됩니다. |
| `bool(0)`, `bool("")`, `bool([])`, `bool(None)` | "비어 있거나 없는" 값은 모두 거짓입니다. `None`은 "값이 없음"을 뜻하는 특별한 값입니다.                                           |
| `bool(-1)`, `bool("0")`, `bool(" ")`            | 음수도, 글자 `"0"`도, 공백 한 칸도 비어 있지 않으므로 참입니다.                                                                   |
| `True == 1`, `True + True`                      | Python의 `bool`은 `int`의 한 종류라 `True`는 1처럼 계산됩니다. `isinstance(True, int)`가 참인 것도 같은 이유입니다.               |

## 8. 실행 추적

할인 조건 `is_member || has_coupon && amount >= 10000`을 회원 `true`, 쿠폰 `false`, 구매액 5000원으로 계산하면서, **어떤 부분이 실제로 계산되는지** 따라갑니다.

| 단계 | 괄호로 드러낸 식                                 | 계산하는 부분           | 결과        |
| ---: | ------------------------------------------------ | ----------------------- | ----------- |
|    0 | `is_member \|\| (has_coupon && amount >= 10000)` | `&&`가 먼저 묶임        |             |
|    1 | `true \|\| (...)`                                | 왼쪽 `is_member`        | `true`      |
|    2 | `\|\|`의 왼쪽이 참                               | 오른쪽은 **계산 안 함** | 전체 `true` |

의도한 식 `(is_member || has_coupon) && amount >= 10000`이라면:

| 단계 | 식                        | 계산하는 부분             | 결과    |
| ---: | ------------------------- | ------------------------- | ------- |
|    1 | `(true \|\| ...)`         | `is_member`가 참이라 단락 | `true`  |
|    2 | `true && amount >= 10000` | `5000 >= 10000`           | `false` |
|    3 | `true && false`           |                           | `false` |

## 9. 다른 예제로 다시 이해하기

**윤년 판별**은 논리 연산의 교과서 같은 예제입니다. 규칙은 "4로 나누어떨어지는 해는 윤년, 단 100으로 나누어떨어지면 평년, 단 400으로 나누어떨어지면 다시 윤년"입니다. 이것을 한 식으로 쓰면 다음과 같습니다.

```text
(4로 나누어떨어짐 && 100으로 나누어떨어지지 않음) || 400으로 나누어떨어짐
```

같은 식을 여러 해에 쓰려고 Rust 함수로 묶었습니다. 함수의 마지막 식이 곧 돌려주는 값입니다(Day 22).

```rust
// 파일: leap_year.rs
fn is_leap(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

fn main() {
    println!("1900년: {}", is_leap(1900));
    println!("2000년: {}", is_leap(2000));
    println!("2024년: {}", is_leap(2024));
    println!("2026년: {}", is_leap(2026));
}
```

실행 결과:

```text
1900년: false
2000년: true
2024년: true
2026년: false
```

각 해에서 식의 조각이 어떻게 계산되는지 Python으로 표를 만들어 확인해 봅시다.

```python
# 파일: leap_table.py
def parts(year):
    div4 = year % 4 == 0
    not100 = year % 100 != 0
    div400 = year % 400 == 0
    return div4, not100, div400, (div4 and not100) or div400


print("연도  4로  100아님  400으로  윤년")
for y in (1900, 2000, 2024, 2026):
    d4, n100, d400, leap = parts(y)
    print(f"{y}  {d4!s:<5} {n100!s:<7} {d400!s:<7} {leap}")
```

실행 결과:

```text
연도  4로  100아님  400으로  윤년
1900  True  False   False   False
2000  True  False   True    True
2024  True  True    False   True
2026  False True    False   False
```

1900년은 4로 나누어떨어지지만 100으로도 나누어떨어져 앞의 괄호가 거짓이고, 400으로는 나누어떨어지지 않아 평년입니다. 2000년은 앞의 괄호가 거짓이지만 400으로 나누어떨어져 `||` 덕분에 윤년입니다. `{d4!s:<5}`의 `!s`는 값을 문자열로 바꾼 뒤 자리를 맞추라는 뜻입니다(불리언에 바로 `:<5`를 쓰면 숫자처럼 1/0으로 출력되기 때문입니다). `for`는 Day 16에서 배웁니다.

C로는 놀이기구 탑승 조건을 **불리언 변수에 이름을 붙여** 나눠 써 봅시다. 긴 조건식을 이름 있는 조각으로 나누면 읽기도, 고치기도 쉽습니다.

```c
// 파일: ride.c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int height = 125, age = 6;
    bool with_parent = true;

    bool tall_enough = height >= 120;
    bool old_enough = age >= 8;
    bool supervised = old_enough || with_parent;
    bool can_ride = tall_enough && supervised;

    printf("키 조건 %d, 나이 조건 %d, 보호 조건 %d → 탑승 %s\n",
           tall_enough, old_enough, supervised, can_ride ? "가능" : "불가");
    return 0;
}
```

실행 결과:

```text
키 조건 1, 나이 조건 0, 보호 조건 1 → 탑승 가능
```

## 10. 논리 연산자 한눈에 보기

| 뜻                    | Rust      | C             | Python         | 단락 평가   |
| --------------------- | --------- | ------------- | -------------- | ----------- |
| 그리고                | `&&`      | `&&`          | `and`          | 함          |
| 또는                  | `\|\|`    | `\|\|`        | `or`           | 함          |
| 아님                  | `!`       | `!`           | `not`          | (해당 없음) |
| 둘 중 하나만(XOR)     | `^`       | `!=`(0/1끼리) | `!=`(bool끼리) | 안 함       |
| 비트 단위 그리고/또는 | `&`, `\|` | `&`, `\|`     | `&`, `\|`      | 안 함       |

`&`와 `|`는 **비트 연산자**입니다. 불리언에 쓰면 결과는 같지만 단락 평가를 하지 않아 양쪽을 모두 계산합니다. 조건에는 `&&`, `||`를 쓰세요.

## 11. 세 언어 비교

| 관점                      | Rust        | C                              | Python                                 |
| ------------------------- | ----------- | ------------------------------ | -------------------------------------- |
| 불리언 자료형             | `bool`      | `bool`(stdbool.h), 사실은 정수 | `bool`(`int`의 한 종류)                |
| 조건 자리에 올 수 있는 값 | `bool`만    | 모든 정수·포인터(0이면 거짓)   | 모든 값(truthiness)                    |
| 논리 연산 결과            | `bool`      | `int` 1 또는 0                 | `and`/`or`는 피연산자 값, `not`은 bool |
| `1 <= x <= 10`            | 컴파일 오류 | 컴파일되지만 뜻이 다름(경고)   | 수학처럼 동작                          |
| 정수 → 참·거짓            | `n != 0`    | 그대로 사용                    | `bool(n)` 또는 그대로 사용             |

## 12. 자주 하는 실수

### 실수 1: 수학처럼 범위를 쓴다 (C)

```c
// 파일: chained.c (컴파일 오류: comparisons like 'X<=Y<=Z' do not have their mathematical meaning)
#include <stdio.h>

int main(void) {
    int x = 50;
    printf("%d\n", 1 <= x <= 10);
    return 0;
}
```

C는 `(1 <= x)`의 결과 1과 10을 비교해 **항상 참**으로 만듭니다. 경고 옵션이 이것을 잡아 줍니다.

### 실수 2: 조건 자리에 정수를 쓴다 (Rust)

```rust
// 파일: int_condition.rs (컴파일 오류: E0308)
fn main() {
    let count = 3;
    if count {
        println!("있음");
    }
}
```

`expected bool, found integer`. `if count != 0`으로 씁니다.

### 실수 3: 대입(=)과 비교(==)를 헷갈린다 (C)

```c
// 파일: assign_in_if.c (컴파일 오류: suggest parentheses around assignment used as truth value)
#include <stdio.h>

int main(void) {
    int score = 50;
    if (score = 100) {
        printf("만점\n");
    }
    return 0;
}
```

`score = 100`은 대입이고, 그 결과 100은 참이라 **항상 "만점"** 이 출력되고 `score`까지 바뀝니다. 경고가 이 실수를 잡아 줍니다. Rust와 Python은 조건 자리의 대입을 문법 오류로 막습니다.

### 실수 4: &&와 ||를 괄호 없이 섞는다

실습의 디버그 문제입니다. `A || B && C`는 `A || (B && C)`입니다.

### 실수 5: Python에서 기호를 쓴다

```python
# 파일: symbols.py (컴파일 오류: SyntaxError)
a, b = True, False
print(a && b)
```

Python은 `and`, `or`, `not`을 씁니다. (`&`, `|`는 문법 오류는 아니지만 비트 연산자라 뜻이 다릅니다.)

## 13. Q&A

**Q. 왜 조건식을 변수에 나눠 담으라고 하나요?**

A. `if height >= 120 && (age >= 8 || with_parent) && !is_closed`처럼 길어지면 한눈에 읽기 어렵습니다. `tall_enough`, `supervised`처럼 이름을 붙이면 조건의 **뜻**이 코드에 드러나고, 중간값을 출력해 어느 조건이 틀렸는지 찾기도 쉬워집니다.

**Q. 단락 평가에서 오른쪽에 부작용이 있는 코드를 넣으면요?**

A. 예를 들어 `is_ok && save_file()`은 `is_ok`가 거짓이면 파일을 저장하지 않습니다. 이것을 일부러 쓰는 코드도 있지만, 읽는 사람이 놓치기 쉬우니 입문 단계에서는 조건문(`if`)으로 분명히 쓰세요.

**Q. Python에서 `x == True`라고 써도 되나요?**

A. 동작은 하지만 필요 없습니다. `if x:`로 충분합니다. 더구나 `x`가 1이나 `"yes"`처럼 참인 다른 값이면 `x == True`는 결과가 달라질 수 있습니다. 반대로 `None`인지 확인할 때는 `x is None`을 씁니다.

**Q. Rust는 왜 정수를 조건으로 못 쓰게 했나요?**

A. C에서 `if (x = 5)`처럼 실수로 대입을 써도 컴파일되는 문제, "0이면 성공인 함수"와 "0이면 실패인 함수"가 섞이는 혼란 같은 오랜 버그의 원인을 없애기 위해서입니다. 조금 더 적더라도 뜻이 분명한 쪽을 택했습니다.

## 14. 핵심 요약

- 불리언은 참과 거짓 두 값입니다. 비교 연산(`== != < > <= >=`)의 결과가 불리언입니다.
- `&&`/`and`는 둘 다 참일 때, `||`/`or`는 하나라도 참일 때 참, `!`/`not`은 반대입니다.
- **단락 평가**: `&&`는 왼쪽이 거짓이면, `||`는 왼쪽이 참이면 오른쪽을 계산하지 않습니다. 안전 검사는 왼쪽에 둡니다.
- `&&`가 `||`보다 먼저 계산됩니다. 섞어 쓸 때는 괄호로 의도를 적습니다.
- 드모르간: `!(A && B) == !A || !B`, `!(A || B) == !A && !B`.
- Rust는 조건에 `bool`만, C는 0이 아니면 참, Python은 truthiness를 쓰고 `and`/`or`가 피연산자 값을 돌려줍니다.
- 범위 검사는 `a <= x && x <= b`(Python은 `a <= x <= b`도 가능).

## 15. 도전 문제

1. **(Rust)** 세 불리언 `a`, `b`, `c`에 대해 "셋 중 정확히 두 개만 참"인지 판별하는 식을 만들어 보세요. `as i32`로 더하는 방법과 논리 연산만 쓰는 방법 두 가지로 해 보세요.
2. **(C)** 점수 `score`가 90 이상이거나, 80 이상이면서 출석률 `attend`가 95 이상이면 "우수"인지 판별하는 식을 쓰고, 드모르간의 법칙으로 "우수가 아님" 조건도 만들어 보세요.
3. **(Python)** `name = input()`으로 이름을 받고, 비어 있으면 `"손님"`을 쓰도록 `or` 관용구로 인사말을 출력하세요.
4. **(세 언어)** 2000년부터 2030년 사이의 윤년이 모두 몇 번인지 세어 보세요(반복문 미리보기: Python `for y in range(2000, 2031):`, Rust `for y in 2000..=2030`, C `for (int y = 2000; y <= 2030; y++)`).
