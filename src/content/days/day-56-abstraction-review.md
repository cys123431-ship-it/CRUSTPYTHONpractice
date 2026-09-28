---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-56-abstraction-review
courseId: crp-92
phaseId: phase-05
dayNumber: 56
date: "2026-11-25"
title: 구조체·enum·테스트 회상 — 작은 도서관 시스템 설계하기
summary: Day 50~55의 구조체, 클래스, 메서드, enum, trait, 모듈, 시험을 한 프로젝트로 묶어 복습합니다. 책의 대출 상태를 enum으로, 실패 이유를 오류 enum으로, 도서관을 비공개 필드와 메서드를 가진 구조체로 만들고 모듈로 감싼 뒤, 성공과 실패 경우를 표 시험으로 확인하는 Rust 프로그램을 만듭니다. 같은 설계를 C(구조체 + enum 반환 코드 + 출력 매개변수)와 Python(dataclass + Enum + 예외)으로 옮기며, 인자 계산 순서 때문에 생긴 C 버그, derive(Ord)의 변형 순서, dataclass의 default_factory 같은 복습 포인트를 짚습니다. 마지막으로 우선순위가 있는 할 일 목록을 Rust와 Python으로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-55-module-test]
learningObjectives:
  - 상태는 enum, 실패 이유는 오류 enum, 데이터와 규칙은 구조체와 메서드로 나눠 설계한다.
  - 모듈과 비공개 필드로 규칙을 우회하지 못하게 하고, 필요한 것만 pub 메서드로 공개한다.
  - 성공 경우와 실패 경우를 모두 넣은 표 시험으로 설계를 확인한다.
  - 같은 설계를 C의 반환 코드·출력 매개변수, Python의 dataclass·Enum·예외로 옮긴다.
  - derive(Ord)의 변형 순서, default_factory, C 인자 계산 순서 같은 함정을 설명한다.
concepts:
  [
    abstraction review,
    domain modeling,
    state enum,
    error enum,
    encapsulation,
    private field,
    module boundary,
    result,
    table driven test,
    c return code,
    output parameter,
    evaluation order,
    dataclass,
    default factory,
    intenum,
    derive ord,
    trait for foreign type,
  ]
