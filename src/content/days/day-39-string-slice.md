---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-39-string-slice
courseId: crp-92
phaseId: phase-04
dayNumber: 39
date: "2026-11-08"
title: Rust String과 &str
summary: Rust의 두 문자열 자료형, 주인이 있고 늘어날 수 있는 String과 다른 곳의 UTF-8 바이트를 빌린 &str을 구별합니다. 리터럴이 &'static str인 이유, 함수 매개변수를 &str로 받고 결과는 String으로 돌려주는 관례, &String이 &str로 자동으로 바뀌는 것, push·push_str·+=·insert_str·format!·join으로 만들기, + 연산자가 왼쪽을 옮긴다는 점, trim·pop·remove·truncate·retain·clear로 고치기, parse로 숫자로 바꾸기를 다룹니다. C의 const char *(빌림)과 char 배열(소유), Python의 바꿀 수 없는 str과 join으로 모으기를 비교하고, 틀 문자열의 {이름} 자리를 값으로 채우는 템플릿 프로그램을 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-38-unicode]
learningObjectives:
  - String과 &str의 소유 관계와 메모리 위치를 설명하고, 서로 바꾸는 방법을 쓴다.
  - 함수 매개변수는 &str, 새로 만든 결과는 String으로 설계한다.
  - push_str·format!·join으로 문자열을 만들고, + 연산자가 왼쪽 값을 옮긴다는 것을 설명한다.
  - trim·retain·truncate·parse 같은 메서드로 문자열을 고치거나 변환한다.
  - C의 const char *와 char 배열, Python의 str과 비교해 누가 문자열 공간을 소유하는지 설명한다.
concepts:
  [
    string,
    str slice,
    static str,
    deref coercion,
    push_str,
    format macro,
    string concatenation,
    join,
    trim,
    retain,
    parse,
    owned vs borrowed,
    template rendering,
  ]
