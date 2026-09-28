---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-48-rust-reader
courseId: crp-92
phaseId: phase-04
dayNumber: 48
date: "2026-11-17"
title: Rust 읽기와 Result
summary: Rust에서 표준 입력과 파일을 읽을 때 만나는 두 종류의 실패, 즉 읽기 자체의 실패(io::Error)와 읽은 글을 해석하는 실패(ParseIntError 등)를 Result로 다룹니다. stdin().lock().lines()로 줄 단위 읽기, read_line이 줄바꿈을 남기는 점, parse와 오류 메시지, ?가 오류를 위로 보내는 방식과 main이 Result를 돌려주는 모양, 여러 오류 종류를 담는 Box<dyn Error>, 직접 만든 오류 enum과 From 구현으로 ?가 오류를 자동으로 바꾸게 하는 법, unwrap·expect·unwrap_or·map_err의 쓰임을 익힙니다. C의 fgets와 strtoll·errno, Python의 sys.stdin과 예외와 비교하고, 한 줄씩 명령을 읽어 값을 계산하는 작은 계산기를 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-47-python-file]
learningObjectives:
  - 표준 입력을 줄 단위로 읽고, 읽기 오류와 해석 오류를 구별해 처리한다.
  - "?가 하는 일(Err면 곧바로 돌려주기, From으로 오류 바꾸기)을 설명하고, main이 Result를 돌려주게 한다."
  - Box<dyn Error>와 직접 만든 오류 enum 중 알맞은 것을 고르고, From을 구현한다.
  - unwrap, expect, unwrap_or, map_err, ok_or의 쓰임을 구별한다.
  - 같은 입력 처리를 C의 fgets·strtoll·errno와 Python의 예외로 옮기고 차이를 설명한다.
concepts:
  [
    stdin,
    bufread lines,
    read line,
    parse,
    parseinterror,
    result,
    question mark operator,
    from trait,
    box dyn error,
    custom error enum,
    display,
    unwrap,
    expect,
    map err,
    strtoll,
    erange,
  ]
