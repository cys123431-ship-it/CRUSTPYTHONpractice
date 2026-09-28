---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-32-move-clone
courseId: crp-92
phaseId: phase-04
dayNumber: 32
date: "2026-11-01"
title: 소유권 — 값의 주인은 하나, 옮기거나 복사하거나
summary: Rust가 메모리를 자동으로, 그러면서도 가비지 컬렉터 없이 정리하는 방법인 소유권 규칙을 배웁니다. 모든 값에는 주인(소유자)이 하나뿐이고, 대입과 함수 호출은 소유권을 옮기며(move), 주인이 범위를 벗어나면 값이 정리된다(drop)는 세 규칙을 Drop으로 정리 순서를 출력하며 확인합니다. 정수·bool·char처럼 복사가 싼 Copy 자료형, 복사본을 명시적으로 만드는 clone, 넘겼다가 돌려받기와 빌리기를 비교하고, C에서 사람이 '누가 free하는가'를 약속해야 하는 방식, Python이 참조 수를 세어 정리하는 방식과 나란히 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-31-alias-copy]
learningObjectives:
  - Rust 소유권의 세 규칙(주인은 하나, 이동, 범위를 벗어나면 정리)을 설명한다.
  - 대입, 함수 인자, 반환값에서 소유권이 어떻게 움직이는지 추적하고 E0382 오류를 고친다.
  - Copy 자료형과 이동하는 자료형(String, Vec)을 구별한다.
  - clone으로 복사본을 만드는 경우와, 빌림(&)으로 충분한 경우를 고른다.
  - C의 수동 해제 약속과 Python의 참조 세기를 Rust의 소유권과 비교한다.
concepts:
  [
    ownership,
    move,
    drop,
    scope,
    copy trait,
    clone,
    borrow,
    heap,
    stack,
    free,
    reference counting,
    double free,
  ]
