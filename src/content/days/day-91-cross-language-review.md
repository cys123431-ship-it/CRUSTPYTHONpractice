---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-91-cross-language-review
courseId: crp-92
phaseId: phase-08
dayNumber: 91
date: "2026-12-30"
title: 세 구현의 결과 일치 검사
summary: Python, C, Rust로 만든 Study Log Analyzer가 정말 같은 결과를 내는지 자동으로 확인합니다. 같은 fixture와 같은 옵션으로 여러 구현을 실행해 출력을 바이트 단위로 비교하는 차이 시험(differential testing), subprocess.run으로 다른 프로그램을 실행하고 표준 출력·표준 오류·종료 코드를 받는 법, 잘못된 입력에서는 모두 실패하고 표준 출력이 비어야 한다는 확인, 첫 번째로 다른 줄을 보여 주는 보고를 만듭니다. 차이를 드러내려면 fixture에 동점(언어가 다른 같은 분)처럼 까다로운 경우가 있어야 한다는 것, 줄 끝(CRLF)과 소수 자리처럼 눈에 안 보이는 차이, 긴 출력을 짧은 지문(FNV-1a 해시)으로 비교하는 C 방법, 보고서 안의 규칙(언어별 합 = 전체 합, 최솟값 ≤ 평균 ≤ 최댓값)을 확인하는 불변식 검사(Rust)도 다룹니다. 마지막으로 옵션의 모든 조합으로 시나리오 표를 만듭니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-90-rust-aggregate]
learningObjectives:
  - 여러 구현을 같은 입력으로 실행해 출력을 비교하는 차이 시험을 만든다.
  - subprocess.run으로 표준 출력·표준 오류·종료 코드를 받고, 실패 사례의 계약(모두 실패, 표준 출력 비움)을 확인한다.
  - 차이를 드러내는 fixture(동점, 경계, 까다로운 형식)를 고르고, CRLF·소수 자리 같은 보이지 않는 차이를 설명한다.
  - 출력 지문(해시)과 불변식 검사로 결과를 다른 방법으로도 확인한다.
  - 옵션의 모든 조합으로 시나리오 표를 만들어 빠진 경우를 줄인다.
concepts:
  [
    differential testing,
    parity check,
    oracle,
    subprocess run,
    capture output,
    return code,
    stderr,
    exact comparison,
    first difference,
    fixture with ties,
    crlf,
    float formatting,
    output fingerprint,
    fnv1a hash,
    invariant check,
    self consistency,
    scenario matrix,
    cartesian product,
    known differences,
  ]