runnerMode: python
playgroundSource: |
  # 파일: parse_play.py — Python의 int와 Rust의 parse를 비교해 보세요.
  for text in ["10", "  20 ", "thirty", "9999999999999999999"]:
      try:
          print(repr(text), "→", int(text))
      except ValueError as e:
          print(repr(text), "→ 오류:", e)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day48-predict-parse
    title: parse 결과 예측하기
    kind: predict
    objective: parse가 자료형의 범위와 공백을 어떻게 다루는지 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let a = "  7 ".trim().parse::<u8>();
          let b = "300".parse::<u8>();
          println!("{:?} {}", a, b.is_err());
      }
    answer: "Ok(7) true"
    hint: "trim으로 공백을 지운 뒤라 7은 읽힙니다. u8은 0~255입니다."
    explanation: 'parse는 공백을 허용하지 않아서 trim이 필요합니다. 300은 u8의 범위(0~255)를 넘어 Err(number too large to fit in target type)입니다. Python의 int("300")은 크기 제한이 없어 성공하고, C의 strtol은 범위를 넘으면 errno를 ERANGE로 바꿉니다. 자료형이 곧 ''받아들일 수 있는 값의 범위''입니다.'
    commonMistakes:
      - "300이 256으로 나눈 나머지 44로 들어간다고 생각함"
      - "trim 없이도 공백이 무시된다고 생각함"
    language: rust
    verification: run
  - id: ex-day48-predict-question
    title: "?가 중간에 돌려주는 값 예측하기"
    kind: predict
    objective: "?가 첫 오류에서 함수를 끝낸다는 것을 추적한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn sum_of(text: &str) -> Result<i64, std::num::ParseIntError> {
          let mut total = 0;
          for w in text.split_whitespace() {
              total += w.parse::<i64>()?;
          }
          Ok(total)
      }

      fn main() {
          println!("{:?} {:?}", sum_of("4 5 6"), sum_of("4 x").is_err());
      }
    answer: "Ok(15) true"
    hint: '"4 x"에서 4는 더해지지만 x에서 ?가 Err를 돌려주며 함수가 끝납니다.'
    explanation: '?는 Ok면 안의 값을 꺼내고, Err면 그 오류를 그대로 돌려주며 함수를 끝냅니다. 그래서 sum_of("4 x")는 4까지 더한 값을 버리고 Err가 됩니다. 오류가 난 줄만 건너뛰고 계속하고 싶다면, 오늘 예제의 main처럼 ? 대신 match로 처리해야 합니다.'
    commonMistakes:
      - "x를 0으로 보고 Ok(4)가 된다고 생각함"
      - "?가 프로그램 전체를 멈춘다고 생각함(함수 하나만 끝낸다)"
    language: rust
    verification: run
  - id: ex-day48-fill
    title: 읽은 줄을 숫자로 바꾸기 채우기
    kind: fill
    objective: trim과 parse, ?를 함께 쓴다.
    prompt: "빈칸을 채워 문자열 \" 42\\n\"을 숫자로 바꾸고 두 배인 '84'가 출력되게 하세요."
    starter: |-
      fn double(s: &str) -> Result<i32, std::num::ParseIntError> {
          let n: i32 = s.trim()._____()?;
          Ok(n * 2)
      }

      fn main() {
          println!("{}", double(" 42\n").unwrap());
      }
    answer: |-
      fn double(s: &str) -> Result<i32, std::num::ParseIntError> {
          let n: i32 = s.trim().parse()?;
          Ok(n * 2)
      }

      fn main() {
          println!("{}", double(" 42\n").unwrap());
      }
    output: "84"
    hint: "문자열을 다른 자료형으로 바꾸는 메서드입니다. 무엇으로 바꿀지는 let n: i32가 알려 줍니다."
    explanation: "parse는 결과 자료형을 보고 어떻게 해석할지 정합니다. let n: i32이므로 i32로 읽습니다. read_line으로 읽은 줄에는 끝에 줄바꿈이 남아 있어서 trim이 꼭 필요합니다. 여기서 unwrap은 결과가 Ok라고 확신하는 시험용 코드라 썼지만, 사용자 입력에는 쓰지 않는 것이 좋습니다."
    commonMistakes:
      - "trim을 빼서 줄바꿈 때문에 invalid digit 오류가 남"
      - "parse::<String>으로 바꿔 자료형이 맞지 않음"
    language: rust
    verification: run
  - id: ex-day48-modify
    title: unwrap 대신 기본값으로 처리하기
    kind: modify
    objective: 잘못된 입력에서 패닉 대신 기본값을 쓴다.
    prompt: '이 코드는 "x"에서 unwrap이 패닉을 냅니다. 숫자가 아닌 값은 0으로 보고 더하도록 고쳐 ''7''이 출력되게 하세요.'
    starter: |-
      fn main() {
          let total: i32 = ["3", "x", "4"].iter().map(|s| s.parse::<i32>().unwrap()).sum();
          println!("{total}");
      }
    answer: |-
      fn main() {
          let total: i32 = ["3", "x", "4"].iter().map(|s| s.parse::<i32>().unwrap_or(0)).sum();
          println!("{total}");
      }
    output: "7"
    hint: "Result에서 값을 꺼내되, Err면 정해 둔 값을 쓰는 메서드가 있습니다."
    explanation: "unwrap은 Err면 패닉으로 프로그램을 멈춥니다. unwrap_or(0)은 Err를 0으로 바꿉니다. 다만 '틀린 입력을 0으로 본다'는 것이 정말 원하는 동작인지 생각해 보세요. 잘못된 값을 조용히 0으로 바꾸면 합계가 틀린 줄도 모르고 넘어갈 수 있습니다. 오늘 예제의 main처럼 틀린 줄을 따로 알려 주는 편이 더 좋은 경우가 많습니다."
    commonMistakes:
      - "filter_map(|s| s.parse().ok())로 바꿔도 결과는 같지만 자료형 표기를 빠뜨려 추론 오류가 남"
      - 'expect("숫자")로 바꿔 여전히 패닉이 남'
    language: rust
    verification: run
  - id: ex-day48-debug
    title: "?가 오류를 바꾸지 못하는 문제 고치기"
    kind: debug
    objective: map_err로 오류 자료형을 함수의 반환 자료형에 맞춘다.
    prompt: "이 코드는 E0277(`?` couldn't convert the error to `String`) 오류로 컴파일되지 않습니다. map_err로 ParseIntError를 String으로 바꿔 'Ok(42)'가 출력되게 하세요."
    starter: |-
      fn double(s: &str) -> Result<i64, String> {
          let n: i64 = s.parse()?;
          Ok(n * 2)
      }

      fn main() {
          println!("{:?}", double("21"));
      }
    answer: |-
      fn double(s: &str) -> Result<i64, String> {
          let n: i64 = s.parse().map_err(|e: std::num::ParseIntError| e.to_string())?;
          Ok(n * 2)
      }

      fn main() {
          println!("{:?}", double("21"));
      }
    output: "Ok(42)"
    hint: "?는 From으로 바꿀 수 있는 오류만 자동으로 바꿉니다. ParseIntError에서 String으로 가는 From은 없습니다."
    explanation: "?는 Err(e)를 만나면 From::from(e)로 반환 자료형의 오류로 바꾼 뒤 돌려줍니다. ParseIntError → String 변환은 표준 라이브러리에 없어서 직접 바꿔야 합니다. map_err(|e| e.to_string())이 그 일을 합니다. 클로저의 매개변수 자료형을 적은 것은 parse가 어떤 자료형으로 읽을지 추론을 돕기 위해서입니다. 오류를 자주 바꾼다면 실습처럼 오류 enum에 From을 구현합니다."
    commonMistakes:
      - "반환 자료형을 Result<i64, ParseIntError>로 바꿔도 되지만, 이 함수를 쓰는 다른 코드가 String을 기대하면 깨짐"
      - "unwrap으로 바꿔 오류 처리를 포기함"
    language: rust
    verification: run
  - id: ex-day48-independent
    title: C로 쉼표로 이어진 숫자 더하기
    kind: independent
    objective: strtol의 end 포인터로 문자열을 차례로 읽는다.
    prompt: '"12,34,56"을 strtol과 end 포인터로 읽어 합 ''102''를 출력하세요.'
    starter: |-
      #include <stdio.h>

      int main(void) {
          const char *s = "12,34,56";
          printf("%s\n", s);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          const char *s = "12,34,56";
          char *end;
          long total = 0;
          for (;;) {
              long v = strtol(s, &end, 10);
              if (end == s) {
                  break;
              }
              total += v;
              if (*end != ',') {
                  break;
              }
              s = end + 1;
          }
          printf("%ld\n", total);
          return 0;
      }
    output: "102"
    hint: "strtol은 숫자를 읽고 멈춘 곳을 end에 알려 줍니다. 그곳이 쉼표면 한 칸 건너뛰어 다시 읽습니다."
    explanation: "end는 '어디까지 읽었는가'라서 문자열을 앞에서부터 차례로 먹어 들어가는 데 씁니다. end == s면 숫자가 하나도 없었다는 뜻이라 멈춥니다. Rust라면 s.split(',').map(|x| x.parse::<i64>()).sum::<Result<i64, _>>()처럼 쓰고, 하나라도 틀리면 Err가 됩니다."
    commonMistakes:
      - 'end == s 검사를 빼서 "12,,34"에서 멈추지 않음'
      - "s를 옮기지 않아 같은 숫자를 계속 읽음"
    language: c
    verification: run
