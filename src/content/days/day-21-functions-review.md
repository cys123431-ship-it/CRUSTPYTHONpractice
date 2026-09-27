---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-21-functions-review
courseId: crp-92
phaseId: phase-02
dayNumber: 21
date: "2026-10-21"
title: 반복과 함수 복습 — 작은 함수를 반복으로 엮기
summary: Day 16~20에서 배운 for·while·loop, break·continue, 중첩 반복, 함수의 매개변수와 반환값을 하나의 프로그램(성적 처리기)으로 묶어 세 언어로 다시 만듭니다. 입력을 센티널까지 읽는 반복, 한 줄을 처리하는 작은 함수, 반복하며 최댓값과 개수를 누적하는 패턴을 연결하고, 숫자 뒤집기와 회문수, 자릿수 근처럼 반복을 함수 안에 넣고 함수를 반복에서 부르는 구조를 연습합니다. 반복·함수에서 자주 나오는 버그를 점검표로 정리합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-20-c-functions]
learningObjectives:
  - 입력 → 한 줄 처리 → 누적 → 요약 출력의 흐름을 반복과 함수로 나눠 세 언어로 구현한다.
  - 문제에 맞는 반복(for, while, loop)과 흐름 제어(break, continue, return)를 고른다.
  - 반복을 함수 안에 넣고(숫자 뒤집기), 함수를 반복 안에서 부르는(회문수 찾기) 구조를 만든다.
  - 누적 변수의 초기화 위치, 반복 경계, 반환 위치 같은 흔한 버그를 점검표로 찾는다.
  - 같은 입력에 대해 세 언어의 출력이 같은지 비교해 구현을 검증한다.
concepts:
  [
    review,
    loop,
    function,
    accumulator,
    sentinel,
    early return,
    helper function,
    palindrome,
    digital root,
    decomposition,
  ]
