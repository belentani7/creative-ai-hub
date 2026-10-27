/** Local-only creative presets. No cloud calls or user-content telemetry. */
export type CreativeMedia = "Imagen" | "Vídeo" | "Voz" | "Música";

export interface CreativePreset {
  id: string;
  name: string;
  media: CreativeMedia;
  prompt: string;
  idea: string;
  style: string;
  framing: string;
  mood: string;
  negative: string;
  adultSafe: boolean;
  /** Old versions saved only a label and cannot restore an actual prompt. */
  legacy?: boolean;
}

const media: CreativeMedia[] = ["Imagen", "Vídeo", "Voz", "Música"];
const MAX_SAVED = 6;
const MAX_STORAGE_CHARS = 160_000;

export function decodePresets(json: string | null): CreativePreset[] {
  if (!json || json.length > MAX_STORAGE_CHARS) return [];
  let input: unknown;
  try {
    input = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(input)) return [];
  const result: CreativePreset[] = [];
  const usedIds = new Set<string>();
  // A damaged/legacy store can contain duplicate IDs. Keep every valid entry
  // independently addressable so deleting one preset never deletes another.
  const uniqueId = (raw: string): string => {
    const base = raw.slice(0, 120);
    let id = base;
    let suffix = 1;
    while (usedIds.has(id)) {
      const tail = `-${suffix++}`;
      id = `${base.slice(0, 120 - tail.length)}${tail}`;
    }
    usedIds.add(id);
    return id;
  };
  // Ignore malformed entries without hiding valid presets after them.
  for (const item of input) {
    if (result.length >= MAX_SAVED) break;
    if (typeof item === "string") {
      // Preserve the historical labels without claiming their missing bodies were saved.
      if (!item.trim()) continue;
      result.push({
        id: uniqueId(`legacy-${result.length}`), name: item.slice(0, 120), media: "Imagen",
        prompt: "", idea: "", style: "", framing: "", mood: "", negative: "",
        adultSafe: true, legacy: true,
      });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const p = item as Record<string, unknown>;
    if (typeof p.id !== "string" || !p.id.trim() || typeof p.name !== "string" || !p.name.trim() ||
        !media.includes(p.media as CreativeMedia) ||
        !["prompt", "idea", "style", "framing", "mood", "negative"].every(
          key => typeof p[key] === "string"
        ) || typeof p.adultSafe !== "boolean") continue;
    result.push({
      id: uniqueId(p.id), name: p.name.slice(0, 120),
      media: p.media as CreativeMedia, prompt: String(p.prompt).slice(0, 20_000),
      idea: String(p.idea).slice(0, 20_000), style: String(p.style).slice(0, 300),
      framing: String(p.framing).slice(0, 300), mood: String(p.mood).slice(0, 300),
      negative: String(p.negative).slice(0, 300), adultSafe: p.adultSafe,
      ...(p.legacy === true ? { legacy: true } : {}),
    });
  }
  return result;
}

export function addPreset(existing: CreativePreset[], preset: CreativePreset): CreativePreset[] {
  return [preset, ...existing.filter(item => item.id !== preset.id)].slice(0, MAX_SAVED);
}

/** A failed or oversized write must never be reported as durable storage. */
export function persistPresets(storage: Pick<Storage, "setItem">, presets: CreativePreset[]): boolean {
  try {
    const serialized = JSON.stringify(presets);
    if (serialized.length > MAX_STORAGE_CHARS) return false;
    // Never claim durable, recoverable storage if decoding would truncate or drop fields.
    const restored = decodePresets(serialized);
    const fields: (keyof CreativePreset)[] = [
      "id", "name", "media", "prompt", "idea", "style", "framing",
      "mood", "negative", "adultSafe", "legacy",
    ];
    if (restored.length !== presets.length || restored.some((item, index) =>
      fields.some(key => item[key] !== presets[index][key])
    )) return false;
    storage.setItem("lucid-presets", serialized);
    return true;
  } catch {
    return false;
  }
}
