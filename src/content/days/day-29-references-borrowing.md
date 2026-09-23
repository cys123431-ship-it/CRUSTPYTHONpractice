---
schemaVersion: 1
contentVersion: "2026.10-b"
id: day-29-references-borrowing
courseId: crp-92
phaseId: phase-04
dayNumber: 29
date: "2026-10-29"
title: 포인터 · 참조 · 빌림 — 같은 값을 바라보는 세 방식
summary: C 포인터를 Anchor로 주소와 역참조를 손으로 추적하고, Python의 객체 참조와 Rust의 borrow 규칙이 어떤 문제를 해결하는지 비교합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-01-variables-types]
learningObjectives:
  - 변수의 값과 메모리 주소를 구분한다.
  - C의 &, *, 포인터 변수, 역참조 대입을 설명한다.
  - 포인터를 사용한 함수가 호출자 변수를 바꾸는 과정을 추적한다.
  - Python에서 같은 mutable 객체를 공유할 때 변경이 전파되는 이유를 설명한다.
  - Rust의 공유 빌림과 가변 빌림 규칙이 막는 오류를 설명한다.
concepts:
  [pointer, address, dereference, reference, borrowing, aliasing, lifetime]
runnerMode: prepared-wasm
reviewOffsets: [1, 3, 7, 14, 30]
sample: true
exercises:
  - id: ex-day29-predict
    title: 포인터 대입 결과 예측
    kind: predict
    objective: 포인터가 저장한 주소와 역참조한 값을 구분한다.
    prompt: "'*p += 5' 실행 뒤 value의 값을 적으세요."
    starter: "int value = 10;\nint *p = &value;\n*p += 5;"
    answer: "15"
    hint: p는 주소이고 *p는 그 주소에서 찾은 value의 저장 공간입니다.
    explanation: p는 value의 주소를 저장합니다. *p는 value 자체를 뜻하므로 *p += 5는 value = value + 5와 같은 효과를 냅니다.
    commonMistakes:
      [주소 숫자에 5를 더한다고 해석함, p와 *p를 같은 것으로 생각함]
    language: c
    verification: compile
  - id: ex-day29-fill
    title: 주소와 역참조 빈칸 채우기
    kind: fill
    objective: 주소 연산자와 역참조 연산자를 알맞은 위치에 사용한다.
    prompt: p가 score의 주소를 저장하고, p를 통해 score를 20으로 바꾸도록 빈칸을 채우세요.
    starter: "int score = 10;\nint *p = __score;\n__p = 20;"
    answer: "int score = 10;\nint *p = &score;\n*p = 20;"
    hint: 변수의 주소는 &score, 포인터가 가리키는 값은 *p입니다.
    explanation: &는 변수의 주소를 얻고, *는 포인터에 저장된 주소를 따라가 그곳의 값에 접근합니다.
    commonMistakes: ["&p에 대입함", 두 빈칸 모두 같은 연산자로 채움]
    language: c
    verification: compile
  - id: ex-day29-modify
    title: Python 공유와 복사 비교
    kind: modify
    objective: 같은 리스트를 공유하는 경우와 얕은 복사한 경우를 구분한다.
    prompt: backup을 원본과 독립적인 리스트로 만들어 scores를 수정해도 backup은 [10, 20]을 유지하도록 고치세요.
    starter: "scores = [10, 20]\nbackup = scores\nscores.append(30)\nprint(scores)\nprint(backup)"
    answer: "scores = [10, 20]\nbackup = scores.copy()\nscores.append(30)\nprint(scores)\nprint(backup)"
    hint: list의 copy() 메서드는 새 리스트 객체를 만듭니다.
    explanation: backup = scores는 두 이름을 같은 리스트에 연결합니다. scores.copy()는 원소를 가진 별도의 리스트를 만들어 이후 append가 backup에 전파되지 않습니다.
    commonMistakes:
      [backup = scores를 복사라고 생각함, append의 반환값을 backup에 저장함]
    language: python
    verification: run
  - id: ex-day29-debug
    title: Rust 가변 빌림 충돌 고치기
    kind: debug
    objective: 두 가변 빌림의 사용 시점이 겹치지 않도록 범위를 분리한다.
    prompt: 같은 값을 동시에 두 번 가변 빌림해서 생기는 컴파일 오류를 블록 범위로 고치세요.
    starter: "let mut n = 10;\nlet a = &mut n;\nlet b = &mut n;\n*a += 1;\n*b += 1;"
    answer: "let mut n = 10;\n{ let a = &mut n; *a += 1; }\n{ let b = &mut n; *b += 1; }"
    hint: 첫 번째 &mut 참조를 블록 안에서 마지막으로 사용하고 블록이 끝난 뒤 두 번째 참조를 만드세요.
    explanation: 같은 값에 대한 가변 참조는 한 시점에 하나만 허용됩니다. 각 블록이 끝나면 빌림도 끝나므로 다음 가변 빌림을 안전하게 만들 수 있습니다.
    commonMistakes:
      [두 참조를 불변 참조로 바꾸고 값을 수정하려 함, n을 immutable로 둠]
    language: rust
    verification: compile
  - id: ex-day29-independent
    title: 포인터로 두 값 교환하기
    kind: independent
    objective: 포인터 매개변수와 임시 변수를 사용해 호출자의 두 값을 교환한다.
    prompt: int 포인터 두 개를 받아 가리키는 값을 서로 바꾸는 swap 함수를 완성하세요.
    starter: "void swap(int *a, int *b) {\n    // temp를 사용해 *a와 *b를 교환하세요.\n}"
    answer: "void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}"
    hint: 값 하나를 덮어쓰기 전에 int temp에 보관해야 합니다.
    explanation: a와 b에는 호출자 변수의 주소가 들어 있습니다. *a와 *b에 대입하면 함수 밖의 원본 저장 공간이 바뀝니다.
    commonMistakes:
      [
        a와 b라는 주소만 서로 바꿈,
        임시 변수 없이 먼저 한 값을 덮어씀,
        함수 호출 때 &를 빠뜨림,
      ]
    language: c
    verification: compile
