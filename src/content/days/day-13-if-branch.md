---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-13-if-branch
courseId: crp-92
phaseId: phase-02
dayNumber: 13
date: "2026-10-13"
title: 조건문 — 조건에 따라 실행할 길 고르기
summary: 조건이 참일 때만 실행하는 if, 거짓일 때의 else, 여러 경우를 차례로 검사하는 elif·else if 사다리, 조건문 안의 조건문(중첩)을 세 언어로 배웁니다. 조건을 검사하는 순서가 결과를 바꾸는 이유, 독립된 if 여러 개와 if-elif 사다리의 차이, 값 하나를 고르는 조건식(Python의 A if 조건 else B, C의 ?:, Rust의 if 표현식)을 익히고, 성적 등급과 택배비 계산으로 경계값까지 시험합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-12-comparison]
learningObjectives:
  - if, else, elif(else if)로 조건에 따라 실행할 코드를 고른다.
  - 조건 사다리에서 조건의 순서가 결과에 미치는 영향을 설명하고, 좁은 조건부터 배치한다.
  - 독립된 if 여러 개와 if-elif 사다리의 실행 차이를 추적한다.
  - 값 하나를 고르는 조건식을 세 언어로 쓰고, Rust의 if가 값을 돌려주는 표현식이라는 것을 설명한다.
  - 중첩된 조건과 잘못된 입력을 먼저 걸러 내는 조건을 써서 규칙을 코드로 옮긴다.
concepts:
  [
    if,
    else,
    elif,
    else if,
    condition ladder,
    nested if,
    conditional expression,
    ternary operator,
    if expression,
    guard clause,
  ]
