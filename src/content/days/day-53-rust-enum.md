---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-53-rust-enum
courseId: crp-92
phaseId: phase-05
dayNumber: 53
date: "2026-11-22"
title: Rust enum으로 상태 표현
summary: 여러 경우 중 정확히 하나를 나타내는 Rust enum을 배웁니다. 이름만 있는 변형과 데이터를 담는 변형(구조체 모양, 튜플 모양), 모든 경우를 다뤘는지 검사하는 match와 E0004, 범위·가드·여러 모양을 묶는 패턴, if let과 let-else, matches!, enum에 메서드 붙이기, Option과 Result도 enum이라는 점을 다룹니다. C의 enum(이름 붙은 정수)과 꼬리표 + 공용체(tagged union), switch의 빠진 경우 경고, Python의 Enum 클래스와 match 문(구조 패턴 매칭)을 비교하고, 주문이 장바구니 → 결제 → 발송 → 배달(또는 취소)로만 움직이게 하는 상태 기계를 Rust와 Python으로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-52-rust-method]
learningObjectives:
  - 이름만 있는 변형과 데이터를 담는 변형을 가진 enum을 만들고, match로 모든 경우를 다룬다.
  - 범위, 가드, | 로 묶기, .. 로 나머지 무시하기 같은 패턴과 if let, let-else, matches!를 사용한다.
  - 잘못된 상태를 만들 수 없게 자료형을 설계하고, 상태 전환을 self를 가져가는 메서드로 만든다.
  - C의 enum과 tagged union이 Rust enum과 무엇이 다른지(검사, 안전성) 설명한다.
  - Python Enum과 match 문으로 같은 상태 표현을 만든다.
concepts:
  [
    enum,
    variant,
    data carrying variant,
    match,
    exhaustiveness,
    e0004,
    pattern guard,
    range pattern,
    or pattern,
    if let,
    let else,
    matches macro,
    option,
    result,
    state machine,
    tagged union,
    c enum,
    switch warning,
    python enum,
    structural pattern matching,
  ]
