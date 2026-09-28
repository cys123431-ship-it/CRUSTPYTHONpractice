---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-55-module-test
courseId: crp-92
phaseId: phase-05
dayNumber: 55
date: "2026-11-24"
title: Python 모듈화와 assert
summary: '코드를 파일(모듈) 단위로 나누고, 그 코드가 맞는지 스스로 확인하는 시험을 붙이는 방법을 배웁니다. Python의 import와 모듈 검색 경로, 직접 실행할 때만 도는 if __name__ == "__main__", 모듈 설명 문자열, assert와 메시지, assert를 입력 검사에 쓰면 안 되는 이유(-O로 꺼짐), unittest.TestCase와 assertEqual·assertRaises, 입력과 기대값을 표로 모은 시험을 다룹니다. C의 헤더(.h)와 소스(.c) 나누기, assert.h와 NDEBUG, 직접 만든 CHECK 매크로, Rust의 mod·pub·use와 assert!·assert_eq!, #[cfg(test)] 시험 모듈과 비교하고, 작은 통계 모듈을 파일로 만들어 불러오고 표 시험으로 확인하는 프로그램을 만들어 봅니다.'
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 100
prerequisites: [day-54-trait-generic]
learningObjectives:
  - 모듈을 import하고, __name__ == "__main__"으로 직접 실행할 때만 도는 코드를 나눈다.
  - assert로 가정을 확인하고, 사용자 입력 검사에는 예외를 써야 하는 이유를 설명한다.
  - unittest.TestCase와 표로 모은 시험으로 함수의 여러 경우를 확인한다.
  - C의 헤더·소스 나누기와 assert·NDEBUG, CHECK 매크로를 설명한다.
  - "Rust의 mod·pub·use로 모듈을 나누고, assert_eq!와 #[cfg(test)] 시험 모듈을 쓴다."
concepts:
  [
    module,
    import,
    sys path,
    dunder name main,
    docstring,
    assert,
    assertion error,
    optimize flag,
    unittest,
    testcase,
    assertequal,
    assertraises,
    table driven test,
    header file,
    separate compilation,
    ndebug,
    check macro,
    rust mod,
    pub,
    use,
    assert eq,
    cfg test,
  ]