quiz:
  - id: quiz-day48-01
    question: 입력을 읽어 숫자로 바꾸는 과정에서 생길 수 있는 두 종류의 실패는?
    choices:
      - 실패는 한 종류뿐이다
      - 읽기 자체의 실패(io::Error)와 읽은 글을 숫자로 해석하는 실패(ParseIntError)
      - 컴파일 오류와 경고
      - 패닉과 누수
    answerIndex: 1
    explanation: 읽기는 입력이 닫혔거나 올바른 UTF-8이 아닐 때 실패하고, 해석은 글자가 숫자가 아니거나 범위를 넘을 때 실패합니다. 둘은 처리 방법이 다른 경우가 많아서(읽기 실패는 멈추고, 해석 실패는 그 줄만 건너뛰기) 따로 다룹니다.
  - id: quiz-day48-02
    question: fn f() -> Result<T, E> 안에서 expr?가 하는 일은?
    choices:
      - 패닉을 낸다
      - expr이 Ok(v)면 v가 되고, Err(e)면 From으로 E로 바꾼 오류를 곧바로 돌려준다
      - 오류를 무시한다
      - Option으로 바꾼다
    answerIndex: 1
    explanation: "?는 match로 Err를 돌려주는 코드를 한 글자로 줄인 것입니다. From 변환 덕분에 여러 종류의 오류를 하나의 오류 자료형으로 모을 수 있습니다. Result를 돌려주지 않는 함수에서는 쓸 수 없습니다(E0277)."
  - id: quiz-day48-03
    question: main의 반환 자료형을 Result<(), Box<dyn Error>>로 하는 이유는?
    choices:
      - 속도를 위해
      - io::Error, ParseIntError처럼 서로 다른 오류를 모두 ?로 위로 보낼 수 있게
      - 반드시 그래야 해서
      - 패닉을 막으려고
    answerIndex: 1
    explanation: Box<dyn Error>는 Error 트레이트를 구현한 어떤 오류든 담는 상자입니다. 모든 표준 오류가 이 상자로 자동 변환되어 작은 프로그램에서 편합니다. 부르는 쪽이 오류 종류별로 다르게 처리해야 하는 라이브러리에는 직접 만든 enum이 더 알맞습니다.
  - id: quiz-day48-04
    question: read_line으로 "42"를 입력받은 문자열 s에 s.parse::<i32>()를 하면?
    choices:
      - Ok(42)
      - s에 줄바꿈이 남아 있어 Err(invalid digit)
      - 빈 문자열
      - 패닉
    answerIndex: 1
    explanation: read_line은 줄바꿈까지 담습니다(Windows에서는 \r\n). s.trim().parse()로 공백을 지우세요. lines()는 줄바꿈을 떼어 주지만, 앞뒤 공백은 그대로 둡니다.
  - id: quiz-day48-05
    question: unwrap과 expect("메시지")의 차이는?
    choices:
      - expect는 오류를 무시한다
      - 둘 다 Err면 패닉이지만, expect는 패닉 메시지에 우리가 적은 설명을 붙인다
      - unwrap만 패닉을 낸다
      - 차이가 없다
    answerIndex: 1
    explanation: 절대 실패하지 않아야 하는 곳(프로그램 안에 박힌 값의 변환 등)에서는 expect로 '왜 실패하지 않아야 하는지'를 적어 두면, 가정이 깨졌을 때 원인을 찾기 쉽습니다. 사용자 입력처럼 실패할 수 있는 곳에는 match, ?, unwrap_or을 씁니다.
---

## 1. 오늘 배울 내용

Day 46~47에서 C와 Python으로 파일과 예외를 다뤘습니다. 오늘은 Rust로 입력을 읽고, 실패를 **`Result`로** 다루는 방법을 정리합니다. Day 25에서 `Result`와 `?`를 처음 봤다면, 오늘은 실제 입력에서 그것을 어떻게 설계하는지 배웁니다.

1. 표준 입력 읽기
   - `io::stdin().lock().lines()`로 줄 단위 읽기
   - `read_line`은 줄바꿈을 남긴다는 점
2. 두 종류의 실패
   - 읽기 실패: `io::Error`
   - 해석 실패: `parse`가 돌려주는 `ParseIntError` 등
3. `?`의 두 가지 일
   - `Err`면 곧바로 돌려주기
   - `From`으로 오류 자료형 바꾸기
   - `main`이 `Result`를 돌려주는 모양
4. 여러 오류를 담는 두 방법
   - `Box<dyn Error>`: 무엇이든 담는 상자(작은 프로그램)
   - 직접 만든 오류 `enum` + `From` 구현(종류별 처리가 필요할 때)
5. 꺼내기 도구: `unwrap`, `expect`, `unwrap_or`, `map_err`, `ok_or`
6. C의 `fgets`·`strtoll`·`errno`, Python의 `sys.stdin`·예외와 비교합니다.
7. 한 줄씩 명령(`add 10`, `mul 3`, `show`)을 읽어 값을 계산하는 계산기를 만듭니다.

## 2. 왜 필요한가

프로그램이 받는 입력은 언제든 틀릴 수 있습니다. 사용자는 숫자 칸에 글자를 쓰고, 파일은 중간에 형식이 바뀌고, 숫자는 생각보다 큽니다.

- 틀린 입력 하나로 프로그램 전체가 멈추면(패닉) 사용하기 어렵습니다.
- 틀린 입력을 조용히 0으로 바꾸면 결과가 틀린 줄도 모릅니다.
- 오류 메시지가 "invalid digit"뿐이면 몇 번째 줄이 틀렸는지 알 수 없습니다.

좋은 입력 처리는 **어떤 실패가 가능한지 알고**, 실패마다 **멈출지, 건너뛸지, 기본값을 쓸지** 정하는 것입니다. Rust는 그 선택을 코드에 드러내게 만듭니다.

## 3. 그림으로 이해하기

입력 한 줄이 숫자가 되기까지 두 번의 관문이 있습니다.

