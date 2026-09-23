---
schemaVersion: 1
contentVersion: "2026.10-b"
id: day-01-variables-types
courseId: crp-92
phaseId: phase-01
dayNumber: 1
date: "2026-10-01"
title: 변수와 자료형 — 값에 이름을 붙이고 사용하는 법
summary: Python을 Anchor로 값·변수·자료형·재할당·f-string을 처음부터 익히고, 같은 프로그램을 C와 Rust로 옮기며 차이를 이해합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: []
learningObjectives:
  - 값, 변수 이름, 자료형을 서로 구분하여 설명한다.
  - Python의 대입과 재할당을 실행 순서대로 추적한다.
  - 정수·실수·문자열·불리언 값을 만들고 type()으로 확인한다.
  - f-string의 f, 따옴표, 중괄호가 각각 하는 일을 설명한다.
  - 같은 학습 기록 프로그램을 Python, C, Rust로 비교한다.
concepts: [value, variable, binding, type, assignment, f-string, mutation]
runnerMode: python
playgroundSource: "topic = \"Python\"\nminutes = 30\nfocused = True\nprint(f\"{topic}: {minutes}분 / 집중={focused}\")"
reviewOffsets: [1, 3, 7, 14, 30]
sample: true
exercises:
  - id: ex-day01-predict
    title: 재할당 결과 예측
    kind: predict
    objective: 대입문을 위에서 아래로 추적하고 두 이름의 현재 값을 구분한다.
    prompt: 아래 Python 코드가 출력하는 두 숫자를 공백으로 구분해 적으세요.
    starter: "score = 10\nbonus = score\nscore = 15\nprint(score, bonus)"
    answer: "15 10"
    hint: bonus에는 이름 score가 아니라 두 번째 줄이 실행되는 순간의 값이 대입됩니다.
    explanation: bonus = score가 실행될 때 bonus는 정수 10을 가리킵니다. 이후 score만 15에 다시 연결되므로 출력은 15 10입니다.
    commonMistakes:
      [두 이름이 항상 함께 바뀐다고 생각함, 마지막 줄만 보고 둘 다 15라고 답함]
    language: python
    verification: run
  - id: ex-day01-fill
    title: f-string 빈칸 채우기
    kind: fill
    objective: 중괄호 안에 출력할 변수 이름을 넣는다.
    prompt: "topic과 minutes의 값이 'Python: 30분'으로 출력되도록 빈칸을 채우세요."
    starter: "topic = \"Python\"\nminutes = 30\nprint(f\"{_____}: {_____}분\")"
    answer: "topic = \"Python\"\nminutes = 30\nprint(f\"{topic}: {minutes}분\")"
    hint: 첫 번째 중괄호에는 과목 변수, 두 번째 중괄호에는 시간 변수가 들어갑니다.
    explanation: f-string의 중괄호에는 출력할 값이나 표현식을 적습니다. {topic}은 Python으로, {minutes}는 30으로 바뀝니다.
    commonMistakes:
      [
        중괄호 안에 따옴표를 넣어 변수 이름 자체를 출력함,
        문자열 앞의 f를 빠뜨림,
      ]
    language: python
    verification: run
  - id: ex-day01-modify
    title: 학습 시간 합계로 수정
    kind: modify
    objective: 기존 변수로 새 값을 계산하고 결과를 읽기 좋은 문장으로 출력한다.
    prompt: "C 20분, Python 30분, Rust 25분의 합계를 계산해 '오늘 총 학습: 75분'으로 출력하도록 코드를 완성하세요."
    starter: "c_minutes = 20\npython_minutes = 30\nrust_minutes = 25\n\n# total_minutes를 계산하세요.\n# f-string으로 결과를 출력하세요."
    answer: "c_minutes = 20\npython_minutes = 30\nrust_minutes = 25\ntotal_minutes = c_minutes + python_minutes + rust_minutes\nprint(f\"오늘 총 학습: {total_minutes}분\")"
    hint: 세 변수를 +로 더한 결과를 total_minutes에 저장한 뒤 중괄호에서 사용하세요.
    explanation: 오른쪽의 덧셈이 먼저 계산되어 75가 되고, 그 값이 total_minutes라는 이름에 연결됩니다.
    commonMistakes:
      [변수 이름을 따옴표로 감쌈, total_minutes를 계산하기 전에 출력함]
    language: python
    verification: run
  - id: ex-day01-debug
    title: 문자열과 정수의 타입 오류 고치기
    kind: debug
    objective: 문자열 숫자를 명시적으로 정수로 변환한다.
    prompt: 나이를 한 살 늘려 37이 출력되도록 오류를 고치세요.
    starter: "age = \"36\"\nprint(age + 1)"
    answer: "age = \"36\"\nprint(int(age) + 1)"
    hint: 따옴표로 둘러싼 36은 문자열입니다. int()로 변환한 뒤 더하세요.
    explanation: Python은 문자열과 정수를 자동으로 더하지 않습니다. int(age)는 문자열 '36'을 정수 36으로 바꿉니다.
    commonMistakes:
      [
        str(1)을 사용해 361을 만듦,
        오류 메시지를 읽지 않고 따옴표만 임의로 삭제함,
      ]
    language: python
    verification: run
  - id: ex-day01-independent
    title: 내 학습 기록 프로그램 만들기
    kind: independent
    objective: 여러 자료형, 계산, f-string을 한 프로그램에서 사용한다.
    prompt: 과목명, 목표 시간, 실제 시간, 집중 여부를 변수로 만들고 달성률을 계산해 두 줄로 출력하세요. 예시 답안과 같은 값과 출력 형식을 사용합니다.
    starter: "# 1. topic, goal_minutes, actual_minutes, focused 변수를 만드세요.\n# 2. achievement를 실제 시간 / 목표 시간 * 100으로 계산하세요.\n# 3. f-string 두 줄로 학습 기록과 달성률을 출력하세요."
    answer: "topic = \"Python\"\ngoal_minutes = 40\nactual_minutes = 30\nfocused = True\nachievement = actual_minutes / goal_minutes * 100\nprint(f\"{topic}: {actual_minutes}/{goal_minutes}분, 집중={focused}\")\nprint(f\"달성률: {achievement:.1f}%\")"
    hint: 소수점 한 자리 표시는 f-string 중괄호 안에서 {achievement:.1f}처럼 작성합니다.
    explanation: 문자열, 정수, 불리언을 각각 변수에 저장하고 나눗셈 결과인 실수를 :.1f 형식으로 출력한 종합 예제입니다.
    commonMistakes:
      [
        목표 시간을 실제 시간으로 나누어 달성률을 반대로 계산함,
        True를 따옴표로 감싸 문자열로 만듦,
        퍼센트 기호를 중괄호 안에 넣음,
      ]
    language: python
    verification: run
