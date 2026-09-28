---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-42-memory-review
courseId: crp-92
phaseId: phase-04
dayNumber: 42
date: "2026-11-11"
title: 메모리 모델 종합 회상 — 무엇이 복사되고, 무엇이 공유되는가
summary: Day 29~41의 메모리 내용을 "이 줄에서 무엇이 복사되고 무엇이 공유되는가"라는 질문 하나로 정리합니다. Python에서 이름 바꾸기와 내용 바꾸기, a = a + [x]와 a += [x]의 차이, 튜플 안의 리스트와 +=의 반쯤 실패하는 대입, dict.fromkeys가 만드는 공유 리스트, 반복문 안 람다가 변수를 늦게 읽는 문제를 다룹니다. C의 값 복사·얕은 복사·깊은 복사와 해제 책임, Rust의 Copy·이동·clone·빌림·Box·Rc가 각각 무엇을 복사하는지 비교하고, 도서관 대출 기록을 리스트 번호·바뀌지 않는 id·참조로 가리키는 세 방법을 세 언어로 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-41-box]
learningObjectives:
  - Python의 대입·함수 인자·+=가 객체를 새로 만드는지, 같은 객체를 바꾸는지 구별한다.
  - 튜플 안의 리스트, dict.fromkeys, 반복문 안 람다처럼 공유가 숨어 있는 코드를 찾아 고친다.
  - C에서 값 복사·얕은 복사·깊은 복사를 구현하고, 각각 누가 free해야 하는지 설명한다.
  - Rust의 Copy·이동·clone·빌림·Box·Rc가 각각 무엇을 복사하는지 표로 정리한다.
  - 다른 데이터를 가리킬 때 인덱스·바뀌지 않는 id·참조의 장단점을 비교한다.
concepts:
  [
    memory model review,
    rebinding,
    mutation,
    augmented assignment,
    tuple with list,
    shared default,
    late binding closure,
    shallow copy,
    deep copy,
    ownership,
    rc,
    stable id,
    index invalidation,
    arena,
  ]
