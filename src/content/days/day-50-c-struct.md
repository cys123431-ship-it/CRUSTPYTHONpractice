---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-50-c-struct
courseId: crp-92
phaseId: phase-05
dayNumber: 50
date: "2026-11-19"
title: C 구조체로 관련 값 묶기
summary: 서로 관련된 값(좌표의 x와 y, 책의 제목·연도·위치)을 하나의 자료형으로 묶는 C 구조체를 배웁니다. struct 선언과 typedef, 순서대로·이름을 붙여 초기화하기, 필드 접근 .과 포인터로 접근하는 ->, 대입과 인자 전달이 구조체 전체를 복사한다는 점, 원본을 바꾸려면 포인터로 넘기기, 구조체를 값으로 돌려주기, 구조체 안의 구조체와 구조체 배열, ==로 비교할 수 없다는 점, 맞춤 여백 때문에 sizeof가 필드 크기의 합보다 클 수 있다는 점을 다룹니다. Python의 dataclass와 사전, Rust의 struct·derive·필드 갱신 문법과 비교하고, 학생 성적표를 구조체 배열로 만들어 합계로 정렬하고 이름으로 찾는 프로그램을 세 언어로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-49-memory-io-review]
learningObjectives:
  - struct와 typedef로 자료형을 만들고, 순서대로·이름을 붙여 초기화한다.
  - . 과 -> 로 필드에 접근하고, 구조체 대입과 인자 전달이 값 복사라는 것을 설명한다.
  - 원본을 바꾸는 함수는 포인터로, 새 값을 만드는 함수는 값으로 돌려주도록 설계한다.
  - 구조체 배열을 qsort로 정렬하고, 이름으로 찾아 포인터나 NULL을 돌려준다.
  - Python dataclass와 Rust struct·derive로 같은 묶음을 만들고, 비교·복사 규칙의 차이를 설명한다.
