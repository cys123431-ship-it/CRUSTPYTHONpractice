---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-16-for-loop
courseId: crp-92
phaseId: phase-02
dayNumber: 16
date: "2026-10-16"
title: for 반복과 누적 — 같은 일을 정해진 횟수만큼
summary: 정해진 범위나 목록을 하나씩 도는 for 반복문을 세 언어로 배웁니다. Python의 range(시작, 끝, 간격), C의 for(초기화; 조건; 갱신), Rust의 a..b·a..=b·rev·step_by를 비교하고, 반복 전에 준비하는 누적 변수로 합계·개수·곱·최댓값·평균을 구하는 기본 패턴을 익힙니다. 목록과 문자열을 도는 방법, 번호와 값을 함께 얻는 enumerate, 반복이 끝나는 경계(끝값 포함 여부)를 확인하고, 매달 저축하는 적금 시뮬레이션을 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-15-match]
learningObjectives:
  - 세 언어의 for 문으로 정해진 범위(시작, 끝, 간격, 역순)를 반복한다.
  - 반복의 끝값이 포함되는지 range, C의 조건, Rust의 ..와 ..=로 구별한다.
  - 누적 패턴(합계, 개수, 곱, 최댓값)으로 반복하며 값을 모은다.
  - 목록과 문자열을 값 단위로 돌고, 번호와 값을 함께 얻는다.
  - 반복 횟수와 마지막 값을 손으로 추적해 반복문을 검증한다.
concepts:
  [
    for loop,
    range,
    iteration,
    accumulator,
    counter,
    running total,
    running max,
    enumerate,
    step,
    reverse,
  ]
