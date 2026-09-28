---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-45-lifetime
courseId: crp-92
phaseId: phase-04
dayNumber: 45
date: "2026-11-14"
title: Rust 참조의 유효 수명
summary: 참조가 가리키는 값보다 오래 살 수 없다는 규칙을 Rust가 어떻게 검사하는지 배웁니다. 수명 매개변수 'a가 "결과가 어느 입력에서 빌려 왔는가"를 적는 표시라는 것, longest처럼 참조를 둘 받아 하나를 돌려줄 때 표기가 필요한 이유(E0106), 표기를 생략할 수 있는 세 가지 규칙, 참조를 담는 구조체 Excerpt<'a>, 값이 먼저 사라질 때의 E0597, 프로그램 내내 사는 'static을 다룹니다. C에서는 같은 약속을 주석으로만 지킬 수 있다는 점, Python에서는 객체가 가리키는 곳이 있는 한 살아 있다는 점을 비교하고, 원문을 복사하지 않고 빌려 오는 줄 검색 프로그램을 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-44-mutable-arguments]
learningObjectives:
  - 수명 매개변수 'a가 값의 수명을 바꾸지 않고, 참조 사이의 관계만 적는다는 것을 설명한다.
  - 참조를 여럿 받아 참조를 돌려주는 함수에 수명을 표기하고, 표기 생략 규칙이 적용되는 경우를 구별한다.
  - 참조를 필드로 담는 구조체를 만들고, 구조체가 빌린 값보다 오래 살 수 없다는 것을 설명한다.
  - E0106, E0597 오류를 읽고 값을 더 오래 살게 하거나 소유한 값을 돌려주는 방식으로 고친다.
  - C의 포인터 수명 약속과 Python의 참조 세기를 Rust의 수명 검사와 비교한다.
concepts:
  [
    lifetime,
    lifetime parameter,
    borrow checker,
    elision rules,
    dangling reference,
    e0106,
    e0597,
    static lifetime,
    struct with reference,
    borrowed view,
    memoryview,
  ]