```text
표준 입력 ──▶ lines() ──▶ io::Result<String> ──▶ parse() ──▶ Result<i64, ParseIntError>
               │                  │                             │
               │         읽기 실패(io::Error)           해석 실패(글자, 범위)
               │         → 보통 멈춘다(?)               → 그 줄만 알려 주고 계속(match)
```

`?`는 두 가지 일을 합니다.

```text
let n = s.parse::<i64>()?;

  Ok(42)   ──▶ n = 42, 다음 줄로
  Err(e)   ──▶ return Err(From::from(e));    ← 반환 자료형의 오류로 바꿔 곧바로 돌려줌
```

직접 만든 오류 `enum`에 `From`을 구현하면, `?`가 여러 오류를 한 자료형으로 모읍니다.

```text
ParseIntError ──From──▶ CmdError::BadNumber(e)
(직접 만든 경우) ─────▶ CmdError::MissingNumber, Unknown, DivideByZero
                              │
                     Result<i64, CmdError>
```

## 4. 천천히 풀어보기

### 4.1 표준 입력 읽기

| 방법                               | 결과                        | 줄바꿈    |
| ---------------------------------- | --------------------------- | --------- |
| `io::stdin().lock().lines()`       | 줄마다 `io::Result<String>` | 떼어 줌   |
| `io::stdin().read_line(&mut s)?`   | 한 줄을 `s` 뒤에 **덧붙임** | 남아 있음 |
| `io::read_to_string(io::stdin())?` | 입력 전체를 `String` 하나로 | 남아 있음 |

`lock()`은 표준 입력을 한 번 잠가 두고 여러 번 읽을 때 빠르게 합니다. `read_line`은 기존 내용을 지우지 않고 뒤에 붙이므로, 반복해서 쓸 때는 매번 `s.clear()`를 해야 합니다.

### 4.2 parse

`"42".parse::<i64>()`처럼 결과 자료형을 알려 주면 그 자료형으로 해석합니다. `let n: i64 = s.parse()?;`처럼 변수 자료형으로 알려 줘도 됩니다.

| 입력                    | `parse::<i64>()`                                 |
| ----------------------- | ------------------------------------------------ |
| `"42"`                  | `Ok(42)`                                         |
| `" 42"`, `"42\n"`       | `Err(invalid digit found in string)` — 공백 불가 |
| `"-5"`                  | `Ok(-5)`                                         |
| `"thirty"`              | `Err(invalid digit found in string)`             |
| `"9999999999999999999"` | `Err(number too large to fit in target type)`    |

오류의 `to_string()`이나 `{e}`로 메시지를 얻고, `e.kind()`로 종류(`InvalidDigit`, `PosOverflow` 등)를 구별할 수 있습니다.

### 4.3 오류를 담는 두 방법

| 방법             | 쓰는 법                                   | 좋은 점                          | 아쉬운 점                          |
| ---------------- | ----------------------------------------- | -------------------------------- | ---------------------------------- |
| `Box<dyn Error>` | `fn main() -> Result<(), Box<dyn Error>>` | 모든 표준 오류가 `?`로 들어감    | 부르는 쪽이 종류를 구별하기 어려움 |
| 직접 만든 `enum` | `enum CmdError { ... }` + `From` 구현     | `match`로 종류별 처리, 추가 정보 | 코드가 조금 늘어남                 |

작은 프로그램의 `main`은 `Box<dyn Error>`, 다른 코드가 쓸 함수(라이브러리)는 직접 만든 `enum`이 흔한 선택입니다.

### 4.4 꺼내기 도구

| 도구                | `Ok(v)` / `Some(v)` | `Err` / `None`          | 언제                                           |
| ------------------- | ------------------- | ----------------------- | ---------------------------------------------- |
| `?`                 | `v`                 | 오류를 돌려주며 함수 끝 | 부르는 쪽이 처리하게 할 때                     |
| `match`, `if let`   | 원하는 대로         | 원하는 대로             | 이 자리에서 처리할 때                          |
| `unwrap_or(기본값)` | `v`                 | 기본값                  | 기본값이 **정말** 맞을 때                      |
| `map_err(f)`        | 그대로              | 오류를 `f`로 바꿈       | 오류 자료형을 맞출 때                          |
| `ok_or(오류)`       | `Some(v)` → `Ok(v)` | `None` → `Err(오류)`    | `Option`을 `Result`로                          |
| `expect("이유")`    | `v`                 | 패닉(이유 포함)         | 절대 실패하지 않아야 할 때(가정을 문서로 남김) |
| `unwrap()`          | `v`                 | 패닉                    | 시험 코드, 짧은 예제                           |

## 5. Rust로 구현하기

```rust
// 파일: read_numbers.rs
use std::error::Error;
use std::io::{self, BufRead};
use std::num::ParseIntError;

fn parse_line(line: &str) -> Result<i64, ParseIntError> {
    line.trim().parse::<i64>()              // 실패하면 Err(ParseIntError)
}

fn sum_of(text: &str) -> Result<i64, ParseIntError> {
    let mut total = 0;
    for word in text.split_whitespace() {
        total += word.parse::<i64>()?;      // 하나라도 틀리면 곧바로 Err를 돌려준다
    }
    Ok(total)
}

fn main() -> Result<(), Box<dyn Error>> {   // 어떤 종류의 오류든 담을 수 있는 상자
    let stdin = io::stdin();
    let mut total = 0;
    let mut bad = 0;
    for (i, line) in stdin.lock().lines().enumerate() {
        let line = line?;                   // 읽기 오류(io::Error)는 위로
        if line.trim().is_empty() {
            continue;
        }
        match parse_line(&line) {
            Ok(n) => total += n,
            Err(e) => {
                bad += 1;
                println!("{}번째 줄 {:?}: {e}", i + 1, line.trim());
            }
        }
    }
    println!("합계 {total}, 잘못된 줄 {bad}개");

    println!("sum_of(\"1 2 3\") = {:?}", sum_of("1 2 3"));
    println!("sum_of(\"1 x 3\") = {:?}", sum_of("1 x 3").map_err(|e| e.to_string()));
    let n: i64 = "42".parse()?;             // main에서도 ?를 쓸 수 있다
    println!("unwrap_or: {}, 확인된 값: {n}", "abc".parse::<i64>().unwrap_or(0));
    Ok(())
}
```

