---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-25-result-error
courseId: crp-92
phaseId: phase-02
dayNumber: 25
date: "2026-10-25"
title: 실패를 다루는 법 — Rust Result, C 오류 코드, Python 예외
summary: 입력 변환이나 0으로 나누기처럼 실패할 수 있는 작업을 세 언어가 어떻게 알리고 전달하는지 비교합니다. Rust의 Result(Ok와 Err)를 match로 처리하고, ? 연산자로 실패를 부른 쪽에 넘기며, unwrap·expect·unwrap_or의 차이와 위험을 익힙니다. C에서는 특별한 반환값(오류 코드)을 약속하고 손으로 위로 전달하며, Python에서는 raise로 예외를 일으키고 try/except/finally로 잡습니다. 나이로 입장료를 정하는 프로그램을 세 언어로 같은 출력이 나오게 만들고, 주문 줄 파서와 재입력 반복으로 연습합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-24-recursion]
learningObjectives:
  - 실패할 수 있는 작업을 찾고, 실패를 알리는 세 가지 방식(Result, 오류 코드, 예외)을 비교한다.
  - Rust의 Result<T, E>를 돌려주는 함수를 만들고 match, if let, unwrap_or로 처리한다.
  - "? 연산자로 실패를 부른 쪽에 전달하는 함수 사슬을 만든다."
  - C에서 오류 코드를 약속하고 검사하며, Python에서 raise·try·except·finally를 쓴다.
  - unwrap으로 인한 패닉을 알맞은 오류 처리로 바꾼다.
concepts:
  [
    error handling,
    result,
    ok,
    err,
    question mark operator,
    unwrap,
    expect,
    error code,
    exception,
    try except,
    raise,
    finally,
  ]