runnerMode: python
playgroundSource: |
  # 파일: assert_play.py — assert가 실패하면 어떻게 되는지 보세요.
  def mean(xs):
      assert xs, "빈 목록은 안 됨"
      return sum(xs) / len(xs)

  print(mean([1, 2, 3]))
  try:
      mean([])
  except AssertionError as e:
      print("AssertionError:", e)
  print(__name__)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day55-predict-assert
    title: assert 메시지 예측하기
    kind: predict
    objective: assert가 거짓이면 메시지를 담은 AssertionError를 낸다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      try:
          assert 1 + 1 == 3, "산수 오류"
      except AssertionError as e:
          print("잡힘:", e)
    answer: "잡힘: 산수 오류"
    hint: "assert 조건, 메시지 — 조건이 거짓이면 메시지가 예외에 담깁니다."
    explanation: "assert는 '여기서 이 조건은 반드시 참이어야 한다'는 확인입니다. 거짓이면 AssertionError가 나고, 쉼표 뒤의 메시지가 예외의 설명이 됩니다. 보통은 잡지 않고 프로그램이 멈추게 둬서 버그를 드러내고, 여기서는 결과를 보려고 잡았습니다."
    commonMistakes:
      - "assert가 거짓이면 조용히 넘어간다고 생각함"
      - "메시지가 출력되지 않고 False가 나온다고 생각함"
    language: python
    verification: run
  - id: ex-day55-predict-main
    title: __name__ 예측하기
    kind: predict
    objective: 직접 실행한 파일의 __name__이 "__main__"이라는 것을 확인한다.
    prompt: 출력되는 두 줄을 그대로 적으세요.
    starter: |-
      def main():
          print("main 실행")


      print(__name__)
      if __name__ == "__main__":
          main()
    answer: |-
      __main__
      main 실행
    hint: "직접 실행한 파일은 이름이 파일 이름이 아니라 특별한 값입니다."
    explanation: '파이썬은 직접 실행한 파일의 __name__을 "__main__"으로 둡니다. 같은 파일을 다른 파일에서 import하면 __name__은 모듈 이름(예: "mystats")이 되어 main()이 불리지 않습니다. 그래서 모듈에 들어 있는 시험 코드나 예시 실행을 이 if 안에 두면, 불러다 쓸 때는 실행되지 않습니다.'
    commonMistakes:
      - "파일 이름이 출력된다고 생각함"
      - "if 안이 항상 실행되지 않는다고 생각함"
    language: python
    verification: run
  - id: ex-day55-fill
    title: unittest의 비교 메서드 채우기
    kind: fill
    objective: TestCase에서 두 값이 같은지 확인하는 메서드를 쓴다.
    prompt: "빈칸을 채워 시험이 통과하고 '1개 실행, 실패 0'이 출력되게 하세요."
    starter: |-
      import io
      import unittest


      def add(a, b):
          return a + b


      class AddTest(unittest.TestCase):
          def test_add(self):
              self.assert_____(add(2, 3), 5)


      suite = unittest.defaultTestLoader.loadTestsFromTestCase(AddTest)
      result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
      print(f"{result.testsRun}개 실행, 실패 {len(result.failures)}")
    answer: |-
      import io
      import unittest


      def add(a, b):
          return a + b


      class AddTest(unittest.TestCase):
          def test_add(self):
              self.assertEqual(add(2, 3), 5)


      suite = unittest.defaultTestLoader.loadTestsFromTestCase(AddTest)
      result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
      print(f"{result.testsRun}개 실행, 실패 {len(result.failures)}")
    output: "1개 실행, 실패 0"
    hint: "두 값이 '같다'를 영어로 쓴 메서드입니다."
    explanation: "assertEqual(실제, 기대)는 다르면 두 값을 모두 보여 주는 실패 메시지를 만듭니다. 그냥 assert add(2, 3) == 5보다 실패했을 때 원인을 찾기 쉽습니다. 이름이 test_로 시작하는 메서드만 시험으로 모입니다. 보통은 python -m unittest 명령으로 실행하고, 여기서는 결과 글을 버리고 개수만 출력했습니다."
    commonMistakes:
      - "assertTrue(add(2, 3), 5)로 써서 5가 메시지가 되고 실제 비교는 하지 않음"
      - "메서드 이름을 test_로 시작하지 않아 시험이 0개 실행됨"
    language: python
    verification: run
  - id: ex-day55-modify
    title: 눈으로 보는 출력 시험을 assert로 바꾸기
    kind: modify
    objective: 사람이 출력을 읽어야 하는 확인을 자동으로 실패하는 assert로 바꾼다.
    prompt: "이 코드는 ok/bad를 출력해서 사람이 읽고 판단해야 합니다. 두 확인을 assert로 바꾸고, 모두 통과하면 '모두 통과' 한 줄만 출력되게 하세요."
    starter: |-
      def clamp(x, lo, hi):
          return max(lo, min(x, hi))


      print("ok" if clamp(15, 0, 10) == 10 else "bad")
      print("ok" if clamp(-5, 0, 10) == 0 else "bad")
    answer: |-
      def clamp(x, lo, hi):
          return max(lo, min(x, hi))


      assert clamp(15, 0, 10) == 10, "위쪽 자르기"
      assert clamp(-5, 0, 10) == 0, "아래쪽 자르기"
      print("모두 통과")
    output: "모두 통과"
    starterOutput: |-
      ok
      ok
    hint: "assert는 참이면 아무것도 하지 않고, 거짓이면 프로그램을 멈춥니다."
    explanation: "출력을 사람이 읽는 시험은 개수가 많아지면 bad 한 줄을 놓치기 쉽습니다. assert는 틀리면 멈추고 어느 확인이 틀렸는지 알려 주므로, 컴퓨터가 판정합니다. 이렇게 자동으로 판정되는 시험을 모아 두면, 코드를 고칠 때마다 한 번에 다시 돌려 볼 수 있습니다(회귀 시험)."
    commonMistakes:
      - 'assert (clamp(15, 0, 10) == 10, "메시지")처럼 괄호로 묶어 항상 참이 됨'
      - "print를 그대로 두어 사람이 여전히 읽어야 함"
    language: python
    verification: run
  - id: ex-day55-debug
    title: 항상 통과하는 assert와 숨은 버그 고치기
    kind: debug
    objective: 괄호로 묶여 항상 참이 되는 assert를 고치고, 그 뒤에 드러난 버그도 고친다.
    prompt: "이 코드는 '시험 통과'를 출력하지만, is_even에는 버그가 있습니다. assert가 괄호 때문에 항상 참(튜플)이라 버그를 잡지 못한 것입니다. assert를 고치고 is_even도 고쳐, 짝수·홀수 두 확인을 통과한 뒤 '시험 통과'가 출력되게 하세요."
    starter: |-
      def is_even(n):
          return n % 2 == 1


      assert (is_even(4), "4는 짝수")
      print("시험 통과")
    answer: |-
      def is_even(n):
          return n % 2 == 0


      assert is_even(4), "4는 짝수"
      assert not is_even(7), "7은 홀수"
      print("시험 통과")
    output: "시험 통과"
    starterOutput: "시험 통과"
    hint: "(조건, 메시지)는 비어 있지 않은 튜플이라 언제나 참입니다. Python은 이때 경고(SyntaxWarning)를 내지만 멈추지 않습니다."
    explanation: "assert는 함수가 아니라 문이라서 괄호가 필요 없습니다. 괄호로 묶으면 튜플 하나를 검사하게 되고, 비어 있지 않은 튜플은 참이라 아무것도 확인하지 않습니다. 이것을 고치면 assert is_even(4)가 곧바로 실패해 버그를 드러냅니다. 짝수는 나머지가 0입니다. 반대 경우(홀수)도 확인해야 '모든 것을 짝수라고 하는' 버그까지 잡을 수 있습니다."
    commonMistakes:
      - "assert만 고치고 is_even은 그대로 둬서 AssertionError가 남"
      - "짝수 확인만 넣어 return True 같은 버그를 놓침"
    language: python
    verification: run
  - id: ex-day55-independent
    title: Rust 모듈과 assert_eq 쓰기
    kind: independent
    objective: mod와 pub으로 함수를 모듈에 넣고, main에서 assert_eq!로 확인한다.
    prompt: "mod temp 안에 pub fn c_to_f(c: f64) -> f64를 만들고, main에서 100도가 212도, 0도가 32도인지 assert_eq!로 확인한 뒤 '통과'를 출력하세요."
    starter: |-
      fn main() {
          println!("여기에 mod temp와 시험을 만들어 보세요");
      }
    answer: |-
      mod temp {
          pub fn c_to_f(c: f64) -> f64 {
              c * 9.0 / 5.0 + 32.0
          }
      }

      fn main() {
          assert_eq!(temp::c_to_f(100.0), 212.0);
          assert_eq!(temp::c_to_f(0.0), 32.0);
          println!("통과");
      }
    output: "통과"
    hint: "모듈 안의 함수는 pub을 붙여야 밖에서 temp::c_to_f로 부를 수 있습니다."
    explanation: "mod temp { ... }는 같은 파일 안의 모듈이고, 파일로 나누면 temp.rs에 몸통을 쓰고 main.rs에는 mod temp;만 적습니다. pub이 없으면 E0603(private)입니다. assert_eq!(실제, 기대)는 다르면 두 값을 모두 보여 주며 패닉합니다. 실무에서는 #[cfg(test)] mod tests { #[test] fn ... }에 넣고 cargo test로 실행합니다. 실수는 정확히 같지 않을 수 있어서, 계산 결과를 비교할 때는 차이가 아주 작은지 확인하는 편이 안전합니다(이 두 값은 정확히 표현됩니다)."
    commonMistakes:
      - "pub을 빠뜨려 E0603이 남"
      - "temp.c_to_f처럼 점으로 불러 오류가 남(모듈 경로는 ::)"
    language: rust
    verification: run
