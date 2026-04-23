# Automatización Web — Instagram QA Engineer Challenge

Proyecto de pruebas end-to-end para Instagram usando el **patrón Screenplay** con Serenity/JS, Playwright y Cucumber BDD.

## Stack tecnológico

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| TypeScript | ^5.5 | Lenguaje tipado |
| Playwright | ^1.49 | Automatización de browser (Chromium) |
| Serenity/JS | ^3.42 | Framework Screenplay + reportes |
| Cucumber | ^11.0 | BDD / Gherkin runner |
| ts-node | ^10.9 | Ejecución TS sin compilación previa |

## Patrón Screenplay — Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│  GHERKIN (.feature)                                       │
│  Given Juan está autenticado en Instagram                 │
│  When  da me gusta a la primera publicación del feed     │
│  Then  la publicación debería mostrar el me gusta activo │
└───────────────┬──────────────────────────────────────────┘
                │  Cucumber runner mapea a →
┌───────────────▼──────────────────────────────────────────┐
│  STEP DEFINITIONS (feed.steps.ts)                         │
│  Given → actor.attemptsTo(Autenticarse.enInstagram(...)) │
│  When  → actor.attemptsTo(DarMeGusta.alaUltimPublicacion│
│  Then  → actor.attemptsTo(Ensure.that(elemento, isVisible│
└───────────────┬──────────────────────────────────────────┘
                │  Tasks componen →
┌───────────────▼──────────────────────────────────────────┐
│  TASKS (screenplay/tasks/)                                │
│  DarMeGusta                                              │
│    ├─ Wait.upTo(5s).until(botonMeGusta, isVisible())     │
│    ├─ TakeScreenshot.of('estado previo al me gusta')     │
│    ├─ Click.on(PaginaFeed.botonMeGusta())                │
│    └─ TakeScreenshot.of('me gusta dado')                 │
└───────────────┬──────────────────────────────────────────┘
                │  Interactions sobre →
┌───────────────▼──────────────────────────────────────────┐
│  PAGE ELEMENTS (ui/)                                      │
│  PaginaFeed.botonMeGusta()                               │
│  → By.xpath('(//article//button[.//svg[...]])[1]')       │
└──────────────────────────────────────────────────────────┘
```

## Estructura del proyecto

```
automatizacionWeb/
├── features/
│   ├── autenticacion/
│   │   └── login.feature          # CP001, CP002
│   ├── interacciones/
│   │   ├── me-gusta.feature       # CP003
│   │   └── comentar.feature       # CP004
│   └── publicacion/
│       └── nueva-publicacion.feature  # CP005
├── src/
│   ├── ui/
│   │   ├── PaginaDeLogin.ts       # Selectores del login
│   │   ├── PaginaFeed.ts          # Selectores del feed
│   │   └── PaginaNuevaPublicacion.ts  # Selectores del flujo de publicación
│   ├── screenplay/
│   │   ├── tasks/
│   │   │   ├── Autenticarse.ts    # Navigate + login + esperar feed
│   │   │   ├── IniciarSesion.ts   # Ingresar credenciales + submit
│   │   │   ├── CerrarSesion.ts    # Settings → Salir
│   │   │   ├── DarMeGusta.ts      # Like a la primera publicación
│   │   │   ├── Comentar.ts        # Comentar en la primera publicación
│   │   │   └── PublicarImagen.ts  # Subir imagen + caption + compartir
│   │   └── questions/
│   │       ├── UrlActual.ts       # URL de la página actual
│   │       ├── MensajeDeError.ts  # Texto del error de login
│   │       └── EstadoMeGusta.ts   # Botón "Ya no me gusta" (activo)
│   └── support/
│       ├── actores.ts             # Cast de actores con BrowseTheWebWithPlaywright
│       ├── datos.ts               # Carga data/info.json o env vars
│       ├── hooks.ts               # BeforeAll / Before / After / AfterAll
│       ├── parametros.ts          # defineParameterType {actor}
│       └── steps/
│           ├── autenticacion.steps.ts
│           ├── feed.steps.ts
│           └── publicacion.steps.ts
├── data/
│   ├── info.example.json          # Plantilla de credenciales
│   ├── info.json                  # Credenciales reales (GITIGNORED)
│   └── test-image.png             # Imagen para CP005
├── cucumber.js                    # Config Cucumber + Serenity/JS + Photographer
├── tsconfig.json
└── package.json
```

## Casos de prueba

| ID | Feature | Descripción | Tipo |
|----|---------|-------------|------|
| CP001 | Autenticación | Login exitoso con credenciales válidas | Scenario |
| CP002 | Autenticación | Login fallido con 2 pares de credenciales inválidas | Scenario Outline |
| CP003 | Me Gusta | Dar me gusta a la primera publicación del feed | Scenario |
| CP004 | Comentarios | Comentar en la primera publicación (2 textos distintos) | Scenario Outline |
| CP005 | Publicación | Subir imagen con caption y publicar | Scenario |
| CP006 | Eliminar Publicación | Eliminar la primera publicación del perfil | Scenario |
| CP007 | Sugerencias | Seguir a 1 usuario sugerido desde el feed | Scenario |

**Total: 7 escenarios (8 casos de prueba ejecutables) — 32 steps**

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
npx playwright install chromium
```

### 2. Configurar credenciales

**Opción A — Archivo local:**
```bash
cp data/info.example.json data/info.json
```
Editar `data/info.json` con credenciales reales de Instagram.

**Opción B — Variables de entorno (CI/CD):**
```bash
export USUARIO_VALIDO="tu_usuario"
export CONTRASENA_VALIDA="tu_contraseña"
```

## Ejecución de pruebas

```bash
# Todos los escenarios
npm test

# Con navegador visible (debugging)
npm run test:headed

# Por caso de prueba específico
npm run test:cp001    # Login exitoso
npm run test:cp002    # Login fallido
npm run test:cp003    # Me gusta (tag: @CP003)
npm run test:cp004    # Comentar (tag: @CP004)
npm run test:cp005    # Publicar imagen (tag: @CP005)

# Dry-run (verificar steps sin ejecutar)
npx cucumber-js --dry-run
```

## Reportes y evidencias

Al ejecutar `npm test` se generan automáticamente:

| Artefacto | Ruta | Descripción |
|-----------|------|-------------|
| Reporte HTML | `reports/cucumber-report.html` | Todos los escenarios con resultado y duración |
| Screenshots de fallos | `reports/screenshots/` | Captura automática en cada fallo (via Photographer) |
| Screenshots en tasks | `reports/screenshots/` | Capturas manuales en DarMeGusta, Comentar, PublicarImagen |

Para abrir el reporte HTML:
```bash
start reports/cucumber-report.html   # Windows
open reports/cucumber-report.html    # macOS/Linux
```

## CI/CD — GitHub Actions

El workflow `.github/workflows/playwright.yml` se ejecuta en cada `push` o `pull_request` a `main`/`master`.

**Configurar Secrets en GitHub:**
```
Settings → Secrets and variables → Actions → New repository secret
  USUARIO_VALIDO    = tu_usuario_de_instagram
  CONTRASENA_VALIDA = tu_contraseña
```

El workflow sube el reporte HTML como artefacto con retención de 30 días.

## Serenity/JS — Conceptos clave

| Concepto | Clase | Responsabilidad |
|----------|-------|----------------|
| **Actor** | `Actor` (`@serenity-js/core`) | Quién realiza las acciones (Juan, Ana) |
| **Ability** | `BrowseTheWebWithPlaywright` | Qué puede hacer el actor (usar el browser) |
| **Task** | `Task.where(...)` | Objetivo de negocio (IniciarSesion, DarMeGusta) |
| **Interaction** | `Click`, `Enter`, `Navigate` | Acción atómica sobre la UI |
| **Question** | `Page.current().url()` | Consulta sobre el estado del sistema |
| **Expectation** | `isVisible()`, `includes()` | Condición para Wait o Ensure |

## Notas importantes

- `Wait.upTo(Duration).until(elemento, condición)` — timeout en Serenity/JS 3.42
- `Enter.theValue(v).into(elemento)` — no existe `Fill` en v3.42
- `Page.current().url().as(url => url.href)` — la URL es un objeto `URL`, no `string`
- `nativePage()` en `PublicarImagen.ts` da acceso al `Page` nativo de Playwright para el file chooser
- Los actores deben iniciar con mayúscula en Gherkin: `Juan`, `Ana`
