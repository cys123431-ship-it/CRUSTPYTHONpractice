---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-15-match
courseId: crp-92
phaseId: phase-02
dayNumber: 15
date: "2026-10-15"
title: 패턴으로 경우 나누기 — Rust match 깊이 보기
summary: Rust match의 여러 패턴을 배웁니다. 값·범위(90..=100)·여러 값(|)·와일드카드(_)·가드(if 조건)·값 붙잡기(n @ 13..=19)·튜플 분해·Option의 Some과 None·enum의 각 경우를 다루고, 모든 경우를 빠짐없이 다뤄야 한다는 검사가 어떤 실수를 막는지 확인합니다. 같은 일을 C에서는 enum과 switch, 몫으로 범위를 바꾸는 요령, if 사다리로, Python에서는 match의 가드·튜플·리스트 패턴으로 해 보고, 가위바위보 판정을 튜플 패턴으로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-14-branch-review]
learningObjectives:
  - Rust match에서 값, 범위, |, _, 가드, @ 패턴을 쓰고 어느 갈래가 실행될지 예측한다.
  - 튜플과 Option을 패턴으로 분해해 안의 값을 꺼낸다.
  - 작은 enum을 정의하고, match가 모든 경우를 다루는지 검사하는 이유를 설명한다.
  - C의 enum·switch와 Python의 match 패턴(가드, 튜플, 리스트)으로 같은 분기를 만든다.
  - 두 값의 조합에 따른 규칙(가위바위보)을 튜플 패턴으로 간결하게 쓴다.
concepts:
  [
    pattern matching,
    range pattern,
    match guard,
    binding,
    destructuring,
    tuple pattern,
    option,
    enum,
    exhaustiveness,
    if let,
  ]
