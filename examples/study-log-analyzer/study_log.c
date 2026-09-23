/* Study Log Analyzer, C17: bounded input, checked parsing and common report. */
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 4096
#define MAX_ROWS 4096
#define MAX_TEXT 512

typedef struct {
    char date[11];
    char language[8];
    char topic[MAX_TEXT];
    unsigned minutes;
    char result[8];
} Session;
typedef struct { char name[MAX_TEXT]; unsigned long long total; } Group;

static Session sessions[MAX_ROWS];
static Session selected[MAX_ROWS];
static Group languages[3], topics[MAX_ROWS];
static size_t count, used, language_count, topic_count;
static const char *filter_language, *filter_topic, *filter_date, *filter_search;
static int date_sort;
static size_t top = 5;

static int csv_fields(const char *line, char out[5][MAX_LINE]) {
    size_t column = 0, pos = 0;
    int quoted = 0, ended = 0, start = 1;
    memset(out, 0, 5 * MAX_LINE);
    for (size_t i = 0;; i++) {
        char ch = line[i];
        if (quoted) {
            if (ch == '\0' || ch == '\n') return 0; /* multiline fields excluded */
            if (ch == '"' && line[i + 1] == '"') { ch = '"'; i++; }
            else if (ch == '"') { quoted = 0; ended = 1; continue; }
            if (pos + 1 >= MAX_LINE) return 0;
            out[column][pos++] = ch;
            continue;
        }
        if (ended && ch != ',' && ch != '\r' && ch != '\n' && ch != '\0') return 0;
        if (ch == '"') { if (!start) return 0; quoted = 1; start = 0; continue; }
        if (ch == ',') {
            if (++column >= 5) return 0;
            pos = 0; start = 1; ended = 0; continue;
        }
        if (ch == '\r' && (line[i + 1] == '\n' || line[i + 1] == '\0')) continue;
        if (ch == '\n' || ch == '\0') return column == 4;
        if (pos + 1 >= MAX_LINE) return 0;
        out[column][pos++] = ch; start = 0;
    }
}

static int date_valid(const char *text) {
    if (strlen(text) != 10 || text[4] != '-' || text[7] != '-') return 0;
    for (int i = 0; i < 10; i++) if (i != 4 && i != 7 && !isdigit((unsigned char)text[i])) return 0;
    int y = (text[0]-'0')*1000+(text[1]-'0')*100+(text[2]-'0')*10+text[3]-'0';
    int m = (text[5]-'0')*10+text[6]-'0', d = (text[8]-'0')*10+text[9]-'0';
    if (y < 1 || m < 1 || m > 12) return 0;
    const int days[] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    int max = days[m] + (m == 2 && y % 4 == 0 && (y % 100 != 0 || y % 400 == 0));
    return d >= 1 && d <= max;
}

static int minutes_valid(const char *text, unsigned *out) {
    if (!*text || *text == '0') return 0;
    for (const char *c = text; *c; c++) if (!isdigit((unsigned char)*c)) return 0;
    errno = 0; char *end = NULL;
    unsigned long value = strtoul(text, &end, 10);
    if (errno || !end || *end || value < 1 || value > 10080) return 0;
    *out = (unsigned)value;
    return 1;
}

static int has_text(const char *text) {
    for (; *text; text++) if (!isspace((unsigned char)*text)) return 1;
    return 0;
}

static int load(const char *path) {
    FILE *file = fopen(path, "r");
    if (!file) { perror("오류: 파일 읽기 실패"); return 0; }
    char line[MAX_LINE], fields[5][MAX_LINE];
    if (!fgets(line, sizeof line, file) || !csv_fields(line, fields) ||
        strcmp(fields[0], "date") || strcmp(fields[1], "language") ||
        strcmp(fields[2], "topic") || strcmp(fields[3], "minutes") || strcmp(fields[4], "result")) {
        fprintf(stderr, "오류: 헤더는 date,language,topic,minutes,result여야 합니다\n"); fclose(file); return 0;
    }
    size_t number = 1;
    while (fgets(line, sizeof line, file)) {
        number++;
        if (!strchr(line, '\n') && !feof(file)) {
            fprintf(stderr, "오류: %zu행이 너무 깁니다\n", number); fclose(file); return 0;
        }
        if (!csv_fields(line, fields) || count >= MAX_ROWS ||
            !date_valid(fields[0]) ||
            (strcmp(fields[1], "C") && strcmp(fields[1], "Python") && strcmp(fields[1], "Rust")) ||
            !has_text(fields[2]) || strlen(fields[2]) >= MAX_TEXT ||
            (strcmp(fields[4], "pass") && strcmp(fields[4], "retry")) ||
            !minutes_valid(fields[3], &sessions[count].minutes)) {
            fprintf(stderr, "오류: %zu행의 CSV 또는 필드 값이 올바르지 않습니다\n", number); fclose(file); return 0;
        }
        Session *s = &sessions[count++];
        strcpy(s->date, fields[0]); strcpy(s->language, fields[1]);
        strcpy(s->topic, fields[2]); strcpy(s->result, fields[4]);
    }
    if (ferror(file)) { perror("오류: 파일 읽기 실패"); fclose(file); return 0; }
    fclose(file); return 1;
}

