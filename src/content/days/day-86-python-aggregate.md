---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-86-python-aggregate
courseId: crp-92
phaseId: phase-08
dayNumber: 86
date: "2026-12-25"
title: Python 집계·정렬·Top N
summary: 검증된 Session 목록으로 Study Log Analyzer의 보고서를 만듭니다. 네 가지 거르기(언어, 주제, 날짜, 대소문자를 무시한 주제 검색)를 조건 하나로 묶고, 합계·평균(소수 둘째 자리)·최솟값·최댓값을 빈 결과에서도 0으로 내며, 언어별·주제별 합계를 이름 순서로, 긴 공부 기록을 분 내림차순(같으면 날짜·언어·주제 오름차순) 또는 날짜 순으로 정렬해 앞의 N개를 출력합니다. 정렬 열쇠를 튜플로 만들고 숫자를 음수로 바꿔 한쪽만 내림차순으로 만드는 방법, min·max의 default, casefold를 다루고, 같은 집계를 C(고정 그룹과 qsort 비교 함수)와 Rust(BTreeMap, sort_by와 then_with)로 옮깁니다. 마지막으로 한 번만 훑는 defaultdict 집계와 ASCII 막대 그래프 확장을 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-85-python-csv-parse]
learningObjectives:
  - 여러 선택적 거르기 조건을 None 검사와 and로 한 식에 묶는다.
  - 합계·평균·최솟값·최댓값을 빈 결과에서도 계약대로 출력한다.
  - 튜플 정렬 열쇠와 음수 바꾸기로 여러 기준, 방향이 섞인 정렬을 만들고 앞의 N개를 고른다.
  - 같은 집계를 C의 qsort 비교 함수와 Rust의 BTreeMap·sort_by로 옮긴다.
  - 한 번만 훑는 집계(defaultdict)로 바꾸고, 결과가 같은지 확인한다.
concepts:
  [
    filtering,
    optional filter,
    aggregation,
    average formatting,
    min max default,
    group totals,
    sorted keys,
    tuple sort key,
    descending by negation,
    stable sort,
    top n,
    casefold,
    defaultdict,
    btreemap,
    sort by then with,
    qsort comparator,
    ascii chart,
  ]