runnerMode: python
playgroundSource: |
  # 파일: alive.py — Python 객체는 가리키는 곳이 있는 한 살아 있습니다.
  def longest(x, y):
      return x if len(x) >= len(y) else y

  a = "미하엘 엔데"
  b = "모모"
  result = longest(a, b)
  del a, b
  print(result)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day45-predict-rs
    title: 한쪽에만 묶인 결과 예측하기
    kind: predict
    objective: 수명 표기가 결과를 어느 입력에 묶는지에 따라 쓸 수 있는 범위가 달라진다는 것을 확인한다.
    prompt: 이 코드는 컴파일됩니다. 출력되는 한 줄을 적으세요.
    starter: |-
      fn pick_left<'a>(x: &'a str, _y: &str) -> &'a str {
          x
      }

      fn main() {
          let a = String::from("A");
          let r;
          {
              let b = String::from("BB");
              r = pick_left(&a, &b);
          }
          println!("{r}");
      }
    answer: "A"
    hint: "결과의 수명 'a는 x에만 붙어 있습니다. y는 결과와 관계가 없습니다."
    explanation: "시그니처가 '결과는 x에서 빌려 온다'고 약속하므로, 컴파일러는 r이 a보다 오래 살지 않는지만 확인합니다. b는 블록 끝에서 사라져도 r과 상관없어서 컴파일됩니다. y에도 'a를 붙였다면(longest처럼) r은 b보다 오래 살 수 없어서 E0597이 납니다."
    commonMistakes:
      - "b가 먼저 사라지니 컴파일 오류라고 생각함"
      - "더 긴 BB를 돌려준다고 생각함"
    language: rust
    verification: run
  - id: ex-day45-predict-c
    title: C의 longest 예측하기
    kind: predict
    objective: 입력 중 하나를 가리키는 포인터를 돌려주는 C 함수를 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>
      #include <string.h>

      const char *longest(const char *x, const char *y) {
          return strlen(x) >= strlen(y) ? x : y;
      }

      int main(void) {
          printf("%s %s\n", longest("ab", "cd"), longest("a", "xyz"));
          return 0;
      }
    answer: "ab xyz"
    hint: "길이가 같으면 >= 때문에 x를 돌려줍니다."
    explanation: '"ab"와 "cd"는 길이가 같아 x인 "ab", 두 번째는 "xyz"가 더 깁니다. 돌려준 포인터는 새 문자열이 아니라 입력 중 하나를 가리킵니다. 리터럴은 프로그램 내내 살아서 안전하지만, 지역 배열이나 free할 버퍼를 넘겼다면 그것이 사라지기 전까지만 써야 합니다. C는 이 약속을 검사하지 않습니다.'
    commonMistakes:
      - "길이가 같으면 y를 돌려준다고 생각함"
      - "longest가 새 문자열을 만든다고 생각함"
    language: c
    verification: run
  - id: ex-day45-fill
    title: 반환 참조에 수명 적기 채우기
    kind: fill
    objective: 두 입력과 결과를 같은 수명 매개변수로 묶는다.
    prompt: "빈칸을 채워 longest가 컴파일되게 하고 'banana'가 출력되게 하세요."
    starter: |-
      fn longest<'a>(x: &'a str, y: &'a str) -> _____ str {
          if x.len() >= y.len() { x } else { y }
      }

      fn main() {
          println!("{}", longest("kiwi", "banana"));
      }
    answer: |-
      fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
          if x.len() >= y.len() { x } else { y }
      }

      fn main() {
          println!("{}", longest("kiwi", "banana"));
      }
    output: "banana"
    hint: "결과도 참조이고, x나 y 중 하나에서 왔습니다. 두 입력과 같은 이름의 수명을 붙이세요."
    explanation: "&'a str은 '수명 'a 동안 유효한 &str'입니다. x, y, 결과에 같은 'a를 붙이면 '결과는 x와 y가 둘 다 살아 있는 동안만 쓸 수 있다'는 뜻이 됩니다. 실제로 'a는 두 입력의 수명 중 짧은 쪽으로 정해집니다. 표기는 값의 수명을 늘리지 않고, 관계만 알려 줍니다."
    commonMistakes:
      - "&str만 써서 E0106(missing lifetime specifier)이 남"
      - "&'static str로 써서 빌린 String을 넘길 수 없게 됨"
    language: rust
    verification: run
  - id: ex-day45-modify
    title: 복사해서 돌려주던 함수를 빌려서 돌려주기로
    kind: modify
    objective: 입력의 일부를 돌려줄 때는 복사 대신 빌린 &str을 돌려준다.
    prompt: "first_line은 첫 줄을 String으로 복사해 돌려줍니다. 복사하지 않고 원문의 첫 줄을 빌린 &str을 돌려주도록 고치세요. 출력은 그대로 '모모'입니다."
    starter: |-
      fn first_line(text: &str) -> String {
          text.lines().next().unwrap_or("").to_string()
      }

      fn main() {
          let book = String::from("모모\n회색 신사");
          println!("{}", first_line(&book));
      }
    answer: |-
      fn first_line(text: &str) -> &str {
          text.lines().next().unwrap_or("")
      }

      fn main() {
          let book = String::from("모모\n회색 신사");
          println!("{}", first_line(&book));
      }
    output: "모모"
    starterOutput: "모모"
    hint: "참조 매개변수가 하나뿐이면 결과가 그것에서 왔다고 컴파일러가 추론합니다. 수명을 적지 않아도 됩니다."
    explanation: "생략 규칙 덕분에 fn first_line<'a>(text: &'a str) -> &'a str을 짧게 쓴 것과 같습니다. 복사가 없어 빠르지만, 결과는 book이 살아 있는 동안만 쓸 수 있습니다. 원문보다 오래 보관해야 한다면 원래처럼 String으로 복사해 소유하는 편이 맞습니다. 빌리기와 복사하기 중 무엇이 맞는지는 결과를 얼마나 오래 쓰는지로 정합니다."
    commonMistakes:
      - 'unwrap_or("")를 지워 Option<&str>이 되어 자료형이 맞지 않음'
      - "&String을 돌려주려 해서 임시 값의 참조 문제가 생김"
    language: rust
    verification: run
  - id: ex-day45-debug
    title: 먼저 사라지는 값을 빌린 결과 고치기
    kind: debug
    objective: E0597을 값의 범위를 넓혀 고친다.
    prompt: "이 코드는 E0597(`b` does not live long enough) 오류로 컴파일되지 않습니다. b를 블록 밖에서 만들어 result를 쓰는 곳까지 살아 있게 고치고, '미하엘 엔데'가 출력되게 하세요."
    starter: |-
      fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
          if x.len() >= y.len() { x } else { y }
      }

      fn main() {
          let a = String::from("미하엘 엔데");
          let result;
          {
              let b = String::from("모모");
              result = longest(&a, &b);
          }
          println!("{result}");
      }
    answer: |-
      fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
          if x.len() >= y.len() { x } else { y }
      }

      fn main() {
          let a = String::from("미하엘 엔데");
          let b = String::from("모모");
          let result = longest(&a, &b);
          println!("{result}");
      }
    output: "미하엘 엔데"
    hint: "실제로는 a가 선택되지만, 컴파일러는 시그니처만 보고 판단합니다. 결과는 b에서 왔을 수도 있습니다."
    explanation: "longest의 결과는 x와 y 중 짧게 사는 쪽만큼만 유효합니다. b가 블록 끝에서 사라지면, 결과가 b였을 가능성 때문에 그 뒤에 result를 쓸 수 없습니다. 실행해 보면 a가 선택되더라도 컴파일러는 실행 결과가 아니라 약속(시그니처)으로 검사합니다. 다른 해결책은 println!을 블록 안으로 옮기거나, longest(&a, &b).to_string()으로 복사해 소유하는 것입니다."
    commonMistakes:
      - "longest의 y에서 'a를 지워 함수 안에서 y를 돌려줄 수 없다는 오류가 남"
      - "b를 &'static으로 만들려고 함"
    language: rust
    verification: run
  - id: ex-day45-independent
    title: Python으로 가장 긴 단어 찾기
    kind: independent
    objective: 문자열을 나눠 가장 긴 조각을 돌려주고, Rust라면 무엇을 빌리는지 생각한다.
    prompt: 'def longest_word(text)가 공백으로 나눈 단어 중 가장 긴 것을 돌려주게 하고, "시간은 삶이다 그리고 삶은 마음속에 산다"에서 ''마음속에''를 출력하세요.'
    starter: |-
      text = "시간은 삶이다 그리고 삶은 마음속에 산다"
      print(text)
    answer: |-
      def longest_word(text):
          return max(text.split(), key=len)


      print(longest_word("시간은 삶이다 그리고 삶은 마음속에 산다"))
    output: "마음속에"
    hint: "split()으로 나누고 max에 key=len을 주세요."
    explanation: "Python에서 split은 단어마다 새 문자열을 만들어서, 결과는 원문과 따로 삽니다. Rust로 같은 함수를 만들면 fn longest_word(text: &str) -> &str이 되고, 결과는 text를 빌린 조각이라 복사가 없지만 text보다 오래 쓸 수 없습니다. 길이가 같은 단어가 여럿이면 max는 처음 것을 돌려줍니다."
    commonMistakes:
      - "max(text.split())으로 써서 사전 순서의 마지막 단어를 고름"
      - "len(text)로 비교해 모든 단어가 같게 비교됨"
    language: python
    verification: run
