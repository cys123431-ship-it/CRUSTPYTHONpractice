---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-18-loop-break
courseId: crp-92
phaseId: phase-02
dayNumber: 18
date: "2026-10-18"
title: 반복 제어 — loop, break, continue와 값을 돌려주는 반복
summary: 반복의 흐름을 바꾸는 break(즉시 끝내기)와 continue(이번 차례 건너뛰기)를 세 언어로 익히고, Rust의 loop가 break로 값을 돌려주는 표현식이라는 것을 배웁니다. 올바른 입력이 나올 때까지 다시 받는 재시도 반복, 이중 반복을 한 번에 빠져나가는 방법(Rust의 이름 붙인 반복 'outer, C의 깃발 변수와 goto, Python의 return과 for-else)을 비교하고, switch 안의 break가 반복을 끝내지 못하는 함정을 확인합니다. ATM 명령 처리기와 소수 찾기로 연습합니다.
anchorLanguage: rust
transferLanguages: [c, python]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-17-while-loop]
learningObjectives:
  - break와 continue가 반복의 흐름을 어떻게 바꾸는지 추적한다.
  - Rust의 loop와 break 값으로 조건을 만족하는 첫 값을 찾아 바인딩에 담는다.
  - 올바른 값이 나올 때까지 다시 시도하는 반복을 세 언어로 쓴다.
  - 이중 반복을 한 번에 빠져나가는 방법(이름 붙인 반복, 깃발, goto, return)을 비교한다.
  - Python의 for-else로 '끝까지 찾지 못한 경우'를 처리한다.
concepts:
  [
    loop,
    break,
    continue,
    break with value,
    labeled loop,
    flag variable,
    goto,
    for else,
    retry loop,
    nested loop exit,
  ]
