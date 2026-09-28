---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-49-memory-io-review
courseId: crp-92
phaseId: phase-05
dayNumber: 49
date: "2026-11-18"
title: 메모리와 입출력 회상 — 몇 줄이 올지 모르는 입력 다루기
summary: Day 34~48의 배열·문자열·동적 할당·출력 매개변수·수명·파일 입출력·오류 처리를 한 프로그램으로 묶어 복습합니다. 몇 줄이 들어올지 모르는 입력을 읽어 줄마다 힙에 복사해 두 배씩 늘어나는 배열에 모으고, qsort와 비교 함수로 정렬한 뒤, 문자열부터 배열 순서로 해제하는 C 프로그램을 만듭니다. 읽기 버퍼를 그대로 저장하면 모든 칸이 마지막 줄이 되는 별칭 버그, realloc 뒤에 옛 칸 포인터가 무효가 되는 문제, 비교 함수의 void * 변환을 짚고, 같은 일을 Rust의 Vec<String>과 sort, Python의 sorted와 비교합니다. 마지막으로 글에서 가장 많이 나온 단어를 세는 프로그램을 세 언어로 만듭니다.
anchorLanguage: c
transferLanguages: [rust, python]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-48-rust-reader]
learningObjectives:
  - 크기를 모르는 입력을 줄마다 힙에 복사해 두 배씩 늘어나는 배열에 모으고, 올바른 순서로 해제한다.
  - 읽기 버퍼를 복사하지 않고 저장했을 때의 별칭 버그를 설명하고 고친다.
  - qsort와 비교 함수를 만들고, void *를 알맞은 포인터로 바꾸는 이유를 설명한다.
  - realloc이 배열을 옮긴 뒤 옛 칸 포인터를 쓰면 안 되는 이유를 설명한다.
  - 같은 프로그램을 Rust Vec<String>·HashMap과 Python sorted·Counter로 옮기고, 각 언어가 대신해 주는 일을 정리한다.
concepts:
  [
    memory io review,
    dynamic array of strings,
    fgets buffer reuse,
    aliasing bug,
    strdup pattern,
    qsort,
    comparator,
    void pointer,
    realloc invalidation,
    free order,
    word frequency,
    hashmap,
    counter,
    total order,
  ]
