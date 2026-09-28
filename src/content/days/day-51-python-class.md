---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-51-python-class
courseId: crp-92
phaseId: phase-05
dayNumber: 51
date: "2026-11-20"
title: Python 클래스와 인스턴스
summary: 데이터(속성)와 그 데이터를 다루는 함수(메서드)를 하나로 묶는 Python 클래스를 배웁니다. class와 __init__, 메서드의 첫 매개변수 self가 무엇인지, 인스턴스 속성과 모든 인스턴스가 함께 쓰는 클래스 속성의 차이(바꿀 수 있는 클래스 속성의 공유 함정), 출력 모양을 정하는 __repr__과 ==의 뜻을 정하는 __eq__, 읽을 때는 속성처럼 보이고 쓸 때 검사하는 @property, 다른 방법으로 만드는 @classmethod, 밑줄 이름으로 약속하는 캡슐화를 다룹니다. C에서 구조체와 "첫 인자로 객체 포인터를 받는 함수"로 같은 설계를 흉내 내는 법, Rust의 impl과 new 관례를 비교하고, 잔액을 보호하며 입금·출금·이체를 하는 은행 계좌 클래스를 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-50-c-struct]
learningObjectives:
  - class와 __init__으로 인스턴스를 만들고, 메서드 호출 obj.m(x)가 Class.m(obj, x)라는 것을 설명한다.
  - 인스턴스 속성과 클래스 속성을 구별하고, 바꿀 수 있는 클래스 속성이 공유되는 함정을 고친다.
  - __repr__, __eq__로 출력과 비교의 뜻을 정한다.
  - "@property로 읽기 전용 속성과 검사하는 setter를, @classmethod로 다른 생성 방법을 만든다."
  - 같은 설계를 C의 구조체 + 함수, Rust의 impl로 옮기고 차이를 설명한다.
concepts:
  [
    class,
    instance,
    init,
    self,
    method,
    instance attribute,
    class attribute,
    shared mutable class attribute,
    repr,
    eq,
    property,
    setter,
    classmethod,
    encapsulation,
    invariant,
    object style c,
    impl,
    constructor convention,
  ]