runnerMode: python
playgroundSource: |
  # 파일: control.py — break와 continue의 위치를 바꿔 보세요.
  for i in range(1, 11):
      if i % 3 == 0:
          continue          # 3의 배수는 건너뛴다
      if i > 8:
          break             # 8보다 크면 끝낸다
      print(i, end=" ")
  print()
  for n in (91, 97):
      for d in range(2, n):
          if n % d == 0:
              print(n, "=", d, "×", n // d)
              break
      else:
          print(n, "은 소수")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day18-predict-rs
    title: loop와 break 값 예측하기
    kind: predict
    objective: loop가 break로 돌려주는 값과 반복이 끝났을 때의 변수 값을 추적한다.
    prompt: 출력되는 두 값을 공백으로 구분해 적으세요.
    starter: |-
      fn main() {
          let mut x = 1;
          let r = loop {
              x *= 2;
              if x > 20 {
                  break x - 1;
              }
          };
          println!("{x} {r}");
      }
    answer: "32 31"
    hint: "x는 2, 4, 8, 16, 32로 커집니다. 처음으로 20을 넘는 값에서 break합니다."
    explanation: "x가 32가 되었을 때 break x - 1로 31을 돌려주고, 그 값이 r에 담깁니다. loop는 break의 값이 곧 loop 전체의 값인 표현식입니다. x는 반복 밖에서 만든 mut 바인딩이라 반복 뒤에도 32로 남아 있습니다."
    commonMistakes:
      - "16에서 멈춘다고 생각해 16 15로 적음"
      - "r과 x가 같다고 생각함"
    language: rust
    verification: run
  - id: ex-day18-predict-py
    title: continue와 break 섞기 예측하기
    kind: predict
    objective: continue는 이번 차례만, break는 반복 전체를 끝낸다는 것을 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      for i in range(1, 10):
          if i % 3 == 0:
              continue
          if i > 7:
              break
          print(i, end=" ")
      print()
    answer: "1 2 4 5 7"
    hint: "3, 6은 continue로 건너뜁니다. 8에서 break로 반복이 끝납니다. 9는 검사조차 하지 않습니다."
    explanation: "i = 3, 6일 때 continue가 print를 건너뛰고 다음 i로 갑니다. i = 8은 3의 배수가 아니라 두 번째 if로 가서 break합니다. 반복을 끝내는 조건과 건너뛰는 조건의 순서에 따라 결과가 바뀝니다."
    commonMistakes:
      - "8을 출력하고 끝난다고 생각함"
      - "continue를 break처럼 반복이 끝난다고 생각해 1 2만 적음"
    language: python
    verification: run
  - id: ex-day18-fill
    title: 이름 붙인 반복으로 빠져나가기
    kind: fill
    objective: 이중 반복을 한 번에 끝내도록 break에 반복 이름을 붙인다.
    prompt: "a² + b² = 25인 첫 쌍(a < b)을 찾으면 두 반복을 모두 끝내도록 빈칸을 채워 '3 4'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut pair = (0, 0);
          'outer: for a in 1..10 {
              for b in a + 1..10 {
                  if a * a + b * b == 25 {
                      pair = (a, b);
                      break _____;
                  }
              }
          }
          println!("{} {}", pair.0, pair.1);
      }
    answer: |-
      fn main() {
          let mut pair = (0, 0);
          'outer: for a in 1..10 {
              for b in a + 1..10 {
                  if a * a + b * b == 25 {
                      pair = (a, b);
                      break 'outer;
                  }
              }
          }
          println!("{} {}", pair.0, pair.1);
      }
    output: "3 4"
    hint: "그냥 break는 가장 안쪽 반복만 끝냅니다. 바깥 반복 앞에 붙인 이름을 쓰세요."
    explanation: "'outer:처럼 작은따옴표로 시작하는 이름을 반복에 붙이면, 안쪽 어디서든 break 'outer나 continue 'outer로 그 반복을 지정할 수 있습니다. 여기서는 (3, 4)를 찾자마자 두 반복이 모두 끝납니다. pair.0, pair.1은 튜플의 첫째, 둘째 값입니다."
    commonMistakes:
      - "break outer처럼 작은따옴표를 빠뜨림"
      - "안쪽 반복에 이름을 붙여 바깥 반복은 계속 돎"
    language: rust
    verification: run
  - id: ex-day18-modify
    title: 음수를 continue로 건너뛰기
    kind: modify
    objective: continue로 처리하지 않을 값을 건너뛴다.
    prompt: "data의 음수는 잘못 측정된 값입니다. continue를 써서 음수를 건너뛰고 나머지의 합 15를 출력하세요."
    starter: |-
      data = [5, -2, 7, -1, 3]
      total = 0
      for x in data:
          total += x
      print(total)
    answer: |-
      data = [5, -2, 7, -1, 3]
      total = 0
      for x in data:
          if x < 0:
              continue
          total += x
      print(total)
    output: "15"
    hint: "건너뛸 조건을 반복 몸통의 맨 앞에서 검사하세요."
    explanation: "continue는 '이 값은 처리하지 않는다'를 몸통 맨 앞에서 보여 줘서, 나머지 코드를 if 안에 한 단계 더 들여쓰지 않아도 됩니다. 조건문의 보호 조건(Day 13)을 반복에 쓴 것과 같습니다."
    commonMistakes:
      - "continue 대신 break를 써서 5만 더함"
      - "total += x 뒤에 검사해서 음수가 이미 더해짐"
    language: python
    verification: run
  - id: ex-day18-debug
    title: switch 안의 break 함정 고치기
    kind: debug
    objective: switch 안의 break는 switch만 끝내고 바깥 반복은 계속된다는 것을 확인한다.
    prompt: "명령 0은 '종료'인데, 이 코드는 종료를 출력한 뒤에도 다음 명령을 처리합니다. 0을 만나면 반복이 끝나도록 고쳐서 마지막 '명령 1'이 출력되지 않게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          int cmds[] = {1, 2, 0, 1};
          for (int i = 0; i < 4; i++) {
              switch (cmds[i]) {
              case 0:
                  printf("종료\n");
                  break;
              default:
                  printf("명령 %d\n", cmds[i]);
                  break;
              }
          }
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          int cmds[] = {1, 2, 0, 1};
          for (int i = 0; i < 4; i++) {
              if (cmds[i] == 0) {
                  printf("종료\n");
                  break;
              }
              printf("명령 %d\n", cmds[i]);
          }
          return 0;
      }
    output: |-
      명령 1
      명령 2
      종료
    starterOutput: |-
      명령 1
      명령 2
      종료
      명령 1
    hint: "break는 자신을 감싼 가장 가까운 switch나 반복 하나만 끝냅니다. 여기서는 switch가 더 가깝습니다."
    explanation: "switch의 break가 switch만 빠져나가서 for는 계속 돌았습니다. 종료 조건을 switch 밖의 if로 검사하거나, 깃발 변수를 두거나, goto를 씁니다. Rust는 match 안에서 break를 쓰면 바로 바깥 반복이 끝나므로 이런 함정이 없습니다."
    commonMistakes:
      - "case 0의 break를 지우기만 해서 default까지 실행됨"
      - "return 0으로 고쳐 main 전체가 끝나 버림(이 코드에서는 결과가 같지만, 반복 뒤에 할 일이 있으면 틀림)"
    language: c
    verification: run
  - id: ex-day18-independent
    title: Rust로 조건을 만족하는 첫 수 찾기
    kind: independent
    objective: loop와 break 값으로 검색 결과를 바인딩에 담는다.
    prompt: "100보다 크면서 7과 11로 모두 나누어떨어지는 가장 작은 수를 loop와 break 값으로 찾아 출력하세요."
    starter: |-
      fn main() {
          let mut n = 101;
          println!("{n}");
      }
    answer: |-
      fn main() {
          let mut n = 101;
          let found = loop {
              if n % 7 == 0 && n % 11 == 0 {
                  break n;
              }
              n += 1;
          };
          println!("{found}");
      }
    output: "154"
    hint: "101부터 1씩 늘리며 검사하고, 조건을 만족하면 그 수를 break로 돌려주세요."
    explanation: "7과 11로 모두 나누어떨어지는 수는 77의 배수라 77, 154, …입니다. 100보다 큰 첫 번째는 154입니다. loop와 break 값을 쓰면 '찾을 때까지 반복하고, 찾은 값을 돌려준다'를 바인딩 하나로 표현할 수 있어서, 결과를 담을 mut 변수가 따로 필요 없습니다."
    commonMistakes:
      - "n을 늘리는 줄을 빠뜨려 무한 반복이 됨"
      - "&& 대신 ||를 써서 105가 나옴"
    language: rust
    verification: run
