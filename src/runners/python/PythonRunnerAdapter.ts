import type { RunRequest, RunResult, Runner } from "../../domain/runner/types";

type WorkerReply =
  | { id: string; type: "ready" }
  | {
      id: string;
      type: "result";
      stdout: string;
      stderr: string;
      durationMs: number;
    }
  | { id: string; type: "error"; message: string; durationMs: number };

export class PythonRunnerAdapter implements Runner {
  private worker: Worker | undefined;
  private runSequence = 0;

  private getWorker(): Worker {
    if (!this.worker) this.worker = new Worker("/pyodide-worker.js");
    return this.worker;
  }

  prepare(): Promise<void> {
    const id = `prepare-${++this.runSequence}`;
    return new Promise((resolve, reject) => {
      const worker = this.getWorker();
      const listener = (event: MessageEvent<WorkerReply>) => {
        if (event.data.id !== id) return;
        worker.removeEventListener("message", listener);
        event.data.type === "ready"
          ? resolve()
          : reject(new Error("Python runtime 준비에 실패했습니다."));
      };
      worker.addEventListener("message", listener);
      worker.postMessage({ id, type: "prepare" });
    });
  }

  async run(request: RunRequest): Promise<RunResult> {
    const id = `run-${++this.runSequence}`;
    const started = performance.now();
    const worker = this.getWorker();
    return new Promise((resolve) => {
      let settled = false;
      const finish = (result: RunResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.removeEventListener("message", listener);
        resolve(result);
      };
      const listener = (event: MessageEvent<WorkerReply>) => {
        if (event.data.id !== id) return;
        if (event.data.type === "result") {
          finish({
            status: "success",
            stdout: event.data.stdout,
            stderr: event.data.stderr,
            durationMs: event.data.durationMs,
            diagnostics: [],
          });
        } else if (event.data.type === "error") {
          finish({
            status: "error",
            stdout: "",
            stderr: event.data.message,
            durationMs: event.data.durationMs,
            diagnostics: [event.data.message],
          });
        }
      };
      const timer = window.setTimeout(() => {
        this.worker?.terminate();
        this.worker = undefined;
        finish({
          status: "timeout",
          stdout: "",
          stderr:
            "시간 제한을 넘어 실행을 중단했습니다. 런타임을 새로 시작할 수 있습니다.",
          durationMs: performance.now() - started,
          diagnostics: ["worker-terminated-on-timeout"],
        });
      }, request.timeoutMs);
      worker.addEventListener("message", listener);
      worker.postMessage({
        id,
        type: "run",
        source: request.source,
        stdin: request.stdin,
      });
    });
  }

  cancel(): void {
    this.worker?.terminate();
    this.worker = undefined;
  }

  dispose(): void {
    this.cancel();
  }
}
