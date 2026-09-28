---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-84-fixture-review
courseId: crp-92
phaseId: phase-08
dayNumber: 84
date: "2026-12-23"
title: 공통 fixture와 오류 사례 설계
summary: Day 83에서 정한 계약을 시험할 입력들, 즉 fixture를 설계합니다. 올바른 입력과 잘못된 입력을 같은 규칙으로 묶이는 무리(동치 분할)로 나누고, 무리의 경계(1분과 10080분, 0분과 10081분, 윤년 2월 29일, 1900년과 2000년)를 골라 시험 표를 만듭니다. 기대 결과는 행 수나 오류 문장의 일부로 적어, 구현마다 문구가 조금 달라도 같은 판단을 했는지 확인합니다. 올바른 fixture의 기대 출력을 한 번 확인해 고정한 골든 파일과, 실제 출력과 골든의 첫 번째 차이를 알려 주는 비교 함수도 만듭니다. C와 Rust로 minutes·날짜 검사 함수의 경계 시험을 옮기며, 숫자만 있는지 먼저 확인해야 바이트 자르기가 안전하다는 점도 짚습니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 100
prerequisites: [day-83-capstone-contract]
learningObjectives:
  - 입력을 동치 분할로 나누고 각 무리의 경계값을 골라 시험 사례를 만든다.
  - 올바른 입력과 잘못된 입력의 기대 결과를 행 수나 오류 조각으로 적어 표 시험을 만든다.
  - 윤년 규칙과 달마다 날 수를 경계 사례로 확인한다.
  - 골든 출력과 실제 출력의 첫 번째 차이를 찾아 알려 주는 비교 함수를 만든다.
  - 같은 경계 시험을 C와 Rust로 옮기고, 검사 순서가 안전성에 주는 영향을 설명한다.
concepts:
  [
    fixture,
    equivalence partitioning,
    boundary value,
    test table,
    expected error fragment,
    leap year,
    days in month,
    golden file,
    output diff,
    regression test,
    validation order,
    byte slicing safety,
  ]
