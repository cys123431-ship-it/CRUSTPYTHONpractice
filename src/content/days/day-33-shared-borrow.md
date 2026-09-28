---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-33-shared-borrow
courseId: crp-92
phaseId: phase-04
dayNumber: 33
date: "2026-11-02"
title: 빌림의 규칙 — 읽기는 여럿이, 쓰기는 하나만
summary: Rust의 빌림 규칙(공유 빌림 &는 여러 개, 가변 빌림 &mut는 하나만, 그리고 둘을 동시에 가질 수 없음)을 깊이 익힙니다. 빌림이 마지막으로 쓰인 곳에서 끝난다는 것, 참조를 돌려주는 함수, 흔한 E0502 오류를 값 복사·순서 바꾸기·인덱스로 푸는 방법, 한 목록을 겹치지 않는 두 가변 조각으로 나누는 split_at_mut을 다룹니다. C의 const 포인터와 dst·src가 겹칠 때 결과가 달라지는 별칭 문제, Python에서 반복 중에 사전을 바꾸면 나는 오류와 튜플로 읽기 전용 넘기기를 비교하고, 도서 대출 표시를 '위치를 찾아 필요한 순간에만 빌리는' 방식으로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-32-move-clone]
learningObjectives:
  - 공유 빌림과 가변 빌림의 규칙을 설명하고, 컴파일러가 막는 코드와 허용하는 코드를 구별한다.
  - 빌림이 마지막으로 쓰인 곳에서 끝난다는 것을 이용해 코드 순서를 고친다.
  - E0502, E0499 오류를 값 복사, 순서 바꾸기, 인덱스 사용, split_at_mut으로 해결한다.
  - C의 const 포인터로 읽기 전용을 약속하고, 겹치는 포인터(별칭)가 결과를 바꾸는 예를 설명한다.
  - Python에서 반복 중 변경 오류를 피하고, 튜플로 읽기 전용 값을 넘긴다.
concepts:
  [
    shared borrow,
    mutable borrow,
    borrow checker,
    non lexical lifetimes,
    E0502,
    E0499,
    split_at_mut,
    const pointer,
    aliasing,
    read only view,
    iteration invalidation,
  ]
