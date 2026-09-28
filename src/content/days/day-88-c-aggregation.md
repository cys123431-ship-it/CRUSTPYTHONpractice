---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-88-c-aggregation
courseId: crp-92
phaseId: phase-08
dayNumber: 88
date: "2026-12-27"
title: C 레코드 집계와 경계 검사
summary: Study Log Analyzer의 C 구현에서 보고서 부분을 완성합니다. 검증된 Session 구조체 배열을 거르며 고른 기록을 복사해 모으고, 합계를 넘치지 않는 unsigned long long으로, 최솟값을 UINT_MAX에서 시작해 구하고, 이름이 정해지지 않은 무리(주제)를 늘어나지 않는 Group 배열에 선형 탐색으로 모으며 자리가 남았는지 확인합니다. 정렬 방식에 따라 다르게 비교하는 qsort 비교 함수와 부호 없는 값을 빼지 않고 비교하는 법, ASCII 대소문자를 무시하는 포함 검색도 만듭니다. 고정 크기 배열의 경계가 계약의 일부라는 점을 Python(바이트로 센 주제 길이, 최대 기록 수)과 Rust(checked_add, u64로 넓히기, 용량 확인)에서 같은 규칙으로 옮기고, 가득 차면 알려 주는 무리 표를 C와 Rust로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: advanced
estimatedMinutes: 110
prerequisites: [day-87-c-csv-parse]
learningObjectives:
  - 구조체 배열을 거르며 고른 기록을 복사하고, 합계·최솟값·최댓값을 넘침 없이 구한다.
  - 고정 크기 무리 배열에 선형 탐색으로 합계를 모으고, 자리가 남았는지 확인한다.
  - 정렬 방식에 따라 비교하는 qsort 비교 함수를 만들고, 부호 없는 값의 비교를 올바르게 쓴다.
  - 고정 크기 경계(기록 수, 주제 바이트 수)를 계약으로 보고 Python·Rust에서 같은 규칙을 적용한다.
  - Rust의 checked_add와 넓은 자료형으로 넘침을 막는다.
concepts:
  [
    array of structs,
    struct copy,
    filtering in c,
    unsigned long long,
    uint max,
    group table,
    linear search,
    capacity check,
    qsort,
    comparator mode,
    unsigned comparison,
    case insensitive search,
    tolower,
    fixed capacity contract,
    byte length,
    checked add,
    try fold,
    overflow,
  ]
