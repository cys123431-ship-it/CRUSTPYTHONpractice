---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-02-output-input
courseId: crp-92
phaseId: phase-01
dayNumber: 2
date: "2026-10-02"
title: 출력과 입력 — 화면에 쓰고 키보드에서 읽기
summary: 프로그램이 사용자와 대화하는 두 통로인 표준 출력과 표준 입력을 배웁니다. Python의 print(sep, end)와 input, C의 printf·puts·scanf와 이스케이프 문자, Rust의 print!·println!과 read_line을 같은 인사 프로그램으로 비교하고, 입력은 항상 문자열로 들어온다는 것과 정수로 바꾸는 방법(int, scanf의 %d, trim과 parse)을 익힙니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: beginner
estimatedMinutes: 90
prerequisites: [day-01-variables-types]
learningObjectives:
  - 표준 출력과 표준 입력이 무엇인지 설명하고, 세 언어의 출력 함수를 쓴다.
  - Python print의 sep과 end, C의 이스케이프 문자(\n, \t, \", \\)를 써서 원하는 모양으로 출력한다.
  - 입력은 문자열로 들어온다는 것을 알고, 세 언어에서 정수로 변환한다.
  - 한 줄에 여러 값을 입력받아 나누는 방법(split, scanf의 여러 서식, split_whitespace)을 쓴다.
  - C scanf의 & 와 반환값, Rust read_line 뒤의 trim이 필요한 이유를 설명한다.
concepts:
  [
    standard output,
    standard input,
    print,
    input,
    printf,
    scanf,
    escape sequence,
    read_line,
    parse,
    trim,
  ]
runnerMode: python
playgroundSource: |
  # 파일: io.py — 플레이그라운드에는 키보드 입력이 없으니 문자열로 흉내 냅니다.
  line = "85 92"            # input()으로 받았다고 생각하세요
  a_text, b_text = line.split()
  a, b = int(a_text), int(b_text)
  print("합계", a + b, sep=": ")
  print("평균", (a + b) / 2, sep=": ", end="점\n")
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day02-predict-py
    title: sep과 end 예측하기
    kind: predict
    objective: print의 sep과 end가 출력 모양을 어떻게 바꾸는지 추적한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      print(1, 2, 3, sep="-", end="")
      print("!", 4)
    answer: "1-2-3! 4"
    hint: "첫 print는 값 사이에 -를 넣고, 끝에 줄바꿈 대신 빈 문자열을 붙입니다. 두 번째 print는 기본 sep(공백)을 씁니다."
    explanation: 'end=""이면 줄이 바뀌지 않아 다음 print가 같은 줄에 이어집니다. 두 번째 print는 "!"와 4 사이에 기본 구분자인 공백 하나를 넣고 줄을 바꿉니다.'
    commonMistakes:
      - end=""를 무시하고 두 줄로 나뉜다고 생각함
      - 두 번째 print에도 sep="-"가 적용된다고 생각함
    language: python
    verification: run
  - id: ex-day02-predict-c
    title: printf 서식 문자 예측하기
    kind: predict
    objective: 서식 문자가 뒤의 값으로 순서대로 바뀐다는 것을 확인한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          int a = 7;
          printf("a=%d, a*2=%d, %s\n", a, a * 2, "ok");
          return 0;
      }
    answer: "a=7, a*2=14, ok"
    hint: 첫 번째 %d에는 a, 두 번째 %d에는 a * 2, %s에는 문자열 "ok"가 들어갑니다.
    explanation: "서식 문자열 안의 a=, a*2= 같은 글자는 그대로 출력되고, % 로 시작하는 자리만 뒤의 값으로 바뀝니다. 값의 개수와 순서가 서식 문자와 맞아야 합니다."
    commonMistakes:
      - "서식 문자열 안의 a*2도 계산된다고 생각함"
      - "%s 자리에 따옴표까지 출력된다고 생각함"
    language: c
    verification: run
  - id: ex-day02-fill
    title: Rust 입력 문자열 다듬기
    kind: fill
    objective: read_line으로 받은 문자열 끝의 줄바꿈을 없앤 뒤 정수로 바꾼다.
    prompt: "read_line으로 받은 것처럼 끝에 줄바꿈이 붙은 문자열을 정수로 바꿔 43이 출력되게 빈칸을 채우세요."
    starter: |-
      fn main() {
          let text = String::from(" 42\n");     // read_line으로 받은 입력이라고 생각하세요
          let n: i32 = text._____().parse().unwrap();
          println!("{}", n + 1);
      }
    answer: |-
      fn main() {
          let text = String::from(" 42\n");     // read_line으로 받은 입력이라고 생각하세요
          let n: i32 = text.trim().parse().unwrap();
          println!("{}", n + 1);
      }
    output: "43"
    hint: 문자열 앞뒤의 공백과 줄바꿈을 없애는 메서드입니다.
    explanation: "trim()은 앞뒤의 공백, 탭, 줄바꿈을 없앤 문자열 조각을 돌려줍니다. 없애지 않고 parse하면 '\\n'이 숫자가 아니라서 InvalidDigit 오류가 나고, unwrap()이 프로그램을 멈춥니다."
    commonMistakes:
      - trim 없이 parse해서 실행 중 panic이 남
      - parse 결과의 자료형(i32)을 적지 않아 컴파일러가 무엇으로 바꿀지 모름
    language: rust
    verification: run
  - id: ex-day02-modify
    title: 한 줄 입력을 합계와 평균으로
    kind: modify
    objective: 공백으로 구분된 문자열을 나누고 정수로 바꿔 계산한다.
    prompt: "line에는 input()으로 받은 것처럼 '85 92'가 들어 있습니다. 두 점수를 정수로 바꿔 '합계 177, 평균 88.5'를 출력하도록 고치세요."
    starter: |-
      line = "85 92"      # input()으로 받은 값이라고 생각하세요
      print(line + line)
    answer: |-
      line = "85 92"      # input()으로 받은 값이라고 생각하세요
      a_text, b_text = line.split()
      a = int(a_text)
      b = int(b_text)
      print(f"합계 {a + b}, 평균 {(a + b) / 2}")
    output: "합계 177, 평균 88.5"
    hint: split()은 공백을 기준으로 문자열을 나눈 리스트를 돌려줍니다. 두 조각을 두 이름에 나누어 받을 수 있습니다.
    explanation: 처음 코드는 문자열끼리 이어 붙여 '85 9285 92'를 출력합니다. 입력은 항상 문자열이므로 계산하려면 int()로 바꿔야 합니다.
    commonMistakes:
      - int(line)으로 한 번에 바꾸려다 ValueError가 남(공백 때문에 정수 모양이 아님)
      - 평균을 (a + b) // 2로 계산해 88이 됨
    language: python
    verification: run
  - id: ex-day02-debug
    title: C printf 서식 불일치 고치기
    kind: debug
    objective: 값의 자료형과 printf 서식 문자를 맞춘다.
    prompt: "이 C 코드는 -Wall -Werror로 컴파일하면 'format '%d' expects argument of type 'int''라는 오류가 납니다. '평균: 88.5'가 출력되게 고치세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          double avg = (85 + 92) / 2.0;
          printf("평균: %d\n", avg);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          double avg = (85 + 92) / 2.0;
          printf("평균: %.1f\n", avg);
          return 0;
      }
    output: "평균: 88.5"
    hint: double 값은 %f 계열 서식으로 출력합니다. 소수점 한 자리만 보이게 하려면 %.1f입니다.
    explanation: "printf는 서식 문자를 보고 뒤의 값을 어떻게 읽을지 정합니다. %d에 double을 주면 엉뚱한 값이 출력되거나 프로그램마다 다른 결과가 나오는 '정의되지 않은 동작'입니다. 경고 옵션(-Wall)을 켜면 컴파일러가 이런 불일치를 찾아 줍니다."
    commonMistakes:
      - "avg를 (int)로 바꿔 88이 출력되게 함"
      - "%lf와 %f의 차이를 걱정함(printf에서는 double에 둘 다 쓸 수 있음)"
    language: c
    verification: run
  - id: ex-day02-independent
    title: Rust로 한 줄 입력 처리하기
    kind: independent
    objective: 한 줄 문자열을 공백으로 나누고, 이름과 두 정수를 꺼내 계산한다.
    prompt: "line에 '민지 85 92'가 들어 있습니다(read_line으로 받은 것이라고 생각하세요). 이름과 두 점수를 꺼내 '민지: 합계 177, 평균 88.5'를 출력하세요."
    starter: |-
      fn main() {
          let line = String::from("민지 85 92\n");
          println!("{line}");
      }
    answer: |-
      fn main() {
          let line = String::from("민지 85 92\n");
          let mut parts = line.split_whitespace();
          let name = parts.next().unwrap();
          let a: i32 = parts.next().unwrap().parse().unwrap();
          let b: i32 = parts.next().unwrap().parse().unwrap();
          println!("{name}: 합계 {}, 평균 {:.1}", a + b, (a + b) as f64 / 2.0);
      }
    output: "민지: 합계 177, 평균 88.5"
    hint: "split_whitespace()는 공백으로 나눈 조각을 하나씩 꺼낼 수 있게 해 주고, next()가 다음 조각을 줍니다. 조각이 없을 수도 있어서 unwrap()으로 꺼냅니다."
    explanation: "split_whitespace는 줄바꿈도 공백으로 취급하므로 trim 없이도 마지막 조각이 '92'가 됩니다. 평균은 i32끼리 나누면 88이 되므로 f64로 바꿔 나눕니다."
    commonMistakes:
      - 평균을 (a + b) / 2로 계산해 88이 출력됨
      - 세 번째 조각을 꺼내지 않고 두 번째만 두 번 씀
    language: rust
    verification: run
