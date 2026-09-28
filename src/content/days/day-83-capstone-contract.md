---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-83-capstone-contract
courseId: crp-92
phaseId: phase-08
dayNumber: 83
date: "2026-12-22"
title: "프로젝트 계약: 공통 CSV 입력"
summary: 마지막 열흘 동안 C, Python, Rust로 같은 프로그램 Study Log Analyzer(공부 기록 CSV를 읽어 통계를 내는 명령줄 도구)를 만듭니다. 첫날은 세 구현이 똑같이 지켜야 할 계약을 정합니다. 입력은 date,language,topic,minutes,result 다섯 열의 CSV이고, 각 열의 규칙(날짜 모양, 허용 언어, 비어 있지 않은 주제, 1~10080분, pass·retry)과 출력 줄의 순서와 모양, 잘못된 입력에서 오류를 표준 오류로 알리고 0이 아닌 종료 코드로 끝내는 약속을 정합니다. 쉼표가 든 주제를 따옴표로 감싸는 CSV 규칙 때문에 단순 split이 틀린다는 것을 확인하고, Python csv 모듈, C와 Rust로 직접 만든 따옴표 인식 나누기를 비교한 뒤, 계약을 규칙 표로 만들어 한 줄의 모든 위반을 알려 주는 검사기를 만듭니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 100
prerequisites: [day-82-shortest-path]
learningObjectives:
  - 세 구현이 공유할 입력·출력·오류 계약을 글과 표로 정리한다.
  - 따옴표로 감싼 CSV 칸에서 단순 split이 틀리는 이유를 설명하고 csv 모듈로 올바르게 나눈다.
  - C와 Rust로 따옴표와 "" 를 인식하는 한 줄 나누기를 만든다.
  - 열마다의 규칙을 표(이름, 검사, 설명)로 만들어 한 줄의 모든 위반을 찾는다.
  - 계약이 세 구현의 결과를 비교할 수 있게 해 주는 이유를 설명한다.
concepts:
  [
    project contract,
    specification,
    csv format,
    quoted field,
    escaped quote,
    header check,
    field rules,
    exit code,
    stderr,
    rule table,
    fixture,
    capstone,
  ]