runnerMode: python
playgroundSource: |
  # 파일: errors.py — 입력을 바꿔 가며 어느 갈래로 가는지 보세요.
  def parse_age(text):
      age = int(text)                   # 숫자가 아니면 ValueError
      if not 0 <= age <= 150:
          raise ValueError(f"{age}세는 범위를 벗어났습니다")
      return age

  for text in ["30", "abc", "200", "-3"]:
      try:
          print(text, "→", parse_age(text))
      except ValueError as error:
          print(text, "→ 오류:", error)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day25-predict-rs
    title: "? 연산자의 전달 예측하기"
    kind: predict
    objective: "?가 Err를 만나면 그 자리에서 함수를 끝내고 Err를 돌려준다는 것을 추적한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn half(n: i32) -> Result<i32, String> {
          if n % 2 == 0 {
              Ok(n / 2)
          } else {
              Err(format!("{n}은 홀수"))
          }
      }

      fn quarter(n: i32) -> Result<i32, String> {
          let h = half(n)?;
          half(h)
      }

      fn main() {
          println!("{:?} {:?}", quarter(12), quarter(6));
      }
    answer: 'Ok(3) Err("3은 홀수")'
    hint: "quarter(12): half(12) = Ok(6), half(6) = Ok(3). quarter(6): half(6) = Ok(3), 그다음 half(3)은?"
    explanation: "?는 Ok면 안의 값을 꺼내 주고, Err면 그 Err를 그대로 돌려주며 함수를 끝냅니다. quarter(6)에서는 첫 half가 성공해 h = 3이 되고, 두 번째 half(3)이 Err를 돌려줍니다. Debug 형식이라 문자열에 따옴표가 붙습니다."
    commonMistakes:
      - "quarter(6)이 Ok(1)이라고 생각함(3은 홀수라 나눌 수 없음)"
      - "Err 안의 문자열에 따옴표가 없다고 적음"
    language: rust
    verification: run
  - id: ex-day25-predict-py
    title: try·else·finally 순서 예측하기
    kind: predict
    objective: finally가 return 직전에도 실행된다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def f(x):
          try:
              r = 10 // x
          except ZeroDivisionError:
              return "나눌 수 없음"
          else:
              return f"결과 {r}"
          finally:
              print("끝", end=" ")


      print(f(2))
    answer: "끝 결과 5"
    hint: "예외가 없으니 else로 가서 '결과 5'를 돌려주려 합니다. 하지만 함수가 끝나기 직전에 finally가 먼저 실행됩니다."
    explanation: "finally는 try 블록을 어떻게 빠져나가든(정상, 예외, return) 반드시 실행됩니다. 그래서 '끝 '이 먼저 출력되고, 그다음 바깥 print가 돌려받은 '결과 5'를 출력합니다. 파일 닫기처럼 '반드시 해야 하는 정리'를 finally에 둡니다."
    commonMistakes:
      - "return이 먼저라 finally가 실행되지 않는다고 생각함"
      - "'결과 5 끝'으로 순서를 바꿔 적음"
    language: python
    verification: run
  - id: ex-day25-fill
    title: "? 연산자로 변환 오류 전달하기"
    kind: fill
    objective: Result를 돌려주는 함수 안에서 ?로 실패를 위로 넘긴다.
    prompt: '빈칸을 채워 double("21")은 Ok(42), double("x")은 변환 오류를 그대로 돌려주게 하세요.'
    starter: |-
      use std::num::ParseIntError;

      fn double(text: &str) -> Result<i32, ParseIntError> {
          let n: i32 = text.parse()_____;
          Ok(n * 2)
      }

      fn main() {
          println!("{:?} {:?}", double("21"), double("x"));
      }
    answer: |-
      use std::num::ParseIntError;

      fn double(text: &str) -> Result<i32, ParseIntError> {
          let n: i32 = text.parse()?;
          Ok(n * 2)
      }

      fn main() {
          println!("{:?} {:?}", double("21"), double("x"));
      }
    output: "Ok(42) Err(ParseIntError { kind: InvalidDigit })"
    hint: "parse()는 Result<i32, ParseIntError>를 돌려줍니다. 함수의 오류 자료형도 ParseIntError라서 기호 하나로 그대로 넘길 수 있습니다."
    explanation: 'text.parse()?는 성공하면 i32를 꺼내고, 실패하면 ParseIntError를 담은 Err로 double을 즉시 끝냅니다. ?는 Result를 돌려주는 함수 안에서만 쓸 수 있고, 오류 자료형이 맞아야 합니다. unwrap()이었다면 "x"에서 프로그램이 멈췄을 것입니다.'
    commonMistakes:
      - '.unwrap()을 써서 double("x")에서 패닉이 남'
      - "?를 main(반환 자료형이 ())에서 써서 E0277 오류가 남"
    language: rust
    verification: run
  - id: ex-day25-modify
    title: 실패하면 기본값을 돌려주게 바꾸기
    kind: modify
    objective: try/except로 예외를 잡아 기본값을 돌려준다.
    prompt: "safe_int가 숫자가 아닌 문자열에서 ValueError로 멈춥니다. 예외를 잡아 기본값 0을 돌려주도록 고쳐 '12 0'이 출력되게 하세요."
    starter: |-
      def safe_int(text):
          return int(text)


      print(safe_int("12"), safe_int("abc"))
    answer: |-
      def safe_int(text, default=0):
          try:
              return int(text)
          except ValueError:
              return default


      print(safe_int("12"), safe_int("abc"))
    output: "12 0"
    hint: "int(text)를 try 안에 두고, except ValueError:에서 기본값을 돌려주세요."
    explanation: "Rust의 unwrap_or(0)과 같은 일입니다. 다만 '실패했다'는 사실이 사라지므로, 실제 값 0과 실패를 구별해야 한다면 None을 돌려주거나 예외를 그대로 두는 편이 낫습니다. except 뒤에는 잡을 예외 종류를 적으세요. 그냥 except:는 오타 같은 다른 오류까지 숨깁니다."
    commonMistakes:
      - "except:만 써서 모든 오류를 숨김"
      - "try 밖에서 int()를 불러 예외를 잡지 못함"
    language: python
    verification: run
  - id: ex-day25-debug
    title: unwrap 패닉을 오류 처리로 바꾸기
    kind: debug
    objective: 실패할 수 있는 변환에서 unwrap 대신 match로 두 경우를 모두 처리한다.
    prompt: "이 코드는 'called Result::unwrap() on an Err value'로 멈춥니다. match로 바꿔 변환에 실패하면 '나이를 읽을 수 없습니다: twenty'가 출력되게 하세요."
    starter: |-
      fn main() {
          let text = "twenty";
          let age: u32 = text.parse().unwrap();
          println!("나이: {age}");
      }
    answer: |-
      fn main() {
          let text = "twenty";
          match text.parse::<u32>() {
              Ok(age) => println!("나이: {age}"),
              Err(_) => println!("나이를 읽을 수 없습니다: {text}"),
          }
      }
    output: "나이를 읽을 수 없습니다: twenty"
    hint: "parse의 결과는 Ok(값) 또는 Err(오류)입니다. 두 경우를 match의 갈래로 나누세요."
    explanation: 'unwrap은 ''Err일 리 없다''고 확신할 때만 쓰는 도구라, 사용자 입력처럼 실패할 수 있는 값에 쓰면 프로그램이 멈춥니다. match나 if let으로 실패 경우의 동작을 직접 정하세요. 정말 실패할 수 없는 값이라면 expect("이유")로 이유를 남기는 것이 좋습니다.'
    commonMistakes:
      - "expect로 바꾸기만 해서 여전히 멈춤"
      - "Err 갈래를 빼서 E0004(모든 경우를 다루지 않음) 오류가 남"
    language: rust
    verification: run
  - id: ex-day25-independent
    title: C로 점수 읽기와 오류 코드
    kind: independent
    objective: 실패를 음수 오류 코드로 알리는 C 함수를 만든다.
    prompt: 'int parse_score(const char *text)가 0~100의 정수면 그 값을, 아니면 -1을 돌려주게 만드세요. "85", "abc", "120", " 7 "을 넣어 ''85 -1 -1 7''을 출력하세요.'
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("? ? ? ?\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int parse_score(const char *text) {
          int value, used = 0;
          if (sscanf(text, " %d %n", &value, &used) != 1 || text[used] != '\0') {
              return -1;
          }
          if (value < 0 || value > 100) {
              return -1;
          }
          return value;
      }

      int main(void) {
          printf("%d %d %d %d\n", parse_score("85"), parse_score("abc"),
                 parse_score("120"), parse_score(" 7 "));
          return 0;
      }
    output: "85 -1 -1 7"
    hint: "sscanf의 반환값으로 숫자를 읽었는지, %n으로 읽은 글자 수를 받아 뒤에 다른 글자가 남았는지 확인하세요. 서식의 공백은 앞뒤 공백을 건너뜁니다."
    explanation: "점수는 0 이상이라 -1을 '실패'의 약속으로 쓸 수 있습니다. 이 방식은 간단하지만, 부른 쪽이 -1 검사를 잊어도 컴파일러가 알려 주지 않고, 실패 이유(숫자가 아님, 범위 밖)도 구별되지 않습니다. 이 한계가 Rust의 Result와 Python의 예외가 생긴 이유입니다."
    commonMistakes:
      - 'sscanf 반환값만 보고 "85점" 같은 입력을 성공으로 처리함(뒤의 글자 검사 누락)'
      - "-1이 올바른 값이 될 수 있는 경우에도 -1을 오류 코드로 씀"
    language: c
    verification: run
