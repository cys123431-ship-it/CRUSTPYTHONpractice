# Capstone specification: Study Log Analyzer CLI

All three implementations consume `study_sessions.csv(date,language,topic,minutes,result)` and must produce equivalent totals, filters, sorting, Top-N, averages, maxima, and minima. Invalid dates, languages, minutes, and result values produce explicit errors. Modules separate parsing, validation, aggregation, presentation, and tests.

After the common core passes shared fixtures, one preferred-language extension may add ASCII visualization, advanced filtering, JSON export, graph analysis, or an interactive CLI. Content population reaches this phase only after the sample Day engine and 5–10 Day batches pass quality gates.