runnerMode: python
playgroundSource: |
  # 파일: csv_play.py — split과 csv 모듈을 비교해 보세요.
  import csv
  line = '2026-10-02,C,"배열, 포인터",45,retry'
  print(line.split(","))
  print(next(csv.reader([line])))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day83-predict-split
    title: split과 csv의 칸 수 예측하기
    kind: predict
    objective: 따옴표 안의 쉼표를 split은 모르고 csv는 안다는 것을 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      import csv

      line = 'a,"b,c",d'
      print(len(line.split(",")), len(next(csv.reader([line]))))
    answer: "4 3"
    hint: "split은 쉼표를 만날 때마다 자릅니다. csv는 따옴표 안의 쉼표를 글자로 봅니다."
    explanation: 'split(",")은 a, "b, c", d로 네 조각을 만듭니다. csv.reader는 "b,c"를 한 칸으로 보고 따옴표를 떼어 a, b,c, d 세 칸입니다. 주제 이름에 쉼표가 들어갈 수 있는 이 프로젝트에서 split을 쓰면 열 개수가 달라져 모든 뒤쪽 열이 어긋납니다.'
    commonMistakes:
      - "둘 다 3이라고 생각함"
      - "csv가 따옴표까지 남긴다고 생각함"
    language: python
    verification: run
  - id: ex-day83-predict-escape
    title: 따옴표 안의 따옴표 예측하기
    kind: predict
    objective: CSV에서 따옴표 두 개("")가 따옴표 하나를 뜻한다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      import csv

      print(next(csv.reader(['"say ""hi""",1'])))
    answer: '[''say "hi"'', ''1'']'
    hint: '따옴표로 감싼 칸 안에서 "" 는 글자 " 하나입니다.'
    explanation: 'CSV 표준(RFC 4180)은 따옴표로 감싼 칸 안에 따옴표를 넣으려면 두 번 쓰게 합니다. 그래서 "say ""hi"""는 say "hi"가 됩니다. 오늘 만드는 C와 Rust 나누기도 이 규칙을 지킵니다. 세 구현이 이 작은 규칙까지 같아야 같은 입력에서 같은 결과를 냅니다.'
    commonMistakes:
      - "따옴표가 모두 사라진다고 생각함"
      - '"" 가 빈 칸을 뜻한다고 생각함'
    language: python
    verification: run
  - id: ex-day83-fill
    title: csv 모듈로 한 줄 나누기 채우기
    kind: fill
    objective: 문자열 목록을 CSV 줄로 읽는 함수를 쓴다.
    prompt: "빈칸을 채워 따옴표 안의 쉼표를 지키며 나눈 다섯 칸이 출력되게 하세요."
    starter: |-
      import csv

      line = '2026-10-02,C,"배열, 포인터",45,retry'
      print(next(csv._____([line])))
    answer: |-
      import csv

      line = '2026-10-02,C,"배열, 포인터",45,retry'
      print(next(csv.reader([line])))
    output: "['2026-10-02', 'C', '배열, 포인터', '45', 'retry']"
    hint: "csv 모듈에서 줄을 읽어 칸 목록을 주는 도구의 이름입니다."
    explanation: 'csv.reader는 줄들을 받아(파일, StringIO, 문자열 리스트 모두 됨) 줄마다 칸 리스트를 줍니다. next로 첫 줄만 꺼냈습니다. 실제 프로젝트는 열 이름으로 꺼내는 csv.DictReader를 쓰고, 파일을 열 때 newline=""을 줘서 따옴표 안의 줄바꿈 규칙을 csv 모듈이 처리하게 합니다.'
    commonMistakes:
      - "csv.split처럼 없는 함수를 씀"
      - "line만 넘겨 글자 하나씩을 한 줄로 읽음(리스트로 감싸야 함)"
    language: python
    verification: run
  - id: ex-day83-modify
    title: split 나누기를 csv로 바꾸기
    kind: modify
    objective: 쉼표가 든 주제를 올바르게 읽도록 나누는 방법을 바꾼다.
    prompt: 'split으로 나눠서 칸이 6개가 되고 주제가 ''"배열''로 잘립니다. csv.reader로 바꿔 ''5 배열, 포인터''가 출력되게 하세요.'
    starter: |-
      line = '2026-10-02,C,"배열, 포인터",45,retry'
      fields = line.split(",")
      print(len(fields), fields[2])
    answer: |-
      import csv

      line = '2026-10-02,C,"배열, 포인터",45,retry'
      fields = next(csv.reader([line]))
      print(len(fields), fields[2])
    output: "5 배열, 포인터"
    starterOutput: '6 "배열'
    hint: "나누는 한 줄만 바꾸면 됩니다."
    explanation: 'split으로 나누면 주제가 두 칸으로 갈라지고, 그 뒤의 minutes와 result가 한 칸씩 밀려 minutes 자리에 '' 포인터"''가 옵니다. 이 버그는 쉼표가 든 주제가 있을 때만 드러나서, 시험 입력(fixture)에 일부러 그런 줄을 넣어 둡니다(Day 84).'
    commonMistakes:
      - "split(', ')로 바꿔 다른 줄이 깨짐"
      - "따옴표를 replace로 지운 뒤 split해서 여전히 6칸이 됨"
    language: python
    verification: run
  - id: ex-day83-debug
    title: 항상 틀리는 헤더 검사 고치기
    kind: debug
    objective: 리스트와 문자열을 비교하는 실수를 고친다.
    prompt: "이 코드는 헤더가 맞는데도 '헤더 틀림'을 출력합니다. 올바르게 비교해 '헤더 OK'가 출력되게 하세요."
    starter: |-
      import csv
      import io

      text = "date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n"
      header = next(csv.reader(io.StringIO(text)))
      print("헤더 OK" if header == "date,language,topic,minutes,result" else "헤더 틀림")
    answer: |-
      import csv
      import io

      text = "date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n"
      header = next(csv.reader(io.StringIO(text)))
      print("헤더 OK" if header == ["date", "language", "topic", "minutes", "result"] else "헤더 틀림")
    output: "헤더 OK"
    starterOutput: "헤더 틀림"
    hint: "csv.reader가 주는 것은 문자열이 아니라 리스트입니다. 자료형이 다르면 ==는 언제나 False입니다."
    explanation: "Python은 리스트와 문자열을 비교해도 오류 없이 False를 돌려줘서 이런 실수를 알아채기 어렵습니다. 계약의 열 목록을 FIELDS 상수 하나로 두고 header == FIELDS로 비교하면, 세 구현과 시험이 같은 목록을 씁니다. Rust라면 Vec<String>과 &str을 ==로 비교하는 코드가 컴파일되지 않습니다."
    commonMistakes:
      - '",".join(header)로 바꿔 비교해도 되지만, 따옴표로 감싼 헤더에서는 달라질 수 있음'
      - "순서가 다른 리스트와 비교함(열 순서도 계약)"
    language: python
    verification: run
  - id: ex-day83-independent
    title: C로 따옴표를 고려해 칸 수 세기
    kind: independent
    objective: 따옴표 안의 쉼표를 건너뛰며 칸 수를 센다.
    prompt: 'int count_fields(const char *line)을 만들어 따옴표 밖의 쉼표만 세어 칸 수를 돌려주세요. ''a,"b,c",d''는 3, ''x''는 1이라 ''3 1''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 count_fields를 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int count_fields(const char *line) {
          int n = 1, quoted = 0;
          for (; *line; line++) {
              if (*line == '"') {
                  quoted = !quoted;
              } else if (*line == ',' && !quoted) {
                  n++;
              }
          }
          return n;
      }

      int main(void) {
          printf("%d %d\n", count_fields("a,\"b,c\",d"), count_fields("x"));
          return 0;
      }
    output: "3 1"
    hint: "따옴표를 만날 때마다 '따옴표 안인가'를 뒤집고, 밖에 있을 때만 쉼표를 셉니다."
    explanation: '칸 수는 따옴표 밖 쉼표 수 + 1입니다. "" 는 뒤집기를 두 번 해서 원래대로 돌아오므로 이 세기에는 문제가 없습니다. 실제 나누기에서는 칸의 내용도 모아야 하고, 닫히지 않은 따옴표나 따옴표 뒤의 이상한 글자를 오류로 알려야 합니다(오늘의 C 예제와 Day 87).'
    commonMistakes:
      - "모든 쉼표를 세어 4가 나옴"
      - "빈 문자열에서 0을 돌려줘야 하는지 생각하지 않음(빈 줄도 칸 하나로 봄)"
    language: c
    verification: run
