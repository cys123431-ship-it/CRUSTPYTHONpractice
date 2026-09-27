---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-01-variables-types
courseId: crp-92
phaseId: phase-01
dayNumber: 1
date: "2026-10-01"
title: 변수와 자료형 — 값에 이름을 붙이고 사용하는 법
summary: 프로그램의 가장 작은 재료인 값, 값을 다시 쓰기 위한 변수 이름, 값의 종류인 자료형을 처음부터 배웁니다. 같은 학습 기록 프로그램을 Python, C, Rust로 만들며 대입과 재할당, 자료형 확인, f-string과 printf와 println!의 출력 형식, 정수 나눗셈, Rust의 mut와 섀도잉을 비교합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: []
learningObjectives:
  - 값, 변수 이름, 자료형을 서로 구분하여 설명한다.
  - 대입과 재할당을 실행 순서대로 추적한다.
  - 정수·실수·문자열·불리언 값을 만들고 세 언어에서 자료형을 확인한다.
  - f-string, printf 서식 문자, println!의 중괄호가 각각 하는 일을 설명한다.
  - C와 Rust에서 정수끼리 나누면 소수점 아래가 버려진다는 것과 Rust의 mut가 필요한 이유를 설명한다.
concepts:
  [
    value,
    variable,
    binding,
    type,
    assignment,
    reassignment,
    f-string,
    printf,
    mutation,
    shadowing,
  ]
runnerMode: python
playgroundSource: |
  # 파일: study_log.py — 값을 바꿔 가며 출력이 어떻게 달라지는지 보세요.
  topic = "Python"
  minutes = 30
  focused = True
  print(f"{topic}: {minutes}분 / 집중={focused}")
  print(type(topic), type(minutes), type(focused))