runnerMode: python
playgroundSource: |
  # 파일: refcount.py — 마지막 이름이 사라질 때 정리되는 것을 확인해 보세요.
  class Noisy:
      def __init__(self, name):
          self.name = name
      def __del__(self):
          print(self.name, "정리됨")

  a = Noisy("상자")
  b = a
  del a
  print("a를 지웠지만 b가 아직 가리킴")
  del b
  print("끝")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day32-predict-rs
    title: Copy와 clone 예측하기
    kind: predict
    objective: 정수는 복사되고, String은 clone으로 복사본을 만들어야 둘 다 쓸 수 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let a = 7;
          let b = a;
          let s = String::from("hi");
          let t = s.clone();
          println!("{a} {b} {s} {t}");
      }
    answer: "7 7 hi hi"
    hint: "i32는 Copy라서 let b = a;가 복사입니다. String은 clone()으로 따로 된 복사본을 만들었습니다."
    explanation: "a와 b, s와 t가 모두 살아 있어서 컴파일되고 모두 출력됩니다. clone 없이 let t = s;라고 썼다면 s가 옮겨 가서 println!의 {s}에서 E0382 오류가 났을 것입니다."
    commonMistakes:
      - "let b = a;에서도 a가 옮겨 간다고 생각함"
      - "clone이 s를 옮긴다고 생각함"
    language: rust
    verification: run
  - id: ex-day32-predict-py
    title: 이름을 지워도 남는 객체 예측하기
    kind: predict
    objective: Python에서 객체는 가리키는 이름이 모두 사라질 때 정리된다는 것을 확인한다.
    prompt: 출력되는 값을 적으세요.
    starter: |-
      x = [1]
      y = x
      del x
      print(y)
    answer: "[1]"
    hint: "del x는 이름표 x를 뗄 뿐, 리스트를 지우지 않습니다. y가 아직 가리키고 있습니다."
    explanation: "Python은 객체를 가리키는 이름(참조)의 수를 세어, 0이 되면 정리합니다. del은 이름을 없애는 문장이지 객체를 없애는 명령이 아닙니다. Rust에서는 값의 주인이 하나뿐이라 '누가 정리하는지'가 컴파일할 때 정해집니다."
    commonMistakes:
      - "del x가 리스트를 지워 y도 사라진다고 생각함"
      - "NameError가 난다고 생각함(x를 쓰지 않으므로 오류가 없음)"
    language: python
    verification: run
  - id: ex-day32-fill
    title: 옮기지 않고 빌리는 매개변수 채우기
    kind: fill
    objective: 함수가 읽기만 한다면 소유권 대신 빌림을 받는다.
    prompt: "빈칸에 매개변수 자료형을 채워, shout를 부른 뒤에도 word를 쓸 수 있게 하세요. 'hello HELLO'가 출력되어야 합니다."
    starter: |-
      fn shout(s: _____) -> String {
          s.to_uppercase()
      }

      fn main() {
          let word = String::from("hello");
          let loud = shout(&word);
          println!("{word} {loud}");
      }
    answer: |-
      fn shout(s: &str) -> String {
          s.to_uppercase()
      }

      fn main() {
          let word = String::from("hello");
          let loud = shout(&word);
          println!("{word} {loud}");
      }
    output: "hello HELLO"
    hint: "문자열을 빌려서 읽기만 하는 자료형입니다. &String도 되지만 더 넓게 받는 쪽이 좋습니다."
    explanation: '&str로 받으면 String을 빌려 줄 수도(&word), 문자열 리터럴("hi")을 넘길 수도 있습니다. shout는 새 String을 만들어 돌려주고, word의 소유권은 main에 그대로 있습니다. String으로 받으면 word가 옮겨 가 뒤에서 쓸 수 없습니다.'
    commonMistakes:
      - "String으로 받아 E0308(expected String, found &String) 오류가 남"
      - "&mut str을 써서 불필요하게 가변 빌림을 요구함"
    language: rust
    verification: run
  - id: ex-day32-modify
    title: 원본을 바꾸지 않는 함수로 바꾸기
    kind: modify
    objective: 받은 목록을 바꾸는 대신 새 목록을 만들어 돌려준다.
    prompt: "add_bonus가 원본 리스트를 바꿔서 두 값이 모두 [75, 85]로 출력됩니다. 원본은 그대로 두고 새 리스트를 돌려주도록 고쳐 '[70, 80] [75, 85]'가 나오게 하세요."
    starter: |-
      def add_bonus(xs):
          for i in range(len(xs)):
              xs[i] += 5
          return xs


      original = [70, 80]
      result = add_bonus(original)
      print(original, result)
    answer: |-
      def add_bonus(xs):
          return [x + 5 for x in xs]


      original = [70, 80]
      result = add_bonus(original)
      print(original, result)
    output: "[70, 80] [75, 85]"
    hint: "받은 리스트의 칸을 바꾸지 말고, 컴프리헨션으로 새 리스트를 만드세요."
    explanation: "Python에는 소유권이 없어서 함수가 받은 리스트를 바꾸면 부른 쪽도 바뀝니다. '받은 것은 바꾸지 않고 새것을 돌려준다'는 약속을 지키면, 원본이 필요한 곳과 결과가 필요한 곳이 서로 간섭하지 않습니다. Rust라면 &[i32]로 빌려 받아 새 Vec을 돌려주는 모양입니다."
    commonMistakes:
      - "xs = xs.copy()를 함수 첫 줄에 추가하는 것도 되지만, 이유를 모르고 씀"
      - "return 문만 지워 None이 출력됨"
    language: python
    verification: run
  - id: ex-day32-debug
    title: 옮긴 뒤 다시 쓰는 오류 고치기
    kind: debug
    objective: 함수에 소유권을 넘긴 값을 뒤에서 쓰는 오류를 빌림으로 고친다.
    prompt: "이 코드는 E0382(borrow of moved value: `name`) 오류로 컴파일되지 않습니다. greet가 이름을 빌리기만 하도록 고쳐, 인사 뒤에 이름이 한 번 더 출력되게 하세요."
    starter: |-
      fn greet(name: String) {
          println!("안녕, {name}");
      }

      fn main() {
          let name = String::from("민지");
          greet(name);
          println!("{name}");
      }
    answer: |-
      fn greet(name: &str) {
          println!("안녕, {name}");
      }

      fn main() {
          let name = String::from("민지");
          greet(&name);
          println!("{name}");
      }
    output: |-
      안녕, 민지
      민지
    hint: "greet(name)은 name의 소유권을 greet에게 넘기고, greet가 끝나면 그 문자열은 정리됩니다."
    explanation: "함수가 값을 가져갈 필요가 없다면 빌림(&str)으로 받으세요. 부르는 쪽도 greet(&name)으로 '빌려준다'고 적습니다. greet(name.clone())으로 고쳐도 동작하지만, 쓸데없는 복사를 만듭니다."
    commonMistakes:
      - "매개변수만 &str로 바꾸고 부르는 곳의 &를 빠뜨림"
      - "clone으로 모든 소유권 오류를 해결하는 습관을 들임"
    language: rust
    verification: run
  - id: ex-day32-independent
    title: 넘겼다가 돌려받는 함수 이어 쓰기
    kind: independent
    objective: 소유권을 받아 바꾼 뒤 돌려주는 함수를 사슬처럼 이어 부른다.
    prompt: 'fn add_suffix(s: String, suffix: &str) -> String을 만들어 "데이터"에 ".txt"와 ".bak"을 차례로 붙이고 ''데이터.txt.bak''을 출력하세요.'
    starter: |-
      fn main() {
          let name = String::from("데이터");
          println!("{name}");
      }
    answer: |-
      fn add_suffix(mut s: String, suffix: &str) -> String {
          s.push_str(suffix);
          s
      }

      fn main() {
          let name = String::from("데이터");
          let name = add_suffix(name, ".txt");
          let name = add_suffix(name, ".bak");
          println!("{name}");
      }
    output: "데이터.txt.bak"
    hint: "받은 String을 mut로 받아 push_str로 붙이고, 그대로 돌려주면 복사 없이 같은 문자열 공간을 계속 씁니다."
    explanation: "소유권을 받아서 바꾼 뒤 돌려주면 새 문자열을 만들지 않고 같은 메모리를 이어 씁니다. let name = add_suffix(name, ...);처럼 섀도잉으로 받으면 옛 이름을 실수로 쓸 일도 없습니다. &mut String을 받아 제자리에서 바꾸는 방법도 있습니다."
    commonMistakes:
      - "s를 mut 없이 받아 push_str에서 E0596 오류가 남"
      - "돌려받지 않고 add_suffix(name, ...)만 불러 결과를 잃음"
    language: rust
    verification: run