runnerMode: python
playgroundSource: |
  # 파일: sort_play.py — 한쪽만 내림차순인 정렬 열쇠
  rows = [("2026-10-01", "Python", 30), ("2026-10-02", "C", 45), ("2026-10-04", "Python", 30)]
  for r in sorted(rows, key=lambda r: (-r[2], r[0])):
      print(r)
  print(min([], default=0), f"{130 / 4:.2f}")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day86-predict-key
    title: 음수 열쇠로 한쪽만 내림차순 예측하기
    kind: predict
    objective: 튜플 열쇠의 첫 값을 음수로 바꾸면 그 기준만 내림차순이 된다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print(sorted([("b", 30), ("a", 30), ("c", 45)], key=lambda r: (-r[1], r[0])))
    answer: "[('c', 45), ('a', 30), ('b', 30)]"
    hint: "열쇠는 (-45, 'c'), (-30, 'a'), (-30, 'b')입니다. 튜플은 앞에서부터 비교합니다."
    explanation: "-45 < -30이라 45가 가장 앞이고, 30끼리는 둘째 값(이름)의 오름차순으로 a, b입니다. reverse=True를 쓰면 이름까지 거꾸로(b, a)가 되어 계약(같으면 날짜·언어·주제 오름차순)과 달라집니다. 숫자가 아닌 기준을 내림차순으로 하려면 음수를 쓸 수 없어서, 두 번 정렬하거나 비교 함수를 씁니다."
    commonMistakes:
      - "[('c', 45), ('b', 30), ('a', 30)]로 적어 이름도 거꾸로 정렬함"
      - "음수 때문에 30이 먼저 온다고 생각함"
    language: python
    verification: run
  - id: ex-day86-predict-empty
    title: 빈 결과의 통계 예측하기
    kind: predict
    objective: min의 default와 평균 형식을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print(min([], default=0), f"{130 / 4:.2f}")
    answer: "0 32.50"
    hint: "빈 목록의 min은 default가 없으면 오류입니다. .2f는 소수 둘째 자리까지 0을 채웁니다."
    explanation: "거르기 결과가 비면 계약은 모든 통계를 0으로 내라고 합니다. min([])는 ValueError라서 default=0이 필요합니다. 평균 32.5는 .2f로 32.50이 됩니다. 계약이 '소수 둘째 자리'를 정해 두었기 때문에 세 구현이 32.5, 32.50처럼 다르게 쓰지 않습니다."
    commonMistakes:
      - "min([])이 None을 돌려준다고 생각함"
      - "32.5로 적음"
    language: python
    verification: run
  - id: ex-day86-fill
    title: 앞의 N개 고르기 채우기
    kind: fill
    objective: 정렬한 목록에서 자르기로 앞의 N개를 고른다.
    prompt: "빈칸을 채워 가장 긴 두 기록 '[45, 30]'이 출력되게 하세요."
    starter: |-
      rows = [45, 30, 30, 25]
      top = 2
      print(sorted(rows, reverse=True)[:_____])
    answer: |-
      rows = [45, 30, 30, 25]
      top = 2
      print(sorted(rows, reverse=True)[:top])
    output: "[45, 30]"
    hint: "Day 36의 자르기: 처음부터 N개입니다."
    explanation: "[:top]은 top이 목록보다 커도 오류 없이 있는 만큼만 줍니다. 그래서 기록이 세 개뿐인데 --top 5를 줘도 괜찮습니다. Rust의 iter().take(n), C의 i < used && i < top 조건이 같은 일을 합니다. 전부 정렬하지 않고 가장 큰 N개만 원하면 heapq.nlargest를 쓸 수도 있습니다."
    commonMistakes:
      - "[top]으로 써서 한 칸만 꺼냄"
      - "[:top - 1]로 써서 하나를 덜 꺼냄"
    language: python
    verification: run
  - id: ex-day86-modify
    title: 대소문자를 무시하는 검색으로 바꾸기
    kind: modify
    objective: casefold로 양쪽을 맞춘 뒤 포함 여부를 확인한다.
    prompt: 'search가 ''RUST''일 때 대소문자 때문에 아무것도 찾지 못합니다. casefold로 고쳐 "[''Rust 기초'', ''rust 심화'']"가 출력되게 하세요.'
    starter: |-
      topics = ["Rust 기초", "rust 심화", "Python"]
      search = "RUST"
      print([t for t in topics if search in t])
    answer: |-
      topics = ["Rust 기초", "rust 심화", "Python"]
      search = "RUST"
      print([t for t in topics if search.casefold() in t.casefold()])
    output: "['Rust 기초', 'rust 심화']"
    starterOutput: "[]"
    hint: "양쪽을 같은 모양(소문자 비슷한 형태)으로 바꾼 뒤 비교하세요."
    explanation: "casefold는 lower보다 더 넓게 대소문자를 맞춥니다(독일어 ß 등, Day 38). 한쪽만 바꾸면 다른 쪽의 대문자가 남아 틀립니다. 세 구현이 '대소문자 무시'를 똑같이 하려면 ASCII만 다루는지, 유니코드 전체를 다루는지까지 맞춰야 합니다. C는 tolower로 바이트마다 비교하고, Rust는 to_lowercase를 씁니다. 한글에는 대소문자가 없어서 영향이 없습니다."
    commonMistakes:
      - "search.lower() in t로 한쪽만 바꿈"
      - "==로 비교해 부분 일치(포함)를 놓침"
    language: python
    verification: run
  - id: ex-day86-debug
    title: 빈 결과에서 0으로 나누는 평균 고치기
    kind: debug
    objective: 거르기 결과가 비었을 때도 계약대로 평균을 출력한다.
    prompt: "이 코드는 거르기 결과가 비면 ZeroDivisionError로 멈춥니다. 결과가 비면 'average_minutes: 0.00'을 출력하도록 고치세요."
    starter: |-
      sel = []
      total = sum(sel)
      print(f"average_minutes: {total / len(sel):.2f}")
    answer: |-
      sel = []
      total = sum(sel)
      print(f"average_minutes: {total / len(sel):.2f}" if sel else "average_minutes: 0.00")
    output: "average_minutes: 0.00"
    hint: "빈 리스트는 거짓입니다. 조건식으로 두 경우를 나누세요."
    explanation: "--search로 아무것도 찾지 못하는 것은 흔한 일이라 프로그램이 멈추면 안 됩니다. 계약이 빈 결과의 출력(모든 통계 0)을 정해 두었고, 세 구현이 모두 그렇게 해야 합니다. C는 used ? (double)total / used : 0.0, Rust는 if selected.is_empty() { 0.0 } else { ... }로 같은 일을 합니다."
    commonMistakes:
      - "len(sel) or 1로 나눠 결과는 같지만 뜻이 흐려짐"
      - "try/except로 감싸 다른 오류까지 숨김"
    language: python
    verification: run
  - id: ex-day86-independent
    title: Rust BTreeMap으로 언어별 합계 만들기
    kind: independent
    objective: entry와 or_default로 무리별 합계를 만들고 열쇠 순서로 출력한다.
    prompt: '(언어, 분) 쌍 [("Python", 30), ("C", 45), ("Python", 30), ("C", 95)]의 언어별 합계를 BTreeMap으로 만들어 ''C,140 Python,60''을 출력하세요.'
    starter: |-
      fn main() {
          let pairs = [("Python", 30), ("C", 45), ("Python", 30), ("C", 95)];
          println!("{}", pairs.len());
      }
    answer: |-
      use std::collections::BTreeMap;

      fn main() {
          let pairs = [("Python", 30), ("C", 45), ("Python", 30), ("C", 95)];
          let mut totals: BTreeMap<&str, u32> = BTreeMap::new();
          for (lang, m) in pairs {
              *totals.entry(lang).or_default() += m;
          }
          let parts: Vec<String> = totals.iter().map(|(k, v)| format!("{k},{v}")).collect();
          println!("{}", parts.join(" "));
      }
    output: "C,140 Python,60"
    hint: "entry(열쇠).or_default()는 없으면 0을 넣고 그 칸을 가변으로 빌려 줍니다."
    explanation: "BTreeMap은 열쇠 순서로 정렬되어 있어서, Python의 sorted(set(...))처럼 따로 정렬할 필요가 없습니다(바이트 순서라 대문자 C가 Python보다 앞). HashMap을 쓰면 출력 순서가 실행마다 달라져 세 구현의 출력이 어긋날 수 있습니다. 한 번 훑으며 모으므로 Python 실습의 totals_fast와 같은 방식입니다."
    commonMistakes:
      - "HashMap을 써서 순서가 매번 달라짐"
      - "totals[lang] += m처럼 없는 열쇠에 바로 더하려 해서 패닉함"
    language: rust
    verification: run
