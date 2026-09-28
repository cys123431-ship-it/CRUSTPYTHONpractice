---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-89-rust-record-parse
courseId: crp-92
phaseId: phase-08
dayNumber: 89
date: "2026-12-28"
title: Rust 타입으로 레코드 검증
summary: Study Log Analyzer의 Rust 구현에서 입력을 읽고 검증하는 부분을 자료형으로 설계합니다. 문자열 대신 검증된 값만 담는 자료형, 즉 언어 enum과 FromStr 구현("Python".parse::<Language>()), 1~10080만 담을 수 있는 새 자료형 Minutes와 TryFrom<&str>, 결과 enum을 만들고, 줄 번호와 이유를 담는 RowError와 Display, map_err로 오류를 줄 번호와 함께 감싸는 법을 다룹니다. 파일 전체 글을 한 글자씩 읽어 따옴표 안의 줄바꿈과 CRLF까지 다루는 rows 파서를 만들고, Python csv 모듈과 결과를 비교하면서 C 구현이 따옴표 안의 줄바꿈을 거절한다는 세 구현 사이의 실제 차이도 확인합니다. 같은 설계를 C(문자열 → enum 함수, enum을 배열 번호로)와 Python(Enum 값으로 멤버 찾기, dataclass __post_init__ 검사)으로 옮깁니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-88-c-aggregation]
learningObjectives:
  - FromStr과 TryFrom을 구현해 문자열을 검증된 enum·새 자료형으로 바꾼다.
  - 잘못된 값은 만들 수 없는 자료형(Minutes)으로 검증을 한곳에 모은다.
  - 줄 번호를 담은 오류 구조체와 Display를 만들고, map_err로 낮은 수준의 오류를 감싼다.
  - 따옴표 안의 줄바꿈과 CRLF를 다루는 파일 전체 CSV 파서를 만들고 Python csv와 비교한다.
  - 세 구현 사이의 실제 차이(C의 여러 줄 칸 거절)를 찾아 계약의 빈틈으로 설명한다.
concepts:
  [
    fromstr,
    tryfrom,
    newtype,
    parse dont validate,
    enum parse,
    error struct,
    display,
    map err,
    closure capture,
    csv state machine,
    multiline field,
    crlf,
    peekable,
    mem take,
    python enum lookup,
    post init,
    c string to enum,
    contract gap,
  ]
