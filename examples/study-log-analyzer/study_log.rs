//! Standalone Rust 2024 implementation with a small quoted-CSV parser.
use std::collections::BTreeMap;
use std::env;
use std::fs;

#[derive(Clone)]
struct Session {
    date: String,
    language: String,
    topic: String,
    minutes: u32,
    result: String,
}

fn rows(text: &str) -> Result<Vec<Vec<String>>, String> {
    let mut output = Vec::new();
    let mut record = Vec::new();
    let mut field = String::new();
    let mut quoted = false;
    let mut after_quote = false;
    let mut at_start = true;
    let mut chars = text.chars().peekable();
    while let Some(ch) = chars.next() {
        if quoted {
            if ch == '"' {
                if chars.peek() == Some(&'"') {
                    field.push('"'); chars.next();
                } else { quoted = false; after_quote = true; }
            } else { field.push(ch); }
            continue;
        }
        if after_quote && ch != ',' && ch != '\n' && ch != '\r' {
            return Err("닫힌 따옴표 뒤에 예상치 못한 문자가 있습니다".into());
        }
        match ch {
            '"' if at_start => { quoted = true; at_start = false; }
            '"' => return Err("필드 중간의 따옴표는 이스케이프해야 합니다".into()),
            ',' => { record.push(std::mem::take(&mut field)); at_start = true; after_quote = false; }
            '\n' => {
                record.push(std::mem::take(&mut field)); output.push(std::mem::take(&mut record));
                at_start = true; after_quote = false;
            }
            '\r' if chars.peek() == Some(&'\n') => {},
            '\r' => return Err("CRLF 또는 LF 줄바꿈을 사용하세요".into()),
            _ => { field.push(ch); at_start = false; }
        }
    }
    if quoted { return Err("닫히지 않은 CSV 따옴표".into()); }
    if !record.is_empty() || !field.is_empty() || !at_start {
        record.push(field); output.push(record);
    }
    Ok(output)
}

fn date_valid(s: &str) -> bool {
    let b = s.as_bytes();
    if b.len() != 10 || b[4] != b'-' || b[7] != b'-' ||
        !b.iter().enumerate().all(|(i, c)| i == 4 || i == 7 || c.is_ascii_digit()) { return false; }
    let (Ok(y), Ok(m), Ok(d)) = (s[0..4].parse::<u32>(), s[5..7].parse::<u32>(), s[8..10].parse::<u32>()) else { return false; };
    let leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    let max = match m { 1|3|5|7|8|10|12 => 31, 4|6|9|11 => 30, 2 if leap => 29, 2 => 28, _ => 0 };
    y > 0 && d >= 1 && d <= max
}

fn load(path: &str) -> Result<Vec<Session>, String> {
    let source = fs::read_to_string(path).map_err(|e| format!("파일 읽기 실패: {e}"))?;
    let mut parsed = rows(&source)?.into_iter();
    if parsed.next().as_deref() != Some(&["date".into(), "language".into(), "topic".into(), "minutes".into(), "result".into()]) {
        return Err("헤더는 date,language,topic,minutes,result여야 합니다".into());
    }
    parsed.enumerate().map(|(line, fields)| {
        if fields.len() != 5 { return Err(format!("{}행: 열이 정확히 5개여야 합니다", line+2)); }
        if !date_valid(&fields[0]) || !matches!(fields[1].as_str(), "C"|"Python"|"Rust") ||
            fields[2].trim().is_empty() || !matches!(fields[4].as_str(), "pass"|"retry") {
            return Err(format!("{}행: date/language/topic/result 오류", line+2));
        }
        let text = &fields[3];
        if text.starts_with('0') || !text.bytes().all(|c| c.is_ascii_digit()) {
            return Err(format!("{}행: minutes는 양의 정수여야 합니다", line+2));
        }
        let minutes = text.parse::<u32>().map_err(|_| format!("{}행: minutes 오류", line+2))?;
        if !(1..=10080).contains(&minutes) { return Err(format!("{}행: minutes는 10080 이하여야 합니다", line+2)); }
        Ok(Session { date: fields[0].clone(), language: fields[1].clone(), topic: fields[2].clone(), minutes, result: fields[4].clone() })
    }).collect()
}

