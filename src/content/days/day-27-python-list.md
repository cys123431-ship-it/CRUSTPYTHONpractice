---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-27-python-list
courseId: crp-92
phaseId: phase-03
dayNumber: 27
date: "2026-10-27"
title: 늘고 줄어드는 목록 — Python 리스트 다루기
summary: 크기가 늘고 줄어드는 Python 리스트의 추가(append, insert, extend)와 삭제(pop, remove, del), 자르기(슬라이싱 [시작:끝:간격]), 조건에 맞는 값으로 새 리스트를 만드는 리스트 컴프리헨션, 새 리스트를 돌려주는 sorted와 제자리 정렬 sort, 여러 목록을 나란히 도는 zip을 배웁니다. 같은 일을 C에서는 고정 배열과 길이 변수로 칸을 밀고 당기며 직접 구현하고, Rust에서는 Vec으로 합니다. 중간 삽입·삭제가 왜 뒤의 모든 칸을 옮기는지, 반복하면서 목록을 바꾸면 왜 값을 건너뛰는지, [[0] * 3] * 2가 왜 줄을 공유하는지 확인하고, 성적 순위표를 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 100
prerequisites: [day-26-c-array]
learningObjectives:
  - append, insert, extend, pop, remove로 리스트에 값을 넣고 빼며 길이 변화를 추적한다.
  - 슬라이싱 [시작:끝:간격]으로 부분 목록, 거꾸로 된 목록, 복사본을 만든다.
  - 리스트 컴프리헨션으로 걸러 내고 바꾼 새 리스트를 만든다.
  - sorted와 sort의 차이, key로 정렬 기준을 정하는 방법을 쓴다.
  - C의 고정 배열로 삽입·삭제를 직접 구현해 중간 삽입·삭제에 드는 비용을 설명하고, Rust Vec으로 같은 연산을 한다.
concepts:
  [
    list,
    append,
    insert,
    pop,
    remove,
    slicing,
    list comprehension,
    sorted,
    sort key,
    zip,
    dynamic array,
    shifting,
  ]