runnerMode: python
playgroundSource: |
  # 파일: enum_lookup.py — 값으로 Enum 멤버를 찾아 보세요.
  from enum import Enum

  class Language(Enum):
      C = "C"
      PYTHON = "Python"
      RUST = "Rust"

  print(Language("Rust"), Language("Rust").name)
  try:
      Language("Go")
  except ValueError as e:
      print("ValueError:", e)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day89-predict-fromstr
    title: FromStr로 enum 읽기 예측하기
    kind: predict
    objective: parse가 FromStr 구현을 따라 대소문자까지 정확히 비교한다는 것을 확인한다.
    prompt: 출력되는 두 줄을 그대로 적으세요.
    starter: |-
      use std::str::FromStr;

      #[derive(Debug)]
      enum Language {
          C,
          Python,
          Rust,
      }

      impl FromStr for Language {
          type Err = String;
          fn from_str(s: &str) -> Result<Self, Self::Err> {
              match s {
                  "C" => Ok(Language::C),
                  "Python" => Ok(Language::Python),
                  "Rust" => Ok(Language::Rust),
                  other => Err(format!("모르는 언어 {other:?}")),
              }
          }
      }

      fn main() {
          println!("{} {}", "Rust".parse::<Language>().is_ok(), "rust".parse::<Language>().is_ok());
          println!("{:?}", "C".parse::<Language>());
      }
    answer: |-
      true false
      Ok(C)
    hint: "FromStr을 구현하면 문자열의 parse 메서드가 그 코드를 부릅니다. match는 글자가 정확히 같아야 맞습니다."
    explanation: '"rust"는 "Rust"와 다르므로 마지막 팔에서 Err입니다. 계약이 대소문자를 구별하므로(Day 83) 이것이 올바른 동작입니다. FromStr을 한 번 구현해 두면 옵션 읽기, CSV 읽기 어디서든 s.parse::<Language>()로 같은 규칙을 씁니다. 결과는 Result<Language, String>이라 {:?}로 Ok(C)가 출력됩니다.'
    commonMistakes:
      - "parse가 대소문자를 무시한다고 생각함"
      - "Ok(Language::C)로 적음(Debug는 변형 이름만 보여 줌)"
    language: rust
    verification: run
  - id: ex-day89-predict-newtype
    title: 새 자료형 Minutes 만들기 예측하기
    kind: predict
    objective: TryFrom이 범위 밖 값으로는 Minutes를 만들지 않는다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      struct Minutes(u32);

      impl TryFrom<&str> for Minutes {
          type Error = String;
          fn try_from(s: &str) -> Result<Self, Self::Error> {
              match s.parse::<u32>() {
                  Ok(m) if !s.starts_with('0') && (1..=10080).contains(&m) => Ok(Minutes(m)),
                  _ => Err(format!("minutes 오류 {s:?}")),
              }
          }
      }

      fn main() {
          println!("{:?} {}", Minutes::try_from("45").map(|m| m.0), Minutes::try_from("0").is_err());
      }
    answer: "Ok(45) true"
    hint: '"0"은 앞자리 0 검사와 범위 검사 둘 다에 걸립니다.'
    explanation: "Minutes를 만드는 길이 try_from뿐이면(다른 모듈에서는 필드가 비공개라 Minutes(0)을 쓸 수 없음), Minutes 값을 받은 코드는 '1~10080'을 다시 확인할 필요가 없습니다. 이런 설계를 '검사하지 말고 해석하라(parse, don't validate)'라고 부릅니다. map(|m| m.0)으로 안의 숫자만 꺼내 출력했습니다."
    commonMistakes:
      - '"0"이 u32로는 읽히니 Ok라고 생각함'
      - "try_from이 패닉을 낸다고 생각함"
    language: rust
    verification: run
  - id: ex-day89-fill
    title: 문자열 해석 trait 채우기
    kind: fill
    objective: parse가 쓸 수 있도록 표준 trait을 구현한다.
    prompt: '빈칸을 채워 "C".parse::<Language>()가 동작하고 ''Ok(C)''가 출력되게 하세요.'
    starter: |-
      use std::str::FromStr;

      #[derive(Debug)]
      enum Language {
          C,
          Rust,
      }

      impl _____ for Language {
          type Err = String;
          fn from_str(s: &str) -> Result<Self, Self::Err> {
              match s {
                  "C" => Ok(Language::C),
                  "Rust" => Ok(Language::Rust),
                  other => Err(other.to_string()),
              }
          }
      }

      fn main() {
          println!("{:?}", "C".parse::<Language>());
      }
    answer: |-
      use std::str::FromStr;

      #[derive(Debug)]
      enum Language {
          C,
          Rust,
      }

      impl FromStr for Language {
          type Err = String;
          fn from_str(s: &str) -> Result<Self, Self::Err> {
              match s {
                  "C" => Ok(Language::C),
                  "Rust" => Ok(Language::Rust),
                  other => Err(other.to_string()),
              }
          }
      }

      fn main() {
          println!("{:?}", "C".parse::<Language>());
      }
    output: "Ok(C)"
    hint: '"문자열로부터(from str)" 만드는 능력의 이름입니다. use로 이미 가져왔습니다.'
    explanation: "str::parse::<T>()는 T가 FromStr을 구현하면 T::from_str을 부릅니다. 그래서 i32, f64, IpAddr 같은 표준 자료형도 parse로 읽을 수 있는 것입니다(Day 54의 trait). type Err는 실패했을 때 돌려줄 오류 자료형입니다."
    commonMistakes:
      - "From<&str>을 구현해 실패를 표현하지 못함(From은 실패하지 않는 변환)"
      - "impl Language for FromStr로 순서를 거꾸로 씀"
    language: rust
    verification: run
  - id: ex-day89-modify
    title: 패닉하는 해석을 Result로 바꾸기
    kind: modify
    objective: 잘못된 입력에서 패닉 대신 오류를 돌려주는 enum 해석으로 바꾼다.
    prompt: 'is_pass는 모르는 결과 값에서 패닉합니다. enum Outcome { Pass, Retry }와 fn outcome(s: &str) -> Result<Outcome, String>으로 바꿔 ''Pass Retry 오류: "done"''이 출력되게 하세요.'
    starter: |-
      fn is_pass(s: &str) -> bool {
          match s {
              "pass" => true,
              "retry" => false,
              _ => panic!("모르는 결과"),
          }
      }

      fn main() {
          for s in ["pass", "retry", "done"] {
              print!("{} ", is_pass(s));
          }
      }
    answer: |-
      #[derive(Debug)]
      enum Outcome {
          Pass,
          Retry,
      }

      fn outcome(s: &str) -> Result<Outcome, String> {
          match s {
              "pass" => Ok(Outcome::Pass),
              "retry" => Ok(Outcome::Retry),
              other => Err(format!("{other:?}")),
          }
      }

      fn main() {
          for s in ["pass", "retry", "done"] {
              match outcome(s) {
                  Ok(o) => print!("{o:?} "),
                  Err(e) => println!("오류: {e}"),
              }
          }
      }
    output: 'Pass Retry 오류: "done"'
    hint: "bool은 두 값뿐이라 '모름'을 담을 수 없습니다. 세 가지 결과(Pass, Retry, 오류)를 자료형으로 나타내세요."
    explanation: "bool로 결과를 나타내면 pass가 아닌 모든 것이 false(retry)로 섞이거나, 모르는 값에서 패닉해야 합니다. enum과 Result를 쓰면 '두 가지 정상 값'과 '잘못된 입력'이 자료형에서 구별되고, 부르는 쪽이 오류를 처리하도록 강제됩니다. 사용자 입력 때문에 패닉하는 코드는 버그입니다(Day 48)."
    commonMistakes:
      - "Err 팔에서 여전히 panic!을 부름"
      - "_ => Ok(Outcome::Retry)로 모르는 값을 retry로 처리함"
    language: rust
    verification: run
  - id: ex-day89-debug
    title: 오류 자료형이 달라 ?가 안 되는 문제 고치기
    kind: debug
    objective: map_err로 String 오류를 줄 번호가 든 RowError로 감싼다.
    prompt: '이 코드는 E0277(`?` couldn''t convert the error to `RowError`) 오류로 컴파일되지 않습니다. map_err로 RowError를 만들어 ''3행: 모르는 언어 "Go"''가 출력되게 하세요.'
    starter: |-
      use std::fmt;

      struct RowError {
          line: usize,
          reason: String,
      }

      impl fmt::Display for RowError {
          fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
              write!(f, "{}행: {}", self.line, self.reason)
          }
      }

      fn language(s: &str) -> Result<&'static str, String> {
          match s {
              "C" | "Python" | "Rust" => Ok("ok"),
              other => Err(format!("모르는 언어 {other:?}")),
          }
      }

      fn check(s: &str, line: usize) -> Result<(), RowError> {
          language(s)?;
          Ok(())
      }

      fn main() {
          if let Err(e) = check("Go", 3) {
              println!("{e}");
          }
      }
    answer: |-
      use std::fmt;

      struct RowError {
          line: usize,
          reason: String,
      }

      impl fmt::Display for RowError {
          fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
              write!(f, "{}행: {}", self.line, self.reason)
          }
      }

      fn language(s: &str) -> Result<&'static str, String> {
          match s {
              "C" | "Python" | "Rust" => Ok("ok"),
              other => Err(format!("모르는 언어 {other:?}")),
          }
      }

      fn check(s: &str, line: usize) -> Result<(), RowError> {
          language(s).map_err(|reason| RowError { line, reason })?;
          Ok(())
      }

      fn main() {
          if let Err(e) = check("Go", 3) {
              println!("{e}");
          }
      }
    output: '3행: 모르는 언어 "Go"'
    hint: "String에서 RowError로 가는 From이 없습니다. 줄 번호는 check만 알고 있으니 그 자리에서 감싸야 합니다."
    explanation: "language는 줄 번호를 모르고, check는 알고 있습니다. 그래서 check에서 map_err로 이유(String)에 줄 번호를 붙여 RowError를 만듭니다. 클로저 |reason| RowError { line, reason }은 바깥 변수 line을 붙잡아 씁니다(필드 이름과 변수 이름이 같아서 짧게 썼습니다). From<String>을 구현하면 ?가 자동으로 바꾸지만, 그러면 줄 번호를 넣을 수 없습니다."
    commonMistakes:
      - "From<String> for RowError를 구현하고 line을 0으로 채움"
      - "check의 반환 자료형을 String으로 바꿔 줄 번호를 잃음"
    language: rust
    verification: run
  - id: ex-day89-independent
    title: Python Enum으로 값 해석하기
    kind: independent
    objective: 값으로 Enum 멤버를 찾고, 없는 값은 ValueError로 처리한다.
    prompt: 'Language Enum(C, PYTHON = "Python", RUST = "Rust")을 만들고 Language("Python")의 이름과, Language("Go")에서 난 ValueError를 처리해 ''PYTHON 오류''를 한 줄로 출력하세요.'
    starter: |-
      from enum import Enum

      print("여기에 Language를 만들어 보세요")
    answer: |-
      from enum import Enum


      class Language(Enum):
          C = "C"
          PYTHON = "Python"
          RUST = "Rust"


      print(Language("Python").name, end=" ")
      try:
          Language("Go")
      except ValueError:
          print("오류")
    output: "PYTHON 오류"
    hint: 'Enum 클래스를 값으로 부르면(Language("Python")) 그 값을 가진 멤버를 찾습니다.'
    explanation: 'Enum(값)은 Rust의 FromStr처럼 ''문자열 → 검증된 값'' 변환입니다. 없는 값은 ValueError라 계약의 다른 검증 오류와 같은 방식으로 처리할 수 있습니다. 멤버 이름(PYTHON)과 값("Python")이 다르다는 점에 주의하세요. 출력에는 보통 값을 씁니다.'
    commonMistakes:
      - 'Language["Python"]으로 이름으로 찾아 KeyError가 남(이름은 PYTHON)'
      - "print를 두 번 해서 두 줄로 출력함"
    language: python
    verification: run
