---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-17-while-loop
courseId: crp-92
phaseId: phase-02
dayNumber: 17
date: "2026-10-17"
title: while 반복과 종료 조건 — 언제 끝날지 모를 때
summary: 반복 횟수를 미리 알 수 없고 '조건이 참인 동안' 반복해야 할 때 쓰는 while을 배웁니다. 반복이 반드시 끝나도록 조건에 쓰이는 값을 몸통에서 바꾸는 규칙, 조건을 먼저 검사하는 while과 몸통을 먼저 실행하는 C의 do-while, 특별한 값(0)이나 입력의 끝이 나올 때까지 읽는 센티널 반복을 세 언어로 비교합니다. 자릿수 합, 유클리드 호제법, 콜라츠 수열, 숫자 맞히기 게임으로 종료 조건을 설계하고 추적해 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-16-for-loop]
learningObjectives:
  - 반복 횟수를 모를 때 while로 조건이 참인 동안 반복한다.
  - 반복이 끝나도록 조건에 쓰이는 값을 몸통에서 바꾸고, 무한 반복의 원인을 찾는다.
  - while과 do-while의 차이(조건을 먼저 검사하는가)를 설명하고, Python에서 do-while을 흉내 낸다.
  - 센티널 값이나 입력의 끝이 나올 때까지 입력을 읽는 반복을 세 언어로 쓴다.
  - 자릿수 분해, 최대공약수, 콜라츠 수열처럼 '끝날 때까지' 반복하는 알고리즘을 추적한다.
concepts:
  [
    while loop,
    do while,
    loop condition,
    termination,
    infinite loop,
    sentinel,
    input loop,
    euclidean algorithm,
    digit sum,
    collatz,
  ]
