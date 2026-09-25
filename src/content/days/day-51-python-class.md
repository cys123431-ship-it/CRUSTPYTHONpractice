---
schemaVersion: 1
contentVersion: 2026.10-f
id: day-51-python-class
courseId: crp-92
phaseId: phase-05
dayNumber: 51
date: "2026-11-20"
title: Python 클래스와 인스턴스
summary: 여러 학습 기록에 같은 데이터 형식과 동작을 적용하려면 클래스로 설계합니다. Python 예시를 추적하고 다른 두 언어로 옮겨 봅니다.
anchorLanguage: python
transferLanguages:
  - c
  - rust
difficulty: intermediate
estimatedMinutes: 90
prerequisites:
  - day-50-c-struct
learningObjectives:
  - "'Python 클래스와 인스턴스' 개념이 필요한 상황을 예로 든다."
  - Python 코드의 핵심 줄과 실행 결과를 추적한다.
  - "다음 오류를 발견하고 고친다: self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음."
  - 같은 개념을 나머지 두 언어에 적용한다.
concepts:
  - python class
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
  - id: ex-day-51-python-class-predict
    title: 결과를 먼저 예측하기
    kind: predict
    objective: 코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.
    prompt: 아래 코드를 실행하면 어떤 문장이 출력될까요? 클래스 정의에서 시작해 계산하세요.
    starter:
      "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\n\
      print(s.minutes)"
    answer: "30"
    hint: 클래스 정의에서 시작해 출력까지 순서대로 적어 보세요. 클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다.
    explanation:
      1. Session(30)이 새 인스턴스를 만듭니다. 2. __init__에서 그 객체의 minutes에 30을 저장합니다. 3. s.minutes로 읽습니다. `클래스 정의
      → s 생성 → s.minutes=30 → 출력` 흐름으로 실제 출력 `30`이 됩니다. 핵심 `self.minutes`는 객체에 값을 남기는 자리에 쓰입니다.
    commonMistakes:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: none
  - id: ex-day-51-python-class-fill
    title: 핵심 표현 빈칸 채우기
    kind: fill
    objective: Python 클래스와 인스턴스의 핵심 표현을 스스로 적는다.
    prompt: "빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: self.minutes"
    starter: "class Session:\n    def __init__(self, minutes):\n        _____ = minutes\ns = Session(30)\nprint(s.minutes)"
    answer: "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\nprint(s.minutes)"
    hint: 필요한 표현은 인스턴스 속성 초기화 동작을 잇는 self.minutes입니다.
    explanation:
      빈칸에 들어갈 표현은 'self.minutes'입니다. 이 표현이 없으면 실행 중 오류로 멈춥니다. 1. Session(30)이 새 인스턴스를 만듭니다. 2. __init__에서
      그 객체의 minutes에 30을 저장합니다. 3. s.minutes로 읽습니다. `클래스 정의 → s 생성 → s.minutes=30 → 출력` 흐름으로 실제 출력 `30`이 됩니다. 핵심 `self.minutes`는
      객체에 값을 남기는 자리에 쓰입니다.
    commonMistakes:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-51-python-class-guided
    title: 값을 바꿔 다시 추적하기
    kind: modify
    objective: 입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.
    prompt: 예시를 직접 타이핑한 뒤 처음 등장하는 숫자를 30에서 31로 바꿔 보세요. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.
    starter:
      "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\n\
      print(s.minutes)"
    answer: "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(31)\nprint(s.minutes)"
    hint: 처음 등장하는 숫자를 30에서 31로 바꾼 뒤 실행 결과를 먼저 적어 보세요. 원본 출력 '30'와 비교해 달라지는 첫 중간 값을 찾으면 됩니다.
    explanation:
      바꾼 뒤 출력은 '31'입니다. 원본은 `30`, 수정본은 `31`이다. 첫 변경 줄 `s = Session(30)`에서 `s = Session(31)`로 인수를 바꾸면, 새
      객체의 속성이 31로 저장된 뒤 읽힌다.
    commonMistakes:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-51-python-class-debug
    title: 오류 설명하고 고치기
    kind: debug
    objective: 문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.
    prompt: 아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음 상황을 확인하세요.
    starter: "class Session:\n    def __init__(self, minutes):\n        minutes = minutes\ns = Session(30)\nprint(s.minutes)"
    answer: "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\nprint(s.minutes)"
    hint: self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음 상황에서 어긋나는 줄을 클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다. 설명과 대조해 보세요.
    explanation:
      틀린 줄은 `minutes = minutes`입니다. 지역 이름에만 값을 넣고 객체에는 남기지 않으므로, 뒤의 `print(s.minutes)`에서 속성이 없어 AttributeError라는
      런타임 오류가 나고 프로그램이 멈춥니다. 오류 분류는 런타임 오류입니다. 흐름이 깨지는 첫 순간은 속성 읽기 줄입니다. 고친 줄 `self.minutes = minutes`에서는 `인스턴스 속성
      초기화` 동작이 지켜집니다. 정상 코드는 객체 생성→속성 저장→속성 읽기의 순서로 `30`을 출력합니다.
    commonMistakes:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
  - id: ex-day-51-python-class-independent
    title: 예시를 가리고 다시 구현하기
    kind: independent
    objective: 설명 없이 같은 개념을 작은 프로그램으로 재현한다.
    prompt: 예시를 가리고 Python 클래스와 인스턴스 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.
    starter: "# Python 클래스와 인스턴스: 직접 구현"
    answer: "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\nprint(s.minutes)"
    hint: "`a.minutes`만 바꿨을 때 `b.minutes`가 변하지 않아야 정상입니다. 공유와 분리를 구별하세요. 예상 출력과 경계 조건도 함께 적어 보세요."
    explanation:
      입력·처리·출력·경계 조건을 스스로 설계하세요. `a.minutes`만 바꿨을 때 `b.minutes`가 변하지 않아야 정상입니다. 공유와 분리를 구별하세요. 같은 인스턴스
      속성 초기화 동작을 구현하고 실행 결과 '30'와 대조할 수 있으면, 예시 답안과 달라도 정답입니다.
    commonMistakes:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
      - 실행 전에 출력과 중간 상태를 손으로 확인하지 않음
    language: python
    verification: run
