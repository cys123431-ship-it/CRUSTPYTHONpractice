---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-52-rust-method
courseId: crp-92
phaseId: phase-05
dayNumber: 52
date: "2026-11-21"
title: Rust 구조체와 메서드
summary: Rust에서 구조체에 impl 블록으로 함수를 붙이는 방법을 자세히 배웁니다. self가 없는 연관 함수(Self::new, Rect::square)와 메서드의 차이, 메서드가 받는 세 가지 self(&self 읽기, &mut self 바꾸기, self 가져가기)와 각각이 부르는 쪽에 주는 제약, 메서드 호출이 자동으로 &나 &mut를 붙여 주는 것, 연관 상수, Display 구현으로 {} 출력 만들기, derive(Default)와 튜플 구조체(새 자료형 패턴)를 다룹니다. C의 "자료형_함수(포인터, ...)" 관례와 Python 클래스의 메서드를 비교하고, 항상 약분된 상태를 지키는 분수 자료형을 세 언어로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-51-python-class]
learningObjectives:
  - impl 블록에 연관 함수와 메서드를 만들고, Type::f()와 value.m()으로 부르는 차이를 설명한다.
  - "&self, &mut self, self 중 알맞은 것을 고르고, 각각이 부르는 쪽의 변수에 주는 제약을 설명한다."
  - 연관 상수, Display 구현, derive(Default)를 사용한다.
  - 튜플 구조체로 단위가 다른 값을 서로 다른 자료형으로 만든다.
  - 불변 조건을 new와 메서드 안에서 지키는 자료형을 만들고, C·Python과 비교한다.
concepts:
  [
    impl block,
    associated function,
    method,
    self receiver,
    borrowed self,
    mutable self,
    consuming self,
    auto referencing,
    associated constant,
    display trait,
    default derive,
    tuple struct,
    newtype pattern,
    invariant,
    builder chaining,
  ]