quiz:
  - id: quiz-day83-01
    question: 세 언어로 같은 프로그램을 만들기 전에 계약을 먼저 정하는 이유는?
    choices:
      - 코드를 짧게 하려고
      - 같은 입력에 같은 출력·같은 오류를 내야 세 구현을 서로 비교하고 시험할 수 있어서
      - 언어마다 다른 규칙을 쓰려고
      - 계약이 있어야 컴파일되어서
    answerIndex: 1
    explanation: 열 순서, 값의 범위, 출력 줄의 모양, 오류일 때의 동작이 한 가지로 정해져 있어야 '세 결과가 같은가'를 기계적으로 확인할 수 있습니다(Day 91). 계약이 모호하면 구현마다 다르게 해석해 결과가 어긋납니다.
  - id: quiz-day83-02
    question: 주제 칸에 쉼표가 들어갈 수 있을 때 CSV는 어떻게 쓰는가?
    choices:
      - 쉼표를 지운다
      - 칸을 큰따옴표로 감싼다("배열, 포인터")
      - 세미콜론으로 바꾼다
      - 쓸 수 없다
    answerIndex: 1
    explanation: 따옴표로 감싼 칸 안의 쉼표는 구분자가 아니라 글자입니다. 따옴표 자체는 두 번 써서("") 넣습니다. 그래서 CSV를 split으로 나누면 틀리고, 규칙을 아는 파서가 필요합니다.
  - id: quiz-day83-03
    question: 이 프로젝트에서 minutes 칸의 규칙으로 옳은 것은?
    choices:
      - 아무 정수
      - 1~10080의 ASCII 숫자, 앞에 0 없음(030은 틀림)
      - 소수도 됨
      - 0 이상
    answerIndex: 1
    explanation: 10080분은 일주일입니다. 앞자리 0을 막는 이유는 030과 30을 같은 값으로 볼지 구현마다 달라질 수 있기 때문입니다. 규칙을 좁게 정할수록 세 구현이 같은 판단을 하기 쉽습니다.
  - id: quiz-day83-04
    question: 잘못된 줄을 만났을 때의 계약은?
    choices:
      - 그 줄을 조용히 건너뛴다
      - 표준 오류에 이유를 쓰고 0이 아닌 종료 코드로 끝낸다
      - 0으로 바꿔 계산한다
      - 결과에 섞어 출력한다
    answerIndex: 1
    explanation: 표준 출력은 결과만 담아야 다른 프로그램이 읽을 수 있고, 종료 코드는 스크립트가 성공·실패를 알게 해 줍니다. 조용히 건너뛰면 합계가 틀렸는데도 아무도 모릅니다.
  - id: quiz-day83-05
    question: 규칙을 (이름, 검사 함수, 설명) 표로 만드는 장점은?
    choices:
      - 실행이 빨라진다
      - 한 줄의 모든 위반을 한 번에 알려 주고, 규칙을 추가·변경할 때 표만 고치면 된다
      - 규칙이 필요 없어진다
      - 오류를 숨길 수 있다
    answerIndex: 1
    explanation: 표는 계약 문서와 코드가 같은 모양이라 읽고 비교하기 쉽습니다. 첫 오류에서 멈추는 검사보다 모든 문제를 한 번에 보여 주는 편이 사용자가 파일을 고치기 편합니다.
---

## 1. 오늘 배울 내용

마지막 열흘(Day 83~92) 동안 지금까지 배운 것을 모아 **실제로 쓸 수 있는 작은 프로그램**을 세 언어로 만듭니다.

> **Study Log Analyzer**: 공부 기록 CSV 파일을 읽어, 공부한 시간의 합계·평균·언어별·주제별 통계와 가장 긴 공부 기록을 출력하는 명령줄 도구

C, Python, Rust 세 구현은 **같은 입력에 같은 출력**을 내야 합니다. 그러려면 먼저 모두가 지킬 **계약**(specification)이 필요합니다. 오늘은 그 계약을 정합니다.

1. 입력 계약
   - 헤더 `date,language,topic,minutes,result`, 열 다섯 개
   - 열마다의 규칙(날짜 모양, 허용 언어, 1~10080분 등)
   - 쉼표가 든 칸은 **따옴표**로 감싸고, 따옴표는 `""`로 넣음
2. 출력 계약: 줄의 순서와 모양
3. 오류 계약: 잘못된 입력은 표준 오류에 이유를 쓰고 0이 아닌 종료 코드
4. 단순 `split`이 틀리는 이유와 올바른 나누기
   - Python: `csv` 모듈
   - C, Rust: 따옴표를 인식하는 나누기를 직접 작성
5. 계약을 **규칙 표**로 만들어 한 줄의 모든 위반을 알려 주는 검사기를 만듭니다.

## 2. 왜 필요한가

세 명이 각자 같은 프로그램을 만든다고 생각해 보세요. 한 명은 `030`을 30으로 받아들이고, 한 명은 오류로 보고, 한 명은 잘못된 줄을 건너뜁니다. 모두 "맞게" 만들었다고 생각하지만 결과는 서로 다릅니다.

- 계약이 없으면 **무엇이 정답인지** 정할 수 없습니다.
- 계약이 있으면 세 구현의 출력을 **글자 하나까지** 비교할 수 있습니다(Day 91).
- 계약은 사용자에게 주는 약속이기도 합니다. 어떤 파일을 넣어야 하고, 무엇이 나오며, 틀리면 어떻게 되는지 알려 줍니다.

실무의 프로그램도 파일 형식, API, 명령줄 옵션을 계약으로 정하고, 그 계약을 시험으로 확인합니다.

## 3. 그림으로 이해하기

**프로그램 전체 흐름.**

```text
study_sessions.csv ──▶ [읽기·나누기] ──▶ [검증] ──▶ [걸러내기] ──▶ [집계·정렬] ──▶ 표준 출력(보고서)
                           │               │
                           └── 잘못되면 ────┴──▶ 표준 오류 "오류: ..." + 종료 코드 1
```

**입력 계약.**

```text
date,language,topic,minutes,result                ← 헤더(이 순서, 이 이름)
2026-10-01,Python,변수,30,pass
2026-10-02,C,"배열, 포인터",45,retry             ← 쉼표가 든 칸은 따옴표로
│          │      │               │   │
│          │      │               │   └ pass 또는 retry
│          │      │               └ 1~10080, 앞에 0 없음
│          │      └ 비어 있지 않음(공백만도 안 됨)
│          └ C, Python, Rust 중 하나
└ 실제로 있는 날짜 YYYY-MM-DD(2026-02-30은 안 됨)
```

**split이 틀리는 이유.**

```text
2026-10-02,C,"배열, 포인터",45,retry
split(","):  [2026-10-02] [C] ["배열] [ 포인터"] [45] [retry]   6칸 ✗  뒤쪽 열이 한 칸씩 밀림
CSV 규칙:     [2026-10-02] [C] [배열, 포인터]   [45] [retry]   5칸 ✓
```

