"""Render the authored day blueprints as Astro Content Collection lessons.

Only days absent from the original three representative lessons are generated.
The blueprints contain each lesson's actual example, reasoning and transfer notes;
the renderer supplies the shared interaction and review structure.
"""

from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path
import re

import yaml

from curriculum_blueprints import DAYS, Day
from teaching_notes import NOTES


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src/content/days"
PHASE_ENDS = (12, 25, 28, 48, 56, 70, 82, 92)
REVIEWS = {7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91}
SAMPLES = {1, 29, 57}
LANGUAGES = ("c", "python", "rust")


class NoAliasDumper(yaml.SafeDumper):
    def ignore_aliases(self, data):
        return True


def phase(day: int) -> str:
    return f"phase-{next(i for i, end in enumerate(PHASE_ENDS, 1) if day <= end):02d}"


def entity_id(day: int) -> str:
    if day in SAMPLES:
        return {1: "day-01-variables-types", 29: "day-29-references-borrowing", 57: "day-57-stack"}[day]
    return f"day-{day:02d}-{DAYS[day].slug}"


def fill_source(day: Day) -> str:
    if day.focus not in day.code:
        raise ValueError(f"Day {day.number}: focus token is absent from example")
    return day.code.replace(day.focus, "_____", 1)


def exercise_rows(day: Day, id_: str) -> list[dict]:
    base = f"ex-{id_}"
    common = [day.pitfall, "실행 전에 출력과 중간 상태를 손으로 확인하지 않음"]
    modified, change = day.modified
    return [
        dict(id=f"{base}-predict", title="결과를 먼저 예측하기", kind="predict",
             objective="코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.",
             prompt=f"아래 코드를 실행하면 어떤 문장이 출력될까요? {day.trace.split('→')[0].strip()}에서 시작해 계산하세요.",
             starter=day.code, answer=day.output, hint=day.model,
             explanation=f"{day.trace.replace('→', ' → ')}. 따라서 출력은 {day.output!r}입니다.",
             commonMistakes=common, language=day.anchor, verification="none"),
        dict(id=f"{base}-fill", title="핵심 표현 빈칸 채우기", kind="fill",
             objective=f"{day.title}의 핵심 표현을 스스로 적는다.",
             prompt=f"빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: {day.focus}",
             starter=fill_source(day), answer=day.code, hint=day.walk.split("|")[0],
             explanation=f"빈칸에는 {day.focus!r}이 들어갑니다. {day.walk.replace('|', ' ')}",
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-guided", title="값을 바꿔 다시 추적하기", kind="modify",
             objective="입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.",
             prompt=f"예시를 직접 타이핑한 뒤 {change} 바꿔 보세요. 출력도 먼저 예측하세요.",
             starter=day.code, answer=modified, hint=f"{change} 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요.",
             explanation=f"예시 답안에서는 {change} 바꿨습니다. 원본 출력은 {day.output!r}입니다. 바뀐 코드의 결과는 실행해 확인하세요.",
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-debug", title="오류 설명하고 고치기", kind="debug",
             objective="문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.",
             prompt=f"아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 {day.pitfall} 상황을 확인하세요.",
             starter=day.buggy, answer=day.code, hint=day.model,
             explanation=f"원래 예시와 비교하여 잘못된 줄을 찾으세요. {day.walk.replace('|', ' ')}",
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-independent", title="예시를 가리고 다시 구현하기", kind="independent",
             objective="설명 없이 같은 개념을 작은 프로그램으로 재현한다.",
             prompt=f"예시를 가리고 '{day.title}' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.",
             starter=f"// {day.title}: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)" if day.anchor != "python" else f"# {day.title}: 직접 구현",
             answer=day.code, hint=day.model,
             explanation=f"한 가지 예시 해법은 위 코드입니다. 핵심은 {day.walk.replace('|', ' ')} 다른 코드도 결과와 근거가 맞으면 가능합니다.",
             commonMistakes=common, language=day.anchor, verification="run"),
    ]


