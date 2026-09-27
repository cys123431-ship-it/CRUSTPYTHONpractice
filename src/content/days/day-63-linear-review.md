---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-63-linear-review
courseId: crp-92
phaseId: phase-06
dayNumber: 63
date: "2026-12-02"
title: 선형 자료구조 종합 — 스택과 큐로 만드는 수식 계산기
summary: 스택, 큐, 원형 큐, 연결 리스트를 한 표로 정리하고 상황에 맞는 자료구조를 고르는 기준을 세웁니다. 미니 프로젝트로 중위 표기식을 후위 표기식으로 바꾸고(연산자 스택 + 출력 큐) 계산하는(값 스택) 계산기를 C, Python, Rust로 완성합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-62-doubly-linked]
learningObjectives:
  - 스택, 큐, 원형 큐, 단일·이중 연결 리스트의 연산 비용과 쓰임새를 비교한다.
  - 문제 상황을 읽고 알맞은 선형 자료구조를 고르고 이유를 설명한다.
  - 후위 표기식을 값 스택으로 계산하는 과정을 손으로 추적한다.
  - 연산자 우선순위와 괄호를 스택으로 처리해 중위 표기식을 후위 표기식으로 바꾼다.
  - 괄호 불일치, 피연산자 부족, 0으로 나누기 오류를 세 언어에서 각각의 방식으로 처리한다.
concepts:
  [
    stack,
    queue,
    linked list,
    data structure selection,
    postfix,
    infix,
    shunting-yard,
    operator precedence,
  ]