quiz:
  - id: quiz-day29-01
    question: C에서 p와 *p의 관계를 가장 정확히 설명한 것은?
    choices:
      [
        둘 다 같은 주소다,
        p는 주소이고 *p는 그 주소에 있는 객체다,
        p는 값이고 *p는 p 자신의 주소다,
      ]
    answerIndex: 1
    explanation: 포인터 변수 p의 값은 주소이고 역참조 표현식 *p는 그 주소가 가리키는 객체에 접근합니다.
  - id: quiz-day29-02
    question: "'&value'가 뜻하는 것은?"
    choices:
      [value의 현재 숫자, value가 저장된 메모리 주소, value를 삭제하는 명령]
    answerIndex: 1
    explanation: 단항 & 연산자는 객체의 주소를 얻습니다.
  - id: quiz-day29-03
    question: Python에서 b = a 뒤 b.append(3)이 a에도 보이는 이유는?
    choices:
      [
        모든 리스트가 전역 변수이기 때문에,
        a와 b가 같은 mutable 리스트 객체를 가리키기 때문에,
        append가 모든 리스트를 수정하기 때문에,
      ]
    answerIndex: 1
    explanation: 이름은 복사됐지만 리스트 객체 자체가 복제된 것은 아니므로 두 이름을 통해 같은 변경을 관찰합니다.
  - id: quiz-day29-04
    question: Rust가 같은 값에 대한 두 mutable reference를 동시에 막는 주된 이유는?
    choices:
      [
        메모리를 덜 쓰기 위해,
        변경 권한 충돌과 데이터 경쟁을 막기 위해,
        포인터 문법을 없애기 위해,
      ]
    answerIndex: 1
    explanation: 한 시점의 가변 접근을 하나로 제한하면 누가 값을 바꾸는지 명확해지고 데이터 경쟁을 컴파일 단계에서 차단할 수 있습니다.
---

## 1. 오늘의 핵심 질문

Day 1에서는 변수 이름과 값을 구분했습니다. 오늘은 한 단계 더 나아가 다음을 묻습니다.

