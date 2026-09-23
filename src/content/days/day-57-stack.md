---
schemaVersion: 1
contentVersion: "2026.10-b"
id: day-57-stack
courseId: crp-92
phaseId: phase-06
dayNumber: 57
date: "2026-11-26"
title: 스택 — 마지막에 넣은 것을 먼저 꺼내는 자료구조
summary: Rust Vec를 Anchor로 LIFO 불변식, push·pop·peek, 빈 스택 처리, 시간 복잡도를 이해하고 C 배열과 Python list로 같은 구조를 구현합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-01-variables-types, day-29-references-borrowing]
learningObjectives:
  - 문제 상황에서 LIFO 구조가 필요한 이유를 찾아낸다.
  - push, pop, peek 뒤의 상태를 손으로 추적한다.
  - 스택의 top 불변식과 빈 상태를 설명한다.
  - Rust Vec로 안전한 제네릭 Stack을 구현한다.
  - C 고정 배열과 Python list 구현의 장단점을 비교한다.
concepts: [stack, lifo, invariant, push, pop, peek, complexity, underflow]
runnerMode: prepared-wasm
reviewOffsets: [1, 3, 7, 14, 30]
sample: true
exercises:
  - id: ex-day57-predict
    title: 스택 상태 추적
    kind: predict
    objective: 연산 순서에 따라 top과 전체 상태를 추적한다.
    prompt: push(2), push(7), pop(), push(4) 뒤 스택 원소를 바닥부터 적으세요.
    starter: "[] -> push(2) -> push(7) -> pop() -> push(4)"
    answer: "[2, 4]"
    hint: pop은 가장 최근에 push했지만 아직 제거되지 않은 값 하나를 꺼냅니다.
    explanation: 2와 7을 넣은 뒤 pop이 7을 제거하고, 그 위에 4가 쌓이므로 [2, 4]가 됩니다.
    commonMistakes: [queue처럼 2를 먼저 제거함, pop 뒤 7을 남겨 둠]
    language: rust
    verification: none
  - id: ex-day57-fill
    title: peek 빈칸 채우기
    kind: fill
    objective: 마지막 원소를 제거하지 않고 빌려주는 메서드를 구현한다.
    prompt: Vec의 마지막 원소를 읽기 전용 참조로 돌려주는 peek를 완성하세요.
    starter: "fn peek(&self) -> Option<&i32> {\n    self.items._____()\n}"
    answer: "fn peek(&self) -> Option<&i32> {\n    self.items.last()\n}"
    hint: Vec의 last()는 마지막 원소가 있으면 Option<&T>로 빌려줍니다.
    explanation: last()는 원소를 제거하지 않습니다. 빈 Vec이면 None, 값이 있으면 마지막 원소의 공유 참조를 반환합니다.
    commonMistakes:
      [pop을 사용해 값을 제거함, 인덱스로 접근해 빈 스택에서 panic을 일으킴]
    language: rust
    verification: compile
  - id: ex-day57-modify
    title: Python 괄호 검사기 확장
    kind: modify
    objective: 여는 괄호를 push하고 닫는 괄호에서 최근 항목과 짝을 검사한다.
    prompt: 소괄호만 검사하는 코드를 (), [], {} 세 종류를 검사하도록 완성하세요.
    starter: "def is_balanced(text):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for char in text:\n        # 여는 괄호면 push\n        # 닫는 괄호면 빈 스택과 짝을 검사\n        pass\n    return not stack"
    answer: "def is_balanced(text):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for char in text:\n        if char in '([{':\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return not stack"
    hint: 닫는 괄호를 만나면 먼저 not stack을 확인하고, 그 다음 pop 결과를 pairs[char]와 비교하세요.
    explanation: 가장 최근의 여는 괄호가 현재 닫는 괄호와 짝이어야 하므로 LIFO가 정확히 맞습니다. 마지막에도 stack이 비어 있어야 합니다.
    commonMistakes:
      [빈 스택 확인 전에 pop함, 문자열 끝에서 남은 여는 괄호를 검사하지 않음]
    language: python
    verification: run
  - id: ex-day57-debug
    title: C 스택 overflow 고치기
    kind: debug
    objective: 고정 용량 배열의 범위를 넘기 전에 push를 거부한다.
    prompt: 배열 경계를 넘을 수 있는 push를 용량 검사와 bool 반환으로 고치세요.
    starter: "void push(Stack *s, int value) {\n    s->items[s->len] = value;\n    s->len++;\n}"
    answer: "bool push(Stack *s, int value) {\n    if (s->len == CAPACITY) return false;\n    s->items[s->len++] = value;\n    return true;\n}"
    hint: s->len이 CAPACITY와 같다면 쓸 수 있는 인덱스가 더 이상 없습니다.
    explanation: 유효 인덱스는 0부터 CAPACITY - 1까지입니다. 가득 찼을 때 쓰기를 막고 호출자가 실패를 처리할 수 있도록 false를 반환합니다.
    commonMistakes:
      [쓰기 뒤에 용량을 검사함, len > CAPACITY만 검사해 len == CAPACITY를 놓침]
    language: c
    verification: compile
  - id: ex-day57-independent
    title: 안전한 Rust Stack 구현
    kind: independent
    objective: push, pop, peek, is_empty를 가진 최소 제네릭 스택을 구현한다.
    prompt: Vec<T>를 감싼 Stack<T>의 네 메서드를 구현하세요.
    starter: "struct Stack<T> { items: Vec<T> }\n\nimpl<T> Stack<T> {\n    fn push(&mut self, value: T) { /* 구현 */ }\n    fn pop(&mut self) -> Option<T> { /* 구현 */ }\n    fn peek(&self) -> Option<&T> { /* 구현 */ }\n    fn is_empty(&self) -> bool { /* 구현 */ }\n}"
    answer: "struct Stack<T> { items: Vec<T> }\n\nimpl<T> Stack<T> {\n    fn push(&mut self, value: T) { self.items.push(value); }\n    fn pop(&mut self) -> Option<T> { self.items.pop() }\n    fn peek(&self) -> Option<&T> { self.items.last() }\n    fn is_empty(&self) -> bool { self.items.is_empty() }\n}"
    hint: Vec에 이미 push, pop, last, is_empty가 있으므로 스택 의미에 맞게 감싸면 됩니다.
    explanation: pop은 값을 제거해 소유권을 반환하고, peek은 제거하지 않고 공유 참조를 반환합니다. 두 메서드 모두 빈 상태를 안전하게 표현합니다.
    commonMistakes:
      [
        peek에 pop을 사용함,
        pop 결과를 unwrap해 빈 스택에서 panic을 일으킴,
        읽기만 하는 메서드에 &mut self를 사용함,
      ]
    language: rust
    verification: compile
