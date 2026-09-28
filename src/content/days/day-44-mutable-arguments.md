---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-44-mutable-arguments
courseId: crp-92
phaseId: phase-04
dayNumber: 44
date: "2026-11-13"
title: Python 함수의 가변 인자 — 바꾸는 함수, 복사하는 함수, *args와 **kwargs
summary: 함수가 받은 리스트·사전을 바꿀 때 생기는 부작용을 설계로 다룹니다. 제자리 메서드가 None을 돌려주는 관례(sort와 sorted), 받은 것을 바꾸는 함수와 새로 만들어 돌려주는 함수의 구별, 받은 리스트를 저장할 때의 방어적 복사, 인자 개수가 자유로운 *args(튜플)와 이름 붙은 인자를 모으는 **kwargs(사전), 이름으로만 줄 수 있는 인자, * 와 ** 로 펼쳐 넘기기를 익힙니다. C의 const 매개변수와 stdarg.h 가변 인자 함수, Rust의 &와 &mut, 이동, 가변 인자 대신 슬라이스와 매크로를 비교하고, 장바구니에 물건을 담고 영수증을 만드는 프로그램을 Python과 Rust로 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-43-output-parameter]
learningObjectives:
  - 받은 객체를 바꾸는 함수와 새 객체를 돌려주는 함수를 구별해 설계하고, 제자리 함수가 None을 돌려주는 관례를 설명한다.
  - 받은 리스트를 객체 안에 저장할 때 방어적 복사가 필요한 이유를 설명한다.
  - "*args, **kwargs, 이름으로만 받는 인자, * 와 ** 펼치기를 사용한다."
  - C의 const 매개변수와 va_list 가변 인자 함수를 만들고, 자료형 검사가 없는 위험을 설명한다.
  - Rust에서 &, &mut, 이동으로 함수의 의도를 드러내고, 가변 인자 대신 슬라이스를 쓴다.
concepts:
  [
    side effect,
    in place method,
    returns none,
    sorted vs sort,
    defensive copy,
    varargs,
    args,
    kwargs,
    keyword only argument,
    unpacking,
    const parameter,
    stdarg,
    va_list,
    mutable borrow,
    slice parameter,
    macro,
  ]