quiz:
  - id: quiz-day55-01
    question: 모듈 파일 안에 if __name__ == "__main__":을 두는 이유는?
    choices:
      - 속도를 높이려고
      - 직접 실행할 때만 도는 코드(예시 실행, 간단한 시험)를, import할 때는 실행되지 않게 하려고
      - 모듈 이름을 바꾸려고
      - 반드시 있어야 해서
    answerIndex: 1
    explanation: import하면 모듈의 맨 위 코드가 모두 한 번 실행됩니다. print나 무거운 계산이 거기 있으면 불러다 쓰는 쪽이 원하지 않는 일이 생깁니다. 함수와 클래스 정의만 맨 위에 두고, 실행할 코드는 이 if 안에 둡니다.
  - id: quiz-day55-02
    question: 사용자 입력 검사에 assert를 쓰면 안 되는 이유는?
    choices:
      - 느려서
      - python -O로 실행하면 assert가 모두 사라져 검사가 없어지기 때문
      - 메시지를 쓸 수 없어서
      - 문법 오류라서
    answerIndex: 1
    explanation: assert는 '프로그래머의 가정'을 확인하는 도구라 최적화 실행에서 꺼질 수 있습니다. 사용자 입력처럼 언제나 틀릴 수 있는 것은 if와 raise ValueError로 검사하세요. C의 assert도 NDEBUG로 컴파일하면 사라집니다.
  - id: quiz-day55-03
    question: assert (x > 0, "양수여야 함")의 문제는?
    choices:
      - 문제없다
      - 괄호 때문에 비어 있지 않은 튜플을 검사해 항상 참이다
      - 메시지가 두 번 나온다
      - x를 바꾼다
    answerIndex: 1
    explanation: assert는 문이라 괄호가 필요 없습니다. assert x > 0, "양수여야 함"으로 쓰세요. Python은 SyntaxWarning을 내지만 프로그램은 계속 돕니다.
  - id: quiz-day55-04
    question: C에서 assert(++n == 1);을 쓰면 생기는 위험은?
    choices:
      - 없다
      - NDEBUG로 컴파일하면 assert 전체가 사라져 ++n도 실행되지 않는다
      - n이 두 번 늘어난다
      - 컴파일 오류
    answerIndex: 1
    explanation: assert 안에는 부작용(값 바꾸기, 함수 호출로 상태 바꾸기)이 없는 조건만 쓰세요. 꺼질 수 있는 코드에 꼭 필요한 동작을 넣으면, 디버그 빌드와 배포 빌드의 동작이 달라집니다. Rust의 debug_assert!도 같은 주의가 필요하고, assert!는 항상 실행됩니다.
  - id: quiz-day55-05
    question: 입력과 기대값을 표로 모은 시험(table driven test)의 장점은?
    choices:
      - 코드가 길어진다
      - 새 경우를 표에 한 줄 추가하는 것만으로 시험을 늘릴 수 있고, 모든 경우가 같은 방식으로 확인된다
      - 실패를 숨긴다
      - 자동으로 코드를 고친다
    answerIndex: 1
    explanation: 경계값(빈 목록, 한 칸, 짝수·홀수 길이)을 표로 나열하면 무엇을 확인했고 무엇이 빠졌는지 한눈에 보입니다. 세 언어 모두 같은 모양으로 쓸 수 있습니다.
---

## 1. 오늘 배울 내용

지금까지의 예제는 모두 파일 하나였고, 결과가 맞는지는 출력을 눈으로 보고 판단했습니다. 프로그램이 커지면 두 가지가 필요합니다. 코드를 **나눠 담는 것**과, 코드가 맞는지 **자동으로 확인하는 것**입니다.

1. **모듈**
   - Python 파일 하나가 모듈입니다. `import mystats`로 불러옵니다.
   - 모듈을 찾는 곳(`sys.path`)과 모듈 설명 문자열
   - 직접 실행할 때만 도는 코드: `if __name__ == "__main__":`
2. **assert**
   - `assert 조건, 메시지`: 가정이 틀리면 곧바로 멈춤
   - 사용자 입력 검사에는 쓰지 않기(`python -O`로 꺼짐)
   - 괄호로 묶으면 항상 참이 되는 함정
3. **시험 모으기**
   - `unittest.TestCase`, `assertEqual`, `assertRaises`
   - 입력과 기대값을 **표로** 모은 시험
4. 다른 두 언어
   - C: 헤더(`.h`)와 소스(`.c`) 나누기, `assert.h`와 `NDEBUG`, 직접 만든 `CHECK` 매크로
   - Rust: `mod`, `pub`, `use`, `assert!`·`assert_eq!`, `#[cfg(test)]` 시험 모듈
5. 작은 통계 모듈을 **파일로** 만들어 불러오고, 표 시험으로 확인합니다.

## 2. 왜 필요한가

프로그램을 고칠 때마다 가장 두려운 것은 "이걸 고쳤더니 다른 곳이 망가졌을까?"입니다.

- 출력을 눈으로 보는 확인은 경우가 늘어나면 놓치기 쉽고, 매번 다시 보기 귀찮습니다.
- 한 파일에 모든 함수가 있으면 무엇이 어디 있는지 찾기 어렵고, 다른 프로그램에서 다시 쓰기도 어렵습니다.
- 빈 목록, 한 칸짜리 목록 같은 **경계** 경우는 평소에 잘 안 나와서, 시험으로 일부러 넣지 않으면 한참 뒤에야 버그가 드러납니다.

모듈로 나누면 "통계 계산"처럼 한 가지 일을 하는 코드를 따로 두고 여러 곳에서 불러다 쓸 수 있습니다. 시험을 붙이면 컴퓨터가 매번 판정해 주므로, 겁내지 않고 코드를 고칠 수 있습니다. Day 57부터 만들 자료 구조와 알고리즘도 이렇게 시험하며 만듭니다.

## 3. 그림으로 이해하기

**모듈과 import.**

```text
프로젝트 폴더
├── main.py          import mystats
│                    mystats.mean([1, 2, 3])
└── mystats.py       def mean(xs): ...
                     def median(xs): ...
                     if __name__ == "__main__":   ← main.py가 import할 때는 실행 안 됨
                         print("직접 실행함")
```

