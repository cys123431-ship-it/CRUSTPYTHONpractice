---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-40-malloc-free
courseId: crp-92
phaseId: phase-04
dayNumber: 40
date: "2026-11-09"
title: C 동적 할당과 해제
summary: 실행 중에 필요한 만큼 힙 공간을 받는 malloc·calloc·realloc과 돌려주는 free를 익힙니다. 크기를 sizeof *p로 계산하는 습관, NULL 검사, realloc이 실패할 때 원래 공간을 잃지 않는 법, 힙에 만든 결과를 돌려주고 부른 쪽이 해제하는 약속, 해제한 뒤 쓰기·두 번 해제·스택 배열 해제·해제 빠뜨리기(누수) 같은 대표 실수를 다룹니다. Rust의 Vec·String이 같은 일을 소유권과 Drop으로 자동으로 하는 방식, Python 리스트가 알아서 늘어나는 방식과 비교하고, 입력이 몇 개든 받아 두 배씩 늘어나는 정수 배열을 C로 직접 만들어 봅니다.
anchorLanguage: c
transferLanguages: [rust, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-39-string-slice]
learningObjectives:
  - 스택과 힙의 차이를 설명하고, 실행 중에 크기가 정해지는 공간을 malloc·calloc으로 받는다.
  - malloc 결과의 NULL 검사와 sizeof *p 크기 계산을 습관으로 쓴다.
  - realloc으로 공간을 늘리되, 실패할 때 원래 공간을 잃지 않게 쓴다.
  - 힙에 만든 결과를 돌려줄 때 누가 free할지 약속하고, 해제 후 사용·두 번 해제·누수를 피한다.
  - Rust Vec·String과 Python 리스트가 같은 일을 어떻게 자동으로 하는지 비교한다.