runnerMode: python
playgroundSource: |
  # 파일: traps.py — 결과를 먼저 예측한 뒤 실행해 보세요.
  a = [1]
  b = a
  a += [2]
  print(a, b)
  t = (1, [2])
  try:
      t[1] += [3]
  except TypeError as e:
      print("TypeError:", e)
  print(t)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day42-predict-plus
    title: + 와 += 가 섞인 별칭 예측하기
    kind: predict
    objective: a = a + [x]는 새 리스트를, b += [x]는 같은 리스트를 바꾼다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      a = [1]
      b = a
      a = a + [2]
      b += [3]
      print(a, b)
    answer: "[1, 2] [1, 3]"
    hint: "a = a + [2]가 끝나면 a와 b는 더 이상 같은 리스트가 아닙니다."
    explanation: "처음에는 a와 b가 같은 [1]을 가리킵니다. a + [2]는 새 리스트 [1, 2]를 만들어 a에 붙이므로 b는 여전히 옛 [1]입니다. b += [3]은 b가 가리키는 리스트를 제자리에서 늘려 [1, 3]이 됩니다. 리스트의 +=는 extend와 같고, +는 새 리스트를 만듭니다."
    commonMistakes:
      - "+=와 +가 똑같이 새 리스트를 만든다고 생각해 [1, 2] [1, 2, 3]을 적음"
      - "a와 b가 끝까지 같다고 생각함"
    language: python
    verification: run
  - id: ex-day42-predict-tuple
    title: 튜플 안의 리스트에 += 예측하기
    kind: predict
    objective: 오류가 나도 리스트는 이미 바뀐다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      t = ([1],)
      try:
          t[0] += [2]
      except TypeError:
          pass
      print(t)
    answer: "([1, 2],)"
    hint: "t[0] += [2]는 '리스트를 늘리기'와 '결과를 t[0]에 다시 넣기' 두 단계입니다."
    explanation: "+=는 먼저 t[0]이 가리키는 리스트에 extend를 해서 [1, 2]로 바꾼 뒤, 그 결과를 t[0]에 다시 대입하려 합니다. 두 번째 단계에서 튜플이라 TypeError가 나지만, 리스트는 이미 바뀌었습니다. 튜플이 바꿀 수 없다는 것은 '칸이 가리키는 대상을 바꿀 수 없다'는 뜻이지, 안의 리스트까지 얼린다는 뜻이 아닙니다. t[0].append(2)나 t[0].extend([2])로 쓰면 오류 없이 같은 결과입니다."
    commonMistakes:
      - "오류가 났으니 t가 그대로 ([1],)라고 생각함"
      - "튜플 안의 리스트도 바꿀 수 없다고 생각함"
    language: python
    verification: run
  - id: ex-day42-fill
    title: 열쇠마다 새 리스트 만들기 채우기
    kind: fill
    objective: dict.fromkeys 대신 사전 컴프리헨션으로 열쇠마다 다른 리스트를 만든다.
    prompt: '빈칸을 채워 요일마다 따로 된 빈 리스트를 만들고, "{''월'': [''수학''], ''화'': []}"가 출력되게 하세요.'
    starter: |-
      days = ["월", "화"]
      table = {day: _____ for day in days}
      table["월"].append("수학")
      print(table)
    answer: |-
      days = ["월", "화"]
      table = {day: [] for day in days}
      table["월"].append("수학")
      print(table)
    output: "{'월': ['수학'], '화': []}"
    hint: "컴프리헨션의 값 자리는 열쇠마다 한 번씩 새로 계산됩니다."
    explanation: "{day: [] for day in days}는 반복마다 []를 새로 계산해 열쇠마다 다른 리스트를 넣습니다. dict.fromkeys(days, [])는 리스트 하나를 만들어 모든 열쇠에 같은 것을 넣어서, '월'에 넣으면 '화'에도 보입니다. collections.defaultdict(list)도 열쇠마다 새 리스트를 만들어 줍니다."
    commonMistakes:
      - "dict.fromkeys(days, [])를 써서 두 요일이 같은 리스트를 공유함"
      - "값 자리에 list를 써서 리스트가 아니라 list 자료형이 들어감"
    language: python
    verification: run
  - id: ex-day42-modify
    title: 반복문 안 람다가 만들 때의 값을 기억하게 하기
    kind: modify
    objective: 기본값 인자로 반복 변수의 그때 값을 붙잡는다.
    prompt: "이 코드는 세 함수가 모두 마지막 i(2)를 봐서 '[20, 20, 20]'이 됩니다. 각 함수가 만들어질 때의 i를 기억하도록 고쳐 '[0, 10, 20]'이 출력되게 하세요."
    starter: |-
      fs = [lambda: i * 10 for i in range(3)]
      print([f() for f in fs])
    answer: |-
      fs = [lambda i=i: i * 10 for i in range(3)]
      print([f() for f in fs])
    output: "[0, 10, 20]"
    starterOutput: "[20, 20, 20]"
    hint: "함수 안의 i는 '부를 때' 찾아집니다. 기본값은 '만들 때' 계산됩니다."
    explanation: "람다(이름 없는 작은 함수, lambda 인자: 식)는 바깥 변수 i의 값이 아니라 변수 자체를 기억합니다. 호출할 때는 반복이 끝나 i가 2라서 모두 20입니다. lambda i=i:처럼 기본값을 쓰면 만들 때의 값이 각 함수에 따로 저장됩니다. Day 31의 '기본값 인자는 한 번만 계산된다'를 거꾸로 이용한 것입니다. Rust의 클로저는 move로 그때의 값을 가져가게 할 수 있습니다."
    commonMistakes:
      - "range를 list로 바꾸면 해결된다고 생각함"
      - "lambda i: i * 10으로 바꿔 호출할 때 인자가 필요해짐"
    language: python
    verification: run
  - id: ex-day42-debug
    title: 빌린 채로 Vec을 늘리는 오류를 번호로 고치기
    kind: debug
    objective: 참조 대신 인덱스를 들고 있어 빌림 충돌을 없앤다.
    prompt: "이 코드는 E0502(cannot borrow `books` as mutable because it is also borrowed as immutable) 오류로 컴파일되지 않습니다. 첫 책의 참조 대신 번호 0을 기억해 두었다가 push 뒤에 읽도록 고쳐 '모모 2'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut books = vec![String::from("모모")];
          let first = &books[0];
          books.push(String::from("데미안"));
          println!("{first} {}", books.len());
      }
    answer: |-
      fn main() {
          let mut books = vec![String::from("모모")];
          let first = 0;
          books.push(String::from("데미안"));
          println!("{} {}", books[first], books.len());
      }
    output: "모모 2"
    hint: "push는 Vec을 더 큰 공간으로 옮길 수 있습니다. 옮겨지면 옛 주소를 가리키던 참조는 사라진 곳을 가리킵니다. 번호는 옮겨져도 그대로입니다."
    explanation: "참조는 '주소'라서 Vec이 옮겨지면 무효가 되지만, 번호는 '몇 번째'라서 옮겨져도 유효합니다. Rust는 참조의 위험을 컴파일할 때 막고, C는 막지 못합니다(오늘의 C 실습). 다만 번호도 앞의 칸을 지우면 가리키는 대상이 바뀌므로, 지우기가 있는 목록에는 바뀌지 않는 id가 더 안전합니다."
    commonMistakes:
      - "books[0].clone()으로 복사해 해결은 되지만, 나중에 원본을 바꿔도 반영되지 않음"
      - "let first = &books[0];을 push 뒤로 옮기지 않고 mut만 붙임"
    language: rust
    verification: run
  - id: ex-day42-independent
    title: C로 문자열 목록 깊은 복사하기
    kind: independent
    objective: 포인터 배열과 문자열을 모두 힙에 새로 만들고, 짝이 되는 해제 함수를 만든다.
    prompt: "char **copy_names(char *const src[], int n)으로 문자열 목록을 깊이 복사하고, void free_copy(char **names, int n)으로 해제하세요. 복사본의 첫 글자를 'b'로 바꿔 'orig cat / copy bat'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          char a[] = "cat";
          char b[] = "dog";
          char *orig[] = {a, b};
          printf("%s %s\n", orig[0], orig[1]);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      char **copy_names(char *const src[], int n) {
          char **out = malloc((size_t)n * sizeof *out);
          if (out == NULL) {
              return NULL;
          }
          for (int i = 0; i < n; i++) {
              out[i] = malloc(strlen(src[i]) + 1);
              if (out[i] == NULL) {
                  for (int j = 0; j < i; j++) {
                      free(out[j]);
                  }
                  free(out);
                  return NULL;
              }
              strcpy(out[i], src[i]);
          }
          return out;
      }

      void free_copy(char **names, int n) {
          for (int i = 0; i < n; i++) {
              free(names[i]);
          }
          free(names);
      }

      int main(void) {
          char a[] = "cat";
          char b[] = "dog";
          char *orig[] = {a, b};
          char **copy = copy_names(orig, 2);
          if (copy == NULL) {
              return 1;
          }
          copy[0][0] = 'b';
          printf("orig %s / copy %s\n", orig[0], copy[0]);
          free_copy(copy, 2);
          return 0;
      }
    output: "orig cat / copy bat"
    hint: "두 단계로 받습니다. 먼저 포인터 n개를 담을 배열, 다음에 문자열마다 strlen + 1바이트입니다. 중간에 실패하면 이미 받은 것을 모두 돌려주세요."
    explanation: "깊은 복사는 받는 곳이 n + 1군데라 해제도 n + 1번입니다. 문자열을 먼저, 포인터 배열을 마지막에 해제해야 합니다(Day 41의 '자식 먼저'). 중간 실패 처리를 빼먹으면 누수가 생깁니다. Rust에서는 names.clone() 한 줄이 이 모든 일을 하고, 해제도 자동입니다. Python에서는 copy.deepcopy(names)이지만, 문자열은 바꿀 수 없어서 list(names)로 충분합니다."
    commonMistakes:
      - "포인터 배열만 복사해(얕은 복사) 복사본을 바꾸면 원본도 바뀜"
      - "free(names)를 먼저 해서 names[i]를 읽는 것이 해제 후 사용이 됨"
    language: c
    verification: run