quiz:
  - id: quiz-day45-01
    question: 수명 매개변수 'a가 하는 일은?
    choices:
      - 값을 'a 동안 더 오래 살게 한다
      - 참조들 사이의 관계(결과가 어느 입력에서 빌려 왔는지)를 컴파일러에게 알린다
      - 실행 중에 수명을 검사한다
      - 메모리를 할당한다
    answerIndex: 1
    explanation: 수명 표기는 아무것도 늘리거나 줄이지 않습니다. "이 결과는 저 입력보다 오래 살 수 없다"는 약속을 적을 뿐이고, 컴파일러가 모든 호출에서 이 약속이 지켜지는지 검사합니다. 실행할 때는 비용이 없습니다.
  - id: quiz-day45-02
    question: "fn f(x: &str, y: &str) -> &str 모양(참조 둘, 반환 참조)에 수명 표기가 필요한 이유는?"
    choices:
      - 필요 없다
      - 결과가 x에서 왔는지 y에서 왔는지 컴파일러가 시그니처만으로 알 수 없기 때문
      - 문자열은 항상 표기해야 해서
      - 반환값이 없어서
    answerIndex: 1
    explanation: 생략 규칙은 "참조 입력이 하나면 결과는 그것에서" 또는 "&self가 있으면 결과는 self에서"일 때만 적용됩니다. 입력 참조가 둘이면 어느 쪽인지 적어야 합니다(E0106).
  - id: quiz-day45-03
    question: "struct Excerpt<'a> { title: &'a str } 값에 대한 설명으로 옳은 것은?"
    choices:
      - title은 복사본이다
      - Excerpt 값은 title이 가리키는 원문보다 오래 살 수 없다
      - Excerpt는 'static이어야 한다
      - 필드에 참조를 둘 수 없다
    answerIndex: 1
    explanation: 참조를 필드로 가진 구조체는 그 참조만큼만 유효합니다. 원문이 먼저 사라지면 E0597입니다. 오래 보관해야 하면 String 필드로 소유하세요.
  - id: quiz-day45-04
    question: 문자열 리터럴 "안녕"의 자료형은?
    choices:
      - String
      - "&'static str"
      - "&'a str"
      - char
    answerIndex: 1
    explanation: 리터럴은 프로그램 파일 안에 들어 있어 프로그램이 끝날 때까지 삽니다. 그래서 어떤 수명이 필요한 자리에도 넘길 수 있습니다. 다만 오류를 고치려고 무조건 'static을 붙이는 것은 대부분 잘못된 해결입니다.
  - id: quiz-day45-05
    question: C에서 Rust의 수명 검사에 해당하는 것은?
    choices:
      - const
      - 없음(포인터가 가리키는 곳이 살아 있는지는 주석과 약속으로 지킨다)
      - malloc
      - static
    answerIndex: 1
    explanation: C 컴파일러는 지역 변수의 주소를 돌려주는 것 같은 단순한 경우만 경고합니다. 버퍼를 해제한 뒤 그 안을 가리키던 포인터를 쓰는 일은 대부분 찾지 못합니다. Rust는 이 관계를 자료형의 일부로 만들어 컴파일할 때 모두 검사합니다.
---

## 1. 오늘 배울 내용

Day 33에서 빌림 규칙을, Day 35에서 "값은 언제 사라지는가"를, Day 39에서 `&str`을 배웠습니다. 오늘은 그 셋을 잇는 마지막 조각인 **수명(lifetime)** 을 다룹니다.

> 참조는 자기가 가리키는 값보다 오래 살 수 없다.

1. Rust가 이 규칙을 어떻게 검사하는지 봅니다.
2. **수명 매개변수 `'a`** 를 읽고 씁니다.
   - `longest(x, y)`처럼 참조를 둘 받아 하나를 돌려줄 때 필요합니다(E0106).
   - 표기를 **생략**할 수 있는 규칙 세 가지
3. 참조를 필드로 담는 구조체 `Excerpt<'a>`를 만듭니다.
4. 값이 먼저 사라질 때의 E0597을 읽고 고칩니다.
5. 프로그램 내내 사는 `'static`을 봅니다.
6. 다른 두 언어를 비교합니다.
   - C: 같은 약속을 주석으로만 지킬 수 있습니다.
   - Python: 객체는 가리키는 곳이 있는 한 살아 있습니다.
7. 원문을 복사하지 않고 빌려 오는 **줄 검색** 프로그램을 만듭니다.

## 2. 왜 필요한가

"사라진 값을 가리키는 참조"(댕글링 참조)는 C와 C++에서 가장 찾기 어려운 버그입니다.

- 버퍼를 해제한 뒤에도 그 안을 가리키던 포인터를 계속 씁니다.
- 함수가 지역 변수 안을 가리키는 포인터를 돌려줍니다.
- 목록이 더 큰 공간으로 옮겨 갔는데 옛 칸의 포인터를 들고 있습니다(Day 42).

