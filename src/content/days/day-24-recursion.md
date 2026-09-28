---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-24-recursion
courseId: crp-92
phaseId: phase-02
dayNumber: 24
date: "2026-10-24"
title: 재귀 — 자기 자신을 부르는 함수와 종료 조건
summary: 함수가 더 작은 문제로 자기 자신을 부르는 재귀를 배웁니다. 더 쪼개지 않고 바로 답하는 기저 사례와 문제를 줄여 다시 부르는 재귀 사례를 나누는 방법, 호출할 때마다 새 칸이 쌓이는 호출 스택을 들여쓰기 추적으로 확인하고, 팩토리얼·자릿수 합·최대공약수·빠른 거듭제곱·문자열 뒤집기·목록 합계를 세 언어로 구현합니다. 호출이 두 갈래로 퍼지는 피보나치가 얼마나 많이 호출되는지 세어 보고 기억하기(메모이제이션)로 고치며, 기저 사례를 빠뜨렸을 때의 스택 넘침과 하노이 탑까지 다룹니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-23-scope]
learningObjectives:
  - 재귀 함수를 기저 사례와 재귀 사례로 나눠 설계하고, 매 호출마다 문제가 기저 사례 쪽으로 줄어드는지 확인한다.
  - 호출 스택에 칸이 쌓이고 풀리는 순서를 들여쓰기 추적으로 설명한다.
  - 팩토리얼, 자릿수 합, 최대공약수, 거듭제곱, 문자열 뒤집기, 목록 합계를 재귀로 구현한다.
  - 피보나치 재귀의 호출 수가 폭발하는 이유를 설명하고 메모이제이션으로 줄인다.
  - 기저 사례가 없거나 도달할 수 없을 때 생기는 스택 넘침(RecursionError)을 찾아 고친다.
concepts:
  [
    recursion,
    base case,
    recursive case,
    call stack,
    stack frame,
    stack overflow,
    memoization,
    divide and conquer,
    tower of hanoi,
    fast exponentiation,
  ]