concepts:
  [
    heap,
    stack,
    malloc,
    calloc,
    realloc,
    free,
    null check,
    sizeof pointer idiom,
    memory leak,
    use after free,
    double free,
    dangling pointer,
    dynamic array,
    capacity doubling,
    vec,
    drop,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dyn_array.py — C의 realloc처럼 두 배씩 늘어나는 배열을 흉내 냅니다.
  cap, length, data = 1, 0, [None]
  for x in range(10):
      if length == cap:
          cap *= 2
          data = data + [None] * (cap - len(data))
          print("용량", cap)
      data[length] = x
      length += 1
  print(data[:length])
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day40-predict-c
    title: realloc 뒤의 내용 예측하기
    kind: predict
    objective: realloc이 원래 내용을 보존한 채 공간을 늘린다는 것을 추적한다.
    prompt: 출력되는 네 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *p = malloc(2 * sizeof *p);
          if (p == NULL) {
              return 1;
          }
          p[0] = 1;
          p[1] = 2;
          int *q = realloc(p, 4 * sizeof *q);
          if (q == NULL) {
              free(p);
              return 1;
          }
          q[2] = q[0] + q[1];
          q[3] = q[2] * 2;
          printf("%d %d %d %d\n", q[0], q[1], q[2], q[3]);
          free(q);
          return 0;
      }
    answer: "1 2 3 6"
    hint: "realloc은 앞의 두 칸을 새 공간으로 그대로 옮겨 줍니다. 늘어난 두 칸은 코드가 채웁니다."
    explanation: "realloc은 가능하면 제자리에서 늘리고, 안 되면 새 공간을 받아 원래 내용을 복사한 뒤 옛 공간을 해제합니다. 어느 쪽이든 앞의 1, 2는 보존됩니다. q[2] = 3, q[3] = 6입니다. 성공한 뒤에는 p를 쓰면 안 되고(옮겨졌을 수 있음), q만 free합니다."
    commonMistakes:
      - "realloc이 내용을 0으로 지운다고 생각함"
      - "p와 q를 둘 다 free함(두 번 해제)"
    language: c
    verification: run
  - id: ex-day40-predict-rs
    title: 용량과 길이 예측하기
    kind: predict
    objective: Vec의 용량(확보한 공간)과 길이(들어 있는 값)를 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let v: Vec<i32> = Vec::with_capacity(10);
          println!("{} {} {}", v.len(), v.is_empty(), v.capacity() >= 10);
      }
    answer: "0 true true"
    hint: "with_capacity는 공간만 미리 받아 둡니다. 값은 아직 하나도 없습니다."
    explanation: "C로 치면 malloc(10 * sizeof(int))만 하고 len = 0으로 둔 상태입니다. v[0]을 읽으면 범위 밖이라 패닉입니다. 용량은 '적어도 10'이 보장될 뿐 정확한 값은 정해져 있지 않으므로 >= 로 확인했습니다. push를 10번 하는 동안은 공간을 다시 받지 않습니다."
    commonMistakes:
      - "with_capacity(10)이 0을 10개 넣는다고 생각함(그것은 vec![0; 10])"
      - "용량이 정확히 10이라고 단정함"
    language: rust
    verification: run
  - id: ex-day40-fill
    title: 원소 수만큼 공간 받기 채우기
    kind: fill
    objective: malloc 크기를 원소 수 × 한 칸 크기로 계산한다.
    prompt: "빈칸을 채워 정수 n개가 들어갈 공간을 받고, 1부터 5까지의 합 '15'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int n = 5;
          int *arr = malloc((size_t)n * _____);
          if (arr == NULL) {
              return 1;
          }
          int sum = 0;
          for (int i = 0; i < n; i++) {
              arr[i] = i + 1;
              sum += arr[i];
          }
          printf("%d\n", sum);
          free(arr);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int n = 5;
          int *arr = malloc((size_t)n * sizeof *arr);
          if (arr == NULL) {
              return 1;
          }
          int sum = 0;
          for (int i = 0; i < n; i++) {
              arr[i] = i + 1;
              sum += arr[i];
          }
          printf("%d\n", sum);
          free(arr);
          return 0;
      }
    output: "15"
    hint: "malloc은 바이트 수를 받습니다. 한 칸의 크기를 포인터가 가리키는 자료형으로 구하세요."
    explanation: "sizeof *arr는 arr가 가리키는 int 한 칸의 크기(4바이트)입니다. sizeof(int)로 써도 되지만, *arr로 쓰면 나중에 자료형을 long long으로 바꿔도 이 줄을 고칠 필요가 없습니다. malloc(n)이라고만 쓰면 5바이트만 받아 int 다섯 개(20바이트)가 들어가지 않습니다."
    commonMistakes:
      - "malloc(n)으로 바이트 수와 원소 수를 섞음"
      - "sizeof arr로 써서 포인터 크기(8)를 곱함"
    language: c
    verification: run
  - id: ex-day40-modify
    title: 지역 배열 대신 힙에 만들어 돌려주기
    kind: modify
    objective: 함수가 끝나도 살아 있어야 하는 결과를 malloc으로 만들고, 부른 쪽이 free한다.
    prompt: "이 코드는 지역 배열의 주소를 돌려줘서 'function returns address of local variable' 경고(이 과정에서는 오류)가 납니다. make_squares가 malloc으로 공간을 받아 돌려주고, main이 다 쓴 뒤 free하도록 고쳐 '1 4 9'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int *make_squares(int n) {
          int out[3];
          for (int i = 0; i < n; i++) {
              out[i] = (i + 1) * (i + 1);
          }
          return out;
      }

      int main(void) {
          int *sq = make_squares(3);
          printf("%d %d %d\n", sq[0], sq[1], sq[2]);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int *make_squares(int n) {
          int *out = malloc((size_t)n * sizeof *out);
          if (out == NULL) {
              return NULL;
          }
          for (int i = 0; i < n; i++) {
              out[i] = (i + 1) * (i + 1);
          }
          return out;
      }

      int main(void) {
          int *sq = make_squares(3);
          if (sq == NULL) {
              return 1;
          }
          printf("%d %d %d\n", sq[0], sq[1], sq[2]);
          free(sq);
          return 0;
      }
    output: "1 4 9"
    hint: "힙 공간은 free하기 전까지 함수가 끝나도 남아 있습니다. 대신 누가 free할지 정해야 합니다."
    explanation: "지역 배열은 함수가 끝나면 사라지지만, malloc한 공간은 free할 때까지 삽니다. 그래서 크기가 실행 중에 정해지는 결과를 돌려줄 수 있습니다. 대가로 '돌려받은 쪽이 free한다'는 약속이 생기고, 이 약속은 함수 이름이나 주석으로 알려야 합니다(C 컴파일러는 검사하지 않음). Day 35의 '부른 쪽이 공간을 준비' 방식은 이 약속이 필요 없다는 장점이 있습니다."
    commonMistakes:
      - "static int out[3]으로 바꿔 크기가 3으로 고정되고, 다음 호출이 결과를 덮어씀"
      - "main에서 free를 빠뜨려 누수가 생김"
    language: c
    verification: run
  - id: ex-day40-debug
    title: 해제한 뒤 읽는 코드 고치기
    kind: debug
    objective: free는 공간을 다 쓴 뒤 마지막에 한다.
    prompt: '이 코드는 "pointer ''p'' used after ''free''" 경고(이 과정에서는 오류)로 컴파일되지 않습니다. 순서를 고쳐 ''합 6''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *p = malloc(3 * sizeof *p);
          if (p == NULL) {
              return 1;
          }
          for (int i = 0; i < 3; i++) {
              p[i] = i + 1;
          }
          free(p);
          printf("합 %d\n", p[0] + p[1] + p[2]);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *p = malloc(3 * sizeof *p);
          if (p == NULL) {
              return 1;
          }
          for (int i = 0; i < 3; i++) {
              p[i] = i + 1;
          }
          printf("합 %d\n", p[0] + p[1] + p[2]);
          free(p);
          return 0;
      }
    output: "합 6"
    hint: "free한 뒤의 공간은 이미 돌려준 것입니다. 그곳을 읽는 것은 반납한 책을 계속 읽겠다는 것과 같습니다."
    explanation: "free 뒤에도 p에는 옛 주소가 그대로 남아 있어서, 운이 좋으면 6이 나오고 운이 나쁘면 다른 값이나 프로그램 종료가 됩니다(정의되지 않은 동작). gcc가 이 단순한 경우는 찾아 주지만 복잡한 경우는 못 찾습니다. free한 직후 p = NULL;로 지워 두면 실수로 쓸 때 곧바로 멈춰서 찾기 쉽습니다. Rust에서는 drop(v) 뒤에 v를 쓰면 컴파일 오류(E0382)입니다."
    commonMistakes:
      - "free를 지우기만 해서 누수가 남"
      - "free(p) 뒤에 p = NULL을 하고 그대로 읽어 프로그램이 멈춤"
    language: c
    verification: run
  - id: ex-day40-independent
    title: Python으로 두 배씩 늘어나는 배열 흉내 내기
    kind: independent
    objective: 용량과 길이를 따로 관리하고, 가득 차면 두 배 공간으로 옮기는 과정을 만든다.
    prompt: "용량 1로 시작하는 DynArray 클래스를 만들어 push(x)마다 가득 찼으면 용량을 두 배로 늘리고 '용량 N'을 출력하세요. 0, 10, 20, 30, 40을 넣은 뒤 '길이 5 내용 [0, 10, 20, 30, 40]'을 출력합니다. 전체 출력은 네 줄입니다."
    starter: |-
      class DynArray:
          pass


      print("여기에 DynArray를 만들어 보세요")
    answer: |-
      class DynArray:
          def __init__(self):
              self.cap = 1
              self.len = 0
              self.data = [None] * self.cap

          def push(self, x):
              if self.len == self.cap:
                  self.cap *= 2
                  new_data = [None] * self.cap
                  for i in range(self.len):
                      new_data[i] = self.data[i]
                  self.data = new_data
                  print("용량", self.cap)
              self.data[self.len] = x
              self.len += 1


      a = DynArray()
      for x in range(5):
          a.push(x * 10)
      print("길이", a.len, "내용", a.data[:a.len])
    output: |-
      용량 2
      용량 4
      용량 8
      길이 5 내용 [0, 10, 20, 30, 40]
    hint: "C의 realloc이 하는 일(새 공간 받기, 복사하기, 옛 공간 버리기)을 직접 나눠 쓰면 됩니다. 클래스는 Day 51에서 자세히 배우니, 지금은 값 세 개를 묶는 상자로 생각하세요."
    explanation: "다섯 개를 넣는 동안 공간을 세 번만 늘렸습니다. 두 배씩 늘리면 n개를 넣을 때 복사하는 총량이 2n 정도로, 한 번 넣을 때 평균 비용이 일정합니다(분할 상환). 한 칸씩 늘리면 매번 전부 복사해야 해서 n²에 비례합니다. Python 리스트와 Rust Vec, C++ vector가 모두 이렇게 여유 공간을 두고 늘어납니다."
    commonMistakes:
      - "용량과 길이를 하나의 변수로 관리해 빈 칸까지 출력함"
      - "새 공간에 옛 내용을 복사하지 않아 앞의 값이 None이 됨"
    language: python
    verification: run