runnerMode: python
playgroundSource: |
  # 파일: shelf_play.py — dataclass의 리스트 기본값
  from dataclasses import dataclass, field

  @dataclass
  class Shelf:
      books: list = field(default_factory=list)

  a, b = Shelf(), Shelf()
  a.books.append("모모")
  print(a, b)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day56-predict-ord
    title: derive(Ord) enum의 정렬 예측하기
    kind: predict
    objective: derive한 순서가 변형을 적은 순서라는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
      enum Priority {
          High,
          Medium,
          Low,
      }

      fn main() {
          let mut v = vec![Priority::Low, Priority::High, Priority::Medium];
          v.sort();
          println!("{v:?}");
      }
    answer: "[High, Medium, Low]"
    hint: "derive한 비교는 enum에 먼저 적은 변형을 더 작게 봅니다."
    explanation: "derive(PartialOrd, Ord)는 변형을 선언한 순서대로 High < Medium < Low로 비교합니다. 그래서 오름차순 정렬이 곧 '중요한 것부터'가 됩니다. 변형 순서를 바꾸면 정렬 결과도 바뀌므로, 순서에 뜻이 있는 enum은 주석으로 남겨 두세요. Python의 IntEnum은 정한 정수 값으로 비교합니다."
    commonMistakes:
      - "이름의 알파벳 순서(High, Low, Medium)로 정렬된다고 생각함"
      - "enum은 정렬할 수 없다고 생각함(Ord를 derive하면 됨)"
    language: rust
    verification: run
  - id: ex-day56-predict-factory
    title: default_factory 예측하기
    kind: predict
    objective: dataclass의 리스트 필드가 객체마다 따로 만들어진다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      from dataclasses import dataclass, field


      @dataclass
      class Shelf:
          books: list = field(default_factory=list)


      a, b = Shelf(), Shelf()
      a.books.append("모모")
      print(a.books, b.books)
    answer: "['모모'] []"
    hint: "default_factory=list는 객체를 만들 때마다 list()를 새로 부릅니다."
    explanation: "Day 51의 '클래스 속성 리스트 공유' 함정을 dataclass에서 피하는 방법입니다. books: list = []로 쓰면 dataclass가 오류를 내서 막아 주고, field(default_factory=list)를 쓰라고 알려 줍니다. Rust에서는 Vec 필드를 가진 구조체를 만들 때마다 새 Vec이 생겨서 이런 공유가 일어나지 않습니다."
    commonMistakes:
      - "두 선반이 같은 리스트를 공유한다고 생각함"
      - "default_factory가 list 자료형 자체를 넣는다고 생각함"
    language: python
    verification: run
  - id: ex-day56-fill
    title: 정렬에 필요한 derive 채우기
    kind: fill
    objective: sort가 요구하는 Ord를 derive한다.
    prompt: "빈칸을 채워 v.sort()가 컴파일되고 '[High, Low]'가 출력되게 하세요."
    starter: |-
      #[derive(Debug, PartialEq, Eq, PartialOrd, _____)]
      enum Priority {
          High,
          Low,
      }

      fn main() {
          let mut v = vec![Priority::Low, Priority::High];
          v.sort();
          println!("{v:?}");
      }
    answer: |-
      #[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
      enum Priority {
          High,
          Low,
      }

      fn main() {
          let mut v = vec![Priority::Low, Priority::High];
          v.sort();
          println!("{v:?}");
      }
    output: "[High, Low]"
    hint: "sort는 '모든 두 값을 비교할 수 있다'는 전체 순서 trait을 요구합니다(Day 49)."
    explanation: "Vec::sort는 T: Ord를 요구합니다. Ord는 Eq와 PartialOrd를 먼저 요구해서 네 가지를 함께 derive합니다. 실수 f64가 Ord가 아니라 sort를 쓸 수 없었던 것과 같은 trait입니다(Day 49, 54). 트레이트 경계가 '무엇을 할 수 있는가'를 정한다는 것을 다시 볼 수 있습니다."
    commonMistakes:
      - "Clone을 넣어 여전히 Ord가 없다는 오류가 남"
      - "Hash를 넣음(HashMap 열쇠에 필요한 것이고 정렬과는 관계없음)"
    language: rust
    verification: run
  - id: ex-day56-modify
    title: unwrap을 오류 처리로 바꾸기
    kind: modify
    objective: 실패할 수 있는 결과를 unwrap 대신 match로 처리한다.
    prompt: "이 코드는 없는 책 번호에서 unwrap이 패닉을 냅니다. match로 바꿔 '실패: 9번 책 없음'이 출력되게 하세요."
    starter: |-
      fn find(ids: &[u32], id: u32) -> Result<usize, String> {
          ids.iter().position(|&x| x == id).ok_or(format!("{id}번 책 없음"))
      }

      fn main() {
          let ids = [1, 2, 3];
          let i = find(&ids, 9).unwrap();
          println!("{i}번째 칸");
      }
    answer: |-
      fn find(ids: &[u32], id: u32) -> Result<usize, String> {
          ids.iter().position(|&x| x == id).ok_or(format!("{id}번 책 없음"))
      }

      fn main() {
          let ids = [1, 2, 3];
          match find(&ids, 9) {
              Ok(i) => println!("{i}번째 칸"),
              Err(e) => println!("실패: {e}"),
          }
      }
    output: "실패: 9번 책 없음"
    hint: "Result는 enum이라 Ok와 Err 두 팔로 나눌 수 있습니다(Day 53)."
    explanation: "함수가 Result로 실패를 알려 줘도, 부르는 쪽이 unwrap하면 결국 패닉입니다. 사용자가 없는 번호를 입력하는 것은 흔한 일이라 match로 처리해야 합니다. 이 함수 안에서 처리할 수 없으면 ?로 위로 보내고, 가장 바깥(main)에서 사용자에게 알립니다(Day 48)."
    commonMistakes:
      - "unwrap_or(0)으로 바꿔 없는 책을 0번째 칸으로 착각함"
      - "if let Ok(i)만 쓰고 실패 경우를 알리지 않음"
    language: rust
    verification: run
  - id: ex-day56-debug
    title: 비공개 필드를 밖에서 읽는 오류 고치기
    kind: debug
    objective: E0616을 공개 메서드로 해결한다.
    prompt: "이 코드는 E0616(field `books` of struct `Library` is private) 오류로 컴파일되지 않습니다. 필드를 공개하지 말고 책 수를 돌려주는 pub fn count(&self) -> usize를 추가해 '3'이 출력되게 하세요."
    starter: |-
      mod library {
          pub struct Library {
              books: Vec<String>,
          }

          impl Library {
              pub fn new() -> Self {
                  Library { books: vec![String::from("모모"), String::from("데미안"), String::from("어린 왕자")] }
              }
          }
      }

      fn main() {
          let lib = library::Library::new();
          println!("{}", lib.books.len());
      }
    answer: |-
      mod library {
          pub struct Library {
              books: Vec<String>,
          }

          impl Library {
              pub fn new() -> Self {
                  Library { books: vec![String::from("모모"), String::from("데미안"), String::from("어린 왕자")] }
              }

              pub fn count(&self) -> usize {
                  self.books.len()
              }
          }
      }

      fn main() {
          let lib = library::Library::new();
          println!("{}", lib.count());
      }
    output: "3"
    hint: "구조체에 pub을 붙여도 필드는 따로 pub을 붙이지 않으면 모듈 밖에서 보이지 않습니다."
    explanation: "pub books로 공개해도 컴파일은 되지만, 그러면 밖에서 lib.books.clear()처럼 책을 마음대로 지울 수 있어 도서관의 규칙을 우회합니다. 필요한 정보만 읽기 메서드로 공개하면, 안쪽 저장 방식(Vec을 HashMap으로 바꾸기 등)을 바꿔도 밖의 코드를 고칠 필요가 없습니다. Python의 밑줄 약속을 Rust는 컴파일러가 지킵니다."
    commonMistakes:
      - "books 필드에 pub을 붙여 규칙을 우회할 길을 열어 줌"
      - "count를 pub 없이 만들어 E0624(private method) 오류가 남"
    language: rust
    verification: run
  - id: ex-day56-independent
    title: C로 성적 등급과 표 시험 만들기
    kind: independent
    objective: enum을 돌려주는 함수를 만들고, 구조체 배열로 표 시험을 쓴다.
    prompt: "enum grade { GRADE_A, GRADE_B, GRADE_C, GRADE_F }와 enum grade grade_of(int score)(90 이상 A, 80 이상 B, 70 이상 C, 나머지 F)를 만들고, 경계값을 포함한 다섯 경우의 표 시험으로 '5/5 통과'를 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 grade_of와 표 시험을 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      enum grade { GRADE_A, GRADE_B, GRADE_C, GRADE_F };

      enum grade grade_of(int score) {
          if (score >= 90) {
              return GRADE_A;
          }
          if (score >= 80) {
              return GRADE_B;
          }
          if (score >= 70) {
              return GRADE_C;
          }
          return GRADE_F;
      }

      int main(void) {
          struct {
              int score;
              enum grade want;
          } cases[] = {{95, GRADE_A}, {90, GRADE_A}, {89, GRADE_B}, {70, GRADE_C}, {0, GRADE_F}};
          int n = sizeof cases / sizeof cases[0], passed = 0;
          for (int i = 0; i < n; i++) {
              passed += grade_of(cases[i].score) == cases[i].want;
          }
          printf("%d/%d 통과\n", passed, n);
          return 0;
      }
    output: "5/5 통과"
    hint: "이름 없는 구조체 배열로 (점수, 기대 등급) 표를 만들 수 있습니다. 경계인 90, 89, 70을 꼭 넣으세요."
    explanation: "90과 89는 A와 B의 경계, 70은 C의 경계입니다. >=를 >로 잘못 쓰는 버그는 경계값을 넣어야만 잡힙니다. 비교 결과(참 1, 거짓 0)를 그대로 더해 통과 개수를 셌습니다. 같은 표를 Python 리스트, Rust 배열로 옮기면 모양이 거의 같습니다(Day 55)."
    commonMistakes:
      - "95, 85, 75 같은 가운데 값만 넣어 경계 버그를 놓침"
      - "enum 이름을 A, B처럼 짧게 지어 다른 이름과 부딪힘(C의 enum 이름은 전역)"
    language: c
    verification: run