runnerMode: python
playgroundSource: |
  # 파일: recursion.py — 기저 사례를 바꾸거나 지워 보세요.
  def countdown(n):
      if n == 0:
          print("발사!")
          return
      print(n, end=" ")
      countdown(n - 1)

  countdown(5)

  def fib(n):
      return n if n < 2 else fib(n - 1) + fib(n - 2)
  print([fib(i) for i in range(10)])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day24-predict-c
    title: 둘씩 줄어드는 재귀 예측하기
    kind: predict
    objective: 재귀 호출이 쌓였다가 돌아오며 값을 더하는 과정을 추적한다.
    prompt: 출력되는 값을 적으세요.
    starter: |-
      #include <stdio.h>

      int f(int n) {
          if (n == 0) {
              return 0;
          }
          return n + f(n - 2);
      }

      int main(void) {
          printf("%d\n", f(6));
          return 0;
      }
    answer: "12"
    hint: "f(6) = 6 + f(4), f(4) = 4 + f(2), f(2) = 2 + f(0), f(0) = 0입니다."
    explanation: "호출은 6 → 4 → 2 → 0으로 내려가고, 0에서 기저 사례를 만나 돌아오며 2, 6, 12가 됩니다. 이 함수는 짝수에서만 0에 도착합니다. 홀수를 넣으면 0을 건너뛰어 끝나지 않는데, 그것이 실습의 디버그 문제입니다."
    commonMistakes:
      - "f(6)을 6 + 5 + 4 + …로 계산함"
      - "기저 사례의 0을 빼먹고 계산함"
    language: c
    verification: run
  - id: ex-day24-predict-py
    title: 재귀 전후의 출력 순서 예측하기
    kind: predict
    objective: 재귀 호출 앞의 코드는 내려가며, 뒤의 코드는 돌아오며 실행된다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def show(n):
          if n == 0:
              return
          print(n, end=" ")
          show(n - 1)
          print(n, end=" ")


      show(3)
      print()
    answer: "3 2 1 1 2 3"
    hint: "첫 print는 호출이 쌓이는 동안(3, 2, 1), 두 번째 print는 호출이 끝나고 돌아오는 동안(1, 2, 3) 실행됩니다."
    explanation: "show(3)은 3을 출력하고 show(2)를 부른 뒤, show(2)가 완전히 끝나야 두 번째 print(3)을 합니다. 가장 나중에 부른 show(1)이 가장 먼저 끝나므로 돌아오는 순서는 거꾸로입니다. 호출 스택은 나중에 들어간 것이 먼저 나오는(LIFO) 구조입니다(Day 57)."
    commonMistakes:
      - "3 2 1 3 2 1로 적음"
      - "두 번째 print가 실행되지 않는다고 생각함"
    language: python
    verification: run
  - id: ex-day24-fill
    title: 팩토리얼의 기저 사례 채우기
    kind: fill
    objective: 재귀가 끝나는 조건을 알맞게 쓴다.
    prompt: "빈칸을 채워 factorial(5)가 120을 돌려주게 하세요. 0!과 1!은 1입니다."
    starter: |-
      fn factorial(n: u64) -> u64 {
          if n _____ 1 {
              return 1;
          }
          n * factorial(n - 1)
      }

      fn main() {
          println!("{}", factorial(5));
      }
    answer: |-
      fn factorial(n: u64) -> u64 {
          if n <= 1 {
              return 1;
          }
          n * factorial(n - 1)
      }

      fn main() {
          println!("{}", factorial(5));
      }
    output: "120"
    hint: "n이 1 이하이면 더 쪼개지 않고 1을 돌려줍니다. 0!도 1이라는 것을 생각하세요."
    explanation: "== 1로 쓰면 factorial(0)이 0 - 1을 계산하다 u64 넘침으로 멈춥니다. <= 1로 쓰면 0과 1을 모두 기저 사례로 처리합니다. 기저 사례는 '가장 작은 입력'들을 빠짐없이 포함해야 합니다."
    commonMistakes:
      - "== 1로 써서 factorial(0)이 실행 중 오류가 남"
      - "기저 사례에서 0을 돌려줘 모든 결과가 0이 됨"
    language: rust
    verification: run
  - id: ex-day24-modify
    title: 재귀 합계를 재귀 최댓값으로 바꾸기
    kind: modify
    objective: "'첫 값과 나머지에 대한 재귀 결과'를 합치는 방식을 바꿔 다른 문제를 푼다."
    prompt: "목록의 합을 구하는 재귀 함수를 목록의 최댓값을 구하는 biggest(xs)로 바꿔 9를 출력하세요. 목록은 비어 있지 않다고 가정합니다."
    starter: |-
      def total(xs):
          if not xs:
              return 0
          return xs[0] + total(xs[1:])


      print(total([3, 9, 4, 1]))
    answer: |-
      def biggest(xs):
          if len(xs) == 1:
              return xs[0]
          rest = biggest(xs[1:])
          return xs[0] if xs[0] > rest else rest


      print(biggest([3, 9, 4, 1]))
    output: "9"
    hint: "값이 하나뿐이면 그것이 최댓값입니다(기저 사례). 아니면 '첫 값'과 '나머지의 최댓값' 중 큰 것을 돌려줍니다."
    explanation: "합계는 '첫 값 + 나머지의 합', 최댓값은 '첫 값과 나머지의 최댓값 중 큰 것'입니다. 빈 목록의 최댓값은 정할 수 없으므로 기저 사례를 '길이 1'로 바꿨습니다. xs[1:]은 첫 값을 뺀 새 목록입니다(Day 27)."
    commonMistakes:
      - "빈 목록일 때 0을 돌려줘 음수만 있는 목록에서 틀림"
      - "biggest(xs[1:])를 두 번 불러 호출 수가 폭발함"
    language: python
    verification: run
  - id: ex-day24-debug
    title: 기저 사례를 건너뛰는 재귀 고치기
    kind: debug
    objective: 재귀가 기저 사례에 반드시 도달하는지 확인하고 조건을 고친다.
    prompt: "half_sum(5)는 5 + 3 + 1 = 9여야 하는데, 이 코드는 끝나지 않고 멈춥니다(스택 넘침). 기저 사례를 고쳐 9가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int half_sum(int n) {
          if (n == 0) {
              return 0;
          }
          return n + half_sum(n - 2);
      }

      int main(void) {
          printf("%d\n", half_sum(5));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int half_sum(int n) {
          if (n <= 0) {
              return 0;
          }
          return n + half_sum(n - 2);
      }

      int main(void) {
          printf("%d\n", half_sum(5));
          return 0;
      }
    output: "9"
    hint: "5 → 3 → 1 → -1 → -3 …으로 내려가면서 0을 건너뜁니다."
    explanation: "기저 사례가 '정확히 0'이라 홀수에서 시작하면 절대 도달하지 못하고, 호출이 끝없이 쌓이다 스택이 넘쳐 프로그램이 죽습니다. 기저 사례는 '작아진 모든 경우'를 받도록 <= 0처럼 넓게 쓰는 것이 안전합니다. Day 17의 while 종료 조건과 같은 원리입니다."
    commonMistakes:
      - "half_sum(n - 1)로 바꿔 결과가 15가 됨"
      - "if (n == 1) return 1;만 추가해 짝수에서 여전히 문제가 남는지 확인하지 않음"
    language: c
    verification: run
  - id: ex-day24-independent
    title: Rust로 자릿수 세기
    kind: independent
    objective: 정수를 10으로 나누며 줄어드는 재귀를 만든다.
    prompt: "자연수의 자릿수를 재귀로 세는 digits(n: u64) -> u32를 만들어 digits(7), digits(12345), digits(1_000_000)을 '1 5 7'로 출력하세요."
    starter: |-
      fn main() {
          println!("? ? ?");
      }
    answer: |-
      fn digits(n: u64) -> u32 {
          if n < 10 {
              1
          } else {
              1 + digits(n / 10)
          }
      }

      fn main() {
          println!("{} {} {}", digits(7), digits(12345), digits(1_000_000));
      }
    output: "1 5 7"
    hint: "한 자리 수(10 미만)는 1자리입니다. 아니면 끝자리 하나를 떼어 낸 수(n / 10)의 자릿수에 1을 더합니다."
    explanation: "12345 → 1234 → 123 → 12 → 1에서 멈추고, 돌아오며 1씩 더해 5가 됩니다. n < 10을 기저 사례로 두면 0도 1자리로 셉니다. Day 17의 while 자릿수 세기와 같은 계산을 재귀로 표현한 것입니다."
    commonMistakes:
      - "기저 사례를 n == 0으로 두고 0을 돌려줘 digits(0)이 0이 됨"
      - "n % 10을 넘겨 끝자리만 남기는 실수"
    language: rust
    verification: run
quiz:
  - id: quiz-day24-01
    question: 재귀 함수에 반드시 있어야 하는 두 부분은?
    choices:
      - 반복문과 break
      - 바로 답하는 기저 사례와, 더 작은 문제로 자기 자신을 부르는 재귀 사례
      - 전역 변수와 static 변수
      - return과 print
    answerIndex: 1
    explanation: 기저 사례가 없으면 끝나지 않고, 재귀 사례가 문제를 줄이지 않으면 기저 사례에 도달하지 못합니다. '매 호출마다 기저 사례에 가까워지는가'를 꼭 확인하세요.
  - id: quiz-day24-02
    question: factorial(4)를 부르면 호출 스택에 동시에 쌓이는 factorial 칸은 최대 몇 개인가요? (기저 사례 n <= 1)
    choices: ["1개", "3개", "4개", "24개"]
    answerIndex: 2
    explanation: factorial(4) → (3) → (2) → (1)까지 4개가 쌓인 뒤, (1)이 1을 돌려주면서부터 하나씩 풀립니다. 재귀의 깊이만큼 메모리를 쓰므로, 깊이가 너무 크면 스택이 넘칩니다.
  - id: quiz-day24-03
    question: 단순 재귀 fib(n)이 느린 이유는?
    choices:
      - 덧셈이 느려서
      - 같은 fib(k)를 여러 번 다시 계산해 호출 수가 거의 2배씩 늘어나서
      - 재귀는 원래 반복보다 항상 100배 느려서
      - 정수가 넘쳐서
    answerIndex: 1
    explanation: fib(20)만 해도 21,891번 호출됩니다. 한 번 구한 값을 기억해 두면(메모이제이션) 각 fib(k)를 한 번씩만 계산해 호출이 n에 비례하게 줄어듭니다. 이 생각이 Day 79의 동적 계획법으로 이어집니다.
  - id: quiz-day24-04
    question: Python에서 재귀가 1000번 정도 깊어지면 생기는 오류는?
    choices:
      ["IndexError", "RecursionError", "ZeroDivisionError", "SyntaxError"]
    answerIndex: 1
    explanation: Python은 호출 스택이 넘쳐 프로그램이 죽기 전에 기본 한도(약 1000)에서 RecursionError를 냅니다. C와 Rust는 이런 한도가 없어 스택 메모리가 넘치면 프로그램이 바로 죽습니다. 깊은 반복은 재귀 대신 반복문으로 씁니다.
  - id: quiz-day24-05
    question: 빠른 거듭제곱 power(x, n)이 n번 곱하는 방법보다 빠른 이유는?
    choices:
      - 곱셈을 하지 않아서
      - n을 매번 반으로 줄여 호출 깊이가 log₂ n 정도이기 때문에
      - 결과를 미리 저장해 두어서
      - 컴파일러가 대신 계산해서
    answerIndex: 1
    explanation: xⁿ = (x^(n/2))²을 이용하면 n = 1024도 약 10번의 호출로 끝납니다. 문제를 반으로 나누는 이 전략(분할 정복)은 이진 탐색과 병합 정렬(Day 72, 74)에서 다시 만납니다.
---

## 1. 오늘 배울 내용

지금까지 함수는 다른 함수를 불렀습니다. 오늘은 함수가 **자기 자신**을 부르는 **재귀(recursion)** 를 배웁니다. 반복문 없이도 반복을 표현하는 방법이고, 나중에 배울 트리 탐색·정렬·백트래킹(Day 64~80)의 기본 도구입니다.

1. 재귀 함수의 두 부분을 구별합니다.
   - **기저 사례(base case)**: 더 쪼개지 않고 바로 답합니다.
   - **재귀 사례(recursive case)**: 더 작은 문제로 자기 자신을 부릅니다.
2. 호출할 때마다 새 칸이 쌓이는 **호출 스택**을 들여쓰기 추적으로 봅니다.
3. 여러 문제를 재귀로 풉니다.
   - 팩토리얼, 자릿수 합, 최대공약수
   - 빠른 거듭제곱
   - 문자열 뒤집기, 목록 합계
4. 호출이 두 갈래로 퍼지는 **피보나치**의 호출 수를 세고, **메모이제이션**으로 줄입니다.
5. 기저 사례를 빠뜨렸을 때의 **스택 넘침**을 확인합니다.
6. 재귀가 아니면 생각하기 어려운 **하노이 탑**을 풉니다.

## 2. 왜 필요한가

어떤 문제는 "같은 모양의 더 작은 문제"로 자연스럽게 나뉩니다.

- 5! = 5 × 4!, 그리고 4! = 4 × 3!, …
- 자릿수 합(90417) = 7 + 자릿수 합(9041)
- 폴더 크기 = 파일들의 크기 + 각 하위 폴더의 크기
- 하노이 탑 n층 옮기기 = n−1층 옮기기 + 가장 큰 원반 하나 + n−1층 옮기기

이런 문제를 반복문으로 쓰려면 "어디까지 했는지"를 직접 기억해야 하지만, 재귀는 **호출 스택이 대신 기억**해 줍니다. 특히 폴더나 트리처럼 **안에 같은 구조가 또 들어 있는** 데이터는 재귀로 쓰는 것이 가장 자연스럽습니다.

## 3. 그림으로 이해하기

`factorial(4)`는 이렇게 내려갔다가 올라옵니다.

```text
내려가기(호출이 쌓인다)                     올라오기(값이 돌아온다)

factorial(4) = 4 × factorial(3)             = 4 × 6 = 24
                   factorial(3) = 3 × factorial(2)       = 3 × 2 = 6
                                      factorial(2) = 2 × factorial(1) = 2 × 1 = 2
                                                         factorial(1) = 1  ← 기저 사례
```

**호출 스택**은 접시를 쌓는 것과 같습니다. 부를 때마다 새 접시(스택 프레임)가 위에 올라가고, 각 접시에는 그 호출만의 `n`이 적혀 있습니다. 가장 위의 호출이 끝나면 접시가 치워지고 바로 아래 호출이 이어서 실행됩니다.

```text
     ┌───────────────┐
     │ factorial(1)  │ n=1   ← 맨 위: 지금 실행 중, 1을 돌려줌
     ├───────────────┤
     │ factorial(2)  │ n=2   ← 2 × (위의 결과)를 기다림
     ├───────────────┤
     │ factorial(3)  │ n=3
     ├───────────────┤
     │ factorial(4)  │ n=4
     ├───────────────┤
     │ main          │
     └───────────────┘
```

나중에 쌓인 것이 먼저 끝나는 이 모양을 **스택(stack)** 이라고 합니다(Day 57).

## 4. 천천히 풀어보기

### 4.1 재귀 함수 설계 세 단계

1. **기저 사례**: 가장 작은 입력은 무엇이고, 그 답은? (`n <= 1`이면 1)
2. **재귀 사례**: 입력을 조금 줄인 문제의 답을 **이미 안다고 믿으면**, 지금 문제의 답을 어떻게 만들까? (`n × factorial(n − 1)`)
3. **도달 확인**: 매 호출마다 입력이 기저 사례 쪽으로 줄어드나? (`n`이 1씩 줄어 결국 1 이하)

2번이 핵심입니다. `factorial(n − 1)`이 어떻게 계산되는지 따라가지 말고 "올바른 답을 돌려준다"고 **믿고** 지금 단계만 생각하세요. 이 믿음이 맞다는 것은 수학적 귀납법과 같은 원리로 보장됩니다.

### 4.2 재귀로 쓴 여러 문제

| 문제          | 기저 사례         | 재귀 사례                          | 줄어드는 것     |
| ------------- | ----------------- | ---------------------------------- | --------------- |
| 팩토리얼 n!   | `n <= 1` → 1      | `n × fact(n − 1)`                  | n이 1씩         |
| 자릿수 합     | `n < 10` → n      | `n % 10 + sum_digits(n / 10)`      | 자릿수가 하나씩 |
| 최대공약수    | `b == 0` → a      | `gcd(b, a % b)`                    | b가 점점 작아짐 |
| 거듭제곱 xⁿ   | `n == 0` → 1      | `half = pow(x, n/2)`, `half²`(× x) | n이 반씩        |
| 문자열 뒤집기 | 길이 ≤ 1 → 그대로 | `reverse(나머지) + 첫 글자`        | 길이가 1씩      |
| 목록 합계     | 빈 목록 → 0       | `첫 값 + sum(나머지)`              | 길이가 1씩      |

### 4.3 호출이 퍼지는 재귀: 피보나치

피보나치 수는 fib(0) = 0, fib(1) = 1, fib(n) = fib(n−1) + fib(n−2)입니다. 정의를 그대로 옮기면 호출 하나가 **둘로 갈라집니다**.

```text
                  fib(4)
               /         \
          fib(3)          fib(2)
         /     \          /    \
     fib(2)  fib(1)   fib(1)  fib(0)
     /    \
 fib(1) fib(0)

fib(2)가 두 번, fib(1)이 세 번 계산된다.
```

n이 1 커질 때마다 호출 수가 약 1.6배씩 늘어서 fib(20)은 21,891번, fib(40)은 3억 번이 넘게 호출됩니다. 해결책은 **한 번 계산한 값을 기억해 두는 것(메모이제이션)** 입니다. 사전에 `fib(k)`의 답을 저장해 두면 각 k를 한 번씩만 계산합니다.

### 4.4 재귀와 반복

| 관점         | 재귀                                                   | 반복                |
| ------------ | ------------------------------------------------------ | ------------------- |
| 잘 맞는 문제 | 같은 구조가 안에 들어 있는 문제(트리, 폴더, 분할 정복) | 한 줄로 늘어선 작업 |
| 상태 기억    | 호출 스택이 기억                                       | 변수로 직접 기억    |
| 메모리       | 깊이만큼 스택 프레임 사용                              | 변수 몇 개          |
| 너무 깊으면  | 스택 넘침(Python은 RecursionError)                     | 문제없음            |

팩토리얼이나 자릿수 합처럼 **한 줄로 줄어드는** 재귀는 반복문으로 쉽게 바꿀 수 있고, 깊이가 크다면 반복이 안전합니다. 재귀는 하노이 탑이나 트리처럼 **갈라지는** 문제에서 진가를 발휘합니다.

## 5. C로 구현하기

```c
// 파일: recursion.c
#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) {                           // 기저 사례: 더 쪼개지 않고 바로 답
        return 1;
    }
    return n * factorial(n - 1);            // 재귀 사례: 더 작은 문제로
}

int sum_digits(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + sum_digits(n / 10);
}

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);      // Day 17의 반복을 재귀로
}

long long power(long long x, int n) {       // 빠른 거듭제곱: n을 반씩 줄인다
    if (n == 0) {
        return 1;
    }
    long long half = power(x, n / 2);
    return n % 2 == 0 ? half * half : half * half * x;
}

int fib_calls = 0;

int fib(int n) {
    fib_calls++;
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);         // 호출 하나가 두 개로 갈라진다
}

void trace(int n, int depth) {
    printf("%*s들어감 trace(%d)\n", depth * 2, "", n);
    if (n > 0) {
        trace(n - 1, depth + 1);
    }
    printf("%*s나옴   trace(%d)\n", depth * 2, "", n);
}

int main(void) {
    printf("5! = %lld, 20! = %lld\n", factorial(5), factorial(20));
    printf("sum_digits(90417) = %d\n", sum_digits(90417));
    printf("gcd(252, 105) = %d\n", gcd(252, 105));
    printf("2^10 = %lld, 3^13 = %lld\n", power(2, 10), power(3, 13));
    int f = fib(20);
    printf("fib(20) = %d, fib 호출 %d번\n", f, fib_calls);
    trace(2, 0);
    return 0;
}
```

실행 결과:

```text
5! = 120, 20! = 2432902008176640000
sum_digits(90417) = 21
gcd(252, 105) = 21
2^10 = 1024, 3^13 = 1594323
fib(20) = 6765, fib 호출 21891번
들어감 trace(2)
  들어감 trace(1)
    들어감 trace(0)
    나옴   trace(0)
  나옴   trace(1)
나옴   trace(2)
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `if (n <= 1) return 1;`                | 기저 사례를 **먼저** 검사합니다. 재귀 호출보다 앞에 있어야 합니다.                                                            |
| `return n * factorial(n - 1);`         | `factorial(n - 1)`이 끝나야 곱셈을 할 수 있으므로, 이 호출은 결과를 기다리며 스택에 남아 있습니다.                            |
| `long long`                            | 20!은 약 2.4 × 10¹⁸이라 `long long`이 필요합니다(Day 10).                                                                     |
| `return b == 0 ? a : gcd(b, a % b);`   | Day 17의 `while` 반복과 같은 계산입니다. 재귀 호출이 **마지막 일**이라 돌아와서 할 계산이 없습니다(꼬리 재귀).                |
| `long long half = power(x, n / 2);`    | 반만큼의 거듭제곱을 **한 번만** 구해 제곱합니다. `power(x, n/2) * power(x, n/2)`처럼 두 번 부르면 빨라지지 않습니다.          |
| `fib_calls++`                          | 전역 변수로 호출 횟수를 셌습니다(Day 23).                                                                                     |
| `int f = fib(20);` 후 `printf`         | 호출 횟수를 출력하기 전에 `fib`를 먼저 끝냈습니다. 한 `printf`에 두 값을 넣으면 인자 계산 순서가 정해져 있지 않기 때문입니다. |
| `printf("%*s...", depth * 2, "", ...)` | `%*s`에 빈 문자열을 주면 `depth * 2`칸의 공백이 됩니다. 들여쓰기로 스택의 깊이를 보여 줍니다.                                 |
| `trace` 출력                           | "들어감"은 내려가며, "나옴"은 거꾸로 올라오며 출력됩니다.                                                                     |

## 6. Python으로 구현하기

Python은 문자열 조각(`text[1:]`)과 사전을 써서 재귀를 짧게 표현할 수 있습니다. 정수가 넘치지 않아 30!도 정확히 계산됩니다.

```python
# 파일: recursion.py
import sys


def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)