quiz:
  - id: quiz-day02-01
    question: Python에서 n = input()으로 42를 입력받았을 때 n + 1이 오류가 나는 이유는?
    choices:
      - input()은 항상 문자열을 돌려주기 때문에
      - 42는 너무 큰 수라서
      - input()은 입력이 끝나기 전에 값을 돌려주기 때문에
      - n이라는 이름을 쓸 수 없어서
    answerIndex: 0
    explanation: 키보드로 들어오는 것은 글자들이므로 input()의 결과는 항상 str입니다. 계산하려면 int(n)처럼 변환해야 합니다. C의 scanf("%d")와 Rust의 parse()가 같은 일을 합니다.
  - id: quiz-day02-02
    question: C에서 scanf("%d", &age)의 &가 필요한 이유는?
    choices:
      - 입력값을 문자열로 바꾸려고
      - scanf가 읽은 값을 age에 직접 써 넣을 수 있도록 age의 위치(주소)를 알려 주려고
      - 입력을 두 번 받으려고
      - age를 상수로 만들려고
    answerIndex: 1
    explanation: 함수에 값만 넘기면 함수는 복사본을 받으므로 원래 변수를 바꿀 수 없습니다. 주소를 넘겨야 scanf가 그 자리에 읽은 값을 넣을 수 있습니다. 주소와 포인터는 Day 29에서 자세히 배웁니다.
  - id: quiz-day02-03
    question: print("a", "b", sep="", end="?")의 출력은?
    choices:
      - "a b?"
      - "ab?"
      - "ab 다음에 줄바꿈"
      - "a?b?"
    answerIndex: 1
    explanation: sep=""이면 값 사이에 아무것도 넣지 않고, end="?"이면 줄바꿈 대신 ?를 붙입니다. 그래서 줄도 바뀌지 않습니다.
  - id: quiz-day02-04
    question: Rust에서 read_line으로 읽은 문자열을 parse하기 전에 trim()을 하는 이유는?
    choices:
      - 문자열을 대문자로 바꾸려고
      - 읽은 줄 끝에 줄바꿈 문자가 붙어 있어서, 그대로 두면 숫자로 바꿀 수 없기 때문에
      - 입력을 빠르게 하려고
      - trim()을 해야 String이 만들어져서
    answerIndex: 1
    explanation: read_line은 Enter 키로 들어온 줄바꿈까지 문자열에 담습니다. "2001\n"을 parse하면 InvalidDigit 오류가 납니다.
  - id: quiz-day02-05
    question: C 문자열 "A\tB\n"에서 \t와 \n이 뜻하는 것은?
    choices:
      - 글자 t와 n
      - 탭과 줄바꿈
      - 문자열의 끝
      - 주석
    answerIndex: 1
    explanation: 역슬래시로 시작하는 이스케이프 문자는 키보드로 직접 쓰기 어려운 글자를 나타냅니다. \t는 탭, \n은 줄바꿈, \"는 큰따옴표, \\는 역슬래시 자체입니다. Python과 Rust의 문자열에서도 똑같이 씁니다.