quiz:
  - id: quiz-day18-01
    question: 반복 안에서 continue를 만나면?
    choices:
      - 반복 전체가 끝난다
      - 이번 차례의 나머지를 건너뛰고 다음 차례로 간다
      - 프로그램이 끝난다
      - 반복을 처음부터 다시 시작한다
    answerIndex: 1
    explanation: continue는 몸통의 나머지를 건너뛰고, for라면 다음 값으로, while이라면 조건 검사로 돌아갑니다. C의 for에서는 갱신 부분(i++)이 실행된 뒤 조건을 검사합니다.
  - id: quiz-day18-02
    question: Rust에서 let x = loop { break 5; };의 x는?
    choices: ["()", "5", "컴파일 오류", "무한 반복"]
    answerIndex: 1
    explanation: loop는 break 뒤의 값을 돌려주는 표현식입니다. while과 for는 반복이 한 번도 안 돌 수 있어서 값을 돌려줄 수 없고, loop만 break 값을 가질 수 있습니다.
  - id: quiz-day18-03
    question: C에서 이중 for 안쪽의 break는?
    choices:
      - 두 반복을 모두 끝낸다
      - 가장 안쪽의 반복 하나만 끝낸다
      - 바깥 반복만 끝낸다
      - 컴파일 오류다
    answerIndex: 1
    explanation: C의 break는 자신을 감싼 가장 가까운 반복(또는 switch) 하나만 끝냅니다. 두 반복을 모두 끝내려면 깃발 변수, goto, 함수의 return을 씁니다. Rust는 이름 붙인 반복으로 바로 지정할 수 있습니다.
  - id: quiz-day18-04
    question: Python의 for ... else에서 else 블록이 실행되는 경우는?
    choices:
      - 반복이 한 번도 돌지 않았을 때만
      - 반복이 break 없이 끝까지 돌았을 때
      - break로 빠져나왔을 때
      - 항상
    answerIndex: 1
    explanation: for-else의 else는 '찾지 못했을 때'라고 읽으면 쉽습니다. break로 무언가를 찾아 빠져나오면 else를 건너뛰고, 끝까지 찾지 못하면 else가 실행됩니다. 반복이 0번 돌아도 break가 없었으니 else가 실행됩니다.
  - id: quiz-day18-05
    question: 올바른 입력이 나올 때까지 다시 받는 반복을 쓸 때 가장 주의할 점은?
    choices:
      - 반복 변수를 i로 짓는다
      - 입력이 끝나 버리는 경우에도 반복이 끝나도록 한다
      - continue를 쓰지 않는다
      - 반복 횟수를 미리 정한다
    answerIndex: 1
    explanation: 입력이 끝났는데 계속 '다시 입력하세요'만 반복하면 무한 반복이 됩니다. 읽기에 실패하면(EOF) 반복을 끝내거나, 시도 횟수에 한계를 두는 것이 안전합니다(Day 17).
---

## 1. 오늘 배울 내용

Day 17에서 `break`를 잠깐 썼습니다. 오늘은 **반복의 흐름을 바꾸는 도구**를 모두 정리합니다.

1. `break`: 반복을 **즉시** 끝냅니다.
2. `continue`: **이번 차례만** 건너뛰고 다음 차례로 갑니다.
3. Rust의 **`loop`**: 끝없는 반복이면서, `break 값`으로 **값을 돌려주는** 표현식입니다.
4. **재시도 반복**: 올바른 값이 나올 때까지 다시 받습니다.
5. **이중 반복을 한 번에 빠져나가는** 방법을 비교합니다.
   - Rust: 이름 붙인 반복 `'outer`
   - C: 깃발 변수, `goto`
   - Python: 함수의 `return`
6. Python의 **`for-else`**: "끝까지 찾지 못한 경우"를 처리합니다.
7. C의 `switch` 안에 있는 `break`가 **반복을 끝내지 못하는** 함정을 봅니다.

## 2. 왜 필요한가

반복문의 조건만으로 흐름을 다 표현하기 어려울 때가 있습니다.

- 목록에서 원하는 값을 **찾자마자** 멈추고 싶습니다. 나머지를 볼 필요가 없습니다.
- 잘못된 데이터(음수, 빈 줄)는 **건너뛰고** 나머지만 처리하고 싶습니다.
- 사용자가 올바르게 입력할 때까지 **다시 묻고**, 올바른 값을 받아 쓰고 싶습니다.
- 2차원 표에서 값을 찾으면 **두 반복을 모두** 끝내고 싶습니다.

`break`와 `continue`는 이런 흐름을 몇 글자로 표현합니다. 다만 흐름이 여기저기서 바뀌면 코드를 따라가기 어려워지므로, **어디서 어디로 가는지** 정확히 아는 것이 중요합니다.

## 3. 그림으로 이해하기

`break`와 `continue`가 어디로 가는지 그림으로 봅시다.

```text
for i in 1..=10 {                 ◀─────────┐
    if i % 2 == 0 {                          │
        continue;  ──────────────────────────┘  다음 i로(몸통의 나머지를 건너뜀)
    }
    if i > 7 {
        break;     ──────────────────────────┐  반복 밖으로
    }                                        │
    합계 += i;                               │
}                                            │
println!(...)     ◀──────────────────────────┘
```

