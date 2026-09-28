let pyodidePromise;
const PYODIDE_VERSION = "0.28.3";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(`${INDEX_URL}pyodide.js`);
      return self.loadPyodide({ indexURL: INDEX_URL });
    })();
    // A failed load must not poison every later run.
    pyodidePromise.catch(() => {
      pyodidePromise = undefined;
    });
  }
  return pyodidePromise;
}

// Drop Pyodide's own frames so the traceback starts at the learner's code.
function userTraceback(message) {
  const start = message.indexOf('  File "<exec>"');
  if (!message.startsWith("Traceback") || start < 0) return message;
  return `Traceback (most recent call last):\n${message.slice(start)}`;
}

self.onmessage = async (event) => {
  const { id, type, source, stdin = "" } = event.data;
  const started = performance.now();
  // Collected before running so output printed before an exception is kept.
  const stdout = [];
  const stderr = [];
  let globals;
  try {
    const pyodide = await getPyodide();
    if (type === "prepare") {
      self.postMessage({ id, type: "ready" });
      return;
    }
    const inputLines = String(stdin).split(/\r?\n/);
    pyodide.setStdout({ batched: (value) => stdout.push(value) });
    pyodide.setStderr({ batched: (value) => stderr.push(value) });
    pyodide.setStdin({ stdin: () => inputLines.shift() ?? "" });
    // Each run gets a fresh module namespace, like `python file.py`, so names
    // defined by a previous run do not leak into this one.
    globals = pyodide.globals.get("dict")();
    globals.set("__name__", "__main__");
    await pyodide.runPythonAsync(String(source), { globals });
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
      message: userTraceback(
        error instanceof Error ? error.message : String(error),
      ),
      stdout: stdout.join("\n"),
      stderr: stderr.join("\n"),
      durationMs: performance.now() - started,
    });
  } finally {
    globals?.destroy();
  }
};