---

## 1. 오늘 배울 내용

Day 1에서는 값을 만들고 출력했습니다. 오늘은 프로그램이 사람과 **대화하는 두 통로**를 배웁니다.

- **표준 출력(standard output)**: 프로그램이 글자를 내보내는 통로입니다. 보통 화면(터미널)에 연결됩니다.
- **표준 입력(standard input)**: 프로그램이 글자를 받아들이는 통로입니다. 보통 키보드에 연결됩니다.

1. 세 언어의 출력 도구와 출력 모양을 바꾸는 방법을 익힙니다.
   - Python: `print`의 `sep`, `end`
   - C: `printf`, `puts`, 이스케이프 문자
   - Rust: `print!`, `println!`
2. 입력 도구를 익힙니다.
   - Python: `input`
   - C: `scanf`
   - Rust: `read_line`
3. 입력은 **항상 글자(문자열)로 들어온다**는 것을 알고, 정수로 바꾸는 방법을 배웁니다.
4. 이름과 점수 두 개를 입력받아 합계와 평균을 출력하는 프로그램을 세 언어로 만듭니다.

## 2. 왜 필요한가

Day 1의 학습 기록 프로그램은 값이 코드에 고정되어 있었습니다. 다른 날 다른 시간을 기록하려면 코드를 고쳐야 합니다. 입력을 받으면 **코드는 그대로 두고 값만 바꿔** 쓸 수 있습니다. 계산기, 성적 처리, 게임 모두 "입력 → 처리 → 출력"의 흐름을 따릅니다.

```text
   키보드 ──▶ [표준 입력] ──▶  프로그램  ──▶ [표준 출력] ──▶ 화면
              "85 92\n"        계산         "합계 177"
```

입력은 키보드에서만 오는 것이 아닙니다. `프로그램 < 파일`처럼 파일 내용을 표준 입력으로 **흘려 보낼** 수도 있습니다. 이 사이트의 예제 실행 결과도 미리 준비한 입력을 흘려 보내 만든 것입니다.

