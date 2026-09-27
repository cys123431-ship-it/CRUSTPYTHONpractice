---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-67-hash-map
courseId: crp-92
phaseId: phase-06
dayNumber: 67
date: "2026-12-06"
title: 해시 맵 — 키로 값을 한 번에 찾기
summary: 해시 함수로 키를 배열 인덱스로 바꾸고, 충돌을 체이닝(C, Python)과 선형 탐사(Rust)로 해결하는 해시 맵을 직접 구현합니다. 적재율과 재해싱, 삭제 표시(묘비)가 왜 필요한지 확인하고, Python dict와 Rust HashMap의 entry API로 단어 세기와 두 수의 합 문제를 풉니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-66-heap]
learningObjectives:
  - 해시 함수, 버킷, 충돌, 적재율의 뜻을 예를 들어 설명한다.
  - 같은 해시 함수(djb2)로 키가 들어갈 버킷을 손으로 계산한다.
  - C로 연결 리스트 체이닝 해시 맵을 만들고 용량이 차면 재해싱한다.
  - Rust로 선형 탐사 해시 맵을 만들고 삭제한 칸에 묘비를 남겨야 하는 이유를 설명한다.
  - Python dict와 Rust HashMap(entry API)으로 빈도 세기, 두 수의 합을 O(n)에 푼다.
concepts:
  [
    hash map,
    hash function,
    bucket,
    collision,
    chaining,
    open addressing,
    linear probing,
    load factor,
    rehash,
    tombstone,
    dict,
    HashMap,
  ]
