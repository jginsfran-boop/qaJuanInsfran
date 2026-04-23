# CLAUDE.md — Automatización Web: Instagram BDD

Proyecto de pruebas end-to-end con **patrón Screenplay**, implementado en TypeScript usando Serenity/JS + Playwright + Cucumber.

## Stack tecnológico

| Capa | Herramienta | Versión |
|------|------------|---------|
| Lenguaje | TypeScript | ^5.5 |
| Runner BDD | `@cucumber/cucumber` | ^11.0 |
| Automatización | `@playwright/test` (Chromium) | ^1.49 |
| Patrón Screenplay | `@serenity-js/core` | ^3.42 |
| Integración web | `@serenity-js/web` | ^3.42 |
| Integración Playwright | `@serenity-js/playwright` | ^3.42 |
| Integración Cucumber | `@serenity-js/cucumber` | ^3.42 |
| Aserciones | `@serenity-js/assertions` | ^3.42 |
| Reporte consola | `@serenity-js/console-reporter` | ^3.42 |
| Ejecución TS | `ts-node` | ^10.9 |

## Estructura del proyecto

```
automatizacionWeb/
├── features/
│   ├── autenticacion/
│   │   └── login.feature               # CP001, CP002
│   ├── interacciones/
│   │   ├── me-gusta.feature            # CP003
│   │   └── comentar.feature            # CP004
│   └── publicacion/
│       └── nueva-publicacion.feature   # CP005
├── src/
│   ├── ui/
│   │   ├── PaginaDeLogin.ts            # Selectores del login de Instagram
│   │   ├── PaginaFeed.ts               # Selectores del feed (likes, comentarios)
│   │   └── PaginaNuevaPublicacion.ts   # Selectores del flujo de nueva publicación
│   ├── screenplay/
│   │   ├── tasks/
│   │   │   ├── Autenticarse.ts         # Navigate + login + esperar feed
│   │   │   ├── IniciarSesion.ts        # Enter credentials + Click submit
│   │   │   ├── CerrarSesion.ts         # Click settings + Click logout
│   │   │   ├── DarMeGusta.ts           # Wait + TakeScreenshot + Click like
│   │   │   ├── Comentar.ts             # Click icon + Enter text + Press Enter
│   │   │   └── PublicarImagen.ts       # FileChooser + Siguiente×2 + Caption + Compartir
│   │   └── questions/
│   │       ├── UrlActual.ts            # Page.current().url()
│   │       ├── MensajeDeError.ts       # Text.of(mensajeDeError)
│   │       └── EstadoMeGusta.ts        # PaginaFeed.botonYaNoMeGusta()
│   └── support/
│       ├── actores.ts                  # Cast: BrowseTheWebWithPlaywright
│       ├── datos.ts                    # Carga info.json o env vars
│       ├── hooks.ts                    # BeforeAll/Before/After/AfterAll
│       ├── parametros.ts               # {actor} parameter type
│       └── steps/
│           ├── autenticacion.steps.ts  # CP001, CP002 steps
│           ├── feed.steps.ts           # CP003, CP004 steps
│           └── publicacion.steps.ts    # CP005 steps
├── data/
│   ├── info.example.json               # Plantilla (en repo)
│   ├── info.json                       # Credenciales reales (GITIGNORED)
│   └── test-image.png                  # Imagen para CP005 (en repo)
├── cucumber.js                         # Cucumber + Serenity + Photographer
├── tsconfig.json
├── package.json
└── .github/workflows/playwright.yml    # CI/CD GitHub Actions
```

## Casos de prueba

| ID | Feature | Descripción | Tipo |
|----|---------|-------------|------|
| CP001 | autenticacion | Login exitoso con credenciales válidas | Scenario |
| CP002 | autenticacion | Login fallido con credenciales inválidas | Scenario Outline (2 filas) |
| CP003 | interacciones | Dar me gusta a la primera publicación | Scenario |
| CP004 | interacciones | Comentar en la primera publicación | Scenario Outline (2 filas) |
| CP005 | publicacion | Publicar una imagen con caption | Scenario |

**Dry-run de referencia:** 7 scenarios, 22 steps

## Comandos

```bash
npm install && npx playwright install chromium  # setup inicial
npm test                     # todos los escenarios
npm run test:headed           # con navegador visible
npm run test:cp001            # solo CP001
npm run test:cp002            # solo CP002
npx cucumber-js --tags @CP003 # solo CP003
npx cucumber-js --tags @CP004 # solo CP004
npx cucumber-js --tags @CP005 # solo CP005
npm run clean                 # limpiar artefactos
```

