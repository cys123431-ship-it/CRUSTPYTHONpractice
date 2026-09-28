---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-31-alias-copy
courseId: crp-92
phaseId: phase-04
dayNumber: 31
date: "2026-10-31"
title: 별칭과 복사 — 같은 것을 가리키는가, 따로 만든 것인가
summary: 두 이름이 같은 객체를 가리키는 별칭(alias)과, 새 객체를 만드는 복사를 구별합니다. Python에서 is와 ==, 바꿀 수 있는 객체(리스트, 사전)와 바꿀 수 없는 객체(정수, 문자열, 튜플)의 차이, 바깥만 새로 만드는 얕은 복사(copy, [:], list())와 안쪽까지 새로 만드는 깊은 복사(copy.deepcopy)를 중첩 리스트로 확인하고, 기본값 인자 def f(box=[])의 함정을 고칩니다. C에서는 값 배열의 memcpy와 포인터 배열의 얕은 복사, Rust에서는 소유권 이동·clone·빌림과 명시적 공유(Rc<RefCell>)를 비교하고, 되돌리기 기록을 복사본으로 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-30-pointer-arithmetic]
learningObjectives:
  - 별칭과 복사를 구별하고, is(같은 객체)와 ==(같은 값)으로 확인한다.
  - 바꿀 수 있는 객체와 바꿀 수 없는 객체에서 별칭이 다르게 보이는 이유를 설명한다.
  - 얕은 복사와 깊은 복사의 차이를 중첩 리스트로 그림을 그려 설명하고 알맞은 방법을 고른다.
  - 바꿀 수 있는 기본값 인자의 함정을 None 패턴으로 고친다.
  - C의 포인터 배열 복사, Rust의 이동·clone·Rc<RefCell>로 같은 개념을 비교한다.
concepts:
  [
    alias,
    identity,
    equality,
    mutable,
    immutable,
    shallow copy,
    deep copy,
    deepcopy,
    default argument,
    clone,
    move,
    rc refcell,
  ]
