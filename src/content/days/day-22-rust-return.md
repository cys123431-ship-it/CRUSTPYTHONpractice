---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-22-rust-return
courseId: crp-92
phaseId: phase-02
dayNumber: 22
date: "2026-10-22"
title: 식과 문장 — Rust 함수가 값을 돌려주는 방법
summary: 값을 만들어 내는 '식(expression)'과 일을 하고 끝나는 '문장(statement)'을 구별하고, Rust에서 블록·if·match·loop가 모두 값을 가진 식이라는 것, 세미콜론이 식을 문장으로 바꿔 값을 ()로 만든다는 것, 함수 몸통의 마지막 식이 반환값이 되고 중간에서 돌려줄 때는 return을 쓴다는 것을 배웁니다. C에서 대입과 ?:가 식이고 if는 문장인 점, Python의 조건식·lambda·대입 식(:=)과 None을 비교하고, 택시 요금 계산기를 식 중심으로 작성해 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-21-functions-review]
learningObjectives:
  - 식과 문장을 구별하고, 세 언어에서 각각 어떤 것이 값을 가지는지 설명한다.
  - Rust의 블록·if·match·loop를 값으로 써서 바인딩과 반환값을 만든다.
  - 세미콜론이 식의 값을 버리고 ()를 만든다는 것을 이해하고, 관련 컴파일 오류(E0308)를 고친다.
  - 마지막 식 반환과 return(이른 반환)을 상황에 맞게 고른다.
  - C의 대입식·조건 연산자, Python의 조건식·lambda·:=를 쓰고 None과 ()를 비교한다.
concepts:
  [
    expression,
    statement,
    block expression,
    unit type,
    semicolon,
    implicit return,
    early return,
    if expression,
    lambda,
    walrus operator,
  ]