runnerMode: python
playgroundSource: |
  # 파일: iterate_change.py — 반복하면서 사전을 바꾸면 어떻게 되는지 보세요.
  counts = {"사과": 0, "배": 3, "감": 0}
  try:
      for key in counts:
          if counts[key] == 0:
              del counts[key]
  except RuntimeError as error:
      print("RuntimeError:", error)
  for key in list(counts):         # 열쇠 목록의 복사본을 돈다
      if counts[key] == 0:
          del counts[key]
  print(counts)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day33-predict-rs
    title: 값을 복사한 뒤 바꾸기 예측하기
    kind: predict
    objective: 정수 값을 복사해 두면 빌림 없이 Vec을 바꿀 수 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let mut v = vec![1, 2, 3];
          let first = v[0];
          v.push(first * 10);
          let r = &v;
          println!("{} {:?}", r.len(), r);
      }
    answer: "4 [1, 2, 3, 10]"
    hint: "v[0]은 i32라 값이 복사됩니다. first는 v를 빌리고 있지 않습니다."
    explanation: "let first = v[0];은 참조가 아니라 복사된 정수 1이라, 이후 v.push가 자유롭습니다. let first = &v[0];이었다면 first가 v를 빌린 채로 push를 해서 E0502 오류가 납니다(push가 목록을 옮길 수 있기 때문)."
    commonMistakes:
      - "first가 v를 빌려서 컴파일 오류가 난다고 생각함"
      - "push한 값을 10이 아니라 first로 적음"
    language: rust
    verification: run
  - id: ex-day33-predict-c
    title: 겹치는 포인터의 결과 예측하기
    kind: predict
    objective: dst와 src가 겹치면 앞에서 바꾼 값이 뒤의 계산에 쓰인다는 것을 추적한다.
    prompt: 출력되는 네 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      void add_each(int *dst, const int *src, int n) {
          for (int i = 0; i < n; i++) {
              dst[i] += src[i];
          }
      }

      int main(void) {
          int c[4] = {1, 1, 1, 1};
          add_each(c + 1, c, 3);
          printf("%d %d %d %d\n", c[0], c[1], c[2], c[3]);
          return 0;
      }
    answer: "1 2 3 4"
    hint: "i = 0에서 c[1] += c[0], i = 1에서 c[2] += c[1]인데, 이때 c[1]은 이미 2로 바뀌어 있습니다."
    explanation: "dst[i]가 c[i + 1], src[i]가 c[i]라 앞 칸에서 바꾼 결과가 다음 계산의 입력이 됩니다. 두 배열이 따로라면 1 2 2 2가 됩니다. src가 const여도 같은 곳을 dst로 바꿀 수 있어서, const는 '이 포인터로는 안 바꾼다'는 약속일 뿐 값이 바뀌지 않는다는 보장이 아닙니다. Rust에서는 같은 목록을 &mut와 &로 동시에 빌릴 수 없어 이런 호출 자체가 막힙니다."
    commonMistakes:
      - "src가 const라 원래 값 1이 계속 쓰인다고 생각해 1 2 2 2로 적음"
      - "c[0]도 바뀐다고 생각함"
    language: c
    verification: run
  - id: ex-day33-fill
    title: 반복하며 제자리 바꾸기 채우기
    kind: fill
    objective: 각 칸을 가변으로 빌려 주는 반복자를 쓴다.
    prompt: "빈칸을 채워 모든 점수에 1을 더해 '[2, 3, 4]'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut scores = vec![1, 2, 3];
          for x in scores._____() {
              *x += 1;
          }
          println!("{scores:?}");
      }
    answer: |-
      fn main() {
          let mut scores = vec![1, 2, 3];
          for x in scores.iter_mut() {
              *x += 1;
          }
          println!("{scores:?}");
      }
    output: "[2, 3, 4]"
    hint: "칸마다 &mut i32를 주는 반복자입니다. for x in &mut scores와 같습니다."
    explanation: "iter_mut는 반복하는 동안 scores 전체를 가변으로 빌리고, 칸마다 &mut i32를 하나씩 줍니다. 반복이 끝나면 빌림도 끝나 println!에서 scores를 읽을 수 있습니다. iter()라면 &i32라 *x += 1이 E0594 오류입니다."
    commonMistakes:
      - "iter()를 써서 값을 바꿀 수 없음"
      - "*를 빠뜨리고 x += 1로 써서 자료형 오류가 남"
    language: rust
    verification: run
  - id: ex-day33-modify
    title: 새 목록 대신 제자리에서 누적 합 만들기
    kind: modify
    objective: 앞 칸의 바뀐 값을 이용해 목록을 제자리에서 갱신한다.
    prompt: "새 리스트를 만들어 누적 합을 구하는 코드를, nums 자체를 제자리에서 바꾸도록 고쳐 '[1, 3, 6, 10]'이 출력되게 하세요."
    starter: |-
      nums = [1, 2, 3, 4]
      prefix = []
      total = 0
      for x in nums:
          total += x
          prefix.append(total)
      print(prefix)
    answer: |-
      nums = [1, 2, 3, 4]
      for i in range(1, len(nums)):
          nums[i] += nums[i - 1]
      print(nums)
    output: "[1, 3, 6, 10]"
    hint: "i번 칸에 바로 앞 칸의 값을 더하면, 앞 칸에는 이미 그때까지의 합이 들어 있습니다."
    explanation: "앞 칸을 먼저 바꾸고 그 바뀐 값을 다음 계산에 쓰는 것이 C 예측 문제의 '겹치는 포인터'와 같은 효과입니다. 여기서는 의도한 동작이지만, 의도하지 않았다면 버그가 됩니다. 메모리를 새로 쓰지 않는 대신 원래 값을 잃는다는 점도 기억하세요."
    commonMistakes:
      - "range(len(nums))로 시작해 nums[-1](마지막 칸)을 더해 버림"
      - "nums[i] += nums[i + 1]로 방향을 바꿔 범위를 넘음"
    language: python
    verification: run
  - id: ex-day33-debug
    title: 빌린 채로 push하는 오류 고치기
    kind: debug
    objective: E0502(공유 빌림이 살아 있는 동안의 변경)를 값 복사로 고친다.
    prompt: "이 코드는 E0502(cannot borrow `names` as mutable because it is also borrowed as immutable) 오류로 컴파일되지 않습니다. 첫 이름을 복사해 두는 방법으로 고쳐 '민지 2'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut names = vec![String::from("민지")];
          let first = &names[0];
          names.push(String::from("준호"));
          println!("{first} {}", names.len());
      }
    answer: |-
      fn main() {
          let mut names = vec![String::from("민지")];
          let first = names[0].clone();
          names.push(String::from("준호"));
          println!("{first} {}", names.len());
      }
    output: "민지 2"
    hint: "first가 names의 첫 칸을 빌리고 있는데, push는 names를 더 큰 공간으로 옮길 수 있습니다. 그러면 first가 가리키던 곳이 사라집니다."
    explanation: "빌림이 살아 있는 동안에는 빌려 준 값을 바꿀 수 없습니다. 해결 방법은 세 가지입니다. 필요한 값을 복사(clone)하거나, first를 쓰는 줄을 push보다 앞으로 옮기거나, 참조 대신 인덱스 0을 기억했다가 나중에 names[0]으로 읽는 것입니다."
    commonMistakes:
      - "let mut first로 바꿔도 해결되지 않음(빌림의 종류는 그대로)"
      - "names를 두 번 만들어 서로 다른 목록을 쓰게 됨"
    language: rust
    verification: run
  - id: ex-day33-independent
    title: Python 사전에서 0인 항목 지우기
    kind: independent
    objective: 반복 중 변경 오류를 피해 사전에서 조건에 맞는 항목을 지운다.
    prompt: 'counts = {''사과'': 0, ''배'': 3, ''감'': 0}에서 값이 0인 항목을 지워 "{''배'': 3}"을 출력하세요.'
    starter: |-
      counts = {"사과": 0, "배": 3, "감": 0}
      print(counts)
    answer: |-
      counts = {"사과": 0, "배": 3, "감": 0}
      for key in list(counts):
          if counts[key] == 0:
              del counts[key]
      print(counts)
    output: "{'배': 3}"
    hint: "for key in counts:로 돌며 지우면 RuntimeError(dictionary changed size during iteration)가 납니다. 열쇠 목록을 먼저 복사해 두고 그것을 도세요."
    explanation: "list(counts)는 그 순간의 열쇠 목록 복사본이라, 원본 사전을 지워도 반복이 흔들리지 않습니다. counts = {k: v for k, v in counts.items() if v != 0}처럼 새 사전을 만드는 방법도 있습니다. Rust에서는 반복 중인 컬렉션을 바꾸는 코드가 빌림 규칙으로 막히고, retain으로 해결합니다."
    commonMistakes:
      - "for key in counts:에서 바로 del해 RuntimeError가 남"
      - "if not counts[key]로 검사해 0이 아닌 거짓 값(빈 목록 등)까지 지움"
    language: python
    verification: run