quiz:
  - id: quiz-day42-01
    question: Python 함수 안에서 xs = [0]과 xs.append(0)의 차이는?
    choices:
      - 둘 다 부른 쪽의 리스트를 바꾼다
      - xs = [0]은 함수 안의 이름만 새 리스트에 붙이고, xs.append(0)은 부른 쪽과 같은 리스트를 바꾼다
      - 둘 다 아무것도 바꾸지 않는다
      - xs = [0]만 부른 쪽을 바꾼다
    answerIndex: 1
    explanation: 인자는 객체의 참조를 넘깁니다. 이름에 새 값을 대입하는 것은 그 이름표를 옮기는 일이라 부른 쪽에 영향이 없고, 객체의 메서드로 내용을 바꾸면 같은 객체를 보는 모든 이름에 보입니다.
  - id: quiz-day42-02
    question: dict.fromkeys(["a", "b"], [])의 문제는?
    choices:
      - 오류가 난다
      - 두 열쇠가 같은 리스트 하나를 공유한다
      - 열쇠 순서가 바뀐다
      - 값이 None이 된다
    answerIndex: 1
    explanation: "값 자리의 []는 한 번만 계산되고, 그 리스트가 모든 열쇠에 들어갑니다. 열쇠마다 새 리스트가 필요하면 {k: [] for k in keys}나 defaultdict(list)를 쓰세요. 값이 0이나 문자열처럼 바꿀 수 없는 것이면 공유해도 문제없습니다."
  - id: quiz-day42-03
    question: C에서 포인터 배열을 memcpy로 얕게 복사한 뒤 원본과 복사본을 모두 free하면?
    choices:
      - 안전하다
      - 같은 문자열을 두 번 해제하게 된다(정의되지 않은 동작)
      - 복사본만 해제된다
      - 컴파일 오류다
    answerIndex: 1
    explanation: 얕은 복사본은 같은 문자열을 가리키는 주소만 가집니다. 문자열의 주인은 하나라서 한쪽만 해제해야 합니다. 누가 주인인지 주석으로 남기거나, 깊은 복사로 각자 주인이 되게 하세요.
  - id: quiz-day42-04
    question: Rust에서 let b = a.clone();과 let b = Rc::clone(&a);(a가 Rc)의 차이는?
    choices:
      - 같다
      - a.clone()은 값을 통째로 새로 만들고, Rc::clone은 개수만 늘려 같은 값을 공유한다
      - Rc::clone은 이동이다
      - a.clone()은 빌림이다
    answerIndex: 1
    explanation: Vec이나 String의 clone은 힙 내용까지 새로 복사합니다. Rc::clone은 공유 개수를 1 늘리고 같은 값을 가리키는 새 Rc를 줍니다. 마지막 Rc가 사라질 때 값이 해제됩니다. 둘 다 .clone()으로 쓸 수 있지만 Rc::clone(&a)로 쓰면 '공유'라는 뜻이 잘 보입니다.
  - id: quiz-day42-05
    question: 목록의 다른 칸을 가리키는 방법 중, 목록이 늘어나 옮겨져도 안전하고 앞 칸을 지워도 가리키는 대상이 바뀌지 않는 것은?
    choices:
      - 칸의 주소(포인터·참조)
      - 리스트 번호(인덱스)
      - 바뀌지 않는 id와 id → 값 사전
      - 모두 같다
    answerIndex: 2
    explanation: 주소는 목록이 옮겨지면 무효가 되고, 인덱스는 앞 칸을 지우면 당겨집니다. 한 번 정한 id를 사전의 열쇠로 쓰면 둘 다 문제가 없습니다. 대신 사전을 한 번 더 찾아야 하고, 지운 id를 쓰면 '없음'을 처리해야 합니다.
---

## 1. 오늘 배울 내용

Day 29부터 Day 41까지 포인터, 참조, 빌림, 별칭과 복사, 소유권, 수명, 배열 매개변수, 문자열, 동적 할당, `Box`를 배웠습니다. 오늘은 이 내용을 **하나의 질문**으로 정리합니다.

> 이 줄을 실행하면 **무엇이 복사되고**, **무엇이 공유되는가**?

1. **Python**: 공유가 숨어 있는 다섯 가지 코드
   - 함수 안에서 이름 바꾸기와 내용 바꾸기
   - `a = a + [x]`와 `a += [x]`
   - 튜플 안의 리스트와 "반쯤 실패하는" `+=`
   - `dict.fromkeys`가 만드는 공유 리스트
   - 반복문 안에서 만든 람다가 변수를 늦게 읽는 문제
2. **C**: 값 복사, 얕은 복사, 깊은 복사를 만들고 **누가 `free`하는지** 정리합니다.
3. **Rust**: Copy, 이동, `clone`, 빌림, `Box`, `Rc`가 각각 무엇을 복사하는지 한 프로그램에서 봅니다.
4. 도서관 대출 기록을 세 가지 방법으로 가리켜 봅니다.
   - 리스트 번호(인덱스)
   - 바뀌지 않는 id
   - 객체 참조

## 2. 왜 필요한가

메모리 버그는 대부분 "같은 것이라고 생각했는데 복사본이었다" 또는 "복사본이라고 생각했는데 같은 것이었다"에서 생깁니다.

- 되돌리기 기록에 같은 리스트를 계속 넣어 모든 기록이 마지막 상태가 됩니다(Day 31).
- 요일별 시간표를 만들었는데 월요일에 넣은 과목이 모든 요일에 보입니다.
- 버튼마다 다른 번호를 출력하게 했는데 모두 마지막 번호를 출력합니다.
- C에서 복사본을 해제했더니 원본이 망가집니다.
- 목록에서 책을 지웠더니 다른 사람의 대출 기록이 엉뚱한 책을 가리킵니다.

세 언어의 규칙을 나란히 놓고 보면, 어느 언어로 쓰든 이런 버그를 미리 알아볼 수 있습니다.

## 3. 그림으로 이해하기

**복사의 세 단계.** 문자열 목록 `["cat", "dog"]`을 복사하는 세 방법입니다.

```text
값 복사가 아닌 "이름만 하나 더"(별칭)
orig ──┐
       ▼
     [ ● , ● ]──▶ "cat", "dog"
alias ─┘

얕은 복사: 바깥 목록만 새로, 안의 문자열은 공유
orig    [ ● , ● ]──┐
                   ├──▶ "cat", "dog"
shallow [ ● , ● ]──┘

깊은 복사: 안의 문자열까지 새로
orig [ ● , ● ]──▶ "cat", "dog"
deep [ ● , ● ]──▶ "cat", "dog"   (다른 곳)
```

**Python의 `a = a + [2]`와 `a += [2]`.**

```text
a = a + [2]                          a += [2]
전:  a ─┐                             전:  a ─┐
        ├─▶ [1]                               ├─▶ [1]
     b ─┘                                  b ─┘
후:  a ───▶ [1, 2]  (새 리스트)        후:  a ─┐
     b ───▶ [1]                               ├─▶ [1, 2]  (같은 리스트가 늘어남)
                                           b ─┘
```