runnerMode: python
playgroundSource: |
  # 파일: args_play.py — *args는 튜플, **kwargs는 사전입니다.
  def show(*args, **kwargs):
      print(type(args).__name__, args, type(kwargs).__name__, kwargs)

  show(1, 2, 저자="엔데")
  show(*[3, 4], **{"쪽수": 304})
  xs = [3, 1, 2]
  print(xs.sort(), xs, sorted([9, 7, 8]))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day44-predict-mutate
    title: 바꾸기와 다시 대입하기 예측하기
    kind: predict
    objective: append는 부른 쪽 리스트를 바꾸고, ys = ys + [...]는 함수 안의 이름만 바꾼다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def f(xs, ys):
          xs.append(1)
          ys = ys + [1]

      a, b = [], []
      f(a, b)
      print(a, b)
    answer: "[1] []"
    hint: "xs.append(1)은 받은 리스트 자체를 바꿉니다. ys + [1]은 새 리스트를 만듭니다."
    explanation: "xs와 a는 같은 리스트라 append가 a에 보입니다. ys = ys + [1]은 새 리스트를 만들어 함수 안의 이름 ys에 붙일 뿐이라 b는 그대로입니다. ys += [1]로 썼다면 제자리 변경이라 b도 [1]이 됩니다(Day 42)."
    commonMistakes:
      - "두 리스트 모두 바뀐다고 생각해 [1] [1]로 적음"
      - "함수 안의 변경은 모두 사라진다고 생각해 [] []로 적음"
    language: python
    verification: run
  - id: ex-day44-predict-args
    title: "*args와 **kwargs로 모이는 것 예측하기"
    kind: predict
    objective: 펼친 인자와 직접 준 인자가 각각 튜플과 사전으로 모인다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def show(*args, **kwargs):
          print(len(args), sorted(kwargs))

      show(*[5, 6], 7, **{"z": 8}, y=1)
    answer: "3 ['y', 'z']"
    hint: '*[5, 6]은 5, 6 두 인자로 펼쳐지고, **{"z": 8}은 z=8로 펼쳐집니다.'
    explanation: "위치 인자는 5, 6, 7 세 개라 args는 (5, 6, 7)입니다. 이름 붙은 인자는 z=8과 y=1이라 kwargs는 {'z': 8, 'y': 1}이고, sorted(kwargs)는 열쇠를 정렬한 ['y', 'z']입니다. 사전을 sorted에 넣으면 열쇠만 나옵니다."
    commonMistakes:
      - "*[5, 6]을 리스트 하나로 세어 len을 2로 적음"
      - "sorted(kwargs)가 값을 정렬한다고 생각함"
    language: python
    verification: run
  - id: ex-day44-fill
    title: 몇 개든 받는 평균 함수 채우기
    kind: fill
    objective: 위치 인자를 튜플로 모으는 매개변수를 쓴다.
    prompt: "빈칸을 채워 인자를 몇 개든 받는 average를 만들고, '2.5 10.0'이 출력되게 하세요."
    starter: |-
      def average(_____):
          return sum(nums) / len(nums)


      print(average(1, 2, 3, 4), average(10))
    answer: |-
      def average(*nums):
          return sum(nums) / len(nums)


      print(average(1, 2, 3, 4), average(10))
    output: "2.5 10.0"
    hint: "매개변수 이름 앞에 붙이는 기호 하나가 '나머지 위치 인자를 모두 튜플로'라는 뜻입니다."
    explanation: "*nums는 넘긴 위치 인자를 모두 튜플로 모읍니다. average(1, 2, 3, 4)에서 nums는 (1, 2, 3, 4)입니다. 인자를 하나도 주지 않으면 len(nums)가 0이라 ZeroDivisionError이므로, 실전에서는 def average(first, *rest)처럼 최소 하나를 요구하거나 빈 경우를 검사합니다. 리스트를 넘기려면 average(*scores)로 펼칩니다."
    commonMistakes:
      - "nums만 써서 인자를 하나만 받는 함수가 됨"
      - "**nums를 써서 이름 붙은 인자만 받게 됨"
    language: python
    verification: run
  - id: ex-day44-modify
    title: 원본을 바꾸지 않는 상위 3개 함수로 고치기
    kind: modify
    objective: 제자리 정렬 대신 sorted로 새 리스트를 만들어 부작용을 없앤다.
    prompt: "top3는 결과는 맞지만 받은 리스트까지 정렬해 버립니다. 원본을 바꾸지 않도록 고쳐 '[99, 95, 88] [70, 95, 88, 61, 99]'가 출력되게 하세요."
    starter: |-
      def top3(scores):
          scores.sort(reverse=True)
          return scores[:3]


      s = [70, 95, 88, 61, 99]
      print(top3(s), s)
    answer: |-
      def top3(scores):
          return sorted(scores, reverse=True)[:3]


      s = [70, 95, 88, 61, 99]
      print(top3(s), s)
    output: "[99, 95, 88] [70, 95, 88, 61, 99]"
    starterOutput: "[99, 95, 88] [99, 95, 88, 70, 61]"
    hint: "list.sort()는 제자리, sorted()는 새 리스트입니다."
    explanation: "이름이 top3처럼 '값을 구하는' 함수인데 원본까지 바꾸면, 부른 쪽은 그 부작용을 예상하지 못합니다. 값을 구하는 함수는 부작용 없이, 바꾸는 함수는 이름(sort_in_place 등)과 None 반환으로 드러내는 것이 좋은 설계입니다. heapq.nlargest(3, scores)도 원본을 바꾸지 않습니다."
    commonMistakes:
      - "scores = scores[:]를 잊은 채 sort를 그대로 둬 여전히 원본이 바뀜"
      - "sorted(scores)[:3]로 써서 가장 작은 세 개를 돌려줌"
    language: python
    verification: run
  - id: ex-day44-debug
    title: 가변 빌림 자리에 공유 빌림을 넘긴 오류 고치기
    kind: debug
    objective: E0308(자료형 불일치)을 &mut로 고쳐, 바꾸는 호출임을 드러낸다.
    prompt: "이 코드는 E0308(mismatched types) 오류로 컴파일되지 않습니다. 고쳐서 '[65, 75]'가 출력되게 하세요."
    starter: |-
      fn add_bonus(xs: &mut [i32], bonus: i32) {
          for x in xs.iter_mut() {
              *x += bonus;
          }
      }

      fn main() {
          let mut a = vec![60, 70];
          add_bonus(&a, 5);
          println!("{a:?}");
      }
    answer: |-
      fn add_bonus(xs: &mut [i32], bonus: i32) {
          for x in xs.iter_mut() {
              *x += bonus;
          }
      }

      fn main() {
          let mut a = vec![60, 70];
          add_bonus(&mut a, 5);
          println!("{a:?}");
      }
    output: "[65, 75]"
    hint: "함수는 바꿀 수 있는 빌림을 기대하는데, 부르는 곳에서는 읽기만 하는 빌림을 넘겼습니다."
    explanation: "Rust는 '이 호출이 값을 바꾼다'는 사실을 부르는 곳에도 &mut로 적게 합니다. 그래서 코드를 읽는 사람이 add_bonus(&mut a, 5)만 보고도 a가 바뀐다는 것을 압니다. Python의 add_bonus_in_place(a, 5)는 이름 말고는 단서가 없고, C의 add_bonus(a, 2, 5)는 const가 없다는 선언을 찾아봐야 압니다."
    commonMistakes:
      - "함수 쪽을 &[i32]로 바꿔 *x += bonus에서 다른 오류가 남"
      - "let mut를 지워 E0596 오류가 남"
    language: rust
    verification: run
  - id: ex-day44-independent
    title: C로 가변 인자 최댓값 함수 만들기
    kind: independent
    objective: 개수를 먼저 받고 va_arg로 나머지를 읽는 가변 인자 함수를 만든다.
    prompt: "int max_of(int count, ...)를 만들어 count개의 int 중 가장 큰 값을 돌려주세요. max_of(4, 3, 9, 2, 7)로 '9'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 max_of를 만들어 호출하세요\n");
          return 0;
      }
    answer: |-
      #include <stdarg.h>
      #include <stdio.h>

      int max_of(int count, ...) {
          va_list ap;
          va_start(ap, count);
          int best = va_arg(ap, int);
          for (int i = 1; i < count; i++) {
              int x = va_arg(ap, int);
              if (x > best) {
                  best = x;
              }
          }
          va_end(ap);
          return best;
      }

      int main(void) {
          printf("%d\n", max_of(4, 3, 9, 2, 7));
          return 0;
      }
    output: "9"
    hint: "va_start로 시작하고, va_arg(ap, int)로 하나씩 꺼내고, va_end로 끝냅니다. 첫 값을 best로 두고 나머지와 비교하세요."
    explanation: "C의 가변 인자 함수는 인자가 몇 개인지, 어떤 자료형인지 스스로 알 수 없습니다. 그래서 개수를 첫 인자로 받거나(max_of), 형식 문자열로 알려 줍니다(printf). count를 실제보다 크게 주거나 double을 넘기면 정의되지 않은 동작이고, 컴파일러는 막지 못합니다(printf는 컴파일러가 특별히 검사해 줍니다). count가 0이면 첫 va_arg부터 잘못이므로, 실전에서는 0을 따로 처리합니다."
    commonMistakes:
      - "va_end를 빠뜨림"
      - "va_arg(ap, char)처럼 int보다 작은 자료형을 꺼내 정의되지 않은 동작이 됨(작은 정수는 int로 넘어온다)"
    language: c
    verification: run