이 버그는 대부분 **바로 드러나지 않고**, 한참 뒤에 엉뚱한 곳에서 이상한 값으로 나타납니다. Rust는 컴파일할 때 모든 참조의 수명을 검사해서 이런 코드를 아예 만들 수 없게 합니다. 그 대가로 프로그래머는 가끔 "이 결과는 어느 입력에서 빌려 왔다"를 적어 줘야 하고, 그것이 `'a`입니다.

## 3. 그림으로 이해하기

수명은 **값이 살아 있는 구간**입니다. 참조의 구간은 값의 구간 안에 들어가야 합니다.

```text
fn main() {
    let a = String::from("미하엘 엔데");  ─┐ a의 수명
    let result;                           │
    {                                     │
        let b = String::from("모모");    ─┐│ b의 수명
        result = longest(&a, &b);         ││
    }                                   ─┘│ ← b 끝
    println!("{result}");                 │ ← result를 여기서 쓰려면
}                                       ──┘   result는 b보다 오래 살아야 한다 ✗ (E0597)
```

`longest<'a>(x: &'a str, y: &'a str) -> &'a str`은 이렇게 읽습니다.

```text
'a = x의 수명과 y의 수명이 겹치는 구간(짧은 쪽)
결과 &'a str = 그 구간 안에서만 쓸 수 있다

x ──────────────────────┐
y ────────────┐         │
결과 ─────────┘ 여기까지만(y가 더 짧으니까)
```

`pick_left<'a>(x: &'a str, _y: &str) -> &'a str`은 결과를 **x에만** 묶습니다. 그래서 `y`가 먼저 사라져도 결과를 계속 쓸 수 있습니다.

참조를 담은 구조체도 같은 원리입니다.

```text
book  ┌──────────────────────────────────┐
      │ 모모\n회색 신사들이 시간을 훔친다.\n... │
      └──────────────────────────────────┘
        ▲           ▲
ex.title   ex.first_line        ex는 book보다 오래 살 수 없다
```

## 4. 천천히 풀어보기

### 4.1 수명 표기 읽는 법

| 표기                          | 뜻                                                                     |
| ----------------------------- | ---------------------------------------------------------------------- |
| `&'a str`                     | 수명 `'a` 동안 유효한 `&str`                                           |
| `fn f<'a>(...)`               | 이 함수는 수명 매개변수 `'a`를 쓴다(자료형 매개변수 `<T>`와 같은 자리) |
| `struct S<'a> { x: &'a str }` | `S` 값은 `x`가 빌린 것보다 오래 살 수 없다                             |
| `'static`                     | 프로그램 전체 동안(리터럴, 전역 상수)                                  |
| `'_`                          | "알아서 추론해 줘"라는 자리 표시                                       |

수명 이름은 보통 `'a`, `'b`처럼 짧게 짓습니다. 이름이 무엇이든, 같은 이름끼리 묶인다는 것이 중요합니다.

### 4.2 생략 규칙

대부분의 함수는 수명을 적지 않아도 됩니다. 컴파일러가 다음 규칙으로 채웁니다.

1. 참조 매개변수마다 각자 다른 수명을 줍니다.
2. 참조 매개변수가 **하나**뿐이면, 결과 참조도 그 수명입니다. (`fn first_word(s: &str) -> &str`)
3. 메서드에 `&self`나 `&mut self`가 있으면, 결과 참조는 `self`의 수명입니다(Day 52).

이 규칙으로 결과의 수명이 정해지지 않으면(참조 입력이 둘 이상이고 `self`가 없으면) 직접 적어야 하고, 적지 않으면 E0106입니다.

### 4.3 참조를 담는 구조체

필드에 참조가 있으면 구조체 이름 뒤에 수명 매개변수를 붙입니다. 이런 구조체는 **남의 데이터를 잠깐 보는 창**입니다.

- 장점: 큰 원문을 복사하지 않습니다.
- 단점: 원문보다 오래 보관할 수 없습니다.

오래 보관하거나 다른 곳으로 보내야 한다면 `String` 필드로 **소유**하세요. 대부분의 구조체는 소유하는 쪽이 다루기 쉽습니다.

### 4.4 오류가 날 때 고르는 해결책

| 상황                                     | 해결                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| 빌려 온 값이 너무 일찍 사라짐(E0597)     | 값을 더 바깥 범위에서 만들기, 참조를 쓰는 줄을 앞으로 옮기기 |
| 결과를 오래 보관해야 함                  | `to_string()`, `clone()`으로 복사해 소유하기                 |
| 함수 안에서 만든 값의 참조를 돌려주려 함 | 소유한 값(`String`, `Vec`) 돌려주기(E0515, Day 35)           |
| 결과가 한 입력에서만 옴                  | 그 입력에만 수명을 붙이기(`pick_left`)                       |

`'static`을 붙여 오류를 없애려는 것은 대부분 잘못된 해결입니다. 빌린 `String`을 넘길 수 없게 될 뿐입니다.

## 5. Rust로 구현하기