runnerMode: python
playgroundSource: |
  # 파일: lists.py — 리스트를 바꿔 가며 결과를 보세요.
  nums = [5, 3, 8, 1, 9, 2, 7]
  print(nums[1:4], nums[::-1], nums[-3:])
  print([n * n for n in nums if n % 2 == 1])
  nums.append(4)
  nums.insert(0, 0)
  print(nums, nums.pop(), nums)
  print(sorted(nums), nums)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day27-predict-py
    title: 슬라이싱 예측하기
    kind: predict
    objective: "[시작:끝]과 음수 간격 슬라이싱의 결과를 예측한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      a = [10, 20, 30, 40, 50]
      print(a[1:3], a[::-2])
    answer: "[20, 30] [50, 30, 10]"
    hint: "[1:3]은 1번부터 3번 앞(2번)까지입니다. [::-2]는 끝에서부터 2칸씩 거꾸로 갑니다."
    explanation: "자르기의 끝은 포함하지 않아서 a[1:3]은 a[1], a[2]입니다(range와 같은 반열린 구간). 간격이 음수면 시작 기본값이 마지막 칸이 되어 50, 30, 10입니다. 자르기는 항상 새 리스트를 만들고 원본은 그대로입니다."
    commonMistakes:
      - "a[1:3]에 a[3]까지 넣어 [20, 30, 40]으로 적음"
      - "[::-2]를 [40, 20]으로 적음(시작이 마지막 칸 50임)"
    language: python
    verification: run
  - id: ex-day27-predict-c
    title: 배열에 끼워 넣기 예측하기
    kind: predict
    objective: 중간 삽입이 뒤의 칸을 한 칸씩 미는 과정을 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a[5] = {1, 2, 3};
          int len = 3;
          int pos = 1, x = 9;
          for (int i = len; i > pos; i--) {
              a[i] = a[i - 1];
          }
          a[pos] = x;
          len++;
          for (int i = 0; i < len; i++) {
              printf("%d ", a[i]);
          }
          printf("\n");
          return 0;
      }
    answer: "1 9 2 3"
    hint: "뒤에서부터 a[3] = a[2], a[2] = a[1]로 밀고, 빈 a[1]에 9를 넣습니다."
    explanation: "앞에서부터 밀면 a[2] = a[1]이 a[2]를 덮어써서 값을 잃습니다. 그래서 뒤에서부터 옮깁니다. 중간에 하나를 넣으려면 그 뒤의 모든 칸을 옮겨야 하므로, 목록이 길수록 오래 걸립니다. Python의 insert도 속으로는 같은 일을 합니다."
    commonMistakes:
      - "끼워 넣은 칸의 값을 덮어쓴다고 생각해 1 9 3으로 적음"
      - "len을 늘리지 않아 마지막 값이 출력되지 않는다고 생각함(여기서는 늘림)"
    language: c
    verification: run
  - id: ex-day27-fill
    title: Rust Vec 끝에 값 넣기
    kind: fill
    objective: Vec의 맨 뒤에 값을 추가하는 메서드를 쓴다.
    prompt: "빈칸을 채워 '[1, 2, 3, 4]'가 출력되게 하세요."
    starter: |-
      fn main() {
          let mut v = vec![1, 2, 3];
          v._____(4);
          println!("{v:?}");
      }
    answer: |-
      fn main() {
          let mut v = vec![1, 2, 3];
          v.push(4);
          println!("{v:?}");
      }
    output: "[1, 2, 3, 4]"
    hint: "Python의 append에 해당하는 Rust Vec 메서드입니다."
    explanation: "push는 맨 뒤에 추가하고, pop은 맨 뒤를 꺼내 Option으로 돌려줍니다. 둘 다 뒤의 칸만 다뤄서 빠릅니다. Vec을 바꾸므로 let mut로 만들어야 합니다."
    commonMistakes:
      - "append를 써서 오류가 남(Rust의 append는 다른 Vec을 통째로 옮겨 붙이는 메서드)"
      - "v를 mut 없이 만들어 E0596 오류가 남"
    language: rust
    verification: run
  - id: ex-day27-modify
    title: 반복문을 리스트 컴프리헨션으로 바꾸기
    kind: modify
    objective: 걸러 내고 바꾸는 반복을 컴프리헨션 한 줄로 쓴다.
    prompt: "1~6 중 짝수의 제곱을 모으는 네 줄짜리 반복을 리스트 컴프리헨션 한 줄로 바꾸세요. '[4, 16, 36]'이 출력되어야 합니다."
    starter: |-
      result = []
      for n in range(1, 7):
          if n % 2 == 0:
              result.append(n * n)
      print(result)
    answer: |-
      result = [n * n for n in range(1, 7) if n % 2 == 0]
      print(result)
    output: "[4, 16, 36]"
    hint: "[만들 값 for 변수 in 반복할 것 if 조건] 모양입니다."
    explanation: "컴프리헨션은 '빈 리스트를 만들고, 돌면서, 조건에 맞으면 append'하는 흔한 모양을 한 줄로 줄입니다. 식이라서 바로 대입하거나 함수에 넘길 수 있습니다. 조건이나 계산이 복잡해지면 읽기 어려우니 반복문으로 되돌리세요. Rust의 filter + map + collect가 같은 일입니다."
    commonMistakes:
      - "if를 for 앞에 써서 SyntaxError가 남"
      - "range(1, 6)으로 써서 6이 빠짐"
    language: python
    verification: run
  - id: ex-day27-debug
    title: 반복하면서 지우는 버그 고치기
    kind: debug
    objective: 반복 중에 리스트를 바꾸면 값을 건너뛴다는 것을 확인하고 새 리스트로 고친다.
    prompt: "리스트의 2를 모두 지우려 했는데 '[1, 3, 2, 4]'가 출력됩니다. 새 리스트를 만드는 방법으로 고쳐 '[1, 3, 4]'가 나오게 하세요."
    starter: |-
      nums = [1, 2, 2, 3, 2, 4]
      for n in nums:
          if n == 2:
              nums.remove(n)
      print(nums)
    answer: |-
      nums = [1, 2, 2, 3, 2, 4]
      nums = [n for n in nums if n != 2]
      print(nums)
    output: "[1, 3, 4]"
    starterOutput: "[1, 3, 2, 4]"
    hint: "for는 내부적으로 '몇 번째 칸까지 봤는지'를 세며 돕니다. 앞의 칸을 지우면 뒤의 값들이 한 칸씩 당겨져서, 바로 다음 값을 건너뛰게 됩니다."
    explanation: "두 번째 칸의 2를 지우면 세 번째 칸이던 2가 두 번째 칸으로 당겨지는데, 반복은 이미 두 번째 칸을 봤으므로 다음인 세 번째 칸(3)으로 넘어갑니다. 반복 중에 목록을 바꾸지 말고, 남길 값만 모은 새 리스트를 만드세요. Rust는 반복 중에 Vec을 바꾸는 코드를 빌림 규칙으로 막고, retain을 제공합니다."
    commonMistakes:
      - "while 2 in nums: nums.remove(2)로 고쳐 동작은 하지만 느림(매번 처음부터 찾음)"
      - "for n in nums[:]로 복사본을 도는 것은 되지만 이유를 모름"
    language: python
    verification: run
  - id: ex-day27-independent
    title: Rust로 순서를 지키며 중복 없애기
    kind: independent
    objective: 새 Vec에 처음 나온 값만 담아 중복을 없앤다.
    prompt: "[3, 1, 3, 2, 1, 4]에서 처음 나온 순서는 유지하고 중복만 없애 '[3, 1, 2, 4]'를 출력하세요."
    starter: |-
      fn main() {
          let nums = vec![3, 1, 3, 2, 1, 4];
          println!("{nums:?}");
      }
    answer: |-
      fn main() {
          let nums = vec![3, 1, 3, 2, 1, 4];
          let mut unique = Vec::new();
          for n in nums {
              if !unique.contains(&n) {
                  unique.push(n);
              }
          }
          println!("{unique:?}");
      }
    output: "[3, 1, 2, 4]"
    hint: "빈 Vec을 만들고, 값마다 이미 들어 있는지(contains) 확인한 뒤 없을 때만 push하세요."
    explanation: "contains는 앞에서부터 비교하므로 목록이 길면 느려집니다(n개에 대해 n번씩, Day 71의 O(n²)). 큰 데이터라면 이미 본 값을 해시 집합(HashSet, Day 67)에 기억해 두면 빠릅니다. sort 후 dedup으로도 중복을 없앨 수 있지만 순서가 바뀝니다."
    commonMistakes:
      - "unique를 mut 없이 만듦"
      - "contains(n)처럼 &를 빠뜨려 자료형 오류가 남"
    language: rust
    verification: run