runnerMode: python
playgroundSource: |
  # 파일: expressions.py — 식과 문장을 바꿔 보세요.
  x = 7
  label = "홀수" if x % 2 else "짝수"     # 조건식: 값
  print(label)
  double = lambda n: n * 2               # 식 하나로 된 함수
  print(double(21))
  if (n := len("hello")) > 3:            # 대입 식
      print("길이", n)
  print(print("print의 반환값은?"))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day22-predict-rs
    title: 블록 식의 값 예측하기
    kind: predict
    objective: 블록이 마지막 식의 값을 가지며, 블록 안의 섀도잉이 바깥에 영향을 주지 않음을 확인한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let x = 5;
          let y = {
              let x = x * 2;
              x + 1
          };
          println!("{x} {y}");
      }
    answer: "5 11"
    hint: "블록 안의 x는 10인 새 바인딩이고, 블록의 값은 마지막 식 x + 1입니다."
    explanation: "블록 { ... }은 마지막 식(세미콜론 없음)의 값 11을 가지고, 그것이 y에 들어갑니다. 블록 안에서 섀도잉한 x = 10은 블록이 끝나면 사라져 바깥 x는 5 그대로입니다(Day 4)."
    commonMistakes:
      - "블록 안의 x가 바깥 x를 바꾼다고 생각해 10 11로 적음"
      - "블록이 값을 가지지 않는다고 생각함"
    language: rust
    verification: run
  - id: ex-day22-predict-py
    title: 대입 식과 조건식 예측하기
    kind: predict
    objective: ":=가 값을 이름에 담으면서 그 값을 돌려준다는 것을 확인한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      nums = [4, 9, 2]
      if (total := sum(nums)) > 10:
          print(total, "큼" if total > 12 else "보통")
    answer: "15 큼"
    hint: "total := sum(nums)는 15를 total에 담고, 그 값 15를 비교에 씁니다."
    explanation: "sum(nums) = 15가 total에 담기고, 그 값으로 15 > 10을 비교해 if 몸통이 실행됩니다. 조건식에서도 15 > 12가 참이라 '큼'이 골라집니다. :=는 대입과 동시에 값을 돌려주는 식이라 if 조건 안에서 값을 구하고 바로 쓸 수 있습니다."
    commonMistakes:
      - ":=를 비교 연산자로 착각함"
      - "total이 if 밖에서는 없다고 생각함(Python에서는 남아 있음)"
    language: python
    verification: run
  - id: ex-day22-fill
    title: if 표현식으로 큰 값 돌려주기
    kind: fill
    objective: 함수의 마지막 식으로 if 표현식을 써서 값을 돌려준다.
    prompt: "빈칸을 채워 max2(3, 7)이 7을 돌려주게 하세요."
    starter: |-
      fn max2(a: i32, b: i32) -> i32 {
          if a > b { a } _____ { b }
      }

      fn main() {
          println!("{}", max2(3, 7));
      }
    answer: |-
      fn max2(a: i32, b: i32) -> i32 {
          if a > b { a } else { b }
      }

      fn main() {
          println!("{}", max2(3, 7));
      }
    output: "7"
    hint: "값을 돌려주는 if에는 거짓일 때의 갈래가 반드시 필요합니다."
    explanation: "if a > b { a } else { b }가 함수의 마지막 식이라 그 값이 반환됩니다. return도 세미콜론도 없습니다. C라면 return a > b ? a : b;로 씁니다."
    commonMistakes:
      - "else 없이 써서 E0317 오류가 남"
      - "{ a; }처럼 갈래 안에 세미콜론을 붙여 ()가 됨"
    language: rust
    verification: run
  - id: ex-day22-modify
    title: if 문장을 조건식으로 바꾸기
    kind: modify
    objective: 값 하나를 고르는 if 문장을 조건식 한 줄로 바꾼다.
    prompt: "label을 정하는 네 줄짜리 if 문장을 조건식 한 줄로 바꾸세요. 출력은 그대로 '성인'이어야 합니다."
    starter: |-
      age = 20
      if age >= 19:
          label = "성인"
      else:
          label = "미성년"
      print(label)
    answer: |-
      age = 20
      label = "성인" if age >= 19 else "미성년"
      print(label)
    output: "성인"
    hint: "값 if 조건 else 다른 값 모양입니다."
    explanation: "두 갈래 모두 label에 값을 넣기만 한다면, 조건식으로 '값을 고른 뒤 한 번 대입'하는 편이 짧고, label을 대입하지 않는 갈래가 생길 수도 없습니다. 갈래마다 하는 일이 여러 줄이면 if 문장이 더 읽기 쉽습니다."
    commonMistakes:
      - 'label = if age >= 19: "성인"처럼 문장을 식 자리에 써서 SyntaxError가 남'
      - "조건과 값의 순서를 C처럼 age >= 19 ? ... 로 씀"
    language: python
    verification: run
  - id: ex-day22-debug
    title: 마지막 식의 세미콜론 오류 고치기
    kind: debug
    objective: 세미콜론 때문에 함수가 ()를 돌려주게 된 오류를 고친다.
    prompt: "이 코드는 E0308(mismatched types: expected u32, found ()) 오류로 컴파일되지 않습니다. 고쳐서 area(3, 4)의 결과 12가 출력되게 하세요."
    starter: |-
      fn area(w: u32, h: u32) -> u32 {
          w * h;
      }

      fn main() {
          println!("{}", area(3, 4));
      }
    answer: |-
      fn area(w: u32, h: u32) -> u32 {
          w * h
      }

      fn main() {
          println!("{}", area(3, 4));
      }
    output: "12"
    hint: "세미콜론은 식의 값을 버리는 표시입니다. 컴파일러가 'remove this semicolon to return this value'라고 알려 줍니다."
    explanation: "w * h;는 값을 계산한 뒤 버리는 문장이라, 함수 몸통의 값은 ()가 됩니다. -> u32와 맞지 않아 오류입니다. 세미콜론을 지우거나 return w * h;로 씁니다. Rust에서는 마지막 식을 쓰는 쪽이 관례입니다."
    commonMistakes:
      - "반환 자료형을 지워 오류만 없애고 값은 버림"
      - "return w * h 뒤에 세미콜론이 있으면 안 된다고 생각함(return 문장에는 있어도 됨)"
    language: rust
    verification: run
  - id: ex-day22-independent
    title: C 조건 연산자로 clamp 쓰기
    kind: independent
    objective: 조건 연산자를 겹쳐 써서 return 한 줄로 값을 고른다.
    prompt: "int clamp(int v, int lo, int hi)를 return 한 줄(조건 연산자)로 만들어 clamp(-3, 0, 10), clamp(5, 0, 10), clamp(99, 0, 10)을 '0 5 10'으로 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("? ? ?\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int clamp(int v, int lo, int hi) {
          return v < lo ? lo : v > hi ? hi : v;
      }

      int main(void) {
          printf("%d %d %d\n", clamp(-3, 0, 10), clamp(5, 0, 10), clamp(99, 0, 10));
          return 0;
      }
    output: "0 5 10"
    hint: "조건 연산자는 오른쪽부터 묶입니다. v < lo ? lo : (v > hi ? hi : v)처럼 읽으면 됩니다."
    explanation: "C의 ?:는 식이라 return 뒤에 바로 쓸 수 있고, 겹치면 else-if 사다리처럼 동작합니다. 세 단계 넘게 겹치면 읽기 어려우니 if 문장을 쓰세요. Rust는 if 표현식, Python은 조건식으로 같은 일을 합니다."
    commonMistakes:
      - "v < lo ? lo : v > hi ? v : hi처럼 마지막 두 값을 바꿔 씀"
      - "조건 연산자 안에 return을 넣으려 함(return은 문장이라 식 안에 쓸 수 없음)"
    language: c
    verification: run