runnerMode: python
playgroundSource: |
  # 파일: match_play.py — Python 3.10의 match 문
  from dataclasses import dataclass

  @dataclass
  class Circle:
      r: float

  def describe(x):
      match x:
          case Circle(r=r) if r > 10:
              return "큰 원"
          case Circle():
              return "원"
          case (a, b):
              return f"쌍 {a}, {b}"
          case _:
              return "모름"

  print(describe(Circle(20)), describe(Circle(1)), describe((1, 2)), describe("x"))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day53-predict-rs
    title: 범위 패턴 예측하기
    kind: predict
    objective: match의 팔을 위에서부터 차례로 검사한다는 것과 범위 패턴을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn classify(n: i32) -> &'static str {
          match n {
              i32::MIN..=-1 => "음수",
              0 => "영",
              1..=9 => "한 자리",
              _ => "큰 수",
          }
      }

      fn main() {
          println!("{} {} {} {}", classify(-3), classify(0), classify(7), classify(42));
      }
    answer: "음수 영 한 자리 큰 수"
    hint: "a..=b는 끝을 포함하는 범위입니다. _는 나머지 모두입니다."
    explanation: "match는 위에서부터 처음 맞는 팔 하나를 실행합니다. -3은 음수 범위, 0은 0, 7은 1..=9, 42는 어느 것에도 맞지 않아 _입니다. 모든 i32가 어느 팔엔가 들어가야 컴파일되므로, _를 지우면 '10 이상이 빠졌다'는 E0004가 납니다."
    commonMistakes:
      - "42가 1..=9에 들어간다고 생각함"
      - "_가 첫 팔이어도 된다고 생각함(그러면 다른 팔에 도달할 수 없음)"
    language: rust
    verification: run
  - id: ex-day53-predict-py
    title: Python Enum 비교 예측하기
    kind: predict
    objective: Enum 멤버는 값과 같지 않고, 값으로 멤버를 찾을 수 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      from enum import Enum


      class Light(Enum):
          RED = 30
          GREEN = 25


      print(Light.RED == 30, Light.RED.value == 30, Light(25))
    answer: "False True Light.GREEN"
    hint: "Light.RED는 30이라는 값을 가진 멤버일 뿐, 30 자체는 아닙니다."
    explanation: "Enum 멤버는 자기만의 객체라 정수 30과 같지 않습니다. 이것이 C의 enum(그냥 정수)과 다른 점입니다. 값이 필요하면 .value, 이름은 .name, 값으로 멤버를 찾으려면 Light(25)입니다. 정수처럼 비교하고 싶다면 IntEnum을 쓰지만, 그러면 잘못된 비교도 조용히 통과할 수 있습니다."
    commonMistakes:
      - "Light.RED == 30이 True라고 생각함"
      - "Light(25)가 오류라고 생각함"
    language: python
    verification: run
  - id: ex-day53-fill
    title: Option의 빈 경우 채우기
    kind: fill
    objective: Option을 match할 때 두 경우를 모두 다룬다.
    prompt: "빈칸을 채워 '10 0'이 출력되게 하세요."
    starter: |-
      fn double(x: Option<i32>) -> i32 {
          match x {
              Some(x) => x * 2,
              _____ => 0,
          }
      }

      fn main() {
          println!("{} {}", double(Some(5)), double(None));
      }
    answer: |-
      fn double(x: Option<i32>) -> i32 {
          match x {
              Some(x) => x * 2,
              None => 0,
          }
      }

      fn main() {
          println!("{} {}", double(Some(5)), double(None));
      }
    output: "10 0"
    hint: "Option은 변형이 둘뿐인 enum입니다. 하나는 Some(값)입니다."
    explanation: "Option<T>는 표준 라이브러리에 enum Option<T> { Some(T), None }으로 정의되어 있습니다. 그래서 match로 두 경우를 다루고, 하나를 빠뜨리면 E0004입니다. Result<T, E>도 Ok(T)와 Err(E) 두 변형의 enum입니다. 널 포인터 대신 enum을 쓰기 때문에 '값이 없을 수 있음'을 잊을 수 없습니다."
    commonMistakes:
      - "Null이나 nil을 씀"
      - "None(x)처럼 값을 꺼내려 함(None에는 데이터가 없음)"
    language: rust
    verification: run
  - id: ex-day53-modify
    title: 문자열 상태를 enum으로 바꾸기
    kind: modify
    objective: 오타가 날 수 있는 문자열 상태를 enum으로 바꿔 컴파일러의 검사를 받는다.
    prompt: '문의 상태를 문자열로 나타내 오타("opne")가 나도 _ 팔에 빠져 모를 수 있습니다. enum Door { Open, Closed, Locked }로 바꾸고, 같은 출력 ''열림 / 닫힘 / 잠김''이 나오게 하세요.'
    starter: |-
      fn describe(d: &str) -> &'static str {
          match d {
              "open" => "열림",
              "closed" => "닫힘",
              _ => "잠김",
          }
      }

      fn main() {
          let doors = ["open", "closed", "locked"];
          let names: Vec<&str> = doors.iter().map(|d| describe(d)).collect();
          println!("{}", names.join(" / "));
      }
    answer: |-
      enum Door {
          Open,
          Closed,
          Locked,
      }

      fn describe(d: &Door) -> &'static str {
          match d {
              Door::Open => "열림",
              Door::Closed => "닫힘",
              Door::Locked => "잠김",
          }
      }

      fn main() {
          let doors = [Door::Open, Door::Closed, Door::Locked];
          let names: Vec<&str> = doors.iter().map(describe).collect();
          println!("{}", names.join(" / "));
      }
    output: "열림 / 닫힘 / 잠김"
    starterOutput: "열림 / 닫힘 / 잠김"
    hint: "문자열은 무엇이든 될 수 있어서 _ 팔이 필요했습니다. enum은 가능한 경우가 셋뿐이라 _가 필요 없습니다."
    explanation: '문자열 상태는 "opne" 같은 오타도 받아서 조용히 ''잠김''으로 처리합니다. enum으로 바꾸면 Door::Opne는 컴파일 오류이고, 나중에 Door::Broken을 추가하면 describe가 그 경우를 다루지 않았다고 컴파일러가 알려 줍니다. _ 팔을 쓰지 않는 것이 이 검사를 살리는 요령입니다.'
    commonMistakes:
      - 'enum으로 바꾼 뒤에도 _ => "잠김"을 남겨 새 변형이 추가돼도 경고가 없음'
      - "Door:: 없이 Open만 써서 이름을 찾지 못함(use Door::*가 필요)"
    language: rust
    verification: run
  - id: ex-day53-debug
    title: 빠진 경우 채우기
    kind: debug
    objective: E0004(모든 경우를 다루지 않음)를 빠진 팔을 추가해 고친다.
    prompt: "이 코드는 E0004(non-exhaustive patterns: `Light::Yellow` not covered) 오류로 컴파일되지 않습니다. 노란불은 3초로 하고 '30 3 25'가 출력되게 하세요."
    starter: |-
      enum Light {
          Red,
          Yellow,
          Green,
      }

      fn seconds(l: Light) -> u32 {
          match l {
              Light::Red => 30,
              Light::Green => 25,
          }
      }

      fn main() {
          println!("{} {} {}", seconds(Light::Red), seconds(Light::Yellow), seconds(Light::Green));
      }
    answer: |-
      enum Light {
          Red,
          Yellow,
          Green,
      }

      fn seconds(l: Light) -> u32 {
          match l {
              Light::Red => 30,
              Light::Yellow => 3,
              Light::Green => 25,
          }
      }

      fn main() {
          println!("{} {} {}", seconds(Light::Red), seconds(Light::Yellow), seconds(Light::Green));
      }
    output: "30 3 25"
    hint: "match가 Light의 세 변형을 모두 다뤄야 합니다."
    explanation: "Rust의 match는 가능한 모든 값을 다뤄야 합니다. 빠뜨린 경우는 실행 중 예상하지 못한 동작이 아니라 컴파일 오류가 됩니다. C의 switch도 -Wall이면 빠진 enum 값을 경고하지만, enum 변수에 아무 정수나 넣을 수 있어서 완전한 보장은 아닙니다. _ => 3으로 고쳐도 되지만, 그러면 나중에 변형을 추가했을 때 알림을 받지 못합니다."
    commonMistakes:
      - "_ => 0을 추가해 노란불이 0초가 됨"
      - "enum에서 Yellow를 지워 main의 Light::Yellow가 오류가 됨"
    language: rust
    verification: run
  - id: ex-day53-independent
    title: C로 주말 판별하기
    kind: independent
    objective: C enum과 switch로 모든 값을 다루는 함수를 만든다.
    prompt: "enum day { MON, TUE, WED, THU, FRI, SAT, SUN }과 int is_weekend(enum day d)를 만들어 'SAT 주말 1, WED 주말 0'을 출력하세요. switch에서 일곱 값을 모두 case로 적어 default 없이 만드세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 enum day와 is_weekend를 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      enum day { MON, TUE, WED, THU, FRI, SAT, SUN };

      int is_weekend(enum day d) {
          switch (d) {
          case SAT:
          case SUN:
              return 1;
          case MON:
          case TUE:
          case WED:
          case THU:
          case FRI:
              return 0;
          }
          return 0;
      }

      int main(void) {
          printf("SAT 주말 %d, WED 주말 %d\n", is_weekend(SAT), is_weekend(WED));
          return 0;
      }
    output: "SAT 주말 1, WED 주말 0"
    hint: "case를 이어 쓰면 여러 값이 같은 코드로 갑니다(아래로 흘러내림)."
    explanation: "default를 쓰지 않고 모든 값을 적으면, 나중에 enum에 값을 추가했을 때 gcc -Wall이 '처리하지 않은 값'을 경고해 줍니다. Rust의 match와 같은 효과를 얻는 요령입니다. switch 뒤의 return 0;은 enum 변수에 범위 밖의 정수가 들어올 수 있는 C의 특성 때문에 필요합니다. Rust의 enum에는 그런 값이 들어갈 수 없습니다."
    commonMistakes:
      - "case SAT: return 1; 에서 break와 return을 헷갈려 흘러내림 버그를 만듦"
      - "default: return 0;을 써서 새 요일 값이 추가돼도 경고를 받지 못함"
    language: c
    verification: run
