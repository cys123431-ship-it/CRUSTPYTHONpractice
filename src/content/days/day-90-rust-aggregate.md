---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-90-rust-aggregate
courseId: crp-92
phaseId: phase-08
dayNumber: 90
date: "2026-12-29"
title: Rust iterator 집계와 정렬
summary: Study Log Analyzer의 Rust 구현에서 보고서 부분을 반복자(iterator)로 만듭니다. filter와 Option::is_none_or로 선택적 거르기를 잇고, collect 전까지 아무 일도 하지 않는 게으른 계산, 복사 없이 원본을 빌린 Vec<&Session>, map·sum·min·max·unwrap_or로 통계, BTreeMap과 entry로 무리별 합계, 튜플 비교와 then_with로 방향이 섞인 정렬, take로 앞의 N개, fmt::Write와 writeln!으로 String에 보고서 쓰기를 다룹니다. Python의 생성기·islice·groupby(먼저 정렬해야 하는 이유), C의 함수 포인터 조건과 주소 배열로 같은 흐름을 비교하고, fold 하나로 언어별 개수·합계·평균·최댓값을 한 번에 구하는 통계를 Rust와 Python으로 만들어 봅니다.
anchorLanguage: rust
transferLanguages: [python, c]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-89-rust-record-parse]
learningObjectives:
  - filter·map·sum·min·max·take를 이어 보고서를 계산하고, 반복자가 게으르게 동작한다는 것을 설명한다.
  - Option::is_none_or로 선택적 거르기를 쓰고, Vec<&T>로 복사 없이 고른 기록을 모은다.
  - BTreeMap과 entry로 무리별 합계를, sort_by와 then_with로 여러 기준 정렬을 만든다.
  - fmt::Write와 writeln!으로 String에 보고서를 쓰고, fold로 여러 통계를 한 번에 모은다.
  - Python 생성기·groupby, C 함수 포인터 조건과 비교해 같은 흐름을 옮긴다.
concepts:
  [
    iterator,
    lazy evaluation,
    adapter,
    consumer,
    filter,
    map,
    sum,
    min,
    max,
    take,
    collect,
    is none or,
    vec of references,
    btreemap,
    entry api,
    sort by,
    then with,
    tuple ordering,
    fmt write,
    writeln,
    fold,
    inspect,
    generator,
    islice,
    groupby,
    function pointer predicate,
  ]