quiz:
  - id: quiz-day01-01
    question: Python에서 x = 3 이후 x = "three"가 가능한 가장 정확한 이유는?
    choices:
      [
        Python에는 타입이 없기 때문에,
        변수 이름이 다른 타입의 객체를 다시 가리킬 수 있기 때문에,
        모든 값이 문자열이기 때문에,
      ]
    answerIndex: 1
    explanation: Python의 값에는 타입이 있습니다. 다만 이름 x의 타입을 컴파일할 때 하나로 고정하지 않아 다른 타입의 값에 다시 연결할 수 있습니다.
  - id: quiz-day01-02
    question: 'print(f"{topic}: {minutes}분")에서 문자열 앞의 f가 하는 일은?'
    choices:
      [
        문자열을 파일로 저장한다,
        중괄호 안의 표현식을 계산해 문자열에 넣는다,
        모든 문자를 대문자로 바꾼다,
      ]
    answerIndex: 1
    explanation: f는 formatted string literal을 뜻하며 중괄호 안의 변수나 표현식 값을 문자열에 삽입합니다.
  - id: quiz-day01-03
    question: Python에서 type(True)의 결과는?
    choices: [int, str, bool]
    answerIndex: 2
    explanation: True와 False는 참·거짓을 나타내는 bool 자료형의 값입니다.
  - id: quiz-day01-04
    question: Rust의 let mut count = 1에서 mut가 뜻하는 것은?
    choices:
      [
        count에 다른 자료형을 언제든 넣을 수 있다,
        같은 바인딩의 값을 변경할 수 있다,
        메모리를 수동으로 해제해야 한다,
      ]
    answerIndex: 1
    explanation: mut는 값 변경을 허용하지만, 한 번 추론된 바인딩의 자료형을 다른 자료형으로 바꾸는 표시는 아닙니다.