runnerMode: python
playgroundSource: |
  # 파일: invisible_play.py — 눈에 안 보이는 차이를 찾아 보세요.
  a = "total_minutes: 130\n"
  b = "total_minutes: 130 \n"
  c = "total_minutes: 130\r\n"
  print(a == b, a == c)
  print(repr(b), repr(c))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day91-predict-run
    title: subprocess 결과 예측하기
    kind: predict
    objective: 실행한 프로그램의 종료 코드와 표준 출력을 받는 법을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      import subprocess
      import sys

      r = subprocess.run([sys.executable, "-c", "import sys; print('hi'); sys.exit(3)"],
                         capture_output=True, text=True)
      print(r.returncode, repr(r.stdout))
    answer: "3 'hi\\n'"
    hint: "print는 줄바꿈을 붙입니다. sys.exit(3)은 종료 코드 3으로 끝냅니다."
    explanation: "capture_output=True는 표준 출력과 표준 오류를 화면 대신 결과 객체에 담고, text=True는 바이트 대신 글자로 줍니다. returncode는 프로그램의 종료 코드로, 계약상 잘못된 입력이면 0이 아니어야 합니다. 비교 스크립트는 이 세 가지(stdout, stderr, returncode)로 세 구현을 판정합니다. 브라우저 실행기에는 subprocess가 없어서 이 예제는 자기 컴퓨터에서 확인하세요."
    commonMistakes:
      - "print의 줄바꿈을 빠뜨려 'hi'로 적음"
      - "종료 코드가 0이라고 생각함"
    language: python
    verification: run
  - id: ex-day91-predict-crlf
    title: 줄 끝 차이 예측하기
    kind: predict
    objective: CRLF와 LF는 다른 문자열이라는 것과 정규화로 맞출 수 있다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print("a\r\n" == "a\n", "a\r\n".replace("\r\n", "\n") == "a\n")
    answer: "False True"
    hint: "\\r\\n은 두 글자, \\n은 한 글자입니다."
    explanation: "Windows에서 C 프로그램이 텍스트 모드로 출력하면 줄 끝이 \\r\\n이 될 수 있어서, 같은 보고서라도 바이트 비교는 실패합니다. 비교 스크립트가 무엇을 같다고 볼지(줄 끝을 정규화할지)도 계약입니다. 이 프로젝트의 비교는 text=True로 읽어 Python이 줄 끝을 \\n으로 맞춘 뒤 비교합니다. 반대로 끝 공백은 맞추지 않으므로 다르면 실패입니다."
    commonMistakes:
      - "보기에 같으니 True라고 생각함"
      - "replace 뒤에도 다르다고 생각함"
    language: python
    verification: run
  - id: ex-day91-fill
    title: 출력 받기 옵션 채우기
    kind: fill
    objective: subprocess.run으로 자식 프로그램의 출력을 결과 객체에 담는다.
    prompt: "빈칸을 채워 자식 프로그램의 출력을 받아 '0 ok'가 출력되게 하세요."
    starter: |-
      import subprocess
      import sys

      r = subprocess.run([sys.executable, "-c", "print('ok')"], capture_output=_____, text=True)
      print(r.returncode, r.stdout.strip())
    answer: |-
      import subprocess
      import sys

      r = subprocess.run([sys.executable, "-c", "print('ok')"], capture_output=True, text=True)
      print(r.returncode, r.stdout.strip())
    output: "0 ok"
    hint: "출력을 '붙잡을까요?'에 대한 답입니다."
    explanation: "capture_output=True가 없으면 자식의 출력이 그대로 화면에 나오고 r.stdout은 None입니다. 명령은 문자열 하나가 아니라 리스트로 넘겨서, 셸을 거치지 않고 인자가 정확히 전달되게 했습니다(공백이 든 경로도 안전). sys.executable은 지금 실행 중인 Python입니다."
    commonMistakes:
      - "stdout=True처럼 없는 옵션을 씀"
      - "명령을 한 문자열로 넘겨 FileNotFoundError가 남"
    language: python
    verification: run
  - id: ex-day91-modify
    title: 느슨한 비교를 정확한 비교로 바꾸기
    kind: modify
    objective: strip으로 차이를 숨기지 않고 계약대로 정확히 비교한다.
    prompt: "이 비교는 strip() 때문에 끝 공백 차이를 숨겨 '같음'을 출력합니다. 계약대로 정확히 비교해 '다름'이 출력되게 하세요."
    starter: |-
      a = "total: 130 \n"
      b = "total: 130\n"
      print("같음" if a.strip() == b.strip() else "다름")
    answer: |-
      a = "total: 130 \n"
      b = "total: 130\n"
      print("같음" if a == b else "다름")
    output: "다름"
    starterOutput: "같음"
    hint: "비교하기 전에 값을 다듬으면, 다듬은 부분의 차이는 보이지 않게 됩니다."
    explanation: "끝 공백은 사람 눈에 보이지 않지만, 보고서를 읽는 다른 프로그램에는 다른 값입니다. 비교를 느슨하게 하면 한 구현의 버그를 놓칩니다. 무엇을 정규화할지(줄 끝, 마지막 줄바꿈 등)는 계약에 적고, 그 밖의 차이는 모두 실패로 보는 것이 안전합니다. 이 과정의 레슨 검사는 줄 끝 공백을 무시하도록 정했지만, 세 구현의 비교는 정확히 같아야 합니다."
    commonMistakes:
      - "rstrip만 써서 여전히 끝 공백을 숨김"
      - "a in b로 바꿔 부분 문자열이면 같다고 봄"
    language: python
    verification: run
  - id: ex-day91-debug
    title: 잘못된 불변식 검사 고치기
    kind: debug
    objective: 불변식이 무엇과 무엇을 비교해야 하는지 바로잡는다.
    prompt: "이 불변식 검사는 언어별 합계의 합을 기록 수(count)와 비교해 '위반'을 출력합니다. 전체 합(total)과 비교하도록 고쳐 '성립'이 출력되게 하세요."
    starter: |-
      report = {"total": 130, "count": 4, "by_lang": {"C": 45, "Python": 60, "Rust": 25}}
      print("성립" if sum(report["by_lang"].values()) == report["count"] else "위반")
    answer: |-
      report = {"total": 130, "count": 4, "by_lang": {"C": 45, "Python": 60, "Rust": 25}}
      print("성립" if sum(report["by_lang"].values()) == report["total"] else "위반")
    output: "성립"
    starterOutput: "위반"
    hint: "언어별 '분'의 합을 더하면 무엇과 같아야 할까요?"
    explanation: "언어는 모든 기록을 빠짐없이, 겹치지 않게 나누므로 언어별 분의 합은 전체 분의 합(130)과 같아야 합니다. 이런 규칙(불변식)은 기대 출력을 모르는 새 입력에서도 확인할 수 있다는 장점이 있습니다. 시험 코드도 코드라서 버그가 있을 수 있으니, 불변식 검사가 정상 입력에서 '성립'하는지 먼저 확인하세요."
    commonMistakes:
      - 'len(report["by_lang"])과 비교해 언어 수를 셈'
      - "기대를 '위반'으로 바꿔 시험을 맞춤"
    language: python
    verification: run
  - id: ex-day91-independent
    title: C로 문자열 지문 만들기
    kind: independent
    objective: FNV-1a 해시로 문자열의 짧은 지문을 만든다.
    prompt: 'uint32_t fnv1a(const char *s)를 만들어(시작값 2166136261, 바이트마다 XOR 후 16777619를 곱함) "abc"의 지문을 16진수 8자리로 ''1a47e90b''처럼 출력하세요.'
    starter: |-
      #include <stdint.h>
      #include <stdio.h>

      int main(void) {
          printf("여기에 fnv1a를 만들어 보세요\n");
          return 0;
      }
    answer: |-
      #include <stdint.h>
      #include <stdio.h>

      static uint32_t fnv1a(const char *s) {
          uint32_t h = 2166136261u;
          for (; *s; s++) {
              h ^= (unsigned char)*s;
              h *= 16777619u;
          }
          return h;
      }

      int main(void) {
          printf("%08x\n", (unsigned)fnv1a("abc"));
          return 0;
      }
    output: "1a47e90b"
    hint: "uint32_t의 곱셈은 넘치면 2^32로 나눈 나머지가 됩니다(부호 없는 정수는 정의된 동작)."
    explanation: "해시는 긴 출력을 짧은 값으로 줄여, 같은지 빠르게 확인하거나 기록해 두기 좋습니다. 지문이 다르면 출력이 반드시 다르지만, 지문이 같아도 드물게 출력이 다를 수 있어서(충돌) 최종 판정은 전체 비교로 합니다. (unsigned char) 변환은 한글 바이트가 음수로 섞이지 않게 합니다. 이 해시는 보안용이 아닙니다."
    commonMistakes:
      - "int로 계산해 부호 있는 정수 넘침(정의되지 않은 동작)이 됨"
      - "XOR와 곱셈 순서를 바꿔 FNV-1 값이 나옴"
    language: c
    verification: run