runnerMode: python
playgroundSource: |
  # 파일: lazy_play.py — 생성기는 필요할 때만 계산합니다.
  from itertools import islice
  def noisy(x):
      print("계산", x)
      return x * 2
  gen = (noisy(x) for x in range(1, 100))
  print("아직 계산 안 함")
  print(list(islice(gen, 3)))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day90-predict-lazy
    title: 게으른 map 예측하기
    kind: predict
    objective: map 클로저가 소비(sum)할 때 실행된다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let mut log = Vec::new();
          let it = [1, 2, 3].iter().map(|x| {
              log.push(*x);
              x * 2
          });
          let s: i32 = it.sum();
          println!("{} {:?}", s, log);
      }
    answer: "12 [1, 2, 3]"
    hint: "map은 반복자를 만들기만 합니다. sum이 원소를 하나씩 당겨 올 때 클로저가 실행됩니다."
    explanation: "let it = ...map(...)까지는 아무것도 계산하지 않습니다(게으른 계산). sum이 1, 2, 3을 차례로 당겨 오며 클로저가 log에 기록하고 2 + 4 + 6 = 12를 만듭니다. 클로저가 log를 가변으로 빌리고 있어서, sum이 끝나 it이 사라지기 전에는 log를 읽을 수 없습니다(Day 33). 소비자(sum, collect, count 등)가 없으면 반복자는 아무 일도 하지 않고, 컴파일러가 경고합니다."
    commonMistakes:
      - "log가 비어 있다고 생각함"
      - "map을 만드는 순간 클로저가 실행된다고 생각함"
    language: rust
    verification: run
  - id: ex-day90-predict-take
    title: 끝없는 범위와 take 예측하기
    kind: predict
    objective: take가 필요한 만큼만 당겨 오기 때문에 끝없는 반복자도 쓸 수 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          println!("{:?}", (1..).filter(|x| x % 7 == 0).take(3).collect::<Vec<u32>>());
      }
    answer: "[7, 14, 21]"
    hint: "(1..)은 끝이 없는 범위지만, take(3)이 세 개를 받으면 더 당기지 않습니다."
    explanation: "반복자는 소비자가 원할 때만 한 칸씩 계산하므로, 끝없는 범위에서도 21까지만 확인하고 멈춥니다. Python의 islice(count(1), ...)와 같은 생각입니다. 보고서의 selected.iter().take(opts.top)도 앞의 N개만 꺼냅니다(정렬은 전체를 해야 하지만)."
    commonMistakes:
      - "끝없는 범위라 멈추지 않는다고 생각함"
      - "7의 배수가 아니라 1~3이 나온다고 생각함"
    language: rust
    verification: run
  - id: ex-day90-fill
    title: 선택적 거르기 채우기
    kind: fill
    objective: Option이 None이거나 조건을 만족하면 참인 메서드를 쓴다.
    prompt: '빈칸을 채워 옵션이 Some("Python")이면 Python만, None이면 전부 통과시켜 ''["Python", "Python"] 3''이 출력되게 하세요.'
    starter: |-
      fn main() {
          let langs = ["Python", "C", "Python"];
          let opt: Option<&str> = Some("Python");
          let picked: Vec<&str> = langs.iter().copied().filter(|l| opt._____(|o| o == *l)).collect();
          let none: Option<&str> = None;
          let all = langs.iter().copied().filter(|l| none.is_none_or(|o| o == *l)).count();
          println!("{:?} {}", picked, all);
      }
    answer: |-
      fn main() {
          let langs = ["Python", "C", "Python"];
          let opt: Option<&str> = Some("Python");
          let picked: Vec<&str> = langs.iter().copied().filter(|l| opt.is_none_or(|o| o == *l)).collect();
          let none: Option<&str> = None;
          let all = langs.iter().copied().filter(|l| none.is_none_or(|o| o == *l)).count();
          println!("{:?} {}", picked, all);
      }
    output: '["Python", "Python"] 3'
    hint: "아래 줄에 같은 메서드가 이미 쓰여 있습니다. '없거나(None) 또는 조건'이라는 뜻의 이름입니다."
    explanation: "is_none_or(조건)은 None이면 true, Some(x)면 조건(x)입니다. Python의 (opt is None or 조건)을 한 메서드로 쓴 것입니다(Day 86). 실제 프로젝트는 opts.language.as_ref().is_none_or(|s| s == &r.language)처럼 Option<String>을 as_ref()로 빌려서 씁니다."
    commonMistakes:
      - "is_some_and를 써서 None일 때 모두 걸러짐"
      - "unwrap으로 꺼내 None일 때 패닉함"
    language: rust
    verification: run
  - id: ex-day90-modify
    title: for 누적을 반복자 연결로 바꾸기
    kind: modify
    objective: 가변 변수에 누적하는 반복문을 filter·map·sum으로 바꾼다.
    prompt: "1부터 6까지 짝수의 제곱 합을 for와 가변 변수로 구합니다. filter, map, sum을 이어 한 식으로 바꿔 같은 결과 '56'이 출력되게 하세요."
    starter: |-
      fn main() {
          let mut total = 0;
          for x in 1..=6 {
              if x % 2 == 0 {
                  total += x * x;
              }
          }
          println!("{total}");
      }
    answer: |-
      fn main() {
          let total: i32 = (1..=6).filter(|x| x % 2 == 0).map(|x| x * x).sum();
          println!("{total}");
      }
    output: "56"
    starterOutput: "56"
    hint: "if는 filter, 제곱은 map, 더하기는 sum입니다."
    explanation: "4 + 16 + 36 = 56입니다. 반복자 연결은 '무엇을 할지'를 단계별로 이름 붙여 보여 주고, 가변 변수가 없어 실수로 다른 곳에서 total을 바꿀 걱정이 없습니다. 속도는 for 반복과 같습니다(컴파일러가 하나의 반복으로 합칩니다). sum의 결과 자료형은 적어 줘야 해서 let total: i32로 썼습니다."
    commonMistakes:
      - "map과 filter 순서를 바꿔 제곱이 짝수인지 검사하게 됨(결과는 같지만 뜻이 다름)"
      - "sum의 자료형을 적지 않아 추론 오류가 남"
    language: rust
    verification: run
  - id: ex-day90-debug
    title: 방향이 거꾸로인 정렬 고치기
    kind: debug
    objective: sort_by에서 인자 순서를 바꿔 내림차순으로 만든다.
    prompt: "이 코드는 분을 오름차순으로 정렬해 '[25, 30, 45]'가 됩니다. 계약(분 내림차순)에 맞게 고쳐 '[45, 30, 25]'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut m = vec![30, 45, 25];
          m.sort_by(|a, b| a.cmp(b));
          println!("{m:?}");
      }
    answer: |-
      fn main() {
          let mut m = vec![30, 45, 25];
          m.sort_by(|a, b| b.cmp(a));
          println!("{m:?}");
      }
    output: "[45, 30, 25]"
    starterOutput: "[25, 30, 45]"
    hint: "a.cmp(b)는 오름차순입니다. 두 쪽을 바꾸면 방향이 뒤집힙니다."
    explanation: "b.cmp(a)는 큰 것이 먼저입니다. 보고서의 정렬은 b.minutes.cmp(&a.minutes).then_with(|| (날짜, 언어, 주제) 오름차순)처럼 첫 기준만 뒤집고 나머지는 그대로 둡니다. m.sort(); m.reverse();로도 내림차순이 되지만, 동점 기준까지 뒤집혀서 계약과 달라집니다. 뒤집을 기준만 골라 뒤집는 것이 중요합니다(Day 86)."
    commonMistakes:
      - "sort 뒤에 reverse를 써서 여러 기준 정렬에서 동점 순서까지 뒤집힘"
      - "a.cmp(b).reverse()와 b.cmp(a)가 다르다고 생각함(같음)"
    language: rust
    verification: run
  - id: ex-day90-independent
    title: Python groupby로 개수 세기
    kind: independent
    objective: 정렬한 뒤 groupby로 같은 값끼리 묶어 센다.
    prompt: 'langs = ["Python", "C", "Python"]을 groupby로 묶어 ''C 1, Python 2''를 출력하세요.'
    starter: |-
      langs = ["Python", "C", "Python"]
      print(langs)
    answer: |-
      from itertools import groupby

      langs = ["Python", "C", "Python"]
      print(", ".join(f"{k} {len(list(g))}" for k, g in groupby(sorted(langs))))
    output: "C 1, Python 2"
    hint: "groupby는 이웃한 같은 값만 묶습니다. 먼저 정렬하세요."
    explanation: "정렬하지 않으면 Python, C, Python이 세 무리로 나뉩니다(오늘 Python 예제의 마지막 줄). 정렬하면 같은 값이 이웃해 한 무리가 되고, 이름 순서로 나옵니다. 개수만 필요하면 Counter가 더 간단하지만, groupby는 정렬된 큰 데이터를 메모리에 다 올리지 않고 묶을 때 좋습니다. SQL의 GROUP BY와 비슷한 생각입니다."
    commonMistakes:
      - "sorted를 빠뜨려 Python이 두 번 나옴"
      - "len(g)로 써서 반복자에 len이 없다는 오류가 남"
    language: python
    verification: run