입력:

```text
10
  20
thirty

-5
9999999999999999999
```

실행 결과:

```text
3번째 줄 "thirty": invalid digit found in string
6번째 줄 "9999999999999999999": number too large to fit in target type
합계 25, 잘못된 줄 2개
sum_of("1 2 3") = Ok(6)
sum_of("1 x 3") = Err("invalid digit found in string")
unwrap_or: 0, 확인된 값: 42
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fn main() -> Result<(), Box<dyn Error>>`           | `main` 안에서 `io::Error`와 `ParseIntError`를 모두 `?`로 보낼 수 있습니다. 오류가 나면 Rust가 메시지를 출력하고 실패 상태로 끝냅니다. |
| `for (i, line) in stdin.lock().lines().enumerate()` | 줄마다 `io::Result<String>`입니다. `enumerate`로 줄 번호를 붙였습니다.                                                                |
| `let line = line?;`                                 | 읽기 실패는 이 프로그램이 할 수 있는 일이 없으니 위로 보냅니다.                                                                       |
| `match parse_line(&line) { ... }`                   | 해석 실패는 그 줄만 알리고 **계속**합니다. 그래서 `?` 대신 `match`를 썼습니다.                                                        |
| `line.trim().parse::<i64>()`                        | `"  20 "`처럼 앞뒤 공백이 있어도 읽히게 `trim`했습니다. 빈 줄은 먼저 건너뜁니다.                                                      |
| `total += word.parse::<i64>()?;`                    | `sum_of`는 하나라도 틀리면 전체가 틀린 것으로 봅니다. 첫 오류에서 곧바로 `Err`를 돌려줍니다.                                          |
| `.map_err(\|e\| e.to_string())`                     | 출력에서 오류 구조 대신 메시지를 보이게 `String`으로 바꿨습니다.                                                                      |
| `"abc".parse::<i64>().unwrap_or(0)`                 | 틀리면 0입니다. 편하지만 틀린 입력을 숨긴다는 점을 기억하세요.                                                                        |

## 6. C로 구현하기

```c
// 파일: read_numbers.c
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 성공하면 1과 *out, 실패하면 0과 이유 문자열 *why
int parse_line(const char *line, long long *out, const char **why) {
    char *end;
    errno = 0;
    long long v = strtoll(line, &end, 10);
    while (*end == ' ' || *end == '\n' || *end == '\t') {
        end++;                              // 뒤쪽 공백은 허용
    }
    if (end == line || *end != '\0') {
        *why = "숫자가 아님";
        return 0;
    }
    if (errno == ERANGE) {
        *why = "범위를 넘음";
        return 0;
    }
    *out = v;
    return 1;
}

int main(void) {
    char line[128];
    long long total = 0;
    int bad = 0, line_no = 0;
    while (fgets(line, sizeof line, stdin) != NULL) {
        line_no++;
        if (strspn(line, " \t\n") == strlen(line)) {
            continue;                       // 빈 줄
        }
        long long v;
        const char *why;
        if (parse_line(line, &v, &why)) {
            total += v;
        } else {
            bad++;
            line[strcspn(line, "\n")] = '\0';
            printf("%d번째 줄 \"%s\": %s\n", line_no, line, why);
        }
    }
    printf("합계 %lld, 잘못된 줄 %d개\n", total, bad);
    return 0;
}
```

입력:

```text
10
  20
thirty

-5
9999999999999999999
```

실행 결과:

```text
3번째 줄 "thirty": 숫자가 아님
6번째 줄 "9999999999999999999": 범위를 넘음
합계 25, 잘못된 줄 2개
```

### 코드 한 부분씩 읽기

| 코드                                                                 | 설명                                                                                                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `int parse_line(const char *line, long long *out, const char **why)` | 성공 여부는 반환값, 결과는 `*out`, 실패 이유는 `*why`로 돌려줍니다(Day 43). Rust의 `Result<i64, 오류>` 하나가 하는 일을 세 곳에 나눴습니다. |
| `errno = 0; long long v = strtoll(line, &end, 10);`                  | `strtoll`은 범위를 넘으면 가장 큰 값을 돌려주고 `errno`를 `ERANGE`로 바꿉니다. 미리 0으로 지워 둬야 이번 호출의 결과인지 알 수 있습니다.    |
| `while (*end == ' ' \|\| ...) { end++; }`                            | 뒤쪽 공백과 줄바꿈은 허용했습니다. 앞쪽 공백은 `strtoll`이 스스로 건너뜁니다.                                                               |
| `if (end == line \|\| *end != '\0')`                                 | 숫자가 없거나 뒤에 다른 글자가 남았으면 실패입니다.                                                                                         |
| `strspn(line, " \t\n") == strlen(line)`                              | 줄 전체가 공백이면 빈 줄로 보고 건너뜁니다.                                                                                                 |
| `line[strcspn(line, "\n")] = '\0';`                                  | 출력하기 전에 줄바꿈을 지웠습니다. `fgets`는 줄바꿈을 남깁니다.                                                                             |

## 7. Python으로 구현하기

```python
# 파일: read_numbers.py
import sys

total = 0
bad = 0
for line_no, line in enumerate(sys.stdin, start=1):
    if not line.strip():
        continue
    try:
        total += int(line)                  # int는 앞뒤 공백을 알아서 무시한다
    except ValueError as e:
        bad += 1
        print(f"{line_no}번째 줄 {line.strip()!r}: {e}")
print(f"합계 {total}, 잘못된 줄 {bad}개")
print("큰 수도 된다:", int("9999999999999999999") + 1)
```

