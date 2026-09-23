let pyodidePromise;
const PYODIDE_VERSION = "0.28.3";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(`${INDEX_URL}pyodide.js`);
      return self.loadPyodide({ indexURL: INDEX_URL });
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const { id, type, source, stdin = "" } = event.data;
  const started = performance.now();
  try {
    const pyodide = await getPyodide();
    if (type === "prepare") {
      self.postMessage({ id, type: "ready" });
      return;
    }
    const stdout = [];
    const stderr = [];
    const inputLines = String(stdin).split(/\r?\n/);
    pyodide.setStdout({ batched: (value) => stdout.push(value) });
    pyodide.setStderr({ batched: (value) => stderr.push(value) });
    pyodide.setStdin({ stdin: () => inputLines.shift() ?? "" });
    await pyodide.runPythonAsync(String(source));
    self.postMessage({
      id,
      type: "result",
      stdout: stdout.join("\n"),
      stderr: stderr.join("\n"),
      durationMs: performance.now() - started,
    });
  } catch (error) {
    self.postMessage({
      id,
      type: "error",
      message: error instanceof Error ? error.message : String(error),
      durationMs: performance.now() - started,
    });
  }
};