> 값은 메모리의 어디에 있으며, 여러 코드가 같은 값을 바라보면 누가 바꿀 수 있을까?

C는 메모리 주소를 **포인터**로 직접 다룹니다. Python은 주소 문법을 숨기고 이름이 객체를 참조하게 합니다. Rust는 참조에 **빌림 규칙**을 추가하여 잘못된 공유를 컴파일할 때 막습니다.

## 2. 왜 포인터와 참조가 필요한가

주소나 참조가 필요한 대표적인 이유는 다음과 같습니다.

- 함수가 호출자 쪽의 값을 직접 바꾸기
- 큰 배열이나 구조체를 매번 복사하지 않고 전달하기
- 동적으로 만든 메모리와 연결 자료구조 다루기
- 여러 이름이 같은 객체를 공유할 때 생기는 변경 이해하기
- 값이 언제까지 유효한지 추적하기

포인터 문법을 외우기 전에 **주소**와 **그 주소에 저장된 값**을 분리해서 생각해야 합니다.

## 3. Mental model: 집 주소와 집 안의 물건

메모리의 각 저장 위치에는 주소가 있다고 생각해 봅시다.

```c
int value = 10;
```

설명을 위해 `value`가 우연히 주소 `0x100`에 저장됐다고 가정합니다. 실제 주소는 실행할 때마다 달라질 수 있습니다.

```text
변수 이름        주소          저장된 값
value          0x100            10
```

이제 포인터를 만듭니다.

```c
int *p = &value;
```

```text
p의 값 = 0x100 ─────────▶ 0x100번 위치의 value = 10
```

- `&value`: value의 **주소를 구한다**.
- `p`: 그 주소를 **저장한다**.
- `*p`: p의 주소를 따라가 **그곳의 값에 접근한다**.

`p`와 `*p`는 다릅니다. `p`는 집 주소이고, `*p`는 그 주소로 찾아간 집 안의 물건입니다.

## 4. C 포인터 선언을 읽는 법

```c
int value = 10;
int *p = &value;
```

둘째 줄을 오른쪽부터 읽어 봅니다.

1. `&value`: value의 주소를 얻습니다.
2. `p = ...`: 그 주소를 p에 저장합니다.
3. `int *p`: p는 `int`를 가리키는 포인터입니다.

표현을 비교하면 다음과 같습니다.

| 표현     | 예시 값 | 의미                      |
| -------- | ------- | ------------------------- |
| `value`  | `10`    | value에 저장된 정수       |
| `&value` | `0x100` | value의 주소              |
| `p`      | `0x100` | p에 저장된 주소           |
| `&p`     | `0x200` | 포인터 변수 p 자신의 주소 |
| `*p`     | `10`    | p가 가리키는 위치의 정수  |

`*`는 문맥에 따라 두 역할을 합니다.

- 선언의 `int *p`: int를 가리키는 포인터 p를 선언
- 식의 `*p`: p를 역참조하여 가리키는 객체에 접근

## 5. 역참조로 원본 바꾸기

```c
int value = 10;
int *p = &value;
*p = 25;
printf("%d\n", value);
```

실행 추적:

| 순서 | `value` | `p`          | `*p` | 일어난 일                   |
| ---: | ------: | ------------ | ---: | --------------------------- |
|    1 |      10 | 없음         | 없음 | value 공간에 10 저장        |
|    2 |      10 | value의 주소 |   10 | p가 value를 가리킴          |
|    3 |      25 | value의 주소 |   25 | p가 가리키는 공간에 25 기록 |
|    4 |      25 | value의 주소 |   25 | 25 출력                     |

`*p = 25`는 p 자체에 25를 넣는 코드가 아닙니다. p가 가리키는 **원본 저장 공간**을 바꿉니다.

## 6. Worked example: 함수에서 두 값 교환하기

C의 함수 매개변수는 기본적으로 전달받은 값을 복사합니다.

```c
void wrong_swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}
```

