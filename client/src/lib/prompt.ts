// Lógica pura del escritorio de prompts (LUCID/LAB).
// Extraída de Home.tsx para poder testearla sin DOM (vitest, client/src/lib/prompt.test.ts)
// y para reutilizarla desde scripts/export.mjs.

export type MediaType = "Imagen" | "Vídeo" | "Voz" | "Música";

export type ToolCategory = MediaType | "Editor";

export type Tool = {
  name: string;
  category: ToolCategory;
  descriptor: string;
  detail: string;
  badge: string;
  badgeTone: "mint" | "lilac" | "peach" | "blue";
  url: string;
  note: string;
};

const SAFETY_ADULT = "adult-only subject, clear consent, tasteful and non-explicit treatment";
const SAFETY_GENERAL = "keep the content suitable for a general audience";

export type ComposePromptParams = {
  media: MediaType;
  idea: string;
  style: string;
  framing: string;
  mood: string;
  negative: string;
  adultSafe: boolean;
  /** Idea por defecto del tipo de medio; se usa cuando `idea` llega vacía. */
  fallbackIdea?: string;
};

/** Compone el prompt final a partir del brief del usuario. Misma salida que la app. */
export function composePrompt({
  media,
  idea,
  style,
  framing,
  mood,
  negative,
  adultSafe,
  fallbackIdea = "",
}: ComposePromptParams): string {
  const safety = adultSafe ? SAFETY_ADULT : SAFETY_GENERAL;
  const base = idea.trim() || fallbackIdea;
  return `${base}. Format: ${media}. Style: ${style}. Framing and technical direction: ${framing}. Mood: ${mood}. ${safety}. Build a coherent, production-ready result with precise details, lighting, texture and subject continuity. Avoid: ${negative}.`;
}

/** Coincidencia de búsqueda libre sobre nombre, categoría y descriptor de una herramienta. */
export function matchesToolQuery(tool: Tool, search: string): boolean {
  const query = search.toLowerCase().trim();
  return !query || `${tool.name} ${tool.category} ${tool.descriptor}`.toLowerCase().includes(query);
}

/** Filtro del directorio: herramientas que coinciden con la búsqueda del usuario. */
export function filterToolsForLibrary(tools: Tool[], search: string): Tool[] {
  return tools.filter((tool) => matchesToolQuery(tool, search));
}

/** Herramientas del estudio para un medio; el Editor entra solo en la pestaña Imagen. */
export function filterToolsForMedia(tools: Tool[], media: MediaType): Tool[] {
  return tools.filter((tool) => tool.category === media || (media === "Imagen" && tool.category === "Editor"));
}

/** Selección del estudio: herramientas del medio, limitadas a `limit` tarjetas. */
export function studioTools(tools: Tool[], media: MediaType, limit = 4): Tool[] {
  return filterToolsForMedia(tools, media).slice(0, limit);
}

/** Añade un preset al principio, sin duplicados, con tope de `limit` entradas. */
export function addPreset(current: string[], name: string, limit = 6): string[] {
  return [name, ...current.filter((item) => item !== name)].slice(0, limit);
}