quiz:
  - id: quiz-day86-01
    question: (language is None or r.language == language) 모양의 조건이 하는 일은?
    choices:
      - 언어가 None인 기록만 고른다
      - 옵션을 주지 않았으면(None) 모든 기록을 통과시키고, 주었으면 그 언어만 고른다
      - 항상 거짓이다
      - 언어를 바꾼다
    answerIndex: 1
    explanation: 선택적 거르기를 한 식으로 쓰는 흔한 방법입니다. 네 조건을 and로 이으면 준 옵션만 적용됩니다. Rust는 opts.language.as_ref().is_none_or(|s| s == &r.language)로 같은 뜻을 씁니다.
  - id: quiz-day86-02
    question: 분 내림차순, 같으면 날짜 오름차순으로 정렬하는 Python 열쇠는?
    choices:
      - "key=lambda r: (r.minutes, r.day), reverse=True"
      - "key=lambda r: (-r.minutes, r.day)"
      - "key=lambda r: r.minutes"
      - "key=lambda r: (r.day, -r.minutes)"
    answerIndex: 1
    explanation: reverse=True는 모든 기준을 거꾸로 해서 날짜까지 내림차순이 됩니다. 숫자 기준만 음수로 바꾸면 그 기준만 내림차순입니다.
  - id: quiz-day86-03
    question: 언어별 합계를 HashMap이 아니라 BTreeMap(또는 sorted)으로 출력하는 이유는?
    choices:
      - 더 빨라서
      - 출력 순서가 계약(이름 순)대로 항상 같아야 세 구현의 출력을 비교할 수 있어서
      - HashMap은 합계를 못 내서
      - 필요 없다
    answerIndex: 1
    explanation: 해시 사전의 순서는 구현과 실행마다 달라질 수 있습니다. 계약이 이름 순서를 정했으므로 정렬된 사전이나 정렬 단계가 필요합니다. Python의 dict는 넣은 순서를 지키지만, 넣는 순서가 입력 순서라 이름 순은 아닙니다.
  - id: quiz-day86-04
    question: 열쇠마다 전체를 다시 훑는 sum(... if r.language == k) 방식의 단점은?
    choices:
      - 결과가 틀린다
      - 열쇠 수 × 줄 수만큼 훑어서 줄과 열쇠가 많으면 느리다
      - 메모리를 많이 쓴다
      - 정렬이 안 된다
    answerIndex: 1
    explanation: 주제가 1000개, 줄이 10만 개면 1억 번 비교합니다. defaultdict나 BTreeMap의 entry로 한 번만 훑으면 10만 번입니다. 결과는 같으므로, 바꾼 뒤 두 방법의 결과가 같은지 시험으로 확인합니다(오늘 실습).
  - id: quiz-day86-05
    question: Python의 sorted가 안정 정렬이라는 것이 뜻하는 것은?
    choices:
      - 정렬이 빠르다
      - 열쇠가 같은 원소들은 원래 순서를 유지한다
      - 항상 오름차순이다
      - 오류가 나지 않는다
    answerIndex: 1
    explanation: 이 프로젝트는 열쇠에 날짜·언어·주제까지 넣어 같은 열쇠가 거의 없게 만들어, 안정성에 기대지 않습니다. C의 qsort는 안정 정렬이 아니라서(Day 49) 이렇게 모든 기준을 열쇠에 넣어야 세 구현의 순서가 같아집니다.
---

## 1. 오늘 배울 내용

Day 85에서 CSV를 읽어 검증된 `Session` 목록을 만들었습니다. 오늘은 그 목록으로 **보고서**를 만듭니다. 계약의 출력 부분(Day 83)을 그대로 구현하는 날입니다.

1. **거르기**: 네 가지 선택 옵션을 조건 하나로
   - `--language`, `--topic`(같음), `--date`(같음), `--search`(주제에 포함, 대소문자 무시)
2. **통계**: 기록 수, 합계, 평균(소수 둘째 자리), 최솟값, 최댓값
   - 결과가 비었을 때 모두 0
3. **무리별 합계**: 언어별, 주제별, 이름 순서로
4. **정렬과 Top N**
   - 기본: 분 내림차순, 같으면 날짜·언어·주제 오름차순
   - `--sort date`: 날짜·언어·주제·분 오름차순
   - 앞의 N개(`--top`, 기본 5)
5. 같은 집계를 C(qsort 비교 함수)와 Rust(`BTreeMap`, `sort_by`)로 옮깁니다.
6. 한 번만 훑는 집계(`defaultdict`)로 바꾸고, ASCII 막대 그래프 확장을 만듭니다.

## 2. 왜 필요한가

집계와 정렬은 데이터를 다루는 프로그램 대부분의 핵심입니다. 판매 기록의 지역별 합계, 로그의 오류 종류별 개수, 시험 점수의 상위 10명 모두 오늘과 같은 모양입니다.

그리고 세 구현이 **같은 출력**을 내려면 작은 규칙까지 같아야 합니다.

- 평균을 `32.5`로 쓸지 `32.50`으로 쓸지
- 결과가 비었을 때 오류로 멈출지 0을 쓸지
- 분이 같은 두 기록 중 무엇을 먼저 쓸지
- 언어별 합계를 어떤 순서로 쓸지

계약이 이것들을 모두 정해 두었고, 오늘은 그것을 코드로 옮깁니다. 특히 **동점 처리**와 **빈 결과**는 평범한 fixture로는 드러나지 않는 부분이라 조심해야 합니다.

## 3. 그림으로 이해하기

**보고서 만들기의 단계.**

```text
rows(검증된 Session들)
   │ 거르기: 옵션마다 (없으면 통과) and (있으면 같음/포함)
   ▼
selected
   ├─▶ 통계: len, sum, sum/len(.2f), min(default 0), max(default 0)
   ├─▶ 언어별 합계 → 이름 순
   ├─▶ 주제별 합계 → 이름 순
   └─▶ 정렬(열쇠) → 앞의 N개 → top_sessions
```

**정렬 열쇠.** 튜플은 앞에서부터 비교합니다.