quiz:
  - id: quiz-day44-01
    question: xs = [3, 1, 2]; ys = xs.sort() 뒤의 ys는?
    choices:
      - "[1, 2, 3]"
      - None
      - "[3, 1, 2]"
      - 오류
    answerIndex: 1
    explanation: 리스트를 제자리에서 바꾸는 메서드(sort, reverse, append, extend)는 None을 돌려줍니다. '바꿨으니 결과는 원래 객체에 있다'는 신호입니다. 정렬된 새 리스트가 필요하면 sorted(xs)를 씁니다.
  - id: quiz-day44-02
    question: 생성자에서 self.members = members로 받은 리스트를 그대로 저장하면 생기는 문제는?
    choices:
      - 문제없다
      - 부른 쪽이 나중에 그 리스트를 바꾸면 객체 안의 목록도 함께 바뀐다
      - 리스트가 복사되어 메모리를 두 배로 쓴다
      - 오류가 난다
    answerIndex: 1
    explanation: 두 이름이 같은 리스트를 가리키는 별칭이 됩니다. 객체가 자기 상태를 스스로 관리하려면 self.members = list(members)처럼 복사해 저장합니다(방어적 복사). Rust는 Vec을 옮겨 받으므로 부른 쪽이 더는 바꿀 수 없습니다.
  - id: quiz-day44-03
    question: def total(*nums, start=0)에서 total(1, 2, 10)을 부르면 start는?
    choices:
      - "10"
      - 0(10은 nums에 들어간다)
      - 오류
      - "1"
    answerIndex: 1
    explanation: "*nums 뒤의 매개변수는 이름으로만 줄 수 있습니다(키워드 전용). 위치 인자는 모두 nums로 모이므로 start를 바꾸려면 total(1, 2, start=10)으로 써야 합니다. 실수로 순서만 보고 인자를 넘기는 것을 막아 줍니다."
  - id: quiz-day44-04
    question: C의 int total(int count, ...)에 대한 설명으로 옳은 것은?
    choices:
      - 컴파일러가 인자 개수와 자료형을 검사한다
      - 함수는 인자 개수·자료형을 스스로 알 수 없어서 count 같은 약속에 기대며, 틀리면 정의되지 않은 동작이다
      - 인자는 배열로 전달된다
      - Rust와 같다
    answerIndex: 1
    explanation: stdarg.h의 va_list는 인자들을 차례로 꺼낼 뿐, 몇 개인지와 무슨 자료형인지는 약속으로 정합니다. printf는 형식 문자열로 이를 알려 주고, gcc가 형식을 특별히 검사해 줍니다. 직접 만든 가변 인자 함수에는 그런 검사가 없습니다.
  - id: quiz-day44-05
    question: Rust에 가변 인자 함수가 없는 대신 쓰는 방법은?
    choices:
      - 전역 변수
      - 슬라이스(&[T])를 받거나, println!처럼 매크로를 쓴다
      - 가변 인자 함수를 쓸 수 있다
      - 인자를 쓰지 않는다
    answerIndex: 1
    explanation: 여러 값을 받는 함수는 total(&[1, 2, 3])처럼 슬라이스를 받습니다. 자료형과 개수가 모두 검사됩니다. println!, vec!, format!은 함수가 아니라 컴파일할 때 코드를 만들어 내는 매크로라서 인자 수가 자유롭습니다.
---

## 1. 오늘 배울 내용

Day 42에서 "무엇이 복사되고 무엇이 공유되는가"를 정리했습니다. 오늘은 그 지식을 **함수 설계**에 적용합니다. 제목의 "가변 인자"에는 두 가지 뜻이 있고, 둘 다 다룹니다.

1. **바꿀 수 있는(mutable) 인자**: 리스트·사전을 받은 함수가 그것을 바꿀 때
   - 제자리 메서드가 `None`을 돌려주는 관례: `list.sort()`와 `sorted()`
   - 받은 것을 **바꾸는 함수**와 **새로 만들어 돌려주는 함수** 구별하기
   - 받은 리스트를 저장할 때의 **방어적 복사**
2. **개수가 자유로운(variadic) 인자**
   - `*args`: 나머지 위치 인자를 **튜플**로
   - `**kwargs`: 이름 붙은 인자를 **사전**으로
   - `*` 뒤의 매개변수는 이름으로만 줄 수 있음
   - `*리스트`, `**사전`으로 펼쳐 넘기기
3. 다른 두 언어
   - C: `const` 매개변수로 의도 표시, `stdarg.h`의 가변 인자 함수
   - Rust: `&`, `&mut`, 이동으로 의도 표시, 가변 인자 대신 슬라이스와 매크로
4. 장바구니에 물건을 담고 영수증을 만드는 프로그램을 Python과 Rust로 만듭니다.

## 2. 왜 필요한가

함수를 부르는 사람이 가장 알고 싶은 것은 "이 함수가 내 데이터를 바꾸는가?"입니다.

- `top3(scores)`를 불렀더니 `scores`까지 정렬되어 있으면, 뒤의 코드가 원래 순서를 기대하다 틀립니다.
- 팀 객체에 명단을 넘긴 뒤 명단을 고쳤더니 팀 명단도 바뀌어 있습니다.
- 반대로 `normalize(data)`가 새 리스트를 돌려주는데 반환값을 버리면, 아무 일도 일어나지 않은 것처럼 보입니다.

Python은 이런 의도를 자료형으로 표시하지 않기 때문에, **이름·반환값·문서**로 드러내는 관례가 중요합니다. Rust는 `&`와 `&mut`로, C는 `const`로 같은 정보를 선언에 적습니다.

인자 개수가 자유로운 함수도 흔합니다. `print`, `max`, `format`, 로그 함수처럼 "몇 개든 받는" 함수를 만들 줄 알아야 편한 도구를 만들 수 있습니다.

## 3. 그림으로 이해하기

**바꾸는 함수와 새로 만드는 함수.**

```text
add_bonus_in_place(a, 5)             with_bonus(a, 5)
a ──┐                                a ───▶ [65, 75]   (그대로)
    ├──▶ [60, 70] → [65, 75]
xs ─┘    (같은 리스트를 바꿈)          반환 ───▶ [70, 80]  (새 리스트)
반환: None
```

