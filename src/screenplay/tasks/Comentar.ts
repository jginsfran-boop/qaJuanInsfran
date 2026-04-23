import { Task, Wait, Duration, Interaction } from '@serenity-js/core';
import { Click, Enter, TakeScreenshot, isVisible } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { PaginaFeed } from '../../ui/PaginaFeed';
import * as fs from 'fs';

const DumpPageHTML = Interaction.where(
  '#actor dumps page HTML',
  async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as any).nativePage();
    const html = await nativePage.content();
    fs.writeFileSync('page_dump.html', html);
  }
);

const ClicNativoComentar = Interaction.where(
  '#actor hace clic en el botón de comentar nativamente',
  async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as any).nativePage();
    // Esperar a que el SVG exista en el DOM (dentro del feed)
    const locator = nativePage.locator('svg[aria-label="Comentar"], svg[aria-label="Comment"]').first();
    await locator.waitFor({ state: 'attached', timeout: 15_000 });
    // Hacer clic en el contenedor del SVG usando JS para evadir el motor de visibilidad
    await locator.evaluate((svg: any) => {
      const btn = svg.closest('[role="button"], [role="link"], a, button') || svg;
      (btn as any).click();
    });
  }
);

export const Comentar = {
  enLaPrimeraPublicacion: (texto: string) =>
    Task.where(`#actor comenta "${texto}" en la primera publicación`,
      ClicNativoComentar,
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaFeed.campoComentario(), isVisible()),
      Enter.theValue(texto).into(PaginaFeed.campoComentario()),
      TakeScreenshot.of('comentario escrito antes de publicar'),
      Click.on(PaginaFeed.botonPublicarComentario()),
      Wait.for(Duration.ofSeconds(2)),
      TakeScreenshot.of('comentario publicado'),
    ),
};