## 3. 그림으로 이해하기

입력은 **글자들이 한 줄로 늘어선 흐름**입니다. 사용자가 `민지`, Enter, `85 92`, Enter를 누르면 프로그램에 들어오는 것은 다음 글자들입니다.

```text
┌──┬──┬──┬──┬──┬──┬──┬──┬──┐
│민│지│\n│ 8│ 5│  │ 9│ 2│\n│      ← \n은 Enter로 생긴 줄바꿈 문자
└──┴──┴──┴──┴──┴──┴──┴──┴──┘
```

- Python의 `input()`은 `\n` 전까지 **한 줄**을 읽어 문자열로 줍니다(`\n`은 빼고).
- C의 `scanf("%d", ...)`는 공백과 줄바꿈을 건너뛰고 **숫자 모양의 글자들**을 읽어 정수로 바꿉니다.
- Rust의 `read_line`은 `\n`까지 포함해 한 줄을 문자열에 **덧붙입니다**.

`85`는 정수가 아니라 글자 `8`과 `5`입니다. 이것을 정수 85로 바꾸는 일은 프로그래머가 직접 요청해야 합니다.

## 4. 천천히 풀어보기

### 4.1 출력 모양 다루기

Python `print`는 값 여러 개를 **쉼표**로 나열하면 사이에 공백을 넣고, 끝에 줄바꿈을 붙입니다. 이 두 가지를 `sep`과 `end`로 바꿀 수 있습니다.

| 코드                                   | 출력             |
| -------------------------------------- | ---------------- |
| `print("A", "B", "C")`                 | `A B C` + 줄바꿈 |
| `print("A", "B", "C", sep="-")`        | `A-B-C` + 줄바꿈 |
| `print("A", end="")` 다음 `print("B")` | `AB` + 줄바꿈    |
| `print()`                              | 빈 줄            |

C와 Rust는 줄바꿈을 **직접** 넣거나, 줄바꿈을 붙여 주는 함수를 고릅니다.

| 언어 | 줄바꿈 없음      | 줄바꿈 붙음                        |
| ---- | ---------------- | ---------------------------------- |
| C    | `printf("안녕")` | `printf("안녕\n")`, `puts("안녕")` |
| Rust | `print!("안녕")` | `println!("안녕")`                 |

### 4.2 이스케이프 문자

문자열 안에 줄바꿈이나 큰따옴표를 넣으려면 역슬래시 `\`로 시작하는 **이스케이프 문자**를 씁니다. 세 언어 모두 같습니다.

| 쓰는 법 | 뜻          | 쓰는 법 | 뜻            |
| ------- | ----------- | ------- | ------------- |
| `\n`    | 줄바꿈      | `\"`    | 큰따옴표      |
| `\t`    | 탭(칸 맞춤) | `\\`    | 역슬래시 자체 |

C의 `printf`에서는 `%`가 서식 문자의 시작이라, 퍼센트 기호를 출력하려면 `%%`라고 씁니다. Rust의 `println!`에서는 중괄호가 자리 표시라서 `{{`와 `}}`로 중괄호 자체를 출력합니다.

### 4.3 입력받고 바꾸기

| 단계                   | Python            | C                                | Rust                               |
| ---------------------- | ----------------- | -------------------------------- | ---------------------------------- |
| 한 줄 읽기             | `line = input()`  | (한 단어) `scanf("%31s", name)`  | `io::stdin().read_line(&mut line)` |
| 정수로 바꾸기          | `int(text)`       | `scanf("%d", &n)`이 읽으며 바꿈  | `text.trim().parse::<i32>()`       |
| 한 줄의 여러 값 나누기 | `line.split()`    | `scanf("%d %d", &a, &b)`         | `line.split_whitespace()`          |
| 바꾸기 실패            | `ValueError` 예외 | `scanf`의 반환값이 기대보다 작음 | `Err(...)` 값                      |

C의 `scanf`에서 변수 앞에 붙는 `&`는 "이 변수의 **위치(주소)**"를 뜻합니다. `scanf`가 읽은 값을 그 자리에 직접 써 넣어야 하기 때문에 필요합니다. 배열 `name` 앞에는 `&`를 붙이지 않는데, 배열 이름이 이미 위치를 뜻하기 때문입니다(Day 26, Day 30).

## 5. C로 구현하기

```c
// 파일: greet.c
#include <stdio.h>

int main(void) {
    char name[32];                       // 글자 31개 + 끝 표시 1개를 담을 배열
    int a, b;

    printf("이름: ");
    if (scanf("%31s", name) != 1) {      // 공백 전까지 한 단어를 읽는다
        return 1;
    }
    printf("점수 두 개: ");
    if (scanf("%d %d", &a, &b) != 2) {   // 정수 두 개를 읽어 a, b에 넣는다
        printf("\n정수 두 개를 입력하세요\n");
        return 1;
    }
    printf("\n");

    printf("안녕하세요, %s님!\n", name);
    printf("합계\t%d\n", a + b);         // \t는 탭(칸 맞춤)
    printf("평균\t%.1f\n", (a + b) / 2.0);
    printf("따옴표 \"와 역슬래시 \\도 출력할 수 있습니다\n");
    puts("끝");                          // puts는 문자열을 출력하고 줄을 바꾼다
    return 0;
}
```

