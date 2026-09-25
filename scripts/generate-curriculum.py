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
from second_examples import MORE
from modified_outputs import MODIFIED_OUTPUT, SAME_REASON


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src/content/days"
PHASE_ENDS = (12, 25, 28, 48, 56, 70, 82, 92)
REVIEWS = {7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91}
SAMPLES = {1, 29, 57}
LANGUAGES = ("c", "python", "rust")


LANG_LABEL = {"c": "C", "python": "Python", "rust": "Rust"}
SAMPLE_TITLES = {1: "변수와 자료형 — 값에 이름을 붙이고 사용하는 법", 29: "포인터 · 참조 · 빌림 — 같은 값을 바라보는 세 방식", 57: "스택 — 마지막에 넣은 것을 먼저 꺼내는 자료구조"}


def prev_title(day):
    no = day.number - 1
    if no in DAYS:
        return DAYS[no].title
    return SAMPLE_TITLES.get(no, "이전 학습")


COMPLEXITY = {
    58: "실행 취소 기록을 리스트 끝에 쌓으면 추가와 되돌리기가 평균 O(1)입니다. 중간에 끼워 넣지 않고 끝에서만 다루기 때문입니다. 기록이 n개면 공간은 O(n)입니다. 빈 기록에서 되돌리기를 부르면 항목이 없으므로 먼저 비었는지 확인해야 합니다.",
    59: "양쪽 끝에서 넣고 빼는 덱은 append와 popleft가 각각 O(1)입니다. 접수 순서 A→B→C에서 첫 popleft는 A를 돌려줍니다. 리스트의 pop(0)은 앞 원소를 모두 옮겨 O(n)이므로 큐에는 덱을 씁니다. n건을 보관하면 공간은 O(n)입니다.",
    60: "원형 큐는 머리 위치를 (head+1)%용량으로 옮겨 빈칸 없이 돌아오므로 삽입과 제거가 O(1)입니다. 숫자 0으로 돌아왔다고 비었다는 뜻이 아닙니다. 항목 수 count로 가득 참과 빔을 구별합니다. 용량이 k이면 공간은 O(k)입니다.",
    61: "연결 리스트에서 A의 next로 B를 찾아 값을 읽는 이동은 한 칸씩 따라가므로 위치 찾기까지 O(n)입니다. 맨 앞에 끼우는 삽입 자체는 O(1)입니다. B의 next가 NULL이면 거기서 멈추고 더 읽으면 안 됩니다. n개 노드의 공간은 O(n)입니다.",
    62: "이웃을 아는 상태에서 가운데 C를 끼우면 네 포인터만 바꿔 O(1)입니다. A→C→B로 갔다가 B→C→A로 돌아오면 일치합니다. 한쪽만 고치면 되돌아갈 때 어긋납니다. 처음 위치를 찾는 데는 O(n)이 들 수 있습니다.",
    63: "같은 1,2,3도 스택은 3부터, 큐는 1부터 꺼냅니다. 어느 것이 좋은지는 문제의 순서가 정합니다. 최근 작업 취소는 스택, 접수 순서 처리는 큐가 맞습니다. 끝에서 다루는 스택과 큐의 연산은 O(1), 탐색은 O(n)입니다.",
    64: "노드 수를 셀 때는 각 노드를 한 번씩 방문해 O(n)입니다. 자식 결과를 부모로 돌려 합치므로 None 자식은 0으로 셉니다. 재귀 깊이는 트리 높이만큼 쌓여 공간 O(높이)입니다. None을 노드로 더하면 답이 부풀어 오릅니다.",
    65: "이진 탐색 트리에서 키를 찾으면 한 번 비교할 때마다 한쪽 자식을 버려 평균 O(높이)입니다. 한쪽으로만 길어지면 O(n)까지 느려집니다. 정렬 규칙이 깨진 위치에 값이 있으면 경로 탐색이 답을 보장하지 못합니다.",
    66: "최소 힙의 삽입과 꺼내기는 트리 높이에 비례해 O(log n)입니다. peek는 맨 위를 바로 봐 O(1)입니다. 내부 배열이 완전히 정렬된 것은 아니므로 정렬된 목록이 필요하면 하나씩 꺼내야 합니다. n개 보관 시 공간은 O(n)입니다.",
    67: "딕셔너리 집계는 평균 O(1)로 읽고 쓰므로 전체 n개 기록을 한 번씩 훑어 O(n)입니다. 첫 등장에만 기본값 0을 씁니다. 충돌이 심하면 O(n)까지 느려질 수 있습니다. 키의 대소문자가 다르면 별도 키가 됩니다.",
    68: "인접 목록에서 A의 이웃을 읽으면 차수만큼 걸려 O(차수)입니다. 전체 간선 보관 공간은 O(정점+간선)입니다. A→B→C 길이 2 경로와 직접 간선 A→C를 구별하세요. 적혀 있지 않은 C→A 방향으로는 갈 수 없습니다.",
    69: "너비 우선 탐색은 각 정점과 간선을 한 번씩 처리해 O(정점+간선)입니다. 큐가 한 단계 이웃을 먼저 꺼내 층별 순서를 만듭니다. 방문 표시를 빠뜨리면 같은 곳을 반복합니다. 큐를 스택으로 바꾸면 층별 순서가 사라집니다.",
    70: "대기 고객은 큐로 먼저 온 A부터 처리해 순서를 지키고, 작업 취소는 스택으로 최근 것부터 되돌립니다. 이름으로 찾을 때는 사전, 중복 확인은 집합이 맞습니다. 꺼내는 쪽의 연산은 O(1), 이름 탐색은 평균 O(1)입니다.",
    72: "정렬된 배열의 이진 탐색은 절반씩 버려 O(log n)입니다. 중복된 4가 여러 개면 왼쪽 절반을 남겨 첫 위치를 찾습니다. 끝난 위치의 값이 목표와 같은지 확인해야 합니다. 정렬되지 않은 배열에는 그대로 쓸 수 없습니다.",
    73: "삽입 정렬은 왼쪽 접두부가 이미 정렬돼 있다는 믿음으로 한 칸씩 넓혀 최악 O(n²)입니다. 거의 정렬된 입력에서는 O(n)에 가깝습니다. 큰 값을 오른쪽으로 밀어 빈자리에 끼웁니다. 전체 추가 공간은 O(1)입니다.",
    76: "배열을 둘로 나누어 각각의 최댓값을 구한 뒤 합치면 각 원소를 한 번씩 봐 O(n)입니다. 원소 하나에서 멈추므로 재귀가 끝납니다. 빈 목록의 최댓값은 정해지지 않아 호출 전에 막아야 합니다.",
    77: "정렬 후 위치 찾기는 정렬 O(n log n)에 index 탐색 O(n)입니다. 원본 첫 9의 위치 0과 정렬 뒤 첫 9의 위치 1은 다릅니다. 값이 궁금한지 원본 위치가 궁금한지 먼저 구별해야 정렬로 위치 정보를 잃지 않습니다.",
    78: "동전 [4,3,1]로 6원을 만들 때 큰 것부터 고르면 4+1+1 세 개지만 3+3 두 개가 정답입니다. 탐욕 규칙이 모든 동전 체계에 맞지는 않습니다. 탐욕이 맞는지 증명하거나 작은 입력을 완전히 탐색해 검증하세요.",
    79: "계단 오르기는 작은 답을 먼저 저장해 큰 답을 쌓으므로 O(n) 시간입니다. ways[0]=1 시작값을 틀리면 뒤가 전부 틀어집니다. 직전 두 값만 남기면 공간 O(1)입니다. 점화식의 입력 범위를 벗어난 칸은 읽으면 안 됩니다.",
    80: "백트래킹은 선택→재귀→pop 되돌리기로 다른 선택을 시험합니다. 답을 모을 때 바뀌는 path 객체를 그대로 저장하면 나중에 비운 경로를 가리키므로 완성 순간 복사합니다. 경우에 따라 지수 시간이 걸립니다.",
    81: "깊이 우선 탐색은 방문 집합으로 정점과 간선을 한 번씩 처리해 O(정점+간선)입니다. 순환 A→B→C→A에서 방문 표시가 없으면 다시 dfs(A)를 불러 끝나지 않습니다. 재귀 깊이는 경로 길이만큼 쌓입니다.",
    82: "다익스트라로 B의 거리는 직접 8에서 C 경유 2+3=5로 줄어듭니다. 큐에 남은 예전 8은 꺼냈을 때 현재 거리보다 크면 건너뜁니다. 음수 비용이 있으면 이 방법을 그대로 쓰지 마세요. 힙을 쓰면 전체 O((간선+정점) log 정점)입니다.",
}


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
    change_display = change.replace(chr(92) + "n", " + 다음 줄 ")
    modified_output = MODIFIED_OUTPUT[day.number]
    is_same = modified_output.strip() == day.output.strip()
    same_reason = SAME_REASON.get(day.number, "")
    orig_lines = day.code.splitlines()
    mod_lines = modified.splitlines()
    diff_old = ""
    diff_new = ""
    for a, b in zip(orig_lines, mod_lines):
        if a != b:
            diff_old = a.strip()
            diff_new = b.strip()
            break
    if not diff_old and len(mod_lines) > len(orig_lines):
        diff_old = "(원본에는 없는 추가 줄)"
        diff_new = " / ".join(line.strip() for line in mod_lines[len(orig_lines):] if line.strip())
    trace_spaced = day.trace.replace("→", " → ")
    trace_steps = [s.strip() for s in day.trace.split("→")]
    trace_first = trace_steps[0] if trace_steps else day.trace.strip()
    trace_last = trace_steps[-1] if trace_steps else day.trace.strip()
    walk_parts = [w.strip() for w in day.walk.split("|")]
    walk_first = walk_parts[0] if walk_parts else day.walk.strip()
    walk_rest = " ".join(walk_parts[1:]) if len(walk_parts) > 1 else ""
    output_inline_ex = day.output.strip().replace("\n", " / ")
    modified_inline_ex = modified_output.strip().replace("\n", " / ")
    fixed_line_ex = ""
    buggy_line_ex = ""
    for _line in day.code.splitlines():
        if day.focus and day.focus in _line:
            fixed_line_ex = _line.strip()
            if day.wrong:
                buggy_line_ex = _line.replace(day.focus, day.wrong, 1).strip()
            else:
                buggy_line_ex = _line.replace(day.focus, "", 1).strip()
            break
    if day.number == 26:
        guided_explanation = "바꾼 뒤 출력은 '30'입니다. 배열의 값은 10·20·30 그대로이고 읽는 인덱스가 1에서 2로 바뀌었습니다. 그래서 기존 출력 20 대신 마지막 원소 30을 출력합니다. 인덱스 3은 범위 밖이라 사용하면 안 됩니다."
    elif is_same:
        guided_explanation = f"바꾼 뒤 출력은 {modified_output!r}입니다. 원본 출력 {day.output!r}와 같습니다. 바뀐 줄은 {chr(96)}{diff_new}{chr(96)}입니다. 바뀐 프로그램도 {chr(96)}{trace_first}{chr(96)} 단계에서 시작해 바뀐 줄을 지나 최종 {chr(96)}{modified_inline_ex}{chr(96)}로 끝납니다. {same_reason} 출력은 같지만 바뀐 줄 부분의 중간 값은 달라졌다가 같은 최종 값으로 이어진다는 점을 위 추적 순서와 대조해 확인할 수 있습니다."
    else:
        guided_explanation = f"바꾼 뒤 출력은 {modified_output!r}입니다. 원본 출력 {day.output!r}에서 달라졌습니다. 바뀐 줄은 {chr(96)}{diff_old}{chr(96)}에서 {chr(96)}{diff_new}{chr(96)}로 바뀌었습니다. 바뀐 프로그램은 {chr(96)}{trace_first}{chr(96)} 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 그 차이가 이후 단계로 이어져 최종 {chr(96)}{modified_inline_ex}{chr(96)}가 됩니다. 원본 추적 {chr(96)}{trace_spaced}{chr(96)}와 바뀐 줄 이후를 순서대로 비교하면 처음 달라지는 곳이 보입니다."
    if day.wrong:
        debug_explanation = f"틀린 줄은 {chr(96)}{buggy_line_ex}{chr(96)}입니다. 여기서는 {chr(96)}{day.wrong}{chr(96)}을 써서 {chr(96)}{day.focus}{chr(96)} 동작이 깨집니다. 이대로 실행하면 {chr(96)}{day.pitfall}{chr(96)} 문제가 생겨 원본 추적 {chr(96)}{trace_spaced}{chr(96)}대로 {day.output!r}가 나오지 않습니다. 고친 줄 {chr(96)}{fixed_line_ex}{chr(96)}에서는 {chr(96)}{day.focus}{chr(96)}가 {chr(96)}{day.transfer}{chr(96)} 동작을 지켜 {day.output!r}까지 도달합니다."
    else:
        debug_explanation = f"틀린 줄은 {chr(96)}{buggy_line_ex}{chr(96)}입니다. 여기서는 {chr(96)}{day.focus}{chr(96)} 표현이 빠져 {chr(96)}{day.transfer}{chr(96)} 동작이 깨집니다. 이대로 실행하면 {chr(96)}{day.pitfall}{chr(96)} 문제가 생겨 원본 추적 {chr(96)}{trace_spaced}{chr(96)}대로 {day.output!r}가 나오지 않습니다. 고친 줄 {chr(96)}{fixed_line_ex}{chr(96)}에서는 {chr(96)}{day.focus}{chr(96)}가 {chr(96)}{day.transfer}{chr(96)} 동작을 지켜 {day.output!r}까지 도달합니다."
    return [
        dict(id=f"{base}-predict", title="결과를 먼저 예측하기", kind="predict",
             objective="코드를 실행하지 않고 상태와 출력을 순서대로 추적한다.",
             prompt=f"아래 코드를 실행하면 어떤 문장이 출력될까요? {day.trace.split('→')[0].strip()}에서 시작해 계산하세요.",
             starter=day.code, answer=day.output, hint=f"{day.model} 설명을 떠올리고 {chr(96)}{trace_first}{chr(96)} 단계부터 순서대로 적어 보세요.",
             explanation=f"{trace_spaced} 순서로 실행됩니다. {chr(96)}{day.focus}{chr(96)} 부분이 {chr(96)}{trace_last}{chr(96)} 단계를 확정해 최종 출력 {day.output!r}가 됩니다. 이 흐름을 떠올리면 {chr(96)}{day.transfer}{chr(96)} 동작이 왜 필요한지 알 수 있습니다.",
             commonMistakes=common, language=day.anchor, verification="none"),
        dict(id=f"{base}-fill", title="핵심 표현 빈칸 채우기", kind="fill",
             objective=f"'{day.title}' 개념의 핵심 표현을 스스로 적는다.",
             prompt=f"빈칸을 채워 예시와 같은 결과를 만드세요. 필요한 표현: {day.focus}",
             starter=fill_source(day), answer=day.code, hint=f"힌트 문장을 완전하게 읽으면 {chr(96)}{walk_first}{chr(96)} 단계에 필요한 표현이 {chr(96)}{day.focus}{chr(96)}입니다.",
             explanation=f"빈칸에 들어갈 표현은 {day.focus!r}입니다. {chr(96)}{fixed_line_ex}{chr(96)} 줄을 완성해야 {chr(96)}{day.transfer}{chr(96)} 동작이 이어져 실행 결과 {day.output!r}가 됩니다. 힌트의 첫 단계 {chr(96)}{walk_first}{chr(96)}이 바로 이 줄입니다." + (f" 이어서 {walk_rest} 순서로 진행됩니다." if walk_rest else ""),
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-guided", title="값을 바꿔 다시 추적하기", kind="modify",
             objective="입력이 바뀌었을 때 코드의 상태와 출력이 어떻게 변하는지 설명한다.",
             prompt=f"예시를 직접 타이핑한 뒤 다음을 바꾸세요: {change_display}. 출력이 바뀌는지 먼저 예측하고, 그대로라면 그 이유도 설명하세요.",
             starter=day.code, answer=modified, hint=f"다음을 바꾼 뒤 원본 실행 추적과 처음 달라지는 지점을 찾아보세요: {change}.",
             explanation=guided_explanation,
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-debug", title="오류 설명하고 고치기", kind="debug",
             objective="문법 오류와 의미 오류를 구별하고 고친 이유를 설명한다.",
             prompt=f"아래 코드와 본문의 정상 예제를 비교하여 잘못된 부분을 찾고 고치세요. 특히 {day.pitfall} 상황을 확인하세요.",
             starter=day.buggy, answer=day.code, hint=f"{day.model} 설명과 어긋나는 줄을 찾으세요. {chr(96)}{day.pitfall}{chr(96)} 상황이 단서가 됩니다.",
             explanation=debug_explanation,
             commonMistakes=common, language=day.anchor, verification="run"),
        dict(id=f"{base}-independent", title="예시를 가리고 다시 구현하기", kind="independent",
             objective="설명 없이 같은 개념을 작은 프로그램으로 재현한다.",
             prompt=f"예시를 가리고 '{day.title}' 개념을 적용한 프로그램을 처음부터 작성하세요. 예상 출력과 경계 상황도 말로 설명하세요.",
             starter=f"// {day.title}: 직접 구현 (Python에서는 이 안내 줄을 # 주석으로 바꾸세요)" if day.anchor != "python" else f"# {day.title}: 직접 구현",
             answer=day.code, hint=f"{day.model} 흐름을 작은 입력으로 다시 만들어 보세요. 예상 출력과 빈 입력 같은 경계를 함께 적으세요.",
             explanation=f"한 가지 예시 해법은 위 코드입니다. {chr(96)}{day.focus}{chr(96)} 부분이 {chr(96)}{day.transfer}{chr(96)} 동작을 지켜 실행 결과 {day.output!r}가 됩니다. 같은 개념을 다른 입력으로 바꿔도 {chr(96)}{day.focus}{chr(96)}부터 {chr(96)}{trace_last}{chr(96)}까지 추적할 수 있으면 정답입니다. {chr(96)}{day.pitfall}{chr(96)} 상황과 빈 입력 같은 경계도 함께 설명해 보세요.",
             commonMistakes=common, language=day.anchor, verification="run"),
    ]