runnerMode: python
playgroundSource: |
  # 파일: while.py — 시작값을 바꿔 가며 반복이 몇 번 도는지 보세요.
  x = 27
  steps = 0
  while x != 1:
      x = x // 2 if x % 2 == 0 else 3 * x + 1
      steps += 1
  print("27에서 1이 되기까지", steps, "단계")

  a, b = 1071, 1029
  while b:
      a, b = b, a % b
  print("최대공약수:", a)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day17-predict-c
    title: 조건이 거짓이 되는 순간 예측하기
    kind: predict
    objective: while이 끝났을 때 변수에 남은 값을 추적한다.
    prompt: 출력되는 값을 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int n = 1;
          while (n < 100) {
              n *= 3;
          }
          printf("%d\n", n);
          return 0;
      }
    answer: "243"
    hint: "n은 1, 3, 9, 27, 81, …로 커집니다. 조건은 몸통을 실행하기 전에 검사합니다."
    explanation: "n이 81일 때 81 < 100이 참이라 한 번 더 곱해 243이 됩니다. 그다음 243 < 100이 거짓이라 끝납니다. while이 끝난 뒤의 값은 '조건을 처음으로 거짓으로 만든 값'입니다."
    commonMistakes:
      - "100보다 작은 마지막 값 81로 적음"
      - "100을 넘지 않는다고 생각함"
    language: c
    verification: run
  - id: ex-day17-predict-py
    title: 반으로 나누는 반복 예측하기
    kind: predict
    objective: 반복 횟수와 끝난 뒤의 값을 함께 추적한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      x = 10
      count = 0
      while x > 1:
          x //= 2
          count += 1
      print(x, count)
    answer: "1 3"
    hint: "10 → 5 → 2 → 1로 바뀝니다. 몇 번 나눴는지 세어 보세요."
    explanation: "10 // 2 = 5, 5 // 2 = 2, 2 // 2 = 1에서 1 > 1이 거짓이라 끝납니다. 반으로 나누는 반복의 횟수는 대략 log₂(x)이고, 이것이 이진 탐색(Day 72)이 빠른 이유입니다."
    commonMistakes:
      - "5 // 2를 2.5로 계산함"
      - "x가 0이 될 때까지 돈다고 생각함"
    language: python
    verification: run
  - id: ex-day17-fill
    title: Rust 유클리드 호제법 조건 채우기
    kind: fill
    objective: 반복을 끝낼 조건을 알고리즘의 규칙에서 찾는다.
    prompt: "빈칸을 채워 gcd(48, 18) = 6이 출력되게 하세요."
    starter: |-
      fn main() {
          let (mut a, mut b) = (48, 18);
          while b _____ 0 {
              (a, b) = (b, a % b);
          }
          println!("{a}");
      }
    answer: |-
      fn main() {
          let (mut a, mut b) = (48, 18);
          while b != 0 {
              (a, b) = (b, a % b);
          }
          println!("{a}");
      }
    output: "6"
    hint: "나머지가 0이 되면 멈춥니다. 반복은 '조건이 참인 동안' 계속되므로 '0이 아닌 동안'이라고 씁니다."
    explanation: "(48, 18) → (18, 12) → (12, 6) → (6, 0)에서 b가 0이 되어 멈추고, a = 6이 최대공약수입니다. 두 수의 최대공약수는 큰 수를 작은 수로 나눈 나머지와 작은 수의 최대공약수와 같다는 성질을 반복한 것입니다."
    commonMistakes:
      - "== 0으로 써서 한 번도 반복하지 않고 48이 출력됨"
      - "반복이 끝난 뒤 b를 출력해 0이 나옴"
    language: rust
    verification: run
  - id: ex-day17-modify
    title: 자릿수 개수에 자릿수 합 더하기
    kind: modify
    objective: 같은 while 반복 안에서 누적 변수를 하나 더 갱신한다.
    prompt: "2026의 자릿수 개수만 세는 코드에 자릿수의 합도 구하도록 고쳐 '4 10'이 출력되게 하세요."
    starter: |-
      n = 2026
      digits = 0
      while n > 0:
          n //= 10
          digits += 1
      print(digits)
    answer: |-
      n = 2026
      digits = 0
      digit_sum = 0
      while n > 0:
          digit_sum += n % 10
          n //= 10
          digits += 1
      print(digits, digit_sum)
    output: "4 10"
    hint: "맨 끝 자리는 n % 10입니다. n을 10으로 나누기 전에 더해야 합니다."
    explanation: "n % 10으로 끝자리를 꺼내 더하고, n //= 10으로 끝자리를 떼어 냅니다. 2 + 0 + 2 + 6 = 10입니다. 순서를 바꿔 먼저 나누면 끝자리를 잃어버려 합이 틀립니다."
    commonMistakes:
      - "n //= 10 뒤에 n % 10을 더해 4가 됨"
      - "반복 뒤에 n을 다시 쓰려는데 이미 0이 되어 있음"
    language: python
    verification: run
  - id: ex-day17-debug
    title: C 무한 반복 고치기
    kind: debug
    objective: 조건에 쓰이는 변수를 몸통에서 바꾸지 않아 생기는 무한 반복을 고친다.
    prompt: "1부터 5까지 더하려 했는데 프로그램이 끝나지 않습니다. 고쳐서 15가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int i = 1, sum = 0;
          while (i <= 5) {
              sum += i;
          }
          printf("%d\n", sum);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int i = 1, sum = 0;
          while (i <= 5) {
              sum += i;
              i++;
          }
          printf("%d\n", sum);
          return 0;
      }
    output: "15"
    hint: "조건 i <= 5가 언젠가 거짓이 되려면 i가 바뀌어야 합니다."
    explanation: "for는 갱신 부분이 문법에 들어 있지만, while은 몸통에서 직접 바꿔야 합니다. 이것을 빠뜨리면 조건이 영원히 참이라 무한 반복이 됩니다. 실행 중인 프로그램은 터미널에서 Ctrl + C로 멈출 수 있습니다."
    commonMistakes:
      - "i++를 printf 뒤(반복 밖)에 넣음"
      - "조건을 i < 5로 바꿔도 무한 반복은 그대로임"
    language: c
    verification: run
  - id: ex-day17-independent
    title: Rust로 목표 금액까지 몇 달 걸리나
    kind: independent
    objective: 반복 횟수가 아니라 목표 조건으로 끝나는 반복을 만든다.
    prompt: "매달 70,000원을 넣고, 넣은 뒤 잔액의 0.3%(원 단위 버림)를 이자로 받습니다. 잔액이 1,000,000원 이상이 되는 달과 그때의 잔액을 '14 1002330'으로 출력하세요."
    starter: |-
      fn main() {
          let goal = 1_000_000;
          println!("목표 {goal}원");
      }
    answer: |-
      fn main() {
          let goal: i64 = 1_000_000;
          let mut balance: i64 = 0;
          let mut month = 0;
          while balance < goal {
              month += 1;
              balance += 70_000;
              balance += balance * 3 / 1000;
          }
          println!("{month} {balance}");
      }
    output: "14 1002330"
    hint: "몇 달이 걸릴지 모르니 for가 아니라 '잔액이 목표보다 작은 동안' 반복합니다. 이자는 입금 뒤의 잔액으로 계산합니다."
    explanation: "70,000 × 14 = 980,000원을 넣었고, 쌓인 이자가 22,330원입니다. 13개월째에는 아직 목표에 못 미칩니다. 조건 balance < goal은 '목표에 도달하지 못한 동안'이라 반복이 끝나면 balance >= goal이 보장됩니다."
    commonMistakes:
      - "while balance <= goal로 써서 정확히 목표와 같을 때도 한 달 더 돎"
      - "month를 반복 뒤에 늘려 1개월 차이가 남"
    language: rust
    verification: run