quiz:
  - id: quiz-day27-01
    question: a = [1, 2, 3]일 때 a.append([4, 5])와 a.extend([4, 5])의 결과는?
    choices:
      - 둘 다 [1, 2, 3, 4, 5]
      - "append는 [1, 2, 3, [4, 5]], extend는 [1, 2, 3, 4, 5]"
      - "append는 [1, 2, 3, 4, 5], extend는 [1, 2, 3, [4, 5]]"
      - 둘 다 오류
    answerIndex: 1
    explanation: append는 받은 것 하나를 통째로 한 칸에 넣고, extend는 받은 목록의 값들을 하나씩 이어 붙입니다. a += [4, 5]는 extend와 같습니다.
  - id: quiz-day27-02
    question: sorted(nums)와 nums.sort()의 차이는?
    choices:
      - 차이가 없다
      - sorted는 정렬된 새 리스트를 돌려주고 원본은 그대로, sort는 원본을 제자리에서 정렬하고 None을 돌려준다
      - sort는 새 리스트를 만든다
      - sorted는 내림차순만 된다
    answerIndex: 1
    explanation: nums = nums.sort()라고 쓰면 nums가 None이 되어 버리는 흔한 실수가 있습니다. 원본이 필요하면 sorted, 원본을 바꿔도 되면 sort를 씁니다. 둘 다 key=와 reverse=를 받습니다.
  - id: quiz-day27-03
    question: 길이 n인 리스트의 맨 앞에 insert(0, x)를 하는 것이 append(x)보다 느린 이유는?
    choices:
      - 맨 앞은 메모리가 부족해서
      - 기존의 n개 값을 모두 한 칸씩 뒤로 옮겨야 해서
      - insert는 정렬을 함께 해서
      - 차이가 없다
    answerIndex: 1
    explanation: 리스트는 속이 배열이라 값이 나란히 붙어 있습니다. 앞에 끼우려면 뒤의 모든 칸을 밀어야 합니다(5절 C 코드). 맨 뒤 추가는 옮길 것이 없어 빠릅니다. 앞뒤 모두에서 빠르게 넣고 빼려면 deque(Day 59)를 씁니다.
  - id: quiz-day27-04
    question: grid = [[0] * 3] * 2에서 grid[0][0] = 1을 하면?
    choices:
      - "[[1, 0, 0], [0, 0, 0]]"
      - "[[1, 0, 0], [1, 0, 0]]"
      - 오류
      - "[[1, 1, 1], [0, 0, 0]]"
    answerIndex: 1
    explanation: 바깥 * 2는 안쪽 리스트를 복사하지 않고 같은 리스트를 두 번 가리키게 합니다. 그래서 한 줄을 바꾸면 두 줄이 함께 바뀝니다. 줄마다 새 리스트를 만들려면 [[0] * 3 for _ in range(2)]를 씁니다(Day 31).
  - id: quiz-day27-05
    question: Rust에서 Vec의 pop()이 i32가 아니라 Option<i32>를 돌려주는 이유는?
    choices:
      - 더 빠르게 하려고
      - Vec이 비어 있으면 꺼낼 값이 없으므로, 그 경우를 None으로 알려 주려고
      - 정수를 두 번 꺼내려고
      - 오류를 숨기려고
    answerIndex: 1
    explanation: Python의 빈 리스트 pop()은 IndexError를 던지지만, Rust는 '값이 없을 수 있다'를 자료형으로 드러냅니다. while let Some(x) = v.pop()처럼 비워 가며 처리하는 모양에 딱 맞습니다(Day 57 스택).
---

## 1. 오늘 배울 내용

Day 26의 C 배열은 크기가 고정이었습니다. Python의 **리스트**는 값을 넣고 빼면 크기가 **저절로** 늘고 줄어듭니다. 오늘은 리스트의 기능을 익히고, 같은 일을 C와 Rust로 하면서 리스트 안에서 무슨 일이 일어나는지 알아봅니다.

1. 추가와 삭제의 도구를 익히고, 길이 변화를 추적합니다.
   - 추가: `append`, `insert`, `extend`
   - 삭제: `pop`, `remove`, `del`
2. **자르기(slicing)** `[시작:끝:간격]`으로 부분 목록, 거꾸로 된 목록, 복사본을 만듭니다.
3. **리스트 컴프리헨션**으로 걸러 내고 바꾼 새 리스트를 한 줄로 만듭니다.
4. `sorted`(새 리스트)와 `sort`(제자리), `key`로 정렬 기준을 정합니다.
5. `zip`과 `enumerate`로 여러 목록을 나란히 돕니다.
6. C의 고정 배열로 삽입과 삭제를 **직접** 구현하고, Rust `Vec`으로 같은 연산을 합니다.
7. 흔한 함정 두 가지를 확인합니다.
   - 반복하면서 목록을 바꾸면 값을 건너뜁니다.
   - `[[0] * 3] * 2`는 줄을 공유합니다.

## 2. 왜 필요한가

실제 데이터는 개수를 미리 알 수 없습니다. 할 일 목록은 하나씩 늘었다 줄고, 파일에서 읽은 줄 수는 파일마다 다르며, 조건에 맞는 학생이 몇 명일지는 걸러 봐야 압니다. 크기가 변하는 목록이 필요합니다.

리스트는 편리하지만 **모든 연산이 똑같이 빠르지는 않습니다**. 맨 뒤에 넣고 빼는 것은 빠르지만, 맨 앞에 넣거나 중간에서 지우면 뒤의 값들을 모두 옮겨야 합니다. C로 직접 구현해 보면 그 이유가 보이고, 나중에 스택·큐·연결 리스트(Day 57~62)가 왜 필요한지도 알 수 있습니다.

## 3. 그림으로 이해하기

리스트의 속은 **여유 칸이 있는 배열**입니다. 실제 값이 든 칸 수(길이)와 준비된 칸 수(용량)가 따로 있습니다.

```text
길이 3, 용량 8
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ 5  │ 3  │ 8  │    │    │    │    │    │
└────┴────┴────┴────┴────┴────┴────┴────┘
  0    1    2   ↑ append는 여기에 바로 넣는다(빠름)

insert(1, 7): 1번 뒤를 한 칸씩 밀고 넣는다(느림)
┌────┬────┬────┬────┬────┐
│ 5  │ 7  │ 3  │ 8  │    │    3 → 한 칸 뒤로, 8 → 한 칸 뒤로
└────┴────┴────┴────┴────┘
```

용량이 가득 차면 더 큰 배열(보통 약 1.5~2배)을 새로 준비하고 값을 모두 옮깁니다. 가끔 한 번 크게 옮기지만, 평균으로 보면 `append`는 여전히 빠릅니다.

**자르기**는 반열린 구간으로 칸을 고릅니다.

```text
nums =   [ 5,  3,  8,  1,  9,  2,  7 ]
인덱스     0   1   2   3   4   5   6
음수      -7  -6  -5  -4  -3  -2  -1

nums[1:4]  →  [3, 8, 1]       (1, 2, 3번. 4번은 포함 안 함)
nums[:3]   →  [5, 3, 8]       (처음부터 3번 앞까지)
nums[-3:]  →  [9, 2, 7]       (뒤에서 3개)
nums[::2]  →  [5, 8, 9, 7]    (2칸 간격)
nums[::-1] →  [7, 2, 9, 1, 8, 3, 5]   (거꾸로)
```