runnerMode: python
playgroundSource: |
  # 파일: bytes_play.py — C 배열의 크기는 바이트로 셉니다.
  for t in ["변수", "배열, 포인터", "아주아주아주아주긴주제이름"]:
      print(t, "글자", len(t), "바이트", len(t.encode()), "char[32]에 들어가나?", len(t.encode()) < 32)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day88-predict-cmp
    title: 부호 없는 값 비교 예측하기
    kind: predict
    objective: (a > b) - (a < b)가 -1, 1, 0을 돌려준다는 것을 추적한다.
    prompt: 출력되는 세 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      int cmp_unsigned(unsigned a, unsigned b) {
          return (a > b) - (a < b);
      }

      int main(void) {
          printf("%d %d %d\n", cmp_unsigned(30, 45), cmp_unsigned(45, 30), cmp_unsigned(30, 30));
          return 0;
      }
    answer: "-1 1 0"
    hint: "비교 결과는 참이면 1, 거짓이면 0입니다."
    explanation: "30과 45는 (0) - (1) = -1, 45와 30은 (1) - (0) = 1, 같으면 0 - 0 = 0입니다. a - b로 쓰면 unsigned라 30 - 45가 음수가 아닌 아주 큰 수가 되어 비교 함수가 틀린 답을 줍니다. 이 모양은 부호 있는 수에서도 넘침 없이 쓸 수 있어 비교 함수의 관용구입니다."
    commonMistakes:
      - "-15 15 0처럼 차이를 적음"
      - "첫 값을 0으로 생각함"
    language: c
    verification: run
  - id: ex-day88-predict-copy
    title: 구조체 복사본 예측하기
    kind: predict
    objective: 고른 기록을 복사한 뒤 원본을 바꿔도 복사본은 그대로라는 것을 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      typedef struct {
          char topic[16];
          unsigned minutes;
      } Session;

      int main(void) {
          Session rows[] = {{"var", 30}, {"array", 45}};
          Session copy = rows[0];
          rows[0].minutes = 99;
          printf("%u %u\n", copy.minutes, rows[0].minutes);
          return 0;
      }
    answer: "30 99"
    hint: "구조체 대입은 모든 필드를 복사합니다(Day 50)."
    explanation: "selected[used++] = *s;처럼 고른 기록을 복사해 두면, 이후 selected를 정렬해도 원본 rows는 그대로입니다. 반대로 포인터 배열(const Session *selected[])로 모으면 복사 비용은 줄지만, 원본이 바뀌면 함께 바뀝니다. char topic[16]도 구조체 안의 배열이라 통째로 복사됩니다."
    commonMistakes:
      - "copy가 rows[0]을 가리킨다고 생각해 99 99로 적음"
      - "배열 필드는 복사되지 않는다고 생각함"
    language: c
    verification: run
  - id: ex-day88-fill
    title: 자리가 남았을 때만 넣기 채우기
    kind: fill
    objective: 고정 크기 배열에 넣기 전에 길이와 용량을 비교한다.
    prompt: "빈칸을 채워 용량 2인 배열에 세 번 넣어도 넘치지 않고 '2'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int add(int list[], size_t *len, size_t cap, int value) {
          if (*len _____ cap) {
              list[(*len)++] = value;
              return 1;
          }
          return 0;
      }

      int main(void) {
          int list[2];
          size_t len = 0;
          add(list, &len, 2, 10);
          add(list, &len, 2, 20);
          add(list, &len, 2, 30);
          printf("%zu\n", len);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int add(int list[], size_t *len, size_t cap, int value) {
          if (*len < cap) {
              list[(*len)++] = value;
              return 1;
          }
          return 0;
      }

      int main(void) {
          int list[2];
          size_t len = 0;
          add(list, &len, 2, 10);
          add(list, &len, 2, 20);
          add(list, &len, 2, 30);
          printf("%zu\n", len);
          return 0;
      }
    output: "2"
    hint: "len이 0, 1일 때는 넣고, 2가 되면 넣지 않아야 합니다."
    explanation: "len < cap이면 list[len]이 배열 안의 칸입니다. <=로 쓰면 len == 2일 때 list[2](배열 밖)에 써서 정의되지 않은 동작입니다. 넣지 못했을 때 0을 돌려주므로 부르는 쪽이 '가득 참'을 처리할 수 있습니다. 실제 프로젝트는 기록이 MAX_ROWS(4096)를 넘으면 오류로 끝냅니다."
    commonMistakes:
      - "<=를 써서 한 칸 넘쳐 씀"
      - "list의 크기를 sizeof list로 함수 안에서 구하려 함(Day 34)"
    language: c
    verification: run
  - id: ex-day88-modify
    title: 대소문자를 무시하는 포함 검색으로 바꾸기
    kind: modify
    objective: strstr 대신 tolower로 비교하는 포함 검색을 만든다.
    prompt: "strstr는 대소문자를 구별해 'Pointer basics'에서 'POINT'를 찾지 못하고 '0'을 출력합니다. 바이트마다 tolower로 비교하도록 고쳐 '1'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <string.h>

      int text_contains(const char *text, const char *query) {
          return strstr(text, query) != NULL;
      }

      int main(void) {
          printf("%d\n", text_contains("Pointer basics", "POINT"));
          return 0;
      }
    answer: |-
      #include <ctype.h>
      #include <stdio.h>

      int text_contains(const char *text, const char *query) {
          if (*query == '\0') {
              return 1;
          }
          for (; *text; text++) {
              const char *a = text, *b = query;
              while (*a && *b && tolower((unsigned char)*a) == tolower((unsigned char)*b)) {
                  a++;
                  b++;
              }
              if (*b == '\0') {
                  return 1;
              }
          }
          return 0;
      }

      int main(void) {
          printf("%d\n", text_contains("Pointer basics", "POINT"));
          return 0;
      }
    output: "1"
    starterOutput: "0"
    hint: "text의 각 위치에서 query와 한 글자씩 비교해 보고, query가 끝까지 맞으면 찾은 것입니다."
    explanation: "C에는 대소문자를 무시하는 표준 strstr이 없어서 직접 만듭니다. tolower는 한 바이트만 바꾸므로 ASCII에만 효과가 있고, 한글 UTF-8 바이트는 그대로 비교됩니다(한글에는 대소문자가 없어 문제없음). Python의 casefold, Rust의 to_lowercase는 유니코드 전체를 다룹니다. 계약이 '영문 대소문자 무시'라면 세 구현 모두 같은 결과이지만, 독일어 ß처럼 특별한 글자까지 가면 달라질 수 있어 fixture로 확인해야 합니다."
    commonMistakes:
      - "(unsigned char) 변환을 빠뜨려 한글 바이트에서 정의되지 않은 동작"
      - "빈 query를 처리하지 않아 결과가 0이 됨(빈 문자열은 어디에나 포함)"
    language: c
    verification: run
  - id: ex-day88-debug
    title: 항상 0이 되는 최솟값 고치기
    kind: debug
    objective: 최솟값을 가장 큰 값에서 시작해야 한다는 것을 알고 고친다.
    prompt: "이 코드는 최솟값을 0에서 시작해 'min 0'을 출력합니다. 올바른 시작값으로 고쳐 'min 25'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          unsigned minutes[] = {30, 45, 25, 30};
          unsigned min = 0;
          for (int i = 0; i < 4; i++) {
              if (minutes[i] < min) {
                  min = minutes[i];
              }
          }
          printf("min %u\n", min);
          return 0;
      }
    answer: |-
      #include <limits.h>
      #include <stdio.h>

      int main(void) {
          unsigned minutes[] = {30, 45, 25, 30};
          unsigned min = UINT_MAX;
          for (int i = 0; i < 4; i++) {
              if (minutes[i] < min) {
                  min = minutes[i];
              }
          }
          printf("min %u\n", min);
          return 0;
      }
    output: "min 25"
    starterOutput: "min 0"
    hint: "어떤 값도 0보다 작을 수 없어서 min이 한 번도 바뀌지 않습니다."
    explanation: "최솟값은 가능한 가장 큰 값(UINT_MAX, limits.h)에서 시작하거나, 첫 원소에서 시작해야 합니다. UINT_MAX에서 시작하면 기록이 하나도 없을 때 min이 UINT_MAX로 남으므로, 출력할 때 used ? min : 0으로 계약의 0을 냅니다. Python의 min(..., default=0), Rust의 .min().unwrap_or(0)가 이 두 단계를 한 번에 합니다."
    commonMistakes:
      - "min을 minutes[0]으로 시작하되 빈 배열을 확인하지 않아 배열 밖을 읽음"
      - "비교를 >로 바꿔 최댓값을 구함"
    language: c
    verification: run
  - id: ex-day88-independent
    title: Rust로 넘침을 알려 주는 합계 구하기
    kind: independent
    objective: checked_add로 u32 합의 넘침을 알아내고, u64로 넓혀 올바른 합을 구한다.
    prompt: "[4_000_000_000u32, 400_000_000]의 합을 u32의 checked_add로 구한 결과(넘치면 None)와 u64로 넓혀 구한 합을 'None 4400000000'으로 출력하세요."
    starter: |-
      fn main() {
          let xs = [4_000_000_000u32, 400_000_000];
          println!("{}", xs.len());
      }
    answer: |-
      fn main() {
          let xs = [4_000_000_000u32, 400_000_000];
          let small = xs.iter().try_fold(0u32, |acc, &x| acc.checked_add(x));
          let big: u64 = xs.iter().map(|&x| u64::from(x)).sum();
          println!("{small:?} {big}");
      }
    output: "None 4400000000"
    hint: "try_fold는 도중에 None이 나오면 곧바로 None을 돌려줍니다."
    explanation: "u32의 최댓값은 약 42억이라 두 값의 합(44억)이 들어가지 않습니다. 그냥 +로 더하면 디버그 빌드에서는 패닉, 배포 빌드에서는 조용히 되감깁니다. checked_add는 넘치면 None을 돌려줘 알 수 있게 하고, u64로 넓혀 더하면 넘치지 않습니다. C 구현이 합계에 unsigned long long을 쓰는 것과 같은 판단입니다. Python 정수는 크기 제한이 없어 이 걱정이 없습니다."
    commonMistakes:
      - "xs.iter().sum::<u32>()로 더해 패닉이 남"
      - "as u64를 합한 뒤에 적용해 이미 넘친 값을 넓힘"
    language: rust
    verification: run