입력:

```text
민지
85 92
```

실행 결과:

```text
이름: 점수 두 개:
안녕하세요, 민지님!
합계	177
평균	88.5
따옴표 "와 역슬래시 \도 출력할 수 있습니다
끝
```

첫 줄에 `이름: 점수 두 개: `가 붙어 나온 이유는 입력을 파일에서 흘려 보냈기 때문입니다. 키보드로 입력할 때는 사용자가 누른 글자와 Enter가 화면에 **메아리처럼** 보이므로 다음처럼 보입니다.

```text
이름: 민지
점수 두 개: 85 92

안녕하세요, 민지님!
...
```

### 코드 한 부분씩 읽기

| 코드                           | 설명                                                                                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `char name[32];`               | 글자를 32칸 담는 **배열**입니다. C 문자열은 끝에 "여기서 끝"이라는 표시 글자가 하나 더 필요해서 실제로는 31칸까지 씁니다(Day 37).                                                                 |
| `scanf("%31s", name)`          | 공백이나 줄바꿈 전까지 한 단어를 읽습니다. `31`은 **최대 31글자**만 읽으라는 제한입니다. 이 숫자를 빼면 긴 입력이 배열 밖을 덮어쓰는 위험한 버그가 됩니다. 한글은 한 글자가 3칸(바이트)을 씁니다. |
| `if (scanf(...) != 1)`         | `scanf`는 **성공적으로 읽은 값의 개수**를 돌려줍니다. 기대한 개수가 아니면 입력이 잘못된 것이므로 멈춥니다. `if`는 Day 13에서 배웁니다.                                                           |
| `scanf("%d %d", &a, &b)`       | 정수 두 개를 읽어 `a`와 `b`에 넣습니다. 사이의 공백이 한 칸이든 여러 칸이든, 줄바꿈이든 상관없습니다.                                                                                             |
| `printf("합계\t%d\n", a + b);` | `\t`는 탭입니다. 터미널에서 다음 칸 맞춤 위치까지 띄웁니다.                                                                                                                                       |
| `(a + b) / 2.0`                | `2.0`이 실수라서 나눗셈이 실수로 계산됩니다. `/ 2`였다면 88이 됩니다(Day 1).                                                                                                                      |
| `\"`, `\\`                     | 문자열 안의 큰따옴표와 역슬래시입니다.                                                                                                                                                            |
| `puts("끝");`                  | 문자열을 출력하고 **자동으로 줄을 바꿉니다**. 서식 문자는 쓸 수 없습니다.                                                                                                                         |

## 6. Python으로 구현하기

```python
# 파일: greet.py
name = input("이름: ")                  # 한 줄을 읽어 문자열로 돌려준다
line = input("점수 두 개: ")
a_text, b_text = line.split()           # 공백으로 나눠 두 조각으로
a = int(a_text)                         # 문자열 → 정수
b = int(b_text)
print()                                 # 빈 줄

print("안녕하세요,", name + "님!")
print("합계", a + b, sep="\t")
print("평균", (a + b) / 2, sep="\t")
print("입력값의 자료형:", type(line).__name__, "→", type(a).__name__)

# sep: 값 사이에 넣을 글자, end: 마지막에 붙일 글자(기본은 줄바꿈)
print("A", "B", "C", sep="-", end="!\n")
print("한 줄에", end=" ")
print("이어서 출력")
```

입력:

```text
민지
85 92
```

실행 결과:

```text
이름: 점수 두 개:
안녕하세요, 민지님!
합계	177
평균	88.5
입력값의 자료형: str → int
A-B-C!
한 줄에 이어서 출력
```

### 코드 한 부분씩 읽기

| 코드                                 | 설명                                                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `input("이름: ")`                    | 괄호 안의 문자열을 **안내 문구(프롬프트)** 로 출력한 뒤, 한 줄을 읽어 문자열로 돌려줍니다. 끝의 줄바꿈은 빠집니다.                  |
| `a_text, b_text = line.split()`      | `"85 92".split()`은 `["85", "92"]`입니다. 왼쪽에 이름을 두 개 쓰면 두 조각을 차례로 받습니다. 조각 수가 다르면 ValueError가 납니다. |
| `int(a_text)`                        | 문자열 `"85"`를 정수 85로 바꿉니다. `"85점"`처럼 숫자가 아닌 글자가 섞이면 ValueError가 납니다.                                     |
| `print("안녕하세요,", name + "님!")` | 쉼표로 나열한 값 사이에 공백이 들어갑니다. `name + "님!"`은 문자열 이어 붙이기라서 공백 없이 붙습니다.                              |
| `sep="\t"`                           | 값 사이에 공백 대신 탭을 넣습니다.                                                                                                  |
| `(a + b) / 2`                        | Python의 `/`는 실수 결과를 주므로 88.5입니다.                                                                                       |
| `end=" "`                            | 줄바꿈 대신 공백을 붙여, 다음 `print`가 같은 줄에 이어서 출력합니다.                                                                |