## 4. 천천히 풀어보기

### 4.1 넣기와 빼기

| 하고 싶은 일         | Python                 | Rust `Vec`                      | C(고정 배열 + 길이)     | 빠르기          |
| -------------------- | ---------------------- | ------------------------------- | ----------------------- | --------------- |
| 맨 뒤에 추가         | `a.append(x)`          | `v.push(x)`                     | `a[len++] = x`          | 빠름            |
| i번 위치에 끼워 넣기 | `a.insert(i, x)`       | `v.insert(i, x)`                | 뒤에서부터 한 칸씩 밀기 | 뒤의 칸 수만큼  |
| 여러 개 이어 붙이기  | `a.extend(b)`          | `v.extend(b)`                   | 반복으로 추가           | 붙이는 개수만큼 |
| 맨 뒤 꺼내기         | `a.pop()`              | `v.pop()` → `Option`            | `a[--len]`              | 빠름            |
| i번 꺼내기           | `a.pop(i)`             | `v.remove(i)`                   | 앞으로 한 칸씩 당기기   | 뒤의 칸 수만큼  |
| 값으로 찾아 지우기   | `a.remove(x)`          | `v.retain(\|&y\| y != x)`(모두) | 찾기 + 당기기           | 전체 길이만큼   |
| 비었는지             | `not a`, `len(a) == 0` | `v.is_empty()`                  | `len == 0`              | 빠름            |

빈 리스트에서 `pop()`하면 Python은 `IndexError`, Rust는 `None`을 돌려줍니다. `remove(x)`는 **처음 나온** `x` 하나만 지우고, 없으면 `ValueError`입니다.

### 4.2 자르기

`a[시작:끝:간격]`의 세 값은 모두 생략할 수 있습니다. 시작 기본값은 처음(간격이 음수면 끝), 끝 기본값은 끝(간격이 음수면 처음), 간격 기본값은 1입니다.

- 자르기는 항상 **새 리스트**를 만듭니다. 원본은 바뀌지 않습니다.
- 범위를 벗어난 자르기는 오류가 아니라 **있는 만큼만** 돌려줍니다(`a[2:100]`).
- `a[:]`는 전체를 복사한 새 리스트입니다(얕은 복사, Day 31).

Rust는 `&v[1..4]`처럼 **슬라이스**(원본의 일부를 빌려 보는 것)를 만듭니다. 복사하지 않아서 빠르지만, 범위를 벗어나면 패닉입니다. 간격이나 거꾸로 보기는 반복자(`step_by`, `rev`)로 합니다.

### 4.3 리스트 컴프리헨션

```text
[만들 값  for 변수 in 반복할_것  if 조건]
 n * n    for n in nums         if n % 2 == 1

→ nums의 각 n에 대해, 홀수이면 n * n을 모은 새 리스트
```

Rust로는 반복자 사슬을 씁니다.

```rust
nums.iter().filter(|&&n| n % 2 == 1).map(|&n| n * n).collect::<Vec<i32>>()
//          조건                       만들 값             새 Vec으로 모으기
```

### 4.4 정렬

| 도구                                       | 원본        | 돌려주는 것      |
| ------------------------------------------ | ----------- | ---------------- |
| `sorted(a)`                                | 그대로      | 새 정렬된 리스트 |
| `a.sort()`                                 | 제자리 정렬 | `None`           |
| `sorted(a, reverse=True)`                  | 그대로      | 내림차순         |
| `sorted(records, key=lambda r: r[1])`      | 그대로      | 두 번째 값 기준  |
| Rust `v.sort()`, `v.sort_by(\|a, b\| ...)` | 제자리      | `()`             |

Python과 Rust의 정렬은 **안정 정렬**입니다. 기준 값이 같은 원소는 원래 순서를 유지합니다. 9절에서 85점인 두 학생의 순서가 그대로인 것을 확인합니다. 정렬 알고리즘 자체는 Day 73~77에서 배웁니다.

## 5. C로 구현하기

C에는 리스트가 없습니다. 칸을 넉넉히 준비한 배열과 **실제로 쓰는 칸 수(`len`)** 를 함께 관리해 리스트를 흉내 냅니다. `insert_at`과 `remove_at`에서 칸을 밀고 당기는 반복이 리스트 연산의 "숨은 비용"입니다.

```c
// 파일: list_ops.c
#include <stdio.h>
#include <stdbool.h>

#define CAP 10

int items[CAP];                             // 칸은 10개 준비하고
int len = 0;                                // 실제로 쓰는 칸 수를 따로 센다

bool append(int x) {
    if (len == CAP) {
        return false;                       // 가득 참
    }
    items[len++] = x;
    return true;
}

bool insert_at(int pos, int x) {
    if (len == CAP || pos < 0 || pos > len) {
        return false;
    }
    for (int i = len; i > pos; i--) {       // 뒤에서부터 한 칸씩 오른쪽으로 민다
        items[i] = items[i - 1];
    }
    items[pos] = x;
    len++;
    return true;
}

int remove_at(int pos) {                    // pos가 올바르다고 가정
    int value = items[pos];
    for (int i = pos; i < len - 1; i++) {   // 뒤의 칸들을 한 칸씩 왼쪽으로 당긴다
        items[i] = items[i + 1];
    }
    len--;
    return value;
}

int find(int x) {
    for (int i = 0; i < len; i++) {
        if (items[i] == x) {
            return i;
        }
    }
    return -1;
}

void print_list(const char *label) {
    printf("%s [", label);
    for (int i = 0; i < len; i++) {
        printf(i == 0 ? "%d" : ", %d", items[i]);
    }
    printf("] 길이 %d\n", len);
}

int main(void) {
    append(5);
    append(3);
    append(8);
    print_list("append 세 번:");
    insert_at(0, 1);
    insert_at(2, 7);
    print_list("insert 두 번:");
    int removed = remove_at(1);
    printf("remove_at(1)로 꺼낸 값: %d\n", removed);
    print_list("remove 뒤:");
    printf("8의 위치: %d, 99의 위치: %d\n", find(8), find(99));
    printf("[1:3] 부분:");
    for (int i = 1; i < 3; i++) {           // 자르기는 범위를 정해 도는 것
        printf(" %d", items[i]);
    }
    printf("\n");
    return 0;
}
```