def reverse(text):
    if len(text) <= 1:                      # 빈 문자열이나 한 글자는 뒤집어도 같다
        return text
    return reverse(text[1:]) + text[0]      # 나머지를 뒤집고 첫 글자를 뒤에 붙인다


def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


memo = {}


def fib_memo(n):                            # 한 번 계산한 값은 기억해 둔다
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return memo[n]


print("5! =", factorial(5), " 30! =", factorial(30))
print("sum_digits(90417) =", sum_digits(90417))
print("reverse('재귀함수') =", reverse("재귀함수"))
print("fib(20) =", fib(20), " fib_memo(90) =", fib_memo(90))
print("기본 재귀 한도:", sys.getrecursionlimit())
```

실행 결과:

```text
5! = 120  30! = 265252859812191058636308480000000
sum_digits(90417) = 21
reverse('재귀함수') = 수함귀재
fib(20) = 6765  fib_memo(90) = 2880067194370816120
기본 재귀 한도: 1000
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `if len(text) <= 1: return text`  | 빈 문자열과 한 글자 문자열을 모두 기저 사례로 받습니다.                                                                                       |
| `reverse(text[1:]) + text[0]`     | `text[1:]`은 첫 글자를 뺀 나머지입니다(Day 38). "나머지를 뒤집은 것" 뒤에 첫 글자를 붙이면 전체가 뒤집힙니다.                                 |
| `memo = {}`                       | 계산한 피보나치 값을 저장할 사전입니다(Day 67). 키는 n, 값은 fib(n)입니다.                                                                    |
| `if n not in memo: memo[n] = ...` | 아직 계산하지 않은 경우에만 재귀로 구하고 저장합니다. 이미 있으면 바로 돌려줍니다.                                                            |
| `fib_memo(90)`                    | 단순 재귀라면 수천억 년이 걸릴 계산이 순식간에 끝납니다. 각 n을 한 번만 계산하기 때문입니다.                                                  |
| `sys.getrecursionlimit()`         | Python은 재귀 깊이가 이 한도(기본 1000)를 넘으면 `RecursionError`를 냅니다. 스택이 실제로 넘쳐 프로그램이 죽기 전에 멈춰 주는 안전장치입니다. |