```text
기록                                   열쇠 (-minutes, day, language, topic)
2026-10-01 Python 변수 30        →    (-30, "2026-10-01", "Python", "변수")
2026-10-02 C 배열, 포인터 45       →    (-45, "2026-10-02", "C", "배열, 포인터")   ← 가장 작음 → 1등
2026-10-04 Python 변수 30        →    (-30, "2026-10-04", "Python", "변수")
2026-10-03 Rust 소유권 25         →    (-25, "2026-10-03", "Rust", "소유권")

30분 두 기록: 첫 값이 같아서 둘째 값(날짜)으로 → 10-01이 10-04보다 앞
```

**한 번 훑기와 여러 번 훑기.**

```text
여러 번:  열쇠 C      → 줄 전체 훑기
          열쇠 Python → 줄 전체 훑기          비교 횟수 = 열쇠 수 × 줄 수
          열쇠 Rust   → 줄 전체 훑기
한 번:    줄마다 acc[열쇠] += 분               비교 횟수 = 줄 수
```

## 4. 천천히 풀어보기

### 4.1 선택적 거르기

```python
(language is None or r.language == language)
```

옵션을 주지 않았으면(`None`) 앞이 참이라 뒤를 보지 않고 통과합니다. 주었으면 뒤의 비교로 정합니다. 네 조건을 `and`로 이으면 준 옵션만 적용됩니다.

`--search`는 **포함**이고 **대소문자를 무시**합니다. 양쪽을 `casefold()`로 맞춘 뒤 `in`으로 확인합니다.

### 4.2 빈 결과

| 통계              | 결과가 있을 때       | 비었을 때                        |
| ----------------- | -------------------- | -------------------------------- |
| `sessions`        | `len(selected)`      | 0                                |
| `total_minutes`   | `sum(...)`           | 0(빈 `sum`은 0)                  |
| `average_minutes` | `total / len`, `.2f` | `0.00`(0으로 나누면 오류라 직접) |
| `min_minutes`     | `min(...)`           | `default=0`                      |
| `max_minutes`     | `max(...)`           | `default=0`                      |
| 합계 목록         | 이름 순 줄들         | 제목 줄만(`language_totals:`)    |

### 4.3 정렬 열쇠 만들기

| 원하는 순서                                 | 열쇠                                       |
| ------------------------------------------- | ------------------------------------------ |
| 분 내림차순, 같으면 날짜·언어·주제 오름차순 | `(-r.minutes, r.day, r.language, r.topic)` |
| 날짜·언어·주제·분 오름차순(`--sort date`)   | `(r.day, r.language, r.topic, r.minutes)`  |

- 숫자 기준을 내림차순으로 하려면 **음수**로 바꿉니다. `reverse=True`는 모든 기준을 뒤집어 버립니다.
- 모든 기준을 열쇠에 넣어 **동점이 없게** 만들면, 정렬 알고리즘의 안정성(같은 열쇠의 원래 순서 유지)에 기대지 않아도 됩니다. C의 `qsort`는 안정 정렬이 아니라서 이 점이 중요합니다.
- 날짜가 `YYYY-MM-DD` 문자열이라 문자열 순서가 곧 날짜 순서입니다.

### 4.4 한 번 훑는 집계

`sorted({r.language for r in selected})`로 열쇠를 모으고 열쇠마다 `sum(...)`을 하면 코드는 짧지만, 열쇠가 많으면 느립니다. `defaultdict(int)`에 한 번 훑으며 더한 뒤 열쇠 순서로 정렬하면 줄 수에 비례하는 시간이 듭니다. 실제 프로젝트는 읽기 쉬운 앞의 방식을 쓰고, 실습에서 두 방식이 같은 결과를 내는지 확인합니다. 최적화할 때는 **바꾸기 전과 후의 결과가 같다는 시험**을 먼저 만드세요.

## 5. Python으로 구현하기

```python
# 파일: report.py
from dataclasses import dataclass


@dataclass(frozen=True)
class Session:
    day: str
    language: str
    topic: str
    minutes: int
    result: str


def report(rows, *, language=None, topic=None, day=None, search=None, sort="minutes", top=5):
    selected = [r for r in rows if
                (language is None or r.language == language) and
                (topic is None or r.topic == topic) and
                (day is None or r.day == day) and
                (search is None or search.casefold() in r.topic.casefold())]
    total = sum(r.minutes for r in selected)
    lines = [f"sessions: {len(selected)}",
             f"total_minutes: {total}",
             f"average_minutes: {total / len(selected):.2f}" if selected else "average_minutes: 0.00",
             f"min_minutes: {min((r.minutes for r in selected), default=0)}",
             f"max_minutes: {max((r.minutes for r in selected), default=0)}",
             "language_totals:"]
    for key in sorted({r.language for r in selected}):
        lines.append(f"{key},{sum(r.minutes for r in selected if r.language == key)}")
    lines.append("topic_totals:")
    for key in sorted({r.topic for r in selected}):
        lines.append(f"{key},{sum(r.minutes for r in selected if r.topic == key)}")
    lines.append("top_sessions:")
    if sort == "date":
        key = lambda r: (r.day, r.language, r.topic, r.minutes)
    else:
        key = lambda r: (-r.minutes, r.day, r.language, r.topic)   # 분은 내림차순, 나머지는 오름차순
    for r in sorted(selected, key=key)[:top]:
        lines.append(f"{r.day},{r.language},{r.topic},{r.minutes},{r.result}")
    return "\n".join(lines) + "\n"


ROWS = [
    Session("2026-10-01", "Python", "변수", 30, "pass"),
    Session("2026-10-02", "C", "배열, 포인터", 45, "retry"),
    Session("2026-10-03", "Rust", "소유권", 25, "pass"),
    Session("2026-10-04", "Python", "변수", 30, "pass"),
]
print("== 기본 ==")
print(report(ROWS), end="")
print("== --language Python --sort date --top 1 ==")
print(report(ROWS, language="Python", sort="date", top=1), end="")
print("== --search 없음 ==")
print(report(ROWS, search="없음"), end="")
```