quiz:
  - id: quiz-day32-01
    question: Rust 소유권의 세 규칙에 해당하지 않는 것은?
    choices:
      - 모든 값에는 주인이 하나 있다
      - 주인은 한 번에 하나뿐이다
      - 주인이 범위를 벗어나면 값이 정리된다
      - 가비지 컬렉터가 가끔 돌며 쓰지 않는 값을 찾는다
    answerIndex: 3
    explanation: Rust에는 가비지 컬렉터가 없습니다. 주인이 범위를 벗어나는 순간 컴파일러가 넣어 둔 정리 코드(drop)가 실행됩니다. 그래서 정리 시점이 정확히 정해지고 실행 중에 멈추는 일이 없습니다.
  - id: quiz-day32-02
    question: let s = String::from("a"); let t = s; 뒤에 println!("{s}")를 쓰면?
    choices:
      - a가 출력된다
      - 컴파일 오류(E0382, borrow of moved value)
      - 빈 문자열이 출력된다
      - 실행 중 패닉
    answerIndex: 1
    explanation: String의 대입은 소유권 이동이라 s는 더 이상 주인이 아닙니다. 둘 다 쓰려면 let t = s.clone();, t가 보기만 하면 let t = &s;를 씁니다.
  - id: quiz-day32-03
    question: 다음 중 Copy 자료형(대입하면 복사되는 것)이 아닌 것은?
    choices: ["i32", "bool", "(u8, char)", "Vec<i32>"]
    answerIndex: 3
    explanation: 크기가 작고 힙 메모리를 가지지 않는 값(정수, 실수, bool, char, 그런 값들만 든 튜플·배열)은 Copy라 대입하면 복사됩니다. Vec, String처럼 힙 메모리를 소유하는 값은 이동합니다.
  - id: quiz-day32-04
    question: C에서 malloc으로 받은 메모리를 두 번 free하면?
    choices:
      - 두 번째는 무시된다
      - 정의되지 않은 동작(이중 해제)으로 프로그램이 망가질 수 있다
      - 컴파일 오류
      - 메모리가 두 배로 돌아온다
    answerIndex: 1
    explanation: C에서는 '누가 free할지'를 사람이 약속하고 지켜야 합니다. 두 포인터가 같은 메모리를 가리킬 때 둘 다 free하면 이중 해제, 아무도 free하지 않으면 메모리 누수입니다. Rust의 '주인은 하나' 규칙은 이 두 문제를 컴파일할 때 막습니다.
  - id: quiz-day32-05
    question: Python이 객체를 정리하는 방식에 가장 가까운 것은?
    choices:
      - 프로그래머가 free를 부른다
      - 객체를 가리키는 참조의 수를 세어 0이 되면 정리한다(순환 참조는 따로 수거)
      - 프로그램이 끝날 때만 정리한다
      - 주인이 범위를 벗어나면 컴파일러가 넣은 코드로 정리한다
    answerIndex: 1
    explanation: CPython은 참조 세기를 기본으로 쓰고, 서로를 가리키는 순환 구조는 가끔 도는 순환 수집기가 정리합니다. 편리하지만 참조 수를 세는 비용과, 정리 시점이 코드에서 잘 보이지 않는다는 특징이 있습니다.
---

## 1. 오늘 배울 내용

프로그램이 쓰는 메모리는 언젠가 **돌려줘야** 합니다. 돌려주지 않으면 메모리가 새고(누수), 두 번 돌려주거나 돌려준 뒤에 쓰면 프로그램이 망가집니다. 세 언어는 이 문제를 서로 다르게 풉니다.

- **C**: 프로그래머가 `malloc`으로 빌리고 `free`로 돌려줍니다. 누가 돌려줄지는 **사람의 약속**입니다.
- **Python**: 객체를 가리키는 이름의 수를 세어, 아무도 가리키지 않으면 **자동으로** 정리합니다.
- **Rust**: **소유권** 규칙으로, 컴파일러가 정리할 시점을 **정확히** 정해 줍니다.

오늘 배울 내용은 다음과 같습니다.

1. 소유권의 세 규칙을 봅니다.
   - 주인은 하나
   - 대입과 함수 호출은 소유권을 **이동**
   - 주인이 범위를 벗어나면 **정리**
2. `Drop`으로 값이 정리되는 **순서**를 직접 출력해 봅니다.
3. 복사가 싼 **Copy 자료형**과, 복사본을 명시적으로 만드는 **`clone`** 을 구별합니다.
4. 함수에 소유권을 **넘기기**, **넘겼다가 돌려받기**, **빌리기**를 비교합니다.
5. C의 "누가 `free`하나" 약속, Python의 참조 세기와 나란히 봅니다.

## 2. 왜 필요한가

메모리 관리 실수는 오래된 소프트웨어 버그와 보안 사고의 큰 부분을 차지합니다.

| 실수                         | 무슨 일이 생기나                                 |
| ---------------------------- | ------------------------------------------------ |
| 돌려주지 않음(누수)          | 오래 돌수록 메모리를 계속 먹다가 느려지거나 멈춤 |
| 두 번 돌려줌(이중 해제)      | 메모리 관리 구조가 깨져 엉뚱한 곳이 망가짐       |
| 돌려준 뒤에 씀(해제 후 사용) | 다른 데이터가 들어온 자리를 읽거나 덮어씀        |

Python 같은 언어는 가비지 컬렉터(자동 정리기)로 이 문제를 풀지만, 정리하는 데 시간이 들고 시점을 정확히 알 수 없습니다. Rust는 "값의 주인은 하나"라는 규칙을 **컴파일할 때** 검사해서, 자동 정리의 편리함과 C의 속도를 함께 얻습니다. 대신 프로그래머는 "지금 이 값의 주인은 누구인가"를 생각하며 코드를 써야 합니다.

## 3. 그림으로 이해하기

`String`은 두 부분으로 되어 있습니다. 스택에 있는 작은 "관리 정보"(위치, 길이, 용량)와, 힙에 있는 실제 글자들입니다.

```text
let a = String::from("hello");

 스택                          힙
┌─────────────────────┐       ┌───┬───┬───┬───┬───┐
│ a: 위치 ─────────────┼─────▶ │ h │ e │ l │ l │ o │
│    길이 5, 용량 5    │       └───┴───┴───┴───┴───┘
└─────────────────────┘
```

**이동**(`let b = a;`)은 관리 정보만 옮기고, `a`를 "더 이상 쓸 수 없음"으로 표시합니다. 글자들은 복사하지 않습니다.