quiz:
  - id: quiz-day17-01
    question: for 대신 while이 알맞은 경우는?
    choices:
      - 1부터 100까지 더할 때
      - 목록의 모든 점수를 출력할 때
      - 사용자가 0을 입력할 때까지 숫자를 읽을 때
      - 구구단 9단을 출력할 때
    answerIndex: 2
    explanation: 몇 번 입력될지 미리 알 수 없고 '0이 나올 때까지'라는 조건으로 끝나기 때문입니다. 횟수나 대상이 정해져 있으면 for가 더 간결합니다.
  - id: quiz-day17-02
    question: C의 do { ... } while (조건);과 while (조건) { ... }의 차이는?
    choices:
      - 차이가 없다
      - do-while은 몸통을 먼저 실행하고 조건을 나중에 검사해서, 적어도 한 번은 실행된다
      - do-while은 조건이 거짓인 동안 반복한다
      - while은 적어도 한 번은 실행된다
    answerIndex: 1
    explanation: while은 처음부터 조건이 거짓이면 몸통을 한 번도 실행하지 않습니다. do-while은 '메뉴를 한 번 보여 주고 다시 볼지 묻기'처럼 최소 한 번 실행해야 할 때 씁니다. do-while 끝의 세미콜론을 잊지 마세요.
  - id: quiz-day17-03
    question: while 반복이 무한 반복이 되는 가장 흔한 원인은?
    choices:
      - 조건에 괄호를 쓰지 않음
      - 조건에 쓰이는 변수를 몸통에서 바꾸지 않음
      - 몸통이 너무 김
      - 변수 이름이 짧음
    answerIndex: 1
    explanation: 조건이 거짓이 되려면 조건에 쓰인 값이 반복할 때마다 '끝나는 쪽으로' 바뀌어야 합니다. 바꾸는 줄을 빠뜨리거나, 반대 방향으로 바꾸면(i--로 i <= 5를 기다림) 끝나지 않습니다.
  - id: quiz-day17-04
    question: 센티널(sentinel) 값이란?
    choices:
      - 반복 횟수를 세는 변수
      - 입력의 끝을 알리려고 약속한 특별한 값(예 0이나 -1)
      - 가장 큰 입력값
      - 반복문의 첫 번째 값
    answerIndex: 1
    explanation: 보초라는 뜻으로, '이 값이 나오면 입력이 끝난 것'이라는 약속입니다. 센티널은 실제 데이터로 나올 수 없는 값을 골라야 합니다. 입력 자체가 끝났는지(EOF)를 검사하는 방법도 함께 씁니다.
  - id: quiz-day17-05
    question: "Python의 while True: ... break 구조가 필요한 이유는?"
    choices:
      - Python while은 조건을 쓸 수 없어서
      - 끝낼지 판단하는 데 필요한 값을 몸통 안에서 먼저 얻어야 할 때(입력 읽기 등), 조건을 몸통 중간에서 검사하려고
      - 더 빨라서
      - break 없이는 반복할 수 없어서
    answerIndex: 1
    explanation: 입력을 읽어야 0인지 알 수 있으므로, 반복을 시작하는 곳에서는 조건을 검사할 수 없습니다. 그래서 무조건 반복을 시작하고, 값을 읽은 뒤 break로 빠져나갑니다. Python에는 do-while이 없어서 이 모양으로 흉내 냅니다.
---

## 1. 오늘 배울 내용

Day 16의 `for`는 "1부터 100까지", "목록의 모든 값"처럼 **반복할 대상이 정해져 있을 때** 썼습니다. 오늘은 **언제 끝날지 미리 모를 때** 쓰는 `while`을 배웁니다.

1. `while (조건) { 몸통 }`: 조건이 참인 동안 반복합니다.
2. 반복이 **반드시 끝나도록** 조건에 쓰이는 값을 몸통에서 바꾸는 규칙과, 무한 반복의 원인.
3. 조건을 먼저 검사하는 `while`과, 몸통을 먼저 실행하는 C의 **`do-while`**.
4. **센티널 반복**: 0 같은 특별한 값이나 **입력의 끝**이 나올 때까지 읽기.
5. `break`로 반복 중간에 빠져나가기, Python의 `while True` 모양, Rust의 `while let`.
6. "끝날 때까지" 반복하는 알고리즘을 추적합니다.
   - 자릿수 분해
   - 유클리드 호제법
   - 콜라츠 수열
   - 숫자 맞히기

## 2. 왜 필요한가

현실의 반복은 횟수보다 **조건**으로 끝나는 경우가 많습니다.

- 사용자가 "종료"를 입력할 때까지 명령을 받습니다.
- 파일의 끝에 닿을 때까지 한 줄씩 읽습니다.
- 목표 금액에 도달할 때까지 매달 저축합니다.
- 정답을 맞힐 때까지 다시 추측합니다.
- 숫자가 0이 될 때까지 10으로 나눕니다(자릿수 분해).

이런 반복을 `for`로 쓰려면 "충분히 큰 횟수"를 적어 두고 중간에 빠져나와야 해서 어색합니다. `while`은 **끝나는 조건 자체**를 코드에 적어서 의도가 분명합니다. 대신 조건을 잘못 쓰면 **영원히 끝나지 않는** 프로그램이 되므로, 종료 조건을 설계하는 연습이 필요합니다.