실행 결과:

```text
== 기본 ==
sessions: 4
total_minutes: 130
average_minutes: 32.50
min_minutes: 25
max_minutes: 45
language_totals:
C,45
Python,60
Rust,25
topic_totals:
배열, 포인터,45
변수,60
소유권,25
top_sessions:
2026-10-02,C,배열, 포인터,45,retry
2026-10-01,Python,변수,30,pass
2026-10-04,Python,변수,30,pass
2026-10-03,Rust,소유권,25,pass
== --language Python --sort date --top 1 ==
sessions: 2
total_minutes: 60
average_minutes: 30.00
min_minutes: 30
max_minutes: 30
language_totals:
Python,60
topic_totals:
변수,60
top_sessions:
2026-10-01,Python,변수,30,pass
== --search 없음 ==
sessions: 0
total_minutes: 0
average_minutes: 0.00
min_minutes: 0
max_minutes: 0
language_totals:
topic_totals:
top_sessions:
```

### 코드 한 부분씩 읽기

| 코드                                                                     | 설명                                                                                                                                           |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `def report(rows, *, language=None, ...)`                                | `*` 뒤의 매개변수는 이름으로만 받습니다(Day 44). `report(rows, "Python")`처럼 순서를 착각하는 실수를 막습니다.                                 |
| `selected = [r for r in rows if (...) and (...) ...]`                    | 4.1절의 선택적 거르기입니다.                                                                                                                   |
| `f"average_minutes: {...:.2f}" if selected else "average_minutes: 0.00"` | 빈 결과를 먼저 처리해 0으로 나누지 않습니다.                                                                                                   |
| `min((r.minutes for r in selected), default=0)`                          | 생성기에 `default`를 주려면 괄호로 한 번 더 감쌉니다.                                                                                          |
| `for key in sorted({r.language for r in selected})`                      | 집합으로 열쇠를 모으고 이름 순으로 정렬합니다. 한글 주제는 코드 포인트 순서라 `배열`(U+BC30) < `변수`(U+BCC0) < `소유권`(U+C18C)입니다.        |
| `key = lambda r: (-r.minutes, r.day, r.language, r.topic)`               | 4.3절의 열쇠입니다. 30분 두 기록은 날짜로 순서가 정해졌습니다.                                                                                 |
| `sorted(selected, key=key)[:top]`                                        | 앞의 N개만 출력합니다. `--top 1`에서 날짜가 가장 이른 기록 하나입니다.                                                                         |
| `f"{r.day},{r.language},{r.topic},{r.minutes},{r.result}"`               | 출력은 CSV처럼 보이지만 **따옴표를 다시 붙이지 않습니다**. 그래서 `배열, 포인터`의 쉼표가 그대로 나옵니다. 계약이 이 모양으로 정해 두었습니다. |

## 6. C로 구현하기

C 구현은 Day 88에서 완성합니다. 오늘은 통계와 정렬의 핵심만 봅니다.

```c
// 파일: aggregate.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    const char *day, *language, *topic;
    unsigned minutes;
} Session;

static int by_minutes_desc(const void *pa, const void *pb) {
    const Session *a = pa, *b = pb;
    if (a->minutes != b->minutes) {
        return a->minutes < b->minutes ? 1 : -1;   // 큰 것이 앞(뺄셈 대신 비교)
    }
    int c = strcmp(a->day, b->day);
    if (c == 0) {
        c = strcmp(a->language, b->language);
    }
    if (c == 0) {
        c = strcmp(a->topic, b->topic);
    }
    return c;
}

int main(void) {
    Session rows[] = {
        {"2026-10-01", "Python", "변수", 30},
        {"2026-10-02", "C", "배열, 포인터", 45},
        {"2026-10-03", "Rust", "소유권", 25},
        {"2026-10-04", "Python", "변수", 30},
    };
    size_t n = sizeof rows / sizeof rows[0];
    const char *langs[] = {"C", "Python", "Rust"};  // 이미 이름 순서
    unsigned long long by_lang[3] = {0};
    unsigned long long total = 0;
    unsigned min = n ? rows[0].minutes : 0, max = 0;
    for (size_t i = 0; i < n; i++) {
        total += rows[i].minutes;
        min = rows[i].minutes < min ? rows[i].minutes : min;
        max = rows[i].minutes > max ? rows[i].minutes : max;
        for (int k = 0; k < 3; k++) {
            if (strcmp(rows[i].language, langs[k]) == 0) {
                by_lang[k] += rows[i].minutes;
            }
        }
    }
    printf("sessions: %zu\ntotal_minutes: %llu\naverage_minutes: %.2f\nmin_minutes: %u\nmax_minutes: %u\n",
           n, total, n ? (double)total / n : 0.0, min, max);
    printf("language_totals:\n");
    for (int k = 0; k < 3; k++) {
        if (by_lang[k] > 0) {
            printf("%s,%llu\n", langs[k], by_lang[k]);
        }
    }
    qsort(rows, n, sizeof rows[0], by_minutes_desc);
    printf("top_sessions:\n");
    for (size_t i = 0; i < n && i < 2; i++) {       // --top 2
        printf("%s,%s,%s,%u\n", rows[i].day, rows[i].language, rows[i].topic, rows[i].minutes);
    }
    return 0;
}
```

실행 결과:

```text
sessions: 4
total_minutes: 130
average_minutes: 32.50
min_minutes: 25
max_minutes: 45
language_totals:
C,45
Python,60
Rust,25
top_sessions:
2026-10-02,C,배열, 포인터,45
2026-10-01,Python,변수,30
```

### 코드 한 부분씩 읽기

