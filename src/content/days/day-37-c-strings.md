---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-37-c-strings
courseId: crp-92
phaseId: phase-04
dayNumber: 37
date: "2026-11-06"
title: C 문자열과 널 종료
summary: C 문자열은 끝에 널 문자 '\0'을 둔 char 배열입니다. strlen과 sizeof의 차이, '\0'까지 세는 반복, 한글이 UTF-8로 3바이트씩 차지하는 것, strcpy·strncat의 위험과 snprintf로 안전하게 만들기, strcmp로 비교하기, strchr로 찾기, ctype.h 함수, printf의 폭이 바이트로 세어진다는 점을 다룹니다. 길이를 따로 저장하는 Python str과 Rust String·&str과 비교하고, 설정 파일의 'key = value' 줄을 정해진 크기의 버퍼에 안전하게 나누어 담는 프로그램을 세 언어로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-36-rust-slices]
learningObjectives:
  - C 문자열이 '\0'으로 끝나는 char 배열이라는 것을 설명하고, strlen과 sizeof의 차이를 구별한다.
  - "'\\0'까지 도는 반복으로 문자열을 처리하고, ctype.h 함수를 unsigned char로 바꿔 부른다."
  - strcpy가 넘칠 수 있는 이유를 설명하고, snprintf와 크기 검사로 안전하게 복사·연결한다.
  - strcmp로 문자열 내용을 비교하고, ==가 주소를 비교한다는 것을 설명한다.
  - Python str과 Rust String·&str이 길이를 어떻게 다루는지 비교하고, 글자 수와 바이트 수를 구별한다.
concepts:
  [
    c string,
    null terminator,
    char array,
    string literal,
    strlen,
    sizeof,
    strcpy,
    snprintf,
    strncat,
    strcmp,
    strchr,
    ctype,
    utf-8,
    byte length,
    buffer overflow,
  ]
