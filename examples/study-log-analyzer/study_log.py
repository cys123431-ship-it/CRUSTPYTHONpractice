"""Study Log Analyzer: Python reference implementation of the shared CLI."""

from __future__ import annotations

import argparse
import csv
from dataclasses import dataclass
from datetime import date
from pathlib import Path
import sys


LANGUAGES = {"C", "Python", "Rust"}
RESULTS = {"pass", "retry"}
FIELDS = ["date", "language", "topic", "minutes", "result"]


@dataclass(frozen=True)
class Session:
    day: str
    language: str
    topic: str
    minutes: int
    result: str


def parse_date(value: str) -> str:
    try:
        if len(value) != 10 or value[4] != "-" or value[7] != "-":
            raise ValueError("YYYY-MM-DD 형식이 아닙니다")
        if date.fromisoformat(value).isoformat() != value:
            raise ValueError("올바르지 않은 날짜입니다")
    except ValueError as error:
        raise ValueError(f"날짜 오류: {value}") from error
    return value


def load(path: Path) -> list[Session]:
    with path.open(encoding="utf-8", newline="") as stream:
        reader = csv.DictReader(stream, strict=True)
        if reader.fieldnames != FIELDS:
            raise ValueError("헤더는 date,language,topic,minutes,result여야 합니다")
        rows = []
        for line_number, row in enumerate(reader, 2):
            if None in row or any(row.get(field) is None for field in FIELDS):
                raise ValueError(f"{line_number}행: 열이 정확히 5개여야 합니다")
            language = row["language"]
            topic = row["topic"]
            result = row["result"]
            raw_minutes = row["minutes"]
            if language not in LANGUAGES or not topic.strip() or result not in RESULTS:
                raise ValueError(f"{line_number}행: language/topic/result 오류")
            if not raw_minutes.isascii() or not raw_minutes.isdigit() or raw_minutes.startswith("0"):
                raise ValueError(f"{line_number}행: minutes는 양의 정수여야 합니다")
            minutes = int(raw_minutes)
            if minutes > 10080:
                raise ValueError(f"{line_number}행: minutes는 10080 이하여야 합니다")
            rows.append(Session(parse_date(row["date"]), language, topic, minutes, result))
    return rows


def report(rows: list[Session], *, language: str | None = None,
           topic: str | None = None, day: str | None = None, search: str | None = None,
           sort: str = "minutes", top: int = 5, chart: bool = False) -> str:
    selected = [row for row in rows if
                (language is None or row.language == language) and
                (topic is None or row.topic == topic) and
                (day is None or row.day == day) and
                (search is None or search.casefold() in row.topic.casefold())]
    total = sum(row.minutes for row in selected)
    lines = [f"sessions: {len(selected)}", f"total_minutes: {total}",
             f"average_minutes: {total / len(selected):.2f}" if selected else "average_minutes: 0.00",
             f"min_minutes: {min((r.minutes for r in selected), default=0)}",
             f"max_minutes: {max((r.minutes for r in selected), default=0)}",
             "language_totals:"]
    for key in sorted({r.language for r in selected}):
        lines.append(f"{key},{sum(r.minutes for r in selected if r.language == key)}")
    lines.append("topic_totals:")
    for key in sorted({r.topic for r in selected}):
        lines.append(f"{key},{sum(r.minutes for r in selected if r.topic == key)}")
    lines.append("top_sessions:")
    ordered = sorted(selected, key=(lambda r: (r.day, r.language, r.topic, r.minutes)) if sort == "date"
                     else (lambda r: (-r.minutes, r.day, r.language, r.topic)))
    for row in ordered[:top]:
        lines.append(f"{row.day},{row.language},{row.topic},{row.minutes},{row.result}")
    if chart:
        lines.append("ascii_chart:")
        for key in sorted({r.language for r in selected}):
            total_for_key = sum(r.minutes for r in selected if r.language == key)
            lines.append(f"{key}: {'#' * min(40, (total_for_key + 9) // 10)}")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="C/Python/Rust 공통 Study Log Analyzer")
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--language", choices=sorted(LANGUAGES))
    parser.add_argument("--topic")
    parser.add_argument("--date")
    parser.add_argument("--search")
    parser.add_argument("--sort", choices=["minutes", "date"], default="minutes")
    parser.add_argument("--top", type=int, default=5)
    parser.add_argument("--chart", action="store_true", help="Python 선택 확장: ASCII 막대")
    args = parser.parse_args()
    try:
        if args.date:
            parse_date(args.date)
        if args.top < 1 or args.top > 1000:
            raise ValueError("--top은 1~1000 사이여야 합니다")
        print(report(load(args.csv_path), language=args.language, topic=args.topic,
                     day=args.date, search=args.search, sort=args.sort, top=args.top,
                     chart=args.chart), end="")
    except (OSError, UnicodeError, csv.Error, ValueError) as error:
        print(f"오류: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
