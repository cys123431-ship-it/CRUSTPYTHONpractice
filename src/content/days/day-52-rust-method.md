---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-52-rust-method
courseId: crp-92
phaseId: phase-05
dayNumber: 52
date: "2026-11-21"
title: Rust 구조체와 메서드
summary: 데이터와 관련 계산을 한 곳에 두면 사용자가 필드의 의미를 추적하기 쉽습니다. Rust 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: rust
transferLanguages:
  - c
  - python
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-51-python-class
learningObjectives:
  - "'Rust 구조체와 메서드' 개념이 필요한 상황을 예로 든다."
  - Rust 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - rust method
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
  - id: ex-day-52-rust-method-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? s.minutes=30에서 시작해 계산하세요.
    starter: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    answer: "60"
    hint: impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.
    explanation: s.minutes=30  →  &s 빌림  →  60 반환. 따라서 출력은 '60'입니다.
    commonMistakes:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: none
  - id: ex-day-52-rust-method-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Rust 구조체와 메서드의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: &self"
    starter: 'struct Session { minutes: u32 }

      impl Session { fn doubled(_____) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    answer: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    hint: minutes=30인 Session을 만듭니다
    explanation: 빈칸에는 '&self'이 들어갑니다. minutes=30인 Session을 만듭니다 doubled가 s를 빌려 30*2를 계산합니다 60을 출력합니다
    commonMistakes:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-52-rust-method-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 2에서 3로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    answer: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 3 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    hint: 처음 등장하는 숫자를 2에서 3로 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.
    explanation:
      예시 답안에서는 처음 등장하는 숫자를 2에서 3로 바꿨습니다. 원래 출력은 '60'입니다. 바꾼 줄에서 시작해 중간 값과 마지막 출력을 다시 추적하세요. 출력이 같더라도 입력·조건·중간
      상태가 달라졌는지 확인해야 합니다.
    commonMistakes:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-52-rust-method-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함 상황을 확인하세요.
    starter: 'struct Session { minutes: u32 }

      impl Session { fn doubled(self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    answer: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    hint: impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. minutes=30인 Session을 만듭니다 doubled가 s를 빌려 30*2를 계산합니다 60을 출력합니다
    commonMistakes:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
  - id: ex-day-52-rust-method-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 'Rust 구조체와 메서드' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "// Rust 구조체와 메서드: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)"
    answer: 'struct Session { minutes: u32 }

      impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }

      fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }'
    hint: impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 minutes=30인 Session을 만듭니다 doubled가 s를 빌려 30*2를 계산합니다 60을 출력합니다 다른 코드도 결과와
      근거가 맞으면 가능합니다.
    commonMistakes:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: rust
    verification: run
quiz:
  - id: quiz-day-52-rust-method-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - "60"
      - 아무것도 출력하지 않는다
    answerIndex: 1
    explanation: s.minutes=30  →  &s 빌림  →  60 반환 순서로 실행되어 '60'을 출력합니다.
  - id: quiz-day-52-rust-method-model
    question: Rust 구조체와 메서드을 이해하는 데 맞는 설명은?
    choices:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
      - impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.
    answerIndex: 2
    explanation: impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.
  - id: quiz-day-52-rust-method-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 0
    explanation: 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-52-rust-method-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 데이터에 연결된 읽기 메서드라는 동작과 경계 조건
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 1
    explanation: 문법은 달라도 데이터에 연결된 읽기 메서드라는 목적과 입력·출력은 유지합니다.
---

## 오늘 배울 이유

데이터와 관련 계산을 한 곳에 두면 사용자가 필드의 의미를 추적하기 쉽습니다. Day 52 "`Rust 구조체와 메서드`"에서는 Rust 코드의 실행 결과(`60`)를 따라가며, `데이터에 연결된 읽기 메서드` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 51](/learn/day-51-python-class)에서 배운 "Python 클래스와 인스턴스" 내용을 한 문장으로 말해 보세요. 이번 "`Rust 구조체와 메서드`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `&self`입니다.

## 머릿속 그림

impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다. Day 52에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `&self`입니다.

```text
s.minutes=30  →  &s 빌림  →  60 반환
```

위 흐름에서 `&self` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `60`입니다.

## 천천히 풀어보기