runnerMode: python
playgroundSource: |
  # 파일: postfix.py — 후위 표기식을 바꿔 가며 계산해 보세요.
  def eval_postfix(tokens):
      stack = []
      for t in tokens:
          if t.isdigit():
              stack.append(int(t))
          else:
              b = stack.pop()
              a = stack.pop()
              stack.append({"+": a + b, "-": a - b, "*": a * b}[t])
          print(f"{t:>3} → 스택 {stack}")
      return stack.pop()


  print("결과:", eval_postfix("3 4 2 * +".split()))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day63-predict-py
    title: 후위 표기식 계산하기
    kind: predict
    objective: 값 스택으로 후위 표기식을 계산하는 과정을 추적한다.
    prompt: 출력될 숫자 하나를 예측하세요.
    starter: |-
      tokens = "5 1 2 + 4 * + 3 -".split()
      stack = []
      for t in tokens:
          if t.isdigit():
              stack.append(int(t))
          else:
              b = stack.pop()
              a = stack.pop()
              if t == "+":
                  stack.append(a + b)
              elif t == "-":
                  stack.append(a - b)
              else:
                  stack.append(a * b)
      print(stack.pop())
    answer: "14"
    hint: "연산자를 만나면 스택에서 두 값을 꺼내 계산한 결과를 다시 넣습니다. 먼저 꺼낸 값이 오른쪽 피연산자(b)입니다."
    explanation: "1 2 +는 3, 3 4 *는 12, 5 12 +는 17, 17 3 -는 14입니다. 중위 표기로 쓰면 5 + (1 + 2) * 4 - 3입니다."
    commonMistakes:
      - "먼저 꺼낸 값을 왼쪽 피연산자로 써서 3 - 17 = -14를 적음"
      - "연산자를 만날 때마다 스택의 맨 아래 두 값을 계산함"
    language: python
    verification: run
  - id: ex-day63-predict-c
    title: 우선순위가 같은 연산자 처리하기
    kind: predict
    objective: 같은 우선순위의 연산자를 만났을 때 먼저 있던 연산자를 내보내는 규칙을 확인한다.
    prompt: 출력될 후위 표기식을 적으세요(토큰 사이는 공백 하나).
    starter: |-
      #include <stdio.h>

      int prec(char op) {
          return (op == '*' || op == '/') ? 2 : 1;
      }

      int main(void) {
          const char *expr = "8-3-2*5";
          char stack[16];
          int top = -1;
          for (int i = 0; expr[i] != '\0'; i++) {
              char c = expr[i];
              if (c >= '0' && c <= '9') {
                  printf("%c ", c);
              } else {
                  while (top >= 0 && prec(stack[top]) >= prec(c)) {
                      printf("%c ", stack[top--]);
                  }
                  stack[++top] = c;
              }
          }
          while (top >= 0) {
              printf("%c ", stack[top--]);
          }
          printf("\n");
          return 0;
      }
    answer: "8 3 - 2 5 * -"
    hint: "두 번째 -를 만났을 때 스택 top의 -와 우선순위가 같으므로 먼저 있던 -를 내보냅니다. *는 -보다 높으므로 그냥 쌓입니다."
    explanation: "8 3이 나오고, 두 번째 -가 첫 번째 -를 밀어내 '8 3 -'가 됩니다. 2가 나오고 *는 -위에 쌓이며, 5가 나온 뒤 끝에서 *와 -가 차례로 나옵니다. 결과는 (8-3)-(2*5)의 순서로 계산하라는 뜻입니다."
    commonMistakes:
      - "같은 우선순위일 때 내보내지 않아 8 3 2 5 * - -로 적음(8-(3-10)의 뜻이 됨)"
      - "*를 만났을 때 -를 먼저 내보냄"
    language: c
    verification: run
  - id: ex-day63-fill
    title: Rust 우선순위 함수 채우기
    kind: fill
    objective: match로 연산자별 우선순위를 돌려주는 함수를 완성한다.
    prompt: "prec 함수의 빈칸을 채우세요. +와 -는 1, *와 /는 2를 돌려주어야 합니다."
    starter: |-
      fn prec(op: char) -> u8 {
          match op {
              _____ => 1,
              _____ => 2,
              _ => 0,
          }
      }

      fn main() {
          let ops = ['+', '*', '-', '/', '('];
          let levels: Vec<u8> = ops.iter().map(|&op| prec(op)).collect();
          println!("{:?}", levels);
      }
    answer: |-
      fn prec(op: char) -> u8 {
          match op {
              '+' | '-' => 1,
              '*' | '/' => 2,
              _ => 0,
          }
      }

      fn main() {
          let ops = ['+', '*', '-', '/', '('];
          let levels: Vec<u8> = ops.iter().map(|&op| prec(op)).collect();
          println!("{:?}", levels);
      }
    output: "[1, 2, 1, 2, 0]"
    hint: "match의 한 갈래에 여러 패턴을 쓰려면 |로 잇습니다. 문자 리터럴은 작은따옴표입니다."
    explanation: "'+' | '-'는 둘 중 하나와 같으면 1입니다. 여는 괄호는 0이라서 스택에서 연산자를 내보낼 때 절대 먼저 나가지 않습니다. 이것이 괄호 안의 연산자를 괄호 밖과 분리하는 방법입니다."
    commonMistakes:
      - '"+"처럼 큰따옴표를 써서 &str과 char 타입이 맞지 않는 오류를 냄'
      - "_ 갈래를 빼서 match가 모든 경우를 다루지 않는다는 컴파일 오류를 냄"
    language: rust
    verification: run
  - id: ex-day63-modify
    title: Python 계산기에 나머지 연산자 % 추가하기
    kind: modify
    objective: 우선순위 표와 계산 표 두 곳을 함께 고쳐 새 연산자를 지원한다.
    prompt: "계산기가 %(나머지)를 *, /와 같은 우선순위로 지원하도록 고치세요. 17 % 5 * 2는 4, 20 - 17 % 5는 18이어야 합니다."
    starter: |-
      PREC = {"+": 1, "-": 1, "*": 2, "/": 2}


      def apply(op, a, b):
          if op == "+":
              return a + b
          if op == "-":
              return a - b
          if op == "*":
              return a * b
          return int(a / b)


      def calc(expr):
          ops, vals = [], []

          def reduce_top():
              b, a = vals.pop(), vals.pop()
              vals.append(apply(ops.pop(), a, b))

          for t in expr.split():
              if t.isdigit():
                  vals.append(int(t))
              else:
                  while ops and PREC[ops[-1]] >= PREC[t]:
                      reduce_top()
                  ops.append(t)
          while ops:
              reduce_top()
          return vals[0]


      print(calc("8 - 3 * 2"))
    answer: |-
      PREC = {"+": 1, "-": 1, "*": 2, "/": 2, "%": 2}


      def apply(op, a, b):
          if op == "+":
              return a + b
          if op == "-":
              return a - b
          if op == "*":
              return a * b
          if op == "%":
              return a % b
          return int(a / b)


      def calc(expr):
          ops, vals = [], []

          def reduce_top():
              b, a = vals.pop(), vals.pop()
              vals.append(apply(ops.pop(), a, b))

          for t in expr.split():
              if t.isdigit():
                  vals.append(int(t))
              else:
                  while ops and PREC[ops[-1]] >= PREC[t]:
                      reduce_top()
                  ops.append(t)
          while ops:
              reduce_top()
          return vals[0]


      print(calc("8 - 3 * 2"), calc("17 % 5 * 2"), calc("20 - 17 % 5"))
    output: "2 4 18"
    hint: "PREC 사전에 %를 추가하지 않으면 KeyError가 납니다. apply에도 % 계산을 넣어야 합니다."
    explanation: "이 계산기는 후위 표기식을 따로 만들지 않고, 연산자를 스택에서 꺼낼 때 바로 계산합니다. %는 우선순위 2이므로 17 % 5 * 2는 (17 % 5) * 2 = 4, 20 - 17 % 5는 20 - 2 = 18입니다."
    commonMistakes:
      - "apply만 고치고 PREC에 %를 넣지 않아 KeyError가 남"
      - "%의 우선순위를 1로 두어 20 - 17 % 5를 (20 - 17) % 5 = 3으로 계산함"
    language: python
    verification: run
  - id: ex-day63-debug
    title: C 후위 계산기의 피연산자 순서 고치기
    kind: debug
    objective: 스택에서 꺼낸 두 값 중 어느 쪽이 왼쪽 피연산자인지 바로잡는다.
    prompt: '"9 2 -"는 7, "8 2 /"는 4여야 하는데 이 코드는 -7과 0을 출력합니다. 원인을 찾아 고치세요.'
    starter: |-
      #include <stdio.h>

      int eval(const char *postfix) {
          int stack[16];
          int top = -1;
          for (int i = 0; postfix[i] != '\0'; i++) {
              char c = postfix[i];
              if (c >= '0' && c <= '9') {
                  stack[++top] = c - '0';
              } else if (c != ' ') {
                  int a = stack[top--];
                  int b = stack[top--];
                  int r = (c == '-') ? a - b : (c == '/') ? a / b : a + b;
                  stack[++top] = r;
              }
          }
          return stack[top];
      }

      int main(void) {
          printf("%d %d\n", eval("9 2 -"), eval("8 2 /"));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int eval(const char *postfix) {
          int stack[16];
          int top = -1;
          for (int i = 0; postfix[i] != '\0'; i++) {
              char c = postfix[i];
              if (c >= '0' && c <= '9') {
                  stack[++top] = c - '0';
              } else if (c != ' ') {
                  int b = stack[top--];
                  int a = stack[top--];
                  int r = (c == '-') ? a - b : (c == '/') ? a / b : a + b;
                  stack[++top] = r;
              }
          }
          return stack[top];
      }

      int main(void) {
          printf("%d %d\n", eval("9 2 -"), eval("8 2 /"));
          return 0;
      }
    output: "7 4"
    starterOutput: "-7 0"
    hint: '"9 2 -"에서 9가 먼저 push되고 2가 나중에 push됩니다. 스택에서 먼저 나오는 값은 어느 쪽일까요?'
    explanation: "스택은 LIFO이므로 먼저 꺼낸 값이 나중에 넣은 오른쪽 피연산자입니다. 원래 코드는 a=2, b=9로 2-9 = -7, 2/8 = 0을 계산했습니다. 덧셈과 곱셈은 순서가 바뀌어도 결과가 같아서 이 버그를 놓치기 쉽습니다."
    commonMistakes:
      - "a - b를 b - a로 바꿔 빼기만 고치고 나누기는 그대로 둠"
      - "+ 연산으로만 테스트해 버그를 발견하지 못함"
    language: c
    verification: run
  - id: ex-day63-independent
    title: Rust로 자료구조 고르기 도우미 만들기
    kind: independent
    objective: 요구 사항을 enum으로 표현하고 match로 알맞은 자료구조를 고른다.
    prompt: "enum Need { LastFirst, FirstFirst, FixedRecent, InsertMiddle, BothEnds }를 정의하고, 각 요구에 맞는 자료구조 이름을 돌려주는 fn choose(need: Need) -> &'static str을 만드세요. 다섯 요구를 차례로 넣어 한 줄에 하나씩 출력합니다."
    starter: |-
      // LastFirst: 가장 최근 것부터 처리      → 스택
      // FirstFirst: 먼저 온 것부터 처리       → 큐
      // FixedRecent: 최근 N개만 고정 공간에   → 원형 버퍼
      // InsertMiddle: 알고 있는 위치에 자주 삽입·삭제 → 연결 리스트
      // BothEnds: 양 끝에서 넣고 빼기          → 덱(deque)
      fn main() {
          println!("구현하세요");
      }
    answer: |-
      #[derive(Debug, Clone, Copy)]
      enum Need {
          LastFirst,
          FirstFirst,
          FixedRecent,
          InsertMiddle,
          BothEnds,
      }

      fn choose(need: Need) -> &'static str {
          match need {
              Need::LastFirst => "스택",
              Need::FirstFirst => "큐",
              Need::FixedRecent => "원형 버퍼",
              Need::InsertMiddle => "연결 리스트",
              Need::BothEnds => "덱(deque)",
          }
      }

      fn main() {
          let needs = [
              Need::LastFirst,
              Need::FirstFirst,
              Need::FixedRecent,
              Need::InsertMiddle,
              Need::BothEnds,
          ];
          for need in needs {
              println!("{:?} -> {}", need, choose(need));
          }
      }
    output: |-
      LastFirst -> 스택
      FirstFirst -> 큐
      FixedRecent -> 원형 버퍼
      InsertMiddle -> 연결 리스트
      BothEnds -> 덱(deque)
    hint: "&'static str은 프로그램 전체 기간 동안 살아 있는 문자열 리터럴의 타입입니다. match가 enum의 모든 변형을 다루면 _ 갈래가 필요 없습니다."
    explanation: "enum의 변형마다 한 갈래씩 적으면 새 요구를 추가했을 때 match가 빠진 갈래를 컴파일 오류로 알려 줍니다. Copy를 derive하면 for 반복에서 need를 choose에 넘긴 뒤에도 출력에 다시 쓸 수 있습니다."
    commonMistakes:
      - "Copy 없이 need를 두 번 써서 이동된 값 사용 오류를 냄"
      - "반환형을 String으로 해서 매번 문자열을 새로 만들어야 함"
    language: rust
    verification: run