quiz:
  - id: quiz-day-51-python-class-output
    question: 예시 코드의 출력은 무엇인가요?
    choices:
      - "30"
      - 실행 전에 반드시 오류가 난다
      - 아무것도 출력하지 않는다
    answerIndex: 0
    explanation:
      먼저 Session(30)이 새 인스턴스를 만듭니다. 이어서 __init__이 그 객체의 minutes에 30을 저장하고, s.minutes로 읽어 출력하므로 `30`이 됩니다.
      `실행 전에 반드시 오류가 난다`는 틀린 선택지인데 클래스 정의와 호출이 모두 정상이기 때문입니다. `아무것도 출력하지 않는다`도 틀린 선택지인데 print가 실제로 호출되기 때문입니다. 다른
      선택지는 이 추적과 맞지 않습니다.
  - id: quiz-day-51-python-class-model
    question: "'Python 클래스와 인스턴스' 개념을 이해하는 데 맞는 설명은?"
    choices:
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음(이것이 정상적인 사용법이다)
      - 클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다.
      - 코드가 짧다면 상태 추적은 필요 없다
    answerIndex: 1
    explanation:
      클래스는 객체의 설계도라는 뜻이고, self는 지금 만들고 있는 바로 그 객체라는 뜻은 메서드가 다루는 대상이 정해져 있다는 뜻입니다. `self를 빼고 지역 변수만 저장해
      객체에 값이 남지 않음`은 반대 사례인데, 지역 저장은 객체에 남지 않기 때문입니다.
  - id: quiz-day-51-python-class-pitfall
    question: 다음 중 실습에서 먼저 확인할 오류는?
    choices:
      - 실제 출력과 예측한 출력이 일치함
      - 변경된 입력을 다시 추적하여 결과를 확인함
      - self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음
    answerIndex: 2
    explanation:
      먼저 확인할 실수는 `self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음`입니다. 잘못된 코드는 속성이 없어 AttributeError로 멈춥니다. self 유무를 먼저
      확인하세요.
  - id: quiz-day-51-python-class-transfer
    question: 세 언어로 옮길 때 무엇을 보존해야 하나요?
    choices:
      - 인스턴스 속성 초기화라는 동작과 경계 조건
      - 세 언어의 표면 문법을 한 글자도 바꾸지 않는다
      - 타입과 오류 처리를 모두 생략한다
    answerIndex: 0
    explanation:
      세 언어로 옮길 때 보존해야 하는 것은 `인스턴스 속성 초기화`라는 의미와 입력·출력 계약입니다. C의 구조체 초기화와 Rust의 구조체 생성으로 같은 동작을 구현하고, 실행
      결과 `30`으로 대조하면 옮김이 맞는지 확인할 수 있습니다.