quiz:
  - id: quiz-day33-01
    question: Rust에서 한 값에 대해 동시에 가질 수 있는 빌림은?
    choices:
      - "&mut 여러 개"
      - "& 여러 개, 또는 &mut 하나(둘을 섞을 수 없음)"
      - "& 하나와 &mut 하나"
      - 제한이 없다
    answerIndex: 1
    explanation: 읽기만 하는 빌림은 몇 개든 안전합니다. 쓰는 빌림이 있으면 그것 하나만 있어야, 읽는 쪽이 도중에 값이 바뀌는 일이나 두 쪽이 동시에 쓰는 일이 생기지 않습니다.
  - id: quiz-day33-02
    question: let a = &v; println!("{a:?}"); v.push(1);이 컴파일되는 이유는?
    choices:
      - Rust는 빌림을 검사하지 않아서
      - a가 println! 이후로 쓰이지 않아 그곳에서 빌림이 끝나서
      - push는 빌림이 필요 없어서
      - v가 Vec이 아니라서
    answerIndex: 1
    explanation: 빌림은 참조가 마지막으로 쓰인 곳에서 끝납니다(블록 끝까지가 아님). 그래서 빌림을 쓰는 줄을 앞으로 모으고 변경을 뒤로 두면 오류가 풀리는 경우가 많습니다.
  - id: quiz-day33-03
    question: 한 Vec의 두 칸을 동시에 가변으로 바꾸고 싶을 때 쓸 수 있는 것은?
    choices:
      - "&mut v[0]과 &mut v[1]을 동시에 만든다"
      - "split_at_mut으로 겹치지 않는 두 조각으로 나눈다(또는 v.swap(i, j))"
      - clone으로 두 개를 만든다
      - 불가능하다
    answerIndex: 1
    explanation: 컴파일러는 v[0]과 v[1]이 다른 칸이라는 것을 인덱스만 보고 증명하지 못해 두 &mut를 거부합니다. split_at_mut은 '겹치지 않는다'가 보장된 두 슬라이스를 돌려줘서 둘 다 바꿀 수 있습니다.
  - id: quiz-day33-04
    question: C에서 const int *p와 int *const p의 차이는?
    choices:
      - 같다
      - const int *p는 p로 값을 바꿀 수 없고, int *const p는 p가 가리키는 곳을 바꿀 수 없다
      - 둘 다 아무것도 바꿀 수 없다
      - int *const p는 값을 바꿀 수 없다
    answerIndex: 1
    explanation: "*의 왼쪽 const는 가리키는 값을, 오른쪽 const는 포인터 자체를 고정합니다. 함수가 배열을 읽기만 할 때는 const int *로 받아 의도를 드러냅니다. 다만 같은 메모리를 다른 포인터로 바꾸는 것까지 막지는 못합니다."
  - id: quiz-day33-05
    question: "Python에서 for key in d: 안에서 del d[key]를 하면?"
    choices:
      - 문제없다
      - RuntimeError(dictionary changed size during iteration)
      - 마지막 열쇠만 지워진다
      - SyntaxError
    answerIndex: 1
    explanation: 반복 중인 사전의 크기가 바뀌면 Python이 실행 중에 멈춥니다. 리스트는 오류 없이 값을 건너뛰어 더 위험합니다(Day 27). 열쇠 목록을 복사해 돌거나(list(d)), 새 사전을 만드세요.
---

## 1. 오늘 배울 내용

Day 29에서 빌림을 소개하고 Day 32에서 소유권을 배웠습니다. 오늘은 Rust를 쓰며 가장 자주 만나는 **빌림 검사기(borrow checker)** 의 규칙과, 그 오류를 푸는 방법을 연습합니다.

1. 빌림 규칙을 다시 정리합니다.
   - 공유 빌림 `&`는 여러 개 가질 수 있습니다.
   - 가변 빌림 `&mut`는 하나만 가질 수 있습니다.
   - 둘을 동시에 가질 수는 없습니다.
2. 빌림은 **마지막으로 쓰인 곳에서 끝납니다**. 이것을 이용해 코드 순서를 고칩니다.
3. 받은 슬라이스의 한 칸을 **참조로 돌려주는 함수**를 만듭니다.
4. 흔한 오류 E0502, E0499를 네 가지 방법으로 풉니다.
   - 값 복사
   - 순서 바꾸기
   - 인덱스 사용
   - `split_at_mut`
5. 다른 두 언어를 비교합니다.
   - C: `const` 포인터, 그리고 겹치는 포인터(별칭)가 결과를 바꾸는 예
   - Python: 반복 중에 사전을 바꾸면 나는 오류, 튜플로 읽기 전용 넘기기
6. 도서 대출 표시를 "위치를 찾고, 필요한 순간에만 빌리는" 방식으로 만듭니다.

## 2. 왜 필요한가

"읽는 중에 바뀌는 데이터"는 모든 언어에서 버그를 만듭니다.

- 목록을 돌면서 원소를 지우면 값을 건너뜁니다(Python 리스트, Day 27).
- 사전을 돌면서 항목을 지우면 프로그램이 멈춥니다(Python 사전).
- 목록의 한 칸을 가리키는 포인터를 들고 있는데 목록이 더 큰 공간으로 옮겨 가면, 포인터는 사라진 곳을 가리킵니다(C, C++).
- 두 포인터가 같은 메모리를 가리키면 한쪽의 변경이 다른 쪽 계산을 바꿉니다(C의 별칭).

Rust는 이런 상황을 **컴파일할 때** 찾아냅니다. 그 대가로 프로그래머는 "지금 누가 이 값을 빌리고 있지?"를 생각하며 코드를 짜야 합니다. 규칙을 이해하면 오류 메시지가 "여기서 이 버그가 생길 뻔했다"는 친절한 알림으로 보이기 시작합니다.