## 7. Rust로 구현하기

```rust
// 파일: greet.rs
use std::io::{self, Write};

fn main() {
    let mut name = String::new();        // 입력을 담을 빈 문자열
    print!("이름: ");
    io::stdout().flush().unwrap();       // print!는 줄바꿈이 없어 직접 내보낸다
    io::stdin().read_line(&mut name).unwrap();
    let name = name.trim();              // 끝의 줄바꿈 문자를 없앤다

    let mut line = String::new();
    print!("점수 두 개: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut line).unwrap();
    let mut parts = line.split_whitespace();
    let a: i32 = parts.next().unwrap().parse().unwrap();
    let b: i32 = parts.next().unwrap().parse().unwrap();
    println!();

    println!("안녕하세요, {name}님!");
    println!("합계\t{}", a + b);
    println!("평균\t{:.1}", (a + b) as f64 / 2.0);

    // 줄바꿈이 남아 있으면 정수로 바꿀 수 없다
    println!("{:?}", "2001\n".parse::<i32>());
    println!("{:?}", "2001\n".trim().parse::<i32>());
}
```

입력:

```text
민지
85 92
```

실행 결과:

```text
이름: 점수 두 개:
안녕하세요, 민지님!
합계	177
평균	88.5
Err(ParseIntError { kind: InvalidDigit })
Ok(2001)
```

### 코드 한 부분씩 읽기

| 코드                                       | 설명                                                                                                                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `use std::io::{self, Write};`              | 표준 라이브러리의 입출력 모듈 `io`와, `flush`를 쓰기 위한 `Write`를 가져옵니다.                                                                                                                             |
| `let mut name = String::new();`            | 입력을 **담을** 빈 문자열입니다. `read_line`이 여기에 글자를 덧붙이므로 `mut`가 필요합니다.                                                                                                                 |
| `io::stdout().flush().unwrap();`           | `print!`는 출력을 잠시 모아 두었다가 줄바꿈이 나올 때 한꺼번에 내보냅니다. 입력을 받기 전에 안내 문구가 보이도록 **즉시 내보내기(flush)** 를 합니다.                                                        |
| `io::stdin().read_line(&mut name)`         | 한 줄을 읽어 `name` 끝에 덧붙입니다. `&mut`는 "이 변수를 바꿔도 된다는 허락"을 뜻합니다(Day 33).                                                                                                            |
| `.unwrap()`                                | 입력이나 변환이 실패할 수 있는 작업은 성공(`Ok`)이나 실패(`Err`)를 담은 값을 돌려줍니다. `unwrap()`은 성공이면 안의 값을 꺼내고, 실패면 프로그램을 멈춥니다. 실패를 제대로 다루는 법은 Day 25에서 배웁니다. |
| `let name = name.trim();`                  | 끝의 `\n`을 없앤 문자열 조각으로 **섀도잉**합니다. 이렇게 하지 않으면 `민지\n님!`처럼 출력이 깨집니다.                                                                                                      |
| `line.split_whitespace()` / `parts.next()` | 공백으로 나눈 조각을 하나씩 꺼냅니다. 줄바꿈도 공백으로 취급합니다.                                                                                                                                         |
| `.parse().unwrap()` 와 `let a: i32`        | `parse`는 여러 자료형으로 바꿀 수 있어서, 무엇으로 바꿀지 `: i32`로 알려 줍니다.                                                                                                                            |
| `"2001\n".parse::<i32>()`                  | 줄바꿈이 남은 문자열은 정수가 될 수 없어 `Err`입니다. `trim()` 뒤에는 `Ok(2001)`입니다. `::<i32>`는 자료형을 알려 주는 다른 방법입니다.                                                                     |

## 8. 실행 추적

같은 입력이 세 언어에서 어떤 값으로 바뀌는지 따라갑니다.

| 단계         | 입력 흐름에서 읽은 것 | Python             | C                            | Rust                                |
| ------------ | --------------------- | ------------------ | ---------------------------- | ----------------------------------- |
| 이름 읽기    | `민지\n`              | `name = "민지"`    | `name`에 `민지` + 끝 표시    | `name = "민지\n"` → trim → `"민지"` |
| 점수 줄 읽기 | `85 92\n`             | `line = "85 92"`   | (`scanf`가 바로 숫자를 읽음) | `line = "85 92\n"`                  |
| 나누기       |                       | `["85", "92"]`     | `%d %d`                      | 조각 `"85"`, `"92"`                 |
| 정수로       |                       | `a = 85`, `b = 92` | `a = 85`, `b = 92`           | `a = 85`, `b = 92`                  |
| 계산 출력    |                       | `177`, `88.5`      | `177`, `88.5`                | `177`, `88.5`                       |