runnerMode: python
playgroundSource: |
  # 파일: method_play.py — obj.m()과 Class.m(obj)는 같습니다.
  class Rect:
      def __init__(self, w, h):
          self.w, self.h = w, h
      def area(self):
          return self.w * self.h

  r = Rect(3, 4)
  print(r.area(), Rect.area(r))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day52-predict-chain
    title: self를 가져가는 메서드 연결 예측하기
    kind: predict
    objective: self를 받아 Self를 돌려주는 메서드로 값을 이어서 만든다는 것을 추적한다.
    prompt: 출력되는 수를 적으세요.
    starter: |-
      struct Counter {
          n: u32,
      }

      impl Counter {
          fn new() -> Self {
              Counter { n: 0 }
          }

          fn add(mut self, k: u32) -> Self {
              self.n += k;
              self
          }
      }

      fn main() {
          let c = Counter::new().add(2).add(5);
          println!("{}", c.n);
      }
    answer: "7"
    hint: "add는 값을 통째로 받아 고친 뒤 다시 돌려줍니다. 그 결과에 또 add를 부릅니다."
    explanation: "Counter::new()가 n = 0인 값을 만들고, add(2)가 그 값을 가져가 n = 2로 고쳐 돌려주고, add(5)가 다시 가져가 n = 7로 돌려줍니다. 매개변수 자리의 mut self는 '받은 값을 함수 안에서 바꿀 수 있다'는 뜻입니다. 설정이 많은 값을 한 줄로 만들 때 쓰는 빌더(builder) 모양입니다."
    commonMistakes:
      - "add가 복사본을 바꿔 0이라고 생각함"
      - "self를 가져가면 이어 부를 수 없다고 생각함(돌려받은 값에 부르면 됨)"
    language: rust
    verification: run
  - id: ex-day52-predict-py
    title: 클래스로 메서드 부르기 예측하기
    kind: predict
    objective: Class.m(obj)와 obj.m()이 같은 객체를 다룬다는 것을 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      class Box:
          def __init__(self, n):
              self.n = n

          def grow(self):
              self.n *= 2
              return self


      b = Box(3)
      print(Box.grow(b).grow().n, b.n)
    answer: "12 12"
    hint: "Box.grow(b)는 b.grow()와 같고, 돌려준 것도 b 자신입니다."
    explanation: "Box.grow(b)가 b.n을 6으로 바꾸고 b를 돌려주며, 그 b에 다시 grow()를 불러 12가 됩니다. 두 번 모두 같은 객체라 b.n도 12입니다. Rust의 Rect::area(&r)와 r.area()가 같은 것과 같은 원리입니다. 다만 Python은 self가 항상 같은 객체라서, Rust처럼 '가져가서 새로 돌려주기'와 '빌려서 바꾸기'를 구별하지 않습니다."
    commonMistakes:
      - "Box.grow(b)가 복사본을 만든다고 생각해 12 6으로 적음"
      - "클래스로 메서드를 부를 수 없다고 생각함"
    language: python
    verification: run
  - id: ex-day52-fill
    title: Display 구현 채우기
    kind: fill
    objective: fmt 메서드 안에서 형식에 맞춰 쓰는 매크로를 쓴다.
    prompt: "빈칸을 채워 Point를 {}로 출력할 때 '(1, 2)'가 나오게 하세요."
    starter: |-
      use std::fmt;

      struct Point {
          x: i32,
          y: i32,
      }

      impl fmt::Display for Point {
          fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
              _____!(f, "({}, {})", self.x, self.y)
          }
      }

      fn main() {
          println!("{}", Point { x: 1, y: 2 });
      }
    answer: |-
      use std::fmt;

      struct Point {
          x: i32,
          y: i32,
      }

      impl fmt::Display for Point {
          fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
              write!(f, "({}, {})", self.x, self.y)
          }
      }

      fn main() {
          println!("{}", Point { x: 1, y: 2 });
      }
    output: "(1, 2)"
    hint: "파일에 쓸 때 쓰던 매크로(Day 46)와 같습니다. 이번에는 파일 대신 f에 씁니다."
    explanation: 'write!(f, ...)는 format!처럼 틀을 채우되 결과를 f에 씁니다. Display를 구현하면 println!("{}"), format!, to_string()이 모두 이 모양을 씁니다. Debug({:?})는 derive로 자동으로 만들 수 있지만, Display는 사람에게 보일 모양이라 직접 만들어야 합니다. Python의 __str__에 해당합니다.'
    commonMistakes:
      - "println!을 써서 화면에 바로 출력하고 f에는 아무것도 쓰지 않음"
      - "format!을 써서 String을 만들기만 하고 돌려주지 않아 자료형 오류가 남"
    language: rust
    verification: run
  - id: ex-day52-modify
    title: 따로 있는 함수를 메서드로 옮기기
    kind: modify
    objective: 구조체를 첫 인자로 받는 함수를 impl의 &self 메서드로 바꾼다.
    prompt: "area는 Rect를 받는 따로 떨어진 함수입니다. impl Rect 안의 area(&self) 메서드로 옮기고 r.area()로 불러 '12'를 출력하세요."
    starter: |-
      struct Rect {
          w: u32,
          h: u32,
      }

      fn area(r: &Rect) -> u32 {
          r.w * r.h
      }

      fn main() {
          let r = Rect { w: 3, h: 4 };
          println!("{}", area(&r));
      }
    answer: |-
      struct Rect {
          w: u32,
          h: u32,
      }

      impl Rect {
          fn area(&self) -> u32 {
              self.w * self.h
          }
      }

      fn main() {
          let r = Rect { w: 3, h: 4 };
          println!("{}", r.area());
      }
    output: "12"
    starterOutput: "12"
    hint: "첫 매개변수 r: &Rect가 &self가 되고, 몸통의 r은 self가 됩니다."
    explanation: "메서드는 '첫 인자가 그 자료형인 함수'를 자료형 안에 넣은 것입니다. 결과는 같지만 area가 Rect에 딸린 것이 분명해지고, 다른 자료형의 area와 이름이 부딪히지 않으며, r.까지 쓰면 도구가 쓸 수 있는 메서드를 보여 줍니다. C의 rect_area(&r)를 r.area()로 쓸 수 있게 된 것입니다."
    commonMistakes:
      - "fn area(self)로 써서 r이 옮겨짐"
      - "impl 밖에 fn area(&self)를 써서 self를 쓸 수 없다는 오류가 남"
    language: rust
    verification: run
  - id: ex-day52-debug
    title: self가 없는 메서드를 점으로 부르는 오류 고치기
    kind: debug
    objective: 메서드에는 self 매개변수가 있어야 한다는 것을 알고 고친다.
    prompt: "이 코드는 E0599(no method named `area` found for struct `Rect`) 오류로 컴파일되지 않습니다. area를 메서드로 고쳐 '12'가 출력되게 하세요."
    starter: |-
      struct Rect {
          w: u32,
          h: u32,
      }

      impl Rect {
          fn area() -> u32 {
              0
          }
      }

      fn main() {
          let r = Rect { w: 3, h: 4 };
          println!("{}", r.area());
      }
    answer: |-
      struct Rect {
          w: u32,
          h: u32,
      }

      impl Rect {
          fn area(&self) -> u32 {
              self.w * self.h
          }
      }

      fn main() {
          let r = Rect { w: 3, h: 4 };
          println!("{}", r.area());
      }
    output: "12"
    hint: "self가 없는 함수는 연관 함수라서 Rect::area()로만 부를 수 있습니다. 값에 점으로 부르려면 무엇이 필요할까요?"
    explanation: "impl 안의 함수 중 첫 매개변수가 self 모양(&self, &mut self, self)인 것만 메서드이고, r.area()로 부를 수 있습니다. self가 없으면 Rect::new처럼 자료형 이름으로 부르는 연관 함수입니다. 컴파일러의 도움말도 'this is an associated function, not a method'라고 알려 줍니다. Python에서 self를 빠뜨리면 실행 중 TypeError(Day 51)였던 것이 Rust에서는 컴파일 오류입니다."
    commonMistakes:
      - "Rect::area()로 부르게만 바꿔 r의 값을 쓸 수 없음"
      - "fn area(r: &Rect)로 써서 여전히 연관 함수가 됨(첫 매개변수 이름이 self여야 메서드)"
    language: rust
    verification: run
  - id: ex-day52-independent
    title: C로 분수 더하기
    kind: independent
    objective: 구조체와 그 구조체를 다루는 함수들로 약분된 분수를 만든다.
    prompt: "long num, den을 가진 Fraction 구조체와, 약분해서 만드는 frac_make, 두 분수를 더하는 frac_add를 만드세요. 1/2 + 1/3을 계산해 '1/2 + 1/3 = 5/6'을 출력합니다."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 Fraction과 frac_add를 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      typedef struct {
          long num, den;
      } Fraction;

      static long gcd(long a, long b) {
          while (b != 0) {
              long t = a % b;
              a = b;
              b = t;
          }
          return a < 0 ? -a : a;
      }

      Fraction frac_make(long num, long den) {
          long g = gcd(num, den);
          Fraction f = {num / g, den / g};
          return f;
      }

      Fraction frac_add(Fraction a, Fraction b) {
          return frac_make(a.num * b.den + b.num * a.den, a.den * b.den);
      }

      int main(void) {
          Fraction half = frac_make(1, 2), third = frac_make(1, 3);
          Fraction s = frac_add(half, third);
          printf("%ld/%ld + %ld/%ld = %ld/%ld\n", half.num, half.den, third.num, third.den, s.num, s.den);
          return 0;
      }
    output: "1/2 + 1/3 = 5/6"
    hint: "a/b + c/d = (ad + cb)/bd이고, 결과를 최대공약수로 나눠 약분합니다."
    explanation: "작은 구조체라 값으로 받고 값으로 돌려줬습니다(Day 50). 모든 분수를 frac_make로만 만들면 '항상 약분된 상태'를 지킬 수 있지만, C는 누구나 Fraction f = {2, 4};로 직접 만들 수 있어서 약속일 뿐입니다. 분모가 0인 경우도 이 코드는 막지 않습니다(gcd가 0이 되어 0으로 나눔). Rust에서는 필드를 비공개로 두고 new만 공개해 이 약속을 강제합니다."
    commonMistakes:
      - "분모끼리, 분자끼리 더해 2/5로 계산함"
      - "약분을 빠뜨려 5/6 대신 같은 값의 다른 모양이 나오는 경우를 놓침"
    language: c
    verification: run