quiz:
  - id: quiz-day88-01
    question: C 구현이 합계에 unsigned 대신 unsigned long long을 쓰는 이유는?
    choices:
      - 음수를 담으려고
      - 기록이 많을 때 합이 unsigned(보통 약 42억)를 넘을 수 있어서
      - 속도 때문에
      - printf가 unsigned를 출력하지 못해서
    answerIndex: 1
    explanation: 한 기록은 최대 10080분이고 기록은 최대 4096개라 이 프로젝트에서는 약 4천만이면 충분하지만, 계약이 바뀌어도 안전하도록 넓게 잡았습니다. 부호 없는 수의 넘침은 C에서 조용히 되감기므로 미리 막는 것이 중요합니다.
  - id: quiz-day88-02
    question: 주제 무리 배열 topics[MAX_ROWS]가 넘치지 않는다고 확신할 수 있는 이유는?
    choices:
      - 주제는 항상 세 개라서
      - 무리 수는 고른 기록 수를 넘을 수 없고, 기록 수는 MAX_ROWS 이하로 검사했기 때문
      - C가 자동으로 막아서
      - 확신할 수 없다
    answerIndex: 1
    explanation: 새 무리는 기록 하나당 최대 하나 생기므로 무리 수 ≤ 기록 수 ≤ MAX_ROWS입니다. 이런 추론이 가능하도록 읽기 단계에서 기록 수를 검사한 것입니다. 추론이 어려우면 오늘의 add_group처럼 용량을 직접 확인하세요.
  - id: quiz-day88-03
    question: qsort 비교 함수가 정렬 방식(분 순 / 날짜 순)을 알게 하는 방법 중 오늘 코드가 쓴 것은?
    choices:
      - 비교 함수의 인자로 넘긴다
      - 파일 안의 static 변수(date_sort)를 비교 함수가 읽는다
      - 매크로
      - 불가능하다
    answerIndex: 1
    explanation: qsort의 비교 함수는 두 칸의 주소만 받아서 추가 정보를 넘길 수 없습니다. 그래서 static 변수로 방식을 알리거나, 방식마다 비교 함수를 따로 만들어 함수 포인터로 고릅니다(도전 문제). 여러 스레드에서 동시에 쓰면 static 방식은 위험합니다.
  - id: quiz-day88-04
    question: Python 구현에서 주제 길이를 C와 같게 제한하려면?
    choices:
      - len(topic) < 32
      - len(topic.encode("utf-8")) < 32
      - topic.strip()
      - 제한할 수 없다
    answerIndex: 1
    explanation: C의 char topic[32]는 바이트 크기입니다. 한글은 한 글자에 3바이트라 len(topic)으로 세면 C보다 긴 주제를 받아들이게 됩니다. 경계도 계약이므로 세 구현이 같은 단위(바이트)로 세야 합니다.
  - id: quiz-day88-05
    question: tolower를 쓴 C의 대소문자 무시 검색이 Python casefold와 결과가 같은 경우는?
    choices:
      - 모든 경우
      - 영문 ASCII와 대소문자가 없는 글자(한글 등)만 있을 때
      - 한글이 있을 때만
      - 같은 경우가 없다
    answerIndex: 1
    explanation: tolower는 바이트 하나씩 ASCII만 바꿉니다. 한글은 대소문자가 없어 그대로 비교되므로 같고, 독일어 ß나 튀르키예어 İ 같은 특별한 글자에서만 달라집니다. 계약에 '영문 대소문자만 무시'를 명시하고 fixture로 확인하면 차이를 막을 수 있습니다.
---

## 1. 오늘 배울 내용

Day 86에서 Python으로 보고서를 만들었습니다. 오늘은 같은 보고서를 **C**로 만듭니다. C에는 사전도, 늘어나는 리스트도, 크기 제한 없는 정수도 없어서 **경계**를 직접 관리해야 합니다.

1. 구조체 배열 거르기
   - 고른 기록을 `selected[]`에 복사해 모으기
2. 통계
   - 합계는 `unsigned long long`(넘침 방지)
   - 최솟값은 `UINT_MAX`에서 시작, 빈 결과는 0으로 출력
3. 무리별 합계
   - 이름을 미리 모르는 주제는 `Group` 배열에 **선형 탐색**으로 모으기
   - 새 무리를 넣기 전에 **자리가 남았는지** 확인
4. 정렬
   - 정렬 방식에 따라 다르게 비교하는 `qsort` 비교 함수
   - 부호 없는 값은 빼지 말고 비교하기
5. ASCII 대소문자를 무시하는 포함 검색
6. 경계는 계약의 일부: Python(바이트 길이, 최대 기록 수)과 Rust(`checked_add`, 넓은 자료형, 용량 확인)에서 같은 규칙
7. 가득 차면 알려 주는 무리 표를 C와 Rust로 만듭니다.

## 2. 왜 필요한가

C 구현은 모든 저장 공간이 **크기가 정해진 배열**입니다. 실제 프로젝트는 `MAX_ROWS 4096`, `MAX_TEXT 512`, `MAX_LINE 4096`을 정해 두었습니다.

- 경계를 넘는 입력(기록 5000개, 주제 600바이트)이 오면 C는 알아서 막지 않습니다. 확인하지 않으면 배열 밖에 씁니다.
- Python과 Rust는 이런 입력을 문제없이 처리하므로, **C만** 오류를 내면 세 구현의 결과가 달라집니다.