reviewOffsets: [1, 3, 7, 14, 30]
sample: true
exercises:
  - id: ex-day01-predict
    title: 재할당 결과 예측
    kind: predict
    objective: 대입문을 위에서 아래로 추적하고 두 이름의 현재 값을 구분한다.
    prompt: 아래 Python 코드가 출력하는 두 숫자를 공백으로 구분해 적으세요.
    starter: |-
      score = 10
      bonus = score
      score = 15
      print(score, bonus)
    answer: "15 10"
    hint: bonus에는 이름 score가 아니라 두 번째 줄이 실행되는 순간의 값이 대입됩니다.
    explanation: bonus = score가 실행될 때 bonus는 정수 10을 가리킵니다. 이후 score만 15에 다시 연결되므로 출력은 15 10입니다. C와 Rust에서도 정수는 값이 복사되므로 결과가 같습니다.
    commonMistakes:
      - 두 이름이 항상 함께 바뀐다고 생각함
      - 마지막 줄만 보고 둘 다 15라고 답함
    language: python
    verification: run
  - id: ex-day01-predict-c
    title: C 정수 나눗셈 예측
    kind: predict
    objective: C에서 정수끼리의 나눗셈은 소수점 아래를 버린다는 것을 확인한다.
    prompt: 출력될 두 값을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a = 7;
          int b = 2;
          double r = a / b;
          printf("%d %.1f\n", a / b, r);
          return 0;
      }
    answer: "3 3.0"
    hint: "a / b는 int끼리의 계산이라 먼저 3이 됩니다. 그 3을 double 변수에 넣으면 3.0이 될 뿐, 버려진 0.5가 돌아오지 않습니다."
    explanation: "결과를 담는 변수의 자료형이 아니라 계산하는 값들의 자료형이 계산 방식을 정합니다. 3.5를 얻으려면 (double)a / b처럼 계산 전에 한쪽을 실수로 바꿔야 합니다."
    commonMistakes:
      - double 변수에 넣으니 3.5가 된다고 생각함
      - 정수 나눗셈이 반올림을 한다고 생각해 4로 적음
    language: c
    verification: run
  - id: ex-day01-fill
    title: f-string 빈칸 채우기
    kind: fill
    objective: 중괄호 안에 출력할 변수 이름을 넣는다.
    prompt: "topic과 minutes의 값이 'Python: 30분'으로 출력되도록 빈칸을 채우세요."
    starter: |-
      topic = "Python"
      minutes = 30
      print(f"{_____}: {_____}분")
    answer: |-
      topic = "Python"
      minutes = 30
      print(f"{topic}: {minutes}분")
    output: "Python: 30분"
    hint: 첫 번째 중괄호에는 과목 변수, 두 번째 중괄호에는 시간 변수가 들어갑니다.
    explanation: f-string의 중괄호에는 출력할 값이나 표현식을 적습니다. {topic}은 Python으로, {minutes}는 30으로 바뀝니다.
    commonMistakes:
      - 중괄호 안에 따옴표를 넣어 변수 이름 자체를 출력함
      - 문자열 앞의 f를 빠뜨림
    language: python
    verification: run
  - id: ex-day01-modify
    title: 학습 시간 합계로 수정
    kind: modify
    objective: 기존 변수로 새 값을 계산하고 결과를 읽기 좋은 문장으로 출력한다.
    prompt: "C 20분, Python 30분, Rust 25분의 합계를 계산해 '오늘 총 학습: 75분'으로 출력하도록 코드를 완성하세요."
    starter: |-
      c_minutes = 20
      python_minutes = 30
      rust_minutes = 25

      # total_minutes를 계산하세요.
      # f-string으로 결과를 출력하세요.
    answer: |-
      c_minutes = 20
      python_minutes = 30
      rust_minutes = 25
      total_minutes = c_minutes + python_minutes + rust_minutes
      print(f"오늘 총 학습: {total_minutes}분")
    output: "오늘 총 학습: 75분"
    hint: 세 변수를 +로 더한 결과를 total_minutes에 저장한 뒤 중괄호에서 사용하세요.
    explanation: 오른쪽의 덧셈이 먼저 계산되어 75가 되고, 그 값이 total_minutes라는 이름에 연결됩니다.
    commonMistakes:
      - 변수 이름을 따옴표로 감쌈
      - total_minutes를 계산하기 전에 출력함
    language: python
    verification: run
  - id: ex-day01-debug-rust
    title: Rust 불변 바인딩 오류 고치기
    kind: debug
    objective: 값을 바꾸려는 바인딩에 mut를 붙인다.
    prompt: "이 Rust 코드는 error[E0384]로 컴파일되지 않습니다. 오류를 고쳐 '합계: 50분'이 출력되게 하세요."
    starter: |-
      fn main() {
          let total = 0;
          total = total + 20;
          total = total + 30;
          println!("합계: {total}분");
      }
    answer: |-
      fn main() {
          let mut total = 0;
          total = total + 20;
          total = total + 30;
          println!("합계: {total}분");
      }
    output: "합계: 50분"
    hint: "오류 메시지의 'cannot assign twice to immutable variable'은 '바꿀 수 없는 변수에 두 번 대입했다'는 뜻입니다."
    explanation: Rust의 let 바인딩은 기본적으로 바꿀 수 없습니다. 값을 바꿀 계획이면 let mut로 선언해 의도를 드러냅니다. 컴파일러가 이 오류와 함께 'help 줄에 mut를 붙이라'는 안내도 보여 줍니다.
    commonMistakes:
      - 대입할 때마다 let을 붙여 새 바인딩을 만들면서 왜 동작하는지 모름(섀도잉)
      - mut를 println! 줄에 붙이려고 함
    language: rust
    verification: run
  - id: ex-day01-independent
    title: 내 학습 기록 프로그램 만들기
    kind: independent
    objective: 여러 자료형, 계산, f-string을 한 프로그램에서 사용한다.
    prompt: 과목명, 목표 시간, 실제 시간, 집중 여부를 변수로 만들고 달성률을 계산해 두 줄로 출력하세요. 예시 답안과 같은 값과 출력 형식을 사용합니다.
    starter: |-
      # 1. topic, goal_minutes, actual_minutes, focused 변수를 만드세요.
      # 2. achievement를 실제 시간 / 목표 시간 * 100으로 계산하세요.
      # 3. f-string 두 줄로 학습 기록과 달성률을 출력하세요.
    answer: |-
      topic = "Python"
      goal_minutes = 40
      actual_minutes = 30
      focused = True
      achievement = actual_minutes / goal_minutes * 100
      print(f"{topic}: {actual_minutes}/{goal_minutes}분, 집중={focused}")
      print(f"달성률: {achievement:.1f}%")
    output: |-
      Python: 30/40분, 집중=True
      달성률: 75.0%
    hint: 소수점 한 자리 표시는 f-string 중괄호 안에서 {achievement:.1f}처럼 작성합니다.
    explanation: 문자열, 정수, 불리언을 각각 변수에 저장하고 나눗셈 결과인 실수를 :.1f 형식으로 출력한 종합 예제입니다.
    commonMistakes:
      - 목표 시간을 실제 시간으로 나누어 달성률을 반대로 계산함
      - True를 따옴표로 감싸 문자열로 만듦
      - 퍼센트 기호를 중괄호 안에 넣음
    language: python
    verification: run
quiz:
  - id: quiz-day01-01
    question: Python에서 x = 3 이후 x = "three"가 가능한 가장 정확한 이유는?
    choices:
      - Python에는 타입이 없기 때문에
      - 변수 이름이 다른 타입의 객체를 다시 가리킬 수 있기 때문에
      - 모든 값이 문자열이기 때문에
      - 3이 자동으로 "three"로 바뀌기 때문에
    answerIndex: 1
    explanation: Python의 값에는 타입이 있습니다. 다만 이름 x의 타입을 미리 하나로 고정하지 않아 다른 타입의 값에 다시 연결할 수 있습니다. C와 Rust에서는 같은 변수에 다른 자료형의 값을 넣을 수 없습니다.
  - id: quiz-day01-02
    question: 'print(f"{topic}: {minutes}분")에서 문자열 앞의 f가 하는 일은?'
    choices:
      - 문자열을 파일로 저장한다
      - 중괄호 안의 표현식을 계산해 문자열에 넣는다
      - 모든 문자를 대문자로 바꾼다
      - 문자열을 실수(float)로 바꾼다
    answerIndex: 1
    explanation: f는 formatted string literal을 뜻하며 중괄호 안의 변수나 표현식 값을 문자열에 삽입합니다. C의 printf 서식 문자, Rust의 println! 중괄호가 같은 역할을 합니다.
  - id: quiz-day01-03
    question: Python에서 type(True)의 결과는?
    choices: [int, str, bool, float]
    answerIndex: 2
    explanation: True와 False는 참·거짓을 나타내는 bool 자료형의 값입니다. 따옴표로 감싼 "True"는 str입니다.
  - id: quiz-day01-04
    question: Rust의 let mut count = 1에서 mut가 뜻하는 것은?
    choices:
      - count에 다른 자료형을 언제든 넣을 수 있다
      - 같은 바인딩의 값을 변경할 수 있다
      - 메모리를 수동으로 해제해야 한다
      - count를 다른 함수에서도 쓸 수 있다
    answerIndex: 1
    explanation: mut는 값 변경을 허용하지만, 한 번 정해진 바인딩의 자료형을 다른 자료형으로 바꾸는 표시는 아닙니다. 자료형까지 바꾸려면 let으로 새 바인딩을 만드는 섀도잉을 씁니다.