**방어적 복사.**

```text
self.members = members                self.members = list(members)
names ─────┐                          names ──────────▶ [민지, 준호, 서연]
           ├──▶ [민지, 준호, 서연]
team.members ┘  (나중 변경이 보임)      team.members ──▶ [민지, 준호]   (따로)
```

**`*args`와 `**kwargs`가 모으는 곳.**

```text
describe("모모", 저자="엔데", 쪽수=304)
          │       └──────┬──────┘
          ▼              ▼
       title       info = {"저자": "엔데", "쪽수": 304}

total(1, 2, 3, start=10)
      └──┬──┘   └──┬──┘
         ▼         ▼
 nums = (1, 2, 3)  start = 10    ← *nums 뒤의 start는 이름으로만
```

## 4. 천천히 풀어보기

### 4.1 제자리 함수와 값 함수

| 종류        | 하는 일                            | 반환값       | 예                                              |
| ----------- | ---------------------------------- | ------------ | ----------------------------------------------- |
| 제자리 함수 | 받은 객체를 바꿈                   | `None`(관례) | `list.sort()`, `list.append()`, `dict.update()` |
| 값 함수     | 받은 객체는 그대로, 새 객체를 만듦 | 새 객체      | `sorted()`, `reversed()`, `str.upper()`         |

두 종류를 섞으면(받은 것도 바꾸고 결과도 돌려주면) 부르는 사람이 부작용을 놓치기 쉽습니다. 이름에도 드러내세요. 예: `normalize_in_place(xs)` / `normalized(xs)`.

### 4.2 방어적 복사

- 받은 리스트를 **저장**하는 함수(생성자 등)는 복사해서 저장합니다: `self.items = list(items)`
- 저장한 리스트를 **돌려주는** 메서드도 복사본을 돌려주거나 튜플로 돌려주면, 바깥에서 몰래 바꾸지 못합니다.
- 반대로 크기가 큰 데이터를 "넘겨주고 더는 쓰지 않는" 경우라면 복사는 낭비입니다. 문서에 "넘긴 리스트를 가져간다"고 적습니다. Rust의 이동이 바로 이것입니다.

### 4.3 인자를 받는 모양 전체

```python
def f(a, b=2, *args, c, d=4, **kwargs):
    ...
```

| 매개변수   | 받는 것                                |
| ---------- | -------------------------------------- |
| `a`        | 위치 또는 이름으로(필수)               |
| `b=2`      | 위치 또는 이름으로(선택)               |
| `*args`    | 남은 위치 인자 전부(튜플)              |
| `c`        | 이름으로만(필수) — `*args` 뒤에 있어서 |
| `d=4`      | 이름으로만(선택)                       |
| `**kwargs` | 남은 이름 붙은 인자 전부(사전)         |

부를 때는 **위치 인자를 먼저, 이름 붙은 인자를 나중에** 씁니다. `*리스트`는 위치 인자로, `**사전`은 이름 붙은 인자로 펼쳐집니다.

`*args`가 튜플이라는 점도 기억하세요. 함수가 받은 인자 묶음을 실수로 바꿀 수 없습니다.

### 4.4 C와 Rust에서는

- **C**: 읽기만 하는 포인터에는 `const`를 붙입니다. 가변 인자 함수는 `...`로 선언하고 `va_list`, `va_start`, `va_arg`, `va_end`로 하나씩 꺼냅니다. 개수와 자료형은 **약속**이라 틀려도 컴파일러가 모릅니다.
- **Rust**: 읽기는 `&T`, 바꾸기는 `&mut T`, 가져가기는 `T`(이동)로 선언하고, 부르는 곳에도 `&`, `&mut`를 적습니다. 가변 인자 함수는 없고, 슬라이스 `&[T]`를 받거나 매크로(`println!`, `vec!`)를 씁니다.

## 5. Python으로 구현하기

```python
# 파일: mutable_args.py
print("1) 제자리 메서드는 None을 돌려준다")
scores = [72, 95, 61]
result = scores.sort()                      # 제자리 정렬: 반환값은 None
print("  sort():", result, scores)
other = [3, 1, 2]
print("  sorted():", sorted(other), "원본", other)   # 새 리스트를 돌려준다


print("2) 받은 리스트를 바꾸는 함수와 새로 만드는 함수")


def add_bonus_in_place(xs, bonus):
    for i in range(len(xs)):
        xs[i] += bonus                      # 부작용: 부른 쪽이 바뀐다
    # 반환값 없음 → 이름과 None으로 '제자리'임을 알린다


def with_bonus(xs, bonus):
    return [x + bonus for x in xs]          # 부작용 없음


a = [60, 70]
add_bonus_in_place(a, 5)
b = with_bonus(a, 5)
print("  제자리:", a, "새 리스트:", b, "a는 그대로:", a)


print("3) 받은 리스트는 복사해서 저장한다")


class Team:
    def __init__(self, members):
        self.members = list(members)        # 복사해서 저장(방어적 복사)


names = ["민지", "준호"]
team = Team(names)
names.append("서연")                         # 부른 쪽이 나중에 바꿔도
print("  team:", team.members, "names:", names)


print("4) *args와 **kwargs")


def total(*nums, start=0):                  # nums는 튜플, start는 이름으로만 줄 수 있다
    return start + sum(nums)


def describe(title, **info):                # info는 사전
    parts = [f"{k}={v}" for k, v in info.items()]
    return f"{title}(" + ", ".join(parts) + ")"


print("  total:", total(1, 2, 3), total(1, 2, start=10), total())
print("  펼치기:", total(*[4, 5, 6]))
print("  describe:", describe("모모", 저자="엔데", 쪽수=304))
options = {"저자": "생텍쥐페리", "쪽수": 120}
print("  사전 펼치기:", describe("어린 왕자", **options))
print("  total(1, 2, 10):", total(1, 2, 10))   # 10은 start가 아니라 숫자 하나로 더해진다


def keep(*items):
    items.append("x")                       # items는 튜플이라 바꿀 수 없다


try:
    keep("a", "b")
except AttributeError as e:
    print("  AttributeError:", e)
```

