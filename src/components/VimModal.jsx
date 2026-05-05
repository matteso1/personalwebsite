import React, { useEffect, useRef, useState } from "react";
import { writeFile } from "../lib/fs";

/**
 * VimModal — small but legitimate vim feel.
 *
 * Open from anywhere:
 *   window.dispatchEvent(new CustomEvent("vim:open", {
 *     detail: { path, content, readonly }
 *   }));
 *
 * Modes: NORMAL · INSERT · COMMAND.  ESC always returns to NORMAL.
 * Commands: :w :q :wq :q! :x
 *
 * On a successful write it dispatches:
 *   window.dispatchEvent(new CustomEvent("vim:saved", { detail: { path } }))
 */
export default function VimModal() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState("NORMAL");
  const [cmd, setCmd] = useState("");
  const [status, setStatus] = useState("");
  const [readonly, setReadonly] = useState(false);
  const [dirty, setDirty] = useState(false);
  const taRef = useRef(null);
  const cmdRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const onOpen = (e) => {
      const d = e.detail || {};
      setPath(d.path || "");
      setContent(d.content || "");
      setReadonly(!!d.readonly);
      setDirty(false);
      const startInsert = !!d.autoInsert && !d.readonly;
      setStatus(d.readonly
        ? "[readonly]  press : then q  (or just q) to quit"
        : startInsert
          ? "-- INSERT --  type away · esc to leave · :wq to save"
          : "press i to insert · : for commands · esc to leave a mode");
      setMode(startInsert ? "INSERT" : "NORMAL");
      setOpen(true);
    };
    window.addEventListener("vim:open", onOpen);
    return () => window.removeEventListener("vim:open", onOpen);
  }, []);

  // unified key handler — runs even when the textarea has focus,
  // because in NORMAL the textarea is readOnly so ":" wouldn't insert anyway.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (mode !== "NORMAL") {
          setMode("NORMAL");
          setCmd("");
          setStatus("");
          taRef.current?.blur();
          cmdRef.current?.blur();
        }
        return;
      }

      const tag = (e.target.tagName || "").toLowerCase();
      const inField = tag === "textarea" || tag === "input";

      if (mode === "NORMAL") {
        if (e.key === "i" && !readonly) {
          e.preventDefault();
          setMode("INSERT");
          setStatus("-- INSERT --");
        } else if (e.key === ":") {
          e.preventDefault();
          setMode("COMMAND");
          setCmd("");
          setStatus("");
        } else if (e.key === "q" && readonly) {
          e.preventDefault();
          close();
        } else if (e.key === "ZZ") {
          // unreachable; placeholder for future Z Z mapping
        }
        return;
      }

      // INSERT / COMMAND — let the active field handle keystrokes
      if (inField) return;
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, mode, readonly]);

  // focus per-mode
  useEffect(() => {
    if (!open) return;
    if (mode === "INSERT") requestAnimationFrame(() => taRef.current?.focus());
    else if (mode === "COMMAND") requestAnimationFrame(() => cmdRef.current?.focus());
    else {
      requestAnimationFrame(() => {
        const ae = document.activeElement;
        if (ae === taRef.current || ae === cmdRef.current) ae.blur();
        rootRef.current?.focus();
      });
    }
  }, [open, mode]);

  const close = () => {
    setOpen(false);
    setPath("");
    setContent("");
    setCmd("");
    setStatus("");
    setMode("NORMAL");
    setDirty(false);
  };

  const runCmd = async (raw) => {
    const c = raw.trim();
    setCmd("");
    if (!c) { setMode("NORMAL"); return; }
    const save  = c === "w" || c === "wq" || c === "x";
    const quit  = c === "q" || c === "wq" || c === "q!" || c === "x";
    const force = c === "q!";

    if (save) {
      if (readonly) {
        setStatus("E45: 'readonly' option is set (add ! to override)");
        setMode("NORMAL");
        return;
      }
      try {
        await writeFile({ path, content });
        setDirty(false);
        const lines = content.split("\n").length;
        setStatus(`"${path}" ${lines}L, ${content.length}C written`);
        window.dispatchEvent(new CustomEvent("vim:saved", { detail: { path } }));
      } catch (err) {
        setStatus(err.message || "write failed");
        setMode("NORMAL");
        return;
      }
    }
    if (quit) {
      if (dirty && !save && !force) {
        setStatus("E37: No write since last change (add ! to override)");
        setMode("NORMAL");
        return;
      }
      close();
      return;
    }
    if (!save && !quit) {
      setStatus(`E492: Not an editor command: ${c}`);
    }
    setMode("NORMAL");
  };

  if (!open) return null;

  const lineCount = (content.match(/\n/g) || []).length + 1;

  return (
    <div className="vim-root" role="dialog" aria-modal="true" tabIndex={-1} ref={rootRef}>
      <div className="vim-buffer-bar">
        <span className="vim-path">"{path || "[No Name]"}"</span>
        <span className="vim-flags">
          {readonly ? "[RO]" : dirty ? "[+]" : "[New File]"}
        </span>
      </div>

      <div className="vim-body">
        <div className="vim-gutter" aria-hidden>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          className="vim-textarea"
          value={content}
          onChange={(e) => {
            if (readonly || mode !== "INSERT") return;
            setContent(e.target.value);
            setDirty(true);
          }}
          onMouseDown={(e) => {
            // outside INSERT, don't let clicks steal focus
            if (mode !== "INSERT") e.preventDefault();
          }}
          tabIndex={mode === "INSERT" ? 0 : -1}
          readOnly={readonly || mode !== "INSERT"}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <div className="vim-status">
        {mode === "COMMAND" ? (
          <form
            style={{ display: "flex", flex: 1, alignItems: "center" }}
            onSubmit={(e) => { e.preventDefault(); runCmd(cmd); }}
          >
            <span className="vim-prompt">:</span>
            <input
              ref={cmdRef}
              className="vim-cmd"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </form>
        ) : (
          <>
            <span className={`vim-mode mode-${mode.toLowerCase()}`}>-- {mode} --</span>
            <span className="vim-status-msg">{status}</span>
            <span className="vim-pos">
              {path}
              {dirty ? "  [+]" : ""}
              &nbsp;&nbsp;{lineCount}L,{content.length}C
            </span>
          </>
        )}
      </div>
    </div>
  );
}