runnerMode: python
playgroundSource: |
  # 파일: build_str.py — Python 문자열은 바꿀 수 없어 새로 만듭니다.
  s = "책"
  t = s
  s += " 목록"
  print(s, "/", t)
  pieces = [f"{i}번" for i in range(3)]
  print(", ".join(pieces))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day39-predict-len
    title: push_str 뒤의 길이 예측하기
    kind: predict
    objective: String의 len이 바이트 수라는 것을 다시 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let mut s = String::from("ab");
          s.push_str("가");
          println!("{} {}", s.len(), s.chars().count());
      }
    answer: "5 3"
    hint: "a, b는 1바이트씩, '가'는 3바이트입니다."
    explanation: "String은 UTF-8 바이트를 담은 Vec<u8>과 비슷해서 len은 바이트 수 5입니다. 글자 수는 chars().count()로 세어 3입니다. push_str은 바이트를 뒤에 복사해 붙이고, 공간이 모자라면 더 큰 공간으로 옮깁니다."
    commonMistakes:
      - "len을 글자 수로 생각해 3 3으로 적음"
      - "'가'를 2바이트로 셈"
    language: rust
    verification: run
  - id: ex-day39-predict-plus
    title: + 연산자와 clone 예측하기
    kind: predict
    objective: + 의 왼쪽은 옮겨지고 오른쪽은 &str로 빌려진다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let a = String::from("x");
          let b = a.clone() + "y" + &a;
          println!("{a} {b}");
      }
    answer: "x xyx"
    hint: 'a.clone()은 새 String입니다. 그것이 옮겨져 "y"와 &a를 차례로 붙입니다.'
    explanation: 'String + &str은 왼쪽 String을 가져가서(옮겨서) 그 뒤에 오른쪽을 붙인 String을 돌려줍니다. 왼쪽이 a.clone()이라 a 자체는 옮겨지지 않았고, 오른쪽 &a는 빌리기만 합니다. 그래서 마지막에 a를 출력할 수 있습니다. 여러 개를 이을 때는 format!("{a}y{a}")가 더 읽기 쉽습니다.'
    commonMistakes:
      - "a가 옮겨져 컴파일 오류라고 생각함(clone한 쪽이 옮겨짐)"
      - "+의 순서를 바꿔 yxx로 적음"
    language: rust
    verification: run
  - id: ex-day39-fill
    title: 두 문자열 자료형을 모두 받는 매개변수 채우기
    kind: fill
    objective: 매개변수를 &str로 받아 리터럴과 String을 모두 넘긴다.
    prompt: "빈칸에 매개변수 자료형을 적어 리터럴과 String을 모두 넘길 수 있게 하고, 'ABC XYZ'가 출력되게 하세요."
    starter: |-
      fn shout(s: _____) -> String {
          s.to_uppercase()
      }

      fn main() {
          let owned = String::from("xyz");
          println!("{} {}", shout("abc"), shout(&owned));
      }
    answer: |-
      fn shout(s: &str) -> String {
          s.to_uppercase()
      }

      fn main() {
          let owned = String::from("xyz");
          println!("{} {}", shout("abc"), shout(&owned));
      }
    output: "ABC XYZ"
    hint: '리터럴 "abc"의 자료형은 무엇일까요? &owned는 &String이지만 자동으로 바뀔 수 있습니다.'
    explanation: "&str로 받으면 리터럴(&'static str), &String(자동 변환), 슬라이스(&owned[1..]) 모두 넘길 수 있습니다. &String으로 받으면 리터럴을 넘길 수 없고, String으로 받으면 부르는 쪽이 소유권을 넘기거나 복사해야 합니다. 읽기만 하는 문자열 매개변수는 &str이 기본입니다."
    commonMistakes:
      - "String으로 받아 shout(&owned)에서 자료형 오류가 남"
      - '&String으로 받아 shout("abc")에서 자료형 오류가 남'
    language: rust
    verification: run
  - id: ex-day39-modify
    title: 끝의 쉼표 없이 목록 만들기
    kind: modify
    objective: 반복마다 새 String을 만드는 대신 join으로 한 번에 만든다.
    prompt: "이 코드는 반복마다 format!으로 새 String을 만들고, 끝에 쉼표가 하나 더 붙어 '사과,배,감,'이 됩니다. join을 써서 '사과,배,감'이 출력되게 고치세요."
    starter: |-
      fn main() {
          let words = ["사과", "배", "감"];
          let mut t = String::new();
          for w in words {
              t = format!("{t}{w},");
          }
          println!("{t}");
      }
    answer: |-
      fn main() {
          let words = ["사과", "배", "감"];
          let t = words.join(",");
          println!("{t}");
      }
    output: "사과,배,감"
    starterOutput: "사과,배,감,"
    hint: "join은 조각 사이에만 구분자를 넣습니다."
    explanation: 'format!("{t}{w},")는 반복마다 지금까지의 내용 전체를 새 String에 복사합니다. 조각이 많으면 복사량이 제곱으로 늘어납니다. join은 필요한 길이를 먼저 계산해 한 번에 만들고, 구분자를 조각 사이에만 넣습니다. 반복이 꼭 필요하면 t.push_str(w)처럼 제자리에 붙이세요. Python의 ",".join(words)와 같은 생각입니다.'
    commonMistakes:
      - "끝의 쉼표를 지우려고 t.pop()을 쓰다가 목록이 비었을 때를 놓침"
      - "words.concat()을 써서 구분자가 없어짐"
    language: rust
    verification: run
  - id: ex-day39-debug
    title: + 뒤에 옮겨진 값을 쓰는 오류 고치기
    kind: debug
    objective: E0382(옮겨진 값 사용)를 format!이나 clone으로 고친다.
    prompt: "이 코드는 E0382(borrow of moved value: `a`) 오류로 컴파일되지 않습니다. a를 옮기지 않도록 고쳐 '해리 해리 포터'가 출력되게 하세요."
    starter: |-
      fn main() {
          let a = String::from("해리");
          let b = String::from(" 포터");
          let c = a + &b;
          println!("{a} {c}");
      }
    answer: |-
      fn main() {
          let a = String::from("해리");
          let b = String::from(" 포터");
          let c = format!("{a}{b}");
          println!("{a} {c}");
      }
    output: "해리 해리 포터"
    hint: "a + &b는 a의 공간을 그대로 가져가 뒤에 b를 붙입니다. 그 뒤로 a는 비어 있는 것이 아니라 아예 쓸 수 없습니다."
    explanation: "+ 연산자는 왼쪽 String의 소유권을 가져가 재사용하므로 빠르지만, a를 다시 쓸 수 없습니다. format!은 모든 인자를 빌리기만 하고 새 String을 만들어서 a, b가 모두 남습니다. let c = a.clone() + &b;도 되지만, 읽기에는 format!이 더 분명합니다."
    commonMistakes:
      - "a + b로 바꿔 E0308(String을 기대한 자리에 &str) 오류가 남"
      - "&a + &b로 써서 &String끼리는 더할 수 없다는 오류가 남"
    language: rust
    verification: run
  - id: ex-day39-independent
    title: Python으로 가장 긴 단어 찾기
    kind: independent
    objective: split과 max(key=len)으로 단어를 나누고 비교한다.
    prompt: 'text = "우유 바나나우유 빵"에서 단어 수와 가장 긴 단어, 그 글자 수를 ''단어 3개, 가장 긴 단어: 바나나우유 (5글자)'' 모양으로 출력하세요.'
    starter: |-
      text = "우유 바나나우유 빵"
      print(text)
    answer: |-
      text = "우유 바나나우유 빵"
      words = text.split()
      longest = max(words, key=len)
      print(f"단어 {len(words)}개, 가장 긴 단어: {longest} ({len(longest)}글자)")
    output: "단어 3개, 가장 긴 단어: 바나나우유 (5글자)"
    hint: "split()은 공백으로 나눈 리스트를 줍니다. max에 key=len을 주면 길이로 비교합니다."
    explanation: "Python의 len은 글자 수라 5입니다. 같은 일을 Rust로 하면 text.split_whitespace().max_by_key(|w| w.chars().count())처럼 글자 수를 직접 세야 합니다(len은 바이트 수 15). 돌려받은 단어는 Rust에서는 text를 빌린 &str, Python에서는 새 문자열입니다."
    commonMistakes:
      - 'split(" ")으로 나눠 공백이 여러 개면 빈 문자열이 섞임'
      - "max(words)로 사전 순서의 마지막 단어를 고름"
    language: python
    verification: run
