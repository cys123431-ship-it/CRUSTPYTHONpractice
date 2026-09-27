---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-57-stack
courseId: crp-92
phaseId: phase-06
dayNumber: 57
date: "2026-11-26"
title: 스택 — 마지막에 넣은 것을 먼저 꺼내는 자료구조
summary: LIFO 규칙, top 불변식, push·pop·peek, overflow와 underflow를 이해하고 C 배열, Python list, Rust Vec로 같은 스택을 끝까지 구현합니다. 괄호 검사기로 응용까지 해 봅니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-01-variables-types, day-29-references-borrowing]
learningObjectives:
  - 스택이 필요한 문제 상황을 LIFO 규칙으로 설명한다.
  - push, pop, peek 뒤의 스택 상태와 top 값을 손으로 추적한다.
  - C 고정 배열 스택에서 overflow와 underflow를 코드로 막는다.
  - Python 클래스와 Rust 제네릭 구조체로 같은 스택을 구현한다.
  - 괄호 검사 문제를 세 언어의 스택으로 해결한다.
concepts: [stack, lifo, top, push, pop, peek, overflow, underflow]
runnerMode: python
playgroundSource: |
  # 파일: stack.py — 위의 Python 스택을 직접 실행해 보세요.
  class Stack:
      def __init__(self):
          self._items = []

      def push(self, value):
          self._items.append(value)

      def pop(self):
          if self.is_empty():
              raise IndexError("pop: 스택이 비어 있습니다")
          return self._items.pop()

      def peek(self):
          if self.is_empty():
              raise IndexError("peek: 스택이 비어 있습니다")
          return self._items[-1]

      def is_empty(self):
          return len(self._items) == 0

      def __repr__(self):
          return f"Stack({self._items})"


  s = Stack()
  for value in [10, 20, 30]:
      s.push(value)
  print(s)
  print("peek ->", s.peek())
  print("pop  ->", s.pop())
  print(s)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day57-predict
    title: C 배열 스택 추적하기
    kind: predict
    objective: top 인덱스가 움직이는 순서를 따라 최종 출력을 예측한다.
    prompt: 코드를 실행하지 말고 출력 한 줄을 예측하세요. 두 값은 공백 하나로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int stack[5];
          int top = -1;

          stack[++top] = 4;
          stack[++top] = 7;
          stack[++top] = 1;
          top--;
          stack[++top] = 9;
          printf("%d %d\n", stack[top], top);
          return 0;
      }
    answer: "9 2"
    hint: "++top은 top을 먼저 1 늘린 뒤 그 값을 인덱스로 씁니다. top--는 값을 지우지 않고 top만 한 칸 내립니다."
    explanation: 4, 7, 1을 넣으면 top은 2입니다. top--로 1이 되고, 다시 ++top으로 2가 된 자리에 9를 덮어씁니다. 그래서 stack[2]는 9이고 top은 2입니다.
    commonMistakes:
      - "top--가 배열의 값까지 지운다고 생각함"
      - "++top과 top++의 순서를 혼동해 인덱스를 하나 틀림"
    language: c
    verification: run
  - id: ex-day57-predict-py
    title: Python list를 스택으로 쓰기
    kind: predict
    objective: append와 pop이 list의 끝에서 일어난다는 것을 확인한다.
    prompt: 출력될 문자열을 예측하세요.
    starter: |-
      s = []
      for ch in "ABC":
          s.append(ch)
      s.pop()
      s.append("D")
      print("".join(reversed(s)))
    answer: DBA
    hint: "pop()은 가장 마지막 원소를 꺼냅니다. reversed(s)는 top부터 바닥 쪽으로 읽습니다."
    explanation: "A, B, C를 넣은 뒤 pop이 C를 꺼내고 D를 넣으므로 s는 ['A', 'B', 'D']입니다. 이를 뒤집어 이어 붙이면 DBA입니다."
    commonMistakes:
      - "pop()이 맨 앞의 A를 꺼낸다고 생각함"
      - "reversed를 무시하고 ABD라고 적음"
    language: python
    verification: run
  - id: ex-day57-fill
    title: Rust peek 빈칸 채우기
    kind: fill
    objective: 원소를 제거하지 않고 top을 빌려주는 메서드를 완성한다.
    prompt: "빈칸 _____에 들어갈 Vec 메서드 이름을 채워 peek가 마지막 원소의 참조를 돌려주게 하세요."
    starter: |-
      struct Stack<T> {
          items: Vec<T>,
      }

      impl<T> Stack<T> {
          fn push(&mut self, value: T) {
              self.items.push(value);
          }

          fn peek(&self) -> Option<&T> {
              self.items._____()
          }
      }

      fn main() {
          let mut s = Stack { items: Vec::new() };
          println!("{:?}", s.peek());
          s.push(3);
          s.push(8);
          println!("{:?}", s.peek());
      }
    answer: |-
      struct Stack<T> {
          items: Vec<T>,
      }

      impl<T> Stack<T> {
          fn push(&mut self, value: T) {
              self.items.push(value);
          }

          fn peek(&self) -> Option<&T> {
              self.items.last()
          }
      }

      fn main() {
          let mut s = Stack { items: Vec::new() };
          println!("{:?}", s.peek());
          s.push(3);
          s.push(8);
          println!("{:?}", s.peek());
      }
    hint: Vec에는 마지막 원소가 있으면 Some(&원소), 없으면 None을 돌려주는 메서드가 있습니다. first의 반대말입니다.
    explanation: "last()는 원소를 제거하지 않고 빌려줍니다. 빈 Vec이면 None, 원소가 있으면 Some(&마지막 원소)를 반환하므로 출력은 None, Some(8)입니다."
    commonMistakes:
      - "pop()을 써서 peek가 값을 제거하게 만듦"
      - "self.items[self.items.len() - 1]로 접근해 빈 스택에서 panic을 일으킴"
    language: rust
    verification: run
    output: |-
      None
      Some(8)
  - id: ex-day57-modify
    title: Python 괄호 검사기 확장하기
    kind: modify
    objective: 소괄호만 검사하는 코드를 세 종류의 괄호를 검사하도록 바꾼다.
    prompt: "아래 함수는 ( )만 검사합니다. [ ]와 { }도 짝을 맞춰 검사하도록 고치세요. 짝 정보를 dict에 담으면 편합니다."
    starter: |-
      def is_balanced(text):
          stack = []
          for ch in text:
              if ch == "(":
                  stack.append(ch)
              elif ch == ")":
                  if not stack:
                      return False
                  stack.pop()
          return not stack


      for t in ["(a[b]c)", "([)]", "{[()]}"]:
          print(t, is_balanced(t))
    answer: |-
      def is_balanced(text):
          pairs = {")": "(", "]": "[", "}": "{"}
          stack = []
          for ch in text:
              if ch in "([{":
                  stack.append(ch)
              elif ch in pairs:
                  if not stack or stack.pop() != pairs[ch]:
                      return False
          return not stack


      for t in ["(a[b]c)", "([)]", "{[()]}"]:
          print(t, is_balanced(t))
    hint: "닫는 괄호를 만나면 먼저 스택이 비었는지 확인하고, 꺼낸 여는 괄호가 pairs[ch]와 같은지 비교하세요."
    explanation: "가장 최근에 열린 괄호가 가장 먼저 닫혀야 하므로 pop한 값과 짝을 비교합니다. 결과는 True, False, True입니다. ([)]는 개수는 맞지만 [가 닫히기 전에 )가 나와서 틀립니다."
    commonMistakes:
      - "괄호 종류별 개수만 세어서 ([)]를 올바르다고 판정함"
      - "마지막에 스택이 비었는지 확인하지 않아 ((를 올바르다고 판정함"
    language: python
    verification: run
    output: |-
      (a[b]c) True
      ([)] False
      {[()]} True
  - id: ex-day57-debug
    title: C push의 순서 오류 고치기
    kind: debug
    objective: top을 올리는 시점과 가득 참 검사의 위치를 바로잡는다.
    prompt: 이 push는 첫 값을 items[-1]에 쓰고, 가득 찼는지도 검사하지 않습니다. 두 문제를 모두 고치세요.
    starter: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define CAPACITY 3

      typedef struct {
          int items[CAPACITY];
          int top;
      } Stack;

      bool push(Stack *s, int value) {
          s->items[s->top] = value;
          s->top++;
          return true;
      }

      int main(void) {
          Stack s = { .top = -1 };
          for (int i = 1; i <= 4; i++) {
              printf("push(%d) -> %s\n", i, push(&s, i) ? "성공" : "실패");
          }
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdbool.h>

      #define CAPACITY 3

      typedef struct {
          int items[CAPACITY];
          int top;
      } Stack;

      bool push(Stack *s, int value) {
          if (s->top == CAPACITY - 1) {
              return false;
          }
          s->top++;
          s->items[s->top] = value;
          return true;
      }

      int main(void) {
          Stack s = { .top = -1 };
          for (int i = 1; i <= 4; i++) {
              printf("push(%d) -> %s\n", i, push(&s, i) ? "성공" : "실패");
          }
          return 0;
      }
    hint: "top이 -1에서 시작하면 첫 값은 인덱스 0에 들어가야 합니다. 쓰기 전에 top을 올리세요. 가득 찬 조건은 top == CAPACITY - 1입니다."
    explanation: "원래 코드는 top이 -1일 때 items[-1]에 쓰므로 배열 밖을 건드리는 정의되지 않은 동작입니다. 고친 코드는 먼저 가득 찼는지 확인하고, top을 올린 뒤 씁니다. 네 번째 push는 실패로 출력됩니다."
    commonMistakes:
      - "검사를 쓰기 뒤에 넣어서 이미 배열 밖에 쓴 뒤에 실패를 알림"
      - "top == CAPACITY로 검사해 마지막 한 칸을 넘어서 씀"
    language: c
    verification: run
    output: |-
      push(1) -> 성공
      push(2) -> 성공
      push(3) -> 성공
      push(4) -> 실패
  - id: ex-day57-independent
    title: Rust 스택으로 단어 순서 뒤집기
    kind: independent
    objective: 스택의 LIFO 성질을 이용해 입력 순서를 뒤집는 프로그램을 처음부터 작성한다.
    prompt: '문장 "나는 오늘 스택을 배웠다"의 단어를 공백으로 나눠 Vec 스택에 push한 뒤, pop하면서 출력해 "배웠다 스택을 오늘 나는"을 만드세요.'
    starter: |-
      fn main() {
          let sentence = "나는 오늘 스택을 배웠다";
          // 1. 빈 Vec<&str> 스택을 만든다.
          // 2. split_whitespace()로 단어를 하나씩 push한다.
          // 3. while let Some(word) = stack.pop()으로 꺼내며 모은다.
          // 4. 모은 단어를 공백으로 이어 출력한다.
          println!("{sentence}");
      }
    answer: |-
      fn main() {
          let sentence = "나는 오늘 스택을 배웠다";
          let mut stack: Vec<&str> = Vec::new();
          for word in sentence.split_whitespace() {
              stack.push(word);
          }

          let mut reversed: Vec<&str> = Vec::new();
          while let Some(word) = stack.pop() {
              reversed.push(word);
          }
          println!("{}", reversed.join(" "));
      }
    hint: while let Some(word) = stack.pop()은 스택이 빌 때까지 반복하고, 비면 None이 되어 자동으로 멈춥니다.
    explanation: 넣은 순서가 나는→오늘→스택을→배웠다이므로 꺼내는 순서는 정반대입니다. 스택은 순서를 뒤집는 가장 간단한 도구입니다.
    commonMistakes:
      - "pop 결과를 unwrap()하면서 빈 스택 검사를 따로 하지 않음"
      - "split(' ')를 써서 연속 공백이 있을 때 빈 문자열이 섞임"
    language: rust
    verification: run
    output: "배웠다 스택을 오늘 나는"
quiz:
  - id: quiz-day57-01
    question: 빈 스택에 push(1), push(2), push(3)을 한 뒤 pop을 두 번 하면, 두 번째 pop이 반환하는 값은?
    choices: ["1", "2", "3", "스택이 비어 있어 실패한다"]
    answerIndex: 1
    explanation: 첫 pop은 가장 최근의 3을, 두 번째 pop은 그다음 최근인 2를 꺼냅니다. 1은 아직 바닥에 남아 있습니다.
  - id: quiz-day57-02
    question: C 배열 스택에서 top을 '맨 위 원소의 인덱스'로 정하고 빈 상태를 -1로 표현했습니다. 용량이 CAPACITY일 때 가득 찬 조건은?
    choices:
      - "top == CAPACITY"
      - "top == CAPACITY - 1"
      - "top > CAPACITY"
      - "top == 0"
    answerIndex: 1
    explanation: 인덱스는 0부터 CAPACITY - 1까지입니다. top이 마지막 인덱스 CAPACITY - 1이면 더 넣을 칸이 없습니다. top == CAPACITY를 기다리면 이미 배열 밖에 한 번 쓴 뒤입니다.
  - id: quiz-day57-03
    question: Rust의 Vec::pop이 T가 아니라 Option<T>를 반환하는 이유로 가장 알맞은 것은?
    choices:
      - Option이 T보다 메모리를 적게 쓰기 때문에
      - 빈 Vec에서는 꺼낼 값이 없다는 사실을 타입으로 알려 주기 위해
      - pop한 값을 다시 넣을 수 없게 막기 위해
      - 컴파일러가 제네릭 타입을 반환할 수 없기 때문에
    answerIndex: 1
    explanation: 값이 있으면 Some(값), 없으면 None입니다. 호출하는 쪽은 match나 if let으로 두 경우를 모두 처리해야 하므로 underflow를 잊을 수 없습니다.
  - id: quiz-day57-04
    question: Python에서 list를 스택으로 쓸 때 top으로 삼기에 알맞은 위치와 연산은?
    choices:
      - 맨 앞, insert(0, x)와 pop(0)
      - 맨 끝, append(x)와 pop()
      - 가운데, insert(len//2, x)
      - 위치는 상관없다
    answerIndex: 1
    explanation: 끝에서 넣고 빼면 다른 원소를 옮길 필요가 없어 O(1)입니다. 맨 앞을 쓰면 매번 나머지 원소를 한 칸씩 옮기므로 O(n)입니다.
  - id: quiz-day57-05
    question: 괄호 검사에서 닫는 괄호 ']'를 읽었을 때 스택에서 비교해야 할 대상은?
    choices:
      - 가장 먼저 넣은 여는 괄호
      - 아직 닫히지 않은 여는 괄호 중 가장 최근 것
      - 스택에 있는 모든 여는 괄호
      - 스택의 원소 개수
    answerIndex: 1
    explanation: 괄호는 안쪽에서 연 것을 먼저 닫아야 합니다. 가장 최근에 열었지만 아직 닫히지 않은 괄호가 스택의 top이므로 pop해서 짝을 비교합니다.
---

## 1. 오늘 배울 내용

오늘은 첫 번째 자료구조인 **스택(stack)** 을 배웁니다. 자료구조란 "데이터를 어떤 모양으로 저장하고, 어떤 연산으로 다룰지 정한 약속"입니다. 같은 배열을 쓰더라도 "끝에서만 넣고 끝에서만 뺀다"는 약속을 지키면 그 배열은 스택이 됩니다.

이번 수업의 흐름은 다음과 같습니다.

1. 스택이 필요한 상황을 먼저 보고, LIFO라는 규칙을 이해합니다.
2. 그림과 표로 push, pop, peek를 손으로 추적합니다.
3. **C** 로 고정 크기 배열 스택을 처음부터 구현합니다. overflow와 underflow를 직접 막아야 합니다.
4. **Python** 으로 클래스를 만들어 같은 스택을 구현합니다. 실패는 예외로 알립니다.
5. **Rust** 로 제네릭 구조체를 만들어 구현합니다. 실패는 `Option`으로 표현합니다.
6. 응용 문제로 **괄호 검사기**를 세 언어로 완성합니다.

> **준비물**: Day 29의 포인터(`int *out`)와 Day 50~52의 구조체·클래스·메서드를 알고 있으면 편합니다. 잊었다면 이 수업의 줄별 설명만 따라와도 충분합니다.

## 2. 왜 스택이 필요한가

다음 네 가지 상황의 공통점을 찾아봅시다.

- 문서 편집기에서 **Ctrl+Z** 를 누르면 가장 최근에 한 작업부터 취소됩니다.
- 웹 브라우저의 **뒤로 가기**는 가장 최근에 본 페이지로 돌아갑니다.
- 함수 A가 B를 부르고 B가 C를 부르면, C가 끝난 뒤 **가장 최근에 부른 B** 로 돌아갑니다.
- 수식 `{[(a+b)*c]}`에서 `)`는 **가장 최근에 열린** `(`와 짝이 되어야 합니다.

네 상황 모두 "가장 나중에 들어온 것을 가장 먼저 처리한다"는 규칙을 따릅니다. 이 규칙을 **LIFO(Last In, First Out, 후입선출)** 라고 부릅니다. 스택은 LIFO 규칙만 허용하도록 연산을 제한한 자료구조입니다.

"그냥 배열을 쓰면 되지 않나?"라는 의문이 들 수 있습니다. 배열은 아무 위치나 읽고 쓸 수 있기 때문에, 코드를 읽는 사람은 "이 배열은 어디서 넣고 어디서 빼는가?"를 매번 분석해야 합니다. 스택이라는 이름과 연산을 정해 두면 **규칙이 코드에 드러나고**, 잘못된 위치를 건드리는 실수를 막을 수 있습니다.

## 3. 그림으로 이해하기

스택은 접시를 세로로 쌓는 것과 같습니다. 접시는 맨 위에만 올리고 맨 위에서만 꺼냅니다. 중간 접시를 바로 뺄 수는 없습니다.

```text
   push(30)          pop()             peek()
      ↓                ↑                 👀
   ┌──────┐         ┌──────┐          ┌──────┐
   │  30  │ ← top   │      │          │      │
   ├──────┤         ├──────┤          ├──────┤
   │  20  │         │  20  │ ← top    │  20  │ ← top (그대로)
   ├──────┤         ├──────┤          ├──────┤
   │  10  │         │  10  │          │  10  │
   └──────┘         └──────┘          └──────┘
    bottom           30을 꺼냄         20을 보기만 함
```

스택이 제공하는 기본 연산은 다섯 가지입니다.

| 연산         | 하는 일                               | 스택이 바뀌나? |
| ------------ | ------------------------------------- | -------------- |
| `push(x)`    | 맨 위에 x를 올린다                    | 예             |
| `pop()`      | 맨 위 값을 꺼내서 돌려준다            | 예             |
| `peek()`     | 맨 위 값을 보기만 한다                | 아니요         |
| `is_empty()` | 비어 있는지 알려 준다                 | 아니요         |
| `is_full()`  | 가득 찼는지 알려 준다(고정 크기일 때) | 아니요         |

## 4. 천천히 풀어보기

### 4.1 top: 스택의 맨 위를 가리키는 표시

배열로 스택을 만들 때 가장 중요한 변수는 **top** 입니다. top은 "지금 맨 위 원소가 몇 번 인덱스에 있는가"를 기억합니다. 이 수업의 C 코드는 다음 약속을 씁니다.

- 스택이 비어 있으면 `top = -1`입니다. 인덱스 0에도 아직 아무것도 없다는 뜻입니다.
- 원소가 1개면 `top = 0`, 2개면 `top = 1`입니다. 즉 **원소 개수 = top + 1** 입니다.
- 용량이 5라면 쓸 수 있는 인덱스는 0~4이므로 **가득 찬 상태는 `top = 4`** , 즉 `top == CAPACITY - 1`입니다.

> **참고**: top 대신 "원소 개수"를 뜻하는 `len`을 쓰는 방식도 많습니다. 이때 빈 상태는 `len = 0`, 맨 위 원소는 `items[len - 1]`, 가득 찬 상태는 `len == CAPACITY`입니다. 두 방식 모두 맞습니다. 중요한 것은 **한 가지 약속을 정해 끝까지 지키는 것**입니다.

### 4.2 불변식: 언제나 참이어야 하는 규칙

불변식(invariant)은 "연산 전과 후에 항상 참이어야 하는 조건"입니다. 스택의 불변식은 다음과 같습니다.

> `items[0]`부터 `items[top]`까지가 스택의 원소이고, `items[top]`은 가장 최근에 push했으며 아직 pop하지 않은 값이다.

push와 pop을 구현할 때마다 "이 연산이 끝난 뒤에도 불변식이 지켜지는가?"를 스스로 물어보세요. 버그의 대부분은 불변식이 깨지는 순간에 생깁니다.

### 4.3 push의 순서: 먼저 올리고, 그다음 쓴다

top이 -1에서 시작하므로 push는 반드시 **top을 먼저 1 늘리고, 그 자리에 값을 씁니다.**

```text
push(10) 전: top = -1   items = [ ?, ?, ?, ?, ? ]
① top++    : top =  0
② 쓰기     : items[0] = 10   → items = [10, ?, ?, ?, ? ]
```

순서를 거꾸로 하면 첫 push가 `items[-1]`에 씁니다. 배열 밖을 건드리는 심각한 버그입니다. 이 실수는 뒤의 "자주 하는 실수"에서 다시 봅니다.

### 4.4 pop의 순서: 먼저 읽고, 그다음 내린다

pop은 반대로 **값을 먼저 읽고, top을 1 줄입니다.**

```text
pop() 전 : top = 2   items = [10, 20, 30, ?, ? ]
① 읽기   : value = items[2] = 30
② top--  : top = 1   (30은 배열에 남아 있지만 이제 스택의 원소가 아니다)
```

pop이 배열 칸을 0으로 지우지 않는다는 점에 주의하세요. 불변식에 따라 `items[top]`보다 위의 칸은 "쓰레기 값"으로 취급하므로 지울 필요가 없습니다. 다음 push가 그 칸을 덮어씁니다.

### 4.5 overflow와 underflow

- **overflow(넘침)**: 가득 찬 스택에 push하려는 상황입니다. 고정 크기 배열에서만 생깁니다.
- **underflow(모자람)**: 빈 스택에서 pop이나 peek를 하려는 상황입니다. 모든 스택에서 생깁니다.

두 상황 모두 **프로그램이 죽어야 할 일이 아니라 정상적으로 처리해야 할 실패**입니다. 언어마다 실패를 알리는 방법이 다릅니다.

| 언어   | 실패를 알리는 방법                                       |
| ------ | -------------------------------------------------------- |
| C      | 함수가 `bool`로 성공 여부를 반환하고, 값은 포인터로 전달 |
| Python | `IndexError` 같은 예외를 발생시킴                        |
| Rust   | `Option<T>`를 반환해 `Some(값)` 또는 `None`으로 표현     |

> **주의**: 빈 스택에서 "-1을 반환한다"처럼 특별한 값으로 실패를 표시하는 방법은 피하세요. 스택에 진짜로 -1을 넣었다면 실패와 정상 값을 구별할 수 없습니다.

## 5. C로 구현하기

C에는 스택이 기본으로 들어 있지 않으므로 구조체와 배열로 직접 만듭니다. 아래 프로그램은 스택의 모든 연산과 overflow·underflow 처리를 한 파일에 담았습니다.

```c
// 파일: stack.c
#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 5              // 스택에 넣을 수 있는 최대 개수

typedef struct {
    int items[CAPACITY];        // 값을 저장할 배열
    int top;                    // 맨 위 원소의 인덱스 (비면 -1)
} Stack;

void init(Stack *s) {
    s->top = -1;
}

bool is_empty(const Stack *s) {
    return s->top == -1;
}

bool is_full(const Stack *s) {
    return s->top == CAPACITY - 1;
}

bool push(Stack *s, int value) {
    if (is_full(s)) {
        return false;           // overflow: 넣을 자리가 없다
    }
    s->top++;                   // ① top을 먼저 올리고
    s->items[s->top] = value;   // ② 그 자리에 쓴다
    return true;
}

bool pop(Stack *s, int *out) {
    if (is_empty(s)) {
        return false;           // underflow: 꺼낼 값이 없다
    }
    *out = s->items[s->top];    // ① 맨 위 값을 전달하고
    s->top--;                   // ② top을 내린다
    return true;
}

bool peek(const Stack *s, int *out) {
    if (is_empty(s)) {
        return false;
    }
    *out = s->items[s->top];    // top은 그대로 둔다
    return true;
}

void print_stack(const Stack *s) {
    printf("[");
    for (int i = 0; i <= s->top; i++) {
        printf("%d", s->items[i]);
        if (i < s->top) {
            printf(", ");
        }
    }
    printf("] (top=%d)\n", s->top);
}

int main(void) {
    Stack s;
    int value;

    init(&s);
    print_stack(&s);

    push(&s, 10);
    push(&s, 20);
    push(&s, 30);
    print_stack(&s);

    if (peek(&s, &value)) {
        printf("peek -> %d\n", value);
    }
    if (pop(&s, &value)) {
        printf("pop  -> %d\n", value);
    }
    print_stack(&s);

    for (int i = 1; i <= 5; i++) {
        if (!push(&s, i * 100)) {
            printf("push(%d) 실패: 스택이 가득 찼습니다\n", i * 100);
        }
    }
    print_stack(&s);

    while (pop(&s, &value)) {
        printf("%d ", value);
    }
    printf("\n");

    if (!pop(&s, &value)) {
        printf("pop 실패: 스택이 비어 있습니다\n");
    }
    return 0;
}
```

실행 결과:

```text
[] (top=-1)
[10, 20, 30] (top=2)
peek -> 30
pop  -> 30
[10, 20] (top=1)
push(400) 실패: 스택이 가득 찼습니다
push(500) 실패: 스택이 가득 찼습니다
[10, 20, 100, 200, 300] (top=4)
300 200 100 20 10
pop 실패: 스택이 비어 있습니다
```

### 코드 한 부분씩 읽기

| 코드                            | 설명                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `#include <stdbool.h>`          | `bool`, `true`, `false`를 쓰기 위한 헤더입니다. C17에서는 이 헤더가 있어야 `bool`이라는 이름을 쓸 수 있습니다.             |
| `#define CAPACITY 5`            | 용량을 숫자 5로 곳곳에 쓰지 않고 이름을 붙였습니다. 용량을 바꿀 때 이 한 줄만 고치면 됩니다.                               |
| `typedef struct { ... } Stack;` | 배열과 top을 하나로 묶은 구조체에 `Stack`이라는 이름을 붙입니다. 둘은 항상 함께 움직여야 하므로 묶어 두는 것이 안전합니다. |
| `void init(Stack *s)`           | 구조체의 **주소**를 받습니다. 값으로 받으면 복사본의 top만 바뀌고 main의 `s`는 그대로입니다.                               |
| `s->top`                        | 포인터가 가리키는 구조체의 멤버입니다. `(*s).top`과 같은 뜻입니다.                                                         |
| `bool is_empty(const Stack *s)` | `const`는 "이 함수는 스택을 읽기만 한다"는 약속입니다. 실수로 값을 바꾸면 컴파일러가 오류를 냅니다.                        |
| `bool push(...)`                | 성공하면 `true`, 가득 차서 못 넣으면 `false`를 돌려줍니다. 호출하는 쪽이 실패를 알 수 있습니다.                            |
| `bool pop(Stack *s, int *out)`  | C 함수는 값을 하나만 반환할 수 있습니다. 그래서 **성공 여부는 반환값**으로, **꺼낸 값은 `out` 포인터**로 전달합니다.       |
| `*out = s->items[s->top];`      | `out`이 가리키는 곳, 즉 main의 `value` 변수에 맨 위 값을 씁니다.                                                           |
| `while (pop(&s, &value))`       | pop이 성공하는 동안 반복합니다. 스택이 비면 `false`가 되어 반복이 끝납니다. 스택을 비우는 흔한 관용구입니다.               |

> **참고**: `main`에서 `push(&s, 10);`처럼 반환값을 무시한 곳이 있습니다. 용량 5에 3개만 넣으므로 실패할 수 없다는 것을 알고 있기 때문입니다. 실패할 수 있는 상황에서는 아래 `for` 반복처럼 반드시 반환값을 확인하세요.

> **오류 주의**: `Stack s;`만 쓰고 `init(&s);`를 빼먹으면 `s.top`에는 알 수 없는 쓰레기 값이 들어 있습니다. C의 지역 변수는 자동으로 0이 되지 않습니다. 사용하기 전에 반드시 초기화하세요.

## 6. Python으로 구현하기

Python의 list는 이미 끝에 넣는 `append()`와 끝에서 꺼내는 `pop()`을 제공합니다. 그런데도 클래스를 따로 만드는 이유는 **스택에 허용되는 연산만 드러내고, 실패 메시지를 스택에 맞게 정하기 위해서**입니다.

```python
# 파일: stack.py
class Stack:
    """list의 끝을 top으로 쓰는 스택"""

    def __init__(self):
        self._items = []          # 밑줄(_): 클래스 안에서만 쓰자는 약속

    def push(self, value):
        self._items.append(value)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop: 스택이 비어 있습니다")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek: 스택이 비어 있습니다")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)

    def __repr__(self):
        return f"Stack({self._items})"


s = Stack()
print(s, len(s))

for value in [10, 20, 30]:
    s.push(value)
print(s, len(s))

print("peek ->", s.peek())
print("pop  ->", s.pop())
print(s, len(s))

while not s.is_empty():
    print(s.pop(), end=" ")
print()

try:
    s.pop()
except IndexError as error:
    print("오류:", error)
```

실행 결과:

```text
Stack([]) 0
Stack([10, 20, 30]) 3
peek -> 30
pop  -> 30
Stack([10, 20]) 2
20 10
오류: pop: 스택이 비어 있습니다
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `class Stack:`                         | 스택이라는 새 타입을 정의합니다. `s = Stack()`으로 스택 객체를 만듭니다.                                                 |
| `def __init__(self):`                  | 객체가 만들어질 때 자동으로 호출됩니다. C의 `init(&s)`에 해당합니다. Python은 이 호출을 빼먹을 수 없습니다.              |
| `self._items = []`                     | 각 스택 객체가 자기만의 list를 가집니다. `self`는 C 코드의 `Stack *s`와 같은 역할입니다.                                 |
| `raise IndexError(...)`                | 실패를 예외로 알립니다. 예외를 처리하지 않으면 프로그램이 오류 메시지와 함께 멈추므로, 실패를 조용히 넘어갈 수 없습니다. |
| `self._items[-1]`                      | 음수 인덱스 -1은 "마지막 원소"입니다. C와 달리 Python은 음수 인덱스를 끝에서부터 세는 문법으로 정의합니다.               |
| `def __len__(self):`                   | 이 메서드가 있으면 `len(s)`를 쓸 수 있습니다. 밑줄 두 개로 둘러싼 메서드를 **특별 메서드**라고 합니다.                   |
| `def __repr__(self):`                  | `print(s)`가 보여 줄 문자열을 정합니다. 없으면 `<__main__.Stack object at 0x...>`처럼 알아보기 어려운 주소가 출력됩니다. |
| `print(s.pop(), end=" ")`              | `end=" "`는 줄을 바꾸지 않고 공백을 출력합니다. 마지막의 `print()`가 줄을 바꿉니다.                                      |
| `try: ... except IndexError as error:` | 예외가 발생하면 `except` 블록으로 이동합니다. `error`에는 `raise` 때 넣은 메시지가 들어 있습니다.                        |

> **TIP**: Python list의 `pop()`은 인자가 없으면 **마지막** 원소를 꺼냅니다. `pop(0)`은 **첫** 원소를 꺼내므로 스택이 아니라 큐처럼 동작하고, 나머지 원소를 모두 한 칸씩 옮기느라 느립니다.

## 7. Rust로 구현하기

Rust의 `Vec<T>`도 끝에 넣는 `push`와 끝에서 꺼내는 `pop`을 제공합니다. 여기서는 `Vec`을 감싼 **제네릭 구조체** `Stack<T>`를 만들어, 정수 스택과 문자열 스택을 같은 코드로 만들어 봅니다.

```rust
// 파일: stack.rs
#[derive(Debug)]
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, value: T) {
        self.items.push(value);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn len(&self) -> usize {
        self.items.len()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    println!("{:?} len={}", s, s.len());

    for value in [10, 20, 30] {
        s.push(value);
    }
    println!("{:?} len={}", s, s.len());

    if let Some(top) = s.peek() {
        println!("peek -> {top}");
    }
    match s.pop() {
        Some(value) => println!("pop  -> {value}"),
        None => println!("비어 있음"),
    }
    println!("{:?} len={}", s, s.len());

    while let Some(value) = s.pop() {
        print!("{value} ");
    }
    println!();

    println!("빈 스택 pop -> {:?}", s.pop());
    println!("is_empty = {}", s.is_empty());

    let mut words: Stack<String> = Stack::new();
    words.push(String::from("첫째"));
    words.push(String::from("둘째"));
    println!("문자열 스택 top -> {:?}", words.peek());
}
```

실행 결과:

```text
Stack { items: [] } len=0
Stack { items: [10, 20, 30] } len=3
peek -> 30
pop  -> 30
Stack { items: [10, 20] } len=2
20 10
빈 스택 pop -> None
is_empty = true
문자열 스택 top -> Some("둘째")
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#[derive(Debug)]`                             | `{:?}`로 구조체 내용을 출력할 수 있게 해 달라고 컴파일러에게 요청합니다.                                                                                       |
| `struct Stack<T>`                              | `T`는 "원소의 타입은 나중에 정하겠다"는 **타입 매개변수**입니다. `Stack<i32>`, `Stack<String>`처럼 쓸 때 정해집니다. C 코드가 `int` 전용인 것과 비교해 보세요. |
| `impl<T> Stack<T> { ... }`                     | `Stack<T>`의 메서드를 정의하는 블록입니다.                                                                                                                     |
| `fn new() -> Self`                             | 빈 스택을 만들어 돌려주는 **연관 함수**입니다. `Self`는 `Stack<T>`를 줄여 쓴 것입니다. 호출은 `Stack::new()`입니다.                                            |
| `fn push(&mut self, value: T)`                 | 스택을 바꾸므로 `&mut self`(가변 빌림)를 받습니다. `value`의 소유권은 스택 안으로 이동합니다.                                                                  |
| `fn pop(&mut self) -> Option<T>`               | 꺼낸 값의 **소유권을 호출자에게 넘깁니다.** 비어 있으면 `None`입니다.                                                                                          |
| `fn peek(&self) -> Option<&T>`                 | 읽기만 하므로 `&self`(공유 빌림)를 받고, 값을 넘기지 않고 **빌려줍니다**(`&T`). 그래서 peek 후에도 값은 스택에 남아 있습니다.                                  |
| `if let Some(top) = s.peek()`                  | 값이 있을 때만 블록을 실행합니다. `None`이면 조용히 건너뜁니다.                                                                                                |
| `match s.pop() { Some(..) => .., None => .. }` | 두 경우를 모두 적어야 컴파일됩니다. 한쪽을 빼먹으면 컴파일 오류가 나므로 underflow 처리를 잊을 수 없습니다.                                                    |
| `while let Some(value) = s.pop()`              | pop이 `Some`을 주는 동안 반복하고 `None`이면 멈춥니다. C의 `while (pop(&s, &value))`와 같은 관용구입니다.                                                      |

> **참고**: Rust에서 `let mut s`의 `mut`을 빼면 `s.push(...)`에서 컴파일 오류가 납니다. push는 `&mut self`를 요구하는데 불변 변수는 가변으로 빌려줄 수 없기 때문입니다.

## 8. 실행 추적

C 프로그램의 앞부분을 표로 따라가 봅시다. 스택 상태는 바닥부터 top 순서로 적습니다.

| 단계 | 실행한 코드        | 스택 상태       | top | 출력/반환      |
| ---: | ------------------ | --------------- | --: | -------------- |
|    0 | `init(&s)`         | `[]`            |  -1 |                |
|    1 | `push(&s, 10)`     | `[10]`          |   0 | true           |
|    2 | `push(&s, 20)`     | `[10, 20]`      |   1 | true           |
|    3 | `push(&s, 30)`     | `[10, 20, 30]`  |   2 | true           |
|    4 | `peek(&s, &value)` | `[10, 20, 30]`  |   2 | value = 30     |
|    5 | `pop(&s, &value)`  | `[10, 20]`      |   1 | value = 30     |
|    6 | `push(&s, 100)`    | `[10, 20, 100]` |   2 | true           |
|    7 | `push(&s, 200)`    | `[..., 200]`    |   3 | true           |
|    8 | `push(&s, 300)`    | `[..., 300]`    |   4 | true (가득 참) |
|    9 | `push(&s, 400)`    | 변화 없음       |   4 | **false**      |
|   10 | `push(&s, 500)`    | 변화 없음       |   4 | **false**      |

4단계의 peek와 5단계의 pop은 **같은 값 30을 돌려주지만**, peek 뒤에는 top이 2로 그대로이고 pop 뒤에는 1로 줄었다는 차이를 확인하세요.

## 9. 다른 예제로 다시 이해하기

스택의 대표 응용 문제는 **괄호 검사**입니다. 문자열을 왼쪽부터 읽으면서 여는 괄호는 스택에 넣고, 닫는 괄호를 만나면 스택의 top에 있는 여는 괄호와 짝이 맞는지 확인합니다. 안쪽에서 연 괄호가 먼저 닫혀야 하므로, "가장 최근에 열린 괄호"를 꺼내는 스택이 정확히 들어맞습니다. 문자열을 다 읽은 뒤에 스택이 비어 있어야 모든 괄호가 닫힌 것입니다.

`([)]`를 손으로 따라가 보면 왜 개수만 세면 안 되는지 알 수 있습니다.

| 읽은 문자 | 행동                                  | 스택  |
| --------- | ------------------------------------- | ----- |
| `(`       | push                                  | `(`   |
| `[`       | push                                  | `( [` |
| `)`       | pop한 값은 `[`, 짝은 `(` → **불일치** | 실패  |

### C 버전

```c
// 파일: brackets.c
#include <stdio.h>
#include <stdbool.h>

#define MAX_DEPTH 100

bool is_open(char c) {
    return c == '(' || c == '[' || c == '{';
}

bool is_close(char c) {
    return c == ')' || c == ']' || c == '}';
}

char pair_of(char close) {
    switch (close) {
    case ')': return '(';
    case ']': return '[';
    default:  return '{';
    }
}

bool is_balanced(const char *text) {
    char stack[MAX_DEPTH];
    int top = -1;

    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (is_open(c)) {
            if (top == MAX_DEPTH - 1) {
                return false;           // 너무 깊게 중첩됨
            }
            stack[++top] = c;           // push
        } else if (is_close(c)) {
            if (top == -1 || stack[top] != pair_of(c)) {
                return false;           // 짝이 없거나 다름
            }
            top--;                      // pop
        }
    }
    return top == -1;                   // 남은 여는 괄호가 없어야 함
}

int main(void) {
    const char *tests[] = {"(a+b)*[c-d]", "{[()()]}", "([)]", "((", ")("};
    int count = sizeof tests / sizeof tests[0];

    for (int i = 0; i < count; i++) {
        printf("%-12s -> %s\n", tests[i],
               is_balanced(tests[i]) ? "올바름" : "틀림");
    }
    return 0;
}
```

실행 결과:

```text
(a+b)*[c-d]  -> 올바름
{[()()]}     -> 올바름
([)]         -> 틀림
((           -> 틀림
)(           -> 틀림
```

`stack[++top] = c;`는 "top을 올리고 그 자리에 쓴다"를 한 줄로 쓴 것입니다. `printf`의 `%-12s`는 문자열을 12칸 너비에 **왼쪽 정렬**하라는 뜻이라 결과가 표처럼 가지런해집니다.

### Python 버전

```python
# 파일: brackets.py
PAIRS = {")": "(", "]": "[", "}": "{"}


def is_balanced(text):
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in PAIRS:
            if not stack or stack.pop() != PAIRS[ch]:
                return False
    return not stack


for t in ["(a+b)*[c-d]", "{[()()]}", "([)]", "((", ")("]:
    print(f"{t:<12} -> {'올바름' if is_balanced(t) else '틀림'}")
```

실행 결과:

```text
(a+b)*[c-d]  -> 올바름
{[()()]}     -> 올바름
([)]         -> 틀림
((           -> 틀림
)(           -> 틀림
```

`not stack or stack.pop() != PAIRS[ch]`에서 `or`는 **단축 평가**를 합니다. 스택이 비어 있으면 `not stack`이 참이므로 뒤의 `stack.pop()`은 실행되지 않습니다. 그래서 빈 스택에서 pop하는 오류가 생기지 않습니다. `return not stack`은 "스택이 비었으면 True"라는 뜻입니다.

### Rust 버전

```rust
// 파일: brackets.rs
fn pair_of(close: char) -> char {
    match close {
        ')' => '(',
        ']' => '[',
        _ => '{',
    }
}

fn is_balanced(text: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for ch in text.chars() {
        match ch {
            '(' | '[' | '{' => stack.push(ch),
            ')' | ']' | '}' => {
                if stack.pop() != Some(pair_of(ch)) {
                    return false;
                }
            }
            _ => {}
        }
    }
    stack.is_empty()
}

fn main() {
    let tests = ["(a+b)*[c-d]", "{[()()]}", "([)]", "((", ")("];
    for t in tests {
        let result = if is_balanced(t) { "올바름" } else { "틀림" };
        println!("{:<12} -> {}", t, result);
    }
}
```

실행 결과:

```text
(a+b)*[c-d]  -> 올바름
{[()()]}     -> 올바름
([)]         -> 틀림
((           -> 틀림
)(           -> 틀림
```

Rust 버전의 `stack.pop() != Some(pair_of(ch))`는 빈 스택 검사와 짝 비교를 한 번에 합니다. 빈 스택이면 `pop()`이 `None`을 주는데, `None`은 어떤 `Some(...)`과도 같지 않으므로 자연스럽게 `false`로 처리됩니다. `match`의 `'(' | '[' | '{'`는 "셋 중 하나라면"이라는 뜻이고, `_ => {}`는 괄호가 아닌 문자를 무시합니다.

## 10. 시간·공간 복잡도

| 연산     | C 배열 | Python list | Rust Vec  | 이유                                          |
| -------- | ------ | ----------- | --------- | --------------------------------------------- |
| push     | O(1)   | 평균 O(1)   | 평균 O(1) | 끝에 하나 추가. list·Vec은 가끔 크기를 늘린다 |
| pop      | O(1)   | O(1)        | O(1)      | 끝에서 하나 제거                              |
| peek     | O(1)   | O(1)        | O(1)      | 마지막 인덱스를 바로 읽음                     |
| is_empty | O(1)   | O(1)        | O(1)      | 개수만 확인                                   |
| 값 찾기  | O(n)   | O(n)        | O(n)      | 원하는 값을 찾으려면 차례로 확인해야 함       |

공간은 원소 n개에 대해 O(n)입니다. C 고정 배열은 원소 수와 상관없이 항상 CAPACITY만큼 차지합니다.

"평균 O(1)"은 **상각(amortized) O(1)** 이라고도 합니다. Python list와 Rust Vec은 공간이 모자라면 더 큰 공간을 새로 잡고 기존 원소를 옮깁니다. 이 순간은 O(n)이지만 크기를 보통 두 배씩 늘리기 때문에 드물게 일어나고, push 전체를 평균 내면 한 번에 상수 시간입니다.

## 11. 세 언어 비교

| 관점        | C                              | Python                     | Rust                        |
| ----------- | ------------------------------ | -------------------------- | --------------------------- |
| 저장 공간   | 고정 크기 배열 `int items[5]`  | 자동으로 늘어나는 list     | 자동으로 늘어나는 `Vec<T>`  |
| 원소 타입   | 선언한 타입 하나(`int`)        | 아무 타입이나 섞을 수 있음 | 타입 매개변수 `T` 하나      |
| 초기화      | `init(&s)`를 직접 호출         | `__init__`이 자동 호출     | `Stack::new()`              |
| overflow    | `is_full`로 직접 막아야 함     | 메모리가 허락하는 한 없음  | 메모리가 허락하는 한 없음   |
| underflow   | `bool` 반환 + 포인터로 값 전달 | `IndexError` 예외          | `Option<T>`의 `None`        |
| 실수했을 때 | 배열 밖을 써도 컴파일됨(위험)  | 실행 중 예외로 멈춤        | 대부분 컴파일 단계에서 막힘 |

세 구현 모두 **배열의 끝을 top으로 쓴다**는 핵심은 같습니다. 차이는 "실패와 메모리를 누가, 언제 검사하는가"입니다. C는 프로그래머가, Python은 실행 중인 인터프리터가, Rust는 컴파일러와 타입이 검사를 맡습니다.

## 12. 자주 하는 실수

### 실수 1: C에서 top을 올리기 전에 쓴다

```c
bool push(Stack *s, int value) {
    s->items[s->top] = value;   // top이 -1이면 items[-1]에 쓴다!
    s->top++;
    return true;
}
```

top이 -1로 시작하므로 첫 push가 배열 밖 `items[-1]`에 씁니다. C 컴파일러는 이 코드를 막지 않고, 실행 결과는 **정의되지 않은 동작**입니다. 다른 변수가 망가지거나 프로그램이 멈출 수도 있고, 운 나쁘게 멀쩡해 보일 수도 있습니다. "먼저 올리고, 그다음 쓴다"를 기억하세요. 가득 찼는지 검사하는 것도 빠져 있습니다.

### 실수 2: C에서 빈 스택을 검사하지 않고 pop한다

```c
int pop(Stack *s) {
    return s->items[s->top--];  // 비어 있으면 items[-1]을 읽는다
}
```

빈 스택이면 top이 -1이므로 역시 배열 밖을 읽습니다. 게다가 top이 -2가 되어 이후의 모든 연산이 틀어집니다. pop은 항상 `is_empty` 검사로 시작해야 합니다.

### 실수 3: Python에서 `pop(0)`을 쓴다

```python
stack = [1, 2, 3]
stack.pop(0)    # 1을 꺼낸다 — 가장 먼저 넣은 값!
```

`pop(0)`은 가장 먼저 넣은 값을 꺼내므로 LIFO가 아닙니다. 그리고 나머지 원소를 모두 한 칸씩 앞으로 옮기므로 O(n)입니다. 스택에는 인자 없는 `pop()`을 쓰세요.

### 실수 4: Rust에서 무조건 `unwrap()`한다

```rust
let mut s: Vec<i32> = Vec::new();
let top = s.pop().unwrap();   // 비어 있으면 panic으로 프로그램이 멈춘다
```

`unwrap()`은 "`None`일 리가 없다"고 단정하는 것입니다. 빈 스택이면 `called Option::unwrap() on a None value`라는 메시지와 함께 프로그램이 멈춥니다(panic). 비어 있을 수 있다면 `match`, `if let`, `while let`으로 처리하세요.

### 실수 5: Rust에서 peek로 빌린 값을 들고 있는 동안 push한다

```rust
// 파일: borrow_error.rs (컴파일 오류: E0502)
fn main() {
    let mut items = vec![1, 2, 3];
    let top = items.last();   // items를 읽기 전용으로 빌림
    items.push(4);            // 빌려준 동안 수정하려 함
    println!("{:?}", top);
}
```

이 코드는 컴파일되지 않습니다. 컴파일러는 다음과 같은 오류를 보여 줍니다.

```text
error[E0502]: cannot borrow `items` as mutable because it is also borrowed as immutable
```

`push`는 Vec의 공간을 새로 잡으면서 원소들의 위치를 옮길 수 있습니다. 그러면 `top`이 가리키던 곳이 사라집니다. Rust는 이런 위험을 **실행 전에** 막습니다. 해결 방법은 두 가지입니다. `let top = items.last().copied();`처럼 값을 복사해 두거나, `top`을 다 쓴 뒤에 push하세요. C에서 같은 일을 하면 컴파일은 되지만 오래된 주소를 읽는 버그가 됩니다.

## 13. Q&A

**Q. 왜 배열의 앞이 아니라 끝을 top으로 쓰나요?**

A. 앞을 top으로 쓰면 push할 때마다 기존 원소를 전부 한 칸씩 뒤로 밀어야 하고, pop할 때마다 앞으로 당겨야 합니다. 원소가 n개면 O(n)입니다. 끝을 쓰면 다른 원소를 건드릴 필요가 없어 O(1)입니다.

**Q. C 스택의 용량이 부족하면 어떻게 하나요?**

A. `int items[CAPACITY]` 대신 `int *items`를 두고 `malloc`으로 공간을 잡은 뒤, 가득 차면 `realloc`으로 두 배 크기로 늘리면 됩니다. Python list와 Rust Vec이 내부에서 하는 일이 바로 이것입니다. 동적 할당은 Day 40에서 배웁니다.

**Q. "스택 오버플로(stack overflow)"라는 오류와 같은 스택인가요?**

A. 개념은 같습니다. 프로그램은 함수를 호출할 때마다 지역 변수와 돌아갈 위치를 **호출 스택(call stack)** 에 push하고, 함수가 끝나면 pop합니다. 재귀 함수가 끝나지 않고 계속 자신을 부르면 호출 스택이 가득 차서 stack overflow가 납니다. Day 24의 재귀에서 이 이야기를 다시 만납니다.

**Q. Python list가 이미 스택처럼 동작하는데 클래스를 꼭 만들어야 하나요?**

A. 간단한 스크립트에서는 list를 그대로 써도 됩니다. 하지만 클래스로 감싸면 `insert`나 `sort`처럼 스택 규칙을 깨는 연산을 쓸 수 없게 막고, 빈 스택 오류 메시지를 알아보기 쉽게 정할 수 있습니다. 코드가 커질수록 이런 경계가 버그를 줄여 줍니다.

**Q. Rust의 `peek`는 왜 `Option<T>`가 아니라 `Option<&T>`를 반환하나요?**

A. `T`를 반환하면 값의 소유권이 호출자에게 넘어가서 스택에서 사라져야 합니다. 그것은 pop입니다. peek는 보기만 해야 하므로 값을 **빌려주는** `&T`를 반환합니다.

## 14. 핵심 요약

- 스택은 **LIFO**, 즉 가장 나중에 넣은 값을 가장 먼저 꺼내는 자료구조입니다.
- 기본 연산은 `push`(넣기), `pop`(꺼내기), `peek`(보기), `is_empty`(비었나)입니다.
- 배열 스택에서 top이 -1이면 비어 있고, `top == CAPACITY - 1`이면 가득 찼습니다.
- push는 **top을 올린 뒤 쓰고**, pop은 **읽은 뒤 top을 내립니다.**
- overflow와 underflow는 정상적인 실패로 처리합니다. C는 `bool`과 포인터, Python은 예외, Rust는 `Option`을 씁니다.
- 배열의 **끝**을 top으로 쓰면 push·pop·peek가 모두 O(1)입니다.
- "가장 최근의 미완료 작업으로 돌아가야 하는" 문제(실행 취소, 괄호 검사, 함수 호출)를 보면 스택을 떠올리세요.

## 15. 도전 문제

아래 문제를 직접 풀어 보세요. 아래쪽 실습 탭에는 예측, 빈칸, 수정, 디버그, 직접 구현 문제가 준비되어 있습니다.

1. **(C)** 스택에 들어 있는 원소를 top부터 바닥 순서로 출력하는 `print_from_top(const Stack *s)`를 작성하세요. 스택은 바꾸지 마세요.
2. **(Python)** 문자열을 입력받아 스택으로 뒤집는 `reverse_text(text)`를 작성하세요. `"hello"` → `"olleh"`.
3. **(Rust)** `Stack<T>`에 원소를 모두 지우는 `clear(&mut self)`와 top을 바꿔치기하는 `replace_top(&mut self, value: T) -> Option<T>`를 추가하세요.
4. **(세 언어)** 괄호 검사기가 틀린 경우 **몇 번째 문자에서** 틀렸는지 알려 주도록 바꿔 보세요. 끝까지 읽었는데 스택이 남았다면 문자열 길이를 알려 주면 됩니다.
