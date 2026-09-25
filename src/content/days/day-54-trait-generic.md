---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-54-trait-generic
courseId: crp-92
phaseId: phase-05
dayNumber: 54
date: "2026-11-23"
title: Rust trait과 제네릭
summary: 여러 자료형에 같은 출력 기능을 적용할 때 지원할 동작을 계약으로 명시합니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-53-rust-enum
learningObjectives:
  - "'Rust trait과 제네릭' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - trait generic
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
  - id: ex-day-54-trait-generic-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? T=i32 추론에서 시작해 계산하세요.
    starter: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    answer: "30"
    hint: T=i32 추론에서 시작해 30 출력까지 순서대로 적어 보세요. T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다.
    explanation:
      1. show(30)에서 T가 정수로 정해집니다. 2. Display 구현이 있는지 검사합니다. 3. println!이 30을 표시합니다. `T=i32 추론 → Display
      확인 → 30 출력` 흐름으로 실제 출력 `30`이 됩니다. 핵심 `Display`는 표시 능력을 요구하는 자리에 쓰입니다.
    commonMistakes:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-54-trait-generic-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust trait과 제네릭의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: Display"
    starter: 'fn show<T: std::fmt::_____>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    answer: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    hint: 필요한 표현은 필요한 동작만 제네릭 타입에 요구함 동작을 잇는 Display입니다.
    explanation:
      빈칸에 들어갈 표현은 'Display'입니다. 이 표현이 없으면 컴파일 단계에서 막혀 실행 자체가 되지 않습니다. 1. show(30)에서 T가 정수로 정해집니다. 2. Display
      구현이 있는지 검사합니다. 3. println!이 30을 표시합니다. `T=i32 추론 → Display 확인 → 30 출력` 흐름으로 실제 출력 `30`이 됩니다. 핵심 `Display`는 표시
      능력을 요구하는 자리에 쓰입니다.
    commonMistakes:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-54-trait-generic-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    answer: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(31); }'
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '30'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '31'입니다. 원본은 `30`, 수정본은 `31`이다. 첫 변경 줄 `fn main() { show(30); }`에서 `fn main() { show(31);
      }`로 인수를 바꾸면, 같은 Display 검사를 거쳐 새 값이 표시된다.
    commonMistakes:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-54-trait-generic-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함 상황을 확인하세요.
    starter: 'fn show<T: std::fmt::Debug>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    answer: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    hint:
      지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함 상황에서 어긋나는 줄을 T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다. 설명과
      대조해 보세요.
    explanation:
      '틀린 줄은 `fn show<T: std::fmt::Debug>(value: T) { println!("{value}"); }`입니다. 자리 표시자 `{value}`는 Display
      능력을 요구하는데 선언된 제약은 Debug뿐이므로 컴파일 단계에서 오류가 나고 실행 파일 자체가 만들어지지 않아 아무것도 출력되지 않습니다. 오류 분류는 컴파일 오류입니다. 흐름이 깨지는 첫 순간은
      제약 선언입니다. 고친 줄의 `Display`에서는 `필요한 동작만 제네릭 타입에 요구함` 동작이 지켜집니다. 정상 코드는 타입 확정→능력 확인→표시의 순서로 `30`을 출력합니다.'
    commonMistakes:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-54-trait-generic-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 Rust trait과 제네릭 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust trait과 제네릭: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: 'fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }

      fn main() { show(30); }'
    hint: 타입 이름을 감춘다는 뜻이 아니라 필요한 능력을 선언하는 것이라고 생각하세요. `Display` 없는 타입을 넘기면 컴파일이 막힙니다. 예상 출력과 경계 조건도 함께 적어 보세요.
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. 타입 이름을 감춘다는 뜻이 아니라 필요한 능력을 선언하는 것이라고 생각하세요. `Display` 없는 타입을 넘기면 컴파일이
      막힙니다. 같은 필요한 동작만 제네릭 타입에 요구함 동작을 구현하고 실행 결과 '30'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-54-trait-generic-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "30"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation:
      먼저 show(30)에서 T가 정수로 정해집니다. 이어서 Display 구현이 확인되어 println!이 30을 표시하므로 출력 `30`이 됩니다. `실행 전에 반드시 오류가
      난다`는 틀린 선택지인데 제약과 호출이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 println!이 실제로 호출되기 때문입니다. 다른 선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-54-trait-generic-model
    question: "'Rust trait과 제네릭' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함(이것이 정상적인 사용법이다)
      - T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      T는 타입 매개변수라는 뜻이고, Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장한다는 뜻은 표시 능력이 컴파일 때 검사된다는 뜻입니다. `지원하지 않는
      타입을 제약 없이 출력할 수 있다고 생각함`은 반대 사례인데, 능력이 없으면 컴파일이 막히기 때문입니다.
  - id: quiz-day-54-trait-generic-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함
    answerIndex: 2
    explanation:
      먼저 확인할 실수는 `지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함`입니다. 잘못된 코드는 제약이 어긋나 컴파일 오류가 나므로 화면 출력 비교 이전에 실행 파일 생성
      자체가 막힙니다.
  - id: quiz-day-54-trait-generic-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 필요한 동작만 제네릭 타입에 요구함라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `필요한 동작만 제네릭 타입에 요구함`이라는 의미와 입력·출력 계약입니다. C의 매크로 동작과 Python의 덕 타이핑으로 같은 동작을
      구현하고, 실행 결과 `30`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
