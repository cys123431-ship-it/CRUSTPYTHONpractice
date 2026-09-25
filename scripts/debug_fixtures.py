"""Verified debug-exercise fixtures, one per generated day.

OVERRIDES holds redesigned buggy/fixed pairs (manuscript overrides); otherwise
the pair is (Day.buggy, Day.code). EXPECTED records the verified result of each
side: (buggy_stdout, buggy_error, fixed_stdout, error_class, static).

buggy_stdout is the exact observed stdout ("" when nothing is printed).
buggy_error is the observed error name ("" when the program runs). "UB" marks
C undefined behavior verified statically, never executed for an output promise.
static=True means the outcome was classified by language-semantics reasoning
(C/Rust toolchains unavailable locally); CI verifies originals and modified
programs with real toolchains, and every Python buggy pair below was executed.
"""

from __future__ import annotations


OVERRIDES: dict[int, tuple[str, str]] = {
    12: ("minutes = 30\nprint(30 < 30 <= 60)", "minutes = 30\nprint(30 <= 30 <= 60)"),
    77: ("values = [8, 2, 6, 4]\nsorted(values)\nprint(values.index(8))", "values = sorted([8, 2, 6, 4])\nprint(values.index(8))"),
    85: ("import csv, io\nsource = io.StringIO(\"date,language,topic,minutes,result\\n2026-10-01,Python,변수,30,pass\\n\")\nrow = next(csv.DictReader(source))\nminutes = row[\"minutes\"]\nprint(minutes + 5)", "import csv, io\nsource = io.StringIO(\"date,language,topic,minutes,result\\n2026-10-01,Python,변수,30,pass\\n\")\nrow = next(csv.DictReader(source))\nminutes = int(row[\"minutes\"])\nprint(minutes + 5)"),
}