quiz:
  - id: quiz-day89-01
    question: 언어를 String 대신 enum Language로 담는 장점은?
    choices:
      - 메모리가 늘어난다
      - 잘못된 언어 이름을 담을 수 없고, match로 모든 경우를 다뤘는지 컴파일러가 확인한다
      - 출력이 빨라진다
      - 장점이 없다
    answerIndex: 1
    explanation: 문자열은 오타("Pyhton")도 담을 수 있어서 쓸 때마다 검사해야 합니다. enum은 읽을 때 한 번 검사하면 이후 모든 코드가 올바른 값만 받습니다. 정렬(derive Ord)과 비교도 공짜로 얻습니다.
  - id: quiz-day89-02
    question: FromStr과 TryFrom<&str>의 공통점은?
    choices:
      - 둘 다 실패할 수 없다
      - 둘 다 문자열로부터 값을 만들되 실패하면 오류를 돌려준다
      - 둘 다 출력용이다
      - 둘 다 C에만 있다
    answerIndex: 1
    explanation: FromStr은 s.parse::<T>()로, TryFrom은 T::try_from(s)로 부릅니다. 실패할 수 있는 변환에는 From 대신 이 둘을 씁니다. 실제 프로젝트는 간단히 함수와 matches!로 검사하지만, 오늘처럼 자료형으로 만들면 검사 규칙이 한곳에 모입니다.
  - id: quiz-day89-03
    question: 따옴표 안에 줄바꿈이 든 칸("둘째\n줄")을 세 구현이 어떻게 다루는가?
    choices:
      - 셋 다 거절한다
      - Rust와 Python은 받아들이고, C는 한 줄씩 읽어서 거절한다
      - 셋 다 받아들인다
      - C만 받아들인다
    answerIndex: 1
    explanation: C는 fgets로 한 줄씩 읽어 따옴표가 닫히지 않은 줄을 오류로 봅니다. Rust는 파일 전체를 글자 단위로 읽어 칸 안의 줄바꿈을 글자로 담고, Python csv도 받아들입니다. 계약이 이 경우를 정하지 않아서 생긴 차이입니다. 계약에 '여러 줄 칸 금지'를 적고 Rust·Python도 거절하게 하거나, C도 받아들이게 해야 합니다.
  - id: quiz-day89-04
    question: map_err(|reason| RowError { line, reason })에서 line은 어디서 오는가?
    choices:
      - 클로저의 인자
      - 클로저를 만든 함수의 변수를 붙잡아(capture) 쓴다
      - 전역 변수
      - reason에서
    answerIndex: 1
    explanation: 클로저는 자기가 만들어진 곳의 변수를 쓸 수 있습니다. usize는 Copy라 복사되어 붙잡힙니다. 오류를 만든 쪽(language)이 모르는 정보(줄 번호)를 아는 쪽(check)에서 붙이는 흔한 모양입니다.
  - id: quiz-day89-05
    question: rows 파서가 chars().peekable()을 쓰는 이유는?
    choices:
      - 빠르게 하려고
      - 따옴표를 만났을 때 다음 글자가 또 따옴표인지(""), \r 다음이 \n인지 미리 보고 판단하려고
      - 글자를 거꾸로 읽으려고
      - 필요 없다
    answerIndex: 1
    explanation: peek()은 다음 글자를 꺼내지 않고 들여다봅니다. "" 이면 next()로 하나를 더 소비하고, 아니면 그대로 둡니다. C 구현은 line[i + 1]로 같은 일을 합니다. 글자 단위(chars)라 한글도 안전합니다.
---

## 1. 오늘 배울 내용

Day 85(Python)와 Day 87(C)에서 입력 검증을 만들었습니다. 오늘은 **Rust**로 만듭니다. Rust에서는 검증을 함수로만 두지 않고 **자료형**으로 만듭니다.

1. 검증된 값만 담는 자료형
   - `enum Language` + `FromStr`: `"Python".parse::<Language>()`
   - 새 자료형 `struct Minutes(u32)` + `TryFrom<&str>`: 1~10080만
   - `enum Outcome { Pass, Retry }`
2. 줄 번호를 담은 오류
   - `struct RowError { line, reason }` + `Display`
   - `map_err`로 낮은 수준의 오류를 감싸기
3. 파일 전체를 읽는 CSV 파서 `rows`
   - 따옴표 안의 줄바꿈, CRLF, `""`, 닫는 따옴표 뒤의 글자
   - Python `csv`와 결과 비교
4. 세 구현 사이의 **실제 차이** 찾기: C는 따옴표 안의 줄바꿈을 거절합니다.
5. 같은 설계를 C(문자열 → enum)와 Python(`Enum`, `__post_init__`)으로 옮깁니다.