runnerMode: python
playgroundSource: |
  # 파일: counter.py — 문장을 바꿔 단어 수를 세어 보세요.
  text = "the cat and the hat and the bat"
  counts = {}
  for word in text.split():
      counts[word] = counts.get(word, 0) + 1
  for word, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
      print(f"{word:<4} {n}")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day67-predict-py
    title: dict로 개수 세기 예측하기
    kind: predict
    objective: get의 기본값과 덮어쓰기 규칙을 추적한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      counts = {}
      for ch in "banana":
          counts[ch] = counts.get(ch, 0) + 1
      counts["b"] = 10
      print(counts["a"], counts["n"], counts["b"], len(counts))
    answer: "3 2 10 3"
    hint: "get(ch, 0)은 키가 없으면 0을 돌려줍니다. 이미 있는 키에 대입하면 새 항목이 생기지 않고 값이 바뀝니다."
    explanation: "banana에는 a가 3번, n이 2번, b가 1번 있습니다. counts['b'] = 10은 값을 덮어쓸 뿐이라 키 개수는 그대로 3입니다."
    commonMistakes:
      - "counts['b'] = 10이 새 항목을 추가한다고 생각해 len을 4로 적음"
      - "get의 기본값을 무시하고 KeyError가 난다고 생각함"
    language: python
    verification: run
  - id: ex-day67-predict-c
    title: 간단한 해시 함수로 버킷 계산하기
    kind: predict
    objective: 해시값을 용량으로 나눈 나머지가 버킷 번호라는 것을 확인하고 충돌을 발견한다.
    prompt: 세 단어의 버킷 번호를 공백으로 구분해 적으세요.
    starter: |-
      #include <stdio.h>

      unsigned sum_hash(const char *s) {
          unsigned h = 0;
          while (*s) h += (unsigned char)*s++;
          return h;
      }

      int main(void) {
          const char *words[] = {"ab", "ba", "c"};
          for (int i = 0; i < 3; i++) {
              printf("%u ", sum_hash(words[i]) % 5);
          }
          printf("\n");
          return 0;
      }
    answer: "0 0 4"
    hint: "'a'는 97, 'b'는 98, 'c'는 99입니다. 글자 코드를 모두 더한 뒤 5로 나눈 나머지를 구하세요."
    explanation: "ab와 ba는 모두 97 + 98 = 195이고 195 % 5 = 0이라 같은 버킷에 들어갑니다(충돌). c는 99 % 5 = 4입니다. 글자 순서를 무시하는 해시 함수는 충돌이 많아 좋지 않습니다. djb2는 h * 33으로 자리마다 가중치를 줘서 이 문제를 줄입니다."
    commonMistakes:
      - "ab와 ba가 다른 문자열이니 버킷도 다를 것이라고 생각함"
      - "% 5를 빼고 해시값 전체를 적음"
    language: c
    verification: run
  - id: ex-day67-fill
    title: Rust entry API로 글자 세기
    kind: fill
    objective: 키가 없으면 0을 넣고 그 값을 가변으로 빌려 1 늘리는 관용구를 쓴다.
    prompt: "빈칸에 counts의 entry API를 써서, ch가 처음이면 0으로 만들고 1을 더하는 코드를 채우세요."
    starter: |-
      use std::collections::HashMap;

      fn main() {
          let mut counts: HashMap<char, u32> = HashMap::new();
          for ch in "mississippi".chars() {
              _____ += 1;
          }
          let mut pairs: Vec<(char, u32)> = counts.into_iter().collect();
          pairs.sort();
          println!("{:?}", pairs);
      }
    answer: |-
      use std::collections::HashMap;

      fn main() {
          let mut counts: HashMap<char, u32> = HashMap::new();
          for ch in "mississippi".chars() {
              *counts.entry(ch).or_insert(0) += 1;
          }
          let mut pairs: Vec<(char, u32)> = counts.into_iter().collect();
          pairs.sort();
          println!("{:?}", pairs);
      }
    output: "[('i', 4), ('m', 1), ('p', 2), ('s', 4)]"
    hint: "entry(ch)는 그 키의 자리를, or_insert(0)은 값에 대한 &mut u32를 돌려줍니다. 참조를 통해 값을 바꾸려면 *를 붙여야 합니다."
    explanation: "entry API는 '찾고, 없으면 넣고, 값을 바꾸기'를 해시 계산 한 번으로 합니다. HashMap은 순서를 보장하지 않으므로 출력 전에 정렬했습니다."
    commonMistakes:
      - "*를 빼서 &mut u32에 += 할 수 없다는 컴파일 오류를 냄"
      - "counts[&ch] += 1처럼 인덱스로 접근해 없는 키에서 panic을 일으킴"
    language: rust
    verification: run
  - id: ex-day67-modify
    title: Python 체이닝 해시 맵에 in과 items 지원하기
    kind: modify
    objective: 특별 메서드로 직접 만든 해시 맵을 dict처럼 쓸 수 있게 한다.
    prompt: "HashMap에 __contains__(key)와, 모든 (키, 값)을 키 순서로 돌려주는 items()를 추가하세요."
    starter: |-
      class HashMap:
          def __init__(self, capacity=8):
              self._buckets = [[] for _ in range(capacity)]

          def _bucket(self, key):
              return self._buckets[hash(key) % len(self._buckets)]

          def put(self, key, value):
              bucket = self._bucket(key)
              for pair in bucket:
                  if pair[0] == key:
                      pair[1] = value
                      return
              bucket.append([key, value])

          def get(self, key, default=None):
              for k, v in self._bucket(key):
                  if k == key:
                      return v
              return default


      m = HashMap()
      for name, age in [("민수", 17), ("지아", 16), ("하준", 18)]:
          m.put(name, age)
      print(m.get("지아"))
    answer: |-
      class HashMap:
          def __init__(self, capacity=8):
              self._buckets = [[] for _ in range(capacity)]

          def _bucket(self, key):
              return self._buckets[hash(key) % len(self._buckets)]

          def put(self, key, value):
              bucket = self._bucket(key)
              for pair in bucket:
                  if pair[0] == key:
                      pair[1] = value
                      return
              bucket.append([key, value])

          def get(self, key, default=None):
              for k, v in self._bucket(key):
                  if k == key:
                      return v
              return default

          def __contains__(self, key):
              return any(k == key for k, _ in self._bucket(key))

          def items(self):
              return sorted((k, v) for bucket in self._buckets for k, v in bucket)


      m = HashMap()
      for name, age in [("민수", 17), ("지아", 16), ("하준", 18)]:
          m.put(name, age)
      print("지아" in m, "서연" in m, m.items())
    output: "True False [('민수', 17), ('지아', 16), ('하준', 18)]"
    hint: "in 검사는 그 키가 들어갈 버킷 하나만 보면 됩니다. items는 모든 버킷을 모아야 하며, 버킷 순서는 해시값에 따라 뒤섞여 있으니 정렬하세요."
    explanation: "__contains__ 덕분에 '지아' in m을 쓸 수 있습니다. 이 코드는 Python 내장 hash()를 쓰는데, 문자열 해시는 실행할 때마다 달라질 수 있어 버킷 배치가 매번 다릅니다. 그래서 items()를 정렬해야 항상 같은 결과가 나옵니다."
    commonMistakes:
      - "__contains__에서 모든 버킷을 훑어 O(1) 검사를 O(n)으로 만듦"
      - "items()를 정렬하지 않아 실행할 때마다 순서가 달라짐"
    language: python
    verification: run
  - id: ex-day67-debug
    title: C 키 비교 버그 고치기
    kind: debug
    objective: 문자열 내용 비교(strcmp)와 주소 비교(==)를 구별한다.
    prompt: '사용자가 입력한 것처럼 배열에 복사한 "blue"로 찾으면 ''없음''이 나옵니다. 키 비교를 고쳐 ''찾음 2''가 출력되게 하세요.'
    starter: |-
      #include <stdio.h>
      #include <string.h>

      typedef struct {
          const char *key;
          int value;
      } Pair;

      int main(void) {
          Pair table[] = {{"red", 3}, {"blue", 2}, {"green", 1}};
          char input[16];
          strcpy(input, "blue");

          for (int i = 0; i < 3; i++) {
              if (table[i].key == input) {
                  printf("찾음 %d\n", table[i].value);
                  return 0;
              }
          }
          printf("없음\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <string.h>

      typedef struct {
          const char *key;
          int value;
      } Pair;

      int main(void) {
          Pair table[] = {{"red", 3}, {"blue", 2}, {"green", 1}};
          char input[16];
          strcpy(input, "blue");

          for (int i = 0; i < 3; i++) {
              if (strcmp(table[i].key, input) == 0) {
                  printf("찾음 %d\n", table[i].value);
                  return 0;
              }
          }
          printf("없음\n");
          return 0;
      }
    output: "찾음 2"
    starterOutput: "없음"
    hint: 'C에서 == 는 두 포인터가 같은 주소인지 비교합니다. 문자열 리터럴 "blue"와 배열 input은 내용이 같아도 서로 다른 곳에 있습니다.'
    explanation: "strcmp는 글자를 하나씩 비교해 같으면 0을 돌려줍니다. Python의 ==와 Rust의 ==는 문자열 내용을 비교하지만, C의 ==는 주소를 비교합니다. 해시 맵에서 이 실수를 하면 같은 키를 넣었는데도 찾지 못하거나 중복 키가 생깁니다."
    commonMistakes:
      - "strcmp(...) == 1로 비교함(같으면 0을 돌려줌)"
      - "if (strcmp(a, b))로 써서 같을 때가 아니라 다를 때 참이 되게 함"
    language: c
    verification: run
  - id: ex-day67-independent
    title: Rust로 처음 한 번만 나온 글자 찾기
    kind: independent
    objective: 해시 맵으로 빈도를 센 뒤 원래 순서로 다시 훑는 두 단계 알고리즘을 만든다.
    prompt: '문자열에서 한 번만 나오는 첫 글자를 찾는 fn first_unique(s: &str) -> Option<char>를 만드세요. "swiss"는 Some(''w''), "aabb"는 None, "로켓로봇"은 Some(''켓'')이 출력되어야 합니다.'
    starter: |-
      use std::collections::HashMap;

      fn main() {
          let counts: HashMap<char, usize> = HashMap::new();
          println!("{}", counts.len());
      }
    answer: |-
      use std::collections::HashMap;

      fn first_unique(s: &str) -> Option<char> {
          let mut counts: HashMap<char, usize> = HashMap::new();
          for ch in s.chars() {
              *counts.entry(ch).or_insert(0) += 1;
          }
          s.chars().find(|ch| counts[ch] == 1)
      }

      fn main() {
          for s in ["swiss", "aabb", "로켓로봇"] {
              println!("{s} -> {:?}", first_unique(s));
          }
      }
    output: |-
      swiss -> Some('w')
      aabb -> None
      로켓로봇 -> Some('켓')
    hint: "첫 번째 반복으로 모든 글자의 개수를 세고, 두 번째 반복에서는 해시 맵이 아니라 원래 문자열을 순서대로 훑으며 개수가 1인 글자를 찾으세요."
    explanation: "해시 맵은 순서를 기억하지 않으므로 '첫 번째'를 알려면 원래 문자열을 다시 봐야 합니다. 두 반복 모두 O(n)이라 전체도 O(n)입니다. chars()는 바이트가 아니라 글자 단위라 한글도 올바르게 처리합니다."
    commonMistakes:
      - "counts를 순회해서 찾아 실행할 때마다 다른 글자가 나옴"
      - "bytes()로 순회해 한글 한 글자를 세 바이트로 나눠 셈"
    language: rust
    verification: run
quiz:
  - id: quiz-day67-01
    question: 해시 맵에서 '충돌(collision)'이란?
    choices:
      - 같은 키를 두 번 넣는 것
      - 서로 다른 두 키가 같은 버킷 번호를 받는 것
      - 해시 함수가 오류를 내는 것
      - 버킷 배열이 가득 찬 것
    answerIndex: 1
    explanation: 버킷 수는 유한하고 가능한 키는 무한하므로 충돌은 반드시 생깁니다. 해시 맵은 충돌을 없애는 것이 아니라 체이닝이나 탐사로 '처리'합니다.
  - id: quiz-day67-02
    question: 적재율(load factor)이 높아지면 어떻게 되나요?
    choices:
      - 충돌이 줄어 빨라진다
      - 한 버킷에 여러 키가 몰려 검색이 느려진다
      - 메모리 사용량이 줄어든다
      - 아무 변화가 없다
    answerIndex: 1
    explanation: 적재율은 '원소 수 ÷ 버킷 수'입니다. 높을수록 충돌이 잦아집니다. 그래서 일정 값(보통 0.75 안팎)을 넘으면 버킷 수를 늘리고 모든 키를 다시 배치(재해싱)합니다.
  - id: quiz-day67-03
    question: 선형 탐사 해시 맵에서 키를 지울 때 칸을 그냥 '비어 있음'으로 만들면 생기는 문제는?
    choices:
      - 메모리가 누수된다
      - 그 칸 뒤로 밀려 저장된 다른 키를 찾다가 빈칸에서 검색이 멈춰 버린다
      - 해시 함수가 바뀐다
      - 아무 문제가 없다
    answerIndex: 1
    explanation: 탐사 검색은 빈칸을 만나면 '없다'고 결론 내립니다. 지운 자리에 '삭제됨(묘비)' 표시를 남기면 검색은 계속 지나가고, 삽입은 그 자리를 다시 쓸 수 있습니다.
  - id: quiz-day67-04
    question: Python에서 dict의 키로 쓸 수 없는 것은?
    choices: ["문자열 'red'", "정수 42", "튜플 (1, 2)", "리스트 [1, 2]"]
    answerIndex: 3
    explanation: "키는 해시값이 변하지 않아야 합니다. 리스트는 내용을 바꿀 수 있어서(가변) 해시할 수 없고, 쓰려 하면 TypeError: unhashable type: 'list'가 납니다. 내용이 바뀌지 않는 튜플은 키가 될 수 있습니다."
  - id: quiz-day67-05
    question: 해시 맵의 검색 시간 복잡도로 알맞은 것은?
    choices:
      - 항상 O(1)
      - 평균 O(1), 모든 키가 한 버킷에 몰리는 최악의 경우 O(n)
      - 항상 O(log n)
      - 항상 O(n)
    answerIndex: 1
    explanation: 해시 함수가 키를 고르게 퍼뜨리고 적재율을 유지하면 평균 상수 시간입니다. 나쁜 해시 함수나 악의적인 입력으로 충돌이 몰리면 체인을 모두 훑어야 해서 느려집니다.
---

## 1. 오늘 배울 내용

지금까지 배운 자료구조에서 **값으로 무언가를 찾는** 비용을 떠올려 봅시다. 배열과 연결 리스트는 O(n), 균형 BST는 O(log n)이었습니다. 오늘 배우는 **해시 맵(hash map)** 은 평균 **O(1)**, 즉 원소가 몇 개든 거의 한 번에 찾습니다. Python의 `dict`, Rust의 `HashMap`, 자바스크립트의 객체, 데이터베이스의 인덱스가 모두 이 원리를 씁니다.

1. 해시 맵의 아이디어: **키를 배열 인덱스로 바꾸는** 해시 함수.
2. 피할 수 없는 **충돌**과 두 가지 해결 방법: **체이닝**, **선형 탐사**.
3. **적재율**이 높아지면 버킷을 늘리는 **재해싱**.
4. **C** 로 연결 리스트 체이닝 해시 맵을, **Python** 으로 리스트 체이닝 해시 맵을, **Rust** 로 선형 탐사 해시 맵을 직접 만듭니다. 세 언어 모두 같은 해시 함수(djb2)를 써서 결과를 비교할 수 있게 했습니다.
5. 표준 `dict`와 `HashMap`으로 **빈도 세기**와 **두 수의 합** 문제를 풉니다.

## 2. 왜 해시 맵이 필요한가

학생 이름으로 전화번호를 찾는 프로그램을 생각해 봅시다. 학생이 10만 명이라면

- 배열에서 이름을 처음부터 비교하면 평균 5만 번,
- 이름순 정렬된 배열에서 이진 탐색하면 약 17번,
- 해시 맵이라면 **약 1~2번** 비교합니다.

해시 맵의 아이디어는 간단합니다. 배열은 **인덱스를 알면** O(1)에 접근할 수 있습니다. 그렇다면 **이름을 인덱스로 바꾸는 함수**가 있으면 됩니다. "민수"를 넣으면 항상 3, "지아"를 넣으면 항상 7을 돌려주는 함수가 있다면, 민수의 전화번호는 `table[3]`에 저장하고 찾을 때도 `table[3]`을 보면 됩니다. 이 함수를 **해시 함수(hash function)** 라고 합니다.

해시 맵은 이런 곳에 씁니다.

- 단어별 등장 횟수 세기, 투표 집계
- 이미 방문했는지 확인하는 **방문 집합**(Day 69 BFS)
- 사용자 ID로 정보 찾기, 캐시
- "이 값을 전에 본 적 있나?"를 O(1)에 확인해 O(n²) 알고리즘을 O(n)으로 바꾸기(9절의 두 수의 합)

## 3. 그림으로 이해하기

버킷(칸)이 8개인 해시 맵에 색 이름을 넣어 봅시다. 버킷 번호는 `해시값 % 버킷 수`입니다.

```text
키       해시값(djb2)    % 8   → 버킷
"red"    193504576       0
"blue"   2090117005      5
"green"  260512342       6
"gray"   2090302584      0     ← "red"와 같은 버킷: 충돌!

버킷 배열
 [0] ──► red:3 ──► gray:1        (체이닝: 같은 버킷의 키를 연결 리스트로)
 [1]
 [2]
 [3]
 [4]
 [5] ──► blue:2
 [6] ──► green:1
 [7] ──► pink:1
```

키를 찾을 때는 ① 해시값을 계산하고, ② 버킷 번호를 구해, ③ 그 버킷 **안에서만** 키를 비교합니다. 다른 버킷은 보지 않습니다. 버킷마다 키가 한두 개뿐이라면 비교는 한두 번이면 끝납니다.

## 4. 천천히 풀어보기

### 4.1 좋은 해시 함수

해시 함수는 다음 성질을 가져야 합니다.

1. **결정적**: 같은 키는 **언제나 같은** 해시값을 준다. 그렇지 않으면 넣은 곳과 찾는 곳이 달라집니다.
2. **고르게 퍼뜨림**: 서로 다른 키들이 버킷에 고르게 흩어진다. 한 버킷에 몰리면 연결 리스트처럼 느려집니다.
3. **빠름**: 계산이 오래 걸리면 O(1)의 의미가 없습니다.

이 수업에서는 간단하면서 널리 알려진 **djb2** 해시 함수를 씁니다.

```text
h = 5381
각 바이트 b에 대해:  h = h × 33 + b      (32비트를 넘는 부분은 버림)
```

× 33을 하기 때문에 글자의 **순서**가 결과에 반영됩니다. 글자 코드를 그냥 더하는 함수라면 "ab"와 "ba"의 해시값이 같아지지만(실습의 예측 문제), djb2는 다릅니다.

> **참고**: Python의 내장 `hash()`와 Rust `HashMap`의 기본 해시 함수는 보안을 위해 **실행할 때마다 달라지는 비밀 값(seed)** 을 섞습니다. 공격자가 일부러 충돌하는 키만 보내서 서버를 느리게 만드는 공격(해시 플러딩)을 막기 위해서입니다. 그래서 이 수업의 직접 구현은 결과를 비교할 수 있도록 고정된 djb2를 씁니다.

### 4.2 충돌은 반드시 생긴다

버킷은 8개인데 가능한 문자열은 무한하므로, 서로 다른 키가 같은 버킷을 받는 **충돌**은 피할 수 없습니다(비둘기집 원리). 해결 방법은 크게 두 가지입니다.

**① 체이닝(chaining)**: 각 버킷이 **목록**(연결 리스트나 동적 배열)을 가지고, 같은 버킷의 키를 모두 그 목록에 넣습니다. 3절의 그림이 체이닝입니다. 구현이 쉽고, 삭제도 목록에서 빼기만 하면 됩니다. C와 Python 구현이 이 방법입니다.

**② 개방 주소법(open addressing)**: 버킷 하나에 키 하나만 넣습니다. 자리가 차 있으면 **다른 빈자리를 찾아** 넣습니다. 가장 간단한 규칙은 바로 다음 칸을 보는 **선형 탐사(linear probing)** 입니다. 모든 데이터가 배열 하나에 모여 있어 캐시에 유리합니다. Rust 구현이 이 방법입니다.

```text
선형 탐사, 칸 8개. "gray"의 원래 자리(home)는 0인데 "red"가 차지하고 있다
 [0] red:3      ← home 0, 차 있음
 [1] gray:1     ← 다음 칸이 비어 있어 여기에 넣음
 [2] .
```

### 4.3 선형 탐사의 삭제: 묘비가 필요하다

선형 탐사에서 "gray"를 찾을 때는 home인 0번부터 보기 시작해서, 키가 맞을 때까지 한 칸씩 이동하다가 **빈칸을 만나면 "없다"고 결론** 냅니다. 그런데 "red"를 지우면서 0번 칸을 그냥 비워 버리면 어떻게 될까요?

```text
 [0] .          ← red를 지우고 빈칸으로
 [1] gray:1
gray를 찾기: home 0부터 → 빈칸! → "없다"   ✗ 틀렸다
```

gray는 그대로 있는데 찾지 못합니다. 그래서 지운 칸에는 **"여기 뭔가 있었다"는 표시**를 남깁니다. 이를 **묘비(tombstone)** 라고 합니다. 검색은 묘비를 만나면 멈추지 않고 계속 지나가고, 삽입은 묘비 자리를 다시 쓸 수 있습니다. Rust 구현의 `Slot::Deleted`가 묘비입니다.

### 4.4 적재율과 재해싱

**적재율(load factor)** = 저장된 키 수 ÷ 버킷 수. 적재율이 높을수록 충돌이 잦아지고 느려집니다. 그래서 적재율이 어떤 값(이 수업에서는 **0.75**)을 넘으려 하면

1. 버킷 수를 **두 배**로 늘린 새 배열을 만들고,
2. 모든 키의 버킷 번호를 **새 버킷 수로 다시 계산**해 옮깁니다(**재해싱**, rehash).

버킷 번호가 `해시값 % 버킷 수`이므로 버킷 수가 바뀌면 번호도 바뀝니다. 기존 배열을 그대로 복사하면 안 되고 모든 키를 다시 넣어야 합니다. 재해싱은 O(n)이지만 두 배씩 늘리므로 Day 57의 동적 배열처럼 **상각 O(1)** 입니다.

## 5. C로 구현하기

C 구현은 **연결 리스트 체이닝** 방식입니다. 버킷 배열의 각 칸은 연결 리스트의 head 포인터이고, 키는 문자열, 값은 정수입니다. 단어가 몇 번 나왔는지 세는 데 써 봅니다.

```c
// 파일: hash_table.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct Entry {
    char *key;
    int value;
    struct Entry *next;         // 같은 버킷의 다음 항목 (체이닝)
} Entry;

typedef struct {
    Entry **buckets;            // 버킷 배열: 각 칸은 연결 리스트의 head
    size_t capacity;
    size_t count;
} HashMap;

unsigned long hash(const char *s) {       // djb2
    unsigned long h = 5381;
    for (; *s != '\0'; s++) {
        h = (h * 33 + (unsigned char)*s) & 0xFFFFFFFFUL;
    }
    return h;
}

char *copy_string(const char *s) {
    size_t n = strlen(s) + 1;
    char *copy = malloc(n);
    if (copy == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    memcpy(copy, s, n);
    return copy;
}

void map_init(HashMap *m, size_t capacity) {
    m->buckets = calloc(capacity, sizeof *m->buckets);  // 모두 NULL로
    if (m->buckets == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    m->capacity = capacity;
    m->count = 0;
}

Entry *find_entry(const HashMap *m, const char *key) {
    size_t i = hash(key) % m->capacity;
    for (Entry *e = m->buckets[i]; e != NULL; e = e->next) {
        if (strcmp(e->key, key) == 0) {
            return e;
        }
    }
    return NULL;
}

void resize(HashMap *m, size_t new_capacity) {
    Entry **old = m->buckets;
    size_t old_capacity = m->capacity;
    map_init(m, new_capacity);
    for (size_t i = 0; i < old_capacity; i++) {
        Entry *e = old[i];
        while (e != NULL) {
            Entry *next = e->next;
            size_t j = hash(e->key) % new_capacity;   // 새 용량으로 다시 계산
            e->next = m->buckets[j];
            m->buckets[j] = e;                        // 노드를 옮겨 달기
            m->count++;
            e = next;
        }
    }
    free(old);
    printf("  (resize: %zu -> %zu 버킷)\n", old_capacity, new_capacity);
}

void put(HashMap *m, const char *key, int value) {
    Entry *e = find_entry(m, key);
    if (e != NULL) {
        e->value = value;                             // 이미 있으면 값만 갱신
        return;
    }
    if ((m->count + 1) * 4 > m->capacity * 3) {       // 적재율 0.75 초과 예정
        resize(m, m->capacity * 2);
    }
    size_t i = hash(key) % m->capacity;
    e = malloc(sizeof *e);
    if (e == NULL) {
        fprintf(stderr, "메모리 부족\n");
        exit(1);
    }
    e->key = copy_string(key);
    e->value = value;
    e->next = m->buckets[i];                          // 버킷 맨 앞에 삽입
    m->buckets[i] = e;
    m->count++;
}

bool get(const HashMap *m, const char *key, int *out) {
    Entry *e = find_entry(m, key);
    if (e == NULL) {
        return false;
    }
    *out = e->value;
    return true;
}

bool remove_key(HashMap *m, const char *key) {
    size_t i = hash(key) % m->capacity;
    Entry **link = &m->buckets[i];                    // "나를 가리키는 칸"
    while (*link != NULL) {
        Entry *e = *link;
        if (strcmp(e->key, key) == 0) {
            *link = e->next;                          // 건너뛰게 연결
            free(e->key);
            free(e);
            m->count--;
            return true;
        }
        link = &e->next;
    }
    return false;
}

void dump(const HashMap *m) {
    for (size_t i = 0; i < m->capacity; i++) {
        printf("  [%zu]", i);
        for (Entry *e = m->buckets[i]; e != NULL; e = e->next) {
            printf(" -> %s:%d", e->key, e->value);
        }
        printf("\n");
    }
}

void map_free(HashMap *m) {
    for (size_t i = 0; i < m->capacity; i++) {
        Entry *e = m->buckets[i];
        while (e != NULL) {
            Entry *next = e->next;
            free(e->key);
            free(e);
            e = next;
        }
    }
    free(m->buckets);
}

int main(void) {
    const char *samples[] = {"red", "blue", "green", "gray"};
    for (int k = 0; k < 4; k++) {
        unsigned long h = hash(samples[k]);
        printf("hash(%-6s) = %10lu  %% 4 = %lu  %% 8 = %lu\n",
               samples[k], h, h % 4, h % 8);
    }

    const char *words[] = {"red", "blue", "red", "green", "blue", "red", "pink", "gray"};
    int n = sizeof words / sizeof words[0];
    HashMap m;
    map_init(&m, 4);
    for (int k = 0; k < n; k++) {
        int c = 0;
        get(&m, words[k], &c);          // 없으면 c는 0 그대로
        put(&m, words[k], c + 1);       // 단어 수 세기
    }
    printf("count=%zu, capacity=%zu\n", m.count, m.capacity);
    dump(&m);

    int v;
    if (get(&m, "red", &v)) {
        printf("get(red) -> %d\n", v);
    }
    if (!get(&m, "black", &v)) {
        printf("get(black) -> 없음\n");
    }
    bool removed_blue = remove_key(&m, "blue");
    bool removed_black = remove_key(&m, "black");
    printf("remove(blue) %s, remove(black) %s, count=%zu\n",
           removed_blue ? "성공" : "없음", removed_black ? "성공" : "없음", m.count);
    dump(&m);
    map_free(&m);
    return 0;
}
```

실행 결과:

```text
hash(red   ) =  193504576  % 4 = 0  % 8 = 0
hash(blue  ) = 2090117005  % 4 = 1  % 8 = 5
hash(green ) =  260512342  % 4 = 2  % 8 = 6
hash(gray  ) = 2090302584  % 4 = 0  % 8 = 0
  (resize: 4 -> 8 버킷)
count=5, capacity=8
  [0] -> gray:1 -> red:3
  [1]
  [2]
  [3]
  [4]
  [5] -> blue:2
  [6] -> green:1
  [7] -> pink:1
get(red) -> 3
get(black) -> 없음
remove(blue) 성공, remove(black) 없음, count=4
  [0] -> gray:1 -> red:3
  [1]
  [2]
  [3]
  [4]
  [5]
  [6] -> green:1
  [7] -> pink:1
```

### 코드 한 부분씩 읽기

| 코드                                               | 설명                                                                                                                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Entry **buckets;`                                 | "Entry 포인터의 배열"을 가리키는 포인터입니다. `buckets[i]`는 i번 버킷 연결 리스트의 head입니다. 버킷 수를 실행 중에 바꿔야 하므로 고정 배열 대신 `malloc`으로 잡습니다.                                                                          |
| `h = (h * 33 + (unsigned char)*s) & 0xFFFFFFFFUL;` | djb2입니다. `unsigned long`은 Windows에서 32비트, 리눅스에서 64비트라서, 어디서든 같은 결과가 나오도록 `& 0xFFFFFFFF`로 **32비트만 남겼습니다.** `unsigned char`로 바꾸는 것은 한글처럼 128 이상인 바이트가 음수로 읽히지 않게 하기 위해서입니다. |
| `char *copy_string(const char *s)`                 | 키 문자열을 **복사해서** 가집니다. 호출한 쪽의 문자열(예: 입력 버퍼)이 나중에 바뀌어도 해시 맵의 키는 안전합니다. 표준 C에는 `strdup`이 없어서(POSIX 함수) 직접 만들었습니다.                                                                     |
| `calloc(capacity, sizeof *m->buckets)`             | `calloc`은 할당한 메모리를 **0으로 채웁니다.** 모든 버킷이 NULL(빈 연결 리스트)로 시작합니다.                                                                                                                                                     |
| `strcmp(e->key, key) == 0`                         | 문자열 **내용**을 비교합니다. `e->key == key`는 주소 비교라서 내용이 같아도 거짓일 수 있습니다(실습의 디버그 문제).                                                                                                                               |
| `if ((m->count + 1) * 4 > m->capacity * 3)`        | "넣은 뒤 적재율이 0.75를 넘는가?"를 실수 없이 정수로 계산했습니다. `(count + 1) / capacity > 0.75`와 같은 뜻입니다. 네 번째 키(pink)를 넣기 전에 4 × 4 = 16 > 12가 되어 버킷이 8개로 늘었습니다.                                                  |
| `size_t j = hash(e->key) % new_capacity;`          | 재해싱의 핵심입니다. **새 버킷 수로 다시 계산**합니다. 노드를 새로 만들지 않고 연결만 옮겨 달아서 `malloc`과 `free`를 줄였습니다.                                                                                                                 |
| `e->next = m->buckets[i]; m->buckets[i] = e;`      | 새 항목을 버킷 연결 리스트의 **맨 앞**에 넣습니다(O(1)). 그래서 [0] 버킷에서 나중에 들어온 gray가 red보다 앞에 있습니다.                                                                                                                          |
| `Entry **link = &m->buckets[i];`                   | Day 61의 Q&A에서 본 **"나를 가리키는 칸"** 기법입니다. link가 버킷 head를 가리키든 어떤 노드의 next를 가리키든 `*link = e->next;` 한 줄로 삭제하므로, 첫 노드를 지울 때도 따로 처리하지 않습니다.                                                 |
| `bool removed_blue = remove_key(&m, "blue");`      | `printf` 인자 안에서 바로 `remove_key`를 부르고 `m.count`도 함께 넘기면, C는 인자를 **어떤 순서로 계산할지 정하지 않았으므로** 삭제 전 개수가 출력될 수 있습니다. 부작용이 있는 호출은 따로 떼어 쓰세요.                                          |

> **오류 주의**: `map_free`에서 키 문자열(`e->key`)과 노드(`e`)를 **둘 다** 해제해야 합니다. 키를 복사할 때 `malloc`을 한 번 더 했기 때문입니다. 할당한 횟수만큼 해제했는지 세어 보는 습관을 들이세요.

## 6. Python으로 구현하기

Python 구현도 체이닝이지만, 연결 리스트 대신 **리스트의 리스트**를 버킷으로 씁니다. 각 버킷은 `[키, 값]` 쌍의 목록입니다. 같은 djb2를 썼으므로 버킷 번호가 C와 같습니다.

```python
# 파일: hash_map.py
def djb2(key):
    h = 5381
    for byte in key.encode("utf-8"):
        h = (h * 33 + byte) & 0xFFFFFFFF
    return h


class HashMap:
    """체이닝(chaining) 방식 해시 맵"""

    def __init__(self, capacity=4):
        self._buckets = [[] for _ in range(capacity)]   # 버킷마다 [키, 값] 목록
        self._count = 0

    def _bucket(self, key):
        return self._buckets[djb2(key) % len(self._buckets)]

    def put(self, key, value):
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value                   # 이미 있으면 갱신
                return
        if (self._count + 1) * 4 > len(self._buckets) * 3:
            self._resize(len(self._buckets) * 2)
            bucket = self._bucket(key)            # 용량이 바뀌었으니 다시 계산
        bucket.append([key, value])
        self._count += 1

    def get(self, key, default=None):
        for k, v in self._bucket(key):
            if k == key:
                return v
        return default

    def remove(self, key):
        bucket = self._bucket(key)
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self._count -= 1
                return True
        return False

    def _resize(self, new_capacity):
        old = self._buckets
        self._buckets = [[] for _ in range(new_capacity)]
        for bucket in old:
            for k, v in bucket:
                self._bucket(k).append([k, v])
        print(f"  (resize: {len(old)} -> {new_capacity} 버킷)")

    def __len__(self):
        return self._count

    def dump(self):
        for i, bucket in enumerate(self._buckets):
            chain = "".join(f" -> {k}:{v}" for k, v in bucket)
            print(f"  [{i}]{chain}")


for w in ["red", "blue", "green", "gray"]:
    h = djb2(w)
    print(f"djb2({w:<6}) = {h:>10}  % 4 = {h % 4}  % 8 = {h % 8}")

m = HashMap()
for w in ["red", "blue", "red", "green", "blue", "red", "pink", "gray"]:
    m.put(w, m.get(w, 0) + 1)
print(f"count={len(m)}")
m.dump()
print("get(red) ->", m.get("red"), "/ get(black) ->", m.get("black"))
print("remove(blue)", m.remove("blue"), "/ remove(black)", m.remove("black"), "/ count", len(m))

# 표준 dict: 같은 일을 한 줄로
counts = {}
for w in ["red", "blue", "red", "green", "blue", "red", "pink", "gray"]:
    counts[w] = counts.get(w, 0) + 1
print("dict:", counts)
print("hash('red') 같은 실행 안에서는 항상 같다:", hash("red") == hash("red"))
```

실행 결과:

```text
djb2(red   ) =  193504576  % 4 = 0  % 8 = 0
djb2(blue  ) = 2090117005  % 4 = 1  % 8 = 5
djb2(green ) =  260512342  % 4 = 2  % 8 = 6
djb2(gray  ) = 2090302584  % 4 = 0  % 8 = 0
  (resize: 4 -> 8 버킷)
count=5
  [0] -> red:3 -> gray:1
  [1]
  [2]
  [3]
  [4]
  [5] -> blue:2
  [6] -> green:1
  [7] -> pink:1
get(red) -> 3 / get(black) -> None
remove(blue) True / remove(black) False / count 4
dict: {'red': 3, 'blue': 2, 'green': 1, 'pink': 1, 'gray': 1}
hash('red') 같은 실행 안에서는 항상 같다: True
```

### 코드 한 부분씩 읽기

| 코드                                          | 설명                                                                                                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key.encode("utf-8")`                         | 문자열을 바이트로 바꿉니다. C와 Rust도 바이트 단위로 해시하므로 한글 키도 세 언어에서 같은 해시값이 나옵니다.                                                               |
| `& 0xFFFFFFFF`                                | Python 정수는 크기 제한이 없어서 저절로 32비트에서 잘리지 않습니다. C·Rust와 같은 값을 얻으려고 직접 잘랐습니다.                                                            |
| `[[] for _ in range(capacity)]`               | 버킷마다 **서로 다른** 빈 리스트를 만듭니다. `[[]] * capacity`로 쓰면 모든 칸이 **같은 리스트 하나**를 가리켜 모든 키가 한 버킷에 들어간 것처럼 됩니다(Day 31의 별칭 함정). |
| `pair[1] = value`                             | 쌍을 튜플이 아니라 **리스트**로 만든 이유입니다. 리스트는 바꿀 수 있어서 이미 있는 키의 값을 제자리에서 갱신할 수 있습니다.                                                 |
| `bucket = self._bucket(key)` (재해싱 뒤 다시) | 버킷 수가 바뀌면 같은 키의 버킷 번호도 바뀝니다. 재해싱 전에 구해 둔 버킷에 넣으면 **옛 배열**에 들어가 사라집니다.                                                         |
| `for i, (k, _) in enumerate(bucket):`         | 인덱스와 쌍을 함께 받고 쌍을 바로 풀었습니다. `_`는 쓰지 않는 값이라는 표시입니다.                                                                                          |
| `counts.get(w, 0) + 1`                        | 표준 `dict`의 관용구입니다. 키가 없으면 기본값 0을 돌려줍니다. `dict`는 넣은 순서를 기억하므로(Python 3.7부터) 출력 순서가 처음 나온 순서와 같습니다.                       |

버킷 [0]의 순서가 C(`gray -> red`)와 반대(`red -> gray`)인 이유는, C는 새 항목을 연결 리스트 **맨 앞**에, Python은 리스트 **맨 뒤**에 넣기 때문입니다. 순서는 달라도 찾는 결과는 같습니다.

## 7. Rust로 구현하기

Rust 구현은 **선형 탐사** 방식입니다. 칸마다 상태가 셋(비어 있음, 삭제됨, 키가 있음)이라서 **enum** 으로 표현하기 좋습니다. 삭제 후 검색이 여전히 동작하는지 직접 확인합니다.

```rust
// 파일: probe_map.rs
use std::collections::HashMap;

fn djb2(key: &str) -> u32 {
    let mut h: u32 = 5381;
    for b in key.bytes() {
        h = h.wrapping_mul(33).wrapping_add(b as u32);
    }
    h
}

#[derive(Clone, Debug)]
enum Slot {
    Empty,
    Deleted,                    // 지워진 자리(묘비). 탐색을 멈추지 않게 한다
    Full(String, i32),
}

struct ProbeMap {
    slots: Vec<Slot>,
    count: usize,
}

impl ProbeMap {
    fn new(capacity: usize) -> Self {
        ProbeMap { slots: vec![Slot::Empty; capacity], count: 0 }
    }

    // key가 있는 칸, 또는 넣을 수 있는 칸의 인덱스를 찾는다
    fn find_slot(&self, key: &str) -> (usize, bool) {
        let cap = self.slots.len();
        let mut i = djb2(key) as usize % cap;
        let mut first_deleted: Option<usize> = None;
        for _ in 0..cap {
            match &self.slots[i] {
                Slot::Empty => return (first_deleted.unwrap_or(i), false),
                Slot::Deleted => {
                    first_deleted.get_or_insert(i);
                }
                Slot::Full(k, _) if k == key => return (i, true),
                Slot::Full(_, _) => {}
            }
            i = (i + 1) % cap;          // 선형 탐사: 다음 칸으로
        }
        (first_deleted.expect("빈칸이 하나는 있어야 한다"), false)
    }

    fn put(&mut self, key: &str, value: i32) {
        if (self.count + 1) * 4 > self.slots.len() * 3 {
            self.resize(self.slots.len() * 2);
        }
        let (i, found) = self.find_slot(key);
        if !found {
            self.count += 1;
        }
        self.slots[i] = Slot::Full(key.to_string(), value);
    }

    fn get(&self, key: &str) -> Option<i32> {
        match self.find_slot(key) {
            (i, true) => match &self.slots[i] {
                Slot::Full(_, v) => Some(*v),
                _ => None,
            },
            _ => None,
        }
    }

    fn remove(&mut self, key: &str) -> bool {
        let (i, found) = self.find_slot(key);
        if found {
            self.slots[i] = Slot::Deleted;
            self.count -= 1;
        }
        found
    }

    fn resize(&mut self, new_capacity: usize) {
        let old = std::mem::replace(&mut self.slots, vec![Slot::Empty; new_capacity]);
        self.count = 0;
        for slot in old {
            if let Slot::Full(k, v) = slot {
                self.put(&k, v);        // 묘비는 버리고 다시 넣는다
            }
        }
        println!("  (resize -> {} 칸)", new_capacity);
    }

    fn dump(&self) {
        for (i, slot) in self.slots.iter().enumerate() {
            let text = match slot {
                Slot::Empty => String::from("."),
                Slot::Deleted => String::from("(삭제됨)"),
                Slot::Full(k, v) => format!("{k}:{v} (home {})", djb2(k) as usize % self.slots.len()),
            };
            println!("  [{i}] {text}");
        }
    }
}

fn main() {
    let words = ["red", "blue", "red", "green", "blue", "red", "pink", "gray"];
    let mut m = ProbeMap::new(4);
    for w in words {
        let c = m.get(w).unwrap_or(0);
        m.put(w, c + 1);
    }
    println!("count={}", m.count);
    m.dump();
    println!("get(red) -> {:?}, get(black) -> {:?}", m.get("red"), m.get("black"));
    println!("remove(red) {}", m.remove("red"));
    println!("get(gray) after removing red -> {:?}", m.get("gray"));
    m.dump();

    // 표준 HashMap과 entry API
    let mut counts: HashMap<&str, i32> = HashMap::new();
    for w in words {
        *counts.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(&str, i32)> = counts.into_iter().collect();
    pairs.sort();
    println!("HashMap(정렬해서 출력): {:?}", pairs);
}
```

실행 결과:

```text
  (resize -> 8 칸)
count=5
  [0] red:3 (home 0)
  [1] gray:1 (home 0)
  [2] .
  [3] .
  [4] .
  [5] blue:2 (home 5)
  [6] green:1 (home 6)
  [7] pink:1 (home 7)
get(red) -> Some(3), get(black) -> None
remove(red) true
get(gray) after removing red -> Some(1)
  [0] (삭제됨)
  [1] gray:1 (home 0)
  [2] .
  [3] .
  [4] .
  [5] blue:2 (home 5)
  [6] green:1 (home 6)
  [7] pink:1 (home 7)
HashMap(정렬해서 출력): [("blue", 2), ("gray", 1), ("green", 1), ("pink", 1), ("red", 3)]
```

### 코드 한 부분씩 읽기

| 코드                                              | 설명                                                                                                                                                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `h.wrapping_mul(33).wrapping_add(b as u32)`       | Rust는 디버그 빌드에서 정수가 넘치면 panic합니다. 해시 계산처럼 **일부러 넘치게 하는** 곳에서는 `wrapping_*` 메서드로 "넘치면 돌아간다"는 뜻을 밝힙니다. u32이므로 C·Python과 같은 32비트 결과가 나옵니다. |
| `enum Slot { Empty, Deleted, Full(String, i32) }` | 칸의 세 상태입니다. `Deleted`가 묘비입니다. C로 만들었다면 상태 필드와 키, 값을 따로 두어야 했을 것입니다.                                                                                                 |
| `vec![Slot::Empty; capacity]`                     | 같은 값을 capacity개 복제해 Vec을 만듭니다. 복제하려면 `Slot`이 `Clone`이어야 해서 `#[derive(Clone)]`을 붙였습니다.                                                                                        |
| `fn find_slot(&self, key: &str) -> (usize, bool)` | 키가 있으면 (그 칸, true), 없으면 (넣을 칸, false)를 돌려줍니다. get, put, remove가 모두 이 함수 하나를 씁니다.                                                                                            |
| `first_deleted.get_or_insert(i);`                 | 처음 만난 묘비 자리를 기억합니다. 키가 없다고 판명되면 **빈칸보다 앞에 있는 묘비 자리**에 넣어 공간을 재사용합니다.                                                                                        |
| `Slot::Empty => return (...)`                     | 빈칸을 만나면 검색을 끝냅니다. **묘비에서는 멈추지 않는** 것이 4.3절의 핵심입니다. 출력의 `get(gray) after removing red -> Some(1)`이 그 증거입니다.                                                       |
| `i = (i + 1) % cap;`                              | 배열 끝에서 처음으로 돌아가는 원형 탐사입니다(Day 60의 원형 인덱스).                                                                                                                                       |
| `std::mem::replace(&mut self.slots, vec![...])`   | 기존 칸 배열을 새 배열로 **바꿔 끼우면서** 옛 배열의 소유권을 돌려받습니다. 옛 배열의 키들을 새 배열에 다시 넣고, 묘비는 버립니다. 재해싱은 묘비를 청소하는 기회이기도 합니다.                             |
| `*counts.entry(w).or_insert(0) += 1;`             | 표준 `HashMap`의 **entry API**입니다. 키의 자리를 한 번만 찾아서, 없으면 0을 넣고, 값에 대한 가변 참조를 돌려줍니다. `*`로 그 참조가 가리키는 값을 1 늘립니다.                                             |
| `pairs.sort();`                                   | 표준 `HashMap`은 순서를 보장하지 않고, 실행할 때마다 순서가 달라질 수 있습니다. 항상 같은 결과를 보이려고 정렬했습니다.                                                                                    |

## 8. 실행 추적

Rust 선형 탐사 맵의 재해싱 이후 과정을 따라갑니다. 칸은 8개이고, home은 `djb2(키) % 8`입니다.

| 연산        | home | 탐사한 칸                     | 결과                       |
| ----------- | ---: | ----------------------------- | -------------------------- |
| put(red)    |    0 | 0(빈칸)                       | 0번에 red                  |
| put(gray)   |    0 | 0(red) → 1(빈칸)              | 1번에 gray (한 칸 밀려남)  |
| get(red)    |    0 | 0(red, 일치)                  | Some(3)                    |
| get(black)  |    ? | home부터 빈칸까지             | 빈칸을 만나 None           |
| remove(red) |    0 | 0(red, 일치)                  | 0번을 **묘비**로           |
| get(gray)   |    0 | 0(묘비, 계속) → 1(gray, 일치) | Some(1) — 묘비 덕분에 찾음 |

만약 remove(red)가 0번을 **빈칸**으로 만들었다면, 마지막 줄은 `0(빈칸) → None`이 되어 gray를 잃어버렸을 것입니다.

## 9. 다른 예제로 다시 이해하기

해시 맵의 진짜 힘은 **"전에 본 적 있나?"를 O(1)에 확인**할 수 있다는 점입니다. 유명한 **두 수의 합** 문제를 봅시다. 정수 배열에서 합이 target인 두 원소의 인덱스를 찾습니다. 가장 단순한 방법은 모든 쌍을 확인하는 이중 반복으로 O(n²)입니다. 해시 맵을 쓰면 한 번만 훑으면 됩니다. 각 원소 x를 볼 때 **짝이 되는 값 target - x를 전에 본 적이 있는지** 해시 맵에 물어보고, 없으면 "x를 인덱스 i에서 봤다"고 기록합니다. 배열이 10만 개라면 이중 반복은 약 50억 번, 해시 맵 방법은 10만 번 정도 확인합니다.

```python
# 파일: two_sum.py
def two_sum_slow(nums, target):
    checks = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            checks += 1
            if nums[i] + nums[j] == target:
                return (i, j), checks
    return None, checks


def two_sum_fast(nums, target):
    seen = {}                                # 값 -> 인덱스
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:                     # O(1) 확인
            return (seen[need], i), i + 1
        seen[x] = i
    return None, len(nums)


nums = [8, 3, 11, 7, 2, 15, 5, 9]
for target in [14, 24, 100]:
    slow, c1 = two_sum_slow(nums, target)
    fast, c2 = two_sum_fast(nums, target)
    print(f"target {target:>3}: 이중 반복 {slow} ({c1}번 확인) / 해시 맵 {fast} ({c2}번 확인)")
```

실행 결과:

```text
target  14: 이중 반복 (1, 2) (8번 확인) / 해시 맵 (1, 2) (3번 확인)
target  24: 이중 반복 (5, 7) (27번 확인) / 해시 맵 (5, 7) (8번 확인)
target 100: 이중 반복 None (28번 확인) / 해시 맵 None (8번 확인)
```

같은 알고리즘을 Rust로 옮기면 다음과 같습니다. `HashMap::get`은 `Option`을 돌려주므로 `if let`으로 "본 적이 있을 때"만 처리합니다.

```rust
// 파일: two_sum.rs
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut seen: HashMap<i32, usize> = HashMap::new();
    for (i, &x) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - x)) {
            return Some((j, i));
        }
        seen.insert(x, i);
    }
    None
}

fn main() {
    let nums = [8, 3, 11, 7, 2, 15, 5, 9];
    for target in [14, 24, 100] {
        println!("target {target:>3}: {:?}", two_sum(&nums, target));
    }
}
```

실행 결과:

```text
target  14: Some((1, 2))
target  24: Some((5, 7))
target 100: None
```

## 10. 시간·공간 복잡도

| 연산         | 평균           | 최악(모든 키가 한 버킷) | 비고                                |
| ------------ | -------------- | ----------------------- | ----------------------------------- |
| 검색         | O(1)           | O(n)                    | 해시 계산 + 버킷 안 비교            |
| 삽입         | 상각 O(1)      | O(n)                    | 가끔 재해싱 O(n)                    |
| 삭제         | O(1)           | O(n)                    | 체이닝은 목록에서 빼기, 탐사는 묘비 |
| 모든 키 순회 | O(n + 버킷 수) |                         | 순서는 보장되지 않음                |
| 공간         | O(n)           |                         | 적재율만큼의 여유 칸 포함           |

해시 맵이 할 수 **없는** 일도 알아 두세요. 키가 **정렬된 순서**로 나오지 않고, "30 이상 50 미만" 같은 **범위 검색**이나 **최솟값 찾기**도 O(n)입니다. 이런 연산이 필요하면 Day 65의 BST 계열(`BTreeMap`)을 씁니다.

## 11. 세 언어 비교

| 관점               | C (직접 구현, 체이닝) | Python                                 | Rust                                  |
| ------------------ | --------------------- | -------------------------------------- | ------------------------------------- |
| 표준 해시 맵       | 없음                  | `dict` (내장)                          | `std::collections::HashMap`           |
| 키 문자열 비교     | `strcmp(a, b) == 0`   | `a == b`                               | `a == b`                              |
| 없는 키 조회       | 직접 `bool` 반환      | `d[k]`는 `KeyError`, `d.get(k)`는 None | `m[&k]`는 panic, `m.get(&k)`는 `None` |
| 개수 세기 관용구   | get 후 put            | `d[k] = d.get(k, 0) + 1`, `Counter`    | `*m.entry(k).or_insert(0) += 1`       |
| 키가 될 수 있는 것 | 직접 정함             | 불변(해시 가능) 값: str, int, tuple    | `Eq + Hash`를 구현한 타입             |
| 순회 순서          | 버킷 순서             | **넣은 순서**(3.7부터 보장)            | 순서 없음(실행마다 달라질 수 있음)    |
| 해시 seed          | 고정(직접 만든 함수)  | 실행마다 달라짐(문자열)                | 실행마다 달라짐(`RandomState`)        |

## 12. 자주 하는 실수

### 실수 1: C에서 문자열 키를 `==`로 비교한다

`==`는 두 포인터가 **같은 주소**인지 비교합니다. 리터럴 `"blue"`와 사용자가 입력한 `"blue"`는 내용이 같아도 다른 곳에 있습니다. 반드시 `strcmp(a, b) == 0`을 쓰세요(실습의 디버그 문제).

### 실수 2: 키 문자열을 복사하지 않고 포인터만 저장한다

입력 버퍼 하나를 재사용하면서 그 주소를 키로 저장하면, 버퍼 내용이 바뀔 때마다 **이미 저장된 키들도 함께 바뀝니다.** C 구현이 `copy_string`으로 키를 복사한 이유입니다.

### 실수 3: 재해싱할 때 버킷 번호를 다시 계산하지 않는다

버킷 배열을 그대로 복사해 크기만 늘리면, `해시값 % 8`로 찾을 때 키가 `해시값 % 4` 자리에 있어서 찾지 못합니다. 재해싱은 **모든 키를 새 크기로 다시 넣는 것**입니다.

### 실수 4: Python에서 바꿀 수 있는 값을 키로 쓴다

```python
# 파일: unhashable.py (실행 오류: TypeError)
visited = {}
point = [3, 4]
visited[point] = True       # 리스트는 키가 될 수 없다
```

```text
TypeError: unhashable type: 'list'
```

리스트는 내용이 바뀔 수 있어서, 넣을 때와 찾을 때 해시값이 달라질 수 있습니다. 그래서 Python은 아예 막습니다. 좌표처럼 여러 값을 키로 쓰려면 **튜플** `(3, 4)`를 쓰세요.

### 실수 5: Rust에서 없는 키를 인덱스로 읽는다

```rust
// 파일: missing_key.rs (실행 오류: panicked)
use std::collections::HashMap;

fn main() {
    let mut ages: HashMap<&str, u32> = HashMap::new();
    ages.insert("민수", 17);
    println!("{}", ages["지아"]);       // 없는 키
}
```

```text
thread 'main' panicked at ...
```

`map[&key]` 문법은 키가 **반드시 있다**고 확신할 때만 쓰세요. 없을 수 있다면 `map.get(&key)`로 `Option`을 받아 처리합니다. Python의 `d[key]`가 `KeyError`를 내는 것과 같은 상황입니다.

## 13. Q&A

**Q. 해시 맵과 해시 집합(set)은 무엇이 다른가요?**

A. 해시 집합은 **값 없이 키만** 저장하는 해시 맵입니다. "이 원소가 있나?"만 알면 될 때 씁니다. Python은 `set`, Rust는 `HashSet`입니다. Day 69의 BFS에서 방문한 노드를 기록할 때 씁니다.

**Q. 좋은 해시 함수는 어떻게 만드나요?**

A. 직접 만들 일은 거의 없습니다. 언어가 제공하는 해시를 쓰세요. 직접 만든 구조체를 키로 쓰고 싶다면 Python은 `__hash__`와 `__eq__`를, Rust는 `#[derive(Hash, PartialEq, Eq)]`를 붙이면 됩니다. 이때 **같다고 판단되는 두 값은 반드시 해시값도 같아야** 한다는 규칙을 지켜야 합니다.

**Q. Python dict는 체이닝인가요, 개방 주소법인가요?**

A. CPython의 dict는 **개방 주소법**을 씁니다. 선형 탐사 대신 해시값의 비트를 섞어 다음 칸을 정하는 조금 더 복잡한 탐사 방식이고, 삭제한 칸에는 묘비(dummy)를 남깁니다. Rust의 `HashMap`도 개방 주소법 계열(SwissTable)입니다. 둘 다 오늘 Rust 구현과 같은 원리를 더 정교하게 다듬은 것입니다.

**Q. C로 실무 프로그램을 만들 때도 해시 맵을 직접 구현하나요?**

A. 작은 프로그램에서는 흔히 직접 만듭니다. 큰 프로그램에서는 검증된 라이브러리(예: glib의 `GHashTable`, 단일 헤더 라이브러리 `uthash` 등)를 가져다 씁니다. 원리를 알고 있으면 어떤 라이브러리든 쉽게 이해할 수 있습니다.

## 14. 핵심 요약

- 해시 맵은 **해시 함수로 키를 배열 인덱스로 바꿔서** 평균 O(1)에 값을 찾습니다.
- 버킷 번호 = `해시값 % 버킷 수`. 서로 다른 키가 같은 번호를 받는 **충돌**은 피할 수 없습니다.
- 충돌 해결: **체이닝**(버킷마다 목록) 또는 **개방 주소법**(다른 빈칸 찾기, 예: 선형 탐사).
- 선형 탐사에서 삭제할 때는 빈칸이 아니라 **묘비**를 남겨야 뒤에 밀린 키를 계속 찾을 수 있습니다.
- **적재율**이 기준(예: 0.75)을 넘으면 버킷 수를 두 배로 늘리고 **모든 키를 다시 배치**합니다.
- C는 직접 구현하고 `strcmp`로 비교합니다. Python은 `dict`와 `get(k, 0)`, Rust는 `HashMap`과 `entry().or_insert()`를 씁니다.
- 해시 맵은 순서와 범위 검색에 약합니다. 그럴 때는 정렬된 맵(BST 계열)을 씁니다.

## 15. 도전 문제

1. **(C)** 해시 맵의 키 수가 버킷 수의 1/4 이하로 줄면 버킷 수를 절반으로 줄이는 기능을 `remove_key`에 추가해 보세요.
2. **(Python)** 체이닝 해시 맵에 버킷별 길이를 세어 **가장 긴 체인의 길이**를 출력하는 메서드를 만들고, 영어 단어 1,000개를 넣었을 때 djb2와 "글자 코드 합" 해시 함수를 비교해 보세요.
3. **(Rust)** 문장 목록에서 **애너그램**(글자 구성이 같은 단어)끼리 묶어 보세요. 단어의 글자를 정렬한 문자열을 키로, 단어 목록을 값으로 하는 `HashMap<String, Vec<String>>`을 씁니다.
4. **(세 언어)** Day 62의 이중 연결 리스트와 오늘의 해시 맵을 합쳐 **LRU 캐시**(용량이 차면 가장 오래 쓰지 않은 항목을 버림)를 만들어 보세요. 해시 맵은 키 → 노드를 O(1)에 찾고, 이중 연결 리스트는 사용한 노드를 O(1)에 맨 앞으로 옮깁니다.