quiz:
  - id: quiz-day91-01
    question: 차이 시험(differential testing)의 핵심 생각은?
    choices:
      - 한 구현만 시험한다
      - 같은 입력으로 여러 구현을 실행해 결과가 다르면 적어도 하나에 버그가 있다고 본다
      - 무작위로 코드를 바꾼다
      - 출력을 사람이 읽는다
    answerIndex: 1
    explanation: 기대 출력을 일일이 적지 않아도, 구현끼리 비교하는 것만으로 버그를 찾을 수 있습니다. 이 프로젝트는 Python 구현을 기준으로 삼아 C와 Rust의 출력을 비교합니다. 셋이 똑같이 틀리면 찾지 못하므로 골든 파일(Day 84)과 함께 씁니다.
  - id: quiz-day91-02
    question: 잘못된 입력 사례에서 비교 스크립트가 확인해야 할 것은?
    choices:
      - 출력이 같은가만
      - 모든 구현이 0이 아닌 종료 코드로 끝나고, 표준 오류에 이유가 있으며, 표준 출력은 비어 있는가
      - 종료 코드가 0인가
      - 아무것도 확인하지 않는다
    answerIndex: 1
    explanation: 오류 문장은 구현마다 다를 수 있어 통째로 비교하지 않지만, '실패했다'는 사실과 '결과를 내지 않았다'는 사실은 같아야 합니다. 한 구현이 잘못된 줄을 건너뛰고 보고서를 출력하면 이 검사가 잡습니다.
  - id: quiz-day91-03
    question: 기본 fixture로는 드러나지 않던 정렬 버그를 찾으려면?
    choices:
      - 같은 fixture를 여러 번 실행한다
      - 분이 같고 언어가 다른 기록처럼 동점 기준이 쓰이는 줄을 fixture에 넣는다
      - 정렬을 빼 버린다
      - 출력을 줄인다
    answerIndex: 1
    explanation: 기본 fixture의 30분 두 기록은 언어가 같아서, 동점 기준의 순서(날짜 먼저인가 언어 먼저인가)가 달라도 결과가 같습니다. 차이 시험은 fixture가 차이를 드러낼 만큼 까다로워야 효과가 있습니다(Day 84).
  - id: quiz-day91-04
    question: 불변식 검사의 장점은?
    choices:
      - 기대 출력을 몰라도 새 입력에서 결과의 자기 모순을 찾을 수 있다
      - 항상 모든 버그를 찾는다
      - 출력을 빠르게 한다
      - 구현이 하나만 있어도 된다는 것 외에는 없다
    answerIndex: 0
    explanation: 언어별 합 = 전체 합, 최솟값 ≤ 평균 ≤ 최댓값, top 개수 = min(N, 기록 수), 분 내림차순 같은 규칙은 어떤 입력에서도 성립해야 합니다. 그래서 무작위로 만든 입력에도 쓸 수 있습니다. 다만 규칙을 지키면서도 틀린 결과(예 합계를 두 배로)는 찾지 못합니다.
  - id: quiz-day91-05
    question: 옵션 조합으로 시나리오 표를 만드는 이유는?
    choices:
      - 코드를 짧게 하려고
      - 거르기·정렬·top처럼 서로 영향을 주는 옵션의 조합에서만 드러나는 버그를 빠짐없이 찾으려고
      - 한 가지 조합만 필요해서
      - 실행을 느리게 하려고
    answerIndex: 1
    explanation: 네 가지 언어 거르기 × 두 가지 정렬 × 두 가지 top이면 16가지입니다. 조합이 너무 많아지면 두 옵션씩의 모든 짝만 덮는 방법(pairwise)으로 줄이기도 합니다. 실제 비교 스크립트는 대표적인 7가지 조합을 씁니다.
---

## 1. 오늘 배울 내용

Day 85~90에서 Study Log Analyzer를 Python, C, Rust로 만들었습니다. 오늘은 세 구현이 **정말 같은 결과를 내는지** 자동으로 확인합니다. 저장소의 `scripts/verify-capstone.py`가 하는 일을 직접 만들어 보는 날입니다.

1. **차이 시험**(differential testing): 같은 입력으로 여러 구현을 실행해 비교
   - `subprocess.run`으로 다른 프로그램 실행
   - 표준 출력, 표준 오류, 종료 코드 받기
   - 정상 사례: 출력이 **바이트까지** 같은가
   - 오류 사례: 모두 실패하고, 표준 출력은 비었는가
   - 다르면 첫 번째로 다른 줄 보여 주기
2. 차이를 **드러내는** fixture: 언어가 다른 동점 같은 까다로운 경우
3. 눈에 보이지 않는 차이: 줄 끝(CRLF), 끝 공백, 소수 자리
4. 다른 방법의 확인
   - C: 출력의 짧은 지문(FNV-1a 해시)
   - Rust: 보고서 안의 규칙을 확인하는 **불변식 검사**
5. 옵션의 모든 조합으로 **시나리오 표** 만들기

## 2. 왜 필요한가

세 구현은 각자 시험을 통과했더라도 **서로** 다를 수 있습니다. Day 89에서 실제로 하나를 찾았습니다. 따옴표 안의 줄바꿈을 Rust와 Python은 받아들이고 C는 거절합니다.

- 사람이 세 출력을 눈으로 비교하면 끝 공백이나 줄 끝 차이를 놓칩니다.
- 옵션 조합이 16가지, 오류 사례가 10가지라면 손으로 비교하기 어렵습니다.
- 코드를 고칠 때마다 다시 비교해야 합니다.

비교를 **프로그램으로** 만들어 두면, 한 구현을 고쳤을 때 다른 구현과 어긋나는 순간 바로 알 수 있습니다. 여러 언어로 같은 명세를 구현하는 경우(예: 여러 언어의 JSON 라이브러리, 컴파일러 시험)에 널리 쓰이는 방법입니다.

## 3. 그림으로 이해하기

**비교 스크립트의 흐름.**

```text
                    ┌────────────── Python 구현 ──▶ stdout_P, stderr_P, code_P
시나리오(옵션)  ──┬──┼────────────── C 구현      ──▶ stdout_C, stderr_C, code_C
+ fixture        │  └────────────── Rust 구현   ──▶ stdout_R, stderr_R, code_R
                 │
                 ▼
정상 사례:   code = 0 모두?  stdout_C == stdout_P?  stdout_R == stdout_P?
오류 사례:   code ≠ 0 모두?  stderr 비어 있지 않음?  stdout 비어 있음?
다르면:     첫 번째로 다른 줄 번호와 두 줄을 보여 줌
```