playgroundSource:
  "class Session:\n    def __init__(self, minutes):\n        self.minutes = minutes\ns = Session(30)\n\
  print(s.minutes)"
---

## 오늘 배울 이유

여러 학습 기록에 같은 데이터 형식과 동작을 적용하려면 클래스로 설계합니다. Day 51 "`Python 클래스와 인스턴스`"에서는 Python 코드의 실행 결과(`30`)를 따라가며, `인스턴스 속성 초기화` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day 50](/learn/day-50-c-struct)에서 배운 "C 구조체로 관련 값 묶기" 내용을 한 문장으로 말해 보세요. 이번 "`Python 클래스와 인스턴스`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `self.minutes`입니다.

## 머릿속 그림

클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다. Day 51에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `self.minutes`입니다.

```text
클래스 정의  →  s 생성  →  s.minutes=30  →  출력
```

위 흐름에서 `self.minutes` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `30`입니다.

## 천천히 풀어보기

클래스는 같은 종류의 기록을 만드는 설계이고 인스턴스는 그 설계로 만든 실제 기록 하나입니다. `__init__`의 `self`는 지금 만들거나 사용 중인 객체를 가리킵니다. `self.minutes = minutes`는 전달받은 분을 객체에 저장합니다. 두 객체를 만들면 각각 자기 `minutes`를 가집니다.

함수의 지역 변수 `minutes`와 속성 `self.minutes`는 다릅니다. 메서드가 끝나도 객체의 속성은 남습니다. `a.minutes`만 바꿨을 때 `b.minutes`가 변하지 않아야 정상입니다. 값을 함께 공유하고 싶을 때와 각 객체에 따로 둘 때를 구별하세요.

클래스는 같은 종류의 기록을 만드는 설계이고 인스턴스는 그 설계로 만든 실제 기록 하나입니다. `__init__`의 `self`는 지금 만들거나 사용 중인 객체를 가리킵니다. `self.minutes = minutes`는 전달받은 분을 객체에 저장합니다. 두 객체를 만들면 각각 자기 `minutes`를 가집니다.

함수의 지역 변수 `minutes`와 속성 `self.minutes`는 다릅니다. 메서드가 끝나도 객체의 속성은 남습니다. `a.minutes`만 바꿨을 때 `b.minutes`가 변하지 않아야 정상입니다. 값을 함께 공유하고 싶을 때와 각 객체에 따로 둘 때를 구별하세요.

## 문법을 예제로 보기

아래 Python 코드는 Day 51 "`Python 클래스와 인스턴스`"의 독립 예제입니다. 전체 5줄 가운데 핵심 부분은 `self.minutes`이며, 실행 결과는 `30`입니다.

```python
class Session:
    def __init__(self, minutes):
        self.minutes = minutes
s = Session(30)
print(s.minutes)
```