quiz:
  - id: quiz-day40-01
    question: 스택과 힙에 대한 설명으로 옳은 것은?
    choices:
      - 둘 다 함수가 끝나면 자동으로 정리된다
      - 스택의 지역 변수는 함수가 끝나면 사라지고, 힙 공간은 free할 때까지 남는다
      - 힙은 크기를 컴파일할 때 정해야 한다
      - 스택이 힙보다 항상 크다
    answerIndex: 1
    explanation: 스택은 함수 호출마다 자동으로 쌓였다가 사라져 빠르지만, 크기가 컴파일할 때 정해지고 비교적 작습니다. 힙은 실행 중에 원하는 크기를 받을 수 있고 함수가 끝나도 남지만, 직접 돌려줘야 합니다.
  - id: quiz-day40-02
    question: int *p = realloc(p, new_size);로 쓰면 생기는 문제는?
    choices:
      - 문제없다
      - realloc이 실패해 NULL을 돌려주면 p가 NULL로 덮여 원래 공간의 주소를 잃는다(누수)
      - 항상 컴파일 오류다
      - 내용이 지워진다
    answerIndex: 1
    explanation: 실패해도 원래 공간은 그대로 남아 있는데, 그 주소를 잃으면 free할 방법이 없습니다. 새 변수(q)로 받은 뒤 NULL이 아니면 p = q;로 바꾸세요.
  - id: quiz-day40-03
    question: 다음 중 정의되지 않은 동작이 아닌 것은?
    choices:
      - free한 뒤 그 포인터로 읽기
      - 같은 포인터를 두 번 free하기
      - free(NULL)
      - 스택 배열을 free하기
    answerIndex: 2
    explanation: free(NULL)은 아무 일도 하지 않도록 표준이 정해 두었습니다. 그래서 free 뒤에 p = NULL;을 해 두면 실수로 한 번 더 free해도 안전합니다. 나머지 셋은 프로그램을 망가뜨릴 수 있습니다.
  - id: quiz-day40-04
    question: 가득 찬 동적 배열을 늘릴 때 한 칸씩보다 두 배씩 늘리는 이유는?
    choices:
      - 메모리를 덜 쓰려고
      - 늘릴 때마다 전체를 복사하므로, 두 배씩 늘려야 복사 횟수가 적어 평균 비용이 일정하다
      - C 표준이 정해서
      - 차이가 없다
    answerIndex: 1
    explanation: 한 칸씩 늘리면 n개를 넣는 동안 1 + 2 + ... + n번 복사해 n²에 비례합니다. 두 배씩이면 1 + 2 + 4 + ... < 2n이라 한 번 넣는 평균 비용이 상수입니다. 대신 최대 절반의 공간이 비어 있을 수 있습니다.
  - id: quiz-day40-05
    question: Rust의 Vec<i32>가 C의 malloc/free에 비해 막아 주는 것은?
    choices:
      - 아무것도 막지 않는다
      - 해제를 빠뜨리는 누수, 해제 후 사용, 두 번 해제(주인이 범위를 벗어날 때 정확히 한 번 해제하고, 옮긴 뒤 사용은 컴파일 오류)
      - 메모리 부족
      - 정수 오버플로
    answerIndex: 1
    explanation: Vec은 (주소, 길이, 용량)을 가진 주인이라, 범위 끝에서 Drop이 공간을 돌려줍니다. drop(v) 뒤나 옮긴 뒤에 v를 쓰면 E0382입니다. 메모리 부족은 여전히 생길 수 있고, 그때는 프로그램이 멈춥니다.
---

## 1. 오늘 배울 내용

지금까지 C 배열은 `int a[5]`처럼 **크기를 코드에 적어야** 했습니다. Day 35에서는 함수가 결과를 돌려줄 때 부른 쪽이 공간을 준비해야 했습니다. 오늘은 **실행 중에 필요한 만큼** 공간을 받고, 다 쓰면 돌려주는 방법을 배웁니다.

1. 스택과 힙의 차이
2. 공간 받기와 돌려주기
   - `malloc(바이트 수)`: 공간을 받습니다(내용은 모름).
   - `calloc(개수, 크기)`: 0으로 채운 공간을 받습니다.
   - `realloc(p, 새 바이트 수)`: 크기를 바꿉니다.
   - `free(p)`: 돌려줍니다.
3. 안전한 습관
   - 크기는 `n * sizeof *p`로 계산합니다.
   - 결과가 `NULL`인지 항상 검사합니다.
   - `realloc`은 새 변수로 받아 실패해도 원래 공간을 잃지 않게 합니다.
   - `free` 뒤에는 `p = NULL;`로 옛 주소를 지웁니다.
4. 힙에 만든 결과를 돌려주고, **누가 `free`할지** 약속합니다.
5. 대표 실수: 해제 후 사용, 두 번 해제, 스택 배열 해제, 해제 빠뜨리기(누수)
6. 같은 일을 자동으로 하는 Rust `Vec`·`String`과 Python 리스트를 비교합니다.
7. 입력이 몇 개든 받는 **두 배씩 늘어나는 정수 배열**을 C로 직접 만듭니다.

## 2. 왜 필요한가

프로그램이 다룰 데이터의 양을 미리 알 수 없는 경우가 대부분입니다.