runnerMode: python
playgroundSource: |
  # 파일: aliasing.py — 복사 방법을 바꿔 가며 원본이 바뀌는지 보세요.
  import copy
  nested = [[1, 2], [3, 4]]
  a = nested              # 별칭
  b = nested.copy()       # 얕은 복사
  c = copy.deepcopy(nested)  # 깊은 복사
  b[0][0] = 100
  c[1][1] = 400
  print(nested, a is nested, b is nested, b[0] is nested[0], c[0] is nested[0])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day31-predict-py
    title: 얕은 복사 뒤의 변경 예측하기
    kind: predict
    objective: 얕은 복사본에서 안쪽 리스트를 바꾸는 것과 칸을 새로 대입하는 것의 차이를 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      a = [[0], [0]]
      b = a.copy()
      b[0].append(1)
      b[1] = [7]
      print(a)
    answer: "[[0, 1], [0]]"
    hint: "b는 새 바깥 리스트지만, 그 안의 두 칸은 a와 같은 안쪽 리스트를 가리킵니다."
    explanation: "b[0].append(1)은 a와 b가 함께 가리키는 안쪽 리스트를 바꾸므로 a에도 보입니다. b[1] = [7]은 b의 칸이 새 리스트를 가리키게 할 뿐, a의 칸은 그대로입니다. 얕은 복사는 '바깥만 새로, 안쪽은 공유'입니다."
    commonMistakes:
      - "copy가 모든 것을 복사한다고 생각해 [[0], [0]]으로 적음"
      - "b[1] = [7]도 a에 보인다고 생각해 [[0, 1], [7]]로 적음"
    language: python
    verification: run
  - id: ex-day31-predict-c
    title: 포인터 별칭과 값 복사 예측하기
    kind: predict
    objective: 포인터로 만든 별칭은 원본을 바꾸고, 값을 옮긴 배열은 따로라는 것을 확인한다.
    prompt: 출력되는 네 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[2] = {1, 2};
          int *p = a;
          int b[2];
          b[0] = a[0];
          b[1] = a[1];
          p[0] = 9;
          b[1] = 8;
          printf("%d %d %d %d\n", a[0], a[1], b[0], b[1]);
          return 0;
      }
    answer: "9 2 1 8"
    hint: "p는 a와 같은 칸을 가리키고, b는 값만 옮겨 받은 따로 된 배열입니다. b에 복사한 것은 p[0] = 9를 하기 전입니다."
    explanation: "p[0] = 9는 a[0]을 바꿉니다(별칭). b는 복사할 때의 값 1, 2를 가지고 있다가 b[1]만 8로 바뀝니다. Python의 b = a는 C의 p = a와, b = a.copy()는 값을 옮기는 것과 비슷합니다."
    commonMistakes:
      - "b[0]도 9가 된다고 생각함(복사한 뒤에 a가 바뀜)"
      - "p[0] = 9가 p만 바꾼다고 생각함"
    language: c
    verification: run
  - id: ex-day31-fill
    title: Rust에서 깊은 복사본 만들기
    kind: fill
    objective: Vec<Vec<i32>>의 복사본을 만들어 원본과 따로 바꾼다.
    prompt: "빈칸을 채워 원본은 그대로 두고 복사본만 바뀌게 하세요."
    starter: |-
      fn main() {
          let a = vec![vec![1, 2], vec![3, 4]];
          let mut b = a._____();
          b[0][0] = 100;
          println!("{a:?} {b:?}");
      }
    answer: |-
      fn main() {
          let a = vec![vec![1, 2], vec![3, 4]];
          let mut b = a.clone();
          b[0][0] = 100;
          println!("{a:?} {b:?}");
      }
    output: "[[1, 2], [3, 4]] [[100, 2], [3, 4]]"
    hint: "Rust에서 복사본을 명시적으로 만드는 메서드입니다."
    explanation: "Vec의 clone은 안쪽 Vec까지 각각 clone해서 Python의 deepcopy와 같은 결과를 냅니다. let b = a;라고만 쓰면 복사가 아니라 소유권 이동이라 뒤에서 a를 쓸 수 없습니다. Rust에는 Python식 '얕은 복사로 안쪽을 몰래 공유'하는 일이 없습니다."
    commonMistakes:
      - "copy()를 써서 메서드를 찾지 못함"
      - "clone 없이 대입해 E0382(borrow of moved value) 오류가 남"
    language: rust
    verification: run
  - id: ex-day31-modify
    title: 기본값 리스트 함정 고치기
    kind: modify
    objective: 바꿀 수 있는 기본값 대신 None을 쓰고 함수 안에서 새 리스트를 만든다.
    prompt: 'add_tag를 두 번 부르면 두 결과가 같은 리스트가 되어 "[''a'', ''b''] [''a'', ''b'']"가 출력됩니다. 부를 때마다 새 리스트를 쓰도록 고쳐 "[''a''] [''b'']"가 나오게 하세요.'
    starter: |-
      def add_tag(tag, tags=[]):
          tags.append(tag)
          return tags


      print(add_tag("a"), add_tag("b"))
    answer: |-
      def add_tag(tag, tags=None):
          if tags is None:
              tags = []
          tags.append(tag)
          return tags


      print(add_tag("a"), add_tag("b"))
    output: "['a'] ['b']"
    hint: "기본값은 def 줄이 실행될 때 딱 한 번 만들어집니다. None을 기본값으로 두고, 몸통에서 새 리스트를 만드세요."
    explanation: "tags=[]의 빈 리스트는 함수가 만들어질 때 하나만 생겨서 모든 호출이 공유합니다. 첫 호출이 'a'를 넣으면 다음 호출의 기본값에도 'a'가 남아 있습니다. 바꿀 수 있는 값(리스트, 사전)을 기본값으로 쓰지 마세요."
    commonMistakes:
      - "tags=list()로 바꿔도 똑같이 한 번만 만들어진다는 것을 모름"
      - "if not tags:로 검사해 부른 쪽이 넘긴 빈 리스트까지 새 리스트로 바꿔 버림"
    language: python
    verification: run
  - id: ex-day31-debug
    title: 기록이 모두 같아지는 버그 고치기
    kind: debug
    objective: 바뀌는 리스트를 기록할 때는 그 순간의 복사본을 넣어야 한다는 것을 확인한다.
    prompt: "판의 변화를 한 단계씩 기록하려 했는데 세 기록이 모두 [1, 1, 1]입니다. 고쳐서 '[[1, 0, 0], [1, 1, 0], [1, 1, 1]]'이 출력되게 하세요."
    starter: |-
      board = [0, 0, 0]
      history = []
      for i in range(3):
          board[i] = 1
          history.append(board)
      print(history)
    answer: |-
      board = [0, 0, 0]
      history = []
      for i in range(3):
          board[i] = 1
          history.append(board.copy())
      print(history)
    output: "[[1, 0, 0], [1, 1, 0], [1, 1, 1]]"
    starterOutput: "[[1, 1, 1], [1, 1, 1], [1, 1, 1]]"
    hint: "history에 들어간 세 칸이 모두 같은 board를 가리키고 있습니다."
    explanation: "append(board)는 board의 '그때 모습'이 아니라 board라는 리스트 자체를 넣습니다. 그 뒤 board가 바뀌면 기록된 모든 칸이 바뀐 모습을 보여 줍니다. 그 순간의 모습을 남기려면 복사본(board.copy() 또는 board[:])을 넣으세요. 판이 2차원이면 깊은 복사가 필요합니다."
    commonMistakes:
      - "history = history + [board]로 바꿔도 같은 리스트를 넣는다는 것을 모름"
      - "2차원 판에서 board.copy()만 써서 안쪽 줄이 여전히 공유됨"
    language: python
    verification: run
  - id: ex-day31-independent
    title: Rust로 단계별 기록 남기기
    kind: independent
    objective: clone으로 그 순간의 복사본을 기록한다.
    prompt: "board를 [0, 0, 0]에서 시작해 i번 칸을 차례로 1로 바꾸며 매번 복사본을 history에 넣고, '[[1, 0, 0], [1, 1, 0], [1, 1, 1]]'을 출력하세요."
    starter: |-
      fn main() {
          let board = vec![0, 0, 0];
          println!("{board:?}");
      }
    answer: |-
      fn main() {
          let mut board = vec![0, 0, 0];
          let mut history: Vec<Vec<i32>> = Vec::new();
          for i in 0..3 {
              board[i] = 1;
              history.push(board.clone());
          }
          println!("{history:?}");
      }
    output: "[[1, 0, 0], [1, 1, 0], [1, 1, 1]]"
    hint: "history.push(board)라고 쓰면 board의 소유권이 넘어가 다음 반복에서 쓸 수 없습니다. 무엇을 넣어야 할까요?"
    explanation: "Rust에서는 push(board)가 컴파일 오류(E0382)라서, Python에서 조용히 생기던 '같은 리스트를 여러 번 기록'하는 버그가 처음부터 불가능합니다. clone()으로 복사본을 명시적으로 만들어야 하므로 복사 비용도 코드에 드러납니다."
    commonMistakes:
      - "history.push(&board)로 참조를 넣으려다 board를 바꿀 수 없어 오류가 남"
      - "board를 mut로 만들지 않음"
    language: rust
    verification: run
