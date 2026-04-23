import { Task, Wait, Duration, Interaction } from '@serenity-js/core';
import { Navigate, isVisible } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';
import { PaginaDeLogin } from '../../ui/PaginaDeLogin';
import { IniciarSesion } from './IniciarSesion';

// Instagram redirige a /accounts/onetap/?lsrc=ci tras login exitoso.
// Esta interacción ESPERA esa URL antes de descartar el diálogo "Ahora no".
const DescartarGuardarContrasena = Interaction.where(
  '#actor espera la redirección a onetap y descarta el diálogo de guardar contraseña',
  async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();

    // Espera a que Instagram navegue a /accounts/onetap/ (confirmación de login exitoso)
    await nativePage.waitForURL(/accounts\/onetap/, { timeout: 20_000 });
    await nativePage.waitForLoadState('domcontentloaded');

    // Descarta el diálogo "Ahora no" en la página de onetap
    const btn = nativePage.locator('div[role="button"]:has-text("Ahora no"), div[role="button"]:has-text("Not now")').first();
    try {
      await btn.waitFor({ state: 'visible', timeout: 8_000 });
      await btn.click();
    } catch (e) {
      // Ignorar si no aparece
    }

    // Espera a que redirija de vuelta al feed principal (https://www.instagram.com/)
    await nativePage.waitForURL('https://www.instagram.com/', { timeout: 15_000 });
    await nativePage.waitForLoadState('domcontentloaded');
  },
);

// Popup de notificaciones push que aparece sobre el feed tras el login
const DescartarPopupNotificaciones = Interaction.where(
  '#actor descarta el popup de activar notificaciones',
  async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();
    const btn = nativePage.locator('button:has-text("Ahora no"), button:has-text("Not Now")').first();
    try {
      await btn.waitFor({ state: 'visible', timeout: 6_000 });
      await btn.click();
    } catch (e) {
      // Si no aparece, ignoramos silenciosamente
    }
  },
);

export const Autenticarse = {
  enInstagram: (usuario: string, contrasena: string) =>
    Task.where('#actor se autentica en Instagram',
      Navigate.to('https://www.instagram.com'),
      Wait.upTo(Duration.ofSeconds(15)).until(PaginaDeLogin.campoUsuario(), isVisible()),
      Wait.for(Duration.ofSeconds(2)),
      IniciarSesion.conCredenciales(usuario, contrasena),
      // Espera onetap → descarta diálogo → espera redirección al feed
      DescartarGuardarContrasena,
      // Feed cargando: espera el popup de notificaciones
      Wait.for(Duration.ofSeconds(3)),
      DescartarPopupNotificaciones,
      Wait.for(Duration.ofSeconds(2)),
    ),
};
