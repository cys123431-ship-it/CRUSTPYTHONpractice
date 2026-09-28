---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-30-pointer-arithmetic
courseId: crp-92
phaseId: phase-04
dayNumber: 30
date: "2026-10-30"
title: 포인터 이동과 배열 — 주소에 1을 더하면 다음 칸
summary: 포인터에 정수를 더하면 바이트가 아니라 '가리키는 자료형 한 칸'만큼 이동한다는 포인터 산술을 배웁니다. 배열 이름이 첫 칸의 주소로 바뀌는 규칙, a[i]가 사실 *(a + i)라는 것, 마지막 칸 다음 위치를 끝 표시로 쓰는 반복, 두 포인터의 거리(뺄셈)와 비교, 양 끝의 두 포인터로 제자리 뒤집기, 끝 표시 '\0'까지 포인터를 옮겨 문자열 길이 구하기를 C로 구현합니다. Python은 위치 번호와 반복자로, Rust는 슬라이스·split_at·반복자와 unsafe 날 포인터로 같은 일을 비교하고, 두 포인터 기법으로 회문과 합이 목표인 쌍을 찾아봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-29-references-borrowing]
learningObjectives:
  - 포인터 + 정수가 '자료형 한 칸' 단위로 이동한다는 것을 바이트 거리로 확인한다.
  - 배열 이름과 포인터의 관계, a[i]와 *(a + i)가 같다는 것을 설명한다.
  - 시작 포인터와 '마지막 다음' 포인터로 배열과 문자열을 돈다.
  - 포인터 뺄셈과 비교로 거리와 순서를 구하고, 두 포인터로 제자리 뒤집기를 구현한다.
  - Python의 위치 번호·반복자, Rust의 슬라이스·반복자를 C 포인터와 비교하고, 두 포인터 기법을 적용한다.
concepts:
  [
    pointer arithmetic,
    array decay,
    element size,
    one past the end,
    pointer difference,
    ptrdiff_t,
    two pointers,
    string traversal,
    slice,
    iterator,
    unsafe,
  ]
