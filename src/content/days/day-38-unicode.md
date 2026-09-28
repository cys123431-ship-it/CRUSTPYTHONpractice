---
schemaVersion: 1
contentVersion: "2026.10-t1"
id: day-38-unicode
courseId: crp-92
phaseId: phase-04
dayNumber: 38
date: "2026-11-07"
title: Python 문자열과 유니코드
summary: 글자에 번호를 붙인 유니코드(코드 포인트)와 그 번호를 바이트로 저장하는 UTF-8을 구별합니다. Python의 ord·chr, str과 bytes를 오가는 encode·decode, 잘린 바이트에서 나는 UnicodeDecodeError와 errors 옵션, 같은 글자가 다른 코드 포인트 열로 저장되는 정규화(NFC·NFD), 눈에 보이는 한 글자가 여러 코드 포인트인 이모지, 자주 쓰는 str 메서드를 다룹니다. C에서 UTF-8 바이트를 직접 해석하는 방법, Rust의 char·바이트 위치·from_utf8과 비교하고, 한글 음절을 초성·중성·종성으로 나눠 받침에 맞는 조사(은/는, 이/가, 을/를, 으로/로)를 고르는 프로그램을 만들어 봅니다.
anchorLanguage: python
transferLanguages: [c, rust]
difficulty: intermediate
estimatedMinutes: 110
prerequisites: [day-37-c-strings]
learningObjectives:
  - 코드 포인트와 UTF-8 바이트를 구별하고, ord·chr·encode·decode로 서로 바꾼다.
  - 잘린 바이트를 decode할 때의 오류를 설명하고, errors 옵션과 바이트 제한 자르기를 사용한다.
  - NFC·NFD 정규화가 필요한 경우와, len이 눈에 보이는 글자 수와 다를 수 있는 경우를 설명한다.
  - C에서 UTF-8 바이트를 해석해 글자 수와 코드 포인트를 구한다.
  - Rust의 char·char_indices·from_utf8을 쓰고, 문자열 위치가 바이트 번호라는 점을 Python과 비교한다.
concepts:
  [
    unicode,
    code point,
    utf-8,
    encode,
    decode,
    bytes,
    unicode decode error,
    errors replace,
    normalization,
    nfc,
    nfd,
    grapheme,
    hangul syllable,
    char indices,
    from utf8,
  ]