```text
let b = a;
┌──────────────────┐
│ a: (옮겨 감, 사용 불가) │
├──────────────────┤          ┌─────────────────┐
│ b: 위치 ──────────┼────────▶ │ h e l l o       │   주인은 b 하나
└──────────────────┘          └─────────────────┘
```

만약 `a`와 `b`가 둘 다 주인이라면, 범위가 끝날 때 **같은 글자들을 두 번 정리**하게 됩니다(이중 해제). 이동 규칙이 이것을 막습니다.

**clone**(`let c = b.clone();`)은 힙의 글자들까지 새로 만듭니다. 주인이 각자 하나씩입니다.

```text
b ──▶ [h e l l o]
c ──▶ [h e l l o]   (새로 만든 복사본)
```

**정리 순서**: 한 범위에서 만든 값들은 범위가 끝날 때 **만든 순서의 반대로** 정리됩니다. 나중에 만든 값이 앞의 값을 빌리고 있을 수 있기 때문입니다.

## 4. 천천히 풀어보기

### 4.1 소유권의 세 규칙

1. 모든 값에는 **주인(소유자)** 인 변수가 있다.
2. 주인은 한 번에 **하나뿐**이다.
3. 주인이 **범위를 벗어나면** 값이 정리(drop)된다.

### 4.2 소유권이 움직이는 곳

| 코드                           | 소유권                                       |
| ------------------------------ | -------------------------------------------- |
| `let b = a;`                   | `a` → `b`로 이동. `a`는 사용 불가            |
| `f(a)` (`fn f(s: String)`)     | `a` → 매개변수 `s`로 이동. `f`가 끝나면 정리 |
| `let d = f(...)` (`-> String`) | 함수 안의 값 → `d`로 이동(돌려받기)          |
| `v.push(a)`                    | `a` → Vec 안으로 이동                        |
| `let x = v.pop()`              | Vec 안의 값 → `x`로 이동(복사 없음)          |
| `for x in v`                   | `v` 전체가 반복으로 이동, 칸 하나씩 `x`로    |
| `f(&a)`, `for x in &v`         | **이동 없음**. 빌려줄 뿐, 주인은 그대로      |

### 4.3 Copy와 clone

| 구분      | 대상                                                    | `let b = a;` 뒤의 `a`           |
| --------- | ------------------------------------------------------- | ------------------------------- |
| Copy      | `i32`, `f64`, `bool`, `char`, `&T`, Copy만 든 튜플·배열 | 그대로 쓸 수 있음(복사)         |
| 이동      | `String`, `Vec<T>`, `Box<T>`처럼 힙 메모리를 가진 것    | 사용 불가                       |
| `clone()` | 대부분의 자료형                                         | 새 복사본을 **명시적으로** 만듦 |

Copy 자료형은 복사가 아주 싸서(몇 바이트 복사) 자동으로 복사됩니다. `String`이나 `Vec`의 복사는 힙 메모리를 새로 할당하고 내용을 모두 옮겨야 해서 비쌉니다. 그래서 Rust는 비싼 복사를 **`clone()`이라고 적어야만** 하게 만들었습니다.

### 4.4 함수와 소유권: 세 가지 방법

```text
fn take(s: String)            소유권을 가져감. 부른 쪽은 더 못 씀. 함수 끝에서 정리
fn take_and_give_back(s: String) -> String   가져갔다가 돌려줌. 부른 쪽이 다시 받아야 함
fn borrow(s: &str)            빌리기만 함. 부른 쪽이 계속 주인
```

대부분의 함수는 **빌리기**가 알맞습니다. 값을 저장해 두거나(Vec에 넣기) 다른 것으로 바꿔 돌려줘야 할 때 소유권을 받습니다.

### 4.5 C와 Python에서는

- **C**: `malloc`으로 받은 메모리는 누군가 **정확히 한 번** `free`해야 합니다. 함수가 `malloc`한 메모리를 돌려준다면 "부른 쪽이 `free`해야 한다"를 **주석이나 문서로** 약속합니다. 포인터를 복사하면 주인이 여럿처럼 보이지만, `free`는 한 번만 해야 합니다. 컴파일러는 이 약속을 검사하지 않습니다.
- **Python**: 객체마다 "나를 가리키는 이름의 수"(참조 수)를 셉니다. 대입하면 늘고, 이름이 사라지면(`del`, 함수 끝) 줄어들며, 0이 되면 정리합니다. 주인이라는 개념 없이 여럿이 함께 가리킬 수 있어 편리하지만, 서로를 가리키는 순환 구조는 따로 수거해야 하고 정리 시점이 코드에 드러나지 않습니다.

## 5. Rust로 구현하기

```rust
// 파일: ownership.rs
struct Noisy(&'static str);

impl Drop for Noisy {                       // 값이 정리될 때 실행된다
    fn drop(&mut self) {
        println!("  {} 정리됨", self.0);
    }
}

fn take(s: String) -> usize {               // 소유권을 받아 가고, 끝나면 s를 정리한다
    s.len()
}

fn take_and_give_back(mut s: String) -> String {
    s.push('!');
    s                                       // 소유권을 다시 돌려준다
}

fn borrow_len(s: &str) -> usize {           // 빌리기만 한다
    s.len()
}

fn main() {
    let a = String::from("hello");
    let b = a;                              // 이동: 이제 소유자는 b
    println!("b = {b}");
    let c = b.clone();                      // 복사본을 새로 만든다
    println!("b = {b}, c = {c}");
    let n = take(c);                        // c는 함수로 이동하고 거기서 정리된다
    println!("take가 돌려준 길이 {n}");
    let d = take_and_give_back(b);          // 넘겼다가 돌려받기
    println!("d = {d}");
    println!("빌려서 길이만: {} (d는 그대로 {d})", borrow_len(&d));

    let x = 5;
    let y = x;                              // 정수는 Copy: 복사된다
    let t = (1, 'a');
    let u = t;                              // Copy인 값들의 튜플도 Copy
    let arr = [1, 2, 3];
    let arr2 = arr;
    println!("x = {x}, y = {y}, {t:?} {u:?}, {arr:?} {arr2:?}");

    println!("블록 시작");
    {
        let _first = Noisy("첫째");
        let _second = Noisy("둘째");
        println!("  블록 끝나기 직전");
    }                                       // 만든 순서의 반대로 정리된다
    println!("블록 뒤");

    let moved = Noisy("옮긴 값");
    let owner = moved;                      // 소유자가 바뀌어도 정리는 한 번뿐
    drop(owner);                            // 범위 끝을 기다리지 않고 지금 정리
    println!("main 끝");
}
```