quiz:
  - id: quiz-day31-01
    question: Python에서 a == b와 a is b의 차이는?
    choices:
      - 같은 뜻이다
      - "==는 값(내용)이 같은지, is는 같은 객체인지 비교한다"
      - "is는 값, ==는 객체를 비교한다"
      - "is는 숫자에만 쓴다"
    answerIndex: 1
    explanation: 내용이 같은 리스트를 따로 두 개 만들면 ==는 참, is는 거짓입니다. is는 None을 확인할 때(x is None)나 별칭인지 확인할 때 씁니다. 숫자나 문자열을 is로 비교하면 우연히 맞았다 틀렸다 하니 ==를 쓰세요.
  - id: quiz-day31-02
    question: s = "hi"; t = s; t += "!" 뒤의 s는?
    choices: ['"hi!"', '"hi"', '"!"', "오류"]
    answerIndex: 1
    explanation: 문자열은 바꿀 수 없는 객체라 t += "!"는 새 문자열 "hi!"를 만들어 t만 그것을 가리키게 합니다. 리스트라면 +=가 제자리에서 바꿔서 s에도 보였을 것입니다. 바꿀 수 없는 객체는 별칭이 있어도 안전합니다.
  - id: quiz-day31-03
    question: 얕은 복사(copy)와 깊은 복사(deepcopy)의 차이는?
    choices:
      - 차이가 없다
      - 얕은 복사는 바깥 그릇만 새로 만들고 안의 객체는 공유, 깊은 복사는 안의 객체까지 모두 새로 만든다
      - 깊은 복사는 바깥만, 얕은 복사는 안쪽까지 복사한다
      - 얕은 복사는 숫자만 복사한다
    answerIndex: 1
    explanation: 안에 바꿀 수 없는 값(정수, 문자열)만 있으면 두 방법의 결과가 같습니다. 안에 리스트나 사전 같은 바꿀 수 있는 객체가 있을 때 차이가 생깁니다. 깊은 복사는 더 느리고 메모리를 더 씁니다.
  - id: quiz-day31-04
    question: def f(x, items=[]):의 문제는?
    choices:
      - 문법 오류다
      - 기본값 리스트가 함수를 만들 때 한 번만 생겨서, 모든 호출이 같은 리스트를 공유한다
      - items를 쓸 수 없다
      - x가 무시된다
    answerIndex: 1
    explanation: 기본값은 def가 실행될 때 계산되어 함수에 붙어 있습니다. 호출마다 새 리스트를 원하면 items=None으로 두고 몸통에서 items = []를 만드세요. 사전, 집합도 같습니다.
  - id: quiz-day31-05
    question: Rust의 let b = a;(a는 Vec)에 대한 설명으로 옳은 것은?
    choices:
      - 얕은 복사가 일어나 a와 b가 목록을 공유한다
      - 소유권이 b로 옮겨 가서 이후 a를 쓸 수 없다. 복사본은 a.clone()으로 명시해야 한다
      - 깊은 복사가 일어난다
      - 컴파일 오류다
    answerIndex: 1
    explanation: Rust는 '두 이름이 같은 목록을 몰래 공유하며 둘 다 바꾸는' 상태를 허용하지 않습니다. 이동(소유권 넘기기), 복사(clone), 빌림(&, &mut) 중 무엇인지 코드에 드러나야 합니다. 정말 공유가 필요하면 Rc<RefCell<T>>처럼 자료형으로 공유를 밝힙니다.
---

## 1. 오늘 배울 내용

Day 27과 Day 29에서 Python의 `b = a`가 복사가 아니라는 것을 몇 번 봤습니다. 오늘은 **별칭**(같은 것을 가리키는 다른 이름)과 **복사**(새로 만든 것)를 제대로 구별합니다.

1. `is`(같은 객체인가)와 `==`(같은 값인가)로 별칭을 확인합니다.
2. **바꿀 수 있는 객체**와 **바꿀 수 없는 객체**를 구별합니다.
   - 바꿀 수 있는 객체: 리스트, 사전, 집합
   - 바꿀 수 없는 객체: 정수, 실수, 문자열, 튜플
3. 두 가지 복사를 중첩 리스트로 비교합니다.
   - **얕은 복사**: `copy()`, `[:]`, `list()`
   - **깊은 복사**: `copy.deepcopy()`
4. 바꿀 수 있는 **기본값 인자** `def f(box=[])`의 함정을 고칩니다.
5. C(값 배열 복사와 포인터 배열 복사), Rust(이동, `clone`, 빌림, `Rc<RefCell>`)로 같은 개념을 비교합니다.
6. 되돌리기 기록을 **그 순간의 복사본**으로 만들어 봅니다.

## 2. 왜 필요한가

별칭과 복사를 헷갈리면 "분명 이쪽만 바꿨는데 저쪽도 바뀌었다"는 버그가 생깁니다. 오류 메시지도 없이 데이터가 조용히 섞이기 때문에 찾기가 아주 어렵습니다.

- 게임 참가자마다 판을 만들었는데, 한 사람이 둔 수가 모든 판에 나타납니다.
- 변경 기록(되돌리기)을 모았는데, 기록이 전부 마지막 상태입니다.
- 함수를 부를 때마다 목록이 새로 시작해야 하는데, 이전 호출의 값이 남아 있습니다.