runnerMode: python
playgroundSource: |
  # 파일: unicode_play.py — 글자의 번호와 바이트를 확인해 보세요.
  for ch in "A é 한 😀".split():
      data = ch.encode("utf-8")
      print(ch, hex(ord(ch)), len(data), data.hex(" "))
  code = ord("한") - 0xAC00
  print("초성", code // 588, "중성", code // 28 % 21, "종성", code % 28)
reviewOffsets: [1, 3, 7, 14, 30]
sample: false
exercises:
  - id: ex-day38-predict-py
    title: 글자 수와 바이트 수 예측하기
    kind: predict
    objective: 문자마다 UTF-8 바이트 수가 1~4바이트로 다르다는 것을 추적한다.
    prompt: 출력되는 두 수를 공백으로 구분해 적으세요.
    starter: |-
      s = "가A😀"
      print(len(s), len(s.encode()))
    answer: "3 8"
    hint: "한글은 3바이트, 영문은 1바이트, 이모지(U+1F600)는 4바이트입니다."
    explanation: "len(s)는 코드 포인트 세 개라 3입니다. UTF-8로는 3 + 1 + 4 = 8바이트입니다. 코드 포인트 번호가 클수록 더 많은 바이트를 씁니다(0x7F까지 1바이트, 0x7FF까지 2바이트, 0xFFFF까지 3바이트, 그 이상 4바이트)."
    commonMistakes:
      - "이모지를 3바이트로 세어 7로 적음"
      - "len(s)가 바이트 수라고 생각함"
    language: python
    verification: run
  - id: ex-day38-predict-rs
    title: 바이트 위치와 글자 위치 예측하기
    kind: predict
    objective: Rust의 find가 바이트 위치를, position이 글자 순번을 돌려준다는 것을 구별한다.
    prompt: 출력되는 한 줄을 그대로 적으세요.
    starter: |-
      fn main() {
          let s = "가나다";
          println!("{:?} {:?}", s.find('나'), s.chars().position(|c| c == '나'));
      }
    answer: "Some(3) Some(1)"
    hint: "'가'가 0~2번 바이트를 차지합니다. chars()는 글자를 하나씩 셉니다."
    explanation: 'str::find는 슬라이스에 바로 쓸 수 있는 바이트 위치를 돌려줘서 3입니다(&s[3..]은 "나다"). chars().position은 몇 번째 글자인지 세어 1입니다. Python의 "가나다".find("나")는 글자 위치 1을 돌려줍니다. 같은 이름의 메서드라도 세는 단위가 다릅니다.'
    commonMistakes:
      - "두 값이 모두 1이라고 생각함"
      - "find가 Option이 아니라 -1을 돌려준다고 생각함(Python의 find)"
    language: rust
    verification: run
  - id: ex-day38-fill
    title: 바이트를 문자열로 되돌리기 채우기
    kind: fill
    objective: bytes를 str로 바꾸는 메서드를 쓴다.
    prompt: "빈칸을 채워 UTF-8 바이트를 문자열로 되돌려 '안녕'이 출력되게 하세요."
    starter: |-
      data = "안녕".encode("utf-8")
      text = data._____("utf-8")
      print(text)
    answer: |-
      data = "안녕".encode("utf-8")
      text = data.decode("utf-8")
      print(text)
    output: "안녕"
    hint: "str → bytes가 encode이면, 반대 방향은 무엇일까요?"
    explanation: "encode는 글자를 정해진 규칙(UTF-8)으로 바이트로 바꾸고, decode는 같은 규칙으로 바이트를 글자로 되돌립니다. 규칙이 다르면(예를 들어 latin-1로 decode) 오류가 나거나 알아볼 수 없는 글자(글자 깨짐)가 나옵니다. 파일과 네트워크는 바이트만 주고받으므로 어느 규칙인지 약속이 꼭 필요합니다."
    commonMistakes:
      - "str(data)로 바꿔 \"b'\\xec...'\" 모양의 글자가 나옴"
      - "encode를 한 번 더 부름"
    language: python
    verification: run
  - id: ex-day38-modify
    title: 글자 수 자르기를 바이트 제한 자르기로 바꾸기
    kind: modify
    objective: 바이트 제한에 맞추되 글자 중간에서 자르지 않는다.
    prompt: "저장 공간이 10바이트로 정해져 있습니다. s[:10]은 글자 10개를 남겨 15바이트가 됩니다. 10바이트 안에 들어가는 만큼만 남기도록 고쳐, 남은 문자열과 바이트 수 '가나다 9'가 출력되게 하세요."
    starter: |-
      s = "가나다라마"
      cut = s[:10]
      print(cut, len(cut.encode()))
    answer: |-
      s = "가나다라마"
      cut = s.encode()[:10].decode("utf-8", errors="ignore")
      print(cut, len(cut.encode()))
    output: "가나다 9"
    hint: "먼저 바이트로 바꿔 10바이트에서 자르면, 마지막 글자가 중간에서 잘립니다. 잘린 조각을 버리며 decode하는 옵션이 있습니다."
    explanation: '"가나다라마"는 15바이트입니다. 바이트로 10개를 자르면 ''라''의 첫 바이트만 남는데, errors="ignore"로 decode하면 온전하지 않은 그 조각을 버려 "가나다"(9바이트)가 됩니다. 데이터베이스 칸이나 C의 char 배열처럼 크기가 바이트로 정해진 곳에 넣을 때 쓰는 방법입니다. errors="replace"면 조각 대신 �가 들어갑니다.'
    commonMistakes:
      - "s[:3]처럼 글자 수를 직접 계산해 영문이 섞이면 틀림"
      - "errors 없이 decode해 UnicodeDecodeError가 남"
    language: python
    verification: run
  - id: ex-day38-debug
    title: str과 bytes를 더하는 오류 고치기
    kind: debug
    objective: str과 bytes를 섞지 않고 한쪽으로 바꿔 연산한다.
    prompt: '이 코드는 TypeError(can only concatenate str (not "bytes") to str)로 멈춥니다. 바이트를 먼저 문자열로 바꿔 ''Hello, 모모''가 출력되게 하세요.'
    starter: |-
      header = b"Hello, "
      name = "모모"
      print(name + header)
    answer: |-
      header = b"Hello, "
      name = "모모"
      print(header.decode("utf-8") + name)
    output: "Hello, 모모"
    hint: 'b"..."는 bytes입니다. 글자(str)와 바이트(bytes)는 서로 다른 자료형이라 바로 더할 수 없습니다.'
    explanation: "Python 3는 글자열과 바이트열을 엄격히 구별합니다. 바이트는 decode로 글자로, 글자는 encode로 바이트로 바꾼 뒤 같은 자료형끼리 더합니다. 프로그램 안에서는 str로 다루고, 파일·네트워크로 나갈 때만 bytes로 바꾸는 것이 좋은 습관입니다. 순서도 'Hello, ' 뒤에 이름이 오도록 바꿨습니다."
    commonMistakes:
      - 'str(header)로 바꿔 "b''Hello, ''모모"가 출력됨'
      - "name.encode()와 더해 바이트가 출력됨(b'Hello, \\xeb...')"
    language: python
    verification: run
  - id: ex-day38-independent
    title: C로 한글 음절 개수 세기
    kind: independent
    objective: UTF-8 바이트를 해석해 코드 포인트 범위로 한글 음절을 판별한다.
    prompt: 'int count_hangul(const char *s)를 만들어 UTF-8 문자열에서 한글 음절(U+AC00~U+D7A3)의 개수를 세세요. "가A나b😀다"에서 ''3''이 출력되게 하세요.'
    starter: |-
      #include <stdio.h>

      int main(void) {
          printf("여기에 count_hangul을 만들어 호출하세요\n");
          return 0;
      }
    answer: |-
      #include <stdio.h>

      int count_hangul(const char *s) {
          const unsigned char *p = (const unsigned char *)s;
          int n = 0;
          while (*p != '\0') {
              if ((p[0] & 0xF0) == 0xE0) {
                  unsigned cp = ((p[0] & 0x0Fu) << 12) | ((p[1] & 0x3Fu) << 6) | (p[2] & 0x3Fu);
                  if (cp >= 0xAC00 && cp <= 0xD7A3) {
                      n++;
                  }
                  p += 3;
              } else if ((p[0] & 0xE0) == 0xC0) {
                  p += 2;
              } else if ((p[0] & 0xF8) == 0xF0) {
                  p += 4;
              } else {
                  p += 1;
              }
          }
          return n;
      }

      int main(void) {
          printf("%d\n", count_hangul("가A나b😀다"));
          return 0;
      }
    output: "3"
    hint: "첫 바이트의 앞 비트로 글자의 길이를 압니다(0xxxxxxx 1, 110xxxxx 2, 1110xxxx 3, 11110xxx 4바이트). 한글 음절은 모두 3바이트입니다."
    explanation: "3바이트 글자면 코드 포인트를 계산해 한글 음절 범위인지 확인하고, 아니면 글자 길이만큼 건너뜁니다. 이모지(4바이트)를 1바이트씩 건너뛰면 이어지는 바이트를 새 글자의 시작으로 착각할 수 있으므로 길이를 정확히 건너뛰는 것이 중요합니다. 이 코드는 올바른 UTF-8이 들어온다고 가정합니다. 잘린 입력까지 막으려면 이어지는 바이트가 10xxxxxx인지도 확인해야 합니다."
    commonMistakes:
      - "strlen으로 나눠 3바이트마다 한 글자로 계산해 영문이 섞이면 틀림"
      - "char를 unsigned char로 바꾸지 않아 비트 연산 결과가 음수가 됨"
    language: c
    verification: run
quiz:
  - id: quiz-day38-01
    question: 코드 포인트와 UTF-8의 관계로 옳은 것은?
    choices:
      - 같은 것이다
      - 코드 포인트는 글자의 번호이고, UTF-8은 그 번호를 1~4바이트로 저장하는 방법이다
      - UTF-8은 한글만 저장한다
      - 코드 포인트는 항상 2바이트다
    answerIndex: 1
    explanation: "'한'의 번호는 U+D55C이고, UTF-8로는 ED 95 9C 세 바이트입니다. 같은 번호를 UTF-16(2 또는 4바이트)이나 UTF-32(항상 4바이트)로 저장할 수도 있습니다. 오늘날 파일과 웹은 대부분 UTF-8을 씁니다."
  - id: quiz-day38-02
    question: '"커피".encode()[:4].decode()를 실행하면?'
    choices:
      - '"커"'
      - UnicodeDecodeError
      - '"커피"'
      - 빈 문자열
    answerIndex: 1
    explanation: 4바이트는 '커'(3바이트)와 '피'의 첫 바이트입니다. 온전하지 않은 글자가 남아 기본 설정(errors="strict")에서 오류가 납니다. errors="ignore"면 "커", errors="replace"면 "커�"입니다.
  - id: quiz-day38-03
    question: unicodedata.normalize("NFD", "한")의 길이가 3인 이유는?
    choices:
      - 오류라서
      - NFD는 완성형 음절을 초성·중성·종성 자모 코드 포인트로 나누기 때문
      - UTF-8 바이트 수라서
      - 한글은 항상 3글자로 센다
    answerIndex: 1
    explanation: 같은 '한'을 U+D55C 하나(NFC)로도, ㅎ·ㅏ·ㄴ 자모 셋(NFD)으로도 저장할 수 있습니다. 보기에는 같아도 ==는 False입니다. 파일 이름(특히 macOS)이나 외부 입력을 비교하기 전에 같은 형식으로 정규화하세요.
  - id: quiz-day38-04
    question: 한글 음절 코드 c에서 받침(종성) 번호를 구하는 식은?
    choices:
      - "(c - 0xAC00) // 588"
      - "(c - 0xAC00) % 28"
      - "c % 21"
      - "c - 0xAC00"
    answerIndex: 1
    explanation: 한글 음절은 (초성 × 21 + 중성) × 28 + 종성 + 0xAC00 순서로 배치되어 있습니다. 그래서 '가'부터의 거리를 28로 나눈 나머지가 종성이고, 0이면 받침이 없습니다. 588(= 21 × 28)로 나눈 몫이 초성입니다.
  - id: quiz-day38-05
    question: Rust에서 s.len()과 Python의 len(s)가 다른 이유는?
    choices:
      - 버그다
      - Rust는 UTF-8 바이트 수를, Python은 코드 포인트 수를 세기 때문
      - Rust는 공백을 세지 않는다
      - Python은 바이트 수를 센다
    answerIndex: 1
    explanation: Rust의 문자열은 UTF-8 바이트열이라 len과 인덱스·범위가 모두 바이트 단위입니다. Python의 str은 코드 포인트의 열이라 len과 인덱스가 코드 포인트 단위입니다. 둘 다 이모지 조합처럼 '눈에 보이는 글자'를 세지는 않습니다.
---

## 1. 오늘 배울 내용

Day 37에서 "한글은 UTF-8로 3바이트"라는 말을 여러 번 했습니다. 오늘은 그 말이 정확히 무슨 뜻인지 배웁니다.

1. **유니코드**는 세상의 모든 글자에 번호(**코드 포인트**)를 붙인 표입니다. `A`는 U+0041, `한`은 U+D55C입니다.
2. **UTF-8**은 그 번호를 1~4바이트로 저장하는 규칙입니다.
3. Python에서 두 세계를 오갑니다.
   - `ord`, `chr`: 글자 ↔ 번호
   - `encode`, `decode`: `str`(글자) ↔ `bytes`(바이트)
   - 잘린 바이트의 `UnicodeDecodeError`와 `errors` 옵션
4. "한 글자"가 생각보다 복잡한 두 가지 경우를 봅니다.
   - 정규화: 같은 `한`이 코드 포인트 1개(NFC)일 수도, 3개(NFD)일 수도 있습니다.
   - 이모지 조합: 눈에 보이는 가족 이모지 하나가 코드 포인트 5개입니다.
5. 자주 쓰는 `str` 메서드를 정리합니다.
6. 다른 두 언어를 비교합니다.
   - C: UTF-8 바이트를 비트 연산으로 직접 해석합니다.
   - Rust: `char`, `char_indices`, `from_utf8`, 바이트 위치
7. 한글 음절을 초성·중성·종성으로 나눠 **받침에 맞는 조사**를 고르는 프로그램을 만듭니다.

## 2. 왜 필요한가

글자 처리 버그는 한국어 사용자에게 특히 자주 보입니다.

- 파일을 열었더니 글자가 `ì•ˆë…•`처럼 깨져 보입니다(저장한 규칙과 읽는 규칙이 다름).
- "10자까지 입력"이라고 했는데 한글 4자에서 저장이 실패합니다(글자 수와 바이트 수를 섞음).
- 두 파일 이름이 똑같아 보이는데 프로그램은 다르다고 합니다(정규화 형식이 다름).
- 문자열을 잘랐더니 마지막 글자가 �로 바뀝니다(글자 중간에서 자름).
- "사과을", "책를"처럼 조사가 어색하게 출력됩니다(받침을 확인하지 않음).

글자, 번호, 바이트를 구별하면 이런 문제의 원인이 한눈에 보입니다.

## 3. 그림으로 이해하기

글자는 세 층으로 볼 수 있습니다.

```text
눈에 보이는 글자     A        é          한              😀
코드 포인트(번호)   U+0041   U+00E9     U+D55C          U+1F600
UTF-8 바이트        41       C3 A9      ED 95 9C        F0 9F 98 80
바이트 수           1        2          3               4
```

UTF-8은 첫 바이트의 앞 비트로 **몇 바이트짜리 글자인지** 알려 줍니다. 이어지는 바이트는 항상 `10`으로 시작합니다.

```text
번호 범위            바이트 모양
U+0000 ~ U+007F     0xxxxxxx
U+0080 ~ U+07FF     110xxxxx 10xxxxxx
U+0800 ~ U+FFFF     1110xxxx 10xxxxxx 10xxxxxx            ← 한글 음절은 여기
U+10000 이상         11110xxx 10xxxxxx 10xxxxxx 10xxxxxx   ← 이모지는 여기

'한' U+D55C = 1101 010101 011100
            1110[1101] 10[010101] 10[011100] = ED 95 9C
```

Python의 `str`과 `bytes`는 서로 다른 자료형이고, 둘 사이를 `encode`·`decode`로 오갑니다.

```text
      encode("utf-8")
str ───────────────────▶ bytes
"한"                     b'\xed\x95\x9c'
    ◀───────────────────
      decode("utf-8")
```

## 4. 천천히 풀어보기

### 4.1 str과 bytes

| 자료형  | 담는 것          | 만드는 법              | `len`의 뜻     | 인덱스 하나의 결과     |
| ------- | ---------------- | ---------------------- | -------------- | ---------------------- |
| `str`   | 코드 포인트의 열 | `"한글"`               | 코드 포인트 수 | 한 글자 `str`          |
| `bytes` | 0~255 정수의 열  | `b"abc"`, `s.encode()` | 바이트 수      | 정수(`b"abc"[0]`는 97) |

프로그램 **안**에서는 `str`로 다루고, 파일·네트워크로 **나가고 들어올 때만** `bytes`로 바꿉니다. 이 경계에서 어떤 규칙(인코딩)을 쓰는지가 중요합니다.

### 4.2 decode가 실패할 때

`decode`에 올바르지 않은 바이트가 들어오면 기본값(`errors="strict"`)에서는 `UnicodeDecodeError`가 납니다. 다른 선택도 있습니다.

| `errors=`   | 잘못된 바이트를    | 쓰는 곳                                   |
| ----------- | ------------------ | ----------------------------------------- |
| `"strict"`  | 오류로 멈춤(기본)  | 데이터가 반드시 올바라야 할 때            |
| `"replace"` | `�`(U+FFFD)로 바꿈 | 사람에게 보여 줄 때, 어디가 깨졌는지 표시 |
| `"ignore"`  | 버림               | 바이트 제한에 맞춰 자른 끝 조각을 버릴 때 |

### 4.3 정규화

한글 `한`은 두 가지 방법으로 저장할 수 있습니다.

- **NFC**(완성형): U+D55C 한 개
- **NFD**(조합형): ㅎ U+1112, ㅏ U+1161, ㄴ U+11AB 세 개

화면에는 똑같이 보이지만 `==`는 `False`입니다. macOS는 파일 이름을 NFD 비슷한 형식으로 저장하는 경우가 있어서, 다른 운영체제에서 만든 이름과 비교할 때 문제가 됩니다. 비교하기 전에 `unicodedata.normalize("NFC", s)`로 맞추세요.

### 4.4 "한 글자"는 무엇인가

`len`은 코드 포인트 수입니다. 대부분은 눈에 보이는 글자 수와 같지만 예외가 있습니다.

- 👨‍👩‍👧 가족 이모지는 사람 이모지 셋 사이에 **잇는 글자(ZWJ, U+200D)** 두 개가 들어간 코드 포인트 5개입니다.
- 국기 🇰🇷는 지역 문자 두 개입니다.
- `é`는 U+00E9 하나일 수도, `e` + 결합 부호 U+0301 둘일 수도 있습니다.

눈에 보이는 글자 단위(자소 클러스터, grapheme cluster)로 세려면 표준 라이브러리 밖의 도구(`regex` 모듈의 `\X` 등)가 필요합니다.

### 4.5 한글 음절의 구조

현대 한글 음절 11,172자(U+AC00 `가` ~ U+D7A3 `힣`)는 규칙적으로 배치되어 있습니다.

```text
코드 = 0xAC00 + (초성 × 21 + 중성) × 28 + 종성
초성 = (코드 - 0xAC00) // 588      (588 = 21 × 28)
중성 = (코드 - 0xAC00) // 28 % 21
종성 = (코드 - 0xAC00) % 28        (0이면 받침 없음)
```

이 계산만으로 받침이 있는지 알 수 있어서, "사과는 / 책은"처럼 조사를 고를 수 있습니다.

## 5. Python으로 구현하기

```python
# 파일: unicode_basics.py
import unicodedata

for ch in ["A", "é", "한", "😀"]:
    data = ch.encode("utf-8")
    print(f"{ch} U+{ord(ch):04X} {len(data)}바이트 {data.hex(' ')}")

print("chr(0xD55C) =", chr(0xD55C), "/ ord('가') =", ord("가"))

text = "커피 한 잔 ☕"
data = text.encode("utf-8")                 # str → bytes
print("글자", len(text), "바이트", len(data))
print("되돌리기:", data.decode("utf-8"))      # bytes → str

broken = data[:4]                           # '피'의 중간에서 잘린 바이트
try:
    broken.decode("utf-8")
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e.reason)
print("replace:", broken.decode("utf-8", errors="replace"))

composed = "한"                              # 완성형 한 글자
decomposed = unicodedata.normalize("NFD", composed)   # 자모로 나눈 모양
print("NFC", len(composed), "NFD", len(decomposed), "같은가", composed == decomposed)
print("정규화 후 같은가", unicodedata.normalize("NFC", decomposed) == composed)

family = "\U0001F468\u200d\U0001F469\u200d\U0001F467"  # 사람 셋 사이에 잇는 글자(ZWJ) 둘
print("가족 이모지 len", len(family))

words = "  사과, 배 ,감  ".strip().split(",")
print("split:", [w.strip() for w in words], "join:", "/".join(w.strip() for w in words))
print("find:", "바나나".find("나"), "count:", "바나나".count("나"), "replace:", "바나나".replace("나", "NA", 1))
print("upper:", "straße".upper(), "casefold:", "Straße".casefold() == "STRASSE".casefold())
print("isdigit:", "123".isdigit(), "\u0663".isdigit(), "3.5".isdigit())
```

실행 결과:

```text
A U+0041 1바이트 41
é U+00E9 2바이트 c3 a9
한 U+D55C 3바이트 ed 95 9c
😀 U+1F600 4바이트 f0 9f 98 80
chr(0xD55C) = 한 / ord('가') = 44032
글자 8 바이트 18
되돌리기: 커피 한 잔 ☕
UnicodeDecodeError: unexpected end of data
replace: 커�
NFC 1 NFD 3 같은가 False
정규화 후 같은가 True
가족 이모지 len 5
split: ['사과', '배', '감'] join: 사과/배/감
find: 1 count: 2 replace: 바NA나
upper: STRASSE casefold: True
isdigit: True True False
```

### 코드 한 부분씩 읽기

| 코드                                     | 설명                                                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ord(ch)`, `f"U+{ord(ch):04X}"`          | 글자의 코드 포인트 번호입니다. `:04X`는 네 자리 이상의 대문자 16진수입니다.                                                |
| `data.hex(' ')`                          | 바이트를 16진수로, 사이에 공백을 넣어 보여 줍니다.                                                                         |
| `text.encode("utf-8")`                   | 8글자가 18바이트가 됐습니다. 한글 4자(12) + 공백 3개(3) + ☕ U+2615(3)입니다.                                              |
| `broken = data[:4]`                      | '커'(3바이트)와 '피'의 첫 바이트입니다. `bytes` 자르기는 바이트 단위라 글자 중간에서 잘립니다.                             |
| `e.reason`                               | 오류의 이유만 꺼냈습니다. 전체 메시지에는 몇 번째 바이트인지도 들어 있습니다.                                              |
| `unicodedata.normalize("NFD", composed)` | '한'을 자모 셋으로 나눴습니다. 보기에는 같아도 `==`는 `False`입니다.                                                       |
| `"\U0001F468\u200d..."`                  | 보이지 않는 ZWJ가 들어 있어 소스 코드에서는 이스케이프로 적었습니다. 화면에는 가족 이모지 하나로 보이지만 `len`은 5입니다. |
| `"바나나".find("나")`                    | Python의 문자열 위치는 **코드 포인트 번호**입니다. 결과 1은 두 번째 글자라는 뜻입니다.                                     |
| `"straße".upper()`, `casefold()`         | 독일어 ß는 대문자로 바꾸면 SS 두 글자가 됩니다. 대소문자를 무시한 비교에는 `lower()`보다 `casefold()`가 정확합니다.        |
| `"\u0663".isdigit()`                     | 아랍-인도 숫자 ٣(3)도 숫자로 봅니다. 입력이 0~9인지 확인하려면 `ch in "0123456789"`나 `str.isascii()`와 함께 쓰세요.       |

## 6. C로 구현하기

C의 `char` 배열은 바이트만 알고 글자는 모릅니다. UTF-8 규칙을 직접 적용해 글자를 셉니다.

```c
// 파일: utf8.c
#include <stdio.h>
#include <string.h>

// 이어지는 바이트(10xxxxxx)가 아닌 바이트만 세면 글자 수가 된다
size_t utf8_count(const char *s) {
    size_t n = 0;
    for (; *s != '\0'; s++) {
        if (((unsigned char)*s & 0xC0) != 0x80) {
            n++;
        }
    }
    return n;
}

// s가 가리키는 한 글자를 해석해 코드 포인트를 cp에 넣고, 쓴 바이트 수를 돌려준다
int utf8_decode(const unsigned char *s, unsigned *cp) {
    if (s[0] < 0x80) {                      // 0xxxxxxx: 1바이트
        *cp = s[0];
        return 1;
    }
    if ((s[0] & 0xE0) == 0xC0) {            // 110xxxxx 10xxxxxx
        *cp = ((s[0] & 0x1Fu) << 6) | (s[1] & 0x3Fu);
        return 2;
    }
    if ((s[0] & 0xF0) == 0xE0) {            // 1110xxxx 10xxxxxx 10xxxxxx
        *cp = ((s[0] & 0x0Fu) << 12) | ((s[1] & 0x3Fu) << 6) | (s[2] & 0x3Fu);
        return 3;
    }
    *cp = ((s[0] & 0x07u) << 18) | ((s[1] & 0x3Fu) << 12) | ((s[2] & 0x3Fu) << 6) | (s[3] & 0x3Fu);
    return 4;                               // 11110xxx + 이어지는 바이트 셋
}

int main(void) {
    const char *text = "A\xC3\xA9한\xF0\x9F\x98\x80";   // A é 한 😀
    printf("strlen %zu, 글자 %zu\n", strlen(text), utf8_count(text));

    const unsigned char *p = (const unsigned char *)text;
    while (*p != '\0') {
        unsigned cp;
        int len = utf8_decode(p, &cp);
        printf("U+%04X %d바이트:", cp, len);
        for (int i = 0; i < len; i++) {
            printf(" %02x", p[i]);
        }
        printf("\n");
        p += len;
    }
    return 0;
}
```

실행 결과:

```text
strlen 10, 글자 4
U+0041 1바이트: 41
U+00E9 2바이트: c3 a9
U+D55C 3바이트: ed 95 9c
U+1F600 4바이트: f0 9f 98 80
```

### 코드 한 부분씩 읽기

| 코드                                                                | 설명                                                                                                                 |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `"A\xC3\xA9한\xF0\x9F\x98\x80"`                                     | é와 😀를 바이트로 직접 적었습니다. 소스 파일이 UTF-8이면 `한`은 그대로 세 바이트가 됩니다.                           |
| `((unsigned char)*s & 0xC0) != 0x80`                                | 앞 두 비트가 `10`이 아닌 바이트, 즉 **글자가 시작하는** 바이트만 셉니다. 한 줄로 글자 수를 구하는 유명한 방법입니다. |
| `(s[0] & 0xE0) == 0xC0`                                             | 첫 바이트가 `110xxxxx`면 2바이트 글자입니다. `0xE0`(1110 0000)로 앞 세 비트만 남겨 비교합니다.                       |
| `((s[0] & 0x0Fu) << 12) \| ((s[1] & 0x3Fu) << 6) \| (s[2] & 0x3Fu)` | 3바이트 글자에서 `x` 자리 비트만 모아 이어 붙입니다. 첫 바이트의 4비트, 나머지의 6비트씩입니다.                      |
| `int utf8_decode(const unsigned char *s, unsigned *cp)`             | 코드 포인트는 포인터로 돌려주고, 반환값으로 바이트 수를 알려 줍니다(Day 43에서 자세히).                              |
| `p += len;`                                                         | 글자 길이만큼 건너뛰어 다음 글자의 시작으로 갑니다.                                                                  |

## 7. Rust로 구현하기

```rust
// 파일: unicode_basics.rs
fn main() {
    for ch in ['A', 'é', '한', '😀'] {
        let mut buf = [0u8; 4];
        let bytes = ch.encode_utf8(&mut buf).as_bytes();   // char 하나를 UTF-8로
        let hex: Vec<String> = bytes.iter().map(|b| format!("{b:02x}")).collect();
        println!("{ch} U+{:04X} {}바이트 {}", ch as u32, ch.len_utf8(), hex.join(" "));
    }
    println!("from_u32(0xD55C) = {:?}", char::from_u32(0xD55C));

    let text = "커피 한 잔 ☕";
    println!("글자 {} 바이트 {}", text.chars().count(), text.len());
    let data: Vec<u8> = text.as_bytes().to_vec();          // &str → 바이트
    println!("되돌리기: {}", String::from_utf8(data.clone()).unwrap());

    let broken = &data[..4];
    match std::str::from_utf8(broken) {
        Ok(s) => println!("정상: {s}"),
        Err(e) => println!("Utf8Error: {} 바이트까지만 올바름", e.valid_up_to()),
    }
    println!("lossy: {}", String::from_utf8_lossy(broken));

    for (i, ch) in "a한b".char_indices() {  // 글자와 그 글자가 시작하는 바이트 위치
        print!("({i}, {ch}) ");
    }
    println!();

    let words: Vec<&str> = "  사과, 배 ,감  ".trim().split(',').map(|w| w.trim()).collect();
    println!("split: {words:?} join: {}", words.join("/"));
    println!("find: {:?} count: {} replacen: {}", "바나나".find("나"), "바나나".matches("나").count(), "바나나".replacen("나", "NA", 1));
    println!("upper: {}", "straße".to_uppercase());
    println!("is_numeric: {} {}", '3'.is_ascii_digit(), '\u{663}'.is_numeric());
}
```

실행 결과:

```text
A U+0041 1바이트 41
é U+00E9 2바이트 c3 a9
한 U+D55C 3바이트 ed 95 9c
😀 U+1F600 4바이트 f0 9f 98 80
from_u32(0xD55C) = Some('한')
글자 8 바이트 18
되돌리기: 커피 한 잔 ☕
Utf8Error: 3 바이트까지만 올바름
lossy: 커�
(0, a) (1, 한) (4, b)
split: ["사과", "배", "감"] join: 사과/배/감
find: Some(3) count: 2 replacen: 바NA나
upper: STRASSE
is_numeric: true true
```

### 코드 한 부분씩 읽기

| 코드                                           | 설명                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `['A', 'é', '한', '😀']`                       | Rust의 `char`는 코드 포인트 하나(4바이트)입니다. 작은따옴표로 씁니다.                                                           |
| `ch.encode_utf8(&mut buf)`                     | `char` 하나를 UTF-8 바이트로 바꿔 `buf`에 씁니다. `ch.len_utf8()`은 그 바이트 수입니다.                                         |
| `char::from_u32(0xD55C)`                       | 번호가 올바른 코드 포인트가 아닐 수 있어 `Option<char>`를 돌려줍니다(예: 0xD800은 `None`). Python의 `chr`는 이 경우 오류입니다. |
| `String::from_utf8(data)`                      | 바이트가 올바른 UTF-8인지 검사한 뒤 `String`으로 바꿉니다. 결과는 `Result`입니다.                                               |
| `std::str::from_utf8(broken)`, `valid_up_to()` | 잘린 바이트는 `Err`이고, 몇 바이트까지 올바른지 알려 줍니다. Python의 `UnicodeDecodeError`에 해당합니다.                        |
| `String::from_utf8_lossy(broken)`              | Python의 `errors="replace"`와 같습니다. 잘못된 부분을 �로 바꿉니다.                                                             |
| `"a한b".char_indices()`                        | 글자와 그 글자가 **시작하는 바이트 위치**를 함께 줍니다. `한`이 3바이트라 `b`는 4번입니다.                                      |
| `"바나나".find("나")`                          | 바이트 위치 3을 돌려줍니다. 이 값은 `&s[3..]`처럼 바로 슬라이스에 쓸 수 있습니다. Python의 1과 다릅니다.                        |

## 8. 실행 추적

C의 `utf8_decode`가 `한`(ED 95 9C)을 해석하는 과정입니다.

| 단계                | 바이트(2진수) | 연산                   | 결과(2진수)                      |
| ------------------- | ------------- | ---------------------- | -------------------------------- |
| 첫 바이트 모양 확인 | `1110 1101`   | `& 0xF0` = `1110 0000` | 3바이트 글자                     |
| 첫 바이트의 x       | `1110 1101`   | `& 0x0F`, `<< 12`      | `1101 0000 0000 0000`            |
| 둘째 바이트의 x     | `1001 0101`   | `& 0x3F`, `<< 6`       | `0000 0101 0100 0000`            |
| 셋째 바이트의 x     | `1001 1100`   | `& 0x3F`               | `0000 0000 0001 1100`            |
| 셋을 `\|`로 합침    |               |                        | `1101 0101 0101 1100` = `0xD55C` |

Python의 `"한".encode()`와 `decode()`, Rust의 `chars()`가 속에서 하는 일이 바로 이것입니다.

## 9. 다른 예제로 다시 이해하기

**받침에 맞는 조사 고르기.** 단어의 마지막 글자에 받침이 있으면 "은, 이, 을, 으로", 없으면 "는, 가, 를, 로"를 붙입니다. "으로/로"는 예외가 하나 있어서, 받침이 **ㄹ**이면 "로"를 씁니다(서울로, 연필로).

```python
# 파일: josa.py
CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"
JONG = [""] + list("ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ")


def split_syllable(ch):
    code = ord(ch) - 0xAC00                 # '가'부터 몇 번째 글자인가
    if not 0 <= code < 11172:               # 19 × 21 × 28 = 11172개
        return None
    return CHO[code // 588], JUNG[code // 28 % 21], JONG[code % 28]


def last_batchim(word):
    parts = split_syllable(word[-1])
    return None if parts is None else parts[2]


def josa(word, with_batchim, without_batchim):
    return word + (with_batchim if last_batchim(word) else without_batchim)


def josa_ro(word):                          # ㄹ 받침은 '으로'가 아니라 '로'
    b = last_batchim(word)
    return word + ("으로" if b and b != "ㄹ" else "로")


print("한 →", split_syllable("한"), " 가 →", split_syllable("가"), " A →", split_syllable("A"))
for word in ["사과", "귤", "책", "바나나", "서울"]:
    print(josa(word, "은", "는"), josa(word, "이", "가"), josa(word, "을", "를"), josa_ro(word))
```

실행 결과:

```text
한 → ('ㅎ', 'ㅏ', 'ㄴ')  가 → ('ㄱ', 'ㅏ', '')  A → None
사과는 사과가 사과를 사과로
귤은 귤이 귤을 귤로
책은 책이 책을 책으로
바나나는 바나나가 바나나를 바나나로
서울은 서울이 서울을 서울로
```

| 코드                                          | 설명                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `CHO`, `JUNG`, `JONG`                         | 초성 19개, 중성 21개, 종성 28개(받침 없음 포함)를 번호 순서대로 적은 표입니다.                |
| `code = ord(ch) - 0xAC00`                     | '가'로부터의 거리입니다. 범위 밖(영문, 숫자, 자모 낱자)이면 `None`을 돌려줍니다.              |
| `code // 588`, `code // 28 % 21`, `code % 28` | 4.5절의 공식 그대로입니다. '한'은 (18 × 21 + 0) × 28 + 4 = 10,588번째라 ㅎ, ㅏ, ㄴ입니다.     |
| `word[-1]`                                    | Python은 글자 단위 인덱스라 마지막 **글자**를 바로 꺼냅니다.                                  |
| `"으로" if b and b != "ㄹ" else "로"`         | 받침이 있고 ㄹ이 아닐 때만 "으로"입니다. `b`가 `None`(한글이 아님)이거나 `""`이면 "로"입니다. |

Rust에서는 마지막 글자를 꺼낼 때 **바이트가 아니라 글자**로 꺼내야 합니다.

```rust
// 파일: josa.rs
const JONG: [&str; 28] = [
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
    "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

fn last_batchim(word: &str) -> Option<&'static str> {
    let last = word.chars().last()?;        // 마지막 '글자'(바이트가 아님)
    let code = (last as u32).checked_sub(0xAC00)?;
    if code >= 11172 {
        return None;
    }
    Some(JONG[(code % 28) as usize])
}

fn josa(word: &str, with_batchim: &str, without_batchim: &str) -> String {
    let has = matches!(last_batchim(word), Some(b) if !b.is_empty());
    format!("{word}{}", if has { with_batchim } else { without_batchim })
}

fn josa_ro(word: &str) -> String {
    let ro = match last_batchim(word) {
        Some("") | Some("ㄹ") | None => "로",
        Some(_) => "으로",
    };
    format!("{word}{ro}")
}

fn main() {
    for word in ["사과", "귤", "책", "바나나", "서울"] {
        println!("{} {} {} {}", josa(word, "은", "는"), josa(word, "이", "가"), josa(word, "을", "를"), josa_ro(word));
    }
    println!("{:?} {:?}", last_batchim("한"), last_batchim("ABC"));
}
```

실행 결과:

```text
사과는 사과가 사과를 사과로
귤은 귤이 귤을 귤로
책은 책이 책을 책으로
바나나는 바나나가 바나나를 바나나로
서울은 서울이 서울을 서울로
Some("ㄴ") None
```

- `word.chars().last()?`는 마지막 글자를 `Option<char>`로 꺼냅니다. 빈 문자열이면 `?`가 곧바로 `None`을 돌려줍니다. `word.as_bytes().last()`는 한글의 마지막 **바이트**라 틀립니다.
- `(last as u32).checked_sub(0xAC00)?`는 0xAC00보다 작은 글자(영문 등)에서 음수가 되는 대신 `None`을 돌려줍니다. Day 36의 `saturating_sub`와 비슷한 안전한 뺄셈입니다.
- `matches!(last_batchim(word), Some(b) if !b.is_empty())`는 "값이 `Some`이고 안의 문자열이 비어 있지 않은가"를 한 번에 검사합니다.
- `match`에서 `Some("") | Some("ㄹ") | None => "로"`처럼 여러 모양을 `|`로 묶었습니다.

이 과정의 레슨 출력에서 `{n}은`처럼 값 뒤에 조사를 바로 붙이지 않고 `:`를 쓴 이유가 여기에 있습니다. 값에 따라 조사가 달라져야 하기 때문입니다. 숫자는 읽는 법(일, 이, 삼...)을 따져야 해서 더 복잡합니다.

## 10. 인코딩 도구 모음

| 하고 싶은 일                  | Python                          | Rust                                        | C                   |
| ----------------------------- | ------------------------------- | ------------------------------------------- | ------------------- |
| 글자 → 번호                   | `ord(ch)`                       | `ch as u32`                                 | UTF-8 직접 해석     |
| 번호 → 글자                   | `chr(n)`(잘못되면 `ValueError`) | `char::from_u32(n)`(`Option`)               | UTF-8로 직접 인코딩 |
| 글자열 → 바이트               | `s.encode("utf-8")`             | `s.as_bytes()`(이미 UTF-8)                  | 이미 바이트         |
| 바이트 → 글자열(검사)         | `b.decode("utf-8")`             | `String::from_utf8(v)`, `str::from_utf8(b)` | 직접 검사           |
| 바이트 → 글자열(깨진 곳 표시) | `b.decode(errors="replace")`    | `String::from_utf8_lossy(b)`                | 직접                |
| 글자 수                       | `len(s)`                        | `s.chars().count()`                         | 시작 바이트 세기    |
| 바이트 수                     | `len(s.encode())`               | `s.len()`                                   | `strlen(s)`         |
| 위치의 단위                   | 코드 포인트                     | 바이트                                      | 바이트              |

## 11. 세 언어 비교

| 관점                    | Python              | Rust                                           | C                          |
| ----------------------- | ------------------- | ---------------------------------------------- | -------------------------- |
| 문자열이 담는 것        | 코드 포인트         | 항상 올바른 UTF-8 바이트                       | 아무 바이트(인코딩은 약속) |
| 한 글자 자료형          | 길이 1인 `str`      | `char`(4바이트 코드 포인트)                    | 없음(`char`는 1바이트)     |
| 잘못된 UTF-8이 들어오면 | `decode`에서 오류   | `from_utf8`에서 `Err`, `&str`로는 만들 수 없음 | 알아채지 못함              |
| 인덱스·자르기 단위      | 코드 포인트         | 바이트(글자 경계가 아니면 패닉)                | 바이트                     |
| 정규화                  | `unicodedata`(표준) | 외부 크레이트(`unicode-normalization`)         | 외부 라이브러리            |

## 12. 자주 하는 실수

### 실수 1: str과 bytes를 섞는다 (Python)

```python
# 파일: mix_bytes.py (실행 오류: TypeError)
header = b"Hello, "
name = "모모"
print(name + header)
```

실습의 디버그 문제입니다. 한쪽으로 바꾼 뒤 연산하세요. 프로그램 안에서는 `str`로 다루는 것이 원칙입니다.

### 실수 2: 다른 인코딩으로 decode한다 (Python)

UTF-8로 저장한 `"한"`을 `decode("latin-1")`로 읽으면 오류 없이 `í`와 보이지 않는 글자 두 개가 나옵니다. latin-1은 모든 바이트를 글자 하나로 바꾸기 때문에 **오류가 나지 않는 것이 더 위험합니다.** 파일을 열 때 `open(path, encoding="utf-8")`처럼 인코딩을 항상 적으세요(Day 47).

### 실수 3: 바이트 수 제한에 글자 수로 자른다

"10바이트까지"인 칸에 `s[:10]`을 넣으면 한글은 30바이트가 됩니다. 실습의 변형 문제처럼 바이트로 자르고 `errors="ignore"`로 끝 조각을 버리세요.

### 실수 4: 정규화하지 않고 비교한다

외부에서 온 문자열(파일 이름, 복사해 붙인 글)은 NFC와 NFD가 섞여 있을 수 있습니다. 비교·검색·사전의 열쇠로 쓰기 전에 한 형식으로 정규화하세요.

### 실수 5: Rust에서 바이트로 마지막 글자를 꺼낸다

`word.as_bytes()[word.len() - 1]`은 한글의 마지막 **바이트**(예: 0x9C)라 글자가 아닙니다. 글자가 필요하면 `word.chars().last()`, 그 위치가 필요하면 `word.char_indices().last()`를 쓰세요.

## 13. Q&A

**Q. 왜 모든 글자를 4바이트로 저장하지 않나요?**

A. 그렇게 하는 방식(UTF-32)도 있지만, 영문 위주의 글이 네 배로 커집니다. UTF-8은 ASCII(영문, 숫자, 기호)를 1바이트 그대로 두어 옛 프로그램과 호환되고, 필요한 글자만 길게 씁니다. 그래서 웹과 파일의 표준이 되었습니다.

**Q. Python은 속에서 문자열을 어떻게 저장하나요?**

A. CPython은 문자열마다 가장 큰 글자에 맞춰 1, 2, 4바이트 중 하나로 저장합니다(PEP 393). 그래서 `s[i]`가 항상 빠릅니다. UTF-8은 파일이나 네트워크로 내보낼 때 만드는 형식입니다.

**Q. EUC-KR(CP949)은 무엇인가요?**

A. UTF-8 이전에 한국에서 널리 쓰던 인코딩으로, 한글 한 글자를 2바이트로 저장합니다. 오래된 한국어 파일이나 일부 윈도우 프로그램에서 아직 볼 수 있습니다. `data.decode("cp949")`로 읽고 `encode("utf-8")`로 바꿔 저장하면 됩니다.

**Q. 조사 고르기는 숫자나 영어에도 되나요?**

A. 오늘 만든 함수는 한글 음절만 판단하고, 그 밖에는 받침이 없다고 봅니다. 숫자 `3`은 "삼"이라 받침이 있고, 영어 `apple`은 "애플"이라 받침이 없습니다. 읽는 법까지 따지려면 규칙표가 따로 필요해서, 실무에서는 "사과(은)는"처럼 둘 다 쓰거나 문장 구조를 바꿔 조사를 피하기도 합니다.

## 14. 핵심 요약

- **코드 포인트**는 글자의 번호(U+D55C), **UTF-8**은 그 번호를 1~4바이트로 저장하는 규칙입니다. 한글 음절은 3바이트, 이모지는 대개 4바이트입니다.
- Python `str`은 코드 포인트의 열, `bytes`는 바이트의 열입니다. `encode`·`decode`로 오가며, 둘을 섞어 연산할 수 없습니다.
- 잘린 바이트를 decode하면 `UnicodeDecodeError`입니다. `errors="replace"`는 �로, `"ignore"`는 버립니다.
- 같은 글자도 NFC·NFD로 다르게 저장될 수 있으니 비교 전에 정규화하고, `len`이 눈에 보이는 글자 수와 다를 수 있음(이모지 조합)을 기억하세요.
- C는 UTF-8을 직접 해석해야 하고, 이어지는 바이트(`10xxxxxx`)를 건너뛰어 글자를 셉니다.
- Rust `char`는 코드 포인트이고, 문자열의 `len`·위치·범위는 **바이트** 단위입니다. `chars`, `char_indices`, `from_utf8`로 안전하게 다룹니다.
- 한글 음절은 `(코드 - 0xAC00) % 28`로 받침을 알 수 있습니다.

## 15. 도전 문제

1. **(Python)** `def initials(word)`로 단어의 초성만 모은 문자열을 돌려주세요. `"대한민국"` → `"ㄷㅎㅁㄱ"`. 한글이 아닌 글자는 그대로 둡니다.
2. **(Python)** 조사 함수에 "과/와"를 추가하고, 문장 틀 `"{0} 먹었다"`에 여러 단어를 넣어 "사과를 먹었다", "귤을 먹었다"처럼 출력해 보세요.
3. **(Rust)** `fn truncate_bytes(s: &str, max: usize) -> &str`로 `max`바이트를 넘지 않는 가장 긴 앞부분을 빌려 돌려주세요. `s.is_char_boundary(i)`를 쓰면 됩니다. `("가나다라마", 10)`이면 `"가나다"`입니다.
4. **(C)** `utf8_decode`에 잘못된 입력 검사(이어지는 바이트가 `10xxxxxx`가 아니거나 문자열이 중간에 끝남)를 추가해, 잘못된 곳에서 `-1`을 돌려주게 하세요. `"\xED\x95"`처럼 잘린 입력으로 확인합니다.