runnerMode: python
playgroundSource: |
  # 파일: patterns.py — 명령을 바꿔 가며 어떤 패턴과 맞는지 보세요.
  for command in ("go north", "take lamp key", "quit", "jump"):
      match command.split():
          case ["go", direction]:
              print(direction, "쪽으로 이동")
          case ["take", *items]:
              print("집은 것:", items)
          case ["quit"]:
              print("종료")
          case _:
              print("알 수 없는 명령:", command)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day15-predict-rs
    title: 범위 패턴 예측하기
    kind: predict
    objective: 범위 패턴과 _ 갈래로 값이 어느 구간에 속하는지 판단한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      fn feel(t: i32) -> &'static str {
          match t {
              i32::MIN..=0 => "영하",
              1..=15 => "쌀쌀",
              16..=25 => "선선",
              _ => "더움",
          }
      }

      fn main() {
          println!("{} {}", feel(28), feel(0));
      }
    answer: "더움 영하"
    hint: "..=는 끝값을 포함합니다. 0은 i32::MIN..=0에 들어갑니다."
    explanation: "28은 앞의 세 범위 어디에도 속하지 않아 _로 갑니다. 0은 첫 범위의 끝값이라 '영하'입니다. 범위 패턴은 이렇게 구간을 직접 적을 수 있어, C의 switch보다 경계를 분명히 보여 줍니다. &'static str은 '프로그램 내내 살아 있는 문자열(리터럴)'이라는 뜻입니다(Day 45)."
    commonMistakes:
      - "0을 쌀쌀로 적음(1..=15는 1부터)"
      - "28이 16..=25에 든다고 착각함"
    language: rust
    verification: run
  - id: ex-day15-predict-py
    title: 튜플 패턴 예측하기
    kind: predict
    objective: 튜플 패턴이 위치별로 값을 비교하고, 이름 자리에는 값을 담는다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      point = (3, 0)
      match point:
          case (0, 0):
              print("원점")
          case (x, 0):
              print(f"x={x}")
          case _:
              print("기타")
    answer: "x=3"
    hint: "(x, 0)은 '두 번째가 0이고, 첫 번째는 무엇이든 x에 담는다'는 패턴입니다."
    explanation: "(0, 0)은 첫 값 3이 0이 아니라 실패하고, (x, 0)은 두 번째 값 0이 맞으며 3이 x에 담깁니다. 패턴의 숫자 자리는 비교, 이름 자리는 값을 붙잡기입니다. Rust의 튜플 패턴도 같습니다."
    commonMistakes:
      - "x라는 변수가 미리 있어야 한다고 생각함"
      - "(x, 0)이 x와 0을 비교한다고 생각함"
    language: python
    verification: run
  - id: ex-day15-fill
    title: Option의 None 갈래 채우기
    kind: fill
    objective: Option을 match할 때 값이 없는 경우를 다룬다.
    prompt: "빈칸을 채워 value가 없을 때 '없음'이 출력되게 하세요."
    starter: |-
      fn main() {
          let value: Option<i32> = None;
          match value {
              Some(v) => println!("값 {v}"),
              _____ => println!("없음"),
          }
      }
    answer: |-
      fn main() {
          let value: Option<i32> = None;
          match value {
              Some(v) => println!("값 {v}"),
              None => println!("없음"),
          }
      }
    output: "없음"
    hint: "Option에는 Some(값)과 값이 없는 경우, 이렇게 두 가지뿐입니다."
    explanation: "Option<i32>는 Some(i32) 또는 None입니다. 두 경우를 모두 적으면 match가 완전해집니다. _를 써도 동작하지만, None이라고 쓰면 무엇을 처리하는지 분명합니다. 값을 꺼내 쓰려면 반드시 Some(v) 패턴을 거쳐야 해서, '값이 없을 때'를 잊을 수 없습니다."
    commonMistakes:
      - "Null이나 nil을 씀"
      - "None 갈래를 빼서 E0004 오류가 남"
    language: rust
    verification: run
  - id: ex-day15-modify
    title: 음수를 구별하는 가드 추가하기
    kind: modify
    objective: 가드로 패턴에 추가 조건을 붙이고, 갈래의 순서를 정한다.
    prompt: "describe가 음수도 짝수·홀수로만 판정합니다. 음수를 먼저 '음수 -3'처럼 구별하도록 갈래를 추가해 '음수 -3 짝수 4'가 출력되게 하세요."
    starter: |-
      def describe(n):
          match n:
              case x if x % 2 == 0:
                  return f"짝수 {x}"
              case x:
                  return f"홀수 {x}"


      print(describe(-3), describe(4))
    answer: |-
      def describe(n):
          match n:
              case x if x < 0:
                  return f"음수 {x}"
              case x if x % 2 == 0:
                  return f"짝수 {x}"
              case x:
                  return f"홀수 {x}"


      print(describe(-3), describe(4))
    output: "음수 -3 짝수 4"
    hint: "match도 위에서부터 검사합니다. 음수 갈래를 짝수·홀수보다 먼저 두세요."
    explanation: "가드(case x if 조건)는 패턴이 맞은 뒤 조건까지 참이어야 그 갈래를 실행합니다. 가드가 거짓이면 다음 갈래로 넘어갑니다. 조건이 겹치므로 Day 13처럼 좁은 조건을 먼저 둡니다."
    commonMistakes:
      - "음수 갈래를 맨 아래에 둬서 도달하지 못함"
      - "case x < 0:처럼 if를 빠뜨려 문법 오류가 남"
    language: python
    verification: run
  - id: ex-day15-debug
    title: enum의 빠진 경우 고치기
    kind: debug
    objective: match가 enum의 모든 경우를 다루지 않으면 컴파일 오류가 나는 것을 확인하고 고친다.
    prompt: "이 코드는 E0004(non-exhaustive patterns: `Light::Yellow` not covered) 오류로 컴파일되지 않습니다. 노란불은 '주의'를 돌려주게 고쳐서 '멈춤 주의 출발'이 출력되게 하세요."
    starter: |-
      enum Light {
          Red,
          Yellow,
          Green,
      }

      fn action(light: Light) -> &'static str {
          match light {
              Light::Red => "멈춤",
              Light::Green => "출발",
          }
      }

      fn main() {
          println!("{} {} {}", action(Light::Red), action(Light::Yellow), action(Light::Green));
      }
    answer: |-
      enum Light {
          Red,
          Yellow,
          Green,
      }

      fn action(light: Light) -> &'static str {
          match light {
              Light::Red => "멈춤",
              Light::Yellow => "주의",
              Light::Green => "출발",
          }
      }

      fn main() {
          println!("{} {} {}", action(Light::Red), action(Light::Yellow), action(Light::Green));
      }
    output: "멈춤 주의 출발"
    hint: "오류 메시지가 어떤 경우가 빠졌는지 정확히 알려 줍니다."
    explanation: 'enum에 새 경우를 추가하면, 그 enum을 match하는 모든 곳에서 컴파일 오류가 나서 고칠 곳을 빠짐없이 찾아 줍니다. 여기서 _ => "주의"로 고쳐도 동작하지만, 나중에 경우가 추가될 때 이 도움을 잃으므로 enum에는 경우를 하나하나 적는 것이 좋습니다.'
    commonMistakes:
      - "_ 갈래로 뭉뚱그려 이후 새 경우를 놓칠 수 있게 만듦"
      - "Yellow 앞의 Light::를 빠뜨림"
    language: rust
    verification: run
  - id: ex-day15-independent
    title: C로 점수 구간을 switch에 넣기
    kind: independent
    objective: 범위 조건을 몫으로 바꿔 switch로 처리하는 요령을 쓴다.
    prompt: "switch(score / 10)을 써서 95, 81, 70, 42를 'A B C F'로 판정해 한 줄에 출력하세요(90~100은 A, 80대 B, 70대 C, 나머지 F)."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("95 81 70 42\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      char grade(int score) {
          switch (score / 10) {
          case 10:
          case 9:
              return 'A';
          case 8:
              return 'B';
          case 7:
              return 'C';
          default:
              return 'F';
          }
      }

      int main(void) {
          printf("%c %c %c %c\n", grade(95), grade(81), grade(70), grade(42));
          return 0;
      }
    output: "A B C F"
    hint: "95 / 10 = 9, 81 / 10 = 8처럼 정수 나눗셈의 몫이 10점 단위 구간 번호가 됩니다. 100점은 몫이 10입니다."
    explanation: "C의 case는 범위를 쓸 수 없지만, 구간이 일정한 간격이면 몫으로 바꿔 정수 상수 몇 개로 만들 수 있습니다. 100점을 위해 case 10을 case 9와 묶었습니다. 0~100 밖의 값은 따로 검사해야 합니다."
    commonMistakes:
      - "case 10을 빠뜨려 100점이 F가 됨"
      - "return 대신 printf를 쓰고 break를 빠뜨림"
    language: c
    verification: run
