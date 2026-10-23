import { describe, expect, it } from "vitest";
import { addPreset, decodePresets, type CreativePreset } from "./presets";

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

  it("never interprets a legacy name as a recoverable creative prompt", () => {
    const records = decodePresets(JSON.stringify(["legacy preset", preset]));
    expect(records[0].legacy).toBe(true);
    expect(records[1].prompt).toBe(preset.prompt);
  });
});