concepts:
  [
    struct,
    typedef,
    designated initializer,
    member access,
    arrow operator,
    struct copy,
    pass struct by pointer,
    return struct,
    nested struct,
    array of structs,
    padding,
    alignment,
    dataclass,
    rust struct,
    derive,
    struct update syntax,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dataclass_play.py — 필드를 묶는 가장 짧은 방법
  from dataclasses import dataclass

  @dataclass
  class Point:
      x: int
      y: int

  a = Point(1, 2)
  b = Point(y=2, x=1)
  print(a, a == b, a is b)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day50-predict-c
    title: 구조체 복사와 포인터 예측하기
    kind: predict
    objective: 대입은 복사본을 만들고, 포인터는 원본을 바꾼다는 것을 추적한다.
    prompt: 출력되는 네 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      struct point {
          int x;
          int y;
      };

      int main(void) {
          struct point a = {1, 2};
          struct point b = a;
          struct point *p = &a;
          b.x = 10;
          p->y = 20;
          printf("%d %d %d %d\n", a.x, a.y, b.x, b.y);
          return 0;
      }
    answer: "1 20 10 2"
    hint: "b는 a의 복사본, p는 a를 가리킵니다."
    explanation: "struct point b = a;는 모든 필드를 복사한 새 값이라 b.x = 10은 a에 영향이 없습니다. p->y = 20은 p가 가리키는 a의 y를 바꿉니다. C 구조체는 정수처럼 값으로 복사되고, 공유하려면 포인터를 씁니다. Python에서는 대입이 같은 객체를 가리키는 반대 규칙이라 헷갈리기 쉽습니다(Day 31)."
    commonMistakes:
      - "b = a가 a를 가리킨다고 생각해 10 20 10 20으로 적음"
      - "p->y가 b를 바꾼다고 생각함"
    language: c
    verification: run
  - id: ex-day50-predict-rs
    title: 필드 갱신 문법 예측하기
    kind: predict
    objective: "..a 가 나머지 필드를 기존 값에서 가져온다는 것을 확인한다."
    prompt: 출력되는 세 수를 공백으로 구분해 적으세요.
    starter: |-
      struct P {
          x: i32,
          y: i32,
      }

      fn main() {
          let a = P { x: 1, y: 2 };
          let b = P { y: 5, ..a };
          println!("{} {} {}", b.x + b.y, a.x, a.y);
      }
    answer: "6 1 2"
    hint: "b의 y는 5로 정했고, x는 a에서 가져옵니다. i32 필드는 복사됩니다."
    explanation: "..a는 '적지 않은 필드는 a의 것을 쓴다'는 뜻입니다. b는 x = 1, y = 5라 합이 6입니다. 가져온 필드가 i32처럼 Copy라서 a는 그대로 쓸 수 있습니다. String 필드를 가져왔다면 그 필드가 a에서 옮겨져 a를 통째로 쓸 수 없게 됩니다."
    commonMistakes:
      - "b의 y도 a에서 와서 2라고 생각함"
      - "..a 뒤에는 a를 쓸 수 없다고 생각함(Copy 필드만 가져오면 쓸 수 있음)"
    language: rust
    verification: run
  - id: ex-day50-fill
    title: 포인터로 필드 바꾸기 채우기
    kind: fill
    objective: 구조체 포인터에서 필드에 접근하는 연산자를 쓴다.
    prompt: "빈칸을 채워 a.x가 1에서 4로 바뀌고 '4'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      struct point {
          int x;
          int y;
      };

      void move_right(struct point *p, int dx) {
          p_____x += dx;
      }

      int main(void) {
          struct point a = {1, 2};
          move_right(&a, 3);
          printf("%d\n", a.x);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      struct point {
          int x;
          int y;
      };

      void move_right(struct point *p, int dx) {
          p->x += dx;
      }

      int main(void) {
          struct point a = {1, 2};
          move_right(&a, 3);
          printf("%d\n", a.x);
          return 0;
      }
    output: "4"
    hint: "p는 구조체가 아니라 구조체를 가리키는 포인터입니다. 따라가서 필드를 꺼내는 화살표 모양의 연산자가 있습니다."
    explanation: "p->x는 (*p).x의 줄임입니다. p.x로 쓰면 'p is a pointer; did you mean to use ->?' 오류가 납니다. Rust는 참조에서도 p.x로 쓰고 컴파일러가 알아서 따라가며, Python에는 포인터가 없어서 항상 p.x입니다."
    commonMistakes:
      - "p.x로 써서 컴파일 오류가 남"
      - "*p.x로 써서 연산자 우선순위 때문에 *(p.x)가 됨"
    language: c
    verification: run
  - id: ex-day50-modify
    title: 값으로 받는 함수를 포인터로 받게 바꾸기
    kind: modify
    objective: 구조체를 값으로 넘기면 복사본만 바뀐다는 것을 확인하고, 원본을 바꾸도록 고친다.
    prompt: "move_right는 복사본을 바꿔서 main의 a가 그대로 1입니다. 포인터로 받도록 고쳐 '함수 안: 4', 'main: 4'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      struct point {
          int x;
          int y;
      };

      void move_right(struct point p, int dx) {
          p.x += dx;
          printf("함수 안: %d\n", p.x);
      }

      int main(void) {
          struct point a = {1, 2};
          move_right(a, 3);
          printf("main: %d\n", a.x);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      struct point {
          int x;
          int y;
      };

      void move_right(struct point *p, int dx) {
          p->x += dx;
          printf("함수 안: %d\n", p->x);
      }

      int main(void) {
          struct point a = {1, 2};
          move_right(&a, 3);
          printf("main: %d\n", a.x);
          return 0;
      }
    output: |-
      함수 안: 4
      main: 4
    starterOutput: |-
      함수 안: 4
      main: 1
    hint: "구조체도 int처럼 인자로 넘길 때 통째로 복사됩니다(Day 43)."
    explanation: "C는 구조체를 값으로 넘기면 모든 필드를 복사합니다. 원본을 바꾸려면 주소를 넘기고 ->로 접근합니다. 큰 구조체는 읽기만 하더라도 복사 비용을 줄이려고 const struct point *로 넘기는 경우가 많습니다. 반대로 새 좌표를 만드는 함수라면 struct point moved(struct point p, int dx)처럼 값으로 받아 새 값을 돌려주는 것도 좋은 설계입니다."
    commonMistakes:
      - "호출하는 곳의 &를 빠뜨려 자료형 오류가 남"
      - "함수 안에서 p.x를 그대로 둬 컴파일 오류가 남"
    language: c
    verification: run
  - id: ex-day50-debug
    title: 비교할 수 없는 구조체에 == 쓰기 고치기
    kind: debug
    objective: derive(PartialEq)로 구조체 비교를 만든다.
    prompt: "이 코드는 E0369(binary operation `==` cannot be applied to type `Point`) 오류로 컴파일되지 않습니다. derive로 비교를 만들어 'true'가 출력되게 하세요."
    starter: |-
      struct Point {
          x: i32,
          y: i32,
      }

      fn main() {
          let a = Point { x: 1, y: 2 };
          let b = Point { x: 1, y: 2 };
          println!("{}", a == b);
      }
    answer: |-
      #[derive(PartialEq)]
      struct Point {
          x: i32,
          y: i32,
      }

      fn main() {
          let a = Point { x: 1, y: 2 };
          let b = Point { x: 1, y: 2 };
          println!("{}", a == b);
      }
    output: "true"
    hint: "Rust는 구조체에 == 를 저절로 만들어 주지 않습니다. 필드를 차례로 비교하는 코드를 만들어 달라고 표시하세요."
    explanation: "#[derive(PartialEq)]는 모든 필드가 같으면 같다고 보는 ==를 만들어 줍니다. C는 구조체 ==가 아예 없어서 필드를 직접 비교하는 함수를 만들고(맞춤 여백 때문에 memcmp도 안전하지 않음), Python의 dataclass는 ==를 자동으로 만들어 줍니다. Debug(출력), Clone(복사), Copy(자동 복사)도 derive로 붙일 수 있습니다."
    commonMistakes:
      - "derive(Eq)만 붙여 PartialEq가 필요하다는 오류가 남"
      - "a.x == b.x만 비교해 y가 달라도 같다고 봄"
    language: rust
    verification: run
  - id: ex-day50-independent
    title: Python dataclass로 사각형 만들기
    kind: independent
    objective: 필드와 메서드를 가진 dataclass를 만들고 비교한다.
    prompt: "w, h 필드와 넓이를 돌려주는 area 메서드를 가진 Rect dataclass를 만들고, Rect(3, 4)의 넓이와 Rect(3, 4)끼리 같은지를 '넓이 12, 같은가 True'로 출력하세요."
    starter: |-
      from dataclasses import dataclass

      print("여기에 Rect를 만들어 보세요")
    answer: |-
      from dataclasses import dataclass


      @dataclass
      class Rect:
          w: int
          h: int

          def area(self):
              return self.w * self.h


      r = Rect(3, 4)
      print(f"넓이 {r.area()}, 같은가 {r == Rect(3, 4)}")
    output: "넓이 12, 같은가 True"
    hint: "@dataclass 아래에 필드 이름: 자료형을 적고, 메서드는 def area(self):로 만듭니다."
    explanation: "dataclass는 필드 목록만 보고 생성자(__init__), 출력(__repr__), 비교(__eq__)를 만들어 줍니다. 그래서 값이 같은 두 객체가 ==로 True입니다(is는 False). C의 구조체는 데이터만 묶고 함수는 따로 두지만, Python과 Rust는 데이터와 그 데이터를 다루는 함수를 함께 묶을 수 있습니다(Day 51, 52)."
    commonMistakes:
      - "@dataclass를 빠뜨려 Rect(3, 4)에서 인자 오류가 남"
      - "area를 괄호 없이 r.area로 써서 메서드 자체가 출력됨"
    language: python
    verification: run
quiz:
  - id: quiz-day50-01
    question: C에서 struct point b = a;를 하면?
    choices:
      - b가 a를 가리킨다
      - a의 모든 필드가 b로 복사된다(서로 독립)
      - 컴파일 오류
      - a가 비워진다
    answerIndex: 1
    explanation: 구조체 대입은 값 복사입니다. 배열 필드도 통째로 복사됩니다. 다만 포인터 필드는 주소만 복사되어 가리키는 곳을 공유하게 됩니다(얕은 복사, Day 42).
  - id: quiz-day50-02
    question: p가 struct point *일 때 x 필드에 접근하는 올바른 방법은?
    choices:
      - p.x
      - p->x 또는 (*p).x
      - "*p.x"
      - p[x]
    answerIndex: 1
    explanation: "*p.x는 연산자 우선순위 때문에 *(p.x)로 해석되어 오류입니다. (*p).x를 짧게 쓴 것이 p->x입니다."
  - id: quiz-day50-03
    question: struct { char c; int i; }의 sizeof가 5가 아니라 8인 이유는?
    choices:
      - 컴파일러 버그
      - int를 4의 배수 주소에 두려고 c 뒤에 3바이트 맞춤 여백을 넣기 때문
      - char가 4바이트라서
      - 구조체 이름이 공간을 차지해서
    answerIndex: 1
    explanation: CPU는 정해진 배수의 주소에 있는 값을 더 빠르게(또는 그래야만) 읽습니다. 컴파일러가 필드 사이에 여백을 넣어 맞춥니다. 필드를 큰 것부터 나열하면 여백이 줄어들 수 있습니다. 여백의 내용은 정해져 있지 않아서 memcmp로 구조체를 비교하면 안 됩니다.
  - id: quiz-day50-04
    question: C에서 두 구조체가 같은지 확인하는 방법은?
    choices:
      - a == b
      - 필드를 하나씩 비교하는 함수를 만든다
      - memcmp가 항상 안전하다
      - 불가능하다
    answerIndex: 1
    explanation: C는 구조체 ==를 지원하지 않습니다(invalid operands to binary ==). 맞춤 여백과 포인터 필드 때문에 바이트 비교도 믿을 수 없습니다. Rust는 derive(PartialEq), Python dataclass는 자동으로 필드 비교를 만들어 줍니다.
  - id: quiz-day50-05
    question: Rust 구조체에서 필드 접근이 C와 다른 점은?
    choices:
      - Rust는 -> 를 쓴다
      - 값이든 참조든 . 으로 쓰고, 컴파일러가 알아서 참조를 따라간다
      - 필드에 접근할 수 없다
      - 메서드로만 접근한다
    answerIndex: 1
    explanation: p가 &mut Point여도 p.x로 씁니다(자동 역참조). 대신 바꾸려면 참조가 &mut이어야 하고, 변수는 let mut이어야 합니다. 필드는 기본적으로 모듈 밖에서 보이지 않으며 pub을 붙여 공개합니다(Day 55).
---

## 1. 오늘 배울 내용

지금까지는 관련된 값을 따로따로 다뤘습니다. 학생의 이름, 국어·영어·수학 점수를 배열 네 개에 나눠 담고, 같은 번호끼리 맞춰 쓰는 식이었습니다. 오늘은 관련된 값을 **하나의 자료형으로 묶는** C 구조체를 배웁니다.

1. 구조체 만들기
   - `struct point { int x; int y; };`
   - `typedef`로 `struct` 없이 이름만 쓰기
2. 초기화와 접근
   - 순서대로 `{1, 2}`, 이름을 붙여 `{.y = 10, .x = 5}`
   - 필드 접근 `.`, 포인터로 접근 `->`
3. 구조체와 함수
   - 대입과 인자 전달은 **통째로 복사**
   - 원본을 바꾸려면 포인터로 넘기기
   - 구조체를 값으로 돌려주기
4. 구조체 안의 구조체, 구조체 배열
5. 주의할 점
   - `==`로 비교할 수 없음
   - 맞춤 여백 때문에 `sizeof`가 필드 크기의 합보다 클 수 있음
6. Python `dataclass`와 사전, Rust `struct`·`derive`·필드 갱신 문법과 비교합니다.
7. 학생 성적표를 구조체 배열로 만들어 합계로 정렬하고, 이름으로 찾는 프로그램을 만듭니다.

## 2. 왜 필요한가

배열 여러 개로 한 사람의 정보를 나눠 담으면 문제가 생깁니다.

- 정렬할 때 배열 네 개를 모두 같은 순서로 바꿔야 합니다. 하나라도 빠뜨리면 이름과 점수가 어긋납니다.
- 함수에 한 학생을 넘기려면 매개변수가 네 개 필요합니다.
- 필드가 하나 늘면 관련된 모든 함수를 고쳐야 합니다.

구조체로 묶으면 "학생 한 명"이 값 하나가 됩니다. 정렬은 구조체를 통째로 옮기고, 함수는 `Student *` 하나만 받습니다. 이것이 Python 클래스(Day 51), Rust 구조체와 메서드(Day 52)로 이어지는 **데이터 묶기**의 출발점입니다.

## 3. 그림으로 이해하기

`struct point a = {1, 2};`의 메모리입니다. 필드가 순서대로 붙어 있습니다.

```text
a ┌──────┬──────┐
  │ x: 1 │ y: 2 │     sizeof a = 8 (int 두 개)
  └──────┴──────┘
```

**대입은 복사, 포인터는 공유.**

```text
struct point b = a;                   struct point *p = &a;
a ┌───┬───┐    b ┌───┬───┐            a ┌───┬───┐
  │ 1 │ 2 │      │ 1 │ 2 │ (따로)       │ 1 │ 2 │ ◀── p
  └───┴───┘      └───┴───┘              └───┴───┘
b.x = 10 → b만 바뀜                     p->y = 20 → a가 바뀜
```

**맞춤 여백.** `int`는 4의 배수 주소에 두는 것이 규칙이라, `char` 뒤에 빈 칸이 생깁니다.

```text
struct mixed { char c; int i; };
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ c │ ░ │ ░ │ ░ │ i │ i │ i │ i │    sizeof = 8 (1 + 여백 3 + 4)
└───┴───┴───┴───┴───┴───┴───┴───┘
```

**구조체 배열.** 학생마다 한 칸, 칸 안에 필드가 붙어 있습니다.

```text
list[0]               list[1]               list[2]
┌─────┬───┬───┬───┐  ┌─────┬───┬───┬───┐  ┌─────┬───┬───┬───┐
│name │kor│eng│mat│  │name │kor│eng│mat│  │name │kor│eng│mat│
└─────┴───┴───┴───┘  └─────┴───┴───┴───┘  └─────┴───┴───┴───┘
qsort는 칸(구조체 전체)을 통째로 옮긴다 → 이름과 점수가 어긋날 수 없다
```

## 4. 천천히 풀어보기

### 4.1 선언과 typedef

```c
struct point { int x; int y; };          // 자료형 이름은 "struct point"
typedef struct { ... } Book;               // 자료형 이름은 "Book"
```

`typedef`는 자료형에 다른 이름을 붙입니다. 매번 `struct`를 쓰지 않아도 되어 편하지만, `struct point`처럼 이름을 남겨 두면 연결 리스트처럼 **자기 자신을 가리키는** 구조체를 만들 수 있습니다(`struct node *next`, Day 41).

### 4.2 초기화

| 모양                                  | 뜻                                  |
| ------------------------------------- | ----------------------------------- |
| `struct point a = {1, 2};`            | 필드 순서대로                       |
| `struct point b = {.y = 10, .x = 5};` | 이름을 붙여(순서 상관없음), C99부터 |
| `struct point z = {0};`               | 첫 필드 0, 나머지도 모두 0          |
| `Book b = {"Momo", 1973, {2, 1}};`    | 구조체 안의 구조체도 중괄호로       |

이름을 붙인 초기화는 필드 순서가 바뀌어도 안전하고, 읽는 사람이 무엇이 무엇인지 바로 압니다.

### 4.3 구조체와 함수

| 함수가 하는 일      | 매개변수                           | 반환                   |
| ------------------- | ---------------------------------- | ---------------------- |
| 읽기만(작은 구조체) | `struct point p`(복사)             | -                      |
| 읽기만(큰 구조체)   | `const Student *s`(복사 비용 없음) | -                      |
| 원본을 바꿈         | `struct point *p`                  | -                      |
| 새 값을 만듦        | 값 또는 `const *`                  | `struct point`(값으로) |

C 구조체는 배열과 달리 **값으로 넘기고 돌려줄 수 있습니다.** 배열을 구조체 안에 넣으면 배열도 통째로 복사됩니다. 반대로 큰 구조체를 매번 복사하면 느리므로 포인터를 씁니다.

### 4.4 비교와 크기

- `a == b`는 컴파일 오류입니다. 필드를 비교하는 함수를 직접 만드세요.
- `memcmp(&a, &b, sizeof a)`는 맞춤 여백의 쓰레기 값까지 비교해서 믿을 수 없습니다.
- `sizeof(구조체)`는 필드 크기의 합 이상입니다. 파일에 구조체를 바이트 그대로 쓰면 컴퓨터마다 모양이 달라질 수 있으니, 필드별로 쓰세요.

## 5. C로 구현하기

```c
// 파일: structs.c
#include <stdio.h>

struct point {                              // 관련된 두 값을 한 묶음으로
    int x;
    int y;
};

typedef struct {                            // typedef로 struct 없이 이름만 쓰게
    char title[32];
    int year;
    struct point shelf;                     // 구조체 안의 구조체
} Book;

struct point add(struct point a, struct point b) {   // 값으로 받고 값으로 돌려준다
    struct point r = {a.x + b.x, a.y + b.y};
    return r;
}

void move_right(struct point *p, int dx) {  // 원본을 바꾸려면 포인터로
    p->x += dx;                             // p->x는 (*p).x의 줄임
}

int same_point(const struct point *a, const struct point *b) {   // ==는 쓸 수 없다
    return a->x == b->x && a->y == b->y;
}

int main(void) {
    struct point a = {1, 2};
    struct point b = {.y = 10, .x = 5};     // 이름을 붙여 초기화(순서 상관없음)
    struct point c = add(a, b);
    printf("add: (%d, %d)\n", c.x, c.y);

    struct point copy = a;                  // 대입하면 모든 필드가 복사된다
    copy.x = 100;
    printf("복사본만 바뀜: a.x %d, copy.x %d\n", a.x, copy.x);

    move_right(&a, 3);
    printf("move_right 뒤 a: (%d, %d), b와 같은가 %d\n", a.x, a.y, same_point(&a, &b));

    Book books[] = {
        {"Momo", 1973, {2, 1}},
        {.title = "Demian", .year = 1919, .shelf = {1, 4}},
    };
    int n = sizeof books / sizeof books[0];
    for (int i = 0; i < n; i++) {
        printf("%-8s %d 선반 (%d, %d)\n", books[i].title, books[i].year, books[i].shelf.x, books[i].shelf.y);
    }
    Book *p = &books[1];
    snprintf(p->title, sizeof p->title, "%s", "Demian!");   // 포인터로 필드 바꾸기
    printf("바꾼 제목 %s\n", books[1].title);

    struct mixed {
        char c;
        int i;
    };
    printf("sizeof(struct point) %zu, sizeof(struct mixed) %zu(맞춤 여백)\n",
           sizeof(struct point), sizeof(struct mixed));
    return 0;
}
```

실행 결과:

```text
add: (6, 12)
복사본만 바뀜: a.x 1, copy.x 100
move_right 뒤 a: (4, 2), b와 같은가 0
Momo     1973 선반 (2, 1)
Demian   1919 선반 (1, 4)
바꾼 제목 Demian!
sizeof(struct point) 8, sizeof(struct mixed) 8(맞춤 여백)
```

### 코드 한 부분씩 읽기

| 코드                                                            | 설명                                                                                                     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `struct point add(struct point a, struct point b)`              | 두 좌표를 복사해 받고, 새 좌표를 값으로 돌려줍니다. 원본은 그대로입니다.                                 |
| `struct point b = {.y = 10, .x = 5};`                           | 이름을 붙여 초기화해 순서가 바뀌어도 됩니다.                                                             |
| `struct point copy = a; copy.x = 100;`                          | 복사본만 바뀝니다.                                                                                       |
| `void move_right(struct point *p, int dx)` / `p->x += dx;`      | 주소를 받아 원본을 바꿉니다.                                                                             |
| `int same_point(const struct point *a, const struct point *b)`  | `==`를 쓸 수 없어서 필드를 직접 비교합니다. 읽기만 하므로 `const`입니다.                                 |
| `Book books[] = {{"Momo", 1973, {2, 1}}, {.title = ...}}`       | 구조체 배열입니다. 두 초기화 방식을 섞어 쓸 수 있습니다.                                                 |
| `books[i].shelf.x`                                              | 구조체 안의 구조체는 `.`을 이어 씁니다.                                                                  |
| `Book *p = &books[1]; snprintf(p->title, sizeof p->title, ...)` | 배열 칸을 가리키는 포인터로 필드를 바꿉니다. `sizeof p->title`은 필드 배열의 크기(32)라 넘치지 않습니다. |
| `struct mixed { char c; int i; };` → 8                          | 1 + 4 = 5가 아니라 8입니다. `int` 앞에 3바이트 여백이 들어갔습니다.                                      |

## 6. Python으로 구현하기

Python에서 가장 가까운 것은 `dataclass`입니다. 클래스는 Day 51에서 자세히 배우니, 오늘은 "필드를 묶는 틀"로만 봅니다.

```python
# 파일: records.py
from dataclasses import dataclass, replace


@dataclass
class Point:                                # 필드 이름과 자료형만 적으면 생성자·출력·==를 만들어 준다
    x: int
    y: int


def add(a, b):
    return Point(a.x + b.x, a.y + b.y)


a = Point(1, 2)
b = Point(y=10, x=5)
print("add:", add(a, b))

alias = a                                   # 대입은 같은 객체를 가리킬 뿐
copy = replace(a)                           # 복사본
copy.x = 100
print("복사본만 바뀜:", a, copy, "/ alias는 같은 객체:", alias is a)


def move_right(p, dx):                      # 객체를 받았으니 바꾸면 부른 쪽에 보인다
    p.x += dx


move_right(a, 3)
print("move_right 뒤 a:", a, "b와 같은가", a == b)
print("값이 같으면 ==:", Point(4, 2) == a)

books = [{"title": "Momo", "year": 1973}, {"title": "Demian", "year": 1919}]   # 사전으로 묶기
for book in books:
    print(f"{book['title']:<8} {book['year']}")
```

실행 결과:

```text
add: Point(x=6, y=12)
복사본만 바뀜: Point(x=1, y=2) Point(x=100, y=2) / alias는 같은 객체: True
move_right 뒤 a: Point(x=4, y=2) b와 같은가 False
값이 같으면 ==: True
Momo     1973
Demian   1919
```

### 코드 한 부분씩 읽기

| 코드                                     | 설명                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `@dataclass class Point: x: int; y: int` | 필드 목록만 적으면 생성자, 출력 모양, `==`를 만들어 줍니다. 자료형 표기는 문서 역할이고 실행 중에 검사하지는 않습니다. |
| `Point(y=10, x=5)`                       | C의 이름 붙인 초기화처럼 이름으로 넘길 수 있습니다.                                                                    |
| `alias = a`                              | **C와 반대로** 대입은 같은 객체를 가리킵니다(Day 31). 복사하려면 `dataclasses.replace(a)`나 `copy.copy(a)`를 씁니다.   |
| `move_right(a, 3)`                       | 포인터 없이도 원본이 바뀝니다. 함수가 받은 것이 같은 객체이기 때문입니다.                                              |
| `Point(4, 2) == a`                       | 필드가 모두 같으면 `True`입니다. `dataclass`가 만들어 준 `==`입니다.                                                   |
| `{"title": "Momo", "year": 1973}`        | 가볍게 묶을 때는 사전도 씁니다. 다만 필드 이름의 오타(`book["titel"]`)를 실행해 봐야 알 수 있습니다.                   |

## 7. Rust로 구현하기

```rust
// 파일: structs.rs
#[derive(Debug, Clone, Copy, PartialEq)]    // 출력, 복사, == 를 만들어 달라
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Book {
    title: String,                          // 제목을 소유(길이 제한 없음)
    year: u32,
    shelf: Point,
}

fn add(a: Point, b: Point) -> Point {
    Point { x: a.x + b.x, y: a.y + b.y }
}

fn move_right(p: &mut Point, dx: i32) {
    p.x += dx;                              // 참조여도 . 으로 쓴다(-> 없음)
}

fn main() {
    let mut a = Point { x: 1, y: 2 };
    let b = Point { y: 10, x: 5 };
    println!("add: {:?}", add(a, b));       // Copy라 a, b를 넘겨도 계속 쓸 수 있다

    let mut copy = a;
    copy.x = 100;
    println!("복사본만 바뀜: {a:?} {copy:?}");

    move_right(&mut a, 3);
    println!("move_right 뒤 a: {a:?}, b와 같은가 {}", a == b);

    let mut books = vec![
        Book { title: String::from("Momo"), year: 1973, shelf: Point { x: 2, y: 1 } },
        Book { title: String::from("Demian"), year: 1919, shelf: Point { x: 1, y: 4 } },
    ];
    books[1].title.push('!');
    for book in &books {
        println!("{:<8} {} 선반 ({}, {})", book.title, book.year, book.shelf.x, book.shelf.y);
    }
    let newer = Book { year: 2026, ..books.remove(0) };   // 나머지 필드는 기존 값에서
    println!("{newer:?}");
    println!("size_of::<Point>() = {}", std::mem::size_of::<Point>());
}
```

실행 결과:

```text
add: Point { x: 6, y: 12 }
복사본만 바뀜: Point { x: 1, y: 2 } Point { x: 100, y: 2 }
move_right 뒤 a: Point { x: 4, y: 2 }, b와 같은가 false
Momo     1973 선반 (2, 1)
Demian!  1919 선반 (1, 4)
Book { title: "Momo", year: 2026, shelf: Point { x: 2, y: 1 } }
size_of::<Point>() = 8
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `#[derive(Debug, Clone, Copy, PartialEq)]`             | 출력(`{:?}`), 복사(`clone`), 자동 복사(`Copy`), `==`를 만들어 달라는 표시입니다. `Copy`를 붙이면 C처럼 대입이 값 복사가 됩니다. |
| `title: String`                                        | C의 `char title[32]`와 달리 길이 제한이 없고, 구조체가 문자열을 소유합니다. 그래서 `Book`에는 `Copy`를 붙일 수 없습니다.        |
| `Point { y: 10, x: 5 }`                                | 필드는 항상 이름으로 적습니다. 하나라도 빠뜨리면 E0063입니다.                                                                   |
| `fn move_right(p: &mut Point, dx: i32)` / `p.x += dx;` | 참조여도 `.`으로 씁니다. `->`가 없습니다.                                                                                       |
| `books[1].title.push('!')`                             | `books`가 `let mut`이라 칸의 필드를 바꿀 수 있습니다.                                                                           |
| `Book { year: 2026, ..books.remove(0) }`               | 필드 갱신 문법입니다. `year`만 새로 주고 나머지는 꺼낸 책에서 가져옵니다. `title`(String)이 옮겨져 옵니다.                      |
| `size_of::<Point>()`                                   | C와 같은 8바이트입니다. Rust는 여백을 줄이려고 필드 순서를 바꿀 수 있어서, C와 모양을 맞춰야 할 때는 `#[repr(C)]`를 붙입니다.   |

## 8. 실행 추적

C 예제의 `a`, `b`, `copy`가 어떻게 바뀌는지 따라갑니다.

| 줄                                    | `a`        | `b`     | `copy`   | `c`     |
| ------------------------------------- | ---------- | ------- | -------- | ------- |
| `struct point a = {1, 2};`            | (1, 2)     |         |          |         |
| `struct point b = {.y = 10, .x = 5};` | (1, 2)     | (5, 10) |          |         |
| `struct point c = add(a, b);`         | (1, 2)     | (5, 10) |          | (6, 12) |
| `struct point copy = a;`              | (1, 2)     | (5, 10) | (1, 2)   | (6, 12) |
| `copy.x = 100;`                       | (1, 2)     | (5, 10) | (100, 2) | (6, 12) |
| `move_right(&a, 3);`                  | **(4, 2)** | (5, 10) | (100, 2) | (6, 12) |

`add`는 복사본을 받아 새 값을 돌려줬고, `move_right`만 주소를 받아 `a`를 바꿨습니다. 함수의 **매개변수 자료형**만 보고 원본이 바뀌는지 알 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**학생 성적표.** 학생마다 이름과 세 과목 점수를 구조체로 묶고, 합계가 높은 순(같으면 이름 순)으로 정렬해 표로 출력합니다. 수학 평균을 내고, 이름으로 학생을 찾아 등수를 알려 줍니다.

```c
// 파일: roster.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[16];
    int kor, eng, math;
} Student;

int total(const Student *s) {
    return s->kor + s->eng + s->math;
}

int by_total_desc(const void *a, const void *b) {
    const Student *x = a, *y = b;
    int d = total(y) - total(x);
    return d != 0 ? d : strcmp(x->name, y->name);
}

const Student *find(const Student list[], int n, const char *name) {   // 없으면 NULL
    for (int i = 0; i < n; i++) {
        if (strcmp(list[i].name, name) == 0) {
            return &list[i];
        }
    }
    return NULL;
}

int main(void) {
    Student list[] = {
        {"minji", 92, 88, 95},
        {"junho", 78, 85, 80},
        {"seoyeon", 88, 92, 95},
        {"doyun", 70, 65, 90},
    };
    int n = sizeof list / sizeof list[0];
    qsort(list, (size_t)n, sizeof list[0], by_total_desc);   // 구조체 통째로 자리를 바꾼다

    printf("%-4s %-8s %3s %3s %3s %4s\n", "rank", "name", "kor", "eng", "mat", "sum");
    double sum_math = 0;
    for (int i = 0; i < n; i++) {
        const Student *s = &list[i];
        printf("%-4d %-8s %3d %3d %3d %4d\n", i + 1, s->name, s->kor, s->eng, s->math, total(s));
        sum_math += s->math;
    }
    printf("수학 평균 %.2f\n", sum_math / n);

    const Student *j = find(list, n, "junho");
    printf("junho: %s\n", j ? "찾음" : "없음");
    if (j != NULL) {
        printf("  %d등, 합계 %d\n", (int)(j - list) + 1, total(j));   // 포인터 빼기로 몇 번째인지
    }
    printf("nobody: %s\n", find(list, n, "nobody") ? "찾음" : "없음");
    return 0;
}
```

실행 결과:

```text
rank name     kor eng mat  sum
1    minji     92  88  95  275
2    seoyeon   88  92  95  275
3    junho     78  85  80  243
4    doyun     70  65  90  225
수학 평균 90.00
junho: 찾음
  3등, 합계 243
nobody: 없음
```

| 코드                                                             | 설명                                                                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `typedef struct { char name[16]; int kor, eng, math; } Student;` | 같은 자료형의 필드는 쉼표로 이어 선언할 수 있습니다.                                                      |
| `int total(const Student *s)`                                    | 읽기만 하므로 `const` 포인터로 받습니다. 구조체를 복사하지 않습니다.                                      |
| `const Student *x = a, *y = b;`                                  | `qsort`가 준 `void *`를 칸의 자료형 포인터로 바꿉니다(Day 49).                                            |
| `return d != 0 ? d : strcmp(x->name, y->name);`                  | 합계가 같으면(275) 이름 순입니다. `minji`가 `seoyeon`보다 앞입니다.                                       |
| `qsort(list, (size_t)n, sizeof list[0], ...)`                    | 칸 크기가 `Student` 하나(28바이트 정도)라, 구조체가 통째로 자리를 바꿉니다.                               |
| `const Student *find(...)` → `NULL`                              | 찾으면 배열 칸의 주소, 없으면 `NULL`입니다. 돌려준 포인터는 `list`가 살아 있는 동안만 유효합니다(Day 45). |
| `(int)(j - list) + 1`                                            | 같은 배열 안의 두 포인터를 빼면 칸 수라서, 몇 번째 칸인지 알 수 있습니다.                                 |
| `"%-8s %3d"`                                                     | 이름을 영문으로 둔 이유는 C의 폭이 바이트 단위이기 때문입니다(Day 37).                                    |

Rust에서는 `Option<&Student>`가 `NULL` 대신이고, 정렬은 `sort_by`와 `then_with`로 기준을 이어 씁니다.

```rust
// 파일: roster.rs
struct Student {
    name: String,
    kor: u32,
    eng: u32,
    math: u32,
}

fn total(s: &Student) -> u32 {
    s.kor + s.eng + s.math
}

fn find<'a>(list: &'a [Student], name: &str) -> Option<&'a Student> {
    list.iter().find(|s| s.name == name)    // 없으면 None(NULL 대신)
}

fn main() {
    let mut list = vec![
        Student { name: "minji".into(), kor: 92, eng: 88, math: 95 },
        Student { name: "junho".into(), kor: 78, eng: 85, math: 80 },
        Student { name: "seoyeon".into(), kor: 88, eng: 92, math: 95 },
        Student { name: "doyun".into(), kor: 70, eng: 65, math: 90 },
    ];
    list.sort_by(|a, b| total(b).cmp(&total(a)).then_with(|| a.name.cmp(&b.name)));

    println!("{:<4} {:<8} {:>3} {:>3} {:>3} {:>4}", "rank", "name", "kor", "eng", "mat", "sum");
    for (i, s) in list.iter().enumerate() {
        println!("{:<4} {:<8} {:>3} {:>3} {:>3} {:>4}", i + 1, s.name, s.kor, s.eng, s.math, total(s));
    }
    let avg = list.iter().map(|s| s.math as f64).sum::<f64>() / list.len() as f64;
    println!("수학 평균 {avg:.2}");

    match find(&list, "junho") {
        Some(s) => println!("junho: 찾음, 합계 {}", total(s)),
        None => println!("junho: 없음"),
    }
    let rank = list.iter().position(|s| s.name == "junho").map(|i| i + 1);
    println!("junho 등수 {rank:?}, nobody {}", if find(&list, "nobody").is_some() { "찾음" } else { "없음" });
}
```

실행 결과:

```text
rank name     kor eng mat  sum
1    minji     92  88  95  275
2    seoyeon   88  92  95  275
3    junho     78  85  80  243
4    doyun     70  65  90  225
수학 평균 90.00
junho: 찾음, 합계 243
junho 등수 Some(3), nobody 없음
```

- `"minji".into()`는 `&str`을 필드 자료형인 `String`으로 바꿉니다.
- `total(b).cmp(&total(a)).then_with(|| a.name.cmp(&b.name))`: 합계는 내림차순, 같으면 이름 오름차순입니다. `then_with`는 앞의 비교가 같을 때만 뒤의 비교를 합니다.
- `fn find<'a>(list: &'a [Student], name: &str) -> Option<&'a Student>`는 결과가 `list`를 빌린다고 적었습니다(Day 45). `name`과는 관계없습니다.
- 등수는 `position`으로 번호를 찾아 1을 더했습니다. C의 포인터 빼기에 해당합니다.

Python에서는 `dataclass`에 **메서드**(`total`)까지 함께 묶었습니다. 데이터와 그 데이터를 다루는 함수를 한곳에 두는 것이 Day 51의 주제입니다.

```python
# 파일: roster.py
from dataclasses import dataclass


@dataclass
class Student:
    name: str
    kor: int
    eng: int
    math: int

    def total(self):                        # 필드와 함께 동작도 묶는다(Day 51에서 자세히)
        return self.kor + self.eng + self.math


students = [
    Student("minji", 92, 88, 95),
    Student("junho", 78, 85, 80),
    Student("seoyeon", 88, 92, 95),
    Student("doyun", 70, 65, 90),
]
students.sort(key=lambda s: (-s.total(), s.name))
print(f"{'rank':<4} {'name':<8} {'kor':>3} {'eng':>3} {'mat':>3} {'sum':>4}")
for i, s in enumerate(students, start=1):
    print(f"{i:<4} {s.name:<8} {s.kor:>3} {s.eng:>3} {s.math:>3} {s.total():>4}")
print(f"수학 평균 {sum(s.math for s in students) / len(students):.2f}")
junho = next((s for s in students if s.name == "junho"), None)
print("junho:", "찾음" if junho else "없음", "/ 등수", students.index(junho) + 1 if junho else None)
```

실행 결과:

```text
rank name     kor eng mat  sum
1    minji     92  88  95  275
2    seoyeon   88  92  95  275
3    junho     78  85  80  243
4    doyun     70  65  90  225
수학 평균 90.00
junho: 찾음 / 등수 3
```

- `students.sort(key=lambda s: (-s.total(), s.name))`는 "합계 내림차순, 이름 오름차순"입니다(Day 49).
- `next((s for s in students if s.name == "junho"), None)`은 조건에 맞는 첫 학생을, 없으면 `None`을 돌려줍니다.
- `students.index(junho)`는 그 객체가 몇 번째인지 알려 줍니다.

## 10. 묶음 자료형 대응표

| 하고 싶은 일       | C                                 | Python                           | Rust                              |
| ------------------ | --------------------------------- | -------------------------------- | --------------------------------- |
| 선언               | `struct point { int x; int y; };` | `@dataclass class Point:`        | `struct Point { x: i32, y: i32 }` |
| 만들기             | `{1, 2}`, `{.x = 1, .y = 2}`      | `Point(1, 2)`, `Point(x=1, y=2)` | `Point { x: 1, y: 2 }`            |
| 필드 읽기          | `a.x`, `p->x`                     | `a.x`                            | `a.x`(참조도 같음)                |
| 대입하면           | 값 복사                           | 같은 객체                        | 이동(`Copy`면 복사)               |
| 원본을 바꾸는 함수 | `struct point *p`                 | 그냥 받음                        | `&mut Point`                      |
| 비교               | 직접 함수                         | 자동 `==`                        | `derive(PartialEq)`               |
| 출력               | 직접 `printf`                     | 자동 `repr`                      | `derive(Debug)`                   |
| 일부만 바꾼 새 값  | 복사 후 대입                      | `replace(a, x=5)`                | `Point { x: 5, ..a }`             |

## 11. 세 언어 비교

| 관점                   | C                                     | Python                          | Rust                                     |
| ---------------------- | ------------------------------------- | ------------------------------- | ---------------------------------------- |
| 기본 복사 규칙         | 값 복사                               | 참조 공유                       | 이동(`Copy`면 복사)                      |
| 문자열 필드            | 고정 크기 배열 또는 포인터(주인 약속) | `str`                           | `String`(소유) 또는 `&'a str`(빌림)      |
| 없는 필드를 쓰면       | 컴파일 오류                           | 실행 중 `AttributeError`        | 컴파일 오류                              |
| 필드를 빠뜨리고 만들면 | 0으로 채워짐(경고 없음)               | 생성자 인자 오류                | 컴파일 오류(E0063)                       |
| 메모리 배치            | 선언 순서 + 맞춤 여백                 | 객체마다 사전(또는 `__slots__`) | 컴파일러가 순서를 정함(`repr(C)`로 고정) |

## 12. 자주 하는 실수

### 실수 1: 구조체를 ==로 비교한다 (C)

```c
// 파일: struct_eq.c (컴파일 오류: invalid operands to binary ==)
#include <stdio.h>

struct point {
    int x;
    int y;
};

int main(void) {
    struct point a = {1, 2};
    struct point b = {1, 2};
    printf("%d\n", a == b);
    return 0;
}
```

필드를 비교하는 함수(`same_point`)를 만드세요.

### 실수 2: 포인터에 .을 쓴다 (C)

```c
// 파일: dot_on_pointer.c (컴파일 오류: is a pointer; did you mean to use '->'?)
#include <stdio.h>

struct point {
    int x;
    int y;
};

void move_right(struct point *p, int dx) {
    p.x += dx;
}

int main(void) {
    struct point a = {1, 2};
    move_right(&a, 3);
    printf("%d\n", a.x);
    return 0;
}
```

`p->x`로 쓰세요. gcc가 친절하게 알려 줍니다.

### 실수 3: 값으로 받은 구조체를 바꾸고 원본이 바뀌길 기대한다 (C)

실습의 변형 문제입니다. 구조체는 통째로 복사되어 넘어갑니다. 원본을 바꾸려면 포인터를 넘기세요.

### 실수 4: 필드를 빠뜨리고 만든다 (Rust)

```rust
// 파일: missing_field.rs (컴파일 오류: E0063)
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1 };
    println!("{}", p.x);
}
```

C는 빠진 필드를 0으로 채우고 아무 말 없이 넘어가지만, Rust는 모든 필드를 적게 합니다. 기본값이 필요하면 `#[derive(Default)]`와 `Point { x: 1, ..Default::default() }`를 씁니다.

### 실수 5: derive 없이 구조체를 비교한다 (Rust)

```rust
// 파일: no_partial_eq.rs (컴파일 오류: E0369)
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = Point { x: 1, y: 2 };
    println!("{}", a == b);
}
```

실습의 디버그 문제입니다. `#[derive(PartialEq)]`를 붙이세요.

## 13. Q&A

**Q. 구조체 안에 char 배열과 char * 중 무엇을 써야 하나요?**

A. `char name[16]`은 구조체 안에 공간이 있어서 복사·해제가 간단하지만 길이가 제한됩니다. `char *name`은 길이 제한이 없지만, 누가 그 문자열을 소유하고 해제하는지 정해야 하고, 구조체를 복사하면 문자열을 공유하게 됩니다(Day 42). 이름처럼 짧고 길이 제한이 괜찮은 값은 배열, 긴 글은 포인터와 짝이 되는 해제 함수를 씁니다.

**Q. typedef는 항상 써야 하나요?**

A. 취향과 팀 규칙입니다. 리눅스 커널은 `struct`를 그대로 쓰는 것을 선호하고, 많은 라이브러리는 `typedef`로 짧게 씁니다. 자기 자신을 가리키는 구조체는 `typedef struct node { struct node *next; } Node;`처럼 둘을 함께 씁니다.

**Q. Python에서 dataclass와 사전 중 무엇을 쓰나요?**

A. 모양이 정해진 기록(학생, 책, 좌표)은 `dataclass`가 좋습니다. 필드 이름의 오타를 도구가 찾아 주고, 메서드를 붙일 수 있습니다. JSON처럼 모양이 자유로운 데이터나 잠깐 쓰는 묶음은 사전이 편합니다.

**Q. 맞춤 여백을 없앨 수 있나요?**

A. 필드를 큰 자료형부터 나열하면 여백이 줄어듭니다. 컴파일러 확장(`__attribute__((packed))`)으로 여백을 없앨 수도 있지만, 읽기가 느려지거나 일부 CPU에서는 오류가 날 수 있어서 네트워크 패킷 같은 특별한 경우에만 씁니다.

## 14. 핵심 요약

- 구조체는 관련된 값을 **하나의 자료형**으로 묶습니다. `struct 이름 { ... };`으로 선언하고, `typedef`로 짧은 이름을 붙일 수 있습니다.
- 순서대로 `{1, 2}`, 이름을 붙여 `{.x = 1, .y = 2}`로 초기화합니다. 필드는 `.`, 포인터로는 `->`로 접근합니다.
- 구조체 **대입과 인자 전달은 통째로 복사**입니다. 원본을 바꾸려면 포인터를, 큰 구조체를 읽기만 할 때는 `const` 포인터를 넘깁니다. 구조체는 값으로 돌려줄 수도 있습니다.
- `==`로 비교할 수 없고(필드 비교 함수를 만듦), 맞춤 여백 때문에 `sizeof`가 필드 합보다 클 수 있습니다.
- Python `dataclass`는 생성자·출력·`==`를 만들어 주고 대입은 참조 공유입니다. Rust `struct`는 `derive`로 기능을 붙이고, 대입은 이동(`Copy`면 복사), 필드 갱신 문법 `..a`를 씁니다.

## 15. 도전 문제

1. **(C)** `struct rect { struct point top_left; int w, h; }`를 만들고, 점이 사각형 안에 있는지 확인하는 `int contains(const struct rect *r, struct point p)`와 두 사각형이 겹치는지 확인하는 함수를 만드세요.
2. **(C)** 성적표 예제에 과목별 1등을 찾는 `const Student *best_in(const Student list[], int n, int subject)`를 추가하세요. 과목은 `enum subject { KOR, ENG, MATH };`로 나타내고 `switch`로 필드를 고릅니다.
3. **(Rust)** 성적표의 `Student`에 `#[derive(Debug, Clone)]`을 붙이고, 합계 250 이상인 학생만 복사해 새 `Vec`에 모으세요. `filter`와 `cloned()`를 써 봅니다.
4. **(Python)** 성적표의 `Student`에 `@dataclass(order=True)`를 쓰면 무엇을 기준으로 정렬되는지 확인하고, 합계로 정렬되게 하려면 필드를 어떻게 배치해야 하는지 생각해 보세요(`field(compare=False)`를 찾아보세요).