## 3. 그림으로 이해하기

빌림은 **도서관의 열람 규칙**과 비슷합니다.

```text
공유 빌림(&): 열람실에서 여러 사람이 같은 책을 함께 읽는다
    책 ◀── 읽는 사람 A
       ◀── 읽는 사람 B      누구도 책에 글씨를 쓰지 않는다 → 안전
       ◀── 읽는 사람 C

가변 빌림(&mut): 한 사람이 책을 가져가 고친다
    책 ◀── 고치는 사람 한 명뿐   고치는 동안 아무도 읽지 않는다 → 안전

금지: 누가 읽는 동안 다른 사람이 고친다
    책 ◀── 읽는 사람 A
       ◀── 고치는 사람 B    A가 읽던 쪽이 바뀌거나 찢겨 나갈 수 있다 ✗
```

빌림이 **언제 끝나는지**가 중요합니다. Rust는 참조가 **마지막으로 쓰인 줄**에서 빌림이 끝났다고 봅니다.

```text
let a = &v;           ┐ a의 빌림 시작
println!("{a:?}");    ┘ a의 마지막 사용 → 빌림 끝
v.push(1);            ← 이제 v를 가변으로 빌릴 수 있다(OK)

let a = &v;           ┐
v.push(1);            │ ✗ a가 아래에서 또 쓰이므로 아직 빌리는 중
println!("{a:?}");    ┘
```

## 4. 천천히 풀어보기

### 4.1 규칙 정리

| 지금 있는 빌림            | 새로 `&` 빌리기 | 새로 `&mut` 빌리기 | 주인이 직접 바꾸기 |
| ------------------------- | --------------- | ------------------ | ------------------ |
| 없음                      | 가능            | 가능               | 가능               |
| `&`가 하나 이상 살아 있음 | 가능            | **불가**(E0502)    | **불가**(E0506 등) |
| `&mut`가 살아 있음        | **불가**(E0502) | **불가**(E0499)    | **불가**           |

"살아 있음"은 **뒤에서 또 쓰인다**는 뜻입니다.

### 4.2 참조를 돌려주는 함수

```rust
fn largest(xs: &[i32]) -> &i32 { ... }
```

돌려준 `&i32`는 **받은 슬라이스의 한 칸**을 가리킵니다. 그래서 컴파일러는 "돌려받은 참조가 살아 있는 동안 원래 목록도 빌린 상태"로 봅니다. 이 참조를 들고 있으면서 목록을 바꿀 수 없습니다. 매개변수가 참조 하나뿐이라서 "돌려주는 참조는 그 매개변수에서 왔다"는 것을 컴파일러가 알아서 추론합니다. 참조 매개변수가 둘 이상이면 수명 표기가 필요할 수 있습니다(Day 45).

### 4.3 E0502를 푸는 네 가지 방법

"빌린 채로 바꾸려 한다"는 오류가 났을 때 시도할 방법입니다.

| 방법               | 언제                                           | 예                                          |
| ------------------ | ---------------------------------------------- | ------------------------------------------- |
| 값을 복사해 두기   | 필요한 것이 작은 값(Copy)이나 복사해도 되는 값 | `let top_value = *top;`, `names[0].clone()` |
| 순서 바꾸기        | 참조를 다 쓴 뒤에 바꿔도 될 때                 | 출력을 먼저 하고 `push`를 나중에            |
| 인덱스 기억하기    | 목록의 "몇 번째"만 필요할 때                   | `let pos = position(...);` 뒤에 `v[pos]`    |
| 겹치지 않게 나누기 | 한 목록의 두 부분을 동시에 바꿀 때             | `split_at_mut`, `swap`                      |

`clone`은 가장 쉬운 해결이지만 비용이 드니, 순서 바꾸기나 인덱스로 풀 수 있는지 먼저 보세요.

### 4.4 C와 Python에서는

- **C**의 `const int *p`는 "이 포인터로는 값을 바꾸지 않겠다"는 약속입니다. 하지만 **같은 메모리를 다른 포인터로 바꾸는 것**은 막지 못합니다. 그래서 `add_each(dst, src, n)`에 겹치는 두 포인터를 넘기면, `src`가 `const`여도 값이 바뀌어 결과가 달라집니다. C99의 `restrict`는 "이 포인터들은 겹치지 않는다"는 약속을 컴파일러에게 하는 표시인데, 검사는 하지 않습니다.
- **Python**에는 빌림이 없어서, 반복 중에 목록을 바꾸면 값을 건너뛰고(조용한 버그), 사전을 바꾸면 `RuntimeError`가 납니다. 바꾸지 말아야 할 값은 **튜플**(바꿀 수 없음)로 넘기거나, 복사본을 돌며 원본을 바꿉니다.

## 5. Rust로 구현하기