runnerMode: python
playgroundSource: |
  # 파일: freq_play.py — 가장 많이 나온 단어를 세어 보세요.
  from collections import Counter
  text = "the cat and the hat the cat sat"
  counts = Counter(text.split())
  print(counts.most_common(3))
  print(sorted(["pear", "Apple", "kiwi"]))
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day49-predict-qsort
    title: 비교 함수로 내림차순 정렬 예측하기
    kind: predict
    objective: 비교 함수의 부호가 정렬 방향을 정한다는 것을 추적한다.
    prompt: 출력되는 네 수를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int cmp(const void *a, const void *b) {
          return *(const int *)b - *(const int *)a;
      }

      int main(void) {
          int a[] = {3, 9, 1, 7};
          qsort(a, 4, sizeof a[0], cmp);
          printf("%d %d %d %d\n", a[0], a[1], a[2], a[3]);
          return 0;
      }
    answer: "9 7 3 1"
    hint: "비교 함수가 음수를 돌려주면 a가 앞으로 갑니다. 여기서는 b - a입니다."
    explanation: "qsort는 비교 함수가 음수면 첫 인자를, 양수면 둘째 인자를 앞에 둡니다. b - a는 a가 클 때 음수라 큰 값이 앞으로 와서 내림차순이 됩니다. a - b로 쓰면 오름차순입니다. 다만 뺄셈은 아주 큰 값끼리면 넘칠 수 있어서, 실전에서는 (x > y) - (x < y)처럼 비교로 씁니다."
    commonMistakes:
      - "오름차순 1 3 7 9로 적음"
      - "qsort가 원래 배열을 바꾸지 않는다고 생각함"
    language: c
    verification: run
  - id: ex-day49-predict-sort
    title: 대문자가 섞인 문자열 정렬 예측하기
    kind: predict
    objective: 문자열 정렬이 바이트(코드 포인트) 순서라 대문자가 소문자보다 앞선다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let mut v = vec![String::from("banana"), String::from("Apple"), String::from("cherry")];
          v.sort();
          println!("{v:?}");
      }
    answer: '["Apple", "banana", "cherry"]'
    hint: "'A'는 65, 'a'는 97, 'b'는 98입니다."
    explanation: "String의 sort는 바이트 순서로 비교합니다. 대문자 A(65)가 소문자 b(98)보다 작아서 앞에 옵니다. apple이었다면 a(97) < b(98)이라 역시 앞이지만, Zebra는 banana보다 앞에 옵니다. 대소문자를 무시하려면 v.sort_by_key(|s| s.to_lowercase())를 씁니다. C의 strcmp, Python의 sorted도 같은 규칙입니다."
    commonMistakes:
      - "사전처럼 대소문자를 무시한다고 생각함"
      - "대문자가 뒤로 간다고 생각함"
    language: rust
    verification: run
  - id: ex-day49-fill
    title: 문자열 복사본의 크기 채우기
    kind: fill
    objective: 문자열을 힙에 복사할 때 널 문자 자리를 더한다.
    prompt: "빈칸을 채워 문자열을 힙에 복사하고 'momo 4'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int main(void) {
          const char *name = "momo";
          size_t n = strlen(name);
          char *copy = malloc(n + _____);
          if (copy == NULL) {
              return 1;
          }
          memcpy(copy, name, n + 1);
          printf("%s %zu\n", copy, n);
          free(copy);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int main(void) {
          const char *name = "momo";
          size_t n = strlen(name);
          char *copy = malloc(n + 1);
          if (copy == NULL) {
              return 1;
          }
          memcpy(copy, name, n + 1);
          printf("%s %zu\n", copy, n);
          free(copy);
          return 0;
      }
    output: "momo 4"
    hint: "strlen은 '\\0'을 세지 않습니다. memcpy는 '\\0'까지 n + 1바이트를 복사합니다."
    explanation: "4글자 문자열은 5바이트가 필요합니다(Day 37). malloc(n)만 받으면 memcpy가 1바이트를 넘쳐 씁니다. 이 '+ 1'은 C 문자열 복사에서 가장 자주 빠뜨리는 부분이라, 문자열 복사를 한 함수(dup_string 등)로 모아 두고 거기서만 계산하는 것이 좋습니다. POSIX와 C23에는 이 일을 하는 strdup이 있습니다."
    commonMistakes:
      - "0을 넣어 '\\0' 자리가 없음"
      - "sizeof name을 더해 포인터 크기(8)를 더함"
    language: c
    verification: run
  - id: ex-day49-modify
    title: 읽기 버퍼를 그대로 저장하는 별칭 버그 고치기
    kind: modify
    objective: 다음 읽기가 덮어쓰는 버퍼 대신, 줄마다 힙 복사본을 저장한다.
    prompt: "이 코드는 세 칸 모두 같은 버퍼 buf를 가리켜서 'c c c'가 출력됩니다. 줄마다 malloc으로 복사본을 만들어 저장하고, 끝에 모두 해제해서 'a b c'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          const char *input[] = {"a", "b", "c"};
          char buf[16];
          char *saved[3];
          for (int i = 0; i < 3; i++) {
              snprintf(buf, sizeof buf, "%s", input[i]);
              saved[i] = buf;
          }
          printf("%s %s %s\n", saved[0], saved[1], saved[2]);
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int main(void) {
          const char *input[] = {"a", "b", "c"};
          char buf[16];
          char *saved[3];
          for (int i = 0; i < 3; i++) {
              snprintf(buf, sizeof buf, "%s", input[i]);
              saved[i] = malloc(strlen(buf) + 1);
              if (saved[i] == NULL) {
                  return 1;
              }
              strcpy(saved[i], buf);
          }
          printf("%s %s %s\n", saved[0], saved[1], saved[2]);
          for (int i = 0; i < 3; i++) {
              free(saved[i]);
          }
          return 0;
      }
    output: "a b c"
    starterOutput: "c c c"
    hint: "saved[i] = buf는 주소만 저장합니다. 그 주소의 내용은 다음 반복에서 바뀝니다."
    explanation: "fgets로 한 줄씩 읽을 때 쓰는 버퍼는 보통 하나를 계속 다시 씁니다. 그 주소를 저장하면 모든 칸이 같은 곳을 가리키는 별칭이 되고(Day 31), 마지막에 읽은 내용만 보입니다. 줄마다 힙에 복사본을 만들면 각 칸이 자기 문자열의 주인이 되고, 그만큼 해제 책임도 생깁니다. 실패 처리를 더 꼼꼼히 하려면 이미 받은 칸을 해제하고 끝내야 합니다."
    commonMistakes:
      - "char buf[16]을 반복문 안으로 옮기기만 해서, 반복이 끝나면 사라진 곳을 가리키게 됨"
      - "free를 빠뜨려 누수가 생김"
    language: c
    verification: run
  - id: ex-day49-debug
    title: 실수 목록을 sort하는 오류 고치기
    kind: debug
    objective: 전체 순서가 없는 f64를 total_cmp로 정렬한다.
    prompt: "이 코드는 E0277(the trait bound `f64: Ord` is not satisfied) 오류로 컴파일되지 않습니다. sort_by와 total_cmp로 고쳐 '[0.5, 1.5, 2.25]'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut v: Vec<f64> = vec![1.5, 0.5, 2.25];
          v.sort();
          println!("{v:?}");
      }
    answer: |-
      fn main() {
          let mut v: Vec<f64> = vec![1.5, 0.5, 2.25];
          v.sort_by(|a, b| a.total_cmp(b));
          println!("{v:?}");
      }
    output: "[0.5, 1.5, 2.25]"
    hint: "실수에는 NaN(숫자가 아님)이 있어서 '모든 두 값을 비교할 수 있다'는 조건(Ord)을 만족하지 못합니다."
    explanation: "sort는 Ord(전체 순서)를 요구합니다. f64는 NaN이 자기 자신과도 같지 않아서 PartialOrd만 구현합니다. total_cmp는 NaN까지 포함해 정해진 순서를 주는 비교라 정렬에 쓸 수 있습니다. C의 qsort는 이런 검사를 하지 않아서, NaN이 섞인 배열을 잘못된 비교 함수로 정렬하면 결과가 엉망이 될 수 있습니다. Python의 sorted도 NaN이 섞이면 순서가 보장되지 않습니다."
    commonMistakes:
      - "sort_by(|a, b| a.partial_cmp(b).unwrap())로 써서 NaN이 있으면 패닉이 남"
      - "정수로 바꿔 정렬해 소수점을 잃음"
    language: rust
    verification: run
  - id: ex-day49-independent
    title: Python으로 가장 많은 항목 두 개 찾기
    kind: independent
    objective: Counter와 most_common으로 빈도를 센다.
    prompt: 'items = ["사과", "배", "사과", "감", "배", "사과"]에서 가장 많이 나온 두 항목과 개수를 "[(''사과'', 3), (''배'', 2)]"로 출력하세요.'
    starter: |-
      items = ["사과", "배", "사과", "감", "배", "사과"]
      print(items)
    answer: |-
      from collections import Counter

      items = ["사과", "배", "사과", "감", "배", "사과"]
      print(Counter(items).most_common(2))
    output: "[('사과', 3), ('배', 2)]"
    hint: "collections.Counter는 항목마다 개수를 세는 사전입니다."
    explanation: "Counter는 사전을 물려받아 없는 열쇠를 0으로 보고, most_common(n)은 개수가 많은 순서로 (항목, 개수)를 돌려줍니다. 개수가 같으면 먼저 나온 항목이 앞입니다. C에서는 실습처럼 (단어, 개수) 배열을 직접 늘리고 찾고 정렬해야 하고, Rust에서는 HashMap과 entry로 센 뒤 정렬합니다."
    commonMistakes:
      - "sorted(items)로 정렬만 하고 개수를 세지 않음"
      - "most_common()에 인자를 빼 모든 항목을 출력함"
    language: python
    verification: run
