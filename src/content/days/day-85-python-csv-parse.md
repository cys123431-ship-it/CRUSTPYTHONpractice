---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-85-python-csv-parse
courseId: crp-92
phaseId: phase-08
dayNumber: 85
date: "2026-12-24"
title: Python CSV 파싱과 검증
summary: Study Log Analyzer의 Python 구현에서 입력을 읽고 검증하는 부분을 만듭니다. csv.DictReader로 열 이름과 함께 읽고 strict=True로 잘못된 따옴표를 거절하기, fieldnames로 헤더 검사하기, 열이 많거나 적은 줄을 None 열쇠로 알아내기, 읽은 줄을 바꿀 수 없는 frozen dataclass Session으로 만들기, 날짜·minutes·값 검사를 작은 함수로 나누고 줄 번호를 담은 ValueError와 raise from으로 원인까지 전하기를 다룹니다. 같은 검사를 C(다섯 칸 → 구조체, 오류 enum, 성공할 때만 결과 쓰기)와 Rust(슬라이스 패턴으로 다섯 칸 풀기, Result)로 옮기고, argparse로 명령줄 옵션을 읽고 argparse가 못 하는 계약 검사(--top 범위, --date 달력)를 더하는 부분을 Python과 Rust로 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-84-fixture-review]
learningObjectives:
  - csv.DictReader와 fieldnames로 헤더를 확인하고, None 열쇠로 열 수가 틀린 줄을 찾는다.
  - 검증을 작은 함수로 나누고 줄 번호와 원인을 담은 오류를 낸다.
  - 검증을 통과한 줄만 frozen dataclass로 만들어 이후 바뀌지 않게 한다.
  - 같은 검증을 C의 오류 enum·출력 매개변수, Rust의 슬라이스 패턴·Result로 옮긴다.
  - argparse로 옵션을 읽고, argparse가 표현하지 못하는 계약 검사를 추가한다.
concepts:
  [
    csv dictreader,
    strict mode,
    fieldnames,
    restkey none,
    frozen dataclass,
    validation function,
    error message with line,
    exception chaining,
    validation order,
    argparse,
    choices,
    default,
    contract check,
    slice pattern,
    let else,
    error enum,
    write on success,
  ]