---

## 1. 오늘 배울 내용을 먼저 보기

오늘은 프로그램의 가장 작은 재료인 **값**, 그 값을 다시 사용하기 위한 **변수 이름**, 그리고 값의 종류를 나타내는 **자료형**을 배웁니다. 마지막에는 아래 코드의 모든 기호를 스스로 설명할 수 있어야 합니다.

```python
topic = "Python"
minutes = 30
focused = True
print(f"{topic}: {minutes}분 / 집중={focused}")
```

처음 보는 문법이 있어도 괜찮습니다. `f"..."`가 무엇인지까지 한 단계씩 나누어 살펴봅니다.

## 2. 이 개념은 왜 필요한가

프로그램은 값을 받아서 기억하고, 계산하고, 결과를 보여 줍니다. 예를 들어 학습 기록 프로그램이라면 다음 값이 필요합니다.

- 과목: `"Python"`
- 공부한 시간: `30`
- 집중했는지 여부: `True`
- 목표 달성률: `75.0`

값을 한 번만 쓴다면 그대로 적어도 되지만, 여러 번 사용하거나 나중에 바꾸려면 이름을 붙이는 편이 안전합니다. `30`이라는 숫자만 보면 무엇을 뜻하는지 알기 어렵지만 `minutes`라는 이름을 붙이면 의미가 드러납니다.

## 3. Mental model: 값, 이름표, 자료형

다음 세 가지를 구분하세요.

1. **값(value)**: 실제 데이터입니다. 예: `30`, `"Python"`, `True`
2. **변수 이름(variable name)**: 값을 다시 찾기 위해 붙인 이름입니다. 예: `minutes`
3. **자료형(type)**: 그 값으로 무엇을 할 수 있는지 정하는 종류입니다. 예: `int`, `str`, `bool`

Python의 대입문을 이름표로 생각해 봅시다.

```text
minutes = 30

[이름표 minutes] ─────▶ [정수 값 30]
```

`=`는 수학에서의 “양쪽이 같다”보다 **오른쪽 값을 왼쪽 이름에 연결한다**는 뜻에 가깝습니다. 오른쪽을 먼저 계산한 다음 왼쪽 이름에 결과를 대입합니다.

```python
base = 20
minutes = base + 10
```

두 번째 줄은 `base + 10`을 먼저 계산해 `30`을 만든 뒤, 그 결과를 `minutes`에 연결합니다.

## 4. Python의 기본 자료형 네 가지

| 자료형  | 뜻     | 예                 | 주로 하는 일          |
| ------- | ------ | ------------------ | --------------------- |
| `int`   | 정수   | `30`, `-2`, `0`    | 개수, 시간, 점수 계산 |
| `float` | 실수   | `75.0`, `3.14`     | 비율, 평균, 소수 계산 |
| `str`   | 문자열 | `"Python"`, `"30"` | 글자와 문장 처리      |
| `bool`  | 불리언 | `True`, `False`    | 조건의 참·거짓 표현   |

값의 자료형은 `type()`으로 확인할 수 있습니다.

```python
print(type(30))        # <class 'int'>
print(type(75.0))      # <class 'float'>
print(type("Python"))  # <class 'str'>
print(type(True))      # <class 'bool'>
```

`"30"`과 `30`은 겉보기는 비슷하지만 다릅니다. `"30"`은 글자 두 개로 이루어진 문자열이고, `30`은 덧셈에 사용할 수 있는 정수입니다.

```python
print(30 + 1)        # 31
print("30" + "1")    # 301
```

문자열끼리 `+`를 사용하면 숫자 덧셈이 아니라 문자열 연결이 일어납니다.

## 5. 대입과 재할당