runnerMode: python
playgroundSource: |
  # 파일: grade.py — 점수를 바꿔 가며 어느 줄이 실행되는지 보세요.
  score = 89
  if score < 0 or score > 100:
      print("잘못된 점수")
  elif score >= 90:
      print("A")
  elif score >= 80:
      print("B")
  else:
      print("C 이하")
  print("할인" if score >= 85 else "정가")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day13-predict-py
    title: 독립된 if와 사다리 구별하기
    kind: predict
    objective: if 두 개가 서로 독립적으로 검사된다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      x = 85
      if x >= 80:
          print("B", end=" ")
      if x >= 70:
          print("C", end=" ")
      else:
          print("F", end=" ")
      print()
    answer: "B C"
    hint: "두 번째 if는 elif가 아니라 새 if입니다. 첫 번째 결과와 상관없이 다시 검사합니다."
    explanation: "첫 if에서 B를 출력하고, 두 번째 if도 85 >= 70이 참이라 C를 출력합니다. 둘 중 하나만 실행되게 하려면 두 번째를 elif로 바꿔야 합니다. else는 바로 위의 if(x >= 70)에만 붙습니다."
    commonMistakes:
      - "첫 조건이 참이면 나머지를 건너뛴다고 생각해 B만 적음"
      - "else가 두 if 모두에 붙는다고 생각함"
    language: python
    verification: run
  - id: ex-day13-predict-c
    title: 조건 순서가 잘못된 사다리 예측하기
    kind: predict
    objective: 넓은 조건을 먼저 검사하면 좁은 조건에 도달하지 못한다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int score = 95;
          if (score >= 70) {
              printf("C\n");
          } else if (score >= 90) {
              printf("A\n");
          } else {
              printf("F\n");
          }
          return 0;
      }
    answer: "C"
    hint: "사다리는 위에서부터 검사하고, 처음 참인 곳 하나만 실행합니다."
    explanation: "95 >= 70이 먼저 참이 되어 C를 출력하고 끝납니다. 90 이상 조건은 70 이상에 포함되므로 절대 실행될 수 없는 죽은 코드가 되었습니다. '>='로 등급을 나눌 때는 높은 기준부터 검사합니다."
    commonMistakes:
      - "가장 알맞은 조건을 골라 A라고 적음"
      - "C와 A를 모두 출력한다고 생각함"
    language: c
    verification: run
  - id: ex-day13-fill
    title: Rust if 표현식 채우기
    kind: fill
    objective: if 표현식의 else 갈래를 채워 값을 고른다.
    prompt: "빈칸을 채워 '7은 홀수'가 출력되게 하세요."
    starter: |-
      fn main() {
          let n = 7;
          let kind = if n % 2 == 0 { "짝수" } _____ { "홀수" };
          println!("{n}은 {kind}");
      }
    answer: |-
      fn main() {
          let n = 7;
          let kind = if n % 2 == 0 { "짝수" } else { "홀수" };
          println!("{n}은 {kind}");
      }
    output: "7은 홀수"
    hint: "값을 돌려주는 if에는 조건이 거짓일 때의 갈래가 반드시 있어야 합니다."
    explanation: "Rust의 if는 값을 가진 표현식이라 바인딩에 바로 넣을 수 있습니다. 두 갈래는 같은 자료형(여기서는 &str)을 돌려줘야 하고, else가 없으면 거짓일 때 줄 값이 없어 컴파일 오류가 납니다."
    commonMistakes:
      - "else 없이 써서 E0317 오류(if may be missing an else clause)가 남"
      - '두 갈래의 자료형을 다르게 씀(예: "짝수"와 0)'
    language: rust
    verification: run
  - id: ex-day13-modify
    title: D 등급 추가하기
    kind: modify
    objective: 조건 사다리의 알맞은 위치에 새 구간을 끼워 넣는다.
    prompt: "60점 이상 70점 미만을 D로 판정하도록 사다리에 한 갈래를 추가하세요. 65점과 59점의 결과가 'D F'로 출력되어야 합니다."
    starter: |-
      for score in (65, 59):
          if score >= 90:
              grade = "A"
          elif score >= 80:
              grade = "B"
          elif score >= 70:
              grade = "C"
          else:
              grade = "F"
          print(grade, end=" ")
      print()
    answer: |-
      for score in (65, 59):
          if score >= 90:
              grade = "A"
          elif score >= 80:
              grade = "B"
          elif score >= 70:
              grade = "C"
          elif score >= 60:
              grade = "D"
          else:
              grade = "F"
          print(grade, end=" ")
      print()
    output: "D F"
    hint: "C 갈래와 else 사이에 넣으세요. 여기까지 왔다면 이미 70 미만이므로 score >= 60만 검사하면 됩니다."
    explanation: "사다리의 각 조건은 '앞의 조건이 모두 거짓'이라는 전제 위에 있습니다. 그래서 60 <= score < 70처럼 위쪽 경계를 다시 쓸 필요가 없습니다. 경계값 60과 59로 시험했습니다."
    commonMistakes:
      - "elif score >= 60:을 맨 위에 넣어 모든 합격 점수가 D가 됨"
      - "if로 새로 시작해 else가 엉뚱한 조건에 붙음"
    language: python
    verification: run
  - id: ex-day13-debug
    title: C 조건 안의 대입 버그 고치기
    kind: debug
    objective: 비교(==)와 대입(=)을 구별해 조건을 고친다.
    prompt: "이 코드는 'suggest parentheses around assignment used as truth value' 오류로 컴파일되지 않습니다. 비교로 고쳐서 score가 85일 때 '만점 아님'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int score = 85;
          if (score = 100) {
              printf("만점\n");
          } else {
              printf("만점 아님\n");
          }
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int score = 85;
          if (score == 100) {
              printf("만점\n");
          } else {
              printf("만점 아님\n");
          }
          return 0;
      }
    output: "만점 아님"
    hint: "=는 대입, ==는 비교입니다. 경고 없이 실행됐다면 score가 100으로 바뀌고 항상 '만점'이 나왔을 것입니다."
    explanation: "C에서 대입식 score = 100의 값은 100이고, 0이 아니므로 참입니다. 그래서 조건이 항상 참이 되고 score까지 바뀌는 이중 버그가 됩니다. Python과 Rust는 조건 자리의 대입을 문법 오류로 막습니다."
    commonMistakes:
      - "괄호를 하나 더 쳐서 경고만 없애고 버그는 그대로 둠"
      - "100 == score처럼 써야 한다고 오해함(동작은 같지만 필수는 아님)"
    language: c
    verification: run
  - id: ex-day13-independent
    title: Rust로 BMI 구분하기
    kind: independent
    objective: 실수 경계로 나뉜 구간을 조건 사다리로 판정한다.
    prompt: "BMI가 18.5 미만이면 저체중, 23 미만이면 정상, 25 미만이면 과체중, 그 이상이면 비만입니다. 17.9, 22.1, 24.0, 27.5를 판정해 '저체중 정상 과체중 비만'을 출력하세요."
    starter: |-
      fn main() {
          for bmi in [17.9, 22.1, 24.0, 27.5] {
              print!("{bmi} ");
          }
          println!();
      }
    answer: |-
      fn main() {
          for bmi in [17.9, 22.1, 24.0, 27.5] {
              let label = if bmi < 18.5 {
                  "저체중"
              } else if bmi < 23.0 {
                  "정상"
              } else if bmi < 25.0 {
                  "과체중"
              } else {
                  "비만"
              };
              print!("{label} ");
          }
          println!();
      }
    output: "저체중 정상 과체중 비만"
    hint: "'미만' 기준은 낮은 값부터 검사하면 됩니다. f64와 비교하려면 23이 아니라 23.0처럼 실수로 씁니다."
    explanation: "'미만(<)'으로 나눌 때는 가장 낮은 경계부터, '이상(>=)'으로 나눌 때는 가장 높은 경계부터 검사하면 각 갈래가 겹치지 않습니다. bmi는 f64라서 경계도 18.5, 23.0처럼 실수로 써야 합니다."
    commonMistakes:
      - "bmi < 23처럼 정수와 비교해 컴파일 오류가 남"
      - "높은 경계부터 < 로 검사해 모두 저체중이 됨"
    language: rust
    verification: run
