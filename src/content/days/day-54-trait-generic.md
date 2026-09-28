---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-54-trait-generic
courseId: crp-92
phaseId: phase-05
dayNumber: 54
date: "2026-11-23"
title: Rust trait과 제네릭
summary: 여러 자료형이 같은 능력을 갖게 하는 Rust의 trait과, 자료형을 매개변수로 받아 한 번 쓴 코드를 여러 자료형에 쓰는 제네릭을 배웁니다. trait 선언과 impl Trait for Type, 기본 구현과 바꿔 쓰기, 트레이트 경계(T에 PartialOrd + Copy 요구하기, impl Trait, where), 제네릭 함수와 구조체 Pair<T>, 연산자 트레이트 Add, 컴파일할 때 자료형마다 코드를 만드는 정적 호출과 Box<dyn Trait>로 서로 다른 자료형을 한 목록에 담는 동적 호출을 다룹니다. C의 함수 포인터 표(vtable)와 void * 제네릭, Python의 덕 타이핑·ABC·Protocol과 비교하고, 서로 다른 도형을 한 목록에 담아 넓이로 정렬하고 합하는 프로그램을 세 언어로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: advanced
estimatedMinutes: 120
prerequisites: [day-53-rust-enum]
learningObjectives:
  - trait을 선언하고 여러 자료형에 구현하며, 기본 구현을 쓰거나 바꿔 쓴다.
  - 트레이트 경계로 제네릭 함수가 T에 요구하는 능력을 적고, E0369 같은 오류를 경계를 추가해 고친다.
  - 제네릭 구조체와 연산자 트레이트(Add)를 구현한다.
  - impl Trait(정적 호출)과 Box<dyn Trait>(동적 호출)의 차이와 쓰임을 설명한다.
  - C의 vtable·void *, Python의 덕 타이핑·ABC가 같은 문제를 어떻게 푸는지 비교한다.
concepts:
  [
    trait,
    impl trait for type,
    default method,
    trait bound,
    generics,
    where clause,
    impl trait argument,
    generic struct,
    operator overloading,
    add trait,
    static dispatch,
    monomorphization,
    trait object,
    dyn,
    dynamic dispatch,
    vtable,
    void pointer,
    duck typing,
    abc,
    protocol,
  ]