quiz:
  - id: quiz-day56-01
    question: 책의 대출 상태를 bool 두 개(is_borrowed, has_due_day) 대신 enum Status로 만드는 이유는?
    choices:
      - 메모리를 줄이려고
      - 대출 중이 아닌데 반납일이 있는 것처럼 말이 안 되는 조합을 만들 수 없게 하려고
      - bool을 쓸 수 없어서
      - 출력이 예뻐서
    answerIndex: 1
    explanation: Status::Borrowed { by, due_day }처럼 대출 중일 때만 빌린 사람과 반납일이 있습니다. bool 필드 여러 개는 네 가지 조합 중 일부가 뜻이 없는데도 만들 수 있습니다(Day 53).
  - id: quiz-day56-02
    question: 오류를 String 대신 enum LibError로 만들면 좋은 점은?
    choices:
      - 메시지를 쓸 수 없다
      - 부르는 쪽이 match로 오류 종류마다 다르게 처리할 수 있고, 시험에서 == 로 정확히 비교할 수 있다
      - 더 느리다
      - 차이가 없다
    answerIndex: 1
    explanation: 문자열은 문구가 조금만 바뀌어도 비교가 깨지고, 종류를 구별하려면 글자를 뒤져야 합니다. enum은 종류가 자료형에 있고 필요한 정보(책 번호, 제목)를 담을 수 있습니다. 사람에게 보여 줄 문장은 Display로 따로 만듭니다.
  - id: quiz-day56-03
    question: C에서 printf("%s %d", name(f(&x)), x);처럼 쓰면 생기는 문제는?
    choices:
      - 문제없다
      - 인자를 계산하는 순서가 정해져 있지 않아서, f가 x를 바꾸기 전의 x가 출력될 수 있다
      - 컴파일 오류
      - x가 두 번 바뀐다
    answerIndex: 1
    explanation: C는 함수 인자의 계산 순서를 정하지 않습니다. 오늘 C 예제를 처음 쓸 때 실제로 반납일이 0으로 나온 버그입니다. 값을 바꾸는 호출은 먼저 따로 실행해 결과를 변수에 받은 뒤 출력하세요. Rust는 인자를 왼쪽부터 계산하고, 빌림 규칙 때문에 같은 변수를 바꾸며 읽는 코드도 막힙니다.
  - id: quiz-day56-04
    question: Library의 books 필드를 비공개로 두고 메서드만 공개하는 이유는?
    choices:
      - 속도 때문에
      - 밖에서 규칙(대출 중인 책은 다시 빌릴 수 없음 등)을 우회해 목록을 직접 바꾸지 못하게 하고, 안쪽 저장 방식을 나중에 바꿀 수 있게 하려고
      - Rust가 필드 공개를 금지해서
      - 시험을 못 쓰게 하려고
    answerIndex: 1
    explanation: 이것을 캡슐화라고 합니다. 규칙은 메서드 안에서만 지키면 되고, 사용하는 쪽은 메서드만 알면 됩니다. Python은 밑줄 약속, C는 헤더에 모양을 숨기는 방식으로 같은 목표를 이룹니다(Day 51).
  - id: quiz-day56-05
    question: 표 시험에 꼭 넣어야 하는 경우로 가장 알맞은 것은?
    choices:
      - 가장 흔한 경우 하나
      - 경계값(0, 90과 89, 빈 목록), 실패해야 하는 경우(없는 번호, 두 번 반납)
      - 무작위 값만
      - 이미 통과한 경우만
    answerIndex: 1
    explanation: 버그는 경계와 예외 경로에 숨어 있는 경우가 많습니다. 오늘 Rust 예제의 표에도 없는 책, 정상 대출, 제때 반납, 두 번 반납을 모두 넣었습니다.
---

## 1. 오늘 배울 내용

Day 50부터 Day 55까지 데이터를 묶고(구조체, 클래스), 동작을 붙이고(메서드), 경우를 나누고(enum), 능력을 약속하고(trait), 코드를 나누고(모듈), 확인하는(시험) 방법을 배웠습니다. 오늘은 이 모두를 **하나의 작은 프로젝트**로 묶습니다.

> 책을 빌리고 돌려주며, 연체료를 계산하는 도서관 시스템

1. 설계 나누기
   - 책의 상태: `enum Status { Available, Borrowed { by, due_day } }`
   - 실패 이유: `enum LibError { NoSuchBook, AlreadyBorrowed, NotBorrowed }`
   - 도서관: 비공개 필드 + 공개 메서드 `borrow`, `give_back`, `available`
   - 모듈 `library`로 감싸 규칙을 우회하지 못하게 하기
2. 성공과 실패 경우를 모두 넣은 **표 시험**
3. 같은 설계를 다른 언어로
   - C: 구조체 + `enum` 반환 코드 + 출력 매개변수
   - Python: `dataclass` + `Enum` + 예외
4. 복습 포인트
   - C 함수 인자의 **계산 순서**(오늘 실제로 만난 버그)
   - `derive(Ord)`는 변형을 적은 순서
   - `dataclass`의 `default_factory`
5. 우선순위가 있는 **할 일 목록**을 Rust와 Python으로 만듭니다.

## 2. 왜 필요한가

문법을 하나씩 아는 것과, 그것으로 **프로그램을 설계하는 것**은 다른 능력입니다. 설계에서 자주 묻는 질문은 이렇습니다.

- 이 값은 "이것과 저것"(구조체)인가, "이것 또는 저것"(enum)인가?
- 이 규칙은 어디서 지키는가? 누구나 바꿀 수 있는 곳에 두면 규칙은 약속에 불과합니다.
- 실패는 어떻게 알리는가? 반환 코드, 예외, `Result` 중 무엇이며, 실패 이유는 문자열인가 자료형인가?
- 어떻게 맞는지 아는가? 어떤 경우를 시험해야 하는가?

Day 57부터는 스택, 큐, 연결 리스트, 트리, 그래프 같은 자료 구조를 만듭니다. 각 자료 구조가 바로 "데이터 + 규칙 + 공개 메서드 + 시험"으로 이루어지므로, 오늘의 설계 연습이 그 바탕이 됩니다.

## 3. 그림으로 이해하기

**도서관 시스템의 설계.**

```text
mod library
┌──────────────────────────────────────────────────────────────┐
│ enum Status          Available                                │
│                      Borrowed { by: String, due_day: u32 }    │
│                                                               │
│ enum LibError        NoSuchBook(u32)                          │
│                      AlreadyBorrowed { title, by }            │
│                      NotBorrowed(String)     + impl Display    │
│                                                               │
│ pub struct Book      id, title, status                        │
│ pub struct Library   books: Vec<Book>   ← 비공개               │
│   pub fn new(titles)                                          │
│   pub fn borrow(id, who, today) -> Result<반납일, LibError>     │
│   pub fn give_back(id, today)   -> Result<연체료, LibError>     │
│   pub fn available()            -> Vec<&str>                   │
│   fn find_mut(id)               ← 비공개 도우미                  │
└──────────────────────────────────────────────────────────────┘
          ▲ main은 pub인 것만 쓸 수 있다
```

**책 한 권의 상태 변화.**

```text
Available ──borrow(민지, 10일)──▶ Borrowed { by: 민지, due_day: 24 }
    ▲                                   │
    └──────── give_back(27일) ──────────┘   연체 3일 → 300원
borrow를 Borrowed에서 부르면 → AlreadyBorrowed
give_back을 Available에서 부르면 → NotBorrowed
```