```rust
// 파일: borrow_rules.rs
fn sum(xs: &[i32]) -> i32 {
    xs.iter().sum()
}

fn largest(xs: &[i32]) -> &i32 {            // 받은 슬라이스의 한 칸을 빌려 돌려준다
    let mut best = &xs[0];
    for x in xs {
        if x > best {
            best = x;
        }
    }
    best
}

fn double_all(xs: &mut [i32]) {
    for x in xs.iter_mut() {
        *x *= 2;
    }
}

fn main() {
    let mut scores = vec![36, 45, 44];
    let a = &scores;                        // 공유 빌림은 여러 개 동시에
    let b = &scores;
    println!("합 {}, 첫 값 {}", sum(a), b[0]);   // a와 b는 여기서 마지막으로 쓰인다

    double_all(&mut scores);                // 공유 빌림이 끝났으므로 가변 빌림 가능
    println!("두 배: {scores:?}");

    let top = largest(&scores);             // scores의 한 칸을 가리키는 참조
    let top_value = *top;                   // 값을 복사해 두면 빌림을 끝낼 수 있다
    scores.push(top_value + 1);             // top을 더 쓰지 않으므로 바꿀 수 있다
    println!("추가 뒤: {scores:?}");

    let (left, right) = scores.split_at_mut(2);  // 겹치지 않는 두 가변 조각
    left[0] += right[0];
    println!("split_at_mut 뒤: {scores:?}");

    let mut text = String::from("빌림");
    let len = text.len();                   // 필요한 값을 먼저 구해 두기
    text.push_str(&len.to_string());        // &String이 &str로 자동으로 바뀐다
    let r = &mut text;
    r.push('!');                            // 메서드는 참조를 자동으로 따라간다
    println!("{r}");
}
```

실행 결과:

```text
합 125, 첫 값 36
두 배: [72, 90, 88]
추가 뒤: [72, 90, 88, 91]
split_at_mut 뒤: [160, 90, 88, 91]
빌림6!
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let a = &scores; let b = &scores;`                      | 공유 빌림 두 개가 동시에 있습니다. 읽기만 하니 괜찮습니다.                                                                                                           |
| `double_all(&mut scores);`                               | `a`, `b`가 윗줄에서 마지막으로 쓰였기 때문에 빌림이 이미 끝나, 가변 빌림을 만들 수 있습니다.                                                                         |
| `fn largest(xs: &[i32]) -> &i32`                         | 슬라이스의 한 칸을 가리키는 참조를 돌려줍니다. `best = x`로 참조를 바꿔 가며 가장 큰 칸을 가리키게 합니다.                                                           |
| `let top_value = *top;`                                  | 참조가 가리키는 정수를 **복사**합니다. `top`을 더 쓰지 않으므로 빌림이 끝나고, 다음 줄에서 `scores.push`를 할 수 있습니다.                                           |
| `scores.split_at_mut(2)`                                 | `[0, 2)`와 `[2, 4)` 두 슬라이스를 가변으로 돌려줍니다. 겹치지 않는다는 것이 보장되어 두 조각을 동시에 바꿀 수 있습니다. `left[0] += right[0]`은 72 + 88 = 160입니다. |
| `let len = text.len(); text.push_str(&len.to_string());` | `text.push_str(&text.len().to_string())`처럼 한 줄에 쓰면 빌림이 겹칠까 걱정되는 곳을, 값을 먼저 구해 분명히 했습니다. 한글 "빌림"은 6바이트입니다.                  |
| `let r = &mut text; r.push('!');`                        | 가변 참조로 메서드를 부르면 자동으로 따라가서 `(*r).push('!')`처럼 동작합니다.                                                                                       |

## 6. C로 구현하기

```c
// 파일: const_alias.c
#include <stdio.h>

int sum(const int *xs, int n) {             // const: 가리키는 값을 바꾸지 않겠다는 약속
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += xs[i];
    }
    return s;
}

void add_each(int *dst, const int *src, int n) {
    for (int i = 0; i < n; i++) {
        dst[i] += src[i];
    }
}

void print4(const char *label, const int *a) {
    printf("%s %d %d %d %d\n", label, a[0], a[1], a[2], a[3]);
}

int main(void) {
    int a[4] = {1, 2, 3, 4};
    int b[4] = {10, 20, 30, 40};
    printf("sum(a) = %d\n", sum(a, 4));

    add_each(b, a, 4);                      // 서로 다른 배열: 기대한 대로
    print4("b:", b);

    int c[4] = {1, 1, 1, 1};
    int d[4] = {1, 1, 1, 1};
    int d_copy[4] = {1, 1, 1, 1};
    add_each(c + 1, c, 3);                  // dst와 src가 겹친다(별칭)
    add_each(d + 1, d_copy, 3);             // 겹치지 않게 원본 복사본을 src로
    print4("겹침:", c);
    print4("안 겹침:", d);

    const int *read_only = a;               // 가리키는 값을 바꿀 수 없는 포인터
    int *const fixed = b;                   // 가리키는 곳을 바꿀 수 없는 포인터
    *fixed = 99;                            // 값은 바꿀 수 있다
    printf("read_only[0] = %d, b[0] = %d\n", read_only[0], b[0]);
    return 0;
}
```

실행 결과:

```text
sum(a) = 10
b: 11 22 33 44
겹침: 1 2 3 4
안 겹침: 1 2 2 2
read_only[0] = 1, b[0] = 99
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `int sum(const int *xs, int n)`                  | 읽기만 하는 함수라 `const`를 붙였습니다. 함수 안에서 `xs[0] = 1`을 쓰면 컴파일 오류입니다.                                                |
| `void add_each(int *dst, const int *src, int n)` | `dst`는 바꾸고 `src`는 읽기만 한다는 뜻입니다.                                                                                            |
| `add_each(c + 1, c, 3);`                         | `dst`가 `c[1]`부터, `src`가 `c[0]`부터라 두 범위가 **겹칩니다**. 앞 칸에서 바꾼 값이 다음 칸의 `src`로 읽혀 누적 합처럼 1 2 3 4가 됩니다. |
| `add_each(d + 1, d_copy, 3);`                    | 원본의 복사본을 `src`로 넘기면 겹치지 않아 모두 1이 더해져 1 2 2 2입니다. 같은 함수가 **넘긴 포인터에 따라** 다른 결과를 냅니다.          |
| `const int *read_only = a;`                      | `*read_only = 5`는 컴파일 오류입니다. `read_only = b`처럼 다른 곳을 가리키게 하는 것은 됩니다.                                            |
| `int *const fixed = b;` / `*fixed = 99;`         | 포인터 자체가 고정이라 `fixed = a`는 오류지만, 가리키는 값은 바꿀 수 있습니다.                                                            |

## 7. Python으로 구현하기

```python
# 파일: views.py
scores = [36, 45, 44]
readonly = tuple(scores)                    # 바꿀 수 없는 복사본으로 넘기기
print("합", sum(readonly), "첫 값", readonly[0])