runnerMode: python
playgroundSource: |
  # 파일: dictreader_play.py — 열이 많거나 적은 줄을 DictReader가 어떻게 보여 주는지 보세요.
  import csv, io
  text = "a,b\n1,2\n1,2,3\n1\n"
  for row in csv.DictReader(io.StringIO(text)):
      print(row)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day85-predict-extra
    title: 열이 많은 줄의 DictReader 결과 예측하기
    kind: predict
    objective: 남는 칸이 None 열쇠에 리스트로 담긴다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      import csv
      import io

      row = next(csv.DictReader(io.StringIO("a,b\n1,2,3\n")))
      print(row)
    answer: "{'a': '1', 'b': '2', None: ['3']}"
    hint: "헤더는 두 칸인데 줄은 세 칸입니다. 이름이 없는 남는 칸은 특별한 열쇠에 모입니다."
    explanation: "DictReader는 남는 칸을 restkey(기본값 None) 열쇠에 리스트로 넣습니다. 반대로 칸이 모자라면 없는 열의 값이 None(restval)이 됩니다. 그래서 오늘 load는 None in row(남는 칸)와 row.get(f) is None(모자란 칸)을 검사해 열 수가 틀린 줄을 찾습니다. csv.reader를 쓰면 len(row) != 5로 더 단순하게 확인할 수도 있습니다."
    commonMistakes:
      - "남는 칸이 조용히 버려진다고 생각함"
      - "오류가 난다고 생각함"
    language: python
    verification: run
  - id: ex-day85-predict-frozen
    title: frozen dataclass에 대입하기 예측하기
    kind: predict
    objective: frozen dataclass는 만든 뒤 필드를 바꿀 수 없다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      from dataclasses import dataclass


      @dataclass(frozen=True)
      class S:
          minutes: int


      s = S(30)
      try:
          s.minutes = 5
      except Exception as e:
          print(type(e).__name__)
    answer: "FrozenInstanceError"
    hint: "frozen=True는 '얼린다'는 뜻입니다."
    explanation: "검증을 통과한 기록이 나중에 실수로 바뀌면, 검증한 의미가 사라집니다. frozen dataclass는 대입을 막아 이것을 보장합니다(Rust의 불변 변수와 비슷). 값이 다른 기록이 필요하면 dataclasses.replace(s, minutes=5)로 새 객체를 만듭니다. 얼린 객체는 해시할 수 있어서 집합과 사전의 열쇠로도 쓸 수 있습니다."
    commonMistakes:
      - "AttributeError라고 적음(FrozenInstanceError가 그 자식이긴 함)"
      - "대입이 조용히 무시된다고 생각함"
    language: python
    verification: run
  - id: ex-day85-fill
    title: 원인을 이어 붙이는 raise 채우기
    kind: fill
    objective: 낮은 수준의 오류를 우리 오류로 바꾸면서 원인을 남긴다.
    prompt: "빈칸을 채워 '날짜 오류: 2026-13-01 ← 원인 있음'이 출력되게 하세요."
    starter: |-
      from datetime import date


      def parse_date(v):
          try:
              date.fromisoformat(v)
          except ValueError as error:
              raise ValueError(f"날짜 오류: {v}") _____ error


      try:
          parse_date("2026-13-01")
      except ValueError as e:
          print(e, "← 원인 있음" if e.__cause__ else "← 원인 없음")
    answer: |-
      from datetime import date


      def parse_date(v):
          try:
              date.fromisoformat(v)
          except ValueError as error:
              raise ValueError(f"날짜 오류: {v}") from error


      try:
          parse_date("2026-13-01")
      except ValueError as e:
          print(e, "← 원인 있음" if e.__cause__ else "← 원인 없음")
    output: "날짜 오류: 2026-13-01 ← 원인 있음"
    hint: "Day 47에서 배운, 새 예외의 원인을 적는 낱말입니다."
    explanation: "raise 새오류 from 원인은 원인을 __cause__에 기록합니다. 사용자에게는 '날짜 오류: 2026-13-01'처럼 계약의 말로 보여 주고, 개발자는 원인(month must be in 1..12)까지 볼 수 있습니다. from None으로 쓰면 원인을 일부러 숨깁니다(오늘의 CLI 검사처럼 원인이 도움이 안 될 때)."
    commonMistakes:
      - "as error를 써서 문법 오류가 남"
      - "원래 오류를 그대로 다시 raise해서 계약의 문장이 보이지 않음"
    language: python
    verification: run
  - id: ex-day85-modify
    title: 검사 순서 바꿔 계약의 문장 내기
    kind: modify
    objective: int 변환 전에 모양을 검사해 실행기 문장 대신 계약의 오류 문장을 낸다.
    prompt: "이 코드는 int를 먼저 불러 'invalid literal ...' 문장이 나옵니다. 숫자인지 먼저 확인해 계약의 문장 '2행: minutes는 양의 정수여야 합니다'가 출력되게 하세요."
    starter: |-
      def parse_minutes(raw, line_no):
          minutes = int(raw)
          if minutes < 1:
              raise ValueError(f"{line_no}행: minutes는 양의 정수여야 합니다")
          return minutes


      try:
          parse_minutes("abc", 2)
      except ValueError as e:
          print(e)
    answer: |-
      def parse_minutes(raw, line_no):
          if not raw.isascii() or not raw.isdigit() or raw.startswith("0"):
              raise ValueError(f"{line_no}행: minutes는 양의 정수여야 합니다")
          return int(raw)


      try:
          parse_minutes("abc", 2)
      except ValueError as e:
          print(e)
    output: "2행: minutes는 양의 정수여야 합니다"
    starterOutput: "invalid literal for int() with base 10: 'abc'"
    hint: 'int("abc")가 먼저 실패하면 우리 검사는 실행되지도 않습니다.'
    explanation: "int는 ' 30 '(공백), '+30', '٣'(아랍 숫자)처럼 계약이 허용하지 않는 입력도 받아들이고, 실패하면 실행기의 영어 문장을 냅니다. 계약의 모양(ASCII 숫자, 앞자리 0 없음)을 먼저 확인하고 그 다음 변환하면, 세 구현이 같은 입력을 같은 이유로 거절합니다. isascii()를 빼면 '٣'이 통과합니다(Day 38)."
    commonMistakes:
      - "try로 int를 감싸기만 해서 ' 30 '을 통과시킴"
      - "isdigit만 써서 '٣'이나 '²'를 통과시킴"
    language: python
    verification: run
  - id: ex-day85-debug
    title: 틀린 줄 번호 고치기
    kind: debug
    objective: 헤더 다음 줄을 2행으로 세도록 enumerate의 시작값을 고친다.
    prompt: "이 코드는 첫 데이터 줄의 오류를 '0행'이라고 알립니다. 헤더가 1행, 첫 데이터가 2행이 되도록 고쳐 '2행: language/topic/result 오류'가 출력되게 하세요."
    starter: |-
      import csv
      import io

      text = "date,language,topic,minutes,result\n2026-10-01,Go,변수,30,pass\n"
      reader = csv.DictReader(io.StringIO(text))
      for line_no, row in enumerate(reader):
          if row["language"] not in {"C", "Python", "Rust"}:
              print(f"{line_no}행: language/topic/result 오류")
    answer: |-
      import csv
      import io

      text = "date,language,topic,minutes,result\n2026-10-01,Go,변수,30,pass\n"
      reader = csv.DictReader(io.StringIO(text))
      for line_no, row in enumerate(reader, start=2):
          if row["language"] not in {"C", "Python", "Rust"}:
              print(f"{line_no}행: language/topic/result 오류")
    output: "2행: language/topic/result 오류"
    starterOutput: "0행: language/topic/result 오류"
    hint: "DictReader는 헤더를 이미 읽었습니다. 첫 번째로 받는 줄은 파일의 몇 번째 줄일까요?"
    explanation: "enumerate는 기본으로 0부터 셉니다. 헤더(1행)를 DictReader가 먼저 읽었으므로 첫 데이터는 2행입니다. 세 구현이 줄 번호를 같게 세야 Day 84의 '3행:' 사례가 모두 통과합니다. 따옴표 안에 줄바꿈이 있는 칸을 허용하면 한 기록이 두 줄이 되어 이 방법이 틀리는데, reader.line_num을 쓰면 실제 줄 번호를 얻을 수 있습니다."
    commonMistakes:
      - "start=1로 고쳐 헤더 다음 줄을 1행이라고 함"
      - "print 안에서 line_no + 1을 해서 0행이 1행이 됨"
    language: python
    verification: run
  - id: ex-day85-independent
    title: Rust 슬라이스 패턴으로 정확히 두 조각 받기
    kind: independent
    objective: let-else와 슬라이스 패턴으로 개수가 정확한 경우만 받는다.
    prompt: 'fn parse_pair(s: &str) -> Option<(&str, &str)>를 만들어 ''=''로 나눈 조각이 정확히 두 개일 때만 Some을 돌려주세요. "x=1"과 "x=1=2"로 ''Some(("x", "1")) None''이 출력되게 하세요.'
    starter: |-
      fn main() {
          println!("여기에 parse_pair를 만들어 보세요");
      }
    answer: |-
      fn parse_pair(s: &str) -> Option<(&str, &str)> {
          let parts: Vec<&str> = s.split('=').collect();
          let [key, value] = parts.as_slice() else {
              return None;
          };
          Some((key, value))
      }

      fn main() {
          println!("{:?} {:?}", parse_pair("x=1"), parse_pair("x=1=2"));
      }
    output: 'Some(("x", "1")) None'
    hint: "let [a, b] = slice else { return None; };는 길이가 정확히 2일 때만 풀립니다."
    explanation: "슬라이스 패턴 [a, b]는 길이까지 확인합니다. 오늘 Rust 예제의 let [date, language, topic, minutes, result] = fields else { ... }가 같은 방법으로 '정확히 다섯 칸'을 확인합니다. 칸 수 검사와 이름 붙이기가 한 줄에 끝나고, 인덱스로 fields[4]를 읽다가 패닉할 걱정이 없습니다."
    commonMistakes:
      - 'split_once를 써서 x=1=2가 ("x", "1=2")로 통과함'
      - "parts[0], parts[1]로 읽어 조각이 하나면 패닉함"
    language: rust
    verification: run
