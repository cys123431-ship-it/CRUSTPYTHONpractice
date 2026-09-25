---
schemaVersion: 1
contentVersion: 2026.10-d
id: day-35-ownership-review
courseId: crp-92
phaseId: phase-04
dayNumber: 35
date: "2026-11-04"
title: 주소와 소유권 회상
summary: 포인터·참조·복사의 차이를 스스로 설명할 수 있어야 공유 상태의 버그를 찾아냅니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 50
prerequisites:
  - day-34-array-pointer
learningObjectives:
  - "'주소와 소유권 회상' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - ownership review
  - execution trace
  - language transfer
runnerMode: python
reviewOffsets:
  - 1
  - 3
  - 7
  - 14
  - 30
sample: false
exercises:
  - id: ex-day-35-ownership-review-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? items에서 시작해 계산하세요.
    starter: "items = [1, 2]

      alias = items

      alias.append(3)

      print(items)"
    answer: "[1, 2, 3]"
    hint: 두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.
    explanation: items → 리스트  →  alias → 같은 리스트  →  append  →  [1,2,3]. 따라서 출력은 '[1, 2, 3]'입니다.
    commonMistakes:
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-35-ownership-review-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: "'주소와 소유권 회상' 개념의 핵심 표현을 스스로 적는다."
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: alias = items"
    starter: "items = [1, 2]

      _____

      alias.append(3)

      print(items)"
    answer: "items = [1, 2]

      alias = items

      alias.append(3)

      print(items)"
    hint: items가 리스트를 가리킵니다
    explanation:
      빈칸에 들어갈 표현은 'alias = items'입니다. items가 리스트를 가리킵니다 alias가 동일 객체를 가리킵니다 append가 그 객체를 변경해 items에서도
      3이 보입니다
    commonMistakes:
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-35-ownership-review-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: "예시를 직접 타이핑한 뒤 다음을 바꾸세요: 처음 등장하는 숫자를 1에서 2로. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요."
    starter: "items = [1, 2]

      alias = items

      alias.append(3)

      print(items)"
    answer: "items = [2, 2]

      alias = items

      alias.append(3)

      print(items)"
    hint: "다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: 처음 등장하는 숫자를 1에서 2로."
    explanation:
      바꾼 뒤 출력은 '[2, 2, 3]'입니다. 원본 출력 '[1, 2, 3]'에서 달라졌습니다. 다른 줄(items = [1, 2] → items = [2, 2])에서 시작한
      차이가 최종 출력에 반영되었습니다.
    commonMistakes:
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-35-ownership-review-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함 상황을 확인하세요.
    starter: "items = [1, 2]

      alias = items.copy()

      alias.append(3)

      print(items)"
    answer: "items = [1, 2]

      alias = items

      alias.append(3)

      print(items)"
    hint: 두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.
    explanation: 원래 예시와 비교하여 잘못된 줄을 찾으세요. items가 리스트를 가리킵니다 alias가 동일 객체를 가리킵니다 append가 그 객체를 변경해 items에서도 3이 보입니다
    commonMistakes:
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-35-ownership-review-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 '주소와 소유권 회상' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# 주소와 소유권 회상: 직접 구현"
    answer: "items = [1, 2]

      alias = items

      alias.append(3)

      print(items)"
    hint: 두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.
    explanation:
      한 가지 예시 해법은 위 코드입니다. 핵심은 items가 리스트를 가리킵니다 alias가 동일 객체를 가리킵니다 append가 그 객체를 변경해 items에서도 3이 보입니다
      다른 코드도 결과와 근거가 맞으면 가능합니다.
    commonMistakes:
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-35-ownership-review-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
      - "[1, 2, 3]"
    answerIndex: 2
    explanation: items → 리스트  →  alias → 같은 리스트  →  append  →  [1,2,3] 순서로 실행되어 출력은 '[1, 2, 3]'입니다.
  - id: quiz-day-35-ownership-review-model
    question: "'주소와 소유권 회상' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - 두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함(이것이 정상적인 사용법이다)
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 0
    explanation: 두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.
  - id: quiz-day-35-ownership-review-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함
      - 변경된 입력을 다시 추적하여 결과를 확인함
    answerIndex: 1
    explanation: 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함. 입력과 중간 상태를 차례로 확인하세요.
  - id: quiz-day-35-ownership-review-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
      - 공유 참조와 복사를 구별함라는 동작과 경계 조건
    answerIndex: 2
    explanation: 문법은 달라도 공유 참조와 복사를 구별함라는 목적과 입력·출력은 유지합니다.
playgroundSource: "items = [1, 2]

  alias = items

  alias.append(3)

  print(items)"
---

## 오늘 배울 이유

포인터·참조·복사의 차이를 스스로 설명할 수 있어야 공유 상태의 버그를 찾아냅니다. Day 35 "`주소와 소유권 회상`"에서는 Python 코드의 실행 결과(`[1, 2, 3]`)를 따라가며, `공유 참조와 복사를 구별함` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 34](/learn/day-34-array-pointer)에서 배운 "C 배열 매개변수와 길이" 내용을 한 문장으로 말해 보세요. 이번 "`주소와 소유권 회상`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `alias = items`입니다.

## 머릿속 그림