```rust
// 파일: lifetimes.rs
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {   // 결과는 둘 중 짧게 사는 쪽만큼 산다
    if x.len() >= y.len() { x } else { y }
}

fn first_word(s: &str) -> &str {            // 참조 매개변수가 하나면 표기를 생략할 수 있다
    s.split_whitespace().next().unwrap_or("")
}

fn pick_left<'a>(x: &'a str, _y: &str) -> &'a str {   // 결과가 x에서만 온다고 알린다
    x
}

struct Excerpt<'a> {                        // 남의 문자열을 빌려 담는 구조체
    title: &'a str,
    first_line: &'a str,
}

fn excerpt(text: &str) -> Excerpt<'_> {
    let mut lines = text.lines();
    Excerpt {
        title: lines.next().unwrap_or(""),
        first_line: lines.next().unwrap_or(""),
    }
}

const GREETING: &str = "안녕";              // 'static: 프로그램 내내 산다

fn main() {
    let a = String::from("미하엘 엔데");
    let result;
    {
        let b = String::from("모모");
        println!("longest: {}", longest(&a, &b));   // a, b 모두 살아 있는 동안만 쓴다
        result = pick_left(&a, &b);                  // 결과는 a에만 묶였다
    }                                                // b는 여기서 사라진다
    println!("pick_left는 b보다 오래 쓸 수 있다: {result}");
    println!("first_word: {}", first_word(&a));

    let book = String::from("모모\n회색 신사들이 시간을 훔친다.\n...");
    let ex = excerpt(&book);                // ex는 book을 빌리고 있다
    println!("제목 [{}] 첫 줄 [{}]", ex.title, ex.first_line);

    let s: &'static str = GREETING;
    println!("'static: {s}, 리터럴도 'static: {}", longest("abc", "de"));
}
```

실행 결과:

```text
longest: 미하엘 엔데
pick_left는 b보다 오래 쓸 수 있다: 미하엘 엔데
first_word: 미하엘
제목 [모모] 첫 줄 [회색 신사들이 시간을 훔친다.]
'static: 안녕, 리터럴도 'static: abc
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str` | 결과는 `x`와 `y`가 **둘 다** 살아 있는 동안만 쓸 수 있다는 약속입니다. 블록 안에서 바로 출력했으니 문제없습니다.                     |
| `fn first_word(s: &str) -> &str`                    | 참조 입력이 하나라 생략 규칙 2가 적용됩니다. `fn first_word<'a>(s: &'a str) -> &'a str`과 같습니다.                                  |
| `fn pick_left<'a>(x: &'a str, _y: &str) -> &'a str` | 결과를 `x`에만 묶었습니다. 그래서 `result`를 `b`가 사라진 뒤에도 쓸 수 있습니다. 함수 안에서 `_y`를 돌려주려 하면 컴파일 오류입니다. |
| `struct Excerpt<'a> { title: &'a str, ... }`        | 원문의 두 줄을 빌려 담습니다. 복사가 없습니다.                                                                                       |
| `fn excerpt(text: &str) -> Excerpt<'_>`             | `'_`는 "생략 규칙대로 채워 달라"는 뜻입니다. 결과 `Excerpt`는 `text`를 빌린 것입니다.                                                |
| `let ex = excerpt(&book);`                          | `ex`가 살아 있는 동안 `book`을 바꾸거나 없앨 수 없습니다(빌림 규칙).                                                                 |
| `const GREETING: &str = "안녕";`                    | 상수와 리터럴은 `'static`입니다. `longest("abc", "de")`처럼 리터럴끼리 넘기면 결과도 `'static`입니다.                                |

## 6. C로 구현하기

C에는 수명 표기가 없습니다. 같은 약속을 **주석**으로 적고 프로그래머가 지킵니다.

```c
// 파일: borrowed_views.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 돌려주는 포인터는 x나 y 중 하나를 가리킨다: 둘 다 살아 있는 동안만 써야 한다(주석으로 약속)
const char *longest(const char *x, const char *y) {
    return strlen(x) >= strlen(y) ? x : y;
}

struct excerpt {                            // text 안의 두 구간을 가리킨다(복사 없음)
    const char *title;
    size_t title_len;
    const char *line;
    size_t line_len;
};

struct excerpt make_excerpt(const char *text) {
    struct excerpt e;
    const char *nl = strchr(text, '\n');
    e.title = text;
    e.title_len = nl ? (size_t)(nl - text) : strlen(text);
    e.line = nl ? nl + 1 : text + e.title_len;
    const char *nl2 = strchr(e.line, '\n');
    e.line_len = nl2 ? (size_t)(nl2 - e.line) : strlen(e.line);
    return e;
}

int main(void) {
    const char *a = "Michael Ende";
    char b[] = "Momo";
    printf("longest: %s\n", longest(a, b));

    const char *src = "Momo\nGray men steal time.\n...";
    char *book = malloc(strlen(src) + 1);
    if (book == NULL) {
        return 1;
    }
    strcpy(book, src);
    struct excerpt ex = make_excerpt(book); // ex는 book을 "빌리고" 있다
    printf("제목 [%.*s] 첫 줄 [%.*s]\n", (int)ex.title_len, ex.title, (int)ex.line_len, ex.line);
    free(book);                             // 이제 ex.title, ex.line은 사라진 곳을 가리킨다
    ex.title = ex.line = NULL;              // 쓰지 않도록 지워 둔다(컴파일러는 막아 주지 않는다)
    printf("book을 해제한 뒤 ex는 쓰면 안 된다\n");
    return 0;
}
```

실행 결과:

```text
longest: Michael Ende
제목 [Momo] 첫 줄 [Gray men steal time.]
book을 해제한 뒤 ex는 쓰면 안 된다
```

### 코드 한 부분씩 읽기

