import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  lsDir, readFile, rmFile, listAll, refreshIndex,
  normalizePath, dirname, isFsConfigured,
} from "../lib/fs";
import { useAuth } from "../lib/useAuth";

/**
 * /fs — terminal.  Builtins below.  Vim opens via the global VimModal.
 */

function relTime(iso) {
  const t = new Date(iso).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// resolvePath — `~` expands to the signed-in user's home (or /home if anon)
export function resolvePath(cwd, arg, handle = "") {
  if (!arg) return cwd;
  if (arg === "~") return handle ? "/home/" + handle : "/home";
  if (arg.startsWith("~/")) {
    const base = handle ? "/home/" + handle + "/" : "/home/";
    return normalizePath(base + arg.slice(2));
  }
  let base = arg.startsWith("/") ? arg : (cwd === "/" ? "" : cwd) + "/" + arg;
  const parts = base.split("/").filter(Boolean);
  const stack = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") stack.pop();
    else stack.push(p);
  }
  return "/" + stack.join("/");
}

const HELP = `nilsh — guestbook shell

getting started
  signin                 sign in with github (one click)
  vim ~/hello.txt        open the editor at /home/<your-gh-username>/hello.txt
  i                      enter insert mode, type stuff
  esc  →  :wq            write and quit — your file is now public
  ls /home               see everyone else's directories

every command
  signin | login         sign in with github
  signout | logout       end your session
  ls [path]              list a directory
  cd <path>              change directory  ( .. / ~ work )
  pwd                    print working directory
  cat <path>             print a file
  vim <path>             open editor; i to insert, esc, :wq to save
  edit <path>            alias for vim
  rm <path>              remove a file (admin only)
  tree                   list every file in the fs
  find <substr>          search paths
  graph                  open the obsidian-style file graph
  whoami                 print identity
  motd | readme          read /etc/motd or /etc/readme
  echo <text>            print text
  date                   print current time
  history                show command history
  clear                  clear the screen
  help                   this message

write rules: paths must look like /home/<handle>/<filename>. files are
immutable once written. handles 1..32 chars [a-z 0-9 _ -]. 4096 chars max.

keys: tab completes, ↑/↓ history, ctrl-l clear, ctrl-c cancel, ctrl-u clear line.`;