quiz:
  - id: quiz-day49-01
    question: fgets로 읽은 버퍼 주소를 그대로 배열 칸에 저장하면?
    choices:
      - 줄마다 따로 저장된다
      - 모든 칸이 같은 버퍼를 가리켜 마지막 줄만 보인다
      - 컴파일 오류
      - 버퍼가 자동으로 복사된다
    answerIndex: 1
    explanation: 버퍼는 다음 읽기가 덮어씁니다. 줄마다 malloc + 복사로 자기 공간을 만들어야 합니다. Rust의 lines()는 줄마다 새 String을 만들어 주고, Python도 줄마다 새 문자열 객체를 만듭니다.
  - id: quiz-day49-02
    question: 문자열 포인터 배열(char **items)을 해제하는 올바른 순서는?
    choices:
      - free(items) 후 각 문자열
      - 각 문자열 free(items[i]) 후 free(items)
      - free(items)만
      - 순서는 상관없다
    answerIndex: 1
    explanation: 배열을 먼저 해제하면 그 안의 문자열 주소를 읽을 수 없습니다(해제 후 사용). 안쪽 것부터, 바깥 것을 마지막에 해제합니다(Day 41의 트리와 같은 원리).
  - id: quiz-day49-03
    question: qsort의 비교 함수가 const void *를 받는 이유는?
    choices:
      - 속도 때문
      - qsort가 어떤 자료형의 배열이든 정렬할 수 있게 하려고. 함수 안에서 실제 자료형의 포인터로 바꿔 써야 한다
      - void는 비교할 수 없어서
      - 문자열만 정렬하려고
    answerIndex: 1
    explanation: qsort는 칸의 크기(sizeof)만 알고 내용은 모릅니다. 문자열 포인터 배열이라면 각 칸이 char *라서, 받은 void *는 'char *를 가리키는 포인터'입니다. 그래서 *(char *const *)a처럼 한 번 따라가야 문자열이 나옵니다.
  - id: quiz-day49-04
    question: find_or_add가 돌려준 Entry *를 들고 있다가 다른 단어를 추가(realloc)하면?
    choices:
      - 안전하다
      - 배열이 옮겨졌을 수 있어 옛 Entry *는 사라진 곳을 가리킬 수 있다
      - 컴파일 오류
      - 자동으로 새 주소로 바뀐다
    answerIndex: 1
    explanation: 실습 코드는 돌려받은 포인터로 곧바로 count++만 하고 버립니다. 들고 있어야 한다면 번호(인덱스)를 저장하세요(Day 42). Rust에서는 &mut 참조를 든 채로 HashMap에 넣으려 하면 빌림 규칙이 막습니다.
  - id: quiz-day49-05
    question: 같은 단어 세기 프로그램에서 Rust와 Python이 C 대신 해 주는 일이 아닌 것은?
    choices:
      - 늘어나는 배열과 해제
      - 빠른 사전(해시) 찾기
      - 줄마다 문자열 복사
      - 어떤 단어를 셀지 정하는 규칙(대소문자, 구두점)
    answerIndex: 3
    explanation: 메모리 관리, 사전, 문자열 복사는 표준 라이브러리가 대신하지만, '무엇을 한 단어로 볼지'는 문제의 규칙이라 세 언어 모두 프로그래머가 정해야 합니다. 오늘은 영문자가 아닌 곳에서 나누고 소문자로 맞췄습니다.
---

## 1. 오늘 배울 내용

Day 34부터 Day 48까지 배열 매개변수, 문자열, 유니코드, 동적 할당, `Box`, 출력 매개변수, 가변 인자, 수명, 파일 입출력, 오류 처리를 배웠습니다. 오늘은 복습의 날입니다. 새 문법 대신, 지금까지 배운 것을 **한 프로그램**에 모읍니다.

> 몇 줄이 들어올지 모르는 입력을 읽어, 정렬해서 출력한다.

간단해 보이지만 C로 쓰면 지금까지 배운 거의 모든 것이 필요합니다.

1. `fgets`로 한 줄씩 읽고 줄바꿈 떼기(Day 37, 46)
2. 줄마다 **힙에 복사**하기(Day 40), `'\0'` 자리 `+ 1`(Day 37)
3. 복사본의 주소를 **두 배씩 늘어나는 배열**에 모으기(Day 40)
4. `qsort`와 **비교 함수**로 정렬하기(`void *` 다루기)
5. 문자열부터, 배열은 마지막에 **해제**하기(Day 41)
6. 흔한 함정
   - 읽기 버퍼를 그대로 저장하는 **별칭 버그**(Day 31, 42)
   - `realloc` 뒤 옛 칸 포인터의 무효화(Day 42)
7. 같은 일을 Rust `Vec<String>`과 `sort`, Python `sorted`로 옮기며 **각 언어가 대신해 주는 일**을 정리합니다.
8. 글에서 가장 많이 나온 단어를 세는 프로그램을 세 언어로 만듭니다.