## 2. 왜 필요한가

Python과 C 구현에서 `language`는 끝까지 **문자열**이었습니다. 검증을 통과했다는 사실은 코드 어딘가의 약속일 뿐이라, 뒤의 코드가 실수로 검증하지 않은 문자열을 쓰면 아무도 막지 못합니다.

Rust에서는 "검증을 통과한 값"을 **다른 자료형**으로 만들 수 있습니다.

- `Language`는 세 값 중 하나만 될 수 있습니다. `"Pyhton"` 같은 오타는 담을 수 없습니다.
- `Minutes`는 `try_from`을 거쳐야만 만들어집니다. `Minutes`를 받은 함수는 범위를 다시 확인할 필요가 없습니다.
- 검증 규칙이 자료형 하나에 모여서, 규칙을 바꿀 때 한 곳만 고치면 됩니다.

이 방식을 흔히 "검사하지 말고 해석하라(parse, don't validate)"라고 부릅니다. 검사해서 참·거짓을 돌려주는 대신, **검사를 통과한 새 자료형**을 돌려주는 것입니다.

## 3. 그림으로 이해하기

**문자열에서 자료형으로.**

```text
바깥 세상(아무 문자열)                 안쪽(검증된 자료형만)
"Python"  ──parse::<Language>()──▶  Language::Python
"Go"      ──────────────────────▶  Err("모르는 언어 \"Go\"")
"30"      ──Minutes::try_from────▶  Minutes(30)
"030"     ──────────────────────▶  Err("minutes 모양 \"030\"")
"pass"    ──match───────────────▶  Outcome::Pass
                                     │
                                     ▼
                           Session { language, minutes, outcome }
                           (잘못된 Session은 만들 수 없다)
```

**오류에 줄 번호 붙이기.**

```text
Minutes::try_from("030")  → Err("minutes 모양 \"030\"")        (줄 번호를 모름)
        │ map_err(|reason| RowError { line: 4, reason })
        ▼
Err(RowError { line: 4, reason: "minutes 모양 \"030\"" })       (Display: "4행: minutes 모양 ...")
```

**파일 전체를 읽는 파서와 한 줄씩 읽는 파서.**

```text
글:  a,b\n"둘째\n줄",3\n
          └────────┘ 따옴표 안의 줄바꿈

Rust rows(전체 글):  [a,b] [둘째⏎줄, 3]        ← 칸 안의 줄바꿈을 글자로
Python csv:          [a,b] [둘째⏎줄, 3]
C fgets(한 줄씩):    "a,b"  →  "\"둘째"(따옴표가 닫히지 않은 채 줄 끝) → 오류
```

## 4. 천천히 풀어보기

### 4.1 FromStr과 TryFrom

| trait           | 부르는 법                | 쓰는 곳                              |
| --------------- | ------------------------ | ------------------------------------ |
| `FromStr`       | `s.parse::<T>()`         | "문자열을 해석해서 T로" — 숫자, enum |
| `TryFrom<&str>` | `T::try_from(s)`         | 여러 원천에서 실패할 수 있는 변환    |
| `From<T>`       | `U::from(t)`, `t.into()` | 실패하지 않는 변환(`u64::from(u32)`) |

둘 다 `type Err`/`type Error`로 실패했을 때의 오류 자료형을 정합니다.

### 4.2 새 자료형 패턴

```rust
struct Minutes(u32);
```

- 필드를 비공개로 두면(다른 모듈에서) `Minutes(0)`을 직접 쓸 수 없고, `try_from`만 쓸 수 있습니다.
- 속은 `u32` 하나라 실행 비용은 같습니다(Day 52).
- 함수 매개변수를 `minutes: Minutes`로 받으면 "이미 검증된 분"이라는 뜻이 자료형에 적힙니다.

### 4.3 오류 구조체와 map_err

오류가 난 **곳**과 줄 번호를 **아는 곳**이 다릅니다. `Minutes::try_from`은 줄 번호를 모르고, `parse_row`는 압니다. 그래서 `parse_row`에서 `map_err`로 감쌉니다.

```rust
let err = |reason: String| RowError { line, reason };
let minutes = Minutes::try_from(*minutes).map_err(err)?;
```

클로저 `err`는 바깥의 `line`을 붙잡아 두고, 여러 번 다시 쓸 수 있습니다.

### 4.4 rows 파서의 규칙

| 상황                               | 동작                                |
| ---------------------------------- | ----------------------------------- |
| 칸 맨 앞의 `"`                     | 따옴표 안으로                       |
| 따옴표 안의 `""`                   | 글자 `"` 하나                       |
| 따옴표 안의 `"`                    | 따옴표 밖으로(`after_quote = true`) |
| 따옴표 안의 줄바꿈                 | **글자로 담음**                     |
| `after_quote`인데 `,`·줄 끝이 아님 | 오류                                |
| 칸 중간의 `"`                      | 오류                                |
| `\r\n`                             | 줄 끝(`\r`은 버림)                  |
| `\r`만                             | 오류                                |
| 끝에 줄바꿈이 없음                 | 마지막 줄도 기록으로                |
| 따옴표가 닫히지 않은 채 끝         | 오류                                |

## 5. Rust로 구현하기

