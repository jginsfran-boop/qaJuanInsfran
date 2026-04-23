import { Task, Interaction, Wait, Duration } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';
import { PaginaDeLogin } from '../../ui/PaginaDeLogin';

// Simula tipeo humano con delay entre teclas para evitar detección anti-bot de Instagram
const EscribirComoHumano = (selector: string, texto: string, descripcion: string) =>
  Interaction.where(`#actor escribe "${descripcion}" simulando tipeo humano`, async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();
    const campo = nativePage.locator(selector);
    await campo.click();
    await campo.clear();
    // 80ms entre teclas imita la velocidad de un humano promedio
    await campo.pressSequentially(texto, { delay: 80 });
  });

export const IniciarSesion = {
  conCredenciales: (usuario: string, contrasena: string) =>
    Task.where(`#actor inicia sesión como ${usuario}`,
      // Pausa inicial: asegura que la página y sus eventos JS estén listos
      Wait.for(Duration.ofMilliseconds(800)),
      EscribirComoHumano('input[name="email"], input[name="username"]', usuario, 'usuario'),
      // Pausa entre campos: comportamiento natural de un humano pasando al siguiente campo
      Wait.for(Duration.ofMilliseconds(500)),
      EscribirComoHumano('input[name="pass"], input[name="password"]', contrasena, 'contraseña'),
      Wait.for(Duration.ofMilliseconds(400)),
      Click.on(PaginaDeLogin.botonIniciarSesion()),
    ),
};