**출력 계약.**

```text
sessions: 4                  ← 고른 기록 수
total_minutes: 130
average_minutes: 32.50       ← 소수 둘째 자리
min_minutes: 25
max_minutes: 45
language_totals:             ← 언어 이름 순
C,45
Python,60
Rust,25
topic_totals:                ← 주제 이름 순
...
top_sessions:                ← 기본: 분이 많은 순, 같으면 날짜·언어·주제 순, 최대 5개
2026-10-02,C,배열, 포인터,45,retry
...
```

## 4. 천천히 풀어보기

### 4.1 계약 문서

| 항목          | 계약                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| 인코딩        | UTF-8                                                                     |
| 헤더          | 정확히 `date,language,topic,minutes,result`                               |
| 열 수         | 모든 줄이 5칸                                                             |
| `date`        | `YYYY-MM-DD`, 실제로 있는 날짜(윤년 포함)                                 |
| `language`    | `C`, `Python`, `Rust` 중 하나(대소문자 구별)                              |
| `topic`       | 공백만으로 된 글이 아님. 쉼표·따옴표는 CSV 규칙으로                       |
| `minutes`     | ASCII 숫자, 1~10080, 앞에 0 없음                                          |
| `result`      | `pass` 또는 `retry`                                                       |
| 잘못된 입력   | 표준 오류에 `오류: ...`, 종료 코드 1, 표준 출력에는 아무것도 쓰지 않음    |
| 걸러내기 옵션 | `--language`, `--topic`, `--date`, `--search`(주제에 포함, 대소문자 무시) |
| 정렬 옵션     | `--sort minutes`(기본, 분 내림차순) 또는 `--sort date`, `--top N`(1~1000) |

### 4.2 CSV의 따옴표 규칙

1. 칸 안에 쉼표, 따옴표, 줄바꿈이 있으면 칸 전체를 `"`로 감쌉니다.
2. 감싼 칸 안의 따옴표는 `""`로 두 번 씁니다.
3. 따옴표는 칸의 **맨 앞**에서만 감싸기를 시작합니다. `ab"c`처럼 중간의 따옴표는 오류로 봅니다(이 프로젝트의 규칙).

오늘 C와 Rust로 만든 나누기는 규칙 1과 2의 핵심만 담았습니다. 닫는 따옴표 뒤의 이상한 글자 검사, 줄바꿈이 든 칸 같은 나머지는 Day 87, 89에서 채웁니다.

### 4.3 fixture: 모두가 같은 입력

`examples/study-log-analyzer/study_sessions.csv`에는 네 줄이 들어 있습니다. 그중 하나는 일부러 쉼표가 든 주제(`"배열, 포인터"`)입니다. 이렇게 시험에 쓰려고 고정해 둔 입력을 **fixture**라고 합니다. 세 구현은 모두 이 파일로 같은 출력을 내야 하고, Day 84에서 잘못된 입력 fixture도 만듭니다.

## 5. Python으로 구현하기

```python
# 파일: contract.py
import csv
import io

FIELDS = ["date", "language", "topic", "minutes", "result"]   # 계약 1: 열의 이름과 순서
LANGUAGES = {"C", "Python", "Rust"}                           # 계약 2: 허용하는 값
RESULTS = {"pass", "retry"}

FIXTURE = """date,language,topic,minutes,result
2026-10-01,Python,변수,30,pass
2026-10-02,C,"배열, 포인터",45,retry
2026-10-03,Rust,소유권,25,pass
2026-10-04,Python,변수,30,pass
"""

print("1) 단순 split은 따옴표 안의 쉼표를 모른다")
second = FIXTURE.splitlines()[2]
print("  split:", second.split(","), f"({len(second.split(','))}칸)")
print("  csv  :", next(csv.reader([second])), f"({len(next(csv.reader([second])))}칸)")

print("2) 헤더 확인")
reader = csv.reader(io.StringIO(FIXTURE))
header = next(reader)
print("  헤더가 계약과 같은가?", header == FIELDS)

print("3) 줄마다 계약 확인")
for line_no, row in enumerate(reader, start=2):
    ok = len(row) == 5 and row[1] in LANGUAGES and row[4] in RESULTS and row[3].isdigit()
    print(f"  {line_no}행 {'OK' if ok else '위반'}: {row}")

print("4) 출력 계약: 이 순서, 이 모양으로")
contract_output = ["sessions: N", "total_minutes: N", "average_minutes: N.NN", "min_minutes: N",
                   "max_minutes: N", "language_totals:", "topic_totals:", "top_sessions:"]
for line in contract_output:
    print("  " + line)
```

실행 결과:

```text
1) 단순 split은 따옴표 안의 쉼표를 모른다
  split: ['2026-10-02', 'C', '"배열', ' 포인터"', '45', 'retry'] (6칸)
  csv  : ['2026-10-02', 'C', '배열, 포인터', '45', 'retry'] (5칸)
2) 헤더 확인
  헤더가 계약과 같은가? True
3) 줄마다 계약 확인
  2행 OK: ['2026-10-01', 'Python', '변수', '30', 'pass']
  3행 OK: ['2026-10-02', 'C', '배열, 포인터', '45', 'retry']
  4행 OK: ['2026-10-03', 'Rust', '소유권', '25', 'pass']
  5행 OK: ['2026-10-04', 'Python', '변수', '30', 'pass']
4) 출력 계약: 이 순서, 이 모양으로
  sessions: N
  total_minutes: N
  average_minutes: N.NN
  min_minutes: N
  max_minutes: N
  language_totals:
  topic_totals:
  top_sessions:
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `FIELDS = [...]`, `LANGUAGES = {...}` | 계약을 **상수**로 한곳에 적었습니다. 검사와 시험이 모두 이 상수를 씁니다.                                |
| `FIXTURE = """..."""`                 | 실제 fixture 파일과 같은 내용입니다. 파일 없이 시험하려고 문자열로 넣었습니다(Day 47).                   |
| `next(csv.reader([second]))`          | 한 줄만 CSV로 읽었습니다. 따옴표를 떼고 쉼표를 지켜 5칸입니다.                                           |
| `csv.reader(io.StringIO(FIXTURE))`    | 여러 줄을 파일처럼 읽습니다. 첫 `next`는 헤더입니다.                                                     |
| `enumerate(reader, start=2)`          | 헤더가 1행이므로 데이터는 2행부터 셉니다. 오류 메시지의 줄 번호가 편집기의 줄 번호와 맞습니다.           |
| `ok = len(row) == 5 and ...`          | 오늘은 계약의 모양만 간단히 확인했습니다. 날짜 달력 검사, 앞자리 0 등 자세한 검사는 Day 85에서 만듭니다. |

## 6. C로 구현하기

C에는 CSV 파서가 없어서 직접 만듭니다. 따옴표 안인지를 기억하는 **상태 하나**(`quoted`)가 핵심입니다.

```c
// 파일: csv_split.c
#include <stdio.h>
#include <string.h>

#define FIELDS 5
#define FIELD_MAX 64

// 한 줄을 다섯 칸으로 나눈다. 따옴표 안의 쉼표는 글자로, "" 는 따옴표 하나로 본다.
// 성공하면 1, 칸 수가 다르거나 따옴표가 잘못되면 0
int split_csv(const char *line, char out[FIELDS][FIELD_MAX]) {
    int col = 0, quoted = 0;
    size_t pos = 0;
    memset(out, 0, FIELDS * FIELD_MAX);
    for (const char *p = line;; p++) {
        char ch = *p;
        if (quoted) {
            if (ch == '\0') {
                return 0;                   // 닫히지 않은 따옴표
            }
            if (ch == '"' && p[1] == '"') {
                p++;                        // "" → "
            } else if (ch == '"') {
                quoted = 0;
                continue;
            }
        } else if (ch == '"' && pos == 0) {
            quoted = 1;
            continue;
        } else if (ch == ',' || ch == '\0') {
            if (ch == '\0') {
                return col == FIELDS - 1;
            }
            if (++col >= FIELDS) {
                return 0;                   // 칸이 너무 많음
            }
            pos = 0;
            continue;
        }
        if (pos + 1 >= FIELD_MAX) {
            return 0;                       // 칸이 너무 김
        }
        out[col][pos++] = ch;
    }
}

int main(void) {
    const char *lines[] = {
        "2026-10-01,Python,변수,30,pass",
        "2026-10-02,C,\"배열, 포인터\",45,retry",
        "2026-10-03,Rust,\"say \"\"hi\"\"\",25,pass",
        "2026-10-04,Python,변수,30",
        "2026-10-05,C,\"닫히지 않음,10,pass",
    };
    char f[FIELDS][FIELD_MAX];
    for (int i = 0; i < 5; i++) {
        if (split_csv(lines[i], f)) {
            printf("OK   [%s] [%s] [%s] [%s] [%s]\n", f[0], f[1], f[2], f[3], f[4]);
        } else {
            printf("위반 %s\n", lines[i]);
        }
    }
    return 0;
}
```

실행 결과:

```text
OK   [2026-10-01] [Python] [변수] [30] [pass]
OK   [2026-10-02] [C] [배열, 포인터] [45] [retry]
OK   [2026-10-03] [Rust] [say "hi"] [25] [pass]
위반 2026-10-04,Python,변수,30
위반 2026-10-05,C,"닫히지 않음,10,pass
```

### 코드 한 부분씩 읽기

| 코드                                   | 설명                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `char out[FIELDS][FIELD_MAX]`          | 다섯 칸을 담을 2차원 배열입니다. 칸마다 63바이트까지 담습니다(`'\0'` 자리 제외).               |
| `memset(out, 0, FIELDS * FIELD_MAX);`  | 모든 칸을 0으로 채워, 글자를 넣기만 하면 `'\0'`으로 끝나게 했습니다.                           |
| `if (quoted) { ... }`                  | 따옴표 안에서는 쉼표도 글자입니다. `""`는 따옴표 하나로 넣고, 따옴표 하나는 감싸기를 끝냅니다. |
| `else if (ch == '"' && pos == 0)`      | 칸의 맨 앞 따옴표만 감싸기를 시작합니다.                                                       |
| `if (++col >= FIELDS) return 0;`       | 칸이 다섯 개보다 많아지면 실패입니다.                                                          |
| `return col == FIELDS - 1;`(문자열 끝) | 끝났을 때 정확히 다섯째 칸이어야 성공입니다. 네 칸짜리 줄은 여기서 실패합니다.                 |
| `if (pos + 1 >= FIELD_MAX) return 0;`  | 칸이 버퍼보다 길면 넘치기 전에 실패합니다(Day 37).                                             |
| `if (ch == '\0') return 0;`(따옴표 안) | 따옴표가 닫히지 않은 채 줄이 끝나면 실패입니다.                                                |

## 7. Rust로 구현하기

```rust
// 파일: csv_split.rs
fn split_csv(line: &str) -> Result<Vec<String>, String> {
    let mut fields = Vec::new();
    let mut field = String::new();
    let mut quoted = false;
    let mut chars = line.chars().peekable();
    while let Some(ch) = chars.next() {
        match (quoted, ch) {
            (true, '"') if chars.peek() == Some(&'"') => {
                field.push('"');
                chars.next();
            }
            (true, '"') => quoted = false,
            (true, c) => field.push(c),
            (false, '"') if field.is_empty() => quoted = true,
            (false, ',') => fields.push(std::mem::take(&mut field)),
            (false, c) => field.push(c),
        }
    }
    if quoted {
        return Err(String::from("닫히지 않은 따옴표"));
    }
    fields.push(field);
    if fields.len() != 5 {
        return Err(format!("칸이 {}개(5개여야 함)", fields.len()));
    }
    Ok(fields)
}