이중 반복에서 그냥 `break`는 **가장 안쪽** 반복만 끝냅니다.

```text
'outer: for a in ... {          ◀── break 'outer 는 여기를 끝냄
    for b in ... {              ◀── break 는 여기만 끝냄
        if 찾았다 { break 'outer; }
    }
    (안쪽만 끝났다면 여기서 다음 a를 계속)
}
```

## 4. 천천히 풀어보기

### 4.1 break와 continue

| 도구       | 하는 일                     | for에서 다음에 실행되는 것      | while에서 다음에 실행되는 것 |
| ---------- | --------------------------- | ------------------------------- | ---------------------------- |
| `break`    | 가장 가까운 반복을 끝냄     | 반복 다음 줄                    | 반복 다음 줄                 |
| `continue` | 이번 차례의 나머지를 건너뜀 | 다음 값(C는 갱신 `i++` 후 조건) | 조건 검사                    |

`continue`는 몸통 **맨 앞**에서 "이 값은 처리하지 않는다"를 걸러 낼 때 가장 읽기 좋습니다. 조건문의 보호 조건과 같은 모양입니다.

`while`에서 `continue`를 쓸 때는 조심하세요. 조건 변수를 바꾸는 줄보다 앞에서 `continue`하면 그 줄이 실행되지 않아 **무한 반복**이 됩니다.

### 4.2 Rust의 loop와 break 값

| 반복    | 언제 끝나나        | 값을 돌려줄 수 있나 |
| ------- | ------------------ | ------------------- |
| `for`   | 반복자가 끝나면    | 아니요              |
| `while` | 조건이 거짓이면    | 아니요              |
| `loop`  | `break`를 만나야만 | **예**(`break 값`)  |

`for`와 `while`은 한 번도 반복하지 않을 수 있어서 "돌려줄 값이 없는" 경우가 생깁니다. `loop`는 반드시 `break`로만 끝나므로 그 자리의 값을 결과로 삼을 수 있습니다.

```rust
let found = loop {
    if 조건 { break 찾은_값; }
    다음으로;
};
```

C와 Python에서는 반복 **밖에** 변수를 만들어 두고 `break` 직전에 값을 넣습니다.

### 4.3 이중 반복 빠져나가기

| 방법            | 언어         | 모양                                     |
| --------------- | ------------ | ---------------------------------------- |
| 이름 붙인 반복  | Rust         | `'outer: for ...` / `break 'outer;`      |
| 깃발 변수       | C, Python    | `done = 1; break;` + 바깥 조건에 `!done` |
| `goto`          | C            | `goto found;` + `found:` 표시            |
| 함수와 `return` | 세 언어 모두 | 이중 반복을 함수로 묶고 찾으면 `return`  |

`goto`는 코드를 아무 곳으로나 점프시켜 흐름을 복잡하게 만들 수 있어서 대부분 피하지만, **여러 겹의 반복을 한 번에 빠져나가거나** 오류가 났을 때 정리 코드로 가는 용도로는 C에서 흔히 쓰입니다. 가장 깔끔한 방법은 보통 **함수로 묶고 `return`** 하는 것입니다.

### 4.4 for-else (Python)

Python의 `for`와 `while`에는 `else`를 붙일 수 있습니다. **`break` 없이 끝까지 돌았을 때** 실행됩니다. "찾으면 `break`, 끝까지 못 찾으면 `else`"라는 검색 모양에 딱 맞습니다.

```python
for d in range(2, n):
    if n % d == 0:
        print("약수 발견")
        break
else:
    print("소수")          # break가 한 번도 없었다
```

이름 때문에 헷갈리기 쉬워서, 쓸 때는 주석으로 "찾지 못했을 때"라고 적어 두면 좋습니다.

## 5. Rust로 구현하기

```rust
// 파일: loop_break.rs
fn main() {
    // 1) break 값: 조건을 만족하는 첫 값을 찾아 돌려받는다
    let mut n = 1;
    let first = loop {
        if n * n > 50 {
            break n * n;                // loop 전체의 값이 된다
        }
        n += 1;
    };
    println!("50보다 큰 첫 제곱수: {first} ({n}²)");

    // 2) continue: 이번 차례의 나머지를 건너뛰고 다음 차례로
    let mut odd_sum = 0;
    for i in 1..=10 {
        if i % 2 == 0 {
            continue;
        }
        odd_sum += i;
    }
    println!("1~10 홀수 합: {odd_sum}");

    // 3) 올바른 값이 나올 때까지 다시 받기(입력 대신 목록 사용)
    let inputs = ["abc", "-5", "42"];
    let mut idx = 0;
    let age: u32 = loop {
        let text = inputs[idx];
        idx += 1;
        match text.parse::<u32>() {
            Ok(value) => break value,
            Err(_) => println!("'{text}'는 올바른 나이가 아닙니다. 다시 입력하세요."),
        }
    };
    println!("입력한 나이: {age}");

    // 4) 이름 붙인 반복: 이중 반복을 한 번에 빠져나간다
    let target = 42;
    let mut found = None;
    'outer: for a in 1..10 {
        for b in 1..10 {
            if a * b == target {
                found = Some((a, b));
                break 'outer;
            }
        }
    }
    println!("곱이 {target}인 첫 쌍: {found:?}");
}
```

