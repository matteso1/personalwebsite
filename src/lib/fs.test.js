import { describe, it, expect } from "vitest";
import { normalizePath, dirname, basename, isGuestPath, extractHandle } from "./fs";

describe("normalizePath", () => {
  it("returns / for empty input", () => {
    expect(normalizePath("")).toBe("/");
    expect(normalizePath(null)).toBe("/");
    expect(normalizePath(undefined)).toBe("/");
  });
  it("prepends /", () => {
    expect(normalizePath("home/alice")).toBe("/home/alice");
  });
  it("collapses repeated slashes", () => {
    expect(normalizePath("///home//alice////hello.txt")).toBe("/home/alice/hello.txt");
  });
  it("strips a trailing slash unless it's just /", () => {
    expect(normalizePath("/home/alice/")).toBe("/home/alice");
    expect(normalizePath("/")).toBe("/");
  });
  it("trims whitespace", () => {
    expect(normalizePath("  /home/alice  ")).toBe("/home/alice");
  });
});

describe("dirname / basename", () => {
  it("dirname of root is root", () => {
    expect(dirname("/")).toBe("/");
  });
  it("dirname of a top-level path is /", () => {
    expect(dirname("/etc")).toBe("/");
  });
  it("dirname of nested path is parent", () => {
    expect(dirname("/home/alice/hello.txt")).toBe("/home/alice");
  });
  it("basename of root is empty", () => {
    expect(basename("/")).toBe("");
  });
  it("basename of file is its name", () => {
    expect(basename("/home/alice/hello.txt")).toBe("hello.txt");
  });
});

describe("isGuestPath", () => {
  it("matches the canonical /home/<handle>/<file> shape", () => {
    expect(isGuestPath("/home/alice/hello.txt")).toBe(true);
    expect(isGuestPath("/home/a-b_c/file_v2.md")).toBe(true);
  });
  it("rejects /etc paths and arbitrary paths", () => {
    expect(isGuestPath("/etc/motd")).toBe(false);
    expect(isGuestPath("/home/alice")).toBe(false);
    expect(isGuestPath("/home/alice/sub/hello.txt")).toBe(false);
    expect(isGuestPath("/")).toBe(false);
  });
  it("rejects uppercase, paths with bad chars", () => {
    expect(isGuestPath("/home/Alice/hello.txt")).toBe(false);
    expect(isGuestPath("/home/alice/hello world.txt")).toBe(false);
  });
  it("rejects handles longer than 32 chars", () => {
    expect(isGuestPath("/home/" + "a".repeat(33) + "/x.txt")).toBe(false);
  });
});

describe("extractHandle", () => {
  it("pulls the handle out of a /home path", () => {
    expect(extractHandle("/home/alice/hello.txt")).toBe("alice");
  });
  it("returns null for non-/home paths", () => {
    expect(extractHandle("/etc/motd")).toBeNull();
    expect(extractHandle("/")).toBeNull();
  });
});