## 2. 왜 필요한가

"줄을 읽어 정렬한다"는 운영체제의 `sort` 명령이 하는 일이고, "단어를 센다"는 검색 엔진과 로그 분석의 기초입니다. 실제 프로그램은 이렇게 **입출력과 메모리가 함께** 움직입니다.

각 부분을 따로 배울 때는 잘 되던 것도, 합치면 새로운 버그가 생깁니다.

- 읽기 버퍼를 재사용하는 `fgets`와 "주소를 저장하는" 배열이 만나면 별칭 버그가 생깁니다.
- 늘어나는 배열과 "칸의 포인터를 들고 있는" 코드가 만나면 댕글링 포인터가 생깁니다.
- 중간에 실패했을 때 지금까지 받은 모든 공간을 해제해야 합니다.

이런 상호작용을 한 번 겪어 보면, Rust와 Python이 왜 그렇게 설계되었는지 이해할 수 있습니다.

## 3. 그림으로 이해하기

C 프로그램의 메모리 모습입니다. 버퍼는 하나, 힙 문자열은 줄마다 하나씩입니다.

```text
스택                         힙
buf[256] ┌──────────────┐
         │ 지금 읽은 줄   │ ─── 복사 ───┐
         └──────────────┘             ▼
v.items ──▶ ┌────┬────┬────┬────┬ ─ ─ ┐    "pear\0"
            │ ●  │ ●  │ ●  │ ●  │ 빈칸 │    "apple\0"
            └─┼──┴─┼──┴─┼──┴─┼──┴ ─ ─ ┘    "kiwi\0"
              ▼    ▼    ▼    ▼             "banana\0"
            줄마다 따로 받은 힙 문자열      ...
v.len = 5, v.cap = 8
```

**별칭 버그.** 복사하지 않고 버퍼 주소를 저장하면 이렇게 됩니다.

```text
saved[0] ─┐
saved[1] ─┼──▶ buf: "c"     ← 반복마다 덮어써서 마지막 줄만 남음
saved[2] ─┘
```

**정렬은 포인터만 옮깁니다.** `qsort`는 문자열 내용이 아니라 `items`의 칸(주소)을 바꿉니다.

```text
정렬 전  items: [●pear, ●apple, ●kiwi, ●banana, ●fig]
정렬 후  items: [●apple, ●banana, ●fig, ●kiwi, ●pear]
                 문자열들은 힙의 원래 자리 그대로, 주소의 순서만 바뀜
```

**해제 순서.**

```text
1) free(items[0]) ... free(items[4])    안쪽 문자열들
2) free(items)                          바깥 배열
```

## 4. 천천히 풀어보기

### 4.1 qsort와 비교 함수

```c
void qsort(void *base, size_t count, size_t size, int (*cmp)(const void *, const void *));
```

- `base`: 배열의 시작, `count`: 칸 수, `size`: 한 칸의 바이트 수
- `cmp`: 두 칸의 **주소**를 받아, 앞이 작으면 음수, 같으면 0, 크면 양수

`qsort`는 칸의 자료형을 모르기 때문에 `void *`로 주소를 넘깁니다. 비교 함수 안에서 **칸의 자료형을 가리키는 포인터**로 바꿔야 합니다.

| 배열            | 한 칸의 자료형 | 비교 함수 안에서                       |
| --------------- | -------------- | -------------------------------------- |
| `int a[]`       | `int`          | `*(const int *)a`                      |
| `char *items[]` | `char *`       | `*(char *const *)a` → 그 다음 `strcmp` |
| `Entry items[]` | `Entry`        | `const Entry *x = a;` 후 `x->count`    |

문자열 포인터 배열에서 `strcmp(a, b)`를 바로 쓰면 **포인터가 저장된 칸**을 문자열로 착각해 엉뚱한 결과가 나옵니다. 가장 흔한 `qsort` 실수입니다.

### 4.2 실패했을 때 받은 것을 모두 돌려주기

중간에 `malloc`이 실패하면 지금까지 모은 문자열과 배열을 모두 해제하고 끝내야 합니다. 그래서 `lines_free`를 먼저 만들어 두고, 실패 경로에서도 부릅니다. `realloc`이 실패해도 원래 배열은 그대로라 `lines_free`가 안전하게 정리할 수 있습니다(Day 40).

### 4.3 각 언어가 대신해 주는 일

| 해야 하는 일     | C                       | Rust                      | Python                  |
| ---------------- | ----------------------- | ------------------------- | ----------------------- |
| 한 줄 읽기       | `fgets`(버퍼 크기 제한) | `lines()`(길이 제한 없음) | `for line in sys.stdin` |
| 줄바꿈 떼기      | `strcspn`로 직접        | `lines()`가 뗌            | `rstrip("\n")`          |
| 줄마다 복사      | `malloc` + `memcpy`     | 줄마다 새 `String`        | 줄마다 새 `str`         |
| 늘어나는 배열    | `realloc` 직접          | `Vec::push`               | `list.append`           |
| 정렬             | `qsort` + 비교 함수     | `sort()`                  | `sorted()`              |
| 해제             | 안쪽부터 직접           | 자동(Drop)                | 자동                    |
| 단어 세기용 사전 | 직접(오늘은 선형 탐색)  | `HashMap`                 | `dict`, `Counter`       |

## 5. C로 구현하기