실행 결과:

```text
1) 제자리 메서드는 None을 돌려준다
  sort(): None [61, 72, 95]
  sorted(): [1, 2, 3] 원본 [3, 1, 2]
2) 받은 리스트를 바꾸는 함수와 새로 만드는 함수
  제자리: [65, 75] 새 리스트: [70, 80] a는 그대로: [65, 75]
3) 받은 리스트는 복사해서 저장한다
  team: ['민지', '준호'] names: ['민지', '준호', '서연']
4) *args와 **kwargs
  total: 6 13 0
  펼치기: 15
  describe: 모모(저자=엔데, 쪽수=304)
  사전 펼치기: 어린 왕자(저자=생텍쥐페리, 쪽수=120)
  total(1, 2, 10): 13
  AttributeError: 'tuple' object has no attribute 'append'
```

### 코드 한 부분씩 읽기

| 코드                                                    | 설명                                                                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `result = scores.sort()`                                | `sort`는 제자리에서 정렬하고 `None`을 돌려줍니다. `scores = scores.sort()`로 쓰면 리스트를 잃습니다.                                       |
| `def add_bonus_in_place(xs, bonus)`                     | 인덱스로 칸에 대입해 부른 쪽 리스트를 바꿉니다. 반환값이 없어 `None`입니다.                                                                |
| `def with_bonus(xs, bonus)`                             | 새 리스트를 만들어 돌려줍니다. 받은 리스트는 그대로입니다.                                                                                 |
| `self.members = list(members)`                          | 받은 리스트를 복사해서 저장했습니다. 뒤에서 `names.append("서연")`을 해도 `team.members`는 그대로입니다.                                   |
| `def total(*nums, start=0)`                             | 위치 인자는 모두 `nums` 튜플로 모이고, `start`는 이름으로만 줄 수 있습니다. `total()`처럼 아무것도 안 줘도 `nums`는 빈 튜플이라 0입니다.   |
| `def describe(title, **info)`                           | `저자="엔데"` 같은 이름 붙은 인자가 사전 `info`로 모입니다. 사전은 넣은 순서를 기억해서 출력 순서가 호출 순서와 같습니다.                  |
| `total(*[4, 5, 6])`, `describe("어린 왕자", **options)` | 리스트를 위치 인자로, 사전을 이름 붙은 인자로 펼쳐 넘겼습니다.                                                                             |
| `total(1, 2, 10)`                                       | 10은 `start`가 아니라 `nums`의 세 번째 값이라 결과가 13입니다. 이름으로만 받는 인자 덕분에 "순서를 착각해 `start`에 넣는" 실수가 없습니다. |
| `items.append("x")` → `AttributeError`                  | `*items`는 튜플이라 바꿀 수 없습니다.                                                                                                      |

## 6. C로 구현하기

```c
// 파일: args_in_c.c
#include <stdarg.h>
#include <stdio.h>

int sum(const int a[], int n) {             // const: 읽기만 한다는 약속
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}

void add_bonus(int a[], int n, int bonus) { // const 없음: 바꾼다는 뜻
    for (int i = 0; i < n; i++) {
        a[i] += bonus;
    }
}

int total(int count, ...) {                 // 개수를 먼저 받고, 나머지는 몇 개든
    va_list ap;
    va_start(ap, count);
    int s = 0;
    for (int i = 0; i < count; i++) {
        s += va_arg(ap, int);               // 자료형을 부르는 쪽과 똑같이 맞춰야 한다
    }
    va_end(ap);
    return s;
}

int main(void) {
    int a[] = {60, 70};
    add_bonus(a, 2, 5);
    printf("add_bonus 뒤: %d %d, 합 %d\n", a[0], a[1], sum(a, 2));
    printf("total: %d %d %d\n", total(3, 1, 2, 3), total(1, 42), total(0));
    printf("printf도 가변 인자 함수: %s %d %.1f\n", "모모", 304, 4.5);
    return 0;
}
```

실행 결과:

```text
add_bonus 뒤: 65 75, 합 140
total: 6 42 0
printf도 가변 인자 함수: 모모 304 4.5
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `int sum(const int a[], int n)`             | `const`가 "읽기만 한다"는 약속입니다. 안에서 `a[i] = 0`을 쓰면 컴파일 오류입니다.                                                                |
| `void add_bonus(int a[], int n, int bonus)` | `const`가 없으니 바꿀 수 있다는 뜻입니다. 선언만 보고 부작용을 알 수 있게 하는 C의 관례입니다.                                                   |
| `int total(int count, ...)`                 | `...`는 "여기부터 몇 개든"입니다. 앞에 최소 하나의 이름 있는 매개변수가 있어야 합니다.                                                           |
| `va_start(ap, count);`                      | 마지막 이름 있는 매개변수(`count`) 뒤부터 꺼낼 준비를 합니다.                                                                                    |
| `va_arg(ap, int)`                           | 다음 인자를 `int`로 꺼냅니다. 부르는 쪽이 `double`을 넘겼다면 엉뚱한 값이 나옵니다. 검사는 없습니다.                                             |
| `va_end(ap);`                               | 꺼내기를 끝냅니다. `va_start`와 짝으로 씁니다.                                                                                                   |
| `printf(...)`                               | `printf`도 같은 방식의 가변 인자 함수이고, 형식 문자열의 `%d`, `%s`가 개수와 자료형을 알려 줍니다. gcc는 `printf`의 형식을 특별히 검사해 줍니다. |

## 7. Rust로 구현하기

```rust
// 파일: args_in_rust.rs
fn sum(xs: &[i32]) -> i32 {                 // 읽기만: 공유 빌림
    xs.iter().sum()
}

fn add_bonus(xs: &mut [i32], bonus: i32) {  // 바꾼다: 가변 빌림(부르는 곳에도 &mut)
    for x in xs.iter_mut() {
        *x += bonus;
    }
}

fn with_bonus(xs: &[i32], bonus: i32) -> Vec<i32> {
    xs.iter().map(|x| x + bonus).collect()
}

