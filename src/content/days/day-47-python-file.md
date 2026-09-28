---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-47-python-file
courseId: crp-92
phaseId: phase-04
dayNumber: 47
date: "2026-11-16"
title: Python 파일형 객체와 예외
summary: Python에서 "파일처럼 쓸 수 있는 객체"(read·write·줄 단위 반복을 가진 객체)를 받도록 함수를 만들면, 진짜 파일·메모리 안의 io.StringIO·표준 입출력 모두에 같은 코드를 쓸 수 있습니다. pathlib의 Path.read_text·write_text, 텍스트와 바이트 모드, 인코딩 오류, OSError 가족(FileNotFoundError·PermissionError·IsADirectoryError), try·except·else·finally의 실행 순서, 원인을 이어 주는 raise ... from, 줄 번호를 담은 직접 만든 예외를 다룹니다. C의 FILE *(stdout·stderr도 FILE *)와 Rust의 impl BufRead·impl Write·Cursor와 비교하고, 성적 CSV를 읽으며 잘못된 줄을 줄 번호와 함께 알려 주는 읽기 함수를 StringIO로 시험해 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-46-c-file]
learningObjectives:
  - 파일 경로 대신 파일형 객체를 받는 함수를 만들고, io.StringIO로 파일 없이 시험한다.
  - 텍스트 모드와 바이트 모드, 인코딩 지정의 차이를 설명하고 pathlib로 파일을 읽고 쓴다.
  - OSError 가족의 예외를 구체적인 것부터 잡고, try·except·else·finally의 실행 순서를 추적한다.
  - 직접 만든 예외 클래스와 raise ... from으로 줄 번호와 원인을 함께 전한다.
  - C의 FILE *와 Rust의 BufRead·Write 트레이트가 같은 생각을 어떻게 표현하는지 비교한다.
concepts:
  [
    file like object,
    duck typing,
    stringio,
    pathlib,
    text mode,
    binary mode,
    encoding,
    oserror,
    filenotfounderror,
    try except else finally,
    custom exception,
    exception chaining,
    raise from,
    stdout,
    stderr,
    cursor,
    bufread,
    write trait,
  ]
