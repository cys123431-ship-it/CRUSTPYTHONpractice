---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-04-rust-variables
courseId: crp-92
phaseId: phase-01
dayNumber: 4
date: "2026-10-04"
title: 바꿀 수 있는 값과 없는 값 — Rust의 let, mut, 섀도잉, 상수
summary: "Rust가 변수를 기본적으로 바꿀 수 없게 만든 이유와, 바꾸려면 mut를 붙이는 규칙, 같은 이름으로 새 바인딩을 만드는 섀도잉, const 상수, 블록과 범위, 나중에 초기화하기를 배웁니다. 같은 개념을 C의 const와 #define, 블록 범위, Python의 대문자 상수 관례와 여러 값 대입(a, b = b, a)과 비교하고, 값 교환과 걸음 수 기록 예제로 연습합니다."
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-03-c-program]
learningObjectives:
  - Rust의 불변 바인딩과 mut 바인딩의 차이를 설명하고, 알맞게 선언한다.
  - 섀도잉과 mut의 차이(새 바인딩인가, 같은 바인딩의 값 변경인가)를 예로 설명한다.
  - const 상수와 블록 범위를 쓰고, 블록 밖에서 안쪽 바인딩이 사라지는 것을 확인한다.
  - C의 const·#define·블록 범위, Python의 대문자 상수 관례와 del을 Rust와 비교한다.
  - 세 언어에서 두 변수의 값을 교환하는 방법을 쓴다.
concepts:
  [
    let,
    mut,
    immutability,
    shadowing,
    const,
    scope,
    block,
    compound assignment,
    swap,
    tuple destructuring,
  ]