quiz:
  - id: quiz-day22-01
    question: 다음 중 Rust에서 '값을 가진 식'이 아닌 것은?
    choices:
      - "{ let a = 1; a + 1 }"
      - if x > 0 { 1 } else { 2 }
      - let y = 5;
      - match n { 0 => 'z', _ => 'n' }
    answerIndex: 2
    explanation: let은 바인딩을 만드는 문장이라 값이 없습니다. 그래서 let x = (let y = 5);처럼 쓸 수 없습니다. 블록, if, match, loop는 모두 값을 가진 식입니다.
  - id: quiz-day22-02
    question: Rust에서 { 3 + 4; }의 값은?
    choices: ["7", "()", "3", "컴파일 오류"]
    answerIndex: 1
    explanation: 세미콜론이 3 + 4의 값을 버리고, 블록의 마지막에 식이 없으니 블록의 값은 ()(unit, '아무것도 아님')입니다. 값을 가진 블록을 원하면 마지막 식에 세미콜론을 붙이지 않습니다.
  - id: quiz-day22-03
    question: Rust 함수에서 return을 꼭 써야 하는 경우는?
    choices:
      - 모든 함수
      - 마지막 줄이 아닌 곳에서 함수를 끝내고 값을 돌려줄 때(이른 반환)
      - 반환 자료형이 bool일 때
      - main 함수에서만
    answerIndex: 1
    explanation: 몸통의 마지막 식은 return 없이 반환됩니다. 중간에서 조건에 따라 일찍 끝내려면 return 값;을 씁니다. 이른 반환과 마지막 식 반환을 섞어 쓰는 것이 Rust의 흔한 모양입니다.
  - id: quiz-day22-04
    question: C에서 int y = (x = 5) + 1;이 가능한 이유는?
    choices:
      - C에서는 괄호 안의 모든 것이 0이라서
      - 대입도 대입한 값을 결과로 가지는 식이라서
      - 컴파일러가 x = 5를 무시해서
      - 불가능하다
    answerIndex: 1
    explanation: C의 대입 x = 5는 값 5를 가진 식이라 다른 식 안에 쓸 수 있습니다. 편리하지만 if (x = 5) 같은 실수의 원인이기도 합니다. Rust의 대입식 값은 ()라서 이런 실수가 원천적으로 막힙니다.
  - id: quiz-day22-05
    question: Python의 None과 Rust의 ()에 대한 설명으로 옳은 것은?
    choices:
      - 둘 다 숫자 0이다
      - 둘 다 '돌려줄 값이 없는' 함수의 결과로 쓰이는 특별한 값이다
      - None은 오류, ()는 빈 튜플의 오류다
      - 둘 다 함수를 끝내는 키워드다
    answerIndex: 1
    explanation: return이 없는 Python 함수는 None을, 반환 자료형이 없는 Rust 함수는 ()를 돌려줍니다. C의 void 함수는 아예 값을 돌려주지 않아서, 그 결과를 변수에 담으면 컴파일 오류입니다.
---

## 1. 오늘 배울 내용

Day 13에서 Rust의 `if`가 값을 돌려준다는 것을, Day 20에서 함수의 마지막 식이 반환값이 된다는 것을 봤습니다. 오늘은 그 바탕에 있는 **식과 문장**의 차이를 정리합니다.

1. **식(expression)**: 계산해서 **값**을 만들어 냅니다. `3 + 4`, `square(5)`, `x > 0`
2. **문장(statement)**: **일**을 하고 끝나며, 값이 없습니다. `let x = 5;`, C의 `if`, Python의 `for`
3. Rust에서는 여러 가지가 **값을 가진 식**입니다.
   - 블록 `{ }`
   - `if`
   - `match`
   - `loop`
4. **세미콜론**이 식을 문장으로 바꿔 값을 `()`로 만든다는 것과, 그 때문에 생기는 오류(E0308)를 봅니다.
5. **마지막 식 반환**과 **`return`**(이른 반환)을 구별해 씁니다.
6. 다른 두 언어를 비교합니다.
   - C: 대입과 `?:`는 식, `if`는 문장
   - Python: 조건식, `lambda`, 대입 식 `:=`, `None`
7. 택시 요금 계산기를 **식 중심으로** 만들어 봅니다.

## 2. 왜 필요한가

식과 문장의 차이를 알면 Rust의 오류 메시지를 이해하기 쉬워집니다. Rust를 처음 배울 때 가장 자주 보는 오류 중 하나가 "expected `i32`, found `()`"인데, 이것은 거의 항상 **마지막 줄의 세미콜론** 때문입니다.

또 "값을 고르는" 코드를 식으로 쓰면 더 안전해집니다.

```text
문장으로 값을 고르기                    식으로 값을 고르기
let label;                              let label = if ok { "성공" } else { "실패" };
if ok { label = "성공"; }
else  { label = "실패"; }
(갈래 하나에서 대입을 빠뜨릴 수 있음)      (빠뜨리면 컴파일 오류, label은 mut도 필요 없음)
```

식으로 쓰면 모든 갈래가 값을 내야 하므로 "값을 넣지 않은 경우"가 생길 수 없습니다.

## 3. 그림으로 이해하기

식은 **값을 내놓는 상자**, 문장은 **일만 하는 상자**라고 생각하세요.

```text
식(expression)                        문장(statement)
┌──────────┐                          ┌──────────────┐
│  3 + 4   │ ──▶ 7                    │ let x = 5;   │ ──▶ (값 없음, x를 만든다)
└──────────┘                          └──────────────┘
┌──────────────────────┐              ┌──────────────┐
│ if x > 0 {1} else {2}│ ──▶ 1        │ x * 2;       │ ──▶ () 계산했지만 버림
└──────────────────────┘              └──────────────┘
```