runnerMode: python
playgroundSource: |
  # 파일: loops.py — 범위와 누적을 바꿔 보세요.
  total = 0
  for n in range(1, 11):
      total += n
      print(f"n={n:>2}  지금까지 합={total}")
  print("평균:", total / 10)
  print(list(range(10, 0, -3)))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day16-predict-py
    title: range의 간격 예측하기
    kind: predict
    objective: range(시작, 끝, 간격)이 끝값을 포함하지 않는다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      for i in range(1, 10, 3):
          print(i, end=" ")
      print()
    answer: "1 4 7"
    hint: "1에서 시작해 3씩 더하고, 10 이상이 되기 전까지만 반복합니다."
    explanation: "1, 4, 7 다음은 10인데, range는 끝값 10을 포함하지 않으므로 멈춥니다. range(a, b)의 반복 횟수는 간격이 1일 때 b - a입니다(반열린 구간, Day 12)."
    commonMistakes:
      - "10까지 포함해 1 4 7 10으로 적음"
      - "세 번째 인자를 반복 횟수로 읽음"
    language: python
    verification: run
  - id: ex-day16-predict-c
    title: C 누적 합 예측하기
    kind: predict
    objective: 반복마다 누적 변수가 어떻게 바뀌는지 추적한다.
    prompt: 출력되는 값을 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int s = 0;
          for (int i = 1; i <= 4; i++) {
              s += i * i;
          }
          printf("%d\n", s);
          return 0;
      }
    answer: "30"
    hint: "1², 2², 3², 4²를 차례로 더합니다."
    explanation: "i가 1, 2, 3, 4일 때 s는 1, 5, 14, 30이 됩니다. i <= 4이므로 4까지 포함합니다. 반복이 끝날 때 i는 5가 되어 조건이 거짓이 된 것입니다."
    commonMistakes:
      - "i < 4로 착각해 14로 적음"
      - "(1+2+3+4)²으로 계산해 100으로 적음"
    language: c
    verification: run
  - id: ex-day16-fill
    title: Rust 거꾸로 반복 채우기
    kind: fill
    objective: 범위를 뒤집는 메서드를 쓴다.
    prompt: "빈칸을 채워 '5 4 3 2 1'이 출력되게 하세요."
    starter: |-
      fn main() {
          for i in (1..=5)._____() {
              print!("{i} ");
          }
          println!();
      }
    answer: |-
      fn main() {
          for i in (1..=5).rev() {
              print!("{i} ");
          }
          println!();
      }
    output: "5 4 3 2 1"
    hint: "reverse의 줄임말입니다."
    explanation: "Rust에서 5..1처럼 쓰면 시작이 끝보다 커서 한 번도 반복하지 않습니다. 거꾸로 돌려면 정방향 범위를 만든 뒤 rev()로 뒤집습니다. 범위를 괄호로 감싸야 메서드가 범위 전체에 붙습니다."
    commonMistakes:
      - "5..=1로 써서 아무것도 출력되지 않음"
      - "괄호 없이 1..=5.rev()로 써서 컴파일 오류가 남"
    language: rust
    verification: run
  - id: ex-day16-modify
    title: 3의 배수만 세고 더하기
    kind: modify
    objective: 반복 안에 조건을 넣어 일부 값만 누적한다.
    prompt: "1부터 30까지 중 3의 배수의 개수와 합을 '10 165'로 출력하도록 고치세요."
    starter: |-
      total = 0
      for n in range(1, 31):
          total += n
      print(total)
    answer: |-
      count = 0
      total = 0
      for n in range(1, 31):
          if n % 3 == 0:
              count += 1
              total += n
      print(count, total)
    output: "10 165"
    hint: "n % 3 == 0인 n만 개수와 합에 더합니다. 개수를 셀 변수를 하나 더 준비하세요."
    explanation: "3, 6, …, 30은 10개이고 합은 3 × (1 + 2 + … + 10) = 3 × 55 = 165입니다. range(3, 31, 3)으로 3의 배수만 도는 방법도 있습니다. 반복 안의 if로 '조건에 맞는 것만 누적'하는 것은 가장 흔한 패턴입니다."
    commonMistakes:
      - "count를 반복 안에서 0으로 초기화해 매번 지워짐"
      - "range(1, 30)으로 써서 30이 빠짐"
    language: python
    verification: run
  - id: ex-day16-debug
    title: C 반복 범위의 off-by-one 고치기
    kind: debug
    objective: 반복 조건의 < 와 <= 차이로 생기는 1회 차이를 찾는다.
    prompt: "1부터 10까지의 합(55)을 구하려 했는데 45가 출력됩니다. 고치세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int sum = 0;
          for (int i = 1; i < 10; i++) {
              sum += i;
          }
          printf("%d\n", sum);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int sum = 0;
          for (int i = 1; i <= 10; i++) {
              sum += i;
          }
          printf("%d\n", sum);
          return 0;
      }
    output: "55"
    starterOutput: "45"
    hint: "i < 10이면 i가 10일 때 반복하지 않습니다."
    explanation: "1부터 9까지만 더해 45가 되었습니다. 1부터 n까지(양 끝 포함)는 i = 1; i <= n, 0부터 n개는 i = 0; i < n이 관용적인 모양입니다. 반복의 첫 값과 마지막 값을 손으로 확인하는 습관이 이런 실수를 막습니다."
    commonMistakes:
      - "i = 0부터 시작하게 바꿔 0을 더할 뿐 여전히 45가 됨"
      - "i <= 11로 고쳐 66이 됨"
    language: c
    verification: run
  - id: ex-day16-independent
    title: Rust로 팩토리얼 구하기
    kind: independent
    objective: 곱의 누적과 알맞은 정수 자료형을 쓴다.
    prompt: "1부터 n까지의 곱(n!)을 반복문으로 구해 10!과 20!을 '3628800 2432902008176640000'으로 출력하세요."
    starter: |-
      fn main() {
          println!("? ?");
      }
    answer: |-
      fn factorial(n: u64) -> u64 {
          let mut result = 1;
          for k in 1..=n {
              result *= k;
          }
          result
      }

      fn main() {
          println!("{} {}", factorial(10), factorial(20));
      }
    output: "3628800 2432902008176640000"
    hint: "곱의 누적은 1에서 시작합니다. 20!은 약 2.4 × 10¹⁸이라 i32나 u32로는 담을 수 없습니다."
    explanation: "u64의 최댓값은 약 1.8 × 10¹⁹라서 20!까지는 담지만 21!은 넘칩니다(개발용 빌드에서는 멈춤). 누적 값이 얼마나 커지는지 미리 생각하고 자료형을 고르는 것이 중요합니다(Day 10)."
    commonMistakes:
      - "result를 0으로 시작해 결과가 항상 0이 됨"
      - "1..n으로 써서 n을 곱하지 않음"
    language: rust
    verification: run
