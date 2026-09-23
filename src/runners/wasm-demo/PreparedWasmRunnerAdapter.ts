import type { RunRequest, RunResult, Runner } from "../../domain/runner/types";

// A tiny prebuilt WebAssembly module exporting add(i32, i32). It is a prepared
// demonstration artifact, never an arbitrary C/Rust compiler.
const ADD_WASM = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02,
  0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x61,
  0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01,
  0x6a, 0x0b,
]);

export class PreparedWasmRunnerAdapter implements Runner {
  private add: ((left: number, right: number) => number) | undefined;

  async prepare() {
    const module = await WebAssembly.instantiate(ADD_WASM);
    this.add = module.instance.exports.add as (
      left: number,
      right: number,
    ) => number;
  }

  async run(request: RunRequest): Promise<RunResult> {
    const start = performance.now();
    if (!this.add) await this.prepare();
    const result = this.add?.(21, 21) ?? 42;
    return {
      status: "success",
      stdout: `${request.language.toUpperCase()} prepared WASM demo\n21 + 21 = ${result}\n`,
      stderr: "",
      durationMs: performance.now() - start,
      diagnostics: ["prepared-demo", "source-editing-disabled"],
    };
  }

  cancel() {}
  dispose() {
    this.add = undefined;
  }
}