## Patrón Screenplay — Jerarquía de responsabilidades

```
Actor (Juan / Ana)
  └── Ability: BrowseTheWebWithPlaywright.using(browser)
        └── Task: objetivo de negocio
              ├── IniciarSesion.conCredenciales(u, p)
              ├── CerrarSesion.delSistema()
              ├── Autenticarse.enInstagram(u, p)
              ├── DarMeGusta.alaUltimPublicacion()
              ├── Comentar.enLaPrimeraPublicacion(texto)
              └── PublicarImagen.conRutaYCaption(ruta, caption)
                    └── Interaction: acción atómica
                          ├── Navigate.to(url)
                          ├── Enter.theValue(v).into(element)
                          ├── Click.on(element)
                          ├── Press.the(Key.Enter).in(element)
                          ├── TakeScreenshot.of('descripción')
                          └── SubirArchivo(ruta) [Interaction custom]
                                └── nativePage.waitForEvent('filechooser')
```

## Notas de API — Serenity/JS 3.42.x

| Lo que NO funciona | Lo correcto |
|-------------------|-------------|
| `Fill.in(el).with(v)` | `Enter.theValue(v).into(el)` |
| `import { Wait } from '@serenity-js/web'` | `import { Wait } from '@serenity-js/core'` |
| `Wait.until(el, cond).withTimeout(d)` | `Wait.upTo(d).until(el, cond)` |
| `ability.browserContext()` | `ability.discard()` |
| `Page.current().url()` como `string` | `.as(url => url.href)` |
| `isVisible(elemento)` como Question | `isVisible()` es condición, el elemento va en `Ensure.that(el, isVisible())` |
| `import { isPresent } from '@serenity-js/web'` | `isPresent` está en `@serenity-js/assertions` |

## Cómo agregar un nuevo escenario

### 1. Feature file
```gherkin
# features/nueva-area/mi-test.feature
@CP006 @nueva-funcionalidad
Scenario: CP006 - Descripción del caso
  Given Juan está autenticado en Instagram
  When realiza alguna acción
  Then debería ocurrir el resultado esperado
```

### 2. Selectores (si son nuevos)
```typescript
// src/ui/PaginaNueva.ts
export const PaginaNueva = {
  miElemento: () =>
    PageElement.located(By.css('#selector'))
      .describedAs('descripción del elemento'),
};
```

### 3. Task (si es nueva)
```typescript
// src/screenplay/tasks/MiNuevaTarea.ts
export const MiNuevaTarea = {
  ejecutar: () =>
    Task.where('#actor ejecuta la nueva tarea',
      Click.on(PaginaNueva.miElemento()),
      TakeScreenshot.of('resultado'),
    ),
};
```

### 4. Steps
```typescript
// src/support/steps/mi-feature.steps.ts
When('realiza alguna acción', async function () {
  await actorInTheSpotlight().attemptsTo(MiNuevaTarea.ejecutar());
});
```

## Screenshots y reportes

- **Automáticos en fallos**: configurado via `Photographer(new TakePhotosOfFailures())` en `cucumber.js`
- **Manuales en tasks**: `TakeScreenshot.of('descripción')` dentro de DarMeGusta, Comentar y PublicarImagen
- **Reporte HTML**: `reports/cucumber-report.html` generado tras cada ejecución
- **Artefactos**: `reports/screenshots/`

## Selectores de Instagram usados

| Página | Elemento | Estrategia |
|--------|----------|-----------|
| Login | Campo usuario | `By.css('input[name="email"]')` |
| Login | Campo contraseña | `By.css('input[name="pass"]')` |
| Login | Botón login | `By.css('button[type="submit"]')` |
| Login | Mensaje error | `By.css('div[role="alert"], #slfErrorAlert')` |
| Feed | Botón Me gusta | `By.xpath('(//article//button[.//svg[@aria-label="Me gusta"]])[1]')` |
| Feed | Botón comentar | `By.xpath('(//article//button[.//svg[@aria-label="Comentar"]])[1]')` |
| Feed | Campo comentario | `By.css('article form textarea')` |
| Nueva pub. | Botón siguiente | `By.xpath('//div[@role="dialog"]//button[text()="Siguiente"]')` |
| Nueva pub. | Campo caption | `By.css('div[aria-label="Escribe un pie de foto..."]')` |
| Nueva pub. | Botón compartir | `By.xpath('//div[@role="dialog"]//button[text()="Compartir"]')` |