runnerMode: python
playgroundSource: |
  # 파일: boundary_play.py — 경계값을 골라 보세요.
  def leap(y):
      return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

  for y in (2024, 2026, 1900, 2000):
      print(y, "윤년" if leap(y) else "평년")
  for m in (0, 1, 10080, 10081):
      print(m, 1 <= m <= 10080)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day84-predict-leap
    title: 윤년 규칙 예측하기
    kind: predict
    objective: 4의 배수·100의 배수·400의 배수 규칙을 경계 해로 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      def leap(y):
          return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)


      print([leap(y) for y in (2024, 1900, 2000, 2026)])
    answer: "[True, False, True, False]"
    hint: "4의 배수는 윤년이지만, 100의 배수는 평년이고, 그중 400의 배수는 다시 윤년입니다."
    explanation: "2024는 4의 배수라 윤년, 1900은 100의 배수라 평년, 2000은 400의 배수라 윤년, 2026은 4의 배수가 아니라 평년입니다. 규칙이 세 단계라서 각 단계의 경계(1900, 2000)를 시험에 넣지 않으면 '4의 배수면 윤년'처럼 틀린 구현이 통과해 버립니다."
    commonMistakes:
      - "1900을 윤년이라고 생각함"
      - "2000을 100의 배수라 평년이라고 생각함"
    language: python
    verification: run
  - id: ex-day84-predict-boundary
    title: 범위 경계 예측하기
    kind: predict
    objective: 허용 범위의 양 끝과 바로 바깥 값을 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print([m for m in (0, 1, 10080, 10081) if 1 <= m <= 10080])
    answer: "[1, 10080]"
    hint: "양 끝은 범위 안, 한 칸 바깥은 범위 밖입니다."
    explanation: "경계값 시험은 범위의 끝(1, 10080)과 바로 바깥(0, 10081) 네 값을 확인합니다. <=를 <로 잘못 쓰면 10080이 빠지고, 1부터가 아니라 0부터 허용하면 0이 들어옵니다. 이런 한 칸 차이 실수는 가운데 값(30, 45)으로는 절대 드러나지 않습니다."
    commonMistakes:
      - "10080을 범위 밖으로 봄"
      - "0을 범위 안으로 봄"
    language: python
    verification: run
  - id: ex-day84-fill
    title: 오류 조각 확인하기 채우기
    kind: fill
    objective: 오류 문장에 기대한 조각이 들어 있는지 확인한다.
    prompt: "빈칸을 채워 오류 문장에 '2행: minutes'가 들어 있는지 확인하고 '통과'가 출력되게 하세요."
    starter: |-
      error = "2행: minutes는 양의 정수여야 합니다"
      expected = "2행: minutes"
      print("통과" if expected _____ error else "실패")
    answer: |-
      error = "2행: minutes는 양의 정수여야 합니다"
      expected = "2행: minutes"
      print("통과" if expected in error else "실패")
    output: "통과"
    hint: "문자열 안에 다른 문자열이 들어 있는지 묻는 연산자입니다."
    explanation: "오류 문장 전체를 비교하면 세 구현이 문구를 조금만 다르게 써도 시험이 깨집니다. 반대로 아무 오류나 통과시키면 '다른 이유로 실패한 경우'를 놓칩니다. 줄 번호와 문제의 열처럼 꼭 맞아야 하는 조각만 확인하는 것이 균형 잡힌 방법입니다. 실제 비교 스크립트는 세 구현 모두 0이 아닌 종료 코드와 비어 있지 않은 오류를 내는지 확인합니다(Day 91)."
    commonMistakes:
      - "== 를 써서 문장 전체가 같아야 통과하게 만듦"
      - "error in expected로 거꾸로 씀"
    language: python
    verification: run
  - id: ex-day84-modify
    title: 행복한 경우만 있는 시험에 경계 추가하기
    kind: modify
    objective: 시험 표에 경계와 바로 바깥 값을 추가한다.
    prompt: "시험 표에 30분 하나만 있습니다. 1, 10080(통과해야 함)과 10081(거절해야 함)을 추가해 '4/4 통과'가 출력되게 하세요."
    starter: |-
      def minutes_ok(m):
          return 1 <= m <= 10080


      cases = [(30, True)]
      passed = sum(minutes_ok(m) == want for m, want in cases)
      print(f"{passed}/{len(cases)} 통과")
    answer: |-
      def minutes_ok(m):
          return 1 <= m <= 10080


      cases = [(30, True), (1, True), (10080, True), (10081, False)]
      passed = sum(minutes_ok(m) == want for m, want in cases)
      print(f"{passed}/{len(cases)} 통과")
    output: "4/4 통과"
    starterOutput: "1/1 통과"
    hint: "(값, 기대) 쌍을 표에 한 줄씩 추가합니다."
    explanation: "시험 코드는 그대로 두고 표만 늘렸습니다(Day 55의 표 시험). 30분 하나로는 1 <= m < 10080 같은 버그를 잡을 수 없습니다. 0도 추가하면 네 경계(0, 1, 10080, 10081)가 모두 들어가 더 좋습니다. 경계를 넣었을 때 시험이 모두 통과하면 '범위의 양 끝이 계약과 같다'는 것을 확인한 것입니다."
    commonMistakes:
      - "10081을 True로 적어 시험 자체가 틀림"
      - "비슷한 가운데 값(40, 50)만 추가함"
    language: python
    verification: run
  - id: ex-day84-debug
    title: 경계에서 틀리는 검사 고치기
    kind: debug
    objective: 경계 시험으로 드러난 한 칸 차이 버그를 고친다.
    prompt: "이 코드는 10080분을 거절해 '실패: 10080'을 출력합니다. 계약(1~10080 포함)에 맞게 고쳐 '통과: 10080'이 출력되게 하세요."
    starter: |-
      def ok(m):
          return 1 <= int(m) < 10080


      print(("통과" if ok("10080") else "실패") + ": 10080")
    answer: |-
      def ok(m):
          return 1 <= int(m) <= 10080


      print(("통과" if ok("10080") else "실패") + ": 10080")
    output: "통과: 10080"
    starterOutput: "실패: 10080"
    hint: "계약의 '1~10080'은 양 끝을 포함합니다."
    explanation: "< 와 <=의 한 글자 차이는 가운데 값에서는 결과가 같아서 눈에 잘 띄지 않습니다. 경계 시험이 이런 버그를 찾는 가장 싼 방법입니다. 세 구현에서 이 한 글자가 다르면 10080분짜리 기록 하나 때문에 결과가 달라집니다. 실제 Rust 구현은 (1..=10080).contains(&m)처럼 범위를 한곳에 적어 실수를 줄입니다."
    commonMistakes:
      - "10081까지 허용하도록 고쳐 반대쪽 경계가 틀림"
      - "시험의 기대값을 실패로 바꿔 버그를 숨김"
    language: python
    verification: run
  - id: ex-day84-independent
    title: C로 달마다 날 수 구하기
    kind: independent
    objective: 달마다 날 수 표와 윤년 규칙으로 날짜 검사의 핵심을 만든다.
    prompt: "int days_in_month(int y, int m)를 만들어 (2024, 2), (2026, 2), (2026, 4)의 날 수 '29 28 30'을 출력하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 days_in_month를 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int days_in_month(int y, int m) {
          static const int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
          int leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
          return days[m] + (m == 2 && leap);
      }

      int main(void) {
          printf("%d %d %d\n", days_in_month(2024, 2), days_in_month(2026, 2), days_in_month(2026, 4));
          return 0;
      }
    output: "29 28 30"
    hint: "0번 칸을 비워 두면 m을 그대로 번호로 쓸 수 있습니다. 2월이고 윤년이면 1을 더합니다."
    explanation: "표의 0번 칸은 쓰지 않는 자리라 days[2]가 2월입니다. (m == 2 && leap)는 참이면 1, 거짓이면 0이라 더하기에 바로 쓸 수 있습니다. 이 함수는 m이 1~12라고 가정하므로, 부르기 전에 달의 범위를 먼저 확인해야 배열 밖을 읽지 않습니다(Day 87). 이 순서도 경계 시험(13월)으로 확인합니다."
    commonMistakes:
      - "0번 칸 없이 표를 만들어 한 달씩 밀림"
      - "m을 확인하지 않고 days[13]을 읽음"
    language: c
    verification: run