export default function FsPage() {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, isAdmin, signInWithGitHub, signOut } = useAuth();
  const termRef = useRef(null);
  const inputRef = useRef(null);
  const idRef = useRef(0);
  const bootedRef = useRef(false);   // guards StrictMode double-fire on the bootstrap effect

  const initialCwd = useMemo(() => {
    const rawHash = loc.hash.slice(1);
    // supabase OAuth dumps `#access_token=...&...` on return — never a path.
    if (!rawHash || /(^|&)(access_token|error|provider_token|refresh_token)=/.test(rawHash)) {
      if (rawHash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
      return "/";
    }
    return normalizePath(decodeURIComponent(rawHash));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [cwd, setCwd] = useState("/");
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);

  // your handle is your github handle — period. anonymous users are "guest" and can't write.
  const handle = (user?.user_metadata?.user_name || "guest").toLowerCase();

  const push = (kind, content) => {
    setLines((ls) => [...ls, { id: ++idRef.current, kind, content }]);
  };

  // banner + warm cache + handle deep-link
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    push("ok", `nilsh v0.3 — guestbook shell · type \`help\` · \`graph\` for the file graph`);
    if (!user) {
      push("dim", "tip: run  `signin`  to sign in with github — then  `vim ~/hello.txt`");
    } else {
      push("dim", `signed in as ${handle}${isAdmin ? " (admin)" : ""} — your home is /home/${handle}/`);
    }
    if (!isFsConfigured()) {
      push("err", "filesystem offline (supabase not configured).");
      return;
    }
    // pre-fetch the index so the first `ls` is instant
    listAll().catch(() => {});
    if (initialCwd && initialCwd !== "/") {
      // if it points at a file, cat it; else cd + ls
      (async () => {
        const f = await readFile(initialCwd);
        if (f) {
          await execute(`cat ${initialCwd}`, "/", true);
        } else {
          await execute(`cd ${initialCwd}`, "/", true);
          await execute(`ls`, initialCwd, true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh index if vim wrote — next ls reflects it
  useEffect(() => {
    const onSaved = () => refreshIndex().catch(() => {});
    window.addEventListener("vim:saved", onSaved);
    return () => window.removeEventListener("vim:saved", onSaved);
  }, []);

  // keep the active prompt centered in the viewport as content grows
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    // rAF so we measure after the DOM has the new line
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [lines]);

  const prompt = (p) => ({ user: handle, host: "nilsmatteson.com", cwd: p });

  const execute = async (raw, baseCwd, silent = false) => {
    const cmdLine = raw.trim();
    if (!cmdLine) return;
    let curCwd = baseCwd ?? cwd;
    if (!silent) push("cmd", { ps1: prompt(curCwd), text: cmdLine });

    // semicolon chain
    if (cmdLine.includes(";") && !cmdLine.startsWith("echo")) {
      for (const part of cmdLine.split(";")) await execute(part.trim(), curCwd, true);
      return;
    }

    const [verb, ...rest] = cmdLine.split(/\s+/);
    const arg = rest.join(" ");
    const v = verb.toLowerCase();

    try {
      switch (v) {
        case "help": case "?": push("out", HELP); break;
        case "clear": case "cls": setLines([]); break;
        case "pwd": push("out", curCwd); break;
        case "whoami": {
          if (isAdmin) push("out", `${handle}  (admin · github)`);
          else if (user) push("out", `${handle}  (github · home: /home/${handle}/)`);
          else push("out", `guest  (not signed in — run: signin)`);
          break;
        }

        case "signin": case "login": {
          if (user) { push("dim", `already signed in as ${handle}`); break; }
          push("dim", "redirecting to github…");
          try {
            const res = await signInWithGitHub("/fs");
            if (res?.error) {
              push("err", `signin failed: ${res.error.message}`);
            } else if (res?.data?.url) {
              window.location.assign(res.data.url);
            }
          } catch (e) {
            push("err", `signin failed: ${e.message || e}`);
          }
          break;
        }

        case "signout": case "logout": {
          if (!user) { push("dim", "not signed in"); break; }
          push("dim", `signing out ${handle}…`);
          await signOut();
          break;
        }
        case "date": push("out", new Date().toString()); break;
        case "echo": push("out", arg); break;
        case "history": push("out", history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`).join("\n") || "(none)"); break;

        case "motd":   await execute(`cat /etc/motd`,   curCwd, true); break;
        case "readme": await execute(`cat /etc/readme`, curCwd, true); break;

        case "graph": case "g": {
          push("dim", "opening graph…");
          nav("/fs/graph");
          break;
        }

        case "ls": case "dir": {
          if (!isFsConfigured()) { push("err", "filesystem offline"); break; }
          const target = resolvePath(curCwd, arg, handle);
          // is target actually a file?
          const f = await readFile(target);
          if (f) {
            push("out", { type: "ls", target, rows: [{ kind: "file", name: target.split("/").pop(), author: f.author, when: relTime(f.created_at) }] });
            break;
          }
          const t = await lsDir(target);
          if (!t.dirs.length && !t.files.length) { push("dim", "(empty)"); break; }
          const rows = [
            ...t.dirs.map((d) => ({ kind: "dir", name: d + "/" })),
            ...t.files.map((f) => ({
              kind: "file",
              name: f.path.split("/").pop(),
              author: f.author,
              when: relTime(f.created_at),
            })),
          ];
          push("out", { type: "ls", target, rows });
          break;
        }

        case "cd": {
          const target = resolvePath(curCwd, arg || "/", handle);
          if (target === "/") { setCwd("/"); break; }
          // reject if it's a file
          const f = await readFile(target);
          if (f) { push("err", `cd: not a directory: ${target}`); break; }
          // does any path live under it?
          const all = await listAll();
          const prefix = target + "/";
          const exists = all.some((r) => r.path === target || r.path.startsWith(prefix));
          if (!exists) { push("err", `cd: no such directory: ${target}`); break; }
          setCwd(target);
          break;
        }

        case "cat": case "less": case "more": {
          if (!arg) { push("err", "usage: cat <path>"); break; }
          if (!isFsConfigured()) { push("err", "filesystem offline"); break; }
          const target = resolvePath(curCwd, arg, handle);
          const f = await readFile(target);
          if (!f) { push("err", `cat: ${target}: No such file or directory`); break; }
          push("out", { type: "file", path: target, author: f.author, created_at: f.created_at, content: f.content });
          break;
        }

        case "vim": case "vi": case "nano": case "edit": case "e": {
          if (!arg) { push("err", `usage: ${v} <path>`); break; }
          if (!isFsConfigured()) { push("err", "filesystem offline"); break; }
          const target = resolvePath(curCwd, arg, handle);
          const existing = await readFile(target);
          // brand-new buffer? require sign-in (writing won't work otherwise)
          if (!existing && !user) {
            push("err", `vim: sign in first to write files — run: signin`);
            break;
          }
          window.dispatchEvent(new CustomEvent("vim:open", {
            detail: {
              path: target,
              content: existing?.content || "",
              readonly: !!existing,
              autoInsert: !existing,
            },
          }));
          push("dim", existing
            ? `${target}: opened readonly (files are immutable once written)`
            : `${target}: new buffer — type to insert, esc, :wq to save`);
          break;
        }

        case "rm": case "del": {
          if (!isAdmin) { push("err", "rm: permission denied"); break; }
          if (!arg) { push("err", "usage: rm <path>"); break; }
          const target = resolvePath(curCwd, arg, handle);
          await rmFile(target);
          push("ok", `removed ${target}`);
          break;
        }

        case "tree": {
          if (!isFsConfigured()) { push("err", "filesystem offline"); break; }
          const all = await listAll();
          if (!all.length) { push("dim", "(empty)"); break; }
          const w = Math.max(...all.map((r) => r.path.length));
          push("out", all.map((r) => `  ${r.path.padEnd(w + 2)}${(r.author).padEnd(14)}${relTime(r.created_at)}`).join("\n"));
          break;
        }

        case "find": case "grep": {
          if (!arg) { push("err", `usage: ${v} <substring>`); break; }
          const all = await listAll();
          const hits = all.filter((r) => r.path.toLowerCase().includes(arg.toLowerCase()));
          if (!hits.length) push("dim", "(no matches)");
          else push("out", hits.map((r) => r.path).join("\n"));
          break;
        }

        case "exit": case "quit": case ":q":
          nav("/"); break;

        case "sudo":
          push("err", "nils is not in the sudoers file. This incident will be reported.");
          break;

        case "open": {
          // open a known site path
          if (!arg) { push("err", "usage: open </writing|/|/fs/graph|...>"); break; }
          nav(arg);
          break;
        }

        default:
          push("err", `${verb}: command not found  (try 'help')`);
      }
    } catch (e) {
      push("err", e.message || String(e));
    }
  };

  // tab completion against the in-memory index
  const completePath = async () => {
    const m = input.match(/^(\S+)(\s+)(.*)$/);
    if (!m) return; // tab on bare verb: noop for now
    const verb = m[1], spc = m[2], partial = m[3];
    const lastSlash = partial.lastIndexOf("/");
    const partialDir = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : "";
    const partialBase = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;
    const parentAbs = partialDir
      ? resolvePath(cwd, partialDir, handle)
      : cwd;
    const t = await lsDir(parentAbs);
    const cands = [
      ...t.dirs.filter((d) => d.startsWith(partialBase)).map((d) => d + "/"),
      ...t.files.filter((f) => f.path.split("/").pop().startsWith(partialBase)).map((f) => f.path.split("/").pop()),
    ];
    if (!cands.length) return;
    if (cands.length === 1) {
      setInput(`${verb}${spc}${partialDir}${cands[0]}`);
      return;
    }
    // common prefix
    const common = cands.reduce((a, b) => {
      let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return a.slice(0, i);
    });
    if (common.length > partialBase.length) {
      setInput(`${verb}${spc}${partialDir}${common}`);
    }
    push("dim", cands.join("  "));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const raw = input;
    setInput("");
    setHIdx(-1);
    if (raw.trim()) setHistory((h) => [...h, raw]);
    await execute(raw);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const ni = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(ni); setInput(history[ni] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const ni = hIdx + 1;
      if (ni >= history.length) { setHIdx(-1); setInput(""); }
      else { setHIdx(ni); setInput(history[ni]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      completePath();
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault(); setLines([]);
    } else if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault(); setInput("");
    } else if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      if (window.getSelection?.().toString()) return; // let copy work
      e.preventDefault();
      push("cmd", { ps1: prompt(cwd), text: input + "^C" });
      setInput("");
    } else if (e.ctrlKey && (e.key === "d" || e.key === "D") && !input) {
      e.preventDefault();
      nav("/");
    }
  };

  const Ps1 = ({ p }) => (
    <span className="ps1">
      <span className="host">{p.user}@{p.host}</span>
      <span className="end">:</span>
      <span className="cwd">{p.cwd}</span>
      <span className="end">$ </span>
    </span>
  );

  const renderLine = (l) => {
    if (l.kind === "cmd" && typeof l.content === "object") {
      return (
        <div className="line cmd">
          <Ps1 p={l.content.ps1} />{l.content.text}
        </div>
      );
    }
    const c = l.content;
    if (typeof c === "object" && c?.type === "ls") {
      return (
        <div className="line out">
          {c.rows.map((r, i) => (
            <div key={i}>
              {r.kind === "dir"
                ? <span className="ls-dir">{r.name.padEnd(28)}</span>
                : (
                  <>
                    <span className="ls-file">{r.name.padEnd(28)}</span>
                    <span className="ls-meta">{(r.author || "").padEnd(14)}{r.when}</span>
                  </>
                )}
            </div>
          ))}
        </div>
      );
    }
    if (typeof c === "object" && c?.type === "file") {
      return (
        <div className="line out">
          <div className="ls-meta">── {c.path}  ·  {c.author}  ·  {new Date(c.created_at).toLocaleString()} ──</div>
          <div style={{ whiteSpace: "pre-wrap", color: "var(--ink)" }}>{c.content}</div>
        </div>
      );
    }
    return <div className={`line ${l.kind}`}>{c}</div>;
  };

  return (
    <div className="q-page">
      <h1 className="q-name" style={{ marginBottom: 4 }}>
        /fs<em>.</em>
      </h1>
      <p className="q-tagline" style={{ marginBottom: 16, maxWidth: "60ch" }}>
        A small public filesystem. Anyone can write a file under{" "}
        <code style={{ color: "var(--c-cyan)" }}>/home/&lt;handle&gt;/</code>. Files are immutable.
        Try <code>help</code>, or <code>graph</code> for the obsidian view.
      </p>

      <div
        className="q-term"
        ref={termRef}
        onClick={(e) => {
          // refocus only if user didn't try to select text
          if (window.getSelection?.().toString()) return;
          inputRef.current?.focus();
        }}
      >
        <div className="q-term-titlebar">
          <span className={`dot ${isFsConfigured() ? "live" : ""}`} />
          <span>nilsh — {handle}@nilsmatteson.com</span>
          <span style={{ marginLeft: "auto" }}>{cwd}</span>
        </div>

        {lines.map((l) => <div key={l.id}>{renderLine(l)}</div>)}

        <form className="input-row" onSubmit={onSubmit}>
          <Ps1 p={prompt(cwd)} />
          <input
            ref={inputRef}
            className="q-term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