quiz:
  - id: quiz-day39-01
    question: String과 &str에 대한 설명으로 옳은 것은?
    choices:
      - 둘은 같은 자료형이다
      - String은 힙 공간을 소유하고 늘어날 수 있으며, &str은 어딘가의 UTF-8 바이트를 빌린 조각이다
      - "&str은 힙에만 있다"
      - String은 바꿀 수 없다
    answerIndex: 1
    explanation: String은 (주소, 길이, 용량)을 가진 소유 자료형이라 push_str로 늘어납니다. &str은 (주소, 길이)만 가진 빌림이라, 가리키는 곳이 리터럴(프로그램 안), String의 일부, 다른 어디든 될 수 있습니다.
  - id: quiz-day39-02
    question: 읽기만 하는 문자열 매개변수의 자료형으로 가장 좋은 것은?
    choices:
      - String
      - "&String"
      - "&str"
      - "&mut String"
    answerIndex: 2
    explanation: "&str은 리터럴, &String, 부분 슬라이스를 모두 받습니다. &String을 넘기면 컴파일러가 자동으로 &str로 바꿔 줍니다(역참조 강제 변환). 새 문자열을 만들어 돌려줄 때는 String을 돌려줍니다."
  - id: quiz-day39-03
    question: let c = a + &b; 뒤에 a와 b의 상태는?
    choices:
      - 둘 다 쓸 수 있다
      - a는 옮겨져 쓸 수 없고, b는 빌려준 것이라 그대로 쓸 수 있다
      - 둘 다 쓸 수 없다
      - b만 옮겨진다
    answerIndex: 1
    explanation: "String의 + 는 fn add(self, other: &str) 모양이라 왼쪽 self를 가져갑니다. 이미 가진 공간 뒤에 붙이기만 하면 되어 효율적이지만, a를 다시 쓰려면 clone하거나 format!을 써야 합니다."
  - id: quiz-day39-04
    question: '"  hi  ".trim()이 돌려주는 것은?'
    choices:
      - 공백을 지운 새 String
      - 원래 문자열의 가운데 "hi" 부분을 빌린 &str
      - 원래 문자열을 제자리에서 바꾼다
      - 빈 문자열
    answerIndex: 1
    explanation: trim은 복사하지 않고 안쪽 범위를 가리키는 슬라이스를 돌려줍니다. 원래 문자열이 사라지거나 바뀌기 전에 결과를 따로 가지려면 .to_string()으로 복사하세요.
  - id: quiz-day39-05
    question: C에서 Rust의 &str에 가장 가까운 것은?
    choices:
      - char 배열
      - 읽기 전용 문자열을 가리키는 const char *(다만 길이 대신 '\0'으로 끝을 앎)
      - int
      - malloc한 char *
    answerIndex: 1
    explanation: 둘 다 남의 문자열을 가리키기만 하고 정리 책임이 없습니다. 차이는 &str이 길이를 함께 가지고 컴파일러가 빌린 동안의 수명을 검사한다는 점입니다. Rust의 String은 C에서 malloc한 char 버퍼와 그 길이·용량을 함께 관리하는 것에 가깝습니다(Day 40).
---

## 1. 오늘 배울 내용

Day 36에서 슬라이스, Day 37~38에서 C 문자열과 유니코드를 배웠습니다. 오늘은 두 지식을 합쳐 Rust의 두 문자열 자료형을 제대로 구별합니다.

1. **`String`**: 힙 공간을 **소유**하고 늘어날 수 있는 문자열
2. **`&str`**: 어딘가에 있는 UTF-8 바이트를 **빌린** 조각
   - 리터럴 `"모모"`의 자료형은 `&'static str`입니다.
3. 둘을 오가는 방법: `String::from`, `to_string`, `as_str`, `&s`
4. 함수 설계 관례: **받을 때는 `&str`, 새로 만들어 줄 때는 `String`**
5. 문자열 만들기: `push`, `push_str`, `+=`, `insert_str`, `format!`, `join`
   - `+` 연산자는 **왼쪽을 옮긴다**는 점
6. 문자열 고치기와 변환: `trim`, `pop`, `remove`, `truncate`, `retain`, `clear`, `parse`
7. 비교:
   - C: `const char *`(빌림)와 `char` 배열(소유)
   - Python: 바꿀 수 없는 `str`, 조각을 모아 `join`
8. `{name}` 같은 자리를 값으로 채우는 **템플릿** 프로그램을 만듭니다.

## 2. 왜 필요한가

Rust를 처음 배우면 `expected &str, found String` 같은 오류를 자주 만납니다. 두 자료형이 있는 이유를 알면 이 오류가 무엇을 묻는지 분명해집니다.

- 문자열을 **읽기만** 하는 함수가 복사본을 요구하면, 부를 때마다 쓸데없이 복사하게 됩니다.
- 문자열을 **만들어 돌려주는** 함수가 빌린 조각을 돌려주려 하면, 그 조각의 주인이 먼저 사라질 수 있습니다(Day 35의 E0515).
- 긴 문자열을 조금씩 붙여 만들 때, 매번 새로 복사하면 느려집니다.

누가 문자열의 공간을 가지고 있는지(소유), 누가 잠깐 보는지(빌림)를 구별하는 것이 핵심입니다.

## 3. 그림으로 이해하기

`String`은 스택에 **주소, 길이, 용량** 세 값을 두고, 실제 바이트는 힙에 둡니다. `&str`은 **주소, 길이** 두 값만 가집니다.

```text
let owned = String::from("미하엘 엔데");

스택                         힙
owned ┌─────────┐          ┌──────────────────────────────┐
      │ 주소    │─────────▶│ 미 하 엘 ␣ 엔 데 (16바이트)    │
      │ 길이 16 │          └──────────────────────────────┘
      │ 용량 16 │            ▲
      └─────────┘            │
                             │
first ┌─────────┐            │   first_word(&owned)가 돌려준 &str
      │ 주소    │────────────┘   (앞 9바이트 "미하엘"만 가리킴)
      │ 길이 9  │
      └─────────┘
```

리터럴은 프로그램 파일 안에 들어 있어서 프로그램이 끝날 때까지 사라지지 않습니다. 그래서 수명이 `'static`입니다.

```text
let literal: &str = "모모";

literal ┌────────┐         프로그램의 읽기 전용 영역
        │ 주소   │────────▶ 모 모 (6바이트)
        │ 길이 6 │
        └────────┘
```

`a + &b`는 `a`의 힙 공간을 **재사용**합니다.