**`__name__`의 값.**

```text
python mystats.py        → mystats.py 안의 __name__ == "__main__"
python main.py           → main.py 안의 __name__ == "__main__"
  (main.py가 import)      → mystats.py 안의 __name__ == "mystats"
```

**assert의 위치.** 프로그래머의 가정을 확인하는 것이지, 사용자 입력을 거르는 문이 아닙니다.

```text
사용자 입력 ──▶ [if 검사 + raise ValueError]  ← 언제나 켜져 있어야 함
                         │
                         ▼
               내부 함수들 [assert 가정]       ← 버그를 일찍 찾는 용도, 꺼질 수 있음
```

**표 시험.**

```text
┌──────────┬──────────────┬────────┐
│ 함수      │ 입력          │ 기대값   │
├──────────┼──────────────┼────────┤
│ mean     │ [1, 2, 3, 4] │ 2.5    │
│ mean     │ [5]          │ 5.0    │  ← 한 칸
│ median   │ [3, 1, 2]    │ 2      │  ← 홀수 길이
│ median   │ [4, 1, 3, 2] │ 2.5    │  ← 짝수 길이
│ median   │ [7, 7, 1]    │ 7      │  ← 같은 값
└──────────┴──────────────┴────────┘
for 한 줄: 실제 = 함수(입력); 실제 == 기대값?
```

## 4. 천천히 풀어보기

### 4.1 import의 모양

| 모양                       | 쓰는 법                            |
| -------------------------- | ---------------------------------- |
| `import mystats`           | `mystats.mean(xs)`                 |
| `import mystats as ms`     | `ms.mean(xs)`                      |
| `from mystats import mean` | `mean(xs)`                         |
| `from mystats import *`    | 무엇이 들어왔는지 알기 어려워 피함 |

Python은 `sys.path`의 폴더들(실행한 파일이 있는 폴더, 설치된 라이브러리 폴더 등)에서 `mystats.py`를 찾습니다. 모듈은 처음 import할 때 **한 번만** 실행되고, 이후에는 이미 불러온 것을 씁니다. 자기 파일 이름을 `random.py`처럼 표준 모듈과 같게 지으면 표준 모듈 대신 자기 파일이 불려 오니 조심하세요.

### 4.2 assert와 예외

| 쓰는 곳                   | 도구                            | 이유                                        |
| ------------------------- | ------------------------------- | ------------------------------------------- |
| 사용자 입력, 파일 내용    | `if ...: raise ValueError(...)` | 언제나 틀릴 수 있고, 언제나 검사해야 함     |
| 함수 안의 가정, 불변 조건 | `assert 조건, 메시지`           | 틀리면 버그. 일찍 멈춰 원인 가까이에서 발견 |
| 시험                      | `assert`, `assertEqual` 등      | 기대한 결과인지 판정                        |

`python -O 파일.py`로 실행하면 모든 `assert`가 사라집니다. 그래서 `assert`에 꼭 필요한 동작을 넣으면 안 됩니다.

### 4.3 unittest의 기본

```python
class ClampTest(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)
```

- `unittest.TestCase`를 물려받은 클래스의, 이름이 `test_`로 시작하는 메서드가 시험입니다.
- `assertEqual(a, b)`, `assertTrue(x)`, `assertRaises(오류)` 등을 씁니다. 실패하면 두 값을 모두 보여 줘서 원인을 찾기 쉽습니다.
- 보통은 터미널에서 `python -m unittest`로 실행해 폴더 안의 시험을 모두 찾아 돌립니다. 실무에서는 더 짧게 쓸 수 있는 `pytest`도 많이 씁니다.

### 4.4 C와 Rust에서는

**C**는 모듈 대신 **헤더와 소스**로 나눕니다(아래는 모양만 보여 주는 예로, 검사하지 않는 코드입니다).

```c
/* stats.h — 다른 파일에 보여 줄 선언 */
double stats_mean(const double xs[], int n);

/* stats.c — 실제 몸통 */
#include "stats.h"
double stats_mean(const double xs[], int n) { ... }

/* main.c — 쓰는 쪽 */
#include "stats.h"
```

`gcc main.c stats.c -o app`으로 함께 컴파일합니다. `assert(조건)`은 `<assert.h>`에 있고, `-DNDEBUG`로 컴파일하면 사라집니다.

**Rust**는 `mod 이름 { ... }` 또는 `mod 이름;`(파일 `이름.rs`)으로 모듈을 만들고, `pub`을 붙인 것만 밖에서 보입니다. `use`로 이름을 가져옵니다. 시험은 `#[cfg(test)] mod tests { #[test] fn ... }`에 쓰고 `cargo test`로 실행합니다. 이 과정의 예제는 `cargo` 없이 파일 하나로 검사하므로, 시험 모듈은 모양만 넣어 두고 확인은 `main`의 `assert_eq!`로 합니다.

## 5. Python으로 구현하기

```python
# 파일: module_and_assert.py
import io
import unittest


def clamp(x, lo, hi):
    """x를 [lo, hi] 범위로 자른다."""
    assert lo <= hi, f"범위가 거꾸로임: {lo} > {hi}"   # 부르는 쪽의 실수를 일찍 알린다
    return max(lo, min(x, hi))


def word_count(text):
    return len(text.split())


# 1) assert로 짧게 확인하기
assert clamp(5, 0, 10) == 5
assert clamp(-3, 0, 10) == 0
assert word_count("시간은 삶이다") == 2
print("assert 세 개 통과")

try:
    clamp(1, 10, 0)
except AssertionError as e:
    print("AssertionError:", e)


# 2) unittest로 이름 붙은 시험 모으기
class ClampTest(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_edges(self):
        self.assertEqual(clamp(10, 0, 10), 10)
        self.assertEqual(clamp(11, 0, 10), 10)

    def test_reversed_range(self):
        with self.assertRaises(AssertionError):
            clamp(1, 10, 0)

    def test_word_count_empty(self):
        self.assertEqual(word_count(""), 0)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(ClampTest)
result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)   # 결과 글은 버리고
print(f"unittest: {result.testsRun}개 실행, 실패 {len(result.failures)}, 오류 {len(result.errors)}")

# 3) 모듈로 쓸 때와 직접 실행할 때
print("__name__ =", __name__)
if __name__ == "__main__":                  # 다른 파일이 import하면 이 부분은 실행되지 않는다
    print("직접 실행되었다")
```