quiz:
  - id: quiz-day90-01
    question: Rust 반복자가 '게으르다'는 뜻은?
    choices:
      - 느리다
      - filter·map 같은 어댑터는 반복자를 만들기만 하고, sum·collect 같은 소비자가 원소를 당길 때 계산한다
      - 한 번에 모든 원소를 계산한다
      - 병렬로 계산한다
    answerIndex: 1
    explanation: 그래서 take(3)을 붙이면 세 개만 계산하고, 소비자가 없으면 아무 일도 하지 않습니다(unused Map 경고). Python의 생성기와 같은 원리이고, 리스트 컴프리헨션은 곧바로 모두 계산한다는 점이 다릅니다.
  - id: quiz-day90-02
    question: 고른 기록을 Vec<Session>이 아니라 Vec<&Session>으로 모으는 장점은?
    choices:
      - 기록을 바꿀 수 있다
      - 복사 없이 원본을 빌려서, 정렬해도 원본 목록은 그대로이고 비용이 적다
      - 수명이 길어진다
      - 차이가 없다
    answerIndex: 1
    explanation: 참조만 모아 정렬하면 String 필드를 복사하지 않습니다. 대신 원본 sessions가 살아 있는 동안만 쓸 수 있습니다(Day 45). 실제 프로젝트는 sessions를 into_iter()로 옮겨 받아 Vec<Session>을 만드는데, 보고서를 만든 뒤 원본이 필요 없기 때문입니다.
  - id: quiz-day90-03
    question: (a.date, a.language).cmp(&(b.date, b.language))가 하는 일은?
    choices:
      - 날짜만 비교한다
      - 튜플을 앞에서부터 비교해, 날짜가 같으면 언어로 비교한다
      - 언어만 비교한다
      - 오류
    answerIndex: 1
    explanation: 튜플은 Ord를 구현해서 사전식(앞부터)으로 비교합니다. Python의 튜플 열쇠와 같습니다. 방향이 섞인 정렬은 첫 기준만 b.cmp(a)로 뒤집고 then_with로 나머지 튜플을 이어 붙입니다.
  - id: quiz-day90-04
    question: String에 writeln!(out, "...")을 쓰려면 필요한 것은?
    choices:
      - 아무것도 필요 없다
      - use std::fmt::Write; (String이 fmt::Write를 구현한다는 것을 가져옴)
      - use std::io::Write;
      - out이 파일이어야 한다
    answerIndex: 1
    explanation: writeln!은 Write trait의 메서드를 부르는 매크로입니다. 파일에는 io::Write(Day 46), String에는 fmt::Write입니다. String에 쓰는 것은 실패하지 않지만 Result를 돌려주므로 unwrap()으로 받았습니다. format!을 여러 번 push_str해도 같은 결과입니다.
  - id: quiz-day90-05
    question: itertools.groupby를 정렬하지 않은 목록에 쓰면?
    choices:
      - 오류가 난다
      - 이웃한 같은 값끼리만 묶어서, 같은 값이 떨어져 있으면 여러 무리로 나온다
      - 알아서 정렬한다
      - 한 무리로 묶는다
    answerIndex: 1
    explanation: groupby는 한 번 훑으며 값이 바뀌는 곳에서 무리를 나눕니다. 전체를 기억하지 않아 메모리를 적게 쓰는 대신, 같은 값이 이웃해 있어야 합니다. 사전(BTreeMap, defaultdict)은 순서와 상관없이 묶습니다.
---

## 1. 오늘 배울 내용

Day 86(Python)과 Day 88(C)에서 보고서를 만들었습니다. 오늘은 **Rust**로 만듭니다. Rust에서는 목록을 다루는 일을 **반복자**(iterator)를 이어 붙여 씁니다. 반복자는 Day 17부터 `for`와 함께 써 왔지만, 오늘은 그 원리를 보고서 전체에 적용합니다.

1. 반복자의 두 종류
   - **어댑터**: `filter`, `map`, `take`, `inspect` — 새 반복자를 만들기만 함
   - **소비자**: `collect`, `sum`, `min`, `max`, `count`, `fold` — 실제로 원소를 당겨 계산
   - 소비자가 부를 때만 계산하는 **게으른 계산**
2. 선택적 거르기: `Option::is_none_or`
3. 복사 없이 고르기: `Vec<&Session>`
4. 통계와 무리별 합계: `map`·`sum`·`min`·`max`·`unwrap_or`, `BTreeMap`과 `entry`
5. 정렬: 튜플 비교, `b.cmp(a)`, `then_with`, 앞의 N개 `take`
6. `String`에 보고서 쓰기: `fmt::Write`와 `writeln!`
7. 다른 언어의 같은 흐름
   - Python: 생성기, `islice`, `groupby`(먼저 정렬해야 하는 이유)
   - C: 함수 포인터 조건과 주소 배열
8. `fold` 하나로 언어별 개수·합계·평균·최댓값을 한 번에 구합니다.

## 2. 왜 필요한가

보고서는 "거르고 → 모으고 → 정렬하고 → 앞의 몇 개"라는 **흐름**입니다. 반복문과 가변 변수로 쓰면 각 단계가 뒤섞여, 어디서 무엇을 하는지 읽기 어렵습니다.

반복자를 이어 쓰면 단계마다 이름이 붙습니다.

```rust
sessions.iter().filter(언어 조건).filter(검색 조건).collect()
```

- 읽는 사람이 흐름을 그대로 따라갈 수 있습니다.
- 가변 변수가 줄어 실수할 곳이 적습니다.
- 게으른 계산 덕분에 필요한 만큼만 계산하고, 속도는 손으로 쓴 반복문과 같습니다.

Python의 컴프리헨션·생성기, SQL의 `WHERE`·`GROUP BY`·`ORDER BY`·`LIMIT`가 모두 같은 생각입니다.

## 3. 그림으로 이해하기

**보고서의 반복자 흐름.**

