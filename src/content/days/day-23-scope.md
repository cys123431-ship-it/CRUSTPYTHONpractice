---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-23-scope
courseId: crp-92
phaseId: phase-02
dayNumber: 23
date: "2026-10-23"
title: 이름의 범위 — 변수는 어디서 보이고 언제 사라지나
summary: 변수 이름이 보이는 영역인 범위(scope)와 변수가 살아 있는 기간인 수명(lifetime)을 배웁니다. Python이 이름을 지역·바깥 함수·전역·내장 순서(LEGB)로 찾는 규칙, 함수 안에서 대입하면 지역 변수가 생긴다는 것과 global·nonlocal, 함수를 돌려주는 클로저를 익히고, C의 블록 범위·파일 범위 전역 변수·호출이 끝나도 값이 남는 static 지역 변수, Rust의 블록 범위·전역 상수·바깥 변수를 붙잡는 클로저를 비교합니다. 전역 변수 때문에 두 손님의 장바구니가 섞이는 버그를 매개변수와 반환값으로 고쳐 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-22-rust-return]
learningObjectives:
  - 범위와 수명을 구별하고, 세 언어에서 이름이 보이는 영역을 코드로 확인한다.
  - Python의 LEGB 규칙과 '함수 안에서 대입하면 지역 변수'라는 규칙으로 UnboundLocalError를 설명하고 고친다.
  - global, nonlocal, 클로저로 바깥 변수를 읽거나 바꾸는 방법과 그 위험을 설명한다.
  - C의 블록 범위, 전역 변수, static 지역 변수를 구별해 쓴다.
  - 전역 변수에 기대는 함수를 매개변수와 반환값을 쓰는 함수로 바꾼다.
concepts:
  [
    scope,
    lifetime,
    local variable,
    global variable,
    LEGB,
    global keyword,
    nonlocal,
    closure,
    static local,
    block scope,
    shadowing,
  ]