| 코드                                                      | 설명                                                                                                                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `return a->minutes < b->minutes ? 1 : -1;`                | 분 내림차순입니다. `b->minutes - a->minutes`처럼 빼면 `unsigned`라 음수가 되지 않아 틀립니다. 부호 없는 값은 반드시 비교로 쓰세요.  |
| `c = strcmp(a->day, b->day); if (c == 0) c = strcmp(...)` | 동점이면 다음 기준으로 넘어갑니다. Python 튜플 열쇠의 C 버전입니다.                                                                 |
| `const char *langs[] = {"C", "Python", "Rust"};`          | 언어가 세 개로 정해져 있어서 이름 순으로 적어 둔 표를 씁니다. 주제처럼 미리 모르는 무리는 Day 88에서 늘어나는 그룹 배열로 모읍니다. |
| `unsigned long long total`                                | 기록이 많으면 `unsigned`의 합이 넘칠 수 있어 더 큰 자료형을 씁니다. 실제 프로젝트도 같습니다.                                       |
| `n ? (double)total / n : 0.0`                             | 빈 결과를 먼저 처리합니다. `(double)`로 바꾸지 않으면 정수 나눗셈이라 32가 됩니다.                                                  |
| `for (size_t i = 0; i < n && i < 2; i++)`                 | Top N입니다. 두 조건으로 기록이 N보다 적어도 배열 밖을 읽지 않습니다.                                                               |

## 7. Rust로 구현하기

```rust
// 파일: aggregate.rs
use std::collections::BTreeMap;

struct Session {
    day: &'static str,
    language: &'static str,
    topic: &'static str,
    minutes: u32,
}

fn main() {
    let mut rows = vec![
        Session { day: "2026-10-01", language: "Python", topic: "변수", minutes: 30 },
        Session { day: "2026-10-02", language: "C", topic: "배열, 포인터", minutes: 45 },
        Session { day: "2026-10-03", language: "Rust", topic: "소유권", minutes: 25 },
        Session { day: "2026-10-04", language: "Python", topic: "변수", minutes: 30 },
    ];
    let total: u64 = rows.iter().map(|r| u64::from(r.minutes)).sum();
    let min = rows.iter().map(|r| r.minutes).min().unwrap_or(0);
    let max = rows.iter().map(|r| r.minutes).max().unwrap_or(0);
    let avg = if rows.is_empty() { 0.0 } else { total as f64 / rows.len() as f64 };
    println!("sessions: {}\ntotal_minutes: {total}\naverage_minutes: {avg:.2}\nmin_minutes: {min}\nmax_minutes: {max}", rows.len());

    let mut by_topic: BTreeMap<&str, u64> = BTreeMap::new();     // 열쇠 순서로 정렬되는 사전
    for r in &rows {
        *by_topic.entry(r.topic).or_default() += u64::from(r.minutes);
    }
    println!("topic_totals:");
    for (topic, m) in &by_topic {
        println!("{topic},{m}");
    }

    rows.sort_by(|a, b| b.minutes.cmp(&a.minutes).then_with(|| (a.day, a.language, a.topic).cmp(&(b.day, b.language, b.topic))));
    println!("top_sessions:");
    for r in rows.iter().take(2) {
        println!("{},{},{},{}", r.day, r.language, r.topic, r.minutes);
    }
}
```

실행 결과:

```text
sessions: 4
total_minutes: 130
average_minutes: 32.50
min_minutes: 25
max_minutes: 45
topic_totals:
배열, 포인터,45
변수,60
소유권,25
top_sessions:
2026-10-02,C,배열, 포인터,45
2026-10-01,Python,변수,30
```

### 코드 한 부분씩 읽기

| 코드                                                                                                        | 설명                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `rows.iter().map(\|r\| u64::from(r.minutes)).sum()`                                                         | 더하기 전에 `u64`로 넓혀 넘치지 않게 합니다. `u64::from`은 잃는 것이 없는 변환이라 `as`보다 안전합니다.                      |
| `.min().unwrap_or(0)`                                                                                       | 빈 반복자의 `min`은 `None`입니다. Python의 `default=0`에 해당합니다.                                                         |
| `{avg:.2}`                                                                                                  | 소수 둘째 자리입니다. 세 언어 모두 가장 가까운 값으로 반올림합니다.                                                          |
| `BTreeMap<&str, u64>` / `*by_topic.entry(r.topic).or_default() += ...`                                      | 한 번 훑으며 모으고, 열쇠 순서로 저절로 정렬됩니다. Rust의 `&str` 순서는 UTF-8 바이트 순서인데, 코드 포인트 순서와 같습니다. |
| `b.minutes.cmp(&a.minutes).then_with(\|\| (a.day, a.language, a.topic).cmp(&(b.day, b.language, b.topic)))` | 분은 `b`와 `a`를 바꿔 내림차순, 나머지는 튜플 비교로 오름차순입니다. `then_with`는 앞이 같을 때만 뒤를 계산합니다.           |
| `rows.iter().take(2)`                                                                                       | 앞의 두 개만 꺼냅니다. 기록이 두 개보다 적으면 있는 만큼입니다.                                                              |

## 8. 실행 추적

기본 정렬에서 30분 두 기록의 순서가 어떻게 정해지는지, 세 언어에서 따라가 봅니다.

| 비교 | Python 열쇠                   | C 비교 함수             | Rust `sort_by`                   | 결과         |
| ---- | ----------------------------- | ----------------------- | -------------------------------- | ------------ |
| 분   | `-30 == -30`                  | `30 == 30`이라 다음으로 | `30.cmp(&30)` = `Equal`          | 동점         |
| 날짜 | `"2026-10-01" < "2026-10-04"` | `strcmp < 0`            | `then_with`에서 날짜 비교 `Less` | 10-01이 먼저 |

세 구현이 **같은 기준을 같은 순서로** 비교하기 때문에 순서가 같아집니다. 날짜까지 같으면 언어, 그다음 주제로 넘어갑니다.