실행 결과:

```text
assert 세 개 통과
AssertionError: 범위가 거꾸로임: 10 > 0
unittest: 4개 실행, 실패 0, 오류 0
__name__ = __main__
직접 실행되었다
```

### 코드 한 부분씩 읽기

| 코드                                                                    | 설명                                                                                                                             |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `"""x를 [lo, hi] 범위로 자른다."""`                                     | 함수의 설명 문자열(docstring)입니다. `help(clamp)`나 편집기가 보여 줍니다.                                                       |
| `assert lo <= hi, f"범위가 거꾸로임: {lo} > {hi}"`                      | 부르는 쪽이 범위를 거꾸로 주는 것은 **버그**이므로 `assert`로 일찍 알립니다. 메시지에 값을 넣어 원인을 바로 알 수 있게 했습니다. |
| `assert clamp(5, 0, 10) == 5`                                           | 가장 짧은 시험입니다. 통과하면 아무 출력도 없습니다.                                                                             |
| `class ClampTest(unittest.TestCase)`                                    | 시험을 이름 붙여 모읍니다. 경계(`10`, `11`)와 오류 경우(`assertRaises`)를 따로 확인했습니다.                                     |
| `with self.assertRaises(AssertionError):`                               | 블록 안에서 그 예외가 **나야** 통과입니다. 나지 않으면 실패입니다.                                                               |
| `unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)` | 실행 시간 같은 매번 다른 글은 버리고, 개수만 출력했습니다. 평소에는 `python -m unittest`로 실행해 글을 그대로 봅니다.            |
| `if __name__ == "__main__":`                                            | 이 파일을 직접 실행했으니 참입니다. 다른 파일이 import했다면 거짓이라 출력되지 않습니다.                                         |

## 6. C로 구현하기

```c
// 파일: c_assert.c
#include <assert.h>
#include <stdio.h>

static int tests_run = 0, tests_failed = 0;

#define CHECK(cond)                                                     \
    do {                                                                \
        tests_run++;                                                    \
        if (!(cond)) {                                                  \
            tests_failed++;                                             \
            printf("실패: %s (%s:%d)\n", #cond, "c_assert.c", __LINE__); \
        }                                                               \
    } while (0)

int clamp(int x, int lo, int hi) {
    assert(lo <= hi);                       // NDEBUG로 컴파일하면 사라진다
    return x < lo ? lo : (x > hi ? hi : x);
}

int word_count(const char *s) {
    int n = 0, in_word = 0;
    for (; *s; s++) {
        if (*s == ' ') {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            n++;
        }
    }
    return n;
}

int main(void) {
    CHECK(clamp(5, 0, 10) == 5);
    CHECK(clamp(-3, 0, 10) == 0);
    CHECK(clamp(11, 0, 10) == 10);
    CHECK(word_count("a  b c") == 3);
    CHECK(word_count("") == 0);
    CHECK(word_count(" x ") == 2);          // 일부러 틀린 기대값(실제는 1)
    printf("%d개 중 %d개 실패\n", tests_run, tests_failed);
    return 0;
}
```

실행 결과:

```text
실패: word_count(" x ") == 2 (c_assert.c:40)
6개 중 1개 실패
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#define CHECK(cond) do { ... } while (0)` | 조건을 확인하고 실패하면 **멈추지 않고** 기록합니다. 그래서 여러 시험의 결과를 한 번에 볼 수 있습니다. `do { } while (0)`은 매크로를 문장 하나처럼 쓰기 위한 관용구입니다. |
| `#cond`                                    | 매크로 인자를 **글자 그대로** 문자열로 바꿉니다. 실패 메시지에 조건식이 보이는 이유입니다.                                                                                 |
| `__LINE__`                                 | 그 줄의 번호로 바뀌는 특별한 이름입니다. 파일 이름은 `__FILE__`로도 얻을 수 있지만, 검사 환경마다 경로가 달라서 직접 적었습니다.                                           |
| `assert(lo <= hi);`                        | 표준 `assert`는 실패하면 메시지를 출력하고 프로그램을 **멈춥니다**(`abort`). 가정 확인에 씁니다.                                                                           |
| `CHECK(word_count(" x ") == 2);`           | 기대값을 일부러 틀리게 적어, 실패가 어떻게 보이는지 확인했습니다. 실제 값은 1입니다.                                                                                       |

C 표준 라이브러리에는 시험 모음 도구가 없어서, 실무에서는 Unity, CMocka, Check 같은 라이브러리나 오늘처럼 작은 매크로를 씁니다.

## 7. Rust로 구현하기

```rust
// 파일: rust_modules.rs
mod textutil {                              // 파일 안의 모듈(따로 파일로 나눌 수도 있다)
    pub fn clamp(x: i32, lo: i32, hi: i32) -> i32 {
        assert!(lo <= hi, "범위가 거꾸로임: {lo} > {hi}");
        x.max(lo).min(hi)
    }

    pub fn word_count(text: &str) -> usize {
        text.split_whitespace().count()
    }

    fn helper() -> &'static str {           // pub이 없으면 모듈 밖에서 보이지 않는다
        "비공개"
    }

    pub fn uses_helper() -> String {
        format!("안에서는 {}", helper())
    }

    #[cfg(test)]                            // cargo test 때만 컴파일되는 시험 모듈
    mod tests {
        use super::*;

        #[test]
        fn edges() {
            assert_eq!(clamp(11, 0, 10), 10);
        }
    }
}

use textutil::{clamp, word_count};

fn main() {
    assert_eq!(clamp(5, 0, 10), 5);
    assert_eq!(clamp(-3, 0, 10), 0);
    assert_eq!(word_count("시간은 삶이다"), 2);
    assert!(word_count("") == 0, "빈 문자열은 0단어");
    println!("assert 네 개 통과");
    println!("{}", textutil::uses_helper());

    let r = std::panic::catch_unwind(|| clamp(1, 10, 0));   // 패닉을 잡아 보기(시험용)
    println!("거꾸로 된 범위는 패닉? {}", r.is_err());
}
```