실행 결과:

```text
50보다 큰 첫 제곱수: 64 (8²)
1~10 홀수 합: 25
'abc'는 올바른 나이가 아닙니다. 다시 입력하세요.
'-5'는 올바른 나이가 아닙니다. 다시 입력하세요.
입력한 나이: 42
곱이 42인 첫 쌍: Some((6, 7))
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `let first = loop { ... break n * n; ... };` | `loop` 전체가 값 64를 돌려줍니다. 끝의 세미콜론은 `let` 문장의 끝입니다.                                                                                     |
| `if i % 2 == 0 { continue; }`                | 짝수는 더하지 않고 다음 `i`로 갑니다. `for`라서 다음 값으로 자동으로 넘어갑니다.                                                                             |
| `let age: u32 = loop { ... };`               | 올바른 나이를 얻을 때까지 반복하고, 얻은 값을 `age`에 담습니다. 이렇게 하면 `age`는 `mut`가 아니어도 되고, "아직 값이 없는" 순간이 생기지 않습니다.          |
| `match text.parse::<u32>()`                  | 변환 결과를 `match`합니다. `Ok(value)`면 `break value`, `Err(_)`면 안내만 출력하고 다음 반복으로 갑니다. `"-5"`는 부호 없는 정수로 바꿀 수 없어 `Err`입니다. |
| `'outer: for a in 1..10`                     | 반복에 이름을 붙였습니다. 이름은 작은따옴표로 시작합니다(수명 표기와 모양이 같지만 다른 것입니다).                                                           |
| `break 'outer;`                              | 안쪽에서 바깥 반복까지 한 번에 끝냅니다.                                                                                                                     |
| `found = Some((a, b));`                      | 못 찾을 수도 있으므로 `Option`에 담았습니다(`None`으로 시작).                                                                                                |

## 6. C로 구현하기

C의 무한 반복은 `while (1)`이나 `for (;;)`로 씁니다. 값을 돌려주는 반복은 없으니 결과는 반복 밖의 변수에 담습니다.

```c
// 파일: loop_break.c
#include <stdio.h>

int main(void) {
    // 1) 무한 반복 + break: 결과는 반복 밖의 변수에 담는다
    int n = 1, first;
    while (1) {
        if (n * n > 50) {
            first = n * n;
            break;
        }
        n++;
    }
    printf("50보다 큰 첫 제곱수: %d (%d²)\n", first, n);

    // 2) continue
    int odd_sum = 0;
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;                   // for에서는 갱신(i++)으로 넘어간다
        }
        odd_sum += i;
    }
    printf("1~10 홀수 합: %d\n", odd_sum);

    // 3) 올바른 값이 나올 때까지 다시 받기
    const char *inputs[] = {"abc", "-5", "42"};
    int idx = 0, age;
    for (;;) {                          // for(;;)도 무한 반복
        const char *text = inputs[idx++];
        if (sscanf(text, "%d", &age) == 1 && age >= 0) {
            break;
        }
        printf("'%s'는 올바른 나이가 아닙니다. 다시 입력하세요.\n", text);
    }
    printf("입력한 나이: %d\n", age);

    // 4) 이중 반복 빠져나가기: 깃발 변수
    int target = 42, fa = 0, fb = 0, done = 0;
    for (int a = 1; a < 10 && !done; a++) {
        for (int b = 1; b < 10; b++) {
            if (a * b == target) {
                fa = a;
                fb = b;
                done = 1;
                break;                  // 안쪽 반복만 끝난다
            }
        }
    }
    printf("곱이 %d인 첫 쌍: (%d, %d)\n", target, fa, fb);

    // 4') 같은 일을 goto로: 여러 겹의 반복을 한 번에
    for (int a = 1; a < 10; a++) {
        for (int b = 1; b < 10; b++) {
            if (a * b == target) {
                printf("goto로 찾은 쌍: (%d, %d)\n", a, b);
                goto found;
            }
        }
    }
found:
    return 0;
}
```

실행 결과:

```text
50보다 큰 첫 제곱수: 64 (8²)
1~10 홀수 합: 25
'abc'는 올바른 나이가 아닙니다. 다시 입력하세요.
'-5'는 올바른 나이가 아닙니다. 다시 입력하세요.
입력한 나이: 42
곱이 42인 첫 쌍: (6, 7)
goto로 찾은 쌍: (6, 7)
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `int n = 1, first;`                         | `first`는 반복 안에서 값을 받습니다. `break` 전에 반드시 넣어야 합니다.                                                                        |
| `continue;` (for 안)                        | C의 `for`에서 `continue`는 **갱신 부분(`i++`)을 실행한 뒤** 조건을 검사합니다. 그래서 무한 반복이 되지 않습니다.                               |
| `const char *inputs[] = {...};`             | 문자열 세 개의 배열입니다(Day 37). `inputs[idx++]`는 현재 칸을 쓴 뒤 `idx`를 1 늘립니다.                                                       |
| `for (;;)`                                  | 초기화·조건·갱신을 모두 비운 무한 반복입니다.                                                                                                  |
| `sscanf(text, "%d", &age) == 1 && age >= 0` | `sscanf`는 `scanf`처럼 읽되, 키보드가 아니라 **문자열**에서 읽습니다. `"abc"`는 0개를 읽어 실패, `"-5"`는 읽기는 성공하지만 음수라 거절됩니다. |
| `for (int a = 1; a < 10 && !done; a++)`     | 깃발 변수 `done`이 1이 되면 바깥 반복의 조건이 거짓이 되어 끝납니다. 안쪽 `break`와 **함께** 써야 합니다.                                      |
| `goto found;` / `found:`                    | `found:`라는 이름표로 바로 점프합니다. 두 반복을 한 번에 빠져나갑니다. 이름표 뒤에는 문장이 있어야 해서 `return 0;`이 바로 옵니다.             |

## 7. Python으로 구현하기

Python에는 `loop`와 이름 붙인 반복이 없습니다. `while True` + `break`, 함수의 `return`, 그리고 `for-else`를 씁니다.

```python
# 파일: loop_break.py
n = 1
while True:
    if n * n > 50:
        first = n * n
        break
    n += 1