quiz:
  - id: quiz-day25-01
    question: Rust의 Result<T, E>에 대한 설명으로 옳은 것은?
    choices:
      - 항상 값이 들어 있다
      - 성공하면 Ok(T 값), 실패하면 Err(E 값) 중 하나이고, 값을 쓰려면 어느 쪽인지 확인해야 한다
      - 실패하면 프로그램이 자동으로 멈춘다
      - 정수만 담을 수 있다
    answerIndex: 1
    explanation: Result는 두 경우를 가진 enum입니다(Day 15, 53). 안의 값을 꺼내려면 match, if let, ?, unwrap 등으로 경우를 따져야 하므로 실패를 '모르고 지나치기'가 어렵습니다.
  - id: quiz-day25-02
    question: Rust 함수 안에서 let x = f()?;가 하는 일은?
    choices:
      - f()가 실패해도 무시하고 계속한다
      - f()가 Ok면 값을 x에 담고, Err면 그 Err를 돌려주며 현재 함수를 즉시 끝낸다
      - 프로그램을 멈춘다
      - f()를 두 번 부른다
    answerIndex: 1
    explanation: "?는 match로 Ok/Err를 나누고 Err면 return하는 코드를 한 글자로 줄인 것입니다. 그래서 현재 함수도 Result(또는 Option)를 돌려줘야 쓸 수 있습니다."
  - id: quiz-day25-03
    question: unwrap()을 써도 괜찮은 경우에 가장 가까운 것은?
    choices:
      - 사용자가 입력한 문자열을 숫자로 바꿀 때
      - 파일을 열 때
      - 코드에 직접 쓴 "42"처럼 실패할 수 없음을 확실히 아는 값, 또는 짧은 실험 코드
      - 네트워크에서 받은 데이터를 읽을 때
    answerIndex: 2
    explanation: 외부에서 오는 값(입력, 파일, 네트워크)은 언제든 잘못될 수 있으니 오류를 처리해야 합니다. 실패하면 안 되는 곳에서 unwrap을 쓴다면 expect("이유")로 이유를 남기세요.
  - id: quiz-day25-04
    question: C의 오류 코드 방식(예 실패하면 -1 반환)의 약점은?
    choices:
      - 너무 느리다
      - 부른 쪽이 검사를 잊어도 컴파일러가 알려 주지 않고, -1이 올바른 결과일 수 있는 함수에는 쓸 수 없다
      - 컴파일할 수 없다
      - 음수를 돌려줄 수 없다
    answerIndex: 1
    explanation: 오류 코드는 '약속'일 뿐이라 검사하지 않으면 오류 값이 계산에 섞여 들어갑니다. 결과와 오류를 따로 돌려주려면 포인터로 결과를 받는 방법(Day 43)이나 errno 같은 도구를 씁니다.
  - id: quiz-day25-05
    question: Python에서 예외가 잡히지 않고 함수 밖으로 나가면?
    choices:
      - 무시되고 None이 돌아간다
      - 부른 함수, 그 함수를 부른 함수 순서로 위로 전달되고, 어디서도 잡지 않으면 프로그램이 Traceback과 함께 멈춘다
      - 0이 돌아간다
      - 그 줄만 건너뛴다
    answerIndex: 1
    explanation: 예외는 try/except를 만날 때까지 호출 스택을 거슬러 올라갑니다. 그래서 ticket_price는 parse_age의 예외를 따로 처리하지 않아도 되고, 가장 바깥에서 한 번에 잡을 수 있습니다. Rust에서는 ?가 이 전달을 '눈에 보이게' 해 줍니다.
---

## 1. 오늘 배울 내용

지금까지 `unwrap()`, `scanf`의 반환값, `ValueError`를 "나중에 배운다"며 넘어갔습니다. 오늘은 **실패할 수 있는 작업**을 제대로 다룹니다.

1. 어떤 작업이 실패할 수 있는지, 실패를 알리는 세 가지 방식을 비교합니다.
   - Rust: 결과를 담은 값 `Result`
   - C: 약속된 특별한 반환값(오류 코드)
   - Python: 예외(exception)
2. Rust `Result<T, E>`를 돌려주는 함수를 만들고 여러 방식으로 처리합니다.
   - `match`, `if let`
   - `unwrap_or`, `unwrap`, `expect`
3. **`?` 연산자**로 실패를 부른 쪽에 넘기는 함수 사슬을 만듭니다.
4. C에서 오류 코드를 정하고 **손으로 위로 전달**합니다.
5. Python에서 `raise`로 예외를 일으키고 `try`/`except`/`else`/`finally`로 처리합니다.
6. 세 언어로 같은 입장료 계산기를 만들어 **같은 출력**이 나오는지 확인합니다.

## 2. 왜 필요한가

프로그램 밖에서 들어오는 것은 언제든 잘못될 수 있습니다.

- 사용자가 나이에 `abc`를 입력합니다.
- 읽으려는 파일이 없습니다.
- 나누는 수가 0입니다.
- 네트워크가 끊깁니다.

실패를 무시하면 두 가지 나쁜 일 중 하나가 생깁니다. 프로그램이 **갑자기 멈추거나**(`unwrap` 패닉, 처리되지 않은 예외), 더 나쁘게는 **틀린 값으로 계속 진행**합니다(C에서 `scanf` 실패를 검사하지 않으면 쓰레기 값으로 계산). 좋은 프로그램은 실패를 **알아채고**, 할 수 있으면 **복구하고**(다시 입력받기, 기본값 쓰기), 아니면 **이유를 알려 주며** 멈춥니다.

## 3. 그림으로 이해하기

실패를 알리는 세 방식을 "함수가 돌려주는 것"으로 비교해 봅시다.

```text
Rust: 결과를 상자에 담아 돌려준다                C: 약속된 특별한 값                 Python: 예외를 던진다

 parse_age("abc")                                parse_age("abc")                     parse_age("abc")
       │                                              │                                     │
       ▼                                              ▼                                     ▼
 ┌─────────────────┐                            ┌──────────┐                        (정상 반환 없이)
 │ Err("…아닙니다") │  ← 상자를 열어 봐야         │   -1     │  ← 검사를 잊으면       예외가 위로 날아감
 └─────────────────┘    값을 쓸 수 있음          └──────────┘    나이 -1로 계산됨      try/except가 받을 때까지
 ┌─────────────────┐                            ┌──────────┐
 │ Ok(30)          │                            │   30     │
 └─────────────────┘                            └──────────┘
```

실패는 보통 **깊은 곳**(`parse_age`)에서 생기고, **바깥**(`main`)에서 처리합니다. 가운데 함수(`ticket_price`)는 실패를 위로 **전달**하기만 하면 됩니다.

```text
main ─── ticket_price ─── parse_age ─── (문자열 → 정수 변환 실패!)
 ▲             ▲               │
 │             │    Err 또는 예외 또는 오류 코드
 │             └───────────────┘      Rust: ?  /  Python: 자동  /  C: if (age < 0) return age;
 └─ 여기서 한 번에 처리: "오류 - 'abc'는 숫자가 아닙니다"
```

