---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-35-ownership-review
courseId: crp-92
phaseId: phase-04
dayNumber: 35
date: "2026-11-04"
title: 주소와 소유권 회상 — 값은 언제 사라지는가
summary: Day 29~34에서 배운 포인터·참조·빌림·소유권을 "값은 언제 만들어지고 언제 사라지는가"라는 질문으로 다시 묶습니다. Python은 마지막 이름이 사라질 때 객체를 정리하는 참조 세기와 with 문, C는 자동(스택)·static·부른 쪽이 준비한 공간의 차이와 사라진 지역 변수를 가리키는 위험, Rust는 주인이 범위를 벗어날 때 부르는 Drop과 옮기기·빌리기를 비교합니다. 열람실 좌석을 빌리고 오류가 나도 반드시 돌려주는 프로그램을 Python with 문과 Rust Drop으로 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-34-array-pointer]
learningObjectives:
  - Python에서 del이 이름만 지우고, 마지막 이름이 사라질 때 객체가 정리된다는 것을 설명한다.
  - with 문과 __enter__·__exit__로 오류가 나도 정리되는 코드를 만든다.
  - C의 자동 변수, static 변수, 부른 쪽이 준비한 공간의 수명을 구별하고, 지역 변수의 주소를 돌려주는 오류를 고친다.
  - Rust의 Drop이 불리는 시점(범위 끝, 옮긴 곳, drop 호출)을 예측한다.
  - 세 언어에서 "누가 정리할 책임이 있는가"를 비교한다.
concepts:
  [
    object lifetime,
    reference counting,
    del,
    finalizer,
    context manager,
    with statement,
    automatic storage,
    static storage,
    dangling pointer,
    drop,
    raii,
    ownership transfer,
  ]