실행 결과:

```text
assert 네 개 통과
안에서는 비공개
거꾸로 된 범위는 패닉? true
```

### 코드 한 부분씩 읽기

| 코드                                             | 설명                                                                                                                                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mod textutil { ... }`                           | 파일 안에 모듈을 만들었습니다. 파일로 나누면 `textutil.rs`에 몸통을 두고 `mod textutil;`만 적습니다.                                                                          |
| `pub fn clamp(...)` / `fn helper()`              | `pub`이 있는 것만 모듈 밖에서 보입니다. `textutil::helper()`를 밖에서 부르면 E0603입니다. Python의 밑줄 약속을 컴파일러가 강제합니다.                                         |
| `assert!(lo <= hi, "범위가 거꾸로임: ...")`      | 거짓이면 메시지와 함께 패닉합니다. Rust의 `assert!`는 **배포 빌드에서도 켜져** 있고, 꺼져도 되는 확인은 `debug_assert!`를 씁니다.                                             |
| `#[cfg(test)] mod tests { #[test] fn edges() }`  | `cargo test` 때만 컴파일되는 시험 모듈입니다. `use super::*;`로 바깥 모듈의 함수를 가져옵니다. 이 과정의 검사는 이 부분을 돌리지 않습니다.                                    |
| `use textutil::{clamp, word_count};`             | 모듈 경로를 매번 적지 않도록 이름을 가져왔습니다. Python의 `from textutil import clamp, word_count`입니다.                                                                    |
| `assert_eq!(clamp(5, 0, 10), 5);`                | 다르면 두 값을 모두 보여 주며 패닉합니다. Python의 `assertEqual`에 해당합니다.                                                                                                |
| `std::panic::catch_unwind(\|\| clamp(1, 10, 0))` | 패닉을 잡아 결과로 바꿉니다. 시험에서 "패닉이 나야 한다"를 확인할 때만 쓰고, 오류 처리에는 `Result`를 씁니다. 패닉 메시지는 표준 오류로 나가서 실행 결과에는 보이지 않습니다. |

## 8. 실행 추적

Python의 `unittest`가 `ClampTest`를 돌리는 과정을 따라갑니다.

| 순서 | 시험 메서드             | 확인                                               | 결과 |
| ---- | ----------------------- | -------------------------------------------------- | ---- |
| 1    | `test_edges`            | `clamp(10, 0, 10) == 10`, `clamp(11, 0, 10) == 10` | 통과 |
| 2    | `test_inside`           | `clamp(5, 0, 10) == 5`                             | 통과 |
| 3    | `test_reversed_range`   | `clamp(1, 10, 0)`이 `AssertionError`를 냄          | 통과 |
| 4    | `test_word_count_empty` | `word_count("") == 0`                              | 통과 |

`unittest`는 메서드를 **이름 순서로** 실행합니다(그래서 `test_edges`가 먼저). 시험끼리 순서에 기대면 안 됩니다. 각 시험은 따로 준비하고 따로 확인해야, 하나가 실패해도 다른 시험의 결과를 믿을 수 있습니다.

## 9. 다른 예제로 다시 이해하기

**통계 모듈 만들고 시험하기.** 평균과 중앙값을 계산하는 `mystats.py`를 **진짜 파일로** 만들고, 그것을 import해서 표 시험으로 확인합니다. 빈 목록은 `ValueError`여야 합니다.

```python
# 파일: stats_module.py
import importlib
import sys
from pathlib import Path

# 1) 모듈 파일을 하나 만든다(보통은 편집기로 직접 쓴다)
Path("mystats.py").write_text('''\
"""작은 통계 모듈"""


def mean(xs):
    if not xs:
        raise ValueError("빈 목록의 평균")
    return sum(xs) / len(xs)


def median(xs):
    if not xs:
        raise ValueError("빈 목록의 중앙값")
    s = sorted(xs)
    mid = len(s) // 2
    return s[mid] if len(s) % 2 else (s[mid - 1] + s[mid]) / 2


if __name__ == "__main__":
    print("mystats를 직접 실행함")
''', encoding="utf-8")

sys.path.insert(0, ".")                     # 지금 폴더에서 모듈을 찾게 한다
mystats = importlib.import_module("mystats")   # import mystats 와 같다
print("모듈 이름:", mystats.__name__, "/ 설명:", mystats.__doc__)

# 2) 표로 만든 시험: (함수, 입력, 기대값)
cases = [
    (mystats.mean, [1, 2, 3, 4], 2.5),
    (mystats.mean, [5], 5.0),
    (mystats.median, [3, 1, 2], 2),
    (mystats.median, [4, 1, 3, 2], 2.5),
    (mystats.median, [7, 7, 1], 7),
]
passed = 0
for func, arg, expected in cases:
    got = func(arg)
    ok = got == expected
    passed += ok
    print(f"{'통과' if ok else '실패'}: {func.__name__}({arg}) = {got}")
print(f"{passed}/{len(cases)} 통과")

for func in (mystats.mean, mystats.median):
    try:
        func([])
    except ValueError as e:
        print(f"{func.__name__}([]) → ValueError: {e}")
Path("mystats.py").unlink()
```

실행 결과:

```text
모듈 이름: mystats / 설명: 작은 통계 모듈
통과: mean([1, 2, 3, 4]) = 2.5
통과: mean([5]) = 5.0
통과: median([3, 1, 2]) = 2
통과: median([4, 1, 3, 2]) = 2.5
통과: median([7, 7, 1]) = 7
5/5 통과
mean([]) → ValueError: 빈 목록의 평균
median([]) → ValueError: 빈 목록의 중앙값
```