quiz:
  - id: quiz-day63-01
    question: 프린터에 보낸 문서를 보낸 순서대로 인쇄하려면 어떤 자료구조가 알맞나요?
    choices: ["스택", "큐", "해시 맵", "정렬된 배열"]
    answerIndex: 1
    explanation: 먼저 보낸 문서가 먼저 인쇄되어야 하므로 FIFO인 큐입니다.
  - id: quiz-day63-02
    question: "중위 표기식 (2 + 3) * 4의 후위 표기식은?"
    choices: ["2 3 4 * +", "2 3 + 4 *", "* + 2 3 4", "2 + 3 4 *"]
    answerIndex: 1
    explanation: 괄호 안의 2 + 3을 먼저 계산해야 하므로 2 3 +가 먼저 나오고, 그 결과에 4를 곱하는 4 *가 뒤에 옵니다. 후위 표기식에는 괄호가 필요 없습니다.
  - id: quiz-day63-03
    question: 중위 → 후위 변환에서 닫는 괄호 ')'를 만나면 무엇을 하나요?
    choices:
      - 연산자 스택을 모두 비운다
      - 여는 괄호 '('가 나올 때까지 연산자를 꺼내 출력하고, '('는 버린다
      - "')'를 출력에 그대로 쓴다"
      - 스택에 ')'를 push한다
    answerIndex: 1
    explanation: 괄호 안의 연산자는 괄호가 닫히는 순간 모두 계산 순서가 정해집니다. 여는 괄호를 만나지 못하고 스택이 비면 괄호 짝이 맞지 않는 것입니다.
  - id: quiz-day63-04
    question: '후위 표기식 "3 +"를 계산하면 어떻게 되어야 하나요?'
    choices:
      - "3이 된다"
      - "0이 된다"
      - "+에서 스택에 값이 하나뿐이라 피연산자가 부족하다는 오류를 낸다"
      - "무한 반복에 빠진다"
    answerIndex: 2
    explanation: 이항 연산자는 값 두 개가 필요합니다. pop하기 전에 스택에 값이 두 개 이상 있는지 확인해야 하며, 확인하지 않으면 C에서는 배열 밖을 읽고 Python에서는 IndexError가 납니다.
  - id: quiz-day63-05
    question: "C와 Rust에서 -7 / 2는 -3이지만 Python에서 -7 // 2는 -4입니다. 그 이유는?"
    choices:
      - Python이 계산을 잘못한다
      - C와 Rust의 정수 나눗셈은 0 쪽으로 버리고, Python의 //는 음의 무한대 쪽으로 내리기(floor) 때문이다
      - Python은 정수를 실수로 바꾸기 때문이다
      - C와 Rust는 반올림하기 때문이다
    answerIndex: 1
    explanation: -3.5를 0 쪽으로 버리면 -3, 아래로 내리면 -4입니다. 세 언어의 계산기 결과를 맞추려고 Python 버전은 int(a / b)로 0 쪽 버림을 흉내 냈습니다.
---

## 1. 오늘 배울 내용

Day 57부터 Day 62까지 여섯 가지 선형 자료구조를 만들었습니다. 오늘은 **복습과 종합**의 날입니다.

1. 지금까지 배운 자료구조를 **한 표로 정리**하고, 문제 상황에서 자료구조를 **고르는 기준**을 세웁니다.
2. 미니 프로젝트로 **수식 계산기**를 만듭니다. `2 * (3 + 4) - 10 / 5` 같은 식을 받아 계산합니다.
   - 계산하기 쉬운 **후위 표기식**을 **값 스택**으로 계산합니다.
   - 우리가 쓰는 **중위 표기식**을 **연산자 스택**과 **출력 큐**로 후위 표기식으로 바꿉니다.
3. 같은 계산기를 **C, Python, Rust** 로 각각 완성하고, 잘못된 식에 대한 오류 처리를 비교합니다.

스택과 큐가 실제 프로그램 안에서 **함께** 일하는 모습을 보는 것이 오늘의 목표입니다. 계산기, 컴파일러, 스프레드시트의 수식 엔진이 모두 이 원리를 씁니다.

## 2. 선형 자료구조 한눈에 보기

| 자료구조         | 규칙                        | 핵심 연산 비용                    | 대표 쓰임                        | 배운 날 |
| ---------------- | --------------------------- | --------------------------------- | -------------------------------- | ------- |
| 스택             | LIFO, 한쪽 끝만 사용        | push·pop·peek O(1)                | 실행 취소, 괄호 검사, 함수 호출  | 57, 58  |
| 큐               | FIFO, 뒤에서 넣고 앞에서 뺌 | enqueue·dequeue O(1)(구현에 따라) | 대기열, 작업 처리, BFS           | 59      |
| 원형 큐/버퍼     | 인덱스를 `%`로 한 바퀴 돌림 | O(1), 고정 공간                   | 최근 N개, 스트리밍 데이터        | 60      |
| 단일 연결 리스트 | next로 한 방향 연결         | 맨 앞 삽입·삭제 O(1), 검색 O(n)   | 맨 앞 작업이 잦은 목록, 큐 구현  | 61      |
| 이중 연결 리스트 | prev·next로 양방향 연결     | 알고 있는 노드 삭제 O(1)          | 재생 목록, 편집기 커서, LRU 캐시 | 62      |
| 동적 배열        | 연속 저장, 자동 확장        | 인덱스 O(1), 끝 추가 상각 O(1)    | 거의 모든 곳의 기본 선택         | 27, 28  |

세 언어의 표준 도구도 정리해 둡시다.

| 필요한 것   | C                    | Python                   | Rust                                 |
| ----------- | -------------------- | ------------------------ | ------------------------------------ |
| 스택        | 배열 + top 직접 구현 | `list` (`append`, `pop`) | `Vec` (`push`, `pop`)                |
| 큐·덱       | 원형 버퍼 직접 구현  | `collections.deque`      | `std::collections::VecDeque`         |
| 연결 리스트 | 구조체 + 포인터      | 직접 구현(드물게 필요)   | `std::collections::LinkedList`(드묾) |
| 동적 배열   | `malloc`/`realloc`   | `list`                   | `Vec`                                |

## 3. 어떤 자료구조를 골라야 할까

자료구조를 고를 때는 다음 질문을 **차례로** 던져 보세요.

```text
① 꺼내는 순서가 정해져 있는가?
   ├─ 가장 최근 것부터 ─────────────────► 스택
   ├─ 가장 먼저 온 것부터 ──────────────► 큐
   │     └─ 공간이 고정이고 최근 N개만? ► 원형 버퍼
   └─ 양쪽 끝 모두 ─────────────────────► 덱
② 순서가 없거나, 아무 위치나 읽어야 하는가?
   ├─ k번째를 자주 읽는다 ──────────────► 동적 배열
   └─ 이미 가리키고 있는 위치에 자주 넣고 뺀다 ► 연결 리스트
③ 값으로 빨리 찾아야 하는가? ─────────────► 해시 맵(Day 67), 탐색 트리(Day 65)
```

몇 가지 상황으로 연습해 봅시다.

| 상황                                | 고를 자료구조    | 이유                              |
| ----------------------------------- | ---------------- | --------------------------------- |
| 웹 브라우저의 뒤로 가기             | 스택             | 가장 최근 페이지로 돌아감         |
| 콜센터 대기 전화                    | 큐               | 먼저 건 사람부터 연결             |
| 게임의 최근 10프레임 입력 기록      | 원형 버퍼        | 고정 공간, 오래된 기록은 덮어씀   |
| 요세푸스 문제, 라운드 로빈 스케줄링 | 큐(덱)           | 앞에서 꺼내 뒤로 보내기를 반복    |
| 음악 재생 목록의 이전 곡/다음 곡    | 이중 연결 리스트 | 양방향 이동과 현재 곡 삭제가 O(1) |
| 학생 번호로 성적을 바로 조회        | 배열             | 번호가 곧 인덱스                  |

> **TIP**: 확신이 서지 않으면 **동적 배열부터** 쓰세요. 대부분의 상황에서 충분히 빠르고 가장 단순합니다. 성능 문제가 실제로 확인되었을 때 더 특별한 자료구조로 바꾸면 됩니다.

## 4. 천천히 풀어보기

### 4.1 중위, 후위 표기식

우리는 `3 + 4`처럼 연산자를 두 값의 **가운데** 씁니다. 이것을 **중위 표기식(infix)** 이라고 합니다. 중위 표기식은 사람에게 익숙하지만 컴퓨터가 계산하기에는 까다롭습니다. `3 + 4 * 2`에서 `*`를 먼저 계산해야 한다는 **우선순위**와 `( )` **괄호**를 따져야 하기 때문입니다.

연산자를 두 값의 **뒤에** 쓰는 방법도 있습니다. 이것을 **후위 표기식(postfix)** 이라고 합니다.

| 중위 표기식            | 후위 표기식          | 값  |
| ---------------------- | -------------------- | --- |
| `3 + 4`                | `3 4 +`              | 7   |
| `3 + 4 * 2`            | `3 4 2 * +`          | 11  |
| `(3 + 4) * 2`          | `3 4 + 2 *`          | 14  |
| `10 - 4 - 3`           | `10 4 - 3 -`         | 3   |
| `2 * (3 + 4) - 10 / 5` | `2 3 4 + * 10 5 / -` | 12  |