runnerMode: python
playgroundSource: |
  # 파일: py_strings.py — 글자 수와 바이트 수를 비교해 보세요.
  for s in ["cat", "한글", "a\0b", "😀"]:
      print(repr(s), "글자", len(s), "UTF-8 바이트", len(s.encode("utf-8")))
  print(f"[{'ab':<6}][{'한글':<6}]")   # 폭은 글자 수 기준
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day37-predict-c
    title: 가운데에 널 문자를 넣은 문자열 예측하기
    kind: predict
    objective: "'\\0'을 만나면 문자열이 끝난다는 것과 sizeof가 배열 크기라는 것을 추적한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char s[10] = "hello";
          s[2] = '\0';
          printf("%s %zu %zu\n", s, strlen(s), sizeof s);
          return 0;
      }
    answer: "he 2 10"
    hint: "printf의 %s와 strlen은 '\\0'을 만나면 멈춥니다. sizeof는 배열이 차지한 칸 수입니다."
    explanation: "s[2]에 널 문자를 넣으면 h, e 다음에서 문자열이 끝난 것으로 봅니다. 뒤의 l, l, o는 메모리에 그대로 남아 있지만 %s와 strlen에는 보이지 않습니다. sizeof s는 선언한 배열 크기 10으로, 내용과 상관없습니다."
    commonMistakes:
      - "sizeof s를 내용 길이(2)나 원래 길이(5)로 적음"
      - "'\\0' 뒤의 llo도 출력된다고 생각함"
    language: c
    verification: run
  - id: ex-day37-predict-py
    title: 글자 수와 바이트 수 예측하기
    kind: predict
    objective: Python의 len이 글자 수를 세고, UTF-8 바이트 수는 다르다는 것을 확인한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      s = "한글abc"
      print(len(s), len(s.encode()))
    answer: "5 9"
    hint: "len(s)는 글자 수입니다. encode()는 기본으로 UTF-8 바이트를 만들고, 한글 한 글자는 3바이트입니다."
    explanation: '글자는 한, 글, a, b, c 다섯 개입니다. UTF-8에서 한글은 3바이트, 영문은 1바이트라 3 + 3 + 1 + 1 + 1 = 9바이트입니다. C의 strlen("한글abc")은 9, Rust의 "한글abc".len()도 9이고, 글자 수는 Rust에서 chars().count()로 구합니다.'
    commonMistakes:
      - "한글도 1바이트로 세어 5 5로 적음"
      - "Python의 len이 바이트 수라고 생각함"
    language: python
    verification: run
  - id: ex-day37-fill
    title: 널 문자까지 도는 반복 채우기
    kind: fill
    objective: 문자열 끝을 '\0'으로 알아내는 반복을 쓴다.
    prompt: '빈칸을 채워 "banana"에 들어 있는 ''a''의 개수 ''3''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>

      int count_char(const char *s, char c) {
          int n = 0;
          for (int i = 0; s[i] != _____; i++) {
              if (s[i] == c) {
                  n++;
              }
          }
          return n;
      }

      int main(void) {
          printf("%d\n", count_char("banana", 'a'));
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int count_char(const char *s, char c) {
          int n = 0;
          for (int i = 0; s[i] != '\0'; i++) {
              if (s[i] == c) {
                  n++;
              }
          }
          return n;
      }

      int main(void) {
          printf("%d\n", count_char("banana", 'a'));
          return 0;
      }
    output: "3"
    hint: "C 문자열의 길이를 알 수 있는 유일한 표시는 마지막에 있는 값이 0인 문자입니다."
    explanation: "함수는 길이를 받지 않았지만, 문자열 끝의 '\\0'이 멈출 곳을 알려 줍니다(Day 34의 '끝 표시'). '\\0' 대신 0을 써도 같습니다. 반복마다 strlen(s)를 부르면 매번 처음부터 세게 되어 느려지므로, 이렇게 '\\0'을 직접 확인하는 방식이 흔합니다."
    commonMistakes:
      - "'0'(숫자 문자, 값 48)을 써서 끝을 찾지 못함"
      - "\"\\0\"(문자열)을 써서 포인터와 비교하는 오류가 남"
    language: c
    verification: run
  - id: ex-day37-modify
    title: strcpy·strcat을 snprintf로 바꾸기
    kind: modify
    objective: 버퍼 크기를 넘지 않는 문자열 만들기로 바꾼다.
    prompt: "make_tag는 strcpy와 strcat으로 이름표를 만들어 tag[8]을 넘칠 수 있습니다. snprintf로 바꿔 넘치면 잘리게 하고, 필요했던 길이를 돌려주게 하세요. 출력은 '[Momo-Ki] 필요 8'입니다."
    starter: |-
      #include <stdio.h>
      #include <string.h>

      int make_tag(char *out, size_t size, const char *first, const char *last) {
          (void)size;
          strcpy(out, first);
          strcat(out, "-");
          strcat(out, last);
          return (int)strlen(out);
      }

      int main(void) {
          char tag[8];
          int need = make_tag(tag, sizeof tag, "Momo", "Kim");
          printf("[%s] 필요 %d\n", tag, need);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int make_tag(char *out, size_t size, const char *first, const char *last) {
          return snprintf(out, size, "%s-%s", first, last);
      }

      int main(void) {
          char tag[8];
          int need = make_tag(tag, sizeof tag, "Momo", "Kim");
          printf("[%s] 필요 %d\n", tag, need);
          return 0;
      }
    output: "[Momo-Ki] 필요 8"
    hint: "snprintf(out, size, 형식, ...)은 '\\0'을 포함해 size바이트까지만 쓰고, 공간이 넉넉했다면 쓸 글자 수를 돌려줍니다."
    explanation: "\"Momo-Kim\"은 8글자라 '\\0'까지 9바이트가 필요한데 tag는 8바이트입니다. strcpy·strcat은 크기를 모르므로 배열 밖에 써 버립니다(정의되지 않은 동작). snprintf는 7글자와 '\\0'만 써서 \"Momo-Ki\"로 자르고, 8을 돌려줍니다. need >= size이면 잘렸다는 뜻이라 호출한 쪽이 확인할 수 있습니다."
    commonMistakes:
      - "sizeof out으로 크기를 구해 포인터 크기(8)를 쓰게 됨(우연히 맞아도 틀린 방법)"
      - "snprintf의 반환값이 실제로 쓴 글자 수(7)라고 생각함"
    language: c
    verification: run
  - id: ex-day37-debug
    title: ==로 문자열을 비교하는 코드 고치기
    kind: debug
    objective: 문자열 내용 비교에 strcmp를 쓴다.
    prompt: "이 코드는 'comparison with string literal results in unspecified behavior' 경고(이 과정에서는 오류)로 컴파일되지 않습니다. strcmp로 고쳐 '정답'이 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          char answer[8] = "cat";
          if (answer == "cat") {
              printf("정답\n");
          }
          return 0;
      }
    answer: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char answer[8] = "cat";
          if (strcmp(answer, "cat") == 0) {
              printf("정답\n");
          }
          return 0;
      }
    output: "정답"
    hint: "배열 이름과 문자열 리터럴은 둘 다 주소로 바뀝니다. ==는 주소가 같은지를 봅니다."
    explanation: 'answer는 main의 배열 주소이고 "cat"은 읽기 전용 영역 어딘가의 주소라, 내용이 같아도 ==는 거짓입니다. strcmp는 한 글자씩 비교해 같으면 0, 앞이 작으면 음수, 크면 양수를 돌려줍니다. 그래서 반드시 == 0과 비교해야 합니다. Python과 Rust의 ==는 내용을 비교합니다.'
    commonMistakes:
      - 'if (strcmp(answer, "cat"))로 써서 같을 때 거짓이 됨'
      - "string.h를 포함하지 않음"
    language: c
    verification: run
  - id: ex-day37-independent
    title: Rust로 글자 단위 뒤집기
    kind: independent
    objective: 바이트가 아니라 글자(char) 단위로 문자열을 다룬다.
    prompt: '"가나다abc"를 글자 단위로 뒤집은 문자열, 글자 수, 바이트 수를 공백으로 구분해 출력하세요. 결과는 ''cba다나가 6 12''입니다.'
    starter: |-
      fn main() {
          let s = "가나다abc";
          println!("{s}");
      }
    answer: |-
      fn main() {
          let s = "가나다abc";
          let reversed: String = s.chars().rev().collect();
          println!("{} {} {}", reversed, s.chars().count(), s.len());
      }
    output: "cba다나가 6 12"
    hint: "chars()는 글자를 하나씩 줍니다. rev()로 거꾸로 돌리고 collect()로 String에 모으세요."
    explanation: "한글 세 글자가 9바이트, 영문 세 글자가 3바이트라 12바이트입니다. 바이트를 뒤집으면 한글의 3바이트 순서가 뒤집혀 올바른 UTF-8이 아니게 됩니다. C에서 같은 일을 하려면 UTF-8 규칙을 직접 해석해야 해서 훨씬 어렵습니다(Day 38)."
    commonMistakes:
      - "s.len()이 글자 수라고 생각함"
      - "s.bytes().rev()로 바이트를 뒤집어 String으로 만들려 함"
    language: rust
    verification: run
