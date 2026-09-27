---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-70-structures-review
courseId: crp-92
phaseId: phase-06
dayNumber: 70
date: "2026-12-09"
title: 자료구조 종합 — 고르고 조합하기, LRU 캐시 만들기
summary: 스택부터 그래프까지 Phase 6의 자료구조를 연산 비용과 쓰임새로 한 번에 정리하고, 요구 사항에서 자료구조를 고르는 기준을 연습합니다. 미니 프로젝트로 해시 맵과 이중 연결 리스트를 조합해 모든 연산이 O(1)인 LRU 캐시를 C, Python, Rust로 완성하고 세 구현의 출력이 같은지 확인합니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 120
prerequisites: [day-69-bfs]
learningObjectives:
  - Phase 6의 자료구조 10가지를 핵심 연산의 시간 복잡도와 대표 쓰임새로 비교한다.
  - 요구 사항을 읽고 필요한 연산을 뽑아내 알맞은 자료구조를 고른다.
  - 한 자료구조만으로는 부족할 때 두 자료구조를 조합하는 설계를 설명한다.
  - 해시 맵과 이중 연결 리스트로 get·put이 O(1)인 LRU 캐시를 세 언어로 구현한다.
  - 세 언어의 표준 라이브러리에서 각 자료구조에 해당하는 도구를 찾는다.
concepts:
  [
    data structure selection,
    complexity,
    composition,
    LRU cache,
    hash map,
    doubly linked list,
    OrderedDict,
  ]