runnerMode: python
playgroundSource: |
  # 파일: swap.py — Python의 여러 값 대입을 실험해 보세요.
  a, b = 1, 2
  a, b = b, a
  print("교환:", a, b)

  x, y, z = "가", "나", "다"
  x, y, z = y, z, x
  print("회전:", x, y, z)

  MAX = 10          # 대문자는 '바꾸지 말자'는 약속일 뿐입니다
  MAX += 1
  print(MAX)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day04-predict-rs
    title: 섀도잉과 블록 예측하기
    kind: predict
    objective: 섀도잉으로 만든 새 바인딩이 블록이 끝나면 사라진다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let x = 5;
          let x = x * 2;
          {
              let x = x + 1;
              print!("{x} ");
          }
          println!("{x}");
      }
    answer: "11 10"
    hint: "두 번째 let에서 x는 10이 됩니다. 블록 안의 x = 11은 블록이 끝나면 사라지고, 바깥의 x = 10이 다시 보입니다."
    explanation: "섀도잉은 값을 바꾸는 것이 아니라 같은 이름의 새 바인딩을 만들어 앞의 것을 가리는 것입니다. 블록 안에서 가린 바인딩은 블록이 끝나면 없어지고, 가려졌던 바깥 바인딩이 그대로 남아 있습니다."
    commonMistakes:
      - "블록 안의 x = 11이 바깥에도 남아 11 11로 적음"
      - "첫 x = 5가 다시 보인다고 생각해 11 5로 적음"
    language: rust
    verification: run
  - id: ex-day04-predict-c
    title: 복합 대입 연산 예측하기
    kind: predict
    objective: +=, *=가 변수 자신의 값을 읽어 계산한 뒤 다시 넣는다는 것을 추적한다.
    prompt: 출력되는 두 숫자를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a = 3;
          int b = a;
          a += 4;
          b *= 2;
          printf("%d %d\n", a, b);
          return 0;
      }
    answer: "7 6"
    hint: "b = a는 그 순간의 값 3을 복사합니다. 이후 a += 4는 a만 7로, b *= 2는 b만 6으로 바꿉니다."
    explanation: "a += 4는 a = a + 4, b *= 2는 b = b * 2의 줄임입니다. 세 언어 모두 +=, -=, *=, /=를 같은 뜻으로 씁니다. 단, Python과 Rust에는 C의 ++, --가 없습니다."
    commonMistakes:
      - "b가 a를 따라 바뀐다고 생각해 7 14로 적음"
      - "b *= 2를 b = 2로 읽음"
    language: c
    verification: run
  - id: ex-day04-fill
    title: 누적 합계에 mut 채우기
    kind: fill
    objective: 값을 여러 번 바꿀 바인딩에 mut를 붙인다.
    prompt: "빈칸을 채워 '합계 45분'이 출력되게 하세요."
    starter: |-
      fn main() {
          let _____ total = 0;
          total += 30;
          total += 15;
          println!("합계 {total}분");
      }
    answer: |-
      fn main() {
          let mut total = 0;
          total += 30;
          total += 15;
          println!("합계 {total}분");
      }
    output: "합계 45분"
    hint: "값을 바꿀 바인딩은 let 뒤에 키워드 하나를 붙여 선언합니다."
    explanation: "mut 없이 += 를 쓰면 E0384 오류(cannot assign twice to immutable variable)가 납니다. mut는 '이 값은 앞으로 바뀐다'는 것을 읽는 사람과 컴파일러 모두에게 알려 줍니다."
    commonMistakes:
      - "total += 30 앞에 let을 붙여 섀도잉으로 해결하려 함(가능하지만 누적에는 mut가 자연스러움)"
      - "mut를 total 뒤에 씀"
    language: rust
    verification: run
  - id: ex-day04-modify
    title: 세 값 한 번에 돌리기
    kind: modify
    objective: Python의 여러 값 대입으로 임시 변수 없이 값을 옮긴다.
    prompt: "a, b, c가 1, 2, 3일 때, 한 줄의 대입으로 a는 b의 값, b는 c의 값, c는 a의 값을 갖게 해서 '2 3 1'이 출력되게 하세요."
    starter: |-
      a, b, c = 1, 2, 3
      a = b
      b = c
      c = a
      print(a, b, c)
    answer: |-
      a, b, c = 1, 2, 3
      a, b, c = b, c, a
      print(a, b, c)
    output: "2 3 1"
    hint: "오른쪽의 b, c, a가 먼저 (2, 3, 1)이라는 묶음으로 만들어진 뒤 왼쪽에 차례로 들어갑니다."
    explanation: "처음 코드는 a = b에서 이미 a의 원래 값 1을 잃어버려 c = a가 2가 되고, '2 3 2'가 출력됩니다. 한 줄 대입은 오른쪽을 모두 계산한 뒤에 넣기 때문에 원래 값이 보존됩니다."
    commonMistakes:
      - "a, b, c = c, a, b로 써서 방향이 반대인 3 1 2가 됨"
      - "세 줄 대입의 순서만 바꿔서 해결하려 함"
    language: python
    verification: run
  - id: ex-day04-debug
    title: C 값 교환 버그 고치기
    kind: debug
    objective: 교환할 때 한쪽 값을 먼저 덮어쓰면 원래 값을 잃는다는 것을 확인한다.
    prompt: "이 코드는 a와 b를 바꾸려 했지만 '2 2'를 출력합니다. 고쳐서 '2 1'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a = 1;
          int b = 2;
          a = b;
          b = a;
          printf("%d %d\n", a, b);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int a = 1;
          int b = 2;
          int tmp = a;
          a = b;
          b = tmp;
          printf("%d %d\n", a, b);
          return 0;
      }
    output: "2 1"
    starterOutput: "2 2"
    hint: "a = b를 실행하는 순간 a의 원래 값 1이 사라집니다. 사라지기 전에 다른 변수에 옮겨 두세요."
    explanation: "컵 두 개의 물을 바꾸려면 빈 컵이 하나 더 필요한 것과 같습니다. C에는 Python의 a, b = b, a나 Rust의 (a, b) = (b, a) 같은 여러 값 대입이 없어서 임시 변수를 씁니다."
    commonMistakes:
      - "b = a; a = b;로 순서만 바꿔 1 1을 만듦"
      - "tmp에 b를 담고 나서 b = a, a = tmp 순서를 헷갈림"
    language: c
    verification: run
  - id: ex-day04-independent
    title: Rust 자판기 잔액 계산하기
    kind: independent
    objective: const 상수와 mut 바인딩을 함께 써서 상태가 바뀌는 계산을 한다.
    prompt: "음료 가격은 상수 PRICE = 1500입니다. 잔액 5000원에서 음료를 두 번 사고 '남은 돈: 2000원, 산 개수: 2'를 출력하세요."
    starter: |-
      fn main() {
          // PRICE 상수와 balance, count 바인딩을 만드세요.
          println!("남은 돈: ?원, 산 개수: ?");
      }
    answer: |-
      const PRICE: u32 = 1500;

      fn main() {
          let mut balance: u32 = 5000;
          let mut count = 0;
          balance -= PRICE;
          count += 1;
          balance -= PRICE;
          count += 1;
          println!("남은 돈: {balance}원, 산 개수: {count}");
      }
    output: "남은 돈: 2000원, 산 개수: 2"
    hint: "const는 main 밖에 쓰고 자료형(u32)을 꼭 적습니다. 바뀌는 값인 balance와 count는 let mut로 만듭니다."
    explanation: "가격처럼 프로그램 내내 변하지 않는 값은 const로, 잔액과 개수처럼 변하는 값은 mut로 선언하면 코드만 보고도 무엇이 바뀌는지 알 수 있습니다. 세 번째로 사려 하면 500 - 1500이 u32 범위를 벗어나 실행 중 오류가 납니다(12절)."
    commonMistakes:
      - "const PRICE = 1500;처럼 자료형을 빠뜨려 컴파일 오류가 남"
      - "count를 mut 없이 선언함"
    language: rust
    verification: run