**동점이 없으면 동점 기준의 버그가 숨는다.**

```text
기본 fixture의 30분:  Python 10-01, Python 10-04     언어가 같음
  기준(날짜 → 언어):   10-01, 10-04
  후보(언어 → 날짜):   10-01, 10-04                  ← 결과가 같아서 버그가 안 보임

C 10-05 30분을 추가:  Python 10-01, Python 10-04, C 10-05
  기준(날짜 → 언어):   10-01 Python, 10-04 Python, 10-05 C
  후보(언어 → 날짜):   10-05 C, 10-01 Python, 10-04 Python   ← 다름!
```

**지문(해시)과 전체 비교.**

```text
출력 A ──fnv1a──▶ 95db955d ┐
출력 B ──fnv1a──▶ 95db955d ┴─ 같음 → (드물게 충돌 가능) → 최종 확인은 전체 비교
출력 C ──fnv1a──▶ 8b4c7847    다름 → 반드시 다름
```

## 4. 천천히 풀어보기

### 4.1 subprocess.run

```python
subprocess.run([명령, 인자1, 인자2], capture_output=True, text=True, timeout=10)
```

| 결과 속성    | 뜻                                   |
| ------------ | ------------------------------------ |
| `returncode` | 종료 코드(0이면 성공)                |
| `stdout`     | 표준 출력 전체(`text=True`면 문자열) |
| `stderr`     | 표준 오류 전체                       |

- 명령은 **리스트**로 넘겨 셸을 거치지 않게 합니다. 공백이 든 경로도 안전하고, 인자에 섞인 특수 문자가 셸 명령으로 해석되지 않습니다.
- `timeout`을 두어 무한 반복에 빠진 구현이 비교 스크립트를 멈추지 않게 합니다.
- 자식의 출력 인코딩을 맞추려면 `env`에 `PYTHONIOENCODING`을 넣고, 읽을 때 `encoding="utf-8"`을 줍니다. C와 Rust는 받은 바이트를 그대로 출력하므로 UTF-8 fixture면 UTF-8로 나옵니다.

### 4.2 무엇을 같다고 볼 것인가

| 차이                        | 이 프로젝트의 비교                        |
| --------------------------- | ----------------------------------------- |
| 글자 하나라도 다름          | 실패                                      |
| 끝 공백                     | 실패                                      |
| 줄 끝 `\r\n` vs `\n`        | 같다고 봄(`text=True`가 `\n`으로 맞춤)    |
| 오류 문장의 문구            | 비교하지 않음(실패 여부와 빈 표준 출력만) |
| 소수 자리 `32.5` vs `32.50` | 실패(계약이 둘째 자리를 정함)             |

이 규칙도 계약입니다. 정규화를 너무 많이 하면 버그를 숨기고, 너무 적게 하면 운영체제 차이만으로 실패합니다.

### 4.3 기준 구현과 알려진 차이

비교에는 **기준**(oracle)이 필요합니다. 이 프로젝트는 가장 읽기 쉬운 Python 구현을 기준으로 삼았습니다. 기준이 틀리면 나머지도 틀리게 따라가므로, 기준은 골든 파일(Day 84)로 따로 확인합니다.

그리고 **알려진 차이**를 목록으로 적어 둡니다. 예를 들어 "따옴표 안의 줄바꿈: C만 거절"은 지금 계약에 빠져 있는 경계입니다. 목록에 적어 두면 누군가 고칠 때까지 잊히지 않고, 고친 뒤에는 그 사례를 비교 스크립트에 넣습니다.

### 4.4 불변식

불변식은 **어떤 입력에서도** 결과가 지켜야 하는 규칙입니다.

- 언어별 합계의 합 = `total_minutes`
- 주제별 합계의 합 = `total_minutes`
- `min_minutes ≤ average_minutes ≤ max_minutes`(기록이 있을 때)
- `top_sessions` 줄 수 = `min(top, sessions)`
- 기본 정렬이면 `top_sessions`의 분이 내림차순

기대 출력을 모르는 새 입력(무작위로 만든 입력 등)에서도 확인할 수 있어서, 차이 시험과 함께 쓰면 좋습니다.

## 5. Python으로 구현하기

두 "구현"(기준과, 동점 기준 순서만 다른 후보)을 파일로 만들어 실제로 `subprocess`로 실행하고 비교합니다. 브라우저 실행기에는 `subprocess`가 없어서 이 예제는 자기 컴퓨터에서 실행하세요.

```python
# 파일: parity.py
import os
import subprocess
import sys
from pathlib import Path

Path("sessions.csv").write_text(
    "date,language,topic,minutes,result\n"
    "2026-10-01,Python,변수,30,pass\n"
    "2026-10-02,C,\"배열, 포인터\",45,retry\n"
    "2026-10-03,Rust,소유권,25,pass\n"
    "2026-10-04,Python,변수,30,pass\n"
    "2026-10-05,C,포인터 연산,30,pass\n", encoding="utf-8")   # 언어가 다른 동점을 일부러 넣었다

REFERENCE = r'''
import csv, sys
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8", newline="")))
if "--top" in sys.argv and sys.argv[sys.argv.index("--top") + 1] == "0":
    print("오류: --top은 1~1000", file=sys.stderr); sys.exit(1)
rows.sort(key=lambda r: (-int(r["minutes"]), r["date"], r["language"], r["topic"]))
for r in rows[:2]:
    print(r["date"], r["language"], r["topic"], r["minutes"], sep=",")
'''
CANDIDATE = REFERENCE.replace('-int(r["minutes"]), r["date"], r["language"]',
                              '-int(r["minutes"]), r["language"], r["date"]')   # 동점 기준의 순서만 다른 구현

Path("reference.py").write_text(REFERENCE, encoding="utf-8")
Path("candidate.py").write_text(CANDIDATE, encoding="utf-8")


def run(script, *args):
    return subprocess.run([sys.executable, script, "sessions.csv", *args],
                          capture_output=True, text=True, encoding="utf-8", timeout=10,
                          env={**os.environ, "PYTHONIOENCODING": "utf-8"})   # 자식의 출력 인코딩을 맞춘다


scenarios = [[], ["--top", "0"]]
for args in scenarios:
    a, b = run("reference.py", *args), run("candidate.py", *args)
    label = " ".join(args) or "(옵션 없음)"
    if a.returncode != 0 or b.returncode != 0:
        same_failure = a.returncode != 0 and b.returncode != 0 and a.stderr and b.stderr and not a.stdout and not b.stdout
        print(f"{label}: 둘 다 실패해야 함 → {'일치' if same_failure else '불일치'} (종료 코드 {a.returncode}, {b.returncode})")
        continue
    if a.stdout == b.stdout:
        print(f"{label}: 출력 일치")
    else:
        for i, (x, y) in enumerate(zip(a.stdout.splitlines(), b.stdout.splitlines()), start=1):
            if x != y:
                print(f"{label}: {i}번째 줄 불일치")
                print(f"  기준: {x}")
                print(f"  후보: {y}")
                break
for p in ("sessions.csv", "reference.py", "candidate.py"):
    Path(p).unlink()
```