quiz:
  - id: quiz-day13-01
    question: if-elif-else 사다리에서 여러 조건이 동시에 참이면?
    choices:
      - 참인 갈래가 모두 실행된다
      - 위에서부터 처음 참인 갈래 하나만 실행된다
      - 마지막으로 참인 갈래만 실행된다
      - 오류가 난다
    answerIndex: 1
    explanation: 사다리는 위에서부터 검사하다가 처음 참인 갈래를 실행하고 나머지는 건너뜁니다. 그래서 조건의 순서가 중요합니다.
  - id: quiz-day13-02
    question: Python의 조건식 x = "성인" if age >= 19 else "미성년"과 같은 C 코드는?
    choices:
      - 'x = age >= 19 : "성인" ? "미성년";'
      - 'x = age >= 19 ? "성인" : "미성년";'
      - 'x = if (age >= 19) "성인" else "미성년";'
      - 'x = "성인" if age >= 19 else "미성년";'
    answerIndex: 1
    explanation: 'C의 조건 연산자는 조건 ? 참일 때 값 : 거짓일 때 값입니다. Rust는 let x = if age >= 19 { "성인" } else { "미성년" };처럼 if 자체를 값으로 씁니다.'
  - id: quiz-day13-03
    question: Rust에서 let x = if ok { 1 } else { "없음" };이 컴파일되지 않는 이유는?
    choices:
      - if는 값을 돌려줄 수 없어서
      - 두 갈래가 돌려주는 값의 자료형이 달라서
      - 조건 ok가 bool이 아니라서
      - 중괄호 대신 괄호를 써야 해서
    answerIndex: 1
    explanation: 바인딩 x는 자료형이 하나로 정해져야 하므로, if의 모든 갈래가 같은 자료형을 돌려줘야 합니다. 정수와 문자열이 섞이면 E0308 오류가 납니다.
  - id: quiz-day13-04
    question: C에서 중괄호 없이 if (x > 0) a++; b++;라고 쓰면?
    choices:
      - 조건이 참일 때 a와 b가 모두 1 늘어난다
      - a++만 조건에 속하고, b++는 조건과 상관없이 항상 실행된다
      - 컴파일 오류가 난다
      - 둘 다 실행되지 않는다
    answerIndex: 1
    explanation: 중괄호가 없으면 바로 뒤의 문장 하나만 if에 속합니다. 들여쓰기는 C에게 아무 의미가 없어서 이런 실수가 생깁니다. 항상 중괄호를 쓰는 습관을 들이세요. Rust는 중괄호가 필수이고, Python은 들여쓰기가 곧 블록입니다.
  - id: quiz-day13-05
    question: 잘못된 입력을 조건 사다리의 맨 앞에서 걸러 내는 이유는?
    choices:
      - 코드가 짧아져서
      - 이후의 조건들이 올바른 값이라는 전제로 간단하게 쓰일 수 있어서
      - 컴파일러가 요구해서
      - 속도가 빨라져서
    answerIndex: 1
    explanation: "101점이나 -5점을 먼저 처리하면, 뒤의 조건은 0~100 사이라고 믿고 score >= 90처럼만 쓰면 됩니다. 이렇게 앞에서 예외를 걸러 내는 조건을 '보호 조건(guard clause)'이라고 합니다."
---

## 1. 오늘 배울 내용

지금까지의 프로그램은 위에서 아래로 **모든 줄**을 실행했습니다. 오늘부터 프로그램은 상황에 따라 **길을 고릅니다**.

1. `if`: 조건이 참일 때만 실행합니다.
2. `else`: 조건이 거짓일 때 실행합니다.
3. `elif`(Python), `else if`(C, Rust): 여러 경우를 **차례로** 검사하는 사다리를 만듭니다.
4. **조건의 순서**가 결과를 바꾸는 이유와, 독립된 `if` 여러 개와 사다리의 차이를 봅니다.
5. **중첩된 조건문**과, 잘못된 값을 먼저 걸러 내는 **보호 조건**을 씁니다.
6. 값 하나를 고르는 **조건식**을 세 언어로 씁니다.
   - Python: `A if 조건 else B`
   - C: `조건 ? A : B`
   - Rust: `if` 표현식

## 2. 왜 필요한가

현실의 규칙은 대부분 "만약 ~라면"으로 되어 있습니다.

- 90점 이상이면 A, 80점 이상이면 B, …
- 주문 금액이 5만 원 이상이면 배송비 무료, 아니면 무게에 따라 계산
- 비밀번호가 맞으면 로그인, 틀리면 다시 입력

조건문이 없으면 프로그램은 입력이 무엇이든 **같은 일**만 합니다. 조건문이 있어야 입력에 따라 다르게 반응하는 쓸모 있는 프로그램이 됩니다. 동시에 조건문은 버그가 가장 많이 숨는 곳이기도 합니다. 경계를 잘못 쓰거나(Day 12), 순서를 잘못 두거나, 한 경우를 빠뜨리기 쉽습니다.