## 4. 천천히 풀어보기

### 4.1 Rust의 Result

`Result<T, E>`는 두 경우를 가진 enum입니다.

```rust
enum Result<T, E> {
    Ok(T),      // 성공: T 자료형의 값
    Err(E),     // 실패: E 자료형의 오류 정보
}
```

`"42".parse::<i32>()`의 자료형은 `Result<i32, ParseIntError>`입니다. 성공하면 `Ok(42)`, 실패하면 `Err(ParseIntError { kind: InvalidDigit })`입니다.

| 처리 방법                             | 성공일 때   | 실패일 때                         | 언제 쓰나                     |
| ------------------------------------- | ----------- | --------------------------------- | ----------------------------- |
| `match r { Ok(v) => …, Err(e) => … }` | 원하는 대로 | 원하는 대로                       | 두 경우를 다르게 처리할 때    |
| `if let Ok(v) = r { … }`              | 블록 실행   | 무시(또는 `else`)                 | 성공일 때만 할 일이 있을 때   |
| `r.unwrap_or(기본값)`                 | 안의 값     | 기본값                            | 실패하면 기본값으로 충분할 때 |
| `r?`                                  | 안의 값     | 현재 함수를 끝내고 `Err`를 돌려줌 | 실패를 부른 쪽에 맡길 때      |
| `r.expect("이유")`                    | 안의 값     | 이유를 보여 주며 **패닉**(멈춤)   | 실패하면 버그인 경우          |
| `r.unwrap()`                          | 안의 값     | **패닉**                          | 실험 코드, 실패할 수 없는 값  |

`Option<T>`(`Some`/`None`, Day 14)는 "값이 없을 수 있다", `Result<T, E>`는 "실패할 수 있고, 실패하면 이유가 있다"는 뜻입니다. `?`는 둘 다에 쓸 수 있습니다.

### 4.2 ? 연산자

`?`는 다음 `match`를 한 글자로 줄인 것입니다.

```rust
let age = parse_age(text)?;

// 위 한 줄은 아래와 같다
let age = match parse_age(text) {
    Ok(v) => v,
    Err(e) => return Err(e),
};
```

그래서 `?`를 쓰는 함수는 **자신도 `Result`를 돌려줘야** 하고, 오류 자료형이 맞아야 합니다. `?`가 있는 곳을 보면 "여기서 실패하면 함수가 끝난다"는 것이 코드에 드러납니다.

### 4.3 C의 오류 코드

C에는 `Result`도 예외도 없습니다. 대신 **실패를 뜻하는 특별한 값**을 약속합니다.

| 약속의 예                             | 쓰는 곳                                   |
| ------------------------------------- | ----------------------------------------- |
| 음수(-1, -2 …)를 실패로               | 결과가 0 이상인 함수(나이, 개수, 위치)    |
| `0`을 실패, `1`을 성공으로(또는 반대) | `scanf`의 반환값, 참·거짓 함수            |
| `NULL`을 실패로                       | 포인터를 돌려주는 함수(`fopen`, `malloc`) |
| 전역 변수 `errno`에 이유를 적어 둠    | `strtol`, 파일 함수 등 표준 라이브러리    |

약점도 분명합니다. 부른 쪽이 검사를 **잊어도** 컴파일러가 알려 주지 않고, 가운데 함수들이 오류를 **손으로** 한 단계씩 전달해야 합니다. 결과가 음수일 수 있는 함수는 이 방식을 쓸 수 없어서, 결과를 포인터로 따로 받는 방법(Day 43)을 씁니다.

### 4.4 Python의 예외

Python은 실패하면 **예외를 던집니다**(`raise`). 예외는 정상적인 `return`을 건너뛰고 호출 스택을 거슬러 올라가다가, `try`/`except`를 만나면 거기서 처리됩니다. 아무도 잡지 않으면 Traceback을 출력하며 프로그램이 멈춥니다(Day 7).

```python
try:
    위험한 작업          # 여기서 예외가 나면 바로 except로 간다
except ValueError as e:
    처리                 # e에 예외 정보(메시지)가 들어 있다
else:
    예외가 없었을 때만
finally:
    어떤 경우든 마지막에 반드시
```

가운데 함수(`ticket_price`)는 아무것도 하지 않아도 예외가 **저절로** 위로 전달됩니다. 편하지만, 코드만 봐서는 어느 줄이 예외를 던질 수 있는지 보이지 않는다는 단점이 있습니다. Rust의 `?`는 이 전달을 **눈에 보이게** 만든 것입니다.

## 5. Rust로 구현하기

나이를 문자열로 받아 입장료를 계산합니다. 13세 미만 5,000원, 65세 미만 10,000원, 그 이상은 무료입니다. 숫자가 아니거나 0~150을 벗어나면 오류입니다.

```rust
// 파일: results.rs
fn parse_age(text: &str) -> Result<u32, String> {
    let age: i64 = match text.trim().parse() {
        Ok(value) => value,
        Err(_) => return Err(format!("'{}'는 숫자가 아닙니다", text.trim())),
    };
    if !(0..=150).contains(&age) {
        return Err(format!("{age}세는 범위를 벗어났습니다"));
    }
    Ok(age as u32)
}

fn ticket_price(text: &str) -> Result<u32, String> {
    let age = parse_age(text)?;             // 실패면 그 Err를 그대로 돌려주고 끝낸다
    Ok(if age < 13 {
        5000
    } else if age < 65 {
        10000
    } else {
        0
    })
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("0으로 나눌 수 없습니다"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    for input in ["30", " 8 ", "abc", "200", "-3", "70"] {
        match ticket_price(input) {
            Ok(price) => println!("입력 \"{input}\": {price}원"),
            Err(message) => println!("입력 \"{input}\": 오류 - {message}"),
        }
    }

    println!("{:?} {:?}", divide(10, 3), divide(1, 0));
    let n = "42".parse::<i32>().unwrap_or(0);   // 실패하면 기본값
    let m = "x".parse::<i32>().unwrap_or(0);
    println!("unwrap_or: {n} {m}");
    if let Ok(v) = "7".parse::<i32>() {
        println!("if let Ok: {v}");
    }
    match "x1".parse::<i32>() {
        Ok(v) => println!("{v}"),
        Err(e) => println!("표준 오류 메시지: {e}"),
    }
}
```