quiz:
  - id: quiz-day04-01
    question: Rust에서 let x = 5; 다음 줄에 x = 6;을 쓰면?
    choices:
      - x가 6이 된다
      - 컴파일 오류 E0384가 난다(불변 바인딩에 두 번 대입)
      - 실행 중에 오류가 난다
      - 경고만 나고 x는 5로 남는다
    answerIndex: 1
    explanation: Rust의 let 바인딩은 기본적으로 바꿀 수 없습니다. 실행하기 전에 컴파일러가 막아 줍니다. 바꾸려면 let mut x = 5;로 선언합니다.
  - id: quiz-day04-02
    question: 섀도잉(let x = ...; let x = ...;)과 mut의 차이로 옳은 것은?
    choices:
      - 둘은 완전히 같다
      - 섀도잉은 새 바인딩을 만들어서 자료형도 바꿀 수 있고, mut는 같은 바인딩의 값만 바꾼다
      - mut는 자료형을 바꿀 수 있고, 섀도잉은 값만 바꾼다
      - 섀도잉은 블록 안에서만 쓸 수 있다
    answerIndex: 1
    explanation: 'let input = "45"; let input: u32 = input.parse().unwrap();처럼 문자열을 정수로 바꿀 때 섀도잉이 편리합니다. mut 바인딩에 다른 자료형의 값을 넣으면 E0308 오류가 납니다.'
  - id: quiz-day04-03
    question: Rust의 const로 옳은 것은?
    choices:
      - 자료형을 생략할 수 있다
      - 자료형을 반드시 적어야 하고, 이름은 관례상 대문자로 쓴다
      - mut를 붙이면 바꿀 수 있다
      - 함수 안에서만 만들 수 있다
    answerIndex: 1
    explanation: "const MAX_MINUTES: u32 = 120;처럼 씁니다. const는 컴파일할 때 값이 정해져야 하며, mut를 붙일 수 없고, 함수 밖(전역)에도 만들 수 있습니다."
  - id: quiz-day04-04
    question: Python에서 MAX = 10 다음에 MAX = 20을 쓰면?
    choices:
      - SyntaxError가 난다
      - 문제없이 MAX가 20이 된다(대문자는 약속일 뿐 막지 않는다)
      - 경고와 함께 10으로 남는다
      - MAX가 두 개 생긴다
    answerIndex: 1
    explanation: Python에는 바꿀 수 없는 변수를 만드는 문법이 없습니다. 대문자 이름은 '상수로 쓰자'는 관례이고, 이를 지키는 것은 프로그래머의 몫입니다.
  - id: quiz-day04-05
    question: C에서 두 변수 a, b의 값을 바꾸는 올바른 방법은?
    choices:
      - a = b; b = a;
      - tmp = a; a = b; b = tmp;
      - a, b = b, a;
      - swap a b;
    answerIndex: 1
    explanation: "a = b를 먼저 하면 a의 원래 값이 사라집니다. C에는 Python식 여러 값 대입이 없어서 임시 변수에 먼저 옮겨 둡니다. a, b = b, a;는 C에서 쉼표 연산자로 해석되어 전혀 다른 일을 합니다."
---

## 1. 오늘 배울 내용

Day 1에서 Rust는 값을 바꾸려면 `mut`가 필요하다는 것을 잠깐 봤습니다. 오늘은 이 규칙을 제대로 익히고, "바뀌는 값"과 "바뀌지 않는 값"을 C와 Python에서는 어떻게 표현하는지 비교합니다.

1. Rust의 **불변 바인딩**(`let`)과 **가변 바인딩**(`let mut`).
2. **섀도잉**: 같은 이름으로 새 바인딩을 만들기. `mut`와 무엇이 다른지.
3. **상수**를 만드는 방법을 비교합니다.
   - Rust: `const`
   - C: `const`와 `#define`
   - Python: 대문자 이름 관례
4. **블록**과 **범위(scope)**: 중괄호 안에서 만든 이름은 어디까지 보이는가.
5. **복합 대입**(`+=`, `-=`)과 두 값의 **교환**을 세 언어로 해 봅니다.

## 2. 왜 필요한가

프로그램이 길어지면 "이 값이 어디서 바뀌었지?"를 찾는 일이 가장 힘듭니다. 100줄짜리 함수에서 `total`이 이상한 값이 되었다면, `total`에 대입하는 모든 줄을 찾아봐야 합니다. 만약 대부분의 변수가 **처음 정한 값에서 바뀌지 않는다**는 것이 보장된다면, 신경 쓸 곳이 크게 줄어듭니다.

Rust는 이 생각을 규칙으로 만들었습니다. 기본은 **바꿀 수 없음**이고, 바꿀 변수에만 `mut`를 붙입니다. 그래서 코드를 읽을 때 `mut`가 붙은 이름만 주의해서 보면 됩니다. C와 Python은 기본이 **바꿀 수 있음**이고, 바꾸지 않을 값에 `const`를 붙이거나(C) 대문자 이름으로 약속합니다(Python).

## 3. 그림으로 이해하기