runnerMode: python
playgroundSource: |
  # 파일: stringio_play.py — 파일 없이 '파일'을 만들어 봅니다.
  import io

  def count_words(f):
      return sum(len(line.split()) for line in f)

  fake = io.StringIO("시간은 삶이다\n모모는 듣는다\n")
  print(count_words(fake))
  out = io.StringIO()
  out.write("민지: 92\n")
  print(repr(out.getvalue()))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day47-predict-finally
    title: else와 finally의 순서 예측하기
    kind: predict
    objective: return이 있어도 finally가 먼저 실행된다는 것을 추적한다.
    prompt: 출력되는 두 줄을 그대로 적으세요.
    starter: |-
      def f(x):
          try:
              r = 10 // x
          except ZeroDivisionError:
              return "zero"
          else:
              return f"ok {r}"
          finally:
              print("finally", end=" ")

      print(f(2))
      print(f(0))
    answer: |-
      finally ok 5
      finally zero
    hint: "return을 만나도 함수를 나가기 전에 finally가 실행됩니다. 그다음에 돌려준 값이 print됩니다."
    explanation: 'f(2)는 오류 없이 else의 return으로 가는데, 함수를 나가기 직전에 finally가 "finally "를 출력합니다. 그 뒤에 바깥의 print가 돌려받은 "ok 5"를 출력해 한 줄이 됩니다. f(0)은 except의 return으로 가고 역시 finally가 먼저입니다. finally는 파일 닫기처럼 ''어떤 경로로 나가든'' 해야 하는 일에 씁니다.'
    commonMistakes:
      - "ok 5가 finally보다 먼저 나온다고 생각함"
      - "except로 간 경우에는 finally가 실행되지 않는다고 생각함"
    language: python
    verification: run
  - id: ex-day47-predict-stringio
    title: StringIO의 읽기 위치 예측하기
    kind: predict
    objective: 쓴 뒤 읽기 위치가 끝에 있다는 것과 getvalue의 차이를 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      import io

      buf = io.StringIO()
      buf.write("ab")
      buf.write("cd")
      print(repr(buf.read()), buf.getvalue())
    answer: "'' abcd"
    hint: "파일형 객체에는 '지금 위치'가 있습니다. 쓰고 나면 위치는 끝에 있습니다."
    explanation: "write는 위치를 뒤로 옮기므로, 곧바로 read()를 하면 끝에서 읽어 빈 문자열입니다. getvalue()는 위치와 상관없이 전체 내용을 돌려줍니다. buf.seek(0)으로 처음으로 돌아가면 read()가 'abcd'를 줍니다. 진짜 파일도 같은 규칙이라, 쓰던 파일을 읽으려면 위치를 옮기거나 다시 열어야 합니다."
    commonMistakes:
      - "read()가 쓴 내용 전체를 돌려준다고 생각함"
      - "write가 덮어써서 cd만 남는다고 생각함"
    language: python
    verification: run
  - id: ex-day47-fill
    title: 없는 파일만 골라 잡기 채우기
    kind: fill
    objective: OSError 가족 중 알맞은 구체적 예외를 잡는다.
    prompt: "빈칸을 채워 없는 파일을 읽을 때 '없음'이 출력되게 하세요."
    starter: |-
      from pathlib import Path

      try:
          Path("no_such_file.txt").read_text(encoding="utf-8")
      except _____:
          print("없음")
    answer: |-
      from pathlib import Path

      try:
          Path("no_such_file.txt").read_text(encoding="utf-8")
      except FileNotFoundError:
          print("없음")
    output: "없음"
    hint: "C의 errno == ENOENT에 해당하는 예외 이름입니다."
    explanation: "FileNotFoundError는 OSError의 자식입니다. except OSError로 써도 잡히지만, 권한 문제나 디스크 오류까지 '없음'으로 잘못 처리하게 됩니다. 처리 방법이 다른 오류는 구체적인 예외로 따로 잡고, 나머지는 위로 올려 보내는 것이 좋습니다. except Exception이나 빈 except:는 프로그램의 버그까지 숨깁니다."
    commonMistakes:
      - "except Exception으로 모든 오류를 '없음'으로 처리함"
      - "IOError처럼 옛 이름을 씀(지금은 OSError의 다른 이름)"
    language: python
    verification: run
  - id: ex-day47-modify
    title: 경로 대신 파일형 객체를 받게 바꾸기
    kind: modify
    objective: 함수가 파일을 직접 열지 않게 해서 StringIO로 시험할 수 있게 한다.
    prompt: "total은 경로를 받아 직접 파일을 엽니다. 파일형 객체 f를 받도록 바꾸고, 파일을 만들지 않고 io.StringIO(\"minji 92\\njunho 85\\n\")으로 시험해 '177'을 출력하세요."
    starter: |-
      from pathlib import Path


      def total(path):
          with open(path, encoding="utf-8") as f:
              return sum(int(line.split()[1]) for line in f)


      Path("s.txt").write_text("minji 92\njunho 85\n", encoding="utf-8")
      print(total("s.txt"))
      Path("s.txt").unlink()
    answer: |-
      import io


      def total(f):
          return sum(int(line.split()[1]) for line in f)


      print(total(io.StringIO("minji 92\njunho 85\n")))
    output: "177"
    starterOutput: "177"
    hint: "열고 닫는 일은 부르는 쪽에 맡기고, 함수는 줄을 도는 일만 하세요."
    explanation: "함수가 경로를 받으면 시험할 때마다 진짜 파일을 만들고 지워야 합니다. 파일형 객체를 받으면 StringIO, 진짜 파일(with open(...) as f: total(f)), 표준 입력(sys.stdin)을 모두 넘길 수 있습니다. '어디서 읽는가'와 '어떻게 계산하는가'를 나누면 함수가 단순해지고 시험하기 쉬워집니다."
    commonMistakes:
      - "함수 안에서 f.close()를 불러 부른 쪽이 계속 쓸 수 없게 함"
      - "f.read().split()으로 바꿔 이름과 점수가 섞임"
    language: python
    verification: run
  - id: ex-day47-debug
    title: 바이트 모드에 문자열을 쓰는 오류 고치기
    kind: debug
    objective: 바이트 모드와 텍스트 모드를 구별한다.
    prompt: "이 코드는 TypeError(a bytes-like object is required, not 'str')로 멈춥니다. 텍스트 모드와 인코딩을 써서 고치고, 다시 읽어 '한글'을 출력한 뒤 파일을 지우세요."
    starter: |-
      with open("note.txt", "wb") as f:
          f.write("한글")
    answer: |-
      import os

      with open("note.txt", "w", encoding="utf-8") as f:
          f.write("한글")
      with open("note.txt", encoding="utf-8") as f:
          print(f.read())
      os.remove("note.txt")
    output: "한글"
    hint: '"wb"의 b는 바이트입니다. 바이트 모드는 bytes만, 텍스트 모드는 str만 받습니다.'
    explanation: '바이트 모드는 인코딩을 모르는 대신 바이트를 그대로 씁니다. 글자를 쓰려면 텍스트 모드로 열고 인코딩을 정하거나, 바이트 모드에서 f.write("한글".encode("utf-8"))처럼 직접 바이트로 바꿔 넘깁니다. 이미지나 압축 파일은 바이트 모드, 사람이 읽는 글은 텍스트 모드를 씁니다(Day 38).'
    commonMistakes:
      - "b를 지우기만 하고 encoding을 적지 않아 컴퓨터마다 결과가 달라짐"
      - 'str("한글")로 감싸 여전히 str을 넘김'
    language: python
    verification: run
  - id: ex-day47-independent
    title: Rust로 무엇이든 받는 줄 세기 함수 만들기
    kind: independent
    objective: impl BufRead를 받는 함수를 Cursor로 시험한다.
    prompt: "fn count_lines(r: impl BufRead) -> usize를 만들고, Cursor::new(\"가\\n나\\n다\\n\")으로 시험해 '3'을 출력하세요."
    starter: |-
      fn main() {
          println!("여기에 count_lines를 만들어 호출하세요");
      }
    answer: |-
      use std::io::{BufRead, Cursor};

      fn count_lines(r: impl BufRead) -> usize {
          r.lines().count()
      }

      fn main() {
          println!("{}", count_lines(Cursor::new("가\n나\n다\n")));
      }
    output: "3"
    hint: "BufRead 트레이트에는 lines()가 있습니다. Cursor는 메모리 안의 바이트를 BufRead로 만들어 줍니다."
    explanation: "impl BufRead는 'BufRead 트레이트를 구현한 어떤 자료형이든'이라는 뜻입니다(Day 54). BufReader<File>, Cursor, stdin().lock()이 모두 BufRead라서 같은 함수에 넘길 수 있습니다. Python의 파일형 객체와 같은 생각을 컴파일러가 검사하는 방식으로 표현한 것입니다."
    commonMistakes:
      - "File을 매개변수 자료형으로 적어 Cursor를 넘길 수 없게 함"
      - "use std::io::BufRead를 빠뜨려 lines 메서드를 찾지 못함"
    language: rust
    verification: run
