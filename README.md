# creative-ai-hub

**LUCID/LAB** (`v0.1`) — un escritorio de prompts para IA generativa que funciona 100% en el navegador: compones un brief (idea, estilo, encuadre, atmósfera, negative prompt), generas el prompt listo para pegar en el proveedor y guardas presets en tu navegador. Incluye un directorio de 10 herramientas externas (imagen, vídeo, voz y música) con notas sobre créditos, licencias y límites.

## Qué hace

- **Estudio**: eliges medio (Imagen / Vídeo / Voz / Música) y compones un prompt profesional a partir de tu idea, estilo, encuadre y atmósfera, con marco de contenido adulto responsable activable.
- **Directorio IA**: catálogo buscable y filtrable de 10 herramientas externas (Hailuo, Kling, Pika, Leonardo, Ideogram, Firefly, ElevenLabs, MiniMax Voice, Suno, Udio) con badges de free tier y avisos prácticos.
- **Guía rápida**: tres pasos para empezar sin GPU ni servidores.
- No ejecuta modelos ni guarda archivos: el texto vive en tu navegador (presets en `localStorage`).

## Stack

React 19 + TypeScript + Vite 7 + Tailwind CSS 4 (UI con Radix/shadcn), Express para servir el build en producción. Gestor de paquetes: pnpm.

## Que contiene

- Lenguaje principal: TypeScript
- Ficheros versionados: 84
- Tamano del repositorio: 0.2 MB

## Estructura


.gitignore/
.gitkeep/
.prettierignore/
.prettierrc/
client/
components.json/
package.json/
patches/
pnpm-lock.yaml/
server/
shared/
template.json/
tsconfig.json/
tsconfig.node.json/
vite.config.ts/


## Tipos de fichero predominantes

| Extension | Ficheros |
|---|---|
| `.tsx` | 62 |
| `.ts` | 7 |
| `.json` | 5 |
| `.gitkeep` | 2 |
| `.yaml` | 1 |
| `.patch` | 1 |
| `.css` | 1 |
| `.prettierignore` | 1 |

## Pila tecnologica

@hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-label, @radix-ui/react-menubar, @radix-ui/react-navigation-menu, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-select, @radix-ui/react-separator, @radix-ui/react-slider, @radix-ui/react-slot, @radix-ui/react-switch, @radix-ui/react-tabs, @radix-ui/react-toggle

## Scripts

bash
npm run dev
npm run build
npm run start
npm run preview
npm run check
npm run test
npm run export
npm run format

> Con pnpm instalado, los comandos equivalentes son `pnpm run <script>`.

## Instalación y uso

```bash
pnpm install          # instala dependencias (lockfile: pnpm-lock.yaml)
pnpm run dev          # servidor de desarrollo en http://localhost:3000
pnpm run build        # build de producción (dist/public + dist/index.js)
pnpm run start        # sirve el build con Express (PORT, por defecto 3000)
pnpm run check        # typecheck de TypeScript (tsc --noEmit)
pnpm run test         # tests con vitest
pnpm run export       # exporta el catálogo a dist/catalog.export.json
```

## Tests

Los tests están en `client/src/lib/prompt.test.ts` (vitest) y cubren la lógica pura de la app:
`composePrompt` (composición del prompt y marco de seguridad), `filterToolsForLibrary`
(búsqueda del directorio), `studioTools` (selección por medio) y `addPreset`
(gestión de presets locales). Ejecución: `pnpm run test`. El CI (`.github/workflows/ci.yml`)
los ejecuta tras el typecheck y antes del build.

## Utilidad

- **Utilidad social:** baja la barrera de entrada a la IA generativa: cualquier persona puede preparar prompts de calidad para imagen, vídeo, voz o música sin instalar modelos ni pagar por probar, y con recordatorios de uso responsable (consentimiento, menores, derechos de autoría).
- **Utilidad comercial:** sirve como pieza de captación y demostración del ecosistema Belentani (licencia MIT); el formato de directorio + compositor es la base de una herramienta de servicio o suscripción, y el catálogo es exportable (`npm run export`) para reutilizarlo en otros productos o integraciones.

## Licencia

MIT — ver [LICENSE](LICENSE).


---

Documento generado en la auditoria del 2026-09-25.