그래서 C의 한계를 **계약으로 올려서**, 세 구현이 모두 같은 한계에서 같은 판단을 하게 합니다(또는 한계에 닿지 않는 fixture만 쓰기로 약속합니다). 오늘은 C에서 경계를 지키는 방법과, 같은 경계를 다른 언어에 옮기는 방법을 봅니다.

## 3. 그림으로 이해하기

**report 함수의 메모리.**

```text
rows[]      ┌──────────┬──────────┬──────────┬──────────┐
(입력, 원본)  │ Python 30│ C 45     │ Rust 25  │ Python 30│
            └──────────┴──────────┴──────────┴──────────┘
                │ 거르기 통과한 것만 구조체 통째로 복사
                ▼
selected[]  ┌──────────┬──────────┬──────────┬──────────┬ ─ ─ ┐   used = 4
(정렬 대상)   │          │          │          │          │ 빈칸 │   MAX_ROWS = 16
            └──────────┴──────────┴──────────┴──────────┴ ─ ─ ┘

topics[]    ┌───────────────┬─────────┬──────────┬ ─ ─ ┐   ntopic = 3
(무리 표)     │ 변수 60        │ 배열.. 45│ 소유권 25  │ 빈칸 │   cap = MAX_ROWS
            └───────────────┴─────────┴──────────┴ ─ ─ ┘
add_group: 이름이 있으면 total +=, 없으면 (ntopic < cap일 때만) 새 칸
```

**부호 없는 값의 뺄셈 함정.**

```text
unsigned a = 30, b = 45;
a - b  →  4294967281   (음수가 아니라 되감긴 큰 수)
(a > b) - (a < b)  →  0 - 1 = -1   ✓
```

**넘침.**

```text
unsigned(32비트) 최대 4,294,967,295
10080 × 1,000,000 = 10,080,000,000  ✗ 넘침(되감김)
unsigned long long(64비트) 최대 약 1.8 × 10^19  ✓
```

## 4. 천천히 풀어보기

### 4.1 통계의 시작값

| 통계   | 시작값     | 이유                                             | 빈 결과 출력       |
| ------ | ---------- | ------------------------------------------------ | ------------------ |
| 합계   | 0          | 더하기의 항등원                                  | 0                  |
| 최솟값 | `UINT_MAX` | 어떤 값도 이보다 크지 않아서 첫 값에서 바로 바뀜 | `used ? min : 0`   |
| 최댓값 | 0          | minutes는 1 이상이라 첫 값에서 바로 바뀜         | 0                  |
| 평균   | 계산       | `(double)total / used`                           | `used ? ... : 0.0` |

### 4.2 무리 표

C에서 "이름 → 합계" 사전은 구조체 배열과 선형 탐색으로 만듭니다.

1. 표를 처음부터 훑어 같은 이름을 찾습니다.
2. 있으면 합계에 더합니다.
3. 없으면 **자리가 남았는지** 확인하고 새 칸을 만듭니다.
4. 다 모은 뒤 `qsort`로 이름 순 정렬합니다.

훑는 시간이 무리 수에 비례해서, 무리가 많으면 느립니다. 무리가 수천 개 이상이면 해시 테이블(Day 69)을 직접 만들어야 합니다. 이 프로젝트는 기록이 최대 4096개라 선형 탐색으로 충분합니다.

### 4.3 비교 함수와 정렬 방식

`qsort`의 비교 함수는 두 칸의 주소만 받으므로, "지금은 날짜 순"이라는 정보를 인자로 넘길 수 없습니다. 오늘 코드는 파일 안의 `static int date_sort`를 비교 함수가 읽게 했습니다. 실제 프로젝트도 같은 방식입니다. 방식마다 비교 함수를 따로 만들고 함수 포인터로 고르는 방법도 있습니다.

### 4.4 경계를 계약으로

| 경계       | C                              | Python에서 같게 하려면           | Rust에서 같게 하려면                     |
| ---------- | ------------------------------ | -------------------------------- | ---------------------------------------- |
| 기록 수    | `MAX_ROWS` 배열                | `len(rows) >= MAX_ROWS`면 오류   | `rows.len() >= MAX_ROWS`면 `Err`         |
| 주제 길이  | `char topic[MAX_TEXT]`(바이트) | `len(topic.encode()) < MAX_TEXT` | `topic.len() < MAX_TEXT`(`len`은 바이트) |
| 합계 크기  | `unsigned long long`           | 제한 없음(그대로)                | `u64`로 넓혀 더하기                      |
| 한 줄 길이 | `MAX_LINE` 버퍼                | 줄 길이 검사                     | 줄 길이 검사                             |

실제 프로젝트는 C의 한계(4096줄, 512바이트 주제)를 README에 적어 두고, fixture가 그 안에 들어가게 했습니다. Python과 Rust는 이 한계를 **검사하지 않습니다**. 한계를 넘는 입력에서 세 구현이 다르게 동작할 수 있다는 것이 알려진 차이이고, 도전 문제로 맞춰 볼 수 있습니다.

## 5. C로 구현하기