static int text_contains(const char *text, const char *query) {
    for (; *text; text++) {
        const char *a = text, *b = query;
        while (*a && *b && tolower((unsigned char)*a) == tolower((unsigned char)*b)) { a++; b++; }
        if (!*b) return 1;
    }
    return !*query;
}

static void add_group(Group *groups, size_t *length, const char *key, unsigned value) {
    for (size_t i = 0; i < *length; i++) if (!strcmp(groups[i].name, key)) {
        groups[i].total += value; return;
    }
    Group *g = &groups[(*length)++];
    strcpy(g->name, key); g->total = value;
}

static int group_cmp(const void *a, const void *b) {
    return strcmp(((const Group *)a)->name, ((const Group *)b)->name);
}
static int session_cmp(const void *pa, const void *pb) {
    const Session *a = pa, *b = pb;
    int order = date_sort ? strcmp(a->date, b->date) :
                (a->minutes < b->minutes ? 1 : a->minutes > b->minutes ? -1 : 0);
    if (order) return order;
    if (date_sort) {
        if ((order = strcmp(a->language, b->language))) return order;
        if ((order = strcmp(a->topic, b->topic))) return order;
        return a->minutes < b->minutes ? -1 : a->minutes > b->minutes ? 1 : 0;
    }
    if ((order = strcmp(a->date, b->date))) return order;
    if ((order = strcmp(a->language, b->language))) return order;
    return strcmp(a->topic, b->topic);
}

static int options(int argc, char **argv) {
    if (argc < 2) return 0;
    for (int i = 2; i < argc; i += 2) {
        if (i + 1 >= argc) return 0;
        const char *name = argv[i], *value = argv[i + 1];
        if (!strcmp(name, "--language")) {
            if (strcmp(value,"C") && strcmp(value,"Python") && strcmp(value,"Rust")) return 0;
            filter_language = value;
        } else if (!strcmp(name, "--topic")) filter_topic = value;
        else if (!strcmp(name, "--date")) { if (!date_valid(value)) return 0; filter_date = value; }
        else if (!strcmp(name, "--search")) filter_search = value;
        else if (!strcmp(name, "--sort")) { if (strcmp(value,"date") && strcmp(value,"minutes")) return 0; date_sort = !strcmp(value,"date"); }
        else if (!strcmp(name, "--top")) {
            unsigned parsed;
            if (!minutes_valid(value, &parsed) || parsed > 1000) return 0;
            top = parsed;
        } else return 0;
    }
    return 1;
}

int main(int argc, char **argv) {
    if (!options(argc, argv)) {
        fprintf(stderr,"오류: 사용법 study_log FILE [--language C|Python|Rust] [--topic TEXT] [--date YYYY-MM-DD] [--search TEXT] [--sort minutes|date] [--top N]\n");
        return 1;
    }
    if (!load(argv[1])) return 1;
    unsigned long long total = 0;
    unsigned min = UINT_MAX, max = 0;
    for (size_t i = 0; i < count; i++) {
        const Session *s = &sessions[i];
        if ((filter_language && strcmp(filter_language,s->language)) ||
            (filter_topic && strcmp(filter_topic,s->topic)) ||
            (filter_date && strcmp(filter_date,s->date)) ||
            (filter_search && !text_contains(s->topic,filter_search))) continue;
        selected[used++] = *s; total += s->minutes;
        if (s->minutes < min) min = s->minutes;
        if (s->minutes > max) max = s->minutes;
        add_group(languages,&language_count,s->language,s->minutes);
        add_group(topics,&topic_count,s->topic,s->minutes);
    }
    printf("sessions: %zu\ntotal_minutes: %llu\naverage_minutes: %.2f\nmin_minutes: %u\nmax_minutes: %u\nlanguage_totals:\n",
           used,total,used ? (double)total / used : 0.0,used ? min : 0,max);
    qsort(languages, language_count, sizeof languages[0], group_cmp);
    qsort(topics, topic_count, sizeof topics[0], group_cmp);
    for (size_t i=0;i<language_count;i++) printf("%s,%llu\n",languages[i].name,languages[i].total);
    puts("topic_totals:");
    for (size_t i=0;i<topic_count;i++) printf("%s,%llu\n",topics[i].name,topics[i].total);
    puts("top_sessions:");
    qsort(selected,used,sizeof selected[0],session_cmp);
    for (size_t i=0;i<used && i<top;i++) {
        const Session *s=&selected[i];
        printf("%s,%s,%s,%u,%s\n",s->date,s->language,s->topic,s->minutes,s->result);
    }
    return 0;
}