- 파일에 줄이 몇 개 있을지 모릅니다.
- 사용자가 이름을 몇 글자 입력할지 모릅니다.
- 그래프의 정점 수가 입력으로 주어집니다(Day 79~82).

`int a[1000000]`처럼 넉넉히 잡으면 대부분 낭비이고, 스택은 크기가 작아(보통 수 MB) 큰 배열을 두면 프로그램이 멈춥니다. 또 함수가 만든 결과를 **함수가 끝난 뒤에도** 쓰려면 스택이 아닌 곳에 두어야 합니다.

Rust의 `Vec`, `String`, `Box`와 Python의 리스트, 사전은 모두 속에서 힙을 씁니다. C에서 한 번 직접 해 보면, 그 자료형들이 무엇을 대신해 주는지 정확히 알 수 있습니다.

## 3. 그림으로 이해하기

```text
┌ 스택 ──────────────────────────┐        ┌ 힙 ─────────────────────────────┐
│ main                           │        │                                 │
│   int n = 5                    │        │  ┌────┬────┬────┬────┬────┐     │
│   int *sq ─────────────────────┼───────▶│  │ 1  │ 4  │ 9  │ 16 │ 25 │     │
│                                │        │  └────┴────┴────┴────┴────┘     │
│ make_squares (끝나면 사라짐)     │        │   malloc(5 * sizeof(int))로 받음 │
│   int *out ── 같은 주소 ─────── │        │   free(sq)까지 남아 있음         │
└────────────────────────────────┘        └─────────────────────────────────┘
```

`realloc`은 옆에 빈 공간이 있으면 제자리에서 늘리고, 없으면 **새 곳으로 옮깁니다.**

```text
전: sq ──▶ [1 4 9 16 25]  [다른 데이터...]      옆자리가 차 있다

realloc(sq, 8 * sizeof(int))
후: sq ──▶ [1 4 9 16 25 ? ? ?]                  새 곳에 복사
           [옛 공간은 돌려줌]                     옛 주소는 더 이상 쓰면 안 된다
```

동적 배열은 **길이**(들어 있는 값)와 **용량**(확보한 공간)을 따로 관리합니다.

```text
data ──▶ [ 5 │ 3 │ 8 │ 1 │ 9 │   │   │   ]
          └──── len = 5 ─────┘
          └────────── cap = 8 ────────────┘
push: len < cap이면 그냥 넣고, len == cap이면 두 배로 realloc한 뒤 넣는다
```

## 4. 천천히 풀어보기

### 4.1 네 가지 함수

| 함수                  | 하는 일                                 | 실패하면             | 내용                  |
| --------------------- | --------------------------------------- | -------------------- | --------------------- |
| `malloc(bytes)`       | `bytes`바이트를 받음                    | `NULL`               | 알 수 없음(쓰레기 값) |
| `calloc(count, size)` | `count × size`바이트를 받아 0으로 채움  | `NULL`               | 모두 0                |
| `realloc(p, bytes)`   | `p`의 크기를 바꿈(옮길 수 있음)         | `NULL`, `p`는 그대로 | 앞부분 보존           |
| `free(p)`             | 돌려줌. `p`가 `NULL`이면 아무것도 안 함 | -                    | -                     |

네 함수는 모두 `<stdlib.h>`에 있습니다. `malloc`이 돌려주는 `void *`는 C에서 다른 포인터 자료형으로 자동 변환되므로 `(int *)` 같은 형 변환을 쓰지 않아도 됩니다.

### 4.2 크기는 sizeof *p로

```c
int *arr = malloc((size_t)n * sizeof *arr);
```

- `sizeof *arr`는 `arr`가 가리키는 칸 하나의 크기입니다. 실제로 `*arr`를 계산하지는 않으므로 아직 공간이 없어도 안전합니다.
- 자료형을 `long long *arr`로 바꿔도 이 줄은 그대로 맞습니다.
- `(size_t)n`은 곱셈을 크기 자료형으로 하기 위해서입니다. 아주 큰 `n`이면 곱셈이 넘칠 수 있는데, `calloc(n, sizeof *arr)`는 이 넘침을 검사해 줍니다.

### 4.3 누가 free하는가

힙 공간에는 **정확히 한 명의 주인**이 있어서, 그 주인이 **정확히 한 번** `free`해야 합니다. C는 이 규칙을 검사하지 않으므로 코드로 약속합니다.

- `make_...`, `copy_...`, `new_...` 같은 이름의 함수가 포인터를 돌려주면 "부른 쪽이 `free`한다"는 뜻으로 문서에 적습니다(표준 함수 `strdup`이 이렇습니다).
- 구조체가 힙 공간을 가지면 짝이 되는 `..._free` 함수를 만듭니다(실습의 `vec_free`).
- 포인터를 다른 변수에 복사해도 주인은 하나입니다. 두 곳에서 `free`하면 두 번 해제입니다.

Rust는 이 약속을 **소유권 규칙**으로 만들어 컴파일러가 검사하게 했습니다(Day 32, 35).

### 4.4 해제와 관련된 네 가지 실수

| 실수                | 무슨 일이 생기나                                     | 막는 습관                           |
| ------------------- | ---------------------------------------------------- | ----------------------------------- |
| 해제 빠뜨리기(누수) | 오래 도는 프로그램의 메모리가 계속 늘어남            | 받는 곳과 돌려주는 곳을 짝으로 작성 |
| 해제 후 사용        | 다른 용도로 다시 쓰인 공간을 읽거나 덮어씀           | `free` 뒤 `p = NULL;`               |
| 두 번 해제          | 메모리 관리 정보가 망가져 나중에 엉뚱한 곳에서 멈춤  | 주인을 하나로, `free` 뒤 `NULL`     |
| 힙이 아닌 것 해제   | 스택 배열이나 리터럴을 `free`하면 곧바로 멈추기 쉬움 | `malloc`류로 받은 것만 `free`       |

gcc는 단순한 경우 일부를 경고로 알려 주고, `-fsanitize=address`(주소 검사기)나 Valgrind 같은 도구가 실행 중에 이런 실수를 찾아 줍니다.

## 5. C로 구현하기

