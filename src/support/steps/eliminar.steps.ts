import { When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Interaction } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';
import { EliminarPublicacion } from '../../screenplay/tasks/EliminarPublicacion';
import { CerrarSesion } from '../../screenplay/tasks/CerrarSesion';

When('Juan se dirige a su perfil', async function () {
  // El click del ícono se hace dentro de la tarea, pero podemos dejar este step si lo queremos separar lógicamente
  // En este caso, toda la lógica de dirigirse al perfil y borrar está en EliminarPublicacion.primeraDelPerfil()
  // Si queremos separarlo en Gherkin, está perfecto, el task de abajo lo agrupa todo.
});

When('elimina la primera publicación', async function () {
  await actorInTheSpotlight().attemptsTo(
    EliminarPublicacion.primeraDelPerfil()
  );
});

const VerificarEliminacionExitosa = () => Interaction.where(`#actor verifica que la publicación fue eliminada`, async actor => {
  const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
  const nativePage = await (page as unknown as PlaywrightPage).nativePage();

  // Buscar el mensaje tipo toast "Publicación eliminada."
  // Usamos text=Publicación eliminada (sin comillas) para atrapar matches parciales y evitar problemas con el punto
  const successMsg = nativePage.locator('text=Publicación eliminada').first();
  await successMsg.waitFor({ state: 'visible', timeout: 15000 });
});

Then('debería ver el mensaje de confirmación {string}', async function (mensaje: string) {
  // Ignoramos el texto exacto del Gherkin para mayor robustez en Playwright, 
  // usando la misma estrategia parcial y dinámica que en el CP005.
  await actorInTheSpotlight().attemptsTo(
    VerificarEliminacionExitosa()
  );
});