quiz:
  - id: quiz-day15-01
    question: Rust에서 match n { x if x > 10 => "큼", x if x > 0 => "양수", _ => "기타" }일 때 n = 5의 결과는?
    choices: ['"큼"', '"양수"', '"기타"', "컴파일 오류"]
    answerIndex: 1
    explanation: 첫 갈래의 가드 5 > 10이 거짓이라 넘어가고, 둘째 갈래의 가드 5 > 0이 참이라 "양수"입니다. 가드가 거짓이면 다음 갈래로 이어서 검사합니다.
  - id: quiz-day15-02
    question: Rust 패턴 n @ 13..=19의 뜻은?
    choices:
      - n을 13부터 19까지 반복한다
      - 값이 13 이상 19 이하이면 그 값을 n이라는 이름에 담는다
      - n에 13을 곱한다
      - 13 또는 19와 같으면 참
    answerIndex: 1
    explanation: "@는 패턴과 맞는지 검사하면서 동시에 값을 이름에 붙잡습니다. 범위 패턴만 쓰면 그 값을 갈래 안에서 이름으로 부를 수 없어서 @를 씁니다."
  - id: quiz-day15-03
    question: match가 '모든 경우를 다뤄야 한다(exhaustive)'는 규칙의 장점은?
    choices:
      - 실행 속도가 빨라진다
      - 경우를 빠뜨리는 실수를 컴파일할 때 발견한다
      - 코드가 짧아진다
      - 메모리를 덜 쓴다
    answerIndex: 1
    explanation: 특히 enum에 새 경우를 추가했을 때 처리하지 않은 match를 모두 찾아 줍니다. C의 switch는 enum에 대해 -Wswitch 경고를 주지만, 정수 값에 대해서는 검사하지 않습니다.
  - id: quiz-day15-04
    question: if let Some(v) = found { ... }가 알맞은 경우는?
    choices:
      - Some과 None을 모두 다르게 처리할 때
      - Some일 때만 무언가를 하고, None이면 아무것도 하지 않을 때
      - found가 정수일 때
      - 반복할 때
    answerIndex: 1
    explanation: "if let은 패턴 하나만 관심 있을 때 match를 짧게 쓰는 방법입니다. else를 붙여 나머지 경우를 처리할 수도 있습니다."
  - id: quiz-day15-05
    question: C에서 enum light { RED, YELLOW, GREEN };의 GREEN 값은?
    choices: ["0", "1", "2", "3"]
    answerIndex: 2
    explanation: C의 enum은 이름 붙인 정수 상수이고, 따로 정하지 않으면 0부터 1씩 늘어납니다. 그래서 정수처럼 계산할 수 있고, 엉뚱한 정수 값이 들어가도 막지 못합니다. Rust의 enum은 정수가 아니라 별개의 자료형이라 정해진 경우 외의 값을 가질 수 없습니다.
---

## 1. 오늘 배울 내용

Day 14에서 `match`를 `switch`처럼 값을 비교하는 도구로 썼습니다. Rust의 `match`는 그보다 훨씬 강력합니다. 값의 **모양**을 비교하고, 그 안의 값을 **꺼내** 이름에 담을 수 있습니다. 이것을 **패턴 매칭(pattern matching)** 이라고 합니다.

1. **패턴의 종류**를 하나씩 배웁니다.
   - 값: `0`, `'a'`
   - 여러 값: `1 | 2`
   - 범위: `90..=100`
   - 와일드카드: `_`
   - 이름: `x`
2. **가드**(`x if x < 0`)와 **값 붙잡기**(`n @ 13..=19`)를 씁니다.
3. **튜플**과 **`Option`**(`Some(v)`, `None`)을 패턴으로 분해합니다.
4. 작은 **enum**을 만들어 `match`로 모든 경우를 다룹니다. 빠뜨리면 왜 컴파일 오류가 나는지도 봅니다.
5. `if let`과 `matches!`를 씁니다.
6. 같은 일을 C(enum, switch, 몫 요령)와 Python(match의 가드·튜플·리스트 패턴)으로 해 봅니다.

## 2. 왜 필요한가

프로그램에서 다루는 값은 종종 **여러 모양 중 하나**입니다.

- 점 `(x, y)`: 원점인가, x축 위인가, y축 위인가, 그 밖인가
- 검색 결과: 찾았다면 그 값, 못 찾았다면 "없음"
- 신호등: 빨강, 노랑, 초록 중 하나
- 명령어: `go 방향`, `take 물건들…`, `quit`

`if` 사다리로 이런 분기를 쓰면 "모양 검사"와 "값 꺼내기"가 흩어집니다. 패턴 매칭은 **검사와 꺼내기를 한 줄에** 합니다. 그리고 Rust는 모든 모양을 다뤘는지 컴파일러가 확인해 주기 때문에, "못 찾은 경우를 처리하지 않았다" 같은 버그가 원천적으로 막힙니다.

## 3. 그림으로 이해하기

패턴은 값을 맞춰 보는 **틀**입니다. 틀의 칸마다 "이 값이어야 한다"(비교) 또는 "무엇이든 좋고, 이름을 붙여 둔다"(붙잡기)를 정합니다.

```text
값:   (3, 0)

틀1:  (0, 0)     첫 칸 0 ≠ 3 → 실패
      ┌───┬───┐
      │ 0 │ 0 │
      └───┴───┘

틀2:  (x, 0)     첫 칸: 무엇이든 → x = 3에 붙잡음
      ┌───┬───┐  둘째 칸: 0 = 0 → 성공!
      │ x │ 0 │  → 이 갈래 실행, 안에서 x를 쓸 수 있음
      └───┴───┘
```

`match`는 틀을 위에서부터 차례로 대 보고, **처음 맞는 틀**의 갈래를 실행합니다. `Option`도 같은 방식입니다.