실행 결과:

```text
append 세 번: [5, 3, 8] 길이 3
insert 두 번: [1, 5, 7, 3, 8] 길이 5
remove_at(1)로 꺼낸 값: 5
remove 뒤: [1, 7, 3, 8] 길이 4
8의 위치: 3, 99의 위치: -1
[1:3] 부분: 7 3
```

### 코드 한 부분씩 읽기

| 코드                                                           | 설명                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `int items[CAP]; int len = 0;`                                 | 용량 10칸을 준비하고, 쓰는 칸 수를 따로 셉니다. `items[len]`부터는 "빈 칸"으로 취급합니다.                                                 |
| `items[len++] = x;`                                            | 현재 끝(`len`번 칸)에 넣고 `len`을 1 늘립니다. `len++`는 값을 쓴 **뒤에** 늘어납니다(Day 5).                                               |
| `if (len == CAP) return false;`                                | 칸이 모자라면 실패를 알립니다. Python 리스트는 이때 더 큰 배열로 옮겨 가지만, 고정 배열로는 할 수 없습니다(Day 40에서 `realloc`으로 해결). |
| `for (int i = len; i > pos; i--) items[i] = items[i - 1];`     | **뒤에서부터** 한 칸씩 오른쪽으로 밉니다. 앞에서부터 밀면 값을 덮어써서 잃습니다.                                                          |
| `for (int i = pos; i < len - 1; i++) items[i] = items[i + 1];` | 지운 자리부터 **앞으로** 한 칸씩 당깁니다.                                                                                                 |
| `printf(i == 0 ? "%d" : ", %d", items[i]);`                    | 첫 값 앞에는 쉼표를 붙이지 않도록 서식 문자열을 조건 연산자로 골랐습니다.                                                                  |
| `for (int i = 1; i < 3; i++)`                                  | Python의 `items[1:3]`에 해당합니다. C의 자르기는 "그 범위를 돈다"입니다.                                                                   |

## 6. Python으로 구현하기

```python
# 파일: lists.py
todo = []                                   # 빈 리스트
todo.append("장보기")                        # 맨 뒤에 추가
todo.append("운동")
todo.insert(0, "기상")                       # 0번 위치에 끼워 넣기
todo.extend(["독서", "일기"])                 # 여러 개를 한꺼번에 뒤에
print(todo, len(todo))
last = todo.pop()                           # 맨 뒤를 꺼내며 지운다
first = todo.pop(0)                         # 0번을 꺼내며 지운다
print("pop:", last, first, todo)
todo.remove("운동")                          # 값으로 찾아 지운다
print("remove 뒤:", todo)

nums = [5, 3, 8, 1, 9, 2, 7]
print(nums[1:4], nums[:3], nums[4:])        # 자르기: [시작:끝] (끝은 포함 안 함)
print(nums[::2], nums[::-1], nums[-3:])     # 간격, 거꾸로, 뒤에서 3개
squares = [n * n for n in nums if n % 2 == 1]
print("홀수의 제곱:", squares)
print("sorted:", sorted(nums), "원본:", nums)
nums.sort(reverse=True)                     # 원본을 제자리에서 정렬
print("sort 뒤:", nums)
print(3 in nums, nums.count(8), nums.index(9))

names = ["민지", "준호", "서연"]
scores = [92, 78, 85]
for i, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"{i}. {name} {score}")

bad = [[0] * 3] * 2                         # 같은 줄 하나를 두 번 가리킨다
bad[0][0] = 1
good = [[0] * 3 for _ in range(2)]          # 줄마다 새 리스트
good[0][0] = 1
print("bad:", bad, " good:", good)
```

실행 결과:

```text
['기상', '장보기', '운동', '독서', '일기'] 5
pop: 일기 기상 ['장보기', '운동', '독서']
remove 뒤: ['장보기', '독서']
[3, 8, 1] [5, 3, 8] [9, 2, 7]
[5, 8, 9, 7] [7, 2, 9, 1, 8, 3, 5] [9, 2, 7]
홀수의 제곱: [25, 9, 1, 81, 49]
sorted: [1, 2, 3, 5, 7, 8, 9] 원본: [5, 3, 8, 1, 9, 2, 7]
sort 뒤: [9, 8, 7, 5, 3, 2, 1]
True 1 0
1. 민지 92
2. 준호 78
3. 서연 85
bad: [[1, 0, 0], [1, 0, 0]]  good: [[1, 0, 0], [0, 0, 0]]
```

### 코드 한 부분씩 읽기

| 코드                                        | 설명                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `todo.insert(0, "기상")`                    | 맨 앞에 넣으면 기존 값들이 모두 한 칸씩 밀립니다.                                                                                   |
| `todo.extend(["독서", "일기"])`             | 두 값을 차례로 이어 붙입니다. `append`였다면 리스트 하나가 한 칸에 통째로 들어갑니다.                                               |
| `last = todo.pop()` / `first = todo.pop(0)` | 꺼낸 값을 돌려주면서 지웁니다. `pop(0)`은 뒤의 값들을 당겨야 해서 `pop()`보다 느립니다.                                             |
| `todo.remove("운동")`                       | 값으로 찾아 **처음 것 하나**를 지웁니다.                                                                                            |
| `[n * n for n in nums if n % 2 == 1]`       | 홀수만 골라 제곱한 새 리스트입니다.                                                                                                 |
| `sorted(nums)` / `nums.sort(reverse=True)`  | 앞은 새 리스트, 뒤는 원본을 바꿉니다. 그래서 그다음 줄의 `nums.index(9)`는 내림차순으로 정렬된 뒤의 위치 0입니다.                   |
| `zip(names, scores)`                        | 두 목록의 같은 위치 값을 짝지어 줍니다. `enumerate(..., start=1)`로 번호까지 붙였습니다. 괄호 `(name, score)`로 짝을 풀어 받습니다. |
| `[[0] * 3] * 2`                             | 안쪽 리스트 **하나**를 두 번 가리키게 됩니다. `bad[0][0] = 1`이 두 줄 모두에 보입니다.                                              |
| `[[0] * 3 for _ in range(2)]`               | 줄마다 컴프리헨션이 새 리스트를 만듭니다.                                                                                           |