quiz:
  - id: quiz-day16-01
    question: Python range(2, 8)이 만드는 값의 개수는?
    choices: ["5개", "6개", "7개", "8개"]
    answerIndex: 1
    explanation: 2, 3, 4, 5, 6, 7로 6개입니다. 끝값 8은 포함하지 않으므로 개수는 8 - 2 = 6입니다.
  - id: quiz-day16-02
    question: C의 for (int i = 0; i < n; i++)에서 세 부분이 실행되는 순서로 옳은 것은?
    choices:
      - 조건 → 초기화 → 몸통 → 갱신
      - 초기화(한 번) → 조건 → 몸통 → 갱신 → 조건 → 몸통 → …
      - 초기화 → 갱신 → 조건 → 몸통
      - 몸통 → 조건 → 갱신
    answerIndex: 1
    explanation: 초기화는 처음 한 번만, 그다음 '조건 검사 → 참이면 몸통 → 갱신'을 반복하다가 조건이 거짓이면 끝납니다. 처음부터 조건이 거짓이면 몸통은 한 번도 실행되지 않습니다.
  - id: quiz-day16-03
    question: 최댓값을 구하는 누적 변수 best의 시작값으로 가장 안전한 것은?
    choices:
      - "0"
      - 목록의 첫 번째 값
      - "100"
      - "-1"
    answerIndex: 1
    explanation: 0으로 시작하면 모든 값이 음수일 때 틀린 답(0)이 나옵니다. 목록의 첫 값으로 시작하면 어떤 값이 들어 있어도 맞습니다. 합계는 0, 곱은 1, 최댓값은 첫 값(또는 가장 작은 수)이 시작값입니다.
  - id: quiz-day16-04
    question: Rust의 for i in 0..3과 for i in 0..=3의 반복 횟수는?
    choices: ["3번, 3번", "3번, 4번", "4번, 4번", "2번, 3번"]
    answerIndex: 1
    explanation: 0..3은 0, 1, 2(3번), 0..=3은 0, 1, 2, 3(4번)입니다. Python의 range(0, 3)은 0..3과 같습니다.
  - id: quiz-day16-05
    question: Python에서 for i, s in enumerate(["a", "b"], start=1)의 첫 번째 (i, s)는?
    choices: ['(0, "a")', '(1, "a")', '(1, "b")', '("a", 1)']
    answerIndex: 1
    explanation: enumerate는 (번호, 값)을 차례로 줍니다. start=1이라 번호가 1부터 시작합니다. 기본값은 0입니다. Rust는 .iter().enumerate()가 (0부터의 번호, 값)을 줍니다.
---

## 1. 오늘 배울 내용

지금까지 여러 값을 시험할 때 `for`를 "미리보기"로 썼습니다. 오늘 제대로 배웁니다. **반복문**은 같은 일을 여러 번 하게 합니다. `for`는 그중 **정해진 범위나 목록**을 하나씩 도는 반복입니다.

1. 범위 반복의 모양을 세 언어로 익힙니다.
   - Python: `range(끝)`, `range(시작, 끝)`, `range(시작, 끝, 간격)`
   - C: `for (초기화; 조건; 갱신)`
   - Rust: `a..b`, `a..=b`, `.rev()`, `.step_by(k)`
2. 반복의 **끝값이 포함되는지** 구별합니다.
3. **누적 패턴**으로 여러 값을 모읍니다.
   - 합계
   - 개수
   - 곱
   - 최댓값
   - 평균
4. **목록**과 **문자열**을 하나씩 돌고, `enumerate`로 번호와 값을 함께 얻습니다.
5. 적금 시뮬레이션으로 반복과 누적을 함께 씁니다.

## 2. 왜 필요한가

1부터 100까지 더하라고 하면 `1 + 2 + 3 + … + 100`을 코드로 다 쓸 수는 없습니다. 반복문을 쓰면 "n을 1부터 100까지 바꿔 가며 `total += n`"이라는 **한 줄의 규칙**으로 끝납니다. 반복 횟수가 1000이든 100만이든 코드 길이는 같습니다.

현실의 데이터 처리는 대부분 반복입니다.

- 학생 30명의 점수로 평균 구하기
- 한 달 동안의 매출 합계
- 파일의 모든 줄에서 특정 단어 찾기
- 1년 12개월 동안 적금 불리기

그리고 반복할 때마다 값을 조금씩 모아 가는 **누적(accumulation)** 이 반복문의 가장 흔한 쓰임입니다.

## 3. 그림으로 이해하기

C의 `for`는 세 부분으로 이루어져 있고, 실행 순서가 정해져 있습니다.

```text
for ( ①초기화 ; ②조건 ; ④갱신 ) { ③몸통 }

 ① int i = 1  (한 번만)
      │
      ▼
 ┌─▶ ② i <= 5 ? ── 거짓 ──▶ 반복 끝, 다음 줄로
 │        │ 참
 │        ▼
 │   ③ 몸통 실행 (total += i)
 │        │
 │        ▼
 └── ④ i++
```

누적 변수는 반복 **밖에서** 준비하고, 반복할 때마다 조금씩 바뀝니다.

```text
total = 0                     ← 반복 전에 한 번
┌───────────────┐
│ n = 1: total = 0 + 1 = 1  │
│ n = 2: total = 1 + 2 = 3  │   반복할 때마다
│ n = 3: total = 3 + 3 = 6  │   이전 값에 더한다
│ ...                        │
└───────────────┘
print(total)                  ← 반복이 끝난 뒤 사용
```

## 4. 천천히 풀어보기

### 4.1 세 언어의 범위 반복

| 반복할 값      | Python            | C                                  | Rust                  |
| -------------- | ----------------- | ---------------------------------- | --------------------- |
| 0, 1, 2, 3, 4  | `range(5)`        | `for (int i = 0; i < 5; i++)`      | `0..5`                |
| 1, 2, 3, 4, 5  | `range(1, 6)`     | `for (int i = 1; i <= 5; i++)`     | `1..=5`               |
| 2, 4, 6, 8, 10 | `range(2, 11, 2)` | `for (int i = 2; i <= 10; i += 2)` | `(2..=10).step_by(2)` |
| 5, 4, 3, 2, 1  | `range(5, 0, -1)` | `for (int i = 5; i > 0; i--)`      | `(1..=5).rev()`       |