```text
let goal = 60;              let mut done = 0;           let x = 5;  let x = x * 2;
                                                         (섀도잉)
goal ──▶ [ 60 ] 🔒           done ──▶ [ 0 ]              x(옛) ──▶ [ 5 ]   ← 가려짐
                             done += 25                  x(새) ──▶ [ 10 ]
                             done ──▶ [ 25 ]
대입하려 하면 컴파일 오류      같은 상자의 값이 바뀜        이름만 같은 새 상자
```

- **불변 바인딩**: 이름과 값이 한 번 연결되면 끝입니다.
- **가변 바인딩**: 같은 상자 안의 값을 바꿀 수 있습니다. 자료형은 그대로입니다.
- **섀도잉**: 같은 이름의 **새 상자**를 만들고, 이후로는 새 상자가 보입니다. 옛 상자는 가려질 뿐입니다. 자료형이 달라도 됩니다.

블록 `{ }` 안에서 섀도잉하면, 블록이 끝날 때 새 상자가 사라지고 옛 상자가 다시 보입니다.

```text
let level = 1;          바깥 level ──▶ [ 1 ]
{
    let level = 11;     안쪽 level ──▶ [ 11 ]   (바깥 것을 가림)
}                       안쪽 level 사라짐
println!(level)         바깥 level ──▶ [ 1 ]    다시 보임
```

## 4. 천천히 풀어보기

### 4.1 let과 let mut

```rust
let goal = 60;          // 불변
let mut done = 0;       // 가변
done += 25;             // OK
// goal = 70;           // 오류 E0384
```

`done += 25`는 `done = done + 25`의 줄임입니다. 세 언어 모두 `+=`, `-=`, `*=`, `/=`, `%=`를 같은 뜻으로 씁니다. C에는 1을 더하고 빼는 `++`, `--`도 있지만 Python과 Rust에는 없습니다.

### 4.2 섀도잉은 언제 쓰나

같은 "의미"의 값을 **형태만 바꿔** 이어서 쓸 때 편리합니다. 입력으로 받은 문자열을 정수로 바꾸는 것이 대표적입니다.

```rust
let input = "45";                           // &str
let input: u32 = input.parse().unwrap();    // u32
let input = input * 2;                      // u32, 90
```

`input_str`, `input_num`처럼 이름을 계속 새로 짓지 않아도 됩니다. 반대로 **누적 합계**처럼 같은 값이 계속 바뀌는 경우에는 `mut`가 자연스럽습니다. 섀도잉은 한 번 만든 바인딩을 바꾸지 않으므로, 각 단계의 값이 그 뒤로 바뀌지 않는다는 장점은 그대로 유지됩니다.

### 4.3 상수

| 언어   | 쓰는 법                         | 특징                                                              |
| ------ | ------------------------------- | ----------------------------------------------------------------- |
| Rust   | `const MAX_MINUTES: u32 = 120;` | 자료형 필수, 컴파일할 때 값이 정해져야 함, 함수 밖에도 둘 수 있음 |
| C      | `const int goal = 60;`          | 바꾸려 하면 컴파일 오류(`assignment of read-only variable`)       |
| C      | `#define MAX_MINUTES 120`       | 전처리기가 글자 `MAX_MINUTES`를 `120`으로 바꿔치기함. 자료형 없음 |
| Python | `MAX_MINUTES = 120`             | 대문자 이름은 **약속**일 뿐, 바꾸는 것을 막지 않음                |

`#define`은 변수가 아니라 **글자 바꿔치기**라서 세미콜론을 붙이지 않고, 디버거에서 이름이 보이지 않습니다. 요즘 C 코드에서는 가능하면 `const` 변수를 씁니다.

### 4.4 블록과 범위

**범위(scope)** 는 이름이 보이는 영역입니다. 세 언어의 규칙이 다릅니다.

| 언어   | 새 범위를 만드는 것               | 안쪽에서 같은 이름을 만들면                  |
| ------ | --------------------------------- | -------------------------------------------- |
| Rust   | 모든 `{ }` 블록                   | 새 바인딩(섀도잉), 블록 끝에서 사라짐        |
| C      | 모든 `{ }` 블록                   | 새 변수가 바깥 것을 가림, 블록 끝에서 사라짐 |
| Python | 함수(`def`)만. `if`, `for`는 아님 | 같은 이름이면 같은 변수를 바꿈               |

Python의 범위는 함수를 배우는 Day 23에서 자세히 다룹니다.

### 4.5 값 교환

두 변수의 값을 바꾸는 것은 의외로 실수가 잦은 작업입니다.

| 언어   | 교환 방법                                                 |
| ------ | --------------------------------------------------------- |
| C      | `int tmp = a; a = b; b = tmp;`                            |
| Python | `a, b = b, a`                                             |
| Rust   | `(a, b) = (b, a);` 또는 `std::mem::swap(&mut a, &mut b);` |

Python과 Rust는 **오른쪽을 먼저 전부 계산한 뒤** 왼쪽에 넣기 때문에 원래 값을 잃지 않습니다.

## 5. Rust로 구현하기