```text
a ─▶ [해 리          ]      b ─▶ [␣ 포 터]
         │
c = a + &b
         ▼
c ─▶ [해 리 ␣ 포 터  ]      b ─▶ [␣ 포 터]   (a는 더 이상 쓸 수 없음)
```

## 4. 천천히 풀어보기

### 4.1 둘을 오가는 방법

| 방향                     | 쓰는 법                                            | 비용           |
| ------------------------ | -------------------------------------------------- | -------------- |
| `&str` → `String`        | `String::from(s)`, `s.to_string()`, `s.to_owned()` | 힙에 복사      |
| `String` → `&str`        | `&owned`, `owned.as_str()`, `&owned[..]`           | 없음(빌리기만) |
| `String`의 일부 → `&str` | `&owned[0..9]`(바이트 범위, 글자 경계여야 함)      | 없음           |
| `&String` → `&str`       | 자동(함수 인자, 메서드 호출에서)                   | 없음           |

마지막 줄의 자동 변환을 **역참조 강제 변환(deref coercion)** 이라고 부릅니다. `&String`이 필요한 자리에 `&str`처럼 쓰일 수 있게 컴파일러가 알아서 바꿔 줍니다.

### 4.2 함수 설계 관례

| 함수가 하는 일               | 매개변수      | 반환값   | 예                               |
| ---------------------------- | ------------- | -------- | -------------------------------- |
| 읽기만 한다                  | `&str`        | -        | `fn count_a(s: &str) -> usize`   |
| 새 문자열을 만든다           | `&str`        | `String` | `fn greet(name: &str) -> String` |
| 받은 것의 일부를 돌려준다    | `&str`        | `&str`   | `fn first_word(s: &str) -> &str` |
| 제자리에서 고친다            | `&mut String` | -        | `fn add_suffix(s: &mut String)`  |
| 가져가서 보관한다(구조체 등) | `String`      | -        | `fn new(name: String) -> Book`   |

`first_word`처럼 받은 것의 일부를 돌려주면, 돌려받은 `&str`은 원래 문자열이 살아 있는 동안만 쓸 수 있습니다. 매개변수가 참조 하나뿐이라 컴파일러가 이 관계를 알아서 추론합니다(Day 45).

### 4.3 문자열 만들기

- `push(ch)`: 글자 하나를 붙입니다.
- `push_str(s)`, `s += "..."`: `&str`을 붙입니다. 공간이 모자라면 더 큰 공간으로 옮깁니다.
- `insert_str(i, s)`: 바이트 위치 `i`에 끼워 넣습니다. 뒤의 바이트를 모두 밀어야 해서 느립니다.
- `format!("...")`: 인자를 모두 빌려 새 `String`을 만듭니다. 가장 읽기 쉽습니다.
- `a + &b`: `a`를 옮겨 와 뒤에 붙입니다. `a`는 이후에 쓸 수 없습니다.
- `slice.join(sep)`, `slice.concat()`: 여러 조각을 한 번에 잇습니다.

### 4.4 고치기와 변환

| 메서드                          | 하는 일                                  | 돌려주는 것          |
| ------------------------------- | ---------------------------------------- | -------------------- |
| `trim()`                        | 앞뒤 공백을 뺀 안쪽                      | `&str`(빌림)         |
| `pop()`                         | 마지막 글자를 꺼냄                       | `Option<char>`       |
| `remove(i)`                     | 바이트 위치 `i`에서 시작하는 글자를 지움 | 지운 `char`          |
| `truncate(n)`                   | 앞 `n`바이트만 남김(글자 경계여야 함)    | -                    |
| `retain(조건)`                  | 조건에 맞는 글자만 남김                  | -                    |
| `clear()`                       | 내용을 모두 지움(용량은 남음)            | -                    |
| `parse::<T>()`                  | 숫자 등으로 변환                         | `Result<T, 오류>`    |
| `lines()`, `split_whitespace()` | 줄·단어로 나눔                           | `&str`을 주는 반복자 |

## 5. Rust로 구현하기

```rust
// 파일: string_str.rs
fn greet(name: &str) -> String {            // 빌려 읽고, 새로 만든 String을 돌려준다
    format!("안녕, {name}!")
}

fn first_word(s: &str) -> &str {            // 받은 문자열의 일부를 빌려 돌려준다
    s.split_whitespace().next().unwrap_or("")
}

fn main() {
    let literal: &str = "모모";              // 프로그램에 박혀 있는 문자열(&'static str)
    let owned: String = String::from("미하엘 엔데");   // 힙에 있는, 주인이 있는 문자열
    let also_owned = literal.to_string();

    println!("{}", greet(literal));         // &str 그대로
    println!("{}", greet(&owned));          // &String → &str 자동 변환
    println!("{}", greet(also_owned.as_str()));
    println!("첫 단어: {}", first_word(&owned));

    let mut s = String::new();
    s.push('책');                            // 글자 하나
    s.push_str(" 목록: ");                   // &str 붙이기
    s += "모모";                             // += 도 push_str
    s.insert_str(0, "[");
    s.push(']');
    println!("{s} ({}바이트, {}글자)", s.len(), s.chars().count());

    let a = String::from("해리");
    let b = String::from(" 포터");
    let c = a + &b;                          // a는 옮겨지고, b는 빌려준다
    println!("+ 결과: {c}, b는 그대로: {b}");

    let parts = ["사과", "배", "감"];
    println!("join: {}, concat: {}", parts.join(", "), parts.concat());

    let mut t = String::from("  바나나 우유  ");
    let trimmed = t.trim().to_string();     // 빌린 조각을 복사해 따로 소유
    t.clear();
    println!("trim 뒤 복사본: [{trimmed}], 원본은 비움: [{t}]");

    let mut word = String::from("abcdef");
    let last = word.pop();                  // 마지막 글자를 꺼낸다
    word.remove(0);                         // 0번 바이트의 글자를 지운다
    word.truncate(3);                       // 앞 3바이트만 남긴다
    println!("pop {last:?}, 남은 것 {word}");

    let mut code = String::from("a1b2c3");
    code.retain(|ch| ch.is_ascii_digit()); // 조건에 맞는 글자만 남긴다
    let n: i32 = code.parse().unwrap();     // 문자열 → 정수
    println!("숫자만: {code} → {}", n * 2);

    for line in "첫 줄\n둘째 줄\n".lines() {
        print!("<{line}>");
    }
    println!();
}
```