quiz:
  - id: quiz-day53-01
    question: Rust enum과 C enum의 가장 큰 차이는?
    choices:
      - 차이가 없다
      - Rust enum은 변형마다 다른 데이터를 담을 수 있고, 정해진 변형 외의 값은 만들 수 없다
      - C enum이 더 안전하다
      - Rust enum은 정수로만 쓸 수 있다
    answerIndex: 1
    explanation: C의 enum은 이름 붙은 정수라 아무 정수나 넣을 수 있고, 데이터를 담으려면 구조체와 공용체를 따로 조합해야 합니다(tagged union). Rust enum은 꼬리표와 데이터를 한 자료형으로 묶고, match로 안전하게 꺼내게 합니다.
  - id: quiz-day53-02
    question: match에서 하나의 변형을 빠뜨리면?
    choices:
      - 실행 중에 그 경우는 아무 일도 하지 않는다
      - 컴파일 오류 E0004(non-exhaustive patterns)
      - 경고만 난다
      - 패닉
    answerIndex: 1
    explanation: 모든 경우를 다뤘는지 컴파일러가 검사합니다. 그래서 enum에 변형을 추가하면 그 enum을 match하는 모든 곳을 컴파일러가 찾아 알려 줍니다. _로 나머지를 묶으면 이 알림을 스스로 끄는 셈이니 조심해서 쓰세요.
  - id: quiz-day53-03
    question: "if let Some(x) = value { ... }는 무엇의 줄임인가?"
    choices:
      - for 반복
      - Some(x)인 경우 하나만 다루고 나머지는 아무것도 하지 않는 match
      - 오류 처리
      - 변수 선언
    answerIndex: 1
    explanation: 관심 있는 경우가 하나뿐일 때 match { Some(x) => ..., _ => {} }를 짧게 쓴 것입니다. 반대로 '아니면 여기서 끝낸다'는 let Some(x) = value else { return; };(let-else)로 씁니다.
  - id: quiz-day53-04
    question: 주문 상태 전환 메서드를 fn pay(self, ...) -> Result<Order, ...>처럼 self를 가져가게 만든 이유는?
    choices:
      - 속도 때문에
      - 전환 뒤에는 옛 상태를 쓸 수 없게 해서, 결제 전 상태로 계속 작업하는 실수를 막으려고
      - 반드시 그래야 해서
      - 복사하려고
    answerIndex: 1
    explanation: 옛 상태를 가져가고 새 상태를 돌려주면, 부르는 쪽은 돌려받은 값만 쓸 수 있습니다. 실패하면 원래 상태를 오류와 함께 돌려줘서 잃어버리지 않게 했습니다. 이렇게 자료형으로 상태의 흐름을 표현하는 것을 상태 기계라고 합니다.
  - id: quiz-day53-05
    question: C의 tagged union에서 kind가 RECT인데 u.circle.r을 읽으면?
    choices:
      - 컴파일 오류
      - 정의되지 않은 동작에 가까운 잘못된 값(컴파일러가 막지 않음)
      - 0이 나온다
      - 자동으로 원으로 바뀐다
    answerIndex: 1
    explanation: 공용체는 같은 공간을 여러 모양이 나눠 쓰므로, 어느 모양이 지금 유효한지는 kind를 보고 프로그래머가 지켜야 합니다. Rust의 match는 변형을 확인해야만 안의 데이터를 꺼낼 수 있게 해서 이런 실수를 불가능하게 만듭니다.
---

## 1. 오늘 배울 내용

Day 50~52에서 구조체로 "이것**과** 저것"(x와 y, 이름과 점수)을 묶었습니다. 오늘은 "이것 **또는** 저것"(빨강 또는 노랑 또는 초록, 원 또는 사각형)을 나타내는 **enum**을 배웁니다.

1. enum의 두 모양
   - 이름만 있는 변형: `Light::Red`
   - 데이터를 담는 변형: `Shape::Circle { r }`, `Shape::Triangle(a, b, c)`
2. `match`
   - 모든 경우를 다뤘는지 검사(E0004)
   - 패턴: 범위(`1..=9`), 가드(`if x < 0`), 묶기(`A | B`), 나머지 무시(`{ .. }`), 나머지 모두(`_`)
3. 짧게 쓰는 도구: `if let`, `let-else`, `matches!`
4. enum에 메서드 붙이기
5. `Option`과 `Result`도 enum이라는 것
6. 비교
   - C: `enum`(이름 붙은 정수), 꼬리표 + 공용체(tagged union), `switch`의 빠진 경우 경고
   - Python: `Enum` 클래스, `match` 문(구조 패턴 매칭)
7. 주문이 **정해진 순서로만** 움직이는 상태 기계를 Rust와 Python으로 만듭니다.

## 2. 왜 필요한가

프로그램의 많은 값은 "몇 가지 중 하나"입니다.

- 신호등은 빨강, 노랑, 초록 중 하나입니다.
- 도형은 원, 사각형, 삼각형 중 하나이고, 종류마다 필요한 값이 다릅니다.
- 주문은 장바구니, 결제됨, 발송됨, 배달됨, 취소됨 중 하나입니다.

이런 값을 문자열(`"paid"`)이나 정수(`2`), 또는 `bool` 필드 여러 개(`is_paid`, `is_shipped`)로 나타내면 문제가 생깁니다.

- `"piad"` 같은 오타를 아무도 알려 주지 않습니다.
- `is_paid = false`인데 `is_shipped = true`인 **말이 안 되는 상태**를 만들 수 있습니다.
- 새 상태를 추가했을 때, 그 상태를 처리하지 않은 코드를 찾기 어렵습니다.

enum은 가능한 경우를 **자료형으로 못박아서**, 잘못된 상태를 아예 만들 수 없게 합니다. 이것을 흔히 "잘못된 상태를 표현할 수 없게 만든다"고 말합니다.

## 3. 그림으로 이해하기

**구조체와 enum.**

```text
struct Rect { w, h }        ← w 그리고 h (둘 다 있다)
enum Shape {                ← 셋 중 정확히 하나
    Circle { r },
    Rect { w, h },
    Triangle(a, b, c),
}
```

**enum 값의 속.** 어느 변형인지 알려 주는 꼬리표와, 그 변형의 데이터가 들어 있습니다.

```text
Shape::Rect { w: 2.0, h: 3.5 }
┌──────────┬───────────────────────────┐
│ 꼬리표: 1  │ w = 2.0, h = 3.5          │
└──────────┴───────────────────────────┘
Shape::Circle { r: 1.0 }
┌──────────┬───────────────────────────┐
│ 꼬리표: 0  │ r = 1.0   (나머지 공간은 비어 있음) │
└──────────┴───────────────────────────┘
크기 = 꼬리표 + 가장 큰 변형의 데이터
```

C의 tagged union은 이 모양을 **손으로** 만든 것이고, Rust는 꼬리표를 확인해야만 데이터를 꺼낼 수 있게 합니다.