## 3. 그림으로 이해하기

`while`은 조건을 **먼저** 검사하고, `do-while`은 몸통을 **먼저** 실행합니다.

```text
while (조건) { 몸통 }                 do { 몸통 } while (조건);

    ┌──────────┐                           ┌──────────┐
┌──▶│ 조건 검사 ├─ 거짓 ─▶ 끝            ┌──▶│   몸통    │
│   └────┬─────┘                       │   └────┬─────┘
│     참 │                             │        ▼
│   ┌────▼─────┐                       │   ┌──────────┐
│   │   몸통    │                       └─참┤ 조건 검사 ├─ 거짓 ─▶ 끝
│   └────┬─────┘                           └──────────┘
└────────┘
(처음부터 거짓이면 0번 실행)            (적어도 1번 실행)
```

반복이 끝나려면 몸통이 조건을 **거짓 쪽으로** 조금씩 움직여야 합니다. 자릿수 분해에서 `m /= 10`이 그 역할입니다.

```text
m = 90417 → 9041 → 904 → 90 → 9 → 0     (m > 0이 거짓 → 끝)
끝자리:  7      1     4    0   9
```

## 4. 천천히 풀어보기

### 4.1 세 언어의 while

```text
C                         Python                    Rust
while (m > 0) {           while m > 0:              while m > 0 {
    m /= 10;                  m //= 10                  m /= 10;
}                                                   }
```

`for`와 달리 `while`에는 **초기화와 갱신이 문법에 없습니다**. 반복 전에 변수를 준비하고, 몸통에서 직접 바꿔야 합니다.

### 4.2 종료 조건을 설계하는 세 질문

반복을 쓰기 전에 다음 세 가지를 답해 보세요.

1. **무엇이 바뀌는가?** 반복할 때마다 달라지는 값(`m`, `b`, `balance`, 입력)
2. **언제 멈추는가?** 멈추는 상태(`m == 0`, `b == 0`, `balance >= goal`, 입력이 0)
3. **반드시 거기에 도달하는가?** 바뀌는 방향이 멈추는 상태를 향하는가

`while`의 조건은 "멈추는 상태"의 **반대**로 씁니다. "m이 0이 되면 멈춘다" → `while (m > 0)`, "목표에 도달하면 멈춘다" → `while balance < goal`.

### 4.3 센티널과 입력의 끝

입력이 몇 개인지 모를 때는 두 가지 방법으로 끝을 알립니다.

- **센티널 값**: "0을 입력하면 끝"처럼 약속한 값. 실제 데이터로 나올 수 없는 값을 골라야 합니다.
- **입력의 끝(EOF)**: 파일이 끝나거나, 터미널에서 Ctrl + D(Windows는 Ctrl + Z 후 Enter)를 누르면 더 읽을 것이 없습니다.

| 언어   | "읽기에 성공하는 동안"                               | 센티널 검사            |
| ------ | ---------------------------------------------------- | ---------------------- |
| C      | `while (scanf("%d", &v) == 1)`                       | `&& v != 0`            |
| Python | `for line in sys.stdin:` 또는 `input()`이 `EOFError` | `if v == 0: break`     |
| Rust   | `while let Some(Ok(line)) = lines.next()`            | `if v == 0 { break; }` |

C의 `scanf`는 숫자를 읽으면 1, 숫자가 아닌 글자를 만나면 0, 입력이 끝나면 `EOF`(-1)를 돌려줍니다. 그래서 `== 1`로 검사하면 세 경우를 한 번에 처리합니다.

### 4.4 break와 while True

`break`는 반복을 **즉시** 끝내고 반복 다음 줄로 갑니다. "끝낼지 판단하는 데 필요한 값을 몸통 안에서 먼저 얻어야 할 때" 씁니다. 입력을 읽어야 0인지 알 수 있는 경우가 대표적입니다.

```text
while True:              ← 무조건 반복 시작
    value = int(input())
    if value == 0:
        break            ← 여기서 빠져나감
    total += value
```

Rust에는 이 모양을 위한 `loop`가 따로 있습니다(Day 18).

## 5. C로 구현하기