quiz:
  - id: quiz-day85-01
    question: csv.DictReader(stream, strict=True)의 strict=True가 하는 일은?
    choices:
      - 헤더를 검사한다
      - 닫히지 않은 따옴표 등 CSV 형식이 틀린 입력에서 csv.Error를 낸다
      - 열 수를 검사한다
      - 인코딩을 확인한다
    answerIndex: 1
    explanation: 기본 모드는 잘못된 따옴표를 최대한 해석해 넘어가지만, strict=True는 오류를 냅니다. 계약은 '잘못된 입력은 거절'이므로 strict를 씁니다. 헤더와 열 수는 우리가 따로 확인해야 합니다.
  - id: quiz-day85-02
    question: 헤더가 두 칸인 DictReader가 칸이 하나뿐인 줄을 읽으면?
    choices:
      - 오류가 난다
      - 없는 열의 값이 None이 된다
      - 빈 문자열이 된다
      - 그 줄을 건너뛴다
    answerIndex: 1
    explanation: 모자란 칸은 restval(기본 None)로, 남는 칸은 restkey(기본 None) 열쇠에 리스트로 들어갑니다. 그래서 row.get(f) is None과 None in row로 두 경우를 모두 잡습니다.
  - id: quiz-day85-03
    question: 검증을 통과한 줄을 frozen dataclass로 만드는 이유는?
    choices:
      - 빠르게 하려고
      - 이후 코드가 실수로 값을 바꿔 검증한 조건을 깨뜨리지 못하게 하려고
      - 출력을 예쁘게 하려고
      - 메모리를 줄이려고
    answerIndex: 1
    explanation: 검증은 '이 값들은 계약을 지킨다'는 보장입니다. 이후에 minutes를 0으로 바꿀 수 있다면 보장이 사라집니다. Rust에서는 let으로 받은 값이 기본적으로 바꿀 수 없어서 같은 효과를 얻습니다.
  - id: quiz-day85-04
    question: minutes 검사에서 int(raw)보다 isdigit 검사를 먼저 하는 이유로 틀린 것은?
    choices:
      - 계약의 오류 문장을 내려고
      - int가 ' 30 ', '+30' 같은 계약 밖 입력도 받아들여서
      - 세 구현이 같은 입력을 같은 이유로 거절하게 하려고
      - int는 숫자를 변환하지 못해서
    answerIndex: 3
    explanation: int는 숫자를 잘 변환하지만 계약보다 너그럽습니다. 모양을 먼저 확인하면 계약과 똑같이 판단하고, 실행기의 영어 문장 대신 우리 문장을 냅니다.
  - id: quiz-day85-05
    question: argparse의 choices=["C", "Python", "Rust"]로 할 수 없는 검사는?
    choices:
      - --language Go 거절
      - --top이 1~1000인지, --date가 달력에 있는 날짜인지
      - --language 값을 제한하기
      - 도움말 보여 주기
    answerIndex: 1
    explanation: choices는 정해진 값 목록만 확인합니다. 범위나 달력 같은 규칙은 parse_args 뒤에 직접 검사하거나, type= 에 검사 함수를 넘겨야 합니다. 오늘 실습의 check 함수가 그 일을 합니다.
---

## 1. 오늘 배울 내용

Day 83~84에서 계약과 시험 사례를 정했습니다. 오늘부터 **구현**입니다. 첫 번째는 Python 구현의 **입력 읽기와 검증** 부분입니다.

1. `csv.DictReader`로 읽기
   - 열 이름으로 값 꺼내기
   - `strict=True`로 잘못된 CSV 형식 거절
   - `fieldnames`로 헤더 확인
   - 열이 많거나 적은 줄 찾기(`None` 열쇠와 `None` 값)
2. 검증을 작은 함수로 나누기
   - `parse_date`: 모양 → 달력
   - `parse_minutes`: 모양 → 범위
   - 줄 번호를 담은 `ValueError`, `raise ... from`으로 원인 잇기
3. 검증을 통과한 줄만 `frozen dataclass` `Session`으로 만들기
4. 같은 검증을 C(오류 enum, 성공할 때만 결과 쓰기)와 Rust(슬라이스 패턴, `Result`)로 옮기기
5. `argparse`로 명령줄 옵션 읽기와, argparse가 못 하는 계약 검사 더하기

## 2. 왜 필요한가

입력 검증은 프로그램의 **첫 번째 방어선**입니다. 여기서 걸러 내지 못한 잘못된 값은 뒤의 집계·정렬 코드 곳곳에서 이상한 결과를 만듭니다.

- `minutes`가 `"030"`인 줄을 받아들이면, 어떤 구현은 30으로, 어떤 구현은 오류로 봅니다.
- 날짜가 `2026-02-30`인 줄을 받아들이면, 날짜 정렬(`--sort date`)은 되지만 달력 계산을 하는 다른 기능이 망가집니다.
- 오류 문장이 `invalid literal for int()`처럼 실행기의 영어 문장이면, 사용자가 무엇을 고쳐야 할지 모릅니다.

검증을 **작은 함수**로 나누면 각 규칙을 따로 시험할 수 있고(Day 84의 경계 사례), 세 구현을 줄 단위로 비교하기도 쉽습니다.

## 3. 그림으로 이해하기

**load의 흐름.**

```text
stream ──▶ DictReader(strict=True)
             │
             ├─ fieldnames == FIELDS? ── 아니면 ──▶ ValueError("헤더는 ...")
             │
             └─ 줄마다(2행부터)
                  ├─ 열 수 확인(None 열쇠 / None 값)   ── 틀리면 ─▶ "N행: 열이 정확히 5개"
                  ├─ language / topic / result         ── 틀리면 ─▶ "N행: language/topic/result 오류"
                  ├─ parse_date(date)                  ── 틀리면 ─▶ "날짜 오류: ..." (원인 포함)
                  ├─ parse_minutes(minutes, N)         ── 틀리면 ─▶ "N행: minutes는 ..."
                  └─ Session(...) 만들어 목록에 추가(얼린 객체)
```