runnerMode: python
playgroundSource: |
  # 파일: duck_play.py — 메서드만 있으면 같은 자리에 쓸 수 있습니다.
  class Dog:
      def speak(self):
          return "멍멍"

  class Robot:
      def speak(self):
          return "삐빅"

  for x in [Dog(), Robot()]:
      print(x.speak())
  print(max([3, 9, 2]), max(["가", "하"]))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day54-predict-default
    title: 기본 구현과 바꿔 쓰기 예측하기
    kind: predict
    objective: 기본 구현을 쓰는 자료형과 바꿔 쓴 자료형을 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      trait Greet {
          fn hello(&self) -> String {
              String::from("안녕")
          }
      }

      struct A;
      struct B;

      impl Greet for A {}

      impl Greet for B {
          fn hello(&self) -> String {
              String::from("반가워")
          }
      }

      fn main() {
          println!("{} {}", A.hello(), B.hello());
      }
    answer: "안녕 반가워"
    hint: "A는 impl 블록이 비어 있어서 trait의 기본 구현을 씁니다."
    explanation: "trait의 메서드에 몸통이 있으면 기본 구현입니다. impl Greet for A {}처럼 아무것도 쓰지 않으면 기본 구현을, B처럼 같은 이름의 메서드를 쓰면 그것을 씁니다. 몸통이 없는 메서드(fn name(&self) -> String;)는 모든 구현이 반드시 써야 해서, 빠뜨리면 E0046입니다. Python에서 부모 클래스의 메서드를 물려받거나 덮어쓰는 것과 비슷합니다."
    commonMistakes:
      - "A에 hello가 없어서 컴파일 오류라고 생각함"
      - "B도 기본 구현을 먼저 쓴다고 생각함"
    language: rust
    verification: run
  - id: ex-day54-predict-generic
    title: 제네릭 함수의 결과 예측하기
    kind: predict
    objective: 하나의 제네릭 함수가 여러 자료형에서 그 자료형의 비교 규칙대로 동작한다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn pair_max<T: PartialOrd>(a: T, b: T) -> T {
          if a > b { a } else { b }
      }

      fn main() {
          println!("{} {} {}", pair_max(3, 7), pair_max("b", "a"), pair_max(2.5, -1.0));
      }
    answer: "7 b 2.5"
    hint: '문자열은 사전 순서로 비교합니다. "b"가 "a"보다 뒤입니다.'
    explanation: "T: PartialOrd는 'T는 > 로 비교할 수 있어야 한다'는 조건입니다. 컴파일러는 pair_max를 i32용, &str용, f64용으로 각각 만들어 냅니다(단형화). 그래서 실행 속도는 자료형마다 따로 쓴 함수와 같습니다. 두 인자의 자료형이 달라(pair_max(3, 2.5)) T를 하나로 정할 수 없으면 컴파일 오류입니다."
    commonMistakes:
      - '"a"가 더 크다고 생각함'
      - "정수와 실수를 섞어 부를 수 있다고 생각함"
    language: rust
    verification: run
  - id: ex-day54-fill
    title: trait 구현 머리 채우기
    kind: fill
    objective: impl Trait for Type 모양을 쓴다.
    prompt: "빈칸을 채워 Dog가 Describe를 구현하게 하고 '강아지'가 출력되게 하세요."
    starter: |-
      trait Describe {
          fn name(&self) -> String;
      }

      struct Dog;

      impl _____ for Dog {
          fn name(&self) -> String {
              String::from("강아지")
          }
      }

      fn main() {
          println!("{}", Dog.name());
      }
    answer: |-
      trait Describe {
          fn name(&self) -> String;
      }

      struct Dog;

      impl Describe for Dog {
          fn name(&self) -> String {
              String::from("강아지")
          }
      }

      fn main() {
          println!("{}", Dog.name());
      }
    output: "강아지"
    hint: "'Dog에 대해 어떤 trait을 구현한다'는 문장을 Rust로 쓰면 impl 무엇 for Dog입니다."
    explanation: "impl Describe for Dog는 'Dog가 Describe의 약속을 지킨다'는 선언입니다. 그 안의 메서드 이름과 시그니처는 trait에 적힌 것과 정확히 같아야 합니다. 구조체 자신의 메서드(impl Dog)와 trait 구현(impl Describe for Dog)은 따로 씁니다. struct Dog;처럼 필드가 없는 구조체는 이름만으로 값이 되어 Dog.name()처럼 부를 수 있습니다."
    commonMistakes:
      - "impl Dog for Describe로 순서를 거꾸로 씀"
      - "impl Dog로 써서 trait과 관계없는 메서드가 됨(그래도 이 예제는 동작하지만 Describe를 받는 함수에 넘길 수 없음)"
    language: rust
    verification: run
  - id: ex-day54-modify
    title: 같은 모양의 함수 둘을 제네릭 하나로
    kind: modify
    objective: 자료형만 다른 함수들을 트레이트 경계가 있는 제네릭 함수로 합친다.
    prompt: "show_i32와 show_str는 자료형만 다르고 하는 일이 같습니다. fn show<T: Display>(x: T) -> String 하나로 합쳐 같은 출력 '[3] [모모]'가 나오게 하세요."
    starter: |-
      fn show_i32(x: i32) -> String {
          format!("[{x}]")
      }

      fn show_str(x: &str) -> String {
          format!("[{x}]")
      }

      fn main() {
          println!("{} {}", show_i32(3), show_str("모모"));
      }
    answer: |-
      use std::fmt::Display;

      fn show<T: Display>(x: T) -> String {
          format!("[{x}]")
      }

      fn main() {
          println!("{} {}", show(3), show("모모"));
      }
    output: "[3] [모모]"
    starterOutput: "[3] [모모]"
    hint: "format!의 {x}가 요구하는 능력은 Display입니다. 그것을 T의 조건으로 적으세요."
    explanation: "제네릭 함수는 '어떤 T든, 단 Display를 구현한 T'라고 조건을 적습니다. 조건이 없으면 함수 안에서 x로 아무것도 할 수 없습니다. 이 조건 덕분에 show(vec![1])처럼 Display가 없는 자료형을 넘기면 호출하는 곳에서 곧바로 오류가 나고, 오류 메시지도 '무엇이 부족한지' 알려 줍니다. fn show(x: impl Display) -> String으로 짧게 써도 됩니다."
    commonMistakes:
      - "use std::fmt::Display;를 빠뜨려 Display를 찾지 못함"
      - "fn show<T>(x: T)로 조건 없이 써서 E0277(T doesn't implement Display)이 남"
    language: rust
    verification: run
  - id: ex-day54-debug
    title: 비교할 수 없는 T 고치기
    kind: debug
    objective: E0369를 트레이트 경계를 추가해 고친다.
    prompt: "이 코드는 E0369(binary operation `>` cannot be applied to type `T`) 오류로 컴파일되지 않습니다. T에 비교 능력을 요구하도록 고쳐 '9'가 출력되게 하세요."
    starter: |-
      fn largest<T: Copy>(xs: &[T]) -> T {
          let mut best = xs[0];
          for &x in xs {
              if x > best {
                  best = x;
              }
          }
          best
      }

      fn main() {
          println!("{}", largest(&[3, 9, 2]));
      }
    answer: |-
      fn largest<T: PartialOrd + Copy>(xs: &[T]) -> T {
          let mut best = xs[0];
          for &x in xs {
              if x > best {
                  best = x;
              }
          }
          best
      }

      fn main() {
          println!("{}", largest(&[3, 9, 2]));
      }
    output: "9"
    hint: "제네릭 함수 안에서는 T가 무엇이든 될 수 있다고 봅니다. > 를 쓰려면 T가 비교할 수 있다고 약속해야 합니다."
    explanation: "Rust는 제네릭 함수를 '호출되는 모든 T에서 맞는가'로 검사합니다. 경계가 Copy뿐이면 비교할 수 없는 자료형도 들어올 수 있어서 > 를 거부합니다. PartialOrd를 추가하면 비교할 수 있는 T만 받습니다. Python의 largest는 실행 중에 비교해 보고 안 되면 TypeError가 나지만, Rust는 부르기도 전에 막습니다. Copy 대신 Clone이나 참조 반환(&T)으로 바꿀 수도 있습니다."
    commonMistakes:
      - "Ord를 붙여 실수(f64)로 부를 수 없게 됨"
      - "T를 i32로 바꿔 제네릭이 아니게 만듦"
    language: rust
    verification: run
  - id: ex-day54-independent
    title: Python 덕 타이핑으로 길이 합치기
    kind: independent
    objective: 같은 능력(len)을 가진 서로 다른 자료형을 한 함수로 다룬다.
    prompt: 'def total_len(items)가 목록의 각 항목에 len()을 적용해 합을 돌려주게 만들고, ["ab", [1, 2, 3], {"k": 1}]로 ''6''을 출력하세요.'
    starter: |-
      items = ["ab", [1, 2, 3], {"k": 1}]
      print(items)
    answer: |-
      def total_len(items):
          return sum(len(x) for x in items)


      print(total_len(["ab", [1, 2, 3], {"k": 1}]))
    output: "6"
    hint: "문자열, 리스트, 사전은 자료형이 달라도 모두 len()을 쓸 수 있습니다."
    explanation: "Python은 '이 객체가 무슨 자료형인가'가 아니라 '이 객체로 len()을 할 수 있는가'만 봅니다(덕 타이핑). 문자열 2 + 리스트 3 + 사전 1 = 6입니다. 숫자 5를 섞으면 실행 중에 TypeError입니다. Rust로 같은 일을 하려면 '길이를 가진다'는 trait을 만들어 각 자료형에 구현하고, Vec<Box<dyn HasLen>>에 담아야 합니다."
    commonMistakes:
      - "isinstance로 자료형마다 나눠 처리해 새 자료형이 오면 고쳐야 함"
      - "len(items)로 항목 개수(3)를 돌려줌"
    language: python
    verification: run