runnerMode: python
playgroundSource: |
  # 파일: class_play.py — 인스턴스 속성과 클래스 속성을 비교해 보세요.
  class Dog:
      kind = "개"
      def __init__(self, name):
          self.name = name
      def __repr__(self):
          return f"Dog({self.name!r})"

  a, b = Dog("바둑"), Dog("흰둥")
  a.kind = "늑대"
  print(a, b, a.kind, b.kind, Dog.kind)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day51-predict-attr
    title: 인스턴스 속성이 클래스 속성을 가리는지 예측하기
    kind: predict
    objective: 인스턴스에 대입하면 그 인스턴스에만 새 속성이 생긴다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      class Dog:
          kind = "개"

          def __init__(self, name):
              self.name = name


      a = Dog("바둑")
      b = Dog("흰둥")
      a.kind = "늑대"
      print(a.kind, b.kind, Dog.kind)
    answer: "늑대 개 개"
    hint: "a.kind = ...는 클래스의 kind를 바꾸는 것이 아니라 a에 kind라는 인스턴스 속성을 새로 만듭니다."
    explanation: '속성을 읽을 때 Python은 먼저 인스턴스에서, 없으면 클래스에서 찾습니다. a.kind = "늑대"는 a 안에 kind를 새로 만들어, a에서 읽을 때는 그것이 먼저 보입니다(클래스 속성을 가림). b와 Dog는 여전히 클래스 속성 "개"를 봅니다. 모든 인스턴스의 값을 바꾸려면 Dog.kind = ...로 클래스에 대입합니다.'
    commonMistakes:
      - "a.kind = ...가 클래스 속성을 바꿔 모두 늑대가 된다고 생각함"
      - "클래스 속성은 인스턴스에서 읽을 수 없다고 생각함"
    language: python
    verification: run
  - id: ex-day51-predict-shared
    title: 클래스 속성 리스트의 공유 예측하기
    kind: predict
    objective: 바꿀 수 있는 클래스 속성을 메서드로 바꾸면 모든 인스턴스가 공유한다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      class Bag:
          items = []

          def add(self, x):
              self.items.append(x)


      p, q = Bag(), Bag()
      p.add(1)
      q.add(2)
      print(p.items, q.items is p.items)
    answer: "[1, 2] True"
    hint: "self.items는 인스턴스에 없으니 클래스의 items를 찾습니다. append는 그 리스트를 제자리에서 바꿉니다."
    explanation: "앞의 문제와 달리 여기서는 self.items에 대입하지 않고 append만 했습니다. 그래서 인스턴스 속성이 생기지 않고, 두 가방 모두 클래스의 리스트 하나를 바꿉니다. Day 31의 '기본값 인자 def f(box=[])' 함정과 같은 원인입니다. 객체마다 따로 가져야 하는 리스트는 __init__에서 self.items = []로 만드세요."
    commonMistakes:
      - "가방마다 따로라서 [1] False라고 생각함"
      - "q.add(2)가 오류라고 생각함"
    language: python
    verification: run
  - id: ex-day51-fill
    title: 메서드의 첫 매개변수 채우기
    kind: fill
    objective: 인스턴스 메서드가 받는 첫 매개변수를 쓴다.
    prompt: "빈칸을 채워 '안녕, 모모'가 출력되게 하세요."
    starter: |-
      class Greeter:
          def __init__(_____, name):
              self.name = name

          def greet(self):
              return f"안녕, {self.name}"


      print(Greeter("모모").greet())
    answer: |-
      class Greeter:
          def __init__(self, name):
              self.name = name

          def greet(self):
              return f"안녕, {self.name}"


      print(Greeter("모모").greet())
    output: "안녕, 모모"
    hint: 'Greeter("모모")를 부르면 Python이 새 객체를 만들어 __init__의 첫 인자로 넘깁니다.'
    explanation: "self는 '지금 다루는 그 객체'입니다. 이름은 약속일 뿐이지만 모든 Python 코드가 self를 씁니다. g.greet()는 속에서 Greeter.greet(g)로 바뀌어 g가 self로 들어갑니다. C에서 counter_tick(&a, 1)처럼 객체 포인터를 첫 인자로 넘기던 것과 같은 모양이고, Rust는 &self로 적습니다."
    commonMistakes:
      - "self를 빼서 인자 개수 오류(TypeError)가 남"
      - "name을 적어 매개변수 이름이 겹침"
    language: python
    verification: run
  - id: ex-day51-modify
    title: 공유되는 리스트를 인스턴스마다 따로 만들기
    kind: modify
    objective: 객체마다 필요한 바꿀 수 있는 값을 __init__에서 만든다.
    prompt: "Bag의 items가 모든 가방에 공유되어 '[1, 2] [1, 2]'가 출력됩니다. 가방마다 자기 리스트를 갖도록 고쳐 '[1] [2]'가 출력되게 하세요."
    starter: |-
      class Bag:
          items = []

          def add(self, x):
              self.items.append(x)


      p, q = Bag(), Bag()
      p.add(1)
      q.add(2)
      print(p.items, q.items)
    answer: |-
      class Bag:
          def __init__(self):
              self.items = []

          def add(self, x):
              self.items.append(x)


      p, q = Bag(), Bag()
      p.add(1)
      q.add(2)
      print(p.items, q.items)
    output: "[1] [2]"
    starterOutput: "[1, 2] [1, 2]"
    hint: "클래스 본문의 코드는 클래스를 만들 때 한 번만 실행되고, __init__은 객체를 만들 때마다 실행됩니다."
    explanation: "클래스 속성은 모든 인스턴스가 함께 쓰는 값(계좌 번호 발급기, 상수)에 쓰고, 객체마다 다른 상태는 __init__에서 self에 만듭니다. 이 규칙을 지키면 Bag()을 만들 때마다 새 리스트가 생깁니다. dataclass에서는 field(default_factory=list)가 같은 일을 합니다."
    commonMistakes:
      - "add 안에서 self.items = []를 해서 매번 비워짐"
      - "__init__에서 items = []로 써서 지역 변수가 됨(self. 빠짐)"
    language: python
    verification: run
  - id: ex-day51-debug
    title: self. 을 빠뜨린 메서드 고치기
    kind: debug
    objective: 메서드 안에서 속성은 self.을 붙여 접근한다.
    prompt: "이 코드는 UnboundLocalError로 멈춥니다. 속성을 바꾸도록 고쳐 '3'이 출력되게 하세요."
    starter: |-
      class Counter:
          def __init__(self):
              self.value = 0

          def tick(self, step):
              value += step


      c = Counter()
      c.tick(3)
      print(c.value)
    answer: |-
      class Counter:
          def __init__(self):
              self.value = 0

          def tick(self, step):
              self.value += step


      c = Counter()
      c.tick(3)
      print(c.value)
    output: "3"
    hint: "메서드 안의 value는 그 함수의 지역 변수입니다. 객체의 속성은 self를 통해서만 닿습니다."
    explanation: "Python은 메서드 안에서 객체의 속성을 자동으로 찾아 주지 않습니다. value += step은 지역 변수 value를 읽으려 하는데 아직 값이 없어서 UnboundLocalError입니다. 항상 self.value로 씁니다. C의 self->value, Rust의 self.value와 같은 규칙입니다(C++, Java는 this를 생략할 수 있어 다릅니다)."
    commonMistakes:
      - "value = 0을 tick 안에 넣어 매번 0에서 시작함"
      - "global value로 바꿔 모든 객체가 전역 변수 하나를 씀"
    language: python
    verification: run
  - id: ex-day51-independent
    title: Rust로 메서드가 있는 사각형 만들기
    kind: independent
    objective: impl 블록에 &self 메서드를 만든다.
    prompt: "w, h 필드를 가진 Rect를 만들고 impl에 area(넓이)와 is_square(정사각형 여부) 메서드를 만드세요. Rect { w: 3, h: 4 }로 '12 false'를 출력합니다."
    starter: |-
      fn main() {
          println!("여기에 Rect와 impl을 만들어 보세요");
      }
    answer: |-
      struct Rect {
          w: u32,
          h: u32,
      }

      impl Rect {
          fn area(&self) -> u32 {
              self.w * self.h
          }

          fn is_square(&self) -> bool {
              self.w == self.h
          }
      }

      fn main() {
          let r = Rect { w: 3, h: 4 };
          println!("{} {}", r.area(), r.is_square());
      }
    output: "12 false"
    hint: "impl Rect { fn area(&self) -> u32 { ... } }처럼 씁니다. &self는 Python의 self에 해당합니다."
    explanation: "Rust의 메서드도 첫 매개변수가 객체이고, 읽기만 하면 &self, 바꾸면 &mut self, 가져가면 self라고 적습니다. Python의 self는 늘 같은 모양이지만, Rust는 빌림의 종류까지 선언에 드러납니다. r.area()는 Rect::area(&r)와 같습니다. 자세한 규칙은 Day 52에서 배웁니다."
    commonMistakes:
      - "fn area(self)로 써서 r이 옮겨져 다음 호출에서 쓸 수 없게 됨"
      - "self 없이 w * h로 써서 찾을 수 없는 이름 오류가 남"
    language: rust
    verification: run
