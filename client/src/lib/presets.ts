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
  for (const item of input.slice(0, MAX_SAVED)) {
    if (typeof item === "string") {
      // Preserve the historical labels without claiming their missing bodies were saved.
      if (!item.trim()) continue;
      result.push({
        id: `legacy-${result.length}`, name: item.slice(0, 120), media: "Imagen",
        prompt: "", idea: "", style: "", framing: "", mood: "", negative: "",
        adultSafe: true, legacy: true,
      });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const p = item as Record<string, unknown>;
    if (typeof p.id !== "string" || !p.id || typeof p.name !== "string" ||
        !media.includes(p.media as CreativeMedia) ||
        !["prompt", "idea", "style", "framing", "mood", "negative"].every(
          key => typeof p[key] === "string"
        ) || typeof p.adultSafe !== "boolean") continue;
    result.push({
      id: p.id.slice(0, 120), name: p.name.slice(0, 120),
      media: p.media as CreativeMedia, prompt: String(p.prompt).slice(0, 20_000),
      idea: String(p.idea).slice(0, 20_000), style: String(p.style).slice(0, 300),
      framing: String(p.framing).slice(0, 300), mood: String(p.mood).slice(0, 300),
      negative: String(p.negative).slice(0, 300), adultSafe: p.adultSafe,
    });
  }
  return result;
}

export function addPreset(existing: CreativePreset[], preset: CreativePreset): CreativePreset[] {
  return [preset, ...existing.filter(item => item.id !== preset.id)].slice(0, MAX_SAVED);
}