```c
// 파일: while_loops.c
#include <stdio.h>

int main(void) {
    // 1) 자릿수 세기와 합: 몇 번 반복할지 미리 모른다
    int n = 90417;
    int m = n, digits = 0, digit_sum = 0;
    while (m > 0) {                     // 조건이 거짓이 될 때까지
        digit_sum += m % 10;            // 맨 끝 자리
        m /= 10;                        // 맨 끝 자리를 떼어 낸다
        digits++;
    }
    printf("%d: %d자리, 자릿수 합 %d\n", n, digits, digit_sum);

    // 2) 유클리드 호제법: 나머지가 0이 될 때까지
    int a = 252, b = 105;
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    printf("gcd(252, 105) = %d\n", a);

    // 3) 콜라츠 수열: 1이 될 때까지
    int x = 6, steps = 0;
    printf("6");
    while (x != 1) {
        x = (x % 2 == 0) ? x / 2 : 3 * x + 1;
        printf(" → %d", x);
        steps++;
    }
    printf(" (%d단계)\n", steps);

    // 4) 0이 들어올 때까지 입력을 더한다(센티널)
    int value, total = 0, count = 0;
    while (scanf("%d", &value) == 1 && value != 0) {
        total += value;
        count++;
    }
    printf("입력 %d개, 합계 %d\n", count, total);

    // 5) do-while: 조건을 나중에 검사하므로 적어도 한 번 실행
    int k = 10;
    do {
        printf("do-while 몸통 실행 (k = %d)\n", k);
    } while (k < 5);
    return 0;
}
```

입력:

```text
5
12
8
0
```

실행 결과:

```text
90417: 5자리, 자릿수 합 21
gcd(252, 105) = 21
6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8단계)
입력 3개, 합계 25
do-while 몸통 실행 (k = 10)
```

### 코드 한 부분씩 읽기

| 코드                                              | 설명                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `int m = n;`                                      | 원래 값 `n`은 출력에 쓰려고 남겨 두고, 복사본 `m`을 줄여 갑니다.                                                                            |
| `digit_sum += m % 10; m /= 10;`                   | 끝자리를 꺼내 더한 **뒤에** 떼어 냅니다. 순서가 바뀌면 끝자리를 잃습니다.                                                                   |
| `while (b != 0) { int r = a % b; a = b; b = r; }` | 유클리드 호제법입니다. 나머지는 항상 나누는 수보다 작아서 `b`는 반드시 줄어들고, 결국 0이 됩니다. 반복이 끝남이 **보장**되는 예입니다.      |
| `x = (x % 2 == 0) ? x / 2 : 3 * x + 1;`           | 콜라츠 규칙입니다. 이 반복이 모든 자연수에서 1에 도달하는지는 아직 **아무도 증명하지 못한** 수학 문제입니다. 알려진 모든 수에서는 끝납니다. |
| `while (scanf("%d", &value) == 1 && value != 0)`  | 읽기에 성공했고, 그 값이 0이 아닌 동안 반복합니다. 단락 평가 덕분에 읽기에 실패하면 `value`를 검사하지 않습니다(Day 8).                     |
| `do { ... } while (k < 5);`                       | `k = 10`이라 조건은 처음부터 거짓이지만, 몸통이 **먼저** 한 번 실행됩니다. 끝의 세미콜론이 필요합니다.                                      |

## 6. Python으로 구현하기

Python에는 `do-while`이 없고, `while True`와 `break`로 같은 모양을 만듭니다. 입력의 끝을 알리는 0을 받으면 `break`로 빠져나갑니다.

```python
# 파일: while_loops.py
n = 90417
m, digits, digit_sum = n, 0, 0
while m > 0:
    digit_sum += m % 10
    m //= 10
    digits += 1
print(f"{n}: {digits}자리, 자릿수 합 {digit_sum}")

a, b = 252, 105
while b != 0:
    a, b = b, a % b                     # 여러 값 대입으로 임시 변수 없이
print(f"gcd(252, 105) = {a}")

x = 6
path = [x]
while x != 1:
    x = x // 2 if x % 2 == 0 else 3 * x + 1
    path.append(x)
print(" → ".join(str(v) for v in path), f"({len(path) - 1}단계)")

total = count = 0
while True:                             # 끝나는 조건을 몸통 안에서 검사
    value = int(input())
    if value == 0:
        break                           # 반복을 즉시 끝낸다
    total += value
    count += 1
print(f"입력 {count}개, 합계 {total}")

k = 10
while True:                             # Python에는 do-while이 없어 이렇게 흉내 낸다
    print(f"do-while 몸통 실행 (k = {k})")
    if not k < 5:
        break
```

입력:

```text
5
12
8
0
```

실행 결과:

```text
90417: 5자리, 자릿수 합 21
gcd(252, 105) = 21
6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8단계)
입력 3개, 합계 25
do-while 몸통 실행 (k = 10)
```

### 코드 한 부분씩 읽기

| 코드                             | 설명                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `m, digits, digit_sum = n, 0, 0` | 반복에 쓸 변수 셋을 한 줄에 준비합니다.                                                           |
| `a, b = b, a % b`                | 오른쪽을 먼저 계산하므로 임시 변수가 필요 없습니다(Day 4).                                        |
| `path.append(x)`                 | 지나온 값을 리스트에 모읍니다. `" → ".join(...)`으로 이어 붙여 출력합니다.                        |
| `total = count = 0`              | 두 이름이 같은 값 0을 가리킵니다. 정수라 안전합니다.                                              |
| `while True:` ... `break`        | 입력을 읽어야 0인지 알 수 있어서, 조건을 몸통 중간에서 검사합니다.                                |
| `if not k < 5: break`            | do-while `while (k < 5)`를 흉내 낸 것입니다. 몸통을 한 번 실행한 뒤 조건이 거짓이면 빠져나갑니다. |