quiz:
  - id: quiz-day54-01
    question: trait은 무엇에 가장 가까운가?
    choices:
      - 구조체
      - 여러 자료형이 지킬 수 있는 메서드 약속(능력의 이름)
      - 변수
      - 모듈
    answerIndex: 1
    explanation: trait은 '이런 메서드를 가진다'는 약속입니다. Display는 '사람용으로 출력할 수 있다', PartialOrd는 '비교할 수 있다'는 뜻입니다. 자료형이 impl Trait for Type으로 약속을 지키면, 그 trait을 요구하는 함수에 넘길 수 있습니다.
  - id: quiz-day54-02
    question: "fn largest<T: PartialOrd + Copy>(xs: &[T]) -> T에서 트레이트 경계의 역할은?"
    choices:
      - T의 크기를 정한다
      - 함수 안에서 T로 할 수 있는 일(비교, 복사)을 정하고, 그 능력이 없는 자료형으로는 부를 수 없게 한다
      - 실행 중에 자료형을 검사한다
      - 아무 역할도 없다
    answerIndex: 1
    explanation: 경계는 함수와 부르는 쪽 사이의 약속입니다. 함수는 적힌 능력만 쓸 수 있고, 부르는 쪽은 그 능력을 가진 자료형만 넘길 수 있습니다. 둘 다 컴파일할 때 검사됩니다.
  - id: quiz-day54-03
    question: Vec<Box<dyn Shape>>를 쓰는 이유는?
    choices:
      - 더 빨라서
      - 크기가 서로 다른 여러 자료형(Circle, Rect)을 Shape라는 능력만 보고 한 목록에 담으려고
      - Box가 필요해서
      - Shape가 enum이라서
    answerIndex: 1
    explanation: Vec의 칸은 모두 같은 크기여야 합니다. Box<dyn Shape>는 어떤 도형이든 가리키는 (주소, 메서드 표) 두 값이라 크기가 같습니다. 메서드는 실행할 때 표를 보고 찾습니다(동적 호출). 종류가 정해져 있다면 enum(Day 53)도 좋은 선택입니다.
  - id: quiz-day54-04
    question: 정적 호출(impl Trait, 제네릭)과 동적 호출(dyn Trait)의 차이로 옳은 것은?
    choices:
      - 차이가 없다
      - 정적 호출은 자료형마다 코드를 만들어 빠르고, 동적 호출은 코드 하나로 여러 자료형을 다루며 실행할 때 메서드를 찾는다
      - 동적 호출이 항상 빠르다
      - 정적 호출은 실행 중에 자료형을 바꿀 수 있다
    answerIndex: 1
    explanation: 제네릭은 컴파일할 때 i32용, f64용 함수를 따로 만들어(단형화) 호출 비용이 없지만 실행 파일이 커질 수 있습니다. dyn은 함수 포인터 표를 한 번 거쳐 조금 느리지만, 서로 다른 자료형을 한 목록에 담을 수 있습니다. C의 vtable이 바로 dyn의 속 모양입니다.
  - id: quiz-day54-05
    question: Python에서 Rust의 trait과 비슷한 역할을 하는 것이 아닌 것은?
    choices:
      - 덕 타이핑(필요한 메서드만 있으면 됨)
      - abc.ABC와 @abstractmethod
      - typing.Protocol
      - global 문
    answerIndex: 3
    explanation: 덕 타이핑은 약속을 적지 않고 실행 중에 확인하고, ABC는 물려받은 클래스가 메서드를 구현하지 않으면 객체를 만들 때 오류를 내며, Protocol은 검사 도구(mypy 등)가 약속을 확인하게 합니다. global은 전역 변수에 대입할 때 쓰는 문입니다.
---

## 1. 오늘 배울 내용

Day 53에서 enum으로 "정해진 몇 가지 중 하나"를 나타냈습니다. 오늘은 반대 방향의 도구를 배웁니다. 종류가 정해져 있지 않고, **같은 능력을 가진 무엇이든** 다루고 싶을 때입니다.

1. **trait**: 여러 자료형이 지킬 수 있는 메서드 약속
   - `trait Describe { fn name(&self) -> String; }`
   - `impl Describe for Dog { ... }`
   - 기본 구현과 바꿔 쓰기
2. **제네릭**: 자료형을 매개변수로 받는 코드
   - `fn largest<T: PartialOrd + Copy>(xs: &[T]) -> T`
   - 트레이트 경계: `T: 능력`, `impl 능력`, `where`
   - 제네릭 구조체 `Pair<T>`와 연산자 trait `Add`
3. 두 가지 호출 방식
   - **정적 호출**: `impl Trait`, 제네릭 — 컴파일할 때 자료형마다 코드를 만듦
   - **동적 호출**: `Box<dyn Trait>`, `&dyn Trait` — 서로 다른 자료형을 한 목록에
4. 다른 언어의 같은 생각
   - C: 함수 포인터 표(vtable), `void *`와 비교 함수
   - Python: 덕 타이핑, `abc.ABC`, `typing.Protocol`
5. 서로 다른 도형을 한 목록에 담아 넓이로 정렬하고 합하는 프로그램을 세 언어로 만듭니다.

## 2. 왜 필요한가

같은 일을 자료형마다 따로 쓰면 코드가 늘어나고 고칠 곳도 늘어납니다.

- `largest_i32`, `largest_f64`, `largest_char`는 하는 일이 똑같습니다. 규칙을 바꾸려면 세 곳을 고쳐야 합니다.
- 도형 목록의 넓이를 합하는 함수가 원, 사각형, 삼각형을 모두 알아야 한다면, 새 도형을 추가할 때마다 그 함수를 고쳐야 합니다.

trait과 제네릭은 **"무엇인가" 대신 "무엇을 할 수 있는가"** 로 코드를 씁니다. `largest`는 "비교할 수 있는 무엇이든", `total_area`는 "넓이를 구할 수 있는 무엇이든" 받습니다. Rust 표준 라이브러리는 거의 전부가 이 방식으로 만들어져 있습니다. `Vec<T>`, `Option<T>`, `println!`이 쓰는 `Display`, `sort`가 쓰는 `Ord`, `for`가 쓰는 `Iterator`가 모두 제네릭과 trait입니다.

## 3. 그림으로 이해하기

**trait과 구현.**

```text
trait Describe                      impl Describe for Dog      impl Describe for Robot
┌──────────────────────────────┐    ┌──────────────────┐       ┌──────────────────────────┐
│ fn name(&self) -> String;    │ ◀─ │ fn name → "강아지" │       │ fn name → "로봇 7호"        │
│ fn describe(&self) -> String │    │ (describe는 기본)  │       │ fn describe → "삐빅, ..."  │
│   { 기본 구현 }               │    └──────────────────┘       └──────────────────────────┘
└──────────────────────────────┘
   "이 능력을 가지려면 name을 만들어라. describe는 만들지 않아도 된다"
```