## 9. 다른 예제로 다시 이해하기

태어난 해를 입력받아 올해(2026년) 나이를 계산해 봅시다. 입력을 **정수로 바꾸는 것을 잊으면** 어떻게 되는지도 함께 봅니다.

```python
# 파일: age.py
year_text = input("태어난 해: ")
print()
print("입력받은 값:", repr(year_text), type(year_text).__name__)

year = int(year_text)
age = 2026 - year
print(f"2026년에 {age}살이 됩니다")
print("10년 뒤:", age + 10, "살", sep="")
```

입력:

```text
2001
```

실행 결과:

```text
태어난 해:
입력받은 값: '2001' str
2026년에 25살이 됩니다
10년 뒤:35살
```

`repr`로 보면 `'2001'`에 따옴표가 붙어 있습니다. 숫자처럼 보여도 **문자열**이라는 뜻입니다. `2026 - year_text`라고 쓰면 정수에서 문자열을 뺄 수 없어 TypeError가 납니다. 마지막 줄은 `sep=""`이라 값들이 공백 없이 붙었습니다.

같은 계산을 C로 하면 `scanf`의 반환값으로 **잘못된 입력**도 알아챌 수 있습니다.

```c
// 파일: age.c
#include <stdio.h>

int main(void) {
    int year;
    printf("태어난 해: ");
    int count = scanf("%d", &year);
    printf("\nscanf가 읽은 개수: %d\n", count);
    if (count != 1) {
        printf("숫자를 입력해 주세요\n");
        return 1;
    }
    printf("2026년에 %d살이 됩니다\n", 2026 - year);
    return 0;
}
```

입력:

```text
2001
```

실행 결과:

```text
태어난 해:
scanf가 읽은 개수: 1
2026년에 25살이 됩니다
```

`2001` 대신 `이천일`을 입력하면 `scanf`가 정수를 하나도 읽지 못해 0을 돌려주고, 프로그램은 "숫자를 입력해 주세요"를 출력하고 끝납니다. 반환값을 검사하지 않으면 `year`에는 아무 값도 들어가지 않은 채로 계산이 진행됩니다. **입력은 언제든 잘못될 수 있다**는 것을 기억하세요.

## 10. 출력 함수 한눈에 보기

| 하고 싶은 일           | Python                        | C                              | Rust                  |
| ---------------------- | ----------------------------- | ------------------------------ | --------------------- |
| 줄바꿈 있는 출력       | `print(x)`                    | `printf("%d\n", x)`, `puts(s)` | `println!("{x}")`     |
| 줄바꿈 없는 출력       | `print(x, end="")`            | `printf("%d", x)`              | `print!("{x}")`       |
| 값 여러 개             | `print(a, b)` (공백으로 구분) | `printf("%d %d\n", a, b)`      | `println!("{a} {b}")` |
| 오류 메시지(표준 오류) | `print(x, file=sys.stderr)`   | `fprintf(stderr, ...)`         | `eprintln!(...)`      |

**표준 오류(standard error)** 는 오류 메시지를 위한 세 번째 통로입니다. 화면에는 똑같이 보이지만, 출력을 파일로 저장할 때 오류 메시지는 섞이지 않게 따로 다룰 수 있습니다.

## 11. 세 언어 비교

| 관점             | Python                   | C                                     | Rust                                    |
| ---------------- | ------------------------ | ------------------------------------- | --------------------------------------- |
| 입력 결과        | 항상 `str`               | 서식 문자대로 바로 변환               | 항상 `String` (줄바꿈 포함)             |
| 정수 변환        | `int(s)`                 | `%d`                                  | `s.trim().parse::<i32>()`               |
| 변환 실패        | `ValueError` 예외로 멈춤 | 반환값으로 알려 줌(검사 안 하면 모름) | `Err` 값으로 알려 줌(`unwrap`이면 멈춤) |
| 안내 문구        | `input("안내")`          | `printf("안내")`                      | `print!("안내")` + `flush`              |
| 문자열 길이 제한 | 없음                     | 배열 크기, `%31s`로 직접 제한         | 없음(필요한 만큼 늘어남)                |

## 12. 자주 하는 실수

### 실수 1: 입력을 정수로 바꾸지 않고 계산한다 (Python)

```python
# 파일: no_int.py (실행 오류: TypeError)
year = "2001"          # input()으로 받은 값
print(2026 - year)
```

```text
TypeError: unsupported operand type(s) for -: 'int' and 'str'
```

### 실수 2: 공백이 섞인 문자열을 한 번에 int로 바꾼다 (Python)

```python
# 파일: split_first.py (실행 오류: ValueError)
line = "85 92"
print(int(line))
```