```c
// 파일: sort_lines.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char **items;                           // 힙 문자열들의 주소를 담은 힙 배열
    size_t len;
    size_t cap;
} Lines;

int lines_push(Lines *v, const char *text) {
    if (v->len == v->cap) {
        size_t new_cap = v->cap ? v->cap * 2 : 4;
        char **p = realloc(v->items, new_cap * sizeof *p);
        if (p == NULL) {
            return 0;
        }
        v->items = p;
        v->cap = new_cap;
    }
    size_t n = strlen(text);
    char *copy = malloc(n + 1);             // 줄마다 자기 공간(버퍼는 다음 줄이 덮어쓰므로)
    if (copy == NULL) {
        return 0;
    }
    memcpy(copy, text, n + 1);
    v->items[v->len++] = copy;
    return 1;
}

void lines_free(Lines *v) {                 // 문자열 먼저, 배열은 마지막에
    for (size_t i = 0; i < v->len; i++) {
        free(v->items[i]);
    }
    free(v->items);
    v->items = NULL;
    v->len = v->cap = 0;
}

int compare(const void *a, const void *b) { // qsort가 부르는 비교 함수
    const char *x = *(char *const *)a;
    const char *y = *(char *const *)b;
    return strcmp(x, y);
}

int main(void) {
    Lines v = {NULL, 0, 0};
    char buf[256];
    while (fgets(buf, sizeof buf, stdin) != NULL) {
        buf[strcspn(buf, "\n")] = '\0';     // 줄바꿈 떼기
        if (buf[0] == '\0') {
            continue;
        }
        if (!lines_push(&v, buf)) {
            printf("메모리 부족\n");
            lines_free(&v);
            return 1;
        }
    }
    qsort(v.items, v.len, sizeof v.items[0], compare);
    for (size_t i = 0; i < v.len; i++) {
        printf("%zu. %s\n", i + 1, v.items[i]);
    }
    printf("%zu줄, 용량 %zu\n", v.len, v.cap);
    lines_free(&v);
    return 0;
}
```

입력:

```text
pear
apple

kiwi
banana
fig
```

실행 결과:

```text
1. apple
2. banana
3. fig
4. kiwi
5. pear
5줄, 용량 8
```

### 코드 한 부분씩 읽기

| 코드                                                              | 설명                                                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `typedef struct { char **items; size_t len; size_t cap; } Lines;` | 문자열 주소들의 배열과 길이·용량입니다. Rust의 `Vec<String>`이 속에 가진 모양과 같습니다.     |
| `char *copy = malloc(n + 1); memcpy(copy, text, n + 1);`          | 줄마다 자기 공간을 만듭니다. `buf`는 다음 줄이 덮어쓰므로 주소를 저장하면 안 됩니다.          |
| `buf[strcspn(buf, "\n")] = '\0';`                                 | 첫 줄바꿈 자리에 `'\0'`을 넣어 뗍니다. 줄바꿈이 없으면 끝의 `'\0'` 자리라 아무 일도 없습니다. |
| `if (buf[0] == '\0') { continue; }`                               | 빈 줄은 건너뜁니다.                                                                           |
| `const char *x = *(char *const *)a;`                              | `a`는 "칸의 주소"이고, 칸에는 `char *`가 들어 있습니다. 한 번 따라가야 문자열이 나옵니다.     |
| `qsort(v.items, v.len, sizeof v.items[0], compare);`              | 칸 크기는 포인터 크기입니다. 문자열 내용은 움직이지 않고 주소만 정렬됩니다.                   |
| `lines_free(&v);`                                                 | 문자열 5개를 먼저, 배열을 마지막에 해제합니다. 실패 경로에서도 같은 함수를 씁니다.            |

## 6. Rust로 구현하기

```rust
// 파일: sort_lines.rs
use std::io::{self, BufRead};

fn main() -> io::Result<()> {
    let mut lines: Vec<String> = Vec::new();    // 힙 문자열들의 Vec: 주인은 lines 하나
    for line in io::stdin().lock().lines() {
        let line = line?;                   // 줄마다 새 String(줄바꿈은 떼어짐)
        if !line.is_empty() {
            lines.push(line);
        }
    }
    lines.sort();                           // 비교 함수 없이 문자열 순서로
    for (i, s) in lines.iter().enumerate() {
        println!("{}. {s}", i + 1);
    }
    println!("{}줄", lines.len());
    Ok(())                                  // lines와 모든 String이 여기서 해제된다
}
```

입력:

```text
pear
apple

kiwi
banana
fig
```

실행 결과:

```text
1. apple
2. banana
3. fig
4. kiwi
5. pear
5줄
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `let mut lines: Vec<String> = Vec::new();` | C의 `Lines`와 같은 모양이지만, 늘리기와 해제를 `Vec`이 합니다.                                                   |
| `let line = line?;`                        | `lines()`는 줄마다 **새** `String`을 만들어 주므로, C의 별칭 버그가 생길 수 없습니다. 줄바꿈도 떼어 줍니다.      |
| `lines.push(line);`                        | `line`의 소유권이 `Vec`으로 옮겨 갑니다. 복사가 없습니다.                                                        |
| `lines.sort();`                            | `String`은 `Ord`를 구현해서 비교 함수 없이 정렬됩니다. 속에서는 C처럼 (주소, 길이, 용량)만 옮깁니다.             |
| `Ok(())`                                   | 함수가 끝나며 `lines`가 해제되고, 그 안의 `String`들도 차례로 해제됩니다. C의 `lines_free`를 쓰지 않아도 됩니다. |

## 7. Python으로 구현하기

```python
# 파일: sort_lines.py
import sys

lines = [line.rstrip("\n") for line in sys.stdin]
lines = sorted(line for line in lines if line)
for i, s in enumerate(lines, start=1):
    print(f"{i}. {s}")
print(f"{len(lines)}줄")
```

입력:

```text
pear
apple