```rust
// 파일: typed_record.rs
use std::fmt;
use std::str::FromStr;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Language {
    C,
    Python,
    Rust,
}

impl FromStr for Language {                 // "Python".parse::<Language>()가 되게 한다
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "C" => Ok(Language::C),
            "Python" => Ok(Language::Python),
            "Rust" => Ok(Language::Rust),
            other => Err(format!("모르는 언어 {other:?}")),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
struct Minutes(u32);                        // 1~10080만 담을 수 있는 새 자료형

impl TryFrom<&str> for Minutes {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        if s.is_empty() || s.starts_with('0') || !s.bytes().all(|b| b.is_ascii_digit()) {
            return Err(format!("minutes 모양 {s:?}"));
        }
        match s.parse::<u32>() {
            Ok(m) if (1..=10080).contains(&m) => Ok(Minutes(m)),
            _ => Err(format!("minutes 범위 {s:?}")),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
enum Outcome {
    Pass,
    Retry,
}

#[derive(Debug)]
struct Session {
    language: Language,
    minutes: Minutes,
    outcome: Outcome,
}

#[derive(Debug)]
struct RowError {
    line: usize,
    reason: String,
}

impl fmt::Display for RowError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}행: {}", self.line, self.reason)
    }
}

fn parse_row(fields: &[&str], line: usize) -> Result<Session, RowError> {
    let err = |reason: String| RowError { line, reason };
    let [_, language, _, minutes, result] = fields else {
        return Err(err(format!("열 {}개", fields.len())));
    };
    let language: Language = language.parse().map_err(err)?;
    let minutes = Minutes::try_from(*minutes).map_err(err)?;
    let outcome = match *result {
        "pass" => Outcome::Pass,
        "retry" => Outcome::Retry,
        other => return Err(err(format!("결과 {other:?}"))),
    };
    Ok(Session { language, minutes, outcome })
}

fn main() {
    let rows: [&[&str]; 5] = [
        &["2026-10-01", "Python", "변수", "30", "pass"],
        &["2026-10-02", "Go", "x", "30", "pass"],
        &["2026-10-03", "C", "x", "030", "pass"],
        &["2026-10-04", "Rust", "x", "20000", "retry"],
        &["2026-10-05", "Rust", "x", "25", "done"],
    ];
    for (i, fields) in rows.iter().enumerate() {
        match parse_row(fields, i + 2) {
            Ok(s) => println!("OK {:?} {}분 {:?}", s.language, s.minutes.0, s.outcome),
            Err(e) => println!("오류 {e}"),
        }
    }
    let mut langs = vec![Language::Rust, Language::C, Language::Python];
    langs.sort();                           // enum은 선언 순서로 정렬(C < Python < Rust)
    println!("정렬된 언어: {langs:?}");
}
```

실행 결과:

```text
OK Python 30분 Pass
오류 3행: 모르는 언어 "Go"
오류 4행: minutes 모양 "030"
오류 5행: minutes 범위 "20000"
오류 6행: 결과 "done"
정렬된 언어: [C, Python, Rust]
```

### 코드 한 부분씩 읽기

| 코드                                                           | 설명                                                                                                                                      |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `impl FromStr for Language { type Err = String; ... }`         | `"Python".parse::<Language>()`가 이 코드를 부릅니다. 계약의 대소문자 구별도 여기서 한 번만 정합니다.                                      |
| `struct Minutes(u32);` / `impl TryFrom<&str> for Minutes`      | 모양(앞자리 0, 숫자만)과 범위를 모두 여기서 확인합니다. `Minutes`를 가진 코드는 1~10080이라고 믿을 수 있습니다.                           |
| `Ok(m) if (1..=10080).contains(&m) => Ok(Minutes(m))`          | `match`의 가드로 범위까지 확인합니다. 너무 큰 수(`parse` 실패)와 범위 밖(가드 실패)이 같은 `_` 팔로 갑니다.                               |
| `let err = \|reason: String\| RowError { line, reason };`      | 줄 번호를 붙잡은 클로저입니다. `map_err(err)`로 여러 번 씁니다.                                                                           |
| `let [_, language, _, minutes, result] = fields else { ... };` | 다섯 칸일 때만 풀고, 오늘 쓰지 않는 날짜와 주제는 `_`로 버렸습니다(Day 85).                                                               |
| `let language: Language = language.parse().map_err(err)?;`     | 변수 이름을 같게 다시 선언했습니다(가림, shadowing). 이 줄 뒤로 `language`는 문자열이 아니라 `Language`입니다.                            |
| `langs.sort()`                                                 | `derive(PartialOrd, Ord)`로 선언 순서(C < Python < Rust)대로 정렬됩니다. 이름 순과 우연히 같게 선언해 두어 계약의 출력 순서와도 맞습니다. |

## 6. C로 구현하기

C에서도 "문자열을 한 번 해석해 enum으로" 설계를 쓸 수 있습니다.

```c
// 파일: c_enums.c
#include <stdio.h>
#include <string.h>

enum language { LANG_C, LANG_PYTHON, LANG_RUST, LANG_INVALID };
enum outcome { PASS, RETRY, OUTCOME_INVALID };

static const char *LANGUAGE_NAMES[] = {"C", "Python", "Rust"};

enum language parse_language(const char *s) {   // 문자열 → enum(한곳에서만 비교)
    for (int i = 0; i < 3; i++) {
        if (strcmp(s, LANGUAGE_NAMES[i]) == 0) {
            return (enum language)i;
        }
    }
    return LANG_INVALID;
}

enum outcome parse_outcome(const char *s) {
    if (strcmp(s, "pass") == 0) {
        return PASS;
    }
    if (strcmp(s, "retry") == 0) {
        return RETRY;
    }
    return OUTCOME_INVALID;
}

typedef struct {
    enum language language;                 // 문자열 대신 검증된 enum을 담는다
    unsigned minutes;
    enum outcome outcome;
} Session;

int main(void) {
    const char *inputs[][2] = {{"Python", "pass"}, {"Go", "pass"}, {"Rust", "done"}, {"C", "retry"}};
    unsigned long long by_lang[3] = {0};
    for (int i = 0; i < 4; i++) {
        enum language l = parse_language(inputs[i][0]);
        enum outcome o = parse_outcome(inputs[i][1]);
        if (l == LANG_INVALID || o == OUTCOME_INVALID) {
            printf("%d행 오류: %s/%s\n", i + 2, inputs[i][0], inputs[i][1]);
            continue;
        }
        Session s = {l, 30, o};
        by_lang[s.language] += s.minutes;   // enum을 배열 번호로 바로 쓴다
        printf("%d행 OK: %s %u %s\n", i + 2, LANGUAGE_NAMES[s.language], s.minutes, s.outcome == PASS ? "pass" : "retry");
    }
    for (int k = 0; k < 3; k++) {
        printf("%s,%llu\n", LANGUAGE_NAMES[k], by_lang[k]);
    }
    return 0;
}
```

실행 결과:

```text
2행 OK: Python 30 pass
3행 오류: Go/pass
4행 오류: Rust/done
5행 OK: C 30 retry
C,30
Python,30
Rust,0
```

### 코드 한 부분씩 읽기