실행 결과:

```text
입력 "30": 10000원
입력 " 8 ": 5000원
입력 "abc": 오류 - 'abc'는 숫자가 아닙니다
입력 "200": 오류 - 200세는 범위를 벗어났습니다
입력 "-3": 오류 - -3세는 범위를 벗어났습니다
입력 "70": 0원
Ok(3) Err("0으로 나눌 수 없습니다")
unwrap_or: 42 0
if let Ok: 7
표준 오류 메시지: invalid digit found in string
```

### 코드 한 부분씩 읽기

| 코드                                                                                  | 설명                                                                                                                                     |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `fn parse_age(text: &str) -> Result<u32, String>`                                     | 성공하면 `u32` 나이, 실패하면 `String` 메시지를 돌려줍니다. 오류 자료형으로 문자열을 쓰면 간단합니다. 더 정교한 방법은 9절의 enum입니다. |
| `let age: i64 = match text.trim().parse() { Ok(v) => v, Err(_) => return Err(...) };` | 변환에 실패하면 우리 메시지로 바꿔 돌려줍니다. `-3`도 먼저 읽어 두고 범위로 검사하려고 부호 있는 `i64`로 읽었습니다.                     |
| `if !(0..=150).contains(&age) { return Err(...); }`                                   | 숫자이긴 하지만 규칙에 맞지 않는 경우도 실패로 돌려줍니다.                                                                               |
| `Ok(age as u32)`                                                                      | 성공 결과를 `Ok`로 감쌉니다. 범위를 확인했으므로 `as u32`가 안전합니다.                                                                  |
| `let age = parse_age(text)?;`                                                         | `ticket_price`는 실패를 직접 처리하지 않고 `?`로 **그대로 넘깁니다**.                                                                    |
| `Ok(if age < 13 { 5000 } else if ...)`                                                | `if` 표현식의 결과를 `Ok`로 감쌌습니다(Day 22).                                                                                          |
| `match ticket_price(input) { Ok(price) => …, Err(message) => … }`                     | 가장 바깥인 `main`에서 두 경우를 처리합니다.                                                                                             |
| `"x".parse::<i32>().unwrap_or(0)`                                                     | 실패하면 0을 씁니다.                                                                                                                     |
| `Err(e) => println!("... {e}")`                                                       | 표준 라이브러리의 오류도 `{}`로 사람이 읽을 메시지를 보여 줍니다.                                                                        |

## 6. C로 구현하기

C는 실패를 **음수 오류 코드**로 약속했습니다. 오류의 종류(숫자가 아님, 범위 밖)를 구별하려고 코드 두 개를 `enum`으로 이름 붙였습니다.

```c
// 파일: results.c
#include <stdio.h>

enum { ERR_NOT_NUMBER = -1, ERR_RANGE = -2 };   // 실패를 나타내는 약속된 값

int parse_age(const char *text) {           // 성공하면 0 이상의 나이, 실패하면 음수 오류 코드
    int age, used = 0;
    if (sscanf(text, " %d %n", &age, &used) != 1 || text[used] != '\0') {
        return ERR_NOT_NUMBER;              // 숫자가 아니거나 뒤에 다른 글자가 있음
    }
    if (age < 0 || age > 150) {
        return ERR_RANGE;
    }
    return age;
}

int ticket_price(const char *text) {
    int age = parse_age(text);
    if (age < 0) {
        return age;                         // 오류 코드를 직접 위로 전달한다
    }
    return age < 13 ? 5000 : age < 65 ? 10000 : 0;
}

void report(const char *text) {
    int result = ticket_price(text);
    int value;
    if (result == ERR_NOT_NUMBER) {
        char word[32];
        if (sscanf(text, " %31s", word) != 1) {
            word[0] = '\0';
        }
        printf("입력 \"%s\": 오류 - '%s'는 숫자가 아닙니다\n", text, word);
    } else if (result == ERR_RANGE) {
        sscanf(text, "%d", &value);
        printf("입력 \"%s\": 오류 - %d세는 범위를 벗어났습니다\n", text, value);
    } else {
        printf("입력 \"%s\": %d원\n", text, result);
    }
}

int main(void) {
    const char *inputs[] = {"30", " 8 ", "abc", "200", "-3", "70"};
    for (int i = 0; i < 6; i++) {
        report(inputs[i]);
    }
    return 0;
}
```

실행 결과:

```text
입력 "30": 10000원
입력 " 8 ": 5000원
입력 "abc": 오류 - 'abc'는 숫자가 아닙니다
입력 "200": 오류 - 200세는 범위를 벗어났습니다
입력 "-3": 오류 - -3세는 범위를 벗어났습니다
입력 "70": 0원
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                                                                                              |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum { ERR_NOT_NUMBER = -1, ERR_RANGE = -2 };`            | 오류 코드에 이름을 붙였습니다. `-1`, `-2`를 코드 여기저기 직접 쓰는 것보다 뜻이 분명합니다.                                                                       |
| `sscanf(text, " %d %n", &age, &used)`                      | 문자열에서 정수를 읽습니다. `%n`은 값을 읽지 않고 "지금까지 읽은 글자 수"를 `used`에 넣습니다. 서식의 공백은 앞뒤 공백을 건너뜁니다.                              |
| `text[used] != '\0'`                                       | 숫자 뒤에 다른 글자가 남아 있으면(`"12abc"`) 실패로 봅니다. `sscanf`만으로는 이런 입력을 성공으로 처리하기 쉽습니다.                                              |
| `if (age < 0) { return age; }` (`ticket_price`)            | 오류 코드를 **손으로** 위로 전달합니다. Rust의 `?`가 자동으로 해 주는 일입니다. 이 줄을 빠뜨리면 -1세로 입장료를 계산해 버립니다.                                 |
| `report`의 `if (result == ERR_NOT_NUMBER) ... else if ...` | 오류 코드마다 메시지를 만듭니다. 오류 코드에는 "어떤 글자였는지" 같은 정보가 없어서, 메시지에 넣을 값을 다시 읽어야 했습니다. 이것이 오류 코드 방식의 한계입니다. |