---

## 1. 오늘 배울 내용

오늘은 프로그램의 가장 작은 재료인 **값**, 그 값을 다시 사용하기 위한 **변수 이름**, 그리고 값의 종류를 나타내는 **자료형**을 배웁니다. 오늘이 끝나면 아래 코드의 모든 기호를 스스로 설명할 수 있어야 합니다.

```python
topic = "Python"
minutes = 30
focused = True
print(f"{topic}: {minutes}분 / 집중={focused}")
```

1. 값, 변수 이름, 자료형을 구분합니다.
2. `=`가 "오른쪽을 계산해 왼쪽 이름에 연결한다"는 뜻이라는 것과 **재할당**을 추적합니다.
3. Python의 네 가지 기본 자료형 `int`, `float`, `str`, `bool`과 `type()`을 익힙니다.
4. 같은 학습 기록 프로그램을 **Python, C, Rust**로 만들어 봅니다.
   - Python: f-string
   - C: 자료형을 먼저 적는 선언과 `printf`의 서식 문자
   - Rust: 자료형 추론, `println!`, 바꾸려면 필요한 `mut`
5. C와 Rust에서 **정수끼리 나누면** 소수점 아래가 버려진다는 것을 확인합니다.

처음 보는 문법이 있어도 괜찮습니다. 한 단계씩 나누어 살펴봅니다.

## 2. 이 개념은 왜 필요한가

프로그램은 값을 받아서 기억하고, 계산하고, 결과를 보여 줍니다. 예를 들어 학습 기록 프로그램이라면 다음 값이 필요합니다.

- 과목: `"Python"`
- 공부한 시간: `30`
- 집중했는지 여부: `True`
- 목표 달성률: `75.0`

값을 한 번만 쓴다면 그대로 적어도 되지만, 여러 번 사용하거나 나중에 바꾸려면 이름을 붙이는 편이 안전합니다. `30`이라는 숫자만 보면 무엇을 뜻하는지 알기 어렵지만 `minutes`라는 이름을 붙이면 의미가 드러납니다. 또 공부 시간이 45분으로 바뀌면 이름이 붙은 한 곳만 고치면 됩니다.

값의 **종류**도 중요합니다. `30 + 1`은 31이 되어야 하고, `"Python" + "!"`는 글자를 이어 붙여야 합니다. 같은 `+`라도 값의 종류에 따라 하는 일이 다르기 때문에, 프로그래밍 언어는 모든 값에 **자료형**을 붙여 관리합니다.

## 3. 그림으로 이해하기: 값, 이름표, 자료형

다음 세 가지를 구분하세요.

1. **값(value)**: 실제 데이터입니다. 예: `30`, `"Python"`, `True`
2. **변수 이름(variable name)**: 값을 다시 찾기 위해 붙인 이름입니다. 예: `minutes`
3. **자료형(type)**: 그 값으로 무엇을 할 수 있는지 정하는 종류입니다. 예: `int`, `str`, `bool`

Python의 변수는 값에 붙인 **이름표**에 가깝고, C의 변수는 자료형이 정해진 **상자(저장 공간)** 에 가깝습니다.

```text
Python                               C
minutes = 30                         int minutes = 30;

[이름표 minutes] ───▶ [int 30]        minutes  ┌──────────┐
                                      (int)    │    30    │  ← 4바이트 상자
                                               └──────────┘
```

`=`는 수학에서의 "양쪽이 같다"보다 **오른쪽 값을 계산해서 왼쪽 이름(상자)에 넣는다**는 뜻에 가깝습니다.

```python
base = 20
minutes = base + 10
```

두 번째 줄은 `base + 10`을 먼저 계산해 `30`을 만든 뒤, 그 결과를 `minutes`에 연결합니다.

## 4. 천천히 풀어보기

### 4.1 기본 자료형 네 가지

| 자료형 | 뜻      | Python 예          | C에서          | Rust에서         | 주로 하는 일          |
| ------ | ------- | ------------------ | -------------- | ---------------- | --------------------- |
| 정수   | 정수    | `30`, `-2`, `0`    | `int`          | `i32`            | 개수, 시간, 점수 계산 |
| 실수   | 실수    | `75.0`, `3.14`     | `double`       | `f64`            | 비율, 평균, 소수 계산 |
| 문자열 | 글자들  | `"Python"`, `"30"` | `const char *` | `&str`, `String` | 글자와 문장 처리      |
| 불리언 | 참·거짓 | `True`, `False`    | `bool`         | `bool`           | 조건의 참·거짓 표현   |