실행 결과:

```text
안녕, 모모!
안녕, 미하엘 엔데!
안녕, 모모!
첫 단어: 미하엘
[책 목록: 모모] (20바이트, 10글자)
+ 결과: 해리 포터, b는 그대로:  포터
join: 사과, 배, 감, concat: 사과배감
trim 뒤 복사본: [바나나 우유], 원본은 비움: []
pop Some('f'), 남은 것 bcd
숫자만: 123 → 246
<첫 줄><둘째 줄>
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fn greet(name: &str) -> String`      | 이름은 빌려 읽고, 새로 만든 인사말의 소유권은 부른 쪽에 넘깁니다.                                                                     |
| `fn first_word(s: &str) -> &str`      | `split_whitespace().next()`는 첫 단어를 빌린 `&str`입니다. 단어가 없으면 `unwrap_or("")`로 빈 리터럴을 돌려줍니다.                    |
| `greet(&owned)`                       | `&String`을 `&str` 자리에 넘겼습니다. 자동 변환 덕분입니다.                                                                           |
| `s.insert_str(0, "[")`                | 맨 앞에 끼웠습니다. 뒤의 모든 바이트가 한 칸씩 밀립니다.                                                                              |
| `let c = a + &b;`                     | `a`의 공간 뒤에 `b`를 붙였습니다. 출력 `b는 그대로:  포터`의 공백 두 칸은 앞의 `:` 뒤 공백과 `b`의 첫 글자인 공백입니다.              |
| `let trimmed = t.trim().to_string();` | `trim()`은 `t`를 빌린 조각이라, 다음 줄에서 `t.clear()`를 하려면 먼저 복사해 따로 가져야 합니다. `to_string()` 없이 쓰면 E0502입니다. |
| `word.remove(0); word.truncate(3);`   | 위치는 모두 **바이트** 번호입니다. 영문이라 글자 번호와 같지만, 한글이면 글자 경계가 아닌 곳에서 패닉입니다.                          |
| `code.parse().unwrap()`               | `let n: i32`의 자료형을 보고 정수로 바꿉니다. 숫자가 아닌 글자가 있으면 `Err`입니다.                                                  |

## 6. C로 구현하기

C에는 문자열 자료형이 따로 없지만, 같은 구별을 **포인터의 종류**와 **배열**로 합니다.

```c
// 파일: owned_view.c
#include <stdio.h>
#include <string.h>

// 빌린 문자열(const char *)을 읽어 부른 쪽 버퍼에 새 문자열을 만든다
void greet(char *out, size_t size, const char *name) {
    snprintf(out, size, "안녕, %s!", name);
}

// 첫 단어의 길이를 돌려준다: 복사하지 않고 원래 문자열의 앞부분을 가리키게 쓴다
size_t first_word_len(const char *s) {
    return strcspn(s, " ");                 // 공백이 처음 나오기 전까지의 길이
}

int main(void) {
    const char *literal = "모모";            // 읽기 전용 리터럴을 빌려 가리킨다
    char owned[32] = "미하엘 엔데";            // main이 가진 배열(바꿀 수 있음)
    char buf[64];

    greet(buf, sizeof buf, literal);
    printf("%s\n", buf);
    greet(buf, sizeof buf, owned);
    printf("%s\n", buf);

    size_t n = first_word_len(owned);
    printf("첫 단어: %.*s (%zu바이트)\n", (int)n, owned, n);   // 길이를 정해 출력

    owned[n] = '\0';                        // 제자리에서 잘라 첫 단어만 남긴다
    printf("잘라 낸 뒤 owned: %s\n", owned);
    return 0;
}
```

실행 결과:

```text
안녕, 모모!
안녕, 미하엘 엔데!
첫 단어: 미하엘 (9바이트)
잘라 낸 뒤 owned: 미하엘
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `const char *literal = "모모";`                        | Rust의 `&'static str`에 해당합니다. 가리키기만 하고, 바꾸거나 정리할 책임이 없습니다.                                                                     |
| `char owned[32] = "미하엘 엔데";`                      | `main`이 가진 공간입니다. Rust의 `String`과 달리 크기(32바이트)가 정해져 있어 늘어나지 않습니다. 늘어나는 버퍼는 `malloc`으로 만듭니다(Day 40).           |
| `void greet(char *out, size_t size, const char *name)` | C는 새 문자열을 "돌려주는" 대신, 부른 쪽이 준비한 버퍼에 씁니다. `name`은 `const`로 빌려 읽습니다.                                                        |
| `strcspn(s, " ")`                                      | 공백이 처음 나오기 전까지의 길이입니다. 새 문자열을 만들지 않고 "앞에서 몇 바이트"만 계산합니다. Rust의 `first_word`가 돌려준 `&str`의 길이에 해당합니다. |
| `printf("%.*s", (int)n, owned)`                        | 정밀도 `.*`로 앞 `n`바이트만 출력합니다. `'\0'` 없이도 길이로 끝을 정할 수 있습니다.                                                                      |
| `owned[n] = '\0';`                                     | 소유한 배열이라 제자리에서 잘랐습니다. 리터럴 `literal`에는 이렇게 할 수 없습니다.                                                                        |