## 3. 그림으로 이해하기

조건문은 갈림길입니다. **흐름도(flowchart)** 로 그려 봅시다.

```text
if-else                                   if-elif-else 사다리

      ┌─────────┐                              ┌────────────┐  참
      │ 조건?   │                              │ score≥90?  ├──────▶ "A" ─┐
      └──┬───┬──┘                              └─────┬──────┘              │
      참 │   │ 거짓                              거짓 │                     │
         ▼   ▼                                 ┌─────▼──────┐  참         │
    [참일 때] [거짓일 때]                       │ score≥80?  ├──────▶ "B" ─┤
         │   │                                 └─────┬──────┘              │
         └─┬─┘                                   거짓 │                     │
           ▼                                   ┌─────▼──────┐  참         │
        다음 줄                                 │ score≥70?  ├──────▶ "C" ─┤
                                               └─────┬──────┘              │
                                                 거짓 │                     │
                                                     ▼                     │
                                                    "F" ───────────────────┤
                                                                           ▼
                                                                        다음 줄
```

사다리의 두 번째 칸(`score≥80?`)에 도착했다면 이미 `score≥90`이 거짓이라는 뜻입니다. 그래서 `80 <= score < 90`이라고 다시 쓰지 않아도 됩니다. 각 칸은 **위의 모든 조건이 거짓**이라는 전제 위에 있습니다.

## 4. 천천히 풀어보기

### 4.1 세 언어의 모양

```text
Python                     C                            Rust
if score >= 90:            if (score >= 90) {           if score >= 90 {
    grade = "A"                grade = "A";                 grade = "A";
elif score >= 80:          } else if (score >= 80) {    } else if score >= 80 {
    grade = "B"                grade = "B";                 grade = "B";
else:                      } else {                     } else {
    grade = "F"                grade = "F";                 grade = "F";
                           }                            }
```

| 요소           | Python               | C                                 | Rust                  |
| -------------- | -------------------- | --------------------------------- | --------------------- |
| 조건 괄호      | 없음                 | **필수** `( )`                    | 없음(쓰면 경고)       |
| 블록           | 콜론 `:` + 들여쓰기  | 중괄호 `{ }`(한 줄이면 생략 가능) | 중괄호 `{ }` **필수** |
| 여러 경우      | `elif`               | `else if`                         | `else if`             |
| 조건 자리의 값 | 무엇이든(truthiness) | 정수(0이면 거짓)                  | `bool`만              |

### 4.2 조건의 순서

사다리는 **처음 참인 갈래 하나**만 실행합니다. 그래서 조건끼리 겹치면 순서가 결과를 정합니다.

- `>=`로 나눌 때는 **높은 기준부터**: `>= 90`, `>= 80`, `>= 70`
- `<`로 나눌 때는 **낮은 기준부터**: `< 18.5`, `< 23`, `< 25`
- **잘못된 값**(범위 밖, 빈 입력)은 **맨 앞에서** 걸러 냅니다

순서를 반대로 두면 넓은 조건이 먼저 참이 되어 좁은 조건은 **절대 실행되지 않는 죽은 코드**가 됩니다.

### 4.3 if 여러 개 vs 사다리

```text
if a: ...        ← 검사          if a: ...        ← 검사
if b: ...        ← 또 검사        elif b: ...      ← a가 거짓일 때만 검사
if c: ...        ← 또 검사        elif c: ...      ← a, b가 거짓일 때만 검사
(여러 개가 실행될 수 있음)         (최대 하나만 실행됨)
```

"해당하는 것을 모두 처리"하려면 독립된 `if`, "여러 경우 중 하나를 고르려면" 사다리를 씁니다. 실습의 첫 문제가 이 차이입니다.

### 4.4 조건식: 값 하나를 고르기

어떤 값을 넣을지만 조건에 따라 달라진다면 조건식이 간결합니다.

| 언어   | 쓰는 법                                         |
| ------ | ----------------------------------------------- |
| Python | `fee = 5000 if age < 19 else 9000`              |
| C      | `int fee = age < 19 ? 5000 : 9000;`             |
| Rust   | `let fee = if age < 19 { 5000 } else { 9000 };` |

Rust에는 따로 조건 연산자가 없습니다. **`if` 자체가 값을 돌려주는 표현식**이기 때문입니다. 블록의 마지막 줄에 세미콜론이 없으면 그 값이 블록의 값이 됩니다(Day 22). 조건식을 여러 겹 겹치면 읽기 어려워지니, 갈래가 셋 이상이면 사다리를 쓰세요.

## 5. C로 구현하기

여러 점수를 한 번에 시험하려고 배열과 `for` 반복문을 미리 썼습니다(Day 16, Day 26). 지금은 "점수 여섯 개로 같은 판정을 반복한다"고 읽으면 됩니다.

