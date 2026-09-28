---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-29-references-borrowing
courseId: crp-92
phaseId: phase-04
dayNumber: 29
date: "2026-10-29"
title: 포인터 · 참조 · 빌림 — 같은 값을 바라보는 세 방식
summary: 변수의 값과 그 값이 있는 메모리 위치(주소)를 구별하고, C 포인터의 &(주소 얻기)와 *(가리키는 곳의 값), NULL, 포인터로 부른 쪽 변수를 바꾸는 함수를 손으로 추적합니다. 같은 일을 Python에서는 이름이 객체를 가리키는 참조로, Rust에서는 빌림(&와 &mut)으로 하는 방법을 비교하고, Rust가 '공유 빌림은 여러 개, 가변 빌림은 하나'라는 규칙으로 어떤 버그를 컴파일할 때 막는지 확인합니다. 두 계좌 사이의 이체 함수로 연습합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-28-vec-review]
learningObjectives:
  - 변수의 값과 메모리 주소를 구분하고, C의 &와 *의 뜻을 설명한다.
  - 포인터 변수를 선언하고 역참조로 가리키는 값을 읽고 바꾸며, NULL 포인터를 검사한다.
  - 포인터를 받는 함수(swap, transfer)가 부른 쪽 변수를 바꾸는 과정을 추적한다.
  - Python에서 같은 객체를 공유할 때 변경이 보이는 경우와 이름을 새로 묶는 경우를 구별한다.
  - Rust의 공유 빌림(&)과 가변 빌림(&mut) 규칙이 막는 오류를 설명한다.
concepts:
  [
    pointer,
    address,
    address of,
    dereference,
    null pointer,
    reference,
    aliasing,
    borrowing,
    shared borrow,
    mutable borrow,
    pass by pointer,
  ]
runnerMode: python
playgroundSource: |
  # 파일: references.py — 어떤 줄이 원본을 바꾸는지 확인해 보세요.
  a = [1, 2, 3]
  b = a            # 같은 리스트
  c = a[:]         # 복사본
  b.append(4)
  c.append(5)
  print(a, b, c, a is b, a is c)

  def rebind(xs):
      xs = [0]      # 이름만 바꿈
  def mutate(xs):
      xs.append(9)  # 가리키는 리스트를 바꿈
  rebind(a); mutate(a)
  print(a)