quiz:
  - id: quiz-day52-01
    question: impl Rect 안의 fn new(w u32, h u32) -> Self와 fn area(&self) -> u32의 차이는?
    choices:
      - 둘 다 메서드다
      - new는 self가 없는 연관 함수라 Rect::new(...)로, area는 메서드라 r.area()로 부른다
      - new는 impl 밖에 있어야 한다
      - area는 Rect::area()로만 부를 수 있다
    answerIndex: 1
    explanation: 연관 함수는 자료형에 딸렸지만 특정 값이 필요 없어서 주로 만들기에 씁니다. 메서드는 첫 매개변수가 self 모양이라 값으로 부르며, Rect::area(&r)처럼 연관 함수 방식으로도 부를 수 있습니다.
  - id: quiz-day52-02
    question: 값을 제자리에서 바꾸는 메서드의 receiver는?
    choices:
      - "&self"
      - "&mut self"
      - self
      - 없음
    answerIndex: 1
    explanation: "&mut self는 값을 가변으로 빌립니다. 그래서 부르는 쪽 변수가 let mut여야 합니다(아니면 E0596). &self는 읽기만, self는 값을 가져가서 부른 뒤에는 원래 변수를 쓸 수 없습니다."
  - id: quiz-day52-03
    question: let t = r.into_tuple();(into_tuple(self)) 뒤에 r.w를 쓰면?
    choices:
      - 된다
      - r이 메서드로 옮겨져 E0382(borrow of moved value)
      - 0이 나온다
      - 패닉
    answerIndex: 1
    explanation: self를 받는 메서드는 값을 가져갑니다. into_... 이름은 보통 '다른 것으로 바꾸며 가져간다'는 뜻입니다. 원래 값을 계속 쓰려면 clone한 것에 부르거나, &self를 받는 메서드를 만듭니다.
  - id: quiz-day52-04
    question: struct Meters(f64); struct Feet(f64);처럼 튜플 구조체를 쓰는 이유는?
    choices:
      - 속도 때문에
      - 같은 f64라도 단위가 다른 값을 다른 자료형으로 만들어, 섞어 쓰는 실수를 컴파일러가 막게 하려고
      - 필드 이름을 쓰기 싫어서
      - f64를 쓸 수 없어서
    answerIndex: 1
    explanation: 새 자료형 패턴이라고 합니다. fn fly(d Meters)에 Feet를 넘기면 컴파일 오류가 됩니다. 실행 비용은 f64와 같습니다. 안의 값은 .0으로 꺼냅니다.
  - id: quiz-day52-05
    question: r.area()를 부를 때 r이 Rect이고 area가 &self를 받으면 컴파일러가 하는 일은?
    choices:
      - r을 복사한다
      - 자동으로 &r을 만들어 Rect::area(&r)로 부른다
      - 오류를 낸다
      - r을 옮긴다
    answerIndex: 1
    explanation: 메서드 호출은 receiver 모양에 맞춰 &나 &mut를 자동으로 붙여 줍니다(자동 참조). 그래서 C처럼 (&r)->area나 Python처럼 신경 쓸 필요 없이 r.area()로 씁니다. 반대로 참조에서 부를 때는 자동으로 따라갑니다.
---

## 1. 오늘 배울 내용

Day 50에서 구조체로 값을 묶었고, Day 51에서 Python 클래스로 값과 메서드를 묶었습니다. 오늘은 Rust가 구조체에 **함수를 붙이는** 방법을 자세히 배웁니다.

1. `impl` 블록
   - **연관 함수**: `self`가 없고 `Rect::new(3, 4)`처럼 자료형 이름으로 부름
   - **메서드**: 첫 매개변수가 `self` 모양이고 `r.area()`처럼 값으로 부름
2. 메서드가 받는 세 가지 `self`
   - `&self`: 읽기만
   - `&mut self`: 제자리에서 바꾸기
   - `self`: 가져가서 다른 것으로 바꾸기
   - 각각이 부르는 쪽 변수에 주는 제약
3. 메서드 호출의 자동 참조: `r.area()`는 `Rect::area(&r)`
4. 자료형을 다듬는 도구
   - 연관 상수 `Rect::MAX_SIDE`
   - `Display` 구현으로 `{}` 출력
   - `#[derive(Default)]`
   - 튜플 구조체 `struct Meters(f64);`(새 자료형 패턴)
5. C의 "자료형_함수(포인터, ...)"와 Python 클래스의 메서드를 비교합니다.
6. **항상 약분된 상태**를 지키는 분수 자료형을 세 언어로 만듭니다.

## 2. 왜 필요한가

메서드는 문법을 짧게 해 주는 것 이상의 역할을 합니다.

- **어떤 자료형의 동작인지** 분명해집니다. `area`가 여러 개여도 `Rect::area`, `Circle::area`로 구별됩니다.
- **값을 어떻게 쓰는지** 드러납니다. `&self`는 "읽기만 한다", `&mut self`는 "바꾼다", `self`는 "가져간다"라는 약속이 선언에 적혀 있고, 컴파일러가 지킵니다.
- **불변 조건을 지키는 한곳**이 생깁니다. 분수는 항상 약분된 상태, 사각형의 변은 1000 이하처럼 규칙을 `new`와 메서드 안에서만 지키면 됩니다.

C에서는 같은 설계를 관례로 흉내 내고(Day 51), Python은 `self`의 모양이 하나뿐입니다. Rust는 "이 메서드가 값을 어떻게 쓰는가"를 자료형으로 표현한다는 점이 다릅니다.

## 3. 그림으로 이해하기