**같은 설계, 세 가지 실패 알림.**

```text
Rust    borrow(...) -> Result<u32, LibError>           match / ? / ==로 시험
C       lib_borrow(..., int *due) -> enum lib_error    반환 코드 + 출력 매개변수
Python  borrow(...) -> int, 실패하면 raise LibError     try / except
```

## 4. 천천히 풀어보기

### 4.1 설계 결정 정리

| 결정          | 선택                                       | 이유                                               |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| 대출 상태     | `enum Status`                              | 대출 중일 때만 빌린 사람과 반납일이 있다(Day 53)   |
| 실패 이유     | `enum LibError` + `Display`                | 종류별로 처리·시험하고, 사람용 문장은 따로(Day 48) |
| 책 목록       | 비공개 `Vec<Book>`                         | 규칙을 우회하지 못하게(Day 51, 55)                 |
| 책 찾기       | 비공개 `find_mut` → `Result<&mut Book, _>` | 공통 코드를 한곳에, `?`로 실패 전달                |
| 반납일·연체료 | 성공 값으로 돌려줌                         | 출력 매개변수 없이 결과를 받음(Day 43과 비교)      |
| 연체일 계산   | `saturating_sub`                           | 일찍 반납하면 0, 음수가 되지 않게(Day 36)          |

### 4.2 시험할 경우 고르기

| 경우                | 기대                    | 확인하는 규칙                   |
| ------------------- | ----------------------- | ------------------------------- |
| 없는 책 빌리기      | `Err(NoSuchBook(9))`    | 번호 검사                       |
| 정상 대출(0일)      | `Ok(14)`                | 반납일 = 오늘 + 14              |
| 제때 반납(14일)     | `Ok(0)`                 | 반납일 당일은 연체가 아님(경계) |
| 반납한 책을 또 반납 | `Err(NotBorrowed("A"))` | 상태 검사                       |

오류를 `enum`으로 만들고 `PartialEq`를 붙였기 때문에, 시험에서 오류까지 `==`로 정확히 비교할 수 있습니다. 문자열 오류였다면 문구를 고칠 때마다 시험이 깨졌을 것입니다.

### 4.3 C 인자 계산 순서

오늘 C 예제를 처음 쓸 때 이렇게 썼다가 반납일이 0으로 나왔습니다(모양만 보여 주는 코드).

```c
printf("borrow: %s, due %d\n", lib_error_name(lib_borrow(&lib, 1, "minji", 10, &due)), due);
```

C는 함수 인자를 **어떤 순서로 계산할지 정하지 않습니다.** 이 컴파일러는 마지막 인자 `due`를 먼저 읽어 0을 넘긴 뒤 `lib_borrow`를 불렀습니다. 값을 바꾸는 호출은 먼저 따로 실행해 결과를 받고, 그다음 출력하세요.

```c
enum lib_error e = lib_borrow(&lib, 1, "minji", 10, &due);
printf("borrow: %s, due %d\n", lib_error_name(e), due);
```

Rust는 인자를 왼쪽부터 계산하도록 정해져 있고, 같은 변수를 `&mut`로 빌리면서 동시에 읽는 코드는 빌림 규칙이 막습니다. Python도 왼쪽부터 계산합니다.

## 5. Rust로 구현하기

```rust
// 파일: library.rs
mod library {
    use std::fmt;

    #[derive(Debug, Clone, PartialEq)]
    pub enum Status {
        Available,
        Borrowed { by: String, due_day: u32 },
    }

    #[derive(Debug, PartialEq)]
    pub enum LibError {
        NoSuchBook(u32),
        AlreadyBorrowed { title: String, by: String },
        NotBorrowed(String),
    }

    impl fmt::Display for LibError {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            match self {
                LibError::NoSuchBook(id) => write!(f, "{id}번 책 없음"),
                LibError::AlreadyBorrowed { title, by } => write!(f, "'{title}' 대출 중 (빌린 사람 {by})"),
                LibError::NotBorrowed(t) => write!(f, "'{t}' 대출 기록 없음"),
            }
        }
    }

    pub struct Book {
        pub id: u32,
        pub title: String,
        pub status: Status,
    }

    pub struct Library {
        books: Vec<Book>,                   // 밖에서 직접 바꿀 수 없다
    }

    impl Library {
        pub fn new(titles: &[&str]) -> Self {
            let books = titles
                .iter()
                .enumerate()
                .map(|(i, t)| Book { id: i as u32 + 1, title: t.to_string(), status: Status::Available })
                .collect();
            Library { books }
        }

        fn find_mut(&mut self, id: u32) -> Result<&mut Book, LibError> {
            self.books.iter_mut().find(|b| b.id == id).ok_or(LibError::NoSuchBook(id))
        }

        pub fn borrow(&mut self, id: u32, who: &str, today: u32) -> Result<u32, LibError> {
            let book = self.find_mut(id)?;
            if let Status::Borrowed { by, .. } = &book.status {
                return Err(LibError::AlreadyBorrowed { title: book.title.clone(), by: by.clone() });
            }
            let due = today + 14;
            book.status = Status::Borrowed { by: who.to_string(), due_day: due };
            Ok(due)
        }

        pub fn give_back(&mut self, id: u32, today: u32) -> Result<u32, LibError> {
            let book = self.find_mut(id)?;
            let late = match &book.status {
                Status::Available => return Err(LibError::NotBorrowed(book.title.clone())),
                Status::Borrowed { due_day, .. } => today.saturating_sub(*due_day),
            };
            book.status = Status::Available;
            Ok(late * 100)                  // 하루 100원 연체료
        }

        pub fn available(&self) -> Vec<&str> {
            self.books.iter().filter(|b| b.status == Status::Available).map(|b| b.title.as_str()).collect()
        }
    }
}

use library::{LibError, Library};

fn main() {
    let mut lib = Library::new(&["모모", "데미안", "어린 왕자"]);
    println!("대출: {:?}", lib.borrow(1, "민지", 10));
    match lib.borrow(1, "준호", 11) {
        Ok(due) => println!("반납일 {due}"),
        Err(e) => println!("실패: {e}"),
    }
    println!("대출 가능: {:?}", lib.available());
    println!("반납(연체 3일): {:?}", lib.give_back(1, 27));
    println!("다시 반납: {}", lib.give_back(1, 28).unwrap_err());

    // 표 시험: (동작 결과, 기대값)
    let mut t = Library::new(&["A"]);
    let checks = [
        (t.borrow(9, "x", 0).map(|_| 0), Err(LibError::NoSuchBook(9))),
        (t.borrow(1, "x", 0), Ok(14)),
        (t.give_back(1, 14), Ok(0)),
        (t.give_back(1, 15), Err(LibError::NotBorrowed(String::from("A")))),
    ];
    let passed = checks.iter().filter(|(got, want)| got == want).count();
    println!("시험 {passed}/{} 통과", checks.len());
    assert_eq!(passed, checks.len());
}
```