runnerMode: python
playgroundSource: |
  # 파일: scope.py — global과 nonlocal을 지워 보고 무슨 일이 생기는지 보세요.
  total = 0
  def add(x):
      global total
      total += x
  add(3); add(4)
  print("total:", total)

  def make_counter():
      n = 0
      def step():
          nonlocal n
          n += 1
          return n
      return step
  c = make_counter()
  print(c(), c(), c())
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day23-predict-py
    title: 지역 변수와 전역 변수 예측하기
    kind: predict
    objective: 함수 안의 대입이 새 지역 변수를 만든다는 것을 확인한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      x = 10


      def f():
          x = 20
          return x


      print(f(), x)
    answer: "20 10"
    hint: "f 안의 x = 20은 f만의 새 변수를 만듭니다. 전역 x는 건드리지 않습니다."
    explanation: "함수 안에서 이름에 대입하면 그 이름은 그 함수의 지역 변수가 됩니다. 그래서 f는 20을 돌려주고, 전역 x는 10 그대로입니다. 전역 x를 바꾸려면 global x가 필요합니다."
    commonMistakes:
      - "전역 x가 20으로 바뀐다고 생각함"
      - "f 안의 x가 처음에 전역 값 10을 가진다고 생각함"
    language: python
    verification: run
  - id: ex-day23-predict-c
    title: static 지역 변수 예측하기
    kind: predict
    objective: static 지역 변수가 호출 사이에도 값을 유지한다는 것을 확인한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int tick(void) {
          static int n = 0;
          n += 5;
          return n;
      }

      int main(void) {
          int a = tick();
          int b = tick();
          int c = tick();
          printf("%d %d %d\n", a, b, c);
          return 0;
      }
    answer: "5 10 15"
    hint: "static int n = 0;은 프로그램이 시작할 때 한 번만 0으로 정해집니다. 호출할 때마다 다시 0이 되지 않습니다."
    explanation: "static 지역 변수는 이름은 함수 안에서만 보이지만(범위), 값은 프로그램이 끝날 때까지 남아 있습니다(수명). 그래서 5, 10, 15로 쌓입니다. static을 빼면 매번 0에서 시작해 5 5 5가 됩니다."
    commonMistakes:
      - "호출마다 0으로 초기화된다고 생각해 5 5 5로 적음"
      - "main에서 n을 직접 읽을 수 있다고 생각함"
    language: c
    verification: run
  - id: ex-day23-fill
    title: 클로저가 바깥 변수를 읽게 하기
    kind: fill
    objective: Rust 클로저가 바깥의 바인딩을 붙잡아 쓴다는 것을 확인한다.
    prompt: "빈칸을 채워 add(10)이 바깥의 bonus를 더한 15를 돌려주게 하세요."
    starter: |-
      fn main() {
          let bonus = 5;
          let add = |a: i32| a + _____;
          println!("{}", add(10));
      }
    answer: |-
      fn main() {
          let bonus = 5;
          let add = |a: i32| a + bonus;
          println!("{}", add(10));
      }
    output: "15"
    hint: "클로저는 자신이 만들어진 곳에서 보이는 바인딩을 그대로 쓸 수 있습니다."
    explanation: "|a: i32| a + bonus는 매개변수 a를 받는 이름 없는 함수이고, 바깥의 bonus를 붙잡아(capture) 씁니다. 같은 일을 fn add(a: i32) -> i32 { a + bonus }로 쓰면 fn 안에서는 main의 bonus가 보이지 않아 E0434 오류가 납니다."
    commonMistakes:
      - "클로저 대신 fn을 안쪽에 만들어 바깥 변수를 쓰려 함"
      - "|a| 뒤에 중괄호가 반드시 필요하다고 생각함(식 하나면 생략 가능)"
    language: rust
    verification: run
  - id: ex-day23-modify
    title: 전역 변수 대신 매개변수와 반환값 쓰기
    kind: modify
    objective: 전역 상태에 기대는 함수를 입력과 출력만 쓰는 함수로 바꾼다.
    prompt: "global을 쓰는 add를 def add(total, x)처럼 합계를 받아 새 합계를 돌려주는 함수로 바꾸고, 결과 7을 출력하세요."
    starter: |-
      total = 0


      def add(x):
          global total
          total += x


      add(3)
      add(4)
      print(total)
    answer: |-
      def add(total, x):
          return total + x


      total = 0
      total = add(total, 3)
      total = add(total, 4)
      print(total)
    output: "7"
    hint: "함수가 바깥 변수를 바꾸는 대신, 새 값을 돌려주고 부른 쪽이 대입하게 하세요."
    explanation: "이렇게 바꾸면 add는 같은 입력에 항상 같은 결과를 내는 함수가 되어 어디서든 믿고 쓸 수 있고, 시험하기도 쉽습니다. 합계가 어디서 바뀌는지도 부른 쪽의 대입 줄에서 바로 보입니다."
    commonMistakes:
      - "return은 추가했지만 부른 쪽에서 결과를 대입하지 않아 0이 출력됨"
      - "global 줄을 남겨 둬서 매개변수 total과 충돌함(SyntaxError)"
    language: python
    verification: run
  - id: ex-day23-debug
    title: UnboundLocalError 고치기
    kind: debug
    objective: 함수 안에서 전역 변수를 바꾸려다 생기는 오류의 원인을 알고 고친다.
    prompt: "이 코드는 UnboundLocalError로 멈춥니다. 전역 count를 1 늘리고 돌려주도록 고쳐 1이 출력되게 하세요."
    starter: |-
      count = 0


      def hit():
          count += 1
          return count


      print(hit())
    answer: |-
      count = 0


      def hit():
          global count
          count += 1
          return count


      print(hit())
    output: "1"
    hint: "count += 1은 count에 대입하는 문장이라, Python은 count를 hit의 지역 변수로 봅니다. 그런데 지역 count에는 아직 값이 없습니다."
    explanation: "Python은 함수를 실행하기 전에 '이 함수 안에서 대입되는 이름은 지역 변수'라고 정해 둡니다. 그래서 count += 1이 전역 count를 읽지 못하고 '값이 없는 지역 변수'를 읽으려다 오류가 납니다. global count로 전역임을 알리거나, 모범적으로는 매개변수와 반환값으로 바꿉니다."
    commonMistakes:
      - "함수 안에 count = 0을 넣어 항상 1만 돌려주게 만듦"
      - "global을 함수 밖에 씀(아무 효과 없음)"
    language: python
    verification: run
  - id: ex-day23-independent
    title: Rust로 독립된 카운터 두 개 만들기
    kind: independent
    objective: 클로저가 자기만의 상태를 가지고 다니는 것을 확인한다.
    prompt: "호출할 때마다 1, 2, 3, …을 돌려주는 카운터를 만드는 make_counter를 만들고, 카운터 두 개로 '1 2 3 1'을 출력하세요(첫 카운터 세 번, 둘째 카운터 한 번)."
    starter: |-
      fn main() {
          println!("? ? ? ?");
      }
    answer: |-
      fn make_counter() -> impl FnMut() -> u32 {
          let mut n = 0;
          move || {
              n += 1;
              n
          }
      }

      fn main() {
          let mut first = make_counter();
          let mut second = make_counter();
          let a = first();
          let b = first();
          let c = first();
          let d = second();
          println!("{a} {b} {c} {d}");
      }
    output: "1 2 3 1"
    hint: "move 클로저는 n을 자기 안으로 옮겨 가지므로, make_counter가 끝나도 n이 살아 있습니다. 호출할 때 n을 바꾸므로 카운터 변수는 mut로 만듭니다."
    explanation: "make_counter를 부를 때마다 새 n이 만들어지고 각 클로저가 자기 n을 가지므로 두 카운터는 서로 영향을 주지 않습니다. impl FnMut() -> u32는 '호출할 수 있고, 호출하면 자기 상태를 바꾸며 u32를 돌려주는 무언가'라는 뜻입니다. Python의 nonlocal 카운터와 같은 구조입니다."
    commonMistakes:
      - "move를 빠뜨려 E0373(closure may outlive the current function) 오류가 남"
      - "first를 mut 없이 만들어 호출할 수 없음(E0596)"
    language: rust
    verification: run
