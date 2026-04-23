import { Task, Wait, Duration, Interaction } from '@serenity-js/core';
import { Click, Enter, TakeScreenshot, isVisible } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';
import { PaginaNuevaPublicacion } from '../../ui/PaginaNuevaPublicacion';
import * as path from 'path';

const SubirArchivo = (rutaArchivo: string) =>
  Interaction.where(`#actor sube el archivo "${path.basename(rutaArchivo)}"`, async actor => {
    const session = BrowseTheWebWithPlaywright.as(actor);
    const page = await session.currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();

    // Paso 1: Click en el ícono "Nueva publicación" (+)
    const btnCrear = nativePage.locator('svg[aria-label="Nueva publicación"], svg[aria-label="New post"]').first();
    await btnCrear.waitFor({ state: 'visible', timeout: 10_000 });
    await btnCrear.click();

    // Paso 2: El modal a veces se abre directamente, a veces abre un menú.
    // Usamos una coincidencia de texto parcial "Seleccionar" o "Select"
    const btnSeleccionar = nativePage.locator('button:has-text("Seleccionar"), button:has-text("Select")').first();

    try {
      // Esperamos a ver si el botón del modal ya aparece directamente
      await btnSeleccionar.waitFor({ state: 'visible', timeout: 4_000 });
    } catch (e) {
      // Si no apareció, puede que estemos en el menú desplegable.
      // Click en la opción del menú
      const opcionMenu = nativePage.locator('a[href="#"]:has-text("Publicación"), a:has-text("Post")').first();
      if (await opcionMenu.isVisible()) {
          await opcionMenu.click({ force: true });
      } else {
          // Fallback al span si es que el a no funciona
          const spanMenu = nativePage.locator('span:has-text("Publicación"), span:has-text("Post")').first();
          await spanMenu.click({ force: true });
      }
      
      // Ahora sí debe aparecer el modal
      await btnSeleccionar.waitFor({ state: 'visible', timeout: 10_000 });
    }

    // Paso 3: Abrir el selector de archivos
    const [fileChooser] = await Promise.all([
      nativePage.waitForEvent('filechooser'),
      btnSeleccionar.click({ force: true }),
    ]);
    await fileChooser.setFiles(path.resolve(rutaArchivo));
  });

export const PublicarImagen = {
  conRutaYCaption: (rutaImagen: string, caption: string) =>
    Task.where(`#actor publica la imagen "${path.basename(rutaImagen)}"`,
      TakeScreenshot.of('feed antes de publicar'),
      SubirArchivo(rutaImagen),

      // Paso 2: recorte → Siguiente
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaNuevaPublicacion.botonSiguiente(), isVisible()),
      TakeScreenshot.of('imagen cargada - paso recorte'),
      Click.on(PaginaNuevaPublicacion.botonSiguiente()),

      // Paso 3: filtros → Siguiente
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaNuevaPublicacion.botonSiguiente(), isVisible()),
      TakeScreenshot.of('paso filtros'),
      Click.on(PaginaNuevaPublicacion.botonSiguiente()),

      // Paso 4: caption
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaNuevaPublicacion.campoPieDeImagen(), isVisible()),
      Enter.theValue(caption).into(PaginaNuevaPublicacion.campoPieDeImagen()),
      TakeScreenshot.of('caption escrito'),

      // Publicar
      Click.on(PaginaNuevaPublicacion.botonCompartir()),
      TakeScreenshot.of('publicando (antes de verificación)'),
    ),
};