**연관 함수와 메서드.**

```text
impl Rect {
    fn new(w, h) -> Self        ← 연관 함수   Rect::new(3, 4)
    fn square(side) -> Self     ← 연관 함수   Rect::square(2)
    fn area(&self) -> u32       ← 메서드      r.area()  ==  Rect::area(&r)
    fn scale(&mut self, k)      ← 메서드      r.scale(2) == Rect::scale(&mut r, 2)
    fn into_tuple(self)         ← 메서드      r.into_tuple() == Rect::into_tuple(r)
}
```

**세 가지 self가 부르는 쪽에 주는 제약.**

```text
            부르는 쪽 변수          부른 뒤 변수
&self       let r (mut 아니어도 됨)   계속 씀
&mut self   let mut r 이어야 함       계속 씀(바뀐 값)
self        let r                     쓸 수 없음(옮겨짐), Copy면 복사라 계속 씀
```

**튜플 구조체로 단위 구별하기.**

```text
struct Meters(f64);     struct Feet(f64);
fn fly(d: Meters)
fly(Meters(3.0))  ✓
fly(Feet(10.0))   ✗ 컴파일 오류 — 속은 둘 다 f64지만 자료형이 다르다
```

## 4. 천천히 풀어보기

### 4.1 Self와 연관 함수

`impl Rect` 안에서 `Self`는 `Rect`의 다른 이름입니다. 자료형 이름을 바꿔도 `impl` 안을 고칠 필요가 없어서 `Self`를 즐겨 씁니다.

연관 함수의 관례적인 이름입니다.

| 이름                | 뜻                                             |
| ------------------- | ---------------------------------------------- |
| `new`               | 기본 생성 방법(생성자 문법은 없음)             |
| `with_...`          | 설정을 하나 더 받는 생성(`Vec::with_capacity`) |
| `from_...`          | 다른 재료로 만들기(`String::from_utf8`)        |
| 이름 있는 생성 함수 | `Rect::square(2)`처럼 뜻을 드러냄              |

### 4.2 receiver 고르기

| 메서드가 하는 일                 | receiver            | 예                                  |
| -------------------------------- | ------------------- | ----------------------------------- |
| 값을 읽어 계산                   | `&self`             | `area`, `can_hold`, `len`           |
| 값을 제자리에서 바꿈             | `&mut self`         | `scale`, `push`, `deposit`          |
| 값을 다른 것으로 바꾸며 가져감   | `self`              | `into_tuple`, `into_iter`, `unwrap` |
| 값을 가져가 고친 뒤 돌려줌(빌더) | `mut self` → `Self` | `Counter::new().add(2).add(5)`      |

가장 약한 것부터 고르세요. 읽기만 하면 `&self`, 꼭 필요할 때만 `&mut self`, 가져가야만 할 때 `self`입니다. 강한 receiver일수록 부르는 쪽이 할 수 있는 일이 줄어듭니다.

### 4.3 자동 참조

C는 값이면 `r.area`, 포인터면 `p->area`를 구별해야 했습니다. Rust는 `r.area()`만 쓰면 컴파일러가 receiver에 맞춰 `&r`, `&mut r`, `r` 중 하나로 바꿔 부릅니다. 참조 `p`에서 불러도 알아서 따라갑니다. 그래서 `r.scale(2)`처럼 보여도 실제로는 `&mut r`을 빌리는 호출이고, `r`이 `let mut`이 아니면 E0596입니다.

### 4.4 Display와 Default

- `impl fmt::Display for Rect`를 만들면 `println!("{}", r)`, `r.to_string()`, `format!`이 그 모양을 씁니다. 사람에게 보여 줄 모양이라 직접 만들어야 합니다.
- `#[derive(Default)]`는 모든 필드를 기본값(숫자 0, 빈 `String`, `false`)으로 채운 `Rect::default()`를 만들어 줍니다. `Rect { w: 5, ..Default::default() }`처럼 필드 갱신 문법과 함께 쓰면 편합니다.

### 4.5 불변 조건 지키기

분수를 "항상 약분된 상태, 분모는 양수"로 유지하려면 두 가지가 필요합니다.

1. 분수를 만드는 **유일한 길**을 `new`로 두고, 그 안에서 약분과 부호 정리를 합니다.
2. 새 분수를 돌려주는 메서드(`add`, `mul`)도 `new`를 거칩니다.

같은 모듈 안에서는 `Fraction { num: 2, den: 4 }`를 직접 쓸 수 있지만, 필드에 `pub`을 붙이지 않으면 **다른 모듈에서는** 이렇게 만들 수 없습니다(Day 55). 그래서 Rust에서는 이 약속이 컴파일러의 검사가 됩니다.

## 5. Rust로 구현하기

```rust
// 파일: methods.rs
use std::fmt;

#[derive(Debug, Clone, PartialEq, Default)]
struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    const MAX_SIDE: u32 = 1000;             // 연관 상수: Rect::MAX_SIDE

    fn new(w: u32, h: u32) -> Self {        // 연관 함수(self 없음): Rect::new(...)
        Self { w: w.min(Self::MAX_SIDE), h: h.min(Self::MAX_SIDE) }
    }

    fn square(side: u32) -> Self {
        Self::new(side, side)
    }

    fn area(&self) -> u32 {                 // &self: 읽기만
        self.w * self.h
    }

    fn can_hold(&self, other: &Rect) -> bool {
        self.w >= other.w && self.h >= other.h
    }

    fn scale(&mut self, k: u32) {           // &mut self: 제자리에서 바꾸기
        self.w = (self.w * k).min(Self::MAX_SIDE);
        self.h = (self.h * k).min(Self::MAX_SIDE);
    }

    fn into_tuple(self) -> (u32, u32) {     // self: 가져가서 다른 것으로 바꾸기
        (self.w, self.h)
    }
}

impl fmt::Display for Rect {                // {} 로 출력할 모양
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}x{}", self.w, self.h)
    }
}

struct Meters(f64);                         // 튜플 구조체: 이름 붙은 f64(새 자료형)

impl Meters {
    fn to_cm(&self) -> f64 {
        self.0 * 100.0
    }
}

fn main() {
    let mut a = Rect::new(3, 4);
    let b = Rect::square(2);
    println!("{a} 넓이 {}, {b} 넓이 {}", a.area(), b.area());
    println!("a가 b를 담나? {}, b가 a를? {}", a.can_hold(&b), b.can_hold(&a));

    a.scale(2);                             // 자동으로 (&mut a).scale(2)
    println!("scale 뒤 {a}, Rect::area(&a) = {}", Rect::area(&a));
    println!("최대 변: {}", Rect::new(5000, 1));

    let copy = a.clone();
    let (w, h) = a.into_tuple();            // a는 옮겨져 이후 쓸 수 없다
    println!("into_tuple: ({w}, {h}), 복사본은 그대로 {copy}");

    println!("Default: {:?}, 같은가 {}", Rect::default(), Rect::default() == Rect::new(0, 0));
    let d = Meters(1.75);
    println!("{}m = {}cm", d.0, d.to_cm());
}
```