```c
// 파일: c_report.c
#include <ctype.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ROWS 16
#define MAX_TEXT 32

typedef struct {
    char date[11], language[8], topic[MAX_TEXT], result[8];
    unsigned minutes;
} Session;

typedef struct {
    char name[MAX_TEXT];
    unsigned long long total;
} Group;

static int date_sort = 0;                   // qsort 비교 함수가 볼 정렬 방식

static int text_contains(const char *text, const char *query) {   // ASCII 대소문자 무시 포함
    if (*query == '\0') {
        return 1;
    }
    for (; *text; text++) {
        const char *a = text, *b = query;
        while (*a && *b && tolower((unsigned char)*a) == tolower((unsigned char)*b)) {
            a++;
            b++;
        }
        if (*b == '\0') {
            return 1;
        }
    }
    return 0;
}

static void add_group(Group groups[], size_t *len, size_t cap, const char *key, unsigned value) {
    for (size_t i = 0; i < *len; i++) {
        if (strcmp(groups[i].name, key) == 0) {
            groups[i].total += value;
            return;
        }
    }
    if (*len < cap) {                       // 경계 검사: 자리가 있을 때만 새 무리
        snprintf(groups[*len].name, MAX_TEXT, "%s", key);
        groups[*len].total = value;
        (*len)++;
    }
}

static int group_cmp(const void *a, const void *b) {
    return strcmp(((const Group *)a)->name, ((const Group *)b)->name);
}

static int session_cmp(const void *pa, const void *pb) {
    const Session *a = pa, *b = pb;
    int order;
    if (date_sort) {
        if ((order = strcmp(a->date, b->date)) != 0) return order;
        if ((order = strcmp(a->language, b->language)) != 0) return order;
        if ((order = strcmp(a->topic, b->topic)) != 0) return order;
        return (a->minutes > b->minutes) - (a->minutes < b->minutes);
    }
    if (a->minutes != b->minutes) {
        return a->minutes < b->minutes ? 1 : -1;
    }
    if ((order = strcmp(a->date, b->date)) != 0) return order;
    if ((order = strcmp(a->language, b->language)) != 0) return order;
    return strcmp(a->topic, b->topic);
}

static void report(const Session rows[], size_t count, const char *language, const char *search, size_t top) {
    Session selected[MAX_ROWS];
    Group languages[3], topics[MAX_ROWS];
    size_t used = 0, nlang = 0, ntopic = 0;
    unsigned long long total = 0;
    unsigned min = UINT_MAX, max = 0;
    for (size_t i = 0; i < count; i++) {
        const Session *s = &rows[i];
        if ((language && strcmp(language, s->language) != 0) || (search && !text_contains(s->topic, search))) {
            continue;
        }
        selected[used++] = *s;              // 구조체 복사
        total += s->minutes;
        min = s->minutes < min ? s->minutes : min;
        max = s->minutes > max ? s->minutes : max;
        add_group(languages, &nlang, 3, s->language, s->minutes);
        add_group(topics, &ntopic, MAX_ROWS, s->topic, s->minutes);
    }
    printf("sessions: %zu\ntotal_minutes: %llu\naverage_minutes: %.2f\nmin_minutes: %u\nmax_minutes: %u\n",
           used, total, used ? (double)total / used : 0.0, used ? min : 0, max);
    qsort(languages, nlang, sizeof languages[0], group_cmp);
    qsort(topics, ntopic, sizeof topics[0], group_cmp);
    printf("language_totals:\n");
    for (size_t i = 0; i < nlang; i++) {
        printf("%s,%llu\n", languages[i].name, languages[i].total);
    }
    printf("topic_totals:\n");
    for (size_t i = 0; i < ntopic; i++) {
        printf("%s,%llu\n", topics[i].name, topics[i].total);
    }
    printf("top_sessions:\n");
    qsort(selected, used, sizeof selected[0], session_cmp);
    for (size_t i = 0; i < used && i < top; i++) {
        const Session *s = &selected[i];
        printf("%s,%s,%s,%u,%s\n", s->date, s->language, s->topic, s->minutes, s->result);
    }
}

int main(void) {
    Session rows[] = {
        {"2026-10-01", "Python", "변수", "pass", 30},
        {"2026-10-02", "C", "배열, 포인터", "retry", 45},
        {"2026-10-03", "Rust", "소유권", "pass", 25},
        {"2026-10-04", "Python", "변수", "pass", 30},
    };
    size_t n = sizeof rows / sizeof rows[0];
    printf("== 기본 ==\n");
    report(rows, n, NULL, NULL, 5);
    printf("== --search 포인터 --sort date --top 1 ==\n");
    date_sort = 1;
    report(rows, n, NULL, "포인터", 1);
    return 0;
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
== --search 포인터 --sort date --top 1 ==
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

| 코드                                                                     | 설명                                                                                                                                            |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `static int text_contains(...)`                                          | 각 위치에서 `query`와 한 바이트씩 `tolower`로 비교합니다. 빈 검색어는 언제나 포함입니다(Python의 `"" in s`도 참).                               |
| `if (*len < cap) { snprintf(groups[*len].name, ...); ... }`              | 자리가 있을 때만 새 무리를 만듭니다. 이름은 크기를 정해 복사합니다.                                                                             |
| `return (a->minutes > b->minutes) - (a->minutes < b->minutes);`          | 날짜 순에서 마지막 기준(분 오름차순)입니다. 뺄셈 대신 비교 두 번입니다.                                                                         |
| `if (a->minutes != b->minutes) return a->minutes < b->minutes ? 1 : -1;` | 분 순에서는 큰 것이 먼저라 반대로 돌려줍니다.                                                                                                   |
| `selected[used++] = *s;`                                                 | 고른 기록을 복사합니다. 정렬해도 원본 `rows`는 그대로입니다. `used`는 `count`를 넘지 않고, `count`는 `MAX_ROWS` 이하라 배열 밖에 쓰지 않습니다. |
| `used ? min : 0`                                                         | 빈 결과면 `UINT_MAX` 대신 계약의 0을 출력합니다.                                                                                                |
| `qsort(languages, nlang, ...)`, `qsort(topics, ntopic, ...)`             | 무리 표를 이름 순으로 정렬합니다. `strcmp`는 바이트 순서라 Python의 코드 포인트 순서, Rust의 `&str` 순서와 같습니다.                            |
| `date_sort = 1; report(...)`                                             | 비교 함수가 읽는 `static` 변수로 정렬 방식을 바꿨습니다.                                                                                        |

## 6. Python으로 구현하기

C의 경계를 Python에서 **같은 단위로** 적용하면 이렇게 됩니다.

```python
# 파일: py_limits.py
MAX_ROWS = 4                                # C 구현의 배열 크기와 같은 약속(예제라 작게)
MAX_TEXT = 32                               # C의 char topic[32]: '\0' 자리 포함 바이트 수


def check_topic(topic):
    size = len(topic.encode("utf-8"))       # C와 같은 단위(바이트)로 센다
    ok = size < MAX_TEXT
    return f"{topic!r}: 글자 {len(topic)}, 바이트 {size} → {'통과' if ok else '너무 김'}"