runnerMode: python
playgroundSource: |
  # 파일: lru_ordered.py — capacity와 작업 순서를 바꿔 보세요.
  from collections import OrderedDict

  cache = OrderedDict()
  capacity = 2
  for key in ["A", "B", "A", "C", "B"]:
      if key in cache:
          cache.move_to_end(key, last=False)       # 쓴 것은 맨 앞으로
          print(f"{key} 적중   → {list(cache)}")
          continue
      if len(cache) == capacity:
          old, _ = cache.popitem(last=True)        # 맨 뒤 = 가장 오래됨
          print(f"   ({old} 버림)")
      cache[key] = True
      cache.move_to_end(key, last=False)
      print(f"{key} 추가   → {list(cache)}")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day70-predict-py
    title: OrderedDict로 만든 LRU 추적하기
    kind: predict
    objective: move_to_end와 popitem이 순서를 어떻게 바꾸는지 추적한다.
    prompt: 출력될 한 줄(남은 키 목록)을 예측하세요.
    starter: |-
      from collections import OrderedDict

      cache = OrderedDict()
      for key in ["x", "y", "z"]:
          cache[key] = 0
      cache.move_to_end("x")
      cache.popitem(last=False)
      cache["w"] = 0
      print(list(cache))
    answer: "['z', 'x', 'w']"
    hint: "move_to_end(key)는 그 키를 맨 뒤로 보냅니다. popitem(last=False)는 맨 앞 항목을 꺼냅니다. 새 키는 맨 뒤에 붙습니다."
    explanation: "x, y, z에서 x를 맨 뒤로 보내면 y, z, x입니다. 맨 앞 y를 꺼내면 z, x가 남고 w가 맨 뒤에 붙습니다. 이 코드는 '맨 뒤 = 가장 최근'으로 약속한 LRU입니다."
    commonMistakes:
      - "popitem()의 기본값(last=True)과 헷갈려 맨 뒤를 꺼냄"
      - "move_to_end가 맨 앞으로 보낸다고 생각함"
    language: python
    verification: run
  - id: ex-day70-predict-c
    title: 배열로 흉내 낸 LRU 추적하기
    kind: predict
    objective: 가장 최근 것을 앞에 두는 배열 LRU에서 원소가 밀리는 순서를 추적한다.
    prompt: 출력될 한 줄을 예측하세요.
    starter: |-
      #include <stdio.h>

      int keys[3];
      int count = 0;

      void use(int k) {
          int i = 0;
          while (i < count && keys[i] != k) i++;
          if (i == count) {
              if (count < 3) count++;
              i = count - 1;               // 없으면 맨 뒤 칸(가장 오래된 것)을 덮어쓸 자리
          }
          for (int j = i; j > 0; j--) keys[j] = keys[j - 1];
          keys[0] = k;
      }

      int main(void) {
          int seq[] = {1, 2, 3, 2, 4, 1};
          for (int t = 0; t < 6; t++) use(seq[t]);
          for (int i = 0; i < count; i++) printf("%d ", keys[i]);
          printf("\n");
          return 0;
      }
    answer: "1 4 2"
    hint: "1, 2, 3 뒤 배열은 [3, 2, 1]입니다. 2를 쓰면 [2, 3, 1], 4는 가장 오래된 1을 밀어내 [4, 2, 3], 1은 가장 오래된 3을 밀어냅니다."
    explanation: "마지막 1은 이미 버려져서 새로 들어오고, 가장 오래 쓰지 않은 3이 사라져 [1, 4, 2]가 됩니다. 이 배열 방식은 매번 원소를 밀어야 해서 O(capacity)입니다. 본문의 연결 리스트 방식은 O(1)입니다."
    commonMistakes:
      - "2를 다시 쓸 때 순서를 갱신하지 않아 [1, 4, 3]으로 적음"
      - "가장 먼저 넣은 2를 버린다고 생각함(FIFO와 LRU 혼동)"
    language: c
    verification: run
  - id: ex-day70-fill
    title: Rust LRU의 get 빈칸 채우기
    kind: fill
    objective: HashMap 조회 결과가 없으면 ?로 바로 None을 돌려준다.
    prompt: "get의 빈칸에 map에서 key의 노드 번호를 꺼내는 코드를 채우세요. 없으면 get 전체가 None을 돌려줘야 합니다."
    starter: |-
      use std::collections::HashMap;

      struct Cache {
          map: HashMap<String, usize>,
          values: Vec<i32>,
          order: Vec<usize>,
      }

      impl Cache {
          fn get(&mut self, key: &str) -> Option<i32> {
              let i = _____;
              self.order.retain(|&x| x != i);
              self.order.insert(0, i);
              Some(self.values[i])
          }
      }

      fn main() {
          let mut c = Cache { map: HashMap::from([("a".to_string(), 0), ("b".to_string(), 1)]), values: vec![10, 20], order: vec![0, 1] };
          println!("{:?} {:?} {:?}", c.get("b"), c.get("z"), c.order);
      }
    answer: |-
      use std::collections::HashMap;

      struct Cache {
          map: HashMap<String, usize>,
          values: Vec<i32>,
          order: Vec<usize>,
      }

      impl Cache {
          fn get(&mut self, key: &str) -> Option<i32> {
              let i = *self.map.get(key)?;
              self.order.retain(|&x| x != i);
              self.order.insert(0, i);
              Some(self.values[i])
          }
      }

      fn main() {
          let mut c = Cache { map: HashMap::from([("a".to_string(), 0), ("b".to_string(), 1)]), values: vec![10, 20], order: vec![0, 1] };
          println!("{:?} {:?} {:?}", c.get("b"), c.get("z"), c.order);
      }
    output: "Some(20) None [1, 0]"
    hint: "self.map.get(key)는 Option<&usize>입니다. ?로 None을 걸러 내고 *로 참조를 벗겨 usize를 얻으세요."
    explanation: "b는 노드 1이라 20을 돌려주고 순서가 [1, 0]이 됩니다. z는 없으므로 ?가 즉시 None을 돌려주고 순서는 바뀌지 않습니다. (이 연습용 Cache는 순서를 Vec으로 관리해 O(n)입니다. 본문 구현은 연결 리스트로 O(1)입니다.)"
    commonMistakes:
      - "self.map.get(key).unwrap()을 써서 없는 키에서 panic을 일으킴"
      - "*를 빼서 &usize와 usize 타입이 맞지 않는 오류를 냄"
    language: rust
    verification: run
  - id: ex-day70-modify
    title: Python LRU에 delete 추가하기
    kind: modify
    objective: 해시 맵과 연결 리스트 양쪽에서 함께 지워야 일관성이 유지된다는 것을 확인한다.
    prompt: "LRUCache에 delete(key)를 추가하세요. 있으면 True, 없으면 False를 돌려줍니다. 지운 뒤 put으로 새 키를 넣어도 다른 키가 버려지지 않아야 합니다."
    starter: |-
      class Node:
          def __init__(self, key=None):
              self.key = key
              self.prev = self.next = self


      class LRUCache:
          def __init__(self, capacity):
              self.capacity, self.map, self.s = capacity, {}, Node()

          def _unlink(self, n):
              n.prev.next, n.next.prev = n.next, n.prev

          def _front(self, n):
              n.prev, n.next = self.s, self.s.next
              self.s.next.prev = n
              self.s.next = n

          def put(self, key):
              if key in self.map:
                  n = self.map[key]
                  self._unlink(n)
                  self._front(n)
                  return None
              gone = None
              if len(self.map) == self.capacity:
                  old = self.s.prev
                  self._unlink(old)
                  del self.map[old.key]
                  gone = old.key
              n = Node(key)
              self.map[key] = n
              self._front(n)
              return gone

          def keys(self):
              out, cur = [], self.s.next
              while cur is not self.s:
                  out.append(cur.key)
                  cur = cur.next
              return out


      c = LRUCache(2)
      c.put("a")
      c.put("b")
      print(c.keys())
    answer: |-
      class Node:
          def __init__(self, key=None):
              self.key = key
              self.prev = self.next = self


      class LRUCache:
          def __init__(self, capacity):
              self.capacity, self.map, self.s = capacity, {}, Node()

          def _unlink(self, n):
              n.prev.next, n.next.prev = n.next, n.prev

          def _front(self, n):
              n.prev, n.next = self.s, self.s.next
              self.s.next.prev = n
              self.s.next = n

          def put(self, key):
              if key in self.map:
                  n = self.map[key]
                  self._unlink(n)
                  self._front(n)
                  return None
              gone = None
              if len(self.map) == self.capacity:
                  old = self.s.prev
                  self._unlink(old)
                  del self.map[old.key]
                  gone = old.key
              n = Node(key)
              self.map[key] = n
              self._front(n)
              return gone

          def delete(self, key):
              n = self.map.pop(key, None)
              if n is None:
                  return False
              self._unlink(n)
              return True

          def keys(self):
              out, cur = [], self.s.next
              while cur is not self.s:
                  out.append(cur.key)
                  cur = cur.next
              return out


      c = LRUCache(2)
      c.put("a")
      c.put("b")
      print(c.delete("a"), c.delete("z"), c.put("c"), c.keys())
    output: "True False None ['c', 'b']"
    hint: "map.pop(key, None)은 키를 지우면서 노드를 돌려주고, 없으면 None을 줍니다. 노드를 받았다면 리스트에서도 떼어 내세요."
    explanation: "a를 두 곳에서 모두 지웠으므로 길이가 1이 되어, c를 넣을 때 아무것도 버려지지 않습니다(put이 None을 돌려줌). 리스트에서만 지우고 map에 남기면 len(self.map)이 줄지 않아 b가 억울하게 버려집니다."
    commonMistakes:
      - "map에서만 지우고 리스트에는 노드를 남겨 keys()에 유령 키가 나옴"
      - "리스트에서만 떼어 내 용량 계산이 틀어짐"
    language: python
    verification: run
  - id: ex-day70-debug
    title: C 배열 LRU의 반환값 버그 고치기
    kind: debug
    objective: 원소를 옮긴 뒤 옛 인덱스를 쓰면 다른 값을 읽게 된다는 것을 확인한다.
    prompt: "get(1)은 10이어야 하는데 20이 나옵니다. move_front가 원소들을 옮긴 뒤 옛 인덱스 i로 값을 읽기 때문입니다. 10 [1 3 2]가 출력되도록 고치세요."
    starter: |-
      #include <stdio.h>

      int keys[3], vals[3], count = 0;

      int find(int k) {
          for (int i = 0; i < count; i++) if (keys[i] == k) return i;
          return -1;
      }

      void move_front(int i) {
          int k = keys[i], v = vals[i];
          for (int j = i; j > 0; j--) {
              keys[j] = keys[j - 1];
              vals[j] = vals[j - 1];
          }
          keys[0] = k;
          vals[0] = v;
      }

      void put(int k, int v) {
          if (count < 3) count++;
          keys[count - 1] = k;
          vals[count - 1] = v;
          move_front(count - 1);
      }

      int get(int k) {
          int i = find(k);
          if (i < 0) return -1;
          move_front(i);
          return vals[i];
      }

      int main(void) {
          put(1, 10);
          put(2, 20);
          put(3, 30);
          int v = get(1);
          printf("%d [%d %d %d]\n", v, keys[0], keys[1], keys[2]);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int keys[3], vals[3], count = 0;

      int find(int k) {
          for (int i = 0; i < count; i++) if (keys[i] == k) return i;
          return -1;
      }

      void move_front(int i) {
          int k = keys[i], v = vals[i];
          for (int j = i; j > 0; j--) {
              keys[j] = keys[j - 1];
              vals[j] = vals[j - 1];
          }
          keys[0] = k;
          vals[0] = v;
      }

      void put(int k, int v) {
          if (count < 3) count++;
          keys[count - 1] = k;
          vals[count - 1] = v;
          move_front(count - 1);
      }

      int get(int k) {
          int i = find(k);
          if (i < 0) return -1;
          move_front(i);
          return vals[0];
      }

      int main(void) {
          put(1, 10);
          put(2, 20);
          put(3, 30);
          int v = get(1);
          printf("%d [%d %d %d]\n", v, keys[0], keys[1], keys[2]);
          return 0;
      }
    output: "10 [1 3 2]"
    starterOutput: "20 [1 3 2]"
    hint: "move_front가 끝나면 방금 쓴 원소는 인덱스 0에 있습니다. 인덱스 i에는 원래 그 앞에 있던 다른 원소가 밀려와 있습니다."
    explanation: "put 세 번 뒤 keys는 [3, 2, 1], vals는 [30, 20, 10]입니다. get(1)은 i = 2를 찾고 move_front로 [1, 3, 2] / [10, 30, 20]을 만든 뒤 vals[2] = 20을 읽었습니다. 옮기기 전에 값을 저장하거나 vals[0]을 읽어야 합니다. 자료구조를 바꾸는 함수를 부른 뒤에는 그 전에 구한 위치가 여전히 유효한지 항상 의심하세요."
    commonMistakes:
      - "find를 다시 부르지 않고 i를 1 줄여 쓰는 식으로 땜질함"
      - "move_front 호출을 지워서 LRU 순서 갱신을 빼먹음"
    language: c
    verification: run
  - id: ex-day70-independent
    title: Rust로 최근 방문 페이지 목록 만들기
    kind: independent
    objective: 요구 사항에 맞게 VecDeque와 HashSet을 조합한다.
    prompt: "방문한 페이지를 최근 순으로 최대 3개 보여 주되, 같은 페이지를 다시 방문하면 맨 앞으로 옮기고 중복은 없어야 합니다. 방문 순서 home, news, mail, news, shop, home이면 home shop news가 출력되어야 합니다."
    starter: |-
      use std::collections::{HashSet, VecDeque};

      fn main() {
          let visits = ["home", "news", "mail", "news", "shop", "home"];
          let recent: VecDeque<&str> = VecDeque::new();
          let seen: HashSet<&str> = HashSet::new();
          println!("{} {} {}", visits.len(), recent.len(), seen.len());
      }
    answer: |-
      use std::collections::{HashSet, VecDeque};

      fn main() {
          let visits = ["home", "news", "mail", "news", "shop", "home"];
          let limit = 3;
          let mut recent: VecDeque<&str> = VecDeque::new();
          let mut seen: HashSet<&str> = HashSet::new();
          for page in visits {
              if seen.contains(page) {
                  recent.retain(|&p| p != page);
              } else {
                  seen.insert(page);
              }
              recent.push_front(page);
              if recent.len() > limit {
                  if let Some(old) = recent.pop_back() {
                      seen.remove(old);
                  }
              }
          }
          println!("{}", recent.iter().copied().collect::<Vec<_>>().join(" "));
      }
    output: "home shop news"
    hint: "HashSet으로 '이미 목록에 있나'를 빨리 확인하고, VecDeque 앞쪽에 가장 최근 페이지를 둡니다. 목록에서 밀려난 페이지는 집합에서도 지우세요."
    explanation: "news를 두 번째로 방문하면 기존 news를 지우고 맨 앞에 다시 넣습니다. shop이 들어올 때 mail이 밀려나고, home은 이미 밀려났기 때문에 새로 들어와 news의 앞자리를 차지합니다. retain은 O(n)이라 목록이 길다면 본문의 LRU 캐시(해시 맵 + 연결 리스트)가 알맞습니다. 요구 사항의 규모에 맞춰 단순한 조합을 고르는 것도 설계입니다."
    commonMistakes:
      - "밀려난 페이지를 seen에서 지우지 않아 나중에 다시 방문해도 목록에 들어가지 못함"
      - "중복 검사 없이 push_front만 해서 같은 페이지가 두 번 보임"
    language: rust
    verification: run
quiz:
  - id: quiz-day70-01
    question: "'가장 최근에 넣은 작업부터 되돌린다'는 요구 사항에 알맞은 자료구조는?"
    choices: ["큐", "스택", "힙", "해시 맵"]
    answerIndex: 1
    explanation: 최근 것부터 꺼내는 LIFO이므로 스택입니다(Day 57~58의 실행 취소).
  - id: quiz-day70-02
    question: 매 순간 '마감이 가장 급한 과제'를 꺼내야 합니다. 과제는 수시로 추가됩니다. 알맞은 자료구조는?
    choices: ["정렬된 배열", "큐", "최소 힙(우선순위 큐)", "연결 리스트"]
    answerIndex: 2
    explanation: 넣기와 가장 작은 것 꺼내기가 모두 O(log n)인 힙이 알맞습니다. 정렬된 배열은 넣을 때마다 O(n)이 걸립니다.
  - id: quiz-day70-03
    question: LRU 캐시에서 해시 맵만 쓰면 어떤 연산이 느려지나요?
    choices:
      - 키로 값 찾기
      - 가장 오래 쓰지 않은 키 찾기
      - 새 키 넣기
      - 키 개수 세기
    answerIndex: 1
    explanation: 해시 맵은 순서를 모르므로 가장 오래된 키를 찾으려면 모든 키를 봐야 합니다(O(n)). 그래서 사용 순서를 이중 연결 리스트로 따로 관리합니다.
  - id: quiz-day70-04
    question: LRU 캐시에서 이중 연결 리스트 대신 단일 연결 리스트를 쓰면 무엇이 문제인가요?
    choices:
      - 새 노드를 맨 앞에 넣을 수 없다
      - 해시 맵으로 찾은 노드를 리스트에서 떼어 낼 때 앞 노드를 몰라 O(n)이 걸린다
      - 메모리를 더 많이 쓴다
      - 키를 저장할 수 없다
    answerIndex: 1
    explanation: 가운데 노드를 떼어 내려면 앞 노드의 next를 바꿔야 합니다. prev가 있으면 O(1), 없으면 head부터 찾아야 합니다(Day 62).
  - id: quiz-day70-05
    question: 정점 수만 개, 간선이 적은 지도에서 두 지점 사이의 최소 환승 경로를 구하려면?
    choices:
      - 인접 행렬 + 이진 탐색
      - 인접 목록 + BFS
      - 해시 맵 + 정렬
      - 스택 + 힙 정렬
    answerIndex: 1
    explanation: 간선이 적은 그래프는 인접 목록이 공간 효율적이고, 간선마다 비용이 같은 최소 횟수 문제는 BFS가 최단 경로를 줍니다(Day 68~69).
---

## 1. 오늘 배울 내용

Day 57부터 14일 동안 열 가지 자료구조를 만들었습니다. 오늘은 Phase 6을 마무리하는 날입니다.

1. 모든 자료구조를 **한 표로** 정리하고 핵심 연산 비용을 비교합니다.
2. 요구 사항에서 **필요한 연산을 뽑아** 자료구조를 고르는 방법을 연습합니다.
3. 자료구조 하나로 부족할 때 **두 개를 조합**하는 설계를 배웁니다.
4. 미니 프로젝트로 **LRU 캐시**를 C, Python, Rust로 완성합니다. 해시 맵(Day 67)과 이중 연결 리스트(Day 62)를 합쳐 모든 연산을 O(1)로 만듭니다. 세 구현은 **똑같은 출력**을 냅니다.
5. 세 언어의 표준 라이브러리에서 각 자료구조를 무엇이라고 부르는지 정리합니다.

## 2. Phase 6 자료구조 총정리

| 자료구조         | 핵심 규칙                   | 빠른 연산 (시간)                     | 느린 연산                  | 대표 쓰임                  | Day   |
| ---------------- | --------------------------- | ------------------------------------ | -------------------------- | -------------------------- | ----- |
| 스택             | LIFO, 한쪽 끝               | push·pop·peek O(1)                   | 중간 검색 O(n)             | 실행 취소, 괄호, 호출 스택 | 57–58 |
| 큐               | FIFO, 뒤에 넣고 앞에서 뺌   | enqueue·dequeue O(1)                 | 중간 검색 O(n)             | 대기열, BFS                | 59    |
| 원형 큐/버퍼     | `%`로 인덱스를 돌림         | O(1), 고정 공간                      | 용량 초과 시 거절·덮어쓰기 | 최근 N개, 스트리밍         | 60    |
| 단일 연결 리스트 | next로 한 방향              | 맨 앞 삽입·삭제 O(1)                 | k번째 O(k), 끝 삭제 O(n)   | 맨 앞 작업, 큐 구현        | 61    |
| 이중 연결 리스트 | prev·next 양방향            | 알고 있는 노드 삭제·이동 O(1)        | 검색 O(n)                  | 재생 목록, LRU             | 62    |
| 이진 트리        | 부모와 두 자식              | 순회 O(n)                            | 검색 O(n)                  | 계층, 수식 트리            | 64    |
| 이진 탐색 트리   | 왼쪽 < 노드 < 오른쪽        | 검색·삽입·삭제 O(h), 정렬 순회       | 편향되면 O(n)              | 정렬된 맵, 범위 검색       | 65    |
| 힙               | 부모 ≤ 자식, 완전 이진 트리 | 최솟값 보기 O(1), 넣기·빼기 O(log n) | 임의 검색 O(n)             | 우선순위 큐, 상위 k개      | 66    |
| 해시 맵          | 해시로 키를 버킷에          | 검색·삽입·삭제 평균 O(1)             | 순서·범위 O(n)             | 사전, 빈도 세기, 방문 집합 | 67    |
| 그래프           | 정점과 간선                 | 인접 목록에서 이웃 나열 O(차수)      | (표현에 따라 다름)         | 관계, 지도, 네트워크       | 68–69 |

## 3. 자료구조 고르기: 연산에서 출발하기

자료구조를 고를 때는 "어떤 자료구조를 알고 있나?"가 아니라 **"어떤 연산이 자주 필요한가?"** 에서 출발합니다.

```text
① 요구 사항을 읽고 필요한 연산을 모두 적는다
② 가장 자주 일어나는 연산 1~2개를 고른다
③ 그 연산이 빠른 자료구조를 2절의 표에서 찾는다
④ 한 자료구조가 모든 연산을 빠르게 못 하면 → 두 개를 조합한다
⑤ 데이터가 작다면 → 단순한 배열로도 충분한지 먼저 생각한다
```

| 요구 사항                              | 핵심 연산                          | 고를 자료구조                  |
| -------------------------------------- | ---------------------------------- | ------------------------------ |
| 편집기의 실행 취소                     | 최근 것 넣기·꺼내기                | 스택                           |
| 은행 번호표                            | 먼저 온 순서로 꺼내기              | 큐                             |
| 센서의 최근 100개 값 평균              | 고정 공간, 오래된 값 덮어쓰기      | 원형 버퍼                      |
| 응급실 환자 순서                       | 가장 위급한 환자 꺼내기, 수시 추가 | 힙                             |
| 회원 ID로 정보 조회                    | 키로 찾기                          | 해시 맵                        |
| 점수가 70~80점인 학생 목록             | 범위 검색, 정렬 순서               | BST 계열(정렬된 맵)            |
| 지하철 최소 환승 경로                  | 이웃 나열, 최단 간선 수            | 그래프(인접 목록) + BFS        |
| **최근에 쓴 데이터 N개만 빠르게 보관** | 키로 찾기 + 가장 오래된 것 버리기  | **해시 맵 + 이중 연결 리스트** |

마지막 줄이 오늘의 미니 프로젝트인 **LRU 캐시**입니다.

## 4. 천천히 풀어보기

### 4.1 LRU 캐시란

**캐시(cache)** 는 느린 곳(디스크, 네트워크, 복잡한 계산)의 결과를 빠른 곳(메모리)에 잠시 보관해 두는 저장소입니다. 공간이 한정되어 있으므로 가득 차면 무언가를 버려야 합니다. **LRU(Least Recently Used)** 는 "가장 오래 쓰지 않은 것을 버린다"는 규칙입니다. 최근에 쓴 데이터는 곧 다시 쓸 가능성이 높다는 경험에 근거한 규칙으로, 웹 브라우저, 운영체제의 메모리 관리, 데이터베이스가 모두 씁니다.

LRU 캐시에 필요한 연산은 두 가지입니다.

- `get(key)`: 키가 있으면 값을 돌려주고, 그 키를 **가장 최근에 쓴 것**으로 표시합니다.
- `put(key, value)`: 키를 넣거나 값을 갱신하고 가장 최근으로 표시합니다. 가득 찼다면 **가장 오래 쓰지 않은 키**를 버립니다.

### 4.2 한 자료구조로는 부족하다

| 후보                           | get(key)    | 가장 오래된 것 찾기·버리기 | 최근으로 옮기기 |
| ------------------------------ | ----------- | -------------------------- | --------------- |
| 해시 맵만                      | **O(1)**    | O(n) (순서를 모름)         | 순서가 없음     |
| 사용 순서의 배열만             | O(n) (검색) | O(1) (끝)                  | O(n) (밀기)     |
| 이중 연결 리스트만             | O(n) (검색) | **O(1)** (tail)            | **O(1)**        |
| **해시 맵 + 이중 연결 리스트** | **O(1)**    | **O(1)**                   | **O(1)**        |

해시 맵은 "키로 찾기"에 강하고, 이중 연결 리스트는 "순서를 바꾸고 끝을 버리기"에 강합니다. 둘을 **연결**하면 됩니다. 해시 맵에는 `키 → 리스트의 노드`를 저장합니다. 해시 맵으로 노드를 O(1)에 찾고, 그 노드를 prev와 next로 O(1)에 떼어 내 맨 앞으로 옮깁니다.

```text
해시 맵                          이중 연결 리스트 (앞 = 가장 최근)
 "A" ──────────────────┐
 "C" ─────────┐        │         head                              tail
 "D" ───┐     │        │          ▼                                 ▼
        ▼     ▼        ▼        ┌─────┐    ┌─────┐    ┌─────┐
                                │ D=4 │ ⇄  │ A=1 │ ⇄  │ C=3 │   ← 가득 차면 여기를 버린다
                                └─────┘    └─────┘    └─────┘
```

### 4.3 두 자료구조를 항상 함께 고친다

조합한 자료구조에서 가장 중요한 **불변식**은 이것입니다.

> 해시 맵에 있는 키 = 리스트에 있는 노드의 키. 개수도 같다.

그래서 모든 연산은 두 자료구조를 **함께** 고쳐야 합니다.

| 연산             | 해시 맵                         | 이중 연결 리스트                       |
| ---------------- | ------------------------------- | -------------------------------------- |
| get(적중)        | 그대로                          | 노드를 떼어 내 맨 앞으로               |
| put(이미 있음)   | 그대로(값만 노드에서 갱신)      | 노드를 맨 앞으로                       |
| put(새 키, 여유) | 키 → 새 노드 추가               | 새 노드를 맨 앞에                      |
| put(새 키, 가득) | **tail의 키 삭제** + 새 키 추가 | **tail 떼어 내기** + 새 노드를 맨 앞에 |

한쪽만 고치면 "해시 맵에는 있는데 리스트에는 없는 유령 키"가 생기거나, 가득 찼는지 계산이 틀어집니다(실습의 수정 문제).

### 4.4 세 언어의 설계 선택

| 언어   | 해시 맵                          | 리스트                                  | 노드 재사용                |
| ------ | -------------------------------- | --------------------------------------- | -------------------------- |
| C      | 직접 만든 체이닝(노드 번호 사용) | 노드 배열 + prev·next **번호**          | 버린 노드를 새 키에 재사용 |
| Python | `dict`                           | 더미 노드 원형 이중 연결 리스트(Day 62) | 새 Node 객체를 만든다      |
| Rust   | `HashMap<String, usize>`         | `Vec<Node>` + 인덱스 연결(Day 62 arena) | 버린 노드 칸을 재사용      |

C와 Rust는 노드를 **배열에 두고 번호로 연결**했습니다. C는 `malloc` 없이 고정된 공간만 쓰고, Rust는 서로 가리키는 구조를 소유권 문제 없이 만들 수 있기 때문입니다.

## 5. C로 구현하기

C 구현은 노드 배열 하나로 두 자료구조를 동시에 표현합니다. 각 노드는 리스트 연결(`prev`, `next`)과 해시 버킷 연결(`hnext`)을 **둘 다** 가집니다. 노드 하나가 두 개의 연결 리스트에 동시에 속하는 셈입니다.

```c
// 파일: lru.c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define CAPACITY 3
#define BUCKETS 8
#define NONE (-1)

typedef struct {
    char key[8];
    int value;
    int prev, next;             // 이중 연결 리스트 (노드 번호)
    int hnext;                  // 같은 해시 버킷의 다음 노드 (체이닝)
} Node;

Node nodes[CAPACITY];
int bucket[BUCKETS];            // 버킷마다 첫 노드 번호
int head = NONE, tail = NONE;   // head = 가장 최근, tail = 가장 오래됨
int used = 0;                   // 사용한 노드 수

unsigned hash(const char *s) {
    unsigned h = 5381;
    while (*s) {
        h = h * 33 + (unsigned char)*s++;
    }
    return h % BUCKETS;
}

int find(const char *key) {                 // 해시 맵: 키 → 노드 번호
    for (int i = bucket[hash(key)]; i != NONE; i = nodes[i].hnext) {
        if (strcmp(nodes[i].key, key) == 0) {
            return i;
        }
    }
    return NONE;
}

void map_remove(int i) {
    int *link = &bucket[hash(nodes[i].key)];
    while (*link != i) {
        link = &nodes[*link].hnext;
    }
    *link = nodes[i].hnext;
}

void unlink_node(int i) {
    if (nodes[i].prev != NONE) nodes[nodes[i].prev].next = nodes[i].next;
    else head = nodes[i].next;
    if (nodes[i].next != NONE) nodes[nodes[i].next].prev = nodes[i].prev;
    else tail = nodes[i].prev;
}

void push_front(int i) {
    nodes[i].prev = NONE;
    nodes[i].next = head;
    if (head != NONE) nodes[head].prev = i;
    else tail = i;
    head = i;
}

bool get(const char *key, int *out) {
    int i = find(key);
    if (i == NONE) return false;
    unlink_node(i);
    push_front(i);                          // 쓴 것은 맨 앞으로
    *out = nodes[i].value;
    return true;
}

// 버린 키를 evicted에 복사하고 true를 돌려준다
bool put(const char *key, int value, char *evicted) {
    int i = find(key);
    if (i != NONE) {
        nodes[i].value = value;
        unlink_node(i);
        push_front(i);
        return false;
    }
    bool dropped = false;
    if (used < CAPACITY) {
        i = used++;
    } else {
        i = tail;                           // 가장 오래된 노드를 재사용
        strcpy(evicted, nodes[i].key);
        unlink_node(i);
        map_remove(i);
        dropped = true;
    }
    snprintf(nodes[i].key, sizeof nodes[i].key, "%s", key);
    nodes[i].value = value;
    unsigned b = hash(key);
    nodes[i].hnext = bucket[b];
    bucket[b] = i;
    push_front(i);
    return dropped;
}

void order(char *buf, size_t size) {
    size_t len = 0;
    buf[0] = '\0';
    for (int i = head; i != NONE; i = nodes[i].next) {
        len += (size_t)snprintf(buf + len, size - len, "%s%s=%d",
                                len ? " " : "", nodes[i].key, nodes[i].value);
    }
}

int main(void) {
    for (int b = 0; b < BUCKETS; b++) bucket[b] = NONE;

    struct { const char *op; const char *key; int value; } steps[] = {
        {"put", "A", 1}, {"put", "B", 2}, {"put", "C", 3}, {"get", "A", 0},
        {"put", "D", 4}, {"get", "B", 0}, {"put", "C", 30}, {"put", "E", 5}, {"get", "A", 0},
    };
    int n = sizeof steps / sizeof steps[0];
    char buf[64], label[16], evicted[8];

    for (int k = 0; k < n; k++) {
        if (strcmp(steps[k].op, "put") == 0) {
            bool dropped = put(steps[k].key, steps[k].value, evicted);
            order(buf, sizeof buf);
            snprintf(label, sizeof label, "put %s=%d", steps[k].key, steps[k].value);
            printf("%-9s -> [%s]", label, buf);
            if (dropped) printf("  (버림: %s)", evicted);
            printf("\n");
        } else {
            int v;
            bool found = get(steps[k].key, &v);
            order(buf, sizeof buf);
            snprintf(label, sizeof label, "get %s", steps[k].key);
            if (found) printf("%-9s -> [%s]  값: %d\n", label, buf, v);
            else printf("%-9s -> [%s]  값: 없음\n", label, buf);
        }
    }
    return 0;
}
```

실행 결과:

```text
put A=1   -> [A=1]
put B=2   -> [B=2 A=1]
put C=3   -> [C=3 B=2 A=1]
get A     -> [A=1 C=3 B=2]  값: 1
put D=4   -> [D=4 A=1 C=3]  (버림: B)
get B     -> [D=4 A=1 C=3]  값: 없음
put C=30  -> [C=30 D=4 A=1]
put E=5   -> [E=5 C=30 D=4]  (버림: A)
get A     -> [E=5 C=30 D=4]  값: 없음
```

### 코드 한 부분씩 읽기

| 코드                                                  | 설명                                                                                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int prev, next; int hnext;`                          | 포인터 대신 **노드 번호**(배열 인덱스)로 연결합니다. `NONE`(-1)이 NULL 역할입니다. `hnext`는 같은 해시 버킷에 속한 다음 노드 번호입니다(Day 67의 체이닝). |
| `int bucket[BUCKETS];`                                | 버킷마다 첫 노드 번호를 저장합니다. 해시 맵 전체가 이 배열과 노드들의 `hnext`로 이루어집니다.                                                             |
| `int find(const char *key)`                           | 해시 맵 검색입니다. 키의 버킷에서 `hnext`를 따라가며 `strcmp`로 비교합니다. 평균 O(1)입니다.                                                              |
| `int *link = &bucket[...]; while (*link != i) ...`    | 해시 체인에서 노드 i를 떼어 냅니다. Day 61·67의 "나를 가리키는 칸" 기법이라 첫 노드도 같은 코드로 처리됩니다.                                             |
| `unlink_node`, `push_front`                           | Day 62의 이중 연결 리스트 연산을 번호로 옮긴 것입니다. head와 tail 갱신을 잊지 않는 것이 핵심입니다.                                                      |
| `i = tail; ... unlink_node(i); map_remove(i);`        | 가득 찼을 때 가장 오래된 노드를 **리스트와 해시 맵 양쪽에서** 떼어 낸 뒤, 그 노드 칸을 새 키에 **재사용**합니다. `malloc`·`free`가 한 번도 필요 없습니다. |
| `strcpy(evicted, nodes[i].key);`                      | 노드를 새 키로 덮어쓰기 **전에** 버린 키를 복사해 둡니다. 순서를 바꾸면 새 키가 복사됩니다.                                                               |
| `len += (size_t)snprintf(buf + len, size - len, ...)` | 버퍼 끝에 이어 쓰는 관용구입니다. `snprintf`는 쓴 글자 수를 돌려주므로 다음에 쓸 위치를 계산할 수 있습니다.                                               |
| `struct { const char *op; ... } steps[] = {...};`     | 이름 없는 구조체 배열로 시험할 작업 목록을 만들었습니다. 세 언어가 같은 순서로 같은 작업을 합니다.                                                        |

> **참고**: 키 길이를 `char key[8]`로 제한했고 `snprintf`로 복사해 넘치지 않게 했습니다. 실제 캐시라면 Day 67처럼 키를 `malloc`으로 복사하거나, 키의 최대 길이를 문서로 분명히 정해 둡니다.

## 6. Python으로 구현하기

Python 구현은 `dict`와 Day 62의 **더미 노드 원형 이중 연결 리스트**를 조합합니다. 더미 노드의 next가 가장 최근, prev가 가장 오래된 노드입니다.

```python
# 파일: lru.py
class Node:
    def __init__(self, key=None, value=None):
        self.key, self.value = key, value
        self.prev = self.next = self


class LRUCache:
    """해시 맵(dict) + 더미 노드 이중 연결 리스트"""

    def __init__(self, capacity):
        self.capacity = capacity
        self.map = {}                 # 키 → 노드
        self.s = Node()               # s.next = 가장 최근, s.prev = 가장 오래됨

    def _unlink(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _push_front(self, node):
        node.prev, node.next = self.s, self.s.next
        self.s.next.prev = node
        self.s.next = node

    def get(self, key):
        node = self.map.get(key)
        if node is None:
            return None
        self._unlink(node)            # 쓴 것은 맨 앞으로
        self._push_front(node)
        return node.value

    def put(self, key, value):
        node = self.map.get(key)
        if node is not None:
            node.value = value
            self._unlink(node)
            self._push_front(node)
            return None
        evicted = None
        if len(self.map) == self.capacity:
            old = self.s.prev         # 가장 오래 쓰지 않은 것
            self._unlink(old)
            del self.map[old.key]
            evicted = old.key
        node = Node(key, value)
        self.map[key] = node
        self._push_front(node)
        return evicted

    def order(self):
        out, cur = [], self.s.next
        while cur is not self.s:
            out.append(f"{cur.key}={cur.value}")
            cur = cur.next
        return " ".join(out)


cache = LRUCache(3)
steps = [("put", "A", 1), ("put", "B", 2), ("put", "C", 3), ("get", "A"),
         ("put", "D", 4), ("get", "B"), ("put", "C", 30), ("put", "E", 5), ("get", "A")]
for step in steps:
    if step[0] == "put":
        evicted = cache.put(step[1], step[2])
        note = f"  (버림: {evicted})" if evicted else ""
        print(f"{'put ' + step[1] + '=' + str(step[2]):<9} -> [{cache.order()}]{note}")
    else:
        value = cache.get(step[1])
        print(f"{'get ' + step[1]:<9} -> [{cache.order()}]  값: {'없음' if value is None else value}")
```

실행 결과:

```text
put A=1   -> [A=1]
put B=2   -> [B=2 A=1]
put C=3   -> [C=3 B=2 A=1]
get A     -> [A=1 C=3 B=2]  값: 1
put D=4   -> [D=4 A=1 C=3]  (버림: B)
get B     -> [D=4 A=1 C=3]  값: 없음
put C=30  -> [C=30 D=4 A=1]
put E=5   -> [E=5 C=30 D=4]  (버림: A)
get A     -> [E=5 C=30 D=4]  값: 없음
```

### 코드 한 부분씩 읽기

| 코드                                 | 설명                                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self.map = {}`                      | 키 → **노드 객체**입니다. 값만 저장하면 리스트에서 노드를 찾을 방법이 없습니다. 노드를 저장하는 것이 조합의 핵심입니다.                            |
| `self.s = Node()`                    | 더미 노드 덕분에 빈 캐시, 노드 하나인 캐시에서도 `_unlink`와 `_push_front`에 if 문이 필요 없습니다(Day 62).                                        |
| `old = self.s.prev`                  | 더미의 prev가 가장 오래 쓰지 않은 노드입니다. tail 변수를 따로 두지 않아도 됩니다.                                                                 |
| `del self.map[old.key]`              | 노드가 자기 **키를 기억**하고 있어야 해시 맵에서 지울 수 있습니다. 그래서 노드에 값뿐 아니라 키도 저장했습니다.                                    |
| `node.value = value` (이미 있는 키)  | 새 노드를 만들지 않고 기존 노드의 값만 바꾼 뒤 맨 앞으로 옮깁니다. `put C=30` 줄에서 C가 버려지지 않고 맨 앞으로 온 것을 확인하세요.               |
| `print(f"{'put ' + ...:<9} -> ...")` | 표시할 문자열을 먼저 만들고 9칸 왼쪽 정렬했습니다. C는 `snprintf`로 label을 만든 뒤 `%-9s`로, Rust는 `format!` 후 `{label:<9}`로 같은 일을 합니다. |

> **TIP**: Python 표준 라이브러리의 `collections.OrderedDict`는 내부에 이중 연결 리스트를 가진 사전이라, `move_to_end`와 `popitem(last=False)`로 LRU를 몇 줄 만에 만들 수 있습니다(위의 실행 영역 예제). 함수 결과를 자동으로 캐시하고 싶다면 `@functools.lru_cache(maxsize=128)` 데코레이터를 쓰면 됩니다.

## 7. Rust로 구현하기

Rust 구현은 `HashMap<String, usize>`로 키 → 노드 번호를 찾고, `Vec<Node>`에 노드를 저장해 인덱스로 연결합니다(Day 62의 arena 방식). 가득 차면 가장 오래된 노드의 칸을 새 키에 재사용합니다.

```rust
// 파일: lru.rs
use std::collections::HashMap;

struct Node {
    key: String,
    value: i32,
    prev: Option<usize>,
    next: Option<usize>,
}

struct LruCache {
    capacity: usize,
    map: HashMap<String, usize>,    // 키 → 노드 번호
    nodes: Vec<Node>,               // 노드 저장소 (인덱스로 연결)
    head: Option<usize>,            // 가장 최근
    tail: Option<usize>,            // 가장 오래됨
}

impl LruCache {
    fn new(capacity: usize) -> Self {
        LruCache { capacity, map: HashMap::new(), nodes: Vec::new(), head: None, tail: None }
    }

    fn unlink(&mut self, i: usize) {
        let (p, n) = (self.nodes[i].prev, self.nodes[i].next);
        match p {
            Some(p) => self.nodes[p].next = n,
            None => self.head = n,
        }
        match n {
            Some(n) => self.nodes[n].prev = p,
            None => self.tail = p,
        }
    }

    fn push_front(&mut self, i: usize) {
        self.nodes[i].prev = None;
        self.nodes[i].next = self.head;
        match self.head {
            Some(h) => self.nodes[h].prev = Some(i),
            None => self.tail = Some(i),
        }
        self.head = Some(i);
    }

    fn get(&mut self, key: &str) -> Option<i32> {
        let i = *self.map.get(key)?;
        self.unlink(i);
        self.push_front(i);
        Some(self.nodes[i].value)
    }

    fn put(&mut self, key: &str, value: i32) -> Option<String> {
        if let Some(&i) = self.map.get(key) {
            self.nodes[i].value = value;
            self.unlink(i);
            self.push_front(i);
            return None;
        }
        let mut evicted = None;
        let i = if self.nodes.len() < self.capacity {
            self.nodes.push(Node { key: key.to_string(), value, prev: None, next: None });
            self.nodes.len() - 1
        } else {
            let old = self.tail.expect("가득 찼으니 tail이 있다");
            self.unlink(old);
            let old_key = std::mem::replace(&mut self.nodes[old].key, key.to_string());
            self.map.remove(&old_key);
            self.nodes[old].value = value;
            evicted = Some(old_key);
            old                                     // 가장 오래된 노드를 재사용
        };
        self.map.insert(key.to_string(), i);
        self.push_front(i);
        evicted
    }

    fn order(&self) -> String {
        let mut parts = Vec::new();
        let mut cur = self.head;
        while let Some(i) = cur {
            parts.push(format!("{}={}", self.nodes[i].key, self.nodes[i].value));
            cur = self.nodes[i].next;
        }
        parts.join(" ")
    }
}

fn main() {
    let mut cache = LruCache::new(3);
    let steps = [("put", "A", 1), ("put", "B", 2), ("put", "C", 3), ("get", "A", 0),
                 ("put", "D", 4), ("get", "B", 0), ("put", "C", 30), ("put", "E", 5), ("get", "A", 0)];
    for (op, key, value) in steps {
        if op == "put" {
            let evicted = cache.put(key, value);
            let label = format!("put {key}={value}");
            let note = evicted.map(|k| format!("  (버림: {k})")).unwrap_or_default();
            println!("{label:<9} -> [{}]{note}", cache.order());
        } else {
            let got = cache.get(key);
            let label = format!("get {key}");
            let shown = got.map(|v| v.to_string()).unwrap_or_else(|| "없음".to_string());
            println!("{label:<9} -> [{}]  값: {shown}", cache.order());
        }
    }
}
```

실행 결과:

```text
put A=1   -> [A=1]
put B=2   -> [B=2 A=1]
put C=3   -> [C=3 B=2 A=1]
get A     -> [A=1 C=3 B=2]  값: 1
put D=4   -> [D=4 A=1 C=3]  (버림: B)
get B     -> [D=4 A=1 C=3]  값: 없음
put C=30  -> [C=30 D=4 A=1]
put E=5   -> [E=5 C=30 D=4]  (버림: A)
get A     -> [E=5 C=30 D=4]  값: 없음
```

### 코드 한 부분씩 읽기

| 코드                                                              | 설명                                                                                                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `map: HashMap<String, usize>`                                     | 값은 노드 **번호**입니다. 노드 자체(참조)를 저장하면 map과 nodes가 같은 데이터를 동시에 빌리게 되어 소유권 규칙과 부딪칩니다. 번호는 복사 가능한 숫자라 문제가 없습니다. |
| `let i = *self.map.get(key)?;`                                    | 없으면 `?`가 즉시 `None`을 돌려주고, 있으면 `&usize`를 `*`로 복사해 꺼냅니다. `i`가 복사본이라 그 뒤에 `self.unlink(i)`처럼 `self`를 가변으로 빌릴 수 있습니다.          |
| `let (p, n) = (self.nodes[i].prev, self.nodes[i].next);`          | 이웃 번호를 먼저 복사해 두고 연결을 고칩니다. Day 62의 arena 리스트와 같은 패턴입니다.                                                                                   |
| `std::mem::replace(&mut self.nodes[old].key, key.to_string())`    | 오래된 노드의 키를 **새 키로 바꾸면서** 옛 키의 소유권을 돌려받습니다. 받은 옛 키로 해시 맵에서 지우고, 버린 키로 돌려줍니다. 복사 없이 소유권만 옮깁니다.               |
| `let i = if ... { ... } else { ... };`                            | `if`도 값을 만드는 표현식이라 두 갈래가 모두 노드 번호를 돌려줍니다. 여유가 있으면 새 칸, 없으면 재사용할 칸입니다.                                                      |
| `evicted.map(\|k\| format!("  (버림: {k})")).unwrap_or_default()` | 버린 키가 있으면 안내 문구를, 없으면 빈 문자열을 만듭니다. `unwrap_or_default`는 `String`의 기본값(빈 문자열)을 씁니다.                                                  |

## 8. 실행 추적

세 프로그램이 공통으로 하는 작업을 캐시 상태(앞 = 가장 최근)와 해시 맵의 키 집합으로 따라갑니다. 용량은 3입니다.

| 작업     | 해시 맵 조회       | 버린 키 | 리스트 (최근 → 오래됨) | 해시 맵 키 |
| -------- | ------------------ | ------- | ---------------------- | ---------- |
| put A=1  | 없음, 여유 있음    |         | A                      | {A}        |
| put B=2  | 없음, 여유 있음    |         | B A                    | {A, B}     |
| put C=3  | 없음, 여유 있음    |         | C B A                  | {A, B, C}  |
| get A    | **있음**           |         | A C B                  | {A, B, C}  |
| put D=4  | 없음, **가득**     | B       | D A C                  | {A, C, D}  |
| get B    | 없음               |         | D A C                  | {A, C, D}  |
| put C=30 | **있음** → 값 갱신 |         | C D A                  | {A, C, D}  |
| put E=5  | 없음, 가득         | A       | E C D                  | {C, D, E}  |
| get A    | 없음               |         | E C D                  | {C, D, E}  |

B는 **가장 먼저 넣은** A가 아니라, `get A`로 A가 갱신된 뒤 **가장 오래 쓰지 않은** 것이 되어 버려졌습니다. 먼저 들어온 것을 버리는 FIFO와 LRU의 차이가 이것입니다. 리스트와 해시 맵의 키가 모든 줄에서 일치하는지(불변식) 확인해 보세요.

## 9. 다른 예제로 다시 이해하기

조합 설계의 다른 예로 **실시간 인기 검색어**를 만들어 봅시다. 검색어가 들어올 때마다 횟수를 세고(**해시 맵**), 필요할 때 상위 k개를 뽑습니다(**힙**). 모든 검색어를 정렬하면 O(n log n)이지만, 크기가 k인 힙을 쓰면 O(n log k)입니다(Day 66의 상위 k개). 여기에 "최근 5개 검색 기록"은 고정 크기로 오래된 것을 버리는 **원형 버퍼**(`deque(maxlen=5)`)로 관리합니다. 요구 사항마다 다른 자료구조를 골라 한 프로그램에서 함께 쓰는 연습입니다.

```python
# 파일: trending.py
from collections import deque
import heapq

searches = ["날씨", "축구", "날씨", "환율", "축구", "날씨", "영화", "환율", "날씨", "주식"]

counts = {}                         # 해시 맵: 검색어 → 횟수
recent = deque(maxlen=5)            # 원형 버퍼: 최근 5개 검색
for word in searches:
    counts[word] = counts.get(word, 0) + 1
    recent.append(word)

top3 = heapq.nlargest(3, counts.items(), key=lambda kv: kv[1])   # 힙: 상위 3개
print("횟수:", counts)
print("인기 검색어 TOP 3:", top3)
print("최근 검색 5개:", list(recent))
```

실행 결과:

```text
횟수: {'날씨': 4, '축구': 2, '환율': 2, '영화': 1, '주식': 1}
인기 검색어 TOP 3: [('날씨', 4), ('축구', 2), ('환율', 2)]
최근 검색 5개: ['날씨', '영화', '환율', '날씨', '주식']
```

`heapq.nlargest`는 횟수가 같은 축구와 환율을 **먼저 나온 순서**로 돌려줍니다. 동점 순서가 중요하다면 Day 66처럼 비교 기준에 두 번째 값을 넣어야 합니다.

## 10. 시간·공간 복잡도 한눈에 보기

n은 원소 수입니다. "상각"은 가끔 비싼 작업이 섞이지만 평균이 그 값이라는 뜻입니다.

| 자료구조         | 접근(k번째) | 검색(값)      | 삽입             | 삭제               | 최솟값   |
| ---------------- | ----------- | ------------- | ---------------- | ------------------ | -------- |
| 동적 배열        | O(1)        | O(n)          | 끝 상각 O(1)     | 끝 O(1), 중간 O(n) | O(n)     |
| 스택 / 큐        | -           | O(n)          | O(1)             | O(1)               | O(n)     |
| 단일 연결 리스트 | O(k)        | O(n)          | 맨 앞 O(1)       | 맨 앞 O(1)         | O(n)     |
| 이중 연결 리스트 | O(k)        | O(n)          | 노드를 알면 O(1) | 노드를 알면 O(1)   | O(n)     |
| 균형 BST         | O(log n)*   | O(log n)      | O(log n)         | O(log n)           | O(log n) |
| 힙               | -           | O(n)          | O(log n)         | 최솟값 O(log n)    | **O(1)** |
| 해시 맵          | -           | **O(1)** 평균 | 상각 O(1)        | O(1) 평균          | O(n)     |
| LRU 캐시(오늘)   | -           | O(1) 평균     | O(1) 평균        | O(1) 평균          | -        |

\* 서브트리 크기를 저장한 경우입니다.

## 11. 세 언어의 표준 도구

| 자료구조         | C                        | Python                           | Rust                              |
| ---------------- | ------------------------ | -------------------------------- | --------------------------------- |
| 동적 배열 / 스택 | 직접(`malloc`/`realloc`) | `list`                           | `Vec<T>`                          |
| 큐 / 덱          | 직접(원형 버퍼)          | `collections.deque`              | `VecDeque<T>`                     |
| 연결 리스트      | 직접(구조체 + 포인터)    | 직접(드묾)                       | `LinkedList<T>`(드묾)             |
| 정렬된 맵 / 집합 | 직접                     | 없음(`bisect`로 정렬 리스트)     | `BTreeMap`, `BTreeSet`            |
| 우선순위 큐      | 직접(배열 힙)            | `heapq` (최소 힙)                | `BinaryHeap` (최대 힙), `Reverse` |
| 해시 맵 / 집합   | 직접                     | `dict`, `set`, `Counter`         | `HashMap`, `HashSet`              |
| 순서 있는 사전   | 직접                     | `dict`(넣은 순서), `OrderedDict` | 외부 라이브러리                   |
| 그래프           | 배열·구조체로 직접       | `dict`/`list`의 인접 목록        | `Vec<Vec<usize>>`, `HashMap`      |

C는 표준 라이브러리가 작아서 대부분 직접 만들어야 하지만, 그만큼 **원리가 코드에 그대로 드러납니다.** 이번 Phase에서 C로 직접 만든 경험이 Python과 Rust의 도구를 이해하는 바탕이 됩니다.

## 12. 자주 하는 실수

### 실수 1: 조합한 두 자료구조 중 하나만 고친다

LRU에서 리스트의 노드만 떼고 해시 맵에 키를 남기면, 다음 `get`이 이미 리스트에 없는 노드를 찾아 순서를 망가뜨립니다. 반대로 해시 맵에서만 지우면 리스트에 "유령 노드"가 남습니다. **모든 연산에서 두 자료구조를 함께** 고치고, 불변식(키 수가 같다)을 확인하세요.

### 실수 2: 자료구조를 바꾼 뒤 예전에 구한 위치를 쓴다

실습의 디버그 문제입니다. 배열 원소를 밀어서 옮긴 뒤 옮기기 전의 인덱스로 값을 읽으면 **다른 원소**를 읽습니다. 벡터에 원소를 넣어 공간이 재할당된 뒤 예전 포인터를 쓰는 것(C의 매달린 포인터, Rust가 빌림 검사로 막는 상황)도 같은 종류의 실수입니다.

### 실수 3: FIFO와 LRU를 헷갈린다

FIFO 캐시는 **먼저 들어온 것**을 버리고, LRU는 **가장 오래 쓰지 않은 것**을 버립니다. 8절 추적에서 FIFO였다면 `put D`에서 A가 버려졌을 것입니다. `get`이 순서를 갱신하는지가 둘을 가릅니다.

### 실수 4: 작은 데이터에 복잡한 자료구조를 쓴다

원소가 10개뿐인 목록에서 해시 맵 + 연결 리스트를 쓰는 것은 과한 설계일 수 있습니다. 배열을 훑는 O(n)이 실제로는 더 빠르고 버그도 적습니다. 실습의 직접 구현 문제처럼 **규모에 맞는 단순한 조합**을 고르는 것도 좋은 설계입니다.

### 실수 5: 해시 맵의 순서에 기대는 코드를 쓴다

```python
# 파일: set_order.py
words = {"banana", "apple", "cherry"}
print(sorted(words))           # 정렬하면 항상 같다
print(len(words), "apple" in words)
```

실행 결과:

```text
['apple', 'banana', 'cherry']
3 True
```

Python `set`과 Rust `HashMap`·`HashSet`은 순회 순서를 보장하지 않고, 실행할 때마다 달라질 수도 있습니다. 결과를 출력하거나 비교할 때는 **정렬**하세요. 순서가 필요하면 순서를 보장하는 자료구조(Python `dict`, `BTreeMap`, 리스트)를 고릅니다.

## 13. Q&A

**Q. LRU 말고 다른 캐시 교체 규칙도 있나요?**

A. 있습니다. **LFU**(가장 적게 쓴 것을 버림), **FIFO**(먼저 들어온 것을 버림), **무작위** 등이 있습니다. LFU는 사용 횟수를 세야 하므로 해시 맵 + 힙이나, 횟수별 연결 리스트를 조합해 만듭니다. 어떤 규칙이 좋은지는 데이터 사용 패턴에 따라 다릅니다.

**Q. 자료구조를 조합하는 다른 유명한 예가 있나요?**

A. 해시 맵 + 힙(작업 스케줄러에서 작업 ID로 찾고 우선순위로 꺼내기), 트리 + 해시 맵(파일 시스템의 경로 검색), 그래프 + 힙(Day 82의 다익스트라), 해시 맵 + 배열(원소를 O(1)에 넣고 빼고 무작위로 뽑기) 등이 있습니다. 공통점은 "한 자료구조가 약한 연산을 다른 자료구조가 맡는다"는 것입니다.

**Q. 이번 Phase에서 가장 중요한 것 하나만 꼽는다면요?**

A. **"연산에서 출발해 자료구조를 고른다"** 는 습관입니다. 같은 데이터라도 어떤 질문을 자주 하느냐에 따라 알맞은 저장 방법이 달라집니다. 다음 Phase 7(알고리즘)에서는 이렇게 저장한 데이터를 **어떻게 빠르게 처리하는지**를 배웁니다.

## 14. 핵심 요약

- 자료구조는 **필요한 연산**으로 고릅니다. 가장 자주 하는 연산이 빠른 것을 찾으세요.
- 스택(최근 것), 큐(먼저 온 것), 원형 버퍼(고정 공간), 연결 리스트(알고 있는 위치의 삽입·삭제), BST(정렬·범위), 힙(가장 작은 것), 해시 맵(키로 찾기), 그래프(관계)를 구별하세요.
- 한 자료구조로 부족하면 **조합**합니다. LRU 캐시는 해시 맵(키 → 노드) + 이중 연결 리스트(사용 순서)로 모든 연산을 O(1)에 합니다.
- 조합한 자료구조는 **두 부분을 항상 함께** 고쳐 불변식을 지켜야 합니다.
- C는 직접, Python은 `dict`·`deque`·`heapq`·`OrderedDict`, Rust는 `HashMap`·`VecDeque`·`BinaryHeap`·`BTreeMap`을 씁니다.
- 데이터가 작다면 단순한 배열이 가장 좋은 선택일 수 있습니다.

## 15. 도전 문제

1. **(C)** LRU 캐시의 용량을 실행 중에 정할 수 있도록 노드 배열과 버킷 배열을 `malloc`으로 할당하고, 캐시를 다 쓴 뒤 해제하는 `lru_free`를 만드세요.
2. **(Python)** LRU 캐시에 **적중률**(get이 성공한 비율)을 세는 기능을 추가하고, 용량 2, 3, 4에서 같은 요청 순서의 적중률을 비교해 보세요.
3. **(Rust)** LRU 캐시를 제네릭 `LruCache<K: Hash + Eq + Clone, V>`로 바꿔 문자열뿐 아니라 정수 키도 쓸 수 있게 해 보세요.
4. **(세 언어)** 작업 관리자를 설계해 보세요. 작업 ID로 찾기(해시 맵), 우선순위가 가장 높은 작업 꺼내기(힙), 완료한 작업 최근 3개 보기(원형 버퍼)를 모두 지원해야 합니다. 먼저 필요한 연산과 고른 자료구조를 표로 정리한 뒤 구현하세요.