reviewOffsets: [1, 3, 7, 14, 30]
sample: true
exercises:
  - id: ex-day29-predict
    title: 포인터로 값을 바꾼 결과 예측하기
    kind: predict
    objective: 포인터가 저장한 주소와 역참조한 값을 구분한다.
    prompt: 출력되는 값을 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int value = 10;
          int *p = &value;
          *p += 5;
          printf("%d\n", value);
          return 0;
      }
    answer: "15"
    hint: "p는 value의 주소이고, *p는 그 주소에 있는 value 자체입니다."
    explanation: "*p += 5는 'p가 가리키는 곳의 값에 5를 더하라'는 뜻이라 value = value + 5와 같습니다. 주소 숫자에 5를 더하는 것은 p += 5이고, 그것은 Day 30의 포인터 산술입니다."
    commonMistakes:
      - "주소에 5를 더한다고 해석함"
      - "p와 *p를 같은 것으로 생각함"
    language: c
    verification: run
  - id: ex-day29-predict-py
    title: 공유된 리스트와 새 리스트 예측하기
    kind: predict
    objective: "+=는 같은 리스트를 바꾸고, x = x + y는 새 리스트를 만든다는 것을 구별한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      a = [1]
      b = a
      b += [2]
      c = a
      c = c + [3]
      print(a, c)
    answer: "[1, 2] [1, 2, 3]"
    hint: "리스트의 +=는 그 리스트를 제자리에서 늘립니다. c + [3]은 새 리스트를 만들고 c를 거기에 다시 묶습니다."
    explanation: "b += [2]는 a와 b가 함께 가리키는 리스트에 2를 붙여 a도 [1, 2]가 됩니다. c = c + [3]은 새 리스트 [1, 2, 3]을 만들어 c만 그것을 가리키므로 a는 그대로입니다. '값을 바꾼다'와 '이름을 다시 묶는다'의 차이입니다."
    commonMistakes:
      - "b += [2]가 새 리스트를 만든다고 생각해 [1] [1, 3]으로 적음"
      - "c = c + [3]도 a를 바꾼다고 생각해 [1, 2, 3] [1, 2, 3]으로 적음"
    language: python
    verification: run
  - id: ex-day29-fill
    title: 가변 빌림 매개변수 채우기
    kind: fill
    objective: 함수가 부른 쪽의 값을 바꾸도록 &mut 매개변수를 쓴다.
    prompt: "빈칸에 매개변수 자료형을 채워 x가 42가 되게 하세요."
    starter: |-
      fn double(n: _____) {
          *n *= 2;
      }

      fn main() {
          let mut x = 21;
          double(&mut x);
          println!("{x}");
      }
    answer: |-
      fn double(n: &mut i32) {
          *n *= 2;
      }

      fn main() {
          let mut x = 21;
          double(&mut x);
          println!("{x}");
      }
    output: "42"
    hint: "i32 값을 '바꿀 수 있게 빌린 것'의 자료형입니다."
    explanation: "&mut i32는 C의 int *와 비슷하게 '다른 곳의 값을 가리키고 바꿀 수 있는 것'입니다. *n으로 가리키는 값에 접근합니다. 부르는 쪽도 &mut x로 '바꿔도 된다'고 명시해야 하고, x 자체도 mut여야 합니다."
    commonMistakes:
      - "&i32로 써서 E0594(cannot assign behind a & reference) 오류가 남"
      - "i32로 받아 복사본만 바뀜(*n을 쓸 수도 없음)"
    language: rust
    verification: run
  - id: ex-day29-modify
    title: 부른 쪽 값을 바꾸는 Python 함수
    kind: modify
    objective: Python에서 정수를 '바꾸는' 함수는 새 값을 돌려받아 대입해야 한다는 것을 확인한다.
    prompt: "add_ten을 불러도 n이 5로 남습니다. 새 값을 돌려주고 부른 쪽이 대입하도록 고쳐 15가 출력되게 하세요."
    starter: |-
      def add_ten(x):
          x += 10


      n = 5
      add_ten(n)
      print(n)
    answer: |-
      def add_ten(x):
          return x + 10


      n = 5
      n = add_ten(n)
      print(n)
    output: "15"
    hint: "정수는 바꿀 수 없는 값이라, x += 10은 x라는 이름을 새 정수에 다시 묶을 뿐입니다. 부른 쪽의 n은 모릅니다."
    explanation: "Python에는 C 포인터나 Rust &mut 같은 '다른 변수를 가리키는 것'이 없어서, 정수·문자열 같은 바꿀 수 없는 값을 함수가 바꾸려면 결과를 돌려받아야 합니다. 리스트처럼 안을 바꿀 수 있는 값은 함수 안에서 바꾸면 부른 쪽에 보입니다."
    commonMistakes:
      - "global n을 써서 동작은 하지만 함수가 특정 변수에만 묶임"
      - "return만 추가하고 부른 쪽에서 대입하지 않음"
    language: python
    verification: run
  - id: ex-day29-debug
    title: 값만 받은 swap 고치기
    kind: debug
    objective: 부른 쪽 변수를 바꾸려면 주소를 넘겨야 한다는 것을 확인한다.
    prompt: "이 swap은 복사본만 바꿉니다(-Wextra가 'parameter b set but not used'로 알려 줍니다). 포인터를 받도록 고쳐 '2 1'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      void swap(int a, int b) {
          int t = a;
          a = b;
          b = t;
      }

      int main(void) {
          int x = 1, y = 2;
          swap(x, y);
          printf("%d %d\n", x, y);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      void swap(int *a, int *b) {
          int t = *a;
          *a = *b;
          *b = t;
      }

      int main(void) {
          int x = 1, y = 2;
          swap(&x, &y);
          printf("%d %d\n", x, y);
          return 0;
      }
    output: "2 1"
    hint: "매개변수를 int *로, 몸통의 a와 b를 *a와 *b로, 부르는 곳을 &x, &y로 바꾸세요."
    explanation: "값으로 받으면 x, y의 복사본 a, b만 바뀌고 함수가 끝나면 사라집니다(Day 20). 주소를 받으면 *a가 main의 x 자체라서 바꾼 것이 남습니다. 포인터는 '다른 함수의 변수를 바꿀 수 있게 하는 위치 정보'입니다."
    commonMistakes:
      - "매개변수만 int *로 바꾸고 몸통에서 *를 빠뜨려 주소끼리 바꿈"
      - "부르는 곳에서 &를 빠뜨려 정수를 포인터 자리에 넘김(컴파일 오류)"
    language: c
    verification: run
  - id: ex-day29-independent
    title: Rust로 모든 값을 범위 안으로 자르기
    kind: independent
    objective: "&mut 슬라이스를 받아 각 칸을 제자리에서 바꾼다."
    prompt: "fn clamp_all(xs: &mut [i32], lo: i32, hi: i32)를 만들어 [5, -3, 12, 8]을 0~10 범위로 잘라 '[5, 0, 10, 8]'을 출력하세요."
    starter: |-
      fn main() {
          let mut v = vec![5, -3, 12, 8];
          println!("{v:?}");
      }
    answer: |-
      fn clamp_all(xs: &mut [i32], lo: i32, hi: i32) {
          for x in xs.iter_mut() {
              *x = (*x).clamp(lo, hi);
          }
      }

      fn main() {
          let mut v = vec![5, -3, 12, 8];
          clamp_all(&mut v, 0, 10);
          println!("{v:?}");
      }
    output: "[5, 0, 10, 8]"
    hint: "iter_mut()가 주는 x는 칸을 가리키는 &mut i32입니다. *x로 칸의 값을 읽고 씁니다."
    explanation: "&mut [i32]는 '이 칸들을 바꿀 수 있게 빌린다'는 뜻이라 함수가 원본 Vec을 제자리에서 바꿉니다. 빌림은 함수가 끝나면 돌려받으므로 main에서 다시 v를 쓸 수 있습니다. C라면 int a[]와 길이 n을 받아 a[i]를 바꾸는 함수와 같습니다."
    commonMistakes:
      - "&[i32]로 받아 값을 바꿀 수 없음"
      - "for x in xs로 돌며 x = ...를 써서 자료형 오류가 남(*x에 대입해야 함)"
    language: rust
    verification: run
quiz:
  - id: quiz-day29-01
    question: C에서 int n = 5; int *p = &n;일 때 p와 *p는 각각 무엇인가요?
    choices:
      - p는 5, *p는 n의 주소
      - p는 n의 주소, *p는 그 주소에 있는 값(5)
      - 둘 다 5
      - 둘 다 n의 주소
    answerIndex: 1
    explanation: "&n은 'n의 주소', 포인터 p는 그 주소를 담는 변수, *p는 '주소를 따라가서 찾은 값'입니다. 선언할 때의 *(int *p)는 'p는 포인터'라는 표시이고, 식에서의 *(*p)는 '따라가기'라서 뜻이 다릅니다."
  - id: quiz-day29-02
    question: NULL 포인터를 역참조(*p)하면 C에서 어떻게 되나요?
    choices:
      - 0이 나온다
      - 정의되지 않은 동작이며, 보통 프로그램이 죽는다(세그멘테이션 오류)
      - 컴파일 오류가 난다
      - 아무 일도 없다
    answerIndex: 1
    explanation: NULL은 '아무것도 가리키지 않음'이라서 따라갈 곳이 없습니다. 포인터를 쓰기 전에 if (p != NULL)로 검사해야 합니다. Rust에는 NULL 참조가 없고, '없을 수 있음'은 Option<&T>로 나타내어 검사를 강제합니다.
  - id: quiz-day29-03
    question: Rust의 빌림 규칙으로 옳은 것은?
    choices:
      - "&와 &mut를 원하는 만큼 동시에 만들 수 있다"
      - "같은 값에 대해 공유 빌림(&)은 여러 개, 또는 가변 빌림(&mut)은 하나만, 동시에 가질 수 있다"
      - "&mut는 여러 개 가능하고 &는 하나만 가능하다"
      - 빌림은 함수 안에서만 가능하다
    answerIndex: 1
    explanation: 여러 곳에서 읽기만 하는 것은 안전하지만, 누군가 바꾸는 동안 다른 곳이 읽거나 바꾸면 값이 꼬입니다. Rust는 '읽기 여럿 또는 쓰기 하나'를 컴파일할 때 검사해 이런 버그(데이터 경쟁, 사라진 값 가리키기)를 막습니다.
  - id: quiz-day29-04
    question: Python에서 def f(xs) 안의 xs.append(1)과 xs = [1]의 차이는?
    choices:
      - 둘 다 부른 쪽 리스트를 바꾼다
      - append는 가리키는 리스트를 바꿔 부른 쪽에 보이고, xs = [1]은 이름 xs만 새 리스트에 묶어 부른 쪽과 관계가 없다
      - 둘 다 부른 쪽에 영향이 없다
      - xs = [1]만 부른 쪽을 바꾼다
    answerIndex: 1
    explanation: Python의 매개변수는 부른 쪽과 같은 객체를 가리키는 새 이름입니다. 객체를 바꾸는 연산(append, xs[0] = …)은 공유되고, 이름에 대입하는 것은 그 이름만 바꿉니다.
  - id: quiz-day29-05
    question: C의 transfer(&a, &a, 1000)처럼 두 포인터가 같은 변수를 가리키는 상황을 Rust에서 같은 모양으로 쓰면?
    choices:
      - 잘 동작한다
      - "같은 값에 &mut를 두 개 만들 수 없어 컴파일 오류(E0499)가 난다"
      - 실행 중에 패닉이 난다
      - 두 번째 인자가 무시된다
    answerIndex: 1
    explanation: 한 값을 두 이름이 동시에 바꿀 수 있는 상태(별칭)는 계산 순서에 따라 결과가 달라지는 버그를 만듭니다. C는 이를 허용하지만 Rust는 가변 빌림을 하나만 허용해 컴파일할 때 막습니다.
---

## 1. 오늘 배울 내용

지금까지 변수는 "값이 든 상자"였습니다. 오늘은 그 상자가 **메모리의 어디에 있는지**(주소)를 다룹니다. 상자의 위치를 알면, 다른 함수도 그 상자를 찾아가 값을 읽고 바꿀 수 있습니다.

1. **값**과 **주소**를 구별합니다.
2. C의 **포인터**를 배웁니다.
   - `&x`: x의 주소 얻기
   - `int *p`: 주소를 담는 변수
   - `*p`: p가 가리키는 곳의 값(역참조)
   - `NULL`: 아무것도 가리키지 않음
3. 포인터를 받는 함수(`swap`, `transfer`)가 **부른 쪽 변수를 바꾸는** 과정을 추적합니다.
4. Python에서는 이름이 객체를 **가리키는 참조**라는 것을 보고, "객체를 바꾸기"와 "이름을 다시 묶기"를 구별합니다.
5. Rust의 **빌림**을 배웁니다.
   - `&T`: 공유 빌림, 읽기
   - `&mut T`: 가변 빌림, 쓰기
6. Rust가 "읽기 여럿 **또는** 쓰기 하나"라는 규칙으로 막는 버그를 봅니다.

## 2. 왜 필요한가

Day 20에서 인자는 **복사**되어 넘어가서, 함수 안에서 바꿔도 부른 쪽은 그대로였습니다. 그런데 다음과 같은 함수는 부른 쪽의 변수를 **직접** 바꿔야 합니다.

- 두 변수의 값을 바꾸는 `swap(a, b)`
- 한 계좌에서 빼서 다른 계좌에 더하는 `transfer(from, to, amount)`
- 값 여러 개를 한꺼번에 돌려주는 함수(C는 반환값이 하나뿐이라, 결과를 적을 위치를 받습니다, Day 43)

또 큰 데이터(수백만 칸 배열, 긴 문자열)를 함수에 넘길 때마다 복사하면 느립니다. **위치만 알려 주면** 복사 없이 같은 데이터를 쓸 수 있습니다.

세 언어는 "같은 값을 여러 곳에서 바라보기"를 서로 다르게 다룹니다. C는 자유롭지만 위험하고, Python은 편하지만 숨어 있으며, Rust는 규칙으로 안전을 보장합니다.

## 3. 그림으로 이해하기

메모리는 **번호가 매겨진 칸**들의 긴 줄입니다. 변수는 그중 몇 칸을 차지하고, 그 첫 칸의 번호가 **주소**입니다.

```text
int value = 10;
int *p = &value;

주소(예)   ...  1000  1001  1002  1003  ...  2000 ~ 2007
          ┌──────────────────────────┐     ┌──────────────┐
          │ value =  10              │     │ p = 1000     │
          └──────────────────────────┘     └──────┬───────┘
                ▲                                 │
                └──────── p가 가리킨다 ────────────┘

&value → 1000     (value의 주소)
p      → 1000     (p에 담긴 값 = 주소)
*p     → 10       (1000번 칸으로 가서 찾은 값 = value 자체)
*p = 15 → value가 15가 된다
```

실제 주소 숫자는 실행할 때마다 달라질 수 있어서 중요하지 않습니다. 중요한 것은 **"p는 value를 가리킨다"는 관계**입니다.

같은 관계를 세 언어로 그리면 이렇습니다.

```text
C:       int *p = &value;     p ──▶ value      주소를 담은 변수. 가리키는 대상을 바꿀 수도, 계산할 수도 있음
Python:  b = a                a ──▶ [1, 2, 3] ◀── b     모든 이름이 객체를 가리킴(참조)
Rust:    let r = &value;      r ──▶ value      빌림. 컴파일러가 value가 살아 있는지, 규칙을 지키는지 검사
```

## 4. 천천히 풀어보기

### 4.1 C의 &와 *

| 쓰는 곳         | 모양             | 뜻                                       |
| --------------- | ---------------- | ---------------------------------------- |
| 선언            | `int *p;`        | p는 "`int`가 있는 곳의 주소"를 담는 변수 |
| 식              | `&value`         | value의 주소                             |
| 식              | `*p`             | p가 가리키는 곳의 값(역참조)             |
| 식(대입의 왼쪽) | `*p = 15;`       | p가 가리키는 곳에 15를 넣음              |
| 초기화          | `int *p = NULL;` | 아무것도 가리키지 않음                   |

선언의 `*`(`int *p`)와 식의 `*`(`*p`)는 뜻이 다릅니다. 선언에서는 "포인터 자료형"이라는 표시, 식에서는 "따라가기"입니다. 포인터를 처음 볼 때 가장 헷갈리는 점이니 천천히 구별하세요.

### 4.2 포인터로 부른 쪽 변수 바꾸기

```text
swap(&x, &y) 호출

main:  x [ 1 ]   y [ 2 ]
         ▲          ▲
swap:  a ┘        b ┘      a, b는 x, y의 주소를 복사해 받음

int t = *a;   → t = 1        (a를 따라가 x의 값을 읽음)
*a = *b;      → x = 2        (a를 따라가 x에 y의 값을 씀)
*b = t;       → y = 1
```

주소 **값 자체**는 여전히 복사되어 넘어갑니다. 하지만 복사된 주소도 같은 곳을 가리키므로, 따라가서 바꾸면 원래 변수가 바뀝니다.

### 4.3 Python: 모든 이름은 참조

Python의 변수는 처음부터 **객체를 가리키는 이름표**입니다(Day 1의 그림). 그래서 대입과 함수 인자는 항상 "같은 객체를 가리키는 이름을 하나 더 만드는 것"입니다.

| 하는 일              | 예                                       | 부른 쪽·다른 이름에 보이나 |
| -------------------- | ---------------------------------------- | -------------------------- |
| 객체를 **바꾸기**    | `xs.append(1)`, `xs[0] = 9`, `xs += [2]` | 보인다(같은 객체)          |
| 이름을 **다시 묶기** | `xs = [0]`, `n = n + 1`                  | 보이지 않는다(새 객체)     |

정수, 문자열, 튜플은 **바꿀 수 없는 객체**라서 "바꾸기"가 불가능합니다. `n += 1`은 새 정수를 만들어 이름을 다시 묶는 것입니다. 그래서 Python 함수는 정수 인자를 바꿀 수 없고, 결과를 **돌려줘야** 합니다.

### 4.4 Rust: 빌림과 두 가지 규칙

| 빌림      | 모양         | 할 수 있는 일 | 동시에 몇 개               |
| --------- | ------------ | ------------- | -------------------------- |
| 공유 빌림 | `&value`     | 읽기          | 여러 개                    |
| 가변 빌림 | `&mut value` | 읽기와 쓰기   | **하나만**(다른 빌림 없이) |

그리고 빌린 참조는 **원래 값보다 오래 살 수 없습니다**. 이 두 규칙을 컴파일러(빌림 검사기)가 확인합니다.

- 한 값을 두 곳이 동시에 바꾸는 코드 → 컴파일 오류(E0499)
- 누가 읽는 동안 다른 곳이 바꾸는 코드 → 컴파일 오류(E0502)
- 사라진 값을 가리키는 참조 → 컴파일 오류(E0597)

C에서는 이런 코드가 모두 컴파일되고, 운이 나쁘면 실행 중에 이상한 결과나 충돌로 드러납니다.

## 5. C로 구현하기

```c
// 파일: pointers.c
#include <stdio.h>
#include <stddef.h>

void swap(int *a, int *b) {                 // 두 변수의 '위치'를 받는다
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int value = 10;
    int *p = &value;                        // p에 value의 주소를 담는다
    printf("value = %d, *p = %d\n", value, *p);
    printf("p가 value를 가리키나? %d\n", p == &value);

    *p += 5;                                // p가 가리키는 곳(value)의 값을 바꾼다
    printf("*p += 5 뒤 value = %d\n", value);

    int other = 7;
    p = &other;                             // 이제 other를 가리킨다
    *p = 100;
    printf("value = %d, other = %d\n", value, other);

    int a = 1, b = 2;
    swap(&a, &b);
    printf("swap 뒤 a = %d, b = %d\n", a, b);

    int nums[3] = {10, 20, 30};
    int *q = &nums[1];                      // 배열의 한 칸을 가리킬 수도 있다
    *q = 99;
    printf("nums = %d %d %d\n", nums[0], nums[1], nums[2]);

    int *nothing = NULL;                    // 아무것도 가리키지 않음
    if (nothing != NULL) {
        printf("%d\n", *nothing);
    } else {
        printf("NULL이라 읽지 않음\n");
    }
    printf("int %zu바이트, int* %zu바이트\n", sizeof(int), sizeof(int *));
    return 0;
}
```

실행 결과:

```text
value = 10, *p = 10
p가 value를 가리키나? 1
*p += 5 뒤 value = 15
value = 15, other = 100
swap 뒤 a = 2, b = 1
nums = 10 99 30
NULL이라 읽지 않음
int 4바이트, int* 8바이트
```

실제 주소는 `printf("%p\n", (void *)p);`로 볼 수 있지만, 실행할 때마다 달라지는 값이라 위 출력에는 넣지 않았습니다. 예를 들면 `0x7ffd4b2c` 같은 16진수로 보입니다.

### 코드 한 부분씩 읽기

| 코드                        | 설명                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `int *p = &value;`          | `p`는 `int`를 가리키는 포인터이고, `value`의 주소로 초기화했습니다.                                                 |
| `p == &value`               | 포인터끼리는 `==`로 "같은 곳을 가리키는지" 비교할 수 있습니다.                                                      |
| `*p += 5;`                  | `value += 5`와 같습니다. 이름 `value`를 쓰지 않고도 값을 바꿨습니다.                                                |
| `p = &other; *p = 100;`     | `*` 없이 `p`에 대입하면 **가리키는 대상**이 바뀝니다. 그 뒤의 `*p = 100`은 `other`를 바꾸고 `value`는 그대로입니다. |
| `void swap(int *a, int *b)` | 주소 두 개를 받아 가리키는 값을 맞바꿉니다. 부르는 쪽은 `swap(&a, &b)`로 주소를 넘깁니다.                           |
| `int *q = &nums[1];`        | 배열의 한 칸도 주소가 있습니다. `*q = 99`는 `nums[1] = 99`와 같습니다.                                              |
| `int *nothing = NULL;`      | 가리킬 것이 없음을 나타냅니다. 역참조하기 전에 반드시 `NULL`인지 검사합니다.                                        |
| `sizeof(int *)` → 8         | 64비트 컴퓨터에서 주소는 8바이트입니다. 가리키는 대상의 크기와 상관없이 모든 포인터가 같은 크기입니다.              |

## 6. Python으로 구현하기

Python에는 `&`와 `*`가 없습니다. 모든 이름이 이미 객체를 가리키기 때문입니다. 대신 **어떤 연산이 객체를 바꾸고, 어떤 연산이 이름을 다시 묶는지**를 구별해야 합니다.

```python
# 파일: references.py
a = [1, 2, 3]
b = a                                       # 같은 리스트에 이름이 하나 더
b.append(4)
print(a, b, a is b)

c = a.copy()                                # 새 리스트
c.append(5)
print(a, c, a is c)

x = 10
y = x
y += 1                                      # 정수는 바꿀 수 없어 y가 새 값 11을 가리킨다
print(x, y)


def append_one(xs):
    xs.append(1)                            # 가리키는 리스트를 바꾼다 → 부른 쪽에 보인다


def rebind(xs):
    xs = [0]                                # 이름만 새 리스트로 → 부른 쪽과 관계없음


nums = [9]
append_one(nums)
rebind(nums)
print("nums:", nums)

box = [10]                                  # 값 하나를 담은 '상자'로 C 포인터 흉내


def add_five(cell):
    cell[0] += 5


add_five(box)
print("box:", box[0])


def swap(p, q):
    return q, p                             # 두 값을 바꿔 돌려주고, 부른 쪽이 대입


s, t = 1, 2
s, t = swap(s, t)
print("swap 뒤:", s, t)
```

실행 결과:

```text
[1, 2, 3, 4] [1, 2, 3, 4] True
[1, 2, 3, 4] [1, 2, 3, 4, 5] False
10 11
nums: [9, 1]
box: 15
swap 뒤: 2 1
```

### 코드 한 부분씩 읽기

| 코드                          | 설명                                                                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `b = a` / `b.append(4)`       | `a`와 `b`가 같은 리스트라 `a`에도 4가 보입니다. `a is b`가 참입니다(Day 12).                                                                              |
| `c = a.copy()`                | 새 리스트를 만들어 `c`가 가리킵니다. `c`를 바꿔도 `a`는 그대로이고, `a is c`는 거짓입니다.                                                                |
| `y = x` / `y += 1`            | 정수는 바꿀 수 없어서 `y += 1`은 새 정수 11을 만들고 `y`만 다시 묶습니다. `x`는 10입니다.                                                                 |
| `append_one(nums)`            | 함수 안의 `xs`가 `nums`와 같은 리스트를 가리키므로 추가한 1이 보입니다.                                                                                   |
| `rebind(nums)`                | 함수 안에서 `xs = [0]`은 이름 `xs`만 새 리스트에 묶습니다. `nums`는 영향이 없습니다.                                                                      |
| `box = [10]` / `cell[0] += 5` | 칸 하나짜리 리스트를 "상자"로 넘기면, 함수가 그 칸을 바꿀 수 있습니다. C 포인터와 비슷한 효과를 내는 요령이지만, 보통은 값을 돌려받는 편이 더 깔끔합니다. |
| `def swap(p, q): return q, p` | Python에서는 바꾼 값을 **돌려받아 대입**합니다(`s, t = swap(s, t)`). 사실 `s, t = t, s` 한 줄이면 됩니다(Day 4).                                          |

## 7. Rust로 구현하기

Rust의 **참조**(`&T`, `&mut T`)는 C 포인터처럼 다른 곳의 값을 가리키지만, 컴파일러가 두 가지를 보장합니다. 항상 **살아 있는 값**을 가리키고, **빌림 규칙**을 지킨다는 것입니다. 그래서 NULL 참조나 사라진 값을 가리키는 참조가 없습니다.

```rust
// 파일: borrowing.rs
fn add_five(n: &mut i32) {                  // 가변 빌림: 가리키는 값을 바꿀 수 있다
    *n += 5;
}

fn swap(a: &mut i32, b: &mut i32) {
    let t = *a;
    *a = *b;
    *b = t;
}

fn total(xs: &[i32]) -> i32 {               // 공유 빌림: 읽기만 한다
    xs.iter().sum()
}

fn main() {
    let mut value = 10;
    let r = &value;                         // 공유 빌림
    println!("value = {value}, *r = {}", *r);
    add_five(&mut value);                   // r은 더 쓰이지 않으므로 이제 가변 빌림 가능
    println!("add_five 뒤 value = {value}");

    let (mut a, mut b) = (1, 2);
    swap(&mut a, &mut b);
    println!("swap 뒤 a = {a}, b = {b}");
    std::mem::swap(&mut a, &mut b);         // 표준 라이브러리의 swap
    println!("mem::swap 뒤 a = {a}, b = {b}");

    let mut nums = [10, 20, 30];
    {
        let q = &mut nums[1];               // 배열의 한 칸을 가변으로 빌린다
        *q = 99;
    }
    println!("nums = {nums:?}");

    let r1 = &nums;                         // 공유 빌림은 여러 개 동시에 가능
    let r2 = &nums;
    println!("합 {}, 첫 칸 {}", total(r1), r2[0]);

    let nothing: Option<&i32> = nums.get(5);    // NULL 대신 Option
    match nothing {
        Some(v) => println!("{v}"),
        None => println!("없는 칸이라 None"),
    }
    println!("&i32 {}바이트", std::mem::size_of::<&i32>());
}
```

실행 결과:

```text
value = 10, *r = 10
add_five 뒤 value = 15
swap 뒤 a = 2, b = 1
mem::swap 뒤 a = 1, b = 2
nums = [10, 99, 30]
합 139, 첫 칸 10
없는 칸이라 None
&i32 8바이트
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let r = &value;` / `*r`                | 공유 빌림입니다. C처럼 `*r`로 값을 읽습니다. `println!` 같은 곳에서는 `r`만 써도 자동으로 따라가 줍니다.                                                            |
| `add_five(&mut value);`                 | `r`이 공유 빌림 중인데 가변 빌림을 만들 수 있는 이유는, `r`이 이 줄 **이후로 쓰이지 않기** 때문입니다. 컴파일러는 빌림이 실제로 쓰이는 곳까지만 살아 있다고 봅니다. |
| `fn add_five(n: &mut i32) { *n += 5; }` | C의 `void add_five(int *n) { *n += 5; }`와 모양이 거의 같습니다.                                                                                                    |
| `std::mem::swap(&mut a, &mut b);`       | 표준 라이브러리가 제공하는 교환 함수입니다. 두 값에 대한 가변 빌림 두 개를 받습니다. 서로 **다른** 값이라 괜찮습니다.                                               |
| `{ let q = &mut nums[1]; *q = 99; }`    | 블록으로 가변 빌림의 범위를 좁혔습니다. 블록이 끝나면 빌림도 끝나서 뒤에서 `nums`를 자유롭게 씁니다.                                                                |
| `let r1 = &nums; let r2 = &nums;`       | 공유 빌림은 여러 개 동시에 만들 수 있습니다. 읽기만 하니 서로 방해하지 않습니다.                                                                                    |
| `nums.get(5)` → `None`                  | Rust에는 NULL 참조가 없습니다. "없을 수 있는 참조"는 `Option<&i32>`로 표현하고 `match`로 검사를 **강제**합니다.                                                     |
| `size_of::<&i32>()` → 8                 | 참조도 속은 주소라서 C 포인터와 크기가 같습니다. 안전 검사는 컴파일할 때 끝나므로 실행 비용이 없습니다.                                                             |

## 8. 실행 추적

C 코드에서 `value`, `other`, `p`, `*p`가 줄마다 어떻게 바뀌는지 따라갑니다. 주소는 예시 값(1000, 1004)입니다.

| 줄                 | `value` | `other` | `p`(가리키는 곳) | `*p` |
| ------------------ | ------: | ------: | ---------------- | ---: |
| `int value = 10;`  |      10 |       — | —                |    — |
| `int *p = &value;` |      10 |       — | 1000(value)      |   10 |
| `*p += 5;`         |  **15** |       — | 1000(value)      |   15 |
| `int other = 7;`   |      15 |       7 | 1000(value)      |   15 |
| `p = &other;`      |      15 |       7 | **1004(other)**  |    7 |
| `*p = 100;`        |      15 | **100** | 1004(other)      |  100 |

`*p = ...`는 **가리키는 변수**를 바꾸고, `p = ...`는 **가리키는 대상**을 바꿉니다. 이 두 가지를 구별하는 것이 포인터 공부의 핵심입니다.

## 9. 다른 예제로 다시 이해하기

**두 계좌 사이의 이체.** 한 계좌에서 빼고 다른 계좌에 더하는 함수는 **두 변수를 동시에 바꿔야** 해서, 값만 받아서는 만들 수 없습니다. C는 포인터 두 개를 받습니다.

```c
// 파일: transfer.c
#include <stdio.h>
#include <stdbool.h>

bool transfer(int *from, int *to, int amount) {
    if (amount <= 0 || *from < amount) {
        return false;                       // 금액이 잘못됐거나 잔액 부족
    }
    *from -= amount;                        // 두 계좌를 가리키는 곳의 값을 바꾼다
    *to += amount;
    return true;
}

int main(void) {
    int minji = 10000, junho = 3000;
    printf("4000원 이체: %s\n", transfer(&minji, &junho, 4000) ? "성공" : "실패");
    printf("민지 %d원, 준호 %d원\n", minji, junho);
    printf("9000원 이체: %s\n", transfer(&minji, &junho, 9000) ? "성공" : "실패");
    printf("민지 %d원, 준호 %d원\n", minji, junho);
    printf("자기 계좌로 1000원: %s\n", transfer(&junho, &junho, 1000) ? "성공" : "실패");
    printf("준호 %d원(같은 곳을 두 포인터가 가리킴)\n", junho);
    return 0;
}
```

실행 결과:

```text
4000원 이체: 성공
민지 6000원, 준호 7000원
9000원 이체: 실패
민지 6000원, 준호 7000원
자기 계좌로 1000원: 성공
준호 7000원(같은 곳을 두 포인터가 가리킴)
```

`transfer(&junho, &junho, 1000)`에서는 `from`과 `to`가 **같은 변수**를 가리킵니다(별칭, aliasing). 1000을 뺐다가 다시 더해서 결과는 그대로지만, 함수가 "빼고 나서 잔액을 검사"하는 식으로 조금만 달라져도 엉뚱한 결과가 날 수 있습니다. C는 이런 호출을 막지 않습니다.

Rust로 같은 함수를 만들면, 가변 빌림 두 개를 받고 실패 이유는 `Result`로 알립니다(Day 25).

```rust
// 파일: transfer.rs
fn transfer(from: &mut i64, to: &mut i64, amount: i64) -> Result<(), String> {
    if amount <= 0 {
        return Err(format!("금액 {amount}원은 올바르지 않습니다"));
    }
    if *from < amount {
        return Err(format!("잔액 부족: {}원뿐입니다", *from));
    }
    *from -= amount;
    *to += amount;
    Ok(())
}

fn main() {
    let mut minji: i64 = 10000;
    let mut junho: i64 = 3000;
    for amount in [4000, 9000, -500] {
        match transfer(&mut minji, &mut junho, amount) {
            Ok(()) => println!("{amount}원 이체 성공"),
            Err(why) => println!("{amount}원 이체 실패: {why}"),
        }
        println!("  민지 {minji}원, 준호 {junho}원");
    }
}
```

실행 결과:

```text
4000원 이체 성공
  민지 6000원, 준호 7000원
9000원 이체 실패: 잔액 부족: 6000원뿐입니다
  민지 6000원, 준호 7000원
-500원 이체 실패: 금액 -500원은 올바르지 않습니다
  민지 6000원, 준호 7000원
```

Rust에서 `transfer(&mut junho, &mut junho, 1000)`이라고 쓰면 **컴파일되지 않습니다**. 같은 값에 가변 빌림을 두 개 만들 수 없기 때문입니다(12절 실수 3). 별칭으로 생기는 버그를 아예 만들 수 없게 한 것입니다.

## 10. 세 방식 한눈에 보기

| 하고 싶은 일               | C           | Python                                       | Rust                     |
| -------------------------- | ----------- | -------------------------------------------- | ------------------------ |
| 값의 위치 얻기             | `&x`        | (필요 없음, 이름이 곧 참조)                  | `&x`, `&mut x`           |
| 위치를 담는 자료형         | `int *`     | (모든 이름)                                  | `&i32`, `&mut i32`       |
| 가리키는 값 읽기           | `*p`        | 이름을 그대로 사용                           | `*r`(대부분 자동)        |
| 가리키는 값 바꾸기         | `*p = v;`   | 바꿀 수 있는 객체만(`xs[0] = v`)             | `*r = v;`(`&mut`일 때만) |
| 가리키는 것이 없음         | `NULL`      | `None`                                       | `Option<&T>`의 `None`    |
| 함수가 부른 쪽 변수 바꾸기 | 포인터 인자 | 결과를 돌려받아 대입(또는 바꿀 수 있는 객체) | `&mut` 인자              |
| 같은 값을 두 곳이 바꾸기   | 허용(위험)  | 허용                                         | 컴파일 오류              |

## 11. 세 언어 비교

| 관점                 | C 포인터                 | Python 참조                            | Rust 빌림                       |
| -------------------- | ------------------------ | -------------------------------------- | ------------------------------- |
| 무엇인가             | 주소를 담은 정수 같은 값 | 모든 이름이 객체를 가리킴              | 컴파일러가 검사하는 주소        |
| NULL/빈 참조         | 있음(검사는 직접)        | `None`                                 | 없음(`Option`으로만)            |
| 사라진 값 가리키기   | 가능(정의되지 않은 동작) | 불가능(가리키는 동안 객체가 살아 있음) | 컴파일 오류                     |
| 가리키는 대상 바꾸기 | `p = &other;`            | 이름 다시 묶기                         | 참조 바인딩을 `mut`로 두면 가능 |
| 주소 계산(산술)      | 가능(Day 30)             | 불가능                                 | 불가능(`unsafe` 제외)           |
| 안전 검사 시점       | 없음                     | 실행 중(객체 수명은 자동 관리)         | 컴파일할 때                     |

## 12. 자주 하는 실수

### 실수 1: 포인터 대신 값을 넘긴다 (C)

실습의 디버그 문제입니다. 값을 넘기면 복사본만 바뀝니다. 부른 쪽 변수를 바꾸려면 `&x`를 넘기고, 함수는 `int *`를 받아 `*p`로 씁니다.

### 실수 2: NULL을 검사하지 않고 역참조한다 (C)

```c
// 파일: null_deref.c
#include <stdio.h>
#include <stddef.h>

int read_or_default(const int *p, int fallback) {
    if (p == NULL) {
        return fallback;            // 이 검사가 없으면 *p에서 프로그램이 죽을 수 있다
    }
    return *p;
}

int main(void) {
    int x = 42;
    printf("%d %d\n", read_or_default(&x, 0), read_or_default(NULL, -1));
    return 0;
}
```

실행 결과:

```text
42 -1
```

포인터를 받는 함수는 `NULL`이 들어올 수 있는지 문서로 정하고, 들어올 수 있다면 먼저 검사하세요.

### 실수 3: 같은 값에 가변 빌림을 두 개 만든다 (Rust)

```rust
// 파일: two_mut.rs (컴파일 오류: E0499)
fn transfer(from: &mut i64, to: &mut i64, amount: i64) {
    *from -= amount;
    *to += amount;
}

fn main() {
    let mut junho: i64 = 3000;
    transfer(&mut junho, &mut junho, 1000);
    println!("{junho}");
}
```

`cannot borrow junho as mutable more than once at a time`. C에서는 조용히 컴파일되던 별칭입니다.

### 실수 4: 읽는 중에 바꾼다 (Rust)

```rust
// 파일: read_then_write.rs (컴파일 오류: E0502)
fn main() {
    let mut scores = vec![72, 95, 88];
    let first = &scores[0];
    scores.push(100);
    println!("{first}");
}
```

`first`가 `scores`의 첫 칸을 빌리고 있는데 `push`가 `scores`를 바꾸려 합니다. `push`는 Vec을 더 큰 공간으로 옮길 수 있어서, 그러면 `first`는 사라진 곳을 가리키게 됩니다. C라면 이것이 조용한 버그가 됩니다.

### 실수 5: 사라진 지역 변수의 주소를 돌려준다 (C)

```c
// 파일: dangling.c (컴파일 오류: function returns address of local variable)
#include <stdio.h>

int *make_number(void) {
    int n = 42;
    return &n;
}

int main(void) {
    int *p = make_number();
    printf("%d\n", *p);
    return 0;
}
```

`n`은 함수가 끝나면 사라지므로, 돌려받은 주소는 **이미 없는 상자**를 가리킵니다(댕글링 포인터). gcc가 경고해 주는 경우도 있지만, 조금만 복잡해지면 찾아내지 못합니다. Rust는 같은 코드를 E0106/E0515 같은 오류로 막습니다.

## 13. Q&A

**Q. 포인터는 왜 이렇게 어렵다고 하나요?**

A. "값"과 "값이 있는 위치"라는 두 층을 동시에 생각해야 하고, `*`와 `&`가 쓰이는 자리마다 뜻이 달라서입니다. 8절처럼 **표를 그려** 변수, 포인터, 가리키는 값을 따로 적으면 훨씬 쉬워집니다. 그림을 그리는 습관이 가장 좋은 공부법입니다.

**Q. Python에는 정말 포인터가 없나요?**

A. 문법으로 드러나는 포인터는 없지만, 속으로는 모든 이름이 객체의 위치를 담고 있습니다. 그래서 Python의 동작(같은 리스트 공유, 함수 인자로 넘긴 리스트가 바뀜)은 "모든 것이 포인터인 언어"라고 생각하면 이해가 쉽습니다. 차이는 주소를 직접 계산하거나 사라진 객체를 가리킬 수 없다는 점입니다.

**Q. Rust 참조와 C 포인터는 속도가 다른가요?**

A. 속은 똑같이 주소이고, 빌림 검사는 **컴파일할 때** 끝나서 실행 속도는 같습니다. Rust에도 검사를 받지 않는 "날 포인터"(`*const T`, `*mut T`)가 있지만 `unsafe` 블록에서만 쓸 수 있고, 운영체제나 C 라이브러리와 연결할 때 씁니다.

**Q. 빌림 규칙 때문에 Rust 코드를 짜기 불편하지 않나요?**

A. 처음에는 불편하게 느껴집니다. 하지만 컴파일러가 거부하는 코드는 대부분 C나 다른 언어에서 **실제로 버그가 될 수 있는** 코드입니다. 빌림의 범위를 좁히거나(블록, 필요할 때만 빌리기), 복사(`clone`)하거나, 값을 돌려받는 방식으로 대부분 풀립니다. Day 33에서 자세히 연습합니다.

## 14. 핵심 요약

- 변수에는 **값**과 **주소**(메모리 위치)가 있습니다. 주소 숫자 자체보다 "무엇이 무엇을 가리키는가"가 중요합니다.
- C: `&x`는 주소, `int *p`는 주소를 담는 포인터, `*p`는 가리키는 곳의 값입니다. `*p = v`는 가리키는 변수를, `p = &y`는 가리키는 대상을 바꿉니다. `NULL`은 검사한 뒤에만 씁니다.
- 포인터를 받는 함수(`swap`, `transfer`)는 부른 쪽 변수를 바꿀 수 있습니다. 주소가 복사되어도 같은 곳을 가리키기 때문입니다.
- Python: 모든 이름이 객체를 가리키는 참조입니다. 객체를 **바꾸는** 연산은 공유되고, 이름을 **다시 묶는** 대입은 공유되지 않습니다. 정수는 바꿀 수 없으니 결과를 돌려받습니다.
- Rust: `&T`는 읽기 전용 빌림(여러 개 가능), `&mut T`는 쓰기 빌림(하나만). 참조는 살아 있는 값만 가리키고, 없을 수 있는 참조는 `Option<&T>`입니다.
- Rust는 별칭으로 인한 동시 변경(E0499), 읽는 중 변경(E0502), 사라진 값 가리키기를 컴파일할 때 막습니다.

## 15. 도전 문제

1. **(C)** `void min_max(const int a[], int n, int *min, int *max)`를 만들어, 반환값 대신 포인터로 최솟값과 최댓값을 함께 돌려주세요.
2. **(Python)** 함수 `reset(xs)`가 부른 쪽 리스트를 **비우도록** 만드세요. `xs = []`로는 안 되는 이유를 설명하고, `xs.clear()`나 `xs[:] = []`로 고치세요.
3. **(Rust)** `fn largest(xs: &[i32]) -> Option<&i32>`를 만들어 가장 큰 값의 **참조**를 돌려주세요. 빈 슬라이스면 `None`입니다. 돌려받은 참조로 값을 읽은 뒤, 같은 Vec에 `push`하는 코드를 추가하면 어떤 오류가 나는지 확인하세요.
4. **(세 언어)** 세 변수 a, b, c의 값을 한 칸씩 돌리는(`a←b←c←a`) 함수 `rotate3`을 C는 포인터, Rust는 `&mut`, Python은 값을 돌려받는 방식으로 만드세요.