- Python `range(a, b)`와 Rust `a..b`는 **끝값 b를 포함하지 않습니다**(반열린 구간). 반복 횟수는 `b - a`입니다.
- C는 **조건**을 직접 씁니다. `<`와 `<=` 하나로 반복 횟수가 1 달라집니다.
- Rust는 거꾸로 돌 때 `5..1`이 아니라 `(1..=5).rev()`를 씁니다. `5..1`은 시작이 끝보다 커서 **한 번도** 반복하지 않습니다.

### 4.2 누적 패턴

| 구하려는 것 | 시작값                  | 반복 안에서                 |
| ----------- | ----------------------- | --------------------------- |
| 합계        | `total = 0`             | `total += x`                |
| 개수        | `count = 0`             | 조건이 참이면 `count += 1`  |
| 곱          | `product = 1`           | `product *= x`              |
| 최댓값      | `best = 첫 값`          | `x > best`이면 `best = x`   |
| 최솟값      | `worst = 첫 값`         | `x < worst`이면 `worst = x` |
| 평균        | (합계와 개수를 구한 뒤) | 반복 후 `합계 / 개수`       |

시작값을 잘못 정하면 결과가 틀립니다. 곱을 0에서 시작하면 항상 0이고, 최댓값을 0에서 시작하면 모든 값이 음수일 때 틀립니다.

### 4.3 목록과 문자열 돌기

범위뿐 아니라 **목록의 값**을 직접 돌 수 있습니다.

| 하고 싶은 일 | Python                           | C                                         | Rust                                      |
| ------------ | -------------------------------- | ----------------------------------------- | ----------------------------------------- |
| 값을 하나씩  | `for s in scores:`               | `for (int i = 0; i < len; i++) scores[i]` | `for s in scores`                         |
| 번호와 값    | `for i, s in enumerate(scores):` | 번호 `i`로 `scores[i]`                    | `for (i, s) in scores.iter().enumerate()` |
| 글자 하나씩  | `for ch in "Rust":`              | `for (i = 0; s[i] != '\0'; i++)`          | `for ch in "Rust".chars()`                |

C에는 "값을 하나씩 도는" 문법이 없어서, 항상 **번호(인덱스)** 로 칸을 찾습니다. 배열의 칸 수는 `sizeof 배열 / sizeof 배열[0]`로 구합니다(Day 26).

### 4.4 반복 변수의 범위

- **C**: `for (int i = ...)`에서 선언한 `i`는 반복이 끝나면 사라집니다.
- **Rust**: `for i in ...`의 `i`도 반복 안에서만 있습니다.
- **Python**: 반복이 끝나도 `i`가 **마지막 값으로 남아** 있습니다. 편리할 때도 있지만, 반복 밖에서 실수로 `i`를 쓰는 버그의 원인이 되기도 합니다.

## 5. C로 구현하기

```c
// 파일: loops.c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {       // 초기화; 조건; 갱신
        printf("%d ", i);
    }
    printf("\n");
    for (int i = 2; i <= 10; i += 2) {
        printf("%d ", i);
    }
    printf("\n");
    for (int i = 5; i > 0; i--) {
        printf("%d ", i);
    }
    printf("\n");

    int total = 0;
    for (int n = 1; n <= 100; n++) {
        total += n;
    }
    printf("1~100 합: %d  공식 n(n+1)/2: %d\n", total, 100 * 101 / 2);

    int count_even = 0;
    long long product = 1;              // 곱은 금방 커지므로 넓은 자료형
    for (int n = 1; n <= 10; n++) {
        if (n % 2 == 0) {
            count_even++;
        }
        product *= n;
    }
    printf("1~10 짝수 개수: %d  10! = %lld\n", count_even, product);

    int scores[] = {72, 95, 88, 61, 90};
    int len = sizeof scores / sizeof scores[0];   // 배열 칸 수 = 전체 크기 / 한 칸 크기
    int best = scores[0];
    int sum = 0;
    for (int i = 0; i < len; i++) {
        if (scores[i] > best) {
            best = scores[i];
        }
        sum += scores[i];
    }
    printf("최고점: %d  평균: %.1f\n", best, (double)sum / len);

    for (int i = 0; i < len; i++) {
        printf("%d번 %d점\n", i + 1, scores[i]);
    }

    const char *word = "Rust";
    for (int i = 0; word[i] != '\0'; i++) {       // 문자열 끝 표시가 나올 때까지
        printf("%c-", word[i]);
    }
    printf("\n");
    return 0;
}
```

실행 결과:

```text
0 1 2 3 4
2 4 6 8 10
5 4 3 2 1
1~100 합: 5050  공식 n(n+1)/2: 5050
1~10 짝수 개수: 5  10! = 3628800
최고점: 95  평균: 81.2
1번 72점
2번 95점
3번 88점
4번 61점
5번 90점
R-u-s-t-
```