입력:

```text
10
  20
thirty

-5
9999999999999999999
```

실행 결과:

```text
3번째 줄 'thirty': invalid literal for int() with base 10: 'thirty\n'
합계 10000000000000000024, 잘못된 줄 1개
큰 수도 된다: 10000000000000000000
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `for line_no, line in enumerate(sys.stdin, start=1):` | 표준 입력도 파일형 객체라 줄 단위로 돕니다(Day 47). 줄바꿈은 남아 있습니다.                                                                                        |
| `total += int(line)`                                  | `int`는 앞뒤 공백과 줄바꿈을 알아서 무시합니다. 오류 메시지에 `'thirty\n'`처럼 줄바꿈이 보이는 이유는 줄을 그대로 넘겼기 때문입니다.                               |
| `except ValueError as e:`                             | 해석 실패는 예외로 옵니다. 그 줄만 알리고 계속합니다.                                                                                                              |
| 합계 `10000000000000000024`                           | Python 정수는 크기 제한이 없어서 마지막 줄도 **정상**입니다. 같은 입력이 C와 Rust에서는 오류, Python에서는 성공입니다. 자료형의 범위가 곧 입력 검사 규칙이 됩니다. |

## 8. 실행 추적

Rust 예제의 읽기 반복에서 줄마다 무슨 일이 일어나는지 따라갑니다.

| 줄 번호 | 읽은 줄                 | 빈 줄? | `parse_line`               | `total` | `bad` |
| ------- | ----------------------- | ------ | -------------------------- | ------- | ----- |
| 1       | `"10"`                  | 아니요 | `Ok(10)`                   | 10      | 0     |
| 2       | `"  20 "`               | 아니요 | `Ok(20)`(trim 뒤)          | 30      | 0     |
| 3       | `"thirty"`              | 아니요 | `Err(InvalidDigit)` → 출력 | 30      | 1     |
| 4       | `""`                    | 예     | (건너뜀)                   | 30      | 1     |
| 5       | `"-5"`                  | 아니요 | `Ok(-5)`                   | 25      | 1     |
| 6       | `"9999999999999999999"` | 아니요 | `Err(PosOverflow)` → 출력  | 25      | 2     |

줄 번호는 빈 줄도 포함해서 세므로, 오류 메시지의 번호가 입력 파일의 실제 줄과 맞습니다.

## 9. 다른 예제로 다시 이해하기

**명령 계산기.** 값 하나를 0에서 시작해, 한 줄에 하나씩 들어오는 명령으로 바꿉니다. 명령은 `add n`, `sub n`, `mul n`, `div n`, `show`입니다. 틀린 명령은 이유를 알려 주고 **값은 그대로** 둡니다.

```rust
// 파일: calc_commands.rs
use std::fmt;
use std::io::{self, BufRead};
use std::num::ParseIntError;

#[derive(Debug)]
enum CmdError {
    Unknown(String),
    MissingNumber,
    BadNumber(ParseIntError),
    DivideByZero,
}

impl fmt::Display for CmdError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            CmdError::Unknown(c) => write!(f, "모르는 명령 {c:?}"),
            CmdError::MissingNumber => write!(f, "숫자가 필요함"),
            CmdError::BadNumber(e) => write!(f, "숫자 오류 ({e})"),
            CmdError::DivideByZero => write!(f, "0으로 나눌 수 없음"),
        }
    }
}

impl From<ParseIntError> for CmdError {    // ?가 ParseIntError를 CmdError로 바꿀 수 있게
    fn from(e: ParseIntError) -> Self {
        CmdError::BadNumber(e)
    }
}

fn apply(acc: i64, line: &str) -> Result<i64, CmdError> {
    let mut parts = line.split_whitespace();
    let cmd = parts.next().unwrap_or("");
    if cmd == "show" {
        return Ok(acc);
    }
    let n: i64 = parts.next().ok_or(CmdError::MissingNumber)?.parse()?;   // 여기서 From이 쓰인다
    match cmd {
        "add" => Ok(acc + n),
        "sub" => Ok(acc - n),
        "mul" => Ok(acc * n),
        "div" if n == 0 => Err(CmdError::DivideByZero),
        "div" => Ok(acc / n),
        other => Err(CmdError::Unknown(other.to_string())),
    }
}

fn main() -> io::Result<()> {
    let mut acc = 0;
    for line in io::stdin().lock().lines() {
        let line = line?;
        match apply(acc, &line) {
            Ok(v) => {
                acc = v;
                println!("{:<8} → {acc}", line.trim());
            }
            Err(e) => println!("{:<8} → 오류: {e} (값은 그대로 {acc})", line.trim()),
        }
    }
    Ok(())
}
```

입력:

```text
add 10
mul 3
sub x
div 0
add
pow 2
div 4
show
```

실행 결과:

```text
add 10   → 10
mul 3    → 30
sub x    → 오류: 숫자 오류 (invalid digit found in string) (값은 그대로 30)
div 0    → 오류: 0으로 나눌 수 없음 (값은 그대로 30)
add      → 오류: 숫자가 필요함 (값은 그대로 30)
pow 2    → 오류: 모르는 명령 "pow" (값은 그대로 30)
div 4    → 7
show     → 7
```

| 코드                                                                                       | 설명                                                                                                           |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `enum CmdError { Unknown(String), MissingNumber, BadNumber(ParseIntError), DivideByZero }` | 실패의 종류를 모두 적었습니다. `BadNumber`는 원래 오류를 안에 담아 원인을 잃지 않습니다.                       |
| `impl fmt::Display for CmdError`                                                           | 사람이 읽을 문장을 정합니다. `{e}`로 출력할 때 쓰입니다.                                                       |
| `impl From<ParseIntError> for CmdError`                                                    | 이 구현이 있어서 `parse()?`가 `ParseIntError`를 `CmdError::BadNumber`로 **자동으로** 바꿉니다.                 |
| `parts.next().ok_or(CmdError::MissingNumber)?.parse()?`                                    | 두 번의 `?`가 한 줄에 있습니다. 숫자 자리가 없으면 `MissingNumber`, 숫자가 틀리면 `BadNumber`입니다.           |
| `"div" if n == 0 => Err(CmdError::DivideByZero)`                                           | `match`의 조건(가드)으로 0 나누기를 먼저 걸렀습니다. Rust에서 정수를 0으로 나누면 패닉이라 미리 막아야 합니다. |
| `Err(e) => println!(... 값은 그대로 {acc})`                                                | 오류가 나도 `acc`를 바꾸지 않습니다. `apply`가 새 값을 돌려주는 설계라 실패하면 옛 값이 자연스럽게 남습니다.   |
| `30 / 4` → `7`                                                                             | 정수 나눗셈은 0 쪽으로 버립니다.                                                                               |

Python에서는 오류를 예외 클래스 하나로 만들고, 원인은 `from`으로 잇습니다.

```python
# 파일: calc_commands.py
import sys