quiz:
  - id: quiz-day47-01
    question: 함수가 파일 경로 대신 파일형 객체를 받으면 좋은 점은?
    choices:
      - 더 빠르다
      - 진짜 파일, io.StringIO, 표준 입력 등 무엇이든 넘길 수 있어 시험하기 쉽다
      - 파일을 자동으로 만든다
      - 예외가 나지 않는다
    answerIndex: 1
    explanation: Python은 객체가 필요한 메서드(read, write, 줄 반복)만 가지면 그 자리에 쓸 수 있습니다(덕 타이핑). 파일을 열고 닫는 일은 부르는 쪽이 맡고, 함수는 내용을 처리하는 일만 합니다.
  - id: quiz-day47-02
    question: except OSError를 except FileNotFoundError보다 먼저 쓰면?
    choices:
      - 둘 다 실행된다
      - OSError가 FileNotFoundError까지 먼저 잡아서, 뒤의 FileNotFoundError 처리는 실행되지 않는다
      - 문법 오류
      - FileNotFoundError가 먼저 잡힌다
    answerIndex: 1
    explanation: except는 위에서부터 차례로 검사하고 처음 맞는 것 하나만 실행합니다. 부모 예외를 먼저 쓰면 자식 예외 처리가 영영 쓰이지 않습니다. 구체적인 것부터 쓰세요.
  - id: quiz-day47-03
    question: try 블록에서 오류가 나지 않았을 때만 실행되는 블록은?
    choices:
      - except
      - else
      - finally
      - 없다
    answerIndex: 1
    explanation: else는 오류가 없을 때, finally는 언제나 실행됩니다. 오류가 날 수 있는 줄만 try에 두고, 그 결과를 쓰는 코드는 else에 두면, 뒤쪽 코드의 다른 오류를 실수로 잡지 않습니다.
  - id: quiz-day47-04
    question: raise GradeError(...) from e의 효과는?
    choices:
      - e를 지운다
      - 새 예외의 __cause__에 원래 예외 e를 기록해, 오류 메시지에 두 예외가 함께 나온다
      - 프로그램을 끝낸다
      - e를 다시 던진다
    answerIndex: 1
    explanation: 낮은 수준의 오류(ValueError)를 우리 프로그램의 말(GradeError, 줄 번호 포함)로 바꾸면서도 원인을 잃지 않습니다. Rust에서는 오류 열거형의 변형에 원래 오류를 담거나 source 메서드로 같은 일을 합니다.
  - id: quiz-day47-05
    question: C에서 Python의 파일형 객체와 같은 역할을 하는 것은?
    choices:
      - char *
      - FILE *(파일, stdin, stdout, stderr가 모두 FILE *라 같은 함수에 넘길 수 있다)
      - int
      - void
    answerIndex: 1
    explanation: fprintf(stdout, ...)와 fprintf(f, ...)가 같은 함수인 것처럼, FILE *를 받는 함수는 화면과 파일 모두에 쓸 수 있습니다. 다만 메모리 버퍼를 FILE *로 만드는 fmemopen은 표준 C가 아니라서 모든 운영체제에 있지는 않습니다.
---

## 1. 오늘 배울 내용

Day 46에서 C로 파일을 열고, 읽고, 쓰고, 실패를 확인했습니다. 오늘은 Python으로 같은 일을 하되, 두 가지 설계 도구에 집중합니다.

1. **파일형 객체**(file-like object)
   - `read`, `write`, 줄 단위 반복을 가진 객체는 모두 "파일처럼" 쓸 수 있습니다.
   - 경로 대신 파일형 객체를 받는 함수는 진짜 파일, **`io.StringIO`**(메모리 안의 가짜 파일), 표준 입출력에 모두 쓸 수 있습니다.
   - `pathlib.Path`의 `read_text`, `write_text`, `open`
   - 텍스트 모드와 바이트 모드, 인코딩
2. **예외**
   - 입출력 오류의 가족 `OSError`: `FileNotFoundError`, `PermissionError`, `IsADirectoryError`
   - `try` / `except` / `else` / `finally`의 실행 순서
   - 직접 만든 예외 클래스와 원인을 이어 주는 `raise ... from`
3. 다른 두 언어
   - C: `FILE *`는 파일, `stdin`, `stdout`, `stderr` 모두를 가리킵니다.
   - Rust: `impl BufRead`, `impl Write`, `Cursor`
4. 성적 CSV를 읽으며 잘못된 줄을 **줄 번호와 함께** 알려 주는 함수를 만들고, 파일 없이 `StringIO`로 시험합니다.

## 2. 왜 필요한가

파일을 다루는 함수를 만들 때 흔히 이렇게 시작합니다.

```python
def load_grades(path):
    with open(path, encoding="utf-8") as f:
        ...
```

이 함수는 시험할 때마다 진짜 파일을 만들고 지워야 하고, 표준 입력이나 네트워크에서 받은 글에는 쓸 수 없습니다. **여는 일**과 **읽고 처리하는 일**을 나누면 이 문제가 사라집니다.

예외도 마찬가지입니다. "파일을 읽다 오류가 났다"보다 "3번째 줄: 점수가 숫자가 아님: '팔십'"이 훨씬 쓸모 있습니다. 예외를 **어디서 잡고, 무엇으로 바꿔 전할지** 정하는 것이 오류 처리 설계입니다.

## 3. 그림으로 이해하기

**파일형 객체.** 함수는 "줄을 하나씩 주는 것"만 필요합니다.

```text
                    ┌─────────────────────────┐
진짜 파일 ──────────▶│                         │
io.StringIO ────────▶│  count_words(f)         │──▶ 단어 수
sys.stdin ──────────▶│  for line in f: ...     │
                    └─────────────────────────┘
       모두 "줄 단위로 돌 수 있다"는 점만 같으면 된다
```

**파일형 객체의 위치.** 쓰면 위치가 뒤로 갑니다.

```text
buf = io.StringIO()
buf.write("ab")      [a b ▮      ]   ▮ = 지금 위치
buf.write("cd")      [a b c d ▮  ]
buf.read()           위치에서 끝까지 → ""(빈 문자열)
buf.getvalue()       위치와 상관없이 전체 → "abcd"
buf.seek(0)          [▮a b c d   ]   처음으로
```

