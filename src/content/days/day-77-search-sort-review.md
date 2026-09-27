---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-77-search-sort-review
courseId: crp-92
phaseId: phase-07
dayNumber: 77
date: "2026-12-16"
title: 탐색·정렬 종합 — 비교 함수로 원하는 순서 만들기
summary: 이진 탐색과 네 가지 정렬을 한 표로 정리하고, 실제 프로그램에서 쓰는 방법인 '표준 정렬 + 비교 기준'을 익힙니다. 성적표 미니 프로젝트로 C의 qsort·bsearch와 비교 함수, Python의 key 튜플과 안정 정렬 두 번, Rust의 sort_by·then_with·binary_search_by를 비교하고, 세 정렬의 비교 횟수를 같은 입력으로 측정합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-76-divide-conquer]
learningObjectives:
  - 삽입·병합·퀵 정렬과 이진 탐색의 복잡도, 안정성, 공간을 비교하고 상황에 맞게 고른다.
  - 비교 함수(음수·0·양수)와 키 함수의 차이를 설명하고 여러 기준 정렬을 만든다.
  - C qsort와 bsearch에 구조체 비교 함수를 넘겨 정렬하고 검색한다.
  - 안정 정렬을 두 번 적용해 '주 기준 → 보조 기준' 순서를 만든다.
  - 같은 기준으로 정렬한 배열에서만 이진 탐색이 올바르다는 것을 확인한다.
concepts:
  [
    comparator,
    key function,
    multi-key sort,
    stable sort,
    qsort,
    bsearch,
    sort_by,
    then_with,
    binary_search_by,
    bisect,
  ]