quiz:
  - id: quiz-day51-01
    question: c.tick(3)을 Python이 실제로 실행하는 모양은?
    choices:
      - tick(3)
      - Counter.tick(c, 3)
      - c.tick(c, 3)
      - Counter(3).tick()
    answerIndex: 1
    explanation: 인스턴스로 메서드를 부르면 그 인스턴스가 첫 인자 self로 들어갑니다. 그래서 메서드를 정의할 때는 매개변수가 하나 더 있는 것처럼 보입니다.
  - id: quiz-day51-02
    question: 클래스 본문에 items = []를 두면?
    choices:
      - 객체마다 새 리스트가 생긴다
      - 리스트 하나를 모든 인스턴스가 공유한다
      - 오류가 난다
      - 첫 객체만 쓸 수 있다
    answerIndex: 1
    explanation: 클래스 본문은 클래스를 만들 때 한 번 실행됩니다. 객체마다 따로 필요한 값은 __init__에서 self.items = []로 만드세요. 공유가 의도라면(모든 계좌에 번호를 나눠 주는 값 등) 클래스 속성이 맞습니다.
  - id: quiz-day51-03
    question: __repr__과 __eq__를 만드는 이유로 옳은 것은?
    choices:
      - 속도를 높이려고
      - print나 리스트 출력에서 보일 모양, ==가 무엇을 비교할지 직접 정하려고
      - 반드시 만들어야 해서
      - 메모리를 줄이려고
    answerIndex: 1
    explanation: 만들지 않으면 출력은 <__main__.Counter object at 0x...>이고, ==는 is와 같이 같은 객체인지만 봅니다. dataclass는 이 둘을 필드로부터 자동으로 만들어 줍니다(Day 50).
  - id: quiz-day51-04
    question: "@property를 쓰는 이유는?"
    choices:
      - 메서드를 빠르게 하려고
      - 밖에서는 속성처럼 읽고 쓰면서, 안에서는 계산하거나 값을 검사할 수 있게 하려고
      - 속성을 지우려고
      - 클래스 속성을 만들려고
    answerIndex: 1
    explanation: t.fahrenheit처럼 괄호 없이 읽지만 사실 메서드가 계산합니다. setter를 만들면 t.celsius = -300 같은 잘못된 값을 막을 수 있습니다. 이렇게 객체가 항상 지켜야 하는 조건(불변 조건)을 한곳에서 지킵니다.
  - id: quiz-day51-05
    question: C에서 Python 클래스의 메서드를 흉내 내는 흔한 방법은?
    choices:
      - 구조체 안에 함수를 넣는다
      - 구조체와, 그 구조체의 포인터를 첫 인자로 받는 함수들을 한 묶음으로 만든다(counter_init, counter_tick)
      - 전역 변수만 쓴다
      - 불가능하다
    answerIndex: 1
    explanation: C에는 메서드가 없지만, 이름 앞에 자료형 이름을 붙이고 첫 인자로 객체 포인터(self)를 받는 관례로 같은 설계를 합니다. 표준 라이브러리의 fopen/fprintf/fclose(FILE *)도 이 모양입니다.
---

## 1. 오늘 배울 내용

Day 50에서 C 구조체로 관련된 **값**을 묶었습니다. 오늘은 Python 클래스로 값(속성)과 그 값을 다루는 **함수(메서드)** 를 함께 묶습니다.

1. 클래스의 기본
   - `class`, `__init__`, 인스턴스 만들기
   - 메서드와 첫 매개변수 `self`: `c.tick(3)`은 `Counter.tick(c, 3)`
2. 속성의 두 종류
   - 인스턴스 속성: 객체마다 따로(`self.value`)
   - 클래스 속성: 모든 객체가 함께(`Counter.created`)
   - 바꿀 수 있는 클래스 속성이 **공유**되는 함정
3. 특별한 메서드
   - `__repr__`: 출력 모양
   - `__eq__`: `==`의 뜻
4. 속성을 보호하는 도구
   - `@property`: 읽을 때는 속성, 쓸 때는 검사
   - 밑줄 이름 `_balance`: "밖에서 직접 건드리지 말라"는 약속
   - `@classmethod`: 다른 방법으로 만드는 생성자
5. 같은 설계를 C(구조체 + 함수)와 Rust(`impl`)로 옮깁니다.
6. 잔액을 보호하며 입금·출금·이체를 하는 **은행 계좌** 클래스를 만듭니다.

## 2. 왜 필요한가

Day 50의 성적표처럼 데이터를 묶으면 편하지만, 그 데이터를 **올바르게 다루는 규칙**은 여전히 흩어져 있습니다.

- 계좌 잔액은 음수가 되면 안 됩니다. 그런데 누구나 `account["balance"] -= 1000`을 할 수 있다면 규칙을 지킬 방법이 없습니다.
- 온도를 섭씨로 저장하는데 화씨로도 보고 싶습니다. 두 값을 따로 저장하면 하나만 바뀌어 어긋납니다.
- 계좌마다 거래 기록이 필요한데, 실수로 모든 계좌가 한 목록을 공유하면 큰일입니다.

클래스는 데이터와 규칙을 한곳에 두어, **객체가 스스로 자기 상태를 지키게** 합니다. 규칙을 바꿔야 할 때도 클래스 하나만 고치면 됩니다.

## 3. 그림으로 이해하기

**클래스와 인스턴스.** 클래스는 틀, 인스턴스는 틀로 찍어 낸 객체입니다.

```text
class Counter                      인스턴스들
┌─────────────────────────┐        a ──▶ ┌──────────────┐
│ created = 2  (클래스 속성) │ ◀──┐        │ name: "문"    │
│ def __init__(self, ...) │    │        │ value: 4     │
│ def tick(self, step)    │    ├─────── └──────────────┘
│ def __repr__(self)      │    │   b ──▶ ┌──────────────┐
└─────────────────────────┘    └─────── │ name: "창문"  │
     메서드와 클래스 속성은 하나            │ value: 5     │
                                        └──────────────┘
                                         인스턴스 속성은 객체마다
```

**속성을 찾는 순서.** 먼저 인스턴스, 없으면 클래스입니다.

```text
a.kind 읽기:  a 안에 kind가 있나? → 있으면 그것(가림), 없으면 Dog.kind
a.kind = x:   항상 a 안에 만든다(클래스는 그대로)
a.items.append(x): a 안에 items가 없으면 Dog.items를 찾아 그 리스트를 바꾼다 → 공유!
```

