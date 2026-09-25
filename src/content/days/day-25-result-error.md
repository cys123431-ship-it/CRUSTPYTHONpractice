---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-25-result-error
courseId: crp-92
phaseId: phase-02
dayNumber: 25
date: "2026-10-25"
title: Rust Result와 실패 전달
summary: 외부에서 받은 글자는 잘못된 숫자일 수 있어 정상 값과 실패 이유를 분리해야 합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: beginner
estimatedMinutes: 90
prerequisites:
  - day-24-recursion
learningObjectives:
  - "'Rust Result와 실패 전달' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: unwrap으로 잘못된 입력에서 프로그램을 종료시킴."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - result error
  - execution trace
  - language transfer
runnerMode: none
reviewOffsets:
  - 1
  - 3
  - 7
  - 14
  - 30
sample: false
exercises:
  - id: ex-day-25-result-error-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 문자열 30에서 시작해 계산하세요.
    starter:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    answer: "30"
    hint: 문자열 30에서 시작해 30 출력까지 순서대로 적어 보세요. Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다.
    explanation:
      1. 문자열 30을 u32로 파싱합니다. 2. Ok(30)이 생성됩니다. 3. match의 Ok arm에서 30을 출력합니다. `문자열 30 → Ok(30) → 30 출력`
      흐름으로 실제 출력 `30`이 됩니다. 핵심 `"30"`은 파싱할 입력 값을 정하는 자리에 쓰입니다.
    commonMistakes:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-25-result-error-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust Result와 실패 전달의 핵심 표현을 스스로 적는다.
    prompt: '빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: "30"'
    starter:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(_____) { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    answer:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    hint: 필요한 표현은 파싱 성공과 실패를 분리함 동작을 잇는 "30"입니다.
    explanation:
      빈칸에 들어갈 표현은 '"30"'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. 문자열 30을 u32로 파싱합니다. 2. Ok(30)이 생성됩니다. 3. match의
      Ok arm에서 30을 출력합니다. `문자열 30 → Ok(30) → 30 출력` 흐름으로 실제 출력 `30`이 됩니다. 핵심 `"30"`은 파싱할 입력 값을 정하는 자리에 쓰입니다.
    commonMistakes:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-25-result-error-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 '30'에서 '30!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    answer:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30!\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    hint: 첫 문자열을 '30'에서 '30!'로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '30'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '오류'입니다. 원본은 `30`, 수정본은 `오류`이다. 첫 변경 줄의 `"30"`에서 `"30!"`로 입력 값을 바꾸면, 느낌표 때문에 파싱이 실패해 Err
      갈래로 가므로 `오류`가 출력된다.
    commonMistakes:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-25-result-error-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 unwrap으로 잘못된 입력에서 프로그램을 종료시킴 상황을 확인하세요.
    starter:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"x\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    answer:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    hint:
      unwrap으로 잘못된 입력에서 프로그램을 종료시킴 상황에서 어긋나는 줄을 Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다. 설명과 대조해
      보세요.
    explanation:
      틀린 줄은 `match parse_minutes("x") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }`입니다. `"x"`는
      숫자가 아니므로 파싱이 실패해 Err 갈래로 가고 `오류`가 출력됩니다. 오류 분류는 잘못된 출력입니다. 갈래가 달라지는 첫 순간은 파싱 결과입니다. 고친 줄의 `"30"`에서는 `파싱 성공과
      실패를 분리함` 동작이 지켜집니다. 정상 코드는 파싱→Ok 판정→값 출력의 순서로 `30`을 출력합니다.
    commonMistakes:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-25-result-error-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 Rust Result와 실패 전달 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust Result와 실패 전달: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {\n    text.parse::<u32>()\n}\n\
      fn main() {\n    match parse_minutes(\"30\") { Ok(n) => println!(\"{n}\"), Err(_) => println!(\"오류\") }\n}"
    hint: 빈 문자열이나 숫자가 아닌 입력은 Err가 됩니다. 성공 쪽에서만 숫자 덧셈을 하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 빈 문자열이나 숫자가 아닌 입력은 Err가 됩니다. 성공 쪽에서만 숫자 덧셈을 하세요. 같은 파싱 성공과 실패를 분리함 동작을
      구현하고 실행 결과 '30'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-25-result-error-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "30"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation:
      먼저 문자열 30을 u32로 파싱합니다. 이어서 Ok(30)이 생성되고, match가 Ok arm을 선택해 30을 출력하므로 `30`이 됩니다. `실행 전에 반드시 오류가 난다`는
      틀린 선택지인데 파싱과 분기가 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 println!이 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-25-result-error-model
    question: "'Rust Result와 실패 전달' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다.
    answerIndex: 2
    explanation:
      Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나라는 뜻이고, match가 양쪽을 처리한다는 뜻은 어느 경우에도 정해진 동작이 있다는 뜻입니다. `unwrap으로
      잘못된 입력에서 프로그램을 종료시킴`은 반대 사례인데, unwrap은 실패를 처리 대신 중단으로 바꾸기 때문입니다.
  - id: quiz-day-25-result-error-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - unwrap으로 잘못된 입력에서 프로그램을 종료시킴
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation:
      먼저 확인할 실수는 `unwrap으로 잘못된 입력에서 프로그램을 종료시킴`입니다. 잘못된 코드는 실행은 되지만 `오류`라는 다른 갈래의 출력이 나옵니다. 입력이 파싱 가능한지
      먼저 확인하세요.
  - id: quiz-day-25-result-error-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 파싱 성공과 실패를 분리함라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `파싱 성공과 실패를 분리함`이라는 의미와 입력·출력 계약입니다. C의 오류 코드 반환과 Python의 예외 처리로 같은 동작을 구현하고,
      실행 결과 `30`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

외부에서 받은 글자는 잘못된 숫자일 수 있어 정상 값과 실패 이유를 분리해야 합니다. Day 25 "`Rust Result와 실패 전달`"에서는 Rust 코드의 실행 결과(`30`)를 따라가며, `파싱 성공과 실패를 분리함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`unwrap으로 잘못된 입력에서 프로그램을 종료시킴`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 24](/learn/day-24-recursion)에서 배운 "재귀와 종료 조건" 내용을 한 문장으로 말해 보세요. 이번 "`Rust Result와 실패 전달`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `"30"`입니다.

## 머릿속 그림

Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다. Day 25에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `"30"`입니다.

```text
문자열 30  →  Ok(30)  →  30 출력
```

위 흐름에서 `"30"` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

`Result`는 '성공하면 값, 실패하면 오류'를 한 가지 타입에 담는 약속입니다. 문자열 `"30"`을 숫자로 바꾸면 `Ok(30)`이 될 수 있고 `"삼십"`이면 `Err(...)`가 됩니다. `match`는 두 경우를 나눠 처리하므로 오류를 무심코 정상 값처럼 쓸 수 없습니다.

실패를 만났을 때 무조건 `unwrap()`으로 중단시키기보다, 학습 앱이라면 사용자에게 입력을 고치라고 알려 줄 수 있습니다. 성공 쪽에서만 숫자 덧셈을 하세요. 숫자로 바꾸는 작업과 결과를 쓰는 작업을 나눠 읽으면 `Result`의 흐름이 선명해집니다.

`Result`는 성공하면 값, 실패하면 오류를 한 가지 타입에 담는 약속입니다. 문자열 `"30"`을 숫자로 바꾸면 `Ok(30)`이 될 수 있고 `"삼십"`이면 `Err(...)`가 됩니다. `match`는 두 경우를 나눠 처리하므로 오류를 무심코 정상 값처럼 쓸 수 없습니다.

실패를 만났을 때 무조건 `unwrap()`으로 중단시키기보다, 학습 앱이라면 사용자에게 입력을 고치라고 알려 줄 수 있습니다. 성공 쪽에서만 숫자 덧셈을 하세요. 숫자로 바꾸는 작업과 결과를 쓰는 작업을 나눠 읽으면 `Result`의 흐름이 선명해집니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 25 "`Rust Result와 실패 전달`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `"30"`이며, 실행 결과는 `30`입니다.

```rust
fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.parse::<u32>()
}
fn main() {
    match parse_minutes("30") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }
}
```

예상 출력:

```text
30
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `"30"`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```rust
 1 | fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {
 2 |     text.parse::<u32>()
 3 | }
 4 | fn main() {
 5 |     match parse_minutes("30") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }
 6 | }
```

1. 문자열 30을 u32로 파싱합니다
2. Ok(30)이 생성됩니다
3. match의 Ok arm에서 30을 출력합니다

`"30"` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 문자열 30      |
|    2 | Ok(30)         |
|    3 | 30 출력        |

위 순서대로 실행한 최종 출력은 `30`입니다. `문자열 30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`"oops".parse::<u32>()`는 숫자 0이 되지 않고 오류 `Err(...)`가 됩니다. `match`의 성공 갈래에서만 더하기를 수행하고 실패 갈래에서는 수정할 입력을 알려 주세요. 잘못된 값을 0으로 **몰래 바꾸면** 진짜 0분 기록과 오류 기록을 구별할 수 없습니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```rust
fn parse_minutes(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.parse::<u32>()
}
fn main() {
    match parse_minutes("30!") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
오류
```

원본은 `30`, 수정본은 `오류`이다. 첫 변경 줄의 `"30"`에서 `"30!"`로 입력 값을 바꾸면, 느낌표 때문에 파싱이 실패해 Err 갈래로 가므로 `오류`가 출력된다.

## 자주 틀리는 지점

**확인할 실수: unwrap으로 잘못된 입력에서 프로그램을 종료시킴.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `match parse_minutes("30") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }`
- 잘못된 줄: `match parse_minutes("x") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }`

두 줄을 나란히 놓으면 정상 줄 `match parse_minutes("30") { Ok(n) => println!("{n}"), Err(_) => println!("오류") }`이 `Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다.` 설명과 맞고, 잘못된 줄은 `unwrap으로 잘못된 입력에서 프로그램을 종료시킴` 쪽으로 어긋납니다. 결과가 예상과 다르면 `문자열 30`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `파싱 성공과 실패를 분리함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙    |
| ------ | ----------------------------- |
| C17    | strtoul와 endptr/errno 검증   |
| Python | int(text)와 ValueError 처리   |
| Rust   | parse::<u32>()의 Result match |

C17에서는 `strtoul와 endptr/errno 검증` 규칙을 적용합니다. "`Rust Result와 실패 전달`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `int(text)와 ValueError 처리` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `parse::<u32>()의 Result match` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`"30"` 채우기) → 변경(`첫 문자열을 '30'에서 '30!'로`) → 오류 수정(`unwrap으로 잘못된 입력에서 프로그램을 종료시킴` 찾기) → 독립 구현(`'Rust Result와 실패 전달' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `"30"` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust Result와 실패 전달`" 수업이 필요한 이유는 `파싱 성공과 실패를 분리함` 동작으로 설명해 보세요.
- 예제에서 `"30"` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`unwrap으로 잘못된 입력에서 프로그램을 종료시킴`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `파싱 성공과 실패를 분리함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

Result는 성공 Ok(값) 또는 실패 Err(오류) 중 하나이며 match가 양쪽을 처리합니다. Day 25 "`Rust Result와 실패 전달`" 예제의 핵심 부분은 `"30"`이며, 실행 결과는 `30`입니다. "`unwrap으로 잘못된 입력에서 프로그램을 종료시킴`" 여부를 확인하고 Day 25 수업을 완료하세요.