## 9. 다른 예제로 다시 이해하기

**한 번 훑는 집계와 막대 그래프.** 합계를 `defaultdict`로 한 번만 훑어 구하고, 전과 같은 결과인지 확인합니다. 그다음 Python 구현의 선택 확장인 `--chart`처럼 언어별 합계를 `#` 막대로 그립니다(10분에 하나, 올림, 최대 40개).

```python
# 파일: chart.py
from collections import defaultdict

ROWS = [("Python", "변수", 30), ("C", "배열, 포인터", 45), ("Rust", "소유권", 25),
        ("Python", "변수", 30), ("C", "포인터 연산", 95), ("Rust", "빌림", 400)]


def totals_slow(rows, index):               # 열쇠마다 전체를 다시 훑는다: 열쇠 수 × 줄 수
    keys = sorted({r[index] for r in rows})
    return {k: sum(r[2] for r in rows if r[index] == k) for k in keys}


def totals_fast(rows, index):               # 한 번만 훑는다: 줄 수
    acc = defaultdict(int)
    for r in rows:
        acc[r[index]] += r[2]
    return dict(sorted(acc.items()))


by_lang = totals_fast(ROWS, 0)
print("두 방법이 같은가?", by_lang == totals_slow(ROWS, 0), totals_fast(ROWS, 1) == totals_slow(ROWS, 1))
print("ascii_chart:")
for lang, minutes in by_lang.items():
    bar = "#" * min(40, (minutes + 9) // 10)   # 10분에 # 하나(올림), 최대 40개
    print(f"{lang}: {bar} {minutes}")
```

실행 결과:

```text
두 방법이 같은가? True True
ascii_chart:
C: ############## 140
Python: ###### 60
Rust: ######################################## 425
```

| 코드                                               | 설명                                                                                            |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `acc = defaultdict(int)` / `acc[r[index]] += r[2]` | 없는 열쇠는 `int()` = 0에서 시작합니다. Rust의 `entry().or_default()`와 같습니다.               |
| `dict(sorted(acc.items()))`                        | 열쇠 순서로 정렬한 새 사전을 만듭니다. 비교 결과가 `totals_slow`와 같아야 합니다.               |
| `totals_fast(...) == totals_slow(...)`             | 최적화 전후의 결과가 같은지 확인하는 시험입니다.                                                |
| `min(40, (minutes + 9) // 10)`                     | 10분 단위 올림(145분 → 15개)과 최대 40개 제한입니다. 425분은 43개가 필요하지만 40개로 잘립니다. |

Rust에서는 올림 나눗셈에 `div_ceil`이 있고, `"#".repeat(n)`으로 막대를 만듭니다.

```rust
// 파일: chart.rs
use std::collections::BTreeMap;

fn main() {
    let rows = [("Python", 30u32), ("C", 45), ("Rust", 25), ("Python", 30), ("C", 95), ("Rust", 400)];
    let mut by_lang: BTreeMap<&str, u32> = BTreeMap::new();
    for (lang, m) in rows {
        *by_lang.entry(lang).or_default() += m;
    }
    println!("ascii_chart:");
    for (lang, minutes) in &by_lang {
        let bars = minutes.div_ceil(10).min(40) as usize;   // (m + 9) / 10과 같은 올림 나눗셈
        println!("{lang}: {} {minutes}", "#".repeat(bars));
    }
}
```

실행 결과:

```text
ascii_chart:
C: ############## 140
Python: ###### 60
Rust: ######################################## 425
```

- `minutes.div_ceil(10)`은 `(minutes + 9) / 10`과 같은 올림 나눗셈입니다. 이름이 뜻을 드러내서 실수가 적습니다.
- `.min(40) as usize`로 최대값을 정한 뒤 `repeat`의 인자 자료형으로 바꿨습니다.
- 실제 프로젝트에서 이 그래프는 Python 구현에만 있는 **선택 확장**입니다. 세 구현의 비교(Day 91)는 공통 출력만 비교하므로, 확장은 공통 출력 **뒤에** 붙여 비교를 깨뜨리지 않게 했습니다.

## 10. 집계 대응표

| 하고 싶은 일     | Python                                | C                                         | Rust                                       |
| ---------------- | ------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| 선택적 거르기    | `(opt is None or r.x == opt)`         | `if (opt && strcmp(opt, r->x)) continue;` | `opt.as_ref().is_none_or(\|s\| s == &r.x)` |
| 합계             | `sum(...)`                            | 반복하며 `total +=`                       | `.map(u64::from).sum()`                    |
| 빈 결과의 최솟값 | `min(..., default=0)`                 | `used ? min : 0`                          | `.min().unwrap_or(0)`                      |
| 평균 형식        | `f"{x:.2f}"`                          | `"%.2f"`                                  | `{x:.2}`                                   |
| 무리별 합계      | `sorted(set)` + `sum` / `defaultdict` | 그룹 배열 + `qsort`(Day 88)               | `BTreeMap` + `entry`                       |
| 여러 기준 정렬   | 튜플 열쇠, 음수로 내림차순            | 비교 함수에서 기준마다 `strcmp`           | `cmp().then_with()`                        |
| 앞의 N개         | `[:top]`                              | `i < used && i < top`                     | `.take(top)`                               |

## 11. 세 언어 비교

| 관점              | Python                    | C                                   | Rust                                   |
| ----------------- | ------------------------- | ----------------------------------- | -------------------------------------- |
| 정렬 기준 적기    | 열쇠 함수(튜플)           | 비교 함수(-1/0/1)                   | 비교 함수(`Ordering`) 또는 열쇠        |
| 안정 정렬         | 예                        | 아니요(`qsort`)                     | 예(`sort`), 아니요(`sort_unstable`)    |
| 정렬된 사전       | 없음(`sorted`로)          | 없음(직접)                          | `BTreeMap`                             |
| 합의 넘침         | 없음(정수 크기 제한 없음) | 자료형을 크게(`unsigned long long`) | `u64`로 넓히기(넘치면 디버그에서 패닉) |
| 부호 없는 수 빼기 | 해당 없음                 | 음수가 안 되어 비교 함수가 틀림     | 디버그에서 패닉                        |