**메서드 호출.**

```text
a.tick(2)   ──▶   Counter.tick(a, 2)
                             │   │
                          self  step
```

**property.**

```text
t.celsius = 100  ──▶ celsius.setter(t, 100) ──▶ 검사 후 t._celsius = 100
t.fahrenheit     ──▶ fahrenheit(t)          ──▶ t.celsius * 9 / 5 + 32 계산
```

## 4. 천천히 풀어보기

### 4.1 __init__과 self

- `Counter("문")`을 부르면 Python이 빈 객체를 만들고, `__init__(그 객체, "문")`을 부릅니다.
- `__init__`은 값을 돌려주지 않고, `self.속성 = 값`으로 객체를 채웁니다.
- 메서드 안에서 객체의 속성은 **반드시** `self.`을 붙여 씁니다. 빠뜨리면 지역 변수가 됩니다.

### 4.2 인스턴스 속성과 클래스 속성

| 종류          | 만드는 곳                        | 공유             | 쓰는 곳                    |
| ------------- | -------------------------------- | ---------------- | -------------------------- |
| 인스턴스 속성 | `__init__` 등에서 `self.x = ...` | 객체마다 따로    | 이름, 잔액, 기록           |
| 클래스 속성   | 클래스 본문에서 `x = ...`        | 모든 객체가 함께 | 상수, 만든 개수, 다음 번호 |

클래스 속성에 **바꿀 수 있는 값**(리스트, 사전)을 두면 모든 객체가 같은 것을 바꿉니다. 객체마다 필요한 리스트는 `__init__`에서 만드세요.

### 4.3 특별한 메서드

이름이 `__이름__` 모양인 메서드는 Python이 특별한 때에 부릅니다.

| 메서드     | 불리는 때                     | 만들지 않으면                        |
| ---------- | ----------------------------- | ------------------------------------ |
| `__init__` | 객체를 만들 때                | 인자 없이만 만들 수 있음             |
| `__repr__` | `repr(x)`, 리스트 안에서 출력 | `<__main__.Counter object at 0x...>` |
| `__str__`  | `print(x)`, `str(x)`          | `__repr__`을 씀                      |
| `__eq__`   | `x == y`                      | `x is y`와 같음                      |
| `__len__`  | `len(x)`                      | `len`을 쓸 수 없음                   |

### 4.4 캡슐화: property와 밑줄

Python에는 `private` 같은 접근 제한 문법이 없습니다. 대신 두 가지 도구를 씁니다.

- **밑줄 이름**(`self._balance`): "클래스 밖에서는 직접 쓰지 말라"는 약속입니다. 막지는 않습니다.
- **`@property`**: 밖에서는 `account.balance`처럼 속성으로 읽지만, 실제로는 메서드가 값을 돌려줍니다. setter를 만들지 않으면 **읽기 전용**이 되어 대입하면 `AttributeError`입니다. setter를 만들면 대입할 때 검사할 수 있습니다.

이렇게 "잔액은 음수가 아니다"처럼 객체가 항상 지켜야 하는 조건을 **불변 조건**(invariant)이라고 부르고, 값을 바꾸는 모든 길(메서드, setter)에서 검사해 지킵니다.

### 4.5 classmethod

`@classmethod`는 첫 매개변수로 인스턴스 대신 **클래스**(`cls`)를 받습니다. 주로 "다른 재료로 만드는 생성자"에 씁니다. `Temperature.from_fahrenheit(212)`처럼 이름이 방법을 설명해 줍니다. Rust의 `from_...` 관례와 같습니다.

## 5. Python으로 구현하기

```python
# 파일: classes.py
class Counter:
    created = 0                             # 클래스 속성: 모든 인스턴스가 함께 쓴다

    def __init__(self, name, start=0):      # 새 인스턴스를 만들 때 불린다
        self.name = name                    # 인스턴스 속성: 객체마다 따로
        self.value = start
        Counter.created += 1

    def tick(self, step=1):                 # 메서드: 첫 매개변수 self가 그 객체
        self.value += step
        return self                         # 자기 자신을 돌려주면 이어 부를 수 있다

    def __repr__(self):                     # 개발자용 출력 모양
        return f"Counter({self.name!r}, {self.value})"

    def __eq__(self, other):                # == 의 뜻을 정한다
        return isinstance(other, Counter) and self.value == other.value


a = Counter("문")
b = Counter("창문", 5)
a.tick().tick().tick(2)
print(a, b, "만든 개수", Counter.created)
print("값이 같나?", a == Counter("다른 이름", 4), "같은 객체인가?", a is b)
print("메서드 호출의 속:", Counter.tick(b, 10), "=", b)


class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius              # 아래 setter를 거친다

    @property
    def celsius(self):                      # 읽을 때는 속성처럼
        return self._celsius

    @celsius.setter
    def celsius(self, value):               # 쓸 때 검사할 수 있다
        if value < -273.15:
            raise ValueError("절대 영도보다 낮음")
        self._celsius = value

    @property
    def fahrenheit(self):                   # 계산해서 주는 읽기 전용 속성
        return self.celsius * 9 / 5 + 32

    @classmethod
    def from_fahrenheit(cls, f):            # 다른 방법으로 만드는 생성자
        return cls((f - 32) * 5 / 9)


t = Temperature(25)
print(f"{t.celsius}°C = {t.fahrenheit}°F")
t.celsius = 100
print(f"{t.celsius}°C = {t.fahrenheit}°F")
print(f"from_fahrenheit(212) → {Temperature.from_fahrenheit(212).celsius}°C")
try:
    t.celsius = -300
except ValueError as e:
    print("ValueError:", e, "/ 값은 그대로", t.celsius)
```

실행 결과:

```text
Counter('문', 4) Counter('창문', 5) 만든 개수 2
값이 같나? True 같은 객체인가? False
메서드 호출의 속: Counter('창문', 15) = Counter('창문', 15)
25°C = 77.0°F
100°C = 212.0°F
from_fahrenheit(212) → 100.0°C
ValueError: 절대 영도보다 낮음 / 값은 그대로 100
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `created = 0` / `Counter.created += 1`     | 클래스 속성입니다. 늘릴 때 `self.created += 1`로 쓰면 인스턴스 속성이 새로 생겨 클래스 값이 늘지 않으니 `Counter.created`로 씁니다. |
| `def tick(self, step=1): ... return self`  | 자기 자신을 돌려줘서 `a.tick().tick().tick(2)`처럼 이어 부를 수 있습니다. 0 → 1 → 2 → 4입니다.                                      |
| `def __repr__(self)`                       | `print(a)`와 리스트 출력에 쓰입니다. `{self.name!r}`로 이름에 따옴표를 붙였습니다.                                                  |
| `def __eq__(self, other)`                  | 값이 같으면 같다고 정했습니다. `isinstance`로 다른 자료형과 비교할 때 오류 대신 `False`가 되게 했습니다.                            |
| `Counter.tick(b, 10)`                      | 메서드를 클래스에서 직접 부르고 객체를 첫 인자로 넘겼습니다. `b.tick(10)`과 같습니다.                                               |
| `self.celsius = celsius`(`__init__` 안)    | `__init__`에서도 setter를 거쳐서, 처음 만들 때부터 잘못된 온도를 막습니다.                                                          |
| `@property def fahrenheit(self)`           | 저장하지 않고 필요할 때 계산합니다. 섭씨만 저장하니 두 값이 어긋날 수 없습니다.                                                     |
| `@classmethod def from_fahrenheit(cls, f)` | `cls(...)`로 만들어서, 이 클래스를 물려받은 클래스에서도 알맞은 자료형이 만들어집니다.                                              |
| `t.celsius = -300` → `ValueError`          | setter가 검사해 거절했고, `_celsius`는 바뀌지 않았습니다.                                                                           |

## 6. C로 구현하기

C에는 클래스가 없지만, **구조체 + 그 구조체의 포인터를 첫 인자로 받는 함수들**로 같은 설계를 합니다.

```c
// 파일: object_style.c
#include <stdio.h>

typedef struct {
    char name[16];
    int value;
} Counter;

static int counters_created = 0;            // 클래스 속성 대신 파일 안의 전역

void counter_init(Counter *self, const char *name, int start) {   // __init__ 역할
    snprintf(self->name, sizeof self->name, "%s", name);
    self->value = start;
    counters_created++;
}

Counter *counter_tick(Counter *self, int step) {   // 메서드 = 첫 인자로 객체를 받는 함수
    self->value += step;
    return self;
}

void counter_print(const Counter *self) {   // __repr__ 역할
    printf("Counter(\"%s\", %d)", self->name, self->value);
}

int counter_eq(const Counter *a, const Counter *b) {
    return a->value == b->value;
}

int main(void) {
    Counter a, b;
    counter_init(&a, "door", 0);
    counter_init(&b, "window", 5);
    counter_tick(counter_tick(counter_tick(&a, 1), 1), 2);   // 이어 부르기
    counter_print(&a);
    printf(" ");
    counter_print(&b);
    printf(" 만든 개수 %d\n", counters_created);

    Counter c;
    counter_init(&c, "other", 4);
    printf("값이 같나? %d 같은 객체인가? %d\n", counter_eq(&a, &c), &a == &b);
    return 0;
}
```

실행 결과:

```text
Counter("door", 4) Counter("window", 5) 만든 개수 2
값이 같나? 1 같은 객체인가? 0
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                         |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `static int counters_created = 0;`               | 클래스 속성 대신 파일 안에서만 보이는 전역 변수입니다. `static`이 붙어 다른 파일에서는 보이지 않습니다.                                      |
| `void counter_init(Counter *self, ...)`          | `__init__` 역할입니다. 이름 앞에 `counter_`를 붙여 어느 자료형의 함수인지 드러냅니다. 매개변수 이름 `self`는 Python을 흉내 낸 것일 뿐입니다. |
| `Counter *counter_tick(Counter *self, int step)` | 포인터를 돌려줘서 `counter_tick(counter_tick(&a, 1), 1)`처럼 이어 부를 수 있지만, 안쪽부터 읽어야 해서 Python보다 읽기 어렵습니다.           |
| `const Counter *self`                            | 읽기만 하는 메서드는 `const`로 받습니다. Rust의 `&self`, Python에서는 표시할 방법이 없습니다.                                                |
| `&a == &b`                                       | 주소 비교가 Python의 `is`, `counter_eq`가 `==`에 해당합니다.                                                                                 |

C 표준 라이브러리의 `FILE *`도 이 모양입니다. `fopen`이 만들고, `fprintf(f, ...)`, `fgets(buf, n, f)`처럼 객체를 인자로 받고, `fclose`가 정리합니다. 다만 C는 필드를 숨기지 못해서 누구나 `a.value = -1`을 할 수 있습니다. 필드를 숨기려면 구조체의 모양을 헤더에 쓰지 않는 방법(불완전 자료형)을 씁니다(도전 문제).

## 7. Rust로 구현하기

Rust는 구조체에 `impl` 블록으로 메서드를 붙입니다. 자세한 규칙은 Day 52에서 배우고, 오늘은 Python과 모양을 비교합니다.