| 코드                                                              | 설명                                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum language { LANG_C, LANG_PYTHON, LANG_RUST, LANG_INVALID };` | 마지막에 "잘못됨"을 뜻하는 값을 두었습니다. Rust의 `Result`가 하는 일을 enum 값 하나로 흉내 냅니다.                                            |
| `static const char *LANGUAGE_NAMES[] = {...};`                    | enum 번호와 이름을 한 표로 맞췄습니다. 해석(`parse_language`)과 출력이 같은 표를 써서 어긋나지 않습니다.                                       |
| `return (enum language)i;`                                        | 표의 번호를 enum으로 바꿉니다. 표 순서와 enum 순서가 같아야 한다는 약속이 있습니다.                                                            |
| `Session s = {l, 30, o};`                                         | 문자열 대신 검증된 enum을 담았습니다. 이후 코드는 `strcmp` 없이 `s.language == LANG_C`처럼 비교합니다.                                         |
| `by_lang[s.language] += s.minutes;`                               | enum이 정수라 배열 번호로 바로 쓸 수 있습니다. 언어별 합계가 이름 순으로 저절로 나옵니다. 단, `LANG_INVALID`를 걸러야 배열 밖을 읽지 않습니다. |

## 7. Python으로 구현하기

```python
# 파일: typed_py.py
from dataclasses import dataclass
from enum import Enum


class Language(Enum):
    C = "C"
    PYTHON = "Python"
    RUST = "Rust"


class Outcome(Enum):
    PASS = "pass"
    RETRY = "retry"


@dataclass(frozen=True)
class Minutes:
    value: int

    def __post_init__(self):                # 만들어질 때마다 검사한다
        if not 1 <= self.value <= 10080:
            raise ValueError(f"minutes 범위 {self.value}")

    @classmethod
    def parse(cls, s):
        if not (s.isascii() and s.isdigit()) or s.startswith("0"):
            raise ValueError(f"minutes 모양 {s!r}")
        return cls(int(s))


def parse_row(fields, line):
    try:
        _, lang, _, minutes, result = fields
        return Language(lang), Minutes.parse(minutes), Outcome(result)   # 값으로 멤버 찾기
    except ValueError as e:                 # 풀기 실패, 없는 멤버, minutes 오류 모두 ValueError
        raise ValueError(f"{line}행: {e}") from None


rows = [["2026-10-01", "Python", "변수", "30", "pass"], ["d", "Go", "x", "30", "pass"],
        ["d", "C", "x", "030", "pass"], ["d", "Rust", "x", "20000", "retry"], ["d", "Rust", "x"]]
for i, fields in enumerate(rows, start=2):
    try:
        lang, minutes, outcome = parse_row(fields, i)
        print(f"OK {lang.name} {minutes.value}분 {outcome.name}")
    except ValueError as e:
        print("오류", e)
try:
    Minutes(0)
except ValueError as e:
    print("직접 만들어도 검사:", e)
```

실행 결과:

```text
OK PYTHON 30분 PASS
오류 3행: 'Go' is not a valid Language
오류 4행: minutes 모양 '030'
오류 5행: minutes 범위 20000
오류 6행: not enough values to unpack (expected 5, got 3)
직접 만들어도 검사: minutes 범위 0
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Language(lang)`, `Outcome(result)`            | 값으로 멤버를 찾습니다. 없으면 `ValueError`입니다. Rust의 `parse::<Language>()`에 해당합니다.                                                 |
| `def __post_init__(self)`                      | `dataclass`가 만든 `__init__` 뒤에 불립니다. 그래서 `Minutes(0)`처럼 **직접 만들어도** 검사를 거칩니다. Rust의 비공개 필드와 같은 효과입니다. |
| `@classmethod def parse(cls, s)`               | 문자열의 모양을 확인한 뒤 `cls(int(s))`로 만들어 범위 검사(`__post_init__`)까지 거칩니다.                                                     |
| `_, lang, _, minutes, result = fields`         | 다섯 개로 풀기입니다. 개수가 다르면 `ValueError`라서, 열 수 오류도 같은 `except`에서 잡혔습니다.                                              |
| `raise ValueError(f"{line}행: {e}") from None` | 줄 번호를 붙이고 원인은 숨겼습니다. Rust의 `map_err`에 해당합니다.                                                                            |

Python의 오류 문장(`'Go' is not a valid Language`, `not enough values to unpack`)은 실행기가 만든 것이라 C·Rust와 다릅니다. 실제 프로젝트의 Python 구현은 이 문장을 쓰지 않고 계약의 문장(`"N행: language/topic/result 오류"`)을 직접 씁니다. 세 구현의 **오류 문장까지 같게** 하려면 이렇게 직접 써야 합니다.

## 8. 실행 추적

Rust `parse_row`가 `["2026-10-03", "C", "x", "030", "pass"]`(4행)를 처리하는 과정입니다.

| 단계                       | 값                                  | 결과                          |
| -------------------------- | ----------------------------------- | ----------------------------- |
| `let [..] = fields else`   | 다섯 칸                             | 풀림                          |
| `"C".parse::<Language>()`  | `Ok(Language::C)`                   | 통과                          |
| `Minutes::try_from("030")` | 첫 글자 `'0'`                       | `Err("minutes 모양 \"030\"")` |
| `.map_err(err)`            | `RowError { line: 4, reason: ... }` |                               |
| `?`                        | `Err`를 돌려주며 함수 끝            | 결과 검사는 하지 않음         |

## 9. 다른 예제로 다시 이해하기

**파일 전체를 읽는 CSV 파서.** 실제 Rust 구현의 `rows` 함수입니다. 여섯 가지 까다로운 입력을 넣고, 같은 입력을 Python `csv`에도 넣어 결과를 비교합니다.

```rust
// 파일: rows_parser.rs
fn rows(text: &str) -> Result<Vec<Vec<String>>, String> {
    let mut output = Vec::new();
    let mut record = Vec::new();
    let mut field = String::new();
    let (mut quoted, mut after_quote, mut at_start) = (false, false, true);
    let mut chars = text.chars().peekable();
    while let Some(ch) = chars.next() {
        if quoted {
            if ch == '"' {
                if chars.peek() == Some(&'"') {
                    field.push('"');
                    chars.next();
                } else {
                    quoted = false;
                    after_quote = true;
                }
            } else {
                field.push(ch);             // 따옴표 안의 줄바꿈도 글자로 담는다
            }
            continue;
        }
        if after_quote && ch != ',' && ch != '\n' && ch != '\r' {
            return Err(String::from("닫힌 따옴표 뒤에 예상치 못한 문자"));
        }
        match ch {
            '"' if at_start => {
                quoted = true;
                at_start = false;
            }
            '"' => return Err(String::from("필드 중간의 따옴표")),
            ',' => {
                record.push(std::mem::take(&mut field));
                at_start = true;
                after_quote = false;
            }
            '\n' => {
                record.push(std::mem::take(&mut field));
                output.push(std::mem::take(&mut record));
                at_start = true;
                after_quote = false;
            }
            '\r' if chars.peek() == Some(&'\n') => {}
            '\r' => return Err(String::from("CR만 있는 줄바꿈")),
            _ => {
                field.push(ch);
                at_start = false;
            }
        }
    }
    if quoted {
        return Err(String::from("닫히지 않은 따옴표"));
    }
    if !record.is_empty() || !field.is_empty() || !at_start {
        record.push(field);
        output.push(record);
    }
    Ok(output)
}