**가리키는 방법 세 가지.** 대출 기록이 책을 가리키는 방법입니다.

```text
주소(참조):  민지 ──▶ [책 칸]          목록이 옮겨지면 무효(C), 빌린 동안 목록을 못 바꿈(Rust)
인덱스:      민지 = 2   books[2]        앞 칸을 지우면 다른 책을 가리키게 됨
id:          민지 = 3   catalog[3]      옮겨도, 지워도 그대로(없어진 책은 '없음'으로 처리)
```

## 4. 천천히 풀어보기

### 4.1 Python: 새로 만드는가, 바꾸는가

| 코드                             | 새 객체를 만드나   | 같은 객체를 보던 다른 이름에 보이나 |
| -------------------------------- | ------------------ | ----------------------------------- |
| `x = 값`                         | 이름표만 옮김      | 아니요                              |
| `xs.append(v)`, `xs[i] = v`      | 아니요(제자리)     | 예                                  |
| `xs = xs + [v]`                  | 예                 | 아니요                              |
| `xs += [v]`(리스트)              | 아니요(제자리)     | 예                                  |
| `s += "a"`(문자열, 정수)         | 예(바꿀 수 없어서) | 아니요                              |
| `list(xs)`, `xs[:]`, `xs.copy()` | 바깥만 새로        | 안쪽 객체는 공유                    |
| `copy.deepcopy(xs)`              | 안쪽까지 새로      | 아니요                              |

같은 `+=`라도 리스트는 제자리, 문자열·정수·튜플은 새 객체입니다. 바꿀 수 있는 자료형인지가 기준입니다.

### 4.2 Python: 공유가 숨어 있는 곳

- **튜플 안의 리스트**: 튜플은 "칸이 무엇을 가리키는지"를 바꿀 수 없을 뿐, 칸이 가리키는 리스트는 바꿀 수 있습니다. `t[1] += [5]`는 리스트를 먼저 늘리고 튜플 칸 대입에서 실패합니다.
- **`dict.fromkeys(keys, [])`**: 값 `[]`는 한 번만 만들어져 모든 열쇠가 공유합니다.
- **반복문 안의 람다**: 함수는 바깥 변수의 **값**이 아니라 **변수 자체**를 기억하고, 부를 때 그 변수를 읽습니다(늦은 바인딩).

### 4.3 C: 복사와 해제 책임

| 복사 종류 | 만드는 법                             | 해제 책임                                   |
| --------- | ------------------------------------- | ------------------------------------------- |
| 값 복사   | `int b = a;`, 구조체 대입             | 없음(스택)                                  |
| 별칭      | `char **alias = orig;`                | 원래 주인만                                 |
| 얕은 복사 | `memcpy(shallow, orig, sizeof orig);` | 문자열의 주인은 여전히 `orig`(한 번만 해제) |
| 깊은 복사 | 문자열마다 `malloc` + `strcpy`        | 복사본도 주인(각자 해제)                    |

C 코드에서 포인터를 복사할 때마다 "이것은 주인인가, 빌린 것인가"를 스스로 물어야 합니다.

### 4.4 Rust: 무엇이 복사되는가

| 연산                        | 복사되는 것                | 원래 값                 |
| --------------------------- | -------------------------- | ----------------------- |
| `let m = n;`(`i32` 등 Copy) | 값 전체                    | 계속 씀                 |
| `let moved = names;`(Vec)   | 주소·길이·용량(24바이트)   | 쓸 수 없음              |
| `names.clone()`             | 힙 내용까지 모두           | 계속 씀                 |
| `&names`                    | 주소(와 길이)              | 계속 씀(빌린 동안 규칙) |
| `Box` 이동                  | 주소(8바이트)              | 쓸 수 없음              |
| `Rc::clone(&shared)`        | 주소, 그리고 공유 개수 + 1 | 계속 씀(같은 값 공유)   |

## 5. Python으로 구현하기

```python
# 파일: memory_traps.py
print("1) 이름 바꾸기와 내용 바꾸기")


def rebind(xs):
    xs = [0]                                # 함수 안의 이름만 새 리스트를 가리킨다


def mutate(xs):
    xs.append(0)                            # 부른 쪽과 같은 리스트를 바꾼다


a = [1]
rebind(a)
mutate(a)
print("  a =", a)

print("2) a = a + [x] 와 a += [x]")
a = [1]
b = a
a = a + [2]                                 # 새 리스트를 만들어 a에 붙인다
print("  + 뒤: a", a, "b", b)
a = [1]
b = a
a += [2]                                    # 같은 리스트를 제자리에서 늘린다
print("  += 뒤: a", a, "b", b)

print("3) 튜플 안의 리스트")
t = (1, [2, 3])
t[1].append(4)                              # 튜플은 못 바꿔도, 안의 리스트는 바뀐다
print("  t =", t)
try:
    t[1] += [5]                             # 리스트는 늘어나지만 튜플 칸 대입에서 오류
except TypeError as e:
    print("  TypeError:", e)
print("  오류 뒤 t =", t)

print("4) 한 리스트를 여러 열쇠가 공유")
shared = dict.fromkeys(["월", "화"], [])     # 두 열쇠가 같은 빈 리스트를 가리킨다
shared["월"].append("수학")
print("  fromkeys:", shared)
separate = {day: [] for day in ["월", "화"]}   # 열쇠마다 새 리스트
separate["월"].append("수학")
print("  컴프리헨션:", separate)

print("5) 반복문 안에서 만든 함수")
late = [lambda: i for i in range(3)]        # 모두 같은 변수 i를 본다
early = [lambda i=i: i for i in range(3)]   # 만들 때의 값을 기본값으로 붙잡는다
print("  late", [f() for f in late], "early", [f() for f in early])
```

실행 결과:

```text
1) 이름 바꾸기와 내용 바꾸기
  a = [1, 0]
2) a = a + [x] 와 a += [x]
  + 뒤: a [1, 2] b [1]
  += 뒤: a [1, 2] b [1, 2]
3) 튜플 안의 리스트
  t = (1, [2, 3, 4])
  TypeError: 'tuple' object does not support item assignment
  오류 뒤 t = (1, [2, 3, 4, 5])
4) 한 리스트를 여러 열쇠가 공유
  fromkeys: {'월': ['수학'], '화': ['수학']}
  컴프리헨션: {'월': ['수학'], '화': []}
5) 반복문 안에서 만든 함수
  late [2, 2, 2] early [0, 1, 2]
```

