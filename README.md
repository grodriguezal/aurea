# Tilín — Mockup web

Sitio de **Tilín · El oro no se guarda, se mueve.** (antes Aurea)

## Objetivo
Construir una web cálida, clara y confiable que permita a las personas explorar el valor de sus piezas de oro antes de decidir libremente. Diseño basado en el frame «Web» de Figma (nov 2026).

## Prototipo
App web con **Vite + React + TypeScript**, base para las siguientes fases (inicio de sesión, chat con IA, perfil). La página de inicio incluye la marca, «Tu oro tiene valor», el calendario de citas, el proceso («Así de sencillo») y preguntas frecuentes. Los dos personajes de la cabecera son avatares animados de [`bot-avatars`](https://libraries.dev/bots).

**Importante:** Es un mockup de interfaz. No hay cotizaciones vinculantes, ni reservas reales; en modo de prueba no se envía ningún dato. El crédito con garantía queda fuera del lanzamiento.

### Desarrollo
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run lint
```

### Chat de venta
El calendario de la página agenda directamente si hay sesión; si no, guarda joyería, día y hora, pide el WhatsApp y abre el chat con la cita ya elegida (piezas → peso → quilates → precio → confirmar). Los demás CTA llevan a `#/entrar` (código por WhatsApp) y luego a `#/chat`, una conversación guiada: intención → piezas → peso → quilates → precio aproximado → prioridad (→ zona) → joyerías → calendario → confirmación → otros intereses. La conversación se guarda en el navegador y se retoma al volver.

Sin `VITE_API_URL` todo funciona en **modo de prueba**: el código es `123456`, el texto libre se interpreta con palabras clave (`src/chat/parse.ts`) y no se envían mensajes. Con `VITE_API_URL=https://<worker>` la app usa el Worker de Cloudflare; el contrato de endpoints está documentado en `src/lib/api.ts`.

### Estructura
- `src/pages/Home.tsx`: página de inicio.
- `src/pages/SignIn.tsx`, `src/pages/Chat.tsx`: acceso con WhatsApp y chat.
- `src/chat/`: guion del chat (`flow.ts`), textos y opciones (`labels.ts`), intérprete local (`parse.ts`).
- `src/components/chat/`: tarjetas (precio, joyerías, cita) y controles de cada paso.
- `src/data/stores.ts`: joyerías del chat (de ejemplo hasta cargar las aliadas); `src/lib/pricing.ts`: precios, ranking y horarios.
- `src/components/home/`: secciones (cabecera, tu oro tiene valor, citas, proceso, preguntas, pie).
- `src/components/Characters.tsx`: personajes (avatares animados y versiones estáticas).

### Publicación
`.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main` (requiere *Settings → Pages → Source: GitHub Actions*).

## Identidad
Paleta #FBE87A, #FFFFFF, #424040, #707070, #FBFBF7. Tipografías Fraunces 72pt SuperSoft (titulares), Space Grotesk (texto e interfaz) y BBH Bartle (logotipo), cargadas desde Google Fonts. Personajes: los dos blobs morados (corona y estela de puntos), exportados desde Figma.

## Por implementar
- Sustitución por los archivos PNG maestros del ZIP visual.
- Motor de valoración orientativa con precios y condiciones verificadas.
- Directorio de joyerías aliadas (`src/data/stores.ts`).
- Worker de Cloudflare + D1 con Gemini y WhatsApp Cloud API (ver contrato en `src/lib/api.ts`).
- Políticas legales y de privacidad, analítica y pruebas de accesibilidad.