실행 결과:

```text
3x4 넓이 12, 2x2 넓이 4
a가 b를 담나? true, b가 a를? false
scale 뒤 6x8, Rect::area(&a) = 48
최대 변: 1000x1
into_tuple: (6, 8), 복사본은 그대로 6x8
Default: Rect { w: 0, h: 0 }, 같은가 true
1.75m = 175cm
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `const MAX_SIDE: u32 = 1000;`                            | 연관 상수입니다. `Self::MAX_SIDE` 또는 `Rect::MAX_SIDE`로 씁니다. 클래스 속성(Day 51)과 달리 바꿀 수 없습니다. |
| `fn new(w: u32, h: u32) -> Self`                         | 변 길이를 1000 이하로 맞추는 규칙을 여기서 지킵니다. `Rect::new(5000, 1)`이 `1000x1`이 됩니다.                 |
| `fn square(side: u32) -> Self { Self::new(side, side) }` | 이름으로 뜻을 드러낸 생성 함수입니다. 규칙은 `new`에 맡깁니다.                                                 |
| `fn can_hold(&self, other: &Rect) -> bool`               | 자기와 다른 사각형을 모두 빌려 읽습니다.                                                                       |
| `a.scale(2);`                                            | `&mut self` 메서드라 `a`가 `let mut`이어야 합니다. 부르는 곳은 `&mut`를 적지 않아도 됩니다(자동 참조).         |
| `Rect::area(&a)`                                         | 메서드를 연관 함수 방식으로 부른 것입니다. `a.area()`와 같습니다.                                              |
| `let (w, h) = a.into_tuple();`                           | `a`가 옮겨졌습니다. 그 뒤 `a`를 쓰면 E0382입니다. 미리 `clone`한 `copy`는 그대로 쓸 수 있습니다.               |
| `impl fmt::Display for Rect`                             | `{a}`, `{b}`가 `3x4` 모양으로 출력된 이유입니다. `{:?}`는 `derive(Debug)`의 모양입니다.                        |
| `struct Meters(f64);` / `d.0`                            | 이름 없는 필드 하나짜리 튜플 구조체입니다. 필드는 번호(`.0`)로 꺼냅니다.                                       |

## 6. C로 구현하기

```c
// 파일: rect_functions.c
#include <stdio.h>

#define RECT_MAX_SIDE 1000u

typedef struct {
    unsigned w, h;
} Rect;

static unsigned clamp(unsigned v) {
    return v < RECT_MAX_SIDE ? v : RECT_MAX_SIDE;
}

Rect rect_new(unsigned w, unsigned h) {     // Rect::new
    Rect r = {clamp(w), clamp(h)};
    return r;
}

unsigned rect_area(const Rect *r) {         // &self
    return r->w * r->h;
}

int rect_can_hold(const Rect *r, const Rect *other) {
    return r->w >= other->w && r->h >= other->h;
}

void rect_scale(Rect *r, unsigned k) {      // &mut self
    r->w = clamp(r->w * k);
    r->h = clamp(r->h * k);
}

void rect_print(const Rect *r) {            // Display
    printf("%ux%u", r->w, r->h);
}

int main(void) {
    Rect a = rect_new(3, 4);
    Rect b = rect_new(2, 2);
    rect_print(&a);
    printf(" 넓이 %u, ", rect_area(&a));
    rect_print(&b);
    printf(" 넓이 %u\n", rect_area(&b));
    printf("a가 b를 담나? %d, b가 a를? %d\n", rect_can_hold(&a, &b), rect_can_hold(&b, &a));
    rect_scale(&a, 2);
    printf("scale 뒤 ");
    rect_print(&a);
    printf("\n");
    Rect big = rect_new(5000, 1);
    printf("최대 변: ");
    rect_print(&big);
    printf("\n");
    return 0;
}
```

실행 결과:

```text
3x4 넓이 12, 2x2 넓이 4
a가 b를 담나? 1, b가 a를? 0
scale 뒤 6x8
최대 변: 1000x1
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `#define RECT_MAX_SIDE 1000u`           | 연관 상수 대신 매크로 상수입니다. 이름 앞에 `RECT_`를 붙여 소속을 드러냅니다.                                         |
| `static unsigned clamp(unsigned v)`     | 이 파일 안에서만 쓰는 도우미 함수입니다. `static`이 Rust의 "`pub`이 아님"과 비슷한 역할입니다.                        |
| `Rect rect_new(unsigned w, unsigned h)` | 연관 함수 `Rect::new`에 해당합니다. 값으로 돌려줍니다.                                                                |
| `unsigned rect_area(const Rect *r)`     | `&self` 메서드입니다. `const`가 "읽기만"을 약속합니다.                                                                |
| `void rect_scale(Rect *r, unsigned k)`  | `&mut self` 메서드입니다. 부를 때 `rect_scale(&a, 2)`로 `&`를 직접 적어야 합니다.                                     |
| `void rect_print(const Rect *r)`        | `Display` 대신 출력 함수를 따로 만들었습니다. `printf` 한 줄 안에 끼워 넣을 수 없어서, 출력이 여러 줄로 나뉘었습니다. |