```python
score = 10
score = 15
```

첫째 줄 뒤에는 `score`가 `10`을 가리킵니다. 둘째 줄이 실행되면 `score`가 `15`를 가리키도록 **재할당**됩니다. 과거의 대입문이 다시 실행되는 것은 아닙니다.

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
| `bonus = score` |      10 |      10 | 현재 `score`의 값이 `bonus`에 대입됨 |
| `score = 15`    |      15 |      10 | `score`만 새 값에 다시 연결됨        |
| `print(...)`    |      15 |      10 | `15 10` 출력                         |

여기서는 정수처럼 변경할 수 없는 값의 단순한 경우를 다룹니다. 리스트처럼 내부를 바꿀 수 있는 객체를 여러 이름이 함께 가리키는 문제는 Day 29에서 자세히 배웁니다.

## 6. f-string을 기호별로 해부하기

이제 맨 처음에 본 출력문을 기호별로 나누어 봅시다.

```python
print(f"{topic}: {minutes}분 / 집중={focused}")
```

| 부분             | 뜻                                                 |
| ---------------- | -------------------------------------------------- |
| `print(...)`     | 괄호 안의 값을 화면에 출력하는 함수                |
| 문자열 앞의 `f`  | 중괄호 안의 표현식을 계산해 문자열에 넣겠다는 표시 |
| 큰따옴표 `"..."` | 문자열의 시작과 끝                                 |
| `{topic}`        | 변수 `topic`의 현재 값으로 교체되는 자리           |
| `: `             | 그대로 출력되는 콜론과 공백                        |
| `{minutes}`      | 변수 `minutes`의 현재 값으로 교체되는 자리         |
| `분 / 집중=`     | 그대로 출력되는 글자                               |
| `{focused}`      | 변수 `focused`의 현재 값으로 교체되는 자리         |

변수 값이 다음과 같다면,

```python
topic = "Python"
minutes = 30
focused = True
```

Python은 f-string을 만들 때 다음처럼 자리를 채웁니다.

```text
"{topic}: {minutes}분 / 집중={focused}"
       ↓          ↓              ↓
  "Python: 30분 / 집중=True"
```

따라서 최종 출력은 다음과 같습니다.

```text
Python: 30분 / 집중=True
```

문자열 앞의 `f`를 빼면 중괄호가 특별한 자리가 아니라 평범한 글자로 처리됩니다.

```python
print("{topic}: {minutes}분")   # {topic}: {minutes}분
print(f"{topic}: {minutes}분")  # Python: 30분
```

중괄호 안에는 변수뿐 아니라 짧은 계산도 넣을 수 있습니다.

```python
hours = 2
print(f"총 학습 시간: {hours * 60}분")  # 총 학습 시간: 120분
```

다만 계산이 길어지면 먼저 의미 있는 변수에 저장하는 편이 읽기 쉽습니다.

## 7. f-string의 출력 형식 지정

실수는 필요한 자릿수만 보이도록 형식을 지정할 수 있습니다.

```python
achievement = 30 / 40 * 100
print(achievement)                    # 75.0
print(f"달성률: {achievement:.1f}%")  # 달성률: 75.0%
```

`{achievement:.1f}`에서 `:` 뒤의 `.1f`는 실수를 소수점 아래 한 자리까지 표시하라는 뜻입니다. `%`는 중괄호 밖에 있으므로 그대로 출력됩니다.

## 8. Worked example: 학습 기록 한 줄 만들기

```python
topic = "Python"
goal_minutes = 40
actual_minutes = 30
focused = True

achievement = actual_minutes / goal_minutes * 100

print(f"과목: {topic}")
print(f"시간: {actual_minutes}/{goal_minutes}분")
print(f"집중: {focused}")
print(f"달성률: {achievement:.1f}%")
```

실행 결과:

```text
과목: Python
시간: 30/40분
집중: True
달성률: 75.0%
```

### 코드 한 줄씩 설명

