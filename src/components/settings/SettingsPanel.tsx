import { useEffect, useRef, useState } from "react";
import { validateSnapshot } from "../../infrastructure/export-import/validateSnapshot";
import { progressRepository } from "../../infrastructure/indexeddb/progressRepository";

type Theme = "light" | "dark" | "system";

export default function SettingsPanel({ knownIds }: { knownIds: string[] }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(
    () => setTheme((localStorage.getItem("crp-theme") as Theme) || "system"),
    [],
  );
  const changeTheme = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("crp-theme", next);
    const dark =
      next === "dark" ||
      (next === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  };
  const exportData = async () => {
    const snapshot = await progressRepository.exportSnapshot();
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `crp-progress-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("진도 백업 파일을 만들었습니다.");
  };
  const importData = async (file?: File) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      await progressRepository.importSnapshot(
        validateSnapshot(parsed, new Set(knownIds)),
      );
      setMessage("진도를 안전하게 복원했습니다.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `복원 실패: ${error.message}`
          : "복원하지 못했습니다.",
      );
    }
    if (input.current) input.current.value = "";
  };
  const requestPersistence = async () => {
    const granted = await navigator.storage?.persist?.();
    setMessage(
      granted
        ? "브라우저가 이 사이트의 저장 공간을 유지하도록 설정했습니다."
        : "영구 저장이 허용되지 않았습니다. JSON 백업을 함께 보관하세요.",
    );
  };
  const reset = async () => {
    if (
      !confirm(
        "이 기기의 학습 진도와 초안을 모두 지울까요? 내보낸 JSON 백업은 영향을 받지 않습니다.",
      )
    )
      return;
    await progressRepository.reset();
    setMessage("이 기기의 학습 데이터를 초기화했습니다.");
  };
  return (
    <div className="settings-grid">
      <section className="card setting-card">
        <div>
          <h2>화면 테마</h2>
          <p>밝게, 어둡게 또는 기기 설정을 따릅니다.</p>
        </div>
        <select
          aria-label="화면 테마"
          value={theme}
          onChange={(e) => changeTheme(e.target.value as Theme)}
        >
          <option value="system">시스템</option>
          <option value="light">라이트</option>
          <option value="dark">다크</option>
        </select>
      </section>
      <section className="card setting-card">
        <div>
          <h2>진도 백업</h2>
          <p>IndexedDB에 저장된 진도·초안·복습 일정을 JSON으로 보관합니다.</p>
        </div>
        <div className="setting-actions">
          <button className="button secondary" onClick={exportData}>
            JSON 내보내기
          </button>
          <button
            className="button secondary"
            onClick={() => input.current?.click()}
          >
            JSON 가져오기
          </button>
          <input
            ref={input}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(e) => void importData(e.target.files?.[0])}
          />
        </div>
      </section>
      <section className="card setting-card">
        <div>
          <h2>저장 공간 보호</h2>
          <p>지원되는 브라우저에서 자동 정리 대상이 되지 않도록 요청합니다.</p>
        </div>
        <button className="button secondary" onClick={requestPersistence}>
          영구 저장 요청
        </button>
      </section>
      <section className="card setting-card danger-zone">
        <div>
          <h2>이 기기 초기화</h2>
          <p>진도와 초안을 삭제합니다. 되돌릴 수 없습니다.</p>
        </div>
        <button className="button danger" onClick={reset}>
          학습 데이터 삭제
        </button>
      </section>
      <p className="settings-status" role="status">
        {message}
      </p>
    </div>
  );
}