## 7. Python으로 구현하기

Python은 실패하면 예외를 던집니다. `int()`가 던지는 `ValueError`를 잡아 우리 메시지로 바꿔 다시 던지고, 범위 검사에서도 `ValueError`를 던집니다.

```python
# 파일: results.py
def parse_age(text):
    try:
        age = int(text)                     # 숫자가 아니면 ValueError가 난다
    except ValueError:
        raise ValueError(f"'{text.strip()}'는 숫자가 아닙니다") from None
    if not 0 <= age <= 150:
        raise ValueError(f"{age}세는 범위를 벗어났습니다")
    return age


def ticket_price(text):
    age = parse_age(text)                   # 예외는 저절로 위로 전달된다
    if age < 13:
        return 5000
    if age < 65:
        return 10000
    return 0


for text in ["30", " 8 ", "abc", "200", "-3", "70"]:
    try:
        print(f'입력 "{text}": {ticket_price(text)}원')
    except ValueError as error:
        print(f'입력 "{text}": 오류 - {error}')

try:
    print(10 // 0)
except ZeroDivisionError as error:
    print("ZeroDivisionError를 잡음:", error)
finally:
    print("finally는 오류가 있든 없든 실행된다")


def safe_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default


print("safe_int:", safe_int("42"), safe_int("x"))
```

실행 결과:

```text
입력 "30": 10000원
입력 " 8 ": 5000원
입력 "abc": 오류 - 'abc'는 숫자가 아닙니다
입력 "200": 오류 - 200세는 범위를 벗어났습니다
입력 "-3": 오류 - -3세는 범위를 벗어났습니다
입력 "70": 0원
ZeroDivisionError를 잡음: integer division or modulo by zero
finally는 오류가 있든 없든 실행된다
safe_int: 42 0
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `try: age = int(text) except ValueError:`       | `int(" 8 ")`은 앞뒤 공백을 알아서 무시하고, `int("abc")`는 `ValueError`를 던집니다.                                   |
| `raise ValueError(...) from None`               | 우리 메시지로 새 예외를 던집니다. `from None`은 원래 예외(`int()`의 것)를 Traceback에 함께 보여 주지 말라는 뜻입니다. |
| `if not 0 <= age <= 150: raise ValueError(...)` | 규칙 위반도 예외로 알립니다.                                                                                          |
| `age = parse_age(text)` (`ticket_price`)        | 예외를 따로 처리하지 않습니다. 예외가 나면 이 줄에서 `ticket_price`도 즉시 끝나고, 예외가 바깥으로 전달됩니다.        |
| `except ValueError as error:` / `{error}`       | `error`에 예외 객체가 들어 있고, 문자열로 바꾸면 메시지가 나옵니다.                                                   |
| `finally:`                                      | 예외가 났든 안 났든 마지막에 실행됩니다.                                                                              |
| `def safe_int(text, default=0)`                 | 예외를 잡아 기본값을 돌려주는 도우미 함수입니다. Rust의 `unwrap_or`와 같습니다.                                       |

세 언어의 처음 여섯 줄이 **완전히 같습니다**. 실패를 알리는 방법은 달라도, 같은 규칙을 구현하면 같은 결과가 나와야 합니다.

## 8. 실행 추적

입력 `"abc"`가 Rust 프로그램 안에서 어떻게 전달되는지 따라갑니다.

| 단계 | 위치                  | 일어난 일                                     | 돌려준 값                        |
| ---: | --------------------- | --------------------------------------------- | -------------------------------- |
|    1 | `main`                | `ticket_price("abc")` 호출                    |                                  |
|    2 | `ticket_price`        | `parse_age("abc")` 호출                       |                                  |
|    3 | `parse_age`           | `"abc".parse::<i64>()` → `Err(ParseIntError)` |                                  |
|    4 | `parse_age`의 `match` | `Err(_)` 갈래 → `return Err("'abc'는 …")`     | `Err("'abc'는 숫자가 아닙니다")` |
|    5 | `ticket_price`의 `?`  | `Err`를 받음 → 그대로 `return`                | `Err("'abc'는 숫자가 아닙니다")` |
|    6 | `main`의 `match`      | `Err(message)` 갈래 → 오류 메시지 출력        |                                  |

`ticket_price`의 `Ok(if ...)` 줄은 실행되지 않았습니다. `?`가 5단계에서 함수를 끝냈기 때문입니다. Python이라면 3단계의 예외가 4·5단계를 **자동으로** 거쳐 `main`의 `except`까지 날아갑니다.

## 9. 다른 예제로 다시 이해하기

**Rust로 주문 줄 파싱하기.** `"사과: 3"` 같은 주문 줄을 `(이름, 수량)`으로 바꿉니다. 실패의 종류가 여러 가지라 오류를 **enum**으로 만들었습니다. 각 단계의 실패를 `?`로 넘기면, 함수 본문은 "성공하는 길"만 보여 줍니다.

```rust
// 파일: order_lines.rs
enum OrderError {
    MissingColon,
    BadQuantity(String),
    ZeroQuantity,
}

fn parse_line(line: &str) -> Result<(String, u32), OrderError> {
    let (name, qty_text) = line.split_once(':').ok_or(OrderError::MissingColon)?;
    let qty_text = qty_text.trim();
    let qty: u32 = qty_text
        .parse()
        .map_err(|_| OrderError::BadQuantity(qty_text.to_string()))?;
    if qty == 0 {
        return Err(OrderError::ZeroQuantity);
    }
    Ok((name.trim().to_string(), qty))
}

fn describe(error: &OrderError) -> String {
    match error {
        OrderError::MissingColon => String::from("':'가 없습니다"),
        OrderError::BadQuantity(text) => format!("수량 '{text}'를 읽을 수 없습니다"),
        OrderError::ZeroQuantity => String::from("수량이 0입니다"),
    }
}