### 코드 한 부분씩 읽기

| 코드                              | 설명                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `xs = [0]` / `xs.append(0)`       | `rebind`는 함수 안의 이름표만 옮겨서 `a`에 영향이 없고, `mutate`는 같은 리스트를 바꿔 `a`가 `[1, 0]`이 됐습니다.                       |
| `a = a + [2]` / `a += [2]`        | 앞의 것은 새 리스트라 `b`가 `[1]`로 남고, 뒤의 것은 제자리라 `b`도 `[1, 2]`입니다.                                                     |
| `t[1].append(4)`                  | 튜플의 칸은 그대로 같은 리스트를 가리키므로 허용됩니다.                                                                                |
| `t[1] += [5]` → `TypeError`       | 리스트는 `[2, 3, 4, 5]`로 늘어난 **뒤에** 튜플 칸 대입에서 실패합니다. "오류가 났는데 값이 바뀌어 있는" 드문 경우입니다.               |
| `dict.fromkeys(["월", "화"], [])` | 두 열쇠가 같은 리스트 하나를 가리킵니다.                                                                                               |
| `{day: [] for day in ...}`        | 반복마다 `[]`를 새로 만들어 열쇠마다 다른 리스트입니다.                                                                                |
| `lambda: i` / `lambda i=i: i`     | `lambda 인자: 식`은 이름 없는 작은 함수입니다. 앞의 것은 부를 때 `i`를 읽어 모두 2이고, 뒤의 것은 만들 때의 `i`를 기본값에 저장합니다. |

## 6. C로 구현하기

```c
// 파일: copy_depth.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define N 3

char *dup_string(const char *s) {           // 힙 복사본: 부른 쪽이 free
    char *p = malloc(strlen(s) + 1);
    if (p != NULL) {
        strcpy(p, s);
    }
    return p;
}

void free_names(char *names[], int n) {
    for (int i = 0; i < n; i++) {
        free(names[i]);
        names[i] = NULL;
    }
}

void print_names(const char *label, char *const names[], int n) {
    printf("%s:", label);
    for (int i = 0; i < n; i++) {
        printf(" %s", names[i]);
    }
    printf("\n");
}

int main(void) {
    char *orig[N];
    const char *init[N] = {"cat", "dog", "owl"};
    for (int i = 0; i < N; i++) {
        orig[i] = dup_string(init[i]);
        if (orig[i] == NULL) {
            free_names(orig, i);
            return 1;
        }
    }

    char *shallow[N];
    memcpy(shallow, orig, sizeof orig);     // 주소 세 개만 복사: 같은 문자열을 가리킨다

    char *deep[N];
    for (int i = 0; i < N; i++) {
        deep[i] = dup_string(orig[i]);      // 문자열까지 새로 복사
        if (deep[i] == NULL) {
            free_names(deep, i);
            free_names(orig, N);
            return 1;
        }
    }

    shallow[0][0] = 'b';                    // orig[0]과 같은 문자열을 바꾼다
    deep[1][0] = 'f';                       // 자기 복사본만 바뀐다
    print_names("orig   ", orig, N);
    print_names("shallow", shallow, N);
    print_names("deep   ", deep, N);

    int a = 5;
    int b = a;                              // 값 복사: 서로 독립
    b++;
    printf("int 복사: a %d, b %d\n", a, b);

    free_names(deep, N);                    // deep은 자기 문자열의 주인
    free_names(orig, N);                    // orig도 주인
    // shallow는 주인이 아니다: free하면 두 번 해제가 된다
    printf("해제 완료\n");
    return 0;
}
```

실행 결과:

```text
orig   : bat dog owl
shallow: bat dog owl
deep   : cat fog owl
int 복사: a 5, b 6
해제 완료
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `orig[i] = dup_string(init[i]);`            | 문자열마다 힙에 복사본을 만들어 `orig`가 주인이 됩니다. 실패하면 이미 만든 `i`개만 해제하고 끝냅니다. |
| `memcpy(shallow, orig, sizeof orig);`       | 포인터 세 개(24바이트)만 복사했습니다. `shallow[0]`과 `orig[0]`은 같은 문자열입니다.                  |
| `deep[i] = dup_string(orig[i]);`            | 문자열까지 새로 만들어 `deep`도 주인입니다.                                                           |
| `shallow[0][0] = 'b';`                      | `orig[0]`도 `"bat"`이 됐습니다. 얕은 복사로는 원본을 보호할 수 없습니다.                              |
| `deep[1][0] = 'f';`                         | 복사본만 `"fog"`가 되고 원본의 `"dog"`는 그대로입니다.                                                |
| `char *const names[]`                       | "포인터들은 바꾸지 않겠다"는 약속입니다. 읽기만 하는 `print_names`에 알맞습니다.                      |
| `free_names(deep, N); free_names(orig, N);` | 주인만 해제합니다. `shallow`까지 해제하면 `orig`의 문자열을 두 번 해제하게 됩니다.                    |

## 7. Rust로 구현하기

```rust
// 파일: what_is_copied.rs
use std::rc::Rc;