---

## 오늘 배울 이유

여러 자료형에 같은 출력 기능을 적용할 때 지원할 동작을 계약으로 명시합니다. Day 54 "`Rust trait과 제네릭`"에서는 Rust 코드의 실행 결과(`30`)를 따라가며, `필요한 동작만 제네릭 타입에 요구함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 53](/learn/day-53-rust-enum)에서 배운 "Rust enum으로 상태 표현" 내용을 한 문장으로 말해 보세요. 이번 "`Rust trait과 제네릭`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `Display`입니다.

## 머릿속 그림

T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다. Day 54에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `Display`입니다.

```text
T=i32 추론  →  Display 확인  →  30 출력
```

위 흐름에서 `Display` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

제네릭 `T`는 아직 구체적으로 정하지 않은 값의 타입을 뜻합니다. 하지만 어떤 `T`든 화면에 표시할 수 있는 것은 아닙니다. `T: Display`라고 제약하면 그 타입이 사용자에게 보여 줄 글자로 형식화할 수 있어야 한다는 뜻입니다.

정수와 문자열을 모두 받는 출력 함수는 공통 동작을 한 번만 작성할 수 있습니다. 반대로 `Display` 구현이 없는 타입을 넘기면 컴파일 오류가 납니다. 타입 이름을 감춘다는 뜻이 아니라 **필요한 능력을 선언**하는 것이라고 생각하세요.

제네릭 `T`는 아직 구체적으로 정하지 않은 값의 타입을 뜻합니다. 하지만 어떤 `T`든 화면에 표시할 수 있는 것은 아닙니다. `T: Display`라고 제약하면 그 타입이 사용자에게 보여 줄 글자로 형식화할 수 있어야 한다는 뜻입니다.

정수와 문자열을 모두 받는 출력 함수는 공통 동작을 한 번만 작성할 수 있습니다. 반대로 `Display` 구현이 없는 타입을 넘기면 컴파일 오류가 납니다. 타입 이름을 감춘다는 뜻이 아니라 필요한 능력을 선언하는 것이라고 생각하세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 54 "`Rust trait과 제네릭`"의 독립 예제입니다. 전체 2줄 가운데 핵심 부분은 `Display`이며, 실행 결과는 `30`입니다.

```rust
fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }
fn main() { show(30); }
```

예상 출력:

```text
30
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `30`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `Display`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```rust
 1 | fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }
 2 | fn main() { show(30); }
```

1. show(30)에서 T가 정수로 정해집니다
2. Display 구현이 있는지 검사합니다
3. println!이 30을 표시합니다

`Display` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | T=i32 추론     |
|    2 | Display 확인   |
|    3 | 30 출력        |

위 순서대로 실행한 최종 출력은 `30`입니다. `T=i32 추론` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`fn show<T: std::fmt::Display>(value: T)`는 정수 3도, 출력 가능한 문자열도 받을 수 있습니다. 다만 어떤 `T`든 가능하다는 뜻은 아니며 `Display` 구현이 있어야 합니다. `T`는 **타입을 바꿔 쓸 자리**, `Display`는 **그 자리에 들어올 자격**이라고 나누어 생각하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```rust
fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }
fn main() { show(31); }
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
31
```

원본은 `30`, 수정본은 `31`이다. 첫 변경 줄 `fn main() { show(30); }`에서 `fn main() { show(31); }`로 인수를 바꾸면, 같은 Display 검사를 거쳐 새 값이 표시된다.

## 자주 틀리는 지점

**확인할 실수: 지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }`
- 잘못된 줄: `fn show<T: std::fmt::Debug>(value: T) { println!("{value}"); }`

두 줄을 나란히 놓으면 정상 줄 `fn show<T: std::fmt::Display>(value: T) { println!("{value}"); }`이 `T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다.` 설명과 맞고, 잘못된 줄은 `지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함` 쪽으로 어긋납니다. 결과가 예상과 다르면 `T=i32 추론`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `필요한 동작만 제네릭 타입에 요구함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙       |
| ------ | -------------------------------- |
| C17    | _Generic 또는 명시적 타입별 함수 |
| Python | 덕 타이핑과 런타임 **str**       |
| Rust   | T: Display trait bound           |

C17에서는 `_Generic 또는 명시적 타입별 함수` 규칙을 적용합니다. "`Rust trait과 제네릭`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `덕 타이핑과 런타임 __str__` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `T: Display trait bound` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`Display` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함` 찾기) → 독립 구현(`'Rust trait과 제네릭' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `Display` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust trait과 제네릭`" 수업이 필요한 이유는 `필요한 동작만 제네릭 타입에 요구함` 동작으로 설명해 보세요.
- 예제에서 `Display` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `필요한 동작만 제네릭 타입에 요구함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

T는 타입 매개변수이고 Display 제약은 그 값이 사용자용 문자열로 출력될 수 있음을 보장합니다. Day 54 "`Rust trait과 제네릭`" 예제의 핵심 부분은 `Display`이며, 실행 결과는 `30`입니다. "`지원하지 않는 타입을 제약 없이 출력할 수 있다고 생각함`" 여부를 확인하고 Day 54 수업을 완료하세요.