print(f"50보다 큰 첫 제곱수: {first} ({n}²)")

odd_sum = 0
for i in range(1, 11):
    if i % 2 == 0:
        continue
    odd_sum += i
print("1~10 홀수 합:", odd_sum)

inputs = ["abc", "-5", "42"]
idx = 0
while True:
    text = inputs[idx]
    idx += 1
    if text.isdigit():                  # 0~9로만 이루어졌나
        age = int(text)
        break
    print(f"'{text}'는 올바른 나이가 아닙니다. 다시 입력하세요.")
print("입력한 나이:", age)


def find_pair(target):
    for a in range(1, 10):
        for b in range(1, 10):
            if a * b == target:
                return a, b             # return은 모든 반복을 한 번에 끝낸다
    return None


print("곱이 42인 첫 쌍:", find_pair(42))

for d in range(2, 97):                  # for-else: break 없이 끝나면 else 실행
    if 97 % d == 0:
        print("97은", d, "로 나누어떨어진다")
        break
else:
    print("97은 소수")
```

실행 결과:

```text
50보다 큰 첫 제곱수: 64 (8²)
1~10 홀수 합: 25
'abc'는 올바른 나이가 아닙니다. 다시 입력하세요.
'-5'는 올바른 나이가 아닙니다. 다시 입력하세요.
입력한 나이: 42
곱이 42인 첫 쌍: (6, 7)
97은 소수
```

### 코드 한 부분씩 읽기

| 코드                                     | 설명                                                                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `while True:` ... `first = n * n; break` | 결과를 반복 밖에서도 쓸 수 있는 변수 `first`에 담고 빠져나갑니다. Python의 변수는 `if` 안에서 만들어도 반복 밖에서 보입니다(Day 23).    |
| `text.isdigit()`                         | 문자열이 숫자 글자로만 이루어졌는지 검사합니다. `"-5"`는 `-` 때문에 거짓입니다. 변환 실패를 예외로 처리하는 방법은 Day 47에서 배웁니다. |
| `def find_pair(target): ... return a, b` | 이중 반복을 함수로 묶으면 `return` 하나로 모든 반복이 끝납니다. 못 찾으면 마지막 줄의 `return None`에 도달합니다.                       |
| `for d in range(2, 97): ... else:`       | 97을 나누는 수를 끝까지 찾지 못해 `else`가 실행되었습니다. 91이었다면 7에서 `break`하고 `else`는 건너뜁니다.                            |

## 8. 실행 추적

C의 깃발 변수 방식을 `target = 42`로 따라갑니다. 안쪽 `break`만으로는 바깥이 계속 돈다는 점이 핵심입니다.

| `a` | 안쪽에서 일어난 일                         | `done` | 바깥 조건 `a < 10 && !done` |
| --: | ------------------------------------------ | -----: | --------------------------- |
|   1 | b = 1~9, 42 없음                           |      0 | (a=2) 참                    |
|   2 | b = 1~9, 42 없음                           |      0 | (a=3) 참                    |
|   … | …                                          |      0 | 참                          |
|   6 | b = 7에서 6 × 7 = 42 → `done = 1`, `break` |      1 | (a=7) **거짓** → 끝         |

`done` 검사가 바깥 조건에 없었다면 a = 7, 8, 9도 돌면서 7 × 6 = 42를 다시 찾아 결과를 덮어썼을 것입니다.

## 9. 다른 예제로 다시 이해하기

**ATM 명령 처리기.** 명령 목록을 차례로 처리하되, 처리할 수 없는 명령(잔액 부족, 모르는 명령)은 `continue`로 건너뛰고, `quit`을 만나면 `break`로 남은 명령을 무시합니다. 명령은 단어 목록의 **모양**으로 `match`합니다(Day 15).

```rust
// 파일: atm.rs
fn main() {
    let commands = [
        "deposit 5000",
        "withdraw 2000",
        "withdraw 9000",
        "hello",
        "balance",
        "quit",
        "deposit 1",
    ];
    let mut balance: i64 = 0;
    let mut done = 0;
    for line in commands {
        let words: Vec<&str> = line.split_whitespace().collect();
        match words.as_slice() {
            ["deposit", n] => {
                let n: i64 = n.parse().unwrap();
                balance += n;
                println!("입금 {n} → 잔액 {balance}");
            }
            ["withdraw", n] => {
                let n: i64 = n.parse().unwrap();
                if n > balance {
                    println!("잔액 부족: {balance}원뿐입니다");
                    continue;           // 이 명령은 처리하지 않고 다음 명령으로
                }
                balance -= n;
                println!("출금 {n} → 잔액 {balance}");
            }
            ["balance"] => println!("잔액 {balance}원"),
            ["quit"] => {
                println!("종료");
                break;                  // 남은 명령은 읽지 않는다
            }
            _ => {
                println!("알 수 없는 명령: {line}");
                continue;
            }
        }
        done += 1;
    }
    println!("처리한 명령 {done}개, 최종 잔액 {balance}원");
}
```

실행 결과:

```text
입금 5000 → 잔액 5000
출금 2000 → 잔액 3000
잔액 부족: 3000원뿐입니다
알 수 없는 명령: hello
잔액 3000원
종료
처리한 명령 3개, 최종 잔액 3000원
```

| 코드                                                        | 설명                                                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `let words: Vec<&str> = line.split_whitespace().collect();` | 한 줄을 단어 목록으로 만듭니다. `Vec`은 크기가 바뀌는 목록입니다(Day 28).                           |
| `match words.as_slice() { ["deposit", n] => ... }`          | 단어가 정확히 두 개이고 첫 단어가 `"deposit"`이면 둘째 단어를 `n`에 담습니다.                       |
| `continue;` (잔액 부족, 모르는 명령)                        | 이 명령은 **처리한 개수**에 넣지 않고 다음 명령으로 갑니다. 그래서 `done += 1`이 실행되지 않습니다. |
| `break;` (`quit`)                                           | 마지막 `"deposit 1"`은 읽지도 않습니다. 최종 잔액이 3000원인 것으로 확인할 수 있습니다.             |
| `done += 1;` (match 뒤)                                     | `continue`나 `break`를 만나지 않은 명령만 여기까지 옵니다: 입금, 출금, 잔액 조회 3개입니다.         |

**소수 찾기.** 처음 10개의 소수를 찾습니다. 바깥 `while`은 "10개를 모을 때까지", 안쪽 `for`는 "약수를 찾으면 `break`, 못 찾으면 `else`에서 소수로 추가"입니다.

```python
# 파일: primes.py
primes = []
n = 2
while len(primes) < 10:
    for d in range(2, int(n ** 0.5) + 1):   # √n까지만 나눠 보면 충분하다
        if n % d == 0:
            break                           # 약수를 찾음 → 소수가 아님
    else:
        primes.append(n)                    # break 없이 끝남 → 소수
    n += 1