실행 결과:

```text
(옵션 없음): 2번째 줄 불일치
  기준: 2026-10-01,Python,변수,30
  후보: 2026-10-05,C,포인터 연산,30
--top 0: 둘 다 실패해야 함 → 일치 (종료 코드 1, 1)
```

### 코드 한 부분씩 읽기

| 코드                                                                         | 설명                                                                                                             |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `"2026-10-05,C,포인터 연산,30,pass\n"`                                       | 언어가 다른 30분 동점을 일부러 넣었습니다. 이 줄이 없으면 두 구현의 출력이 같아서 버그가 드러나지 않습니다.      |
| `CANDIDATE = REFERENCE.replace(...)`                                         | 정렬 열쇠에서 날짜와 언어의 순서만 바꾼 후보입니다. 실제로 세 구현 중 하나가 이렇게 다르게 만들어질 수 있습니다. |
| `subprocess.run([sys.executable, script, "sessions.csv", *args], ...)`       | 명령을 리스트로 만들어 실행합니다. `*args`로 시나리오의 옵션을 펼쳐 넣었습니다.                                  |
| `env={**os.environ, "PYTHONIOENCODING": "utf-8"}`                            | 자식 프로그램의 출력 인코딩을 UTF-8로 맞춥니다. 운영체제마다 기본 인코딩이 달라서 필요합니다.                    |
| `same_failure = a.returncode != 0 and ... and not a.stdout and not b.stdout` | 오류 사례의 계약: 모두 실패, 오류 문장 있음, 표준 출력 비어 있음.                                                |
| `for i, (x, y) in enumerate(zip(...), start=1)`                              | 첫 번째로 다른 줄을 찾아 두 줄을 함께 보여 줍니다(Day 84의 비교 함수).                                           |
| `Path(p).unlink()`                                                           | 만든 파일을 지웁니다. 실제 스크립트는 `tempfile.TemporaryDirectory()`로 임시 폴더를 쓰고 끝나면 통째로 지웁니다. |

## 6. C로 구현하기

긴 출력을 짧은 **지문**으로 비교합니다. 같은 지문이면 거의 확실히 같고, 다른 지문이면 반드시 다릅니다.

```c
// 파일: output_hash.c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

// FNV-1a: 바이트마다 섞는 간단한 해시. 긴 출력을 짧은 지문으로 비교할 때 쓴다
static uint32_t fnv1a(const char *s) {
    uint32_t h = 2166136261u;
    for (; *s; s++) {
        h ^= (unsigned char)*s;
        h *= 16777619u;
    }
    return h;
}

static void compare(const char *name, const char *a, const char *b) {
    uint32_t ha = fnv1a(a), hb = fnv1a(b);
    printf("%-10s %08x %08x %s", name, (unsigned)ha, (unsigned)hb, ha == hb ? "지문 같음" : "지문 다름");
    if (ha != hb) {
        size_t i = 0;
        while (a[i] && a[i] == b[i]) {
            i++;
        }
        printf(" (첫 차이: %zu번째 바이트)", i);
    }
    printf("\n");
}

int main(void) {
    const char *python_out = "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.50\n";
    const char *c_out = "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.50\n";
    const char *rust_out = "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.5\n";
    const char *crlf_out = "sessions: 4\r\ntotal_minutes: 130\r\naverage_minutes: 32.50\r\n";
    compare("C", python_out, c_out);
    compare("Rust", python_out, rust_out);
    compare("CRLF", python_out, crlf_out);
    return 0;
}
```

실행 결과:

```text
C          95db955d 95db955d 지문 같음
Rust       95db955d 8b4c7847 지문 다름 (첫 차이: 52번째 바이트)
CRLF       95db955d ecb62342 지문 다름 (첫 차이: 11번째 바이트)
```

### 코드 한 부분씩 읽기

| 코드                                                      | 설명                                                                                                                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uint32_t h = 2166136261u;` / `h ^= ...; h *= 16777619u;` | FNV-1a 해시입니다. 바이트를 XOR로 섞고 정해진 수를 곱합니다. `uint32_t`의 곱셈은 넘치면 되감기는 것이 **정의된 동작**이라 어느 컴퓨터에서나 같은 값입니다. |
| `(unsigned char)*s`                                       | 한글 UTF-8 바이트(0x80 이상)가 음수로 섞이지 않게 합니다.                                                                                                  |
| `%08x`                                                    | 16진수 8자리, 앞은 0으로 채웁니다.                                                                                                                         |
| 첫 차이 바이트 찾기                                       | 지문이 다를 때만 어디서 다른지 찾습니다. `average_minutes: 32.5` 뒤에서(52번째) 갈라졌고, CRLF는 첫 줄 끝(11번째)에서 갈라졌습니다.                        |

지문은 결과를 기록해 두거나(예: "이 버전의 출력 지문은 95db955d") 여러 개를 빠르게 비교할 때 좋습니다. 최종 판정은 항상 전체 비교로 합니다.

## 7. Rust로 구현하기

보고서 **안의 규칙**을 확인합니다. 다른 구현이 없어도, 기대 출력을 몰라도 쓸 수 있는 확인입니다.

```rust
// 파일: invariants.rs
fn value(report: &str, key: &str) -> f64 {
    report
        .lines()
        .find_map(|l| l.strip_prefix(key)?.strip_prefix(": ")?.parse().ok())
        .unwrap_or(f64::NAN)
}