runnerMode: python
playgroundSource: |
  # 파일: two_pointers.py — 목록과 목표를 바꿔 보세요.
  nums = [1, 3, 4, 6, 8, 11, 15]
  target = 14
  left, right = 0, len(nums) - 1
  while left < right:
      s = nums[left] + nums[right]
      print(f"left={left} right={right} 합={s}")
      if s == target:
          print("찾음:", nums[left], nums[right])
          break
      if s < target:
          left += 1
      else:
          right -= 1
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day30-predict-c
    title: 중간을 가리키는 포인터 예측하기
    kind: predict
    objective: 포인터 산술과 음수 인덱스가 가리키는 칸을 계산한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {3, 6, 9, 12};
          int *p = a + 1;
          printf("%d %d %d\n", *p, *(p + 2), p[-1]);
          return 0;
      }
    answer: "6 12 3"
    hint: "p는 a[1]을 가리킵니다. p + 2는 a[3], p[-1]은 *(p - 1)이라 a[0]입니다."
    explanation: "p[i]는 *(p + i)의 줄임이라, 배열 안쪽을 가리키는 포인터에서는 음수 인덱스도 쓸 수 있습니다. 다만 결과가 배열 범위(a[0]~a[3], 그리고 마지막 다음 위치) 밖으로 나가면 정의되지 않은 동작입니다."
    commonMistakes:
      - "*(p + 2)를 a[2] = 9로 적음(p가 이미 한 칸 앞에서 시작)"
      - "p[-1]을 오류라고 생각함"
    language: c
    verification: run
  - id: ex-day30-predict-py
    title: 두 위치가 만나는 순간 예측하기
    kind: predict
    objective: 양 끝에서 좁혀 오는 두 위치가 몇 번 움직이고 어디서 멈추는지 추적한다.
    prompt: 출력되는 세 값을 공백으로 구분해 적으세요.
    starter: |-
      a = [1, 2, 3, 4, 5, 6]
      left, right = 0, len(a) - 1
      steps = 0
      while left < right:
          left += 1
          right -= 1
          steps += 1
      print(steps, left, right)
    answer: "3 3 2"
    hint: "(0, 5) → (1, 4) → (2, 3) → (3, 2)에서 left < right가 거짓이 됩니다."
    explanation: "칸이 6개면 짝이 3쌍이라 3번 움직입니다. 칸 수가 짝수면 두 위치가 서로 지나쳐(left > right) 멈추고, 홀수면 가운데에서 만나(left == right) 멈춥니다. 어느 쪽이든 조건 left < right로 끝을 판단하면 됩니다."
    commonMistakes:
      - "left와 right가 같은 값에서 멈춘다고 생각해 3 3 3으로 적음"
      - "6번 움직인다고 생각함"
    language: python
    verification: run
  - id: ex-day30-fill
    title: 포인터 반복의 끝 조건 채우기
    kind: fill
    objective: 마지막 다음 위치를 끝 표시로 쓰는 반복 조건을 쓴다.
    prompt: "빈칸에 비교 연산자를 채워 배열의 합 10이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {1, 2, 3, 4};
          int n = 4;
          int sum = 0;
          for (int *q = a; q _____ a + n; q++) {
              sum += *q;
          }
          printf("%d\n", sum);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {1, 2, 3, 4};
          int n = 4;
          int sum = 0;
          for (int *q = a; q < a + n; q++) {
              sum += *q;
          }
          printf("%d\n", sum);
          return 0;
      }
    output: "10"
    hint: "a + n은 마지막 칸 다음 위치입니다. 그 위치에 도착하기 전까지만 읽어야 합니다."
    explanation: "a + n을 가리키는 포인터는 만들고 비교할 수는 있지만, 역참조하면 안 됩니다. q < a + n은 인덱스 반복의 i < n과 같은 반열린 구간입니다(Day 12). q != a + n으로 써도 됩니다."
    commonMistakes:
      - "<=를 써서 배열 밖을 읽음"
      - "q < n처럼 포인터와 정수를 비교해 컴파일 오류가 남"
    language: c
    verification: run
  - id: ex-day30-modify
    title: 두 칸씩 건너뛰며 더하기
    kind: modify
    objective: 위치를 옮기는 간격을 바꿔 원하는 칸만 방문한다.
    prompt: "모든 칸을 더하는 코드를 0, 2, 4번 칸만 더하도록 고쳐 21이 출력되게 하세요."
    starter: |-
      a = [5, 1, 7, 3, 9]
      total = 0
      i = 0
      while i < len(a):
          total += a[i]
          i += 1
      print(total)
    answer: |-
      a = [5, 1, 7, 3, 9]
      total = 0
      i = 0
      while i < len(a):
          total += a[i]
          i += 2
      print(total)
    output: "21"
    hint: "위치를 한 번에 몇 칸씩 옮길지만 바꾸면 됩니다."
    explanation: "5 + 7 + 9 = 21입니다. C라면 for (p = a; p < a + n; p += 2)처럼 포인터에 2를 더합니다. 간격을 바꿀 때는 끝 조건이 여전히 범위를 넘지 않는지 확인해야 합니다. sum(a[::2])로도 같은 결과를 얻습니다."
    commonMistakes:
      - "i += 2로 바꾸고 조건을 i <= len(a)로 써서 범위를 넘음"
      - "홀수 칸(1, 3번)을 더해 4가 나옴"
    language: python
    verification: run
  - id: ex-day30-debug
    title: "*p++와 (*p)++ 구별하기"
    kind: debug
    objective: 후위 ++가 *보다 먼저 묶인다는 우선순위를 알고 괄호로 고친다.
    prompt: "p가 가리키는 x를 1 늘리려 했는데, 이 코드는 'value computed is not used' 오류로 컴파일되지 않습니다(경고가 없었다면 x는 그대로이고 p만 움직였을 것입니다). 고쳐서 6이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int x = 5;
          int *p = &x;
          *p++;
          printf("%d\n", x);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int x = 5;
          int *p = &x;
          (*p)++;
          printf("%d\n", x);
          return 0;
      }
    output: "6"
    hint: "*p++는 *(p++)로 묶입니다. 즉 포인터를 옮기고, 옮기기 전 위치의 값을 읽어 버립니다."
    explanation: "후위 ++는 *보다 우선순위가 높습니다. 그래서 *p++는 '값을 읽고 포인터를 다음 칸으로'라는 뜻이고, 문자열을 한 글자씩 읽는 while (*p) putchar(*p++); 같은 관용구에 쓰입니다. 가리키는 값을 늘리려면 (*p)++ 또는 *p += 1로 씁니다."
    commonMistakes:
      - "++*p가 틀렸다고 생각함(++*p는 값을 늘려서 올바름)"
      - "*(p++)로 괄호를 쳐서 뜻이 그대로임"
    language: c
    verification: run
  - id: ex-day30-independent
    title: Rust로 두 위치를 써서 회문 판별하기
    kind: independent
    objective: 양 끝의 두 인덱스를 좁혀 오며 슬라이스를 비교한다.
    prompt: "fn is_palindrome(xs: &[i32]) -> bool을 양 끝 두 인덱스로 만들어 [1, 2, 3, 2, 1]과 [1, 2, 3]을 검사해 'true false'를 출력하세요."
    starter: |-
      fn main() {
          println!("? ?");
      }
    answer: |-
      fn is_palindrome(xs: &[i32]) -> bool {
          if xs.is_empty() {
              return true;
          }
          let (mut l, mut r) = (0, xs.len() - 1);
          while l < r {
              if xs[l] != xs[r] {
                  return false;
              }
              l += 1;
              r -= 1;
          }
          true
      }

      fn main() {
          println!("{} {}", is_palindrome(&[1, 2, 3, 2, 1]), is_palindrome(&[1, 2, 3]));
      }
    output: "true false"
    hint: "양 끝이 다르면 바로 false, 끝까지 같으면 true입니다. 빈 슬라이스에서 len() - 1을 계산하면 usize가 넘치므로 먼저 처리하세요."
    explanation: "C의 두 포인터 l, r을 Rust에서는 두 인덱스로 씁니다. usize는 음수가 없어서 빈 슬라이스의 0 - 1이 패닉이 되므로 먼저 걸렀습니다(C에서 s - 1이 배열 앞을 가리키는 문제와 같은 경계입니다). xs.iter().eq(xs.iter().rev())로도 한 줄에 쓸 수 있습니다."
    commonMistakes:
      - "빈 슬라이스를 처리하지 않아 attempt to subtract with overflow 패닉이 남"
      - "r을 xs.len()으로 시작해 범위를 넘음"
    language: rust
    verification: run