C와 Rust에는 글자 **하나**를 나타내는 자료형(`char`)도 따로 있습니다. `'B'`처럼 작은따옴표로 씁니다.

`"30"`과 `30`은 겉보기는 비슷하지만 다릅니다. `"30"`은 글자 `3`과 `0` 두 개로 이루어진 문자열이고, `30`은 덧셈에 사용할 수 있는 정수입니다. 문자열끼리 `+`를 쓰면 숫자 덧셈이 아니라 **이어 붙이기**가 일어나서 `"30" + "1"`은 `"301"`입니다.

### 4.2 대입과 재할당

```python
score = 10
bonus = score
score = 15
print(score, bonus)
```

실행을 한 줄씩 추적하면 다음과 같습니다.

| 실행한 줄       | `score` | `bonus` | 설명                                 |
| --------------- | ------: | ------: | ------------------------------------ |
| `score = 10`    |      10 |    없음 | `score`라는 이름이 생김              |
| `bonus = score` |      10 |      10 | 지금 `score`의 값이 `bonus`에 대입됨 |
| `score = 15`    |      15 |      10 | `score`만 새 값에 다시 연결됨        |
| `print(...)`    |      15 |      10 | `15 10` 출력                         |

`bonus = score`는 "bonus는 앞으로 계속 score와 같다"는 약속이 아니라, **그 순간의 값**을 가져오는 명령입니다. 이후 `score`를 바꿔도 지나간 대입문이 다시 실행되지 않습니다. 이 결과는 세 언어 모두 같습니다. 리스트처럼 내부를 바꿀 수 있는 값을 여러 이름이 함께 가리키는 경우는 Day 29와 Day 31에서 다룹니다.

### 4.3 문자열 안에 값 넣기

세 언어 모두 "틀이 되는 문자열 + 채울 값"으로 출력합니다.

```text
Python  print(f"{topic}: {minutes}분")          중괄호 안에 이름을 바로 쓴다
C       printf("%s: %d분\n", topic, minutes);   자리에는 서식 문자, 값은 뒤에 순서대로
Rust    println!("{topic}: {minutes}분");       중괄호 안에 이름(또는 빈 {} + 뒤에 값)
```

Python의 f-string을 기호별로 나누면 이렇습니다.

| 부분             | 뜻                                                 |
| ---------------- | -------------------------------------------------- |
| `print(...)`     | 괄호 안의 값을 화면에 출력하는 함수                |
| 문자열 앞의 `f`  | 중괄호 안의 표현식을 계산해 문자열에 넣겠다는 표시 |
| 큰따옴표 `"..."` | 문자열의 시작과 끝                                 |
| `{topic}`        | 변수 `topic`의 현재 값으로 교체되는 자리           |
| `: `             | 그대로 출력되는 콜론과 공백                        |
| `{minutes}`      | 변수 `minutes`의 현재 값으로 교체되는 자리         |

```text
"{topic}: {minutes}분"
    ↓         ↓
"Python: 30분"
```

실수는 자릿수를 정해 출력할 수 있습니다. Python `{achievement:.1f}`, C `%.1f`, Rust `{achievement:.1}`은 모두 "소수점 아래 한 자리까지"라는 뜻입니다.

### 4.4 정수 나눗셈

Python의 `/`는 항상 실수 결과를 줍니다(`30 / 40`은 `0.75`). 하지만 C와 Rust에서 **정수끼리** `/`로 나누면 결과도 정수이고, 소수점 아래는 **버립니다**. `30 / 40`은 `0`이 됩니다. 실수 결과가 필요하면 계산 **전에** 한쪽을 실수로 바꿉니다. C는 `(double)actual_minutes`, Rust는 `actual_minutes as f64`처럼 씁니다. 이 변환은 Day 6에서 자세히 다룹니다.

## 5. C로 구현하기

C에서는 변수를 만들 때 **자료형을 먼저** 적습니다. `int actual_minutes = 30;`은 "정수를 담는 상자 actual_minutes를 만들고 30을 넣어라"라는 뜻입니다. 모든 C 프로그램은 `main` 함수에서 시작합니다(Day 3에서 자세히 봅니다).

```c
// 파일: study_log.c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    const char *topic = "C";         // 문자열(글자들의 시작 주소)
    int goal_minutes = 40;           // 정수
    int actual_minutes = 30;
    bool focused = true;             // 참/거짓 (stdbool.h)
    char grade = 'B';                // 글자 하나
    double achievement = (double)actual_minutes / goal_minutes * 100.0;

    printf("과목: %s\n", topic);
    printf("시간: %d/%d분\n", actual_minutes, goal_minutes);
    printf("집중: %s\n", focused ? "true" : "false");
    printf("등급: %c\n", grade);
    printf("달성률: %.1f%%\n", achievement);

    // 자료형마다 차지하는 크기(바이트)가 정해져 있다
    printf("sizeof(int)=%zu, sizeof(double)=%zu, sizeof(char)=%zu, sizeof(bool)=%zu\n",
           sizeof(int), sizeof(double), sizeof(char), sizeof(bool));

    // 재할당: 같은 저장 공간에 새 값을 덮어쓴다
    int score = 10;
    int bonus = score;               // 값 10이 복사된다
    score = 15;
    printf("score, bonus = %d %d\n", score, bonus);

    // 정수끼리 나누면 소수점 아래를 버린다
    printf("30 / 40 = %d, 30.0 / 40 = %.2f\n", actual_minutes / goal_minutes, 30.0 / 40);
    return 0;
}
```