**정적 호출: 자료형마다 코드를 만든다.**

```text
largest(&[3, 9, 2])        → 컴파일러가 largest::<i32>를 만듦
largest(&[1.5, -2.0])      → largest::<f64>를 만듦
largest(&['가', '하'])      → largest::<char>를 만듦
실행할 때는 각각이 자료형 전용 함수처럼 빠르다
```

**동적 호출: 메서드 표를 따라간다.**

```text
crowd: Vec<Box<dyn Describe>>
┌──────────────────┐
│ [0] 데이터 주소 ─┼──▶ Dog { }
│     표 주소    ─┼──▶ Dog의 표: name → dog_name, describe → 기본
├──────────────────┤
│ [1] 데이터 주소 ─┼──▶ Robot { id: 1 }
│     표 주소    ─┼──▶ Robot의 표: name → robot_name, describe → robot_describe
└──────────────────┘
x.describe() → x의 표에서 describe를 찾아 부른다
```

C의 `DescribeOps` 구조체가 바로 이 "표"이고, Rust는 `dyn`을 쓰면 컴파일러가 표를 만들어 줍니다.

## 4. 천천히 풀어보기

### 4.1 trait 쓰기

| 모양                                      | 뜻                                           |
| ----------------------------------------- | -------------------------------------------- |
| `trait Name { fn m(&self) -> T; }`        | 구현이 반드시 만들어야 하는 메서드           |
| `trait Name { fn m(&self) -> T { ... } }` | 기본 구현(만들지 않아도 됨, 바꿔 쓸 수 있음) |
| `impl Name for Type { ... }`              | `Type`이 약속을 지킴                         |
| `#[derive(Debug, Clone, PartialEq)]`      | 표준 trait의 구현을 컴파일러가 만들어 줌     |

기본 구현은 다른 메서드를 써서 만들 수 있습니다(`describe`가 `name`을 부름). 그래서 구현하는 쪽은 핵심 메서드 몇 개만 만들면 나머지를 공짜로 얻습니다. 표준 라이브러리의 `Iterator`는 `next` 하나만 만들면 `map`, `filter`, `sum` 등 수십 개를 얻습니다.

### 4.2 트레이트 경계를 적는 세 방법

```rust
fn show<T: Display>(x: T) -> String            // 1) 꺾쇠 안에
fn show(x: impl Display) -> String             // 2) 매개변수 자리에 impl
fn show<T>(x: T) -> String where T: Display    // 3) where 절(조건이 길 때)
```

셋은 거의 같습니다. 여러 조건은 `+`로 잇습니다: `T: PartialOrd + Copy`. 함수 안에서는 **적은 능력만** 쓸 수 있습니다. `T: Copy`만 적고 `>`를 쓰면 E0369입니다.

### 4.3 제네릭 구조체와 연산자

`struct Pair<T> { a: T, b: T }`는 `Pair<i32>`, `Pair<f64>` 모두 됩니다. 메서드나 trait 구현에도 조건을 붙일 수 있습니다.

```rust
impl<T: Add<Output = T>> Add for Pair<T> { ... }
```

"더할 수 있는 `T`의 `Pair`는 `+`로 더할 수 있다"는 뜻입니다. `std::ops::Add`를 구현하면 `a + b`가 `a.add(b)`로 바뀝니다. Python의 `__add__`(Day 52)와 같은 생각입니다.

### 4.4 impl Trait과 dyn Trait 고르기

| 상황                                              | 고를 것                           |
| ------------------------------------------------- | --------------------------------- |
| 함수가 한 자료형을 받거나 돌려줌(무엇인지만 모름) | `impl Trait`, 제네릭 `<T: Trait>` |
| 서로 다른 자료형을 한 목록에 담음                 | `Vec<Box<dyn Trait>>`             |
| 실행 중에 어떤 자료형을 쓸지 정함                 | `Box<dyn Trait>`                  |
| 종류가 정해져 있고 모두 한곳에서 다룸             | enum(Day 53)                      |

## 5. Rust로 구현하기

```rust
// 파일: traits.rs
use std::fmt::Display;
use std::ops::Add;

trait Describe {                            // 이 능력을 가진 자료형이 지켜야 할 약속
    fn name(&self) -> String;               // 반드시 만들어야 하는 메서드

    fn describe(&self) -> String {          // 기본 구현: 만들지 않으면 이것을 쓴다
        format!("나는 {}", self.name())
    }
}

struct Dog;
struct Robot {
    id: u32,
}

impl Describe for Dog {
    fn name(&self) -> String {
        String::from("강아지")
    }
}

impl Describe for Robot {
    fn name(&self) -> String {
        format!("로봇 {}호", self.id)
    }

    fn describe(&self) -> String {          // 기본 구현을 바꿔 쓴다
        format!("삐빅, {} 작동 중", self.name())
    }
}

fn introduce(x: &impl Describe) -> String { // Describe를 구현한 무엇이든(정적)
    x.describe()
}

fn largest<T: PartialOrd + Copy>(xs: &[T]) -> T {   // 제네릭: 비교·복사할 수 있는 T
    let mut best = xs[0];
    for &x in xs {
        if x > best {
            best = x;
        }
    }
    best
}

fn show_all<T>(items: &[T]) -> String
where
    T: Display,                             // where로 조건을 따로 적을 수 있다
{
    items.iter().map(|x| format!("[{x}]")).collect::<Vec<_>>().join("")
}

#[derive(Debug, Clone, Copy, PartialEq)]
struct Pair<T> {                            // 제네릭 구조체
    a: T,
    b: T,
}

impl<T: Add<Output = T>> Add for Pair<T> {  // + 연산자 구현
    type Output = Pair<T>;
    fn add(self, other: Pair<T>) -> Pair<T> {
        Pair { a: self.a + other.a, b: self.b + other.b }
    }
}

fn main() {
    println!("{} / {}", introduce(&Dog), introduce(&Robot { id: 7 }));

    let crowd: Vec<Box<dyn Describe>> = vec![Box::new(Dog), Box::new(Robot { id: 1 })];   // 서로 다른 자료형을 한 목록에
    for x in &crowd {
        println!("  {}", x.describe());     // 실행할 때 어느 메서드인지 찾는다(동적)
    }

    println!("largest: {} {} {}", largest(&[3, 9, 2]), largest(&[1.5, -2.0]), largest(&['가', '하', '다']));
    println!("show_all: {} {}", show_all(&[1, 2, 3]), show_all(&["모모", "데미안"]));
    let p = Pair { a: 1, b: 2 } + Pair { a: 10, b: 20 };
    let q = Pair { a: 0.5, b: 1.5 } + Pair { a: 0.5, b: 0.5 };
    println!("Pair: {p:?} {q:?}");
}
```