## 7. Python으로 구현하기

```python
# 파일: py_str_build.py
def greet(name):
    return f"안녕, {name}!"


def first_word(s):
    words = s.split()
    return words[0] if words else ""


owned = "미하엘 엔데"
print(greet("모모"), greet(owned))
print("첫 단어:", first_word(owned))

s = "책"
t = s                                       # 같은 문자열을 가리키는 두 번째 이름
s += " 목록: 모모"                          # 새 문자열을 만들어 이름 s에 다시 붙인다
print(s, "/ t는 그대로:", t)

pieces = []
for i in range(3):
    pieces.append(f"{i}번")                 # 조각을 모아 두었다가
print("join:", ", ".join(pieces))           # 마지막에 한 번에 이어 붙인다

word = "abcdef"
print("pop 흉내:", word[-1], word[1:-1][:3])
code = "".join(ch for ch in "a1b2c3" if ch.isdigit())
print("숫자만:", code, "→", int(code) * 2)
print("첫 줄\n둘째 줄\n".splitlines())
```

실행 결과:

```text
안녕, 모모! 안녕, 미하엘 엔데!
첫 단어: 미하엘
책 목록: 모모 / t는 그대로: 책
join: 0번, 1번, 2번
pop 흉내: f bcd
숫자만: 123 → 246
['첫 줄', '둘째 줄']
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `def greet(name): return f"안녕, {name}!"`  | Python은 매개변수와 반환값의 소유를 구별하지 않습니다. 문자열은 바꿀 수 없어서 공유해도 안전하기 때문입니다.                                   |
| `t = s` / `s += " 목록: 모모"`              | `+=`가 새 문자열을 만들어 `s`에 다시 붙였고, `t`는 원래 `"책"`을 계속 가리킵니다. Rust `String`의 `push_str`처럼 제자리에서 늘어나지 않습니다. |
| `pieces.append(...)` / `", ".join(pieces)`  | 조각을 리스트에 모았다가 마지막에 한 번 잇습니다. 반복문 안에서 `s += ...`를 많이 하는 것보다 효율적인 관용구입니다.                           |
| `word[-1]`, `word[1:-1][:3]`                | Python 문자열에는 `pop`, `remove`가 없습니다. 자르기로 새 문자열을 만듭니다.                                                                   |
| `"".join(ch for ch in ... if ch.isdigit())` | Rust의 `retain`에 해당합니다. 조건에 맞는 글자로 새 문자열을 만듭니다.                                                                         |
| `int(code)`                                 | Rust의 `parse`에 해당합니다. 숫자가 아니면 `ValueError`입니다.                                                                                 |

## 8. 실행 추적

Rust 예제에서 `s`를 만들어 가는 과정을 바이트 수와 함께 따라갑니다.

| 줄                      | `s`의 내용        | 바이트 수  |
| ----------------------- | ----------------- | ---------- |
| `String::new()`         | (비어 있음)       | 0          |
| `s.push('책')`          | `책`              | 3          |
| `s.push_str(" 목록: ")` | `책 목록: `       | 3 + 9 = 12 |
| `s += "모모"`           | `책 목록: 모모`   | 18         |
| `s.insert_str(0, "[")`  | `[책 목록: 모모`  | 19         |
| `s.push(']')`           | `[책 목록: 모모]` | 20         |

`" 목록: "`은 공백(1) + `목록`(6) + `:`(1) + 공백(1) = 9바이트입니다. 용량이 모자랄 때마다 `String`은 더 큰 공간을 받아 옮기지만, 그 시점은 표준 라이브러리가 정하므로 용량 값에 기대는 코드는 쓰지 않습니다.

## 9. 다른 예제로 다시 이해하기

**반납 안내 템플릿.** `"{name}님, '{book}' 반납까지 {days}일 남았습니다."` 같은 틀의 `{이름}` 자리를 값으로 채웁니다. 값이 없는 이름이나 닫히지 않은 `{`는 오류로 알립니다.

```rust
// 파일: template.rs
fn render(template: &str, values: &[(&str, &str)]) -> Result<String, String> {
    let mut out = String::with_capacity(template.len());   // 대략 필요한 만큼 미리
    let mut rest = template;
    while let Some(open) = rest.find('{') {
        out.push_str(&rest[..open]);        // '{' 앞까지는 그대로 복사
        let after = &rest[open + 1..];
        let close = after.find('}').ok_or("닫는 } 가 없음")?;
        let key = &after[..close];
        let value = values
            .iter()
            .find(|(k, _)| *k == key)
            .map(|(_, v)| *v)
            .ok_or(format!("값이 없는 이름: {key}"))?;
        out.push_str(value);
        rest = &after[close + 1..];         // '}' 다음부터 다시
    }
    out.push_str(rest);
    Ok(out)
}

fn main() {
    let values = [("name", "민지"), ("book", "모모"), ("days", "7")];
    let templates = [
        "{name}님, '{book}' 반납까지 {days}일 남았습니다.",
        "대출 도서: {book}",
        "{name}님의 연체료: {fee}원",
        "잘못된 틀: {name",
    ];
    for t in templates {
        match render(t, &values) {
            Ok(s) => println!("완성: {s}"),
            Err(e) => println!("오류: {e}"),
        }
    }
}
```

실행 결과:

```text
완성: 민지님, '모모' 반납까지 7일 남았습니다.
완성: 대출 도서: 모모
오류: 값이 없는 이름: fee
오류: 닫는 } 가 없음
```

| 코드                                                                           | 설명                                                                                                                                     |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `fn render(template: &str, values: &[(&str, &str)]) -> Result<String, String>` | 틀과 값은 빌려 읽고, 완성된 문장은 새 `String`으로 돌려줍니다. 4.2절의 관례 그대로입니다.                                                |
| `String::with_capacity(template.len())`                                        | 대략 필요한 크기를 미리 잡아 옮기는 횟수를 줄입니다. 모자라면 알아서 늘어나므로 정확할 필요는 없습니다.                                  |
| `let mut rest = template;`                                                     | 아직 처리하지 않은 뒷부분을 가리키는 `&str`입니다. 복사 없이 가리키는 곳만 뒤로 옮겨 갑니다.                                             |
| `out.push_str(&rest[..open]);`                                                 | `{` 앞까지를 그대로 붙입니다. `find`가 돌려준 위치는 바이트 번호라 바로 범위에 쓸 수 있고, `{`는 1바이트라 `open + 1`도 글자 경계입니다. |
| `.find(\|(k, _)\| *k == key).map(\|(_, v)\| *v)`                               | 값 목록에서 이름이 같은 쌍을 찾아 값만 꺼냅니다. 못 찾으면 `ok_or`가 오류 문장을 만듭니다.                                               |
| `.ok_or("닫는 } 가 없음")?`                                                    | `&str` 오류가 `?`를 지나며 반환 자료형의 `String`으로 자동 변환됩니다.                                                                   |

같은 프로그램을 Python으로 쓰면, 조각을 리스트에 모았다가 `join`하는 방식이 됩니다.

```python
# 파일: template.py
def render(template, values):
    out = []                                # 조각을 모았다가 마지막에 join
    rest = template
    while (open_at := rest.find("{")) != -1:
        out.append(rest[:open_at])
        after = rest[open_at + 1:]
        close = after.find("}")
        if close == -1:
            raise ValueError("닫는 } 가 없음")
        key = after[:close]
        if key not in values:
            raise KeyError(key)
        out.append(values[key])
        rest = after[close + 1:]
    out.append(rest)
    return "".join(out)


values = {"name": "민지", "book": "모모", "days": "7"}
templates = [
    "{name}님, '{book}' 반납까지 {days}일 남았습니다.",
    "대출 도서: {book}",
    "{name}님의 연체료: {fee}원",
    "잘못된 틀: {name",
]
for t in templates:
    try:
        print("완성:", render(t, values))
    except KeyError as e:
        print("오류: 값이 없는 이름:", e.args[0])
    except ValueError as e:
        print("오류:", e)
print("표준 기능:", templates[0].format(**values))
```

실행 결과:

```text
완성: 민지님, '모모' 반납까지 7일 남았습니다.
완성: 대출 도서: 모모
오류: 값이 없는 이름: fee
오류: 닫는 } 가 없음
표준 기능: 민지님, '모모' 반납까지 7일 남았습니다.
```

- `while (open_at := rest.find("{")) != -1:`의 `:=`는 대입과 비교를 한 번에 하는 연산자입니다. Python의 `find`는 못 찾으면 `-1`, Rust는 `None`입니다.
- `rest = after[close + 1:]`는 자르기라 매번 **복사본**을 만듭니다. Rust의 `rest = &after[close + 1..]`는 가리키는 곳만 옮깁니다. 긴 틀에서는 이 차이가 속도에 드러납니다.
- 마지막 줄의 `str.format(**values)`는 Python에 이미 있는 같은 기능입니다. Rust의 `format!`은 틀이 **컴파일할 때** 정해져 있어야 해서, 실행 중에 받은 틀을 채우려면 오늘처럼 직접 만들거나 라이브러리를 씁니다.

## 10. 문자열 자료형 정리

| 역할                     | Rust               | C                                   | Python            |
| ------------------------ | ------------------ | ----------------------------------- | ----------------- |
| 빌려 읽는 문자열         | `&str`             | `const char *`                      | `str`             |
| 프로그램에 박힌 문자열   | `&'static str`     | 문자열 리터럴                       | `str`             |
| 소유하고 늘어나는 문자열 | `String`           | `malloc`한 버퍼 + 길이 + 용량(직접) | (없음, 새로 만듦) |
| 크기가 정해진 버퍼       | `[u8; N]`(드묾)    | `char buf[N]`                       | -                 |
| 제자리에서 고치기        | `&mut String`      | `char *`                            | 불가능            |
| 조각 모아 잇기           | `join`, `push_str` | `snprintf` 반복                     | `"".join(...)`    |

## 11. 세 언어 비교

| 관점               | Rust                                 | C                       | Python                           |
| ------------------ | ------------------------------------ | ----------------------- | -------------------------------- |
| 소유와 빌림의 구별 | 자료형으로 구별(`String`/`&str`)     | 관례(`const`와 문서)    | 없음(바꿀 수 없어 공유해도 안전) |
| 이어 붙이기        | `push_str`(제자리), `+`(왼쪽을 옮김) | 공간 계산 후 `snprintf` | 항상 새 문자열                   |
| 일부 가리키기      | `&s[a..b]`(복사 없음, 수명 검사)     | 포인터 + 길이           | 자르기(복사)                     |
| 끝을 아는 방법     | 길이                                 | `'\0'`                  | 길이                             |
| 잘못된 글자 경계   | 패닉                                 | 알아채지 못함           | 해당 없음(글자 단위)             |

## 12. 자주 하는 실수

### 실수 1: + 뒤에 왼쪽 값을 다시 쓴다

```rust
// 파일: plus_moved.rs (컴파일 오류: E0382)
fn main() {
    let a = String::from("해리");
    let b = String::from(" 포터");
    let c = a + &b;
    println!("{a} {c}");
}
```

실습의 디버그 문제입니다. `format!("{a}{b}")`를 쓰거나 `a.clone() + &b`로 쓰세요.

### 실수 2: String 두 개를 +로 더한다

```rust
// 파일: plus_string.rs (컴파일 오류: E0308)
fn main() {
    let a = String::from("해리");
    let b = String::from(" 포터");
    let c = a + b;
    println!("{c}");
}
```

`+`의 오른쪽은 `&str`이어야 합니다. `a + &b`로 쓰세요.

### 실수 3: 함수 안에서 만든 String의 조각을 돌려준다

```rust
// 파일: return_str.rs (컴파일 오류: E0106)
fn label() -> &str {
    let s = String::from("모모");
    &s
}

fn main() {
    println!("{}", label());
}
```

돌려줄 `&str`이 무엇을 빌린 것인지 알 수 없어 수명 표기를 요구합니다. 사실은 함수 안의 `s`를 빌린 것이라 표기를 붙여도 E0515입니다. 새로 만든 문자열은 `String`으로 돌려주세요.

### 실수 4: parse 결과를 unwrap으로 믿는다

```rust
// 파일: parse_unwrap.rs (실행 오류: ParseIntError)
fn main() {
    let n: i32 = "12a".parse().unwrap();
    println!("{n}");
}
```

사용자 입력은 숫자가 아닐 수 있습니다. `match "12a".parse::<i32>() { Ok(n) => ..., Err(e) => ... }`로 처리하세요(Day 25).

### 실수 5: 매개변수를 &String으로 받는다

`fn count(s: &String)`는 리터럴 `count("abc")`를 받지 못해 호출하는 쪽이 `String`을 따로 만들어야 합니다. `&str`로 받으면 모든 경우를 받을 수 있고, Clippy도 이것을 고치라고 알려 줍니다.

## 13. Q&A

**Q. 왜 Rust에는 문자열이 두 가지나 있나요?**

A. "누가 공간을 가지고 있는가"를 자료형으로 드러내기 위해서입니다. C에서는 `char *`만 보고는 이 포인터가 `free`해야 하는 것인지, 빌린 것인지 알 수 없습니다. Rust는 `String`(정리 책임 있음)과 `&str`(없음)을 나눠, 컴파일러가 정리와 수명을 대신 검사하게 했습니다. `Vec<T>`와 `&[T]`의 관계와 똑같습니다.

**Q. to_string, to_owned, String::from, into 중 무엇을 쓰나요?**

A. `&str`에서 `String`을 만들 때는 결과가 같습니다. 이 과정에서는 뜻이 분명한 `String::from("...")`과 `.to_string()`을 주로 씁니다. `to_string()`은 숫자 등 출력할 수 있는 모든 값에도 쓸 수 있습니다(`42.to_string()`).

**Q. 문자열을 글자 번호로 다루고 싶으면요?**

A. `let chars: Vec<char> = s.chars().collect();`로 글자 목록을 만들면 `chars[i]`로 글자 번호 접근이 됩니다. 대신 한 글자에 4바이트를 써서 메모리를 더 씁니다. 다 고친 뒤 `chars.iter().collect::<String>()`으로 되돌립니다.

**Q. Python에서도 문자열을 제자리에서 늘릴 수 있나요?**

A. `str`은 불가능합니다. 많이 붙여야 한다면 리스트에 모아 `join`하거나, `io.StringIO`에 `write`한 뒤 `getvalue()`로 꺼냅니다. 바이트라면 바꿀 수 있는 `bytearray`가 있습니다.

## 14. 핵심 요약

- `String`은 힙 공간을 **소유**하고 늘어나는 문자열, `&str`은 어딘가의 UTF-8 바이트를 **빌린** 조각입니다. 리터럴은 `&'static str`입니다.
- `&str` → `String`은 `String::from`/`to_string`(복사), `String` → `&str`은 `&s`/`as_str`(빌림)입니다. `&String`은 `&str` 자리에 자동으로 쓰입니다.
- 함수는 **`&str`로 받고**, 새로 만든 결과는 **`String`으로 돌려줍니다.** 받은 것의 일부라면 `&str`을 돌려줄 수 있습니다.
- `push_str`·`+=`는 제자리에서 붙이고, `a + &b`는 `a`를 옮기며, `format!`은 모두 빌려 새로 만듭니다. 여러 조각은 `join`으로 한 번에 잇습니다.
- `trim`은 빌린 조각을, `pop`·`remove`·`truncate`·`retain`은 제자리 수정을, `parse`는 `Result`를 돌려줍니다. 위치는 모두 바이트 번호입니다.
- C는 `const char *`(빌림)와 버퍼(소유)를 관례로 구별하고, Python은 바꿀 수 없는 `str`을 새로 만들며 `join`으로 모읍니다.

## 15. 도전 문제

1. **(Rust)** `fn capitalize_words(s: &str) -> String`으로 영어 문장의 각 단어 첫 글자를 대문자로 바꾸세요. `"hello rust world"` → `"Hello Rust World"`. 첫 글자는 `chars().next()`로 꺼내고, 나머지는 `&w[first.len_utf8()..]`로 빌립니다.
2. **(Rust)** 템플릿 예제에 `{{`를 쓰면 `{` 글자 자체가 나오는 기능을 추가하세요.
3. **(C)** `void render(char *out, size_t size, const char *tmpl, const char *name)`으로 `{name}` 하나만 바꾸는 템플릿을 만들고, 결과가 버퍼를 넘치면 잘렸다는 표시를 돌려주세요.
4. **(Python)** 템플릿 예제의 `render`를 `io.StringIO`로 다시 만들고, 결과가 같은지 확인하세요.
