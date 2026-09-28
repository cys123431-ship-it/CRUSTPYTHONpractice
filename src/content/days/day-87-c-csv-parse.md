---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-87-c-csv-parse
courseId: crp-92
phaseId: phase-08
dayNumber: 87
date: "2026-12-26"
title: C 입력 검증과 정수 변환
summary: Study Log Analyzer의 C 구현에서 파일을 읽고 검증하는 부분을 완성합니다. fgets 버퍼보다 긴 줄을 알아내는 법, 따옴표와 "" 를 인식하고 닫는 따옴표 뒤의 글자·칸 중간의 따옴표·CRLF 줄 끝까지 다루는 칸 나누기, 헤더 비교, 그리고 문자열을 정수로 바꾸는 여러 방법(atoi, strtol·strtoll·strtoul의 end 포인터와 errno ERANGE, sscanf)의 차이와 계약에 맞는 minutes 검사를 다룹니다. Python의 int와 Rust의 parse가 받아들이는 입력(공백, 부호, 앞자리 0, 밑줄, 전각 숫자, 아주 큰 수)이 서로 다르다는 것을 표로 비교해, 세 구현이 같은 입력을 같게 판단하려면 변환 전에 모양을 먼저 확인해야 한다는 결론을 확인합니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-86-python-aggregate]
learningObjectives:
  - fgets로 줄을 읽으며 버퍼보다 긴 줄과 CRLF 줄 끝을 올바르게 처리한다.
  - 따옴표 규칙을 모두 지키는 C 칸 나누기를 만들고 잘못된 형식을 거절한다.
  - atoi와 strtol 계열의 차이(오류 확인, end 포인터, errno)를 설명하고 안전한 변환을 쓴다.
  - Python int와 Rust parse가 계약보다 너그러운 경우를 찾아, 모양 검사를 먼저 하는 이유를 설명한다.
  - 정규 표현식 fullmatch로 모양 검사를 짧게 쓴다.
concepts:
  [
    fgets,
    long line detection,
    crlf,
    csv state machine,
    quote after close,
    header check,
    atoi,
    strtol,
    strtoll,
    strtoul,
    end pointer,
    errno,
    erange,
    integer overflow,
    lenient parsing,
    strict validation,
    int,
    parse u32,
    int error kind,
    regex fullmatch,
  ]