| 코드                                                          | 설명                                                                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `const char *longest(const char *x, const char *y)`           | Rust의 `longest`와 같은 함수입니다. "결과는 x나 y를 가리킨다"는 사실은 주석으로만 알릴 수 있습니다.                                           |
| `struct excerpt { const char *title; size_t title_len; ... }` | `'\0'`로 끝나지 않는 구간이라 주소와 길이를 함께 저장했습니다. Rust `&str`의 (주소, 길이)와 같은 모양입니다.                                  |
| `e.title_len = nl ? (size_t)(nl - text) : strlen(text);`      | 줄바꿈이 있으면 그 앞까지, 없으면 끝까지입니다. 포인터 빼기로 길이를 구했습니다(Day 30).                                                      |
| `printf("[%.*s]", (int)len, ptr)`                             | 길이를 정해 출력합니다(Day 39).                                                                                                               |
| `free(book);`                                                 | 이 순간 `ex`의 두 포인터는 사라진 곳을 가리킵니다. 그 뒤에 `ex.title`을 출력해도 컴파일러는 막지 않습니다. Rust에서는 E0505·E0597로 막힙니다. |
| `ex.title = ex.line = NULL;`                                  | 실수로 쓰지 않도록 지웠습니다. 사람이 기억해야 하는 일입니다.                                                                                 |

C 문자열에 영문을 쓴 이유는 `%.*s`의 길이가 바이트 단위라서입니다. 한글도 동작하지만, 길이를 글자 수로 착각하기 쉽습니다(Day 37).

## 7. Python으로 구현하기

```python
# 파일: views_py.py
def longest(x, y):
    return x if len(x) >= len(y) else y


class Excerpt:
    def __init__(self, text):
        lines = text.split("\n")
        self.title = lines[0]                # 새 문자열 객체(원본과 따로 산다)
        self.first_line = lines[1] if len(lines) > 1 else ""


a = "미하엘 엔데"
result = None
if True:                                    # Python에는 블록 범위가 없다: b는 if 밖에서도 산다
    b = "모모"
    result = longest(a, b)
del b                                       # 이름을 지워도
print("longest:", result)                   # result가 가리키는 객체는 살아 있다

book = "모모\n회색 신사들이 시간을 훔친다.\n..."
ex = Excerpt(book)
del book                                    # 원본이 사라져도 ex는 자기 문자열을 가진다
print(f"제목 [{ex.title}] 첫 줄 [{ex.first_line}]")

view = memoryview(b"Momo Ende")             # 복사 없이 바이트를 빌려 보는 도구
first = view[:4]
print("memoryview:", first.tobytes(), "원본 길이", len(view))
```

실행 결과:

```text
longest: 미하엘 엔데
제목 [모모] 첫 줄 [회색 신사들이 시간을 훔친다.]
memoryview: b'Momo' 원본 길이 9
```

### 코드 한 부분씩 읽기

| 코드                           | 설명                                                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `if True:` 안의 `b = "모모"`   | Python에는 블록 범위가 없어서 `b`는 `if` 밖에서도 삽니다. Rust의 `{ }` 블록과 다릅니다.                                           |
| `del b` / `print(result)`      | `result`가 같은 객체를 가리키는 한 객체는 살아 있습니다. Python에는 "사라진 값을 가리키는 참조"가 있을 수 없습니다(Day 35).       |
| `lines = text.split("\n")`     | 줄마다 **새 문자열**을 만듭니다. 그래서 `Excerpt`는 원문과 따로 살고, `del book` 뒤에도 문제가 없습니다. 대신 복사 비용이 듭니다. |
| `memoryview(b"Momo Ende")[:4]` | 복사 없이 바이트를 빌려 보는 창입니다. Rust의 슬라이스와 비슷하지만, 빌린 동안 원본이 살아 있게 붙잡아 두는 것은 실행기가 합니다. |

## 8. 실행 추적

Rust 예제의 `main`에서 각 값과 참조가 살아 있는 구간을 표로 그려 봅니다.

| 줄                              | `a`  | `b`  | `result`               | 검사                  |
| ------------------------------- | ---- | ---- | ---------------------- | --------------------- |
| `let a = String::from(...)`     | 시작 |      |                        |                       |
| `let b = String::from("모모");` | 삶   | 시작 |                        |                       |
| `longest(&a, &b)` 출력          | 삶   | 삶   | (임시 결과, 바로 사용) | a, b 모두 살아 있음 ✓ |
| `result = pick_left(&a, &b);`   | 삶   | 삶   | 시작(a에 묶임)         |                       |
| 블록 끝 `}`                     | 삶   | 끝   | 삶                     | result는 b와 무관 ✓   |
| `println!(... {result})`        | 삶   |      | 사용                   | a가 살아 있음 ✓       |

`pick_left` 대신 `longest`를 썼다면 `result`가 `b`에도 묶여서, 블록 끝 뒤의 `println!`이 E0597이 됩니다. 실습의 디버그 문제가 바로 그 경우입니다.

## 9. 다른 예제로 다시 이해하기

**복사 없는 줄 검색.** 긴 원문에서 검색어가 들어 있는 줄을 찾아 줄 번호와 함께 돌려줍니다. 결과는 원문의 줄을 **빌린** `&str`이라 복사가 없습니다. 검색어는 검색하는 동안만 필요하므로 결과의 수명과 묶지 않습니다.

```rust
// 파일: search.rs
struct Match<'a> {
    line_no: usize,
    line: &'a str,                          // 원문의 한 줄을 빌린다(복사 없음)
}

// 결과는 text를 빌린다. query는 검색하는 동안만 필요하다
fn search<'a>(query: &str, text: &'a str) -> Vec<Match<'a>> {
    text.lines()
        .enumerate()
        .filter(|(_, line)| line.contains(query))
        .map(|(i, line)| Match { line_no: i + 1, line: line.trim() })
        .collect()
}

fn main() {
    let poem = String::from("시간은 삶이다.\n  그리고 삶은 마음속에 산다.\n회색 신사들은 시간을 훔친다.\n모모는 듣는다.");
    let found;
    {
        let query = String::from("시간");   // 검색어는 먼저 사라져도 된다
        found = search(&query, &poem);
    }
    for m in &found {
        println!("{:>2}: {}", m.line_no, m.line);
    }
    println!("'삶' {}줄, '없음' {}줄", search("삶", &poem).len(), search("없음", &poem).len());
}
```