**DictReader가 열 수가 틀린 줄을 보여 주는 방법.**

```text
헤더:     a,b
줄 1,2    {'a': '1', 'b': '2'}
줄 1,2,3  {'a': '1', 'b': '2', None: ['3']}   ← 남는 칸: None 열쇠
줄 1      {'a': '1', 'b': None}               ← 모자란 칸: None 값
```

**검증의 경계.**

```text
[바깥 세상: 문자열뿐]  ──검증──▶  [안쪽: Session만]
 "030", "2026-02-30", " "          minutes: int(1~10080)
                                   day: 달력에 있는 날짜
                                   frozen: 이후 바뀌지 않음
```

안쪽 코드(Day 86의 집계)는 `Session`만 다루므로, "이 값이 올바른가"를 다시 검사할 필요가 없습니다.

## 4. 천천히 풀어보기

### 4.1 DictReader의 설정

| 설정                      | 뜻                            | 이 프로젝트에서             |
| ------------------------- | ----------------------------- | --------------------------- |
| `strict=True`             | 잘못된 따옴표에서 `csv.Error` | 사용                        |
| `fieldnames`(속성)        | 첫 줄에서 읽은 열 이름 목록   | `FIELDS`와 비교             |
| `restkey`(기본 `None`)    | 남는 칸을 담을 열쇠           | `None in row`로 확인        |
| `restval`(기본 `None`)    | 모자란 칸의 값                | `row.get(f) is None`로 확인 |
| 파일을 열 때 `newline=""` | 줄바꿈 처리를 csv 모듈에 맡김 | 실제 프로젝트에서 사용      |

### 4.2 검증 함수를 나누는 기준

- **한 함수는 한 열**: `parse_date`, `parse_minutes`. 각각 Day 84의 경계 사례로 따로 시험합니다.
- **모양 먼저, 변환은 나중**: `isdigit` 확인 뒤 `int`, 모양 확인 뒤 `fromisoformat`.
- **오류 문장은 계약의 말로**: 줄 번호, 열 이름, 규칙. 원인은 `from`으로 잇습니다.
- **통과한 값만 돌려주기**: 함수가 값을 돌려주면 그 값은 검증된 것입니다.

실제 프로젝트의 `parse_date`는 줄 번호를 받지 않아서 날짜 오류에는 줄 번호가 없습니다. 이런 작은 차이도 세 구현이 똑같이 따라야 결과가 같습니다. 줄 번호를 넣도록 바꾸는 것은 도전 문제로 남깁니다.

### 4.3 argparse와 계약 검사

`argparse`는 옵션의 이름, 기본값, 정해진 값 목록(`choices`), 자료형(`type=int`)을 처리해 줍니다. 하지만 "1~1000", "달력에 있는 날짜" 같은 규칙은 직접 검사해야 합니다. 그래서 `parse_args()` 뒤에 `check(args)`를 둡니다. argparse 자신의 오류(모르는 옵션, `choices` 위반)는 사용법을 출력하고 종료 코드 2로 끝납니다.

## 5. Python으로 구현하기

```python
# 파일: load_sessions.py
import csv
import io
from dataclasses import dataclass
from datetime import date

LANGUAGES = {"C", "Python", "Rust"}
RESULTS = {"pass", "retry"}
FIELDS = ["date", "language", "topic", "minutes", "result"]


@dataclass(frozen=True)                     # 읽은 뒤에는 바꿀 수 없는 기록
class Session:
    day: str
    language: str
    topic: str
    minutes: int
    result: str


def parse_date(value):
    try:
        if len(value) != 10 or value[4] != "-" or value[7] != "-":
            raise ValueError("YYYY-MM-DD 형식이 아닙니다")
        if date.fromisoformat(value).isoformat() != value:
            raise ValueError("올바르지 않은 날짜입니다")
    except ValueError as error:
        raise ValueError(f"날짜 오류: {value}") from error   # 원인을 이어 붙인다
    return value


def parse_minutes(raw, line_no):
    if not raw.isascii() or not raw.isdigit() or raw.startswith("0"):
        raise ValueError(f"{line_no}행: minutes는 양의 정수여야 합니다")
    minutes = int(raw)
    if minutes > 10080:
        raise ValueError(f"{line_no}행: minutes는 10080 이하여야 합니다")
    return minutes


def load(stream):
    reader = csv.DictReader(stream, strict=True)
    if reader.fieldnames != FIELDS:
        raise ValueError("헤더는 date,language,topic,minutes,result여야 합니다")
    rows = []
    for line_no, row in enumerate(reader, start=2):
        if None in row or any(row.get(f) is None for f in FIELDS):   # 열이 많거나 적음
            raise ValueError(f"{line_no}행: 열이 정확히 5개여야 합니다")
        if row["language"] not in LANGUAGES or not row["topic"].strip() or row["result"] not in RESULTS:
            raise ValueError(f"{line_no}행: language/topic/result 오류")
        rows.append(Session(parse_date(row["date"]), row["language"], row["topic"],
                            parse_minutes(row["minutes"], line_no), row["result"]))
    return rows


FIXTURE = """date,language,topic,minutes,result
2026-10-01,Python,변수,30,pass
2026-10-02,C,"배열, 포인터",45,retry
2026-10-03,Rust,소유권,25,pass
2026-10-04,Python,변수,30,pass
"""
for s in load(io.StringIO(FIXTURE)):
    print(s)

BAD = [
    "2026-02-30,Python,변수,30,pass",
    "2026-10-01,Python,변수,30,pass,extra",
    "2026-10-01,Python,변수,30",
    "2026-10-01,Python,변수,030,pass",
    "2026-10-01,Go,변수,30,pass",
]
header = ",".join(FIELDS) + "\n"
for line in BAD:
    try:
        load(io.StringIO(header + line + "\n"))
    except ValueError as e:
        cause = f" ← {e.__cause__}" if e.__cause__ else ""
        print(f"오류: {e}{cause}")
```

실행 결과:

```text
Session(day='2026-10-01', language='Python', topic='변수', minutes=30, result='pass')
Session(day='2026-10-02', language='C', topic='배열, 포인터', minutes=45, result='retry')
Session(day='2026-10-03', language='Rust', topic='소유권', minutes=25, result='pass')
Session(day='2026-10-04', language='Python', topic='변수', minutes=30, result='pass')
오류: 날짜 오류: 2026-02-30 ← day is out of range for month
오류: 2행: 열이 정확히 5개여야 합니다
오류: 2행: 열이 정확히 5개여야 합니다
오류: 2행: minutes는 양의 정수여야 합니다
오류: 2행: language/topic/result 오류
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `@dataclass(frozen=True) class Session`                  | 검증을 통과한 기록입니다. 필드 이름 `day`는 `date` 모듈 이름과 겹치지 않게 지었습니다.                                                    |
| `raise ValueError(f"날짜 오류: {value}") from error`     | 계약의 문장으로 바꾸고 원인(`day is out of range for month`)을 잇습니다. 원인 문장은 Python이 만든 것이라 버전마다 조금 다를 수 있습니다. |
| `def load(stream)`                                       | 경로가 아니라 **파일형 객체**를 받습니다(Day 47). 실제 프로젝트는 `path.open(encoding="utf-8", newline="")`으로 열어 넘깁니다.            |
| `reader.fieldnames != FIELDS`                            | 헤더의 이름과 순서가 계약과 같아야 합니다.                                                                                                |
| `None in row or any(row.get(f) is None for f in FIELDS)` | 남는 칸과 모자란 칸을 모두 잡습니다. 오류 사례의 둘째(여섯 칸)와 셋째(네 칸)가 여기서 걸렸습니다.                                         |
| `not row["topic"].strip()`                               | 공백만 있는 주제를 거릅니다.                                                                                                              |
| `Session(parse_date(...), ..., parse_minutes(...), ...)` | 검사 함수가 통과한 값을 돌려주므로, 만드는 줄에서 검사와 변환이 함께 끝납니다.                                                            |
| `e.__cause__`                                            | `from`으로 이은 원인입니다. 날짜 오류만 원인이 있습니다.                                                                                  |

## 6. C로 구현하기

C 구현은 Day 87에서 완성합니다. 오늘은 다섯 칸을 검사해 **구조체로 만드는** 부분만 봅니다.

```c
// 파일: make_session.c
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char day[11];
    char language[8];
    char topic[64];
    unsigned minutes;
    char result[8];
} Session;

enum row_error { ROW_OK, BAD_DATE, BAD_VALUE, BAD_MINUTES };

static int is_one_of(const char *s, const char *a, const char *b, const char *c) {
    return strcmp(s, a) == 0 || strcmp(s, b) == 0 || (c != NULL && strcmp(s, c) == 0);
}

static int shape_is_date(const char *t) {   // 모양만(달력 검사는 Day 84의 date_valid)
    if (strlen(t) != 10 || t[4] != '-' || t[7] != '-') {
        return 0;
    }
    for (int i = 0; i < 10; i++) {
        if (i != 4 && i != 7 && !isdigit((unsigned char)t[i])) {
            return 0;
        }
    }
    return 1;
}

// 다섯 칸을 검사해 *out을 채운다. 실패하면 *out은 건드리지 않는다
enum row_error make_session(char f[5][64], Session *out) {
    if (!shape_is_date(f[0])) {
        return BAD_DATE;
    }
    if (!is_one_of(f[1], "C", "Python", "Rust") || f[2][strspn(f[2], " ")] == '\0' ||
        !is_one_of(f[4], "pass", "retry", NULL)) {
        return BAD_VALUE;
    }
    if (f[3][0] == '0' || f[3][0] == '\0' || strspn(f[3], "0123456789") != strlen(f[3]) || strlen(f[3]) > 5 ||
        atoi(f[3]) > 10080) {
        return BAD_MINUTES;
    }
    Session s;
    snprintf(s.day, sizeof s.day, "%s", f[0]);
    snprintf(s.language, sizeof s.language, "%s", f[1]);
    snprintf(s.topic, sizeof s.topic, "%s", f[2]);
    s.minutes = (unsigned)atoi(f[3]);
    snprintf(s.result, sizeof s.result, "%s", f[4]);
    *out = s;                               // 모두 통과했을 때만 결과를 넘긴다
    return ROW_OK;
}

int main(void) {
    char rows[4][5][64] = {
        {"2026-10-02", "C", "배열, 포인터", "45", "retry"},
        {"2026/10/02", "C", "x", "45", "retry"},
        {"2026-10-02", "Go", "x", "45", "retry"},
        {"2026-10-02", "C", "x", "030", "retry"},
    };
    static const char *names[] = {"ok", "날짜 오류", "language/topic/result 오류", "minutes 오류"};
    for (int i = 0; i < 4; i++) {
        Session s;
        enum row_error e = make_session(rows[i], &s);
        if (e == ROW_OK) {
            printf("%d행: %s|%s|%s|%u|%s\n", i + 2, s.day, s.language, s.topic, s.minutes, s.result);
        } else {
            printf("%d행: %s\n", i + 2, names[e]);
        }
    }
    return 0;
}
```

실행 결과:

```text
2행: 2026-10-02|C|배열, 포인터|45|retry
3행: 날짜 오류
4행: language/topic/result 오류
5행: minutes 오류
```

### 코드 한 부분씩 읽기

| 코드                                                           | 설명                                                                                                           |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `enum row_error { ROW_OK, BAD_DATE, BAD_VALUE, BAD_MINUTES };` | 실패 이유를 번호로 나타냅니다. 이름 표 `names[e]`로 문장을 찾습니다.                                           |
| `enum row_error make_session(char f[5][64], Session *out)`     | 반환값은 이유, 결과는 출력 매개변수입니다(Day 43).                                                             |
| `f[2][strspn(f[2], " ")] == '\0'`                              | 앞에서부터 공백을 건너뛴 자리가 문자열 끝이면 공백만 있는 주제입니다.                                          |
| `strspn(f[3], "0123456789") != strlen(f[3])`                   | 숫자가 아닌 글자가 있는지 확인합니다. `strlen(f[3]) > 5`는 `atoi`가 넘치지 않게 자릿수를 먼저 제한한 것입니다. |
| `Session s; ... *out = s;`                                     | 지역 변수에 모두 채운 뒤 **마지막에 한 번** 넘깁니다. 중간에 실패하면 `*out`은 그대로입니다.                   |
| `snprintf(s.topic, sizeof s.topic, "%s", f[2])`                | 크기를 정해 복사합니다(Day 37). 실제 프로젝트는 주제 길이를 먼저 확인해 너무 길면 오류로 봅니다.               |

오늘의 C는 날짜의 **모양**만 확인합니다. 달력 검사는 Day 84에서 만든 `date_valid`를 Day 87에서 합칩니다.

## 7. Rust로 구현하기

```rust
// 파일: make_session.rs
struct Session {
    date: String,
    language: String,
    topic: String,
    minutes: u32,
    result: String,
}