```rust
// 파일: impl_block.rs
struct Counter {
    name: String,
    value: i32,
}

impl Counter {                              // Counter에 딸린 함수들(Day 52에서 자세히)
    fn new(name: &str, start: i32) -> Counter {    // 관례적인 생성 함수
        Counter { name: name.to_string(), value: start }
    }

    fn tick(&mut self, step: i32) -> &mut Counter {   // self를 가변으로 빌린다
        self.value += step;
        self
    }
}

struct Temperature {
    celsius: f64,                           // 필드는 모듈 밖에서 보이지 않는다
}

impl Temperature {
    fn new(celsius: f64) -> Result<Temperature, String> {   // 검사는 만들 때
        if celsius < -273.15 {
            return Err(String::from("절대 영도보다 낮음"));
        }
        Ok(Temperature { celsius })
    }

    fn fahrenheit(&self) -> f64 {
        self.celsius * 9.0 / 5.0 + 32.0
    }

    fn from_fahrenheit(f: f64) -> Result<Temperature, String> {
        Temperature::new((f - 32.0) * 5.0 / 9.0)
    }
}

fn main() {
    let mut a = Counter::new("문", 0);
    a.tick(1).tick(1).tick(2);
    println!("{} {}", a.name, a.value);

    let t = Temperature::new(25.0).unwrap();
    println!("{}°C = {}°F", t.celsius, t.fahrenheit());
    println!("from_fahrenheit(212) → {}°C", Temperature::from_fahrenheit(212.0).unwrap().celsius);
    match Temperature::new(-300.0) {
        Ok(_) => println!("만들어짐"),
        Err(e) => println!("오류: {e}"),
    }
}
```

실행 결과:

```text
문 4
25°C = 77°F
from_fahrenheit(212) → 100°C
오류: 절대 영도보다 낮음
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `impl Counter { ... }`                                | 구조체 선언과 메서드를 따로 적습니다. Python은 한 `class` 블록에 모두 씁니다.                                                                    |
| `fn new(name: &str, start: i32) -> Counter`           | `self`가 없는 함수라 `Counter::new(...)`로 부릅니다. Rust에는 생성자 문법이 없고, `new`라는 이름은 관례입니다.                                   |
| `fn tick(&mut self, step: i32) -> &mut Counter`       | 객체를 바꾸므로 `&mut self`입니다. 자기 자신의 가변 참조를 돌려줘 이어 부를 수 있습니다.                                                         |
| `fn new(celsius: f64) -> Result<Temperature, String>` | Python의 setter 검사 대신, **만드는 순간**에 검사해 잘못된 온도는 아예 만들어지지 않게 했습니다. 필드를 비공개로 두면 밖에서 바꿀 수도 없습니다. |
| `fn fahrenheit(&self) -> f64`                         | 읽기만 하는 메서드는 `&self`입니다. Python의 `@property`와 달리 `t.fahrenheit()`처럼 괄호를 씁니다.                                              |
| `fn from_fahrenheit(f: f64) -> Result<...>`           | `@classmethod`에 해당하는 "다른 재료로 만들기"입니다.                                                                                            |

같은 파일(모듈) 안이라 `t.celsius`를 직접 읽을 수 있었지만, 다른 모듈에서는 `pub`이 없는 필드에 접근할 수 없습니다(Day 55). 이것이 Python의 밑줄 약속을 컴파일러가 지켜 주는 방식입니다.

## 8. 실행 추적

Python 예제의 `a.tick().tick().tick(2)`가 도는 과정을 따라갑니다.

| 단계                | 실제 호출                   | `a.value` | 돌려준 값 |
| ------------------- | --------------------------- | --------- | --------- |
| `a = Counter("문")` | `Counter.__init__(a, "문")` | 0         | -         |
| `a.tick()`          | `Counter.tick(a, 1)`        | 1         | `a`       |
| `.tick()`           | `Counter.tick(a, 1)`        | 2         | `a`       |
| `.tick(2)`          | `Counter.tick(a, 2)`        | 4         | `a`       |

매번 `a` 자신을 돌려줘서 다음 `.tick()`이 같은 객체에서 불립니다. 이런 설계를 **메서드 연결**(method chaining)이라고 합니다. Python의 `list.sort()`처럼 제자리에서 바꾸는 메서드는 대개 `None`을 돌려주는 관례도 있으니(Day 44), 둘 중 하나로 일관되게 정하세요.

## 9. 다른 예제로 다시 이해하기

**은행 계좌.** 계좌는 주인, 번호, 잔액, 거래 기록을 가집니다. 잔액은 밖에서 직접 바꿀 수 없고, 입금·출금·이체 메서드로만 바뀝니다. 잔액보다 많이 출금하면 예외를 냅니다.

```python
# 파일: bank.py
class InsufficientFunds(Exception):
    pass


class Account:
    next_number = 1                         # 계좌 번호를 나눠 주는 클래스 속성

    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("시작 잔액은 음수일 수 없음")
        self.owner = owner
        self._balance = balance             # 밑줄: 밖에서 직접 바꾸지 말라는 약속
        self.history = []                   # 계좌마다 새 리스트(클래스 속성에 두면 공유됨)
        self.number = Account.next_number
        Account.next_number += 1

    @property
    def balance(self):                      # 읽기만 가능
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("입금액은 양수여야 함")
        self._balance += amount
        self.history.append(f"+{amount}")

    def withdraw(self, amount):
        if amount > self._balance:
            raise InsufficientFunds(f"{self.owner}: 잔액 {self._balance} < 요청 {amount}")
        self._balance -= amount
        self.history.append(f"-{amount}")

    def transfer(self, other, amount):
        self.withdraw(amount)               # 실패하면 여기서 예외, 아래는 실행되지 않음
        other.deposit(amount)

    def __repr__(self):
        return f"Account(#{self.number} {self.owner}, {self._balance})"


minji = Account("민지", 1000)
junho = Account("준호")
minji.deposit(500)
minji.transfer(junho, 700)
print(minji, junho)
try:
    junho.transfer(minji, 5000)
except InsufficientFunds as e:
    print("이체 실패:", e)
try:
    minji.balance = 10**6
except AttributeError:
    print("balance는 직접 바꿀 수 없음")