try:
    readonly[0] = 100                       # 튜플은 바꿀 수 없다
except TypeError as error:
    print("TypeError:", error)

counts = {"사과": 0, "배": 3, "감": 0}
for key in list(counts):                    # 열쇠 목록의 복사본을 돈다
    if counts[key] == 0:
        del counts[key]                     # 원본 사전을 지워도 반복이 안전하다
print(counts)


def add_each(dst, src):
    for i in range(len(src)):
        dst[i] += src[i]


c = [1, 1, 1, 1]
add_each(c, c)                              # 같은 리스트를 두 번 넘김(별칭)
print("같은 리스트:", c)

d = [1, 1, 1, 1]
for i in range(1, len(d)):                  # C의 겹침과 같은 효과: 앞 칸의 '바뀐 값'을 더한다
    d[i] += d[i - 1]
print("누적 합:", d)
```

실행 결과:

```text
합 125 첫 값 36
TypeError: 'tuple' object does not support item assignment
{'배': 3}
같은 리스트: [2, 2, 2, 2]
누적 합: [1, 2, 3, 4]
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `readonly = tuple(scores)`        | 바꿀 수 없는 복사본입니다. 함수에 넘기면 함수가 실수로 바꿀 수 없습니다. Rust의 `&[i32]`처럼 "읽기만"을 보장하는 가장 간단한 방법입니다. |
| `readonly[0] = 100` → `TypeError` | 튜플의 칸에는 대입할 수 없습니다. 예외를 잡아 메시지를 출력했습니다(Day 25).                                                             |
| `for key in list(counts):`        | 열쇠 목록을 복사해 두고 돕니다. 원본 사전에서 지워도 반복이 흔들리지 않습니다.                                                           |
| `add_each(c, c)`                  | 같은 리스트를 `dst`와 `src`로 넘겨 모든 칸이 두 배가 됐습니다. 칸마다 자기 자신에 더하므로 C의 "한 칸 밀린 겹침"과는 결과가 다릅니다.    |
| `d[i] += d[i - 1]`                | 앞 칸의 **바뀐** 값을 더하는 누적 합입니다. C의 겹치는 `add_each`와 같은 결과를 일부러 만든 것입니다.                                    |

## 8. 실행 추적

Rust 코드 앞부분에서 `scores`에 대한 빌림이 언제 시작되고 끝나는지 따라갑니다.

| 줄                                            | 살아 있는 빌림                     | 허용되는 일         |
| --------------------------------------------- | ---------------------------------- | ------------------- |
| `let a = &scores;`                            | `a`(&)                             | 더 읽기             |
| `let b = &scores;`                            | `a`, `b`(&)                        | 더 읽기             |
| `println!(..., sum(a), b[0]);`                | (여기서 `a`, `b` 끝)               |                     |
| `double_all(&mut scores);`                    | 함수 안에서만 &mut                 | (함수가 끝나면 끝)  |
| `let top = largest(&scores);`                 | `top`(&, 한 칸)                    | 읽기만              |
| `let top_value = *top;`                       | (여기서 `top` 끝)                  |                     |
| `scores.push(top_value + 1);`                 | push 동안 &mut                     | 바꾸기              |
| `let (left, right) = scores.split_at_mut(2);` | `left`, `right`(&mut, 겹치지 않음) | 두 조각 모두 바꾸기 |

빌림이 "블록 끝"이 아니라 **마지막 사용**에서 끝나기 때문에, 순서만 잘 배치하면 한 함수 안에서 읽기와 쓰기를 번갈아 할 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**도서 대출 표시.** 책 목록 `Vec<(String, bool)>`에서 제목으로 책을 찾아 "대출 중"으로 표시합니다. 찾는 함수가 **참조**를 돌려주면, 그 참조를 들고 있는 동안 목록을 바꿀 수 없어서 불편합니다. 대신 **위치(인덱스)** 를 돌려주고, 바꿀 때만 잠깐 가변으로 빌립니다.

```rust
// 파일: library.rs
fn find(books: &[(String, bool)], title: &str) -> Option<usize> {
    books.iter().position(|(t, _)| t == title)  // 위치(정수)를 돌려주면 빌림이 남지 않는다
}

fn checkout(books: &mut [(String, bool)], title: &str) -> Result<(), String> {
    let pos = find(books, title).ok_or(format!("'{title}': 없는 책"))?;
    let book = &mut books[pos];             // 필요한 순간에만 가변으로 빌린다
    if book.1 {
        return Err(format!("'{title}': 이미 대출 중"));
    }
    book.1 = true;
    Ok(())
}

fn main() {
    let mut books: Vec<(String, bool)> = ["해리 포터", "어린 왕자", "모모"]
        .iter()
        .map(|t| (t.to_string(), false))
        .collect();
    for title in ["모모", "모모", "데미안", "어린 왕자"] {
        match checkout(&mut books, title) {
            Ok(()) => println!("{title} 대출"),
            Err(why) => println!("실패: {why}"),
        }
    }
    let available: Vec<&str> = books
        .iter()
        .filter(|(_, out)| !out)
        .map(|(t, _)| t.as_str())
        .collect();
    println!("대출 가능: {available:?}");
}
```

