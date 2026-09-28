---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-46-c-file
courseId: crp-92
phaseId: phase-04
dayNumber: 46
date: "2026-11-15"
title: C 파일 입출력과 실패 검사
summary: C 표준 라이브러리로 파일을 열고(fopen), 쓰고(fprintf·fputs), 읽고(fgets·fgetc·sscanf), 닫는(fclose) 방법과, 각 단계에서 실패를 확인하는 습관을 익힙니다. 열기 모드 "r"·"w"·"a", NULL과 errno로 실패 알아내기, fgets가 버퍼 크기만큼 끊어 읽는 동작, EOF를 int로 받아야 하는 이유, 끝과 오류를 구별하는 feof·ferror, while (!feof(f))의 함정, fclose의 반환값, 여러 자원을 한곳에서 정리하는 goto cleanup 모양을 다룹니다. Python의 with open과 예외, Rust의 File·BufReader·io::Result와 ?를 비교하고, 로그 파일에서 수준별 개수를 세어 보고서 파일을 만드는 프로그램을 세 언어로 만들어 봅니다.
anchorLanguage: c
transferLanguages: [python, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-45-lifetime]
learningObjectives:
  - fopen의 모드를 구별해 파일을 쓰고, 이어 쓰고, 읽는다.
  - fopen·fgets·sscanf·fclose의 반환값으로 실패를 확인하고, errno로 이유를 구별한다.
  - fgets가 버퍼 크기만큼 끊어 읽는다는 것과 EOF를 int로 받아야 하는 이유를 설명한다.
  - while (!feof(f))가 마지막 줄을 두 번 처리하는 이유를 설명하고 올바른 반복으로 고친다.
  - goto cleanup으로 여러 파일을 모든 경로에서 닫고, Python with·Rust Drop과 비교한다.
concepts:
  [
    file io,
    fopen,
    file mode,
    fclose,
    fprintf,
    fgets,
    fgetc,
    sscanf,
    eof,
    feof,
    ferror,
    errno,
    enoent,
    goto cleanup,
    with open,
    io result,
    bufreader,
  ]