print("민지 기록", minji.history, "준호 기록", junho.history)
```

실행 결과:

```text
Account(#1 민지, 800) Account(#2 준호, 700)
이체 실패: 준호: 잔액 700 < 요청 5000
balance는 직접 바꿀 수 없음
민지 기록 ['+500', '-700'] 준호 기록 ['+700']
```

| 코드                                           | 설명                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `next_number = 1` / `Account.next_number += 1` | 모든 계좌가 함께 쓰는 번호 발급기입니다. 클래스 속성을 쓰기에 알맞은 경우입니다.                                         |
| `self.history = []`                            | 계좌마다 새 기록 리스트를 만듭니다. 클래스 속성으로 두면 모든 계좌의 기록이 섞입니다.                                    |
| `@property def balance(self)`                  | setter가 없어서 `minji.balance = ...`는 `AttributeError`입니다. 잔액이 바뀌는 길은 `deposit`과 `withdraw`뿐입니다.       |
| `class InsufficientFunds(Exception)`           | 잔액 부족을 나타내는 우리 예외입니다(Day 47). 부르는 쪽이 이것만 골라 처리할 수 있습니다.                                |
| `def transfer(self, other, amount)`            | 먼저 `withdraw`하고, 실패하면 예외가 나서 `deposit`은 실행되지 않습니다. 순서를 거꾸로 하면 돈이 생겨나는 버그가 됩니다. |

Rust에서는 잔액을 `u64`로 두어 **자료형이** 음수를 막고, 실패는 `Result`로 돌려줍니다.

```rust
// 파일: bank.rs
#[derive(Debug)]
struct Account {
    number: u32,
    owner: String,
    balance: u64,                           // 음수가 될 수 없는 자료형
    history: Vec<String>,
}

impl Account {
    fn new(number: u32, owner: &str, balance: u64) -> Account {
        Account { number, owner: owner.to_string(), balance, history: Vec::new() }
    }

    fn balance(&self) -> u64 {              // 읽기 전용 접근 메서드
        self.balance
    }

    fn deposit(&mut self, amount: u64) -> Result<(), String> {
        if amount == 0 {
            return Err(String::from("입금액은 양수여야 함"));
        }
        self.balance += amount;
        self.history.push(format!("+{amount}"));
        Ok(())
    }

    fn withdraw(&mut self, amount: u64) -> Result<(), String> {
        if amount > self.balance {
            return Err(format!("{}: 잔액 {} < 요청 {amount}", self.owner, self.balance));
        }
        self.balance -= amount;
        self.history.push(format!("-{amount}"));
        Ok(())
    }

    fn transfer(&mut self, other: &mut Account, amount: u64) -> Result<(), String> {
        self.withdraw(amount)?;
        other.deposit(amount)
    }
}

fn main() {
    let mut minji = Account::new(1, "민지", 1000);
    let mut junho = Account::new(2, "준호", 0);
    minji.deposit(500).unwrap();
    minji.transfer(&mut junho, 700).unwrap();
    println!("#{} {} {}, #{} {} {}", minji.number, minji.owner, minji.balance(), junho.number, junho.owner, junho.balance());
    if let Err(e) = junho.transfer(&mut minji, 5000) {
        println!("이체 실패: {e}");
    }
    println!("민지 기록 {:?} 준호 기록 {:?}", minji.history, junho.history);
}
```

실행 결과:

```text
#1 민지 800, #2 준호 700
이체 실패: 준호: 잔액 700 < 요청 5000
민지 기록 ["+500", "-700"] 준호 기록 ["+700"]
```

- `fn transfer(&mut self, other: &mut Account, amount: u64)`는 두 계좌를 동시에 가변으로 빌립니다. `minji.transfer(&mut minji, 100)`처럼 같은 계좌를 두 번 빌리면 E0499로 막혀서, "자기 자신에게 이체" 같은 경계 사례를 컴파일러가 알려 줍니다.
- `self.withdraw(amount)?;`는 실패하면 곧바로 `Err`를 돌려주므로, Python과 마찬가지로 입금이 일어나지 않습니다.
- 계좌 번호는 클래스 속성 대신 만드는 쪽이 넘겼습니다. Rust에서 여러 객체가 함께 쓰는 값은 보통 그 객체들을 관리하는 쪽(은행 구조체)이 가집니다.

## 10. 클래스 설계 대응표

| 설계 요소                | Python                 | C                                 | Rust                                |
| ------------------------ | ---------------------- | --------------------------------- | ----------------------------------- |
| 데이터 + 함수 묶기       | `class`                | 구조체 + `자료형_함수(self, ...)` | `struct` + `impl`                   |
| 만들기                   | `__init__`             | `자료형_init(&obj, ...)`          | `fn new(...) -> Self`(관례)         |
| 메서드의 객체            | `self`(모양 하나)      | 포인터 첫 인자                    | `&self`, `&mut self`, `self`        |
| 모든 객체가 함께 쓰는 값 | 클래스 속성            | `static` 전역                     | 연관 상수 `const`, 또는 관리하는 쪽 |
| 출력 모양                | `__repr__`, `__str__`  | 출력 함수                         | `Debug`, `Display` 구현             |
| 같음                     | `__eq__`               | 비교 함수                         | `PartialEq`                         |
| 숨기기                   | 밑줄 약속, `@property` | 불완전 자료형(모양을 숨김)        | `pub`이 없는 필드(컴파일러가 강제)  |
| 다른 재료로 만들기       | `@classmethod`         | `자료형_from_...`                 | `fn from_...(...) -> Self`          |

## 11. 세 언어 비교

| 관점                   | Python                               | C                    | Rust                          |
| ---------------------- | ------------------------------------ | -------------------- | ----------------------------- |
| 메서드 문법            | 있음(`obj.m()`)                      | 없음(함수 + 관례)    | 있음(`obj.m()`)               |
| 객체를 바꾸는지 드러남 | 드러나지 않음                        | `const` 유무         | `&self` / `&mut self`         |
| 필드 숨기기            | 약속(`_`)                            | 헤더에서 모양 숨기기 | `pub` 여부(강제)              |
| 속성을 나중에 추가     | 실행 중에 아무 속성이나 만들 수 있음 | 불가능               | 불가능                        |
| 상속                   | 있음                                 | 없음                 | 없음(트레이트로 대신, Day 54) |

## 12. 자주 하는 실수

### 실수 1: 메서드 안에서 self.을 빠뜨린다

```python
# 파일: missing_self_dot.py (실행 오류: UnboundLocalError)
class Counter:
    def __init__(self):
        self.value = 0

    def tick(self, step):
        value += step


c = Counter()
c.tick(3)
print(c.value)
```

실습의 디버그 문제입니다. 속성은 항상 `self.value`로 씁니다.

### 실수 2: 메서드 선언에 self를 빠뜨린다

```python
# 파일: missing_self_param.py (실행 오류: TypeError)
class Counter:
    def tick():
        return 1


print(Counter().tick())
```

`c.tick()`은 `Counter.tick(c)`라서 인자가 하나 넘어갑니다. `def tick(self):`로 쓰세요.

### 실수 3: 바꿀 수 있는 값을 클래스 속성에 둔다

실습의 예측 문제와 변형 문제입니다. 객체마다 필요한 리스트·사전은 `__init__`에서 만드세요.

### 실수 4: 클래스 속성을 self로 늘린다

`self.created += 1`은 `self.created = self.created + 1`이라서, 읽을 때는 클래스 속성을 찾지만 쓸 때는 **인스턴스 속성**을 새로 만듭니다. 클래스 값은 그대로입니다. 클래스 속성을 바꿀 때는 `Counter.created += 1`로 씁니다.

### 실수 5: 괄호 없이 메서드를 부른다

`print(t.area)`는 메서드를 부르지 않고 메서드 객체 자체(`<bound method ...>`)를 출력합니다. 메서드는 `t.area()`, property는 괄호 없이 `t.fahrenheit`입니다. 무엇이 property인지 헷갈리면 클래스 정의를 확인하세요.

## 13. Q&A

**Q. 클래스와 dataclass는 무엇이 다른가요?**

A. `dataclass`도 클래스입니다. 필드 목록을 보고 `__init__`, `__repr__`, `__eq__`를 자동으로 만들어 주는 도구일 뿐입니다. 필드가 많고 규칙이 적은 "기록"에는 `dataclass`가, 검사와 동작이 많은 "객체"에는 직접 쓴 클래스가 어울립니다. 둘을 섞어 `dataclass`에 메서드와 `__post_init__` 검사를 추가하는 것도 흔합니다.

**Q. 상속은 언제 배우나요?**

A. 이 과정에서는 상속보다 **조합**(객체가 다른 객체를 속성으로 가짐)과 Rust의 **트레이트**(Day 54)에 집중합니다. Python에서 예외 클래스를 만들 때 `class InsufficientFunds(Exception)`처럼 이미 상속을 쓰고 있고, 자기 클래스끼리의 상속은 공통 동작이 정말 같은 경우에만 쓰는 것이 좋습니다.

**Q. 밑줄 두 개(\__balance)는 무엇인가요?**

A. 클래스 안에서 `self.__balance`로 쓰면 Python이 이름을 `_Account__balance`로 바꿔 저장합니다(이름 뒤섞기). 상속한 클래스에서 이름이 겹치지 않게 하려는 기능이지, 진짜 비공개는 아닙니다. 보통은 밑줄 하나로 충분합니다.

**Q. Rust에서 Python의 property처럼 필드처럼 보이는 메서드를 만들 수 있나요?**

A. 없습니다. Rust는 "값을 읽는 것"과 "코드를 실행하는 것"을 문법으로 구별해서, 메서드는 항상 괄호를 씁니다. 대신 필드를 비공개로 두고 `fn balance(&self) -> u64` 같은 읽기 메서드를 만드는 것이 관례입니다.

## 14. 핵심 요약

- 클래스는 **속성(데이터)** 과 **메서드(동작)** 를 묶습니다. `ClassName(...)`이 `__init__`을 불러 인스턴스를 만듭니다.
- 메서드의 첫 매개변수 `self`는 그 객체이고, `obj.m(x)`는 `Class.m(obj, x)`입니다. 메서드 안에서 속성은 반드시 `self.`으로 접근합니다.
- 인스턴스 속성은 객체마다, 클래스 속성은 모든 객체가 함께 씁니다. **바꿀 수 있는 값을 클래스 속성에 두면 공유**되니, 객체마다 필요한 것은 `__init__`에서 만듭니다.
- `__repr__`은 출력, `__eq__`는 `==`의 뜻을 정합니다. `@property`는 읽기 전용 속성과 검사하는 setter를, `@classmethod`는 다른 생성 방법을 만듭니다.
- 객체가 지켜야 할 조건(불변 조건)은 값을 바꾸는 모든 길에서 검사해 지킵니다.
- C는 구조체 + 포인터를 첫 인자로 받는 함수로, Rust는 `impl`과 `&self`/`&mut self`, `new` 관례와 비공개 필드로 같은 설계를 합니다.

## 15. 도전 문제

1. **(Python)** `Account`에 `__eq__`를 추가해 계좌 번호가 같으면 같은 계좌로 보게 하고, `__lt__`(작다)를 만들어 잔액 순으로 `sorted(accounts)`가 되게 하세요.
2. **(Python)** `Temperature`에 `kelvin` property(읽기·쓰기 모두)를 추가하세요. 켈빈으로 대입해도 섭씨 setter의 검사를 거치게 만들어야 합니다.
3. **(C)** `counter.h`에는 `typedef struct Counter Counter;`와 함수 선언만 두고, `counter.c`에 구조체의 모양과 `counter_new`(malloc), `counter_free`를 두어 밖에서 필드를 직접 바꿀 수 없게 만들어 보세요(불완전 자료형).
4. **(Rust)** 은행 예제에 `struct Bank { accounts: Vec<Account>, next_number: u32 }`를 만들고, `fn open(&mut self, owner: &str) -> u32`로 번호를 나눠 주며 계좌를 여는 기능을 만드세요. 두 계좌 사이의 이체는 번호로 찾아 `split_at_mut`(Day 33)이나 인덱스로 처리해 보세요.