quiz:
  - id: quiz-day37-01
    question: char s[8] = "cat";일 때 strlen(s)와 sizeof s는?
    choices:
      - 3과 3
      - 3과 8
      - 4와 8
      - 8과 8
    answerIndex: 1
    explanation: strlen은 '\0' 앞까지의 글자 수(3), sizeof는 배열 크기(8바이트)입니다. 문자열 "cat"은 '\0'까지 4바이트가 필요해 char s[4]면 딱 맞고, char s[3]이면 '\0'이 들어갈 자리가 없습니다.
  - id: quiz-day37-02
    question: C에서 두 문자열의 내용이 같은지 확인하는 올바른 방법은?
    choices:
      - "a == b"
      - "strcmp(a, b) == 0"
      - "strcmp(a, b) == 1"
      - "strlen(a) == strlen(b)"
    answerIndex: 1
    explanation: ==는 두 주소를 비교합니다. strcmp는 같으면 0을 돌려주므로 == 0으로 확인합니다. 길이만 같다고 내용이 같지는 않습니다.
  - id: quiz-day37-03
    question: snprintf(buf, 5, "%s", "abcdef")를 실행한 뒤 buf와 반환값은?
    choices:
      - '"abcdef"와 6(넘쳐서 씀)'
      - '"abcd"와 6'
      - '"abcde"와 5'
      - '"abcd"와 4'
    answerIndex: 1
    explanation: 5바이트 중 마지막은 '\0' 자리라 네 글자만 들어갑니다. 반환값은 공간이 충분했다면 썼을 글자 수 6입니다. 반환값이 크기 이상이면 잘렸다는 뜻입니다.
  - id: quiz-day37-04
    question: printf("[%-6s]", "한글")의 결과에서 대괄호 안 공백은 몇 칸인가?
    choices:
      - 4칸(글자 수 2를 뺀 나머지)
      - 0칸(한글 6바이트가 이미 폭 6을 채움)
      - 6칸
      - 오류
    answerIndex: 1
    explanation: C의 폭은 바이트 수로 셉니다. "한글"은 UTF-8로 6바이트라 폭 6을 이미 채워 공백이 붙지 않습니다. Python의 f"{s:<6}"과 Rust의 {:<6}은 글자 수로 세어 공백 4칸을 붙입니다. 그래서 표를 맞출 때 C에서는 영문 레이블을 쓰는 것이 안전합니다.
  - id: quiz-day37-05
    question: toupper(c)를 부르기 전에 (unsigned char)로 바꾸는 이유는?
    choices:
      - 속도를 위해
      - char가 부호 있는 자료형이면 한글 바이트처럼 128 이상인 값이 음수가 되어, ctype 함수에 넘기면 정의되지 않은 동작이기 때문
      - 대문자가 음수라서
      - 필요 없다
    answerIndex: 1
    explanation: ctype.h 함수는 unsigned char 범위의 값이나 EOF만 받도록 정해져 있습니다. 많은 컴퓨터에서 char는 부호가 있어서, UTF-8의 바이트(0x80 이상)가 음수가 됩니다. (unsigned char)로 바꿔 넘기는 것이 안전한 습관입니다.
---

## 1. 오늘 배울 내용

Day 34에서 배열에 길이를 알리는 방법으로 **끝 표시(sentinel)** 를 잠깐 봤습니다. C 문자열이 바로 그 방식입니다. 오늘은 C 문자열을 제대로 다룹니다.

1. C 문자열은 끝에 **널 문자 `'\0'`** 을 둔 `char` 배열입니다.
   - `strlen`은 `'\0'` 앞까지의 글자 수, `sizeof`는 배열 크기입니다.
   - 한글은 UTF-8로 한 글자에 3바이트를 차지합니다.
2. `'\0'`까지 도는 반복으로 문자열을 직접 처리합니다.
3. 표준 함수들을 안전하게 씁니다.
   - 복사·연결: `strcpy`, `strcat`이 넘칠 수 있는 이유, `snprintf`와 `strncat`
   - 비교: `strcmp` (`==`는 주소 비교)
   - 찾기: `strchr`
   - 글자 검사: `isdigit`, `isspace`, `toupper` (`unsigned char`로 바꿔 부르기)
4. `printf`의 폭(`%-6s`)이 **바이트**로 세어진다는 점을 봅니다.
5. 길이를 따로 저장하는 Python `str`, Rust `String`·`&str`과 비교합니다.
6. 설정 파일의 `key = value` 줄을 정해진 크기의 버퍼에 **넘치지 않게** 나누는 프로그램을 만듭니다.

## 2. 왜 필요한가

C 문자열은 운영체제, 파일 경로, 네트워크 프로토콜, 다른 언어와의 연결(FFI) 등 어디에나 있습니다. Python과 Rust도 운영체제와 이야기할 때는 결국 `'\0'`으로 끝나는 바이트열을 주고받습니다.

그리고 C 문자열은 역사상 가장 많은 보안 사고를 일으킨 곳이기도 합니다.

- `strcpy`로 긴 입력을 작은 배열에 복사해 뒤의 메모리를 덮어씁니다(버퍼 오버플로).
- `'\0'` 자리를 빼먹어 문자열이 끝나지 않고, `printf`가 메모리를 계속 읽습니다.
- 크기 계산에서 `+ 1`(널 문자 자리)을 빼먹는 실수가 흔합니다.

오늘 배우는 규칙(크기를 함께 넘기기, `snprintf` 쓰기, 반환값 확인하기)은 C 코드를 읽고 쓸 때 가장 먼저 확인해야 할 것들입니다.

## 3. 그림으로 이해하기

`char word[8] = "cat";`의 메모리입니다.

```text
word  ┌────┬────┬────┬────┬────┬────┬────┬────┐
      │ 'c'│ 'a'│ 't'│ \0 │ \0 │ \0 │ \0 │ \0 │
      └────┴────┴────┴────┴────┴────┴────┴────┘
        0    1    2    3    4    5    6    7
strlen(word) = 3   ← '\0'을 만날 때까지 센 수
sizeof word  = 8   ← 배열 전체 크기(남는 칸은 0으로 채워짐)
```

한글 `"한글"`은 UTF-8로 6바이트이고, 끝의 `'\0'`까지 7바이트입니다.

```text
hangul ┌────┬────┬────┬────┬────┬────┬────┐
       │ ED │ 95 │ 9C │ EA │ B8 │ 80 │ \0 │
       └────┴────┴────┴────┴────┴────┴────┘
         └── '한' ──┘   └── '글' ──┘
strlen = 6(바이트), sizeof = 7
```

`snprintf(small, 5, "%s-%s", "ab", "cdef")`는 5바이트 중 마지막을 **반드시 `'\0'`** 으로 남깁니다.

```text
하고 싶었던 것: a b - c d e f \0   (8바이트 필요, 글자 7개)
small[5]:      ┌───┬───┬───┬───┬────┐
               │ a │ b │ - │ c │ \0 │    → "ab-c", 반환값 7
               └───┴───┴───┴───┴────┘
```