반대로 필요 없는 복사를 하면 느리고 메모리를 낭비합니다. 수백만 칸짜리 목록을 함수에 넘길 때마다 복사할 필요는 없습니다. **언제 공유하고 언제 복사할지** 스스로 정할 수 있어야 합니다.

## 3. 그림으로 이해하기

중첩 리스트 `nested = [[1, 2], [3, 4]]`를 세 가지 방식으로 "복사"하면 이렇게 됩니다.

```text
별칭: a = nested
    nested ──┐
             ▼
    a ─────▶ [ ●, ● ]   바깥 리스트가 하나뿐
               │  └──▶ [3, 4]
               └─────▶ [1, 2]

얕은 복사: b = nested.copy()
    nested ──▶ [ ●, ● ] ─┐
                 │  │    │ 안쪽 리스트는 공유!
    b ───────▶ [ ●, ● ]  │
                 │  └────┴──▶ [3, 4]
                 └──────────▶ [1, 2]

깊은 복사: c = copy.deepcopy(nested)
    nested ──▶ [ ●, ● ] ──▶ [1, 2], [3, 4]
    c ───────▶ [ ●, ● ] ──▶ [1, 2], [3, 4]   (모두 새것)
```

- `b[0][0] = 100`은 공유된 안쪽 리스트 `[1, 2]`를 바꾸므로 `nested`에도 보입니다.
- `b.append([5, 6])`은 `b`의 바깥 리스트만 바꾸므로 `nested`에는 보이지 않습니다.
- `c`는 무엇을 바꿔도 `nested`와 관계가 없습니다.

## 4. 천천히 풀어보기

### 4.1 is와 ==

| 비교     | 묻는 것                          | `[1, 2] == [1, 2]` | 따로 만든 두 리스트 `is` |
| -------- | -------------------------------- | ------------------ | ------------------------ |
| `a == b` | 내용이 같은가                    | `True`             |                          |
| `a is b` | 메모리의 **같은 객체**인가(별칭) |                    | `False`                  |

`is`는 `x is None`처럼 특별한 객체 하나를 확인하거나, 별칭인지 확인할 때만 쓰세요.

### 4.2 바꿀 수 있는가

| 종류              | 예                             | 별칭이 있을 때                            |
| ----------------- | ------------------------------ | ----------------------------------------- |
| 바꿀 수 없는 객체 | `int`, `float`, `str`, `tuple` | 안전. `+=`는 새 객체를 만들어 한쪽만 바꿈 |
| 바꿀 수 있는 객체 | `list`, `dict`, `set`          | 한쪽에서 바꾸면 다른 이름에도 보임        |

튜플은 바꿀 수 없지만, **튜플 안에 든 리스트**는 바꿀 수 있습니다. `pair = ([1], 2)`에서 `pair[0].append(9)`는 허용됩니다. 튜플이 "어떤 객체들을 가리키는지"는 고정이지만, 가리키는 객체 자체가 바뀌는 것은 막지 않기 때문입니다.

### 4.3 복사 방법

| 방법                          | 바깥 | 안쪽 객체    | 언제 쓰나                       |
| ----------------------------- | ---- | ------------ | ------------------------------- |
| `b = a`                       | 공유 | 공유         | 같은 것을 다른 이름으로 부를 때 |
| `a.copy()`, `a[:]`, `list(a)` | 새로 | 공유         | 안에 바꿀 수 없는 값만 있을 때  |
| `[row[:] for row in a]`       | 새로 | 한 단계 새로 | 2차원 목록(안쪽이 숫자·문자열)  |
| `copy.deepcopy(a)`            | 새로 | 모두 새로    | 여러 단계로 중첩된 구조         |

### 4.4 기본값 인자 함정

```python
def add_item(item, box=[]):     # ← 이 [] 는 def 줄이 실행될 때 딱 한 번 만들어진다
    box.append(item)
    return box
```

함수의 기본값은 **함수를 만들 때 한 번** 계산되어 함수에 붙어 있습니다. 그래서 모든 호출이 **같은 리스트**를 기본값으로 씁니다. 해결은 "없음"을 뜻하는 `None`을 기본값으로 두고, 몸통에서 새 리스트를 만드는 것입니다.

### 4.5 C와 Rust에서는

- **C**: 배열에 값만 들어 있으면 `memcpy`로 복사한 결과는 완전히 따로입니다. 하지만 배열에 **포인터**가 들어 있으면, 복사되는 것은 주소뿐이라 가리키는 대상은 공유됩니다. 이것이 C의 얕은 복사입니다. 깊은 복사는 가리키는 대상까지 직접 옮겨야 합니다.
- **Rust**: 기본 동작이 **이동**(소유권 넘기기)이라 몰래 공유되는 일이 없습니다. 복사가 필요하면 `clone()`(Vec은 안쪽까지 복사), 잠시 함께 보려면 빌림(`&`, `&mut`), 정말 여러 곳이 함께 바꿔야 하면 `Rc<RefCell<T>>`처럼 **공유 사실을 자료형으로** 드러냅니다.

## 5. C로 구현하기