fn make_session(fields: &[&str], line: usize) -> Result<Session, String> {
    let [date, language, topic, minutes, result] = fields else {   // 정확히 다섯 칸일 때만 풀린다
        return Err(format!("{line}행: 열이 정확히 5개여야 합니다"));
    };
    let shape_ok = date.len() == 10 && date.as_bytes()[4] == b'-' && date.as_bytes()[7] == b'-';
    if !shape_ok {
        return Err(format!("{line}행: 날짜 오류"));
    }
    if !matches!(*language, "C" | "Python" | "Rust") || topic.trim().is_empty() || !matches!(*result, "pass" | "retry") {
        return Err(format!("{line}행: language/topic/result 오류"));
    }
    if minutes.starts_with('0') || !minutes.bytes().all(|c| c.is_ascii_digit()) {
        return Err(format!("{line}행: minutes는 양의 정수여야 합니다"));
    }
    let m: u32 = minutes.parse().map_err(|_| format!("{line}행: minutes 오류"))?;
    if !(1..=10080).contains(&m) {
        return Err(format!("{line}행: minutes는 10080 이하여야 합니다"));
    }
    Ok(Session { date: date.to_string(), language: language.to_string(), topic: topic.to_string(), minutes: m, result: result.to_string() })
}

fn main() {
    let rows: [&[&str]; 4] = [
        &["2026-10-02", "C", "배열, 포인터", "45", "retry"],
        &["2026-10-02", "C", "x", "45"],
        &["2026-10-02", "Go", "x", "45", "retry"],
        &["2026-10-02", "C", "x", "10081", "retry"],
    ];
    for (i, fields) in rows.iter().enumerate() {
        match make_session(fields, i + 2) {
            Ok(s) => println!("{}행: {}|{}|{}|{}|{}", i + 2, s.date, s.language, s.topic, s.minutes, s.result),
            Err(e) => println!("오류: {e}"),
        }
    }
}
```

실행 결과:

```text
2행: 2026-10-02|C|배열, 포인터|45|retry
오류: 3행: 열이 정확히 5개여야 합니다
오류: 4행: language/topic/result 오류
오류: 5행: minutes는 10080 이하여야 합니다
```

### 코드 한 부분씩 읽기

| 코드                                                                  | 설명                                                                                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `let [date, language, topic, minutes, result] = fields else { ... };` | 슬라이스가 **정확히 다섯 칸**일 때만 풀립니다. 칸 수 검사와 이름 붙이기가 한 번에 끝납니다(실습의 독립 문제).                        |
| `matches!(*language, "C" \| "Python" \| "Rust")`                      | `language`는 `&&str`이라 `*`로 한 번 따라가 비교했습니다.                                                                            |
| `minutes.starts_with('0') \|\| !minutes.bytes().all(...)`             | 모양을 먼저 확인합니다. Python의 `isascii() and isdigit()`와 같습니다.                                                               |
| `minutes.parse().map_err(...)?`                                       | 모양이 맞아도 너무 크면 `u32`에 들어가지 않아 실패할 수 있습니다.                                                                    |
| `Ok(Session { date: date.to_string(), ... })`                         | 검증을 모두 통과해야 `Session`이 만들어집니다. `Session`을 받은 코드는 값이 올바르다고 믿을 수 있습니다.                             |
| `Session`에 `derive(Debug)`가 없음                                    | 필드를 직접 출력하므로 필요 없습니다. `Debug`만으로 출력하면 필드를 "읽지 않는다"는 경고가 나서, 이 과정의 설정에서는 오류가 됩니다. |

## 8. 실행 추적

Python `load`가 오류 사례 `2026-10-01,Python,변수,30,pass,extra`를 읽는 과정입니다.

| 단계           | 값                                                   | 판단                    |
| -------------- | ---------------------------------------------------- | ----------------------- |
| 헤더           | `['date', 'language', 'topic', 'minutes', 'result']` | 계약과 같음             |
| 2행을 사전으로 | `{..., 'result': 'pass', None: ['extra']}`           |                         |
| `None in row`  | 참                                                   | 열 수 오류              |
| 결과           | `ValueError("2행: 열이 정확히 5개여야 합니다")`      | 나머지 검사는 하지 않음 |

검사는 **열 수 → 값 → 날짜 → minutes** 순서입니다. 열 수가 틀린 줄에서 `row["result"]`를 믿고 읽으면 엉뚱한 칸을 검사하게 되므로, 열 수를 가장 먼저 확인합니다.

## 9. 다른 예제로 다시 이해하기

**명령줄 옵션 읽기.** `study_log FILE --language Rust --top 2`처럼 받은 옵션을 읽고, 계약에 맞는지 확인합니다. 실행기에서 명령줄을 줄 수 없으므로 `parse_args(목록)`에 인자 목록을 직접 넘겨 시험합니다.

```python
# 파일: cli_options.py
import argparse
from datetime import date


def build_parser():
    p = argparse.ArgumentParser(prog="study_log", description="공부 기록 분석기")
    p.add_argument("csv_path")
    p.add_argument("--language", choices=["C", "Python", "Rust"])
    p.add_argument("--topic")
    p.add_argument("--date")
    p.add_argument("--search")
    p.add_argument("--sort", choices=["minutes", "date"], default="minutes")
    p.add_argument("--top", type=int, default=5)
    return p


def check(args):                            # argparse가 못 하는 계약 검사
    if args.date is not None:
        try:
            if date.fromisoformat(args.date).isoformat() != args.date:
                raise ValueError
        except ValueError:
            raise ValueError(f"--date 오류: {args.date}") from None
    if not 1 <= args.top <= 1000:
        raise ValueError("--top은 1~1000 사이여야 합니다")
    return args