kiwi
banana
fig
```

실행 결과:

```text
1. apple
2. banana
3. fig
4. kiwi
5. pear
5줄
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `[line.rstrip("\n") for line in sys.stdin]` | 줄마다 새 문자열을 만들고 줄바꿈을 뗍니다. `strip()`을 쓰면 줄 앞뒤의 공백까지 지워집니다. |
| `sorted(line for line in lines if line)`    | 빈 줄을 거르면서 정렬된 **새** 리스트를 만듭니다(Day 44).                                  |
| `enumerate(lines, start=1)`                 | 번호를 1부터 붙였습니다.                                                                   |

C의 60줄이 Python의 5줄이 되었습니다. 줄어든 55줄이 하던 일(복사, 늘리기, 정렬 비교, 해제)은 사라진 것이 아니라 Python 실행기가 대신합니다.

## 8. 실행 추적

C 프로그램에서 `lines_push`가 불릴 때마다 배열의 길이와 용량이 어떻게 바뀌는지 따라갑니다.

| 읽은 줄  | `push` 전 `len`/`cap` | `realloc` | `push` 뒤 `len`/`cap` |
| -------- | --------------------- | --------- | --------------------- |
| `pear`   | 0 / 0                 | 0 → 4     | 1 / 4                 |
| `apple`  | 1 / 4                 | -         | 2 / 4                 |
| (빈 줄)  | -                     | -         | 건너뜀                |
| `kiwi`   | 2 / 4                 | -         | 3 / 4                 |
| `banana` | 3 / 4                 | -         | 4 / 4                 |
| `fig`    | 4 / 4                 | 4 → 8     | 5 / 8                 |

`fig`를 넣을 때 배열이 옮겨졌을 수 있습니다. 그 전에 `v.items`의 어떤 칸의 주소(`&v.items[0]`)를 들고 있었다면 무효입니다. 하지만 **문자열 자체**는 움직이지 않았으므로, `v.items[0]`에 들어 있던 값(문자열 주소)은 여전히 올바릅니다. "배열 칸의 주소"와 "칸에 든 주소"를 구별하세요.

## 9. 다른 예제로 다시 이해하기

**단어 빈도 세기.** 영어 글에서 단어를 소문자로 맞춰 세고, 가장 많이 나온 세 단어를 출력합니다. 개수가 같으면 글자 순서로 정합니다. C에서는 `(단어, 개수)` 구조체의 늘어나는 배열을 직접 만듭니다.

```c
// 파일: word_freq.c
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char word[32];
    int count;
} Entry;

typedef struct {
    Entry *items;
    size_t len;
    size_t cap;
} Table;

Entry *find_or_add(Table *t, const char *word) {
    for (size_t i = 0; i < t->len; i++) {   // 선형 탐색(Day 63에서 더 빠른 방법)
        if (strcmp(t->items[i].word, word) == 0) {
            return &t->items[i];
        }
    }
    if (t->len == t->cap) {
        size_t new_cap = t->cap ? t->cap * 2 : 8;
        Entry *p = realloc(t->items, new_cap * sizeof *p);
        if (p == NULL) {
            return NULL;
        }
        t->items = p;                       // 옮겨졌을 수 있다: 전에 돌려준 Entry *는 무효
        t->cap = new_cap;
    }
    Entry *e = &t->items[t->len++];
    snprintf(e->word, sizeof e->word, "%s", word);
    e->count = 0;
    return e;
}

int by_count(const void *a, const void *b) {
    const Entry *x = a, *y = b;
    if (x->count != y->count) {
        return y->count - x->count;         // 많은 것이 앞으로
    }
    return strcmp(x->word, y->word);        // 같으면 글자 순
}

int main(void) {
    Table t = {NULL, 0, 0};
    char word[32];
    int ch, n = 0;
    while ((ch = getchar()) != EOF) {       // 한 글자씩 읽으며 단어를 모은다
        if (isalpha(ch)) {
            if (n < (int)sizeof word - 1) {
                word[n++] = (char)tolower(ch);
            }
        } else if (n > 0) {
            word[n] = '\0';
            Entry *e = find_or_add(&t, word);
            if (e == NULL) {
                free(t.items);
                return 1;
            }
            e->count++;
            n = 0;
        }
    }
    if (n > 0) {                            // 마지막 단어 뒤에 공백이 없을 때
        word[n] = '\0';
        Entry *e = find_or_add(&t, word);
        if (e != NULL) {
            e->count++;
        }
    }
    qsort(t.items, t.len, sizeof t.items[0], by_count);
    size_t top = t.len < 3 ? t.len : 3;
    for (size_t i = 0; i < top; i++) {
        printf("%-6s %d\n", t.items[i].word, t.items[i].count);
    }
    printf("서로 다른 단어 %zu개\n", t.len);
    free(t.items);
    return 0;
}
```

입력:

```text
The cat and the hat.
The cat sat; a cat ran!
AND the end
```

실행 결과:

```text
the    4
cat    3
and    2
서로 다른 단어 8개
```

| 코드                                                  | 설명                                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `typedef struct { char word[32]; int count; } Entry;` | 단어를 구조체 **안에** 담았습니다. 단어마다 `malloc`하지 않아도 되지만, 31글자보다 긴 단어는 잘립니다. 구조체는 Day 50에서 자세히 배웁니다. |
| `Entry *find_or_add(Table *t, const char *word)`      | 있으면 그 칸을, 없으면 새 칸을 만들어 돌려줍니다. 돌려받은 포인터는 다음 `find_or_add` 전까지만 씁니다(`realloc`이 옮길 수 있으므로).       |
| `while ((ch = getchar()) != EOF)`                     | 한 글자씩 읽어 영문자면 단어에 모으고, 아니면 모은 단어를 셉니다. 줄 단위가 아니라서 버퍼 크기 문제가 없습니다.                             |
| `if (n < (int)sizeof word - 1)`                       | 단어 버퍼를 넘치지 않게 막았습니다.                                                                                                         |
| `if (n > 0) { ... }`(반복 뒤)                         | 입력이 영문자로 끝나면(`end` 뒤에 아무것도 없음) 마지막 단어가 남아 있습니다. 빠뜨리기 쉬운 경계입니다.                                     |
| `int by_count(const void *a, const void *b)`          | 개수가 많은 순, 같으면 `strcmp`로 글자 순입니다. `Entry` 배열이라 `const Entry *x = a;`로 바꿉니다.                                         |