struct Team {
    members: Vec<String>,                   // 받은 Vec의 주인이 된다(이동)
}

fn total(nums: &[i32], start: i32) -> i32 { // 가변 인자 대신 슬라이스
    start + nums.iter().sum::<i32>()
}

fn main() {
    let mut a = vec![60, 70];
    add_bonus(&mut a, 5);
    let b = with_bonus(&a, 5);
    println!("제자리: {a:?}, 새 Vec: {b:?}, 합 {}", sum(&a));

    let names = vec![String::from("민지"), String::from("준호")];
    let team = Team { members: names };     // names는 옮겨져 더 이상 바꿀 수 없다
    println!("team: {:?}", team.members);

    println!("total: {} {} {}", total(&[1, 2, 3], 0), total(&[1, 2], 10), total(&[], 0));
    println!("println!도 매크로라 인자 수가 자유롭다: {} {} {}", "모모", 304, 4.5);
}
```

실행 결과:

```text
제자리: [65, 75], 새 Vec: [70, 80], 합 140
team: ["민지", "준호"]
total: 6 13 0
println!도 매크로라 인자 수가 자유롭다: 모모 304 4.5
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn sum(xs: &[i32])`                       | 공유 빌림이라 읽기만 합니다. Python의 값 함수, C의 `const`에 해당하지만 컴파일러가 강제합니다.                                                  |
| `fn add_bonus(xs: &mut [i32], bonus: i32)` | 가변 빌림입니다. 부르는 곳에서도 `add_bonus(&mut a, 5)`로 써야 해서, 호출하는 줄만 보고도 `a`가 바뀐다는 것을 알 수 있습니다.                   |
| `Team { members: names }`                  | `Vec`을 **옮겨** 받았습니다. `names`는 더 이상 쓸 수 없으니 방어적 복사가 필요 없습니다. 부른 쪽이 계속 쓰고 싶다면 `names.clone()`을 넘깁니다. |
| `fn total(nums: &[i32], start: i32)`       | 가변 인자 대신 슬라이스를 받습니다. `total(&[1, 2, 3], 0)`처럼 부르고, 개수와 자료형이 모두 검사됩니다.                                         |
| `println!(...)`                            | `!`가 붙은 것은 매크로입니다. 컴파일할 때 인자 수에 맞는 코드를 만들어 내고, 형식 문자열과 인자 개수가 맞는지도 검사합니다.                     |

## 8. 실행 추적

`describe("어린 왕자", **options)`가 불릴 때 인자가 어떻게 연결되는지 따라갑니다.

| 단계                       | `title`                                  | `info`                                   |
| -------------------------- | ---------------------------------------- | ---------------------------------------- |
| `**options`를 펼침         |                                          | (`저자="생텍쥐페리", 쪽수=120`으로 바뀜) |
| 위치 인자 연결             | `"어린 왕자"`                            |                                          |
| 남은 이름 붙은 인자를 모음 |                                          | `{"저자": "생텍쥐페리", "쪽수": 120}`    |
| `parts` 만들기             |                                          | `["저자=생텍쥐페리", "쪽수=120"]`        |
| 반환                       | `"어린 왕자(저자=생텍쥐페리, 쪽수=120)"` |                                          |

`info`는 `options`를 펼쳐서 **새로 만든** 사전입니다. 함수 안에서 `info`를 바꿔도 `options`는 그대로입니다.

## 9. 다른 예제로 다시 이해하기

**장바구니와 영수증.** 장바구니 사전에 물건을 몇 개든 한 번에 담는 `add_items`, 물건을 빼는 `remove_item`, 가격표를 받아 영수증을 만드는 `receipt`를 만듭니다. 세 함수가 장바구니를 **바꾸는지, 읽기만 하는지**를 이름과 반환값으로 드러냅니다.

```python
# 파일: cart.py
def make_cart(initial=None):                # 기본값으로 {}를 쓰지 않는다(Day 31)
    return dict(initial) if initial else {}


def add_items(cart, *items, qty=1):         # cart를 바꾼다(반환값 없음)
    for item in items:
        cart[item] = cart.get(item, 0) + qty


def remove_item(cart, item):                # 바꾸고, 성공 여부만 돌려준다
    if item not in cart:
        return False
    del cart[item]
    return True


def receipt(cart, **prices):                # 읽기만 한다
    lines = []
    total = 0
    for item in sorted(cart):
        cost = cart[item] * prices.get(item, 0)
        total += cost
        lines.append(f"  {item} x{cart[item]} = {cost}원")
    return "\n".join(lines + [f"  합계 {total}원"])


prices = {"사과": 1200, "배": 2500, "우유": 1800}
mine = make_cart()
add_items(mine, "사과", "우유")
add_items(mine, "사과", qty=3)
print("내 장바구니:", mine)

friend = make_cart(mine)                    # 복사해서 시작: 서로 독립
add_items(friend, "배", qty=2)
print("삭제 성공?", remove_item(friend, "우유"), remove_item(friend, "귤"))
print("친구:", friend, "/ 내 것은 그대로:", mine)
print(receipt(mine, **prices))
```

실행 결과:

```text
내 장바구니: {'사과': 4, '우유': 1}
삭제 성공? True False
친구: {'사과': 4, '배': 2} / 내 것은 그대로: {'사과': 4, '우유': 1}
  사과 x4 = 4800원
  우유 x1 = 1800원
  합계 6600원