### 코드 한 부분씩 읽기

| 코드                               | 설명                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `for (int i = 0; i < 5; i++)`      | 가장 흔한 모양입니다. 0부터 시작해 5번 반복합니다.                                 |
| `i += 2`, `i--`                    | 갱신 부분에는 어떤 식이든 쓸 수 있습니다.                                          |
| `100 * 101 / 2`                    | 1부터 n까지의 합 공식 n(n+1)/2로 반복의 결과를 검산했습니다.                       |
| `long long product = 1;`           | 곱은 빠르게 커집니다. 13!은 이미 `int` 범위를 넘습니다(Day 10).                    |
| `sizeof scores / sizeof scores[0]` | 배열 전체 바이트 수(20)를 한 칸의 바이트 수(4)로 나눠 칸 수 5를 얻습니다.          |
| `int best = scores[0];`            | 최댓값은 첫 값에서 시작합니다.                                                     |
| `(double)sum / len`                | 정수 합계를 실수로 바꿔 평균을 구합니다(Day 6).                                    |
| `i + 1`                            | 배열 번호는 0부터지만, 사람에게 보여 줄 번호는 1부터로 바꿨습니다.                 |
| `word[i] != '\0'`                  | C 문자열은 끝에 `'\0'`(널 문자)이 있습니다. 그것을 만날 때까지 반복합니다(Day 37). |

## 6. Python으로 구현하기

```python
# 파일: loops.py
for i in range(5):                      # 0, 1, 2, 3, 4 (5는 포함하지 않음)
    print(i, end=" ")
print()
for i in range(2, 11, 2):               # 2부터 10까지 2씩
    print(i, end=" ")
print()
for i in range(5, 0, -1):               # 거꾸로: 5, 4, 3, 2, 1
    print(i, end=" ")
print()

total = 0                               # 누적 변수는 반복 전에 준비한다
for n in range(1, 101):
    total += n
print("1~100 합:", total, " 공식 n(n+1)/2:", 100 * 101 // 2)

count_even = 0
product = 1                             # 곱의 누적은 1에서 시작
for n in range(1, 11):
    if n % 2 == 0:
        count_even += 1
    product *= n
print("1~10 짝수 개수:", count_even, " 10! =", product)

scores = [72, 95, 88, 61, 90]
best = scores[0]
for s in scores:                        # 목록의 값을 하나씩
    if s > best:
        best = s
print("최고점:", best, " 평균:", sum(scores) / len(scores))

for i, s in enumerate(scores, start=1): # 번호와 값을 함께
    print(f"{i}번 {s}점")

for ch in "Rust":                       # 문자열의 글자를 하나씩
    print(ch, end="-")
print()
print("반복이 끝난 뒤에도 i =", i)
```

실행 결과:

```text
0 1 2 3 4
2 4 6 8 10
5 4 3 2 1
1~100 합: 5050  공식 n(n+1)/2: 5050
1~10 짝수 개수: 5  10! = 3628800
최고점: 95  평균: 81.2
1번 72점
2번 95점
3번 88점
4번 61점
5번 90점
R-u-s-t-
반복이 끝난 뒤에도 i = 5
```

### 코드 한 부분씩 읽기

| 코드                                 | 설명                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `for i in range(5):`                 | 콜론과 들여쓰기로 반복할 몸통을 표시합니다.                                          |
| `range(5, 0, -1)`                    | 간격이 음수면 거꾸로 갑니다. 끝값 0은 포함하지 않습니다.                             |
| `total = 0` (반복 밖)                | 누적 변수를 반복 **안**에서 0으로 만들면 매번 지워져서 마지막 값만 남습니다.         |
| `product = 1`                        | 곱의 시작값은 1입니다. Python 정수는 넘치지 않아 큰 팩토리얼도 계산됩니다.           |
| `for s in scores:`                   | 번호 없이 **값**을 하나씩 꺼냅니다. 번호가 필요 없으면 이 모양이 가장 읽기 쉽습니다. |
| `sum(scores) / len(scores)`          | 파이썬 내장 함수로 합계와 개수를 바로 구했습니다. 직접 만든 누적과 결과가 같습니다.  |
| `enumerate(scores, start=1)`         | `(1, 72)`, `(2, 95)`, …처럼 번호와 값의 짝을 줍니다. 두 이름으로 나눠 받습니다.      |
| `print("반복이 끝난 뒤에도 i =", i)` | 앞의 `enumerate` 반복에서 쓴 `i`가 마지막 값 5로 남아 있습니다.                      |

## 7. Rust로 구현하기