**상태 기계.** 주문이 움직일 수 있는 길만 화살표로 있습니다.

```text
Cart ──pay──▶ Paid ──ship──▶ Shipped ──deliver──▶ Delivered
  │             │               │
  └────cancel───┴──────cancel───┴──────▶ Cancelled
그 밖의 전환(Cart에서 ship, Delivered에서 cancel 등)은 오류
```

## 4. 천천히 풀어보기

### 4.1 패턴 모음

| 패턴                       | 뜻                                | 예                                            |
| -------------------------- | --------------------------------- | --------------------------------------------- |
| `Light::Red`               | 그 변형                           | `Light::Red => 30`                            |
| `Shape::Rect { w, h }`     | 변형의 필드를 이름으로 꺼냄       | `=> w * h`                                    |
| `Shape::Triangle(a, b, c)` | 튜플 모양 변형의 값을 차례로 꺼냄 | `=> 헤론의 공식`                              |
| `Order::Paid { .. }`       | 필드는 무시                       | `=> Ok(...)`                                  |
| `A \| B`                   | 둘 중 하나                        | `Order::Delivered \| Order::Cancelled { .. }` |
| `1..=9`                    | 범위(끝 포함)                     | `1..=9 => "한 자리"`                          |
| `Some(x) if x < 0`         | 가드: 모양이 맞고 조건도 참일 때  | `=> "음수"`                                   |
| `Order::Cart { items: 0 }` | 필드 값까지 정함                  | 빈 장바구니만                                 |
| `other`, `_`               | 나머지 모두(이름을 붙이거나 버림) | `other => Err(...)`                           |

팔은 **위에서부터** 검사하므로, 구체적인 것을 먼저, `_`를 마지막에 둡니다.

### 4.2 짧게 쓰는 도구

- `if let Some(x) = v { ... }`: 관심 있는 경우가 하나일 때
- `let Some(x) = v else { return; };`: 아니면 곧바로 끝낼 때(let-else)
- `matches!(s, Shape::Rect { .. })`: 모양이 맞는지 `bool`로만 알고 싶을 때

### 4.3 상태 전환 설계

주문 상태를 바꾸는 메서드를 `fn pay(self, ...) -> Result<Order, (Order, String)>`로 만들었습니다.

- `self`를 **가져가서** 옛 상태로 계속 일하는 실수를 막습니다(Day 52).
- 성공하면 새 상태를, 실패하면 **원래 상태와 이유**를 함께 돌려줘서 상태를 잃지 않습니다.
- 각 메서드는 "어떤 상태에서 이 전환이 가능한가"를 `match`로 적습니다. 목록에 없는 경우는 모두 오류입니다.

### 4.4 C와 Python에서는

- **C**: `enum light { RED, YELLOW, GREEN };`은 정수 0, 1, 2에 이름을 붙인 것입니다. 데이터를 담으려면 `struct { enum kind kind; union { ... } u; }`처럼 꼬리표와 공용체를 조합합니다. `switch`에서 빠진 `enum` 값은 `-Wall`이 경고해 줍니다.
- **Python**: `class Light(Enum)`은 이름과 값을 가진 멤버들을 만듭니다. 데이터를 담는 변형은 `dataclass` 여러 개로 표현하고, Python 3.10의 `match` 문으로 모양에 따라 나눕니다. 모든 경우를 다뤘는지는 검사하지 않아서 `case _:`로 모르는 값을 처리합니다.

## 5. Rust로 구현하기

```rust
// 파일: enums.rs
#[derive(Debug, Clone, Copy, PartialEq)]
enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(self) -> Light {                // 모든 경우를 다뤄야 컴파일된다
        match self {
            Light::Red => Light::Green,
            Light::Green => Light::Yellow,
            Light::Yellow => Light::Red,
        }
    }

    fn seconds(self) -> u32 {
        match self {
            Light::Red => 30,
            Light::Yellow => 3,
            Light::Green => 25,
        }
    }
}

#[derive(Debug)]
enum Shape {                                // 변형마다 다른 데이터를 담는다
    Circle { r: f64 },
    Rect { w: f64, h: f64 },
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { r } => 3.14159 * r * r,
            Shape::Rect { w, h } => w * h,
            Shape::Triangle(a, b, c) => {
                let s = (a + b + c) / 2.0;  // 헤론의 공식
                (s * (s - a) * (s - b) * (s - c)).sqrt()
            }
        }
    }
}

fn describe(n: Option<i32>) -> String {     // Option도 enum이다: Some(값) 또는 None
    match n {
        Some(0) => String::from("영"),
        Some(x) if x < 0 => format!("음수 {x}"),
        Some(x) => format!("양수 {x}"),
        None => String::from("값 없음"),
    }
}

fn main() {
    let mut light = Light::Red;
    for _ in 0..4 {
        print!("{light:?}({}초) → ", light.seconds());
        light = light.next();
    }
    println!("{light:?}");

    let shapes = [Shape::Circle { r: 1.0 }, Shape::Rect { w: 2.0, h: 3.5 }, Shape::Triangle(3.0, 4.0, 5.0)];
    for s in &shapes {
        println!("{s:?} 넓이 {:.2}", s.area());
    }
    let rects = shapes.iter().filter(|s| matches!(s, Shape::Rect { .. })).count();
    println!("사각형 개수 {rects}");

    println!("{} / {} / {} / {}", describe(Some(0)), describe(Some(-4)), describe(Some(7)), describe(None));
    if let Some(x) = "42".parse::<i32>().ok() {
        println!("if let으로 꺼냄: {x}");
    }
    let Some(first) = shapes.first() else {  // 없으면 여기서 끝내는 let-else
        return;
    };
    println!("첫 도형: {first:?}");
}
```

실행 결과:

```text
Red(30초) → Green(25초) → Yellow(3초) → Red(30초) → Green
Circle { r: 1.0 } 넓이 3.14
Rect { w: 2.0, h: 3.5 } 넓이 7.00
Triangle(3.0, 4.0, 5.0) 넓이 6.00
사각형 개수 1
영 / 음수 -4 / 양수 7 / 값 없음
if let으로 꺼냄: 42
첫 도형: Circle { r: 1.0 }
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `#[derive(Debug, Clone, Copy, PartialEq)] enum Light` | 데이터가 없는 enum은 작아서 `Copy`로 만들었습니다. 그래서 `fn next(self)`로 받아도 원래 값을 계속 쓸 수 있습니다. |
| `fn next(self) -> Light { match self { ... } }`       | 세 변형을 모두 다뤘습니다. 하나를 지우면 E0004입니다.                                                             |
| `Circle { r: f64 }`, `Triangle(f64, f64, f64)`        | 변형마다 담는 데이터의 모양이 다릅니다. 구조체 모양은 이름으로, 튜플 모양은 순서로 꺼냅니다.                      |
| `Shape::Circle { r } => 3.14159 * r * r`              | `&self`를 `match`하면 `r`은 `&f64`입니다. 곱셈이 참조를 알아서 따라가 줍니다.                                     |
| `Shape::Triangle(a, b, c) => { ... }`                 | 팔의 몸통이 여러 줄이면 블록으로 씁니다. 마지막 식이 그 팔의 값입니다.                                            |
| `matches!(s, Shape::Rect { .. })`                     | 사각형인지 `bool`로만 확인합니다. `{ .. }`는 필드를 모두 무시합니다.                                              |
| `Some(0) =>`, `Some(x) if x < 0 =>`, `Some(x) =>`     | 구체적인 값, 가드, 일반 경우 순서입니다. 순서를 바꾸면 `Some(x)`가 모두 가져가 버립니다.                          |
| `let Some(first) = shapes.first() else { return; };`  | 첫 도형이 없으면 `main`을 끝냅니다. 이후 코드에서는 `first`를 바로 쓸 수 있습니다.                                |

## 6. C로 구현하기

```c
// 파일: tagged_union.c
#include <math.h>
#include <stdio.h>

enum light { RED, YELLOW, GREEN };          // C의 enum은 이름 붙은 정수

enum light next_light(enum light l) {
    switch (l) {
    case RED: return GREEN;
    case GREEN: return YELLOW;
    case YELLOW: return RED;
    }
    return RED;                             // 엉뚱한 정수가 들어올 수도 있어서
}

const char *light_name(enum light l) {
    static const char *names[] = {"Red", "Yellow", "Green"};
    return names[l];
}

enum shape_kind { CIRCLE, RECT, TRIANGLE };

struct shape {                              // 꼬리표(kind) + 공용체(데이터)
    enum shape_kind kind;
    union {
        struct { double r; } circle;
        struct { double w, h; } rect;
        struct { double a, b, c; } tri;
    } u;                                    // 한 번에 하나의 모양만 쓴다(같은 공간을 나눠 씀)
};

double area(const struct shape *s) {
    switch (s->kind) {
    case CIRCLE: return 3.14159 * s->u.circle.r * s->u.circle.r;
    case RECT: return s->u.rect.w * s->u.rect.h;
    case TRIANGLE: {
        double a = s->u.tri.a, b = s->u.tri.b, c = s->u.tri.c;
        double p = (a + b + c) / 2.0;
        return sqrt(p * (p - a) * (p - b) * (p - c));
    }
    }
    return 0.0;
}

int main(void) {
    enum light l = RED;
    for (int i = 0; i < 4; i++) {
        printf("%s → ", light_name(l));
        l = next_light(l);
    }
    printf("%s\n", light_name(l));
    printf("GREEN의 정수 값 %d\n", GREEN);

    struct shape shapes[] = {
        {.kind = CIRCLE, .u.circle = {1.0}},
        {.kind = RECT, .u.rect = {2.0, 3.5}},
        {.kind = TRIANGLE, .u.tri = {3.0, 4.0, 5.0}},
    };
    for (int i = 0; i < 3; i++) {
        printf("모양 %d 넓이 %.2f\n", shapes[i].kind, area(&shapes[i]));
    }
    return 0;
}
```

실행 결과:

```text
Red → Green → Yellow → Red → Green
GREEN의 정수 값 2
모양 0 넓이 3.14
모양 1 넓이 7.00
모양 2 넓이 6.00
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                                             |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `enum light { RED, YELLOW, GREEN };`                       | 0, 1, 2에 이름을 붙였습니다. `printf("%d", GREEN)`이 2인 것처럼 정수로 쓰입니다.                                 |
| `switch (l) { case RED: ... }` 뒤의 `return RED;`          | 모든 경우를 적었지만, `enum light l = 7;`처럼 범위 밖 값이 들어올 수 있어서 함수 끝에도 돌려줄 값이 필요합니다.  |
| `static const char *names[] = {...}; return names[l];`     | 이름을 출력하려면 표를 직접 만들어야 합니다. Rust는 `derive(Debug)`가 해 줍니다.                                 |
| `struct shape { enum shape_kind kind; union { ... } u; };` | 꼬리표 + 공용체입니다. 공용체의 세 모양은 **같은 공간**을 나눠 쓰고, 어느 모양이 유효한지는 `kind`로 약속합니다. |
| `{.kind = CIRCLE, .u.circle = {1.0}}`                      | 이름 붙인 초기화로 공용체의 한 모양만 채웠습니다.                                                                |
| `case TRIANGLE: { ... }`                                   | `case` 안에서 변수를 선언하려면 블록이 필요합니다.                                                               |
| `-lm`                                                      | `sqrt`를 쓰려면 수학 라이브러리를 연결해야 합니다(이 과정의 검사도 `-lm`을 붙입니다).                            |

`kind`가 `RECT`인데 `s->u.circle.r`을 읽는 실수를 C 컴파일러는 막지 못합니다. Rust의 `match`는 꼬리표를 확인한 팔 안에서만 그 변형의 데이터를 꺼낼 수 있게 해서 이 실수를 없앱니다.

## 7. Python으로 구현하기

```python
# 파일: enums_py.py
from dataclasses import dataclass
from enum import Enum
import math


class Light(Enum):
    RED = 30                                # 값으로 초 수를 담았다
    YELLOW = 3
    GREEN = 25

    def next(self):
        return {Light.RED: Light.GREEN, Light.GREEN: Light.YELLOW, Light.YELLOW: Light.RED}[self]


light = Light.RED
steps = []
for _ in range(4):
    steps.append(f"{light.name}({light.value}초)")
    light = light.next()
print(" → ".join(steps), "→", light.name)


@dataclass
class Circle:
    r: float


@dataclass
class Rect:
    w: float
    h: float


def area(shape):
    match shape:                            # 구조 패턴 매칭(Python 3.10+)
        case Circle(r=r):
            return 3.14159 * r * r
        case Rect(w=w, h=h):
            return w * h
        case (a, b, c):                     # 세 변의 튜플
            s = (a + b + c) / 2
            return math.sqrt(s * (s - a) * (s - b) * (s - c))
        case _:
            raise TypeError(f"모르는 도형: {shape!r}")