실행 결과:

```text
모모 대출
실패: '모모': 이미 대출 중
실패: '데미안': 없는 책
어린 왕자 대출
대출 가능: ["해리 포터"]
```

| 코드                                                              | 설명                                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn find(books: &[(String, bool)], title: &str) -> Option<usize>` | 위치는 그냥 정수라서, 돌려받은 뒤에는 목록을 빌리고 있지 않습니다.                                                                             |
| `find(books, title).ok_or(...)?`                                  | `&mut` 슬라이스를 `&`로 빌려 읽기 함수에 넘길 수 있습니다. 못 찾으면 오류로 끝냅니다(Day 25).                                                  |
| `let book = &mut books[pos];`                                     | 바꿀 **그 순간에만** 한 칸을 가변으로 빌립니다.                                                                                                |
| `book.1 = true;`                                                  | 튜플의 두 번째 값(대출 여부)을 바꿉니다. 가변 참조를 통해 자동으로 따라갑니다.                                                                 |
| `.filter(\|(_, out)\| !out).map(\|(t, _)\| t.as_str())`           | 대출 가능한 책의 제목을 **빌린 `&str`** 로 모읍니다. `available`이 살아 있는 동안 `books`를 바꿀 수 없지만, 여기서는 출력만 하므로 괜찮습니다. |

같은 프로그램을 Python으로 쓰면, 튜플은 바꿀 수 없으므로 칸 자체를 새 튜플로 바꿉니다.

```python
# 파일: library.py
def find(books, title):
    for i, (t, _) in enumerate(books):
        if t == title:
            return i
    return None


def checkout(books, title):
    pos = find(books, title)
    if pos is None:
        return f"'{title}': 없는 책"
    name, out = books[pos]
    if out:
        return f"'{title}': 이미 대출 중"
    books[pos] = (name, True)               # 튜플은 못 바꾸므로 칸을 새 튜플로 바꾼다
    return None


books = [(t, False) for t in ["해리 포터", "어린 왕자", "모모"]]
for title in ["모모", "모모", "데미안", "어린 왕자"]:
    error = checkout(books, title)
    print(f"{title} 대출" if error is None else f"실패: {error}")
print("대출 가능:", [t for t, out in books if not out])
```

실행 결과:

```text
모모 대출
실패: '모모': 이미 대출 중
실패: '데미안': 없는 책
어린 왕자 대출
대출 가능: ['해리 포터']
```

Python에서는 `find`가 튜플 자체를 돌려줘도 되지만, 튜플은 바꿀 수 없어서 "찾은 것을 고친다"가 불가능합니다. 그래서 역시 **위치**를 돌려주고 `books[pos] = (name, True)`로 칸을 바꿨습니다. 두 언어가 이유는 다르지만 같은 모양에 이르렀습니다.

## 10. 빌림 오류 해결 표

| 오류 메시지(요약)                                                 | 코드  | 흔한 원인                             | 해결                                         |
| ----------------------------------------------------------------- | ----- | ------------------------------------- | -------------------------------------------- |
| cannot borrow as mutable because it is also borrowed as immutable | E0502 | 참조를 든 채로 `push`, `insert`, 대입 | 값 복사, 순서 바꾸기, 인덱스로               |
| cannot borrow as mutable more than once at a time                 | E0499 | 같은 값에 `&mut` 두 개                | 하나로 합치기, `split_at_mut`, `swap`        |
| cannot assign ... behind a `&` reference                          | E0594 | `&`로 받은 것을 바꾸려 함             | 매개변수를 `&mut`로                          |
| cannot borrow ... as mutable, as it is not declared as mutable    | E0596 | 원래 변수가 `mut`가 아님              | `let mut`                                    |
| borrowed value does not live long enough                          | E0597 | 참조가 원래 값보다 오래 살려 함       | 값을 더 오래 살게, 또는 소유한 값을 돌려주기 |

## 11. 세 언어 비교

| 관점                       | Rust                   | C                                | Python                                      |
| -------------------------- | ---------------------- | -------------------------------- | ------------------------------------------- |
| 읽기 전용 표시             | `&T`(컴파일러가 강제)  | `const T *`(이 포인터로만 금지)  | 튜플·복사본(관례)                           |
| 읽는 중 변경               | 컴파일 오류(E0502)     | 허용(댕글링 포인터 위험)         | 리스트는 조용한 버그, 사전은 `RuntimeError` |
| 같은 메모리를 두 곳이 변경 | 컴파일 오류(E0499)     | 허용(`restrict`는 약속만)        | 허용                                        |
| 두 부분을 동시에 바꾸기    | `split_at_mut`, `swap` | 포인터 두 개(겹침은 스스로 확인) | 인덱스로 자유롭게                           |
| 검사 시점                  | 컴파일할 때            | 없음                             | 사전·집합만 실행 중                         |

## 12. 자주 하는 실수

### 실수 1: 참조를 든 채로 목록을 바꾼다 (Rust)

실습의 디버그 문제입니다. 필요한 값을 복사하거나, 참조를 다 쓴 뒤에 바꾸거나, 인덱스를 기억하세요.

### 실수 2: 같은 Vec의 두 칸을 동시에 &mut로 빌린다 (Rust)

```rust
// 파일: two_cells.rs (컴파일 오류: E0499)
fn main() {
    let mut v = vec![1, 2, 3];
    let a = &mut v[0];
    let b = &mut v[1];
    *a += *b;
    println!("{v:?}");
}
```

사람 눈에는 다른 칸이지만, 컴파일러는 인덱스만으로 겹치지 않는다는 것을 증명하지 못합니다. `let (left, right) = v.split_at_mut(1); left[0] += right[0];`로 쓰세요.

### 실수 3: 반복 중에 사전을 바꾼다 (Python)

```python
# 파일: dict_iter.py (실행 오류: RuntimeError)
counts = {"사과": 0, "배": 3}
for key in counts:
    if counts[key] == 0:
        del counts[key]