```text
found = Some(42)

틀 Some(v)   "Some이고, 안의 값은 v에 담는다"  → v = 42, 성공
틀 None      "값이 없음"                       (검사하지 않음)
```

## 4. 천천히 풀어보기

### 4.1 패턴의 종류

| 패턴        | 예                              | 뜻                                   |
| ----------- | ------------------------------- | ------------------------------------ |
| 값          | `0`, `'a'`, `"quit"`            | 이 값과 같으면 맞음                  |
| 여러 값     | `6 \| 7`                        | 이 중 하나와 같으면 맞음             |
| 범위        | `90..=100`, `'a'..='z'`         | 범위 안이면 맞음(끝 포함 `..=`)      |
| 와일드카드  | `_`                             | 무엇이든 맞음, 값을 버림             |
| 이름        | `x`                             | 무엇이든 맞음, 값을 `x`에 담음       |
| 가드        | `x if x < 0`                    | 패턴이 맞고 **조건도 참**이어야 맞음 |
| 붙잡기      | `n @ 13..=19`                   | 범위와 맞으면 그 값을 `n`에 담음     |
| 튜플        | `(x, 0)`                        | 칸마다 패턴을 적용                   |
| enum·Option | `Some(v)`, `None`, `Light::Red` | 어느 경우인지 + 안의 값 꺼내기       |

Rust의 범위 패턴은 `..=`(끝 포함)를 씁니다. 가드는 **패턴이 할 수 없는 비교**(짝수인가, 다른 변수보다 큰가)를 붙일 때 씁니다.

### 4.2 모든 경우를 다뤄야 한다

Rust의 `match`는 자료형이 가질 수 있는 **모든 값**에 대해 갈래가 있어야 합니다. `u32`를 `90..=100`, `80..=89`, … 로만 나누면 101 이상의 값이 빠지므로 `_`가 필요합니다. 반면 **enum**은 경우가 정해져 있어서, 모든 경우를 적으면 `_` 없이도 완전합니다.

```rust
enum Light { Red, Yellow, Green }

match light {
    Light::Red => ...,
    Light::Green => ...,
    // Light::Yellow가 빠짐 → 컴파일 오류 E0004
}
```

이 검사는 나중에 `Light::Flashing` 같은 경우를 **추가할 때** 진가를 발휘합니다. 컴파일러가 이 enum을 다루는 모든 `match`를 찾아 "여기서 새 경우를 처리하지 않았다"고 알려 줍니다.

### 4.3 if let과 matches!

- **`if let 패턴 = 값 { ... }`**: 한 가지 패턴에만 관심이 있을 때 쓰는 짧은 `match`입니다. `else`를 붙일 수 있습니다.
- **`matches!(값, 패턴)`**: 패턴과 맞는지를 `bool`로 돌려줍니다. `matches!(c, 'a'..='z')`는 "소문자인가?"입니다.

### 4.4 C와 Python에서는

**C**의 `enum`은 이름을 붙인 **정수 상수**입니다(`RED` = 0, `YELLOW` = 1, `GREEN` = 2). `switch`에서 enum의 `case`를 빠뜨리면 `-Wall`(`-Wswitch`)이 경고해 줍니다. 범위는 쓸 수 없어서, 일정한 간격의 구간은 **몫**으로 바꾸거나(`score / 10`), `if` 사다리로 씁니다. 튜플 패턴이나 값 꺼내기는 없습니다.

**Python**의 `match`(3.10+)는 Rust와 비슷한 **구조 패턴**을 지원합니다. 튜플 `(x, 0)`, 리스트 `["go", direction]`, 나머지 모으기 `["take", *items]`, 가드 `case x if x < 0`을 쓸 수 있습니다. 범위 패턴은 없어서 가드로 대신합니다. 모든 경우를 다뤘는지는 검사하지 않습니다.

## 5. Rust로 구현하기

```rust
// 파일: patterns.rs
#[derive(Debug)]
enum Light {
    Red,
    Yellow,
    Green,
}

fn grade(score: u32) -> char {
    match score {
        90..=100 => 'A',                 // 범위 패턴
        80..=89 => 'B',
        70..=79 => 'C',
        0..=69 => 'F',
        _ => '?',                        // 100 초과
    }
}

fn describe(n: i32) -> String {
    match n {
        0 => String::from("영"),
        x if x < 0 => format!("음수 {x}"),        // 가드: 패턴 + 추가 조건
        x if x % 2 == 0 => format!("짝수 {x}"),
        x => format!("홀수 {x}"),                 // 나머지 모두를 x에 담는다
    }
}

fn next(light: Light) -> Light {
    match light {                        // enum의 모든 경우를 다뤄야 한다
        Light::Red => Light::Green,
        Light::Green => Light::Yellow,
        Light::Yellow => Light::Red,
    }
}

fn main() {
    for s in [100, 90, 89, 70, 12, 150] {
        print!("{} ", grade(s));
    }
    println!();
    for n in [0, -3, 4, 7] {
        println!("{}", describe(n));
    }

    let point = (3, 0);
    match point {                        // 튜플을 나눠 가며 비교
        (0, 0) => println!("원점"),
        (x, 0) => println!("x축 위의 점, x = {x}"),
        (0, y) => println!("y축 위의 점, y = {y}"),
        (x, y) => println!("({x}, {y})"),
    }

    let age = 15;
    match age {
        n @ 13..=19 => println!("{n}세는 청소년"),   // 범위와 맞으면 값을 n에 담는다
        n => println!("{n}세"),
    }

    let found: Option<u32> = Some(42);
    match found {
        Some(v) => println!("찾음: {v}"),
        None => println!("없음"),
    }
    if let Some(v) = found {             // 한 경우만 관심 있을 때
        println!("if let으로 꺼냄: {v}");
    }

    let mut light = Light::Red;
    for _ in 0..4 {
        print!("{light:?} → ");
        light = next(light);
    }
    println!("{light:?}");
    println!("'k'는 소문자? {}", matches!('k', 'a'..='z'));
}
```