실행 결과:

```text
과목: C
시간: 30/40분
집중: true
등급: B
달성률: 75.0%
sizeof(int)=4, sizeof(double)=8, sizeof(char)=1, sizeof(bool)=1
score, bonus = 15 10
30 / 40 = 0, 30.0 / 40 = 0.75
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#include <stdio.h>`                            | `printf`가 들어 있는 표준 입출력 헤더를 가져옵니다.                                                                                                  |
| `#include <stdbool.h>`                          | `bool`, `true`, `false`를 쓸 수 있게 합니다. C에는 원래 참·거짓을 0과 1로 표현했습니다.                                                              |
| `const char *topic = "C";`                      | 문자열은 글자들이 이어진 배열이고, 변수에는 그 첫 글자의 위치가 들어갑니다. 지금은 "C의 문자열 변수는 이렇게 쓴다"고 기억하면 충분합니다(Day 37).    |
| `char grade = 'B';`                             | 글자 **하나**는 작은따옴표로 씁니다. `"B"`(큰따옴표)는 글자 하나짜리 문자열이라 자료형이 다릅니다.                                                   |
| `(double)actual_minutes / goal_minutes * 100.0` | 나누기 전에 30을 실수 30.0으로 바꿔 0.75를 얻습니다. 이것을 빼면 `30 / 40`이 0이 되어 달성률이 0.0%가 됩니다.                                        |
| `%s`, `%d`, `%c`, `%.1f`, `%%`                  | 서식 문자입니다. 차례로 문자열, 정수, 글자 하나, 소수점 한 자리 실수, 퍼센트 기호 자체를 뜻합니다. 뒤에 오는 값과 **순서와 자료형**이 맞아야 합니다. |
| `focused ? "true" : "false"`                    | `printf`에는 bool 전용 서식이 없어서, 참이면 `"true"`, 거짓이면 `"false"` 문자열을 고릅니다. `?:`는 Day 13에서 배웁니다.                             |
| `sizeof(int)`                                   | 그 자료형이 차지하는 바이트 수입니다. 결과 자료형이 `size_t`라서 서식 문자 `%zu`를 씁니다. `int`가 4바이트인 것은 대부분의 PC 기준입니다(Day 10).    |
| `int bonus = score;`                            | `score` 상자의 값 10을 `bonus` 상자에 **복사**합니다. 이후 `score`를 15로 덮어써도 `bonus`는 10입니다.                                               |

## 6. Python으로 구현하기

Python에서는 자료형을 적지 않아도 값에서 자료형이 정해집니다. `type(값).__name__`으로 자료형 이름을 볼 수 있고, `repr(값)`은 문자열에 따옴표를 붙여 "이것이 문자열"임을 드러냅니다.

```python
# 파일: study_log.py
topic = "Python"          # str: 글자들
goal_minutes = 40         # int: 정수
actual_minutes = 30       # int
focused = True            # bool: 참/거짓
achievement = actual_minutes / goal_minutes * 100   # float: 실수

print(f"과목: {topic}")
print(f"시간: {actual_minutes}/{goal_minutes}분")
print(f"집중: {focused}")
print(f"달성률: {achievement:.1f}%")

# 값마다 자료형이 있다
for value in (topic, actual_minutes, focused, achievement):
    print(repr(value), "→", type(value).__name__)

# 재할당: 이름이 새 값을 가리키게 된다
score = 10
bonus = score
score = 15
print("score, bonus =", score, bonus)

# 같은 이름이 다른 자료형의 값을 가리킬 수도 있다
x = 3
print(x, type(x).__name__)
x = "three"
print(x, type(x).__name__)

# "30"과 30은 다르다
print(30 + 1, "30" + "1", int("30") + 1)
```

실행 결과:

```text
과목: Python
시간: 30/40분
집중: True
달성률: 75.0%
'Python' → str
30 → int
True → bool
75.0 → float
score, bonus = 15 10
3 int
three str
31 301 31
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                                             |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `topic = "Python"`                    | 문자열 값에 `topic`이라는 이름을 붙입니다. `#` 뒤는 **주석**이라 실행되지 않습니다.                                              |
| `focused = True`                      | 첫 글자가 대문자인 `True`입니다. `true`라고 쓰면 NameError가 납니다. `"True"`처럼 따옴표를 쓰면 문자열이 됩니다.                 |
| `actual_minutes / goal_minutes * 100` | Python의 `/`는 정수끼리여도 실수 결과를 줍니다. 그래서 `achievement`는 `float`입니다.                                            |
| `f"달성률: {achievement:.1f}%"`       | `:` 뒤의 `.1f`는 소수점 아래 한 자리까지라는 형식 지정입니다. `%`는 중괄호 밖이라 그대로 출력됩니다.                             |
| `for value in (topic, ...):`          | 네 값을 차례로 꺼내 같은 일을 반복합니다. 반복문은 Day 16에서 배우니, 지금은 "네 번 출력한다"로 읽으면 됩니다.                   |
| `x = 3` 다음 `x = "three"`            | 같은 이름 `x`가 정수를 가리키다 문자열을 가리킵니다. **값**의 자료형은 바뀌지 않았고, 이름이 **다른 값**을 가리키게 된 것입니다. |
| `int("30") + 1`                       | 문자열 `"30"`을 정수 30으로 **변환**한 뒤 더합니다. 입력받은 값은 문자열이라서 이 변환을 자주 씁니다(Day 2).                     |