## 4. 천천히 풀어보기

### 4.1 문자열 리터럴과 char 배열

| 선언                     | 뜻                                                          | 바꿀 수 있나 |
| ------------------------ | ----------------------------------------------------------- | ------------ |
| `char s[] = "cat";`      | 크기 4인 배열을 만들고 `c a t \0`을 **복사**                | 예           |
| `char s[8] = "cat";`     | 크기 8, 남는 칸은 `'\0'`                                    | 예           |
| `const char *p = "cat";` | 읽기 전용 영역의 리터럴을 **가리키는** 포인터               | 아니요       |
| `char s[3] = "cat";`     | C에서는 허용되지만 `'\0'`이 들어가지 않아 **문자열이 아님** | 위험         |

`char *p = "cat"; p[0] = 'b';`는 컴파일은 되지만 정의되지 않은 동작입니다(대부분 프로그램이 멈춤). 리터럴은 `const char *`로 가리키는 습관을 들이세요.

### 4.2 표준 함수 한눈에 보기

| 함수                            | 하는 일                                  | 주의                                      |
| ------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `strlen(s)`                     | `'\0'` 앞까지의 바이트 수                | 매번 처음부터 셈. 반복 조건에 넣으면 느림 |
| `strcpy(dst, src)`              | `src`를 `'\0'`까지 복사                  | `dst`의 크기를 모름 → 넘칠 수 있음        |
| `strcat(dst, src)`              | `dst` 끝에 이어 붙임                     | 같은 문제                                 |
| `strncat(dst, src, n)`          | 최대 `n`글자를 붙이고 `'\0'`을 넣음      | `n`은 **남은 공간 - 1**로 계산해야 함     |
| `snprintf(dst, size, fmt, ...)` | 형식대로 만들되 `size`바이트를 넘지 않음 | 반환값 ≥ `size`면 잘린 것                 |
| `strcmp(a, b)`                  | 같으면 0, 앞이 작으면 음수, 크면 양수    | `== 0`으로 비교해야 함                    |
| `strchr(s, c)`                  | 처음 나오는 `c`의 주소, 없으면 `NULL`    | 결과를 쓰기 전에 `NULL` 검사              |

`strncpy`는 이름과 달리 "안전한 strcpy"가 아닙니다. 공간이 모자라면 `'\0'`을 넣지 않기 때문에, 이 과정에서는 `snprintf`나 길이를 확인한 뒤의 `memcpy`를 씁니다.

### 4.3 ctype.h와 unsigned char

`isdigit`, `isspace`, `isalpha`, `toupper`, `tolower`는 한 **바이트**를 검사하거나 바꿉니다. 인자는 `unsigned char` 범위여야 하므로 `(unsigned char)c`로 바꿔 넘깁니다. 한글처럼 여러 바이트로 된 글자는 이 함수들로 다룰 수 없습니다.

### 4.4 폭은 바이트로 센다

`printf("%-6s", s)`의 6은 **바이트** 수입니다. 영문은 한 글자가 1바이트라 문제가 없지만, 한글은 한 글자가 3바이트라 표의 줄이 어긋납니다. C로 표를 맞출 때는 폭을 쓰는 칸에 영문을 두거나, 글자 폭을 직접 계산해야 합니다.

## 5. C로 구현하기

```c
// 파일: c_strings.c
#include <ctype.h>
#include <stdio.h>
#include <string.h>

size_t my_strlen(const char *s) {           // '\0'을 만날 때까지 센다
    size_t n = 0;
    while (s[n] != '\0') {
        n++;
    }
    return n;
}

void to_upper(char *s) {                    // 제자리에서 대문자로
    for (; *s != '\0'; s++) {
        *s = (char)toupper((unsigned char)*s);
    }
}

int join_dash(char *out, size_t size, const char *a, const char *b) {
    return snprintf(out, size, "%s-%s", a, b);   // 넘치면 자르고, 필요했던 길이를 돌려준다
}

int main(void) {
    char word[8] = "cat";                   // c a t \0 \0 \0 \0 \0
    printf("strlen %zu, sizeof %zu\n", strlen(word), sizeof word);
    printf("my_strlen %zu\n", my_strlen(word));
    printf("word[3] 값 %d (널 문자)\n", word[3]);

    char hangul[] = "한글";                   // UTF-8로 한 글자 3바이트
    printf("\"한글\" strlen %zu, sizeof %zu\n", strlen(hangul), sizeof hangul);

    char copy[8];
    strcpy(copy, word);                     // copy에 충분한 공간이 있을 때만 안전
    to_upper(copy);
    printf("copy %s, word %s\n", copy, word);

    char small[5];
    int need = join_dash(small, sizeof small, "ab", "cdef");
    printf("snprintf: \"%s\" (필요했던 길이 %d)\n", small, need);   // 잘려도 '\0'은 넣는다

    char line[16] = "Hi";
    strncat(line, ", C!", sizeof line - strlen(line) - 1);   // 남은 공간만큼만 붙인다
    printf("strncat: %s\n", line);

    printf("strcmp: %d %d %d\n",
           strcmp("apple", "apple") == 0,
           strcmp("apple", "banana") < 0,
           strcmp("b", "a") > 0);

    const char *found = strchr("key=value", '=');
    printf("strchr: '=' 뒤는 %s\n", found + 1);

    int digits = 0;
    for (const char *p = "a1b22c333"; *p; p++) {
        if (isdigit((unsigned char)*p)) {
            digits++;
        }
    }
    printf("숫자 개수 %d\n", digits);
    printf("[%-6s][%6s]\n", "ab", "cd");    // 폭은 바이트 수 기준
    return 0;
}
```

실행 결과:

```text
strlen 3, sizeof 8
my_strlen 3
word[3] 값 0 (널 문자)
"한글" strlen 6, sizeof 7
copy CAT, word cat
snprintf: "ab-c" (필요했던 길이 7)
strncat: Hi, C!
strcmp: 1 1 1
strchr: '=' 뒤는 value
숫자 개수 6
[ab    ][    cd]
```