실행 결과:

```text
나는 강아지 / 삐빅, 로봇 7호 작동 중
  나는 강아지
  삐빅, 로봇 1호 작동 중
largest: 9 1.5 하
show_all: [1][2][3] [모모][데미안]
Pair: Pair { a: 11, b: 22 } Pair { a: 1.0, b: 2.0 }
```

### 코드 한 부분씩 읽기

| 코드                                                                                  | 설명                                                                                                                   |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `fn name(&self) -> String;`                                                           | 몸통이 없으니 모든 구현이 만들어야 합니다.                                                                             |
| `fn describe(&self) -> String { format!(... self.name()) }`                           | 기본 구현입니다. `Dog`는 이것을 쓰고, `Robot`은 바꿔 썼습니다.                                                         |
| `fn introduce(x: &impl Describe) -> String`                                           | 정적 호출입니다. `introduce(&Dog)`와 `introduce(&Robot {...})`가 각각 다른 함수로 만들어집니다.                        |
| `let crowd: Vec<Box<dyn Describe>> = vec![Box::new(Dog), Box::new(Robot { id: 1 })];` | 서로 다른 자료형을 한 `Vec`에 담으려면 `Box<dyn ...>`로 감쌉니다. 크기가 다른 값들을 같은 크기의 상자로 만든 것입니다. |
| `fn largest<T: PartialOrd + Copy>(xs: &[T]) -> T`                                     | 비교할 수 있고(`>`), 복사할 수 있는(`let mut best = xs[0]`) `T`만 받습니다. 정수, 실수, 글자에 모두 쓰였습니다.        |
| `where T: Display,`                                                                   | 조건을 함수 이름 뒤에 따로 적었습니다. `format!("[{x}]")`에 `Display`가 필요합니다.                                    |
| `struct Pair<T> { a: T, b: T }`                                                       | 두 필드가 같은 자료형입니다. `Pair { a: 1, b: 2.0 }`은 `T`를 하나로 정할 수 없어 오류입니다.                           |
| `impl<T: Add<Output = T>> Add for Pair<T>`                                            | `+`를 구현했습니다. `type Output = Pair<T>;`는 "더한 결과의 자료형"입니다(연관 자료형).                                |

## 6. C로 구현하기

C에는 trait이 없지만, **함수 포인터를 모은 구조체**(vtable)로 동적 호출을, **`void *`와 크기**로 제네릭을 흉내 냅니다.

```c
// 파일: vtable.c
#include <stdio.h>

typedef struct Describer Describer;

typedef struct {                            // "능력"을 함수 포인터 표로 나타낸다(vtable)
    void (*name)(const Describer *self, char *out, size_t size);
    void (*describe)(const Describer *self, char *out, size_t size);
} DescribeOps;

struct Describer {
    const DescribeOps *ops;                 // 어떤 표를 쓰는지
    int id;                                 // 로봇이 쓰는 데이터
};

static void default_describe(const Describer *self, char *out, size_t size) {
    char n[32];
    self->ops->name(self, n, sizeof n);
    snprintf(out, size, "I am %s", n);      // 기본 구현
}

static void dog_name(const Describer *self, char *out, size_t size) {
    (void)self;
    snprintf(out, size, "dog");
}

static void robot_name(const Describer *self, char *out, size_t size) {
    snprintf(out, size, "robot #%d", self->id);
}

static void robot_describe(const Describer *self, char *out, size_t size) {
    char n[32];
    self->ops->name(self, n, sizeof n);
    snprintf(out, size, "beep, %s online", n);
}

static const DescribeOps DOG_OPS = {dog_name, default_describe};
static const DescribeOps ROBOT_OPS = {robot_name, robot_describe};

int int_greater(const void *a, const void *b) {   // void *로 "아무 자료형"을 흉내 낸다
    return *(const int *)a > *(const int *)b;
}

const void *largest(const void *base, size_t n, size_t size, int (*greater)(const void *, const void *)) {
    const char *p = base;
    const void *best = p;
    for (size_t i = 1; i < n; i++) {
        if (greater(p + i * size, best)) {
            best = p + i * size;
        }
    }
    return best;
}

int main(void) {
    Describer crowd[] = {{&DOG_OPS, 0}, {&ROBOT_OPS, 7}};
    char buf[64];
    for (int i = 0; i < 2; i++) {
        crowd[i].ops->describe(&crowd[i], buf, sizeof buf);   // 표를 따라가 함수를 부른다
        printf("  %s\n", buf);
    }
    int xs[] = {3, 9, 2};
    printf("largest: %d\n", *(const int *)largest(xs, 3, sizeof xs[0], int_greater));
    return 0;
}
```

실행 결과:

```text
  I am dog
  beep, robot #7 online
largest: 9
```

### 코드 한 부분씩 읽기

| 코드                                                                                | 설명                                                                                                                                                 |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { void (*name)(...); void (*describe)(...); } DescribeOps;`         | 능력의 목록을 함수 포인터로 적은 "표"입니다. Rust의 trait과 `dyn`의 속 모양입니다.                                                                   |
| `struct Describer { const DescribeOps *ops; int id; };`                             | 모든 객체가 자기 표의 주소를 가집니다. `Box<dyn Describe>`의 (데이터 주소, 표 주소)와 같습니다.                                                      |
| `static const DescribeOps DOG_OPS = {dog_name, default_describe};`                  | 강아지는 기본 구현을 표에 넣었습니다. 로봇은 자기 `robot_describe`를 넣었습니다.                                                                     |
| `crowd[i].ops->describe(&crowd[i], buf, sizeof buf)`                                | 표를 따라가 함수를 부르고, 객체 자신을 첫 인자(self)로 넘깁니다.                                                                                     |
| `const void *largest(const void *base, size_t n, size_t size, int (*greater)(...))` | `qsort`처럼 칸 크기와 비교 함수를 받아 "아무 자료형"을 다룹니다(Day 49). 자료형 검사는 없어서 `int` 배열에 `double` 비교 함수를 넘겨도 컴파일됩니다. |
| `p + i * size`                                                                      | `void *`로는 칸을 셀 수 없어서 `char *`로 바꿔 바이트 단위로 계산했습니다.                                                                           |

영문으로 출력한 이유는 `snprintf`로 만든 이름을 다른 문장에 끼워 넣을 때 바이트 크기를 계산하기 쉽게 하려는 것입니다. 한글도 동작하지만 버퍼 크기를 넉넉히 잡아야 합니다(Day 37).

## 7. Python으로 구현하기

```python
# 파일: protocols.py
from abc import ABC, abstractmethod