```text
sessions.iter()                    &Session을 하나씩 주는 반복자
  .filter(언어가 맞거나 옵션 없음)
  .filter(검색어가 들었거나 옵션 없음)
  .collect()  ───────────────────▶ selected: Vec<&Session>   ← 여기서 처음으로 실제로 돈다
      │
      ├─ .iter().map(minutes).sum()          → total
      ├─ .iter().map(minutes).min().unwrap_or(0)
      ├─ for r in &selected { entry(...) += } → BTreeMap(언어별, 주제별)
      └─ sort_by(...) → .iter().take(top)    → top_sessions
```

**게으른 계산.** 소비자가 한 칸씩 당깁니다.

```text
(1..).filter(7의 배수).take(3).collect()

collect: "하나 줘" → take: "하나 줘" → filter: 1? 아님, 2? ... 7! → 7
collect: "하나 줘" → ... 14
collect: "하나 줘" → ... 21
collect: "하나 줘" → take: "이미 셋 줬음, 끝"      ← 22 이후는 보지도 않는다
```

**groupby는 이웃한 것만 묶는다.**

```text
정렬 전: Python  C  Rust  Python   → [Python] [C] [Rust] [Python]   네 무리
정렬 후: C  Python  Python  Rust   → [C] [Python, Python] [Rust]    세 무리
```

## 4. 천천히 풀어보기

### 4.1 어댑터와 소비자

| 어댑터(새 반복자)      | 하는 일                            | 소비자(결과)       | 하는 일                              |
| ---------------------- | ---------------------------------- | ------------------ | ------------------------------------ |
| `filter(조건)`         | 조건이 참인 것만                   | `collect()`        | 모음(`Vec`, `String`, `BTreeMap` 등) |
| `map(f)`               | 바꾸기                             | `sum()`, `count()` | 합, 개수                             |
| `take(n)`              | 앞의 n개                           | `min()`, `max()`   | `Option`으로 최솟값·최댓값           |
| `enumerate()`          | 번호 붙이기                        | `fold(시작, f)`    | 하나의 값으로 접기                   |
| `inspect(f)`           | 지나가는 원소를 들여다보기(디버깅) | `find(조건)`       | 처음 맞는 것(`Option`)               |
| `copied()`, `cloned()` | `&T`를 `T`로                       | `any`, `all`       | 하나라도 / 모두                      |

어댑터만 있고 소비자가 없으면 아무 일도 하지 않으며, 컴파일러가 `unused Map that must be used`처럼 경고합니다.

### 4.2 선택적 거르기

```rust
.filter(|r| opts.language.as_ref().is_none_or(|l| l == &r.language))
```

- `opts.language`는 `Option<String>`입니다. `as_ref()`로 `Option<&String>`을 만들어 옮기지 않고 빌립니다.
- `is_none_or(조건)`: `None`이면 `true`, `Some(l)`이면 `조건(l)`. Python의 `(opt is None or 조건)`입니다.

### 4.3 정렬

```rust
selected.sort_by(|a, b| b.minutes.cmp(&a.minutes)
    .then_with(|| (&a.date, &a.language, &a.topic).cmp(&(&b.date, &b.language, &b.topic))));
```

- 첫 기준(분)만 `b`와 `a`를 바꿔 내림차순입니다.
- `then_with`는 앞이 `Equal`일 때만 뒤를 계산합니다.
- 튜플은 앞부터 비교합니다(사전식). `&String`의 비교는 바이트 순서입니다.

### 4.4 String에 쓰기

`use std::fmt::Write;`를 하면 `writeln!(out, ...)`로 `String`에 쓸 수 있습니다. 파일에 쓰는 `writeln!`(Day 46)과 모양이 같아서, 나중에 `String` 대신 표준 출력이나 파일에 바로 쓰도록 바꾸기 쉽습니다. `String`에 쓰기는 실패하지 않지만 `Result`를 돌려주므로 `unwrap()`으로 받았습니다.

## 5. Rust로 구현하기

```rust
// 파일: rust_report.rs
use std::collections::BTreeMap;
use std::fmt::Write;

#[derive(Clone)]
struct Session {
    date: String,
    language: String,
    topic: String,
    minutes: u32,
    result: String,
}

#[derive(Default)]
struct Options {
    language: Option<String>,
    search: Option<String>,
    by_date: bool,
    top: usize,
}

fn session(date: &str, language: &str, topic: &str, minutes: u32, result: &str) -> Session {
    Session { date: date.into(), language: language.into(), topic: topic.into(), minutes, result: result.into() }
}

fn report(sessions: &[Session], opts: &Options) -> String {
    let mut selected: Vec<&Session> = sessions
        .iter()
        .filter(|r| opts.language.as_ref().is_none_or(|l| l == &r.language))   // 옵션이 없으면 통과
        .filter(|r| opts.search.as_ref().is_none_or(|s| r.topic.to_lowercase().contains(&s.to_lowercase())))
        .collect();                                                            // 여기서 처음으로 실제로 돈다

    let total: u64 = selected.iter().map(|r| u64::from(r.minutes)).sum();
    let min = selected.iter().map(|r| r.minutes).min().unwrap_or(0);
    let max = selected.iter().map(|r| r.minutes).max().unwrap_or(0);
    let avg = if selected.is_empty() { 0.0 } else { total as f64 / selected.len() as f64 };

    let mut languages: BTreeMap<&str, u64> = BTreeMap::new();
    let mut topics: BTreeMap<&str, u64> = BTreeMap::new();
    for r in &selected {
        *languages.entry(&r.language).or_default() += u64::from(r.minutes);
        *topics.entry(&r.topic).or_default() += u64::from(r.minutes);
    }

    let mut out = String::new();
    writeln!(out, "sessions: {}\ntotal_minutes: {total}\naverage_minutes: {avg:.2}", selected.len()).unwrap();
    writeln!(out, "min_minutes: {min}\nmax_minutes: {max}\nlanguage_totals:").unwrap();
    for (k, v) in &languages {
        writeln!(out, "{k},{v}").unwrap();
    }
    out.push_str("topic_totals:\n");
    for (k, v) in &topics {
        writeln!(out, "{k},{v}").unwrap();
    }
    out.push_str("top_sessions:\n");
    if opts.by_date {
        selected.sort_by(|a, b| (&a.date, &a.language, &a.topic, a.minutes).cmp(&(&b.date, &b.language, &b.topic, b.minutes)));
    } else {
        selected.sort_by(|a, b| b.minutes.cmp(&a.minutes).then_with(|| (&a.date, &a.language, &a.topic).cmp(&(&b.date, &b.language, &b.topic))));
    }
    for r in selected.iter().take(opts.top) {
        writeln!(out, "{},{},{},{},{}", r.date, r.language, r.topic, r.minutes, r.result).unwrap();
    }
    out
}

fn main() {
    let rows = vec![
        session("2026-10-01", "Python", "변수", 30, "pass"),
        session("2026-10-02", "C", "배열, 포인터", 45, "retry"),
        session("2026-10-03", "Rust", "소유권", 25, "pass"),
        session("2026-10-04", "Python", "변수", 30, "pass"),
    ];
    print!("== 기본 ==\n{}", report(&rows, &Options { top: 5, ..Default::default() }));
    let opts = Options { language: Some("Python".into()), by_date: true, top: 1, ..Default::default() };
    print!("== --language Python --sort date --top 1 ==\n{}", report(&rows, &opts));
    let opts = Options { search: Some("포인터".into()), top: 5, ..Default::default() };
    print!("== --search 포인터 ==\n{}", report(&rows, &opts));
}
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
== --search 포인터 ==
sessions: 1
total_minutes: 45
average_minutes: 45.00
min_minutes: 45
max_minutes: 45
language_totals:
C,45
topic_totals:
배열, 포인터,45
top_sessions:
2026-10-02,C,배열, 포인터,45,retry
```