Rust의 **블록**은 안의 문장들을 차례로 실행한 뒤, **마지막 식**의 값을 블록 전체의 값으로 내놓습니다.

```text
let y = {
    let a = 3;      ← 문장
    let b = 4;      ← 문장
    a * a + b * b   ← 마지막 식(세미콜론 없음) → 블록의 값 25
};                  ← let 문장의 끝
```

마지막 줄에 세미콜론을 붙이면 `a * a + b * b;`는 값을 버리는 문장이 되고, 블록의 값은 `()`(unit)가 됩니다. **함수 몸통도 블록**이라서 같은 규칙으로 반환값이 정해집니다.

## 4. 천천히 풀어보기

### 4.1 세 언어에서 무엇이 식인가

| 코드 조각          | C                | Python               | Rust                                             |
| ------------------ | ---------------- | -------------------- | ------------------------------------------------ |
| `3 + 4`, 함수 호출 | 식               | 식                   | 식                                               |
| 대입 `x = 5`       | **식**(값 5)     | 문장(`:=`는 식)      | 식이지만 값은 `()`                               |
| 조건 선택          | `c ? a : b` (식) | `a if c else b` (식) | `if c { a } else { b }` (식)                     |
| `if` 블록          | 문장             | 문장                 | **식**                                           |
| `match`/`switch`   | `switch`는 문장  | `match`는 문장       | **식**                                           |
| 반복               | 문장             | 문장                 | `loop`는 식(`break` 값), `for`/`while`은 값 `()` |
| 블록 `{ }`         | 문장             | (없음)               | **식**                                           |
| 변수 만들기        | 선언(문장)       | 대입(문장)           | `let`(문장)                                      |

Rust는 거의 모든 것이 식이고, **`let`과 세미콜론으로 끝난 줄**만 문장이라고 생각하면 됩니다.

### 4.2 세미콜론의 역할

| 쓴 것       | 뜻                                 | 값      |
| ----------- | ---------------------------------- | ------- |
| `x + 1`     | 식                                 | `x + 1` |
| `x + 1;`    | 식을 계산하고 값을 버리는 문장     | (없음)  |
| `{ a; b }`  | `a`를 실행하고, 블록의 값은 `b`    | `b`     |
| `{ a; b; }` | 둘 다 실행하고, 마지막에 식이 없음 | `()`    |

그래서 "값을 돌려줘야 하는 자리"의 마지막 줄에는 세미콜론을 붙이지 않습니다. 함수 몸통, `if`의 각 갈래, `match`의 각 갈래, 값을 가진 블록이 그런 자리입니다.

### 4.3 마지막 식과 return

```rust
fn safe_div(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        return None;        // 중간에서 끝내며 돌려줌 → return
    }
    Some(a / b)             // 마지막 식 → return 없이 반환
}
```

| 상황                          | 쓰는 것                               |
| ----------------------------- | ------------------------------------- |
| 몸통의 끝에서 값을 돌려줌     | 마지막 식(세미콜론 없이)              |
| 조건에 따라 **중간에서** 끝냄 | `return 값;`                          |
| 반복 안에서 찾자마자 돌려줌   | `return 값;` 또는 `loop` + `break 값` |

`return 값;`은 문장이지만, 함수를 즉시 끝내므로 그 뒤의 코드는 실행되지 않습니다.

### 4.4 ()와 None과 void

값을 돌려주지 않는 함수의 결과는 언어마다 다르게 다룹니다.

| 언어   | 반환값이 없는 함수    | 그 결과를 변수에 담으면    |
| ------ | --------------------- | -------------------------- |
| C      | `void f(...)`         | **컴파일 오류**(값이 없음) |
| Python | `return`이 없는 `def` | `None`이 담김              |
| Rust   | `->`가 없는 `fn`      | `()`가 담김                |

`()`는 "빈 튜플"이자 "의미 있는 값이 없음"을 나타내는 자료형이면서 동시에 그 유일한 값입니다.

## 5. Rust로 구현하기

```rust
// 파일: expressions.rs
fn sign(n: i32) -> &'static str {
    if n > 0 {                              // if 전체가 함수의 마지막 식
        "양수"
    } else if n < 0 {
        "음수"
    } else {
        "영"
    }
}

fn grade(score: u32) -> char {
    match score {                           // match 전체가 마지막 식
        90..=100 => 'A',
        80..=89 => 'B',
        _ => 'C',
    }
}

fn first_multiple(start: u32, k: u32) -> u32 {
    let mut x = start;
    loop {                                  // loop도 break 값을 가진 식
        if x % k == 0 {
            break x;
        }
        x += 1;
    }
}

fn distance(x1: f64, y1: f64, x2: f64, y2: f64) -> f64 {
    let dx = x2 - x1;                       // 문장(let)
    let dy = y2 - y1;
    (dx * dx + dy * dy).sqrt()              // 식: 이 값이 반환된다
}

fn safe_div(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        return None;                        // 중간에서 돌려줄 때는 return
    }
    Some(a / b)
}

fn describe(n: i32) {                       // 반환 자료형이 없으면 ()
    println!("{n}은 {}", sign(n));
}

fn main() {
    let y = {                               // 블록도 값을 가진다
        let a = 3;
        let b = 4;
        a * a + b * b
    };
    println!("블록의 값: {y}");

    let nothing = {
        let _t = 5;                         // 마지막이 문장이면 블록의 값은 ()
    };
    println!("세미콜론으로 끝난 블록의 값: {nothing:?}");

    println!("{} {} {}", sign(7), sign(-2), sign(0));
    println!("{} {} {}", grade(95), grade(85), grade(40));
    println!("30 이상의 첫 7의 배수: {}", first_multiple(30, 7));
    println!("거리: {:.3}", distance(0.0, 0.0, 3.0, 4.0));
    println!("{:?} {:?}", safe_div(17, 5), safe_div(1, 0));

    let result = describe(5);               // describe가 돌려준 ()
    println!("describe의 반환값: {result:?}");
}
```