fn main() {
    let n = 5;
    let mut m = n;                          // i32는 Copy: 값 복사
    m += 1;
    println!("Copy: n {n}, m {m}");

    let names = vec![String::from("cat"), String::from("dog")];
    let moved = names;                      // 이동: (주소, 길이, 용량)만 복사, names는 끝
    println!("이동: {moved:?}");

    let mut deep = moved.clone();           // clone: 문자열까지 모두 새로
    deep[0].replace_range(0..1, "b");
    println!("clone: 원본 {moved:?}, 복사본 {deep:?}");

    let view = &deep;                       // 빌림: 주소만, 주인은 그대로
    println!("빌림: {} 개, 첫째 {}", view.len(), view[0]);

    let boxed = Box::new(deep);             // Box: Vec 자체를 힙으로(주소 하나)
    let owner = boxed;                      // Box 이동: 8바이트만 복사
    println!("Box 안 {:?}", *owner);

    let shared = Rc::new(String::from("owl"));
    let other = Rc::clone(&shared);         // Rc: 개수만 늘리고 같은 문자열을 공유
    println!("Rc: {shared} {other}, 공유하는 수 {}", Rc::strong_count(&shared));
    drop(other);
    println!("하나를 버린 뒤 공유하는 수 {}", Rc::strong_count(&shared));
}
```

실행 결과:

```text
Copy: n 5, m 6
이동: ["cat", "dog"]
clone: 원본 ["cat", "dog"], 복사본 ["bat", "dog"]
빌림: 2 개, 첫째 bat
Box 안 ["bat", "dog"]
Rc: owl owl, 공유하는 수 2
하나를 버린 뒤 공유하는 수 1
```

### 코드 한 부분씩 읽기

| 코드                                    | 설명                                                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let mut m = n; m += 1;`                | `i32`는 Copy라 값이 복사되어 `n`은 그대로 5입니다.                                                                                                                        |
| `let moved = names;`                    | 이동입니다. 이후 `names`를 쓰면 E0382입니다. 힙의 문자열은 복사되지 않았습니다.                                                                                           |
| `moved.clone()`                         | Vec과 그 안의 String까지 모두 새로 만듭니다. C의 깊은 복사를 한 줄로 한 것입니다.                                                                                         |
| `let view = &deep;`                     | 빌림입니다. `view`가 살아 있는 동안에는 `deep`을 바꿀 수 없습니다(Day 33).                                                                                                |
| `Box::new(deep)` / `let owner = boxed;` | Vec 자체(24바이트)를 힙으로 옮기고, 이후 이동은 8바이트 주소만 복사합니다(Day 41).                                                                                        |
| `Rc::clone(&shared)`                    | 같은 문자열을 두 `Rc`가 공유합니다. `strong_count`로 개수를 확인할 수 있고, 마지막 `Rc`가 사라질 때 해제됩니다. C의 얕은 복사를 **해제 책임까지 안전하게** 만든 것입니다. |

## 8. 실행 추적

C 예제의 세 목록이 가리키는 문자열을 표로 그려 봅니다. 주소 대신 문자열 이름표(S1~S6)로 표시합니다.

| 단계                  | `orig`     | `shallow`       | `deep`     | 문자열의 내용          |
| --------------------- | ---------- | --------------- | ---------- | ---------------------- |
| `orig` 만들기         | S1, S2, S3 | -               | -          | S1 cat, S2 dog, S3 owl |
| `memcpy`              | S1, S2, S3 | S1, S2, S3      | -          |                        |
| 깊은 복사             | S1, S2, S3 | S1, S2, S3      | S4, S5, S6 | S4 cat, S5 dog, S6 owl |
| `shallow[0][0] = 'b'` |            |                 |            | **S1 bat**             |
| `deep[1][0] = 'f'`    |            |                 |            | **S5 fog**             |
| 해제                  | S1~S3 해제 | (해제하지 않음) | S4~S6 해제 |                        |

여섯 문자열을 각각 정확히 한 번씩 해제했습니다. 주인이 누구인지 표로 그려 보면 해제 코드가 맞는지 확인할 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**대출 기록이 책을 가리키는 세 가지 방법.** 민지가 빌린 책을 기록해 두고, 그 뒤에 책 목록이 바뀌어도 기록이 맞는지 봅니다.

```python
# 파일: library_ids.py
print("1) 리스트 번호로 가리키기")
books = ["모모", "어린 왕자", "데미안"]
loan = 2                                    # 민지가 빌린 책: 2번 칸
print("  민지:", books[loan])
del books[0]                                # 앞의 책을 지우면 번호가 하나씩 당겨진다
try:
    print("  지운 뒤 민지:", books[loan])
except IndexError as e:
    print("  지운 뒤 민지: IndexError:", e)

print("2) 바뀌지 않는 번호(id)로 가리키기")
catalog = {}
next_id = 1


def add_book(title):
    global next_id
    book_id = next_id
    catalog[book_id] = title
    next_id += 1
    return book_id


ids = [add_book(t) for t in ["모모", "어린 왕자", "데미안"]]
loans = {"민지": ids[2], "준호": ids[0]}
del catalog[ids[1]]                         # 가운데 책을 지워도
add_book("해리 포터")                        # 새 책을 더해도
for name, book_id in loans.items():         # 다른 번호는 그대로다
    print(f"  {name}: {book_id}번 {catalog[book_id]}")
print("  남은 책:", catalog)

print("3) 객체 참조로 가리키기")
shelf = [{"title": "모모", "out": False}, {"title": "데미안", "out": False}]
minji = shelf[1]                            # 같은 사전을 가리킨다
minji["out"] = True
shelf.insert(0, {"title": "어린 왕자", "out": False})
print("  민지의 책:", minji["title"], "대출 중" if shelf[2]["out"] else "대출 가능")
```

실행 결과:

```text
1) 리스트 번호로 가리키기
  민지: 데미안
  지운 뒤 민지: IndexError: list index out of range
2) 바뀌지 않는 번호(id)로 가리키기
  민지: 3번 데미안
  준호: 1번 모모
  남은 책: {1: '모모', 3: '데미안', 4: '해리 포터'}
3) 객체 참조로 가리키기
  민지의 책: 데미안 대출 중
```

| 방법           | 결과                                               | 이유                                                                                              |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 리스트 번호    | 앞의 책을 지우자 2번 칸이 없어져 `IndexError`      | 운이 나쁘면 오류 대신 **다른 책**을 가리킵니다. 오류가 나는 편이 오히려 낫습니다.                 |
| 바뀌지 않는 id | 지우고 더해도 민지(3번), 준호(1번)가 그대로        | id는 한 번 정하면 바뀌지 않고, 사전이 id로 책을 찾습니다. 지운 id는 다시 쓰지 않습니다.           |
| 객체 참조      | 앞에 책을 끼워 넣어도 `minji`는 같은 사전을 가리킴 | Python은 객체가 옮겨지지 않아 참조가 안전합니다. 대신 누가 무엇을 공유하는지 눈에 잘 안 보입니다. |

Rust에서 같은 일을 하면 **참조 방법은 빌림 규칙에 막힙니다**. 대출 기록이 책을 빌리고 있는 동안 목록을 바꿀 수 없기 때문입니다. 그래서 id 방법이 자연스럽습니다.