quiz:
  - id: quiz-day84-01
    question: 동치 분할(equivalence partitioning)이란?
    choices:
      - 입력을 무작위로 고르는 것
      - 프로그램이 같은 방식으로 처리할 입력들을 무리로 나누고, 무리마다 대표값을 시험하는 것
      - 모든 입력을 시험하는 것
      - 입력을 둘로 나누는 것
    answerIndex: 1
    explanation: minutes라면 '1~10080(통과)', '0 이하', '10081 이상', '숫자가 아님', '앞자리 0'이 무리입니다. 무리마다 한두 개만 시험해도 같은 무리의 다른 값은 같은 결과를 낼 것이라고 기대할 수 있습니다.
  - id: quiz-day84-02
    question: 경계값 시험에서 minutes에 꼭 넣을 값은?
    choices:
      - 30, 45
      - 0, 1, 10080, 10081
      - "5000"
      - -1만
    answerIndex: 1
    explanation: 버그는 무리의 가장자리에 모입니다. 허용 범위의 양 끝(1, 10080)과 바로 바깥(0, 10081)을 넣으면 < 와 <= 같은 한 칸 차이 실수를 잡습니다.
  - id: quiz-day84-03
    question: 오류 시험에서 오류 문장 전체 대신 조각(예 '2행 minutes')을 확인하는 이유는?
    choices:
      - 쓰기 쉬워서
      - 구현마다 문구가 조금 달라도 같은 줄의 같은 문제를 찾았는지는 확인할 수 있어서
      - 오류가 없어서
      - 전체 비교가 불가능해서
    answerIndex: 1
    explanation: 조각이 너무 짧으면 엉뚱한 오류도 통과하고, 너무 길면 문구 수정에도 시험이 깨집니다. 줄 번호와 문제의 열처럼 판단의 핵심만 고르세요.
  - id: quiz-day84-04
    question: 골든 파일(golden file)이란?
    choices:
      - 암호화된 파일
      - 사람이 한 번 확인해 고정한 기대 출력으로, 이후 실제 출력과 비교하는 기준
      - 가장 큰 입력 파일
      - 오류 기록 파일
    answerIndex: 1
    explanation: 출력이 길고 모양이 정해져 있을 때 줄마다 assert를 쓰는 대신 골든 파일과 통째로 비교합니다. 다르면 첫 번째 차이를 보여 주면 원인을 빨리 찾을 수 있습니다. 출력을 일부러 바꿨다면 골든 파일도 확인 후 갱신합니다.
  - id: quiz-day84-05
    question: Rust에서 날짜 문자열을 s[0..4]처럼 자르기 전에 모든 바이트가 숫자인지 먼저 확인하는 이유는?
    choices:
      - 속도 때문에
      - 한글 같은 여러 바이트 글자가 섞이면 바이트 범위가 글자 중간에 걸려 패닉이 날 수 있어서
      - parse가 숫자를 못 읽어서
      - 필요 없다
    answerIndex: 1
    explanation: "&str의 범위는 바이트 번호라서 글자 경계가 아니면 패닉입니다(Day 36, 38). 숫자(ASCII)만 있다는 것을 먼저 확인하면 모든 바이트가 한 글자라 어디서 잘라도 안전합니다. 검사의 순서가 곧 안전성입니다."
---

## 1. 오늘 배울 내용

Day 83에서 계약을 정했습니다. 오늘은 그 계약을 **시험할 입력**, 즉 fixture를 설계합니다. 좋은 fixture는 버그가 숨어 있을 만한 곳을 골라 찌르는 입력입니다.

1. 입력을 **동치 분할**로 나누기
   - 같은 방식으로 처리될 입력끼리 한 무리
   - 무리마다 대표값 하나
2. **경계값** 고르기
   - minutes: 0, 1, 10080, 10081, 앞자리 0, 숫자가 아님
   - 날짜: 윤년 2월 29일, 평년 2월 29일, 1900년과 2000년, 30일까지 있는 달의 31일, 13월
   - 구조: 헤더만 있는 파일, 열 부족, 셋째 줄의 오류
3. 기대 결과 적기
   - 올바른 입력: 읽은 행 수
   - 잘못된 입력: 오류 문장의 **조각**(줄 번호, 문제의 열)
4. **골든 파일**: 사람이 확인해 고정한 기대 출력과, 첫 번째 차이를 알려 주는 비교 함수
5. C와 Rust로 minutes·날짜 검사의 경계 시험을 옮기고, 검사 순서가 안전성에 주는 영향을 봅니다.

## 2. 왜 필요한가

세 구현이 모두 기본 fixture(네 줄)에서 같은 출력을 낸다고 해서 계약을 똑같이 지킨다는 뜻은 아닙니다.

- 한 구현은 10080분을 거절하고, 다른 구현은 받아들일 수 있습니다.
- 한 구현은 1900-02-29를 받아들일 수 있습니다(4의 배수라서).
- 한 구현은 셋째 줄의 오류를 "2행"이라고 잘못 알려 줄 수 있습니다.

이런 차이는 **평범한 입력으로는 드러나지 않습니다.** 경계와 오류 사례를 fixture로 만들어 두고 세 구현 모두에 넣어야 차이가 보입니다. 이 fixture들은 이후 코드를 고칠 때마다 다시 돌려 보는 **회귀 시험**이 됩니다.

## 3. 그림으로 이해하기

**minutes의 동치 분할과 경계.**

```text
      무리 A(거절)   │         무리 B(통과)          │   무리 C(거절)
  ... -1  0          │ 1  2  ...  30  ...  10079 10080 │ 10081  ...
             ▲       ▲                            ▲    ▲
          경계 바깥  경계                        경계  경계 바깥
무리 D(거절): "030"(앞자리 0), "3a"(숫자 아님), ""(빈 칸), "99999999999999999999"(너무 큼)
```

**날짜의 경계.**

```text
2월 29일:  2024(4의 배수) ✓   2026(아님) ✗   1900(100의 배수) ✗   2000(400의 배수) ✓
31일:      12월 31일 ✓   4월 31일 ✗
달:        12월 ✓   13월 ✗   "1"(한 자리) ✗
```

**골든 비교.**

```text
실제 출력                         골든 파일
sessions: 4          ==          sessions: 4
total_minutes: 130   ==          total_minutes: 130
average_minutes: 32.5  ≠         average_minutes: 32.50   ← 첫 번째 차이: 3번째 줄
```

## 4. 천천히 풀어보기

### 4.1 시험 사례 표