quiz:
  - id: quiz-day23-01
    question: 범위(scope)와 수명(lifetime)의 차이로 옳은 것은?
    choices:
      - 같은 뜻이다
      - 범위는 이름이 보이는 코드 영역이고, 수명은 값이 메모리에 살아 있는 기간이다
      - 범위는 실행 시간, 수명은 코드 줄 수다
      - 수명은 Rust에만 있다
    answerIndex: 1
    explanation: 보통은 둘이 함께 끝나지만 다를 수도 있습니다. C의 static 지역 변수는 범위는 함수 안뿐이지만 수명은 프로그램 전체입니다. Python 클로저가 붙잡은 변수도 바깥 함수가 끝난 뒤까지 살아 있습니다.
  - id: quiz-day23-02
    question: Python에서 이름을 찾는 순서(LEGB)로 옳은 것은?
    choices:
      - 전역 → 지역 → 내장 → 바깥 함수
      - 지역 → 바깥 함수 → 전역 → 내장
      - 내장 → 전역 → 지역
      - 지역에서만 찾는다
    answerIndex: 1
    explanation: Local(지금 함수), Enclosing(감싸는 함수), Global(파일), Built-in(print, len 같은 내장 이름) 순서입니다. 그래서 전역에 print = 5를 만들면 내장 print가 가려집니다.
  - id: quiz-day23-03
    question: Python 클로저의 바깥 함수 변수를 안쪽 함수에서 '바꾸려면' 필요한 것은?
    choices: ["global", "nonlocal", "static", "아무것도 필요 없다"]
    answerIndex: 1
    explanation: 읽기만 하면 아무 표시도 필요 없지만, 대입하면 안쪽 함수의 지역 변수가 되어 버립니다. nonlocal n이라고 쓰면 바깥 함수의 n을 바꿉니다. global은 파일 전역 변수에만 씁니다.
  - id: quiz-day23-04
    question: C의 for (int i = 0; i < 3; i++) { ... } 뒤에서 i를 쓰면?
    choices:
      - 마지막 값 3을 읽는다
      - i는 for 안에서만 보이므로 컴파일 오류다
      - 0을 읽는다
      - 쓰레기 값을 읽는다
    answerIndex: 1
    explanation: for의 괄호 안에서 선언한 변수는 그 반복 안에서만 보입니다. Rust도 같고, Python만 반복이 끝난 뒤에도 i가 남아 있습니다.
  - id: quiz-day23-05
    question: 전역 변수를 가능한 한 피하라고 하는 가장 큰 이유는?
    choices:
      - 메모리를 너무 많이 써서
      - 어느 함수가 언제 값을 바꿨는지 추적하기 어렵고, 호출 순서에 따라 결과가 달라져서
      - 컴파일이 느려져서
      - 전역 변수는 읽을 수 없어서
    answerIndex: 1
    explanation: 9절의 장바구니처럼 앞선 호출의 값이 남아 다음 결과에 섞입니다. 필요한 값은 매개변수로 받고 결과는 반환값으로 돌려주면, 함수를 따로 떼어 시험할 수 있습니다. 바뀌지 않는 설정값(상수)은 전역에 두어도 괜찮습니다.
---

## 1. 오늘 배울 내용

함수 안에서 만든 변수는 함수 밖에서 보이지 않고, 블록 안에서 만든 변수는 블록이 끝나면 사라졌습니다. 오늘은 이 규칙, 즉 **범위(scope)** 를 제대로 정리합니다.

1. **범위**(이름이 보이는 영역)와 **수명**(값이 살아 있는 기간)을 구별합니다.
2. Python이 이름을 찾는 순서인 **LEGB**를 봅니다.
   - Local: 지금 함수
   - Enclosing: 감싸는 함수
   - Global: 파일
   - Built-in: `print`, `len` 같은 내장 이름
3. "함수 안에서 **대입하면** 지역 변수"라는 규칙과, 그 때문에 생기는 `UnboundLocalError`를 봅니다.
4. 바깥 변수를 바꾸는 `global`, `nonlocal`과, 함수를 돌려주는 **클로저**를 씁니다.
5. C의 **블록 범위**, **전역 변수**, 호출이 끝나도 값이 남는 **`static` 지역 변수**를 익힙니다.
6. Rust의 블록 범위, 전역 **상수**, 바깥 값을 붙잡는 **클로저**를 봅니다.
7. 전역 변수 때문에 생긴 버그를 **매개변수와 반환값**으로 고칩니다.

## 2. 왜 필요한가

프로그램이 커지면 `count`, `total`, `i` 같은 이름이 여러 함수에서 쓰입니다. 모든 이름이 어디서나 보이고 어디서나 바뀐다면, `total`이 이상해졌을 때 수백 줄을 모두 뒤져야 합니다. 범위 규칙은 이름을 **필요한 곳에만** 보이게 해서 이런 혼란을 막습니다.

- 함수 안의 `total`과 다른 함수의 `total`은 **다른 변수**라서 서로 간섭하지 않습니다.
- 반복 안에서만 쓰는 임시 변수는 반복이 끝나면 사라져 실수로 다시 쓸 일이 없습니다.

반대로, 범위를 잘못 이해하면 "분명 바꿨는데 안 바뀌어 있다", "여기서는 왜 값이 없다고 하지?" 같은 버그를 만납니다. 특히 Python의 `UnboundLocalError`는 규칙을 알아야 이해할 수 있는 오류입니다.

## 3. 그림으로 이해하기

범위는 **겹겹이 싼 상자**입니다. 안쪽 상자에서는 바깥 상자의 이름이 보이지만, 바깥에서는 안쪽 이름이 보이지 않습니다.

```text
┌─────────────────── 내장(Built-in): print, len, range ──────────────┐
│ ┌───────────────── 전역(Global): count = 0 ──────────────────────┐ │
│ │ ┌────────── make_counter 함수 (Enclosing): n = 0 ───────────┐ │ │
│ │ │ ┌──────── step 함수 (Local) ────────┐                     │ │ │
│ │ │ │  nonlocal n                       │  ← 바깥 상자의 n     │ │ │
│ │ │ │  n += 1                           │                     │ │ │
│ │ │ └───────────────────────────────────┘                     │ │ │
│ │ └───────────────────────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

이름을 찾을 때: 가장 안쪽(L) → E → G → B 순서로 바깥으로 나가며 찾는다.
```