실행 결과:

```text
 1: 시간은 삶이다.
 3: 회색 신사들은 시간을 훔친다.
'삶' 2줄, '없음' 0줄
```

| 코드                                                              | 설명                                                                                                        |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `struct Match<'a> { line_no: usize, line: &'a str }`              | 줄 번호는 값으로, 줄 내용은 원문을 빌려 담습니다.                                                           |
| `fn search<'a>(query: &str, text: &'a str) -> Vec<Match<'a>>`     | 결과는 `text`에만 묶이고 `query`와는 관계없습니다. 그래서 `query`가 먼저 사라져도 `found`를 쓸 수 있습니다. |
| `.filter(\|(_, line)\| line.contains(query))`                     | 검색어가 들어 있는 줄만 남깁니다.                                                                           |
| `.map(\|(i, line)\| Match { line_no: i + 1, line: line.trim() })` | `trim()`도 복사 없이 안쪽을 빌린 조각입니다(Day 39). 줄 번호는 1부터 셉니다.                                |
| `let query = String::from("시간");` (블록 안)                     | 검색어는 블록 끝에서 사라지지만, 결과가 `poem`에만 묶여서 블록 밖에서 `found`를 쓸 수 있습니다.             |
| `{:>2}`                                                           | 줄 번호를 두 칸 오른쪽 정렬했습니다.                                                                        |

`search`의 시그니처를 `fn search<'a>(query: &'a str, text: &'a str)`로 쓰면 결과가 `query`에도 묶여서, 블록 밖의 `found` 사용이 E0597이 됩니다. **결과가 실제로 빌리는 것에만** 수명을 붙이는 것이 좋은 설계입니다.

Python으로 같은 일을 하면 결과가 새 문자열이라 원문이 사라져도 괜찮습니다.

```python
# 파일: search.py
def search(query, text):
    return [(i, line.strip()) for i, line in enumerate(text.split("\n"), start=1) if query in line]


poem = "시간은 삶이다.\n  그리고 삶은 마음속에 산다.\n회색 신사들은 시간을 훔친다.\n모모는 듣는다."
query = "시간"
found = search(query, poem)
del query, poem                             # 원문이 사라져도 결과는 자기 문자열을 가진다
for line_no, line in found:
    print(f"{line_no:>2}: {line}")
```

실행 결과:

```text
 1: 시간은 삶이다.
 3: 회색 신사들은 시간을 훔친다.
```

`del query, poem` 뒤에도 `found`를 출력할 수 있습니다. 원문이 1GB짜리 로그 파일이라면 이 복사가 큰 비용이 되고, Rust의 빌려 오는 방식이 그 비용을 없앱니다. 반대로 결과를 오래 들고 다녀야 하는 프로그램이라면 Python처럼 복사해 소유하는 편이 단순합니다.

## 10. 수명 표기 정리

| 함수 모양                          | 표기 필요?     | 이유                                            |
| ---------------------------------- | -------------- | ----------------------------------------------- |
| `fn f(s: &str) -> usize`           | 아니요         | 결과가 참조가 아님                              |
| `fn f(s: &str) -> &str`            | 아니요(규칙 2) | 참조 입력이 하나                                |
| `fn f(&self, other: &str) -> &str` | 아니요(규칙 3) | 결과는 `self`에서                               |
| `fn f(x: &str, y: &str) -> &str`   | **예**         | 결과가 x인지 y인지 모름(E0106)                  |
| `fn f() -> &str`                   | 예(`'static`)  | 빌릴 입력이 없음. 보통은 `String`을 돌려줘야 함 |
| `struct S { x: &str }`             | **예**         | 필드의 참조는 항상 표기                         |

## 11. 세 언어 비교

| 관점                             | Rust                         | C                        | Python                                     |
| -------------------------------- | ---------------------------- | ------------------------ | ------------------------------------------ |
| 사라진 값을 가리키는 참조        | 컴파일 오류(E0597, E0515)    | 정의되지 않은 동작       | 일어날 수 없음(객체가 계속 삶)             |
| 결과가 어느 입력에서 왔는지      | 수명 표기로 시그니처에 적음  | 주석                     | 신경 쓸 필요 없음                          |
| 원문의 일부를 복사 없이 가리키기 | `&str`, 참조 필드(수명 검사) | 포인터 + 길이(검사 없음) | `memoryview`(바이트), 문자열은 대부분 복사 |
| 검사 비용                        | 컴파일할 때만                | 없음                     | 실행 중 참조 세기                          |

## 12. 자주 하는 실수

### 실수 1: 참조를 둘 받아 참조를 돌려주면서 수명을 적지 않는다

```rust
// 파일: no_lifetime.rs (컴파일 오류: E0106)
fn longest(x: &str, y: &str) -> &str {
    if x.len() >= y.len() { x } else { y }
}

fn main() {
    println!("{}", longest("abc", "de"));
}
```

`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str`로 쓰세요. 컴파일러의 도움말도 같은 모양을 제안합니다.

### 실수 2: 먼저 사라지는 값을 빌린 결과를 나중에 쓴다