### 코드 한 부분씩 읽기

| 코드                                                     | 설명                                                                                                                             |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `while (s[n] != '\0') { n++; }`                          | `strlen`을 직접 만든 것입니다. 끝 표시가 없는 배열을 넘기면 멈추지 않고 배열 밖을 읽습니다.                                      |
| `for (; *s != '\0'; s++)`                                | 포인터를 한 칸씩 옮기며 도는 모양입니다. `*s = (char)toupper((unsigned char)*s);`로 제자리에서 바꿉니다.                         |
| `char hangul[] = "한글";`                                | 크기를 적지 않으면 리터럴 크기(6바이트 + `'\0'`)에 맞춰 7칸 배열이 됩니다.                                                       |
| `strcpy(copy, word);`                                    | `copy`가 8칸이고 `word`의 내용이 3글자라 안전합니다. 이 판단은 컴파일러가 아니라 **프로그래머**가 합니다.                        |
| `snprintf(out, size, "%s-%s", a, b)`                     | 7글자가 필요했지만 `small`이 5칸이라 4글자와 `'\0'`만 썼습니다. 반환값 7로 잘린 것을 알 수 있습니다.                             |
| `strncat(line, ", C!", sizeof line - strlen(line) - 1);` | 남은 공간 = 전체 16 - 이미 쓴 2 - `'\0'` 자리 1 = 13글자까지 붙일 수 있습니다. 이 계산이 틀리기 쉬워 `snprintf`가 더 권장됩니다. |
| `strcmp("apple", "banana") < 0`                          | 첫 글자 `a`(97)가 `b`(98)보다 작아 음수입니다. 정확한 음수 값은 정해져 있지 않아 부호만 봅니다.                                  |
| `strchr("key=value", '=')` / `found + 1`                 | `'='`의 주소를 받아 한 칸 뒤부터 출력했습니다. 새 문자열을 만들지 않고 원래 문자열의 뒤쪽을 가리킨 것입니다.                     |

## 6. Python으로 구현하기

```python
# 파일: py_strings.py
word = "cat"
print("len", len(word))                     # 끝 표시 없이 길이를 저장해 둔다
hangul = "한글"
print('"한글" len', len(hangul), "UTF-8 바이트", len(hangul.encode("utf-8")))

copy = word.upper()                         # 새 문자열을 만든다(원본은 그대로)
print("copy", copy, "word", word)

try:
    word[0] = "b"                           # 문자열은 바꿀 수 없다
except TypeError as e:
    print("TypeError:", e)

joined = "ab" + "-" + "cdef"
print("이어 붙이기:", joined, "앞 4글자:", joined[:4])
print("비교:", "apple" == "apple", "apple" < "banana", "b" > "a")
key, _, value = "key=value".partition("=")
print("partition:", key, value)
print("숫자 개수", sum(ch.isdigit() for ch in "a1b22c333"))
print(f"[{'ab':<6}][{'cd':>6}]")
print(f"[{'한글':<6}]")                      # 폭을 글자 수로 센다
print("널 문자도 그냥 글자:", len("a\0b"))
```

실행 결과:

```text
len 3
"한글" len 2 UTF-8 바이트 6
copy CAT word cat
TypeError: 'str' object does not support item assignment
이어 붙이기: ab-cdef 앞 4글자: ab-c
비교: True True True
partition: key value
숫자 개수 6
[ab    ][    cd]
[한글    ]
널 문자도 그냥 글자: 3
```

### 코드 한 부분씩 읽기

| 코드                                         | 설명                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `len(word)`                                  | 길이를 객체 안에 저장해 두어 끝 표시 없이 곧바로 압니다.                                                                 |
| `len(hangul)`, `len(hangul.encode("utf-8"))` | Python의 `len`은 **글자 수**(2)입니다. 바이트 수(6)는 인코딩해 봐야 압니다(Day 38).                                      |
| `word[0] = "b"` → `TypeError`                | Python 문자열은 바꿀 수 없습니다. `upper()`, `+`, `replace()`는 모두 새 문자열을 만듭니다.                               |
| `"ab" + "-" + "cdef"`                        | 필요한 만큼 새 공간을 잡으므로 넘칠 걱정이 없습니다. 대신 반복문 안에서 `+=`를 많이 하면 느려서 `"".join(...)`을 씁니다. |
| `"apple" < "banana"`                         | 비교 연산자가 내용을 사전 순서로 비교합니다. C의 `strcmp`에 해당합니다.                                                  |
| `"key=value".partition("=")`                 | `(앞, 구분자, 뒤)` 세 개를 돌려줍니다. 구분자가 없으면 가운데가 빈 문자열입니다.                                         |
| `f"[{'한글':<6}]"`                           | 폭을 **글자 수**로 세어 공백 4칸이 붙습니다. C의 `%-6s`와 다릅니다.                                                      |
| `len("a\0b")`                                | Python에서 `\0`은 평범한 글자라 문자열이 끝나지 않습니다. 길이 3입니다.                                                  |

## 7. Rust로 구현하기

```rust
// 파일: rust_strings.rs
fn main() {
    let word = String::from("cat");
    println!("len {}", word.len());         // 바이트 수(끝 표시 없음)
    let hangul = "한글";
    println!("\"한글\" len {} 바이트, {}글자", hangul.len(), hangul.chars().count());

    let copy = word.to_uppercase();         // 새 String
    println!("copy {copy}, word {word}");

    let mut line = String::from("Hi");
    line.push_str(", Rust!");               // 공간이 모자라면 알아서 늘린다
    println!("push_str: {line}");

    let joined = format!("{}-{}", "ab", "cdef");
    println!("format!: {joined}, 앞 4바이트: {}", &joined[..4]);

    println!("비교: {} {} {}", "apple" == "apple", "apple" < "banana", "b" > "a");
    if let Some((key, value)) = "key=value".split_once('=') {
        println!("split_once: {key} {value}");
    }
    let digits = "a1b22c333".chars().filter(|c| c.is_ascii_digit()).count();
    println!("숫자 개수 {digits}");
    println!("[{:<6}][{:>6}]", "ab", "cd");
    println!("[{:<6}]", "한글");            // 폭을 글자 수로 센다
    println!("널 문자도 그냥 글자: {}", "a\0b".len());
}
```