```text
ValueError: invalid literal for int() with base 10: '85 92'
```

먼저 `split()`으로 나눈 뒤 조각마다 바꿉니다.

### 실수 3: scanf에서 &를 빠뜨린다 (C)

```c
// 파일: no_ampersand.c (컴파일 오류: expects argument of type 'int *')
#include <stdio.h>

int main(void) {
    int age;
    if (scanf("%d", age) != 1) return 1;
    printf("%d\n", age);
    return 0;
}
```

`&` 없이 `age`의 **값**(아직 정해지지 않은 쓰레기 값)을 넘기면, `scanf`는 그 값을 주소로 착각하고 엉뚱한 곳에 쓰려고 합니다. 경고 옵션을 켜면 컴파일러가 막아 줍니다.

### 실수 4: printf 서식과 값의 자료형이 다르다 (C)

실습의 디버그 문제입니다. `double`에 `%d`를 쓰면 엉뚱한 값이 나옵니다. **항상 `-Wall`을 켜고 컴파일하세요.**

### 실수 5: trim 없이 parse한다 (Rust)

```rust
// 파일: no_trim.rs (실행 오류: InvalidDigit)
fn main() {
    let line = String::from("2001\n");       // read_line으로 받은 것
    let year: i32 = line.parse().unwrap();
    println!("{}", 2026 - year);
}
```

```text
called `Result::unwrap()` on an `Err` value: ParseIntError { kind: InvalidDigit }
```

## 13. Q&A

**Q. `input()` 안의 안내 문구는 꼭 써야 하나요?**

A. 아닙니다. 하지만 사용자가 무엇을 입력해야 하는지 알 수 있도록 쓰는 것이 좋습니다. 문제 풀이 사이트처럼 입력을 파일로 주는 곳에서는 안내 문구가 출력 결과에 섞여 **오답**이 되니 빼야 합니다.

**Q. C에서 공백이 들어간 이름(예: "김 민지")을 읽으려면요?**

A. `scanf("%s")`는 공백에서 멈추므로 "김"만 읽습니다. 한 줄 전체는 `fgets(name, sizeof name, stdin)`으로 읽습니다. `fgets`도 끝에 줄바꿈을 담는다는 점은 Rust의 `read_line`과 같습니다(Day 37, Day 46).

**Q. Rust는 왜 입력이 이렇게 복잡한가요?**

A. 입력은 실패할 수 있는 작업(입력이 끊김, 숫자가 아님)이라서, Rust는 실패 가능성을 `Result`로 드러내고 프로그래머가 처리하게 합니다. 지금은 `unwrap()`으로 "실패하면 멈춰라"라고 간단히 처리했습니다. Day 25에서 실패를 제대로 다루는 법을 배우면 이 코드가 훨씬 자연스러워집니다.

**Q. print와 printf 중 어느 것이 빠른가요?**

A. 입문 단계에서는 신경 쓰지 않아도 됩니다. 다만 출력이 수십만 줄이 되면, 출력을 한꺼번에 모아서 내보내는 것이 한 줄씩 내보내는 것보다 훨씬 빠릅니다. Rust의 `flush`가 그 "모아 두기"와 관련이 있습니다.

## 14. 핵심 요약

- 표준 출력은 프로그램이 글자를 내보내는 통로, 표준 입력은 글자를 받아들이는 통로입니다.
- 출력 모양: Python은 `sep`, `end`, C는 `\n`, `\t` 같은 이스케이프 문자와 `puts`, Rust는 `print!`와 `println!`.
- 입력은 **항상 글자**로 들어옵니다. Python `int()`, C `scanf("%d", &x)`, Rust `trim().parse()`로 정수로 바꿉니다.
- 한 줄의 여러 값: Python `split()`, C `scanf("%d %d", ...)`, Rust `split_whitespace()`.
- C `scanf`는 변수에 `&`를 붙이고, 반환값(읽은 개수)을 검사합니다. 문자열은 `%31s`처럼 길이를 제한합니다.
- Rust `read_line`은 줄바꿈까지 담으므로 `trim()`을 먼저 합니다.

## 15. 도전 문제

1. **(Python)** 가로와 세로를 한 줄에 입력받아(`5 3`) 넓이와 둘레를 출력하세요.
2. **(C)** 정수 세 개를 입력받아 합계와 평균(소수점 둘째 자리)을 출력하세요. `scanf`의 반환값이 3이 아니면 오류 메시지를 출력하세요.
3. **(Rust)** 이름을 입력받아 `"[이름]님, 환영합니다!"`를 출력하세요. `trim()`을 빼면 출력이 어떻게 달라지는지 확인해 보세요.
4. **(세 언어)** 탭(`\t`)을 이용해 과목, 시간, 달성률을 표처럼 세 줄로 출력해 보세요. 한글 과목 이름의 길이가 달라지면 칸이 어떻게 되는지 관찰하세요(Day 9에서 해결합니다).