실행 결과:

```text
b = hello
b = hello, c = hello
take가 돌려준 길이 5
d = hello!
빌려서 길이만: 6 (d는 그대로 hello!)
x = 5, y = 5, (1, 'a') (1, 'a'), [1, 2, 3] [1, 2, 3]
블록 시작
  블록 끝나기 직전
  둘째 정리됨
  첫째 정리됨
블록 뒤
  옮긴 값 정리됨
main 끝
```

### 코드 한 부분씩 읽기

| 코드                                          | 설명                                                                                                                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `struct Noisy(&'static str);` / `impl Drop`   | 정리될 때 메시지를 출력하는 작은 자료형입니다. `Drop`은 "정리될 때 할 일"을 정하는 트레이트입니다(Day 54). 보통은 직접 만들 일이 없고, `String`·`Vec`의 `Drop`이 힙 메모리를 돌려줍니다. |
| `let b = a;`                                  | 이동입니다. 이 뒤로 `a`를 쓰면 E0382 오류입니다.                                                                                                                                         |
| `let c = b.clone();`                          | 글자들까지 새로 만든 복사본입니다. `b`와 `c` 둘 다 쓸 수 있습니다.                                                                                                                       |
| `take(c)`                                     | `c`의 소유권이 `take`의 `s`로 옮겨 가고, `take`가 끝날 때 그 문자열이 정리됩니다. 돌려받은 것은 길이(Copy인 `usize`)뿐입니다.                                                            |
| `let d = take_and_give_back(b);`              | 소유권을 넘겼다가 바뀐 문자열을 돌려받습니다. 글자들은 복사되지 않고 같은 힙 공간을 씁니다.                                                                                              |
| `borrow_len(&d)`                              | 빌려주기만 해서 `d`는 계속 주인입니다.                                                                                                                                                   |
| `let y = x;`, `let u = t;`, `let arr2 = arr;` | Copy 자료형이라 복사되고, 원래 이름도 계속 쓸 수 있습니다.                                                                                                                               |
| 블록 끝의 `둘째 정리됨` → `첫째 정리됨`       | 만든 순서의 반대로 정리됩니다.                                                                                                                                                           |
| `let owner = moved; drop(owner);`             | 주인이 `moved`에서 `owner`로 바뀌어도 정리는 **한 번**입니다. `drop`은 값을 가져가 바로 정리하는 함수입니다. `main` 끝에서 다시 정리되지 않습니다.                                       |

## 6. C로 구현하기

C에는 소유권 개념이 문법에 없습니다. 대신 **"이 메모리의 주인은 누구이고, 누가 `free`하는가"** 를 사람이 약속하고 지켜야 합니다. `malloc`과 `free`는 Day 40에서 자세히 배우니, 오늘은 소유권의 관점으로만 보세요.

```c
// 파일: ownership.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 약속(주석으로만!): 돌려준 문자열은 부른 쪽이 free해야 한다
char *make_greeting(const char *name) {
    const char *prefix = "안녕, ";
    char *s = malloc(strlen(prefix) + strlen(name) + 1);   // 끝 표시 '\0' 자리까지
    if (s == NULL) {
        return NULL;
    }
    strcpy(s, prefix);
    strcat(s, name);
    return s;
}

int main(void) {
    char *greeting = make_greeting("민지");
    if (greeting == NULL) {
        return 1;
    }
    printf("%s\n", greeting);

    char *alias = greeting;                 // 복사된 것은 주소뿐. 주인은 여전히 하나
    printf("alias도 같은 곳을 가리키나? %d\n", alias == greeting);
    free(greeting);                         // 주인이 딱 한 번 정리한다
    greeting = NULL;                        // 사라진 곳을 가리키지 않게
    alias = NULL;

    char *original = malloc(6);
    if (original == NULL) {
        return 1;
    }
    strcpy(original, "hello");
    char *clone = malloc(strlen(original) + 1);   // 내용까지 새로 만들기 = clone
    if (clone == NULL) {
        free(original);
        return 1;
    }
    strcpy(clone, original);
    clone[0] = 'j';
    printf("original = %s, clone = %s\n", original, clone);
    free(original);                         // 각자 자기 것을 정리
    free(clone);

    int x = 5;
    int y = x;                              // 정수는 그냥 복사
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

실행 결과:

```text
안녕, 민지
alias도 같은 곳을 가리키나? 1
original = hello, clone = jello
x = 5, y = 5
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `// 약속: 돌려준 문자열은 부른 쪽이 free해야 한다`    | C의 소유권 규칙은 **주석**입니다. 컴파일러는 이 약속을 모르므로, 지키지 않아도 아무 오류가 없습니다.                                                      |
| `malloc(strlen(prefix) + strlen(name) + 1)`           | 힙에서 글자 수만큼(끝 표시 `'\0'` 한 칸 포함) 메모리를 빌립니다. 실패하면 `NULL`입니다.                                                                   |
| `char *alias = greeting;`                             | 포인터를 복사해도 메모리는 하나입니다. Rust라면 "이동"이나 "빌림"으로 구별되었을 관계가, C에서는 둘 다 그냥 포인터입니다.                                 |
| `free(greeting); greeting = NULL; alias = NULL;`      | 주인이 **딱 한 번** 돌려주고, 돌려준 곳을 가리키는 포인터는 모두 `NULL`로 만들어 해제 후 사용을 막습니다. `alias`를 잊으면 그것이 댕글링 포인터가 됩니다. |
| `char *clone = malloc(...); strcpy(clone, original);` | Rust의 `clone`에 해당합니다. 새 메모리를 빌리고 내용을 옮깁니다. 이제 주인이 각자 하나씩이고, 각자 `free`해야 합니다.                                     |