runnerMode: python
playgroundSource: |
  # 파일: lifetime.py — 마지막 이름이 사라지는 순간을 확인해 보세요.
  class Tracked:
      def __init__(self, name):
          self.name = name
          print("만듦:", name)

      def __del__(self):
          print("정리:", self.name)

  a = Tracked("공책")
  b = a
  del a
  print("아직 b가 있다:", b.name)
  del b
  print("끝")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day35-predict-py
    title: 이름을 지운 뒤의 리스트 예측하기
    kind: predict
    objective: del이 객체가 아니라 이름을 지운다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      a = [1, 2]
      b = a
      del a
      b.append(3)
      print(b, len(b))
    answer: "[1, 2, 3] 3"
    hint: "del a는 이름 a만 없앱니다. 리스트는 b가 여전히 가리키고 있습니다."
    explanation: "a와 b는 같은 리스트를 가리키는 두 이름입니다. del a로 이름 하나가 사라져도 b가 남아 있어 리스트는 그대로 살아 있고, b.append(3)로 바뀝니다. 이후 print(a)를 하면 NameError입니다. 리스트가 정리되는 것은 b까지 사라진 뒤입니다."
    commonMistakes:
      - "del a가 리스트를 지워서 b도 쓸 수 없다고 생각함"
      - "b가 a의 복사본이라 [1, 2, 3]이 아니라고 생각함"
    language: python
    verification: run
  - id: ex-day35-predict-rs
    title: Drop 순서 예측하기
    kind: predict
    objective: 값이 범위 끝에서, 만든 순서의 반대로 정리된다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요(끝의 공백은 무시합니다).
    starter: |-
      struct Tag(&'static str);

      impl Drop for Tag {
          fn drop(&mut self) {
              print!("{} ", self.0);
          }
      }

      fn main() {
          let _a = Tag("A");
          {
              let _b = Tag("B");
              let _c = Tag("C");
          }
          let _d = Tag("D");
          print!("끝 ");
      }
    answer: "C B 끝 D A"
    hint: "안쪽 블록이 끝날 때 _b, _c가 정리됩니다. main이 끝날 때는 _a, _d가 남아 있습니다."
    explanation: "안쪽 블록이 끝나면 그 안의 값이 만든 순서의 반대(C, B)로 정리됩니다. 그다음 D를 만들고 '끝'을 출력한 뒤, main이 끝나면서 D, A 순서로 정리됩니다. 나중에 만든 값이 먼저 만든 값을 쓰고 있을 수 있기 때문에 반대 순서로 정리합니다."
    commonMistakes:
      - "만든 순서대로 B C로 적음"
      - "_a가 블록보다 먼저 정리된다고 생각함"
    language: rust
    verification: run
  - id: ex-day35-fill
    title: 호출 사이에 값이 남는 변수 채우기
    kind: fill
    objective: static 지역 변수는 함수가 끝나도 값이 남는다는 것을 사용한다.
    prompt: "빈칸을 채워 next_ticket이 부를 때마다 1, 2, 3을 돌려주게 하세요. 출력은 '1 2 3'입니다."
    starter: |-
      #include <stdio.h>

      int next_ticket(void) {
          _____ int last = 0;
          last++;
          return last;
      }

      int main(void) {
          int a = next_ticket();
          int b = next_ticket();
          int c = next_ticket();
          printf("%d %d %d\n", a, b, c);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int next_ticket(void) {
          static int last = 0;
          last++;
          return last;
      }

      int main(void) {
          int a = next_ticket();
          int b = next_ticket();
          int c = next_ticket();
          printf("%d %d %d\n", a, b, c);
          return 0;
      }
    output: "1 2 3"
    hint: "보통 지역 변수는 호출마다 새로 만들어집니다. 프로그램이 끝날 때까지 살게 하는 저장 방식이 있습니다."
    explanation: "static을 붙인 지역 변수는 프로그램이 시작할 때 한 번 만들어지고 끝날 때까지 삽니다. 초기화 = 0도 한 번만 일어납니다. static이 없으면 호출마다 last가 0에서 시작해 1 1 1이 됩니다. 이름은 함수 안에서만 보이지만 수명은 전역 변수와 같습니다."
    commonMistakes:
      - "const를 넣어 last++가 컴파일 오류가 남"
      - "static이 있으면 초기화가 호출마다 다시 일어난다고 생각함"
    language: c
    verification: run
  - id: ex-day35-modify
    title: with 문을 쓸 수 있는 클래스로 바꾸기
    kind: modify
    objective: __enter__와 __exit__를 만들어 오류가 나도 정리되게 한다.
    prompt: "on()과 off()를 직접 부르는 코드는 작업 중 오류가 나면 off()가 불리지 않습니다. Lamp에 __enter__와 __exit__를 만들고 with Lamp():를 써서, 오류가 나도 '켜짐 / 작업 / 꺼짐 / 오류: 고장' 네 줄이 출력되게 하세요."
    starter: |-
      class Lamp:
          def on(self):
              print("켜짐")

          def off(self):
              print("꺼짐")


      try:
          lamp = Lamp()
          lamp.on()
          print("작업")
          raise ValueError("고장")
          lamp.off()
      except ValueError as e:
          print("오류:", e)
    answer: |-
      class Lamp:
          def __enter__(self):
              print("켜짐")
              return self

          def __exit__(self, exc_type, exc, tb):
              print("꺼짐")
              return False


      try:
          with Lamp():
              print("작업")
              raise ValueError("고장")
      except ValueError as e:
          print("오류:", e)
    output: |-
      켜짐
      작업
      꺼짐
      오류: 고장
    hint: "__exit__는 블록을 어떻게 나가든(정상 종료, 오류, return) 불립니다. False를 돌려주면 오류는 그대로 밖으로 나갑니다."
    explanation: "원래 코드는 raise 다음 줄의 lamp.off()에 도달하지 못해 '꺼짐'이 빠집니다. with 문은 블록을 나갈 때 __exit__를 반드시 부르므로, 파일 닫기·잠금 풀기처럼 꼭 해야 하는 정리를 맡기기 좋습니다. try/finally로 lamp.off()를 부르는 것과 같은 효과입니다."
    commonMistakes:
      - "__exit__에서 True를 돌려줘 오류가 사라지고 '오류: 고장'이 출력되지 않음"
      - "__exit__의 매개변수 세 개(exc_type, exc, tb)를 빠뜨려 TypeError가 남"
    language: python
    verification: run
  - id: ex-day35-debug
    title: 사라지는 값의 참조를 돌려주는 함수 고치기
    kind: debug
    objective: E0515(지역 변수의 참조 반환)를 소유한 값 반환으로 고친다.
    prompt: "이 코드는 E0515(cannot return reference to local variable `loud`) 오류로 컴파일되지 않습니다. 함수가 String을 돌려주도록 고쳐 'MOMO'가 출력되게 하세요."
    starter: |-
      fn shout(name: &str) -> &str {
          let loud = name.to_uppercase();
          &loud
      }

      fn main() {
          println!("{}", shout("momo"));
      }
    answer: |-
      fn shout(name: &str) -> String {
          name.to_uppercase()
      }

      fn main() {
          println!("{}", shout("momo"));
      }
    output: "MOMO"
    hint: "loud는 shout가 끝나면 정리됩니다. 정리될 값을 빌려줄 수는 없으니, 값 자체를 넘겨주세요."
    explanation: "to_uppercase가 만든 새 String의 주인은 loud이고, 함수가 끝나면 정리됩니다. 그 참조를 돌려주면 사라진 값을 가리키게 되므로 Rust가 막습니다(C에서는 경고 후 실행되어 이상한 값이 나옵니다). String을 돌려주면 소유권이 부른 쪽으로 옮겨가 그곳에서 계속 삽니다."
    commonMistakes:
      - "&'static str로 바꾸면 된다고 생각함(여전히 지역 값의 참조라 오류)"
      - "loud를 clone해 참조를 돌려줌(복사본도 지역 값이라 같은 오류)"
    language: rust
    verification: run
  - id: ex-day35-independent
    title: C에서 부른 쪽 공간에 결과 채우기
    kind: independent
    objective: 지역 배열을 돌려주는 대신 부른 쪽이 준비한 배열에 결과를 쓴다.
    prompt: "void make_squares(int out[], int n)을 만들어 out에 1, 4, 9, ...를 n개 채우고, main에서 int sq[3]을 준비해 '1 4 9'를 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 make_squares를 만들어 호출하세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      void make_squares(int out[], int n) {
          for (int i = 0; i < n; i++) {
              out[i] = (i + 1) * (i + 1);
          }
      }

      int main(void) {
          int sq[3];
          make_squares(sq, 3);
          printf("%d %d %d\n", sq[0], sq[1], sq[2]);
          return 0;
      }
    output: "1 4 9"
    hint: "sq는 main의 변수라 main이 끝날 때까지 삽니다. 함수는 그 주소를 받아 채우기만 합니다."
    explanation: "함수 안에서 int out[3]을 만들어 주소를 돌려주면, 함수가 끝나는 순간 그 배열은 사라집니다. 부른 쪽이 공간을 갖고 함수는 채우기만 하면 수명 문제가 없습니다. 크기를 미리 모를 때는 malloc으로 힙 공간을 받는 방법이 있습니다(Day 40)."
    commonMistakes:
      - "int *make_squares(void) 안의 지역 배열 주소를 돌려줌"
      - "n 대신 sizeof out / sizeof out[0]으로 길이를 구하려 함(Day 34)"
    language: c
    verification: run
quiz:
  - id: quiz-day35-01
    question: Python에서 b = a 뒤에 del a를 하면?
    choices:
      - a가 가리키던 객체가 곧바로 정리된다
      - 이름 a만 사라지고, 객체는 b가 가리키는 동안 살아 있다
      - b도 함께 사라진다
      - 오류가 난다
    answerIndex: 1
    explanation: del은 이름과 객체의 연결을 끊습니다. CPython은 객체를 가리키는 이름·칸의 수를 세다가 0이 되는 순간 정리합니다. b가 남아 있으면 개수가 1이라 정리되지 않습니다.
  - id: quiz-day35-02
    question: with 문에서 블록 안에 오류가 나면 __exit__는?
    choices:
      - 불리지 않는다
      - 불린다. 반환값이 False면 오류가 밖으로 계속 전달된다
      - 오류가 난 줄을 다시 실행한다
      - 프로그램이 끝날 때 불린다
    answerIndex: 1
    explanation: __exit__는 정상 종료든 오류든 블록을 나갈 때 반드시 불립니다. 그래서 파일 닫기 같은 정리를 맡깁니다. True를 돌려주면 오류를 삼키므로, 특별한 이유가 없으면 False(또는 None)를 돌려줍니다.
  - id: quiz-day35-03
    question: C 함수가 자기 지역 배열의 주소를 돌려주면?
    choices:
      - 안전하다
      - 함수가 끝나면 배열이 사라져, 사라진 곳을 가리키는 포인터가 된다(gcc는 경고)
      - 배열이 부른 쪽으로 복사된다
      - 배열이 자동으로 static이 된다
    answerIndex: 1
    explanation: 자동 저장(스택) 변수는 함수가 끝나면 그 자리가 다른 호출에 다시 쓰입니다. 그 주소를 쓰면 정의되지 않은 동작입니다. static으로 만들거나, 부른 쪽 공간을 받거나, malloc을 쓰세요.
  - id: quiz-day35-04
    question: Rust에서 let c = Tracked::new("x"); consume(c);를 하면 c의 Drop은 언제 불리나?
    choices:
      - main이 끝날 때
      - consume 함수가 끝날 때(소유권이 옮겨졌으므로)
      - 두 번 불린다
      - 불리지 않는다
    answerIndex: 1
    explanation: 소유권과 함께 정리 책임도 consume의 매개변수로 옮겨갑니다. 옮긴 뒤의 c는 쓸 수 없고, 정리도 한 번만 일어납니다. 빌려준 경우(&c)에는 main이 여전히 주인이라 main 끝에서 정리됩니다.
  - id: quiz-day35-05
    question: 정리 책임을 누가 지는지 가장 잘 짝지은 것은?
    choices:
      - C는 컴파일러, Python은 프로그래머, Rust는 운영체제
      - C는 프로그래머(규칙은 약속), Python은 실행기(참조 세기와 쓰레기 수집), Rust는 컴파일러가 정한 주인(범위 끝에 Drop)
      - 세 언어 모두 프로그래머
      - 세 언어 모두 자동
    answerIndex: 1
    explanation: C는 malloc한 것을 free하는 일을 프로그래머가 기억해야 합니다. Python은 실행 중에 개수를 세어 알아서 정리합니다. Rust는 컴파일할 때 주인을 정해 두고, 주인이 사라지는 곳에 정리 코드를 넣습니다.
---

## 1. 오늘 배울 내용

Day 29부터 Day 34까지 포인터, 참조, 별칭과 복사, 소유권, 빌림 규칙, 배열 매개변수를 배웠습니다. 오늘은 새 문법을 늘리기보다, 그 내용을 **하나의 질문**으로 다시 묶습니다.

> 값은 언제 만들어지고, 언제 사라지며, 누가 정리하는가?

1. **Python**: 이름과 객체를 다시 봅니다.
   - `del`은 이름만 지웁니다.
   - 객체는 **마지막 이름**이 사라질 때 정리됩니다(참조 세기).
   - `with` 문으로 "오류가 나도 반드시 정리"를 보장합니다.
2. **C**: 변수가 어디에 사는지에 따라 수명이 다릅니다.
   - 자동(스택) 변수는 블록이 끝나면 사라집니다.
   - `static` 변수는 프로그램이 끝날 때까지 삽니다.
   - 결과를 담을 공간은 부른 쪽이 준비합니다.
   - 사라진 변수를 가리키는 포인터가 왜 위험한지 봅니다.
3. **Rust**: 주인이 범위를 벗어날 때 `Drop`이 불립니다.
   - 옮기면 정리 책임도 옮겨 갑니다.
   - 빌리면 정리 책임이 없습니다.
4. 열람실 좌석을 빌리고, **오류가 나도 반드시 돌려주는** 프로그램을 Python `with`와 Rust `Drop`으로 만듭니다.

## 2. 왜 필요한가

프로그램은 메모리뿐 아니라 파일, 네트워크 연결, 잠금(lock), 좌석이나 대출 같은 **빌린 자원**을 다룹니다. 이것을 제때 돌려주지 않으면 문제가 생깁니다.

- 메모리를 돌려주지 않으면 오래 돌수록 메모리를 다 써 버립니다(메모리 누수).
- 파일을 닫지 않으면 내용이 저장되지 않거나 열 수 있는 파일 수가 바닥납니다.
- 이미 돌려준 것을 계속 쓰면, 그 자리를 새로 받은 다른 값이 망가집니다(C의 댕글링 포인터).
- 오류가 난 경로에서 정리를 빼먹는 경우가 특히 많습니다.

세 언어는 이 문제를 서로 다른 방식으로 풉니다. 차이를 알면 Day 40(`malloc`/`free`), Day 41(`Box`), Day 46~48(파일)의 코드가 왜 그렇게 생겼는지 이해할 수 있습니다.

## 3. 그림으로 이해하기

**Python: 이름표와 개수.** 객체는 자기를 가리키는 이름·칸이 몇 개인지 셉니다.

```text
a = Tracked("공책")      a ──▶ [공책] 개수 1
b = a                    a ──▶ [공책] ◀── b   개수 2
del a                          [공책] ◀── b   개수 1   (이름표 하나만 떼어냄)
del b                          [공책]         개수 0 → 정리(__del__)
```

**C: 사는 곳에 따라 수명이 다르다.**

```text
┌ static 영역 ───────────────┐  프로그램 시작 ~ 끝
│ static int count           │
└────────────────────────────┘
┌ 스택 ──────────────────────┐
│ main의 squares[4]          │  main이 끝날 때까지
│ ┌ sum_to의 total ────────┐ │  sum_to가 불린 동안만
│ └────────────────────────┘ │  끝나면 그 자리는 다음 호출이 다시 씀
└────────────────────────────┘
```

**Rust: 주인이 떠나면 정리.**

```text
{
    let a = Tracked::new("공책");   a가 주인
    let b = Tracked::new("연필");   b가 주인
}                                   ← 범위 끝: b 정리, a 정리 (만든 반대 순서)

let c = Tracked::new("지우개");
consume(c);                         ← 주인이 consume의 매개변수로 바뀜
                                      consume이 끝날 때 정리
```

## 4. 천천히 풀어보기

### 4.1 Python: 참조 세기와 쓰레기 수집

CPython(보통 쓰는 Python)은 객체마다 "나를 가리키는 곳이 몇 개인가"를 셉니다.

- 이름에 대입하거나, 리스트에 넣거나, 함수 인자로 넘기면 개수가 늘어납니다.
- `del`, 다른 값 대입, 함수가 끝나 지역 이름이 사라짐, 리스트에서 빠짐 등으로 개수가 줄어듭니다.
- 개수가 0이 되는 순간 객체가 정리되고, `__del__`이 있으면 그때 불립니다.

두 객체가 서로를 가리키는 **순환 참조**는 개수가 0이 되지 않아서, 가끔 도는 **쓰레기 수집기(gc)** 가 따로 찾아 정리합니다. 그래서 `__del__`이 불리는 **시점**에 기대는 코드는 좋지 않습니다. 꼭 해야 하는 정리는 `with` 문에 맡깁니다.

### 4.2 Python: with 문

```python
with 자원() as 이름:
    일하기
```

1. `자원()`을 만들고 `__enter__()`를 부릅니다. 돌려준 값이 `이름`에 들어갑니다.
2. 블록을 실행합니다.
3. 블록을 **어떻게 나가든**(끝까지 실행, 오류, `return`, `break`) `__exit__()`가 불립니다.

`open()`이 돌려주는 파일 객체도 이 두 메서드를 가지고 있어서 `with open(...) as f:`로 쓰면 파일이 반드시 닫힙니다(Day 47).

### 4.3 C: 저장 기간

| 종류       | 만드는 법                             | 수명                        | 정리               |
| ---------- | ------------------------------------- | --------------------------- | ------------------ |
| 자동(스택) | 함수·블록 안의 보통 변수              | 블록에 들어가서 나올 때까지 | 자동               |
| static     | 함수 밖 변수, 또는 `static` 지역 변수 | 프로그램 전체               | 자동(끝날 때)      |
| 동적(힙)   | `malloc`                              | `free`할 때까지             | 프로그래머(Day 40) |

C 함수가 결과 배열을 넘겨주는 안전한 방법은 세 가지입니다.

- 부른 쪽이 공간을 준비하고 함수가 채웁니다(`fill_squares(out, n)`).
- `static` 공간을 씁니다. 다만 다음 호출이 내용을 덮어씁니다.
- `malloc`으로 받아 돌려주고, 부른 쪽이 `free`합니다.

### 4.4 Rust: Drop과 소유권

- 값에는 주인(변수, 구조체의 필드, `Vec`의 칸 등)이 정확히 하나 있습니다.
- 주인이 범위를 벗어나면 컴파일러가 그 자리에 **정리 코드(`drop`)** 를 넣습니다.
- 옮기면(`consume(c)`) 정리 책임도 옮겨 갑니다. 빌리면(`&kept`) 책임이 없습니다.
- `drop(x)`는 특별한 문법이 아니라 "소유권을 받아서 아무것도 안 하는" 평범한 함수입니다. 받은 값이 함수 끝에서 정리됩니다.

이렇게 "자원을 얻는 것과 정리를 값의 수명에 묶는" 방식을 C++에서 온 이름으로 **RAII**라고 합니다.

## 5. Python으로 구현하기

```python
# 파일: lifetime.py
class Tracked:
    def __init__(self, name):
        self.name = name
        print("  만듦:", name)

    def __del__(self):                      # 마지막 이름이 사라질 때 불린다(CPython)
        print("  정리:", self.name)


print("1) 이름 두 개가 한 객체를 가리킨다")
a = Tracked("공책")
b = a
del a                                       # 이름 하나만 지운다
print("  a를 지웠지만 b가 남아 있다:", b.name)
del b                                       # 마지막 이름이 사라짐 → 정리

print("2) 함수 안에서 만든 객체")


def make(name):
    t = Tracked(name)
    return t                                # 돌려주면 부른 쪽이 이어받는다


kept = make("연필")
make("지우개")                               # 받는 이름이 없으면 곧바로 정리
print("  kept =", kept.name)

print("3) 리스트가 가진 객체")
box = [Tracked("자"), Tracked("풀")]
box.pop()                                   # 리스트에서 빠지고 다른 이름도 없다
print("  남은 개수:", len(box))
box = None                                  # 리스트가 사라지면 안의 객체도
del kept
print("끝")
```

실행 결과:

```text
1) 이름 두 개가 한 객체를 가리킨다
  만듦: 공책
  a를 지웠지만 b가 남아 있다: 공책
  정리: 공책
2) 함수 안에서 만든 객체
  만듦: 연필
  만듦: 지우개
  정리: 지우개
  kept = 연필
3) 리스트가 가진 객체
  만듦: 자
  만듦: 풀
  정리: 풀
  남은 개수: 1
  정리: 자
  정리: 연필
끝
```

### 코드 한 부분씩 읽기

| 코드                               | 설명                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `def __del__(self):`               | 객체가 정리되기 직전에 불리는 메서드입니다. 이 예제처럼 정리 시점을 **관찰**하는 데는 좋지만, 중요한 정리를 맡기기에는 시점이 보장되지 않습니다. |
| `b = a` / `del a`                  | 이름이 둘이 됐다가 하나로 줄었습니다. 객체는 그대로입니다.                                                                                       |
| `del b`                            | 마지막 이름이 사라져 곧바로 "정리: 공책"이 출력됩니다.                                                                                           |
| `return t` / `kept = make("연필")` | 함수의 지역 이름 `t`는 사라지지만, 돌려준 객체를 `kept`가 받아 살아 있습니다.                                                                    |
| `make("지우개")`                   | 돌려받은 객체를 아무 이름에도 넣지 않아 곧바로 정리됩니다.                                                                                       |
| `box.pop()`                        | 리스트의 칸이 가리키던 것이 빠집니다. 다른 이름이 없으므로 "풀"이 정리됩니다.                                                                    |
| `box = None`                       | 리스트가 정리되면서 리스트가 가리키던 "자"도 개수가 0이 되어 정리됩니다.                                                                         |

## 6. C로 구현하기

```c
// 파일: storage.c
#include <stdio.h>

int *counter_address(void) {
    static int count = 0;                   // 프로그램이 끝날 때까지 사는 변수
    count++;
    return &count;                          // 안전: static은 함수가 끝나도 남는다
}

void fill_squares(int out[], int n) {       // 공간은 부른 쪽이 가진다
    for (int i = 0; i < n; i++) {
        out[i] = (i + 1) * (i + 1);
    }
}

int sum_to(int n) {
    int total = 0;                          // 호출마다 새로 생기고, 끝나면 사라진다
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    return total;                           // 값을 복사해서 돌려준다
}

int main(void) {
    int *p = counter_address();
    counter_address();
    printf("static count = %d\n", *p);      // 두 번 불렀으니 2

    int squares[4];
    fill_squares(squares, 4);
    printf("squares = %d %d %d %d\n", squares[0], squares[1], squares[2], squares[3]);

    printf("sum_to(10) = %d, sum_to(3) = %d\n", sum_to(10), sum_to(3));

    int *alias = squares;                   // 주인은 squares, alias는 빌린 주소
    alias[0] = 100;
    printf("alias로 바꾼 뒤 squares[0] = %d\n", squares[0]);

    {
        int inner = 7;
        p = &inner;
        printf("블록 안에서 *p = %d\n", *p);
    }                                       // inner는 여기서 사라진다. 이후 *p는 금지
    p = NULL;                               // 사라진 곳을 가리키지 않도록 지워 둔다
    printf("p를 NULL로: %s\n", p == NULL ? "안전" : "위험");
    return 0;
}
```

실행 결과:

```text
static count = 2
squares = 1 4 9 16
sum_to(10) = 55, sum_to(3) = 6
alias로 바꾼 뒤 squares[0] = 100
블록 안에서 *p = 7
p를 NULL로: 안전
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `static int count = 0;`               | 프로그램 전체에 하나만 있는 변수입니다. 주소를 돌려줘도 안전하고, 두 번 부른 뒤 `*p`는 2입니다.                                 |
| `void fill_squares(int out[], int n)` | 결과를 담을 공간의 **주인은 부른 쪽**입니다. 함수는 빌린 주소에 쓰기만 합니다.                                                  |
| `int total = 0;` / `return total;`    | `total`은 호출마다 새로 생기고 끝나면 사라집니다. 돌려주는 것은 값의 복사본이라 안전합니다.                                     |
| `int *alias = squares;`               | 주소만 복사한 별칭(Day 31)입니다. 정리 책임은 여전히 `squares`를 선언한 `main`에 있습니다.                                      |
| `{ int inner = 7; p = &inner; }`      | 블록이 끝나면 `inner`는 사라집니다. 그 뒤 `*p`를 읽는 것은 정의되지 않은 동작입니다. 컴파일러는 이것을 항상 찾아 주지 못합니다. |
| `p = NULL;`                           | 사라진 곳을 가리키는 포인터를 남겨 두지 않는 습관입니다. `NULL`은 검사할 수 있지만, 사라진 주소는 겉보기로 구별할 수 없습니다.  |

## 7. Rust로 구현하기

```rust
// 파일: drops.rs
struct Tracked {
    name: String,
}

impl Tracked {
    fn new(name: &str) -> Tracked {
        println!("  만듦: {name}");
        Tracked { name: name.to_string() }
    }
}

impl Drop for Tracked {
    fn drop(&mut self) {                    // 주인이 사라질 때 자동으로 불린다
        println!("  정리: {}", self.name);
    }
}

fn consume(t: Tracked) {                    // 소유권을 받았으니 끝날 때 정리한다
    println!("  consume이 받음: {}", t.name);
}

fn make(name: &str) -> Tracked {
    Tracked::new(name)                      // 돌려주면 부른 쪽이 주인이 된다
}

fn main() {
    println!("1) 블록이 끝나면 정리");
    {
        let _a = Tracked::new("공책");
        let _b = Tracked::new("연필");
        println!("  블록 끝");
    }                                       // 만든 순서의 반대로 정리된다

    println!("2) 함수로 옮기기");
    let c = Tracked::new("지우개");
    consume(c);                             // c는 옮겨졌다. 이후 c를 쓸 수 없다
    println!("  consume에서 돌아옴");

    println!("3) 돌려받기와 빌려주기");
    let kept = make("자");
    let r = &kept;                          // 빌리기만 하면 정리 책임이 없다
    println!("  빌려 읽기: {}", r.name);

    println!("4) 일찍 정리하기");
    let early = Tracked::new("풀");
    drop(early);                            // 표준 함수 drop이 소유권을 가져가 정리
    println!("main 끝");
}
```

실행 결과:

```text
1) 블록이 끝나면 정리
  만듦: 공책
  만듦: 연필
  블록 끝
  정리: 연필
  정리: 공책