```c
// 파일: grade.c
#include <stdio.h>

int main(void) {
    int scores[] = {95, 90, 89, 72, 40, 101};      // 여러 점수로 시험(배열은 Day 26)
    for (int i = 0; i < 6; i++) {                  // 반복문은 Day 16
        int score = scores[i];
        const char *result;
        if (score < 0 || score > 100) {
            result = "잘못된 점수";
        } else if (score >= 90) {
            result = "A";
        } else if (score >= 80) {
            result = "B";
        } else if (score >= 70) {
            result = "C";
        } else {
            result = "F";
        }
        printf("%3d점 → %s\n", score, result);
    }

    int temperature = 31;
    if (temperature >= 30) {
        printf("덥다\n");
        if (temperature >= 35) {
            printf("폭염 경보\n");
        }
    } else {
        printf("괜찮다\n");
    }

    int age = 15;
    int fee = age < 19 ? 5000 : 9000;              // 조건 연산자
    printf("요금 %d원\n", fee);

    int n = 7;
    if (n % 2) {                                   // 0이 아니면 참
        printf("%d은 홀수\n", n);
    }
    return 0;
}
```

실행 결과:

```text
 95점 → A
 90점 → A
 89점 → B
 72점 → C
 40점 → F
101점 → 잘못된 점수
덥다
요금 5000원
7은 홀수
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `if (score < 0 \|\| score > 100)` | 보호 조건입니다. 범위 밖의 값을 먼저 걸러 내면 뒤의 조건은 0~100이라고 믿고 쓸 수 있습니다.             |
| `} else if (score >= 90) {`       | C에는 `elif`가 없습니다. `else` 뒤에 또 다른 `if`를 붙인 것입니다.                                      |
| `const char *result;`             | 갈래마다 다른 문자열을 넣을 변수입니다. 모든 갈래가 값을 넣으므로 `printf`에서 안전하게 쓸 수 있습니다. |
| `90`이 `A`, `89`가 `B`            | 경계값 90과 그 바로 아래 89를 시험했습니다(Day 12).                                                     |
| 중첩된 `if (temperature >= 35)`   | 31도는 바깥 조건만 참이라 "덥다"만 출력됩니다. 안쪽 `if`는 바깥이 참일 때만 검사됩니다.                 |
| `age < 19 ? 5000 : 9000`          | 조건 연산자입니다. 결과가 **값**이라서 변수 초기화에 바로 쓸 수 있습니다.                               |
| `if (n % 2)`                      | 나머지가 1이면 0이 아니라서 참입니다. 뜻을 분명히 하려면 `if (n % 2 != 0)`이 더 좋습니다.               |

## 6. Python으로 구현하기

Python은 괄호 대신 **콜론과 들여쓰기**로 블록을 나타냅니다. 같은 블록의 줄은 들여쓰기가 똑같아야 합니다(보통 공백 4칸).

```python
# 파일: grade.py
for score in (95, 90, 89, 72, 40, 101):          # 여러 점수로 시험(반복문은 Day 16)
    if score < 0 or score > 100:                  # 잘못된 값부터 걸러 낸다
        result = "잘못된 점수"
    elif score >= 90:
        result = "A"
    elif score >= 80:                             # 여기 왔다면 이미 90 미만
        result = "B"
    elif score >= 70:
        result = "C"
    else:
        result = "F"
    print(f"{score:>3}점 → {result}")

temperature = 31
if temperature >= 30:
    print("덥다")
    if temperature >= 35:                         # 중첩된 if
        print("폭염 경보")
else:
    print("괜찮다")

age = 15
fee = 5000 if age < 19 else 9000                  # 조건식: 값 하나를 고른다
print(f"요금 {fee}원")

name = ""
if not name:                                      # 빈 문자열은 거짓
    print("이름이 비었습니다")
```

실행 결과:

```text
 95점 → A
 90점 → A
 89점 → B
 72점 → C
 40점 → F
101점 → 잘못된 점수
덥다
요금 5000원
이름이 비었습니다
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `if score < 0 or score > 100:`            | 콜론으로 조건이 끝나고, 다음 줄부터 들여쓴 부분이 블록입니다.                                                 |
| `elif score >= 80:`                       | `else if`의 줄임말입니다.                                                                                     |
| 들여쓰기 두 단계(`if temperature >= 35:`) | 들여쓰기 깊이가 곧 중첩 단계입니다. 안쪽 `if`는 바깥 `if` 블록 안에 있습니다.                                 |
| `else:`의 들여쓰기                        | 바깥 `if`와 같은 깊이라서 바깥 `if`에 짝지어집니다. 들여쓰기를 한 단계 더 넣으면 안쪽 `if`의 `else`가 됩니다. |
| `5000 if age < 19 else 9000`              | 조건식입니다. 순서가 "값 if 조건 else 다른 값"이라 영어 문장처럼 읽힙니다.                                    |
| `if not name:`                            | 빈 문자열은 거짓이라 `not name`이 참입니다(Day 8의 truthiness). `if name == "":`과 같습니다.                  |

## 7. Rust로 구현하기

Rust의 `if`는 **표현식**이라 값을 돌려줄 수 있습니다. 그래서 C처럼 변수를 먼저 만들어 두고 갈래마다 대입하는 대신, `let result = if ... { } else { };`처럼 한 번에 씁니다. 이렇게 하면 `result`를 `mut`로 만들 필요도 없고, 값을 넣지 않은 갈래가 생길 수도 없습니다.

```rust
// 파일: grade.rs
fn main() {
    for score in [95, 90, 89, 72, 40, 101] {        // 여러 점수로 시험(반복문은 Day 16)
        let result = if !(0..=100).contains(&score) {
            "잘못된 점수"
        } else if score >= 90 {
            "A"
        } else if score >= 80 {
            "B"
        } else if score >= 70 {
            "C"
        } else {
            "F"
        };                                          // if 전체가 값 하나 → 세미콜론
        println!("{score:>3}점 → {result}");
    }

    let temperature = 31;
    if temperature >= 30 {
        println!("덥다");
        if temperature >= 35 {
            println!("폭염 경보");
        }
    } else {
        println!("괜찮다");
    }

    let age = 15;
    let fee = if age < 19 { 5000 } else { 9000 };   // if가 값을 돌려준다
    println!("요금 {fee}원");

    let n = 7;
    if n % 2 != 0 {                                 // 조건은 반드시 bool
        println!("{n}은 홀수");
    }
}
```

실행 결과:

```text
 95점 → A
 90점 → A
 89점 → B
 72점 → C
 40점 → F
101점 → 잘못된 점수
덥다
요금 5000원
7은 홀수
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `let result = if ... { "A" } else if ...` | 사다리 전체가 값 하나를 돌려줍니다. 각 갈래의 마지막 값(`"A"`, `"B"`)에 세미콜론이 없다는 점에 주목하세요. |
| `!(0..=100).contains(&score)`             | "0 이상 100 이하가 아니면"입니다. Day 12의 닫힌 범위를 썼습니다.                                           |
| `};`                                      | `let` 문장이 끝나므로 전체 `if` 뒤에 세미콜론을 붙입니다.                                                  |
| `if temperature >= 30 { ... }`            | 조건에 괄호를 쓰지 않습니다. `if (temperature >= 30)`이라고 쓰면 "불필요한 괄호" 경고가 납니다.            |
| `if age < 19 { 5000 } else { 9000 }`      | C의 조건 연산자 역할입니다.                                                                                |
| `if n % 2 != 0`                           | 조건은 반드시 `bool`이어야 해서 `if n % 2`는 컴파일 오류입니다.                                            |

## 8. 실행 추적

점수 89로 사다리를 따라가며 **검사한 조건**과 **건너뛴 조건**을 구분해 봅니다.

| 단계 | 조건                       | 89일 때 | 한 일                        |
| ---: | -------------------------- | ------- | ---------------------------- |
|    1 | `score < 0 or score > 100` | 거짓    | 다음 칸으로                  |
|    2 | `score >= 90`              | 거짓    | 다음 칸으로                  |
|    3 | `score >= 80`              | **참**  | `result = "B"` 실행          |
|    4 | `score >= 70`              | —       | **검사하지 않음**(이미 끝남) |
|    5 | `else`                     | —       | 실행하지 않음                |

점수 101은 1단계에서 참이 되어 나머지 조건을 하나도 검사하지 않습니다. 보호 조건이 없었다면 2단계 `101 >= 90`이 참이 되어 "A"를 받았을 것입니다.

## 9. 다른 예제로 다시 이해하기

택배비 규칙을 코드로 옮겨 봅시다. 규칙은 다음과 같습니다.

1. 주문 금액이 50,000원 이상이면 **무료**
2. 그렇지 않으면 무게로 기본요금을 정합니다.
   - 2kg 이하: 3,000원
   - 5kg 이하: 4,000원
   - 5kg 초과: 4,000원에 초과 1kg마다 1,000원 추가(1kg이 안 되는 부분도 1kg으로 올림)
3. 제주 지역이면 **3,000원 추가**

1번은 나머지를 모두 무시하는 규칙이라 **맨 앞**에 둡니다. 2번은 무게 구간 사다리, 3번은 2번과 **독립된** 추가 규칙이라 별도의 `if`입니다. 같은 계산을 여러 주문에 쓰려고 함수로 묶었습니다(함수는 Day 20~23).

```python
# 파일: shipping.py
import math