fn main() {
    let lines = ["사과: 3", "배 2", "귤: 많이", "감: 0", "포도:5"];
    let mut total = 0;
    for (i, line) in lines.iter().enumerate() {
        match parse_line(line) {
            Ok((name, qty)) => {
                total += qty;
                println!("{}번 줄: {name} {qty}개", i + 1);
            }
            Err(error) => println!("{}번 줄 건너뜀: {}", i + 1, describe(&error)),
        }
    }
    println!("올바른 주문의 총 수량: {total}");
}
```

실행 결과:

```text
1번 줄: 사과 3개
2번 줄 건너뜀: ':'가 없습니다
3번 줄 건너뜀: 수량 '많이'를 읽을 수 없습니다
4번 줄 건너뜀: 수량이 0입니다
5번 줄: 포도 5개
올바른 주문의 총 수량: 8
```

| 코드                                                                  | 설명                                                                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum OrderError { MissingColon, BadQuantity(String), ZeroQuantity }` | 실패의 종류를 자료형으로 만들었습니다. `BadQuantity`는 읽지 못한 글자까지 담습니다. 문자열 메시지보다 부른 쪽이 경우별로 처리하기 쉽습니다. |
| `line.split_once(':')`                                                | `':'`를 기준으로 둘로 나눈 `Option<(&str, &str)>`을 돌려줍니다. 없으면 `None`입니다.                                                        |
| `.ok_or(OrderError::MissingColon)?`                                   | `Option`을 `Result`로 바꿉니다(`None`이면 `Err(MissingColon)`). 그리고 `?`로 넘깁니다.                                                      |
| `.map_err(\|_\| OrderError::BadQuantity(...))?`                       | `parse`의 오류(`ParseIntError`)를 **우리 오류로 바꾼 뒤** 넘깁니다. `?`는 오류 자료형이 맞아야 하기 때문입니다.                             |
| `fn describe(error: &OrderError) -> String`                           | 오류 종류마다 사람이 읽을 메시지를 만듭니다. `match`가 모든 경우를 다루는지 컴파일러가 검사해 줍니다.                                       |
| 잘못된 줄은 건너뛰고 계속                                             | 실패를 **복구**한 예입니다. 전체 프로그램을 멈추지 않고, 올바른 주문(3 + 5 = 8)만 모읍니다.                                                 |

**Python으로 올바를 때까지 다시 입력받기.** Day 18의 재시도 반복을 예외 처리로 다시 써 봅시다. `int()`가 실패하면 `except`에서 안내하고 `continue`로 다시 묻습니다.

```python
# 파일: retry_input.py
def read_age():
    while True:
        text = input("나이: ")
        try:
            age = int(text)
        except ValueError:
            print(f"'{text}'는 숫자가 아닙니다. 다시 입력하세요.")
            continue
        if age < 0:
            print("나이는 0 이상이어야 합니다. 다시 입력하세요.")
            continue
        return age


age = read_age()
print(f"입력한 나이: {age}")
```

입력:

```text
abc
-5
42
```

실행 결과:

```text
나이: 'abc'는 숫자가 아닙니다. 다시 입력하세요.
나이: 나이는 0 이상이어야 합니다. 다시 입력하세요.
나이: 입력한 나이: 42
```

`int(text)`처럼 **예외가 날 수 있는 줄만** `try`에 넣었습니다. `try`를 넓게 잡으면 다른 곳의 실수까지 "잘못된 입력"으로 오해하게 됩니다. 입력이 끝나 버리면 `input()`이 `EOFError`를 던지므로, 실제 프로그램이라면 그 경우도 처리해야 합니다(Day 17).

## 10. 실패 처리 방식 한눈에 보기

| 하고 싶은 일               | Rust                        | C                       | Python                     |
| -------------------------- | --------------------------- | ----------------------- | -------------------------- |
| 실패를 알리기              | `return Err(e)`             | `return 오류코드;`      | `raise 예외(...)`          |
| 성공 알리기                | `Ok(v)`                     | 정상 값 반환            | `return v`                 |
| 실패를 위로 넘기기         | `?`                         | `if (r < 0) return r;`  | (자동)                     |
| 실패를 잡아 처리하기       | `match`, `if let`           | `if (r == 오류코드)`    | `try` / `except`           |
| 실패하면 기본값            | `unwrap_or(기본값)`         | `r < 0 ? 기본값 : r`    | `except: return 기본값`    |
| 반드시 할 정리             | 값이 사라질 때 자동(Day 40) | 직접(`goto cleanup` 등) | `finally`, `with`(Day 47)  |
| 실패하면 멈추기(버그일 때) | `expect("이유")`, `panic!`  | `abort()`, `assert`     | 예외를 잡지 않음, `assert` |

## 11. 세 언어 비교

| 관점                        | Rust `Result`                        | C 오류 코드          | Python 예외                |
| --------------------------- | ------------------------------------ | -------------------- | -------------------------- |
| 실패 정보                   | 자료형으로 자유롭게(`String`, enum)  | 정수 하나(+ `errno`) | 예외 객체(종류 + 메시지)   |
| 검사를 잊으면               | 값을 꺼낼 수 없음(컴파일 오류, 경고) | 모르고 지나침        | 프로그램이 멈춤(Traceback) |
| 전달 방식                   | `?`로 눈에 보이게                    | 손으로 한 단계씩     | 보이지 않게 자동           |
| 어느 함수가 실패하나 보이나 | 반환 자료형(`Result`)에 드러남       | 문서를 읽어야 함     | 문서를 읽어야 함           |
| 성공 경로의 비용            | 거의 없음                            | 없음                 | 없음(예외가 날 때만 비쌈)  |

## 12. 자주 하는 실수

### 실수 1: 외부 입력에 unwrap을 쓴다 (Rust)

```rust
// 파일: unwrap_panic.rs (실행 오류: called `Result::unwrap()` on an `Err` value)
fn main() {
    let text = "twenty";
    let age: u32 = text.parse().unwrap();
    println!("{age}");
}
```

실습의 디버그 문제입니다. 실패할 수 있는 값은 `match`, `if let`, `?`로 처리하세요.

### 실수 2: Result를 돌려주지 않는 함수에서 ?를 쓴다 (Rust)

```rust
// 파일: question_in_main.rs (컴파일 오류: E0277)
fn main() {
    let n: i32 = "42".parse()?;
    println!("{n}");
}
```