C에는 `self`를 가져가는 메서드에 해당하는 개념이 없습니다. 구조체를 값으로 넘기면 복사되고, 원래 변수는 계속 쓸 수 있습니다.

## 7. Python으로 구현하기

```python
# 파일: rect_class.py
class Rect:
    MAX_SIDE = 1000

    def __init__(self, w, h):
        self.w = min(w, Rect.MAX_SIDE)
        self.h = min(h, Rect.MAX_SIDE)

    @classmethod
    def square(cls, side):
        return cls(side, side)

    def area(self):
        return self.w * self.h

    def can_hold(self, other):
        return self.w >= other.w and self.h >= other.h

    def scale(self, k):
        self.w = min(self.w * k, Rect.MAX_SIDE)
        self.h = min(self.h * k, Rect.MAX_SIDE)

    def __str__(self):
        return f"{self.w}x{self.h}"


a, b = Rect(3, 4), Rect.square(2)
print(f"{a} 넓이 {a.area()}, {b} 넓이 {b.area()}")
print(f"a가 b를 담나? {a.can_hold(b)}, b가 a를? {b.can_hold(a)}")
a.scale(2)
print(f"scale 뒤 {a}, Rect.area(a) = {Rect.area(a)}")
print("최대 변:", Rect(5000, 1))
```

실행 결과:

```text
3x4 넓이 12, 2x2 넓이 4
a가 b를 담나? True, b가 a를? False
scale 뒤 6x8, Rect.area(a) = 48
최대 변: 1000x1
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `MAX_SIDE = 1000`                       | 클래스 속성입니다. 대문자 이름은 "상수로 쓰라"는 관례일 뿐 바꿀 수는 있습니다.                        |
| `@classmethod def square(cls, side)`    | Rust의 연관 함수 `Rect::square`에 해당합니다.                                                         |
| `def area(self)` / `def scale(self, k)` | 읽기와 바꾸기가 모두 같은 `self`입니다. 어느 메서드가 값을 바꾸는지는 이름과 문서로만 알 수 있습니다. |
| `Rect.area(a)`                          | 클래스로 메서드를 불렀습니다. `a.area()`와 같습니다.                                                  |
| `def __str__(self)`                     | Rust의 `Display`, C의 `rect_print`에 해당합니다. f-문자열 `{a}`가 이것을 씁니다.                      |

## 8. 실행 추적

Rust 예제에서 `a`에 대한 메서드 호출이 실제로 어떤 모양으로 바뀌는지 따라갑니다.

| 코드             | 실제 호출                | 빌림         | 뒤의 `a`              |
| ---------------- | ------------------------ | ------------ | --------------------- |
| `a.area()`       | `Rect::area(&a)`         | 공유 빌림    | 그대로 3x4            |
| `a.can_hold(&b)` | `Rect::can_hold(&a, &b)` | 공유 빌림 둘 | 그대로                |
| `a.scale(2)`     | `Rect::scale(&mut a, 2)` | 가변 빌림    | 6x8                   |
| `a.clone()`      | `Clone::clone(&a)`       | 공유 빌림    | 그대로, `copy`는 따로 |
| `a.into_tuple()` | `Rect::into_tuple(a)`    | 이동         | **쓸 수 없음**        |

같은 점(`.`) 모양이지만 receiver에 따라 빌림의 종류가 달라집니다. 메서드 선언의 첫 매개변수만 보면 표의 셋째 열을 알 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**분수 자료형.** 분수는 `2/4`와 `1/2`가 같은 값입니다. "항상 약분된 상태, 분모는 양수"로 저장하면 `==`로 바로 비교할 수 있습니다. 이 규칙을 `new` 안에서 지키고, 모든 연산이 `new`를 거치게 합니다.

```rust
// 파일: fraction.rs
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Fraction {
    num: i64,                               // 항상 약분된 상태, 분모는 양수(불변 조건)
    den: i64,
}

fn gcd(a: i64, b: i64) -> i64 {
    if b == 0 { a.abs() } else { gcd(b, a % b) }
}

impl Fraction {
    fn new(num: i64, den: i64) -> Result<Self, String> {
        if den == 0 {
            return Err(format!("분모가 0: {num}/0"));
        }
        let sign = if den < 0 { -1 } else { 1 };
        let g = gcd(num, den).max(1);
        Ok(Self { num: sign * num / g, den: sign * den / g })
    }

    fn add(&self, other: &Fraction) -> Fraction {
        Fraction::new(self.num * other.den + other.num * self.den, self.den * other.den).unwrap()
    }

    fn mul(&self, other: &Fraction) -> Fraction {
        Fraction::new(self.num * other.num, self.den * other.den).unwrap()
    }

    fn reciprocal(&self) -> Result<Fraction, String> {
        Fraction::new(self.den, self.num)
    }

    fn to_f64(self) -> f64 {
        self.num as f64 / self.den as f64
    }
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        if self.den == 1 { write!(f, "{}", self.num) } else { write!(f, "{}/{}", self.num, self.den) }
    }
}