```c
// 파일: heap_basics.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int *make_squares(int n) {                  // 힙에 만들어 돌려준다: 부른 쪽이 free할 책임
    int *out = malloc((size_t)n * sizeof *out);
    if (out == NULL) {
        return NULL;                        // 공간을 못 받으면 NULL
    }
    for (int i = 0; i < n; i++) {
        out[i] = (i + 1) * (i + 1);
    }
    return out;
}

char *copy_string(const char *s) {          // 문자열을 힙에 복사한다('\0' 자리까지)
    size_t len = strlen(s);
    char *copy = malloc(len + 1);
    if (copy == NULL) {
        return NULL;
    }
    memcpy(copy, s, len + 1);
    return copy;
}

int main(void) {
    int n = 5;
    int *sq = make_squares(n);
    if (sq == NULL) {
        printf("메모리 부족\n");
        return 1;
    }
    printf("squares:");
    for (int i = 0; i < n; i++) {
        printf(" %d", sq[i]);
    }
    printf("\n");

    int *bigger = realloc(sq, 8 * sizeof *bigger);   // 크기를 8칸으로 늘린다
    if (bigger == NULL) {
        free(sq);                           // 실패해도 원래 공간은 그대로라 직접 정리
        return 1;
    }
    sq = bigger;                            // 옮겨졌을 수 있으니 새 주소를 쓴다
    for (int i = n; i < 8; i++) {
        sq[i] = (i + 1) * (i + 1);
    }
    printf("realloc 뒤 마지막 칸 %d\n", sq[7]);
    free(sq);                               // 받은 공간을 돌려준다
    sq = NULL;                              // 돌려준 주소를 남겨 두지 않는다

    int *zeros = calloc(4, sizeof *zeros);  // 0으로 채운 공간
    if (zeros == NULL) {
        return 1;
    }
    printf("calloc: %d %d %d %d\n", zeros[0], zeros[1], zeros[2], zeros[3]);
    free(zeros);

    char *name = copy_string("momo");
    if (name == NULL) {
        return 1;
    }
    name[0] = 'M';                         // 힙 복사본은 바꿀 수 있다(리터럴은 불가)
    printf("복사본: %s (%zu바이트 + 널 문자)\n", name, strlen(name));
    free(name);

    free(NULL);                             // NULL을 free하는 것은 아무 일도 하지 않는다(안전)
    printf("끝\n");
    return 0;
}
```

실행 결과:

```text
squares: 1 4 9 16 25
realloc 뒤 마지막 칸 64
calloc: 0 0 0 0
복사본: Momo (4바이트 + 널 문자)
끝
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `int *out = malloc((size_t)n * sizeof *out);`    | 실행 중에 정해진 `n`칸을 힙에 받습니다. 스택 배열과 달리 함수가 끝나도 남습니다.                                  |
| `if (out == NULL) { return NULL; }`              | 공간을 못 받으면 `NULL`입니다. 검사 없이 `out[i]`에 쓰면 프로그램이 멈춥니다. 실패를 부른 쪽에 그대로 알렸습니다. |
| `char *copy = malloc(len + 1);`                  | 문자열 복사에는 `'\0'` 자리 1바이트가 더 필요합니다(Day 37). `memcpy(copy, s, len + 1)`로 널 문자까지 복사합니다. |
| `int *bigger = realloc(sq, 8 * sizeof *bigger);` | 결과를 **새 변수**로 받습니다. 실패하면 `sq`가 그대로 남아 있어 `free(sq)`로 정리할 수 있습니다.                  |
| `sq = bigger;`                                   | 성공하면 옮겨졌을 수 있으니 새 주소를 씁니다. 옛 주소 값은 더 이상 믿으면 안 됩니다.                              |
| `free(sq); sq = NULL;`                           | 돌려준 뒤 옛 주소를 지워 둡니다. 실수로 다시 쓰면 `NULL` 접근이라 곧바로 멈춰서 원인을 찾기 쉽습니다.             |
| `calloc(4, sizeof *zeros)`                       | 0으로 채운 네 칸입니다. `malloc`으로 받은 공간의 처음 값은 알 수 없으므로, 0이 필요하면 `calloc`을 씁니다.        |
| `name[0] = 'M';`                                 | 힙 복사본은 우리 공간이라 바꿀 수 있습니다. 원래 리터럴 `"momo"`는 읽기 전용이라 바꿀 수 없습니다.                |

## 6. Rust로 구현하기

Rust에서는 같은 일을 `Vec`과 `String`이 합니다. 공간을 받고, 늘리고, 돌려주는 코드를 **직접 쓰지 않습니다.**

```rust
// 파일: heap_vec.rs
fn make_squares(n: usize) -> Vec<i32> {     // 힙 공간의 주인(Vec)을 통째로 돌려준다
    (1..=n as i32).map(|i| i * i).collect()
}

fn copy_string(s: &str) -> String {
    s.to_string()                           // 힙에 복사한 새 주인
}