runnerMode: python
playgroundSource: |
  # 파일: sort_keys.py — 정렬 기준을 바꿔 보세요.
  students = [("민수", 88), ("지아", 95), ("서연", 88), ("주호", 81)]
  print(sorted(students))                                   # 이름순(튜플 전체 비교)
  print(sorted(students, key=lambda s: s[1]))               # 점수 오름차순
  print(sorted(students, key=lambda s: (-s[1], s[0])))      # 점수 내림차순, 같으면 이름순
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day77-predict-py
    title: 튜플 키로 여러 기준 정렬하기
    kind: predict
    objective: 키 튜플이 앞 원소부터 비교된다는 것을 이용해 정렬 결과를 예측한다.
    prompt: 출력될 이름 순서를 공백으로 구분해 적으세요.
    starter: |-
      people = [("다은", 20, 170), ("가온", 22, 165), ("나래", 20, 160), ("라희", 22, 175)]
      result = sorted(people, key=lambda p: (-p[1], p[2]))
      print(*[p[0] for p in result])
    answer: "가온 라희 나래 다은"
    hint: "첫 기준은 나이 내림차순(-나이가 작을수록 앞)입니다. 22살 둘이 먼저 오고, 같은 나이 안에서는 키(p[2]) 오름차순입니다."
    explanation: "22살은 가온(165), 라희(175) 순, 20살은 나래(160), 다은(170) 순입니다. 키 튜플의 첫 원소가 같을 때만 두 번째 원소를 비교합니다. 숫자 기준을 내림차순으로 만들 때는 -를 붙이면 편합니다."
    commonMistakes:
      - "-p[1] 때문에 나이가 적은 사람이 먼저라고 생각함"
      - "같은 나이 안에서도 입력 순서를 유지한다고 생각함(두 번째 기준이 있음)"
    language: python
    verification: run
  - id: ex-day77-predict-c
    title: qsort 비교 함수의 반환값 예측하기
    kind: predict
    objective: 비교 함수가 돌려주는 부호가 정렬 방향을 정한다는 것을 확인한다.
    prompt: 출력될 배열을 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int cmp(const void *x, const void *y) {
          int a = *(const int *)x, b = *(const int *)y;
          int ea = a % 2 == 0, eb = b % 2 == 0;
          if (ea != eb) return eb - ea;
          return (a > b) - (a < b);
      }

      int main(void) {
          int v[] = {5, 2, 9, 4, 1, 8};
          qsort(v, 6, sizeof v[0], cmp);
          for (int i = 0; i < 6; i++) printf("%d ", v[i]);
          printf("\n");
          return 0;
      }
    answer: "2 4 8 1 5 9"
    hint: "ea, eb는 짝수면 1입니다. a만 짝수면 eb - ea = -1이라 a가 앞입니다. 짝수·홀수가 같으면 크기 오름차순입니다."
    explanation: "짝수를 먼저, 그 안에서 오름차순으로 정렬하는 비교 함수입니다. 비교 함수는 'a가 앞이면 음수, 같으면 0, 뒤면 양수'라는 약속만 지키면 어떤 기준이든 만들 수 있습니다."
    commonMistakes:
      - "eb - ea의 부호를 반대로 읽어 홀수를 먼저 적음"
      - "짝수 그룹 안의 순서를 입력 순서대로 적음(2 4 8은 우연히 같지만 이유가 다름)"
    language: c
    verification: run
  - id: ex-day77-fill
    title: Rust then_with로 두 번째 기준 채우기
    kind: fill
    objective: 첫 기준이 같을 때만 두 번째 기준을 비교하는 Ordering 조합을 쓴다.
    prompt: "빈칸에 '길이가 같으면 사전순'이 되도록 두 번째 비교를 채우세요."
    starter: |-
      fn main() {
          let mut words = vec!["pear", "fig", "apple", "kiwi", "date", "plum"];
          words.sort_by(|a, b| a.len().cmp(&b.len()).then_with(|| _____));
          println!("{:?}", words);
      }
    answer: |-
      fn main() {
          let mut words = vec!["pear", "fig", "apple", "kiwi", "date", "plum"];
          words.sort_by(|a, b| a.len().cmp(&b.len()).then_with(|| a.cmp(b)));
          println!("{:?}", words);
      }
    output: '["fig", "date", "kiwi", "pear", "plum", "apple"]'
    hint: "a와 b는 &&str입니다. a.cmp(b)는 두 문자열을 사전순으로 비교한 Ordering을 돌려줍니다."
    explanation: "then_with는 앞의 결과가 Equal일 때만 뒤의 클로저를 계산합니다. 길이 4인 date, kiwi, pear, plum이 사전순으로 정렬되었습니다. 키 튜플로 쓰면 words.sort_by_key(|w| (w.len(), *w))와 같습니다."
    commonMistakes:
      - "then(a.cmp(b))로 써도 되지만, 무거운 비교라면 then_with가 필요할 때만 계산해 효율적임"
      - "b.cmp(a)로 써서 같은 길이 안에서 역순이 됨"
    language: rust
    verification: run
  - id: ex-day77-modify
    title: Python 안정 정렬 두 번으로 반별 순위 만들기
    kind: modify
    objective: 보조 기준으로 먼저, 주 기준으로 나중에 정렬하면 두 기준이 모두 반영된다는 것을 확인한다.
    prompt: "반별로 묶되 반 안에서는 점수 내림차순이 되도록 고치세요. sorted를 두 번 쓰고, 키 튜플은 쓰지 마세요."
    starter: |-
      records = [("민수", "B", 70), ("지아", "A", 90), ("하준", "B", 85), ("서연", "A", 75), ("주호", "B", 90)]
      result = sorted(records, key=lambda r: r[1])
      print([f"{r[1]}{r[0]}" for r in result])
    answer: |-
      records = [("민수", "B", 70), ("지아", "A", 90), ("하준", "B", 85), ("서연", "A", 75), ("주호", "B", 90)]
      by_score = sorted(records, key=lambda r: r[2], reverse=True)
      result = sorted(by_score, key=lambda r: r[1])
      print([f"{r[1]}{r[0]}" for r in result])
    output: "['A지아', 'A서연', 'B주호', 'B하준', 'B민수']"
    hint: "마지막에 정렬한 기준이 '주 기준'이 됩니다. 반으로 정렬할 때 같은 반 안에서는 앞 단계(점수순)의 순서가 유지됩니다."
    explanation: "먼저 점수 내림차순으로 정렬하고, 그 결과를 반으로 안정 정렬했습니다. 같은 반끼리는 점수순이 그대로 남습니다. reverse=True도 안정성을 유지합니다(같은 값의 순서를 뒤집지 않음). 기준마다 오름·내림이 다르거나 키를 음수로 만들 수 없는 경우(문자열 내림차순 등)에 이 방법이 특히 유용합니다."
    commonMistakes:
      - "반으로 먼저 정렬한 뒤 점수로 정렬해 반 묶음이 흩어짐"
      - "점수 정렬 결과를 버리고 원본 records를 다시 반으로 정렬함"
    language: python
    verification: run
  - id: ex-day77-debug
    title: C 비교 함수의 뺄셈 넘침 고치기
    kind: debug
    objective: return a - b 형태의 비교 함수가 큰 값에서 넘쳐 틀린 순서를 만든다는 것을 이해한다.
    prompt: "비교 함수가 a - b를 돌려주는데, 매우 큰 수와 매우 작은 수를 빼면 int 범위를 넘습니다(정의되지 않은 동작). 넘치지 않는 방법으로 고쳐 -2147483000 -5 0 7 2147483000이 출력되게 하세요."
    starter: |-
      #include <stdio.h>
      #include <stdlib.h>

      int cmp(const void *x, const void *y) {
          int a = *(const int *)x, b = *(const int *)y;
          return a - b;
      }

      int main(void) {
          int v[] = {2147483000, -5, 7, -2147483000, 0};
          qsort(v, 5, sizeof v[0], cmp);
          for (int i = 0; i < 5; i++) printf("%d ", v[i]);
          printf("\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <stdlib.h>

      int cmp(const void *x, const void *y) {
          int a = *(const int *)x, b = *(const int *)y;
          return (a > b) - (a < b);
      }

      int main(void) {
          int v[] = {2147483000, -5, 7, -2147483000, 0};
          qsort(v, 5, sizeof v[0], cmp);
          for (int i = 0; i < 5; i++) printf("%d ", v[i]);
          printf("\n");
          return 0;
      }
    output: "-2147483000 -5 0 7 2147483000"
    hint: "2147483000 - (-2147483000)은 약 43억이라 int에 담을 수 없습니다. 크기를 비교한 결과(0 또는 1) 두 개를 빼면 -1, 0, 1만 나옵니다."
    explanation: "a - b는 작은 수에서는 편리하지만 넘침이 생기면 부호가 뒤집혀 정렬이 망가집니다. (a > b) - (a < b)는 항상 -1, 0, 1이라 안전합니다. Python과 Rust는 이 문제가 없습니다. Python 정수는 넘치지 않고, Rust는 cmp가 Ordering을 돌려주기 때문입니다."
    commonMistakes:
      - "long long으로 바꿔 빼지만 반환형 int로 다시 잘려 같은 문제가 남음"
      - "a < b ? -1 : 1로 써서 같은 값일 때 0을 돌려주지 않음"
    language: c
    verification: run
  - id: ex-day77-independent
    title: Rust로 파일 목록 정렬하기
    kind: independent
    objective: 요구 사항 두 개를 비교 함수 하나로 표현한다.
    prompt: "파일을 (이름, 크기) 목록으로 받아 '폴더(이름이 /로 끝남)를 먼저, 그 안에서는 이름순, 파일은 크기가 큰 순, 크기가 같으면 이름순'으로 정렬하세요. 결과가 docs/ src/ video.mp4 photo.jpg a.txt b.txt 순서로 출력되어야 합니다."
    starter: |-
      fn main() {
          let files = vec![("b.txt", 10), ("src/", 0), ("video.mp4", 900), ("a.txt", 10), ("docs/", 0), ("photo.jpg", 300)];
          println!("{}", files.len());
      }
    answer: |-
      use std::cmp::Reverse;

      fn main() {
          let mut files = vec![("b.txt", 10), ("src/", 0), ("video.mp4", 900), ("a.txt", 10), ("docs/", 0), ("photo.jpg", 300)];
          files.sort_by(|a, b| {
              let a_dir = a.0.ends_with('/');
              let b_dir = b.0.ends_with('/');
              b_dir
                  .cmp(&a_dir)
                  .then_with(|| if a_dir { a.0.cmp(b.0) } else { Reverse(a.1).cmp(&Reverse(b.1)) })
                  .then_with(|| a.0.cmp(b.0))
          });
          let names: Vec<&str> = files.iter().map(|f| f.0).collect();
          println!("{}", names.join(" "));
      }
    output: "docs/ src/ video.mp4 photo.jpg a.txt b.txt"
    hint: "bool도 비교할 수 있습니다(false < true). 폴더를 먼저 두려면 b_dir.cmp(&a_dir)처럼 순서를 뒤집으세요. 크기 내림차순은 Reverse로 감싸면 됩니다."
    explanation: "폴더끼리는 이름순, 파일끼리는 크기 내림차순, 크기가 같은 a.txt와 b.txt는 마지막 then_with의 이름순으로 정해집니다. 요구 사항이 복잡해도 '먼저 비교할 것부터 차례로 then_with로 잇는다'는 규칙이면 비교 함수 하나로 표현할 수 있습니다."
    commonMistakes:
      - "a_dir.cmp(&b_dir)로 써서 폴더가 맨 뒤로 감"
      - "크기가 같은 파일의 순서를 정하지 않아 입력 순서(b.txt, a.txt)가 그대로 남음"
    language: rust
    verification: run
quiz:
  - id: quiz-day77-01
    question: 원소가 100만 개이고 거의 무작위인 배열을 정렬할 때 직접 구현한다면 알맞은 것은?
    choices: ["삽입 정렬", "병합 정렬이나 퀵 정렬", "버블 정렬", "선택 정렬"]
    answerIndex: 1
    explanation: O(n log n) 정렬이 필요합니다. 삽입·버블·선택 정렬은 평균 O(n²)이라 약 5,000억 번 비교합니다. 실제로는 직접 구현하지 않고 표준 정렬을 씁니다.
  - id: quiz-day77-02
    question: C의 qsort에 넘기는 비교 함수가 a를 b보다 앞에 두고 싶을 때 돌려줘야 하는 값은?
    choices: ["음수", "0", "양수", "1만 가능"]
    answerIndex: 0
    explanation: 음수는 a가 앞, 0은 같음, 양수는 a가 뒤라는 뜻입니다. -1, 0, 1이 아니어도 부호만 맞으면 됩니다. Rust의 Ordering::Less, Equal, Greater가 같은 약속입니다.
  - id: quiz-day77-03
    question: 점수로 정렬한 배열을 이름으로 이진 탐색하면 어떻게 되나요?
    choices:
      - 항상 찾는다
      - 이름순으로 정렬되어 있지 않으므로 있는 이름도 못 찾을 수 있다
      - 속도만 느려진다
      - 컴파일 오류가 난다
    answerIndex: 1
    explanation: 이진 탐색은 '탐색하는 기준'으로 정렬되어 있을 때만 올바릅니다. 오류 없이 틀린 답을 내므로 특히 위험합니다. 정렬 기준과 탐색 기준을 같게 맞추세요.
  - id: quiz-day77-04
    question: "Python에서 '반별, 반 안에서는 점수 내림차순'을 안정 정렬 두 번으로 만들 때 순서는?"
    choices:
      - 반으로 정렬 → 점수로 정렬
      - 점수로 정렬 → 반으로 정렬
      - 어느 순서든 같다
      - 안정 정렬로는 만들 수 없다
    answerIndex: 1
    explanation: 마지막 정렬이 주 기준이 됩니다. 점수로 먼저 정렬해 두면, 반으로 정렬할 때 같은 반 안에서는 점수 순서가 유지됩니다. 퀵 정렬 같은 불안정 정렬로는 이 방법을 쓸 수 없습니다.
  - id: quiz-day77-05
    question: 퀵 정렬 대신 병합 정렬(또는 Timsort)을 골라야 하는 가장 분명한 이유는?
    choices:
      - 메모리를 적게 써야 할 때
      - 같은 기준의 원소들이 원래 순서를 유지해야 할 때(안정성)
      - 원소가 10개 이하일 때
      - 원소가 모두 정수일 때
    answerIndex: 1
    explanation: 병합 정렬 계열은 안정적이고 최악의 경우에도 O(n log n)입니다. 메모리를 아껴야 하고 안정성이 필요 없다면 퀵 정렬 계열(sort_unstable 등)이 알맞습니다.
---

## 1. 오늘 배울 내용

Day 71부터 Day 76까지 복잡도, 이진 탐색, 세 가지 정렬, 분할 정복을 배웠습니다. 오늘은 탐색과 정렬 부분을 마무리합니다.

1. 지금까지 배운 탐색·정렬 알고리즘을 **한 표로 정리**합니다.
2. 실제 프로그램에서 정렬하는 방법, 즉 **표준 정렬 함수 + 비교 기준**을 배웁니다. 직접 만든 정렬 함수를 쓸 일은 거의 없지만, "무엇을 기준으로 정렬할지" 표현하는 방법은 언어마다 다르고 꼭 알아야 합니다.
3. 미니 프로젝트로 **성적표 도구**를 만듭니다. 여러 기준으로 정렬하고, 정렬된 배열에서 이진 탐색합니다.
   - C: `qsort`와 `bsearch`에 **비교 함수 포인터**를 넘깁니다.
   - Python: `sorted`에 **키 튜플**을 주거나 안정 정렬을 **두 번** 씁니다.
   - Rust: `sort_by`와 `then_with`로 **Ordering을 이어 붙입니다.**
4. 응용으로 세 정렬 알고리즘의 비교 횟수를 같은 입력으로 측정해 봅니다.

## 2. 탐색·정렬 한눈에 보기

| 알고리즘  | 최선       | 평균       | 최악       | 추가 공간 | 안정   | 이럴 때                                   | Day |
| --------- | ---------- | ---------- | ---------- | --------- | ------ | ----------------------------------------- | --- |
| 선형 탐색 | O(1)       | O(n)       | O(n)       | O(1)      | -      | 정렬되지 않은 데이터, 한 번만 찾을 때     | 71  |
| 이진 탐색 | O(1)       | O(log n)   | O(log n)   | O(1)      | -      | 정렬된 배열에서 여러 번 찾을 때           | 72  |
| 삽입 정렬 | O(n)       | O(n²)      | O(n²)      | O(1)      | 예     | 원소가 적거나 거의 정렬되어 있을 때       | 73  |
| 병합 정렬 | O(n log n) | O(n log n) | O(n log n) | O(n)      | 예     | 안정성·최악 보장이 필요할 때, 연결 리스트 | 74  |
| 퀵 정렬   | O(n log n) | O(n log n) | O(n²)      | O(log n)  | 아니요 | 제자리, 평균적으로 빠름                   | 75  |
| 힙 정렬   | O(n log n) | O(n log n) | O(n log n) | O(1)      | 아니요 | 제자리 + 최악 보장                        | 66  |

그리고 각 언어의 **표준** 정렬과 탐색입니다. 실제로는 이것을 씁니다.

| 언어   | 정렬                                                | 안정?                             | 이진 탐색                                              |
| ------ | --------------------------------------------------- | --------------------------------- | ------------------------------------------------------ |
| C      | `qsort(배열, 개수, 크기, 비교함수)`                 | 보장 없음                         | `bsearch(키, 배열, 개수, 크기, 비교함수)`              |
| Python | `sorted(목록, key=, reverse=)`, `목록.sort(...)`    | 예 (Timsort)                      | `bisect.bisect_left(목록, 값, key=)`                   |
| Rust   | `sort`, `sort_by`, `sort_by_key` / `sort_unstable*` | `sort*`는 예, `unstable`은 아니요 | `binary_search`, `binary_search_by`, `partition_point` |

## 3. 그림으로 이해하기

정렬 알고리즘은 결국 "두 원소 중 **누가 앞인가**"를 수없이 묻습니다. 그 질문에 답하는 부분만 바꾸면 같은 정렬 알고리즘으로 어떤 순서든 만들 수 있습니다.

```text
          ┌────────────────────────────┐
원소들 ──►│ 정렬 알고리즘 (표준 라이브러리) │──► 정렬된 원소들
          └──────────┬─────────────────┘
                     │ "a와 b 중 누가 앞인가?"
                     ▼
          ┌────────────────────────────┐
          │ 비교 기준 (우리가 작성)      │   C: 비교 함수 → 음수 / 0 / 양수
          │                            │   Python: key 함수 → 비교할 값
          └────────────────────────────┘   Rust: 비교 클로저 → Ordering
```

## 4. 천천히 풀어보기

### 4.1 비교 함수: 음수, 0, 양수

비교 함수는 두 원소 a, b를 받아 **부호**로 대답합니다.

| 반환값 | 뜻               | Rust의 Ordering |
| ------ | ---------------- | --------------- |
| 음수   | a가 b보다 **앞** | `Less`          |
| 0      | 순서상 같다      | `Equal`         |
| 양수   | a가 b보다 **뒤** | `Greater`       |

오름차순 정수라면 "a < b면 음수"입니다. 내림차순은 부호를 뒤집으면 됩니다. 여러 기준이라면 **첫 기준이 같을 때만 다음 기준을 본다**는 순서로 씁니다.

```text
비교(a, b):
    점수가 다르면 → 점수로 결정 (내림차순)
    점수가 같으면 → 이름으로 결정 (오름차순)
```

C에서 흔히 `return a - b;`라고 쓰지만, 큰 수끼리 빼면 **넘쳐서** 부호가 뒤집힐 수 있습니다(실습의 디버그 문제). `(a > b) - (a < b)`처럼 비교 결과로 계산하는 것이 안전합니다.

### 4.2 키 함수: 비교할 값을 뽑아 주기

Python은 비교 함수 대신 **키 함수**를 씁니다. "각 원소를 무엇으로 바꿔서 비교할까"만 알려 주면 됩니다. 여러 기준은 **튜플**로 만듭니다. 튜플은 첫 원소부터 비교하고, 같으면 다음 원소를 비교하므로 자동으로 "첫 기준 → 둘째 기준"이 됩니다.

```python
key=lambda s: (-s.score, s.name)    # 점수 내림차순(-), 같으면 이름 오름차순
```

숫자는 `-`를 붙여 내림차순을 만들 수 있지만 **문자열에는 `-`를 붙일 수 없습니다.** 그럴 때는 다음 방법을 씁니다.

### 4.3 안정 정렬 두 번: 보조 기준 먼저, 주 기준 나중

안정 정렬은 같은 키의 원소들이 **원래 순서를 유지**합니다. 이 성질을 이용하면,

1. 먼저 **보조 기준**(두 번째로 중요한 것)으로 정렬하고,
2. 그 결과를 **주 기준**으로 다시 정렬합니다.

2단계에서 주 기준이 같은 원소들은 1단계의 순서(보조 기준 순서)를 그대로 유지하므로, 두 기준이 모두 반영됩니다. 기준마다 방향(오름·내림)이 달라도 `reverse=True`를 따로 줄 수 있어 편리합니다. **불안정 정렬로는 이 방법을 쓸 수 없습니다.** C의 `qsort`는 안정성을 보장하지 않으므로 C에서는 비교 함수 하나에 모든 기준을 넣어야 합니다.

### 4.4 정렬 기준과 탐색 기준은 같아야 한다

이진 탐색은 **탐색하는 기준으로 정렬되어 있을 때만** 올바릅니다. 점수로 정렬한 배열을 이름으로 이진 탐색하면, 오류 없이 **틀린 답**(있는데 없다고 함)을 냅니다. 그래서 오늘의 프로그램들은 이진 탐색 직전에 점수 오름차순으로 **다시 정렬**합니다. 표준 라이브러리의 이진 탐색 함수에 비교 기준을 줄 때는 정렬할 때와 **같은 기준**을 넘겨야 합니다.

## 5. C로 구현하기

C 프로그램은 구조체 배열을 `qsort`로 "점수 내림차순, 같으면 이름순"으로 정렬하고, 점수 오름차순으로 다시 정렬해 `bsearch`로 점수를 찾습니다. `printf`의 폭 지정자가 한글을 바이트 단위로 세므로 이름은 로마자로 적었습니다.

```c
// 파일: gradebook.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[12];
    int score;
    char group;                 // 반: 'A' 또는 'B'
} Student;

// 점수 내림차순, 같으면 이름 오름차순
int by_score_desc_name(const void *x, const void *y) {
    const Student *a = x, *b = y;
    if (a->score != b->score) {
        return (b->score > a->score) - (b->score < a->score);
    }
    return strcmp(a->name, b->name);
}

// 점수 오름차순 (이진 탐색용)
int by_score_asc(const void *x, const void *y) {
    const Student *a = x, *b = y;
    return (a->score > b->score) - (a->score < b->score);
}

// bsearch용: 키(점수)와 원소를 비교
int score_key(const void *key, const void *elem) {
    int k = *(const int *)key;
    const Student *s = elem;
    return (k > s->score) - (k < s->score);
}

void print_all(const char *title, const Student s[], int n) {
    printf("%s\n", title);
    for (int i = 0; i < n; i++) {
        printf("  %-8s %c %3d\n", s[i].name, s[i].group, s[i].score);
    }
}

int main(void) {
    Student s[] = {
        {"minsu", 88, 'A'}, {"jia", 95, 'B'}, {"hajun", 72, 'A'}, {"seoyeon", 88, 'B'},
        {"doyun", 64, 'A'}, {"yerin", 95, 'A'}, {"juho", 81, 'B'}, {"sua", 77, 'B'},
    };
    int n = sizeof s / sizeof s[0];

    qsort(s, (size_t)n, sizeof s[0], by_score_desc_name);
    print_all("점수 내림차순, 같으면 이름순:", s, n);
    printf("1등~3등: %s, %s, %s\n", s[0].name, s[1].name, s[2].name);

    qsort(s, (size_t)n, sizeof s[0], by_score_asc);
    int key = 81;
    Student *found = bsearch(&key, s, (size_t)n, sizeof s[0], score_key);
    printf("81점 학생: %s\n", found ? found->name : "없음");
    key = 90;
    found = bsearch(&key, s, (size_t)n, sizeof s[0], score_key);
    printf("90점 학생: %s\n", found ? found->name : "없음");
    printf("중앙값(4번째와 5번째의 평균): %.1f\n", (s[3].score + s[4].score) / 2.0);
    return 0;
}
```

실행 결과:

```text
점수 내림차순, 같으면 이름순:
  jia      B  95
  yerin    A  95
  minsu    A  88
  seoyeon  B  88
  juho     B  81
  sua      B  77
  hajun    A  72
  doyun    A  64
1등~3등: jia, yerin, minsu
81점 학생: juho
90점 학생: 없음
중앙값(4번째와 5번째의 평균): 84.5
```

### 코드 한 부분씩 읽기

| 코드                                                    | 설명                                                                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `int by_score_desc_name(const void *x, const void *y)`  | `qsort`는 어떤 타입이든 정렬하도록 원소의 주소를 `const void *`로 넘깁니다. 비교 함수 안에서 원래 타입으로 바꿔 씁니다.        |
| `const Student *a = x, *b = y;`                         | C에서는 `void *`를 다른 포인터 타입에 그대로 대입할 수 있습니다. `const`를 붙여 비교 함수가 원소를 바꾸지 않겠다고 약속합니다. |
| `return (b->score > a->score) - (b->score < a->score);` | a와 b의 자리를 바꿔 **내림차순**을 만들었습니다. b의 점수가 크면 1, 즉 a가 뒤로 갑니다.                                        |
| `return strcmp(a->name, b->name);`                      | 점수가 같을 때만 여기에 옵니다. `strcmp`도 음수·0·양수를 돌려주므로 그대로 반환하면 이름 오름차순입니다.                       |
| `qsort(s, (size_t)n, sizeof s[0], by_score_desc_name);` | 배열, 원소 수, **원소 하나의 크기**, 비교 함수를 넘깁니다. 함수 이름만 쓰면 함수의 주소(함수 포인터)가 전달됩니다.             |
| `int score_key(const void *key, const void *elem)`      | `bsearch`의 비교 함수는 첫 인자로 **찾는 키**, 둘째 인자로 **배열 원소**를 받습니다. 키와 원소의 타입이 달라도 됩니다.         |
| `bsearch(&key, s, (size_t)n, sizeof s[0], score_key)`   | 배열이 **점수 오름차순**으로 정렬된 뒤에 호출해야 합니다. 찾으면 원소의 주소, 없으면 NULL입니다.                               |
| `(s[3].score + s[4].score) / 2.0`                       | 원소 8개의 중앙값은 가운데 두 값의 평균입니다. `2.0`으로 나눠 실수 나눗셈이 되게 했습니다.                                     |

> **참고**: `qsort`는 안정성을 보장하지 않습니다. jia와 yerin이 둘 다 95점이지만 이 결과가 이름순인 이유는 비교 함수에 이름 기준을 넣었기 때문이지, 원래 순서를 지켰기 때문이 아닙니다.

## 6. Python으로 구현하기

Python 버전은 여러 기준 정렬을 **키 튜플**과 **안정 정렬 두 번**의 두 가지 방법으로 보여 주고, `bisect`로 점수 범위를 찾습니다.

```python
# 파일: gradebook.py
import bisect
from operator import itemgetter

students = [
    ("민수", 88, "A"), ("지아", 95, "B"), ("하준", 72, "A"), ("서연", 88, "B"),
    ("도윤", 64, "A"), ("예린", 95, "A"), ("주호", 81, "B"), ("수아", 77, "B"),
]

# ① 여러 기준을 한 번에: 키를 튜플로 (점수는 음수로 바꿔 내림차순)
ranking = sorted(students, key=lambda s: (-s[1], s[0]))
print("점수 내림차순, 같으면 이름순:")
for rank, (name, score, group) in enumerate(ranking, start=1):
    print(f"  {rank}등 {name} {group} {score}")

# ② 안정 정렬을 두 번: 먼저 '보조 기준', 그다음 '주 기준'
by_name = sorted(students, key=itemgetter(0))
by_group = sorted(by_name, key=itemgetter(2))
print("반별(반 안에서는 이름순):", [f"{g}-{n}" for n, _, g in by_group])

# ③ 점수로 정렬한 뒤 이진 탐색
by_score = sorted(students, key=itemgetter(1))
scores = [s[1] for s in by_score]
for target in [81, 90]:
    i = bisect.bisect_left(scores, target)
    hit = by_score[i][0] if i < len(scores) and scores[i] == target else "없음"
    print(f"{target}점 학생: {hit}")
lo, hi = bisect.bisect_left(scores, 80), bisect.bisect_left(scores, 90)
print("80점대:", [s[0] for s in by_score[lo:hi]])
print("중앙값:", (scores[3] + scores[4]) / 2)
```

실행 결과:

```text
점수 내림차순, 같으면 이름순:
  1등 예린 A 95
  2등 지아 B 95
  3등 민수 A 88
  4등 서연 B 88
  5등 주호 B 81
  6등 수아 B 77
  7등 하준 A 72
  8등 도윤 A 64
반별(반 안에서는 이름순): ['A-도윤', 'A-민수', 'A-예린', 'A-하준', 'B-서연', 'B-수아', 'B-주호', 'B-지아']
81점 학생: 주호
90점 학생: 없음
80점대: ['주호', '민수', '서연']
중앙값: 84.5
```

### 코드 한 부분씩 읽기

| 코드                                                                        | 설명                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key=lambda s: (-s[1], s[0])`                                               | 점수를 음수로 바꿔 내림차순, 이름은 그대로 오름차순입니다. 한글 이름은 유니코드 순서(가나다순)로 비교되어 예린이 지아보다 앞입니다. C 결과에서 jia가 yerin보다 앞인 것은 로마자 순서이기 때문입니다. |
| `enumerate(ranking, start=1)`                                               | 순위를 1부터 붙입니다.                                                                                                                                                                               |
| `from operator import itemgetter` / `itemgetter(0)`                         | `lambda s: s[0]`과 같은 함수를 만들어 줍니다. 조금 더 빠르고 읽기 쉽습니다.                                                                                                                          |
| `by_name = sorted(...itemgetter(0))` → `sorted(by_name, key=itemgetter(2))` | 4.3절의 안정 정렬 두 번입니다. 이름순으로 먼저 정렬한 뒤 반으로 정렬해, 반 안에서는 이름순이 유지되었습니다.                                                                                         |
| `scores = [s[1] for s in by_score]`                                         | `bisect`에 넘길 **정렬된 점수 목록**을 따로 만들었습니다. Python 3.10부터는 `bisect_left(by_score, target, key=itemgetter(1))`처럼 key를 직접 줄 수도 있습니다.                                      |
| `bisect_left(scores, 80)`, `bisect_left(scores, 90)`                        | 80 이상인 첫 위치부터 90 이상인 첫 위치 직전까지가 80점대입니다(Day 72의 lower bound). 81, 88, 88점인 세 명이고, 같은 88점인 민수와 서연은 **안정 정렬** 덕분에 입력 순서입니다.                     |

## 7. Rust로 구현하기

Rust 버전은 `Ordering`을 돌려주는 비교 클로저를 `then_with`로 이어 여러 기준을 표현하고, `binary_search_by`에 **같은 기준**을 넘겨 검색합니다.

```rust
// 파일: gradebook.rs
#[derive(Debug, Clone)]
struct Student {
    name: &'static str,
    score: u32,
    group: char,
}

fn main() {
    let mut students = vec![
        Student { name: "민수", score: 88, group: 'A' },
        Student { name: "지아", score: 95, group: 'B' },
        Student { name: "하준", score: 72, group: 'A' },
        Student { name: "서연", score: 88, group: 'B' },
        Student { name: "도윤", score: 64, group: 'A' },
        Student { name: "예린", score: 95, group: 'A' },
        Student { name: "주호", score: 81, group: 'B' },
        Student { name: "수아", score: 77, group: 'B' },
    ];

    // 점수 내림차순, 같으면 이름 오름차순
    students.sort_by(|a, b| b.score.cmp(&a.score).then_with(|| a.name.cmp(b.name)));
    println!("점수 내림차순, 같으면 이름순:");
    for (i, s) in students.iter().enumerate() {
        println!("  {}등 {} {} {}", i + 1, s.name, s.group, s.score);
    }

    // 반별, 반 안에서는 점수 내림차순 (키를 튜플로)
    let mut by_group = students.clone();
    by_group.sort_by_key(|s| (s.group, std::cmp::Reverse(s.score)));
    let labels: Vec<String> = by_group.iter().map(|s| format!("{}-{}{}", s.group, s.name, s.score)).collect();
    println!("반별: {:?}", labels);

    // 점수 오름차순으로 정렬한 뒤 이진 탐색
    students.sort_by_key(|s| s.score);
    for target in [81, 90] {
        match students.binary_search_by(|s| s.score.cmp(&target)) {
            Ok(i) => println!("{target}점 학생: {}", students[i].name),
            Err(i) => println!("{target}점 학생: 없음 (넣는다면 {i}번 자리)"),
        }
    }
    let start = students.partition_point(|s| s.score < 80);
    let end = students.partition_point(|s| s.score < 90);
    let eighties: Vec<&str> = students[start..end].iter().map(|s| s.name).collect();
    println!("80점대: {:?}", eighties);
    let median = (students[3].score + students[4].score) as f64 / 2.0;
    println!("중앙값: {median}");
}
```

실행 결과:

```text
점수 내림차순, 같으면 이름순:
  1등 예린 A 95
  2등 지아 B 95
  3등 민수 A 88
  4등 서연 B 88
  5등 주호 B 81
  6등 수아 B 77
  7등 하준 A 72
  8등 도윤 A 64
반별: ["A-예린95", "A-민수88", "A-하준72", "A-도윤64", "B-지아95", "B-서연88", "B-주호81", "B-수아77"]
81점 학생: 주호
90점 학생: 없음 (넣는다면 6번 자리)
80점대: ["주호", "민수", "서연"]
중앙값: 84.5
```

### 코드 한 부분씩 읽기

| 코드                                                       | 설명                                                                                                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `b.score.cmp(&a.score)`                                    | a와 b의 자리를 바꿔 **내림차순**으로 비교합니다. `cmp`는 `Ordering`을 돌려줍니다.                                                                         |
| `.then_with(\|\| a.name.cmp(b.name))`                      | 앞의 결과가 `Equal`일 때만 클로저를 실행해 이름으로 비교합니다. C의 "점수가 같으면 strcmp"를 한 줄로 쓴 것입니다.                                         |
| `sort_by_key(\|s\| (s.group, std::cmp::Reverse(s.score)))` | Python의 키 튜플과 같습니다. 문자(`char`)는 오름차순, 점수는 `Reverse`로 내림차순입니다. Rust는 `-`를 붙일 수 없는 타입도 `Reverse`로 뒤집을 수 있습니다. |
| `students.clone()`                                         | 원래 순위표를 유지하려고 복사본을 정렬했습니다. `#[derive(Clone)]`이 있어야 합니다.                                                                       |
| `binary_search_by(\|s\| s.score.cmp(&target))`             | 클로저는 "원소가 찾는 값보다 앞이면 Less"를 돌려줘야 합니다. 정렬 기준(점수 오름차순)과 방향이 같아야 합니다.                                             |
| `Err(i) => ... 넣는다면 {i}번 자리`                        | 없으면 정렬을 유지하며 넣을 위치를 알려 줍니다(Day 72).                                                                                                   |
| `partition_point(\|s\| s.score < 80)`                      | 조건이 참인 앞부분의 길이입니다. 80점대의 시작과 끝을 구하는 데 썼습니다.                                                                                 |

## 8. 실행 추적

Python의 안정 정렬 두 번이 어떻게 반별 이름순을 만드는지 따라갑니다(점수는 생략).

| 단계               | 결과(반-이름)                                                                          |
| ------------------ | -------------------------------------------------------------------------------------- |
| 입력               | A민수, B지아, A하준, B서연, A도윤, A예린, B주호, B수아                                 |
| ① 이름으로 정렬    | A도윤, A민수, B서연, B수아, A예린, B주호, B지아, A하준                                 |
| ② 반으로 안정 정렬 | **A**도윤, **A**민수, **A**예린, **A**하준, **B**서연, **B**수아, **B**주호, **B**지아 |

②에서 A반 학생들(도윤, 민수, 예린, 하준)은 ①의 순서 그대로 앞으로 모였고, B반도 마찬가지입니다. 만약 ①과 ②의 순서를 바꾸면 마지막 정렬이 이름순이 되어 반 묶음이 흩어집니다.

## 9. 다른 예제로 다시 이해하기

지금까지 배운 세 정렬을 **같은 입력**으로 돌려 비교 횟수를 세어 봅시다. 입력은 원소 1,000개로 정렬된 것, 거꾸로 된 것, 섞인 것(7919를 곱한 나머지로 만든 순서) 세 가지입니다. 퀵 정렬은 마지막 원소를 피벗으로 쓰는 단순한 버전이라 정렬·역정렬 입력에서 약점이 드러납니다. 표를 보면 "모든 입력에서 가장 좋은 정렬은 없다"는 것과, 표준 라이브러리가 **여러 알고리즘을 섞는** 이유를 알 수 있습니다.

```python
# 파일: sort_race.py
import sys

sys.setrecursionlimit(5000)


def insertion(a):
    a, c = a[:], 0
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0:
            c += 1
            if a[j] <= key:
                break
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return c


def merge_count(a):
    if len(a) <= 1:
        return a, 0
    mid = len(a) // 2
    left, c1 = merge_count(a[:mid])
    right, c2 = merge_count(a[mid:])
    out, i, j, c = [], 0, 0, c1 + c2
    while i < len(left) and j < len(right):
        c += 1
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:], c


def quick_count(a, lo, hi):
    if lo >= hi:
        return 0
    pivot, i, c = a[hi], lo, hi - lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return c + quick_count(a, lo, i - 1) + quick_count(a, i + 1, hi)


n = 1000
inputs = {"정렬됨": list(range(n)), "거꾸로": list(range(n, 0, -1)),
          "섞임": [(i * 7919) % 10007 for i in range(n)]}
print(f"{'입력':<5} {'삽입':>8} {'병합':>8} {'퀵(끝 피벗)':>12}")
for name, data in inputs.items():
    q = data[:]
    print(f"{name:<5} {insertion(data):>8} {merge_count(data)[1]:>8} "
          f"{quick_count(q, 0, n - 1):>12}")
```

실행 결과:

```text
입력          삽입       병합      퀵(끝 피벗)
정렬됨        999     4932       499500
거꾸로     499500     5044       499500
섞임      251258     8792        10630
```

- **삽입 정렬**은 정렬된 입력에서 가장 빠르지만(999번) 거꾸로 된 입력에서는 50만 번입니다.
- **병합 정렬**은 어떤 입력에서도 약 5천~9천 번으로 **안정적**입니다.
- **퀵 정렬**은 섞인 입력에서 병합 정렬과 비슷하지만, 끝 원소 피벗이라 정렬·역정렬 입력에서 50만 번으로 무너집니다. 가운데 피벗이었다면 달라졌을 것입니다(Day 75).
- Python의 Timsort와 Rust의 `sort`는 이미 정렬된 구간을 찾아 병합하고 작은 구간은 삽입 정렬로 처리해서, **정렬된 입력에서는 삽입 정렬처럼, 무작위 입력에서는 병합 정렬처럼** 동작합니다.

## 10. 시간·공간 복잡도

| 작업                                 | 비용                          |
| ------------------------------------ | ----------------------------- |
| 표준 정렬(`qsort`, `sorted`, `sort`) | O(n log n) 비교               |
| 키 함수 정렬                         | 키 계산 n번 + O(n log n) 비교 |
| 안정 정렬 두 번                      | O(n log n) × 2                |
| 정렬 한 번 + 이진 탐색 k번           | O(n log n + k log n)          |
| 정렬 없이 선형 탐색 k번              | O(k n)                        |

k가 작으면(한두 번만 찾으면) 정렬하지 않고 선형 탐색하는 것이 낫고, k가 크면 한 번 정렬해 두고 이진 탐색하는 것이 낫습니다.

## 11. 세 언어 비교

| 관점      | C                                                      | Python                        | Rust                                      |
| --------- | ------------------------------------------------------ | ----------------------------- | ----------------------------------------- |
| 기준 표현 | 비교 함수 포인터 `int (*)(const void *, const void *)` | 키 함수 `key=`                | 비교 클로저(`Ordering`) 또는 키 클로저    |
| 여러 기준 | 비교 함수 안에서 if로 차례대로                         | 키 튜플, 또는 안정 정렬 두 번 | `then_with`로 잇기, 키 튜플               |
| 내림차순  | 비교 부호 뒤집기                                       | `reverse=True`, 숫자는 `-`    | 비교 순서 바꾸기, `Reverse`, `.reverse()` |
| 타입 안전 | `void *`라 잘못 바꾸면 컴파일은 되고 틀림              | 실행 중 비교 오류(TypeError)  | 컴파일 단계에서 타입 검사                 |
| 넘침      | `a - b` 비교는 넘칠 수 있음                            | 없음                          | `cmp`는 넘치지 않음                       |
| 안정 정렬 | 표준에 없음                                            | 항상 안정                     | `sort*`는 안정, `sort_unstable*`은 불안정 |

## 12. 자주 하는 실수

### 실수 1: C 비교 함수를 `return a - b;`로 쓴다

실습의 디버그 문제입니다. 작은 수에서는 잘 동작해서 실수를 알아채기 어렵지만, 부호가 다른 큰 수끼리 빼면 int 범위를 넘어 **정의되지 않은 동작**이 됩니다. `(a > b) - (a < b)`를 쓰세요.

### 실수 2: 비교 함수가 일관되지 않다

비교 함수는 "a < b이고 b < c면 a < c" 같은 규칙을 지켜야 합니다. 예를 들어 무작위 값을 돌려주거나, 두 값을 비교할 때마다 다른 결과를 내면 정렬 결과가 엉망이 되고, 어떤 구현은 무한 반복에 빠지거나 배열 밖을 읽을 수도 있습니다. Rust는 일관되지 않은 비교 함수를 감지하면 panic할 수 있다고 문서에 적혀 있습니다.

### 실수 3: 정렬 기준과 다른 기준으로 이진 탐색한다

```python
# 파일: wrong_search_key.py
import bisect

students = [("민수", 88), ("지아", 95), ("서연", 70)]
by_score = sorted(students, key=lambda s: s[1])          # 점수순
names = [s[0] for s in by_score]                          # ['서연', '민수', '지아']는 이름순이 아니다
i = bisect.bisect_left(names, "민수")
print(i, names[i] if i < len(names) else None)
```

실행 결과:

```text
0 서연
```

"민수"는 인덱스 1에 있는데 이진 탐색은 0을 가리켰습니다. 이름 목록이 이름순으로 정렬되어 있지 않기 때문입니다. **탐색하는 기준으로 정렬**하세요.

### 실수 4: 안정 정렬 두 번의 순서를 거꾸로 한다

주 기준으로 먼저 정렬하고 보조 기준으로 나중에 정렬하면, 결과는 보조 기준으로 정렬된 상태가 됩니다. **마지막에 정렬한 기준이 가장 중요한 기준**입니다.

### 실수 5: `list.sort()`의 반환값을 쓴다

```python
# 파일: sort_returns_none.py
scores = [3, 1, 2]
result = scores.sort()
print(result, scores, sorted([3, 1, 2]))
```

실행 결과:

```text
None [1, 2, 3] [1, 2, 3]
```

`list.sort()`는 **제자리에서 정렬하고 None을 돌려줍니다.** 새 리스트가 필요하면 `sorted()`를 쓰세요. Rust의 `sort`도 반환값이 `()`이고 제자리에서 정렬합니다.

## 13. Q&A

**Q. Python에서 비교 함수를 꼭 써야 할 때는 어떻게 하나요?**

A. 키로 표현하기 어려운 기준이라면 `functools.cmp_to_key`로 비교 함수를 키로 바꿀 수 있습니다. `sorted(items, key=cmp_to_key(my_compare))`처럼 씁니다. 예를 들어 "숫자들을 이어 붙여 가장 큰 수 만들기"처럼 두 원소를 함께 봐야 하는 기준에 씁니다.

**Q. 한글을 가나다순으로 정렬하면 항상 맞나요?**

A. 유니코드 순서로 비교하므로 완성형 한글(가~힣)은 가나다순과 같습니다. 하지만 대소문자가 섞인 영어("apple", "Banana")는 대문자가 먼저 오는 등 사람이 기대하는 순서와 다를 수 있습니다. 대소문자를 무시하려면 `key=str.lower`(Python), `sort_by_key(|s| s.to_lowercase())`(Rust)를 씁니다.

**Q. 정렬이 필요 없이 '상위 k개'만 필요하면요?**

A. 전체 정렬(O(n log n)) 대신 힙(`heapq.nlargest`, Day 66)이나 퀵 선택(`select_nth_unstable`, Day 75)을 쓰면 더 빠릅니다. 요구 사항에서 "정말 전체 순서가 필요한가?"를 먼저 물어보세요.

**Q. C에서 안정 정렬이 필요하면 어떻게 하나요?**

A. 원래 인덱스를 구조체에 저장해 두고, 비교 함수의 마지막 기준으로 인덱스를 비교하면 `qsort`로도 안정 정렬과 같은 결과를 얻습니다. 또는 Day 74의 병합 정렬을 직접 씁니다.

## 14. 핵심 요약

- 실제 프로그램에서는 **표준 정렬 함수**를 쓰고, 우리가 작성하는 것은 **비교 기준**입니다.
- 비교 함수는 a가 앞이면 **음수**, 같으면 **0**, 뒤면 **양수**(Rust는 `Less`, `Equal`, `Greater`)를 돌려줍니다. C에서 `a - b`는 넘칠 수 있습니다.
- 여러 기준은 **첫 기준이 같을 때만 다음 기준**을 봅니다. Python은 키 튜플, Rust는 `then_with`, C는 비교 함수 안의 if로 씁니다.
- **안정 정렬 두 번**(보조 기준 먼저, 주 기준 나중)으로도 여러 기준을 만들 수 있습니다. C의 `qsort`는 안정성을 보장하지 않습니다.
- 이진 탐색은 **같은 기준으로 정렬된** 배열에서만 올바릅니다.
- 모든 입력에서 가장 좋은 정렬은 없습니다. 표준 정렬은 여러 알고리즘을 섞어 대부분의 입력에서 빠르게 동작합니다.

## 15. 도전 문제

1. **(C)** 문자열 배열 `const char *words[]`를 `qsort`로 "길이 오름차순, 같으면 사전순"으로 정렬하세요. 비교 함수가 받는 것이 `const char **`라는 점에 주의하세요.
2. **(Python)** `functools.cmp_to_key`로 정수 목록을 이어 붙여 **가장 큰 수**를 만드세요. `[3, 30, 34, 5, 9]` → `"9534330"`. 두 수 a, b를 비교할 때 `str(a)+str(b)`와 `str(b)+str(a)`를 비교합니다.
3. **(Rust)** 학생 목록에서 반별 평균 점수를 구하고, 평균이 높은 반부터 출력하세요. `f64`는 `Ord`가 아니므로 `partial_cmp`나 `total_cmp`를 써야 합니다.
4. **(세 언어)** 같은 성적표를 이름으로 정렬한 뒤, 이름으로 이진 탐색하는 기능을 추가하세요. 없는 이름이면 "넣을 위치"를 출력합니다.