quiz:
  - id: quiz-day57-01
    question: push(1), push(2), push(3) 뒤 첫 pop이 반환하는 값은?
    choices: ["1", "2", "3"]
    answerIndex: 2
    explanation: 스택은 가장 최근에 넣은 값을 먼저 꺼내므로 3이 반환됩니다.
  - id: quiz-day57-02
    question: 배열 끝을 top으로 쓰는 동적 배열 스택에서 평균 push와 pop의 시간 복잡도는?
    choices: [O(1), O(log n), O(n)]
    answerIndex: 0
    explanation: 끝 원소 추가와 제거는 대부분 상수 시간이며, 가끔 배열 확장이 일어나는 push도 상각 O(1)입니다.
  - id: quiz-day57-03
    question: Rust의 Vec::pop이 Option<T>를 반환하는 이유는?
    choices:
      [
        모든 값이 선택 사항이기 때문에,
        빈 스택에서는 꺼낼 값이 없음을 안전하게 표현하기 위해,
        pop을 느리게 만들기 위해,
      ]
    answerIndex: 1
    explanation: 값이 있으면 Some(value), 비어 있으면 None을 반환해 underflow를 호출자가 처리하게 합니다.
  - id: quiz-day57-04
    question: 괄호 검사에서 닫는 괄호를 만났을 때 비교해야 하는 것은?
    choices:
      [
        가장 먼저 저장한 여는 괄호,
        스택의 모든 괄호,
        가장 최근에 아직 닫히지 않은 여는 괄호,
      ]
    answerIndex: 2
    explanation: 괄호는 안쪽에 열린 것이 먼저 닫혀야 하므로 가장 최근 여는 괄호와 비교합니다.