quiz:
  - id: quiz-day30-01
    question: int *p가 주소 1000을 가리킬 때 p + 1은? (int는 4바이트)
    choices: ["1001", "1004", "1008", "1000"]
    answerIndex: 1
    explanation: 포인터에 1을 더하면 '가리키는 자료형 한 칸'만큼 이동합니다. int는 4바이트라 1004, double*라면 1008, char*라면 1001입니다. 그래서 p + 1은 항상 '다음 원소'를 가리킵니다.
  - id: quiz-day30-02
    question: 배열 a에서 a[i]와 항상 같은 것은?
    choices: ["*a + i", "*(a + i)", "&a + i", "a + *i"]
    answerIndex: 1
    explanation: C는 a[i]를 *(a + i)로 정의합니다. 배열 이름 a가 첫 칸의 주소로 바뀌고, i칸 이동한 뒤 역참조합니다. *a + i는 첫 값에 i를 더한 것이라 다릅니다.
  - id: quiz-day30-03
    question: int a[5];에서 a + 5 포인터에 대한 설명으로 옳은 것은?
    choices:
      - 만들 수 없다
      - 만들고 비교할 수는 있지만, 역참조(*(a + 5))하면 안 된다
      - a[4]와 같다
      - a[0]을 가리킨다
    answerIndex: 1
    explanation: "'마지막 칸 다음' 위치는 반복의 끝 표시로 쓰려고 특별히 허용됩니다. 그 너머(a + 6)를 만들거나, a + 5를 읽는 것은 정의되지 않은 동작입니다."
  - id: quiz-day30-04
    question: 같은 배열을 가리키는 두 포인터 hi와 lo에 대해 hi - lo의 뜻은?
    choices:
      - 두 주소의 바이트 차이
      - 두 포인터 사이의 원소 개수(칸 수)
      - 두 값의 차이
      - 컴파일 오류
    answerIndex: 1
    explanation: 포인터 뺄셈은 바이트가 아니라 칸 수를 돌려주며, 자료형은 ptrdiff_t(%td로 출력)입니다. 서로 다른 배열을 가리키는 포인터끼리 빼는 것은 정의되지 않은 동작입니다.
  - id: quiz-day30-05
    question: Rust에서 C의 포인터 산술 *(p + 1)을 안전하게 대신하는 방법이 아닌 것은?
    choices:
      - 인덱스 xs[1]
      - 슬라이스 &xs[1..]
      - 반복자 xs.iter()의 next()
      - 검사 없이 unsafe { *p.add(1) }을 어디서나 쓰기
    answerIndex: 3
    explanation: Rust는 슬라이스(시작 + 길이)와 반복자로 대부분의 포인터 산술을 안전하게 표현합니다. 날 포인터 산술은 unsafe 블록에서만 가능하고, 범위를 지키는 책임이 프로그래머에게 넘어오므로 꼭 필요한 곳(C 라이브러리와의 연결 등)에만 씁니다.
---

## 1. 오늘 배울 내용

Day 29에서 포인터는 "변수의 위치"였습니다. 오늘은 그 위치를 **옮기는** 방법, 즉 **포인터 산술**을 배웁니다. 배열의 칸들은 메모리에 나란히 놓여 있으므로(Day 26), 포인터를 한 칸씩 옮기면 배열을 차례로 방문할 수 있습니다.

1. **포인터 + 정수**는 바이트가 아니라 **자료형 한 칸**만큼 이동합니다.
2. **배열 이름은 첫 칸의 주소**로 바뀌고, `a[i]`는 사실 `*(a + i)`입니다.
3. 시작 포인터와 **마지막 다음** 포인터로 배열을 돕니다.
4. **포인터 뺄셈**(칸 수)과 **비교**(앞·뒤)를 씁니다.
5. **두 포인터**로 양 끝에서 좁혀 오며 뒤집기, 회문 판별, 합이 목표인 쌍 찾기를 합니다.
6. 끝 표시 `'\0'`까지 포인터를 옮겨 **문자열 길이**를 구합니다.
7. Python(위치 번호, 반복자)과 Rust(슬라이스, 반복자, `unsafe` 날 포인터)로 같은 일을 비교합니다.

## 2. 왜 필요한가

C 표준 라이브러리의 문자열 함수(`strlen`, `strcpy`)와 배열을 다루는 코드 대부분이 포인터 산술로 쓰여 있습니다. 포인터 산술을 알아야 다음과 같은 C 코드를 읽을 수 있습니다.

```text
while (*s) s++;              // 문자열 끝까지 이동
for (p = a; p < a + n; p++)  // 배열 전체 돌기
return end - start;          // 거리 = 원소 개수
```

또 "양 끝에서 두 위치를 좁혀 온다"는 **두 포인터 기법**은 언어와 상관없이 쓰이는 중요한 알고리즘 도구입니다. 회문 검사, 정렬된 목록에서 합 찾기, 퀵 정렬의 분할(Day 75)이 모두 이 모양입니다.

동시에 포인터 산술은 C 버그의 가장 큰 원천이기도 합니다. 배열 밖으로 한 칸만 넘어가도 다른 데이터를 망가뜨립니다. Python과 Rust가 이를 어떻게 안전하게 바꿔 놓았는지 함께 봅니다.

## 3. 그림으로 이해하기

`int nums[5] = {10, 20, 30, 40, 50};`과 `int *p = nums;`를 그려 봅시다. `int`는 한 칸이 4바이트입니다.

```text
          p         p+1       p+2       p+3       p+4      p+5 (마지막 다음)
          │          │         │         │         │         │
          ▼          ▼         ▼         ▼         ▼         ▼
       ┌─────────┬─────────┬─────────┬─────────┬─────────┐
nums   │   10    │   20    │   30    │   40    │   50    │ (읽으면 안 됨)
       └─────────┴─────────┴─────────┴─────────┴─────────┘
바이트  +0        +4        +8        +12       +16       +20

p + 1    → 4바이트 뒤 = nums[1]의 위치
*(p + 1) → 20
p[2]     → *(p + 2) → 30
```