같은 이름이 여러 상자에 있으면 **가장 가까운 것**이 쓰입니다. 안쪽 이름이 바깥 이름을 **가립니다**(shadowing).

수명은 "상자가 언제 만들어지고 언제 사라지나"입니다.

```text
함수 호출 시작 ───── 지역 변수 생성 ───── 함수 끝 ───── 지역 변수 사라짐
                                                         (다시 부르면 새로 만들어짐)
C의 static 지역 변수: 프로그램 시작 ─────────────────────────── 프로그램 끝
클로저가 붙잡은 변수: 클로저가 살아 있는 동안 ───────────────── 클로저가 사라질 때
```

## 4. 천천히 풀어보기

### 4.1 세 언어의 범위 단위

| 범위를 만드는 것                | Python                       | C                        | Rust                       |
| ------------------------------- | ---------------------------- | ------------------------ | -------------------------- |
| 함수                            | 예                           | 예                       | 예                         |
| 블록 `{ }`                      | (블록 없음)                  | 예                       | 예                         |
| `if`, `for`, `while`            | **아니요**(변수가 밖에 남음) | 예(`for`의 `int i` 포함) | 예                         |
| 파일 전체(전역)                 | 모듈 전역                    | 파일 범위                | `const`, `static`만        |
| 안쪽 함수가 바깥 지역 변수를 봄 | 예(클로저)                   | (안쪽 함수 없음)         | `fn`은 아니요, 클로저는 예 |

Python에서는 `if`나 `for` 안에서 만든 변수가 그 블록이 끝난 뒤에도 남아 있습니다. 범위의 단위가 **함수**이기 때문입니다.

### 4.2 Python의 규칙: 대입하면 지역 변수

Python은 함수를 실행하기 **전에** 몸통을 훑어서, **대입되는 이름**을 모두 그 함수의 지역 변수로 정합니다.

| 함수 안에서 한 일                    | `count`는 무엇인가                              |
| ------------------------------------ | ----------------------------------------------- |
| 읽기만: `print(count)`               | 전역 `count`를 읽음                             |
| 대입: `count = 100`                  | 새 **지역** 변수(전역은 그대로)                 |
| 읽고 대입: `count += 1`              | 지역 변수인데 값이 없어 **`UnboundLocalError`** |
| `global count` 후 `count += 1`       | 전역 `count`를 바꿈                             |
| (안쪽 함수) `nonlocal n` 후 `n += 1` | 바깥 함수의 `n`을 바꿈                          |

`count += 1`은 `count = count + 1`이라 대입이 있으므로 지역 변수로 정해지는데, 오른쪽의 `count`를 읽는 순간 지역 `count`에는 아직 값이 없습니다. 이것이 `UnboundLocalError`입니다.

### 4.3 클로저

**클로저(closure)** 는 자신이 만들어진 곳의 변수를 **붙잡아 가지고 다니는 함수**입니다. `make_counter`가 끝나면 `n`은 사라져야 할 것 같지만, 돌려준 `step` 함수가 `n`을 붙잡고 있어서 계속 살아 있습니다. `make_counter`를 두 번 부르면 `n`도 두 개 만들어지므로 두 카운터는 독립적입니다.

| 언어   | 클로저 쓰는 법                         | 바깥 변수 바꾸기             |
| ------ | -------------------------------------- | ---------------------------- |
| Python | 안쪽 `def`나 `lambda`                  | `nonlocal`                   |
| Rust   | `\|매개변수\| 식`, `move \|\| { ... }` | `mut` 바인딩을 붙잡으면 가능 |
| C      | (없음)                                 | `static` 지역 변수로 흉내    |

### 4.4 C의 전역 변수와 static 지역 변수

| 종류               | 선언 위치          | 범위(보이는 곳) | 수명                | 초기화                           |
| ------------------ | ------------------ | --------------- | ------------------- | -------------------------------- |
| 지역 변수          | 함수·블록 안       | 그 블록         | 블록이 끝날 때까지  | 선언할 때마다(안 하면 쓰레기 값) |
| `static` 지역 변수 | 함수 안 + `static` | 그 함수         | **프로그램 끝까지** | 프로그램 시작 때 한 번(기본 0)   |
| 전역 변수          | 함수 밖            | 파일 전체       | 프로그램 끝까지     | 프로그램 시작 때 한 번(기본 0)   |

`static` 지역 변수는 "이 함수만 쓰지만 호출 사이에 기억해야 하는 값"(호출 횟수, 다음 번호)에 알맞습니다. 전역 변수보다 보이는 곳이 좁아서 안전합니다.

## 5. C로 구현하기