1. `topic = "Python"`: 문자열 값을 `topic`이라는 이름에 연결합니다.
2. `goal_minutes = 40`: 목표 시간을 정수로 저장합니다.
3. `actual_minutes = 30`: 실제 공부한 시간을 정수로 저장합니다.
4. `focused = True`: 집중 여부를 불리언 값으로 저장합니다. `"True"`처럼 따옴표를 쓰면 문자열이 되므로 주의합니다.
5. 빈 줄: 실행에는 영향을 주지 않고 코드 덩어리를 구분해 읽기 쉽게 합니다.
6. `achievement = ...`: 오른쪽의 나눗셈과 곱셈을 먼저 계산해 `75.0`을 저장합니다. `/`의 결과는 실수입니다.
7. 네 개의 `print`: 변수의 현재 값을 f-string 안에 넣어 읽기 좋은 문장으로 출력합니다.

### 실행 과정 추적

| 순서 | 새로 생기거나 바뀐 이름 | 값         | 자료형  |
| ---: | ----------------------- | ---------- | ------- |
|    1 | `topic`                 | `"Python"` | `str`   |
|    2 | `goal_minutes`          | `40`       | `int`   |
|    3 | `actual_minutes`        | `30`       | `int`   |
|    4 | `focused`               | `True`     | `bool`  |
|    5 | `achievement`           | `75.0`     | `float` |

## 9. 먼저 예측한 뒤 실행하기

아래 코드를 바로 실행하지 말고 종이에 `minutes`의 변화를 적어 보세요.

```python
minutes = 20
minutes = minutes + 10
print(f"{minutes}분")
```

둘째 줄에서는 오른쪽의 기존 `minutes` 값 `20`을 읽어 `10`을 더합니다. 그 결과 `30`을 다시 같은 이름에 대입하므로 출력은 `30분`입니다.

## 10. 직접 타이핑하기

복사·붙여넣기보다 아래 순서대로 직접 입력해 보세요.

1. 코드 실행 영역에서 언어가 Python인지 확인합니다.
2. `topic = "Python"`을 입력하고 실행합니다. 출력이 없는 것이 정상입니다. 대입만 했기 때문입니다.
3. 다음 줄에 `print(topic)`을 추가해 값이 출력되는지 확인합니다.
4. `minutes`와 `focused`를 추가합니다.
5. 마지막에 f-string 출력문을 추가합니다.
6. `minutes`를 `30`에서 `45`로 바꾸고 출력도 함께 바뀌는지 확인합니다.

에러가 나면 빨간 메시지의 마지막 줄부터 읽으세요. 변수 이름 철자, 따옴표 짝, 괄호 짝, 문자열 앞의 `f`를 차례대로 확인하면 대부분의 Day 1 오류를 찾을 수 있습니다.

## 11. C로 transfer: 타입을 먼저 적는 저장 공간

같은 데이터를 C로 표현하면 각 변수 앞에 자료형을 적습니다.

```c
#include <stdbool.h>
#include <stdio.h>

int main(void) {
    const char *topic = "Python";
    int goal_minutes = 40;
    int actual_minutes = 30;
    bool focused = true;
    double achievement = (double)actual_minutes / goal_minutes * 100.0;

    printf("%s: %d/%d분, 집중=%s\n",
           topic, actual_minutes, goal_minutes,
           focused ? "true" : "false");
    printf("달성률: %.1f%%\n", achievement);
    return 0;
}
```

C에서는 `int actual_minutes`처럼 **정수용 변수**라는 약속을 먼저 만듭니다. 이후 여기에 문자열을 넣으려 하면 컴파일 단계에서 문제를 알려 줍니다.

Python의 f-string 대신 `printf`의 서식 문자를 사용합니다.

| C 서식 | 넣는 값             |
| ------ | ------------------- |
| `%s`   | 문자열              |
| `%d`   | 정수                |
| `%.1f` | 소수점 한 자리 실수 |
| `%%`   | 퍼센트 기호 자체    |

`(double)actual_minutes`는 정수 나눗셈이 되지 않도록 값을 실수로 변환합니다. C에서는 자료형이 계산 결과에도 직접 영향을 줍니다.

## 12. Rust로 transfer: 추론하되 변경은 명시하기