`p + 1`은 주소에 **1을 더하는 것이 아니라 `sizeof(int)`인 4를 더합니다**. 컴파일러가 포인터의 자료형을 보고 칸 크기를 알아서 곱해 줍니다. 그래서 `double *`에 1을 더하면 8바이트, `char *`에 1을 더하면 1바이트 이동합니다.

두 포인터로 뒤집을 때는 양 끝에서 가운데로 다가옵니다.

```text
 l                        r          l < r → 바꾸고 l++, r--
[10] [20] [30] [40] [50]
      l              r
[50] [20] [30] [40] [10]
           l,r                      l < r 거짓 → 끝
[50] [40] [30] [20] [10]
```

## 4. 천천히 풀어보기

### 4.1 포인터 산술의 규칙

| 식                | 뜻                                         | 결과 자료형         |
| ----------------- | ------------------------------------------ | ------------------- |
| `p + n`           | n칸 뒤를 가리키는 포인터                   | 같은 포인터 자료형  |
| `p - n`           | n칸 앞을 가리키는 포인터                   | 같은 포인터 자료형  |
| `p++`, `p--`      | 한 칸 뒤·앞으로 옮기기                     |                     |
| `*(p + 1)`        | 한 칸 뒤의 값                              | 가리키는 자료형     |
| `p[i]`            | `*(p + i)`와 같음                          | 가리키는 자료형     |
| `q - p`           | 두 포인터 사이의 칸 수(같은 배열 안에서만) | `ptrdiff_t` (`%td`) |
| `p < q`, `p == q` | 앞뒤 순서, 같은 곳인지                     | 참·거짓             |

**할 수 없는 것**: 포인터끼리 더하기(`p + q`), 곱하기, 서로 다른 배열의 포인터끼리 빼거나 비교하기.

### 4.2 배열과 포인터

배열 이름 `nums`는 대부분의 식에서 **첫 칸의 주소**(`&nums[0]`)로 바뀝니다. 그래서 `int *p = nums;`가 되고, `nums[i]`는 `*(nums + i)`와 같습니다. 두 가지 예외가 있습니다.

- `sizeof nums`는 배열 전체의 크기(20바이트)입니다. 포인터라면 8입니다(Day 26).
- `&nums`는 "배열 전체의 주소"라 자료형이 다릅니다.

함수에 배열을 넘기면 첫 칸의 주소만 넘어갑니다. 그래서 함수 안에서는 칸 수를 알 수 없고(Day 28), 매개변수 `int a[]`는 사실 `int *a`입니다.

### 4.3 허용되는 범위

C 표준이 약속하는 포인터는 **배열의 칸들과, 마지막 칸 바로 다음 위치 하나**뿐입니다.

```text
  허용 ─────────────────────────────────────────────▶│
  nums  nums+1  nums+2  nums+3  nums+4   nums+5      │ nums+6 이상, nums-1: 만들기만 해도 정의되지 않은 동작
  (읽기·쓰기 가능)                         (비교만 가능, 읽기 금지)
```

"마지막 다음" 위치를 끝 표시로 쓰는 반복(`q < nums + 5`)이 흔한 이유입니다. 반대로 배열 **앞**을 가리키는 `nums - 1`은 허용되지 않습니다. 9절에서 빈 문자열을 뒤집을 때 이 규칙을 지키려고 먼저 검사합니다.

### 4.4 Python과 Rust에서는

- **Python**에는 포인터 산술이 없습니다. 대신 **위치 번호**(인덱스)를 옮기고, 목록을 앞에서부터 하나씩 내주는 **반복자**(`iter`, `next`)를 씁니다. 범위를 벗어나면 `IndexError`입니다.
- **Rust**는 **슬라이스**(`&xs[1..4]`)가 "시작 위치 + 길이"를 함께 가지고 다녀서, 포인터 산술로 하던 일 대부분을 범위 검사와 함께 안전하게 합니다. 반복자는 안전한 커서입니다. 정말 필요하면 날 포인터(`as_ptr`, `add`)를 쓸 수 있지만 `unsafe` 블록 안에서만 가능합니다.

## 5. C로 구현하기

```c
// 파일: pointer_arith.c
#include <stdio.h>
#include <stddef.h>

int main(void) {
    int nums[5] = {10, 20, 30, 40, 50};
    int *p = nums;                              // 배열 이름은 첫 칸의 주소로 바뀐다
    printf("*p = %d, *(p + 1) = %d, p[2] = %d\n", *p, *(p + 1), p[2]);
    printf("nums[3] = %d, *(nums + 3) = %d\n", nums[3], *(nums + 3));

    printf("int* + 1은 %td바이트 뒤\n", (char *)(p + 1) - (char *)p);
    double ds[2] = {0.5, 1.5};
    printf("double* + 1은 %td바이트 뒤\n", (char *)(ds + 1) - (char *)ds);

    int *end = nums + 5;                        // 마지막 칸 '다음' 위치(읽으면 안 됨)
    int sum = 0;
    for (int *q = nums; q < end; q++) {         // 포인터를 한 칸씩 옮기며 돈다
        sum += *q;
    }
    printf("합 %d, end - nums = %td칸\n", sum, end - nums);

    int *hi = &nums[4], *lo = &nums[1];
    printf("hi - lo = %td칸, lo < hi? %d\n", hi - lo, lo < hi);

    int *l = nums, *r = nums + 4;               // 양 끝을 가리키는 두 포인터
    while (l < r) {
        int t = *l;
        *l = *r;
        *r = t;
        l++;
        r--;
    }
    printf("뒤집기:");
    for (int i = 0; i < 5; i++) {
        printf(" %d", nums[i]);
    }
    printf("\n");

    const char *word = "pointer";
    int len = 0;
    for (const char *c = word; *c != '\0'; c++) {   // 끝 표시가 나올 때까지
        len++;
    }
    printf("\"%s\"의 길이 %d, 세 번째 글자 %c\n", word, len, *(word + 2));
    return 0;
}
```