```c
// 파일: copies.c
#include <stdio.h>
#include <string.h>

int main(void) {
    int a[3] = {1, 2, 3};
    int b[3];
    memcpy(b, a, sizeof a);                 // 값들을 통째로 복사
    int *alias = a;                         // 복사가 아니라 같은 배열을 가리킴
    b[0] = 99;
    alias[1] = 50;
    printf("a = %d %d %d, b = %d %d %d\n", a[0], a[1], a[2], b[0], b[1], b[2]);

    int row0[2] = {1, 2};
    int row1[2] = {3, 4};
    int *table[2] = {row0, row1};           // 줄을 '가리키는' 포인터 배열

    int *shallow[2];
    memcpy(shallow, table, sizeof table);   // 포인터(주소)만 복사 = 얕은 복사
    shallow[0][0] = 100;                    // row0이 바뀐다

    int deep[2][2];                         // 값을 새 칸에 옮기기 = 깊은 복사
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 2; c++) {
            deep[r][c] = table[r][c];
        }
    }
    deep[1][1] = 400;                       // row1은 그대로

    printf("row0 = %d %d, row1 = %d %d\n", row0[0], row0[1], row1[0], row1[1]);
    printf("deep = %d %d / %d %d\n", deep[0][0], deep[0][1], deep[1][0], deep[1][1]);
    printf("shallow[0]과 table[0]이 같은 곳? %d\n", shallow[0] == table[0]);
    return 0;
}
```

실행 결과:

```text
a = 1 50 3, b = 99 2 3
row0 = 100 2, row1 = 3 4
deep = 100 2 / 3 400
shallow[0]과 table[0]이 같은 곳? 1
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memcpy(b, a, sizeof a);`               | `a`의 12바이트를 `b`로 옮깁니다. `int`만 들어 있으니 완전히 따로 된 복사본입니다. `b[0] = 99`는 `a`에 영향이 없습니다.                                                              |
| `int *alias = a;`                       | 복사가 아니라 같은 배열을 가리키는 포인터(별칭)입니다. `alias[1] = 50`은 `a[1]`을 바꿉니다.                                                                                         |
| `int *table[2] = {row0, row1};`         | 칸마다 **주소**가 들어 있는 포인터 배열입니다. 2차원 목록을 가리키는 방식입니다.                                                                                                    |
| `memcpy(shallow, table, sizeof table);` | 주소 두 개만 복사됩니다. `shallow[0]`과 `table[0]`은 같은 `row0`을 가리키므로 `shallow[0][0] = 100`이 `row0`을 바꿉니다. Python의 얕은 복사와 같은 모습입니다.                      |
| `deep[r][c] = table[r][c];`             | 가리키는 값까지 새 칸에 옮긴 깊은 복사입니다. `deep[1][1] = 400`은 `row1`에 영향이 없습니다. `shallow`를 통해 100으로 바뀐 **뒤에** 복사했기 때문에 `deep`에도 100이 들어 있습니다. |

## 6. Python으로 구현하기

```python
# 파일: aliasing.py
import copy

a = [1, 2, 3]
b = a                                       # 별칭: 같은 리스트
b.append(4)
print(a, a is b)

s = "hi"
t = s
t += "!"                                    # 문자열은 바꿀 수 없어 새 문자열이 생긴다
print(s, t, s is t)

nested = [[1, 2], [3, 4]]
shallow = nested.copy()                     # 얕은 복사: 바깥 리스트만 새로
deep = copy.deepcopy(nested)                # 깊은 복사: 안쪽까지 모두 새로
shallow[0][0] = 100                         # 안쪽 리스트는 nested와 공유
shallow.append([5, 6])                      # 바깥 리스트는 따로
deep[1][1] = 400
print("nested: ", nested)
print("shallow:", shallow)
print("deep:   ", deep)
print(nested[0] is shallow[0], nested[0] is deep[0])


def add_item(item, box=[]):                 # 기본값 리스트는 함수를 만들 때 한 번만 생긴다
    box.append(item)
    return box


first = add_item("a")
second = add_item("b")
print("함정:", first, second, first is second)


def add_item_safe(item, box=None):
    if box is None:
        box = []                            # 부를 때마다 새 리스트
    box.append(item)
    return box


print("안전:", add_item_safe("a"), add_item_safe("b"))

pair = ([1], 2)                             # 튜플은 못 바꾸지만 안의 리스트는 바뀐다
pair[0].append(9)
print(pair)
```

실행 결과:

```text
[1, 2, 3, 4] True
hi hi! False
nested:  [[100, 2], [3, 4]]
shallow: [[100, 2], [3, 4], [5, 6]]
deep:    [[1, 2], [3, 400]]
True False
함정: ['a', 'b'] ['a', 'b'] True
안전: ['a'] ['b']
([1, 9], 2)
```

### 코드 한 부분씩 읽기

| 코드                       | 설명                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `b = a` / `b.append(4)`    | 별칭입니다. `a is b`가 참입니다.                                                                                                    |
| `t += "!"`                 | 문자열은 바꿀 수 없어서 새 문자열이 만들어지고 `t`만 그것을 가리킵니다. `s is t`는 거짓이 됩니다.                                   |
| `shallow = nested.copy()`  | 바깥 리스트만 새로 만듭니다. `nested[0] is shallow[0]`이 참이라는 것이 안쪽 공유의 증거입니다.                                      |
| `shallow[0][0] = 100`      | 공유된 안쪽 리스트를 바꿔 `nested`도 바뀝니다.                                                                                      |
| `shallow.append([5, 6])`   | 바깥 리스트는 따로라 `nested`에는 세 번째 줄이 없습니다.                                                                            |
| `copy.deepcopy(nested)`    | 안쪽까지 새로 만들어 `deep[1][1] = 400`이 `nested`에 영향이 없습니다. `deep`은 `shallow`를 바꾸기 **전에** 만들어서 100도 없습니다. |
| `first is second` → `True` | 기본값 리스트를 공유해서 두 호출의 결과가 **같은 리스트**입니다.                                                                    |
| `if box is None: box = []` | 부를 때마다 새 리스트를 만듭니다.                                                                                                   |
| `pair[0].append(9)`        | 튜플 안의 리스트는 바꿀 수 있습니다.                                                                                                |