### 코드 한 부분씩 읽기

| 코드                                                                                   | 설명                                                                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `#[derive(Default)] struct Options`                                                    | `Options { top: 5, ..Default::default() }`처럼 필요한 필드만 정합니다. 빠진 `Option`은 `None`, `bool`은 `false`입니다(Day 52). |
| `let mut selected: Vec<&Session> = sessions.iter().filter(...).filter(...).collect();` | 복사 없이 원본을 빌린 참조들을 모았습니다. `collect`의 결과 자료형은 변수에 적었습니다.                                        |
| `r.topic.to_lowercase().contains(&s.to_lowercase())`                                   | 대소문자를 무시한 포함 검색입니다. 한글은 대소문자가 없어 그대로 비교됩니다.                                                   |
| `selected.iter().map(\|r\| r.minutes).min().unwrap_or(0)`                              | 빈 결과면 `None`이라 0입니다(계약).                                                                                            |
| `*languages.entry(&r.language).or_default() += ...`                                    | 무리별 합계를 한 번 훑어 모읍니다. 열쇠는 원본을 빌린 `&str`이라 복사가 없습니다.                                              |
| `writeln!(out, "sessions: {}\ntotal_minutes: {total}...", ...)`                        | 여러 줄을 한 번에 씁니다. 형식 문자열 안에서 변수 이름을 바로 쓸 수 있습니다(`{total}`).                                       |
| `if opts.by_date { ... } else { ... }`                                                 | 정렬 방식에 따라 다른 비교 클로저를 씁니다. C처럼 `static` 변수가 필요 없습니다.                                               |
| `selected.iter().take(opts.top)`                                                       | 앞의 N개만 꺼냅니다. 기록이 N보다 적으면 있는 만큼입니다.                                                                      |

## 6. Python으로 구현하기

Python의 생성기도 게으르게 계산합니다. `groupby`로 무리를 묶을 때 주의할 점도 봅니다.

```python
# 파일: lazy_pipeline.py
from itertools import groupby, islice

rows = [("2026-10-01", "Python", "변수", 30), ("2026-10-02", "C", "배열, 포인터", 45),
        ("2026-10-03", "Rust", "소유권", 25), ("2026-10-04", "Python", "변수", 30)]

seen = []


def noisy(r):                               # 언제 실제로 처리되는지 보이게
    seen.append(r[0][-2:])
    return r


lazy = (noisy(r) for r in rows if r[3] >= 30)   # 생성기: 아직 아무것도 하지 않는다
print("만든 직후 처리한 줄:", seen)
first_two = list(islice(lazy, 2))            # 필요한 만큼만 당겨 온다
print("두 개만 꺼낸 뒤:", seen, [r[2] for r in first_two])

by_lang = sorted(rows, key=lambda r: r[1])  # groupby는 이웃한 같은 열쇠만 묶으므로 먼저 정렬
for lang, group in groupby(by_lang, key=lambda r: r[1]):
    items = list(group)
    print(f"{lang},{sum(r[3] for r in items)} ({len(items)}개)")

unsorted_groups = [k for k, _ in groupby(rows, key=lambda r: r[1])]
print("정렬 없이 groupby:", unsorted_groups)
```

실행 결과:

```text
만든 직후 처리한 줄: []
두 개만 꺼낸 뒤: ['01', '02'] ['변수', '배열, 포인터']
C,45 (1개)
Python,60 (2개)
Rust,25 (1개)
정렬 없이 groupby: ['Python', 'C', 'Rust', 'Python']
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lazy = (noisy(r) for r in rows if r[3] >= 30)` | 괄호로 감싼 생성기입니다. 만든 순간에는 `noisy`가 한 번도 불리지 않아 `seen`이 비어 있습니다. 대괄호(리스트 컴프리헨션)였다면 곧바로 모두 계산했습니다. |
| `list(islice(lazy, 2))`                         | 앞의 두 개만 당겨 옵니다. Rust의 `take(2)`입니다. 두 개를 얻자 멈춰서 셋째 줄부터는 아예 보지 않았습니다.                                               |
| `sorted(rows, key=lambda r: r[1])`              | `groupby`를 쓰기 전에 같은 열쇠끼리 이웃하도록 정렬합니다.                                                                                              |
| `groupby(by_lang, key=lambda r: r[1])`          | `(열쇠, 무리 반복자)`를 줍니다. 무리 반복자는 한 번만 돌 수 있어서 `list(group)`으로 받아 두 번 썼습니다.                                               |
| `groupby(rows, ...)`(정렬 안 함)                | 떨어져 있는 두 Python이 따로 묶였습니다. 무리별 합계를 틀리게 만드는 흔한 실수입니다.                                                                   |