실행 결과:

```text
A A B C F ?
영
음수 -3
짝수 4
홀수 7
x축 위의 점, x = 3
15세는 청소년
찾음: 42
if let으로 꺼냄: 42
Red → Green → Yellow → Red → Green
'k'는 소문자? true
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `#[derive(Debug)] enum Light { ... }`        | 세 가지 경우를 가진 새 자료형입니다. `#[derive(Debug)]`는 `{:?}`로 출력할 수 있게 해 달라는 표시입니다(Day 53).                           |
| `90..=100 => 'A',`                           | 범위 패턴입니다. 150은 어느 범위에도 없어 `_`로 가서 `'?'`입니다.                                                                         |
| `x if x < 0 => format!("음수 {x}"),`         | 이름 패턴 `x`는 모든 값과 맞고, 가드 `x < 0`까지 참이어야 이 갈래입니다. `format!`은 `println!`처럼 쓰지만 출력 대신 `String`을 만듭니다. |
| `x => format!("홀수 {x}"),`                  | 앞의 갈래에서 걸러지고 남은 모든 값입니다. 이 줄이 있어서 `match`가 완전합니다.                                                           |
| `match light { Light::Red => ..., }`         | enum의 세 경우를 모두 적었으므로 `_`가 필요 없습니다.                                                                                     |
| `(x, 0) => println!("x축 위의 점, x = {x}")` | 튜플의 둘째 값이 0이면 맞고, 첫째 값을 `x`에 담습니다.                                                                                    |
| `n @ 13..=19 =>`                             | 범위와 맞는지 검사하면서 값을 `n`에 붙잡습니다.                                                                                           |
| `Some(v) => ...`, `None => ...`              | `Option`을 분해해 안의 값을 꺼냅니다.                                                                                                     |
| `if let Some(v) = found { ... }`             | `None`이면 아무것도 하지 않습니다.                                                                                                        |
| `light = next(light);`                       | `next`가 `light`를 받아 가고 새 값을 돌려줍니다. 받아 간 값은 더 쓸 수 없다는 규칙은 Day 32(소유권 이동)에서 배웁니다.                    |
| `matches!('k', 'a'..='z')`                   | 글자 범위 패턴으로 소문자인지 검사합니다.                                                                                                 |

## 6. C로 구현하기

C에는 패턴 매칭이 없습니다. `enum`과 `switch`, 그리고 몫을 이용한 요령과 `if` 사다리로 같은 일을 합니다.

```c
// 파일: patterns.c
#include <stdio.h>

enum light { RED, YELLOW, GREEN };      // 이름 붙인 정수 상수 0, 1, 2

const char *light_name(enum light l) {
    switch (l) {                        // enum의 case를 빠뜨리면 -Wswitch 경고
    case RED:
        return "Red";
    case YELLOW:
        return "Yellow";
    case GREEN:
        return "Green";
    }
    return "?";
}

enum light next(enum light l) {
    switch (l) {
    case RED:
        return GREEN;
    case GREEN:
        return YELLOW;
    case YELLOW:
        return RED;
    }
    return RED;
}

char grade(int score) {
    if (score < 0 || score > 100) {
        return '?';
    }
    switch (score / 10) {               // 범위를 '10점 단위 몫'으로 바꿔서 switch에
    case 10:
    case 9:
        return 'A';
    case 8:
        return 'B';
    case 7:
        return 'C';
    default:
        return 'F';
    }
}

int main(void) {
    int scores[] = {100, 90, 89, 70, 12, 150};
    for (int i = 0; i < 6; i++) {
        printf("%c ", grade(scores[i]));
    }
    printf("\n");

    int x = 3, y = 0;                   // 튜플 패턴 대신 조건 사다리
    if (x == 0 && y == 0) {
        printf("원점\n");
    } else if (y == 0) {
        printf("x축 위의 점, x = %d\n", x);
    } else if (x == 0) {
        printf("y축 위의 점, y = %d\n", y);
    } else {
        printf("(%d, %d)\n", x, y);
    }

    enum light l = RED;
    for (int i = 0; i < 4; i++) {
        printf("%s → ", light_name(l));
        l = next(l);
    }
    printf("%s\n", light_name(l));
    printf("RED = %d, YELLOW = %d, GREEN = %d\n", RED, YELLOW, GREEN);
    return 0;
}
```

실행 결과:

```text
A A B C F ?
x축 위의 점, x = 3
Red → Green → Yellow → Red → Green
RED = 0, YELLOW = 1, GREEN = 2
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum light { RED, YELLOW, GREEN };`         | 0, 1, 2에 이름을 붙입니다. `enum light` 자료형의 변수에 정수 5를 넣어도 컴파일러가 막지 않습니다.                                                                      |
| `switch (l) { case RED: ... }`               | enum의 모든 이름을 `case`로 적었습니다. 하나를 빠뜨리면 `-Wswitch` 경고(이 과정에서는 오류)가 납니다.                                                                  |
| `return "?";` (switch 뒤)                    | 모든 `case`에서 `return`하지만, C 컴파일러는 enum 변수에 다른 정수가 들어올 수 있다고 보고 함수 끝에 도달할 수 있다고 판단합니다. 그래서 끝에도 `return`이 필요합니다. |
| `switch (score / 10)`                        | 범위 패턴이 없으니 10점 단위 구간을 몫으로 바꿨습니다. 95 / 10 = 9, 100 / 10 = 10입니다.                                                                               |
| `case 10: case 9: return 'A';`               | 100점과 90점대를 묶었습니다.                                                                                                                                           |
| `if (x == 0 && y == 0) ... else if (y == 0)` | 튜플 패턴 대신 조건 사다리입니다. 값을 꺼내는 부분이 없으니 `x`, `y`를 그대로 씁니다.                                                                                  |