| 코드                                                             | 설명                                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Path("mystats.py").write_text('''...''')`                       | 예제 하나로 보여 주려고 모듈 파일을 코드로 만들었습니다. 평소에는 편집기로 `mystats.py`를 직접 씁니다.                    |
| `"""작은 통계 모듈"""`(모듈 맨 위)                               | 모듈의 설명 문자열입니다. `mystats.__doc__`로 읽을 수 있습니다.                                                           |
| `raise ValueError("빈 목록의 평균")`                             | 빈 목록은 부르는 쪽이 줄 수 있는 **입력**이라 `assert`가 아닌 예외로 알립니다.                                            |
| `sys.path.insert(0, ".")` / `importlib.import_module("mystats")` | 지금 폴더에서 모듈을 찾게 하고, 이름으로 불러왔습니다. `import mystats`와 같습니다. 방금 만든 파일이라 이렇게 불렀습니다. |
| `if __name__ == "__main__":`(모듈 안)                            | import했으므로 "mystats를 직접 실행함"은 출력되지 않았습니다.                                                             |
| `cases = [(함수, 입력, 기대값), ...]`                            | 표 시험입니다. 한 칸, 홀수·짝수 길이, 같은 값처럼 경계 경우를 줄마다 넣었습니다.                                          |
| `passed += ok`                                                   | `True`는 1, `False`는 0으로 더해집니다.                                                                                   |

Rust에서도 표 시험은 같은 모양입니다. 함수도 값이라 표에 담을 수 있습니다.

```rust
// 파일: stats_module.rs
mod stats {
    //! 작은 통계 모듈

    pub fn mean(xs: &[f64]) -> Option<f64> {
        if xs.is_empty() {
            return None;
        }
        Some(xs.iter().sum::<f64>() / xs.len() as f64)
    }

    pub fn median(xs: &[f64]) -> Option<f64> {
        if xs.is_empty() {
            return None;
        }
        let mut s = xs.to_vec();
        s.sort_by(|a, b| a.total_cmp(b));
        let mid = s.len() / 2;
        Some(if s.len() % 2 == 1 { s[mid] } else { (s[mid - 1] + s[mid]) / 2.0 })
    }
}

fn main() {
    type StatFn = fn(&[f64]) -> Option<f64>;   // 함수도 값이다: 표에 담을 수 있다
    let cases: [(&str, StatFn, &[f64], Option<f64>); 6] = [
        ("mean", stats::mean, &[1.0, 2.0, 3.0, 4.0], Some(2.5)),
        ("mean", stats::mean, &[5.0], Some(5.0)),
        ("median", stats::median, &[3.0, 1.0, 2.0], Some(2.0)),
        ("median", stats::median, &[4.0, 1.0, 3.0, 2.0], Some(2.5)),
        ("median", stats::median, &[7.0, 7.0, 1.0], Some(7.0)),
        ("mean", stats::mean, &[], None),
    ];
    let mut passed = 0;
    for (name, f, input, expected) in cases {
        let got = f(input);
        let ok = got == expected;
        if ok {
            passed += 1;
        }
        println!("{}: {name}({input:?}) = {got:?}", if ok { "통과" } else { "실패" });
    }
    println!("{passed}/{} 통과", cases.len());
    assert_eq!(passed, cases.len(), "모든 시험이 통과해야 한다");
}
```

실행 결과:

```text
통과: mean([1.0, 2.0, 3.0, 4.0]) = Some(2.5)
통과: mean([5.0]) = Some(5.0)
통과: median([3.0, 1.0, 2.0]) = Some(2.0)
통과: median([4.0, 1.0, 3.0, 2.0]) = Some(2.5)
통과: median([7.0, 7.0, 1.0]) = Some(7.0)
통과: mean([]) = None
6/6 통과
```

- `//! 작은 통계 모듈`은 모듈 자체의 문서 주석입니다. `cargo doc`이 이것으로 문서를 만듭니다.
- 빈 목록은 `None`으로 알립니다. Python의 예외, C의 반환 코드에 해당합니다.
- `type StatFn = fn(&[f64]) -> Option<f64>;`는 함수 자료형에 이름을 붙였습니다. `stats::mean`과 `stats::median`이 같은 자료형이라 한 표에 담깁니다.
- 마지막 `assert_eq!(passed, cases.len(), ...)`는 하나라도 실패하면 프로그램을 실패로 끝내서, 자동 검사 도구(CI)가 알아챌 수 있게 합니다.

## 10. 모듈과 시험 대응표

| 하고 싶은 일     | Python                        | C                               | Rust                                 |
| ---------------- | ----------------------------- | ------------------------------- | ------------------------------------ |
| 코드 나누기      | 파일 = 모듈                   | `.h` 선언 + `.c` 몸통           | `mod 이름;` + `이름.rs`              |
| 불러오기         | `import m`, `from m import f` | `#include "m.h"` + 함께 컴파일  | `use m::f;`                          |
| 밖에 보이기      | 모두(밑줄은 약속)             | 헤더에 적은 것, `static`은 숨김 | `pub`을 붙인 것만                    |
| 직접 실행할 때만 | `if __name__ == "__main__":`  | `main` 함수가 있는 파일         | `main.rs`의 `fn main`                |
| 가정 확인        | `assert 조건, 메시지`         | `assert(조건)`                  | `assert!`, `debug_assert!`           |
| 끌 수 있나       | `python -O`로 꺼짐            | `-DNDEBUG`로 꺼짐               | `debug_assert!`만 배포 빌드에서 꺼짐 |
| 같음 확인        | `assertEqual`                 | 직접(`CHECK`)                   | `assert_eq!`                         |
| 시험 모으기      | `unittest`, `pytest`          | 라이브러리 또는 직접            | `#[test]` + `cargo test`             |

## 11. 세 언어 비교

| 관점              | Python          | C               | Rust                   |
| ----------------- | --------------- | --------------- | ---------------------- |
| 모듈의 경계       | 파일            | 헤더/소스(약속) | `mod`(컴파일러가 강제) |
| 공개·비공개       | 관례            | `static`, 헤더  | `pub`                  |
| 시험 도구         | 표준 `unittest` | 표준에 없음     | 언어와 `cargo`에 내장  |
| assert가 배포에서 | `-O`면 꺼짐     | `NDEBUG`면 꺼짐 | `assert!`는 켜짐       |

## 12. 자주 하는 실수