runnerMode: python
playgroundSource: |
  # 파일: review.py — 함수를 바꾸고 반복에서 불러 보세요.
  def reverse_number(n):
      result = 0
      while n > 0:
          result = result * 10 + n % 10
          n //= 10
      return result

  for n in (121, 123, 4554, 1200):
      print(n, reverse_number(n), n == reverse_number(n))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day21-predict-py
    title: 함수 안의 반복과 continue 예측하기
    kind: predict
    objective: 함수 안에서 continue로 건너뛰며 누적한 결과를 추적한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      def f(n):
          total = 0
          for i in range(n):
              if i % 2:
                  continue
              total += i
          return total


      print(f(5), f(6))
    answer: "6 6"
    hint: "i % 2가 1(참)이면 건너뜁니다. 즉 짝수만 더합니다. range(5)와 range(6)의 짝수를 비교해 보세요."
    explanation: "f(5)는 0 + 2 + 4 = 6, f(6)도 0 + 2 + 4 = 6입니다. range(6)에 새로 들어온 5는 홀수라 건너뜁니다. 함수를 부를 때마다 total은 0에서 새로 시작합니다."
    commonMistakes:
      - "f(6)에서 6까지 더해 12로 적음(range는 끝값을 포함하지 않음)"
      - "i % 2를 '짝수이면 참'으로 읽음"
    language: python
    verification: run
  - id: ex-day21-predict-c
    title: 중첩 반복 안의 함수 호출 횟수 예측하기
    kind: predict
    objective: 중첩 반복에서 함수가 몇 번 불리고 무엇을 돌려주는지 센다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int calls = 0;

      int twice(int x) {
          calls++;
          return 2 * x;
      }

      int main(void) {
          int s = 0;
          for (int i = 0; i < 3; i++) {
              for (int j = 0; j < 2; j++) {
                  s += twice(j);
              }
          }
          printf("%d %d\n", s, calls);
          return 0;
      }
    answer: "6 6"
    hint: "안쪽 몸통은 3 × 2 = 6번 실행되고, 그때마다 twice(0) 또는 twice(1)이 불립니다."
    explanation: "i마다 twice(0) = 0, twice(1) = 2가 더해져 한 줄에 2, 세 줄이라 6입니다. calls는 함수 밖(전역)에 있는 변수라 호출될 때마다 1씩 늘어 6이 됩니다. 전역 변수는 호출 횟수 세기처럼 간단한 곳에만 쓰세요."
    commonMistakes:
      - "twice(i)로 착각해 계산함"
      - "calls를 3(바깥 횟수)으로 적음"
    language: c
    verification: run
  - id: ex-day21-fill
    title: Rust 합계 함수의 범위 채우기
    kind: fill
    objective: 함수 안의 반복 범위를 매개변수로 정한다.
    prompt: "빈칸을 채워 sum_to(10)이 1부터 10까지의 합 55를 돌려주게 하세요."
    starter: |-
      fn sum_to(n: u32) -> u32 {
          let mut s = 0;
          for k in _____ {
              s += k;
          }
          s
      }

      fn main() {
          println!("{}", sum_to(10));
      }
    answer: |-
      fn sum_to(n: u32) -> u32 {
          let mut s = 0;
          for k in 1..=n {
              s += k;
          }
          s
      }

      fn main() {
          println!("{}", sum_to(10));
      }
    output: "55"
    hint: "1부터 n까지(n 포함)입니다."
    explanation: "1..n으로 쓰면 n이 빠져 45가 됩니다. 함수의 매개변수를 반복 범위에 쓰면, 같은 함수가 n마다 다른 횟수로 반복합니다. 마지막 줄 s에 세미콜론이 없어 반환값이 됩니다."
    commonMistakes:
      - "1..n으로 써서 45가 나옴"
      - "0..n으로 써서 역시 45가 나옴"
    language: rust
    verification: run
  - id: ex-day21-modify
    title: 범위 안의 개수를 세는 함수로 일반화하기
    kind: modify
    objective: 고정된 조건을 매개변수로 바꿔 함수를 더 쓸모 있게 만든다.
    prompt: "양수의 개수만 세는 함수를 count_in_range(nums, lo, hi)로 바꿔, lo 이상 hi 이하인 값의 개수를 돌려주게 하세요. [5, 12, 0, 7, 20, -3]에서 1~10은 2개입니다."
    starter: |-
      def count_positive(nums):
          count = 0
          for x in nums:
              if x > 0:
                  count += 1
          return count


      print(count_positive([5, 12, 0, 7, 20, -3]))
    answer: |-
      def count_in_range(nums, lo, hi):
          count = 0
          for x in nums:
              if lo <= x <= hi:
                  count += 1
          return count


      print(count_in_range([5, 12, 0, 7, 20, -3], 1, 10))
    output: "2"
    hint: "조건에 들어 있던 숫자 0을 매개변수 lo, hi로 바꾸세요. 경계를 포함하는 연쇄 비교를 쓰면 됩니다."
    explanation: "5와 7만 1~10 사이입니다. 조건을 매개변수로 빼면 '양수 개수'(lo=1, hi=아주 큰 수), '합격자 수'(lo=70, hi=100)처럼 여러 곳에 같은 함수를 쓸 수 있습니다."
    commonMistakes:
      - "lo < x < hi로 써서 경계값이 빠짐"
      - "함수 이름만 바꾸고 부르는 곳을 고치지 않아 NameError가 남"
    language: python
    verification: run
  - id: ex-day21-debug
    title: 반복 안의 return 위치 고치기
    kind: debug
    objective: return이 반복 안에 있으면 첫 차례에서 함수가 끝난다는 것을 확인한다.
    prompt: "배열 {3, 2, 4, 1}의 합 10을 구하려 했는데 3이 출력됩니다. 고치세요."
    starter: |-
      #include <stdio.h>

      int sum_array(int a[], int n) {
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
              return s;
          }
          return s;
      }

      int main(void) {
          int nums[] = {3, 2, 4, 1};
          printf("%d\n", sum_array(nums, 4));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int sum_array(int a[], int n) {
          int s = 0;
          for (int i = 0; i < n; i++) {
              s += a[i];
          }
          return s;
      }

      int main(void) {
          int nums[] = {3, 2, 4, 1};
          printf("%d\n", sum_array(nums, 4));
          return 0;
      }
    output: "10"
    starterOutput: "3"
    hint: "return은 함수 전체를 즉시 끝냅니다. 반복의 첫 차례에서 무엇이 일어나는지 보세요."
    explanation: "반복 안의 return 때문에 첫 값 3을 더하자마자 함수가 끝났습니다. '모두 본 뒤에 결과를 돌려주는' 함수는 return을 반복 밖에 둡니다. 반대로 소수 판별처럼 '찾으면 바로 끝내는' 함수는 반복 안의 return이 맞습니다. 배열을 함수에 넘기는 방법은 Day 34에서 자세히 배웁니다."
    commonMistakes:
      - "반복 안의 return을 break로 바꿔 결과는 맞지만 이유를 모름"
      - "두 번째 return을 지워 컴파일 경고(오류)가 남"
    language: c
    verification: run
  - id: ex-day21-independent
    title: Rust로 세 자리 회문수 세기
    kind: independent
    objective: 숫자를 뒤집는 함수와 판별 함수를 만들어 반복에서 부른다.
    prompt: "reverse_number와 is_palindrome 함수를 만들어 100부터 999까지 회문수(거꾸로 읽어도 같은 수)의 개수 90을 출력하세요."
    starter: |-
      fn main() {
          println!("?");
      }
    answer: |-
      fn reverse_number(mut n: u32) -> u32 {
          let mut result = 0;
          while n > 0 {
              result = result * 10 + n % 10;
              n /= 10;
          }
          result
      }

      fn is_palindrome(n: u32) -> bool {
          n == reverse_number(n)
      }

      fn main() {
          let mut count = 0;
          for n in 100..=999 {
              if is_palindrome(n) {
                  count += 1;
              }
          }
          println!("{count}");
      }
    output: "90"
    hint: "뒤집기는 끝자리를 떼어 결과의 뒤에 붙이는 반복입니다: result = result * 10 + n % 10."
    explanation: "세 자리 회문수는 첫 자리(1~9)와 가운데 자리(0~9)만 정하면 끝자리가 정해지므로 9 × 10 = 90개입니다. 반복으로 센 값과 계산이 같으니 함수가 맞게 동작한다고 믿을 수 있습니다. 매개변수 n을 함수 안에서 줄이려고 mut n으로 받았습니다."
    commonMistakes:
      - "뒤집을 때 result를 반복 안에서 0으로 초기화함"
      - "원래 n을 이미 0으로 줄인 뒤 비교해 모두 거짓이 됨"
    language: rust
    verification: run
quiz:
  - id: quiz-day21-01
    question: "입력을 'END'가 나올 때까지 읽는 반복에 가장 알맞은 것은?"
    choices:
      - for i in range(100)
      - 센티널을 검사하는 while(또는 while True + break)
      - 중첩 for
      - 재귀 함수
    answerIndex: 1
    explanation: 몇 줄이 들어올지 모르고 'END'라는 약속된 값(센티널)으로 끝나므로 while이 알맞습니다(Day 17). 입력이 END 없이 끝나는 경우도 함께 처리하면 더 안전합니다.
  - id: quiz-day21-02
    question: 반복하며 최댓값을 찾을 때 '최고 점수 학생의 이름'도 함께 기억하려면?
    choices:
      - 반복이 끝난 뒤 최댓값으로 이름을 다시 찾는다
      - 최댓값을 갱신하는 같은 if 안에서 이름도 함께 갱신한다
      - 이름은 기억할 수 없다
      - 모든 이름을 출력한다
    answerIndex: 1
    explanation: "if avg > best_avg: best_name, best_avg = name, avg처럼 값과 관련 정보를 한 번에 갱신합니다. 따로 갱신하면 서로 다른 학생의 값이 섞일 수 있습니다."
  - id: quiz-day21-03
    question: 함수 안의 반복에서 return의 위치에 대한 설명으로 옳은 것은?
    choices:
      - return은 항상 반복 안에 둔다
      - 모든 값을 본 뒤 결과를 돌려준다면 반복 밖에, 찾자마자 끝낸다면 반복 안에 둔다
      - return은 반복을 한 번만 끝낸다
      - 반복 안의 return은 continue와 같다
    answerIndex: 1
    explanation: return은 반복뿐 아니라 함수 전체를 끝냅니다. 합계는 반복 밖에서, 소수 판별의 '약수 발견'은 반복 안에서 return합니다.
  - id: quiz-day21-04
    question: 같은 입력에 대해 C, Python, Rust 구현의 출력이 같은지 비교하는 이유는?
    choices:
      - 컴파일 속도를 비교하려고
      - 서로 독립적으로 만든 구현이 같은 결과를 내면, 규칙을 올바르게 옮겼다고 더 믿을 수 있어서
      - 언어마다 출력이 반드시 달라야 해서
      - 코드 길이를 비교하려고
    answerIndex: 1
    explanation: 한 구현에만 있는 실수(정수 나눗셈, 반올림 방식, 경계)가 결과 차이로 드러납니다. 이 과정의 마지막 프로젝트(Day 91)도 세 구현의 결과를 비교합니다.
  - id: quiz-day21-05
    question: 숫자 1200을 뒤집는 함수 reverse_number가 21을 돌려주는 이유는?
    choices:
      - 함수에 버그가 있어서
      - 정수는 앞자리의 0을 저장하지 않아서, 0021이 21이 되기 때문에
      - 1200이 회문수라서
      - 오버플로 때문에
    answerIndex: 1
    explanation: 0, 0, 2, 1 순서로 결과에 붙이면 0 → 0 → 2 → 21이 됩니다. 정수에는 '앞에 붙은 0'이 없습니다. 앞자리 0까지 살리려면 숫자를 문자열로 다뤄야 합니다(Day 38).
---

## 1. 오늘 배울 내용

Day 16~20에서 반복과 함수를 따로 배웠습니다. 오늘은 둘을 **엮어서** 하나의 프로그램을 만들고, 반복과 함수에서 자주 나오는 버그를 점검합니다.

1. Day 16~20의 핵심을 표 한 장으로 복습합니다.
2. **성적 처리기**를 세 언어로 만듭니다. 흐름은 다음과 같습니다.
   - 입력을 센티널(`END`)까지 읽습니다.
   - 한 줄씩 함수로 처리합니다.
   - 최댓값과 합격자 수를 누적합니다.
   - 요약을 출력합니다.
3. **반복을 함수 안에**(숫자 뒤집기), **함수를 반복 안에서**(회문수 찾기) 쓰는 구조를 연습합니다.
4. 자릿수를 계속 더해 한 자리로 만드는 **자릿수 근**으로 `while`과 함수를 함께 씁니다.
5. 반복·함수 버그를 **점검표**로 정리합니다.

## 2. 왜 필요한가

실제 프로그램은 반복 하나, 함수 하나로 끝나지 않습니다. "여러 줄을 읽으며(반복), 줄마다 같은 계산을 하고(함수), 결과를 모은다(누적)"는 구조가 거의 모든 데이터 처리 프로그램의 뼈대입니다. 이 뼈대를 익혀 두면 성적표, 가계부, 로그 분석, 마지막 프로젝트의 CSV 집계(Day 83~92)까지 같은 방식으로 만들 수 있습니다.

또 반복과 함수가 만나면 새로운 종류의 실수가 생깁니다. 반복 안의 `return`, 함수 안에서 매번 초기화되는 누적 변수, 호출할 때마다 새로 만들어지는 지역 변수를 헷갈리는 것 등입니다. 복습하면서 이런 실수를 점검해 봅시다.

## 3. 그림으로 이해하기

성적 처리기는 세 층으로 나눠 생각합니다.

```text
┌────────────────────────── main (흐름) ──────────────────────────┐
│  제목 출력                                                      │
│  반복: 한 줄 읽기 ── "END"면 break                              │
│      │                                                         │
│      ├─▶ average3(a, b, c)  ──▶ 평균            ┐ 작은 함수     │
│      ├─▶ grade(avg)         ──▶ 등급 글자       ┘ (계산만)      │
│      ├─ 한 줄 출력                                              │
│      └─ 누적: 최고 평균·이름 갱신, 합격자 수 + 1                 │
│  요약 출력                                                      │
└─────────────────────────────────────────────────────────────────┘
```

- **작은 함수**(`average3`, `grade`)는 입력을 받아 값을 돌려주기만 합니다. 출력하지 않습니다.
- **main**은 입력, 반복, 누적, 출력이라는 **흐름**을 맡습니다.

이렇게 나누면 `grade`의 경계만 따로 시험할 수 있고, 등급 기준이 바뀌어도 `grade` 한 곳만 고치면 됩니다.

## 4. 천천히 풀어보기

### 4.1 Day 16~20 핵심 정리

| Day | 주제                  | 꼭 기억할 것                                                                                          |
| --: | --------------------- | ----------------------------------------------------------------------------------------------------- |
|  16 | for와 누적            | `range(a, b)`, `a..b`는 끝 제외. 누적 변수는 반복 밖에서 0(합), 1(곱), 첫 값(최대)으로 시작.          |
|  17 | while과 종료 조건     | 조건 변수를 끝나는 방향으로 바꾸기. 센티널과 입력의 끝. `do-while`은 적어도 한 번.                    |
|  18 | loop, break, continue | `break`는 가장 가까운 반복 하나. Rust `loop`는 `break 값`. 이중 반복 탈출은 `'outer`, 깃발, `return`. |
|  19 | 중첩 반복             | 바깥 한 번마다 안쪽 전체. 줄은 바깥, 칸은 안쪽. 몸통 횟수는 곱해짐.                                   |
|  20 | 함수                  | 매개변수·반환값. 값으로 복사해 전달. 모든 경로에서 `return`. Rust는 마지막 식이 반환값.               |

### 4.2 반복과 흐름 제어 고르기

| 상황                                       | 도구                                   |
| ------------------------------------------ | -------------------------------------- |
| 범위·목록을 처음부터 끝까지                | `for`                                  |
| 끝나는 시점을 모르는 반복(입력, 목표 도달) | `while`, `while True`/`loop` + `break` |
| 이 값은 처리하지 않고 다음으로             | `continue`                             |
| 찾자마자 반복만 끝냄                       | `break`                                |
| 찾자마자 함수 전체를 끝내고 결과를 돌려줌  | `return` (반복 안)                     |
| 모두 본 뒤 결과를 돌려줌                   | `return` (반복 밖)                     |

### 4.3 반복과 함수가 만날 때

**함수 안의 지역 변수는 호출할 때마다 새로 만들어집니다.** `def f(n): total = 0 ...`의 `total`은 `f(5)`를 부를 때도, `f(6)`을 부를 때도 0에서 시작합니다. 반면 C의 **전역 변수**(`int calls = 0;`을 함수 밖에 둔 것)는 프로그램 내내 하나라서 호출이 거듭될수록 값이 쌓입니다.

**함수의 매개변수를 반복에 쓰면** 같은 함수가 호출마다 다른 횟수로 반복합니다. `sum_to(n)`의 `for k in 1..=n`이 그 예입니다.

**함수를 반복 안에서 부르면** 반복 횟수 × 함수 한 번의 비용만큼 일이 늘어납니다. `is_prime`을 1~100에 대해 부르는 것은 100번의 호출이고, 각 호출 안에서도 반복이 있으니 **중첩 반복과 같은 구조**입니다(Day 19).

### 4.4 버그 점검표

프로그램이 이상하면 다음을 차례로 확인하세요.

1. **반복 경계**: 첫 값과 마지막 값이 맞나? `<`와 `<=`, `range`의 끝값, `..`와 `..=`.
2. **누적 변수 위치**: 반복 밖에서 초기화했나? "줄마다"라면 바깥 몸통의 맨 앞에서?
3. **조건 변수 갱신**: `while`의 조건에 쓰인 값이 끝나는 방향으로 바뀌나? `continue`가 갱신을 건너뛰지 않나?
4. **return 위치**: 반복 안에서 너무 일찍 돌려주지 않나? 모든 경로에서 돌려주나?
5. **print와 return**: 함수가 결과를 돌려주나, 화면에 보여 주기만 하나?
6. **값의 복사**: 함수 안에서 매개변수를 바꿔 놓고 부른 쪽이 바뀌길 기대하지 않나?

## 5. C로 구현하기

C는 이름을 문자 배열에 읽고, 최고 점수 학생의 이름은 `strcpy`로 **복사해 둡니다**. `name` 배열은 다음 줄을 읽을 때 덮어써지기 때문입니다.

```c
// 파일: report.c
#include <stdio.h>
#include <string.h>

#define PASS_LINE 70

double average3(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

char grade(double avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

int main(void) {
    char name[20], best_name[20] = "";
    int a, b, c, passed = 0;
    double best_avg = -1.0;

    printf("%-8s%6s  grade\n", "name", "avg");
    while (scanf("%19s", name) == 1 && strcmp(name, "END") != 0) {
        if (scanf("%d %d %d", &a, &b, &c) != 3) {
            return 1;                       // 점수가 모자라면 잘못된 입력
        }
        double avg = average3(a, b, c);
        printf("%-8s%6.1f  %c\n", name, avg, grade(avg));
        if (avg > best_avg) {
            best_avg = avg;
            strcpy(best_name, name);        // 문자열 복사(Day 37)
        }
        if (avg >= PASS_LINE) {
            passed++;
        }
    }
    printf("---------------------\n");
    printf("최고 평균: %s (%.1f)\n", best_name, best_avg);
    printf("합격(평균 %d 이상): %d명\n", PASS_LINE, passed);
    return 0;
}
```

입력:

```text
minji 92 88 95
junho 75 60 82
seoyeon 58 71 64
haneul 100 97 99
END
```

실행 결과:

```text
name       avg  grade
minji     91.7  A
junho     72.3  C
seoyeon   64.3  D
haneul    98.7  A
---------------------
최고 평균: haneul (98.7)
합격(평균 70 이상): 3명
```

### 코드 한 부분씩 읽기

| 코드                                                                 | 설명(복습한 Day)                                                                                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `double average3(int a, int b, int c) { return (a + b + c) / 3.0; }` | `3.0`으로 나눠 실수 평균을 얻습니다(Day 6, 20).                                                                                   |
| `if (avg >= 90) return 'A';` …                                       | 이른 반환을 차례로 써서 사다리를 만들었습니다. `else`가 필요 없습니다(Day 13, 20).                                                |
| `while (scanf("%19s", name) == 1 && strcmp(name, "END") != 0)`       | 이름을 읽는 데 성공했고, 그것이 `"END"`가 아닌 동안 반복합니다. 입력이 도중에 끝나도 `scanf`가 1이 아니라서 멈춥니다(Day 12, 17). |
| `if (scanf("%d %d %d", ...) != 3) return 1;`                         | 점수가 모자라면 잘못된 입력으로 끝냅니다.                                                                                         |
| `if (avg > best_avg) { best_avg = avg; strcpy(best_name, name); }`   | 최댓값과 이름을 **같은 조건**에서 함께 갱신합니다. `best_avg`를 `-1.0`으로 시작해 첫 학생이 반드시 들어가게 했습니다(Day 16).     |
| `%-8s%6.1f`                                                          | 이름 8칸 왼쪽, 평균 6칸 오른쪽입니다. 이름을 영문으로 쓴 이유는 C가 바이트 수로 칸을 맞추기 때문입니다(Day 9).                    |

## 6. Python으로 구현하기

```python
# 파일: report.py
PASS_LINE = 70


def average3(a, b, c):
    return (a + b + c) / 3


def grade(avg):
    if avg >= 90:
        return "A"
    if avg >= 80:
        return "B"
    if avg >= 70:
        return "C"
    if avg >= 60:
        return "D"
    return "F"


def main():
    print(f"{'name':<8}{'avg':>6}  grade")
    best_name, best_avg = "", -1.0
    passed = 0
    while True:
        line = input()
        if line == "END":                     # 센티널
            break
        name, *scores = line.split()          # 첫 단어는 이름, 나머지는 점수
        a, b, c = (int(s) for s in scores)
        avg = average3(a, b, c)
        print(f"{name:<8}{avg:>6.1f}  {grade(avg)}")
        if avg > best_avg:
            best_name, best_avg = name, avg
        if avg >= PASS_LINE:
            passed += 1
    print("-" * 21)
    print(f"최고 평균: {best_name} ({best_avg:.1f})")
    print(f"합격(평균 {PASS_LINE} 이상): {passed}명")


main()
```

입력:

```text
minji 92 88 95
junho 75 60 82
seoyeon 58 71 64
haneul 100 97 99
END
```

실행 결과:

```text
name       avg  grade
minji     91.7  A
junho     72.3  C
seoyeon   64.3  D
haneul    98.7  A
---------------------
최고 평균: haneul (98.7)
합격(평균 70 이상): 3명
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명(복습한 Day)                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `def main():` … `main()`                  | 흐름 전체를 함수로 묶었습니다. 변수들이 `main`의 지역 변수가 되어 다른 함수와 섞이지 않습니다(Day 3, 23).    |
| `while True:` … `if line == "END": break` | 센티널을 만나면 빠져나갑니다(Day 17, 18).                                                                    |
| `name, *scores = line.split()`            | 첫 단어는 `name`에, 나머지는 `scores` 리스트에 모읍니다. Day 15의 `["take", *items]` 패턴과 같은 생각입니다. |
| `a, b, c = (int(s) for s in scores)`      | 점수 세 개를 정수로 바꿔 나눠 받습니다. 점수가 세 개가 아니면 `ValueError`가 납니다.                         |
| `best_name, best_avg = name, avg`         | 두 값을 한 번에 갱신합니다.                                                                                  |
| `f"{name:<8}{avg:>6.1f}  {grade(avg)}"`   | 중괄호 안에서 함수를 바로 불렀습니다.                                                                        |

## 7. Rust로 구현하기

```rust
// 파일: report.rs
use std::io;

const PASS_LINE: f64 = 70.0;

fn average3(a: i32, b: i32, c: i32) -> f64 {
    (a + b + c) as f64 / 3.0
}

fn grade(avg: f64) -> char {
    if avg >= 90.0 {
        'A'
    } else if avg >= 80.0 {
        'B'
    } else if avg >= 70.0 {
        'C'
    } else if avg >= 60.0 {
        'D'
    } else {
        'F'
    }
}

fn main() {
    println!("{:<8}{:>6}  grade", "name", "avg");
    let mut best_name = String::new();
    let mut best_avg = -1.0;
    let mut passed = 0;
    for line in io::stdin().lines() {
        let line = line.unwrap();
        if line == "END" {
            break;
        }
        let parts: Vec<&str> = line.split_whitespace().collect();
        let name = parts[0];
        let a: i32 = parts[1].parse().unwrap();
        let b: i32 = parts[2].parse().unwrap();
        let c: i32 = parts[3].parse().unwrap();
        let avg = average3(a, b, c);
        println!("{name:<8}{avg:>6.1}  {}", grade(avg));
        if avg > best_avg {
            best_avg = avg;
            best_name = name.to_string();
        }
        if avg >= PASS_LINE {
            passed += 1;
        }
    }
    println!("{}", "-".repeat(21));
    println!("최고 평균: {best_name} ({best_avg:.1})");
    println!("합격(평균 {PASS_LINE} 이상): {passed}명");
}
```

입력:

```text
minji 92 88 95
junho 75 60 82
seoyeon 58 71 64
haneul 100 97 99
END
```

실행 결과:

```text
name       avg  grade
minji     91.7  A
junho     72.3  C
seoyeon   64.3  D
haneul    98.7  A
---------------------
최고 평균: haneul (98.7)
합격(평균 70 이상): 3명
```

### 코드 한 부분씩 읽기

| 코드                                                        | 설명(복습한 Day)                                                                                                                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `const PASS_LINE: f64 = 70.0;`                              | 비교 대상인 `avg`가 `f64`라서 상수도 `f64`로 만들었습니다. `{PASS_LINE}`으로 출력하면 `70`으로 보입니다(Day 11).                                                  |
| `fn grade(avg: f64) -> char { if ... { 'A' } else if ... }` | `if` 표현식 전체가 반환값입니다(Day 13, 20).                                                                                                                      |
| `for line in io::stdin().lines()`                           | 입력 줄을 하나씩 돌고, `"END"`면 `break`합니다. 입력이 끝나면 반복도 끝납니다.                                                                                    |
| `let parts: Vec<&str> = ... .collect();`                    | 한 줄을 단어 목록으로 만들고 `parts[0]`, `parts[1]`처럼 칸으로 읽습니다.                                                                                          |
| `best_name = name.to_string();`                             | `name`은 이번 줄 `line`을 **빌린** 조각이라, 줄이 바뀌면 사라집니다. 오래 기억하려면 자기 소유의 `String`으로 복사합니다. C의 `strcpy`와 같은 이유입니다(Day 39). |

세 언어의 출력이 글자 하나까지 같습니다. 반올림 규칙(`.1`, `%.1f`)과 정수·실수 나눗셈을 모두 같게 맞췄기 때문입니다.

## 8. 실행 추적

입력을 한 줄씩 처리하며 누적 변수가 어떻게 바뀌는지 따라갑니다.

| 줄               | `avg` | `grade` | `avg > best_avg`? | `best_name` | `best_avg` | `passed` |
| ---------------- | ----: | :-----: | ----------------- | ----------- | ---------: | -------: |
| (시작)           |       |         |                   | `""`        |       -1.0 |        0 |
| minji 92 88 95   |  91.7 |    A    | 참                | minji       |       91.7 |        1 |
| junho 75 60 82   |  72.3 |    C    | 거짓              | minji       |       91.7 |        2 |
| seoyeon 58 71 64 |  64.3 |    D    | 거짓              | minji       |       91.7 |        2 |
| haneul 100 97 99 |  98.7 |    A    | 참                | haneul      |       98.7 |        3 |
| END              |       |         | (`break`)         |             |            |          |

`seoyeon`은 평균 64.3으로 70 미만이라 `passed`가 늘지 않았습니다. 표를 그려 보면 요약 출력의 값이 어디서 왔는지 분명해집니다.

## 9. 다른 예제로 다시 이해하기

**숫자 뒤집기와 회문수.** 반복을 함수 안에 넣은 `reverse_number`와, 그 함수를 쓰는 `is_palindrome`을 만들고, 반복에서 `is_palindrome`을 불러 100~200의 회문수를 찾습니다.

```python
# 파일: palindrome.py
def reverse_number(n):
    result = 0
    while n > 0:
        result = result * 10 + n % 10       # 끝자리를 결과의 뒤에 붙인다
        n //= 10
    return result


def is_palindrome(n):
    return n == reverse_number(n)


found = []
for n in range(100, 201):
    if is_palindrome(n):
        found.append(n)
print(reverse_number(12345), reverse_number(1200))
print("100~200의 회문수:", found)
print("개수:", len(found))
```

실행 결과:

```text
54321 21
100~200의 회문수: [101, 111, 121, 131, 141, 151, 161, 171, 181, 191]
개수: 10
```

| 부분                            | 설명                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `result = result * 10 + n % 10` | 지금까지의 결과를 한 자리 왼쪽으로 밀고(× 10), 떼어 낸 끝자리를 붙입니다. 12345 → 5 → 54 → 543 → 5432 → 54321.      |
| `reverse_number(1200)` → `21`   | 0, 0, 2, 1이 차례로 붙어 0 → 0 → 2 → 21입니다. 정수는 앞자리 0을 저장하지 않습니다.                                 |
| `n == reverse_number(n)`        | 함수 안에서 `n`을 줄여도 부른 쪽의 `n`은 그대로입니다(값에 의한 전달, Day 20). 그래서 원래 값과 비교할 수 있습니다. |

**자릿수 근.** 자릿수를 모두 더하는 일을 한 자리가 될 때까지 반복하면 **자릿수 근(digital root)** 이 됩니다. 9875 → 9 + 8 + 7 + 5 = 29 → 2 + 9 = 11 → 1 + 1 = 2. 한 번의 "자릿수 합"은 함수로, "한 자리가 될 때까지"는 그 함수를 부르는 `while`로 나눴습니다.

```rust
// 파일: digital_root.rs
fn digit_sum(mut n: u64) -> u64 {
    let mut sum = 0;
    while n > 0 {
        sum += n % 10;
        n /= 10;
    }
    sum
}

fn digital_root(mut n: u64) -> (u64, u32) {
    let mut steps = 0;
    while n >= 10 {                         // 한 자리가 될 때까지
        n = digit_sum(n);
        steps += 1;
    }
    (n, steps)
}

fn main() {
    for n in [9875, 38, 7, 999_999_999_999] {
        let (root, steps) = digital_root(n);
        println!("{n}: 근 {root}, {steps}번 더함, 9로 나눈 나머지 {}", n % 9);
    }
}
```

실행 결과:

```text
9875: 근 2, 3번 더함, 9로 나눈 나머지 2
38: 근 2, 2번 더함, 9로 나눈 나머지 2
7: 근 7, 0번 더함, 9로 나눈 나머지 7
999999999999: 근 9, 2번 더함, 9로 나눈 나머지 0
```

마지막 칸을 보면 자릿수 근이 **9로 나눈 나머지**와 같습니다(나머지가 0이면 근은 9). 10 = 9 + 1이라서 각 자리의 값에서 9의 배수를 빼면 자릿수만 남기 때문입니다. 반복 결과와 수학 성질이 일치하는지 비교하는 것은 좋은 검증 방법입니다. `digital_root`는 결과와 반복 횟수를 **튜플**로 함께 돌려줍니다(Day 20).

## 10. 구조 한눈에 보기

| 구조                    | 예                                 | 주의할 점                                     |
| ----------------------- | ---------------------------------- | --------------------------------------------- |
| 반복 안에서 함수 부르기 | `for n in ...: if is_prime(n):`    | 총 작업량 = 반복 횟수 × 함수 한 번의 작업     |
| 함수 안에 반복          | `reverse_number`, `sum_to`         | 지역 변수는 호출마다 새로 시작                |
| 함수가 함수를 부르기    | `is_palindrome` → `reverse_number` | 작은 함수부터 시험하면 큰 함수를 믿을 수 있음 |
| 흐름을 맡는 main        | 입력 → 처리 → 누적 → 출력          | main에는 계산을 넣지 않고 함수에 맡김         |
| 결과 여러 개 돌려주기   | `(root, steps)`, `return q, r`     | 받는 쪽에서 같은 순서로 나눠 받기             |

## 11. 세 언어 비교

| 관점                  | C                          | Python                          | Rust                                   |
| --------------------- | -------------------------- | ------------------------------- | -------------------------------------- |
| 한 줄 읽고 나누기     | `scanf("%s %d %d %d")`     | `input().split()`               | `lines()` + `split_whitespace()`       |
| 센티널 비교           | `strcmp(name, "END") != 0` | `line == "END"`                 | `line == "END"`                        |
| 이름 오래 기억하기    | `strcpy`로 배열에 복사     | 그냥 대입(문자열은 바뀌지 않음) | `to_string()`으로 소유한 문자열 만들기 |
| 등급 함수 반환 자료형 | `char`                     | `str`                           | `char`                                 |
| 반복 결과 여러 개     | 전역 변수·포인터(Day 43)   | 튜플                            | 튜플                                   |

## 12. 자주 하는 실수

### 실수 1: 반복 안의 return (C, Python, Rust 공통)

실습의 디버그 문제입니다. "모두 본 뒤" 돌려줄 값은 반복 **밖**에서 `return`합니다.

### 실수 2: 함수 안에서 출력만 하고 돌려주지 않는다

```python
# 파일: grade_print.py
def grade(avg):
    if avg >= 90:
        print("A")
    else:
        print("B")


result = grade(95)
print("등급:", result)
```

실행 결과:

```text
A
등급: None
```

계산 함수는 **값을 돌려주고**, 출력은 부른 쪽(main)에서 하세요. 그래야 `grade`를 표 출력, 통계, 시험 등 여러 곳에 쓸 수 있습니다.

### 실수 3: 최댓값과 관련 정보를 따로 갱신한다

```text
if avg > best_avg:
    best_avg = avg
best_name = name          ← if 밖: 마지막 학생 이름이 들어감
```

값과 이름을 **같은 if 안에서** 함께 바꿔야 서로 맞습니다.

### 실수 4: 빌린 문자열을 반복 밖에서 쓴다 (Rust)

```rust
// 파일: borrowed_name.rs (컴파일 오류: E0597)
fn main() {
    let mut best: &str = "";
    for n in 0..2 {
        let line = format!("student{n}");
        best = &line;
    }
    println!("{best}");
}
```

`line`은 반복 한 차례가 끝나면 사라지는데, `best`가 그것을 빌리고 있어서 `borrowed value does not live long enough` 오류가 납니다. `best`를 `String`으로 만들고 `best = line.clone();`처럼 복사하세요. 빌림과 수명은 Day 33, 45에서 자세히 배웁니다.

### 실수 5: 전역 변수에 기대는 함수

C의 `calls`처럼 함수 밖의 변수를 바꾸는 함수는, 부를 때마다 결과가 달라질 수 있어 시험하기 어렵습니다. 호출 횟수 세기 같은 간단한 용도가 아니라면, 필요한 값은 매개변수로 받고 결과는 반환값으로 돌려주세요.

## 13. Q&A

**Q. main도 함수로 묶는 게 좋나요? (Python)**

A. 작은 스크립트는 파일 맨 위부터 써도 됩니다. 하지만 `main()`으로 묶으면 변수들이 지역 변수가 되어 다른 함수에서 실수로 쓰는 일이 없고, `if __name__ == "__main__": main()`과 함께 쓰면 다른 파일에서 이 파일의 함수만 가져다 쓸 수도 있습니다(Day 3, 55).

**Q. 입력 처리와 계산을 같은 함수에 넣으면 안 되나요?**

A. 넣을 수는 있지만, 그러면 계산을 시험할 때마다 입력을 준비해야 합니다. `grade(avg)`처럼 **값만 받는** 함수는 `grade(89.9)`, `grade(90)`처럼 경계값을 바로 넣어 시험할 수 있습니다.

**Q. 같은 결과가 세 언어에서 다르게 나오면 어느 쪽이 맞나요?**

A. 먼저 **손 계산**으로 기대값을 정하고, 차이가 나는 곳을 찾습니다. 흔한 원인은 정수 나눗셈(C·Rust), 반올림 방식(Python의 `round`), 부동소수점 출력 자릿수, 문자열의 바이트와 글자 수 차이입니다. 차이의 원인을 찾는 과정 자체가 좋은 공부가 됩니다.

**Q. 함수가 많아지면 파일이 너무 길어지지 않나요?**

A. 그래서 관련된 함수들을 **모듈**(파일)로 나눕니다. Python은 `import`, C는 헤더 파일과 여러 `.c` 파일, Rust는 `mod`로 나눕니다. Day 55에서 Python 모듈화를, 마지막 프로젝트에서 세 언어의 파일 나누기를 봅니다.

## 14. 핵심 요약

- 데이터 처리 프로그램의 뼈대: **입력 반복(센티널) → 줄마다 함수로 처리 → 누적 → 요약 출력**.
- 계산 함수는 값을 받아 **돌려주기만** 하고, 흐름과 출력은 main이 맡습니다.
- 함수의 지역 변수는 호출마다 새로 시작합니다. 전역 변수는 호출이 거듭될수록 값이 쌓입니다.
- 반복 안에서 함수를 부르면 작업량이 곱해집니다(중첩 반복과 같은 구조).
- `return`의 위치: 모두 본 뒤 결과면 반복 밖, 찾자마자 끝내면 반복 안.
- 최댓값과 관련 정보는 같은 조건에서 함께 갱신합니다.
- 버그 점검표: 반복 경계, 누적 변수 위치, 조건 갱신, return 위치, print와 return, 값의 복사.
- 같은 입력으로 여러 구현의 결과를 비교해 검증합니다.

## 15. 도전 문제

1. **(Python)** 성적 처리기에 과목별 평균(국어, 영어, 수학)과 최저 평균 학생도 출력하도록 기능을 추가하세요.
2. **(C)** 5절의 성적 처리기에서 `grade` 함수를 등급 기준 배열(`90, 80, 70, 60`)을 반복으로 검사하는 방식으로 바꿔 보세요.
3. **(Rust)** 1부터 10000까지 중 "자기 자신과 뒤집은 수의 합이 회문수"인 수의 개수를 세세요(예: 12 + 21 = 33).
4. **(세 언어)** 입력으로 여러 줄의 `상품 가격 수량`을 `END`까지 받아, 줄마다 소계를 출력하고, 마지막에 총합과 가장 비싼 줄(소계 기준)을 출력하세요. 세 언어의 출력이 같은지 비교하세요.