## 7. Rust로 구현하기

Rust는 `if` 표현식으로 기저 사례와 재귀 사례를 한 식에 쓸 수 있고, **슬라이스 패턴**으로 "첫 값과 나머지"를 깔끔하게 나눌 수 있습니다.

```rust
// 파일: recursion.rs
fn factorial(n: u64) -> u64 {
    if n <= 1 { 1 } else { n * factorial(n - 1) }
}

fn sum_digits(n: u64) -> u64 {
    if n < 10 { n } else { n % 10 + sum_digits(n / 10) }
}

fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

fn sum_slice(xs: &[i32]) -> i32 {
    match xs {
        [] => 0,                            // 기저 사례: 빈 목록
        [first, rest @ ..] => first + sum_slice(rest),   // 첫 값 + 나머지의 합
    }
}

fn count_down(n: u32) {
    if n == 0 {
        println!("발사!");
        return;
    }
    print!("{n} ");
    count_down(n - 1);
}

fn main() {
    println!("5! = {}, 20! = {}", factorial(5), factorial(20));
    println!("sum_digits(90417) = {}", sum_digits(90417));
    println!("gcd(252, 105) = {}", gcd(252, 105));
    println!("sum_slice([3, 1, 4, 1, 5]) = {}", sum_slice(&[3, 1, 4, 1, 5]));
    count_down(3);
}
```