`input()`은 입력이 끝났는데 더 읽으려 하면 `EOFError`를 냅니다. 0 없이 입력이 끝날 수도 있는 프로그램이라면 `for line in sys.stdin:`으로 읽거나, 오류를 처리하는 방법(Day 47)을 씁니다.

## 7. Rust로 구현하기

Rust의 `while`도 C와 같은 모양입니다. 입력을 줄 단위로 읽는 데는 **`while let`** 을 씁니다. "다음 줄이 있는 동안 그 줄을 꺼내서 반복하라"는 뜻입니다. Rust에는 `do-while`이 없고, 필요하면 `loop`(Day 18)를 씁니다.

```rust
// 파일: while_loops.rs
use std::io;

fn main() {
    let n = 90417;
    let (mut m, mut digits, mut digit_sum) = (n, 0, 0);
    while m > 0 {
        digit_sum += m % 10;
        m /= 10;
        digits += 1;
    }
    println!("{n}: {digits}자리, 자릿수 합 {digit_sum}");

    let (mut a, mut b) = (252, 105);
    while b != 0 {
        (a, b) = (b, a % b);
    }
    println!("gcd(252, 105) = {a}");

    let mut x = 6;
    let mut steps = 0;
    print!("6");
    while x != 1 {
        x = if x % 2 == 0 { x / 2 } else { 3 * x + 1 };
        print!(" → {x}");
        steps += 1;
    }
    println!(" ({steps}단계)");

    let mut lines = io::stdin().lines();
    let (mut total, mut count) = (0, 0);
    while let Some(Ok(line)) = lines.next() {       // 줄이 있는 동안
        let value: i32 = line.trim().parse().unwrap();
        if value == 0 {
            break;
        }
        total += value;
        count += 1;
    }
    println!("입력 {count}개, 합계 {total}");
}
```

입력:

```text
5
12
8
0
```

실행 결과:

```text
90417: 5자리, 자릿수 합 21
gcd(252, 105) = 21
6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8단계)
입력 3개, 합계 25
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `let (mut m, mut digits, mut digit_sum) = (n, 0, 0);` | 튜플 분해로 가변 바인딩 셋을 한 번에 만듭니다.                                                                                                                           |
| `(a, b) = (b, a % b);`                                | 튜플 대입으로 교환과 계산을 한 번에 합니다.                                                                                                                              |
| `x = if x % 2 == 0 { x / 2 } else { 3 * x + 1 };`     | `if` 표현식으로 다음 값을 고릅니다(Day 13).                                                                                                                              |
| `let mut lines = io::stdin().lines();`                | 표준 입력을 줄 단위로 내주는 **반복자**입니다. `next()`를 부를 때마다 다음 줄을 줍니다.                                                                                  |
| `while let Some(Ok(line)) = lines.next()`             | `next()`의 결과가 `Some(Ok(줄))` 모양인 동안 반복합니다. 입력이 끝나면 `None`, 읽기 오류면 `Some(Err(...))`라서 반복이 멈춥니다. Day 15의 패턴이 반복 조건에 쓰였습니다. |
| `if value == 0 { break; }`                            | 센티널을 만나면 빠져나갑니다.                                                                                                                                            |

## 8. 실행 추적

유클리드 호제법 `gcd(252, 105)`를 한 단계씩 따라가며, 반복이 **끝나는 쪽으로** 진행되는지 확인합니다.

| 단계 | `a` | `b` | `a % b` | 조건 `b != 0` |
| ---: | --: | --: | ------: | ------------- |
| 시작 | 252 | 105 |         | 참            |
|    1 | 105 |  42 |      42 | 참            |
|    2 |  42 |  21 |      21 | 참            |
|    3 |  21 |   0 |       0 | **거짓** → 끝 |

`b`는 105 → 42 → 21 → 0으로 **계속 줄어듭니다**. 나머지는 항상 나누는 수보다 작기 때문입니다. 줄어들다가 음수가 될 수는 없으니 언젠가 0에 닿습니다. 반복의 종료를 이렇게 "매번 줄어드는 0 이상의 값"으로 설명할 수 있으면, 그 반복은 반드시 끝납니다.

## 9. 다른 예제로 다시 이해하기

**숫자 맞히기 게임.** 컴퓨터가 정한 수(37)를 맞힐 때까지 추측을 입력받고, 추측이 크면 "작다", 작으면 "크다"를 알려 줍니다. 몇 번 만에 맞힐지 알 수 없으니 `while`입니다. 정답이면 `break`로 끝냅니다.

```c
// 파일: guess.c
#include <stdio.h>