---

## 1. Problem: 어떤 문제에 스택이 필요한가

다음 상황의 공통점을 찾아봅시다.

- 편집기에서 방금 한 작업부터 실행 취소한다.
- 웹 브라우저에서 최근에 방문한 페이지부터 뒤로 간다.
- 함수가 끝나면 가장 최근에 호출한 함수로 돌아간다.
- 괄호가 올바르게 닫혔는지 검사한다.

모두 **가장 최근에 들어온 항목을 먼저 사용**합니다. 이런 규칙을 LIFO(Last In, First Out), 즉 후입선출이라고 합니다. 스택은 LIFO 규칙을 지키도록 연산을 제한한 자료구조입니다.

## 2. Naive approach와 문제점

작업 기록을 변수 여러 개에 따로 저장한다고 생각해 봅시다.

```text
last_action_1, last_action_2, last_action_3, ...
```

기록 개수가 바뀔 때마다 변수와 조건문이 늘어나고 “현재 가장 최근 항목”을 찾기 어려워집니다. 일반 배열을 쓰더라도 어느 쪽에서 넣고 빼는지 규칙이 없다면 코드를 읽는 사람이 매번 구현을 분석해야 합니다.

스택은 사용할 수 있는 핵심 연산을 정해 문제를 단순하게 만듭니다.

## 3. Mental model: 접시 쌓기

접시를 세로로 쌓으면 중간 접시를 바로 꺼내기 어렵습니다. 맨 위에 놓고 맨 위에서 꺼냅니다.

```text
top → [ 7 ]  ← 가장 최근 push
      [ 2 ]
      [ 5 ]
bottom
```

- `push(value)`: top 위에 값을 넣습니다.
- `pop()`: top 값을 제거하며 반환합니다.
- `peek()`: top 값을 제거하지 않고 봅니다.
- `is_empty()`: 비어 있는지 확인합니다.

## 4. Invariant: 구현 중에도 항상 참이어야 하는 규칙

스택의 핵심 불변식은 다음과 같습니다.

> 스택이 비어 있지 않다면 top은 가장 최근에 push했고 아직 pop하지 않은 원소다.

불변식은 특정 코드 문법보다 중요합니다. C 배열, Python list, Rust Vec 중 무엇으로 구현해도 이 규칙이 유지되어야 스택입니다.

동적 배열의 **끝**을 top으로 사용하면 중간 원소를 옮기지 않고 넣고 뺄 수 있습니다.

## 5. Hand trace: 연산을 손으로 추적하기

빈 스택에서 다음 연산을 실행합니다.

```text
push(2) → push(7) → peek() → pop() → push(4)
```

| 단계 | 연산 결과         | 스택 상태(바닥 → top) | top  |
| ---: | ----------------- | --------------------- | ---- |
|    0 | 시작              | `[]`                  | 없음 |
|    1 | `push(2)`         | `[2]`                 | 2    |
|    2 | `push(7)`         | `[2, 7]`              | 7    |
|    3 | `peek()`가 7 반환 | `[2, 7]`              | 7    |
|    4 | `pop()`이 7 반환  | `[2]`                 | 2    |
|    5 | `push(4)`         | `[2, 4]`              | 4    |

`peek`는 상태를 바꾸지 않고, `pop`은 상태를 바꾼다는 차이를 확인하세요.

## 6. Rust Anchor: Vec로 제네릭 Stack 만들기

```rust
#[derive(Default)]
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn push(&mut self, value: T) {
        self.items.push(value);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}
```

### 줄별 설명