```rust
// 파일: loops.rs
fn main() {
    for i in 0..5 {                     // 0, 1, 2, 3, 4
        print!("{i} ");
    }
    println!();
    for i in (2..=10).step_by(2) {      // 2부터 10까지 2씩
        print!("{i} ");
    }
    println!();
    for i in (1..=5).rev() {            // 거꾸로
        print!("{i} ");
    }
    println!();

    let mut total = 0;
    for n in 1..=100 {
        total += n;
    }
    let by_sum: i32 = (1..=100).sum();  // 반복자로 한 번에
    println!("1~100 합: {total}  sum(): {by_sum}");

    let mut count_even = 0;
    let mut product: u64 = 1;
    for n in 1..=10 {
        if n % 2 == 0 {
            count_even += 1;
        }
        product *= n;
    }
    println!("1~10 짝수 개수: {count_even}  10! = {product}");

    let scores = [72, 95, 88, 61, 90];
    let mut best = scores[0];
    for s in scores {                   // 배열의 값을 하나씩
        if s > best {
            best = s;
        }
    }
    let sum: i32 = scores.iter().sum();
    println!("최고점: {best}  평균: {:.1}", sum as f64 / scores.len() as f64);

    for (i, s) in scores.iter().enumerate() {
        println!("{}번 {s}점", i + 1);
    }

    for ch in "Rust".chars() {
        print!("{ch}-");
    }
    println!();
}
```

실행 결과:

```text
0 1 2 3 4
2 4 6 8 10
5 4 3 2 1
1~100 합: 5050  sum(): 5050
1~10 짝수 개수: 5  10! = 3628800
최고점: 95  평균: 81.2
1번 72점
2번 95점
3번 88점
4번 61점
5번 90점
R-u-s-t-
```

### 코드 한 부분씩 읽기

| 코드                        | 설명                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `for i in 0..5`             | 범위 `0..5`를 하나씩 돕니다. 범위는 **반복자(iterator)** 라는 "다음 값을 하나씩 내주는 것"입니다.      |
| `(2..=10).step_by(2)`       | 범위에서 2칸마다 하나씩 꺼냅니다.                                                                      |
| `let mut total = 0;`        | 누적 변수는 바뀌므로 `mut`가 필요합니다.                                                               |
| `(1..=100).sum()`           | 반복자의 모든 값을 더하는 메서드입니다. 결과 자료형을 알려 줘야 해서 `let by_sum: i32`라고 적었습니다. |
| `let mut product: u64 = 1;` | 곱의 자료형을 `u64`로 정했습니다. 그러면 `product *= n`의 `n`도 `u64`로 추론됩니다.                    |
| `for s in scores`           | 배열의 값을 하나씩 꺼냅니다. 정수 배열은 복사되므로 반복 뒤에도 `scores`를 쓸 수 있습니다.             |
| `scores.iter().sum()`       | `iter()`는 배열을 **빌려서** 도는 반복자입니다.                                                        |
| `scores.iter().enumerate()` | `(0, &72)`, `(1, &95)`, …처럼 0부터의 번호와 값을 줍니다. 그래서 `i + 1`로 출력했습니다.               |
| `"Rust".chars()`            | 문자열의 글자(`char`)를 하나씩 꺼냅니다.                                                               |

## 8. 실행 추적

C의 최댓값 반복을 `scores = {72, 95, 88, 61, 90}`으로 따라갑니다.

|    `i` | `scores[i]` | `scores[i] > best`? | `best` | `sum` |
| -----: | ----------: | ------------------- | -----: | ----: |
| (시작) |             |                     |     72 |     0 |
|      0 |          72 | 72 > 72 거짓        |     72 |    72 |
|      1 |          95 | 95 > 72 **참**      |     95 |   167 |
|      2 |          88 | 88 > 95 거짓        |     95 |   255 |
|      3 |          61 | 61 > 95 거짓        |     95 |   316 |
|      4 |          90 | 90 > 95 거짓        |     95 |   406 |
|      5 |             | `5 < 5` 거짓 → 끝   |        |       |

평균은 406 ÷ 5 = 81.2입니다. 이런 표를 한 번 그려 보면 **반복 횟수**(5번), **마지막 값**(`i = 4`), **끝나는 순간**(`i = 5`)을 확실히 알 수 있습니다.

## 9. 다른 예제로 다시 이해하기

매달 10만 원씩 넣고, 매달 말에 잔액의 0.2%를 이자로 받는 적금을 1년 동안 시뮬레이션해 봅시다. 이자는 원 단위 아래를 버리는 **정수 계산**으로 합니다(Day 7). 3개월마다 잔액을 출력하는 데는 반복 안의 `if`를 씁니다.

```python
# 파일: savings.py
deposit = 100_000
balance = 0
total_interest = 0
for month in range(1, 13):
    balance += deposit
    interest = balance * 2 // 1000          # 월 0.2%, 원 단위 버림
    balance += interest
    total_interest += interest
    if month % 3 == 0:
        print(f"{month:>2}개월: {balance:>9,}원 (이번 달 이자 {interest:,}원)")
print(f"넣은 돈 {deposit * 12:,}원, 이자 합계 {total_interest:,}원")
```