실행 결과:

```text
대출: Ok(24)
실패: '모모' 대출 중 (빌린 사람 민지)
대출 가능: ["데미안", "어린 왕자"]
반납(연체 3일): Ok(300)
다시 반납: '모모' 대출 기록 없음
시험 4/4 통과
```

### 코드 한 부분씩 읽기

| 코드                                                             | 설명                                                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `mod library { ... }` / `use library::{LibError, Library};`      | 도서관 코드를 모듈로 감쌌습니다. `main`은 `pub`인 것만 쓸 수 있습니다.                                                                |
| `pub enum Status { Available, Borrowed { by, due_day } }`        | 상태마다 필요한 데이터만 있습니다. 대출 가능한 책에는 빌린 사람이 없습니다.                                                           |
| `impl fmt::Display for LibError`                                 | `{e}`로 출력할 사람용 문장입니다. 시험은 `==`로, 사용자에게는 문장으로 보여 줍니다.                                                   |
| `books: Vec<Book>`(pub 없음)                                     | 밖에서 `lib.books`를 읽거나 바꾸면 E0616입니다.                                                                                       |
| `fn find_mut(&mut self, id: u32) -> Result<&mut Book, LibError>` | 비공개 도우미입니다. `borrow`와 `give_back`이 `let book = self.find_mut(id)?;`로 함께 씁니다.                                         |
| `if let Status::Borrowed { by, .. } = &book.status`              | 대출 중이면 빌린 사람 이름을 꺼내 오류에 담습니다. `&`로 빌려서 상태를 옮기지 않았습니다.                                             |
| `Status::Available => return Err(...)` (match 팔 안)             | 대출 기록이 없으면 곧바로 함수를 끝냅니다. 나머지 팔은 연체일을 계산한 값이 됩니다.                                                   |
| `today.saturating_sub(*due_day)`                                 | 일찍 반납하면 0입니다. `u32`에서 그냥 빼면 패닉입니다.                                                                                |
| `let checks = [(결과, 기대), ...];`                              | 표 시험입니다. 네 경우를 차례로 실행한 결과를 모아 `==`로 비교합니다. `.map(\|_\| 0)`은 첫 줄의 성공 값 자료형을 맞추려고 넣었습니다. |

## 6. C로 구현하기

```c
// 파일: library.c
#include <stdio.h>

enum status { AVAILABLE, BORROWED };
enum lib_error { LIB_OK = 0, NO_SUCH_BOOK, ALREADY_BORROWED, NOT_BORROWED };

typedef struct {
    int id;
    char title[32];
    enum status status;
    char by[16];                            // BORROWED일 때만 의미가 있다
    int due_day;
} Book;

typedef struct {
    Book books[8];
    int n;
} Library;

void lib_init(Library *lib, const char *titles[], int n) {
    lib->n = n;
    for (int i = 0; i < n; i++) {
        Book *b = &lib->books[i];
        b->id = i + 1;
        snprintf(b->title, sizeof b->title, "%s", titles[i]);
        b->status = AVAILABLE;
        b->by[0] = '\0';
        b->due_day = 0;
    }
}

static Book *find(Library *lib, int id) {
    for (int i = 0; i < lib->n; i++) {
        if (lib->books[i].id == id) {
            return &lib->books[i];
        }
    }
    return NULL;
}

enum lib_error lib_borrow(Library *lib, int id, const char *who, int today, int *due) {
    Book *b = find(lib, id);
    if (b == NULL) {
        return NO_SUCH_BOOK;
    }
    if (b->status == BORROWED) {
        return ALREADY_BORROWED;
    }
    b->status = BORROWED;
    snprintf(b->by, sizeof b->by, "%s", who);
    b->due_day = today + 14;
    *due = b->due_day;
    return LIB_OK;
}

enum lib_error lib_give_back(Library *lib, int id, int today, int *fine) {
    Book *b = find(lib, id);
    if (b == NULL) {
        return NO_SUCH_BOOK;
    }
    if (b->status != BORROWED) {
        return NOT_BORROWED;
    }
    int late = today > b->due_day ? today - b->due_day : 0;
    b->status = AVAILABLE;
    *fine = late * 100;
    return LIB_OK;
}

const char *lib_error_name(enum lib_error e) {
    switch (e) {
    case LIB_OK: return "ok";
    case NO_SUCH_BOOK: return "no such book";
    case ALREADY_BORROWED: return "already borrowed";
    case NOT_BORROWED: return "not borrowed";
    }
    return "?";
}

int main(void) {
    const char *titles[] = {"Momo", "Demian", "Little Prince"};
    Library lib;
    lib_init(&lib, titles, 3);
    int due = 0, fine = 0;
    enum lib_error e = lib_borrow(&lib, 1, "minji", 10, &due);   // 결과를 먼저 받고 출력한다
    printf("borrow: %s, due %d\n", lib_error_name(e), due);
    printf("borrow again: %s\n", lib_error_name(lib_borrow(&lib, 1, "junho", 11, &due)));
    e = lib_give_back(&lib, 1, 27, &fine);
    printf("give back: %s, fine %d\n", lib_error_name(e), fine);
    printf("give back again: %s\n", lib_error_name(lib_give_back(&lib, 1, 28, &fine)));

    Library t;
    const char *one[] = {"A"};
    lib_init(&t, one, 1);
    int passed = 0;
    passed += lib_borrow(&t, 9, "x", 0, &due) == NO_SUCH_BOOK;
    passed += lib_borrow(&t, 1, "x", 0, &due) == LIB_OK && due == 14;
    passed += lib_give_back(&t, 1, 14, &fine) == LIB_OK && fine == 0;
    passed += lib_give_back(&t, 1, 15, &fine) == NOT_BORROWED;
    printf("tests %d/4 passed\n", passed);
    return passed == 4 ? 0 : 1;
}
```

실행 결과:

```text
borrow: ok, due 24
borrow again: already borrowed
give back: ok, fine 300
give back again: not borrowed
tests 4/4 passed
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                                                  |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `enum lib_error { LIB_OK = 0, NO_SUCH_BOOK, ... };`        | 성공을 0으로 두는 흔한 관례입니다. 오류 enum이지만 데이터(책 제목 등)를 담을 수는 없습니다.                           |
| `char by[16]; int due_day;`                                | Rust의 `Borrowed { by, due_day }`와 달리 언제나 있습니다. `status`가 `BORROWED`일 때만 의미가 있다는 것은 약속입니다. |
| `enum lib_error lib_borrow(..., int *due)`                 | 반환값은 성공 여부, 반납일은 출력 매개변수입니다(Day 43).                                                             |
| `static Book *find(Library *lib, int id)`                  | 파일 밖에서 보이지 않는 도우미입니다. 없으면 `NULL`입니다.                                                            |
| `enum lib_error e = lib_borrow(...); printf(..., e, due);` | 4.3절의 계산 순서 버그를 피하려고 호출과 출력을 나눴습니다.                                                           |
| `passed += lib_borrow(...) == NO_SUCH_BOOK;`               | 비교 결과 1/0을 더해 통과 개수를 셉니다. `&&`로 성공 여부와 출력 값을 함께 확인했습니다.                              |
| `return passed == 4 ? 0 : 1;`                              | 시험이 하나라도 실패하면 프로그램이 실패로 끝나, 자동 검사 도구가 알아챌 수 있습니다.                                 |

C에는 `Library` 안의 `books`를 숨길 방법이 이 파일 안에서는 없습니다. 헤더에 구조체 모양을 숨기면(Day 51 도전 문제) Rust의 비공개 필드와 비슷해집니다.

## 7. Python으로 구현하기

```python
# 파일: library.py
from dataclasses import dataclass, field
from enum import Enum


class Status(Enum):
    AVAILABLE = "대출 가능"
    BORROWED = "대출 중"


class LibError(Exception):
    pass


@dataclass
class Book:
    id: int
    title: str
    status: Status = Status.AVAILABLE
    by: str = ""
    due_day: int = 0


@dataclass
class Library:
    books: list = field(default_factory=list)   # 도서관마다 새 리스트

    @classmethod
    def from_titles(cls, titles):
        return cls([Book(i + 1, t) for i, t in enumerate(titles)])

    def _find(self, book_id):
        for b in self.books:
            if b.id == book_id:
                return b
        raise LibError(f"{book_id}번 책 없음")

    def borrow(self, book_id, who, today):
        b = self._find(book_id)
        if b.status is Status.BORROWED:
            raise LibError(f"'{b.title}' 대출 중 (빌린 사람 {b.by})")
        b.status, b.by, b.due_day = Status.BORROWED, who, today + 14
        return b.due_day

    def give_back(self, book_id, today):
        b = self._find(book_id)
        if b.status is not Status.BORROWED:
            raise LibError(f"'{b.title}' 대출 기록 없음")
        late = max(0, today - b.due_day)
        b.status, b.by = Status.AVAILABLE, ""
        return late * 100

    def available(self):
        return [b.title for b in self.books if b.status is Status.AVAILABLE]


lib = Library.from_titles(["모모", "데미안", "어린 왕자"])
print("대출:", lib.borrow(1, "민지", 10))
try:
    lib.borrow(1, "준호", 11)
except LibError as e:
    print("실패:", e)
print("대출 가능:", lib.available())
print("반납(연체 3일):", lib.give_back(1, 27))
try:
    lib.give_back(1, 28)
except LibError as e:
    print("다시 반납:", e)

t = Library.from_titles(["A"])
assert t.borrow(1, "x", 0) == 14
assert t.give_back(1, 14) == 0
for action in (lambda: t.borrow(9, "x", 0), lambda: t.give_back(1, 15)):
    try:
        action()
        raise AssertionError("오류가 나야 함")
    except LibError:
        pass
print("시험 4/4 통과")
```

실행 결과:

```text
대출: 24
실패: '모모' 대출 중 (빌린 사람 민지)
대출 가능: ['데미안', '어린 왕자']
반납(연체 3일): 300
다시 반납: '모모' 대출 기록 없음
시험 4/4 통과
```

### 코드 한 부분씩 읽기

| 코드                                                           | 설명                                                                                                                                |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `class Status(Enum)`                                           | 상태 이름입니다. 빌린 사람과 반납일은 `Book`의 필드라서, "대출 가능인데 빌린 사람이 있는" 상태를 만들 수는 있습니다(약속으로 막음). |
| `books: list = field(default_factory=list)`                    | 도서관마다 새 리스트입니다(실습의 예측 문제).                                                                                       |
| `@classmethod def from_titles(cls, titles)`                    | Rust의 `Library::new(&[...])`에 해당하는 생성 방법입니다.                                                                           |
| `def _find(self, book_id)`                                     | 밑줄로 "안에서만 쓴다"고 약속한 도우미입니다. 없으면 예외를 냅니다.                                                                 |
| `b.status, b.by, b.due_day = Status.BORROWED, who, today + 14` | 세 필드를 한 줄에 바꿨습니다. 셋 중 하나만 바꾸는 실수를 줄입니다.                                                                  |
| `for action in (lambda: ..., lambda: ...):`                    | 실패해야 하는 두 경우를 함수로 모아 차례로 확인했습니다. 오류가 **나지 않으면** `AssertionError`를 냅니다.                          |

## 8. 실행 추적

Rust 예제에서 1번 책("모모")의 상태가 어떻게 바뀌는지 따라갑니다.

| 호출                    | 전 상태                 | 결과                                      | 후 상태                                |
| ----------------------- | ----------------------- | ----------------------------------------- | -------------------------------------- |
| `borrow(1, "민지", 10)` | `Available`             | `Ok(24)`                                  | `Borrowed { by: "민지", due_day: 24 }` |
| `borrow(1, "준호", 11)` | `Borrowed { 민지, 24 }` | `Err(AlreadyBorrowed { "모모", "민지" })` | 그대로                                 |
| `available()`           |                         | `["데미안", "어린 왕자"]`                 |                                        |
| `give_back(1, 27)`      | `Borrowed { 민지, 24 }` | `Ok(300)`(27 - 24 = 3일)                  | `Available`                            |
| `give_back(1, 28)`      | `Available`             | `Err(NotBorrowed("모모"))`                | 그대로                                 |

실패한 호출은 상태를 바꾸지 않습니다. 메서드가 **검사를 먼저, 변경을 나중에** 하기 때문입니다. 순서가 바뀌면 "실패했는데 상태는 바뀐" 버그가 생깁니다.

## 9. 다른 예제로 다시 이해하기

**우선순위 할 일 목록.** 할 일마다 제목, 우선순위(높음·보통·낮음), 완료 여부가 있습니다. 우선순위 순서(같으면 제목 순)로 정렬해 출력하고, 남은 일의 수와 다음 할 일을 구합니다.

```rust
// 파일: todo.rs
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Priority {
    High,                                   // 먼저 적은 변형이 더 작다(정렬하면 앞으로)
    Medium,
    Low,
}