```

| 코드                                   | 설명                                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `def make_cart(initial=None)`          | 기본값으로 `{}`를 쓰면 모든 장바구니가 같은 사전을 공유합니다(Day 31). `None`으로 받고 안에서 새로 만듭니다.                                      |
| `dict(initial) if initial else {}`     | 받은 사전을 복사해 시작합니다. 그래서 `friend`에 담아도 `mine`은 그대로입니다.                                                                    |
| `def add_items(cart, *items, qty=1)`   | 물건 이름은 몇 개든 `items` 튜플로, 개수는 이름으로만 받습니다. `add_items(mine, "사과", 3)`처럼 쓰면 3이 물건 이름으로 들어가는 실수를 막습니다. |
| `cart[item] = cart.get(item, 0) + qty` | 없으면 0에서 시작해 더합니다. 장바구니를 제자리에서 바꾸고 아무것도 돌려주지 않습니다.                                                            |
| `def remove_item(cart, item)`          | 바꾸는 함수지만, 성공 여부는 알려 줄 가치가 있어 `bool`을 돌려줍니다. 결과 값이 아니라 **상태**만 알리는 반환입니다.                              |
| `def receipt(cart, **prices)`          | 가격표를 이름 붙은 인자로 받습니다. `receipt(mine, **prices)`처럼 사전을 펼쳐 넘깁니다. 장바구니는 읽기만 합니다.                                 |
| `for item in sorted(cart)`             | 이름 순으로 출력해 결과가 항상 같습니다. 장바구니 자체는 정렬하지 않습니다.                                                                       |

같은 설계를 Rust로 옮기면, "바꾸는가"가 자료형에 그대로 나타납니다.

```rust
// 파일: cart.rs
use std::collections::BTreeMap;

type Cart = BTreeMap<String, u32>;          // 이름 순으로 정렬되는 사전

fn add_items(cart: &mut Cart, items: &[&str], qty: u32) {
    for item in items {
        *cart.entry(item.to_string()).or_insert(0) += qty;
    }
}

fn remove_item(cart: &mut Cart, item: &str) -> bool {
    cart.remove(item).is_some()
}

fn receipt(cart: &Cart, prices: &BTreeMap<&str, u32>) -> String {
    let mut lines = Vec::new();
    let mut total = 0;
    for (item, &count) in cart {
        let cost = count * prices.get(item.as_str()).copied().unwrap_or(0);
        total += cost;
        lines.push(format!("  {item} x{count} = {cost}원"));
    }
    lines.push(format!("  합계 {total}원"));
    lines.join("\n")
}

fn main() {
    let prices = BTreeMap::from([("사과", 1200), ("배", 2500), ("우유", 1800)]);
    let mut mine = Cart::new();
    add_items(&mut mine, &["사과", "우유"], 1);
    add_items(&mut mine, &["사과"], 3);
    println!("내 장바구니: {mine:?}");

    let mut friend = mine.clone();          // 복사해서 시작: 서로 독립
    add_items(&mut friend, &["배"], 2);
    println!("삭제 성공? {} {}", remove_item(&mut friend, "우유"), remove_item(&mut friend, "귤"));
    println!("친구: {friend:?} / 내 것은 그대로: {mine:?}");
    println!("{}", receipt(&mine, &prices));
}
```

실행 결과:

```text
내 장바구니: {"사과": 4, "우유": 1}
삭제 성공? true false
친구: {"배": 2, "사과": 4} / 내 것은 그대로: {"사과": 4, "우유": 1}
  사과 x4 = 4800원
  우유 x1 = 1800원
  합계 6600원
```

- `add_items(cart: &mut Cart, ...)`, `remove_item(cart: &mut Cart, ...)`, `receipt(cart: &Cart, ...)`: 선언만 보면 어느 함수가 장바구니를 바꾸는지 압니다.
- 물건 여러 개는 `&["사과", "우유"]` 슬라이스로 넘깁니다. `*items`에 해당합니다.
- `*cart.entry(...).or_insert(0) += qty;`는 "없으면 0을 넣고, 그 칸을 가변으로 빌려 더하기"입니다. Python의 `cart.get(item, 0) + qty`와 같은 일을 사전을 한 번만 찾아서 합니다.
- `mine.clone()`으로 친구 장바구니를 복사했습니다. 그냥 `let friend = mine;`이면 `mine`이 옮겨져 뒤에서 쓸 수 없습니다.
- `BTreeMap`은 열쇠 순서로 정렬되어서, 친구 장바구니의 `"배"`가 `"사과"`보다 앞에 출력됩니다. Python 사전은 넣은 순서를 따릅니다.

## 10. 함수의 의도를 드러내는 방법

| 의도                         | Python                          | C                            | Rust                           |
| ---------------------------- | ------------------------------- | ---------------------------- | ------------------------------ |
| 읽기만 한다                  | 문서, 값 함수 이름, 튜플로 받기 | `const T *`                  | `&T`, `&[T]`                   |
| 제자리에서 바꾼다            | 이름(`_in_place`), `None` 반환  | `T *`(const 없음)            | `&mut T`(부르는 곳에도 `&mut`) |
| 받은 것을 가져간다           | 문서("넘긴 리스트를 가져간다")  | 문서("free 책임이 넘어간다") | `T`(이동)                      |
| 받은 것을 저장하되 따로 둔다 | `list(xs)`로 복사               | 깊은 복사                    | `clone()`한 것을 넘김          |
| 몇 개든 받는다               | `*args`, `**kwargs`             | `...` + `va_list`(검사 없음) | `&[T]`, 매크로                 |

## 11. 세 언어 비교

| 관점                 | Python                          | C                               | Rust                           |
| -------------------- | ------------------------------- | ------------------------------- | ------------------------------ |
| 부작용이 드러나는 곳 | 이름·문서·반환값 관례           | 선언의 `const` 유무             | 선언과 호출 모두(`&mut`)       |
| 부작용 검사          | 없음                            | `const`로 받은 것을 바꾸면 오류 | 컴파일러가 강제                |
| 가변 인자            | `*args`(튜플), `**kwargs`(사전) | `...`, 개수·자료형은 약속       | 없음(슬라이스, 매크로)         |
| 이름 붙은 인자       | 있음(`f(start=10)`)             | 없음                            | 없음(구조체나 빌더로 흉내)     |
| 기본값 인자          | 있음(바꿀 수 있는 기본값 주의)  | 없음                            | 없음(`Option`이나 `Default`로) |

## 12. 자주 하는 실수

### 실수 1: 제자리 메서드의 결과를 쓴다 (Python)

```python
# 파일: sort_result.py (실행 오류: TypeError)
scores = [72, 95, 61]
for s in scores.sort():
    print(s)
