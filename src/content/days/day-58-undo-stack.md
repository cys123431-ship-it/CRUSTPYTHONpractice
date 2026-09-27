---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-58-undo-stack
courseId: crp-92
phaseId: phase-06
dayNumber: 58
date: "2026-11-27"
title: 스택 응용 — 실행 취소와 다시 실행
summary: 작업 기록을 스택 두 개(undo, redo)에 저장해 편집기의 실행 취소와 다시 실행을 C, Python, Rust로 끝까지 구현합니다. 되돌리려면 무엇을 기록해야 하는지, 새 작업이 redo를 왜 지워야 하는지 이해합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-57-stack]
learningObjectives:
  - 실행 취소가 LIFO 순서를 따르는 이유를 설명한다.
  - 되돌릴 수 있으려면 작업마다 어떤 정보를 기록해야 하는지 정한다.
  - undo 스택과 redo 스택 사이에서 작업 기록이 이동하는 과정을 추적한다.
  - 새 작업을 하면 redo 스택을 비워야 하는 이유를 설명한다.
  - C 구조체, Python 튜플, Rust enum으로 작업 기록을 표현해 편집기를 구현한다.
concepts: [undo, redo, two stacks, command record, inverse operation, enum]
runnerMode: python
playgroundSource: |
  # 파일: undo.py — 작업 순서를 바꿔 가며 실행해 보세요.
  class Editor:
      def __init__(self):
          self.text = ""
          self.undo_stack = []
          self.redo_stack = []

      def write(self, piece):
          self.text += piece
          self.undo_stack.append(("insert", piece))
          self.redo_stack.clear()

      def undo(self):
          if not self.undo_stack:
              return False
          kind, piece = self.undo_stack.pop()
          self.text = self.text[: len(self.text) - len(piece)]
          self.redo_stack.append((kind, piece))
          return True

      def redo(self):
          if not self.redo_stack:
              return False
          kind, piece = self.redo_stack.pop()
          self.text += piece
          self.undo_stack.append((kind, piece))
          return True


  e = Editor()
  e.write("Hello")
  e.write(", world")
  e.undo()
  print(repr(e.text), e.undo_stack, e.redo_stack)
  e.redo()
  print(repr(e.text))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day58-predict-py
    title: 두 스택 사이의 이동 추적하기
    kind: predict
    objective: undo와 redo가 기록을 어느 스택으로 옮기는지 추적한다.
    prompt: 마지막 줄에 출력될 두 숫자(undo 스택 길이, redo 스택 길이)를 공백으로 구분해 적으세요.
    starter: |-
      undo, redo = [], []
      for action in ["a", "b", "c"]:
          undo.append(action)
          redo.clear()
      redo.append(undo.pop())
      redo.append(undo.pop())
      undo.append(redo.pop())
      print(len(undo), len(redo))
    answer: "2 1"
    hint: "undo는 [a, b, c]에서 시작합니다. c와 b가 redo로 옮겨 간 뒤, redo의 top인 b가 다시 undo로 돌아옵니다."
    explanation: "두 번 undo하면 undo=[a], redo=[c, b]입니다. 한 번 redo하면 b가 돌아와 undo=[a, b], redo=[c]가 되므로 2 1입니다."
    commonMistakes:
      - "redo에서도 가장 먼저 들어간 c가 먼저 돌아온다고 생각함"
      - "undo가 기록을 버린다고 생각해 redo 길이를 0으로 적음"
    language: python
    verification: run
  - id: ex-day58-predict-c
    title: C 편집기 길이 예측하기
    kind: predict
    objective: 문자열 끝을 잘라 내는 방식의 실행 취소를 추적한다.
    prompt: 출력될 문자열과 길이를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char text[32] = "";
          const char *pieces[] = {"ab", "cde", "f"};
          for (int i = 0; i < 3; i++) {
              strcat(text, pieces[i]);
          }
          text[strlen(text) - strlen(pieces[2])] = '\0';
          text[strlen(text) - strlen(pieces[1])] = '\0';
          printf("%s %zu\n", text, strlen(text));
          return 0;
      }
    answer: "ab 2"
    hint: '"abcdef"에서 마지막 조각 f(1글자)를 먼저 자르고, 그다음 cde(3글자)를 자릅니다.'
    explanation: "세 조각을 이으면 abcdef입니다. 길이 6에서 1을 빼 인덱스 5에 '\\0'을 두면 abcde, 다시 5에서 3을 빼 인덱스 2에 두면 ab가 남습니다."
    commonMistakes:
      - "먼저 넣은 ab부터 지운다고 생각함"
      - "'\\0'을 넣는 위치를 길이가 아니라 길이-1로 계산함"
    language: c
    verification: run
  - id: ex-day58-fill
    title: Rust redo 빈칸 채우기
    kind: fill
    objective: redo 스택에서 기록을 꺼내 다시 적용하고 undo 스택으로 돌려놓는다.
    prompt: "redo 메서드의 빈칸 두 곳(_____)을 채우세요. 첫 칸은 redo 스택에서 꺼내는 코드, 둘째 칸은 기록을 undo 스택에 넣는 코드입니다."
    starter: |-
      struct Editor {
          text: String,
          undo_stack: Vec<String>,
          redo_stack: Vec<String>,
      }

      impl Editor {
          fn write(&mut self, piece: &str) {
              self.text.push_str(piece);
              self.undo_stack.push(piece.to_string());
              self.redo_stack.clear();
          }

          fn undo(&mut self) {
              if let Some(piece) = self.undo_stack.pop() {
                  self.text.truncate(self.text.len() - piece.len());
                  self.redo_stack.push(piece);
              }
          }

          fn redo(&mut self) {
              if let Some(piece) = _____ {
                  self.text.push_str(&piece);
                  _____;
              }
          }
      }

      fn main() {
          let mut e = Editor { text: String::new(), undo_stack: Vec::new(), redo_stack: Vec::new() };
          e.write("ab");
          e.write("cd");
          e.undo();
          e.redo();
          println!("{}", e.text);
      }
    answer: |-
      struct Editor {
          text: String,
          undo_stack: Vec<String>,
          redo_stack: Vec<String>,
      }

      impl Editor {
          fn write(&mut self, piece: &str) {
              self.text.push_str(piece);
              self.undo_stack.push(piece.to_string());
              self.redo_stack.clear();
          }

          fn undo(&mut self) {
              if let Some(piece) = self.undo_stack.pop() {
                  self.text.truncate(self.text.len() - piece.len());
                  self.redo_stack.push(piece);
              }
          }

          fn redo(&mut self) {
              if let Some(piece) = self.redo_stack.pop() {
                  self.text.push_str(&piece);
                  self.undo_stack.push(piece);
              }
          }
      }

      fn main() {
          let mut e = Editor { text: String::new(), undo_stack: Vec::new(), redo_stack: Vec::new() };
          e.write("ab");
          e.write("cd");
          e.undo();
          e.redo();
          println!("{}", e.text);
      }
    hint: undo 메서드를 거울에 비춘 모양입니다. undo_stack과 redo_stack의 자리를 바꾸고, truncate 대신 push_str을 씁니다.
    explanation: "redo는 redo 스택에서 꺼내 다시 적용하고, 다시 undo할 수 있도록 undo 스택에 넣습니다. push_str(&piece)는 piece를 빌리기만 하므로 그 뒤에 piece를 undo_stack으로 옮길 수 있습니다. 출력은 abcd입니다."
    commonMistakes:
      - "redo한 기록을 undo 스택에 넣지 않아 다시 실행한 작업을 취소할 수 없게 됨"
      - "push_str(piece)처럼 &를 빼서 타입 오류를 냄"
    language: rust
    verification: run
  - id: ex-day58-modify
    title: Python 기록 개수 제한하기
    kind: modify
    objective: 실행 취소 기록이 무한히 늘지 않도록 가장 오래된 기록을 버린다.
    prompt: "write가 기록을 추가한 뒤 undo 스택 길이가 LIMIT(3)를 넘으면 가장 오래된 기록(바닥)을 버리도록 고치세요. 마지막 줄은 3번만 undo된 결과를 출력해야 합니다."
    starter: |-
      LIMIT = 3


      class Editor:
          def __init__(self):
              self.text = ""
              self.undo_stack = []

          def write(self, piece):
              self.text += piece
              self.undo_stack.append(piece)

          def undo(self):
              if not self.undo_stack:
                  return False
              piece = self.undo_stack.pop()
              self.text = self.text[: len(self.text) - len(piece)]
              return True


      e = Editor()
      for piece in ["1", "2", "3", "4", "5"]:
          e.write(piece)
      while e.undo():
          pass
      print(repr(e.text), len(e.undo_stack))
    answer: |-
      LIMIT = 3


      class Editor:
          def __init__(self):
              self.text = ""
              self.undo_stack = []

          def write(self, piece):
              self.text += piece
              self.undo_stack.append(piece)
              if len(self.undo_stack) > LIMIT:
                  self.undo_stack.pop(0)

          def undo(self):
              if not self.undo_stack:
                  return False
              piece = self.undo_stack.pop()
              self.text = self.text[: len(self.text) - len(piece)]
              return True


      e = Editor()
      for piece in ["1", "2", "3", "4", "5"]:
          e.write(piece)
      while e.undo():
          pass
      print(repr(e.text), len(e.undo_stack))
    hint: "스택의 바닥은 list의 맨 앞(인덱스 0)입니다. 바닥의 기록을 버리려면 pop(0)을 씁니다."
    explanation: "기록은 최근 3개(3, 4, 5)만 남습니다. 끝까지 undo해도 5, 4, 3만 지워지므로 '12'가 남고 스택 길이는 0입니다. 실제 편집기도 메모리를 아끼려고 이렇게 기록 개수를 제한합니다."
    commonMistakes:
      - "pop()을 써서 가장 최근 기록을 버림"
      - "길이 검사를 기록 추가 전에 해서 LIMIT보다 하나 적게 저장함"
    language: python
    verification: run
  - id: ex-day58-debug
    title: C 편집기의 redo 버그 고치기
    kind: debug
    objective: 새 작업을 한 뒤에도 옛 redo 기록이 남아 생기는 버그를 찾는다.
    prompt: '"ab"를 쓰고 undo한 뒤 "X"를 새로 썼습니다. 이제 redo는 할 일이 없어야 하는데 이 프로그램은 "Xab"를 만듭니다. 원인을 찾아 고치세요.'
    starter: |-
      #include <stdio.h>
      #include <string.h>

      #define MAX 8

      char text[64] = "";
      char undo_stack[MAX][16];
      char redo_stack[MAX][16];
      int undo_top = -1;
      int redo_top = -1;

      void write_text(const char *piece) {
          strcat(text, piece);
          strcpy(undo_stack[++undo_top], piece);
      }

      void undo(void) {
          if (undo_top == -1) return;
          const char *piece = undo_stack[undo_top--];
          text[strlen(text) - strlen(piece)] = '\0';
          strcpy(redo_stack[++redo_top], piece);
      }

      void redo(void) {
          if (redo_top == -1) return;
          const char *piece = redo_stack[redo_top--];
          strcat(text, piece);
          strcpy(undo_stack[++undo_top], piece);
      }

      int main(void) {
          write_text("ab");
          undo();
          write_text("X");
          redo();
          printf("%s\n", text);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <string.h>

      #define MAX 8

      char text[64] = "";
      char undo_stack[MAX][16];
      char redo_stack[MAX][16];
      int undo_top = -1;
      int redo_top = -1;

      void write_text(const char *piece) {
          strcat(text, piece);
          strcpy(undo_stack[++undo_top], piece);
          redo_top = -1;
      }

      void undo(void) {
          if (undo_top == -1) return;
          const char *piece = undo_stack[undo_top--];
          text[strlen(text) - strlen(piece)] = '\0';
          strcpy(redo_stack[++redo_top], piece);
      }

      void redo(void) {
          if (redo_top == -1) return;
          const char *piece = redo_stack[redo_top--];
          strcat(text, piece);
          strcpy(undo_stack[++undo_top], piece);
      }

      int main(void) {
          write_text("ab");
          undo();
          write_text("X");
          redo();
          printf("%s\n", text);
          return 0;
      }
    hint: 새 작업이 생기면 "되돌렸던 미래"는 더 이상 이어질 수 없습니다. write_text에서 redo 스택을 어떻게 해야 할까요?
    explanation: "새 작업을 기록할 때 redo_top = -1;로 redo 스택을 비워야 합니다. 고치면 redo는 아무 일도 하지 않고 출력은 X입니다. 스택을 비우는 데 배열 칸을 지울 필요는 없고 top만 -1로 되돌리면 됩니다."
    commonMistakes:
      - "undo 함수에서 redo 스택을 비워 redo가 아예 동작하지 않게 만듦"
      - "redo 배열의 모든 칸을 memset으로 지워야 한다고 생각함"
    language: c
    verification: run
  - id: ex-day58-independent
    title: Rust 계산기에 실행 취소 넣기
    kind: independent
    objective: 값을 바꾸는 작업마다 이전 값을 기록해 되돌리는 구조를 처음부터 만든다.
    prompt: "i64 값 하나를 가진 Calculator를 만드세요. add(n)과 mul(n)은 값을 바꾸기 전에 이전 값을 스택에 push하고, undo()는 이전 값을 복원합니다. 0에서 add(5), mul(3), add(1), undo(), undo()를 하면 5가 출력되어야 합니다."
    starter: |-
      struct Calculator {
          value: i64,
          history: Vec<i64>,
      }

      // impl Calculator { add, mul, undo } 를 작성하세요.

      fn main() {
          let calc = Calculator { value: 0, history: Vec::new() };
          println!("{} {}", calc.value, calc.history.len());
      }
    answer: |-
      struct Calculator {
          value: i64,
          history: Vec<i64>,
      }

      impl Calculator {
          fn add(&mut self, n: i64) {
              self.history.push(self.value);
              self.value += n;
          }

          fn mul(&mut self, n: i64) {
              self.history.push(self.value);
              self.value *= n;
          }

          fn undo(&mut self) -> bool {
              match self.history.pop() {
                  Some(previous) => {
                      self.value = previous;
                      true
                  }
                  None => false,
              }
          }
      }

      fn main() {
          let mut calc = Calculator { value: 0, history: Vec::new() };
          calc.add(5);
          calc.mul(3);
          calc.add(1);
          calc.undo();
          calc.undo();
          println!("{}", calc.value);
      }
    hint: 바뀌기 전의 값을 저장해 두면 "무엇을 했는지" 몰라도 되돌릴 수 있습니다. 이런 방식을 스냅숏(snapshot) 기록이라고 합니다.
    explanation: "0 → 5 → 15 → 16으로 바뀌고, 기록 스택에는 [0, 5, 15]가 쌓입니다. 두 번 undo하면 15, 5 순서로 복원되어 5가 출력됩니다."
    commonMistakes:
      - "값을 바꾼 뒤에 기록해서 현재 값을 저장함"
      - "undo에서 history.pop().unwrap()을 써서 기록이 없을 때 panic을 일으킴"
    language: rust
    verification: run
quiz:
  - id: quiz-day58-01
    question: 편집기에서 A, B, C 순서로 작업한 뒤 실행 취소를 한 번 누르면 무엇이 취소되나요?
    choices: ["A", "B", "C", "A, B, C 모두"]
    answerIndex: 2
    explanation: 실행 취소는 가장 최근 작업부터 되돌립니다. 가장 나중에 push된 C가 undo 스택의 top입니다.
  - id: quiz-day58-02
    question: '"Hello"를 쓰고 실행 취소한 다음 "Bye"를 새로 썼습니다. 이때 redo 스택을 비워야 하는 이유로 가장 알맞은 것은?'
    choices:
      - 메모리를 아끼기 위해서
      - 되돌렸던 작업이 새 작업 뒤에 이어질 수 없어 다시 실행하면 이상한 결과가 나오기 때문에
      - undo 스택이 가득 찼기 때문에
      - Python list는 두 개를 동시에 쓸 수 없기 때문에
    answerIndex: 1
    explanation: 역사가 새로 갈라졌기 때문입니다. redo를 남겨 두면 "Bye" 뒤에 "Hello"가 붙는 식으로 사용자가 한 적 없는 상태가 만들어집니다.
  - id: quiz-day58-03
    question: 글자 지우기 작업을 실행 취소하려면 작업 기록에 무엇이 반드시 있어야 하나요?
    choices:
      - 지운 글자 수만
      - 지운 글자 내용
      - 지운 시각
      - 아무것도 필요 없다
    answerIndex: 1
    explanation: 지운 글자를 되살려야 하므로 내용이 필요합니다. 글자 수만 있으면 몇 글자를 지웠는지는 알아도 무엇을 지웠는지 알 수 없습니다.
  - id: quiz-day58-04
    question: 실행 취소가 성공하면 그 작업 기록은 어디로 가나요?
    choices:
      - 버려진다
      - undo 스택의 바닥으로 간다
      - redo 스택으로 push된다
      - 파일에 저장된다
    answerIndex: 2
    explanation: 취소한 작업을 다시 실행할 수 있도록 redo 스택에 넣습니다. 기록은 두 스택 사이를 오가며, 스택 두 개의 길이 합은 새 작업을 하기 전까지 변하지 않습니다.
  - id: quiz-day58-05
    question: "Python에서 n = 0일 때 text[-n:]의 값은?"
    choices:
      - 빈 문자열
      - text 전체
      - 마지막 글자 하나
      - IndexError가 발생한다
    answerIndex: 1
    explanation: "-0은 0이므로 text[0:], 즉 문자열 전체가 됩니다. 뒤에서 n글자를 자를 때는 text[len(text) - n:]처럼 쓰는 편이 안전합니다."
---

## 1. 오늘 배울 내용

Day 57에서 스택을 만들었습니다. 오늘은 스택이 실제 프로그램에서 쓰이는 가장 유명한 장면인 **실행 취소(undo)와 다시 실행(redo)** 을 구현합니다. 문서 편집기, 그림판, 코드 편집기에 있는 Ctrl+Z와 Ctrl+Y가 바로 이 기능입니다.

이번 수업의 흐름은 다음과 같습니다.

1. 실행 취소가 왜 스택 순서인지 확인합니다.
2. 되돌리려면 작업마다 **무엇을 기록해야 하는지** 정합니다.
3. undo 스택과 redo 스택 **두 개**가 기록을 주고받는 규칙을 그림과 표로 익힙니다.
4. 글자 쓰기와 지우기를 지원하는 작은 편집기를 **C, Python, Rust** 로 각각 완성합니다.
5. 응용으로 브라우저의 뒤로 가기·앞으로 가기를 만들어 봅니다.

## 2. 왜 스택인가

편집기에서 다음 순서로 작업했다고 합시다.

1. `Hello`를 입력한다.
2. `, world`를 입력한다.
3. 끝의 6글자 ` world`를 지운다.

지금 화면은 `Hello,`입니다. Ctrl+Z를 누르면 **가장 최근 작업인 3번**이 취소되어야 합니다. 한 번 더 누르면 2번, 그다음은 1번입니다. 먼저 한 작업일수록 나중에 취소됩니다. **작업 기록을 쌓아 두고 맨 위부터 꺼내는 것**, 정확히 스택입니다.

그렇다면 Ctrl+Y(다시 실행)는 어떨까요? 취소한 작업들 중에서 **가장 최근에 취소한 것**부터 되살아나야 합니다. 이것도 LIFO이므로 스택이 하나 더 필요합니다.

## 3. 그림으로 이해하기

두 스택은 작업 기록을 서로 주고받습니다.

```text
   write/delete            undo()                     redo()
  ───────────────►   ───────────────────►       ◄───────────────────
                     undo 스택에서 pop         redo 스택에서 pop
  undo 스택에 push   → 되돌리기 적용            → 다시 적용
  redo 스택 비우기   → redo 스택에 push         → undo 스택에 push

      undo 스택                               redo 스택
     ┌──────────┐                            ┌──────────┐
     │ delete 6 │ ← top  ── undo() ──►       │          │
     ├──────────┤                            ├──────────┤
     │ ", world"│                            │          │
     ├──────────┤                            └──────────┘
     │ "Hello"  │
     └──────────┘
```

규칙은 세 가지뿐입니다.

| 사건      | undo 스택      | redo 스택      | 문서             |
| --------- | -------------- | -------------- | ---------------- |
| 새 작업   | 기록을 push    | **모두 비움**  | 작업 적용        |
| 실행 취소 | 기록을 pop     | 그 기록을 push | 작업을 되돌림    |
| 다시 실행 | 그 기록을 push | 기록을 pop     | 작업을 다시 적용 |

## 4. 천천히 풀어보기

### 4.1 무엇을 기록해야 되돌릴 수 있는가

"작업을 기록한다"는 말은 막연합니다. 구체적으로 **되돌리기 위해 필요한 정보**를 저장해야 합니다.

- **글자 쓰기**: 끝에 붙인 글자를 기억하면, 되돌릴 때 그 글자 수만큼 끝을 잘라 내면 됩니다.
- **글자 지우기**: 몇 글자를 지웠는지만으로는 부족합니다. **무엇을** 지웠는지 기억해야 되돌릴 때 다시 붙일 수 있습니다.

그래서 기록 하나는 `(작업 종류, 글자 조각)` 두 가지로 이루어집니다.

| 작업                 | 기록                 | 되돌리기(undo)       | 다시 하기(redo)      |
| -------------------- | -------------------- | -------------------- | -------------------- |
| `Hello` 쓰기         | `(insert, "Hello")`  | 끝에서 5글자 잘라 냄 | 끝에 `Hello`를 붙임  |
| 끝의 ` world` 지우기 | `(delete, " world")` | 끝에 ` world`를 붙임 | 끝에서 6글자 잘라 냄 |

표를 잘 보면 **insert의 되돌리기는 delete와 같고, delete의 되돌리기는 insert와 같습니다.** 서로가 서로의 **역연산(inverse operation)** 입니다. 그래서 구현할 때 "붙이기"와 "잘라 내기" 두 함수만 있으면 네 가지 경우를 모두 처리할 수 있습니다.

> **참고**: 작업 대신 "작업 전의 문서 전체"를 저장하는 방법도 있습니다. 이를 **스냅숏(snapshot)** 방식이라고 합니다. 구현은 쉽지만 문서가 크면 메모리를 많이 씁니다. 오늘 만드는 방식은 **명령(command) 기록** 방식이라고 하며, 바뀐 조각만 저장하므로 가볍습니다. 실습의 Rust 계산기 문제에서 스냅숏 방식도 직접 만들어 봅니다.

### 4.2 기록이 두 스택을 오가는 모습

기록은 undo를 하면 사라지는 것이 아니라 redo 스택으로 **이사**합니다. redo를 하면 다시 undo 스택으로 돌아옵니다. 그래서 새 작업을 하지 않는 한 **두 스택의 길이 합은 변하지 않습니다.** 디버깅할 때 이 사실을 확인해 보면 버그를 쉽게 찾을 수 있습니다.

### 4.3 새 작업은 redo를 지운다

`Hello`를 쓰고 실행 취소했다고 합시다. redo 스택에는 `(insert, "Hello")`가 있습니다. 이 상태에서 `Bye`를 새로 쓰면 어떻게 될까요? redo 기록을 남겨 두면, Ctrl+Y를 눌렀을 때 `ByeHello`처럼 사용자가 한 번도 만든 적 없는 문서가 생깁니다.

실행 취소는 시간을 되감는 것이고, 새 작업은 **그 시점에서 새로운 미래를 시작**하는 것입니다. 옛 미래(redo 기록)는 더 이상 이어질 수 없으므로 버립니다. 이 규칙을 빼먹는 것이 undo/redo 구현에서 가장 흔한 버그입니다.

### 4.4 실패도 정상적으로 처리한다

undo 스택이 비었을 때 Ctrl+Z를 누르면 아무 일도 없어야 합니다. 프로그램이 멈추면 안 됩니다. 이번 구현에서는 undo와 redo가 **성공 여부를 bool로 돌려주게** 해서 호출하는 쪽이 "더 이상 취소할 것이 없습니다" 같은 안내를 할 수 있게 합니다.

## 5. C로 구현하기

C에서는 기록 하나를 구조체로, 작업 종류를 `enum`으로 표현합니다. Day 57의 배열 스택을 그대로 재사용합니다.

```c
// 파일: undo.c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define TEXT_MAX 64
#define PIECE_MAX 16
#define HISTORY_MAX 8

typedef enum { INSERT, DELETE } Kind;

typedef struct {
    Kind kind;
    char piece[PIECE_MAX];      // 붙인 글자 또는 지운 글자
} Action;

typedef struct {
    Action items[HISTORY_MAX];
    int top;
} ActionStack;

typedef struct {
    char text[TEXT_MAX];
    ActionStack undo;
    ActionStack redo;
} Editor;

bool stack_push(ActionStack *s, Action a) {
    if (s->top == HISTORY_MAX - 1) {
        return false;
    }
    s->items[++s->top] = a;     // 구조체는 = 로 통째로 복사된다
    return true;
}

bool stack_pop(ActionStack *s, Action *out) {
    if (s->top == -1) {
        return false;
    }
    *out = s->items[s->top--];
    return true;
}

void append_piece(Editor *e, const char *piece) {
    strcat(e->text, piece);
}

void cut_tail(Editor *e, size_t n) {
    e->text[strlen(e->text) - n] = '\0';
}

// forward가 true면 작업을 적용하고, false면 되돌린다.
void apply(Editor *e, const Action *a, bool forward) {
    bool adding = (a->kind == INSERT) == forward;
    if (adding) {
        append_piece(e, a->piece);
    } else {
        cut_tail(e, strlen(a->piece));
    }
}

bool editor_write(Editor *e, const char *piece) {
    if (strlen(piece) >= PIECE_MAX ||
        strlen(e->text) + strlen(piece) >= TEXT_MAX) {
        return false;
    }
    Action a = { .kind = INSERT };
    strcpy(a.piece, piece);
    if (!stack_push(&e->undo, a)) {
        return false;
    }
    apply(e, &a, true);
    e->redo.top = -1;           // 새 작업: redo 기록을 모두 버린다
    return true;
}

bool editor_delete(Editor *e, size_t n) {
    size_t len = strlen(e->text);
    if (n > len) {
        n = len;
    }
    if (n >= PIECE_MAX) {
        return false;
    }
    Action a = { .kind = DELETE };
    memcpy(a.piece, e->text + len - n, n);  // 지울 글자를 먼저 복사
    a.piece[n] = '\0';
    if (!stack_push(&e->undo, a)) {
        return false;
    }
    apply(e, &a, true);
    e->redo.top = -1;
    return true;
}

bool editor_undo(Editor *e) {
    Action a;
    if (!stack_pop(&e->undo, &a)) {
        return false;
    }
    apply(e, &a, false);        // 되돌리기
    stack_push(&e->redo, a);
    return true;
}

bool editor_redo(Editor *e) {
    Action a;
    if (!stack_pop(&e->redo, &a)) {
        return false;
    }
    apply(e, &a, true);         // 다시 적용
    stack_push(&e->undo, a);
    return true;
}

void show(const Editor *e, const char *label) {
    printf("%-16s \"%s\" (undo %d, redo %d)\n",
           label, e->text, e->undo.top + 1, e->redo.top + 1);
}

int main(void) {
    Editor e = { .text = "", .undo = { .top = -1 }, .redo = { .top = -1 } };

    editor_write(&e, "Hello");
    show(&e, "write Hello");
    editor_write(&e, ", world");
    show(&e, "write , world");
    editor_delete(&e, 6);
    show(&e, "delete 6");

    editor_undo(&e);
    show(&e, "undo");
    editor_undo(&e);
    show(&e, "undo");
    editor_redo(&e);
    show(&e, "redo");

    editor_write(&e, "!");
    show(&e, "write !");
    if (!editor_redo(&e)) {
        printf("redo 실패: 다시 실행할 작업이 없습니다\n");
    }

    while (editor_undo(&e)) {
    }
    show(&e, "undo all");
    return 0;
}
```

실행 결과:

```text
write Hello      "Hello" (undo 1, redo 0)
write , world    "Hello, world" (undo 2, redo 0)
delete 6         "Hello," (undo 3, redo 0)
undo             "Hello, world" (undo 2, redo 1)
undo             "Hello" (undo 1, redo 2)
redo             "Hello, world" (undo 2, redo 1)
write !          "Hello, world!" (undo 3, redo 0)
redo 실패: 다시 실행할 작업이 없습니다
undo all         "" (undo 0, redo 3)
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                                                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef enum { INSERT, DELETE } Kind;`                  | 작업 종류에 이름을 붙입니다. 내부적으로 `INSERT`는 0, `DELETE`는 1이지만, 숫자 대신 이름을 쓰면 코드의 뜻이 분명해집니다.                                                                     |
| `char piece[PIECE_MAX];`                                 | 기록이 글자 조각을 **직접** 가집니다. 포인터로 원래 문자열을 가리키게 하면, 원래 문자열이 바뀔 때 기록도 함께 망가집니다.                                                                     |
| `s->items[++s->top] = a;`                                | C에서 구조체는 `=`로 멤버 전체가 복사됩니다. 배열 멤버 `piece`까지 통째로 복사되므로 기록이 스택 안에 안전하게 보관됩니다.                                                                    |
| `bool adding = (a->kind == INSERT) == forward;`          | "insert를 적용"하거나 "delete를 되돌리는" 두 경우 모두 글자를 **붙이는** 일입니다. 두 조건이 같으면(둘 다 참이거나 둘 다 거짓) 붙이고, 다르면 잘라 냅니다. 역연산 표를 한 줄로 옮긴 것입니다. |
| `memcpy(a.piece, e->text + len - n, n);`                 | 문자열 끝에서 n글자를 기록으로 복사합니다. `e->text + len - n`은 지울 부분이 시작하는 주소입니다(Day 30의 포인터 산술). **지우기 전에** 복사해야 합니다.                                      |
| `a.piece[n] = '\0';`                                     | `memcpy`는 널 문자를 붙여 주지 않으므로 직접 붙여 C 문자열로 만듭니다.                                                                                                                        |
| `e->text[strlen(e->text) - n] = '\0';`                   | 끝에서 n글자를 잘라 내는 가장 간단한 방법입니다. 길이가 12인 문자열에서 6글자를 자르려면 인덱스 6에 널 문자를 두면 됩니다.                                                                    |
| `e->redo.top = -1;`                                      | 새 작업을 하면 redo 스택을 비웁니다. 배열 칸을 지울 필요 없이 top만 되돌리면 됩니다.                                                                                                          |
| `Editor e = { .text = "", .undo = { .top = -1 }, ... };` | **지정 초기화(designated initializer)** 입니다. 이름을 적은 멤버만 값을 정하고, 적지 않은 멤버는 0으로 채워집니다.                                                                            |
| `while (editor_undo(&e)) { }`                            | 실패할 때까지 undo를 반복해 처음 상태로 돌아갑니다. 반복 본문은 비어 있습니다.                                                                                                                |

> **오류 주의**: `editor_write`는 먼저 길이를 검사합니다. `strcat`은 목적지 배열이 충분히 큰지 확인하지 않으므로, 검사 없이 붙이면 `text` 배열 밖에 글자를 씁니다. C 문자열 함수를 쓸 때는 **쓰기 전에 공간을 확인**하는 습관이 필수입니다.

> **참고**: `editor_undo`에서 `stack_push(&e->redo, a)`의 반환값을 확인하지 않았습니다. 두 스택의 용량이 같고 기록은 한쪽에서 빠져 다른 쪽으로 들어가므로 redo 스택은 넘칠 수 없기 때문입니다. 이런 판단을 할 때는 이유를 주석으로 남겨 두면 좋습니다.

## 6. Python으로 구현하기

Python에서는 기록 하나를 **튜플** `(종류, 조각)`로 표현합니다. 튜플은 한 번 만들면 바뀌지 않으므로, 스택에 넣은 기록이 실수로 수정될 걱정이 없습니다.

```python
# 파일: undo.py
class Editor:
    def __init__(self):
        self.text = ""
        self.undo_stack = []      # (종류, 조각) 튜플을 쌓는다
        self.redo_stack = []

    def write(self, piece):
        self._record(("insert", piece))

    def delete(self, n):
        n = min(n, len(self.text))
        removed = self.text[len(self.text) - n:]
        self._record(("delete", removed))

    def _record(self, action):
        self._apply(action, forward=True)
        self.undo_stack.append(action)
        self.redo_stack.clear()   # 새 작업: redo 기록을 버린다

    def _apply(self, action, forward):
        kind, piece = action
        adding = (kind == "insert") == forward
        if adding:
            self.text += piece
        else:
            self.text = self.text[: len(self.text) - len(piece)]

    def undo(self):
        if not self.undo_stack:
            return False
        action = self.undo_stack.pop()
        self._apply(action, forward=False)
        self.redo_stack.append(action)
        return True

    def redo(self):
        if not self.redo_stack:
            return False
        action = self.redo_stack.pop()
        self._apply(action, forward=True)
        self.undo_stack.append(action)
        return True

    def show(self, label):
        print(f"{label:<16} {self.text!r} "
              f"(undo {len(self.undo_stack)}, redo {len(self.redo_stack)})")


e = Editor()
e.write("Hello")
e.show("write Hello")
e.write(", world")
e.show("write , world")
e.delete(6)
e.show("delete 6")

e.undo()
e.show("undo")
e.undo()
e.show("undo")
e.redo()
e.show("redo")

e.write("!")
e.show("write !")
if not e.redo():
    print("redo 실패: 다시 실행할 작업이 없습니다")

while e.undo():
    pass
e.show("undo all")
print("redo 스택:", e.redo_stack)
```

실행 결과:

```text
write Hello      'Hello' (undo 1, redo 0)
write , world    'Hello, world' (undo 2, redo 0)
delete 6         'Hello,' (undo 3, redo 0)
undo             'Hello, world' (undo 2, redo 1)
undo             'Hello' (undo 1, redo 2)
redo             'Hello, world' (undo 2, redo 1)
write !          'Hello, world!' (undo 3, redo 0)
redo 실패: 다시 실행할 작업이 없습니다
undo all         '' (undo 0, redo 3)
redo 스택: [('insert', '!'), ('insert', ', world'), ('insert', 'Hello')]
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                                |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self._record(("insert", piece))`          | 괄호가 두 겹입니다. 바깥 괄호는 함수 호출, 안쪽 괄호는 튜플입니다. 튜플 하나를 인자로 넘깁니다.                                                     |
| `removed = self.text[len(self.text) - n:]` | 끝에서 n글자를 **먼저 복사**합니다. `self.text[-n:]`로 쓰면 n이 0일 때 문자열 **전체**가 되는 함정이 있습니다(자주 하는 실수 3).                    |
| `def _record(self, action):`               | 쓰기와 지우기가 공통으로 하는 일(적용, 기록, redo 비우기)을 한곳에 모았습니다. 같은 규칙을 두 곳에 쓰면 한쪽만 고치는 실수가 생기기 쉽습니다.       |
| `kind, piece = action`                     | **튜플 풀기(unpacking)** 입니다. 튜플의 두 값을 두 변수에 차례로 넣습니다.                                                                          |
| `self.text[: len(self.text) - len(piece)]` | 처음부터 "끝에서 조각 길이만큼 앞"까지 잘라 새 문자열을 만듭니다. Python 문자열은 바꿀 수 없으므로(immutable) 자를 때마다 새 문자열이 만들어집니다. |
| `self.redo_stack.clear()`                  | list의 모든 원소를 지웁니다. `self.redo_stack = []`로 새 list를 만들어도 결과는 같습니다.                                                           |
| `f"{label:<16} {self.text!r}"`             | `:<16`은 16칸 왼쪽 정렬, `!r`은 `repr()`로 출력하라는 뜻이라 문자열이 따옴표와 함께 보입니다. 빈 문자열도 `''`로 보여서 확인하기 좋습니다.          |

마지막 줄의 redo 스택을 보세요. 모두 취소했으므로 가장 먼저 한 작업인 `'Hello'`가 **top**(list의 끝)에 있습니다. 지금 redo를 누르면 `Hello`부터 다시 쓰입니다. 예상한 순서 그대로입니다.

## 7. Rust로 구현하기

Rust에서는 작업 종류와 조각을 **데이터를 가진 enum** 으로 표현합니다. C는 `kind`와 `piece`를 따로 두었지만, Rust의 `enum`은 "종류마다 필요한 데이터"를 함께 묶을 수 있습니다.

```rust
// 파일: undo.rs
#[derive(Debug)]
enum Action {
    Insert(String),
    Delete(String),
}

struct Editor {
    text: String,
    undo_stack: Vec<Action>,
    redo_stack: Vec<Action>,
}

impl Editor {
    fn new() -> Self {
        Editor { text: String::new(), undo_stack: Vec::new(), redo_stack: Vec::new() }
    }

    fn write(&mut self, piece: &str) {
        self.record(Action::Insert(piece.to_string()));
    }

    fn delete(&mut self, n: usize) {
        let n = n.min(self.text.len());
        let start = self.text.len() - n;
        let removed = self.text[start..].to_string();
        self.record(Action::Delete(removed));
    }

    fn record(&mut self, action: Action) {
        self.apply(&action, true);
        self.undo_stack.push(action);
        self.redo_stack.clear();
    }

    fn apply(&mut self, action: &Action, forward: bool) {
        let (piece, adding) = match action {
            Action::Insert(p) => (p, forward),
            Action::Delete(p) => (p, !forward),
        };
        if adding {
            self.text.push_str(piece);
        } else {
            let new_len = self.text.len() - piece.len();
            self.text.truncate(new_len);
        }
    }

    fn undo(&mut self) -> bool {
        match self.undo_stack.pop() {
            Some(action) => {
                self.apply(&action, false);
                self.redo_stack.push(action);
                true
            }
            None => false,
        }
    }

    fn redo(&mut self) -> bool {
        match self.redo_stack.pop() {
            Some(action) => {
                self.apply(&action, true);
                self.undo_stack.push(action);
                true
            }
            None => false,
        }
    }

    fn show(&self, label: &str) {
        println!(
            "{:<16} {:?} (undo {}, redo {})",
            label,
            self.text,
            self.undo_stack.len(),
            self.redo_stack.len()
        );
    }
}

fn main() {
    let mut e = Editor::new();
    e.write("Hello");
    e.show("write Hello");
    e.write(", world");
    e.show("write , world");
    e.delete(6);
    e.show("delete 6");

    e.undo();
    e.show("undo");
    e.undo();
    e.show("undo");
    e.redo();
    e.show("redo");

    e.write("!");
    e.show("write !");
    if !e.redo() {
        println!("redo 실패: 다시 실행할 작업이 없습니다");
    }

    while e.undo() {}
    e.show("undo all");
    println!("redo top: {:?}", e.redo_stack.last());
}
```

실행 결과:

```text
write Hello      "Hello" (undo 1, redo 0)
write , world    "Hello, world" (undo 2, redo 0)
delete 6         "Hello," (undo 3, redo 0)
undo             "Hello, world" (undo 2, redo 1)
undo             "Hello" (undo 1, redo 2)
redo             "Hello, world" (undo 2, redo 1)
write !          "Hello, world!" (undo 3, redo 0)
redo 실패: 다시 실행할 작업이 없습니다
undo all         "" (undo 0, redo 3)
redo top: Some(Insert("Hello"))
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum Action { Insert(String), Delete(String) }`      | 각 변형(variant)이 `String`을 하나씩 가집니다. `Action::Insert("Hello".to_string())`처럼 만들고, `match`로 꺼냅니다. C의 `kind` + `piece`를 하나로 묶은 모양입니다. |
| `piece.to_string()`                                   | 빌려 온 `&str`로 **자기 소유의** `String`을 만듭니다. 기록은 원래 문자열이 사라져도 살아남아야 하므로 소유해야 합니다.                                              |
| `let n = n.min(self.text.len());`                     | 같은 이름으로 새 변수를 만드는 **섀도잉(shadowing)** 입니다. 지울 글자 수가 문서 길이보다 크면 문서 길이로 줄입니다.                                                |
| `self.text[start..].to_string()`                      | `start`부터 끝까지의 **문자열 슬라이스**를 복사합니다. 인덱스는 바이트 단위이므로, 이 예제는 영어와 기호만 쓴다고 가정합니다(Q&A 참고).                             |
| `fn record(&mut self, action: Action)`                | `action`의 **소유권을 받아서** undo 스택으로 옮깁니다. 호출한 쪽에서는 더 이상 그 값을 쓸 수 없습니다.                                                              |
| `self.apply(&action, true);`                          | `apply`에는 빌려주기만(`&`) 합니다. 그래서 다음 줄에서 `action`을 스택에 push할 수 있습니다.                                                                        |
| `let (piece, adding) = match action { ... };`         | `match`도 값을 만드는 **표현식**입니다. 두 값을 튜플로 돌려받아 한 번에 풀었습니다. `Delete`는 `!forward`이므로 되돌릴 때 붙이게 됩니다.                            |
| `match self.undo_stack.pop() { Some(action) => ... }` | `pop()`이 기록의 소유권을 넘겨주므로, 스택을 빌린 채로 `self.apply`를 부르는 문제가 생기지 않습니다(자주 하는 실수 4).                                              |
| `while e.undo() {}`                                   | 본문이 빈 반복입니다. `undo()`가 `false`를 돌려줄 때까지 계속 부릅니다.                                                                                             |

## 8. 실행 추적

세 프로그램은 같은 순서로 작업하므로 결과도 같습니다. 두 스택을 top이 오른쪽이 되도록 적어 보겠습니다. `I:`는 insert, `D:`는 delete 기록입니다.

| 단계 | 작업          | 문서            | undo 스택 (바닥 → top)           | redo 스택 (바닥 → top) |
| ---: | ------------- | --------------- | -------------------------------- | ---------------------- |
|    1 | write Hello   | `Hello`         | `I:Hello`                        | 비어 있음              |
|    2 | write , world | `Hello, world`  | `I:Hello` `I:, world`            | 비어 있음              |
|    3 | delete 6      | `Hello,`        | `I:Hello` `I:, world` `D: world` | 비어 있음              |
|    4 | undo          | `Hello, world`  | `I:Hello` `I:, world`            | `D: world`             |
|    5 | undo          | `Hello`         | `I:Hello`                        | `D: world` `I:, world` |
|    6 | redo          | `Hello, world`  | `I:Hello` `I:, world`            | `D: world`             |
|    7 | write !       | `Hello, world!` | `I:Hello` `I:, world` `I:!`      | **비어 있음**          |

- 4단계: `D: world`를 되돌리려면 지웠던 ` world`를 **붙입니다.**
- 6단계: redo 스택의 top은 `I:, world`입니다. 먼저 취소한 `D: world`는 바닥에 깔려 있습니다.
- 7단계: 새 작업이 생겨 `D: world` 기록이 **버려졌습니다.** 이제 ` world`를 지운 상태로는 돌아갈 수 없습니다.

## 9. 다른 예제로 다시 이해하기

웹 브라우저의 **뒤로 가기·앞으로 가기**도 스택 두 개로 만들어집니다. 구조가 실행 취소와 똑같다는 점을 확인해 보세요. 현재 페이지는 따로 들고 있고, 새 페이지로 이동할 때 현재 페이지를 back 스택에 push합니다. 뒤로 가면 현재 페이지를 forward 스택에 push하고 back 스택에서 꺼낸 페이지로 이동합니다. 새 링크를 누르면 forward 스택을 비웁니다. 실행 취소의 "새 작업은 redo를 지운다"와 같은 규칙입니다.

```python
# 파일: browser.py
class Browser:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, page):
        self.back_stack.append(self.current)
        self.current = page
        self.forward_stack.clear()

    def back(self):
        if not self.back_stack:
            return False
        self.forward_stack.append(self.current)
        self.current = self.back_stack.pop()
        return True

    def forward(self):
        if not self.forward_stack:
            return False
        self.back_stack.append(self.current)
        self.current = self.forward_stack.pop()
        return True

    def show(self, label):
        print(f"{label:<14} now={self.current:<7} "
              f"back={self.back_stack} forward={self.forward_stack}")


b = Browser("home")
b.visit("news")
b.show("visit news")
b.visit("sports")
b.show("visit sports")
b.back()
b.show("back")
b.back()
b.show("back")
print("다시 back 가능?", b.back())
b.forward()
b.show("forward")
b.visit("mail")
b.show("visit mail")
```

실행 결과:

```text
visit news     now=news    back=['home'] forward=[]
visit sports   now=sports  back=['home', 'news'] forward=[]
back           now=news    back=['home'] forward=['sports']
back           now=home    back=[] forward=['sports', 'news']
다시 back 가능? False
forward        now=news    back=['home'] forward=['sports']
visit mail     now=mail    back=['home', 'news'] forward=[]
```

마지막 줄에서 `sports`로 가는 앞으로 가기 기록이 사라졌습니다. 새 링크 `mail`을 눌러 새로운 방문 역사가 시작되었기 때문입니다.

## 10. 시간·공간 복잡도

조각의 길이를 k라고 하겠습니다.

| 연산   | 스택 연산 | 문서 수정            | 합계 |
| ------ | --------- | -------------------- | ---- |
| write  | O(1)      | 끝에 k글자 붙이기    | O(k) |
| delete | O(1)      | k글자 복사 후 자르기 | O(k) |
| undo   | O(1)      | 붙이기 또는 자르기   | O(k) |
| redo   | O(1)      | 붙이기 또는 자르기   | O(k) |

> **참고**: Python의 `self.text[: ...]`와 `self.text += piece`는 문자열 전체를 새로 만들기 때문에 실제로는 문서 길이에 비례하는 시간이 듭니다. C의 `strcat`과 `strlen`도 문자열을 처음부터 훑습니다. 작은 편집기에서는 문제가 없지만, 실제 편집기는 문서를 여러 조각으로 나눠 저장하는 특별한 자료구조를 씁니다.

공간은 기록 수에 비례합니다. 기록이 무한히 쌓이지 않도록 실제 프로그램은 최근 N개만 보관합니다. 실습의 "기록 개수 제한하기"에서 직접 구현해 봅니다.

## 11. 세 언어 비교

| 관점         | C                                       | Python                     | Rust                                 |
| ------------ | --------------------------------------- | -------------------------- | ------------------------------------ |
| 기록 표현    | `struct { Kind kind; char piece[16]; }` | 튜플 `("insert", "Hello")` | `enum Action { Insert(String), .. }` |
| 종류 구분    | `enum` 값을 비교                        | 문자열 `"insert"`를 비교   | `match`로 변형을 나눔                |
| 잘못된 종류  | 아무 정수나 넣을 수 있음                | 오타 `"insrt"`도 실행됨    | 없는 변형은 컴파일 오류              |
| 조각 저장    | 고정 크기 배열에 복사                   | 문자열 객체를 참조         | `String`을 소유                      |
| 끝 잘라 내기 | `text[len - n] = '\0'`                  | 슬라이스로 새 문자열 생성  | `truncate(new_len)`                  |
| 용량 제한    | 직접 검사                               | 없음                       | 없음                                 |

Python 버전은 가장 짧지만, 작업 종류를 문자열로 비교하므로 `"insrt"`처럼 오타를 내도 실행되다가 엉뚱하게 동작합니다. Rust의 enum은 이런 실수를 컴파일 단계에서 막아 줍니다. Python에서도 `enum` 모듈이나 클래스를 쓰면 비슷한 안전장치를 만들 수 있습니다.

## 12. 자주 하는 실수

### 실수 1: 새 작업을 할 때 redo 스택을 비우지 않는다

실습의 디버그 문제가 바로 이 실수입니다. `Hello`를 쓰고 취소한 뒤 `X`를 쓰고 redo하면 `XHello`가 되어, 사용자가 만든 적 없는 문서가 나타납니다. 쓰기와 지우기처럼 "새 작업"을 만드는 모든 함수에서 redo를 비워야 합니다. Python 버전처럼 공통 함수 `_record`에 모아 두면 빼먹을 위험이 줄어듭니다.

### 실수 2: 지운 글자를 기록하지 않는다

```python
self.undo_stack.append(("delete", n))   # 몇 글자인지만 기록
```

이렇게 하면 되돌릴 때 붙일 글자가 없습니다. 되돌리기에 필요한 정보는 **작업을 하기 전에** 저장해야 합니다. 지운 뒤에는 이미 사라진 정보입니다.

### 실수 3: Python에서 `text[-n:]`로 끝을 자른다

```python
# 파일: minus_zero.py
text = "Hello"
n = 0
print(repr(text[-n:]))                  # 기대: '' (0글자)
print(repr(text[len(text) - n:]))       # 안전한 방법
```

실행 결과:

```text
'Hello'
''
```

`-0`은 `0`이므로 `text[-0:]`은 `text[0:]`, 즉 **전체 문자열**입니다. 지울 글자 수가 0일 수 있다면 `len(text) - n`으로 시작 위치를 직접 계산하세요.

### 실수 4: Rust에서 스택을 빌린 채로 self를 수정한다

`pop()` 대신 `last()`로 기록을 **빌려 온** 상태에서 `&mut self` 메서드를 부르면 컴파일되지 않습니다.

```rust
// 파일: undo_borrow.rs (컴파일 오류: E0502)
struct Editor {
    text: String,
    undo_stack: Vec<String>,
}

impl Editor {
    fn cut(&mut self, piece: &str) {
        let new_len = self.text.len() - piece.len();
        self.text.truncate(new_len);
    }

    fn undo(&mut self) {
        if let Some(piece) = self.undo_stack.last() {
            self.cut(piece);            // self 전체를 가변으로 빌리려 함
            self.undo_stack.pop();
        }
    }
}

fn main() {
    let mut e = Editor { text: String::from("ab"), undo_stack: vec![String::from("b")] };
    e.undo();
    println!("{}", e.text);
}
```

```text
error[E0502]: cannot borrow `*self` as mutable because it is also borrowed as immutable
```

`piece`는 `self.undo_stack` 안의 값을 빌린 참조입니다. `self.cut(...)`은 `self` **전체**를 가변으로 빌리므로, 그 안에 있는 `undo_stack`을 누군가 바꿀 수도 있습니다. 그러면 `piece`가 가리키는 값이 사라질 수 있으므로 Rust가 막습니다. 해결책은 본문 코드처럼 **먼저 `pop()`으로 소유권을 가져온 뒤** 사용하는 것입니다.

### 실수 5: C에서 기록에 포인터만 저장한다

```c
typedef struct {
    Kind kind;
    const char *piece;   // 원래 문자열을 가리키기만 함
} Action;
```

지우기 기록의 `piece`가 `e->text` 안쪽을 가리키면, 글자를 지우는 순간(널 문자를 쓰는 순간) 기록의 내용도 함께 사라집니다. 기록은 **자기만의 복사본**을 가져야 합니다. 그래서 본문 코드는 `char piece[PIECE_MAX]`에 `memcpy`로 복사했습니다.

## 13. Q&A

**Q. undo 스택과 redo 스택을 하나의 배열과 "현재 위치" 변수로 만들 수는 없나요?**

A. 가능합니다. 기록 배열 하나와 현재 위치 `pos`를 두고, undo는 `pos`를 하나 줄이고 redo는 하나 늘리며, 새 작업은 `pos` 뒤의 기록을 잘라 내고 추가하는 방식입니다. 실제로 많은 프로그램이 이렇게 합니다. 개념을 처음 배울 때는 스택 두 개가 규칙이 더 잘 보입니다.

**Q. Rust 버전의 `self.text[start..]`에 한글을 넣으면 어떻게 되나요?**

A. Rust 문자열 인덱스는 **바이트** 단위이고, 한글 한 글자는 UTF-8에서 3바이트입니다. 글자 중간을 자르면 프로그램이 panic합니다. 한글을 지원하려면 `char_indices()`로 글자 경계를 찾아야 합니다. 문자열과 유니코드는 Day 38~39에서 자세히 다룹니다. C 버전도 바이트 단위이므로 같은 문제가 있습니다. Python은 문자열을 글자 단위로 다루므로 그대로 동작합니다.

**Q. 여러 글자를 한 번에 되돌리려면 어떻게 하나요?**

A. 실제 편집기는 연속으로 입력한 글자를 하나의 기록으로 **합칩니다.** 예를 들어 마지막 기록이 insert이고 새 입력도 insert라면 새 기록을 push하는 대신 top 기록의 조각 뒤에 이어 붙입니다. 도전 문제 3번에서 구현해 보세요.

**Q. 스냅숏 방식과 명령 기록 방식 중 무엇이 좋은가요?**

A. 상황에 따라 다릅니다. 상태가 작고 작업 종류가 다양하면 스냅숏이 간단합니다(실습의 Rust 계산기). 상태가 크면 명령 기록이 메모리를 훨씬 적게 씁니다. 되돌리기 방법을 정의하기 어려운 작업이 섞여 있으면 둘을 함께 쓰기도 합니다.

## 14. 핵심 요약

- 실행 취소는 가장 최근 작업부터 되돌리므로 **스택**입니다. 다시 실행도 가장 최근에 취소한 것부터이므로 스택이 하나 더 필요합니다.
- 기록에는 **되돌리기에 필요한 정보**를 담습니다. 쓰기는 쓴 글자를, 지우기는 지운 글자를 저장합니다.
- 쓰기와 지우기는 서로의 **역연산**입니다. "붙이기"와 "자르기" 두 함수로 네 경우를 모두 처리할 수 있습니다.
- undo는 기록을 undo 스택에서 redo 스택으로, redo는 반대로 옮깁니다.
- **새 작업은 redo 스택을 비웁니다.** 가장 흔한 버그가 이것을 빼먹는 것입니다.
- C는 `enum`과 구조체, Python은 튜플, Rust는 데이터를 가진 `enum`으로 기록을 표현했습니다.

## 15. 도전 문제

1. **(C)** 기록 개수가 `HISTORY_MAX`에 도달하면 새 작업을 거부하는 대신, 가장 오래된 기록(바닥)을 버리고 새 기록을 넣도록 바꿔 보세요. 배열의 원소를 한 칸씩 앞으로 옮기면 됩니다.
2. **(Python)** 작업 종류 문자열 대신 `from enum import Enum`으로 `Kind.INSERT`, `Kind.DELETE`를 정의해 오타를 막아 보세요.
3. **(Rust)** 연속된 `write` 호출을 하나의 기록으로 합치도록 `record`를 고쳐 보세요. 힌트: `if let Some(Action::Insert(last)) = self.undo_stack.last_mut()`.
4. **(세 언어)** 브라우저 예제를 C와 Rust로 옮겨 보세요. 페이지 이름은 C에서는 `char name[16]`, Rust에서는 `String`으로 저장합니다.