| 무리         | 사례                                           | 기대                         |
| ------------ | ---------------------------------------------- | ---------------------------- |
| 정상         | 기본 fixture(쉼표 든 주제 포함)                | 2행(또는 4행)                |
| 정상 경계    | 헤더만                                         | 0행                          |
|              | 1분, 10080분                                   | 1행                          |
|              | 2024-02-29, 2000-02-29                         | 1행                          |
| minutes 오류 | 0, 10081, 030                                  | `2행: minutes`               |
| 날짜 오류    | 2026-02-29, 1900-02-29, 2026-04-31, 2026-13-01 | `2행: 날짜`                  |
| 값 오류      | Java, 공백만 있는 주제, fail                   | `2행: language/topic/result` |
| 구조 오류    | 열 부족, 헤더 순서 바뀜                        | `2행: 열 수`, `헤더`         |
| 줄 번호      | 둘째 데이터 줄에 오류                          | `3행:`                       |

마지막 사례는 오류가 **몇 번째 줄**인지 제대로 세는지 확인합니다. 헤더가 1행, 첫 데이터가 2행이라는 약속을 세 구현이 같게 지켜야 합니다.

### 4.2 기대 결과를 적는 방법

- **올바른 입력**: 읽은 행 수(또는 전체 출력)
- **잘못된 입력**: 오류 문장 전체가 아니라 핵심 **조각**
  - 너무 짧은 조각(`"오류"`)은 엉뚱한 실패도 통과시킵니다.
  - 너무 긴 조각(문장 전체)은 문구만 고쳐도 시험이 깨집니다.

### 4.3 골든 파일

출력이 여러 줄이고 모양이 정해져 있으면, 기대 출력을 파일(골든 파일)로 두고 통째로 비교합니다.

1. 처음 한 번은 사람이 출력을 꼼꼼히 확인하고 골든 파일로 저장합니다.
2. 이후에는 실제 출력과 골든 파일을 비교합니다.
3. 다르면 **첫 번째로 다른 줄**을 보여 줍니다.
4. 출력을 일부러 바꿨다면 확인한 뒤 골든 파일을 갱신합니다.

이 과정의 레슨 검사도 같은 방식입니다. 레슨에 적힌 "실행 결과"가 골든이고, 프로그램을 실제로 실행한 출력과 비교합니다.

### 4.4 검사 순서와 안전성

날짜 검사는 "모양 → 숫자만 있는가 → 달 범위 → 그 달의 날 수" 순서로 합니다.

- 숫자만 있는지 먼저 확인해야 C의 `atoi`와 Rust의 바이트 자르기(`s[0..4]`)가 안전합니다. 한글 같은 여러 바이트 글자가 섞이면 Rust는 글자 중간에서 잘라 패닉합니다.
- 달이 1~12인지 먼저 확인해야 C의 `days[m]`이 배열 밖을 읽지 않습니다.

## 5. Python으로 구현하기

```python
# 파일: fixtures.py
import csv
import io
from datetime import date

HEADER = "date,language,topic,minutes,result\n"


def validate(text):
    """계약을 확인하고 (행 수, None) 또는 (None, 오류 문장)을 돌려준다."""
    reader = csv.reader(io.StringIO(text))
    if next(reader, None) != ["date", "language", "topic", "minutes", "result"]:
        return None, "헤더 오류"
    count = 0
    for line_no, row in enumerate(reader, start=2):
        if len(row) != 5:
            return None, f"{line_no}행: 열 수"
        d, lang, topic, minutes, result = row
        try:
            ok_date = date.fromisoformat(d).isoformat() == d
        except ValueError:
            ok_date = False
        if not ok_date:
            return None, f"{line_no}행: 날짜"
        if lang not in {"C", "Python", "Rust"} or not topic.strip() or result not in {"pass", "retry"}:
            return None, f"{line_no}행: language/topic/result"
        if not (minutes.isascii() and minutes.isdigit()) or minutes.startswith("0") or int(minutes) > 10080:
            return None, f"{line_no}행: minutes"
        count += 1
    return count, None


CASES = [                                   # (이름, 입력, 기대: 행 수 또는 오류 조각)
    ("기본 fixture", HEADER + "2026-10-01,Python,변수,30,pass\n2026-10-02,C,\"배열, 포인터\",45,retry\n", 2),
    ("헤더만", HEADER, 0),
    ("분 최솟값 1", HEADER + "2026-10-01,C,a,1,pass\n", 1),
    ("분 최댓값 10080", HEADER + "2026-10-01,C,a,10080,pass\n", 1),
    ("분 0", HEADER + "2026-10-01,C,a,0,pass\n", "2행: minutes"),
    ("분 10081", HEADER + "2026-10-01,C,a,10081,pass\n", "2행: minutes"),
    ("분 앞자리 0", HEADER + "2026-10-01,C,a,030,pass\n", "2행: minutes"),
    ("윤년 2월 29일", HEADER + "2024-02-29,C,a,5,pass\n", 1),
    ("평년 2월 29일", HEADER + "2026-02-29,C,a,5,pass\n", "2행: 날짜"),
    ("없는 언어", HEADER + "2026-10-01,Java,a,5,pass\n", "2행: language"),
    ("공백 주제", HEADER + "2026-10-01,C,\"  \",5,pass\n", "2행: language/topic"),
    ("열 부족", HEADER + "2026-10-01,C,a,5\n", "2행: 열 수"),
    ("셋째 줄 오류", HEADER + "2026-10-01,C,a,5,pass\n2026-10-02,C,a,5,fail\n", "3행:"),
    ("헤더 순서", "language,date,topic,minutes,result\n", "헤더"),
]

passed = 0
for name, text, expected in CASES:
    count, error = validate(text)
    if isinstance(expected, int):
        ok = count == expected
        got = f"{count}행" if error is None else error
    else:
        ok = error is not None and expected in error
        got = error
    passed += ok
    print(f"{'통과' if ok else '실패'} {name} → {got}")
print(f"{passed}/{len(CASES)} 통과")
```

실행 결과:

```text
통과 기본 fixture → 2행
통과 헤더만 → 0행
통과 분 최솟값 1 → 1행
통과 분 최댓값 10080 → 1행
통과 분 0 → 2행: minutes
통과 분 10081 → 2행: minutes
통과 분 앞자리 0 → 2행: minutes
통과 윤년 2월 29일 → 1행
통과 평년 2월 29일 → 2행: 날짜
통과 없는 언어 → 2행: language/topic/result
통과 공백 주제 → 2행: language/topic/result
통과 열 부족 → 2행: 열 수
통과 셋째 줄 오류 → 3행: language/topic/result
통과 헤더 순서 → 헤더 오류
14/14 통과
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                                                             |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `def validate(text)` → `(행 수, None)` 또는 `(None, 오류)` | 성공과 실패를 튜플 하나로 돌려줘 시험하기 쉽게 했습니다. 실제 프로젝트는 예외를 씁니다.                                          |
| `next(reader, None)`                                       | 빈 파일이면 헤더가 없어서 `None`입니다. 기본값을 주지 않으면 `StopIteration`이 납니다.                                           |
| `date.fromisoformat(d).isoformat() == d`                   | 달력에 있는 날짜인지 확인합니다. `2026-02-29`는 `ValueError`입니다. 되돌린 모양이 같은지까지 비교해 다른 모양의 입력도 거릅니다. |
| `CASES = [(이름, 입력, 기대), ...]`                        | 4.1절의 표가 그대로 코드입니다. 기대가 정수면 행 수, 문자열이면 오류 조각입니다.                                                 |
| `isinstance(expected, int)`                                | 기대의 자료형으로 두 종류의 사례를 나눠 확인합니다.                                                                              |
| `expected in error`                                        | 오류 조각이 들어 있는지 확인합니다(실습의 빈칸 문제).                                                                            |

## 6. C로 구현하기

```c
// 파일: boundary.c
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int minutes_valid(const char *text, unsigned *out) {
    if (*text == '\0' || *text == '0') {
        return 0;                           // 빈 칸, 0, 앞자리 0
    }
    for (const char *c = text; *c; c++) {
        if (!isdigit((unsigned char)*c)) {
            return 0;
        }
    }
    errno = 0;
    unsigned long v = strtoul(text, NULL, 10);
    if (errno == ERANGE || v > 10080) {
        return 0;
    }
    *out = (unsigned)v;
    return 1;
}

int date_valid(const char *t) {
    if (strlen(t) != 10 || t[4] != '-' || t[7] != '-') {
        return 0;
    }
    for (int i = 0; i < 10; i++) {
        if (i != 4 && i != 7 && !isdigit((unsigned char)t[i])) {
            return 0;
        }
    }
    int y = atoi(t), m = atoi(t + 5), d = atoi(t + 8);   // 숫자만 있음을 확인한 뒤라 안전
    static const int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (y < 1 || m < 1 || m > 12) {
        return 0;
    }
    int leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    int max = days[m] + (m == 2 && leap);
    return d >= 1 && d <= max;
}

int main(void) {
    struct { const char *text; int want; } minutes[] = {
        {"1", 1}, {"10080", 1}, {"0", 0}, {"10081", 0}, {"030", 0}, {"", 0}, {"3a", 0}, {"99999999999999999999", 0},
    };
    struct { const char *text; int want; } dates[] = {
        {"2024-02-29", 1}, {"2026-02-29", 0}, {"2000-02-29", 1}, {"1900-02-29", 0},
        {"2026-04-31", 0}, {"2026-12-31", 1}, {"2026-13-01", 0}, {"2026-1-01", 0},
    };
    int passed = 0, total = 0;
    for (size_t i = 0; i < sizeof minutes / sizeof minutes[0]; i++, total++) {
        unsigned v;
        int got = minutes_valid(minutes[i].text, &v);
        passed += got == minutes[i].want;
        printf("minutes %-22s → %d %s\n", minutes[i].text, got, got == minutes[i].want ? "통과" : "실패");
    }
    for (size_t i = 0; i < sizeof dates / sizeof dates[0]; i++, total++) {
        int got = date_valid(dates[i].text);
        passed += got == dates[i].want;
        printf("date    %-22s → %d %s\n", dates[i].text, got, got == dates[i].want ? "통과" : "실패");
    }
    printf("%d/%d 통과\n", passed, total);
    return 0;
}
```

실행 결과:

```text
minutes 1                      → 1 통과
minutes 10080                  → 1 통과
minutes 0                      → 0 통과
minutes 10081                  → 0 통과
minutes 030                    → 0 통과
minutes                        → 0 통과
minutes 3a                     → 0 통과
minutes 99999999999999999999   → 0 통과
date    2024-02-29             → 1 통과
date    2026-02-29             → 0 통과
date    2000-02-29             → 1 통과
date    1900-02-29             → 0 통과
date    2026-04-31             → 0 통과
date    2026-12-31             → 1 통과
date    2026-13-01             → 0 통과
date    2026-1-01              → 0 통과
16/16 통과
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                   |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `if (*text == '\0' \|\| *text == '0') return 0;`           | 빈 칸, `0`, 앞자리 `0`을 한 번에 거릅니다.                                             |
| `errno = 0; ... if (errno == ERANGE \|\| v > 10080)`       | 아주 큰 수는 `strtoul`이 `ERANGE`로 알려 줍니다. 자릿수가 많은 입력도 경계 사례입니다. |
| `strlen(t) != 10 \|\| t[4] != '-' \|\| t[7] != '-'`        | 모양을 먼저 봅니다. `2026-1-01`은 길이가 9라 여기서 걸립니다.                          |
| `int y = atoi(t), m = atoi(t + 5), d = atoi(t + 8);`       | 숫자만 있다는 것을 확인한 **뒤**라 `atoi`가 안전하게 앞의 숫자만 읽습니다.             |
| `if (y < 1 \|\| m < 1 \|\| m > 12) return 0;`              | 달의 범위를 먼저 확인해야 `days[m]`이 배열 밖을 읽지 않습니다.                         |
| `struct { const char *text; int want; } minutes[] = {...}` | 이름 없는 구조체 배열로 시험 표를 만들었습니다(Day 56).                                |