## 7. Rust로 구현하기

Rust의 **`Vec<T>`** 가 Python 리스트에 해당합니다. 같은 자료형의 값만 담고, 크기가 늘고 줄어듭니다. Day 28에서 더 자세히 복습합니다.

```rust
// 파일: vec_ops.rs
fn main() {
    let mut todo: Vec<&str> = Vec::new();
    todo.push("장보기");
    todo.push("운동");
    todo.insert(0, "기상");
    todo.extend(["독서", "일기"]);
    println!("{todo:?} {}", todo.len());
    let last = todo.pop();                  // Option: 비어 있으면 None
    let first = todo.remove(0);             // 값을 돌려주며 지운다(없는 위치면 패닉)
    println!("pop: {last:?} {first} {todo:?}");
    todo.retain(|&t| t != "운동");           // 조건을 만족하는 것만 남긴다
    println!("retain 뒤: {todo:?}");

    let nums = vec![5, 3, 8, 1, 9, 2, 7];
    println!("{:?} {:?} {:?}", &nums[1..4], &nums[..3], &nums[4..]);
    let every_other: Vec<i32> = nums.iter().step_by(2).copied().collect();
    let reversed: Vec<i32> = nums.iter().rev().copied().collect();
    println!("{every_other:?} {reversed:?} {:?}", &nums[nums.len() - 3..]);
    let squares: Vec<i32> = nums.iter().filter(|&&n| n % 2 == 1).map(|&n| n * n).collect();
    println!("홀수의 제곱: {squares:?}");
    let mut sorted = nums.clone();          // 원본을 남기려면 복사본을 정렬
    sorted.sort();
    println!("sorted: {sorted:?} 원본: {nums:?}");
    println!(
        "{} {} {:?}",
        nums.contains(&3),
        nums.iter().filter(|&&n| n == 8).count(),
        nums.iter().position(|&n| n == 9)
    );

    let names = ["민지", "준호", "서연"];
    let scores = [92, 78, 85];
    for (i, (name, score)) in names.iter().zip(scores.iter()).enumerate() {
        println!("{}. {name} {score}", i + 1);
    }

    let mut grid = vec![vec![0; 3]; 2];     // 줄마다 복사본이 만들어진다
    grid[0][0] = 1;
    println!("grid: {grid:?}");
}
```

실행 결과:

```text
["기상", "장보기", "운동", "독서", "일기"] 5
pop: Some("일기") 기상 ["장보기", "운동", "독서"]
retain 뒤: ["장보기", "독서"]
[3, 8, 1] [5, 3, 8] [9, 2, 7]
[5, 8, 9, 7] [7, 2, 9, 1, 8, 3, 5] [9, 2, 7]
홀수의 제곱: [25, 9, 1, 81, 49]
sorted: [1, 2, 3, 5, 7, 8, 9] 원본: [5, 3, 8, 1, 9, 2, 7]
true 1 Some(4)
1. 민지 92
2. 준호 78
3. 서연 85
grid: [[1, 0, 0], [0, 0, 0]]
```

### 코드 한 부분씩 읽기

| 코드                                            | 설명                                                                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `let mut todo: Vec<&str> = Vec::new();`         | 빈 `Vec`입니다. 안에 담을 자료형(`&str`)을 적었습니다. `vec![1, 2, 3]`처럼 매크로로 값을 넣어 만들 수도 있습니다.             |
| `todo.pop()` → `Some("일기")`                   | 비어 있을 수 있어서 `Option`을 돌려줍니다.                                                                                    |
| `todo.remove(0)`                                | 꺼낸 값을 돌려주며 지웁니다. 범위를 벗어난 위치면 패닉입니다.                                                                 |
| `todo.retain(\|&t\| t != "운동")`               | 조건을 만족하는 값만 남깁니다. 반복하면서 지우는 것을 안전하게 해 주는 메서드입니다.                                          |
| `&nums[1..4]`                                   | 슬라이스입니다. 복사하지 않고 원본의 일부를 빌려 봅니다.                                                                      |
| `nums.iter().step_by(2).copied().collect()`     | 2칸마다 값을 꺼내 새 `Vec`으로 모읍니다. `copied()`는 빌린 `&i32`를 `i32` 값으로 바꿉니다.                                    |
| `filter(\|&&n\| ...)`                           | `filter`는 요소를 **빌린 것의 빌린 것**(`&&i32`)으로 받아서 `&&n`으로 풀었습니다. 모양이 낯설지만 "값 n을 꺼낸다"는 뜻입니다. |
| `let mut sorted = nums.clone(); sorted.sort();` | Rust의 `sort`는 제자리 정렬뿐이라, 원본을 남기려면 복사본을 정렬합니다.                                                       |
| `vec![vec![0; 3]; 2]`                           | 바깥 `vec!`이 안쪽 `Vec`을 줄마다 **복사**해 만들어서, Python의 `[[0] * 3] * 2` 같은 공유 문제가 없습니다.                    |

## 8. 실행 추적

C의 `insert_at(2, 7)`을 `items = [1, 5, 3, 8]`, `len = 4`에서 따라갑니다.

| 단계 | `i` | 한 일                     | `items`(앞 5칸) |
| ---: | --: | ------------------------- | --------------- |
| 시작 |     |                           | `1 5 3 8 _`     |
|    1 |   4 | `items[4] = items[3]`     | `1 5 3 8 8`     |
|    2 |   3 | `items[3] = items[2]`     | `1 5 3 3 8`     |
|    3 |   2 | (`i > pos` 거짓 → 끝)     |                 |
|    4 |     | `items[2] = 7`, `len = 5` | `1 5 7 3 8`     |