1. `Stack<T>`의 `T`는 원소 자료형을 나중에 정하겠다는 뜻입니다. `Stack<i32>`와 `Stack<String>`을 같은 구조로 만들 수 있습니다.
2. `items: Vec<T>`는 실제 원소를 저장하는 동적 배열입니다.
3. `push(&mut self, value: T)`는 스택을 바꾸므로 `&mut self`를 받습니다.
4. `self.items.push(value)`는 Vec의 끝에 값을 추가합니다. 이 끝이 top입니다.
5. `pop(&mut self) -> Option<T>`는 top을 제거하므로 역시 가변 빌림이 필요합니다.
6. 반환형 `Option<T>`는 값이 있으면 `Some(value)`, 빈 스택이면 `None`입니다.
7. `peek(&self) -> Option<&T>`는 제거하지 않고 읽기만 하므로 공유 빌림 `&self`를 받습니다.
8. peek은 소유권을 가져가지 않고 top을 빌려주므로 `Option<&T>`를 반환합니다.

## 7. 빈 스택과 underflow

비어 있는 스택에서 `pop`을 요구하면 꺼낼 값이 없습니다. 이를 underflow 상황이라고 합니다.

나쁜 방법은 “없음”을 임의의 숫자로 숨기는 것입니다.

```text
빈 스택이면 -1 반환
```

하지만 실제 데이터로 `-1`을 저장할 수 있다면 실패와 정상 값을 구분할 수 없습니다. Rust의 `Option<T>`는 두 상태를 타입으로 분리합니다.

```rust
match stack.pop() {
    Some(value) => println!("꺼낸 값: {value}"),
    None => println!("스택이 비어 있습니다."),
}
```

`unwrap()`을 무조건 사용하면 빈 스택에서 프로그램이 panic하므로, 학습용 구현에서는 실패 가능성을 명시적으로 처리합니다.

## 8. Complexity: 왜 배열 끝을 쓰는가

| 연산     | 동적 배열 스택 | 이유                                               |
| -------- | -------------- | -------------------------------------------------- |
| push     | 상각 O(1)      | 대부분 끝에 바로 추가하며 가끔만 더 큰 배열로 이동 |
| pop      | O(1)           | 끝 원소 하나만 제거                                |
| peek     | O(1)           | 마지막 인덱스에 바로 접근                          |
| is_empty | O(1)           | 길이가 0인지 확인                                  |
| search   | O(n)           | 원하는 값을 찾으려면 순서대로 확인                 |

**상각 O(1)**은 한 번의 배열 확장이 O(n)이더라도 여러 번의 push 전체 비용을 나누면 원소당 평균이 상수 시간이라는 뜻입니다.

배열 앞쪽을 top으로 쓰면 push나 pop 때 나머지 원소를 이동해야 하므로 O(n)이 됩니다. 그래서 Vec와 list의 끝을 사용합니다.

## 9. Python으로 transfer: list의 끝 사용하기

```python
stack: list[int] = []

stack.append(2)  # push
stack.append(7)
top = stack[-1]  # peek
latest = stack.pop()

print(top)       # 7
print(latest)    # 7
print(stack)     # [2]
```

Python list에서 `append`와 인자 없는 `pop()`은 끝을 사용합니다. `pop(0)`은 맨 앞 원소를 제거하고 나머지를 이동시키므로 스택에 맞지 않습니다.

빈 리스트에서 `pop()`을 호출하면 `IndexError`가 발생합니다. 호출 전에 `if stack:`으로 확인하거나, 동작을 함수로 감싸 실패 정책을 정해야 합니다.

## 10. C로 transfer: 고정 용량과 명시적 검사

```c
#include <stdbool.h>
#include <stddef.h>

#define CAPACITY 8

typedef struct {
    int items[CAPACITY];
    size_t len;
} Stack;

bool push(Stack *s, int value) {
    if (s->len == CAPACITY) {
        return false;
    }
    s->items[s->len++] = value;
    return true;
}

bool pop(Stack *s, int *out) {
    if (s->len == 0) {
        return false;
    }
    *out = s->items[--s->len];
    return true;
}
```

`len`은 현재 원소 수이면서 다음 push가 쓸 인덱스입니다. `len == CAPACITY`면 더 쓸 공간이 없으므로 overflow를 막아야 합니다.

pop에서는 먼저 `len`을 줄인 뒤 그 인덱스의 값을 읽습니다. 결과는 `out` 포인터로 전달하고, 성공 여부는 bool로 반환합니다. Day 29의 포인터가 실제 자료구조 구현에 사용되는 장면입니다.