def shipping_fee(weight_kg, order_price, jeju):
    if order_price >= 50000:          # 규칙 1: 무료면 나머지는 볼 필요 없음
        return 0
    if weight_kg <= 2:                # 규칙 2: 무게 구간 사다리
        fee = 3000
    elif weight_kg <= 5:
        fee = 4000
    else:
        fee = 4000 + 1000 * math.ceil(weight_kg - 5)
    if jeju:                          # 규칙 3: 독립된 추가 요금
        fee += 3000
    return fee


print(shipping_fee(1.5, 20000, False))
print(shipping_fee(2.0, 20000, False))
print(shipping_fee(2.1, 20000, False))
print(shipping_fee(7.2, 30000, True))
print(shipping_fee(10, 60000, True))
```

실행 결과:

```text
3000
3000
4000
10000
0
```

7.2kg 제주 주문은 초과 2.2kg을 3kg으로 올려 4000 + 3000 = 7000원, 제주 추가 3000원으로 10000원입니다. 경계값 2.0(3000원)과 2.1(4000원)에서 요금이 바뀌는 것도 확인했습니다. `return`은 함수를 **즉시 끝내고** 값을 돌려주므로, 무료 조건 뒤의 코드는 실행되지 않습니다.

Rust로 같은 규칙을 쓰면 `if`가 값을 돌려준다는 점을 살릴 수 있습니다.

```rust
// 파일: shipping.rs
fn shipping_fee(weight_kg: f64, order_price: u32, jeju: bool) -> u32 {
    if order_price >= 50_000 {
        return 0;
    }
    let base = if weight_kg <= 2.0 {
        3000
    } else if weight_kg <= 5.0 {
        4000
    } else {
        4000 + 1000 * (weight_kg - 5.0).ceil() as u32
    };
    let island = if jeju { 3000 } else { 0 };
    base + island
}