```rust
// 파일: bindings.rs
const MAX_MINUTES: u32 = 120;          // 상수: 자료형을 꼭 적고, 이름은 대문자

fn main() {
    let goal = 60;                      // 불변 바인딩
    let mut done = 0;                   // 가변 바인딩
    done += 25;                         // done = done + 25
    done += 20;
    println!("목표 {goal}분 중 {done}분 완료 (최대 {MAX_MINUTES}분)");

    // 섀도잉: 같은 이름으로 새 바인딩을 만든다. 자료형이 달라져도 된다
    let input = "45";
    let input: u32 = input.parse().unwrap();
    let input = input * 2;
    println!("섀도잉 결과: {input}");

    // 블록 { } 안에서 만든 바인딩은 블록이 끝나면 사라진다
    let level = 1;
    {
        let level = level + 10;
        println!("블록 안 level = {level}");
    }
    println!("블록 밖 level = {level}");

    // 선언만 먼저 하고 값은 나중에: 한 번만 정할 수 있다
    let half: u32;
    half = MAX_MINUTES / 2;
    println!("절반 = {half}");

    // 튜플로 여러 값을 한 번에 만들고, 한 번에 바꾼다
    let (mut a, mut b) = (1, 2);
    (a, b) = (b, a);
    println!("교환: a={a}, b={b}");

    let _unused = 0;                    // 밑줄로 시작하면 '안 써도 된다'는 표시
}
```

실행 결과:

```text
목표 60분 중 45분 완료 (최대 120분)
섀도잉 결과: 90
블록 안 level = 11
블록 밖 level = 1
절반 = 60
교환: a=2, b=1
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `const MAX_MINUTES: u32 = 120;`              | `main` 밖에 둔 상수입니다. `u32`는 부호 없는 32비트 정수입니다. 프로그램 어디서든 쓸 수 있습니다.                                              |
| `let goal = 60;`                             | 불변 바인딩입니다. 이후 `goal = 70;`을 쓰면 컴파일 오류입니다.                                                                                 |
| `let mut done = 0;` / `done += 25;`          | 가변 바인딩이라 값을 더해 갈 수 있습니다.                                                                                                      |
| `let input: u32 = input.parse().unwrap();`   | 오른쪽의 `input`은 아직 **옛 바인딩**(`"45"`)입니다. 이 줄이 끝나야 새 바인딩(`45`)이 생깁니다. 그래서 자기 자신으로 새 값을 만들 수 있습니다. |
| `{ let level = level + 10; ... }`            | 블록 안에서 바깥 `level`(1)을 읽어 새 `level`(11)을 만듭니다. 블록이 끝나면 새 것만 사라집니다.                                                |
| `let half: u32;` / `half = MAX_MINUTES / 2;` | 선언과 초기화를 나눌 수 있습니다. `mut`가 없어도 **처음 한 번**은 값을 넣을 수 있습니다. 값을 넣기 전에 읽으면 E0381 오류입니다.               |
| `let (mut a, mut b) = (1, 2);`               | **튜플**(값 여러 개를 괄호로 묶은 것)을 나누어 두 바인딩을 한 번에 만듭니다.                                                                   |
| `(a, b) = (b, a);`                           | 오른쪽 튜플 `(2, 1)`을 먼저 만들고 나눠 넣어 교환합니다.                                                                                       |
| `let _unused = 0;`                           | 쓰지 않는 변수에는 경고가 나오는데, 이름을 `_`로 시작하면 "일부러 안 쓴다"는 뜻이 되어 경고가 없습니다.                                        |

## 6. C로 구현하기

C는 기본이 **바꿀 수 있는 변수**이고, 바꾸지 않을 값에 `const`를 붙입니다.

```c
// 파일: bindings.c
#include <stdio.h>

#define MAX_MINUTES 120                 // 전처리기가 글자를 바꿔치기하는 상수