parser = build_parser()
for argv in (["log.csv"],
             ["log.csv", "--language", "Rust", "--top", "2"],
             ["log.csv", "--sort", "date", "--search", "변수"],
             ["log.csv", "--top", "0"],
             ["log.csv", "--date", "2026-02-30"]):
    try:
        a = check(parser.parse_args(argv))  # 실제 프로그램은 인자 없이 parse_args()로 sys.argv를 읽는다
        print(f"{' '.join(argv)} → language={a.language} sort={a.sort} top={a.top} search={a.search}")
    except ValueError as e:
        print(f"{' '.join(argv)} → 오류: {e}")
```

실행 결과:

```text
log.csv → language=None sort=minutes top=5 search=None
log.csv --language Rust --top 2 → language=Rust sort=minutes top=2 search=None
log.csv --sort date --search 변수 → language=None sort=date top=5 search=변수
log.csv --top 0 → 오류: --top은 1~1000 사이여야 합니다
log.csv --date 2026-02-30 → 오류: --date 오류: 2026-02-30
```

| 코드                              | 설명                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `p.add_argument("csv_path")`      | 이름 앞에 `--`가 없으면 반드시 줘야 하는 위치 인자입니다.                                                                       |
| `choices=["C", "Python", "Rust"]` | 목록 밖의 값이면 argparse가 사용법과 함께 종료 코드 2로 끝냅니다. 그 경우는 프로그램이 끝나 버려서 이 예제에는 넣지 않았습니다. |
| `type=int, default=5`             | 문자열을 정수로 바꾸고, 없으면 5입니다.                                                                                         |
| `def check(args)`                 | argparse가 표현하지 못하는 계약(범위, 달력)을 확인합니다. `from None`은 원인을 숨겨 사용자에게 필요한 문장만 남깁니다.          |
| `parser.parse_args(argv)`         | 목록을 넘기면 `sys.argv` 대신 그것을 읽습니다. 시험할 때 쓰는 방법입니다.                                                       |

Rust 구현은 옵션 라이브러리 없이 직접 읽습니다. 실제 프로젝트의 `options()`와 같은 모양입니다.

```rust
// 파일: cli_options.rs
struct Options {
    path: String,
    language: Option<String>,
    search: Option<String>,
    sort: String,
    top: usize,
}

fn parse_options(args: &[&str]) -> Result<Options, String> {
    let mut it = args.iter();
    let path = it.next().ok_or("사용법: study_log FILE [옵션]")?.to_string();
    let mut o = Options { path, language: None, search: None, sort: "minutes".into(), top: 5 };
    while let Some(flag) = it.next() {
        let value = it.next().ok_or(format!("{flag}에 값이 없습니다"))?;
        match *flag {
            "--language" if matches!(*value, "C" | "Python" | "Rust") => o.language = Some(value.to_string()),
            "--search" => o.search = Some(value.to_string()),
            "--sort" if *value == "minutes" || *value == "date" => o.sort = value.to_string(),
            "--top" => {
                o.top = value.parse().map_err(|_| format!("--top 숫자 오류: {value}"))?;
                if !(1..=1000).contains(&o.top) {
                    return Err(String::from("--top은 1~1000 사이여야 합니다"));
                }
            }
            _ => return Err(format!("알 수 없거나 잘못된 옵션: {flag} {value}")),
        }
    }
    Ok(o)
}

fn main() {
    let cases: [&[&str]; 5] = [
        &["log.csv"],
        &["log.csv", "--language", "Rust", "--top", "2"],
        &["log.csv", "--language", "Go"],
        &["log.csv", "--top"],
        &[],
    ];
    for args in cases {
        match parse_options(args) {
            Ok(o) => println!("{} → path={} language={:?} search={:?} sort={} top={}", args.join(" "), o.path, o.language, o.search, o.sort, o.top),
            Err(e) => println!("{} → 오류: {e}", args.join(" ")),
        }
    }
}
```

실행 결과:

```text
log.csv → path=log.csv language=None search=None sort=minutes top=5
log.csv --language Rust --top 2 → path=log.csv language=Some("Rust") search=None sort=minutes top=2
log.csv --language Go → 오류: 알 수 없거나 잘못된 옵션: --language Go
log.csv --top → 오류: --top에 값이 없습니다
 → 오류: 사용법: study_log FILE [옵션]