runnerMode: python
playgroundSource: |
  # 파일: file_play.py — 브라우저 안의 가상 파일에 쓰고 읽습니다.
  with open("scores.txt", "w", encoding="utf-8") as f:
      f.write("minji 92\njunho 85\n")
  with open("scores.txt", encoding="utf-8") as f:
      for line in f:
          name, score = line.split()
          print(name, int(score) + 5)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day46-predict-fgets
    title: 작은 버퍼로 fgets를 부르는 횟수 예측하기
    kind: predict
    objective: fgets가 줄 끝이나 버퍼 크기 - 1바이트 중 먼저 오는 곳에서 멈춘다는 것을 추적한다.
    prompt: 출력되는 수를 적으세요.
    starter: |-
      #include <stdio.h>

      int main(void) {
          FILE *f = fopen("long.txt", "w");
          if (f == NULL) {
              return 1;
          }
          fputs("abcdefghij\nxy\n", f);
          fclose(f);

          f = fopen("long.txt", "r");
          if (f == NULL) {
              return 1;
          }
          char buf[8];
          int calls = 0;
          while (fgets(buf, sizeof buf, f) != NULL) {
              calls++;
          }
          fclose(f);
          remove("long.txt");
          printf("%d\n", calls);
          return 0;
      }
    answer: "3"
    hint: "buf는 8바이트라 한 번에 최대 7글자와 '\\0'을 담습니다. 첫 줄은 줄바꿈까지 11바이트입니다."
    explanation: "첫 호출은 \"abcdefg\"(7글자), 두 번째는 남은 \"hij\\n\", 세 번째는 \"xy\\n\"을 읽고, 네 번째에서 NULL이라 3입니다. fgets 한 번이 한 줄이라는 보장은 없어서, 긴 줄을 다루려면 읽은 결과가 '\\n'으로 끝나는지 확인하거나 버퍼를 충분히 크게 잡아야 합니다."
    commonMistakes:
      - "줄이 두 개라 2라고 생각함"
      - "버퍼가 작으면 fgets가 실패한다고 생각함"
    language: c
    verification: run
  - id: ex-day46-predict-mode
    title: 열기 모드에 따른 파일 내용 예측하기
    kind: predict
    objective: "w는 비우고 쓰고, a는 끝에 이어 쓴다는 것을 확인한다."
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      with open("t.txt", "w", encoding="utf-8") as f:
          f.write("a\n")
      with open("t.txt", "w", encoding="utf-8") as f:
          f.write("b\n")
      with open("t.txt", "a", encoding="utf-8") as f:
          f.write("c\n")
      with open("t.txt", encoding="utf-8") as f:
          print(f.read().split())
    answer: "['b', 'c']"
    hint: '두 번째 "w"는 있던 내용을 지우고 처음부터 씁니다.'
    explanation: '"w"는 파일이 있으면 내용을 비우고, 없으면 새로 만듭니다. 그래서 a가 사라지고 b만 남습니다. "a"는 끝에 이어 쓰므로 c가 붙습니다. C의 fopen 모드도 똑같이 "r", "w", "a"이고, 실수로 "w"로 열어 소중한 파일을 비우는 사고가 흔합니다.'
    commonMistakes:
      - '"w"가 이어 쓴다고 생각해 [''a'', ''b'', ''c'']로 적음'
      - '"a"가 처음부터 덮어쓴다고 생각함'
    language: python
    verification: run
  - id: ex-day46-fill
    title: 열기 실패 확인하기 채우기
    kind: fill
    objective: fopen의 반환값을 NULL과 비교해 실패를 확인한다.
    prompt: "빈칸을 채워 없는 파일을 열었을 때 '열기 실패'가 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          FILE *f = fopen("missing.txt", "r");
          if (f == _____) {
              printf("열기 실패\n");
              return 0;
          }
          fclose(f);
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          FILE *f = fopen("missing.txt", "r");
          if (f == NULL) {
              printf("열기 실패\n");
              return 0;
          }
          fclose(f);
          return 0;
      }
    output: "열기 실패"
    hint: "fopen은 실패하면 가리킬 곳이 없다는 뜻의 특별한 포인터를 돌려줍니다."
    explanation: "fopen은 파일이 없거나 권한이 없으면 NULL을 돌려주고, 이유는 전역 변수 errno에 남깁니다(없는 파일은 ENOENT). 검사하지 않고 fgets(buf, n, NULL)을 부르면 프로그램이 멈춥니다. 파일 열기는 프로그램 밖의 상태에 달려 있어서 언제든 실패할 수 있는 대표적인 연산입니다."
    commonMistakes:
      - "0이 아니라 EOF와 비교함(EOF는 읽기 함수의 반환값)"
      - "실패한 f를 fclose함"
    language: c
    verification: run
  - id: ex-day46-modify
    title: while (!feof(f)) 반복 고치기
    kind: modify
    objective: 읽기 함수의 반환값으로 반복을 멈춰 마지막 줄을 두 번 처리하지 않는다.
    prompt: "이 코드는 마지막 줄 second를 두 번 출력합니다. 반복 조건을 fgets의 반환값으로 바꿔 두 줄만 출력되게 하세요."
    starter: |-
      #include <stdio.h>

      int main(void) {
          FILE *f = fopen("two.txt", "w");
          if (f == NULL) {
              return 1;
          }
          fputs("first\nsecond\n", f);
          fclose(f);

          f = fopen("two.txt", "r");
          if (f == NULL) {
              return 1;
          }
          char line[32] = "";
          while (!feof(f)) {
              fgets(line, sizeof line, f);
              printf("읽음: %s", line);
          }
          fclose(f);
          remove("two.txt");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int main(void) {
          FILE *f = fopen("two.txt", "w");
          if (f == NULL) {
              return 1;
          }
          fputs("first\nsecond\n", f);
          fclose(f);

          f = fopen("two.txt", "r");
          if (f == NULL) {
              return 1;
          }
          char line[32];
          while (fgets(line, sizeof line, f) != NULL) {
              printf("읽음: %s", line);
          }
          fclose(f);
          remove("two.txt");
          return 0;
      }
    output: |-
      읽음: first
      읽음: second
    starterOutput: |-
      읽음: first
      읽음: second
      읽음: second
    hint: "feof는 '이미 끝을 지나 읽으려다 실패한 적이 있는가'를 알려 줍니다. 마지막 줄을 읽은 직후에는 아직 거짓입니다."
    explanation: "second를 읽은 직후에는 아직 끝을 넘어 읽으려 한 적이 없어서 feof가 거짓입니다. 반복이 한 번 더 돌고, fgets가 NULL을 돌려주며 실패하지만 line은 그대로라 second가 또 출력됩니다. 읽기 함수가 성공했는지로 반복을 제어하고, 반복이 끝난 뒤에 feof/ferror로 '끝이라서인지 오류라서인지'를 구별하세요."
    commonMistakes:
      - "반복 안에서 fgets 뒤에 feof를 검사하는 방식으로 바꾸다가 빈 줄 처리가 꼬임"
      - "fgets의 반환값을 0과 비교함(NULL과 비교하는 것이 뜻이 분명함)"
    language: c
    verification: run
  - id: ex-day46-debug
    title: 무시한 Result 오류 고치기
    kind: debug
    objective: 쓰기 결과를 ?로 처리해 unused Result 오류를 없앤다.
    prompt: "이 코드는 writeln!의 결과(io::Result)를 무시해서 'unused `Result` that must be used' 경고(이 과정에서는 오류)로 컴파일되지 않습니다. main이 io::Result<()>를 돌려주게 하고 ?로 처리한 뒤, 쓴 내용을 읽어 'hello'를 출력하세요."
    starter: |-
      use std::fs::File;
      use std::io::Write;

      fn main() {
          let mut f = File::create("note.txt").unwrap();
          writeln!(f, "hello");
      }
    answer: |-
      use std::fs;
      use std::fs::File;
      use std::io::{self, Write};

      fn main() -> io::Result<()> {
          let mut f = File::create("note.txt")?;
          writeln!(f, "hello")?;
          drop(f);
          print!("{}", fs::read_to_string("note.txt")?);
          fs::remove_file("note.txt")?;
          Ok(())
      }
    output: "hello"
    hint: "쓰기는 디스크가 꽉 차는 등의 이유로 실패할 수 있습니다. Rust는 그 결과를 버리는 것을 경고합니다."
    explanation: "io::Result는 #[must_use]로 표시되어 있어서 그냥 버리면 경고가 납니다. C에서 fprintf의 반환값을 확인하지 않아도 아무 말이 없는 것과 대조적입니다. main이 io::Result<()>를 돌려주면 ?로 오류를 위로 보낼 수 있고, 오류가 나면 프로그램이 오류 메시지와 함께 끝납니다. drop(f)로 파일을 먼저 닫아 내용이 디스크에 쓰였음을 분명히 했습니다."
    commonMistakes:
      - "let _ = writeln!(...);로 결과를 버려 경고만 없앰(실패를 놓침)"
      - "main의 반환 자료형을 바꾸지 않고 ?를 써서 E0277이 남"
    language: rust
    verification: run
  - id: ex-day46-independent
    title: Python으로 줄 수와 단어 수 세기
    kind: independent
    objective: 파일을 쓰고 다시 읽어 줄과 단어를 센다.
    prompt: 'poem.txt에 세 줄("시간은 삶이다", "모모는 듣는다", "회색 신사들이 시간을 훔친다")을 쓰고, 다시 읽어 ''3줄 8단어''를 출력한 뒤 파일을 지우세요.'
    starter: |-
      lines = ["시간은 삶이다", "모모는 듣는다", "회색 신사들이 시간을 훔친다"]
      print(lines)
    answer: |-
      import os

      with open("poem.txt", "w", encoding="utf-8") as f:
          f.write("시간은 삶이다\n모모는 듣는다\n회색 신사들이 시간을 훔친다\n")
      with open("poem.txt", encoding="utf-8") as f:
          lines = f.readlines()
      words = sum(len(line.split()) for line in lines)
      print(f"{len(lines)}줄 {words}단어")
      os.remove("poem.txt")
    output: "3줄 8단어"
    hint: 'readlines()는 줄 목록을, split()은 공백으로 나눈 단어 목록을 줍니다. encoding="utf-8"을 꼭 적으세요.'
    explanation: "with 블록이 끝나면 파일이 닫혀서, 쓰기 블록 다음에 곧바로 읽어도 내용이 모두 들어 있습니다. encoding을 적지 않으면 운영체제의 기본값(한국어 Windows는 cp949)을 써서, 다른 컴퓨터에서 읽을 때 글자가 깨질 수 있습니다. C라면 fgets와 공백 세기로 같은 일을 하고, 버퍼 크기와 한글 바이트 수까지 신경 써야 합니다."
    commonMistakes:
      - "쓰기 파일을 닫기 전에 읽어 내용이 비어 보임"
      - "len(line)으로 글자 수를 세어 단어 수와 섞음"
    language: python
    verification: run
quiz:
  - id: quiz-day46-01
    question: fopen(path, "w")에 대한 설명으로 옳은 것은?
    choices:
      - 파일 끝에 이어 쓴다
      - 파일이 있으면 내용을 비우고, 없으면 만든다
      - 읽기 전용으로 연다
      - 파일이 없으면 NULL을 돌려준다
    answerIndex: 1
    explanation: 이어 쓰려면 "a", 읽으려면 "r"입니다. "r"은 파일이 없으면 NULL을 돌려줍니다. "w"는 기존 내용을 지우므로 조심해서 써야 합니다.
  - id: quiz-day46-02
    question: fgetc의 결과를 int ch로 받아야 하는 이유는?
    choices:
      - 속도 때문에
      - 파일의 모든 바이트 값(0~255)과 끝을 뜻하는 EOF(보통 -1)를 구별하려면 char보다 넓은 자료형이 필요해서
      - char는 파일에 쓸 수 없어서
      - 표준이 char를 금지해서
    answerIndex: 1
    explanation: char로 받으면 바이트 255(0xFF)가 EOF와 같아지거나(부호 있는 char), EOF를 영영 못 알아볼 수 있습니다(부호 없는 char). int로 받아 EOF와 비교한 뒤 char로 쓰세요.
  - id: quiz-day46-03
    question: while (!feof(f)) { fgets(...); 처리; }의 문제는?
    choices:
      - 첫 줄을 건너뛴다
      - feof는 끝을 넘어 읽으려다 실패한 뒤에야 참이 되어, 마지막 줄을 한 번 더 처리한다
      - 무한 반복한다
      - 문제없다
    answerIndex: 1
    explanation: 반복 조건은 읽기 함수의 반환값으로 쓰세요(while (fgets(...) != NULL)). feof와 ferror는 반복이 끝난 뒤 이유를 확인하는 데 씁니다.
  - id: quiz-day46-04
    question: goto cleanup 모양을 쓰는 이유는?
    choices:
      - 코드를 빠르게 하려고
      - 중간에 실패하는 경로가 여러 개여도, 열어 둔 자원을 한곳에서 빠짐없이 닫으려고
      - 반복을 만들려고
      - C에는 return이 없어서
    answerIndex: 1
    explanation: 두 번째 파일 열기에 실패했을 때 첫 번째 파일을 닫는 것을 잊기 쉽습니다. 모든 자원을 NULL로 시작하고, 실패하면 cleanup으로 가서 NULL이 아닌 것만 닫습니다. Python의 with와 Rust의 Drop이 이 일을 자동으로 합니다.
  - id: quiz-day46-05
    question: Rust에서 File::open(path)?가 실패하면?
    choices:
      - 프로그램이 곧바로 멈춘다
      - 함수가 그 io::Error를 담은 Err를 돌려주며 끝나고, 이미 연 다른 파일은 Drop으로 닫힌다
      - NULL을 돌려준다
      - 빈 파일을 만든다
    answerIndex: 1
    explanation: "?는 오류를 부른 쪽으로 돌려보냅니다. 그때까지 만든 값들은 범위를 벗어나며 정리되므로, C의 goto cleanup이 할 일을 컴파일러가 대신합니다. 오류의 종류는 e.kind()로(NotFound 등) 구별합니다."
---

## 1. 오늘 배울 내용

지금까지 프로그램의 데이터는 실행이 끝나면 사라졌습니다. 오늘부터 세 번에 걸쳐 **파일**을 다룹니다(Day 46 C, Day 47 Python, Day 48 Rust). 첫 시간은 C 표준 라이브러리의 파일 입출력과, 모든 단계에서 **실패를 확인하는** 습관입니다.

1. 파일 다루기의 네 단계: 열기 → 쓰기/읽기 → 확인 → 닫기
2. 열기: `fopen(경로, 모드)`
   - `"r"` 읽기, `"w"` 비우고 쓰기, `"a"` 이어 쓰기
   - 실패하면 `NULL`, 이유는 `errno`(없는 파일은 `ENOENT`)
3. 쓰기: `fprintf`, `fputs`
4. 읽기와 그 함정
   - `fgets`: 한 줄씩, 하지만 **버퍼 크기만큼 끊어** 읽음
   - `fgetc`: 한 글자씩, 결과는 **`int`로** 받아 `EOF`와 비교
   - `sscanf`: 읽은 줄에서 값 꺼내기, **반환값으로 개수 확인**
   - `feof`·`ferror`: 끝인지 오류인지 **반복이 끝난 뒤** 구별
   - `while (!feof(f))`가 마지막 줄을 두 번 처리하는 이유
5. 닫기: `fclose`도 실패할 수 있습니다.
6. 여러 파일을 모든 경로에서 닫는 **`goto cleanup`** 모양
7. Python `with open`과 예외, Rust `File`·`BufReader`·`io::Result`와 `?`를 비교합니다.
8. 로그 파일에서 수준별 개수를 세어 **보고서 파일**을 만드는 프로그램을 세 언어로 만듭니다.

## 2. 왜 필요한가

파일은 프로그램 **밖**에 있어서, 프로그램이 통제할 수 없는 이유로 실패합니다.

- 파일이 없거나 이름이 틀렸습니다.
- 권한이 없습니다(다른 사람의 파일, 읽기 전용 폴더).
- 디스크가 가득 찼습니다.
- 다른 프로그램이 파일을 쓰는 중입니다.
- 파일 내용이 예상한 형식이 아닙니다(잘못된 줄, 너무 긴 줄).

C는 이런 실패를 **반환값**으로만 알려 주고, 확인하지 않아도 아무 말을 하지 않습니다. 확인을 빼먹은 프로그램은 대부분 잘 동작하다가, 드물게 실패하는 날 엉뚱한 곳에서 멈추거나 데이터를 망가뜨립니다. 설정 파일, 저장 파일, 로그처럼 실제 프로그램에 꼭 필요한 기능이라 습관을 제대로 들여야 합니다.

## 3. 그림으로 이해하기

파일 입출력의 흐름과 각 단계의 실패 신호입니다.

```text
fopen ──▶ FILE * ─────────────── 실패: NULL (errno에 이유)
  │
  ├─ fprintf / fputs ─────────── 실패: 음수 / EOF
  ├─ fgets ───────────────────── 끝 또는 실패: NULL
  ├─ fgetc ───────────────────── 끝 또는 실패: EOF (int)
  ├─ sscanf / fscanf ─────────── 읽은 개수(기대보다 적으면 형식 오류)
  │
  ├─ 반복이 끝난 뒤: feof(f) 참이면 끝, ferror(f) 참이면 오류
  │
fclose ───────────────────────── 실패: EOF (남은 내용을 쓰다 실패할 수 있음)
```

`fgets(buf, 8, f)`는 **줄 끝**이나 **7바이트** 중 먼저 오는 곳에서 멈춥니다.

```text
파일:  a b c d e f g h i j \n x y \n
1번째: [a b c d e f g \0]            ← 7바이트에서 멈춤(줄 중간)
2번째: [h i j \n \0]                 ← 줄 끝에서 멈춤
3번째: [x y \n \0]
4번째: NULL                           ← 끝
```

`while (!feof(f))`가 틀리는 이유입니다.

```text
반복 1: feof? 아니요 → fgets → "first"  → 출력
반복 2: feof? 아니요 → fgets → "second" → 출력      (마지막 줄을 읽었지만 아직 끝을 '넘어' 읽진 않음)
반복 3: feof? 아니요 → fgets → NULL(실패), line은 "second" 그대로 → 또 출력 ✗
반복 4: feof? 예 → 멈춤
```

## 4. 천천히 풀어보기

### 4.1 열기 모드

| 모드           | 파일이 있으면            | 파일이 없으면 | 할 수 있는 일        |
| -------------- | ------------------------ | ------------- | -------------------- |
| `"r"`          | 처음부터 읽음            | `NULL`        | 읽기                 |
| `"w"`          | **내용을 비움**          | 새로 만듦     | 쓰기                 |
| `"a"`          | 끝에 이어 씀             | 새로 만듦     | 쓰기(항상 끝에)      |
| `"r+"`         | 처음부터                 | `NULL`        | 읽기와 쓰기          |
| `"rb"`, `"wb"` | 위와 같음, 바이트 그대로 |               | 이진 파일(이미지 등) |

Windows에서 텍스트 모드(`"r"`, `"w"`)는 줄바꿈 `\n`을 파일에 `\r\n`으로 쓰고, 읽을 때 다시 `\n`으로 바꿉니다. 바이트를 그대로 다뤄야 하는 파일은 `"b"`를 붙입니다.

### 4.2 실패 확인하기

| 함수                           | 실패(또는 끝) 신호 | 확인 방법                                           |
| ------------------------------ | ------------------ | --------------------------------------------------- |
| `fopen`                        | `NULL`             | `if (f == NULL)`, 이유는 `errno`                    |
| `fgets`                        | `NULL`             | `while (fgets(...) != NULL)`                        |
| `fgetc`                        | `EOF`              | `int ch;` 로 받아 `while ((ch = fgetc(f)) != EOF)`  |
| `sscanf(line, "%31s %d", ...)` | 읽은 개수          | `!= 2`면 형식 오류                                  |
| `fprintf`                      | 음수               | 중요한 쓰기는 확인                                  |
| `fclose`                       | `EOF`              | 쓰기용 파일은 확인(남은 내용을 쓰다 실패할 수 있음) |

`errno`는 `<errno.h>`의 전역 값으로, 실패한 함수가 이유를 번호로 남깁니다. `perror("scores.txt")`나 `strerror(errno)`로 사람이 읽을 수 있는 메시지를 출력할 수 있습니다. 메시지 문구는 운영체제마다 조금씩 달라서, 프로그램에서 판단할 때는 `errno == ENOENT`처럼 번호로 비교합니다.

### 4.3 형식이 있는 줄 읽기

`fscanf(f, "%s %d", ...)`로 파일에서 바로 값을 읽을 수도 있지만, 형식이 틀린 줄을 만나면 어디까지 읽었는지 알기 어렵습니다. 그래서 흔히 **`fgets`로 한 줄을 읽고 `sscanf`로 그 줄을 나누는** 두 단계를 씁니다. 틀린 줄은 그 줄만 건너뛰면 됩니다.

`"%31s"`의 31은 `char name[32]`에 넘치지 않게 읽을 최대 글자 수입니다(`'\0'` 자리 1바이트를 뺀 값). 폭 없는 `%s`는 `strcpy`처럼 넘칠 수 있습니다(Day 37).

### 4.4 여러 자원 정리하기: goto cleanup

파일 두 개를 여는 함수에서 두 번째 열기가 실패하면, 첫 번째 파일을 닫고 돌아가야 합니다. 경로가 많아지면 빼먹기 쉽습니다. C에서는 이렇게 정리합니다.

1. 모든 자원을 `NULL`로 시작합니다.
2. 결과는 "실패"로 시작합니다.
3. 실패하면 `goto cleanup;`으로 함수 끝의 정리 구역으로 갑니다.
4. 끝까지 성공하면 결과를 "성공"으로 바꿉니다.
5. 정리 구역에서 `NULL`이 아닌 자원만 닫습니다.

`goto`는 보통 피하는 문법이지만, 이 모양은 리눅스 커널 같은 큰 C 프로젝트에서도 표준처럼 쓰입니다. Python의 `with`와 Rust의 `Drop`은 이 일을 언어가 대신 해 줍니다(Day 35).

## 5. C로 구현하기

```c
// 파일: file_io.c
#include <errno.h>
#include <stdio.h>

int write_scores(const char *path) {        // 성공하면 1
    FILE *f = fopen(path, "w");             // "w": 새로 만들거나 비우고 쓴다
    if (f == NULL) {
        return 0;
    }
    fprintf(f, "minji 92\n");
    fprintf(f, "junho 85\n");
    fputs("broken line\n", f);              // 일부러 넣은 잘못된 줄
    fprintf(f, "seoyeon 78\n");
    if (fclose(f) != 0) {                   // 닫을 때 남은 내용을 실제로 쓴다: 실패할 수 있다
        return 0;
    }
    return 1;
}

int main(void) {
    const char *path = "scores.txt";
    if (!write_scores(path)) {
        printf("쓰기 실패\n");
        return 1;
    }

    FILE *f = fopen(path, "r");
    if (f == NULL) {
        printf("읽기용으로 열기 실패\n");
        return 1;
    }
    char line[64];
    int count = 0, total = 0, line_no = 0;
    while (fgets(line, sizeof line, f) != NULL) {   // 한 줄씩(줄바꿈 포함), 끝이면 NULL
        line_no++;
        char name[32];
        int score;
        if (sscanf(line, "%31s %d", name, &score) != 2) {   // 두 값을 다 읽었는지 확인
            printf("%d번째 줄 건너뜀: %s", line_no, line);
            continue;
        }
        printf("%-8s %3d\n", name, score);
        count++;
        total += score;
    }
    if (ferror(f)) {                        // 끝(EOF)이 아니라 오류로 멈췄는지
        printf("읽는 중 오류\n");
    }
    fclose(f);
    printf("%d명, 평균 %.1f\n", count, count ? (double)total / count : 0.0);

    FILE *missing = fopen("no_such_file.txt", "r");
    if (missing == NULL) {
        printf("없는 파일 열기: NULL, errno가 ENOENT인가? %s\n", errno == ENOENT ? "예" : "아니요");
    } else {
        fclose(missing);
    }

    f = fopen(path, "a");                   // "a": 끝에 이어 쓴다
    if (f != NULL) {
        fprintf(f, "doyun 88\n");
        fclose(f);
    }
    f = fopen(path, "r");
    if (f != NULL) {
        int lines = 0, ch;
        while ((ch = fgetc(f)) != EOF) {    // EOF는 char가 아니라 int로 받아야 구별된다
            if (ch == '\n') {
                lines++;
            }
        }
        fclose(f);
        printf("이어 쓴 뒤 줄 수 %d\n", lines);
    }
    remove(path);                           // 연습 파일 지우기
    return 0;
}
```

실행 결과:

```text
minji     92
junho     85
3번째 줄 건너뜀: broken line
seoyeon   78
3명, 평균 85.0
없는 파일 열기: NULL, errno가 ENOENT인가? 예
이어 쓴 뒤 줄 수 5
```

### 코드 한 부분씩 읽기

| 코드                                                | 설명                                                                                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `FILE *f = fopen(path, "w");`                       | `FILE`은 열린 파일의 정보(위치, 버퍼 등)를 담은 구조체이고, 우리는 그 포인터만 다룹니다.                                                       |
| `if (fclose(f) != 0) { return 0; }`                 | `fprintf`는 내용을 곧바로 디스크에 쓰지 않고 버퍼에 모아 둡니다. 닫을 때 남은 내용을 쓰다가 실패할 수 있어서, 쓰기용 파일은 닫기도 확인합니다. |
| `while (fgets(line, sizeof line, f) != NULL)`       | 읽기에 성공한 동안만 반복합니다. `line`에는 줄바꿈까지 들어 있어서, 건너뛴 줄을 출력할 때 `\n`을 따로 붙이지 않았습니다.                       |
| `sscanf(line, "%31s %d", name, &score) != 2`        | 이름과 점수 두 값을 모두 읽었는지 확인합니다. `"broken line"`은 `%d`에서 실패해 1을 돌려줍니다.                                                |
| `if (ferror(f))`                                    | 반복이 끝난 이유가 "끝"이 아니라 "오류"인지 확인합니다.                                                                                        |
| `errno == ENOENT`                                   | 없는 파일이라 `ENOENT`(No such entry)입니다. 권한 문제면 `EACCES`입니다.                                                                       |
| `fopen(path, "a")`                                  | 끝에 이어 써서 줄이 5개가 됐습니다.                                                                                                            |
| `int lines = 0, ch; while ((ch = fgetc(f)) != EOF)` | `ch`를 `int`로 받아 `EOF`와 구별합니다. 한 글자씩 읽으며 줄바꿈을 셉니다.                                                                      |
| `remove(path);`                                     | 연습용 파일을 지웁니다. 성공하면 0을 돌려줍니다.                                                                                               |

## 6. Python으로 구현하기

```python
# 파일: file_io.py
import errno
import os

path = "scores.txt"
with open(path, "w", encoding="utf-8") as f:     # 블록이 끝나면 자동으로 닫힌다
    f.write("minji 92\njunho 85\nbroken line\nseoyeon 78\n")

count = total = 0
with open(path, encoding="utf-8") as f:
    for line_no, line in enumerate(f, start=1):  # 파일은 줄 단위로 돌 수 있다
        parts = line.split()
        if len(parts) != 2 or not parts[1].isdigit():
            print(f"{line_no}번째 줄 건너뜀: {line}", end="")
            continue
        name, score = parts[0], int(parts[1])
        print(f"{name:<8} {score:>3}")
        count += 1
        total += score
print(f"{count}명, 평균 {total / count if count else 0:.1f}")

try:
    open("no_such_file.txt", encoding="utf-8")
except FileNotFoundError as e:
    print("없는 파일 열기: FileNotFoundError, errno가 ENOENT인가?", "예" if e.errno == errno.ENOENT else "아니요")

with open(path, "a", encoding="utf-8") as f:
    f.write("doyun 88\n")
with open(path, encoding="utf-8") as f:
    print("이어 쓴 뒤 줄 수", sum(1 for _ in f))
os.remove(path)
```

실행 결과:

```text
minji     92
junho     85
3번째 줄 건너뜀: broken line
seoyeon   78
3명, 평균 85.0
없는 파일 열기: FileNotFoundError, errno가 ENOENT인가? 예
이어 쓴 뒤 줄 수 5
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `with open(path, "w", encoding="utf-8") as f:` | 모드는 C와 같습니다. 블록을 나가면 오류가 나도 닫힙니다(Day 35). 인코딩을 항상 적으세요.                             |
| `for line_no, line in enumerate(f, start=1):`  | 파일 객체는 줄 단위로 돌 수 있습니다. 줄 길이 제한이 없어서 C의 "버퍼 크기만큼 끊어 읽기"를 신경 쓰지 않아도 됩니다. |
| `parts = line.split()` / `len(parts) != 2`     | C의 `sscanf(...) != 2`에 해당하는 형식 검사입니다.                                                                   |
| `except FileNotFoundError as e:`               | 열기 실패는 예외로 알려 줍니다. `e.errno`에 C와 같은 오류 번호가 들어 있습니다.                                      |
| `sum(1 for _ in f)`                            | 줄마다 1을 더해 줄 수를 셉니다. 파일 전체를 메모리에 올리지 않습니다.                                                |

## 7. Rust로 구현하기

```rust
// 파일: file_io.rs
use std::fs::{self, File, OpenOptions};
use std::io::{self, BufRead, BufReader, Write};

fn write_scores(path: &str) -> io::Result<()> {
    let mut f = File::create(path)?;        // 실패하면 ?가 오류를 돌려준다
    writeln!(f, "minji 92")?;
    writeln!(f, "junho 85")?;
    writeln!(f, "broken line")?;
    writeln!(f, "seoyeon 78")?;
    Ok(())                                  // f는 여기서 Drop되며 닫힌다
}

fn main() -> io::Result<()> {
    let path = "scores.txt";
    write_scores(path)?;

    let reader = BufReader::new(File::open(path)?);
    let (mut count, mut total) = (0, 0);
    for (i, line) in reader.lines().enumerate() {
        let line = line?;                   // 줄마다 읽기 오류가 있을 수 있다
        let mut parts = line.split_whitespace();
        match (parts.next(), parts.next().and_then(|s| s.parse::<i32>().ok())) {
            (Some(name), Some(score)) => {
                println!("{name:<8} {score:>3}");
                count += 1;
                total += score;
            }
            _ => println!("{}번째 줄 건너뜀: {line}", i + 1),
        }
    }
    println!("{count}명, 평균 {:.1}", if count > 0 { total as f64 / count as f64 } else { 0.0 });

    match File::open("no_such_file.txt") {
        Ok(_) => println!("열렸다?"),
        Err(e) => println!("없는 파일 열기: Err, NotFound인가? {}", if e.kind() == io::ErrorKind::NotFound { "예" } else { "아니요" }),
    }

    let mut f = OpenOptions::new().append(true).open(path)?;
    writeln!(f, "doyun 88")?;
    drop(f);
    println!("이어 쓴 뒤 줄 수 {}", fs::read_to_string(path)?.lines().count());
    fs::remove_file(path)?;
    Ok(())
}
```

실행 결과:

```text
minji     92
junho     85
3번째 줄 건너뜀: broken line
seoyeon   78
3명, 평균 85.0
없는 파일 열기: Err, NotFound인가? 예
이어 쓴 뒤 줄 수 5
```

### 코드 한 부분씩 읽기

| 코드                                                   | 설명                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `fn write_scores(path: &str) -> io::Result<()>`        | 파일 작업은 모두 `io::Result`를 돌려줍니다. 성공이면 `Ok(값)`, 실패면 `Err(io::Error)`입니다.                  |
| `File::create(path)?`                                  | C의 `fopen(path, "w")`입니다. 실패하면 `?`가 오류를 돌려주며 함수를 끝냅니다.                                  |
| `writeln!(f, "minji 92")?;`                            | `println!`처럼 쓰되 파일에 씁니다. 결과를 `?`로 확인하지 않으면 경고가 납니다(실수 4).                         |
| `BufReader::new(File::open(path)?)` / `reader.lines()` | 버퍼를 두고 줄 단위로 읽습니다. 줄마다 `io::Result<String>`이라 `line?`로 꺼냅니다.                            |
| `match (parts.next(), parts.next().and_then(...))`     | 두 값을 튜플로 묶어 한 번에 검사합니다. 이름이 있고 점수가 숫자일 때만 `(Some, Some)`입니다.                   |
| `e.kind() == io::ErrorKind::NotFound`                  | 오류 종류를 열거형으로 비교합니다. C의 `errno == ENOENT`에 해당합니다.                                         |
| `OpenOptions::new().append(true).open(path)?`          | C의 `"a"` 모드입니다.                                                                                          |
| `fn main() -> io::Result<()>`                          | `main`도 `Result`를 돌려줄 수 있어서 `?`를 쓸 수 있습니다. 오류가 나면 메시지를 출력하고 실패 상태로 끝납니다. |

## 8. 실행 추적

C 예제의 읽기 반복에서 `fgets`와 `sscanf`의 반환값을 따라갑니다.

| 반복 | `fgets` 반환 | `line`            | `sscanf` 반환 | 처리         | `count` | `total` |
| ---- | ------------ | ----------------- | ------------- | ------------ | ------- | ------- |
| 1    | `line`       | `"minji 92\n"`    | 2             | 출력, 더하기 | 1       | 92      |
| 2    | `line`       | `"junho 85\n"`    | 2             | 출력, 더하기 | 2       | 177     |
| 3    | `line`       | `"broken line\n"` | 1             | 건너뜀       | 2       | 177     |
| 4    | `line`       | `"seoyeon 78\n"`  | 2             | 출력, 더하기 | 3       | 255     |
| 5    | `NULL`       | (그대로)          | -             | 반복 끝      |         |         |

반복이 끝난 뒤 `ferror(f)`는 거짓이라 "끝"으로 멈춘 것이 확인됩니다. 평균은 255 / 3 = 85.0입니다.

## 9. 다른 예제로 다시 이해하기

**로그 보고서.** 로그 파일의 각 줄은 `INFO`, `WARN`, `ERROR` 중 하나로 시작합니다. 수준별 개수를 세고, `ERROR` 줄은 따로 모아 보고서 파일에 씁니다. 파일을 **두 개** 여는 함수라 정리가 중요합니다.

```c
// 파일: log_report.c
#include <stdio.h>
#include <string.h>

// log_path를 읽어 수준별 개수를 report_path에 쓴다. 성공하면 0, 실패하면 -1
int make_report(const char *log_path, const char *report_path) {
    int result = -1;                        // 실패로 시작해서, 끝까지 가면 성공으로 바꾼다
    FILE *in = NULL;
    FILE *out = NULL;
    int info = 0, warn = 0, error = 0, other = 0;
    char line[128];

    in = fopen(log_path, "r");
    if (in == NULL) {
        goto cleanup;
    }
    out = fopen(report_path, "w");
    if (out == NULL) {
        goto cleanup;                       // in은 열려 있으니 정리하러 간다
    }
    while (fgets(line, sizeof line, in) != NULL) {
        if (strncmp(line, "INFO", 4) == 0) {
            info++;
        } else if (strncmp(line, "WARN", 4) == 0) {
            warn++;
        } else if (strncmp(line, "ERROR", 5) == 0) {
            error++;
            fprintf(out, "오류 줄: %s", line);
        } else {
            other++;
        }
    }
    if (ferror(in)) {
        goto cleanup;
    }
    fprintf(out, "INFO %d, WARN %d, ERROR %d, 기타 %d\n", info, warn, error, other);
    result = 0;

cleanup:                                    // 모든 경로가 여기서 정리한다
    if (out != NULL && fclose(out) != 0) {
        result = -1;
    }
    if (in != NULL) {
        fclose(in);
    }
    return result;
}

int main(void) {
    FILE *f = fopen("app.log", "w");
    if (f == NULL) {
        return 1;
    }
    fputs("INFO start\nWARN disk 80%\nINFO user login\nERROR db timeout\nhello\nERROR retry failed\n", f);
    fclose(f);

    if (make_report("app.log", "report.txt") != 0) {
        printf("보고서 실패\n");
        return 1;
    }
    f = fopen("report.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char line[128];
    while (fgets(line, sizeof line, f) != NULL) {
        fputs(line, stdout);
    }
    fclose(f);
    printf("없는 로그: %d\n", make_report("missing.log", "report2.txt"));
    remove("app.log");
    remove("report.txt");
    return 0;
}
```

실행 결과:

```text
오류 줄: ERROR db timeout
오류 줄: ERROR retry failed
INFO 2, WARN 1, ERROR 2, 기타 1
없는 로그: -1
```

| 코드                                                    | 설명                                                                                                                                                 |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int result = -1; FILE *in = NULL; FILE *out = NULL;`   | 실패로 시작하고, 자원은 모두 `NULL`로 둡니다. 어느 지점에서 `cleanup`으로 가도 무엇이 열려 있는지 알 수 있습니다.                                    |
| `if (out == NULL) { goto cleanup; }`                    | 이때 `in`은 열려 있습니다. 정리 구역이 `in`을 닫아 줍니다.                                                                                           |
| `strncmp(line, "ERROR", 5) == 0`                        | 줄의 앞 다섯 글자만 비교합니다. 줄 전체를 비교하는 `strcmp`와 다릅니다.                                                                              |
| `result = 0;`                                           | 모든 단계를 통과했을 때만 성공으로 바꿉니다.                                                                                                         |
| `if (out != NULL && fclose(out) != 0) { result = -1; }` | 쓰기 파일을 닫다가 실패하면 보고서가 온전하지 않으니 실패로 바꿉니다.                                                                                |
| `make_report("missing.log", ...)`                       | 첫 `fopen`에서 실패해 곧바로 `cleanup`으로 갑니다. 두 포인터 모두 `NULL`이라 닫을 것이 없고, `-1`을 돌려줍니다. `report2.txt`는 만들어지지 않습니다. |

Python에서는 `with` 하나에 두 파일을 함께 열 수 있고, 어느 쪽에서 실패해도 이미 연 파일은 닫힙니다.

```python
# 파일: log_report.py
import os


def make_report(log_path, report_path):
    counts = {"INFO": 0, "WARN": 0, "ERROR": 0, "기타": 0}
    with open(log_path, encoding="utf-8") as src, open(report_path, "w", encoding="utf-8") as out:
        for line in src:                    # 두 파일 모두 블록을 나갈 때 닫힌다(오류가 나도)
            level = line.split(" ", 1)[0]
            key = level if level in counts else "기타"
            counts[key] += 1
            if key == "ERROR":
                out.write(f"오류 줄: {line}")
        out.write(", ".join(f"{k} {v}" for k, v in counts.items()) + "\n")


with open("app.log", "w", encoding="utf-8") as f:
    f.write("INFO start\nWARN disk 80%\nINFO user login\nERROR db timeout\nhello\nERROR retry failed\n")
make_report("app.log", "report.txt")
with open("report.txt", encoding="utf-8") as f:
    print(f.read(), end="")
try:
    make_report("missing.log", "report2.txt")
except FileNotFoundError:
    print("없는 로그: FileNotFoundError")
print("report2.txt가 생겼나?", os.path.exists("report2.txt"))
os.remove("app.log")
os.remove("report.txt")
```

실행 결과:

```text
오류 줄: ERROR db timeout
오류 줄: ERROR retry failed
INFO 2, WARN 1, ERROR 2, 기타 1
없는 로그: FileNotFoundError
report2.txt가 생겼나? False
```

- `with open(a) as src, open(b, "w") as out:`는 왼쪽부터 엽니다. 첫 번째가 실패하면 두 번째는 열리지 않아서, 없는 로그로 부르면 `report2.txt`가 생기지 않습니다.
- `line.split(" ", 1)[0]`은 첫 공백 앞의 단어입니다. 공백이 없는 줄(`hello`)도 그 자체가 첫 단어가 되어 "기타"로 셉니다.

Rust에서는 `?`와 `Drop`이 `goto cleanup`을 대신합니다.

```rust
// 파일: log_report.rs
use std::fs::{self, File};
use std::io::{self, BufRead, BufReader, Write};

fn make_report(log_path: &str, report_path: &str) -> io::Result<()> {
    let src = BufReader::new(File::open(log_path)?);   // 실패하면 여기서 돌아간다
    let mut out = File::create(report_path)?;          // 이 줄에서 실패해도 src는 자동으로 닫힌다
    let (mut info, mut warn, mut error, mut other) = (0, 0, 0, 0);
    for line in src.lines() {
        let line = line?;
        match line.split(' ').next().unwrap_or("") {
            "INFO" => info += 1,
            "WARN" => warn += 1,
            "ERROR" => {
                error += 1;
                writeln!(out, "오류 줄: {line}")?;
            }
            _ => other += 1,
        }
    }
    writeln!(out, "INFO {info}, WARN {warn}, ERROR {error}, 기타 {other}")?;
    Ok(())                                  // out, src 모두 여기서 Drop되며 닫힌다
}

fn main() -> io::Result<()> {
    fs::write("app.log", "INFO start\nWARN disk 80%\nINFO user login\nERROR db timeout\nhello\nERROR retry failed\n")?;
    make_report("app.log", "report.txt")?;
    print!("{}", fs::read_to_string("report.txt")?);
    if let Err(e) = make_report("missing.log", "report2.txt") {
        println!("없는 로그: {:?}", e.kind());
    }
    fs::remove_file("app.log")?;
    fs::remove_file("report.txt")?;
    Ok(())
}
```

실행 결과:

```text
오류 줄: ERROR db timeout
오류 줄: ERROR retry failed
INFO 2, WARN 1, ERROR 2, 기타 1
없는 로그: NotFound
```

- `File::create(report_path)?`에서 실패해도, 먼저 연 `src`는 함수를 나가며 Drop되어 닫힙니다. 정리 코드를 한 줄도 쓰지 않았습니다.
- `match line.split(' ').next().unwrap_or("")`로 첫 단어에 따라 개수를 셉니다. `_ => other += 1`이 C의 `else`입니다.
- `fs::write(path, 내용)`과 `fs::read_to_string(path)`은 파일 전체를 한 번에 쓰고 읽는 편의 함수입니다(Day 48).

## 10. 파일 입출력 대응표

| 하고 싶은 일   | C                                  | Python                           | Rust                                       |
| -------------- | ---------------------------------- | -------------------------------- | ------------------------------------------ |
| 쓰기용 열기    | `fopen(p, "w")` → `NULL` 검사      | `open(p, "w", encoding="utf-8")` | `File::create(p)?`                         |
| 이어 쓰기      | `fopen(p, "a")`                    | `open(p, "a", ...)`              | `OpenOptions::new().append(true).open(p)?` |
| 읽기용 열기    | `fopen(p, "r")`                    | `open(p, encoding="utf-8")`      | `File::open(p)?`                           |
| 한 줄 쓰기     | `fprintf(f, "...\n", ...)`         | `f.write("...\n")`               | `writeln!(f, "...")?`                      |
| 줄 단위로 읽기 | `while (fgets(buf, n, f) != NULL)` | `for line in f:`                 | `for line in BufReader::new(f).lines()`    |
| 전체 읽기      | 직접 반복                          | `f.read()`                       | `fs::read_to_string(p)?`                   |
| 없는 파일 구별 | `errno == ENOENT`                  | `except FileNotFoundError`       | `e.kind() == ErrorKind::NotFound`          |
| 닫기           | `fclose(f)`(반환값 확인)           | `with` 블록 끝                   | 범위 끝(Drop)                              |

## 11. 세 언어 비교

| 관점               | C                                     | Python                  | Rust                                      |
| ------------------ | ------------------------------------- | ----------------------- | ----------------------------------------- |
| 실패를 알리는 방법 | 반환값(`NULL`, `EOF`, 개수) + `errno` | 예외                    | `io::Result`                              |
| 실패를 무시하면    | 아무 말 없음                          | 예외가 위로 올라가 멈춤 | 경고(`must_use`), 값을 꺼내려면 처리 필수 |
| 닫기               | 직접, 모든 경로에서                   | `with`                  | Drop(자동)                                |
| 한 줄의 길이       | 버퍼 크기 제한                        | 제한 없음               | 제한 없음(`String`)                       |
| 여러 자원 정리     | `goto cleanup`                        | `with a, b:`            | 자동(만든 반대 순서)                      |

## 12. 자주 하는 실수

### 실수 1: while (!feof(f))로 반복한다 (C)

```c
// 파일: feof_loop.c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("two.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fputs("first\nsecond\n", f);
    fclose(f);

    f = fopen("two.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char line[32] = "";
    while (!feof(f)) {
        fgets(line, sizeof line, f);
        printf("읽음: %s", line);
    }
    fclose(f);
    remove("two.txt");
    return 0;
}
```

실행 결과:

```text
읽음: first
읽음: second
읽음: second
```

마지막 줄이 두 번 나옵니다. 실습의 변형 문제처럼 `while (fgets(...) != NULL)`로 쓰세요.

### 실수 2: fopen 결과를 확인하지 않는다 (C)

`FILE *f = fopen(path, "r"); fgets(buf, n, f);`는 파일이 없으면 `NULL`로 `fgets`를 불러 프로그램이 멈춥니다. 열기 직후에 항상 확인하세요.

### 실수 3: fgetc 결과를 char로 받는다 (C)

`char ch; while ((ch = fgetc(f)) != EOF)`는 바이트 0xFF를 끝으로 착각하거나, 끝을 영영 알아보지 못할 수 있습니다. `int ch;`로 받으세요.

### 실수 4: 쓰기 결과를 무시한다 (Rust)

```rust
// 파일: ignore_result.rs (컴파일 오류: unused `Result` that must be used)
use std::fs::File;
use std::io::Write;

fn main() {
    let mut f = File::create("note.txt").unwrap();
    writeln!(f, "hello");
}
```

실습의 디버그 문제입니다. `?`로 처리하세요. C에서는 같은 실수에 아무 경고가 없습니다.

### 실수 5: 인코딩을 적지 않고 파일을 연다 (Python)

`open(path)`는 운영체제의 기본 인코딩을 씁니다. 한국어 Windows에서 만든 파일(cp949)을 Linux에서 UTF-8로 읽으면 `UnicodeDecodeError`가 납니다. 텍스트 파일은 항상 `encoding="utf-8"`을 적으세요(Day 47에서 자세히).

## 13. Q&A

**Q. fclose를 하지 않으면 어떻게 되나요?**

A. 프로그램이 정상적으로 끝나면 대부분 운영체제가 정리하면서 남은 내용도 쓰지만, 중간에 멈추면 버퍼에 남은 내용이 사라질 수 있습니다. 또 오래 도는 프로그램은 열 수 있는 파일 수 한도에 걸립니다. 연 파일은 항상 닫으세요.

**Q. 파일에 쓴 내용이 언제 실제로 디스크에 저장되나요?**

A. `fprintf`는 먼저 메모리의 버퍼에 모았다가, 버퍼가 차거나 `fflush(f)`나 `fclose(f)`를 부를 때 운영체제에 넘깁니다. 운영체제도 다시 한 번 모아 두었다가 디스크에 씁니다. 정전에도 살아남아야 하는 데이터라면 운영체제별 함수(`fsync` 등)가 더 필요합니다.

**Q. fscanf로 바로 읽으면 안 되나요?**

A. 형식이 항상 맞는 파일이라면 `fscanf(f, "%31s %d", name, &score) == 2`처럼 써도 됩니다. 다만 형식이 틀린 줄을 만나면 그 줄의 남은 부분이 다음 읽기에 섞여 들어와 복구가 어렵습니다. 사람이 만든 파일처럼 틀린 줄이 있을 수 있다면 `fgets` + `sscanf`가 안전합니다.

**Q. 이 과정의 브라우저 실행기에서도 파일을 쓸 수 있나요?**

A. Python 실행기는 브라우저 안의 가상 파일 공간에 쓰고 읽을 수 있습니다. 컴퓨터의 실제 파일에는 닿지 않고, 페이지를 새로 고치면 사라집니다. C와 Rust 예제는 브라우저에서 컴파일되지 않으니 자기 컴퓨터에서 실행해 보세요.

## 14. 핵심 요약

- 파일 입출력은 **열기 → 쓰기/읽기 → 확인 → 닫기**이고, 모든 단계가 실패할 수 있습니다.
- `fopen`은 실패하면 `NULL`, 이유는 `errno`입니다. 모드 `"w"`는 내용을 비우고 `"a"`는 이어 씁니다.
- 반복은 **읽기 함수의 반환값**으로 제어합니다: `while (fgets(...) != NULL)`, `while ((ch = fgetc(f)) != EOF)`(`ch`는 `int`). `feof`·`ferror`는 반복이 끝난 뒤 이유를 구별할 때 씁니다.
- `fgets`는 버퍼 크기만큼 끊어 읽습니다. 형식이 있는 줄은 `fgets` + `sscanf`로 읽고 반환값으로 개수를 확인합니다.
- 쓰기용 파일은 `fclose`의 반환값도 확인합니다. 여러 자원은 `goto cleanup`으로 모든 경로에서 정리합니다.
- Python은 `with open(..., encoding="utf-8")`과 예외로, Rust는 `io::Result`와 `?`, Drop으로 같은 일을 더 안전하게 합니다.

## 15. 도전 문제

1. **(C)** 파일의 모든 줄을 읽어, 가장 긴 줄의 번호와 길이를 출력하세요. `fgets` 결과가 `'\n'`으로 끝나지 않으면 줄이 아직 끝나지 않은 것이므로, 한 줄이 여러 번에 나뉘어 읽혀도 길이를 제대로 합쳐야 합니다.
2. **(C)** `int copy_file(const char *src, const char *dst)`를 `"rb"`, `"wb"`와 `fread`·`fwrite`로 만들고, `goto cleanup`으로 두 파일을 정리하세요.
3. **(Python)** 로그 보고서 예제에 날짜별 개수를 추가하세요. 줄 모양은 `2026-11-15 ERROR db timeout`입니다.
4. **(Rust)** 로그 보고서 예제의 결과를 `BTreeMap<String, u32>`로 모아, 처음 보는 수준(`DEBUG` 등)도 따로 세도록 바꾸세요.