`struct Session { minutes: u32 }`는 값의 필드를 정의하고, `impl Session`은 그 값에 관한 메서드를 모읍니다. 메서드의 `&self`는 지금 호출한 객체를 **읽기만 빌린다**는 뜻입니다. `session.minutes`를 계산에 쓴 후에도 호출자에게 소유권이 남습니다.

상태를 바꾸는 메서드가 필요하면 소유자가 `mut`여야 하고 수신자를 `&mut self`로 선언합니다. `self`, `&self`, `&mut self`가 각각 소유권 이동, 공유 읽기, 배타적 수정과 어떻게 연결되는지 예제 호출 전후로 표시해 보세요.

## 문법을 예제로 보기

아래 Rust 코드는 Day 52 "`Rust 구조체와 메서드`"의 독립 예제입니다. 전체 3줄 가운데 핵심 부분은 `&self`이며, 실행 결과는 `60`입니다.

```rust
struct Session { minutes: u32 }
impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }
fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }
```

예상 출력:

```text
60
```

Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `60`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `&self`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```rust
 1 | struct Session { minutes: u32 }
 2 | impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }
 3 | fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }
```

1. minutes=30인 Session을 만듭니다
2. doubled가 s를 빌려 30*2를 계산합니다
3. 60을 출력합니다

`&self` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | s.minutes=30   |
|    2 | &s 빌림        |
|    3 | 60 반환        |

위 순서대로 실행한 최종 출력은 `60`입니다. `s.minutes=30` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`impl Session { fn minutes(&self) -> u32 { self.minutes } }`라면 `session.minutes()`는 구조체의 필드를 읽어 반환합니다. 수신자가 `&self`여서 호출 뒤에도 session을 사용할 수 있습니다. 필드를 바꾸는 메서드라면 `&mut self`가 필요하고 호출자 역시 변경 가능한 값이어야 합니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `60`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```rust
struct Session { minutes: u32 }
impl Session { fn doubled(&self) -> u32 { self.minutes * 3 } }
fn main() { let s=Session{minutes:30}; println!("{}",s.doubled()); }
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
90
```

원본(`60`)과 달라졌습니다. 다른 줄(`impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }` → `impl Session { fn doubled(&self) -> u32 { self.minutes * 3 } }`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`s.minutes=30` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함.** 정상 코드의 실행 결과는 `60`입니다.

- 정상 줄: `impl Session { fn doubled(&self) -> u32 { self.minutes * 2 } }`
- 잘못된 줄: `impl Session { fn doubled(self) -> u32 { self.minutes * 2 } }`

두 줄을 나란히 놓고 `impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `s.minutes=30`부터 `60`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `데이터에 연결된 읽기 메서드`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙        |
| ------ | --------------------------------- |
| C17    | struct를 받는 함수와 const 포인터 |
| Python | self를 받는 인스턴스 메서드       |
| Rust   | impl Session와 &self              |

C17에서는 `struct를 받는 함수와 const 포인터` 규칙을 적용합니다. "`Rust 구조체와 메서드`" 수업의 실행 결과(`60`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `self를 받는 인스턴스 메서드` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `impl Session와 &self` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`60` 맞히기) → 빈칸(`&self` 채우기) → 변경(`처음 등장하는 숫자를 2에서 3로`) → 오류 수정(`읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함` 찾기) → 독립 구현(`Rust 구조체와 메서드을 보여 주는` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `60` 및 `&self` 설명과 대조하세요.

## 스스로 설명하기

- "`Rust 구조체와 메서드`" 수업이 필요한 이유는 `데이터에 연결된 읽기 메서드` 동작으로 설명해 보세요.
- 예제에서 `&self` 부분 실행 직전의 상태와 직후의 출력(`60`)을 말해 보세요.
- "`읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `데이터에 연결된 읽기 메서드` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

impl의 &self는 소유권을 가져가지 않고 구조체 값을 읽는 메서드 수신자입니다. Day 52 "`Rust 구조체와 메서드`" 예제의 핵심 부분은 `&self`이며, 실행 결과는 `60`입니다. "`읽기 전용 메서드에 self를 써 소유권을 불필요하게 이동함`" 여부를 확인하고 Day 52 수업을 완료하세요.