```c
// 파일: scope.c
#include <stdio.h>

int count = 0;                              // 파일 범위(전역) 변수

void increase(void) {
    count++;                                // 전역 변수를 바꾼다
}

void shadow(void) {
    int count = 100;                        // 같은 이름의 지역 변수가 전역을 가린다
    printf("shadow 안의 count: %d\n", count);
}

int next_id(void) {
    static int id = 0;                      // static 지역 변수: 호출이 끝나도 값이 남는다
    id++;
    return id;
}

int main(void) {
    increase();
    increase();
    printf("increase 두 번 뒤 count: %d\n", count);
    shadow();
    printf("전역 count: %d\n", count);

    int a = next_id();
    int b = next_id();
    int c = next_id();
    printf("id: %d %d %d\n", a, b, c);

    int x = 1;
    {
        int x = 2;                          // 블록 안의 새 x
        int y = 10;
        printf("안쪽 블록 x = %d, y = %d\n", x, y);
    }                                       // 여기서 안쪽 x와 y가 사라진다
    printf("바깥 x = %d\n", x);

    int total = 0;
    for (int i = 1; i <= 3; i++) {          // i는 for 안에서만 있다
        int square = i * i;                 // 반복마다 새로 만들어진다
        total += square;
    }
    printf("total = %d\n", total);
    return 0;
}
```

실행 결과:

```text
increase 두 번 뒤 count: 2
shadow 안의 count: 100
전역 count: 2
id: 1 2 3
안쪽 블록 x = 2, y = 10
바깥 x = 1
total = 14
```

### 코드 한 부분씩 읽기

| 코드                               | 설명                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `int count = 0;` (함수 밖)         | 파일 전체에서 보이는 전역 변수입니다.                                                                                              |
| `void increase(void) { count++; }` | C는 전역 변수를 바꿀 때 특별한 표시가 필요 없습니다. 편하지만, 어느 함수가 바꾸는지 코드만 봐서는 알기 어렵습니다.                 |
| `int count = 100;` (`shadow` 안)   | 같은 이름의 지역 변수가 전역을 가립니다. 이 함수 안에서는 전역 `count`에 손댈 수 없습니다.                                         |
| `static int id = 0;`               | 처음 한 번만 0이 되고, 호출이 끝나도 값이 남습니다. `id`라는 이름은 `next_id` 밖에서 보이지 않습니다.                              |
| `int a = next_id(); int b = ...;`  | 한 `printf`에 `next_id()`를 세 번 넣으면 C는 인자를 계산하는 순서를 정하지 않아 결과가 달라질 수 있습니다. 그래서 따로 불렀습니다. |
| `{ int x = 2; int y = 10; ... }`   | 블록이 끝나면 안쪽 `x`와 `y`는 사라집니다. 블록 밖에서 `y`를 쓰면 컴파일 오류입니다.                                               |
| `int square = i * i;` (반복 안)    | 반복마다 새로 만들어지는 변수입니다. 반복 밖에서는 보이지 않습니다.                                                                |

## 6. Python으로 구현하기

```python
# 파일: scope.py
count = 0                                   # 전역 변수(파일 전체에서 보임)


def show():
    print("show가 읽은 count:", count)       # 지역에 없으면 전역을 읽는다


def local_only():
    count = 100                             # 대입하면 새 지역 변수가 생긴다
    print("local_only 안의 count:", count)


def increase():
    global count                            # 전역 변수를 바꾸겠다고 알림
    count += 1


show()
local_only()
print("전역 count:", count)
increase()
increase()
print("increase 두 번 뒤 전역 count:", count)


def make_counter():
    n = 0                                   # make_counter의 지역 변수

    def step():
        nonlocal n                          # 바깥 함수의 n을 바꾼다
        n += 1
        return n

    return step                             # 함수를 돌려준다(클로저)


c1 = make_counter()
c2 = make_counter()
print("c1:", c1(), c1(), c1(), " c2:", c2())

for i in range(3):
    pass
print("for가 끝난 뒤에도 i =", i)
if True:
    inside_if = "if 안에서 만든 변수"
print(inside_if)                            # if는 범위를 만들지 않는다


def outer():
    x = "outer의 x"

    def inner():
        print("inner가 읽은 x:", x)          # 바깥 함수의 변수를 읽는다

    inner()


outer()
```

실행 결과:

```text
show가 읽은 count: 0
local_only 안의 count: 100
전역 count: 0
increase 두 번 뒤 전역 count: 2
c1: 1 2 3  c2: 1
for가 끝난 뒤에도 i = 2
if 안에서 만든 변수
inner가 읽은 x: outer의 x
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `def show(): print(..., count)`              | 읽기만 하니 지역에 없고, 전역 `count`(0)를 찾아 읽습니다.                                                        |
| `def local_only(): count = 100`              | 대입이 있으니 `count`는 지역 변수입니다. 전역은 여전히 0입니다.                                                  |
| `global count` / `count += 1`                | 전역 `count`를 바꾸겠다고 먼저 알립니다.                                                                         |
| `def make_counter(): n = 0; def step(): ...` | 안쪽 함수 `step`이 바깥 함수의 `n`을 씁니다.                                                                     |
| `nonlocal n`                                 | `n += 1`이 `step`의 지역 변수를 만들지 않고 바깥 `n`을 바꾸게 합니다.                                            |
| `return step`                                | 함수 자체를 돌려줍니다(괄호 없이). `c1 = make_counter()`로 받은 `c1`은 부를 수 있는 함수입니다.                  |
| `c1(), c1(), c1()` → 1 2 3, `c2()` → 1       | `c1`과 `c2`는 각자 다른 `n`을 붙잡고 있습니다.                                                                   |
| `for i in range(3): pass` 뒤의 `i`           | Python의 `for`는 범위를 만들지 않아 `i`가 마지막 값 2로 남아 있습니다. `pass`는 "아무것도 하지 않는" 문장입니다. |
| `inner`가 읽은 `x`                           | `inner`에 `x`가 없으니 바깥 함수 `outer`의 `x`를 찾습니다(LEGB의 E).                                             |

## 7. Rust로 구현하기

Rust에는 바꿀 수 있는 전역 변수가 사실상 없습니다(`static mut`은 `unsafe`가 필요합니다). 바뀌지 않는 전역 값은 `const`로, 호출 사이에 기억할 상태는 **클로저**나 구조체(Day 52)로 다룹니다.

```rust
// 파일: scope.rs
const GREETING: &str = "안녕";              // 전역 상수(바꿀 수 없다)