## 7. Python으로 구현하기

Python의 `match`는 범위 패턴이 없어 가드로 대신하지만, **리스트 패턴**과 **나머지 모으기**(`*items`)처럼 Rust에 없는 편리한 모양도 있습니다.

```python
# 파일: patterns.py
def grade(score):
    match score:
        case s if 90 <= s <= 100:          # Python에는 범위 패턴이 없어 가드로
            return "A"
        case s if 80 <= s < 90:
            return "B"
        case s if 70 <= s < 80:
            return "C"
        case s if 0 <= s < 70:
            return "F"
        case _:
            return "?"


def describe(n):
    match n:
        case 0:
            return "영"
        case x if x < 0:
            return f"음수 {x}"
        case x if x % 2 == 0:
            return f"짝수 {x}"
        case x:
            return f"홀수 {x}"


print(*(grade(s) for s in (100, 90, 89, 70, 12, 150)))
for n in (0, -3, 4, 7):
    print(describe(n))

point = (3, 0)
match point:
    case (0, 0):
        print("원점")
    case (x, 0):
        print(f"x축 위의 점, x = {x}")
    case (0, y):
        print(f"y축 위의 점, y = {y}")
    case (x, y):
        print(f"({x}, {y})")

for command in ("go north", "take lamp key", "quit", "dance"):
    match command.split():                 # 단어 목록의 모양으로 나눈다
        case ["go", direction]:
            print(f"{direction} 쪽으로 이동")
        case ["take", *items]:             # 나머지 단어를 모두 items에
            print("집은 것:", items)
        case ["quit"]:
            print("종료")
        case _:
            print("알 수 없는 명령:", command)

found = None
match found:
    case None:
        print("없음")
    case value:
        print("찾음:", value)
```

실행 결과:

```text
A A B C F ?
영
음수 -3
짝수 4
홀수 7
x축 위의 점, x = 3
north 쪽으로 이동
집은 것: ['lamp', 'key']
종료
알 수 없는 명령: dance
없음
```

### 코드 한 부분씩 읽기

| 코드                                | 설명                                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `case s if 90 <= s <= 100:`         | 이름 패턴 `s` + 가드로 범위를 검사합니다.                                                                                                                       |
| `print(*(grade(s) for s in (...)))` | 여섯 점수의 등급을 차례로 만들어 `print`에 **펼쳐서** 넘깁니다(`*`). 결과는 공백으로 구분되어 한 줄에 출력됩니다. 괄호 안의 모양은 Day 16 이후에 자세히 봅니다. |
| `case (x, 0):`                      | Rust와 같은 튜플 패턴입니다.                                                                                                                                    |
| `match command.split():`            | 명령을 단어 리스트로 나눈 뒤 그 **모양**으로 분기합니다.                                                                                                        |
| `case ["go", direction]:`           | 단어가 정확히 두 개이고, 첫 단어가 `"go"`이면 맞습니다. 둘째 단어는 `direction`에 담깁니다.                                                                     |
| `case ["take", *items]:`            | 첫 단어가 `"take"`이면, 나머지 단어 **전부**를 리스트 `items`에 모읍니다.                                                                                       |
| `case ["quit"]:`                    | 단어가 정확히 하나이고 `"quit"`일 때입니다. `"quit now"`는 맞지 않습니다.                                                                                       |
| `case None:` / `case value:`        | `None`은 특별한 값이라 비교 패턴입니다. `value`처럼 이름만 쓴 패턴은 **모든 값**을 받습니다.                                                                    |

## 8. 실행 추적

Rust의 `describe`에 -3, 4, 7을 넣었을 때 각 갈래를 어떻게 지나가는지 따라갑니다.

|   n | `0`  | `x if x < 0`           | `x if x % 2 == 0`      | `x`      | 결과      |
| --: | ---- | ---------------------- | ---------------------- | -------- | --------- |
|  -3 | 실패 | 패턴 맞음, 가드 **참** | (검사 안 함)           |          | `음수 -3` |
|   4 | 실패 | 패턴 맞음, 가드 거짓   | 패턴 맞음, 가드 **참** |          | `짝수 4`  |
|   7 | 실패 | 패턴 맞음, 가드 거짓   | 패턴 맞음, 가드 거짓   | **맞음** | `홀수 7`  |

가드가 거짓이면 그 갈래는 "맞지 않은 것"으로 치고 다음 갈래로 넘어갑니다. 마지막 `x`는 가드가 없어서 항상 맞습니다.

## 9. 다른 예제로 다시 이해하기

**가위바위보 판정.** 두 사람의 손 조합은 3 × 3 = 9가지입니다. `if` 사다리로 쓰면 조건이 길어지지만, **튜플 패턴**으로 "이기는 조합 세 개"를 한 갈래에 묶으면 규칙이 그대로 보입니다.