실행 결과:

```text
*p = 10, *(p + 1) = 20, p[2] = 30
nums[3] = 40, *(nums + 3) = 40
int* + 1은 4바이트 뒤
double* + 1은 8바이트 뒤
합 150, end - nums = 5칸
hi - lo = 3칸, lo < hi? 1
뒤집기: 50 40 30 20 10
"pointer"의 길이 7, 세 번째 글자 i
```

### 코드 한 부분씩 읽기

| 코드                                          | 설명                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int *p = nums;`                              | 배열 이름이 첫 칸의 주소로 바뀌어 `&` 없이 대입됩니다.                                                                                                              |
| `*(p + 1)`                                    | 한 칸 뒤로 이동한 뒤 값을 읽습니다. `p[1]`과 같습니다.                                                                                                              |
| `(char *)(p + 1) - (char *)p`                 | 두 포인터를 **1바이트 단위**인 `char *`로 바꿔서 빼면 바이트 거리가 나옵니다. `int *`끼리 빼면 칸 수 1이 나옵니다. 칸 크기가 자료형마다 다르다는 것을 확인했습니다. |
| `int *end = nums + 5;`                        | 마지막 칸 다음 위치입니다. 비교에만 쓰고 읽지 않습니다.                                                                                                             |
| `for (int *q = nums; q < end; q++)`           | 포인터를 한 칸씩 옮기며 돕니다. 인덱스 반복 `for (i = 0; i < 5; i++)`과 같은 일입니다.                                                                              |
| `end - nums`, `hi - lo`                       | 포인터 뺄셈은 칸 수입니다. 자료형이 `ptrdiff_t`라서 `%td`로 출력합니다.                                                                                             |
| `while (l < r) { ...; l++; r--; }`            | 두 포인터를 비교해 서로 지나치기 전까지 바꿉니다.                                                                                                                   |
| `for (const char *c = word; *c != '\0'; c++)` | 문자열의 끝 표시 `'\0'`을 만날 때까지 한 글자씩 이동합니다. `strlen`이 이렇게 동작합니다(Day 37).                                                                   |
| `*(word + 2)`                                 | 문자열도 글자 배열이라 포인터 산술로 세 번째 글자를 읽습니다.                                                                                                       |

## 6. Python으로 구현하기

```python
# 파일: cursor.py
nums = [10, 20, 30, 40, 50]
i = 0                                       # 포인터 대신 '위치 번호'를 옮긴다
print(nums[i], nums[i + 1], nums[i + 2])

total = 0
cursor = 0
while cursor < len(nums):                   # 커서를 한 칸씩 옮기며 돈다
    total += nums[cursor]
    cursor += 1
print("합", total, "마지막 커서", cursor)

left, right = 0, len(nums) - 1              # 양 끝 두 위치
while left < right:
    nums[left], nums[right] = nums[right], nums[left]
    left += 1
    right -= 1
print("뒤집기:", nums)

it = iter([10, 20, 30])                     # 반복자: 다음 값을 하나씩 내주는 커서
print(next(it), next(it), next(it, "끝"), next(it, "끝"))