Rust에서는 `HashMap`과 `entry`로 셉니다.

```rust
// 파일: word_freq.rs
use std::collections::HashMap;
use std::io::{self, Read};

fn main() -> io::Result<()> {
    let mut text = String::new();
    io::stdin().read_to_string(&mut text)?;
    let mut counts: HashMap<String, u32> = HashMap::new();
    for word in text
        .split(|c: char| !c.is_alphabetic())    // 글자가 아닌 것에서 나눈다
        .filter(|w| !w.is_empty())
    {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    let mut pairs: Vec<(&String, &u32)> = counts.iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(a.1).then(a.0.cmp(b.0)));   // 많은 순, 같으면 글자 순
    for (word, count) in pairs.iter().take(3) {
        println!("{word:<6} {count}");
    }
    println!("서로 다른 단어 {}개", counts.len());
    Ok(())
}
```

입력:

```text
The cat and the hat.
The cat sat; a cat ran!
AND the end
```

실행 결과:

```text
the    4
cat    3
and    2
서로 다른 단어 8개
```

- `text.split(|c: char| !c.is_alphabetic())`는 글자가 아닌 곳마다 나눕니다. 구두점이 이어지면 빈 조각이 생겨서 `filter`로 걸렀습니다.
- `*counts.entry(word.to_lowercase()).or_insert(0) += 1;`은 C의 `find_or_add` + `count++`를 한 줄로 합니다. `HashMap`은 평균적으로 한 번에 찾기 때문에 선형 탐색보다 훨씬 빠릅니다(Day 69).
- `HashMap`은 순서가 정해져 있지 않아서, 출력하기 전에 `Vec`으로 모아 **개수, 글자** 순으로 정렬했습니다. `b.1.cmp(a.1).then(a.0.cmp(b.0))`는 "개수는 내림차순, 같으면 단어는 오름차순"입니다.

Python에서는 `Counter`가 세고, 정렬 기준은 튜플로 줍니다.

```python
# 파일: word_freq.py
import re
import sys
from collections import Counter

text = sys.stdin.read()
counts = Counter(w.lower() for w in re.findall(r"[A-Za-z]+", text))
top = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3]   # 많은 순, 같으면 글자 순
for word, count in top:
    print(f"{word:<6} {count}")
print(f"서로 다른 단어 {len(counts)}개")
```

입력:

```text
The cat and the hat.
The cat sat; a cat ran!
AND the end
```

실행 결과:

```text
the    4
cat    3
and    2
서로 다른 단어 8개
```

- `re.findall(r"[A-Za-z]+", text)`는 영문자가 이어진 조각을 모두 찾습니다. 정규 표현식은 글 규칙을 짧게 쓰는 작은 언어입니다.
- `key=lambda kv: (-kv[1], kv[0])`는 "개수의 음수(내림차순), 그다음 단어(오름차순)"로 비교합니다. `Counter.most_common(3)`도 비슷하지만, 개수가 같을 때 글자 순이 아니라 먼저 나온 순서라서 직접 정렬했습니다.

## 10. 메모리·입출력 점검표

C 코드를 쓴 뒤 아래 질문에 모두 "예"라고 답할 수 있는지 확인하세요.

| 점검                                                           | 관련 날    |
| -------------------------------------------------------------- | ---------- |
| 배열을 넘길 때 길이도 넘겼는가?                                | Day 34     |
| 문자열 공간에 `'\0'` 자리를 더했는가?                          | Day 37     |
| `snprintf`·`%31s`처럼 크기를 정해 복사했는가?                  | Day 37, 46 |
| `malloc`·`realloc`·`fopen`의 결과를 확인했는가?                | Day 40, 46 |
| `realloc`은 새 변수로 받았는가?                                | Day 40     |
| 재사용되는 버퍼의 주소를 저장하지 않았는가?                    | Day 49     |
| 늘어나는 배열의 칸 주소를 오래 들고 있지 않았는가?             | Day 42, 49 |
| 받은 모든 공간과 파일을 모든 경로에서 정확히 한 번 돌려주는가? | Day 40, 46 |
| 읽기 반복을 읽기 함수의 반환값으로 멈추는가?                   | Day 46     |
| 입력 해석(`strtol`, `sscanf`)의 실패를 확인했는가?             | Day 43, 48 |

Rust에서는 이 중 대부분을 컴파일러가 검사하고, Python에서는 실행기가 대신합니다. 남는 것은 **입력 해석의 실패**와 **문제의 규칙**입니다.

## 11. 세 언어 비교

| 관점               | C                              | Rust                          | Python             |
| ------------------ | ------------------------------ | ----------------------------- | ------------------ |
| 코드 길이(줄 정렬) | 약 60줄                        | 약 15줄                       | 약 5줄             |
| 메모리 버그 가능성 | 높음(별칭, 누수, 해제 후 사용) | 컴파일 오류로 막힘            | 없음               |
| 정렬 비교          | 비교 함수 직접, `void *` 변환  | `Ord`, `sort_by`, `total_cmp` | 기본 비교, `key=`  |
| 실행 속도와 메모리 | 가장 적게 씀                   | C와 비슷                      | 객체마다 추가 비용 |
| 입력 해석 규칙     | 직접                           | 직접                          | 직접               |