print(primes)
```

실행 결과:

```text
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

약수는 √n까지만 확인하면 충분합니다. n = a × b에서 a와 b가 둘 다 √n보다 클 수는 없기 때문입니다. 그래서 `range(2, int(n ** 0.5) + 1)`입니다. n = 2, 3처럼 이 범위가 비어 있으면 반복을 한 번도 돌지 않고, `break`도 없었으니 `else`가 실행되어 소수로 추가됩니다.

## 10. 반복 제어 도구 한눈에 보기

| 하고 싶은 일         | Rust                    | C                       | Python              |
| -------------------- | ----------------------- | ----------------------- | ------------------- |
| 무한 반복            | `loop { }`              | `while (1)`, `for (;;)` | `while True:`       |
| 반복 끝내기          | `break;`                | `break;`                | `break`             |
| 값을 돌려주며 끝내기 | `break 값;` (loop만)    | 변수에 넣고 `break`     | 변수에 넣고 `break` |
| 이번 차례 건너뛰기   | `continue;`             | `continue;`             | `continue`          |
| 바깥 반복까지 끝내기 | `break 'outer;`         | 깃발, `goto`            | 깃발, 함수 `return` |
| 끝까지 못 찾았을 때  | (반복 뒤 `Option` 검사) | (깃발 검사)             | `for ... else`      |

## 11. 세 언어 비교

| 관점                          | Rust                                          | C                   | Python                        |
| ----------------------------- | --------------------------------------------- | ------------------- | ----------------------------- |
| 무한 반복 전용 문법           | `loop`                                        | (없음, `while (1)`) | (없음, `while True`)          |
| 반복이 값을 돌려주나          | `loop`는 예                                   | 아니요              | 아니요                        |
| 이름 붙인 반복                | 있음(`'이름:`)                                | 없음(`goto`로 대신) | 없음                          |
| `switch`/`match` 안의 `break` | 바깥 반복을 끝냄(`match`는 break 대상이 아님) | **`switch`만 끝냄** | (`match`는 break 대상이 아님) |
| 반복의 `else`                 | 없음                                          | 없음                | 있음(`break` 없이 끝나면)     |

## 12. 자주 하는 실수

### 실수 1: while에서 continue가 갱신을 건너뛴다

```python
# 파일: continue_skip.py
i = 0
evens = 0
while i < 10:
    i += 1                  # 갱신을 continue보다 먼저!
    if i % 2 == 1:
        continue
    evens += 1
print(evens)
```

실행 결과:

```text
5
```

`i += 1`을 `continue` 뒤에 두면, 홀수일 때 갱신이 건너뛰어져 `i`가 영원히 1에 머뭅니다. `while`에서 `continue`를 쓸 때는 **갱신을 몸통 맨 앞**에 두거나 `for`로 바꾸세요.