```rust
// 파일: library_ids.rs
use std::collections::BTreeMap;

struct Library {
    catalog: BTreeMap<u32, String>,         // 번호 순서로 정렬되어 출력이 항상 같다
    next_id: u32,
}

impl Library {
    fn add(&mut self, title: &str) -> u32 {
        let id = self.next_id;
        self.catalog.insert(id, title.to_string());
        self.next_id += 1;
        id
    }

    fn title(&self, id: u32) -> &str {
        self.catalog.get(&id).map(|s| s.as_str()).unwrap_or("(없는 책)")
    }
}

fn main() {
    let mut lib = Library { catalog: BTreeMap::new(), next_id: 1 };
    let ids: Vec<u32> = ["모모", "어린 왕자", "데미안"].iter().map(|t| lib.add(t)).collect();
    let loans = [("민지", ids[2]), ("준호", ids[0]), ("서연", ids[1])];

    lib.catalog.remove(&ids[1]);            // 번호를 들고 있을 뿐 빌리고 있지 않아서
    lib.add("해리 포터");                   // 목록을 자유롭게 바꿀 수 있다
    for (name, id) in loans {
        println!("{name}: {id}번 {}", lib.title(id));
    }
    println!("남은 책: {:?}", lib.catalog);
}
```

실행 결과:

```text
민지: 3번 데미안
준호: 1번 모모
서연: 2번 (없는 책)
남은 책: {1: "모모", 3: "데미안", 4: "해리 포터"}
```

- `BTreeMap`은 열쇠 순서로 정렬된 사전이라 출력 순서가 항상 같습니다. `HashMap`은 실행마다 순서가 다를 수 있습니다(Day 69).
- `loans`는 번호(`u32`)만 가지고 `lib`를 빌리지 않아서, 그 사이에 `remove`와 `add`를 자유롭게 할 수 있습니다.
- 지운 책의 id(2번)로 찾으면 `get`이 `None`을 돌려주고 "(없는 책)"으로 처리했습니다. id 방식에서는 "없음"을 항상 처리해야 합니다.

C에서는 참조 방법이 **컴파일은 되지만 위험합니다**. 책 배열이 `realloc`으로 옮겨지면 옛 주소를 들고 있던 포인터가 무효가 되기 때문입니다.

```c
// 파일: library_ids.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TITLE_MAX 32

typedef struct {
    char (*titles)[TITLE_MAX];              // 제목 칸들의 배열(힙)
    int len;
    int cap;
} Shelf;

int add_book(Shelf *s, const char *title) { // 새 책의 번호를 돌려준다. 실패하면 -1
    if (s->len == s->cap) {
        int new_cap = s->cap == 0 ? 2 : s->cap * 2;
        char (*p)[TITLE_MAX] = realloc(s->titles, (size_t)new_cap * sizeof *p);
        if (p == NULL) {
            return -1;
        }
        s->titles = p;                      // 옮겨졌을 수 있다: 옛 주소를 들고 있던 포인터는 모두 무효
        s->cap = new_cap;
    }
    snprintf(s->titles[s->len], TITLE_MAX, "%s", title);
    return s->len++;
}

int main(void) {
    Shelf s = {NULL, 0, 0};
    int momo = add_book(&s, "Momo");
    int demian = add_book(&s, "Demian");
    if (momo < 0 || demian < 0) {
        free(s.titles);
        return 1;
    }
    // const char *p = s.titles[demian];  ← 이렇게 주소를 들고 있으면 아래 realloc 뒤 위험하다
    const char *more[] = {"Little Prince", "Harry Potter", "Matilda"};
    for (int i = 0; i < 3; i++) {
        if (add_book(&s, more[i]) < 0) {
            free(s.titles);
            return 1;
        }
    }
    printf("책 %d권, 용량 %d\n", s.len, s.cap);
    printf("번호로 다시 찾기: %d번 %s, %d번 %s\n", momo, s.titles[momo], demian, s.titles[demian]);
    free(s.titles);
    return 0;
}
```

실행 결과:

```text
책 5권, 용량 8
번호로 다시 찾기: 0번 Momo, 1번 Demian
```

- `char (*titles)[TITLE_MAX]`는 "32바이트짜리 제목 칸들의 배열을 가리키는 포인터"입니다. `titles[i]`가 `i`번 제목 칸입니다. 2차원 배열 매개변수(Day 34)와 같은 모양을 힙에 만든 것입니다.
- 책이 2권 → 4권 → 8권으로 늘면서 `realloc`이 두 번 일어났습니다. 그때마다 배열이 옮겨졌을 수 있습니다.
- 주석으로 막아 둔 `const char *p = s.titles[demian];`처럼 주소를 들고 있었다면, 이후 `p`는 해제된 곳을 가리켰을 수 있습니다. 컴파일러는 알려 주지 않습니다. 번호 `demian`은 옮겨진 뒤에도 `s.titles[demian]`으로 올바른 칸을 찾습니다.
- 제목을 영문으로 쓴 이유는 C의 `%s`와 폭 계산이 바이트 단위라서입니다(Day 37). 한글 제목도 저장은 됩니다.

## 10. 무엇이 복사되는가 — 세 언어 총정리

| 코드가 하는 일 | Python                             | C                               | Rust                                   |
| -------------- | ---------------------------------- | ------------------------------- | -------------------------------------- |
| 작은 값 대입   | 이름표만(정수는 바꿀 수 없어 안전) | 값 복사                         | Copy(값 복사)                          |
| 목록 대입      | 이름표만(별칭)                     | 배열은 대입 불가, 포인터는 별칭 | 이동(원래 이름은 끝)                   |
| 함수 인자      | 참조 전달(내용 바꾸면 보임)        | 값 복사(배열은 주소)            | 이동, 또는 `&`/`&mut` 빌림             |
| 바깥만 복사    | `list(xs)`, `xs[:]`                | `memcpy` 포인터 배열            | (드묾) `Rc`를 담은 Vec의 clone         |
| 안쪽까지 복사  | `copy.deepcopy`                    | 칸마다 `malloc` + 복사          | `clone()`                              |
| 여럿이 공유    | 기본                               | 포인터 복사(해제 책임은 약속)   | `Rc<T>`(`Rc<RefCell<T>>`로 바꾸기까지) |
| 해제           | 자동                               | 주인이 정확히 한 번             | 자동(주인이 사라질 때)                 |

## 11. 세 언어 비교