## 7. Rust로 구현하기

```rust
// 파일: boundary.rs
fn minutes(text: &str) -> Option<u32> {
    if text.starts_with('0') || text.is_empty() || !text.bytes().all(|c| c.is_ascii_digit()) {
        return None;
    }
    text.parse::<u32>().ok().filter(|m| (1..=10080).contains(m))   // 너무 크면 parse가 실패
}

fn date_valid(s: &str) -> bool {
    let b = s.as_bytes();
    if b.len() != 10 || b[4] != b'-' || b[7] != b'-' {
        return false;
    }
    if !b.iter().enumerate().all(|(i, c)| i == 4 || i == 7 || c.is_ascii_digit()) {
        return false;                       // 숫자만 있어야 아래의 바이트 범위 자르기가 안전하다
    }
    let (Ok(y), Ok(m), Ok(d)) = (s[0..4].parse::<u32>(), s[5..7].parse::<u32>(), s[8..10].parse::<u32>()) else {
        return false;
    };
    let leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    let max = match m {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if leap => 29,
        2 => 28,
        _ => 0,                             // 13월 같은 값은 날이 0개
    };
    y > 0 && (1..=max).contains(&d)
}

fn main() {
    let minute_cases = [("1", Some(1)), ("10080", Some(10080)), ("0", None), ("10081", None), ("030", None), ("", None), ("99999999999999999999", None)];
    let date_cases = [("2024-02-29", true), ("2026-02-29", false), ("2000-02-29", true), ("1900-02-29", false), ("2026-04-31", false), ("2026-13-01", false), ("2026-1-01", false)];
    let mut passed = 0;
    for (text, want) in minute_cases {
        let got = minutes(text);
        passed += (got == want) as usize;
        println!("minutes {text:<22} → {got:?}");
    }
    for (text, want) in date_cases {
        let got = date_valid(text);
        passed += (got == want) as usize;
        println!("date    {text:<22} → {got}");
    }
    println!("{passed}/{} 통과", minute_cases.len() + date_cases.len());
}
```

실행 결과:

```text
minutes 1                      → Some(1)
minutes 10080                  → Some(10080)
minutes 0                      → None
minutes 10081                  → None
minutes 030                    → None
minutes                        → None
minutes 99999999999999999999   → None
date    2024-02-29             → true
date    2026-02-29             → false
date    2000-02-29             → true
date    1900-02-29             → false
date    2026-04-31             → false
date    2026-13-01             → false
date    2026-1-01              → false
14/14 통과
```

### 코드 한 부분씩 읽기

| 코드                                                                              | 설명                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `text.parse::<u32>().ok().filter(\|m\| (1..=10080).contains(m))`                  | 너무 큰 수는 `parse`가 실패하고, 범위는 `filter`로 거릅니다. 범위를 `1..=10080` 하나로 적어 경계 실수를 줄였습니다. |
| `b.iter().enumerate().all(\|(i, c)\| i == 4 \|\| i == 7 \|\| c.is_ascii_digit())` | 4.4절의 이유로 자르기 **전에** 숫자만 있는지 확인합니다.                                                            |
| `let (Ok(y), Ok(m), Ok(d)) = (...) else { return false; };`                       | 세 값을 한 번에 읽고, 하나라도 실패하면 `false`입니다(let-else, Day 53).                                            |
| `2 if leap => 29, 2 => 28, _ => 0`                                                | 13월 같은 값은 날 수 0이라 어떤 날도 통과하지 못합니다. C처럼 배열 밖을 읽을 걱정이 없습니다.                       |
| `passed += (got == want) as usize;`                                               | `bool`을 정수로 바꿔 셉니다.                                                                                        |

## 8. 실행 추적

Python 예제의 "셋째 줄 오류" 사례를 `validate`가 처리하는 과정입니다.

| 단계 | 읽은 것                              | 판단                    | 결과                                   |
| ---- | ------------------------------------ | ----------------------- | -------------------------------------- |
| 헤더 | `date,language,topic,minutes,result` | 계약과 같음             | 계속                                   |
| 2행  | `2026-10-01,C,a,5,pass`              | 모든 규칙 통과          | `count = 1`                            |
| 3행  | `2026-10-02,C,a,5,fail`              | `fail`은 결과 규칙 위반 | `(None, "3행: language/topic/result")` |

기대 조각은 `"3행:"`이라 통과입니다. 만약 구현이 데이터 줄만 세어 `2행`이라고 알려 줬다면, 이 사례가 그 차이를 잡습니다.

## 9. 다른 예제로 다시 이해하기

**골든 파일 비교.** 기본 fixture의 요약 출력을 골든과 비교합니다. 일부러 평균의 소수 자리를 틀리게 만든 경우, 비교 함수가 **어느 줄이 어떻게 다른지** 알려 주는지 확인합니다.