for s in [Circle(1.0), Rect(2.0, 3.5), (3.0, 4.0, 5.0)]:
    print(f"{s} 넓이 {area(s):.2f}")
try:
    area("별")
except TypeError as e:
    print("TypeError:", e)
```

실행 결과:

```text
RED(30초) → GREEN(25초) → YELLOW(3초) → RED(30초) → GREEN
Circle(r=1.0) 넓이 3.14
Rect(w=2.0, h=3.5) 넓이 7.00
(3.0, 4.0, 5.0) 넓이 6.00
TypeError: 모르는 도형: '별'
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `class Light(Enum): RED = 30`         | 멤버마다 이름(`RED`)과 값(`30`)이 있습니다. 여기서는 값으로 초 수를 담았습니다.                                            |
| `{Light.RED: Light.GREEN, ...}[self]` | 사전으로 다음 상태를 찾습니다. 빠진 멤버가 있으면 실행할 때 `KeyError`가 나서 알게 됩니다. Rust는 컴파일할 때 알려 줍니다. |
| `match shape: case Circle(r=r):`      | `Circle` 객체이면 `r` 속성을 꺼냅니다. `dataclass`는 이런 패턴에 필요한 정보를 자동으로 만들어 줍니다.                     |
| `case (a, b, c):`                     | 길이 3인 시퀀스(튜플, 리스트)와 맞습니다. 문자열은 시퀀스이지만 이 패턴에는 맞지 않도록 정해져 있습니다.                   |
| `case _:` → `raise TypeError`         | Python은 모든 경우를 다뤘는지 검사하지 않으므로, 모르는 값은 직접 처리해야 합니다.                                         |

## 8. 실행 추적

Rust의 `describe`가 `Some(-4)`를 받았을 때 팔을 검사하는 순서를 따라갑니다.

| 순서 | 팔                 | 모양이 맞나?    | 가드 | 결과          |
| ---- | ------------------ | --------------- | ---- | ------------- |
| 1    | `Some(0)`          | 아니요(-4 ≠ 0)  | -    | 다음 팔       |
| 2    | `Some(x) if x < 0` | 예(x = -4)      | 참   | **"음수 -4"** |
| 3    | `Some(x)`          | (검사하지 않음) |      |               |
| 4    | `None`             | (검사하지 않음) |      |               |

`Some(7)`이면 2번 팔의 가드가 거짓이라 3번 팔로 갑니다. 가드는 "모양은 맞지만 조건이 거짓"이면 다음 팔로 넘어간다는 점이 `if`와 다릅니다.

## 9. 다른 예제로 다시 이해하기

**주문 상태 기계.** 주문은 3절의 그림처럼만 움직입니다. 가능한 전환은 새 상태를, 불가능한 전환은 이유와 함께 **원래 상태**를 돌려줍니다. 일부러 잘못된 동작(결제 전 발송, 두 번 결제, 취소 뒤 배달)을 섞어 시험합니다.

```rust
// 파일: order_state.rs
#[derive(Debug, Clone, PartialEq)]
enum Order {
    Cart { items: u32 },
    Paid { amount: u32 },
    Shipped { tracking: String },
    Delivered,
    Cancelled { reason: String },
}

impl Order {
    // 상태를 가져가(self) 다음 상태를 돌려준다. 할 수 없는 전환이면 원래 상태와 함께 오류
    fn pay(self, price_each: u32) -> Result<Order, (Order, String)> {
        match self {
            Order::Cart { items: 0 } => Err((self, String::from("빈 장바구니는 결제할 수 없음"))),
            Order::Cart { items } => Ok(Order::Paid { amount: items * price_each }),
            other => Err((other, String::from("장바구니 상태에서만 결제"))),
        }
    }

    fn ship(self, tracking: &str) -> Result<Order, (Order, String)> {
        match self {
            Order::Paid { .. } => Ok(Order::Shipped { tracking: tracking.to_string() }),
            other => Err((other, String::from("결제된 주문만 발송"))),
        }
    }

    fn deliver(self) -> Result<Order, (Order, String)> {
        match self {
            Order::Shipped { .. } => Ok(Order::Delivered),
            other => Err((other, String::from("발송된 주문만 배달 완료"))),
        }
    }

    fn cancel(self, reason: &str) -> Result<Order, (Order, String)> {
        match self {
            Order::Delivered | Order::Cancelled { .. } => Err((self, String::from("이미 끝난 주문"))),
            _ => Ok(Order::Cancelled { reason: reason.to_string() }),
        }
    }
}

fn step(order: Order, action: &str) -> Order {
    let result = match action {
        "pay" => order.pay(12000),
        "ship" => order.ship("KR-1234"),
        "deliver" => order.deliver(),
        "cancel" => order.cancel("마음이 바뀜"),
        _ => Err((order, format!("모르는 동작 {action}"))),
    };
    match result {
        Ok(next) => {
            println!("{action:<8} → {next:?}");
            next
        }
        Err((same, why)) => {
            println!("{action:<8} ✗ {why} (그대로 {same:?})");
            same
        }
    }
}

fn main() {
    let mut order = Order::Cart { items: 3 };
    for action in ["ship", "pay", "pay", "ship", "cancel", "deliver", "cancel"] {
        order = step(order, action);
    }
    println!("마지막: {order:?}, 끝났나? {}", matches!(order, Order::Delivered | Order::Cancelled { .. }));
}
```

실행 결과:

```text
ship     ✗ 결제된 주문만 발송 (그대로 Cart { items: 3 })
pay      → Paid { amount: 36000 }
pay      ✗ 장바구니 상태에서만 결제 (그대로 Paid { amount: 36000 })
ship     → Shipped { tracking: "KR-1234" }
cancel   → Cancelled { reason: "마음이 바뀜" }
deliver  ✗ 발송된 주문만 배달 완료 (그대로 Cancelled { reason: "마음이 바뀜" })
cancel   ✗ 이미 끝난 주문 (그대로 Cancelled { reason: "마음이 바뀜" })
마지막: Cancelled { reason: "마음이 바뀜" }, 끝났나? true
```