fn main() {
    println!("{}", shipping_fee(1.5, 20_000, false));
    println!("{}", shipping_fee(2.1, 20_000, false));
    println!("{}", shipping_fee(7.2, 30_000, true));
    println!("{}", shipping_fee(10.0, 60_000, true));
}
```

실행 결과:

```text
3000
4000
10000
0
```

`(weight_kg - 5.0).ceil() as u32`는 올림한 실수를 정수로 바꿉니다(Day 6). 마지막 줄 `base + island`에 세미콜론이 없어서 그 값이 함수의 결과가 됩니다.

## 10. 조건문 모양 한눈에 보기

| 하고 싶은 일          | Python                | C                     | Rust                    |
| --------------------- | --------------------- | --------------------- | ----------------------- |
| 참일 때만             | `if c:`               | `if (c) { }`          | `if c { }`              |
| 둘 중 하나            | `if c: ... else: ...` | `if (c) { } else { }` | `if c { } else { }`     |
| 여러 경우 중 하나     | `if / elif / else`    | `if / else if / else` | `if / else if / else`   |
| 값 고르기             | `a if c else b`       | `c ? a : b`           | `if c { a } else { b }` |
| 아무것도 안 하는 갈래 | `pass`                | `{ }` 또는 `;`        | `{ }`                   |

Python에서 블록이 비면 문법 오류라서, "나중에 채울 자리"에는 아무 일도 하지 않는 `pass`를 씁니다.

## 11. 세 언어 비교

| 관점               | Python                 | C                             | Rust                                |
| ------------------ | ---------------------- | ----------------------------- | ----------------------------------- |
| 블록 표시          | 들여쓰기               | 중괄호(한 문장이면 생략 가능) | 중괄호 필수                         |
| 조건 괄호          | 없음                   | 필수                          | 없음                                |
| 조건의 자료형      | 아무 값(truthiness)    | 정수(0이면 거짓)              | `bool`만                            |
| `if`가 값을 가지나 | 아니요(조건식은 따로)  | 아니요(`?:`는 따로)           | 예(`if` 자체가 표현식)              |
| 조건 안에서 대입   | 문법 오류(`:=`는 예외) | 가능(경고)                    | 불가능                              |
| 흔한 함정          | 들여쓰기 어긋남        | 중괄호 생략, `=`와 `==`       | 갈래마다 자료형이 다름, `else` 빠짐 |

## 12. 자주 하는 실수

### 실수 1: 중괄호 없이 여러 줄을 쓴다 (C)

```c
// 파일: no_braces.c (컴파일 오류: this 'if' clause does not guard)
#include <stdio.h>

int main(void) {
    int stock = 0;
    if (stock == 0)
        printf("품절\n");
        printf("다음 입고를 기다리세요\n");
    return 0;
}
```

들여쓰기로는 두 줄 모두 `if`에 속한 것처럼 보이지만, 실제로는 첫 줄만 속합니다. gcc가 "이 `if`는 들여쓰기처럼 동작하지 않는다"고 경고합니다. **항상 중괄호를 쓰세요.**

### 실수 2: 조건 뒤에 세미콜론을 붙인다 (C)

```c
// 파일: if_semicolon.c (컴파일 오류: suggest braces around empty body)
#include <stdio.h>