#[derive(Debug, Clone)]
struct Task {
    title: String,
    priority: Priority,
    done: bool,
}

trait Summary {
    fn summary(&self) -> String;
}

impl fmt::Display for Priority {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = match self {
            Priority::High => "높음",
            Priority::Medium => "보통",
            Priority::Low => "낮음",
        };
        write!(f, "{s}")
    }
}

impl Summary for Task {
    fn summary(&self) -> String {
        format!("[{}] {} ({})", if self.done { "x" } else { " " }, self.title, self.priority)
    }
}

impl Summary for Vec<Task> {                // 남의 자료형(Vec)에도 내 trait을 구현할 수 있다
    fn summary(&self) -> String {
        let left = self.iter().filter(|t| !t.done).count();
        format!("할 일 {}개 중 {left}개 남음", self.len())
    }
}

fn task(title: &str, priority: Priority) -> Task {
    Task { title: title.to_string(), priority, done: false }
}

fn main() {
    let mut todo = vec![
        task("빨래", Priority::Low),
        task("과제 제출", Priority::High),
        task("장보기", Priority::Medium),
        task("시험 공부", Priority::High),
    ];
    todo[1].done = true;
    todo.sort_by(|a, b| a.priority.cmp(&b.priority).then(a.title.cmp(&b.title)));
    for t in &todo {
        println!("{}", t.summary());
    }
    println!("{}", todo.summary());
    let next = todo.iter().find(|t| !t.done).map(|t| t.title.as_str());
    println!("다음 할 일: {next:?}");
    assert!(Priority::High < Priority::Low);
    assert_eq!(todo.iter().filter(|t| t.priority == Priority::High).count(), 2);
    println!("시험 통과");
}
```

실행 결과:

```text
[x] 과제 제출 (높음)
[ ] 시험 공부 (높음)
[ ] 장보기 (보통)
[ ] 빨래 (낮음)
할 일 4개 중 3개 남음
다음 할 일: Some("시험 공부")
시험 통과
```

| 코드                                                                 | 설명                                                                                   |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `#[derive(... PartialOrd, Ord)] enum Priority { High, Medium, Low }` | 먼저 적은 변형이 더 작습니다. 오름차순 정렬이 "중요한 것부터"가 됩니다.                |
| `impl fmt::Display for Priority`                                     | 출력할 때 한글 이름을 씁니다. `{:?}`는 여전히 `High`입니다.                            |
| `trait Summary` / `impl Summary for Task`                            | 한 줄 요약이라는 능력을 약속했습니다(Day 54).                                          |
| `impl Summary for Vec<Task>`                                         | 표준 라이브러리의 `Vec`에도 **내 trait**을 구현할 수 있습니다. 목록 전체의 요약입니다. |
| `a.priority.cmp(&b.priority).then(a.title.cmp(&b.title))`            | 우선순위가 같으면 제목 순입니다(Day 50의 `then_with`와 같은 생각).                     |
| `todo.iter().find(\|t\| !t.done).map(\|t\| t.title.as_str())`        | 정렬된 목록에서 끝나지 않은 첫 할 일입니다. 없으면 `None`입니다.                       |
| `assert!(...)`, `assert_eq!(...)`                                    | 설계의 가정(우선순위 비교, 높음이 두 개)을 확인합니다.                                 |

Python에서는 `IntEnum`으로 정수 값을 정해 비교합니다.

```python
# 파일: todo.py
from dataclasses import dataclass
from enum import IntEnum


class Priority(IntEnum):                    # 정수처럼 비교할 수 있는 Enum
    HIGH = 1
    MEDIUM = 2
    LOW = 3

    def __str__(self):
        return {Priority.HIGH: "높음", Priority.MEDIUM: "보통", Priority.LOW: "낮음"}[self]


@dataclass
class Task:
    title: str
    priority: Priority
    done: bool = False

    def summary(self):
        return f"[{'x' if self.done else ' '}] {self.title} ({self.priority})"


todo = [
    Task("빨래", Priority.LOW),
    Task("과제 제출", Priority.HIGH),
    Task("장보기", Priority.MEDIUM),
    Task("시험 공부", Priority.HIGH),
]
todo[1].done = True
todo.sort(key=lambda t: (t.priority, t.title))
for t in todo:
    print(t.summary())
left = sum(not t.done for t in todo)
print(f"할 일 {len(todo)}개 중 {left}개 남음")
nxt = next((t.title for t in todo if not t.done), None)
print(f"다음 할 일: {nxt!r}")
assert Priority.HIGH < Priority.LOW
assert sum(t.priority is Priority.HIGH for t in todo) == 2
print("시험 통과")
```

실행 결과:

```text
[x] 과제 제출 (높음)
[ ] 시험 공부 (높음)
[ ] 장보기 (보통)
[ ] 빨래 (낮음)
할 일 4개 중 3개 남음
다음 할 일: '시험 공부'
시험 통과
```

- `class Priority(IntEnum)`의 멤버는 정수처럼 비교됩니다. `Priority.HIGH < Priority.LOW`가 참입니다. 다만 `Priority.HIGH == 1`도 참이 되어, 다른 정수와 섞이는 실수를 막지 못합니다(Day 53의 `Enum`과 비교).
- `todo.sort(key=lambda t: (t.priority, t.title))`는 튜플의 첫 값(우선순위), 같으면 둘째 값(제목)으로 정렬합니다.
- `next((... for t in todo if not t.done), None)`은 Rust의 `find`에 해당합니다.

## 10. 설계 도구 총정리

| 설계 질문         | Rust                    | C                         | Python                       |
| ----------------- | ----------------------- | ------------------------- | ---------------------------- |
| 값 여러 개를 묶기 | `struct`                | `struct`                  | `dataclass`, 클래스          |
| 몇 가지 중 하나   | `enum`(데이터 담기)     | `enum` + 공용체           | `Enum`, 클래스 여러 개       |
| 동작 붙이기       | `impl`                  | `자료형_함수(포인터)`     | 메서드                       |
| 규칙 지키기       | 비공개 필드 + 메서드    | 약속(헤더로 숨기기)       | 약속(밑줄, property)         |
| 능력 약속         | `trait`                 | 함수 포인터 표            | 덕 타이핑, `ABC`, `Protocol` |
| 실패 알리기       | `Result<T, 오류 enum>`  | 반환 코드 + 출력 매개변수 | 예외                         |
| 코드 나누기       | `mod`, `pub`, `use`     | `.h` + `.c`               | 모듈, `import`               |
| 맞는지 확인       | `assert_eq!`, `#[test]` | `assert`, `CHECK`         | `assert`, `unittest`         |