두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다. Day 35에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `alias = items`입니다.

```text
items → 리스트  →  alias → 같은 리스트  →  append  →  [1,2,3]
```

위 흐름에서 `alias = items` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `[1, 2, 3]`입니다.

## 천천히 풀어보기

C의 포인터, Python의 별칭, Rust의 참조를 모두 '같은 데이터를 둘 이상의 경로에서 본다'는 질문으로 연결해 보세요. Python에서 `alias = items` 뒤 `alias.append(30)`을 하면 `items`도 바뀝니다. 이는 이름 두 개가 한 리스트 객체를 가리키기 때문입니다.

`items.copy()`를 쓰면 바깥 리스트는 따로 생기지만 안에 든 가변 객체는 여전히 공유할 수 있습니다. C에서는 포인터가 유효한 메모리인지 개발자가 살펴야 하고, Rust는 빌림 규칙으로 일부 잘못된 공유를 컴파일 때 막습니다. 세 언어가 모두 '같은 값이 보인다'는 것과 메모리 안전 규칙이 같다는 뜻은 아닙니다.

## 문법을 예제로 보기

아래 Python 코드는 Day 35 "`주소와 소유권 회상`"의 독립 예제입니다. 전체 4줄 가운데 핵심 부분은 `alias = items`이며, 실행 결과는 `[1, 2, 3]`입니다.

```python
items = [1, 2]
alias = items
alias.append(3)
print(items)
```

예상 출력:

```text
[1, 2, 3]
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`[1, 2, 3]`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `alias = items`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```python
 1 | items = [1, 2]
 2 | alias = items
 3 | alias.append(3)
 4 | print(items)
```

1. items가 리스트를 가리킵니다
2. alias가 동일 객체를 가리킵니다
3. append가 그 객체를 변경해 items에서도 3이 보입니다

`alias = items` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | items          |
|    2 | 리스트         |
|    3 | alias          |
|    4 | 같은 리스트    |
|    5 | append         |
|    6 | [1,2,3]        |

위 순서대로 실행한 최종 출력은 `[1, 2, 3]`입니다. `items` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`a=[1]; b=a; b.append(2)`이면 둘 다 `[1,2]`를 봅니다. `b=a.copy(); b.append(3)`을 그다음 실행하면 a는 `[1,2]`, b는 `[1,2,3]`입니다. 중간에 바뀐 것은 이름 b가 가리키는 대상이지 a의 내용이 새 리스트로 복제됐다는 뜻이 아닙니다.

## 결과 예측과 작은 변경

원본 실행 결과는 `[1, 2, 3]`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```python
items = [2, 2]
alias = items
alias.append(3)
print(items)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
[2, 2, 3]
```

원본과 달라졌습니다. 원본 출력은 `[1, 2, 3]`입니다. 다른 줄(`items = [1, 2]` → `items = [2, 2]`)에서 시작된 차이가 이후 흐름을 타고 최종 출력에 반영되었습니다. 원본 추적(`items` → …)과 바뀐 줄부터 대조해 보세요.

## 자주 틀리는 지점

**확인할 실수: 새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함.** 정상 코드의 실행 결과는 `[1, 2, 3]`입니다.

- 정상 줄: `alias = items`
- 잘못된 줄: `alias = items.copy()`

두 줄을 나란히 놓고 `두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다.` 기준으로 어느 쪽이 맞는지 설명하세요. 결과가 예상과 다르면 `items`부터 `[1, 2, 3]`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `공유 참조와 복사를 구별함`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙                |
| ------ | ----------------------------------------- |
| C17    | 포인터 복사는 주소 공유, 별도 malloc 필요 |
| Python | 대입은 별칭, copy는 새 리스트             |
| Rust   | move·&·clone 중 의도 선택                 |

C17에서는 `포인터 복사는 주소 공유, 별도 malloc 필요` 규칙을 적용합니다. "`주소와 소유권 회상`" 수업의 실행 결과(`[1, 2, 3]`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `대입은 별칭, copy는 새 리스트` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `move·&·clone 중 의도 선택` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`[1, 2, 3]` 맞히기) → 빈칸(`alias = items` 채우기) → 변경(`처음 등장하는 숫자를 1에서 2로`) → 오류 수정(`새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함` 찾기) → 독립 구현(`'주소와 소유권 회상' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `[1, 2, 3]` 및 `alias = items` 설명과 대조하세요.

## 스스로 설명하기

- "`주소와 소유권 회상`" 수업이 필요한 이유는 `공유 참조와 복사를 구별함` 동작으로 설명해 보세요.
- 예제에서 `alias = items` 부분 실행 직전의 상태와 직후의 출력(`[1, 2, 3]`)을 말해 보세요.
- "`새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `공유 참조와 복사를 구별함` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

두 이름이 같은 가변 리스트를 가리키면 어느 이름을 통해 바꿔도 같은 객체가 수정됩니다. Day 35 "`주소와 소유권 회상`" 예제의 핵심 부분은 `alias = items`이며, 실행 결과는 `[1, 2, 3]`입니다. "`새 이름을 붙이면 무조건 별도의 객체가 생긴다고 생각함`" 여부를 확인하고 Day 35 수업을 완료하세요.