**예외 가족.** 부모를 잡으면 자식도 잡힙니다.

```text
Exception
 ├─ ValueError
 │    └─ UnicodeDecodeError
 └─ OSError
      ├─ FileNotFoundError     (C의 ENOENT)
      ├─ PermissionError       (C의 EACCES)
      └─ IsADirectoryError     (C의 EISDIR)
```

**try 문의 흐름.**

```text
try:      ──▶ 오류 없음 ──▶ else: ──┐
   │                               ├──▶ finally: ──▶ 다음 줄(또는 return)
   └──▶ 오류 ──▶ 맞는 except: ─────┘
                 맞는 것이 없으면 ──▶ finally: ──▶ 오류가 위로 올라감
```

## 4. 천천히 풀어보기

### 4.1 파일형 객체와 pathlib

| 하고 싶은 일              | 쓰는 것                                                |
| ------------------------- | ------------------------------------------------------ |
| 메모리 안의 글 파일       | `io.StringIO("내용")`, 결과는 `getvalue()`             |
| 메모리 안의 바이트 파일   | `io.BytesIO(b"...")`                                   |
| 파일 전체 읽기/쓰기(짧게) | `Path(p).read_text(encoding=...)`, `write_text(...)`   |
| 바이트 전체 읽기/쓰기     | `Path(p).read_bytes()`, `write_bytes(...)`             |
| 줄 단위 처리              | `with Path(p).open(encoding=...) as f: for line in f:` |
| 파일 지우기, 있는지 확인  | `Path(p).unlink()`, `Path(p).exists()`                 |

`pathlib`는 경로를 문자열 대신 객체로 다룹니다. `Path("data") / "scores.txt"`처럼 `/`로 경로를 이을 수 있어서 운영체제마다 다른 구분자(`\`와 `/`)를 신경 쓰지 않아도 됩니다.

### 4.2 텍스트와 바이트

| 모드                   | 읽으면  | 쓸 수 있는 것 | 인코딩              |
| ---------------------- | ------- | ------------- | ------------------- |
| `"r"`, `"w"`, `"a"`    | `str`   | `str`         | 지정(`encoding=`)   |
| `"rb"`, `"wb"`, `"ab"` | `bytes` | `bytes`       | 없음(바이트 그대로) |

텍스트 모드는 읽을 때 `decode`, 쓸 때 `encode`를 대신 해 주고, 줄바꿈도 운영체제에 맞게 바꿔 줍니다. 인코딩을 적지 않으면 운영체제 기본값을 쓰므로 항상 `encoding="utf-8"`을 적으세요.

### 4.3 예외를 잡는 원칙

1. **처리할 수 있는 것만** 잡습니다. 없는 파일이면 기본값을 쓰는 식으로 할 일이 있을 때만 잡으세요.
2. **구체적인 것부터** 잡습니다. `except OSError`를 먼저 쓰면 뒤의 `FileNotFoundError`는 쓰이지 않습니다.
3. 빈 `except:`나 `except Exception:`으로 모든 것을 삼키지 마세요. 버그(오타로 생긴 `NameError` 등)까지 숨깁니다.
4. `try`에는 **오류가 날 수 있는 줄만** 두고, 그 결과를 쓰는 코드는 `else`에 둡니다.
5. 어떤 경로로 나가든 해야 하는 일은 `finally`(또는 `with`)에 둡니다.

### 4.4 직접 만든 예외와 raise from

```python
class GradeError(Exception):
    def __init__(self, line_no, message):
        super().__init__(f"{line_no}번째 줄: {message}")
        self.line_no = line_no
```

- `Exception`을 물려받아 만듭니다(클래스는 Day 51에서 자세히).
- 메시지에 줄 번호를 넣고, 속성으로도 남겨 부르는 쪽이 쓸 수 있게 합니다.
- `raise GradeError(...) from e`는 원래 오류 `e`를 `__cause__`에 기록합니다. 오류 메시지에 "The above exception was the direct cause of..."와 함께 두 오류가 모두 나옵니다.

## 5. Python으로 구현하기

```python
# 파일: file_like.py
import io
from pathlib import Path


def count_words(f):                         # 파일이든 StringIO든 줄 단위로 돌 수 있으면 된다
    return sum(len(line.split()) for line in f)


def write_report(out, title, rows):         # write 메서드만 있으면 된다
    out.write(f"# {title}\n")
    for name, score in rows:
        out.write(f"{name}: {score}\n")


print("1) 같은 함수에 여러 '파일'")
memory = io.StringIO("시간은 삶이다\n모모는 듣는다\n")   # 메모리 안의 가짜 파일
print("  StringIO:", count_words(memory))
path = Path("poem.txt")
path.write_text("회색 신사들이\n시간을 훔친다\n", encoding="utf-8")
with path.open(encoding="utf-8") as f:
    print("  진짜 파일:", count_words(f))

buffer = io.StringIO()
write_report(buffer, "성적", [("민지", 92), ("준호", 85)])
print("  StringIO에 쓴 내용:", repr(buffer.getvalue()))

print("2) 텍스트와 바이트")
path.write_bytes("한글".encode("utf-8"))
print("  바이트로 읽기:", path.read_bytes())
print("  텍스트로 읽기:", path.read_text(encoding="utf-8"))
try:
    path.read_text(encoding="ascii")
except UnicodeDecodeError as e:
    print("  UnicodeDecodeError:", e.reason)

print("3) OSError 가족")
for target in [Path("no_such.txt"), Path(".")]:
    try:
        target.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"  {target}: 없는 파일")
    except (IsADirectoryError, PermissionError):
        print(f"  {target}: 파일이 아니거나 권한 없음")
    except OSError as e:                    # 나머지 입출력 오류를 모두 잡는 부모
        print(f"  {target}: 다른 입출력 오류", type(e).__name__)

print("4) try / except / else / finally")