이 함수는 복사본 a와 b만 바꾸므로 호출자의 원본은 그대로입니다. 원본을 바꾸려면 주소를 전달합니다.

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int left = 10;
    int right = 20;

    swap(&left, &right);
    printf("left=%d, right=%d\n", left, right);
    return 0;
}
```

출력:

```text
left=20, right=10
```

### 줄별로 따라가기

1. `left`와 `right`에 각각 10과 20을 저장합니다.
2. `swap(&left, &right)`는 두 변수의 주소를 전달합니다.
3. 함수 안에서 `a`는 left의 주소, `b`는 right의 주소를 받습니다.
4. `temp = *a`는 left의 값 10을 잠시 보관합니다.
5. `*a = *b`는 right의 값 20을 left 공간에 씁니다.
6. `*b = temp`는 보관한 10을 right 공간에 씁니다.
7. 함수가 끝난 뒤에도 호출자의 두 저장 공간은 바뀐 상태입니다.

## 7. 잘못된 포인터가 위험한 이유

C 포인터는 강력하지만 주소가 유효한지 프로그래머가 책임져야 합니다.

### 초기화하지 않은 포인터

```c
int *p;
*p = 10;  // p가 어디를 가리키는지 정해지지 않음
```

### null 포인터 역참조

```c
int *p = NULL;
*p = 10;  // 잘못된 접근
```

### 수명이 끝난 지역 변수의 주소 반환

```c
int *bad(void) {
    int local = 10;
    return &local;
}
```

`local`은 함수가 끝나면 유효하지 않습니다. 그 주소를 나중에 사용하면 정의되지 않은 동작이 생길 수 있습니다. 컴파일이 된다는 사실만으로 포인터가 안전하다는 뜻은 아닙니다.

## 8. Aliasing: 여러 경로가 같은 값을 가리키기

둘 이상의 이름이나 포인터가 같은 객체를 가리키는 상태를 **aliasing**이라고 합니다.

```c
int value = 10;
int *a = &value;
int *b = &value;
*a = 30;
printf("%d\n", *b);  // 30
```

a를 통해 바꿨지만 b도 같은 value를 바라보므로 30을 읽습니다. 코드가 커질수록 “누가 언제 값을 바꿨는가”를 추적하기 어려워질 수 있습니다.

## 9. Python으로 transfer: 주소 문법 없는 객체 참조

Python은 C처럼 `&`와 `*`를 직접 사용하지 않지만, 이름이 객체를 가리킨다는 점은 비슷합니다.

```python
scores = [10, 20]
backup = scores
scores.append(30)

print(scores)  # [10, 20, 30]
print(backup)  # [10, 20, 30]
```

`backup = scores`는 리스트 전체를 복사하지 않습니다. 두 이름이 같은 리스트 객체를 가리킵니다.

```text
scores ─┐
        ├────▶ [10, 20, 30]
backup ─┘
```

독립적인 리스트가 필요하면 명시적으로 복사합니다.

```python
scores = [10, 20]
backup = scores.copy()
scores.append(30)

print(scores)  # [10, 20, 30]
print(backup)  # [10, 20]
```

정수와 문자열은 내부를 바꿀 수 없는 immutable 객체라서 리스트와 다르게 보입니다. 이름을 재할당하면 다른 이름이 함께 바뀌지 않습니다.

## 10. Rust로 transfer: 주소에 권한 규칙 더하기

Rust의 참조는 주소를 사용하지만, **누가 읽고 누가 바꿀 수 있는지**를 함께 검사합니다.

```rust
fn add_five(value: &mut i32) {
    *value += 5;
}

