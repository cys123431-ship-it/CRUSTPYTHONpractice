import { useEffect, useRef, useState } from "react";
import type { Language } from "../../domain/curriculum/types";

interface Props {
  id: string;
  label: string;
  language: Language;
  value: string;
  readOnly?: boolean;
  onChange(value: string): void;
}

export default function CodeEditor({
  id,
  label,
  language,
  value,
  readOnly = false,
  onChange,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const changeHandler = useRef(onChange);
  const initialValue = useRef(value);
  changeHandler.current = onChange;
  const [enhanced, setEnhanced] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enhanced || !host.current) return;
    let view: import("@codemirror/view").EditorView | undefined;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      import("@codemirror/state"),
      import("@codemirror/view"),
      import("@codemirror/theme-one-dark"),
      language === "python"
        ? import("@codemirror/lang-python")
        : language === "rust"
          ? import("@codemirror/lang-rust")
          : import("@codemirror/lang-cpp"),
    ]).then(([state, cmView, theme, lang]) => {
      if (cancelled || !host.current) return;
      const languageExtension =
        "python" in lang
          ? lang.python()
          : "rust" in lang
            ? lang.rust()
            : lang.cpp();
      view = new cmView.EditorView({
        parent: host.current,
        state: state.EditorState.create({
          doc: initialValue.current,
          extensions: [
            languageExtension,
            theme.oneDark,
            cmView.EditorView.lineWrapping,
            cmView.EditorView.editable.of(!readOnly),
            cmView.EditorView.updateListener.of((update) => {
              if (update.docChanged)
                changeHandler.current(update.state.doc.toString());
            }),
          ],
        }),
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
      view?.destroy();
    };
  }, [enhanced, language, readOnly]);

  return (
    <div className="editor-shell">
      <div className="editor-toolbar">
        <label htmlFor={enhanced ? undefined : id}>{label}</label>
        {!enhanced && (
          <button
            type="button"
            className="text-button"
            onClick={() => setEnhanced(true)}
          >
            고급 편집기 켜기
          </button>
        )}
      </div>
      {loading && (
        <p role="status" className="editor-status">
          편집기를 불러오는 중…
        </p>
      )}
      {enhanced ? (
        <div ref={host} aria-label={label} className="cm-host" />
      ) : (
        <textarea
          id={id}
          aria-label={label}
          value={value}
          readOnly={readOnly}
          rows={10}
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