## 7. C로 구현하기

C에는 반복자도 클로저도 없지만, **함수 포인터 + 인자**로 거르기 조건을 넘기고, **주소 배열**로 복사 없이 고를 수 있습니다.

```c
// 파일: c_callbacks.c
#include <stdio.h>
#include <string.h>

typedef struct {
    const char *date, *language, *topic;
    unsigned minutes;
} Session;

typedef int (*Predicate)(const Session *s, const void *arg);   // 거르기 조건(클로저 대신 함수 + 인자)

static int by_language(const Session *s, const void *arg) {
    return strcmp(s->language, (const char *)arg) == 0;
}

static int at_least(const Session *s, const void *arg) {
    return s->minutes >= *(const unsigned *)arg;
}

static size_t filter(const Session in[], size_t n, Predicate p, const void *arg, const Session *out[]) {
    size_t k = 0;
    for (size_t i = 0; i < n; i++) {
        if (p(&in[i], arg)) {
            out[k++] = &in[i];              // 복사 대신 주소만 모은다(Rust의 Vec<&Session>)
        }
    }
    return k;
}

static unsigned long long total(const Session *const rows[], size_t n) {
    unsigned long long t = 0;
    for (size_t i = 0; i < n; i++) {
        t += rows[i]->minutes;
    }
    return t;
}

int main(void) {
    Session rows[] = {
        {"2026-10-01", "Python", "변수", 30},
        {"2026-10-02", "C", "배열, 포인터", 45},
        {"2026-10-03", "Rust", "소유권", 25},
        {"2026-10-04", "Python", "변수", 30},
    };
    const Session *picked[4];
    size_t k = filter(rows, 4, by_language, "Python", picked);
    printf("Python: %zu개, 합 %llu\n", k, total(picked, k));
    unsigned limit = 30;
    k = filter(rows, 4, at_least, &limit, picked);
    printf("30분 이상: %zu개, 합 %llu, 첫 주제 %s\n", k, total(picked, k), picked[0]->topic);
    return 0;
}
```

실행 결과:

```text
Python: 2개, 합 60
30분 이상: 3개, 합 105, 첫 주제 변수
```

### 코드 한 부분씩 읽기

| 코드                                                           | 설명                                                                                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `typedef int (*Predicate)(const Session *s, const void *arg);` | 거르기 조건의 자료형입니다. 클로저가 바깥 변수를 붙잡는 대신, 필요한 값을 `void *arg`로 따로 넘깁니다(Day 54의 `qsort`와 같은 모양). |
| `strcmp(s->language, (const char *)arg) == 0`                  | `arg`를 원래 자료형으로 바꿔 씁니다. 잘못된 자료형을 넘겨도 컴파일러가 모릅니다.                                                     |
| `*(const unsigned *)arg`                                       | 정수 조건은 정수의 주소를 넘깁니다. 부르는 쪽이 `&limit`를 넘겼습니다.                                                               |
| `out[k++] = &in[i];`                                           | 복사 대신 주소를 모읍니다. Rust의 `Vec<&Session>`과 같고, 원본 `rows`가 살아 있는 동안만 유효합니다.                                 |
| `const Session *const rows[]`                                  | "주소들은 바꾸지 않고, 가리키는 기록도 바꾸지 않는다"는 약속입니다.                                                                  |

C의 `filter`는 **곧바로** 모두 계산합니다. 게으른 계산이 필요하면 "다음 원소를 주는 함수"를 직접 만들어야 합니다.

## 8. 실행 추적

오늘 실습의 Rust 반복자 `rows.iter().inspect(...).map(...).filter(|m| m >= 40).take(2).collect()`가 원소를 당기는 순서입니다.

| 당긴 원소    | `inspect` 기록 | `map` | `filter(>= 40)` | `take` 개수 | `collect` |
| ------------ | -------------- | ----- | --------------- | ----------- | --------- |
| (Python, 30) | Python         | 30    | 거짓(다음)      | 0           |           |
| (C, 45)      | Python, C      | 45    | 참              | 1           | [45]      |
| (Rust, 25)   | ..., Rust      | 25    | 거짓            | 1           |           |
| (Python, 30) | ..., Python    | 30    | 거짓            | 1           |           |
| (C, 95)      | ..., C         | 95    | 참              | 2(끝)       | [45, 95]  |
| (Rust, 40)   | **보지 않음**  |       |                 |             |           |

마지막 원소 `(Rust, 40)`은 조건에 맞지만, `take(2)`가 이미 두 개를 받아 더 당기지 않았습니다. 그래서 `inspect`의 기록이 다섯 개입니다.

## 9. 다른 예제로 다시 이해하기

**언어별 통계를 한 번에.** 개수, 합계, 평균, 최댓값을 따로따로 구하면 목록을 네 번 훑습니다. `fold`로 한 번만 훑으며 `Stats` 구조체에 모읍니다. 앞부분에서는 게으른 계산을 `inspect`로 확인합니다.