runnerMode: python
playgroundSource: |
  # 파일: lenient_play.py — int가 받아들이는 것과 계약이 받아들이는 것을 비교해 보세요.
  for s in ["30", " 30 ", "+30", "030", "3_0", "30.0"]:
      try:
          print(repr(s), "→", int(s))
      except ValueError:
          print(repr(s), "→ ValueError")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day87-predict-end
    title: strtol의 end 포인터 예측하기
    kind: predict
    objective: strtol이 숫자를 읽다 멈춘 곳을 end로 알려 준다는 것을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          char *end;
          long v = strtol("45min", &end, 10);
          printf("%ld %s\n", v, end);
          return 0;
      }
    answer: "45 min"
    hint: "strtol은 읽을 수 있는 만큼 숫자를 읽고, 멈춘 곳의 주소를 end에 넣습니다."
    explanation: "45까지 읽고 m에서 멈춰서, end는 \"min\"의 첫 글자를 가리킵니다. 그래서 *end != '\\0'이면 '뒤에 다른 글자가 남았다'는 뜻이고, end == 원래 문자열이면 숫자가 하나도 없었다는 뜻입니다. atoi(\"45min\")은 45만 돌려줘서 이런 확인을 할 수 없습니다."
    commonMistakes:
      - "strtol이 실패해 0을 돌려준다고 생각함"
      - "end가 문자열 끝을 가리킨다고 생각함"
    language: c
    verification: run
  - id: ex-day87-predict-rs
    title: Rust parse가 받아들이는 것 예측하기
    kind: predict
    objective: Rust의 parse도 계약보다 너그러운 경우가 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let a = "+30".parse::<u32>();
          let b = "030".parse::<u32>();
          let c = " 30".parse::<u32>();
          println!("{:?} {:?} {}", a, b, c.is_err());
      }
    answer: "Ok(30) Ok(30) true"
    hint: "Rust는 앞의 + 부호와 앞자리 0을 받아들이지만, 공백은 받아들이지 않습니다."
    explanation: '"+30"과 "030"은 둘 다 Ok(30)이라, 계약(부호 없음, 앞자리 0 없음)을 지키려면 parse 전에 모양을 확인해야 합니다. 공백은 거절합니다. Python의 int는 공백까지 받아들이고, C의 strtol은 앞 공백과 부호를 받아들입니다. 세 언어의 ''너그러움''이 서로 다르기 때문에, 변환 함수를 믿지 말고 모양 검사를 먼저 해야 세 구현이 같게 판단합니다.'
    commonMistakes:
      - '"+30"이 오류라고 생각함'
      - '"030"을 8진수로 읽는다고 생각함'
    language: rust
    verification: run
  - id: ex-day87-fill
    title: 범위 넘침 확인하기 채우기
    kind: fill
    objective: strtoll이 범위를 넘었을 때 errno에 남기는 값을 확인한다.
    prompt: "빈칸을 채워 너무 큰 수를 읽었을 때 '범위 넘침'이 출력되게 하세요."
    starter: |-
      #include <errno.h>
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          errno = 0;
          long long v = strtoll("99999999999999999999", NULL, 10);
          if (errno == _____) {
              printf("범위 넘침\n");
          } else {
              printf("%lld\n", v);
          }
          return 0;
      }
    answer: |-
      #include <errno.h>
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          errno = 0;
          long long v = strtoll("99999999999999999999", NULL, 10);
          if (errno == ERANGE) {
              printf("범위 넘침\n");
          } else {
              printf("%lld\n", v);
          }
          return 0;
      }
    output: "범위 넘침"
    hint: '"결과가 범위(range)를 넘었다"는 오류 번호의 이름입니다.'
    explanation: "범위를 넘으면 strtoll은 LLONG_MAX를 돌려주고 errno를 ERANGE로 바꿉니다. 돌려준 값만 보면 진짜 LLONG_MAX와 구별할 수 없어서 errno를 봐야 합니다. errno는 성공해도 0으로 바뀌지 않으므로 부르기 전에 errno = 0;으로 지워 두는 것이 중요합니다. atoi는 이 경우가 정의되지 않은 동작이라 절대 쓰면 안 됩니다."
    commonMistakes:
      - "errno = 0을 빠뜨려 이전 오류가 남아 있음"
      - "EOF나 EINVAL과 비교함"
    language: c
    verification: run
  - id: ex-day87-modify
    title: atoi를 strtol과 end 검사로 바꾸기
    kind: modify
    objective: 뒤에 글자가 남은 입력을 거절하도록 변환 방법을 바꾼다.
    prompt: 'atoi("12abc")는 12를 돌려줘 잘못된 입력을 알아채지 못합니다. strtol과 end 포인터로 바꿔, 숫자가 없거나 뒤에 글자가 남으면 ''거절''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          const char *s = "12abc";
          int v = atoi(s);
          printf("%d\n", v);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          const char *s = "12abc";
          char *end;
          long v = strtol(s, &end, 10);
          if (end == s || *end != '\0') {
              printf("거절\n");
          } else {
              printf("%ld\n", v);
          }
          return 0;
      }
    output: "거절"
    starterOutput: "12"
    hint: "end가 s와 같으면 숫자가 없고, *end가 널 문자가 아니면 뒤에 글자가 남은 것입니다."
    explanation: 'atoi는 실패를 알릴 방법이 없어서 "abc"도 0, "12abc"도 12입니다. strtol은 end로 어디까지 읽었는지 알려 줘서 ''문자열 전체가 숫자인가''를 확인할 수 있습니다(Day 43). 계약은 앞 공백과 부호도 허용하지 않으므로, 실제 프로젝트는 그보다 먼저 모든 글자가 숫자인지 확인합니다.'
    commonMistakes:
      - "v == 0으로 실패를 판단해 진짜 0과 구별하지 못함"
      - "end를 &end가 아니라 end로 넘겨 자료형 오류가 남"
    language: c
    verification: run
  - id: ex-day87-debug
    title: 0분을 통과시키는 검사 고치기
    kind: debug
    objective: 앞자리 0과 1 미만 값을 거절하도록 검사를 보완한다.
    prompt: '이 검사는 "0"을 통과시켜 ''0 → 통과''를 출력합니다. 계약(1~10080, 앞자리 0 없음)에 맞게 고쳐 ''0 → 거절''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int minutes_ok(const char *s) {
          if (s[0] == '\0' || strspn(s, "0123456789") != strlen(s) || strlen(s) > 5) {
              return 0;
          }
          long v = strtol(s, NULL, 10);
          return v <= 10080;
      }

      int main(void) {
          printf("0 → %s\n", minutes_ok("0") ? "통과" : "거절");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int minutes_ok(const char *s) {
          if (s[0] == '\0' || s[0] == '0' || strspn(s, "0123456789") != strlen(s) || strlen(s) > 5) {
              return 0;
          }
          long v = strtol(s, NULL, 10);
          return v >= 1 && v <= 10080;
      }

      int main(void) {
          printf("0 → %s\n", minutes_ok("0") ? "통과" : "거절");
          return 0;
      }
    output: "0 → 거절"
    starterOutput: "0 → 통과"
    hint: "Day 84의 경계 사례를 떠올리세요. 0은 범위 밖이고, 030은 앞자리 0입니다."
    explanation: "첫 글자가 '0'이면 0이거나 앞자리 0이라 모두 거절입니다. 여기에 v >= 1까지 두면 두 겹으로 막힙니다. strlen(s) > 5 검사는 여섯 자리 이상(최소 100000 > 10080)을 strtol 전에 거절해서 long이 넘칠 걱정도 없앱니다. 한 줄의 검사가 계약의 여러 규칙을 나눠 맡고 있어서, 경계 사례 표로 하나씩 확인해야 빠진 규칙이 보입니다."
    commonMistakes:
      - "v >= 1만 추가하고 030을 통과시킴"
      - "v > 0 && v < 10080으로 고쳐 10080을 거절함"
    language: c
    verification: run
  - id: ex-day87-independent
    title: Python 정규 표현식으로 날짜 모양 확인하기
    kind: independent
    objective: fullmatch와 ASCII 숫자 클래스로 모양만 확인한다.
    prompt: 're.fullmatch로 ''YYYY-MM-DD'' 모양(ASCII 숫자 4-2-2)인지 확인해 ["2026-10-01", "2026-1-01", "2026-10-01x"]에 대해 ''[True, False, False]''를 출력하세요.'
    starter: |-
      import re

      samples = ["2026-10-01", "2026-1-01", "2026-10-01x"]
      print(samples)
    answer: |-
      import re

      samples = ["2026-10-01", "2026-1-01", "2026-10-01x"]
      print([bool(re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", s)) for s in samples])
    output: "[True, False, False]"
    hint: "match는 앞부분만 맞아도 성공하고, fullmatch는 전체가 맞아야 성공합니다. \\d 대신 [0-9]를 쓰면 ASCII 숫자만입니다."
    explanation: "\\d는 유니코드 숫자(전각 ３, 아랍 ٣)까지 맞아서, 계약의 'ASCII 숫자'를 지키려면 [0-9]나 re.ASCII 플래그를 씁니다. fullmatch를 쓰지 않으면 '2026-10-01x'가 통과합니다. 모양 검사를 통과한 뒤에 달력 검사(date.fromisoformat)를 하면 2026-02-30도 거를 수 있습니다."
    commonMistakes:
      - "re.match를 써서 끝에 글자가 붙어도 통과시킴"
      - "\\d{4}를 써서 전각 숫자를 통과시킴"
    language: python
    verification: run
quiz:
  - id: quiz-day87-01
    question: fgets로 읽은 버퍼에 '\n'이 없고 파일이 끝나지 않았다면?
    choices:
      - 빈 줄이다
      - 줄이 버퍼보다 길어서 일부만 읽었다
      - 파일 끝이다
      - 오류가 났다
    answerIndex: 1
    explanation: fgets는 줄 끝이나 버퍼 크기 - 1 중 먼저 오는 곳에서 멈춥니다(Day 46). 줄바꿈이 없는데 feof도 아니면 줄이 잘린 것이라, 이 프로젝트는 '너무 긴 줄' 오류로 끝냅니다. 마지막 줄에 줄바꿈이 없는 파일은 feof로 구별합니다.
  - id: quiz-day87-02
    question: atoi 대신 strtol을 써야 하는 가장 큰 이유는?
    choices:
      - 더 빨라서
      - atoi는 실패나 범위 넘침을 알릴 방법이 없고, 넘치면 정의되지 않은 동작이라서
      - atoi는 음수를 못 읽어서
      - 표준에 없어서
    answerIndex: 1
    explanation: strtol은 end 포인터로 읽은 곳을, errno로 범위 넘침을 알려 줍니다. 사용자 입력을 변환할 때는 항상 strtol 계열을 쓰세요.
  - id: quiz-day87-03
    question: 닫는 따옴표 뒤에 글자가 붙은 칸("배열"x)을 거절하는 이유는?
    choices:
      - 속도 때문에
      - CSV 규칙상 틀린 형식이고, 구현마다 다르게 해석(배열x, 배열, 오류)할 수 있어서 계약으로 거절을 정했기 때문
      - C가 처리하지 못해서
      - 한글이라서
    answerIndex: 1
    explanation: 애매한 입력은 구현마다 다르게 해석되기 쉬워서, 계약은 '모두 거절'로 정했습니다. Python의 csv 모듈은 strict=True일 때 이런 입력에 오류를 냅니다. C와 Rust 구현도 같은 규칙을 지켜야 결과가 같습니다.
  - id: quiz-day87-04
    question: Python int, Rust parse, C strtol 중 " 30"(앞 공백)을 받아들이는 것은?
    choices:
      - 셋 다 받아들인다
      - Python int와 C strtol은 받아들이고, Rust parse는 거절한다
      - 셋 다 거절한다
      - Rust만 받아들인다
    answerIndex: 1
    explanation: 변환 함수마다 너그러움이 다릅니다. 그래서 계약의 모양(ASCII 숫자만, 앞자리 0 없음)을 변환 전에 직접 확인해야 세 구현이 같게 판단합니다.
  - id: quiz-day87-05
    question: minutes 검사에서 strlen(s) > 5를 먼저 거절하는 효과는?
    choices:
      - 아무 효과가 없다
      - 10080을 넘는 여섯 자리 이상 입력을 변환 전에 거절해 정수 넘침을 걱정할 필요가 없게 한다
      - 5자리 입력을 거절한다
      - 앞자리 0을 막는다
    answerIndex: 1
    explanation: 가장 큰 허용값 10080이 다섯 자리라 여섯 자리 이상은 모두 범위 밖입니다. 자릿수로 먼저 거르면 아무리 긴 숫자가 와도 변환 함수가 넘칠 일이 없습니다. 실제 프로젝트는 strtoul과 errno로 같은 일을 합니다.
---

## 1. 오늘 배울 내용

Day 85에서 Python으로 입력을 읽고 검증했습니다. 오늘은 같은 일을 **C**로 합니다. C에는 CSV 파서도, 예외도, 크기가 늘어나는 문자열도 없어서, Day 37(문자열), Day 43(출력 매개변수), Day 46(파일)에서 배운 것을 모두 써야 합니다.

1. `fgets`로 줄 읽기
   - 버퍼보다 긴 줄 알아내기
   - Windows식 줄 끝(CRLF, `\r\n`) 처리
2. 완성된 칸 나누기(Day 83의 확장)
   - 닫는 따옴표 뒤에 다른 글자 → 거절
   - 칸 중간의 따옴표 → 거절
   - 닫히지 않은 따옴표 → 거절
3. 헤더 비교
4. **문자열 → 정수** 변환의 여러 방법
   - `atoi`: 실패를 알 수 없음
   - `strtol`·`strtoll`·`strtoul`: `end` 포인터와 `errno == ERANGE`
   - 계약에 맞는 `minutes` 검사
5. Python `int`, Rust `parse`가 받아들이는 입력을 표로 비교합니다.
6. 모양 검사를 짧게 쓰는 정규 표현식 `fullmatch`를 봅니다.

## 2. 왜 필요한가

입력 검증은 C 프로그램에서 **보안 문제가 가장 많이 생기는 곳**입니다.

- 버퍼보다 긴 줄을 그대로 복사하면 넘칩니다(Day 37).
- `atoi("99999999999999999999")`는 정의되지 않은 동작입니다.
- 따옴표가 닫히지 않은 줄을 끝까지 따라가다 버퍼 밖을 읽을 수 있습니다.

또 세 구현이 같은 결과를 내려면 **같은 입력을 같게 판단**해야 합니다. 그런데 변환 함수들의 규칙이 언어마다 다릅니다. Python `int(" 30 ")`은 30이고, Rust `" 30".parse()`는 오류이며, C `strtol(" 30")`은 30입니다. 오늘은 이 차이를 표로 확인하고, **변환 전에 모양을 먼저 검사**하는 것이 왜 해답인지 봅니다.

## 3. 그림으로 이해하기

**C 읽기 흐름.**

```text
fopen ─▶ fgets(line, 256) ─┬─ '\n'이 없고 끝도 아님 ─▶ "N행이 너무 깁니다"
                           │
                           ▼
                     csv_fields(line) ──실패──▶ "N행의 CSV 형식이 올바르지 않습니다"
                           │
                 1행? ── 헤더와 strcmp ──다름──▶ "헤더가 다릅니다"
                           │
                           ▼
                  칸마다 검사(날짜, 언어, 주제, minutes_valid, 결과)
                           │
                           ▼
                     Session에 복사(Day 85의 make_session)
```

**칸 나누기의 상태.** 따옴표 안인지(`quoted`), 막 닫았는지(`ended`), 칸의 맨 앞인지(`start`)를 기억합니다.

```text
      ┌──── '"' (칸 맨 앞) ────┐
      ▼                         │
 [따옴표 밖] ◀── '"' 하나 ── [따옴표 안] ── '""' → 글자 " ──┐
      │    (ended = 1로)           ▲ └─ 다른 글자 → 모음 ──────┘
      │                            └─ '\0' 또는 '\n' → 실패(닫히지 않음)
      ├─ ',' → 다음 칸
      ├─ ended인데 ',' 아닌 글자 → 실패
      ├─ 칸 중간의 '"' → 실패
      └─ '\n', '\0' → 다섯째 칸이면 성공
```

**strtol이 알려 주는 것.**

```text
strtol("12abc", &end, 10)
         ▲ ▲
         │ └── end: 여기서 멈춤  → *end == 'a' → 뒤에 글자 남음
         └──── 시작              → end != 시작 → 숫자는 있었음
돌려준 값: 12      errno: 그대로(범위 안)
```

## 4. 천천히 풀어보기

### 4.1 긴 줄과 CRLF

- `fgets(line, sizeof line, f)`가 돌려준 줄에 `'\n'`이 없으면 두 가지 경우입니다.
  1. 줄이 버퍼보다 길다 → 오류
  2. 파일의 마지막 줄에 줄바꿈이 없다 → 정상
     둘은 `feof(f)`로 구별합니다.
- Windows에서 만든 파일은 줄 끝이 `\r\n`입니다. 칸 나누기에서 `\r` 다음이 `\n`이나 끝이면 건너뜁니다. 그러지 않으면 마지막 칸이 `"pass\r"`이 되어 `"pass"`와 달라집니다.

### 4.2 정수 변환 함수 비교

| 함수                  | 실패를 아는 법             | 범위를 넘으면                | 앞 공백 | 부호                      |
| --------------------- | -------------------------- | ---------------------------- | ------- | ------------------------- |
| `atoi(s)`             | 알 수 없음                 | 정의되지 않은 동작           | 허용    | 허용                      |
| `strtol(s, &end, 10)` | `end == s`, `*end != '\0'` | `LONG_MAX`, `errno = ERANGE` | 허용    | 허용                      |
| `strtoll`             | 같음                       | `LLONG_MAX`, `ERANGE`        | 허용    | 허용                      |
| `strtoul`             | 같음                       | `ULONG_MAX`, `ERANGE`        | 허용    | **`-`도 허용**(값이 바뀜) |
| `sscanf(s, "%d", &v)` | 반환값(읽은 개수)          | 정의되지 않은 동작           | 허용    | 허용                      |

`long`의 크기는 운영체제마다 다릅니다(Linux 64비트는 8바이트, Windows는 4바이트). 크기가 중요한 곳에서는 `long long`(`strtoll`)이나 자릿수 제한을 씁니다. 이 프로젝트는 자릿수가 다섯 자리 이하인지 먼저 보고 변환해서 크기 차이의 영향을 받지 않습니다.

### 4.3 계약에 맞는 minutes 검사

```text
1. 비어 있지 않은가
2. 첫 글자가 '0'이 아닌가          (0과 앞자리 0을 함께 거름)
3. 모든 글자가 ASCII 숫자인가       (공백, 부호, 전각 숫자를 거름)
4. 변환: strtoul + errno == 0 + *end == '\0'
5. 1 <= v <= 10080
```

1~3이 **모양**, 4~5가 **값**입니다. 모양을 먼저 보면 변환 함수가 너그러운 부분(공백, 부호)은 이미 걸러진 뒤라, 어느 언어의 변환 함수를 써도 같은 판단이 됩니다.

## 5. C로 구현하기

```c
// 파일: c_load.c
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 256
#define NF 5

// 따옴표를 인식해 다섯 칸으로 나눈다. 실패하면 0
static int csv_fields(const char *line, char out[NF][MAX_LINE]) {
    size_t col = 0, pos = 0;
    int quoted = 0, ended = 0, start = 1;
    memset(out, 0, NF * MAX_LINE);
    for (size_t i = 0;; i++) {
        char ch = line[i];
        if (quoted) {
            if (ch == '\0' || ch == '\n') {
                return 0;                   // 닫히지 않은 따옴표(여러 줄 칸은 받지 않음)
            }
            if (ch == '"' && line[i + 1] == '"') {
                i++;                        // "" → "
            } else if (ch == '"') {
                quoted = 0;
                ended = 1;
                continue;
            }
            if (pos + 1 >= MAX_LINE) {
                return 0;
            }
            out[col][pos++] = ch;
            continue;
        }
        if (ended && ch != ',' && ch != '\r' && ch != '\n' && ch != '\0') {
            return 0;                       // 닫는 따옴표 뒤에 다른 글자
        }
        if (ch == '"') {
            if (!start) {
                return 0;                   // 칸 중간의 따옴표
            }
            quoted = 1;
            start = 0;
            continue;
        }
        if (ch == ',') {
            if (++col >= NF) {
                return 0;
            }
            pos = 0;
            start = 1;
            ended = 0;
            continue;
        }
        if (ch == '\r' && (line[i + 1] == '\n' || line[i + 1] == '\0')) {
            continue;                       // CRLF 줄 끝
        }
        if (ch == '\n' || ch == '\0') {
            return col == NF - 1;
        }
        if (pos + 1 >= MAX_LINE) {
            return 0;
        }
        out[col][pos++] = ch;
        start = 0;
    }
}

static int minutes_valid(const char *text, unsigned *out) {
    if (*text == '\0' || *text == '0') {
        return 0;
    }
    for (const char *c = text; *c; c++) {
        if (!isdigit((unsigned char)*c)) {
            return 0;
        }
    }
    errno = 0;
    char *end = NULL;
    unsigned long v = strtoul(text, &end, 10);
    if (errno != 0 || *end != '\0' || v < 1 || v > 10080) {
        return 0;
    }
    *out = (unsigned)v;
    return 1;
}

// 파일을 검증하며 읽는다. 성공하면 읽은 행 수, 실패하면 -1(이유는 stdout에 출력: 레슨용)
static int load(const char *path) {
    FILE *f = fopen(path, "r");
    if (f == NULL) {
        printf("  오류: 파일 읽기 실패\n");
        return -1;
    }
    char line[MAX_LINE], fields[NF][MAX_LINE];
    int count = 0;
    size_t number = 0;
    int ok = 1;
    while (fgets(line, sizeof line, f) != NULL) {
        number++;
        if (strchr(line, '\n') == NULL && !feof(f)) {   // 버퍼보다 긴 줄
            printf("  오류: %zu행이 너무 깁니다\n", number);
            ok = 0;
            break;
        }
        if (!csv_fields(line, fields)) {
            printf("  오류: %zu행의 CSV 형식이 올바르지 않습니다\n", number);
            ok = 0;
            break;
        }
        if (number == 1) {
            if (strcmp(fields[0], "date") || strcmp(fields[1], "language") || strcmp(fields[2], "topic") ||
                strcmp(fields[3], "minutes") || strcmp(fields[4], "result")) {
                printf("  오류: 헤더가 다릅니다\n");
                ok = 0;
                break;
            }
            continue;
        }
        unsigned m;
        if (!minutes_valid(fields[3], &m)) {
            printf("  오류: %zu행: minutes '%s'\n", number, fields[3]);
            ok = 0;
            break;
        }
        count++;
    }
    fclose(f);
    return ok ? count : -1;
}

int main(void) {
    const char *files[][2] = {
        {"good.csv", "date,language,topic,minutes,result\n2026-10-01,Python,변수,30,pass\n2026-10-02,C,\"배열, 포인터\",45,retry\r\n"},
        {"quote.csv", "date,language,topic,minutes,result\n2026-10-02,C,\"배열\"x,45,retry\n"},
        {"minutes.csv", "date,language,topic,minutes,result\n2026-10-02,C,x,99999999999999999999,retry\n"},
        {"header.csv", "date,lang,topic,minutes,result\n"},
    };
    for (int i = 0; i < 4; i++) {
        FILE *f = fopen(files[i][0], "w");
        if (f == NULL) {
            return 1;
        }
        fputs(files[i][1], f);
        fclose(f);
        printf("%s:\n", files[i][0]);
        int n = load(files[i][0]);
        if (n >= 0) {
            printf("  %d행 읽음\n", n);
        }
        remove(files[i][0]);
    }

    FILE *f = fopen("long.csv", "w");       // 버퍼(256바이트)보다 긴 줄
    if (f == NULL) {
        return 1;
    }
    fputs("date,language,topic,minutes,result\n2026-10-03,Rust,", f);
    for (int i = 0; i < 300; i++) {
        fputc('a', f);
    }
    fputs(",25,pass\n", f);
    fclose(f);
    printf("long.csv:\n");
    load("long.csv");
    remove("long.csv");
    return 0;
}
```

실행 결과:

```text
good.csv:
  2행 읽음
quote.csv:
  오류: 2행의 CSV 형식이 올바르지 않습니다
minutes.csv:
  오류: 2행: minutes '99999999999999999999'
header.csv:
  오류: 헤더가 다릅니다
long.csv:
  오류: 2행이 너무 깁니다
```

### 코드 한 부분씩 읽기

| 코드                                                                            | 설명                                                                                                               |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `int quoted = 0, ended = 0, start = 1;`                                         | 칸 나누기의 세 상태입니다. 3절의 그림 그대로 움직입니다.                                                           |
| `if (ended && ch != ',' && ...) return 0;`                                      | 닫는 따옴표 뒤에는 쉼표나 줄 끝만 올 수 있습니다. `"배열"x`가 여기서 걸립니다.                                     |
| `if (ch == '"') { if (!start) return 0; ... }`                                  | 칸의 맨 앞이 아닌 곳의 따옴표는 거절합니다.                                                                        |
| `if (ch == '\r' && (line[i + 1] == '\n' \|\| line[i + 1] == '\0')) continue;`   | CRLF의 `\r`을 버립니다. `good.csv`의 마지막 줄이 CRLF라도 `retry`가 정확히 읽혔습니다.                             |
| `if (strchr(line, '\n') == NULL && !feof(f))`                                   | 4.1절의 긴 줄 검사입니다. 300바이트 주제가 든 줄이 여기서 걸렸습니다.                                              |
| `errno = 0; ... strtoul(text, &end, 10); if (errno != 0 \|\| *end != '\0' ...)` | 4.3절의 4단계입니다. 아주 큰 수는 `ERANGE`로 거절됩니다.                                                           |
| `if (number == 1) { ... strcmp ... continue; }`                                 | 첫 줄은 헤더라 다섯 이름을 비교하고 다음 줄로 넘어갑니다.                                                          |
| `printf("  오류: ...")`                                                         | 레슨에서 결과를 보이려고 표준 출력에 썼습니다. 실제 프로그램은 계약대로 `fprintf(stderr, ...)`와 `return 1`입니다. |

## 6. Python으로 구현하기

변환 함수가 얼마나 너그러운지 표로 확인합니다.

```python
# 파일: int_parsing.py
samples = ["30", " 30 ", "+30", "030", "3_0", "３０", "30.0", "99999999999999999999", "0"]


def lenient(s):                             # int가 받아들이는 것
    try:
        return int(s)
    except ValueError:
        return "ValueError"


def strict(s):                              # 계약이 받아들이는 것
    if s.isascii() and s.isdigit() and not s.startswith("0") and int(s) <= 10080:
        return int(s)
    return "거절"


for s in samples:
    print(f"{s!r:<24} int: {lenient(s)!s:<22} 계약: {strict(s)}")
```

실행 결과:

```text
'30'                     int: 30                     계약: 30
' 30 '                   int: 30                     계약: 거절
'+30'                    int: 30                     계약: 거절
'030'                    int: 30                     계약: 거절
'3_0'                    int: 30                     계약: 거절
'３０'                     int: 30                     계약: 거절
'30.0'                   int: ValueError             계약: 거절
'99999999999999999999'   int: 99999999999999999999   계약: 거절
'0'                      int: 0                      계약: 거절
```

### 코드 한 부분씩 읽기

| 코드                          | 설명                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `int(" 30 ")`, `int("+30")`   | 앞뒤 공백과 부호를 받아들입니다.                                                                |
| `int("3_0")`                  | 숫자 사이의 밑줄(`1_000_000` 같은 표기)도 받아들입니다.                                         |
| `int("３０")`                 | 전각 숫자(유니코드 숫자)도 받아들입니다. `isdigit()`도 참이라 `isascii()` 검사가 꼭 필요합니다. |
| `int("99999999999999999999")` | 크기 제한이 없어서 오류가 아닙니다. 범위 검사는 직접 해야 합니다.                               |
| `def strict(s)`               | 4.3절의 순서로 확인합니다. 아홉 입력 중 계약을 지키는 것은 `"30"` 하나뿐입니다.                 |

## 7. Rust로 구현하기

```rust
// 파일: int_parsing.rs
use std::num::IntErrorKind;

fn strict(s: &str) -> Result<u32, String> {
    if s.is_empty() || s.starts_with('0') || !s.bytes().all(|b| b.is_ascii_digit()) {
        return Err(String::from("모양"));
    }
    let v: u32 = s.parse().map_err(|e: std::num::ParseIntError| match e.kind() {
        IntErrorKind::PosOverflow => String::from("u32보다 큼"),
        _ => String::from("변환"),
    })?;
    if v > 10080 {
        return Err(String::from("범위"));
    }
    Ok(v)
}

fn main() {
    let samples = ["30", " 30 ", "+30", "030", "3_0", "３０", "30.0", "99999999999999999999", "0"];
    for s in samples {
        let loose = match s.parse::<u32>() {
            Ok(v) => v.to_string(),
            Err(e) => format!("{:?}", e.kind()),
        };
        let checked = match strict(s) {
            Ok(v) => v.to_string(),
            Err(why) => format!("거절({why})"),
        };
        println!("{:<24} parse: {loose:<14} 계약: {checked}", format!("{s:?}"));
    }
}
```

실행 결과:

```text
"30"                     parse: 30             계약: 30
" 30 "                   parse: InvalidDigit   계약: 거절(모양)
"+30"                    parse: 30             계약: 거절(모양)
"030"                    parse: 30             계약: 거절(모양)
"3_0"                    parse: InvalidDigit   계약: 거절(모양)
"３０"                     parse: InvalidDigit   계약: 거절(모양)
"30.0"                   parse: InvalidDigit   계약: 거절(모양)
"99999999999999999999"   parse: PosOverflow    계약: 거절(u32보다 큼)
"0"                      parse: 0              계약: 거절(모양)
```

### 코드 한 부분씩 읽기

| 코드                                                               | 설명                                                                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `s.parse::<u32>()`                                                 | Python보다 엄격하지만(공백, 밑줄, 전각 숫자 거절) `+`와 앞자리 0은 받아들입니다.                                        |
| `e.kind()` → `IntErrorKind::PosOverflow`                           | 오류 종류를 enum으로 알려 줍니다. C의 `errno == ERANGE`에 해당합니다.                                                   |
| `if s.is_empty() \|\| s.starts_with('0') \|\| !s.bytes().all(...)` | 모양 검사를 먼저 해서 `+30`, `030`을 거릅니다. 모양을 통과한 뒤의 `parse` 실패는 너무 큰 수뿐입니다.                    |
| `.map_err(\|e: std::num::ParseIntError\| match e.kind() { ... })`  | 오류 종류에 따라 다른 이유를 돌려줍니다. 클로저 매개변수에 자료형을 적어 추론을 도왔습니다.                             |
| `format!("{s:?}")`를 `{:<24}`로 출력                               | `Debug` 모양(따옴표 포함)을 먼저 문자열로 만든 뒤 폭을 맞췄습니다. 전각 숫자는 화면에서 두 칸이라 줄이 조금 어긋납니다. |

## 8. 실행 추적

C의 `csv_fields`가 `2026-10-02,C,"배열"x,45,retry`를 거절하는 과정입니다.

| 글자         | `quoted` | `ended` | `start` | 한 일                              |
| ------------ | -------- | ------- | ------- | ---------------------------------- |
| `2026-10-02` | 0        | 0       | 0       | 0번 칸                             |
| `,C,`        | 0        | 0       | 1       | 1번 칸 → 2번 칸 시작               |
| `"`          | 0 → 1    | 0       | 1 → 0   | 감싸기 시작                        |
| `배열`       | 1        | 0       | 0       | 모음                               |
| `"`          | 1 → 0    | 0 → 1   | 0       | 감싸기 끝, `ended = 1`             |
| `x`          | 0        | 1       | 0       | **`ended`인데 쉼표가 아님 → 실패** |

Python의 `csv` 모듈(`strict=True`)과 Rust 구현도 같은 입력을 거절합니다. 세 구현이 이 애매한 입력을 똑같이 다루도록 계약에 "거절"로 적어 둔 덕분입니다.

## 9. 다른 예제로 다시 이해하기

**strtoll이 알려 주는 모든 정보.** 여러 입력을 `strtoll`로 변환하고, 돌려준 값, 멈춘 위치, `ERANGE` 여부로 판정을 내립니다.

```c
// 파일: strtoll_table.c
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *inputs[] = {"42", "12abc", "abc", "  42", "-5", "99999999999999999999", ""};
    printf("%-24s %6s %4s %6s  판정\n", "input", "value", "end", "ERANGE");
    for (int i = 0; i < 7; i++) {
        const char *s = inputs[i];
        char *end;
        errno = 0;
        long long v = strtoll(s, &end, 10);
        int range = errno == ERANGE;
        const char *verdict = end == s ? "숫자 없음"
                            : *end != '\0' ? "뒤에 글자 남음"
                            : range ? "범위 넘침"
                            : "정수";
        char shown[32];
        snprintf(shown, sizeof shown, "\"%s\"", s);
        if (range) {
            printf("%-24s %6s %4td %6s  %s\n", shown, "-", end - s, "yes", verdict);
        } else {
            printf("%-24s %6lld %4td %6s  %s\n", shown, v, end - s, "no", verdict);
        }
    }
    return 0;
}
```

실행 결과:

```text
input                     value  end ERANGE  판정
"42"                         42    2     no  정수
"12abc"                      12    2     no  뒤에 글자 남음
"abc"                         0    0     no  숫자 없음
"  42"                       42    4     no  정수
"-5"                         -5    2     no  정수
"99999999999999999999"        -   20    yes  범위 넘침
""                            0    0     no  숫자 없음
```

| 코드                                                                 | 설명                                                                                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `long long v = strtoll(s, &end, 10);`                                | `long long`은 모든 운영체제에서 64비트 이상이라 결과가 같습니다. `long`은 Windows에서 32비트입니다.                                  |
| `end - s`                                                            | 같은 문자열 안의 두 포인터를 빼면 읽은 글자 수입니다(Day 30). 출력 형식은 `%td`(`ptrdiff_t`)입니다.                                  |
| `end == s ? "숫자 없음" : *end != '\0' ? ... : range ? ... : "정수"` | 판정 순서가 중요합니다. 숫자가 없는지 먼저, 그다음 남은 글자, 마지막으로 범위입니다.                                                 |
| `"  42"` → 정수                                                      | `strtoll`은 앞 공백을 건너뛰어 "정수"로 판정합니다. 계약은 공백을 허용하지 않으므로, 프로젝트는 변환 전에 숫자만 있는지 먼저 봅니다. |
| 범위를 넘으면 값 대신 `-`                                            | 넘친 값(`LLONG_MAX`)은 뜻이 없어서 출력하지 않았습니다.                                                                              |

Python에서는 정규 표현식으로 모양 검사를 한 줄에 씁니다.

```python
# 파일: regex_minutes.py
import re

MINUTES = re.compile(r"[1-9][0-9]{0,4}")    # 1~99999 모양: 앞자리 0 없음, ASCII 숫자만


def parse_minutes(s):
    if not MINUTES.fullmatch(s):            # fullmatch: 문자열 전체가 모양과 같아야 함
        return None
    value = int(s)
    return value if value <= 10080 else None


for s in ["30", "030", "10080", "10081", "123456", " 30", "３０", "7"]:
    print(f"{s!r}: {parse_minutes(s)}")
```

실행 결과:

```text
'30': 30
'030': None
'10080': 10080
'10081': None
'123456': None
' 30': None
'３０': None
'7': 7
```

- `[1-9][0-9]{0,4}`는 "0이 아닌 숫자 하나 + 숫자 0~4개"라서 앞자리 0과 여섯 자리 이상을 모양 단계에서 거릅니다. `[0-9]`는 ASCII 숫자만 뜻합니다(`\d`는 전각 숫자도 포함).
- `fullmatch`는 문자열 전체가 모양과 같아야 합니다. `match`를 쓰면 `" 30"`은 거절되지만 `"30x"`는 통과해 버립니다.
- 모양을 통과해도 `10081`처럼 범위 밖일 수 있어서 `int` 뒤에 범위를 한 번 더 확인합니다.

## 10. 입력별 판단 비교표

| 입력                     | 계약 | Python `int` | Rust `parse::<u32>` | C `strtol`(+ `end`) |
| ------------------------ | ---- | ------------ | ------------------- | ------------------- |
| `"30"`                   | 30   | 30           | `Ok(30)`            | 30                  |
| `" 30"`                  | 거절 | 30           | `Err`               | 30                  |
| `"+30"`                  | 거절 | 30           | `Ok(30)`            | 30                  |
| `"030"`                  | 거절 | 30           | `Ok(30)`            | 30                  |
| `"3_0"`                  | 거절 | 30           | `Err`               | 3(뒤에 글자 남음)   |
| `"３０"`(전각)           | 거절 | 30           | `Err`               | 숫자 없음           |
| `"99999999999999999999"` | 거절 | 큰 정수      | `Err(PosOverflow)`  | `ERANGE`            |

한 줄도 세 변환 함수의 판단이 계약과 모두 같지 않습니다. **변환 전에 모양 검사**를 해야 하는 이유입니다.

## 11. 세 언어 비교

| 관점                 | C                                   | Python                       | Rust                     |
| -------------------- | ----------------------------------- | ---------------------------- | ------------------------ |
| 줄 읽기              | `fgets`(버퍼 크기, 긴 줄 직접 확인) | 파일 반복(제한 없음)         | `lines()`(제한 없음)     |
| CRLF                 | 직접 처리                           | `newline=""` + csv 모듈      | 직접 처리(`\r` 건너뛰기) |
| 정수 변환 실패       | `end`, `errno`                      | `ValueError`                 | `Result`, `IntErrorKind` |
| 범위 넘침            | `ERANGE`(값은 최댓값)               | 없음(크기 제한 없음)         | `PosOverflow`            |
| 변환 함수의 너그러움 | 앞 공백·부호                        | 공백·부호·밑줄·유니코드 숫자 | 부호·앞자리 0            |

## 12. 자주 하는 실수

### 실수 1: atoi로 사용자 입력을 변환한다

실습의 변형 문제입니다. 실패와 범위 넘침을 알 수 없습니다. `strtol` 계열과 `end`, `errno`를 쓰세요.

### 실수 2: errno를 지우지 않고 확인한다

`errno`는 성공해도 0으로 돌아가지 않습니다. 이전 함수가 남긴 `ERANGE`를 보고 멀쩡한 입력을 거절할 수 있으니, 부르기 **직전에** `errno = 0;`을 쓰세요.

### 실수 3: 변환 함수가 계약을 대신 지켜 준다고 믿는다

10절의 표처럼 세 변환 함수 모두 계약보다 너그럽습니다. 모양을 먼저 확인하세요.

### 실수 4: CRLF를 처리하지 않는다

Windows에서 만든 CSV를 읽으면 마지막 칸이 `"pass\r"`이 되어 모든 줄이 "결과 값 오류"가 됩니다. 이 버그는 Linux에서만 시험하면 드러나지 않습니다. fixture에 CRLF 파일을 넣어 두세요.

### 실수 5: 긴 줄을 조용히 잘라 읽는다

`fgets`의 결과를 그대로 나누면 잘린 앞부분만 한 줄로, 나머지를 다음 줄로 읽습니다. 줄 번호가 어긋나고 이상한 오류가 납니다. `'\n'`이 없고 파일 끝도 아니면 오류로 끝내세요.

## 13. Q&A

**Q. C에서 긴 줄도 읽고 싶으면 어떻게 하나요?**

A. 버퍼를 두 배씩 늘리며 `'\n'`이 나올 때까지 이어 읽는 함수를 만들거나(Day 40 도전 문제), POSIX의 `getline`을 씁니다(Windows에는 없음). 이 프로젝트는 계약으로 "한 줄 최대 4095바이트"를 정해 단순하게 했습니다.

**Q. 정규 표현식을 C에서도 쓸 수 있나요?**

A. POSIX `regex.h`가 있지만 Windows 표준 C에는 없습니다. 이 정도 모양 검사는 오늘처럼 반복문으로 쓰는 편이 이식성이 좋습니다. Rust는 `regex` 크레이트가 있지만 표준 라이브러리에는 없어서 이 프로젝트는 직접 검사합니다.

**Q. strtoul은 왜 "-1"을 받아들이나요?**

A. 표준이 `strtoul`의 음수 입력을 "부호를 뗀 값을 읽고 음수로 바꾼 뒤 부호 없는 자료형으로 변환"하도록 정해서, `-1`이 `ULONG_MAX`가 됩니다. 그래서 부호 없는 값을 읽을 때도 먼저 숫자만 있는지 확인해야 합니다. 실제 프로젝트의 `minutes_valid`가 그 순서입니다.

**Q. 전각 숫자 같은 입력이 정말 들어오나요?**

A. 한국어·일본어 입력기에서 전각 모드로 숫자를 치거나, 웹 페이지에서 복사하면 들어올 수 있습니다. 계약이 "ASCII 숫자"라고 정했다면 세 구현이 모두 똑같이 거절해야 합니다. 받아들이기로 정한다면 `unicodedata.normalize("NFKC", s)`처럼 먼저 정규화하는 단계를 세 구현 모두에 넣어야 합니다.

## 14. 핵심 요약

- `fgets` 결과에 `'\n'`이 없고 `feof`도 아니면 **너무 긴 줄**입니다. CRLF의 `\r`은 칸 나누기에서 버립니다.
- C 칸 나누기는 `quoted`, `ended`, `start` 세 상태로 따옴표 규칙을 모두 지키고, 닫는 따옴표 뒤의 글자·칸 중간 따옴표·닫히지 않은 따옴표를 거절합니다.
- `atoi`는 실패를 알 수 없으니 쓰지 않습니다. `strtol` 계열은 `end`(어디까지 읽었나)와 `errno == ERANGE`(범위 넘침)로 실패를 알려 주며, 부르기 전에 `errno = 0`입니다.
- Python `int`, Rust `parse`, C `strtol`은 모두 계약보다 너그럽고, 너그러운 부분이 서로 다릅니다. **모양 검사를 변환보다 먼저** 해야 세 구현이 같게 판단합니다.
- 모양 검사는 정규 표현식 `fullmatch`와 `[0-9]`로 짧게 쓸 수 있습니다.

## 15. 도전 문제

1. **(C)** 오늘의 `load`에 날짜(Day 84의 `date_valid`), 언어, 주제(공백만인지), 결과 검사를 추가해 실제 프로젝트의 `load`와 같게 만드세요. 오류는 `stderr`에 쓰고 `0`을 돌려주게 바꿉니다.
2. **(C)** `good.csv`의 마지막 줄에서 줄바꿈을 빼고(`...retry`로 끝남) 읽어도 2행을 읽는지 확인하세요. `feof` 검사를 빼면 어떻게 되는지도 확인합니다.
3. **(Python)** 계약을 바꿔 전각 숫자를 받아들이기로 했다고 가정하고, `unicodedata.normalize("NFKC", s)`를 먼저 적용하는 `strict`를 만드세요. 이 변경을 C와 Rust에도 넣으려면 무엇이 필요한지 적어 보세요.
4. **(Rust)** `strict`의 오류를 `enum MinutesError { Shape, TooLarge, OutOfRange }`로 바꾸고, 10절의 표 입력을 모두 넣어 어느 변형이 나오는지 출력하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `csv_fields`, `minutes_valid`, 긴 줄 검사는 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.c`에 있습니다. `load` 함수가 검사를 어떤 순서로 하는지, 오류를 어디에 쓰는지 오늘의 코드와 비교해 보세요.