## 7. Rust로 구현하기

Rust는 별칭과 복사를 **자료형과 문법으로 구별**하게 만듭니다. 몰래 공유되는 일이 없어서 Python의 얕은 복사 문제가 처음부터 생기지 않습니다.

```rust
// 파일: copies.rs
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let nested = vec![vec![1, 2], vec![3, 4]];
    let mut copied = nested.clone();        // Vec의 clone은 안쪽 Vec까지 모두 복사
    copied[0][0] = 100;
    copied.push(vec![5, 6]);
    println!("nested: {nested:?}");
    println!("copied: {copied:?}");

    let moved = nested;                     // 대입은 복사가 아니라 소유권 이동
    println!("moved:  {moved:?}");

    let mut data = vec![1, 2, 3];
    {
        let alias = &mut data;              // 별칭은 빌림으로만, 그리고 하나만
        alias.push(4);
    }
    println!("data:   {data:?}");

    // 여러 곳이 같은 목록을 함께 바꾸고 싶다면, 그 사실을 자료형으로 드러낸다
    let shared = Rc::new(RefCell::new(vec![1, 2]));
    let other = Rc::clone(&shared);         // 목록을 복사하지 않고 '공유 표'만 하나 더
    other.borrow_mut().push(3);
    println!("shared: {:?}, 공유하는 곳 {}개", shared.borrow(), Rc::strong_count(&shared));
}
```

실행 결과:

```text
nested: [[1, 2], [3, 4]]
copied: [[100, 2], [3, 4], [5, 6]]
moved:  [[1, 2], [3, 4]]
data:   [1, 2, 3, 4]
shared: [1, 2, 3], 공유하는 곳 2개
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let mut copied = nested.clone();`      | `Vec<Vec<i32>>`의 `clone`은 안쪽 `Vec`도 각각 `clone`합니다. Python의 `deepcopy`와 같은 결과라 `copied[0][0] = 100`이 `nested`에 영향이 없습니다.                                 |
| `let moved = nested;`                   | 복사가 아니라 **소유권 이동**입니다. 이 줄 뒤에서 `nested`를 쓰면 컴파일 오류(E0382)입니다(Day 32).                                                                               |
| `let alias = &mut data; alias.push(4);` | Rust의 별칭은 빌림입니다. `&mut` 빌림이 살아 있는 동안에는 `data`라는 이름으로 접근할 수 없어서, "두 이름으로 동시에 바꾸기"가 불가능합니다.                                      |
| `Rc::new(RefCell::new(vec![1, 2]))`     | `Rc`는 여러 곳이 **함께 소유**하는 상자, `RefCell`은 공유 중에도 **실행 중 검사를 받아** 바꿀 수 있게 하는 상자입니다. Python 리스트의 공유를 흉내 내려면 이만큼 명시해야 합니다. |
| `Rc::clone(&shared)`                    | 목록을 복사하지 않고 "공유하는 사람 수"만 하나 늘립니다. `strong_count`가 2입니다.                                                                                                |
| `other.borrow_mut().push(3)`            | `other`를 통해 바꾼 내용이 `shared`에도 보입니다. 동시에 두 곳이 `borrow_mut`하면 실행 중에 패닉으로 막힙니다.                                                                    |

`Rc<RefCell<T>>`는 트리나 그래프처럼 여러 곳이 같은 노드를 가리켜야 할 때(Day 62, 64) 다시 만납니다.

## 8. 실행 추적

Python 코드의 `nested`, `shallow`, `deep`이 각 줄 뒤에 어떤 모습인지 따라갑니다.

| 줄                             | `nested`             | `shallow`                     | `deep`               |
| ------------------------------ | -------------------- | ----------------------------- | -------------------- |
| `nested = [[1, 2], [3, 4]]`    | `[[1, 2], [3, 4]]`   |                               |                      |
| `shallow = nested.copy()`      | `[[1, 2], [3, 4]]`   | `[[1, 2], [3, 4]]`(안쪽 공유) |                      |
| `deep = copy.deepcopy(nested)` | `[[1, 2], [3, 4]]`   | `[[1, 2], [3, 4]]`            | `[[1, 2], [3, 4]]`   |
| `shallow[0][0] = 100`          | `[[100, 2], [3, 4]]` | `[[100, 2], [3, 4]]`          | `[[1, 2], [3, 4]]`   |
| `shallow.append([5, 6])`       | `[[100, 2], [3, 4]]` | `[[100, 2], [3, 4], [5, 6]]`  | `[[1, 2], [3, 4]]`   |
| `deep[1][1] = 400`             | `[[100, 2], [3, 4]]` | `[[100, 2], [3, 4], [5, 6]]`  | `[[1, 2], [3, 400]]` |

네 번째 줄에서 `shallow`만 바꿨는데 `nested`도 바뀐 것이 얕은 복사의 특징입니다.

## 9. 다른 예제로 다시 이해하기

**변화 기록과 참가자별 판.** 판이 바뀔 때마다 기록을 남기거나, 같은 빈 판에서 참가자마다 따로 시작하려면 **그 순간의 복사본**이 필요합니다.