class CmdError(Exception):
    pass


def apply(acc, line):
    parts = line.split()
    cmd = parts[0] if parts else ""
    if cmd == "show":
        return acc
    if len(parts) < 2:
        raise CmdError("숫자가 필요함")
    try:
        n = int(parts[1])
    except ValueError as e:
        raise CmdError(f"숫자 오류 ({e})") from e
    if cmd == "add":
        return acc + n
    if cmd == "sub":
        return acc - n
    if cmd == "mul":
        return acc * n
    if cmd == "div":
        if n == 0:
            raise CmdError("0으로 나눌 수 없음")
        return int(acc / n)                 # Rust처럼 0 쪽으로 버림(// 는 아래쪽으로 버림)
    raise CmdError(f"모르는 명령 {cmd!r}")


acc = 0
for line in sys.stdin:
    try:
        acc = apply(acc, line)
        print(f"{line.strip():<8} → {acc}")
    except CmdError as e:
        print(f"{line.strip():<8} → 오류: {e} (값은 그대로 {acc})")
```

입력:

```text
add 10
mul 3
sub x
div 0
add
pow 2
div 4
show
```

실행 결과:

```text
add 10   → 10
mul 3    → 30
sub x    → 오류: 숫자 오류 (invalid literal for int() with base 10: 'x') (값은 그대로 30)
div 0    → 오류: 0으로 나눌 수 없음 (값은 그대로 30)
add      → 오류: 숫자가 필요함 (값은 그대로 30)
pow 2    → 오류: 모르는 명령 'pow' (값은 그대로 30)
div 4    → 7
show     → 7
```

- `acc = apply(acc, line)`은 성공했을 때만 대입됩니다. 예외가 나면 대입 전에 `except`로 가서 값이 그대로입니다.
- `int(acc / n)`은 Rust처럼 0 쪽으로 버립니다. Python의 `//`는 음수에서 아래쪽으로 버려서(-7 // 2 = -4) 결과가 달라질 수 있습니다. 다만 `/`는 실수 계산이라 아주 큰 수에서는 정확하지 않습니다.
- Python은 오류 종류를 예외 클래스 하나(`CmdError`)와 메시지로 나타냈습니다. 종류별로 다르게 처리해야 한다면 `class MissingNumber(CmdError)`처럼 자식 클래스를 만듭니다.

## 10. 실패 처리 대응표

| 하고 싶은 일                  | Rust                      | C                                           | Python                      |
| ----------------------------- | ------------------------- | ------------------------------------------- | --------------------------- |
| 문자열을 정수로               | `s.trim().parse::<i64>()` | `strtoll(s, &end, 10)` + `end`·`errno` 검사 | `int(s)`                    |
| 실패 이유                     | `Err(e)`, `e.kind()`      | `errno`, 직접 만든 이유 값                  | 예외 메시지                 |
| 실패를 위로 보내기            | `?`                       | 반환 코드를 직접 전달                       | 잡지 않으면 자동            |
| 오류를 우리 자료형으로 바꾸기 | `From` 구현, `map_err`    | 반환 코드 설계                              | `raise MyError(...) from e` |
| 이 자리에서 처리하고 계속     | `match`                   | `if (!parse(...))`                          | `try` / `except`            |
| 기본값으로 대신하기           | `unwrap_or(v)`            | 실패 시 대입하지 않음                       | `except: x = v`             |
| 범위를 넘는 수                | `Err(PosOverflow)`        | `errno == ERANGE`                           | 문제없음(크기 제한 없음)    |

## 11. 세 언어 비교

| 관점                      | Rust                                | C                     | Python                  |
| ------------------------- | ----------------------------------- | --------------------- | ----------------------- |
| 실패 가능성이 드러나는 곳 | 반환 자료형(`Result`)               | 문서와 반환값 관례    | 드러나지 않음(문서)     |
| 확인을 빼먹으면           | 값을 꺼낼 수 없음(컴파일 오류·경고) | 틀린 값으로 계속 실행 | 예외로 멈춤             |
| 여러 오류 종류            | `enum`, `Box<dyn Error>`            | 번호, 문자열          | 예외 클래스 계층        |
| 원인 잇기                 | 변형 안에 담기, `source()`          | 없음                  | `__cause__`             |
| 입력 한 줄의 줄바꿈       | `lines()`는 뗌, `read_line`은 남김  | `fgets`는 남김        | 남김(`int`는 무시해 줌) |

## 12. 자주 하는 실수

### 실수 1: Result를 돌려주지 않는 함수에서 ?를 쓴다

```rust
// 파일: question_in_main.rs (컴파일 오류: E0277)
fn main() {
    let n: i32 = "42".parse()?;
    println!("{n}");
}
```