def quizzes(day: Day, id_: str) -> list[dict]:
    _trace_spaced = day.trace.replace("→", " → ")
    items = [
        dict(id=f"quiz-{id_}-output", question=f"예시 코드의 출력은 무엇인가요?",
             choices=[day.output, "실행 전에 반드시 오류가 난다", "아무것도 출력하지 않는다"], answerIndex=0,
             explanation=f"{_trace_spaced} 순서로 실행되어 출력은 {day.output!r}입니다. {chr(96)}{day.focus}{chr(96)} 부분이 마지막 단계를 확정하므로 다른 선택지는 이 추적과 맞지 않습니다."),
        dict(id=f"quiz-{id_}-model", question=f"'{day.title}' 개념을 이해하는 데 맞는 설명은?",
             choices=[day.model, day.pitfall + "(이것이 정상적인 사용법이다)", "코드가 짧다면 상태 추적은 필요 없다"],
             answerIndex=0, explanation=f"{day.model} 이 설명이 맞는 이유는 {chr(96)}{day.transfer}{chr(96)} 동작을 지키는 조건과 같기 때문입니다. {chr(96)}{day.pitfall}{chr(96)} 설명은 오히려 피해야 할 오류이므로 정답이 아닙니다."),
        dict(id=f"quiz-{id_}-pitfall", question="다음 중 실습에서 먼저 확인할 오류는?",
             choices=[day.pitfall, "실제 출력과 예측한 출력이 일치함", "변경된 입력을 다시 추적하여 결과를 확인함"],
             answerIndex=0, explanation=f"{day.pitfall}. 이 실수가 나오면 원본 추적 {chr(96)}{day.trace}{chr(96)}대로 {day.output!r}가 나오지 않으므로 먼저 확인해야 합니다."),
        dict(id=f"quiz-{id_}-transfer", question="세 언어로 옮길 때 무엇을 보존해야 하나요?",
             choices=[f"{day.transfer}라는 동작과 경계 조건", "세 언어의 표면 문법을 한 글자도 바꾸지 않는다", "타입과 오류 처리를 모두 생략한다"],
             answerIndex=0, explanation=f"문법은 달라도 {chr(96)}{day.transfer}{chr(96)} 목적과 입력·출력은 유지합니다. 실행 결과 {day.output!r}로 대조하면 옮김이 맞는지 확인할 수 있습니다."),
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
    data = dict(schemaVersion=1, contentVersion="2026.10-e", id=id_, courseId="crp-92",
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
    _, change = day.modified
    modified_code, _change_text = day.modified
    lang = LANG_LABEL[day.anchor]
    prev = prev_title(day)
    prev_no = day.number - 1
    prev_link = entity_id(day.number - 1) if day.number > 1 else None
    complexity_note = COMPLEXITY.get(day.number, "")
    modified_output = MODIFIED_OUTPUT[day.number]
    output_inline = day.output.strip().replace("\n", " / ")
    modified_inline = modified_output.strip().replace("\n", " / ")
    run_how = f"하단 Python 실행 영역에 같은 코드가 들어 있습니다. 먼저 실행 결과(`{output_inline}`)를 가리고 예측한 뒤 실행해 비교하세요." if day.anchor == "python" else (f"C17은 `gcc -std=c17 -Wall -Wextra`로 컴파일해 실행하면 실행 결과는 `{output_inline}`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요." if day.anchor == "c" else f"Rust는 `rustc --edition=2024` 또는 Cargo로 실행하면 실행 결과는 `{output_inline}`입니다. 브라우저에서는 임의 컴파일 대신 하단 실습 칸의 답안 비교를 사용하세요.")
    code_lines = "\n".join(f"{i + 1:2d} | {line}" for i, line in enumerate(day.code.splitlines()))
    buggy_line = ""
    fixed_line = ""
    for line in day.code.splitlines():
        if day.focus and day.focus in line:
            fixed_line = line.strip()
            buggy_line = line.replace(day.focus, day.wrong, 1).strip()
            break
    forms_c = day.forms.get("c", "이 언어의 타입과 오류 처리 규칙에 맞게 같은 동작을 구현한다.")
    forms_python = day.forms.get("python", "이 언어의 타입과 오류 처리 규칙에 맞게 같은 동작을 구현한다.")
    forms_rust = day.forms.get("rust", "이 언어의 타입과 오류 처리 규칙에 맞게 같은 동작을 구현한다.")
    complexity_block = ""
    if complexity_note:
        complexity_block = "## 시간과 공간 복잡도\n\n" + complexity_note + f" Day {day.number:02d}의 핵심 연산을 위 기준으로 직접 세어 보세요."
    trace_first = day.trace.split("\u2192")[0].strip() if "\u2192" in day.trace else day.trace.strip()
    is_same = modified_output.strip() == day.output.strip()
    same_reason = SAME_REASON.get(day.number, "")
    change_display = change.replace(chr(92) + "n", " + 다음 줄 ")
    orig_lines = day.code.splitlines()
    mod_lines = modified_code.splitlines()
    diff_old = ""
    diff_new = ""
    for a, b in zip(orig_lines, mod_lines):
        if a != b:
            diff_old = a.strip()
            diff_new = b.strip()
            break
    if not diff_old and len(mod_lines) > len(orig_lines):
        diff_old = "(원본에는 없는 추가 줄)"
        diff_new = " / ".join(line.strip() for line in mod_lines[len(orig_lines):] if line.strip())
    trace_spaced_body = day.trace.replace("→", " → ")
    if is_same:
        modified_reason = f"바꾼 뒤 출력도 {chr(96)}{output_inline}{chr(96)}입니다. {same_reason} 바뀐 프로그램도 {chr(96)}{trace_first}{chr(96)} 단계에서 시작해 {chr(96)}{diff_new}{chr(96)} 줄을 지나 최종 {chr(96)}{modified_inline}{chr(96)}로 끝납니다. 원본 추적 {chr(96)}{trace_spaced_body}{chr(96)}와 바뀐 줄 이후를 순서대로 놓으면 출력은 같아도 중간 값이 어디서 달라졌다가 합쳐지는지 확인할 수 있습니다."
    else:
        modified_reason = f"원본 출력은 {chr(96)}{output_inline}{chr(96)}이고, 바뀐 코드의 실행 결과는 {chr(96)}{modified_inline}{chr(96)}입니다. 바뀐 줄은 {chr(96)}{diff_old}{chr(96)}에서 {chr(96)}{diff_new}{chr(96)}로 바뀌었습니다. 바뀐 프로그램은 {chr(96)}{trace_first}{chr(96)} 단계에서 시작해 바뀐 줄에서 다른 중간 값을 만들고, 이후 흐름을 따라 최종 {chr(96)}{modified_inline}{chr(96)}가 됩니다. 원본 추적 {chr(96)}{trace_spaced_body}{chr(96)}에서 바뀐 줄 이후 단계와 하나씩 비교하면 처음 달라지는 곳이 보입니다."
    body = f"---\n{head}---\n\n" + f"""## 오늘 배울 이유

{day.why} Day {day.number:02d} "`{day.title}`"에서는 {lang} 코드의 실행 결과(`{output_inline}`)를 따라가며, `{day.transfer}` 동작이 왜 필요한지 확인합니다. 이 동작이 빠지면 "`{day.pitfall}`" 같은 문제가 생깁니다.

## 시작 전에 확인할 것

바로 앞선 [Day {prev_no:02d}](/learn/{prev_link})에서 배운 "{prev}" 내용을 한 문장으로 말해 보세요. 이번 "`{day.title}`"에서 새로 달라지는 조건을 찾아보세요. 핵심 표현은 `{day.focus}`입니다.

## 머릿속 그림

{day.model} Day {day.number:02d}에서는 아래 흐름 순서대로 상태가 바뀌고, 결과를 가르는 부분은 `{day.focus}`입니다.

```text
{day.trace.replace('→', ' → ')}
```

위 흐름에서 `{day.focus}` 부분이 실행되는 지점을 찾으면 읽는 값과 바뀌는 값이 나뉘어 보입니다. 마지막 출력은 `{output_inline}`입니다.

## 천천히 풀어보기

{NOTES[day.number]}

## 문법을 예제로 보기

아래 {lang} 코드는 Day {day.number:02d} "`{day.title}`"의 독립 예제입니다. 전체 {len(day.code.splitlines())}줄 가운데 핵심 부분은 `{day.focus}`이며, 실행 결과는 `{output_inline}`입니다.

```{day.anchor}
{day.code}
```

예상 출력:

```text
{day.output}
```

{run_how}

## 핵심 줄 따라 읽기

예제의 핵심 표현은 `{day.focus}`입니다. 아래 줄 번호가 붙은 코드에서 이 표현이 있는 줄을 찾으세요.

```{day.anchor}
{code_lines}
```

{steps}

`{day.focus}` 부분이 실행될 때 읽는 값과 바뀌는 값을 한 줄씩 적어 보세요. 다음 `결과 예측과 작은 변경`에서는 이 부분이 달라집니다.

## 실행 추적

| 순서 | 상태 또는 동작 |
| ---: | --- |
{trace_rows}

위 순서대로 실행한 최종 출력은 `{output_inline}`입니다. `{trace_first}` 단계와 마지막 단계를 비교하면 입력과 출력의 관계가 보입니다.

## 다른 예제로 다시 이해하기

{MORE[day.number]}

{complexity_block}

## 결과 예측과 작은 변경

원본 실행 결과는 `{output_inline}`입니다. 아래 코드에서 원본과 다른 줄을 먼저 찾으세요.

```{day.anchor}
{modified_code}
```

찾은 줄을 적용했을 때의 실행 결과를 먼저 예측해 보세요.

해설: 바뀐 코드의 실행 결과는 아래와 같습니다.

```text
{modified_output}
```

{modified_reason}

## 자주 틀리는 지점

**확인할 실수: {day.pitfall}.** 정상 코드의 실행 결과는 `{output_inline}`입니다.

- 정상 줄: `{fixed_line}`
- 잘못된 줄: `{buggy_line}`

두 줄을 나란히 놓으면 정상 줄 {chr(96)}{fixed_line}{chr(96)}이 {chr(96)}{day.model}{chr(96)} 설명과 맞고, 잘못된 줄은 {chr(96)}{day.pitfall}{chr(96)} 쪽으로 어긋납니다. 결과가 예상과 다르면 {chr(96)}{trace_first}{chr(96)}부터 {chr(96)}{day.output}{chr(96)}까지 처음 어긋난 곳을 찾습니다.

## 다른 언어로 옮기기

세 언어에서 지켜야 할 핵심 동작은 `{day.transfer}`입니다. 목표는 같은 입력에 같은 결과를 내는 것으로, 각 언어의 규칙에 맞게 옮겼는지 실행 결과로 대조하세요.

| 언어 | 옮길 때 확인할 표현과 규칙 |
| --- | --- |
{comparison}

C17에서는 `{forms_c}` 규칙을 적용합니다. "`{day.title}`" 수업의 실행 결과(`{output_inline}`)를 기준으로 삼고, C는 범위와 널 검사를 자동으로 해 주지 않으므로, 코드에 사용된 접근마다 유효 범위를 직접 확인해야 합니다. Python에서는 `{forms_python}` 규칙을 따릅니다. 실패나 빈 입력은 예외로 드러내며 조용히 넘기지 마세요. Rust에서는 `{forms_rust}` 규칙을 따릅니다. 실행 결과가 다르면 컴파일 오류(타입, 소유권, 빌림)와 실행 때 패닉(인덱스 범위 등) 중 어느 쪽인지 메시지부터 구분하세요.

## 실습 순서

예측(`{output_inline}` 맞히기) → 빈칸(`{day.focus}` 채우기) → 변경(`{change_display}`) → 오류 수정(`{day.pitfall}` 찾기) → 독립 구현(`{day.task}` 만들기) 순으로 진행하세요. 각 단계의 답은 본문의 `{output_inline}` 및 `{day.focus}` 설명과 대조하세요.

## 스스로 설명하기

- "`{day.title}`" 수업이 필요한 이유는 `{day.transfer}` 동작으로 설명해 보세요.
- 예제에서 `{day.focus}` 부분 실행 직전의 상태와 직후의 출력(`{output_inline}`)을 말해 보세요.
- "`{day.pitfall}`" 상황에서 어떤 입력과 출력이 어긋나는지 말해 보세요.
- 같은 `{day.transfer}` 동작을 나머지 두 언어의 어떤 표현으로 옮길지 말해 보세요.

## 핵심 요약과 복습

{day.model} Day {day.number:02d} "`{day.title}`" 예제의 핵심 부분은 `{day.focus}`이며, 실행 결과는 `{output_inline}`입니다. "`{day.pitfall}`" 여부를 확인하고 Day {day.number:02d} 수업을 완료하세요.
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
    assert set(MORE) == set(DAYS), "every generated day needs another worked example"
    assert all(len(note) >= 200 for note in NOTES.values()), "teaching note is too brief"
    for day in DAYS.values():
        assert day.number not in SAMPLES
        filename = CONTENT / f"{entity_id(day.number)}.md"
        filename.write_bytes(markdown(day).encode("utf-8"))
    print(f"Generated {len(DAYS)} authored lessons; original sample days preserved.")


if __name__ == "__main__":
    main()