2) 함수로 옮기기
  만듦: 지우개
  consume이 받음: 지우개
  정리: 지우개
  consume에서 돌아옴
3) 돌려받기와 빌려주기
  만듦: 자
  빌려 읽기: 자
4) 일찍 정리하기
  만듦: 풀
  정리: 풀
main 끝
  정리: 자
```

### 코드 한 부분씩 읽기

| 코드                                 | 설명                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `impl Drop for Tracked`              | 주인이 사라질 때 불릴 코드를 정합니다. Python의 `__del__`과 비슷하지만, **언제** 불릴지 컴파일할 때 정해져 있습니다.             |
| `let _a = ...;`                      | 이름이 `_`로 시작하면 "쓰지 않는 변수" 경고가 나지 않습니다. 이름 전체가 `_`인 `let _ = ...;`는 값을 곧바로 정리하니 주의하세요. |
| 블록 끝의 "정리: 연필", "정리: 공책" | 만든 반대 순서입니다. 나중 값이 앞의 값을 빌리고 있을 수 있으므로 뒤에서부터 정리합니다.                                         |
| `consume(c);`                        | 소유권이 매개변수 `t`로 옮겨 갑니다. `consume`이 끝날 때 정리되므로 "정리: 지우개"가 "돌아옴"보다 먼저입니다.                    |
| `let r = &kept;`                     | 빌린 쪽은 정리하지 않습니다. `kept`는 `main` 끝에서 정리됩니다(마지막 줄).                                                       |
| `drop(early);`                       | 범위가 끝나기 전에 일찍 정리하고 싶을 때 씁니다. 이후 `early`는 옮겨진 상태라 쓸 수 없습니다.                                    |

## 8. 실행 추적

Python 예제의 3)번에서 객체마다 "나를 가리키는 곳의 수"가 어떻게 바뀌는지 따라갑니다.

| 줄                                     | "자"를 가리키는 곳    | "풀"을 가리키는 곳 | 일어난 일   |
| -------------------------------------- | --------------------- | ------------------ | ----------- |
| `box = [Tracked("자"), Tracked("풀")]` | 리스트 칸 0 → 1개     | 리스트 칸 1 → 1개  | 둘 다 만듦  |
| `box.pop()`                            | 1개                   | 0개                | "풀" 정리   |
| `box = None`                           | 리스트가 정리되며 0개 | -                  | "자" 정리   |
| `del kept`                             | -                     | -                  | "연필" 정리 |

같은 흐름을 Rust에서는 컴파일러가 미리 계산합니다. `Vec`이 정리될 때 칸의 값들을 정리하는 것도 같습니다. 차이는 Python이 **실행 중에 세어서** 알아내고, Rust는 **컴파일할 때 주인을 정해서** 안다는 점입니다.

## 9. 다른 예제로 다시 이해하기

**열람실 좌석 빌리기.** 좌석이 2개인 열람실에서, 공부를 시작하면 좌석을 하나 빌리고 끝나면 돌려줍니다. 공부 도중 오류가 나도 좌석은 **반드시** 돌아와야 합니다.

```python
# 파일: seats.py
class Seat:
    free = 2                                # 열람실의 빈 좌석 수(모든 Seat가 함께 쓴다)

    def __init__(self, who):
        self.who = who

    def __enter__(self):                    # with 블록에 들어갈 때
        if Seat.free == 0:
            raise RuntimeError("빈 좌석 없음")
        Seat.free -= 1
        print(f"{self.who} 앉음 (남은 좌석 {Seat.free})")
        return self

    def __exit__(self, exc_type, exc, tb):  # 블록을 나갈 때: 오류가 나도 불린다
        Seat.free += 1
        print(f"{self.who} 일어남 (남은 좌석 {Seat.free})")
        return False                        # 오류는 그대로 밖으로 보낸다


