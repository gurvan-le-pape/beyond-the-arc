// src/frontend/shared/utils/toSafeExternalUrl.spec.ts
import { describe, expect, it } from "vitest";

import { toSafeExternalUrl } from "./toSafeExternalUrl";

describe("toSafeExternalUrl", () => {
  it("passes an absolute http(s) URL through unchanged", () => {
    expect(toSafeExternalUrl("https://www.ffbb.com/club?id=4")).toBe(
      "https://www.ffbb.com/club?id=4",
    );
    expect(toSafeExternalUrl("http://example.org")).toBe("http://example.org");
  });

  it.each([
    "javascript:alert(document.cookie)",
    "JavaScript:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "ftp://example.org/file",
  ])("rejects a non-http scheme: %s", (url) => {
    expect(toSafeExternalUrl(url)).toBeUndefined();
  });

  it.each(["www.ffbb.com", "/players/7", "//evil.example", "not a url"])(
    "rejects a value that is not absolute, rather than repairing it: %s",
    (url) => {
      expect(toSafeExternalUrl(url)).toBeUndefined();
    },
  );

  it("treats an absent value as no link", () => {
    expect(toSafeExternalUrl(null)).toBeUndefined();
    expect(toSafeExternalUrl(undefined)).toBeUndefined();
    expect(toSafeExternalUrl("")).toBeUndefined();
  });
});