후위 표기식에는 **괄호가 없고 우선순위도 필요 없습니다.** 계산 순서가 토큰의 순서에 이미 들어 있기 때문입니다. 그래서 계산기는 보통 두 단계로 일합니다.

```text
"2 * (3 + 4) - 10 / 5"  ──①토큰 나누기──►  [2] [*] [(] [3] [+] [4] [)] [-] [10] [/] [5]
                        ──②후위 변환───►   2 3 4 + * 10 5 / -      (연산자 스택 + 출력 큐)
                        ──③후위 계산───►   12                       (값 스택)
```

### 4.2 후위 표기식 계산: 값 스택

후위 표기식은 **값 스택 하나**로 계산할 수 있습니다.

```text
토큰을 왼쪽부터 하나씩 읽는다
  숫자면 → 스택에 push
  연산자면 → b = pop, a = pop, (a 연산자 b)를 push
끝나면 스택에 남은 값 하나가 답
```

`3 4 2 * +`를 추적해 봅시다.

| 읽은 토큰 | 행동                        | 값 스택(바닥 → top) |
| --------- | --------------------------- | ------------------- |
| `3`       | push                        | `[3]`               |
| `4`       | push                        | `[3, 4]`            |
| `2`       | push                        | `[3, 4, 2]`         |
| `*`       | b=2, a=4를 꺼내 4×2=8 push  | `[3, 8]`            |
| `+`       | b=8, a=3을 꺼내 3+8=11 push | `[11]`              |

> **오류 주의**: 스택에서 **먼저 꺼낸 값이 오른쪽 피연산자(b)** 입니다. `9 2 -`에서 9가 먼저 들어가고 2가 나중에 들어갔으므로, 먼저 나오는 것은 2입니다. 순서를 바꾸면 `2 - 9 = -7`이 됩니다. 덧셈과 곱셈은 순서를 바꿔도 결과가 같아서 이 버그를 놓치기 쉽습니다. 실습의 디버그 문제가 이 실수입니다.

### 4.3 중위 → 후위 변환: 연산자 스택과 출력 큐

중위 표기식을 후위 표기식으로 바꾸는 방법은 컴퓨터 과학자 다익스트라가 고안했으며, 철도 차량 기지의 선로 모양을 닮았다고 해서 **조차장(shunting-yard) 알고리즘**이라고 부릅니다. 준비물은 두 가지입니다.

- **출력 큐**: 완성된 후위 표기식이 순서대로 쌓입니다. 먼저 넣은 토큰이 먼저 나오므로 큐입니다.
- **연산자 스택**: 아직 순서를 정할 수 없는 연산자와 여는 괄호를 잠시 보관합니다.

토큰마다 규칙은 네 가지입니다.

| 읽은 토큰  | 할 일                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 숫자       | 바로 출력 큐로 보낸다                                                                           |
| 연산자 `o` | 스택 top이 연산자이고 우선순위가 `o` **이상**인 동안 top을 꺼내 출력한다. 그다음 `o`를 push한다 |
| `(`        | 스택에 push한다                                                                                 |
| `)`        | `(`가 나올 때까지 연산자를 꺼내 출력하고, `(`는 버린다. `(`를 못 찾으면 괄호 오류               |
| (식의 끝)  | 스택에 남은 연산자를 모두 꺼내 출력한다. 남은 것 중에 `(`가 있으면 괄호 오류                    |

"우선순위가 **이상**이면 먼저 내보낸다"는 규칙이 핵심입니다. 스택에 있는 연산자는 **더 먼저 나온** 연산자입니다.

- 우선순위가 더 높으면(`*`가 스택에 있고 `+`가 옴) 먼저 계산해야 하므로 내보냅니다.
- 우선순위가 **같으면**(`-`가 스택에 있고 `-`가 옴) 왼쪽부터 계산해야 하므로(`10 - 4 - 3`은 `(10 - 4) - 3`) 역시 내보냅니다.
- 더 낮으면(`+`가 스택에 있고 `*`가 옴) 새 연산자를 먼저 계산해야 하므로 그대로 쌓습니다.

여는 괄호의 우선순위를 가장 낮게(0) 두면, 연산자를 내보내는 반복이 `(`에서 자동으로 멈춥니다. 괄호 안의 연산자가 괄호 밖의 연산자와 섞이지 않는 비결입니다.

## 5. C로 구현하기

C 구현은 토큰을 구조체 배열로 나누고, 연산자 스택과 값 스택을 배열로 만듭니다. 오류가 나면 함수가 `false`를 돌려주고 오류 메시지를 포인터로 전달합니다.

```c
// 파일: calculator.c
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>

#define MAX_TOKENS 64

typedef enum { NUM, OP, LPAREN, RPAREN } Kind;

typedef struct {
    Kind kind;
    long value;                 // kind == NUM일 때
    char op;                    // kind == OP일 때
} Token;

static char bad_char_msg[40];

bool tokenize(const char *s, Token out[], int *count, const char **error) {
    int n = 0;
    for (int i = 0; s[i] != '\0'; ) {
        char c = s[i];
        if (c == ' ') {
            i++;
            continue;
        }
        if (n == MAX_TOKENS) {
            *error = "식이 너무 깁니다";
            return false;
        }
        if (isdigit((unsigned char)c)) {
            long v = 0;
            while (isdigit((unsigned char)s[i])) {
                v = v * 10 + (s[i] - '0');      // 여러 자리 숫자
                i++;
            }
            out[n++] = (Token){ NUM, v, 0 };
            continue;
        }
        if (c == '+' || c == '-' || c == '*' || c == '/') {
            out[n++] = (Token){ OP, 0, c };
        } else if (c == '(') {
            out[n++] = (Token){ LPAREN, 0, c };
        } else if (c == ')') {
            out[n++] = (Token){ RPAREN, 0, c };
        } else {
            snprintf(bad_char_msg, sizeof bad_char_msg, "알 수 없는 문자 '%c'", c);
            *error = bad_char_msg;
            return false;
        }
        i++;
    }
    *count = n;
    return true;
}

int prec(char op) {
    return (op == '*' || op == '/') ? 2 : 1;
}

bool to_postfix(const Token in[], int n, Token out[], int *m, const char **error) {
    Token stack[MAX_TOKENS];            // 연산자 스택
    int top = -1;
    int k = 0;                          // 출력 큐의 끝(배열에 차례로 쓴다)

    for (int i = 0; i < n; i++) {
        Token t = in[i];
        if (t.kind == NUM) {
            out[k++] = t;
        } else if (t.kind == OP) {
            while (top >= 0 && stack[top].kind == OP &&
                   prec(stack[top].op) >= prec(t.op)) {
                out[k++] = stack[top--];
            }
            stack[++top] = t;
        } else if (t.kind == LPAREN) {
            stack[++top] = t;
        } else {                        // RPAREN
            while (top >= 0 && stack[top].kind != LPAREN) {
                out[k++] = stack[top--];
            }
            if (top < 0) {
                *error = "괄호 짝이 맞지 않습니다";
                return false;
            }
            top--;                      // '('를 버린다
        }
    }
    while (top >= 0) {
        if (stack[top].kind == LPAREN) {
            *error = "괄호 짝이 맞지 않습니다";
            return false;
        }
        out[k++] = stack[top--];
    }
    *m = k;
    return true;
}

bool eval_postfix(const Token t[], int m, long *result, const char **error) {
    long stack[MAX_TOKENS];             // 값 스택
    int top = -1;
    for (int i = 0; i < m; i++) {
        if (t[i].kind == NUM) {
            stack[++top] = t[i].value;
            continue;
        }
        if (top < 1) {
            *error = "피연산자가 부족합니다";
            return false;
        }
        long b = stack[top--];          // 먼저 꺼낸 값이 오른쪽
        long a = stack[top--];
        long r;
        switch (t[i].op) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        default:
            if (b == 0) {
                *error = "0으로 나눌 수 없습니다";
                return false;
            }
            r = a / b;
        }
        stack[++top] = r;
    }
    if (top != 0) {
        *error = "피연산자가 부족합니다";
        return false;
    }
    *result = stack[0];
    return true;
}

void print_tokens(const Token t[], int m) {
    for (int i = 0; i < m; i++) {
        if (t[i].kind == NUM) {
            printf("%ld", t[i].value);
        } else {
            printf("%c", t[i].op);
        }
        if (i < m - 1) {
            printf(" ");
        }
    }
}

void run(const char *expr) {
    Token tokens[MAX_TOKENS], postfix[MAX_TOKENS];
    int n = 0, m = 0;
    long result;
    const char *error = NULL;

    printf("%-22s -> ", expr);
    if (!tokenize(expr, tokens, &n, &error) ||
        !to_postfix(tokens, n, postfix, &m, &error)) {
        printf("오류: %s\n", error);
        return;
    }
    printf("후위: ");
    print_tokens(postfix, m);
    if (eval_postfix(postfix, m, &result, &error)) {
        printf(" = %ld\n", result);
    } else {
        printf(" -> 오류: %s\n", error);
    }
}

int main(void) {
    const char *tests[] = {
        "3 + 4 * 2", "(3 + 4) * 2", "10 - 4 - 3", "2 * (3 + 4) - 10 / 5",
        "100 / 7", "(1 + 2", "5 / (2 - 2)", "3 +", "7 & 2",
    };
    int count = sizeof tests / sizeof tests[0];
    for (int i = 0; i < count; i++) {
        run(tests[i]);
    }
    return 0;
}
```