def study(who, pages):
    with Seat(who):
        if pages < 0:
            raise ValueError("쪽수가 음수")
        print(f"  {who}: {pages}쪽 읽음")


study("민지", 30)
try:
    study("준호", -1)
except ValueError as e:
    print("오류:", e)
with Seat("서연"):
    with Seat("도윤"):
        try:
            study("하준", 5)
        except RuntimeError as e:
            print("오류:", e)
print("마지막 빈 좌석:", Seat.free)
```

실행 결과:

```text
민지 앉음 (남은 좌석 1)
  민지: 30쪽 읽음
민지 일어남 (남은 좌석 2)
준호 앉음 (남은 좌석 1)
준호 일어남 (남은 좌석 2)
오류: 쪽수가 음수
서연 앉음 (남은 좌석 1)
도윤 앉음 (남은 좌석 0)
오류: 빈 좌석 없음
도윤 일어남 (남은 좌석 1)
서연 일어남 (남은 좌석 2)
마지막 빈 좌석: 2
```

| 코드                                           | 설명                                                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `free = 2` (클래스 안)                         | 모든 `Seat`가 함께 쓰는 클래스 변수입니다(Day 51에서 자세히).                                                                |
| `__enter__`에서 `raise RuntimeError(...)`      | 좌석이 없으면 빌리기 자체가 실패합니다. 이때는 `__exit__`가 불리지 않습니다. 빌리지 않은 것은 돌려줄 필요가 없기 때문입니다. |
| `raise ValueError("쪽수가 음수")`              | 준호의 공부는 오류로 끝났지만 "준호 일어남"이 먼저 출력됩니다. `__exit__`가 오류를 밖으로 보내기 전에 좌석을 돌려줬습니다.   |
| 중첩된 `with Seat("서연"): with Seat("도윤"):` | 안쪽부터 바깥쪽 순서로 정리됩니다. Rust의 Drop 순서와 같습니다.                                                              |

같은 규칙을 Rust에서는 `Drop`으로 만듭니다. `Seat` 값이 사라지는 곳이 곧 좌석을 돌려주는 곳입니다.

```rust
// 파일: seats.rs
use std::cell::Cell;