fn main() {
    let samples = [
        "a,b\r\n1,2\r\n",
        "a,b\n\"x, y\",\"say \"\"hi\"\"\"\n",
        "a,b\n\"둘째\n줄\",3\n",
        "a,b\n1,2",
        "a,b\n\"x\"y,3\n",
        "a,b\n\"열림,3\n",
    ];
    for text in samples {
        match rows(text) {
            Ok(r) => println!("{:?} → {r:?}", text),
            Err(e) => println!("{:?} → 오류: {e}", text),
        }
    }
}
```

실행 결과:

```text
"a,b\r\n1,2\r\n" → [["a", "b"], ["1", "2"]]
"a,b\n\"x, y\",\"say \"\"hi\"\"\"\n" → [["a", "b"], ["x, y", "say \"hi\""]]
"a,b\n\"둘째\n줄\",3\n" → [["a", "b"], ["둘째\n줄", "3"]]
"a,b\n1,2" → [["a", "b"], ["1", "2"]]
"a,b\n\"x\"y,3\n" → 오류: 닫힌 따옴표 뒤에 예상치 못한 문자
"a,b\n\"열림,3\n" → 오류: 닫히지 않은 따옴표
```

| 코드                                                                      | 설명                                                                                                       |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `let (mut quoted, mut after_quote, mut at_start) = (false, false, true);` | C 구현의 `quoted`, `ended`, `start`와 같은 세 상태입니다(Day 87).                                          |
| `field.push(ch);`(따옴표 안)                                              | 줄바꿈도 글자로 담습니다. 셋째 입력의 `둘째\n줄`이 한 칸이 됐습니다.                                       |
| `'\r' if chars.peek() == Some(&'\n') => {}`                               | CRLF의 `\r`을 버립니다. 첫 입력이 LF 파일과 같은 결과입니다.                                               |
| `record.push(std::mem::take(&mut field))`                                 | 칸을 옮겨 넣고 빈 `String`으로 바꿉니다. 복사가 없습니다.                                                  |
| `if !record.is_empty() \|\| !field.is_empty() \|\| !at_start`             | 마지막 줄에 줄바꿈이 없을 때(넷째 입력) 남은 칸을 기록으로 만듭니다. 빈 파일이면 아무것도 만들지 않습니다. |

Python `csv` 모듈의 결과입니다.

```python
# 파일: rows_parser.py
import csv
import io

samples = [
    "a,b\r\n1,2\r\n",
    'a,b\n"x, y","say ""hi"""\n',
    'a,b\n"둘째\n줄",3\n',
    "a,b\n1,2",
    'a,b\n"x"y,3\n',
    'a,b\n"열림,3\n',
]
for text in samples:
    try:
        rows = list(csv.reader(io.StringIO(text, newline=""), strict=True))
        print(f"{text!r} → {rows}")
    except csv.Error as e:
        print(f"{text!r} → 오류: {e}")
```

실행 결과:

```text
'a,b\r\n1,2\r\n' → [['a', 'b'], ['1', '2']]
'a,b\n"x, y","say ""hi"""\n' → [['a', 'b'], ['x, y', 'say "hi"']]
'a,b\n"둘째\n줄",3\n' → [['a', 'b'], ['둘째\n줄', '3']]
'a,b\n1,2' → [['a', 'b'], ['1', '2']]
'a,b\n"x"y,3\n' → 오류: ',' expected after '"'
'a,b\n"열림,3\n' → 오류: unexpected end of data
```

- 여섯 입력 모두 Rust `rows`와 **같은 판단**(같은 칸, 같은 곳에서 오류)입니다. 오류 문장만 다릅니다.
- `io.StringIO(text, newline="")`는 줄바꿈을 바꾸지 않고 그대로 csv 모듈에 넘깁니다. 파일을 열 때의 `newline=""`와 같은 뜻입니다.
- **C 구현은 셋째 입력을 거절합니다.** `fgets`로 한 줄씩 읽어서 `"둘째`에서 따옴표가 닫히지 않은 채 줄이 끝나기 때문입니다. 계약이 "따옴표 안의 줄바꿈"을 정하지 않아서 생긴 차이이고, 기본 fixture에는 이런 줄이 없어서 비교 스크립트도 알아채지 못합니다. Day 91에서 이런 차이를 찾는 방법을 다룹니다.

## 10. 검증 자료형 대응표

| 검증 대상      | Rust                                    | C                                  | Python                                |
| -------------- | --------------------------------------- | ---------------------------------- | ------------------------------------- |
| 언어           | `enum Language` + `FromStr`             | `enum language` + `parse_language` | `class Language(Enum)`, `Language(s)` |
| 분             | `struct Minutes(u32)` + `TryFrom<&str>` | `unsigned` + `minutes_valid`(약속) | `Minutes` dataclass + `__post_init__` |
| 결과           | `enum Outcome`                          | `enum outcome`                     | `class Outcome(Enum)`                 |
| 잘못된 값 막기 | 자료형이 만들어지지 않음                | `LANG_INVALID` 확인(약속)          | 만들 때 예외                          |
| 오류에 줄 번호 | `map_err` + `RowError`                  | 호출하는 쪽에서 출력               | `raise ... from None`                 |

## 11. 세 언어 비교