int main(void) {
    const int goal = 60;                // 바꿀 수 없는 변수
    int done = 0;
    done += 25;                         // done = done + 25
    done = done + 20;
    printf("목표 %d분 중 %d분 완료 (최대 %d분)\n", goal, done, MAX_MINUTES);

    int level = 1;
    {
        int level = 11;                 // 안쪽 블록의 새 변수가 바깥 것을 가린다
        printf("블록 안 level = %d\n", level);
    }
    printf("블록 밖 level = %d\n", level);

    int a = 1, b = 2;                   // 한 줄에 두 변수
    int tmp = a;                        // 교환하려면 임시 변수가 필요하다
    a = b;
    b = tmp;
    printf("교환: a=%d, b=%d\n", a, b);

    int x, y, z;
    x = y = z = 7;                      // 대입식도 값을 가진다(오른쪽부터)
    printf("x=%d y=%d z=%d\n", x, y, z);
    return 0;
}
```

실행 결과:

```text
목표 60분 중 45분 완료 (최대 120분)
블록 안 level = 11
블록 밖 level = 1
교환: a=2, b=1
x=7 y=7 z=7
```

### 코드 한 부분씩 읽기

| 코드                                | 설명                                                                                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#define MAX_MINUTES 120`           | 컴파일 전에 `MAX_MINUTES`라는 글자가 모두 `120`으로 바뀝니다. 세미콜론을 붙이면 `120;`으로 바뀌어 엉뚱한 오류가 나니 주의하세요.                                     |
| `const int goal = 60;`              | 선언할 때 값을 정하고, 이후 대입하면 컴파일 오류입니다.                                                                                                              |
| `done += 25;` / `done = done + 20;` | 두 줄은 같은 방식의 계산입니다.                                                                                                                                      |
| `{ int level = 11; ... }`           | 블록 안에서 같은 이름의 **새 변수**를 만들어 바깥 것을 가립니다. Rust의 블록 섀도잉과 같은 모습이지만, C에서는 같은 블록 안에서 같은 이름을 다시 선언할 수 없습니다. |
| `int a = 1, b = 2;`                 | 쉼표로 같은 자료형의 변수를 여러 개 선언합니다.                                                                                                                      |
| `int tmp = a; a = b; b = tmp;`      | 임시 변수로 교환합니다. 실습의 디버그 문제에서 `tmp` 없이 하면 어떻게 되는지 확인합니다.                                                                             |
| `x = y = z = 7;`                    | C의 대입은 "대입한 값"을 결과로 가지는 **식**입니다. 오른쪽부터 `z = 7`, 그 결과 7로 `y = 7`, 다시 `x = 7`이 됩니다.                                                 |

## 7. Python으로 구현하기

Python에는 바꿀 수 없는 변수를 만드는 문법이 없습니다. 대신 **대문자 이름**으로 "상수처럼 쓰자"고 약속하고, 여러 값 대입과 `del`처럼 이름을 다루는 도구가 있습니다.

```python
# 파일: bindings.py
MAX_MINUTES = 120              # 대문자 이름: '바꾸지 말자'는 약속(강제는 아님)

goal = 60
done = 0
done += 25                     # done = done + 25
done = done + 20
print(f"목표 {goal}분 중 {done}분 완료 (최대 {MAX_MINUTES}분)")

a, b = 1, 2
a, b = b, a                    # 오른쪽 (2, 1)을 먼저 만든 뒤 나눠 담는다
print(f"교환: a={a}, b={b}")

x = y = z = 7                  # 세 이름이 같은 값 7을 가리킨다
print("x y z =", x, y, z)

count = 3
print("count가 있나?", "count" in globals())
del count                      # 이름표를 뗀다
print("del 뒤에는?", "count" in globals())

MAX_MINUTES = 999              # 막는 장치가 없다 → 약속을 지키는 것이 중요
print("상수를 바꿔 버림:", MAX_MINUTES)
```

실행 결과:

```text
목표 60분 중 45분 완료 (최대 120분)
교환: a=2, b=1
x y z = 7 7 7
count가 있나? True
del 뒤에는? False
상수를 바꿔 버림: 999
```

### 코드 한 부분씩 읽기

| 코드                   | 설명                                                                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `MAX_MINUTES = 120`    | 보통 변수와 똑같습니다. 대문자는 읽는 사람을 위한 표시입니다.                                                                                 |
| `a, b = b, a`          | 오른쪽 `b, a`가 먼저 `(2, 1)` 묶음(튜플)이 되고, 그다음 왼쪽 이름에 하나씩 들어갑니다.                                                        |
| `x = y = z = 7`        | 세 이름이 **같은 값** 7을 가리킵니다. 정수는 바꿀 수 없는 값이라 문제없지만, 리스트로 이렇게 하면 세 이름이 같은 리스트를 공유합니다(Day 31). |
| `"count" in globals()` | `globals()`는 지금 파일에 있는 이름들의 목록입니다. 이름이 있는지 확인하는 데 썼습니다.                                                       |
| `del count`            | 이름표를 뗍니다. 이후 `count`를 읽으면 NameError입니다. 값 3 자체는 더 이상 가리키는 이름이 없으면 Python이 알아서 정리합니다.                |
| `MAX_MINUTES = 999`    | 아무 오류 없이 바뀝니다. 이런 실수를 막고 싶으면 타입 검사 도구와 `typing.Final` 표시를 함께 씁니다(실행 자체는 막지 않습니다).               |

## 8. 실행 추적

Rust 코드의 섀도잉 부분에서 **살아 있는 바인딩**을 따라갑니다. "보이는 것"은 그 이름으로 읽을 때 실제로 쓰이는 바인딩입니다.

| 줄                                   | 새로 생긴 바인딩    | 이름 `input`이 가리키는 것 | 이름 `level`이 가리키는 것 |
| ------------------------------------ | ------------------- | -------------------------- | -------------------------- |
| `let input = "45";`                  | input①: `&str "45"` | ①                          |                            |
| `let input: u32 = input.parse()...;` | input②: `u32 45`    | ② (①은 가려짐)             |                            |
| `let input = input * 2;`             | input③: `u32 90`    | ③                          |                            |
| `let level = 1;`                     | level①: `1`         | ③                          | ①                          |
| `{ let level = level + 10;`          | level②: `11`        | ③                          | ② (블록 안)                |
| `}`                                  | level② 사라짐       | ③                          | ①                          |

