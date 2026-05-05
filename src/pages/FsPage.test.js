import { describe, it, expect } from "vitest";
import { resolvePath } from "./FsPage";

describe("resolvePath", () => {
  it("returns cwd for empty arg", () => {
    expect(resolvePath("/home/alice", "")).toBe("/home/alice");
  });
  it("absolute paths win", () => {
    expect(resolvePath("/home/alice", "/etc/motd")).toBe("/etc/motd");
  });
  it("relative paths join cwd", () => {
    expect(resolvePath("/home/alice", "hello.txt")).toBe("/home/alice/hello.txt");
  });
  it("..  ascends", () => {
    expect(resolvePath("/home/alice", "..")).toBe("/home");
    expect(resolvePath("/home/alice/sub", "../..")).toBe("/home");
  });
  it("..  from root stays at root", () => {
    expect(resolvePath("/", "..")).toBe("/");
  });
  it(".  is a no-op", () => {
    expect(resolvePath("/home/alice", "./hello.txt")).toBe("/home/alice/hello.txt");
  });
  it("~ alone goes to /home/<handle> when handle is set", () => {
    expect(resolvePath("/", "~", "alice")).toBe("/home/alice");
  });
  it("~ alone goes to /home when no handle", () => {
    expect(resolvePath("/", "~")).toBe("/home");
  });
  it("~/foo expands under handle", () => {
    expect(resolvePath("/etc", "~/hello.txt", "alice")).toBe("/home/alice/hello.txt");
  });
  it("collapses repeated slashes via normalize", () => {
    expect(resolvePath("/", "/home//alice///x")).toBe("/home/alice/x");
  });
});