실행 결과:

```text
5! = 120, 20! = 2432902008176640000
sum_digits(90417) = 21
gcd(252, 105) = 21
sum_slice([3, 1, 4, 1, 5]) = 14
3 2 1 발사!
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `if n <= 1 { 1 } else { n * factorial(n - 1) }`  | 함수 몸통 전체가 `if` 표현식 하나입니다(Day 22).                                                                                                     |
| `fn sum_slice(xs: &[i32]) -> i32`                | `&[i32]`는 정수 목록의 **슬라이스**(빌려 본 일부분)입니다(Day 36). 복사하지 않고 원래 목록의 일부를 가리킵니다.                                      |
| `[] => 0,`                                       | 빈 슬라이스와 맞는 패턴입니다. 기저 사례입니다.                                                                                                      |
| `[first, rest @ ..] => first + sum_slice(rest),` | 첫 값을 `first`에, 나머지를 슬라이스 `rest`에 담습니다. `rest`는 원래 목록의 뒷부분을 가리킬 뿐 새로 만들지 않아서 Python의 `xs[1:]`보다 가볍습니다. |
| `count_down`의 `return;`                         | 반환값이 없는 함수에서도 기저 사례에서 `return`으로 일찍 끝낼 수 있습니다.                                                                           |

## 8. 실행 추적

`sum_digits(90417)`의 호출이 쌓이고 풀리는 과정입니다.

| 단계 | 호출(스택 깊이)       | 하는 일                     | 돌려주는 값 |
| ---: | --------------------- | --------------------------- | ----------: |
|    1 | `sum_digits(90417)` 1 | `7 + sum_digits(9041)` 대기 |             |
|    2 | `sum_digits(9041)` 2  | `1 + sum_digits(904)` 대기  |             |
|    3 | `sum_digits(904)` 3   | `4 + sum_digits(90)` 대기   |             |
|    4 | `sum_digits(90)` 4    | `0 + sum_digits(9)` 대기    |             |
|    5 | `sum_digits(9)` 5     | 기저 사례 `9 < 10`          |           9 |
|    6 | (깊이 4로 돌아옴)     | `0 + 9`                     |           9 |
|    7 | (깊이 3)              | `4 + 9`                     |          13 |
|    8 | (깊이 2)              | `1 + 13`                    |          14 |
|    9 | (깊이 1)              | `7 + 14`                    |      **21** |

가장 깊을 때 스택에 5칸이 쌓였습니다. 자릿수만큼의 깊이라 아주 큰 수도 문제없습니다. 반면 `factorial(100000)`은 깊이가 10만이라 스택이 넘칠 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**하노이 탑.** 기둥 세 개(A, B, C)와 크기가 다른 원반 n개가 있습니다. A에 쌓인 원반을 모두 C로 옮기되, 한 번에 하나만, 큰 원반을 작은 원반 위에 놓지 않아야 합니다. 반복문으로 생각하면 막막하지만, 재귀로는 세 줄입니다.

1. 위의 n−1개를 A에서 **B로** 옮긴다(C를 보조로).
2. 남은 가장 큰 원반을 A에서 **C로** 옮긴다.
3. B의 n−1개를 **C로** 옮긴다(A를 보조로).

1번과 3번은 "원반이 하나 적은 같은 문제"이므로, 올바르게 풀린다고 **믿고** 부르면 됩니다.

```python
# 파일: hanoi.py
def hanoi(n, src, dst, via, moves):
    if n == 0:                               # 옮길 원반이 없으면 할 일도 없다
        return
    hanoi(n - 1, src, via, dst, moves)       # ① 위의 n-1개를 보조 기둥으로
    moves.append((n, src, dst))              # ② 가장 큰 원반을 목표 기둥으로
    hanoi(n - 1, via, dst, src, moves)       # ③ n-1개를 목표 기둥 위로