### 실수 1: assert를 괄호로 묶는다 (Python)

```python
# 파일: assert_tuple.py
x = 2
assert (x == 1, "x는 1이어야 함")
print("통과해 버렸다")
```

실행 결과:

```text
통과해 버렸다
```

`(조건, 메시지)`는 비어 있지 않은 튜플이라 항상 참입니다. Python은 표준 오류로 SyntaxWarning을 내지만 멈추지 않습니다. `assert x == 1, "x는 1이어야 함"`으로 쓰세요.

### 실수 2: assert 안에 꼭 필요한 동작을 넣는다 (C)

```c
// 파일: ndebug_side_effect.c
#define NDEBUG
#include <assert.h>
#include <stdio.h>

int main(void) {
    int n = 0;
    assert(++n == 1);
    printf("n = %d\n", n);
    return 0;
}
```

실행 결과:

```text
n = 0
```

`NDEBUG`가 정의되면 `assert(...)` 전체가 사라져 `++n`도 실행되지 않습니다. 필요한 동작은 `assert` 밖에서 하고, 결과만 확인하세요. Python의 `-O`도 같습니다.

### 실수 3: 모듈 밖에서 비공개 함수를 부른다 (Rust)

```rust
// 파일: private_fn.rs (컴파일 오류: E0603)
mod textutil {
    fn helper() -> &'static str {
        "비공개"
    }
}

fn main() {
    println!("{}", textutil::helper());
}
```

밖에서 써야 하면 `pub fn`으로 공개하세요. 공개하지 않아도 되는 도우미는 그대로 두는 것이 좋습니다.

### 실수 4: 사용자 입력을 assert로 검사한다 (세 언어)

`assert age >= 0`은 `-O`로 실행하면 사라지고, 실패해도 사용자에게 도움이 안 되는 `AssertionError`만 보입니다. 입력 검사는 `if`와 예외(`ValueError`), Rust의 `Result`로 하세요.

### 실수 5: 행복한 경우만 시험한다

`mean([1, 2, 3])`만 확인하면 빈 목록, 한 칸, 음수, 아주 큰 값에서의 버그를 놓칩니다. 표 시험에 **경계 경우**를 일부러 넣고, 오류가 나야 하는 경우(`assertRaises`, `None`)도 확인하세요.

## 13. Q&A

**Q. 시험은 코드를 쓴 뒤에 만드나요, 먼저 만드나요?**

A. 둘 다 씁니다. 먼저 시험을 쓰고 그 시험을 통과하도록 코드를 쓰는 방식을 시험 주도 개발(TDD)이라고 합니다. 무엇을 만들지 분명해지는 장점이 있습니다. 적어도 버그를 고칠 때는 **그 버그를 재현하는 시험을 먼저** 만들어 두면, 같은 버그가 다시 생기지 않았는지 늘 확인할 수 있습니다.

**Q. 모듈과 패키지는 무엇이 다른가요?**

A. Python에서 파일 하나가 모듈이고, 모듈 여러 개를 담은 폴더가 패키지입니다(`mypkg/__init__.py`, `mypkg/stats.py` → `from mypkg import stats`). Rust에서는 모듈이 코드 안의 단위이고, `cargo`로 만드는 배포 단위를 크레이트라고 합니다.

**Q. 시험이 모두 통과하면 버그가 없는 건가요?**

A. 아니요. 시험은 **확인한 경우**에 버그가 없다는 것만 알려 줍니다. 그래서 어떤 경우를 확인할지 고르는 것이 중요합니다. 경계값, 빈 입력, 오류 경우, 이전에 났던 버그를 표에 모아 두세요.

**Q. 이 과정의 레슨들도 시험을 거치나요?**

A. 네. 레슨에 있는 C, Python, Rust 프로그램은 모두 실제로 컴파일하고 실행해서, 적힌 "실행 결과"와 똑같은지 자동으로 확인합니다. 오류를 보여 주는 예제는 적힌 오류 메시지가 정말 나는지 확인합니다. 오늘 배운 표 시험과 같은 생각입니다.

## 14. 핵심 요약

- Python 파일 하나가 **모듈**입니다. `import`로 불러오고, 직접 실행할 때만 돌아야 하는 코드는 `if __name__ == "__main__":` 안에 둡니다.
- `assert 조건, 메시지`는 **프로그래머의 가정**을 확인합니다. `-O`로 꺼질 수 있으니 사용자 입력 검사에는 예외를 쓰고, 괄호로 묶지 마세요.
- `unittest.TestCase`의 `test_` 메서드와 `assertEqual`·`assertRaises`로 시험을 모으고, 입력과 기대값을 **표로** 모아 경계 경우까지 확인합니다.
- C는 헤더·소스로 나누고, `assert`는 `NDEBUG`로 꺼지며, 시험 도구는 매크로나 라이브러리로 만듭니다. `assert` 안에 부작용을 넣지 마세요.
- Rust는 `mod`·`pub`·`use`로 모듈을 나누고 비공개를 강제하며, `assert!`·`assert_eq!`와 `#[cfg(test)]`, `cargo test`로 시험합니다.

## 15. 도전 문제

1. **(Python)** `mystats`에 `mode(xs)`(가장 많이 나온 값, 여럿이면 가장 작은 값)를 추가하고, 표 시험에 세 줄 이상 추가하세요. 빈 목록은 `ValueError`여야 합니다.
2. **(Python)** 통계 시험을 `unittest.TestCase`로 옮기고, `self.subTest(arg=arg)`를 써서 표의 각 줄이 따로 보고되게 하세요.
3. **(C)** `CHECK` 매크로를 `CHECK_EQ_INT(a, b)`로 바꿔, 실패하면 두 값을 모두 출력하게 하세요. `stats.h`와 `stats.c`로 나눈 평균 함수를 만들고 `main.c`에서 시험하세요(`gcc main.c stats.c`).
4. **(Rust)** 통계 모듈을 `cargo new stats_demo`로 만든 프로젝트에 `src/stats.rs`로 옮기고, `#[cfg(test)] mod tests`에 표 시험을 넣어 `cargo test`로 실행해 보세요.