EXPECTED: dict[int, tuple[str, str, str, str, bool]] = {
    2: ("", "SyntaxError", "안녕, 요섭", "compile-error", False),
    3: ("", "compile-error", "study: 30", "compile-error", True),
    4: ("", "compile-error", "30", "compile-error", True),
    5: ("70", "", "30", "wrong-output", False),
    6: ("2.0", "", "2.5", "wrong-output", True),
    7: ("{minutes}분", "", "30분", "wrong-output", False),
    8: ("true", "", "true", "same-output-contract", True),
    9: ("평균 2.75", "", "평균 2.8", "wrong-output", False),
    10: ("0", "", "1", "wrong-output", True),
    11: ("1800", "", "1800", "same-output-contract", True),
    12: ("False", "", "True", "wrong-output", False),
    13: ("조금 더", "", "목표 달성", "wrong-output", False),
    14: ("미달", "", "달성", "wrong-output", True),
    15: ("심화", "", "기본", "wrong-output", True),
    16: ("30", "", "60", "wrong-output", False),
    17: ("timeout", "", "3 2 1", "infinite-loop", True),
    18: ("3", "", "6", "wrong-output", True),
    19: ("", "NameError", "[(1, 3), (1, 4), (2, 3), (2, 4)]", "runtime-error", False),
    20: ("-1", "", "5", "wrong-output", True),
    21: ("20", "", "30", "wrong-output", False),
    22: ("21", "", "14", "wrong-output", True),
    23: ("밖\n밖", "", "안\n밖", "wrong-output", False),
    24: ("6", "", "6", "same-output-contract", True),
    25: ("오류", "", "30", "wrong-output", True),
    26: ("UB", "", "20", "undefined-behavior", True),
    27: ("", "IndexError", "60", "runtime-error", False),
    28: ("10", "", "60", "wrong-output", True),
    30: ("UB", "", "20", "undefined-behavior", True),
    31: ("99", "", "10", "wrong-output", False),
    32: ("", "compile-error", "study study", "compile-error", True),
    33: ("4 Rust", "", "4 Rust", "same-output-contract", True),
    34: ("UB", "", "12", "undefined-behavior", True),
    35: ("[1, 2]", "", "[1, 2, 3]", "wrong-output", False),
    36: ("20 30", "", "20 30", "same-output-contract", True),
    37: ("4", "", "3", "wrong-output", True),
    38: ("2 2", "", "2 6", "wrong-output", False),
    39: ("", "compile-error", "C Rust", "compile-error", True),
    40: ("42", "", "42", "same-output-contract", True),
    41: ("", "compile-error", "42", "compile-error", True),
    42: ("[1, 2] [1, 2]", "", "[1] [1, 2]", "wrong-output", False),
    43: ("0", "", "12", "wrong-output", True),
    44: ("[10]", "", "[10, 30]", "wrong-output", False),
    45: ("", "compile-error", "study", "compile-error", True),
    46: ("UB", "", "30", "undefined-behavior", True),
    47: ("", "TypeError", "30", "runtime-error", False),
    48: ("", "compile-error", "30", "compile-error", True),
    49: ("", "compile-error", "30", "compile-error", True),
    50: ("1", "", "30", "wrong-output", True),
    51: ("", "AttributeError", "30", "runtime-error", False),
    52: ("60", "", "60", "same-output-contract", True),
    53: ("재시도", "", "통과", "wrong-output", True),
    54: ("", "compile-error", "30", "compile-error", True),
    55: ("", "SyntaxError", "검증 완료", "compile-error", False),
    56: ("", "compile-error", "검증 완료", "compile-error", True),
    58: ("입력", "", "삭제", "wrong-output", False),
    59: ("C", "", "A", "wrong-output", False),
    60: ("UB", "", "10", "undefined-behavior", True),
    61: ("10", "", "20", "wrong-output", True),
    62: ("", "KeyError", "B", "runtime-error", False),
    63: ("3 2", "", "1 3", "wrong-output", False),
    64: ("", "TypeError", "3", "runtime-error", False),
    65: ("False", "", "True", "wrong-output", False),
    66: ("", "AttributeError", "10", "runtime-error", False),
    67: ("3", "", "2", "wrong-output", False),
    68: ("[]", "", "['B', 'C']", "wrong-output", False),
    69: ("['A', 'B', 'C']", "", "['A', 'B', 'C']", "same-output-contract", False),
    70: ("second", "", "first", "wrong-output", False),
    71: ("8", "", "4", "wrong-output", False),
    72: ("timeout", "", "3", "infinite-loop", False),
    73: ("[3, 2, 1]", "", "[1, 2, 3]", "wrong-output", False),
    74: ("[4, 3, 2, 1]", "", "[1, 2, 3, 4]", "wrong-output", False),
    75: ("[1, 2, 3, 4]", "", "[1, 2, 3, 3, 4]", "wrong-output", False),
    76: ("", "IndexError", "9", "runtime-error", False),
    77: ("0", "", "3", "wrong-output", False),
    78: ("[5, 5]", "", "[5, 5, 1]", "wrong-output", False),
    79: ("4", "", "5", "wrong-output", False),
    80: ("[(1, 2), (1, 2, 2, 1, 2, 1)]", "", "[(1, 2), (2, 1)]", "wrong-output", False),
    81: ("", "KeyError", "3", "runtime-error", False),
    82: ("inf", "", "3", "wrong-output", False),
    83: ("", "IndexError", "5 minutes", "runtime-error", False),
    84: ("20", "", "40", "wrong-output", False),
    85: ("", "TypeError", "35", "runtime-error", False),
    86: ("('C', 46)", "", "('C', 45)", "wrong-output", False),
    87: ("no-output-exit-1", "", "30", "wrong-output", True),
    88: ("UB", "", "60", "undefined-behavior", True),
    89: ("", "compile-error", "30", "compile-error", True),
    90: ("", "compile-error", "60", "compile-error", True),
    91: ("False", "", "True", "wrong-output", False),
    92: ("", "AssertionError", "Study Log Analyzer 완료: 60", "runtime-error", False),
}