fn section_sum(report: &str, title: &str) -> u64 {
    report
        .lines()
        .skip_while(|l| *l != title)
        .skip(1)
        .take_while(|l| !l.ends_with(':'))
        .filter_map(|l| l.rsplit_once(',')?.1.parse::<u64>().ok())   // 마지막 쉼표 뒤가 합계
        .sum()
}

fn check(report: &str) -> Vec<String> {
    let total = value(report, "total_minutes");
    let (avg, min, max) = (value(report, "average_minutes"), value(report, "min_minutes"), value(report, "max_minutes"));
    let mut problems = Vec::new();
    if section_sum(report, "language_totals:") as f64 != total {
        problems.push(String::from("언어별 합 ≠ 전체 합"));
    }
    if section_sum(report, "topic_totals:") as f64 != total {
        problems.push(String::from("주제별 합 ≠ 전체 합"));
    }
    if !(min <= avg && avg <= max) {
        problems.push(format!("min {min} ≤ 평균 {avg} ≤ max {max}가 아님"));
    }
    problems
}

fn main() {
    let good = "sessions: 4\ntotal_minutes: 130\naverage_minutes: 32.50\nmin_minutes: 25\nmax_minutes: 45\n\
language_totals:\nC,45\nPython,60\nRust,25\ntopic_totals:\n배열, 포인터,45\n변수,60\n소유권,25\ntop_sessions:\n";
    let bad = good.replace("Python,60", "Python,30").replace("min_minutes: 25", "min_minutes: 35");
    for (name, r) in [("정상", good.to_string()), ("고장", bad)] {
        let p = check(&r);
        if p.is_empty() {
            println!("{name}: 불변식 모두 성립");
        } else {
            println!("{name}: {}", p.join(" / "));
        }
    }
}
```

실행 결과:

```text
정상: 불변식 모두 성립
고장: 언어별 합 ≠ 전체 합 / min 35 ≤ 평균 32.5 ≤ max 45가 아님
```

### 코드 한 부분씩 읽기

| 코드                                                                         | 설명                                                                                                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.find_map(\|l\| l.strip_prefix(key)?.strip_prefix(": ")?.parse().ok())`     | `key: 값` 모양의 줄을 찾아 값을 읽습니다. 클로저 안에서 `?`가 `None`을 돌려주면 다음 줄로 넘어갑니다.                                            |
| `.skip_while(\|l\| *l != title).skip(1).take_while(\|l\| !l.ends_with(':'))` | 제목 줄 다음부터 다음 제목(끝이 `:`인 줄) 전까지의 줄만 고릅니다.                                                                                |
| `l.rsplit_once(',')?.1`                                                      | **마지막** 쉼표 뒤가 합계입니다. 주제에 쉼표가 있어도(`배열, 포인터,45`) 올바르게 읽습니다. `split_once`였다면 `" 포인터,45"`를 읽어 실패합니다. |
| `section_sum(...) as f64 != total`                                           | 불변식 1, 2입니다. 고장 난 보고서는 Python 합계를 30으로 바꿔 전체(130)와 맞지 않습니다.                                                         |
| `!(min <= avg && avg <= max)`                                                | 불변식 3입니다. 최솟값을 35로 바꾸자 평균(32.5)보다 커져서 걸렸습니다.                                                                           |
| `f64::NAN`                                                                   | 줄을 찾지 못하면 NaN이라 모든 비교가 거짓이 되어 불변식이 깨진 것으로 나옵니다. "찾지 못함"을 조용히 0으로 두지 않는 방법입니다.                 |

## 8. 실행 추적

Python 비교 스크립트의 첫 시나리오에서 두 구현이 동점을 정렬하는 과정입니다(분이 30인 세 줄).

| 줄                       | 기준 열쇠(-분, 날짜, 언어, 주제)   | 후보 열쇠(-분, 언어, 날짜, 주제)   |
| ------------------------ | ---------------------------------- | ---------------------------------- |
| 2026-10-01 Python 변수   | (-30, "2026-10-01", "Python", ...) | (-30, "Python", "2026-10-01", ...) |
| 2026-10-04 Python 변수   | (-30, "2026-10-04", "Python", ...) | (-30, "Python", "2026-10-04", ...) |
| 2026-10-05 C 포인터 연산 | (-30, "2026-10-05", "C", ...)      | (-30, "C", "2026-10-05", ...)      |
| 30분 중 1등              | 10-01 Python(날짜가 가장 이름)     | 10-05 C("C" < "Python")            |

출력의 1번째 줄은 45분짜리로 같고, 2번째 줄에서 갈라집니다. 비교 스크립트의 보고와 같습니다.

## 9. 다른 예제로 다시 이해하기

**시나리오 표.** 언어 거르기(없음, C, Python, Rust) × 정렬(분, 날짜) × top(1, 5)의 모든 조합 16가지를 만들고, 조합마다 불변식을 확인합니다.