```rust
fn main() {
    let topic = "Python";
    let goal_minutes = 40;
    let actual_minutes = 30;
    let focused = true;
    let achievement = actual_minutes as f64 / goal_minutes as f64 * 100.0;

    println!("{topic}: {actual_minutes}/{goal_minutes}분, 집중={focused}");
    println!("달성률: {achievement:.1}%");
}
```

Rust는 값에서 자료형을 추론하므로 매번 타입을 쓰지 않아도 됩니다. 그러나 기본 바인딩은 변경할 수 없습니다.

```rust
let mut minutes = 20;
minutes = 30;
```

값을 바꿀 계획이 있다면 `mut`로 의도를 명시합니다. Python의 이름은 다른 종류의 값으로 다시 연결될 수 있지만, Rust의 한 바인딩은 추론된 타입을 유지합니다.

## 13. 세 언어를 같은 질문으로 비교하기

| 질문                          | Python         | C                  | Rust                |
| ----------------------------- | -------------- | ------------------ | ------------------- |
| 타입은 언제 주로 확인하나?    | 실행할 때      | 컴파일할 때        | 컴파일할 때         |
| 변수 선언 때 타입을 쓰나?     | 보통 쓰지 않음 | 대부분 반드시 씀   | 대부분 추론 가능    |
| 기본적으로 값을 바꿀 수 있나? | 가능           | 가능               | `mut`가 있어야 가능 |
| 문자열 안에 값을 넣는 법      | f-string       | `printf` 서식 문자 | `println!`의 `{}`   |
| `30 / 40`의 주의점            | `0.75`         | 정수끼리는 `0`     | 정수끼리는 `0`      |

문법만 외우기보다 **값을 만들고 → 이름에 저장하고 → 계산하고 → 출력한다**는 공통 흐름을 찾으세요. 언어마다 그 과정에서 허용하는 것과 미리 검사하는 것이 다릅니다.

## 14. 초보자가 자주 하는 실수

### 변수 이름을 따옴표로 감싼다

```python
topic = "Python"
print("topic")  # topic이라는 글자 출력
print(topic)    # Python이라는 값 출력
```

### 숫자 문자열을 숫자로 착각한다

```python
minutes = "30"
print(minutes + "10")  # 3010
```

숫자 계산이 목적이라면 `int(minutes)`처럼 의미를 분명히 변환해야 합니다.

### f-string의 f를 빠뜨린다

```python
print("{minutes}분")   # {minutes}분
print(f"{minutes}분")  # 30분
```

### 불리언을 문자열로 만든다

```python
focused = "False"
```

따옴표가 있으면 `"False"`는 글자입니다. 조건에 사용할 참·거짓 값은 `False`처럼 따옴표 없이 씁니다.

### `=`와 `==`를 혼동한다

- `=`: 값을 이름에 대입합니다.
- `==`: 두 값이 같은지 비교합니다. 조건문에서 자세히 배웁니다.

## 15. 스스로 설명해 보기

아래 질문에 코드를 보지 않고 답해 보세요.

1. 값과 변수 이름은 어떻게 다른가?
2. `"30"`과 `30`은 왜 다른가?
3. f-string 앞의 `f`를 빼면 무슨 일이 생기는가?
4. `{achievement:.1f}`의 `.1f`는 무엇을 뜻하는가?
5. Rust에서 값을 바꾸려면 왜 `mut`가 필요한가?

막히는 질문이 있으면 해당 절을 다시 읽은 뒤, 바로 아래 실습에서 손으로 확인하세요.

## 16. 핵심 요약

- 값은 실제 데이터이고, 변수는 그 값을 다시 사용하기 위한 이름입니다.
- 자료형은 값으로 가능한 연산을 결정합니다.
- Python의 `=`는 오른쪽을 먼저 계산해 왼쪽 이름에 대입합니다.
- f-string은 문자열 앞에 `f`를 붙이고 `{}` 안에 변수나 표현식을 넣습니다.
- Python은 실행 중에 타입을 확인하고, C와 Rust는 많은 타입 오류를 컴파일할 때 잡습니다.
- 세 언어의 문법은 달라도 값 → 저장 → 계산 → 출력이라는 기본 흐름은 같습니다.