## 7. Python으로 구현하기

Python에는 소유권이 없고, 모든 이름이 객체를 **함께** 가리킬 수 있습니다. 정리는 참조 수가 0이 될 때 일어납니다. `__del__`은 객체가 정리될 때 불리는 특별한 메서드입니다(클래스는 Day 51).

```python
# 파일: ownership.py
class Noisy:
    def __init__(self, name):
        self.name = name

    def __del__(self):                      # 객체가 정리될 때 실행된다(CPython)
        print(f"  {self.name} 정리됨")


a = "hello"
b = a                                       # 이름이 둘, 객체는 하나
print(a, b, a is b)

print("함수 시작")


def scope():
    first = Noisy("첫째")
    second = Noisy("둘째")
    print("  함수 끝나기 직전", first.name, second.name)


scope()                                     # 함수가 끝나면 지역 이름이 사라진다
print("함수 뒤")

x = Noisy("공유된 값")
y = x                                       # 가리키는 이름이 둘
del x                                       # 이름 하나를 지워도 아직 y가 있다
print("del x 뒤")
del y                                       # 마지막 이름이 사라지면 정리된다
print("del y 뒤")
```

실행 결과:

```text
hello hello True
함수 시작
  함수 끝나기 직전 첫째 둘째
  첫째 정리됨
  둘째 정리됨
함수 뒤
del x 뒤
  공유된 값 정리됨
del y 뒤
```

### 코드 한 부분씩 읽기

| 코드                     | 설명                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `b = a`                  | 이동도 복사도 아니라 이름이 하나 더 생겼습니다. 두 이름 모두 계속 쓸 수 있습니다.                                                                                 |
| `scope()`의 두 지역 객체 | 함수가 끝나면 지역 이름이 사라져 참조 수가 0이 되고 정리됩니다. 이 실행에서는 만든 순서대로 정리되었는데, Rust와 달리 **순서가 언어 규칙으로 보장되지 않습니다**. |
| `del x`                  | 이름 `x`만 사라집니다. `y`가 아직 가리키므로 객체는 살아 있습니다.                                                                                                |
| `del y`                  | 마지막 이름이 사라져 참조 수가 0이 되자 곧바로 정리되었습니다. CPython의 동작이며, 다른 Python 구현(PyPy)은 더 나중에 정리할 수 있습니다.                         |

## 8. 실행 추적

Rust 코드의 앞부분에서 각 줄 뒤에 **누가 주인인지** 따라갑니다.

| 줄                               | "hello" 문자열의 주인 | 복사본의 주인          | 쓸 수 없게 된 이름 |
| -------------------------------- | --------------------- | ---------------------- | ------------------ |
| `let a = String::from("hello");` | `a`                   |                        |                    |
| `let b = a;`                     | `b`                   |                        | `a`                |
| `let c = b.clone();`             | `b`                   | `c`                    | `a`                |
| `let n = take(c);`               | `b`                   | (`take` 안에서 정리됨) | `a`, `c`           |
| `let d = take_and_give_back(b);` | `d`(`"hello!"`)       |                        | `a`, `b`, `c`      |
| `borrow_len(&d)`                 | `d`(빌려줌)           |                        | `a`, `b`, `c`      |

글자 `"hello"`를 담은 힙 메모리는 `a` → `b` → (함수) → `d`로 **주인만 바뀌며** 한 번도 복사되지 않았습니다. 복사된 것은 `clone`을 적은 한 번뿐입니다.

## 9. 다른 예제로 다시 이해하기

**창고에서 트럭으로.** 창고(`Vec<String>`)에서 물건을 꺼내(`pop`) 트럭에 싣습니다(`push`). 물건의 **소유권이 옮겨 갈 뿐, 문자열은 복사되지 않습니다**. 물건을 보여 주기만 하는 함수는 빌려서 받습니다.

```rust
// 파일: warehouse.rs
fn describe(label: &str, items: &[String]) {   // 빌려서 보기만 한다
    println!("{label}: {items:?} ({}개)", items.len());
}

fn main() {
    let mut warehouse: Vec<String> = ["사과", "배", "감", "귤"]
        .iter()
        .map(|s| s.to_string())
        .collect();
    let mut truck: Vec<String> = Vec::new();

    while truck.len() < 3 {
        match warehouse.pop() {             // 창고에서 소유권을 꺼낸다(복사 없음)
            Some(item) => truck.push(item), // 그 소유권을 트럭으로 옮긴다
            None => break,
        }
    }
    describe("창고", &warehouse);
    describe("트럭", &truck);

    let labels: Vec<String> = truck.iter().map(|item| format!("[{item}]")).collect();
    println!("라벨: {}", labels.join(" "));

    for item in truck {                     // for가 트럭의 소유권을 가져가 하나씩 넘긴다
        println!("배달 완료: {item}");
    }                                       // 여기서 truck은 더 쓸 수 없다
    describe("남은 창고", &warehouse);
}
```