| 관점               | Rust                             | C                        | Python                     |
| ------------------ | -------------------------------- | ------------------------ | -------------------------- |
| "검증됨"의 표시    | 자료형(컴파일러가 보장)          | 약속                     | 자료형(실행 중 검사)       |
| 잘못된 enum 값     | 만들 수 없음                     | 아무 정수나 넣을 수 있음 | 만들 수 없음(`ValueError`) |
| 파일 읽기 방식     | 전체를 한 번에(`read_to_string`) | 한 줄씩(`fgets`)         | 한 줄씩(파일 반복 + csv)   |
| 따옴표 안의 줄바꿈 | 받아들임                         | 거절                     | 받아들임                   |

## 12. 자주 하는 실수

### 실수 1: 실패할 수 있는 변환에 From을 구현한다

`impl From<&str> for Language`는 실패를 돌려줄 방법이 없어서, 모르는 값에서 패닉하거나 기본값을 넣게 됩니다. 실패할 수 있으면 `FromStr`이나 `TryFrom`을 쓰세요.

### 실수 2: 사용자 입력 때문에 패닉한다

실습의 변형 문제입니다. `panic!("모르는 결과")`는 파일 한 줄 때문에 프로그램 전체를 멈춥니다. `Result`로 돌려주고 가장 바깥에서 오류로 알리세요.

### 실수 3: ?가 오류를 바꿔 주기를 기대한다

실습의 디버그 문제입니다. `String` 오류를 `RowError`로 바꾸는 `From`이 없으면 E0277입니다. 줄 번호처럼 추가 정보가 필요하면 `map_err`로 감싸세요.

### 실수 4: 검증된 자료형을 만들고도 문자열을 계속 쓴다

`Language`로 해석해 놓고 뒤에서 원래 문자열 `fields[1]`을 쓰면 자료형을 만든 의미가 없습니다. 오늘 코드처럼 같은 이름으로 다시 선언해(가림) 문자열을 더 쓰지 못하게 하세요.

### 실수 5: 세 구현의 파일 읽기 방식 차이를 잊는다

C는 한 줄씩, Rust는 전체를 한 번에 읽어서 따옴표 안의 줄바꿈 처리가 달라졌습니다. 읽기 방식이 다르면 경계 사례에서 결과가 달라질 수 있으니, 계약과 fixture로 확인하세요.

## 13. Q&A

**Q. 실제 프로젝트의 Rust 구현은 오늘처럼 자료형을 많이 쓰나요?**

A. 실제 구현은 짧게 쓰려고 `Session`의 필드를 `String`으로 두고 `matches!`와 함수로 검사합니다. 오늘은 같은 검사를 자료형으로 옮기면 어떻게 되는지 보여 주려고 확장했습니다. 규칙이 늘어나고 여러 사람이 코드를 고치게 되면 자료형 설계가 더 안전합니다(도전 문제).

**Q. 파일 전체를 한 번에 읽으면 큰 파일에서 문제가 되지 않나요?**

A. `read_to_string`은 파일 크기만큼 메모리를 씁니다. 수백 MB 파일이면 `BufReader`로 조금씩 읽으며 상태 기계를 돌리는 방식으로 바꿔야 합니다. 상태(`quoted` 등)를 줄 사이에 유지하면 한 줄씩 읽어도 따옴표 안의 줄바꿈을 처리할 수 있습니다. C 구현도 같은 방법으로 고칠 수 있습니다.

**Q. enum의 선언 순서를 이름 순으로 맞춘 것은 우연인가요?**

A. 일부러 맞췄습니다. `C < Python < Rust`는 바이트 순서이기도 해서, `derive(Ord)`의 정렬이 계약의 출력 순서와 같아집니다. 나중에 `Go`를 추가한다면 `C`와 `Python` 사이에 선언해야 같은 순서가 유지됩니다. 이런 숨은 약속은 주석으로 남겨 두세요.

**Q. Python에서도 FromStr 같은 약속을 만들 수 있나요?**

A. 관례적으로 `@classmethod def parse(cls, s)` 또는 `from_str`를 만듭니다. `Enum`은 `Language(값)`이 그 역할을 기본으로 합니다. 타입 검사 도구를 쓰면 `Protocol`로 "parse를 가진 클래스"를 약속할 수도 있습니다(Day 54).

## 14. 핵심 요약

- Rust에서는 검증을 **자료형**으로 만듭니다. `FromStr`(`s.parse::<T>()`)과 `TryFrom<&str>`로 문자열을 해석하고, 실패하면 오류를 돌려줍니다.
- 새 자료형 `Minutes(u32)`처럼 **잘못된 값은 만들 수 없는** 자료형을 쓰면, 받은 쪽은 다시 검사할 필요가 없습니다(parse, don't validate).
- 오류 구조체에 줄 번호와 이유를 담고 `Display`로 문장을 만들며, 줄 번호를 아는 곳에서 `map_err`로 감쌉니다.
- 파일 전체를 글자 단위로 읽는 `rows` 파서는 따옴표 안의 줄바꿈과 CRLF까지 다루며, Python `csv`와 같은 판단을 합니다.
- C 구현은 한 줄씩 읽어 따옴표 안의 줄바꿈을 거절합니다. 계약이 정하지 않은 경계에서 세 구현이 달라질 수 있습니다.
- C는 문자열 → enum 함수와 이름 표, Python은 `Enum(값)`과 `__post_init__`으로 같은 설계를 합니다.

## 15. 도전 문제

1. **(Rust)** 실제 프로젝트의 `study_log.rs`에서 `Session`의 `language`와 `result`를 오늘의 `Language`, `Outcome`으로 바꾸고, 출력이 그대로인지 비교 스크립트로 확인하세요. 출력할 때 필요한 `Display`를 구현해야 합니다.
2. **(Rust)** `struct Day(String)`을 만들어 `TryFrom<&str>`에서 Day 84의 달력 검사를 하고, `Session`의 날짜를 이 자료형으로 바꾸세요.
3. **(C)** 계약에 "따옴표 안의 줄바꿈은 허용하지 않는다"를 적었다고 가정하고, 이것을 Rust `rows`와 Python 구현에도 적용해 세 구현이 셋째 입력을 모두 거절하게 만드세요.
4. **(Python)** 오늘 Python 예제의 오류 문장을 계약의 문장(`"N행: language/topic/result 오류"`, `"N행: minutes는 양의 정수여야 합니다"`)으로 바꿔, Rust 예제와 줄 번호·이유가 같아지게 하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `rows` 파서는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.rs`에 그대로 있습니다. 같은 파일의 `load`와 `date_valid`가 검증을 함수로 하는 방식을, 오늘의 자료형 방식과 비교해 보세요.