fn make_counter() -> impl FnMut() -> u32 {
    let mut n = 0;
    move || {                               // n을 클로저 안으로 옮겨 계속 가지고 다닌다
        n += 1;
        n
    }
}

fn helper() -> i32 {
    // 여기서는 main의 x를 볼 수 없다. 필요한 값은 매개변수로 받아야 한다
    42
}

fn main() {
    let x = 1;
    {
        let x = 2;                          // 블록 안의 새 바인딩
        let y = 10;
        println!("안쪽 블록 x = {x}, y = {y}");
    }                                       // y는 여기서 사라진다
    println!("바깥 x = {x}");

    let mut count = 0;
    let mut increase = || count += 1;       // 클로저가 count를 빌려 바꾼다
    increase();
    increase();
    println!("increase 두 번 뒤 count = {count}");

    let rate = 0.1;
    let with_tax = |price: f64| price * (1.0 + rate);   // 바깥의 rate를 읽는다
    println!("세금 포함: {:.1}", with_tax(1000.0));

    let mut c1 = make_counter();
    let mut c2 = make_counter();
    println!("c1: {} {} {}  c2: {}", c1(), c1(), c1(), c2());

    let total = {
        let mut s = 0;
        for i in 1..=3 {
            let square = i * i;             // 반복마다 새로 만들어진다
            s += square;
        }
        s
    };
    println!("total = {total}");
    println!("{GREETING} {}", helper());
}
```

실행 결과:

```text
안쪽 블록 x = 2, y = 10
바깥 x = 1
increase 두 번 뒤 count = 2
세금 포함: 1100.0
c1: 1 2 3  c2: 1
total = 14
안녕 42
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `const GREETING: &str = "안녕";`             | 어디서나 쓸 수 있는 전역 **상수**입니다. 바꿀 수 없으니 전역이어도 안전합니다.                                                             |
| `{ let x = 2; let y = 10; ... }`             | 블록 안의 바인딩은 블록이 끝나면 사라집니다(Day 4).                                                                                        |
| `let mut increase = \|\| count += 1;`        | 매개변수가 없는 클로저입니다. 바깥의 `count`를 **가변으로 빌려** 바꿉니다. 클로저가 상태를 바꾸므로 클로저 바인딩 자체도 `mut`여야 합니다. |
| `println!("... {count}")` (increase 호출 뒤) | 클로저가 더 이상 쓰이지 않으므로 빌림이 끝나 `count`를 다시 읽을 수 있습니다. 빌림 규칙은 Day 33에서 자세히 배웁니다.                      |
| `\|price: f64\| price * (1.0 + rate)`        | 바깥의 `rate`를 읽기만 하는 클로저입니다.                                                                                                  |
| `fn make_counter() -> impl FnMut() -> u32`   | "부르면 자기 상태를 바꾸며 `u32`를 돌려주는 무언가"를 돌려줍니다. 정확한 자료형 이름은 컴파일러만 알아서 `impl`로 적습니다.                |
| `move \|\| { n += 1; n }`                    | `move`는 `n`을 빌리지 않고 클로저 **안으로 옮깁니다**. 그래서 `make_counter`가 끝나도 `n`이 클로저와 함께 살아 있습니다.                   |
| `fn helper() -> i32 { 42 }`                  | `fn`으로 만든 함수는 바깥 함수의 지역 변수를 볼 수 없습니다. 필요한 값은 매개변수로 받아야 합니다.                                         |
| `let total = { ... s };`                     | 계산에만 쓰는 `s`와 `square`를 블록 안에 가뒀습니다(Day 22).                                                                               |

## 8. 실행 추적

Python의 `make_counter`로 카운터 두 개를 만들고 부를 때, 각 `n`이 어떻게 바뀌는지 따라갑니다.

| 줄                    | 새로 만들어진 것 | c1의 `n` | c2의 `n` | 결과 |
| --------------------- | ---------------- | -------: | -------: | ---: |
| `c1 = make_counter()` | `n`①(0), `step`① |        0 |          |      |
| `c2 = make_counter()` | `n`②(0), `step`② |        0 |        0 |      |
| `c1()`                |                  |        1 |        0 |    1 |
| `c1()`                |                  |        2 |        0 |    2 |
| `c1()`                |                  |        3 |        0 |    3 |
| `c2()`                |                  |        3 |        1 |    1 |

`make_counter`를 부를 때마다 새 `n`이 만들어지고, 각 `step`은 자기가 만들어질 때의 `n`만 붙잡습니다. 그래서 전역 변수 하나를 함께 쓰는 것과 달리 서로 간섭하지 않습니다.

## 9. 다른 예제로 다시 이해하기

**전역 변수 때문에 섞이는 장바구니.** 한 가게에서 손님마다 장바구니 합계를 계산하는 함수를 전역 변수로 만들면, 앞 손님의 금액이 다음 손님에게 **남아 버립니다**.