fn main() {
    let half = Fraction::new(1, 2).unwrap();
    let third = Fraction::new(2, -6).unwrap();          // -1/3로 정리된다
    println!("{half} + {third} = {}", half.add(&third));
    println!("{half} × {third} = {}", half.mul(&third));
    println!("6/4 = {}, 4/2 = {}", Fraction::new(6, 4).unwrap(), Fraction::new(4, 2).unwrap());
    println!("같은가? {}", Fraction::new(2, 4).unwrap() == half);
    println!("역수 {}, 소수 {:.3}", third.reciprocal().unwrap(), third.to_f64());
    println!("{:?}", Fraction::new(1, 0));
    println!("0의 역수: {:?}", Fraction::new(0, 5).unwrap().reciprocal());
}
```

실행 결과:

```text
1/2 + -1/3 = 1/6
1/2 × -1/3 = -1/6
6/4 = 3/2, 4/2 = 2
같은가? true
역수 -3, 소수 -0.333
Err("분모가 0: 1/0")
0의 역수: Err("분모가 0: 1/0")
```

| 코드                                                 | 설명                                                                                                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn new(num: i64, den: i64) -> Result<Self, String>` | 분모가 0이면 만들지 않습니다. 분모의 부호를 분자로 옮기고 최대공약수로 나눕니다. `2/-6`은 `-1/3`이 됩니다.                                    |
| `let g = gcd(num, den).max(1);`                      | `0/5`처럼 최대공약수가 5인 경우는 괜찮지만, 만약을 위해 0으로 나누지 않게 했습니다.                                                           |
| `fn add(&self, other: &Fraction) -> Fraction`        | 두 분수를 빌려 읽고 **새** 분수를 돌려줍니다. 분모끼리 곱해 만든 값은 0이 아니므로 `unwrap`해도 안전합니다(이 가정이 불변 조건에서 나옵니다). |
| `fn reciprocal(&self) -> Result<Fraction, String>`   | 역수는 분자가 0이면 만들 수 없어서 `Result`입니다. `0/1`의 역수는 `1/0`이라 오류입니다.                                                       |
| `fn to_f64(self) -> f64`                             | `Copy` 자료형이라 `self`로 받아도 원래 값을 계속 쓸 수 있습니다.                                                                              |
| `#[derive(PartialEq)]`                               | 항상 약분되어 있으니 필드가 같으면 같은 값입니다. `Fraction::new(2, 4) == half`가 `true`입니다.                                               |
| `impl fmt::Display`                                  | 분모가 1이면 정수만 출력합니다(`4/2` → `2`).                                                                                                  |

Python에서는 `__add__`, `__mul__`을 만들면 `half + third`처럼 **연산자로** 쓸 수 있습니다.

```python
# 파일: fraction.py
from fractions import Fraction as StdFraction
from math import gcd


class Fraction:
    def __init__(self, num, den):
        if den == 0:
            raise ZeroDivisionError(f"분모가 0: {num}/0")
        sign = -1 if den < 0 else 1
        g = gcd(num, den) or 1
        self.num = sign * num // g
        self.den = sign * den // g

    def __add__(self, other):               # a + b 가 이 메서드를 부른다
        return Fraction(self.num * other.den + other.num * self.den, self.den * other.den)

    def __mul__(self, other):               # a * b
        return Fraction(self.num * other.num, self.den * other.den)

    def __eq__(self, other):
        return (self.num, self.den) == (other.num, other.den)

    def __str__(self):
        return str(self.num) if self.den == 1 else f"{self.num}/{self.den}"


half, third = Fraction(1, 2), Fraction(2, -6)
print(f"{half} + {third} = {half + third}")
print(f"{half} × {third} = {half * third}")
print(f"6/4 = {Fraction(6, 4)}, 4/2 = {Fraction(4, 2)}")
print("같은가?", Fraction(2, 4) == half)
print("표준 라이브러리와 비교:", StdFraction(1, 2) + StdFraction(2, -6))
```

실행 결과:

```text
1/2 + -1/3 = 1/6
1/2 × -1/3 = -1/6
6/4 = 3/2, 4/2 = 2
같은가? True
표준 라이브러리와 비교: 1/6
```

- `a + b`는 `a.__add__(b)`를 부릅니다. 이런 메서드를 **연산자 오버로딩**이라고 합니다. Rust에서도 `std::ops::Add` 트레이트를 구현하면 `half + third`로 쓸 수 있습니다(Day 54).
- `gcd(num, den) or 1`은 두 수가 모두 0일 때를 대비한 것입니다. `0`은 거짓이라 `or` 뒤의 1이 쓰입니다.
- Python 표준 라이브러리에도 `fractions.Fraction`이 있고 같은 결과를 줍니다. 실무에서는 표준 도구를 쓰세요.

## 10. 메서드 설계 대응표

| 하고 싶은 일       | Rust                         | C                     | Python            |
| ------------------ | ---------------------------- | --------------------- | ----------------- |
| 만들기             | `fn new(...) -> Self`        | `Type type_new(...)`  | `__init__`        |
| 다른 재료로 만들기 | `fn from_...(...) -> Self`   | `type_from_...`       | `@classmethod`    |
| 읽기 메서드        | `fn f(&self)`                | `f(const Type *self)` | `def f(self)`     |
| 바꾸기 메서드      | `fn f(&mut self)`            | `f(Type *self)`       | `def f(self)`     |
| 가져가는 메서드    | `fn f(self)`                 | (없음, 값 복사)       | (없음)            |
| 상수               | `const X: T = ...;`(impl 안) | `#define TYPE_X ...`  | 클래스 속성(관례) |
| 사람용 출력        | `impl Display`               | 출력 함수             | `__str__`         |
| 연산자             | `impl Add` 등(Day 54)        | 없음                  | `__add__` 등      |

## 11. 세 언어 비교

| 관점                        | Rust                               | C                         | Python                   |
| --------------------------- | ---------------------------------- | ------------------------- | ------------------------ |
| 메서드가 값을 어떻게 쓰는지 | receiver로 드러남, 컴파일러가 강제 | `const`로 일부 표시       | 드러나지 않음            |
| 호출 모양                   | `r.m()`, 자동 참조                 | `type_m(&r)`              | `r.m()`                  |
| 생성자                      | 없음(`new` 관례)                   | 없음(`_new`/`_init` 관례) | `__init__`               |
| 불변 조건 강제              | 비공개 필드 + `new`                | 약속                      | 약속(`_` 이름, property) |
| 같은 이름의 함수            | 자료형마다 따로(`Rect::area`)      | 접두사로 구별             | 클래스마다 따로          |

## 12. 자주 하는 실수

### 실수 1: self 없는 함수를 메서드처럼 부른다

```rust
// 파일: no_self.rs (컴파일 오류: E0599)
struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn area() -> u32 {
        0
    }
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    println!("{} {} {}", r.area(), r.w, r.h);
}
```