fn main() {
    let lines = [
        "2026-10-01,Python,변수,30,pass",
        "2026-10-02,C,\"배열, 포인터\",45,retry",
        "2026-10-03,Rust,\"say \"\"hi\"\"\",25,pass",
        "2026-10-04,Python,변수,30",
        "2026-10-05,C,\"닫히지 않음,10,pass",
    ];
    for line in lines {
        match split_csv(line) {
            Ok(f) => println!("OK   {f:?}"),
            Err(e) => println!("위반 {e}: {line}"),
        }
    }
}
```

실행 결과:

```text
OK   ["2026-10-01", "Python", "변수", "30", "pass"]
OK   ["2026-10-02", "C", "배열, 포인터", "45", "retry"]
OK   ["2026-10-03", "Rust", "say \"hi\"", "25", "pass"]
위반 칸이 4개(5개여야 함): 2026-10-04,Python,변수,30
위반 닫히지 않은 따옴표: 2026-10-05,C,"닫히지 않음,10,pass
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `let mut chars = line.chars().peekable();`  | 다음 글자를 미리 볼 수 있는 반복자입니다. `""`인지 확인할 때 씁니다.                                 |
| `match (quoted, ch) { ... }`                | 상태와 글자를 튜플로 묶어 한 번에 나눴습니다(Day 53). 모든 경우를 다뤘는지 컴파일러가 확인합니다.    |
| `(true, '"') if chars.peek() == Some(&'"')` | 따옴표 안에서 `""`면 따옴표 하나를 넣고 다음 글자를 건너뜁니다.                                      |
| `(false, '"') if field.is_empty()`          | 칸의 맨 앞 따옴표만 감싸기를 시작합니다.                                                             |
| `fields.push(std::mem::take(&mut field))`   | 모은 칸을 옮겨 넣고 `field`를 빈 문자열로 바꿉니다. 복사가 없습니다.                                 |
| `Result<Vec<String>, String>`               | 실패 이유를 문장으로 돌려줘서 C보다 알려 주는 정보가 많습니다. 실제 프로젝트는 줄 번호까지 담습니다. |

`chars()`로 **글자 단위**로 돌기 때문에 한글 주제도 안전합니다. C는 바이트 단위로 돌지만, UTF-8의 이어지는 바이트는 쉼표·따옴표와 같은 값이 될 수 없어서 역시 안전합니다(Day 38).

## 8. 실행 추적

C의 `split_csv`가 `2026-10-02,C,"배열, 포인터",45,retry`를 나누는 동안 상태가 어떻게 바뀌는지 따라갑니다.

| 읽은 글자          | `quoted` | `col` | 한 일                         |
| ------------------ | -------- | ----- | ----------------------------- |
| `2026-10-02`       | 0        | 0     | 0번 칸에 모음                 |
| `,`                | 0        | 0 → 1 | 칸 넘김                       |
| `C`                | 0        | 1     | 1번 칸에 모음                 |
| `,`                | 0        | 1 → 2 | 칸 넘김                       |
| `"`(칸 맨 앞)      | 0 → 1    | 2     | 감싸기 시작, 글자는 버림      |
| `배열`             | 1        | 2     | 2번 칸에 모음                 |
| `,`                | 1        | 2     | **따옴표 안이라 글자로 모음** |
| ` 포인터`          | 1        | 2     | 모음                          |
| `"`                | 1 → 0    | 2     | 감싸기 끝                     |
| `,`                | 0        | 2 → 3 | 칸 넘김                       |
| `45`, `,`, `retry` | 0        | 3 → 4 | 3번, 4번 칸                   |
| `'\0'`             | 0        | 4     | `col == 4`라 성공             |

## 9. 다른 예제로 다시 이해하기

**계약을 규칙 표로.** 계약 문서의 표를 그대로 코드로 옮깁니다. 열마다 (이름, 검사 함수, 설명)을 두고, 한 줄에서 **모든** 위반을 찾아 알려 줍니다.

```python
# 파일: contract_table.py
import csv

RULES = [                                   # (열 이름, 검사 함수, 규칙 설명)
    ("date", lambda v: len(v) == 10 and v[4] == v[7] == "-", "YYYY-MM-DD"),
    ("language", lambda v: v in {"C", "Python", "Rust"}, "C, Python, Rust 중 하나"),
    ("topic", lambda v: v.strip() != "", "비어 있지 않음"),
    ("minutes", lambda v: v.isascii() and v.isdigit() and not v.startswith("0") and int(v) <= 10080,
     "1~10080, 앞에 0 없음"),
    ("result", lambda v: v in {"pass", "retry"}, "pass 또는 retry"),
]


def violations(row):
    if len(row) != len(RULES):
        return [f"열이 {len(row)}개(5개여야 함)"]
    return [f"{name}={value!r}: {desc}" for (name, ok, desc), value in zip(RULES, row) if not ok(value)]


samples = [
    '2026-10-01,Python,변수,30,pass',
    '2026/10/01,Java,변수,030,ok',
    '2026-10-02,C," ",0,retry',
    '2026-10-03,Rust,소유권,20000,pass',
    '2026-10-04,Python,변수',
]
for line in samples:
    row = next(csv.reader([line]))
    problems = violations(row)
    print("OK  " if not problems else "위반", line)
    for p in problems:
        print("     -", p)
```

실행 결과:

```text
OK   2026-10-01,Python,변수,30,pass
위반 2026/10/01,Java,변수,030,ok
     - date='2026/10/01': YYYY-MM-DD
     - language='Java': C, Python, Rust 중 하나
     - minutes='030': 1~10080, 앞에 0 없음
     - result='ok': pass 또는 retry
위반 2026-10-02,C," ",0,retry
     - topic=' ': 비어 있지 않음
     - minutes='0': 1~10080, 앞에 0 없음
위반 2026-10-03,Rust,소유권,20000,pass
     - minutes='20000': 1~10080, 앞에 0 없음
위반 2026-10-04,Python,변수
     - 열이 3개(5개여야 함)
```