## 7. Rust로 구현하기

Rust는 `let`으로 변수를 만들고, 대부분의 자료형을 값에서 **추론**합니다. 원하면 `let goal_minutes: i32 = 40;`처럼 직접 적을 수도 있습니다. 가장 큰 차이는 **기본적으로 값을 바꿀 수 없다**는 점입니다.

```rust
// 파일: study_log.rs
fn main() {
    let topic = "Rust";                  // &str (추론)
    let goal_minutes: i32 = 40;          // 자료형을 직접 적을 수도 있다
    let actual_minutes = 30;             // i32로 추론
    let focused = true;                  // bool
    let grade = 'A';                     // char
    let achievement = actual_minutes as f64 / goal_minutes as f64 * 100.0;

    println!("과목: {topic}");
    println!("시간: {actual_minutes}/{goal_minutes}분");
    println!("집중: {focused}");
    println!("등급: {grade}");
    println!("달성률: {achievement:.1}%");

    // 기본 바인딩은 바꿀 수 없다. 바꾸려면 mut
    let mut count = 1;
    count = count + 1;
    println!("count = {count}");

    // 재할당과 복사
    let mut score = 10;
    let bonus = score;                   // 정수는 값이 복사된다
    score = 15;
    println!("score, bonus = {score} {bonus}");

    // 섀도잉: let으로 같은 이름의 새 바인딩을 만든다(자료형도 바뀔 수 있다)
    let x = "3";
    let x: i32 = x.parse().unwrap();
    println!("x + 1 = {}", x + 1);

    println!("30 / 40 = {}, 30.0 / 40.0 = {:.2}", 30 / 40, 30.0 / 40.0);
}
```

실행 결과:

```text
과목: Rust
시간: 30/40분
집중: true
등급: A
달성률: 75.0%
count = 2
score, bonus = 15 10
x + 1 = 4
30 / 40 = 0, 30.0 / 40.0 = 0.75
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn main() { ... }`                             | Rust 프로그램도 `main` 함수에서 시작합니다.                                                                                                                             |
| `let goal_minutes: i32 = 40;`                   | `: i32`는 "32비트 정수"라는 자료형 표시입니다. 생략하면 정수는 기본으로 `i32`가 됩니다.                                                                                 |
| `actual_minutes as f64 / goal_minutes as f64`   | `as f64`로 정수를 64비트 실수로 바꿉니다. Rust는 `i32`와 `f64`를 섞어 계산하는 것을 허용하지 않아서, C보다 한 번 더 명시해야 합니다.                                    |
| `println!("과목: {topic}");`                    | 느낌표가 붙은 `println!`은 **매크로**입니다. 중괄호 안에 변수 이름을 바로 쓰면 그 값이 들어갑니다. `{achievement:.1}`은 소수점 한 자리입니다.                           |
| `let mut count = 1; count = count + 1;`         | `mut`가 있어야 값을 바꿀 수 있습니다. `mut` 없이 두 번 대입하면 컴파일 오류 E0384가 납니다(12절).                                                                       |
| `let x = "3"; let x: i32 = x.parse().unwrap();` | **섀도잉**입니다. 두 번째 `let`은 같은 이름의 **새 바인딩**을 만들어 앞의 것을 가립니다. 문자열 `"3"`을 정수 3으로 바꾸는 `parse()`는 Day 2와 Day 25에서 자세히 봅니다. |
| `30 / 40`                                       | 정수끼리의 나눗셈이라 C와 같이 0입니다.                                                                                                                                 |

## 8. 실행 추적

세 언어 공통으로 `score`와 `bonus`의 변화를 따라가면서, 각 언어에서 무슨 일이 일어나는지 비교합니다.

| 줄            | Python                    | C                                 | Rust                                      |
| ------------- | ------------------------- | --------------------------------- | ----------------------------------------- |
| score = 10    | 이름 score → 정수 10      | int 상자 score에 10을 넣음        | `let mut score = 10;` 바꿀 수 있는 바인딩 |
| bonus = score | 이름 bonus → 같은 정수 10 | score의 값 10을 bonus 상자에 복사 | `let bonus = score;` 값 10이 복사됨       |
| score = 15    | score만 정수 15를 가리킴  | score 상자에 15를 덮어씀          | `mut`였기 때문에 허용됨                   |
| 출력          | `15 10`                   | `15 10`                           | `15 10`                                   |

## 9. 다른 예제로 다시 이해하기

카페 주문 금액을 계산해 봅시다. 메뉴 이름(문자열), 가격과 잔 수(정수), 할인율(실수), 결제 여부(불리언)가 모두 필요합니다. 계산 과정에서 **정수와 실수가 섞일 때** 자료형이 어떻게 바뀌는지, 그리고 결제가 끝나면 `paid`를 **재할당**하는 모습을 보세요.