```

- `let mut it = args.iter();`로 인자를 하나씩 꺼내며, 옵션 이름 다음에 값을 하나 더 꺼냅니다. 값이 없으면 `ok_or`로 오류를 만듭니다.
- `"--language" if matches!(...) =>`처럼 `match`의 가드로 값까지 확인해, 목록 밖 값은 마지막 `_` 팔로 갑니다.
- 인자가 하나도 없으면 첫 `it.next()`가 `None`이라 사용법 오류입니다. 출력의 첫 칸이 빈 이유는 인자 목록이 비어 있기 때문입니다.
- 실제 프로젝트에서는 `std::env::args().skip(1)`로 명령줄 인자를 받습니다. 첫 인자는 프로그램 자신의 이름이라 건너뜁니다.

## 10. 검증 코드 대응표

| 검사             | Python                              | C                                   | Rust                                    |
| ---------------- | ----------------------------------- | ----------------------------------- | --------------------------------------- |
| 열 수            | `None in row`, `row.get(f) is None` | `csv_fields`가 다섯 칸인지(Day 87)  | `let [a, b, c, d, e] = fields else`     |
| 허용 값          | `in {...}`                          | `strcmp` 여러 번                    | `matches!`                              |
| 공백만 있는 주제 | `not topic.strip()`                 | `strspn` 또는 `isspace` 반복        | `topic.trim().is_empty()`               |
| minutes 모양     | `isascii() and isdigit()`, 앞자리 0 | `strspn`/`isdigit`, 앞자리 0        | `bytes().all(is_ascii_digit)`, 앞자리 0 |
| minutes 범위     | `int` 후 비교                       | 자릿수 제한 + `atoi` 또는 `strtoul` | `parse::<u32>` + `(1..=10080).contains` |
| 결과 만들기      | `Session(...)`(frozen)              | 지역 변수 → `*out`                  | `Ok(Session { ... })`                   |
| 오류             | `ValueError(문장) from 원인`        | `enum row_error`                    | `Err(String)`                           |

## 11. 세 언어 비교

| 관점             | Python             | C                       | Rust                          |
| ---------------- | ------------------ | ----------------------- | ----------------------------- |
| 검증된 값의 표시 | `Session`(frozen)  | `Session` 구조체(약속)  | `Session`(만드는 길이 검증뿐) |
| 실패 이유        | 문장 + 원인        | 번호                    | 문장(또는 enum)               |
| 부분 성공 방지   | 예외로 중간에 끝남 | 성공할 때만 `*out`에 씀 | `?`와 `Ok`로 끝에서만 만듦    |
| 명령줄 옵션      | `argparse`(표준)   | 직접                    | 직접(또는 `clap` 크레이트)    |

## 12. 자주 하는 실수

### 실수 1: 변환을 먼저 하고 모양을 나중에 검사한다

실습의 변형 문제입니다. `int(" 30 ")`은 30이 되어 계약 밖 입력이 통과하고, `int("abc")`는 계약의 문장 대신 실행기의 문장을 냅니다.

### 실수 2: 줄 번호를 0이나 1부터 센다

실습의 디버그 문제입니다. 헤더가 1행이므로 `enumerate(reader, start=2)`입니다.

### 실수 3: 열 수를 확인하지 않고 값을 읽는다

`row["result"]`는 모자란 칸이면 `None`이고, `None not in RESULTS`로 오류는 나지만 이유가 "값 오류"로 잘못 나옵니다. 열 수를 **가장 먼저** 확인해야 오류 이유가 정확합니다.

### 실수 4: 검증된 기록을 바꿀 수 있게 둔다

보통 `dataclass`로 만들면 나중에 `s.minutes = 0` 같은 실수를 막을 수 없습니다. `frozen=True`로 얼리세요.

### 실수 5: argparse만 믿는다

`type=int`는 `--top 0`이나 `--top -5`도 받아들입니다. 계약의 범위는 직접 검사하세요.

## 13. Q&A

**Q. DictReader와 reader 중 무엇을 써야 하나요?**

A. 열 이름으로 꺼내면 코드가 읽기 쉽고, 열 순서가 바뀌어도 이름으로 찾을 수 있어 `DictReader`가 편합니다. 다만 이 프로젝트는 열 순서까지 계약이라 헤더를 정확히 비교하므로, `reader`와 `len(row) == 5`로 써도 됩니다. 실제 프로젝트는 `DictReader`를 씁니다.

**Q. 잘못된 줄을 만나면 거기서 멈추는 게 맞나요?**

A. 이 프로젝트의 계약은 "첫 잘못된 줄에서 오류로 끝낸다"입니다. 잘못된 줄을 건너뛰고 계산하면 합계가 틀려도 사용자가 모르기 때문입니다. Day 83의 규칙 표처럼 모든 문제를 모아 보여 주는 도구는 따로 두는 것이 좋습니다(`--check` 같은 옵션).

**Q. 날짜를 문자열로 저장하는 이유는요? date 객체가 더 좋지 않나요?**

A. 이 프로젝트는 날짜로 계산하지 않고, 같은지 비교(`--date`)와 정렬(`--sort date`)만 합니다. `YYYY-MM-DD` 문자열은 사전 순서가 날짜 순서와 같아서 그대로 정렬할 수 있고, 출력도 그대로입니다. 세 구현이 모두 문자열로 다루면 비교하기도 쉽습니다.

**Q. 큰 파일도 이렇게 읽어도 되나요?**

A. `load`는 모든 줄을 리스트에 모읍니다. 수백만 줄이면 메모리를 많이 쓰므로, 줄마다 바로 집계하는 방식(생성기, `yield`)으로 바꿀 수 있습니다. 이 프로젝트의 C 구현은 최대 4096줄로 제한하고, 넘으면 오류로 봅니다(Day 88).

## 14. 핵심 요약

- `csv.DictReader(stream, strict=True)`로 읽고, `fieldnames == FIELDS`로 헤더를, `None` 열쇠와 `None` 값으로 열 수를 확인합니다.
- 검증은 **열 수 → 값 → 날짜 → minutes** 순서, 각 열은 **모양 먼저, 변환 나중**입니다.
- 오류는 줄 번호와 계약의 말로 쓰고, `raise ... from`으로 원인을 잇습니다. 줄 번호는 헤더가 1행이라 데이터가 2행부터입니다.
- 통과한 줄만 `frozen dataclass`로 만들어, 이후 코드는 검증된 값만 다룹니다.
- C는 오류 enum과 "성공할 때만 `*out`에 쓰기", Rust는 슬라이스 패턴 `let [..] = fields else`와 `Result`로 같은 검증을 합니다.
- `argparse`는 옵션을 읽어 주지만 범위·달력 같은 계약은 직접 검사합니다.

## 15. 도전 문제

1. **(Python)** `parse_date`가 줄 번호를 받아 `"2행: 날짜 오류: 2026-02-30"`처럼 알리도록 바꾸세요. 세 구현 모두 바꿔야 결과가 같아진다는 점을 생각해, 바꾸기 전에 계약 문서에 먼저 적으세요.
2. **(Python)** `load`를 생성기로 바꿔(`yield Session(...)`) 줄마다 하나씩 돌려주게 하고, 사용하는 쪽에서 `list(load(...))`로 받으면 같은 결과인지 확인하세요.
3. **(C)** `make_session`에 Day 84의 `date_valid`를 합쳐 달력 검사를 추가하고, 오류 사례 `2026-02-29`를 표에 넣으세요.
4. **(Rust)** `make_session`의 오류를 `enum RowError { Columns(usize), Value(usize), Minutes(usize) }`로 바꾸고, `Display`를 구현해 지금과 같은 문장이 나오게 하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `load`, `parse_date`, `Session`은 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.py`에 그대로 들어 있습니다. 파일의 `main()`에서 `argparse`로 옵션을 읽고, `load`와 `report`(Day 86)를 이어 부르는 흐름을 확인해 보세요.