실행 결과:

```text
 3개월:   301,201원 (이번 달 이자 601원)
 6개월:   604,213원 (이번 달 이자 1,206원)
 9개월:   909,046원 (이번 달 이자 1,814원)
12개월: 1,215,712원 (이번 달 이자 2,426원)
넣은 돈 1,200,000원, 이자 합계 15,712원
```

누적 변수가 **두 개**(`balance`, `total_interest`)입니다. 이자는 잔액에 다시 더해져서 다음 달 이자를 키웁니다. 이것이 **복리**입니다. 같은 계산을 C로 하면 천 단위 쉼표 없이 출력됩니다.

```c
// 파일: savings.c
#include <stdio.h>

int main(void) {
    long long deposit = 100000, balance = 0, total_interest = 0;
    for (int month = 1; month <= 12; month++) {
        balance += deposit;
        long long interest = balance * 2 / 1000;
        balance += interest;
        total_interest += interest;
        if (month % 3 == 0) {
            printf("%2d개월: %9lld원 (이번 달 이자 %lld원)\n", month, balance, interest);
        }
    }
    printf("넣은 돈 %lld원, 이자 합계 %lld원\n", deposit * 12, total_interest);
    return 0;
}
```

실행 결과:

```text
 3개월:    301201원 (이번 달 이자 601원)
 6개월:    604213원 (이번 달 이자 1206원)
 9개월:    909046원 (이번 달 이자 1814원)
12개월:   1215712원 (이번 달 이자 2426원)
넣은 돈 1200000원, 이자 합계 15712원
```

두 언어의 숫자가 정확히 같습니다. 실수로 계산했다면 `0.002`의 오차 때문에 끝자리가 달라질 수 있는데, 정수로 계산해서 결과가 같습니다. `interest`는 반복 **안**에서 만든 변수라 매달 새로 계산되고, `balance`와 `total_interest`는 반복 **밖**에서 만들어 12개월 동안 쌓입니다.

## 10. 반복 도구 한눈에 보기

| 하고 싶은 일      | Python                                 | C                             | Rust                     |
| ----------------- | -------------------------------------- | ----------------------------- | ------------------------ |
| n번 반복          | `for _ in range(n):`                   | `for (int i = 0; i < n; i++)` | `for _ in 0..n`          |
| a부터 b까지(포함) | `range(a, b + 1)`                      | `for (i = a; i <= b; i++)`    | `a..=b`                  |
| 간격 k            | `range(a, b, k)`                       | `i += k`                      | `(a..b).step_by(k)`      |
| 거꾸로            | `range(b, a - 1, -1)`, `reversed(...)` | `for (i = b; i >= a; i--)`    | `(a..=b).rev()`          |
| 합계 한 번에      | `sum(목록)`                            | (직접 누적)                   | `.iter().sum()`          |
| 최댓값 한 번에    | `max(목록)`                            | (직접 누적)                   | `.iter().max()` (Option) |
| 번호와 값         | `enumerate(목록)`                      | 인덱스                        | `.iter().enumerate()`    |

반복 변수를 쓰지 않을 때는 이름을 `_`로 씁니다(Python, Rust). "몇 번 반복하는지만 중요하다"는 뜻입니다.

## 11. 세 언어 비교

| 관점                | Python                     | C                                   | Rust                          |
| ------------------- | -------------------------- | ----------------------------------- | ----------------------------- |
| 기본 모양           | `for x in 반복할_것:`      | `for (초기화; 조건; 갱신)`          | `for x in 반복자`             |
| 범위의 끝           | 포함 안 함(`range`)        | 조건으로 직접 정함                  | `..` 포함 안 함, `..=` 포함   |
| 목록의 값 직접 돌기 | 가능                       | 불가능(인덱스 사용)                 | 가능                          |
| 반복 변수 수명      | 반복 뒤에도 남음           | `for` 안에서 선언하면 반복 안에서만 | 반복 안에서만                 |
| 반복 중 인덱스 실수 | 목록을 직접 돌면 거의 없음 | 범위 밖 인덱스는 정의되지 않은 동작 | 범위 밖 인덱스는 실행 중 멈춤 |

## 12. 자주 하는 실수

### 실수 1: 누적 변수를 반복 안에서 초기화한다

```python
# 파일: reset_inside.py
for n in range(1, 6):
    total = 0
    total += n
print(total)
```

실행 결과:

```text
5
```

반복할 때마다 0으로 지워져서 마지막 값 5만 남습니다. 누적 변수는 **반복 밖**에서 준비하세요.

### 실수 2: 반복 범위가 1 어긋난다 (off-by-one)

실습의 디버그 문제입니다. "1부터 10까지"는 C에서 `i = 1; i <= 10`, Python에서 `range(1, 11)`, Rust에서 `1..=10`입니다. 첫 값과 마지막 값을 꼭 확인하세요.

