// src/backend/common/utils/bounded-memory-store.spec.ts
import { BoundedMemoryStore } from "./bounded-memory-store";

describe("BoundedMemoryStore", () => {
  it("rejects a ceiling that is not a positive integer", () => {
    expect(() => new BoundedMemoryStore<string, string>(0)).toThrow(TypeError);
    expect(() => new BoundedMemoryStore<string, string>(-1)).toThrow(TypeError);
    expect(() => new BoundedMemoryStore<string, string>(1.5)).toThrow(
      TypeError,
    );
  });

  it("never grows past the ceiling, however many keys are written", () => {
    const store = new BoundedMemoryStore<string, number>(3);

    for (let i = 0; i < 1000; i++) {
      store.set(`key-${i}`, i);
    }

    expect(store.size).toBe(3);
  });

  it("evicts the least recently used key first", () => {
    const store = new BoundedMemoryStore<string, string>(3);
    store.set("a", "1");
    store.set("b", "2");
    store.set("c", "3");

    store.set("d", "4");

    expect(store.get("a")).toBeUndefined();
    expect([...store.keys()]).toEqual(["b", "c", "d"]);
  });

  it("a read refreshes recency, so the read key survives the next eviction", () => {
    const store = new BoundedMemoryStore<string, string>(3);
    store.set("a", "1");
    store.set("b", "2");
    store.set("c", "3");

    // Touch "a" — it is now the most recent, so "b" is the oldest.
    expect(store.get("a")).toBe("1");
    store.set("d", "4");

    expect(store.get("a")).toBe("1");
    expect(store.get("b")).toBeUndefined();
  });

  it("an overwrite refreshes recency rather than keeping the original position", () => {
    const store = new BoundedMemoryStore<string, string>(3);
    store.set("a", "1");
    store.set("b", "2");
    store.set("c", "3");

    store.set("a", "1-updated");
    store.set("d", "4");

    expect(store.get("a")).toBe("1-updated");
    expect(store.get("b")).toBeUndefined();
    expect(store.size).toBe(3);
  });

  it("returns undefined for a missing key without inserting it", () => {
    const store = new BoundedMemoryStore<string, string>(3);

    expect(store.get("nothing")).toBeUndefined();
    expect(store.size).toBe(0);
  });

  it("still behaves as a Map for delete and clear", () => {
    const store = new BoundedMemoryStore<string, string>(3);
    store.set("a", "1");
    store.set("b", "2");

    expect(store.delete("a")).toBe(true);
    expect(store.has("a")).toBe(false);

    store.clear();
    expect(store.size).toBe(0);
  });
});