| 코드                                                              | 설명                                                                                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `enum Order { Cart { items }, Paid { amount }, ... }`             | 상태마다 필요한 데이터만 가집니다. "결제 금액이 있는 장바구니" 같은 말이 안 되는 상태는 만들 수 없습니다.             |
| `fn pay(self, price_each: u32) -> Result<Order, (Order, String)>` | 옛 상태를 가져가고, 실패하면 튜플로 원래 상태와 이유를 돌려줍니다.                                                    |
| `Order::Cart { items: 0 } => Err(...)`                            | 필드 값까지 정한 패턴입니다. 다음 팔 `Order::Cart { items }`보다 위에 있어야 합니다.                                  |
| `other => Err((other, ...))`                                      | 나머지 상태에 이름을 붙여 그대로 돌려줍니다. `_`로 쓰면 값이 버려져 돌려줄 수 없습니다.                               |
| `Order::Delivered \| Order::Cancelled { .. } => Err((self, ...))` | 끝난 두 상태를 묶었습니다. 패턴 안에서 값을 옮기지 않았으므로 `self`를 그대로 돌려줄 수 있습니다.                     |
| `fn step(order: Order, action: &str) -> Order`                    | 결과가 `Ok`든 `Err`든 다음에 쓸 상태를 돌려줍니다. 그래서 `main`의 반복이 `order = step(order, action);` 한 줄입니다. |

Python에서는 상태마다 `dataclass`를 만들고, `(상태, 동작)` 쌍을 `match`로 나눕니다.

```python
# 파일: order_state.py
from dataclasses import dataclass


@dataclass(frozen=True)                     # 바꿀 수 없는 상태 값
class Cart:
    items: int


@dataclass(frozen=True)
class Paid:
    amount: int


@dataclass(frozen=True)
class Shipped:
    tracking: str


@dataclass(frozen=True)
class Delivered:
    pass


@dataclass(frozen=True)
class Cancelled:
    reason: str


class TransitionError(Exception):
    pass


def apply(order, action):
    match (order, action):
        case (Cart(items=0), "pay"):
            raise TransitionError("빈 장바구니는 결제할 수 없음")
        case (Cart(items=n), "pay"):
            return Paid(n * 12000)
        case (_, "pay"):
            raise TransitionError("장바구니 상태에서만 결제")
        case (Paid(), "ship"):
            return Shipped("KR-1234")
        case (_, "ship"):
            raise TransitionError("결제된 주문만 발송")
        case (Shipped(), "deliver"):
            return Delivered()
        case (_, "deliver"):
            raise TransitionError("발송된 주문만 배달 완료")
        case (Delivered() | Cancelled(), "cancel"):
            raise TransitionError("이미 끝난 주문")
        case (_, "cancel"):
            return Cancelled("마음이 바뀜")
        case _:
            raise TransitionError(f"모르는 동작 {action}")


order = Cart(3)
for action in ["ship", "pay", "pay", "ship", "cancel", "deliver", "cancel"]:
    try:
        order = apply(order, action)
        print(f"{action:<8} → {order}")
    except TransitionError as e:
        print(f"{action:<8} ✗ {e} (그대로 {order})")
print("마지막:", order, "끝났나?", isinstance(order, (Delivered, Cancelled)))
```

실행 결과:

```text
ship     ✗ 결제된 주문만 발송 (그대로 Cart(items=3))
pay      → Paid(amount=36000)
pay      ✗ 장바구니 상태에서만 결제 (그대로 Paid(amount=36000))
ship     → Shipped(tracking='KR-1234')
cancel   → Cancelled(reason='마음이 바뀜')
deliver  ✗ 발송된 주문만 배달 완료 (그대로 Cancelled(reason='마음이 바뀜'))
cancel   ✗ 이미 끝난 주문 (그대로 Cancelled(reason='마음이 바뀜'))
마지막: Cancelled(reason='마음이 바뀜') 끝났나? True
```

- `@dataclass(frozen=True)`는 만든 뒤 필드를 바꿀 수 없는 값입니다. 상태를 바꾸는 대신 **새 상태 객체**를 만드는 설계와 잘 맞습니다.
- `match (order, action):`처럼 튜플로 묶어 두 값의 조합을 한 번에 나눕니다. `case (_, "pay"):`는 "장바구니가 아닌 어떤 상태에서든 결제"입니다.
- 오류는 예외로 알리고, `apply`가 대입 전에 예외를 내므로 `order`가 그대로 남습니다(Day 48의 계산기와 같은 모양).
- 새 상태 클래스를 추가해도 Python은 어느 `case`가 빠졌는지 알려 주지 않습니다. 시험(Day 55)으로 확인해야 합니다.

## 10. 경우 나누기 대응표

| 하고 싶은 일           | Rust                               | C                                    | Python                         |
| ---------------------- | ---------------------------------- | ------------------------------------ | ------------------------------ |
| 이름 있는 몇 가지 값   | `enum Light { Red, ... }`          | `enum light { RED, ... }`(정수)      | `class Light(Enum)`            |
| 데이터를 담는 경우들   | `enum Shape { Circle { r }, ... }` | 꼬리표 + `union`                     | `dataclass` 여러 개(또는 튜플) |
| 경우 나누기            | `match`                            | `switch`                             | `match` 문(3.10+), `if`/`elif` |
| 빠진 경우 검사         | 컴파일 오류(E0004)                 | `-Wall` 경고(범위 밖 정수는 못 막음) | 없음(`case _:`로 직접)         |
| 데이터 꺼내기의 안전성 | 변형을 확인해야만 꺼냄             | 약속(`kind` 확인)                    | 패턴이 맞을 때만 이름에 묶임   |
| 값이 없을 수 있음      | `Option<T>`                        | `NULL`, 특별한 값                    | `None`                         |
| 실패할 수 있음         | `Result<T, E>`                     | 반환 코드                            | 예외                           |

## 11. 세 언어 비교

| 관점             | Rust                          | C            | Python                                   |
| ---------------- | ----------------------------- | ------------ | ---------------------------------------- |
| enum의 정체      | 꼬리표 + 데이터를 가진 자료형 | 정수         | 멤버 객체를 가진 클래스                  |
| 범위 밖 값       | 만들 수 없음                  | 넣을 수 있음 | 만들 수 없음(`Light(99)`는 `ValueError`) |
| 패턴 매칭        | 강력하고 검사됨               | 정수 비교만  | 강력하지만 검사 안 됨                    |
| 잘못된 상태 막기 | 자료형으로                    | 약속으로     | 약속과 시험으로                          |

## 12. 자주 하는 실수

### 실수 1: match에서 경우를 빠뜨린다 (Rust)