### 실수 2: switch 안의 break로 반복을 끝내려 한다 (C)

실습의 디버그 문제입니다. `switch` 안의 `break`는 `switch`만 끝냅니다.

### 실수 3: 안쪽 break로 두 반복이 끝난다고 생각한다

8절의 추적처럼 안쪽 `break`만 쓰면 바깥 반복은 계속 돕니다. 이름 붙인 반복, 깃발, 함수를 쓰세요.

### 실수 4: break를 반복 밖에서 쓴다

```rust
// 파일: break_outside.rs (컴파일 오류: E0268)
fn main() {
    let x = 3;
    if x > 2 {
        break;
    }
    println!("{x}");
}
```

`break`는 반복 안에서만 쓸 수 있습니다. 함수를 끝내려면 `return`을 씁니다.

### 실수 5: loop의 break 값 자료형이 서로 다르다 (Rust)

```rust
// 파일: break_types.rs (컴파일 오류: E0308)
fn main() {
    let mut n = 0;
    let r = loop {
        n += 1;
        if n == 3 {
            break n;
        }
        if n > 10 {
            break "없음";
        }
    };
    println!("{r}");
}
```

`loop`의 모든 `break` 값은 같은 자료형이어야 합니다. "없을 수도 있다"는 `Option`으로 표현하세요(`break Some(n)` / `break None`).

## 13. Q&A

**Q. break와 continue를 많이 쓰면 나쁜 코드인가요?**

A. 적절히 쓰면 코드가 짧고 분명해집니다(보호 조건처럼). 하지만 한 반복 안에 `break`와 `continue`가 여러 군데 흩어지면 "이 줄은 언제 실행되지?"를 따라가기 어려워집니다. 그럴 때는 반복 몸통을 함수로 나누거나, 조건을 반복 조건 쪽으로 옮기는 것을 고려하세요.

**Q. C에서 goto를 쓰면 안 된다고 들었습니다.**

A. `goto`를 여기저기 쓰면 흐름이 거미줄처럼 얽힌 "스파게티 코드"가 되어서 피하라는 조언이 있습니다. 하지만 이중 반복 빠져나가기, 오류가 났을 때 한 곳에서 자원을 정리하기(Day 40, 46)처럼 **아래쪽으로 한 번 점프하는** 용도는 리눅스 커널 같은 큰 C 프로젝트에서도 흔히 씁니다.

**Q. Rust의 `'outer`와 수명 `'a`는 관계가 있나요?**

A. 모양만 같습니다. 반복 이름(label)은 반복을 가리키고, 수명(lifetime, Day 45)은 참조가 유효한 범위를 가리킵니다. 둘 다 작은따옴표로 시작하는 이름이라는 공통점만 있습니다.

**Q. Python의 for-else는 자주 쓰나요?**

A. 검색 반복에서 깔끔하지만, 다른 언어에는 없고 이름이 헷갈려서 쓰지 않는 사람도 많습니다. 깃발 변수나 함수 `return`으로도 같은 일을 할 수 있습니다. 쓴다면 `# 찾지 못했을 때` 같은 주석을 붙이세요.

## 14. 핵심 요약

- `break`는 가장 가까운 반복을 즉시 끝내고, `continue`는 이번 차례의 나머지를 건너뛰고 다음 차례로 갑니다.
- Rust의 `loop`는 `break`로만 끝나는 무한 반복이고, `break 값`으로 **값을 돌려주는 표현식**입니다. 모든 `break` 값의 자료형이 같아야 합니다.
- 재시도 반복: 올바른 값이 나올 때까지 다시 받고, 얻은 값을 반복의 결과로 씁니다. 입력이 끝나는 경우도 처리합니다.
- 이중 반복을 한 번에 빠져나가기: Rust `break 'outer`, C 깃발 변수나 `goto`, 세 언어 공통으로 함수 `return`.
- C `switch` 안의 `break`는 `switch`만 끝냅니다.
- Python `for-else`의 `else`는 `break` 없이 끝까지 돌았을 때(찾지 못했을 때) 실행됩니다.
- `while`에서 `continue`를 쓸 때는 갱신을 먼저 해 두어야 무한 반복을 피합니다.

## 15. 도전 문제

1. **(Rust)** 1부터 차례로 `n² + n + 41`을 계산해, 처음으로 소수가 **아닌** 값이 나오는 n을 `loop`와 `break` 값으로 찾으세요.
2. **(C)** 3×3 표(2차원 배열)에서 음수를 처음 찾으면 그 위치(행, 열)를 출력하고 두 반복을 모두 끝내세요. 깃발 방식과 `goto` 방식으로 각각 써 보세요.
3. **(Python)** 문장에서 단어를 하나씩 보며 숫자가 섞인 단어는 `continue`로 건너뛰고, `"끝"`이라는 단어가 나오면 `break`하세요. 끝까지 `"끝"`이 없으면 `for-else`로 "끝이 없었습니다"를 출력하세요.
4. **(세 언어)** 1부터 1000까지 중 각 자리 숫자의 세제곱의 합이 자기 자신과 같은 수(153 같은 수)를 모두 찾으세요.