for t in ["변수", "배열, 포인터", "아주아주아주아주긴주제이름", "abcdefghijklmnopqrstuvwxyz01234"]:
    print(check_topic(t))


def load_rows(n):
    rows = []
    for i in range(n):
        if len(rows) >= MAX_ROWS:           # Python 리스트는 끝없이 늘어나지만, 계약을 맞추려고 막는다
            raise ValueError(f"{i + 2}행: 기록은 최대 {MAX_ROWS}개")
        rows.append(i)
    return rows


for n in (4, 5):
    try:
        print(f"기록 {n}개 → {len(load_rows(n))}개 읽음")
    except ValueError as e:
        print(f"기록 {n}개 → 오류: {e}")
print("합계는 넘치지 않는다:", sum([10080] * 1000000))
```

실행 결과:

```text
'변수': 글자 2, 바이트 6 → 통과
'배열, 포인터': 글자 7, 바이트 17 → 통과
'아주아주아주아주긴주제이름': 글자 13, 바이트 39 → 너무 김
'abcdefghijklmnopqrstuvwxyz01234': 글자 31, 바이트 31 → 통과
기록 4개 → 4개 읽음
기록 5개 → 오류: 6행: 기록은 최대 4개
합계는 넘치지 않는다: 10080000000
```

### 코드 한 부분씩 읽기

| 코드                                  | 설명                                                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `len(topic.encode("utf-8"))`          | C 배열의 크기는 바이트입니다. 13글자 한글 주제는 39바이트라 `char[32]`에 들어가지 않습니다. `len(topic)`(13)으로 세면 통과시켜 버립니다. |
| `size < MAX_TEXT`                     | `'\0'` 자리 1바이트가 필요해서 31바이트까지만 들어갑니다. 영문 31글자가 경계 사례입니다.                                                 |
| `if len(rows) >= MAX_ROWS: raise ...` | Python 리스트는 스스로 늘어나지만, C와 같은 한계를 지키려면 직접 막아야 합니다. 오류 줄 번호는 헤더를 포함해 `i + 2`입니다.              |
| `sum([10080] * 1000000)`              | Python 정수는 크기 제한이 없어서 100억이 넘어도 정확합니다. 이 점에서는 C가 Python에 맞춰 넓은 자료형을 써야 합니다.                     |

## 7. Rust로 구현하기

```rust
// 파일: rust_limits.rs
const MAX_ROWS: usize = 4;

fn push_row(rows: &mut Vec<u32>, minutes: u32) -> Result<(), String> {
    if rows.len() >= MAX_ROWS {
        return Err(format!("기록은 최대 {MAX_ROWS}개"));
    }
    rows.push(minutes);
    Ok(())
}

fn main() {
    let mut rows = Vec::new();
    for m in [30, 45, 25, 30, 99] {
        match push_row(&mut rows, m) {
            Ok(()) => print!("{m} "),
            Err(e) => println!("/ {m}: 오류: {e}"),
        }
    }

    println!("u32 최대 {}, 1을 더하면 {:?}", u32::MAX, u32::MAX.checked_add(1));
    let big = vec![10080u32; 1_000_000];
    let sum32 = big.iter().try_fold(0u32, |acc, &m| acc.checked_add(m));   // u32로 더하면 넘친다
    let sum64: u64 = big.iter().map(|&m| u64::from(m)).sum();              // u64로 넓히면 괜찮다
    println!("u32 합: {sum32:?}, u64 합: {sum64}");
    println!("주제 바이트 수: {} (글자 {})", "배열, 포인터".len(), "배열, 포인터".chars().count());
}
```

실행 결과:

```text
30 45 25 30 / 99: 오류: 기록은 최대 4개
u32 최대 4294967295, 1을 더하면 None
u32 합: None, u64 합: 10080000000
주제 바이트 수: 17 (글자 7)
```

### 코드 한 부분씩 읽기

| 코드                                                        | 설명                                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `if rows.len() >= MAX_ROWS { return Err(...); }`            | `Vec`은 늘어나지만 계약의 한계를 지키려고 막았습니다. 다섯 번째 값(99)이 거절되었습니다. |
| `u32::MAX.checked_add(1)`                                   | 넘치면 `None`입니다. 그냥 `+`로 더하면 디버그 빌드에서 패닉, 배포 빌드에서 되감깁니다.   |
| `big.iter().try_fold(0u32, \|acc, &m\| acc.checked_add(m))` | 더하다가 `None`이 나오면 곧바로 멈추고 `None`을 돌려줍니다.                              |
| `.map(\|&m\| u64::from(m)).sum()`                           | 더하기 **전에** 넓혀서 넘치지 않습니다. 실제 Rust 구현의 합계가 이 모양입니다.           |
| `"배열, 포인터".len()`                                      | Rust의 `len`은 바이트 수라 C의 경계와 같은 단위로 바로 비교할 수 있습니다(Day 39).       |

## 8. 실행 추적

C `report`의 기본 실행에서 `topics` 무리 표가 만들어지는 과정입니다.

| 기록               | 찾기 결과       | 한 일         | `topics`                      | `ntopic` |
| ------------------ | --------------- | ------------- | ----------------------------- | -------- |
| Python 변수 30     | 없음            | 새 칸(0 < 16) | 변수 30                       | 1        |
| C 배열, 포인터 45  | 없음            | 새 칸         | 변수 30, 배열.. 45            | 2        |
| Rust 소유권 25     | 없음            | 새 칸         | 변수 30, 배열.. 45, 소유권 25 | 3        |
| Python 변수 30     | 0번 칸에서 찾음 | 합계 += 30    | 변수 60, 배열.. 45, 소유권 25 | 3        |
| `qsort(group_cmp)` |                 | 이름 순 정렬  | 배열.. 45, 변수 60, 소유권 25 | 3        |

## 9. 다른 예제로 다시 이해하기

**가득 차면 알려 주는 무리 표.** 용량이 3인 표에 무리를 넣다가 자리가 없으면 "가득 참"을, 이름이 너무 길면 "너무 김"을 알려 줍니다. 오류를 무시하지 않고 **돌려주는** 것이 핵심입니다.

```c
// 파일: bounded_groups.c
#include <stdio.h>
#include <string.h>