## 9. 다른 예제로 다시 이해하기

하루 걸음 수를 기록하는 프로그램입니다. **목표**는 바뀌지 않는 상수, **걸음 수**는 계속 바뀌는 값, **거리**는 걸음 수를 다른 형태로 바꾼 값입니다. 각각에 어울리는 선언을 골라 봅시다.

```rust
// 파일: steps.rs
const DAILY_GOAL: u32 = 8000;
const KM_PER_STEP: f64 = 0.0007;

fn main() {
    let mut steps = 0;
    steps += 2500;      // 아침
    steps += 3200;      // 점심
    steps += 1900;      // 저녁
    println!("걸음 수: {steps} / {DAILY_GOAL}");

    let remaining = DAILY_GOAL - steps;
    println!("남은 걸음: {remaining}");

    let steps = steps as f64 * KM_PER_STEP;     // 섀도잉: 걸음 수 → km
    println!("걸은 거리: {steps:.2}km");
}
```

실행 결과:

```text
걸음 수: 7600 / 8000
남은 걸음: 400
걸은 거리: 5.32km
```

`steps`의 자료형은 처음에 `u32`(정수)였다가, 섀도잉 뒤에는 `f64`(실수)가 되었습니다. `mut` 바인딩에 실수를 넣으려 했다면 자료형이 달라 오류가 났을 것입니다. 다만 "걸음 수"와 "거리"는 뜻이 다르니, 실제 코드에서는 `distance_km`처럼 새 이름을 쓰는 편이 더 읽기 좋습니다. 섀도잉은 **같은 뜻의 값을 형태만 바꿀 때** 쓰세요.

같은 계산을 Python으로 하고, 목표를 넘겨서 걸었을 때를 봅시다.

```python
# 파일: steps.py
DAILY_GOAL = 8000
steps = 0
steps += 2500
steps += 3200
steps += 1900
print(f"걸음 수: {steps} / {DAILY_GOAL}")
print(f"남은 걸음: {DAILY_GOAL - steps}")
print(f"걸은 거리: {steps * 0.0007:.2f}km")

steps += 1000
print(f"더 걸은 뒤 남은 걸음: {DAILY_GOAL - steps}")
```

실행 결과:

```text
걸음 수: 7600 / 8000
남은 걸음: 400
걸은 거리: 5.32km
더 걸은 뒤 남은 걸음: -600
```

Python은 음수 -600을 그대로 보여 줍니다. Rust에서 `u32`(부호 없는 정수)로 같은 계산을 하면 음수를 담을 수 없어서 실행 중에 멈춥니다(12절 실수 5). 자료형이 담을 수 있는 범위는 Day 10과 Day 11에서 자세히 배웁니다.

## 10. 선언 방식 고르기

| 이런 값이라면                     | Rust                     | C                       | Python               |
| --------------------------------- | ------------------------ | ----------------------- | -------------------- |
| 프로그램 내내 고정(설정, 한계값)  | `const NAME: 타입 = 값;` | `const 타입 name = 값;` | `NAME = 값` (대문자) |
| 한 번 계산하면 그 뒤로 안 바뀜    | `let name = 값;`         | `const 타입 name = 값;` | `name = 값`          |
| 계속 바뀜(누적, 개수, 상태)       | `let mut name = 값;`     | `타입 name = 값;`       | `name = 값`          |
| 같은 뜻, 다른 형태(문자열 → 정수) | 섀도잉 `let name = ...;` | 새 변수 이름            | 같은 이름에 재대입   |

## 11. 세 언어 비교

| 관점                | Rust              | C                    | Python            |
| ------------------- | ----------------- | -------------------- | ----------------- |
| 기본                | 바꿀 수 없음      | 바꿀 수 있음         | 바꿀 수 있음      |
| 바꾸지 않게 하기    | 기본값            | `const`              | (문법 없음, 관례) |
| 바꿀 수 있게 하기   | `mut`             | 기본값               | 기본값            |
| 같은 이름 다시 선언 | 섀도잉 허용       | 같은 블록에서는 불가 | 그냥 재대입       |
| 범위의 단위         | 모든 블록         | 모든 블록            | 함수              |
| 교환                | `(a, b) = (b, a)` | 임시 변수            | `a, b = b, a`     |
| `++`, `--`          | 없음              | 있음                 | 없음              |

## 12. 자주 하는 실수

### 실수 1: mut 없이 값을 바꾼다 (Rust)

```rust
// 파일: no_mut.rs (컴파일 오류: E0384)
fn main() {
    let total = 0;
    total += 10;
    println!("{total}");
}
```

### 실수 2: 값을 정하기 전에 읽는다 (Rust)