```python
# 파일: scenario_matrix.py
from itertools import product

ROWS = [("2026-10-01", "Python", "변수", 30), ("2026-10-02", "C", "배열, 포인터", 45),
        ("2026-10-03", "Rust", "소유권", 25), ("2026-10-04", "Python", "변수", 30),
        ("2026-10-05", "C", "포인터 연산", 30)]


def report(language, sort, top):            # Day 86의 report를 줄인 것
    sel = [r for r in ROWS if language is None or r[1] == language]
    key = (lambda r: (r[0], r[1], r[2], r[3])) if sort == "date" else (lambda r: (-r[3], r[0], r[1], r[2]))
    return {"total": sum(r[3] for r in sel), "count": len(sel),
            "by_lang": {k: sum(r[3] for r in sel if r[1] == k) for k in sorted({r[1] for r in sel})},
            "top": sorted(sel, key=key)[:top]}


def invariants(rep, sort, top):
    problems = []
    if sum(rep["by_lang"].values()) != rep["total"]:
        problems.append("언어별 합")
    if len(rep["top"]) != min(top, rep["count"]):
        problems.append("top 개수")
    minutes = [r[3] for r in rep["top"]]
    if sort == "minutes" and minutes != sorted(minutes, reverse=True):
        problems.append("분 내림차순")
    return problems


matrix = list(product([None, "C", "Python", "Rust"], ["minutes", "date"], [1, 5]))
print("시나리오 수:", len(matrix))
failed = [(s, p) for s in matrix if (p := invariants(report(*s), s[1], s[2]))]
print("불변식 위반:", failed if failed else "없음")
for s in matrix[:3]:
    rep = report(*s)
    print(s, "→", rep["count"], "개,", [r[2] for r in rep["top"]])
```

실행 결과:

```text
시나리오 수: 16
불변식 위반: 없음
(None, 'minutes', 1) → 5 개, ['배열, 포인터']
(None, 'minutes', 5) → 5 개, ['배열, 포인터', '변수', '변수', '포인터 연산', '소유권']
(None, 'date', 1) → 5 개, ['변수']
```

| 코드                                                                  | 설명                                                                                                            |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `product([None, "C", "Python", "Rust"], ["minutes", "date"], [1, 5])` | 세 목록의 모든 조합(곱집합)입니다. 4 × 2 × 2 = 16가지입니다.                                                    |
| `def invariants(rep, sort, top)`                                      | 4.4절의 규칙 셋(언어별 합, top 개수, 분 내림차순)을 확인합니다.                                                 |
| `[(s, p) for s in matrix if (p := invariants(...))]`                  | `:=`로 검사 결과를 받아 두고, 위반이 있는 시나리오만 모읍니다.                                                  |
| `(None, 'minutes', 5)`의 결과                                         | 30분 동점 셋이 날짜 순(10-01, 10-04, 10-05)으로 나왔습니다. `포인터 연산`(10-05)이 `소유권`(25분)보다 앞입니다. |

Rust로 같은 표를 만들고, 각 시나리오를 실제 명령줄로 바꿔 봅니다. 이 명령들을 세 구현에 차례로 넣으면 비교 스크립트가 됩니다.

```rust
// 파일: scenario_matrix.rs
fn main() {
    let languages = [None, Some("C"), Some("Python"), Some("Rust")];
    let sorts = ["minutes", "date"];
    let tops = [1, 5];
    let mut matrix = Vec::new();
    for &l in &languages {                  // 세 겹 반복 = 모든 조합(곱집합)
        for &s in &sorts {
            for &t in &tops {
                matrix.push((l, s, t));
            }
        }
    }
    println!("시나리오 수: {}", matrix.len());
    for (l, s, t) in matrix.iter().take(3) {
        let lang = l.map(|l| format!(" --language {l}")).unwrap_or_default();
        println!("study_log sessions.csv{lang} --sort {s} --top {t}");
    }
    let last = matrix.last().unwrap();
    println!("마지막: {last:?}");
}
```

실행 결과:

```text
시나리오 수: 16
study_log sessions.csv --sort minutes --top 1
study_log sessions.csv --sort minutes --top 5
study_log sessions.csv --sort date --top 1
마지막: (Some("Rust"), "date", 5)
```

- 세 겹 `for`가 곱집합입니다. 반복자로 쓰려면 `flat_map`을 겹쳐야 하는데, 안쪽 클로저가 바깥 배열을 빌리는 문제 때문에 읽기 어려워서 `for`가 더 알맞은 경우입니다(Day 90 Q&A).
- `l.map(|l| format!(" --language {l}")).unwrap_or_default()`는 옵션이 있을 때만 인자를 붙입니다.
- 실제 비교 스크립트는 16가지를 모두 쓰지 않고, 대표적인 7가지(옵션 없음, 언어, 주제, 날짜, 검색, 날짜 정렬 + top 2, 언어 + 날짜)를 씁니다. 조합이 너무 많아지면 이렇게 대표를 고르거나, 두 옵션씩의 모든 짝만 덮는 방법을 씁니다.

## 10. 확인 방법 비교

| 방법                 | 기준               | 찾는 것             | 한계                              |
| -------------------- | ------------------ | ------------------- | --------------------------------- |
| 골든 파일(Day 84)    | 사람이 확인한 출력 | 기준과 다른 모든 것 | 새 입력마다 골든이 필요           |
| 차이 시험(오늘)      | 다른 구현(Python)  | 구현끼리 다른 것    | 모두 똑같이 틀리면 못 찾음        |
| 불변식 검사(오늘)    | 결과 안의 규칙     | 자기 모순           | 규칙을 지키는 틀린 결과는 못 찾음 |
| 지문(오늘)           | 이전에 기록한 해시 | 바뀌었는가          | 어디가 다른지는 따로 찾아야 함    |
| 경계 사례 표(Day 84) | 계약               | 경계에서의 판단     | 표에 없는 경우는 못 찾음          |

한 가지 방법으로는 부족하고, 서로의 빈틈을 채우도록 함께 씁니다.

## 11. 세 언어 비교

| 관점               | Python                  | C                                       | Rust                                     |
| ------------------ | ----------------------- | --------------------------------------- | ---------------------------------------- |
| 다른 프로그램 실행 | `subprocess.run`        | `system`, `popen`(POSIX), `fork`/`exec` | `std::process::Command`                  |
| 출력 받기          | `capture_output=True`   | `popen`으로 파이프 읽기                 | `.output()?`                             |
| 문자열 비교        | `==`                    | `strcmp`                                | `==`                                     |
| 해시               | `hashlib`(보안용), 직접 | 직접(FNV 등)                            | 직접, `std::hash`(실행마다 다를 수 있음) |
| 조합 만들기        | `itertools.product`     | 겹친 `for`                              | 겹친 `for`, `flat_map`                   |