## 11. 세 언어 비교

| 관점               | Rust                         | C                     | Python                   |
| ------------------ | ---------------------------- | --------------------- | ------------------------ |
| 말이 안 되는 상태  | 자료형으로 만들 수 없음      | 만들 수 있음(약속)    | 만들 수 있음(약속, 시험) |
| 규칙 우회          | 모듈 밖에서는 불가능         | 가능                  | 가능(밑줄 무시)          |
| 실패 처리를 잊으면 | 값을 꺼낼 수 없음(경고·오류) | 틀린 값으로 계속      | 예외로 멈춤              |
| 코드 길이          | 중간                         | 가장 김               | 가장 짧음                |
| 버그를 찾는 시점   | 대부분 컴파일할 때           | 실행 중(또는 못 찾음) | 실행 중                  |

## 12. 자주 하는 실수

### 실수 1: 규칙을 지키려고 만든 필드를 공개한다 (Rust)

```rust
// 파일: private_field.rs (컴파일 오류: E0616)
mod library {
    pub struct Library {
        books: Vec<String>,
    }

    impl Library {
        pub fn new() -> Self {
            Library { books: vec![String::from("모모"), String::from("데미안"), String::from("어린 왕자")] }
        }
    }
}

fn main() {
    let lib = library::Library::new();
    println!("{}", lib.books.len());
}
```

실습의 디버그 문제입니다. `pub books`로 고치기보다 `pub fn count(&self)`처럼 필요한 정보만 공개하세요.

### 실수 2: 값을 바꾸는 호출과 그 값을 한 printf에 넣는다 (C)

4.3절에서 본 버그입니다. C는 인자 계산 순서를 정하지 않으므로, 바꾸는 호출을 먼저 따로 하세요.

### 실수 3: 검사보다 변경을 먼저 한다 (세 언어)

`book.status = Borrowed` 뒤에 "이미 대출 중인가?"를 검사하면 실패해도 상태가 바뀝니다. 메서드는 **모든 검사 → 변경** 순서로 쓰세요. 8절의 표에서 실패한 호출이 상태를 바꾸지 않은 이유입니다.

### 실수 4: derive(Ord)의 순서를 잊는다 (Rust)

`enum Priority { Low, Medium, High }`로 순서를 바꾸면 정렬 결과가 거꾸로 됩니다. 순서에 뜻이 있는 enum은 주석을 남기고, 순서를 확인하는 `assert!(Priority::High < Priority::Low)` 같은 시험을 두세요.

### 실수 5: 실패 경우를 시험하지 않는다

행복한 경우만 확인하면 "없는 책을 빌리면 패닉", "두 번 반납하면 연체료가 음수" 같은 버그를 놓칩니다. 표 시험에 실패해야 하는 경우를 반드시 넣으세요(Day 55).

## 13. Q&A

**Q. 처음부터 이렇게 설계해야 하나요?**

A. 아닙니다. 처음에는 동작하는 가장 단순한 코드로 시작하고, 규칙이 늘어나거나 버그가 생길 때 구조를 다듬는 것이 보통입니다. 다만 "상태를 bool 여러 개로 나타내고 있다", "누구나 목록을 직접 바꾸고 있다", "오류가 문자열이라 구별하기 어렵다"는 신호가 보이면 오늘 배운 도구로 바꿀 때입니다.

**Q. 세 언어 중 이런 설계에 가장 좋은 언어는 무엇인가요?**

A. 목적에 따라 다릅니다. Rust는 잘못된 상태와 규칙 우회를 컴파일러가 막아 주어 규칙이 많은 프로그램에 강합니다. Python은 짧고 빠르게 시도해 볼 수 있어서 설계를 탐색하기 좋습니다. C는 가장 적은 자원으로 돌아가지만, 모든 규칙을 사람이 지켜야 합니다.

**Q. 오류 enum이 너무 커지면 어떻게 하나요?**

A. 모듈마다 자기 오류 enum을 두고, 바깥 모듈의 오류 enum이 안쪽 오류를 변형으로 담습니다(`AppError::Library(LibError)`). `From`을 구현하면 `?`가 자동으로 바꿔 줍니다(Day 48).

**Q. 할 일 목록처럼 작은 프로그램에도 trait이 필요한가요?**

A. 꼭 필요하지는 않습니다. 오늘은 복습을 위해 넣었습니다. trait은 "여러 자료형이 같은 능력을 가져야 할 때"(도형 여러 종류, 출력 대상 여러 종류) 진가를 발휘합니다. 자료형이 하나뿐이면 보통의 메서드로 충분합니다.

## 14. 핵심 요약

- 설계는 네 질문으로 시작합니다: **무엇을 묶는가**(구조체), **어떤 경우들인가**(enum), **규칙은 어디서 지키는가**(비공개 필드 + 메서드), **실패는 어떻게 알리는가**(`Result`·예외·반환 코드).
- 상태를 enum으로 만들면 말이 안 되는 조합을 만들 수 없고, 오류를 enum으로 만들면 종류별 처리와 정확한 시험이 가능합니다.
- 메서드는 **검사 먼저, 변경 나중**으로 써서 실패한 호출이 상태를 바꾸지 않게 합니다.
- 표 시험에는 경계값과 실패해야 하는 경우를 넣습니다.
- C에서는 인자 계산 순서가 정해져 있지 않으니, 값을 바꾸는 호출과 그 값을 한 식에 섞지 마세요. `derive(Ord)`는 변형 순서, `dataclass`의 리스트 필드는 `default_factory`를 기억하세요.

## 15. 도전 문제

1. **(Rust)** 도서관에 `fn overdue(&self, today: u32) -> Vec<(&str, &str, u32)>`(제목, 빌린 사람, 연체일)를 추가하고, 표 시험에 연체된 책과 연체되지 않은 책을 모두 넣으세요.
2. **(Rust)** 한 사람이 동시에 두 권까지만 빌릴 수 있다는 규칙과 오류 변형 `TooMany { by: String }`을 추가하세요. 규칙을 어디서 지켜야 하는지 생각해 보세요.
3. **(C)** 도서관 예제의 `lib_error_name`을 한국어 메시지로 바꾸고, 오류에 책 제목을 함께 알려 주도록 `lib_borrow`에 `const char **title` 출력 매개변수를 추가해 보세요. Rust의 `AlreadyBorrowed { title, by }`와 비교해 어느 쪽이 쓰기 쉬운지 적어 보세요.
4. **(Python)** 도서관의 시험을 `unittest.TestCase`로 옮기고, 실패해야 하는 경우는 `assertRaises(LibError)`로 확인하세요(Day 55).