int main(void) {
    int x = 3;
    if (x > 10);
    {
        printf("큰 수\n");
    }
    return 0;
}
```

`if (x > 10);`의 세미콜론이 "아무것도 안 하는 문장"이 되어 `if`가 거기서 끝납니다. 아래 블록은 **항상** 실행됩니다.

### 실수 3: 들여쓰기가 맞지 않는다 (Python)

```python
# 파일: bad_indent.py (컴파일 오류: IndentationError)
score = 95
if score >= 90:
    print("A")
     print("잘했어요")
```

같은 블록의 줄은 들여쓰기가 **정확히** 같아야 합니다. 공백과 탭을 섞어도 이 오류가 납니다.

### 실수 4: 값을 돌려주는 if에 else가 없다 (Rust)

```rust
// 파일: missing_else.rs (컴파일 오류: E0317)
fn main() {
    let score = 95;
    let grade = if score >= 90 { "A" };
    println!("{grade}");
}
```

조건이 거짓이면 `grade`에 넣을 값이 없으니 `else`가 필요합니다.

### 실수 5: 조건 순서를 거꾸로 둔다

실습의 두 번째 문제처럼 `>= 70`을 `>= 90`보다 먼저 검사하면 A가 나올 수 없습니다. 사다리를 쓴 뒤에는 **각 갈래에 실제로 도달할 수 있는 값이 있는지** 확인하세요.

## 13. Q&A

**Q. 중첩된 if와 `and`는 어떻게 골라 쓰나요?**

A. `if a: if b: ...`와 `if a and b: ...`는 결과가 같습니다. 안쪽에 `else`가 필요하거나, 바깥 조건이 참일 때 공통으로 할 일이 있으면 중첩을, 아니면 `and`로 합치는 편이 읽기 쉽습니다. 중첩이 세 단계를 넘어가면 보호 조건(`return`, `continue`)으로 일찍 빠져나가는 방식을 고려하세요.

**Q. Python에는 `switch`가 없나요?**

A. Python 3.10부터 `match` 문이 생겼습니다. 값의 모양에 따라 갈래를 나누는 문법으로, Rust의 `match`와 비슷합니다. C에는 `switch`가 있습니다. 둘 다 Day 15에서 Rust의 `match`와 함께 비교합니다.

**Q. `else`는 꼭 써야 하나요?**

A. 아닙니다. 거짓일 때 할 일이 없으면 생략합니다. 다만 사다리에서 `else`를 빼면 "어느 갈래에도 해당하지 않는" 값이 조용히 무시될 수 있습니다. 모든 경우를 다뤘는지 확인하는 의미로 `else`에서 "예상하지 못한 값"을 처리하는 습관이 좋습니다.

**Q. 조건이 복잡할 때 읽기 쉽게 쓰는 방법은요?**

A. Day 8에서처럼 조건의 조각에 이름을 붙이세요. `if is_member and total >= 10000 and not is_blocked:`보다 `eligible = ...`로 나눠 두면 조건의 **뜻**이 드러나고, 중간값을 출력해 어느 조건이 틀렸는지 찾기도 쉽습니다.

## 14. 핵심 요약

- `if`는 조건이 참일 때만, `else`는 거짓일 때 실행합니다. 여러 경우는 `elif`(Python), `else if`(C, Rust) 사다리로 나눕니다.
- 사다리는 **위에서부터 처음 참인 갈래 하나**만 실행합니다. `>=` 기준은 높은 값부터, `<` 기준은 낮은 값부터, 잘못된 값은 맨 앞에서 검사합니다.
- 독립된 `if` 여러 개는 각각 검사되어 여러 갈래가 실행될 수 있습니다.
- 값 하나를 고를 때는 조건식: Python `a if c else b`, C `c ? a : b`, Rust `if c { a } else { b }`. Rust의 `if`는 값을 가진 표현식이라 모든 갈래의 자료형이 같아야 합니다.
- 블록 표시: Python 들여쓰기, C 중괄호(생략하지 말 것), Rust 중괄호 필수.
- 경계값과 범위 밖의 값으로 모든 갈래를 시험합니다.

## 15. 도전 문제

1. **(Python)** 연도를 입력받아 윤년이면 "윤년", 아니면 "평년"을 출력하세요(Day 8의 식). 1900, 2000, 2024, 2026으로 시험하세요.
2. **(C)** 세 정수를 입력받아 가장 큰 값을 출력하세요. `if`만 쓰는 방법과 조건 연산자만 쓰는 방법 두 가지로 해 보세요.
3. **(Rust)** 시각(0~23)을 받아 "새벽"(0~5), "오전"(6~11), "오후"(12~17), "저녁"(18~23)을 돌려주는 `if` 표현식을 만들고, 범위 밖이면 "잘못된 시각"을 돌려주세요.
4. **(세 언어)** 놀이공원 요금표(어린이 5,000원, 청소년 7,000원, 성인 10,000원, 65세 이상 무료, 월요일은 모두 20% 할인)를 조건문으로 옮기고, 경계 나이마다 시험해 보세요.