## 12. 자주 하는 실수

### 실수 1: 읽기 버퍼의 주소를 저장한다 (C)

실습의 변형 문제입니다. 모든 칸이 마지막 줄을 가리킵니다. 줄마다 복사본을 만드세요.

### 실수 2: 문자열 포인터 배열의 비교 함수에서 strcmp(a, b)를 바로 쓴다 (C)

`a`와 `b`는 칸의 주소라 `strcmp`에 넘기면 주소 바이트를 글자로 비교합니다. `*(char *const *)a`로 한 번 따라가세요. 컴파일러는 `void *`라서 경고하지 않습니다.

### 실수 3: 배열을 먼저 해제한다 (C)

`free(v.items); for (...) free(v.items[i]);`는 해제한 배열을 읽습니다. 안쪽부터 해제하세요.

### 실수 4: 실수 목록을 sort한다 (Rust)

```rust
// 파일: sort_floats.rs (컴파일 오류: E0277)
fn main() {
    let mut v: Vec<f64> = vec![1.5, 0.5, 2.25];
    v.sort();
    println!("{v:?}");
}
```

실습의 디버그 문제입니다. `v.sort_by(|a, b| a.total_cmp(b))`로 쓰세요.

### 실수 5: 마지막 단어를 빠뜨린다 (세 언어)

"단어가 끝나는 곳(공백)을 만나면 센다" 방식은 입력이 단어로 끝날 때 마지막 단어를 놓칩니다. C 실습의 반복 뒤 `if (n > 0)`처럼 끝에서 한 번 더 확인하세요. Rust의 `split`과 Python의 `findall`은 이 경계를 알아서 처리합니다.

## 13. Q&A

**Q. C에서 정말 이렇게 길게 써야 하나요?**

A. 실무의 C 프로젝트는 오늘 만든 `Lines`, `lines_push`, `lines_free` 같은 도구를 한 번 만들어 두고 계속 씁니다. 또는 검증된 라이브러리(GLib 등)를 씁니다. 중요한 것은 그 도구가 속에서 무엇을 하는지 아는 것이고, 오늘 그것을 직접 만들어 봤습니다.

**Q. qsort는 안정 정렬인가요?**

A. 표준은 안정성을 보장하지 않습니다. 같은 값의 원래 순서가 바뀔 수 있어서, 오늘처럼 "개수가 같으면 글자 순"을 비교 함수에 직접 넣었습니다. Rust의 `sort`와 Python의 `sorted`는 안정 정렬이고, Rust의 `sort_unstable`은 안정하지 않은 대신 빠릅니다(Day 66).

**Q. 단어를 한글로 세려면요?**

A. C의 `isalpha`는 바이트 단위라 한글을 처리하지 못합니다. UTF-8을 해석해야 합니다(Day 38). Rust의 `char::is_alphabetic`과 Python의 `str.isalpha`는 한글도 글자로 봅니다. 다만 "사과를", "사과는"을 같은 단어로 보려면 조사를 떼는 규칙이 따로 필요합니다.

**Q. 입력이 아주 크면 어떻게 하나요?**

A. 오늘 프로그램은 모든 줄을 메모리에 올립니다. 메모리보다 큰 파일은 조각으로 나눠 정렬한 뒤 합치는 **외부 정렬**을 씁니다. 단어 세기는 한 번에 한 줄씩 읽으며 사전만 유지하면 되어서 큰 파일에도 쓸 수 있습니다.

## 14. 핵심 요약

- 크기를 모르는 입력은 **읽기 → 줄마다 힙 복사 → 늘어나는 배열에 모으기 → 처리 → 안쪽부터 해제**로 다룹니다.
- 재사용되는 읽기 버퍼의 주소를 저장하면 모든 칸이 같은 곳을 가리키는 **별칭 버그**가 됩니다.
- `qsort`의 비교 함수는 **칸의 주소**를 `void *`로 받으므로, 칸의 자료형 포인터로 바꿔 씁니다. 문자열 배열은 한 번 더 따라가야 합니다.
- `realloc`은 배열을 옮길 수 있어서 **칸의 주소**는 무효가 되지만, 칸에 **든 값**(문자열 주소)은 그대로입니다.
- Rust는 `Vec<String>`, `sort`, `HashMap`, Drop이, Python은 리스트, `sorted`, `Counter`, 실행기가 이 일들을 대신합니다. 입력을 어떻게 해석할지는 세 언어 모두 프로그래머가 정합니다.

## 15. 도전 문제

1. **(C)** 줄 정렬 프로그램에 `-r`(거꾸로)과 `-u`(중복 줄 한 번만) 기능을 추가하세요. 중복 제거는 정렬한 뒤 이웃한 줄을 비교하면 쉽고, 버리는 줄은 해제해야 합니다.
2. **(C)** 단어 세기의 `Table`을, 단어를 구조체 안이 아니라 힙에 따로 복사해 담는 `char *word`로 바꾸고, 해제 함수도 알맞게 고치세요. 긴 단어도 잘리지 않아야 합니다.
3. **(Rust)** 줄 정렬 프로그램을 `sort_by_key(|s| s.to_lowercase())`로 바꿔 대소문자를 무시하고, 원래 대소문자는 그대로 출력되는지 확인하세요.
4. **(Python)** 단어 세기를 한글 글에도 쓰도록 `re.findall(r"\w+", text)`로 바꾸고, 숫자까지 단어로 세어지는 문제를 어떻게 막을지 정해 고쳐 보세요.