실행 결과:

```text
len 3
"한글" len 6 바이트, 2글자
copy CAT, word cat
push_str: Hi, Rust!
format!: ab-cdef, 앞 4바이트: ab-c
비교: true true true
split_once: key value
숫자 개수 6
[ab    ][    cd]
[한글    ]
널 문자도 그냥 글자: 3
```

### 코드 한 부분씩 읽기

| 코드                          | 설명                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `word.len()`                  | Rust의 `len`은 **바이트 수**입니다. C의 `strlen`과 같은 값이지만, `'\0'`을 찾지 않고 저장된 길이를 읽습니다.                          |
| `hangul.chars().count()`      | 글자 수는 UTF-8을 해석하며 세어야 해서 메서드가 따로 있습니다.                                                                        |
| `line.push_str(", Rust!")`    | `String`은 공간이 모자라면 스스로 더 큰 공간을 받습니다. C처럼 남은 공간을 계산할 필요가 없습니다.                                    |
| `&joined[..4]`                | 문자열 슬라이스는 **바이트** 범위입니다. 영문이라 괜찮지만, 한글 중간에서 자르면 패닉입니다(실수 3).                                  |
| `"key=value".split_once('=')` | `Option<(&str, &str)>`를 돌려줍니다. 두 조각은 원래 문자열을 빌린 것이라 복사가 없습니다. C의 `strchr`와 포인터 계산을 합친 셈입니다. |
| `c.is_ascii_digit()`          | `char`의 메서드입니다. 한글 같은 글자를 넘겨도 안전하게 `false`입니다.                                                                |
| `"a\0b".len()`                | Rust 문자열도 `'\0'`으로 끝나지 않고 길이를 저장합니다. C 함수에 넘길 때는 `std::ffi::CString`으로 바꿉니다.                          |

## 8. 실행 추적

`strncat(line, ", C!", sizeof line - strlen(line) - 1)`이 도는 과정을 따라갑니다. `line`은 `char line[16] = "Hi";`입니다.

| 단계                              | 값                   | `line`의 앞부분      |
| --------------------------------- | -------------------- | -------------------- |
| 시작                              | `strlen(line)` = 2   | `H i \0 \0 ...`      |
| 붙일 수 있는 글자 수 계산         | 16 - 2 - 1 = 13      |                      |
| `line[2]`부터 `, C!` 네 글자 복사 | 4 ≤ 13이라 전부 복사 | `H i , ␣ C ! \0 ...` |
| 끝에 `'\0'`                       | `line[6] = '\0'`     | `"Hi, C!"`           |

`- 1`을 빼먹으면 `strncat`이 `'\0'`을 배열 바로 뒤에 쓸 수 있습니다. 공간이 **딱 맞는** 경우에만 드러나는 버그라 찾기가 어렵습니다.

## 9. 다른 예제로 다시 이해하기

**설정 줄 나누기.** `name = Momo` 같은 줄을 `key`와 `value`로 나눠, 크기가 정해진 버퍼 `char key[8]`, `char value[16]`에 담습니다. 양쪽 공백은 지우고, 너무 길거나 `'='`가 없거나 이름이 비면 오류로 처리합니다.

```c
// 파일: config_line.c
#include <ctype.h>
#include <stdio.h>
#include <string.h>

#define KEY_MAX 8
#define VALUE_MAX 16

// src[start, end) 구간을 공백을 뺀 뒤 out에 복사한다. 넘치면 0을 돌려준다.
int copy_trimmed(char *out, size_t size, const char *src, size_t start, size_t end) {
    while (start < end && isspace((unsigned char)src[start])) {
        start++;
    }
    while (end > start && isspace((unsigned char)src[end - 1])) {
        end--;
    }
    size_t len = end - start;
    if (len + 1 > size) {                   // '\0' 자리까지 필요하다
        return 0;
    }
    memcpy(out, src + start, len);
    out[len] = '\0';
    return 1;
}

void parse(const char *line) {
    char key[KEY_MAX];
    char value[VALUE_MAX];
    const char *eq = strchr(line, '=');
    if (eq == NULL) {
        printf("%-24s -> 오류: '='가 없음\n", line);
        return;
    }
    size_t pos = (size_t)(eq - line);       // '='의 위치(포인터 빼기)
    if (!copy_trimmed(key, sizeof key, line, 0, pos) ||
        !copy_trimmed(value, sizeof value, line, pos + 1, strlen(line))) {
        printf("%-24s -> 오류: 너무 김\n", line);
        return;
    }
    if (key[0] == '\0') {
        printf("%-24s -> 오류: 이름이 비었음\n", line);
        return;
    }
    printf("%-24s -> [%s] = [%s]\n", line, key, value);
}

int main(void) {
    const char *lines[] = {
        "name = Momo",
        "  level=3  ",
        "color",
        "= blue",
        "nickname = x",
        "memo = 1234567890123456",
    };
    int n = sizeof lines / sizeof lines[0];
    for (int i = 0; i < n; i++) {
        parse(lines[i]);
    }
    return 0;
}
```

실행 결과:

```text
name = Momo              -> [name] = [Momo]
  level=3                -> [level] = [3]
color                    -> 오류: '='가 없음
= blue                   -> 오류: 이름이 비었음
nickname = x             -> 오류: 너무 김
memo = 1234567890123456  -> 오류: 너무 김
```

