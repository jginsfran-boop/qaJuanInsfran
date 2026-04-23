import { When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Wait, Duration } from '@serenity-js/core';
import { Ensure } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';
import { PublicarImagen } from '../../screenplay/tasks/PublicarImagen';
import { CerrarSesion } from '../../screenplay/tasks/CerrarSesion';
import { PaginaNuevaPublicacion } from '../../ui/PaginaNuevaPublicacion';
import { Interaction } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';

When('publica la imagen {string} con el caption {string}', async function (rutaImagen: string, caption: string) {
  await actorInTheSpotlight().attemptsTo(
    PublicarImagen.conRutaYCaption(rutaImagen, caption),
  );
});


const VerificarPublicacionExitosa = () => Interaction.where(`#actor verifica publicación exitosa y cierra el modal`, async actor => {
  const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
  const nativePage = await (page as unknown as PlaywrightPage).nativePage();

  // Buscamos el texto ignorando mayúsculas/minúsculas y puntuación (sin comillas dobles internas)
  const successMsg = nativePage.locator('text=Se ha compartido tu publicación').first();
  await successMsg.waitFor({ state: 'visible', timeout: 15000 });

  // Buscamos el botón "Listo" para cerrar el modal
  const btnListo = nativePage.locator('button:has-text("Listo"), div[role="button"]:has-text("Listo")').first();
  if (await btnListo.isVisible({ timeout: 5000 }).catch(() => false)) {
    await btnListo.click({ force: true });
  } else {
    // Si no es un botón o div, simplemente buscamos el texto "Listo"
    const textoListo = nativePage.locator('text="Listo"').first();
    await textoListo.click({ force: true });
  }
  
  // Pequeña pausa para dejar que el modal desaparezca completamente antes de ir a cerrar sesión
  await nativePage.waitForTimeout(2000);
});

Then('la imagen debería publicarse exitosamente', async function () {
  await actorInTheSpotlight().attemptsTo(
    VerificarPublicacionExitosa(),
    CerrarSesion.delSistema()
  );
});