`?`는 오류를 돌려줄 곳이 있어야 합니다. `fn main() -> Result<(), Box<dyn std::error::Error>>`로 바꾸고 끝에 `Ok(())`를 쓰세요.

### 실수 2: ?가 바꿀 수 없는 오류를 보낸다

```rust
// 파일: cannot_convert.rs (컴파일 오류: E0277)
fn double(s: &str) -> Result<i64, String> {
    let n: i64 = s.parse()?;
    Ok(n * 2)
}

fn main() {
    println!("{:?}", double("21"));
}
```

실습의 디버그 문제입니다. `map_err`로 바꾸거나, 오류 `enum`에 `From`을 구현하세요.

### 실수 3: read_line의 줄바꿈을 잊는다

```rust
// 파일: newline_left.rs
use std::io;

fn main() -> io::Result<()> {
    let mut s = String::new();
    io::stdin().read_line(&mut s)?;
    match s.parse::<i32>() {
        Ok(n) => println!("읽음 {n}"),
        Err(e) => println!("실패: {e} ({s:?})"),
    }
    Ok(())
}
```

입력:

```text
42
```

실행 결과:

```text
실패: invalid digit found in string ("42\n")
```

`s.trim().parse()`로 쓰세요. `{s:?}`로 출력해 보면 눈에 보이지 않던 줄바꿈이 드러납니다.

### 실수 4: 사용자 입력에 unwrap을 쓴다

`let n: i32 = line.trim().parse().unwrap();`은 사용자가 글자 하나만 잘못 쳐도 프로그램이 멈춥니다. 입력을 다시 받거나 그 줄을 건너뛰도록 `match`로 처리하세요.

### 실수 5: 틀린 입력을 조용히 기본값으로 바꾼다

`unwrap_or(0)`은 편하지만, 틀린 줄이 합계에 0으로 섞여도 아무도 모릅니다. 기본값이 정말 맞는 상황(선택 항목이 비어 있을 때 등)에만 쓰고, 그렇지 않으면 오류를 알리세요.

## 13. Q&A

**Q. Box<dyn Error>의 dyn은 무슨 뜻인가요?**

A. "실행할 때 정해지는(dynamic) 어떤 자료형"이라는 뜻입니다. `dyn Error`는 `Error` 트레이트를 구현한 무엇이든 될 수 있고, 크기가 정해지지 않아서 `Box`에 담습니다(Day 41). 트레이트 객체는 Day 54에서 자세히 배웁니다.

**Q. 오류 enum을 만들 때마다 Display와 From을 다 써야 하나요?**

A. 표준 라이브러리만으로는 그렇습니다. 실무에서는 `thiserror` 크레이트로 이 코드를 자동으로 만들고, 애플리케이션의 `main`에서는 `anyhow` 크레이트로 `Box<dyn Error>`를 더 편하게 씁니다. 이 과정에서는 외부 크레이트 없이 원리를 익힙니다.

**Q. 패닉과 Err는 언제 구별하나요?**

A. **프로그램의 버그**(절대 일어나면 안 되는 상태, 예: 배열 범위 밖)는 패닉, **바깥 세상 때문에 생길 수 있는 실패**(파일 없음, 잘못된 입력)는 `Result`입니다. 사용자는 버그가 아닌 실패를 겪어도 프로그램이 멈추지 않기를 기대합니다.

**Q. C에서 strtoll 대신 atoi를 쓰면 안 되나요?**

A. `atoi("abc")`는 0을, `atoi("99999999999")`는 정의되지 않은 값을 돌려주고, 실패했다는 사실을 알려 주지 않습니다. 입력 검사가 필요하면 `strtol`/`strtoll`과 `end`, `errno`를 쓰세요.

## 14. 핵심 요약

- 입력 처리에는 **읽기 실패**(`io::Error`)와 **해석 실패**(`ParseIntError` 등)가 있고, 보통 앞의 것은 멈추고 뒤의 것은 그 줄만 알리고 계속합니다.
- `lines()`는 줄바꿈을 떼어 주고, `read_line`은 남깁니다. `parse` 전에 `trim()`하세요.
- `?`는 `Ok`면 값을 꺼내고, `Err`면 `From`으로 바꾼 오류를 **곧바로 돌려줍니다.** `main`도 `Result`를 돌려줄 수 있습니다.
- 작은 프로그램은 `Box<dyn Error>`, 종류별 처리가 필요하면 직접 만든 오류 `enum` + `Display` + `From`을 씁니다.
- `unwrap`·`expect`는 패닉, `unwrap_or`는 기본값, `map_err`·`ok_or`는 오류 자료형 맞추기입니다. 사용자 입력에는 `match`나 `?`를 쓰세요.
- C는 `strtoll`의 `end`와 `errno`로, Python은 예외로 같은 검사를 합니다. Python 정수는 크기 제한이 없어 범위 오류가 없습니다.

## 15. 도전 문제

1. **(Rust)** 계산기에 `undo` 명령을 추가하세요. 성공한 명령마다 이전 값을 `Vec`에 쌓아 두고, `undo`는 꺼내서 되돌립니다. 되돌릴 것이 없으면 오류 변형 `NothingToUndo`를 돌려줍니다.
2. **(Rust)** 첫 번째 예제를 `fn read_numbers(r: impl BufRead) -> Result<(i64, Vec<(usize, String)>), io::Error>`로 바꿔 합계와 오류 목록을 함께 돌려주고, `Cursor`로 시험하세요(Day 47).
3. **(C)** 계산기를 C로 만드세요. 명령과 숫자는 `sscanf(line, "%15s %lld", cmd, &n)`의 반환값(1이면 숫자 없음)으로 구별하고, 오류 종류는 `enum`으로 나타냅니다.
4. **(Python)** 계산기의 `CmdError`를 `MissingNumber`, `BadNumber`, `UnknownCommand` 자식 클래스로 나누고, `except MissingNumber:`로 그 종류만 다르게 처리해 보세요.