실행 결과:

```text
창고: ["사과"] (1개)
트럭: ["귤", "감", "배"] (3개)
라벨: [귤] [감] [배]
배달 완료: 귤
배달 완료: 감
배달 완료: 배
남은 창고: ["사과"] (1개)
```

| 코드                                         | 설명                                                                                                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn describe(label: &str, items: &[String])` | 목록을 빌려서 보기만 하므로 부른 뒤에도 창고와 트럭을 계속 쓸 수 있습니다.                                                                                  |
| `warehouse.pop()` → `Some(item)`             | 창고의 마지막 물건의 소유권을 꺼냅니다. `truck.push(item)`이 그 소유권을 트럭으로 옮깁니다.                                                                 |
| `truck.iter().map(...)`                      | `iter`로 빌려서 라벨 문자열을 새로 만듭니다. 트럭은 그대로입니다.                                                                                           |
| `for item in truck`                          | `for`가 트럭 전체의 소유권을 가져가 물건 하나씩 `item`으로 넘겨줍니다. 반복이 끝나면 트럭은 더 이상 쓸 수 없습니다. 계속 쓰려면 `&truck`으로 돌아야 합니다. |

같은 흐름을 Python으로 쓰면 소유권 없이 참조만 옮겨집니다.

```python
# 파일: warehouse.py
warehouse = ["사과", "배", "감", "귤"]
truck = []
while len(truck) < 3 and warehouse:
    truck.append(warehouse.pop())           # 꺼낸 객체를 트럭 목록이 가리킨다
print("창고:", warehouse, f"({len(warehouse)}개)")
print("트럭:", truck, f"({len(truck)}개)")
print("라벨:", " ".join(f"[{item}]" for item in truck))
for item in truck:
    print("배달 완료:", item)