| 관점                           | Python                     | C                                             | Rust                                  |
| ------------------------------ | -------------------------- | --------------------------------------------- | ------------------------------------- |
| 기본 동작                      | 공유(참조)                 | 복사(값), 배열·포인터는 주소                  | 이동                                  |
| 공유가 드러나는가              | 잘 안 드러남               | 포인터 자료형으로 드러나지만 주인은 안 드러남 | 자료형으로 드러남(`&`, `Rc`)          |
| 공유 중 변경 검사              | 없음                       | 없음                                          | 컴파일할 때(빌림), 실행 중(`RefCell`) |
| 목록이 옮겨질 때 참조          | 안전(객체는 옮겨지지 않음) | 무효(댕글링)                                  | 빌린 동안 옮길 수 없음(E0502)         |
| 다른 칸을 가리키는 안전한 방법 | 참조 또는 id               | 번호 또는 id                                  | 번호 또는 id                          |

## 12. 자주 하는 실수

### 실수 1: 튜플이니 안전하다고 믿는다 (Python)

실습의 예측 문제입니다. 튜플 안에 리스트나 사전이 있으면 그 내용은 바뀔 수 있습니다. 정말 바뀌면 안 되는 데이터는 안쪽까지 튜플(또는 `frozenset`)로 만드세요.

### 실수 2: dict.fromkeys나 [[]] * n으로 빈 목록을 여러 개 만든다 (Python)

값 하나를 모든 칸이 공유합니다. 컴프리헨션으로 칸마다 새로 만드세요(실습의 빈칸 문제).

### 실수 3: 반복문 안 람다가 그때의 값을 기억한다고 생각한다 (Python)

람다는 변수를 기억하고 부를 때 읽습니다. `lambda i=i: ...`로 그때의 값을 붙잡거나, `functools.partial`을 쓰세요.

### 실수 4: 빌린 채로 목록을 늘린다 (Rust)

```rust
// 파일: ref_then_push.rs (컴파일 오류: E0502)
fn main() {
    let mut books = vec![String::from("모모")];
    let first = &books[0];
    books.push(String::from("데미안"));
    println!("{first} {}", books.len());
}
```

실습의 디버그 문제입니다. 참조 대신 번호를 기억하거나, 참조를 다 쓴 뒤에 `push`하세요.

### 실수 5: 얕은 복사본까지 해제한다 (C)

얕은 복사본은 주인이 아닙니다. 해제 코드를 쓰기 전에 8절처럼 "이 문자열의 주인은 누구인가"를 표로 확인하세요. Rust의 `Rc`는 이 판단을 개수 세기로 대신합니다.

## 13. Q&A

**Q. Python은 왜 기본이 공유인가요?**

A. 모든 값이 객체이고 변수는 이름표라, 대입할 때마다 복사하면 큰 리스트를 다루는 코드가 매우 느려집니다. 대신 바꿀 수 없는 자료형(정수, 문자열, 튜플)을 많이 써서 공유해도 대부분 안전하게 했습니다. 문제는 바꿀 수 있는 자료형(리스트, 사전, 집합)을 공유할 때 생깁니다.

**Q. Rust의 Rc를 쓰면 Python처럼 편하게 공유할 수 있나요?**

A. `Rc<T>`는 읽기 공유만 됩니다. 함께 바꾸려면 `Rc<RefCell<T>>`로 감싸고 `borrow_mut()`로 빌려야 하며, 규칙을 어기면 실행 중에 패닉입니다(Day 31). 번거로운 만큼 "여기서 공유하며 바꾼다"는 사실이 코드에 드러납니다. 실무에서는 오늘처럼 id나 번호로 가리키는 방식이 더 자주 쓰입니다.

**Q. 인덱스와 id 중 무엇을 써야 하나요?**

A. 목록에서 **지우기가 없다면** 인덱스가 가장 빠르고 간단합니다(그래프의 정점 번호, Day 79). 지우기가 있다면 id와 사전을 쓰거나, 지운 칸을 비워 두고 재사용하지 않는 방식을 씁니다.

**Q. C에서 누가 주인인지 헷갈리지 않는 방법이 있나요?**

A. 관례를 정하고 지키는 것이 가장 중요합니다. "만든 함수의 짝이 되는 해제 함수를 만든다", "`const` 포인터는 빌린 것", "구조체가 가진 포인터는 그 구조체가 주인" 같은 규칙을 팀에서 정합니다. 주소 검사기(`-fsanitize=address`)로 테스트하면 규칙을 어긴 곳을 실행 중에 찾을 수 있습니다.

## 14. 핵심 요약

- 모든 대입과 함수 호출에서 "**새로 만드는가, 같은 것을 가리키는가**"를 물으세요.
- Python에서 리스트의 `+=`와 메서드는 제자리 변경, `+`와 자르기는 새 객체입니다. 튜플 안의 리스트, `dict.fromkeys`, 반복문 안 람다에 공유가 숨어 있습니다.
- C에는 값 복사, 별칭, 얕은 복사, 깊은 복사가 있고, 힙 공간은 **주인이 정확히 한 번** 해제합니다. 얕은 복사본은 주인이 아닙니다.
- Rust는 Copy(값), 이동(주소만, 원래 이름 끝), `clone`(안쪽까지), 빌림(주소, 규칙 검사), `Box`(힙 주소), `Rc`(개수 세며 공유)가 자료형과 코드에 드러납니다.
- 다른 데이터를 가리킬 때 주소는 목록이 옮겨지면 무효, 인덱스는 앞 칸을 지우면 당겨지고, **바뀌지 않는 id**는 둘 다 괜찮습니다.

## 15. 도전 문제

1. **(Python)** 오늘의 다섯 가지 함정 각각에 대해 "공유 때문에 틀리는 코드"와 "고친 코드"를 짝으로 만들고, `is`로 같은 객체인지 확인하는 줄을 넣어 보세요.
2. **(C)** 깊은 복사 함수 `copy_names`를 구조체 `NameList { char **names; int n; }`를 받고 돌려주는 모양으로 바꾸고, `namelist_free`를 짝으로 만드세요.
3. **(Rust)** 도서관 예제에 `fn lend(&mut self, member: &str, id: u32) -> Result<(), String>`를 추가해, 이미 빌린 책이나 없는 책이면 오류를 돌려주세요. 대출 기록은 `BTreeMap<u32, String>`(책 id → 회원 이름)으로 저장합니다.
4. **(세 언어)** 정점 5개인 그래프의 이웃 목록을 "정점 번호의 목록"으로 저장하고, 0번에서 갈 수 있는 정점을 출력하세요. 번호로 가리키는 방식이 세 언어에서 얼마나 비슷해지는지 비교합니다(Day 79 미리 보기).