#define CAP 3
#define NAME_MAX 16

typedef struct {
    char name[NAME_MAX];
    unsigned long long total;
} Group;

typedef struct {
    Group items[CAP];
    size_t len;
} GroupTable;

// 성공 1, 표가 가득 차서 새 무리를 못 넣으면 0, 이름이 너무 길면 -1
int table_add(GroupTable *t, const char *key, unsigned value) {
    if (strlen(key) >= NAME_MAX) {
        return -1;
    }
    for (size_t i = 0; i < t->len; i++) {
        if (strcmp(t->items[i].name, key) == 0) {
            t->items[i].total += value;
            return 1;
        }
    }
    if (t->len == CAP) {
        return 0;
    }
    Group *g = &t->items[t->len++];
    strcpy(g->name, key);                   // 길이를 확인했으니 안전
    g->total = value;
    return 1;
}

int main(void) {
    GroupTable t = {.len = 0};
    struct { const char *key; unsigned value; } inputs[] = {
        {"var", 30}, {"array", 45}, {"var", 30}, {"owner", 25}, {"trait", 10}, {"averyveryverylongname", 5},
    };
    for (size_t i = 0; i < sizeof inputs / sizeof inputs[0]; i++) {
        int r = table_add(&t, inputs[i].key, inputs[i].value);
        printf("add %-22s → %s\n", inputs[i].key, r == 1 ? "ok" : r == 0 ? "표가 가득 참" : "이름이 너무 김");
    }
    for (size_t i = 0; i < t.len; i++) {
        printf("%s,%llu\n", t.items[i].name, t.items[i].total);
    }
    return 0;
}
```

실행 결과:

```text
add var                    → ok
add array                  → ok
add var                    → ok
add owner                  → ok
add trait                  → 표가 가득 참
add averyveryverylongname  → 이름이 너무 김
var,60
array,45
owner,25
```

| 코드                                                           | 설명                                                                                                                               |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { Group items[CAP]; size_t len; } GroupTable;` | 배열과 길이를 한 구조체로 묶어, 길이를 따로 넘기다 어긋나는 실수를 막습니다.                                                       |
| `if (strlen(key) >= NAME_MAX) return -1;`                      | 이름이 칸에 들어가지 않으면 먼저 거절합니다. 확인한 뒤라 `strcpy`가 안전합니다.                                                    |
| 같은 이름을 먼저 찾기                                          | 이미 있는 무리는 표가 가득 차도 더할 수 있습니다. 그래서 가득 찼는지 검사가 찾기 **뒤에** 있습니다. 세 번째 `var`가 이 경우입니다. |
| `return 0;`(가득 참)                                           | 조용히 버리지 않고 알려 줍니다. 실제 프로젝트는 무리 수가 기록 수를 넘지 않는다는 추론으로 이 경우가 생기지 않게 했습니다(퀴즈 2). |

Rust에서는 같은 표를 `Vec`과 용량 확인, 오류 enum으로 만듭니다.

```rust
// 파일: bounded_groups.rs
const CAP: usize = 3;

#[derive(Debug)]
enum AddError {
    Full,
}

struct GroupTable {
    items: Vec<(String, u64)>,              // 길이는 CAP 이하로 유지한다
}

impl GroupTable {
    fn add(&mut self, key: &str, value: u64) -> Result<(), AddError> {
        if let Some(entry) = self.items.iter_mut().find(|(k, _)| k == key) {
            entry.1 += value;
            return Ok(());
        }
        if self.items.len() == CAP {
            return Err(AddError::Full);
        }
        self.items.push((key.to_string(), value));
        Ok(())
    }
}

fn main() {
    let mut t = GroupTable { items: Vec::with_capacity(CAP) };
    for (k, v) in [("var", 30), ("array", 45), ("var", 30), ("owner", 25), ("trait", 10)] {
        match t.add(k, v) {
            Ok(()) => println!("add {k:<6} → ok"),
            Err(e) => println!("add {k:<6} → {e:?}"),
        }
    }
    for (k, v) in &t.items {
        println!("{k},{v}");
    }
}
```

실행 결과:

```text
add var    → ok
add array  → ok
add var    → ok
add owner  → ok
add trait  → Full
var,60
array,45
owner,25
```

- `self.items.iter_mut().find(|(k, _)| k == key)`로 같은 이름을 찾아 가변으로 빌려 더합니다. 찾지 못하면 `None`입니다.
- `Vec::with_capacity(CAP)`로 공간을 미리 받아 두었지만, **용량은 한계가 아닙니다.** `push`는 넘치면 알아서 늘어나므로, 한계는 `len() == CAP`로 직접 확인했습니다.
- `enum AddError { Full }`처럼 오류에 이름을 주면, 나중에 `TooLong` 같은 이유를 추가하기 쉽습니다(Day 56).

## 10. 경계 관리 대응표

| 경계                 | C                                           | Python                    | Rust                                 |
| -------------------- | ------------------------------------------- | ------------------------- | ------------------------------------ |
| 배열 크기            | 고정, 넘으면 정의되지 않은 동작             | 없음(늘어남)              | 없음(늘어남, 인덱스는 검사)          |
| 크기 한계를 지키려면 | 넣기 전 `len < cap`                         | `len(list) >= MAX`면 오류 | `v.len() >= MAX`면 `Err`             |
| 문자열 칸 크기       | 바이트, `'\0'` 자리 포함                    | `len(s.encode())`         | `s.len()`                            |
| 정수 넘침            | 되감김(부호 없음), 정의되지 않음(부호 있음) | 없음                      | 디버그 패닉/배포 되감김, `checked_*` |
| 최솟값 시작값        | `UINT_MAX`                                  | `min(..., default=0)`     | `.min().unwrap_or(0)`                |

## 11. 세 언어 비교