```python
# 파일: golden.py
import csv
import io

FIXTURE = """date,language,topic,minutes,result
2026-10-01,Python,변수,30,pass
2026-10-02,C,"배열, 포인터",45,retry
2026-10-03,Rust,소유권,25,pass
2026-10-04,Python,변수,30,pass
"""

GOLDEN = """sessions: 4
total_minutes: 130
average_minutes: 32.50
min_minutes: 25
max_minutes: 45
language_totals:
C,45
Python,60
Rust,25
"""                                          # 사람이 한 번 확인해 고정한 기대 출력(골든 파일)


def summary(text, broken=False):
    rows = list(csv.DictReader(io.StringIO(text)))
    mins = [int(r["minutes"]) for r in rows]
    total = sum(mins)
    lines = [f"sessions: {len(rows)}", f"total_minutes: {total}",
             f"average_minutes: {total / len(rows):.{1 if broken else 2}f}",   # broken이면 일부러 틀린 형식
             f"min_minutes: {min(mins)}", f"max_minutes: {max(mins)}", "language_totals:"]
    for lang in sorted({r["language"] for r in rows}):
        lines.append(f"{lang},{sum(int(r['minutes']) for r in rows if r['language'] == lang)}")
    return "\n".join(lines) + "\n"


def first_difference(got, want):
    g, w = got.splitlines(), want.splitlines()
    for i, (a, b) in enumerate(zip(g, w), start=1):
        if a != b:
            return f"{i}번째 줄이 다름: {a!r} ≠ {b!r}"
    if len(g) != len(w):
        return f"줄 수가 다름: {len(g)} ≠ {len(w)}"
    return None


for broken in (False, True):
    diff = first_difference(summary(FIXTURE, broken), GOLDEN)
    print("골든과 같음" if diff is None else f"다름 → {diff}")
```

실행 결과:

```text
골든과 같음
다름 → 3번째 줄이 다름: 'average_minutes: 32.5' ≠ 'average_minutes: 32.50'
```

| 코드                                            | 설명                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `GOLDEN = """..."""`                            | 사람이 확인한 기대 출력입니다. 실제 프로젝트에서는 파일로 둡니다.                               |
| `f"{total / len(rows):.{1 if broken else 2}f}"` | 형식 지정 안에도 식을 넣을 수 있습니다. 일부러 틀리게 만드는 스위치로 비교 함수를 시험했습니다. |
| `def first_difference(got, want)`               | 줄 단위로 비교해 첫 차이를 문장으로 돌려줍니다. 같으면 `None`입니다.                            |
| `{a!r} ≠ {b!r}`                                 | `repr`로 보여 줘서 끝의 공백이나 보이지 않는 글자 차이도 드러납니다.                            |
| `len(g) != len(w)`                              | 앞부분이 모두 같아도 줄 수가 다르면(빠진 줄, 남는 줄) 다르다고 알립니다.                        |

Rust로 같은 비교 함수를 만들면, 끝의 공백처럼 눈에 안 보이는 차이도 `{:?}`가 드러내 줍니다.

```rust
// 파일: golden.rs
fn first_difference(got: &str, want: &str) -> Option<String> {
    let (g, w): (Vec<&str>, Vec<&str>) = (got.lines().collect(), want.lines().collect());
    for (i, (a, b)) in g.iter().zip(&w).enumerate() {
        if a != b {
            return Some(format!("{}번째 줄이 다름: {a:?} ≠ {b:?}", i + 1));
        }
    }
    if g.len() != w.len() {
        return Some(format!("줄 수가 다름: {} ≠ {}", g.len(), w.len()));
    }
    None
}

fn main() {
    let golden = "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.50\n";
    let outputs = [
        ("정상", "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.50\n"),
        ("소수 자리", "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.5\n"),
        ("줄 빠짐", "sessions: 4\ntotal_minutes: 130\n"),
        ("끝 공백", "sessions: 4 \ntotal_minutes: 130\naverage_minutes: 32.50\n"),
    ];
    for (name, out) in outputs {
        match first_difference(out, golden) {
            None => println!("{name}: 골든과 같음"),
            Some(d) => println!("{name}: {d}"),
        }
    }
}
```

실행 결과:

```text
정상: 골든과 같음
소수 자리: 3번째 줄이 다름: "average_minutes: 32.5" ≠ "average_minutes: 32.50"
줄 빠짐: 줄 수가 다름: 2 ≠ 3
끝 공백: 1번째 줄이 다름: "sessions: 4 " ≠ "sessions: 4"
```

- `let (g, w): (Vec<&str>, Vec<&str>) = (...)`는 두 줄 목록을 한 번에 만듭니다. 원래 문자열을 빌린 조각이라 복사가 없습니다(Day 45).
- `"끝 공백"` 사례는 사람 눈에는 같아 보이지만 비교에서는 다릅니다. 이 과정의 레슨 검사는 줄 끝 공백을 무시하도록 정해 두었지만, 세 구현의 비교(Day 91)는 바이트까지 같아야 합니다. 비교 규칙도 계약의 일부입니다.

## 10. fixture 설계 점검표

| 점검                              | 오늘의 사례                                       |
| --------------------------------- | ------------------------------------------------- |
| 무리마다 대표값이 있는가          | 정상, minutes 오류, 날짜 오류, 값 오류, 구조 오류 |
| 범위의 양 끝과 바로 바깥이 있는가 | 0, 1, 10080, 10081                                |
| 규칙의 단계마다 경계가 있는가     | 2024, 1900, 2000(윤년 세 단계)                    |
| 비어 있는 입력이 있는가           | 헤더만, 빈 칸, 공백만 있는 주제                   |
| 까다로운 형식이 있는가            | 쉼표 든 주제, 앞자리 0, 아주 큰 수                |
| 오류 위치를 확인하는가            | 셋째 줄 오류                                      |
| 정상 출력의 기준이 있는가         | 골든 파일                                         |

## 11. 세 언어 비교

| 관점               | Python                   | C                 | Rust                 |
| ------------------ | ------------------------ | ----------------- | -------------------- |
| 날짜 검사          | 표준 `datetime`          | 직접(표 + 윤년)   | 직접(`match` + 윤년) |
| 아주 큰 수         | 문제없음(크기 제한 없음) | `errno == ERANGE` | `parse` 실패         |
| 시험 표            | 튜플 리스트              | 구조체 배열       | 튜플 배열            |
| 검사 순서를 틀리면 | 예외(대개 안전)          | 배열 밖 읽기      | 패닉(바이트 경계)    |