### 실수 3: 배열의 끝을 넘어간다 (C, Rust)

```rust
// 파일: out_of_bounds.rs (실행 오류: index out of bounds)
fn main() {
    let scores = [72, 95, 88];
    let count: usize = "3".parse().unwrap();
    let mut sum = 0;
    for i in 0..=count {
        sum += scores[i];
    }
    println!("{sum}");
}
```

칸이 3개인 배열의 번호는 0, 1, 2입니다. `0..=3`은 3번 칸까지 읽으려다 멈춥니다. C에서 같은 실수를 하면 멈추지 않고 **배열 밖의 아무 값**이나 읽는 정의되지 않은 동작이 됩니다. 칸 수 n인 배열은 `0..n`(`i < n`)으로 도세요.

### 실수 4: 거꾸로 범위를 잘못 쓴다 (Rust)

```rust
// 파일: empty_range.rs
fn main() {
    let mut count = 0;
    for _ in 5..1 {
        count += 1;
    }
    println!("5..1 반복 횟수: {count}");
}
```

실행 결과:

```text
5..1 반복 횟수: 0
```

오류 없이 한 번도 반복하지 않습니다. `(1..5).rev()`로 씁니다.

### 실수 5: 반복 중 목록을 바꾼다 (Python)

반복하는 목록에 값을 추가하거나 지우면 건너뛰거나 끝없이 도는 문제가 생깁니다. 바꿔야 한다면 새 목록을 만들거나 복사본을 돌세요(Day 27).

## 13. Q&A

**Q. `for`와 `while`은 언제 구별해 쓰나요?**

A. 반복 횟수나 돌 대상(범위, 목록)이 **미리 정해져 있으면** `for`, "조건이 만족될 때까지"처럼 **언제 끝날지 모르면** `while`입니다. 내일(Day 17) `while`을 배웁니다.

**Q. 합계 공식이 있는데 왜 반복문을 쓰나요?**

A. 1부터 n까지의 합처럼 공식이 있으면 공식이 훨씬 빠릅니다(n이 10억이어도 계산 한 번). 여기서는 반복문을 **검산**하려고 공식과 비교했습니다. 실제 데이터(점수 목록, 매출)는 공식이 없으니 반복으로 누적해야 합니다.

**Q. Rust의 `for s in scores`와 `for s in scores.iter()`는 무엇이 다른가요?**

A. `scores`는 배열의 **값**을 하나씩 꺼내고(정수는 복사), `scores.iter()`는 값을 **빌려서**(`&i32`) 줍니다. 정수 배열에서는 차이가 거의 없지만, `String` 같은 값의 목록에서는 `for s in list`가 목록을 **가져가 버려서** 반복 뒤에 목록을 쓸 수 없습니다(Day 32). 목록을 계속 쓸 거라면 `.iter()`나 `&list`로 도세요.

**Q. C에서 `i++`와 `++i` 중 무엇을 써야 하나요?**

A. `for`의 갱신 부분처럼 값을 바로 쓰지 않는 곳에서는 결과가 같습니다. 이 과정에서는 `i++`를 씁니다.

## 14. 핵심 요약

- `for`는 정해진 범위나 목록을 하나씩 돕니다. Python `for x in range(...)`, C `for (초기화; 조건; 갱신)`, Rust `for x in 반복자`.
- Python `range(a, b)`와 Rust `a..b`는 끝값을 포함하지 않고(반복 `b - a`번), Rust `a..=b`는 포함합니다. C는 `<`와 `<=`로 직접 정합니다.
- 거꾸로: Python `range(5, 0, -1)`, C `i--`, Rust `(1..=5).rev()`. 간격: `range(a, b, k)`, `i += k`, `.step_by(k)`.
- 누적 패턴: 합계는 0, 곱은 1, 최댓값은 첫 값에서 시작하고, 누적 변수는 **반복 밖**에서 준비합니다.
- 목록은 값으로 직접 돌 수 있고(Python, Rust), 번호가 필요하면 `enumerate`를 씁니다. C는 인덱스로 돕니다.
- 반복의 첫 값, 마지막 값, 끝나는 순간을 표로 추적해 off-by-one을 막습니다.

## 15. 도전 문제

1. **(Python)** 1부터 100까지 중 3의 배수이면서 5의 배수가 아닌 수의 합을 구하세요.
2. **(C)** 정수 n을 입력받아 1부터 n까지의 제곱의 합과 공식 n(n+1)(2n+1)/6의 결과를 비교하세요.
3. **(Rust)** `[3, -7, 12, 0, -2]`에서 최댓값, 최솟값, 양수의 개수를 한 번의 반복으로 구하세요.
4. **(세 언어)** 9절의 적금을 "매달 넣는 돈이 1만 원씩 늘어나는" 방식(10만, 11만, 12만, …)으로 바꾸고, 12개월 후 잔액을 세 언어로 계산해 같은지 확인하세요.