fn main() {
    let mut sq = make_squares(5);
    println!("squares: {sq:?}");
    sq.reserve(3);                          // 적어도 3칸 더 들어갈 공간(realloc에 해당)
    println!("용량이 8칸 이상인가: {}", sq.capacity() >= 8);
    for i in 6..=8 {
        sq.push(i * i);
    }
    println!("늘린 뒤 마지막 칸 {}", sq[7]);
    drop(sq);                               // free에 해당. 이후 sq는 쓸 수 없다

    let zeros = vec![0; 4];                 // calloc에 해당
    println!("vec![0; 4]: {zeros:?}");

    let mut name = copy_string("momo");
    name.replace_range(0..1, "M");          // 힙 복사본은 바꿀 수 있다
    println!("복사본: {name} ({}바이트)", name.len());

    let big: Vec<u8> = Vec::with_capacity(1000);   // 공간만 미리, 길이는 0
    println!("with_capacity: 길이 {}, 1000칸 이상 확보 {}", big.len(), big.capacity() >= 1000);
    println!("끝");                          // 남은 name, zeros, big은 여기서 자동 정리
}
```

실행 결과:

```text
squares: [1, 4, 9, 16, 25]
용량이 8칸 이상인가: true
늘린 뒤 마지막 칸 64
vec![0; 4]: [0, 0, 0, 0]
복사본: Momo (4바이트)
with_capacity: 길이 0, 1000칸 이상 확보 true
끝
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fn make_squares(n: usize) -> Vec<i32>` | 힙 공간의 **주인**을 돌려줍니다. 누가 해제할지 따로 약속할 필요가 없습니다. 돌려받은 변수가 주인입니다.                               |
| `sq.reserve(3)`                         | 적어도 3칸이 더 들어갈 공간을 확보합니다. C의 `realloc`에 해당하지만, 옮겨도 주소를 직접 다룰 일이 없습니다.                          |
| `sq.capacity() >= 8`                    | 정확한 용량은 표준 라이브러리가 정하므로 "적어도"만 확인했습니다.                                                                     |
| `drop(sq);`                             | C의 `free(sq)`에 해당합니다. 이후 `sq`를 쓰면 컴파일 오류라 해제 후 사용이 불가능합니다. 쓰지 않아도 범위 끝에서 자동으로 해제됩니다. |
| `vec![0; 4]`                            | 0으로 채운 네 칸, C의 `calloc`입니다.                                                                                                 |
| `name.replace_range(0..1, "M")`         | `String`의 앞 1바이트를 바꿨습니다. 힙 공간은 `name`이 소유하므로 자유롭게 고칠 수 있습니다.                                          |
| `Vec::with_capacity(1000)`              | 공간만 미리 받고 길이는 0입니다. 넣을 개수를 알 때 늘리기를 줄이는 방법입니다.                                                        |

## 7. Python으로 구현하기

```python
# 파일: heap_list.py
def make_squares(n):
    return [(i + 1) ** 2 for i in range(n)]  # 새 리스트를 돌려준다(정리는 자동)


sq = make_squares(5)
print("squares:", sq)
sq.extend([36, 49, 64])                     # 늘리는 것도 알아서
print("늘린 뒤 마지막 칸", sq[7])
del sq                                      # 이름을 지우면, 다른 이름이 없을 때 정리된다

zeros = [0] * 4
print("[0] * 4:", zeros)
buf = bytearray(4)                          # 0으로 채운, 바꿀 수 있는 바이트 공간
buf[0] = 77
print("bytearray:", buf, bytes(buf[:1]).decode())

name = "momo"
name = "M" + name[1:]                       # 문자열은 바꿀 수 없어 새로 만든다
print("복사본:", name, f"({len(name.encode())}바이트)")
print("끝")
```

실행 결과:

```text
squares: [1, 4, 9, 16, 25]
늘린 뒤 마지막 칸 64
[0] * 4: [0, 0, 0, 0]
bytearray: bytearray(b'M\x00\x00\x00') M
복사본: Momo (4바이트)
끝
```

### 코드 한 부분씩 읽기

| 코드                                      | 설명                                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `return [(i + 1) ** 2 for i in range(n)]` | 리스트는 항상 힙에 만들어지고, 가리키는 곳이 없어지면 실행기가 정리합니다(Day 35).                                        |
| `sq.extend([36, 49, 64])`                 | 공간이 모자라면 리스트가 알아서 여유 있게 늘어납니다. 얼마나 여유를 두는지는 실행기의 몫이라 코드에서 신경 쓰지 않습니다. |
| `del sq`                                  | C의 `free`와 달리 이름만 지웁니다. 다른 이름이 같은 리스트를 가리키면 리스트는 계속 삽니다.                               |
| `bytearray(4)`                            | 0으로 채운, 바꿀 수 있는 바이트 공간입니다. C의 `calloc(4, 1)`에 가장 가깝습니다.                                         |
| `name = "M" + name[1:]`                   | 문자열은 바꿀 수 없어 새로 만듭니다. 옛 문자열은 가리키는 이름이 없어지면 정리됩니다.                                     |

## 8. 실행 추적

C 예제의 `sq`가 가리키는 공간이 어떻게 바뀌는지 따라갑니다.

| 줄                                         | `sq`                   | 힙에 있는 공간                                  |
| ------------------------------------------ | ---------------------- | ----------------------------------------------- |
| `int *sq = make_squares(n);`               | 주소 A                 | A: 5칸 `1 4 9 16 25`                            |
| `int *bigger = realloc(sq, 8 * ...);`      | 주소 A(아직 그대로)    | B: 8칸 `1 4 9 16 25 ? ? ?` (A와 같을 수도 있음) |
| `sq = bigger;`                             | 주소 B                 | B                                               |
| `for (int i = n; i < 8; i++) sq[i] = ...;` | 주소 B                 | B: `1 4 9 16 25 36 49 64`                       |
| `free(sq);`                                | 주소 B(옛 주소가 남음) | 없음                                            |
| `sq = NULL;`                               | `NULL`                 | 없음                                            |

A와 B가 같은지 다른지는 실행할 때마다 다를 수 있습니다. 그래서 `realloc` 뒤에는 항상 **돌려받은 주소**를 씁니다.

## 9. 다른 예제로 다시 이해하기

**몇 개가 들어올지 모르는 입력.** 정수를 입력이 끝날 때까지 읽어 개수, 합, 마지막 값을 출력합니다. 배열 크기를 미리 정할 수 없으므로 **가득 차면 두 배로 늘리는** 정수 배열을 만듭니다.

```c
// 파일: int_vec.c
#include <stdio.h>
#include <stdlib.h>

typedef struct {                            // 구조체는 Day 50에서 자세히: 세 값을 한 묶음으로
    int *data;
    size_t len;
    size_t cap;
} IntVec;

int vec_push(IntVec *v, int x) {
    if (v->len == v->cap) {                 // 가득 찼으면 두 배로 늘린다
        size_t new_cap = v->cap == 0 ? 4 : v->cap * 2;
        int *p = realloc(v->data, new_cap * sizeof *p);
        if (p == NULL) {
            return 0;                       // 실패: 기존 내용은 그대로
        }
        printf("  (용량 %zu → %zu)\n", v->cap, new_cap);
        v->data = p;
        v->cap = new_cap;
    }
    v->data[v->len++] = x;
    return 1;
}

void vec_free(IntVec *v) {
    free(v->data);
    v->data = NULL;
    v->len = v->cap = 0;
}