word = "pointer"
print(f'"{word}"의 길이 {len(word)}, 세 번째 글자 {word[2]}')
print("부분:", nums[1:4])
```

실행 결과:

```text
10 20 30
합 150 마지막 커서 5
뒤집기: [50, 40, 30, 20, 10]
10 20 30 끝
"pointer"의 길이 7, 세 번째 글자 i
부분: [40, 30, 20]
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nums[i + 1]`                               | C의 `*(p + 1)` 대신 위치 번호에 1을 더합니다.                                                                                                         |
| `while cursor < len(nums): ... cursor += 1` | C의 포인터 반복과 같은 모양입니다. 반복이 끝났을 때 `cursor`는 5, 즉 "마지막 다음" 위치입니다.                                                        |
| `left, right = 0, len(nums) - 1`            | 두 위치로 뒤집기입니다. 여러 값 대입으로 두 칸을 바꿨습니다(Day 4).                                                                                   |
| `it = iter([10, 20, 30])` / `next(it)`      | **반복자**는 "다음 값을 하나씩 내주고 앞으로 가는" 커서입니다. `for`가 속으로 쓰는 것이 이것입니다. 끝에 닿으면 `next(it, "끝")`의 기본값이 나옵니다. |
| `nums[1:4]`                                 | 부분 목록을 새로 만듭니다(Day 27). C처럼 "원본 중간을 가리키는 것"이 아니라 복사본입니다.                                                             |

## 7. Rust로 구현하기

```rust
// 파일: slices.rs
fn main() {
    let nums = [10, 20, 30, 40, 50];
    let part: &[i32] = &nums[1..4];            // (시작 위치, 길이)를 가진 슬라이스
    println!("part = {part:?}, 길이 {}", part.len());
    let (left, right) = nums.split_at(2);       // 한 곳을 기준으로 둘로 나눠 보기
    println!("split_at(2): {left:?} {right:?}");

    let mut it = nums.iter();                   // 반복자: 안전한 '커서'
    it.next();
    it.next();
    println!("두 번 옮긴 뒤 다음 값: {:?}", it.next());

    let p = nums.as_ptr();                      // 날 포인터(검사를 받지 않는 주소)
    let second = unsafe { *p.add(1) };          // C의 *(p + 1). unsafe 안에서만 가능
    println!("unsafe로 읽은 두 번째 칸: {second}");
    println!("i32 한 칸 {}바이트", std::mem::size_of::<i32>());

    let mut v = nums;
    let (mut l, mut r) = (0, v.len() - 1);
    while l < r {
        v.swap(l, r);                           // 두 칸을 바꾼다
        l += 1;
        r -= 1;
    }
    println!("뒤집기: {v:?}");

    let word = "pointer";
    println!("\"{word}\"의 길이 {}, 세 번째 글자 {:?}", word.len(), word.chars().nth(2));
}
```

실행 결과:

```text
part = [20, 30, 40], 길이 3
split_at(2): [10, 20] [30, 40, 50]
두 번 옮긴 뒤 다음 값: Some(30)
unsafe로 읽은 두 번째 칸: 20
i32 한 칸 4바이트
뒤집기: [50, 40, 30, 20, 10]
"pointer"의 길이 7, 세 번째 글자 Some('i')
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let part: &[i32] = &nums[1..4];`      | C라면 "`nums + 1`에서 시작해 3칸"을 따로 기억해야 하지만, 슬라이스는 시작과 길이를 **함께** 가집니다. 범위를 벗어난 접근은 검사됩니다. 복사하지 않습니다.  |
| `nums.split_at(2)`                     | 2번 칸을 기준으로 앞부분과 뒷부분 두 슬라이스로 나눕니다. C의 `nums`와 `nums + 2` 두 포인터에 해당합니다.                                                  |
| `let mut it = nums.iter(); it.next();` | 반복자는 안전한 커서입니다. 끝에 닿으면 `next()`가 `None`을 돌려줘서 범위를 벗어날 수 없습니다.                                                            |
| `let p = nums.as_ptr();`               | 검사를 받지 않는 **날 포인터**(`*const i32`)를 얻습니다. 만드는 것까지는 안전합니다.                                                                       |
| `unsafe { *p.add(1) }`                 | 날 포인터를 옮기고 읽는 것은 `unsafe` 안에서만 됩니다. "범위를 지키는 책임은 내가 진다"는 표시입니다. `p.add(10)`을 읽으면 C처럼 정의되지 않은 동작입니다. |
| `v.swap(l, r)`                         | 두 인덱스의 값을 바꿉니다. `let mut v = nums;`로 배열을 복사했으므로 원본 `nums`는 그대로입니다(Day 26).                                                   |
| `word.chars().nth(2)`                  | Rust 문자열은 인덱스로 글자를 바로 꺼낼 수 없습니다(한글처럼 여러 바이트인 글자가 있어서, Day 39). 반복자로 세 번째 글자를 `Option`으로 얻습니다.          |

## 8. 실행 추적

C의 합계 반복 `for (int *q = nums; q < end; q++) sum += *q;`를 주소(예: `nums`가 1000번)와 함께 따라갑니다.

| 단계 | `q`(주소) | `q - nums` | `q < end`(1020)? | `*q` | `sum` |
| ---: | --------: | ---------: | ---------------- | ---: | ----: |
|    1 |      1000 |          0 | 참               |   10 |    10 |
|    2 |      1004 |          1 | 참               |   20 |    30 |
|    3 |      1008 |          2 | 참               |   30 |    60 |
|    4 |      1012 |          3 | 참               |   40 |   100 |
|    5 |      1016 |          4 | 참               |   50 |   150 |
|    6 |      1020 |          5 | **거짓** → 끝    |    — |   150 |

주소는 4씩 늘지만 `q - nums`는 1씩 늡니다. 6단계에서 `q`는 마지막 다음 위치(1020)에 닿지만 읽지 않고 반복이 끝납니다.

## 9. 다른 예제로 다시 이해하기

**포인터로 만드는 문자열 함수.** C 문자열은 끝에 `'\0'`이 있는 글자 배열입니다. 포인터를 옮기며 길이를 세고, 특정 글자를 세고, 두 포인터로 제자리에서 뒤집어 봅시다.

```c
// 파일: string_pointers.c
#include <stdio.h>

int my_strlen(const char *s) {
    const char *start = s;
    while (*s != '\0') {                    // 끝 표시까지 포인터를 옮긴다
        s++;
    }
    return (int)(s - start);                // 두 포인터의 거리 = 글자 수
}

int count_char(const char *s, char target) {
    int count = 0;
    for (; *s != '\0'; s++) {
        if (*s == target) {
            count++;
        }
    }
    return count;
}

void reverse_in_place(char *s) {
    if (*s == '\0') {
        return;                             // 빈 문자열: s - 1을 만들지 않도록 먼저 끝낸다
    }
    char *l = s;
    char *r = s + my_strlen(s) - 1;         // 마지막 글자(끝 표시 바로 앞)
    while (l < r) {
        char t = *l;
        *l = *r;
        *r = t;
        l++;
        r--;
    }
}