```rust
// 파일: lang_stats.rs
use std::collections::BTreeMap;

#[derive(Default, Debug)]
struct Stats {
    count: u32,
    total: u64,
    max: u32,
}

fn main() {
    let rows = [("Python", 30u32), ("C", 45), ("Rust", 25), ("Python", 30), ("C", 95), ("Rust", 40)];

    let mut touched = Vec::new();
    let big: Vec<u32> = rows
        .iter()
        .inspect(|(lang, _)| touched.push(*lang))   // 실제로 지나가는 원소를 기록
        .map(|&(_, m)| m)
        .filter(|&m| m >= 40)
        .take(2)                                  // 두 개를 찾으면 더 돌지 않는다
        .collect();
    println!("40분 이상 앞의 둘 {big:?}, 들여다본 원소 {touched:?}");

    let stats = rows.iter().fold(BTreeMap::<&str, Stats>::new(), |mut acc, &(lang, m)| {
        let s = acc.entry(lang).or_default();
        s.count += 1;
        s.total += u64::from(m);
        s.max = s.max.max(m);
        acc
    });
    for (lang, s) in &stats {
        println!("{lang}: {}개, 합 {}, 평균 {:.2}, 최대 {}", s.count, s.total, s.total as f64 / f64::from(s.count), s.max);
    }
}
```

실행 결과:

```text
40분 이상 앞의 둘 [45, 95], 들여다본 원소 ["Python", "C", "Rust", "Python", "C"]
C: 2개, 합 140, 평균 70.00, 최대 95
Python: 2개, 합 60, 평균 30.00, 최대 30
Rust: 2개, 합 65, 평균 32.50, 최대 40
```

| 코드                                                                                     | 설명                                                                                                |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `.inspect(\|(lang, _)\| touched.push(*lang))`                                            | 지나가는 원소를 기록만 하고 그대로 넘깁니다. 8절의 표가 이 기록입니다.                              |
| `rows.iter().fold(BTreeMap::<&str, Stats>::new(), \|mut acc, &(lang, m)\| { ...; acc })` | 빈 사전에서 시작해 원소마다 고친 사전을 다음으로 넘깁니다. 마지막에 돌려준 사전이 결과입니다.       |
| `acc.entry(lang).or_default()`                                                           | `#[derive(Default)]` 덕분에 처음 보는 언어는 `Stats { count: 0, total: 0, max: 0 }`에서 시작합니다. |
| `s.max = s.max.max(m);`                                                                  | 필드 `max`와 메서드 `max`는 이름이 같아도 구별됩니다. 둘 중 큰 값입니다.                            |
| `f64::from(s.count)`                                                                     | `u32`를 잃는 것 없이 실수로 바꿉니다.                                                               |

Python에서는 `take(2)`를 `break`로, `fold`를 `defaultdict`와 반복문으로 씁니다.

```python
# 파일: lang_stats.py
from collections import defaultdict

rows = [("Python", 30), ("C", 45), ("Rust", 25), ("Python", 30), ("C", 95), ("Rust", 40)]

touched = []
big = []
for lang, m in rows:                        # take(2)를 반복문과 break로
    touched.append(lang)
    if m >= 40:
        big.append(m)
        if len(big) == 2:
            break
print(f"40분 이상 앞의 둘 {big}, 들여다본 원소 {touched}")

stats = defaultdict(lambda: {"count": 0, "total": 0, "max": 0})
for lang, m in rows:
    s = stats[lang]
    s["count"] += 1
    s["total"] += m
    s["max"] = max(s["max"], m)
for lang in sorted(stats):
    s = stats[lang]
    print(f"{lang}: {s['count']}개, 합 {s['total']}, 평균 {s['total'] / s['count']:.2f}, 최대 {s['max']}")
```

실행 결과:

```text
40분 이상 앞의 둘 [45, 95], 들여다본 원소 ['Python', 'C', 'Rust', 'Python', 'C']
C: 2개, 합 140, 평균 70.00, 최대 95
Python: 2개, 합 60, 평균 30.00, 최대 30
Rust: 2개, 합 65, 평균 32.50, 최대 40
```

- 두 개를 찾으면 `break`로 멈춰서 마지막 원소를 보지 않습니다. Rust의 `take`와 같은 결과입니다.
- `defaultdict(lambda: {...})`는 처음 보는 열쇠마다 새 사전을 만듭니다. 사전 대신 `dataclass`를 써도 됩니다.
- 출력할 때 `sorted(stats)`로 이름 순서를 맞췄습니다. Rust의 `BTreeMap`은 저절로 이름 순입니다.

## 10. 목록 처리 대응표

| 하고 싶은 일      | Rust                            | Python                            | C                             |
| ----------------- | ------------------------------- | --------------------------------- | ----------------------------- |
| 거르기            | `.filter(조건)`                 | `[x for x in xs if 조건]`, 생성기 | 조건 함수 + 반복문            |
| 바꾸기            | `.map(f)`                       | `[f(x) for x in xs]`              | 반복문                        |
| 앞의 N개          | `.take(n)`                      | `islice(it, n)`, `[:n]`           | `i < n` 조건                  |
| 합·최솟값         | `.sum()`, `.min().unwrap_or(0)` | `sum()`, `min(..., default=0)`    | 반복문 + 시작값               |
| 무리별 모으기     | `BTreeMap` + `entry`            | `defaultdict`, `groupby`(정렬 후) | 그룹 배열 + 선형 탐색(Day 88) |
| 한 번에 여러 통계 | `.fold(시작, f)`                | 반복문 + 사전                     | 반복문 + 구조체               |
| 게으른 계산       | 기본                            | 생성기                            | 직접("다음을 주는 함수")      |
| 복사 없이 고르기  | `Vec<&T>`                       | 리스트에 같은 객체(참조)          | 주소 배열                     |

## 11. 세 언어 비교

| 관점             | Rust                       | Python                                 | C                           |
| ---------------- | -------------------------- | -------------------------------------- | --------------------------- |
| 거르기 조건 전달 | 클로저(바깥 변수를 붙잡음) | 람다, 함수(바깥 변수를 붙잡음)         | 함수 포인터 + `void *` 인자 |
| 게으름           | 반복자는 기본으로 게으름   | 생성기만 게으름, 리스트는 즉시         | 없음(직접 만들어야 함)      |
| 속도             | 손으로 쓴 반복문과 같음    | 반복문보다 빠른 경우가 많음(내장 함수) | 가장 직접적                 |
| 자료형 검사      | 컴파일할 때                | 실행할 때                              | `void *`는 검사 없음        |