def read_score(text):
    try:
        value = int(text)
    except ValueError:
        print(f"  {text!r}: 숫자가 아님")
        return None
    else:                                   # 오류가 없을 때만
        print(f"  {text!r}: 읽음")
        return value
    finally:                                # 어떤 경우든 마지막에
        print(f"  {text!r}: 검사 끝")


print("  결과:", read_score("85"), read_score("x"))
path.unlink()
```

실행 결과:

```text
1) 같은 함수에 여러 '파일'
  StringIO: 4
  진짜 파일: 4
  StringIO에 쓴 내용: '# 성적\n민지: 92\n준호: 85\n'
2) 텍스트와 바이트
  바이트로 읽기: b'\xed\x95\x9c\xea\xb8\x80'
  텍스트로 읽기: 한글
  UnicodeDecodeError: ordinal not in range(128)
3) OSError 가족
  no_such.txt: 없는 파일
  .: 파일이 아니거나 권한 없음
4) try / except / else / finally
  '85': 읽음
  '85': 검사 끝
  'x': 숫자가 아님
  'x': 검사 끝
  결과: 85 None
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `def count_words(f):`                          | `f`가 무엇인지 묻지 않고 줄 단위로 돌기만 합니다. 그래서 `StringIO`와 진짜 파일에 똑같이 동작합니다.                                      |
| `io.StringIO("...")`                           | 글자열을 파일처럼 읽게 해 주는 객체입니다. 시험할 때 파일을 만들 필요가 없습니다.                                                         |
| `buffer.getvalue()`                            | `StringIO`에 쓴 내용 전체를 꺼냅니다. `write_report`는 이것이 진짜 파일인지 모릅니다.                                                     |
| `path.write_bytes(...)`, `path.read_bytes()`   | 바이트를 그대로 쓰고 읽습니다. "한글"은 UTF-8로 6바이트입니다.                                                                            |
| `path.read_text(encoding="ascii")`             | ASCII는 0~127만 알아서 0xED 같은 바이트를 해석하지 못합니다. 인코딩을 잘못 고르면 이렇게 실패하거나, 더 나쁘게는 글자가 깨진 채 읽힙니다. |
| `except (IsADirectoryError, PermissionError):` | 폴더를 파일처럼 읽으면 운영체제에 따라 둘 중 하나가 납니다. 튜플로 묶어 한 번에 잡았습니다.                                               |
| `except OSError as e:`                         | 위에서 못 잡은 나머지 입출력 오류를 부모로 잡습니다. 반드시 구체적인 것들 **뒤에** 둡니다.                                                |
| `else:` / `finally:`                           | `"85"`는 `else`로, `"x"`는 `except`로 갔고, 둘 다 `finally`를 거쳤습니다. `return`이 있어도 `finally`가 먼저 실행됩니다.                  |
| `f"{text!r}"`                                  | `!r`은 `repr`로 출력해 따옴표까지 보여 줍니다.                                                                                            |

## 6. C로 구현하기

C의 `FILE *`도 "파일형 객체"입니다. 표준 입출력 `stdin`, `stdout`, `stderr`가 모두 `FILE *`라서, `FILE *`를 받는 함수는 화면에도 파일에도 쓸 수 있습니다.

```c
// 파일: file_star.c
#include <stdio.h>

int count_words(FILE *f) {                  // 어떤 FILE *든 받는다(파일, stdin 등)
    int words = 0, in_word = 0, ch;
    while ((ch = fgetc(f)) != EOF) {
        if (ch == ' ' || ch == '\n' || ch == '\t') {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            words++;
        }
    }
    return words;
}

void write_report(FILE *out, const char *title) {   // stdout에도, 파일에도 쓸 수 있다
    fprintf(out, "# %s\n", title);
    fprintf(out, "minji: 92\njunho: 85\n");
}

int main(void) {
    write_report(stdout, "scores");         // 화면(표준 출력)도 FILE *
    FILE *f = fopen("report.txt", "w");
    if (f == NULL) {
        return 1;
    }
    write_report(f, "saved");
    fclose(f);

    f = fopen("report.txt", "r");
    if (f == NULL) {
        return 1;
    }
    printf("저장한 파일의 단어 수 %d\n", count_words(f));
    fclose(f);
    remove("report.txt");
    fprintf(stderr, "오류 메시지는 stderr로\n"); // 실행 결과(표준 출력)에는 섞이지 않는다
    return 0;
}
```

실행 결과:

```text
# scores
minji: 92
junho: 85
저장한 파일의 단어 수 6
```

### 코드 한 부분씩 읽기

| 코드                                | 설명                                                                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int count_words(FILE *f)`          | 파일, `stdin` 무엇이든 받습니다. 공백·줄바꿈·탭에서 단어가 끝나고, 공백이 아닌 글자를 처음 만나면 새 단어로 셉니다.                                                           |
| `void write_report(FILE *out, ...)` | `fprintf(out, ...)`로 씁니다. `write_report(stdout, ...)`는 화면에, `write_report(f, ...)`는 파일에 씁니다.                                                                   |
| `write_report(stdout, "scores")`    | `printf(...)`는 사실 `fprintf(stdout, ...)`의 줄임입니다.                                                                                                                     |
| `fprintf(stderr, "...")`            | 오류 메시지는 표준 오류로 보냅니다. 화면에는 둘 다 보이지만, 출력을 파일로 보낼 때(`./prog > out.txt`) 표준 오류는 섞이지 않습니다. 그래서 위 실행 결과에도 이 줄이 없습니다. |

C에는 `StringIO`에 해당하는 표준 기능이 없습니다. POSIX의 `fmemopen`이 메모리를 `FILE *`로 만들어 주지만 Windows에는 없어서, 시험용으로는 임시 파일을 쓰는 경우가 많습니다.

## 7. Rust로 구현하기

Rust에서는 "파일처럼 읽을 수 있다"가 **트레이트**(자료형이 가진 능력의 이름, Day 54)로 표현됩니다.

```rust
// 파일: generic_io.rs
use std::io::{self, BufRead, Cursor, Write};