## 12. 자주 하는 실수

### 실수 1: 비교 전에 값을 다듬어 차이를 숨긴다

실습의 변형 문제입니다. `strip()`, 소문자 바꾸기, 공백 합치기를 비교 전에 하면 그 부분의 버그를 찾지 못합니다. 정규화할 것은 계약에 적은 것(줄 끝)만 하세요.

### 실수 2: 오류 사례에서 "실패했다"만 확인한다

한 구현이 잘못된 줄을 건너뛰고 보고서를 출력한 뒤 종료 코드 1로 끝나면, 종료 코드만 보는 검사는 통과시킵니다. 표준 출력이 **비어 있는지**도 확인하세요.

### 실수 3: 까다롭지 않은 fixture로만 비교한다

8절처럼 동점이 없으면 정렬 기준의 차이가 숨습니다. 쉼표·따옴표·CRLF·동점·빈 결과·경계값이 든 fixture를 쓰세요.

### 실수 4: 셸 명령 문자열로 실행한다

`subprocess.run("python impl.py " + path, shell=True)`는 경로에 공백이나 특수 문자가 있으면 깨지고, 입력이 셸 명령으로 해석될 위험이 있습니다. 리스트로 넘기세요.

### 실수 5: 시험 코드를 시험하지 않는다

실습의 디버그 문제처럼 불변식 검사 자체가 틀릴 수 있습니다. 새 검사를 만들면 **정상 입력에서는 통과하고, 일부러 고장 낸 입력에서는 실패하는지** 둘 다 확인하세요. 오늘 Rust 예제가 "정상"과 "고장" 두 보고서를 넣은 이유입니다.

## 13. Q&A

**Q. 세 구현 중 무엇이 맞는지는 어떻게 아나요?**

A. 차이 시험은 "다르다"까지만 알려 줍니다. 무엇이 맞는지는 **계약**을 보고 정합니다. 계약이 그 경우를 정하지 않았다면(따옴표 안의 줄바꿈처럼) 계약에 먼저 답을 적고, 그에 맞게 구현을 고칩니다. 기준 구현도 틀릴 수 있다는 점을 잊지 마세요.

**Q. 비교 스크립트를 언제 실행하나요?**

A. 코드를 고칠 때마다, 그리고 자동 검사(CI)에서 저장소에 올릴 때마다 실행합니다. 이 과정의 저장소도 `course:verify` 명령으로 이 스크립트를 실행합니다. 사람이 기억해서 돌리는 검사는 결국 잊힙니다.

**Q. 무작위 입력으로도 비교할 수 있나요?**

A. 네, 좋은 방법입니다. 계약을 지키는 무작위 CSV를 만들어 세 구현에 넣고 출력을 비교하거나 불변식을 확인합니다. 차이가 나오면 그 입력을 fixture로 저장해 두세요. 무작위 입력을 만들 때 난수 씨앗을 기록해야 같은 입력을 다시 만들 수 있습니다.

**Q. Rust의 std::hash로 지문을 만들면 안 되나요?**

A. `HashMap`이 쓰는 기본 해시는 공격을 막으려고 실행할 때마다 다른 씨앗을 써서, 같은 문자열도 실행마다 다른 값이 나올 수 있습니다. 기록해 두고 비교할 지문에는 FNV처럼 정해진 알고리즘을 쓰세요.

## 14. 핵심 요약

- **차이 시험**은 같은 입력으로 여러 구현을 실행해, 출력이 다르면 적어도 하나에 버그가 있다고 봅니다. 기준 구현(Python)과 비교합니다.
- `subprocess.run([명령, 인자...], capture_output=True, text=True, timeout=...)`로 표준 출력·표준 오류·종료 코드를 받습니다. 명령은 리스트로 넘깁니다.
- 정상 사례는 출력을 **정확히** 비교하고(정규화는 계약에 적은 것만), 오류 사례는 모두 실패·오류 문장 있음·표준 출력 비어 있음을 확인합니다. 다르면 첫 번째로 다른 줄을 보여 줍니다.
- 차이를 드러내려면 fixture가 까다로워야 합니다(동점, 쉼표, CRLF, 경계). 계약에 빠진 경계는 알려진 차이로 적어 둡니다.
- 지문(FNV-1a)은 빠른 비교와 기록에, 불변식 검사는 기대 출력을 모르는 입력에 씁니다. 옵션 조합의 **시나리오 표**로 빠진 경우를 줄입니다.

## 15. 도전 문제

1. **(Python)** 오늘의 비교 스크립트를 실제 세 구현(`study_log.py`, 컴파일한 C와 Rust)을 실행하도록 바꾸고, 시나리오 표의 16가지 조합을 모두 넣어 보세요. 다른 결과가 나오면 계약과 비교해 어느 쪽이 맞는지 판단하세요.
2. **(Python)** Day 89의 "따옴표 안의 줄바꿈" 입력을 비교 스크립트의 사례로 추가하고, 지금은 실패(차이)로 보고되는지 확인한 뒤, 계약을 정해 세 구현을 맞춰 보세요.
3. **(Rust)** 불변식 검사에 "`top_sessions`의 분이 내림차순"과 "`top_sessions` 줄 수 = `min(5, sessions)`"를 추가하세요. 줄에서 분을 읽을 때도 주제에 쉼표가 있을 수 있다는 점을 생각하세요.
4. **(C)** `fnv1a`로 세 구현의 출력 지문을 출력하는 작은 도구를 만들고, 한 구현의 출력을 한 글자 바꿨을 때 지문이 어떻게 바뀌는지 확인하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 비교는 저장소의 `scripts/verify-capstone.py`가 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)에 대해 하는 일과 같습니다. 스크립트의 `scenarios`(정상 사례 7가지)와 `invalid_cases`(오류 사례 5가지)를 읽고, 오늘 배운 까다로운 경우 중 빠진 것이 무엇인지 찾아보세요.
