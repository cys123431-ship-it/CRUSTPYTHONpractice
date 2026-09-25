---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-53-rust-enum
courseId: crp-92
phaseId: phase-05
dayNumber: 53
date: "2026-11-22"
title: Rust enum으로 상태 표현
summary: 서로 배타적인 상태를 문자열에 제각각 적으면 오타와 빠진 분기가 생깁니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-52-rust-method
learningObjectives:
  - "'Rust enum으로 상태 표현' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 가능한 enum 경우를 match에서 하나 빠뜨림."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust enum
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
  - id: ex-day-53-rust-enum-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? state=Pass에서 시작해 계산하세요.
    starter:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    answer: 통과
    hint: state=Pass에서 시작해 통과까지 순서대로 적어 보세요. enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다.
    explanation:
      1. Pass 상태를 선택합니다. 2. match가 Pass arm을 실행합니다. 3. 통과를 출력합니다. `state=Pass → Pass arm → 통과` 흐름으로 실제
      출력 `통과`가 됩니다. 핵심 `ResultLabel::Pass`는 합격 상태를 만드는 자리에 쓰입니다.
    commonMistakes:
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-53-rust-enum-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust enum으로 상태 표현의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: ResultLabel::Pass"
    starter:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = _____;\n    let label = match state {\
      \ ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    answer:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    hint: 필요한 표현은 한정된 상태를 타입으로 표현 동작을 잇는 ResultLabel::Pass입니다.
    explanation:
      빈칸에 들어갈 표현은 'ResultLabel::Pass'입니다. 이 표현이 없으면 실행 결과는 달라집니다. 1. Pass 상태를 선택합니다. 2. match가 Pass arm을
      실행합니다. 3. 통과를 출력합니다. `state=Pass → Pass arm → 통과` 흐름으로 실제 출력 `통과`가 됩니다. 핵심 `ResultLabel::Pass`는 합격 상태를 만드는 자리에
      쓰입니다.
    commonMistakes:
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-53-rust-enum-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 첫 문자열을 '통과'에서 '통과!'로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    answer:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과!\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    hint: 첫 문자열을 '통과'에서 '통과!'로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '통과'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '통과!'입니다. 원본은 `통과`, 수정본은 `통과!`이다. 첫 변경 줄의 Pass 갈래 문자열 `"통과"`에서 `"통과!"`로 표시를 바꾸면, 선택되는 갈래는
      그대로이고 화면 모양만 달라진다.
    commonMistakes:
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-53-rust-enum-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 가능한 enum 경우를 match에서 하나 빠뜨림 상황을 확인하세요.
    starter:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Retry;\n    let label =\
      \ match state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    answer:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    hint: 가능한 enum 경우를 match에서 하나 빠뜨림 상황에서 어긋나는 줄을 enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `let state = ResultLabel::Retry;`입니다. 재시도 상태가 선택되므로 match가 Retry 갈래를 실행해 `재시도`가 출력됩니다. 오류 분류는
      잘못된 출력입니다. 상태 선택이 어긋나는 첫 순간은 state 대입입니다. 고친 줄 `let state = ResultLabel::Pass;`에서는 `한정된 상태를 타입으로 표현` 동작이 지켜집니다.
      갈래를 빼먹은 match 자체는 컴파일이 막으므로, 이번 잘못된 코드와 구별하세요. 정상 코드는 상태 선택→갈래 실행→표시의 순서로 `통과`를 출력합니다.
    commonMistakes:
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-53-rust-enum-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 Rust enum으로 상태 표현 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust enum으로 상태 표현: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer:
      "enum ResultLabel { Pass, Retry }\nfn main() {\n    let state = ResultLabel::Pass;\n    let label = match\
      \ state { ResultLabel::Pass => \"통과\", ResultLabel::Retry => \"재시도\" };\n    println!(\"{label}\");\n}"
    hint: 새 갈래를 추가하면 기존 `match`에 빠진 처리를 컴파일러가 짚어 줍니다. 상태 추가 뒤 전체 갈래를 다시 시험하세요. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 새 갈래를 추가하면 기존 `match`에 빠진 처리를 컴파일러가 짚어 줍니다. 상태 추가 뒤 전체 갈래를 다시 시험하세요. 같은
      한정된 상태를 타입으로 표현 동작을 구현하고 실행 결과 '통과'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-53-rust-enum-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - 통과
    answerIndex: 2
    explanation:
      먼저 state에 Pass가 저장됩니다. 이어서 match가 Pass arm을 실행해 통과를 만들고, println!이 표시하므로 출력 `통과`가 됩니다. `실행 전에 반드시
      오류가 난다`는 틀린 선택지인데 갈래 구성이 완전해 실행이 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 println!이 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과
      맞지 않습니다.
  - id: quiz-day-53-rust-enum-model
    question: "'Rust enum으로 상태 표현' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다.
      - 가능한 enum 경우를 match에서 하나 빠뜨림(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation:
      enum은 정해진 경우만 값으로 만들게 한다는 뜻이고, match는 모든 경우를 처리하게 한다는 뜻은 빠진 갈래가 있으면 컴파일러가 짚어준다는 뜻입니다. `가능한 enum 경우를
      match에서 하나 빠뜨림`은 반대 사례인데, 그때는 실행이 아니라 컴파일이 막히기 때문입니다.
  - id: quiz-day-53-rust-enum-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 가능한 enum 경우를 match에서 하나 빠뜨림
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation:
      먼저 확인할 실수는 `가능한 enum 경우를 match에서 하나 빠뜨림`입니다. 잘못된 코드는 실행은 되지만 `재시도`라는 잘못된 출력을 냅니다. 선택된 상태가 무엇인지 먼저
      확인하세요.
  - id: quiz-day-53-rust-enum-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 한정된 상태를 타입으로 표현라는 동작과 경계 조건
    answerIndex: 2
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `한정된 상태를 타입으로 표현`이라는 의미와 입력·출력 계약입니다. C의 enum·switch와 Python의 상수·분기 검토로 같은
      동작을 구현하고, 실행 결과 `통과`로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

서로 배타적인 상태를 문자열에 제각각 적으면 오타와 빠진 분기가 생깁니다. Day 53 "`Rust enum으로 상태 표현`"에서는 Rust 코드의 실행 결과(`통과`)를 따라가며, `한정된 상태를 타입으로 표현` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`가능한 enum 경우를 match에서 하나 빠뜨림`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 52](/learn/day-52-rust-method)에서 배운 "Rust 구조체와 메서드" 내용을 한 문장으로 말해 보세요. 이번 "`Rust enum으로 상태 표현`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `ResultLabel::Pass`입니다.

## 머릿속 그림

enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다. Day 53에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `ResultLabel::Pass`입니다.

```text
state=Pass  →  Pass arm  →  통과
```

위 흐름에서 `ResultLabel::Pass` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `통과`입니다.

## 천천히 풀어보기

`enum ResultLabel { Pass, Fail }`처럼 상태를 두 가지로 정하면 뜻밖의 세 번째 문자열이 들어오는 것을 줄일 수 있습니다. `ResultLabel::Pass`는 해당 enum의 합격 상태를 만든 값입니다. `match`는 가능한 갈래별로 동작을 적게 해 줍니다.

문자열 `"pass"`, `"PASS"`, `"passed"`를 조건문으로 비교하는 방식보다 상태 공간이 명확합니다. 새 갈래를 추가하면 기존 `match`에 빠진 처리를 컴파일러가 짚어 줍니다. `Option<T>`와 `Result<T,E>`도 enum을 활용하는 익숙한 예입니다.

`enum ResultLabel { Pass, Fail }`처럼 상태를 두 가지로 정하면 뜻밖의 세 번째 문자열이 들어오는 것을 줄일 수 있습니다. `ResultLabel::Pass`는 해당 enum의 합격 상태를 만든 값입니다. `match`는 가능한 갈래별로 동작을 적게 해 줍니다.

문자열 `"pass"`, `"PASS"`, `"passed"`를 조건문으로 비교하는 방식보다 상태 공간이 명확합니다. 새 갈래를 추가하면 기존 `match`에 빠진 처리를 컴파일러가 짚어 줍니다. `Option<T>`와 `Result<T,E>`도 enum을 활용하는 익숙한 예입니다.

## 문법을 예제로 보기

아래 Rust 코드는 Day 53 "`Rust enum으로 상태 표현`"의 독립 예제입니다. 전체 6줄 가운데 핵심 부분은 `ResultLabel::Pass`이며, 실행 결과는 `통과`입니다.

```rust
enum ResultLabel { Pass, Retry }
fn main() {
    let state = ResultLabel::Pass;
    let label = match state { ResultLabel::Pass => "통과", ResultLabel::Retry => "재시도" };
    println!("{label}");
}
```

예상 출력:

```text
통과
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `통과`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `ResultLabel::Pass`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```rust
 1 | enum ResultLabel { Pass, Retry }
 2 | fn main() {
 3 |     let state = ResultLabel::Pass;
 4 |     let label = match state { ResultLabel::Pass => "통과", ResultLabel::Retry => "재시도" };
 5 |     println!("{label}");
 6 | }
```

1. Pass 상태를 선택합니다
2. match가 Pass arm을 실행합니다
3. 통과를 출력합니다

`ResultLabel::Pass` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | state=Pass     |
|    2 | Pass arm       |
|    3 | 통과           |

위 순서대로 실행한 최종 출력은 `통과`입니다. `state=Pass` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`enum Status { Waiting, Done }`에서 Done 기록을 `match`로 확인하면 완료 동작을 택합니다. Waiting을 아직 완료로 처리하면 상태 이름과 행동이 어긋납니다. 문자열로 상태를 임의 입력받으면 철자를 틀릴 수 있지만 enum은 가능한 상태를 코드에서 한정합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `통과`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```rust
enum ResultLabel { Pass, Retry }
fn main() {
    let state = ResultLabel::Pass;
    let label = match state { ResultLabel::Pass => "통과!", ResultLabel::Retry => "재시도" };
    println!("{label}");
}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
통과!
```

원본은 `통과`, 수정본은 `통과!`이다. 첫 변경 줄의 Pass 갈래 문자열 `"통과"`에서 `"통과!"`로 표시를 바꾸면, 선택되는 갈래는 그대로이고 화면 모양만 달라진다.

## 자주 틀리는 지점

**확인할 실수: 가능한 enum 경우를 match에서 하나 빠뜨림.** 정상 코드의 실행 결과는 `통과`입니다.

- 정상 줄: `let state = ResultLabel::Pass;`
- 잘못된 줄: `let state = ResultLabel::Retry;`

두 줄을 나란히 놓으면 정상 줄 `let state = ResultLabel::Pass;`이 `enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다.` 설명과 맞고, 잘못된 줄은 `가능한 enum 경우를 match에서 하나 빠뜨림` 쪽으로 어긋납니다. 결과가 예상과 다르면 `state=Pass`부터 `통과`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `한정된 상태를 타입으로 표현`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙     |
| ------ | ------------------------------ |
| C17    | enum과 switch의 모든 경우 확인 |
| Python | Enum 또는 명시적 분기          |
| Rust   | enum과 exhaustive match        |

C17에서는 `enum과 switch의 모든 경우 확인` 규칙을 적용합니다. "`Rust enum으로 상태 표현`" 수업의 실행 결과(`통과`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `Enum 또는 명시적 분기` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `enum과 exhaustive match` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`통과` 맞히기) → 빈칸(`ResultLabel::Pass` 채우기) → 변경(`첫 문자열을 '통과'에서 '통과!'로`) → 오류 수정(`가능한 enum 경우를 match에서 하나 빠뜨림` 찾기) → 독립 구현(`'Rust enum으로 상태 표현' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `통과` 및 `ResultLabel::Pass` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust enum으로 상태 표현`" 수업이 필요한 이유는 `한정된 상태를 타입으로 표현` 동작으로 설명해 보세요.
- 예제에서 `ResultLabel::Pass` 부분 실행 직전의 상태와 직후의 출력(`통과`)을 말해 보세요.
- "`가능한 enum 경우를 match에서 하나 빠뜨림`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `한정된 상태를 타입으로 표현` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

enum은 정해진 경우만 값으로 만들게 하고 match는 모든 경우를 처리하게 합니다. Day 53 "`Rust enum으로 상태 표현`" 예제의 핵심 부분은 `ResultLabel::Pass`이며, 실행 결과는 `통과`입니다. "`가능한 enum 경우를 match에서 하나 빠뜨림`" 여부를 확인하고 Day 53 수업을 완료하세요.