fn count_words(r: impl BufRead) -> io::Result<usize> {   // 줄 단위로 읽을 수 있으면 무엇이든
    let mut n = 0;
    for line in r.lines() {
        n += line?.split_whitespace().count();
    }
    Ok(n)
}

fn write_report(out: &mut impl Write, title: &str) -> io::Result<()> {
    writeln!(out, "# {title}")?;
    writeln!(out, "minji: 92")?;
    writeln!(out, "junho: 85")?;
    Ok(())
}

fn main() -> io::Result<()> {
    let memory = Cursor::new("시간은 삶이다\n모모는 듣는다\n");   // 메모리 안의 가짜 파일
    println!("Cursor: {}", count_words(memory)?);

    let mut buf: Vec<u8> = Vec::new();       // Vec<u8>도 Write를 구현한다
    write_report(&mut buf, "성적")?;
    println!("Vec에 쓴 내용: {:?}", String::from_utf8(buf).unwrap());

    write_report(&mut io::stdout(), "화면")?;  // 표준 출력에도 같은 함수
    Ok(())
}
```

실행 결과:

```text
Cursor: 4
Vec에 쓴 내용: "# 성적\nminji: 92\njunho: 85\n"
# 화면
minji: 92
junho: 85
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `fn count_words(r: impl BufRead) -> io::Result<usize>` | "줄 단위로 읽을 수 있는 무엇이든"을 받습니다. `BufReader<File>`, `Cursor`, `io::stdin().lock()`이 모두 됩니다. |
| `Cursor::new("...")`                                   | 메모리 안의 바이트를 읽기 가능한 객체로 만듭니다. Python의 `StringIO`에 해당합니다.                            |
| `fn write_report(out: &mut impl Write, ...)`           | 쓸 수 있는 무엇이든 받습니다. 쓰는 동안 위치가 바뀌므로 `&mut`입니다.                                          |
| `let mut buf: Vec<u8> = Vec::new();`                   | `Vec<u8>`도 `Write`를 구현해서, 쓴 내용이 바이트로 쌓입니다. 시험할 때 파일 대신 씁니다.                       |
| `write_report(&mut io::stdout(), "화면")?`             | 표준 출력에도 같은 함수를 씁니다.                                                                              |

Python은 "메서드만 있으면 된다"를 실행할 때 확인하고, Rust는 "그 트레이트를 구현했는가"를 컴파일할 때 확인합니다. 생각은 같고, 검사 시점이 다릅니다.

## 8. 실행 추적

`read_score("85")`와 `read_score("x")`가 거치는 블록을 순서대로 따라갑니다.

| 호출               | `try`                     | `except`                          | `else`                   | `finally`      | 돌려준 값 |
| ------------------ | ------------------------- | --------------------------------- | ------------------------ | -------------- | --------- |
| `read_score("85")` | `int("85")` 성공          | (건너뜀)                          | "읽음" 출력, `return 85` | "검사 끝" 출력 | 85        |
| `read_score("x")`  | `int("x")` → `ValueError` | "숫자가 아님" 출력, `return None` | (건너뜀)                 | "검사 끝" 출력 | None      |

두 경우 모두 `return`을 만난 뒤 **함수를 나가기 전에** `finally`가 실행됩니다. 두 호출의 출력이 모두 끝난 다음에 바깥 `print`가 `결과: 85 None`을 출력합니다.

## 9. 다른 예제로 다시 이해하기

**성적 CSV 읽기.** `이름,점수` 모양의 줄을 읽어 사전으로 만듭니다. 빈 줄과 `#`으로 시작하는 주석은 건너뛰고, 잘못된 줄을 만나면 **줄 번호**를 담은 `GradeError`를 냅니다. 함수는 파일형 객체를 받으므로 파일 없이 `StringIO`로 여러 경우를 시험합니다.

```python
# 파일: grades.py
import io


class GradeError(Exception):                # 우리 프로그램만의 예외
    def __init__(self, line_no, message):
        super().__init__(f"{line_no}번째 줄: {message}")
        self.line_no = line_no


def load_grades(f):
    grades = {}
    for line_no, line in enumerate(f, start=1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue                        # 빈 줄과 주석은 건너뛴다
        name, sep, score_text = line.partition(",")
        if not sep:
            raise GradeError(line_no, "쉼표가 없음")
        try:
            score = int(score_text)
        except ValueError as e:
            raise GradeError(line_no, f"점수가 숫자가 아님: {score_text.strip()!r}") from e
        if not 0 <= score <= 100:
            raise GradeError(line_no, f"범위 밖: {score}")
        grades[name.strip()] = score
    return grades


good = io.StringIO("# 이름,점수\n민지,92\n준호, 85\n\n서연,78\n")
print("정상:", load_grades(good))

for text in ["민지,92\n준호 85\n", "민지,92\n준호,팔십\n", "민지,120\n"]:
    try:
        load_grades(io.StringIO(text))
    except GradeError as e:
        cause = type(e.__cause__).__name__ if e.__cause__ else "없음"
        print(f"GradeError: {e} (원인: {cause})")
```

실행 결과:

```text
정상: {'민지': 92, '준호': 85, '서연': 78}
GradeError: 2번째 줄: 쉼표가 없음 (원인: 없음)
GradeError: 2번째 줄: 점수가 숫자가 아님: '팔십' (원인: ValueError)
GradeError: 1번째 줄: 범위 밖: 120 (원인: 없음)
```