int main(void) {
    int secret = 37, guess, tries = 0;
    while (1) {                         // 조건 1 = 항상 참
        printf("추측: ");
        if (scanf("%d", &guess) != 1) {
            printf("\n입력이 끝났습니다\n");
            return 1;
        }
        tries++;
        if (guess < secret) {
            printf("%d보다 크다\n", guess);
        } else if (guess > secret) {
            printf("%d보다 작다\n", guess);
        } else {
            printf("%d 정답! %d번 만에 맞힘\n", guess, tries);
            break;
        }
    }
    return 0;
}
```

입력:

```text
50
25
37
```

실행 결과:

```text
추측: 50보다 작다
추측: 25보다 크다
추측: 37 정답! 3번 만에 맞힘
```

입력을 파일로 흘려 보냈기 때문에 "추측: " 뒤에 입력한 수가 보이지 않습니다(Day 2). 입력이 도중에 끝나면 `scanf`가 1이 아닌 값을 돌려주므로 무한 반복에 빠지지 않고 끝납니다. **입력이 끝나는 경우**도 종료 조건에 넣어야 한다는 점이 중요합니다.

같은 게임을 Python으로 쓰면 `while` 조건에 "아직 못 맞혔다"를 직접 적을 수 있습니다.

```python
# 파일: guess.py
secret = 37
tries = 0
guess = None
while guess != secret:
    guess = int(input("추측: "))
    tries += 1
    if guess < secret:
        print(f"{guess}보다 크다")
    elif guess > secret:
        print(f"{guess}보다 작다")
print(f"{guess} 정답! {tries}번 만에 맞힘")
```

입력:

```text
50
25
37
```

실행 결과:

```text
추측: 50보다 작다
추측: 25보다 크다
추측: 37 정답! 3번 만에 맞힘
```

`guess = None`으로 시작해 첫 비교 `None != 37`이 참이 되게 했습니다. 이렇게 "아직 값이 없음"으로 시작하면 조건을 반복 맨 앞에 둘 수 있습니다. 매번 **남은 범위의 가운데**(50 → 25 → 37)를 추측하면 1~100 사이의 어떤 수든 7번 안에 맞힐 수 있습니다. 이 전략이 Day 72의 **이진 탐색**입니다.

## 10. 반복문 고르기

| 상황                                   | 알맞은 반복                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 범위·목록·문자열을 처음부터 끝까지     | `for`                                                                                           |
| 조건이 참인 동안(끝나는 시점을 모름)   | `while`                                                                                         |
| 적어도 한 번은 실행한 뒤 계속할지 결정 | C `do-while`, Python `while True`+`break`, Rust `loop`+`break`                                  |
| 입력의 끝이나 센티널까지 읽기          | C `while (scanf(...) == 1)`, Python `for line in sys.stdin` 또는 `while True`, Rust `while let` |
| 끝날 때 값을 돌려받고 싶음             | Rust `loop` + `break 값`(Day 18)                                                                |

## 11. 세 언어 비교

| 관점             | C                      | Python                         | Rust                     |
| ---------------- | ---------------------- | ------------------------------ | ------------------------ |
| 기본 모양        | `while (조건) { }`     | `while 조건:`                  | `while 조건 { }`         |
| 조건의 자료형    | 정수(0이면 거짓)       | 아무 값(truthiness)            | `bool`만                 |
| 몸통 먼저 실행   | `do { } while (조건);` | (없음, `while True` + `break`) | (없음, `loop` + `break`) |
| 무한 반복        | `while (1)`            | `while True:`                  | `loop { }`               |
| 패턴과 함께 반복 | (없음)                 | (없음)                         | `while let 패턴 = 값`    |
| 입력 끝 검사     | `scanf`의 반환값       | `EOFError`, `sys.stdin`        | `None` / `Err`           |

## 12. 자주 하는 실수

### 실수 1: 조건 변수를 바꾸지 않는다

실습의 디버그 문제입니다. `while`은 `for`와 달리 갱신이 자동이 아닙니다. 몸통에서 조건 변수를 **끝나는 방향으로** 바꾸는 줄이 있는지 확인하세요.

### 실수 2: 반대 방향으로 바꾼다

```text
int i = 10;
while (i > 0) {
    i++;           ← 10, 11, 12, ... 영원히 0보다 큼
}
```

"줄어들어야 끝나는 조건"에서 값을 늘리면 끝나지 않습니다. `int`라면 결국 넘쳐서 음수가 되어 끝나는 것처럼 보일 수도 있지만, 부호 있는 정수의 넘침은 정의되지 않은 동작입니다(Day 10).

### 실수 3: while 조건 뒤에 세미콜론을 붙인다 (C)

```c
// 파일: while_semicolon.c (컴파일 오류: this 'while' clause does not guard)
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 3);
        i++;
    printf("%d\n", i);
    return 0;
}
```

`while (i < 3);`의 세미콜론이 "빈 몸통"이 되어, `i`가 바뀌지 않는 무한 반복이 됩니다. 들여쓰기에 속지 마세요.

### 실수 4: 입력이 끝나는 경우를 생각하지 않는다

"0을 입력하면 끝"이라는 프로그램에 0 없이 입력이 끝나면 어떻게 될까요? C에서 `while (value != 0) scanf(...)`처럼 반환값을 검사하지 않으면, 읽기에 실패한 뒤에도 `value`가 그대로라 무한 반복에 빠집니다. **읽기가 성공했는지**를 반드시 함께 검사하세요.

### 실수 5: 실수를 == 로 비교해 끝을 기다린다

```python
# 파일: float_loop.py
x = 0.0
steps = 0
while x < 1.0:        # x != 1.0으로 쓰면 영원히 끝나지 않는다
    x += 0.1
    steps += 1