print("반복 뒤에도 truck은 그대로:", truck)
```

실행 결과:

```text
창고: ['사과'] (1개)
트럭: ['귤', '감', '배'] (3개)
라벨: [귤] [감] [배]
배달 완료: 귤
배달 완료: 감
배달 완료: 배
반복 뒤에도 truck은 그대로: ['귤', '감', '배']
```

Python의 `pop`과 `append`도 문자열을 복사하지 않고 참조만 옮깁니다. 다른 점은 반복이 끝난 뒤에도 `truck`을 쓸 수 있다는 것입니다. Python의 `for`는 목록을 빌려서 돌기 때문입니다. Rust에서 같은 동작을 원하면 `for item in &truck`이라고 **빌림을 명시**합니다.

## 10. 소유권 다루기 한눈에 보기

| 하고 싶은 일           | Rust                          | C                                     | Python                        |
| ---------------------- | ----------------------------- | ------------------------------------- | ----------------------------- |
| 값을 넘겨주고 더 안 씀 | `f(value)` (이동)             | 포인터를 넘기고 "이제 네가 free" 약속 | (구별 없음)                   |
| 보기만 하게 빌려주기   | `f(&value)`                   | `const T *`                           | 그냥 넘김(바꾸지 않기로 약속) |
| 바꾸게 빌려주기        | `f(&mut value)`               | `T *`                                 | 그냥 넘김                     |
| 복사본 만들기          | `value.clone()`               | `malloc` + 내용 복사                  | `copy`, `deepcopy`            |
| 지금 바로 정리         | `drop(value)`                 | `free(p); p = NULL;`                  | `del` (마지막 참조일 때만)    |
| 정리 시점              | 주인의 범위 끝(정확히 정해짐) | `free`를 부른 때                      | 참조 수가 0이 된 때           |

## 11. 세 언어 비교

| 관점                    | Rust 소유권                          | C 수동 관리        | Python 참조 세기                  |
| ----------------------- | ------------------------------------ | ------------------ | --------------------------------- |
| 누가 정리하나           | 컴파일러가 넣은 코드(주인의 범위 끝) | 프로그래머(`free`) | 실행 환경(참조 수 0, 순환 수집기) |
| 누수                    | 거의 없음                            | 흔함(`free` 누락)  | 드묾(순환 참조 주의)              |
| 이중 해제·해제 후 사용  | 컴파일 오류                          | 정의되지 않은 동작 | 발생하지 않음                     |
| 실행 비용               | 없음(컴파일할 때 검사)               | 없음               | 참조 수 증감, 가끔 수집기 실행    |
| 여러 곳이 함께 가리키기 | 빌림 또는 `Rc`로 명시                | 자유(위험)         | 자유(기본)                        |

## 12. 자주 하는 실수

### 실수 1: 옮긴 값을 다시 쓴다 (Rust)

실습의 디버그 문제입니다. `E0382: borrow of moved value`를 보면 "이 값의 주인이 어디로 갔지?"를 찾으세요. 함수가 가져갈 필요가 없다면 빌림으로 바꾸고, 정말 두 개가 필요하면 `clone`을 씁니다.

### 실수 2: 반복에서 Vec을 옮겨 버린다 (Rust)

```rust
// 파일: for_moves.rs (컴파일 오류: E0382)
fn main() {
    let names = vec![String::from("민지"), String::from("준호")];
    for name in names {
        println!("{name}");
    }
    println!("{}", names.len());
}
```

`for name in names`는 `names`의 소유권을 가져갑니다. 반복 뒤에도 쓰려면 `for name in &names`로 빌려서 도세요.

### 실수 3: 무엇이든 clone으로 해결한다 (Rust)

`clone()`을 넣으면 소유권 오류는 대부분 사라지지만, 쓸데없는 복사가 늘어 느려지고 "원본과 복사본이 따로 바뀌는" 버그를 만들 수 있습니다. 먼저 "빌려주면 되지 않나?"를 생각하세요.

### 실수 4: 같은 메모리를 두 번 free한다 (C)

```c
// 파일: double_free_guard.c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof *p);
    if (p == NULL) {
        return 1;
    }
    *p = 42;
    int *alias = p;
    printf("%d\n", *alias);
    free(p);
    p = NULL;                  // free한 뒤 NULL로: 다시 free(p)해도 아무 일 없음
    alias = NULL;              // alias도 잊지 말 것. 남겨 두면 free(alias)가 이중 해제
    free(p);                   // free(NULL)은 아무 일도 하지 않도록 정해져 있다
    printf("정리 완료\n");
    return 0;
}
```

실행 결과:

```text
42
정리 완료
```

`free`한 포인터를 `NULL`로 만들어 두면 실수로 다시 `free`해도 안전합니다(`free(NULL)`은 아무 일도 하지 않습니다). 하지만 **복사해 둔 다른 포인터**까지 챙겨야 한다는 점이 C 소유권 관리의 어려움입니다.

### 실수 5: del이 객체를 지운다고 생각한다 (Python)

`del x`는 이름 `x`만 없앱니다. 다른 이름이 가리키고 있으면 객체는 살아 있습니다(실습의 예측 문제). 큰 데이터를 빨리 정리하고 싶다면 그것을 가리키는 **모든** 이름(리스트 안의 칸 포함)을 없애야 합니다.

## 13. Q&A

**Q. 소유권 이동은 느리지 않나요?**

A. 이동은 스택의 관리 정보(`String`이라면 24바이트)만 옮기고 힙의 내용은 그대로 둡니다. 게다가 컴파일러가 대부분의 이동을 아예 없애 버립니다. 비싼 것은 `clone`이고, 그래서 `clone`만 명시하게 한 것입니다.

**Q. Rust에서 여러 주인이 필요하면요?**

A. 그래프의 노드나 여러 곳에서 공유하는 설정처럼 정말 주인이 여럿이어야 하면 `Rc<T>`(참조 세기, Python과 비슷)나 스레드 사이에서는 `Arc<T>`를 씁니다. Day 31에서 본 `Rc<RefCell<T>>`가 그 예입니다. 필요한 곳에서만 참조 세기 비용을 냅니다.

**Q. 함수가 매개변수로 String을 받아야 하나요, &str을 받아야 하나요?**

A. 읽기만 한다면 `&str`, 값을 저장하거나(구조체에 넣기, Vec에 넣기) 바꿔서 돌려줄 거라면 `String`입니다. 확신이 없으면 `&str`로 시작하세요. 부르는 쪽이 `String`이든 리터럴이든 넘길 수 있어 편합니다.

**Q. Python의 `__del__`로 파일을 닫으면 되나요?**

A. 정리 시점이 보장되지 않으므로 파일이나 네트워크 연결 같은 자원을 `__del__`에 맡기면 안 됩니다. `with` 문(Day 47)으로 "블록이 끝나면 반드시 닫는다"를 명시하세요. Rust의 `Drop`이 범위 끝에서 **정확히** 실행되는 것과 대비됩니다.

## 14. 핵심 요약

- Rust 소유권의 세 규칙: 모든 값에는 주인이 있고, 주인은 하나뿐이며, 주인이 범위를 벗어나면 값이 정리된다(`Drop`). 한 범위의 값은 만든 역순으로 정리됩니다.
- 대입, 함수 인자, `push`, `for x in v`는 소유권을 **이동**합니다. 옮긴 뒤 원래 이름을 쓰면 E0382입니다.
- Copy 자료형(정수, 실수, bool, char, Copy만 든 튜플·배열)은 자동으로 복사되고, `String`·`Vec`처럼 힙 메모리를 가진 값은 이동합니다. 복사가 필요하면 `clone()`을 **명시**합니다.
- 함수는 대부분 **빌려서**(`&T`, `&mut T`) 받고, 값을 저장하거나 바꿔 돌려줄 때만 소유권을 받습니다.
- C는 "누가 `free`하나"를 사람이 약속하고, 누수·이중 해제·해제 후 사용을 스스로 막아야 합니다.
- Python은 참조 수를 세어 0이 되면 정리합니다. `del`은 이름만 없애고, 정리 시점은 언어 규칙으로 보장되지 않습니다.

## 15. 도전 문제

1. **(Rust)** `fn longest_word(words: Vec<String>) -> String`을 만들어 가장 긴 단어를 **복사 없이** 돌려주세요(`into_iter`와 `max_by_key` 또는 반복문). 부른 뒤 원래 Vec을 쓰려 하면 어떤 오류가 나는지 확인하고, `&[String]`을 받아 `String`(clone) 또는 `&str`을 돌려주는 버전과 비교하세요.
2. **(C)** `char *join(const char *a, const char *b)`가 두 문자열을 이어 붙인 새 문자열을 `malloc`해 돌려주게 하고, 호출한 쪽에서 반드시 `free`하세요. 세 번 이어 붙일 때 중간 결과를 `free`하지 않으면 무엇이 새는지 설명하세요.
3. **(Python)** `Noisy` 클래스를 리스트에 세 개 담고, 리스트에서 하나를 `pop`해 다른 변수에 담은 뒤 리스트를 `del`하세요. 어떤 객체가 언제 정리되는지 예측하고 확인하세요.
4. **(세 언어)** "이름 목록을 받아 이름마다 `님`을 붙인 새 목록을 돌려주는 함수"를 만들되, 원본 목록은 그대로 쓸 수 있게 하세요. Rust는 `&[String]`을 받아 `Vec<String>`을 돌려주고, C는 새로 할당한 문자열 배열과 해제 함수를 함께 만드세요.