실행 결과:

```text
블록의 값: 25
세미콜론으로 끝난 블록의 값: ()
양수 음수 영
A B C
30 이상의 첫 7의 배수: 35
거리: 5.000
Some(3) None
5은 양수
describe의 반환값: ()
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `fn sign(n: i32) -> &'static str { if ... }`    | 함수 몸통의 유일한 식이 `if` 표현식이라, 고른 문자열이 그대로 반환됩니다.                                        |
| `fn grade(...) -> char { match score { ... } }` | `match` 전체가 마지막 식입니다. 각 갈래의 값(`'A'`, `'B'`, `'C'`)이 반환값이 됩니다.                             |
| `loop { if ... { break x; } x += 1; }`          | `loop` 전체가 함수의 마지막 식이라 `break x`의 값이 반환됩니다.                                                  |
| `(dx * dx + dy * dy).sqrt()`                    | 앞의 두 `let`은 문장, 마지막 줄만 식입니다.                                                                      |
| `return None;` / `Some(a / b)`                  | 이른 반환과 마지막 식 반환을 함께 썼습니다.                                                                      |
| `let y = { ...; a * a + b * b };`               | 함수가 아닌 곳에서도 블록을 값으로 쓸 수 있습니다. 계산에만 쓰는 임시 변수 `a`, `b`가 블록 밖으로 새지 않습니다. |
| `let nothing = { let _t = 5; };`                | 블록이 문장으로 끝나서 값이 `()`입니다. `{:?}`로 출력하면 `()`로 보입니다.                                       |
| `let result = describe(5);`                     | 반환 자료형이 없는 함수의 결과는 `()`입니다.                                                                     |

## 6. C로 구현하기

C에서는 대입과 조건 연산자가 식이지만, `if`와 블록은 문장입니다. 그래서 "값을 고르는 `if`"는 쓸 수 없고, 변수를 먼저 선언한 뒤 갈래마다 대입하거나 `?:`를 씁니다.

```c
// 파일: expressions.c
#include <stdio.h>
#include <math.h>

const char *sign(int n) {
    return n > 0 ? "양수" : n < 0 ? "음수" : "영";   // 조건 연산자를 겹쳐 쓴 식
}

double distance(double x1, double y1, double x2, double y2) {
    double dx = x2 - x1;
    double dy = y2 - y1;
    return sqrt(dx * dx + dy * dy);
}

int main(void) {
    int x;
    int y = (x = 5) + 1;                    // 대입도 값(5)을 가진 식이다
    printf("x = %d, y = %d\n", x, y);

    int a = 3, b = 4;
    int bigger = a > b ? a : b;             // 조건식: 값 하나를 고른다
    printf("큰 값: %d\n", bigger);

    int n = printf("printf도 값을 돌려준다\n");    // 출력한 바이트 수
    printf("방금 출력한 바이트 수: %d\n", n);

    printf("%s %s %s\n", sign(7), sign(-2), sign(0));
    printf("거리: %.3f\n", distance(0.0, 0.0, 3.0, 4.0));

    // if는 문장이라 값을 가지지 않는다. 값을 고르려면 변수에 대입한다
    const char *parity;
    if (a % 2 == 0) {
        parity = "짝수";
    } else {
        parity = "홀수";
    }
    printf("%d은 %s\n", a, parity);
    return 0;
}
```

실행 결과:

```text
x = 5, y = 6
큰 값: 4
printf도 값을 돌려준다
방금 출력한 바이트 수: 30
양수 음수 영
거리: 5.000
3은 홀수
```

### 코드 한 부분씩 읽기

| 코드                                                                    | 설명                                                                                                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `return n > 0 ? "양수" : n < 0 ? "음수" : "영";`                        | 조건 연산자를 겹쳐 쓴 식입니다. 오른쪽부터 묶여 `n > 0 ? "양수" : (n < 0 ? "음수" : "영")`로 읽습니다.                                            |
| `int y = (x = 5) + 1;`                                                  | 대입 `x = 5`의 값 5에 1을 더합니다. 이렇게 식 안에 대입을 섞으면 읽기 어려우니, 실제 코드에서는 두 줄로 나누세요.                                 |
| `int n = printf(...);`                                                  | `printf`는 출력한 바이트 수를 돌려주는 식입니다. 한글 글자는 UTF-8에서 3바이트라 30이 되었습니다. 대부분은 이 값을 버리는 **식 문장**으로 씁니다. |
| `const char *parity; if (...) { parity = ...; } else { parity = ...; }` | `if`가 문장이라 값을 직접 돌려받을 수 없습니다. 선언과 대입을 나눠야 합니다.                                                                      |