## 12. 자주 하는 실수

### 실수 1: reverse=True로 한 기준만 뒤집으려 한다

실습의 예측 문제처럼 모든 기준이 뒤집힙니다. 숫자 기준만 음수로 바꾸세요.

### 실수 2: 빈 결과를 처리하지 않는다

실습의 디버그 문제입니다. `--search`로 아무것도 찾지 못하는 것은 흔한 입력이라 계약이 0을 정해 두었습니다.

### 실수 3: C 비교 함수에서 부호 없는 값을 뺀다

`return b->minutes - a->minutes;`는 `unsigned`라 결과가 음수가 되지 않고, `int`로 바뀌며 이상한 값이 됩니다. `<`, `>`로 비교해 -1, 0, 1을 돌려주세요.

### 실수 4: 해시 사전의 순서를 그대로 출력한다

Rust `HashMap`, C의 해시 테이블은 순서가 정해져 있지 않습니다. 계약의 순서(이름 순)대로 정렬하거나 `BTreeMap`을 쓰세요.

### 실수 5: 출력할 때 CSV 따옴표를 다시 붙인다

계약의 출력은 `2026-10-02,C,배열, 포인터,45,retry`처럼 따옴표 없이 씁니다. 한 구현만 `csv.writer`로 출력해 `"배열, 포인터"`처럼 따옴표를 붙이면 세 결과가 달라집니다. 출력 모양도 계약입니다.

## 13. Q&A

**Q. 평균의 반올림은 세 언어가 정말 같나요?**

A. 세 언어 모두 실수를 "가장 가까운 소수 둘째 자리"로 반올림해 출력하지만, 실수는 2진수로 저장되어 32.125처럼 딱 중간인 값이 정확히 표현되지 않는 경우가 있습니다. 대부분은 같은 결과가 나오고, 이 프로젝트의 fixture는 비교 스크립트로 같은 결과를 확인합니다. 돈처럼 정확해야 하는 값은 정수(원, 분 단위)로 계산하고 마지막에만 나눕니다.

**Q. 정렬을 두 번 하는 방법은 무엇인가요?**

A. 안정 정렬에서는 **덜 중요한 기준으로 먼저** 정렬한 뒤, 더 중요한 기준으로 다시 정렬하면 여러 기준 정렬이 됩니다. `rows.sort(key=주제); rows.sort(key=분, reverse=True)`처럼 숫자가 아닌 기준을 내림차순으로 할 때 씁니다.

**Q. Top N만 필요하면 전체를 정렬하지 않아도 되지 않나요?**

A. 맞습니다. 힙(Day 76)을 쓰면 N개만 유지하며 한 번 훑어 구할 수 있습니다(`heapq.nsmallest(top, rows, key=...)`). 이 프로젝트는 기록이 많지 않아 전체 정렬로도 충분하고, 세 구현의 동점 처리를 맞추기 쉽습니다.

**Q. 주제 이름의 순서는 사전 순서인가요?**

A. 코드 포인트(문자 번호) 순서입니다. 한글 음절은 가나다 순으로 번호가 매겨져 있어 대체로 사전 순서와 같지만, 영문 대문자가 소문자보다 앞에 오는 등 사람의 사전과 다른 점이 있습니다(Day 49). 세 언어가 같은 순서를 쓰려면 바이트나 코드 포인트 순서처럼 단순한 규칙이 좋습니다.

## 14. 핵심 요약

- 선택적 거르기는 `(opt is None or 조건)`을 `and`로 이어 한 식으로 씁니다. 검색은 양쪽을 `casefold()`로 맞춥니다.
- 통계는 빈 결과에서도 계약대로 0을 냅니다. `min`/`max`의 `default`, 평균은 조건식으로 0으로 나누기를 피합니다.
- 무리별 합계는 이름 순으로 출력하고, 한 번 훑는 `defaultdict`/`BTreeMap`이 빠릅니다. 최적화 전후의 결과가 같은지 시험합니다.
- 여러 기준 정렬은 튜플 열쇠로, 숫자 기준만 내림차순은 음수로 만듭니다. 모든 기준을 열쇠에 넣어 동점을 없애면 정렬 알고리즘의 차이와 상관없이 세 구현의 순서가 같아집니다.
- C는 비교 함수에서 부호 없는 값을 빼지 말고 비교로, Rust는 `cmp().then_with()`로 씁니다.

## 15. 도전 문제

1. **(Python)** `report`에 `--result pass` 거르기를 추가하세요. 계약에 먼저 적고, 세 구현 모두에 넣어야 하는 기능이라는 점을 생각해 보세요.
2. **(Python)** 주제별 합계에 기록 수도 함께 출력하는 `topic_counts:` 절을 만들고, `Counter`로 구현해 보세요.
3. **(C)** 오늘 C 예제의 비교 함수를 `--sort date`용 비교 함수와 함께 두고, 전역 변수 대신 함수 포인터로 둘 중 하나를 골라 `qsort`에 넘기세요.
4. **(Rust)** `top_sessions`를 전체 정렬 대신 `BinaryHeap`으로 N개만 유지해 구하고, 결과가 전체 정렬과 같은지 확인하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `report`는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.py`에 있는 함수와 같습니다. `--chart` 옵션을 켜고 fixture로 실행해 막대 그래프가 공통 출력 뒤에 붙는지 확인해 보세요.
