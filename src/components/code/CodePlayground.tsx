import { useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../../domain/curriculum/types";
import type { RunResult, Runner } from "../../domain/runner/types";
import { PythonRunnerAdapter } from "../../runners/python/PythonRunnerAdapter";
import { PreparedWasmRunnerAdapter } from "../../runners/wasm-demo/PreparedWasmRunnerAdapter";
import CodeEditor from "./CodeEditor";

const EXAMPLES: Record<Language, string> = {
  python: 'minutes = [45, 60, 30]\nprint("총 학습:", sum(minutes), "분")',
  c: '#include <stdio.h>\nint main(void) {\n    printf("21 + 21 = %d\\n", 21 + 21);\n    return 0;\n}',
  rust: 'fn main() {\n    println!("21 + 21 = {}", 21 + 21);\n}',
};

interface Props {
  initialLanguage?: Language;
  initialSource?: string | undefined;
  compact?: boolean;
}

export default function CodePlayground({
  initialLanguage = "python",
  initialSource,
  compact = false,
}: Props) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [source, setSource] = useState(
    initialSource ?? EXAMPLES[initialLanguage],
  );
  const [stdin, setStdin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "running">("idle");
  const [result, setResult] = useState<RunResult>();
  const runner = useRef<Runner | undefined>(undefined);
  const isPrepared = language !== "python";
  const label = useMemo(
    () =>
      isPrepared
        ? "Prepared WASM Demo · 소스 수정/임의 컴파일 불가"
        : "Python · 브라우저에서 실제 실행",
    [isPrepared],
  );

  useEffect(() => () => runner.current?.dispose(), []);

  const changeLanguage = (next: Language) => {
    runner.current?.dispose();
    runner.current = undefined;
    setLanguage(next);
    setSource(EXAMPLES[next]);
    setResult(undefined);
    setStatus("idle");
  };

  const run = async () => {
    setStatus("loading");
    setResult(undefined);
    runner.current ??=
      language === "python"
        ? new PythonRunnerAdapter()
        : new PreparedWasmRunnerAdapter();
    try {
      await runner.current.prepare();
      setStatus("running");
      const next = await runner.current.run({
        language,
        source,
        stdin,
        timeoutMs: 8000,
      });
      setResult(next);
    } catch (error) {
      setResult({
        status: "error",
        stdout: "",
        stderr: error instanceof Error ? error.message : String(error),
        durationMs: 0,
        diagnostics: ["prepare-failed"],
      });
    } finally {
      setStatus("idle");
    }
  };

  const cancel = () => {
    runner.current?.cancel();
    runner.current = undefined;
    setStatus("idle");
    setResult({
      status: "cancelled",
      stdout: "",
      stderr: "사용자가 실행을 취소했습니다.",
      durationMs: 0,
      diagnostics: [],
    });
  };

  return (
    <section
      className={`playground card ${compact ? "compact" : ""}`}
      aria-labelledby="playground-title"
    >
      <div className="playground-head">
        <div>
          <span className="runner-label">{label}</span>
          <h2 id="playground-title">코드 플레이그라운드</h2>
        </div>
        <label>
          언어<span className="sr-only"> 선택</span>
          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
          >
            <option value="python">Python</option>
            <option value="c">C demo</option>
            <option value="rust">Rust demo</option>
          </select>
        </label>
      </div>
      {isPrepared && (
        <p className="prepared-note">
          이 버튼은 사전 컴파일된 WebAssembly 모듈을 실행합니다. 표시된 C/Rust
          소스를 브라우저에서 컴파일하는 기능은 아닙니다.
        </p>
      )}
      <CodeEditor
        key={language}
        id="playground-source"
        label={`${language} 소스`}
        language={language}
        value={source}
        readOnly={isPrepared}
        onChange={setSource}
      />
      {!isPrepared && (
        <label className="stdin-label">
          표준 입력(선택)
          <textarea
            value={stdin}
            rows={2}
            onChange={(event) => setStdin(event.target.value)}
          />
        </label>
      )}
      <div className="run-row">
        <button
          type="button"
          className="button"
          onClick={run}
          disabled={status !== "idle"}
        >
          {status === "loading"
            ? "런타임 준비 중…"
            : status === "running"
              ? "실행 중…"
              : isPrepared
                ? "Prepared Demo 실행"
                : "Python 실행"}
        </button>
        {status !== "idle" && (
          <button type="button" className="button secondary" onClick={cancel}>
            취소·리셋
          </button>
        )}
      </div>
      <div
        className="run-result"
        aria-live="polite"
        aria-busy={status !== "idle"}
      >
        <div>
          <strong>실행 결과</strong>
          {result && (
            <span>
              {Math.round(result.durationMs)}ms · {result.status}
            </span>
          )}
        </div>
        <pre>
          {result
            ? [result.stdout, result.stderr].filter(Boolean).join("\n") ||
              "출력 없음"
            : "실행하면 stdout과 오류가 여기에 표시됩니다."}
        </pre>
      </div>
    </section>
  );
}