## 12. 자주 하는 실수

### 실수 1: 소비자 없이 어댑터만 쓴다

```rust
// 파일: unused_map.rs (컴파일 오류: unused `Map` that must be used)
fn main() {
    let v = vec![3, 1, 2];
    v.iter().map(|x| x * 2);
    println!("{v:?}");
}
```

`map`은 새 반복자를 만들 뿐, 아무것도 계산하지 않습니다. `collect`, `sum` 같은 소비자를 붙이거나, 부작용이 목적이면 `for`를 쓰세요.

### 실수 2: collect의 결과 자료형을 적지 않는다

```rust
// 파일: collect_type.rs (컴파일 오류: type annotations needed)
fn main() {
    let v = vec![3, 1, 2];
    let big = v.iter().filter(|x| **x > 1).collect();
    println!("{big:?}");
}
```

`collect`는 여러 자료형으로 모을 수 있어서 무엇으로 모을지 알려 줘야 합니다. `let big: Vec<&i32> = ...` 또는 `.collect::<Vec<_>>()`로 쓰세요.

### 실수 3: groupby를 정렬하지 않고 쓴다 (Python)

실습과 예제처럼, 떨어져 있는 같은 값이 여러 무리로 나옵니다. 먼저 같은 열쇠로 정렬하세요.

### 실수 4: 여러 기준 정렬에서 전체를 뒤집는다

`sort` 뒤 `reverse`는 동점 기준까지 뒤집습니다. 첫 기준만 `b.cmp(a)`로 뒤집고 나머지는 `then_with`로 오름차순을 두세요(실습의 디버그 문제).

### 실수 5: 빌린 목록을 원본보다 오래 쓴다 (Rust)

`Vec<&Session>`은 원본 `sessions`를 빌립니다. 원본을 함수 안에서 만들고 참조 목록만 돌려주려 하면 E0515·E0597입니다(Day 35, 45). 원본이 필요 없으면 `into_iter()`로 옮겨 `Vec<Session>`을 만드세요. 실제 프로젝트가 그렇게 합니다.

## 13. Q&A

**Q. 반복자 연결이 for 반복보다 느리지 않나요?**

A. Rust 컴파일러는 `filter().map().sum()` 같은 연결을 하나의 반복문으로 합쳐 최적화합니다. 대부분 손으로 쓴 반복문과 같은 속도이고, 범위 검사를 줄일 수 있어 더 빠른 경우도 있습니다. 이런 것을 "비용 없는 추상화"라고 부릅니다.

**Q. 언제 반복자 연결 대신 for를 쓰나요?**

A. 중간에 여러 변수를 함께 바꾸거나, 조기에 여러 경우로 빠져나가거나, 오류 처리가 복잡하면 `for`가 읽기 쉽습니다. 오늘 보고서도 무리별 합계는 `for`로 썼습니다. 둘 중 **읽기 쉬운 쪽**을 고르세요.

**Q. Python의 리스트 컴프리헨션과 생성기 중 무엇을 쓰나요?**

A. 결과를 여러 번 쓰거나 길이가 필요하면 리스트, 한 번만 훑고 버리거나 아주 크거나 끝이 없으면 생성기입니다. `sum(x for x in xs)`처럼 함수 인자로 바로 넘길 때는 괄호를 한 겹만 써도 생성기가 됩니다.

**Q. fold 대신 여러 번 훑으면 안 되나요?**

A. 데이터가 작으면 여러 번 훑는 편이 더 읽기 쉽습니다(오늘 보고서의 `sum`, `min`, `max`). 데이터가 크거나, 한 번만 읽을 수 있는 입력(표준 입력, 네트워크)이면 `fold`처럼 한 번에 모아야 합니다.

## 14. 핵심 요약

- 반복자는 **어댑터**(`filter`, `map`, `take`)와 **소비자**(`collect`, `sum`, `min`, `fold`)로 나뉘고, 소비자가 당길 때만 계산합니다(게으른 계산).
- 선택적 거르기는 `Option::is_none_or`, 복사 없이 고르기는 `Vec<&T>`입니다.
- 무리별 합계는 `BTreeMap`과 `entry().or_default()`, 여러 기준 정렬은 튜플 비교와 `b.cmp(a)`, `then_with`, 앞의 N개는 `take`입니다.
- `use std::fmt::Write;` 뒤 `writeln!(out, ...)`로 `String`에 보고서를 씁니다.
- Python 생성기는 같은 게으름을, `groupby`는 **정렬 후** 이웃한 값 묶기를 합니다. C는 함수 포인터 + 인자와 주소 배열로 같은 흐름을 만듭니다.
- `fold` 하나로 여러 통계를 한 번에 모을 수 있습니다.

## 15. 도전 문제

1. **(Rust)** 보고서의 `--topic`(주제가 정확히 같음)과 `--date` 거르기를 `filter` 두 개로 추가하고, 실제 프로젝트의 `report`와 출력이 같은지 확인하세요.
2. **(Rust)** 무리별 합계를 `for` 대신 `fold`로 바꾸고(`languages`와 `topics`를 튜플로 함께 접기), 결과가 같은지 확인하세요.
3. **(Python)** Day 86의 `report`를 생성기와 `groupby`로 다시 만들어 보세요. 무리별 합계를 위해 어떤 열쇠로 정렬해야 하는지, 정렬이 두 번 필요한지 생각해 보세요.
4. **(C)** 오늘 C 예제에 `--search`에 해당하는 `contains_topic` 조건 함수를 추가하고, 두 조건을 모두 만족하는 기록만 고르는 `filter_all(in, n, preds[], args[], k, out)`을 만드세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `report`는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.rs`에 있는 함수와 거의 같습니다. 실제 코드는 `into_iter()`로 기록을 옮겨 받고, `format!`과 `push_str`로 보고서를 만듭니다. 오늘 코드와 무엇이 다른지 비교해 보세요.