```rust
// 파일: short_lived.rs (컴파일 오류: E0597)
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}

fn main() {
    let a = String::from("미하엘 엔데");
    let result;
    {
        let b = String::from("모모");
        result = longest(&a, &b);
    }
    println!("{result}");
}
```

실습의 디버그 문제입니다. 값을 더 오래 살게 하거나, 결과를 복사해 소유하세요.

### 실수 3: 참조를 담은 구조체가 원문보다 오래 산다

```rust
// 파일: excerpt_outlives.rs (컴파일 오류: E0597)
struct Excerpt<'a> {
    title: &'a str,
}

fn main() {
    let ex;
    {
        let book = String::from("모모\n회색 신사");
        ex = Excerpt { title: book.lines().next().unwrap() };
    }
    println!("{}", ex.title);
}
```

`book`을 바깥에서 만들거나, 구조체 필드를 `String`으로 바꿔 소유하세요.

### 실수 4: 오류를 없애려고 'static을 붙인다

`fn longest(x: &'static str, y: &'static str) -> &'static str`은 컴파일되지만, 이제 `String`을 빌려 넘길 수 없습니다. 오류 메시지가 가리키는 **진짜 관계**(결과가 어느 입력에서 오는가)를 적으세요.

### 실수 5: C에서 버퍼를 해제한 뒤 그 안을 가리키던 포인터를 쓴다

오늘 C 예제의 `free(book)` 뒤 `ex.title`처럼, 버퍼 안을 가리키는 포인터는 버퍼와 수명이 같습니다. 해제 순서를 주석으로 남기고, 해제한 뒤에는 포인터를 `NULL`로 지우세요.

## 13. Q&A

**Q. 수명 표기를 붙이면 프로그램이 느려지나요?**

A. 아니요. 수명은 컴파일할 때만 쓰이는 정보이고, 실행 파일에는 아무것도 남지 않습니다. 오히려 복사 대신 빌리기를 안전하게 쓸 수 있어서 빨라지는 경우가 많습니다.

**Q. 컴파일러가 실제로 무엇이 선택되는지 보고 판단하면 안 되나요?**

A. 컴파일러는 함수 **안**을 보지 않고 **시그니처**만 보고 호출하는 곳을 검사합니다. 그래야 함수 안을 고쳐도 부르는 쪽의 검사 결과가 바뀌지 않고, 큰 프로그램도 빠르게 검사할 수 있습니다. 그래서 `longest`가 실제로 `a`를 골라도, 시그니처가 "b일 수도 있다"고 말하면 그대로 검사합니다.

**Q. 구조체에 참조를 담는 것과 String을 담는 것 중 무엇이 좋나요?**

A. 처음에는 `String`(소유)으로 시작하세요. 다루기 쉽고 수명 표기가 필요 없습니다. 파서나 검색 도구처럼 큰 원문을 잠깐 쪼개 보는 경우에만 참조를 담는 구조체가 이득입니다.

**Q. Python에는 수명 문제가 전혀 없나요?**

A. 댕글링 참조는 없지만, 반대 문제가 있습니다. 필요 없어진 객체를 어딘가(전역 리스트, 캐시, 클로저)가 계속 가리키면 영영 정리되지 않습니다. `weakref` 모듈은 "가리키되 살려 두지는 않는" 약한 참조를 만들어 이 문제를 줄여 줍니다. Rust의 `Weak`(Day 81)와 같은 생각입니다.

## 14. 핵심 요약

- 참조는 가리키는 값보다 **오래 살 수 없습니다.** Rust는 이것을 컴파일할 때 검사합니다(E0597, E0515).
- 수명 매개변수 `'a`는 값의 수명을 바꾸지 않고, "결과가 어느 입력에서 빌려 왔는가"라는 **관계**를 적습니다.
- 참조 입력이 하나거나 `&self`가 있으면 표기를 생략할 수 있고, 참조 입력이 둘 이상이면서 참조를 돌려주면 적어야 합니다(E0106).
- 결과가 실제로 빌리는 입력에만 수명을 붙이세요(`pick_left`, `search`). 그래야 부르는 쪽이 자유롭습니다.
- 참조를 담는 구조체 `S<'a>`는 원문보다 오래 살 수 없습니다. 오래 보관하려면 `String`으로 소유합니다. `'static`은 리터럴과 상수의 수명이며, 오류를 없애는 도구가 아닙니다.
- C는 같은 약속을 주석으로만 지키고, Python은 객체를 살려 두는 방식으로 댕글링을 없앱니다.

## 15. 도전 문제

1. **(Rust)** `fn longest_line<'a>(text: &'a str) -> Option<&'a str>`로 가장 긴 줄을 빌려 돌려주세요. 빈 문자열이면 `None`입니다. 수명 표기를 지워도 컴파일되는지 확인하고 이유를 설명하세요.
2. **(Rust)** 줄 검색 예제의 `Match`에 `word_count` 필드를 추가하고, 결과를 `found.sort_by_key(|m| m.word_count)`로 정렬해 보세요. 정렬해도 원문을 복사하지 않는다는 것을 확인합니다.
3. **(C)** `struct excerpt`를 쓰는 함수 `void print_excerpt(const struct excerpt *e)`를 만들고, `book`을 해제하기 **전**과 **후**에 각각 부르는 코드를 써 보세요(후는 주석으로만). 왜 후자가 위험한지 주석으로 설명하세요.
4. **(Python)** `weakref.ref`로 객체를 약하게 가리킨 뒤 `del`로 마지막 강한 참조를 지우면, 약한 참조를 불렀을 때 `None`이 나오는지 확인하세요.