struct Room {
    free: Cell<u32>,                        // 빌린 채로 바꾸기 위해 Cell(Day 31)
}

struct Seat<'a> {
    room: &'a Room,
    who: String,
}

impl Room {
    fn sit(&self, who: &str) -> Result<Seat<'_>, String> {
        if self.free.get() == 0 {
            return Err(String::from("빈 좌석 없음"));
        }
        self.free.set(self.free.get() - 1);
        println!("{who} 앉음 (남은 좌석 {})", self.free.get());
        Ok(Seat { room: self, who: who.to_string() })
    }
}

impl Drop for Seat<'_> {
    fn drop(&mut self) {                    // 어떻게 빠져나가든 좌석을 돌려준다
        self.room.free.set(self.room.free.get() + 1);
        println!("{} 일어남 (남은 좌석 {})", self.who, self.room.free.get());
    }
}

fn study(room: &Room, who: &str, pages: i32) -> Result<(), String> {
    let _seat = room.sit(who)?;
    if pages < 0 {
        return Err(String::from("쪽수가 음수"));  // 여기서 나가도 _seat가 정리된다
    }
    println!("  {who}: {pages}쪽 읽음");
    Ok(())
}

fn main() {
    let room = Room { free: Cell::new(2) };
    study(&room, "민지", 30).unwrap();
    if let Err(e) = study(&room, "준호", -1) {
        println!("오류: {e}");
    }
    {
        let _a = room.sit("서연").unwrap();
        let _b = room.sit("도윤").unwrap();
        if let Err(e) = study(&room, "하준", 5) {
            println!("오류: {e}");
        }
    }
    println!("마지막 빈 좌석: {}", room.free.get());
}
```

실행 결과:

```text
민지 앉음 (남은 좌석 1)
  민지: 30쪽 읽음