```

`sort()`는 `None`을 돌려줍니다. `scores.sort()` 뒤에 `for s in scores:`로 쓰거나, `for s in sorted(scores):`로 쓰세요.

### 실수 2: 이름 붙은 인자 뒤에 위치 인자를 쓴다 (Python)

```python
# 파일: keyword_order.py (실행 오류: SyntaxError)
def total(*nums, start=0):
    return start + sum(nums)


print(total(start=1, 2))
```

부를 때는 위치 인자가 먼저입니다. `total(2, start=1)`로 쓰세요. 이 오류는 실행 전에 문법 검사에서 걸립니다.

### 실수 3: 받은 리스트를 복사하지 않고 저장한다 (Python)

`self.members = members`는 부른 쪽과 같은 리스트를 공유합니다. 객체가 자기 상태를 지켜야 한다면 `list(members)`로 복사하세요. 오늘 Python 예제의 3번이 올바른 모양입니다.

### 실수 4: &mut 자리에 &를 넘긴다 (Rust)

```rust
// 파일: shared_for_mut.rs (컴파일 오류: E0308)
fn add_bonus(xs: &mut [i32], bonus: i32) {
    for x in xs.iter_mut() {
        *x += bonus;
    }
}

fn main() {
    let mut a = vec![60, 70];
    add_bonus(&a, 5);
    println!("{a:?}");
}
```

실습의 디버그 문제입니다. 바꾸는 호출은 `&mut a`로 넘기세요.

### 실수 5: 가변 인자 함수에 약속과 다른 자료형을 넘긴다 (C)

`total(2, 1.5, 2.5)`처럼 `double`을 넘기면 `va_arg(ap, int)`가 엉뚱한 값을 꺼냅니다. 컴파일러는 알려 주지 않습니다. 가능하면 가변 인자 대신 배열과 길이(`sum(a, n)`)를 받는 함수를 쓰세요.

## 13. Q&A

**Q. Python에서 함수가 인자를 바꾸지 못하게 강제할 수 있나요?**

A. 강제하는 문법은 없습니다. 튜플이나 `frozenset`처럼 바꿀 수 없는 자료형으로 넘기거나, 타입 힌트에 `Sequence[int]`(읽기 전용 목록이라는 뜻)를 적어 도구(mypy 등)가 검사하게 할 수 있습니다. 대부분은 관례와 문서로 약속합니다.

**Q. \*args와 \*\*kwargs는 언제 쓰나요?**

A. 인자 개수가 정말 자유로운 함수(합계, 로그, 문자열 합치기)나, 받은 인자를 다른 함수에 그대로 전달하는 함수(감싸는 함수, 데코레이터)에서 씁니다. 인자가 정해져 있는 함수까지 `**kwargs`로 받으면 무엇을 넘겨야 하는지 알기 어려워지니, 필요한 곳에만 쓰세요.

**Q. Rust에서 이름 붙은 인자나 기본값을 흉내 내려면요?**

A. 설정이 많은 함수는 설정용 구조체를 만들어 넘깁니다. `Default`를 구현해 두면 `Options { verbose: true, ..Default::default() }`처럼 필요한 것만 바꿀 수 있습니다(Day 52). 선택적인 값 하나는 `Option<T>` 매개변수로 받습니다.

**Q. C에서 가변 인자 함수가 위험하다면, printf는 왜 괜찮나요?**

A. `printf`도 원리상 같은 위험이 있습니다. 다만 너무 널리 쓰여서 gcc와 clang이 형식 문자열을 특별히 해석해 인자와 맞는지 검사해 줍니다(`-Wformat`, `-Wall`에 포함). 직접 만든 함수도 `__attribute__((format(printf, ...)))`로 같은 검사를 받게 할 수 있지만, 표준 C는 아닙니다.

## 14. 핵심 요약

- 함수를 설계할 때 "받은 것을 **바꾸는가**, **새로 만들어** 돌려주는가"를 정하고, 섞지 마세요. 제자리 함수는 `None`을 돌려주는 것이 Python의 관례입니다(`sort` / `sorted`).
- 받은 리스트·사전을 객체에 저장할 때는 **복사해서** 저장해 별칭을 막습니다.
- `*args`는 남은 위치 인자를 **튜플**로, `**kwargs`는 이름 붙은 인자를 **사전**으로 모읍니다. `*args` 뒤의 매개변수는 이름으로만 줄 수 있고, `*리스트`·`**사전`으로 펼쳐 넘깁니다.
- C는 `const`로 읽기 전용을 표시하고, `...`과 `va_list`로 가변 인자 함수를 만들지만 개수·자료형은 약속일 뿐입니다.
- Rust는 `&`(읽기), `&mut`(바꾸기), `T`(가져가기)로 의도를 선언하고 부르는 곳에도 적게 합니다. 가변 인자 대신 슬라이스와 매크로를 씁니다.

## 15. 도전 문제

1. **(Python)** `def merge_counts(*dicts)`로 여러 사전의 값을 열쇠별로 더한 **새** 사전을 돌려주세요. 받은 사전은 하나도 바뀌지 않아야 합니다.
2. **(Python)** 장바구니 예제에 `def apply_coupon(cart, *, percent)`(이름으로만 받는 `percent`)를 추가해, 영수증 합계에서 할인을 적용하는 **새** 영수증을 만들어 보세요.
3. **(C)** `double average_of(int count, ...)`을 만들고, 정수 대신 실수를 받도록 `va_arg(ap, double)`로 바꿔 보세요. `average_of(3, 1.0, 2.0, 4.5)`로 확인합니다. `average_of(2, 1, 2)`처럼 정수를 넘기면 무슨 일이 생기는지도 생각해 보세요.
4. **(Rust)** 장바구니 예제의 `add_items`를 `fn add_items(cart: &mut Cart, items: &[(&str, u32)])`로 바꿔, 물건마다 개수를 따로 줄 수 있게 하세요.