| 관점                  | C                              | Python                 | Rust                               |
| --------------------- | ------------------------------ | ---------------------- | ---------------------------------- |
| 무리별 합계 자료 구조 | 구조체 배열 + 선형 탐색        | `dict` / `defaultdict` | `BTreeMap`                         |
| 정렬 방식 전달        | `static` 변수 또는 함수 포인터 | 열쇠 함수              | 클로저(바깥 변수를 붙잡을 수 있음) |
| 경계를 넘으면         | 알려 주지 않음(직접 확인)      | 늘어남                 | 늘어남 / 인덱스는 패닉             |
| 합의 넘침             | 자료형을 크게                  | 걱정 없음              | 넓히거나 `checked_add`             |

## 12. 자주 하는 실수

### 실수 1: 최솟값을 0에서 시작한다

실습의 디버그 문제입니다. `UINT_MAX`나 첫 원소에서 시작하세요.

### 실수 2: 비교 함수에서 부호 없는 값을 뺀다

`return b->minutes - a->minutes;`는 `unsigned`라 음수가 되지 않습니다. 실습의 예측 문제처럼 `(a > b) - (a < b)`를 쓰세요.

### 실수 3: 넣기 전에 자리를 확인하지 않는다

`groups[(*len)++] = ...`를 확인 없이 쓰면 가득 찼을 때 배열 밖에 씁니다. 실습의 빈칸 문제처럼 `*len < cap`을 먼저 확인하세요.

### 실수 4: 경계를 글자 수로 센다 (Python)

C의 `char[32]`는 32바이트입니다. `len(topic) < 32`로 검사하면 한글 주제에서 C와 판단이 달라집니다. 바이트로 세세요.

### 실수 5: Rust Vec의 용량을 한계로 착각한다

`Vec::with_capacity(3)`는 "처음에 3칸 공간을 받아 둔다"는 뜻이지 "3칸까지만"이 아닙니다. 네 번째 `push`도 성공합니다. 한계는 `len()`으로 직접 확인하세요.

## 13. Q&A

**Q. C에서 고른 기록을 복사하지 않고 포인터만 모으면 안 되나요?**

A. 됩니다. `const Session *selected[MAX_ROWS]`에 주소만 모으면 복사가 없어 빠르고, 비교 함수는 `*(const Session *const *)a`로 한 번 더 따라가면 됩니다(Day 49). 이 프로젝트는 구조체가 작고 기록이 많지 않아 복사로도 충분하고, 원본이 바뀌어도 안전해서 복사를 택했습니다.

**Q. 전역·static 배열이 크면 문제가 되나요?**

A. 실제 프로젝트는 `static Session sessions[4096]`처럼 큰 배열을 파일 범위에 두었습니다. 함수 안에 두면 스택에 잡혀서 수 MB를 넘으면 스택이 넘칩니다(Day 40). `static`은 프로그램이 시작할 때 한 번 잡혀서 괜찮지만, 크기는 실행 파일이 쓰는 메모리에 그대로 더해집니다. 더 크면 `malloc`으로 받습니다.

**Q. 세 구현의 한계가 다르면 비교 스크립트가 알아채나요?**

A. fixture가 한계 안에 있으면 알아채지 못합니다. 그래서 한계에 딱 걸치는 fixture(주제 511바이트, 512바이트)를 만들어 세 구현에 넣어 보는 것이 좋습니다. 계약에 "한계를 넘으면 오류"를 적고 세 구현이 모두 검사하게 하면 결과가 같아집니다(도전 문제).

**Q. 선형 탐색 대신 정렬한 뒤 이웃끼리 합치는 방법도 있나요?**

A. 있습니다. 기록을 주제로 정렬한 뒤, 같은 주제가 이어지는 동안 더하면 무리 표 없이 합계를 구할 수 있습니다. 정렬이 O(n log n)이라 무리가 많을 때 선형 탐색(O(n × 무리 수))보다 빠릅니다. SQL의 `GROUP BY`가 속에서 쓰는 방법 중 하나입니다.

## 14. 핵심 요약

- 고른 기록은 구조체로 복사해 모으고, 합계는 `unsigned long long`, 최솟값은 `UINT_MAX`에서 시작해 빈 결과에서는 0을 출력합니다.
- 이름을 모르는 무리는 구조체 배열과 선형 탐색으로 모으고, **새 칸을 만들기 전에** 자리가 남았는지 확인합니다. 다 모은 뒤 이름 순으로 `qsort`합니다.
- 비교 함수는 부호 없는 값을 빼지 않고 `(a > b) - (a < b)`로, 정렬 방식은 `static` 변수나 함수 포인터로 알립니다.
- C의 고정 크기는 **계약의 경계**입니다. Python은 바이트 길이와 최대 기록 수를, Rust는 `len()` 확인과 `u64`·`checked_add`로 같은 경계를 적용합니다.
- 경계를 넘을 때는 조용히 버리지 말고 오류를 돌려주세요.

## 15. 도전 문제

1. **(C)** `report`의 정렬 방식을 `static` 변수 대신 `int (*cmp)(const void *, const void *)` 매개변수로 받게 바꾸고, 두 비교 함수를 따로 만드세요.
2. **(C)** 고른 기록을 복사하지 말고 포인터 배열로 모으도록 바꾸고, 비교 함수를 알맞게 고친 뒤 출력이 같은지 확인하세요.
3. **(Python)** 실제 프로젝트의 Python `load`에 C와 같은 한계(기록 4096개, 주제 511바이트, 줄 4095바이트)를 검사하도록 추가하고, 한계에 걸치는 fixture를 만들어 C 구현과 결과를 비교하세요.
4. **(Rust)** 무리 표 실습에 이름 길이 제한(`TooLong`)을 추가하고, C 실습과 같은 여섯 입력에서 같은 결과가 나오는지 확인하세요.

## Study Log Analyzer 실제 프로젝트

오늘 만든 `add_group`, `session_cmp`, `text_contains`, 통계 계산은 [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)의 `study_log.c` `main` 함수 아래쪽에 있습니다. 파일 맨 위의 `MAX_ROWS`, `MAX_TEXT`, `MAX_LINE`이 오늘 말한 경계입니다.