def quizzes(day: Day, id_: str) -> list[dict]:
    items = [
        dict(id=f"quiz-{id_}-output", question=f"예시 코드의 출력은 무엇인가요?",
             choices=[day.output, "실행 전에 반드시 오류가 난다", "아무것도 출력하지 않는다"], answerIndex=0,
             explanation=f"{day.trace.replace('→', ' → ')} 순서로 실행되어 {day.output!r}을 출력합니다."),
        dict(id=f"quiz-{id_}-model", question=f"{day.title}을 이해하는 데 맞는 설명은?",
             choices=[day.model, day.pitfall + "(이것이 정상적인 사용법이다)", "코드가 짧다면 상태 추적은 필요 없다"],
             answerIndex=0, explanation=day.model),
        dict(id=f"quiz-{id_}-pitfall", question="다음 중 실습에서 먼저 확인할 오류는?",
             choices=[day.pitfall, "실제 출력과 예측한 출력이 일치함", "변경된 입력을 다시 추적하여 결과를 확인함"],
             answerIndex=0, explanation=f"{day.pitfall}. 입력과 중간 상태를 차례로 확인하세요."),
        dict(id=f"quiz-{id_}-transfer", question="세 언어로 옮길 때 무엇을 보존해야 하나요?",
             choices=[f"{day.transfer}라는 동작과 경계 조건", "세 언어의 표면 문법을 한 글자도 바꾸지 않는다", "타입과 오류 처리를 모두 생략한다"],
             answerIndex=0, explanation=f"문법은 달라도 {day.transfer}라는 목적과 입력·출력은 유지합니다."),
    ]
    for number, item in enumerate(items):
        correct, *others = item["choices"]
        index = (day.number + number) % 3
        item["choices"] = [*others[:index], correct, *others[index:]]
        item["answerIndex"] = index
    return items