int main(void) {
    IntVec v = {NULL, 0, 0};                // 처음엔 공간이 없다
    int x;
    while (scanf("%d", &x) == 1) {          // 입력이 끝날 때까지 몇 개든 읽는다
        if (!vec_push(&v, x)) {
            printf("메모리 부족\n");
            vec_free(&v);
            return 1;
        }
    }
    long long sum = 0;
    for (size_t i = 0; i < v.len; i++) {
        sum += v.data[i];
    }
    printf("%zu개, 합 %lld, 마지막 %d\n", v.len, sum, v.len > 0 ? v.data[v.len - 1] : 0);
    vec_free(&v);
    return 0;
}
```

입력:

```text
5 3 8 1 9 2 7 4 6 10 11
```

실행 결과:

```text
  (용량 0 → 4)
  (용량 4 → 8)
  (용량 8 → 16)
11개, 합 66, 마지막 11
```

| 코드                                                            | 설명                                                                                                                              |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { int *data; size_t len; size_t cap; } IntVec;` | 주소, 길이, 용량을 한 묶음으로 만들었습니다. Rust의 `Vec<i32>`가 속에 가진 세 값과 똑같습니다. 구조체 문법은 Day 50에서 배웁니다. |
| `IntVec v = {NULL, 0, 0};`                                      | 처음에는 공간이 없습니다. `realloc(NULL, 크기)`는 `malloc(크기)`와 같아서 첫 `push`도 같은 코드로 처리됩니다.                     |
| `if (v->len == v->cap)`                                         | 가득 찼을 때만 늘립니다. `v->len`은 `(*v).len`의 줄임입니다.                                                                      |
| `v->cap == 0 ? 4 : v->cap * 2`                                  | 처음에는 4칸, 이후 두 배씩입니다. 11개를 넣는 동안 공간을 세 번만 받았습니다.                                                     |
| `int *p = realloc(v->data, ...); if (p == NULL) return 0;`      | 실패해도 `v->data`가 그대로라, 부른 쪽이 `vec_free`로 정리할 수 있습니다.                                                         |
| `v->data[v->len++] = x;`                                        | 빈 칸 중 첫 칸에 넣고 길이를 1 늘립니다.                                                                                          |
| `void vec_free(IntVec *v)`                                      | `free`와 함께 길이·용량을 0으로 돌려, 해제한 뒤 실수로 `push`해도 새로 시작하게 했습니다.                                         |

Rust에서는 같은 프로그램이 이렇게 짧아집니다. 늘리는 시점과 크기는 `Vec`이 정하므로, 코드는 **몇 번 늘었는지**만 셉니다.

```rust
// 파일: read_all.rs
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();   // 입력 전체를 String 하나에
    let mut v: Vec<i32> = Vec::new();
    let mut grew = 0;
    for word in input.split_whitespace() {
        let before = v.capacity();
        v.push(word.parse().unwrap());
        if v.capacity() != before {
            grew += 1;                      // 몇 번 늘었는지만 센다(정확한 용량은 표준 라이브러리 몫)
        }
    }
    let sum: i64 = v.iter().map(|&x| x as i64).sum();
    println!("{}개, 합 {sum}, 마지막 {}", v.len(), v.last().copied().unwrap_or(0));
    println!("공간을 늘린 횟수가 개수보다 훨씬 적은가: {}", grew < v.len() / 2);
}
```

입력:

```text
5 3 8 1 9 2 7 4 6 10 11
```

실행 결과:

```text
11개, 합 66, 마지막 11
공간을 늘린 횟수가 개수보다 훨씬 적은가: true
```

Python에서는 한 줄입니다.

```python
# 파일: read_all.py
import sys

v = [int(word) for word in sys.stdin.read().split()]   # 몇 개든 리스트가 알아서 늘어난다
print(f"{len(v)}개, 합 {sum(v)}, 마지막 {v[-1] if v else 0}")
```

입력:

```text
5 3 8 1 9 2 7 4 6 10 11
```

실행 결과:

```text
11개, 합 66, 마지막 11
```

세 프로그램이 하는 일은 같습니다. 차이는 **누가 늘리고 누가 돌려주는가**입니다. C는 코드가 전부 하고, Rust는 `Vec`이 하되 규칙을 컴파일러가 검사하며, Python은 실행기가 알아서 합니다.

## 10. 동적 메모리 대응표

| 하고 싶은 일   | C                              | Rust                             | Python                       |
| -------------- | ------------------------------ | -------------------------------- | ---------------------------- |
| n칸 받기       | `malloc(n * sizeof *p)`        | `Vec::with_capacity(n)`          | (필요 없음)                  |
| 0으로 채운 n칸 | `calloc(n, sizeof *p)`         | `vec![0; n]`                     | `[0] * n`                    |
| 크기 늘리기    | `realloc`(새 변수로 받기)      | `reserve`, `push`(자동)          | `append`, `extend`(자동)     |
| 돌려주기       | `free(p); p = NULL;`           | 범위 끝(자동), `drop(v)`         | 가리키는 곳이 없어지면(자동) |
| 문자열 복사본  | `malloc(len + 1)` + `memcpy`   | `s.to_string()`                  | 필요 없음(바꿀 수 없음)      |
| 결과 돌려주기  | 포인터 + "부른 쪽이 free" 약속 | `Vec`/`String` 반환(소유권 이동) | 그냥 반환                    |

## 11. 세 언어 비교

| 관점                    | C                  | Rust                         | Python                            |
| ----------------------- | ------------------ | ---------------------------- | --------------------------------- |
| 해제 시점               | `free`를 부른 곳   | 주인이 범위를 벗어날 때      | 가리키는 곳이 0개가 될 때         |
| 누수                    | 쉽게 생김          | 거의 없음(`Rc` 순환 등 예외) | 참조를 잊지 않고 들고 있으면 생김 |
| 해제 후 사용·두 번 해제 | 정의되지 않은 동작 | 컴파일 오류                  | 일어날 수 없음                    |
| 공간 늘리기             | 직접(`realloc`)    | 자동(`Vec`)                  | 자동(리스트)                      |
| 비용                    | 필요한 만큼만      | C와 거의 같음                | 객체마다 추가 정보와 개수 세기    |