```python
# 파일: cart.py
cart_total = 0                               # 전역 장바구니 합계


def add_item_global(price, qty):
    global cart_total
    cart_total += price * qty
    return cart_total


add_item_global(4500, 2)
print("첫 손님(전역):", add_item_global(3000, 1))
print("둘째 손님(전역):", add_item_global(5000, 1))   # 첫 손님 금액이 섞인다


def cart_sum(items):                         # 필요한 값은 매개변수로 받는다
    total = 0                                # 호출할 때마다 새로 시작
    for price, qty in items:
        total += price * qty
    return total


print("첫 손님(지역):", cart_sum([(4500, 2), (3000, 1)]))
print("둘째 손님(지역):", cart_sum([(5000, 1)]))
```

실행 결과:

```text
첫 손님(전역): 12000
둘째 손님(전역): 17000
첫 손님(지역): 12000
둘째 손님(지역): 5000
```

둘째 손님은 5,000원만 담았는데 전역 버전은 17,000원이라고 합니다. `cart_total`을 0으로 되돌리는 줄을 빠뜨린 것이 원인이지만, 더 근본적인 문제는 **함수의 결과가 이전 호출에 따라 달라진다**는 점입니다. 지역 버전의 `cart_sum`은 필요한 것(`items`)을 모두 매개변수로 받고, 결과를 돌려주고, 지역 변수 `total`은 호출할 때마다 0에서 시작합니다. 같은 입력에는 **언제나 같은 결과**가 나오므로 따로 떼어 시험할 수 있습니다.

**C의 static으로 주문 번호 만들기.** 반대로, 호출 사이에 **기억해야 하는** 값도 있습니다. 주문 번호는 이전 번호를 알아야 다음 번호를 만들 수 있습니다. 이 값은 주문 번호 함수만 알면 되므로, 전역 변수보다 `static` 지역 변수가 알맞습니다.

```c
// 파일: order_number.c
#include <stdio.h>

int next_order(void) {
    static int last = 1000;                 // 처음 한 번만 1000으로 초기화된다
    last++;
    return last;
}

void print_receipt(const char *item) {
    int no = next_order();                  // no는 호출마다 새로 만들어진다
    printf("주문 #%d: %s\n", no, item);
}

int main(void) {
    print_receipt("아메리카노");
    print_receipt("라테");
    print_receipt("케이크");
    printf("다음 번호: %d\n", next_order());
    return 0;
}
```

실행 결과:

```text
주문 #1001: 아메리카노
주문 #1002: 라테
주문 #1003: 케이크
다음 번호: 1004
```

`last`는 `next_order` 밖에서 보이지 않으므로, 다른 함수가 실수로 번호를 바꿀 수 없습니다. 반면 `print_receipt`의 `no`는 평범한 지역 변수라 호출마다 새로 만들어집니다. **기억해야 할 값은 가장 좁은 범위에** 두는 것이 원칙입니다. Rust라면 이 역할을 9절의 카운터 같은 클로저나 구조체가 맡습니다.

## 10. 이름을 둘 곳 고르기

| 이런 값이라면                          | 두는 곳                                            |
| -------------------------------------- | -------------------------------------------------- |
| 한 번의 계산에만 쓰는 임시 값          | 가장 안쪽 블록·함수의 지역 변수                    |
| 함수가 일하는 데 필요한 입력           | 매개변수                                           |
| 함수가 만든 결과                       | 반환값                                             |
| 프로그램 내내 바뀌지 않는 설정         | 전역 상수(`#define`/`const`, 대문자 이름, `const`) |
| 한 함수가 호출 사이에 기억해야 하는 값 | C `static` 지역 변수, Python·Rust 클로저           |
| 여러 함수가 함께 바꾸는 상태           | 구조체·클래스로 묶어 넘기기(Day 50~52)             |

## 11. 세 언어 비교

| 관점                   | Python                   | C                       | Rust                                 |
| ---------------------- | ------------------------ | ----------------------- | ------------------------------------ |
| 범위의 단위            | 함수                     | 블록                    | 블록                                 |
| 전역 변수 바꾸기       | `global` 선언 필요       | 그냥 가능               | (사실상 불가, `static mut`은 unsafe) |
| 바깥 함수 변수 바꾸기  | `nonlocal`               | (안쪽 함수 없음)        | 클로저가 가변으로 빌리거나 `move`    |
| 호출 사이에 값 기억    | 클로저, 함수 속성        | `static` 지역 변수      | 클로저, 구조체                       |
| 이름 가리기(shadowing) | 안쪽 대입이 새 지역 변수 | 안쪽 선언이 바깥을 가림 | `let` 섀도잉                         |
| 반복 변수의 수명       | 반복 뒤에도 남음         | `for` 안에서만          | `for` 안에서만                       |

## 12. 자주 하는 실수

### 실수 1: 전역 변수를 바꾸려다 UnboundLocalError

```python
# 파일: unbound.py (실행 오류: UnboundLocalError)
count = 0


def hit():
    count += 1
    return count


print(hit())
```

```text
UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
```

4.2절의 규칙 때문입니다. `global count`를 쓰거나, 더 좋게는 값을 매개변수로 받고 돌려주세요.

### 실수 2: 블록 밖에서 안쪽 변수를 쓴다 (C, Rust)

```rust
// 파일: out_of_scope.rs (컴파일 오류: E0425)
fn main() {
    {
        let inner = 5;
        println!("{inner}");
    }
    println!("{inner}");
}
```

