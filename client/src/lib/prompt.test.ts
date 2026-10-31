import { describe, expect, it } from "vitest";
import catalog from "@/data/catalog.json";
import { addPreset, composePrompt, filterToolsForLibrary, studioTools, type Tool } from "@/lib/prompt";

const tools = catalog.tools as Tool[];
const starterIdeas = catalog.starterIdeas;

describe("composePrompt", () => {
  it("compone el prompt con el brief del usuario", () => {
    const prompt = composePrompt({
      media: "Vídeo",
      idea: "Un gato astronauta flota sobre la ciudad",
      style: "3D de autor",
      framing: "16:9 panorámico",
      mood: "Luminoso",
      negative: "borroso",
      adultSafe: true,
    });
    expect(prompt).toContain("Un gato astronauta flota sobre la ciudad");
    expect(prompt).toContain("Format: Vídeo");
    expect(prompt).toContain("Style: 3D de autor");
    expect(prompt).toContain("Framing and technical direction: 16:9 panorámico");
    expect(prompt).toContain("Mood: Luminoso");
    expect(prompt).toContain("Avoid: borroso.");
    expect(prompt).toContain("adult-only subject");
  });

  it("usa el marco general cuando el modo adulto está apagado", () => {
    const prompt = composePrompt({
      media: "Imagen",
      idea: "retrato",
      style: "s",
      framing: "f",
      mood: "m",
      negative: "n",
      adultSafe: false,
    });
    expect(prompt).toContain("keep the content suitable for a general audience");
    expect(prompt).not.toContain("adult-only subject");
  });

  it("recorta la idea y cae en la idea inicial del medio cuando está vacía", () => {
    const prompt = composePrompt({
      media: "Voz",
      idea: "   ",
      style: "s",
      framing: "f",
      mood: "m",
      negative: "n",
      adultSafe: true,
      fallbackIdea: starterIdeas["Voz"],
    });
    expect(prompt).toContain(starterIdeas["Voz"]);
    expect(prompt.startsWith(` ${starterIdeas["Voz"]}`)).toBe(false);
  });
});

describe("filterToolsForLibrary", () => {
  it("devuelve el catálogo completo sin búsqueda", () => {
    expect(filterToolsForLibrary(tools, "")).toHaveLength(10);
  });

  it("encuentra por nombre (sin distinguir mayúsculas)", () => {
    expect(filterToolsForLibrary(tools, "kling").map((tool) => tool.name)).toEqual(["Kling AI"]);
  });

  it("encuentra por categoría", () => {
    const musica = filterToolsForLibrary(tools, "música");
    expect(musica.length).toBeGreaterThan(0);
    expect(musica.every((tool) => tool.category === "Música")).toBe(true);
  });

  it("devuelve vacío cuando nada coincide", () => {
    expect(filterToolsForLibrary(tools, "zzz-sin-coincidencia")).toHaveLength(0);
  });
});

describe("studioTools", () => {
  it("para Imagen incluye el Editor y limita a 4 tarjetas", () => {
    const seleccion = studioTools(tools, "Imagen");
    expect(seleccion.length).toBeLessThanOrEqual(4);
    expect(seleccion.every((tool) => tool.category === "Imagen" || tool.category === "Editor")).toBe(true);
    expect(seleccion.some((tool) => tool.category === "Editor")).toBe(true);
  });

  it("para otros medios devuelve solo herramientas de ese medio, sin el Editor", () => {
    expect(studioTools(tools, "Vídeo").map((tool) => tool.name)).toEqual(["Hailuo / MiniMax", "Kling AI", "Pika"]);
    expect(studioTools(tools, "Música").every((tool) => tool.category === "Música")).toBe(true);
  });
});

describe("addPreset", () => {
  it("añade el preset nuevo al principio", () => {
    expect(addPreset(["b"], "a")).toEqual(["a", "b"]);
  });

  it("evita duplicados moviendo el existente al frente", () => {
    expect(addPreset(["a", "b"], "a")).toEqual(["a", "b"]);
  });

  it("respeta el tope de 6 presets guardados", () => {
    const result = addPreset(["1", "2", "3", "4", "5", "6"], "7");
    expect(result).toEqual(["7", "1", "2", "3", "4", "5"]);
    expect(result).toHaveLength(6);
  });
});