## 7. Python으로 구현하기

Python은 문장과 식의 구분이 분명합니다. `if`, `for`, `def`, 대입은 문장이고, 식 자리에서 값을 고르려면 **조건식**을, 짧은 함수는 **`lambda`** 를, 식 안에서 값을 이름에 담으려면 **`:=`** 를 씁니다.

```python
# 파일: expressions.py
import math

x = 3 + 4                                   # 3 + 4는 식, x = ...는 문장
sign = "양수" if x > 0 else "음수"            # 조건식(식)
print(x, sign)

square = lambda n: n * n                    # 식 하나로 된 이름 없는 함수
print("square(5) =", square(5))

values = [1, 5, 2, 8]
if (n := len(values)) > 3:                  # 대입 식 :=, 값도 돌려준다
    print(f"길이 {n}: 3보다 길다")


def distance(x1, y1, x2, y2):
    dx, dy = x2 - x1, y2 - y1
    return math.sqrt(dx * dx + dy * dy)


def describe(n):
    print(f"{n}은", "양수" if n > 0 else "음수" if n < 0 else "영")


print(f"거리: {distance(0, 0, 3, 4):.3f}")
result = describe(5)                        # return이 없으면 None
print("describe의 반환값:", result)
print("print의 반환값:", print("print도 None을 돌려준다"))
```

실행 결과:

```text
7 양수
square(5) = 25
길이 4: 3보다 길다
거리: 5.000
5은 양수
describe의 반환값: None
print도 None을 돌려준다
print의 반환값: None
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sign = "양수" if x > 0 else "음수"`             | 조건식은 식이라 대입의 오른쪽에 쓸 수 있습니다. `if` 문장은 쓸 수 없습니다.                                                                                        |
| `square = lambda n: n * n`                       | `lambda 매개변수: 식`은 **식 하나**로 된 이름 없는 함수입니다. 몸통에 문장(대입, `for`)을 쓸 수 없습니다. 정렬 기준처럼 짧은 함수를 넘길 때 씁니다.                |
| `if (n := len(values)) > 3:`                     | **대입 식**(바다코끼리 연산자)입니다. `len(values)`를 `n`에 담으면서 그 값 4를 비교에 씁니다. 괄호가 필요합니다. Python 3.8부터 쓸 수 있습니다.                    |
| `"양수" if n > 0 else "음수" if n < 0 else "영"` | 조건식을 겹쳐 쓰면 오른쪽부터 묶입니다. C의 `?:` 겹치기와 같습니다.                                                                                                |
| `print("print의 반환값:", print(...))`           | 안쪽 `print`가 먼저 실행되어 한 줄을 출력하고 `None`을 돌려줍니다. 그다음 바깥 `print`가 그 `None`을 출력합니다. 실행 순서가 인자 계산 → 함수 호출이기 때문입니다. |

## 8. 실행 추적

Rust의 `distance(0.0, 0.0, 3.0, 4.0)` 몸통이 실행되는 과정을 문장과 식으로 나눠 따라갑니다.

| 줄                           | 종류 | 한 일                       | 값             |
| ---------------------------- | ---- | --------------------------- | -------------- |
| `let dx = x2 - x1;`          | 문장 | `x2 - x1`(식)을 계산해 묶음 | `dx = 3.0`     |
| `let dy = y2 - y1;`          | 문장 | `y2 - y1`을 계산해 묶음     | `dy = 4.0`     |
| `(dx * dx + dy * dy).sqrt()` | 식   | 9 + 16 = 25, √25            | **5.0 → 반환** |

문장은 값을 남기지 않고 일(바인딩 만들기)만 했고, 몸통의 값은 마지막 식 하나로 정해졌습니다. 마지막 줄 끝에 `;`를 붙였다면 몸통의 값이 `()`가 되어 `-> f64`와 맞지 않는 오류가 났을 것입니다.

## 9. 다른 예제로 다시 이해하기

택시 요금을 계산해 봅시다(실제 요금과는 다른 연습용 규칙입니다).

1. 기본요금은 4,800원이고 처음 1,600m까지 포함됩니다.
2. 1,600m를 넘으면 132m마다 100원이 추가됩니다(모자란 거리도 한 칸으로 올림).
3. 밤(22시 이후, 4시 이전)에는 20% 할증하고, 100원 단위로 반올림합니다.

Rust로 쓰면 각 규칙이 **값을 돌려주는 식** 하나로 표현됩니다.