민지 일어남 (남은 좌석 2)
준호 앉음 (남은 좌석 1)
준호 일어남 (남은 좌석 2)
오류: 쪽수가 음수
서연 앉음 (남은 좌석 1)
도윤 앉음 (남은 좌석 0)
오류: 빈 좌석 없음
도윤 일어남 (남은 좌석 1)
서연 일어남 (남은 좌석 2)
마지막 빈 좌석: 2
```

- `Seat<'a>`의 `'a`는 "좌석은 열람실보다 오래 살 수 없다"는 표시입니다. 수명 표기는 Day 45에서 자세히 배웁니다.
- `free: Cell<u32>`는 여러 좌석이 열람실을 **공유 빌림**으로 들고 있으면서도 개수를 바꿀 수 있게 해 줍니다.
- `let _seat = room.sit(who)?;`에서 빌리기에 실패하면 `?`가 곧바로 돌아가고, 만들어지지 않은 `Seat`는 정리할 것도 없습니다.
- `return Err(...)`로 일찍 나가도 `_seat`가 범위를 벗어나므로 `drop`이 불립니다. 오류 경로에서 정리를 빼먹을 방법이 없습니다.

C라면 모든 `return` 앞에 `release_seat()`를 직접 불러야 합니다. 경로가 여러 개인 함수에서 하나라도 빠뜨리면 좌석이 영영 돌아오지 않습니다. 그래서 C 코드는 흔히 정리 코드를 함수 끝에 모으고 `goto cleanup;`으로 그곳에 가는 방식을 씁니다(Day 46).

## 10. 수명과 정리 책임 정리

| 상황                    | C                               | Python                                | Rust                       |
| ----------------------- | ------------------------------- | ------------------------------------- | -------------------------- |
| 지역 값이 사라지는 때   | 블록 끝                         | 마지막 이름이 사라질 때               | 주인의 범위 끝             |
| 함수가 새 값을 넘겨주기 | 값 복사, 부른 쪽 공간, `malloc` | 그냥 `return`                         | 소유한 값 `return`(옮기기) |
| 사라진 값을 가리키면    | 정의되지 않은 동작              | 일어날 수 없음(살아 있는 동안 가리킴) | 컴파일 오류(E0515, E0597)  |
| 꼭 해야 하는 정리       | 모든 경로에서 직접 호출         | `with`, `try/finally`                 | `Drop`(자동)               |
| 일찍 정리               | `free`, `fclose` 직접 호출      | `del`(이름만), `close()`              | `drop(x)`                  |

## 11. 세 언어 비교

| 관점               | C                               | Python                            | Rust                               |
| ------------------ | ------------------------------- | --------------------------------- | ---------------------------------- |
| 정리를 결정하는 것 | 프로그래머                      | 실행기(참조 세기 + 쓰레기 수집)   | 컴파일러가 정한 주인               |
| 정리 시점          | 코드에 쓴 곳                    | 개수가 0이 되는 순간(순환은 나중) | 범위 끝, 옮긴 곳의 끝, `drop` 호출 |
| 비용               | 없음(대신 실수 위험)            | 실행 중 개수 세기                 | 없음(컴파일할 때 결정)             |
| 대표 실수          | 댕글링 포인터, 누수, 두 번 해제 | 순환 참조, 정리 시점에 기대기     | 옮긴 값을 다시 쓰기(컴파일 오류)   |

## 12. 자주 하는 실수

### 실수 1: 지역 배열의 주소를 돌려준다 (C)

```c
// 파일: local_address.c (컴파일 오류: function returns address of local variable)
#include <stdio.h>

