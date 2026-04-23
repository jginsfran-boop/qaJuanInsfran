import { Cast, Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import type { Page } from '@playwright/test';

// Recibe una Page de Playwright ya creada (contexto fresco por escenario).
// Todos los actores de un mismo escenario comparten esa página.
export class Actores implements Cast {
  constructor(private readonly page: Page) {}

  prepare(actor: Actor): Actor {
    return actor.whoCan(
      BrowseTheWebWithPlaywright.usingPage(this.page),
    );
  }
}