class Describe(ABC):                        # 약속을 적는 추상 클래스
    @abstractmethod
    def name(self):
        ...

    def describe(self):                     # 기본 구현
        return f"나는 {self.name()}"


class Dog(Describe):
    def name(self):
        return "강아지"


class Robot(Describe):
    def __init__(self, id):
        self.id = id

    def name(self):
        return f"로봇 {self.id}호"

    def describe(self):
        return f"삐빅, {self.name()} 작동 중"


class Duck:                                 # Describe를 물려받지 않았지만 name만 있으면 된다
    def name(self):
        return "오리"

    def describe(self):
        return f"꽥, {self.name()}"


for x in [Dog(), Robot(1), Duck()]:         # 덕 타이핑: 메서드만 있으면 쓸 수 있다
    print(" ", x.describe())

try:
    Describe()
except TypeError as e:
    print("TypeError:", str(e).split(" with")[0])


def largest(xs):                            # 비교만 되면 무엇이든(실행할 때 확인)
    best = xs[0]
    for x in xs:
        if x > best:
            best = x
    return best


print("largest:", largest([3, 9, 2]), largest([1.5, -2.0]), largest(["가", "하", "다"]))
try:
    largest([1, "a"])
except TypeError as e:
    print("TypeError:", e)
```

실행 결과:

```text
  나는 강아지
  삐빅, 로봇 1호 작동 중
  꽥, 오리
TypeError: Can't instantiate abstract class Describe
largest: 9 1.5 하
TypeError: '>' not supported between instances of 'str' and 'int'
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class Describe(ABC):` / `@abstractmethod` | 추상 클래스입니다. 이것을 물려받은 클래스가 `name`을 만들지 않으면 객체를 만들 때 `TypeError`입니다. Rust의 E0046을 실행할 때 알려 주는 셈입니다. |
| `def describe(self):`(추상 클래스 안)      | 기본 구현입니다. `Dog`는 물려받아 쓰고, `Robot`은 덮어썼습니다.                                                                                   |
| `class Duck:`                              | `Describe`를 물려받지 않았지만 `describe`가 있어서 같은 반복문에 쓸 수 있습니다. **덕 타이핑**입니다. "오리처럼 걷고 꽥 하면 오리다."             |
| `Describe()` → `TypeError`                 | 추상 클래스는 직접 만들 수 없습니다. 오류 문장은 Python 버전마다 뒤쪽이 달라서 앞부분만 출력했습니다.                                             |
| `def largest(xs):`                         | 경계를 적지 않아도 무엇이든 받습니다. 비교할 수 없는 값이 섞이면 **실행 중에** `TypeError`입니다. Rust는 같은 실수를 컴파일할 때 막습니다.        |

## 8. 실행 추적

`crowd`의 두 원소에서 `x.describe()`가 어떤 함수에 도착하는지 따라갑니다.

| 원소       | 자료형  | 표에서 찾은 `describe` | 그 안에서 부르는 `name` | 결과                     |
| ---------- | ------- | ---------------------- | ----------------------- | ------------------------ |
| `crowd[0]` | `Dog`   | 기본 구현              | `Dog::name`             | "나는 강아지"            |
| `crowd[1]` | `Robot` | `Robot::describe`      | `Robot::name`           | "삐빅, 로봇 1호 작동 중" |

기본 구현 안의 `self.name()`도 표를 거쳐서, 같은 기본 구현이 자료형마다 다른 `name`을 부릅니다. C 예제의 `default_describe`가 `self->ops->name(...)`을 부르는 것과 정확히 같은 흐름입니다.

## 9. 다른 예제로 다시 이해하기

**도형 목록.** 원, 사각형, 정사각형은 자료형이 다르지만 모두 "넓이와 이름을 말할 수 있다"는 능력이 있습니다. 한 목록에 담아 넓이가 큰 순으로 정렬하고, 전체 넓이와 두 도형 중 큰 것을 구합니다.

```rust
// 파일: shapes_dyn.rs
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;

    fn report(&self) -> String {            // 기본 구현은 다른 메서드를 써서 만든다
        format!("{:<10} 넓이 {:>7.2}", self.name(), self.area())
    }
}

struct Circle {
    r: f64,
}

struct Rect {
    w: f64,
    h: f64,
}

struct Square(f64);

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.r * self.r
    }
    fn name(&self) -> String {
        format!("원(r={})", self.r)
    }
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
    fn name(&self) -> String {
        format!("사각형({}x{})", self.w, self.h)
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.0 * self.0
    }
    fn name(&self) -> String {
        format!("정사각형({})", self.0)
    }
}

fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

fn bigger<'a>(a: &'a dyn Shape, b: &'a dyn Shape) -> &'a dyn Shape {
    if a.area() >= b.area() { a } else { b }
}