`main`은 `()`를 돌려주므로 `?`가 `Err`를 돌려줄 곳이 없습니다. `main`에서 `match`로 처리하거나, `fn main() -> Result<(), 오류자료형>`으로 만들면 `?`를 쓸 수 있습니다.

### 실수 3: 오류 코드 검사를 잊는다 (C)

```c
// 파일: forgot_check.c
#include <stdio.h>

int parse_age(const char *text) {
    int age;
    if (sscanf(text, "%d", &age) != 1) {
        return -1;
    }
    return age;
}

int main(void) {
    int age = parse_age("abc");
    printf("내년 나이: %d\n", age + 1);     // -1 검사를 잊음
    return 0;
}
```

실행 결과:

```text
내년 나이: 0
```

오류 코드 -1에 1을 더해 "0세"라는 그럴듯한 틀린 답이 나왔습니다. 컴파일러는 아무것도 알려 주지 않습니다.

### 실수 4: 모든 예외를 삼킨다 (Python)

```python
# 파일: bare_except.py
def average(values):
    try:
        return sum(values) / len(value)     # 이름 오타: value
    except:
        return 0


print(average([80, 90]))
```

실행 결과:

```text
0
```

`except:`가 이름 오타로 생긴 `NameError`까지 잡아 버려서, 버그가 "평균 0"으로 숨었습니다. **잡을 예외의 종류를 적고**(`except ZeroDivisionError:`), `try`는 예외가 날 수 있는 줄에만 좁게 쓰세요.

### 실수 5: 실패와 올바른 값을 구별할 수 없게 만든다

`safe_int`가 실패하면 0을 돌려준다면, `safe_int("0")`과 `safe_int("abc")`를 구별할 수 없습니다. 0이 올바른 값일 수 있다면 Python은 `None`을, Rust는 `Option`이나 `Result`를 그대로 돌려주세요.

## 13. Q&A

**Q. 패닉(panic)과 Err는 언제 구별해 쓰나요?**

A. **예상할 수 있는 실패**(잘못된 입력, 없는 파일)는 `Err`로 돌려줘서 부른 쪽이 처리하게 합니다. **있어서는 안 되는 상황**(프로그래머의 실수, 깨진 규칙)은 패닉으로 멈춰서 버그를 빨리 드러냅니다. 배열 범위를 넘는 인덱스가 패닉인 이유입니다.

**Q. Python에서 예외 대신 None을 돌려주면 안 되나요?**

A. 값이 "없을 수 있는" 것이 정상인 경우(사전에서 키 찾기의 `dict.get`)는 `None`이 좋습니다. "실패"라서 이유가 중요한 경우는 예외가 알맞습니다. `None`은 이유를 담지 못하고, 부른 쪽이 검사를 잊으면 나중에 엉뚱한 곳에서 `TypeError`로 드러납니다.

**Q. C에는 정말 예외가 없나요?**

A. C 표준에는 없습니다. `setjmp`/`longjmp`로 비슷한 흉내를 낼 수 있지만 위험해서 거의 쓰지 않습니다. C++에는 예외(`try`/`catch`)가 있습니다. C 코드는 오류 코드와 `errno`, 그리고 함수 끝에서 정리하는 `goto cleanup` 모양을 씁니다(Day 46).

**Q. Rust의 오류 자료형으로 String과 enum 중 무엇이 좋나요?**

A. 작은 프로그램에서 사람에게 보여 주기만 할 거라면 `String`이 간단합니다. 부른 쪽이 **오류 종류에 따라 다르게 행동**해야 한다면(수량 오류는 다시 묻고, 형식 오류는 건너뛰기) enum이 좋습니다. 큰 프로그램에서는 오류 자료형에 `Display` 트레이트를 구현해 메시지를 만드는 방법(Day 54)을 씁니다.

## 14. 핵심 요약

- 외부에서 오는 값(입력, 파일, 네트워크)은 언제든 잘못될 수 있습니다. 실패를 알아채고, 복구하거나, 이유를 알리며 멈춥니다.
- Rust: `Result<T, E>`의 `Ok(값)`/`Err(오류)`로 돌려줍니다. `match`, `if let`, `unwrap_or`로 처리하고, `?`로 부른 쪽에 넘깁니다. `unwrap`·`expect`는 실패하면 패닉입니다.
- `?`는 Result(또는 Option)를 돌려주는 함수 안에서만 쓸 수 있고, 오류 자료형이 맞아야 합니다(`map_err`, `ok_or`로 바꾸기).
- C: 실패를 뜻하는 특별한 반환값(오류 코드)을 약속하고, 부른 쪽이 검사해 손으로 전달합니다. 검사를 잊어도 컴파일러가 알려 주지 않습니다.
- Python: `raise`로 예외를 던지고 `try`/`except`/`else`/`finally`로 처리합니다. 예외는 잡힐 때까지 자동으로 위로 전달됩니다. 잡을 예외의 종류를 적고, `try`는 좁게 씁니다.
- 같은 규칙을 구현하면 실패를 알리는 방식이 달라도 세 언어의 출력이 같아야 합니다.

## 15. 도전 문제

1. **(Rust)** `fn parse_point(text: &str) -> Result<(i32, i32), String>`을 만들어 `"3,4"`를 `(3, 4)`로 바꾸고, 쉼표가 없거나 숫자가 아니면 이유를 담은 `Err`를 돌려주세요. `split_once`와 `?`를 쓰세요.
2. **(C)** `int safe_divide(int a, int b, int *result)`처럼 성공 여부(0/1)를 돌려주고 결과는 포인터로 받는 모양을 미리 써 보세요(포인터는 Day 29, 43에서 배웁니다).
3. **(Python)** 여러 줄의 숫자를 입력받아 합계를 구하되, 숫자가 아닌 줄은 `(줄 번호, 내용)`을 목록에 모아 두었다가 마지막에 "잘못된 줄" 목록과 함께 출력하세요.
4. **(세 언어)** 9절의 주문 줄 파서를 세 언어로 만들고, 같은 입력에 대해 성공한 줄·실패한 줄·총 수량이 같은지 비교하세요.