## 12. 자주 하는 실수

### 실수 1: 가운데 값만 시험한다

30, 45 같은 값만 넣으면 `<`와 `<=`의 차이, `0`의 처리, 윤년 규칙의 단계가 모두 숨어 버립니다. 실습의 변형 문제처럼 경계를 추가하세요.

### 실수 2: 시험의 기대값을 구현에 맞춘다

시험이 실패하면 구현이 아니라 기대값을 고치고 싶어집니다. 기대값은 **계약**에서 나와야 합니다. 실습의 디버그 문제에서 기대를 "실패"로 바꾸면 버그를 숨기게 됩니다.

### 실수 3: 오류 사례에서 "오류가 났다"만 확인한다

다른 이유로 실패해도 통과해 버립니다. 줄 번호와 문제의 열을 조각으로 확인하세요.

### 실수 4: 검사 순서를 거꾸로 한다

C에서 달의 범위를 확인하기 전에 `days[m]`을 읽거나, Rust에서 숫자인지 확인하기 전에 바이트로 자르면, 이상한 입력이 프로그램을 멈추게 합니다. fixture에 `2026-13-01`, 한글이 섞인 날짜 같은 "이상한" 입력을 넣어 순서를 확인하세요.

### 실수 5: 골든 파일을 확인 없이 갱신한다

출력이 달라졌다고 골든 파일을 새 출력으로 그냥 덮어쓰면, 버그를 기준으로 삼게 됩니다. 달라진 줄을 하나씩 확인하고, 의도한 변경일 때만 갱신하세요.

## 13. Q&A

**Q. 시험 사례는 몇 개나 있어야 하나요?**

A. 개수보다 **무리와 경계를 빠짐없이** 덮는 것이 중요합니다. 오늘의 표처럼 무리마다 한두 개, 경계마다 안팎 두 개면 수십 개 안에서 대부분의 버그를 잡을 수 있습니다. 버그를 고칠 때마다 그 버그의 사례를 하나씩 더하세요.

**Q. 무작위 입력으로 시험하면 안 되나요?**

A. 무작위 시험(퍼징, 속성 기반 시험)은 사람이 생각하지 못한 입력을 찾는 데 좋습니다. 다만 실패했을 때 같은 입력을 다시 만들 수 있게 난수 씨앗을 기록해야 하고, 경계값 시험을 대신하지는 못합니다. 둘을 함께 쓰는 것이 좋습니다.

**Q. fixture를 파일로 두는 것과 코드 안에 두는 것의 차이는?**

A. 파일로 두면 세 언어 구현과 비교 스크립트가 **같은 파일**을 쓸 수 있습니다(이 프로젝트의 `study_sessions.csv`). 코드 안에 두면 한 언어의 시험이 스스로 완결되어 읽기 쉽습니다. 오늘의 레슨은 실행기에서 바로 돌리려고 코드 안에 두었습니다.

**Q. 이 과정의 비교 스크립트는 어떤 오류 사례를 쓰나요?**

A. 평년 2월 30일, 없는 언어, 0분, 없는 결과 값, 열 부족 다섯 가지를 세 구현에 넣고, 모두 0이 아닌 종료 코드와 비어 있지 않은 오류를 내는지 확인합니다. 오늘 만든 표는 그보다 넓어서, 도전 문제로 비교 스크립트에 더 넣어 볼 수 있습니다.

## 14. 핵심 요약

- fixture는 계약을 시험할 입력입니다. 입력을 **동치 분할**로 나누고, 무리마다 대표값과 **경계값**(양 끝, 바로 바깥)을 고릅니다.
- minutes는 0, 1, 10080, 10081과 앞자리 0, 날짜는 윤년 세 단계(2024, 1900, 2000)와 달마다 마지막 날, 구조는 헤더만·열 부족·줄 번호를 넣습니다.
- 올바른 입력은 행 수로, 잘못된 입력은 오류 문장의 **핵심 조각**으로 기대 결과를 적습니다.
- 정상 출력은 **골든 파일**과 비교하고, 다르면 첫 번째 차이를 보여 줍니다. 골든은 확인 후에만 갱신합니다.
- 검사 순서(모양 → 숫자 → 범위 → 날 수)가 안전성을 정합니다. C의 배열 밖 읽기, Rust의 바이트 경계 패닉을 순서로 막습니다.

## 15. 도전 문제

1. **(Python)** 시험 표에 `"2026-10-01,C,a,5,pass,extra"`(열이 하나 많음), 따옴표가 닫히지 않은 줄, 주제에 `""`가 든 줄을 추가하고 기대 결과를 적으세요. 닫히지 않은 따옴표는 `csv` 모듈이 어떻게 처리하는지 먼저 확인해야 합니다(`strict=True`).
2. **(Python)** `first_difference`를 확장해 다른 줄의 앞뒤 한 줄씩을 함께 보여 주세요(`difflib.unified_diff`를 찾아봐도 좋습니다).
3. **(C)** `date_valid`에 `"0000-01-01"`과 `"2026-02-00"`을 시험 표에 추가하고, 결과가 계약과 맞는지 확인하세요.
4. **(Rust)** `date_valid`에 한글이 섞인 10바이트 입력(예: `"2026-1가-1"`처럼 바이트 수를 맞춘 문자열)을 넣어, 숫자 검사를 빼면 패닉이 나고 넣으면 `false`가 나는지 확인하세요.

## Study Log Analyzer 실제 프로젝트

[세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_sessions.csv`가 오늘 말한 기본 fixture입니다. 저장소의 `scripts/verify-capstone.py`는 이 fixture와 잘못된 입력 다섯 가지를 세 구현에 넣어 결과를 비교합니다. 오늘 만든 사례 표와 비교해 빠진 경계가 무엇인지 찾아보세요.