int main(void) {
    char word[] = "banana";                 // 바꿀 수 있는 글자 배열
    printf("길이 %d, 'a' %d개\n", my_strlen(word), count_char(word, 'a'));
    reverse_in_place(word);
    printf("뒤집기: %s\n", word);
    char empty[] = "";
    reverse_in_place(empty);                // 빈 문자열도 안전해야 한다
    printf("빈 문자열 길이 %d\n", my_strlen(empty));
    return 0;
}
```

실행 결과:

```text
길이 6, 'a' 3개
뒤집기: ananab
빈 문자열 길이 0
```

| 코드                       | 설명                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `return (int)(s - start);` | 끝 표시까지 옮긴 포인터와 시작 포인터의 거리가 곧 글자 수입니다. 표준 함수 `strlen`의 원리입니다.                                                 |
| `for (; *s != '\0'; s++)`  | 매개변수 `s`는 포인터의 **복사본**이라, 함수 안에서 옮겨도 부른 쪽의 `word`는 그대로입니다.                                                       |
| `if (*s == '\0') return;`  | 빈 문자열이면 `s + 0 - 1`, 즉 배열 **앞**을 가리키는 포인터를 만들게 되는데, 이것은 만들기만 해도 정의되지 않은 동작입니다. 그래서 먼저 끝냅니다. |
| `char word[] = "banana";`  | 바꿀 수 있는 글자 배열입니다. `const char *word = "banana";`처럼 문자열 리터럴을 가리키게 하면 바꿀 수 없어서 뒤집기가 오류를 일으킵니다(Day 37). |

**두 포인터 기법.** 양 끝의 두 위치를 조건에 따라 좁혀 오면, 모든 쌍을 비교하는 중첩 반복(Day 19) 없이 한 번의 훑기로 답을 찾을 수 있는 문제가 있습니다. 정렬된 목록에서 합이 목표인 두 수를 찾을 때, 합이 작으면 왼쪽을 키우고 크면 오른쪽을 줄이면 됩니다.

```python
# 파일: two_pointers.py
def is_palindrome(text):
    left, right = 0, len(text) - 1
    while left < right:
        if text[left] != text[right]:
            return False
        left += 1
        right -= 1
    return True


def pair_with_sum(sorted_nums, target):
    left, right = 0, len(sorted_nums) - 1
    steps = 0
    while left < right:
        steps += 1
        s = sorted_nums[left] + sorted_nums[right]
        if s == target:
            return sorted_nums[left], sorted_nums[right], steps
        if s < target:
            left += 1                       # 합이 작으면 작은 쪽을 키운다
        else:
            right -= 1                      # 합이 크면 큰 쪽을 줄인다
    return None, None, steps


for word in ("level", "racecar", "banana", ""):
    print(repr(word), is_palindrome(word))
nums = [1, 3, 4, 6, 8, 11, 15]
print("합 14:", pair_with_sum(nums, 14))
print("합 100:", pair_with_sum(nums, 100))
```

실행 결과:

```text
'level' True
'racecar' True
'banana' False
'' True
합 14: (3, 11, 3)
합 100: (None, None, 6)
```

합 14를 찾는 과정은 (1 + 15 = 16, 큼 → 오른쪽 줄이기) → (1 + 11 = 12, 작음 → 왼쪽 키우기) → (3 + 11 = 14, 찾음)으로 3단계입니다. 합 100처럼 답이 없어도 두 위치가 만날 때까지 최대 n − 1번(6번)이면 끝납니다. 모든 쌍을 비교하면 21번(7 × 6 ÷ 2)입니다. 목록이 **정렬되어 있다는 성질** 덕분에 가능한 방법입니다.

## 10. 포인터 산술 한눈에 보기

| 하고 싶은 일      | C 포인터                 | Python              | Rust                                |
| ----------------- | ------------------------ | ------------------- | ----------------------------------- |
| 다음 칸           | `p + 1`, `p++`           | `i + 1`, `next(it)` | 인덱스 `i + 1`, `it.next()`         |
| n칸 뒤의 값       | `*(p + n)`, `p[n]`       | `a[i + n]`          | `xs[i + n]`, `xs.get(i + n)`        |
| 부분 보기         | `p`와 길이를 함께 기억   | `a[i:j]`(복사)      | `&xs[i..j]`(빌림)                   |
| 끝 표시           | `a + n`, 문자열은 `'\0'` | `len(a)`            | 슬라이스 길이, 반복자의 `None`      |
| 두 위치 사이 거리 | `q - p`                  | `j - i`             | `j - i`                             |
| 범위 밖 접근      | 정의되지 않은 동작       | `IndexError`        | 패닉(`unsafe`면 정의되지 않은 동작) |

## 11. 세 언어 비교

| 관점                   | C                  | Python                      | Rust                                 |
| ---------------------- | ------------------ | --------------------------- | ------------------------------------ |
| 주소를 계산할 수 있나  | 예(포인터 산술)    | 아니요                      | `unsafe`의 날 포인터로만             |
| "배열의 일부"를 넘기기 | 시작 포인터 + 길이 | 자르기(복사) 또는 위치 번호 | 슬라이스(복사 없음, 길이 포함)       |
| 문자열의 끝            | `'\0'` 끝 표시     | 길이를 알고 있음            | 길이를 알고 있음(`'\0'` 없음)        |
| 커서                   | 포인터             | 반복자(`iter`, `next`)      | 반복자(`iter`, `next`)               |
| 안전성                 | 프로그래머 책임    | 실행 중 검사                | 컴파일·실행 중 검사, `unsafe`는 예외 |

## 12. 자주 하는 실수

### 실수 1: *p++와 (*p)++를 헷갈린다 (C)

실습의 디버그 문제입니다. `*p++`는 `*(p++)`, 즉 "읽고 포인터를 옮긴다"입니다. 값을 늘리려면 `(*p)++`입니다.

### 실수 2: 끝 조건에 <=를 쓴다 (C)

```c
// 파일: past_end.c
#include <stdio.h>