## 11. Worked example: 괄호 검사

문자열 `([{}])`가 올바른 이유를 생각해 봅시다. 닫는 괄호 `}`를 만났을 때는 가장 최근에 열린 `{`와 짝이어야 합니다. 가장 최근 항목을 확인하므로 스택이 맞습니다.

```python
def is_balanced(text):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in text:
        if char in '([{':
            stack.append(char)
        elif char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False

    return not stack
```

### `([{}])` 실행 추적

| 읽은 문자 | 행동               | 스택        |
| --------- | ------------------ | ----------- |
| `(`       | push               | `[(]`       |
| `[`       | push               | `[(, []`    |
| `{`       | push               | `[(, [, {]` |
| `}`       | `{` pop 후 짝 확인 | `[(, []`    |
| `]`       | `[` pop 후 짝 확인 | `[(]`       |
| `)`       | `(` pop 후 짝 확인 | `[]`        |

마지막에 스택이 비어 있으므로 모든 여는 괄호가 올바른 순서로 닫혔습니다.

## 12. 틀린 접근을 분석하기

### 닫는 괄호가 나오면 아무 여는 괄호와 비교한다

괄호는 중첩 순서를 지켜야 하므로 전체에서 같은 종류가 있는지만 확인해서는 안 됩니다. `([)]`는 종류의 개수는 맞지만 닫히는 순서가 틀립니다.

### 빈 스택 확인 전에 pop한다

문자열이 `)`로 시작하면 꺼낼 값이 없습니다. 반드시 `not stack`을 먼저 확인해야 합니다. `or`의 단축 평가 때문에 앞 조건이 참이면 `stack.pop()`은 실행되지 않습니다.

### 마지막의 남은 여는 괄호를 무시한다

문자열 `((`에는 닫는 괄호가 없어 반복 중 오류가 발생하지 않지만, 마지막 스택이 비어 있지 않습니다. 그래서 `return not stack`이 필요합니다.

## 13. 세 언어 구현 비교

| 관점        | C 고정 배열            | Python list           | Rust Vec            |
| ----------- | ---------------------- | --------------------- | ------------------- |
| 용량        | 직접 정한 고정 크기    | 자동 확장             | 자동 확장           |
| 빈 pop      | bool 등 정책 직접 설계 | `IndexError`          | `Option<T>`         |
| 메모리 안전 | 경계 검사 직접 구현    | 런타임이 검사         | 타입·경계 검사 제공 |
| 원소 타입   | 선언한 타입 하나       | 서로 다른 타입도 가능 | 제네릭 T 하나       |
| top 위치    | 보통 `len - 1`         | 리스트 끝             | Vec 끝              |

세 구현 모두 끝을 top으로 사용하는 불변식은 같습니다. 차이는 실패와 메모리를 누가, 언제 검사하느냐입니다.

## 14. 직접 구현할 때 체크할 것

1. top이 배열의 어느 쪽인지 일관되게 정했는가?
2. push 뒤 가장 최근 값이 top인가?
3. pop이 값을 반환하면서 실제로 제거하는가?
4. peek이 값을 제거하지 않는가?
5. 빈 pop과 peek을 안전하게 처리하는가?
6. C 고정 배열이면 overflow를 쓰기 **전에** 막는가?
7. 각 연산 뒤 LIFO 불변식이 유지되는가?

## 15. 핵심 요약

- 스택은 LIFO, 즉 가장 최근에 넣은 값을 먼저 꺼냅니다.
- push는 top에 추가하고, pop은 top을 제거하며, peek은 제거하지 않고 봅니다.
- 동적 배열의 끝을 top으로 쓰면 push와 pop이 평균적으로 빠릅니다.
- 빈 스택과 고정 배열의 가득 찬 상태를 정상적인 실패로 처리해야 합니다.
- Rust는 `Option`, C는 bool과 out pointer, Python은 조건 검사나 예외로 실패를 표현할 수 있습니다.
- 괄호 검사처럼 “가장 최근의 미완료 작업”을 되돌아봐야 하는 문제에서 스택을 떠올리면 됩니다.