| 코드                                                                                  | 설명                                                                                          |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `RULES = [(이름, 검사, 설명), ...]`                                                   | 계약 문서의 표가 그대로 코드가 되었습니다. 규칙이 바뀌면 이 표만 고칩니다.                    |
| `lambda v: v.isascii() and v.isdigit() and not v.startswith("0") and int(v) <= 10080` | `and`는 앞이 거짓이면 뒤를 계산하지 않아서, 숫자가 아닐 때 `int(v)`가 오류를 내지 않습니다.   |
| `zip(RULES, row)`                                                                     | 규칙과 칸을 같은 번호끼리 짝지었습니다. 열 수가 다르면 먼저 걸러 냈습니다.                    |
| `[... for ... if not ok(value)]`                                                      | 첫 위반에서 멈추지 않고 모든 위반을 모읍니다.                                                 |
| `'" ",0'`                                                                             | 공백만 있는 주제는 따옴표로 감싸야 CSV에 쓸 수 있습니다. `strip()`으로 공백만인지 확인합니다. |

Rust에서는 검사 함수를 **함수 포인터**로 표에 담습니다.

```rust
// 파일: contract_table.rs
type Check = fn(&str) -> bool;

fn is_date(v: &str) -> bool {
    let b = v.as_bytes();
    b.len() == 10 && b[4] == b'-' && b[7] == b'-'
}

fn is_minutes(v: &str) -> bool {
    !v.starts_with('0') && !v.is_empty() && v.bytes().all(|c| c.is_ascii_digit())
        && v.parse::<u32>().is_ok_and(|m| m <= 10080)
}

const RULES: [(&str, Check, &str); 5] = [
    ("date", is_date, "YYYY-MM-DD"),
    ("language", |v| matches!(v, "C" | "Python" | "Rust"), "C, Python, Rust 중 하나"),
    ("topic", |v| !v.trim().is_empty(), "비어 있지 않음"),
    ("minutes", is_minutes, "1~10080, 앞에 0 없음"),
    ("result", |v| v == "pass" || v == "retry", "pass 또는 retry"),
];

fn violations(fields: &[&str]) -> Vec<String> {
    if fields.len() != RULES.len() {
        return vec![format!("열이 {}개(5개여야 함)", fields.len())];
    }
    RULES
        .iter()
        .zip(fields)
        .filter(|((_, ok, _), v)| !ok(v))
        .map(|((name, _, desc), v)| format!("{name}={v:?}: {desc}"))
        .collect()
}

fn main() {
    let samples = ["2026-10-01,Python,변수,30,pass", "2026/10/01,Java,변수,030,ok", "2026-10-04,Python,변수"];
    for line in samples {
        let fields: Vec<&str> = line.split(',').collect();   // 이 예제에는 따옴표가 없어서 split으로 충분
        let problems = violations(&fields);
        println!("{} {line}", if problems.is_empty() { "OK  " } else { "위반" });
        for p in problems {
            println!("     - {p}");
        }
    }
}
```

실행 결과:

```text
OK   2026-10-01,Python,변수,30,pass
위반 2026/10/01,Java,변수,030,ok
     - date="2026/10/01": YYYY-MM-DD
     - language="Java": C, Python, Rust 중 하나
     - minutes="030": 1~10080, 앞에 0 없음
     - result="ok": pass 또는 retry
위반 2026-10-04,Python,변수
     - 열이 3개(5개여야 함)
```

- `type Check = fn(&str) -> bool;`로 검사 함수의 자료형에 이름을 붙였습니다. 이름 있는 함수(`is_date`)와 무언가를 붙잡지 않는 클로저(`|v| ...`)를 모두 담을 수 있습니다.
- `const RULES: [(&str, Check, &str); 5]`는 프로그램에 박힌 상수 표입니다.
- `v.parse::<u32>().is_ok_and(|m| m <= 10080)`은 "숫자로 읽히고 10080 이하"를 한 줄로 씁니다.
- 이 예제의 입력에는 따옴표가 없어서 `split(',')`로 충분했습니다. 실제 프로젝트는 오늘 만든 따옴표 인식 나누기를 씁니다.

## 10. 계약 항목과 구현 위치

| 계약 항목  | Python(Day 85~86)                | C(Day 87~88)                   | Rust(Day 89~90)                         |
| ---------- | -------------------------------- | ------------------------------ | --------------------------------------- |
| CSV 나누기 | `csv.DictReader`                 | 직접 만든 `csv_fields`         | 직접 만든 `rows`                        |
| 헤더       | `reader.fieldnames == FIELDS`    | `strcmp` 다섯 번               | 벡터 비교                               |
| 날짜       | `date.fromisoformat`             | 달마다 날 수 표 + 윤년         | `match`로 달마다 날 수                  |
| minutes    | `isdigit` + `int` + 범위         | `strtoul` + `errno` + 범위     | `parse::<u32>` + 범위                   |
| 오류       | `ValueError` → `stderr` + 종료 1 | `fprintf(stderr)` + `return 1` | `Err(String)` → `eprintln!` + `exit(1)` |
| 집계·정렬  | `sorted`, 사전                   | `qsort`, 그룹 배열             | `BTreeMap`, `sort_by`                   |

## 11. 세 언어 비교

| 관점      | Python                 | C                                  | Rust                      |
| --------- | ---------------------- | ---------------------------------- | ------------------------- |
| CSV 파서  | 표준 라이브러리에 있음 | 직접(또는 외부 라이브러리)         | 직접(또는 `csv` 크레이트) |
| 칸 크기   | 제한 없음              | 버퍼 크기로 제한(넘치기 전에 실패) | 제한 없음(`String`)       |
| 실패 이유 | 예외 메시지            | 반환 코드(자세한 이유는 따로)      | `Err`에 담긴 값           |
| 규칙 표   | 함수·람다 리스트       | 함수 포인터 배열(가능)             | 함수 포인터 배열          |