```rust
// 파일: rps.rs
#[derive(Clone, Copy, PartialEq, Debug)]
enum Hand {
    Rock,
    Paper,
    Scissors,
}

fn judge(me: Hand, you: Hand) -> &'static str {
    use Hand::*;
    match (me, you) {
        (Rock, Scissors) | (Paper, Rock) | (Scissors, Paper) => "승",
        (a, b) if a == b => "무",
        _ => "패",
    }
}

fn main() {
    use Hand::*;
    for me in [Rock, Paper, Scissors] {
        for you in [Rock, Paper, Scissors] {
            print!("{:?} vs {:?}: {}   ", me, you, judge(me, you));
        }
        println!();
    }
}
```

실행 결과:

```text
Rock vs Rock: 무   Rock vs Paper: 패   Rock vs Scissors: 승
Paper vs Rock: 승   Paper vs Paper: 무   Paper vs Scissors: 패
Scissors vs Rock: 패   Scissors vs Paper: 승   Scissors vs Scissors: 무
```

| 코드                                       | 설명                                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `#[derive(Clone, Copy, PartialEq, Debug)]` | `Copy`는 값을 복사해서 넘길 수 있게, `PartialEq`는 `==`로 비교할 수 있게 해 줍니다. |
| `use Hand::*;`                             | `Hand::Rock` 대신 `Rock`이라고 짧게 쓰게 해 줍니다.                                 |
| `match (me, you)`                          | 두 값을 튜플로 묶어 **조합**을 한 번에 비교합니다.                                  |
| `(Rock, Scissors) \| ...`                  | 이기는 세 조합을 `\|`로 묶었습니다.                                                 |
| `(a, b) if a == b`                         | 두 손이 같으면 무승부입니다. 가드로 "두 값이 같다"를 표현했습니다.                  |
| `_ => "패"`                                | 나머지(지는 세 조합)입니다.                                                         |

같은 판정을 Python으로 쓰면 문자열 튜플 패턴을 씁니다.

```python
# 파일: rps.py
def judge(me, you):
    match (me, you):
        case ("바위", "가위") | ("보", "바위") | ("가위", "보"):
            return "승"
        case (a, b) if a == b:
            return "무"
        case _:
            return "패"


hands = ("가위", "바위", "보")
for me in hands:
    print(me, [judge(me, you) for you in hands])
```

실행 결과:

```text
가위 ['무', '패', '승']
바위 ['승', '무', '패']
보 ['패', '승', '무']
```

`[judge(me, you) for you in hands]`는 세 상대에 대한 결과를 리스트로 만듭니다(리스트 만들기는 Day 27). 각 줄에 승·무·패가 하나씩 있어 규칙이 맞는지 한눈에 확인할 수 있습니다. 이렇게 **모든 조합을 표로 출력해** 보는 것도 좋은 시험 방법입니다.

## 10. 패턴 한눈에 보기

| 패턴        | Rust                    | Python                            | C                    |
| ----------- | ----------------------- | --------------------------------- | -------------------- |
| 값          | `0 =>`                  | `case 0:`                         | `case 0:`            |
| 여러 값     | `1 \| 2 =>`             | `case 1 \| 2:`                    | `case 1: case 2:`    |
| 범위        | `1..=9 =>`              | (가드로) `case x if 1 <= x <= 9:` | (몫 요령, if 사다리) |
| 기본        | `_ =>`                  | `case _:`                         | `default:`           |
| 가드        | `x if 조건 =>`          | `case x if 조건:`                 | (없음)               |
| 값 붙잡기   | `n @ 1..=9 =>`          | `case (1 \| 2) as n:`             | (없음)               |
| 튜플        | `(x, 0) =>`             | `case (x, 0):`                    | (없음)               |
| 리스트·배열 | `[first, rest @ ..] =>` | `case [first, *rest]:`            | (없음)               |
| "값 없음"   | `None =>`               | `case None:`                      | (약속된 특별한 값)   |

## 11. 세 언어 비교

| 관점                    | Rust                                          | Python              | C                                |
| ----------------------- | --------------------------------------------- | ------------------- | -------------------------------- |
| 분기 도구               | `match`, `if let`, `matches!`                 | `match` (3.10+)     | `switch`, `if` 사다리            |
| 값 꺼내기               | 패턴의 이름 자리                              | 패턴의 이름 자리    | 직접 변수 사용                   |
| 범위 패턴               | 있음                                          | 없음(가드)          | 없음(몫 요령)                    |
| 모든 경우 검사          | 필수(컴파일 오류)                             | 없음                | enum에 대해서만 경고(`-Wswitch`) |
| enum                    | 별개의 자료형, 안에 값도 담을 수 있음(Day 53) | `enum` 모듈(Day 53) | 이름 붙인 정수                   |
| `match`가 값을 돌려주나 | 예                                            | 아니요              | 아니요                           |

## 12. 자주 하는 실수

### 실수 1: 범위의 끝을 포함하지 않는 패턴을 쓴다 (Rust)

Rust 2024에서는 패턴에 `..`(끝 제외)도 쓸 수 있지만, `90..100 => 'A'`로 쓰면 100점이 빠집니다. 등급처럼 끝값이 중요한 곳은 `..=`로 쓰고, 경계값으로 시험하세요.

### 실수 2: 이름 패턴을 비교로 착각한다

```rust
// 파일: shadow_pattern.rs (컴파일 오류: unreachable pattern)
fn main() {
    let target = 5;
    let n = 3;
    match n {
        target => println!("5와 같다?"),
        _ => println!("다르다"),
    }
    println!("{target}");
}
```