```

`list(counts)`로 복사본을 돌거나 새 사전을 만드세요.

### 실수 4: const면 값이 바뀌지 않는다고 믿는다 (C)

실습의 예측 문제입니다. `const int *src`는 "`src`로는 안 바꾼다"는 뜻일 뿐, 같은 메모리를 `dst`로 바꾸는 것까지 막지 않습니다. 겹칠 수 있는 포인터를 받는 함수는 문서에 "겹치면 안 된다"고 적거나(`memcpy`처럼), 겹쳐도 되게 만드세요(`memmove`처럼).

### 실수 5: 빌림을 블록 끝까지 유지한다고 오해한다 (Rust)

"참조를 만들었으니 블록이 끝날 때까지 못 바꾼다"고 생각해 불필요하게 `clone`을 쓰는 경우가 많습니다. 빌림은 **마지막 사용**에서 끝납니다. 참조를 쓰는 줄을 앞으로 모으는 것만으로 해결되는지 먼저 확인하세요.

## 13. Q&A

**Q. 빌림 검사기가 틀린 오류를 내기도 하나요?**

A. 가끔 "사람이 보기엔 안전한데" 거부하는 코드가 있습니다(실수 2가 대표적입니다). 컴파일러는 확실히 안전하다고 증명할 수 있는 코드만 허용하기 때문입니다. 이런 경우를 위해 `split_at_mut`, `swap`, 인덱스 같은 도구가 있고, 정말 필요하면 `RefCell`처럼 실행 중에 검사하는 방법(Day 31)도 있습니다.

**Q. 왜 Vec의 push가 기존 참조를 위험하게 만드나요?**

A. `push` 때 용량이 모자라면 Vec이 더 큰 공간을 새로 받아 모든 값을 옮기고, 옛 공간을 돌려줍니다(Day 27, 28). 옛 공간의 한 칸을 가리키던 참조는 이제 **돌려준 메모리**를 가리키게 됩니다. C++에서 "반복자 무효화"라고 부르는 유명한 버그입니다.

**Q. Python에서 함수가 리스트를 바꾸지 못하게 강제할 방법은 없나요?**

A. 튜플로 넘기는 것이 가장 간단합니다. 사전은 `types.MappingProxyType(d)`로 읽기 전용 보기를 만들 수 있습니다. 하지만 대부분은 "받은 것을 바꾸지 않는다"는 관례와 문서로 약속합니다.

**Q. Rust에서 &와 &mut를 쓰면 느려지나요?**

A. 아니요. 참조는 속으로 주소일 뿐이고 모든 검사는 컴파일할 때 끝납니다. 오히려 "겹치지 않는다"는 정보 덕분에 컴파일러가 C보다 과감하게 최적화할 수 있는 경우도 있습니다.

## 14. 핵심 요약

- 한 값에 대해 **공유 빌림(`&`)은 여러 개, 가변 빌림(`&mut`)은 하나만**, 그리고 둘을 동시에 가질 수 없습니다.
- 빌림은 참조가 **마지막으로 쓰인 곳**에서 끝납니다. 읽기를 앞에, 쓰기를 뒤에 배치하면 많은 오류가 풀립니다.
- 참조를 돌려주는 함수의 결과가 살아 있는 동안에는 원래 값이 빌린 상태입니다.
- E0502·E0499 해결법: 값 복사, 순서 바꾸기, 인덱스 기억하기, `split_at_mut`·`swap`으로 겹치지 않게 나누기. `clone`은 마지막 수단으로.
- C의 `const T *`는 "이 포인터로는 바꾸지 않는다"는 약속일 뿐이고, 겹치는 포인터(별칭)는 같은 함수의 결과를 바꿉니다.
- Python은 반복 중 변경을 막지 않습니다(리스트는 건너뜀, 사전은 `RuntimeError`). 복사본을 돌거나 새 컬렉션을 만들고, 읽기 전용은 튜플로 넘깁니다.

## 15. 도전 문제

1. **(Rust)** `fn first_word(s: &str) -> &str`를 만들어 문장의 첫 단어를 **빌린 조각**으로 돌려주세요. 돌려받은 뒤 원래 `String`에 `push_str`을 하면 어떤 오류가 나는지 확인하고, 두 가지 방법(순서 바꾸기, `to_string`으로 복사)으로 고치세요.
2. **(C)** 겹쳐도 올바르게 동작하는 `void add_prev(int *a, int n)`(각 칸에 원래 앞 칸의 값을 더함, 결과 1 2 2 2)을 만들어 보세요. 뒤에서부터 계산하면 임시 배열 없이 됩니다.
3. **(Python)** 학생 명단 리스트에서 결석한 학생(사전 `absent`에 있는 이름)을 지운 새 명단을 만들고, 원본 명단이 그대로인지 확인하세요.
4. **(세 언어)** 목록에서 가장 큰 값을 찾아 그 값을 0으로 바꾸고, 원래 최댓값을 출력하는 프로그램을 만드세요. Rust에서는 참조로 찾는 방법과 인덱스로 찾는 방법을 모두 시도해 어느 쪽이 빌림 규칙에 맞는지 확인하세요.