## 12. 자주 하는 실수

### 실수 1: CSV를 split으로 나눈다

실습의 변형 문제입니다. 쉼표가 든 칸이 있는 줄에서만 틀려서, fixture에 그런 줄이 없으면 한참 동안 모릅니다.

### 실수 2: 리스트와 문자열을 비교한다 (Python)

실습의 디버그 문제입니다. `header == "date,language,..."`는 언제나 `False`입니다. 계약 상수 `FIELDS`와 비교하세요.

### 실수 3: 계약에 없는 관용을 베푼다

`" Python"`(앞 공백), `"python"`(소문자), `030`을 "대충 맞으니까" 받아들이면, 다른 구현은 거절해 결과가 달라집니다. 계약이 허용하지 않으면 **모든 구현이 똑같이 거절**해야 합니다.

### 실수 4: 오류를 표준 출력에 섞는다

`print("오류: ...")`로 쓰면 보고서를 읽는 다른 프로그램이 오류 문장까지 결과로 읽습니다. 오류는 표준 오류(`sys.stderr`, `stderr`, `eprintln!`)로, 결과만 표준 출력으로 보내세요.

### 실수 5: 첫 위반에서 멈춰 이유를 하나만 알려 준다

파일을 고치는 사람은 줄마다 한 번씩 고치고 다시 실행해야 합니다. 검사기는 가능한 한 모든 위반을 모아 보여 주세요. 다만 실제 프로그램은 계약대로 첫 잘못된 줄에서 멈춥니다(결과를 믿을 수 없으므로).

## 13. Q&A

**Q. 왜 JSON이 아니라 CSV인가요?**

A. CSV는 표 계산 프로그램으로 쉽게 만들고 열 수 있어서 공부 기록 같은 표 데이터에 흔히 쓰입니다. 대신 따옴표 규칙처럼 까다로운 부분이 있어서, 세 언어로 직접 파서를 만들어 보기에 좋은 연습 문제입니다. JSON은 구조가 복잡한 데이터에 알맞습니다.

**Q. 계약을 코드보다 먼저 쓰기 어렵지 않나요?**

A. 처음부터 완벽할 필요는 없습니다. 첫 구현(여기서는 Python)을 만들며 계약을 다듬고, 두 번째·세 번째 구현을 만들 때 "이 경우는 어떻게 하지?"라는 질문이 생기면 계약에 답을 적어 넣습니다. 중요한 것은 답이 **한곳**에 적혀 있고, 모든 구현이 그것을 따르는 것입니다.

**Q. 표준 오류와 종료 코드는 어떻게 확인하나요?**

A. 터미널에서 `python study_log.py bad.csv; echo $?`처럼 실행하면 마지막 종료 코드가 나옵니다(0이면 성공). 표준 오류만 보려면 `2> err.txt`로 파일에 보냅니다. Day 91의 비교 스크립트가 이것을 자동으로 확인합니다.

**Q. 이 과정의 실습 칸에서 전체 프로그램을 실행할 수 있나요?**

A. Python 실습 칸에서는 오늘처럼 fixture를 문자열로 넣은 작은 예제를 실행할 수 있습니다. 전체 명령줄 프로그램과 C, Rust 구현은 아래 링크의 소스를 내려받아 자기 컴퓨터에서 실행하세요. 브라우저에서는 C와 Rust를 컴파일하지 않습니다.

## 14. 핵심 요약

- 여러 구현이 같은 결과를 내려면 먼저 **계약**(입력 형식, 열 규칙, 출력 모양, 오류 동작)을 한곳에 정합니다.
- 입력은 `date,language,topic,minutes,result` 다섯 열의 UTF-8 CSV이고, 잘못된 입력은 표준 오류 + 종료 코드 1입니다.
- 쉼표가 든 칸은 따옴표로 감싸고 따옴표는 `""`로 넣으므로, CSV는 `split`으로 나누면 틀립니다. Python은 `csv` 모듈, C와 Rust는 따옴표 상태를 기억하는 나누기를 만듭니다.
- 계약을 **규칙 표**로 만들면 문서와 코드가 같은 모양이 되고, 모든 위반을 한 번에 보여 줄 수 있습니다.
- 쉼표가 든 주제처럼 까다로운 경우를 fixture에 일부러 넣어 둡니다.

## 15. 도전 문제

1. **(Python)** 규칙 표의 `date` 검사를 `datetime.date.fromisoformat`으로 바꿔 `2026-02-30`처럼 없는 날짜도 걸러 내세요. 모양은 맞지만 달력에 없는 날짜를 표에 추가해 확인합니다.
2. **(C)** `split_csv`에 "닫는 따옴표 바로 뒤에는 쉼표나 줄 끝만 올 수 있다"는 규칙을 추가하고, `"ab"c,...` 같은 줄이 위반이 되는지 확인하세요.
3. **(Rust)** `split_csv`가 실패할 때 몇 번째 글자에서 실패했는지도 알려 주도록 `Err((usize, String))`로 바꿔 보세요.
4. **(세 언어)** 계약 문서에 "빈 파일(헤더만 있는 파일)은 어떻게 하는가?"를 정해 적고, 그 규칙에 맞는 출력 예시를 써 보세요. 실제 프로젝트의 동작과 비교합니다.

## Study Log Analyzer 실제 프로젝트

오늘 정한 계약을 따르는 완성 코드는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)에 있습니다. README에 계약 요약과 세 구현의 실행 명령이 있습니다. 오늘은 README의 계약 문장과 이 페이지의 계약 표가 같은 내용인지 대조해 보세요.
