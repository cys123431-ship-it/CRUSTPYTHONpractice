# Study Log Analyzer CLI

The same input file and output format are used for the three standalone implementations. The five columns are `date,language,topic,minutes,result`. Dates use a valid ISO calendar day, language is `C`, `Python` or `Rust`, minutes is an ASCII integer from 1 to 10080 without a leading zero, and result is `pass` or `retry`. Quoted CSV fields with commas and escaped double quotes are supported. Invalid rows fail with a nonzero exit code and an error on stderr.

```sh
python3 examples/study-log-analyzer/study_log.py examples/study-log-analyzer/study_sessions.csv
gcc -std=c17 -Wall -Wextra -pedantic examples/study-log-analyzer/study_log.c -o /tmp/study-log-c
/tmp/study-log-c examples/study-log-analyzer/study_sessions.csv
rustc --edition=2024 examples/study-log-analyzer/study_log.rs -o /tmp/study-log-rs
/tmp/study-log-rs examples/study-log-analyzer/study_sessions.csv
```

Filters: `--language C`, `--topic 변수`, `--date 2026-10-01`, `--search 변수`. Ordering: `--sort minutes|date` (default minutes descending); `--top N` limits the session list. Empty results print zero statistics. Equal minute totals sort by date, language, then topic. The Python version has an optional `--chart` ASCII visualization extension after the common report. The total, average, minimum, maximum, per-language and per-topic totals use the selected rows.