```rust
// 파일: uninit.rs (컴파일 오류: E0381)
fn main() {
    let bonus: i32;
    let score = 80;
    println!("{}", score + bonus);
}
```

`used binding 'bonus' isn't initialized`라는 오류가 납니다. C에서는 이런 코드가 컴파일되고 **아무 값(쓰레기 값)** 이나 읽어 버릴 수 있는데, Rust는 컴파일할 때 막습니다.

### 실수 3: const 변수에 대입한다 (C)

```c
// 파일: const_assign.c (컴파일 오류: assignment of read-only variable)
#include <stdio.h>

int main(void) {
    const int goal = 60;
    goal = 70;
    printf("%d\n", goal);
    return 0;
}
```

### 실수 4: const에 자료형을 빠뜨린다 (Rust)

```rust
// 파일: const_type.rs (컴파일 오류: missing type for `const` item)
const MAX = 10;

fn main() {
    println!("{MAX}");
}
```

`let`과 달리 `const`는 자료형을 추론하지 않습니다.

### 실수 5: 부호 없는 정수가 음수가 된다 (Rust)

```rust
// 파일: underflow.rs (실행 오류: attempt to subtract with overflow)
fn main() {
    let goal: u32 = 8000;
    let steps: u32 = "8600".parse().unwrap();
    let remaining = goal - steps;
    println!("{remaining}");
}
```

`u32`는 0 이상만 담습니다. 8000 − 8600은 담을 수 없어 개발용 빌드에서는 프로그램이 멈춥니다(최적화 빌드에서는 엄청 큰 수로 바뀝니다). 음수가 가능하면 `i32`를 쓰거나, 빼기 전에 크기를 비교합니다(Day 12).

## 13. Q&A

**Q. 모든 변수에 mut를 붙이면 편하지 않나요?**

A. 컴파일은 되지만, 값을 바꾸지 않는 `mut` 변수에는 "`variable does not need to be mutable`" 경고가 납니다. 더 큰 문제는 읽는 사람이 모든 변수를 "바뀔 수 있다"고 의심해야 한다는 점입니다. 필요한 곳에만 붙이세요.

**Q. 섀도잉을 하면 옛 값은 메모리에서 지워지나요?**

A. 옛 바인딩은 가려질 뿐, 자기 범위(블록)가 끝날 때까지 살아 있습니다. 정수 같은 작은 값은 신경 쓸 필요가 없습니다. 이름만 같을 뿐 전혀 다른 변수라고 생각하면 됩니다.

**Q. const와 불변 let은 무엇이 다른가요?**

A. `let`은 실행 중에 계산한 값(입력받은 값 등)도 담을 수 있지만, `const`는 **컴파일할 때** 값이 정해져야 합니다. 또 `const`는 함수 밖에 둘 수 있어서 여러 함수가 함께 씁니다. "프로그램의 설정값"은 `const`, "계산 결과"는 `let`이라고 생각하세요.

**Q. C에서 const 변수는 정말 못 바꾸나요?**

A. 정상적인 방법으로는 컴파일러가 막습니다. 포인터로 억지로 바꾸는 방법이 있지만 결과가 정해지지 않은 동작이라 절대 쓰면 안 됩니다(Day 29 이후).

## 14. 핵심 요약

- Rust의 `let`은 기본적으로 **바꿀 수 없고**, 바꾸려면 `let mut`로 선언합니다. `mut`는 값을 바꿀 수 있다는 뜻이지 자료형을 바꿀 수 있다는 뜻이 아닙니다.
- **섀도잉**은 같은 이름의 새 바인딩을 만드는 것입니다. 자료형이 달라도 되고, 블록 안에서 한 섀도잉은 블록이 끝나면 사라집니다.
- 상수: Rust `const 이름: 타입 = 값;`, C `const`와 `#define`, Python은 대문자 이름 관례(강제 없음).
- C와 Rust는 모든 `{ }` 블록이 범위를 만들고, Python은 함수가 범위를 만듭니다.
- 교환: C는 임시 변수, Python은 `a, b = b, a`, Rust는 `(a, b) = (b, a)`.
- 부호 없는 정수(`u32`)는 음수를 담을 수 없습니다.

## 15. 도전 문제

1. **(Rust)** 문자열 `"3.5"`를 섀도잉으로 `f64`로 바꾸고, 다시 섀도잉으로 두 배 한 값을 출력하세요.
2. **(C)** 세 변수 a, b, c의 값을 a→b→c→a 방향으로 한 칸씩 옮기세요. 임시 변수는 몇 개 필요할까요?
3. **(Python)** `x = y = []`로 만든 뒤 `x.append(1)`을 하고 `y`를 출력해 보세요. 정수 때와 결과가 왜 다른지 추측해 보세요(Day 31에서 답을 확인합니다).
4. **(세 언어)** 통장 잔액 10000원에서 3000원씩 네 번 출금하는 프로그램을 만들어, 잔액이 음수가 될 때 각 언어가 어떻게 반응하는지 비교하세요(Rust는 `u32`와 `i32`를 둘 다 시도).