예상 출력:

```text
30
```

하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`30`)를 가리고 예측한 뒤 실행해 비교하세요.

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `self.minutes`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄 번호를 말하고, 그 줄이 읽는 값과 바꾸는 값을 적어 보세요.

```python
 1 | class Session:
 2 |     def __init__(self, minutes):
 3 |         self.minutes = minutes
 4 | s = Session(30)
 5 | print(s.minutes)
```

1. Session(30)이 새 인스턴스를 만듭니다
2. __init__에서 그 객체의 minutes에 30을 저장합니다
3. s.minutes로 읽습니다

`self.minutes` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | -------------- |
|    1 | 클래스 정의    |
|    2 | s 생성         |
|    3 | s.minutes=30   |
|    4 | 출력           |

위 순서대로 실행한 최종 출력은 `30`입니다. `클래스 정의` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

`a=Session(10); b=Session(20)`이라고 두 객체를 만든 뒤 `a.minutes += 5`를 하면 a는 15, b는 20입니다. `self.minutes`가 각 인스턴스에 속하기 때문입니다. 메서드 안에서 지역 이름 `minutes`를 다시 대입하는 것과 `self.minutes`를 바꾸는 것을 구별하세요.

## 결과 예측과 작은 변경

원본 실행 결과는 `30`입니다. 아래 코드에서 원본과 달라지는 첫 줄을 표시하고, 그 줄의 변경 전후 값을 적어 보세요.

```python
class Session:
    def __init__(self, minutes):
        self.minutes = minutes
s = Session(31)
print(s.minutes)
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
31
```

원본은 `30`, 수정본은 `31`이다. 첫 변경 줄 `s = Session(30)`에서 `s = Session(31)`로 인수를 바꾸면, 새 객체의 속성이 31로 저장된 뒤 읽힌다.

## 자주 틀리는 지점

**확인할 실수: self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음.** 정상 코드의 실행 결과는 `30`입니다.

- 정상 줄: `self.minutes = minutes`
- 잘못된 줄: `minutes = minutes`

두 줄을 나란히 놓으면 정상 줄 `self.minutes = minutes`이 `클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다.` 설명과 맞고, 잘못된 줄은 `self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음` 쪽으로 어긋납니다. 결과가 예상과 다르면 `클래스 정의`부터 `30`까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `인스턴스 속성 초기화`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어   | 옮길 때 확인할 표현과 규칙  |
| ------ | --------------------------- |
| C17    | struct와 초기화 함수        |
| Python | **init**(self)와 self.field |
| Rust   | struct와 impl 생성 함수     |

C17에서는 `struct와 초기화 함수` 규칙을 적용합니다. "`Python 클래스와 인스턴스`" 수업의 실행 결과(`30`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `__init__(self)와 self.field` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `struct와 impl 생성 함수` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`30` 맞히기) → 빈칸(`self.minutes` 채우기) → 변경(`처음 등장하는 숫자를 30에서 31로`) → 오류 수정(`self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음` 찾기) → 독립 구현(`'Python 클래스와 인스턴스' 개념을 보여주는 작은 프로그램` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `30` 및 `self.minutes` 설명과 대조하세요.

## 스스로 설명하기

- "`Python 클래스와 인스턴스`" 수업이 필요한 이유는 `인스턴스 속성 초기화` 동작으로 설명해 보세요.
- 예제에서 `self.minutes` 부분 실행 직전의 상태와 직후의 출력(`30`)을 말해 보세요.
- "`self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `인스턴스 속성 초기화` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

클래스는 객체의 설계도이고 self는 지금 만들고 있는 바로 그 객체입니다. Day 51 "`Python 클래스와 인스턴스`" 예제의 핵심 부분은 `self.minutes`이며, 실행 결과는 `30`입니다. "`self를 빼고 지역 변수만 저장해 객체에 값이 남지 않음`" 여부를 확인하고 Day 51 수업을 완료하세요.