## 12. 자주 하는 실수

### 실수 1: 해제한 뒤 사용한다 (C)

```c
// 파일: use_after_free.c (컴파일 오류: used after 'free')
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(3 * sizeof *p);
    if (p == NULL) {
        return 1;
    }
    p[0] = 42;
    free(p);
    printf("%d\n", p[0]);
    return 0;
}
```

gcc가 이렇게 단순한 경우는 찾아 주지만, 포인터가 함수를 여러 번 건너가면 찾지 못합니다. 다 쓴 뒤에 `free`하고, `free` 뒤에는 `p = NULL;`을 쓰세요.

### 실수 2: 스택 배열을 free한다 (C)

```c
// 파일: free_stack.c (컴파일 오류: 'free' called on unallocated object)
#include <stdlib.h>

int main(void) {
    int scores[3] = {1, 2, 3};
    free(scores);
    return 0;
}
```

`free`에는 `malloc`·`calloc`·`realloc`이 돌려준 주소만 넘깁니다.

### 실수 3: realloc 결과를 같은 변수에 바로 받는다 (C)

`p = realloc(p, n);`은 실패하면 `p`가 `NULL`이 되어 원래 공간을 잃습니다. `int *q = realloc(p, n); if (q == NULL) { ... } p = q;`로 쓰세요.

### 실수 4: 바이트 수와 원소 수를 섞는다 (C)

`malloc(n)`은 `n`**바이트**입니다. 정수 `n`개에는 `n * sizeof *p`가 필요합니다. 컴파일러가 알려 주지 않고, 작은 입력에서는 우연히 동작하다가 큰 입력에서 망가지는 까다로운 버그입니다.

### 실수 5: drop한 값을 다시 쓴다 (Rust)

```rust
// 파일: after_drop.rs (컴파일 오류: E0382)
fn main() {
    let v = vec![1, 2, 3];
    drop(v);
    println!("{}", v[0]);
}
```

C의 해제 후 사용이 Rust에서는 컴파일 오류입니다. `drop`은 소유권을 가져가는 평범한 함수이기 때문입니다.

## 13. Q&A

**Q. 프로그램이 끝나면 운영체제가 메모리를 돌려받지 않나요? 그럼 free를 안 해도 되지 않나요?**

A. 프로그램이 끝나면 운영체제가 모든 메모리를 돌려받는 것은 맞습니다. 하지만 서버, 게임, 편집기처럼 오래 도는 프로그램은 누수가 쌓여 결국 메모리를 다 씁니다. 또 함수가 여러 번 불리는 곳에서 누수가 생기면 짧은 프로그램도 문제가 됩니다. 받은 곳과 돌려주는 곳을 짝으로 쓰는 습관이 중요합니다.

**Q. malloc은 실제로 실패하나요?**

A. 보통 컴퓨터에서 작은 크기는 거의 실패하지 않지만, 아주 큰 크기(잘못 계산한 크기 포함)나 메모리가 작은 장치에서는 실패합니다. 검사하지 않으면 실패했을 때 원인을 찾기 어려운 곳에서 멈추므로, 항상 검사하는 습관을 들이세요.

**Q. Rust의 Vec은 속에서 realloc을 쓰나요?**

A. 네, 비슷한 일을 하는 할당자 함수를 씁니다. 차이는 그 과정이 `Vec` 안에 숨어 있고, 옮긴 뒤 옛 주소를 쓰는 코드(예: 요소를 빌린 채로 `push`)를 빌림 규칙이 막는다는 점입니다(Day 33의 E0502).

**Q. 스택은 얼마나 큰가요?**

A. 운영체제와 설정에 따라 다르지만 보통 1~8MB입니다. `int big[10000000];`(40MB)을 함수 안에 두면 스택이 넘쳐 프로그램이 멈춥니다. 큰 배열은 힙에 받으세요.

## 14. 핵심 요약

- 스택의 지역 변수는 함수가 끝나면 사라지고, **힙 공간은 `free`할 때까지** 남습니다. 크기가 실행 중에 정해지거나 함수 밖에서도 써야 하는 데이터는 힙에 둡니다.
- `malloc(n * sizeof *p)`로 받고, 결과가 `NULL`인지 검사합니다. 0이 필요하면 `calloc`입니다.
- `realloc`은 내용을 보존하며 크기를 바꾸고 옮길 수도 있습니다. **새 변수로 받아** 실패해도 원래 공간을 잃지 않게 합니다.
- 힙 공간에는 **주인이 하나**, 해제도 **정확히 한 번**입니다. 결과를 돌려주는 함수는 "부른 쪽이 `free`한다"를 문서로 약속합니다.
- 해제 후 사용, 두 번 해제, 힙이 아닌 것 해제, 누수가 대표 실수입니다. `free` 뒤 `p = NULL;`이 도움이 됩니다.
- 동적 배열은 길이와 용량을 따로 두고, 가득 차면 **두 배로** 늘립니다. Rust `Vec`, Python 리스트가 이 일을 자동으로 하며, Rust는 해제 규칙을 컴파일러가 검사합니다.

## 15. 도전 문제

1. **(C)** 실습의 `IntVec`에 `int vec_pop(IntVec *v, int *out)`(마지막 값을 꺼내 `*out`에 넣고 성공하면 1)과, 길이가 용량의 4분의 1 아래로 줄면 용량을 절반으로 줄이는 기능을 추가하세요.
2. **(C)** 한 줄을 끝까지 읽어 힙 문자열로 돌려주는 `char *read_line(void)`을 만드세요. `getchar()`로 한 글자씩 읽으며 버퍼를 두 배씩 늘리고, 부른 쪽이 `free`합니다.
3. **(Rust)** `Vec::with_capacity(n)`으로 시작한 경우와 `Vec::new()`로 시작한 경우, `n`개를 `push`하는 동안 `capacity()`가 바뀐 횟수를 각각 세어 비교해 보세요.
4. **(Python)** 실습의 `DynArray`를 한 칸씩 늘리는 방식으로 바꾸고, 10,000개를 넣는 동안 복사한 칸 수의 합을 두 방식에서 각각 세어 비교하세요.