```python
# 파일: snapshots.py
import copy

board = [0, 0, 0]
wrong, right = [], []
for i in range(3):
    board[i] = 1
    wrong.append(board)                     # 같은 리스트를 세 번 넣음
    right.append(board.copy())              # 그 순간의 모습을 복사해 넣음
print("잘못:  ", wrong)
print("올바름:", right)

template = [["."] * 3 for _ in range(2)]    # 모든 참가자가 같은 빈 판에서 시작
p1 = copy.deepcopy(template)
p2 = [row[:] for row in template]           # 줄마다 복사해도 깊은 복사와 같은 효과
p1[0][0] = "X"
p2[1][2] = "O"
print("template:", template)
print("p1:", p1, " p2:", p2)
```

실행 결과:

```text
잘못:   [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
올바름: [[1, 0, 0], [1, 1, 0], [1, 1, 1]]
template: [['.', '.', '.'], ['.', '.', '.']]
p1: [['X', '.', '.'], ['.', '.', '.']]  p2: [['.', '.', '.'], ['.', '.', 'O']]
```

`wrong`에는 **같은 리스트**가 세 번 들어가서, 마지막 모습 `[1, 1, 1]`이 세 번 보입니다. `right`에는 매번 새 복사본이 들어가 단계별 모습이 남았습니다. 2차원 판은 `copy.deepcopy`나 "줄마다 복사"(`[row[:] for row in template]`)로 만들어야 참가자의 판이 서로, 그리고 원본 틀과 섞이지 않습니다.

**Rust로 되돌리기 기록 만들기.** 글자를 입력할 때마다 **바꾸기 전 모습**을 복사해 쌓아 두면, 거꾸로 꺼내며 되돌릴 수 있습니다.

```rust
// 파일: undo.rs
fn main() {
    let mut text = String::new();
    let mut history: Vec<String> = Vec::new();
    for word in ["안녕", "하세요", "!"] {
        history.push(text.clone());         // 바꾸기 전 모습을 복사해 둔다
        text.push_str(word);
        println!("입력 → {text:?}");
    }
    while let Some(previous) = history.pop() {
        text = previous;                    // 저장해 둔 복사본으로 되돌린다
        println!("되돌리기 → {text:?}");
    }
}
```

실행 결과:

```text
입력 → "안녕"
입력 → "안녕하세요"
입력 → "안녕하세요!"
되돌리기 → "안녕하세요"
되돌리기 → "안녕"
되돌리기 → ""
```

`history.push(text)`라고 쓰면 `text`의 소유권이 넘어가서 다음 줄의 `text.push_str`이 컴파일 오류가 됩니다. 그래서 `text.clone()`으로 복사본을 명시적으로 만들었습니다. 마지막에 넣은 것을 먼저 꺼내는 이 구조가 **스택**이고, Day 58에서 되돌리기 스택으로 다시 만납니다.

## 10. 복사 방법 고르기

| 상황                                 | Python                      | Rust                    | C                             |
| ------------------------------------ | --------------------------- | ----------------------- | ----------------------------- |
| 같은 것을 다른 이름으로(바꾸면 함께) | `b = a`                     | `let b = &mut a;`(잠시) | `int *p = a;`                 |
| 잠시 읽기만                          | `b = a`(바꾸지 않기로 약속) | `let b = &a;`           | `const int *p = a;`           |
| 1차원 목록 복사                      | `a.copy()`, `a[:]`          | `a.clone()`             | `memcpy(b, a, sizeof a)`      |
| 중첩 구조 복사                       | `copy.deepcopy(a)`          | `a.clone()`             | 가리키는 대상까지 직접 복사   |
| 넘겨주고 원래 이름은 더 안 씀        | (개념 없음)                 | `let b = a;`(이동)      | (개념 없음)                   |
| 여러 곳이 계속 함께 바꿈             | 그냥 공유(기본)             | `Rc<RefCell<T>>`        | 포인터 공유(규칙은 직접 지킴) |

## 11. 세 언어 비교

| 관점                     | Python                     | C                                             | Rust                               |
| ------------------------ | -------------------------- | --------------------------------------------- | ---------------------------------- |
| 대입 `b = a`의 기본 동작 | 별칭(같은 객체)            | 값 복사(배열은 대입 불가, 포인터는 주소 복사) | 이동(Copy 자료형은 복사)           |
| 몰래 공유될 수 있나      | 예(얕은 복사, 기본값 인자) | 예(포인터 복사)                               | 아니요(공유는 `&`나 `Rc`로 드러냄) |
| 깊은 복사                | `copy.deepcopy`            | 직접 구현                                     | `clone`(대부분 깊게)               |
| 같은 객체인지 확인       | `is`                       | 포인터 `==`                                   | `std::ptr::eq`, `Rc::ptr_eq`       |

## 12. 자주 하는 실수

### 실수 1: 기록에 같은 리스트를 넣는다 (Python)

실습의 디버그 문제입니다. 바뀌는 목록을 기록하려면 복사본을 넣으세요.

### 실수 2: 2차원 목록을 얕게 복사한다 (Python)

```python
# 파일: shallow_board.py
board = [[0, 0], [0, 0]]
backup = board.copy()
board[0][0] = 9
print("backup:", backup)
```

실행 결과:

```text
backup: [[9, 0], [0, 0]]
```

`copy()`는 바깥만 새로 만들어 안쪽 줄은 공유합니다. 백업이 원본을 따라 바뀌었습니다. `copy.deepcopy(board)`나 `[row[:] for row in board]`를 쓰세요.