def markdown(day: Day) -> str:
    id_ = entity_id(day.number)
    transfers = [lang for lang in LANGUAGES if lang != day.anchor]
    review = day.number in REVIEWS
    previous = entity_id(day.number - 1) if day.number > 1 else None
    data = dict(schemaVersion=1, contentVersion="2026.10-c", id=id_, courseId="crp-92",
                phaseId=phase(day.number), dayNumber=day.number,
                date=(date(2026, 10, 1) + timedelta(days=day.number - 1)).isoformat(),
                title=day.title,
                summary=f"{day.why} { {'c':'C', 'python':'Python', 'rust':'Rust'}[day.anchor]} 예시를 추적하고 다른 두 언어로 옮겨 봅니다.",
                anchorLanguage=day.anchor, transferLanguages=transfers,
                difficulty="advanced" if day.number >= 71 else "intermediate" if day.number >= 29 else "beginner",
                estimatedMinutes=50 if review else 90,
                prerequisites=[previous] if previous else [],
                learningObjectives=[f"'{day.title}' 개념이 필요한 상황을 예로 든다.",
                                    f"{ {'c':'C', 'python':'Python', 'rust':'Rust'}[day.anchor]} 코드의 핵심 줄과 실행 결과를 추적한다.",
                                    f"다음 오류를 발견하고 고친다: {day.pitfall}.",
                                    "같은 개념을 나머지 두 언어에 적용한다."],
                concepts=[day.slug.replace("-", " "), "execution trace", "language transfer"],
                runnerMode="python" if day.anchor == "python" else "none",
                reviewOffsets=[1, 3, 7, 14, 30], sample=False,
                exercises=exercise_rows(day, id_), quiz=quizzes(day, id_))
    if day.anchor == "python":
        data["playgroundSource"] = day.code
    head = yaml.dump(data, Dumper=NoAliasDumper, allow_unicode=True,
                     sort_keys=False, width=110)
    steps = "\n".join(f"{i}. {line.strip()}" for i, line in enumerate(day.walk.split("|"), 1))
    comparison = "\n".join(f"| {name} | {day.forms.get(lang, '이 언어의 타입과 오류 처리 규칙에 맞게 같은 동작을 구현한다.')} |"
                           for name, lang in [("C17", "c"), ("Python", "python"), ("Rust", "rust")])
    trace_steps = [s.strip() for s in day.trace.split("→")]
    trace_rows = "\n".join(f"| {i} | {s} |" for i, s in enumerate(trace_steps, 1))
    review_note = ("이번 Day는 새 문법을 많이 추가하는 대신 앞선 개념을 떠올리고 작은 변경 실험으로 오개념을 확인합니다. "
                   "코드를 가린 채 먼저 답하고, 모른 부분만 선행 Day로 돌아가 보세요.") if review else (
                   "처음 읽을 때는 결과를 가리고 손으로 예상하세요. 예시를 직접 타이핑한 뒤 한 줄씩 바꾸며 상태를 확인하세요.")
    run_note = ("아래 Python 실행 영역에 같은 코드가 미리 들어 있습니다. 먼저 예측하고 실행해 비교하세요."
                if day.anchor == "python" else
                "이 수업의 C/Rust 코드는 브라우저에서 임의 컴파일되지 않습니다. C17은 `gcc -std=c17 -Wall -Wextra`로, "
                "Rust는 `rustc --edition=2024` 또는 Cargo로 로컬에서 실행하세요. 하단의 실습 칸은 예시 답안 비교입니다.")
    _, change = day.modified
    body = f"---\n{head}---\n\n" + f"""## 오늘 배울 이유

{day.why} {review_note}

## 시작 전에 확인할 것

{f'바로 앞선 [Day {day.number - 1:02d}](/learn/{previous})의 핵심을 한 문장으로 설명해 보세요.' if previous else '값과 이름의 차이를 먼저 떠올려 보세요.'} 모르면 위의 선행 Day 링크에서 다시 확인할 수 있습니다.

## 머릿속 그림

{day.model} 다음 흐름을 눈으로 확인하세요.

```text
{day.trace.replace('→', ' → ')}
```

현재 상태와 다음 동작을 분리해서 읽으면 결과를 외우지 않아도 설명할 수 있습니다.

## 천천히 풀어보기

{NOTES[day.number]}

## 문법을 예제로 보기

아래는 { {'c':'C', 'python':'Python', 'rust':'Rust'}[day.anchor]} 언어로 만든 독립 예제입니다. 코드를 보기 전에 오늘의 문제와 예상 출력을 먼저 떠올려 보세요.

```{day.anchor}
{day.code}
```

예상 출력:

```text
{day.output}
```

{run_note}

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `{day.focus}`입니다. 전체 코드에서 이 표현을 찾아 표시하세요. 선언과 조건, 출력이 연결되는 과정을 순서대로 설명합니다.

{steps}

각 줄에서 **읽는 값**, **바뀌는 상태**, **출력되는 값**을 따로 표시하며 다시 읽어 보세요. 결과만 암기하면 입력이 조금만 바뀌어도 풀 수 없습니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | --- |
{trace_rows}

마지막 상태에서 화면에 표시되는 결과는 `{day.output}`입니다. 직접 타이핑할 때는 위의 순서와 실제 출력을 비교하세요.

## 결과 예측과 작은 변경

1. 코드를 가리고 결과를 먼저 적으세요.
2. 그 결과를 만든 핵심 줄을 찾아 밑줄을 그으세요.
3. {change} 바꾼 뒤 어느 단계부터 결과가 달라질지 예측하세요.
4. 실행할 수 있는 환경에서 확인하고 틀린 예측의 이유를 한 문장으로 적으세요.

## 자주 틀리는 지점

**확인할 실수: {day.pitfall}.** {day.model} 결과가 예상과 다르면 입력 → 중간 상태 → 출력 중 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

같은 문제를 해결하더라도 선언, 타입, 메모리 관리, 오류 처리는 다릅니다. 핵심 동작은 **{day.transfer}**입니다. 언어를 옮겨도 이 동작을 유지하세요.

| 언어 | 옮길 때 확인할 표현과 규칙 |
| --- | --- |
{comparison}

Anchor 코드의 각 값을 다른 두 언어에서 어떤 타입으로 저장할지 적어 보고, 실패하거나 비어 있는 입력을 어떻게 처리할지도 생각하세요. 문법을 단어 단위로 번역하기보다 같은 입력에서 같은 결과가 나오는지 확인해야 합니다.

## 실습 순서

아래에서 **예측 → 빈칸 → 변경 → 오류 수정 → 독립 구현** 순으로 진행합니다. 답 확인은 예시 문자열 비교이므로 다른 풀이를 자동으로 오답 판정하지 않습니다. 마지막에는 예시를 가리고 이번 개념을 다시 구현하세요.

## 스스로 설명하기

- 왜 이 개념이 필요한가? {day.why}
- 예시에서 가장 먼저 확정되는 값이나 상태는 무엇인가?
- 어떤 실수를 점검해야 하나? {day.pitfall}
- 다른 두 언어에서는 같은 동작을 어떤 자료형과 오류 처리로 나타내는가?

## 핵심 요약과 복습

{day.model} 예시의 출력은 `{day.output}`입니다. 오류를 찾을 때는 **{day.pitfall}** 여부를 확인하세요. 완료 버튼을 누르면 +1·+3·+7·+14·+30일 복습이 이 기기에 등록됩니다.
"""
    if day.number >= 83:
        body += f"""
## Study Log Analyzer 실제 프로젝트

이 Day의 짧은 예제로 {day.title}의 한 부분을 확인한 뒤, [세 언어의 완성 프로젝트 소스와 공통 fixture](https://github.com/cys123431-ship-it/CRUSTPYTHONpractice/tree/main/examples/study-log-analyzer)를 내려받아 같은 CSV로 실행하세요. README의 실행 명령과 필터 옵션을 따라 세 결과를 비교합니다. 이 페이지의 실습 답안 비교는 전체 CLI 프로젝트를 실행하지 않습니다.
"""
    return body


def main() -> None:
    assert set(DAYS) == set(range(1, 93)) - SAMPLES, "all 89 absent days need a blueprint"
    assert set(NOTES) == set(DAYS), "every generated day needs a unique teaching note"
    assert all(len(note) >= 200 for note in NOTES.values()), "teaching note is too brief"
    for day in DAYS.values():
        assert day.number not in SAMPLES
        filename = CONTENT / f"{entity_id(day.number)}.md"
        filename.write_text(markdown(day), encoding="utf-8")
    print(f"Generated {len(DAYS)} authored lessons; original sample days preserved.")


if __name__ == "__main__":
    main()