print(steps, x)
```

실행 결과:

```text
11 1.0999999999999999
```

0.1을 열 번 더해도 정확히 1.0이 되지 않으므로(Day 11) `while x != 1.0`은 영원히 끝나지 않습니다. `<`로 써도 오차 때문에 한 번 더 돌아 11번이 되었습니다. 반복 횟수가 중요하면 **정수**로 세고 실수는 계산해서 만드세요(`x = i * 0.1`).

## 13. Q&A

**Q. 무한 반복에 빠진 프로그램은 어떻게 멈추나요?**

A. 터미널에서 **Ctrl + C**를 누르면 프로그램이 강제로 끝납니다. 이 사이트의 Python 실행 칸은 일정 시간이 지나면 자동으로 멈춥니다. 무한 반복이 의심되면 몸통에 `print`를 넣어 조건 변수가 어떻게 바뀌는지 확인하세요.

**Q. 일부러 무한 반복을 쓰기도 하나요?**

A. 네. 서버, 게임, 운영체제처럼 "꺼질 때까지 계속 요청을 기다리는" 프로그램은 무한 반복이 기본 구조입니다. 이때도 안에 `break`나 종료 신호를 처리하는 코드가 있습니다.

**Q. `while`로 쓴 반복을 `for`로 바꿀 수 있나요?**

A. 횟수가 정해져 있다면 대부분 바꿀 수 있고, 바꾸는 편이 읽기 쉽습니다. 반대로 `for`는 모두 `while`로 쓸 수 있습니다(`for (초기화; 조건; 갱신)`은 초기화, `while (조건) { 몸통; 갱신; }`과 같습니다). "끝나는 조건이 무엇인가"가 코드에 잘 드러나는 쪽을 고르세요.

**Q. 콜라츠 반복이 끝나지 않는 수가 있을 수도 있나요?**

A. 지금까지 컴퓨터로 확인한 아주 큰 수까지는 모두 1에 도달했지만, 모든 자연수에서 끝난다는 증명은 없습니다. 반복이 끝나는지 증명하는 것이 일반적으로 매우 어렵다는 좋은 예입니다. 그래서 우리가 쓰는 반복은 유클리드 호제법처럼 "매번 줄어드는 값"으로 종료를 설명할 수 있게 만드는 것이 좋습니다.

## 14. 핵심 요약

- `while`은 조건이 참인 동안 반복합니다. 반복 횟수를 모를 때 씁니다.
- 초기화와 갱신은 직접 씁니다. 조건에 쓰인 값을 몸통에서 **끝나는 방향으로** 바꾸지 않으면 무한 반복이 됩니다.
- C의 `do-while`은 몸통을 먼저 실행해서 적어도 한 번 실행됩니다. Python은 `while True` + `break`, Rust는 `loop` + `break`로 대신합니다.
- 입력은 센티널 값이나 입력의 끝(EOF)까지 읽습니다. C는 `scanf(...) == 1`, Rust는 `while let Some(Ok(line))`로 읽기 성공 여부를 함께 검사합니다.
- `break`는 반복을 즉시 끝냅니다.
- 반복의 종료는 "매번 줄어드는 0 이상의 값"(유클리드 호제법의 `b`)으로 설명할 수 있으면 안전합니다. 실수를 `==`로 비교해 끝을 기다리지 마세요.

## 15. 도전 문제

1. **(C)** 양의 정수를 입력받아 숫자를 거꾸로 뒤집은 수를 출력하세요(12345 → 54321). `while`과 `% 10`, `/ 10`을 씁니다.
2. **(Python)** 비밀번호를 최대 3번까지 입력받아, 맞으면 "로그인 성공", 3번 모두 틀리면 "잠금"을 출력하세요. 반복 조건에 시도 횟수와 성공 여부를 함께 쓰세요.
3. **(Rust)** 1부터 20까지 각 수의 콜라츠 단계 수를 구하고, 가장 많은 단계가 걸리는 수를 찾으세요(`for` 안에 `while`).
4. **(세 언어)** 숫자들을 입력받다가 음수가 나오면 멈추고, 그때까지의 최댓값·최솟값·평균을 출력하세요. 음수 없이 입력이 끝나는 경우도 처리하세요.
