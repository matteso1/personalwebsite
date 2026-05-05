import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lsDir, readFile, normalizePath, isFsConfigured, rmFile } from "../lib/fs";
import { useAuth } from "../lib/useAuth";

const COMMANDS = [
  { keys: ["", "i", "home", "index"], desc: "go home", run: (n) => n("/") },
  { keys: ["w", "writing", "blog"], desc: "writing", run: (n) => n("/writing") },
  { keys: ["fs", "tree"], desc: "browse filesystem", run: (n) => n("/fs") },
  { keys: ["motd"], desc: "read /etc/motd", run: (n) => n("/fs#" + encodeURIComponent("/etc/motd")) },
  { keys: ["readme"], desc: "read /etc/readme", run: (n) => n("/fs#" + encodeURIComponent("/etc/readme")) },
  { keys: ["e", "edit"], desc: "edit <path>  — opens vim", run: null, takesArg: true },
  { keys: ["cat"], desc: "cat <path>", run: null, takesArg: true },
  { keys: ["ls"], desc: "ls [path]", run: null, takesArg: true },
  { keys: ["rm"], desc: "rm <path> (admin)", run: null, takesArg: true },
  { keys: ["pwd"], desc: "print path", run: null, takesArg: false },
  { keys: ["gh", "github"], desc: "github profile", run: () => (window.location.href = "https://github.com/matteso1") },
  { keys: ["t", "thaw"], desc: "thaw.sh", run: () => (window.location.href = "https://thaw.sh") },
  { keys: ["r", "resume", "cv"], desc: "resume.pdf", run: () => window.open("/resume.pdf", "_blank") },
  { keys: ["m", "mail", "email"], desc: "send mail", run: () => (window.location.href = "mailto:nilsmatteson@icloud.com") },
  { keys: ["li", "linkedin"], desc: "linkedin", run: () => (window.location.href = "https://www.linkedin.com/in/nils-matteson-198326249/") },
  { keys: ["h", "help", "?"], desc: "list commands", run: null },
  { keys: ["q", "quit"], desc: "close palette", run: null },
];

function findCmd(verb) {
  const v = verb.toLowerCase();
  return COMMANDS.find((c) => c.keys.includes(v));
}