int *make_squares(void) {
    int out[3] = {1, 4, 9};
    return out;
}

int main(void) {
    int *p = make_squares();
    printf("%d\n", p[0]);
    return 0;
}
```

gcc는 경고로 알려 주고, 이 과정의 설정(`-Werror`)에서는 오류가 됩니다. 경고를 무시하고 실행하면 이상한 값이 나오거나 멈춥니다. 실습의 독립 문제처럼 부른 쪽 공간을 받으세요.

### 실수 2: 사라지는 값의 참조를 돌려준다 (Rust)

실습의 디버그 문제입니다. 함수 안에서 만든 값은 **소유한 채로** 돌려주세요(`String`, `Vec<T>`).

### 실수 3: del이 객체를 지운다고 생각한다 (Python)

```python
# 파일: del_name.py (실행 오류: NameError)
def total(xs):
    return sum(xs)


scores = [1, 2, 3]
del scores
print(total(scores))
```

`del`은 이름을 지웁니다. 지운 이름을 다시 쓰면 `NameError`입니다. 다른 이름이 같은 객체를 가리키고 있으면 객체는 계속 삽니다.

### 실수 4: __del__에 중요한 정리를 맡긴다 (Python)

순환 참조가 있거나 예외 정보가 객체를 붙잡고 있으면 `__del__`이 늦게 불리거나, 프로그램이 끝날 때까지 안 불릴 수도 있습니다. 파일·연결·잠금은 `with`로 닫으세요.

### 실수 5: let _ = 값;으로 값을 붙잡아 둔다고 생각한다 (Rust)

`let _guard = Seat...;`는 범위 끝까지 값을 붙잡지만, `let _ = Seat...;`는 값을 **곧바로** 정리합니다. 좌석처럼 "살아 있는 동안 효과가 있는" 값은 반드시 `_`로 시작하는 이름을 붙이세요.

## 13. Q&A

**Q. Python에도 소유권이 있나요?**

A. 소유권이라는 규칙은 없지만, "이 객체를 누가 붙잡고 있는가"는 똑같이 중요합니다. 전역 리스트나 캐시에 객체를 넣어 두면 그 객체는 영영 정리되지 않아 메모리가 늘어납니다. Python의 메모리 누수는 대부분 이렇게 "잊어버린 참조" 때문입니다.

**Q. Rust의 Drop과 Python의 \__del__은 같은 건가요?**

A. 하는 일은 비슷하지만 보장이 다릅니다. Rust의 `drop`은 컴파일러가 정한 자리에서 **정확히 한 번** 불립니다. 그래서 파일 닫기, 잠금 풀기를 Drop에 맡기는 것이 표준 방식입니다. Python의 `__del__`은 실행기가 정리할 때 불리므로, 같은 역할은 `with`가 맡습니다.

**Q. C에서 static을 쓰면 수명 문제가 다 해결되지 않나요?**

A. 수명은 해결되지만 공간이 **하나뿐**이라, 함수를 다시 부르면 이전 결과를 덮어씁니다. 두 결과를 동시에 들고 있거나 여러 스레드에서 부르면 문제가 됩니다. 표준 함수 `strtok`, `localtime`이 이런 문제로 유명합니다.

**Q. 쓰레기 수집기가 있으면 Python에서 메모리 걱정은 안 해도 되나요?**

A. 대부분은 그렇습니다. 하지만 큰 데이터를 담은 리스트를 오래 들고 있거나, 순환 참조가 많으면 메모리가 예상보다 늘어납니다. 파일·연결 같은 **메모리가 아닌 자원**은 쓰레기 수집기가 제때 닫아 준다는 보장이 없으니 `with`로 관리하세요.

## 14. 핵심 요약

- 모든 값에는 **수명**이 있고, 누군가는 **정리할 책임**을 집니다. 세 언어의 차이는 그 책임을 누가 지느냐입니다.
- Python의 `del`은 이름만 지웁니다. 객체는 가리키는 곳이 0개가 될 때 정리되고, 꼭 해야 하는 정리는 `with`(`__enter__`/`__exit__`)에 맡깁니다.
- C의 자동 변수는 블록이 끝나면 사라지고, `static`은 프로그램 끝까지 삽니다. 지역 변수의 주소를 돌려주지 말고, 부른 쪽이 공간을 준비하게 하세요.
- Rust는 주인이 범위를 벗어날 때 `Drop`을 부릅니다. 옮기면 책임도 옮겨 가고, 빌리면 책임이 없습니다. 만든 반대 순서로 정리됩니다.
- 오류 경로에서의 정리가 가장 빠뜨리기 쉽습니다. Python `with`, Rust `Drop`은 모든 경로에서 정리를 보장합니다.

## 15. 도전 문제

1. **(Python)** 열람실 예제에 `__enter__`가 좌석 번호를 돌려주도록 바꾸고(`with Seat("민지") as no:`), 빈 좌석 목록을 리스트로 관리해 돌려받은 번호가 다시 쓰이는지 확인하세요.
2. **(C)** `int *counter_address(void)`처럼 `static` 배열을 돌려주는 `const char *weekday_name(int d)`를 만들고, 두 번 불러 받은 포인터가 같은 주소인지(`==`) 확인해 보세요. 결과를 동시에 두 개 쓰려면 어떤 문제가 있는지 설명하세요.
3. **(Rust)** `Tracked`를 세 개 넣은 `Vec`을 만들고, `remove(1)`, `truncate(1)`, `clear()`를 차례로 부를 때마다 어떤 순서로 "정리"가 출력되는지 예측한 뒤 실행해 확인하세요.
4. **(세 언어)** "로그 파일 열기 → 줄 쓰기 → 닫기"를 흉내 내는 `Logger`를 만들어, 중간에 오류가 나도 "닫힘"이 출력되게 하세요. C에서는 `goto cleanup;` 방식을 써 보세요.