| 코드                                               | 설명                                                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `class GradeError(Exception):`                     | 우리 프로그램의 오류라는 것을 이름으로 드러냅니다. 부르는 쪽은 `except GradeError`로 이 종류만 골라 잡을 수 있습니다.       |
| `super().__init__(f"{line_no}번째 줄: {message}")` | 부모 `Exception`에 메시지를 넘겨 `str(e)`가 이 문장이 되게 합니다.                                                          |
| `for line_no, line in enumerate(f, start=1):`      | 줄 번호를 1부터 셉니다. 빈 줄과 주석도 줄 번호에는 포함됩니다.                                                              |
| `name, sep, score_text = line.partition(",")`      | 쉼표가 없으면 `sep`이 빈 문자열입니다.                                                                                      |
| `raise GradeError(...) from e`                     | `int`가 낸 `ValueError`를 우리 말로 바꾸되, 원인으로 남깁니다. 출력의 "(원인: ValueError)"가 `e.__cause__`에서 온 것입니다. |
| `load_grades(io.StringIO(text))`                   | 시험할 입력마다 파일을 만들 필요 없이 문자열 하나로 시험합니다.                                                             |

Rust에서는 오류 종류를 **열거형**으로 만들고, `Display`로 사람이 읽을 문장을 정합니다.

```rust
// 파일: grades.rs
use std::collections::BTreeMap;
use std::fmt;
use std::io::{BufRead, Cursor};

#[derive(Debug)]
enum GradeError {
    NoComma(usize),
    NotNumber(usize, String),
    OutOfRange(usize, i32),
}

impl fmt::Display for GradeError {         // 사람이 읽을 메시지
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            GradeError::NoComma(n) => write!(f, "{n}번째 줄: 쉼표가 없음"),
            GradeError::NotNumber(n, s) => write!(f, "{n}번째 줄: 점수가 숫자가 아님: {s:?}"),
            GradeError::OutOfRange(n, v) => write!(f, "{n}번째 줄: 범위 밖: {v}"),
        }
    }
}

fn load_grades(r: impl BufRead) -> Result<BTreeMap<String, i32>, GradeError> {
    let mut grades = BTreeMap::new();
    for (i, line) in r.lines().enumerate() {
        let line_no = i + 1;
        let line = line.unwrap_or_default();
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let (name, score_text) = line.split_once(',').ok_or(GradeError::NoComma(line_no))?;
        let score: i32 = score_text
            .trim()
            .parse()
            .map_err(|_| GradeError::NotNumber(line_no, score_text.trim().to_string()))?;
        if !(0..=100).contains(&score) {
            return Err(GradeError::OutOfRange(line_no, score));
        }
        grades.insert(name.trim().to_string(), score);
    }
    Ok(grades)
}

fn main() {
    let good = Cursor::new("# 이름,점수\n민지,92\n준호, 85\n\n서연,78\n");
    match load_grades(good) {
        Ok(g) => println!("정상: {g:?}"),
        Err(e) => println!("오류: {e}"),
    }
    for text in ["민지,92\n준호 85\n", "민지,92\n준호,팔십\n", "민지,120\n"] {
        if let Err(e) = load_grades(Cursor::new(text)) {
            println!("GradeError: {e} ({e:?})");
        }
    }
}
```

실행 결과:

```text
정상: {"민지": 92, "서연": 78, "준호": 85}
GradeError: 2번째 줄: 쉼표가 없음 (NoComma(2))
GradeError: 2번째 줄: 점수가 숫자가 아님: "팔십" (NotNumber(2, "팔십"))
GradeError: 1번째 줄: 범위 밖: 120 (OutOfRange(1, 120))
```

- `enum GradeError`의 변형마다 필요한 정보(줄 번호, 틀린 글자, 값)를 담았습니다. 부르는 쪽은 `match`로 종류별로 다르게 처리할 수 있습니다.
- `impl fmt::Display`는 `{e}`로 출력할 문장을, `#[derive(Debug)]`는 `{e:?}`로 출력할 구조를 만듭니다.
- `split_once(',').ok_or(GradeError::NoComma(line_no))?`처럼 `Option`을 우리 오류로 바꿔 `?`로 돌려줍니다.
- `line.unwrap_or_default()`는 읽기 오류를 빈 줄로 바꿉니다. `Cursor`에서는 오류가 날 수 없어서 짧게 썼지만, 진짜 파일을 읽는다면 오류 열거형에 `Io(io::Error)` 변형을 추가해 전해야 합니다(도전 문제).

## 10. 입출력 설계 정리

| 설계 요소                  | Python                           | C                             | Rust                              |
| -------------------------- | -------------------------------- | ----------------------------- | --------------------------------- |
| 읽을 수 있는 무엇이든 받기 | 파일형 객체(`for line in f`)     | `FILE *`                      | `impl BufRead`, `impl Read`       |
| 쓸 수 있는 무엇이든 받기   | `write` 메서드가 있는 객체       | `FILE *`                      | `impl Write`                      |
| 메모리 안의 가짜 파일      | `io.StringIO`, `io.BytesIO`      | (표준 없음, POSIX `fmemopen`) | `Cursor`, `Vec<u8>`               |
| 오류 종류                  | 예외 클래스 계층(`OSError` 가족) | `errno` 번호                  | `io::ErrorKind`, 직접 만든 `enum` |
| 오류를 우리 말로 바꾸기    | `raise MyError(...) from e`      | 반환 코드 설계                | `map_err`, `ok_or`                |
| 언제나 해야 하는 정리      | `with`, `finally`                | `goto cleanup`                | Drop                              |

## 11. 세 언어 비교

| 관점                  | Python                        | C                      | Rust                                    |
| --------------------- | ----------------------------- | ---------------------- | --------------------------------------- |
| "파일처럼 쓸 수 있다" | 메서드가 있으면(실행 중 확인) | `FILE *`이면           | 트레이트를 구현했으면(컴파일할 때 확인) |
| 오류 전달             | 예외가 자동으로 위로          | 반환값을 직접 전달     | `Result`와 `?`                          |
| 오류 원인 연결        | `__cause__`(`from`)           | 없음                   | `source()`, 변형에 담기                 |
| 표준 오류 출력        | `print(..., file=sys.stderr)` | `fprintf(stderr, ...)` | `eprintln!(...)`                        |