끼워 넣는 위치 뒤의 **두 칸**을 옮겼습니다. 맨 앞에 넣었다면 네 칸 모두를 옮겨야 합니다. 100만 개짜리 목록의 맨 앞에 넣으면 100만 번을 옮깁니다.

## 9. 다른 예제로 다시 이해하기

학생들의 (이름, 점수) 목록으로 합격자 명단, 상위 3명, 최저점, 평균을 구해 봅시다. 컴프리헨션으로 **걸러 내고**, `key`로 **기준을 정해 정렬**하고, 자르기로 **앞의 일부**를 가져옵니다.

```python
# 파일: ranking.py
records = [("민지", 92), ("준호", 78), ("서연", 85), ("하늘", 99), ("도윤", 61), ("유나", 85)]

passed = [name for name, score in records if score >= 80]
ranked = sorted(records, key=lambda r: r[1], reverse=True)   # 점수 기준 내림차순

print("합격자:", passed)
for rank, (name, score) in enumerate(ranked[:3], start=1):  # 앞의 3개만
    print(f"{rank}위 {name} {score}점")
print("최저점:", ranked[-1])
total = sum(score for _, score in records)
print(f"평균: {total / len(records):.1f}")
print("원본 순서는 그대로:", [name for name, _ in records])
```

실행 결과:

```text
합격자: ['민지', '서연', '하늘', '유나']
1위 하늘 99점
2위 민지 92점
3위 서연 85점
최저점: ('도윤', 61)
평균: 83.3
원본 순서는 그대로: ['민지', '준호', '서연', '하늘', '도윤', '유나']
```

`key=lambda r: r[1]`은 "각 원소의 두 번째 값(점수)으로 비교하라"는 뜻입니다(Day 22의 `lambda`). 서연과 유나는 둘 다 85점인데, 안정 정렬이라 **원래 순서대로** 서연이 앞에 남아 3위가 되었습니다. `sorted`는 새 리스트를 만들어서 원본 `records`는 그대로입니다. `ranked[:3]`은 상위 3명, `ranked[-1]`은 최저점입니다.

같은 분석을 Rust로 하면 `filter`/`map`/`collect`와 `sort_by`를 씁니다.

```rust
// 파일: ranking.rs
fn main() {
    let records = vec![("민지", 92), ("준호", 78), ("서연", 85), ("하늘", 99), ("도윤", 61), ("유나", 85)];

    let passed: Vec<&str> = records.iter().filter(|r| r.1 >= 80).map(|r| r.0).collect();
    let mut ranked = records.clone();
    ranked.sort_by(|a, b| b.1.cmp(&a.1));   // 점수 내림차순(같으면 원래 순서 유지)

    println!("합격자: {passed:?}");
    for (i, (name, score)) in ranked.iter().take(3).enumerate() {
        println!("{}위 {name} {score}점", i + 1);
    }
    println!("최저점: {:?}", ranked[ranked.len() - 1]);
    let total: i32 = records.iter().map(|r| r.1).sum();
    println!("평균: {:.1}", total as f64 / records.len() as f64);
    let names: Vec<&str> = records.iter().map(|r| r.0).collect();
    println!("원본 순서는 그대로: {names:?}");
}
```

실행 결과:

```text
합격자: ["민지", "서연", "하늘", "유나"]
1위 하늘 99점
2위 민지 92점
3위 서연 85점
최저점: ("도윤", 61)
평균: 83.3
원본 순서는 그대로: ["민지", "준호", "서연", "하늘", "도윤", "유나"]
```

`b.1.cmp(&a.1)`처럼 `a`와 `b`의 자리를 바꿔 비교하면 내림차순이 됩니다(Day 12의 `cmp`). Rust의 `sort_by`도 안정 정렬이라 결과가 Python과 같습니다. `take(3)`은 반복자에서 앞의 3개만 꺼냅니다.

## 10. 리스트 도구 한눈에 보기

| 하고 싶은 일     | Python                               | Rust                                      |
| ---------------- | ------------------------------------ | ----------------------------------------- |
| 조건에 맞는 것만 | `[x for x in a if 조건]`             | `a.iter().filter(...).collect()`          |
| 모두 바꾸기      | `[f(x) for x in a]`                  | `a.iter().map(...).collect()`             |
| 합계·최대·최소   | `sum(a)`, `max(a)`, `min(a)`         | `.iter().sum()`, `.iter().max()` (Option) |
| 있는지           | `x in a`                             | `a.contains(&x)`                          |
| 위치             | `a.index(x)` (없으면 오류)           | `a.iter().position(...)` (Option)         |
| 개수             | `a.count(x)`                         | `.iter().filter(...).count()`             |
| 앞의 k개         | `a[:k]`                              | `&a[..k]`, `.iter().take(k)`              |
| 뒤집기           | `a[::-1]`(새), `a.reverse()`(제자리) | `.iter().rev()`, `a.reverse()`            |
| 나란히 돌기      | `zip(a, b)`                          | `a.iter().zip(b.iter())`                  |

## 11. 세 언어 비교

| 관점               | Python `list`            | Rust `Vec<T>`                   | C 배열 + 길이               |
| ------------------ | ------------------------ | ------------------------------- | --------------------------- |
| 크기               | 자동으로 늘고 줄어듦     | 자동으로 늘고 줄어듦            | 용량 고정, 길이는 직접 관리 |
| 담는 값            | 아무거나 섞어도 됨       | 한 자료형                       | 한 자료형                   |
| 빈 목록에서 꺼내기 | `IndexError`             | `None`                          | 직접 검사해야 함            |
| 부분 목록          | 자르기 = 새 리스트(복사) | 슬라이스 = 빌려 보기(복사 없음) | 범위를 정해 돌기            |
| 반복하며 지우기    | 값을 건너뜀(새 리스트로) | 빌림 규칙이 막음(`retain`)      | 직접 인덱스 관리            |
| 2차원 만들기 함정  | `[[0]*3]*2`가 줄 공유    | `vec![vec![0; 3]; 2]`는 안전    | `int a[2][3]`은 안전        |