moves = []
hanoi(3, "A", "C", "B", moves)
for disk, src, dst in moves:
    print(f"원반 {disk}: {src} → {dst}")
print(len(moves), "번 이동 = 2**3 - 1 =", 2 ** 3 - 1)
```

실행 결과:

```text
원반 1: A → C
원반 2: A → B
원반 1: C → B
원반 3: A → C
원반 1: B → A
원반 2: B → C
원반 1: A → C
7 번 이동 = 2**3 - 1 = 7
```

n개를 옮기는 이동 수를 T(n)이라 하면 T(n) = 2 × T(n−1) + 1, T(0) = 0이라서 **T(n) = 2ⁿ − 1**입니다. C로 원반 수를 늘려 가며 세어 봅시다.

```c
// 파일: hanoi.c
#include <stdio.h>

long long moves = 0;

void hanoi(int n, char from, char to, char via, int show) {
    if (n == 0) {
        return;
    }
    hanoi(n - 1, from, via, to, show);
    moves++;
    if (show) {
        printf("원반 %d: %c → %c\n", n, from, to);
    }
    hanoi(n - 1, via, to, from, show);
}

int main(void) {
    hanoi(3, 'A', 'C', 'B', 1);
    printf("원반 3개: %lld번\n", moves);
    int sizes[] = {10, 20, 25};
    for (int i = 0; i < 3; i++) {
        moves = 0;
        hanoi(sizes[i], 'A', 'C', 'B', 0);
        printf("원반 %d개: %lld번\n", sizes[i], moves);
    }
    return 0;
}
```

실행 결과:

```text
원반 1: A → C
원반 2: A → B
원반 1: C → B
원반 3: A → C
원반 1: B → A
원반 2: B → C
원반 1: A → C
원반 3개: 7번
원반 10개: 1023번
원반 20개: 1048575번
원반 25개: 33554431번
```

원반이 5개 늘 때마다 이동 수가 약 32배가 됩니다. 원반 64개라면 2⁶⁴ − 1번, 1초에 한 번씩 옮겨도 5,800억 년이 걸립니다. 재귀의 **깊이**는 n(최대 25칸)밖에 안 되지만, 호출이 두 갈래로 퍼지면서 **전체 호출 수**가 폭발한다는 점은 피보나치와 같습니다. 이때는 메모이제이션으로 줄일 수 없습니다. 모든 이동을 실제로 해야 하니까요.

## 10. 재귀 설계 점검표

| 질문                                        | 확인할 것                                            |
| ------------------------------------------- | ---------------------------------------------------- |
| 기저 사례가 재귀 호출보다 **앞**에 있나?    | 뒤에 있으면 기저 사례를 검사하기 전에 계속 내려감    |
| 기저 사례가 가장 작은 입력을 **모두** 받나? | `== 0` 대신 `<= 0`, 빈 목록과 한 원소 목록           |
| 매 호출마다 입력이 줄어드나?                | `n - 1`, `n / 2`, `xs[1:]`, `a % b`                  |
| 같은 부분 문제를 여러 번 부르지 않나?       | `f(n/2) * f(n/2)`, 피보나치 → 한 번 구해 쓰거나 기억 |
| 깊이가 너무 깊지 않나?                      | 수천 이상이면 반복문으로 바꾸기                      |

## 11. 세 언어 비교

| 관점                  | C                                   | Python                          | Rust                                 |
| --------------------- | ----------------------------------- | ------------------------------- | ------------------------------------ |
| 재귀 가능             | 예                                  | 예                              | 예                                   |
| 깊이 한도             | 없음(스택이 넘치면 프로그램이 죽음) | 기본 1000에서 `RecursionError`  | 없음(넘치면 "stack overflow"로 멈춤) |
| "첫 값 + 나머지" 쓰기 | 배열과 인덱스, 길이를 넘김          | `xs[0]`, `xs[1:]`(새 목록 만듦) | `[first, rest @ ..]`(복사 없음)      |
| 메모이제이션          | 배열에 저장                         | 사전, `functools.cache`         | `HashMap`, 배열                      |
| 큰 결과               | `long long`, 넘침 주의              | 크기 제한 없음                  | `u64`/`u128`, 넘치면 멈춤            |

## 12. 자주 하는 실수

### 실수 1: 기저 사례가 없다 (Python)

```python
# 파일: no_base.py (실행 오류: RecursionError)
def countdown(n):
    print(n)
    countdown(n - 1)