```python
# 파일: cafe_order.py
menu = "카페라테"
price = 4500
count = 3
discount_rate = 0.1
paid = False

subtotal = price * count              # int * int → int
discount = subtotal * discount_rate   # int * float → float
total = subtotal - discount           # int - float → float

print(f"{menu} {count}잔: {subtotal}원")
print(f"할인: {discount:.0f}원")
print(f"결제 금액: {total:.0f}원")
print(type(subtotal).__name__, type(discount).__name__, type(total).__name__)

print(f"결제 완료: {paid}")
paid = True                           # 결제가 끝나서 값을 바꾼다
print(f"결제 완료: {paid}")
```

실행 결과:

```text
카페라테 3잔: 13500원
할인: 1350원
결제 금액: 12150원
int float float
결제 완료: False
결제 완료: True
```

같은 계산을 C로 하면 할인율을 **정수 퍼센트**로 다룰 때 생기는 함정도 볼 수 있습니다.

```c
// 파일: cafe_order.c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    const char *menu = "latte";
    int price = 4500;
    int count = 3;
    double discount_rate = 0.1;
    int rate_percent = 10;
    bool paid = false;

    int subtotal = price * count;
    double discount = subtotal * discount_rate;
    double total = subtotal - discount;

    printf("%s x%d: %d원\n", menu, count, subtotal);
    printf("할인: %.0f원\n", discount);
    printf("결제 금액: %.0f원\n", total);
    printf("정수 퍼센트로 잘못 계산: %d원\n", subtotal * (rate_percent / 100));
    printf("정수 퍼센트로 바르게 계산: %d원\n", subtotal * rate_percent / 100);

    paid = true;
    printf("결제 완료: %s\n", paid ? "true" : "false");
    return 0;
}
```

실행 결과:

```text
latte x3: 13500원
할인: 1350원
결제 금액: 12150원
정수 퍼센트로 잘못 계산: 0원
정수 퍼센트로 바르게 계산: 1350원
결제 완료: true
```

`rate_percent / 100`은 정수 나눗셈 `10 / 100 = 0`이라 할인이 0원이 됩니다. 곱셈을 먼저 해서 `13500 * 10 / 100 = 135000 / 100 = 1350`으로 계산하면 정수만으로도 맞는 답을 얻습니다. **계산 순서와 자료형이 함께 결과를 정한다**는 것을 기억하세요.

## 10. 자료형과 크기 한눈에 보기

| 자료형(C / Rust / Python)  | 크기(일반적인 PC)               | 담을 수 있는 값                                    |
| -------------------------- | ------------------------------- | -------------------------------------------------- |
| `int` / `i32` / `int`      | 4바이트 / 4바이트 / 필요한 만큼 | C·Rust 약 ±21억, Python은 제한 없음                |
| `double` / `f64` / `float` | 8바이트                         | 소수점 아래 약 15~16자리 정밀도                    |
| `char` / `char` / (없음)   | 1바이트 / 4바이트               | C는 영문자 하나, Rust는 한글 포함 유니코드 한 글자 |
| `bool` / `bool` / `bool`   | 1바이트                         | 참 또는 거짓                                       |

Python의 정수는 크기 제한이 없어서 `2 ** 100` 같은 큰 수도 그대로 계산합니다. C와 Rust의 정수는 크기가 정해져 있어서 범위를 넘으면 문제가 생깁니다(Day 10, Day 11).

## 11. 세 언어 비교

| 질문                                    | Python    | C                    | Rust                     |
| --------------------------------------- | --------- | -------------------- | ------------------------ |
| 타입은 언제 주로 확인하나?              | 실행할 때 | 컴파일할 때          | 컴파일할 때              |
| 변수 선언 때 타입을 쓰나?               | 쓰지 않음 | 반드시 씀            | 대부분 추론 가능         |
| 기본적으로 값을 바꿀 수 있나?           | 가능      | 가능(`const`면 불가) | `mut`가 있어야 가능      |
| 이름이 다른 자료형 값을 가리킬 수 있나? | 가능      | 불가능               | 섀도잉(`let` 다시)으로만 |
| 문자열 안에 값을 넣는 법                | f-string  | `printf` 서식 문자   | `println!`의 `{}`        |
| `30 / 40`                               | `0.75`    | `0`                  | `0`                      |

문법만 외우기보다 **값을 만들고 → 이름에 저장하고 → 계산하고 → 출력한다**는 공통 흐름을 찾으세요. 언어마다 그 과정에서 허용하는 것과 미리 검사하는 것이 다릅니다.

## 12. 자주 하는 실수

### 실수 1: 숫자 문자열을 숫자로 착각한다 (Python)

```python
# 파일: age_error.py (실행 오류: TypeError)
age = "36"
print(age + 1)
```

```text
TypeError: can only concatenate str (not "int") to str
```

따옴표로 둘러싼 `"36"`은 문자열이라 정수 1과 더할 수 없습니다. 오류 메시지의 마지막 줄을 먼저 읽으세요. "문자열에는 문자열만 이어 붙일 수 있다"는 뜻입니다. `int(age) + 1`처럼 의미를 분명히 변환합니다.

### 실수 2: 정수 변수에 문자열을 넣는다 (C)