| 코드                                              | 설명                                                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `copy_trimmed(out, size, src, start, end)`        | `[start, end)` 구간에서 앞뒤 공백을 건너뛴 뒤 복사합니다. 복사할 곳의 크기 `size`를 **반드시** 함께 받습니다.       |
| `if (len + 1 > size) return 0;`                   | `'\0'` 자리까지 들어가는지 먼저 확인합니다. `nickname`은 8글자라 9바이트가 필요한데 `key`는 8바이트여서 거절됩니다. |
| `memcpy(out, src + start, len); out[len] = '\0';` | 길이를 이미 확인했으니 정확히 `len`바이트를 복사하고 널 문자를 직접 넣습니다.                                       |
| `size_t pos = (size_t)(eq - line);`               | 같은 배열 안의 두 포인터를 빼면 칸 수가 나옵니다(Day 30). `'='`의 위치입니다.                                       |
| `printf("%-24s -> ...", line, ...)`               | 폭을 쓰는 칸에는 영문만 들어가서 줄이 맞습니다. 한글이 들어가면 폭이 바이트로 세어져 어긋납니다.                    |

같은 일을 Python으로 하면 버퍼 크기가 없으므로, "너무 김"은 **일부러** 정한 규칙이 됩니다.

```python
# 파일: config_line.py
KEY_MAX = 7                                 # C의 char key[8]에 들어가는 글자 수
VALUE_MAX = 15


def parse(line):
    key, sep, value = line.partition("=")
    if not sep:
        return "오류: '='가 없음"
    key, value = key.strip(), value.strip()
    if len(key) > KEY_MAX or len(value) > VALUE_MAX:
        return "오류: 너무 김"
    if not key:
        return "오류: 이름이 비었음"
    return f"[{key}] = [{value}]"


lines = ["name = Momo", "  level=3  ", "color", "= blue", "nickname = x", "memo = 1234567890123456"]
for line in lines:
    print(f"{line:<24} -> {parse(line)}")
```

실행 결과:

```text
name = Momo              -> [name] = [Momo]
  level=3                -> [level] = [3]
color                    -> 오류: '='가 없음
= blue                   -> 오류: 이름이 비었음
nickname = x             -> 오류: 너무 김
memo = 1234567890123456  -> 오류: 너무 김
```

Rust에서는 나눈 조각이 원래 줄을 **빌린 `&str`** 이라 복사가 없고, 오류는 `Result`로 돌려줍니다.

```rust
// 파일: config_line.rs
const KEY_MAX: usize = 7;
const VALUE_MAX: usize = 15;

fn parse(line: &str) -> Result<(&str, &str), &'static str> {
    let (key, value) = line.split_once('=').ok_or("'='가 없음")?;
    let (key, value) = (key.trim(), value.trim());  // 복사 없이 안쪽을 빌린다
    if key.len() > KEY_MAX || value.len() > VALUE_MAX {
        return Err("너무 김");
    }
    if key.is_empty() {
        return Err("이름이 비었음");
    }
    Ok((key, value))
}

fn main() {
    let lines = ["name = Momo", "  level=3  ", "color", "= blue", "nickname = x", "memo = 1234567890123456"];
    for line in lines {
        match parse(line) {
            Ok((k, v)) => println!("{line:<24} -> [{k}] = [{v}]"),
            Err(e) => println!("{line:<24} -> 오류: {e}"),
        }
    }
}
```

실행 결과:

```text
name = Momo              -> [name] = [Momo]
  level=3                -> [level] = [3]
color                    -> 오류: '='가 없음
= blue                   -> 오류: 이름이 비었음
nickname = x             -> 오류: 너무 김
memo = 1234567890123456  -> 오류: 너무 김
```

- `split_once('=').ok_or("'='가 없음")?`는 `Option`을 `Result`로 바꾼 뒤 `?`로 오류를 돌려줍니다(Day 25).
- `trim()`은 앞뒤 공백을 뺀 **안쪽 부분을 빌린** 슬라이스를 돌려줍니다. C의 `copy_trimmed`가 한 일에서 복사만 뺀 것입니다.
- 돌려준 `(&str, &str)`는 `line`을 빌리고 있어서, `line`이 살아 있는 동안만 쓸 수 있습니다. 이 관계를 적는 법은 Day 45(수명)에서 배웁니다.
- Rust의 `len()`은 바이트 수라서, 한글 값이 들어오면 Python의 글자 수 규칙과 결과가 달라질 수 있습니다. C의 버퍼 크기와 맞추려면 바이트 수가 맞는 기준입니다.

## 10. 문자열 연산 대응표

| 하고 싶은 일 | C                                     | Python                  | Rust                         |
| ------------ | ------------------------------------- | ----------------------- | ---------------------------- |
| 길이(바이트) | `strlen(s)`                           | `len(s.encode())`       | `s.len()`                    |
| 길이(글자)   | 직접 UTF-8 해석                       | `len(s)`                | `s.chars().count()`          |
| 복사         | `snprintf(dst, size, "%s", s)`        | 필요 없음(바꿀 수 없음) | `s.to_string()`, `s.clone()` |
| 이어 붙이기  | `snprintf`, `strncat`(남은 공간 계산) | `a + b`, `"".join(...)` | `push_str`, `format!`        |
| 내용 비교    | `strcmp(a, b) == 0`                   | `a == b`                | `a == b`                     |
| 찾기         | `strchr`, `strstr`                    | `s.find(x)`, `x in s`   | `s.find(x)`, `s.contains(x)` |
| 나누기       | `strchr` + 포인터 계산                | `partition`, `split`    | `split_once`, `split`        |
| 공백 빼기    | 직접 반복                             | `strip()`               | `trim()`                     |

## 11. 세 언어 비교

| 관점                 | C                            | Python            | Rust                            |
| -------------------- | ---------------------------- | ----------------- | ------------------------------- |
| 끝을 아는 방법       | `'\0'` 끝 표시               | 저장된 길이       | 저장된 길이                     |
| 내용                 | 바이트(인코딩은 약속)        | 유니코드 글자     | UTF-8 바이트(항상 올바른 UTF-8) |
| 바꿀 수 있나         | 배열이면 예, 리터럴은 아니요 | 아니요(새 문자열) | `String`은 예, `&str`은 빌린 것 |
| 공간 관리            | 프로그래머(크기 계산)        | 자동              | `String`이 자동으로 늘림        |
| `\0`이 가운데 있으면 | 거기서 문자열이 끝남         | 평범한 글자       | 평범한 글자                     |
| `==`                 | 주소 비교                    | 내용 비교         | 내용 비교                       |

