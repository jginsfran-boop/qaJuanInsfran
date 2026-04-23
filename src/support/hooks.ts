import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { Actores } from './actores';

// 60 segundos por step: suficiente para navegación + interacciones de Instagram
setDefaultTimeout(60_000);

let browser: Browser;

BeforeAll({ timeout: 30_000 }, async function () {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    // 300ms en headed para no saturar Instagram con acciones demasiado rápidas
    slowMo: process.env.HEADLESS === 'false' ? 300 : 0,
  });
});

// Contexto fresco por escenario → aislamiento de cookies y sesión
Before({ timeout: 15_000 }, async function () {
  const context = await browser.newContext({
    locale: 'es-ES',
    extraHTTPHeaders: { 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  const page = await context.newPage();
  engage(new Actores(page));
});

// No cerramos el contexto aquí para evitar conflictos con el ciclo de actores
// de Serenity/JS. AfterAll cierra el browser (y todos sus contextos) al final.
After({ timeout: 10_000 }, async function () {
  // Cleanup intencional delegado a AfterAll
});

AfterAll({ timeout: 30_000 }, async function () {
  await browser?.close();
});