countdown(3)
```

```text
RecursionError: maximum recursion depth exceeded
```

3, 2, 1, 0, −1, …로 끝없이 내려가다 한도에서 멈춥니다. 기저 사례 `if n == 0: return`을 먼저 두세요.

### 실수 2: 기저 사례에 도달하지 못한다

실습의 디버그 문제입니다. 둘씩 줄어드는데 기저 사례가 `== 0`이면 홀수에서 0을 건너뜁니다. 기저 사례는 넓게(`<= 0`) 쓰세요.

### 실수 3: 재귀 결과를 돌려주지 않는다 (Python)

```python
# 파일: missing_return.py (실행 오류: TypeError)
def sum_to(n):
    if n == 0:
        return 0
    n + sum_to(n - 1)        # return을 빠뜨림


print(sum_to(3))
```

```text
TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'
```

재귀 사례에서 계산한 값을 `return`하지 않으면 그 호출은 `None`을 돌려줍니다. `sum_to(1)`이 `None`을 돌려주자, 한 단계 위의 `sum_to(2)`가 `2 + None`을 계산하다 멈췄습니다. 오류가 난 줄은 "return이 빠진 줄"이 아니라 "그 결과를 쓰는 줄"이라는 점에 주의하세요. C라면 쓰레기 값이 섞인 틀린 답이, Rust라면 컴파일 오류가 납니다.

### 실수 4: 같은 재귀를 두 번 부른다

```c
// 파일: slow_power.c
#include <stdio.h>

long long calls = 0;