```c
// 파일: type_error.c (컴파일 오류: makes integer from pointer without a cast)
#include <stdio.h>

int main(void) {
    int minutes = "30";
    printf("%d\n", minutes);
    return 0;
}
```

C는 `int` 상자에 문자열을 넣으려 하면 컴파일할 때 알려 줍니다. 실행하기 전에 잡히는 오류입니다.

### 실수 3: mut 없이 값을 바꾼다 (Rust)

```rust
// 파일: immutable.rs (컴파일 오류: E0384)
fn main() {
    let minutes = 20;
    minutes = 30;
    println!("{minutes}");
}
```

`cannot assign twice to immutable variable`이라는 오류가 납니다. `let mut minutes = 20;`으로 고칩니다.

### 실수 4: mut 변수에 다른 자료형을 넣는다 (Rust)

```rust
// 파일: mismatched.rs (컴파일 오류: E0308)
fn main() {
    let mut x = 3;
    x = "three";
    println!("{x}");
}
```

`mut`는 **값**을 바꿀 수 있다는 뜻이지, 자료형을 바꿀 수 있다는 뜻이 아닙니다. `mismatched types` 오류가 납니다.

### 실수 5: 변수 이름을 따옴표로 감싸거나 f를 빠뜨린다 (Python)

```python
# 파일: quote_mistakes.py
topic = "Python"
minutes = 30
print("topic")
print(topic)
print("{minutes}분")
print(f"{minutes}분")
```

실행 결과:

```text
topic
Python
{minutes}분
30분
```

따옴표 안의 `topic`은 변수가 아니라 글자입니다. `f`가 없으면 중괄호도 평범한 글자로 출력됩니다.

## 13. Q&A

**Q. 변수 이름은 아무렇게나 지어도 되나요?**

A. 세 언어 모두 영문자, 숫자, 밑줄(`_`)을 쓰고 숫자로 시작할 수 없습니다. `print`, `int`, `let`처럼 언어가 이미 쓰는 단어는 피하세요. Python과 Rust는 `actual_minutes`처럼 소문자와 밑줄을 쓰는 것이 관례입니다(snake_case). 한글 이름도 Python과 Rust에서는 동작하지만, 여러 사람과 함께 읽는 코드에서는 영어 이름을 씁니다.

**Q. Python에는 자료형이 없는 건가요?**

A. 아닙니다. **값**마다 자료형이 있고, `"36" + 1`처럼 맞지 않는 연산을 하면 오류가 납니다. 다만 **이름**에 자료형을 미리 붙이지 않고, 실행하면서 확인합니다. C와 Rust는 컴파일할 때 확인하므로 실행 전에 많은 실수를 잡습니다.

**Q. Rust는 왜 기본으로 값을 못 바꾸게 했나요?**

A. 긴 프로그램에서 "이 값이 어디서 바뀌었지?"를 추적하는 일이 버그의 큰 원인이기 때문입니다. 바뀌지 않는 값이 기본이면, `mut`가 붙은 변수만 신경 쓰면 됩니다. 나중에 여러 곳에서 값을 함께 쓰는 빌림(Day 33)을 배울 때 이 설계가 큰 힘을 발휘합니다.

**Q. C의 `const`는 무엇인가요?**

A. `const int limit = 60;`처럼 쓰면 이후 값을 바꿀 수 없는 변수가 됩니다. Rust의 기본 `let`과 비슷한 역할입니다.

## 14. 핵심 요약

- 값은 실제 데이터이고, 변수는 그 값을 다시 사용하기 위한 이름입니다. 자료형은 값으로 가능한 연산을 결정합니다.
- `=`는 오른쪽을 먼저 계산해 왼쪽 이름에 대입합니다. 재할당은 이후의 값만 바꾸고, 지나간 대입문을 다시 실행하지 않습니다.
- Python은 자료형을 적지 않고 실행 중에 확인합니다. C는 선언할 때 자료형을 적고, Rust는 추론하되 컴파일할 때 확인합니다.
- 출력: Python f-string `{}`, C `printf`의 `%d %s %.1f`, Rust `println!`의 `{}`.
- C와 Rust에서 정수끼리 나누면 소수점 아래를 버립니다. 실수 결과가 필요하면 계산 전에 변환합니다.
- Rust의 바인딩은 기본적으로 바꿀 수 없고, 바꾸려면 `mut`를 붙입니다. 자료형까지 바꾸려면 `let`으로 섀도잉합니다.

## 15. 도전 문제

1. **(Python)** 자기 이름, 나이, 키(실수), 학생 여부를 변수로 만들고 `type()`으로 자료형을 모두 출력해 보세요.
2. **(C)** 9절의 C 프로그램에서 `(double)` 없이 `int` 두 개로 달성률을 계산하면 어떤 값이 나오는지 예측하고 확인하세요.
3. **(Rust)** `let mut total = 0;`으로 시작해 세 과목의 시간을 차례로 더한 뒤 평균을 소수점 한 자리까지 출력하세요. 평균을 구할 때 `as f64`가 어디에 필요한지 생각해 보세요.
4. **(세 언어)** 섭씨 온도 `celsius = 36.5`를 화씨(`celsius * 9 / 5 + 32`)로 바꿔 출력하세요. C와 Rust에서 `9 / 5`를 먼저 계산하면 어떤 문제가 생기는지 확인해 보세요.