## 12. 자주 하는 실수

### 실수 1: ==로 문자열을 비교한다 (C)

```c
// 파일: compare_eq.c (컴파일 오류: comparison with string literal results in unspecified behavior)
#include <stdio.h>

int main(void) {
    char answer[8] = "cat";
    if (answer == "cat") {
        printf("정답\n");
    }
    return 0;
}
```

실습의 디버그 문제입니다. `strcmp(answer, "cat") == 0`으로 비교하세요.

### 실수 2: '\0' 자리를 세지 않는다 (C)

"cat"을 담으려면 4바이트가 필요합니다. 크기를 계산할 때는 항상 `글자 수 + 1`입니다. `char s[3] = "cat";`은 C에서 오류 없이 컴파일되지만, `'\0'`이 없어 `strlen`과 `printf("%s")`가 배열 밖을 읽습니다.

### 실수 3: 한글 중간에서 문자열을 자른다 (Rust)

```rust
// 파일: cut_hangul.rs (실행 오류: is not a char boundary)
fn main() {
    let s = "한글";
    println!("{}", &s[0..2]);
}
```

`&str`의 범위는 바이트 번호라서, 한 글자(3바이트) 가운데에서 자르면 패닉입니다. 글자 단위로는 `s.chars().take(1).collect::<String>()`, 안전하게 자르려면 `s.get(0..2)`(`None`을 돌려줌)을 쓰세요.

### 실수 4: strcpy를 크기 확인 없이 쓴다 (C)

`strcpy(dst, src)`는 `dst`가 몇 칸인지 모릅니다. 사용자 입력처럼 길이를 모르는 값은 `snprintf(dst, sizeof dst, "%s", src)`(배열을 선언한 곳에서) 또는 크기를 매개변수로 받은 함수로 복사하세요.

### 실수 5: C에서 printf 폭으로 한글 표를 맞춘다

`%-10s`는 10**바이트**입니다. 한글이 섞이면 줄마다 폭이 달라집니다. 실습 프로그램처럼 폭을 쓰는 칸에는 영문을 두고, 한글은 줄 끝에 두세요.

## 13. Q&A

**Q. 왜 C는 길이를 저장하지 않고 '\0'을 쓰나요?**

A. 1970년대의 작은 컴퓨터에서 길이를 저장하는 칸(당시 1~2바이트)을 아끼고, 긴 문자열도 제한 없이 표현하기 위해서였습니다. 대신 길이를 알려면 매번 끝까지 세야 하고, `'\0'`을 잃으면 끝을 알 수 없게 되었습니다. 요즘의 C 코드도 길이를 함께 들고 다니는 구조체를 따로 만들어 쓰는 경우가 많습니다.

**Q. snprintf가 잘랐는지는 어떻게 확인하나요?**

A. 반환값 `n`을 `size`와 비교합니다. `n < 0`이면 형식 오류, `n >= size`면 잘림, 그 밖에는 모두 들어간 것입니다. 잘렸을 때 `n + 1`바이트를 새로 받아(Day 40의 `malloc`) 다시 부르는 방식도 흔합니다.

**Q. Python에는 바이트 문자열이 따로 있나요?**

A. `bytes`(`b"cat"`)가 있습니다. 파일이나 네트워크에서 읽은 날것의 바이트는 `bytes`이고, `.decode("utf-8")`로 `str`이 됩니다. Day 38에서 자세히 다룹니다.

**Q. Rust 문자열을 C 함수에 넘기려면요?**

A. Rust 문자열은 `'\0'`으로 끝나지 않고 가운데에 `'\0'`이 있을 수도 있어서 그대로 넘길 수 없습니다. `std::ffi::CString::new(s)`가 끝에 `'\0'`을 붙인 복사본을 만들고, 가운데에 `'\0'`이 있으면 오류를 돌려줍니다.

## 14. 핵심 요약

- C 문자열은 `'\0'`으로 끝나는 `char` 배열입니다. `strlen`은 `'\0'` 앞까지의 바이트 수, `sizeof`는 배열 크기입니다.
- 문자열을 담을 공간은 항상 **글자(바이트) 수 + 1**입니다. 한글은 UTF-8로 한 글자에 3바이트입니다.
- `strcpy`·`strcat`은 복사할 곳의 크기를 모릅니다. `snprintf(dst, size, ...)`로 만들고, 반환값이 `size` 이상이면 잘린 것입니다.
- 내용 비교는 `strcmp(a, b) == 0`입니다. `==`는 주소를 비교합니다.
- `ctype.h` 함수에는 `(unsigned char)`로 바꿔 넘기고, `printf`의 폭은 바이트로 셉니다.
- Python `str`은 길이를 저장한 **바꿀 수 없는** 글자열이고 `len`은 글자 수입니다. Rust `String`·`&str`은 길이를 저장한 UTF-8 바이트열이고 `len`은 바이트 수, 글자 수는 `chars().count()`입니다.

## 15. 도전 문제

1. **(C)** `void trim_in_place(char *s)`를 만들어, 앞뒤 공백을 지운 결과를 `s` 자리에 다시 쓰세요(`memmove`를 써 보세요). `"  hi  "`, `"   "`, `""`로 확인합니다.
2. **(C)** `int count_words(const char *s)`로 공백으로 구분된 단어 수를 세세요. 연속된 공백과 앞뒤 공백이 있어도 맞아야 합니다.
3. **(Python)** 설정 줄 예제를 확장해 `#`으로 시작하는 줄은 주석으로 건너뛰고, 결과를 사전으로 모아 출력하세요.
4. **(Rust)** `fn truncate_chars(s: &str, n: usize) -> &str`로 앞의 `n`**글자**까지를 빌려 돌려주세요. `s.char_indices()`로 `n`번째 글자가 시작하는 바이트 위치를 찾으면 됩니다. `"한글abc"`에서 `n = 3`이면 `"한글a"`입니다.