long long slow_power(long long x, int n) {
    calls++;
    if (n == 0) {
        return 1;
    }
    return n % 2 == 0 ? slow_power(x, n / 2) * slow_power(x, n / 2)
                      : slow_power(x, n / 2) * slow_power(x, n / 2) * x;
}

int main(void) {
    long long result = slow_power(2, 20);   // 먼저 끝내고
    printf("2^20 = %lld, 호출 %lld번\n", result, calls);
    return 0;
}
```

실행 결과:

```text
2^20 = 1048576, 호출 63번
```

값은 맞지만 한 번 구하면 될 `slow_power(x, n/2)`를 두 번씩 불러서 호출이 두 갈래로 퍼졌고, 빠른 거듭제곱의 장점이 사라졌습니다. 5절의 `power`는 같은 계산에 호출이 6번뿐입니다. 반으로 줄이는 재귀는 **한 번 구해 변수에 담아** 쓰세요. 결과를 `result`에 먼저 담은 것에도 이유가 있습니다. `printf`의 인자에 `slow_power(...)`와 `calls`를 함께 넣으면 C는 인자를 계산하는 순서를 정해 두지 않아서, `calls`가 호출 전의 0으로 읽힐 수 있습니다.

### 실수 5: 너무 깊은 재귀 (Rust)

```rust
// 파일: deep.rs (실행 오류: overflow)
fn depth(n: u64) -> u64 {
    if n == 0 { 0 } else { 1 + depth(n - 1) }
}

fn main() {
    let n: u64 = "10000000".parse().unwrap();
    println!("{}", depth(n));
}
```

천만 번 쌓인 호출이 스택 메모리(보통 수 MB)를 넘어 프로그램이 멈춥니다. 한 줄로 줄어드는 재귀는 반복문으로 바꾸면 이런 문제가 없습니다.

## 13. Q&A

**Q. 재귀는 반복보다 느린가요?**

A. 함수 호출마다 약간의 비용이 있어서, 같은 일을 하는 반복보다 조금 느린 경우가 많습니다. 하지만 속도 차이는 대부분 작고, 문제에 따라 재귀가 훨씬 읽기 쉽습니다. 진짜로 느린 경우는 피보나치처럼 **같은 계산을 반복하는** 재귀이고, 이것은 메모이제이션이나 반복으로 고칩니다.

**Q. 꼬리 재귀가 무엇인가요?**

A. 재귀 호출이 함수의 **마지막 일**이라, 돌아와서 할 계산이 없는 재귀입니다(`gcd`). 어떤 언어는 꼬리 재귀를 반복으로 바꿔 스택을 쓰지 않게 최적화합니다. C 컴파일러는 최적화 옵션을 켜면 그렇게 해 주기도 하지만, C·Python·Rust 모두 이것을 **보장하지는 않으므로** 깊이가 큰 반복은 직접 반복문으로 쓰세요.

**Q. 재귀 함수를 어떻게 디버깅하나요?**

A. 5절의 `trace`처럼 **깊이만큼 들여써서** "들어감/나옴"과 매개변수를 출력하면 호출 구조가 보입니다. 작은 입력(n = 2, 3)으로 먼저 시험하고, 기저 사례와 그 바로 위 단계가 맞는지 확인하세요.

**Q. Python에서 재귀 한도를 늘려도 되나요?**

A. `sys.setrecursionlimit(10000)`으로 늘릴 수 있지만, 실제 스택 메모리가 모자라면 프로그램이 오류 메시지도 없이 죽을 수 있습니다. 깊은 재귀가 필요하면 반복문이나 직접 만든 스택(Day 57)으로 바꾸는 것이 안전합니다.

## 14. 핵심 요약

- 재귀 함수는 **기저 사례**(바로 답)와 **재귀 사례**(더 작은 문제로 자기 호출)로 이루어집니다. 매 호출마다 기저 사례에 가까워져야 끝납니다.
- 호출할 때마다 **호출 스택**에 새 칸(자기만의 매개변수와 지역 변수)이 쌓이고, 나중에 부른 것이 먼저 끝납니다. 재귀 호출 뒤의 코드는 돌아오며 거꾸로 실행됩니다.
- 설계할 때는 더 작은 문제의 답을 **믿고** 지금 단계만 생각합니다.
- 호출이 두 갈래로 퍼지면(피보나치, 하노이) 전체 호출 수가 지수적으로 늘어납니다. 같은 부분 문제를 반복한다면 **메모이제이션**으로 줄입니다.
- 기저 사례가 없거나 도달할 수 없으면 스택이 넘칩니다(Python `RecursionError`, C·Rust는 프로그램 종료).
- 한 줄로 줄어드는 재귀는 반복으로 바꾸기 쉽고, 깊이가 크면 반복이 안전합니다.

## 15. 도전 문제

1. **(C)** 정수 배열과 길이를 받아 재귀로 합계를 구하는 `int sum_rec(int a[], int n)`을 만드세요(`a[n-1] + sum_rec(a, n-1)`).
2. **(Python)** 문자열이 회문인지 재귀로 판별하세요. 양 끝 글자가 같고, 가운데 부분이 회문이면 회문입니다.
3. **(Rust)** 이진수 문자열로 바꾸는 재귀 함수 `fn to_binary(n: u32) -> String`을 만드세요(`to_binary(n / 2)` 뒤에 `n % 2`를 붙이기). 0일 때의 기저 사례에 주의하세요.
4. **(세 언어)** 피보나치를 (a) 단순 재귀, (b) 메모이제이션, (c) 반복문으로 각각 구현하고, fib(30)의 호출 수나 반복 횟수를 비교하세요.