function suggest(input) {
  const q = input.trim().toLowerCase();
  // if input has whitespace, the verb is locked in — don't show suggestion list
  if (/\s/.test(q)) return [];
  if (!q) return COMMANDS.filter((c) => !c.keys.includes(""));
  return COMMANDS.filter((c) => c.keys.some((k) => k.startsWith(q)));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const [sel, setSel] = useState(0);
  const [echo, setEcho] = useState("");
  const inputRef = useRef(null);
  const nav = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (open) return;
      if (e.key === ":" || e.key === "/") {
        e.preventDefault();
        setOpen(true);
        setVal("");
        setSel(0);
        setEcho("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const close = () => {
    setOpen(false);
    setVal("");
    setSel(0);
    setEcho("");
  };

  const filtered = suggest(val);

  const help = () => {
    const verbs = COMMANDS.flatMap((c) => c.keys).filter(Boolean).join(" · ");
    setEcho(verbs);
  };

  const run = async (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return close();
    const sp = trimmed.indexOf(" ");
    const verb = sp === -1 ? trimmed : trimmed.slice(0, sp);
    const arg = sp === -1 ? "" : trimmed.slice(sp + 1).trim();

    const cmd = findCmd(verb);
    if (!cmd) {
      setEcho(`E492: Not an editor command: ${verb}`);
      return;
    }
    if (cmd.keys.includes("q")) return close();
    if (cmd.keys.includes("h")) return help();
    if (cmd.keys.includes("pwd")) {
      setEcho(window.location.pathname + window.location.hash);
      return;
    }

    // filesystem verbs
    if (cmd.keys.includes("e")) {
      if (!arg) return setEcho("usage: :e /home/<handle>/<file>");
      if (!isFsConfigured()) return setEcho("filesystem offline");
      const p = normalizePath(arg);
      try {
        const f = await readFile(p);
        if (f) {
          window.dispatchEvent(new CustomEvent("vim:open", { detail: { path: p, content: f.content, readonly: true } }));
        } else {
          window.dispatchEvent(new CustomEvent("vim:open", { detail: { path: p, content: "", readonly: false } }));
        }
        close();
      } catch (e) {
        setEcho(e.message || "error");
      }
      return;
    }
    if (cmd.keys.includes("cat")) {
      if (!arg) return setEcho("usage: :cat <path>");
      nav("/fs#" + encodeURIComponent(normalizePath(arg)));
      close();
      return;
    }
    if (cmd.keys.includes("ls")) {
      if (!isFsConfigured()) return setEcho("filesystem offline");
      const p = normalizePath(arg || "/");
      try {
        const t = await lsDir(p);
        const items = [...t.dirs.map((d) => d + "/"), ...t.files.map((f) => f.path.split("/").pop())];
        setEcho(items.length ? items.join("  ") : "(empty)");
      } catch (e) {
        setEcho(e.message || "error");
      }
      return;
    }
    if (cmd.keys.includes("rm")) {
      if (!isAdmin) return setEcho("E: permission denied");
      if (!arg) return setEcho("usage: :rm <path>");
      try {
        await rmFile(normalizePath(arg));
        setEcho(`removed ${arg}`);
      } catch (e) {
        setEcho(e.message || "error");
      }
      return;
    }

    if (cmd.run) {
      cmd.run(nav);
      close();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") return close();
    const showingList = filtered.length > 0 && val && !/\s/.test(val);
    if (showingList && e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); return; }
    if (showingList && e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); return; }
    if (showingList && e.key === "Tab") {
      e.preventDefault();
      const c = filtered[sel];
      if (c) {
        const k = c.keys.find(Boolean) || "";
        setVal(c.takesArg ? k + " " : k);
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showingList && filtered[sel] && !val.includes(" ") && filtered[sel].keys.includes(val.trim().toLowerCase()) === false) {
        // accept top suggestion when user hasn't typed full verb
        const c = filtered[sel];
        const k = c.keys.find(Boolean) || "";
        if (c.takesArg) { setVal(k + " "); return; }
        run(k);
        return;
      }
      run(val);
    }
  };

  return (
    <>
      {!open && (
        <div className="q-cmd-hint">
          <kbd>:</kbd>commands
        </div>
      )}
      {open && (
        <>
          <div
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 55, background: "transparent" }}
          />
          <div className="q-cmd-bar">
            {filtered.length > 0 && val && !/\s/.test(val) && (
              <div className="q-cmd-list">
                {filtered.slice(0, 8).map((c, i) => (
                  <div
                    key={c.keys.join("/")}
                    className="q-cmd-item"
                    data-sel={i === sel ? "true" : undefined}
                    onClick={() => {
                      const k = c.keys.find(Boolean) || "";
                      if (c.takesArg) { setVal(k + " "); inputRef.current?.focus(); }
                      else run(k);
                    }}
                    onMouseEnter={() => setSel(i)}
                  >
                    <span className="key">:{c.keys.find(Boolean)}{c.takesArg ? " …" : ""}</span>
                    <span className="desc">{c.desc}</span>
                    <span className="desc">{c.keys.filter(Boolean).slice(1).join(" · ")}</span>
                  </div>
                ))}
              </div>
            )}
            <span className="prompt">:</span>
            <input
              ref={inputRef}
              value={val}
              onChange={(e) => { setVal(e.target.value); setSel(0); setEcho(""); }}
              onKeyDown={onKeyDown}
              placeholder="e /home/you/hello.txt · ls · cat · fs · writing · help"
              spellCheck={false}
              autoComplete="off"
            />
            {echo && <span className="echo">{echo}</span>}
          </div>
        </>
      )}
    </>
  );
}