fn main() {
    let mut score = 10;
    add_five(&mut score);
    println!("{score}");
}
```

- `&score`: 읽기 위한 공유 참조
- `&mut score`: 변경하기 위한 가변 참조
- `*value`: 참조가 가리키는 i32 값에 접근

Rust의 핵심 규칙을 단순화하면 다음과 같습니다.

1. 한 시점에 공유 참조 `&T`는 여러 개 만들 수 있습니다.
2. 값을 바꾸는 가변 참조 `&mut T`는 한 시점에 하나만 만들 수 있습니다.
3. 가변 참조가 사용되는 동안 같은 값의 다른 참조를 충돌하게 사용할 수 없습니다.
4. 참조는 원본보다 오래 살아남을 수 없습니다.

## 11. Rust가 막는 충돌을 읽기

```rust
let mut n = 10;
let a = &mut n;
let b = &mut n;
*a += 1;
*b += 1;
```

두 가변 참조가 동시에 존재하고 뒤에서 모두 사용되므로 컴파일러가 거부합니다. 변경 권한이 두 곳에 있으면 실행 순서나 병렬 실행에서 충돌할 수 있기 때문입니다.

사용 시점을 분리하면 됩니다.

```rust
let mut n = 10;

{
    let a = &mut n;
    *a += 1;
}

{
    let b = &mut n;
    *b += 1;
}
```

첫 블록이 끝날 때 a의 빌림도 끝납니다. 그 뒤에는 두 번째 가변 빌림을 안전하게 만들 수 있습니다.

## 12. 세 언어 비교

| 질문                   | C pointer               | Python reference        | Rust borrow                 |
| ---------------------- | ----------------------- | ----------------------- | --------------------------- |
| 주소 문법을 직접 보나? | 예                      | 아니요                  | 참조 문법으로 제한적으로 봄 |
| 원본을 바꿀 수 있나?   | 포인터를 통해 가능      | mutable 객체면 가능     | `&mut`일 때 가능            |
| null을 표현하는 법     | `NULL`                  | `None`                  | 보통 `Option<&T>`           |
| 유효 기간 검사         | 주로 프로그래머 책임    | 런타임 객체 수명 관리   | 컴파일러가 빌림 수명 검사   |
| 변경 aliasing          | 가능하며 위험할 수 있음 | 가능하며 실행 중 관찰됨 | 가변 빌림 규칙으로 제한     |

Rust reference는 C pointer의 철자만 바꾼 것이 아닙니다. 주소를 사용한다는 공통점 위에 유효 기간과 변경 권한 규칙을 추가한 개념입니다.

## 13. 직접 타이핑하고 추적하기

다음 순서로 손으로 확인하세요.

1. `value`, `p`, `*p`를 세 칸으로 나누어 종이에 적습니다.
2. C 예제의 각 줄이 끝날 때 세 칸을 갱신합니다.
3. Python 예제에서 `scores`와 `backup`이 같은 상자를 가리키는 화살표를 그립니다.
4. `copy()`를 사용한 뒤에는 상자를 두 개로 그립니다.
5. Rust의 각 참조 옆에 읽기 권한인지 변경 권한인지 적습니다.

주소 숫자를 외울 필요는 없습니다. **어떤 경로가 어떤 원본을 가리키는지**를 정확히 그리는 것이 목표입니다.

## 14. 자주 하는 실수

- `p`와 `*p`를 같은 것으로 생각한다.
- 주소가 필요한 함수 호출에서 `&left` 대신 `left`를 전달한다.
- null인지 확인하지 않고 역참조한다.
- Python의 `backup = scores`가 새 리스트를 만든다고 생각한다.
- Rust에서 `&mut`를 여러 개 만들면 무조건 안 된다고 외운다. 정확히는 **사용 시점이 겹치는 가변 빌림**이 문제입니다.
- 컴파일 성공을 메모리 안전성의 증명으로 생각한다. 특히 C에서는 실행 중 잘못된 주소 접근이 남을 수 있습니다.

## 15. 핵심 요약

- 주소는 값이 저장된 위치이고, 포인터는 그 주소를 저장하는 값입니다.
- C의 `&`는 주소를 얻고 `*`는 주소를 따라가 원본에 접근합니다.
- 포인터 매개변수로 함수 밖의 원본을 수정할 수 있습니다.
- Python에서는 여러 이름이 같은 mutable 객체를 공유할 수 있습니다.
- Rust의 빌림은 참조에 읽기·변경 권한과 유효 기간 규칙을 추가합니다.
- 세 언어 모두 “같은 값을 여러 경로에서 바라본다”는 문제를 다루지만 안전성을 확보하는 시점과 방식이 다릅니다.