## 12. 자주 하는 실수

### 실수 1: 바이트 모드에 문자열을 쓴다

```python
# 파일: bytes_mode.py (실행 오류: TypeError)
with open("note.bin", "wb") as f:
    f.write("한글")
```

실습의 디버그 문제입니다. 글자는 텍스트 모드(`"w"`, `encoding="utf-8"`)로 쓰거나, `.encode("utf-8")`로 바이트로 바꿔 쓰세요.

### 실수 2: 부모 예외를 먼저 잡는다

`except OSError:` 다음에 `except FileNotFoundError:`를 쓰면 뒤의 것은 영영 실행되지 않습니다. Python은 이것을 오류로 알려 주지 않으니 순서를 스스로 확인하세요.

### 실수 3: 모든 예외를 삼킨다

```python
try:
    grades = load_grades(f)
except:
    grades = {}
```

파일 오류뿐 아니라 `load_gardes` 같은 오타(`NameError`), 사용자가 누른 Ctrl+C(`KeyboardInterrupt`)까지 조용히 삼킵니다. 처리할 수 있는 예외만 이름으로 잡으세요.

### 실수 4: 쓴 직후 같은 객체를 처음부터 읽는다고 생각한다

`StringIO`나 `"w+"`로 연 파일에 쓴 뒤 곧바로 `read()`하면 빈 문자열입니다. `seek(0)`으로 위치를 처음으로 옮기거나, `StringIO`라면 `getvalue()`를 쓰세요(실습의 예측 문제).

### 실수 5: 함수 안에서 받은 파일을 닫는다

파일형 객체를 받는 함수가 `f.close()`까지 하면, 부르는 쪽이 그 파일을 계속 쓸 수 없고 `with`가 두 번 닫게 됩니다. **연 쪽이 닫는다**는 규칙을 지키세요.

## 13. Q&A

**Q. 예외와 C의 반환값 중 무엇이 더 좋은가요?**

A. 예외는 확인을 빼먹어도 오류가 위로 올라가 프로그램이 멈추므로 "조용히 틀리는" 일이 적습니다. 대신 어떤 함수가 어떤 예외를 낼지 코드만 보고 알기 어렵습니다. Rust의 `Result`는 오류 가능성을 반환 자료형에 적고 처리를 강제해서 두 장점을 합치려 한 방식입니다.

**Q. except에서 오류를 출력하고 그냥 계속 가도 되나요?**

A. 그 오류를 처리한 뒤에도 프로그램이 올바른 상태라면 괜찮습니다. 예를 들어 설정 파일이 없으면 기본 설정을 쓰는 경우입니다. 하지만 "일단 출력만 하고 계속"하면, 뒤의 코드가 빠진 데이터로 계속 돌며 더 이해하기 어려운 오류를 낼 수 있습니다.

**Q. csv 모듈을 쓰면 안 되나요?**

A. 실무에서는 `csv.reader(f)`를 쓰세요. 따옴표 안의 쉼표(`"김, 민지",92`) 같은 까다로운 경우를 처리해 줍니다. 오늘은 원리를 보기 위해 `partition`으로 직접 나눴습니다. `csv.reader`도 파일형 객체를 받으므로 `StringIO`로 시험할 수 있습니다.

**Q. 표준 입력도 파일형 객체인가요?**

A. 네, `sys.stdin`은 읽기용 파일형 객체입니다. `load_grades(sys.stdin)`으로 부르면 키보드나 파이프로 들어온 내용을 읽습니다. `sys.stdout`, `sys.stderr`는 쓰기용입니다.

## 14. 핵심 요약

- **파일형 객체**를 받는 함수는 진짜 파일, `io.StringIO`, 표준 입출력에 모두 쓸 수 있습니다. 여는 일(부르는 쪽)과 처리하는 일(함수)을 나누고, 연 쪽이 닫습니다.
- 텍스트 모드는 `str`과 인코딩, 바이트 모드는 `bytes`를 다룹니다. 텍스트 파일은 항상 `encoding="utf-8"`을 적습니다. `pathlib.Path`로 경로와 짧은 읽기·쓰기를 편하게 합니다.
- 입출력 오류는 `OSError` 가족입니다. **구체적인 것부터** 잡고, 처리할 수 있는 것만 잡습니다.
- `try`는 오류가 날 수 있는 줄만, `else`는 성공했을 때, `finally`는 언제나입니다. `return`이 있어도 `finally`가 먼저 실행됩니다.
- 직접 만든 예외에 줄 번호 같은 정보를 담고, `raise ... from e`로 원인을 잇습니다.
- C는 `FILE *`, Rust는 `impl BufRead`·`impl Write`·`Cursor`로 같은 생각을 표현합니다.

## 15. 도전 문제

1. **(Python)** `load_grades`가 오류를 만나도 멈추지 않고 **모든** 오류를 모아 `(grades, errors)`를 돌려주는 `load_grades_all(f)`를 만들고, `StringIO`로 오류가 두 개 있는 입력을 시험하세요.
2. **(Python)** `csv.reader`로 `load_grades`를 다시 만들고, `"김, 민지",92`처럼 이름에 쉼표가 있는 줄도 읽히는지 확인하세요.
3. **(Rust)** `GradeError`에 `Io(std::io::Error)` 변형을 추가하고, `line.unwrap_or_default()` 대신 `line.map_err(GradeError::Io)?`로 읽기 오류를 전하세요.
4. **(C)** `count_words(stdin)`으로 부르는 프로그램을 만들어, 키보드로 입력한 뒤 Ctrl+D(Windows는 Ctrl+Z, Enter)로 끝냈을 때 단어 수가 나오는지 확인하세요.
