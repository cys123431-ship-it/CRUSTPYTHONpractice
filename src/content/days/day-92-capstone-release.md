---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-92-capstone-release
courseId: crp-92
phaseId: phase-08
dayNumber: 92
date: "2026-12-31"
title: 완성 프로젝트 검증과 확장
summary: 마지막 날에는 세 언어로 만든 Study Log Analyzer에 기능을 더할 때 기존 사용자를 깨뜨리지 않는 방법을 배웁니다. 새 기능은 선택 옵션으로 넣고 기본값은 예전 동작으로 둡니다. 확장 출력은 공통 보고서 뒤에 붙여서, 옵션 없는 출력이 확장 전과 바이트까지 같은지 검사합니다(Python의 ASCII 막대). C에서는 새 옵션 값을 strtol로 엄격하게 읽어 빈 값, 부호, 남는 글자, 범위 밖 값을 거절합니다. Rust에서는 출력 형식을 enum과 FromStr로 받아, 새 형식을 추가했을 때 match가 처리를 빠뜨리지 않게 하고 JSON 문자열 이스케이프도 다룹니다. 끝으로 변경의 종류(버그 수정, 기능 추가, 호환성 깨짐)에 따라 버전 번호를 올리는 규칙과, 버전을 문자열이 아니라 숫자 묶음으로 비교해야 하는 이유, 출시 전 점검 목록을 정리합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-91-cross-language-review]
learningObjectives:
  - 새 기능을 선택 옵션으로 추가하고, 옵션이 없을 때의 출력이 확장 전과 같은지 시험으로 확인한다.
  - 새 옵션의 값을 계약 범위에 맞게 엄격히 검증하고 잘못된 값은 거절한다.
  - enum과 match로 출력 형식을 추가해, 새 변형의 처리를 컴파일러가 확인하게 한다.
  - 변경의 종류에 따라 버전 번호를 올리고, 버전을 숫자 묶음으로 비교한다.
  - 출시 전 점검 목록(시험, 세 구현 비교, 문서, 알려진 차이)을 설명한다.
concepts:
  [
    capstone release,
    backward compatibility,
    optional flag,
    default behavior,
    extension after common report,
    ascii bar chart,
    ceiling division,
    scaling,
    strict option parsing,
    strtol end pointer,
    output format enum,
    exhaustive match,
    json escaping,
    semantic versioning,
    version comparison,
    release checklist,
    changelog,
  ]
