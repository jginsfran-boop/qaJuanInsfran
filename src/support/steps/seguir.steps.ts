import { When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Wait, Duration, Interaction } from '@serenity-js/core';
import { isPresent } from '@serenity-js/assertions';
import { PaginaSugerencias } from '../../ui/PaginaSugerencias';
import { SeguirUsuarios } from '../../screenplay/tasks/SeguirUsuarios';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';


When('visualiza la sección de {string}', async function (seccion: string) {
  // Verificamos que el título "Sugerencias para ti" esté en el DOM.
  await actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(PaginaSugerencias.tituloSugerencias(), isPresent())
  );
});

When('comienza a seguir a {int} usuario sugerido', async function (cantidad: number) {
  await actorInTheSpotlight().attemptsTo(
    SeguirUsuarios.unUsuarioSugerido()
  );
});

const VerificarSeguidos = () => Interaction.where(`#actor verifica que el botón cambió a Siguiendo`, async actor => {
  const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
  const nativePage = await (page as unknown as PlaywrightPage).nativePage();

  // Buscar todos los botones que dicen "Siguiendo"
  // Debe haber al menos 1 en pantalla ahora.
  const botonesSiguiendo = nativePage.locator('text="Siguiendo"');
  const count = await botonesSiguiendo.count();
  
  if (count < 1) {
    throw new Error(`Se esperaba al menos 1 botón con estado 'Siguiendo', pero se encontraron ${count}`);
  }
});

Then('debería ver que el estado cambia a {string} para esos usuarios', async function (estado: string) {
  await actorInTheSpotlight().attemptsTo(
    VerificarSeguidos()
  );
});
