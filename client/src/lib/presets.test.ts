import { describe, expect, it } from "vitest";
import { addPreset, decodePresets, persistPresets, type CreativePreset } from "./presets";

const preset: CreativePreset = {
  id: "p1", name: "Imagen · 23 oct", media: "Imagen",
  prompt: "Warm studio portrait, adult subject", idea: "Editorial portrait",
  style: "Cinematic", framing: "9:16", mood: "Quiet",
  negative: "watermark", adultSafe: true,
};

describe("creative preset storage", () => {
  it("recovers the complete prompt and media configuration", () => {
    expect(decodePresets(JSON.stringify([preset]))).toEqual([preset]);
  });

  it("preserves old name-only records without inventing lost prompts", () => {
    const old = decodePresets(JSON.stringify(["Imagen · 01 sep"]));
    expect(old).toHaveLength(1);
    expect(old[0].legacy).toBe(true);
    expect(old[0].prompt).toBe("");
  });

  it("rejects corrupted and hostile storage shapes without crashing", () => {
    expect(decodePresets("not json")).toEqual([]);
    expect(decodePresets('{"not":"an array"}')).toEqual([]);
    expect(decodePresets(JSON.stringify([null, 123, { ...preset, prompt: null }]))).toEqual([]);
    expect(decodePresets("x".repeat(160001))).toEqual([]);
  });

  it("keeps a maximum of six presets with latest first", () => {
    const generated = Array.from({ length: 8 }, (_, n) => ({ ...preset, id: String(n) }));
    const list = generated.reduce<CreativePreset[]>((current, item) => addPreset(current, item), []);
    expect(list.map(item => item.id)).toEqual(["7", "6", "5", "4", "3", "2"]);
    expect(addPreset(list, { ...preset, id: "4", name: "Updated" }).filter(p => p.id === "4")).toHaveLength(1);
  });

  it("persists and decodes a full preset without dropping editable fields", () => {
    let stored = "";
    const ok = persistPresets({ setItem: (key, value) => {
      expect(key).toBe("lucid-presets");
      stored = value;
    } }, [preset]);
    expect(ok).toBe(true);
    expect(decodePresets(stored)).toEqual([preset]);
  });

  it("reports storage permission/quota failure instead of claiming persistence", () => {
    expect(persistPresets({ setItem: () => { throw new Error("QuotaExceededError"); } }, [preset])).toBe(false);
  });

  it("rejects writes too large to be read back", () => {
    let writes = 0;
    const huge = { ...preset, prompt: "x".repeat(160001) };
    expect(persistPresets({ setItem: () => { writes++; } }, [huge])).toBe(false);
    expect(writes).toBe(0);
  });

  it("never interprets a legacy name as a recoverable creative prompt", () => {
    const records = decodePresets(JSON.stringify(["legacy preset", preset]));
    expect(records[0].legacy).toBe(true);
    expect(records[1].prompt).toBe(preset.prompt);
  });
  it("keeps name-only legacy entries non-restorable after an explicit save", () => {
    const legacy = decodePresets(JSON.stringify(["old name only"]));
    let stored = "";
    expect(persistPresets({ setItem: (_key, value) => { stored = value; } }, legacy)).toBe(true);
    const restored = decodePresets(stored);
    expect(restored).toHaveLength(1);
    expect(restored[0].legacy).toBe(true);
    expect(restored[0].prompt).toBe("");
  });

  it("refuses a successful-save message for data that reload would truncate", () => {
    let writes = 0;
    const storage = { setItem: () => { writes++; } };
    expect(persistPresets(storage, [{ ...preset, prompt: "x".repeat(20_001) }])).toBe(false);
    expect(persistPresets(storage, [{ ...preset, name: "n".repeat(121) }])).toBe(false);
    expect(writes).toBe(0);
  });
  it("recovers valid presets even when earlier stored entries are malformed", () => {
    const records = decodePresets(JSON.stringify([null, 123, false, {}, [], null, preset]));
    expect(records).toEqual([preset]);
  });

  it("keeps duplicate stored IDs independently removable without losing prompts", () => {
    const records = decodePresets(JSON.stringify([
      preset, { ...preset, name: "Second", prompt: "Second prompt" },
    ]));
    expect(records).toHaveLength(2);
    expect(records[0].id === records[1].id).toBe(false);
    const remaining = records.filter(item => item.id !== records[0].id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].prompt).toBe("Second prompt");
    let stored = "";
    expect(persistPresets({ setItem: (_key, value) => { stored = value; } }, records)).toBe(true);
    expect(decodePresets(stored)).toEqual(records);
  });

  it("does not confuse historical labels with modern IDs", () => {
    const records = decodePresets(JSON.stringify(["old", { ...preset, id: "legacy-0" }]));
    expect(records).toHaveLength(2);
    expect(records[0].id === records[1].id).toBe(false);
    expect(records[0].legacy).toBe(true);
    expect(records[1].prompt).toBe(preset.prompt);
  });

});