`inner`는 블록이 끝나면서 사라졌습니다. 블록 뒤에서도 필요하면 블록 밖에서 만드세요.

### 실수 3: 안쪽 fn에서 바깥 지역 변수를 쓴다 (Rust)

```rust
// 파일: fn_capture.rs (컴파일 오류: E0434)
fn main() {
    let rate = 0.1;
    fn with_tax(price: f64) -> f64 {
        price * (1.0 + rate)
    }
    println!("{}", with_tax(1000.0));
}
```

`fn`은 바깥의 지역 변수를 붙잡을 수 없습니다. 클로저 `let with_tax = |price: f64| price * (1.0 + rate);`로 바꾸거나 `rate`를 매개변수로 받으세요.

### 실수 4: 내장 이름을 가린다 (Python)

```python
# 파일: shadow_builtin.py (실행 오류: TypeError)
list = [1, 2, 3]
numbers = list(range(5))
print(numbers)
```

`list`라는 이름을 전역 변수로 쓰면 내장 함수 `list`가 가려져, `list(range(5))`가 "리스트를 함수처럼 부르기"가 됩니다. `sum`, `max`, `input`, `str` 같은 내장 이름은 변수 이름으로 쓰지 마세요.

### 실수 5: C의 static을 "매번 초기화"로 착각한다

`static int n = 0;`은 호출할 때마다 실행되는 대입이 아니라, 프로그램 시작 때 한 번만 일어나는 초기화입니다. 매번 0에서 시작해야 하는 값이라면 `static`을 빼세요.

## 13. Q&A

**Q. 전역 변수는 절대 쓰면 안 되나요?**

A. 바뀌지 않는 설정값(상수)은 전역에 두어도 좋습니다. 문제는 **여러 함수가 바꾸는** 전역 변수입니다. 작은 스크립트에서는 괜찮을 수 있지만, 프로그램이 커질수록 매개변수와 반환값, 또는 상태를 묶은 구조체(Day 50~52)로 옮기는 것이 안전합니다.

**Q. 클로저는 어디에 쓰나요?**

A. 설정을 미리 정해 둔 함수 만들기(`make_multiplier(3)`이 "3배 하는 함수"를 돌려줌), 정렬 기준 넘기기, 이벤트가 생길 때 실행할 코드 등록하기처럼 "함수와 약간의 상태를 함께" 다룰 때 씁니다. Rust의 반복자 메서드(`map`, `filter`, Day 90)는 클로저를 받는 대표적인 예입니다.

**Q. Rust에는 왜 바꿀 수 있는 전역 변수가 없나요?**

A. 여러 스레드가 동시에 같은 전역 변수를 바꾸면 값이 깨질 수 있기 때문입니다(데이터 경쟁). Rust는 이런 문제를 컴파일할 때 막으려고, 전역 상태를 쓰려면 `unsafe`나 스레드 안전한 도구(`Mutex`, `AtomicU32`)를 쓰게 합니다.

**Q. 수명(lifetime)은 Rust의 `'a`와 같은 말인가요?**

A. 같은 생각에서 나왔습니다. 오늘의 수명은 "값이 살아 있는 기간"이고, Rust의 수명 표기 `'a`는 "참조가 가리키는 값이 얼마나 오래 살아 있어야 하는지"를 컴파일러에게 알려 주는 표시입니다. Day 45에서 배웁니다.

## 14. 핵심 요약

- **범위**는 이름이 보이는 영역, **수명**은 값이 살아 있는 기간입니다. 안쪽 범위의 같은 이름은 바깥 이름을 가립니다.
- Python의 범위 단위는 함수이고, 이름은 **LEGB**(지역 → 바깥 함수 → 전역 → 내장) 순서로 찾습니다. `if`와 `for`는 범위를 만들지 않습니다.
- Python에서 함수 안에서 **대입한 이름은 지역 변수**입니다. 전역을 바꾸려면 `global`, 바깥 함수 변수를 바꾸려면 `nonlocal`. 이를 모르면 `UnboundLocalError`가 납니다.
- **클로저**는 만들어진 곳의 변수를 붙잡아 가지고 다니는 함수입니다(Python 안쪽 `def`, Rust `|x| ...`, `move`).
- C와 Rust는 블록마다 범위가 생깁니다. C의 `static` 지역 변수는 범위는 함수 안이지만 수명은 프로그램 전체입니다.
- 여러 함수가 바꾸는 전역 변수는 피하고, **매개변수로 받아 반환값으로 돌려주는** 함수를 만드세요. 기억할 값은 가장 좁은 범위에 둡니다.

## 15. 도전 문제

1. **(Python)** `make_multiplier(k)`가 "k배 하는 함수"를 돌려주게 만들고, `triple = make_multiplier(3)`, `triple(7)`이 21인지 확인하세요.
2. **(C)** 호출될 때마다 지금까지 받은 값들의 평균을 돌려주는 `double running_average(int x)`를 `static` 변수 두 개(합계, 개수)로 만드세요.
3. **(Rust)** 초기 잔액을 받아 "입금할 금액을 받아 새 잔액을 돌려주는" 클로저를 돌려주는 `make_account(start: i64) -> impl FnMut(i64) -> i64`를 만들어 보세요.
4. **(세 언어)** 전역 변수를 쓰는 짧은 프로그램(예: 점수 누적)을 하나 만든 뒤, 전역 변수 없이 매개변수와 반환값만 쓰도록 고치고, 두 버전을 두 번 연속 실행했을 때의 결과를 비교하세요.