## 12. 자주 하는 실수

### 실수 1: 반복하면서 목록에서 지운다

실습의 디버그 문제입니다. 지우면 뒤의 값이 당겨져서 바로 다음 값을 건너뜁니다. 남길 값으로 새 리스트를 만드세요.

### 실수 2: sort의 결과를 대입한다

```python
# 파일: sort_none.py
nums = [3, 1, 2]
result = nums.sort()
print(result, nums)
```

실행 결과:

```text
None [1, 2, 3]
```

`sort()`는 원본을 바꾸고 `None`을 돌려줍니다. 정렬된 새 리스트가 필요하면 `sorted(nums)`를 쓰세요.

### 실수 3: 없는 값을 remove하거나 빈 리스트에서 pop한다

```python
# 파일: remove_missing.py (실행 오류: ValueError)
todo = ["장보기", "운동"]
todo.remove("청소")
```

지우기 전에 `if "청소" in todo:`로 확인하세요. 빈 리스트의 `pop()`은 `IndexError`입니다.

### 실수 4: 2차원 리스트를 곱셈으로 만든다

`[[0] * 3] * 2`는 같은 줄을 공유합니다. `[[0] * 3 for _ in range(2)]`로 만드세요. 이 현상의 원리는 Day 31에서 배웁니다.

### 실수 5: Rust Vec의 범위를 벗어난 슬라이스

```rust
// 파일: slice_range.rs (실행 오류: out of range for slice)
fn main() {
    let v = vec![1, 2, 3];
    let end: usize = "5".parse().unwrap();
    println!("{:?}", &v[1..end]);
}
```

Python의 `v[1:5]`는 있는 만큼(`[2, 3]`)만 돌려주지만, Rust 슬라이스는 범위를 벗어나면 패닉입니다. `v.get(1..end)`는 `Option`으로 돌려줘서 안전하게 확인할 수 있습니다.

## 13. Q&A

**Q. append는 가끔 배열 전체를 옮긴다는데 왜 빠르다고 하나요?**

A. 가득 찰 때마다 용량을 **두 배 정도로** 늘리기 때문입니다. 1, 2, 4, 8, …칸으로 늘리면 n개를 넣는 동안 옮기는 총량은 약 2n이라, 한 번의 `append`는 평균적으로 일정한 시간이 걸립니다. 이것을 **분할 상환(amortized)** 분석이라고 합니다(Day 71).

**Q. 리스트 컴프리헨션과 for 반복 중 무엇이 좋나요?**

A. "걸러서 바꾼 새 리스트"를 만든다면 컴프리헨션이 짧고 빠릅니다. 반복 안에서 출력, 여러 변수 갱신, `break`처럼 **다른 일**을 한다면 for가 알맞습니다. 컴프리헨션 안에 조건이 여러 개 겹치면 읽기 어려우니 풀어 쓰세요.

**Q. Python 리스트에 다른 자료형을 섞어도 되나요?**

A. `[1, "a", 3.5]`처럼 섞을 수는 있지만, 정렬하거나 합계를 구할 때 오류가 나기 쉽습니다. 서로 다른 정보를 묶으려면 튜플이나 클래스(Day 51)를 원소로 쓰고, 한 리스트에는 **같은 종류**의 것을 담는 것이 좋습니다.

**Q. 맨 앞에서 자주 넣고 빼야 하면 어떻게 하나요?**

A. `collections.deque`를 쓰면 앞뒤 모두에서 빠르게 넣고 뺄 수 있습니다. Rust는 `VecDeque`가 있습니다. 큐를 배우는 Day 59에서 다룹니다.

## 14. 핵심 요약

- Python 리스트는 크기가 늘고 줄어드는 배열입니다. 추가는 `append`/`insert`/`extend`, 삭제는 `pop`/`remove`/`del`.
- 맨 뒤의 넣기·빼기는 빠르지만, 앞이나 중간의 `insert`/`pop(i)`는 뒤의 모든 칸을 옮겨서 느립니다(C 구현으로 확인).
- 자르기 `a[시작:끝:간격]`은 끝을 포함하지 않는 새 리스트를 만듭니다. `a[::-1]`은 거꾸로, `a[:]`는 복사본입니다.
- 리스트 컴프리헨션 `[식 for x in a if 조건]`으로 걸러 내고 바꾼 새 리스트를 만듭니다. Rust는 `filter`/`map`/`collect`.
- `sorted`는 새 리스트, `sort`는 제자리 정렬(`None` 반환). `key=`로 기준을 정하고, 정렬은 안정적입니다.
- 반복하면서 목록을 바꾸지 말고 새 리스트를 만드세요. `[[0] * 3] * 2`는 줄을 공유합니다.
- Rust `Vec`: `push`, `pop`(→ `Option`), `insert`, `remove`, `retain`, 슬라이스 `&v[a..b]`(범위 밖은 패닉).

## 15. 도전 문제

1. **(Python)** 문장을 단어 리스트로 나눈 뒤(`split`), 길이가 3 이상인 단어만 대문자로 바꾼 리스트를 컴프리헨션으로 만드세요.
2. **(C)** 5절의 리스트에 `insert_sorted(x)`를 추가해, 항상 오름차순을 유지하도록 알맞은 위치를 찾아 끼워 넣으세요.
3. **(Rust)** `Vec<i32>`에서 연속으로 같은 값이 반복되면 하나만 남기세요(`[1, 1, 2, 2, 2, 3, 1]` → `[1, 2, 3, 1]`). 직접 반복으로 하고, `dedup` 메서드의 결과와 비교하세요.
4. **(세 언어)** 할 일 명령(`add 장보기`, `done 1`, `list`)을 목록으로 받아 처리하는 작은 할 일 관리기를 만드세요. `done`은 번호(1부터)로 지웁니다. 없는 번호는 오류 메시지를 출력하세요.