runnerMode: python
playgroundSource: |
  # 파일: bars_play.py — 막대 한 칸의 크기를 바꿔 보세요.
  totals = {"C": 45, "Python": 60, "Rust": 25}
  step = 10
  for k, v in totals.items():
      print(f"{k:<6}", "#" * ((v + step - 1) // step), v)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day92-predict-ceil
    title: 올림 나눗셈 예측하기
    kind: predict
    objective: (m + 9) // 10이 10으로 나눈 몫을 올림한다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print([(m + 9) // 10 for m in (45, 60, 25, 1)])
    answer: "[5, 6, 3, 1]"
    hint: "45분은 4칸 반이지만 칸을 반만 그릴 수는 없습니다. 남는 분이 있으면 한 칸을 더 그립니다."
    explanation: "(m + 9) // 10은 m / 10을 올림한 값입니다. 45 → 54 // 10 = 5, 60 → 69 // 10 = 6, 25 → 3, 1 → 1입니다. 그냥 m // 10이면 1분짜리 기록이 0칸이 되어 막대에서 사라지므로 올림을 썼습니다. 이 식은 m이 0 이상일 때 맞습니다."
    commonMistakes:
      - "45 // 10처럼 내림으로 계산해 [4, 6, 2, 0]으로 적음"
      - "반올림으로 계산해 25를 2 또는 3 중 헷갈림"
    language: python
    verification: run
  - id: ex-day92-predict-version
    title: 버전 비교 예측하기
    kind: predict
    objective: 버전을 문자열로 비교하면 틀린다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print((1, 10, 0) > (1, 9, 5), "1.10.0" > "1.9.5")
    answer: "True False"
    hint: "문자열 비교는 글자 하나씩 비교합니다. 세 번째 글자는 '1'과 '9'입니다."
    explanation: "튜플은 앞 원소부터 숫자로 비교하므로 10 > 9라서 True입니다. 문자열은 앞에서부터 글자를 비교하다 '1' < '9'에서 결정되어 False입니다. 그래서 버전은 점으로 나눠 정수 묶음으로 바꾼 뒤 비교해야 합니다(실습 9절)."
    commonMistakes:
      - "문자열도 숫자처럼 비교된다고 생각함"
      - "튜플은 길이로 비교된다고 생각함"
    language: python
    verification: run
  - id: ex-day92-fill
    title: 막대 길이 제한 채우기
    kind: fill
    objective: 아주 긴 값도 화면 너비를 넘지 않도록 막대 길이에 상한을 둔다.
    prompt: "빈칸에 함수 이름 하나를 넣어 막대가 40칸을 넘지 않게 하고 '40'이 출력되게 하세요."
    starter: |-
      print(len("#" * _____(40, 100)))
    answer: |-
      print(len("#" * min(40, 100)))
    output: "40"
    hint: "두 값 중 작은 쪽을 고르면 됩니다."
    explanation: "계약상 분은 10080까지 가능해서, 10분 한 칸이면 1008칸짜리 막대가 나옵니다. min(40, n)으로 상한을 두면 터미널 한 줄 안에 들어갑니다. 상한에 걸린 막대는 실제 비율과 다르므로, 막대 옆에 숫자를 함께 쓰거나(Rust 실습) 가장 큰 값에 맞춰 비율로 줄이는 방법도 있습니다."
    commonMistakes:
      - "max를 넣어 100이 출력됨"
      - "슬라이스로 자르려고 [:40]을 len 밖에 씀"
    language: python
    verification: run
  - id: ex-day92-modify
    title: 기본 출력을 지키도록 바꾸기
    kind: modify
    objective: 새 기능의 기본값을 꺼 두어 기존 사용법의 출력이 바뀌지 않게 한다.
    prompt: "chart의 기본값이 True라서 옵션 없이 호출해도 막대가 붙어 '비호환'이 출력됩니다. 기본값을 바꿔 '호환'이 출력되게 하세요."
    starter: |-
      def report(total, chart=True):
          lines = [f"total_minutes: {total}"]
          if chart:
              lines.append("ascii_chart: " + "#" * ((total + 9) // 10))
          return "\n".join(lines) + "\n"

      OLD = "total_minutes: 130\n"
      print("호환" if report(130) == OLD else "비호환")
    answer: |-
      def report(total, chart=False):
          lines = [f"total_minutes: {total}"]
          if chart:
              lines.append("ascii_chart: " + "#" * ((total + 9) // 10))
          return "\n".join(lines) + "\n"

      OLD = "total_minutes: 130\n"
      print("호환" if report(130) == OLD else "비호환")
    output: "호환"
    starterOutput: "비호환"
    hint: "새 기능은 원하는 사람만 켜는 것이 기본입니다."
    explanation: "이 보고서를 읽는 다른 프로그램(Day 91의 비교 스크립트, 사용자의 스크립트)은 옛 출력 모양을 기대합니다. 기본값이 True면 아무것도 바꾸지 않은 사용자의 결과가 바뀌어 호환성이 깨집니다. 기본값을 False로 두면 --chart를 준 사람만 막대를 봅니다. 이런 확인을 시험으로 남겨 두면 나중에 실수로 기본값을 바꿔도 바로 알 수 있습니다."
    commonMistakes:
      - "OLD에 막대 줄을 추가해 시험을 새 출력에 맞춤"
      - "if chart 줄을 지워 확장 기능 자체를 없앰"
    language: python
    verification: run
  - id: ex-day92-debug
    title: 부 버전 올리기 고치기
    kind: debug
    objective: 기능 추가로 부 버전을 올릴 때 수 버전을 0으로 되돌린다.
    prompt: "새 기능을 추가해 1.2.4를 올렸는데 '1.3.4'가 나옵니다. 규칙대로 '1.3.0'이 출력되게 고치세요."
    starter: |-
      def minor_bump(version):
          major, minor, patch = (int(p) for p in version.split("."))
          return f"{major}.{minor + 1}.{patch}"

      print(minor_bump("1.2.4"))
    answer: |-
      def minor_bump(version):
          major, minor, patch = (int(p) for p in version.split("."))
          return f"{major}.{minor + 1}.0"

      print(minor_bump("1.2.4"))
    output: "1.3.0"
    starterOutput: "1.3.4"
    hint: "patch 번호는 '이 minor 버전 안에서 몇 번째 수정인가'를 셉니다."
    explanation: "버전 번호 major.minor.patch에서 앞 번호를 올리면 뒤 번호는 0부터 다시 셉니다. 1.3.4라고 하면 '1.3에 버그 수정이 네 번 있었다'는 뜻이 되어 틀립니다. 같은 이유로 major를 올리면 minor와 patch가 모두 0이 됩니다(2.0.0). 이 경우 변수 patch는 쓰이지 않지만, 세 부분이 있는지 확인하는 역할은 남습니다."
    commonMistakes:
      - "patch - 4처럼 이 예에만 맞는 계산을 넣음"
      - "minor를 올리지 않고 patch만 0으로 만듦"
    language: python
    verification: run
  - id: ex-day92-independent
    title: Rust로 버전 비교하기
    kind: independent
    objective: 필드 순서대로 비교되는 derive(Ord)로 버전을 비교한다.
    prompt: 'major, minor, patch 필드를 가진 Version 구조체에 PartialEq, Eq, PartialOrd, Ord를 derive하고, "1.10.0"과 "1.9.5"를 읽어 더 큰 버전 ''1.10.0''을 출력하세요. 부분이 셋이 아니거나 숫자가 아니면 None을 돌려주는 parse를 만드세요.'
    starter: |-
      fn main() {
          println!("여기에 Version을 만들어 보세요");
      }
    answer: |-
      #[derive(PartialEq, Eq, PartialOrd, Ord)]
      struct Version {
          major: u32,
          minor: u32,
          patch: u32,
      }

      fn parse(s: &str) -> Option<Version> {
          let mut parts = s.split('.').map(|p| p.parse::<u32>().ok());
          let v = Version { major: parts.next()??, minor: parts.next()??, patch: parts.next()?? };
          if parts.next().is_some() { None } else { Some(v) }
      }

      fn main() {
          let a = parse("1.10.0").unwrap();
          let b = parse("1.9.5").unwrap();
          let big = if a > b { a } else { b };
          println!("{}.{}.{}", big.major, big.minor, big.patch);
      }
    output: "1.10.0"
    hint: "derive(Ord)는 구조체의 필드를 선언한 순서대로 비교합니다. parts.next()는 Option<Option<u32>>이라 ?가 두 번 필요합니다."
    explanation: "derive된 비교는 튜플 비교와 같아서, 필드를 major, minor, patch 순서로 선언해야 올바르게 비교됩니다. 첫 ?는 부분이 모자랄 때, 둘째 ?는 숫자가 아닐 때 None을 돌려줍니다. 마지막에 남은 부분이 있는지도 확인해 1.2.3.4 같은 값을 거절합니다."
    commonMistakes:
      - "필드를 patch, minor, major 순서로 선언해 비교가 거꾸로 됨"
      - "문자열 그대로 a > b로 비교함"
    language: rust
    verification: run
quiz:
  - id: quiz-day92-01
    question: 이미 쓰이고 있는 프로그램에 새 기능을 넣을 때 가장 안전한 방법은?
    choices:
      - 기본 출력에 바로 새 줄을 넣는다
      - 선택 옵션으로 추가하고 기본값은 예전 동작으로 두며, 옵션 없는 출력이 예전과 같은지 시험한다
      - 기존 옵션의 뜻을 바꾼다
      - 오류 메시지를 없앤다
    answerIndex: 1
    explanation: 기존 사용자는 아무것도 바꾸지 않아도 같은 결과를 얻고, 새 기능이 필요한 사람만 옵션을 켭니다. Study Log Analyzer의 --chart가 이렇게 만들어졌고, 확장 출력은 공통 보고서 뒤에 붙습니다.
  - id: quiz-day92-02
    question: C에서 strtol로 옵션 값을 읽은 뒤 *end != '\0'을 확인하는 이유는?
    choices:
      - 속도를 높이려고
      - "숫자 뒤에 글자가 남은 값(예: 3O)을 거절하려고"
      - 음수를 받아들이려고
      - 필요 없다
    answerIndex: 1
    explanation: strtol은 읽을 수 있는 데까지만 읽고 멈춥니다. "3O"(영문자 O)는 3까지 읽고 end가 'O'를 가리킵니다. end가 문자열 끝이 아니면 값 전체가 숫자가 아니므로 거절합니다. errno == ERANGE로 너무 큰 값도 거절합니다.
  - id: quiz-day92-03
    question: Rust에서 출력 형식을 enum으로 만들어 match로 처리하면 좋은 점은?
    choices:
      - 실행이 빨라진다
      - 새 형식 변형을 추가했을 때 처리하지 않은 match가 컴파일 오류가 되어 빠뜨리지 않는다
      - 문자열 비교를 할 수 있다
      - JSON을 자동으로 만든다
    answerIndex: 1
    explanation: match는 모든 변형을 다뤄야 하므로 Format::Csv를 추가하면 render 같은 곳이 컴파일되지 않습니다. 문자열로 형식을 다루면 새 형식을 한 곳에서 빠뜨려도 실행해 봐야 압니다. 그래서 _ => 같은 '나머지' 갈래는 꼭 필요할 때만 씁니다.
  - id: quiz-day92-04
    question: 1.4.2 버전에서 기본 정렬 순서를 바꿨다면 다음 버전은?
    choices:
      - "1.4.3"
      - "1.5.0"
      - "2.0.0"
      - "1.4.2"
    answerIndex: 2
    explanation: 기본 정렬이 바뀌면 옵션 없이 쓰던 사용자의 출력이 달라지므로 호환성이 깨진 변경입니다. major를 올리고 뒤를 0으로 되돌려 2.0.0이 됩니다. 버그 수정만이면 1.4.3, 새 선택 옵션이면 1.5.0입니다.
  - id: quiz-day92-05
    question: 출시 전 점검 목록에 들어가지 않아도 되는 것은?
    choices:
      - 단위 시험과 골든 파일 시험 통과
      - 세 구현의 차이 시험 통과
      - README의 사용법과 알려진 차이 갱신
      - 코드 줄 수를 늘리기
    answerIndex: 3
    explanation: 줄 수는 품질과 관계가 없습니다. 출시 전에는 시험(Day 84), 세 구현 비교(Day 91), 경고 없는 빌드(-Wall -Werror, -D warnings), 문서와 알려진 차이, 버전 번호와 변경 기록을 확인합니다.
---

## 1. 오늘 배울 내용

92일 과정의 마지막 날입니다. Study Log Analyzer는 세 언어로 완성되었고 Day 91에서 결과가 같다는 것도 확인했습니다. 오늘은 완성된 프로그램에 **기능을 더하면서도 기존 사용자를 깨뜨리지 않는 방법**과 **출시 준비**를 배웁니다.

1. 호환되게 확장하기
   - 새 기능은 **선택 옵션**으로 넣고, 기본값은 예전 동작으로
   - 확장 출력은 공통 보고서 **뒤에** 붙이기
   - 옵션 없는 출력이 확장 전과 같은지 시험하기
2. Python: `--chart` ASCII 막대(올림 나눗셈, 길이 상한)
3. C: 새 옵션 `--min N`의 값을 `strtol`로 엄격하게 읽기
4. Rust: `--format text|json`을 enum과 `FromStr`로 받기, JSON 문자열 이스케이프
5. 버전 번호: 버그 수정, 기능 추가, 호환성 깨짐에 따라 올리기와 올바른 비교
6. 출시 전 점검 목록

## 2. 왜 필요한가

프로그램은 완성된 뒤에도 계속 바뀝니다. 사용자가 "막대그래프도 보고 싶어요", "30분 이상만 보고 싶어요"라고 요청합니다. 이때 기본 출력에 막대를 바로 넣으면 이런 일이 생깁니다.

- 보고서를 읽어 다른 곳에 옮기던 사용자의 스크립트가 모르는 줄을 만나 멈춥니다.
- Day 91의 비교 스크립트가 C, Rust 구현과 다르다고 보고합니다.
- 사용자는 무엇이 바뀌었는지 모른 채 새 버전을 받습니다.

그래서 기능을 더할 때는 **무엇이 그대로여야 하는지**부터 정하고 시험으로 지킵니다. 그리고 버전 번호와 변경 기록으로 무엇이 바뀌었는지 알립니다.

## 3. 그림으로 이해하기

**확장은 공통 보고서 뒤에 붙인다.**

```text
옵션 없음                    --chart
┌──────────────────────┐    ┌──────────────────────┐
│ sessions: 4          │    │ sessions: 4          │
│ total_minutes: 130   │    │ total_minutes: 130   │   ← 여기까지 바이트까지 같음
│ language_totals:     │ == │ language_totals:     │     (옛 출력으로 시작)
│ C,45 ...             │    │ C,45 ...             │
└──────────────────────┘    ├──────────────────────┤
                            │ ascii_chart:         │   ← 확장 부분
                            │ C: #####             │
                            └──────────────────────┘
```

**버전 번호 major.minor.patch.**

```text
1.2.3 ──버그 수정────────▶ 1.2.4    (계약대로 동작하게 고침)
1.2.3 ──새 선택 옵션─────▶ 1.3.0    (기존 사용법은 그대로, patch는 0으로)
1.2.3 ──기존 동작 바뀜───▶ 2.0.0    (호환성 깨짐, 뒤는 모두 0으로)
```

## 4. 천천히 풀어보기

### 4.1 무엇이 그대로여야 하는가

Study Log Analyzer의 계약(Day 84)에서 기존 사용자가 기대는 것은 다음과 같습니다.

| 약속                         | 확장할 때                             |
| ---------------------------- | ------------------------------------- |
| 옵션 없는 출력의 모양과 순서 | 바꾸지 않음                           |
| 기존 옵션의 뜻               | 바꾸지 않음                           |
| 오류일 때 0이 아닌 종료 코드 | 바꾸지 않음                           |
| 새 옵션                      | 추가 가능(기본은 꺼짐)                |
| 새 출력 줄                   | 새 옵션을 켰을 때만, 공통 보고서 뒤에 |

이 표를 시험으로 옮기면 "옵션 없음 출력 == 확장 전 출력", "확장 출력.startswith(확장 전 출력)"가 됩니다.

### 4.2 새 옵션도 계약을 따른다

새 옵션의 값도 기존 값과 같은 규칙으로 검증합니다. 분은 1~10080의 ASCII 정수였으므로 `--min`도 같은 범위, 같은 형식만 받습니다. 기존 규칙과 다르면 사용자가 헷갈리고, 세 구현이 서로 다르게 판단할 수 있습니다.

### 4.3 한 구현에만 있는 기능

`--chart`는 지금 Python 구현에만 있습니다. 이런 기능은 README에 "Python 선택 확장"이라고 적고, 차이 시험(Day 91)에서는 공통 옵션만 비교합니다. 나중에 세 구현 모두에 넣으면 공통 계약으로 옮기고 비교 사례에 추가합니다.

### 4.4 출시 전 점검 목록

1. 단위 시험, 골든 파일 시험 통과(Day 84)
2. 세 구현의 차이 시험 통과(Day 91)
3. 경고 없는 빌드: C는 `-Wall -Wextra -pedantic -Werror`, Rust는 `-D warnings`
4. 새 옵션의 잘못된 값 시험(빈 값, 부호, 남는 글자, 범위 밖)
5. README의 사용법, 선택 확장, 알려진 차이(따옴표 안의 줄바꿈) 갱신
6. 버전 번호 올리기와 변경 기록(무엇이 바뀌었는가) 쓰기

## 5. Python으로 구현하기

`--chart`를 선택 옵션으로 넣고, 옵션이 없을 때 출력이 확장 전과 같은지 확인합니다.

```python
# 파일: chart_extension.py
ROWS = [("2026-10-01", "Python", "변수", 30), ("2026-10-02", "C", "배열, 포인터", 45),
        ("2026-10-03", "Rust", "소유권", 25), ("2026-10-04", "Python", "변수", 30)]


def bar(minutes, width=40):
    return "#" * min(width, (minutes + 9) // 10)     # 10분마다 한 칸, 남는 분은 올림, 최대 40칸


def report(rows, chart=False):                        # 기본값 False: 옛 사용법의 출력은 그대로
    total = sum(r[3] for r in rows)
    by_lang = {k: sum(r[3] for r in rows if r[1] == k) for k in sorted({r[1] for r in rows})}
    lines = [f"sessions: {len(rows)}", f"total_minutes: {total}", "language_totals:"]
    lines += [f"{k},{v}" for k, v in by_lang.items()]
    if chart:                                         # 확장은 공통 보고서 **뒤에** 붙인다
        lines.append("ascii_chart:")
        lines += [f"{k}: {bar(v)}" for k, v in by_lang.items()]
    return "\n".join(lines) + "\n"


OLD = "sessions: 4\ntotal_minutes: 130\nlanguage_totals:\nC,45\nPython,60\nRust,25\n"   # 확장 전 출력
plain, charted = report(ROWS), report(ROWS, chart=True)
print("옵션 없음 = 확장 전:", plain == OLD)
print("확장 출력이 옛 출력으로 시작:", charted.startswith(OLD))
print(charted[len(OLD):], end="")
print("긴 막대:", len(bar(10080)), "칸")
```

실행 결과:

```text
옵션 없음 = 확장 전: True
확장 출력이 옛 출력으로 시작: True
ascii_chart:
C: #####
Python: ######
Rust: ###
긴 막대: 40 칸
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `min(width, (minutes + 9) // 10)`               | 10분마다 한 칸이고, 남는 분이 있으면 한 칸을 더 그립니다(올림). 최대 40칸이라 10080분도 한 줄에 들어갑니다.       |
| `def report(rows, chart=False)`                 | 기본값이 `False`라서 예전처럼 `report(rows)`로 부르면 예전 출력이 나옵니다.                                       |
| `if chart:` 뒤의 `lines.append("ascii_chart:")` | 확장 부분은 공통 보고서의 줄을 모두 넣은 **뒤에** 붙입니다. 중간에 끼우면 옛 출력으로 시작한다는 약속이 깨집니다. |
| `OLD = "sessions: 4\n..."`                      | 확장 전 출력을 그대로 적어 둔 골든 문자열입니다. 실제 프로젝트에서는 골든 파일로 둡니다(Day 84).                  |
| `plain == OLD`, `charted.startswith(OLD)`       | 4.1절의 두 약속을 시험으로 옮긴 것입니다.                                                                         |
| `charted[len(OLD):]`                            | 옛 출력 뒤에 붙은 확장 부분만 잘라 보여 줍니다.                                                                   |

저장소의 `study_log.py`도 같은 방식으로 `--chart`를 `action="store_true"`(주면 True, 안 주면 False)로 받습니다.

## 6. C로 구현하기

새 옵션 `--min N`(N분 이상만 보기)의 값을 계약에 맞게 엄격하게 읽습니다.

```c
// 파일: min_option.c
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

/* 새 옵션 --min N(N분 이상만)의 값을 읽는다. 성공하면 1, 아니면 0. */
static int parse_min(const char *text, long *out) {
    if (text == NULL || *text == '\0' || *text == '+' || *text == '-' || *text == ' ') {
        return 0;                                  /* 빈 값, 부호, 앞 공백은 거절 */
    }
    char *end = NULL;
    errno = 0;
    long value = strtol(text, &end, 10);
    if (errno == ERANGE || *end != '\0') {
        return 0;                                  /* 너무 큼, 또는 숫자 뒤에 글자가 남음 */
    }
    if (value < 1 || value > 10080) {
        return 0;                                  /* 공통 계약의 분 범위 */
    }
    *out = value;
    return 1;
}

int main(void) {
    const char *cases[] = {"30", "0", "10080", "10081", "3O", "", "-5", " 7", "99999999999999999999"};
    size_t n = sizeof cases / sizeof cases[0];
    for (size_t i = 0; i < n; i++) {
        long value = 0;
        if (parse_min(cases[i], &value)) {
            printf("--min \"%s\" → 받아들임 (%ld)\n", cases[i], value);
        } else {
            printf("--min \"%s\" → 거절\n", cases[i]);
        }
    }
    return 0;
}
```

실행 결과:

```text
--min "30" → 받아들임 (30)
--min "0" → 거절
--min "10080" → 받아들임 (10080)
--min "10081" → 거절
--min "3O" → 거절
--min "" → 거절
--min "-5" → 거절
--min " 7" → 거절
--min "99999999999999999999" → 거절
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `*text == '+' \|\| *text == '-' \|\| *text == ' '` | `strtol`은 앞 공백과 부호를 스스로 받아들이므로, 계약(부호 없는 ASCII 정수)에 맞게 먼저 거절합니다.    |
| `errno = 0;` 다음 `strtol(text, &end, 10)`         | `errno`는 이전 함수의 값이 남아 있을 수 있어서 부르기 전에 0으로 만듭니다.                             |
| `errno == ERANGE`                                  | `long`에 담을 수 없는 큰 값입니다. 이때 `strtol`은 `LONG_MAX`를 돌려주므로 값만 보고는 알 수 없습니다. |
| `*end != '\0'`                                     | 숫자 뒤에 글자가 남았습니다. `"3O"`(영문자 O)는 3까지 읽고 멈춥니다.                                   |
| `value < 1 \|\| value > 10080`                     | 분의 계약 범위입니다. 기존 minutes 열과 같은 규칙을 씁니다(4.2절).                                     |
| `return 0` / `*out = value; return 1`              | 성공 여부는 반환값으로, 값은 포인터로 돌려줍니다. 실패하면 `*out`을 건드리지 않습니다.                 |

Day 88의 minutes 검사는 글자를 하나씩 보며 앞의 0도 거절했습니다. 여기서는 `strtol`을 썼기 때문에 `"007"`은 받아들입니다. 새 옵션이 기존 열과 완전히 같은 규칙을 쓰게 하려면 **같은 검사 함수를 다시 쓰는 것**이 가장 확실합니다(도전 문제 2).

## 7. Rust로 구현하기

출력 형식 옵션 `--format text|json`을 enum으로 받습니다. 새 형식을 추가하면 컴파일러가 처리하지 않은 곳을 알려 줍니다.

```rust
// 파일: format_option.rs
use std::str::FromStr;

#[derive(Clone, Copy)]
enum Format {
    Text,
    Json,
}

impl FromStr for Format {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "text" => Ok(Format::Text),
            "json" => Ok(Format::Json),
            other => Err(format!("--format은 text 또는 json이어야 합니다: {other}")),
        }
    }
}

fn json_string(s: &str) -> String {
    let mut out = String::from("\"");
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            _ => out.push(c),
        }
    }
    out.push('"');
    out
}

fn render(totals: &[(&str, u32)], format: Format) -> String {
    match format {                                 // 새 변형을 추가하면 여기서 컴파일 오류가 나서 빠뜨릴 수 없다
        Format::Text => totals.iter().map(|(k, v)| format!("{k},{v}\n")).collect(),
        Format::Json => {
            let items: Vec<String> = totals.iter().map(|(k, v)| format!("{}: {v}", json_string(k))).collect();
            format!("{{{}}}\n", items.join(", "))
        }
    }
}

fn main() {
    let totals = [("배열, 포인터", 45), ("변수", 60), ("\"따옴표\" 주제", 10)];
    for arg in ["text", "json", "xml"] {
        match arg.parse::<Format>() {
            Ok(f) => print!("[{arg}]\n{}", render(&totals, f)),
            Err(e) => println!("[{arg}] 오류: {e}"),
        }
    }
}
```

실행 결과:

```text
[text]
배열, 포인터,45
변수,60
"따옴표" 주제,10
[json]
{"배열, 포인터": 45, "변수": 60, "\"따옴표\" 주제": 10}
[xml] 오류: --format은 text 또는 json이어야 합니다: xml
```

### 코드 한 부분씩 읽기

| 코드                                                        | 설명                                                                                                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `impl FromStr for Format`                                   | `"json".parse::<Format>()`처럼 문자열에서 enum을 만듭니다. 모르는 값은 이유가 담긴 `Err`입니다(Day 89).                                |
| `match format { Format::Text => ..., Format::Json => ... }` | 모든 변형을 다뤄야 컴파일됩니다. `Format::Csv`를 추가하면 이 match가 오류가 나서 빠뜨릴 수 없습니다.                                   |
| `json_string`                                               | JSON 문자열 안의 `"`와 `\`는 앞에 `\`를 붙여야 합니다. 이스케이프하지 않으면 `"따옴표"`에서 문자열이 끝난 것으로 읽혀 JSON이 깨집니다. |
| `format!("{{{}}}\n", ...)`                                  | `format!`에서 `{{`와 `}}`는 글자 `{`, `}`입니다. 가운데 `{}`가 항목들이 들어갈 자리입니다.                                             |
| `[text]` 출력의 `"따옴표" 주제,10`                          | 이 예제의 text 형식은 설명을 위해 줄였습니다. 실제 보고서라면 쉼표나 따옴표가 든 값의 표기를 계약으로 정해야 합니다(Day 84, Day 89).   |

JSON에는 줄바꿈 같은 제어 문자의 이스케이프 규칙도 있습니다. 실제로 JSON을 많이 다룬다면 검증된 라이브러리(Python의 `json`, Rust의 `serde_json`)를 쓰는 것이 안전합니다.

## 8. 실행 추적

Python 예제의 `bar`와 `report(ROWS, chart=True)`가 확장 부분을 만드는 과정입니다.

| 언어         | 합계 v | v + 9 | (v + 9) // 10 | min(40, ...) | 줄               |
| ------------ | ------ | ----- | ------------- | ------------ | ---------------- |
| C            | 45     | 54    | 5             | 5            | `C: #####`       |
| Python       | 60     | 69    | 6             | 6            | `Python: ######` |
| Rust         | 25     | 34    | 3             | 3            | `Rust: ###`      |
| (시험) 10080 | 10080  | 10089 | 1008          | 40           | 40칸             |

`by_lang`이 `sorted`로 만든 순서(C, Python, Rust)를 그대로 쓰므로, 막대의 순서도 `language_totals`와 같습니다.

## 9. 다른 예제로 다시 이해하기

**버전 번호 올리기.** 변경의 종류로 다음 버전을 정하고, 버전을 올바르게 정렬합니다.

```python
# 파일: next_version.py
def bump(version, changes):
    major, minor, patch = (int(p) for p in version.split("."))
    if "breaking" in changes:                     # 기존 사용법의 출력이나 동작이 바뀜
        return f"{major + 1}.0.0"
    if "feature" in changes:                      # 새 선택 옵션 추가, 기존 출력은 그대로
        return f"{major}.{minor + 1}.0"
    if "fix" in changes:                          # 계약대로 동작하도록 버그만 고침
        return f"{major}.{minor}.{patch + 1}"
    return version


releases = [
    ("1.2.3", {"fix"}, "빈 결과의 평균을 0.00으로"),
    ("1.2.3", {"feature", "fix"}, "--chart 추가와 버그 수정"),
    ("1.2.3", {"breaking"}, "기본 정렬을 날짜로 바꿈"),
    ("1.2.3", set(), "문서만 고침"),
]
for version, changes, note in releases:
    print(f"{version} → {bump(version, changes):6} {note}")
print(sorted(["1.10.0", "1.9.5", "1.2.3"]))
print(sorted(["1.10.0", "1.9.5", "1.2.3"], key=lambda v: tuple(int(p) for p in v.split("."))))
```

실행 결과:

```text
1.2.3 → 1.2.4  빈 결과의 평균을 0.00으로
1.2.3 → 1.3.0  --chart 추가와 버그 수정
1.2.3 → 2.0.0  기본 정렬을 날짜로 바꿈
1.2.3 → 1.2.3  문서만 고침
['1.10.0', '1.2.3', '1.9.5']
['1.2.3', '1.9.5', '1.10.0']
```

| 코드                                                | 설명                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `if "breaking" ... elif "feature" ... elif "fix"`   | 가장 큰 변경 하나가 버전을 정합니다. 기능 추가와 버그 수정이 함께 있으면 minor를 올리고 patch는 0입니다. |
| `f"{major}.{minor + 1}.0"`                          | 앞 번호를 올리면 뒤 번호는 0으로 되돌립니다(실습의 디버그 문제).                                         |
| `{bump(...):6}`                                     | 버전을 6칸에 맞춰 설명의 시작 위치를 맞춥니다. 버전은 ASCII라 칸 수와 글자 수가 같습니다.                |
| `sorted([...])`                                     | 문자열 정렬이라 `"1.10.0"`이 가장 앞에 옵니다. 틀린 결과입니다.                                          |
| `key=lambda v: tuple(int(p) for p in v.split("."))` | 정수 튜플로 바꿔 정렬하면 1.2.3 < 1.9.5 < 1.10.0이 됩니다.                                               |

**비율 막대.** 가장 큰 값이 정해진 너비가 되도록 줄여 그립니다. 상한에 걸려 모두 같은 길이가 되는 문제를 피하고, 숫자를 막대 옆에 함께 씁니다.

```rust
// 파일: scaled_bars.rs
fn bars(totals: &[(&str, u32)], width: u32) -> Vec<String> {
    let max = totals.iter().map(|&(_, v)| v).max().unwrap_or(0);
    totals
        .iter()
        .map(|&(k, v)| {
            let n = if max == 0 { 0 } else { (v * width + max / 2) / max };   // 가장 큰 값이 width칸, 반올림
            format!("{k:<6} {:<w$} {v}", "#".repeat(n as usize), w = width as usize)
        })
        .collect()
}

fn main() {
    let totals = [("C", 45), ("Python", 60), ("Rust", 25)];
    for line in bars(&totals, 12) {
        println!("{line}");
    }
    println!("{}", bars(&[("C", 0)], 12)[0]);
}
```

실행 결과:

```text
C      #########    45
Python ############ 60
Rust   #####        25
C                   0
```

- `(v * width + max / 2) / max`는 `v * width / max`를 반올림한 값입니다. 45 × 12 = 540, 540 + 30 = 570, 570 / 60 = 9칸입니다.
- `max == 0`이면 나누기 전에 0칸으로 정합니다. 빈 결과나 0분만 있을 때 0으로 나누면 Rust는 패닉합니다.
- `{:<w$}`로 막대를 너비 12에 맞춰, 숫자가 같은 열에 오게 했습니다. `#`과 언어 이름은 ASCII라 칸 수가 맞습니다. 한글 주제 이름이라면 Day 86에서 본 것처럼 칸이 어긋날 수 있습니다.
- `v * width`는 `u32` 곱셈입니다. 분이 최대 10080이고 너비가 작으면 넘치지 않지만, 합계가 아주 커질 수 있다면 `u64`로 계산하세요.

## 10. 변경의 종류 정리

| 변경                                 | 기존 사용자에게           | 버전   | 필요한 시험                                      |
| ------------------------------------ | ------------------------- | ------ | ------------------------------------------------ |
| 버그 수정(계약대로 동작하게)         | 틀렸던 결과가 바르게 바뀜 | patch  | 버그를 재현한 사례 추가                          |
| 새 선택 옵션(`--chart`, `--min`)     | 변화 없음                 | minor  | 옵션 없는 출력 == 이전, 새 옵션의 정상·오류 사례 |
| 새 출력 형식(`--format json`)        | 변화 없음(기본은 text)    | minor  | 형식별 골든 파일, 이스케이프 사례                |
| 기본 동작 변경(기본 정렬, 출력 모양) | 출력이 달라짐             | major  | 골든 파일 갱신, 변경 기록에 이전 방법 안내       |
| 문서만 고침                          | 변화 없음                 | 그대로 | 없음                                             |

## 11. 세 언어 비교

| 관점           | Python                            | C                                  | Rust                                          |
| -------------- | --------------------------------- | ---------------------------------- | --------------------------------------------- |
| 선택 옵션 받기 | `argparse`, `action="store_true"` | `argv`를 직접 훑기                 | `std::env::args`를 직접 훑기(또는 라이브러리) |
| 옵션 값 검증   | `type=int`, `choices=`, 직접 검사 | `strtol` + `end` + `errno` + 범위  | `parse::<u32>()` + 범위, `FromStr`            |
| 형식 선택      | 문자열 비교, `Enum`               | `enum` + `switch`(빠뜨려도 경고만) | `enum` + `match`(빠뜨리면 컴파일 오류)        |
| 문자열 반복    | `"#" * n`                         | 반복문으로 `putchar('#')`          | `"#".repeat(n)`                               |
| 버전 비교      | 정수 튜플                         | 정수 세 개를 차례로 비교           | `derive(Ord)` 구조체                          |

C의 `switch`도 `-Wall`을 주면 enum 값을 빠뜨렸을 때 경고(`-Wswitch`)를 줍니다. 이 과정처럼 `-Werror`를 함께 쓰면 경고가 오류가 되어 Rust와 비슷한 효과를 얻습니다. 단, `default:` 갈래가 있으면 경고가 나오지 않습니다.

## 12. 자주 하는 실수

### 실수 1: 새 기능을 기본으로 켠다

실습의 변형 문제입니다. 기본값을 켜 두면 아무것도 바꾸지 않은 사용자의 결과가 바뀝니다. 새 기능은 옵션을 준 사람만 보게 하세요.

### 실수 2: 확장 출력을 공통 보고서 중간에 끼운다

`language_totals` 바로 뒤에 막대를 넣으면 옵션을 켰을 때 `topic_totals` 줄의 위치가 바뀌어, 보고서를 줄 번호로 읽던 프로그램이 틀린 값을 읽습니다. 확장은 끝에 붙이세요.

### 실수 3: 시험을 새 출력에 맞춰 고친다

옵션 없는 출력이 달라져 골든 시험이 실패했을 때, 골든 파일을 새 출력으로 바꾸면 호환성이 깨진 것을 숨기게 됩니다. 먼저 "이 변경이 의도한 major 변경인가?"를 묻고, 아니라면 코드를 고치세요.

### 실수 4: 새 옵션만 느슨하게 검증한다

`--min`을 `atoi`로 읽으면 `"3O"`는 3, `"abc"`는 0이 되어 조용히 넘어갑니다(Day 88). 새 옵션도 기존 값과 같은 엄격함으로 검증하세요.

### 실수 5: 버전을 문자열로 비교한다

실습의 예측 문제처럼 `"1.10.0" > "1.9.5"`는 False입니다. 점으로 나눠 정수로 바꾼 뒤 비교하세요.

## 13. Q&A

**Q. 호환성을 깨는 변경은 절대 하면 안 되나요?**

A. 아닙니다. 처음 설계가 잘못되었다면 고치는 것이 낫습니다. 다만 major 버전을 올리고, 변경 기록에 무엇이 바뀌었고 예전처럼 쓰려면 어떻게 하는지(예: `--sort minutes`를 직접 주기) 적습니다. 가능하면 한 버전 동안 경고를 먼저 보내고 다음 major 버전에서 바꾸는 방법도 씁니다.

**Q. Python에만 있는 --chart를 C와 Rust에도 넣으려면?**

A. 먼저 계약에 막대의 규칙(한 칸의 크기, 올림, 상한, 순서)을 정확히 적습니다. 그다음 세 구현에 넣고, Day 91의 비교 스크립트에 `--chart` 사례를 추가합니다. 규칙이 계약에 없으면 구현마다 반올림 방식이 달라지기 쉽습니다.

**Q. 이 과정을 마친 뒤에는 무엇을 하면 좋나요?**

A. 오늘의 도전 문제로 Study Log Analyzer를 직접 확장해 보세요. 그다음에는 세 언어 중 하나를 골라 조금 더 큰 프로그램(파일 여러 개, 외부 라이브러리 사용)을 만들어 보기를 권합니다. Python이라면 `pytest`와 패키지 구조, C라면 `make`와 여러 소스 파일, Rust라면 `cargo`와 크레이트가 다음 단계입니다. 막히면 이 과정의 해당 Day로 돌아와 복습 일정(1, 3, 7, 14, 30일 뒤)에 맞춰 다시 풀어 보세요.

## 14. 핵심 요약

- 새 기능은 **선택 옵션**으로 넣고 기본값은 예전 동작으로 둡니다. 확장 출력은 공통 보고서 **뒤에** 붙이고, "옵션 없는 출력 == 확장 전", "확장 출력이 확장 전 출력으로 시작"을 시험으로 지킵니다.
- 새 옵션의 값도 계약과 같은 규칙으로 엄격하게 검증합니다. C는 `strtol`의 `end`, `errno`, 범위를, Rust는 `parse`와 `FromStr`을 씁니다.
- 형식처럼 선택지가 정해진 값은 enum으로 만들면, 새 변형을 추가할 때 `match`가 처리를 빠뜨리지 않게 해 줍니다. JSON 문자열은 `"`와 `\`를 이스케이프합니다.
- 버전은 major.minor.patch이고 호환성 깨짐, 기능 추가, 버그 수정에 따라 올리며, 앞을 올리면 뒤는 0입니다. 비교는 정수 묶음으로 합니다.
- 출시 전에는 시험, 세 구현 비교, 경고 없는 빌드, 문서와 알려진 차이, 변경 기록을 확인합니다.

## 15. 도전 문제

1. **(Python)** 저장소의 `study_log.py`에 `--min N` 옵션을 추가하세요. 옵션 없는 출력이 바뀌지 않았는지 `scripts/verify-capstone.py`로 확인하고, `--min 0`과 `--min abc`가 오류로 끝나는지 시험하세요.
2. **(C)** Day 88의 minutes 검사 함수를 `--min`에도 그대로 써서, 앞의 0(`"007"`)도 거절하게 하세요. 한 함수를 두 곳에서 쓰면 무엇이 좋은지 설명해 보세요.
3. **(Rust)** 오늘의 `Format`에 `Csv` 변형을 추가하고, 컴파일 오류가 어디서 나는지 확인한 뒤 처리하세요. CSV에서 쉼표나 따옴표가 든 값은 따옴표로 감싸고 안의 `"`는 `""`로 적으세요.
4. **(세 언어)** `--chart`의 규칙을 계약으로 적고 C와 Rust에도 넣은 뒤, Day 91의 비교 스크립트에 `--chart` 사례를 추가해 세 출력이 같은지 확인하세요. 모두 끝나면 버전을 몇으로 올려야 할지 정하고 변경 기록을 써 보세요.

## Study Log Analyzer 실제 프로젝트

92일 동안 배운 것이 모두 들어 있는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 처음부터 끝까지 읽어 보세요. README의 사용법, Python의 `--chart` 선택 확장, `scripts/verify-capstone.py`의 비교 사례를 오늘의 점검 목록과 하나씩 맞춰 보고, 도전 문제의 확장을 직접 넣어 보세요.