fn main() {
    let mut shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Rect { w: 4.0, h: 2.5 }),
        Box::new(Circle { r: 1.5 }),
        Box::new(Square(3.0)),
        Box::new(Circle { r: 0.5 }),
    ];
    shapes.sort_by(|a, b| b.area().total_cmp(&a.area()));   // 넓이가 큰 순서
    for s in &shapes {
        println!("{}", s.report());
    }
    println!("전체 넓이 {:.2}", total_area(&shapes));
    let winner = bigger(shapes[1].as_ref(), shapes[3].as_ref());
    println!("둘째와 넷째 중 큰 것: {}", winner.name());
}
```

실행 결과:

```text
사각형(4x2.5) 넓이   10.00
정사각형(3)    넓이    9.00
원(r=1.5)   넓이    7.07
원(r=0.5)   넓이    0.79
전체 넓이 26.85
둘째와 넷째 중 큰 것: 정사각형(3)
```

| 코드                                                                 | 설명                                                                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fn report(&self) -> String { ... }`(trait 안)                       | 기본 구현이 `name`과 `area`를 써서 한 줄을 만듭니다. 세 도형 모두 `report`를 따로 만들지 않았습니다.                                  |
| `struct Square(f64);`                                                | 튜플 구조체도 trait을 구현할 수 있습니다(Day 52).                                                                                     |
| `shapes.sort_by(\|a, b\| b.area().total_cmp(&a.area()))`             | 실수 넓이는 `total_cmp`로 비교합니다(Day 49). `b`와 `a`를 바꿔 큰 순서로 정렬했습니다.                                                |
| `fn total_area(shapes: &[Box<dyn Shape>]) -> f64`                    | 새 도형(삼각형)을 추가해도 이 함수는 고칠 필요가 없습니다. trait의 가장 큰 장점입니다.                                                |
| `fn bigger<'a>(a: &'a dyn Shape, b: &'a dyn Shape) -> &'a dyn Shape` | `&dyn Shape`로 빌려 받고 빌린 것을 돌려줍니다(Day 45). `shapes[1].as_ref()`는 `Box`에서 안쪽 참조를 꺼냅니다.                         |
| `{:<10}`                                                             | 이름을 왼쪽 정렬했지만, 한글이 섞여 칸이 완전히 맞지는 않습니다. Rust는 글자 수로 세지만 한글은 화면에서 두 칸을 차지하기 때문입니다. |

Rust는 실수 `4.0`을 `{}`로 출력하면 `4`, Python은 `4.0`으로 출력합니다. 그래서 두 프로그램의 이름 부분이 조금 다릅니다.

Python에서는 `Protocol`로 약속을 **문서처럼** 적고, 실제로는 덕 타이핑으로 동작합니다.

```python
# 파일: shapes_dyn.py
import math
from typing import Protocol


class Shape(Protocol):                      # 필요한 메서드 목록(검사 도구용 약속)
    def area(self) -> float: ...
    def name(self) -> str: ...


class Circle:
    def __init__(self, r):
        self.r = r

    def area(self):
        return math.pi * self.r * self.r

    def name(self):
        return f"원(r={self.r})"


class Rect:
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h

    def name(self):
        return f"사각형({self.w}x{self.h})"


class Square(Rect):                         # 사각형을 물려받아 한 변만 받는다
    def __init__(self, side):
        super().__init__(side, side)

    def name(self):
        return f"정사각형({self.w})"


def report(s: Shape) -> str:
    return f"{s.name():<10} 넓이 {s.area():>7.2f}"


shapes = [Rect(4.0, 2.5), Circle(1.5), Square(3.0), Circle(0.5)]
shapes.sort(key=lambda s: s.area(), reverse=True)
for s in shapes:
    print(report(s))
print(f"전체 넓이 {sum(s.area() for s in shapes):.2f}")
print("둘째와 넷째 중 큰 것:", max(shapes[1], shapes[3], key=lambda s: s.area()).name())
```

실행 결과:

```text
사각형(4.0x2.5) 넓이   10.00
정사각형(3.0)  넓이    9.00
원(r=1.5)   넓이    7.07
원(r=0.5)   넓이    0.79
전체 넓이 26.85
둘째와 넷째 중 큰 것: 정사각형(3.0)
```

- `class Shape(Protocol)`는 물려받지 않아도 되는 약속입니다. `Circle`, `Rect`는 `Shape`를 몰라도 되고, mypy 같은 검사 도구가 `report(s: Shape)`에 알맞은 객체가 넘어가는지 확인합니다. 실행할 때는 검사하지 않습니다.
- `class Square(Rect)`는 **상속**으로 넓이 계산을 물려받았습니다. Rust에는 구조체 상속이 없어서 `Square`에 `area`를 따로 구현했습니다. 대신 trait의 기본 구현으로 공통 동작을 나눕니다.
- `max(..., key=lambda s: s.area())`가 Rust의 `bigger`입니다.

## 10. 여러 자료형 다루기 대응표

| 하고 싶은 일                 | Rust                             | C                                        | Python                               |
| ---------------------------- | -------------------------------- | ---------------------------------------- | ------------------------------------ |
| 능력(약속) 적기              | `trait`                          | 함수 포인터 구조체(관례)                 | `ABC`, `Protocol`, 또는 적지 않음    |
| 약속 지키기                  | `impl Trait for Type`            | 표를 채워 객체에 연결                    | 메서드를 만들기(물려받기는 선택)     |
| 기본 동작                    | trait의 기본 구현                | 기본 함수를 표에 넣기                    | 부모 클래스의 메서드                 |
| 한 함수로 여러 자료형        | 제네릭 `<T: Trait>`(컴파일 검사) | `void *` + 크기 + 함수 포인터(검사 없음) | 그냥 받기(실행 중 확인)              |
| 서로 다른 자료형을 한 목록에 | `Vec<Box<dyn Trait>>`            | 표 포인터를 가진 구조체 배열             | 그냥 리스트                          |
| 연산자                       | `impl Add` 등                    | 없음                                     | `__add__` 등                         |
| 약속을 어기면                | 컴파일 오류                      | 실행 중 이상한 동작                      | 실행 중 `AttributeError`/`TypeError` |

## 11. 세 언어 비교

| 관점               | Rust                         | C                | Python                 |
| ------------------ | ---------------------------- | ---------------- | ---------------------- |
| 검사 시점          | 컴파일할 때                  | 없음             | 실행할 때              |
| 제네릭의 실행 비용 | 없음(자료형마다 코드를 만듦) | 함수 포인터 호출 | 동적(모든 호출이 찾기) |
| 동적 호출          | `dyn`(명시)                  | vtable 직접      | 기본                   |
| 새 자료형 추가     | 새 `impl`만 쓰면 됨          | 새 표를 만들기   | 새 클래스만 쓰면 됨    |
| 상속               | 없음(trait과 조합)           | 없음             | 있음                   |

## 12. 자주 하는 실수

### 실수 1: 트레이트 경계 없이 연산을 쓴다