```rust
// 파일: missing_arm.rs (컴파일 오류: E0004)
enum Light {
    Red,
    Yellow,
    Green,
}

fn seconds(l: Light) -> u32 {
    match l {
        Light::Red => 30,
        Light::Green => 25,
    }
}

fn main() {
    println!("{}", seconds(Light::Yellow));
}
```

실습의 디버그 문제입니다. 빠진 팔을 추가하세요.

### 실수 2: switch에서 enum 값을 빠뜨린다 (C)

```c
// 파일: missing_case.c (컴파일 오류: not handled in switch)
#include <stdio.h>

enum light { RED, YELLOW, GREEN };

int seconds(enum light l) {
    switch (l) {
    case RED: return 30;
    case GREEN: return 25;
    }
    return 0;
}

int main(void) {
    printf("%d\n", seconds(YELLOW));
    return 0;
}
```

`-Wall`의 `-Wswitch`가 알려 줍니다(이 과정에서는 오류). `default:`를 쓰면 이 경고가 사라지니, 모든 값을 적는 편이 안전합니다.

### 실수 3: _ 팔로 모든 것을 삼킨다 (세 언어)

`_ => ...`를 쓰면 나중에 변형을 추가해도 컴파일러가 알려 주지 않고, 새 경우가 조용히 기본 처리로 빠집니다. 정말 "나머지는 모두 같게" 처리할 때만 쓰세요.

### 실수 4: 구체적인 팔을 일반적인 팔 뒤에 둔다 (Rust, Python)

`Some(x) => ...` 뒤에 `Some(0) => ...`를 두면 0도 앞의 팔이 가져갑니다. Rust는 도달할 수 없는 팔이라고 경고하고(`unreachable pattern`), Python은 아무 말 없이 넘어갑니다. 구체적인 것부터 쓰세요.

### 실수 5: Python Enum 멤버를 값과 비교한다

`Light.RED == 30`은 `False`입니다(실습의 예측 문제). 멤버끼리 비교하거나 `.value`를 쓰세요. 반대로 C의 enum은 정수라서 `RED == 0`이 참이고, `light + 1` 같은 계산도 됩니다.

## 13. Q&A

**Q. enum과 트레이트(Day 54) 중 무엇으로 여러 종류를 표현하나요?**

A. 종류가 **정해져 있고** 한곳에서 모두 다룰 수 있으면 enum이 좋습니다(도형 세 가지, 주문 상태). 종류가 **나중에 계속 늘어나고**, 다른 사람이 새 종류를 추가할 수 있어야 하면 트레이트가 좋습니다(플러그인, 여러 종류의 출력 장치). enum은 새 **동작**을 추가하기 쉽고, 트레이트는 새 **종류**를 추가하기 쉽습니다.

**Q. enum의 크기는 얼마인가요?**

A. 가장 큰 변형의 데이터 + 꼬리표(맞춤 여백 포함)입니다. 한 변형만 아주 크면 모든 값이 그 크기를 차지하므로, 큰 변형의 데이터를 `Box`로 감싸기도 합니다(Day 41). `Option<Box<T>>`처럼 꼬리표를 널 주소로 대신하는 최적화도 있습니다.

**Q. Rust enum에 정수 값을 붙일 수 있나요?**

A. 데이터가 없는 enum은 `enum Light { Red = 30, Yellow = 3, Green = 25 }`처럼 값을 정하고 `Light::Red as u32`로 꺼낼 수 있습니다. 하지만 정수에서 enum으로 바꾸는 것은 자동이 아니어서(`30`이 아닌 값이 올 수 있으니), `match`로 직접 바꾸거나 `TryFrom`을 구현합니다.

**Q. Python의 match는 Rust의 match와 같은가요?**

A. 모양은 비슷하지만 두 가지가 다릅니다. Python은 모든 경우를 다뤘는지 검사하지 않고, `case x:`처럼 이름만 쓰면 **모든 값**과 맞으면서 그 이름에 대입됩니다(상수와 비교하려면 `case Light.RED:`처럼 점이 있는 이름을 써야 합니다). 이 차이 때문에 생기는 실수가 흔합니다.

## 14. 핵심 요약

- enum은 "여러 경우 중 **정확히 하나**"를 나타냅니다. 변형은 이름만 가질 수도, 구조체·튜플 모양의 데이터를 담을 수도 있습니다.
- `match`는 **모든 경우**를 다뤄야 하고(E0004), 위에서부터 처음 맞는 팔을 실행합니다. 범위, 가드, `|`, `..`, `_` 패턴과 `if let`, `let-else`, `matches!`를 씁니다.
- `Option`과 `Result`도 enum입니다. 널 포인터와 반환 코드 대신 쓰여서 "없음"과 "실패"를 잊을 수 없게 합니다.
- 상태를 enum으로 만들고 전환을 `self`를 가져가는 메서드로 만들면, **잘못된 상태와 잘못된 전환**을 자료형으로 막을 수 있습니다.
- C의 enum은 정수, 데이터를 담으려면 꼬리표 + 공용체를 손으로 조합하며 안전성은 약속입니다. Python은 `Enum`과 `match` 문으로 비슷하게 표현하지만 빠진 경우를 검사하지 않습니다.

## 15. 도전 문제

1. **(Rust)** 주문 상태 기계에 `Returned { reason: String }`(배달 뒤 반품) 상태와 `fn return_item(self, reason: &str)` 전환을 추가하세요. 추가한 뒤 컴파일러가 어떤 `match`를 고치라고 하는지 확인합니다.
2. **(Rust)** `enum Token { Num(i64), Plus, Minus, Times, LParen, RParen }`을 만들고, `"12+3*(4-1)"`을 토큰 목록으로 나누는 `fn tokenize(s: &str) -> Result<Vec<Token>, String>`를 만드세요. Day 41의 수식 트리와 이어 붙이면 작은 계산기가 됩니다.
3. **(C)** 도형 tagged union에 `print_shape(const struct shape *s)`를 추가하고, `kind`에 맞지 않는 공용체 필드를 읽지 않도록 `switch`로 나누세요. 새 도형 `SQUARE`를 추가했을 때 `-Wall`이 어떤 경고를 주는지 확인하세요.
4. **(Python)** 주문 상태 기계를 `Enum`(상태 이름)과 "허용된 전환 표"(`{(Status.CART, "pay"): Status.PAID, ...}` 사전)로 다시 만들고, 두 설계의 장단점을 비교하세요.