```rust
// 파일: taxi.rs
fn distance_fare(meters: u32) -> u32 {
    let extra = if meters > 1600 { meters - 1600 } else { 0 };
    let units = extra.div_ceil(132);        // 올림 나눗셈
    4800 + units * 100
}

fn is_night(hour: u32) -> bool {
    hour >= 22 || hour < 4
}

fn taxi_fare(meters: u32, hour: u32) -> u32 {
    let fare = distance_fare(meters);
    if is_night(hour) {
        (fare * 12 / 10 + 50) / 100 * 100   // 20% 할증 후 100원 단위 반올림
    } else {
        fare
    }
}

fn main() {
    for (meters, hour) in [(1000, 14), (1600, 14), (1601, 14), (5000, 14), (5000, 23)] {
        println!("{meters:>5}m, {hour:>2}시: {:>5}원", taxi_fare(meters, hour));
    }
}
```

실행 결과:

```text
 1000m, 14시:  4800원
 1600m, 14시:  4800원
 1601m, 14시:  4900원
 5000m, 14시:  7400원
 5000m, 23시:  8900원
```

| 부분                                               | 설명                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `let extra = if ... { meters - 1600 } else { 0 };` | `u32`에서 `meters - 1600`이 음수가 되지 않도록, 1600 이하일 때는 0을 고릅니다(Day 10).           |
| `extra.div_ceil(132)`                              | 올림 나눗셈입니다. 1m만 넘어도 한 칸(100원)입니다. 경계값 1600m와 1601m로 시험했습니다.          |
| `(fare * 12 / 10 + 50) / 100 * 100`                | 정수만으로 20% 할증(× 1.2)과 100원 단위 반올림(+ 50 후 버림)을 합니다. 7400 × 1.2 = 8880 → 8900. |
| `taxi_fare`의 `if` 표현식                          | 밤이면 할증한 값, 아니면 원래 요금을 고릅니다. 이 `if`가 함수의 마지막 식입니다.                 |

같은 규칙을 Python으로 쓰면 조건식과 올림 나눗셈 요령(`-(-a // b)`)을 씁니다.

```python
# 파일: taxi.py
def distance_fare(meters):
    extra = meters - 1600 if meters > 1600 else 0
    units = -(-extra // 132)                # 음수로 바꿔 내림 = 올림
    return 4800 + units * 100


def taxi_fare(meters, hour):
    fare = distance_fare(meters)
    night = hour >= 22 or hour < 4
    return (fare * 12 // 10 + 50) // 100 * 100 if night else fare


for meters, hour in ((1000, 14), (1600, 14), (1601, 14), (5000, 14), (5000, 23)):
    print(f"{meters:>5}m, {hour:>2}시: {taxi_fare(meters, hour):>5}원")
```

실행 결과:

```text
 1000m, 14시:  4800원
 1600m, 14시:  4800원
 1601m, 14시:  4900원
 5000m, 14시:  7400원
 5000m, 23시:  8900원
```

`-(-extra // 132)`는 Python의 `//`가 내림이라는 성질(Day 5)을 이용한 올림입니다. `-3400 // 132 = -26`(−25.76을 내림)이고, 부호를 되돌리면 26입니다. `math.ceil(extra / 132)`로도 같지만 실수 나눗셈을 거치지 않는 정수 방법이 더 안전합니다.

## 10. 식과 문장 한눈에 보기

| 하고 싶은 일               | Rust                          | C                                | Python                              |
| -------------------------- | ----------------------------- | -------------------------------- | ----------------------------------- |
| 조건에 따라 값 고르기      | `if c { a } else { b }`       | `c ? a : b`                      | `a if c else b`                     |
| 여러 경우 중 값 고르기     | `match x { ... }`             | `?:` 겹치기 또는 `switch` + 대입 | 조건식 겹치기, `match` + 대입, 사전 |
| 계산용 임시 변수를 가두기  | 블록 `{ let t = ...; t * 2 }` | 블록 `{ }` 안에 선언(값은 없음)  | (함수로 분리)                       |
| 식 안에서 값을 이름에 담기 | (없음, `let`을 먼저)          | 대입식 `(x = f())`               | `:=`                                |
| 짧은 이름 없는 함수        | 클로저 `\|n\| n * n`          | (없음)                           | `lambda n: n * n`                   |
| 값 없는 함수의 결과        | `()`                          | (없음, `void`)                   | `None`                              |

Rust의 **클로저**(`|n| n * n`)는 Python의 `lambda`와 비슷한데, Day 90의 반복자 집계에서 많이 씁니다.

## 11. 세 언어 비교

| 관점             | Rust                          | C                     | Python                              |
| ---------------- | ----------------------------- | --------------------- | ----------------------------------- |
| 기본 철학        | 거의 모든 것이 식             | 식과 문장이 섞여 있음 | 식과 문장을 엄격히 구분             |
| 함수의 반환      | 마지막 식 또는 `return`       | `return`만            | `return`만(없으면 `None`)           |
| 세미콜론         | 식을 문장으로 바꿈(값을 버림) | 문장의 끝 표시        | 쓰지 않음(한 줄에 여러 문장일 때만) |
| 조건 자리의 대입 | 불가능(값이 `()`)             | 가능(흔한 버그)       | 문법 오류(`:=`만 가능)              |
| 값을 가진 `if`   | 있음                          | 없음(`?:`)            | 없음(조건식)                        |

## 12. 자주 하는 실수

### 실수 1: 마지막 식에 세미콜론을 붙인다 (Rust)