int main(void) {
    int a[4] = {1, 2, 3, 4};
    int count = 0;
    for (int *p = a; p < a + 4; p++) {      // <= a + 4라면 마지막 다음 칸을 읽는다
        count++;
    }
    printf("방문한 칸 %d개\n", count);
    return 0;
}
```

실행 결과:

```text
방문한 칸 4개
```

`p <= a + 4`로 쓰면 다섯 번째 반복에서 배열 밖의 메모리를 읽습니다. C는 이것을 알려 주지 않습니다. 포인터 반복의 끝 조건은 항상 `<`(또는 `!=`) **마지막 다음**입니다.

### 실수 3: 서로 다른 배열의 포인터를 뺀다 (C)

`int a[3], b[3];`에서 `&b[0] - &a[0]`은 두 배열이 메모리에 어떻게 놓였는지에 따라 아무 값이나 나오는 정의되지 않은 동작입니다. 포인터 뺄셈과 비교는 **같은 배열 안에서만** 의미가 있습니다.

### 실수 4: 빈 목록에서 마지막 위치를 계산한다 (Rust)

```rust
// 파일: empty_last.rs (실행 오류: attempt to subtract with overflow)
fn main() {
    let xs: Vec<i32> = "".split_whitespace().map(|t| t.parse().unwrap()).collect();
    let last_index = xs.len() - 1;
    println!("{last_index}");
}
```

빈 목록의 `len() - 1`은 `usize`에서 0 − 1이라 넘칩니다. C에서 빈 문자열의 `s - 1`이 배열 앞을 가리키는 것과 같은 경계 문제입니다. 먼저 `is_empty()`로 걸러 내세요.

### 실수 5: 함수에 넘긴 포인터로 배열 크기를 구한다 (C)

함수 매개변수 `int a[]`는 포인터라 `sizeof a`는 8입니다(Day 28). 포인터에는 "몇 칸짜리 배열인지" 정보가 없습니다. 길이를 따로 넘기거나, 문자열처럼 끝 표시를 약속하세요.

## 13. Q&A

**Q. 인덱스(a[i])와 포인터 반복(p++) 중 무엇을 써야 하나요?**

A. 컴파일러가 둘을 거의 같은 기계어로 바꾸므로 속도 차이는 거의 없습니다. 읽기 쉬운 쪽을 쓰세요. 대부분의 경우 인덱스가 더 분명하고, 문자열처럼 끝 표시까지 가는 반복이나 C 표준 라이브러리 스타일의 코드에서는 포인터가 자연스럽습니다.

**Q. `void *` 포인터에도 산술을 할 수 있나요?**

A. 표준 C에서는 안 됩니다. `void *`는 가리키는 자료형의 크기를 모르기 때문입니다(gcc는 확장 기능으로 1바이트씩 허용하지만 이식성이 없습니다). 바이트 단위로 옮기려면 5절처럼 `char *`로 바꿉니다. `malloc`이 돌려주는 것이 `void *`입니다(Day 40).

**Q. Python에서도 메모리 주소를 볼 수 있나요?**

A. CPython에서는 `id(x)`가 객체의 주소를 돌려주지만, 그 값으로 계산하거나 다른 객체를 찾아갈 수는 없습니다. 같은 객체인지 확인하는 데(`is`)만 의미가 있습니다.

**Q. Rust에서 unsafe는 언제 쓰나요?**

A. C 라이브러리를 부르거나, 운영체제·하드웨어를 직접 다루거나, 표준 라이브러리 안쪽처럼 컴파일러가 증명할 수 없는 성능 최적화를 할 때 씁니다. 일반적인 프로그램에서는 거의 쓸 일이 없고, 슬라이스와 반복자로 충분합니다.

## 14. 핵심 요약

- 포인터 + n은 **자료형 n칸**만큼 이동합니다(`int *`는 4바이트씩, `double *`는 8바이트씩).
- 배열 이름은 첫 칸의 주소로 바뀌고, `a[i]`는 `*(a + i)`입니다. 함수에 넘긴 배열은 포인터가 되어 크기 정보를 잃습니다.
- 허용되는 포인터는 배열의 칸들과 **마지막 다음** 위치뿐입니다. 마지막 다음은 비교에만 쓰고 읽지 않습니다. 배열 앞(`a - 1`)은 만들면 안 됩니다.
- 포인터 뺄셈은 칸 수(`ptrdiff_t`, `%td`), 비교는 앞뒤 순서입니다. 같은 배열 안에서만 의미가 있습니다.
- 문자열은 `'\0'`까지 포인터를 옮겨 돕니다. `*p++`는 "읽고 옮기기", `(*p)++`는 "값 늘리기"입니다.
- 두 포인터 기법: 양 끝에서 좁혀 오며 뒤집기, 회문 검사, 정렬된 목록의 합 찾기를 한 번의 훑기로 합니다.
- Python은 위치 번호와 반복자, Rust는 슬라이스와 반복자로 같은 일을 안전하게 하고, Rust의 날 포인터 산술은 `unsafe`에서만 됩니다.

## 15. 도전 문제

1. **(C)** 포인터만 써서(인덱스 없이) 배열의 최댓값을 가리키는 포인터를 돌려주는 `int *max_ptr(int *a, int n)`을 만들고, 돌려받은 포인터로 최댓값을 0으로 바꿔 보세요.
2. **(Python)** 정렬된 두 목록을 두 위치(각 목록에 하나씩)로 한 번만 훑어 하나의 정렬된 목록으로 합치세요. 병합 정렬(Day 74)의 핵심 단계입니다.
3. **(Rust)** 슬라이스를 받아 0을 모두 뒤로 보내는(순서는 유지) `fn move_zeros(xs: &mut [i32])`를 두 인덱스로 만드세요(`[0, 1, 0, 3, 12]` → `[1, 3, 12, 0, 0]`).
4. **(세 언어)** 문자열에서 공백을 기준으로 단어의 시작과 끝 위치를 찾아, 각 단어를 제자리에서 뒤집으세요(`"abc de"` → `"cba ed"`). C는 포인터, Python과 Rust는 인덱스로 하세요(Rust는 영문만 다룬다고 가정하고 `as_bytes`나 `Vec<char>`를 쓰세요).