실습의 디버그 문제입니다. 메서드는 첫 매개변수가 `&self`, `&mut self`, `self` 중 하나여야 합니다.

### 실수 2: mut 없는 변수에 &mut self 메서드를 부른다

```rust
// 파일: scale_not_mut.rs (컴파일 오류: E0596)
struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn scale(&mut self, k: u32) {
        self.w *= k;
        self.h *= k;
    }
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    r.scale(2);
    println!("{} {}", r.w, r.h);
}
```

`r.scale(2)`에는 `&mut`가 보이지 않지만 실제로는 가변 빌림입니다. `let mut r`로 선언하세요.

### 실수 3: self를 가져간 메서드 뒤에 값을 쓴다

```rust
// 파일: after_into.rs (컴파일 오류: E0382)
struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn into_tuple(self) -> (u32, u32) {
        (self.w, self.h)
    }
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    let t = r.into_tuple();
    println!("{:?} {}", t, r.w);
}
```

필요한 값을 먼저 읽어 두거나, 메서드를 `&self`로 바꾸세요. 모든 메서드를 `self`로 만들면 값을 한 번밖에 쓸 수 없습니다.

### 실수 4: Display 없이 {}로 출력한다

```rust
// 파일: no_display.rs (컴파일 오류: E0277)
struct Rect {
    w: u32,
    h: u32,
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    println!("{r}");
}
```

`#[derive(Debug)]`를 붙이고 `{r:?}`로 출력하거나, `impl fmt::Display`를 만드세요.

### 실수 5: 불변 조건을 우회해 값을 만든다

같은 모듈에서 `Fraction { num: 2, den: 4 }`를 직접 쓰면 약분되지 않은 분수가 생겨 `==`가 틀린 답을 줍니다. 자료형을 모듈로 분리하고 필드를 비공개로 두어, 밖에서는 `Fraction::new`만 쓸 수 있게 하세요(Day 55).

## 13. Q&A

**Q. impl 블록을 여러 개 만들어도 되나요?**

A. 됩니다. 같은 자료형에 `impl Rect { ... }`를 여러 번 써도 모두 합쳐집니다. 보통은 자료형 자신의 메서드는 하나의 `impl`에, 트레이트 구현(`impl Display for Rect`)은 각각 따로 둡니다.

**Q. 왜 Rust에는 생성자 문법이 없나요?**

A. 구조체 문법 `Rect { w: 3, h: 4 }` 자체가 모든 필드를 채우는 생성 방법이라, 별도의 생성자가 필요 없습니다. `new`는 규칙을 적용하거나 기본값을 채우는 **보통 함수**일 뿐이고, 실패할 수 있으면 `Result`를 돌려줄 수도 있습니다. Python의 `__init__`은 실패를 예외로만 알릴 수 있는 것과 다릅니다.

**Q. getter 메서드를 꼭 만들어야 하나요?**

A. 같은 모듈 안에서는 필드를 바로 읽어도 됩니다. 다른 모듈에 공개할 때, 불변 조건 때문에 **쓰기**를 막아야 하는 필드라면 비공개로 두고 `fn num(&self) -> i64` 같은 읽기 메서드만 공개합니다. 규칙이 없는 단순한 묶음이라면 `pub` 필드도 괜찮습니다.

**Q. 튜플 구조체와 튜플은 어떻게 다른가요?**

A. `(f64,)`나 `(u32, u32)`는 이름 없는 튜플이라, 같은 모양이면 모두 같은 자료형입니다. `struct Meters(f64);`는 이름이 있는 새 자료형이라 다른 `f64` 묶음과 섞이지 않고, 메서드와 트레이트 구현을 붙일 수 있습니다.

## 14. 핵심 요약

- `impl` 블록에 **연관 함수**(`self` 없음, `Type::f()`)와 **메서드**(`self` 모양, `value.m()`)를 만듭니다. `Self`는 그 자료형의 다른 이름입니다.
- receiver는 **가장 약한 것**부터: 읽기 `&self`, 바꾸기 `&mut self`(변수는 `let mut`), 가져가기 `self`(부른 뒤 원래 변수는 쓸 수 없음).
- 메서드 호출은 receiver에 맞춰 `&`/`&mut`를 **자동으로** 붙입니다. `r.m()`은 `Type::m(&r)`입니다.
- 연관 상수, `impl Display`(사람용 출력), `derive(Default)`, 튜플 구조체(새 자료형 패턴)로 자료형을 다듬습니다.
- 불변 조건은 `new`와 메서드에서 지키고, 비공개 필드로 우회를 막습니다.
- C는 `자료형_함수(포인터, ...)` 관례로, Python은 `self` 하나로 같은 설계를 하지만, "값을 어떻게 쓰는지"를 자료형으로 드러내는 것은 Rust뿐입니다.

## 15. 도전 문제

1. **(Rust)** 분수에 `std::ops::Add`를 구현해 `half + third`로 쓸 수 있게 하세요. `impl std::ops::Add for Fraction { type Output = Fraction; fn add(self, other: Fraction) -> Fraction { ... } }` 모양입니다. 기존 `add` 메서드와 이름이 겹치는 문제는 어떻게 할지 정하세요.
2. **(Rust)** `struct Celsius(f64);`와 `struct Fahrenheit(f64);`를 만들고, `impl Celsius { fn to_fahrenheit(&self) -> Fahrenheit }`와 반대 방향 변환을 만드세요. `Celsius`를 받는 함수에 `Fahrenheit`를 넘기면 컴파일 오류가 나는지 확인합니다.
3. **(C)** 분수 예제에 `int frac_make_checked(long num, long den, Fraction *out)`을 추가해 분모가 0이면 실패를 돌려주고, 분모 부호도 정리하세요(Day 43의 관례).
4. **(Python)** 분수 클래스에 `__sub__`, `__truediv__`, `__lt__`를 추가하고 `sorted([Fraction(1, 2), Fraction(1, 3), Fraction(3, 4)])`가 되게 하세요.