```rust
// 파일: no_bound.rs (컴파일 오류: E0369)
fn largest<T: Copy>(xs: &[T]) -> T {
    let mut best = xs[0];
    for &x in xs {
        if x > best {
            best = x;
        }
    }
    best
}

fn main() {
    println!("{}", largest(&[3, 9, 2]));
}
```

실습의 디버그 문제입니다. 함수 안에서 쓰는 능력(`>`)을 경계(`PartialOrd`)로 적으세요.

### 실수 2: trait의 필수 메서드를 빠뜨린다

```rust
// 파일: missing_method.rs (컴파일 오류: E0046)
trait Describe {
    fn name(&self) -> String;
}

struct Dog;

impl Describe for Dog {}

fn main() {
    println!("{}", Dog.name());
}
```

몸통이 없는 메서드는 모두 구현해야 합니다. 기본 구현을 원하면 trait 쪽에 몸통을 쓰세요.

### 실수 3: 서로 다른 자료형을 그냥 Vec에 담는다

```rust
// 파일: mixed_vec.rs (컴파일 오류: E0308)
trait Describe {
    fn name(&self) -> String;
}

struct Dog;
struct Cat;

impl Describe for Dog {
    fn name(&self) -> String {
        String::from("강아지")
    }
}

impl Describe for Cat {
    fn name(&self) -> String {
        String::from("고양이")
    }
}

fn main() {
    let pets = vec![Dog, Cat];
    for p in &pets {
        println!("{}", p.name());
    }
}
```

같은 trait을 구현해도 자료형은 다릅니다. `let pets: Vec<Box<dyn Describe>> = vec![Box::new(Dog), Box::new(Cat)];`로 쓰세요.

### 실수 4: 경계를 너무 강하게 적는다

`T: Ord`를 요구하면 `f64`(NaN 때문에 `PartialOrd`만 있음)로 부를 수 없습니다. `T: Clone`이면 충분한데 `T: Copy`를 요구하면 `String`을 넘길 수 없습니다. 함수가 **실제로 쓰는 능력만** 요구하세요.

### 실수 5: Python에서 덕 타이핑을 믿고 약속을 적지 않는다

메서드 이름 하나만 틀려도(`are` 대신 `area`) 그 객체를 실제로 쓸 때에야 `AttributeError`가 납니다. 팀 코드에서는 `Protocol`과 검사 도구, 또는 `ABC`로 약속을 적어 두세요.

## 13. Q&A

**Q. trait과 Java·C#의 interface는 같은가요?**

A. 비슷합니다. 차이는 Rust는 **남이 만든 자료형**에도 내 trait을 구현할 수 있다는 점(`impl MyTrait for i32`)과, 제네릭 경계로 쓰면 동적 호출 없이 컴파일할 때 코드를 만든다는 점입니다. 다만 "내 것도 남의 것도 아닌 조합"(`impl Display for Vec<i32>`)은 막혀 있습니다(고아 규칙).

**Q. 제네릭을 쓰면 실행 파일이 커진다는데 괜찮나요?**

A. 자료형마다 함수가 복사되어 조금 커질 수 있습니다. 대부분은 문제되지 않고, 크기가 중요하면 `dyn`으로 바꿔 함수 하나를 공유하게 할 수 있습니다. 속도와 크기 사이의 선택입니다.

**Q. enum과 trait 중 무엇을 고르나요?**

A. Day 53의 Q&A처럼, 종류가 정해져 있고 새 **동작**을 자주 추가하면 enum, 종류가 계속 늘어나고 새 **종류**를 다른 사람이 추가해야 하면 trait입니다. 게임의 몇 가지 무기는 enum, 플러그인으로 추가되는 필터는 trait이 어울립니다.

**Q. Python의 상속과 Rust의 trait 중 무엇이 좋은가요?**

A. 상속은 코드를 물려받기 쉽지만, 부모를 바꾸면 모든 자식이 영향을 받고 "사각형을 물려받은 정사각형" 같은 관계가 나중에 어색해지기도 합니다. Rust는 "능력(trait)"과 "데이터(struct)"를 나누고 기본 구현으로 공통 동작을 나눕니다. Python에서도 깊은 상속보다 작은 클래스의 조합과 Protocol을 많이 권합니다.

## 14. 핵심 요약

- **trait**은 여러 자료형이 지킬 수 있는 메서드 약속입니다. `impl Trait for Type`으로 구현하고, 몸통이 있는 메서드는 기본 구현이라 바꿔 쓸 수 있습니다.
- **제네릭**은 자료형을 매개변수로 받습니다. 함수 안에서 쓰는 능력을 **트레이트 경계**(`T: PartialOrd + Copy`, `impl Display`, `where`)로 적고, 필요한 만큼만 요구합니다.
- 제네릭과 `impl Trait`은 **정적 호출**(자료형마다 코드를 만들어 빠름), `Box<dyn Trait>`·`&dyn Trait`은 **동적 호출**(메서드 표를 따라가며 서로 다른 자료형을 한 목록에)입니다.
- 연산자도 trait(`std::ops::Add`)이고, `derive`는 표준 trait을 자동으로 구현합니다.
- C는 함수 포인터 표(vtable)와 `void *`로 같은 일을 약속으로 하고, Python은 덕 타이핑·`ABC`·`Protocol`로 실행 중에 확인합니다.

## 15. 도전 문제

1. **(Rust)** 도형 trait에 `fn perimeter(&self) -> f64`를 추가하고 세 도형에 구현하세요. 그 뒤 `Triangle { a, b, c }`를 새로 추가해도 `total_area`와 정렬 코드는 고칠 필요가 없다는 것을 확인하세요.
2. **(Rust)** `fn largest_by<T, F: Fn(&T) -> f64>(xs: &[T], key: F) -> Option<&T>`를 만들어, Python의 `max(xs, key=...)`처럼 기준 함수를 받는 제네릭 함수를 만드세요.
3. **(C)** vtable 예제에 `cat` 표를 추가하고, `describe`를 기본 구현으로 두세요. 표에 `NULL`을 넣으면 기본 구현을 쓰게 하는 방식도 생각해 보세요.
4. **(Python)** 도형 예제의 `Shape`를 `ABC`로 바꾸고, `area`를 빠뜨린 `class Blob(Shape)`를 만들어 언제 오류가 나는지(클래스를 만들 때인가, 객체를 만들 때인가) 확인하세요.