### 실수 3: 곱셈으로 2차원 목록을 만든다 (Python)

Day 27에서 본 `[[0] * 3] * 2`도 같은 원리입니다. 바깥 `* 2`가 안쪽 리스트를 복사하지 않고 **같은 리스트를 두 번** 가리키게 합니다.

### 실수 4: 옮긴 값을 다시 쓴다 (Rust)

```rust
// 파일: use_after_move.rs (컴파일 오류: E0382)
fn main() {
    let mut board = vec![0, 0, 0];
    let mut history = Vec::new();
    for i in 0..3 {
        board[i] = 1;
        history.push(board);
    }
    println!("{history:?}");
}
```

`history.push(board)`가 `board`를 넘겨준 뒤 다음 반복에서 `board[i]`를 쓰려 해서 오류가 납니다. Python이라면 조용히 틀린 기록이 만들어질 코드를, Rust는 컴파일할 때 막습니다. `board.clone()`을 넣으세요.

### 실수 5: 바꿀 수 있는 기본값 인자

실습의 수정 문제입니다. `def f(x, items=[])`, `def f(x, table={})`는 모두 호출끼리 공유됩니다. `None`을 기본값으로 쓰세요.

## 13. Q&A

**Q. 항상 깊은 복사를 하면 안전하지 않나요?**

A. 안전하지만 느리고 메모리를 많이 씁니다. 큰 구조를 함수에 넘길 때마다 깊은 복사를 하면 프로그램이 크게 느려집니다. "함수는 받은 목록을 바꾸지 않는다"는 규칙을 지키고, **바꿔야 할 때만** 복사하는 것이 일반적입니다.

**Q. Python의 정수는 왜 별칭이 문제가 안 되나요?**

A. 정수는 바꿀 수 없는 객체라서, "바꾸는" 모든 연산이 새 정수를 만들어 그 이름만 다시 묶기 때문입니다. `a = b = 10`이어도 `a += 1`은 `b`에 영향이 없습니다. 그래서 Python은 작은 정수를 미리 만들어 두고 여러 곳에서 공유하기도 합니다(그래서 `is`로 숫자를 비교하면 결과가 헷갈립니다).

**Q. `copy.copy`와 `list.copy`는 같은가요?**

A. 리스트에 대해서는 같은 얕은 복사입니다. `copy.copy`는 리스트뿐 아니라 사전, 집합, 사용자가 만든 객체에도 쓸 수 있는 일반적인 얕은 복사 함수입니다.

**Q. Rust의 clone은 항상 깊은 복사인가요?**

A. 자료형마다 `clone`의 뜻을 정합니다. `Vec`, `String`은 내용까지 복사합니다. 하지만 `Rc`의 `clone`은 내용을 복사하지 않고 "공유 표"만 하나 늘립니다(7절). 그래서 Rust에서는 공유할 때 `Rc::clone(&x)`처럼 쓰는 관례가 있습니다. 읽는 사람이 "이것은 비싼 복사가 아니다"라는 것을 알 수 있게 하려는 것입니다.

## 14. 핵심 요약

- **별칭**은 같은 객체를 가리키는 다른 이름, **복사**는 새로 만든 객체입니다. Python은 `is`(같은 객체)와 `==`(같은 값)로 구별합니다.
- 바꿀 수 없는 객체(정수, 문자열, 튜플)는 별칭이 있어도 안전합니다. 바꿀 수 있는 객체(리스트, 사전)는 한쪽의 변경이 다른 이름에도 보입니다.
- **얕은 복사**(`copy()`, `[:]`, `list()`)는 바깥만 새로, 안쪽은 공유합니다. **깊은 복사**(`copy.deepcopy`)는 안쪽까지 새로 만듭니다. 중첩 구조의 백업·기록에는 깊은 복사가 필요합니다.
- 바꿀 수 있는 기본값 인자(`box=[]`)는 호출끼리 공유됩니다. `box=None`으로 두고 몸통에서 만드세요.
- C: 값 배열의 `memcpy`는 따로 된 복사, 포인터 배열의 복사는 주소만 옮기는 얕은 복사입니다.
- Rust: 대입은 이동, 복사는 `clone`(Vec은 깊게), 잠시 함께 보기는 빌림, 계속 함께 바꾸기는 `Rc<RefCell<T>>`로 **공유를 드러냅니다**. 그래서 몰래 섞이는 버그가 없습니다.

## 15. 도전 문제

1. **(Python)** 학생별 점수 사전 `{"민지": [90, 80], "준호": [70]}`의 백업을 만든 뒤 원본에 점수를 추가하세요. `dict(원본)`, `copy.deepcopy(원본)`으로 만든 백업이 각각 어떻게 되는지 확인하세요.
2. **(C)** 문자열 포인터 배열 `const char *names[] = {"kim", "lee"};`을 복사한 배열과, 각 이름을 `char copy[2][10]`에 `strcpy`로 옮긴 배열의 차이를 설명하는 프로그램을 만드세요.
3. **(Rust)** `Rc<RefCell<Vec<i32>>>`를 세 곳에서 공유하고, 한 곳에서 값을 추가한 뒤 나머지 두 곳에서 읽어 보세요. `Rc::strong_count`가 어떻게 바뀌는지, 한 공유자를 `drop`하면 어떻게 되는지도 확인하세요.
4. **(세 언어)** 3×3 틱택토 판을 참가자 두 명에게 나눠 주고 각자 한 수씩 둔 뒤, 원본 빈 판이 바뀌지 않았는지 확인하는 프로그램을 만드세요.