실행 결과:

```text
3 + 4 * 2              -> 후위: 3 4 2 * + = 11
(3 + 4) * 2            -> 후위: 3 4 + 2 * = 14
10 - 4 - 3             -> 후위: 10 4 - 3 - = 3
2 * (3 + 4) - 10 / 5   -> 후위: 2 3 4 + * 10 5 / - = 12
100 / 7                -> 후위: 100 7 / = 14
(1 + 2                 -> 오류: 괄호 짝이 맞지 않습니다
5 / (2 - 2)            -> 후위: 5 2 2 - / -> 오류: 0으로 나눌 수 없습니다
3 +                    -> 후위: 3 + -> 오류: 피연산자가 부족합니다
7 & 2                  -> 오류: 알 수 없는 문자 '&'
```

### 코드 한 부분씩 읽기

| 코드                                                 | 설명                                                                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef enum { NUM, OP, LPAREN, RPAREN } Kind;`     | 토큰의 종류입니다. 문자열을 한 글자씩 다루는 대신 **토큰**으로 나누면 `100`처럼 여러 자리 숫자를 하나로 다룰 수 있습니다.                                |
| `isdigit((unsigned char)c)`                          | `<ctype.h>`의 숫자 판별 함수입니다. char가 음수일 수 있는 환경에서 정의되지 않은 동작을 막으려고 `unsigned char`로 바꿔 넘기는 것이 올바른 사용법입니다. |
| `v = v * 10 + (s[i] - '0');`                         | 문자 `'7'`에서 `'0'`을 빼면 정수 7입니다(Day 37). 앞자리를 10배 하고 새 자리를 더해 `"100"`을 100으로 만듭니다.                                          |
| `(Token){ NUM, v, 0 }`                               | **복합 리터럴(compound literal)** 입니다. 이름 없는 구조체 값을 그 자리에서 만들어 대입합니다.                                                           |
| `static char bad_char_msg[40];`                      | 오류 메시지에 문제의 문자를 넣으려고 만든 버퍼입니다. 지역 배열의 주소를 돌려주면 함수가 끝난 뒤 사라지므로 `static`으로 두었습니다(Day 23, 45).         |
| `stack[top].kind == OP && prec(...) >= prec(t.op)`   | 4.3절의 규칙입니다. 스택 top이 `(`면 `kind == OP`가 거짓이라 반복이 멈춥니다. 여는 괄호에 우선순위 0을 주는 대신 종류로 구별했습니다.                    |
| `if (top < 0) { *error = "괄호 짝이..." }`           | 닫는 괄호가 여는 괄호를 만나지 못한 경우입니다. 식이 끝났을 때 스택에 `(`가 남아 있는 경우도 같은 오류입니다.                                            |
| `if (top < 1) { *error = "피연산자가 부족합니다"; }` | 연산자 하나에 값 두 개가 필요한데 스택에 하나 이하만 있으면 pop하기 **전에** 멈춥니다. `"3 +"`가 이 경우입니다.                                          |
| `if (b == 0)`                                        | C에서 정수를 0으로 나누면 정의되지 않은 동작이며 보통 프로그램이 죽습니다. 반드시 먼저 검사합니다.                                                       |
| `if (!tokenize(...) \|\| !to_postfix(...))`          | `                                                                                                                                                        |     | `는 단축 평가하므로 토큰 나누기에 실패하면 변환을 시도하지 않습니다. 두 단계 모두 같은 `error` 변수에 메시지를 남깁니다. |

> **참고**: 출력 큐를 따로 만들지 않고 `out` 배열에 `k++`로 차례로 쓴 것은, **뒤에서 넣기만 하고 앞에서부터 읽는** 큐의 가장 간단한 형태입니다. 큐에서 꺼내는 일은 계산 단계에서 배열을 처음부터 읽는 것으로 대신합니다.

## 6. Python으로 구현하기

Python 버전은 같은 구조를 더 짧게 씁니다. 오류는 직접 만든 예외 클래스 `CalcError`로 알립니다. 출력 큐는 `collections.deque`를 써서 "큐"라는 역할을 분명히 드러냈습니다.

```python
# 파일: calculator.py
from collections import deque

PREC = {"+": 1, "-": 1, "*": 2, "/": 2}


class CalcError(Exception):
    """계산기에서 발생하는 모든 오류"""


def tokenize(expr):
    tokens, i = [], 0
    while i < len(expr):
        c = expr[i]
        if c == " ":
            i += 1
        elif c.isdigit():
            j = i
            while j < len(expr) and expr[j].isdigit():
                j += 1
            tokens.append(int(expr[i:j]))      # 여러 자리 숫자
            i = j
        elif c in "+-*/()":
            tokens.append(c)
            i += 1
        else:
            raise CalcError(f"알 수 없는 문자 '{c}'")
    return tokens


def to_postfix(tokens):
    output = deque()                            # 출력 큐
    ops = []                                    # 연산자 스택
    for t in tokens:
        if isinstance(t, int):
            output.append(t)
        elif t in PREC:
            while ops and ops[-1] in PREC and PREC[ops[-1]] >= PREC[t]:
                output.append(ops.pop())
            ops.append(t)
        elif t == "(":
            ops.append(t)
        else:                                   # ")"
            while ops and ops[-1] != "(":
                output.append(ops.pop())
            if not ops:
                raise CalcError("괄호 짝이 맞지 않습니다")
            ops.pop()                           # "(" 버리기
    while ops:
        op = ops.pop()
        if op == "(":
            raise CalcError("괄호 짝이 맞지 않습니다")
        output.append(op)
    return output


def eval_postfix(postfix):
    stack = []                                  # 값 스택
    for t in postfix:
        if isinstance(t, int):
            stack.append(t)
            continue
        if len(stack) < 2:
            raise CalcError("피연산자가 부족합니다")
        b = stack.pop()                         # 먼저 꺼낸 값이 오른쪽
        a = stack.pop()
        if t == "+":
            stack.append(a + b)
        elif t == "-":
            stack.append(a - b)
        elif t == "*":
            stack.append(a * b)
        else:
            if b == 0:
                raise CalcError("0으로 나눌 수 없습니다")
            stack.append(int(a / b))            # C·Rust처럼 0 쪽으로 버림
    if len(stack) != 1:
        raise CalcError("피연산자가 부족합니다")
    return stack[0]


def run(expr):
    line = f"{expr:<22} -> "
    try:
        postfix = to_postfix(tokenize(expr))
    except CalcError as error:
        print(line + f"오류: {error}")
        return
    line += "후위: " + " ".join(str(t) for t in postfix)
    try:
        print(line + f" = {eval_postfix(postfix)}")
    except CalcError as error:
        print(line + f" -> 오류: {error}")


for expr in ["3 + 4 * 2", "(3 + 4) * 2", "10 - 4 - 3", "2 * (3 + 4) - 10 / 5",
             "100 / 7", "(1 + 2", "5 / (2 - 2)", "3 +", "7 & 2"]:
    run(expr)
```

실행 결과:

```text
3 + 4 * 2              -> 후위: 3 4 2 * + = 11
(3 + 4) * 2            -> 후위: 3 4 + 2 * = 14
10 - 4 - 3             -> 후위: 10 4 - 3 - = 3
2 * (3 + 4) - 10 / 5   -> 후위: 2 3 4 + * 10 5 / - = 12
100 / 7                -> 후위: 100 7 / = 14
(1 + 2                 -> 오류: 괄호 짝이 맞지 않습니다
5 / (2 - 2)            -> 후위: 5 2 2 - / -> 오류: 0으로 나눌 수 없습니다
3 +                    -> 후위: 3 + -> 오류: 피연산자가 부족합니다
7 & 2                  -> 오류: 알 수 없는 문자 '&'
```

### 코드 한 부분씩 읽기

| 코드                                | 설명                                                                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `class CalcError(Exception):`       | `Exception`을 상속한 **사용자 정의 예외**입니다. 계산기 오류만 골라서 `except CalcError`로 잡을 수 있습니다. 다른 버그(예: 오타로 생긴 NameError)는 가리지 않습니다.                                                                             |
| `tokens.append(int(expr[i:j]))`     | 숫자 토큰은 `int`, 연산자와 괄호는 `str`로 저장합니다. 한 list에 서로 다른 타입을 섞을 수 있는 Python의 특징을 이용했습니다.                                                                                                                     |
| `isinstance(t, int)`                | 토큰이 숫자인지 확인합니다. C는 `kind` 필드로, Rust는 enum 변형으로 구별합니다.                                                                                                                                                                  |
| `ops[-1] in PREC`                   | top이 연산자일 때만 비교합니다. `(`는 PREC에 없으므로 여기서 반복이 멈춥니다.                                                                                                                                                                    |
| `output = deque()`                  | 뒤에 넣고(`append`) 앞에서부터 읽는 출력 큐입니다. `for t in postfix`는 앞에서부터 차례로 읽습니다.                                                                                                                                              |
| `int(a / b)`                        | Python의 `//`는 음수에서 아래로 내리므로(`-7 // 2 == -4`) C·Rust의 정수 나눗셈(`-3`)과 결과가 다릅니다. `a / b`로 실수 나눗셈을 한 뒤 `int()`로 소수점을 버려 0 쪽으로 맞췄습니다. 아주 큰 수에서는 실수 오차가 생길 수 있다는 점은 알아 두세요. |
| `" ".join(str(t) for t in postfix)` | 토큰마다 문자열로 바꿔 공백으로 잇습니다.                                                                                                                                                                                                        |

## 7. Rust로 구현하기

Rust 버전은 토큰을 **enum** 으로, 모든 오류를 `Result<_, String>`으로 표현합니다. `?` 연산자 덕분에 오류 전파가 한 글자로 끝납니다(Day 25).

```rust
// 파일: calculator.rs
use std::collections::VecDeque;

#[derive(Debug, Clone, Copy, PartialEq)]
enum Token {
    Num(i64),
    Op(char),
    LParen,
    RParen,
}

fn tokenize(expr: &str) -> Result<Vec<Token>, String> {
    let chars: Vec<char> = expr.chars().collect();
    let mut tokens = Vec::new();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        match c {
            ' ' => i += 1,
            '0'..='9' => {
                let mut v: i64 = 0;
                while i < chars.len() && chars[i].is_ascii_digit() {
                    v = v * 10 + chars[i].to_digit(10).unwrap() as i64;
                    i += 1;
                }
                tokens.push(Token::Num(v));
            }
            '+' | '-' | '*' | '/' => {
                tokens.push(Token::Op(c));
                i += 1;
            }
            '(' => {
                tokens.push(Token::LParen);
                i += 1;
            }
            ')' => {
                tokens.push(Token::RParen);
                i += 1;
            }
            _ => return Err(format!("알 수 없는 문자 '{c}'")),
        }
    }
    Ok(tokens)
}

fn prec(op: char) -> u8 {
    match op {
        '*' | '/' => 2,
        _ => 1,
    }
}

fn to_postfix(tokens: &[Token]) -> Result<VecDeque<Token>, String> {
    let mut output: VecDeque<Token> = VecDeque::new();   // 출력 큐
    let mut ops: Vec<Token> = Vec::new();                 // 연산자 스택
    for &t in tokens {
        match t {
            Token::Num(_) => output.push_back(t),
            Token::Op(o) => {
                while let Some(&Token::Op(top)) = ops.last() {
                    if prec(top) < prec(o) {
                        break;
                    }
                    output.push_back(ops.pop().unwrap());
                }
                ops.push(t);
            }
            Token::LParen => ops.push(t),
            Token::RParen => loop {
                match ops.pop() {
                    Some(Token::LParen) => break,
                    Some(op) => output.push_back(op),
                    None => return Err("괄호 짝이 맞지 않습니다".to_string()),
                }
            },
        }
    }
    while let Some(op) = ops.pop() {
        if op == Token::LParen {
            return Err("괄호 짝이 맞지 않습니다".to_string());
        }
        output.push_back(op);
    }
    Ok(output)
}

fn eval_postfix(postfix: &VecDeque<Token>) -> Result<i64, String> {
    let mut stack: Vec<i64> = Vec::new();                 // 값 스택
    for &t in postfix {
        match t {
            Token::Num(v) => stack.push(v),
            Token::Op(o) => {
                let (Some(b), Some(a)) = (stack.pop(), stack.pop()) else {
                    return Err("피연산자가 부족합니다".to_string());
                };
                let r = match o {
                    '+' => a + b,
                    '-' => a - b,
                    '*' => a * b,
                    _ => a.checked_div(b).ok_or("0으로 나눌 수 없습니다")?,
                };
                stack.push(r);
            }
            _ => unreachable!("후위 표기식에는 괄호가 없다"),
        }
    }
    match stack.as_slice() {
        [value] => Ok(*value),
        _ => Err("피연산자가 부족합니다".to_string()),
    }
}

fn show(postfix: &VecDeque<Token>) -> String {
    let parts: Vec<String> = postfix
        .iter()
        .map(|t| match t {
            Token::Num(v) => v.to_string(),
            Token::Op(o) => o.to_string(),
            _ => String::new(),
        })
        .collect();
    parts.join(" ")
}

fn run(expr: &str) {
    let line = format!("{:<22} -> ", expr);
    let postfix = match tokenize(expr).and_then(|tokens| to_postfix(&tokens)) {
        Ok(p) => p,
        Err(e) => {
            println!("{line}오류: {e}");
            return;
        }
    };
    match eval_postfix(&postfix) {
        Ok(v) => println!("{line}후위: {} = {v}", show(&postfix)),
        Err(e) => println!("{line}후위: {} -> 오류: {e}", show(&postfix)),
    }
}

fn main() {
    let tests = [
        "3 + 4 * 2", "(3 + 4) * 2", "10 - 4 - 3", "2 * (3 + 4) - 10 / 5",
        "100 / 7", "(1 + 2", "5 / (2 - 2)", "3 +", "7 & 2",
    ];
    for expr in tests {
        run(expr);
    }
}
```

실행 결과:

```text
3 + 4 * 2              -> 후위: 3 4 2 * + = 11
(3 + 4) * 2            -> 후위: 3 4 + 2 * = 14
10 - 4 - 3             -> 후위: 10 4 - 3 - = 3
2 * (3 + 4) - 10 / 5   -> 후위: 2 3 4 + * 10 5 / - = 12
100 / 7                -> 후위: 100 7 / = 14
(1 + 2                 -> 오류: 괄호 짝이 맞지 않습니다
5 / (2 - 2)            -> 후위: 5 2 2 - / -> 오류: 0으로 나눌 수 없습니다
3 +                    -> 후위: 3 + -> 오류: 피연산자가 부족합니다
7 & 2                  -> 오류: 알 수 없는 문자 '&'
```

### 코드 한 부분씩 읽기

| 코드                                                         | 설명                                                                                                                                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum Token { Num(i64), Op(char), LParen, RParen }`          | 숫자 토큰만 값을 가지고, 괄호는 값이 없습니다. C의 `kind` + 여러 필드보다 "종류마다 필요한 데이터만" 가지므로 잘못 조합된 토큰을 만들 수 없습니다.                                 |
| `#[derive(Debug, Clone, Copy, PartialEq)]`                   | `Copy`는 토큰을 복사해서 넘길 수 있게 하고, `PartialEq`는 `op == Token::LParen` 비교를 가능하게 합니다.                                                                            |
| `'0'..='9' => { ... }`                                       | match에서 **문자 범위 패턴**을 쓸 수 있습니다. `..=`는 끝을 포함합니다.                                                                                                            |
| `while let Some(&Token::Op(top)) = ops.last()`               | 스택 top이 **연산자일 때만** 반복합니다. top이 `LParen`이거나 스택이 비면 패턴이 맞지 않아 반복이 끝납니다. 패턴 하나로 두 조건을 검사했습니다.                                    |
| `Token::RParen => loop { match ops.pop() { ... } }`          | `(`를 만날 때까지 꺼냅니다. 스택이 비면(`None`) 괄호 오류로 함수를 끝냅니다. C 코드의 while과 if를 match 하나로 합쳤습니다.                                                        |
| `let (Some(b), Some(a)) = (...) else { return Err(...); };`  | **let-else** 문법입니다. 두 pop이 모두 `Some`이면 b와 a에 값을 풀고, 하나라도 `None`이면 else 블록에서 함수를 끝냅니다. 튜플 안의 식은 왼쪽부터 계산되므로 b가 먼저 꺼내집니다.    |
| `a.checked_div(b).ok_or("0으로 나눌 수 없습니다")?`          | `checked_div`는 0으로 나누면 `None`을 줍니다. `ok_or`로 `Result`로 바꾸고, `?`가 오류일 때 함수를 끝내며 오류를 돌려줍니다. `&str` 오류는 `?`가 자동으로 `String`으로 바꿔 줍니다. |
| `match stack.as_slice() { [value] => Ok(*value), _ => ... }` | **슬라이스 패턴**입니다. 원소가 정확히 하나일 때만 첫 갈래와 맞습니다. 0개나 2개 이상이면 오류입니다.                                                                              |
| `tokenize(expr).and_then(\|tokens\| to_postfix(&tokens))`    | 앞 단계가 `Ok`일 때만 다음 단계를 실행하고, `Err`이면 그대로 전달합니다. C의 `                                                                                                     |     | ` 단축 평가와 같은 역할입니다. |
| `unreachable!(...)`                                          | "여기에는 절대 오지 않는다"는 표시입니다. 만약 온다면 버그이므로 메시지와 함께 panic합니다.                                                                                        |

## 8. 실행 추적

중위 → 후위 변환에서 가장 복잡한 `2 * (3 + 4) - 10 / 5`를 따라갑니다. 스택은 오른쪽이 top입니다.

| 읽은 토큰 | 규칙                                        | 연산자 스택 | 출력 큐              |
| --------- | ------------------------------------------- | ----------- | -------------------- |
| `2`       | 숫자 → 출력                                 |             | `2`                  |
| `*`       | 스택이 비어 push                            | `*`         | `2`                  |
| `(`       | push                                        | `* (`       | `2`                  |
| `3`       | 숫자 → 출력                                 | `* (`       | `2 3`                |
| `+`       | top이 `(`라 멈추고 push                     | `* ( +`     | `2 3`                |
| `4`       | 숫자 → 출력                                 | `* ( +`     | `2 3 4`              |
| `)`       | `(`까지 꺼내 출력, `(` 버림                 | `*`         | `2 3 4 +`            |
| `-`       | `*`(2) ≥ `-`(1)이므로 `*` 출력, 그다음 push | `-`         | `2 3 4 + *`          |
| `10`      | 숫자 → 출력                                 | `-`         | `2 3 4 + * 10`       |
| `/`       | `-`(1) < `/`(2)라 그대로 push               | `- /`       | `2 3 4 + * 10`       |
| `5`       | 숫자 → 출력                                 | `- /`       | `2 3 4 + * 10 5`     |
| (끝)      | 남은 연산자를 top부터 출력                  |             | `2 3 4 + * 10 5 / -` |

이어서 후위 표기식 `2 3 4 + * 10 5 / -`를 값 스택으로 계산하면 `[2, 3, 4] → + → [2, 7] → * → [14] → [14, 10, 5] → / → [14, 2] → - → [12]`로 12가 됩니다.

## 9. 다른 예제로 다시 이해하기

후위 계산기가 **연산자를 만날 때마다 바로 계산**하게 바꾸면, 후위 표기식을 따로 만들지 않고도 중위 표기식을 계산할 수 있습니다. 연산자 스택에서 연산자를 "출력하는" 순간 대신 값 스택의 두 값에 "적용하는" 것입니다. 출력 큐가 사라지고 스택 두 개(연산자 스택과 값 스택)만 남습니다. 실습의 수정 문제가 이 방식이며, 많은 계산기 프로그램이 실제로 이렇게 동작합니다. 아래 Python 프로그램은 각 단계에서 두 스택이 어떻게 변하는지 보여 줍니다.

```python
# 파일: two_stacks.py
PREC = {"+": 1, "-": 1, "*": 2, "/": 2}


def calc(tokens):
    ops, vals = [], []

    def apply_top():
        op = ops.pop()
        b, a = vals.pop(), vals.pop()
        result = {"+": a + b, "-": a - b, "*": a * b, "/": int(a / b)}[op]
        vals.append(result)
        print(f"   {a} {op} {b} = {result:<3} 값 {vals}  연산자 {ops}")

    for t in tokens:
        if t.isdigit():
            vals.append(int(t))
        elif t == "(":
            ops.append(t)
        elif t == ")":
            while ops[-1] != "(":
                apply_top()
            ops.pop()
        else:
            while ops and ops[-1] != "(" and PREC[ops[-1]] >= PREC[t]:
                apply_top()
            ops.append(t)
    while ops:
        apply_top()
    return vals[0]


print("답:", calc("2 * ( 3 + 4 ) - 10 / 5".split()))
```

실행 결과:

```text
   3 + 4 = 7   값 [2, 7]  연산자 ['*', '(']
   2 * 7 = 14  값 [14]  연산자 []
   10 / 5 = 2   값 [14, 2]  연산자 ['-']
   14 - 2 = 12  값 [12]  연산자 []
답: 12
```

계산이 일어나는 순서가 8절에서 후위 표기식에 연산자가 **출력된 순서**(`+`, `*`, `/`, `-`)와 정확히 같다는 점을 확인하세요. 두 방법은 같은 알고리즘의 두 얼굴입니다.

## 10. 시간·공간 복잡도

토큰 수를 n이라고 하면,

| 단계        | 시간 | 이유                                                 |
| ----------- | ---- | ---------------------------------------------------- |
| 토큰 나누기 | O(n) | 글자를 한 번씩 읽음                                  |
| 후위 변환   | O(n) | 각 연산자는 스택에 **한 번** 들어가고 **한 번** 나옴 |
| 후위 계산   | O(n) | 각 토큰을 한 번씩 처리, push·pop은 O(1)              |
| 전체 공간   | O(n) | 토큰 배열, 스택, 출력 큐 모두 토큰 수 이하           |

후위 변환의 while 반복이 안쪽에 있어서 O(n²)처럼 보이지만, 연산자 하나가 스택에서 나오는 일은 평생 한 번뿐이므로 전체가 O(n)입니다. Day 59의 두 스택 큐와 같은 **상각 분석**입니다.

## 11. 세 언어 비교

| 관점           | C                                            | Python                          | Rust                                    |
| -------------- | -------------------------------------------- | ------------------------------- | --------------------------------------- |
| 토큰 표현      | `struct { Kind kind; long value; char op; }` | `int` 또는 `str`                | `enum Token { Num(i64), Op(char), .. }` |
| 여러 자리 숫자 | `v * 10 + (c - '0')`                         | `int(expr[i:j])`                | `to_digit(10)`으로 누적                 |
| 오류 전달      | `bool` 반환 + `const char **`                | 사용자 정의 예외 `CalcError`    | `Result<T, String>`과 `?`               |
| 0으로 나누기   | 직접 검사하지 않으면 프로그램이 죽음         | `ZeroDivisionError`(검사함)     | `checked_div`가 `None`                  |
| 스택           | 고정 배열 + top                              | `list`                          | `Vec`                                   |
| 출력 큐        | 배열에 차례로 쓰기                           | `deque`                         | `VecDeque`                              |
| 정수 나눗셈    | 0 쪽으로 버림                                | `//`는 아래로 내림 → `int(a/b)` | 0 쪽으로 버림                           |

## 12. 자주 하는 실수

### 실수 1: 피연산자 순서를 거꾸로 꺼낸다

```c
int a = stack[top--];   // 먼저 꺼낸 값을 왼쪽으로 쓰면
int b = stack[top--];
r = a - b;              // "9 2 -" → 2 - 9 = -7
```

먼저 꺼낸 값은 **나중에 넣은 오른쪽 피연산자**입니다. `b`를 먼저 꺼내세요. 테스트할 때 반드시 **빼기와 나누기**를 포함하세요. 덧셈과 곱셈만으로는 이 버그가 드러나지 않습니다.

### 실수 2: 같은 우선순위에서 연산자를 내보내지 않는다

`>=` 대신 `>`로 비교하면 `10 - 4 - 3`이 `10 4 3 - -`, 즉 `10 - (4 - 3) = 9`가 됩니다. 뺄셈과 나눗셈은 **왼쪽부터** 계산해야 하므로(좌결합), 같은 우선순위의 연산자를 만나면 먼저 있던 것을 내보냅니다. (거듭제곱 `^`처럼 오른쪽부터 계산하는 연산자는 예외입니다. 도전 문제 2)

### 실수 3: 스택이 비었는지 확인하지 않고 pop한다

```python
# 파일: missing_operand.py (실행 오류: IndexError)
stack = []
for t in "3 +".split():
    if t.isdigit():
        stack.append(int(t))
    else:
        b = stack.pop()
        a = stack.pop()     # 스택에 값이 하나뿐이었다
        stack.append(a + b)
print(stack)
```

```text
IndexError: pop from empty list
```

Python은 예외로 멈추지만, C는 `stack[-1]`을 읽어 쓰레기 값으로 계속 계산합니다. 연산자를 처리하기 **전에** 값이 두 개 이상인지 확인하세요.

### 실수 4: 0으로 나누기를 검사하지 않는다

C에서 정수를 0으로 나누면 정의되지 않은 동작이고, 대부분의 컴퓨터에서 프로그램이 즉시 종료됩니다. Rust에서는 `a / b`가 panic하고, Python에서는 `ZeroDivisionError`가 발생합니다. 사용자가 입력한 식을 계산하는 프로그램이라면 **프로그램이 죽으면 안 되므로** 미리 검사하고 오류 메시지를 돌려주세요.

### 실수 5: Python의 `//`를 C의 `/`와 같다고 생각한다

```python
# 파일: floor_vs_trunc.py
print(-7 // 2, int(-7 / 2), 7 // 2)
```

실행 결과:

```text
-4 -3 3
```

양수끼리는 같지만 음수가 섞이면 결과가 다릅니다. 여러 언어로 같은 프로그램을 만들 때는 **음수 테스트**를 꼭 넣으세요.

## 13. Q&A

**Q. 음수(예: `-3 + 5`)는 어떻게 처리하나요?**

A. 지금 계산기는 `-`를 항상 이항 연산자(값 두 개 사이)로 봅니다. 식의 맨 앞이나 `(` 바로 뒤, 다른 연산자 바로 뒤에 오는 `-`는 **단항 연산자**입니다. 토큰을 나눌 때 이 위치를 확인해 `0 -`로 바꾸거나 별도의 단항 연산자 토큰(예: `~`)을 만들어 가장 높은 우선순위를 주면 됩니다.

**Q. 컴파일러도 이렇게 식을 처리하나요?**

A. 기본 원리는 같습니다. 컴파일러는 보통 식을 **트리**(구문 트리)로 만드는데, 후위 표기식은 그 트리를 특정 순서로 읽은 결과와 같습니다(Day 64의 후위 순회). 자바 가상 머신과 파이썬 인터프리터의 바이트코드도 값 스택으로 계산하는 **스택 머신** 구조입니다. 파이썬에서 `import dis; dis.dis("a + b * c")`를 실행하면 `LOAD`와 `BINARY_OP`가 후위 순서로 나오는 것을 볼 수 있습니다.

**Q. 왜 C 버전은 토큰 배열을 쓰고 연결 리스트를 쓰지 않았나요?**

A. 식의 길이에 상한(64 토큰)을 두어도 되는 상황이고, 배열이 더 단순하고 빠르기 때문입니다. 3절의 조언대로 "특별한 이유가 없으면 배열"입니다. 길이 제한이 없어야 한다면 `malloc`과 `realloc`으로 늘어나는 배열을 쓰면 됩니다.

**Q. Rust 버전의 `?`는 무엇을 하나요?**

A. `Result`가 `Ok(값)`이면 값을 꺼내고, `Err(e)`이면 그 자리에서 함수를 끝내며 `Err(e)`를 돌려줍니다. C 버전의 `if (!f(...)) return false;`와 같은 일을 한 글자로 합니다. Day 25에서 자세히 배웠습니다.

## 14. 핵심 요약

- 스택은 **최근 것부터**, 큐는 **먼저 온 것부터**, 원형 버퍼는 **고정 공간의 최근 N개**, 연결 리스트는 **알고 있는 위치의 삽입·삭제**에 강합니다. 확신이 없으면 동적 배열부터 쓰세요.
- 후위 표기식은 괄호와 우선순위가 필요 없고, **값 스택 하나**로 계산합니다. 먼저 꺼낸 값이 오른쪽 피연산자입니다.
- 중위 → 후위 변환(조차장 알고리즘)은 **연산자 스택**과 **출력 큐**를 씁니다. 스택 top의 우선순위가 **이상**이면 먼저 내보냅니다.
- 여는 괄호는 연산자를 내보내는 반복을 멈추는 **벽** 역할을 합니다. 닫는 괄호에서 그 벽까지 모두 내보냅니다.
- 잘못된 식(괄호 불일치, 피연산자 부족, 0으로 나누기, 알 수 없는 문자)을 프로그램이 죽지 않고 **오류 메시지로** 처리해야 합니다. C는 `bool`과 포인터, Python은 예외, Rust는 `Result`를 씁니다.

## 15. 도전 문제

1. **(세 언어)** 단항 마이너스를 지원해 `-3 + 5`와 `2 * (-4)`를 계산해 보세요. Q&A의 방법 중 하나를 고르세요.
2. **(Python)** 거듭제곱 연산자 `^`를 우선순위 3, **오른쪽 결합**으로 추가하세요. `2 ^ 3 ^ 2`는 `2 ^ (3 ^ 2) = 512`여야 합니다. 힌트: 오른쪽 결합 연산자는 우선순위가 **초과**일 때만 먼저 내보냅니다.
3. **(C)** `eval_postfix`가 각 단계의 값 스택을 출력하도록 바꿔, 8절의 추적 결과가 나오는지 확인해 보세요.
4. **(Rust)** 후위 표기식 대신 **전위 표기식**(`- * 2 + 3 4 / 10 5`)을 계산하는 함수를 만들어 보세요. 토큰을 **오른쪽부터** 읽으면 후위 계산과 거의 같은 코드가 됩니다.