패턴의 `target`은 바깥 변수와 비교하는 것이 **아니라**, 어떤 값이든 받아 새 이름 `target`에 담는 패턴입니다. 그래서 첫 갈래가 모든 값과 맞고 `_`는 도달할 수 없습니다. 변수와 비교하려면 가드를 씁니다: `x if x == target =>`.

### 실수 3: enum의 경우를 빠뜨린다 (Rust)

실습의 디버그 문제입니다. `_`로 덮기보다 경우를 하나하나 적어 두면 나중에 경우가 추가될 때 컴파일러가 알려 줍니다.

### 실수 4: C switch에서 enum case를 빠뜨린다

```c
// 파일: missing_enum_case.c (컴파일 오류: enumeration value 'YELLOW' not handled in switch)
#include <stdio.h>

enum light { RED, YELLOW, GREEN };

int main(void) {
    enum light l = YELLOW;
    switch (l) {
    case RED:
        printf("멈춤\n");
        break;
    case GREEN:
        printf("출발\n");
        break;
    }
    return 0;
}
```

C 컴파일러도 enum에 대해서는 빠진 `case`를 알려 줍니다. 단, `default:`를 넣으면 이 경고가 사라지니 enum을 다룰 때는 `default`보다 모든 `case`를 적는 편이 안전합니다.

### 실수 5: 갈래의 순서를 잘못 둔다

`x =>`처럼 모든 값과 맞는 패턴이나 넓은 가드를 위에 두면 아래 갈래에 도달하지 못합니다. Rust는 도달할 수 없는 패턴을 경고해 줍니다. 좁은 패턴을 먼저, 넓은 패턴을 나중에 두세요.

## 13. Q&A

**Q. `match`와 `if` 사다리 중 무엇을 써야 하나요?**

A. 한 값(또는 튜플)의 **모양이나 경우**에 따라 나눈다면 `match`, 서로 다른 변수들의 복잡한 조건이라면 `if`가 자연스럽습니다. `Option`이나 enum처럼 안의 값을 꺼내야 하면 `match`나 `if let`을 씁니다.

**Q. Rust의 enum은 C의 enum과 무엇이 다른가요?**

A. C의 enum은 이름 붙인 정수라 `RED + 1` 같은 계산도 되고 아무 정수나 넣을 수 있습니다. Rust의 enum은 정해진 경우 외의 값을 가질 수 없는 **별개의 자료형**이고, 경우마다 **값을 담을 수도** 있습니다(`Some(42)`가 그 예입니다). 이 기능은 Day 53에서 자세히 배웁니다.

**Q. Python의 match는 왜 모든 경우를 검사하지 않나요?**

A. Python은 실행하기 전에 자료형을 확인하지 않는 언어라, "이 값이 가질 수 있는 모든 경우"를 미리 알 수 없습니다. 그래서 `case _:`로 나머지를 처리하는 습관이 중요합니다. 맞는 갈래가 없으면 `match` 문은 아무 일도 하지 않고 지나갑니다.

**Q. `&'static str`은 무엇인가요?**

A. 프로그램이 실행되는 동안 계속 살아 있는 문자열(코드에 직접 쓴 문자열 리터럴)을 빌려 쓴다는 뜻입니다. 함수가 `"승"` 같은 리터럴을 돌려줄 때 이 자료형을 씁니다. 참조와 수명은 Day 33과 Day 45에서 배웁니다.

## 14. 핵심 요약

- Rust `match`는 값의 **모양**을 패턴으로 비교하고, 이름 자리에 값을 **꺼내** 담습니다. 위에서부터 처음 맞는 갈래 하나를 실행하고, 값을 돌려주는 표현식입니다.
- 패턴: 값, `|`, 범위 `a..=b`, `_`, 이름, 가드 `x if 조건`, 붙잡기 `n @ 패턴`, 튜플 `(x, 0)`, `Some(v)`/`None`, enum 경우.
- `match`는 모든 경우를 다뤄야 합니다. enum은 경우를 모두 적으면 `_` 없이 완전하고, 경우가 추가되면 컴파일러가 고칠 곳을 알려 줍니다.
- 한 패턴만 관심 있으면 `if let`, 패턴과 맞는지만 알고 싶으면 `matches!`.
- C는 enum(이름 붙인 정수)과 `switch`, 몫 요령, `if` 사다리로 대신합니다. Python `match`는 튜플·리스트·가드 패턴을 쓰지만 범위 패턴과 완전성 검사가 없습니다.

## 15. 도전 문제

1. **(Rust)** 글자 하나를 받아 `'a'..='z'`면 "소문자", `'A'..='Z'`면 "대문자", `'0'..='9'`면 "숫자", 나머지는 "기호"를 돌려주는 함수를 `match`로 만드세요.
2. **(Python)** 계산기 명령 `"add 3 5"`, `"neg 7"`, `"quit"`을 리스트 패턴으로 처리하세요. 숫자 부분은 `int()`로 바꿉니다.
3. **(C)** 요일 enum(`MON` … `SUN`)을 만들고 `switch`로 평일·주말을 판정하세요. `case` 하나를 지우고 어떤 경고가 나는지 확인하세요.
4. **(세 언어)** 좌표 `(x, y)`가 어느 사분면에 있는지(축 위의 점 포함) 판정하세요. Rust는 튜플 패턴과 가드, Python은 `match`, C는 `if` 사다리로 쓰고, `(0, 0)`, `(3, 0)`, `(0, -2)`, `(1, 1)`, `(-1, 1)`, `(-1, -1)`, `(1, -1)`로 시험하세요.