struct Options {
    path: String, language: Option<String>, topic: Option<String>, date: Option<String>,
    search: Option<String>, sort: String, top: usize,
}

fn options() -> Result<Options, String> {
    let mut args = env::args().skip(1);
    let path = args.next().ok_or("사용법: study_log FILE [--language C|Python|Rust] [--topic TEXT] [--date YYYY-MM-DD] [--search TEXT] [--sort minutes|date] [--top N]")?;
    let mut result = Options { path, language: None, topic: None, date: None, search: None, sort: "minutes".into(), top: 5 };
    while let Some(flag) = args.next() {
        let value = args.next().ok_or(format!("{flag}에 값이 없습니다"))?;
        match flag.as_str() {
            "--language" if matches!(value.as_str(), "C"|"Python"|"Rust") => result.language = Some(value),
            "--topic" => result.topic = Some(value),
            "--date" if date_valid(&value) => result.date = Some(value),
            "--search" => result.search = Some(value),
            "--sort" if value == "date" || value == "minutes" => result.sort = value,
            "--top" => { result.top = value.parse().map_err(|_| "--top 숫자 오류")?; if !(1..=1000).contains(&result.top) { return Err("--top은 1~1000 사이여야 합니다".into()); } }
            _ => return Err(format!("알 수 없거나 잘못된 옵션: {flag} {value}")),
        }
    }
    Ok(result)
}

fn report(sessions: Vec<Session>, opts: &Options) -> String {
    let mut selected: Vec<Session> = sessions.into_iter().filter(|r| {
        opts.language.as_ref().is_none_or(|s| s == &r.language) &&
        opts.topic.as_ref().is_none_or(|s| s == &r.topic) &&
        opts.date.as_ref().is_none_or(|s| s == &r.date) &&
        opts.search.as_ref().is_none_or(|s| r.topic.to_lowercase().contains(&s.to_lowercase()))
    }).collect();
    let total: u64 = selected.iter().map(|r| u64::from(r.minutes)).sum();
    let min = selected.iter().map(|r| r.minutes).min().unwrap_or(0);
    let max = selected.iter().map(|r| r.minutes).max().unwrap_or(0);
    let mut languages: BTreeMap<&str, u64> = BTreeMap::new();
    let mut topics: BTreeMap<&str, u64> = BTreeMap::new();
    for r in &selected {
        *languages.entry(&r.language).or_default() += u64::from(r.minutes);
        *topics.entry(&r.topic).or_default() += u64::from(r.minutes);
    }
    let mut out = format!("sessions: {}\ntotal_minutes: {total}\naverage_minutes: {:.2}\nmin_minutes: {min}\nmax_minutes: {max}\nlanguage_totals:\n",
                          selected.len(), if selected.is_empty() { 0.0 } else { total as f64 / selected.len() as f64 });
    for (key, value) in languages { out.push_str(&format!("{key},{value}\n")); }
    out.push_str("topic_totals:\n");
    for (key, value) in topics { out.push_str(&format!("{key},{value}\n")); }
    out.push_str("top_sessions:\n");
    if opts.sort == "date" {
        selected.sort_by(|a,b| (&a.date,&a.language,&a.topic,a.minutes).cmp(&(&b.date,&b.language,&b.topic,b.minutes)));
    } else {
        selected.sort_by(|a,b| b.minutes.cmp(&a.minutes).then_with(|| (&a.date,&a.language,&a.topic).cmp(&(&b.date,&b.language,&b.topic))));
    }
    for r in selected.iter().take(opts.top) {
        out.push_str(&format!("{},{},{},{},{}\n",r.date,r.language,r.topic,r.minutes,r.result));
    }
    out
}

fn main() {
    let result = (|| -> Result<String, String> {
        let opts = options()?;
        Ok(report(load(&opts.path)?, &opts))
    })();
    match result { Ok(text) => print!("{text}"), Err(error) => { eprintln!("오류: {error}"); std::process::exit(1); } }
}