실습의 디버그 문제입니다. `expected i32, found ()`를 보면 가장 먼저 마지막 줄의 세미콜론을 확인하세요.

### 실수 2: if 갈래 안에 세미콜론을 붙인다 (Rust)

```rust
// 파일: branch_semicolon.rs (컴파일 오류: E0308)
fn main() {
    let n = 3;
    let kind = if n % 2 == 0 { "짝수"; } else { "홀수" };
    println!("{kind}");
}
```

첫 갈래는 `()`, 둘째 갈래는 `&str`이라 자료형이 맞지 않습니다. 값을 돌려줄 갈래에는 세미콜론을 쓰지 마세요.

### 실수 3: 문장을 식 자리에 쓴다 (Python)

```python
# 파일: statement_as_value.py (컴파일 오류: SyntaxError)
age = 20
label = if age >= 19: "성인"
```

`if`는 문장이라 대입의 오른쪽에 올 수 없습니다. 조건식 `"성인" if age >= 19 else "미성년"`을 씁니다.

### 실수 4: void 함수의 결과를 쓴다 (C)

```c
// 파일: void_value.c (컴파일 오류: void value not ignored as it ought to be)
#include <stdio.h>

void greet(void) {
    printf("안녕\n");
}

int main(void) {
    int r = greet();
    printf("%d\n", r);
    return 0;
}
```

C의 `void` 함수는 값이 아예 없어서 변수에 담을 수 없습니다. Python(`None`)이나 Rust(`()`)와 다른 점입니다.

### 실수 5: 대입식의 값을 조건으로 쓴다 (C)

Day 13에서 본 `if (score = 100)`입니다. C에서 대입이 식이라서 생기는 문제입니다. Rust는 대입식의 값이 `()`라서 `if x = 5`는 `expected bool, found ()` 오류가 됩니다.

## 13. Q&A

**Q. Rust에서 return을 쓰면 안 되나요?**

A. 써도 됩니다. 다만 몸통의 **끝**에서 돌려줄 때는 마지막 식을 쓰는 것이 Rust의 관례이고, `return`은 중간에서 일찍 끝낼 때 씁니다. 컴파일러 경고 도구(clippy)는 끝에서 `return x;`를 쓰면 "마지막 식으로 바꾸라"고 제안합니다.

**Q. 식 중심으로 쓰면 무엇이 좋은가요?**

A. 값을 넣지 않은 갈래가 생길 수 없고, 변수를 `mut`로 만들 필요가 줄어듭니다(Day 4). 코드가 "이 값은 이렇게 정해진다"를 한 곳에서 보여 줘서, 값이 어디서 바뀌는지 찾을 일이 줄어듭니다.

**Q. Python의 `lambda`는 언제 쓰나요?**

A. 정렬 기준(`sorted(students, key=lambda s: s[1])`), 짧은 계산을 다른 함수에 넘길 때처럼 **한 번 쓰고 마는 짧은 함수**에 씁니다. 이름을 붙여 여러 번 쓸 함수라면 `def`가 더 읽기 좋습니다. 정렬은 Day 73~77에서 봅니다.

**Q. `:=`를 자주 써도 되나요?**

A. "값을 구해서 검사하고, 그 값을 계속 쓰는" 경우(`while (line := f.readline()):`)에 코드를 줄여 줍니다. 하지만 식 안에서 값이 바뀌면 읽기 어려워지니, 한 줄에 하나 정도만 쓰세요.

## 14. 핵심 요약

- **식**은 값을 만들고, **문장**은 일을 하고 끝납니다.
- Rust에서는 블록, `if`, `match`, `loop`가 모두 값을 가진 식입니다. `let`과 세미콜론으로 끝난 줄이 문장입니다.
- 세미콜론은 식의 값을 버립니다. 마지막이 문장인 블록의 값은 `()`입니다. "expected T, found ()"는 대부분 마지막 줄의 세미콜론 때문입니다.
- Rust 함수는 몸통의 **마지막 식**을 돌려주고, 중간에서 끝낼 때만 `return`을 씁니다.
- C는 대입과 `?:`가 식이고 `if`는 문장입니다. Python은 조건식, `lambda`, `:=`가 식이고 `if`, `for`, 대입은 문장입니다.
- 값이 없는 함수의 결과: C는 없음(`void`), Python은 `None`, Rust는 `()`.

## 15. 도전 문제

1. **(Rust)** 점수 `u32`를 받아 등급과 통과 여부를 `(char, bool)`로 돌려주는 함수를 `match`와 `if` 표현식만으로(`return` 없이) 만드세요.
2. **(C)** `?:`만 써서 세 정수의 가운데 값을 돌려주는 `median3`를 만들어 보세요. 읽기 어렵다면 `if` 문장 버전과 비교해 보세요.
3. **(Python)** `while (line := input()) != "END":`로 입력을 받아 줄 수를 세는 프로그램을 만드세요.
4. **(세 언어)** 9절의 택시 요금에 "심야(0~4시)에는 40% 할증" 규칙을 추가하세요. 22~24시는 20%, 0~4시는 40%입니다. 경계값 21, 22, 23, 0, 3, 4시로 시험하세요.
