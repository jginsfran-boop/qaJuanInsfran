import { By, PageElement } from '@serenity-js/web';

export const PaginaDeLogin = {
  campoUsuario: () =>
    PageElement.located(By.css('input[name="username"], input[name="email"]'))
      .describedAs('campo de nombre de usuario'),

  campoContrasena: () =>
    PageElement.located(By.css('input[name="password"], input[name="pass"]'))
      .describedAs('campo de contraseña'),

  // Selector exacto obtenido del DOM real de Instagram (aria-label exacto)
  botonIniciarSesion: () =>
    PageElement.located(By.css('div[role="button"][aria-label="Iniciar sesión"], button[aria-label="Iniciar sesión"]'))
      .describedAs('botón Iniciar sesión'),

  iconoConfiguracion: () =>
    PageElement.located(By.css('svg[aria-label="Configuración"], svg[aria-label="Settings"], svg[aria-label="Más"], svg[aria-label="Menú"]'))
      .describedAs('ícono de Configuración o Más'),

  botonSalir: () =>
    PageElement.located(By.xpath('//span[text()="Salir" or text()="Log out"]'))
      .describedAs('opción Salir del menú'),

  // [1] selecciona el primer div con el texto de error (Instagram usa CSS-in-JS)
  mensajeDeError: () =>
    PageElement.located(By.xpath(
      '(//form//div[contains(normalize-space(.), "incorrecta") or contains(normalize-space(.), "incorrect")])[1]'
    ))
      .describedAs('mensaje de error de autenticación'),
};
